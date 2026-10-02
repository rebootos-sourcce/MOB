# Pass 1, technical director (Anders Kjeld). Round PK, 2 October

Scope: can the six areas be built inside the host free engine, one file, one network seam. Measured where I could, estimated where I say so. Measurements: headless Chromium on this sandbox, `source.html` at the committed build (3,712,246 bytes), with the CPU throttled 4x as the stand in for a four year old laptop. Server read from `/home/user/reboot-os/atuned/server` on disk (branch `claude/app-migration-decision-yx56cj`, which may lag `origin/main`; HOSTING-SETUP warned about a stale checkout once already).

GRADE: 62/100. Yes with changes. The architecture fits the constraints. Three things in it do not: it assumes a server authoritative meter that does not exist, it assumes encryption the account recovery ruling forbids, and it adds work to a typing path that is already over budget.

| Criterion | /10 | Evidence |
|---|---|---|
| Fits the host free engine | 8 | Pure fold functions over the record match `daily.js` (`dlyAppend`) and `trace.js`. Crypto and network stay in `ui/`. |
| Keystroke budget safe | 4 | Today's input handler is already over 8ms (table below). Orchestrator must stay off it. |
| Storage headroom | 5 | One key `source.profiles` holds every profile, rewritten whole on each save (`pPersist`, `engine/schema.js`). About 5M characters shared. |
| Server readiness | 5 | Accounts, Stripe, push, sealed sync exist. Meter, practitioner grants, MOB record kinds do not. |
| Encryption feasibility | 4 | Server seal built. Client side encryption collides with the recovery ruling (DECISIONS, round PD). |
| Backup and restore provable | 3 | Export and import exist. No drill, no server restore test, no encrypted file. |
| One file size cost | 7 | Estimate: new engine code 60 to 100KB source, about 2 to 3% of 3.7MB. Packed file is 1,753,033 bytes. |
| Gateable | 7 | The gate habits (boundary refuses by name, hostfree, monitor) transfer cleanly. |

## The keystroke number

Every input event runs `parseStory`, `srcHear`, `stPaintHL`, `stRelPanel`, `impRender` (`ui/storyui.js` line 202, `stRefresh`). Measured, whole handler, median:

| Words in the box | 1x | 4x throttle |
|---|---|---|
| 50 | 5.4ms | 22.8ms |
| 300 | 7.7ms | 34.3ms |
| 1000 | 17.0ms | 79.4ms |
| 3000 | 53.3ms | 217ms |

At 1000 words the pieces are `stRead` 12.8ms (parse 3.5 plus hear 3.5 plus marks), `impRender` 5.1, `stPaintHL` 3.0, `stRelPanel` 2.6. Scan cost is linear, about 3.3 microseconds a word in node. The page also holds 3,998 DOM nodes against my budget of 3,000.

So the orchestrator costs zero per keystroke by construction, and it must stay that way. It runs on commit (`stCommit`) and on idle. Commit cost, measured on a synthetic 2,000 event ledger (487KB, about 90 days of heavy use): fold 0.12ms, `JSON.stringify` 0.8ms, localStorage write 0.9ms at 1x and 6ms at 4x. That is under 10ms even throttled. The one thing that belongs on the typing path is the safety screen, and only on the last sentence at a sentence boundary: 12 words at 3.3 microseconds is about 40 microseconds (estimate from the scan rate). Whole text is rescanned on commit.

Before anything new lands, the existing path needs a floor (slice 1 below). Cheap fix: do the paint work in one rAF (browser draw callback) and parse only on a 150ms pause. Estimate: 1000 words drops from 17ms to under 4ms per keystroke.

## Area by area

**1. Orchestrator.** Exists: `trace.js` already has five provenance states (known, inferred, proposed, user_confirmed, observed) and refuses promotion by table (`TRACE_PROMOTE`, "may not become"). That is the proposal's "inference never becomes fact" rule, enforced inside one module. `sourceai.js` (`srcHear`, `srcTurn`) and `sniff.js` (`sniffStory`) are the agents. New: one contract and a hypothesis list. Home: `atuned_src/engine/orch.js`, after `daily.js` and before `outbox.js` in MANIFEST (it needs sniff, sourceai, trace, practice, ladder, daily loaded first). Shape: `orchStep(profile, observations, now)` returns new ledger adds, hypotheses, next action. No store call; the host passes the save function, as `dlyDayOpen` does. The boundary refuses by name any observation where an agent source claims a fact. Conflict: the proposal's six words (said, detected, thought, experienced, changed, verified) must map onto trace's five, not become a seventh vocabulary. Cheaper 85%: no new store. The orchestrator is a reducer over `p.story`, `p.practice`, `p.trace`, `p.summaries.events`. MVP. Size M.

