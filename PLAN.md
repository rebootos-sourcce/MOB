# The plan, 2 October, rounds OD to PH

Everything he has asked for, sorted, with what state each is in. Statuses are
read off the repository and the gate runs, not recalled. "Pushed" means on
`claude/laughing-feynman-xhfyj3`. The in-app task list mirrors this. Reply style
since round PH: plain words, as if he is ten, no fixed headings; questions only
when blocked (round PD).

## A. Done and pushed (latest build v1161, commit 8df2ce2)

Full list in `PLAN-HISTORY.md`. This round: all gates green on a quiet machine;
welcome pop-up after paying; Guest label and developer options lower right;
End button on the release opening screens; his recorded opening voice saved
(`audio/`: master wav, 143 KB Opus clip, phrase timing); API setup on one page
(`API-SETUP-NOW.md`); round PH review passes 1 and 2 written (`REVIEW-skin/`).

## B. In flight right now

| Work | Who | State |
|---|---|---|
| Skin review, pass 2 (cross reading) | all directors | 11 of 12 reports in; technical pass 2 and the QA measurement report still writing |
| Skin review, pass 3 (pitch to the ICPs, final grades, tally, ranked recommendations) | all directors | starts when pass 2 and QA land |
| Export of finished files to his Drive folder | me | set up this round, see section I |

## C. Next, in order

0. **Onboarding and tutorial, moved to the top (round PJ).** He dislikes the whole
   look and wants an automatic slider, no button presses. Run the standing review
   framework on it (`REVIEW-FRAMEWORK/`, `REVIEW-onboarding/`: pass 1 running with 13
   seats), then pass 2, pass 3 with the ICP simulation, then a mockup of the auto
   slider sent to him FIRST so he can review it while the rest is built, then the
   build behind his pick. Takes his recorded voice (`audio/`).
1. **Finish the skin review** (round PH): pass 3, then one tally and one ranked
   list, as a page he can read. Every seat so far agrees on the same top items:
   - the avatar is not on screen (Character locked and empty) and must be a free
     figure on the Field centre, with masks and layers staying on the tiers;
   - the loop must be drawn as a ring, not a row;
   - seat colours carry too many meanings (16 to 25 collisions): hue means place
     only, state moves to lightness and shape;
   - no type scale (26 to 43 sizes): about six sizes, three weights;
   - sentence case wins over the capitalise rule (one CSS line, 99 strings);
   - locks read as a shop: one sealed mark per surface;
   - the unread Field prints verdicts and makes no promise;
   - the phone pill overlaps the zoom buttons (cheapest fix, eight seats named it);
   - the buy page says false things (50 patterns, "new ground and nothing else").
2. **Skin build**, in this order once he sees pass 3: one source for seat colour
   (CSS tokens, canvases read them), type and spacing ramps, state split from
   place, the free figure, the loop ring, one lock grammar, motion verbs and one
   clock, then a coherence gate (`tools/coherence.js`) so the number cannot rot.
3. **Restart the builds stopped by the machine restart**, each merged only after
   the gates: release screen (black stage, his voice, done screen with class
   given up and adjusted SQ, DQ, CQ), Character page (Orbit with Torus 2,
   overlays, Vitality oscillation, info on the right), left menu on horizontal
   lines, sniffer and feelings wheel and distress detection, atmospheric sound,
   recipe engine and 14 teachers, Login A and ruled copy, onboarding O0 to O4.
4. Layer observatory as a fourth Field rendition (graded A against the Field).
5. Accountability page beside Ritual in Flow; Avatar, Summary, Intake to spec;
   Story page redesign (mockups first); Compass layout B.
6. Points and achievements engine (slice 0 per `POINTS-AUDIT.md`).
7. Login by username (app and server); server commit and Stripe and Google
   OAuth wiring (his steps in `API-SETUP-NOW.md`).
8. Update the TDD set to match the sniffer, sound and login work.
9. Funnel true-up: buy page facts, quiz scores, landing loop words.
10. Practitioner page, name meanings, body place words, copy sweep second pass,
    Knowledge correlations, backlog scrub.

