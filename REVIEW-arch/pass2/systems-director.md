# Pass 2, systems director (Yuki Brennan). Round PK

Read all eight pass 1 reports (no QA report had landed). Checked at `3d01310`. `journey.js` is only in a worktree.

## 1. Agreements

- **The ledger is a read, not a store.** AI, creative, game, systems. Technical alone wants a new `p.ledger`.
- **A self report is not verification.** AI, creative, game, uiux, systems. No sensor exists, so the last link is "confirmed", with counts beside it.
- **No confidence number.** AI, uiux, systems. `daily.js` refuses it by name.
- **Never store a safety label.** AI, systems, narrative. A stored "crisis" bit is health data.
- **Three stage tables compete.** Creative, game, systems. None becomes a stored field.
- **Position numbered lists cannot merge across devices.** Systems, technical.
- **Nothing writes practice or trace.** Game, systems. Gates and the chain read empty arrays.
- **Two copy lines are false today** (narrative, systems), listed in 4.10.

## 2. Disagreements

- **Technical: `p.ledger` as a new top-level key.** Rejected. An older build deletes an unknown top-level key (measured). His point survives for new lists that may sync: each line gets an id minted at write.
- **Game: `p.meter.runs`.** Rejected; one run log, `journey.runs`, with `addrs`. A new key in the closed `meter` bag makes an older build refuse the whole record.
- **Sales: clamp `granted`.** I refuse by name instead. A record whose `plan.granted` exceeds the largest grant in the plan table is refused; the reading uses the smaller of `granted` and the tier's own grant. A silent clamp hides a forged number.
- **Downgrade latch (settle 6).** Sales' side: no latch in MVP. Opened ground is `meter.unique`, and no tier change touches it. Layer sight is a property of the tier, and nothing records which layers were drawn when. Technical's per address latch waits for the server.
- **Hypothesis (settle 2).** No object, no ranking: a `proposed` trace edge plus a `declined` list.
- **My reversal.** Pass 1 asked for stage-reached stamps. With no stage shown nothing can move backward. Cut.
- **Names (settle 9).** Creative's "the trace" wins over "ledger" (`ledgerRead` already exists, `ladder.js:84`). Uiux's six row labels become the closed keys. "Verified" becomes "confirmed"; `practiceStage` is derived, so no record changes.

## 3. What I missed

- **Three answers to "what did Tuesday's entry say"** (AI). The chain reads frozen bands stamped `lex`, and says "read under an older lexicon" when the stamp is old.
- **`bindStore(get,set)` has no delete** (`schema.js:360`).
- **Entry level delete is missing** (narrative). The abuse card promises it; add it to `forget`.
- **`ADJ2CHG` files "addicted" under joy** (`lexicon.js:228`, AI). A wrong data row, mine to fix.
- **Consent is a stored fact** (narrative). It lives on the server, not in the record.

## 4. The architecture: the record spec

### 4.1 Stored or derived

| Thing | Stored | Derived |
|---|---|---|
| said, heard, maybe, felt, changed, confirmed | the existing four stores | `traceChain(record, id)` |
| Hypothesis and its strength | nothing | a `proposed` edge, counts over distinct days and contexts |
| Declined | `p.trace.declined` | which proposals stay quiet |
| Ground, reruns, second release | `journey.runs[].addrs` | counts |
| Where the loop is | nothing | `journeyRead(p, now, care)` |
| Care level | nothing, ever | a runtime screen, passed in |

### 4.2 The chain view

