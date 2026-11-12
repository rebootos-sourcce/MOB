'use strict';
// S3: Transcription pipeline.
// Runs Whisper base.en via @xenova/transformers in the main process (CPU inference).
// Emits progress events, writes transcript + words + tags + segments to SQLite.

const path = require('path');
const crypto = require('crypto');
const db = require('./db/sqlite');
const { detectFillers } = require('./intelligence/filler');
const { detectSilences } = require('./intelligence/silence');
const settings = require('./settings');
const { formCaptions } = require('./intelligence/captions');
const { extractHashtags } = require('./intelligence/hashtags');
const { scoreSegmentEnergy } = require('./intelligence/energy');

// Cache the pipeline so it isn't re-loaded on every transcription.
// _whisperPipelinePromise caches the IN-FLIGHT load, not just the resolved
// result — loadWhisper() used to check only the resolved value, so two
// transcriptions starting close together (e.g. a second recording's "Edit"
// tab opened while the first is still loading the model) both saw null and
// both triggered a full ~150MB pipeline load in parallel.
let _whisperPipeline = null;
let _whisperPipelinePromise = null;

/**
 * Check whether the Whisper model files are cached locally.
 * Returns { cached: boolean, sizeBytes: number, path: string }
 */
function checkModelCached() {
  try {
    const fs = require('fs');
    const { app } = require('electron');
    const cacheDir = path.join(app.getPath('userData'), 'models');
    // Xenova caches under models/Xenova/whisper-base.en/
    const modelDir = path.join(cacheDir, 'Xenova', 'whisper-base.en');
    if (!fs.existsSync(modelDir)) return { cached: false, sizeBytes: 0, path: modelDir };
    let totalBytes = 0;
    function sumDir(dir) {
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, f.name);
        if (f.isDirectory()) sumDir(full);
        else totalBytes += fs.statSync(full).size;
      }
    }
    sumDir(modelDir);
    return { cached: totalBytes > 1_000_000, sizeBytes: totalBytes, path: modelDir };
  } catch (_) {
    return { cached: false, sizeBytes: 0, path: '' };
  }
}

