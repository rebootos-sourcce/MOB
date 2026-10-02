# Pass 2, game director (Ngozi Achebe-Lindgren). Round PK, 2 October 2026

Read: all eight pass 1 reports in `REVIEW-arch/pass1/`. The QA report had not landed. Numbers marked "model" are from `tools/loopsim.js` (the retention simulation), benchmarks and not promises.

The hard line, stated because it is crossed twice below: this product reads somebody's nervous system, so no manipulation pattern. A gate that holds ground back until a behaviour is shown is a resource drip. A stage that can go backwards is a loss frame.

## 1. Agreements

- **Derive, do not store. Creative, AI, systems, technical, UI, game.** Ledger, journey and hypothesis are reads over the four stores that exist. Strongest signal in the round.
- **No days on screen. Creative, UI, game.** No "Day 23", no review at day 85.
- **Two day tables, neither ruled. Game, creative, systems.** Ten bands, thirteen in `ATUNED-MVP-architecture-v2.md` section 7, four modes in `engine/core.js`. None is a calendar.
- **Safety first. AI, creative, UI, technical, narrative.** No dependency, protects a person.
- **No numeric confidence. AI, systems, UI.** `daily.js:109` refuses it. A rung is a count a person can check.
- **Next is one slot. Creative, UI, game.** Three authors print four labels today (UI).
- **No server owned meter. Sales, technical, game.** All content ships in one file.
- **Nothing writes evidence. Systems, technical, game.** No surface calls `practiceDo`, so gates five to eight read nothing.

## 2. Disagreements, and my side

1. **Stage stamps. Systems wants stage-reached stamps, stored. I refuse.** A stored "reached stage 4" is a grade on a person and a count against a total. Systems fears retracted evidence moving a person back. It moves a suggestion, which may move. Dated facts are stored; ranks are not.
2. **"Where you are" tile with a lit stage on the ring. UI wants it. I cut it from MVP.** Ten stage names on a circle is a staircase drawn round, and "Back at pattern recognition" is loss framing in a soft voice. I keep the ring, lit by `touched`, the newest dated act per quarter. It says what a person did, never a rank, and arcs dim when nothing is touched.
3. **Run log. Systems has `journey.runs` in the worktree, I proposed `p.meter.runs`.** One log, not two. Mine drops. Systems' point stands: add `addrs` (address numbers) to a run while `journey.js` is unshipped. Gates read runs, never the capped log (500 lines, "the lesser record", `journey.js:325`).
4. **Ledger as a new field. Technical proposes `p.ledger`. AI, systems, creative say a view.** View. A second truth is the fault this area exists to remove.
5. **Meter on the server. Technical proposes `POST /v1/ground/open {key}`. Sales refuses.** Sales. A server that sees keys learns which addresses a person opens, which is intimate (`OB_NEVER`). Forging a pace costs nothing real; wrongly blocking an honest person costs trust. The server owns tier and period only.
6. **The gift shows layers, then locks them. Sales defaults to showing through the character layer.** Showing saboteurs for a hundred patterns and then greying them is a take-away built to convert, the loss frame I refuse. Gift sight is base sight only. Cost: the strongest demo moment, which I cannot price (no arm in `loopsim.js`). Sales may overrule.
7. **Layer sight on downgrade. Technical and creative lean to latch, sales says it follows the tier.** Ground latches: opened addresses, reruns, journal, history, points. Layer sight follows the current tier, because the owner made it a property of tier. Nothing is erased from the record. The lock names what is kept.

## 3. What I missed

- `journey.js` exists in a worktree with its own `journeyRead()` that returns four onboarding values (new, storied, continuing, released). My function name collided with it. I rename mine `loopRead`, creative's "where the loop is". The onboarding one must never print its values either.
- Typing is already over the frame budget (technical, 79ms median at 1000 words, 4x throttle). `loopRead` runs on commit and on Field open, never per keystroke. Fold cost measured at 0.12ms for 2,000 events.
- Distress reader numbers (narrative): five of eighteen on phrases it was not tuned on. That is roughly one in four. A care state derived from it is best effort and the copy must never claim monitoring.
- Points TDD sections 19 and 20 unlock Saboteur views, and tier SIGHT is the other key. **Points never open sight.**
- Creative's SIG17: rewarding a reported change teaches people to report change. A reported change pays nothing and no gate reads it alone.
- Sales: a person who renewed elsewhere and opens an offline desktop reads "nothing left". The worst trust failure in the economy.

## 4. The architecture, my part

