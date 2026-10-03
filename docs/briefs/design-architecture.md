# Atüned / SOURCE: architecture and data flow

For the desktop port team. Read this beside the art and UX brief. It covers
how the modules fit together, where state lives, where data crosses a boundary,
and which rules the structure enforces. The scoring arithmetic, the
gamification and the screens are covered in their own sections and only
touched here where the data flow runs through them.

Everything below was read off the source, not off the project's prose. Where
the prose and the code disagree, the code is what is described and the
disagreement is listed in section 10. Line numbers are as of commit `eb788a2`
(25 September 2026, clean tree, `source.html` md5
`26ff48bd4f111fa1dcd90822d6c62778`). Every claim marked **measured** was run
against that build on that day, in node against `engine.js` or in Chromium
against `source.html`.

---

## 0. The shape in one paragraph

The product is one HTML file with no dependencies and no network. It is built
by concatenating about fifty source files, in an order fixed by one file
(`atuned_src/MANIFEST`), into one `<script>` block. The code is split into two
halves. The **engine** (`atuned_src/engine/`) holds data tables, arithmetic,
the profile schema and persistence logic, and may not touch the browser. The
**UI** (`atuned_src/ui/`) holds renderers and wiring, and is the only half
allowed a `document`. The engine keeps its working state in a handful of
module level globals, the largest being `S`. A person's data is a **profile**
object. Many profiles live in one array (`PROFILES`), one is current (`CURP`),
and the whole array is written as one JSON string under one storage key. The
engine never knows what storage is: the host hands it a `get` and a `set`
through `bindStore`. Every profile that comes off the disk or out of a paste
goes through one validator (`validateProfile`), which refuses a malformed field
by name instead of repairing it. The UI moves between surfaces through one
function (`setTab`), keyed by permanent integers.

Three hosts run the same engine today:

| Host | How it gets the engine | Binds storage? |
|---|---|---|
| `source.html`, the app | concatenated into the page by `BUILD.sh` | yes, `localStorage` via `bindStore` (`ui/ui.js:987`) |
| `funnel/quiz.html`, the web quiz | `<script src="../engine.js">` (`funnel/quiz.html:208`) | no. It keeps its own answers under its own key and uses the engine's `saveProfile` to write the handoff file (`funnel/quiz.html:575`) |
| `tests/engine.js`, node | `require('engine.js')` | binds in-memory stores per test (`tests/engine.js:442`, `:739`) |

That third column is the whole reason the engine is host free, and the desktop
build is a fourth host.

---

## 1. The build, and why the load order is load bearing

### 1.1 The literal order

`atuned_src/MANIFEST`, in full, as it stands:

```
shell/head.html
shell/body.html
shell/guard.html
engine/data/nodes.js
engine/data/figure.js
engine/data/nerves.js
engine/data/canon.js
engine/data/compass.js
engine/data/ages.js
engine/data/practice.js
engine/data/people.js
engine/data/catalog.js
engine/data/kb.js
engine/data/cards.js
engine/verp.js
engine/lexicon.js
engine/core.js
engine/expression.js
engine/undo.js
engine/compute.js
engine/plan.js
engine/avatar.js
engine/schema.js
engine/intake.js
engine/sniff.js
engine/astro.js
engine/birth.js
engine/numerology.js
engine/seed.js
engine/read.js
engine/ladder.js
engine/outbox.js
engine/export.js
ui/component.js
ui/tip.js
ui/wheel.js
ui/map.js
ui/mapshelf.js
ui/imprints.js
ui/storyui.js
ui/summary.js
ui/analytics.js
ui/intakeui.js
ui/release.js
ui/ritual.js
ui/cone.js
ui/drills.js
ui/knowledge.js
ui/record.js
ui/games.js
ui/panels.js
ui/account.js
ui/personas.js
ui/onboard.js
ui/ui.js
shell/foot.html
```

Note `shell/guard.html` between the body and the first data file. The
project's own summary lists the shell as head, body, foot; there are four.

### 1.2 What the build does with it

`atuned_src/BUILD.sh`:

1. Runs `node --check` on every `.js` module on its own. Nothing is joined
   until every file parses.
2. Concatenates the files in MANIFEST order into `source.html`, and after each
   `.js` file injects one line:
   `try{window.__at&&window.__at('engine/schema.js');}catch(e){}`. This is a
   checkpoint: the boot guard remembers the last module that finished, so a
   stalled start up reports "stopped after engine/schema.js" instead of
   "stopped somewhere".
3. Replaces `BUILD_STAMP` with the short commit and UTC time, and `BUILD_LEN`
   with the file's byte length, zero padded to nine characters so writing it
   cannot change it. It fails if either placeholder is missing.
4. Checks that every `<div` has a `</div>` and that there is no em dash
   anywhere in the output.
5. Regenerates the funnel's colour tokens from the app's (`tools/tokens.py`)
   so the two cannot drift.
6. Writes a comment-stripped delivery copy (`tools/slim.py`). Separately,
   `tools/pack.js` gzips and base64s the whole build into a small loader that
   inflates it with `DecompressionStream`, because the file kept arriving
   truncated in transfer and a truncated gzip stream fails loudly where a
   truncated script half runs.

`atuned_src/BUILD-engine.sh` concatenates only the `engine/` lines of MANIFEST,
in the same order, into `engine.js`, runs `hostfree.py` on it (section 2), and
`require`s it in node to prove it loads.

### 1.3 Why order matters: one script tag

The script block opens on the last line of `shell/guard.html` (`<script>` at
line 181) and closes on the first line of `shell/foot.html`. **Every module is
inside one `<script>` element.** That has four consequences, and they are the
real content of "data before engine, engine before renderers, renderers before
ui":

- **`function` declarations hoist across the whole block.** `schema.js` calls
  `seedValid`, which is declared later in `seed.js`, and that works, because
  the call happens at run time and the declaration was hoisted at parse.
- **`var` hoists as `undefined`.** A top-level statement that reads a `var`
  declared in a later file reads `undefined` and carries on, silently.
- **`const` and `let` are in the temporal dead zone until their line runs.**
  A top-level statement that reads one declared in a later file throws, and
  a throw at top level stops every statement after it in the block. Two
  comments in the source record this exactly: `core.js:188` explains that
  `LAW_DEFAULT` is declared in `core.js` rather than `schema.js` because
  `core.js` uses it at top level before `schema.js` exists; `ui/panels.js:6`
  explains that `svgI` moved into `component.js` because it is a `const` and a
  renderer loading earlier would throw on it.
- **A syntax error anywhere kills the whole block.** Nothing in it runs,
  including any guard written inside it.

Top-level statements that execute at load, and therefore depend on order,
include: `core.js` building the derived indexes (`SOM`, `FIELD`, `W`, `BY`,
the unnamed saboteur clusters) from `NODES`, `BANDS`, `SAB_LIB` in
`data/canon.js` and `data/nodes.js`; `schema.js:354` walking `PRACTICE` to
build `RIT_TRACK`, `RIT_STEP` and `RIT_MIN_MAX`, and `schema.js:423` reading
`C3_BAND` from `data/cards.js`; `ui/component.js:199` grabbing the `#cv` and
`#bgaura` canvases; `ui/panels.js:47` building the charge and law sliders into
`#chg` and `#laws`; `ui/personas.js:312` unshifting a "You" persona onto the
engine's `PEOPLE` table and building the profile picker. The UI files touch
the DOM at load, which is why the shell's markup comes before the script: the
document already exists when they run.

### 1.4 The failure mode that does not throw (measured)

Order also decides *which binding a load-time read sees*, and that failure is
silent. `ui/panels.js:901`, at load, reads the stored density:
`var k=densGet(); if(k)document.body.classList.add('dens-'+k);`.
`densGet` reads through the engine's `STORE`. The browser's store is bound in
`ui/ui.js:987`, which loads after `panels.js`. So at the moment `panels.js`
asks, `STORE` is still the engine's no-op and returns `null`.

