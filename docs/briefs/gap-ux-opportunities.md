# Missed opportunities, read through the imported UX rulebook

Dani Sorensen, UI UX architect. 25 September 2026.

    Build A   /home/user/MOB/source.html, commit bc29d9e,
              md5 f08beb3587d1997e76cc0e4d53e8f4a5
    Build B   /home/user/reboot-os/atuned/build/atuned.html (md5 2d333c96...)
              and atuned.demo.html (md5 5c148fd8..., Sofia loaded), commit 8ba42de
    Method    Chromium 1194 through playwright, 1600x1000 and 390x844, blank and
              loaded. Screenshots in scratchpad/ux-shots/, walk logs A-walk.log,
              A-walk2.log, B-walk.log, B-walk2.log beside them.
    Rulebooks the imported uiux-master skill (10 category rubric, pass 92),
              reconciled with .claude/skills/atuned-ux/SKILL.md, which wins
              where they collide. Collisions are named in section 3.

**What I walked, and how.** A: the real first run on the person's own profile
(Field blank, Story, type a 60 word story, Commit), then four more short
stories until an address crossed the line, then a real release at Quick pace
to its done state, Build a ritual, Save, I did it, back to the Field. Derek
loaded for Field, Ritual and Summary. B: Home, Field, Journal with the same
story typed, Add imprints, Release picker, one address, Start, the running
reel, cool down, Ritual, Home again, on the blank build and on the Sofia demo.
In B I navigated by calling the screen functions (openSource, go, showHome)
rather than clicking tabs, and I shortened the release tick to reach cool
down; everything seen before and after that is as a person meets it.

**Counting.** Simultaneous choices are visible buttons, links, inputs,
selects, contenteditable, tip carriers and tabindex 0, first viewport. Canvas
marks are not counted. The selector is not the screen brief's selector, so
compare within this document, not against it.

| Surface | A seen at 1600 | B seen at 1600 |
|---|---|---|
| Opening, blank | 71 (Field) | 34 (Home) |
| Opening, loaded | 75 (Derek) | 37 (Sofia) |
| Story or journal | 89 blank, 91 after commit | 24 blank, 30 demo |
| Ritual | shell plus 7 in the card | 34 |

Nothing below re-reports AU1 to AU18, AV1 to AV24, FB2, FB3, RV or anything
the deep brief already logs. Where an opportunity builds on a logged item it
says so.

---

## 0. The five that matter most

1. **The turn leaves no mark** (F1). I ran the whole loop in both builds.
   Afterwards A's Field read what it read before: 36 and the word Incoherent.
   B's Home read worse than before: coherence 29 to 25, Energy minus 17 in
   red, Released 0. So a completed turn looks like no effect or like harm.
2. **One slot called Next** (F2). A's four doors vanish once anything is
   read, and nothing replaces them. B already has the logic in
   `srcRecommend`. Port it to A as the one control that turns the loop.
3. **Return appointments the engine already predicts** (F3). "The rebound is
   day four and a half." "Lands tomorrow." Both builds predict these and
   nothing ever comes back to them. They are the honest version of variable
   reward.
4. **The status line evicts the navigation** (X1, a defect found in passing).
   At 1600 and 1280 every message in A takes over the whole top bar. A
   failure holds it indefinitely.
5. **Imprint flight on commit** (M1). The words a person just wrote should
   travel to the place they land. Today in A they vanish, and the empty state
   says "You have not written anything yet".

---

## 1. Audits, in the imported skill's format

### Build A

