# Pass 2, creative director (Ines Halldors). Round PK

ICP sample: Ana and Nkem (distress), Gordon (refuses a frame), Derek (checks the number), Sofia (practitioner), plus James, Angela and Diane as the other seats cite them. Records read: all eight pass 1 files, `RESEARCH-90day.md` as quoted, SIG17 as quoted.

## 1. Agreements

- **Ledger is a view, not a store.** AI, systems, game, technical (on the shape), me. Four stores already hold it. A fifth is two truths.
- **The one rule exists three times.** AI, systems, technical, me: `TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne`. Merge, do not write a fourth.
- **Nothing screens text for distress.** AI measured it: "I feel suicidal" reads as an empty entry. Narrative, UIUX, systems, technical, me.
- **No days, no stage name, no "of 90".** Game, UIUX, narrative, me. A count against a total is a score.
- **Never store a safety result.** AI, systems, narrative, me.
- **Do not build a meter service.** Sales, systems (privacy), me. Technical differs, see ruling 7.
- **A confidence number must not reach a screen.** AI, systems, me. A rung is a count a person can check.
- **Every new item replaces an old one.** UIUX said it, I confirm: additive panels raise load about 10.

## 2. Disagreements

- **"Held" for verified.** My pass 1 word collides. Narrative: `held` is already the measured word for an address at 4 or over. One word per concept. I concede. UIUX's **Confirmed** wins: only the person confirms, and `confirm` is already the action that sets `user_confirmed`.
- **A ranked hypothesis list.** AI and systems keep competing proposed edges internally. I accept that inside the engine. The person sees one, never a list.
- **Technical's `p.ledger` store and server meter.** Rejected, with the view and sales' reasons below.
- **Game's `meter.runs` against systems' `journey.runs`.** One log, `journey.runs`, gains `addrs`. Not two.
- **UIUX "Back at pattern recognition".** Cut. A ring has no back. A person goes round.
- **Sales, no snapshot of old layers.** Agreed, with the lock copy doing the work.

## 3. What I missed

- Four shipped lines state a cause about the body (`summary.js:254, 293, 318`, `drills.js:1348`). My truth pass should have caught them. The mirror test fails today with no help from the proposal.
- The modules already disagree on one sentence (AI's table). Consistency is a shared reader before it is any coordinator.
- The "Improve the Models" toggle and "Not your stories" are false now.
- An older build deletes a newer record's top level key (systems, measured). That ends any ledger plan until fixed.
- The gift shows saboteurs, then greys them (sales). The greying is the takeaway moment.

## 4. The architecture, together

**Renames and keeps, in the product's words.**

| Proposal | Product word | Code home |
|---|---|---|
| Orchestrator | the reading rules | `engine/reading.js`: `readEntry`, `obsValid`, `agentCeil`, `nextRead` |
| Evidence ledger | the trace | `traceChain(record, claim)`, a read over `trace`, `practice`, `daily`, `journey` |
| JourneyState | where the loop is | `loopRead(p, now, care)`. Not `journeyRead`: that name is taken by the onboarding record |
| Next best action | Next | one slot, one label |
| Hypothesis | Maybe | a `proposed` trace edge |
| Verified | Confirmed | the person's own act |
| Six chain steps | Said, Heard, Maybe, Felt, Changed, Confirmed | six fixed rows, "Not yet" when empty |

Lead verbs for those rows are narrative's: You wrote. The instrument read. The instrument infers. You reported. You marked. You confirmed. A sentence that cannot start with one does not ship.

**Keep:** the one rule; the chain; the safety screen; downgrade never removes opened ground; privacy as a ten second statement. **Cut:** day bands; the day 85 review; `current_stage`, `current_objective`, `current_friction`, `last_meaningful_change` as person fields; "advanced practice" as a verb; the word verified in the product.

**Where the avatar sits.** It is the only thing drawn from `loopRead`, and only from dated facts: addresses opened, runs, rituals done. Never from a stage. DESIGN-avatar section 5 forbids an avatar that reflects the reading. The loop is a ring with the least recently touched quarter lit, labelled with the four ruled words.

**Rulings on the eleven.**

1. **Ledger.** A derived view. Stored additions are two: the `declined` list under `p.trace` and `addrs` on each `journey.runs` row. New appends carry a random id so lists can be unioned across devices later. Why: derive, don't store; a store beside four stores is two truths.
2. **Hypothesis.** A `proposed` edge plus `declined`. Propose only when trigger and behaviour share a clause, and quote the clause. The person gets one live Maybe with Fits, Not me, Why. Not me must change what shows next or it is a fake right. No ranked list on screen, no strength word, only counts of distinct days.
3. **Next.** One slot, called Next, an act in the person's own words, `proposed` rank, one quiet "Not now". Never a prescription, never a feature name. A rule table keyed on the open side of the loop (game's order). It replaces four doors and three cards.
4. **90 day engine.** A derived read that orders one suggestion. No gate on access: a gate punishes the stuck and bores the experienced, and only a free act could ever carry one. Behaviour opens nothing, tier is the only key to ground. Days stay inside the engine and in dated facts. Neither day table is adopted.
5. **Safety.** Engine returns four levels: none, care, crisis, route (a kind of outside help, no label). The person meets three outcomes. Ordinary: nothing printed. Strong: one line quoting their words and a pace, the release stays open. Needs a person now: the quote, one number, "Keep writing" beside it. State names are never printed. Crisis cues ignore negation, lean to recall, and a false alarm is dismissible, entry scoped and unsaved. Cards are narrative's block A, with UIUX's quiet register (streak, locks, ladder gone for that entry). No detection exists yet for possible trauma, medical, substance or abuse; build medical, substance and abuse as route cards from fixed cue lists, and ship possible trauma later when the sniffer seat names its evidence. Interim: build now, merge `distress.js` (`c1cbc1a`, which hit 5 of 18 on phrases it had not seen), and make clinician review a gate before any public launch, not before merge. Acceptable for owner and private builds only, with one Help line: "It reads English and it misses things. Nobody is watching as you write."
6. **Entitlements.** Five verbs on SIGHT: see base (every tier, never revoked), rerun (every tier, free), open new ground (the only metered verb), see a layer (one key per SIGHT row), lead others (tier four). Ground opened is latched: reruns, journal, history, points, addresses. Layer sight is not latched, because the owner made it the tier's property and a latch would let one month buy layers for good. A lapse says what is kept in one line at the lock. The gift shows through the character layer, and at its end the lock says "your reading is kept, tier one shows it". Taken as a default, he can overrule.
7. **Server work.** Build: deploy first (owner steps), clamp `granted`, a lease on the cached plan, keep `base` on tier change, refuse a second live subscription, cap free banking at 12 weeks, hear refund and dispute events. Defer: lead grant table (before any practitioner surface), signed lease, founding seats, sync kinds. No meter service: the content ships in the file, and a server told which addresses a person opens learns something intimate.
8. **Record.** Carry unknown top level keys through `validateProfile`. New id on import. Move the two side stores into the record. Add `addrs` and `declined`. No schema bump: `SCHEMA_V` is already 2 and each store carries its own version. Flag for the owner: new keys appear, additive. Fix the stale "flagged for his ruling" comments.
9. **Names.** All in the table. Whatever is drawn says what a person did, never what they became.
10. **Privacy.** Three labels, Stays, Leaves, Delete, two states (device only, signed in). Fixed words: Record, Account, Copy, Delete, Password, Email. Remove the "Improve the Models" toggle at launch: nothing reads it and it contradicts "we do not train". Delete must reach kept bytes, unreadable copies and the outbox. Entry level delete before any abuse card prints the word Delete. Encrypted export file: build, with a length check so a cut file says so. No client side encryption of local storage: theatre. "People who can see this record" is derived from grants, never a constant.
11. **Order and MVP.** Below.

