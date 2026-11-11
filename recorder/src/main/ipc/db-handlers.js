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
  'packages:latest': ([recording_id]) =>
    db.get('SELECT * FROM production_packages WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recording_id]),
  'packages:withVariants': ([recording_id]) =>
    db.get('SELECT * FROM production_packages WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recording_id]),

  // distributions
  'distributions:latest': ([recording_id]) =>
    db.get('SELECT * FROM distributions WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recording_id]),

  // clips
  'clips:list': ([recording_id]) =>
    db.all('SELECT * FROM clips WHERE recording_id = ? ORDER BY created_at DESC', [recording_id]),
};

// ── named write operations ──────────────────────────────────────────────────

const MUTATIONS = {
  'packages:update': ({ id, edited_title, edited_description, edited_hashtags_json }) => {
    db.run(
      `UPDATE production_packages
       SET edited_title = ?, edited_description = ?, edited_hashtags_json = ?
       WHERE id = ?`,
      [
        edited_title        ?? null,
        edited_description  ?? null,
        edited_hashtags_json != null
          ? (typeof edited_hashtags_json === 'string' ? edited_hashtags_json : JSON.stringify(edited_hashtags_json))
          : null,
        id,
      ]
    );
    return { ok: true };
  },
  'distributions:insert': ({ id, device_id, recording_id, package_id, platform, status }) => {
    db.run(
      `INSERT INTO distributions (id, device_id, recording_id, package_id, platform, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, device_id, recording_id, package_id, platform || 'cloud', status || 'pending']
    );
    return { ok: true };
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
