# The plan, 2 October, rounds OD to PL

Everything he has asked for, sorted, with what state each is in. Statuses are
read off the repository and the gate runs, not recalled. "Pushed" means on
`claude/laughing-feynman-xhfyj3`. The in-app task list mirrors this. Reply style
since round PH: plain words, as if he is ten, no fixed headings; questions only
when blocked (round PD).

## 0. CURRENT TOP PRIORITY, refreshed round QG, 2 October night. Supersedes the ordering below until closed

Round QG, his words: "Review the last two or three TDDs find out what needs to be blocked and put into
plan I don't see them in plan right now." This section is the fix: it names where each of the two TDDs
actually stands, read off the repo now rather than left as a stale snapshot from the night they arrived.

**TDD 1, the Congruency MVP** (`reviews/ATUNED-System-Congruency-MVP-TDD.md`). Its own words: "Do not
expand into unrelated features until this path is closed and tested." The audit (`reviews/CONGRUENCY-AUDIT.md`)
landed and found three breaks in the STORY to FIELD chain. Two are fixed and pushed:
- the onboarding `ob` field silently failing the profile boundary on reload (fixed, `storeRefused()` wired
  into the boot path);
- no "what changed?" step after a release (fixed, round QC, `releaseVerify` in `engine/journey.js`, build v1428).

Still open, the one remaining closure: **F16**, the mirror's Yes/Not-me answers never reach the trace
graph or the Field's rail. Not started. This is the next build this chain calls for.

**TDD 2, the Tuned Awareness Architecture** (`reviews/TUNED-AWARENESS-ARCHITECTURE-TDD.md`, round QF).
Audited (`reviews/TUNED-AWARENESS-AUDIT.md`, round QG, landed and checked): 34 substantive requirements,
13 exist, 9 partial, 5 missing, 7 conflict. Verdict: the restorative loop it proposes is largely the
product already (the sniffer, the mirror, release, Embodied Truth as its own "retuning"); nine of eleven
proposed state fields already have a real producer. Genuinely new and worth building: two signal fields
(persistence, coupling) that exist nowhere today, a derived composition read, and a wider drift measure.

Its one real conflict worth naming here: the document's `CQ = (Intention x Integrity) / Resistance` is
not the shipped formula. `engine/compute.js:386` and `DECISIONS.md` (25 September) both confirm resistance
stopped dividing CQ by owner ruling; CQ is the 21 laws alone. (This repo's own round QF log in `TASKS.md`
restated the old formula as current and is corrected there, round QG; `CLAUDE.md` does not and never did
carry this formula, despite the audit document citing it as a second source for the mistake, which does
not hold on a direct check and is not relied on.)

**Ordered steps, ahead of anything else in this TDD:**
0. F16 (above) — precondition, already queued, not new work.
1. A documentation-only reconciliation pass: observation-contract mapping between the two TDDs, the CQ
   correction, a resistance-to-address mapping, recording that the document's graph vocabulary is not
   adopted. No code. Can run beside F16.
2. `srcPersist` in `engine/sourceai.js`: per-seat first-seen/last-seen/gap read. Depends on F16. The
   single highest-value item in the document.
3. Coupling: seat pairs appearing together above chance, a stated minimum support. Depends on step 2.

Recommended against building as written: the document's coherence engine, its graph vocabulary, a stored
tuning model, and aperture as a number (collides with the still-open QT3/QT6 fetters-narrow-awareness
question). Named as the bigger lever on the whole premise, not scheduled as a step then: the sniffer's own
recall gap. **The 91 percent figure was wrong, corrected round QZ.** It came from reading the product's own
reference prose, which is mostly concepts-about-emotion rather than lived description, so the number was a
property of that genre and not the real gap. Re-measured on a frozen, labelled corpus of real-feeling painful
writing: 64.7 percent unread before the fix below, fixed to 7.6 percent after. See the sniffer item in the
queue below.

**TDD 3, the Master Business/Marketing/Technology TDD** (`reviews/ATUNED-Master-BMT-TDD.md`, round QI).
Audited (`reviews/MASTER-BMT-AUDIT.md`, landed and checked). Most of it restates architecture already
graded above; cited rather than re-graded. The business/fundraising sections (the $1M raise, service
structure, one- and two-year cohort plans) are marked strategy, not a code requirement, per the document's
own closing line, and are not scheduled here.

**What is real and checked directly, not just reported:**
- The claims hierarchy (section 38: sort every public statement into observed/inferred/hypothesis/
  validated/clinical/etc) is MISSING. Nothing in the code does this.
- **FIXED, round QI/QJ.** The live funnel really did ship claims the document's own rules forbid, and
  nothing was stopping it: `marketing/refuse.js` passed "Mindset programming is the cause," "is making us
  ill," and two versions of "shows up as mental, physical and spiritual disease" with zero violations, and
  wasn't wired into any build step. A correction owed here: this section first also named "An AI therapist
  in your pocket" and "predicts illness" as live, which was a checking error (one combined search that
  didn't confirm each phrase separately) — those two were never shipped, only test sentences inside the
  audit document itself. The real four lines are all his own words (`TASKS.md` rounds FN, AJ2, IN, QZ3) and
  are now held by a real gate, `tests/claims.js`, wired into `BUILD.sh`: it fails if any of the four changes
  or a new line like them ships. 108 passed, 0 failed on the current tree.
- Section 21 ("Sight is not for sale") was already reversed by his own ruling 1 October (`DECISIONS.md`,
  "Sight by tier, round OK"); the live build correctly follows the reversal, the document does not.
- The document's "Tier One" (progressive disclosure concept) collides by name with the shipped paid plan
  literally called "Tier one" (`proto/*/[...].html`, `see:'sup'`). Section 14's hide-until-needed principle
  is not implemented as a rule anywhere; the only hiding in the product today is by paid tier.
- The document's 17.4 percent / 1,000-ICP figure has no model behind it anywhere in this repo or his
  uploads. The repo's own checked model (`tools/ritualsim.js`, 1000 people, seed 20260920) gives 28 of
  1,000 still active at day 90, run and confirmed directly.

**TDD 4, the Next AI handoff** (`ATUNED_Next_AI_Experience_Measurement_Handshake.md` and
`ATUNED_Next_AI_Documentation_Index.md`, round QR). Audited (`reviews/NEXT-AI-AUDIT.md`, round QR,
landed and checked): 48 requirements, 9 EXISTS, 11 PARTIAL, 11 MISSING, 17 CONFLICT, 0 UNVERIFIED.
Eleven of the seventeen conflicts are the document asking for something the owner has already ruled
against elsewhere, not a new idea.

- **Signal test: CONFLICT with his own ruling.** His ruling (TASKS.md SIG5, SIG10): no picking from a
  list of words or places; his version is think yes ten times then no ten times, at the throat (JY, KD,
  KE). The shipped onboarding has no signal test at all (`ui/onboard.js:33` removed it); what ships is a
  Feel step and a Body step, both pick lists. "Signal test" now names three different things in shipped
  copy. Not building the document's version; the owner's own version is still unbuilt either.
