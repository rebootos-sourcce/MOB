# Pass 2, systems director (Yuki Brennan). Round PK

Read: all eight pass 1 reports in `REVIEW-arch/pass1/` (the brief says nine; no QA report had landed). Checked against the repo at `3d01310`. The onboarding build (`journey.js`) is still only in a worktree, not on main.

## 1. Agreements

- **The ledger is a read, not a store.** AI, creative, game, systems. Technical alone wants a new `p.ledger` (see 2).
- **Self report is not verification.** AI, creative, game, uiux, systems. No sensor exists, so the last link is "confirmed", with counts beside it.
- **No confidence number.** AI, uiux, systems. `daily.js` refuses it by name; grounds are counts a person can check.
- **Never store a safety label.** AI, systems, narrative (the card must read grant state, not a flag). A stored "crisis" bit is health data.
- **Three stage tables compete** (ten proposed, thirteen in `ATUNED-MVP-architecture-v2.md`, four loop modes). Creative, game, systems. None becomes a stored field.
- **Two devices cannot merge lists numbered by position.** Systems, technical.
- **Nothing writes practice or trace.** Game, systems. Every gate and the chain read empty arrays until a surface writes.
- **Copy that is false today:** the "never held together" sentence and the toggle with no reader (narrative, systems).

## 2. Disagreements

- **Technical: `p.ledger` as a new top-level key.** Rejected. A new top-level key is deleted by any older build (measured). The ledger is a function over existing stores. His point survives where it applies: any NEW list that may sync gets an id minted at write.
- **Game: `p.meter.runs`.** Rejected for one run log in `journey.runs`, with `addrs`. A new key inside the closed `meter` bag makes an older build refuse the whole record. Journey already validates runs against the meter.
- **Technical and sales: clamp or latch `granted`.** I refuse by name, never clamp. A record with `plan.granted` above the largest grant in the plan table is refused. The reading then takes the smaller of `granted` and the tier's own grant. A clamp on the stored value would hide a forged number.
- **Downgrade latch (settle 6).** I side with sales: no latch in MVP. Opened ground is `meter.unique` and no tier change touches it. Layer sight is a property of the tier, and nothing records which layers were drawn when, so a latch needs a new fact on every render. Technical's per address server latch waits for the server.
- **Hypothesis (settle 2).** No hypothesis object and no ranking. A `proposed` trace edge plus a `declined` list. Creative's cut stands for anything shown.
- **My own reversal.** Pass 1 asked for stage-reached stamps. Game and uiux are right: no stage is shown, so nothing can move backward. Cut.
- **Names (settle 9).** Creative: the stored graph is "the trace", so `ledgerOf` is dropped (`ledgerRead` already exists in `ladder.js:84`). Uiux's six row labels become the closed keys of one derived function. "Verified" becomes "confirmed". `practiceStage` is derived, never stored, so the rename touches no record.

## 3. What I missed

- **Three answers to "what did Tuesday's entry say"** (AI): frozen bands, and two re-parses. The chain must read the frozen `imprints/bands` stamped `lex`, and mark a stamp older than the current lexicon "read under an older lexicon".
- **`bindStore(get,set)` has no delete** (`schema.js:360`). Deletion cannot be built without it.
- **Storage writes bound the sync unit** (technical, 100,000 row writes a day): one chunk per day, so synced lists carry a day bucket.
- **Entry level delete is missing** (narrative). The abuse card promises it.
- **`ADJ2CHG` files "addicted" under joy** (`lexicon.js:228`, AI). A wrong data row, mine to fix before a reading uses it.
- **Consent is a stored fact** (narrative: the separate box). It lives on the server, not in the record.

## 4. The architecture, together: the record spec

### 4.1 Stored and derived

