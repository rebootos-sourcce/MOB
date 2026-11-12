'use strict';
// Waveform visualizer for the Edit tab.
// Pure canvas rendering using Web Audio API — no external libraries.
// Works in Electron renderer process (Chromium).

class WaveformRenderer {
  constructor(canvas) {
    this._canvas   = canvas;
    this._ctx      = canvas.getContext('2d');
    this._peaks    = null;
    this._duration = 0;
    this._regions  = [];
    this._playhead = null;
    this._handlers = {};
    this._dpr      = window.devicePixelRatio || 1;

    this._ro = new ResizeObserver(() => { if (this._peaks) this._render(); });
    this._ro.observe(canvas.parentElement || canvas);

    canvas.addEventListener('click', e => {
      if (!this._peaks) return;
      const rect  = canvas.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      this._emit('seek', { ms: Math.round(ratio * this._duration) });
    });
  }

  /**
   * Peaks are now computed server-side (ffmpeg.extractPeaks, via the
   * waveform:load IPC handler) instead of decoding the whole file here with
   * Web Audio — this used to require shipping an entire video file's bytes
   * across IPC just to show a waveform overview.
   */
  loadPeaks(peaks, durationMs) {
    if (!peaks || !peaks.length) return;
    this._duration = durationMs;
    this._peaks = Float32Array.from(peaks);
    this._render();
  }

  setRegions(regions) {
    this._regions = Array.isArray(regions) ? regions : [];
    if (this._peaks) this._render();
  }

  setPlayhead(ms) {
    this._playhead = ms;
    if (this._peaks) this._render();
  }

  clear() {
    this._peaks    = null;
    this._duration = 0;
    this._regions  = [];
    this._playhead = null;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  on(event, handler) {
    if (!this._handlers[event]) this._handlers[event] = [];
    this._handlers[event].push(handler);
    return this;
  }

  destroy() {
    this._ro.disconnect();
    this._handlers = {};
  }

  // ── private ──────────────────────────────────────────────────────────────

  _emit(event, data) {
    (this._handlers[event] || []).forEach(fn => fn(data));
  }

  _setSize() {
    const parent = this._canvas.parentElement;
    const w = parent ? parent.clientWidth  : this._canvas.clientWidth;
    const h = parent ? parent.clientHeight : this._canvas.clientHeight;
    const dpr = this._dpr;
    this._canvas.width  = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.width  = w + 'px';
    this._canvas.style.height = h + 'px';
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  _render() {
    const { w, h } = this._setSize();
    const ctx      = this._ctx;
    const peaks    = this._peaks;
    if (!peaks) return;

    const numPeaks = peaks.length;
    const midY     = h / 2;
    const barW     = Math.max(1, w / numPeaks);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0e1120';
    ctx.fillRect(0, 0, w, h);

    // region overlays behind bars
    for (const region of this._regions) {
      const x1 = (region.startMs / this._duration) * w;
      const x2 = (region.endMs   / this._duration) * w;
      ctx.fillStyle = region.color || 'rgba(239,68,68,0.18)';
      ctx.fillRect(x1, 0, Math.max(1, x2 - x1), h);
    }

    // waveform bars
    for (let i = 0; i < numPeaks; i++) {
      const msAtBar = (i / numPeaks) * this._duration;
      const inCut   = this._regions.some(r => msAtBar >= r.startMs && msAtBar <= r.endMs);
      const barH    = peaks[i] * midY * 0.9;
      ctx.fillStyle = inCut ? '#7f3c3c' : '#3b82f6';
      ctx.fillRect(i * barW, midY - barH, Math.max(1, barW - 0.5), barH * 2);
    }

    // center line
    ctx.strokeStyle = '#1b2340';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // playhead
    if (this._playhead != null && this._duration > 0) {
      const px = (this._playhead / this._duration) * w;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = { WaveformRenderer };
} else {
  window.WaveformRenderer = WaveformRenderer;
}