**Measured in Chromium:** `densSet('wide')` writes `"wide"` to
`localStorage['dens']`; after a reload `densGet()` returns `"wide"` but the body
does not carry `dens-wide`. The stored density is never applied at boot.

For the port: this is the class of bug a module system with explicit imports
and an explicit boot sequence removes. If the desktop build keeps the
concatenation, keep MANIFEST as the single source of order and make "binds the
host" the first thing that runs, before any UI module reads state.

### 1.5 The boot guard

`shell/guard.html` is its own `<script>` block, deliberately, so it survives
a parse failure in the main block. It:

- installs `window.__at(file)` (the checkpoint above) and
  `window.__bootOk(failed)`;
- listens for `error` and `unhandledrejection` until boot completes;
- after 8 seconds without `__bootOk`, paints a full-screen report naming the
  build stamp, whether the file arrived whole (it looks for the `#eof` marker
  that `foot.html` puts last in the document, carrying `data-len`), the last
  module that finished, the error and the user agent.

`ui/ui.js:1042` runs start up as named steps, each in its own try/catch, and
hands any that failed to `__bootOk`, which shows a quiet one-line notice rather
than the full-screen one. The steps, in order (`ui/ui.js:1051` to `:1096`):
`layout`, `matrix key`, `rail sections`, `first profile` (`loadP(0)`),
`the stored record` (`pStore`, `pNew` if empty, `CURP=PROFILES[0]`,
`loadProfile(CURP)`, sync the sliders), `opening surface`
(`setTab(TAB.FIELD)`), `onboarding`. Then `requestAnimationFrame(loop)` outside
the steps, then `__bootOk(BOOT_FAILED)` as the last statement.

---

## 2. The engine and the host

### 2.1 What host free means, concretely

`atuned_src/hostfree.py` runs on the built `engine.js`. It strips block
comments, whole-line `//` comments and all string and template literals
(because a comment naming `localStorage` is not a call, and the lexicon data
legitimately contains the word "window"), then fails the build on any of these
tokens:

```
document  window  navigator  localStorage  sessionStorage
requestAnimationFrame  alert  fetch  XMLHttpRequest
AudioContext  webkitAudioContext  speechSynthesis
SpeechRecognition  webkitSpeechRecognition  new Image
```

The speech globals are there on purpose: in Chrome, `SpeechRecognition` is a
network service that sends microphone audio to the browser vendor, which the
product promises never happens. (`tests/README.md` lists an older, shorter
version of this set.)

What it does **not** forbid: `Date`, `Math.random`, `setTimeout`, `JSON`. The
engine uses `new Date()` for timestamps and `Date.now()`/`Math.random()` for
profile ids (`schema.js:15`). The engine is host free, not deterministic in
time.

### 2.2 The engine's contract

`engine/export.js` is the last engine file. In node it assigns
`module.exports` with every table and function a caller may use. In the
browser the same names are simply globals on the one script. Two details
matter for anyone reimplementing a host:

- `S` is exported **by reference**. A host that holds `E.S` holds the live
  working state.
- `PROFILES` and `CURP` are exported as accessor functions
  (`profiles()`, `current()`), because they are reassigned (`PROFILES=pStore()`)
  and `module.exports` would capture the old array.
- `TAB` is exported. `TABDEF`, `TABOF`, `TABREAL` and `TABEXTRA` are not:
  they are declared in `engine/core.js` but only the browser reads them.

### 2.3 The seams: where a host plugs in

There are three, all the same pattern: a module-level slot holding a host
function, a `bind*` setter, and callers that report honestly when nothing is
bound.

| Seam | Declared | Slot | What unbound means |
|---|---|---|---|
| `bindStore(get,set)` | `engine/schema.js:193` | `STORE`, `STORE_BOUND` | `STORE` is a no-op whose `set` never throws. `pPersist` refuses with `SAVE_ERR='NoStore'` rather than reporting a save it did not make (`schema.js:246`). |
| `bindSend(fn)` | `engine/outbox.js:94` | `SEND_HOST` | `obDrain` returns state `'nohost'`. Envelopes stay queued; the UI says "Held on this device", never "sent". |
| `bindPlan(fn)` | `ui/panels.js:857` (UI side, not engine) | `PLAN_HOST` | `planOpen` reports "Billing is not connected yet" through `status()`. |

`bindStore` exists as a function rather than an assignable export for a
recorded reason (`schema.js:191`, `ui/ui.js:982`): assigning `STORE` directly
left `STORE_BOUND` false, so every save in the shipped app refused and
reported a failure it had caused.

The browser binding, in full (`ui/ui.js:987`):

```js
try{ localStorage.getItem(PKEY);
 bindStore(function(k){return localStorage.getItem(k);},
           function(k,v){localStorage.setItem(k,v);}); }catch(e){}
```

The probe read first means a browser that blocks storage throws here, the
store stays unbound, and every later save says so.

### 2.4 Storage keys

Everything the product keeps on the device, through `STORE`:

| Key | Written by | Holds |
|---|---|---|
| `source.profiles` (`PKEY`, `schema.js:13`) | `pPersist` | the whole `PROFILES` array plus any raw records the boundary refused (`STORE_KEPT`), as one JSON string |
| `source.outbox` (`OBKEY`, `outbox.js:17`) | `obQueue`, `obDrain` | queued support, bug, rating and feedback envelopes |
| `dens` | `ui/panels.js:618` | the density choice. The UI reaches through the engine's `STORE` directly for this one. |

Nothing else persists. In particular the theme (`S.theme`) is **not persisted**
(measured: `setLighting('snow')`, reload, `S.theme` reads `'dark'`), and
neither is the current tab, the undo history or any view state.

---

## 3. State shape

### 3.1 The profile record

A profile is created by `blankProfile(name)` (`engine/schema.js:14`). This is
the complete shape at schema version 2. "Stored" means written to disk;
"derived" means recomputable from other fields.

