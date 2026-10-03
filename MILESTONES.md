# Milestones

Five disciplines scrubbed the backlog, four passes each. Every claim below that
carries a number was verified here rather than relayed, and where a scrub was
wrong that is recorded too.

A milestone is a state worth stopping at, named by what becomes true.

**Status, 27 September.** This page was written 21 September and is kept as
the plan it was. It is not the current open list: `BACKLOG-AUDIT.md` (27
September) is. Read against the code at `e0b14a2`:

- **Most of M0's floor has shipped.** Validation is atomic at the boundary
  (`validateProfile` and `pImport`, `engine/schema.js`), and the build id is
  stamped as `data-build` and printed by the boot guard
  (`shell/guard.html`). The guard's error listener covers only a failure
  before boot (`if(BOOTED)return;`), so an error after boot still has no
  surface of its own. Save reporting on the story, ritual and release paths
  was not re-checked for this note.
- **M3 has shipped.** Undo is unlimited with a redo stack (`engine/undo.js`),
  and a story commit pushes an undo step before the charge lands.
- **The fork at the end of this page has been called**, for accounts. That
  section is corrected below.

---

## Fixed during the scrub, already shipped

Three defects, two of them mine, found and closed before this document existed.

**The save status lied.** I made `pPersist` report failures two commits ago.
That fixed the write and missed the bind: `ui.js` binds the store in a
try/catch, so blocked storage left the no-op bound, whose `set()` never throws.
The app said "Saved." with nothing written. A store must now be bound before a
save can be claimed.

**The analytics drill was invisible.** When the rail became foldable, `rdOpen`
learned to unfold its section and `anaDrill` did not. Clicking a bubble wrote
431 characters into a collapsed section. This answers A9: not shallow, not
undiscoverable, it simply never appeared.

**Address rows inside a drill went nowhere.** `runNodeDrill` already existed and
was already wired from the wheel. The rows are buttons now.

---

## The finding that outranks the backlog

**The instrument is below the fold on every screen under 1180px.**

    width    stage top    visible at first paint
     390      1,793px      no
     720      2,293px      no
    1180      2,547px      no
    1600        163px      yes

`.mid` collapses to one column at 1180 and the rails come first in DOM order.
On any laptop narrower than 1600 a person meets an icon grid and must scroll
past 2,500 pixels to reach the wheel, and all five tabs look identical until
they do.

This is not on the backlog at all. It undercuts every milestone below, because
none of them matter if the thing the product is never loads into view. It is
pure layout, depends on no other decision, and should start immediately.

---

## M0. Nothing a person can reach can break it

`A4` reframed, `A6` rescoped, plus the atomicity finding.

The TD found A4 overstated: `pImport` is not called anywhere in the UI, so
there is no import control and no reachable crash today. (True when written.
Since `a54a16b`, 20 September, the profile sheet carries an import control,
`recordImportWire` in `ui/panels.js`, so the boundary is reachable now. The
renamed law case is handled by `LAW_WAS` in `engine/schema.js`, `6a89e80`.
Checked at `18238fe`.) But QA found something
worse underneath. `pImport` on a malformed profile throws inside `loadProfile`,
is caught, returns null, and **the field has already been overwritten by
`buildSoul()` before the throw.** A caller trusting the null believes nothing
happened. The reading already changed.

So the task is not "validate the import control". It is: validation must be
atomic, and it belongs with the claim flow in M5, because the network pull is
the real new boundary.

`A6` is mis-sized. As filed it runs BUILD plus four gates. It must also run
`simulate-path.js` and `equiv.py`, and neither of the two defects QA
demonstrated would be caught by the four gates as they stand.

**Also in M0, all newly found:** a build id stamped into the footer, because
support cannot ask what version someone is on when the file says nothing; a
`window.onerror` surface so a caught error renders something screenshot-able
instead of a frozen tab; and `statusSaved()` called from the story, ritual and
release paths, not only intake.

*Decide: nothing. This is the floor.*

## M1. The reading earns being believed

`A1` + `A3` + `A8`, and A1 moves up from third.

A1 is not a UX nicety scheduled after the layout work. It is the asset the
funnel needs, so building it here means building it once. Measured: 0 laws
answered reads 20.8 percent plus or minus 19.3, all 21 reads 48.8 plus or minus
12.1, so an unanswered profile can legitimately move 39 points later.

*Decide before it starts: hard gate or strong default. It blocks the work.*

## M2. A first session ends in a change, not a tour

`A2` + `A7`, with A9 and A11 now answered rather than blocked.

**A11 is answered: it is the labels, not the panel.** Loaded at the heaviest
persona, the right rail stays clean at every density. The wheel's inner
flatplate labels land inside the thread tangle precisely for the highest load
profiles, the people who most need a legible reading.

Design work the art direction scrub found missing and this milestone needs
first: one visualisation grammar across the wheel, the body figure and the
bubbles. They currently encode magnitude three different ways, by radius, by
dot presence, and by area, so no intuition carries between tabs. And the
truncated bubble labels are a shipping defect independent of any question.

*Decide: tutorial copy before code.*

## M3. A mistake is not permanent

`A5`, with QA's precondition attached: `storyui.js` has zero automated
coverage, and it is the file undo has to rewrite. Lock current behaviour in a
test first, per this project's own rule about reproducing before fixing.

## M4. The product looks like one thing

