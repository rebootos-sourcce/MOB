'use strict';
// Task #77: pure helpers for region capture's coordinate math — no Electron
// dependency, so these are directly unit-testable (test/region.test.js).

/**
 * Converts an absolute-screen rect into coordinates relative to a display's
 * own origin, clamped to the true intersection of the rect and that
 * display's bounds — correct for a rect that overflows on EITHER side
 * (starts before the display's origin, or extends past its far edge).
 *
 * Two narrower versions of this were tried and rejected while building
 * region capture: clamping width/height against the display's FULL
 * width/height independently of x/y let x + width exceed the display's
 * right edge whenever the rect's x offset was non-zero; clamping x/y to 0
 * while leaving width/height untouched (to fix THAT) then produced a
 * shifted, wrong-sized rect whenever the original rect started before the
 * display's origin. A real rectangle intersection — clamp each edge
 * (left/top/right/bottom) independently, then derive width/height from the
 * clamped edges — handles both directions at once and is simpler to reason
 * about than either partial fix.
 *
 * @param {{x:number,y:number,width:number,height:number}} absRect  absolute screen coordinates
 * @param {{bounds:{x:number,y:number,width:number,height:number}}} display
 */
function clampRegionToDisplay(absRect, display) {
  const b = display.bounds;
  const left = Math.max(absRect.x, b.x);
  const top = Math.max(absRect.y, b.y);
  const right = Math.min(absRect.x + absRect.width, b.x + b.width);
  const bottom = Math.min(absRect.y + absRect.height, b.y + b.height);
  return {
    x: left - b.x,
    y: top - b.y,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

module.exports = { clampRegionToDisplay };
