# Backlog

One list. It merges the measured technical items from `STABILITY.md` with the
review session in `FEEDBACK-alexander.md`, so there is nothing to reconcile
between two competing documents. Nothing here is started. Sizes are honest
estimates against this codebase, not encouragement.

Every task names where it lives, because "improve the analytics" is not a task.

---

## A. Buildable now. One file, no architecture change.

**A1. Full intake before the first reading.** `ui/intakeui.js`, `engine/intake.js`
The intake is 63 questions and the app renders a full reading with zero of them
answered. Gate the first reading behind completing it, state the time cost up
front, and show the interval as the reason. Measured: 0 answered reads 20.8
percent plus or minus 19.3, all 21 laws reads 48.8 plus or minus 12.1, so an
unanswered profile can legitimately move 39 points later. This is the item with
evidence and the one Alexander argued hardest for.
*Medium. Needs a ruling on whether it is a hard gate or a strong default.*

**A2. Layer isolation on the Field wheel.** `ui/wheel.js`
The four depths are strictly cumulative: `L>=1`, `L>=2`, `L===3`. There is no
way to see the saboteurs alone. The Energy tab already solves this with
`PMLAYER` and a row of buttons, so the pattern exists and can be ported rather
than invented. This is Alexander's "it is a lot of stuff" and the 57 to 71
simultaneous choices finding, arriving from two directions.
*Medium. The clearest win for cognitive load.*

**A3. Percentage per category.** `ui/analytics.js`, `ui/ui.js`
Analytics shows weighted amounts. Show the share instead, or alongside: what
percentage of this person each archetype is, each of the four root domains,
each mask. `r.aff` is already a normalised 12 vector and the right rail already
prints first, second and third with percentages, so the data is there.
Archetypes first, per Alexander.
*Small.*

**A4. Schema validation at the boundary.** `engine/schema.js`
`loadProfile` throws on all four malformed profiles tested and accepts a charge
of 9999. `pImport` checks only that a version field exists. Reachable by a
person through the import control. The UI clamps, the boundary does not.
*Small. The only reachable crash in the product.*

**A5. Undo on applying a story.** `ui/storyui.js`, `engine/read.js`
Applying a story bakes charge into the axes with no way back. Snapshot before
apply, offer a revert window.
*Medium. Largest product gap, unrelated to this review.*

**A6. Continuous integration.** new `.github/workflows/`
522 assertions across four gates and nothing runs them automatically.
*Small. Cheapest item here and it protects everything else.*

**A7. A tutorial that completes one loop.** new `ui/tutorial.js`
Not a tour of the interface. Find a pattern, release it, watch it change.
Alexander was specific that the walkthrough has to reach the release.
*Large. Needs the copy written before the code.*

**A8. A somatic opener.** new, small
Turn the senses inward, feel yes and no, before anything else. Establishes what
the instrument is reading.
*Small. Copy first again.*

**A9. Analytics drill depth.** `ui/analytics.js`
Correction to my own note: the bubbles ARE already clickable. `[data-ab]` sets
`ANA_PICK` and calls `anaDrill()`. So the task is not "make it clickable", it
is either that the affordance is invisible or that the drill stops one level
too shallow. Needs him to look once and say which.
*Unknown until that question is answered.*

**A10. Google Fonts.** `shell/head.html`
Two outbound requests per load, sending an IP to Google before anything is
typed, in an app holding somatic self report. Self host or fall back to a
system stack.
*Small. His call, it costs bytes.*

**A11. Saboteur presentation.** `ui/wheel.js`, `ui/drills.js`
"Covering up too much, feels blocked in, not designed." Still needs one answer
from him: is it the panel, or the labels crowding the centre of the wheel.
*Blocked on that answer.*

**A12. The missing somatic practices.** `engine/data/practice.js`
Content, not code.
*Unsized. Depends how many are missing.*

---

## B. Needs an architecture this project does not have.

`CLAUDE.md` states no backend, no accounts, no network, no telemetry. Each of
these needs at least one. Part one of the recording is this conversation: its
audio confirmed web portal, mobile app, email address, log in, download, free
version, database, cloud, users, managers, results, take the test, paying,
desktop version.

- **B1.** Notification pings, a set number of patterns a day at a chosen time
- **B2.** Streaks
- **B3.** Community feed, or a curated community
- **B4.** Seeing other people's progress
- **B5.** Cloud stored results, manager reporting, admin portal
- **B6.** Mobile client sharing a login with a web portal
- **B7.** Paid desktop tier against a free pattern only tier
- **B8.** The free CQ quiz as a public funnel, collecting email

These are one decision, not eight. Taking any of them means becoming a
different kind of system, and the privacy posture is currently part of the
product given what this data is. Worth noting that B8 is the cheapest entry
point and the one that forces the rest.

---

## C. Already open, his call, unchanged by this review.

- Schema v2, the gates bump, cross compatibility contract with SOURCE
- `Root_08_Unnamed`, compressed CQ mid range, domain weighting, depth button
  names, the Matrix wiring
- Whether the kink sits at the highest charge or the lowest
- Compositing: Field measures about 100ms per frame from layer blending, not
  from our drawing. Needs one measurement on real hardware before anyone
  optimises it.

---

## D. Deferred on purpose.

- **D1. Purify the impure core.** A signature rewrite. The path work showed the
  interface has not settled, so doing it now would be invalidated.
- **D2. Headless coverage for the ui layer.** 15 modules, 5 reachable from the
  headless gate.

---

## If it were mine to order

A4 and A6 first: both small, both protect everything else, neither touches
design. Then A2, because layer isolation is the complaint that arrived from a
person and from a measurement at the same time. Then A1, which is the one with
evidence but needs a ruling first. A3 is small enough to ride along with A2.

A11 and A9 are blocked on one question each. Answering both costs a minute of
looking and would unblock real work.
