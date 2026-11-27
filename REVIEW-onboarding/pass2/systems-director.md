# Pass 2: systems director (Yuki Brennan), onboarding and tutorial, round PJ

I read all eleven other pass 1 reports. Facts checked in source at HEAD `6fd2306`: `engine/schema.js`, `shell/head.html` tokens, `ui/login.js`. A token is a named value such as `--ink` that every screen reads. A boundary is the one door where stored data is checked.

## 1. AGREEMENTS (two or more seats, independently)

- **Full bleed stage, no card, no dimmed app.** Art, brand, creative, animation, innovation, technical, UX, game. Confirmed.
- **The first release is the onboarding and the first story is real.** Game, innovation, UX, creative, sales, brand, narrative. Today nothing is written on the default path (`DEV_PLAY_TUTORIAL=false`). Confirmed.
- **The clock never passes a decision or the story box.** Nine seats. Confirmed.
- **An unanswered question stores nothing.** Art, UX, narrative, game, creative. Confirmed, with a correction below.
- **The slider is silent; voice only on the release opening.** Animation, UX, brand, marketing, game, art, narrative. Confirmed.
- **Distress detection blocks the first story.** Narrative, innovation, creative, art. Confirmed.
- **Field paused while the slider is up** (technical, animation); **developer options behind `?dev=1`** (narrative, sales, marketing); **Skip lands on the starting point** (animation, UX, creative, marketing, art). Confirmed.

## 2. DISAGREEMENTS

- **Clock.** Technical: one delta clock in the existing `loop`. Animation: a `REEL.t` clock. My pass 1: CSS `animationend`. I withdraw mine: reduced motion removes the animation, the event never fires, and the sequence freezes silently. Technical's wins.
- **Does leaving set `onboarded`?** UX: nothing until a release is done. I take a middle line: Skip sets nothing; an explicit "take me to the app" sets it, so a person who refuses is not replayed forever.
- **"Unanswered" stored as a word (narrative).** No. Store empty. A value written for an event that did not happen is a guess stored as a fact.
- **Signal test position.** I take after the first release (marketing, creative, game). A test whose answer nothing reads must not gate a first run.
- **Palette.** Change the shipped `PAL` once, in `engine/data/canon.js`, not only on the stage. Two palettes are two truths.
- **Progress mark.** Hairline segments, not a ring of arcs. The release screen already has an address ring; a second ring with another meaning is one shape, two jobs.
- **My own pass 1 errors.** `ground` collides with the engine's "new ground"; the field is `journey.start`. `--r-card` duplicates `--r`; dropped.

## 3. WHAT I MISSED

- **The first story can read as nothing** (sales, narrative ran the engine): "I keep taking care of everybody else." gives zero hits. The position waits on the stored entry, not on a reading.
- **Distress is invisible to the engine.** Its result is a health inference: derive it, show it, never store or hand it over.
- **The gift counter is derived** from `planAllowance` (`left`, `of`, `inGift`). Sales found `planSight` ignores the gift: an engine defect.
- **`tutorialSeen` and `onboarded` are two flags for one fact.**

## 4. THE PROPOSAL, TOGETHER (my part: state, boundary, tokens, prefix)

### 4a. The position is derived. Nothing stores a step.

One pure engine function, `obAct(profile)`, host free, tested in `tests/engine.js`:

| Order | If | Returns |
|---|---|---|
| 1 | `ui.onboarded` or `ui.tutorialSeen` or `journey.handedAt` | `done` |
| 2 | `journey.start` empty and (entries or `meter.lines` exist) | `done` (an older record; they onboarded by doing) |
| 3 | `journey.start` empty | `welcome` (slides, then the starting point gate) |
| 4 | `meter.relLines` above 0 | `reading` (aftercare not closed) |
| 5 | `story.entries` not empty | `release` |
| 6 | else | `story` |

