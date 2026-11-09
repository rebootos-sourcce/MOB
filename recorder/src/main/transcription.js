'use strict';
// S3: Transcription pipeline.
// Runs Whisper base.en via @xenova/transformers in the main process (CPU inference).
// Emits progress events, writes transcript + words + tags to SQLite.

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
  // Store models in userData so they persist across sessions
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

  const result = await pipe(filePath, {
    return_timestamps: true,
    chunk_length_s: 30,
    stride_length_s: 5,
    language: 'english',
    task: 'transcribe',
  });

  onProgress({ stage: 'transcribing', pct: 100 });

  const fullText = result.text || '';
  const chunks   = result.chunks || [];   // [{text, timestamp:[start,end]}]

  // Flatten chunks to word-level (Whisper returns chunk-level by default)
  // Treat each chunk as one "word entry" for downstream algorithms
  const words = chunks.map(c => ({
    word:  c.text,
    start: c.timestamp ? c.timestamp[0] : 0,
    end:   c.timestamp ? c.timestamp[1] : 0,
  })).filter(w => w.word.trim());

  onProgress({ stage: 'analyzing', pct: 10 });

  // Run intelligence algorithms
  const fillerSegs  = detectFillers(words);
  const silenceSegs = detectSilences(words, 0);
  const captions    = formCaptions(words);
  const hashtags    = extractHashtags(fullText);

  onProgress({ stage: 'analyzing', pct: 80 });

  // Persist to SQLite
  const transcriptId = crypto.randomUUID();

  db.run(
    `INSERT INTO transcripts (id, recording_id, full_text, word_count, language, created_at)
     VALUES (?, ?, ?, ?, 'en', datetime('now'))`,
    [transcriptId, recordingId, fullText.trim(), words.length]
  );

  // Mark which words are fillers for fast lookup
  function isFiller(w) {
    const ms = w.start * 1000;
    return fillerSegs.some(f => ms >= f.start_ms - 200 && ms <= f.end_ms + 200);
  }

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
        isFiller(w) ? 1 : 0
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

  // Store segments (captions) with seq index
  for (let i = 0; i < captions.length; i++) {
    const cap = captions[i];
    db.run(
      `INSERT INTO segments (transcript_id, seq, start_ms, end_ms, text, type)
       VALUES (?, ?, ?, ?, ?, 'speech')`,
      [transcriptId, i, cap.start_ms, cap.end_ms, cap.text]
    );
  }

  onProgress({ stage: 'done', pct: 100 });

  return { transcriptId, words: words.length, tags: hashtags.length };
}

module.exports = { transcribe, loadWhisper };
