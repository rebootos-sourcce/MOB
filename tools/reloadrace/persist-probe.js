/* tests/persist.js with its answer unchanged, plus a timeline: every 250 ms it
   reads the check in the second page, the keys that page sees, and the first
   page's own view and round trip, and on a miss dumps the first page's store
   writes and long tasks. Lines go to stdout prefixed PROBE. */
const path = require('path'), fs = require('fs'), os = require('os');
let BLANK = null, N = 0;
function blank() {
  if (!BLANK) {
    const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'persist-')), 'blank.html');
    fs.writeFileSync(f, '<!doctype html><title>store</title>');
    BLANK = 'file://' + f;
  }
  return BLANK;
}
const keys = () => Object.keys(localStorage).sort().map(k => { const v = localStorage.getItem(k) || ''; let h = 0; for (let i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) | 0; return k + ':' + v.length + '#' + (h >>> 0).toString(36); }).join(' ');
async function persisted(page, fn, arg, ms) {
  const id = ++N, T0 = Date.now(), line = [];
  const log = s => { const l = 'PROBE ' + id + ' +' + (Date.now() - T0) + ' ' + s; line.push(l); console.log(l); };
  const own = await page.evaluate(([f, a]) => { try { return (0, eval)('(' + f + ')')(a); } catch (e) { return 'err ' + e; } }, [fn.toString(), arg === undefined ? null : arg]).catch(e => 'eval ' + e.message);
  log('first page sees its own write: ' + own);
  const q = await page.context().newPage();
  let got = false;
  try {
    await q.goto(blank());
    log('second page open, keys ' + await q.evaluate(keys));
    const lim = ms || 20000;
    let last = null;
    while (Date.now() - T0 < lim + 2000) {
      const a = Date.now();
      const v = await q.evaluate(fn, arg === undefined ? null : arg).catch(e => 'err');
      const b = Date.now();
      const p = await page.evaluate(() => [Date.now(), (window.__lt || []).length]).catch(() => [0, 0]);
      const c = Date.now();
      const s = 'second ' + v + ' (' + (b - a) + ' ms) first page round trip ' + (c - b) + ' ms, long tasks ' + p[1];
      if (s !== last || v === true) log(s);
      last = s;
      if (v === true) { got = true; break; }
      await new Promise(r => setTimeout(r, 250));
    }
    if (!got) {
      log('MISS. second keys ' + await q.evaluate(keys).catch(e => e.message));
      log('first keys ' + await page.evaluate(keys).catch(e => e.message));
      const d = await page.evaluate(() => ({ w: (window.__ls || []).slice(-30), lt: (window.__lt || []).slice(-40), now: Date.now() })).catch(e => ({ err: e.message }));
      log('first page writes (time, op, key, length, threw) ' + JSON.stringify(d.w));
      log('first page long tasks (start, ms) ' + JSON.stringify(d.lt) + ' now ' + d.now);
      /* is the pipe from the first page broken, or only late: a fresh key */
      const sent = 'p' + Date.now();
      await page.evaluate(v => localStorage.setItem('zz-sentinel', v), sent).catch(() => {});
      const s0 = Date.now(); let seen = null;
      while (Date.now() - s0 < 5000) { seen = await q.evaluate(() => localStorage.getItem('zz-sentinel')).catch(() => 'err'); if (seen === sent) break; await new Promise(r => setTimeout(r, 100)); }
      log('a fresh key from the first page ' + (seen === sent ? 'reached' : 'did not reach') + ' the second page in ' + (Date.now() - s0) + ' ms');
      /* and a third page opened now */
      const r = await page.context().newPage(); await r.goto(blank()).catch(() => {});
      log('a third page opened now sees ' + await r.evaluate(keys).catch(e => e.message) + ', check ' + await r.evaluate(fn, arg === undefined ? null : arg).catch(e => 'err'));
      await r.close().catch(() => {});
      await page.evaluate(() => localStorage.removeItem('zz-sentinel')).catch(() => {});
    } else {
      const d = await page.evaluate(() => ({ lt: (window.__lt || []).filter(x => x[0] > Date.now() - 30000) })).catch(e => ({}));
      log('long tasks in the last 30 s ' + JSON.stringify(d.lt));
    }
    return got;
  } catch (e) { log('threw ' + e.message); return false; } finally { await q.close().catch(() => {}); }
}
module.exports = { persisted };
