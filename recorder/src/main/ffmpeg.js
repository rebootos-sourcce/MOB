'use strict';
/**
 * FFmpeg wrapper: resolves the bundled binary, builds encoder arguments for
 * each output format/codec/quality, and runs the finalize step with progress.
 *
 * The live recording is a VP9/Opus WebM written by MediaRecorder. Finalizing:
 *   - WebM  -> stream copy (instant). Also writes the duration/cues metadata
 *              Chromium leaves out, so the file is seekable.
 *   - MP4   -> transcode to the chosen codec with +faststart so it plays
 *              anywhere and starts instantly when streamed.
 */
const { spawn, execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function binaryPath() {
  const p = require('ffmpeg-static');
  if (!p) throw new Error('ffmpeg-static binary not found');
  // Inside a packaged app the binary lives in app.asar.unpacked.
  return p.replace(/app\.asar(?=[/\\])/g, 'app.asar.unpacked');
}

/**
 * Encoders selectable in the UI. `crf` is indexed by quality preset.
 * Lower CRF = higher quality / bigger file. Hardware encoders use a bitrate
 * target instead because their CRF-like modes vary by driver.
 */
const CODECS = {
  h264: {
    label: 'H.264 · plays everywhere',
    encoder: 'libx264',
    // Measured on 1080p screen content: -preset slow costs 2x the encode time
    // of medium for a 0.002% SSIM difference and a slightly LARGER file.
    // Screen content is too compressible for the slow presets to earn their
    // keep, so the quality tiers buy speed instead.
    args: (q) => ['-c:v', 'libx264',
      '-preset', { high: 'medium', balanced: 'fast', small: 'veryfast' }[q] || 'medium',
      '-crf', { high: 18, balanced: 21, small: 24 }[q],
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2']
  },
  h265: {
    label: 'H.265 · ~40% smaller',
    encoder: 'libx265',
    args: (q) => ['-c:v', 'libx265',
      '-preset', { high: 'medium', balanced: 'fast', small: 'faster' }[q] || 'medium',
      '-crf', { high: 20, balanced: 23, small: 26 }[q],
      '-pix_fmt', 'yuv420p', '-tag:v', 'hvc1']
  },
  av1: {
    label: 'AV1 · smallest, slow',
    encoder: 'libsvtav1',
    args: (q) => ['-c:v', 'libsvtav1', '-preset', '6', '-crf', { high: 28, balanced: 32, small: 36 }[q],
      '-pix_fmt', 'yuv420p']
  },
  h264_nvenc: {
    label: 'H.264 · NVIDIA GPU (fast)',
    encoder: 'h264_nvenc',
    args: (q) => ['-c:v', 'h264_nvenc', '-preset', 'p6', '-rc', 'vbr', '-cq', { high: 19, balanced: 23, small: 27 }[q],
      '-b:v', '0', '-pix_fmt', 'yuv420p']
  },
  h264_qsv: {
    label: 'H.264 · Intel GPU (fast)',
    encoder: 'h264_qsv',
    args: (q) => ['-c:v', 'h264_qsv', '-preset', 'slower', '-global_quality', { high: 19, balanced: 23, small: 27 }[q],
      '-pix_fmt', 'nv12']
  },
  h264_amf: {
    label: 'H.264 · AMD GPU (fast)',
    encoder: 'h264_amf',
    args: (q) => ['-c:v', 'h264_amf', '-quality', 'quality', '-rc', 'cqp', '-qp_i', { high: 18, balanced: 22, small: 26 }[q],
      '-qp_p', { high: 20, balanced: 24, small: 28 }[q], '-pix_fmt', 'yuv420p']
  }
};

/**
 * Probes a media file's duration in milliseconds by parsing ffmpeg's own
 * stderr banner. No ffprobe binary is bundled (ffmpeg-static ships only
 * ffmpeg), so `ffmpeg -i <file>` with no output — which always "fails"
 * since nothing was asked of it — is the only duration probe available;
 * the Duration line lands on stderr regardless of that exit code.
 * Resolves null if the file isn't readable as media at all.
 */
function probeDuration(filePath) {
  return new Promise((resolve) => {
    execFile(binaryPath(), ['-hide_banner', '-i', filePath], { maxBuffer: 4 * 1024 * 1024 }, (_err, _stdout, stderr) => {
      const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(stderr || '');
      if (!m) { resolve(null); return; }
      const ms = (Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])) * 1000;
      resolve(Math.round(ms));
    });
  });
}