`traceChain` is pure and does not parse. Input: a trace id or a citation id; it generalises `dlyResolve` (`daily.js:982`). Output: six rows with closed keys `said, heard, maybe, felt, changed, confirmed`, each a list of `{kind, id, at}` and a count. An empty row is present and empty.
- References hold ids and offsets, never words: no second copy of the story.
- `felt` is evidence with dimension affect; `changed` is dimension effect or an outcome.
- `confirmed` is an `observed` source (meter line, practice timestamp) or the person's own `confirm`. A report alone is `felt` or `changed`.
- One ceiling table (AI's `agentCeil`): no source outranks its agent. One test over `TRACE_PROMOTE`, `TRACE_CAUSE_SRC` and `dlyGroundOne` replaces three copies.

### 4.3 Declined

`p.trace.declined = [{id, from, edge, to, at}]`, cap 500, `id` random 10 characters. Closed keys, refused by name; edge in the rule table; a repeated triple is refused "already declined". A proposal matching a declined triple is not made again until a new entry cites the pair. "Not me" and "Set aside" (uiux) write it; the screen word is the voice seat's.

### 4.4 Run addresses

`journey.runs[] = {t, lines, fresh, rerun, end, addrs:[int]}`. Each address is checked against the address table, at most 112 distinct, refused by name if outside. Fresh addresses must be in `meter.unique`. Runs without `addrs` read as unknown, never zero. Ground counts distinct addresses, which fixes game's lines-versus-addresses defect. Lands before `journey.js` ships.

### 4.5 JourneyState

`journeyRead(p, now, care)` is pure, game's shape: `touched` per loop quarter, `turns`, `ground`, `standing`, `evidence {reported, observed}`, `care`, `next`. No stage, no day number, nothing stored. `care` is the host's runtime screen result; the engine never reads it off the record.
- Gates read objects, never `journey.log` (capped at 500), and rest on free acts only.
- Gate ids: lower snake, as `JOURNEY_EVENTS`; one test maps them to `PR_EVENTS`.
- `next` is one slot, `src:'proposed'`, with `because` ids. The five existing "next" functions become its inputs.
- Ritual plans arrive as an argument until 4.8 lands.

### 4.6 Unknown keys carried

`validateProfile` returns `p.carry`, every top level key it does not name, verbatim, and the save writes it back. No version bump.
- JSON only, 256 KB total, depth 6.
- One list, `RECORD_NEVER`, shared by `validateProfile`, `OB_NEVER` and the claim, refused by name at any depth: `token session password email key secret customer subscription stripe user_id userId customer_id`. Today only the first four are refused; the rest vanish silently.
- Carried keys are never sent; the claim is an allowlist.
- Honest limit: records written by a new build are safe only in builds from this slice on. Repack `atuned-packed.html` the day it ships.

### 4.7 Ids

- Import: an id already present gets a new one, and `status()` says "imported as a copy" (measured: three records, one id).
- Load: a later duplicate gets a fresh id. Side data keyed by the old id stays with the first.
- Identity versus order, as for tabs: new lists carry a random `id`; position is display only. Existing `seq === i+1` logs are not retrofitted until sync is built.

### 4.8 Side stores

`atuned-ritual-active` and `atuned-avatar-side` move into one top level `p.side = {v:1, ritual, avatar}`, each half through its existing door (`ritPlanOk` moves from `ui/ritual.js` into the engine). Top level, because a new key in a closed bag refuses the record in an older build; 4.6 carries it. Export then round trips. `side.ritual` retires at the `practiceFromLegacy` cutover. Migration reads the old keys once and clears them only after a save succeeds.

### 4.9 Budget

One budget on `source.profiles`: warn at 3.5 million characters, refuse new lists and side data (never the story) at 4.0, each by name through `status()`. Set `PR_CAP` so full evidence and log fit in 1 MB a profile (measured 540 and 160 bytes: evidence 1,000, log 2,500, to be re-measured).

### 4.10 Privacy inventory, as code

Engine table `PRIVACY`: `{where, what, who, howlong, leaves, exported, claimed, removedBy}`. A gate fails if any top level key of `blankProfile`, any `localStorage` key literal in `ui/`, or any server column is missing.

| Where | Leaves | In export | Removed by |
|---|---|---|---|
| `source.profiles` record | no (claim, later) | yes | forget |
| refused records (`STORE_KEPT`), `source.profiles.unreadable.*` | no | no | "clear unreadable", with count and bytes |
| `p.side` | no | yes (new) | forget |
| `declined`, `journey.runs` | claim, later | yes | forget |
| `source.session` | token on each call | no | sign out |
| `source.outbox` | no sender bound | no | clear |
| safety result | never | never | never stored |
| consent, grants | server only | no | withdraw, revoke |

`bindStore(get,set,del)` gains an optional delete (fallback: write an empty string). `forget(id)` removes the record, side data and unreadable copies, then reads each key back, and reports by name if one remains. The Settings "never held together" line is replaced with the true one (`DECISIONS.md:1382`). The "Improve the Models" toggle goes at launch.

## 5. Revised grade

GRADE: 60/100 (was 54). Moved up by: technical and AI reaching "view, not store"; creative's rename; game's run log. Held down by: no writers, no delete seam, the holes in deletion.

## 6. Top 5

1. **Boundary slice** (S to M): `carry`, `RECORD_NEVER`, import id, duplicate repair, delete seam. Phone only arrival, skeptic.
2. **`addrs`, `declined`, budget** (S), before `journey.js` merges. Skeptic, practitioner.
3. **`p.side` and `forget`** (M). Acute distress on a shared device.
4. **First writers, then `traceChain`** (M). Skeptic wants the chain.
5. **`journeyRead` and the `PRIVACY` gate** (M). Practitioner needs the visible table.

## 7. Question for the owner

None. Decided: no latch in MVP; no stored safety label; no top level `ledger`; no schema bump (`SCHEMA_V` stays 2; each part keeps its own version; correct the stale "flagged for his ruling" comments, `schema.js:6-11`). He is needed only if `reboot-os` wants one shared record version.
