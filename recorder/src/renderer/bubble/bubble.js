/**
 * Floating camera bubble. Pure preview: shows the camera clipped to the
 * chosen shape, drags via -webkit-app-region, resizes via the corner grip
 * (pointer positions are sent to main, which owns the window bounds), and
 * opens a context menu on right-click.
 */
(function () {
  const frame = document.getElementById('frame');
  const inner = document.getElementById('inner');
  const cam = document.getElementById('cam');
  const noCam = document.getElementById('noCam');
  const rec = document.getElementById('rec');
  const grip = document.getElementById('grip');
  const countdown = document.getElementById('countdown');
  const menuHint = document.getElementById('menuHint');

  let settings = null;
  let currentDevice = undefined;
  let stream = null;

  function applyShape() {
    if (!settings) return;
    const shape = Shapes.SHAPES[settings.bubble.shape] || Shapes.SHAPES.circle;
    const w = window.innerWidth, h = window.innerHeight;
    const bw = Material.ringWidth(w, h, settings.bubble.border);
    frame.style.clipPath = shape.css(w, h);
    frame.classList.toggle('no-border', bw === 0);
    inner.style.inset = bw + 'px';
    inner.style.clipPath = shape.css(Math.max(1, w - bw * 2), Math.max(1, h - bw * 2));
    cam.classList.toggle('mirror', !!settings.bubble.mirror);
    cam.classList.toggle('flipv', !!settings.bubble.flipV);

    // Anchor the overlay UI to points that are inside this shape's outline.
    const grip = document.getElementById('grip');
    const g = Shapes.anchor(settings.bubble.shape, 'grip', w, h);
    grip.style.left = g.x + 'px';
    grip.style.top = g.y + 'px';
    const r = Shapes.anchor(settings.bubble.shape, 'badge', w, h);
    rec.style.left = r.x + 'px';
    rec.style.top = r.y + 'px';
    // Scale the countdown from the actual box, which CSS percentages cannot do.
    countdown.style.fontSize = Math.round(Math.min(w, h) * 0.42) + 'px';
  }

  async function openCamera() {
    const id = settings.camera.deviceId;
    if (id === currentDevice && stream) return;
    currentDevice = id;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    try {
      const video = Object.assign({ width: { ideal: 1280 }, height: { ideal: 720 } }, id && id !== 'default' ? { deviceId: { exact: id } } : {});
      stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
      cam.srcObject = stream;
      noCam.hidden = true;
    } catch (err) {
      cam.srcObject = null;
      noCam.hidden = false;
      noCam.textContent = err.name === 'NotAllowedError' ? 'Camera blocked' : 'No camera';
    }
  }

  async function init() {
    settings = await window.api.invoke('settings:get');
    applyShape();
    openCamera();
    const st = await window.api.invoke('state:get');
    setRecState(st.state);
  }

  function setRecState(state) {
    rec.hidden = !(state === 'recording' || state === 'paused');
    rec.classList.toggle('paused', state === 'paused');
  }

  window.api.on('settings:changed', (s) => {
    settings = s;
    applyShape();
    openCamera();
  });
  window.api.on('recording:state', (st) => setRecState(st.state));
  window.api.on('ui:countdown', (n) => {
    countdown.hidden = !n;
    countdown.textContent = n || '';
  });
  window.api.on('bubble:resizing', (on) => document.body.classList.toggle('resizing', on));
  window.api.on('bubble:menuBlocked', () => {
    menuHint.hidden = false;
    menuHint.style.animation = 'none';
    void menuHint.offsetWidth;          // restart the fade
    menuHint.style.animation = '';
    setTimeout(() => { menuHint.hidden = true; }, 2200);
  });

  window.addEventListener('resize', applyShape);
  window.addEventListener('contextmenu', (e) => { e.preventDefault(); window.api.invoke('bubble:contextMenu'); });
  window.addEventListener('dblclick', () => window.api.invoke('bubble:toggle'));

  // Corner grip resize: stream pointer positions to main.
  grip.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    window.api.send('bubble:resize', { phase: 'start', screenX: e.screenX, screenY: e.screenY });
    const move = (ev) => window.api.send('bubble:resize', { phase: 'move', screenX: ev.screenX, screenY: ev.screenY });
    const up = (ev) => {
      window.api.send('bubble:resize', { phase: 'end', screenX: ev.screenX, screenY: ev.screenY });
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', up);
      grip.removeEventListener('pointercancel', up);
    };
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', up);
    grip.addEventListener('pointercancel', up);
  });

  // The recorder needs to know about the bubble even when hidden; main pushes
  // the recording state to us too so the red dot matches.
  init();
})();
