# Pass 3, systems director (Yuki Brennan). Round PK

Checked at `815dba2`. I re-read `engine/schema.js`, `engine/trace.js` and the merge.

## 1. The architecture in three sentences

The record stays one device owned profile; every new idea (the trace, where the loop is, the safety result) is a pure read over what is already stored, and only two small lists are added. One door, `validateProfile`, refuses by name, carries keys it does not know, and one `PRIVACY` table says where every stored key lives and how it dies. The server owns tier and money; the browser owns pace and content.

**Did the merge bend anything of mine? Yes, one thing, and it is a real defect.** The merge puts `p.trace.declined` inside the trace bag and says "bumps `TRACE_V`". I read `validateTrace` (`trace.js:600`): it refuses any key outside `TRACE_KEYS` ("may not carry declined") and refuses any `v` above `TRACE_V`. So an older build would refuse the WHOLE record, not drop one list. That is the exact failure my pass 2 gave as the reason `p.side` is top level. I held two rules and applied one. Fix: `declined` is a top level list `p.declined` with its own `v:1`, and `TRACE_V` does not move. Once `carry` lands, older builds from that slice on keep it. Also, merge lost two small things: one id per new list entry (random, minted at write, so lists can merge across devices later), and the wrong data row `addicted` filed under joy in `ADJ2CHG` (`lexicon.js`).

## 2. The ICP room (from the data view)

- **Marta, 02:00, acute distress.** Sees the box, no card yet. The safety result is never stored, so nothing about this night can be read later. Risk: she deletes the entry in shame and the Delete button misses the unreadable copy. Trust comes from entry level delete that reaches every key. *"Make it be gone, really gone."*
- **Nils, the skeptic.** Opens the Why chain. Six rows, each a list of ids and offsets, "Nothing recorded." when empty. He checks that Confirmed needs his own tap. Leaves if the chain shows a number with no source. *"Show me the row. Not the score."*
- **Camille, somatic practitioner.** Wants to see what a client's record holds. The `PRIVACY` table is her answer: a person can read it. She leaves if consent is a constant instead of a derived list. *"Who can see this, today, and since when?"*
- **Whitney, phone only.** Safari may clear script written storage after about a week unused (from memory, verify on a real iPhone). She loses the record and nobody told her. She trusts only an export file that says when it was cut. *"Where did my week go?"*
- **Renata, operator.** Wants the chain as a number. She gets counts of distinct days per row, which are checkable. A single score is refused by name (`confidence` is a banned key). She stays if counts are exportable. *"Give me the count and the date range."*
- **Gordon, refuses anything clinical.** Never sees a state name; the engine's level never prints. He can push Not me, and it goes to `p.declined`, so the same Maybe does not return. If it returns he is gone. *"I said no. Why is it asking again?"*
- **Sofia, needs the consent list.** The list comes from grants on the server, not the record. Until R5 exists there is nothing to list, and the lead verb is closed to purchase. She waits. *"Show me who has sight, and let me revoke."*
- **Trey, quiz tourist.** Arrives with a quiz record, no profile. Import must mint a new id and say so; he must not overwrite a real record by sharing an id. He leaves if sign in asks for more than an email. *"Is this going to keep emailing me?"*

## 3. Unified quality: 64/100 from the data view

One voice in the record: names are once each (Said, Heard, Maybe, Felt, Changed, Confirmed are the closed keys). One grammar of failure: every write reports through `status()`. Gaps:

1. **No writer exists.** `p.practice` and the trace edges are read as empty arrays today, so the chain would draw six empty rows. A derived view of nothing is a lie of omission.
2. **Deletion does not reach every key.** `STORE_KEPT`, `source.profiles.unreadable.*`, `source.outbox`, the two side stores. `bindStore` has no delete.
3. **The record loses data silently.** `validateProfile` builds a blank and copies only named keys (read at `schema.js:814`); there is no `carry`. Any new top level key is deleted by an older build, with no report.

## 4. Final grade

GRADE: 64/100 (pass 1 54, pass 2 60)

Moved up by four points: the merge is now one story (view not store, one run log, no new top level ledger) and the data is closer to buildable. Held under 70 because the defect in section 1 shows the merge can still hide a record refusal inside a "small additive" change, and because nothing stored today writes the chain.

## 5. My slices

