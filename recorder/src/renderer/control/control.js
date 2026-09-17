/**
 * Control panel renderer. Reads/writes settings through main, shows the live
 * mic meter, and drives recording state. All heavy lifting is in main and the
 * hidden recorder window; this file is UI only.
 */
(function () {
  const $ = (id) => document.getElementById(id);
  let settings = null;
  let shapes = null;
  let codecs = [];
  let sources = [];
  let recState = { state: 'idle', micEnabled: true, elapsedMs: 0 };

  // ------------------------------------------------------------ settings io
  async function save(patch) { settings = await window.api.invoke('settings:set', patch); render(); }

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    const p = (n) => String(n).padStart(2, '0');
    return (h ? p(h) + ':' : '') + p(m) + ':' + p(sec);
  }

  // ------------------------------------------------------------ segments
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

  // ------------------------------------------------------------ shapes / size
  function buildShapeChips() {
    const row = $('shapeRow');
    row.innerHTML = '';
    for (const id of shapes.order) {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.dataset.shape = id;
      chip.title = shapes.labels[id];
      const sw = document.createElement('span');
      sw.className = 'swatch';
      const sh = Shapes.SHAPES[id];
      const w = sh.aspect >= 1 ? 22 : Math.round(22 * sh.aspect), h = sh.aspect >= 1 ? Math.round(22 / sh.aspect) : 22;
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

  // ------------------------------------------------------------ toggles
  const toggles = {
    tMirror: (v) => ({ bubble: { mirror: v } }),
    tBorder: (v) => ({ bubble: { border: v } }),
    tVisible: (v) => ({ bubble: { visible: v } }),
    tExclude: (v) => ({ bubble: { excludeFromCapture: v } }),
    tAsk: (v) => ({ recording: { askWhereToSave: v } }),
    tCompact: (v) => ({ recording: { compactWhileRecording: v } })
  };
  for (const [id, fn] of Object.entries(toggles)) $(id).addEventListener('change', (e) => save(fn(e.target.checked)));

  // ------------------------------------------------------------ devices
  async function refreshDevices() {
    let devs = [];
    try { devs = await navigator.mediaDevices.enumerateDevices(); } catch (_) { /* ignore */ }
    fillSelect($('camSelect'), devs.filter((d) => d.kind === 'videoinput'), settings.camera.deviceId, 'Camera');
    fillSelect($('micSelect'), devs.filter((d) => d.kind === 'audioinput'), settings.mic.deviceId, 'Microphone');
  }
  function fillSelect(sel, devs, current, fallback) {
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
    sel.value = [...sel.options].some((o) => o.value === current) ? current : 'default';
  }
  $('camSelect').addEventListener('change', (e) => save({ camera: { deviceId: e.target.value } }));
  $('micSelect').addEventListener('change', (e) => save({ mic: { deviceId: e.target.value } }));
  navigator.mediaDevices.addEventListener('devicechange', () => { refreshDevices(); openMeter(true); });

  // ------------------------------------------------------------ mic meter
  let meterStream = null, meterDevice = undefined, analyser = null, audioCtx = null, meterData = null, peakHold = 0;
  async function openMeter(force) {
    const id = settings.mic.deviceId;
    if (!force && id === meterDevice && meterStream) return;
    meterDevice = id;
    if (meterStream) meterStream.getTracks().forEach((t) => t.stop());
    meterStream = null;
    try {
      meterStream = await navigator.mediaDevices.getUserMedia({ audio: Object.assign({ echoCancellation: true }, id && id !== 'default' ? { deviceId: { exact: id } } : {}), video: false });
      if (!audioCtx) audioCtx = new AudioContext();
      const src = audioCtx.createMediaStreamSource(meterStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser);
      meterData = new Float32Array(analyser.fftSize);
      refreshDevices(); // labels become available once permission is granted
    } catch (err) {
      analyser = null;
      $('meterDb').textContent = err.name === 'NotAllowedError' ? 'blocked' : 'no mic';
    }
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
    const level = Math.max(0, Math.min(1, (db + 60) / 60)); // -60 dB .. 0 dB
    peakHold = Math.max(level, peakHold - 0.01);
    const muted = !settings.mic.enabled;
    for (const c of [$('meter'), $('cMeter')]) {
      const g = c.getContext('2d');
      const W = c.width, H = c.height;
      g.clearRect(0, 0, W, H);
      const segs = W > 100 ? 30 : 12, gap = 2, sw = (W - gap * (segs + 1)) / segs;
      for (let i = 0; i < segs; i++) {
        const t = i / segs;
        const on = t < level;
        const col = t > 0.9 ? '#ff3b30' : t > 0.7 ? '#ffb300' : '#34c759';
        g.fillStyle = muted ? (on ? 'rgba(160,160,160,.55)' : 'rgba(255,255,255,.06)') : (on ? col : 'rgba(255,255,255,.07)');
        g.fillRect(gap + i * (sw + gap), 3, sw, H - 6);
      }
      if (peakHold > 0.02) {
        g.fillStyle = muted ? 'rgba(200,200,200,.7)' : '#fff';
        g.fillRect(gap + Math.min(segs - 1, Math.floor(peakHold * segs)) * (sw + gap), 3, 2, H - 6);
      }
    }
    $('meterDb').textContent = muted ? 'MUTED' : (db === -Infinity ? '–∞ dB' : db.toFixed(0) + ' dB');
    requestAnimationFrame(drawMeter);
  }

  $('btnMic').addEventListener('click', () => window.api.invoke('mic:set', !settings.mic.enabled));
  $('cMic').addEventListener('click', () => window.api.invoke('mic:set', !settings.mic.enabled));

  // ------------------------------------------------------------ sources
  async function loadSources() {
    sources = await window.api.invoke('sources:list');
    renderPicker();
    renderSourceCard();
  }
  function renderSourceCard() {
    const s = settings.source;
    const cur = sources.find((x) => x.id === s.id) || (s.kind === 'screen' && s.displayId ? sources.find((x) => x.kind === 'screen' && String(x.displayId) === String(s.displayId)) : null);
    const primary = sources.find((x) => x.kind === 'screen');
    const show = cur || primary;
    $('sourceName').textContent = show ? show.name : (s.name || 'Primary display');
    $('sourceKind').textContent = show ? (show.kind === 'screen' ? 'Full screen' : 'Single window — bubble is pinned bottom-right in the video') : 'Full screen';
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
          renderSourceCard();
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

  // ------------------------------------------------------------ recording
  $('btnRecord').addEventListener('click', () => {
    if (recState.state === 'idle') window.api.invoke('recording:start');
    else window.api.invoke('recording:stop');
  });
  $('btnStop').addEventListener('click', () => window.api.invoke('recording:stop'));
  $('cStop').addEventListener('click', () => window.api.invoke('recording:stop'));
  $('btnPause').addEventListener('click', () => window.api.invoke('recording:togglePause'));
  $('cPause').addEventListener('click', () => window.api.invoke('recording:togglePause'));
  $('btnMin').addEventListener('click', () => window.api.invoke('window:minimize'));
  $('btnClose').addEventListener('click', () => window.api.invoke('window:close'));
  $('btnSaveDir').addEventListener('click', async () => { const d = await window.api.invoke('dialog:chooseSaveDir'); if (d) { settings.recording.saveDir = d; render(); } });
  $('btnDismissSaved').addEventListener('click', () => { $('savedCard').hidden = true; });

  let lastSaved = null;
  $('btnOpenFile').addEventListener('click', () => lastSaved && window.api.invoke('shell:openPath', lastSaved));
  $('btnShowFolder').addEventListener('click', () => lastSaved && window.api.invoke('shell:showItemInFolder', lastSaved));

  function renderRecState() {
    const st = recState.state;
    const btn = $('btnRecord');
    btn.classList.toggle('busy', st === 'recording' || st === 'paused' || st === 'finalizing');
    btn.classList.toggle('arming', st === 'countdown');
    btn.querySelector('.label').textContent = st === 'idle' ? 'Record' : st === 'countdown' ? 'Cancel' : st === 'finalizing' ? 'Saving' : 'Stop';
    btn.disabled = st === 'finalizing';
    $('timer').hidden = !(st === 'recording' || st === 'paused');
    $('recActions').hidden = !(st === 'recording' || st === 'paused');
    $('finalizeBox').hidden = st !== 'finalizing';
    $('statusLine').textContent = {
      idle: 'Ready', countdown: 'Get ready…', recording: 'Recording', paused: 'Paused', finalizing: 'Saving…'
    }[st] || st;
    $('timer').textContent = fmtTime(recState.elapsedMs || 0);
    $('cTimer').textContent = fmtTime(recState.elapsedMs || 0);
    $('btnPause').textContent = st === 'paused' ? 'Resume' : 'Pause';
    $('cPause').textContent = st === 'paused' ? '▶' : '⏸';
    $('cDot').classList.toggle('paused', st === 'paused');
    const micOn = settings.mic.enabled;
    $('btnMic').textContent = micOn ? '🎙 On' : '🎙 Off';
    $('btnMic').classList.toggle('off', !micOn);
    $('cMic').classList.toggle('off', !micOn);
    $('message').hidden = !recState.message;
    $('message').textContent = recState.message || '';
  }

  window.api.on('recording:state', (st) => {
    if (st.message !== undefined) recState.message = st.message;
    recState = Object.assign(recState, st);
    if (settings && st.micEnabled !== undefined) settings.mic.enabled = st.micEnabled;
    if (settings && st.bubbleVisible !== undefined) settings.bubble.visible = st.bubbleVisible;
    renderRecState();
    if (st.state === 'recording') $('savedCard').hidden = true;
  });
  window.api.on('finalize:progress', (p) => { $('finalizeBar').style.width = Math.round(p * 100) + '%'; $('finalizeHint').textContent = `Encoding… ${Math.round(p * 100)}%`; });
  window.api.on('finalize:done', ({ path, note }) => {
    lastSaved = path;
    $('savedPath').textContent = path;
    $('savedCard').hidden = false;
    $('finalizeBar').style.width = '0%';
    if (note) { recState.message = note; renderRecState(); }
  });
  window.api.on('finalize:error', ({ message, rawPath }) => {
    recState.message = 'Saving failed: ' + message + '\nRaw recording kept at ' + rawPath;
    renderRecState();
  });
  window.api.on('ui:compact', (on) => document.body.classList.toggle('compact', on));
  window.api.on('ui:countdown', (n) => { $('countdown').hidden = !n; $('countdown').textContent = n || ''; });
  window.api.on('settings:changed', (s) => { settings = s; render(); openMeter(false); });

  // ------------------------------------------------------------ render
  function render() {
    if (!settings) return;
    renderSegs.forEach((f) => f());
    const mp4 = settings.recording.format === 'mp4';
    $('codecField').style.display = mp4 ? '' : 'none';
    $('qualityField').style.display = mp4 ? '' : 'none';
    $('codecSelect').value = settings.recording.codec;
    document.querySelectorAll('#shapeRow .chip').forEach((c) => c.classList.toggle('active', c.dataset.shape === settings.bubble.shape));
    document.querySelectorAll('#sizeChips .chip').forEach((c) => c.classList.toggle('active', Number(c.dataset.size) === settings.bubble.size));
    $('sizeSlider').value = settings.bubble.size;
    $('sizeVal').textContent = settings.bubble.size + 'px';
    $('tMirror').checked = !!settings.bubble.mirror;
    $('tBorder').checked = !!settings.bubble.border;
    $('tVisible').checked = !!settings.bubble.visible;
    $('tExclude').checked = !!settings.bubble.excludeFromCapture;
    $('tAsk').checked = !!settings.recording.askWhereToSave;
    $('tCompact').checked = !!settings.recording.compactWhileRecording;
    $('saveDir').textContent = settings.recording.saveDir || '';
    $('saveDir').title = settings.recording.saveDir || '';
    if ($('camSelect').options.length) $('camSelect').value = [...$('camSelect').options].some((o) => o.value === settings.camera.deviceId) ? settings.camera.deviceId : 'default';
    if ($('micSelect').options.length) $('micSelect').value = [...$('micSelect').options].some((o) => o.value === settings.mic.deviceId) ? settings.mic.deviceId : 'default';
    renderSourceCard();
    renderRecState();
  }

  async function init() {
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
      o.value = c.id; o.textContent = c.label + (c.available ? '' : ' (not in this ffmpeg build)'); o.disabled = !c.available;
      cs.appendChild(o);
    }
    cs.addEventListener('change', (e) => save({ recording: { codec: e.target.value } }));
    recState = await window.api.invoke('state:get');
    render();
    await refreshDevices();
    openMeter(true);
    drawMeter();
    loadSources();
  }
  init();
})();
