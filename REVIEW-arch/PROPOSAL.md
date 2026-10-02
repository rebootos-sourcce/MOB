# The merged architecture (lead's merge of pass 2, round PK)

Eight pass 2 reports converged. Pass 3 turns this into executable, gate-provable slices.

## What the six areas become (in the product's own words)
1. THE READING RULES (was: orchestrator). Not a service, not a new store. A library:
   `readEntry` (tokenise once, keep raw spans, ONE negation handler, stamp the lexicon
   version; stored imprints answer "as read then", a fresh read "as read now"), `obsValid`
   (one `SRC_CEIL` table replaces the three copies of "an inference never becomes a fact";
   observations hold closed words and a span of two offsets, no free text, no confidence
   number), `sayNext` (one slot, fixed order: care, write, ask, release, ritual, read again,
   summary; never a score; silent inside care; `planNextSight` is never an input).
   Lives in `engine/reading.js` after `sniff.js`. Runs on COMMIT and idle, never per keystroke
   (typing is already 79 ms median at 1000 words under 4x throttle; the safety screen runs on
   the last sentence only).
2. THE TRACE (was: evidence ledger). A DERIVED VIEW over the four stores that exist
   (practice evidence, trace edges, practice log, daily resolve). `chainOf(record,id)`
   returns six closed rows: Said, Heard, Maybe, Felt, Changed, Confirmed (lead verbs: You
   wrote, The instrument heard, The instrument guesses, You reported, You marked, You
   confirmed; an empty row reads "Nothing recorded."). No `p.ledger`. A hypothesis is a
   `proposed` trace edge. Two stored additions only, both closed shape and additive:
   `p.trace.declined` and `addrs` on each `journey.runs` row. "Verified" is renamed
   Confirmed and appears only for a change, after the person taps an ask.
3. WHERE THE LOOP IS (was: 90 day engine). `loopRead(p, now, care)`: pure, derived, never
   stored, no days, no stage, no "of 90", no gate on access; gates may rest only on free acts
   (an entry, a rerun, a ritual, a reading), never on spent supply; reported changes pay
   nothing. It orders ONE suggestion: the Next slot. The two day tables are not adopted.
4. THE SAFETY SCREEN. Engine returns `{level: none|care|now, kind: self|danger|medical|
   substance|past_harm}`; the person meets three outcomes (nothing, strong, needs a person
   now); state names are never printed. Crisis cues ignore negation or step it down one level
   (never void it), lean to recall, and must survive the curly apostrophe. Nothing is stored,
   counted or exported (`OB_NEVER`). Card quotes the person's raw clause (12 words max, no
   quote if the cue names a method). Care withholds engine labels and release for that entry.
   Interim: build now with a recall leaning editable cue list for the private build;
   clinician and counsel review gate the first PUBLIC launch. Copy says it reads English and
   misses things and that nobody is watching as you write. Start from the existing reader on
   branch `worktree-agent-a6d4e60928876b711` (commit `c1cbc1a`).
5. PRIVACY AS ARCHITECTURE. A `PRIVACY` table (every stored key: where, who, how long, why,
   what leaves, how deleted) with a build gate that fails on any unlisted key; three labels
   Stays, Leaves, Delete in two states (device only, signed in), generated from the table.
   Remove the "Improve the Models" toggle. Deletion reaches every key (`STORE_KEPT`,
   `source.profiles.unreadable.*`, `source.outbox`, side stores). Entry level delete before
   any card prints Delete. Encrypted export file with a restore drill; do NOT encrypt local
   storage (theatre); no end to end vault in MVP. `crypto` and `indexedDB` join the
   `hostfree.py` ban list. Device only line must carry the browser speech exception.
6. IDENTITY, ENTITLEMENT, METER. No server owned meter (all content ships in one file; a server
   that saw address keys would learn what a person opens). Server owns tier, status, period,
   lead grants, real scarcity. Five verbs read off the SIGHT table through `planCan(pl,verb,arg)`:
   see base ground (every tier, never revoked); rerun ground (free); open new ground (the only
   metered verb); see a layer (one key per SIGHT row, follows the current tier); lead others
   (tier four only, CLOSED to purchase until the lead suite exists, via a `built` flag).
   Downgrade latches OPENED ground (`meter.unique`, reruns, journal, history, points), not layer
   sight; lock copy says what is kept. The gift: the owner ruled the whole reading is visible
   while the gift lasts; that stands (block J8); three seats worry it is a take-away at gift
   end, so the gift-end copy must say plainly what happens. Server work in reboot-os in order:
   deploy (commit, merge, price ids, `BASE_PLAN=0`, return address, a timed real signup), refuse
   a forged `granted`, lease the cached plan, keep `base` on a tier change, refuse a second live
   subscription, cap free banking at 120 patterns printed once, hear refund and dispute events.

## The record (additive, no schema bump; SCHEMA_V is already 2)
`validateProfile` carries unknown top level keys through (`p.carry`, 256 KB cap, depth 6,
`RECORD_NEVER` refused by name); import mints a new id and says so; the two side stores move
into `p.side` so export round trips; one storage budget (warn 3.5M chars, refuse new lists at
4.0M, never the story); `bindStore(get,set,del)` and `forget(id)`.

## What the person sees (each replaces something)
Care register (quiet: same layout, motion stops, Next and locks and ladder gone for that entry,
no red, no modal; the card: quote, one number line, three buttons Call, Text, Continue,
under 25 words). Claim row (the person's quote, "Maybe" label above the claim, Fits, Not me,
Why; Not me goes to a visible Set aside list and must change what shows next). Next slot (14
words max, one primary button plus Not now for 7 days) replaces the four doors and three cards,
and the right rail becomes Next, one live Maybe, then the seven accordions folded. Why chain
inline, six rows, never hover only. The loop ring dims after 14 days of nothing.

## Settled by lead, revisable
Names: reading rules, the trace, loopRead, Confirmed. Continue and Pause (not Keep writing).
Interim safety acceptable for a private build only. Gift stays as the owner ruled. The
"lead others" verb is closed to purchase until built.
