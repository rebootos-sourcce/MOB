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
  let fps = 30;

  function elapsed() {
    if (!startedAt) return 0;
    return Date.now() - startedAt - pausedTotal - (pausedAt ? Date.now() - pausedAt : 0);
  }

  function stopTracks(s) { if (s) s.getTracks().forEach((t) => { try { t.stop(); } catch (_) { } }); }

  function cleanup() {
    if (timer) { clearInterval(timer); timer = null; }
    stopTracks(screenStream); stopTracks(camStream); stopTracks(micStream); stopTracks(canvasStream);
    screenStream = camStream = micStream = canvasStream = null;
    if (screenVideo) { screenVideo.srcObject = null; screenVideo.remove(); screenVideo = null; }
    if (camVideo) { camVideo.srcObject = null; camVideo.remove(); camVideo = null; }
    mediaRecorder = null;
    startedAt = 0; pausedTotal = 0; pausedAt = 0;
  }

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
    screenVideo = await makeVideo(screenStream);

    try {
      camStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: Object.assign({ width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } }, deviceConstraint(opts.cameraDeviceId))
      });
      camVideo = await makeVideo(camStream);
    } catch (err) {
      log('camera unavailable:', err.message, '— recording screen only');
      camStream = null;
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
  function drawCover(video, x, y, w, h, flipH, flipV) {
    const vw = video.videoWidth, vh = video.videoHeight;
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
    if (!ctx || !screenVideo) return;
    if (screenVideo.readyState >= 2) ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    const r = overlayRect();
    if (r && camVideo && camVideo.readyState >= 2) {
      const shape = Shapes.SHAPES[overlay.shape] || Shapes.SHAPES.circle;
      ctx.save();
      shape.path(ctx, r.x, r.y, r.w, r.h);
      ctx.clip();
      drawCover(camVideo, r.x, r.y, r.w, r.h, overlay.mirror, overlay.flipV);
      ctx.restore();
      if (overlay.border) {
        // Clip to the shape and stroke at double width: the outer half is
        // clipped away, leaving a ring fully inside the outline. This matches
        // how the live bubble draws its ring, for any shape.
        const bw = Math.max(2, Math.round(Math.min(r.w, r.h) * 0.024));
        ctx.save();
        shape.path(ctx, r.x, r.y, r.w, r.h);
        ctx.clip();
        shape.path(ctx, r.x, r.y, r.w, r.h);
        ctx.lineWidth = bw * 2;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.stroke();
        ctx.restore();
      }
    }
    if (videoTrack && videoTrack.requestFrame) videoTrack.requestFrame();
  }

  function pickMime() {
    const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
  }

  async function start(opts) {
    cleanup();
    fps = opts.fps || 30;
    overlay = opts.overlay;
    displayBounds = opts.displayBounds;
    try {
      await openStreams(opts);

      // Canvas size: source size scaled so height <= maxHeight (even numbers for encoders).
      const sw = screenVideo.videoWidth || 1920, sh = screenVideo.videoHeight || 1080;
      let scale = 1;
      if (opts.maxHeight && sh > opts.maxHeight) scale = opts.maxHeight / sh;
      canvas = document.createElement('canvas');
      canvas.width = Math.round(sw * scale / 2) * 2;
      canvas.height = Math.round(sh * scale / 2) * 2;
      ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

      canvasStream = canvas.captureStream(0); // we push frames manually for even pacing
      videoTrack = canvasStream.getVideoTracks()[0];
      const mixed = new MediaStream([videoTrack]);
      if (micStream) micStream.getAudioTracks().forEach((t) => mixed.addTrack(t));

      const pixels = canvas.width * canvas.height;
      const videoBitsPerSecond = Math.round(pixels * fps * 0.12); // ~12 Mbps @1080p30 — generous intermediate, we transcode after
      mediaRecorder = new MediaRecorder(mixed, { mimeType: pickMime(), videoBitsPerSecond, audioBitsPerSecond: 160000 });

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
        cleanup();
        window.api.send('recorder:done', { durationMs });
      };

      drawFrame();
      timer = setInterval(drawFrame, 1000 / fps);
      mediaRecorder.start(1000);
      startedAt = Date.now();
      log(`recording ${canvas.width}x${canvas.height} @${fps} ${mediaRecorder.mimeType}`);
      window.api.send('recorder:state', { state: 'recording', canvas: { width: canvas.width, height: canvas.height, fps, mime: mediaRecorder.mimeType } });
    } catch (err) {
      log('start failed:', err.name, err.message);
      let message = err.message;
      if (err.name === 'NotAllowedError') message = 'Permission denied. Check Windows Settings → Privacy → Camera / Microphone, and allow desktop apps.';
      if (err.name === 'NotReadableError') message = 'Device is busy or unreadable. Is another app using the camera or screen?';
      window.api.send('recorder:state', { state: 'error', message });
      cleanup();
    }
  }

  window.api.on('recorder:start', start);
  window.api.on('recorder:stop', () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === 'paused') { pausedTotal += Date.now() - pausedAt; pausedAt = 0; }
    if (timer) { clearInterval(timer); timer = null; }
    try { mediaRecorder.stop(); } catch (err) { log('stop failed', err.message); window.api.send('recorder:done', { durationMs: elapsed() }); cleanup(); }
  });
  window.api.on('recorder:pause', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') { mediaRecorder.pause(); pausedAt = Date.now(); }
  });
  window.api.on('recorder:resume', () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') { mediaRecorder.resume(); pausedTotal += Date.now() - pausedAt; pausedAt = 0; }
  });
  window.api.on('recorder:setMic', (on) => {
    if (micStream) micStream.getAudioTracks().forEach((t) => { t.enabled = !!on; });
  });
  window.api.on('recorder:updateOverlay', (o) => { overlay = o; });
})();