## D. Waiting on him

Nothing blocks work. Standing, not blocking: say if any word in the ten
phrases of the recording is wrong (`audio/atuned-opening-timing.json`); the
sight reversal question (should the first release show the whole chain), which
the seats recommend yes; the Stripe and Google steps when he has time.

## E. Waiting on accounts

The practitioner grant model and everything that reads a client's record,
retention and deletion beyond the device, push, points that buy patterns, any
server for the Summary.

## F. Standing process

Plain words as if he is ten. Pictures for anything visual before it is built.
One gate run on the merged tree, on a quiet machine. No pushing ungated. Every
agent runs on Sonnet in its own sparse copy of the repository. Seats decide and
record the reason; one question only if blocked.

## J. Round PJ and PK, blocked in (2 October)

Reviewed twice before it was frozen (see the review notes at the end of this section).
Blocks that touch the same files run one after the other; the rest run in parallel, each
in its own sparse worktree, each merged only after the gates.

| Block | What | Files it owns | After | Size |
|---|---|---|---|---|
| J0 | SHIP BLOCKER found by the onboarding copy review: nothing detects distress in the first free text a stranger types. Measured on the real engine: "I want to end my life. I feel hopeless and numb." reads Sad 8.8 and is offered a release; "I do not want to be here anymore." reads as nothing. He ruled no permanent safety line, so the sniffer must detect and respond. The first story step does not ship to strangers until this is built. Start from the distress reader that already exists on branch `worktree-agent-a6d4e60928876b711` (commit `c1cbc1a`, `engine/distress.js`; 31 of 33 on its tuning set, 5 of 18 on a cold set, English only, not merged), Measured by the AI seat: the distress reader goes blind on an iPhone curly apostrophe ("I don't want to live anymore" reads urgent, the same with \u2019 reads nothing; `lawNorm` at `sniff.js:1030` turns the curly mark into a space and every cue is written without apostrophes), negation voids the wrong cue ("Nobody knows I want to die" reads none), and cold recall is about 28 percent (5 of 18), so the first build must fix the apostrophe, step negation down one level instead of voiding, and be called best effort in copy. then resume the stopped sniffer build (feelings wheel, subject) with fixtures kept in data files, and a QA gate that fails if the three outcomes (ordinary, strong, needs a person now) regress. Copy for the frames needs clinician sign-off | `engine/lexicon.js`, `engine/sourceai.js`, data files, `ui/storyui.js` | nothing | M |
| J9 | Words and settings that contradict the rulings, found by the safety and privacy review: four live lines state a cause for the body or the person (`summary.js:254`, `:293`, `:318`, `drills.js:1348`; rewrites are in `REVIEW-arch/pass1/narrative-director.md`); the "Improve the Models" toggle in Account ("Use my stories to refine the reading") contradicts research sharing off; the wrong company name "Tool of Unified LLC" is fixed in the legal drafts (done this round, now Tula Unified LLC) | `ui/summary.js`, `ui/drills.js`, `ui/account.js` | nothing | S |
| J10 | READING COVERAGE, measured by the onboarding innovation seat: 11 of 16 plain first-person sentences return zero imprints from the real `parseStory` ("I keep taking care of everybody else.", "I feel like a fraud at work.", "I am tired."), so the first reading is often empty and a "never empty" promise has no mechanism. Build the sniffer coverage the owner already asked for (feelings wheel, subject, rough day, masked profanity) and add an engine test that all twelve starting points read on their own, with the 16 sentences kept as a fixture. A seed from the chip must be labelled as the starting point and stay unlit until the person's own words read | `engine/lexicon.js`, `engine/sniff.js`, data files, `tests/engine.js` | J0 | L |
| J11 | SELF-GRANT, reproduced by QA in the architecture review: `pImport` accepts a record carrying `plan:{tier:'four',status:'active'}` and all 7 sight layers flip from locked to seen exactly as a real tier four. `engine/schema.js` says the app never writes `plan`, but the boundary does not enforce it. The same record can also set its own allowance (`meter.unique`, `plan.base`). Fix: the boundary ignores `plan` from an imported or pasted record until the server answers, refuses an out of range `granted` by name, and a gate proves it fails on the revert. Settled by the seats, no question to him: on a downgrade OPENED GROUND is kept (opened addresses, reruns, journal, history, points) and layer sight follows the current tier; the Worker does NOT hold the list of opened ground (it would learn which addresses a person opens, and all content ships in the one file anyway) | `engine/schema.js`, `engine/plan.js`, `tests/engine.js` | nothing | S |
| J1 | Onboarding and tutorial: review, auto slider mockup to him, then build | `ui/onboard.js`, `ui/tutorial.js`, `.ob-*` css, release opening | review pass 3 and his pick | L |
| J2 | Small shell bugs: sound on but silent; sound off prints "Nothing saved on a worked example" (the sound switch must be a device setting, not a profile write); status and errors move to a bottom log, shown 3 seconds unless held open; protocol screen gets an X before running and an End on the run | `ui/component.js` (status), `ui/sound.js`, `ui/release.js`, `shell/head.html` | nothing | M |
| J3 | Profile menu: examples sorted by tier; the app loads on the profile he left on; "Custom, new" lets him enter his own information and creates a profile; the active profile is remembered | `ui/panels.js`, `ui/ui.js`, store | J2 (same files) | M |
| J4 | Field page, summary first: macro field down to the fetters at the top, a link to the Summary page; "By weight" and "By assemblage point" become collapsible sections under it; the "Carrying, Filled in, Heaviest, Most shut" block is explained or cut; the energetic summary rebuilt to the rules and checked for accuracy | right rail in `ui/ui.js`, `ui/summary.js`, `ui/imprints.js` | J3 | L |
| J5 | Masks by tier in the SIGHT table and the Character page: provisional reading of his dictation, tier one sees Child and Preteen; tier two adds Ideological and Professional; tier three adds Teen and Adult (all six); tier four all. He said "limiter", which is not a mask in the data (it is a sniffer idea), so Professional stands in until he says | `engine/plan.js`, `ui/character.js`, `ui/lock.js`, `tests/engine.js` | nothing | S |
| J6 | Flow menu becomes mini routines, set up from the Ritual builder, built from the lineup in his reading | `ui/ritual*.js`, recipe engine | recipe engine merge | L |
| J7 | Copy verification: the narrative seat walks the whole site, every tooltip and info line, against the voice rules; QA independently re-checks; evidence file `COPY-VERIFY.md` with counts; fixes land in data files and strings | many files; runs LAST, after J2 to J5 merge | J2 to J5 | M |
| J8 | Two defects the onboarding review found: (a) the gift is not honoured in code: he ruled the whole reading is visible while the gift lasts, but `planSight` ignores the gift, so a new person sees no saboteurs (measured: `planSees(null,'sab')` is false); (b) "Unlock all sight" sits on the real login screen for any stranger. He asked for developer options lower right, so it stays for him; before any public release it must hide behind `?dev=1` | `engine/plan.js`, `ui/login.js` | nothing | S |
| K1 to K6 | The six-area architecture (orchestrator and one contract, the 90-day state machine, the evidence ledger, the safety gate, privacy as architecture, identity and entitlement): review in 3 passes, then the executable slices are written into this table | `REVIEW-arch/` | review pass 3 | L |

