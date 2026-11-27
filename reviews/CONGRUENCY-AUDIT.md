# Congruency audit against the System Congruency MVP TDD

Read only. Nothing built, nothing merged. The TDD is
`reviews/ATUNED-System-Congruency-MVP-TDD.md`, all 2,292 lines, read in full:
sections 1 to 31, the Information Flow Congruency Sweep, and the second AI
Handshake. This follows its section 25 steps 1 to 5 and stops there. Steps 6
to 8 (build, regression, status) are the next dispatch.

Every grade below cites a file, a function or a line, or a measurement made
for this audit. "Measured" means a probe was run against the committed build
in real Chromium or against the committed `engine.js` in node, not that a
comment or a document said so. Line numbers are at the canonical commit below.

Grades are the TDD's own: EXISTS, PARTIAL, MISSING, CONFLICT, UNVERIFIED.

---

## The verdict in one line

**One real story does not make it from Story to Field.** It reaches a real
mirror, a real yes, the real release engine and a real write, and then the
chain breaks in three places: there is no verification step at all; the
person's yes and no never reach the graph or the Field (the Field rail prints
"Confirmed 0" for an address they just confirmed); and on reload the whole
record is refused at the profile boundary and replaced, silently, with a blank
one, so the onboarding runs again from the start.

---

## Step 1. The canonical build

| | |
|---|---|
| Branch | `claude/laughing-feynman-xhfyj3` |
| Commit audited | `497a6a5` (2026-10-02, after the feedback tracker merge `6e3556c`, which touches `outbox.js`, `account.js`, `auth.js` and five lines of `ui.js`, none on the P0 chain) |
| Source file | `source.html`, 4,149,586 bytes, md5 `014480aaa39718e64febfc801ebcaeb1` |
| Build stamp in the file | `data-build="v1393 f9da608 2026-10-02 16:03"` on the root element |
| Schema version | `SCHEMA_V=2` (`engine/schema.js:13`) |
| Does the build match its sources | Yes, checked at `f9da608` (stamp `v1384 8867d42`): rebuilt from a clean `git archive` with `atuned_src/BUILD.sh`, compared with `tools/equiv.py`, 2,762 declarations each side, none added, none removed, no body changed, `engine.js` byte identical. Not repeated for `497a6a5` |
| Gates on the `f9da608` snapshot | `tests/engine.js` 4,550 passed, 0 failed. `tests/onboarding2.js` 104 passed, 0 failed, and it prints "J0 STILL OPEN" |

Two things about the stamp itself, both measured:

1. **The stamp names the commit before the code it carries.** `BUILD.sh:58-60`
   stamps `git rev-parse HEAD` at build time, and the build is committed
   afterwards. The audited `source.html` says `f9da608` but contains the
   feedback tracker merge `6e3556c`; `v1384` said `8867d42` and carried the
   practitioner merge `01bbafc`; `v1371` said `eb33e54` and contained
   `eef38c1`'s source. A stamp cannot currently be used to find
   the source that produced the file.
2. **The TDD cites `v1366 d486d3e 2026-10-02 14:33`.** That build is 27
   versions old. Everything below is graded on `v1393`.

The audit began at `8867d42` (stamp `v1371 eb33e54`). The branch moved four
times while it ran. The journey probe was re-run on `v1384` and again on
`v1393`, and the results for the P0 chain did not change by a digit.

---

## Step 2. The real implementation of every stage

### 2.1 Story input and parsing

| Piece | Where | What it actually does |
|---|---|---|
| Story input, onboarding | `ui/onboard.js:232-237` (step 5), `obStoryDone` `:637-644` | Textarea, three word minimum, then `ST_TEXT=v; ST_PARSED=parseStory(v)`. Reads, writes nothing |
| Story input, Story tab | `ui/storyui.js:208-209` | `ST_PARSED=parseStory(ST_TEXT)` on every keystroke |
| The parser | `engine/sniff.js` `scanStory` `:372`, `parseStory` `:572`, `applyStory` `:744` | One parser. `applyStory` is the only function that mutates charge |
| The output contract above it | `sniffStory` `:1404` | axes with `because`, saboteurs with confidence, laws, gates, depth, `offer`, `gaps`. **Called from one place only, `ui/tutorial.js:219`, for display.** No live write path uses it |

**The TDD's section 6 claim, checked rather than accepted.** Section 6 says
the matcher is a fourteen word list (afraid, panicking, exhausted, snapped,
angry, mortified, criticised, grief, lonely, sad, interrupted, betrayed,
overthinking, pointless). That list exists, verbatim, at
`mockups/onboarding-v2/src/js/01-data.js:63`, labelled "the stub reading". It
is the mockup's, and it is not shipped. **CONFLICT between the TDD and the
code:** the shipped onboarding calls the real `parseStory`.

The real sniffer is more than a keyword detector and less than the intended
Story Sniffer:

- A lexicon of 281 entries (`LEX`, `engine/lexicon.js`, counted off the
  shipped engine), plus phrases, adjectives, degree words (`LEXMOD`) and
  place words (`SOMA_PLACE`), longest match first.
- It keeps word positions, scales by degree words, moves a sensation word to
  the nearest named place in its own clause (`:437-472`), and records a path
  through the body (`pathOf`, `:518`).
- **It knows whether the words named a feeling or whether it guessed.** Every
  imprint carries `inferred` and `stated` (`:636-658`). This is the most
  important evidence boundary in the codebase and it is real.
- What it does not do: it does not read negation (`sniff.js:726`, "the
  sniffer does not read negation"), it has no subject model (every hit lands
  on the writer), it produces no cause, no relationships and no story tag, and
  it carries no per-imprint uncertainty beyond the one boolean.

Measured on this audit's story (section 4): "cannot stop replaying it" put
four guesses at the Sacral seat, one of them **Hypersexuality**, and "chest is
tight" put **Martyrdom** at the Heart. Of thirteen imprints, one was named by
the words and twelve were the fallback's choice.

Grade for "story parsing per TDD section 6": **PARTIAL**. Structural
extraction exists for seat, intensity, named-or-inferred and path. `quality`,
`cause_experience`, `relationships`, `story_tag` and an uncertainty figure do
not.

### 2.2 Observation (TDD section 7)

There is no single Observation object. Its sub-parts exist, scattered, under
different names, and most of them are thrown away at commit:

