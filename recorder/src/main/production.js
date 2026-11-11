'use strict';
// S5: Production package assembly.
// Reads transcript/words/tags from DB, generates title variants, description,
// hashtags, chapters, and writes a production_packages row.

const crypto = require('crypto');
const db = require('./db/sqlite');
const { getDeviceId } = require('./identity');
const { extractHashtags } = require('./intelligence/hashtags');
const { detectChapters } = require('./intelligence/energy');
const { remapTimestamp, loadEdl } = require('./edl');
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

  // Load EDL and remap word timestamps if cuts have been applied
  // Fix #11: build a binary-search helper so remapTimestamp is O(log N) per word
  const edlEntries = loadEdl(recordingId);
  let remappedWords;
  if (edlEntries.length) {
    // EDL is ordered by seq (source_start_ms ascending) — binary search for each word
    function bsRemap(sourceMs) {
      let lo = 0, hi = edlEntries.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        const e = edlEntries[mid];
        if (sourceMs < e.source_start_ms) { hi = mid - 1; }
        else if (sourceMs > e.source_end_ms) { lo = mid + 1; }
        else { return e.output_start_ms + (sourceMs - e.source_start_ms); }
      }
      return null;
    }
    remappedWords = words.map(w => {
      const remapped = bsRemap(w.start * 1000);
      if (remapped === null) return null;
      const dur = w.end - w.start;
      return { ...w, start: remapped / 1000, end: (remapped / 1000) + dur };
    }).filter(Boolean);
  } else {
    remappedWords = words;
  }

  // Generate metadata
  const fullText = transcript.full_text || '';
  const hashtags  = extractHashtags(fullText);
  const chapters  = detectChapters(remappedWords, durationMs);

  // Title: use first sentence of transcript, truncated
  const firstSentence = (fullText.split(/[.!?]/)[0] || '').trim().slice(0, 80);
  const title = firstSentence || 'Recording';

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
