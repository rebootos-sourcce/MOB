# Pass 3: systems director (Yuki Brennan), onboarding round PJ

Checked in source at HEAD `6fd2306`: `engine/schema.js`, `shell/head.html`, `ui/storyui.js:412`, `ui/release.js:876`. A token is a named value such as `--ink` that every screen reads. A boundary is the one door where stored data is checked.

## 1. THE PROPOSAL AS I UNDERSTAND IT

One black stage with the standing figure plays five silent slides on one clock, waits at a gate for one of twelve starting points, takes one sentence, runs a 12 line release, then shows an aftercare reel and lands on the Field. Position is never stored as a step; it is worked out from facts already stored. The merge kept my state design but lost two things. My handover list named nine keys and the blank profile holds twenty five, so a "every key in one list" gate fails on day one. And nothing says what closes the aftercare, so `obAct` could never leave `reading`.

## 2. THE ICP ROOM

- **Marcus (founder).** Sees a black room, a figure, one line. Taps twice, reaches the gate, picks a seat, writes. Stays, since no card asks for anything. Leaves if reload loses his choice; it is kept as `journey.start`. "It remembered where I was."
- **Whitney (phone only).** Sees 28 px type and a hairline. Holds to pause, and it pauses. Backgrounds the tab mid slide; the `hidden` reason must freeze the clock. Stays. "It waited for me."
- **Nils (skeptic).** Hunts for a seam: a theme recolouring the stage, a blur. Tokens block both. Stays if "112 addresses" is read off the engine, leaves if typed. "Show me it is real." It is a table row.
- **Camille (practitioner).** Reads the privacy line, then asks what happens with a dark sentence. She leaves unless the detector pauses everything and stores nothing. "Her people arrive in it."
- **Marta (distress, 02:00).** Sees a still screen, types something hard. The distress reason must stop the clock before any release voice. Without the detector she is talked at and leaves. "Please stop."
- **Renata (operator).** Reel, gate, one decision, 12 lines, no Next. Stays through the gift counter, the engine's own number. Leaves only if a failed save eats her sentence; it is kept and reported. "I wrote one line and it ran."
- **Trey (tourist).** Taps Guest, gets the reel, bounces at the story box. No account fields exist for Guest, so nothing blocks him and nothing is left behind. "I wanted the result."
- **Sofia (open tables).** Likes the seat names and proof row, finds `STARTS` and `SL_DWELL` are plain tables. Leaves if the handover is opaque, so print it. "Where is the list of what you send?" It is `HAND`.

## 3. UNIFIED QUALITY: 64/100

Gaps left:
1. The distress detector is a hook with no function behind it. Ship blocker.
2. The handover is unpartitioned until the list in 5d is accepted, and "the name never leaves" is false if the name is in the story.
3. Skip, Leave and Not now each mean something different and no test pins them.

## 4. FINAL GRADE

GRADE: 61/100 (pass 1 was 42, pass 2 was 40)

Up 21. The lead adopted the derived position, the additive field, one clock with a reason mask, checked saves and the hairline. Held back: my own list was incomplete and nothing is built.

## 5. BUILD SPEC (systems part)

### 5a. `obAct(profile)`, pure, host free, tested in `tests/engine.js`
In this order:
1. `ui.onboarded` or `ui.tutorialSeen` or `journey.handedAt`: `done`.
2. `journey.start` empty and (entries or `meter.lines`): `done` (an older record).
3. `journey.start` empty: `welcome` (Reel A, then the gate).
4. `story.entries` empty: `story`.
5. `meter.relLines` is 0: `release`.
6. else `reading` (Reel B).

Keep this or Not now writes `ui.onboarded=true`, which closes `reading`. Skip and Esc write nothing and land on the gate. "Leave" at the gate writes `ui.onboarded=true`, because a refusal is a real event and without it the person is replayed for ever. Narrative wants Leave to write nothing; both values are given and I recommend mine. A release closed halfway commits nothing and says "Nothing was kept from that run." Guest sees no account fields, and `handedAt` stays empty. `tutorialSeen` becomes reader only.

### 5b. The timer (memory only)
- `SL={k, ms, mask}`. Slides are `OB_SLIDES` rows found by `.k`, `.kind` is `auto`, `gate` or `act`. Only `auto` runs a clock.
- `slStep(SL, dtMs)` is pure and lives in the engine, so tests drive a fake clock. The UI calls it once per frame inside `loop`, `dt = min(dt, 50)`. `ms += dt` only if `mask == 0` and kind is `auto`; at `ms >= dwell` go to the next row.
- Mask bits: hold 1, hidden 2, user 4, focus 8, distress 16. `focus` is only `:focus-visible` on the Pause ring. `typing` is dropped; acts have no clock.
- `SL_DWELL={base:1.0, wps:2.5, min:3.0, max:7.0, step:0.5, rm:1.5}`. `dwell = ceil(clamp(base + words/wps, min, max)/step)*step`. A slide with a drawing takes the larger of that and its stated `draw` seconds (the loop circle: 4.0). Reduced motion multiplies by `rm`. The lead ruled it; I withdraw my objection because it is one data field.
- Length gate: sum of `auto` dwells at most 30 s, at most 45 s with `rm`. It prints the sum, read off the run.
- Tap: right two thirds next; left third restarts the slide; a second left tap within 1.5 s goes back one. Hold over 180 ms sets `hold`. Distress shows the stop frame and clears only on the person's own action.
- Hairline: 2 px, one segment per `auto` slide, 4 px gaps, `scaleX`, written only when `floor(ms/dwell*200)` changes.

