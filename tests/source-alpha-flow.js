'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { guardBrowser } = require('./net.js');

let passed = 0;
function verify(method, ...args) {
  assert[method](...args);
  passed++;
}

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
    verify('equal', typed.reply, reflection);
    verify('equal', await page.evaluate(() => SRC_LOG.length), 0);
    console.log('Typed reflection and pause passed, ' + typed.ms.toFixed(1) + ' ms to render');

    const notes = await page.evaluate(() => {
      const text = 'I am angry.';
      const parsed = parseStory(text);
      const addr = parsed.imprints.find(im => !im.inferred && im.node != null).node;
      const entry = { t: '2026-10-01T12:00:00.000Z', text, imprints: parsed.imprints.length,
        bands: parsed.bands, lex: LEX_VERSION, ob: { yes: [addr], no: [] } };
      CURP.story.entries.push(entry);
      const off = srcConfirmedStoryAddresses(text, CURP);
      const older = 'I keep checking their work because I think I will be blamed.';
      const example = { story: { entries: [{ text: older }] } };
      const historyOff = srcCheckingHistory(ST_TEXT, example, false);
      const historyOn = srcCheckingHistory(ST_TEXT, example, true);
      example.story.entries[0].verdicts = [{ seat: 'sacral', v: 'no' }];
      const historyDeclined = srcCheckingHistory(ST_TEXT, example, true);
      const story = { text: 'I am afraid. I am angry.', verdicts: [{ seat: 'root', v: 'no' }] };
      const root = parseStory('I am afraid.').imprints.find(im => im.node != null).node;
      const allowedPick = srcStoryReleaseIntegrity(story, [addr]);
      const blockedPick = srcStoryReleaseIntegrity(story, [addr, root]);
      const on = srcConfirmedStoryAddresses(text, CURP, { allowProfile: true });
      const rejected = srcConfirmedStoryAddresses(text, CURP, { allowProfile: true,
        verdicts: [{ seat: 'solar', v: 'no' }] });
      stType();
      return { addr, off, on, rejected, historyOff, historyOn, historyDeclined, allowedPick, blockedPick };
    });
    verify('deepEqual', notes.off, []);
    verify('deepEqual', notes.on, [notes.addr]);
    verify('deepEqual', notes.rejected, []);
    verify('equal', notes.historyOff, false);
    verify('equal', notes.historyOn, true);
    verify('equal', notes.historyDeclined, false);
    verify('equal', notes.allowedPick.ok, true);
    verify('deepEqual', notes.blockedPick, { ok: false, blocked: ['truth'] });
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
    verify('match', landed.reply, /confirmed in an earlier entry/, JSON.stringify(landed));
    await page.waitForFunction(() => SRC_VOICE.said.includes('confirmed in an earlier entry') && !ST_HUSH);
    verify('ok', voice.some(line => line.includes('confirmed in an earlier entry')), JSON.stringify(voice));
    console.log('Opted-in graph lookup and voice reply passed, ' + (Date.now() - voiceStart) + ' ms through test speech');

    const revoke = await page.evaluate(async () => {
      stType();
      const grant = SRC_HISTORY_GRANT;
      const reply = SRC_CHAT.filter(row => row.w === 'src').at(-1);
      const line = reply.q;
      const original = authVoice;
      let pending, requests = 0;
      try {
        authVoice = () => { requests++; return new Promise(resolve => { pending = resolve; }); };
        const played = new Promise(resolve => stSrcSpeak(line, { historyGrant: grant, onEnd: resolve }));
        document.getElementById('srchistory').click();
        pending({ ok: true, blob: new Blob(['test audio']) });
        const oldPlayed = await played;
        const histories = SRC_CHAT.filter(row => row.historyGrant || (row.q || '').includes('confirmed in an earlier entry'));
        const caption = document.getElementById('srcsay').textContent;
        const oldRead = srcHistoryEntries().length;
        document.getElementById('srchistory').click();
        const retryPlayed = await new Promise(resolve => stSrcSpeak(line, { historyGrant: grant, onEnd: resolve }));
        return { oldPlayed, retryPlayed, requests, caption, rows: histories.length, oldRead,
          sameGrant: grant === SRC_HISTORY_GRANT };
      } finally { authVoice = original; }
    });
    verify('equal', revoke.oldPlayed, false);
    verify('equal', revoke.retryPlayed, false);
    verify('equal', revoke.requests, 1);
    verify('equal', revoke.rows, 0);
    verify('equal', revoke.oldRead, 0);
    verify('equal', revoke.sameGrant, false);
    verify('ok', !revoke.caption.includes('confirmed in an earlier entry'));

    await page.locator('[data-srcv="fix"][data-seat="root"]').click();
    await page.locator('#srcvfix').fill('I felt cornered and wanted a choice.');
    await page.locator('[data-srcvread="root"]').click();
    verify('deepEqual', await page.evaluate(() => CURP.story.draftVerdicts), [{ seat: 'root', v: 'fix' }]);
    await page.reload();
    await page.waitForFunction(() => document.body.classList.contains('booted'));
    await page.evaluate(() => {
      if (OB.open) obClose();
      loadP(0);
      setTab(TAB.STORY);
      STV.dash = true;
      stRender();
      if (!STV.typed) stType();
    });
    const draftAfterReload = await page.evaluate(() => ({
      words: ST_TEXT, verdicts: SRC_VERDICTS, root: srcLedgerNow().claims.root?.state,
      offered: stFound().map(node => node.b)
    }));
    verify('match', draftAfterReload.words, /I am afraid\. I am angry\./);
    verify('deepEqual', draftAfterReload.verdicts, [{ seat: 'root', v: 'fix' }]);
    verify('equal', draftAfterReload.root, 'corrected');
    verify('ok', draftAfterReload.offered.length > 0 && draftAfterReload.offered.every(band => band === 'Solar'));
    await page.locator('#sttext').fill('I am afraid of a different situation.');
    verify('equal', await page.evaluate(() => SRC_VERDICTS.length), 0);
    verify('equal', await page.evaluate(() => CURP.story.draftVerdicts), undefined);
    await page.locator('#sttext').fill(draftAfterReload.words);

    const result = await page.evaluate(() => {
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
      /* Release is the Imprints page's own panel since 27 November
         (ec7a478e): stRelPanel empties #strel and never draws #strun
         unless S.tab is TAB.IMPRINTS, so Run release has to be read there,
         the same switch releasechain.js makes for the same reason. stOwn,
         which stImpsRender calls on the way in, only resets when the open
         profile changes, never on a tab switch alone, so the verdict and
         the draft this test just committed are untouched by it. */
      setTab(TAB.IMPRINTS);
      const run = document.getElementById('strun');
      if (!run || run.disabled) throw Error('Release is unavailable after Commit');
      run.click();
      return { last, before, after, angerBefore, angerAfter, preview, report, reloaded,
        release: offer.take.map(node => node.b), fromLast: offer.fromLast,
        runStory: RUN.storyT, runPlaces: RUN.pick.map(node => node.b), draftVerdicts: CURP.story.draftVerdicts };
    });
    verify('match', result.last.text, /I am afraid\. I am angry\./);
    verify('deepEqual', result.last.verdicts, [{ seat: 'root', v: 'no' }]);
    verify('equal', result.before, result.after);
    verify('ok', result.angerAfter > result.angerBefore);
    for (const bands of [result.preview, result.report, result.reloaded, result.release, result.runPlaces]) {
      verify('ok', bands.length > 0);
      verify('ok', bands.every(band => band === 'Solar'), JSON.stringify(bands));
    }
    verify('ok', result.fromLast);
    verify('equal', result.runStory, result.last.t);
    verify('equal', result.draftVerdicts, undefined);

    await page.reload();
    await page.waitForFunction(() => document.body.classList.contains('booted'));
    const restored = await page.evaluate(() => {
      if (OB.open) obClose();
      loadP(0);
      const last = CURP.story.entries.at(-1);
      return { text: last?.text, verdicts: last?.verdicts, fear: S.charge.Fear || 0,
        anger: S.charge.Anger || 0, optedIn: SRC_HISTORY_PROFILE === CURP };
    });
    verify('equal', restored.text, result.last.text);
    verify('deepEqual', restored.verdicts, result.last.verdicts);
    verify('equal', restored.fear, result.after);
    verify('equal', restored.anger, result.angerAfter);
    verify('equal', restored.optedIn, false);
    verify('deepEqual', errors, []);
    console.log('Correction, Commit, graph replay, browser reload, and Release handoff passed');
    await page.evaluate(() => {
      const prior = 'I keep checking their work because I think I will be blamed.';
      const p = parseStory(prior);
      CURP.story.entries.push({ t: '2026-10-02T12:00:00.000Z', text: prior,
        imprints: p.imprints.length, bands: p.bands, lex: LEX_VERSION });
      setTab(TAB.STORY);
      STV.dash = true;
      stRender();
      if (!STV.typed) stType();
    });
    await page.locator('#sttext').fill(checking);
    await page.locator('#srchistory').check();
    await page.evaluate(() => {
      stType();
      document.getElementById('stapply').click();
      /* "That fits. Draft a reframe" is stRelPanel's own button, painted
         into #strel, which has been the Imprints page's panel and nobody
         else's since 27 November (ec7a478e); see the Release switch above. */
      setTab(TAB.IMPRINTS);
    });

    const draft = 'I know I can choose when to check every detail myself.';
    const eligibility = await page.evaluate(() => {
      const current = CURP.story.entries.at(-1);
      const earlier = CURP.story.entries.at(-2);
      return {
        withConsent: srcCheckingReframe(CURP, current.t, true),
        withoutConsent: srcCheckingReframe(CURP, current.t, false),
        oneStory: srcCheckingReframe({ story: { entries: [current] } }, current.t, true),
        declined: srcCheckingReframe({ story: { entries: [
          earlier, { ...current, verdicts: [{ seat: 'root', v: 'fix' }] }
        ] } }, current.t, true)
      };
    });
    verify('deepEqual', eligibility, { withConsent: draft, withoutConsent: null, oneStory: null, declined: null });
    const keptBefore = await page.evaluate(() => affKept());
    verify('equal', await page.locator('#afft').count(), 0);
    await page.getByRole('button', { name: 'That fits. Draft a reframe' }).click();
    verify('equal', await page.locator('#afft').inputValue(), draft);
    verify('equal', await page.locator('#affrows li').count(), 0);
    verify('equal', await page.locator('#affadd').isDisabled(), true);

    await page.locator('#afft').fill('I know I can choose when to ask for a second pair of eyes.');
    await page.locator('#affgo').click();
    verify('equal', await page.locator('#affrows li').count(), 7);
    verify('match', await page.locator('#affrows').textContent(), /ask for a second pair of eyes/);
    verify('deepEqual', await page.evaluate(() => affKept()), keptBefore);
    await page.evaluate(() => {
      srcChangeHistory(null);
      srcChangeHistory(CURP);
      document.getElementById('affadd').click();
    });
    verify('deepEqual', await page.evaluate(() => affKept()), keptBefore);
    verify('match', await page.locator('#affst').textContent(), /history permission changed/);
    verify('equal', await page.locator('#affadd').isDisabled(), true);
    await page.locator('#affx').click();
    await page.getByRole('button', { name: 'That fits. Draft a reframe' }).click();
    await page.locator('#afft').fill('I know I can choose when to ask for a second pair of eyes.');
    await page.locator('#affgo').click();
    await page.locator('#affadd').click();
    const savedReframe = await page.evaluate(() => affKept());
    verify('equal', savedReframe?.rows.length, 7);
    verify('ok', savedReframe?.rows.every(row => row.core.includes('ask for a second pair of eyes')));
    verify('deepEqual', errors, []);
    console.log('Confirmed pattern opens an editable reframe and leaves saving to the person');
    console.log('===== ' + passed + ' passed, 0 failed =====');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
