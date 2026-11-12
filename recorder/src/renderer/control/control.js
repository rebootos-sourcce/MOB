/**
 * Control panel renderer.
 *
 * Laid out as the sequence you actually follow:
 *   1 check yourself (live camera preview + device pickers + mic meter)
 *   2 bubble look (shape, size, border)
 *   3 what to record (screen or window)
 *   4 output (collapsed; you set it once)
 * with a sticky record bar pinned to the bottom.
 *
 * All state lives in the main process; this file reads it, writes patches
 * back, and renders. The camera preview is stopped while recording so the
 * webcam is only opened by the bubble and the recorder engine.
 */
(function () {
  const $ = (id) => document.getElementById(id);
  let settings = null;
  let shapes = null;
  let recState = { state: 'idle', micEnabled: true, elapsedMs: 0 };
  let sources = [];
  let perms = { camera: 'unknown', microphone: 'unknown' };

  const fmtTime = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const p = (n) => String(n).padStart(2, '0');
    const h = Math.floor(s / 3600);
    return (h ? p(h) + ':' : '') + p(Math.floor((s % 3600) / 60)) + ':' + p(s % 60);
  };

  async function save(patch) { settings = await window.api.invoke('settings:set', patch); render(); }

  // ══════════════════════════════════════════════ 1 · camera preview
  // The preview doubles as the camera test: it shows the live feed in the
  // exact shape and flip that will be recorded, plus the resolution the
  // camera actually negotiated.
  let previewStream = null;
  let previewDevice = undefined;
  let previewWanted = true;

  function sizePreview() {
    if (!settings || !shapes) return;
    const shape = Shapes.SHAPES[settings.bubble.shape] || Shapes.SHAPES.circle;
    const wrap = $('previewShape').parentElement;
    const maxW = Math.max(120, wrap.clientWidth - 20);
    const maxH = 128;
    let h = maxH, w = h * shape.aspect;
    if (w > maxW) { w = maxW; h = w / shape.aspect; }
    w = Math.round(w); h = Math.round(h);
    const el = $('previewShape');
    const inner = $('previewInner');
    // Same ring maths as the bubble and the recorded overlay.
    const bw = Material.ringWidth(w, h, settings.bubble.border);
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.clipPath = shape.css(w, h);
    el.classList.toggle('no-border', bw === 0);
    inner.style.inset = bw + 'px';
    inner.style.clipPath = shape.css(Math.max(1, w - bw * 2), Math.max(1, h - bw * 2));
  }

  function applyPreviewFlip() {
    $('preview').classList.toggle('mirror', !!settings.bubble.mirror);
    $('preview').classList.toggle('flipv', !!settings.bubble.flipV);
    $('btnFlipH').classList.toggle('active', !!settings.bubble.mirror);
    $('btnFlipV').classList.toggle('active', !!settings.bubble.flipV);
  }

  function stopPreview() {
    if (previewStream) previewStream.getTracks().forEach((t) => t.stop());
    previewStream = null;
    previewDevice = undefined;
    $('preview').srcObject = null;
  }

  /** Friendly label for the camera currently selected, for error messages. */
  function currentCamLabel() {
    const sel = $('camSelect');
    const opt = sel.options[sel.selectedIndex];
    return opt && opt.value !== 'default' ? `"${opt.textContent}"` : 'your camera';
  }

  /** Shows the preview's empty state with an action the user can actually take. */
  function showPreviewProblem(text, actionLabel, onAction) {
    $('preview').srcObject = null;
    $('previewEmpty').hidden = false;
    $('previewEmptyText').textContent = text;
    const btn = $('previewAction');
    btn.hidden = !actionLabel;
    if (actionLabel) {
      btn.textContent = actionLabel;
      btn.onclick = onAction;
    }
  }

  async function openPreview(force) {
    if (!previewWanted) return;
    const id = settings.camera.deviceId;
    if (!force && id === previewDevice && previewStream) return;
    previewDevice = id;
    if (previewStream) previewStream.getTracks().forEach((t) => t.stop());
    previewStream = null;
    $('previewInfo').hidden = true;
    try {
      // Sized to the preview box, not an arbitrary 720p. The preview is about
      // 128 px tall, so a 720p decode every frame was almost entirely wasted.
      const w = Material.captureWidth($('previewShape').clientHeight || 160);
      const video = Object.assign({ width: { ideal: w }, height: { ideal: Math.round(w * 9 / 16) } },
        id && id !== 'default' ? { deviceId: { exact: id } } : {});
      previewStream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
      $('preview').srcObject = previewStream;
      $('previewEmpty').hidden = true;
      const track = previewStream.getVideoTracks()[0];
      // A camera can disconnect or fail mid-session; surface that instead of
      // leaving a frozen last frame on screen.
      track.addEventListener('ended', () => {
        if (!previewWanted) return;
        previewStream = null;
        showPreviewProblem('Camera disconnected.', 'Reconnect', () => openPreview(true));
        updateReadyBadge();
      });
      const show = () => {
        const st = track.getSettings ? track.getSettings() : {};
        if (st.width && st.height) {
          $('previewInfo').textContent = `${st.width}×${st.height}${st.frameRate ? ' · ' + Math.round(st.frameRate) + 'fps' : ''}`;
          $('previewInfo').hidden = false;
        }
      };
      show();
      setTimeout(show, 600); // track settings fill in a beat after start
      refreshDevices();      // labels appear once permission is granted
    } catch (err) {
      const openCamSettings = () => window.api.invoke('permissions:openSettings', 'camera');
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        showPreviewProblem('Camera blocked by Windows.', 'Open camera settings', openCamSettings);
      } else if (err.name === 'NotReadableError' || err.name === 'AbortError') {
        // Almost always another app holding the device, or a camera that has
        // wedged and needs a replug.
        showPreviewProblem(`Can't open ${currentCamLabel()}.\nAnother app may be using it, or it needs a replug.`, 'Try again', () => openPreview(true));
      } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        if (id && id !== 'default') {
          // A specific camera vanished (unplugged, or a driver that wedged).
          showPreviewProblem('That camera is no longer available.', 'Use default camera', () => save({ camera: { deviceId: 'default' } }));
        } else {
          showPreviewProblem('No camera found.\nPlug one in, or re-scan.', 'Re-scan', () => rescan());
        }
      } else {
        showPreviewProblem(err.message || 'Camera failed to start.', 'Try again', () => openPreview(true));
      }
    }
    await checkPermissions();
    updateReadyBadge();
  }

  /**
   * Windows 10 gates desktop apps behind one global privacy switch and never
   * prompts, so a blocked camera just fails silently. Read the real status and
   * offer the exact Settings page.
   */
  async function checkPermissions() {
    try { perms = await window.api.invoke('permissions:get'); } catch (_) { return; }
    const camDenied = perms.camera === 'denied';
    const micDenied = perms.microphone === 'denied';
    const banner = $('permBanner');
    banner.hidden = !(camDenied || micDenied);
    if (banner.hidden) return;
    const both = camDenied && micDenied;
    $('permText').textContent = both
      ? 'Windows is blocking camera and microphone access for desktop apps. Turn both on, then hit Retry.'
      : camDenied
        ? 'Windows is blocking camera access for desktop apps. Turn it on, then hit Retry.'
        : 'Windows is blocking microphone access for desktop apps. Turn it on, then hit Retry.';
    $('permOpenCam').hidden = !camDenied;
    $('permOpenMic').hidden = !micDenied;
  }

  function updateReadyBadge() {
    const b = $('readyBadge');
    const cam = !!previewStream;
    const mic = !!analyser;
    b.className = 'badge ' + (cam && mic ? 'ok' : cam || mic ? 'warn' : 'bad');
    b.textContent = cam && mic ? 'Camera + mic ready'
      : cam ? 'No mic'
        : mic ? (perms.camera === 'denied' ? 'Camera blocked' : 'No camera')
          : (perms.camera === 'denied' ? 'Blocked by Windows' : 'No camera or mic');
  }

  $('permOpenCam').addEventListener('click', () => window.api.invoke('permissions:openSettings', 'camera'));
  $('permOpenMic').addEventListener('click', () => window.api.invoke('permissions:openSettings', 'microphone'));
  $('permRetry').addEventListener('click', () => rescan());
  $('btnRescan').addEventListener('click', () => rescan());

  /** Re-reads permissions, the device list, and reopens both streams. */
  async function rescan() {
    $('btnRescan').disabled = true;
    try {
      await checkPermissions();
      await refreshDevices();
      await openPreview(true);
      await openMeter(true);
    } finally {
      $('btnRescan').disabled = false;
    }
  }

  $('btnFlipH').addEventListener('click', () => save({ bubble: { mirror: !settings.bubble.mirror } }));
  $('btnFlipV').addEventListener('click', () => save({ bubble: { flipV: !settings.bubble.flipV } }));

  // ══════════════════════════════════════════════ devices
  async function refreshDevices() {
    let devs = [];
    try { devs = await navigator.mediaDevices.enumerateDevices(); } catch (_) { /* ignore */ }
    fill($('camSelect'), devs.filter((d) => d.kind === 'videoinput'), settings.camera.deviceId, 'Camera');
    fill($('micSelect'), devs.filter((d) => d.kind === 'audioinput'), settings.mic.deviceId, 'Microphone');
  }
  function fill(sel, devs, current, fallback) {
    const prev = sel.value;
    sel.innerHTML = '';
    const def = document.createElement('option');
    def.value = 'default'; def.textContent = 'System default';
    sel.appendChild(def);
    devs.filter((d) => d.deviceId && d.deviceId !== 'default').forEach((d, i) => {
      const o = document.createElement('option');
      o.value = d.deviceId;
      o.textContent = d.label || `${fallback} ${i + 1}`;
      sel.appendChild(o);
    });
    const want = current || prev;
    sel.value = [...sel.options].some((o) => o.value === want) ? want : 'default';
  }
  $('camSelect').addEventListener('change', (e) => save({ camera: { deviceId: e.target.value } }));
  $('micSelect').addEventListener('change', (e) => save({ mic: { deviceId: e.target.value } }));
  navigator.mediaDevices.addEventListener('devicechange', () => { refreshDevices(); openPreview(true); openMeter(true); });

  // ══════════════════════════════════════════════ mic meter
  let meterStream = null, meterDevice = undefined, analyser = null, audioCtx = null, meterData = null, peakHold = 0;

  async function openMeter(force) {
    const id = settings.mic.deviceId;
    if (!force && id === meterDevice && meterStream) return;
    meterDevice = id;
    if (meterStream) meterStream.getTracks().forEach((t) => t.stop());
    meterStream = null; analyser = null;
    try {
      meterStream = await navigator.mediaDevices.getUserMedia({
        audio: Object.assign({ echoCancellation: true }, id && id !== 'default' ? { deviceId: { exact: id } } : {}),
        video: false
      });
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.55;
      audioCtx.createMediaStreamSource(meterStream).connect(analyser);
      meterData = new Float32Array(analyser.fftSize);
      refreshDevices();
    } catch (err) {
      analyser = null;
      $('meterDb').textContent = err.name === 'NotAllowedError' ? 'blocked'
        : err.name === 'NotReadableError' ? 'busy' : 'no mic';
    }
    await checkPermissions();
    updateReadyBadge();
  }

  // The meter used to redraw two canvases on every animation frame, forever,
  // whether or not it was visible. A level meter reads fine at 20 Hz, and
  // there is no reason to run at all when the window is hidden or the panel
  // is showing something else.
  const METER_HZ = 20;
  let meterTimer = null;
  let lastLevel = -1;

  function meterShouldRun() {
    if (document.hidden) return false;
    // In compact mode only the small meter is on screen; when idle the big
    // one is. Either way something is visible, so run. Nothing visible when
    // the source picker is covering the panel.
    return !($('picker') && !$('picker').hidden);
  }

  function drawMeter() {
    if (!meterShouldRun()) return;
    let rms = 0;
    if (analyser) {
      analyser.getFloatTimeDomainData(meterData);
      let sum = 0;
      for (let i = 0; i < meterData.length; i++) sum += meterData[i] * meterData[i];
      rms = Math.sqrt(sum / meterData.length);
    }
    const db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
    const level = Math.max(0, Math.min(1, (db + 60) / 60)); // -60 dB … 0 dB
    peakHold = Math.max(level, peakHold - 0.036);           // ~0.7/s at 20 Hz
    const muted = !settings || !settings.mic.enabled;

    // Nothing moved and nothing is holding: skip the repaint entirely.
    const quantised = Math.round(level * 200) + (muted ? 1000 : 0);
    if (quantised === lastLevel && peakHold <= 0.02) return;
    lastLevel = quantised;

    const compact = document.body.classList.contains('compact');
    for (const c of compact ? [$('cMeter')] : [$('meter')]) {
      if (!c || !c.width) continue;
      const g = c.getContext('2d');
      const W = c.width, H = c.height;
      g.clearRect(0, 0, W, H);
      const segs = W > 100 ? 28 : 11, gap = 2, sw = (W - gap * (segs + 1)) / segs;
      for (let i = 0; i < segs; i++) {
        const t = i / segs;
        const on = t < level;
        const col = t > 0.9 ? '#ff3b30' : t > 0.72 ? '#ffb300' : '#34c759';
        g.fillStyle = muted ? (on ? 'rgba(150,150,150,.5)' : 'rgba(255,255,255,.06)') : (on ? col : 'rgba(255,255,255,.07)');
        g.fillRect(gap + i * (sw + gap), 3, sw, H - 6);
      }
      if (peakHold > 0.02) {
        g.fillStyle = muted ? 'rgba(200,200,200,.6)' : '#fff';
        g.fillRect(gap + Math.min(segs - 1, Math.floor(peakHold * segs)) * (sw + gap), 3, 2, H - 6);
      }
    }
    $('meterDb').textContent = muted ? 'muted' : (db === -Infinity ? '–∞' : db.toFixed(0) + ' dB');
  }

  function startMeter() {
    if (meterTimer) return;
    meterTimer = setInterval(drawMeter, 1000 / METER_HZ);
  }
  function stopMeter() {
    if (meterTimer) { clearInterval(meterTimer); meterTimer = null; }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMeter(); else startMeter();
  });

  function sizeMeter() {
    const c = $('meter');
    const w = Math.max(60, c.clientWidth);
    if (c.width !== w) c.width = w;
  }

  $('btnMic').addEventListener('click', () => window.api.invoke('mic:set', !settings.mic.enabled));
  $('cMic').addEventListener('click', () => window.api.invoke('mic:set', !settings.mic.enabled));

  // ══════════════════════════════════════════════ 2 · shape & size
  function buildShapeChips() {
    const row = $('shapeRow');
    row.innerHTML = '';
    for (const id of shapes.order) {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.dataset.shape = id;
      chip.title = shapes.labels[id];
      const sh = Shapes.SHAPES[id];
      const sw = document.createElement('span');
      sw.className = 'swatch';
      const base = 22;
      const w = sh.aspect >= 1 ? base : Math.round(base * sh.aspect);
      const h = sh.aspect >= 1 ? Math.round(base / sh.aspect) : base;
      sw.style.width = w + 'px'; sw.style.height = h + 'px';
      sw.style.clipPath = sh.css(w, h);
      chip.appendChild(sw);
      chip.addEventListener('click', () => save({ bubble: { shape: id } }));
      row.appendChild(chip);
    }
    const sc = $('sizeChips');
    sc.innerHTML = '';
    for (const [k, v] of Object.entries(shapes.sizes)) {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.dataset.size = v;
      chip.textContent = k[0].toUpperCase();
      chip.title = `${k} (${v}px)`;
      chip.addEventListener('click', () => save({ bubble: { size: v } }));
      sc.appendChild(chip);
    }
  }

  let sliderTimer = null;
  $('sizeSlider').addEventListener('input', (e) => {
    $('sizeVal').textContent = e.target.value + 'px';
    clearTimeout(sliderTimer);
    sliderTimer = setTimeout(() => save({ bubble: { size: Number(e.target.value) } }), 60);
  });

  const toggles = {
    tBorder: (v) => ({ bubble: { border: v } }),
    tVisible: (v) => ({ bubble: { visible: v } }),
    tExclude: (v) => ({ bubble: { excludeFromCapture: v } }),
    tAsk: (v) => ({ recording: { askWhereToSave: v } }),
    tCompact: (v) => ({ recording: { compactWhileRecording: v } })
  };
  for (const [id, fn] of Object.entries(toggles)) $(id).addEventListener('change', (e) => save(fn(e.target.checked)));

  // ══════════════════════════════════════════════ 3 · source
  async function loadSources() {
    sources = await window.api.invoke('sources:list');
    renderPicker();
    renderSourceCard();
  }
  function renderSourceCard() {
    const s = settings.source;
    const cur = sources.find((x) => x.id === s.id)
      || (s.kind === 'screen' && s.displayId ? sources.find((x) => x.kind === 'screen' && String(x.displayId) === String(s.displayId)) : null);
    const show = cur || sources.find((x) => x.kind === 'screen');
    $('sourceName').textContent = show ? show.name : (s.name || 'Primary display');
    $('sourceKind').textContent = !show ? 'Full screen'
      : show.kind === 'screen' ? `Full screen${show.detail ? ' · ' + show.detail : ''}`
        : 'Single window · bubble sits bottom-right';
    if (show && show.thumbnail) $('sourceThumb').src = show.thumbnail; else $('sourceThumb').removeAttribute('src');
  }
  function renderPicker() {
    const mk = (list, el) => {
      el.innerHTML = '';
      for (const src of list) {
        const t = document.createElement('button');
        t.className = 'tile' + (src.id === settings.source.id ? ' active' : '');
        const img = document.createElement('img');
        img.className = 'thumb';
        if (src.thumbnail) img.src = src.thumbnail;
        const name = document.createElement('div');
        name.className = 'name';
        if (src.appIcon) { const ic = document.createElement('img'); ic.src = src.appIcon; name.appendChild(ic); }
        name.appendChild(document.createTextNode(src.name));
        t.append(img, name);
        t.addEventListener('click', async () => {
          await save({ source: { id: src.id, name: src.name, kind: src.kind, displayId: src.displayId } });
          $('picker').hidden = true;
        });
        el.appendChild(t);
      }
    };
    mk(sources.filter((s) => s.kind === 'screen'), $('pickScreens'));
    mk(sources.filter((s) => s.kind === 'window'), $('pickWindows'));
  }
  $('btnChangeSource').addEventListener('click', async () => { $('picker').hidden = false; await loadSources(); });
  $('pickerRefresh').addEventListener('click', loadSources);
  $('pickerClose').addEventListener('click', () => { $('picker').hidden = true; });

  // ══════════════════════════════════════════════ 4 · output
  function bindSeg(id, get, set) {
    const seg = $(id);
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]');
      if (b && !b.disabled) set(b.dataset.v);
    });
    return () => {
      const v = String(get());
      seg.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.v === v));
    };
  }
  const renderSegs = [
    bindSeg('formatSeg', () => settings.recording.format, (v) => save({ recording: { format: v } })),
    bindSeg('qualitySeg', () => settings.recording.quality, (v) => save({ recording: { quality: v } })),
    bindSeg('resSeg', () => settings.recording.maxHeight, (v) => save({ recording: { maxHeight: Number(v) } })),
    bindSeg('fpsSeg', () => settings.recording.fps, (v) => save({ recording: { fps: Number(v) } })),
    bindSeg('cdSeg', () => settings.recording.countdown, (v) => save({ recording: { countdown: Number(v) } }))
  ];
  $('btnSaveDir').addEventListener('click', async () => {
    const d = await window.api.invoke('dialog:chooseSaveDir');
    if (d) { settings.recording.saveDir = d; render(); }
  });

  // ── Cloudflare config UI ──────────────────────────────────────
  async function loadCfConfig() {
    try {
      const cfg = await window.api.invoke('cf:getConfig');
      const badge = $('cfStatusBadge');
      if (cfg.configured && cfg.tokenStored) {
        badge.textContent = 'configured';
        badge.classList.add('ok');
        if (cfg.workerUrl) $('cfWorkerUrl').value = cfg.workerUrl;
      } else if (cfg.configured) {
        badge.textContent = 'token missing';
        badge.classList.remove('ok');
        if (cfg.workerUrl) $('cfWorkerUrl').value = cfg.workerUrl;
      } else {
        badge.textContent = 'not configured';
        badge.classList.remove('ok');
      }
    } catch (_) {}
  }
  loadCfConfig();

  $('outputCard').addEventListener('toggle', () => {
    if ($('outputCard').open) loadCfConfig();
  });

  $('btnSaveCf').addEventListener('click', async () => {
    const workerUrl = $('cfWorkerUrl').value.trim();
    const apiToken  = $('cfApiToken').value.trim();
    try {
      await window.api.invoke('cf:setConfig', { workerUrl, apiToken });
      $('cfApiToken').value = '';
      await loadCfConfig();
    } catch (err) {
      const badge = $('cfStatusBadge');
      badge.textContent = 'save failed: ' + err.message;
      badge.classList.remove('ok');
    }
  });

  // ══════════════════════════════════════════════ recording
  $('btnRecord').addEventListener('click', () => {
    window.api.invoke(recState.state === 'idle' ? 'recording:start' : 'recording:stop');
  });
  $('btnStop').addEventListener('click', () => window.api.invoke('recording:stop'));
  $('cStop').addEventListener('click', () => window.api.invoke('recording:stop'));
  $('btnPause').addEventListener('click', () => window.api.invoke('recording:togglePause'));
  $('cPause').addEventListener('click', () => window.api.invoke('recording:togglePause'));
  $('btnMin').addEventListener('click', () => window.api.invoke('window:minimize'));
  $('btnClose').addEventListener('click', () => window.api.invoke('window:close'));
  $('btnDismissSaved').addEventListener('click', () => { $('savedCard').hidden = true; });

  let lastSaved = null;
  $('btnOpenFile').addEventListener('click', () => lastSaved && window.api.invoke('shell:openPath', lastSaved));
  $('btnShowFolder').addEventListener('click', () => lastSaved && window.api.invoke('shell:showItemInFolder', lastSaved));

  function renderRecState() {
    const st = recState.state;
    const live = st === 'recording' || st === 'paused';
    const starting = st === 'arming' || st === 'countdown';
    const btn = $('btnRecord');
    btn.classList.toggle('busy', live || st === 'finalizing');
    btn.classList.toggle('arming', starting);
    btn.disabled = st === 'finalizing';
    btn.title = st === 'idle' ? 'Start recording (Ctrl+Shift+R)' : 'Stop recording (Ctrl+Shift+R)';
    $('statusLine').textContent = {
      idle: 'Ready to record', arming: 'Opening camera and mic…', countdown: 'Get ready…',
      recording: 'Recording', paused: 'Paused', finalizing: 'Saving…'
    }[st] || st;
    $('timer').hidden = !live;
    $('timer').textContent = fmtTime(recState.elapsedMs || 0);
    $('cTimer').textContent = fmtTime(recState.elapsedMs || 0);
    $('recActions').hidden = !live;
    $('recHint').hidden = live || st === 'finalizing' || starting;
    $('finalizeBox').hidden = st !== 'finalizing';
    $('btnPause').textContent = st === 'paused' ? 'Resume' : 'Pause';
    $('cPause').textContent = st === 'paused' ? '▶' : '⏸';
    $('cDot').classList.toggle('paused', st === 'paused');
    const micOn = settings && settings.mic.enabled;
    $('btnMic').textContent = micOn ? 'On' : 'Off';
    $('btnMic').classList.toggle('off', !micOn);
    $('cMic').classList.toggle('off', !micOn);
    $('message').hidden = !recState.message;
    $('message').textContent = recState.message || '';
    // Device problems used to be logged into a hidden window and never shown,
    // so a take could finish with no camera or no audio and nothing said so.
    const warns = recState.warnings || [];
    $('warnBanner').hidden = warns.length === 0;
    $('warnBanner').textContent = warns.join('\n');

    // Free the webcam while recording: the bubble and the engine own it then.
    const wantPreview = st === 'idle' || st === 'arming';
    if (wantPreview !== previewWanted) {
      previewWanted = wantPreview;
      if (wantPreview) openPreview(true); else stopPreview();
    }
  }

  window.api.on('recording:state', (st) => {
    if (st.message !== undefined) recState.message = st.message;
    Object.assign(recState, st);
    if (settings) {
      if (st.micEnabled !== undefined) settings.mic.enabled = st.micEnabled;
      if (st.bubbleVisible !== undefined) settings.bubble.visible = st.bubbleVisible;
    }
    if (st.state === 'recording') $('savedCard').hidden = true;
    renderRecState();
    if (settings) $('tVisible').checked = !!settings.bubble.visible;
  });
  window.api.on('finalize:progress', (p) => { $('finalizeBar').style.width = Math.round(p * 100) + '%'; });
  window.api.on('finalize:done', ({ path, note }) => {
    lastSaved = path;
    $('savedPath').textContent = path;
    $('savedCard').hidden = false;
    $('finalizeBar').style.width = '0%';
    $('savedCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (note) { recState.message = note; renderRecState(); }
  });
  window.api.on('finalize:error', ({ message, rawPath }) => {
    recState.message = 'Saving failed: ' + message + '\nRaw recording kept at ' + rawPath;
    renderRecState();
  });
  window.api.on('ui:compact', (on) => document.body.classList.toggle('compact', on));
  window.api.on('ui:countdown', (n) => { $('countdown').hidden = !n; $('countdown').textContent = n || ''; });
  window.api.on('settings:changed', (s) => { settings = s; render(); openPreview(false); openMeter(false); });

  // ══════════════════════════════════════════════ render
  function render() {
    if (!settings || !shapes) return;
    renderSegs.forEach((f) => f());
    const mp4 = settings.recording.format === 'mp4';
    $('codecField').hidden = !mp4;
    $('qualityField').hidden = !mp4;
    $('codecSelect').value = settings.recording.codec;
    $('outputSummary').textContent = mp4
      ? `${settings.recording.format.toUpperCase()} · ${(settings.recording.codec || '').replace('_', ' ')} · ${settings.recording.maxHeight || 'native'}${settings.recording.maxHeight ? 'p' : ''} · ${settings.recording.fps}fps`
      : `WebM · ${settings.recording.maxHeight || 'native'}${settings.recording.maxHeight ? 'p' : ''} · ${settings.recording.fps}fps`;

    document.querySelectorAll('#shapeRow .chip').forEach((c) => c.classList.toggle('active', c.dataset.shape === settings.bubble.shape));
    document.querySelectorAll('#sizeChips .chip').forEach((c) => c.classList.toggle('active', Number(c.dataset.size) === settings.bubble.size));
    $('sizeSlider').value = settings.bubble.size;
    $('sizeVal').textContent = settings.bubble.size + 'px';
    $('tBorder').checked = !!settings.bubble.border;
    $('tVisible').checked = !!settings.bubble.visible;
    $('tExclude').checked = !!settings.bubble.excludeFromCapture;
    $('tAsk').checked = !!settings.recording.askWhereToSave;
    $('tCompact').checked = !!settings.recording.compactWhileRecording;
    // Show the tail of the path: the folder you're saving into matters more
    // than the drive it lives on, and the row is narrow.
    const dir = settings.recording.saveDir || '';
    $('saveDir').textContent = dir.length > 30 ? '…' + dir.slice(-29) : dir;
    $('saveDir').title = dir;
    for (const [sel, want] of [[$('camSelect'), settings.camera.deviceId], [$('micSelect'), settings.mic.deviceId]]) {
      if (sel.options.length && [...sel.options].some((o) => o.value === want)) sel.value = want;
    }
    applyPreviewFlip();
    sizePreview();
    sizeMeter();
    renderSourceCard();
    renderRecState();
  }

  window.addEventListener('resize', () => { sizePreview(); sizeMeter(); });

  // A hidden or minimised panel does not need a decoded camera feed. The
  // bubble keeps its own, so nothing visible is lost.
  document.addEventListener('visibilitychange', () => {
    if (!settings) return;
    if (document.hidden) {
      if (previewStream) stopPreview();
    } else if (recState.state === 'idle' || recState.state === 'arming') {
      openPreview(true);
    }
  });

  async function init() {
   try {
    [settings, shapes] = await Promise.all([
      window.api.invoke('settings:get'),
      window.api.invoke('shapes:list')
    ]);
    buildShapeChips();
    const cs = $('codecSelect');
    cs.addEventListener('change', (e) => save({ recording: { codec: e.target.value } }));

    // Listing codecs spawns ffmpeg and parses several megabytes of output.
    // It only matters once the Output section is opened, so it must not hold
    // up first paint.
    window.api.invoke('codecs:list').then((codecs) => {
      cs.innerHTML = '';
      for (const c of codecs) {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.label + (c.available ? '' : ' — unavailable');
        o.disabled = !c.available;
        cs.appendChild(o);
      }
      if (settings) cs.value = settings.recording.codec;
    }).catch(() => { /* the Output section just shows the stored value */ });

    recState = await window.api.invoke('state:get');
    render();
    await checkPermissions();
    await refreshDevices();
    openPreview(true);
    openMeter(true);
    startMeter();
    loadSources();

    // ── voice commands ────────────────────────────────────────────────────
    initVoice();
   } catch (err) {
    // Neither startup invoke had a .catch() before — a rejection here (main
    // process not ready, IPC error) meant render() never ran and the panel
    // stayed permanently blank with nothing telling the user why.
    console.error('[control] init failed:', err);
    const status = $('statusLine');
    if (status) status.textContent = 'Failed to start: ' + err.message;
   }
  }

  // ── voice UI ─────────────────────────────────────────────────────────────
  let voiceEnabled = false;

  function setVoiceUI(listening, label, cmd) {
    const pulse = $('voicePulse');
    const lbl   = $('voiceLabel');
    const cmdEl = $('voiceCmd');
    if (!pulse) return;
    pulse.classList.toggle('listening', !!listening);
    lbl.textContent = label;
    if (cmd) {
      cmdEl.textContent = cmd;
      cmdEl.hidden = false;
      setTimeout(() => { cmdEl.hidden = true; }, 3000);
    }
    const btn = $('btnVoice');
    if (btn) btn.classList.toggle('active', voiceEnabled);
  }

  async function initVoice() {
    try {
      const { enabled } = await window.api.invoke('voice:init');
      voiceEnabled = !!enabled;
      setVoiceUI(false, voiceEnabled ? 'voice ready' : 'voice off', null);
    } catch (_) {
      // voice module not available — silently leave indicator grey
    }

    window.api.on('voice:listening', (listening) => {
      setVoiceUI(listening, listening ? 'listening…' : 'voice ready', null);
    });

    const btnVoice = $('btnVoice');
    if (btnVoice) {
      btnVoice.addEventListener('click', async () => {
        try {
          if (voiceEnabled) {
            await window.api.invoke('voice:stop');
            voiceEnabled = false;
            setVoiceUI(false, 'voice off', null);
          } else {
            const { enabled } = await window.api.invoke('voice:init');
            voiceEnabled = !!enabled;
            setVoiceUI(false, voiceEnabled ? 'voice ready' : 'voice off', null);
          }
        } catch (err) {
          setVoiceUI(false, 'voice error', null);
        }
      });
    }
  }

  init();
})();

