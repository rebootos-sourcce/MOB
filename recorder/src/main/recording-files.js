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
    this.path = path.join(rawDir(), `raw-${stamp(this.startedAt)}.mkv`);
    // A larger buffer means far fewer write syscalls for the ~1 MB chunks
    // MediaRecorder delivers each second.
    this.stream = fs.createWriteStream(this.path, { highWaterMark: 1 << 20 });
    this.bytes = 0;
    this.closed = null;
    this.stalled = false;
    this.stalls = 0;
    this.writeError = null;
    // Chunks queued while the stream is backlogged, so append() can apply
    // real back pressure instead of handing everything straight to
    // stream.write() and letting Node buffer an unbounded overflow in
    // main-process memory.
    this._pending = [];
    this.stream.on('drain', () => {
      this.stalled = false;
      // Replay whatever queued up while we were waiting for drain.
      while (this._pending.length && this.stream.write(this._pending[0])) {
        this._pending.shift();
      }
      if (this._pending.length) this.stalled = true;
    });
    // A disk-full or broken-handle error on this stream had no listener at
    // all, which meant it threw as an unhandled error and crashed the whole
    // main process mid-recording instead of surfacing "disk full" and
    // letting the take be recovered from what was written so far.
    this.stream.on('error', (err) => {
      this.writeError = err;
      // Unblock anything awaiting end() so finalize() doesn't hang forever
      // on a stream that can no longer emit 'finish'.
      if (this.closed === null) this.closed = Promise.resolve();
    });
  }
  /**
   * Returns false when the disk is not keeping up. append() now queues
   * instead of handing overflow straight to stream.write(): a chunk is
   * only written once the stream has drained past whatever is ahead of it,
   * so memory use is bounded by the queue rather than growing without limit
   * on a slow or nearly-full drive.
   */
  append(buffer) {
    if (this.closed || this.writeError) return true;
    const buf = Buffer.from(buffer);
    this.bytes += buf.length;
    if (this.stalled) {
      this._pending.push(buf);
      return false;
    }
    const ok = this.stream.write(buf);
    if (!ok) { this.stalled = true; this.stalls++; }
    return ok;
  }
  end() {
    if (!this.closed) {
      this.closed = new Promise((resolve) => {
        if (this.writeError) { resolve(); return; }
        this.stream.end(resolve);
      });
    }
    return this.closed;
  }
  /** Default output file name for this take. */
  /** True when the disk has fallen behind and memory is filling. */
  get backlogged() { return this.stalled; }
  /** Set to the underlying Error once the write stream has failed. */
  get hadError() { return this.writeError; }

  suggestedName(format) {
    return `Recording ${stamp(this.startedAt)}.${format}`;
  }
  async finalize(outputPath, opts, onProgress) {
    await this.end();
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const res = await ffmpeg.finalize(this.path, outputPath, opts, onProgress);
    fs.promises.unlink(this.path).catch(() => { /* keep raw if unlink fails */ });
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
