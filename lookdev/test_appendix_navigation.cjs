/* Targeted P0 appendix runtime acceptance. Runs only in an isolated CI checkout. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const root = process.cwd();
  const fileUrl = 'file://' + path.resolve(root, 'index.html');
  const outDir = path.join(root, 'lookdev-ci-artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { source: 'index.html', sourceCommit: process.env.GITHUB_SHA || 'local', viewports: [], requests: [], errors: [], warnings: [] };
  try {
    for (const viewport of [{ width: 1600, height: 1000 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('request', req => report.requests.push({ viewport: viewport.width, url: req.url(), method: req.method() }));
      page.on('requestfailed', req => report.errors.push({ viewport: viewport.width, type: 'requestfailed', url: req.url(), detail: req.failure()?.errorText || '' }));
      page.on('pageerror', e => report.errors.push({ viewport: viewport.width, type: 'pageerror', message: e.message }));
      page.on('console', msg => {
        if (msg.type() === 'error') report.errors.push({ viewport: viewport.width, type: 'console', message: msg.text() });
        if (msg.type() === 'warning') report.warnings.push({ viewport: viewport.width, message: msg.text() });
      });
      await page.goto(fileUrl + '#appendix-f', { waitUntil: 'load' });
      await page.waitForTimeout(400);
      const direct = await page.evaluate(() => {
        const el = document.getElementById('appendix-f');
        return {
          hash: location.hash,
          matches: document.querySelectorAll('#appendix-f').length,
          targetVisible: !!el && el.getBoundingClientRect().height > 0,
          top: el ? Math.round(el.getBoundingClientRect().top) : null,
          viewportWidth: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
        };
      });
      assert.equal(direct.hash, '#appendix-f', 'direct fragment navigation preserves requested destination');
      assert.equal(direct.matches, 1, 'Appendix F is unique in runtime DOM');
      assert.equal(direct.targetVisible, true, 'Appendix F is rendered');
      await page.screenshot({ path: path.join(outDir, 'appendix-f-' + viewport.width + '.png'), fullPage: false });

      if (viewport.width === 1600) {
        const navGroup = page.locator('nav .nav-group[data-group="5"]');
        const toggle = navGroup.locator('button.nav-mv-toggle');
        const beforeKeyboard = await toggle.getAttribute('aria-expanded');
        await toggle.focus();
        await page.keyboard.press('Enter');
        const afterEnter = await toggle.getAttribute('aria-expanded');
        report.diagnostics ||= [];
        report.diagnostics.push({
          viewport: viewport.width,
          phase: 'appendix-toggle-enter',
          beforeKeyboard,
          afterEnter,
          toggleCount: await navGroup.locator('button.nav-mv-toggle').count(),
          tagName: await toggle.evaluate(el => el.tagName),
          disabled: await toggle.isDisabled(),
          visible: await toggle.isVisible(),
          focusedAfterActivation: await toggle.evaluate(el => el === document.activeElement),
          ariaControls: await toggle.getAttribute('aria-controls'),
          groupExpanded: await navGroup.getAttribute('aria-expanded'),
          groupClass: await navGroup.getAttribute('class'),
          childLinks: await navGroup.locator('a[data-target]').count(),
          childLinksVisible: await navGroup.locator('a[data-target]').evaluateAll(els => els.map(el => ({ target: el.getAttribute('data-target'), hidden: el.hidden, display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility })))
        });
        assert.notEqual(afterEnter, beforeKeyboard, 'Enter toggles appendix side-nav group');
        await page.keyboard.press('Space');
        const afterSpace = await toggle.getAttribute('aria-expanded');
        assert.notEqual(afterSpace, afterEnter, 'Space toggles appendix side-nav group');
        if (afterSpace !== 'true') {
          await page.keyboard.press('Enter');
          assert.equal(await toggle.getAttribute('aria-expanded'), 'true', 'appendix side-nav can be reopened by keyboard');
        }
        const sideLink = navGroup.locator('a[data-target="appendix-f"]');
        await sideLink.click();
        await page.waitForTimeout(800);
        const active = await sideLink.evaluate(el => el.classList.contains('act'));
        const clicked = await page.evaluate(() => {
          const el = document.getElementById('appendix-f');
          return { scrollY: Math.round(scrollY), offsetTop: Math.round(el.getBoundingClientRect().top) };
        });
        assert.equal(active, true, 'scroll-spy applies active state to matching data-target side-nav item');
        assert.ok(Math.abs(clicked.offsetTop) < 160, 'side-nav click scrolls to Appendix F');
        await sideLink.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(700);
        const keyboard = await page.evaluate(() => Math.round(document.getElementById('appendix-f').getBoundingClientRect().top));
        assert.ok(Math.abs(keyboard) < 160, 'Enter activates focused Appendix F navigation item');
        report.viewports.push({ width: viewport.width, direct, clicked, active, keyboard });
      } else {
        const tocLink = page.locator('.toc-row[data-target="appendix-f"]');
        await tocLink.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(700);
        const navResult = await page.evaluate(() => {
          const el = document.getElementById('appendix-f');
          return { scrollY: Math.round(scrollY), targetTop: Math.round(el.getBoundingClientRect().top), tocLinkCount: document.querySelectorAll('.toc-row[data-target="appendix-f"]').length };
        });
        assert.equal(navResult.tocLinkCount, 1, 'contents has one Appendix F destination');
        assert.ok(Math.abs(navResult.targetTop) < 180, 'keyboard activation of mobile contents link reaches Appendix F');
        report.viewports.push({ width: viewport.width, direct, keyboard: navResult, documentOverflowPx: direct.documentWidth - direct.viewportWidth });
      }
      await context.close();
    }
    const external = report.requests.filter(r => !r.url.startsWith('file:') && !r.url.startsWith('data:') && !r.url.startsWith('blob:'));
    assert.equal(external.length, 0, 'standalone source makes no network requests');
    assert.equal(report.errors.length, 0, 'no console errors, page errors, or failed requests');
    fs.writeFileSync(path.join(outDir, 'appendix-runtime-report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ result: 'PASS', sourceCommit: report.sourceCommit, viewports: report.viewports, externalRequests: external.length, errors: report.errors.length, warnings: report.warnings.length, artifacts: outDir }, null, 2));
  } catch (e) {
    fs.writeFileSync(path.join(outDir, 'appendix-runtime-report.json'), JSON.stringify(report, null, 2) + '\n');
    console.error(JSON.stringify({ result: 'FAIL', report, error: e.stack || String(e) }, null, 2));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
