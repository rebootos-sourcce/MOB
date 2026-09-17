/**
 * Hidden recorder engine.
 *
 * Owns the screen, camera and mic streams. Every frame it draws the screen
 * into a canvas, then clips the camera to the bubble's shape at the bubble's
 * on-screen position and draws it on top. canvas.captureStream() + the mic
 * track feed MediaRecorder, whose 1-second chunks are streamed to the main
 * process and written straight to disk.
 */
(function () {
  const logEl = document.getElementById('log');

  /**
   * Frame-time instrumentation. Off unless the bench harness turns it on, so
   * it costs nothing in a real recording. Collects per-frame composite cost
   * and how many frames were skipped because nothing changed.
   */
  const perf = { on: false, times: [], skipped: 0, drawn: 0, t0: 0, vfcScreen: 0, vfcCam: 0, total: 0, wall0: 0 };
  function perfStart() { if (perf.on) perf.t0 = performance.now(); }
  function perfEnd(drew) {
    if (!perf.on) return;
    if (drew) { const d = performance.now() - perf.t0; perf.times.push(d); perf.total += d; perf.drawn++; }
    else perf.skipped++;
  }
  function perfReport() {
    if (!perf.on || !perf.times.length) return null;
    const a = perf.times.slice().sort((x, y) => x - y);
    const q = (p) => a[Math.min(a.length - 1, Math.floor(a.length * p))];
    const sum = a.reduce((t, v) => t + v, 0);
    const wallSec = perf.wall0 ? (performance.now() - perf.wall0) / 1000 : 0;
    return {
      drawn: perf.drawn, skipped: perf.skipped,
      vfcScreen: perf.vfcScreen, vfcCam: perf.vfcCam,
      totalMs: +perf.total.toFixed(0),
      msPerSec: wallSec ? +(perf.total / wallSec).toFixed(1) : null,
      effFps: wallSec ? +(perf.drawn / wallSec).toFixed(1) : null,
      mean: +(sum / a.length).toFixed(3),
      p50: +q(0.5).toFixed(3), p95: +q(0.95).toFixed(3), max: +a[a.length - 1].toFixed(3),
      budgetMs: +(1000 / fps).toFixed(2)
    };
  }
  window.api.on('recorder:perfOn', () => { perf.on = true; perf.wall0 = performance.now(); });
  const log = (...a) => { const line = a.map(String).join(' '); logEl.textContent = (logEl.textContent + '\n' + line).split('\n').slice(-40).join('\n'); console.log(...a); };

  let screenStream = null, camStream = null, micStream = null;
  let screenVideo = null, camVideo = null;
  let canvas = null, ctx = null, canvasStream = null, videoTrack = null;
  let mediaRecorder = null;
  let timer = null;
  let overlay = null;         // { bounds, shape, mirror, visible, border }
  let displayBounds = null;   // DIP bounds of the captured display, or null for window capture
  let startedAt = 0, pausedTotal = 0, pausedAt = 0;
  let writeQueue = Promise.resolve();
  let armed = null;          // stream built at arm time, encoded at go time
  // Change tracking. The compositor used to repaint on a wall-clock timer
  // whether or not any source had produced a new frame, so a motionless
  // desktop cost exactly as much as a video playing full screen.
  let dirty = true;
  let lastPush = 0;
  const KEEPALIVE_MS = 250;  // push at least this often so the stream never stalls
  let pathKey = '';
  let pathCache = null;
  const frames = { screen: null, cam: null };  // latest VideoFrame per source
  const readers = [];
  let running = false;
  let useFallback = false;   // no MediaStreamTrackProcessor: repaint every tick
  let targetFormat = 'mp4';  // drives the intermediate codec choice
  let quality = 'high';
  let wantsTranscode = false;
  let rawVideoCodec = 'unknown';
  let warnings = [];         // device problems worth telling the user about
  let fps = 30;

  function elapsed() {
    if (!startedAt) return 0;
    return Date.now() - startedAt - pausedTotal - (pausedAt ? Date.now() - pausedAt : 0);
  }

  function stopTracks(s) { if (s) s.getTracks().forEach((t) => { try { t.stop(); } catch (_) { } }); }

  function cleanup() {
    if (timer) { clearInterval(timer); timer = null; }
    warnings = [];
    running = false;
    // VideoFrames hold GPU/decoder memory until closed; leaking them across
    // takes is how a long session runs the machine out of video memory.
    while (readers.length) { try { readers.pop().cancel(); } catch (_) { /* already gone */ } }
    for (const k of Object.keys(frames)) { if (frames[k]) { frames[k].close(); frames[k] = null; } }
    useFallback = false;
    stopTracks(screenStream); stopTracks(camStream); stopTracks(micStream); stopTracks(canvasStream);
    screenStream = camStream = micStream = canvasStream = null;
    if (screenVideo) { screenVideo.__watching = false; screenVideo.srcObject = null; screenVideo.remove(); screenVideo = null; }
    if (camVideo) { camVideo.__watching = false; camVideo.srcObject = null; camVideo.remove(); camVideo = null; }
    pathKey = ''; pathCache = null; dirty = true; lastPush = 0;
    mediaRecorder = null;
    armed = null;
    startedAt = 0; pausedTotal = 0; pausedAt = 0;
  }

  /** Only used when MediaStreamTrackProcessor is unavailable. */
  function makeVideo(stream) {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.srcObject = stream;
    document.body.appendChild(v);
    v.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0.01;pointer-events:none';
    return new Promise((resolve, reject) => {
      v.onloadedmetadata = () => v.play().then(() => resolve(v)).catch(reject);
      v.onerror = () => reject(new Error('video element failed'));
    });
  }

  function deviceConstraint(id) {
    return id && id !== 'default' ? { deviceId: { exact: id } } : {};
  }

  async function openStreams(opts) {
    screenStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: opts.sourceId,
          maxFrameRate: opts.fps
        }
      }
    });

    try {
      // The camera is drawn into a bubble a few hundred pixels across, so
      // capturing 720p and downscaling it every frame is wasted decode and
      // scale work. Ask for roughly 2x the bubble's longest side.
      const want = Math.max(480, Math.min(1280, Math.round((opts.cameraHint || 480) * 2 / 16) * 16));
      camStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: Object.assign({ width: { ideal: want }, height: { ideal: Math.round(want * 9 / 16) }, frameRate: { ideal: 30 } }, deviceConstraint(opts.cameraDeviceId))
      });
    } catch (err) {
      log('camera unavailable:', err.message, '— recording screen only');
      camStream = null;
      warnings.push('No camera in this recording — ' + err.name);
    }

    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: Object.assign({ echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 }, deviceConstraint(opts.micDeviceId))
      });
      micStream.getAudioTracks().forEach((t) => { t.enabled = !!opts.micEnabled; });
    } catch (err) {
      log('mic unavailable:', err.message, '— recording without audio');
      micStream = null;
      warnings.push('No microphone in this recording — ' + err.name);
    }
  }

  /** Where the bubble lands on the canvas, in canvas pixels. */
  function overlayRect() {
    if (!overlay || !overlay.visible || !camVideo) return null;
    const b = overlay.bounds;
    if (displayBounds) {
      const sx = canvas.width / displayBounds.width;
      const sy = canvas.height / displayBounds.height;
      const r = { x: (b.x - displayBounds.x) * sx, y: (b.y - displayBounds.y) * sy, w: b.width * sx, h: b.height * sy };
      // Bubble dragged onto another monitor → not in this recording.
      if (r.x + r.w < 0 || r.y + r.h < 0 || r.x > canvas.width || r.y > canvas.height) return null;
      return r;
    }
    // Window capture: we can't map screen coordinates into the window, so
    // anchor the bubble bottom-right at a size proportional to the canvas.
    const scale = canvas.height / 1080;
    const w = b.width * scale, h = b.height * scale, m = 24 * scale;
    return { x: canvas.width - w - m, y: canvas.height - h - m, w, h };
  }

  /**
   * Draws `video` filling the x/y/w/h box (object-fit: cover), optionally
   * flipped. Flips happen around the box centre so the framing never shifts.
   */
  /**
   * Returns a Path2D for this shape at this size, built at the origin and
   * cached. The previous code rebuilt the same path three times per frame
   * (clip the camera, clip the ring, stroke the ring) for geometry that only
   * changes when the bubble is moved or resized.
   */
  function shapePath(shapeId, w, h) {
    const key = shapeId + ':' + Math.round(w) + 'x' + Math.round(h);
    if (key !== pathKey) {
      const p = new Path2D();
      p.beginPath = noop;  // shapes.js calls ctx.beginPath(); Path2D has no such method
      (Shapes.SHAPES[shapeId] || Shapes.SHAPES.circle).path(p, 0, 0, w, h);
      pathCache = p;
      pathKey = key;
    }
    return pathCache;
  }
  function noop() {}

  function drawCover(video, x, y, w, h, flipH, flipV) {
    const vw = srcW(video), vh = srcH(video);
    if (!vw || !vh) return;
    const scale = Math.max(w / vw, h / vh);
    const dw = vw * scale, dh = vh * scale;
    const dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
    if (!flipH && !flipV) { ctx.drawImage(video, dx, dy, dw, dh); return; }
    const cx = x + w / 2, cy = y + h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-cx, -cy);
    ctx.drawImage(video, dx, dy, dw, dh);
    ctx.restore();
  }

  function drawFrame() {
    if (!ctx) return;
    const screenSrc = frames.screen || screenVideo;
    const camSrc = frames.cam || camVideo;
    if (!screenSrc) return;

    // Skip entirely when no source produced a new frame and the stream was
    // fed recently. A static screen costs nothing instead of full budget.
    const now = performance.now();
    if (!useFallback && !dirty && now - lastPush < KEEPALIVE_MS) { perfEnd(false); return; }
    perfStart();

    if (srcW(screenSrc)) ctx.drawImage(screenSrc, 0, 0, canvas.width, canvas.height);
    const r = overlayRect();
    if (r && camSrc && srcW(camSrc)) {
      const shapeId = Shapes.SHAPES[overlay.shape] ? overlay.shape : 'circle';
      const path = shapePath(shapeId, r.w, r.h);
      const bw = overlay.border ? Math.max(2, Math.round(Math.min(r.w, r.h) * Material.RING_RATIO)) : 0;

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.clip(path);
      ctx.translate(-r.x, -r.y);
      drawCover(camSrc, r.x, r.y, r.w, r.h, overlay.mirror, overlay.flipV);
      ctx.restore();

      if (bw) {
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.clip(path);
        ctx.lineWidth = bw * 2;
        ctx.strokeStyle = Material.RING_COLOR;
        ctx.stroke(path);
        ctx.restore();
      }
    }
    if (videoTrack && videoTrack.requestFrame) videoTrack.requestFrame();
    dirty = false;
    lastPush = now;
    perfEnd(true);
  }

  /**
   * Pulls frames straight off a MediaStreamTrack.
   *
   * The compositor previously read from <video> elements on a wall-clock
   * timer. That repainted whether or not any source had produced a new frame,
   * so a motionless desktop cost exactly as much as full-screen video. The
   * obvious fix, requestVideoFrameCallback, does not work here: the recorder
   * window is hidden, and Chromium does not present frames in a hidden
   * window, so the callback fired about four times in five seconds.
   *
   * MediaStreamTrackProcessor delivers frames as the source produces them,
   * independent of whether anything is on screen.
   */
  function pump(track, slot) {
    let reader;
    try {
      reader = new MediaStreamTrackProcessor({ track }).readable.getReader();
    } catch (err) {
      log('track processor unavailable, falling back to timed repaint:', err.message);
      useFallback = true;
      return;
    }
    readers.push(reader);
    (async () => {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!running) { value.close(); break; }
          const prev = frames[slot];
          frames[slot] = value;
          if (prev) prev.close();
          if (slot === 'screen' || slot === 'cam') dirty = true;
          if (perf.on) perf[slot === 'screen' ? 'vfcScreen' : 'vfcCam']++;
        }
      } catch (_) { /* reader cancelled on teardown */ }
    })();
  }

  /** Source dimensions, for either a VideoFrame or a <video> fallback. */
  function srcW(x) { return x.displayWidth || x.videoWidth || 0; }
  function srcH(x) { return x.displayHeight || x.videoHeight || 0; }

  /**
   * Chooses the intermediate container to match the final output, so the
   * finalize step can remux instead of re-encoding.
   *
   * For MP4 output an H.264 intermediate is preferred: where the platform has
   * a hardware encoder it also keeps the frames off the CPU, and either way
   * saving becomes a copy. For WebM output VP9 is already the right choice.
   */
  function pickMime(targetFormat) {
    const mp4First = [
      'video/x-matroska;codecs=avc1,opus',
      'video/webm;codecs=h264,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    const webmFirst = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    // If the user picked H.265 or AV1 the file has to be transcoded anyway,
    // so capture VP9 and let the encoder do the work from a good source.
    if (targetFormat === 'mp4' && wantsTranscode) return webmFirst.find((m) => MediaRecorder.isTypeSupported(m)) || '';
    const list = targetFormat === 'webm' ? webmFirst : mp4First;
    return list.find((m) => MediaRecorder.isTypeSupported(m)) || '';
  }

  /** Which video codec a chosen mime string actually carries. */
  function codecOf(mime) {
    if (/avc1|h264/i.test(mime)) return 'h264';
    if (/vp9/i.test(mime)) return 'vp9';
    if (/vp8/i.test(mime)) return 'vp8';
    return 'unknown';
  }

  /**
   * Phase 1: open every device and build the canvas, but do NOT start
   * MediaRecorder. Devices can take 0.4-2s to open on Windows, so this has to
   * finish before the countdown runs or the first words of the take are lost.
   */
  async function arm(opts) {
    cleanup();
    fps = opts.fps || 30;
    overlay = opts.overlay;
    displayBounds = opts.displayBounds;
    targetFormat = opts.targetFormat || 'mp4';
    quality = opts.quality || 'high';
    wantsTranscode = !!opts.wantsTranscode;
    try {
      await openStreams(opts);

      const st = screenStream.getVideoTracks()[0].getSettings();
      const sw = st.width || 1920, sh = st.height || 1080;
      let scale = 1;
      if (opts.maxHeight && sh > opts.maxHeight) scale = opts.maxHeight / sh;
      canvas = document.createElement('canvas');
      canvas.width = Math.round(sw * scale / 2) * 2;
      canvas.height = Math.round(sh * scale / 2) * 2;
      ctx = canvas.getContext('2d', { alpha: false });
      // Downscaling a desktop to 1080p with the default 'low' (bilinear)
      // setting is what makes recorded UI text look mushy.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      canvasStream = canvas.captureStream(0); // frames pushed manually
      videoTrack = canvasStream.getVideoTracks()[0];
      armed = new MediaStream([videoTrack]);
      if (micStream) micStream.getAudioTracks().forEach((t) => armed.addTrack(t));

      running = true;
      pump(screenStream.getVideoTracks()[0], 'screen');
      if (camStream) pump(camStream.getVideoTracks()[0], 'cam');

      // No track processor on this build: fall back to <video> elements read
      // on the timer, which is what the original code did.
      if (useFallback) {
        screenVideo = await makeVideo(screenStream);
        if (camStream) camVideo = await makeVideo(camStream);
      }

      dirty = true;
      drawFrame();
      timer = setInterval(drawFrame, 1000 / fps);

      window.api.send('recorder:state', {
        state: 'armed',
        canvas: { width: canvas.width, height: canvas.height, fps },
        // Report honestly what actually opened. These used to fail silently.
        hasCamera: !!camStream,
        hasMic: !!micStream,
        warnings: warnings.slice()
      });
    } catch (err) {
      log('arm failed:', err.name, err.message);
      let message = err.message;
      if (err.name === 'NotAllowedError') message = 'Permission denied. Check Windows Settings → Privacy → Camera / Microphone, and allow desktop apps.';
      if (err.name === 'NotReadableError') message = 'Device is busy or unreadable. Is another app using the camera or screen?';
      window.api.send('recorder:state', { state: 'error', message });
      cleanup();
    }
  }

  /** Phase 2: begin encoding. Devices are already open, so this is instant. */
  function go() {
    if (!armed || !canvas) return;
    try {
      // With a matching intermediate the finalize step is a remux, so this
      // bitrate is the delivered quality, not a throwaway intermediate. Screen
      // content is highly compressible; these factors were chosen so 1080p30
      // lands around 7.5 / 5.0 / 3.1 Mbps.
      const pixels = canvas.width * canvas.height;
      const factor = { high: 0.12, balanced: 0.08, small: 0.05 }[quality] || 0.12;
      const videoBitsPerSecond = Math.round(pixels * fps * factor);
      const mime = pickMime(targetFormat);
      rawVideoCodec = codecOf(mime);
      mediaRecorder = new MediaRecorder(armed, { mimeType: mime, videoBitsPerSecond, audioBitsPerSecond: 160000 });

      mediaRecorder.ondataavailable = (e) => {
        if (!e.data || !e.data.size) return;
        const blob = e.data;
        writeQueue = writeQueue.then(async () => {
          const buf = new Uint8Array(await blob.arrayBuffer());
          window.api.send('recorder:chunk', buf);
        });
      };
      mediaRecorder.onerror = (e) => {
        log('MediaRecorder error', e.error && e.error.message);
        window.api.send('recorder:state', { state: 'error', message: 'MediaRecorder: ' + (e.error && e.error.message) });
        cleanup();
      };
      mediaRecorder.onstop = async () => {
        await writeQueue;
        const durationMs = elapsed();
        const stats = perfReport();
        cleanup();
        window.api.send('recorder:done', { durationMs, perf: stats, rawVideoCodec });
      };

      mediaRecorder.start(1000);
      startedAt = Date.now();
      log(`recording ${canvas.width}x${canvas.height} @${fps} ${mediaRecorder.mimeType}`);
      window.api.send('recorder:state', {
        state: 'recording',
        canvas: { width: canvas.width, height: canvas.height, fps, mime: mediaRecorder.mimeType, rawVideoCodec },
        hasCamera: !!camStream, hasMic: !!micStream, warnings: warnings.slice()
      });
    } catch (err) {
      log('go failed:', err.message);
      window.api.send('recorder:state', { state: 'error', message: err.message });
      cleanup();
    }
  }

  window.api.on('recorder:arm', arm);
  window.api.on('recorder:go', go);
  window.api.on('recorder:stop', () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === 'paused') { pausedTotal += Date.now() - pausedAt; pausedAt = 0; }
    if (timer) { clearInterval(timer); timer = null; }
    try { mediaRecorder.stop(); } catch (err) { log('stop failed', err.message); window.api.send('recorder:done', { durationMs: elapsed() }); cleanup(); }
  });
  window.api.on('recorder:pause', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      pausedAt = Date.now();
      // Stop compositing while paused; it was previously still drawing and
      // pushing frames into a paused recorder for the whole pause.
      if (timer) { clearInterval(timer); timer = null; }
    }
  });
  window.api.on('recorder:resume', () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      pausedTotal += Date.now() - pausedAt;
      pausedAt = 0;
      if (!timer) timer = setInterval(drawFrame, 1000 / fps);
    }
  });
  window.api.on('recorder:setMic', (on) => {
    if (micStream) micStream.getAudioTracks().forEach((t) => { t.enabled = !!on; });
  });
  window.api.on('recorder:updateOverlay', (o) => { overlay = o; dirty = true; });
})();