- `loginEnter()` asks `obAct` and goes to that act. One state machine for `#login`, the slider, the story stage, the release and aftercare. `DEV_PLAY_*` move behind `?dev=1`.
- Reload resumes at the right act. In `welcome` the slides replay from slide one; Skip is one tap.
- A release closed halfway commits nothing, so the act stays `release`. Say so on the stage: "Nothing was kept from that run."
- A record fetched at sign in sets `handedAt` on load, so a new device does not replay.
- Slides are keyed by `.k`, never by index. Skip goes to the slide whose `.kind` is `gate`, found by lookup. Order is `OB_SLIDES` array order and moves freely.

### 4b. The timer is memory only

```
SL = { k, ms, why:{hold,hidden,focus,typing,user,distress} }
```
- `slTick(dtMs)` runs once per frame inside the existing `loop`, `dt` clamped to 50 ms. If `why` is empty and the slide `.kind` is `auto`, `ms += dt`; at `ms >= dwell(slide)` advance. Plain numbers in, so gates drive a fake clock.
- `.kind` is `auto`, `gate` or `act`. Gates and acts have no clock.
- Reasons are separate so release of one does not resume another: `hold` is a finger down, `user` is the latched pause button, `hidden` is a background tab, `focus` is any control focused, `typing` is the story box, `distress` is a hook the detector sets.
- Remaining time and progress are derived: `ms / dwell`. The bar writes only when `floor(ms / dwell * 200)` changes.
- Dwell is one row of data, `SL_DWELL = {base:1.2, wps:2.8, min:3.0, max:7.0}` seconds: `dwell = clamp(1.2 + words / 2.8, 3.0, 7.0)`, rounded to 0.1. Reason: 2.8 words a second is the animation seat's measured reading ceiling and sits between narrative's 2.5 and creative's 3. Reduced motion does not change it (a multiplier is a second formula; timing is reading, not movement), and the pause control is visible from frame one.
- Length: a gate computes the sum of `auto` dwells from the table and fails above 30 s. Target about 28 s, five passive slides, then the gate. I reject 70 s because the signal test leaves the first run.
- Never stored: `SL`, `ms`, remaining time, the gift count, offered patterns.

### 4c. Additive profile fields (no version bump; `SCHEMA_V` is already 2, any bump is the owner's)

```
journey: { start: '', handedAt: '' }
```
- `start` is a key in a 12 row `STARTS` table (`engine/data/`). Keys are stable strings, never renumbered. Display order is a separate field. Pain in and Fatigue out are rows.
- `handedAt` is an ISO date, set only on the server's acknowledgement or a fetch at sign in.
- Boundary refusals, by name, never clamped:
  - `journey.start is not a starting point this build knows: X`
  - `journey.handedAt is not a date or empty`
  - `ui.onboarded is not true or false` (same for every `ui` key; today `!!v` turns `'banana'` into true)
- A missing `journey` is an older record and is filled from the blank.
- The `ui` whitelist at `schema.js:877` is a typed second copy of the blank's keys and has already drifted (`chmask`). Generate it from `Object.keys(blank.ui)`.
- The signal test answer is not stored until something reads it. If a reader is named later, one field `journey.felt` of `yes`, `no`, `none`, empty. Empty means unanswered.
- The first story's draft lives in `STORE` per viewer until the commit lands, then is cleared. Escape on typed words asks first.
- `pSave()` failure in `stCommit` and `relCoolDown` is reported through `status()` and the draft is kept. Both ignore it today.

### 4d. The handover is a projection by allowlist

The push is built by naming what leaves, never by deleting what stays.
- **Leaves:** `story.entries`, `axes`, `laws`, `intake`, `meter`, `history`, `work`, `gates`, `seed`, `journey.start`.
- **Stays:** `who` whole (name parts and birth), `name`, `id`, `plan` (written by the record store, never by the app), `ui`, `journey.handedAt`, `soul.roots` until technical confirms it is not derived from birth. Never present anywhere: customer, subscription, email, key, secret, token (already refused by name at `schema.js:1002`).
- A gate asserts every top level key of the blank profile sits in exactly one of two lists, `HAND` or `STAY`. A new key then forces a decision instead of leaking.
- The distress result is derived from the text and appears in neither list. It is never stored.
- Password and email live in memory from the door to submit and are never written beforehand. Two phases, honestly reported: account created, then data pushed. If the push fails, say so and leave `handedAt` empty so it can retry.
- The privacy line must be true. "The story leaves the device. The name never does" fails if the person typed a name into the story. Print: "The name you gave never leaves. Your own words do, once you keep this." Technical agrees the endpoint.

