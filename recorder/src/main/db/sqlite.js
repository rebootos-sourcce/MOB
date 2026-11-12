'use strict';
// MOB local SQLite database (ADR-001: local-first source of truth).
// Uses sql.js (pure WASM) — no native rebuild required for Electron cross-platform.
// The database file lives at userData/mob.db and is loaded/saved around each write.

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { app } = require('electron');
const { runMigrations } = require('./migrate');

let SQL = null;      // sql.js module
let db = null;       // sql.js Database instance
let dbPath = null;
let saveTimer = null;
let dirty = false;
// Set by init() when mob.db failed to open/validate and was quarantined —
// main.js reads this right after awaiting init() to tell the user what
// happened instead of continuing in silence with a brand-new empty DB.
let lastRecovery = null;
// Serializes every persist() so a debounced write and a shutdown write can
// never run concurrently and interleave their truncating writes onto dbPath.
let persistChain = Promise.resolve();

// ---------------------------------------------------------------- init

async function init(customPath) {
  if (db) return db;

  const initSqlJs = require('sql.js');
  SQL = await initSqlJs({
    locateFile: (filename) => {
      // WASM must live on the real filesystem (not inside the asar archive).
      // In production the asarUnpack rule copies sql.js/dist/* to app.asar.unpacked.
      const base = path.join(__dirname, '..', '..', '..', 'node_modules', 'sql.js', 'dist', filename);
      return base.replace(/app\.asar[/\\]/, 'app.asar.unpacked/');
    },
  });

  dbPath = customPath || path.join(app.getPath('userData'), 'mob.db');
  lastRecovery = null;

  // Load existing database or create empty one. Given the non-atomic
  // persist this app used to do (now fixed, but old corrupt files can
  // still be sitting on disk from before that fix, and a corrupt file is
  // reachable again from any failure persistNow()'s rename can't cover —
  // e.g. a damaged filesystem), a bad mob.db used to throw straight out of
  // init(), which main.js caught by showing an error dialog and quitting —
  // on every subsequent launch, forever, with no repair path at all.
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    try {
      db = new SQL.Database(data);
      // new SQL.Database() only parses the header well enough to open — a
      // file truncated or damaged mid-page can still "open" and then throw
      // (or silently return wrong data) the first time a query touches the
      // damaged page. Run a real integrity check now, once, rather than at
      // some unpredictable later read.
      const result = db.exec('PRAGMA integrity_check');
      const verdict = result[0] && result[0].values[0] && result[0].values[0][0];
      if (verdict !== 'ok') throw new Error('integrity_check reported: ' + verdict);
    } catch (err) {
      db = null;
      lastRecovery = quarantineCorruptFile(dbPath, err);
    }
  }
  if (!db) db = new SQL.Database();

  await applySchema();
  runMigrations();
  return db;
}

// Backs up the bad file next to itself (never discards it) and lets the
// caller start fresh at the same path. Matches settings.js/identity.js's
// own corrupt-file convention (.corrupt-<timestamp>, copied not moved, so
// a failure here never destroys the one copy of the user's data).
function quarantineCorruptFile(badPath, err) {
  let quarantinePath = null;
  try {
    quarantinePath = badPath + '.corrupt-' + Date.now();
    fs.copyFileSync(badPath, quarantinePath);
  } catch (copyErr) {
    quarantinePath = null;
  }
  console.error(
    '[mob] mob.db failed to open/validate and has been reset to a fresh, empty database;' +
    (quarantinePath ? ' the bad file was backed up to ' + quarantinePath : ' backing up the bad file also failed') +
    ':', err.message
  );
  return { quarantinePath, error: err.message };
}

function getLastRecovery() { return lastRecovery; }

// Part 3 of task #66: migrate.js is forward-only with no down-migrations,
// and a crash mid-migration would otherwise land directly on the (atomic,
// but still the one copy of the) persisted DB with no way back to the
// pre-migration state. Exports the CURRENT in-memory state rather than
// copying dbPath on disk — applySchema() always persists before
// runMigrations() is called, so the two are in sync at this point, but
// exporting in-memory state directly doesn't depend on that staying true.
function backupBeforeMigration(label) {
  if (!db || !dbPath) return null;
  try {
    const data = db.export();
    const backupPath = `${dbPath}.pre-migration-v${label}-${Date.now()}`;
    fs.writeFileSync(backupPath, Buffer.from(data));
    return backupPath;
  } catch (err) {
    console.error('[mob] failed to back up DB before migration:', err.message);
    return null;
  }
}

function getDbPath() { return dbPath; }