let encoderCache = null;
/** Returns the set of encoder names this ffmpeg build supports. */
function availableEncoders() {
  if (encoderCache) return Promise.resolve(encoderCache);
  return new Promise((resolve) => {
    execFile(binaryPath(), ['-hide_banner', '-encoders'], { maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
      if (err || !stdout) {
        // A transient failure here used to cache an EMPTY set for the whole
        // session — every codec greyed out in the UI with no way to retry
        // short of restarting the app. Resolve empty for just this call;
        // only a genuine success is memoized below.
        resolve(new Set());
        return;
      }
      const found = new Set();
      for (const line of stdout.split('\n')) {
        const m = line.match(/^\s*[VAS][F.][S.][X.][B.][D.]\s+(\S+)/);
        if (m) found.add(m[1]);
      }
      encoderCache = found;
      resolve(found);
    });
  });
}

/** Codec choices with an `available` flag so the UI can grey out missing ones. */
async function codecOptions() {
  const enc = await availableEncoders();
  return Object.entries(CODECS).map(([id, c]) => ({ id, label: c.label, available: enc.has(c.encoder) }));
}

function buildArgs(input, output, opts) {
  const { format, codec, quality, fps, rawVideoCodec } = opts;
  const args = ['-hide_banner', '-y', '-i', input];

  // When the intermediate already holds the codec the container wants, the
  // video is remuxed rather than re-encoded. That turns a multi-minute
  // transcode into a few seconds of I/O, which is the difference between
  // waiting on a save and not noticing it.
  const canCopyVideo =
    (format === 'mp4' && rawVideoCodec === 'h264') ||
    (format === 'webm' && (rawVideoCodec === 'vp9' || rawVideoCodec === 'vp8'));

  if (canCopyVideo) {
    args.push('-c:v', 'copy');
    // Opus is legal in MP4 but many players choke on it, so audio is still
    // converted for MP4. Audio-only encoding costs almost nothing.
    if (format === 'mp4') args.push('-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart');
    else args.push('-c:a', 'copy');
  } else if (format === 'webm') {
    // Intermediate has a non-VP8/VP9 codec (H264 in WebM — unusual but possible
    // if the platform lacks VP9 support); transcode to VP9 to stay spec-compliant.
    args.push('-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'copy');
  } else {
    const c = CODECS[codec] || CODECS.h264;
    args.push(...c.args(quality || 'high'));
    if (fps) args.push('-r', String(fps));
    args.push('-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart');
  }
  args.push('-progress', 'pipe:1', '-nostats', output);
  return args;
}

/** True when this finalize will remux rather than re-encode. */
function isCopy(opts) {
  return (opts.format === 'mp4' && opts.rawVideoCodec === 'h264') ||
    (opts.format === 'webm' && ['vp9', 'vp8'].includes(opts.rawVideoCodec));
}

// Every spawned ffmpeg child is tracked here so it can be killed on a
// finalize timeout or app quit — previously nothing tracked these at all,
// so a wedged encode ran forever with no way to cancel it, and quitting
// mid-finalize orphaned the process (no job object on Windows) still
// writing to the output file.
const activeChildren = new Set();

/** Kills every currently-running ffmpeg child process. */
function killAll() {
  for (const child of activeChildren) {
    try { child.kill('SIGKILL'); } catch (_) { /* already gone */ }
  }
  activeChildren.clear();
}

/**
 * Runs the finalize step. `durationMs` is the recorded length (known by the
 * recorder; the raw WebM has no duration header), used to compute progress.
 * @param {AbortSignal} [signal]  aborting kills the ffmpeg child immediately
 */
function finalize(input, output, opts, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const args = buildArgs(input, output, opts);
    const child = spawn(binaryPath(), args, { windowsHide: true });
    activeChildren.add(child);
    let stderr = '';
    let buf = '';
    let abortedByCaller = false;

    const onAbort = () => { abortedByCaller = true; try { child.kill('SIGKILL'); } catch (_) {} };
    if (signal) {
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }
    const cleanup = () => { activeChildren.delete(child); if (signal) signal.removeEventListener('abort', onAbort); };

    child.stdout.on('data', (d) => {
      buf += d.toString();
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        const m = line.match(/^out_time_ms=(\d+)/) || line.match(/^out_time_us=(\d+)/);
        if (m && opts.durationMs && onProgress) {
          const ms = Number(m[1]) / 1000; // both keys are microseconds in practice
          onProgress(Math.max(0, Math.min(1, ms / opts.durationMs)));
        }
      }
    });
    child.stderr.on('data', (d) => { stderr += d.toString(); if (stderr.length > 200000) stderr = stderr.slice(-100000); });
    child.on('error', (err) => { cleanup(); reject(err); });
    child.on('close', (code) => {
      cleanup();
      if (abortedByCaller) { reject(new Error('ffmpeg finalize aborted (timeout or app quit)')); return; }
      if (code === 0 && fs.existsSync(output)) resolve({ output, args });
      else reject(new Error('ffmpeg exited with code ' + code + '\n' + stderr.split('\n').slice(-15).join('\n')));
    });
  });
}

