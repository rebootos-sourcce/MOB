'use strict';
// Task #75: no way to get data out of the app, or move it to a new
// machine. The database holds everything that isn't the video file itself —
// transcripts, words, segments, EDL cuts, production packages, distribution
// history — so export/import here is both a backup format and the
// migration path.

const db = require('./sqlite');

// Dependency order matters on import: a row referencing a recording_id or
// transcript_id must be inserted after the row it references.
const TABLE_ORDER = [
  'recordings', 'transcripts', 'words', 'segments',
  'edl_entries', 'metadata_tags', 'production_packages', 'distributions', 'clips',
];

const BUNDLE_VERSION = 1;

function exportAll() {
  const tables = {};
  for (const name of TABLE_ORDER) tables[name] = db.all(`SELECT * FROM ${name}`);
  return { kind: 'mob-library-export', version: BUNDLE_VERSION, exportedAt: new Date().toISOString(), tables };
}

/** Exports one recording's full derived data — everything about it except the video bytes. */
function exportRecording(recordingId) {
  const recording = db.get('SELECT * FROM recordings WHERE id = ?', [recordingId]);
  if (!recording) throw new Error('Recording not found: ' + recordingId);

  const transcript = db.get(
    'SELECT * FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1',
    [recordingId]
  );
  const transcriptId = transcript ? transcript.id : null;

  const tables = {
    recordings: [recording],
    transcripts: transcript ? [transcript] : [],
    words: transcriptId ? db.all('SELECT * FROM words WHERE transcript_id = ?', [transcriptId]) : [],
    segments: transcriptId ? db.all('SELECT * FROM segments WHERE transcript_id = ?', [transcriptId]) : [],
    edl_entries: db.all('SELECT * FROM edl_entries WHERE recording_id = ?', [recordingId]),
    metadata_tags: db.all('SELECT * FROM metadata_tags WHERE recording_id = ?', [recordingId]),
    production_packages: db.all('SELECT * FROM production_packages WHERE recording_id = ?', [recordingId]),
    distributions: db.all('SELECT * FROM distributions WHERE recording_id = ?', [recordingId]),
    clips: db.all('SELECT * FROM clips WHERE recording_id = ?', [recordingId]),
  };

  return { kind: 'mob-recording-export', version: BUNDLE_VERSION, exportedAt: new Date().toISOString(), recordingId, tables };
}

/**
 * Imports an exported bundle (whole-library or single-recording — same
 * table shape either way). A row whose primary key already exists locally
 * is skipped, never overwritten: re-importing the same bundle is a no-op
 * instead of a duplicate-key crash, and an older import can never clobber
 * newer local data. One bad/incompatible row is logged and skipped rather
 * than aborting the whole import.
 * @returns {{inserted: Record<string,number>, skipped: Record<string,number>}}
 */
function importBundle(bundle) {
  if (!bundle || typeof bundle !== 'object' || !bundle.tables || !String(bundle.kind || '').startsWith('mob-')) {
    throw new Error('Not a recognized MOB export file');
  }
  const inserted = {};
  const skipped = {};

  for (const name of TABLE_ORDER) {
    const rows = bundle.tables[name];
    inserted[name] = 0;
    skipped[name] = 0;
    if (!Array.isArray(rows) || !rows.length) continue;

    for (const row of rows) {
      try {
        const cols = Object.keys(row);
        if (cols.includes('id') && db.get(`SELECT id FROM ${name} WHERE id = ?`, [row.id])) {
          skipped[name]++;
          continue;
        }
        const placeholders = cols.map(() => '?').join(', ');
        db.run(`INSERT INTO ${name} (${cols.join(', ')}) VALUES (${placeholders})`, cols.map(c => row[c]));
        inserted[name]++;
      } catch (err) {
        console.error(`[mob] import: skipped a ${name} row:`, err.message);
        skipped[name]++;
      }
    }
  }
  return { inserted, skipped };
}

module.exports = { exportAll, exportRecording, importBundle };