**Names.** Code: `reading.js` (AI's one parse), not "orchestrator". The view over the stores is the chain, not "ledger" (`ledgerRead` is taken at `ladder.js:84`). The journey is `loopRead`. The chain's last row is **Confirmed**, shown only after the person's own tap (UI). The engine source word is `reported`. Never "verified".

**`loopRead(p, now, care)`.** Pure, host free, derived, never stored.

    touched   {discover, play, flow, embody}  newest dated act per quarter, or null
    turns     closed circles
    ground    {opened (distinct addresses), runs, reruns}
    standing  {clear, carry}
    reported  count of person-reported changes, zero until a writer exists
    care      ordinary | high load | acute
    next      {act, because[], src:'proposed'}

`care` is derived by re-scanning the newest entry with `safetyScreen` (about 40 microseconds, technical), for three days (my judgement) or until a newer ordinary entry. Never stored: a stored crisis bit is health data (AI, systems, both default no).

**One rule table, keyed on the open quarter.** Acute: one address and one line, or nothing. No reading: Next is "Write what happened". Reading, no run: write a second line. Run, no ritual: the ritual or its 60 second floor. Done, no new reading: read again. Circle closed: rerun an opened address, free. After several turns: compass or avatar.

**Gate rule.** A gate may rest only on a free act (entry, rerun, ritual, reading), never on spent supply. Behaviour opens nothing. It orders one suggestion. Tier is the only key to ground and sight.

**Next slot.** One sentence, one button, one quiet **Not now**. At most 14 words, 12 in care. Its `because` lines open with a fixed verb (narrative): You wrote, The instrument read. It replaces the four doors and the three cards (UI). The doors stay reachable behind a visible fold, never hover only. **Not now writes to one `declined` list** (systems' `{from, edge, to, at}` plus `{act, quarter, at}`), so a No changes what shows next. Window seven days (my judgement). Closed kinds, capped.

**Session shape.** Sixty seconds: Next at its floor, one line or one ritual floor. Twenty minutes: write, run, read, ritual. Neither is punished: no clock, no loss on leaving, nothing waiting.

**Economy.** Free 10 a week banking, gift 100 once, 400, 800, 1200, 1200 a month, as ruled. Keep sales' items: clamp `granted` to the tier's grant, a lease on cached plans, a refusal re-reads `/v1/me` before saying no, mid period change keeps `base`, one live subscription. **Banking cap 120 patterns, and no copy ever mentions the cap or approaching it.** A cap you are warned about is a scarcity timer.

**Stored, additive, flagged.** `addrs` on `journey.runs` (`JOURNEY_V`) and the `declined` list. No `SCHEMA_V` bump (systems). Before either lands, `validateProfile` must carry unknown top-level keys through, because an older build silently deletes them (systems, measured).

**Care, settled.** Narrative keeps seven sets of strings. Detection has four levels (AI: none, care, crisis, route). A person meets three outcomes (creative: ordinary, strong, needs a person now). Mapping: none is ordinary, care is high load, crisis and route are acute. Clinician interim: build now with a recall-leaning cue list and a dismissible false alarm. Review is a pre public launch gate. Acceptable: nothing is public yet and a miss costs more than a false alarm.

## 5. Revised grade

**GRADE: 70/100 (was 50).** The merged design, built in the order below. Up: six seats agree on derive-not-store, `journey.js` already holds runs, sizes are small, the stage tile is cut. Down: no writer for evidence yet, a clinician dependency, and Next is untested on a stranger.

## 6. Top 5 for my discipline

1. **Run `addrs`, distinct-address `ground`, windows by days practised (S).** Moves Derek (a count he can check) and Diane (cost named).
2. **`safetyScreen` merged, `care` derived (M).** Moves Ana and Nkem. Pre launch: clinician review.
3. **`loopRead` and the rule table, priced in `loopsim.js` (M).** Moves Gordon (no stage word) and Angela.
4. **Next slot replacing four doors and three cards, with `declined` (M).** Moves Angela and the phone only arrival. Model benchmark: leading a stranger to an if-then plan is worth up to 5.6 points at day 30, not additive.
5. **One tap after a ritual is done, writing `reported` (S).** Gives evidence its first writer. Moves Derek and Sofia.

Cost I keep paying: refusing the loss framed streak arm is worth 2.9 points of day 30 retention (model). I decline it.

## 7. Question for the owner

None. Decisions: no stage stamps, points never open sight, gift shows base sight only, banking cap unmentioned. Reason: each follows the hard line, and the owner can overrule any.

## Merged build order (first five)

1. Parallel, no shared files: copy fixes (narrative), deploy (sales), record round trip and unknown keys (systems), keystroke floor (technical).
2. `safetyScreen`, then the care card.
3. `reading.js` and agreement gates (AI).
4. Run `addrs`, `declined`, first writers.
5. `loopRead`, Next, then the chain and Why (UI). Entitlements and privacy screens follow, behind legal and deploy.