Entirely missing from the backlog until the art direction scrub. Measured: 25
distinct font sizes across 153 uses with no scale, 9 transition durations with
one easing curve, and **zero brand mark and zero favicon**. The wordmark is
text in Lexend 700 and that is the whole visual identity.

The funnel has nothing to open its page on. This blocks M5 rather than
following it.

## M5. A stranger can get their number without installing anything

`B1` + `B2` + the one time code + the legal hour.

Two corrections to my own sizing. The TD is right that B1 cannot start without
a `BUILD-quiz.sh` and its own manifest, which do not exist. And "not a backend
for the app" is true of the app and false of the service: once the one time
code exists it needs transactional email with real deliverability, the write
path needs rate limiting, records need a retention policy, and there must be a
delete path. Those four are one cost, not an afterthought to a small item.

The product lead found the gap that decides whether any of it converts:
**nothing specifies what the web page shows when the quiz completes, before the
install.** Two walls stacked with no payoff between them only converts people
who already trust the brand, which is not cold traffic.

*Decide: what the page shows at completion. And keep the record store narrow.
The moment it grows a session or an auth concept, the fork below is called by
accident.*

## M6. The quiz becomes the app

`B3` + `B4`, plus claim conflict resolution, which is missing everywhere.
Nothing says what a second claim does when a local profile already holds
answers. Silent overwrite is the default and it is the wrong one.

Also: a claimed profile has already answered 63 questions. It must skip M1's
gate and say so.

---

## Day two, and the thing nobody wrote down

`snapshot()` and `history[]` already exist in the schema and **nothing in the
backlog reads them.** `p.updated` and `p.created` are stamped on every save and
never read either. A visible delta between this session and the last one is
buildable with zero new architecture.

The loop the product claims to deliver used to be open at both ends, and this
paragraph said so for longer than it was true. **Corrected 21 September.**
`CURP.rituals` now has five readers, counted off `grep -rn '\.rituals'
atuned_src/` rather than off another document: `ritLast()` at
`ui/ritual.js:36`, which `ritToday()` reads back onto the surface, `pracDays()`
at `engine/ladder.js:32`, which is how `streakRead` gets the run, `ledgerRead()`
at `engine/ladder.js:84`, `ladderHtml()` at `ui/cone.js:955`, which prints the
count, and `validateProfile` in `engine/schema.js`, which refuses the field by
name if it is not a list. `RL1f` and `RL2f` in `TASKS.md` are the two items
that closed it, both verified against the shipped build.

What is still open is not the reading. It is that the record is a card under a
builder rather than a surface, which is `RB7v`, and that the three practice
marks count strictly consecutive days, so a person practising twice a week
earns none of them, which is `LD3` and is the one ruling this milestone waits
on.

That belongs in M2. It is the practice loop, and it now closes at one end.

---

## The fork, called: accounts

**This section used to be headed "The fork, still yours". It is not his to
call any more; he called it.** `CLAUDE.md`, "What this project is becoming":
"The fork is called. This becomes an accounts product. Ruled by the owner."
Branch B below is the branch taken. Branch A is kept as the record of what was
weighed.

Branch A, not taken: the funnel stays a 0.5 KB keyed record, the app stays a
single file, no accounts. Roughly what is priced above.

Branch B, taken: the accounts product from part one of the recording. Portal,
mobile client, shared database, payment. Not in this backlog at any size when
this page was written, an order of magnitude larger than everything here
combined, and the branch where streaks and pings become buildable.

What the ruling does not change, per `CLAUDE.md`: `source.html` stays one file
with no dependencies and gains network at exactly one seam, fetching a record
at sign in; the engine stays host free; a practitioner's sight needs explicit
consent, a visible list and revocation.

Where it stands on 27 September, read off `TASKS.md` and the code rather than
off this page:

- **Sign in does not exist.** `ui/account.js:125` says so on the page: "Sign
  in does not exist yet. This record is in this browser and nowhere else"
  (round HI, read at `e0b14a2`).
- **The paywall is built and gated but not connected to money.**
  `engine/plan.js` carries the gift of 100 and the tiers; pressing an upgrade
  prints "Billing is not connected yet" (`ui/panels.js:921`,
  `BACKLOG-AUDIT.md` section 2.2).
- **He has asked for the login page wired in "without questions"** (round IA,
  27 September): "I need the login page, I need it wired in, without
  questions. It needs to be effective and clean, because the software needs to
  work, front to back." This moves sign in ahead of the 25 September ruling
  that sequenced accounts last (`DECISIONS.md`, "Don't wait on him").
- **What still gates a real sign in** is the server behind it: which database
  (Cloudflare or Supabase) and which product goes online first. Both are open
  and are items 2 and 3 of `BACKLOG-AUDIT.md` section 2.1. `SETUP-PLAN.md`
  (round HJ) is the staged plan and puts a paying person three to four weeks
  after those are answered. Safari erases a site's stored data after seven
  days unused unless it is on the home screen, so a record that lasts three
  hundred days depends on sign in and sync, not on local storage.

**M5's warning is spent.** It said to build the record store narrow so both
branches stayed open. The branch is chosen, so the seam is now designed for
accounts rather than kept narrow to avoid them.

And the thing that should not be decided by building it first: Alexander named
an attention capture app as the model for the hook. This repo's UX skill
commits to intrinsic motivation and no dark patterns. The fork went to
accounts, so those mechanics want designing from that floor, not from the
cited model. That still holds.
