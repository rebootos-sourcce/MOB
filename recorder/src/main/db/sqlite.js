'use strict';
// MOB local SQLite database (ADR-001: local-first source of truth).
// Uses sql.js (pure WASM) — no native rebuild required for Electron cross-platform.
// The database file lives at userData/mob.db and is loaded/saved around each write.

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { app } = require('electron');

let SQL = null;      // sql.js module
let db = null;       // sql.js Database instance
let dbPath = null;
let saveTimer = null;
let dirty = false;

// ---------------------------------------------------------------- init

async function init(customPath) {
  if (db) return db;

  const initSqlJs = require('sql.js');
  SQL = await initSqlJs();

  dbPath = customPath || path.join(app.getPath('userData'), 'mob.db');

  // Load existing database or create empty one
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }

  applySchema();
  return db;
}

function applySchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  db.run(sql);
  persist();
}

// ---------------------------------------------------------------- persistence

// Fix #7: async persist — no longer blocks the main thread on writeFileSync.
async function persist() {
  if (!db || !dbPath) return;
  const data = db.export();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await fsPromises.writeFile(dbPath, Buffer.from(data));
}

function schedulePersist() {
  dirty = true;
  if (saveTimer) return;
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    if (dirty) { dirty = false; await persist(); }
  }, 500);
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

async function close() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  if (db) { await persist(); db.close(); db = null; }
}

function isReady() { return db !== null; }

module.exports = { init, run, get, all, exec, persist, close, isReady };
