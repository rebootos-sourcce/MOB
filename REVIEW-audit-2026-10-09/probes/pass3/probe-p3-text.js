/* Pass 3 text probe. node probe-p3-text.js <source.html> <out.txt>
   Dumps every sentence the built page shows that talks about where data is, in four states:
   signed out and signed in, on the Account sections, the login card, the first onboarding card and the profile sheet. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SRC = path.resolve(process.argv[2]), OUT = process.argv[3];
const WORKER = 'https://atuned-api.lance-o-powell.workers.dev';
const J = x => JSON.stringify(x);
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const RE = /(device|browser|server|sent|send|leave|copy|copies|delete|deleted|account|sign in|signed in|held|stored|store|never|nobody|only|name)/i;
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const lines = [];
  for (const signed of [false, true]) {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.route(WORKER + '/**', r => r.abort());
    await cx.addInitScript(a => { try { if (a.signed && !sessionStorage.getItem('__s')) { sessionStorage.setItem('__s', '1');
      localStorage.setItem('source.session', JSON.stringify({ token: 'tok-probe-1', email: 'probe@example.invalid', accountId: 'acc_probe' })); } } catch (e) {} }, { signed });
    const pg = await cx.newPage();
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' });
    await pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 }).catch(() => null);
    await pg.waitForTimeout(600);
    const tag = signed ? 'IN ' : 'OUT';
    const secs = await pg.evaluate(() => { setTab(TAB.SETTINGS); return ACC_SECS.map(s => s.k); });
    for (const k of secs) {
      const t = await pg.evaluate(k => { ACC_OPEN = k; renderAccount(); return document.getElementById('settings').innerText; }, k);
      t.split(/\n+/).filter(l => RE.test(l) && l.trim().length > 25).forEach(l => lines.push(tag + ' settings/' + k + ' | ' + l.trim()));
    }
    const prof = await pg.evaluate(() => { profileSheet(); const t = document.getElementById('sheet-card').innerText; sheetShut(); return t; });
    prof.split(/\n+/).filter(l => RE.test(l) && l.trim().length > 25).forEach(l => lines.push(tag + ' profile sheet | ' + l.trim()));
    const ob = await pg.evaluate(() => { obOpen(true); OB.step = 0; obRender(); const t = document.getElementById('ob').innerText; try { obClose(); } catch (e) {} return t; });
    ob.split(/\n+/).filter(l => RE.test(l) && l.trim().length > 25).forEach(l => lines.push(tag + ' onboarding card 0 | ' + l.trim()));
    await cx.close();
  }
  // the login card, no session
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await cx.route(WORKER + '/**', r => r.abort());
    const pg = await cx.newPage();
    await pg.goto('file://' + SRC, { waitUntil: 'load' });
    await pg.waitForTimeout(8000);
    const t = await pg.evaluate(() => { const h = document.getElementById('login'); return h ? h.innerText : '(no login host)'; });
    lines.push('OUT login card (no ?dev) | ' + t.replace(/\n+/g, ' / '));
    await cx.close();
  }
  fs.writeFileSync(OUT, lines.join('\n'));
  console.log(lines.join('\n'));
  await browser.close();
})().catch(e => { console.error('PROBE THREW', e); process.exit(1); });