**Round PK, what is already clear.** The proposal quotes "Sight is not for sale, new
ground is". He reversed that on 1 October: the tier table now sells how far up the chain
a person may look, plus velocity. The entitlement design must follow the table. What
survives from the proposal: a downgrade never takes away ground already opened.

**Review notes (two reviews).** First review: the order puts the shell bugs (J2, J3)
before the Field rewrite (J4) because all three edit `ui.js` and `component.js`. Second
review: J7 runs last because it touches strings in every other block; J5 is tiny and
independent so it goes first; J1 stays at the top because he asked to review it while
the rest is built.

## I. Getting files to him

I cannot reach a disk on his own computer: this session runs in a cloud
container. What works, and what is automatic:
- Every push puts the files on the branch; each file has a raw address.
- Builds are sent as an attached `atuned.html` with commit and md5.
- Documents (this plan, the review tally, the reports) are copied into his Google
  Drive folder `Atuned / From Claude` at the end of each round. A packed build is
  too big for that route, so builds stay attachments.

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

**Ruled by him, round PA (1 October)**
- Login A, the ring, is the login. One Log in, with Create account and Guest
  beside it; subtle animation on the ring; the blue Atüned logo; username and
  passphrase with an optional recovery email at sign up and a recovery route.
- Starting points ("What brought you here?"): add Pain; twelve.
- The Mirror carries a description of what the pattern feels like running
  through the person and what it links to when saboteurs form. Not quite asks
  which part is unclear: the adjective, the descriptive subject, or the subject
  itself. The empty Mirror asks "Where does it land in your body?".
