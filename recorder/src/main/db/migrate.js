'use strict';
// Schema migration runner for sql.js (in-memory WASM SQLite).
// Since sql.js uses IF NOT EXISTS for all tables, we use schema_version
// to track and apply ALTER TABLE upgrades safely.
// NOTE: db is required lazily inside runMigrations() to break the circular
// dependency with sqlite.js (sqlite→migrate→sqlite at module-load time).

const MIGRATIONS = [
  {
    version: 1,
    // v1 = initial schema (all base tables via schema.sql). No-op here.
    up(d) { /* nothing — schema.sql creates all v1 tables */ },
  },
  {
    version: 2,
    // v2 = add user-editable fields + variants to production_packages
    up(d) {
      const cols = d.all("PRAGMA table_info(production_packages)").map(r => r.name);
      if (!cols.includes('edited_title'))
        d.exec("ALTER TABLE production_packages ADD COLUMN edited_title TEXT");
      if (!cols.includes('edited_description'))
        d.exec("ALTER TABLE production_packages ADD COLUMN edited_description TEXT");
      if (!cols.includes('edited_hashtags_json'))
        d.exec("ALTER TABLE production_packages ADD COLUMN edited_hashtags_json TEXT");
      if (!cols.includes('variants_json'))
        d.exec("ALTER TABLE production_packages ADD COLUMN variants_json TEXT");
    },
  },
  {
    version: 3,
    // v3 = add missing FK indexes (schema.sql covers new installs; migration covers upgrades)
    up(d) {
      d.exec("CREATE INDEX IF NOT EXISTS idx_pkgs_clip ON production_packages(clip_id)");
      d.exec("CREATE INDEX IF NOT EXISTS idx_dists_pkg ON distributions(package_id)");
    },
  },
];

function runMigrations() {
  const db = require('./sqlite'); // lazy — avoids circular dep at module-load time
  const row = db.get('SELECT MAX(version) AS v FROM schema_version');
  const current = (row && row.v != null) ? row.v : 0;

  const pending = MIGRATIONS.filter(m => m.version > current);
  if (pending.length === 0) return;

  // Back up once for the whole pending batch, before any of them run —
  // see backupBeforeMigration's own comment for why.
  db.backupBeforeMigration(pending[pending.length - 1].version);

  for (const m of pending) {
    m.up(db);
    db.run(
      "INSERT OR REPLACE INTO schema_version (version, applied_at) VALUES (?, datetime('now'))",
      [m.version]
    );
  }
}

module.exports = { runMigrations };
