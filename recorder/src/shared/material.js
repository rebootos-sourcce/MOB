/**
 * Visual constants shared by the three surfaces that draw the bubble:
 * the live bubble window, the control-panel preview, and the recorded
 * overlay in the compositor.
 *
 * These were previously duplicated in three files and had already started to
 * drift, so anything affecting how the bubble LOOKS belongs here, not in a
 * stylesheet or a canvas call.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Material = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var RING_RATIO = 0.024;   // ring width as a fraction of the shorter side
  var RING_MIN = 2;         // px, so the ring never vanishes on a tiny bubble

  return {
    RING_RATIO: RING_RATIO,
    RING_MIN: RING_MIN,
    RING_COLOR: 'rgba(255, 255, 255, 0.9)',
    SURFACE: '#1c1f25',     // matches --card in the control panel
    /** Ring width in px for a bubble of w x h. */
    ringWidth: function (w, h, enabled) {
      if (enabled === false) return 0;
      return Math.max(RING_MIN, Math.round(Math.min(w, h) * RING_RATIO));
    }
  };
});
