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

## B. The funnel, and the small service behind it.

Part B described this properly, and one instinct in it changes the size of the
work: keep the quiz store separate from the app rather than making the app
talk to a backend. That is the right call and it is worth saying why.

**The funnel as described**

1. The ad does not say download the app. It says take the test, learn your CQ.
2. The quiz runs on the web. All the questions.
3. At the end the person enters an email. The answers are keyed to it.
4. To see the score they download at least the free app.
5. They sign up with the same email, and the answers come down with them.

**What actually has to exist**

Measured against the real schema, not estimated:

    questions in the quiz        63
    answers payload             432 bytes
    laws payload                304 bytes
    one quiz record, keyed      1.1 KB      512 bytes gzipped
    100,000 people              about 49 MB total

That is the entire service. A key value store holding half a kilobyte per
person, a write when the quiz completes, and a read when the app asks. It is
not a backend for the app. The app stays a single file and gains exactly one
capability: fetch a record by email, once, at sign in. Every other item in the
old version of this section assumed far more than that.

**B1. The web quiz.** A separate build from the same `atuned_src/`. It runs the
63 questions and nothing else, so it shares the intake and the schema and
carries none of the renderers.
*Medium. Mostly reuse.*

**B2. The record store.** Email keyed, versioned with the same `SCHEMA_V`, one
write and one read. Separate from anything else by design, per part B, so it
can be moved or replaced without touching the app.
*Small, and smaller than it sounds at 0.5 KB a record.*

**B3. Claim on first run.** The app asks for an email at sign in and pulls the
record down once. After that the profile is local again, which keeps the
privacy posture everywhere except the handoff.
*Small.*

**B4. Desktop and app talking.** Same mechanism as B3. No new surface.

**Two things the design as described does not yet handle**

*The email is the only key.* As stated, anything that knows an address can
retrieve that person's somatic and psychological profile. That is not a
hypothetical, it is what "ping the email address and get the answers" means. A
one time code sent to the address, or a signed claim link, closes it and costs
very little. Given what this data is, it is not optional.

*Data leaving the device changes the legal position.* While everything stayed
in the browser there was no controller and no processor. A stored quiz record
keyed to an email is personal data held by someone, so access, deletion and
breach obligations attach. Worth one hour with someone who knows the ground
before the first record is written, not after.

**Still a fork, but a much narrower one**

The old version of this section listed pings, streaks, a community feed and
manager reporting as one decision with the funnel. They are not. The funnel
needs 0.5 KB a person and one read. Engagement mechanics need identity,
sessions, social graph and a notification channel. Taking the funnel does not
commit to any of the rest.

**Deferred, and genuinely separate**

- Notification pings and a chosen practice time
- Streaks
- Community feed, curated or open
- Seeing other people's progress
- Manager reporting and an admin portal
- Paid desktop tier against a free pattern only tier

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
person and from a measurement at the same time. A3 is small enough to ride
along with A2.

Then A1, and it is worth seeing that A1 and B1 are the same work. The funnel's
quiz IS the full intake. Building the gate inside the app and building the web
quiz are one job done twice if they are scheduled apart, and one job done once
if they are scheduled together. That is the strongest argument for doing the
intake next rather than later.

A11 and A9 are blocked on one question each. Answering both costs a minute of
looking and would unblock real work.
