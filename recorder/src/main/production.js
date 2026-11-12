'use strict';
// S5: Production package assembly.
// Reads transcript/words/tags from DB, generates title variants, description,
// hashtags, chapters, and writes a production_packages row.

const crypto = require('crypto');
const db = require('./db/sqlite');
const { getDeviceId } = require('./identity');
const { extractHashtags, buildCorpusStats } = require('./intelligence/hashtags');
const { detectChapters } = require('./intelligence/energy');
const { loadEdl, remapTimestamp } = require('./edl');
const { generateVariants } = require('./intelligence/variants');

/**
 * Computes every generated field for a recording's production package
 * without writing anything — shared by assemblePackage() (full regenerate,
 * new row) and regeneratePackageField() (one field, existing row).
 */
function buildPackageData(recordingId) {
  const transcript = db.get(
    'SELECT * FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1',
    [recordingId]
  );
  if (!transcript) throw new Error('No transcript found for recording ' + recordingId);

  const words = db.all(
    'SELECT word, start_ms / 1000.0 AS start, end_ms / 1000.0 AS end FROM words WHERE transcript_id = ? ORDER BY start_ms',
    [transcript.id]
  );

  const recording = db.get('SELECT * FROM recordings WHERE id = ?', [recordingId]);
  const durationMs = recording ? recording.duration_ms : 0;

  // Load EDL and remap word timestamps if cuts have been applied. Uses the
  // one shared remapTimestamp from edl.js — this used to reimplement its own
  // binary search with slightly different boundary semantics, which meant
  // the two could disagree on a timestamp sitting exactly on an adjacent-cut
  // boundary. A linear scan is plenty fast here: edlEntries is bounded by
  // how many cuts a user made, not by recording length.
  const edlEntries = loadEdl(recordingId);
  let remappedWords;
  let outputDurationMs;
  if (edlEntries.length) {
    remappedWords = words.map(w => {
      const remapped = remapTimestamp(edlEntries, w.start * 1000);
      if (remapped === null) return null;
      const dur = w.end - w.start;
      return { ...w, start: remapped / 1000, end: (remapped / 1000) + dur };
    }).filter(Boolean);
    // Chapters must be timed against the EDITED (output) duration, not the
    // source recording's duration — otherwise a 10-minute source cut to
    // 6 minutes can get chapter boundaries past the end of the actual file.
    outputDurationMs = edlEntries[edlEntries.length - 1].output_end_ms;
  } else {
    remappedWords = words;
    outputDurationMs = durationMs;
  }

  // Generate metadata
  const fullText = transcript.full_text || '';
  // #53: real corpus IDF from every other recording's transcript, same as
  // transcription.js's own metadata_tags pass — this package's
  // hashtags_json should rank terms the same honest way, not by a fixed
  // per-word table with no corpus at all.
  const corpusDocs = db.all(
    'SELECT full_text FROM transcripts WHERE recording_id != ?',
    [recordingId]
  ).map(r => r.full_text || '');
  const hashtags = extractHashtags(fullText, buildCorpusStats(corpusDocs));
  // Chapter boundaries default to the word-density valley detector
  // (detectChapters), not segments.energy directly: the build-plan's
  // chapter rule (energy > 0.6 AND duration > 15s) assumes paragraph-sized
  // segments, but this schema's segments are caption-line-sized (a few
  // seconds each) — virtually none would ever pass a 15s duration gate.
  //
  // Task #56: an explicit "chapter here" marker is a stronger signal than
  // that guess, so it wins when present. Markers are timestamped in SOURCE
  // position (dropped live, before any cuts exist) — remap each through the
  // EDL the same way the words above were remapped, dropping any marker
  // whose moment was itself cut out. If every marker lands in a cut span,
  // fall back to the auto-detector rather than returning no chapters at all.
  const chapterMarkers = db.all(
    "SELECT at_ms FROM markers WHERE recording_id = ? AND type = 'chapter' ORDER BY at_ms",
    [recordingId]
  );
  let chapters = null;
  if (chapterMarkers.length) {
    chapters = chapterMarkers
      .map((m, idx) => {
        const ms = edlEntries.length ? remapTimestamp(edlEntries, m.at_ms) : m.at_ms;
        return ms === null ? null : { start_ms: ms, title: idx === 0 ? 'Introduction' : `Part ${idx + 1}`, score: 1.0 };
      })
      .filter(Boolean);
    if (!chapters.length) chapters = null;
  }
  if (!chapters) chapters = detectChapters(remappedWords, outputDurationMs);

  // #51: title picks the highest-energy real speech segment (build-plan
  // spec: energy > 0.5, 60 chars max) instead of just the transcript's
  // first sentence — a caption-sized segment is exactly the right size for
  // this, unlike the chapter rule above. Segment timestamps are remapped
  // through the EDL first so a cut segment can't win the title.
  const speechSegments = db.all(
    'SELECT start_ms, text, energy FROM segments WHERE transcript_id = ? AND type = ? ORDER BY seq',
    [transcript.id, 'speech']
  );
  const liveSegments = edlEntries.length
    ? speechSegments
        .map(s => {
          const remappedStart = remapTimestamp(edlEntries, s.start_ms);
          return remappedStart === null ? null : { ...s, start_ms: remappedStart };
        })
        .filter(Boolean)
    : speechSegments;
  const bestSegment = liveSegments
    .filter(s => s.energy > 0.5 && s.text && s.text.trim())
    .sort((a, b) => b.energy - a.energy)[0];

  const firstSentence = (fullText.split(/[.!?]/)[0] || '').trim().slice(0, 80);
  const title = (bestSegment ? bestSegment.text.trim().slice(0, 60) : '') || firstSentence || 'Recording';

  const titleVariants = [
    title,
    title.replace(/^(so|well|okay|um|uh),?\s*/i, '').trim() || title,
    hashtags.slice(0, 3).map(t => t.tag).join(' ') || title,
  ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

  const sentences = fullText.split(/[.!?]/).filter(s => s.trim().length > 10);
  const shortDesc = sentences.slice(0, 2).join('. ').trim().slice(0, 200);
  const description = sentences.slice(0, 5).join('. ').trim().slice(0, 500);

  return { recording, transcript, title, titleVariants, description, shortDesc, hashtags, chapters, fullText };
}

/**
 * Assemble a production package for a recording.
 * @param {object} opts
 * @param {string} opts.recordingId
 * @param {string} [opts.clipId]       optional clip override
 * @returns {Promise<{packageId:string}>}
 */
async function assemblePackage({ recordingId, clipId = null }) {
  const data = buildPackageData(recordingId);

  const packageId = crypto.randomUUID();
  const deviceId  = getDeviceId();

  db.run(
    `INSERT INTO production_packages
       (id, device_id, recording_id, clip_id, title, title_variants, description, short_desc,
        hashtags_json, chapters_json, generated_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'whisper', datetime('now'))`,
    [
      packageId,
      deviceId,
      recordingId,
      clipId,
      data.title,
      JSON.stringify(data.titleVariants),
      data.description,
      data.shortDesc,
      JSON.stringify(data.hashtags),
      JSON.stringify(data.chapters),
    ]
  );

  // Generate platform variants and store them (non-blocking)
  try {
    const pkg = db.get('SELECT * FROM production_packages WHERE id = ?', [packageId]);
    if (pkg) {
      const pkgData = {
        title: pkg.title_variants
          ? JSON.parse(pkg.title_variants)?.[0]
          : (data.recording ? data.recording.title : ''),
        titleVariants: pkg.title_variants ? JSON.parse(pkg.title_variants) : [],
        description: pkg.description,
        hashtags_json: pkg.hashtags_json,
        chapters_json: pkg.chapters_json,
        fullText: data.fullText,
      };
      const variants = generateVariants(pkgData);
      db.run(
        'UPDATE production_packages SET variants_json = ? WHERE id = ?',
        [JSON.stringify(variants), packageId]
      );
    }
  } catch (varErr) {
    console.error('[production] variant generation error:', varErr.message);
  }

  return { packageId, title: data.title, hashtags: data.hashtags, chapters: data.chapters };
}

// #53: btnAssemble used to regenerate the ENTIRE package on every click —
// one bad title meant regenerating everything and losing manual edits to
// every other field (made worse by the sibling-column clobber task #22
// fixed). Each of these updates ONE column group on the EXISTING package
// row, leaving every other field (generated or manually edited) untouched.
const REGEN_FIELDS = {
  title: (data) => ({ title: data.title, title_variants: JSON.stringify(data.titleVariants) }),
  description: (data) => ({ description: data.description, short_desc: data.shortDesc }),
  hashtags: (data) => ({ hashtags_json: JSON.stringify(data.hashtags) }),
  chapters: (data) => ({ chapters_json: JSON.stringify(data.chapters) }),
};
// A field just regenerated by explicit request should actually show the
// new value, not stay masked by a stale manual edit of the SAME field —
// other fields' edited_* are never touched here.
const EDITED_COLUMN_TO_CLEAR = { title: 'edited_title', description: 'edited_description', hashtags: 'edited_hashtags_json' };

async function regeneratePackageField(packageId, field) {
  const pkg = db.get('SELECT * FROM production_packages WHERE id = ?', [packageId]);
  if (!pkg) throw new Error('Package not found: ' + packageId);
  const buildUpdates = REGEN_FIELDS[field];
  if (!buildUpdates) throw new Error('Unknown regenerate field: ' + field);

  const data = buildPackageData(pkg.recording_id);
  const updates = buildUpdates(data);

  const sets = Object.keys(updates).map(k => `${k} = ?`);
  const vals = Object.values(updates);
  if (EDITED_COLUMN_TO_CLEAR[field]) sets.push(`${EDITED_COLUMN_TO_CLEAR[field]} = NULL`);

  db.run(`UPDATE production_packages SET ${sets.join(', ')} WHERE id = ?`, [...vals, packageId]);
  return db.get('SELECT * FROM production_packages WHERE id = ?', [packageId]);
}

module.exports = { assemblePackage, regeneratePackageField };