```
UX AUDIT: A, opening screen (Field, blank)
VERDICT: FAIL (48/100)
COGNITIVE LOAD: Overloaded (71 seen at 1600)
BEHAVIORAL LOOP: Missing
FLOW COMPLETION: Friction at the first four seconds
PASSES:
- Four doors, each a verb and one line, psychographically sorted
- Honest empty: CQ dash, "not read yet", no invented number in the centre
- Every counted control is 44 by 44 or larger
FAILS:
- The eye lands on the red core sphere, the largest and highest contrast
  object, and on a blank profile it encodes nothing. The doors sit in a
  lower contrast rail -> AD
- Left rail open on arrival, about 50 controls before a first read -> PL
- No loop visible anywhere; nothing says what a turn is -> PL
- At 390 the top bar takes about 245 of 844 pixels; the doors are off
  screen (AU12) -> PL
NEXT: On unread, give the doors the focal weight and draw the core as an
empty ring.
Scores: CL 2, flow 5, tap 8, feedback 5, disclosure 3, loop 2,
continuity 5, consistency 6, tokens 6, conversion 6.
```

```
UX AUDIT: A, story entry (Story, own profile)
VERDICT: FAIL (52/100)
COGNITIVE LOAD: Overloaded (89 to 91 seen)
BEHAVIORAL LOOP: Weak
FLOW COMPLETION: Friction at Commit
PASSES:
- Words light in seat colour inside the person's own sentence as they type
- Ghost pills, "Commit 8", a price before the act
- Privacy said at the microphone, beside the alternative
FAILS:
- After Commit the box clears and the imprint column reads "You have not
  written anything yet" (screenshot A-1600-04). The one moment the product
  must acknowledge becomes a false empty state -> TD
- A 60 word story landed "60 sitting under the line", Held 0, and the release
  panel said there is nothing to release. The loop ends at station one
  (FB2 logs the arithmetic) -> PL
- Pills vanish with no motion to where the charge went -> AD
Where they stop: Angela, here, reading "You have not written anything yet".
NEXT: A commit receipt in place of the box, with imprint flight (M1).
Scores: CL 3, flow 5, tap 8, feedback 4, disclosure 5, loop 3,
continuity 3, consistency 6, tokens 6, conversion 5.
```

```
UX AUDIT: A, release (run a release overlay)
VERDICT: FAIL (71/100)
COGNITIVE LOAD: Low (two controls per state)
BEHAVIORAL LOOP: Present
FLOW COMPLETION: Friction at the running state
PASSES:
- Price before Begin: "4 patterns of the 100 you have left", seconds stated
- Done state is honest: "Coherence up 1.4, now 36.0", "toward Worth"
- "Build a ritual" bridges straight to the next station
FAILS:
- Running shows an address name, a side and a bar. There is no line to say,
  breathe or hold, so the person has nothing to do (RV logs the audio half)
  -> PL
- The hero of the done card is "1 addresses", the least informative fact.
  "toward Worth" sits in 13px at the edge -> AD
- "Release has about 0.2 points left to give you" after a first ever release,
  with no door to the lever it names (the laws) -> PL
Where they stop: Derek, at 0.2.
NEXT: Make the opposite being installed the hero, and put a door to the laws
in the done card.
Scores: CL 9, flow 8, tap 9, feedback 6, disclosure 7, loop 6,
continuity 5, consistency 7, tokens 6, conversion 8.
```

```
UX AUDIT: A, ritual and the record
VERDICT: FAIL (66/100)
COGNITIVE LOAD: Medium (7 in the card, the shell around it)
BEHAVIORAL LOOP: Present
FLOW COMPLETION: Clean inside the card
PASSES:
- One practice called for, the rest behind one control
- When and where, with the implementation sentence built live
- "Done. It is on the record." at the control that was pressed
FAILS:
- Marks arrive unannounced: "First run" appeared in a list after I did it
  with no moment -> PL
- The record lives only here; the Field after a full turn shows none of it
  -> PL
- Reached as a modal from the release and as a tab from the bar: two shapes
  for one place -> AD
NEXT: Carry the record to the opening surface as the turn mark (F1).
Scores: CL 7, flow 8, tap 8, feedback 6, disclosure 7, loop 6,
continuity 5, consistency 6, tokens 6, conversion 7.
```

### Build B

