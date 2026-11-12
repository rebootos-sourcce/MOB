'use strict';
// Generate a stable R2 object key for a recording or clip.
// Format: {prefix}-{uuid}.{ext}  — simple, sortable, collision-free.

function extOf(format) {
  return format === 'webm' ? 'webm' : (format || '').replace(/^\./, '') || 'mp4';
}

function recordingKey(id, format) {
  return `rec-${id}.${extOf(format)}`;
}

// clip-handlers used to hand-roll `clip-${id}${ext}` locally instead of
// using this module, so the two object-key formats could drift apart.
function clipKey(id, format) {
  return `clip-${id}.${extOf(format)}`;
}

module.exports = { recordingKey, clipKey };