### 5c. Additive fields (no `SCHEMA_V` bump; that is the owner's call)
`journey:{start:'', handedAt:''}` in `blankProfile` and named in `validateProfile`, or the next load deletes it. Refusals by name, never clamped:
- `journey.start is not a starting point this build knows: X`
- `journey.handedAt is not a date or empty`
- `ui.onboarded is not true or false`, same wording for every `ui` key (today `!!v` turns `'banana'` into true)

`STARTS` is a 12 row table in `engine/data/`, stable string keys, display order a separate field. The `ui` whitelist at `schema.js:877` is generated from `Object.keys(blank.ui)`. A missing `journey` is filled from the blank. A fetch at sign in sets `handedAt`.

### 5d. Handover allowlist (names what leaves)
- **HAND:** `story`, `axes`, `laws`, `intake`, `meter`, `history`, `work`, `gates`, `seed`, `avatar`, `purpose`, `rituals`, `practice`, `trace`, `summaries`, `soul` (a chosen value, not derived from birth; technical confirms), `journey.start`.
- **STAY:** `v`, `id`, `name`, `created`, `updated`, `who` whole, `plan`, `ui`, `journey.handedAt`.
- Gate: every top level key, `journey` counted as two paths, is in exactly one list. A new key forces a decision. Customer, subscription, email, key, secret and token stay refused by name.
- Distress is in neither list and never stored. Two phases, honestly reported: account made, then data pushed. A failed push leaves `handedAt` empty so it retries.
- Print: "The name you gave never leaves. Your own words do, once you keep this."

### 5e. Tokens and prefix
- Prefix `.sl-`, host `#sl`. `.ob-*` stays for the login only. Delete `.ob-word*`, `OB_AUTO`, `.ob-b`. Rename `.ob-a`, `.ob-qs` to `.fb-`. `obOpen`, `obClose`, `OB.open` keep names.
- `--stage:#06060a` in `:root`, replacing the literal at `head.html:6332`. `#sl` re-points `--bg`, `--ink`, `--mid`, `--dim` to the dark values, so Punch and light cannot recolour it. Define `--hot:#c0392b`, the fallback it already carries.
- Type (lead's six, on skin round names so one name keeps one value): 11 `--fs-1`, 13 `--fs-3`, 16 `--fs-5`, 20 `--fs-6`, 28 `--fs-7`, 44 new `--fs-9`, appended, never renumbered. No `--fs-` token exists in `head.html` yet. Hero 44 above 640 px wide, 28 below, weight 300. Floor 16 for Skip and labels.
- Space `--sp-1..8`: 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: lead says 10 and 999. Mine: `--r-s` (11) and `--r-pill:999px`, since 10 is a third near duplicate beside 8 and 11. If he wants 10, change `--r-s` once.
- Motion: in `--t-context` on `--ease-out` with an 8 px rise; out `--t-element` on `--ease-in`; land `--t-surface` on `--ease-land`, seats only; breath `--t-breath`. Login transit: fields 220, ring 420 together (180 and 520 fail gate 12). Travel to the Field is 640 ms inside the tick, not a CSS transition. Unlit seat: `color-mix(in srgb, var(--ink) 40%, transparent)`.
- `OB_LEAVE_MS` reads `--t-element`; `.sl-leaving` sets `pointer-events:none`.

### 5f. Engine changes the build depends on
1. `journey` in blank and boundary, three refusals, generated `ui` list.
2. `obAct`.
3. `STARTS`, before `schema.js` in `MANIFEST`.
4. `slStep`, `slDwell`, `SL_DWELL`.
5. Pure `distress(text)`, derived, never stored (J0).
6. `planSight` honours the gift (J8); `planSees` assertions change by name.
7. A read that reports zero hits, so the empty line shows.
8. `handoverPayload(profile)` with `HAND`, `STAY` and the partition gate; `fetch` stays in `ui/auth.js`.
9. `pSave()` and `pSnap()` results checked in `stCommit` and `relCoolDown`, reported through `status()`, draft kept.
10. No palette edit, so `equiv.py` names only new items.

## 6. RANKED RECOMMENDATIONS

1. `obAct`, `journey`, refusals, close rule. **M, redesign.** Renata, Marcus, Whitney.
2. Distress function, mask bit, stop frame. **L, redesign.** Marta, Camille.
3. `slStep` in `loop`, dwell row, length gate. **S, redesign.** Whitney, Nils.
4. Handover partition, two phase report. **M, redesign.** Camille, Nils, Sofia.
5. Checked saves, generated `ui` list. **S, reskin.** Renata, Marcus.
6. Tokens, `.sl-` prefix, `#sl` re-point. **S, reskin.** Nils, Whitney.
7. `planSight` gift. **M, redesign.** Renata, Trey.

## 7. QUESTION FOR THE OWNER

None. Decision: Leave stores one boolean, Skip stores none.
