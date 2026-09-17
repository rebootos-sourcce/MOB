/**
 * Camera bubble shapes.
 *
 * One definition drives both the on-screen bubble (CSS clip-path) and the
 * recorded overlay (canvas clip path), so what you see is what gets recorded.
 *
 * Every shape is described with a normalized box: `aspect` is width / height,
 * `css(w, h)` returns a CSS clip-path for a w x h element, and `path(ctx, x, y, w, h)`
 * traces the same outline into a canvas 2D context (call ctx.clip() or ctx.stroke()
 * afterwards).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Shapes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function roundRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function polygonPath(points) {
    return function (ctx, x, y, w, h) {
      ctx.beginPath();
      points.forEach(function (p, i) {
        var px = x + p[0] * w;
        var py = y + p[1] * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
    };
  }

  function polygonCss(points) {
    return function () {
      return 'polygon(' + points.map(function (p) {
        return (p[0] * 100).toFixed(2) + '% ' + (p[1] * 100).toFixed(2) + '%';
      }).join(', ') + ')';
    };
  }

  var HEX = [[0.5, 0], [0.9665, 0.25], [0.9665, 0.75], [0.5, 1], [0.0335, 0.75], [0.0335, 0.25]];
  var DIAMOND = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]];

  var SHAPES = {
    circle: {
      label: 'Circle',
      aspect: 1,
      css: function () { return 'circle(50% at 50% 50%)'; },
      path: function (ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.closePath();
      }
    },
    square: {
      label: 'Rounded square',
      aspect: 1,
      css: function (w, h) { return 'inset(0 round ' + (Math.min(w, h) * 0.2).toFixed(1) + 'px)'; },
      path: function (ctx, x, y, w, h) { roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.2); }
    },
    rect: {
      label: 'Rounded rectangle (16:9)',
      aspect: 16 / 9,
      css: function (w, h) { return 'inset(0 round ' + (Math.min(w, h) * 0.16).toFixed(1) + 'px)'; },
      path: function (ctx, x, y, w, h) { roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.16); }
    },
    portrait: {
      label: 'Rounded portrait (3:4)',
      aspect: 3 / 4,
      css: function (w, h) { return 'inset(0 round ' + (Math.min(w, h) * 0.16).toFixed(1) + 'px)'; },
      path: function (ctx, x, y, w, h) { roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.16); }
    },
    pill: {
      label: 'Pill',
      aspect: 16 / 9,
      css: function () { return 'inset(0 round 9999px)'; },
      path: function (ctx, x, y, w, h) { roundRectPath(ctx, x, y, w, h, Math.min(w, h) / 2); }
    },
    hexagon: {
      label: 'Hexagon',
      aspect: 1,
      css: polygonCss(HEX),
      path: polygonPath(HEX)
    },
    diamond: {
      label: 'Diamond',
      aspect: 1,
      css: polygonCss(DIAMOND),
      path: polygonPath(DIAMOND)
    }
  };

  /** Preset sizes. `size` is the bubble's shorter side in device-independent pixels. */
  var SIZES = { small: 160, medium: 240, large: 340 };

  /** Width/height for a shape at a given size (shorter side). */
  function dimensions(shapeId, size) {
    var s = SHAPES[shapeId] || SHAPES.circle;
    if (s.aspect >= 1) return { width: Math.round(size * s.aspect), height: Math.round(size) };
    return { width: Math.round(size), height: Math.round(size / s.aspect) };
  }

  return { SHAPES: SHAPES, SIZES: SIZES, dimensions: dimensions, ORDER: Object.keys(SHAPES) };
});
