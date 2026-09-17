'use strict';
/**
 * Screenshot harness (npm run shot). Only loaded when MOB_SHOT=1.
 *
 * Captures the control panel and the camera bubble to PNGs so the layout can
 * be reviewed without a physical screen. MOB_SHOT_STATES may list extra
 * variants to capture, comma separated:
 *   output   - control panel with the Output section expanded
 *   shapes   - one bubble capture per shape
 *   compact  - the compact recording bar
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function install({ settings, getWindows, setCompact }) {
  const dir = process.env.MOB_SHOT_DIR || path.join(app.getPath('temp'), 'mob-recorder-shots');
  fs.mkdirSync(dir, { recursive: true });
  const states = (process.env.MOB_SHOT_STATES || '').split(',').map((s) => s.trim()).filter(Boolean);
  const log = (...a) => console.log('[shot]', ...a);
  const wins = getWindows();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  for (const [name, w] of Object.entries(wins)) {
    w.webContents.on('console-message', (_e, level, message, line, src) => {
      if (level >= 2) console.log(`[${name}:err] ${message} (${path.basename(src || '')}:${line})`);
    });
  }

  async function capture(win, file) {
    const img = await win.webContents.capturePage();
    const out = path.join(dir, file);
    fs.writeFileSync(out, img.toPNG());
    log('wrote', out);
  }

  let loaded = 0;
  const onLoaded = async () => {
    if (++loaded < Object.keys(wins).length) return;
    await wait(2500); // let the camera preview and meter come up
    try {
      await capture(wins.control, 'control.png');
      await capture(wins.bubble, 'bubble.png');

      if (states.includes('output')) {
        await wins.control.webContents.executeJavaScript(
          "document.getElementById('outputCard').open = true; document.querySelector('main').scrollTop = 9999;");
        await wait(500);
        await capture(wins.control, 'control-output.png');
        await wins.control.webContents.executeJavaScript(
          "document.getElementById('outputCard').open = false; document.querySelector('main').scrollTop = 0;");
        await wait(400);
      }

      if (states.includes('compact')) {
        setCompact(true);
        await wait(600);
        await capture(wins.control, 'control-compact.png');
        setCompact(false);
        await wait(400);
      }

      if (states.includes('shapes')) {
        const Shapes = require('../shared/shapes');
        for (const id of Shapes.ORDER) {
          settings.set({ bubble: { shape: id } });
          await wait(450);
          await capture(wins.bubble, `bubble-${id}.png`);
        }
        await capture(wins.control, 'control-lastshape.png');
      }
      app.exit(0);
    } catch (err) {
      console.error('[shot] FAIL', err);
      app.exit(1);
    }
  };
  for (const w of Object.values(wins)) w.webContents.once('did-finish-load', onLoaded);
  setTimeout(() => { console.error('[shot] timed out'); app.exit(1); }, 40000);
}

module.exports = { install };