// "Studio Sound" (TDD:770-776, 1313-1317): acompressor -> loudnorm(I=-16,
// dual_mono=true) -> alimiter. dual_mono matters specifically for this app:
// it records mono (task #42), and TDD:768 warns that omitting dual_mono
// causes a 3dB loudness error on mono sources — loudnorm's own docs confirm
// the same thing, since EBU R128 was written assuming stereo.
//
// The spec also wants arnndn (RNN noise reduction) first in the chain, but
// arnndn refuses to even initialize without an external model file (`m=`) —
// confirmed directly against the bundled ffmpeg build — and no model ships
// with ffmpeg-static or this app. Rather than wire up a filter guaranteed to
// fail, or silently drop it with no sign anything was skipped, it's included
// only when a model file is actually found at denoiseModelPath; otherwise
// the chain runs without it and callers can tell which happened via the
// returned `denoised` flag. The other three filters already deliver the
// loudness-normalization value this task is centrally about.
function studioSoundFilterChain(denoiseModelPath) {
  const chain = [];
  let denoised = false;
  if (denoiseModelPath && fs.existsSync(denoiseModelPath)) {
    chain.push(`arnndn=m='${denoiseModelPath.replace(/'/g, "'\\''")}'`);
    denoised = true;
  }
  chain.push('acompressor', 'loudnorm=I=-16:TP=-1.5:dual_mono=true', 'alimiter');
  return { filter: chain.join(','), denoised };
}

/**
 * Runs the Studio Sound audio chain over a file's audio track, copying the
 * video stream through untouched (this never changes picture or duration).
 * @param {string} input
 * @param {string} output   extension decides the container's audio codec
 *                          (AAC for mp4, Opus for webm — AAC is not legal
 *                          inside WebM)
 * @param {function} [onProgress]  called with elapsed ms processed
 * @param {AbortSignal} [signal]
 * @param {string} [denoiseModelPath]  optional arnndn model file
 * @returns {Promise<{output:string, denoised:boolean}>}
 */
function applyStudioSound(input, output, onProgress, signal, denoiseModelPath) {
  const format = path.extname(output).replace(/^\./, '').toLowerCase() === 'webm' ? 'webm' : 'mp4';
  const { filter, denoised } = studioSoundFilterChain(denoiseModelPath);
  const audioArgs = format === 'webm'
    ? ['-c:a', 'libopus', '-b:a', '160k']
    : ['-c:a', 'aac', '-b:a', '160k', '-ar', '48000'];

  return new Promise((resolve, reject) => {
    const args = [
      '-hide_banner', '-y', '-i', input,
      '-c:v', 'copy',
      '-af', filter,
      ...audioArgs,
      '-progress', 'pipe:1', '-nostats',
      output,
    ];
    const child = spawn(binaryPath(), args, { windowsHide: true });
    activeChildren.add(child);
    let stderr = '';
    let buf = '';
    let abortedByCaller = false;

    const onAbort = () => { abortedByCaller = true; try { child.kill('SIGKILL'); } catch (_) {} };
    if (signal) {
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }
    const cleanup = () => { activeChildren.delete(child); if (signal) signal.removeEventListener('abort', onAbort); };

    child.stdout.on('data', (d) => {
      buf += d.toString();
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        const m = line.match(/^out_time_ms=(\d+)/) || line.match(/^out_time_us=(\d+)/);
        if (m && onProgress) onProgress(Number(m[1]) / 1000); // microseconds -> ms
      }
    });
    child.stderr.on('data', (d) => { stderr += d.toString(); if (stderr.length > 200000) stderr = stderr.slice(-100000); });
    child.on('error', (err) => { cleanup(); reject(err); });
    child.on('close', (code) => {
      cleanup();
      if (abortedByCaller) { reject(new Error('Studio Sound aborted')); return; }
      if (code === 0 && fs.existsSync(output)) resolve({ output, denoised });
      else reject(new Error('ffmpeg Studio Sound failed (code ' + code + '): ' + stderr.split('\n').slice(-15).join('\n')));
    });
  });
}