| Field | Type and shape | Written by | Notes |
|---|---|---|---|
| `v` | number, 1 or 2 | `blankProfile`, `saveProfile` stamps `SCHEMA_V` | v2 added `gates`. A v1 record loads with gates absent read as zero. Saving upgrades it. The bump is the owner's call; it is the cross-compatibility contract with the SOURCE book. |
| `id` | string, `'p'+base36 time+4 random` | `blankProfile` | The only identity a record has. Undo history and the persona mirror key on it. |
| `name` | string | `blankProfile`, account surface | Profile label, not the person's legal name. |
| `created`, `updated` | ISO strings | `blankProfile`, `saveProfile` | |
| `soul` | `{doms:[int], arcs:[int], roots:[string]}` | `saveProfile` from `S` | Indexes into `DOMAINS` (19) and `ARCH` (12). |
| `axes` | `{Fear:{held,opp}, ...}` for the nine child fetters in `CHILD` | `saveProfile` from `S.charge`/`S.replace` | 0 to 10 each. `held` is charge, `opp` is the installed opposite. |
| `laws` | `{Truth: number or null, ...}` for the 21 in `SI` | `saveProfile` (guarded), `iqApply` | `null` means not yet measured, and that is load bearing: the "unread" state counts non-null laws. |
| `who` | `{first, middle, last, sex, sealed, born:{date, time, place, timeUnknown}}` | intake surface | Identity and birth moment. Nothing derived from them (astrology, numerology) is stored. |
| `ui` | `{quiet:bool, model:bool}` | `uiSet` in `ui/account.js:331` | Reduced motion, and consent to use stories to refine models (off by default). |
| `seed` | `null` or `{type, at, axes:{...}}` | `seedApply` | A stated four-letter type and the charge it wrote. |
| `meter` | `{lines, unique:[key], firsts:[{k,t,nm}], first, last}` | `meterRun`, `meterFirst` | `unique` is the list of pattern keys ever opened (`node:channel:line`). Stored rather than derived by ruling, because the tier gate must agree with the app about what was run. |
| `plan` | `{tier, status, granted, carried, base, since, until}` | the record store, never the app | Processor vocabulary so a record round trips without translation. Carries no customer id, subscription id, email or key. |
| `avatar` | from `avatarBlank()`: `{built, at, reviewedAt, pairs:[{be, notbe}]}` | avatar surface | |
| `purpose` | from `purposeBlank()`: `{soul:[3], ego:[3], sides:{partner..alone:[<=5]}}` | avatar surface | |
| `intake` | `{answers:{0..62: number}, done:[lawName], startedAt, completedAt}` | intake surface, `iqApply` | 63 answers, three per law. |
| `gates` | `{verp:{aware, detach, intent, ignore, attach, averse}, lean:{benign, malignant}}` | `gatesSave` | Counts of cue sentences from stories. A cost multiplier on every held pattern. |
| `story` | `{entries:[{t, text, imprints, bands}]}` | story commit (`ui/storyui.js:102`) | The person's own words, verbatim. `imprints` and `bands` are what the reading said at the time and are never recomputed. |
| `rituals` | `[{t, track, band, steps:[practiceKey], min, when, where, done}]` | ritual surface | `done` is a boolean from the builder or an ISO stamp from "mark done". A missing `done` is read as practised (older records). |
| `history` | `[{t, cq, dq, sq, pole, jq, rad, loaded, sab, cx, hy, ch, dark, tier, arch}]` | `pSnap` via `snapshot()` | Derived readings, stored on purpose: a snapshot is what the record plotted at the time and cannot be recomputed after the inputs move. |

Fields written onto a record that are **not** in this shape do not survive a
reload; see 4.4 (`onboarded`).

### 3.2 The working state `S`

Declared at `engine/core.js:141`. The engine never computes from a profile
directly. `loadProfile(p)` copies a profile's inputs into `S`, everything
computes from `S`, and `saveProfile(p)` copies `S` back. `S` mixes three kinds
of thing:

| Kind | Fields | Persisted? |
|---|---|---|
| **Field inputs** | `charge{}`, `replace{}`, `law{}`, `dom`, `doms[]`, `arcs[]`, `roots[]`, `a1`, `a2` | yes, through `saveProfile` into `axes`, `laws`, `soul` |
| **Identity pointers** | `who` (persona index), `rec` (id of the record `S` was filled from) | no |
| **View state** | `tab`, `theme`, `hover`, `pin`, `atom`, `view`, `zoom`, `panx`, `pany`, `t` (animation clock) | no |

Two more pieces of working state sit beside `S` and are read by compute:

- `DOMAIN` (`core.js:199`, a `let`): a 19-slot array rebuilt by `buildSoul()`
  from `S.doms`, `S.arcs`, `S.roots`.
- The node objects themselves. `W` (the somatic wheel, `core.js:7`) is an
  array of references into `NODES`, and `suscAll()` and `compute()` **write
  onto those objects**: `n.susc`, `n.held`, `n.rep`, `n.sq`, `n.pole`, `n.jq`,
  `n.open`. Renderers then read `n.sq` straight off `W` (for example
  `ui/ui.js:863`, `ui/personas.js:549`). The wheel renderer adds its own
  `n.disp` for animation (`ui/wheel.js:1035`).

The honest opening state: every charge 0, every law `LAW_DEFAULT` (6) in `S`
but `null` on the profile, so the reading reports `unread` and surfaces show
entry doors instead of a tier.

### 3.3 Other module-level state

| Name | Module | What it holds |
|---|---|---|
| `PROFILES`, `CURP` | `schema.js:182` | the person's record list and the current record |
| `LAW_UNSET`, `LAW_SEED` | `schema.js:78` | which laws arrived unmeasured and what placeholder they got, so `saveProfile` does not turn 21 placeholders into 21 measurements |
| `STORE`, `STORE_BOUND`, `SAVE_OK`, `SAVE_ERR` | `schema.js:190`, `:244` | the bound store and the result of the last write |
| `STORE_REFUSED`, `STORE_KEPT` | `schema.js:213` | what the boundary refused on the last load, and the raw bytes kept to write back |
| `IMPORT_ERR` | `schema.js:1012` | why the last `pImport` failed |
| `VERPMIX`, `LEANMIX` | `verp.js:16`, `:333` | gate evidence accumulators. `verpFactor()` reads `VERPMIX`; `compute()` multiplies resistance by it |
| `UNDO`, `REDO` | `undo.js:58`, `:69` | history stacks keyed by record id |
| `SEND_HOST` | `outbox.js:93` | bound send function |
| `PLAN_HOST` | `ui/panels.js:856` | bound billing opener |
| `PEOPLE`, `PROF_BY` | `data/people.js:8`, `ui/personas.js:328` | the demo persona table, and one scratch profile per persona |

### 3.4 Multiple profiles, and the current one

- **One key, one array.** `pPersist()` (`schema.js:245`) writes
  `PROFILES.concat(STORE_KEPT)` as one string under `source.profiles`. There is
  no per-record write. A save of one record rewrites all of them.
- **Reading.** `pStore()` (`schema.js:214`) parses the key and runs every raw
  record through `validateProfile`. Good ones are returned. A refused one is
  recorded in `STORE_REFUSED` (for a host that wants to say so) and its raw
  bytes are kept in `STORE_KEPT` and written back on every persist, so a record
  this version cannot read survives for a version that can. It is never loaded
  and never shown.
- **Creating.** `pNew(name)` pushes a blank, points `CURP` at it and persists.
- **Saving.** `pSave()` (`schema.js:271`) copies `S` into `CURP` with
  `saveProfile`, refuses with `SAVE_ERR='NotARecord'` if `CURP` is not in
  `PROFILES`, otherwise persists. `pSnap()` pushes a derived `snapshot()` onto
  `CURP.history` and persists.
- **Switching.** There is no single switch function. `CURP` is reassigned at
  boot (`ui/ui.js:1061`), by the intake surface's record switcher
  (`ui/intakeui.js:353`, then `loadProfile`), by `pNew`, by `pImport`, by
  delete (`ui/account.js:353`), by `toYou()` and by `loadP()`.

**The persona system is a second route into `S`.** The app ships demo
personas (`PEOPLE` in `engine/data/people.js`) that a person can load to see a
worked example. `ui/personas.js:312` unshifts a "You" entry onto the front of
`PEOPLE` at load, so **in the browser `PEOPLE[0]` is "You", and in node
`PEOPLE[0]` is the first demo persona**. `S.who` is an index into that array,
and `S.who===0` is the app's claim that `S` holds the person's own field.

- `loadP(i)` (`ui/personas.js:454`) fills `S` from the persona table directly,
  **not** through `loadProfile`. It creates or reuses a scratch profile in
  `PROF_BY[name]`, points `CURP` at it, and only for "You" is that profile
  pushed onto `PROFILES`. Demo personas never enter the record list.
- `toYou()` (`:360`) returns to the person's own record before any write, so a
  slider moved while a demo is loaded lands on the person's record, not the
  demo's.
- `saveYou()` (`:399`) mirrors `S` into `PEOPLE[0]` only if `S.rec` matches
  the "You" record id, then schedules `persistYou()`, a 400 ms debounced
  `saveProfile` plus `pPersist`, flushed on `pagehide` and
  `visibilitychange` (`:435`).
- `S.rec` exists because `S.who` cannot tell two of the person's own records
  apart: all of them are `who 0`. The record id can.

