/* ============================================================
   THE GATES NEVER ASK THE REAL WORKER FOR A VOICE LINE.

   The voice needs no sign in (the owner, 9 October), so any gate that
   runs a release with the voice on, which is the default, sends each
   line to the Worker named in AUTH_API. On a GitHub runner that is the
   live server: the request fails the browser's own CORS check from a
   file address, which tests/functional.js counts as a real JS error,
   and when the ElevenLabs key is set it would spend the owner's money
   and eat the real people's daily ceiling. journey2 met the same
   hazard for the first visit and cut the host.

   guardBrowser(browser) wraps newPage and newContext so every page a
   gate opens answers the voice route itself, with a short silent
   sound, and the real host is never reached. A page that stubs the
   route for itself (tests/voice.js, the voice section of
   tests/functional.js) registers later, and Playwright takes the
   latest registered route first, so its own answer wins.

   Only the voice route is answered. Nothing else is touched here.
   ============================================================ */
const WAV = (() => {
  const rate = 8000, n = 240, b = Buffer.alloc(44 + n, 128);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34); b.write('data', 36); b.writeUInt32LE(n, 40);
  return b;
})();
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'POST, OPTIONS' };
const ROUTE = /\.workers\.dev\/v1\/voice\/synthesize/;
function answer(route) {
  if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
  return route.fulfill({ status: 200, headers: Object.assign({ 'content-type': 'audio/wav' }, CORS), body: WAV });
}
function guardBrowser(browser) {
  const newPage = browser.newPage.bind(browser), newContext = browser.newContext.bind(browser);
  browser.newPage = async function () { const p = await newPage.apply(null, arguments); await p.route(ROUTE, answer); return p; };
  browser.newContext = async function () { const c = await newContext.apply(null, arguments); await c.route(ROUTE, answer); return c; };
  return browser;
}
module.exports = { guardBrowser, WAV };
