# Pass 3, systems director (Yuki Brennan). Round PK

Checked at `815dba2`. I re-read `engine/schema.js`, `engine/trace.js` and the merge.

## 1. The architecture in three sentences

The record stays one device owned profile; every new idea (the trace, where the loop is, the safety result) is a pure read over what is already stored, plus two small lists. One door, `validateProfile`, refuses by name, carries keys it does not know, and one `PRIVACY` table says where every stored key lives and how it dies. The server owns tier and money; the browser owns pace and content.

**The merge bent one thing of mine, and it is a real defect.** It puts `p.trace.declined` inside the trace bag and says "bumps `TRACE_V`". `validateTrace` (`trace.js:600`) refuses any key outside `TRACE_KEYS` ("may not carry declined") and any `v` above `TRACE_V`. An older build would refuse the WHOLE record, not drop one list. That is the failure my pass 2 gave as the reason `p.side` is top level; I applied the rule once and missed it twice. Fix: `declined` is a top level `p.declined` with its own `v:1`, and `TRACE_V` stays 1. The merge also lost: a random id on every new list entry (so lists can merge across devices later), and the wrong `addicted` row filed under joy in `ADJ2CHG`.

## 2. The ICP room (data view only)

- **Marta, 02:00, distress.** Sees the box. The safety result is never stored, so the night leaves no trace. Risk: she deletes the entry in shame and Delete misses a kept copy. *"Make it gone, really gone."*
- **Nils, skeptic.** Opens Why: six rows of ids, "Nothing recorded." when empty, Confirmed only after his own tap. Leaves at any number with no source. *"Show me the row, not the score."*
- **Camille, practitioner.** Reads the `PRIVACY` table. Leaves if the consent list is a constant, not derived from grants. *"Who can see this, and since when?"*
- **Whitney, phone only.** Safari may clear script written storage after about a week unused (from memory, verify on a real iPhone). Trusts only an export file that says when it was cut. *"Where did my week go?"*
- **Renata, operator.** Gets counts of distinct days per row, checkable. A score is refused by name (`confidence`). Stays if counts export. *"Give me the count and the dates."*
- **Gordon, anti clinical.** No state name ever prints. Not me writes `p.declined` so the same Maybe does not return. If it returns he is gone. *"I said no. Why again?"*
- **Sofia, consent list.** Grants live on the server, not the record. Until R5 there is nothing to list, so lead is closed to purchase. She waits. *"Show me who has sight, and let me revoke."*
- **Trey, quiz tourist.** Import must mint a new id and say so, so he cannot overwrite a real record. Leaves if sign in asks for more than an email. *"Will this keep emailing me?"*

## 3. Unified quality: 64/100 from the data view

One name per concept (closed keys Said, Heard, Maybe, Felt, Changed, Confirmed), one grammar of failure (`status()`). Gaps:
1. **No writer exists.** `p.practice` and trace edges read empty today; the chain would draw six empty rows.
2. **Deletion misses keys.** `STORE_KEPT`, `source.profiles.unreadable.*`, `source.outbox`, two side stores. `bindStore(get,set)` (`schema.js:360`) has no delete.
3. **Silent loss.** `validateProfile` copies only named keys onto a blank; there is no `carry`.

## 4. Final grade

GRADE: 64/100 (pass 1 54, pass 2 60)

Up four: the merge is one story (view not store, one run log, no top level ledger). Held under 70: the section 1 defect shows a "small additive" change can hide a whole record refusal, and no writer feeds the chain.

## 5. My slices