```
UX AUDIT: B, opening screen (Home)
VERDICT: FAIL (56/100)
COGNITIVE LOAD: Medium (34 blank, 37 Sofia)
BEHAVIORAL LOOP: Weak
FLOW COMPLETION: Clean on blank, drifting on loaded
PASSES:
- One call: "Nothing measured yet." then "Start, 4 minutes". Duration stated
- Delta chips on the three dials answer Diane's question: did it move
- Honest dashes on a blank profile
FAILS:
- The bar lights Field while Home is on screen: position is lied about
  on first paint -> TD
- At 1600 the right two thirds hold three collapsed "Show" rows and
  nothing else -> PL
- Eleven tabs at 36px tall, under the 44 floor -> AD
- --gold resolves blue at 1600 and gold at 390, and Instrument Sans never
  loads, so the page renders in the system fallback -> AD
NEXT: At desktop width, put the journal entry and the Next action in the
right column.
Scores: CL 6, flow 8, tap 5, feedback 6, disclosure 7, loop 4,
continuity 3, consistency 5, tokens 4, conversion 8.
```

```
UX AUDIT: B, journal entry
VERDICT: FAIL (63/100)
COGNITIVE LOAD: Medium (24 to 30 seen)
BEHAVIORAL LOOP: Present
FLOW COMPLETION: Clean
PASSES:
- Each caught pattern is shown as the person's own clause, with seat and
  plexus ("I was never enough for him", Crown)
- "Not caught. You wrote nine. Where did that sit?" asks instead of guessing
- Add imprints advances a drawn stepper, and the line fills to Imprints
FAILS:
- Three words for one thing: entries, patterns, imprints -> PL
- Filled solid chips, against A's ring rule if B adopts A's rulebook -> AD
- A rotating strip of twelve prompts plus a chat box beside the entry
  competes with the entry -> PL
NEXT: One noun for what a story yields, used on every screen.
Scores: CL 6, flow 8, tap 5, feedback 8, disclosure 6, loop 6,
continuity 7, consistency 5, tokens 4, conversion 8.
```

```
UX AUDIT: B, release (pick, set up, run, cool down)
VERDICT: FAIL (52/100)
COGNITIVE LOAD: Medium
BEHAVIORAL LOOP: Present
FLOW COMPLETION: Friction at set up and at cool down
PASSES:
- The run is the best in either build: a timer, a moving ring, the line
  in focus with the next lines receding, voice on
- A Next row after cool down names the next address and its minutes
FAILS:
- The thing released changes name four times: picked "Exhausted", set up
  "How sadness runs you" and "Grief", run "Grief, heart", cool down
  "Hatred" -> PL
- Two start controls on one pane ("Start" and "Begin"), with two durations
  (5:00 and 3:12) -> TD
- Cool down draws below the finished run: top at 1113 on a 1000 tall
  screen. The reward sits under the fold -> TD
- The hero number after a release is "0 RELEASED", because only a cleared
  address counts -> PL
NEXT: One name carried through, and the run turns into the cool down in
place.
Scores: CL 5, flow 5, tap 6, feedback 5, disclosure 6, loop 7,
continuity 3, consistency 4, tokens 4, conversion 7.
```

```
UX AUDIT: B, ritual and consistency
VERDICT: FAIL (54/100)
COGNITIVE LOAD: High
BEHAVIORAL LOOP: Present
FLOW COMPLETION: Friction at the record
PASSES:
- Affirmations drawn from the address just worked, with Add and "Not this"
- "Still settling, lands tomorrow": a real reason to come back
- "A broken row costs nothing. It is a record, not a verdict."
FAILS:
- On a blank profile: three days already marked, "3 of 7", "12 of 28".
  History invented for someone who has done nothing -> PL
- "Integrity 0%" in the alarm red beside "1 of 4 integrity" -> PL
- Four empty card rows holding only a dot, which are dead states -> AD
- "Affirmations for what you cleared" when nothing cleared -> PL
NEXT: Remove every figure a blank record did not produce.
Scores: CL 6, flow 6, tap 6, feedback 5, disclosure 5, loop 7,
continuity 5, consistency 4, tokens 4, conversion 6.
```