For the port: `S.who` is a position in a list that a UI module reorders at
load. It is exactly the pattern the TAB rule (section 6) forbids. Key personas
by name or id. Better still, make a demo persona an ordinary read-only profile
that goes through `loadProfile` like everything else, so there is one route
into the working state instead of two.

### 3.5 Stored, derived, and both

The standing rule is that a derived value is never stored, because storing it
creates two truths. The code mostly holds to it. Where it does not:

- **`laws` has two writers.** The tools panel sliders write `S.law` and
  `saveProfile` persists it. `iqApply(p)` (`engine/intake.js:64`) overwrites
  `p.laws[name]` and `S.law[name]` with the intake score whenever all three
  answers for a law exist. So a hand-set law is silently replaced the next time
  anything calls `iqApply`, and `renderIntake()` calls it on every render
  (`ui/intakeui.js:167`). Whether the intake or the slider owns a measured law
  is not decided anywhere in the code. DECISIONS.md lists "whether the tools
  panel lock after intake is retroactive" as open, which is the same question.
- **`intake.done` is stored and derived.** `iqApply` rewrites it from the
  answers every time. It is stored anyway, and the boundary copies it without
  checking its contents (4.4).
- **`history` is derived and stored by design** (see the table). That is
  correct: a snapshot is a record of what was said at the time.
- **`meter.unique` is stored by ruling; spend is never stored.** Spend is
  always `unique count - plan.base - plan.carried`, so the allowance cannot
  drift from the count (`engine/plan.js:150`).

---

## 4. Validation at the boundary

### 4.1 The rule

`validateProfile(o)` (`engine/schema.js:577`) is the one door for any profile
that did not come from this session's own code: every record read from disk
(`pStore`) and every paste or file (`pImport`). The rule it states:

- **A missing field is an older profile** and is filled from `blankProfile`.
  `null` counts as missing for `avatar`, `purpose`, `rituals`, and `laws[x]`
  (`schema.js:727`).
- **A field of the wrong type, or out of range, is refused by name.** The
  error string carries the path: `"axes.Fear.held is 9999, outside 0 to 10"`,
  `"plan.tier is not a tier this build knows: platinum"`.
- **Nothing is silently clamped**, because a clamped 9999 reads back as a 10
  the person never entered.
- **Refusal is all or nothing per record.** Any error at all returns
  `{ok:false, errs}` and the whole record is refused. (**Measured:** a record
  with `soul.doms=[0,99]` is refused with `soul.doms is 99, outside 0 to 18`.)
- It **rebuilds** rather than patches: it starts from `blankProfile` and copies
  across only the fields it knows. So unknown keys are dropped.

### 4.2 Field by field

| Field | Accepts | Refuses by name |
|---|---|---|
| `v` | number 1 to `SCHEMA_V` | anything else |
| `id`, `name`, `created`, `updated` | strings | (non-strings are ignored and blank values kept) |
| `axes.X.held`, `axes.X.opp` | finite number 0 to 10 | non-number, out of range |
| `laws.X` | `null`/missing (unmeasured), or 0 to 10 | non-number, out of range. Old names `Expression` and `Discernment` are migrated to `Justice` and `Humility` in `loadProfile` (`schema.js:103`) |
| `soul.doms`, `soul.arcs` | integers within `DOMAINS` / `ARCH` | out of range. Empty lists fall back to `[0]` and `[0,1]` |
| `gates.verp.*`, `gates.lean.*` | 0 to 1e6 | non-number, out of range |
| `intake.answers` | keys 0 to 62, values 0 to 10 or `null` | bad key, bad value |
| `seed` | `type` one of `TYPE16` | an unknown type |
| `story.entries[]` | closed key set `t, text, imprints, bands`; `t` a date; `text` a string (no length cap, deliberately); `bands` keys must be sniffer seat keys (`K2BAND`) | any other key, non-date, non-string text, unknown seat |
| `meter.lines` | 0 to 1e9 | non-number |
| `meter.firsts[]` | `{k:string<64, t:date, nm?:string<120}` | the count of entries that failed |
| `plan.tier` | a key of `PLAN_BY` | an unknown tier (never rounded down to free: "silently downgrading somebody who paid is the same class of error as silently upgrading somebody who did not") |
| `plan.status` | string under 32 chars | otherwise. An unknown status is kept and read by `planState` as `'pending'`, which grants nothing |
| `plan.granted`, `carried`, `base` | bounded numbers | non-number |
| `plan.since`, `until` | dates or null | non-date |
| `plan.customer`, `subscription`, `email`, `key`, `secret`, `token` | never | present at all: `"plan.email is not held by this product"` |
| `avatar.pairs[]` | both `be` and `notbe` non-empty strings under 200 | half a pair (counted) |
| `purpose.soul`, `purpose.ego` | up to 3 | more than 3 |
| `purpose.sides.X` | up to `PUR_PER_SIDE` (5) | more than 5 |
| `rituals[]` | closed key set `t, track, band, steps, min, when, where, done`; `t` required date; `track` from the practice library; `band` a seat; `steps` each a practice key and no more than the library holds; `min` 0 to the whole library summed; `when`/`where` strings up to `RIT_PLAN_MAX` (40), refused not truncated; `done` boolean or date | any other key, and each of those violations |
| `history[]` | objects with bounded numeric readings | non-object, out-of-range readings |

Two design points worth carrying into the port:

- **Closed key sets on the nested bags** (`RIT_KEYS`, `ENT_KEYS`) rather than
  a deny list. A closed set refuses what nobody thought of. The gate then
  asserts that every name on the outbound deny list (`OB_NEVER`) is refused
  inside both bags, so the deny list still protects them without a second copy.
- **The boundary reads its limits off the data tables**, not literals:
  `RIT_TRACK`, `RIT_STEP` and `RIT_MIN_MAX` are built from `PRACTICE` at load,
  so a practice added to the library is accepted the moment it exists.

### 4.3 `pImport` is atomic

`engine/schema.js:1013`:

1. `JSON.parse`, or fail with `['not valid JSON']`.
2. `validateProfile`, or fail with its error list.
3. Copy `PROFILES` and `CURP` aside, and define a rollback that restores both
   and reloads the old current record (or a blank if there was none).
4. `loadProfile(profile)`. If it throws, roll back.
5. Only now push onto `PROFILES` and move `CURP`.
6. `pPersist()`. If the write fails, roll back.

A failure returns `null` and leaves the reason in `importError()`. Nothing is
pushed and `CURP` does not move until the profile has validated, loaded and
saved. The UI caller is `recordImportWire` (`ui/panels.js:700`), drawn on the
account surface under "Load a Record" (`ui/account.js:201`); the web quiz
downloads `atuned-record.json` built with the engine's own `saveProfile`, and
this is where it lands. That file is today's only handoff between the quiz and
the app.

`loadProfile` itself trusts its input. That is correct only because
everything a person can paste goes through `validateProfile` first.

### 4.4 Where the boundary does not keep its own rule (measured)

Each of these was run against `engine.js` at `eb788a2`:

| Input | Result | Rule it breaks |
|---|---|---|
| `who.first` of 500 characters | accepted, cut to 200, no error | "refused, never truncated" (`vStr` refuses; `who` slices at `schema.js:626`) |
| `meter.unique: ['a', 5, {}]` | accepted, keeps `['a']`, no error | silent drop |
| `soul.roots` non-strings | filtered out silently (`schema.js:604`) | silent drop |
| `purpose.soul` non-string entries | replaced with `''` silently (`schema.js:743`) | silent edit |
| `seed:{type:'INTJ'}` with no `axes` | accepted, every axis set to **3** | invented value; the product's rule elsewhere is that nobody entered a 3 |
| `history:[{t:'2026-01-01'}]` | accepted, `dark:'Heart'`, `tier:'Collapsed'`, every reading 0 | invented reading |
| `intake.done: [{evil:1}, 42]` | accepted and stored verbatim | unchecked bag (it is also derived, 3.5) |
| a record with an extra top-level `onboarded:true` | accepted, `onboarded` dropped | see below |
| the same valid record imported twice | two records with the **same id** in `PROFILES` | undo history and the persona mirror both key on id |