- **Baseline and re-test: MISSING, the one genuinely new idea in the document.** Today the product only
  asks "what changed" after a release, never before. The `before`/`after` fields already exist on every
  evidence record, unused, and cannot be edited once written, so a baseline is safe to add without a
  schema change. Measured: one release moves CQ by about 0.01 on a 100 point scale (62.0000 to 62.0111);
  the document's own example (62 to 66) is about 360 times that size and should not be treated as typical.
- **CQ direction bands (Descending/Oscillating/Ascending): not implemented, but the premise is wrong.**
  CQ already has ten named tiers (`TIERDEF`), one of which is already called Oscillating (41-50), and the
  two tables disagree at 11 of 101 printed values. The document's own example (CQ 62) reads Oscillating
  under its bands but Ascending under TIERDEF. Needs one ruling (ONE set of words, see first steps) before
  either table ships anywhere customer-facing.
- **Gap = 100 - CQ: CONFLICT.** The gap was deliberately moved off CQ onto expression (`cqCeiling`
  replaced by `exHeadroom`); body load never enters CQ. "Gap" is also already the Avatar's own word for
  something else. Not building the document's formula without a ruling.
- **Ritual detection and account claim: PARTIAL to MISSING.** Suggestion exists in host code (`ritFor`,
  plus `ritSuggest` on the unmerged `flow3-qn`). Storage is still split three ways with no link back to
  the story. "Don't re-tell the story" holds on one device only (sign-in does not sync). The claim flow
  itself is MISSING. Storing it off-device needs consent, encryption at rest and de-identification, none
  built.
- **Algorithm versioning: PARTIAL.** Coherence (`CQ_MODEL`) and trace (`TRACE_ALG`) are already versioned
  under other names. The lexicon (`LEX_VERSION`) versions its tables but not its parsing rules. Release,
  pattern and ritual-detection versions do not exist. A real small defect found along the way: `seriesRead`
  does not check `m`, so a formula change can read as the person having moved.
- **His own addendum (model accuracy, variance, the "why" tooltip): MISSING/CONFLICT/PARTIAL.** Nothing
  shows a per-reading accuracy, and one cannot be measured on this data (`DESIGN-sniffer.md:373`). He
  himself struck the plus-or-minus figure ("100 plus minus 12, swing 11. That shit has to all go") and the
  voice gate now fails any figure carrying a tolerance, so a variance number is not being rebuilt without
  a fresh ruling. The "why is this reading unsure" tooltip is buildable now: the reasons already exist as
  separate engine signals, they sort cleanly into the person's own input versus the engine's guessing, and
  the masked-word fix below is the first input-side case.

**First steps on TDD 4, ordered:**
1. A single owner ruling on the CQ direction words and on "gap" before either goes anywhere
   customer-facing (FAQ, About page). Open question, see WAITING-ON-YOU.md.
2. The before/after baseline-and-retest capture: ~150 lines on the existing evidence fields, no schema
   change. Touches `ui/release.js`, so it lands after `release-carousel` merges.
3. The "why is this reading unsure" engine read and its tooltip: counts only (named by your words /
   guessed), no accuracy percentage and no tolerance number until step 1's ruling extends to cover those.

**FIXED and merged, round QR: the masked-profanity bug**, found from the owner's own annotated Journal
screenshot. Root cause is outside this codebase: the browser's own dictation (Chrome's Web Speech API,
Gboard voice typing) silently replaces a swear word with stars before the text ever reaches the page, and
gives the page no way to turn that off. Measured: a masked run can also inflate a reading, not only lose
one ("really ****** furious" at 33.6 vs. the same sentence typed out at 24.0, because the mask removes the
word the degree-word was modifying). The fix (`engine/sniff.js`: `maskedRuns`, `maskedSay`, pure engine
functions, no host access) detects any run of two or more stars inside a word and shows one plain sentence
under the Journal box and the onboarding story box saying dictation hid a word and inviting the person to
type it over the stars. Verified directly: merged into `claude/laughing-feynman-xhfyj3` at `f47aa63`,
rebuilt clean, `tests/engine.js` 4448 passed 0 failed (12 new, confirmed to fail on the pre-fix engine),
`tests/claims.js` 108 passed 0 failed, and reproduced live in a real browser (Playwright/Chromium) typing
the exact sentence above into the Journal box at both 1600 and 390 pixels wide, screenshotted, the warning
line present and reading correctly both times.

**First steps, ordered:**
1. DONE (above). The claims gate.
2. A claim-type register: every public number and causal sentence tagged with one of the nine claim types
   and its source. Depends on step 1.
3. The "no sensation is also information" lines, into the release card. Waits on the release-carousel
   build (round QG) landing first, since it owns `ui/release.js`.

Everything in sections B through L below stays queued behind this chain until each requirement is DONE,
PARTIAL, BLOCKED or NOT IMPLEMENTED in the audits' own report format, not assumed finished because the
sections below say so.

**Queued behind this chain, round QK, his own words: "Add this to our plan after our priority build."**
A timeline scrubber under Play: a thin slider, kept deliberately short so it never crowds the hero image,
that scrubs back through a person's own history and redraws SQ and CQ as they were at that point, to see
progress over time. His own placement call: bottom of the screen, small, or folded into a collapsible
footer menu rather than a fixed strip, so it costs no height until opened. Needs its own historical data:
telemetry/analytics has to start capturing a time series of SQ and CQ (and whatever else the scrubber
reads) per person, which does not exist today and is a precondition, not a detail. Not started. Queued
after F16 and the rest of section 0 above, per his own order.

**In flight right now, round QF/QG, running in background, none merged yet:**
- Onboarding redesign in the real Field/Compass/Body aesthetic, replacing the stock-photo mockup he sent
  (branch `onboarding-real-skin`). Screenshots come to him before merge.
- The Tuned Awareness audit itself (above).
- The three-column layout: left for new input, centre the ritual, right the accountability tracker,
  merging the knowledge base and accountability tracker back into one page (branch `flow-three-column`).
  Screenshots come to him before merge.
- The release screen carousel, round QG: Horizon kept as the base, rebuilt as a vertical carousel (centre
  item readable, one above/below dimmed, the ring past those nearly black), the "Release your selections"
  heading replaced by the carousel's own story/chakra count, the short per-item prompt line split from the
  longer release script, a heavy flag per item, the two-minute cooldown moved onto this screen, and a new
  closing line naming the count released and reframed before the cooldown. Not yet dispatched as of this
  write; next action this session.