---

## 2. Missed opportunities, ranked, in the owner's order

Tags: **Build** A, B or both. **Cost** S, M or L. **Ruling** says whether the
owner has to decide something first. **Honours** is the product ruling the
build has to keep.

### 2.1 Foundation and logic

**F1. The turn record, and its afterimage on the opening surface.**
Serves loop (6) and feedback (4).
*Mechanism.* After an action, a person goes back to the place they started to
check that it landed. If that place has not changed, the brain files the
action as having had no effect. That is the extinction curve, and it starts on
the first turn. B makes it worse: its delta chips go red after journaling,
because writing adds charge, so the loop's first station is scored as harm.
*Build.* An append only store of dated events: story read, release run,
practice done, first at a seat. Keep it separate from the reading. On the
opening surface, draw the loop ring with the station just completed marked,
and one line under it built from the store: "Today: a story read, shame
released at the root, box breathing done." Turns completed are a count with no
total. The reading keeps its own slot and may fall. The record cannot.
*Build:* both. *Cost:* M. *Ruling:* the store, no. Which station maps to which
surface, yes (AU11, still open). Build the ring to take the mapping as data.
*Honours:* a reading is not a score. A count is never printed against a total.
The record is never the same mark as the reading (DESIGN-avatar s5). Things
empty as a person improves.

**F2. One slot, labelled Next, whose value is the next station.**
Serves flow (2) and conversion (10).
*Mechanism.* Hick's law on a loaded person. Seventy one choices on screen
means the person has to compute the next step themselves, and that is where
levels 4 and 5 stop. One control whose label never changes can be learned
once. Its value carries the state.
*Build.* A: the doors' slot stays after the first read. Its value moves
through: write, then release what the story found, then take the ritual it
called for, then check what is due (F3). The rules already exist in B's
`srcRecommend` in `35_source-ai.js`. Port them as data and never as a model.
B: move that recommendation from the journal footer to Home.
*Build:* both. *Cost:* S in B, M in A. *Ruling:* no. AN8 has already ruled
that the bar grows as it is earned, and this is the same idea at slot scale.
*Honours:* a slot keeps its label (R2). A call to action that survives the
action is furniture, so the value always changes once acted on.

**F3. Return appointments from the engine's own timeline.**
Serves loop (6) and disclosure (5).
*Mechanism.* The imported skill's variable reward, made honest. The pull is
real uncertainty: did the address rebound? The resolution is the person's own
felt read, not a random prize. Tension, then resolution, and both belong to
the person.
*Build.* When a release lands, store its due dates: rebound at day 4.5 and
completion at day 27 in A (both are printed on the done card and then
forgotten), and "lands tomorrow" in B. On a due day the Next slot reads "Shame
at the root: rebound check due". The check is thirty seconds long and uses the
four felt chips B's run already has (smooth, dense, heavy, very heavy). It
writes calibration and never writes a verdict. This is also the content of AN10
("day two is the ritual, it pushes"): the push carries the appointment, never
a streak nag and never a reading.
*Build:* both. *Cost:* M, and L with push. *Ruling:* yes. Does a rebound check
write charge, or only calibration?
*Honours:* no verdict travels in a notification (principle 13). A reading is
never invented. Sight is not for sale.

**F4. Show the dated firsts at the moment they happen.**
Serves feedback (4) and loop (6).
*Mechanism.* Peak end. People remember a sequence by its peak and its ending,
and a mark that shows up later in a list has neither.
*Build.* A already computes `RUN.firsts` ("first release at the root") in
`ui/release.js:148` and stores them in `meter.firsts`. Show them as one line
on the done card, and date them in the record. The deep brief names the
principle (10.1, point 14) and no task line builds it.
*Build:* A, and B's `award` path. *Cost:* S. *Ruling:* no, but AV17 (the
badge word) should settle first.
*Honours:* no rank, no percentile. A first is dated and never scored.

