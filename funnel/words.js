/* ============================================================
   THE WORD COUNT, MEASURED RATHER THAN FELT.

   His brief was a number: "it needs to be sharpened by about, lose about a
   hundred words." A number he can check is a number that gets measured before
   and after, on the same definition, by a program.

   THE DEFINITION, AND IT IS THE WHOLE ARGUMENT. A word is a run of visible
   text on the rendered page. Not a word in the file: the file carries script,
   style, SVG path data and the hundred item question bank, none of which a
   person reads. The pages are opened in a real browser at 1600 and the words
   are taken off innerText, which is what the eye gets.

   FIVE SURFACES, NOT FOUR PAGES. The quiz has state, so it is counted twice:
   as it opens, and on the reading it lands. A surface a person spends time on
   is a surface that carries words.

   NO COUNT IS TYPED INTO THIS FILE. The pages come off the directory. Read
   every figure off the run.

       NODE_PATH=$(npm root -g) node funnel/words.js
       NODE_PATH=$(npm root -g) node funnel/words.js --json out.json
       NODE_PATH=$(npm root -g) node funnel/words.js --against out.json
   ============================================================ */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');

const DIR = path.resolve(__dirname);
const PAGES = fs.readdirSync(DIR).filter(f => /\.html$/.test(f)).sort();
const words = t => (t || '').trim().split(/\s+/).filter(Boolean).length;

const argOf = f => { const i = process.argv.indexOf(f); return i < 0 ? null : process.argv[i + 1]; };

(async () => {
  const browser = await chromium.launch(
    { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const out = {};

  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(DIR, p), { waitUntil: 'load' });
    await page.waitForTimeout(120);
    out[p] = words(await page.evaluate(() => document.body.innerText));

    /* the quiz again, on the reading, because that is a surface and not a
       state of this one. The sweep length comes off the page. */
    if (p === 'quiz.html') {
      const laws = await page.evaluate(() => SINAMES.length);
      const scale = await page.evaluate(() => QSCALE.length);
      await page.click('#go');
      out['quiz.html (asking)'] = words(await page.evaluate(() => document.body.innerText));
      for (let i = 0; i < laws; i++) await page.locator('.opt').nth((i * 3) % scale).click();
      await page.locator('#stop').click();
      out['quiz.html (reading)'] = words(await page.evaluate(() => document.body.innerText));
    }
    await ctx.close();
  }
  await browser.close();

  const keys = Object.keys(out).sort();
  const total = keys.reduce((a, k) => a + out[k], 0);
  const prevF = argOf('--against');
  const prev = prevF && fs.existsSync(prevF) ? JSON.parse(fs.readFileSync(prevF, 'utf8')) : null;

  console.log('\n=== funnel words, visible text at 1600 ===');
  for (const k of keys) {
    let line = '  ' + k.padEnd(22) + String(out[k]).padStart(6);
    if (prev && typeof prev[k] === 'number') {
      const d = out[k] - prev[k];
      line += '   was ' + String(prev[k]).padStart(5)
        + '   ' + (d > 0 ? '+' : '') + d;
    }
    console.log(line);
  }
  console.log('  ' + '-'.repeat(46));
  let t = '  ' + 'total'.padEnd(22) + String(total).padStart(6);
  if (prev) {
    const pt = keys.reduce((a, k) => a + (prev[k] || 0), 0);
    t += '   was ' + String(pt).padStart(5) + '   ' + (total - pt > 0 ? '+' : '') + (total - pt);
  }
  console.log(t + '\n');

  const jf = argOf('--json');
  if (jf) { fs.writeFileSync(jf, JSON.stringify(out, null, 1)); console.log('  written to ' + jf + '\n'); }
})();