// ── Update banner + transcription progress (top-level, runs after DOM ready) ──
(function () {
  // Update notification banner
  window.api.on('ui:update-ready', () => {
    const banner = document.getElementById('updateBanner');
    if (banner) banner.hidden = false;
  });
  const btnRestart = document.getElementById('btnRestartUpdate');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      window.api.invoke('app:restart').catch(() => {});
    });
  }

  // Transcription progress (new detailed bar, reuses transcription:progress channel)
  window.api.on('transcription:progress', (data) => {
    const bar  = document.getElementById('transcribeProgressBar');
    const lbl  = document.getElementById('transcribeProgressLabel');
    const pct  = document.getElementById('transcribeProgressPct');
    const fill = document.getElementById('transcribeProgressFill');
    if (!bar) return;
    bar.hidden = false;
    if (data.stage === 'downloading_model') {
      lbl.textContent = data.cached === false ? 'Downloading Whisper model (~150 MB)…' : 'Loading model…';
    } else if (data.stage === 'loading_model') {
      lbl.textContent = 'Loading Whisper model…';
    } else if (data.stage === 'transcribing') {
      lbl.textContent = 'Transcribing…' + (data.elapsedMs ? ` (${Math.round(data.elapsedMs / 1000)}s)` : '');
    } else if (data.stage === 'done' || data.stage === 'model_ready') {
      setTimeout(() => { bar.hidden = true; }, 1500);
    }
    if (data.pct != null) {
      pct.textContent = data.pct + '%';
      fill.style.width = data.pct + '%';
    }
  });

  // Copy buttons (delegated)
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const targetId = btn.dataset.target;
    const el = targetId ? document.getElementById(targetId) : null;
    if (!el) return;
    const text = el.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1500);
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });

  // Copy All button
  const btnCopyAll = document.getElementById('btnCopyAll');
  if (btnCopyAll) {
    btnCopyAll.addEventListener('click', async () => {
      const title = document.getElementById('prodTitleEdit')?.textContent?.trim() || '';
      const desc  = document.getElementById('prodDescEdit')?.textContent?.trim()  || '';
      const tags  = document.getElementById('prodHashtagsEdit')?.textContent?.trim() || '';
      const all   = [title, desc, tags].filter(Boolean).join('\n\n');
      try {
        await navigator.clipboard.writeText(all);
        btnCopyAll.textContent = 'Copied!';
        setTimeout(() => { btnCopyAll.textContent = 'Copy All'; }, 1500);
      } catch (_) {}
    });
  }
})();

