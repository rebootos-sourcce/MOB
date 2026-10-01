# The plan, 1 October, rounds OD to OS

Everything he has added over these rounds, sorted, with what state each is in.
Statuses are read off the repository and the gate runs, not recalled. "Pushed"
means on `claude/laughing-feynman-xhfyj3`. The in-app task list mirrors this.

## A. Done

Moved to `PLAN-HISTORY.md`, so this file carries only what is open.

## B. In flight (agents running, nothing merged yet)

| Work | Seat | Delivers |
|---|---|---|
| Aura point cloud, three more renders: the cloud as mask and biofield, coherence lights it, five masks, new symbol icons | art | `mockups/character-aura/` |
| Left menu, four options: CQ and DQ on one gradient bar, element colours, the 112 node shadow, Flow against SQ and CQ, halo and pitchfork, domains collapsible, Summary above Reading | UI/UX | `mockups/rail-options/` |
| Login, onboarding and tutorial mockups, username first, visually exciting | art | `mockups/onboarding/` |
| The Matrix redesigned in the flow treatment; fetters and the celestial shown as gears or rings | animation | `mockups/matrix-gears/` |
| Ascended teachers: 12 plus their opposites, the click panel, the protocol alignment engine | systems | `DESIGN-teachers.md`, `mockups/teachers/` |
| Torus field around Orbit: bottom to top flow, Bezier geometry, seats distort it, trace for leaks | art | `mockups/character-torus/` |
| Sniffer: day quality, acts, irritation, masked profanity restored, the framework questions (sins, Inferno, ages, others), distress detection | AI | engine build, `SNIFFER-RECOMMENDATION.md` |
| Subtle atmospheric sound for everything, hover included | sound | build, `SOUND-MAP.md` |
| Teachers v2: imprints, affirmations, ritual tie, unlocks, cohort share | systems | `DESIGN-teachers.md` v2, mockup |
| Left menu round 3: simple, symbolic, gradient with the oscillation range as the boundary | art | `mockups/rail-simple/` |
| Privacy policy, terms, and where they live in the information architecture | narrative | `LEGAL-IA.md`, `PRIVACY-POLICY.md`, `TERMS.md`, `funnel/privacy.html`, `funnel/terms.html` |

All three Onboarding TDD reviews, the OAuth and Stripe steps, the left menu
round 2 and the teachers v1 design are merged.

## C. What is left, in order

1. **Fixes from round OT not yet done**
   - Sound: most presses are silent by design (seven moments play); decide how
     much to widen it (question to him).
   - Compass: panels start closed on landing (waits on which panel he means and
     on layout B, which removes the side panels).
   - "Unlock all these for me": all sight unlocked on his own copy.
   - The story prompt made alive (in the onboarding mockups).
2. **Character page build** in the Aura style once he picks; five masks, the new
   symbol icons upper left, Trace, the biofield light by CQ.
3. **Left menu build** in the option he picks (CQ and DQ on one bar, Vitality
   yellow, Awareness indigo, Will blue, Flow against SQ, halo and pitchfork).
4. **Login by username**: the app side and the server side (accounts); the
   login redesign from the mockups.
5. **Onboarding and First Experience**, slices O0 to O11 from review 2, once he
   rules on the plan-changing questions (section H).
6. **Matrix rebuilt and the gears view** in the picks he makes.
7. **Ascended teachers**: 12 plus opposites, the panel, and the alignment
   engine, in the slices the design lists.
8. Compass layout B (characters as circles in the overlay row, button look, no
   side panels).
9. Summary overhaul: icons stacked and grouped by type, a click gives detail on
   the right, cycle back through past days, the vault on the page, a readout
   look from the Flow page; then the Daily Summary UI D8 to D9.
10. CQ at 100 simulation pictures for the archetypes, emotions and six axes.
11. Practitioner page PR1 to PR4 on the example people, both right panel
    versions side by side (`PRACTITIONER-STORY.md`).
12. Avatar page toward the Becoming document, slices S1 to S4 first.
13. Name meanings: the vetted table, then the server lookup route (the second
    network seam needs his ruling).
14. Body place words: head, upper torso, lower torso.
15. Points slice 0 and the achievements system. Today `engine/ladder.js` holds
    16 derived marks in three families, a streak, a ledger and `meter.firsts`,
    read by the Compass, the Ritual page and the sound layer. Stored points,
    grants, unlocks and a hiding gate do not exist (`POINTS-AUDIT.md`).
16. Funnel: concern selection and the personalised gift (waits on the
    onboarding rulings).
17. Practice screens (Today, Goal Builder) and the Ritual writer cutover.
18. Copy sweep second pass, after his release wording ruling.
19. Knowledge entries carrying the correlations; the Intake questions
    redesign (last, his order); backlog scrub (`BACKLOG-AUDIT.md`).
20. Practitioner mode toggle: reported not appearing, could not reproduce.

## D. Waiting on him

Tier for the Compass registers view and the Character masks (proposed two and
three); where the name meanings come from; which seats the torsos cover;
shoulders, head, stomach, gut; the rerun's decompression order and what the
bell curve is as a rule; the release wording ("letting go" or "release"); the
funnel opening lines; Stripe steps (`STRIPE-SETUP.md`); whether the practitioner
right panel reads the story.

## E. Waiting on accounts