async function loadWhisper(onProgress) {
  if (_whisperPipeline) return _whisperPipeline;
  if (_whisperPipelinePromise) return _whisperPipelinePromise;

  const { pipeline, env } = require('@xenova/transformers');
  const { app } = require('electron');
  env.cacheDir = path.join(app.getPath('userData'), 'models');

  if (onProgress) onProgress({ stage: 'loading_model', pct: 0 });

  _whisperPipelinePromise = pipeline('automatic-speech-recognition', 'Xenova/whisper-base.en', {
    dtype: 'q8',
    progress_callback: (p) => {
      if (!onProgress) return;
      if (p.status === 'progress') {
        const pct = Math.round(p.progress || 0);
        const stage = p.loaded && p.total && p.total > 1_000_000
          ? 'downloading_model'
          : 'loading_model';
        const extra = (p.loaded && p.total)
          ? { bytesLoaded: p.loaded, bytesTotal: p.total }
          : {};
        onProgress({ stage, pct, ...extra });
      } else if (p.status === 'ready') {
        onProgress({ stage: 'model_ready', pct: 100 });
      }
    }
  }).then((p) => {
    _whisperPipeline = p;
    _whisperPipelinePromise = null;
    return p;
  }).catch((err) => {
    _whisperPipelinePromise = null; // allow a later call to retry
    throw err;
  });

  const result = await _whisperPipelinePromise;
  if (onProgress) onProgress({ stage: 'loading_model', pct: 100 });
  return result;
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
  // Report model cache status so UI can show correct message
  const cacheStatus = checkModelCached();
  onProgress({
    stage: cacheStatus.cached ? 'loading_model' : 'downloading_model',
    pct: 0,
    cached: cacheStatus.cached,
    bytesTotal: cacheStatus.cached ? cacheStatus.sizeBytes : 150_000_000,
  });

  const pipe = await loadWhisper(onProgress);

  // Fetched early (used to be read only after transcribing finished) so it
  // can also drive a real progress estimate below, instead of the bar
  // jumping straight from 0% to 100% with nothing in between for however
  // long the recording takes to process.
  const rec = db.get('SELECT duration_ms FROM recordings WHERE id = ?', [recordingId]);
  const totalDurationMs = rec ? (rec.duration_ms || 0) : 0;

  const CHUNK_LENGTH_S = 30;
  const STRIDE_LENGTH_S = 5;
  const jumpS = CHUNK_LENGTH_S - 2 * STRIDE_LENGTH_S; // seconds of new audio consumed per chunk
  const estimatedChunks = totalDurationMs > 0
    ? Math.max(1, Math.ceil((totalDurationMs / 1000) / jumpS))
    : 0;
  let chunksDone = 0;

  const _transcribeStart = Date.now();
  onProgress({ stage: 'transcribing', pct: 0, elapsedMs: 0 });

  // Fix #5: word_timestamps: true — get actual per-word timestamps instead of
  // 30-second chunk boundaries. Required for all downstream intelligence algorithms.
  const result = await pipe(filePath, {
    return_timestamps: 'word',
    chunk_length_s: CHUNK_LENGTH_S,
    stride_length_s: STRIDE_LENGTH_S,
    language: 'english',
    task: 'transcribe',
    // Fires once per ~20s of audio actually processed — real granularity
    // instead of a single jump from 0% to 100% at the very end.
    chunk_callback: () => {
      chunksDone++;
      const pct = estimatedChunks > 0
        ? Math.min(99, Math.round((chunksDone / estimatedChunks) * 100))
        : Math.min(99, chunksDone * 10);
      onProgress({ stage: 'transcribing', pct, elapsedMs: Date.now() - _transcribeStart });
    },
  });

  onProgress({ stage: 'transcribing', pct: 100, elapsedMs: Date.now() - _transcribeStart });

  const fullText = result.text || '';

  // With return_timestamps:'word', result.chunks contains word-level entries
  // Each chunk: { text: string, timestamp: [startSec, endSec] }
  const chunks = result.chunks || [];
  // Whisper's long-form chunking (30s windows, 5s stride) routinely emits
  // [start, null] for the last word of a chunk, and can emit words slightly
  // out of order or overlapping across a stride seam. A null end used to
  // collapse to 0, producing a word with a large start_ms and end_ms=0 —
  // detectSilences then read the gap to the next word as spanning most of
  // the recording, so "Remove silences" cut real speech. Every downstream
  // consumer (silence/energy/EDL) also assumes sorted, non-overlapping words.
  const words = chunks
    .map(c => {
      const t = Array.isArray(c.timestamp) ? c.timestamp : [0, 0];
      const start = t[0] ?? 0;
      const end = Math.max(t[1] ?? start, start);
      return { word: c.text, start, end };
    })
    .filter(w => w.word.trim())
    .sort((a, b) => a.start - b.start)
    .reduce((acc, w) => {
      const prevEnd = acc.length ? acc[acc.length - 1].end : 0;
      const start = Math.max(w.start, prevEnd);
      acc.push({ word: w.word, start, end: Math.max(w.end, start) });
      return acc;
    }, []);

  onProgress({ stage: 'analyzing', pct: 10 });

  // totalDurationMs was already loaded above (needed earlier for the chunk
  // progress estimate); reused here for trailing-silence detection.

  // Run intelligence algorithms
  const fillerSegs  = detectFillers(words);
  const silenceThresholdMs = settings.get().edit.silenceThresholdMs;
  const silenceSegs = detectSilences(words, totalDurationMs, silenceThresholdMs);
  const captions    = formCaptions(words);
  const hashtags    = extractHashtags(fullText);

  // #51: per-segment energy/wpm (architecture.html formula — see energy.js
  // for why, and why domainKeywords comes from this recording's own
  // hashtags rather than a fixed vocabulary nobody configured).
  const domainKeywords = new Set(hashtags.map(h => h.tag.replace(/^#/, '')));
  let totalSpeechWords = 0, totalSpeechMs = 0;
  const captionScores = captions.map(cap => {
    const scored = scoreSegmentEnergy(cap.text, cap.start_ms, cap.end_ms, domainKeywords);
    totalSpeechWords += (cap.text || '').trim().split(/\s+/).filter(Boolean).length;
    totalSpeechMs += Math.max(cap.end_ms - cap.start_ms, 0);
    return scored;
  });
  const wpmAvg = totalSpeechMs > 0 ? Math.round(totalSpeechWords / (totalSpeechMs / 60000)) : 0;

  onProgress({ stage: 'analyzing', pct: 80 });

  // Fix #14: build a Set of filler word indices instead of O(N×M) .some() per word
  // filler.js already pads each hit (PRE_PAD_MS/POST_PAD_MS) before returning
  // segments — the extra ±200ms here was stacking a SECOND pad on top of that
  // one, widening the effective marking window to 350ms before / 250ms after
  // each filler. At normal speech cadence that reliably swallowed the
  // preceding word too.
  const fillerIntervals = fillerSegs.map(f => ({ lo: f.start_ms, hi: f.end_ms }));
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
      `INSERT INTO transcripts (id, recording_id, full_text, word_count, wpm_avg, language, created_at)
       VALUES (?, ?, ?, ?, ?, 'en', datetime('now'))`,
      [transcriptId, recordingId, fullText.trim(), words.length, wpmAvg]
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
      const { wpm, energy } = captionScores[i];
      db.run(
        `INSERT INTO segments (transcript_id, seq, start_ms, end_ms, text, type, wpm, energy)
         VALUES (?, ?, ?, ?, ?, 'speech', ?, ?)`,
        [transcriptId, i, cap.start_ms, cap.end_ms, cap.text, wpm, energy]
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
    try { db.exec('ROLLBACK'); } catch (_) { /* transaction already gone */ }
    throw err;
  }

  // Durability: the 1s debounce in sqlite.js is fine for routine writes, but
  // this transaction is the one place minutes of transcription work land —
  // force it to disk now rather than leaving it to the next scheduled save.
  await db.flush();

  onProgress({ stage: 'done', pct: 100 });

  return { transcriptId, words: words.length, tags: hashtags.length };
}

module.exports = { transcribe, loadWhisper, checkModelCached };
