'use strict';
// ADR-002: Edit Decision List (EDL) — timeline cuts and timestamp remapping.
// Manages edl_entries rows; provides remapTimestamp() for caption/chapter sync.

const db = require('./db/sqlite');

// Full undo history per recording, kept in main-process memory (not
// persisted — an app restart clearing it is the same tradeoff every normal
// app's undo history makes). Every applyCuts() pushes a snapshot of the EDL
// as it stood before that call, so repeated Ctrl+Z walks all the way back
// to the original uncut state. applyCuts() used to DELETE the previous
// state with no way back at all.
const _undoStacks = new Map(); // recordingId -> array of previous edl_entries snapshots

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
  const prevEntries = db.all('SELECT * FROM edl_entries WHERE recording_id = ? ORDER BY seq', [recordingId]);
  if (!_undoStacks.has(recordingId)) _undoStacks.set(recordingId, []);
  _undoStacks.get(recordingId).push(prevEntries);

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
    // Some SQLite errors (e.g. SQLITE_FULL, SQLITE_NOMEM) auto-rollback the
    // transaction themselves; an explicit ROLLBACK on top of that throws
    // "cannot rollback - no transaction is active" and replaces the real
    // error with that one. Swallow it and always surface the original.
    try { db.exec('ROLLBACK'); } catch (_) { /* transaction already gone */ }
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
  // The upper bound is exclusive except on the last entry. applyCuts() can
  // emit adjacent kept segments (a zero-length cut between them), so a
  // timestamp sitting exactly on the shared boundary would otherwise match
  // two entries at once — this was the source of a second, independent
  // remap implementation (production.js) disagreeing with this one on
  // exactly that input. Exclusive-except-last makes the match unambiguous
  // while still mapping the recording's final millisecond correctly.
  for (let i = 0; i < edlEntries.length; i++) {
    const entry = edlEntries[i];
    const isLast = i === edlEntries.length - 1;
    const inRange = isLast
      ? sourceMs >= entry.source_start_ms && sourceMs <= entry.source_end_ms
      : sourceMs >= entry.source_start_ms && sourceMs <  entry.source_end_ms;
    if (inRange) {
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

function canUndo(recordingId) {
  const stack = _undoStacks.get(recordingId);
  return !!(stack && stack.length);
}

/** Restores the EDL to the state it was in before the most recent applyCuts() call. */
function undoLastCut(recordingId) {
  const stack = _undoStacks.get(recordingId);
  if (!stack || !stack.length) throw new Error('Nothing to undo');
  const prevEntries = stack.pop();

  db.exec('BEGIN');
  try {
    db.run('DELETE FROM edl_entries WHERE recording_id = ?', [recordingId]);
    for (const entry of prevEntries) {
      db.run(
        `INSERT INTO edl_entries (recording_id, seq, source_start_ms, source_end_ms, output_start_ms, output_end_ms, clip_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [recordingId, entry.seq, entry.source_start_ms, entry.source_end_ms, entry.output_start_ms, entry.output_end_ms, entry.clip_id ?? null]
      );
    }
    db.exec('COMMIT');
  } catch (err) {
    try { db.exec('ROLLBACK'); } catch (_) { /* transaction already gone */ }
    throw err;
  }
  return prevEntries;
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

module.exports = { applyCuts, remapTimestamp, loadEdl, canUndo, undoLastCut };