The practitioner grant model and everything that reads a client's record
(PR5 to PR9), retention and deletion beyond the device, push, points that buy
patterns, any server for the Summary.

## F. Standing process

Four-heading reports, questions listed in full with their context, pictures for
anything visual before it is built, one gate run on the merged tree, no pushing
ungated. Every new agent runs on Sonnet in its own copy of the repository with
a sparse checkout, because the disk is the limit.

## G. The experience and ICP model (round OK)

`ATUNED-experience-icp-model.md`, read three times (see `TASKS.md` round OK).

| Slice | What | Where it lands |
|---|---|---|
| X1 | Audit the funnel and the Day One tutorial against the first-success checklist: one decision, automatic pattern, no paywall before value, advanced hidden, achievements hidden at first | a written audit, then changes to the first release |
| X2 | The six release outcomes and a recovery for each, a "how did that land" step at the end of a release, kept on the Practice record | release card, `engine/practice.js` |
| X3 | Experience metrics as counters on the device: first, second, third release, weekly practice, return days; the person's own relevance and change answers | engine, Settings, never sent without a ruling |
| X4 | Maturity levels from the record, internal; the names collide with Practitioner, so they need new words | after the Points and Becoming slices |
| X5 | Upgrade prompts that follow demonstrated demand, reconciled with sight by tier | tiers page, allowance panel |
| X6 | Addiction-language sniffer: six steps, the person's own object kept, release offered at the level found, no diagnosis; the release lines for six levels have to be written | lexicon, release, copy seat |
| X7 | Shadow-weight telemetry on the Summary: DQ, change since the last release, where the weight sits, the heaviest areas, the patterns | Summary layout and Daily Summary detectors |
| X8 | Marketing and tagline: see it, release it, feel the difference, practice, change | funnel copy, brand |

Open with him: whether the reading stays visible across tiers (his tier ruling
says no for saboteurs and above); what the six maturity levels are called;
who writes the six ladder lines; whether the experience metrics may ever leave
the device.

## H. Onboarding and First Experience (round OS, three reviews merged)

Source: `ATUNED-onboarding-first-experience-TDD.md` (his), reviewed in
`ATUNED-onboarding-REVIEW-1-product.md` (state map, eleven contradictions, the
persona drop-offs), `-REVIEW-2-systems.md` (objects, persistence, events,
slices O0 to O11) and `-REVIEW-3-narrative.md` (every screen in the TDD's
schema, ten integrity questions, six archetype questions, safety and claims,
the visual grammar table). Mockups of the screens: `mockups/onboarding/`
(in flight).

**What the reviews found that changes the plan**
- Neither the onboarding nor the Day One tutorial reaches a first release
  today. A stranger gets to one only by finding the Story tab alone.
- The first run flags were dropped at every load, so the onboarding replayed on
  every launch. Fixed this round (O0, first half).
- The TDD's own example, "I keep taking care of everybody else.", read as
  nothing. Round OU rebuilds the sniffer (day quality, acts, irritation, the
  story frame and the framework questions) and the Mirror waits on it.
- There is no safety path: a sentence about ending one's life reads as Sad 8.8
  and is offered a release. The two safety lines drafted in
  `reviews/LEGAL-floor.md` are not built.
- The funnel promises "nothing you write leaves this browser"; the TDD wants
  the story moved into the account. One has to change.
- The TDD names the loop Mirror, Test, Change and says "the reading is visible
  across tiers"; both collide with his rulings (discover, play, flow, embody,
  a circle; sight by tier).

**Slices, in order** (sizes from review 2; each has its gate there)
O0 stop the silent drops (flags done; failed saves must report) S ·
O1 the journey record M · O2 the Story Signal, offline M · O3 the mini release
and the run record M · **O4 the first-run sheet, which makes the first release
reachable** L · then in any order: O5 ground and the gift, O6 the post-release
responses, O9 disclosure and the achievement gate, O10 the local event log ·
O7 the ten integrity questions and O8 the archetype check wait on rulings ·
O11 the server seams wait on accounts.

**Ruled by him, round OX (1 October)**
1. The account is created after the first release, never before; on sign up all
   the data from the person's input is passed over (a device-local handoff,
   claimed at sign up).
2. A new person sees the whole reading while the gift lasts.
3. The gift is a counter of 100, and the counter space can carry other things.
4. The Mirror's cause is the person's own second answer, quoted back.
5. The integrity and archetype questions are part of the starting session
   (whether answers write to the laws is not ruled: evidence only until it is).
6. No permanent safety line. The sniffer must detect distress in a story and
   answer it (built into the sniffer round: detection, then a short message and
   the drafted support lines, shown only on detection, no release offered).
8. The first release says "I am releasing believing, thinking, feeling,
   behaving and acting that I am ..." (five channels; differs from the shipped
   six-channel "letting go" stem, which stays elsewhere until he says
   otherwise).

**Still open**
7. What the first release does when the first story puts nothing above the line
   (recommended: a labelled practice run that writes nothing).
9. What counts as repeated use for revealing achievements, the word (marks or
   achievements), and who gets the referral 25.
10. Whether the five-channel sentence replaces the six-channel stem everywhere.

**Slices unblocked:** O1 (the journey record), O2 (the Story Signal, after the
sniffer round lands), O3, O4 (the first-run sheet). O5 uses the counter. O7 and
O8 are in the starting session.
