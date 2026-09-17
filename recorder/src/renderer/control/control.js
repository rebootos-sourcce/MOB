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
    const bw = settings.bubble.border ? Math.max(2, Math.round(Math.min(w, h) * 0.024)) : 0;
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
      const video = Object.assign({ width: { ideal: 1280 }, height: { ideal: 720 } },
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

  function drawMeter() {
    let rms = 0;
    if (analyser) {
      analyser.getFloatTimeDomainData(meterData);
      let sum = 0;
      for (let i = 0; i < meterData.length; i++) sum += meterData[i] * meterData[i];
      rms = Math.sqrt(sum / meterData.length);
    }
    const db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
    const level = Math.max(0, Math.min(1, (db + 60) / 60)); // -60 dB … 0 dB
    peakHold = Math.max(level, peakHold - 0.012);
    const muted = !settings || !settings.mic.enabled;

    for (const c of [$('meter'), $('cMeter')]) {
      if (!c.width) continue;
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
    requestAnimationFrame(drawMeter);
  }

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
    const btn = $('btnRecord');
    btn.classList.toggle('busy', live || st === 'finalizing');
    btn.classList.toggle('arming', st === 'countdown');
    btn.disabled = st === 'finalizing';
    btn.title = st === 'idle' ? 'Start recording (Ctrl+Shift+R)' : 'Stop recording (Ctrl+Shift+R)';
    $('statusLine').textContent = { idle: 'Ready to record', countdown: 'Get ready…', recording: 'Recording', paused: 'Paused', finalizing: 'Saving…' }[st] || st;
    $('timer').hidden = !live;
    $('timer').textContent = fmtTime(recState.elapsedMs || 0);
    $('cTimer').textContent = fmtTime(recState.elapsedMs || 0);
    $('recActions').hidden = !live;
    $('recHint').hidden = live || st === 'finalizing';
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

    // Free the webcam while recording: the bubble and the engine own it then.
    const wantPreview = st === 'idle';
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

  async function init() {
    let codecs;
    [settings, shapes, codecs] = await Promise.all([
      window.api.invoke('settings:get'),
      window.api.invoke('shapes:list'),
      window.api.invoke('codecs:list')
    ]);
    buildShapeChips();
    const cs = $('codecSelect');
    cs.innerHTML = '';
    for (const c of codecs) {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.label + (c.available ? '' : ' — unavailable');
      o.disabled = !c.available;
      cs.appendChild(o);
    }
    cs.addEventListener('change', (e) => save({ recording: { codec: e.target.value } }));

    recState = await window.api.invoke('state:get');
    render();
    await checkPermissions();
    await refreshDevices();
    openPreview(true);
    openMeter(true);
    drawMeter();
    loadSources();
  }
  init();
})();
