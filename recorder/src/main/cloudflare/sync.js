'use strict';
// S8: Cloudflare sync layer (ADR-004).
// Handles R2 uploads via pre-signed URLs, Queues dispatch, and
// DistributionCoordinator Durable Object for idempotent resume.
//
// Setup required (not built in proxy-restricted env):
//   1. CLOUDFLARE_WORKER_URL in env or settings
//   2. CLOUDFLARE_API_TOKEN with R2 + Worker + Queues permissions
//   3. Deploy workers/dist-coordinator.js to Cloudflare Workers
//
// Architecture:
//   desktop --[HTTPS]--> Worker /auth        (verify token, return session)
//   desktop --[HTTPS]--> Worker /presign     (get R2 pre-signed PUT URL)
//   desktop --[PUT]----> R2 pre-signed URL   (upload file bytes)
//   desktop --[HTTPS]--> Worker /queue       (enqueue distribution job)
//   Worker  --[Queue]--> DistributionCoordinator DO (tracks progress, retries)

const https    = require('https');
const fs       = require('fs');
const db       = require('../db/sqlite');
const settings = require('../settings');
const { getDeviceId } = require('../identity');

function getWorkerUrl() {
  return process.env.CLOUDFLARE_WORKER_URL || settings.get().cloudflare?.workerUrl || null;
}

function getApiToken() {
  return process.env.CLOUDFLARE_API_TOKEN || settings.get().cloudflare?.apiToken || null;
}

/**
 * Request a pre-signed R2 PUT URL from the Worker.
 * @param {string} r2Key   e.g. rec-{uuid}.mp4
 * @param {string} mimeType
 * @returns {Promise<{presignedUrl: string, expiresAt: string}>}
 */
async function getPresignedUrl(r2Key, mimeType, signal) {
  const baseUrl = getWorkerUrl();
  const token   = getApiToken();
  if (!baseUrl || !token) throw new Error('Cloudflare not configured (CLOUDFLARE_WORKER_URL / CLOUDFLARE_API_TOKEN missing)');

  const body = JSON.stringify({ key: r2Key, mimeType, deviceId: getDeviceId() });
  return jsonPost(`${baseUrl}/presign`, body, token, signal);
}

/**
 * Upload a local file to R2 using the pre-signed URL.
 * Updates distributions.status = 'uploading' -> 'uploaded'.
 * @param {string} filePath
 * @param {string} presignedUrl
 * @param {string} mimeType
 * @param {function} [onProgress]  called with fraction 0-1
 * @param {AbortSignal} [signal]   task #54: cancel an upload in flight
 */
// Fix #8: async stat — avoids blocking the Node.js event loop
async function uploadToR2(filePath, presignedUrl, mimeType, onProgress, signal) {
  if (signal && signal.aborted) throw new DOMException('Upload canceled', 'AbortError');
  const stat = await fs.promises.stat(filePath);
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    let uploaded = 0;

    fileStream.on('data', chunk => {
      uploaded += chunk.length;
      if (onProgress) onProgress(uploaded / stat.size);
    });
    // The request's own `signal` option aborts the socket, but a stream
    // already piping into it needs its own close or it leaks a read handle
    // on the (now pointless) local file.
    fileStream.on('error', () => {}); // destroy() below triggers this; already handled via req's abort
    if (signal) signal.addEventListener('abort', () => fileStream.destroy(), { once: true });

    const url = new URL(presignedUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 443, // a presigned URL with a non-default port used to connect to :443 anyway
      path: url.pathname + url.search,
      method: 'PUT',
      headers: {
        'Content-Length': stat.size,
        'Content-Type': mimeType,
      },
      signal,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ statusCode: res.statusCode });
        else reject(new Error(`R2 upload failed: HTTP ${res.statusCode} — ${body.slice(0, 200)}`));
      });
    });
    req.on('error', reject); // signal abort surfaces here as an AbortError
    fileStream.pipe(req);
  });
}

