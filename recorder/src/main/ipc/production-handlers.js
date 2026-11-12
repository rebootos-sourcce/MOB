'use strict';
const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const db = require('../db/sqlite');
const { assemblePackage, regeneratePackageField } = require('../production');

function msToYoutubeTimestamp(ms) {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function register() {
  ipcMain.handle('production:assemble', async (_e, { recordingId, clipId }) => {
    return assemblePackage({ recordingId, clipId });
  });

  // #53: regenerate ONE field of an existing package in place, instead of
  // forcing a full assemble that discards every other field's manual edit.
  ipcMain.handle('production:regenerateField', async (_e, { packageId, field }) => {
    return regeneratePackageField(packageId, field);
  });

  // #53: Export was clipboard-text-only, with no file the user could hand
  // to an upload form or keep as a record. Exports the package as JSON
  // (everything, including every platform variant) plus a YouTube
  // description .txt with the spec'd chapter timestamp block — the one
  // platform whose upload form expects a pasted description with chapters
  // baked in as plain text, not a separate field.
  ipcMain.handle('production:exportFiles', async (event, { packageId }) => {
    const pkg = db.get('SELECT * FROM production_packages WHERE id = ?', [packageId]);
    if (!pkg) throw new Error('Package not found: ' + packageId);
    const recording = db.get('SELECT * FROM recordings WHERE id = ?', [pkg.recording_id]);
    const baseName = (recording && recording.path)
      ? path.basename(recording.path, path.extname(recording.path))
      : 'package';

    const win = BrowserWindow.fromWebContents(event.sender);
    const res = await dialog.showSaveDialog(win, {
      title: 'Export production package',
      defaultPath: baseName + '.json',
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (res.canceled || !res.filePath) return { ok: false };

    const titleVariants = pkg.title_variants ? JSON.parse(pkg.title_variants) : [];
    const title = pkg.edited_title || titleVariants[0] || pkg.title || '';
    const description = pkg.edited_description || pkg.description || '';
    const hashtags = (pkg.edited_hashtags_json ? JSON.parse(pkg.edited_hashtags_json) : JSON.parse(pkg.hashtags_json || '[]'))
      .map(h => (typeof h === 'string' ? h : h.tag));
    const chapters = JSON.parse(pkg.chapters_json || '[]');
    const variants = pkg.variants_json ? JSON.parse(pkg.variants_json) : null;

    fs.writeFileSync(res.filePath, JSON.stringify({ title, titleVariants, description, hashtags, chapters, variants }, null, 2), 'utf8');

    const ytPath = res.filePath.replace(/\.json$/i, '') + '.youtube.txt';
    const chapterBlock = chapters.length
      ? '\n\n--- Chapters ---\n' + chapters.map(c => `${msToYoutubeTimestamp(c.start_ms)} ${c.title}`).join('\n')
      : '';
    const ytText = [description, hashtags.join(' '), chapterBlock].filter(Boolean).join('\n\n');
    fs.writeFileSync(ytPath, ytText, 'utf8');

    return { ok: true, jsonPath: res.filePath, youtubePath: ytPath };
  });
}

module.exports = { register };
