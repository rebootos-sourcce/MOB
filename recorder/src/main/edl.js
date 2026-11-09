'use strict';
// ADR-002: Edit Decision List (EDL) — timeline cuts and timestamp remapping.
// Manages edl_entries rows; provides remapTimestamp() for caption/chapter sync.

const crypto = require('crypto');
const db = require('./db/sqlite');

/**
 * Apply a list of cuts to a recording. Each cut removes a [start_ms, end_ms] range.
 * Writes edl_entries rows with correct output_start_ms / output_end_ms offsets.
 *
 * @param {string} recordingId
 * @param {number} totalDurationMs  total source duration
 * @param {Array<{start_ms:number, end_ms:number}>} cuts  sorted or unsorted removal ranges
 * @returns {Array<{seq,source_start_ms,source_end_ms,output_start_ms,output_end_ms}>} kept segments
 */
function applyCuts(recordingId, totalDurationMs, cuts) {
  // Sort and merge overlapping cuts
  const merged = mergeCuts(cuts);

  // Build kept segments (the inverse of cuts)
  const kept = [];
  let cursor = 0;

  for (const cut of merged) {
    if (cut.start_ms > cursor) {
      kept.push({ source_start_ms: cursor, source_end_ms: cut.start_ms });
    }
    cursor = cut.end_ms;
  }
  if (cursor < totalDurationMs) {
    kept.push({ source_start_ms: cursor, source_end_ms: totalDurationMs });
  }

  // Compute output positions and persist
  // Fix #9: single transaction — avoids N+1 debounced persist cycles
  let outputCursor = 0;
  const entries = [];

  db.exec('BEGIN');
  try {
    db.run('DELETE FROM edl_entries WHERE recording_id = ?', [recordingId]);

    for (let i = 0; i < kept.length; i++) {
      const seg = kept[i];
      const duration = seg.source_end_ms - seg.source_start_ms;
      const entry = {
        seq: i,
        source_start_ms: seg.source_start_ms,
        source_end_ms:   seg.source_end_ms,
        output_start_ms: outputCursor,
        output_end_ms:   outputCursor + duration,
      };
      entries.push(entry);

      db.run(
        `INSERT INTO edl_entries (recording_id, seq, source_start_ms, source_end_ms, output_start_ms, output_end_ms)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [recordingId, entry.seq, entry.source_start_ms, entry.source_end_ms, entry.output_start_ms, entry.output_end_ms]
      );

      outputCursor += duration;
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return entries;
}

/**
 * Remap a source timestamp to its output position using the EDL.
 * Returns null if the timestamp falls inside a cut (removed range).
 *
 * @param {Array<{source_start_ms,source_end_ms,output_start_ms,output_end_ms}>} edlEntries
 * @param {number} sourceMs
 * @returns {number|null}
 */
function remapTimestamp(edlEntries, sourceMs) {
  for (const entry of edlEntries) {
    if (sourceMs >= entry.source_start_ms && sourceMs <= entry.source_end_ms) {
      const offset = sourceMs - entry.source_start_ms;
      return Math.max(0, entry.output_start_ms + offset);
    }
  }
  return null; // timestamp was cut
}

/**
 * Load the current EDL for a recording from SQLite.
 * @param {string} recordingId
 * @returns {Array}
 */
function loadEdl(recordingId) {
  return db.all(
    'SELECT * FROM edl_entries WHERE recording_id = ? ORDER BY seq',
    [recordingId]
  );
}

function mergeCuts(cuts) {
  if (!cuts.length) return [];
  const sorted = [...cuts].sort((a, b) => a.start_ms - b.start_ms);
  const out = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i].start_ms <= last.end_ms) {
      last.end_ms = Math.max(last.end_ms, sorted[i].end_ms);
    } else {
      out.push({ ...sorted[i] });
    }
  }
  return out;
}

module.exports = { applyCuts, remapTimestamp, loadEdl };
