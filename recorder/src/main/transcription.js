'use strict';
// S3: Transcription pipeline.
// Runs Whisper base.en via @xenova/transformers in the main process (CPU inference).
// Emits progress events, writes transcript + words + tags + segments to SQLite.

const path = require('path');
const crypto = require('crypto');
const db = require('./db/sqlite');
const { detectFillers } = require('./intelligence/filler');
const { detectSilences } = require('./intelligence/silence');
const { formCaptions } = require('./intelligence/captions');
const { extractHashtags } = require('./intelligence/hashtags');

// Cache the pipeline so it isn't re-loaded on every transcription
let _whisperPipeline = null;

async function loadWhisper(onProgress) {
  if (_whisperPipeline) return _whisperPipeline;

  const { pipeline, env } = require('@xenova/transformers');
  const { app } = require('electron');
  env.cacheDir = path.join(app.getPath('userData'), 'models');

  if (onProgress) onProgress({ stage: 'loading_model', pct: 0 });

  _whisperPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base.en', {
    dtype: 'q8',
    progress_callback: (p) => {
      if (onProgress && p.status === 'progress') {
        onProgress({ stage: 'loading_model', pct: Math.round(p.progress || 0) });
      }
    }
  });

  if (onProgress) onProgress({ stage: 'loading_model', pct: 100 });
  return _whisperPipeline;
}

/**
 * Transcribe a recording file and persist results to SQLite.
 *
 * @param {object} opts
 * @param {string} opts.recordingId   UUID of the recordings row
 * @param {string} opts.filePath      path to the MP4/WebM file on disk
 * @param {function} [opts.onProgress]  called with {stage, pct, message}
 * @returns {Promise<{transcriptId:string, words:number, tags:number}>}
 */
async function transcribe({ recordingId, filePath, onProgress = () => {} }) {
  const pipe = await loadWhisper(onProgress);

  onProgress({ stage: 'transcribing', pct: 0 });

  // Fix #5: word_timestamps: true — get actual per-word timestamps instead of
  // 30-second chunk boundaries. Required for all downstream intelligence algorithms.
  const result = await pipe(filePath, {
    return_timestamps: 'word',
    chunk_length_s: 30,
    stride_length_s: 5,
    language: 'english',
    task: 'transcribe',
  });

  onProgress({ stage: 'transcribing', pct: 100 });

  const fullText = result.text || '';

  // With return_timestamps:'word', result.chunks contains word-level entries
  // Each chunk: { text: string, timestamp: [startSec, endSec] }
  const chunks = result.chunks || [];
  const words = chunks
    .map(c => ({
      word:  c.text,
      start: Array.isArray(c.timestamp) ? (c.timestamp[0] ?? 0) : 0,
      end:   Array.isArray(c.timestamp) ? (c.timestamp[1] ?? 0) : 0,
    }))
    .filter(w => w.word.trim());

  onProgress({ stage: 'analyzing', pct: 10 });

  // Fix #3: load actual recording duration for trailing-silence detection
  const rec = db.get('SELECT duration_ms FROM recordings WHERE id = ?', [recordingId]);
  const totalDurationMs = rec ? (rec.duration_ms || 0) : 0;

  // Run intelligence algorithms
  const fillerSegs  = detectFillers(words);
  const silenceSegs = detectSilences(words, totalDurationMs);
  const captions    = formCaptions(words);
  const hashtags    = extractHashtags(fullText);

  onProgress({ stage: 'analyzing', pct: 80 });

  // Fix #14: build a Set of filler word indices instead of O(N×M) .some() per word
  const fillerIntervals = fillerSegs.map(f => ({ lo: f.start_ms - 200, hi: f.end_ms + 200 }));
  function isFiller(w) {
    const ms = w.start * 1000;
    // Filler intervals are sorted by start; use a simple scan (small N in practice)
    for (const iv of fillerIntervals) {
      if (ms >= iv.lo && ms <= iv.hi) return true;
      if (iv.lo > ms + 200) break;
    }
    return false;
  }

  // Fix #2: wrap ALL inserts in a single transaction — no N+1 blocking writes
  const transcriptId = crypto.randomUUID();

  db.exec('BEGIN');
  try {
    // Delete any previous transcript for this recording (Fix #19 companion)
    const prev = db.get('SELECT id FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recordingId]);
    if (prev) {
      db.run('DELETE FROM words    WHERE transcript_id = ?', [prev.id]);
      db.run('DELETE FROM segments WHERE transcript_id = ?', [prev.id]);
      db.run('DELETE FROM transcripts WHERE id = ?',         [prev.id]);
    }
    db.run('DELETE FROM metadata_tags WHERE recording_id = ?', [recordingId]);

    db.run(
      `INSERT INTO transcripts (id, recording_id, full_text, word_count, language, created_at)
       VALUES (?, ?, ?, ?, 'en', datetime('now'))`,
      [transcriptId, recordingId, fullText.trim(), words.length]
    );

    for (const w of words) {
      db.run(
        `INSERT INTO words (transcript_id, word, start_ms, end_ms, confidence, is_filler)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transcriptId,
          w.word.trim(),
          Math.round(w.start * 1000),
          Math.round(w.end   * 1000),
          1.0,
          isFiller(w) ? 1 : 0,
        ]
      );
    }

    for (const tag of hashtags) {
      db.run(
        `INSERT INTO metadata_tags (recording_id, tag, type, score, idf_score)
         VALUES (?, ?, 'hashtag', ?, ?)`,
        [recordingId, tag.tag, tag.score, tag.score]
      );
    }

    // Caption segments (speech)
    for (let i = 0; i < captions.length; i++) {
      const cap = captions[i];
      db.run(
        `INSERT INTO segments (transcript_id, seq, start_ms, end_ms, text, type)
         VALUES (?, ?, ?, ?, ?, 'speech')`,
        [transcriptId, i, cap.start_ms, cap.end_ms, cap.text]
      );
    }

    // Fix #12: persist silence ranges so "Remove silences" button works
    let silenceSeq = captions.length;
    for (const seg of silenceSegs) {
      db.run(
        `INSERT INTO segments (transcript_id, seq, start_ms, end_ms, text, type)
         VALUES (?, ?, ?, ?, '', 'silence')`,
        [transcriptId, silenceSeq++, seg.start_ms, seg.end_ms]
      );
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  onProgress({ stage: 'done', pct: 100 });

  return { transcriptId, words: words.length, tags: hashtags.length };
}

module.exports = { transcribe, loadWhisper };
