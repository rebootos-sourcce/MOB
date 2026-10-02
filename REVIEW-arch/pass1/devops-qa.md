# PASS 1, DevOps and QA (Sam Oyelaran): provability of the six-area proposal

GRADE: 57/100 as proposed, in my terms: could I prove each area works and fail a gate when it breaks?

Method. All figures read off runs on HEAD `fed5be4`. Probes were checked against a known good case first
(the storage probe saw a key I planted; my first sight probe indexed SIGHT by position, lied, and was rewritten).

| Criterion | /10 | Evidence |
|---|---|---|
| Reusable gate harness | 9 | engine headless, host free, seeded simulators |
| Safety provability | 2 | `parseStory` returns no class at all (below); no fixtures; no gate |
| Ledger and orchestrator provability | 6 | `trace.js` enforces five provenance values, 266 checks; no seven field contract yet |
| Journey state provability | 5 | pure readers taking `now` exist (`streakRead`); `proto/ninety/arc90.js` is evidence, not a gate |
| Backup and restore | 4 | round trip tested (`tests/engine.js:794`); no drill; export omits two stores |
| Privacy inventory | 5 | writes funnel through `STORE.set` (18 sites); no gate |
| Entitlement | 4 | stub in `functional.js:3322`, 56 Worker tests; record self grants a tier |
| Gate hygiene | 6 | `tests/README.md` says 279 / 262 / 40; the brief's 741 / 572 / 96 / 62 is stale too |

## Measured current facts

Gates, in order. BUILD.sh and BUILD-engine.sh pass (built to scratch: div balance 0, no em dashes, engine host free, 644 exports).
`source.html` equals a fresh build of HEAD except for the one stamp line.
- engine 3638, functional 1806, collide 351, design 186, all 0 failed (functional took 687 s; design 137 s).
- Headless extras: trace 266, practice 780, daily 437. Not run: monitor, funnel, boot, voice check.
- Worker (separate repo `/home/user/reboot-os/atuned/server`): 56 of 56.
- Read counts off the run; never copy them into a document.

The record. `blankProfile` has 24 top level keys, 127 leaf paths, 2003 bytes empty (v, id, name, created,
updated, soul, axes, who, ui, seed, meter, plan, avatar, purpose, laws, intake, work, gates, story,
rituals, history, practice, trace, summaries). Each has a `validateProfile` branch. Free text sits in
story, history, rituals, trace and summaries. Schema v2.

Every storage key written (static scan of all `STORE.set`; Chromium confirmed a clean boot writes only `source.profiles`):
- record: `source.profiles`, and `source.profiles.unreadable.<time>` (the set aside copy of a store that would not parse)
- beside the record, per profile id, not in the export: `atuned-ritual-active`, `atuned-avatar-side`
- identity and queue: `source.session` (token and email), `source.outbox`
- preferences, eleven families, writes swallowed on failure: `fbar`, `lcol`, `lcolc`, `rcol`, `axdial`, `fview`, `bmmk`, `bmsh<letter>`, `bmov`, `cnov`, `dens`, `devsight`
- no `sessionStorage`, IndexedDB or cookie anywhere in `atuned_src`.

Network. One `fetch`, `ui/auth.js:97`, seven routes (signup, signin, forgot, signout, `/v1/me`, billing checkout and portal). No record sync client exists, though the Worker accepts a `ledger` kind.

`status(...,'fail')`: 46 call sites in 13 files (avatarui 14, account 12, sound 4, auth 4, rest 1 to 3).
Record save reports via `pPersist` then `statusSaved`. Silent by design: the eleven preference writes.
Unmeasured: `pNew` ignores `pPersist`'s result; whether callers always check is not proven.

Two defects found, both reproduced:
1. Self grant. `pImport` of a record with `plan:{tier:'four',status:'active',...}` is accepted; `planOf` reads four and live, and all 7 SIGHT layers flip to seen (known good: a genuine four also flips 7). The schema says the app never writes plan; the boundary does not enforce it.
2. No safety class. `parseStory('I want to kill myself')` gives 0 imprints and no flag. `'He hits me and I am scared to go home'` gives 4 imprints and goes on to charge. No returned key is a class.

## AREA BY AREA

### 1. Orchestrator and agent contract
- Exists: `trace.js` provenance, key allowlists (`TRACE_INTENT_KEYS`), `{ok,why}` returns, and registration is never causation (supports, not causes).
- Gate: a validator over every agent's output (the seven fields), plus seeded properties in the style of `tools/simulate-path.js`: shuffling agent order gives the same belief state; no path turns inferred or proposed into known without a user event; every conclusion's chain resolves to ledger ids that exist.
- Gap: nothing wraps the agents in one shape yet. Test the shape first, on stub agents.
- Size M. Risk: must stay host free, so time is a parameter.

