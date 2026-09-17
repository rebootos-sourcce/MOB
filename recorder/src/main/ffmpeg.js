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

function binaryPath() {
  let p = require('ffmpeg-static');
  // Inside a packaged app the binary lives in app.asar.unpacked.
  if (p && p.includes('app.asar')) p = p.replace('app.asar', 'app.asar.unpacked');
  return p;
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

let encoderCache = null;
/** Returns the set of encoder names this ffmpeg build supports. */
function availableEncoders() {
  if (encoderCache) return Promise.resolve(encoderCache);
  return new Promise((resolve) => {
    execFile(binaryPath(), ['-hide_banner', '-encoders'], { maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
      const found = new Set();
      if (!err && stdout) {
        for (const line of stdout.split('\n')) {
          const m = line.match(/^\s*[VAS][F.][S.][X.][B.][D.]\s+(\S+)/);
          if (m) found.add(m[1]);
        }
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
    args.push('-c', 'copy');
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

/**
 * Runs the finalize step. `durationMs` is the recorded length (known by the
 * recorder; the raw WebM has no duration header), used to compute progress.
 */
function finalize(input, output, opts, onProgress) {
  return new Promise((resolve, reject) => {
    const args = buildArgs(input, output, opts);
    const child = spawn(binaryPath(), args, { windowsHide: true });
    let stderr = '';
    let buf = '';
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
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0 && fs.existsSync(output)) resolve({ output, args });
      else reject(new Error('ffmpeg exited with code ' + code + '\n' + stderr.split('\n').slice(-15).join('\n')));
    });
  });
}

module.exports = { binaryPath, CODECS, codecOptions, availableEncoders, buildArgs, isCopy, finalize };