`engine/schema.js` and `ui/storyui.js` are hot, so schema slices run in series. Every slice must not touch the TAB integers or `SCHEMA_V` (the owner's call; it stays 2).

**A2. Record door, part 1. S, MVP.** `validateProfile` returns `p.carry` (unknown top level keys, JSON only, 256 KB, depth 6), saved back verbatim. One `RECORD_NEVER` list shared with `OB_NEVER`, refused by name at any depth. Import mints a new id on collision and `status()` says "imported as a copy"; a later duplicate on load gets a fresh id. Fix stale comments `schema.js:6-11`. Changes `engine/schema.js`, `engine/outbox.js`, `engine/export.js`. Not `ui/`, `trace.js`. Gate `tests/engine.js`: a newer key survives an older save; import twice gives two ids; `email` at depth 4 refused by name; 257 KB carry refused. Unlocks A2b, A8a, A9, A11, R4. Whitney, Trey.

**A2b. Record door, part 2. S, MVP.** `bindStore(get,set,del)` (fallback: write an empty string). One budget on `source.profiles`: warn at 3.5M characters, refuse new lists at 4.0M, never the story, by name. Set `PR_CAP` so full evidence and log fit 1 MB. "Clear unreadable" shows count and bytes. Changes `engine/schema.js`, `engine/practice.js` (`PR_CAP` only). Not story fields or `pImport` atomicity. Gate: fill to 4.0M, new list refused, story saves. Unlocks A11. Marta, Whitney.

**A3. Privacy table. S, MVP.** `PRIVACY` data, one row per stored key. Changes new `engine/privacy.js`, `atuned_src/MANIFEST`, `atuned_src/hostfree.py` (ban `crypto`, `indexedDB`). Not any string a person reads. Gate: build fails on a `blankProfile` key or a `ui/` `localStorage` literal with no row. Unlocks A11, the Settings page. Camille, Sofia, Nils.

**A6d. Wrong data rows. S, MVP.** Move `addicted` out of joy in `ADJ2CHG`; check siblings against `lexFamilyFloor`. Changes `engine/lexicon.js`. Not weights. Gate: `tests/engine.js` row check. Marta.

**A7. One ceiling table. S, MVP.** `SRC_CEIL` replaces the three copies (`TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne`). Changes new `engine/reading.js`, `engine/trace.js`, `engine/daily.js`. Not schema. Gate: every source and kind pair; agent sources refused by name. Nils, Renata.

**A8a. The two additive lists. S, MVP.** Top level `p.declined` (closed keys, cap 500, random id, repeated triple refused "already declined", `v:1`) and `addrs` on `journey.runs` rows (at most 112 distinct, inside the address table; absent reads unknown, never zero). Changes `engine/schema.js`. Not `TRACE_KEYS`. Gate: old record loads; a record with `declined` loads in the previous build through `carry`; bad edge refused by name. Unlocks A8b, A13. Gordon.

**A8b. Trace chain and first writers. M, MVP.** `traceChain(record, id)`, six closed rows, ids and offsets only; writers from release and story cards via `practiceDo`. Changes `engine/trace.js`, `engine/practice.js`, one call in `ui/storyui.js`. Not the `p.rituals` cutover. Gate: every Summary sentence resolves to ids (`traceOrphans` precedent); `p.practice` non empty after a real run; old stamp reads "read under an older lexicon". Unlocks A13. Nils, Renata.

**A9. Plan refusals. S, MVP.** A `plan.granted` above the largest grant is refused by name, not clamped; the reading uses the smaller of it and the tier grant. Changes `engine/plan.js`, `engine/schema.js`. Not server. Gate: one test per forge. Trey.

**A11. Deletion and side stores. M, MVP.** `p.side={v:1,ritual,avatar}` (`ritPlanOk` moves to the engine); migration clears old keys only after a save succeeds. `forget(id)` removes record, side data, kept bytes, unreadable copies, outbox, reads each back, names any remainder. Entry level delete. Changes `engine/schema.js`, `engine/profiles.js`, `ui/ritual.js`, `ui/avatarui.js`, `ui/account.js`. Not `accForget` semantics. Gate: delete then scan `localStorage`; export then import equal, side stores included. Unlocks the encrypted export round trip. Marta, Whitney.

**A12 engine half. `loopRead`. M, MVP.** Pure, new `engine/loop.js`, no `ui/`. Gate: no day or stage in output; free acts only. Unlocks the Next slot.

**R3. Server deletion. S.** `deleteAccount` clears every table; scan for the id. **R1.** Plan integer contract test. **R4. L, later.** Sync kinds, one sealed chunk per day, grow only merge by random id; after A2, A8a, R0 to R3.

## 6. Order

1. Parallel first wave, no shared files: A2, A3, A6d, A7, R1, R3.
2. Series on `schema.js`: A2, A2b, A8a, A9, A11. Never start A8a or A11 before A2: they add keys older builds delete.
3. A8b after A8a and A7, taking its turn on `ui/storyui.js` behind the safety slices.
4. A12 engine half after A7. R4 last.

## 7. Question for the owner

None. Taken as default: `declined` top level, `TRACE_V` stays 1; forged `granted` refused, not clamped; no `SCHEMA_V` change.
