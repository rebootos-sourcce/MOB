# Pass 3: systems director (Yuki Brennan), onboarding round PJ

Checked in source at HEAD `6fd2306`: `engine/schema.js` (the blank profile and `validateProfile`, the one door where stored data is checked), `shell/head.html` tokens (a token is a named value such as `--ink` that every screen reads), `ui/storyui.js:412`, `ui/release.js:876`.

## 1. THE PROPOSAL AS I UNDERSTAND IT

One black stage with the standing figure plays five silent slides on one clock, then waits at a gate where the person picks one of twelve starting points, writes one sentence, is read back, runs a 12 line release, and lands on the Field after an aftercare reel. Where the person is lives nowhere as a step: it is worked out from facts already stored. The lead's merge kept my state design (`obAct`, `journey`, the clock inside `loop`, checked saves). It lost two things I care about. My handover list named nine keys and the blank profile has twenty five, so a gate that demands every key sit in one list would fail on day one. And it never said what closes the aftercare, so `obAct` has no way to leave `reading`.

## 2. THE ICP ROOM

- **Marcus (founder, level 7).** In 10 seconds he sees a black room, a figure, one line. He taps right twice, hits the gate, picks a seat, writes. He stays, because nothing asks for a card. He leaves only if reload replays the slides. It does not skip them silently, but Skip is one tap. "Where did my starting point go?" It is stored as `journey.start`, so reload keeps it.
- **Whitney (phone only, esoteric native, level 5).** She sees 28 px type and a hairline, and the reel runs while she reads. She holds to pause, and it pauses. She stays through the loop circle. Risk: if she backgrounds the tab mid-slide, the `hidden` pause reason must hold the clock. "It waited for me."
- **Nils (design skeptic, level 4).** He sees no card, no dots, no glow he can name. He looks for the seam: a tab theme recolouring the stage, or a blur. Tokens block both. He stays if the proof row is a real engine row. He leaves if "112 addresses" is typed text. "Show me it is read from the engine." It is.
- **Camille (somatic practitioner, level 6).** She watches for the first story and the privacy line. She reads "The name you gave never leaves." She leaves if distress is not detected, because her people arrive in it. "What happens when someone writes something dark?" The detector pauses everything, stores nothing.
- **Marta (acute distress, 02:00).** She sees a still black screen. She types a hard sentence. The distress reason must stop the clock and replace the film with the plain stop frame before any release voice. Without the detector she hears a body script. She leaves here, correctly, if it is missing. "Please stop talking at me."
- **Renata (operator, level 7, main target).** She wants the first release fast. Reel 26 s, gate, one decision, the story, 12 lines. She never presses Next. She stays through the gift counter falling from 100 to 88, because it is the engine's number. She leaves if a failed save loses her sentence. It is kept and reported. "I wrote one line and it ran."
- **Trey (quiz tourist).** He sees a login first, taps Guest, gets the reel, bounces at the story box. Guest has no account fields at all, so nothing blocks him. Nothing stored means nothing to clean up. "I just wanted the result."
- **Sofia (loves the open tables).** The proof row and the seat names please her. She stays, and later finds `STARTS` and `SL_DWELL` are plain tables. She leaves if the handover is opaque. Print what leaves. "Where is the list of what you send?" It is `HAND`.

## 3. UNIFIED QUALITY: 64/100

Gaps left:
1. **Distress is a pure function that does not exist yet.** The whole proposal gives it a pause hook with nothing behind the hook. Ship blocker.
2. **Handover is specified but unpartitioned** until the list below is accepted, and "the name never leaves" is false when the name is in the story.
3. **Three kinds of "done" are loose:** Skip, Leave, Not now. This spec fixes them, but nothing is written to the owner's tests yet.

## 4. FINAL GRADE

GRADE: 61/100 (pass 1 was 42, pass 2 was 40)

Up 21. The lead adopted the derived position, the additive field, one clock with a mask of reasons, the checked saves and the hairline. I lost points because my own allowlist was incomplete, and because nothing is built.

## 5. BUILD SPEC (systems part)