### 4e. Tokens and class prefix

- **Prefix `.sl-`, host `#sl`.** `.ob-*` keeps only what the login still uses. Dead rules go: `.ob-word*`, `OB_AUTO`, `.ob-b`. The feedback widgets `.ob-a` and `.ob-qs` in `ui/account.js` are renamed to `.fb-` so one prefix names one concept. `obOpen`, `obClose` and `OB.open` keep their names because gates call them.
- **Type, new:** `--fs-1:12px; --fs-2:16px; --fs-3:18px; --fs-4:28px; --fs-5:40px`. 40 at 1600, 28 at 390 for the hero (UX, creative, brand agree); 16 is the floor for labels. Hero weight 300, body 400. The art director may move values, not names.
- **Space, new:** `--sp-1..8` on the 4 px grid: 4, 8, 12, 16, 24, 32, 48, 64.
- **Radius:** reuse `--r` (16), `--r-s` (11). Add none.
- **Ground and ink:** one new role `--stage:#06060a`, the login's own black, replacing the literal at `head.html:6332`. Themes (Punch, light) must not recolour the stage, so `#sl` re-points `--bg`, `--ink`, `--mid`, `--dim` to the dark values in one block. Seat hues come only from the seat tokens, never retyped `rgba`. Define `--hot` (it is referenced with a fallback and defined nowhere).
- **Motion verbs map to tokens that exist:** in is `--t-context` (420 ms) on `--ease-out` with an 8 px rise; out is `--t-element` (220 ms) on `--ease-in`; land is `--t-surface` (320 ms) on `--ease-land`; breath is `--t-breath` on `--ease-breath`; hold resume ramp `--t-element`. No new duration. The animation seat's 520 ms, 380 ms and 900 ms values fall outside gate 12's allowed set and must be re-fit to these.
- **Leaving:** `OB_LEAVE_MS` reads `--t-element`, and `.sl-leaving` sets `pointer-events:none`.
- **Needs agreeing:** type values with art; verbs with animation; the cue and slide copy with narrative; endpoint and `soul.roots` with technical; the distress frame with narrative and a clinician.

## 5. REVISED GRADE

GRADE: 40/100 (was 42)

Down two. The first story can be stored and still read as nothing, which weakens "data chain". Distress cannot be seen by the engine, which weakens "privacy structure" and "failure reporting". `tutorialSeen` and `onboarded` are two flags for one fact. Nothing in the other reports raised a score, because none of it changes what is stored today.

## 6. TOP 5 RECOMMENDATIONS

1. **`obAct` and `journey` with the three named refusals; one first-run state machine. (M.)** Moves all, most the returning phone arrival and the person on a new device.
2. **One clock `slTick` in `loop`, reason set, dwell row, 30 s gate. (S.)** Moves phone only, the person in acute distress, the skeptic.
3. **Distress detector as a pure engine function that sets reason `distress`, derived and never stored. (L, ship blocker.)** Moves the person in acute distress; practitioners.
4. **Handover allowlist with the `HAND` or `STAY` partition gate, and two phase honest report. (M.)** Moves the practitioner, the skeptic.
5. **Report failed writes (`stCommit`, `relCoolDown`), generate the whitelist, retire `tutorialSeen` as a reader-only legacy flag. (S.)** Moves everyone who loses a first story.

## 7. QUESTION FOR THE OWNER

None. Decision: the signal test leaves the first run and nothing is stored from it until something reads it, because the first run must reach one release and a stored answer nobody uses is clutter in a record that is about to leave the device.