Hot files, in series: `engine/schema.js`, `ui/storyui.js`. I name `schema.js` slices so no two run at once. "Must not touch" always includes the TAB integers and `SCHEMA_V` (the owner's call; it stays 2).

**A2. Record door, part 1. S, MVP.**
- Goal: `validateProfile` returns `p.carry` (unknown top level keys, JSON only, 256 KB, depth 6), saved back verbatim. `RECORD_NEVER` is one list shared with `OB_NEVER`, refused by name at any depth. Import mints a new id when it collides and `status()` says "imported as a copy". A later duplicate id on load gets a fresh id. Fix the stale "flagged for his ruling" comments at `schema.js:6-11`.
- Files: `engine/schema.js`, `engine/outbox.js` (share the list), `engine/export.js` (export the symbol).
- Must not touch: `ui/`, `trace.js`, any version constant.
- Gate: `tests/engine.js`: a newer key survives an older save; import twice gives two ids; `email` at depth 4 refused by name; a 257 KB carry refused by name.
- Unlocks: A2b, A8a, A9, A11, R4. Every ICP: no silent loss. Whitney and Trey feel it first.

**A2b. Record door, part 2. S, MVP.**
- Goal: `bindStore(get,set,del)` with the delete optional (fallback: write an empty string). One budget on `source.profiles`: warn at 3.5M characters, refuse new lists at 4.0M, never the story, each by name. `PR_CAP` set so the full evidence and log fit in 1 MB. "Clear unreadable" shows count and bytes.
- Files: `engine/schema.js`, `engine/practice.js` (`PR_CAP` only).
- Must not touch: the story fields, `pImport` atomicity.
- Gate: `tests/engine.js`: fill to 4.0M, new list refused by name, story still saves; a host with no `del` still clears a key.
- Unlocks: A11. Marta, Whitney.

**A3. Privacy table. S, MVP.** Goal: `PRIVACY` data, one row per stored key. Files: new `engine/privacy.js`, `atuned_src/MANIFEST`, `atuned_src/hostfree.py` (ban `crypto`, `indexedDB`). Must not touch: any string a person reads (the voice seat generates Stays, Leaves, Delete from it). Gate: the build fails on any top level key of `blankProfile`, any `localStorage` key literal in `ui/`, or any carried key class with no row. Unlocks: A11 and the Settings page. Camille, Sofia, Nils.

**A6d. Wrong data rows. S, MVP.** Goal: move `addicted` out of joy in `ADJ2CHG` and check the other rows against `lexFamilyFloor`. Files: `engine/lexicon.js`. Must not touch: weights. Gate: `tests/engine.js` row-by-row against the family table. Marta.

**A7. One ceiling table. S, MVP.** Goal: `SRC_CEIL` replaces `TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne` copies. Files: new `engine/reading.js` (after `sniff.js`), `engine/trace.js`, `engine/daily.js`. Must not touch: schema, `storyui.js`. Gate: every source and kind pair, agent sources refused by name. Nils, Renata.

**A8a. The two additive lists. S, MVP.** Goal: top level `p.declined` (closed keys, cap 500, random id, repeated triple refused "already declined", `v:1`) and `addrs` on `journey.runs` rows (at most 112 distinct, each inside the address table, unknown if absent, never zero). `TRACE_V` does not move. Files: `engine/schema.js`, `engine/trace.js` (read only for the edge rule table). Must not touch: `TRACE_KEYS`, `journey.runs` meaning. Gate: old record loads; a record with `declined` loads in the previous commit's build through `carry`; bad edge refused by name. Unlocks: A8b, A13. Gordon.

**A8b. Trace chain and first writers. M, MVP.** Goal: `traceChain(record, id)`, six closed rows, ids and offsets only; writers from release and story cards through `practiceDo`. Files: `engine/trace.js`, `engine/practice.js`, `ui/storyui.js` (one call, hot). Must not touch: `p.rituals` cutover. Gate: every Summary sentence resolves to ids (`traceOrphans` precedent); `p.practice` non empty after a real run; chain reads frozen bands stamped `lex` and says "read under an older lexicon" when old. Unlocks: A13. Nils, Renata.

**A9. Plan refusals. S, MVP.** Goal: `plan.granted` above the largest grant in the plan table is refused by name, not clamped; reading uses the smaller of `granted` and the tier grant. Files: `engine/plan.js`, `engine/schema.js`. Must not touch: server. Gate: one test per forge. Trey.

**A11. Deletion and side stores. M, MVP.** Goal: `p.side={v:1,ritual,avatar}` (`ritPlanOk` moves into the engine); migration reads old keys once, clears only after a save succeeds; `forget(id)` removes the record, side data, kept bytes, unreadable copies and outbox, then reads each back and names any remainder; entry level delete. Files: `engine/schema.js`, `engine/profiles.js`, `ui/ritual.js`, `ui/avatarui.js`, `ui/account.js`. Must not touch: `accForget` semantics. Gate: delete, then scan `localStorage`; export then import is equal, side stores included. Unlocks: encrypted export (A10 round trip). Marta, Whitney.

**A12 (engine half). `loopRead`. M, MVP.** Pure, new `engine/loop.js`; no `ui/`. Gate: no day number or stage in output; free acts only. Unlocks the Next slot (uiux seat).

**R3 (server). Deletion complete. S.** `deleteAccount` clears every table; scan for the id. **R1.** Contract test on plan integers. **R4 (later, L).** Sync kinds: one sealed chunk per day, grow only merge by random id; needs A2, A8a, R0 to R3.

## 6. Order

1. Parallel first wave: A2 (schema), A3 (privacy), A6d (lexicon), A7 (reading, trace, daily), R1, R3. No two touch the same file.
2. Series on `schema.js`: A2, then A2b, then A8a, then A9, then A11. Do not start A8a or A11 before A2: they add keys older builds delete.
3. A8b after A8a and A7 (needs one `storyui.js` call; takes its turn behind the safety slices on that file).
4. A12 engine half any time after A7, before the Next slot.
5. R4 last.

## 7. Question for the owner

None. Taken as default: `declined` is top level and `TRACE_V` stays 1; refusing a forged `granted` by name rather than clamping; no `SCHEMA_V` change.