/**
 * Extract a time range from a source file into a new file.
 *
 * Re-encodes rather than stream-copying. -ss before -i with -c copy (the
 * previous approach) is input-side seeking, which snaps to the nearest
 * preceding keyframe — with libx264 defaults that's up to ~8s early at
 * 30fps, so any EDL-derived clip boundary came out silently wrong. Output-
 * side seeking (-ss after -i) with a real encode is frame-accurate; clips
 * are short, so the extra encode time is a fine trade for correctness.
 *
 * @param {string} input   source file path
 * @param {string} output  destination file path
 * @param {number} startMs start of range in ms
 * @param {number} endMs   end of range in ms
 */
function extractSegment(input, output, startMs, endMs) {
  const startSec = (startMs / 1000).toFixed(3);
  const durSec   = ((endMs - startMs) / 1000).toFixed(3);
  const args = [
    '-y',
    '-i', input,
    '-ss', startSec,
    '-t', durSec,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k',
    '-avoid_negative_ts', 'make_zero',
    output
  ];
  return new Promise((resolve, reject) => {
    const child = spawn(binaryPath(), args, { windowsHide: true });
    activeChildren.add(child);
    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('error', (err) => { activeChildren.delete(child); reject(err); });
    child.on('close', code => {
      activeChildren.delete(child);
      if (code === 0 && fs.existsSync(output)) resolve({ output });
      else reject(new Error('ffmpeg extractSegment failed (code ' + code + '): ' + stderr.slice(-500)));
    });
  });
}

/**
 * Decode a video/audio file's audio track to raw mono PCM and downsample it
 * server-side into a small peaks array. waveform:load used to read the
 * ENTIRE video file into main-process memory and ship it over IPC for the
 * renderer to decode with Web Audio — a one-hour recording is 1GB+, and
 * selecting it in the Edit tab was a completely ordinary action. At 8kHz
 * mono the intermediate PCM buffer for even a 4-hour recording is well
 * under 250MB, and only `numPeaks` floats ever cross the IPC boundary.
 * @param {string} input
 * @param {number} [numPeaks]
 * @returns {Promise<{peaks:number[], durationMs:number}>}
 */
function extractPeaks(input, numPeaks = 1000) {
  const SAMPLE_RATE = 8000; // plenty for a visual overview waveform
  const args = ['-i', input, '-vn', '-ac', '1', '-ar', String(SAMPLE_RATE), '-f', 's16le', 'pipe:1'];
  return new Promise((resolve, reject) => {
    const child = spawn(binaryPath(), args, { windowsHide: true });
    activeChildren.add(child);
    const chunks = [];
    let stderr = '';
    child.stdout.on('data', (d) => chunks.push(d));
    child.stderr.on('data', (d) => { stderr += d.toString(); if (stderr.length > 200000) stderr = stderr.slice(-100000); });
    child.on('error', (err) => { activeChildren.delete(child); reject(err); });
    child.on('close', (code) => {
      activeChildren.delete(child);
      if (code !== 0) { reject(new Error('ffmpeg extractPeaks failed (code ' + code + '): ' + stderr.slice(-500))); return; }
      const buf = Buffer.concat(chunks);
      const sampleCount = Math.floor(buf.length / 2); // 16-bit samples
      if (sampleCount === 0) { resolve({ peaks: [], durationMs: 0 }); return; }
      const durationMs = Math.round((sampleCount / SAMPLE_RATE) * 1000);
      const blockSize = Math.max(1, Math.floor(sampleCount / numPeaks));
      const peaks = [];
      for (let i = 0; i < numPeaks && i * blockSize < sampleCount; i++) {
        const start = i * blockSize;
        const end = Math.min(sampleCount, start + blockSize);
        let max = 0;
        for (let j = start; j < end; j++) {
          const sample = Math.abs(buf.readInt16LE(j * 2)) / 32768;
          if (sample > max) max = sample;
        }
        peaks.push(max);
      }
      // Normalize against this clip's own loudest point (matching the old
      // renderer-side behavior) so a quiet recording still fills the
      // waveform display instead of drawing as a flat, barely-visible line.
      const globalMax = peaks.reduce((m, v) => Math.max(m, v), 0.001);
      for (let i = 0; i < peaks.length; i++) peaks[i] /= globalMax;
      resolve({ peaks, durationMs });
    });
  });
}