| TDD field | Real name, if any | Where | Survives commit? |
|---|---|---|---|
| `id`, `sessionId` | none. An entry is keyed by its timestamp `t` | `storyui.js:413` | `t` yes |
| `source` | none. Onboarding, tutorial, Story tab and Avatar all write the same entry shape | | no |
| `userSaid.raw` | `entry.text` | `storyui.js:413` | yes |
| `userSaid.snippet` | `obQuote(OB.text)`, display only | `onboard.js:400` | no |
| `extracted.bodyLocation` | `parseStory().imprints[].node/band` | `sniff.js:653` | **no. Only the count `imprints` and seat totals `bands` are stored** (`storyui.js:413-414`) |
| `extracted.intensity` | `bands` (per seat totals), `imprints[].amt` | | `bands` yes, `amt` no |
| `extracted.possiblePattern` | `imprints[].fetter`, `sniffStory().offer` | | no |
| `extracted.quality/causeExperience/relationships/storyTag` | none | | |
| `hypothesis.statement` | none. The mirror composes sentences from the groups | `onboard.js:378-399` | no |
| `hypothesis.confidence` | `imprints[].inferred` (boolean). `sniffStory` saboteur `confidence` (not used on this path) | | no |
| `hypothesis.evidenceRefs` | `OB.read[].words`, the person's own words that put weight at a seat | `onboard.js:328-331` | no |
| `userVerification.status` | `entry.ob.yes`, `entry.ob.no` (node ids) | `onboard.js:664-665` | written, then **refused on reload** (section 2.6) |
| `userVerification.correction` | `entry.ob.fixes` (text) | `onboard.js:666` | same |
| `downstream.patternId/releaseId/verificationId` | none. A release is keyed by address, channel and line (`meter.unique`), with no link to any entry | `schema.js:1374` | |

What the record keeps of a story is its text, its timestamp, a count, seat
totals and the lexicon version (`ENT_KEYS`, `schema.js:788`). Everything else
is re-derived later by re-running `parseStory` under today's lexicon (the
trace graph, `trace.js:791-796`; the analytics preview, `storyui.js:1614`).

Grade: **MISSING** as a contract, **PARTIAL** as parts.

### 2.3 Mirror (TDD section 9)

**Onboarding's mirror, `obMirrorCard`, `ui/onboard.js:407-448`.**

| TDD requirement | Real | Grade |
|---|---|---|
| WHAT I SAID | "You said: ..." quoting the person (`:420`), the pick, feel and place taps said as taps (`:413-419`) | EXISTS |
| WHAT ATUNED NOTICED | Per seat: "Your word(s) X put weight here" (`:389`), or "Your words X named shame" when stated (`:386`) | EXISTS |
| WHAT ATUNED THINKS | Each address tagged "you named ..." or "a guess", "The engine's guess, from your Solar seat" (`:351-372`) | EXISTS, and better than the TDD asks: the guess is labelled per row |
| THAT'S IT / NOT QUITE / ADJUST | Per address **Yes** and **Not me** (`:367-368`), one **Correct it** opening a free text box and **Read my correction** (`:440-443`), then **Commit**. Measured control set: Yes, Not me, "3 more guesses at this seat", Correct it, Read my correction, Commit, Back | PARTIAL. Different shape (per address, not per reading) and arguably stronger; no single "That's it" |
| "Tell us what's off" | "Tell me what is off, in your own words." (`:441`) | EXISTS |
| The system reprocesses the correction | `obAdjust` `:455-464` runs `parseStory` on the correction and appends what it reads as new rows. It never revises or removes a row the story produced | PARTIAL |
| **Correction cannot be cosmetic: the observation changes** | Nothing is revised. Measured: correction "It is not about desire. It is about being embarrassed in front of people." read as nothing (`fixReads[0].groups` empty), all four story groups stayed exactly as they were | **CONFLICT** |
| **The hypothesis changes** | No hypothesis object exists to change | MISSING |
| **Downstream pattern selection uses the updated observation** | Yes for release: only Yes rows reach `onbMiniPlan` (`:507-509`, `:556`). Measured: release queue `[46]`, the one Yes | EXISTS for release |
| **Field/history must not retain the rejected interpretation as confirmed truth** | The charge still lands. `obCommit` calls `stCommit`, which calls `applyStory(ST_TEXT)` on the whole story (`storyui.js:396`), every imprint including the ones answered Not me. Measured: "Not me" on address 17 (Addiction), and after Commit address 17 held 1.58 and Apathy rose 2.1. The card says this honestly (`onboard.js:288-294`, `:444`), and names the fix as F16, an engine change the owner has not ruled on | **CONFLICT** |
| Rejected kept as historical evidence, marked rejected | `ob.no` holds it, but (a) the boundary refuses it on reload at this commit, and (b) nothing reads it: no engine file references `ob` (searched) | CONFLICT |

**Does the Story tab share this mirror?** No. The Story tab's Commit button is
wired straight to `stCommit` (`storyui.js:221-222`), which writes every
imprint's charge with no confirm, correct or reject step. The Day One tutorial
does the same (`tutorial.js:216`, commit on the first press, before any
reading is shown). The Avatar writes a story through its own copy of the
commit body (`avatarui.js:1792-1800`). Four doors write a story; one of them
asks first. **CONFLICT with section 7's "no duplicate interpretation" and
AT-12.**

### 2.4 Pattern and release (TDD sections 12 and 13)

**Is it one release engine?** Yes. This is the strongest part of the chain.

- Onboarding: Yes rows, `obYesSignal` (`onboard.js:507`), to `obMini` (`:497`),
  to `onbMiniPlan` (`engine/journey.js:85`), to `relPick(pl.addrs)`
  (`onboard.js:615-617`).
- Story tab: `stRelModel` (`storyui.js:1537`) picks, then `relPick` (`:1599`).
- Tutorial: `obMini(obImprints(TUT.parsed))` then `relPick` (`tutorial.js:233-235`).
- `relPick` (`ui/release.js:249`) is the one entry; nine other call sites use it
  (avatarui, drills twice, imprints, map, personas twice, ritual, summary).

