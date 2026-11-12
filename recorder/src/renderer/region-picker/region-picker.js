/**
 * Task #77: drag-to-select overlay. Runs in a transparent, always-on-top
 * window that spans every connected display (windows.js's
 * regionPickerBounds()); everything here is in window-local CSS pixels,
 * which main.js's region:pick handler turns into absolute DIP coordinates
 * by adding this window's own screen position back on.
 */
(function () {
  const dim = document.getElementById('dim');
  const sel = document.getElementById('sel');
  const sizeLabel = document.getElementById('size');

  let dragging = false;
  let startX = 0, startY = 0;

  function rectFrom(x1, y1, x2, y2) {
    return {
      x: Math.round(Math.min(x1, x2)),
      y: Math.round(Math.min(y1, y2)),
      width: Math.round(Math.abs(x2 - x1)),
      height: Math.round(Math.abs(y2 - y1)),
    };
  }

  function cancel() {
    window.api.send('region:cancelled');
  }

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // left button only — right-click cancels below
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    sel.style.display = 'block';
    sizeLabel.style.display = 'block';
    dim.style.background = 'rgba(0, 0, 0, 0.1)'; // less dimming once a drag starts, so the selection reads clearly
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const r = rectFrom(startX, startY, e.clientX, e.clientY);
    sel.style.left = r.x + 'px';
    sel.style.top = r.y + 'px';
    sel.style.width = r.width + 'px';
    sel.style.height = r.height + 'px';
    sizeLabel.textContent = r.width + ' × ' + r.height;
    // Keep the label just outside the selection's top-left corner, clamped
    // so it doesn't run off the top edge when dragging starts near y=0.
    sizeLabel.style.left = r.x + 'px';
    sizeLabel.style.top = Math.max(0, r.y - 20) + 'px';
  });

  window.addEventListener('mouseup', (e) => {
    if (!dragging || e.button !== 0) return;
    dragging = false;
    const r = rectFrom(startX, startY, e.clientX, e.clientY);
    // A click with no real drag (e.g. a stray single click) isn't a region —
    // require a minimum size rather than sending a 0x0 or near-0 selection
    // through to the recorder, which would crop to nothing.
    if (r.width < 20 || r.height < 20) { cancel(); return; }
    window.api.send('region:selected', r);
  });

  window.addEventListener('contextmenu', (e) => { e.preventDefault(); cancel(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') cancel(); });
})();