/** Extract a single JPEG thumbnail from a video at the given offset (seconds). */
function extractThumbnail(input, output, atSec = 0.5) {
  const args = ['-y', '-ss', String(atSec), '-i', input, '-vframes', '1', '-vf', 'scale=320:-1', output];
  return new Promise((resolve, reject) => {
    const child = spawn(binaryPath(), args, { windowsHide: true });
    activeChildren.add(child);
    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('error', (err) => { activeChildren.delete(child); reject(err); });
    child.on('close', code => {
      activeChildren.delete(child);
      if (code === 0 && fs.existsSync(output)) resolve({ output });
      else reject(new Error('ffmpeg extractThumbnail failed (code ' + code + '): ' + stderr.slice(-500)));
    });
  });
}

/**
 * Renders the KEPT (non-cut) ranges of a source video into a single output
 * file, in source order — this is the piece that was entirely missing:
 * applyCuts() only ever wrote edl_entries rows, and nothing turned that
 * into an actual edited file. "Remove fillers" reported success while the
 * video on disk never changed.
 *
 * Each kept range is extracted with the same accurate re-encode as
 * extractSegment (output-side seek, not a keyframe-snapped stream copy),
 * then the parts are joined with ffmpeg's concat demuxer. Because every
 * part was encoded with identical settings, the join is a stream copy —
 * no second re-encode, no quality loss, no re-introduced keyframe drift.
 *
 * @param {string} input
 * @param {string} output
 * @param {Array<{source_start_ms:number, source_end_ms:number}>} segments  kept ranges, source order
 * @param {function} [onProgress]  fraction 0-1
 */
async function renderEdl(input, output, segments, onProgress) {
  if (!segments.length) throw new Error('No kept segments to render — everything was cut');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mob-edl-'));
  const partPaths = [];
  try {
    const totalMs = segments.reduce((s, seg) => s + Math.max(0, seg.source_end_ms - seg.source_start_ms), 0) || 1;
    let doneMs = 0;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const partPath = path.join(tmpDir, `part-${String(i).padStart(4, '0')}.mp4`);
      await extractSegment(input, partPath, seg.source_start_ms, seg.source_end_ms);
      partPaths.push(partPath);
      doneMs += (seg.source_end_ms - seg.source_start_ms);
      if (onProgress) onProgress(Math.min(0.95, doneMs / totalMs));
    }

    if (partPaths.length === 1) {
      fs.copyFileSync(partPaths[0], output);
    } else {
      const listPath = path.join(tmpDir, 'list.txt');
      // ffmpeg's concat-demuxer list format: each line `file '<path>'`,
      // with embedded single quotes escaped as '\''.
      const listContent = partPaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
      fs.writeFileSync(listPath, listContent);
      await new Promise((resolve, reject) => {
        const args = ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', output];
        const child = spawn(binaryPath(), args, { windowsHide: true });
        activeChildren.add(child);
        let stderr = '';
        child.stderr.on('data', d => { stderr += d.toString(); });
        child.on('error', (err) => { activeChildren.delete(child); reject(err); });
        child.on('close', (code) => {
          activeChildren.delete(child);
          if (code === 0 && fs.existsSync(output)) resolve();
          else reject(new Error('ffmpeg concat failed (code ' + code + '): ' + stderr.slice(-500)));
        });
      });
    }
    if (onProgress) onProgress(1);
    return { output };
  } finally {
    // rmSync(recursive) rather than deleting tracked files one by one and
    // rmdirSync-ing what's left — the list.txt written above isn't in
    // partPaths, so the old per-file cleanup left it behind and rmdirSync
    // then failed silently on a non-empty directory, orphaning a temp dir
    // on every single render.
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) { /* best effort */ }
  }
}

module.exports = { binaryPath, CODECS, codecOptions, availableEncoders, buildArgs, isCopy, finalize, extractSegment, extractThumbnail, extractPeaks, renderEdl, killAll, probeDuration, applyStudioSound };