### 2. 90 day engine
- Gate: `journeyRead(record, now)` as a pure function, table tested. (a) Same record at day 20 and day 40 reads the same stage: behaviour, not days. (b) Reading twice is identical (as `read()`). (c) Records for each fixture persona are built through real engine calls (`meterRun`, ritual done), never hand typed. (d) Summary reads only the state (spy on the record). (e) Schema snapshot: the 24 key list frozen, so a new stored key fails until flagged.
- Convert `arc90.js` into a seeded gate on the simulated clock. Size M.
- Risk: a stored JourneyState drifts from the record. Derive it, store only what cannot be derived, as `trace.js` already does.

### 3. Evidence ledger
- Gate: the verification chain as an ordered state machine, forbidden jumps proven by negative tests; "why do you think that" returns a non empty path to a said event.
- Add a byte budget gate on the heaviest persona record against the localStorage quota. Not measured today.
- Read the V8 unexecuted list for the new module, not the average. Size L.

### 4. Safety gate
- Fixtures: `tests/fixtures/safety.json` rows of text, expected class, must not say. The engine holds the lexicon only as data in `engine/data/`; a lint (like `hostfree.py`) fails if any fixture string appears in engine logic. So distress strings never live in code.
- Gates: (a) classification per fixture across the seven classes; (b) false positive floor, since a false alarm on ordinary pain is the costly error here (the repo's own rule on LEAN): all persona stories and every feelings wheel word must stay ordinary; (c) never diagnose: the output across all fixtures matches no clinical regex, and "Depressed" as a wheel feeling is a word, not a finding; (d) ordering: with a crisis fixture, no charge, meter or ledger write happened; (e) mutation: delete a lexicon row and the gate must fail.
- No permanent safety line is a ruling, so silence on ordinary input is asserted as hard as response on distress.
- Size M gates, L lexicon. Risk: the lexicon needs clinical review, which a gate cannot supply.

### 5. Privacy
- Gate `tests/privacy.js`: a checked in manifest of every key with class, holds personal data, leaves device, exported, deleted. Static scan fails on a key, `indexedDB`, cookie, `sessionStorage` or `fetch` target not in the manifest; the Chromium half wraps `setItem` and asserts writes are a subset (known good: it must see a planted key). Patterned keys (`bmsh<letter>`, `unreadable.<time>`) are manifest entries.
- Delete drill: `accForget` clears the two side keys; outbox and session are unmeasured, so the drill measures them.
- Backup and restore drill `tests/drill.js`: build a loaded record, take backup, wipe the store, restore, canonical JSON and hash equal; then cut the stored bytes to 60 percent and require `storeSetAside`; then a full store and require a stated failure. Write the side key case first and expect red: avatar and active rituals are not in `pExport`.
- Size S inventory, M drill. Risk: encryption at rest and retention are policy; no test proves them.

### 6. Commerce and identity
- Today the client holds the allowance (`meter.unique`, `plan.base`) and the tier. Add: a test that an imported record has `plan` stripped or ignored until the server answers; the boot check downgrades on 401 only (exists, kept).
- Contract: freeze real Worker `/v1/me` responses as fixtures that both the Worker tests and the `functional.js` stub replay, so the stub cannot drift. Today the stub is hand written.
- Reconcile to the ruling: sight is by layer under SIGHT, so a downgrade today hides layers already seen. The proposal's "ground opened is never lost" and SIGHT disagree. The test cannot be written until that is settled (question 1).
- Server meter: the Worker has no allowance or opened ground table, so a server authoritative count is a Worker change plus a migration. Size L, in the other repo.

## RISKS
- A green average hiding an unexecuted module (the birth precedent).
- A gate that types a count (nine bites on record).
- The hand written stub drifting from the Worker.
- The record outgrowing the quota once the ledger lands.

## RECOMMENDED ORDER (gates first)
1. Privacy inventory plus schema snapshot: S, no dependencies, protects every additive change.
2. Self grant fix with its gate, prove it fails on the revert: S.
3. Backup drill, red first on the side keys: M.
4. Safety fixtures, lint and gate before any lexicon code: M.
5. Frozen Worker contract fixtures: S.
6. Ledger and orchestrator contract properties on stub agents: M.
7. `journeyRead` table gate and `arc90` conversion: M.

NOT SIGNED OFF to build any area before its gate exists. Signed off on the harness.

Questions that block (one each): (1) When a person downgrades, do they keep sight of layers they already opened, or only ground? Today SIGHT hides all 7 layers. (2) May the Worker hold the opened ground list, so the count stops living in a record a person can edit?