`onboarded` matters because the UI writes it. `ui/onboard.js:113` sets
`CURP.onboarded=true` and saves; `ui/ui.js:1094` reads it to decide whether to
open onboarding. **Measured in Chromium:** after `CURP.onboarded=true; pSave()`
the raw JSON on disk contains `onboarded`, but after a reload `CURP.onboarded`
is `undefined`, because `pStore` rebuilt the record through `validateProfile`,
which does not know the field. The next save then erases it from disk. It is
dormant today only because auto-open is off (`OB_AUTO=false`,
`ui/onboard.js:43`). The general lesson for the port: a field is part of the
record only if `blankProfile` and `validateProfile` both know it. Any new field
has to be added to both, or it will be written once and lost on the next boot.

`loadProfile` has its own inconsistency: a record reaching it with an axis
missing gets `held` **3** (`schema.js:97`), where `blankProfile` writes 0.
Through the boundary this cannot happen (the boundary fills 0 first), but
`read()` and the tests call `loadProfile` directly.

### 4.5 The outbound boundary

`obValidate` (`engine/outbox.js:55`) is the same posture applied to what
leaves: a closed key set for an envelope (`OB_KEYS`: `kind, at, body, answers,
band, build, platform, viewport`), a deny list (`OB_NEVER`, about forty names:
identity, story, readings, birth, device, practitioner), per-kind length caps
refused rather than truncated, and a refusal of anything shaped like an email
address or a long digit run in the free text. It runs on queue **and again on
drain**, because the queue is on a disk another build or tab can write. The
reading travels only as a three-bucket band (`obBand`: unread, low, median,
high), never the raw number.

### 4.6 Failure reporting

The rule: every write that can fail reports through `status()`, and a control
never claims success before it has it.

- The engine never renders. It records `SAVE_OK`/`SAVE_ERR` (`'NoStore'`,
  `'NotARecord'`, or the exception name such as `QuotaExceededError`) and
  returns `true`/`false` from `pPersist`, `pSave`, `pSnap`. `saveState()`
  returns `{ok, err}`.
- `status(msg, kind)` (`ui/component.js:240`) writes one polite live region,
  `#status`. Messages of kind `'fail'` stay; others clear after 2.4 s.
- `statusSaved()` (`ui/component.js:248`) reads `saveState()` and says
  "Saved." or names the reason.

Writes that do **not** report, found by reading every write site:

| Site | What happens |
|---|---|
| `ui/storyui.js:104`, story commit | `pSave();pSnap();` return values ignored |
| `ui/release.js:158`, release commit | `pSave();pSnap();` ignored |
| `ui/intakeui.js:319`, answering an intake question | `pSave()` ignored, no status |
| `ui/ritual.js:188`, "mark done" | `pSave()` inside try/catch; `pSave` returns `false` rather than throwing, so "Marked done." prints whatever happened |
| `ui/ritual.js:199`, saving a ritual | `pSave()` ignored; button reads "Saved" |
| `ui/panels.js:1010`, undo and redo `settle()` | `pSave()` ignored, then `status(msg,'ok')` |
| `ui/account.js:316`, `ui/intakeui.js:367`, export to clipboard | `navigator.clipboard.writeText` returns a promise; the synchronous try/catch cannot see a rejection, so "copied" is reported before the copy has happened |

---

## 5. Undo and redo

### 5.1 Design

`engine/undo.js` holds the stacks; the UI decides when to push and paints the
arrows.

- **Unlimited**, `UNDO_MAX=0` meaning no ceiling, on the owner's ruling. One
  entry is under a kilobyte.
- **Inputs, not readings.** `undoState()` (`:73`) captures `S.charge`,
  `S.replace`, `S.law`, `S.doms`, `S.arcs`, `S.roots`, `S.dom`, `S.a1`, `S.a2`.
  A `snapshot()` could not be used because it is derived and the inputs cannot
  be recovered from it.
- **Push before the mutation, with a label in the person's words.**
  `undoPush('committing the story')`. The label becomes the tooltip and
  accessible name on the arrow.
- **Keyed by record id.** `UNDO[CURP.id]`, `REDO[CURP.id]`, or `'_'` when no
  record is bound (headless). Not keyed by `S.who`, because all of a person's
  own records are `who 0` and would share one history. Switching record hides
  the arrows; switching back brings that record's history back. Clearing on
  switch was rejected because it would spend a whole history on one glance at a
  demo persona.
- **Redo** holds what undo popped until a new push abandons that branch.
- **One restore for both directions.** `undoApply(s)` writes the captured
  inputs into `S`, then `buildSoul()` and `suscAll()`, because susceptibility
  is a function of the soul and is written by a pass, not by compute.
- **Session memory only.** The stacks are not persisted; a reload starts empty.

### 5.2 How engine and host cooperate

```
UI action handler                engine/undo.js           engine state
------------------               --------------           ------------
undoPush('the release at 4')  -> capture S inputs     ->  UNDO[id].push
apply the mutation to S       ................................> S changes
pSave / pSnap                 ................................> disk

undo arrow (ui/panels.js:1013)
undoPop()                     -> REDO[id].push(current)
                                 undoApply(popped)    ->  S restored,
                                                          buildSoul, suscAll
settle(): syncCh, syncLw, syncSoul, saveYou, pSave, render, paintUndo, status
```

Push sites: story commit (`ui/storyui.js:99`), release (`ui/release.js:114`),
dragging a charge on the wheel, changing domain, changing archetype
(`ui/ui.js:129`, `:135`, `:140`). Slider edits in the rail do **not** push.
Ctrl or Cmd+Z and Ctrl+Y or Shift+Z are bound (`ui/panels.js:1023`) and ignored
inside inputs and textareas.

### 5.3 What undo does not take back (measured)

A story commit writes five things: charges into `S`, gate evidence into
`VERPMIX`/`LEANMIX`, an entry into `CURP.story.entries`, a snapshot into
`CURP.history`, and the lot to disk. `undoState()` captures only the first.

**Measured in node:** on a blank profile, CQ reads 36.00. A story with
attachment and aversion cues is applied: CQ 27.07. `undoPop()`: charges return
to zero, but `VERPMIX` still holds the cue counts, `verpFactor()` still reads
1.33, and **CQ stays at 27.07**. The person pressed back and the headline
number did not move. The story entry and the snapshot also remain on the
record.

A release commit likewise writes `meter.unique` and `meter.firsts`, which spend
the tier allowance. Undo restores the charges but does not refund the patterns.
That one may be intended (a line spoken is spoken), but it is not stated
anywhere.

For the port: decide the unit of undo. Either it is "the field inputs", in
which case gate evidence has to be part of them, or it is "the transaction",
in which case the story entry, the snapshot and the meter need to be captured
or explicitly excluded, and the exclusion said to the person.

---

## 6. Surfaces, tab identity and wiring

### 6.1 The three tables

`engine/core.js:55` onward.

**`TAB` is identity.** Integers that are compared and passed around and must
never be renumbered. New surfaces are appended.

