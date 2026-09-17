'use strict';
/**
 * Streams MediaRecorder chunks to disk as they arrive (so a crash never loses
 * the whole take), then hands the raw file to ffmpeg for finalizing.
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const ffmpeg = require('./ffmpeg');

function rawDir() {
  const d = path.join(app.getPath('userData'), 'recordings');
  fs.mkdirSync(d, { recursive: true });
  return d;
}

function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

class RawRecording {
  constructor() {
    this.startedAt = new Date();
    this.path = path.join(rawDir(), `raw-${stamp(this.startedAt)}.webm`);
    this.stream = fs.createWriteStream(this.path);
    this.bytes = 0;
    this.closed = null;
  }
  append(buffer) {
    if (this.closed) return;
    this.bytes += buffer.length;
    this.stream.write(Buffer.from(buffer));
  }
  end() {
    if (!this.closed) {
      this.closed = new Promise((resolve) => this.stream.end(resolve));
    }
    return this.closed;
  }
  /** Default output file name for this take. */
  suggestedName(format) {
    return `Recording ${stamp(this.startedAt)}.${format}`;
  }
  async finalize(outputPath, opts, onProgress) {
    await this.end();
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const res = await ffmpeg.finalize(this.path, outputPath, opts, onProgress);
    try { fs.unlinkSync(this.path); } catch (_) { /* keep raw if unlink fails */ }
    return res;
  }
}

/** Removes raw files older than 2 days that a crash may have left behind. */
function sweepOldRaw() {
  try {
    const cutoff = Date.now() - 2 * 24 * 3600 * 1000;
    for (const f of fs.readdirSync(rawDir())) {
      const p = path.join(rawDir(), f);
      if (fs.statSync(p).mtimeMs < cutoff) fs.unlinkSync(p);
    }
  } catch (_) { /* ignore */ }
}

module.exports = { RawRecording, rawDir, sweepOldRaw, stamp };