**One build order of slices.**

| # | Slice | Size | MVP |
|---|---|---|---|
| 1 | Safety screen, Help sheet, fix `numb` and `addicted` misreads | M | yes |
| 2 | Truth sweep: four causal lines, toggle, "Not your stories", "Tool of" to Tula, sensation rule gate | S | yes |
| 3 | Record door: unknown keys, import id, quota by name | S | yes |
| 4 | Keystroke floor, p95 16ms at 1000 words | S | yes |
| 5 | Reading rules: `readEntry`, one negation, `lex` stamp, `obsValid`; agreement and invariance gates | M | yes |
| 6 | The trace: first writers, `declined`, `addrs`, `traceChain` | M | yes |
| 7 | Claim row (Fits, Not me, Why) on Story imprints | M | yes |
| 8 | Next and `loopRead`, replacing doors and cards | M | yes |
| 9 | Privacy page, data table gate, deletion reach, encrypted export | M | yes |
| 10 | Money slice, ruling 7 build list | S each | yes |
| 11 | The ring and the avatar from dated facts | M | after 8 |
| 12 | Confirmed ask on ritual done | S | later |
| 13 | Lead grants, signed lease, sync, per pattern machine, trauma detection, locales | L | later |

Slices 1 to 4 have no dependency on each other and run in parallel. Agree with the art seat before 11, with voice before 7 and 12 (Maybe, Fits, Not me, Confirmed).

## 5. Revised grade

GRADE: 66/100 (was 48). As merged here. Soul fit and rulings fit rise because the orchestrator, ranked list, days and verified are gone. It stops at 66 because truth debt is larger than I saw (four causal lines, a false toggle, no safety), and the avatar still arrives only at slice 11.

## 6. Top 5

1. Safety screen and Help sheet, slice 1 (M). Ana, Nkem. Sofia and Derek if the false alarm stays cheap.
2. Truth sweep, slice 2 (S). Derek, Gordon, Sofia.
3. The trace and the claim row, slices 6 and 7 (M each). Derek wants the chain, Gordon wants to say no.
4. Next replacing doors and cards, slice 8 (M). Phone only arrival, Gordon, Diane.
5. Lock copy at gift end and the opened ground guarantee, ruling 6 (S). Derek, Nkem.

## 7. Question for the owner

None. Decisions are above. Layer sight is not latched, the gift shows through the character layer, and clinician review gates public launch. Each is recorded as taken. He can overrule.
