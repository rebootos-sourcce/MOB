'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { guardBrowser } = require('./net.js');

const app = pathToFileURL(path.resolve(process.env.ATUNED_FILE || 'source.html'));
app.search = '?dev=1';
const checking = 'If I don’t check every detail myself, the whole thing falls apart.';
const reflection = 'You’re saying that if you don’t check every detail yourself, the whole thing falls apart.';

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  guardBrowser(browser);
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await page.addInitScript(() => {
      class Recognition {
        constructor() { window.testRecognition = this; }
        start() { this.results = []; this.active = true; }
        stop() {
          this.active = false;
          setTimeout(() => this.onend?.(), 0);
        }
        abort() { this.stop(); }
        say(text) {
          this.results.push({ 0: { transcript: text }, length: 1, isFinal: true });
          this.onresult({ resultIndex: this.results.length - 1, results: this.results });
        }
      }
      window.SpeechRecognition = window.webkitSpeechRecognition = Recognition;
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const voice = [];
    page.on('request', request => {
      if (request.method() === 'POST' && request.url().endsWith('/v1/voice/synthesize')) {
        voice.push(request.postDataJSON().text);
      }
    });
    await page.goto(app.href);
    await page.waitForFunction(() => document.body.classList.contains('booted'));
    await page.evaluate(() => {
      if (OB.open) obClose();
      loadP(0);
      setTab(TAB.STORY);
      render();
      STV.dash = true;
      stRender();
      if (!STV.typed) stType();
    });
    await page.locator('#sttext').fill(checking);
    const typed = await page.evaluate(() => {
      const start = performance.now();
      stType();
      return { reply: SRC_SHOWN, ms: performance.now() - start };
    });
    assert.equal(typed.reply, reflection);
    assert.equal(await page.evaluate(() => SRC_LOG.length), 0);
    console.log('Typed reflection and pause passed, ' + typed.ms.toFixed(1) + ' ms to render');

    const notes = await page.evaluate(() => {
      const text = 'I am angry.';
      const parsed = parseStory(text);
      const addr = parsed.imprints.find(im => !im.inferred && im.node != null).node;
      const entry = { t: '2026-10-01T12:00:00.000Z', text, imprints: parsed.imprints.length,
        bands: parsed.bands, lex: LEX_VERSION, ob: { yes: [addr], no: [] } };
      CURP.story.entries.push(entry);
      const off = srcConfirmedStoryAddresses(text, CURP);
      const on = srcConfirmedStoryAddresses(text, CURP, { allowProfile: true });
      const rejected = srcConfirmedStoryAddresses(text, CURP, { allowProfile: true,
        verdicts: [{ seat: 'solar', v: 'no' }] });
      stType();
      return { addr, off, on, rejected };
    });
    assert.deepEqual(notes.off, []);
    assert.deepEqual(notes.on, [notes.addr]);
    assert.deepEqual(notes.rejected, []);
    const history = page.locator('#srchistory');
    await history.check();
    await page.evaluate(() => stType());
    await page.evaluate(() => stMic());
    await page.waitForFunction(() => window.testRecognition?.active && !ST_HUSH && SRC_VOICE.endAt > 0);
    const voiceStart = Date.now();
    const landed = await page.evaluate(() => {
      testRecognition.say('I am afraid. I am angry.');
      return { text: ST_TEXT, reply: SRC_SHOWN, optedIn: SRC_HISTORY_PROFILE === CURP,
        read: !!SRC_HISTORY_READ, hushed: ST_HUSH, rows: SRC_CHAT.length };
    });
    assert.match(landed.reply, /confirmed in an earlier entry/, JSON.stringify(landed));
    await page.waitForFunction(() => SRC_VOICE.said.includes('confirmed in an earlier entry') && !ST_HUSH);
    assert.ok(voice.some(line => line.includes('confirmed in an earlier entry')), JSON.stringify(voice));
    console.log('Opted-in graph lookup and voice reply passed, ' + (Date.now() - voiceStart) + ' ms through test speech');

    const result = await page.evaluate(() => {
      stType();
      const root = document.querySelector('[data-srcv="no"][data-seat="root"]');
      if (!root) throw Error('No Root correction control');
      root.click();
      const before = S.charge.Fear || 0;
      const angerBefore = S.charge.Anger || 0;
      const preview = stRelModel().take.map(node => node.b);
      document.getElementById('stapply').click();
      const last = CURP.story.entries.at(-1);
      const after = S.charge.Fear || 0;
      const angerAfter = S.charge.Anger || 0;
      const graph = traceFromRecord(CURP);
      const key = 'story:' + last.t;
      const report = graph.edges.filter(e => e.from === key && e.edge === 'supports')
        .map(e => graph.nodes.find(n => n.type + ':' + n.id === e.to).seat);
      const offer = stRelModel();
      const persisted = JSON.parse(JSON.stringify(CURP));
      const loaded = validateProfile(persisted);
      if (!loaded.ok) throw Error(loaded.errs.join('; '));
      const reloaded = parseStoryEntry(loaded.profile.story.entries.at(-1)).imprints.map(i => i.band);
      const run = document.getElementById('strun');
      if (!run || run.disabled) throw Error('Release is unavailable after Commit');
      run.click();
      return { last, before, after, angerBefore, angerAfter, preview, report, reloaded,
        release: offer.take.map(node => node.b), fromLast: offer.fromLast,
        runStory: RUN.storyT, runPlaces: RUN.pick.map(node => node.b) };
    });
    assert.match(result.last.text, /I am afraid\. I am angry\./);
    assert.deepEqual(result.last.verdicts, [{ seat: 'root', v: 'no' }]);
    assert.equal(result.before, result.after);
    assert.ok(result.angerAfter > result.angerBefore);
    for (const bands of [result.preview, result.report, result.reloaded, result.release, result.runPlaces]) {
      assert.ok(bands.length > 0);
      assert.ok(bands.every(band => band === 'Solar'), JSON.stringify(bands));
    }
    assert.ok(result.fromLast);
    assert.equal(result.runStory, result.last.t);

    await page.reload();
    await page.waitForFunction(() => document.body.classList.contains('booted'));
    const restored = await page.evaluate(() => {
      if (OB.open) obClose();
      loadP(0);
      const last = CURP.story.entries.at(-1);
      return { text: last?.text, verdicts: last?.verdicts, fear: S.charge.Fear || 0,
        anger: S.charge.Anger || 0, optedIn: SRC_HISTORY_PROFILE === CURP };
    });
    assert.equal(restored.text, result.last.text);
    assert.deepEqual(restored.verdicts, result.last.verdicts);
    assert.equal(restored.fear, result.after);
    assert.equal(restored.anger, result.angerAfter);
    assert.equal(restored.optedIn, false);
    assert.deepEqual(errors, []);
    console.log('Correction, Commit, graph replay, browser reload, and Release handoff passed');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