**F5. A write state primitive before the network arrives.**
Serves feedback (4).
*Mechanism.* A control that says what it is doing is one the eye does not have
to verify somewhere else.
*Build.* One component with four states (idle, writing, written, refused) that
every write control uses, and that reports through `status()`. Locally it
passes through "writing" in under a frame. At sign in, billing and push it
carries the 1 to 3 second and 3 to 10 second floors. This is the build that
makes AV12 impossible to reintroduce, rather than seven separate fixes.
*Build:* both. *Cost:* M. *Ruling:* no.
*Honours:* never claim success before you have it. No spinner for a 20 ms
operation.

**F6. A sub threshold state that shows accumulation.**
Serves loop (6) and feedback (4).
*Mechanism.* Goal gradient. Effort rises as a visible threshold gets closer.
At the moment the first story is read and not shown.
*Build.* A pending address draws as a length filling toward the load line,
never as a number over 4, with one line: "Gathering at the root. Not enough
yet to run." Crossing the line is the moment release unlocks. The copy has to
say this is the instrument's resolution, never an invitation to write more
pain.
*Build:* A. *Cost:* M. *Ruling:* yes. It rides on the FB1c, FB2 and FB3
threshold ruling.
*Honours:* a count against a total reads as a score, which is why a bar and
not a fraction. The asymmetric error: never reward distress.

### 2.2 UX: flow, disclosure, targets, dead states

**U1. B at desktop: the entry on the opening screen.** At 1600 the right two
thirds of Home are three collapsed rows. Put the journal box, with its prompt,
and the Next slot there. That makes writing a zero tap action on a desktop.
*Build:* B. *Cost:* S. *Ruling:* no. *Honours:* four sides, each with a logic.

**U2. A desktop keyboard layer.** Number keys 1 to 9 follow TABDEF order,
looked up by `.k` and never by position. N focuses the story. Space pauses a
release. Cmd K opens one finder across the 112 addresses, the twenty one laws
and the glossary. A's Knowledge search already has the index; B has no search
at all (APP_MAP). Escape closes one layer per press. *Mechanism:* Fitts drops
to zero, and recognition beats recall for the terms. *Build:* both. *Cost:*
S to M. *Ruling:* no. *Honours:* never renumber the TAB integers; one word per
concept in the finder.

**U3. Direct manipulation on desktop.** Drag an imprint pill onto the release
panel to queue it. B has swipe right on a phone and nothing with a pointer. A
has the panel right beside the pills. *Build:* both. *Cost:* M. *Ruling:* no.
*Honours:* undo beats confirm, so the queue edit pushes undo.

**U4. The phone shell budget in A.** At 390 the top bar spends about 245
pixels on the profile picker, lighting, help, account and the undo arrows. Cut
it to the wordmark, the tab strip and one overflow control. Profile and
lighting move to Settings, where Settings already lives. *Build:* A. *Cost:* S.
*Ruling:* yes, because it moves the demo picker. *Honours:* never hide a
control with no affordance, so the overflow shows it is an overflow.

**U5. The done card's missing door.** "Integrity is the twenty one laws.
They move when you answer them." There is no control to answer them. Add
"Answer the laws" as a third action. *Build:* A. *Cost:* S. *Ruling:* no.
*Honours:* next is answered by the control itself (deep brief 4.3).

### 2.3 Look

**L1. The release end state's hero is the opposite being installed.** In A
the largest type says "1 addresses". In B it says "0 RELEASED". Draw the
opposite ("Worth", in its seat colour, in ring form) as the hero, with the
weight moved as the sub line. *Mechanism:* Kathy Sierra's point. The person
should see themselves getting better, not the product counting. *Build:* both.
*Cost:* S. *Ruling:* no. *Honours:* ring not fill, and a reading is not a
score.

**L2. Focal hierarchy on unread (A).** Swap the weights. The red core becomes
an empty ring, and the doors take the contrast. *Build:* A. *Cost:* S.
*Ruling:* no. *Honours:* an empty ring is the honest picture of an empty
field. Muted palette.

