'use strict';
// Generate a stable R2 object key for a recording.
// Format: rec-{uuid}.{ext}  — simple, sortable, collision-free.

function recordingKey(id, format) {
  const ext = format === 'webm' ? 'webm' : 'mp4';
  return `rec-${id}.${ext}`;
}

module.exports = { recordingKey };