// Task #75: the cheapest insurance against the corruption scenario tasks
// #20/#66 exist for — mob.db is a single sql.js file written non-atomically
// (well, atomically per-write now, but still one file, one copy). Kept in
// their own backups/ directory next to mob.db, separate from the ad-hoc
// .corrupt-*/.pre-migration-* sibling files those other fixes write, since
// this is a managed, retained set rather than a one-off recovery artifact.
function backupNow(reason = 'manual') {
  if (!db || !dbPath) return null;
  try {
    const backupDir = path.join(path.dirname(dbPath), 'backups');
    fs.mkdirSync(backupDir, { recursive: true });
    const data = db.export();
    const backupPath = path.join(backupDir, `mob-backup-${reason}-${Date.now()}.db`);
    fs.writeFileSync(backupPath, Buffer.from(data));
    return backupPath;
  } catch (err) {
    console.error('[mob] backupNow failed:', err.message);
    return null;
  }
}

/** Keeps only the newest `keep` backups of each reason, deleting the rest. */
function pruneBackups(keep = 10) {
  if (!dbPath) return;
  const backupDir = path.join(path.dirname(dbPath), 'backups');
  let entries;
  try { entries = fs.readdirSync(backupDir); } catch (_) { return; }
  const byReason = new Map();
  for (const name of entries) {
    const m = name.match(/^mob-backup-([a-z]+)-(\d+)\.db$/);
    if (!m) continue;
    const reason = m[1];
    if (!byReason.has(reason)) byReason.set(reason, []);
    byReason.get(reason).push({ name, ts: Number(m[2]) });
  }
  for (const files of byReason.values()) {
    files.sort((a, b) => b.ts - a.ts);
    for (const f of files.slice(keep)) {
      try { fs.unlinkSync(path.join(backupDir, f.name)); } catch (_) { /* best effort */ }
    }
  }
}

/** Lists existing backups, newest first, for the UI. */
function listBackups() {
  if (!dbPath) return [];
  const backupDir = path.join(path.dirname(dbPath), 'backups');
  let entries;
  try { entries = fs.readdirSync(backupDir); } catch (_) { return []; }
  return entries
    .filter(name => /^mob-backup-[a-z]+-\d+\.db$/.test(name))
    .map(name => {
      const full = path.join(backupDir, name);
      let size = 0;
      try { size = fs.statSync(full).size; } catch (_) {}
      const ts = Number(name.match(/-(\d+)\.db$/)[1]);
      return { name, path: full, createdAt: new Date(ts).toISOString(), sizeBytes: size };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function applySchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  db.run(sql);
  await persist();
}

// ---------------------------------------------------------------- persistence

// Fix #7: async persist — no longer blocks the main thread on writeFileSync.
// Fix: write to a temp file and rename into place instead of truncating
// dbPath directly. writeFile(dbPath) destroys the last-known-good database
// before the new bytes land; a crash or power loss mid-write left mob.db
// truncated with no way to recover. rename() on the same filesystem is
// atomic, so dbPath always holds either the old complete file or the new
// complete file, never a partial one.
async function persistNow() {
  if (!db || !dbPath) return;
  const data = db.export();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmpPath = dbPath + '.tmp-' + process.pid;
  await fsPromises.writeFile(tmpPath, Buffer.from(data));
  await fsPromises.rename(tmpPath, dbPath);
}

// Fix: serialize every persist behind one chain. The debounce timer and an
// explicit flush()/close() used to call persistNow() independently, so a
// quit arriving just after the timer fired could run two concurrent
// export+write passes against the same path — two different-length exports
// racing their renames, leaving dbPath as a hybrid of neither. Every call
// now waits for the previous one to finish (success or failure) before its
// own export is taken, and a failed step never breaks the chain for the
// next caller.
function persist() {
  const result = persistChain.then(persistNow, persistNow);
  persistChain = result.catch(() => {});
  return result;
}

function schedulePersist() {
  dirty = true;
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (dirty) {
      dirty = false;
      persist().catch((err) => console.error('[mob] DB persist failed:', err.message));
    }
  }, 1000);
}

// ---------------------------------------------------------------- public API

function run(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  db.run(sql, params);
  schedulePersist();
}

function get(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function all(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  const rows = [];
  const stmt = db.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function exec(sql) {
  if (!db) throw new Error('DB not initialized');
  db.run(sql);
  schedulePersist();
}

async function flush() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  dirty = false;
  await persist();
}

async function close() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  if (db) { await persist(); db.close(); db = null; }
}

function isReady() { return db !== null; }

module.exports = { init, run, get, all, exec, persist, flush, close, isReady, getLastRecovery, backupBeforeMigration, getDbPath, backupNow, pruneBackups, listBackups };