**L3. B's tokens by width.** `--gold` is #7EB8D4 at 1600 and #C9A84C at 390.
One name should have one value per lighting, never per breakpoint. Instrument
Sans loads at neither width. *Build:* B. *Cost:* S. *Ruling:* no. *Honours:*
tokens are law, and A already carries its face inside the file.

### 2.4 Content

**C1. The person's own clause on A's pills.** B shows "I was never enough for
him" above the axis. A shows only "Fear +1.3". *Mechanism:* the self
reference effect. A person recognises their own sentence far faster than a
taxonomy word. *Build:* A. *Cost:* S. *Ruling:* no. The clause is the
person's own words, not the open question 12 about showing the engine's names.
*Honours:* the record and the story are never held joined, so the clause is
display only and never enters the record.

**C2. One name for the thing released, end to end.** See B's release audit.
*Build:* B. *Cost:* S. *Ruling:* yes, which of the four names is canon.
*Honours:* one word per concept.

**C3. Verdict words on day one in B.** "Malignant 100%" on the Field and
"Integrity 0%" in alarm red, for a person who has just arrived. "Intentions
set and not carried cost more than intentions never set" on a blank ritual.
*Build:* B. *Cost:* S. *Ruling:* yes (the low band words, open item 28).
*Honours:* a label about the whole person may not be a moral word.

### 2.5 Animation

The house curve is on almost nothing (logged, TASKS near line 7580), and there
is no press state (AU17). The number roll is logged. What follows is not.

**M1. Imprint flight on commit.** Each lit word lifts out of the sentence and
lands on its pill (FLIP, transform and opacity only). The pill then settles
into its seat group. Stagger 50 ms per seat, root to crown, so the order is
the body order. Critically damped, 360 ms. At most eight elements. Reduced
motion becomes a 120 ms crossfade. *Build:* both. *Cost:* M. *Ruling:* no.
*Honours:* a surface arrives, it does not appear. Motion that is not a reading
is a lie, and this one is a reading: it shows where the charge went.

**M2. Directional tab changes and a travelling indicator.** A's 6 pixel rise
gives no direction. Slide 12 px from the side of travel in TABDEF order, and
let the underline travel between tabs, using same document
`startViewTransition` (no dependency). *Build:* both. *Cost:* S. *Ruling:* no.
*Honours:* display order is TABDEF, looked up by `.k`.

**M3. Spring tokens with one honesty rule.** Add `--spring-read` (damping 1,
no overshoot) and `--spring-press` (damping about 0.7), written as CSS
`linear()` curves. The rule: nothing that is a reading ever overshoots,
because an overshoot on a number is a false reading for a tenth of a second.
Overshoot is allowed only on controls and sheets. A's `--ease-land` and B's
1.4 curve overshoot today and should never touch a figure. *Build:* both.
*Cost:* S. *Ruling:* no. *Honours:* tokens are law, and so are the motion
rulings.

**M4. Release to cool down to ritual as one surface.** In B the run turns
into the cool down in place, and the address chip travels into the Ritual's
"Heart release" row. In A the done card's pill morphs into "After releasing 1:
Shame". *Build:* both. *Cost:* M. *Ruling:* no. *Honours:* one dismissal
contract, Escape one layer at a time.

**M5. Opening choreography that ends on the action.** Readings first, then
the wheel or dial, then the doors or Next slot last, 60 ms apart. The eye
comes to rest where the action is. *Build:* both. *Cost:* S. *Ruling:* no.

### 2.6 Sound and haptics

RV already plans the heard release: his voice, a theta and alpha bed, and
oscillator code. These are the additions. **Everything is off by default.** It
switches on only inside an eyes closed practice the person starts, from a
toggle beside Begin, remembered per record.

**S1. A line boundary tick during the release.** One soft 40 ms tone at each
line change. The eyes can close and the count stays with the person. *Build:*
both. *Cost:* S. *Ruling:* yes, it belongs with RV7 and RV13.

