'use strict';
// Task #66 (part 2): adopt media files on disk that have no matching
// `recordings` row. Reachable two ways — a file finalized successfully but
// the row-insert that should have recorded it was lost (the shutdown gap
// task #21 fixed, or any other dropped write), and the fresh-start case
// right after sqlite.js quarantines a corrupt mob.db and starts empty.
// Scanning the save directory is the only way either kind of orphan gets
// back into the library — there is no backup of the DB itself to restore.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./sqlite');
const settings = require('../settings');
const { getDeviceId } = require('../identity');
const { recordingKey } = require('../r2/key');

const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm']);

/**
 * @returns {Promise<{scanned:number, adopted:Array<{id:string,path:string}>}>}
 */
async function reconcileOrphanedRecordings() {
  const saveDir = settings.get().recording.saveDir;
  let entries = [];
  try { entries = fs.readdirSync(saveDir); } catch (_) { return { scanned: 0, adopted: [] }; }

  const existingPaths = new Set(db.all('SELECT path FROM recordings').map(r => r.path));
  const adopted = [];
  let scanned = 0;

  // Lazy require: ffmpeg-static shouldn't load into every db.init() path
  // (reconcile is only invoked explicitly, not from init itself).
  const ffmpeg = require('../ffmpeg');

  for (const name of entries) {
    const ext = path.extname(name).toLowerCase();
    if (!VIDEO_EXTENSIONS.has(ext)) continue;
    const filePath = path.join(saveDir, name);

    let stat;
    try { stat = fs.statSync(filePath); } catch (_) { continue; }
    if (!stat.isFile()) continue;
    scanned++;
    if (existingPaths.has(filePath)) continue;

    let durationMs = null;
    try { durationMs = await ffmpeg.probeDuration(filePath); } catch (_) { /* leave null — still worth indexing */ }

    const id = crypto.randomUUID();
    const format = ext === '.webm' ? 'webm' : 'mp4';
    db.run(
      // created_at from the file's own mtime (via unixepoch, so it matches
      // datetime('now')'s format and sorts correctly against real rows),
      // not "now" — an orphan recovered today may be weeks old.
      `INSERT INTO recordings (id, device_id, path, duration_ms, status, r2_key, created_at)
       VALUES (?, ?, ?, ?, 'ready', ?, datetime(?, 'unixepoch'))`,
      [id, getDeviceId(), filePath, durationMs, recordingKey(id, format), Math.floor(stat.mtimeMs / 1000)]
    );
    adopted.push({ id, path: filePath });
  }

  if (adopted.length) await db.flush();
  return { scanned, adopted };
}

module.exports = { reconcileOrphanedRecordings };
