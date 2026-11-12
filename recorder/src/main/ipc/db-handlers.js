'use strict';
// IPC bridge: renderer ↔ SQLite (ADR-001, ADR-003).
// Fix #1: Replaced open-SQL handlers with named query handlers.
// The renderer can only call whitelisted operations with bound parameters —
// never raw SQL text. This closes the arbitrary-SQL injection surface.

const { ipcMain } = require('electron');
const db = require('../db/sqlite');
const { getDeviceId } = require('../identity');

// ── named read queries ──────────────────────────────────────────────────────

const QUERIES = {
  // recordings
  'recordings:list': () =>
    db.all('SELECT id, device_id, path, thumb, r2_key, duration_ms, codec, status, title, created_at FROM recordings ORDER BY created_at DESC'),
  'recordings:get': ([id]) =>
    db.get('SELECT * FROM recordings WHERE id = ?', [id]),
  // #52: library search — matches on title, filename, or transcript text.
  // LIKE over the existing columns rather than an FTS5 virtual table: sql.js's
  // WASM build isn't guaranteed to ship the FTS5 extension, and at the
  // dataset size this app actually accumulates per user, a substring scan
  // over a few hundred rows costs nothing worth building a new table for.
  'recordings:search': ([term]) => {
    const t = '%' + String(term || '').toLowerCase() + '%';
    return db.all(
      `SELECT DISTINCT r.id FROM recordings r
       LEFT JOIN transcripts t ON t.recording_id = r.id
       WHERE LOWER(COALESCE(r.title, '')) LIKE ?
          OR LOWER(r.path) LIKE ?
          OR LOWER(COALESCE(t.full_text, '')) LIKE ?`,
      [t, t, t]
    );
  },

  // transcripts
  'transcripts:latest': ([recording_id]) =>
    db.get('SELECT * FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recording_id]),

  // words
  'words:list': ([transcript_id]) =>
    db.all('SELECT * FROM words WHERE transcript_id = ? ORDER BY start_ms', [transcript_id]),
  'words:fillers': ([transcript_id]) =>
    db.all('SELECT * FROM words WHERE transcript_id = ? AND is_filler = 1 ORDER BY start_ms', [transcript_id]),

  // segments
  'segments:list': ([transcript_id]) =>
    db.all('SELECT * FROM segments WHERE transcript_id = ? ORDER BY seq', [transcript_id]),
  'segments:silences': ([transcript_id]) =>
    db.all("SELECT * FROM segments WHERE transcript_id = ? AND type = 'silence' ORDER BY seq", [transcript_id]),

  // metadata_tags
  'tags:list': ([recording_id]) =>
    db.all('SELECT * FROM metadata_tags WHERE recording_id = ?', [recording_id]),

  // edl
  'edl:list': ([recording_id]) =>
    db.all('SELECT * FROM edl_entries WHERE recording_id = ? ORDER BY seq', [recording_id]),

  // production_packages
  // packages:withVariants used to duplicate this query byte-for-byte and
  // was never called from the renderer — removed rather than kept in sync.
  'packages:latest': ([recording_id]) =>
    db.get('SELECT * FROM production_packages WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recording_id]),

  // distributions
  'distributions:latest': ([recording_id]) =>
    db.get('SELECT * FROM distributions WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recording_id]),

  // clips
  'clips:list': ([recording_id]) =>
    db.all('SELECT * FROM clips WHERE recording_id = ? ORDER BY created_at DESC', [recording_id]),
};

// ── named write operations ──────────────────────────────────────────────────

// distributions:insert used to live here as a mutation the renderer could
// call directly with an arbitrary id/device_id — unused (sync-handlers.js's
// sync:prepare is the real, server-side path that generates both), and
// letting a renderer-supplied device_id into a write is exactly the kind of
// thing ADR-003's device-identity model exists to prevent. Removed.
const MUTATIONS = {
  // Only columns actually present in the payload are written. The caller
  // used to always send all three edited_* keys (null for the two the user
  // wasn't touching), which meant every save overwrote the other two fields
  // with NULL. Column names here are a fixed, hardcoded allowlist — never
  // renderer-controlled — so this stays clear of raw SQL from the renderer.
  'packages:update': (payload) => {
    const { id } = payload;
    const sets = [];
    const vals = [];
    if ('edited_title' in payload) {
      sets.push('edited_title = ?');
      vals.push(payload.edited_title ?? null);
    }
    if ('edited_description' in payload) {
      sets.push('edited_description = ?');
      vals.push(payload.edited_description ?? null);
    }
    if ('edited_hashtags_json' in payload) {
      const v = payload.edited_hashtags_json;
      sets.push('edited_hashtags_json = ?');
      vals.push(v != null ? (typeof v === 'string' ? v : JSON.stringify(v)) : null);
    }
    if (sets.length) {
      db.run(`UPDATE production_packages SET ${sets.join(', ')} WHERE id = ?`, [...vals, id]);
    }
    return { ok: true };
  },

  // #52: user-set recording title (nothing ever wrote this column before —
  // the list only ever showed the raw filename).
  'recordings:rename': (payload) => {
    const { id, title } = payload;
    if (!id || !db.get('SELECT id FROM recordings WHERE id = ?', [id])) {
      throw new Error('Recording not found: ' + id);
    }
    const t = title == null ? null : String(title).trim().slice(0, 200) || null;
    db.run('UPDATE recordings SET title = ? WHERE id = ?', [t, id]);
    return { ok: true, title: t };
  },
};

// ── IPC handlers ────────────────────────────────────────────────────────────

function register() {
  // Named read query: window.mob.db.query('recordings:list')
  ipcMain.handle('db:query', (_e, name, params = []) => {
    const fn = QUERIES[name];
    if (!fn) throw new Error('Unknown query: ' + name);
    return fn(params);
  });

  // Named write mutation: window.mob.db.mutate('distributions:insert', {...})
  ipcMain.handle('db:mutate', (_e, name, payload = {}) => {
    const fn = MUTATIONS[name];
    if (!fn) throw new Error('Unknown mutation: ' + name);
    return fn(payload);
  });

  // Device identity — read-only, safe to expose
  ipcMain.handle('db:deviceId', () => getDeviceId());
}

module.exports = { register };