**S2. Paced haptics for box breathing.** A 10 ms pulse at each of the four
phase edges, on phones that have a vibration API (Android; iOS Safari has
none). Nothing on errors: a buzz at a loaded person is a startle. *Build:*
both. *Cost:* S. *Ruling:* no.

**S3. Refused: an earcon on commit.** A chime after someone writes what hurt
rewards the writing of pain. Silence plus the flight (M1) is the
acknowledgement. The same goes for marks: no fanfare.

---

## 3. Where the two rulebooks disagree, and which should win, in my view

| Imported says | Product says | My view |
|---|---|---|
| Compulsive habituation; raise switching costs | Sight is not for sale; export and import are first class; not Duolingo's manipulative half | **Product.** Return because something is due (F3), not because leaving costs. |
| Success glows; loading pulses; the interface is never silent | Retention is not a glow; motion that is not a reading is a lie; no ambient motion | **Product.** State changes that are readings: ring closes, opposite installs. B ships `aurabreath`, `drift` and `youpulse` keyframes; I did not trace what each one drives, and each should be checked against this rule. |
| Variable reward, novel and unpredictable | A reading is never invented | **Both, reconciled.** Variability comes only from the person's own material: their words read back, the rebound outcome. |
| Error shakes | The person is often at their most loaded | **Product.** An error holds still and says what to do. |
| The user does not read | A word that lands on a person carries its meaning where it is said | **Split.** Imported for controls and next steps. Product for anything that lands as a judgement. The done card paragraphs get cut to one line and a door. |
| Every tap responds | No indicator for a 20 ms operation; confirmations clear at 2.4 s | **Both.** A press state always (AU17), never a spinner on local work. |
| Hide advanced options until readiness | Never hide a control with no affordance | **Imported, under AN8.** Locked shows what unlocks it. |
| Dynamic UI that learns | Personalisation out of scope | **Imported now.** The product rule is stale since the accounts fork. Learn from local state only. |
| Tokens are law | Same | Apply fully: AU3, and B's `--gold`. |

---

## 4. Found in passing, not in AU, AV or the deep brief

- **X1 (A). The status line evicts the navigation at desktop width.** `#status`
  is `flex:0 0 100%` in a no wrap bar (`atuned_src/shell/head.html:672`). At
  1600 and 1280 any message pushes the tabs, profile, undo, lighting, help and
  account out of view (screenshots A-1600-40, A-1600-27). Confirmations take
  them away for 2.4 s. A failure holds them away until the next message. Not
  at 390, where the bar wraps. Small to fix, and first.
- **X2 (A).** After a commit the imprint column reads "You have not written
  anything yet" (`ui/imprints.js:143`). The empty test ignores history.
- **X3 (A).** "1 addresses" on the done card.
- **X4 (B).** Home opens with Field lit in the bar.
- **X5 (B).** Invented consistency history on a blank record ("12 of 28").
- **X6 (B).** Cool down below the fold; two start controls with two durations.

---

## 5. Walked with three people

- **Derek, 7 to 8.** He is through the story in one pass. He stops at A's
  done card ("0.2 points left", and no door to the laws) and at B's "0
  RELEASED". F1, L1 and U5 hold him.
- **Angela, 5.** She stops at A's post commit "You have not written anything
  yet", and on a short first story at "nothing to release". F6, X2 and M1
  hold her.
- **James, 3.** He reads one number, once. A gives him "Incoherent" after a
  full turn, and B gives him red minus 17. F1 is the only item that changes
  what he reads.

## 6. What to instrument

1. Opening surface visits within 60 s of a completed turn, and whether the
   next session starts within 48 h. (F1)
2. Presses on the Next slot by the value it carried. (F2)
3. Due appointments opened, against due appointments shown, by day. (F3)
4. Commit, then first press within 10 s, then where. (M1, X2)
5. The same count with sound on and off, only where a person turned it on.

