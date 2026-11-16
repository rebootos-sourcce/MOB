/* ============================================================
   THROUGH THE INTRO, for the gates that walk the real door.

   Since 16 November a first arrival meets Source reading an example
   (ui/srcintro.js) between the door and the first card, and the first card
   opens only from its button, never on a timer. A gate that walks the door
   and then waits for OB.open would wait for ever. This walks it the way a
   person who has seen it does: Skip, which lands on the end frame, then
   "Write your own". It does not pre-mark the device as having seen it: the
   intro is part of the arrival these gates walk, so they walk it, and
   tests/srcintro.js holds what it shows.

   Waits up to `ms` for the intro to appear, so a call right after a press
   that is still answering (an account being made) does not read it as
   absent; answers false at once if nothing appears, which is a returning
   device, an onboarded record, or DEV_SKIP.
   ============================================================ */
async function throughIntro(page, ms) {
  const on = await page.waitForSelector('#srcintro .sx-skip', { timeout: ms === undefined ? 1500 : ms }).then(() => true, () => false);
  if (!on) return false;
  await page.click('#srcintro .sx-skip');
  await page.click('#srcintro .sx-own');
  await page.waitForFunction(() => typeof OB !== 'undefined' && OB.open, null, { timeout: 4000 }).catch(() => {});
  await page.waitForSelector('#srcintro', { state: 'detached', timeout: 4000 }).catch(() => {});
  return true;
}
module.exports = { throughIntro };