**2. Ninety day engine.** Exists: `ladder.js` (`ladderRead`, `streakRead`), `avatar.js` (`avatarDue`), the daily bank. New: `journeyRead(p, now)`, a pure fold, never stored (same rule as `meterNext`). Cost under 1ms at 2,000 events (fold measured). Risk: the behaviour gates BEHAVIOR_OBSERVED and CONTEXT_TRANSFER have no capture today; `daily.js` says "nothing records what a person did". Self report prompts are a UI slice. Size M, after the ledger.

**3. Evidence ledger.** Exists: `daily.js` is an append only validated event list with refs. New: ledger events for experienced, changed, verified, with a confirmation field. Conflict: `daily.js` numbers events `seq` rising by one, which two devices will both claim. Ledger events need a random id plus a clock stamp. Additive field `p.ledger` (validateProfile fills a missing one from blank, so no SCHEMA_V bump needed, but flag it to the owner). Storage cap: 1.5MB per profile, surfaced through `saveState`. Size M.

**4. Safety gate.** Exists: the sniffer, the feelings wheel, the ruling for no permanent line. New: `safetyRead(text)` returns one of seven classes and a fixed response key, never free text, never a clinical label. Pure, offline. It sits before the orchestrator and must never block a commit, because dropping a person's words is worse than a missed flag. Recall cannot be proven, only a fixture floor; say so. Size M for the engine. Copy is the voice seat's.

**5. Privacy as architecture.** Exists: `OB_NEVER` in `outbox.js` is the model (a list refused by name). New: a `PRIVACY` data table, one row per record field (where, who, how long, leaves device, encrypted, deletable, exportable), rendered by the UI. Gate: every key of `blankProfile` and every server table column must appear, or the build fails. This is the only fix to the drift that hit `crashes` once (0002 comment). Size S, then M for the screen.

**6. Commerce and identity.** Exists server side: sign up and in (PBKDF2 100,000 rounds, lockout), `/me` with `billing`, Stripe checkout, portal and webhook, Apple and Google, push cron, sealed sync, export, delete, admin. Not there: the meter. `planAllowance(pl, uniqueCount, giftAt, now)` in `plan.js` runs on the device off `CURP.meter.unique`, and the gift of 100 is a device counter. `plan.js` itself says it is "a product boundary and not security". So "the browser must never decide 1,200 patterns remaining" is not true today.
Plan: `POST /v1/ground/open {key}`, idempotent by key (a rerun costs nothing, matching the ruling), stored as `opened(account_id, key, at)`, answers `{left, tier}`. Allowance becomes a server read; the engine function stays as an offline mirror. The honest limit: the whole reading ships inside the file, so a determined person can still read their own data. Real enforcement exists only for what lives server side (sync, push, practitioner sight, `/canon`, which is empty of tiers today). The ruling to keep one file and work offline means we do not move tables out. Server authority protects the money ledger, not the content. Say that once in the doc.
Conflict to settle in Pass 2: sight is by tier (`SIGHT`), so a downgrade from tier two hides complexes already seen. The proposal's "downgrade never takes opened ground" needs a latch, recorded per opened address on the server. My default: latch. Also server plan integers (0 to 4, `PLAN_OF`) and client keys (free, one to four) are two vocabularies; add a contract test. Size L overall (meter M, sight latch S, practitioner grants M).

## Where each thing lives

| Thing | Home |
|---|---|
| Orchestrator, journey, ledger shape, safety screen, privacy table, envelope format | `engine/` (pure) |
| Crypto calls, sync loop, meter calls | `ui/`, bound by `bindCrypto`, `bindSync` like `bindStore`, `bindSend` |
| The one network seam | `ui/auth.js` stays the only file that calls `fetch`; the sync loop calls through it |

Add `crypto` and `indexedDB` to the `hostfree.py` ban list so the split is enforced.

## Server side needs against reboot-os and Cloudflare

- Sync: the Worker's `KINDS` set is the reboot-os schema (state, imprint, release, reading, cascade, step, day, card, ledger, client, win). MOB's profile fits none. Need new kinds (entry, event-day, profile meta) and a client sync loop. Body cap is 200KB, so ship the ledger as one sealed chunk per day, not per event. Reason: D1 free tier allows about 100,000 row writes a day (from memory, verify). At 20 events a person a day, row per event runs out near 5,000 daily users; per day chunks last 20x longer.
- Conflict policy: ledger is a grow only set keyed by id (merges trivially). Mutable state is derived, not synced. This closes DECISIONS "save conflict between two devices".
- Practitioner: zero server support. New `grants(account, practitioner, scope, granted_at, revoked_at)` plus audit rows. Size M.
- Deletion: the code comment on `deleteAccount` already admits a table was missed once. Gate it (below). D1 backups keep deleted rows for the retention window, which breaks the deletion promise unless a per account data key is destroyed (crypto shredding, size M).
- Cloudflare limits I believe apply, all from memory and to verify: Workers PBKDF2 capped near 100,000 iterations (below the 600,000 usually advised; lockout compensates); 10ms CPU per request on the free plan, 30s on paid; D1 single region, EU jurisdiction only chosen at creation. README says US; EU launch makes this a legal item.
- HOSTING-SETUP.md does not state whether the Worker is on the paid plan. Needed before launch.

