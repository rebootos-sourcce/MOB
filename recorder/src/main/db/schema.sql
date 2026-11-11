-- MOB Recorder — SQLite schema v1
-- Local-first (ADR-001): this is the source of truth; D1 is sync-only.
-- device_id on root tables (ADR-003); edl_entries (ADR-002); r2_key not r2_url.

-- Schema versioning table (for migrate.js)
CREATE TABLE IF NOT EXISTS schema_version (
  version    INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recordings (
  id           TEXT PRIMARY KEY,
  device_id    TEXT NOT NULL,
  path         TEXT,
  thumb        TEXT,
  r2_key       TEXT,
  duration_ms  INTEGER,
  codec        TEXT,
  resolution   TEXT,
  fps          INTEGER,
  size_bytes   INTEGER,
  status       TEXT NOT NULL DEFAULT 'raw',
  title        TEXT,
  created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clips (
  id           TEXT PRIMARY KEY,
  recording_id TEXT NOT NULL REFERENCES recordings(id),
  type         TEXT NOT NULL,
  label        TEXT,
  start_ms     INTEGER NOT NULL,
  end_ms       INTEGER NOT NULL,
  path         TEXT,
  r2_key       TEXT,
  codec        TEXT,
  created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS metadata_tags (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  recording_id TEXT NOT NULL REFERENCES recordings(id),
  tag          TEXT NOT NULL,
  type         TEXT NOT NULL,
  platform     TEXT,
  score        REAL DEFAULT 1.0,
  idf_score    REAL DEFAULT 0.0
);

-- EDL (ADR-002): retained source ranges + remapped output positions
CREATE TABLE IF NOT EXISTS edl_entries (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  recording_id    TEXT NOT NULL REFERENCES recordings(id),
  clip_id         TEXT REFERENCES clips(id),
  seq             INTEGER NOT NULL,
  source_start_ms INTEGER NOT NULL,
  source_end_ms   INTEGER NOT NULL,
  output_start_ms INTEGER NOT NULL,
  output_end_ms   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS transcripts (
  id           TEXT PRIMARY KEY,
  recording_id TEXT NOT NULL UNIQUE REFERENCES recordings(id),
  model        TEXT NOT NULL DEFAULT 'base.en',
  language     TEXT DEFAULT 'en',
  full_text    TEXT,
  word_count   INTEGER,
  wpm_avg      REAL,
  created_at   TEXT NOT NULL
);
-- Fix #19: enforce one active transcript per recording.
-- transcription.js deletes the old transcript+words+segments before inserting.

CREATE TABLE IF NOT EXISTS words (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id),
  word          TEXT NOT NULL,
  start_ms      INTEGER NOT NULL,
  end_ms        INTEGER NOT NULL,
  confidence    REAL,
  is_filler     INTEGER DEFAULT 0,
  is_silence    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS segments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id),
  seq           INTEGER NOT NULL,
  start_ms      INTEGER NOT NULL,
  end_ms        INTEGER NOT NULL,
  text          TEXT NOT NULL,
  type          TEXT DEFAULT 'speech',
  wpm           REAL,
  energy        REAL DEFAULT 0.0
);

-- Fix #20: captions table removed — speech segments live in `segments` with type='speech',
-- silence gaps with type='silence'. SRT/VTT export reads from segments.

CREATE TABLE IF NOT EXISTS production_packages (
  id              TEXT PRIMARY KEY,
  device_id       TEXT NOT NULL,
  recording_id    TEXT NOT NULL REFERENCES recordings(id),
  clip_id         TEXT REFERENCES clips(id),
  title           TEXT,
  title_variants  TEXT,
  description     TEXT,
  short_desc      TEXT,
  hashtags_json        TEXT,
  chapters_json        TEXT,
  generated_by         TEXT DEFAULT 'whisper',
  edited_title         TEXT,
  edited_description   TEXT,
  edited_hashtags_json TEXT,
  variants_json        TEXT,
  created_at           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS distributions (
  id                 TEXT PRIMARY KEY,
  device_id          TEXT NOT NULL,
  recording_id       TEXT NOT NULL REFERENCES recordings(id),
  clip_id            TEXT REFERENCES clips(id),
  package_id         TEXT REFERENCES production_packages(id),
  platform           TEXT NOT NULL,
  status             TEXT DEFAULT 'pending',
  resume_session_uri TEXT,
  platform_id        TEXT,
  platform_url       TEXT,
  error_msg          TEXT,
  created_at         TEXT NOT NULL,
  published_at       TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clips_rec       ON clips(recording_id);
CREATE INDEX IF NOT EXISTS idx_tags_rec        ON metadata_tags(recording_id);
CREATE INDEX IF NOT EXISTS idx_edl_rec         ON edl_entries(recording_id, seq);
CREATE INDEX IF NOT EXISTS idx_edl_clip        ON edl_entries(clip_id, seq);
CREATE INDEX IF NOT EXISTS idx_trx_rec         ON transcripts(recording_id);
CREATE INDEX IF NOT EXISTS idx_words_trx       ON words(transcript_id);
CREATE INDEX IF NOT EXISTS idx_words_start     ON words(transcript_id, start_ms);
CREATE INDEX IF NOT EXISTS idx_words_filler    ON words(transcript_id, is_filler);
CREATE INDEX IF NOT EXISTS idx_segments_trx    ON segments(transcript_id);
-- idx_captions_trx removed (captions table dropped, Fix #20)
CREATE INDEX IF NOT EXISTS idx_pkgs_rec        ON production_packages(recording_id);
CREATE INDEX IF NOT EXISTS idx_pkgs_clip       ON production_packages(clip_id);
CREATE INDEX IF NOT EXISTS idx_dists_rec       ON distributions(recording_id);
CREATE INDEX IF NOT EXISTS idx_dists_pkg       ON distributions(package_id);
CREATE INDEX IF NOT EXISTS idx_dists_status    ON distributions(status);