- The somatic line stays and is neurosomatic: "Welcome to a neurosomatic
  experience. Awareness and intuition is a tool we use to turn your senses
  inward."
- The mini release is 12 lines. The ten integrity laws: he picks from the full
  list of 21 (given back to him in round PA's report).
- The sniffer follows the feelings wheel (`FEELINGS-WHEEL.md`): every wheel
  word, grouped by family, mapped to the assemblage points the family relates
  to; and it sniffs for the subject of each clause.
- The release opens on his recorded voice (to be recorded by him: a recorder
  page and the embedding are part of the release redesign).
- Legal facts: Tula Unified LLC, 1634 West 39th Place, Los Angeles, California
  90062; California law; hello@atuned.world; no refund after seven days; open to
  the EU and UK; deleted accounts are kept in backup for 90 days with a recovery
  process; birth data does not travel and the analytic data does; a ticked
  agreement box. Open: age floor, dormant accounts, who holds the key to stored
  records.

**Ruled by him, round PB**
- The ten integrity laws of the first session: Truth, Transparency, Unity,
  Humility, Compassion, Duty, Accountability, Patience, Temperance,
  Forgiveness (seats: Throat 2, Crown 1, 3rd Eye 1, Heart 2, Solar 2, Sacral 1,
  Root 1).
- Twelve starting points; measure whether twelve is too many.
- The layer observatory: pull in elements from the Field and reach an A against
  the Field's C.
- Research sharing is off and not offered at launch. The age floor is 18.

**Decisions taken by the seat, round PD (he is fatigued by questions; he can overrule any)**
- The teacher roster in DESIGN-teachers.md v2 stands as recommended: 14 poles,
  thirteen people, Jesus at two poles.
- Left menu: horizontal stacked lines with the icons inside, one solid two-colour
  CQ and DQ bar with an oscillating termination point (round PC); built after
  the revision lands.
- The release opens on his recorded voice with the app voice as the fallback
  until he has recorded it; a recorder page is part of the release redesign.
- Character page: Orbit with the torus, built after the torus mockup lands.
- The observatory: pulls Field elements and is held to an A against the Field's
  C.

**Decisions taken by the seat, round PD (continued)**
- The layer observatory becomes a fourth way of drawing the Field (beside the
  Field's three renditions), so it pulls the Field's own elements. Take the
  mockup as designed: Follow a thread as the interaction, the four views (by
  fetters, saboteurs, complexes, hyper complexes) as the lens, Scrub deferred
  until the product keeps a per-entry history. The pop rule (an address beats at
  7.2 s minus 0.62 s per SQ point, flaring for 12 percent of the beat) stands.
  The connections stay in the chain beside the rings. The address tile ring
  stays. The families keep the codex seat colours.
- Build queue after the current builds land: the observatory, the release screen,
  the sniffer merge, the sound merge, the Character page, the left menu, onboarding
  O2 and O4, the Compass layout B and the Summary overhaul.
