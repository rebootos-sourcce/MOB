'use strict';
// DistributionCoordinator — Durable Object
// One instance per distribution job (DO id = distributionId).
//
// State machine: pending → uploading → uploaded → queued → done
//                                                        ↘ error_*
//
// All writes are idempotent so the desktop client can retry safely.

export class DistributionCoordinator {
  constructor(state, env) {
    this.state = state;
    this.env   = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    try {
      switch (url.pathname) {
        case '/init':     return this.#handleInit(request);
        case '/progress': return this.#handleProgress(request);
        case '/state':    return this.#handleState();
        default:          return jsonResp({ error: 'not found' }, 404);
      }
    } catch (err) {
      return jsonResp({ error: err.message }, 500);
    }
  }

  // POST /init  { distributionId, recordingId, deviceId, r2Key, packageId, platform }
  async #handleInit(request) {
    const body = await request.json();
    const existing = await this.state.storage.get('status');
    if (existing && existing !== 'pending') {
      // Already progressed — return current state without overwriting
      return jsonResp({ ok: true, status: existing, resumed: true });
    }
    await this.state.storage.put('meta', {
      distributionId: body.distributionId,
      recordingId:    body.recordingId,
      deviceId:       body.deviceId,
      r2Key:          body.r2Key || null,
      packageId:      body.packageId || null,
      platform:       body.platform || 'cloud',
      createdAt:      Date.now(),
    });
    await this.state.storage.put('status', 'pending');
    return jsonResp({ ok: true, status: 'pending' });
  }

  // POST /progress  { status, r2Key?, bytesUploaded?, error? }
  async #handleProgress(request) {
    const { status, r2Key, bytesUploaded, error } = await request.json();
    if (!status) return jsonResp({ error: 'status required' }, 400);
    await this.state.storage.put('status', status);
    if (r2Key !== undefined)          await this.state.storage.put('r2Key',          r2Key);
    if (bytesUploaded !== undefined)  await this.state.storage.put('bytesUploaded',  bytesUploaded);
    if (error !== undefined)          await this.state.storage.put('lastError',       error);
    await this.state.storage.put('updatedAt', Date.now());
    return jsonResp({ ok: true, status });
  }

  // GET /state
  async #handleState() {
    const [status, meta, r2Key, bytesUploaded, lastError, updatedAt] = await Promise.all([
      this.state.storage.get('status'),
      this.state.storage.get('meta'),
      this.state.storage.get('r2Key'),
      this.state.storage.get('bytesUploaded'),
      this.state.storage.get('lastError'),
      this.state.storage.get('updatedAt'),
    ]);
    return jsonResp({
      status:        status       || 'unknown',
      r2Key:         r2Key        || null,
      bytesUploaded: bytesUploaded || 0,
      lastError:     lastError    || null,
      updatedAt:     updatedAt    || null,
      ...(meta || {}),
    });
  }
}

function jsonResp(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