| Integer | Name | Has a door in the bar? |
|---|---|---|
| 0 | `STORY` | yes |
| 1 | `SUMMARY` | yes |
| 2 | `FIELD` | yes, and the app opens here |
| 3 | `ENERGY` | yes, labelled "Body" |
| 4 | `ANALYTICS` | no, folded into Summary |
| 5 | `INTAKE` | yes, labelled "Energetics" |
| 6 | `KNOW` | yes, labelled "Knowledge" |
| 7 | `GAMES` | yes (unfolded again on the owner's ruling) |
| 8 | `COMPASS` | yes, appended |
| 9 | `SETTINGS` | no, reached from the profile button |
| 10 | `RITUAL` | yes, appended |

(Some project notes list only 0 to 9. `RITUAL:10` is live.)

**`TABDEF` is display order**, and can be reordered freely. Each entry is
`{k: identity integer, id: host element id, nm: label, cls: body class}`:

| Order | `k` | `id` | `nm` | `cls` |
|---|---|---|---|---|
| 1 | 5 | `iq` | Energetics | `tab-intake` |
| 2 | 10 | `rit` | Ritual | `tab-ritual` |
| 3 | 0 | `story` | Story | `tab-story` |
| 4 | 2 | `cv` | Field | `tab-field` |
| 5 | 3 | `emap` | Body | `tab-energy` |
| 6 | 8 | `cone` | Compass | `tab-compass` |
| 7 | 6 | `know` | Knowledge | `tab-know` |
| 8 | 7 | `games` | Games | `tab-games` |
| 9 | 1 | `sum` | Summary | `tab-summary` |

**`TABEXTRA`** carries surfaces with a host and no door: today only
`TABEXTRA[9] = {k:9, id:'settings', nm:'Settings', cls:'tab-settings'}`.

**Lookups:**

- `TABOF(k)` (`core.js:114`): the entry for `k` from `TABDEF`, else
  `TABEXTRA`, else **`TABDEF[0]`**.
- `TABFOLD` (`core.js:121`): `{4: 1}`, Analytics resolves to Summary.
- `TABREAL(k)` (`core.js:125`): the folded parent if folded; `k` if it is in
  `TABDEF` or `TABEXTRA`; else **`TAB.SUMMARY`**.

The two fallbacks differ (first bar entry against Summary). In practice
`setTab` runs `TABREAL` first, so an unknown integer lands on Summary, but a
new caller of `TABOF` on its own gets Energetics.

### 6.2 `setTab(i)`, step by step

`ui/panels.js:68`. Every caller goes through it, and it goes through `TABREAL`
first, so a stored or stale integer for a folded surface still lands somewhere
real.

1. `i = TABREAL(i)`.
2. Leaving Summary empties `#sumbody` and `#ana`, so a hidden surface never
   sits in the document asserting a stale reading.
3. `S.tab = i; S.pin = null`.
4. For every `TABDEF` entry, look up its host **by `T.id`** and show it if
   `T.k === i`, hide it otherwise. The Field canvas (`cv`) is skipped here and
   handled separately.
5. Show or hide `#settings` by hand (it is not in `TABDEF`); render the
   account surface if entering it; open the ritual builder if entering Ritual.
6. Canvas and sub-bar visibility for Field and Body.
7. Remove every `cls` from both `TABDEF` and `TABEXTRA` off `<body>`, then add
   `TABOF(i).cls`. (Clearing only `TABDEF` left `tab-settings` on the body for
   the rest of the session and hid the right rail everywhere. The render watch
   caught it.)
8. Arrival animation, canvas measurement for Field (only now that it is
   visible), icon grid refit, the Field's arrival sequence.
9. Pressed state on every `.tabtop` button, **read from its own
   `data-tabk`**, never from its position.
10. Open the rail sections that surface is about, once per session.
11. Dispatch to the surface renderer (table below).
12. `render()`, `paintSections()`, `tabTop(i)` (scroll to top and move focus
    to the pressed tab button, then again on the next frame).

### 6.3 Surface registry

| `TAB` | Host element | Renderer, called from `setTab` or `render` | File |
|---|---|---|---|
| FIELD 2 | `#cv` canvas | `draw(r)`, `drawAura(r)` every frame in `loop()` | `ui/wheel.js` |
| ENERGY 3 | `#emap` | `renderMap(r)` from `render()` | `ui/map.js` |
| INTAKE 5 | `#iq` | `renderIntake()` | `ui/intakeui.js` |
| KNOW 6 | `#know > #knowbody` | `kbRender()` | `ui/knowledge.js` |
| GAMES 7 | `#games` | `gmRender()`; `lgStop()` on every other tab | `ui/games.js` |
| STORY 0 | `#story` | `stRender()` | `ui/storyui.js` |
| SUMMARY 1 | `#sum > #sumbody` | `sumRender()` | `ui/summary.js` |
| ANALYTICS 4 | `#sum > #ana` | `anaRender()` alongside Summary | `ui/analytics.js` |
| COMPASS 8 | `#cone` | `coneOpen(true)`; `coneClose()` on leaving. Runs its own canvas and frame loop | `ui/cone.js` |
| SETTINGS 9 | `#settings` | `renderAccount()` | `ui/account.js` |
| RITUAL 10 | `#rit` | `ritOpen(null)` or `ritRender()` | `ui/ritual.js` |

Hosts that are not tabs: `#rel` (release panel, `ui/release.js`), `#deck`
(`ui/knowledge.js:529`), `#sheet` (modal sheet), `#ob` (onboarding),
`#status`. The rails (`#person`, `#run`, `#fire`, `#rows`, `#laws`, `#chg`,
etc.) are rebuilt by `render()` in `ui/ui.js:616` on every state change.

### 6.4 Why the host tree looks the way it does

**A tab host that carries a folded surface cannot also be one.** `#sum`
contains `#sumbody` and `#ana` as siblings. The first cut of the fold put the
child straight inside the parent, and the parent's renderer, which writes the
whole `innerHTML` of its host, deleted the child every time it drew. Each
renderer now owns only its own body element. The same shape used to hold
Games inside Knowledge; Games is a sibling again.

**The navigation is written into the document, not built by code.**
`shell/body.html:198` carries nine buttons, each with `data-tabk` set to the
identity integer. Start up only wires them (`ui/panels.js:279`). This was
ruled after start-up failures kept taking the navigation with them: a bar
built in a loop exists only if the script reaches the loop. The cost is that
the bar's order and labels now live in two places, `TABDEF` and the markup,
and a gate asserts they agree.

### 6.5 Identity, never position, and the incident behind it

The rule: anything needing a tab's entry looks it up by `.k` (or its host by
`.id`), never by where it sits in a list or in the document.

The render watch (`tools/monitor.js`) walks every surface named in `TABDEF`
and `TABEXTRA` at 1600 and 390 pixels wide and logs the markup size of each.
It originally took the first visible child of `.stage` as the surface host.
When the Field's two key strips (`#key` and `#keylo`) landed as visible
children of `.stage` on every tab, the watch measured the same strip nine
times, printed nine identical numbers under the heading "all surfaces
render", and passed. It now looks the host up by id (`tools/monitor.js:88`).
The watch also has three rules the port should keep: count an SVG surface by
markup (`innerText` does not see SVG), count a canvas by lit pixels (it has no
`innerHTML`), and assert the noscript notice (a CSS animation runs without
script and can uncover an empty shell).

Two places in the current code do not follow the identity rule and are worth
not porting as they are: `S.who` is a position in `PEOPLE` that a UI module
shifts at load (3.4), and `TABOF` falls back to `TABDEF[0]`, whatever that
happens to be this week.

Note also that the TAB integers are described as persisted, but **nothing
persists a tab today**: `S.tab` is not saved and no record or key carries one.
They are compared (markup, dispatch tables, gates, `data-tabk`). The rule is
still right, and the desktop build is likely the first host to persist one
(restore last surface), which is exactly when renumbering would start to
corrupt data.

---

## 7. The impure core

### 7.1 What `compute()` actually depends on

`compute()` (`engine/compute.js:43`) takes no arguments. It reads:

- `S.dom`, `S.doms`, `S.roots`, `S.charge`, `S.replace`, `S.law` (directly, and
  through `bandIg()`, `balance()`, `sab33Detect()`/`sabLevels()`);