## 7. Grade delta

Mean of my eight audits: A 59, B 56, pass 92. My projection, not a
measurement, if X1, F1, F2, L1, M1 and M3 land: A to about 70, B to about 68.
The rest of the gap is cognitive load in A's shell (open item 25) and token
debt in B. A five person walk on the built change is how to measure it.

---

## 8. 2027 forward: missed opportunities against the 2027 trend set

**Source note.** The trend set here came from search extracts: the eDesign
Interactive article "2027 Website Trends" and summaries of WebFX, UX
Collective, Graticle and others. It did not come from the full articles, which
this environment's egress policy blocks. Each trend below is judged against
this product's rulings before it is recommended. Ranked.

**T1. Predictive UX from local behaviour.** Build: both. Cost: M. Ruling: no.
The interface moves before the person asks, and it does so without a model. It
is F2 and F3 with a clock: the Next slot learns from the local event store
that this person writes at night and runs rituals in the morning, and orders
itself to match. B's `srcRecommend` is already a rule engine of the right
shape. *Honours:* the engine stays host free and offline. Nothing learned
leaves the device.

**T2. Adaptive density for a proficient person.** Build: A first. Cost: M.
Ruling: yes (cognitive load option, open item 25). The "adaptive design
system" trend, without AI: after a person has used a rail section some number
of times, it opens at arrival. Until then it sits as a labelled spine. Density
follows proficiency, not a menu. *Honours:* AN8, the bar grows as earned, and
R10, locked shows what unlocks it.

**T3. Voice as an equal input, across the loop.** Build: both. Cost: S to M.
Ruling: no. The microphone exists on the story. Extend it to the ritual ("done")
and the felt check in F3 ("dense"), with the cost of the speech service said at
the control as the story already does. *Honours:* the cost at the control,
before the act, beside the alternative.

**T4. Spatial layering on a 2D screen.** Build: both. Cost: M. Ruling: no. Depth
as a reading: the drill and the release sit on a z layer above a stage that
recedes by scale and opacity, never by blur (AU14), and M2 and M4 give the
travel. This is what makes it feel 2027 rather than 2019, and it costs nothing
in honesty. *Honours:* nothing blurred over the Field, and no ambient motion.

**T5. Structured content for two audiences.** Build: both. Cost: M. Ruling:
yes. Every drill, practice and definition is written as a typed record
(kind, name, one line, long form, seat). The same record then drives the
drill, a voice read of the release, and the future practitioner view.
*Honours:* the practitioner sees outputs, not the story cloud. The seven
opposite definitions are canon and his (open item 22).

**T6. Cognitive inclusive and ethical design as the floor.** Build: both.
Cost: S to M. Ruling: no. It is already the product's argument. Make it
checkable: the Quiet toggle ships (AU18), sound defaults off, and there is one
reading mode that shows one number and one sentence for Ana at two in the
morning. *Honours:* the asymmetric error.

**T7. Dark as the default, and more than that.** Build: both. Cost: S. Ruling:
no. Follow the system setting, keep the seven lightings, and store the choice
(A's theme is not saved at all, AV11). *Honours:* muted palette from autonomic
response.

**Refused, or held for a ruling:**

- **A cloud model for personalisation or chat.** B carries a Source chat
  system prompt (`35_source-ai.js:330`) and today answers locally with
  "arrives with the account service". Sending the person's own sentences to a
  model breaks the no AI stance and the rule that the record and the story
  are never held joined. His call, and it should be put to him with the
  local rule engine (T1) beside it.
- **Hyper personalisation from data joined off device.** Refused. Sight is not
  for sale.
- **Emotional design as warmth in the instrument.** Refused where it measures:
  no soft wellness language. It is allowed in a welcome, which is not a
  measurement (his ruling).
- **Experimental navigation.** Refused on this audience. Levels 4 and 5 stop
  at anything they have to learn before they can leave.
- **Gamification as points.** Held. AV17 is his. The honest version is F1 and
  F4.