## Encryption options in a browser

| Option | Cost | Verdict |
|---|---|---|
| Server seal (built: AES-GCM, `RECORDS_KEY`, tag bound to the row) | none client side | Keep. Protects D1, backups, console. Does not protect from whoever runs the Worker. Matches the recovery ruling. |
| Passphrase encrypted export file | PBKDF2 600k measured 110 to 330ms desktop; low phones estimate 1 to 2s. AES-GCM of 490KB measured 6 to 90ms | Build. MVP. Truthful backup, no server needed. |
| Client side end to end encryption of synced data | same crypto, plus key wrapping per practitioner | Later. Forfeits support recovery (receipt plus five working days). Needs an owner ruling. Size L. |
| Encrypt localStorage in place | key must sit beside the data or be typed on each open | No. Theatre unless a passphrase unlock, which hurts a person in distress on a phone. `SECURITY-IP.md` reaches the same verdict for tables in the file. |

WebCrypto works on `file://` in Chromium here (`isSecureContext` true). Safari and Firefox on `file://` unmeasured. If `crypto.subtle` is missing, the backup falls back to plain and says plainly it is not encrypted. Never claim.

## Backup and restore

Three layers. Device: `pExport` and `pImport` exist; add the encrypted file, with a header (format, KDF settings, iv) and a length check so a cut file says it was cut, the packed file precedent. Account: sync above. Server: D1 point in time restore (Time Travel, retention to verify) plus `wrangler d1 export`. Losing `RECORDS_KEY` loses every body; the ruled sealed second copy needs an owner and a calendar date. Also verify on a real iPhone: Safari clears script written storage after about seven days without a visit (from memory), which makes account sync the real backup for phone only arrivals. Size M.

## Sizes

| Slice | Size |
|---|---|
| Keystroke floor and gate | S |
| Ledger shape and boundary | M |
| Safety gate engine | M |
| Orchestrator v0 | M |
| Journey fold | M |
| Privacy table and screen | S then M |
| Encrypted export and restore | M |
| Server meter and sight latch | M |
| Sync kinds, client loop, chunking | L |
| Practitioner grants | M |
| End to end encryption | L, later |
| IndexedDB (needs an async store seam, breaks `bindStore`'s sync contract) | L, later |

## Risks

- Ledger shape is the irreversible one: records persist on devices. Freeze it first, additive only.
- localStorage quota: one key for every profile; a full store must report by name, never a silent loss.
- Safety false negatives. A fixture floor is not proof. Say so in the UI copy.
- Safari lacks `requestIdleCallback` (from memory); use a timer fallback.
- `source.html` is already 3.7MB; the packed file lagged the build by 17 hours at `18238fe`. Repack before any handover.

## Recommended order (most risk removed first)

1. Keystroke floor and gate (S). Everything else adds to this path.
2. Ledger shape freeze, with id scheme (M). Irreversible, so decide first.
3. Safety gate engine (M). Highest harm if wrong, independent of the rest.
4. Encrypted export and restore drill (M). No data goes off device at scale before a restore is proven.
5. Server meter, sight latch, MOB sync kinds (M to L). Longest lead; runs in reboot-os in parallel.
6. Orchestrator v0, then journey fold (M each).
7. Privacy table and screen (S/M).
8. Later: end to end vault, IndexedDB.

## What a gate must prove

1. Typing 1000 words at 4x throttle: input handler p95 at or under 16ms (fails today at 79ms median). `orchStep` at 2,000 events under 2ms in node.
2. `hostfree.py` passes with `crypto` and `indexedDB` added. `fetch(` appears in exactly one file.
3. No inference becomes fact: every source and kind pair, agent sources refused by name.
4. Every Summary sentence resolves to ledger ids; an orphan fails (`traceOrphans` precedent).
5. Safety: fixture recall floor per class; output vocabulary contains no clinical label; commit never blocked; works with network blocked.
6. Entitlement: downgrade keeps opened ground; double open counts once; client cannot write its own plan.
7. Restore drill on the server shim: export, wipe, import, hash equal; wrong key fails; truncated file says so.
8. Privacy map covers every profile key and every server column; delete account then scan every table for the id.
9. Quota: 90 days, five profiles, save reports failure by name.
10. Size: build bytes and packed bytes stamped in `MONITOR.log`; growth under 3%.

Not compositor work: nothing here animates. Any "why do you think that" chain view should be a plain list under 300 nodes, not a canvas.