// ── Four-mode tab bar ────────────────────────────────────────
(function () {
  const $ = (id) => document.getElementById(id);
  const fmtMs = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return h ? `${h}:${String(m % 60).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
             : `${m}:${String(s % 60).padStart(2,'0')}`;
  };

  // Tab switching
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }

      // See clearSelectedRecording's comment above: a selection made in one
      // of these tabs must not silently carry over into another.
      clearSelectedRecording();

      if (btn.dataset.tab === 'edit')         loadEditTab();
      if (btn.dataset.tab === 'production')   loadProductionTab();
      if (btn.dataset.tab === 'distribution') loadDistributionTab();
    });
  });

  // ── Shared state ─────────────────────────────────────────────
  // selectedRecordingId is shared across the edit/production/distribution
  // tabs (one variable, three recording lists). Left alone, selecting a
  // recording in one tab and then switching to another with nothing
  // clicked there yet meant that tab's action buttons silently acted on
  // whatever was selected elsewhere — e.g. select recording A in Edit,
  // switch to Distribution with no row clicked, hit Upload, and it
  // uploads A instead of saying "select a recording first." Clearing the
  // selection (and hiding every tab's stale detail panel) on every tab
  // switch and every delete makes each tab's selection genuinely its own.
  let selectedRecordingId = null;
  let _currentPkgId = null;

  function clearSelectedRecording() {
    selectedRecordingId = null;
    ['editCutSection', 'prodPackageSection', 'distSection'].forEach(id => {
      const el = $(id);
      if (el) el.hidden = true;
    });
  }

  // Save production metadata edits on blur (capture phase)
  document.addEventListener('blur', async (e) => {
    const el = e.target.closest('.prod-editable');
    if (!el || !_currentPkgId) return;
    const field = el.dataset.field;
    if (!field) return;
    const value = el.textContent.trim() || null;
    // Only the field that just blurred goes in the payload — sending the
    // other two edited_* keys as null here is what used to wipe them.
    const payload = { id: _currentPkgId };
    if (field === 'edited_hashtags_json') {
      payload.edited_hashtags_json = value ? value.split(/\s+/).map(t => t.replace(/^#/, '')) : null;
    } else {
      payload[field] = value;
    }
    try {
      await window.mob.db.mutate('packages:update', payload);
    } catch (err) {
      console.warn('[control] failed to save edit:', err.message);
    }
  }, true);

  // Waveform
  let _waveform = null;
  function initWaveform() {
    const canvas = $('waveformCanvas');
    if (!canvas || _waveform) return;
    if (typeof WaveformRenderer !== 'undefined') {
      _waveform = new WaveformRenderer(canvas);
      // The waveform already emitted a 'seek' event on click — nothing was
      // listening, since there was no in-app player to seek. Registered
      // once here (not per-recording-select) since _waveform persists
      // across selections and .on() has no dedup.
      _waveform.on('seek', ({ ms }) => {
        const video = $('editPreviewVideo');
        if (video && !video.hidden && isFinite(video.duration)) {
          video.currentTime = Math.max(0, ms / 1000);
        }
      });
    }
  }
  async function loadWaveform(recordingPath) {
    if (!recordingPath) return;
    const wrap = $('waveformWrap');
    if (!_waveform) initWaveform();
    if (!_waveform) return;
    if (wrap) wrap.hidden = false;
    try {
      const { peaks, durationMs } = await window.api.invoke('waveform:load', recordingPath);
      if (typeof _waveform.loadPeaks === 'function') _waveform.loadPeaks(peaks, durationMs);
    } catch (err) {
      console.warn('[waveform] load failed:', err.message);
      if (wrap) wrap.hidden = true;
    }
  }

  // #52: per-container search/sort state for the (shared) recording list.
  // One Map entry per containerId (editRecordingList/prodRecordingList/
  // distRecordingList) so each tab's list keeps its own search/sort choice
  // across reloads (tab switches, thumbnail-ready refreshes, deletes).
  const _libraryState = new Map();
  function getLibraryState(containerId) {
    if (!_libraryState.has(containerId)) _libraryState.set(containerId, { sort: 'date-desc', search: '' });
    return _libraryState.get(containerId);
  }

  // Builds the search/sort toolbar once per container and reuses it on
  // every later loadRecordingList() call for the same container — at 50+
  // recordings the flat list was already unusable for finding anything,
  // with no search, sort, filter, or rename (recordings.title existed in
  // the schema and was never written by any UI).
  function ensureLibraryToolbar(containerId, list, state, onReload) {
    const toolbarId = containerId + 'Toolbar';
    let toolbar = $(toolbarId);
    if (toolbar) return;
    toolbar = document.createElement('div');
    toolbar.id = toolbarId;
    toolbar.className = 'row';
    toolbar.style.cssText = 'gap:6px;margin-bottom:8px;align-items:center;';

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'text-input';
    search.placeholder = 'Search title, filename, or transcript…';
    search.style.flex = '1';
    search.value = state.search;

    const sort = document.createElement('select');
    [
      ['date-desc', 'Newest first'],
      ['date-asc', 'Oldest first'],
      ['dur-desc', 'Longest first'],
      ['dur-asc', 'Shortest first'],
    ].forEach(([v, label]) => {
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = label;
      sort.appendChild(opt);
    });
    sort.value = state.sort;

    let debounceTimer = null;
    search.addEventListener('input', () => {
      state.search = search.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(onReload, 250);
    });
    sort.addEventListener('change', () => { state.sort = sort.value; onReload(); });

    toolbar.append(search, sort);
    list.parentNode.insertBefore(toolbar, list);
  }

  async function loadRecordingList(containerId, onSelect) {
    const list = $(containerId);
    if (!list) return;
    const state = getLibraryState(containerId);
    ensureLibraryToolbar(containerId, list, state, () => loadRecordingList(containerId, onSelect));

    // Fix #1: named query API; Fix #13: build DOM nodes — no dynamic innerHTML
    let rows = await window.mob.db.query('recordings:list');

    const term = state.search.trim();
    if (term) {
      try {
        const matches = await window.mob.db.query('recordings:search', [term]);
        const matchIds = new Set(matches.map(m => m.id));
        rows = rows.filter(r => matchIds.has(r.id));
      } catch (_) { /* search query failed — fall back to the unfiltered list */ }
    }

    // recordings:list is already ORDER BY created_at DESC — only re-sort
    // when the user picked something else, to avoid a needless re-sort of
    // an already-correctly-ordered list on the common default path.
    if (state.sort === 'date-asc') rows = rows.slice().reverse();
    else if (state.sort === 'dur-desc') rows = rows.slice().sort((a, b) => (b.duration_ms || 0) - (a.duration_ms || 0));
    else if (state.sort === 'dur-asc') rows = rows.slice().sort((a, b) => (a.duration_ms || 0) - (b.duration_ms || 0));

    if (!rows.length) {
      list.innerHTML = `<div class="empty-hint">${term ? 'No recordings match your search.' : 'No recordings yet.'}</div>`;
      return;
    }
    list.innerHTML = '';
    rows.slice(0, 50).forEach(r => {
      const name = r.path.split(/[\\/]/).pop();
      const displayName = (r.title && r.title.trim()) || name;
      const item = document.createElement('div');
      item.className = 'recording-item';
      item.dataset.id = r.id;
      item.title = r.path;
      // recordings.thumb existed in the schema with nothing ever writing it;
      // main.js now generates one after finalize and broadcasts
      // recording:thumbReady — the listener below patches it in live.
      if (r.thumb) {
        const thumb = document.createElement('img');
        thumb.className = 'rec-thumb';
        thumb.style.cssText = 'width:40px;height:24px;object-fit:cover;border-radius:4px;flex:none;margin-right:6px;background:#000';
        thumb.src = 'file://' + r.thumb;
        thumb.onerror = () => thumb.remove();
        item.appendChild(thumb);
      }
      const nameSpan = document.createElement('span'); nameSpan.className = 'rec-name'; nameSpan.textContent = displayName;
      nameSpan.title = 'Double-click to rename';
      // #52: rename — recordings.title had no writer anywhere in the app.
      nameSpan.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input';
        input.value = displayName;
        input.style.flex = '1';
        let settled = false;
        const commit = async () => {
          if (settled) return;
          settled = true;
          const newTitle = input.value.trim();
          input.replaceWith(nameSpan);
          if (newTitle && newTitle !== displayName) {
            try {
              await window.mob.db.mutate('recordings:rename', { id: r.id, title: newTitle });
              nameSpan.textContent = newTitle;
            } catch (_) { /* leave the old name shown on failure */ }
          }
        };
        input.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter') input.blur();
          else if (ke.key === 'Escape') { input.value = displayName; input.blur(); }
        });
        input.addEventListener('blur', commit, { once: true });
        nameSpan.replaceWith(input);
        input.focus();
        input.select();
      });
      const durSpan  = document.createElement('span'); durSpan.className  = 'rec-dur';  durSpan.textContent  = fmtMs(r.duration_ms || 0);
      const badge    = document.createElement('span'); badge.className    = 'badge';    badge.textContent    = r.status || ''; badge.style.fontSize = '10px';
      const delBtn   = document.createElement('button'); delBtn.className = 'ghost rec-del'; delBtn.textContent = '✕'; delBtn.title = 'Delete recording';
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this recording and remove the file from disk?\nThis cannot be undone.')) return;
        await window.api.invoke('recording:delete', { recordingId: r.id, deleteFile: true });
        // Null out the id AND hide every tab's detail panel — otherwise a
        // panel left open elsewhere (not just this list's own) keeps
        // showing the just-deleted recording's stale title/transcript/etc.
        if (selectedRecordingId === r.id) { clearSelectedRecording(); }
        await loadRecordingList(containerId, onSelect);
      });
      item.append(nameSpan, durSpan, badge, delBtn);
      list.appendChild(item);
    });
    list.querySelectorAll('.recording-item').forEach(item => {
      item.addEventListener('click', () => {
        list.querySelectorAll('.recording-item').forEach(x => x.classList.remove('selected'));
        item.classList.add('selected');
        selectedRecordingId = item.dataset.id;
        if (onSelect) onSelect(item.dataset.id, rows.find(r => r.id === item.dataset.id));
      });
    });
  }

  // ── Edit tab ──────────────────────────────────────────────────
  let _unsubTranscriptionProgress = null;

  // applyCuts only ever wrote edl_entries rows with nothing to show for it —
  // this is what makes that state visible and gives the user a way to
  // actually turn it into a file (see btnRenderEdit below).
  async function refreshEditCutSummary(recordingId) {
    let entries = [];
    try { entries = await window.mob.db.query('edl:list', [recordingId]); } catch (_) {}
    const n = entries.length;
    const summary = $('editCutSummary');
    const btn = $('btnRenderEdit');
    if (!summary || !btn) return;
    if (n > 0) {
      summary.textContent = `${n} segment${n === 1 ? '' : 's'} kept after cuts — not yet rendered to a file.`;
      btn.hidden = false;
    } else {
      summary.textContent = '';
      btn.hidden = true;
    }
    try {
      const { canUndo } = await window.api.invoke('edit:canUndo', { recordingId });
      $('btnUndoCut').hidden = !canUndo;
    } catch (_) { $('btnUndoCut').hidden = true; }
  }

  // The waveform already implements colored region overlays — nothing ever
  // called setRegions(). This is what the S6 design calls for directly:
  // red for detected fillers, grey for detected silences, over the
  // waveform. _detectedRegions and the manual trim selection (blue, see
  // btnMarkIn/btnMarkOut below) are tracked separately and merged in
  // renderAllRegions() since setRegions() replaces the whole set each call.
  let _detectedRegions = [];
  let _trimInMs = null, _trimOutMs = null;

  function renderAllRegions() {
    if (!_waveform) return;
    const regions = _detectedRegions.slice();
    if (_trimInMs != null && _trimOutMs != null && _trimOutMs > _trimInMs) {
      regions.push({ startMs: _trimInMs, endMs: _trimOutMs, color: 'rgba(59,130,246,0.25)' });
    }
    _waveform.setRegions(regions);
  }

  async function refreshWaveformRegions(transcriptId) {
    if (!transcriptId) { _detectedRegions = []; renderAllRegions(); return; }
    try {
      const [fillers, silences] = await Promise.all([
        window.mob.db.query('words:fillers', [transcriptId]),
        window.mob.db.query('segments:silences', [transcriptId]),
      ]);
      _detectedRegions = [
        ...fillers.map(f => ({ startMs: f.start_ms, endMs: f.end_ms, color: 'rgba(239,68,68,0.35)' })),
        ...silences.map(s => ({ startMs: s.start_ms, endMs: s.end_ms, color: 'rgba(148,163,184,0.35)' })),
      ];
    } catch (_) { _detectedRegions = []; }
    renderAllRegions();
  }

  function updateTrimUI() {
    $('trimInLabel').textContent = 'In: ' + fmtMs(_trimInMs || 0);
    $('trimOutLabel').textContent = _trimOutMs != null ? 'Out: ' + fmtMs(_trimOutMs) : 'Out: —';
    const hasSelection = _trimInMs != null && _trimOutMs != null && _trimOutMs > _trimInMs;
    $('btnTrim').hidden = !hasSelection;
    $('btnCreateClip').hidden = !hasSelection;
    renderAllRegions();
  }

  // edit:createClip / clips:list / ffmpeg.extractSegment all existed with no
  // renderer caller — the production variants (TikTok caption, LinkedIn
  // headline) are built to describe a short clip, but there was no way to
  // actually produce one. Reuses the same in/out marks as Trim, but extracts
  // a standalone file alongside the recording instead of editing its EDL.
  async function refreshClipList(recordingId) {
    const list = $('clipList');
    if (!list) return;
    let clips = [];
    try { clips = await window.mob.db.query('clips:list', [recordingId]); } catch (_) {}
    if (!clips.length) {
      list.innerHTML = '<div class="empty-hint">No clips yet — set in/out points and click Create clip.</div>';
      return;
    }
    list.innerHTML = '';
    clips.forEach(c => {
      const row = document.createElement('div');
      row.className = 'recording-item';
      const label = document.createElement('span');
      label.textContent = (c.label || 'Clip') + ' · ' + fmtMs(c.end_ms - c.start_ms);
      const playBtn = document.createElement('button');
      playBtn.className = 'ghost mini';
      playBtn.textContent = 'Play';
      playBtn.onclick = () => {
        const video = $('editPreviewVideo');
        if (!video || !c.path) return;
        video.src = 'file://' + c.path;
        video.hidden = false;
        video.play().catch(() => {});
      };
      row.appendChild(label);
      row.appendChild(playBtn);
      list.appendChild(row);
    });
  }

  async function loadEditTab() {
    // Spec-default 500ms, previously hardcoded with no way for a user to
    // tune it for their speaking cadence. Takes effect on the next
    // Transcribe — silence is detected once, at transcription time, and
    // stored, same as fillers.
    const sthSel = $('silenceThresholdSelect');
    if (sthSel && !sthSel.dataset.bound) {
      sthSel.dataset.bound = '1';
      try {
        const s = await window.api.invoke('settings:get');
        sthSel.value = String((s.edit && s.edit.silenceThresholdMs) || 500);
      } catch (_) {}
      sthSel.addEventListener('change', (e) => {
        window.api.invoke('settings:set', { edit: { silenceThresholdMs: Number(e.target.value) } });
      });
    }

    await loadRecordingList('editRecordingList', async (id, row) => {
      const sec = $('editCutSection');
      $('editRecordingTitle').textContent = (row.path || '').split(/[\\/]/).pop();
      $('editDuration').textContent = fmtMs(row.duration_ms || 0);
      sec.hidden = false;
      $('editTranscriptBox').hidden = true;
      $('editTagBox').hidden = true;
      $('editExportRow') && ($('editExportRow').hidden = true);
      refreshEditCutSummary(id);
      refreshClipList(id);
      // Clear stale regions/trim-selection from whatever was selected before.
      _detectedRegions = []; _trimInMs = null; _trimOutMs = null; updateTrimUI();
      if (row && row.path) loadWaveform(row.path);
      // The only video element in the whole app was the live camera preview
      // — reviewing a take meant leaving the app entirely via shell:openPath.
      const video = $('editPreviewVideo');
      if (video) {
        if (row && row.path) {
          video.src = 'file://' + row.path;
          video.hidden = false;
          video.ontimeupdate = () => { if (_waveform) _waveform.setPlayhead(video.currentTime * 1000); };
        } else {
          video.hidden = true;
          video.removeAttribute('src');
        }
      }
      // Auto-load existing transcript if one is already in the DB
      try {
        const tx = await window.mob.db.query('transcripts:latest', [id]);
        if (tx) {
          $('editTranscriptText').textContent = tx.full_text || '';
          $('editTranscriptBox').hidden = false;
          $('editExportRow') && ($('editExportRow').hidden = false);
          refreshWaveformRegions(tx.id);
        }
        const tags = await window.mob.db.query('tags:list', [id]);
        if (tags && tags.length) {
          const tagBox = $('editTagBox');
          tagBox.textContent = '';
          tags.forEach(t => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t.tag; tagBox.appendChild(s); });
          $('editTagBox').hidden = false;
        }
      } catch (_) { /* no transcript yet — user will click Transcribe */ }
    });
    $('btnTranscribe').onclick = async () => {
      if (!selectedRecordingId) return;
      // Fix #1: named query API
      const row = await window.mob.db.query('recordings:get', [selectedRecordingId]);
      if (!row) return;
      $('editProgress').hidden = false;
      $('btnTranscribe').disabled = true;
      $('editProgressLabel').textContent = 'Loading model…';
      try {
        // Fix #4: cancel previous listener before attaching a new one
        if (_unsubTranscriptionProgress) { _unsubTranscriptionProgress(); _unsubTranscriptionProgress = null; }
        _unsubTranscriptionProgress = window.api.on('transcription:progress', (p) => {
          $('editProgressBar').style.width = (p.pct || 0) + '%';
          $('editProgressLabel').textContent = p.stage === 'loading_model' ? 'Loading Whisper…'
            : p.stage === 'transcribing' ? 'Transcribing…'
            : p.stage === 'analyzing' ? 'Analyzing…' : 'Done';
        });
        const result = await window.api.invoke('transcription:start', { recordingId: row.id, force: true });
        const tx = await window.mob.db.query('transcripts:latest', [row.id]);
        if (tx) {
          $('editTranscriptText').textContent = tx.full_text; $('editTranscriptBox').hidden = false; $('editExportRow').hidden = false;
          refreshWaveformRegions(tx.id);
        }
        const tags = await window.mob.db.query('tags:list', [row.id]);
        const tagBox = $('editTagBox');
        tagBox.textContent = '';
        tags.forEach(t => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t.tag; tagBox.appendChild(s); });
        $('editTagBox').hidden = false;
        $('editProgressBar').style.width = '100%';
        $('editProgressLabel').textContent = 'Done';
      } catch (e) {
        $('editProgressLabel').textContent = 'Error: ' + e.message;
      } finally {
        // Clean up listener whether transcription succeeded or failed.
        if (_unsubTranscriptionProgress) { _unsubTranscriptionProgress(); _unsubTranscriptionProgress = null; }
        $('btnTranscribe').disabled = false;
      }
    };

    $('btnExportSrt').onclick = async () => {
      if (!selectedRecordingId) return;
      try { await window.api.invoke('captions:export', { recordingId: selectedRecordingId, format: 'srt' }); }
      catch (e) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Export failed: ' + e.message; }
    };
    $('btnExportVtt').onclick = async () => {
      if (!selectedRecordingId) return;
      try { await window.api.invoke('captions:export', { recordingId: selectedRecordingId, format: 'vtt' }); }
      catch (e) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Export failed: ' + e.message; }
    };

    $('btnRemoveFillers').onclick = async () => {
      if (!selectedRecordingId) return;
      try {
        const rec = await window.mob.db.query('recordings:get', [selectedRecordingId]);
        if (!rec) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Recording no longer exists.'; return; }
        const tx  = await window.mob.db.query('transcripts:latest', [selectedRecordingId]);
        if (!tx) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Transcribe first.'; return; }
        const fillers = await window.mob.db.query('words:fillers', [tx.id]);
        if (!fillers.length) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'No fillers detected.'; return; }
        const cuts = fillers.map(f => ({ start_ms: f.start_ms, end_ms: f.end_ms }));
        await window.api.invoke('edit:applyCuts', { recordingId: selectedRecordingId, totalDurationMs: rec.duration_ms, cuts });
        $('editProgress').hidden = false; $('editProgressLabel').textContent = `Applied ${cuts.length} filler cuts. Render below to save it to a file.`;
        refreshEditCutSummary(selectedRecordingId);
      } catch (err) {
        $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Error: ' + err.message;
      }
    };

    $('btnRemoveSilences').onclick = async () => {
      if (!selectedRecordingId) return;
      try {
        const rec = await window.mob.db.query('recordings:get', [selectedRecordingId]);
        if (!rec) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Recording no longer exists.'; return; }
        const tx  = await window.mob.db.query('transcripts:latest', [selectedRecordingId]);
        if (!tx) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Transcribe first.'; return; }
        const segs = await window.mob.db.query('segments:silences', [tx.id]);
        if (!segs.length) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'No silences detected.'; return; }
        const cuts = segs.map(s => ({ start_ms: s.start_ms, end_ms: s.end_ms }));
        await window.api.invoke('edit:applyCuts', { recordingId: selectedRecordingId, totalDurationMs: rec.duration_ms, cuts });
        $('editProgress').hidden = false; $('editProgressLabel').textContent = `Applied ${cuts.length} silence cuts. Render below to save it to a file.`;
        refreshEditCutSummary(selectedRecordingId);
      } catch (err) {
        $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Error: ' + err.message;
      }
    };

    // Turns the applied cuts into an actual edited video file — this is the
    // step that was completely missing. Registers the result as a new
    // sibling recording rather than overwriting the original.
    $('btnRenderEdit').onclick = async () => {
      if (!selectedRecordingId) return;
      const targetId = selectedRecordingId;
      const unsub = window.api.on('edit:renderProgress', (p) => {
        if (p.recordingId !== targetId) return;
        $('editProgressBar').style.width = p.pct + '%';
      });
      $('editProgress').hidden = false;
      $('editProgressBar').style.width = '0%';
      $('editProgressLabel').textContent = 'Rendering edited video…';
      $('btnRenderEdit').disabled = true;
      try {
        const result = await window.api.invoke('edit:renderOutput', { recordingId: targetId });
        $('editProgressBar').style.width = '100%';
        $('editProgressLabel').textContent = 'Rendered: ' + result.path.split(/[\\/]/).pop();
        await loadEditTab();
      } catch (err) {
        $('editProgressLabel').textContent = 'Render failed: ' + err.message;
      } finally {
        unsub();
        $('btnRenderEdit').disabled = false;
      }
    };

    $('btnUndoCut').onclick = async () => {
      if (!selectedRecordingId) return;
      try {
        await window.api.invoke('edit:undo', { recordingId: selectedRecordingId });
        refreshEditCutSummary(selectedRecordingId);
        $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Undid last cut.';
      } catch (err) {
        $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Undo failed: ' + err.message;
      }
    };

    // Manual trim: mark an in/out point from the player's current position,
    // then turn "everything outside the selection" into ordinary EDL cuts —
    // reusing the same applyCuts + render pipeline the auto-detected cuts
    // use, rather than building a second cut mechanism. There was previously
    // no way to manually trim at all, e.g. to cut the first few seconds off
    // a take, only the two auto-detect buttons above.
    $('btnMarkIn').onclick = () => {
      const video = $('editPreviewVideo');
      if (!video || video.hidden) return;
      _trimInMs = Math.round(video.currentTime * 1000);
      if (_trimOutMs != null && _trimOutMs <= _trimInMs) _trimOutMs = null;
      updateTrimUI();
    };
    $('btnMarkOut').onclick = () => {
      const video = $('editPreviewVideo');
      if (!video || video.hidden) return;
      _trimOutMs = Math.round(video.currentTime * 1000);
      if (_trimInMs != null && _trimOutMs <= _trimInMs) _trimInMs = null;
      updateTrimUI();
    };
    $('btnTrim').onclick = async () => {
      if (!selectedRecordingId || _trimInMs == null || _trimOutMs == null) return;
      try {
        const rec = await window.mob.db.query('recordings:get', [selectedRecordingId]);
        if (!rec) { $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Recording no longer exists.'; return; }
        const totalMs = rec.duration_ms;
        const cuts = [];
        if (_trimInMs > 0) cuts.push({ start_ms: 0, end_ms: _trimInMs });
        if (_trimOutMs < totalMs) cuts.push({ start_ms: _trimOutMs, end_ms: totalMs });
        if (!cuts.length) {
          $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Selection is the whole recording — nothing to trim.';
          return;
        }
        await window.api.invoke('edit:applyCuts', { recordingId: selectedRecordingId, totalDurationMs: totalMs, cuts });
        refreshEditCutSummary(selectedRecordingId);
        $('editProgress').hidden = false;
        $('editProgressLabel').textContent = 'Trim applied. Click "Render edited video" to save it to a file.';
      } catch (err) {
        $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Error: ' + err.message;
      }
    };
    $('btnCreateClip').onclick = async () => {
      if (!selectedRecordingId || _trimInMs == null || _trimOutMs == null) return;
      const btn = $('btnCreateClip');
      btn.disabled = true;
      try {
        await window.api.invoke('edit:createClip', {
          recordingId: selectedRecordingId,
          startMs: _trimInMs,
          endMs: _trimOutMs,
          label: 'Clip ' + fmtMs(_trimInMs) + '–' + fmtMs(_trimOutMs),
          type: 'clip',
        });
        await refreshClipList(selectedRecordingId);
        $('editProgress').hidden = false;
        $('editProgressLabel').textContent = 'Clip created.';
      } catch (err) {
        $('editProgress').hidden = false; $('editProgressLabel').textContent = 'Error: ' + err.message;
      } finally {
        btn.disabled = false;
      }
    };
  }

  // ── Production tab ────────────────────────────────────────────
  async function loadProductionTab() {
    await loadRecordingList('prodRecordingList', async (id) => {
      $('prodPackageSection').hidden = false;
      $('prodTitleValue').textContent = '';
      $('prodVariants').innerHTML = '';
      $('prodDesc').textContent = '';
      $('prodHashtags').innerHTML = '';
      $('prodChapters').innerHTML = '';
      const pkg = await window.mob.db.query('packages:latest', [id]);
      if (pkg) renderPackage(pkg);
    });

    $('btnAssemble').onclick = async () => {
      if (!selectedRecordingId) return;
      $('btnAssemble').disabled = true;
      $('btnAssemble').textContent = 'Generating…';
      try {
        const result = await window.api.invoke('production:assemble', { recordingId: selectedRecordingId });
        const pkg = result.packageId
          ? await window.mob.db.query('packages:latest', [selectedRecordingId])
          : null;
        if (pkg) renderPackage(pkg);
      } catch (e) {
        const errEl = document.createElement('div');
        errEl.className = 'hint';
        errEl.style.color = '#f87171';
        errEl.style.marginTop = '4px';
        errEl.textContent = 'Error: ' + e.message;
        $('btnAssemble').insertAdjacentElement('afterend', errEl);
        setTimeout(() => errEl.remove(), 6000);
      } finally {
        $('btnAssemble').disabled = false;
        $('btnAssemble').textContent = 'Generate package';
      }
    };
  }

  function renderPackage(pkg) {
    // Three of these JSON.parse calls used to be unguarded (a fourth,
    // variants_json below, already was). Malformed JSON in any column threw
    // before prodPackageSection ever unhid, leaving the whole tab silently
    // blank with no indication anything was wrong.
    try {
      renderPackageInner(pkg);
    } catch (err) {
      console.error('[control] renderPackage failed:', err.message);
      $('prodPackageSection').hidden = false;
      $('prodTitle').textContent = 'Error loading package';
      $('prodDesc').textContent = 'This production package has corrupted data: ' + err.message;
    }
  }

  function renderPackageInner(pkg) {
    _currentPkgId = pkg.id || null;
    $('prodTitle').textContent = pkg.title || 'Package';
    $('prodTitleValue').textContent = pkg.title || '';
    const variants = JSON.parse(pkg.title_variants || '[]');
    const varEl = $('prodVariants'); varEl.textContent = '';
    variants.forEach((v, i) => { const d = document.createElement('div'); d.className = 'variant-item'; d.textContent = `${i+1}. ${v}`; varEl.appendChild(d); });
    $('prodDesc').textContent = pkg.description || '';
    const tags = JSON.parse(pkg.hashtags_json || '[]');
    const tagEl = $('prodHashtags'); tagEl.textContent = '';
    tags.forEach(t => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = typeof t === 'string' ? t : t.tag; tagEl.appendChild(s); });
    const chapters = JSON.parse(pkg.chapters_json || '[]');
    const chapEl = $('prodChapters'); chapEl.textContent = '';
    chapters.forEach(c => { const d = document.createElement('div'); d.className = 'chapter-item'; const ts = document.createElement('span'); ts.className = 'ts'; ts.textContent = fmtMs(c.start_ms); const ti = document.createElement('span'); ti.textContent = c.title; d.append(ts, ti); chapEl.appendChild(d); });
    // Populate editable fields
    const titleEdit = $('prodTitleEdit');
    const descEdit  = $('prodDescEdit');
    const tagsEdit  = $('prodHashtagsEdit');
    if (titleEdit) {
      titleEdit.textContent = pkg.edited_title ||
        (pkg.title_variants ? (JSON.parse(pkg.title_variants)[0] || '') : '') ||
        pkg.title || '';
    }
    if (descEdit) descEdit.textContent = pkg.edited_description || pkg.description || '';
    if (tagsEdit) {
      const editedTags = pkg.edited_hashtags_json
        ? JSON.parse(pkg.edited_hashtags_json).map(t => '#' + t.replace(/^#/, '')).join(' ')
        : tags.map(t => (typeof t === 'string' ? t : t.tag)).join(' ');
      tagsEdit.textContent = editedTags;
    }
    // Platform variants
    try {
      if (pkg.variants_json) {
        const v = JSON.parse(pkg.variants_json);
        const ytEl = $('varYoutube');
        const ttEl = $('varTiktok');
        const liEl = $('varLinkedin');
        if (ytEl && v.youtube) ytEl.textContent = v.youtube.title + (v.youtube.description ? '\n\n' + v.youtube.description.slice(0, 300) + '…' : '');
        if (ttEl && v.tiktok)  ttEl.textContent = v.tiktok.caption || '';
        if (liEl && v.linkedin) liEl.textContent = (v.linkedin.headline || '') + (v.linkedin.body ? '\n\n' + v.linkedin.body.slice(0, 300) + '…' : '');
      }
    } catch (_) {}
    $('prodPackageSection').hidden = false;
  }

  // ── Distribution tab ──────────────────────────────────────────
  // Maps the raw DB status (and sync.js's per-stage error_msg, which existed
  // in the row already but was never shown) to something a user can read —
  // they used to just see internal strings like "pending" and "queued" with
  // no indication an upload had actually failed or why.
  function distStatusLabel(status, errorMsg) {
    if (status && status.startsWith('error')) return 'Error: ' + (errorMsg || status);
    const labels = {
      pending: 'Preparing…', uploading: 'Uploading…', uploaded: 'Uploaded', queued: 'Queued for distribution',
    };
    return labels[status] || status || 'Unknown';
  }

  async function loadDistributionTab() {
    // Show warning if Cloudflare is not configured
    let cfConfigured = false;
    try {
      const cfg = await window.api.invoke('cf:getConfig');
      cfConfigured = !!(cfg.configured && cfg.tokenStored);
      $('cfWarning').hidden = cfConfigured;
    } catch (_) {
      $('cfWarning').hidden = false;
    }

    await loadRecordingList('distRecordingList', async (id) => {
      const pkg  = await window.mob.db.query('packages:latest', [id]);
      const dist = pkg ? await window.mob.db.query('distributions:latest', [id]) : null;
      $('distSection').hidden = false;
      $('distTitle').textContent = pkg ? pkg.title : 'No package yet';
      $('distStatus').textContent =
        !cfConfigured ? 'Not connected' :
        !pkg ? 'Needs package' :
        !dist ? 'Ready to upload' :
        distStatusLabel(dist.status, dist.error_msg);
    });

    $('btnDistUpload').onclick = async () => {
      if (!selectedRecordingId) { $('distProgress').hidden = false; $('distProgressLabel').textContent = 'Select a recording first.'; return; }
      const pkg = await window.mob.db.query('packages:latest', [selectedRecordingId]);
      if (!pkg) { $('distProgress').hidden = false; $('distProgressLabel').textContent = 'Generate a production package first.'; return; }

      $('distProgress').hidden = false;
      $('distProgressBar').style.width = '5%';
      $('distProgressLabel').textContent = 'Preparing…';
      $('btnDistUpload').disabled = true;

      // Fix #21: UUID generation and DB insert happen in main process via sync:prepare
      let distributionId;
      try {
        const prep = await window.api.invoke('sync:prepare', { recordingId: selectedRecordingId, packageId: pkg.id });
        distributionId = prep.distributionId;
      } catch (err) {
        $('distProgressLabel').textContent = 'Prepare failed: ' + err.message;
        $('btnDistUpload').disabled = false;
        return;
      }

      const unsubProgress = window.api.on('sync:progress', ({ stage, pct }) => {
        $('distProgressBar').style.width = pct + '%';
        const labels = { presign: 'Requesting upload URL…', uploading: 'Uploading…', queuing: 'Queueing…', done: 'Done' };
        $('distProgressLabel').textContent = labels[stage] || stage;
        if (stage === 'done') {
          $('distStatus').textContent = 'queued';
          $('btnDistUpload').disabled = false;
          unsubProgress();
        }
      });

      try {
        await window.api.invoke('sync:distribution', { distributionId });
        $('distProgressBar').style.width = '100%';
        $('distStatus').textContent = 'Queued for distribution';
        $('distProgressLabel').textContent = 'Upload complete';
        unsubProgress();
      } catch (err) {
        $('distProgressLabel').textContent = 'Upload failed: ' + err.message;
        $('distStatus').textContent = 'Error: ' + err.message;
        unsubProgress();
      } finally {
        // The 'done' sync:progress event normally re-enables this already,
        // but that's a separate IPC event the button's own success/failure
        // path shouldn't depend on arriving — if it's ever missed, the
        // button used to stay disabled forever.
        $('btnDistUpload').disabled = false;
      }
    };
  }

  // Ctrl/Cmd+Z undoes the last applied cut while the Edit tab is active —
  // the spec's stated acceptance criterion for S4, previously unimplemented.
  // Skipped while focus is in an editable element so native text-undo
  // still works there (e.g. the production metadata fields).
  document.addEventListener('keydown', async (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel || activePanel.id !== 'tab-edit' || !selectedRecordingId) return;
    e.preventDefault();
    try {
      await window.api.invoke('edit:undo', { recordingId: selectedRecordingId });
      refreshEditCutSummary(selectedRecordingId);
    } catch (_) { /* nothing to undo */ }
  });

  // A thumbnail finishes generating asynchronously after finalize — reload
  // whichever list tab is currently visible so it picks up the new image
  // without the user having to switch tabs and back.
  window.api.on('recording:thumbReady', () => {
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel) return;
    if (activePanel.id === 'tab-edit')         loadEditTab();
    else if (activePanel.id === 'tab-production')   loadProductionTab();
    else if (activePanel.id === 'tab-distribution') loadDistributionTab();
  });
})();