### 5a. `obAct(profile)`, pure, host free, tested in `tests/engine.js`
Rules run in this order:
1. `ui.onboarded` or `ui.tutorialSeen` or `journey.handedAt` set: `done`.
2. `journey.start` empty and (entries or `meter.lines` exist): `done` (an older record onboarded by doing).
3. `journey.start` empty: `welcome` (Reel A, then the gate).
4. `story.entries` empty: `story`.
5. `meter.relLines` is 0: `release`.
6. else: `reading` (Reel B, the aftercare).

What closes `reading` is `ui.onboarded=true`, written when the person presses Keep this or Not now. Skip and Esc write nothing and land on the gate. "Leave" at the gate writes `ui.onboarded=true` (a refusal is a real event; without it a person who refuses is replayed for ever). Narrative's wording lands there too, and the lead's text is silent, so both are kept: Leave stores one boolean, Skip stores none. A release closed halfway commits nothing and says "Nothing was kept from that run." Guest never sees account fields, and handover is skipped, `handedAt` stays empty. `tutorialSeen` stays as a reader only.

### 5b. The timer (memory only, never stored)
- State `SL={k, ms, mask}`. Slides are rows in `OB_SLIDES`, found by `.k`, with `.kind` of `auto`, `gate` or `act`. Only `auto` has a clock.
- `slStep(SL, dtMs)` is pure and lives in the engine so tests drive a fake clock. The UI calls it once per frame from the existing `loop`, `dt = min(dt, 50)`. `ms += dt` only if `mask == 0` and the kind is `auto`. At `ms >= dwell` go to the next row.
- Mask bits: hold 1, hidden 2, user 4, focus 8, distress 16. `focus` is set only by `:focus-visible` on the Pause ring. `typing` is dropped, since acts have no clock.
- `SL_DWELL = {base:1.0, wps:2.5, min:3.0, max:7.0, step:0.5, rm:1.5}`. `dwell = ceil(clamp(base + words/wps, min, max) / step) * step`. Slides with a drawing take the larger of this and a stated `draw` seconds (the loop circle, one station a second: 4.0). Words are whitespace splits of the slide text, a digit run counts one. Reduced motion multiplies by `rm`. The lead ruled it, and I withdraw my pass 2 objection, because it is one data field and not a second formula.
- Length gate: sum of `auto` dwells from the table must be at most 30 s, and at most 45 s with `rm`. It prints the sum. With the current lines it reads 22.0 to 26 s depending on the proof row, read off the run.
- Tap: right two thirds next, left third restarts the slide, a second left tap within 1.5 s goes back a slide. Hold over 180 ms sets `hold`. Distress sets bit 16, shows the stop frame, and clears only on the person's own action.
- Hairline: 2 px, one segment per `auto` slide, 4 px gaps. The bar is written only when `floor(ms/dwell*200)` changes, with `scaleX`.

### 5c. Additive fields (no `SCHEMA_V` bump; that is the owner's call)
`journey:{start:'', handedAt:''}` in `blankProfile`. It must also be named in `validateProfile`, or it is deleted on the next load (the source says so at the summaries block). Refusals by name, never clamped:
- `journey.start is not a starting point this build knows: X`
- `journey.handedAt is not a date or empty`
- `ui.onboarded is not true or false`, the same wording for every `ui` key (today `!!v` turns `'banana'` into true)

`STARTS` is a 12 row table in `engine/data/`, keys stable strings, display order a separate field. The `ui` whitelist at `schema.js:877` is generated from `Object.keys(blank.ui)`. A missing `journey` is filled from the blank. A record fetched at sign in sets `handedAt`.

### 5d. Handover allowlist (names what leaves)
Blank keys read from the running engine, 25 plus `journey`.
- **HAND:** `story`, `axes`, `laws`, `intake`, `meter`, `history`, `work`, `gates`, `seed`, `avatar`, `purpose`, `rituals`, `practice`, `trace`, `summaries`, `soul` (a chosen invariant, `S.roots` is set from the UI and not from birth, but technical and owner confirm), `journey.start`.
- **STAY:** `v`, `id`, `name`, `created`, `updated`, `who` whole, `plan`, `ui`, `journey.handedAt`.
- Gate: every top level key, with `journey` counted as two paths, sits in exactly one list. A new key then forces a decision. Customer, subscription, email, key, secret, token stay refused by name.
- Distress is in neither list and never stored. Two phases, honestly reported: account created, then data pushed. A failed push leaves `handedAt` empty so it retries. Print: "The name you gave never leaves. Your own words do, once you keep this."

