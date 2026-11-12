'use strict';
// S5: Production package assembly.
// Reads transcript/words/tags from DB, generates title variants, description,
// hashtags, chapters, and writes a production_packages row.

const crypto = require('crypto');
const db = require('./db/sqlite');
const { getDeviceId } = require('./identity');
const { extractHashtags } = require('./intelligence/hashtags');
const { detectChapters } = require('./intelligence/energy');
const { loadEdl, remapTimestamp } = require('./edl');
const { generateVariants } = require('./intelligence/variants');

/**
 * Assemble a production package for a recording.
 * @param {object} opts
 * @param {string} opts.recordingId
 * @param {string} [opts.clipId]       optional clip override
 * @returns {Promise<{packageId:string}>}
 */
async function assemblePackage({ recordingId, clipId = null }) {
  // Load transcript
  const transcript = db.get(
    'SELECT * FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1',
    [recordingId]
  );
  if (!transcript) throw new Error('No transcript found for recording ' + recordingId);

  // Load words for energy/chapter analysis
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
  const hashtags  = extractHashtags(fullText);
  // Chapter boundaries still come from the word-density valley detector
  // (detectChapters), not segments.energy directly: the build-plan's
  // chapter rule (energy > 0.6 AND duration > 15s) assumes paragraph-sized
  // segments, but this schema's segments are caption-line-sized (a few
  // seconds each) — virtually none would ever pass a 15s duration gate.
  const chapters  = detectChapters(remappedWords, outputDurationMs);

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

  // Title variants (3 options)
  const titleVariants = [
    title,
    title.replace(/^(so|well|okay|um|uh),?\s*/i, '').trim() || title,
    hashtags.slice(0, 3).map(t => t.tag).join(' ') || title,
  ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

  // Short description: first two sentences
  const sentences = fullText.split(/[.!?]/).filter(s => s.trim().length > 10);
  const shortDesc = sentences.slice(0, 2).join('. ').trim().slice(0, 200);
  const description = sentences.slice(0, 5).join('. ').trim().slice(0, 500);

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
      title,
      JSON.stringify(titleVariants),
      description,
      shortDesc,
      JSON.stringify(hashtags),
      JSON.stringify(chapters),
    ]
  );

  // Generate platform variants and store them (non-blocking)
  try {
    const pkg = db.get('SELECT * FROM production_packages WHERE id = ?', [packageId]);
    if (pkg) {
      const pkgData = {
        title: pkg.title_variants
          ? JSON.parse(pkg.title_variants)?.[0]
          : (recording ? recording.title : ''),
        titleVariants: pkg.title_variants ? JSON.parse(pkg.title_variants) : [],
        description: pkg.description,
        hashtags_json: pkg.hashtags_json,
        chapters_json: pkg.chapters_json,
        fullText: transcript.full_text || '',
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

  return { packageId, title, hashtags, chapters };
}

module.exports = { assemblePackage };