| Thing | Stored | Derived |
|---|---|---|
| Said, heard, maybe, felt, changed, confirmed | the existing four stores | one function, `traceChain(record, id)` |
| Hypothesis, its strength | nothing | a `proposed` edge, counts of supports and contradicts over distinct days and contexts |
| Declined | `p.trace.declined` | which proposals stay quiet |
| Run history | `journey.runs[].addrs` | ground opened, reruns, second release |
| Where the loop is | nothing | `journeyRead(p, now, care)` |
| Care level | nothing, ever | a runtime screen, passed in as an argument |

### 4.2 The chain view

`traceChain(record, id)` is pure and does not parse. Input: a trace node or edge id, or a citation id from `dlyResolve` (`daily.js:982`), which it generalises. Output: six rows, closed keys `said, heard, maybe, felt, changed, confirmed`, each a list of references (kind, id, `at`) and a count. Empty rows are present and empty. A reference holds ids and quotes the entry by offset; it never holds words, so it is not a second copy of the story (`journey.js:118` rule).
- `heard` reads frozen bands. `felt` is evidence with dimension affect. `changed` is dimension effect or an outcome.
- `confirmed` is an `observed` source (a meter line, a practice timestamp) or the person's own `confirm`. Never inferred from a self report alone. A report is `felt` or `changed`.
- Agent ceiling (AI's table): no source outranks its agent's rank. One test over `TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne` replaces three copies of the rule.

### 4.3 The declined list

`p.trace.declined = [{id, from, edge, to, at}]`, cap 500, `id` random 10 characters minted at write. Same door as the trace: closed keys, refused by name. Edge type must be in the rule table. A duplicate `{from, edge, to}` is refused ("already declined"), not appended. A proposal matching a declined triple is not made again until a new entry cites the pair. Undo is a remove with a stamped `at`; the person's "Not me" and "Set aside" (uiux) are this list. Screen word is the voice seat's; the key stays `declined`.

### 4.4 Run addresses

`journey.runs[] = {t, lines, fresh, rerun, end, addrs:[int]}`. `addrs` are address numbers, at most 112 distinct per run, each checked against the address table; a value outside it is refused by name. Fresh addresses must be in `meter.unique`, the check `journey.js` already makes for counts. Older runs without `addrs` read as unknown, never zero. Ground is counted in distinct addresses, which fixes the line-versus-address defect (game). Land this before `journey.js` ships.

### 4.5 JourneyState

`journeyRead(p, now, care)` returns game's shape: `touched` per loop quarter, `turns`, `ground {opened, runs, reruns}`, `standing`, `evidence {reported, observed}`, `care`, `next`. No stage, no day number, nothing stored. `care` comes from the host's runtime screen; the engine never reads it from the record.
- Gates read objects (runs, practice events, evidence), never `journey.log`, which is capped at 500.
- Gates rest on free acts only, never on spent supply (game).
- Gate and event ids: lower snake, matching `JOURNEY_EVENTS` (`first_release_completed`). `PR_EVENTS` upper case stays practice's own; one test maps one to the other.
- `next` is one slot, `src:'proposed'`, with `because` ids. Five existing "next" functions (`dlyFocus`, `ladderRead().next`, `planNextSight`, `avatarDue`, `onbMiniPlan`) become inputs to it.
- Ritual plans arrive as an argument until 4.8 lands, so `rituals_active` has one truth.

### 4.6 Unknown keys carried through

`validateProfile` returns `p.carry`, every top-level key it does not name, verbatim, and the save writes them back. No version bump.
- Limits: JSON only, 256 KB across all carried keys, depth 6.
- Refused by name at any depth inside carried keys: one list, `RECORD_NEVER`, shared by `validateProfile`, `OB_NEVER` and the claim: `token session password email key secret customer subscription stripe user_id userId customer_id`. Today only the first four are refused at top level; the rest vanish silently.
- Carried keys are never sent: the claim is an allowlist.
- A new key inside a closed bag still refuses the whole record in an older build and keeps the raw bytes. Reported through `status()`, as today.
- Honest limit: records written by a new build are safe only in builds from this slice onward. Repack `atuned-packed.html` the day it ships.

### 4.7 Ids

- On import, an id already in `PROFILES` gets a new one and `status()` says "imported as a copy" (measured today: three records, one id).
- On load, a duplicate id gets a fresh id after the first. Side stores keyed by the old id stay with the first. Say so.
- Record ids never leave the device (`JOURNEY_CLAIM_NEVER`).
- Identity versus order, as for tabs: new lists carry a random `id` for identity and array position for display only. Existing position numbered logs (`seq === i+1`) are not retrofitted until sync is built; then an `id` is added when absent.

### 4.8 Side stores into the record

`atuned-ritual-active` and `atuned-avatar-side` move into one top-level `p.side = {v:1, ritual, avatar}`, each half through its existing door (`ritPlanOk` moves from `ui/ritual.js` to the engine). Top level, because a new key in a closed bag refuses the record in older builds; this one is carried by 4.6. Export and the round trip then hold. `p.side.ritual` is retired when `practiceFromLegacy` cuts over to `p.practice`. Migration reads the old keys once, writes the record, and leaves the old keys until a save succeeds.

### 4.9 Budget and failures

One budget for the key `source.profiles`. Warn at 3.5 million characters, refuse new lists and side data (never the story) at 4.0, each by name through `status()`. Set `PR_CAP` so full evidence and log fit under 1 MB a profile (measured 540 and 160 bytes: evidence 1,000, log 2,500; to be re-measured).

### 4.10 Privacy inventory, as code

An engine table `PRIVACY`, one row per stored thing: `{where, what, who, howlong, leaves, exported, claimed, removedBy}`. A gate fails if any top-level key of `blankProfile`, any `localStorage` key literal in `ui/`, or any server column is missing. Rows added or changed:

| Where | Leaves | In export | Removed by |
|---|---|---|---|
| `source.profiles` record | no (claim, later) | yes | forget (below) |
| refused records (`STORE_KEPT`) | no | no | "clear unreadable", shows count and bytes |
| `source.profiles.unreadable.*` | no | no | same |
| `p.side` | no | yes (new) | forget |
| `p.trace.declined`, `journey.runs` | claim, later | yes | forget |
| `source.session` | token on each call | no | sign out |
| `source.outbox` | no sender bound | no | clear |
| safety result | never | never | never stored |
| consent, grants | server only | no | withdraw, revoke |

Add an optional third argument to `bindStore(get,set,del)`, falling back to writing an empty string, and one `forget(id)` that removes the record, its side data and its unreadable copies, then reads each key back empty or reports by name. Settings copy: "never held together" is replaced with the true line (`DECISIONS.md:1382`); the "Improve the Models" toggle goes at launch (narrative, ruling: research sharing off).

## 5. Revised grade

GRADE: 60/100 (was 54). Moved by: technical and AI both reached my "view, not store" position; creative's rename removes the naming collision; game's run log fixes my third gap. Held down by: no writers, no delete seam, and the delete holes.

## 6. Top 5

1. **Boundary slice** (S to M): unknown keys carried, `RECORD_NEVER`, new id on import, duplicate repair, `bindStore` delete. All ICPs; a phone only arrival opening an old downloaded file.
2. **Run `addrs`, `declined`, and the budget** (S), before `journey.js` merges. Skeptic, practitioner.
3. **Side stores into `p.side`, plus `forget`** (M). Acute distress and phone only (shared device deletion).
4. **First writers for practice and trace** (release card, "Not me") and `traceChain` (M). Skeptic wants the chain; no writer, no chain.
5. **`journeyRead` and the `PRIVACY` gate** (M). Practitioner needs the visible data table.

## 7. Question for the owner

None. Decisions taken: no latch in MVP; no stored safety label; no new top-level `ledger` key; no schema bump (`SCHEMA_V` stays 2, each new part keeps its own version, and the stale "flagged for his ruling" comments in `schema.js:6-11` should be corrected). Needing him only if the sibling app (`reboot-os`) wants one shared version number for the record.