### 5e. Tokens and prefix
- Prefix `.sl-`, host `#sl`. `.ob-*` stays for the login only. Delete `.ob-word*`, `OB_AUTO`, `.ob-b`. Rename `.ob-a` and `.ob-qs` to `.fb-`. `obOpen`, `obClose`, `OB.open` keep their names.
- `--stage:#06060a` in `:root`, replacing the literal at `head.html:6332`. `#sl` re-points `--bg`, `--ink`, `--mid`, `--dim` to the dark theme values (`head.html:68,80`) so Punch and light cannot recolour it. Define `--hot:#c0392b` (the fallback it already carries).
- Type, lead's six values on the skin round names so one name has one value: 11 is `--fs-1`, 13 `--fs-3`, 16 `--fs-5`, 20 `--fs-6`, 28 `--fs-7`, and 44 is a new `--fs-9` (appended, never renumbered). No `--fs-` token is in `head.html` yet, so the build creates the whole table. Hero 44 above 640 px wide, 28 below, weight 300. Floor 16 for Skip and labels.
- Space `--sp-1..8`: 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: the lead says 10 and 999. I give both. Use `--r-s` (11) and add `--r-pill:999px` if absent: a value of 10 is a third near duplicate beside 8 and 11. If the owner wants 10, change `--r-s` once, not the stage.
- Motion: in is `--t-context` (420) on `--ease-out` with an 8 px rise, out `--t-element` (220) on `--ease-in`, land `--t-surface` (320) on `--ease-land` for seats only, breath `--t-breath`. Transit from login: fields 220, ring 420 together (the lead's 180 and 520 fail gate 12). Travel into the Field is 640 ms in the tick, not a CSS transition. Unlit seat: `color-mix(in srgb, var(--ink) 40%, transparent)`.
- Leaving: `OB_LEAVE_MS` reads `--t-element`; `.sl-leaving` sets `pointer-events:none`.

### 5f. Engine changes the build depends on
1. `journey` in blank and boundary, with three refusals and the generated `ui` list. 2. `obAct`. 3. `STARTS`, loaded before `schema.js` in `MANIFEST`. 4. `slStep`, `slDwell`, `SL_DWELL`. 5. A pure `distress(text)`, derived and never stored (J0, ship blocker). 6. `planSight` honours the gift (J8); `planSees` assertions in `tests/engine.js` change by name. 7. A read that reports zero hits, so the empty line shows. 8. `handoverPayload(profile)` with `HAND` and `STAY` and the partition gate; `fetch` stays in `ui/auth.js`. 9. `pSave()` and `pSnap()` results checked in `stCommit` and `relCoolDown` and reported through `status()`, draft kept. 10. No palette edit, so `equiv.py` shows only new names.

## 6. RANKED RECOMMENDATIONS

1. `obAct`, `journey`, three refusals, close rule. **M, redesign.** Moves Renata, Marcus, Whitney.
2. Distress function, the mask bit and stop frame. **L, redesign.** Moves Marta, Camille.
3. `slStep` in `loop`, mask, dwell row, length gate. **S, redesign.** Moves Whitney, Nils.
4. Handover partition and two phase report. **M, redesign.** Moves Camille, Nils, Sofia.
5. Checked saves and generated `ui` list. **S, reskin.** Moves Renata, Marcus.
6. Tokens and `.sl-` prefix, `#sl` re-point. **S, reskin.** Moves Nils, Whitney.
7. `planSight` gift. **M, redesign.** Moves Renata, Trey.

## 7. QUESTION FOR THE OWNER

None. Decisions: Leave stores one boolean and Skip stores none; the signal test answer is not stored until something reads it.