/**
 * Enqueue a distribution job via the Worker -> Queue -> DO pipeline.
 * @param {object} job  { distributionId, recordingId, r2Key, packageId, platform }
 */
async function enqueueDistribution(job, signal) {
  const baseUrl = getWorkerUrl();
  const token   = getApiToken();
  if (!baseUrl || !token) throw new Error('Cloudflare not configured');

  const body = JSON.stringify({ ...job, deviceId: getDeviceId() });
  return jsonPost(`${baseUrl}/queue`, body, token, signal);
}

/**
 * Full upload + enqueue flow for a distribution row.
 * Fix #17: per-stage error recovery — on failure writes error_msg and resets
 * status so a resume path is possible.
 * Task #54: reused as-is for retry (the caller just passes the SAME
 * distributionId again — nothing here assumes a fresh 'pending' row, so no
 * separate "retry" codepath/row was needed) and for cancel, via an
 * AbortSignal threaded through every network call.
 * @param {string} distributionId
 * @param {function} [onProgress]
 * @param {AbortSignal} [signal]
 */
async function syncDistribution(distributionId, onProgress = () => {}, signal) {
  const dist = db.get('SELECT * FROM distributions WHERE id = ?', [distributionId]);
  if (!dist) throw new Error('Distribution not found: ' + distributionId);

  const rec = db.get('SELECT * FROM recordings WHERE id = ?', [dist.recording_id]);
  if (!rec) throw new Error('Recording not found');

  function fail(status, err) {
    // A canceled upload isn't a failure to surface as "error_upload" with a
    // scary AbortError message — it's the user's own request, and retrying
    // it should look exactly like retrying any other interrupted attempt.
    const isAbort = err.name === 'AbortError' || (signal && signal.aborted);
    db.run(
      'UPDATE distributions SET status = ?, error_msg = ? WHERE id = ?',
      [isAbort ? 'canceled' : status, isAbort ? null : err.message, distributionId]
    );
    throw err;
  }

  // Step 1: get pre-signed URL
  const mimeType = rec.r2_key && rec.r2_key.endsWith('.webm') ? 'video/webm' : 'video/mp4';
  onProgress({ stage: 'presign', pct: 5 });
  let presignedUrl;
  try {
    ({ presignedUrl } = await getPresignedUrl(rec.r2_key, mimeType, signal));
  } catch (err) { fail('error_presign', err); }

  // Step 2: upload
  db.run('UPDATE distributions SET status = ?, error_msg = NULL WHERE id = ?', ['uploading', distributionId]);
  onProgress({ stage: 'uploading', pct: 10 });

  try {
    await uploadToR2(rec.path, presignedUrl, mimeType, (frac) => {
      onProgress({ stage: 'uploading', pct: Math.round(10 + frac * 80) });
    }, signal);
  } catch (err) { fail('error_upload', err); }

  db.run('UPDATE distributions SET status = ? WHERE id = ?', ['uploaded', distributionId]);
  onProgress({ stage: 'queuing', pct: 92 });

  // Step 3: enqueue
  try {
    await enqueueDistribution({
      distributionId,
      recordingId: dist.recording_id,
      r2Key: rec.r2_key,
      packageId: dist.package_id,
      platform: dist.platform,
    }, signal);
  } catch (err) { fail('error_queue', err); }

  db.run('UPDATE distributions SET status = ?, error_msg = NULL WHERE id = ?', ['queued', distributionId]);
  onProgress({ stage: 'done', pct: 100 });

  return { ok: true };
}

// ── helpers ───────────────────────────────────────────────────

function jsonPost(url, body, token, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) return reject(new DOMException('Canceled', 'AbortError'));
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443, // same latent bug as uploadToR2's options — a non-default port used to connect to :443 anyway
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${token}`,
      },
      signal,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
          else reject(new Error(`Worker error ${res.statusCode}: ${json.error || data.slice(0, 200)}`));
        } catch (_) {
          reject(new Error(`Worker returned non-JSON (HTTP ${res.statusCode}): ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { getPresignedUrl, uploadToR2, enqueueDistribution, syncDistribution };
