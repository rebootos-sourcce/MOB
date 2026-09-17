/**
 * Floating camera bubble. Pure preview: shows the camera clipped to the
 * chosen shape, drags via -webkit-app-region, resizes via the corner grip
 * (pointer positions are sent to main, which owns the window bounds), and
 * opens a context menu on right-click.
 */
(function () {
  const frame = document.getElementById('frame');
  const cam = document.getElementById('cam');
  const noCam = document.getElementById('noCam');
  const rec = document.getElementById('rec');
  const grip = document.getElementById('grip');
  const countdown = document.getElementById('countdown');

  let settings = null;
  let currentDevice = undefined;
  let stream = null;

  function applyShape() {
    if (!settings) return;
    const shape = Shapes.SHAPES[settings.bubble.shape] || Shapes.SHAPES.circle;
    const w = window.innerWidth, h = window.innerHeight;
    frame.style.clipPath = shape.css(w, h);
    frame.classList.toggle('border', !!settings.bubble.border);
    cam.classList.toggle('mirror', !!settings.bubble.mirror);
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
