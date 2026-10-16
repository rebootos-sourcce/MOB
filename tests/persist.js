/* ============================================================
   A WRITE THAT HAS LEFT THE PAGE. Required by the gates that reload.

   16 October. A page reads its store back from its own copy, so a value can
   read as kept inside the page and still not have reached the browser when a
   reload comes. Measured on four cores under four busy loops, with the six
   masks and practitioner groups of tests/functional.js run twenty four times:
   a write took longer than 5 s to leave the page in two runs, and in one of
   them it never arrived, so the reload came back with nothing stored and a
   check about the product went red for a reason that was the browser's. The
   same shape read the practitioner switch off after a reload on CI (run
   38886546412) and the overlay presses as the defaults (run 38873611132).

   persisted(page, fn, arg, ms) opens a second, blank page in the same
   context, which shares the store and has no copy of its own, and waits up to
   ms (20 s) for fn(arg) to be true there. It answers true or false and never
   throws; the caller says what was not kept, by name.

   The page's context must be one it can open a second page in: a page made
   by browser.newPage() refuses, so those gates make a context first.
   ============================================================ */
const path = require('path'), fs = require('fs'), os = require('os');
let BLANK = null;
function blank() {
  if (!BLANK) {
    const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'persist-')), 'blank.html');
    fs.writeFileSync(f, '<!doctype html><title>store</title>');
    BLANK = 'file://' + f;
  }
  return BLANK;
}
async function persisted(page, fn, arg, ms) {
  const q = await page.context().newPage();
  try {
    await q.goto(blank());
    await q.waitForFunction(fn, arg === undefined ? null : arg, { timeout: ms || 20000 });
    return true;
  } catch (e) { return false; } finally { await q.close().catch(() => {}); }
}
module.exports = { persisted };