- `DOMAIN`, through `suscAll()` and `affinity()`;
- `VERPMIX`, through `verpFactor()`, which multiplies resistance and therefore
  CQ;
- **`CURP.laws`**, to count measured laws for `measured` and `unread`
  (`compute.js:154`);
- the static tables (`W`, `FIELD`, `ALL_SAB`, `HCX_LIB`, `SI`, `BANDS`,
  `MASKS`, `DOMAINS`, `ARCH`).

And it writes:

- `n.susc` on every node in `W` (through `suscAll()`, first line);
- `n.held`, `n.rep`, `n.sq`, `n.pole`, `n.jq`, `n.open` on every node in `W`,
  and zeroes the same on `FIELD`.

It returns a large reading object (`loaded`, `carrying`, `sabs`, `cxs`, `hys`,
`sups`, `DQ`, `CQ`, `tier`, `unread`, `measured`, `X`, `Y`, `Z`, and more), but
some renderers read the node fields off `W` instead of the returned object, so
they are correct only if `compute()` was the last thing to touch `W`. It runs
every frame in `loop()` (`ui/ui.js:973`) and again in `render()` and in most
renderers, so in practice it always has.

Other engine functions that read shared state rather than arguments:
`applyStory` (writes `S.charge`, reads `n.susc`), `verpApply`/`leanApply`
(write the gate accumulators), `iqApply` (writes `S.law` and the profile),
`cqCeiling()` (reads `S`, `W`, `VERPMIX`), `accuracy(r, prof)` (defaults
`prof` to `CURP`), `snapshot()` (calls `compute()`), `sab33Detect()` (reads
`S.charge`).

### 7.2 The front door

`engine/read.js` is the containment. It is the only place permitted to drive
that state, in one fixed order:

```
input(profile, opts)   loadProfile(profile)   S <- profile, buildSoul, gatesLoad (zeroes gates), suscAll
                       iqApply(profile)       measured laws beat the default
                       opts.story? applyStory, verpApply, leanApply
throughput(profile)    compute() + accuracy + verpRead + leanRead + exprRead + sab33Detect
output(profile)        saveProfile(profile)   S -> profile
read(profile, opts)    input, throughput, output if opts.write, and snapshot
```

It zeroes what accumulates, because `loadProfile` calls `gatesLoad`, which
calls `gatesClear`. **Measured:** `read()` twice on the same profile and story
gives CQ 23.613 both times. The chain on its own is not repeatable in that way.

### 7.3 Where the containment leaks (measured)

- **`unread` follows `CURP`, not the profile that was loaded.** In node, a
  profile with all 21 laws at 8 is loaded with `loadProfile` while `CURP` is
  `null`: `compute()` returns CQ 64.0, `measured: 0`, `unread: true`. A
  profile read through the front door without first being made current is told
  it has measured nothing. `read()` does not set `CURP`.
- **Gate evidence leaks across persona switches.** `loadP()` fills `S` without
  going through `loadProfile`, so it never calls `gatesLoad` and the previous
  profile's `VERPMIX` stays live. In Chromium: the first demo persona reads
  `verpFactor` 1.00 and CQ 57.18 when loaded clean. Load "You", apply a story
  with attachment and aversion cues (`verpFactor` 1.33), load the same persona
  again: `verpFactor` 1.33, CQ 43.00. At boot `loadProfile(CURP)` loads the
  person's stored gate evidence, so every demo persona visited afterwards is
  read with that person's gates.
- **Undo does not restore the gates** (5.3).

The UI mostly bypasses the front door: it mutates `S` directly (sliders,
`applyStory` on commit, releases) and calls `compute()` directly. `read.js` is
used by the tests and is the documented entrance, but the app's own event
handlers are not routed through it.

### 7.4 What purification would look like, and why it is deferred

The ruling is "port, do not rebuild": the arithmetic keeps its bodies and
signatures. Purifying is a signature rewrite and has been deliberately
deferred. For the port team, the shape it would take:

- A **field** value holding exactly what `undoState()` captures today plus the
  gate evidence: `{charge, replace, law, doms, arcs, roots, gates}`.
- `compute(field, measuredLaws)` returning a reading and **not writing to
  `W`**. Per-node results come back in the reading, keyed by node id.
  `suscAll` becomes a pure function of the soul returning a susceptibility map.
- `applyStory(field, text)` returning a new field; `verpApply`/`leanApply`
  returning new gate evidence.
- `loadProfile`/`saveProfile` become `profile -> field` and
  `(profile, field) -> profile`.
- `S` keeps only view state.

That would close all three leaks above by construction, make undo a stack of
fields (so gates come along for free), and remove the order dependency between
`compute()` and every renderer that reads `W`. It also touches every caller,
which is why it has not been done. If the port keeps the current engine, keep
the front door as the only route in, and route the persona loader through
`loadProfile` so it inherits `gatesLoad`.

---

## 8. The network model for the accounts fork

### 8.1 Today

The shipped file makes no network request at all. `tests/design.js` gate 7
watches the network and fails on any request other than the two local
rasters; the typeface is embedded as base64. `hostfree.py` forbids `fetch` and
`XMLHttpRequest` anywhere in `engine/`.

### 8.2 The ruling

The product is forking into an accounts product: a web quiz as its own flow, a
record store, sign in, a practitioner who can be granted sight, paid tiers,
push notifications. The engineering posture that survives the fork:

- The app gains network at **exactly one seam: fetching a record at sign in.**
- The engine stays host free. No `fetch` in `engine/`, ever.
- Storage stays the person's own device for everything except the quiz
  record.
- Records off device mean a controller exists; access, deletion and breach
  obligations attach.

### 8.3 Where the fetch goes

In the **host**, never the engine, and it enters through the existing
boundary:

```
sign in (host)  ->  fetch record  ->  text  ->  pImport(text)
                                                  validateProfile   refuse by name
                                                  loadProfile       roll back on throw
                                                  PROFILES.push, CURP
                                                  pPersist          roll back on failure
```

Nothing new is needed on the engine side for the read path: `pImport` is
already atomic and already reports. The desktop host implements the fetch and
hands the body to `pImport` exactly as the account surface hands it a pasted
file today.

Billing and support stay behind their own host-bound seams and do not add
network to the engine:

- **Billing**: the app calls `PLAN_HOST(what, tier)` to open a hosted checkout
  or portal page. The record store reads the processor and writes `plan` onto
  the record. The app only ever reads `plan`, through `planOf`/`planState`,
  which grant access only for a known live state. No key, card field or
  customer id is ever in the app, and a gate sweeps the build for `sk_`, `pk_`,
  `cus_`, `sub_` and card fields.
- **Support and feedback**: queued durably in `source.outbox` and drained
  through `SEND_HOST` when a host binds one. Note this is a second outbound
  need beside the sign-in fetch; the project treats it as host-bound rather
  than as an engine seam, but whoever binds it is adding network.

### 8.4 What must not travel, and what the current record would send

The privacy rulings are structural:

- The person's name never leaves the device. A key replaces it.
- The record is never held joined to the story.
- The record never carries a customer id, subscription id, email, key, secret
  or token. The boundary refuses them by name inside `plan`.

The profile object as it stands carries **both** `who` (first, middle and last
name, birth date, time and place) **and** `story.entries[].text`, verbatim. On
the device that is correct: it is the person's own data in their own browser.
It means the local profile is **not** the shape that may go to or come from a
record store. The record store needs a projection: no `who` names, no story
text, a key in place of identity, and on the way back a merge that does not
overwrite the local story. None of that exists yet. The outbox shows the
pattern it should follow: a closed key set on the way out, validated on
enqueue and again on send.