Measured on the build: the onboarding release opened on exactly the plan's
address `[46]` and the plan's four keys `46:Llimit:0, 46:Rlimit:0,
46:Ltruth:0, 46:Rtruth:0`, ran through `relCoolDown` to the end, and wrote
`meter.unique` 4, `relLines` 2, `truthLines` 2, two dated firsts, and two
history snapshots.

Section 25 step 5, the release re-audit, item by item:

| Item | Real | Grade |
|---|---|---|
| Pattern source | Onboarding: the Yes rows only. Story tab: bank picks, else the three heaviest found by `sq`, else the three heaviest held anywhere (`storyui.js:1541-1544`). Different rules (section 3) | PARTIAL |
| Ordering | Onboarding: stated, then named, then inferred, then order read (`journey.js:93`, `:97`). Story tab: by load `sq`. Inside a run: `CHAN` left limit, right limit, left truth, right truth (`release.js:36`) | PARTIAL, two orders |
| Release language | `relLine` (`engine/data/cards.js:326`) to `addrLine`: printed card first, then the axes card, then the strict syntax `C3_STEM` = "I am letting go of believing, perceiving, thinking, behaving, acting, and feeling that I am ..." (`cards.js:50-52`). Passes rotate `REL_ENTRY` "I let go of / I give up / I forgive myself for" (`release.js:136`). No second generator anywhere in shipped code (searched `atuned_src` and `funnel`) | EXISTS |
| Channel logic | Six verbs in one statement (`C3_VERB`, `cards.js:50`), four meter channels side by phase. `ONB_CHANS` in `engine/data/onboarding.js:26` is a second copy of `CHAN`, held equal by `tests/onboarding2.js` | EXISTS, with a duplicate list |
| Timing | `REL_WORD_S`, `REL_GAP_S`, dose 25/50/100 (`release.js:121`), pace, two minute settle `REL_SETTLE_S=120` (`:109`) | EXISTS |
| Persistence | `meterRun` (`schema.js:1374`) writes `meter.unique`; `relCoolDown` adds `relLines`, `truthLines`, `meterHeavy`, `meterFirst`, `releaseWork`, the charge write `relWrite`, then `pSave(); pSnap()` (`release.js:922-966`). `RUN.log` (the per-address result) is never saved | PARTIAL. No release record, no release id, no link to the story or the mirror answer |
| Completion state | `RUN.done`, `RUN.phase='done'`, `ritRelDone` when not halted (`:974`). End charges only what was reached (`relReach`, `:778`) | EXISTS in session, not as a record |
| Verification handoff | None. The finished card offers Heavy, Done, Build a ritual. Measured card text contains no question about what changed | **MISSING** |

**The TDD's canonical release sentence conflicts with the product's.** Section
13 gives "I am releasing believing, thinking, feeling, behaving, acting...".
That is the mockup's line (`mockups/onboarding-v2/src/js/05-acts.js:76`). The
product's ruled sentence is "I am letting go of believing, perceiving,
thinking, behaving, acting, and feeling", six channels, ruled 26 September
(`cards.js:26-49`). **CONFLICT, TDD against code. The code holds the owner's
later ruling; the build should not change it on the TDD's wording.**

**Does the onboarding release write the field per address?** No, and this
matters for the Field grade. `relWrite` (`release.js:492-499`) lowers the
whole axis (`S.charge[n.cf]`) and raises its opposite. Every address on that
axis moves, not only the one released.

### 2.5 Verification (TDD section 15)

Searched the shipped sources for "what changed", "feel different", "see it
differently", "something moved", "nothing changed", "not sure" in a
verification sense. None exists on any release path. The nearest things:

- **Heavy marks.** During the run a person can mark a line heavy; the marks
  are kept by `meterHeavy` on `meter.heavy` (`release.js:931`). Positive only,
  per line, during the run, never "nothing changed" or "not sure".
- The cooling line "Notice which place answers." (`release.js:107`), a cue
  with no capture.
- **The engine already has the record shape, unwired.** `engine/practice.js`
  defines Evidence (`:240-245`: source, type, dimension, pattern_id, before,
  after, confidence, notes, context) and Outcome with
  `PR_OUT_ST=['improved','unchanged','worsened','unclear']` (`:54`), written
  through one pure door, `practiceDo` (`:841`), validated at the profile
  boundary (`schema.js:1127`), and already projected into the graph by
  `practiceTraceIntents`. **No real person's path calls `practiceDo`.** Its
  only caller is `engine/pracex.js:74`, which builds worked examples' histories
  in memory for the practitioner page and never saves them.

Grade: **MISSING.** F17 from tonight's funnel review is still open.

### 2.6 Persistence, and the `ob` boundary defect

**Measured, end to end, on the canonical build in Chromium:**

| Moment | `story.entries` | `meter.unique` | `ui.onboarded` |
|---|---|---|---|
| After Commit and release, in memory and in `localStorage` | 1 (with `ob`) | 4 | true |
| `validateProfile` on the stored record | refused: `story.entries[0] may not carry ob` | | |
| **After reload** | **0** | **0** | **false** |

On reload `pStore` (`schema.js:451-475`) refuses the whole record, keeps its
raw bytes on disk (`STORE_KEPT`), returns an empty list, and the boot
(`ui/ui.js:1694-1695`) calls `pNew('You')`. The status line says nothing,
because the boot reports only `storeUnread` (a store that did not parse,
`ui.js:1703`) and never `storeRefused`. The onboarding opens again. Raw on
disk afterwards: two records, the refused original and the new blank.

Cause: `obCommit` writes `ent.ob` (`onboard.js:664`); `ENT_KEYS`
(`schema.js:788`) does not name `ob`; `vKeys` refuses an undeclared key.

**The fix exists and is not merged.** Branch `onboarding-ob-boundary-fix`
(`089d095`, two commits ahead): `ENT_KEYS` gains `ob`, a `vEntryOb` validator
refuses bad positions and unknown node ids by name, the boot says when a
record was refused, and `tests/onboarding2.js` gains a reload. Run through the
same probe, that branch's build (`v1380 63c07dd`) **keeps the entry, the four
meter keys and `onboarded` across a reload, and the onboarding does not
replay.** Merging it is a precondition for everything in section 6.

The Story tab's own commits are not affected: `stCommit` writes only declared
keys.

**No gate caught this.** All 4,550 engine assertions and all 104 onboarding
assertions pass on the build that loses the record. None of them reloads after
onboarding. That is the TDD's "a screen looking correct is not proof" in
exactly its own terms.

### 2.7 Field and history (TDD section 16)

What the Field draws is a projection of nine numbers, not of the story's
addresses:

- `compute()` sets every address's held charge from its axis:
  `n.held = S.charge[n.cf] * n.susc * ...` (`engine/compute.js:236`). A story
  that charges Shame lights every Shame address in the body, weighted by
  susceptibility, whether or not the words reached it.
- The charge carries no provenance. A charge from a named word, from a guess,
  from a guess the person answered Not me to, and from a drag are the same
  number.
- **The Field is also an authoring surface.** Dragging on the Field writes the
  person's charge directly: `toYou(); S.charge[DRAG.cf]=clamp(DRAG.s+d,0,10);
  ... saveYou()` (`ui/ui.js:351`). So are the charge fields and the all-axes
  sliders (`ui/panels.js:62-77`).

**What merged tonight: the trace graph's "Your patterns" block is live on the
Field rail and Summary.** `trace-graph-ui` is not merged as a branch, but its
first commit `c63cbf5` arrived inside the practitioner analytics merge
(`01bbafc`, by way of `ce50182`): `engine/loop.js` (`loopRead`) and
`ui/loopread.js` (`loopPaint`, called from `ui/ui.js:1496`). Its later two
commits (`5efd22e`, `f32d442`) are not on the branch.

Measured, `loopRead` on a record carrying this audit's story, a Yes on
address 46 and a Not me on address 17, and the four release keys:

| | Result |
|---|---|
| Patterns listed | 13, every imprint the story produced |
| Confirmed | **0**, including address 46 the person said Yes to |
| Unanswered | 13, including address 17 the person said Not me to |
| Address 17's graph edge | `story supports pattern`, src `inferred` |
| Next | none |

`loop.js:19-30` says why, honestly: confirmed means a `user_confirmed` edge in
`p.trace`, and the Not me answer "is F16, unbuilt". Nothing writes a
`user_confirmed` edge for a real person. The mirror's answers live in
`entry.ob`, which neither `traceFromRecord` nor `loopRead` reads. **CONFLICT:
one concept, two representations, no bridge.**

`daily-summary-ui` (3 commits, `91afce7`) is not merged. Its engine half,
`engine/daily.js`, is on the branch: frozen days, an append only event list,
and per sentence responses `accurate, partly, not, why, context, correct`
(`daily.js:90-92`). Nothing on the branch draws or writes it.

History: `pSnap` pushes a snapshot of the axes and laws after a commit and
after a release (`schema.js:517-519`). Snapshots carry no link to the entry or
the release that caused them, and no algorithm stamp.

Grade for TDD section 16: **CONFLICT.**

### 2.8 Evidence ledger (TDD section 8)

`engine/journey.js` does not hold one. Its header says the journey record
(runs, a log, the gift counter, the integrity answers, the claim packet) is
F13 and "is not landed here, so nothing in this file reads or writes
p.journey" (`journey.js:6-14`). It holds `journeyRead` and `onbMiniPlan` only.

Of the twelve event types the TDD names:

| TDD event | Recorded today as | Durable? |
|---|---|---|
| USER_SAID | `entry.text`, `entry.t` | yes |
| SYSTEM_NOTICED | not stored (count and seat totals only) | no |
| SYSTEM_INFERRED | not stored (re-derived under today's lexicon) | no |
| USER_CONFIRMED | `entry.ob.yes` | refused on reload at this commit |
| USER_REJECTED | `entry.ob.no` | same |
| USER_CORRECTED | `entry.ob.fixes` | same |
| PATTERN_SELECTED | `OB.plan`, never stored (`onboard.js:98-100` says so on purpose) | no |
| INTERVENTION_STARTED | `relMark` sound and in-memory `RUN` | no |
| INTERVENTION_COMPLETED | `meter.unique`, `meter.firsts`, `relLines` | yes, unlinked |
| USER_EXPERIENCE | `meter.heavy` | yes, positive only |
| VERIFICATION | nothing | no |
| FIELD_UPDATED | `history[]` snapshot | yes, unlinked |

The only real append only event logs in the codebase are `p.practice.log`
(`PR_EVENTS`, `practice.js:61-68`, including `EVIDENCE_RECORDED` and
`OUTCOME_RECORDED`) and `p.summaries.events` (`daily.js`). Neither is written
on the story-to-release path.

Grade: **MISSING.**

### 2.9 The 100-pattern starter gift (TDD section 14)

The gift is a real, enforced, persisted allowance, not an animation:
`GIFT_N` is read off the plan table (`engine/plan.js:132`),
`planAllowance` counts it down off `meter.unique` (`plan.js:400-428`),
`meterBudget` caps every run to it (`schema.js:1368`), and `meter.giftAt`
records when it was spent (`schema.js:1333`).

What it is not: a pattern bank. It is a count of lines, any address. It
cannot answer "what 100 patterns", "why these", or "what ground produced the
selection". The ground the person picked lives only in `entry.ob.pick`, which
is refused on reload at this commit and read by nothing. The onboarding sheet
shows no gift counter at all; tracker #73 is the journey record work above.

Grade: **PARTIAL** (entitlement real; the StarterGift object and the ground
link are missing).

### 2.10 Feeling layer and starting point (TDD sections 10 and 11)

- Feel and Body steps exist (`onboard.js:213-224`), six feelings and seven
  places, each with Not sure. They are kept as taps and, by design, never
  interpreted (`onboard.js:40-44`). The Field does not respond to them; the
  sheet is a card over the app. Grade **PARTIAL**.
- The selected ground (`OB.pick`) does not reach interpretation or relevance:
  `parseStory` and `onbMiniPlan` never read it. Grade **MISSING** against
  section 11.

### 2.11 Tutorial (TDD section 18)

There is no "you just experienced ATUNED" step. The onboarding ends on the
bridge and the release card. `ui/tutorial.js` is a separate door that runs a
whole second story-to-release cycle, committing before any reading is shown
(`tutorial.js:207-219`). It is off by default (`DEV_PLAY_TUTORIAL=false`,
`ui/login.js:96`), so a default stranger meets onboarding only, and nothing
teaches Discover, Play, Flow, Embody afterwards. Grade **MISSING** for the
explanation, **CONFLICT** for the tutorial's shape against AT-09.

### 2.12 Safety (TDD section 20)

Stated plainly, from `TASKS.md` and `WAITING-ON-YOU.md`, not re-derived:
**J0 is open.** No distress detector runs on any live path. The onboarding
names the exact line a check belongs at, `obStoryDone` (`onboard.js:633-641`),
and the tutorial names `tutCommit`. A 292 line draft, `engine/distress.js`,
sits unverified on branch `f1-distress-detector` (`600e65e`), recovered after
the agent writing it was stopped by a content filter. The owner has three
options pending in `WAITING-ON-YOU.md` lines 23-25: A, ship a plain first
response now; B, name who writes the words first; C, keep the public link dark
until a clinician has reviewed them. Not answered.

One correction to the TDD: section 20 says "the existing static stop frame is
worth preserving". **It does not exist in the product.** The stop frame and
its 988 line live only in the mockup (`mockups/onboarding-v2/src/js/06-controls.js:174-176`).
Searched `atuned_src` and `funnel`: no 988, no stop frame.

Grade: **MISSING.**

### 2.13 Account and entitlements (section 25 step 2 list)

`ui/auth.js` is the one network seam; `validateProfile({v:SCHEMA_V, plan:...})`
checks the plan it fetches (`auth.js:367`). Entitlement is the allowance in
2.9. Not exercised in this audit: **UNVERIFIED.** The funnel quiz keeps its
own answers and story under its own key `atuned.quiz.v2`
(`funnel/quiz.html:302`), which the app never reads, so a story written in the
quiz does not arrive in the app (TDD section 19).

### 2.14 Build congruency (TDD section 24)

| Surface | Stamp | Same build? |
|---|---|---|
| `source.html` | `v1393 f9da608 2026-10-02 16:03` | canonical |
| `atuned-packed.html` (the handover file) | `v1349 8e05776 2026-10-02 11:22` | **No. 50 commits behind** |
| `funnel/index.html`, `quiz.html`, `about.html`, `buy.html` | none | cannot say |
| `funnel/dist/atuned-quiz.html` | none | Content equal: it inlines the current `engine.js` byte for byte (checked), but nothing on it says so |
| `atuned-slim.html` | `v1356 ae086cd` | not tracked by git; a local build product only |

No surface carries the schema version, a release engine version or an
observation contract version. Grade **CONFLICT.**

---

## Step 3. Duplicate truths

| # | Duplicate | Where | Mark |
|---|---|---|---|
| D1 | The mockup's fourteen word "stub" lexicon and its release sentence | `mockups/onboarding-v2/src/js/01-data.js:63-74`, `05-acts.js:76` | **DEPRECATE.** Not shipped, but the TDD was written from it. Label the mockup as non canonical so the next document is not |
| D2 | Story commit written by a second body | `ui/avatarui.js:1792-1800` repeats `stCommit`'s `applyStory`, `verpApply`, `leanApply`, `saveYou`, entry push | **MERGE** into `stCommit` |
| D3 | Four doors into a story, one with a mirror | Story tab `storyui.js:222`, tutorial `tutorial.js:216`, Avatar, onboarding | **MERGE**: one confirm step in front of `stCommit` |
| D4 | Negation read two ways | `srcNegated` (`engine/sourceai.js:94`) hears "I was not scared" as negated; `parseStory` charges it. The Story page shows the disagreement on purpose (`storyui.js:312-316`) | **MERGE**, owner's call: `parseStory`'s body is protected by "port, do not rebuild" |
| D5 | Body place to seat, two tables that disagree | Onboarding taps `OB_PLACES` (`onboard.js:86-89`) put **Stomach at Solar**; the engine's `SOMA_PLACE` seats the written word **stomach at sacral** (measured off the shipped engine). Pelvis and head are seated by the tap and unseated by the engine | **MERGE.** One table, and the owner rules stomach |
| D6 | Charge seat per feeling, mirrored | `PATHSEAT` (`sniff.js:496`) "mirrors CHG2SEAT" by hand | **MERGE**: derive from `CHG2SEAT` |
| D7 | Pattern selection, four rules | `onbMiniPlan` (stated, named, inferred); `stRelModel` (heaviest by `sq`); `loopRead().next` (first named, unworked, `loop.js:178`); `sniffOffer` (top three axes by shadow, display only) | **MERGE** to one ranking; `onbMiniPlan`'s order is the one that respects the evidence. `sniffOffer`: **UNKNOWN** until the Observation contract decides whether `offer` is its payload |
| D8 | Release channel list | `CHAN` (`release.js:36`) and `ONB_CHANS` (`data/onboarding.js:26`), held equal by a gate | **MERGE**: the host reads the engine's |
| D9 | Release sentence | One generator, `relLine`/`addrLine`/`C3_STEM`, plus `REL_ENTRY` passes | **KEEP** |
| D10 | Confirmation, three vocabularies and no bridge | `entry.ob.yes/no`; `p.trace` edges `user_confirmed` via `TRACE_PROMOTE` (`trace.js:211`); `practice` `confirm` act (`practice.js:623`); `daily` responses `accurate/partly/not/correct` (`daily.js:90`) | **MERGE.** One confirmation record. The practice `confirm` act already keeps what it was in `was` and stamps `approved_by` |
| D11 | Ritual history in three places | `p.rituals` (written by `ui/ritual.js:418`, `:688`); the active plans **outside the record** under `localStorage` key `atuned-ritual-active` (`ritual.js:209`), not validated by the boundary and not in an export; `p.practice.rituals/practice_events` (validated, never written for a real person). `loopRead` reads both `p.practice` and, through the graph, `p.rituals` | **MERGE** per the TDD's cutover; `practice.js:30-37` already names the cutover as the UI build's |
| D12 | Charge, six writers, no provenance | `applyStory` (`sniff.js:751`), `relWrite` (`release.js:496`), Field drag (`ui.js:351`), charge fields and sliders (`panels.js:62-77`), `undo` restore, `loadProfile` | **UNKNOWN.** Not wrong in itself, but Rule 10 needs each to be an evidence event into one writer |
| D13 | Quiz story and app story | `atuned.quiz.v2` (`funnel/quiz.html:302`) and `source.profiles` | **UNKNOWN**: needs the account seam to decide |
| D14 | Build identifiers | `data-build` on two of the eight surfaces, each different; `SCHEMA_V`, `LEX_VERSION`, `TRACE_V`, `TRACE_ALG`, `PRACTICE_SCHEMA_V`, `DLY_SCHEMA_V` each separate, none on the stamp | **MERGE** into one stamp read at build time |
| D15 | Design tokens | `funnel/tokens.css` is written by `BUILD.sh` from the source ("wrote funnel/tokens.css, 49 tokens") | **KEEP** |
| D16 | Persistence of onboarding answers | `entry.ob` written but undeclared at the boundary | **MERGE** the existing fix branch |

---

## Step 4. One real story, traced end to end

**The story**, the one tonight's funnel review used for F4, typed for real
into the shipped build with a sensation clause added so the place reader is
exercised:

> I snapped at my co-founder in front of the team and I cannot stop replaying
> it. My chest is tight and I feel ashamed.

Taps: Anger, Tight, Chest. Driven through the real door (Guest), in Chromium,
on the canonical `source.html`. Probe kept outside the repository.

| # | Stage | Function, file:line | What crosses the boundary | Result |
|---|---|---|---|---|
| 1 | Door | `loginEnter`, `ui/login.js:278-295` | `CURP.ui.onboarded` false | onboarding opens |
| 2 | Ask, feel, body | `onboard.js:586-590` | `OB.pick=1`, `OB.feel=1`, `OB.place=3` | kept as taps, never parsed |
| 3 | Story | `obStoryDone`, `:637` to `parseStory`, `sniff.js:572` | text in; `{hits, bands, imprints[13], named:['Shame'], path}` out | **no safety check (J0)**. Nothing written |
| 4 | Observation | none | the parse lives in `ST_PARSED` and `OB.read` (memory) | **the trail starts to break: no Observation object** |
| 5 | Mirror | `obReadOf`, `:314`; `obMirrorCard`, `:407` | four seat groups: Solar stated Shame ("snapped", "ashamed", 1 address), Sacral guessed ("cannot stop", 4: Addiction, Lust, Shame Of Desire, Hypersexuality), 3rd Eye guessed ("replaying", 4), Heart guessed ("chest is tight", 4) | evidence and inference shown apart, per row |
| 6 | Confirm | `data-obans` handler, `:591-595` | `OB.ans = {46:'yes', 17:'no'}` | in memory |
| 7 | Correct | `obAdjust`, `:455` | correction text to `parseStory`; zero groups | **cosmetic: nothing upstream revised** |
| 8 | Commit | `obCommit`, `:650` to `stCommit`, `storyui.js:357` to `applyStory`, `sniff.js:744` | whole story text; Shame +3.78, Disgust +2.52, Apathy +2.10, Sad +2.80 | **the No lands anyway**: address 17 holds 1.58 |
| 9 | Record | `storyui.js:413-418`, then `onboard.js:663-667` | entry `{t, text, imprints:13, bands, lex, ob:{pick, feel, place, yes:[46], no:[17], fixes:[...]}}`, `pSave` | written. `pSave` reports success |
| 10 | Pattern | `obYesSignal`, `:507` to `onbMiniPlan`, `journey.js:85` | `[{node:46, stated:true}]`; plan `addrs [46]`, 4 keys | the Yes, and only the Yes. **Plan never stored** |
| 11 | Release | `relPick`, `release.js:249`; `relPlan`, `:166`; `relCoolDown`, `:797` | queue `[46]`, keys equal the plan's | real engine. Lines say "I am letting go of ... that I am ..." |
| 12 | Release write | `meterRun`, `relWrite`, `meterFirst`, `releaseWork`, `pSave`, `pSnap` | `meter.unique` 4, `relLines` 2, `truthLines` 2, firsts 2, history 2 | written, **linked to nothing**: no entry id, no answer, no release id |
| 13 | Verify | none | | **the trail breaks: no capture of what changed** |
| 14 | Evidence | none on this path | | **breaks** |
| 15 | Field rail | `loopRead`, `loop.js`; `loopPaint`, `ui.js:1496` | 13 patterns, Confirmed 0, Unanswered 13 | **contradicts the person**: 46 was a Yes, 17 was a No |
| 16 | Field | `compute`, `compute.js:236` | axis charge times susceptibility, every address on four axes | **implies address level precision the story did not give** |
| 17 | Reload | `pStore`, `schema.js:451`; boot, `ui.js:1694` | stored record refused: `story.entries[0] may not carry ob` | **breaks: blank profile, no message, onboarding replays** |

Where the chain holds: steps 3, 5, 10, 11 and 12. Where it is assumed: step 2
(taps never reach the reading) and step 16 (the Field reads axes, not the
story). Where it breaks: 4, 7, 8, 13, 14, 15 and 17.

---

## Step 5. Every requirement graded

### 5.1 Acceptance tests AT-01 to AT-12 (TDD section 27)

| AT | Grade | Evidence |
|---|---|---|
| AT-01 Story reaches canonical observation | **PARTIAL** | `parseStory` returns story, evidence (hits, words, seats) and a named-or-inferred flag; no single Observation, no hypothesis statement, uncertainty is a boolean, and the parse is not stored (`ENT_KEYS`, `schema.js:788`) |
| AT-02 Mirror is evidence-backed | **PARTIAL** | Onboarding's `obMirrorCard` separates said, noticed and guessed per row (EXISTS there). The Story tab, the tutorial and the Avatar commit with no mirror |
| AT-03 User can correct | **CONFLICT** | Correction captured (`ob.fixes`) and parsed (`obAdjust`), but the observation is not revised, the No's charge lands (measured, address 17 at 1.58), and the graph reads the rejected address as unanswered |
| AT-04 Confirmed observation reaches release | **EXISTS** on onboarding | Measured: queue `[46]` equals the Yes; `relPick` is the one engine. The Story tab reaches the same engine with no confirmation (AT-12) |
| AT-05 Release is persisted | **PARTIAL** | `meter.unique`, line counts, dated firsts and a history snapshot persist. No release record, no link to story or answer. On the onboarding path all of it is lost on reload at this commit (AT-07) |
| AT-06 Verification exists | **MISSING** | No capture anywhere; finished card measured |
| AT-07 Evidence survives reload | **CONFLICT** | Measured: entries 1 to 0, meter 4 to 0, onboarding replays, no message. Fixed on unmerged `onboarding-ob-boundary-fix`, measured |
| AT-08 Field reflects evidence without inventing certainty | **CONFLICT** | Field draws axis charge on every address of the axis (`compute.js:236`), carries no provenance, and is itself a writer (`ui.js:351`). Field rail says Confirmed 0 after a Yes |
| AT-09 Tutorial does not duplicate transformation | **CONFLICT** | No explanation step exists; the tutorial is a second full story-to-release door (`tutorial.js`), off by default |
| AT-10 Build congruency | **CONFLICT** | Two stamps that disagree and five surfaces with none (2.14); packed file 50 commits behind; stamp names the parent commit |
| AT-11 Safety branch | **MISSING** | J0 open; draft unmerged and unverified; owner's A/B/C unanswered |
| AT-12 No duplicate interpretation | **CONFLICT** | D2, D3, D4, D5, D7, D10 |

### 5.2 The Information Flow Sweep's requirement map (second AI Handshake)

| Requirement | Implementation found | Status | Evidence |
|---|---|---|---|
| Evidence Ledger | `p.practice.evidence` and `p.practice.log` (validated, append only, provenance per object); `p.summaries.events`; on the story path, `entry.text` only | **PARTIAL** (engine), **MISSING** (story to release path) | `practice.js:61-68`, `:240-245`, `:772-784`; `daily.js:90-92`; no caller of `practiceDo` outside `pracex.js:74` |
| Hypothesis | No first-class object. Pieces: imprint `inferred`/`stated`; `sniffStory` confidence and `because`; trace edge `src` with `TRACE_PROMOTE` keeping `was`; practice `src` and `confirm`; daily responses | **MISSING** | `sniff.js:636-658`, `:1127-1139`; `trace.js:211`; `practice.js:43`, `:623` |
| Confirmation | Mirror Yes and Not me per address | **PARTIAL** | `onboard.js:591-595`, written at `:664`, refused on reload, read by nothing |
| Correction | Free text, parsed, additive rows | **PARTIAL** | `obAdjust`, `onboard.js:455`; measured, revises nothing |
| Release | One production engine | **EXISTS** | `relPick`, `release.js:249`; measured |
| Verification | none | **MISSING** | 2.5 |
| Practice, canonical writer | Legacy `p.rituals` plus an off-record side key; `p.practice` has no real writer | **CONFLICT** | `ritual.js:209`, `:418`; `practice.js:30-37` |
| Outcome | `outcome_record` exists, needs a `goal_id`, unwired | **PARTIAL** (engine only) | `practice.js:786-797` |
| Memory | nothing | **MISSING** | searched `atuned_src/engine` |
| Trace projection | `traceFromRecord` derives from the record; `loopRead` is the one read; live on the Field rail | **PARTIAL** | `trace.js:775`; `loop.js`; does not read `entry.ob`, re-reads every story under today's lexicon and reports that (`restated`) |
| Decision | `loopRead().next` decides inside the projection; `stRelModel` and `onbMiniPlan` decide elsewhere; no decision engine | **CONFLICT** with the Decision Boundary | `loop.js:178`; `storyui.js:1541`; `journey.js:85` |
| Field projection | `compute()` from axis state | **CONFLICT** | projection exists, but the Field also writes charge and draws no provenance (2.7) |
| Persistence | `pStore`, `pPersist`, `pSave` with refusal kept raw on disk | **PARTIAL** | `schema.js:451-515`; `ob` refused at this commit |
| Reload | No gate reloads after onboarding at this commit; this audit's probe is the only reload evidence | **MISSING** as a test | `tests/onboarding2.js` at the commit; the fix branch adds one |
| Versioning | `LEX_VERSION` (hash of the lexicon tables) stamped on every entry, and the graph names entries read under another lexicon; `TRACE_V`, `TRACE_ALG`; daily days carry `lex` and `alg`; every practice object carries `algorithm_version`, `contract_version`, `generated_by.model_version` | **PARTIAL** | `sniff.js:996`, `:976-981`; `trace.js:60-64`; `daily.js:333-350`; `practice.js:168-174`. Gaps below |

### 5.3 The six Information Integrity tests

| Test | Grade | Why |
|---|---|---|
| 1 Story | **PARTIAL** | Story stored as text (unchanged once written); candidates produced; no hypothesis object; mirror on one door of four; correction does not change downstream |
| 2 Release | **PARTIAL** | Authoritative engine (yes); pattern not linked to evidence on the record; no verification; no-change not representable |
| 3 Practice | **CONFLICT** | Marking a ritual done writes the legacy day log; no PracticeEvent; the graph infers a practice event from `p.rituals` (`trace.js:845-860`). No second history is written today only because `p.practice` has no writer |
| 4 Reload | **CONFLICT** | Onboarding record lost (measured). Graph reconstructs from whatever survives (derived) |
| 5 Algorithm change | **PARTIAL** | A lexicon change is visible (`LEX_VERSION`, `restated`). A change to `scanStory`/`parseStory` rules with no table change does not move it (`sniff.js:976-981` says so). `applyStory`'s coefficients and `compute()` are unversioned, and `history[]` snapshots carry no stamp, so a coefficient change reads as the person changing |
| 6 Contradiction | **MISSING** | Nothing reopens or supersedes an interpretation. The daily event fold is the only mechanism shaped for it |

### 5.4 The remaining TDD sections

| Section | Grade | Evidence |
|---|---|---|
| 3 MVP journey steps 1 to 14 | 1 to 7 and 9 EXIST on onboarding; 8 CONFLICT; 10 MISSING; 11 CONFLICT; 12 CONFLICT; 13 MISSING; 14 EXISTS | sections above |
| 4 Onboarding visual path | **PARTIAL**. Production has eight steps (`OB_NSTEPS=8`, `onboard.js:91`): arrive, ask, settle, feel, body, story, mirror, bridge. Reel A, Reel B, keep or account, signal test and the canvas Field are mockup only, by the port's own header (`onboard.js:10-19`, `:33-38`) |
| 17 Avatar wording | **EXISTS**. The sheet says "This is you, and it is okay." (`:187`), not "This is your Avatar" |
| 19 Funnel to onboarding | **CONFLICT**. The quiz parses with the same engine but keeps its story in its own store (`quiz.html:302`) |
| 21 Language | **CONFLICT**. Both flagged lines ship: "Welcome to a neurosomatic experience" (`onboard.js:187`, also `funnel/about.html:313`) and "Awareness and intuition is a tool we use..." (`onboard.js:208`). Both are recorded there as the owner's own words, so removing them is his call |
| 22 Architecture transformation | **PARTIAL**. Evidence and source OS exist; hypothesis, user test as a record, verification and memory do not |
| 23 Canonical system boundary | **CONFLICT**. D2, D3, D7, D10, D11, D13 |
| 26 P0 order, items 1 and 2 | **DONE by this audit** (release audit, release engine congruency). Items 3 to 10 open |
| Sweep, Story Intelligence Boundary ("the Sniffer must not write directly to the graph") | **EXISTS**. The sniffer writes charge, not graph state; the graph re-reads stories itself |
| Sweep, Practice/Ritual cutover | **MISSING**. `practiceFromLegacy` exists and is deliberately not run (`practice.js:30-37`) |
| Sweep, Memory Contract | **MISSING** |
| Sweep, Field Contract | **CONFLICT** (2.7) |

---

## IMPLEMENTED (real and working, at `497a6a5`)

- One parser, `parseStory`, with a real named-or-inferred split per imprint.
- A mirror on the onboarding door that separates what was said, what was read
  and what was guessed, per address, with Yes and Not me.
- Mirror before commit: the onboarding writes nothing until Commit (F4).
- One release engine, `relPick`, reached from every door; onboarding's first
  release is planned only from the Yes rows and capped at three addresses
  (F5); the plan the card shows is the plan that runs.
- One release sentence generator, `relLine`/`C3_STEM`, on the owner's ruled
  six channels.
- A real, enforced 100-line gift allowance.
- A boundary that refuses undeclared fields by name and keeps refused records
  on disk.
- Host-free engines for the practice domain (evidence, outcome, confirm, an
  append only log, provenance and algorithm fields on every object) and for
  the trace graph, both validated at the profile boundary. Built, gated,
  unwired for a real person.
- Lexicon versioning on every story entry, carried into the graph.
- The trace graph's "Your patterns" read, live on the Field rail and Summary.

## TESTED (how)

- Build identity: the committed `source.html` and `engine.js` against a clean
  rebuild of the commit, `tools/equiv.py`. Identical.
- `tests/engine.js` (4,550 passed) and `tests/onboarding2.js` (104 passed)
  on a clean snapshot of the commit.
- One journey, door to reload, in Chromium against the committed build,
  recording every handoff (section 4). Repeated on four successive builds of
  the branch (`v1371`, `v1384`, `v1393`) with the same result, and on the `onboarding-ob-boundary-fix`
  build, where the record survives.
- `loopRead` and `traceFromRecord` in node on a record carrying a Yes, a No
  and four release keys.
- `validateProfile` on an entry with and without `ob`.
- Place word seats off the shipped engine, against `OB_PLACES`.
- Build stamps of every distributed file; the dist quiz's engine against
  `engine.js`.

## UNVERIFIED

- The account path and a signed-in reload (`ui/auth.js`): no network here.
- The draft distress detector on `f1-distress-detector`: not run, by design
  of this audit and because J0's response is the owner's call.
- `daily-summary-ui` and the last two `trace-graph-ui` commits: not merged,
  not graded as shipped.
- Whether the live Cloudflare preview named in `WAITING-ON-YOU.md` is still
  up: no outbound access to it.
- One engine assertion failed once on the first snapshot (the voice gate's own
  self check against a temporary file) and passed on the second. Not on the
  P0 chain; not chased.

## CONFLICTS

TDD against code:
- Section 6's fourteen word matcher is the mockup's stub, not the product.
- Section 13's release sentence is the mockup's, not the owner's ruled one.
- Section 20's "existing stop frame" exists only in the mockup.
- Section 2 and 24 cite build `v1366`; the build is `v1393`.

Code against code: D2, D3, D4, D5, D7, D8, D10, D11, D12, D14 (step 3).

Runtime against tests: every gate is green on a build that loses the
onboarded record on reload.

Graph against the person: Confirmed 0 and Unanswered 13 after one Yes and one
No.

Build against build: the handover file is 50 commits behind; the stamp names
the wrong commit.

## REMAINING GAPS

1. No verification capture after release (AT-06).
2. The onboarding record is lost on reload until the boundary fix merges (AT-07).
3. Mirror answers do not reach the graph, the Field rail or the charge (AT-03, AT-08).
4. No Observation or Hypothesis object; the parse is not stored.
5. No evidence ledger on the story-to-release path.
6. Three doors commit a story without a mirror.
7. The Field draws axis level charge as if it were address level, with no provenance, and accepts direct writes.
8. Practice and ritual: three stores, one model unwritten.
9. No memory, no decision engine; the one "Next" is decided inside the graph read.
10. Parse rules, charge coefficients and history snapshots are unversioned.
11. No reload gate after onboarding at this commit.
12. J0 safety, owner's call pending.
13. The packed handover file is stale and the stamp cannot name its own source.
14. The selected ground does not reach interpretation; no post-onboarding explanation of the loop.

---

## NEXT PRIORITY

### Precondition, already built: merge `onboarding-ob-boundary-fix`

`089d095`, two commits. Measured by this audit to keep the onboarded record
across a reload. Nothing below can be tested without it, because every piece
of evidence the next task writes would be refused with the record. Merge it
first, rebuild, and run its own `tests/onboarding2.js` reload.

### The single next task: what changed, recorded as evidence, surviving reload

This is section 26 items 4, 5 and 6 and the Sweep's item 5, on the one path
that already works, reusing the evidence model the engine already has rather
than building another one (the Handshake's "do not create another Evidence
Ledger").

**Scope.**

1. **The question.** On the release card's finished state, after
   `relCoolDown` has written (`release.js:797-996`), ask "What changed?" with
   five answers, none pre-selected, and a way past it that records nothing:
   felt different, see it differently, something moved, nothing changed, not
   sure. The words go through the voice gate; the five meanings are the TDD's.
2. **The record, through the existing door.** One `practiceDo(CURP.practice,
   'evidence_record', ...)` per address in `RUN.queue`: `source:'user'`,
   `pattern_id` the address, `metric:'release_verification'`, `value` one of
   five closed keys, `timestamp`, and the story entry's `t` and the release's
   first meter key in `context` (or as an additive optional field, below).
   Then `pSave()`; a failed save says so through `status()`. Put the answer
   keys and the mapping in the engine (a small host-free helper beside
   `onbMiniPlan` in `engine/journey.js`), so the gate can hold it without a
   browser.
3. **The Field rail reads it.** `loopRead` counts verification answers per
   pattern off `p.practice.evidence` and `loopread.js` shows them on the
   pattern's row as what the person said, never as support.
4. **The gate.** Extend `tests/onboarding2.js`: run the release to its end,
   answer each of the five on fresh profiles including "nothing changed" and
   "not sure", **reload**, and assert the evidence is still on the record, is
   linked to the address and the entry, and that `loopRead` reports it. Add
   engine assertions for the helper, including that a sixth key is refused by
   name. Check the gate fails on the build before the change.

**The one engine decision to make and name.** `practiceTraceIntents` turns any
evidence with a `pattern_id` into `evidence supports pattern`, or `contradicts`
when the type is `negative` (`practice.js:1018-1019`; `TRACE_RULE` has no
neutral row, `trace.js` rule table). "Nothing changed" recorded that way would
read as support for the pattern: the graph inventing certainty, which the TDD
forbids. Recommended: verification evidence emits no evidence-to-pattern edge
in this slice, and the rail counts it directly. Adding a neutral relation to
the rule table is a larger change and is the systems director's and owner's.

**Not in scope.** Writing the mirror's Yes and No into the same evidence store
(the next slice after this one: `evidence_record` as `inferred` with
`generated_by` the sniffer and its lexicon version, then the existing
`confirm` act for a Yes, and a `negative` user record for a No; that is what
makes `loopRead`'s Confirmed count true). Filtering charge by the answers
(F16, an engine change the owner has not ruled). The ritual cutover. Safety.

**Size.** About 250 lines across `ui/release.js` (the question and the
handler), `engine/journey.js` (the helper and the closed set),
`engine/loop.js` and `ui/loopread.js` (the count), `tests/engine.js` and
`tests/onboarding2.js`. No `SCHEMA_V` bump: `p.practice` is already validated
and `metric`, `value`, `context` and `pattern_id` already exist on Evidence.
If the build adds a typed `story_id` to Evidence rather than using `context`,
that is additive and optional (an older record has none), and it is the place
the systems seat would rather the link live, because a convention inside a
free string is a second name for one thing.

**Whose call, before or during the build.** The five answer wordings (voice).
Whether "nothing changed" and "not sure" may ever lower a pattern's standing.
Schema v2 is not touched by this task.
