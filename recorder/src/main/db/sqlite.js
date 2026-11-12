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

  // Load existing database or create empty one
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }

  await applySchema();
  runMigrations();
  return db;
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

module.exports = { init, run, get, all, exec, persist, flush, close, isReady };
