/* Pass 3 side-store probe. node probe-p3-side.js <source.html> <out.json>
   Which per-profile side keys does a profile delete clear, and does the exported record carry them? */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SRC = path.resolve(process.argv[2]), OUT = process.argv[3];
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const J = x => JSON.stringify(x);
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await cx.route(WORKER + '/**', r => r.abort());
  const pg = await cx.newPage();
  await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);
  const out = await pg.evaluate(() => {
    const id = CURP.id;
    const keys = [AV_KEY, RIT_KEY, RIT_MORE_KEY];
    const seed = { [id]: { marker: 'SIDE-STORE-MARKER', save: [{ k: 'x', why: 'a saved reason', t: new Date().toISOString() }] } };
    keys.forEach(k => localStorage.setItem(k, JSON.stringify(seed)));
    const exportHas = keys.map(k => pExport().indexOf('SIDE-STORE-MARKER') >= 0);
    window.confirm = () => true;
    const r = accProfDelete(id);
    const left = keys.filter(k => (localStorage.getItem(k) || '').indexOf('SIDE-STORE-MARKER') >= 0);
    return { keys, exportCarriesAnySideMarker: exportHas.some(Boolean), deleted: r, stillHoldingTheDeletedProfilesEntry: left,
      allLocalKeys: Object.keys(localStorage).sort(), status: document.getElementById('status').textContent };
  });
  console.log('side keys checked: ' + J(out.keys));
  console.log('pExport() carries a side-store entry: ' + out.exportCarriesAnySideMarker);
  console.log('accProfDelete returned ' + out.deleted + '; status line: ' + J(out.status));
  console.log('keys that STILL hold the deleted profile\'s entry afterwards: ' + J(out.stillHoldingTheDeletedProfilesEntry));
  console.log('all localStorage keys after: ' + J(out.allLocalKeys));

  // import the same record twice, then delete once: does a copy survive?
  const dup = await pg.evaluate(() => {
    window.confirm = () => true;
    const own = CURP;
    own.name = 'Dupe Probe'; pSave();
    const txt = pExport();
    const a = pImport(txt), b = pImport(txt);
    const before = PROFILES.length, ids = PROFILES.map(p => p.id);
    const sameId = ids.filter(i => i === own.id).length;
    const r = accProfDelete(own.id);
    return { importedOnce: !!a, importedTwice: !!b, profilesBeforeDelete: before, copiesWithThatId: sameId, deleteReturned: r,
      copiesLeftWithThatId: PROFILES.filter(p => p.id === own.id).length, namesLeft: PROFILES.map(p => p.name) };
  });
  console.log('import twice then delete once: ' + J(dup));
  out.dup = dup;
  fs.writeFileSync(OUT, J(out, null, 1));
  await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