**TDD 5, the Funnel/Onboarding/Tutorial Creative TDD** (`reviews/ATUNED-Funnel-Onboarding-Tutorial-Creative-TDD.md`, round QX, 3 October). A full first-use journey handoff: funnel beats, a public Signal Test and Baseline reveal before any score, a progressive Reading, Story/Mirror/Test/Correct, Release/Reframe/Verify, a Signal Re-test, Ritual Detected, account handoff, a Tutorial debrief, an About page outline, FAQ copy, and a full frontend/backend data contract. Heavily overlaps TDD 4 above (same signal test, baseline, CQ direction, gap, ritual-detection ground) - audited with instructions to cite TDD 4's verdicts rather than re-grade them, and to end with an ordered, sized punch list for the funnel specifically, since his own round QX order is **release first (done, see below), then funnel to completion, everything else secondary.**

**The audit landed (round QX) and was checked line by line against the real files, round QY, before anything in it was trusted.** 76 requirements graded 15 EXISTS / 30 PARTIAL / 11 MISSING / 19 CONFLICT / 1 UNVERIFIED. Of the eight live bugs it found in passing, seven held up on direct read and one did not:

- Confirmed and **fixed tonight, round QY** (direct edits, verified on the rebuilt tree: voice check 0 stops, claims gate 105/0, `tests/engine.js` 4459/0): the 50-vs-ruled-25 referral number (`funnel/buy.html`), the self-contradicting tier sentence beside the sight-by-tier table (`buy.html`), the count-against-a-total on the quiz page (`funnel/quiz.html:519`, a direct hit on the rule stated three times in `BIBLE.md`), the reframe example that broke his own "I know that I am" register (`funnel/index.html:618`), two live word-sets for one mirror-confirm concept (`index.html:570-572` now matches `ui/onboard.js`'s own Yes/Not me/Correct it), and "I'm not sure" vs the app's own "Not sure."
- Confirmed, **not yet fixed, real merge work**: `storyboard-faq-nav` now conflicts with dev, checked directly with `git merge-tree` (8 real conflicting hunks, not a guess), see the ordered list below.
- **Checked and found wrong, so dropped rather than carried forward silently**: the claim that `about.html`'s Ceiling/Drag copy describes a model "the engine no longer computes." `engine/compute.js:536-559` and `engine/export.js:91-113` show it is still computed, live, under the renamed `exCeiling`/`exHeadroom`, and the rename comment quotes him directly on exactly this framing ("the ceiling is the person and the reading is the drag against it"). `about.html` is his own words back. Full detail in `TASKS.md` round QY.

**The funnel-completion punch list, in order, corrected for the dropped item above:**
1. ~~Small copy fixes~~ **DONE, round QY** (six items, listed above).
2. ~~Merge `storyboard-faq-nav` onto the rebuilt landing page.~~ **DONE, round QY.** Merge commit `8a95bee`, pushed. The FAQ page, the nav audit (Tiers off the header, onto every footer) and the Value Felt capture feature all landed. Independently re-verified on a fresh worktree checked out from the pushed commit: build, host-free check, `tests/engine.js` (4459/0), `tests/valuefelt.js` (7/0), the voice checker, and `tools/equiv.py` (exactly 25 new declarations, nothing removed or changed) all matched the merging agent's claims exactly. One open visible change for him to confirm: the landing page header no longer shows Tiers, matching the storyboard TDD's own rule and every other funnel page; a one-line revert at `funnel/index.html:357` if he wants it back.
3. ~~The URL-fragment record handoff (`#r=...`).~~ **DONE, round QZ.** Commit `cea53fb`, live on the dev branch (this item IS the funnel, so it was not held back like the Ritual/tutorial rebuilds). The quiz offers "Open the app with my record," a link carrying the gzipped, base64 reading after `#`, never sent to any server; the app reads it through the exact same `pImport`/`validateProfile` boundary the paste box uses, nothing looser. Independently re-verified: build, host-free check, `tests/engine.js` (4483/0), `tools/equiv.py` (13 new declarations, nothing removed) and `tests/recordlink.js` (60/0, ten named refusals) all matched the building agent's claims exactly; a screenshot confirmed the app opening with the record loaded. A real drift the build surfaced (a reload always reopened a blank profile, not what was just imported) was fixed the same round, commit `bd20aee`, with its own verification (a direct Playwright reload round trip, plus a clean `recordlink.js` re-run).
4. ~~A pre-quiz notice/signal beat.~~ **DONE, round QZ.** Commits `eaf9188`/`7f30319`, live on the dev branch. A new `notice` state asks where in the body a hard moment shows up and what happens there, then says it back without claiming the body map proves anything, holding the TDD's own "the user's report is primary evidence, the mapping is a model" distinction exactly. Nothing reported is saved, scored or mapped to a seat. Independently re-verified: build (107/0), `tests/engine.js` (4483/0, no engine file touched), the voice checker, `tests/funnel.js` (238/0, up from 224) and `tests/recordlink.js` (60/0, unregressed) all matched exactly; screenshots confirmed the copy on screen verbatim.
5. ~~Yes/Not-me on funnel story cards.~~ **DONE, round QZ.** Commit `29f1609`, live on the dev branch. Per-address, not per-card (the real app's own grain), measured against the house choice-floor rather than guessed. Nothing from the story reaches the saved record either way, checked directly; carrying the marks forward stays tied to F16 above and is his call, not built here. Independently re-verified: build, host-free check, `tests/engine.js` (4483/0, unchanged), `tests/funnel.js` (280/0, up from 238) and `tests/recordlink.js` (60/0) all matched exactly; screenshots confirmed the folded/opened card states and the record-privacy line.
6. ~~The five-layer progressive reading reveal.~~ **DONE, round QZ.** Commit `54379fb`, live on the dev branch. Five framing lines, each adding the next section of the existing reading rather than showing it all at once; "Show the whole reading" always available, nobody trapped behind the sequence. Layer 5 uses `relQueueOf(8)` (`engine/compute.js`), the real function the app's own Release button calls, read and confirmed directly, a materially better choice than the brief's own fallback suggestion. Independently re-verified: build (107/0), `tests/engine.js` (4483/0, unchanged), `tests/funnel.js` (382/0, up from 280) and `tests/recordlink.js` (60/0) all matched exactly; screenshots confirmed the staged reveal genuinely stages rather than just labels the old layout.
7. ~~The cascade-animation completion.~~ **DONE, round QZ. The funnel-completion punch list is now complete, all 7 items.** Commit `7343915`, live on the dev branch. A new beat between the mirror and network frames, reusing the Field's own canvas, pulse rule and thread-drawing rather than inventing a new visual language, showing a response propagate and speed up over four passes until it runs with nothing new triggering it, holding the TDD's own "not a biomedical law" instruction in print. Independently re-verified: build (107/0, the claims gate specifically meaningful here given the cause-and-effect subject matter), `tests/engine.js` (4483/0, unchanged), `tests/funnel.js` (432/0, up from 382) all matched exactly; the frame's placement confirmed directly in the DOM; screenshots confirmed the spark entering on pass 1 and the full straight path on pass 4.

**Release screen: DONE, merged round QX.** `release-simplify` landed at `abd1fb9`. The "that I am" fix, seat-colour lines, and the round QR simplification pass are all in. `tests/engine.js` 4459/0, `tests/release-screen.js` 145/0, both re-verified on the merged tree.

**The Ritual calendar rebuild (round QW spec): DONE and fully verified, held unmerged, same reasoning as the tutorial rebuild below.** `ritual-calendar` (`fc33b5b`): a real calendar Thirty day loop, three real actions on Suggested cards (Add to daily practice/Save for later/Dismiss, no invented success rate), affirmations and challenges, a Goals centre column (Today/This week/This month) and a Success-over-time view across his ten named spans. Independently re-verified on a fresh worktree, number for number: `tests/engine.js` 4459/0, `tests/flowtools.js` 135/0 on the new build and 101/10 on the branch's own pre-change base (known-bad-case reproduced via `ATUNED_FILE`, matching exactly). Screenshots confirmed the calendar grid, the three actions, and the Goals tabs directly. Real costs named rather than hidden: cognitive load up slightly (84 to 86 on the first desktop screen), a second, not-yet-folded calendar now sits beside the new one (named as the next cut, not built), saved/dismissed state doesn't travel with an export yet (a schema call, his). Full detail in `TASKS.md`.

**Release done, funnel to completion done. His own round QX gate is now open, round QZ.** Everything below this line was held explicitly behind that order and is no longer secondary; it is next, in roughly the order it was queued:
1. ~~Merge the `tutorial-cinematic` rebuild.~~ **DONE.** Merge commit `aef23f5`, pushed. Two real conflicts (`ui/onboard.js`, both sides kept; `source.html`, rebuilt). Independently re-verified: build (107/0), host-free (729), `tests/engine.js` (4483/0, unchanged), `tests/onboarding2.js` (208/0) all matched exactly. Still owed before it goes to him: real screenshots at both widths, and a repack of `atuned-packed.html`.
   ~~Merge the `ritual-calendar` rebuild.~~ **DONE.** Merge commit `3f48da8`, pushed. One real conflict (`source.html`, rebuilt); a push race handled correctly (discarded a rejected local commit and redid the merge on the new tip rather than force-pushing). Independently re-verified: build (107/0), host-free (729), `tests/engine.js` (4483/0, unchanged), `tests/flowtools.js` (135/0) all matched exactly. Screenshots and a repack still owed, queued with the tutorial's.
2. ~~The sniffer fuzzy-matching fix.~~ **DONE, round QZ.** Commit `5830660`, live on the dev branch. His words: "I'm able to talk about painful situations and the sniffer's not picking up because the sniffer is too specific... it needs to be fuzzier." Before touching anything, the real recall gap was re-measured (the 91 percent figure above was wrong, see the correction there); the true baseline was 64.7 percent of painful lines unread. Three new lexicon passes (synonyms, negated opposites only, fixed family-loss phrases) plus an apostrophe-stripping fix (`I can't cope` was silently unreadable before this, a separate real bug) bring that to 7.6 percent unread, with 0 false positives on a held-out quiet-line set that includes deliberate trap words ("stuck in traffic," "bitter coffee"). Suicide is explicitly excluded from the synonym table by name, with the reason recorded in code, so a person writing about their own thoughts of it reads as itself and not as grief. Independently re-verified: build (107/0), host-free (739 exports), `tests/engine.js` (4564/0), `tools/equiv.py` (exactly the declarations claimed, nothing else) all matched exactly; nine real sentences spot-checked directly against the rebuilt engine confirmed the claimed matches and the claimed silences. Left open, named rather than fixed: negation still isn't read ("I'm not worried" lights as if worried), which the wider vocabulary makes more visible, not less true before this change.
3. **A right-hand info-area carousel**, cycling short snippets (behavior, identity, "who you are") from the person's own summary, replaced by whatever is selected, interruptible. His own words: "I'm not certain how I feel about that" - a real idea, explicitly not a committed spec, so this one may need a question to him before being built rather than guessed.
4. **A two-way chat mode for Source AI** ("make source a socially chat interactive," "add a button where I can just have a conversation back and forth"), visually in the Field's own living language rather than a plain text box ("make it look like the soul," read against the house rule against a second visual language).

## A. Done and pushed (latest build v1161, commit 8df2ce2, sent to him as atuned.html)

Full list in `PLAN-HISTORY.md`. This round: all gates green on a quiet machine; welcome
pop-up after paying; Guest label and developer options lower right; End button on the
release opening screens; his recorded opening voice saved (`audio/`); API setup on one page.
THREE REVIEWS FINISHED as documents (no product code changed by them): the skin (`REVIEW-skin/`),
the onboarding (`REVIEW-onboarding/`, tally and rulings in `TALLY.md`), the six-area
architecture (`REVIEW-arch/`, tally and slice table in `TALLY.md` and section K).

## B. In flight right now (2 October, night)

| Work | State |
|---|---|
| Copy walk (J13): every screen, no percent or zero verdicts | running |
| Sound silent, sound switch writing the profile, bottom log, X and End on protocols (J2) | running |
| MVP gap analysis with the Practitioner layer (`MVP-GAP-2.md`) | running |
| Onboarding v3 mockup: feel and flow, twelve principles of animation (his round PP) | running |
| Unpack every symbol (blueprint card, Jesus line, signs), gloss table and gate | running |
| Intake: Jungian archetypes, nine emotional axes, six action axes, stacked | running |
| Flow: New ritual to the right menu, Accountability its own tool set, TDD rules | running |
| Mockups: reading display, what it drives, whole summary, analytics above the fold, Practitioner elevated | running |
| Mockups: the Journal page and the Avatar page | running |

Done and pushed this round: cover (white dots, moving rings, symmetry), teacher panel (J14), example profiles by tier (J12), font specimens (his pick: Onest), `tools/stripe-setup.js` and the Stripe steps for a nine year old.

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
| J12 | Example profiles by coherence tier: every existing worked example checked and fixed, the profile menu sorted by tier, and three NEW profiles per tier across the ten bands (Collapsed to Mastery), each a different person, spread from minimum to medium to maximum and the steps between, so a range exists to test every surface. If he meant paid tiers instead, tag by plan afterwards | `engine/data/people.js`, `ui/panels.js` picker, `tests/engine.js` counts | J3 (same picker) | M |
| J13 | COPY, now, first: no percent, zero or "of ten" verdicts anywhere. The unread Field rail ("Carrying, Filled in, Heaviest, Most shut") becomes dashes and one sentence; every surface walked against the voice rules including tooltips and info lines; evidence file `COPY-VERIFY.md` with counts; fixes land in data files and strings; QA independently re-checks. Supersedes J7's place at the end | many files, strings only | nothing | M |
| J14 | Compass, click a teacher: the right panel shows the behaviour complex, both behaviours (what is released, what is installed) as short behaviour lists with Add to ritual; no biography, no percent. Each teacher ships with a STARTER recipe set (a few behaviours released, a few installed, a few rituals; marked first draft, he refines them). DESIGN-teachers.md section 3, the recipe tie in section 5 | `ui/cone.js`, `ui/ritual.js` tie, `engine/data/` teacher rows | nothing | L |
| J1 | Onboarding and tutorial: review, auto slider mockup to him, then build | `ui/onboard.js`, `ui/tutorial.js`, `.ob-*` css, release opening | review pass 3 and his pick | L |
| J2 | Small shell bugs: sound on but silent; sound off prints "Nothing saved on a worked example" (the sound switch must be a device setting, not a profile write); status and errors move to a bottom log, shown 3 seconds unless held open; protocol screen gets an X before running and an End on the run | `ui/component.js` (status), `ui/sound.js`, `ui/release.js`, `shell/head.html` | nothing | M |
| J3 | Profile menu: examples sorted by tier; the app loads on the profile he left on; "Custom, new" lets him enter his own information and creates a profile; the active profile is remembered | `ui/panels.js`, `ui/ui.js`, store | J2 (same files) | M |
| J4 | Field page, summary first: macro field down to the fetters at the top, a link to the Summary page; "By weight" and "By assemblage point" become collapsible sections under it; the "Carrying, Filled in, Heaviest, Most shut" block is explained or cut; the energetic summary rebuilt to the rules and checked for accuracy | right rail in `ui/ui.js`, `ui/summary.js`, `ui/imprints.js` | J3 | L |
| J5 | Masks by tier in the SIGHT table and the Character page: provisional reading of his dictation, tier one sees Child and Preteen; tier two adds Ideological and Professional; tier three adds Teen and Adult (all six); tier four all. He said "limiter", which is not a mask in the data (it is a sniffer idea), so Professional stands in until he says | `engine/plan.js`, `ui/character.js`, `ui/lock.js`, `tests/engine.js` | nothing | S |
| J6 | Flow menu becomes mini routines, set up from the Ritual builder, built from the lineup in his reading | `ui/ritual*.js`, recipe engine | recipe engine merge | L |
| J7 | (merged into J13, now first) Copy verification: the narrative seat walks the whole site, every tooltip and info line, against the voice rules; QA independently re-checks; evidence file `COPY-VERIFY.md` with counts; fixes land in data files and strings | many files; runs LAST, after J2 to J5 merge | J2 to J5 | M |
| J8 | Two defects the onboarding review found: (a) the gift is not honoured in code: he ruled the whole reading is visible while the gift lasts, but `planSight` ignores the gift, so a new person sees no saboteurs (measured: `planSees(null,'sab')` is false); (b) "Unlock all sight" sits on the real login screen for any stranger. He asked for developer options lower right, so it stays for him; before any public release it must hide behind `?dev=1` | `engine/plan.js`, `ui/login.js` | nothing | S |
| K | The six-area architecture: reviewed three times, cut into slices P01 to P23 in section K below | `REVIEW-arch/` | see section K | L |

**Round PK, what is already clear.** The proposal quotes "Sight is not for sale, new
ground is". He reversed that on 1 October: the tier table now sells how far up the chain
a person may look, plus velocity. The entitlement design must follow the table. What
survives from the proposal: a downgrade never takes away ground already opened.

**Review notes (two reviews).** First review: the order puts the shell bugs (J2, J3)
before the Field rewrite (J4) because all three edit `ui.js` and `component.js`. Second
review: J7 runs last because it touches strings in every other block; J5 is tiny and
independent so it goes first; J1 stays at the top because he asked to review it while
the rest is built.

## K. The six-area architecture, as executable slices (round PK, three reviews)

Source: `REVIEW-arch/` (tally in `TALLY.md`, the single merged table in
`pass3/project-manager.md`). What it became, in his terms: not an orchestrator service but
"the reading rules" (one reader, one rule table); not a ledger store but "the trace" (a
derived view with six rows: Said, Heard, Maybe, Felt, Changed, Confirmed); not a 90 day state
machine but "where the loop is" (a derived read that orders ONE suggestion, never a gate,
never a day count); a safety screen before the story is read; privacy as a data table with a
gate; entitlements read off the SIGHT table.

| Wave | Slices (see the table file for goals, files, gates) | Size |
|---|---|---|
| 1, day one, parallel (cap four builders) | P01 re-measure; P02 typing floor (79 ms median now, must be 16); P03 record door (unknown keys carried, new id on import, delete seam); P04 truth sweep and voice gates (J9); P05 safety engine, self harm (J0); P12 one reading (J10 after); P06 server deploy | S to L |
| 2 | P05b safety kinds (private build only); P07 server hygiene; P08 privacy table; P09 care register and Help sheet; P19 land `journey.js` with `addrs` (it sits uncommitted in a worktree); P13 one rule table | S to M |
| 3 | P10 entitlement rules (includes J11); P11 gift and lock (J8); P14 the trace; P17 first writers; P09b kind cards | S to M |
| 4 | P15 claim row; P18a `loopRead` and Next; P16 Why chain; P20 side stores, forget, entry delete | M |
| 5 | P18b Next slot and rail (waits for J4); P21 encrypted export and restore drill; P22 data page and consent | M |
| 6 | P23 release candidate: every gate on the merged tree | M |
| Later | L1 ring and avatar from dated facts; L2 Confirmed ask; L3 sync; L4 practitioner grants; L5 trauma detection, locales, lead suite, signed lease, founding seats, crypto shredding, end to end encryption | |

Estimate: about 55 agent days of build, 67 with rework, 82 with the other blocks; 18 to 32
working days wall clock with four builders. Cut order if short: P16, then P22 to its table
gate, then P09b. Never cut P02, P03, P05, P09, P10, P21.
QA pass 3 added: 'private build only' needs a real mechanism, so `BUILD.sh --public` must fail while the safety table says unreviewed; the privacy gate needs a runtime `setItem` wrapper (a static grep misses the ritual and avatar keys); `tools/packcheck.js` stops a stale packed file recurring; the Field's 30 fps floor in `design.js` has no margin (it flaked at 29.8), use a median of three. New gates (`tests/perf.js`, `safety.js`, `journey.js`, `privacy.js`, `drill.js`) join the
pre-commit list in `CLAUDE.md` the day each lands, or they stay ungated as `funnel.js` did.
Public launch (not slices): clinician and counsel review of every cue list and the 988, 911
and SAMHSA lines; one timed real signup; the restore drill on a real iPhone; the owner reads
the gift end copy. Two owner actions: Stripe price ids and secrets, and booking that review.

## L. The skin, as a build order (round PH, three reviews)

Source: `REVIEW-skin/` (tally and the lead's rulings in `TALLY.md`). The shipped product
averages 53 to 55 across twelve disciplines; the proposal projects 62 on paper and the
coherence index reads 23 today (floor 40 for this round, 65 to ship). It waits on J13, J9, J5,
J3, J4 (same files), then: S1 token layer, type codemod and the coherence gate; S2 canvases read
tokens once per lighting; S3 stillness while unread, the 390 pill overlap, Compass on elapsed
time (six sites in `ui/cone.js`); S4 one MOTION clock; S5 the free pre-drawn figure; S6 the lock
mark inside P11; S7 names and Embody (Embody stays Knowledge); S8 the loop ring, unlit; S9 the
unread stage; S10 engine data changes. The funnel true-up (`funnel/buy.html`: 25 patterns, the
tier claim) goes first and is small. QA's measured quick fixes are in `REVIEW-skin/TALLY.md` (the invisible selected-tab count is already fixed in source, one line; the probe `REVIEW-skin/measure-coherence.js` becomes a gate).

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

## M. The mind stack: superego and limiters, round RA. Strategy only, nothing built

His own instruction closing the request: "review this, strategize where it needs to go in software. Add it to plan, but do not execute." Nothing below is built. This is where it touches, in his own order (UI, UX, schema, architecture, algorithms, the graph, the thing above the graph), with the real open calls named rather than guessed at.

**What he is actually asking for, in his words.** A layer sits between the ego and the archetypes: the superego, "the behaviors who are taught to you outside of you by an adult... generational, ancestral, parental. Patterns of perfectionism, justification, entitlement, obsession." Imposed, not learned. Separately, "limiters": "all the things that keep us from doing things... not performing well, not speaking well, not communicating well... we're dumb, we're not smart, I'm not as good as other people." Both need the sniffer to find them in a person's story, both need to show on the Field's left rail under the psychological grouping (kept apart from the existing psycho-spiritual/celestial/archetype grouping), and both need to feed the release queue.

**Corrected, round RA continued, after he pushed back: "Super ego and limiters are not new. These are layers that have been part of mechanics of being since day one. You can review that and validate that yourself."** He's right, and it goes further than the first pass of this section said. Read directly off `GLOSS` in `engine/data/kb.js`, word for word, three entries that were already authored before this round ever started:

- **Ego**: "The mind stuck to the body... The ego is the mask your character wears. It is your DQ, every SQ that is running, and every pattern and every kind of awareness that comes with living as a body, all added up."
- **Superego**: "The part of the mind that guards what you were told. It is made of the stories and rules an adult handed down to you. It sits on the surface and protects those beliefs. The ego goes deeper, because the ego lives in the body."
- **Archetype**: "One of 12 kinds of character you are born with... the side of you that was there before life taught you anything."

That is his mind stack, already written down, already in the layer order he just gave again: archetype (born with it, before anything was taught), ego (deeper, lives in the body, carries the saboteurs and fetters), superego (shallower, surface, what was handed down by an adult, "the ego goes deeper"). This is not a new idea to design and not a question for him to pick between two options. It settles the one thing the first draft of this section wrongly left open: **superego is not a relabeling of the 33 saboteurs.** The canon itself draws that line: saboteurs are fetters stored at body addresses, which the glossary places inside the ego ("the ego lives in the body"); superego is explicitly described as sitting on the surface, not at a body address, guarding what was taught rather than what was lived. So this is genuinely its own layer, exactly as he said, and the job is building the one piece of it that has never been wired into anything that runs: nothing today detects it, scores it, or shows it.

**Limiting belief is also already authored**, same file: "A tag that squeezes something big you lived through into a small label. Every time you say I am this, you make one." His "limiter" (not performing well, not speaking well, not as good as other people) is this mechanic pointed specifically at competence and performance labels, not a new mechanic.

**Where it touches, in his own order, now without the false fork.**
- **Schema.** A detected superego or limiter mention needs somewhere to record it as belonging to that layer rather than the ego/saboteur ladder, and, for superego specifically, the provenance phrase if the story names one ("my mother always said," "I was taught"). New field on whatever node carries a pattern, a schema change under the same rule as everything else that changes what a saved record promises to keep (`CLAUDE.md`'s schema v2 reservation, already his call per `WAITING-ON-YOU.md` item 17).
- **The sniffer, two distinct jobs, not one.** Superego detection is narrative/provenance language: a phrase naming an external, often generational source, attached to a charge word. Limiter detection is closer to work already done: round SB/NO already built exactly this shape for self-worth, confidence, self-respect, follow-through (`engine/lexicon.js`, the block starting around line 149, "the sniffer finds the limiter, his own job description"). His new limiter list is the same mechanic, extended with new phrases, the smaller and more concrete of the two builds. Superego's provenance-language detection (phrase plus attributed source) is the harder one, closer in shape to the family/fetter work than to a plain word match.
- **Algorithms, the graph, and the thing above the graph.** "The graph" is `engine/trace.js`: a superego or limiter pattern becomes a typed node the same way a saboteur does today, wired to the story that produced it, but typed as its own layer, not folded into the saboteur type. "The thing above the graph" is read here as the release queue, `relQueueOf` in `engine/compute.js`, the one existing surface that already groups detected patterns into a ranked, "key, release queue style" list and already feeds the release screen, exactly the shape he asked for.
- **UI/UX, the left rail.** `ui/railtiles.js` already carries an owner ruling (round OJ): "the spiritual, the celestial section and the archetype section." That is the psycho-spiritual component he wants kept separate from. The new psychological component (superego, limiters) is a new, third grouping on the same rail, not a merge into it, matching his instruction to keep them apart. Still open, and genuinely his to pick since the canon doesn't answer it: its own labelled section, or a new tile inside the existing archetype section.

**The 6,000 recipes: direct answer, no.** Searched the full repository for anything at that scale; nothing exists. `engine/data/teachers_recipes.js` is a real but unrelated, much smaller thing (14 poles for the Compass teachers), not his limiting-belief library. The honest state is: the content does not exist in this product yet, in any form, at any size.

**A data strategy for ingesting it without it loading into every day-one journey**, since he named the constraint himself ("that's not going to be loaded up for every... it cannot infect their journey," but "I want to use it for the demo and for the profiles... and parts of it as giveaways"):
  - Store the full ~6,000 as its own data table, not merged into the sniffer's always-loaded lexicon. The sniffer's existing lexicon is small by design and ships inside the one HTML file; 6,000 entries at even modest size would meaningfully grow a file that is already measured in megabytes (`CLAUDE.md`'s own packing section), so this cannot simply become a new array next to `GLOSS`.
  - Gate access by context, not by person: a day-one stranger's sniffer run never touches the table at all. A demo profile or a built-in example person can load a hand-picked slice of it directly, no gate needed, since nothing about a demo profile is a real person's data. A themed giveaway (anxiety, overwhelm) is a named, curated subset, served as its own small bundled set, the same shape the existing referral-grant pattern already uses ("Referral grant: 25 patterns," settled round PW) rather than a new mechanism.
  - The open question this strategy can't answer for him: whether the full 6,000 ever becomes reachable inside a real person's own ongoing journey (a paid tier, a practitioner-assigned set, search), or stays permanently confined to demo/giveaway use. That is a product and tier decision, not an engineering one.

**The consent question, not skippable.** `DECISIONS.md`, quoted directly in `DESIGN-pattern-signal.md`: pattern cues are not limiting beliefs, and learning them from a person's own writing needs his explicit ruling and its own consent line. "They need to look for the stories" asks the sniffer to detect superego/limiter patterns in exactly the free-text a person types, which is squarely what that ruling covers. Nothing here assumes his answer is yes; it's named as a decision this build can't start without.

**What I need from you, three things, not four. The fourth (new layer or relabeled saboteurs) is settled by the canon itself and dropped.**
1. On the left rail: its own third labelled section, or a new tile folded into the existing archetype section?
2. Does detecting superego/limiter patterns in a person's own story count as the kind of learning-from-writing `DECISIONS.md` already says needs its own consent line, or did you mean something narrower?
3. For the 6,000 recipes: besides demo profiles and themed giveaways, is there any day-one, real-person use you want reachable at launch, or does it stay demo/giveaway-only until a tier decision is made later?

## N. The Field's motion, five options to pick from, round RB. Proposed only, nothing built

His words: "is there a visual enhancement that we can do to the field animation just to like bring up its innovation and visual aesthetic." That is open, so nothing was built for it. Below are five, each under a day, each grounded in something `ui/wheel.js` already does, each carrying a reading rather than decorating one. Pick any number, in any order. Every one gives reduced motion the end state and nothing moving.

1. **A picked pattern rings like a plucked string.** Today a press on a pattern lifts its threads (brighter, wider) and nothing moves. Proposal: the press plucks them. Each thread shakes once and settles over 700ms, on the shape the jitter already uses (`jitOff`, two sines at 9 and 11Hz on the control point), with a decay. The new part is that the pitch is the thread's tension (`ten01`, susceptibility): a taut thread rings fast and short, a slack one slow and long, which is the Field's own law already written beside the pulses (speed as the root of tension). What it tells a person: which of their threads are tight, felt with the labels off. Cost: no new drawing, one damped term on threads already drawn each frame. Tradeoff: on a busy profile (Gordon, 120 threads) a pluck of the whole web is a lot of motion at once, so only the picked chain rings and the rest holds.

2. **A charge landing hits the ring.** Today a story's charge arrives and the address bars ease toward it (`n.disp` toward `n.sq` at 0.14 a frame) and the new heat trace swells, but nothing marks the moment of arrival. Proposal: when an address's charge rises (`hotTrack` already knows which ones, `frDir` above zero), a single arc ripple leaves that address outward along the ring, 420ms on the arrival curve, 1.5px, its seat colour, fading as it widens; the heat trace's lobe then fills in behind it. A release does the reverse: the ripple runs inward and the lobe drains. What it tells a person: where this entry landed, at the instant it landed. Cost: one arc per changed address for under half a second, and only on a change. Tradeoff: a story touching thirty addresses fires thirty ripples; they would be staggered by seat at the wheel's own 62ms, root to crown, so it reads as one wave and not as noise.

3. **The Field breathes at its Vitality.** The Character page's torus already oscillates by Vitality (`charOscillation` in `engine/charfield.js`: a stronger, quicker breath for more vitality, a shallow slow one for less). The Field does not. Proposal: the shell's radius breathes by the same function, at most half a percent, so a vital person's Field visibly breathes and a depleted one barely does, and the two pages breathe at the same rate for the same person. What it tells a person: how much life is in the field, at rest, with nothing pressed. Cost: one multiplier on a radius already computed each frame. Tradeoff: every label inside the ring rides the shell, so the collide gate has to be re-run at both ends of the breath, and half a percent is the ceiling for that reason.

4. **What a release clears goes to the core.** Today a release empties an address and the bar shrinks. Proposal: the cleared charge leaves as a few motes (one per point cleared, at most twelve) that drift from the address inward to the core over 1.2s on an arc, not a straight line, and the core's halo (`solCore`, the glow it already draws off coherence) takes a short brighten as they arrive. What it tells a person: release turns into coherence, which is the loop he named (discover, play, flow, embody) drawn as physics. Cost: a dozen small dots for a second, only after a release. Tradeoff: it is the most "effect" of the five; it has to stay under the threads in brightness or it will read as a reward animation rather than a reading.

5. **The wash follows the heat.** This round made the heat trace sit where the charge is, but the wash behind everything (`drawAura`) still puts its four soft lobes in the four corners of the screen whatever the person carries. Proposal: the same four lobes, placed behind the wheel at the angles of the four heaviest seats, so the background glow and the traced heat agree about where the load is. What it tells a person: the room is lit from where they hurt. Cost: none new, the same four gradients painted at the same eighth scale, only their centres move. Tradeoff: off the Field (the Body page also stands on the wash) there is no wheel to place them by, so they keep the corners there.

Recommended first: 2 and 5 together. Both finish what the heat trace started, both are small, and neither adds anything that moves at rest.

## N2. Round RF, 3 October. His own dictation, sorted into four, one explicitly held

Full verbatim in `TASKS.md`. Priority stays onboarding, funnel, tutorial, by his own closing line; the four below queue behind that.

1. **A second, volumetric point-cloud rendering. Held, by his own words ("hold this for after the onboarding").** Not a replacement for the existing point cloud, a companion view of the same underlying data, read as one shape per person rather than a scatter: the cloud is already a volume, points already carry intensity and a chakra/frequency colour, and the canon already treats ego, shadow and the saboteur/devil reading as the same layer (round RA's mind-stack correction, same section above). The shape would be built from what a person's patterns summarize to, not a new computation. Not dispatched; queued for after onboarding/funnel/tutorial lands.
2. **Summary page, a UX simulation for least friction and most legibility.** His own license: "if you have to change stuff to change, feel free to change it." Scope: the whole page's flow, not a single element. Dispatched to the UX architect seat.
3. **A Punch-theme design ruling, recorded for whenever Punch is actually built, not a build order now.** CLAUDE.md already carries Punch as decided-but-not-built ("a third theme called Punch, where nothing is outlined and everything is solid"). His addition: opposing-force pairs (today's Benign/Malignant-style bars) become yin/yang bars under this theme specifically, each pole carrying a symbolic figure (he named Buddha for one side; the other name did not transcribe cleanly and is flagged rather than guessed at, his to confirm when Punch work starts), the "winning" state read as approaching 100% one pole, the boundary between the two poles data-driven, and that boundary's own width equal to the bar's existing oscillation width (the same swing mechanic the Field-rail round above already built for Coherence/Decoherence). Written down here so it isn't lost before Punch's own build order comes up; nothing to gate or dispatch yet.
4. **A fresh copy sweep against the standing rules, with his own live example.** He read, on the Compass's reading paragraph: "you read 62, above the oscillating band" and "your integrity is 6.2" and "integrity is the hull," none of the three explained in place. Checked directly against `ui/cone.js` (`coneRead`, around line 2637): the hull metaphor is in fact unpacked one sentence later ("a hole in it means the ship takes on water, and everything above the waterline stops mattering"), and the function's own comments document two earlier scrub passes against exactly this kind of complaint (dual untagged scales, repeated numbers). So the standing rule is being followed in letter in this one spot already; what his complaint actually lands on is that the *band* reading ("above the oscillating band") doesn't say what to do about it, which is the deeper version of "unpack every symbol" CLAUDE.md already rules on. This is not a new rule, it's a request to sweep the whole site again and find every place the rule is still being missed, this one included. Dispatched to the narrative/copy seat, scoped to the whole shipped app, not just this one paragraph.

## O. Round RH, 3 October. The Signal/Story/Pattern/Release/Reframe TDD, slide by slide against the funnel

Full verbatim in `TASKS.md`. His own document: `ATUNED-Funnel-Signal-Story-Pattern-Release-Reframe-TDD-v1.md`, repo root. This section exists because the two agents dispatched to review and build against it both died mid-task to a model rate limit before writing their own mapping table and classification report; their real code (verified, tested, committed, see `TASKS.md`) survived, but the written plan they were asked to leave behind did not. Written here directly, from having read the document in full and the real code myself.

**Built, branch `claude/funnel-signal-test`, independently verified (538/0 on `tests/funnel.js`, voice checker clean, screenshots looked at directly):**
- Slide 03, the Signal Test (section 8). Sits between `recognize` and `mirror` on the live funnel, exactly his ordering. Every question his, in his order; three lines named and changed in place (the sit-back instruction, lower-case yes/no, "journey" cut); his own data contract (section 9) held field for field, two named additions (a feeling field his contract text asks for but never lists, and a flag so a typed answer is always said back in quotation marks); nothing written to storage, nothing scored, nothing mapped to a seat; the body point only lights for a place actually picked.

**A real backend gap found and partly closed, branch `claude/tdd-funnel-audit-tomas`, independently verified (276/0 on `tests/trace.js`, 4574/0 on `tests/engine.js`):**
- The onboarding mirror's "Yes" (`ob.yes`, already written by `ui/onboard.js`) was never read by the Trace Graph. Now it is, as `user_confirmed` provenance (`TRACE_ALG` bumped to 2). "Not me" is deliberately left unread, since the graph has no provenance for a refusal and what a declined pattern should do to the reading is task #82's call (F16), not something to guess at here.
- Four glossary entries overstated what the instrument measures (allostatic load, drag, hardened mask, resistance all implied real nerve/muscle/inflammation measurement); each now says plainly that the instrument works from what a person enters, matching this same document's own claims boundary (section 61).

**Everything else in the document, sized against what's real, not yet built:**

| Slide / section | What it needs | Size | Depends on |
|---|---|---|---|
| Mirror, Correction (slides 5-6) | A real confirm/correct interaction on a candidate interpretation, writing a status (PROPOSED/CONFIRMED/CORRECTED) somewhere durable | Medium-large | The Hypothesis Contract question below; today's `mirror` frame is a passive reveal, not an interactive one |
| Story Imprint, Repetition (slides 6-7) | Visual only, reusing the Field's existing node/sine-wave grammar the Signal Test just proved out | Small | Nothing; buildable now |
| Intention Meets Resistance, Saboteur Formation (slides 8-9) | A real two-path (intention vs. resistance) animation, and a named example (the Negotiator) demonstrated before labelled | Medium | Nothing structurally new; mostly visual, some copy needing the voice checker's pass |
| Pattern Network, Resistance and Body Address (slides 10-11) | Reuses the existing Flow/Body heat-map and the engine's own address data | Small-medium | Real profile data already exists; mostly a new view, not new computation |
| Interference, Accumulated Character (slides 13-14) | Visual escalation of the above | Small | Same as above |
| Coherence Heat Map, CQ/Gap language (slides 15, 31) | Already collides with two standing open questions (`WAITING-ON-YOU.md` item 19, the CQ band-naming and "gap" collision); do not build ahead of that answer | Blocked | His ruling, already asked |
| Release Transition, Release Interaction (slides 16-17) | The product already has a release flow (`ui/release.js`); this slide asks for the funnel's own version of it, pre-account, which is a real new build: freezing a baseline, animating a cluster down, without a real pattern record to release from yet | Large | The Hypothesis/Pattern Contract question below, since there is no confirmed pattern to release from a funnel visitor who has no profile yet |
| Reframe (slides 17-18) | A real text intake that mirrors the person's own words back, no new mechanism, straightforward once Release exists | Medium | Release above |
| Verification (slide 19) | Returns to the Signal Test's own data; buildable right after it without the backend, since this is just "ask the same questions again and show them side by side," which the Signal Test's own code already does for yes vs. no | Small | The Signal Test (built) |
| Ritual Detection, Account Handoff (slides 20, 44) | Needs the product's real account/sign-in seam (`CLAUDE.md`'s own "fetching a record at sign in," not yet built) to actually persist a ritual past the funnel | Large | The account fork itself, a standing, larger, his-call item |
| Story Sniffer structured extraction (section 11) | The existing sniffer already extracts seat/charge from free text; this asks for a fuller structured breakdown (event, belief, meaning, intention, contradiction). Real extension, not a rebuild | Medium | Nothing blocking; could start independently |
| Signal Data Contract, Hypothesis Contract, Pattern Contract, Evidence Architecture (sections 9, 51-53) | **The single biggest open question in the whole document.** `engine/practice.js` already has a real `evidence_ids` chain and `engine/trace.js` already has typed nodes; neither carries a `status` field cycling PROPOSED/TESTED/CONFIRMED/CORRECTED/REJECTED, which this document's whole Mirror/Release/Reframe loop assumes exists. Building it means either extending `trace.js`'s edge model (schema risk, his call per the standing schema-v2 reservation) or accepting that this loop, for now, lives only in a funnel visitor's own browser memory the way the Signal Test does, with no cross-session Hypothesis status until an account exists. That choice gates nearly everything in the "not yet built" half of this table above it, and is the one thing worth his ruling before more of this gets built. | — | His call |

**Recommendation, plain: build Reframe and Verification next (both small, both sit directly downstream of the Signal Test that's already live), and get his ruling on the Hypothesis Contract question before touching Mirror/Correction, Release or Ritual Detection, since all three assume a status field that does not exist yet and building around that gap twice (once pre-account, once for real) would be wasted work.**

**Added, round RI, a real requirement for whoever continues this build.** His own words: "we want to invite the person. As they tour, one of the first things they do is stop at intake. And fill that in as much as possible. It's self-identified, and then the weights adjust it dynamically." Read as: somewhere early in the onboarding tour, alongside or right after the Signal Test, invite the person to open the existing Intake page and answer as many of its questions as they're willing to, framed as self-identification rather than a test with a pass mark; the existing engine already adjusts weights dynamically as Intake answers come in (that part needs no new build, it's how Intake already works), the new piece is purely the tour inviting a stop there at all, this early, with an honest partial-completion state rather than an all-or-nothing gate. Slot this in beside Reframe/Verification in the next round of funnel/onboarding build work, not after it.
