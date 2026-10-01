# The plan, 1 October, rounds OD to OS

Everything he has added over these rounds, sorted, with what state each is in.
Statuses are read off the repository and the gate runs, not recalled. "Pushed"
means on `claude/laughing-feynman-xhfyj3`. The in-app task list mirrors this.

## A. Completed, gated and pushed

Read off `git log` on `claude/laughing-feynman-xhfyj3` and the gate runs. The last
full gate run, on the merged tree at build v1106 (`65af38d`): engine 3635
passed, functional 1793 passed, locks 289 passed, and design, collide, boot,
funnel, sound, monitor and the voice check all exit 0.

**Navigation and shell**
- Header: wordmark centred on the hamburger; zoom icons in a row (`80c11de`, `5651a17`).
- Body in Play between Field and Compass; the Intake door in Discover restored
  as its own page, integer 13 (`06f5c52`, `9ca2de5`).
- Profile button as a menu of account sections, Settings and Sign out; sound
  effects switch, on by default (`a14000d`, `237997c`).
- A profile with no ritual track or seat no longer vanishes at boot.

**Field, Body, Compass, Character**
- Field pulses run on the Shadow wave; jitter cut twice; four-pool glow behind
  the wheel, the Body and the Compass (`85a370c`, `0089635`).
- Compass overlays as the glass bar's circles, characters as two panels
  (`8868cf7`). Compounding band pill beside Accuracy.
- Character page: masks rail, hero and weave; oval face; Field-sourced effects
  (`6f7ba7e`, `47b101d`, `e3039df`).
- Body places: belly, navel, diaphragm, halves, heart and plexus names
  (`5245c55`, `935224c`).

**Left menu and Summary and Intake**
- Left menu combined from three concepts (`65af38d`): six readings with the
  name and number inside the fill, Decoherence as seven seat hashes, Flow as a
  sine wave, Orientation and Balance in the block, the Awareness fold, option 2
  behind `?rail=2`, nothing drawn across to the centre pane.
- Summary rebuilt by meaning, first drivers on the right, three reviews on
  record (`d1ddd32`). Name meanings laid out with a researched table.
- Intake page redesigned: a map first, the questions on open (`e6dea3e`); phone
  digits legible; the CQ at 100 simulation as pictures (`45d4b8b`).

**Release, practice, trace, sniffer**
- Rerun v2: lines marked heavy go back where they sit; reframe half runs 50
  back to 1 (`ce91fe6`, `fd81201`).
- Practice domain (775 checks) and Trace graph (266), with their bridge gated
  (`f38e0d8`, `8ff0d49`, `2289e9c`, `2dd3823`).
- Impression Excavation Engine wired into the Story tab (`c6280fa`, `6af99b3`);
  clause floor for the sniffer's negation (`c2999cf`).
- Sound engine and the seat tone, default on (`c19337c`, `237997c`); the seat
  tone gate now reads the tone's own pair (`9daeb33`).
- Daily Summary engine, slices D1 to D7: the frozen day, the aim, the grounding
  pass, the drawer, the vault of past days (`a93f388`).

**Money and tiers**
- Stripe: prices 12, 29, 59, 99; checkout, webhook for renewals, changes and
  cancellations, Manage billing, the plan read back into the app;
  `STRIPE-SETUP.md` (`0e43e2a`, `9b4707d`, `19337c2`, `9bb10cf`).
- Sight by tier: one table in `engine/plan.js`, the lock treatment (greyed,
  padlocked, described, not drawn), the buy page reading the table
  (`088953c`, `28743dc`, `6178ea5`). Free rerun route and tiers page (`1da7e1e`).

**Voice and copy**
- Copy brief as a checker (`check.py --brief`); sweep first pass with 0 stops
  left (`acacc3a`, `21bb264`, `31d3acb`); Day One tutorial and onboarding copy.

**Audits and documents**
- Practice, Becoming, Points, Daily Summary and Release Intelligence audits;
  the practitioner story and the gap to MVP; the experience and ICP model
  (`ATUNED-experience-icp-model.md`) and the Onboarding and First Experience
  TDD copied in (`ATUNED-onboarding-first-experience-TDD.md`).

**Mockups delivered, awaiting a pick**
- Character masks: Seal and its variations, then three systems (Aura, Contour,
  Mosaic); the owner chose Aura, the point cloud (round OR).

## B. In flight (agents running, nothing merged yet)

| Work | Seat | Delivers |
|---|---|---|
| Aura point cloud, three more renders: the cloud as mask and biofield, coherence lights it, five masks, new symbol icons | art | `mockups/character-aura/` |
| Left menu, four more options: symbolic readings, the 112 node shadow as architecture, Flow tied to CQ, DQ and SQ | UI/UX | `mockups/rail-options/` |
| Onboarding TDD, three reviews (product and ICP, systems and data, narrative and safety) | three seats | `ATUNED-onboarding-REVIEW-1..3` |

## C. What is left, in order

1. **Character page build** in the Aura style once he picks a version; five
   masks, the new symbol icons upper left, Trace, the biofield light by CQ.
2. **Left menu build** in the option he picks.
3. **Onboarding and First Experience**, designed into slices O1 to On once the
   three reviews land (section H below).
4. Compass layout B: characters as circles in the overlay row, names on hover,
   no side panels, the circles drawn as buttons because they become protocols.
5. Summary overhaul: icons stacked and grouped by type, a click gives detail on
   the right, cycle back through past days, the vault on the page, a readout
   look from the Flow page; then the Daily Summary UI D8 to D9.
6. CQ at 100 simulation pictures for the archetypes, emotions and six axes.
7. Practitioner page PR1 to PR4 on the example people, both right panel
   versions side by side (`PRACTITIONER-STORY.md`).
8. Avatar page toward the Becoming document, slices S1 to S4 first.
9. Name meanings: the vetted table, then the server lookup route (the second
   network seam needs his ruling).
10. Body place words: head, upper torso, lower torso, replacing earlier seats
    where they overlap.
11. Points slice 0 and the achievements system. Today there is no achievements
    or points engine: `engine/ladder.js` carries the rule that the reading is
    not an achievement, and the ring badge in `ui/component.js` is a display
    part. `POINTS-AUDIT.md` has the build order.
12. Funnel: concern selection and the personalised 100 pattern gift (waits on
    the storyboard and the onboarding slices).
13. Practice screens (Today, Goal Builder) and the Ritual writer cutover.
14. Copy sweep second pass, after his release wording ruling.
15. Knowledge entries carrying the correlations; the Intake questions redesign
    (last, his order); backlog scrub (`BACKLOG-AUDIT.md` dates from 27 September).
16. Practitioner mode toggle: reported not appearing, could not reproduce.

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