Also open and blocking the record store, per DECISIONS.md: **save conflict
between two devices.** `pPersist` writes the whole array under one key with no
revision or merge. That is fine for one browser and is the first thing a
second device breaks.

---

## 9. Module dependency graph

Top calls down. Arrows mean "calls into or reads". Data tables are read by
almost everything and are drawn once.

```
                        shell/head.html   CSS, tokens, embedded font
                        shell/body.html   every host element, the tab bar (data-tabk)
                        shell/guard.html  boot guard, own <script>; __at, __bootOk
                                  |
============================ ONE <script> BLOCK ====================================
                                  |
  ENGINE (host free; BUILD-engine.sh -> engine.js; hostfree.py)
  --------------------------------------------------------------
  data/  nodes figure nerves canon compass ages practice people catalog kb cards
          (tables: NODES, SAB_LIB, CHILD, CHARGES, SI, BANDS, DOMAINS, ARCH,
           PRACTICE, PEOPLE, C3_*, ...; canon.js also holds tierOf, sabMember)
            ^ read by everything below
            |
  verp.js      VERPMIX, LEANMIX; verpApply/leanApply, verpFactor, gatesLoad/Save
  lexicon.js   LEX tables and lexicon builders
  core.js      derived indexes (W, BY, ALL_SAB), TAB/TABDEF/TABOF/TABREAL,
               S, DOMAIN, buildSoul, affinity, bandIg, sab33Detect
  expression.js, undo.js (reads S, CURP.id; calls buildSoul, suscAll)
  compute.js   suscAll, compute, cqCeiling, accuracy
                  reads S, DOMAIN, VERPMIX (verpFactor), CURP.laws; writes W nodes
  plan.js      PLANS, planState, planOf, planAllowance (pure over a plan object)
  avatar.js    avatarBlank, purposeBlank, ... (pure)
  schema.js    blankProfile, loadProfile (S <- p, gatesLoad, suscAll),
               saveProfile (S -> p, gatesSave), validateProfile, pStore, pPersist,
               pSave, pSnap, pImport, bindStore, meter*, PROFILES, CURP
  intake.js    iqList, iqScore, iqApply (writes p.laws and S.law)
  sniff.js     parseStory, applyStory (writes S.charge), sniffStory
  astro, birth, numerology, seed   pure over birth strings / type
  read.js      THE FRONT DOOR: input -> throughput -> output
  ladder.js    streaks, ledger, series over p.rituals / p.history (pure over p)
  outbox.js    obValidate, obQueue, obDrain, bindSend (uses STORE)
  export.js    module.exports for node
            ^
            | calls engine globals directly; mutates S and CURP
  UI (browser only)
  --------------------------------------------------------------
  component.js   esc, seatCol, cr/crNode/crBadge/crPat (the ring component),
                 addrRow, status, statusSaved, canvas contexts, layout, startHTML
     ^ called by every renderer below
  tip.js         tooltip system
  wheel.js       Field canvas: draw, drawAura, enterStart
  map.js, mapshelf.js     Body
  imprints.js, storyui.js Story (commit: undoPush, applyStory, verpApply,
                          leanApply, pSave, pSnap)
  summary.js, analytics.js, intakeui.js, release.js (meterRun, meterFirst),
  ritual.js, cone.js, drills.js, knowledge.js, record.js, games.js
  panels.js      setTab (TABREAL/TABOF), sliders, themes, density, sheet,
                 record import (pImport), plan section (bindPlan), undo arrows
  account.js     Settings surface, export (pExport), delete, outbox compose
  personas.js    PEOPLE.unshift(You), loadP, toYou, saveYou, persistYou
  onboard.js     first-run flow
  ui.js          render() (rails, key strips), loop() (compute every frame),
                 bindStore(localStorage), boot steps, __bootOk
=====================================================================================
                        shell/foot.html   </script>, #eof data-len
```

Runtime flow of one edit, a story commit, as an example of the whole graph:

```
click #stapply (ui/storyui.js:78)
  -> refuse if S.who !== 0 (a demo persona is loaded)
  -> undoPush('committing the story')                 engine/undo.js
  -> applyStory(text)       S.charge += ...           engine/sniff.js
  -> verpApply, leanApply   VERPMIX, LEANMIX += ...   engine/verp.js
  -> CURP.story.entries.push({t, text, imprints, bands})
  -> pSave()  saveProfile(CURP): S -> CURP, gatesSave; pPersist -> STORE.set
  -> pSnap()  snapshot() -> compute() -> CURP.history.push; pPersist
  -> toYou(), syncCh(), stRender(), render()
       render(): compute() -> rails, key strips, drills
  -> next animation frame: loop() -> compute() -> draw()
```

---

## 10. What the port should know that the documents do not say

Consolidated from the sections above. "Measured" items were reproduced on
`eb788a2`.

**Structure**

1. The shell has four parts, not three: `guard.html` sits between body and
   the first engine file and holds its own `<script>` block.
2. The stored density is never applied at boot, because `ui/panels.js` reads
   it before `ui/ui.js` binds the store. Measured.
3. The theme is not persisted at all. Measured. Whether it should be is not
   ruled.
4. The TAB integers are not persisted anywhere today, only compared. The
   desktop build will probably be the first to persist one.
5. `TAB.RITUAL` is 10 and live.
6. `S.who` is a positional index into `PEOPLE`, which `ui/personas.js`
   reorders at load. Browser and node disagree about what index 0 is.
7. There is an import control in the UI (account surface, "Load a Record"),
   and the web quiz's downloaded record is its caller. Project notes still say
   there is none.

**State and the boundary**

8. A field written onto a record that is not in `blankProfile` and
   `validateProfile` is erased on the next boot. `onboarded` already is.
   Measured.
9. `validateProfile` truncates `who` strings, silently drops non-strings from
   `meter.unique` and `soul.roots`, blanks non-string purpose values, invents
   seed axes of 3 and invented history labels, and stores `intake.done`
   unchecked. Measured.
10. The same record imported twice produces two records with one id. Measured.
11. `laws` has two writers (sliders and `iqApply`) and the intake silently
    overwrites a hand-set law. Whether that is intended is open in
    DECISIONS.md.
12. Seven write sites ignore a failed save or report success early (4.6).

**The impure core**

13. `compute()`'s `unread` reads `CURP`, not the loaded field. Measured.
14. Gate evidence leaks across persona switches, changing a demo persona's
    CQ from 57.18 to 43.00. Measured.
15. Undo does not restore gate evidence, the story entry, the snapshot or the
    meter. After undoing a story the headline CQ does not move. Measured.

**Tooling**

16. `tools/equiv.py`, the "nothing changed but order" check, exits 0 when a
    top-level declaration is deleted, and cannot see top-level statements that
    follow a column-0 comment (all the IIFE wiring and most boot steps). Both
    measured: rewiring the profile button to Summary passes it, and so does
    deleting `planNextSight`. It is a reliable detector of changed function
    bodies and renamed declarations, and nothing more. It compares the
    multiset of (name, whitespace-stripped body hash) for every column-0
    `function`, `var`, `const` and `let`.
17. Stale comments that describe a layout the code no longer has:
    `core.js:68` and `ui/panels.js:69` still say Games is folded inside
    Knowledge; `core.js:137` says the app opens on Summary (the next comment
    and the code say Field); `ui/ui.js:1097` says the frame loop's body is
    guarded, and `loop()` has no try.

**Whose call**

- Any change to the record shape, including a projection for the record store
  or a new field such as `onboarded`, touches schema v2, which is the
  cross-compatibility contract with SOURCE and is the owner's call. The gates
  bump was additive and v1 still loads; a port should be held to the same bar.
- Whether a law measured by the intake can be overridden by hand.
- The unit of undo, and whether a release refunds when undone.
- Save conflict between two devices, which blocks the record store.
- Whether the outbox's send counts against the one-network-seam rule.
