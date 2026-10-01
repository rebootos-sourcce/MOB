# Onboarding and first experience: systems and data review

Reviewer 2 of 3. Scope: schema, state, persistence, migration, validation boundary, privacy structure, events, round trip. Not in scope: copy, look, motion, funnel psychology. Those are for reviewers 1 and 3.

The document under review: `ATUNED-onboarding-first-experience-TDD.md`, 1713 lines, read in full twice. The first pass was for what it asks for. The second was against the code, line by line on sections 10, 13, 21 to 23, 40, 45 to 47.

## The stamp on this review

    commit        b4b9e5c, the tip of claude/laughing-feynman-xhfyj3 when read
    read          the onboarding TDD whole, twice; ATUNED-funnel-to-software-journey-TDD-v1.md,
                  ATUNED-practice-ritual-accountability-trace-graph-TDD.md (headings, sections
                  8 to 12, 25, 30), ATUNED-becoming-system-TDD.md (6, 19, 32 to 34),
                  ATUNED-points-achievements-unlocks-TDD-v2.md (5 to 7, 19, 20, 36, 37),
                  POINTS-AUDIT.md whole, PRACTICE-AUDIT.md head, ATUNED-MVP-architecture-v2.md
                  whole, SOURCE-TDD-impression-excavation.md (purpose, rules, impression
                  object, output contract), reviews/SPEC-source-ai.md (the unsettled-rulings
                  section), DECISIONS.md (data, privacy, round OK), HOSTING-SETUP.md (head).
                  Code: engine/schema.js (blank, load, save, store, boundary, meter, import),
                  engine/plan.js whole, engine/ladder.js whole, engine/sourceai.js,
                  engine/sniff.js (scan, parse, sniffStory, offer), engine/avatar.js,
                  engine/intake.js, engine/outbox.js, engine/undo.js, engine/practice.js (head,
                  log spec), engine/trace.js (head), ui/onboard.js whole, ui/tutorial.js whole,
                  ui/login.js (boot sequence), ui/auth.js (the one seam), ui/release.js (RUN,
                  plan, relCoolDown, relClose), ui/storyui.js (commit, mic), ui/ritual.js and
                  ui/cone.js (where marks are drawn), ui/sound.js (marks heard),
                  ui/avatarui.js (the side store), funnel/quiz.html (state, save, door),
                  tests/funnel.js (head).
    measured      probes against engine.js built into a scratch path (the tracked engine.js
                  was not touched): the boundary round trip of the two onboarding flags, the
                  blank profile's keys, the plan and tab tables, and the offline sniffer on
                  the TDD's own example sentence. Probe text is in Appendix A.
    not run       no browser gate, no node tests/*.js. Nothing here makes a claim about
                  pixels or about a gate's current pass count. Claims about what a screen
                  does are from reading the code, and are marked "by reading" where they
                  could not be run.
    not read      the server (atuned-api, repository reboot-os) is not in this checkout.
                  Everything said about the server is from ui/auth.js, DECISIONS.md and
                  HOSTING-SETUP.md. Where the server would have to do something, this file
                  says what it would have to do and does not say whether it already does.

Counts of things in the TDD are read off it, not typed from memory. Recount them with the commands in Appendix B.

---

## 0. Read this first

Ten findings that change what gets built. The rest of the file is evidence.

1. **The two flags the first run depends on are written and then deleted at the next load. Measured.** `ui/onboard.js` writes `CURP.onboarded` and `ui/tutorial.js` writes `CURP.tutorialSeen`. Neither name appears in `blankProfile` or `validateProfile`. The profile is saved with them (they are on disk), and the next load rebuilds the profile from the blank through the boundary and drops them. The boot reads `CURP.onboarded` at `ui/login.js` 273 to decide whether to show onboarding. The deletion is measured. The consequence is by reading the boot, not by running a browser: onboarding replays on every launch of a returning person, with no error and nothing said. This is the same class as POINTS-AUDIT probe X11 and it is the first thing to fix (slice O0).
2. **The two writes the whole first release stands on ignore whether they landed.** `stCommit` (`ui/storyui.js` 412) and `relCoolDown` (`ui/release.js`, the line `if(CURP){pSave();pSnap();}`) call `pSave()` and discard its answer. Both then print success. A browser that blocks storage produces a first release that says it worked and is gone at the next load. The rule in CLAUDE.md is that a write that can fail reports through `status()`. These are the two writes where it matters most.
3. **A release that is closed or killed halfway leaves no trace, by design of the code.** The whole run lives in the in-memory `RUN` object and commits once, at `relCoolDown`. `relClose` commits nothing and records nothing. So `RELEASE_ABANDONED` has no source, and the TDD's "second and third release" (section 41) has no source either: nothing stores a count of runs. `meter.lines` counts lines, not runs.
4. **The TDD's own headline example reads as nothing in the offline sniffer. Measured.** "I keep taking care of everybody else." alone returns `unread: true`, zero hits, zero imprints. The longer story in Appendix A reads solar, heart and root and then names Pride, Arrogance and Competition at the solar plexus for the word "overwhelmed", flagged `inferred: true`. A Mirror that prints address names without checking that flag will tell an overwhelmed person they carry pride.
5. **"Cause / Experience" and a free-text "Story Tag" cannot come from the deterministic sniffer, and one ruling forbids half of it.** `engine/sourceai.js`: "It never says why about the person." The honest offline version is the person's own clause quoted back, or nothing. A written paraphrase ("Fear that things will fall apart if I don't handle them") needs a model, and a model lookup is a second network seam that only the owner can allow.
6. **"Transfers directly into the account" collides with a standing privacy ruling.** DECISIONS.md: "We do not keep the record joined to the story." The quiz door says "Your story is not in it." The TDD's `FunnelActivation.user_input` is the story. Because the funnel and the app are served from one origin (atuned.world, HOSTING-SETUP.md), a device-local handoff needs no network at all. That option is in question 1.
7. **There is an achievements mechanism. The expected answer is wrong in one place and this file corrects it.** `engine/ladder.js` holds sixteen derived marks in three families, a streak, a ledger, and `meter.firsts` (stored, dated firsts). Two surfaces draw them (the Compass and the Ritual page) and the sound layer plays a chime when one is earned. What does not exist is points, stored grants, unlocks, an event ledger and any gate that hides marks. Section (e) has the exact list.
8. **The sound layer would reveal the achievement layer in the first session.** `ui/sound.js` upgrades the story-kept sound to the mark sound when the press earned a new mark, and the "First story" mark is earned by the first committed entry. Sound is on by default (ruled, round OJ). By reading: a first story commit chimes a mark. TDD section 23 says `achievement_layer: hidden`.
9. **The TDD's state list and its screen list are different lists, and "every state must be recoverable" is stated only for the first.** Section 7 has no state for the feeling page, the story, the mirror, the accuracy check, the adjustment, the somatic setup, the post-release page, the integrity questions, the archetype questions or the handoff. Those are where a person loses typed words. Section (c) takes them one at a time.
10. **No product event log exists, and the outbox refuses one.** `engine/outbox.js` carries four kinds (question, bug, rating, feedback) and refuses `history`, `meter`, `story` and others by name. Nothing writes the thirty-one events of section 46. Most can be derived or logged locally. None may leave the device without a ruling (section d).

Version posture, stated once: nothing proposed here needs a `SCHEMA_V` bump. Every new field is additive under v2, absent reads as the blank, and v1 and v2 records still load. If the owner wants a bump anyway, that is his call and nothing here depends on it.

---

## 1. Words the TDD must settle before any build

One word per concept. A concept with two names is a bug that has not happened yet.

| Word | Where it has more than one meaning | What this review does |
|---|---|---|
| pattern | In `engine/schema.js` and `engine/plan.js` one pattern is one thought line, a key `address:channel:line` in `meter.unique`; the gift of 100 is 100 of those. In `engine/practice.js` a pattern id is an address, `addr:N`, or a fetter, `fetter:X`. In the TDD "100 patterns relevant to the starting ground" and "approximately 10 relevant patterns" do not say which. | Uses "thought line" for the first, "address" for the second, and asks in question 3. |
| fetter | One of nine charge axes (`CHILD`) in the schema, or any of the 112 addresses in the Points TDD (POINTS-AUDIT P04, question 4). | Avoids the word. Says "axis" for nine, "address" for 112. |
| integrity assessment | The TDD: ten questions on a 0 to 10 scale across the laws. The Becoming TDD section 19: `IntegrityAssessment` comparing intended and observed behaviour, with an alignment enum. The app: a 63-answer intake (21 laws, three framings each). | Calls the TDD's the "ten-question integrity check", the Becoming one "integrity alignment", the app's "the intake". |
| Mage | TDD section 28 says Mage. The engine's twelve archetypes are Warrior, Sage, Rebel, Caregiver, Creator, Magician, Ruler, Explorer, Lover, Jester, Everyman, Innocent. | One of the two is a drift. The engine name stands until the owner says otherwise. |
| the journey list | Section 7 of the TDD has 18 states. Section 12 of the funnel TDD has the same list with a `PAYWALL` state between `NEW_GROUND_LIMIT` and `TIER_SELECTED`, which makes 19. Section 38 of the onboarding TDD describes a paywall trigger and the section 7 list has no state for it. | Uses the longer list. |
| event names | Onboarding TDD: lower snake case (`story_submitted`). Funnel TDD: upper snake case (`TUTORIAL_STARTED`). Practice and Becoming: upper snake case enumerations (`PRACTICE_COMPLETED`). | Proposes one vocabulary for the local log (section d) and says which. |
| achievement, mark, badge | The TDD says achievements. The product's word for the thing the ladder draws is "mark". `crBadge` is a ring that carries a charge percentage and is not an achievement. `DESIGN-progression.md` bans "points, XP, score, level, badge, achievement, trophy, streak, coin" from surfaces (POINTS-AUDIT C11). | Uses "mark" for the thing that exists and "achievement" only when quoting. Asks in question 5. |
| impression, signal | The Impression Excavation Engine spec has an `Impression` object. The TDD has a `Story Signal`. The trace graph has an `impression` node type. None is built as an object. | Treats the Story Signal as a thin projection of an Impression, so the product does not end up with three models of one thing (section a4). |

---

## (a) Every object in the TDD, mapped to the schema

### a1. The current shape, as a table

It is not written down in one place. Read off `blankProfile`, the other stores and the code that holds state in memory.

**The profile** (one JSON object per person, an array of them under the key `source.profiles`, every record read through `validateProfile` at boot by `pStore`). `SCHEMA_V` is 2. Top-level keys of the blank, read off the build:

| Key | What it holds | Stored or derived |
|---|---|---|
| `v`, `id`, `name`, `created`, `updated` | identity of the record. `name` never leaves the device. | stored |
| `soul` | `doms`, `arcs` (the person's own two archetype indices), `roots` | stored, the invariant |
| `axes` | nine charge axes, `{held, opp}` each | stored. Saved from the working state `S` at `saveProfile`. |
| `who` | name parts, sex, `sealed` stamp, birth moment | stored. Nothing derived from it is stored. |
| `ui` | per-profile switches (`quiet`, `model`, `tone`, `voice`, `buzz`, `practitioner`, `sfx`, `sfxoff`) | stored |
| `seed` | stated four-letter type and what it wrote | stored, null until stated |
| `meter` | `lines`, `unique` (the keys opened), `firsts` (dated, once-only), `first`, `last`, `giftAt`, `relLines`, `truthLines`, `heavy` | stored. This is the allowance's truth. Spend is never stored. |
| `plan` | `tier`, `status`, `granted`, `carried`, `base`, `since`, `until` | stored, written only from the processor's state, refuses `customer`, `subscription`, `email`, `key`, `secret`, `token` by name |
| `avatar`, `purpose` | pairs of be and not-be sentences; six values and thirty commitments | stored |
| `laws` | 21 values 0 to 10, or null for not yet measured | stored |
| `intake` | `answers` (63, keys 0 to 62), `done`, `startedAt`, `completedAt` | stored |
| `work` | releases counted per law since it was answered | stored, bounded by `meter.unique` |
| `gates` | VERP and lean counts | stored |
| `story` | `entries[]`: `t`, `text`, `imprints` (count), `bands`, `lex`, `asked` | stored. A closed key set, `ENT_KEYS`. |
| `rituals` | the Ritual tab's day log | stored |
| `history` | snapshots (`cq`, `dq`, `sq`, `lawNow` and more) written at every story commit and every release | stored. A derived reading, stamped with `CQ_MODEL`. |
| `practice` | the Practice domain objects and their log | stored, built, no UI writer |
| `trace` | the trace graph's stored half | stored, built, no UI writer |
| `summaries` | the bank of frozen days | stored |

**The other stores, none of them inside the profile:**

| Key or place | What it holds | Exported with the profile? |
|---|---|---|
| `source.profiles.unreadable.<time>` | a store nobody could parse, set aside verbatim | no |
| `source.session` | the sign-in token. Refused by name inside a profile. | no, by ruling |
| `source.outbox` | queued questions, bugs, ratings, feedback | no |
| `atuned-ritual-active` | the Ritual tab's plans, a map from profile id to plan list | no. PRACTICE-AUDIT A7. |
| `atuned-avatar-side` | archetype ratings 1 to 5, starting weights, rules, tags, by profile id | no |
| view keys (`lcol`, `rcol`, `fview`, `dens`, `axdial`, `bm*`, `cnov`, `fbar`) | per-viewer layout | no, correct |
| `atuned.quiz.v2` (funnel) | `{a: {questionIndex: 0..4}}`, answers only | no. The quiz hands off by a downloaded file. |

**In memory only, gone on close:** the whole release run (`RUN`), the story draft (`ST_TEXT`), the onboarding answer (`OB.felt`), the tutorial text (`TUT.text`), the quiz story (`STORY`), which marks the sound layer has already played (`SFX_HEARD`).

**The tab table.** `TAB` has fourteen entries, 0 to 13: STORY 0, SUMMARY 1, FIELD 2, ENERGY 3, ANALYTICS 4, INTAKE 5, KNOW 6, GAMES 7, COMPASS 8, SETTINGS 9, RITUAL 10, MASKS 11, PRACTITIONER 12, QUESTIONS 13. Onboarding is a sheet over the app (`#ob`, `#tutorial`), not a tab, and this review keeps it that way: no new integer, no change to `TABDEF`, `TABFOLD`, `TABEXTRA`, `TABREAL` or `TABOF`. If the owner rules a tab, it is appended as 14, never inserted, and all five tables change in one commit.

**Drift between the surface and the schema, found while building the table:**

| Drift | Evidence |
|---|---|
| Two flags written to the profile that the schema does not name | measured, section 0 finding 1 |
| Three stores of the person's own work that Export does not carry (ritual plans, avatar side store, and the in-memory run and drafts) | the round trip invariant (export, import, export is identical) already fails for these |
| `boundaryCross` returns one relationship side, the first that matches | `engine/avatar.js`; an entry naming a partner and a boss reads as "partner" only |
| `OB.felt` (yes, no, nothing) is the one thing the current onboarding asks the person to do, and it is not stored anywhere | `ui/onboard.js`; `obClose` writes only the flag |
| Two onboarding flows would exist: the four-card sheet and five-step tutorial built under earlier rulings, and the flow in this TDD | owner says which stands; the TDD does not mention the existing one |

### a2. StarterGift, field by field

Source of the object: section 10, repeated in section 4.3 of the funnel TDD.

| Field | Today | Verdict | Shape and where | Refused at the boundary |
|---|---|---|---|---|
| `id` | none. One gift per record. | drop | not needed; a record has one gift | n/a |
| `user_id` | the record carries no account id, by ruling | refuse | never stored. `engine/practice.js` already refuses `user_id` by name on every object (`PR_NEVER`). The profile's top level refuses `token`, `session`, `password`, `email` and should add `user_id`, `userId`, `customer_id`. | `user_id is not held by this product` |
| `source` | none | new, tiny | `journey.gift.src`, one of `funnel`, `app` | `journey.gift.src is not funnel or app` |
| `selected_ground` | no ground concept anywhere | new | `journey.ground.k`, a key of a `GROUNDS` table in the engine (12 rows, see a7) | `journey.ground.k is not a ground this build knows: X` |
| `pattern_ids[]` | the gift is a number, `GIFT_N` = 100, read from the `gift` row of `PLANS`. The keys opened are `meter.unique`. | derive, never store | the ordered offer for a ground is computed (`meterPlan` over the ground's addresses). What was opened is already `meter.unique`. A stored list of offered keys would be a second answer to "what is open". | n/a |
| `granted: 100` | `GIFT_N`, the `gift` row of `PLANS` | reuse as is | constant | n/a |
| `remaining` | `planAllowance(...).left` while `inGift` | derive, never store | `engine/plan.js` header: "Spend is never stored: it is always the unique count minus what has been granted, so the two cannot drift." A stored `remaining` is the exact two-truths bug this repository already fixed. | n/a |
| `issued_at` | none. `created` on the record is the nearest. | new | `journey.gift.at` | `journey.gift.at is not a date`; refused when more than a day ahead of the read |
| `transferred_at` | none | new | `journey.claimed.at`, set once when a claim lands (see a3) | same |
| `status` | `meter.giftAt` is null while the gift is unspent and holds the moment it ran out | derive | `issued`, `spent` (giftAt set), plus `claimed` when `journey.claimed` is set. Never stored. | n/a |

Also in the TDD, and already built, so reuse as is: reruns of opened ground cost zero (`meterRerun`, `meterRerunPlan`), the Free tier is 10 a week and unused weeks bank (`planAllowance`, `planWeeks`, counted from `meter.giftAt`), tiers 12, 29, 59 and 99 dollars with tier four at the same 1,200 as tier three (`PLANS`, `PLAN_PRICE`). **New and not buildable on the device:** the referral grant of 25. `plan` is "written by the record store from the processor's own state and never by the app, because a record a person can edit must not be able to grant itself a tier". A referral grant is supply. It has to be minted by the server and signed, the same reasoning as POINTS-AUDIT C2. Its shape is deferred to the accounts slice (O11) and to a ruling on who receives the 25 and what caps it. `funnel/buy.html` already says "referral at twenty five (he changed it from fifty on 1 October), capped at four a month".

### a3. FunnelActivation, field by field

| Field | Today | Verdict | What it becomes |
|---|---|---|---|
| `session_id` | none. The quiz has no session. | drop in the device-local design; new and random if a server holds a record | never written on the profile |
| `selected_ground` | none | new | `journey.ground` (a2) |
| `starter_gift_id` | none | drop | one gift per record |
| `selected_pattern_ids[]` | none | drop | the opened lines are `meter.unique` |
| `user_input` | the funnel quiz holds the story in a page variable and never saves it. Its door says: "Your story is not in it." The app stores a story as `story.entries[].text`. | extend, with a ruling | in the device-local design the funnel's story text is written to its own local key and, at first boot, becomes an ordinary `story.entries[]` item through `vEntry`, the same door every entry uses. It never crosses the network. |
| `source_event_ids[]` | none | new | the funnel's local event log (a key `atuned.funnel.v1`, same shape as `journey.log`) is claimed into `journey.log` at first boot, re-sequenced, with each `at` kept |
| `created_at` | none | new | `journey.ground.at` |

**The claim** is the one new operation. It is pure and lives in the engine: `journeyClaim(profile, funnelPayload, now)`. It validates the payload through the same boundary, writes nothing until all of it validated, stamps `journey.claimed`, and is idempotent (a second claim of the same payload changes nothing). It is atomic in the way `pImport` is: nothing is pushed and nothing moves until it has validated, loaded and saved, and a failure says why through the status line.

**The old path is preserved.** Today the quiz hands off by `Save my record` (a downloaded `atuned-record.json`) and the profile sheet's import (`recordImportHtml`, `recordImportWire`), which goes through `validateProfile`. That stays as the fallback for a person who downloaded the single file and so has no shared origin. The TDD's rule is "no manual export or import" as the default, and a fallback that exists does not break it.

### a4. The Story Signal and the seven Story Sniffer fields

Section 13 names seven fields; section 14 turns them into a Story Signal. Section 18 says a correction updates all seven and returns to the accuracy check. Section 47 says to preserve "Story Signal versions".

**Where it is stored.** On the story entry that produced it: `story.entries[i].sig`, a list of versions. Reasons: a signal belongs to one entry and an entry's text is not edited after commit; the entry already carries sniffer-side metadata with the same privacy posture (`lex`, `asked`: "a kind and a seat for each ... Never the words of a question"); and a reference from a journey list to an entry could dangle. `ENT_KEYS` is a closed set and `vKeys` refuses a key outside it by name, so this is one name added to one list and one validator. Stored per version, not recomputed, for the reason `vEntry` already gives for `imprints`: "recomputing would rewrite what the person was told at the time", because the lexicon moves.

**Provenance is never collapsed.** Each version carries one of the five states the trace graph already uses (`known`, `inferred`, `proposed`, `user_confirmed`, `observed`). A sniffer reading is `inferred`. A version the person edited is `user_confirmed`. A version a server proposed (if ever) is `proposed`.

Version shape (proposed):

    story.entries[i].sig = [ {
      n        1, 2, 3 ... strictly increasing, gapless
      at       ISO date
      src      'inferred' or 'user_confirmed' or 'proposed'
      tag      string, 80 or fewer, or null    lexicon phrase label, or the person's own word
      snip     {from, to} offsets into entries[i].text, or null     (not a copy of the words)
      quality  {word, charge}   word is what the person wrote, charge is a CHILD axis name or null
      intensity number 0 to 10, or null     which scale: see further gap G2
      cause    string, 240 or fewer, or null    the person's own words only
      seats    [seat names]    body location as the seat
      addrs    [address ids]   only addresses the words named, never fallback ones
      rel      [side keys]     from PUR_SIDES
      verdict  null, 'confirmed', 'rejected' or 'adjusted'
    } ]

The seven fields:

| TDD field | What the offline engine does today | What it cannot do | Verdict and shape |
|---|---|---|---|
| Story Tag | `scanStory` returns phrase hits with a `label` from the lexicon (`silenced`, `over-giving`, `avoidance`, `compulsion`, `concealment`, `rigidity`). `sniffSaboteurs` names saboteurs. | Invent a tag in the person's language such as "Over-responsibility". | extend. `tag` is a lexicon label when one fires, otherwise null. A free-text tag needs the person or a model. |
| Story Snippet | `marksOf(text, parsed)` places every hit back on the letters typed. | nothing | extend. `snip` is offsets into the entry text plus the entry's `lex` stamp. Not a second copy of the person's words. Must satisfy `from < to <= text.length` or it is refused by name. |
| Quality or adjective | `scanStory` returns `kind:'word'` hits for feeling words and `kind:'adj'` hits that carry a charge axis. | nothing | reuse the hits; store `quality.word` (the person's word) and `quality.charge` (a `CHILD` name, refused by name if not one). |
| Intensity | two scales exist and they measure different things. The seat reading is `min(10, sum/3)`, how hot the words are (8.7 for "overwhelmed"). The rung in `sourceai.js` is evidence of return, 1 to 10, root candidate at 10. | choose between them | extend, blocked on further gap G2. The TDD's "Intensity: 8" does not say which. |
| Cause or experience | `srcDims` reports whether the entry answers `trigger`, `prediction`, `belief`, `meaning` by cue words (`if`, `because`, `when`). That is a clause the person already wrote. | write the paraphrase "Fear that things will fall apart if I don't handle them". `sourceai.js`: "It never says why about the person." | extend, honestly. `cause` is the person's own clause that carries a cue, quoted, or null. A paraphrase is server only, and only by ruling. |
| Body location | seats from `parsed.bands`, addresses from `parsed.imprints`, each imprint flagged `inferred` or `stated`. | nothing, with one rule | reuse. The seat is known whenever a body word was read. An address is a finding only when `stated:true` or the text named the axis. An imprint with `inferred:true` is a fallback pick from the seat's modal axis and must not be printed as a finding (the comment in `parseStory` records the three measured mis-readings that made the flag). |
| Relationships | `srcDims` reports `contact` (he, she, they, someone) as answered or not. `boundaryCross` maps the text to one of six sides (partner, family, friends, community, coworkers, alone) with a regex. | read a name. The name never leaves, and the lexicon holds none. | extend. `rel` is the list of sides found (change `boundaryCross` to return all, additive), never a name. |

Measured against the TDD's own sentence, so the design does not assume a reading that is not there (Appendix A has the probe):

- "I keep taking care of everybody else." alone: `unread: true`, no hits, no imprints, no body location, no quality, no intensity. Dimensions answered: contact, behaviour. So the Mirror must have a state for "read nothing from these words", say so, and ask for more. The excavation spec allows it, rule 8: "Unknown is a valid result." The automatic ten-pattern selection of section 21 has nothing to select from in that state. See slice O3 and question 3.
- The longer story: three seats read (solar, heart, root), Fear and Apathy named by the words, and twelve imprints produced. The first three, at Solar, are inferred picks (Pride, Arrogance, Competition, all under Anger) for the word "overwhelmed". The other nine were not inspected.

**Relation to the Impression spec.** `SOURCE-TDD-impression-excavation.md` defines an `Impression` with `original_language`, `affect`, `somatic.location`, `cognition.prediction`, `contact.person`, `uncertainty`. Every Story Signal field is a projection of one of those. That spec also carries `user_id`, which the privacy ruling refuses on a record. The Story Signal should be written as a view over the Impression's fields so that building the excavation engine later extends the signal and does not fork it.

### a5. The release states

Section 40 lists six: `RELEASE_SUCCESS`, `RELEASE_PARTIAL`, `RELEASE_REJECTED`, `RELEASE_ABANDONED`, `RELEASE_CONFUSED`, `RELEASE_NO_EFFECT`. They are not six values of one thing. They mix three questions: how the run ended, what the person said happened, and whether the person accepted what was proposed.

| TDD state | Closest thing in the code | What kind of fact it is | Verdict |
|---|---|---|---|
| `RELEASE_SUCCESS` | the run reached `relCoolDown` without `RUN.halted` | how the run ended: completed | the word "success" is the problem. The funnel TDD section 6 says "A visually completed release is not automatically verified change." Completed is a fact about the run. |
| `RELEASE_PARTIAL` | End or Stop pressed: `RUN.halted` true, `relCounts()` has what was said. This path commits. | how the run ended: ended early | reuse the flag; it is not stored today beyond the run |
| `RELEASE_ABANDONED` | card closed or page killed mid run: `relClose`, no commit, no record | how the run ended: closed | new record. Closest practice state is `interrupted` (`PR_EV_ST`) |
| `RELEASE_REJECTED` | none. Nearest is a trace edge `contradicts`, or `PROTOCOL_REJECTED`. | a decision about what was proposed, before any run | belongs to the signal's `verdict`, not to a run |
| `RELEASE_CONFUSED` | none. `PR_MISS` has `unclear_purpose`, for missed rituals. | what the person said happened | new response value; MVP v2 section 19 says confusion, skepticism and avoidance are different states and must not get one response |
| `RELEASE_NO_EFFECT` | `PR_OUT_ST` has `unchanged`, in the Outcome object. No writer. | what the person said happened | new response value |

**Proposal.** Store two facts per run and derive the six names.

    journey.runs = [ {
      t        ISO date, the moment the run ended or was closed
      lines    whole number, lines said
      fresh    whole number, new ground opened, never more than lines
      rerun    true or false
      end      'completed' or 'ended' or 'closed'
      resp     null, or one value from the response list (further gap G7)
    } ]

`releaseState(run, signalVerdict)` is a pure total function from those facts to one of the six names, so every combination maps to exactly one and none reads as failure copy. The labels are derived and never stored, which is the rule about storing a derived value. This also gives the second and third release a source: the count and the days of `runs`.

Presentation state, processing state and evidence state (funnel TDD section 6) map to: the Field's animation tokens (not stored), the run's `end` (stored), and `resp` plus later outcome (stored). The visual states `HELD, CONTRACTED, RELEASING, OPENING, SETTLING, OBSERVING` (section 22) are a presentation of `RUN.phase` and progress and need no storage. `RUN.phase` today is `welcome`, `opening`, `run`, `done`, `pick`, `idle`; the six visual states are not in the code.

**Later cutover.** The Practice build already has `PracticeEvent` with `partial`, `completed`, `interrupted`, an `Evidence` object and an `Outcome` with `improved`, `unchanged`, `worsened`, `unclear`, and no UI writes any of it. A first run has no Goal and no Protocol, which the Practice objects require, so it cannot use them yet. Rule: `journey.runs` is the only writer until a deliberate one-way cutover (`practiceFromRuns`, modelled on `practiceFromLegacy`, which is also deliberately not run on load). Two writers for one fact is two truths.

### a6. The Screen schema (section 45), field by field

Fifteen fields. Today every screen is imperative code (`obRender`, `tutRender`, `viewOpen`/`viewQ`/`viewStory`/`viewDoor`/`viewRead` in the quiz), and none declares what it persists.

| Field | Proposed home | Note |
|---|---|---|
| `id` | key of a data table `ONB_SCREENS` in `engine/data/` | no integer; screens are not tabs |
| `purpose`, `title`, `supporting_copy` | strings in the table | data, so the voice gate (`check.py`) can read every string without running a browser |
| `inputs`, `actions`, `default_action` | declarative: input kind (`text`, `voice`, `choice`, `scale`), action ids | `voice` is a host capability, see (b) |
| `validation` | refusal by name, using `vRange`, `vStr` | one door, and it refuses by name, never clamps |
| `system_response` | the return value of `onbStep` | pure |
| `visual_response` | one token from the twelve-word grammar of section 5 (`SIGNAL`, `NOTICE`, `CONNECT`, `CONTRADICTION`, `TEST`, `CONFIRM`, `UNKNOWN`, `PATTERN`, `RELEASE`, `CHANGE`, `VERIFY`, `MIRROR`) | the engine emits a token; only the UI draws. No `document` in `engine/`. |
| `persistence` | the exact list of keys the screen writes | a gate walks every screen and asserts the writes are exactly the declared list |
| `next_state`, `alternate_paths`, `recovery` | the transition table | |
| `analytics_events` | names from the event enumeration, validated against it | a typo is a build failure |

New: `ONB_SCREENS` plus a pure reducer `onbStep(profile, screenId, action, input, now)` returning `{ok, writes, next, token, why}`. The UI renders and wires; the engine decides. This is what makes section 44 ("The implementation AI must not infer missing behavior") testable: a gate can enumerate screens and assert that each declares all fifteen.

### a7. Other objects the TDD introduces

| Object | Today | Verdict and shape |
|---|---|---|
| Starting ground (twelve: Anxiety, Overwhelm, Anger, Burnout, Fatigue, Grief, Fear, Relationships, Self-worth, Money, Purpose, Something else) | none | new `GROUNDS` table, host free. Each row needs the axes and seats it opens first. That mapping is the owner's content: "Money", "Purpose", "Relationships" and "Self-worth" are not charge axes. By my reading, and the owner's to confirm, the rows that map cleanly to an axis are Fear, Anger and Grief (Sad). `Something else` must be a real row, so the person is never refused a start. |
| Accuracy verdict (That's it, Not quite, Adjust) | the nearest is `asked[].a` with `moved`, `wrote`, `left`, which records what a Source AI question did | extend: `sig[].verdict` as above. "Treat rejection as meaningful information" (section 17) means a rejected version is kept, never overwritten. |
| Post-release observation | only `meter.heavy` (a line the body answered on) | `journey.runs[].resp`, plus optional person-written note kept with the run, text bounded, on the device only |
| Ten-question integrity check | the intake: 63 answers, three framings per law, `iqApply` writes `p.laws` only when all three are present | see below |
| Archetype answers | `p.soul.arcs` (the person's own two), the side store `arch` ratings 1 to 5 | see below |
| Initial Avatar state (section 32) | `avatar.pairs`, `purpose`. The wider Avatar in the Becoming TDD (section 6.2, qualities, values, status) has no writer (BECOMING-AUDIT R11). | do not write `avatar.built`; it means "the person built it". The handoff screen derives "you said, ATUNED noticed, you tested, you worked with it, you observed" from the records and writes nothing. |
| Free bank, tiers, paywall, entitlement | `planAllowance`, `PLANS`, `ui/plans.js`, `authPlan*` | reuse as is. The only gap is the missing `PAYWALL` state in section 7 and the missing events for it (section d). |

**Integrity check.** Each of the TDD's ten questions gives one value 0 to 10 on a scale whose end points match the intake's own (`0 never`, `5 about half the time`, `10 every time`; the TDD's "0 = I almost never operate this way ... 10 = I operate this way consistently"). A single answer cannot satisfy `iqApply`, which needs three per law. Proposal: write the value straight to `p.laws[law]` (one store for "a law's current answer", the boundary already checks 0 to 10) and keep `journey.assess.integrity = {at0, at1, laws:[names]}` as provenance only. Consequences to state: CQ reads as still filling until all 21 laws are answered (`complete` false, `tier` null), which is the honest state; the later 63-answer intake overwrites cleanly. The TDD does not say which ten of the twenty-one laws, or which wording (further gap G1).

**Archetype check.** The TDD says the person's Avatar configuration is authoritative and "the system is tracking expression", so the answers must not overwrite `soul.arcs`. Store the answers only (`journey.assess.archetype = {at0, at1, items:[{q, v}]}` with `v` a position 0 to 10 or `'both'`) and derive tendency and the icon's saturation by a pure function. Never store a derived saturation. The TDD does not say which pole maps to which of the twelve archetypes (further gap G10).

### a8. The one new stored shape, and what the boundary refuses

    journey = {
      v        1          its own version, like practice and trace. No SCHEMA_V bump.
      ground   null or {k, at}
      gift     null or {at, src}
      claimed  null or {at, via}        via is 'local' or 'record' or 'file'
      runs     []         section a5
      assess   {integrity: null or {at0, at1, laws}, archetype: null or {at0, at1, items}}
      log      []         section d
    }
    plus story.entries[i].sig               section a4

It is named in `blankProfile` and named at the boundary. The comment already in `blankProfile` records why, learned the expensive way: "a key the boundary does not name is deleted on the next load". It is validated by its own function, `journeyValidate(errs, o, 'journey')`, into the same `errs`, exactly as `practiceValidate`, `validateTrace` and `dlyValidate` are, so one bad field refuses the whole record and `pImport` stays atomic.

What the boundary refuses, and by what name. Refused, never clamped, never dropped in silence:

| Refusal | Message shape |
|---|---|
| an unknown key under `journey` or under an item | `journey may not carry X` |
| a ground not in `GROUNDS` | `journey.ground.k is not a ground this build knows: X` |
| a date that does not parse, or more than a day ahead of the moment of the read | `journey.runs[i].t is not a date` / `... is ahead of the clock` |
| `end`, `resp`, `src`, `via` outside their lists | `journey.runs[i].end is not completed, ended or closed` |
| `lines` or `fresh` not whole numbers in range, or `fresh > lines` | `journey.runs[i].fresh is more than lines` |
| the sum of `fresh` over all runs larger than `meter.unique` holds | `journey.runs holds N new lines, more than the M this record has opened` (the same posture as `work.n` against `meter.unique`) |
| `log` with a gap in `seq`, a type outside the enumeration, free text, or over the cap | `journey.log[i].seq is not the next number` / `... is not an event type` / `the log is full` |
| `sig` versions out of order, `snip` outside the entry's text, a charge that is not a `CHILD` name, a seat not in `BANDS`, a side not in `PUR_SIDES` | one message each, naming the path |
| at the top level: `user_id`, `userId`, `customer_id` | `user_id is not held by this product` |

An older build reading a newer record drops `journey` and `sig` at its next save. That is a loss and not a break, and it is true of every field ever added (the comment above `snapLaws` says so). Slice O0 makes it loud: `validateProfile` returns a `dropped` list for an unknown top-level key and `pStore` reports it, instead of deleting it with nothing said.

**What a record written six months ago does.** It has no `journey` and no `sig`; both fill from the blank. Its position is derived from facts it does have, never invented: any record carrying `meter.first`, a committed story entry, `intake.completedAt` or a ritual is not a first-run record, so `journeyRead` returns a continuing state and onboarding does not replay. The existing replay from the account area stays ("the tutorial lives in the profile, toggleable and replayable"). For such a record the count of releases is unknown, not zero, because runs were never counted. The reveal rule (section e) treats an unknown count from a record with prior use as revealed, which the owner confirms.

---

## (b) What lives where

### b1. The split

| Layer | What goes there | Why |
|---|---|---|
| **Engine** (host free: no `document`, `window`, `navigator`, `localStorage`, `fetch`, `SpeechRecognition`, `AudioContext`; `hostfree.py` enforces it) | `GROUNDS`, `ONB_SCREENS`, `onbStep`, `journeyBlank`, `journeyValidate`, `journeyRead`, `journeyLog`, `journeyClaim`, `signalRead`, `signalAdjust`, the mini-release planner `onbMiniPlan`, `releaseState`, the integrity and archetype scoring, `disclosureRead`, the derived gift status | all arithmetic and all validation. Testable headless and fast. Every new function is added to the export list in `engine/export.js`, or a test cannot see it. |
| **UI** (the only half allowed a document) | the sheet and its renderers, the Field animation that draws a visual token, the microphone (`stMic`, Web Speech API), draft saving, wiring, `status()`, sounds | anything that touches the browser, including storage (the host binds it with `bindStore`) |
| **The one network seam** (`ui/auth.js`, the only file that calls `fetch`) | today: sign up, sign in, forgot, sign out, `/v1/me`, `/v1/billing/checkout`, `/v1/billing/portal`. Allowed to grow, by ruling, to: the record fetch at sign in (CLAUDE.md names it, and it is `pImport`'s second caller). | one grep audits the promise |
| **Needs a ruling before it exists** | a model call for the sniffer; aggregate product events leaving the device; a server-minted referral grant | each is a second seam or a new class of data leaving |

`engine/journey.js` (new) would sit in `atuned_src/MANIFEST` with the other engine files after `practice.js`; MANIFEST decides the order and nothing else may. Function declarations are hoisted, so `blankProfile` calling `journeyBlank` at run time is safe; any table the schema reads at load must be declared before it.

### b2. What the Story Sniffer can do offline today, and what needs the server

The owner's rule is that the app never holds the Anthropic key and never calls Anthropic, and a lookup goes only through our server (DECISIONS.md, round OK: "The lookup runs on our server and the app never holds the API key and never calls Anthropic ... it is a second network seam, which CLAUDE.md allows only by his ruling"). Today there is no model call in the app. The security review says the same: "`srcContext()` and `srcSend()` build the Source prompt and context, but the prompt is not sent to an LLM." So the sniffer is a deterministic lexicon engine. It runs on the device, in the engine, with no network.

**Offline today** (all of it in `engine/sniff.js`, `engine/sourceai.js`, `engine/avatar.js`, no host):

| It can | Function | Measured limit |
|---|---|---|
| find feeling words, body words and idioms, with where in the text they sit, and score them per seat | `scanStory`, `parseStory`, `marksOf` | It reads what its lexicon holds. The TDD's example sentence holds none of it. |
| name the charge axis an adjective carries, and the nine-axis shadow load | `sniffAxes`, `sniffStory().axes` | "overwhelmed" lands on Anger, inferred |
| place the charge at a seat and, when words named it, at an address | `parseStory().imprints` with `inferred` and `stated` | the fallback picks are not findings |
| list candidate saboteurs and the replacement pole for the heaviest axes | `sniffSaboteurs`, `sniffOffer` (at most three addresses) | |
| tell whether an entry answers trigger, contact, feeling, body, prediction, behaviour, belief, meaning, goal | `srcDims` | cue words only |
| rank how likely a seat is a pattern by evidence of return, and ask one question | `srcHear`, `srcNext`, `srcTurn` | needs earlier entries for rungs 9 and 10 |
| respect negation inside a two-word window and a sentence boundary | `srcNegated`, `clauseFloor` | |
| find which of six relationship sides an entry touches | `boundaryCross` | one side only today |
| re-read after a correction (append the person's correction to the entry, or replace it, and read again) | `parseStory` again | this is the offline meaning of "reinterpret" in section 18 |
| give a plain reason it asked | `srcWhy` in `ui/storyui.js` (one because, about the body) | never a why about the person |

**Cannot do offline, and would need a model through our server, by ruling:**

| It cannot | Why |
|---|---|
| write a tag in the person's language the lexicon does not hold ("Over-responsibility") | no vocabulary |
| paraphrase a cause ("Fear that things will fall apart if I don't handle them") | the engine's rule is that it never says why about the person. A paraphrase is also a claim of certainty, which section 13 forbids ("Do not claim certainty when the system is interpreting"). |
| read a story whose words are outside the lexicon | measured: zero hits |
| understand a correction that is a negation or a contrast ("not anger, more like dread") beyond the two-word window | no parsing |
| detect a named person | by design: the name never leaves, and the engine reads none |

**What a server path would minimally have to honour,** from rulings already made. This is a list of constraints, not a design, and it does not decide whether to build it: the app holds no key; the name never travels; the record is never held joined to the story, so the call carries story text only, with no profile id, no session token header tied to the record, and no history; the person's yes in plain words first; the result kept on the device and marked as looked up, not vetted; the daily Summary retune (AH4) depends on the same ruling and is waiting for it (`SPEC-source-ai.md`: "Where the model runs ... is a separate ruling with the privacy floor attached"). Question 2 asks the owner.

**Voice input** is a host capability, not an engine one, and has its own privacy fact. `ui/storyui.js` `stMic` uses `SpeechRecognition`. `hostfree.py` says why that name is on the refusal list: "in Chrome it is a NETWORK service that ships the microphone to the browser vendor, which is the one thing this product promises never happens." The code refuses it when the page is opened from a file (`isSecureContext` false) and allows it on https, which is where atuned.world is. The TDD's "Text. Voice. Two equivalent input modes" therefore puts a vendor network call under a product that says nothing leaves. It already exists on the Story tab, so this is not new, but making it a first-session primary input makes it the default path for a stranger. Further gap G4.

---

## (c) Persistence and recovery

### c1. The eighteen states of section 7, against today's code

Columns: what is persisted today; what is restored on return today; what happens on exit today; the silent-loss risk; what is proposed. "Today" is the code at b4b9e5c.

| State | Persisted today | Restored on return | On exit | Silent-loss risk today | Proposed |
|---|---|---|---|---|---|
| `LAND` | nothing (static funnel page) | n/a | nothing to lose | none. `funnel_started` has no home. | funnel-side local key; first log line |
| `ENCOUNTER` | nothing | n/a | nothing to lose | none | same |
| `SELECT_GROUND` | no ground concept. The quiz saves answers per tap and reports `SAVE_FAIL` when it cannot. | n/a | nothing saved | none yet | write on selection, with the quiz's own failure line; a changed answer is allowed and logged |
| `STARTER_GIFT_ISSUED` | implicit: `GIFT_N`, read while `meter.unique` is under 100 | the allowance recomputes | nothing | the personalisation (which addresses come first) is persisted nowhere, because it does not exist. A cleared browser loses the gift and everything else; "every state must be recoverable" cannot hold across a cleared browser until a record store syncs (POINTS-AUDIT question 12). | `journey.gift.at`, derived status; say the limit plainly |
| `ACCOUNT_CREATED` | the session under `source.session`; the account is on the server; the profile deliberately holds no account link | `authCheck` at boot reads `/v1/me` and `authPlanTake` writes only the plan | nothing created if closed mid sign up | failures are reported through `authSay`. "Account created but gift transfer fails" cannot happen while the gift is a local constant; it can if a grant becomes server held. | if any grant becomes server held, the claim is idempotent and its failure is reported |
| `TUTORIAL_STARTED` | `OB.felt` and `TUT.text` in memory; `obClose` and `tutClose` write `onboarded` and `tutorialSeen` | the flags are deleted by the boundary (measured), so the sheet replays at every launch | Escape closes the sheet and the typed text is gone | **the typed tutorial text is lost on Escape, and the one onboarding answer (`OB.felt`) is never stored.** | stamps in `journey.log`; draft saved (below) |
| `PATTERN_SELECTED` | nothing until a run commits | n/a | nothing | none. The automatic selection primitive exists (`sniffOffer`, three addresses) and nothing calls it for a first run. | `onbMiniPlan`; a log line |
| `FIRST_RELEASE` | `RUN` in memory; one commit at `relCoolDown` (undo point, charge write, `meterRun`, firsts, `pSave`, `pSnap`) | none: a closed or killed run starts again from the welcome. Nothing was spent. | End still commits; the card closed mid run commits nothing | **an abandoned run is invisible, and the commit's `pSave` result is ignored.** | a `runs` item for `completed`, `ended` and `closed`; the save result reported |
| `VERIFY` | nothing. `meter.heavy` marks a line the body answered on. | n/a | nothing | the one place the TDD wants a person's report and nothing takes it | `runs[].resp` |
| `RERUN` | keys persist, so a rerun after a restart works (`meterRerunPlan` reads the keys held); `meter.lines` and `last` move | yes | nothing | a rerun leaves no event; its count is not separable | a `runs` item with `rerun:true` |
| `FREE_PRACTICE` | derived: `meter.giftAt`, then `planWeeks`, `planAllowance` | yes, derived | nothing | none. A clock set backwards cannot take a week away (`planWeeks` is never below one). | reuse as is |
| `REFERRAL` | nothing | n/a | n/a | n/a | server grant, slice O11 |
| `NEW_GROUND_LIMIT` | derived: `relBudget().cap` is 0, so `relPlan()` returns an empty list and the run is refused at the door | yes, derived | nothing | the moment is not stamped, so `new_ground_limit_reached` has no source | log line the first time the cap is met in a week |
| `TIER_SELECTED` | `authPlanCheckout` opens the hosted page; nothing local | on return `?billing=done`, `managed` or `cancelled` is read once and removed | closing mid checkout leaves nothing local | none; "Checkout was closed before paying, so nothing was charged" is said | log line only |
| `PAYMENT` | the processor | `authPlanBack` then `authPlanWait`: five reads two and a half seconds apart, then a plain line telling the person to reload in a minute | n/a | none. A delayed callback is said, not hidden. | reuse as is |
| `ENTITLEMENT_GRANTED` | `authPlanTake` validates the plan through `validateProfile` and saves; an unwritable store is reported ("holds for this visit and is read again at the next sign in") | yes | n/a | none. This is the model for the other writes. | reuse as is |
| `NEW_GROUND` | `meterRun` | yes | n/a | the save result is ignored at the commit (above) | report |
| `CONTINUED_PRACTICE` | `p.rituals` on the record; the ritual plans in `atuned-ritual-active` beside it | the plans return on the same browser | n/a | the plans are not in Export, so a moved or imported record has days and no plan | not an onboarding change; flagged |

### c2. The states the list leaves out, where typed words are lost

| Screen (TDD section) | Persisted today | If the page closes here | Proposed |
|---|---|---|---|
| Feeling (11) | no such screen. The input type is not stated (further gap G8). | n/a | if the answer is words, it is part of the entry text, so the sniffer reads it and there is one store |
| Story intake, text and voice (12) | `ST_TEXT` in memory. The funnel quiz's `STORY` in memory. Nothing in `ui/storyui.js` touches the store. | everything typed since the last commit is gone, with no sign | a draft in a small side key per record (`source.draft.<id>`), written on a short delay and on every blur, removed at commit, its write failure said. A side key and not the profile, because the profiles array is written whole on every save and a draft is written constantly. The committed entry is what the record keeps. |
| Mirror (15) | nothing: the reading is recomputed from the text | recomputed, same text, same reading (deterministic) unless the lexicon changed, which `lex` records | `sig` version stored at the moment shown |
| Accuracy check (17) | nothing | the verdict is lost | `sig[].verdict` on the shown version |
| Adjustment (18) | nothing | the correction is lost | the correction text is appended to the entry (the person's own words, never discarded) and a new `sig` version is written |
| Somatic setup (20) | nothing; the welcome lines (`REL_WELCOME`) exist inside the release run | n/a | a log line, no state |
| Post-release (24) | nothing | the report is lost | `runs[].resp` |
| Integrity, ten screens (25 to 27) | the intake stores each answer as it is given (`p.intake.answers`) | those answers survive. The new ten-question check has no store. | write each answer to `p.laws` and `journey.assess.integrity.laws` as given |
| Archetype, polar questions (28 to 30) | the side store holds ratings, not polar answers | lost | `journey.assess.archetype.items` as given |
| Handoff (33) | nothing | n/a | derived summary; `software_entered` logged |

**Rules for recovery, all derived and none stored:** the resume point is the furthest milestone the facts support plus the unfinished screen; resume never repeats a finished screen; a finished release is never re-run on its own; "start again" is always one press and discards nothing, because everything it wrote stays on the record and only the position resets.

### c3. Silent-loss risks in today's code, in one list

| # | Risk | Evidence | Slice |
|---|---|---|---|
| L1 | the two first-run flags are deleted at load | measured | O0 |
| L2 | the story draft, the tutorial text and `OB.felt` are memory only | `ui/storyui.js`, `ui/tutorial.js`, `ui/onboard.js` | O4 |
| L3 | the story commit and the release commit ignore a failed save | `ui/storyui.js` 412, `ui/release.js` `relCoolDown` | O0 |
| L4 | an abandoned or killed run leaves no record | `ui/release.js` `relClose` | O3 |
| L5 | no count of runs, so no "second" and "third" release | `meter` carries lines and a global first and last | O3 |
| L6 | a new top-level field the boundary does not name is deleted at the next load | measured (POINTS-AUDIT X11 is the same finding) | O0 |
| L7 | ritual plans and avatar ratings are not exported, so the round trip invariant fails for them | `atuned-ritual-active`, `atuned-avatar-side` | outside this TDD; flagged |
| L8 | the funnel quiz keeps no story and no stamps | `funnel/quiz.html` `save()` | O5 |
| L9 | the funnel to app handoff is a downloaded file | `funnel/quiz.html` door | O5 |

---

## (d) The event list against today's events

### d1. The thirty-one events of section 46

Today's events, found by searching: the Practice log (`PR_EVENTS`, `engine/practice.js`; built, no writer), dated firsts in `meter.firsts`, timestamped story entries, history snapshots, the intake's `startedAt` and `completedAt`, `meter.giftAt`, `meter.first` and `last`, the plan's `since`. There is no product event log. DERIVABLE means a pure function over today's record returns it with a real date. PARTIAL means a related fact exists without the date or the instance. MISSING means nothing.

| # | Event | Today | Verdict | Local home |
|---|---|---|---|---|
| 1 | `funnel_started` | none | MISSING | funnel local key |
| 2 | `ground_selected` | none | MISSING | `journey.ground`, log |
| 3 | `starter_gift_issued` | a constant, no moment | PARTIAL | `journey.gift.at`, log |
| 4 | `account_created` | known to `ui/auth.js` at sign up, never stamped on the record (by ruling: no account id on the record) | MISSING | log line with a date and no id |
| 5 | `tutorial_started` | memory only | MISSING | log |
| 6 | `story_submitted` | `story.entries[].t`, written at commit. The sniffer reads live on every keystroke; commit is the submit. | DERIVABLE | derive |
| 7 | `story_signal_generated` | the entry's `imprints` count and `bands`, no version | PARTIAL | `sig[0].at` |
| 8 | `story_signal_confirmed` | none | MISSING | `sig[].verdict` |
| 9 | `story_signal_rejected` | none | MISSING | `sig[].verdict` |
| 10 | `story_adjustment_submitted` | `asked[].a = wrote` records only that more was written after a question | MISSING | log, plus the appended text |
| 11 | `story_signal_updated` | none | MISSING | `sig[n].at` |
| 12 | `somatic_setup_started` | none | MISSING | log |
| 13 | `first_release_started` | `RUN.t0`, memory | MISSING | log |
| 14 | `pattern_released` | `meter.unique` (keys, no dates), `meter.lines`, dated firsts per address and seat | PARTIAL | one log line per run with a count; per-line detail stays derivable from `meter.unique` |
| 15 | `first_release_completed` | `meter.first`, `meter.firsts[0]` | DERIVABLE | derive, and `runs[0]` |
| 16 | `post_release_observation` | `meter.heavy` only | MISSING | `runs[].resp` |
| 17 | `integrity_assessment_started` | `intake.startedAt` exists for the 63 questions | PARTIAL | `journey.assess.integrity.at0` |
| 18 | `integrity_question_answered` | `intake.answers[i]`, no per-answer date | PARTIAL | log with the law name |
| 19 | `integrity_assessment_completed` | `intake.completedAt` for the 63 | PARTIAL | `at1` |
| 20 | `archetype_assessment_started` | none | MISSING | `journey.assess.archetype.at0` |
| 21 | `archetype_question_answered` | ratings in the side store, undated | MISSING | log with the question id |
| 22 | `archetype_assessment_completed` | none | MISSING | `at1` |
| 23 | `tutorial_completed` | `tutorialSeen`, deleted at load | MISSING | log |
| 24 | `software_entered` | `onboarded`, deleted at load | MISSING | log |
| 25 | `pattern_rerun` | `meterRerun` adds to `meter.lines` and `last`, not separable | PARTIAL | `runs[].rerun` |
| 26 | `free_practice_started` | `meter.giftAt` | DERIVABLE | derive |
| 27 | `referral_started` | none | MISSING | log (the grant is the server's) |
| 28 | `new_ground_limit_reached` | derivable as a state now, never stamped | PARTIAL | log, once per week |
| 29 | `tier_viewed` | `ui/plans.js` draws it, no log | MISSING | log |
| 30 | `tier_selected` | `authPlanCheckout` is called, no log | MISSING | log |
| 31 | `payment_completed` | `plan.since` and `plan.status`, set from the server's word | PARTIAL | derive, plus a log line when `authPlanTake` lands a live plan |

At the stamp the table's own tallies read 3 derivable (6, 15, 26), 9 partial and 19 missing. Recount with the section d1 command in Appendix B. These are this table's tallies at this commit and not numbers to type into any other document.

### d2. What the TDD's event list does not have

| Missing event | Why it is needed |
|---|---|
| a release state event for each of the six states of section 40 | section 40 says each needs a recovery path and "the system should learn from" what was selected, rejected, changed, completed and reported. Nothing in the 31 carries rejection, abandonment or the report's value. Proposal: one `release_recorded` with the two stored facts, not six names. |
| `tutorial_abandoned`, `somatic_setup_completed`, `screen_resumed` | a returning person's resume is the recovery path the TDD asks for and it has no event |
| `gift_depleted`, `paywall_shown`, `entitlement_granted`, `renewal`, `cancellation` | present in the funnel TDD section 14 (24 events there), absent here. A paywall state is missing from section 7 too. |
| `referral_opened`, `referral_signup`, `referral_grant_issued`, `referral_grant_used` | the funnel TDD tracks the chain; this TDD stops at `referral_started` |
| `save_failed` | the product's own rule is that a write that fails says so; the log should be able to say it did |

### d3. How events are kept locally without a backend

Two rules decide it: derive what a pure function can return from the record, and log only what it cannot. A stored event that duplicates a derivable fact is two truths.

1. **Derive** events 6, 15, 26 and the plan-driven part of 31. No storage.
2. **Log** the rest in `journey.log`, a capped, gapless, append-only list, the same posture as the Practice log (`PR_LOG_SPEC`): `{seq, type, at, ref, d}` where `ref` is a key into the record (an entry's `t`, a signal `n`, a run index, a question id), `d` is a small closed object of enumerations, and there is **no free text in the log**. A log that held words would be a second copy of the story, and it feeds analytics. `type` is one of a closed enumeration that is part of the boundary, so a typo is a refusal.
3. **One vocabulary.** Recommendation: the onboarding TDD's lower snake case for the local log, because it is the contract this slice is built to, with a one-line mapping table to the Practice and funnel names where they overlap (`pattern_released` to `PRACTICE_COMPLETED` is not one to one and must not be asserted equal).
4. **Cap policy.** Over the cap is refused by name, as the outbox does (`obQueue`: "Over the cap is refused by name rather than evicting the oldest"), and a repeating event is logged once per run, not once per line, so the cap is reached slowly. What the cap is and what happens at it is a small decision for the owner, not an inference.
5. **Pre-account events** live in the funnel's own key (`atuned.funnel.v1`, same shape) and are claimed into the profile's log at first boot (a3). The funnel's gate says nothing leaves the machine and this keeps it true.
6. **Nothing leaves the device.** `engine/outbox.js` refuses product events by design (four kinds only; `history`, `meter`, `story` and `avatar` are on `OB_NEVER`). Sending even enumerations and day-level dates off the device is the owner's ruling (POINTS-AUDIT question 9, options C and D: local counters only and watch the first hundred real people, or opt-in aggregate counters through the outbox). The MVP architecture document asks for funnel-level analytics as P1 and does not say where they run. Until ruled, "track at minimum" means "recorded locally and reconstructable", which is what section 46's last line asks for ("Events should contain enough context to reconstruct the user's journey").
7. **Round trip.** `journey.log` is inside the profile, so Export carries it and `validateProfile` checks it. The invariant a gate holds: export, import, export yields identical text.

---

## (e) The achievements question

The expected answer, stated by whoever briefed this review, was that the engine has the rule that a reading is not an achievement, a ring badge that is not an achievement, and no achievements or points engine. **That is right about points and wrong about achievements.** Searched honestly, twice (names, then words), at b4b9e5c.

### e1. What exists today

| Thing | Where | What it is |
|---|---|---|
| The rule | `engine/ladder.js` head: "a reading is never a score ... The record is what you did"; `DECISIONS.md` 646 to 651 | ruling, in code comments and decisions |
| `MARKS` | `engine/ladder.js` | **sixteen named achievements** in three families (Practice at the root, Ground at the throat, Structure at the heart), each with an icon path, a seat colour and a test function over the ledger, the streak and the profile: First run, Seven days, Thirty days, Ninety days, Sixty minutes, Ten addresses, Fifty addresses, First story, Ten stories, Nine axes, Laws measured, Blueprint stated, Purpose set, First clearing, Five clear, Ten snapshots |
| `ladderRead(p, now)` | `engine/ladder.js` | pure: returns `earned`, one `next` and nothing beyond it, the ledger and the streak |
| `streakRead`, `ledgerRead`, `intentionRead`, `seriesRead` | `engine/ladder.js` | counters, a streak that halves rather than resets, an intention figure on no surface |
| `meter.firsts` | `engine/schema.js` | the only stored, dated, once-only list: first at an address (`addr:N`), first at a seat (`seat:B`). The boundary comment calls it "the only achievement shape this product allows". |
| Readers | the Compass (`ladderHtml`, `ui/cone.js` 3318), the Ritual page (`ritMarksHtml`), the sound layer (`sfxMarksNow`, `sfxMarkNew`) | three |
| The mark sound | `ui/sound.js`: `kept` and `done` carry `earn:true` and upgrade to the mark sound when a press earned a mark not heard before | |
| `crBadge` | `ui/component.js` | a ring icon carrying a charge percentage. A reading badge. Not an achievement. |

### e2. What does not exist

Points and any currency but patterns. A stored set of grants (a mark vanishes if its state falls: POINTS-AUDIT probes X9 and X10). A progress event ledger (`engine/progress.js` is proposed in POINTS-AUDIT and does not exist). Unlocks. Rarity. A progress hub. Any gate that hides a mark. A reveal rule of any kind.

Two defects found by POINTS-AUDIT at its commit are still present at this one, re-read in `engine/ladder.js`: `pracDays` counts a ritual that was set and never done (21.J2, probe X2: thirty days set and none done earns First run, Seven days and Thirty days), and the unique-ground marks count thought lines and say addresses (X5).

### e3. How "hidden at first, revealed after repeated use" attaches to the Points TDD v2

The Points TDD's section 19 defines an unlock as a deterministic trigger over evidence that opens a capability, a piece of knowledge or a perspective. Section 36 forbids hiding evidence behind a score. The onboarding TDD's reveal is an unlock of that kind: the thing unlocked is the visibility of the person's own record of effort (the marks), the trigger is an evidence rule over runs, and nothing the person was told about their own reading is withheld. That puts it on the safe side of the two conflicting sight rulings in POINTS-AUDIT C5, because marks are a record and not a reading. It must not be implemented as a tier gate, and points do not buy it (section 36, last item; POINTS-AUDIT P39 already holds this true by absence).

Mapping:

| Onboarding TDD | Points TDD v2 | Today |
|---|---|---|
| `achievement_layer: hidden` (section 23) | an `UnlockDefinition` of type `capability`, not yet satisfied | nothing hides anything |
| "After repeated use, reveal ... Achievements" (section 42) | `trigger: EvidenceTrigger` over `ritual.completed`, `protocol.pattern.executed` style events | no event source for a run count (finding 3) |
| the first, second and third release (section 41) | `turn.closed` and counters | `meter.lines` only |

### e4. The minimal slice that makes it real

Three small steps, and none needs points, grants or the stored ledger.

1. **A source for "repeated use".** `journey.runs` (slice O3) gives a dated count of releases. Without it nothing can say "third release".
2. **One pure predicate.** `disclosureRead(p, now)` returns a tier from the record: 0 for a first session, 1 after one completed release, 2 after repeated use. It is derived from `runs`, never stored. The thresholds are the owner's (question 5); the code makes them one table, so changing them is one edit. A record with prior use and an unknown run count reads as 2.
3. **Gate the three existing readers on tier 2.** `ladderHtml` on the Compass, `ritMarksHtml` on the Ritual page, and the mark upgrade in `sfx()` (`sfxMarkNew` returns false below tier 2 while `sfxMarksTake` still takes marks in quietly, so nothing sounds late in a burst when the layer opens). Marks earned while hidden are not lost: they are derived, so they appear dated by their own evidence when revealed.

**Prerequisite, small:** POINTS-AUDIT slice 0 (fix 21.J2: `pracDays` skips a ritual that was not done; a ground mark counts distinct addresses), because the reveal rule and the marks it reveals must not read days nobody practised. A reveal rule must not read `streakRead` as it stands.

**Not in the slice:** grants (so a mark can still vanish when its state falls; POINTS-AUDIT slice 2), points, unlocks as a general engine, the hub, anything off the device.

---

## (f) Slice plan

Sizes are my estimate, against `engine/practice.js` at 1,135 lines carrying 713 lines of gate. **S** is under about 100 lines of source plus its gate and fits one sitting. **M** is roughly 100 to 400 lines. **L** is above that or touches several surfaces. "First release reachable" means a new person, offline, with no funnel, no account and no assessments, goes from the first screen to a finished mini release and a recorded answer about it.

Every engine slice also runs the engine's own gates before commit: `./atuned_src/BUILD.sh`, `./atuned_src/BUILD-engine.sh` (which asserts the engine is host free), `node tests/engine.js`, and `python3 tools/equiv.py old.html source.html` for any change to a declared name, so a change is a named diff and never a silent one.

| Slice | What | Needs | Size | The gate, what test proves it |
|---|---|---|---|---|
| **O0** | **Stop the silent drops.** Name `onboarded` and `tutorialSeen` at the boundary (read once into journey marks later); `validateProfile` returns a `dropped` list for an unknown top-level key and `pStore` says so; the story commit and the release commit report a failed save through `statusSaved()`. | nothing | S | `tests/engine.js`: set both flags, save, reload through `pStore`, assert they survive; add an unknown key, assert it is named in `dropped` and not silently deleted. `tests/functional.js`: stub `localStorage.setItem` to throw, commit a story and finish a release, assert the status line is `data-kind="fail"`. |
| **O1** | **The journey record.** `journey` v1 in the blank and at the boundary (`journeyValidate`), `journeyLog`, derived `journeyRead`, new `tests/journey.js`, exports. No UI. | O0 | M | `tests/journey.js`: a record with no `journey` loads equal to the blank; a v1 record loads; export, import, export is identical; every refusal in a8 asserted by its message; the log is gapless and capped; `hostfree.py`. |
| **O2** | **The Story Signal, offline.** `signalRead`, `signalAdjust`, `sig` on entries (add `sig` to `ENT_KEYS` and `vEntry`), version chain, verdict, `boundaryCross` returns all sides (additive). Includes the unread state. | O1 | M | `tests/engine.js` and `tests/journey.js`: the TDD's own sentences as fixtures (the single sentence reads unread and invents nothing; the longer story reads three seats); `cause` is null unless a cue clause exists; a negated mention is not read; an `inferred` address is never returned as a finding; `snip` offsets resolve inside the text; versions are gapless. |
| **O3** | **The mini release and the run record.** `onbMiniPlan(profile, signal)` plans whole addresses (never a partial address: the four-line unit, so 8 or 12, see question 3), capped at what the allowance leaves, deterministic. `journey.runs` written at `relCoolDown` (`completed`, `ended`) and at `relClose` (`closed`); `releaseState` total function. | O1, O2 | M | `tests/engine.js`: plan is a multiple of four lines, never exceeds `meterBudget().cap`, same input gives same plan, an unread signal plans nothing; `releaseState` maps every combination to exactly one of the six names. `tests/functional.js`: run, assert one `runs` item and the meter moved once; close mid run, assert a `closed` item and an unchanged `meter.unique`; run a worked example, assert the refusal and no item. |
| **O4** | **The first-run sheet. This is the slice that makes the first release reachable.** `ONB_SCREENS` and `onbStep` in the engine; the sheet renderer in the UI; story entry (text, and the existing mic); mirror; accuracy check (That's it, Not quite, Adjust); somatic setup; the release card with the plan chosen for the person; post-release answer; handoff. Draft saving in a side key with its failure reported. Resume from `journeyRead`. Replaces or absorbs `ui/onboard.js` and `ui/tutorial.js` (owner's call). | O1, O2, O3 | L | `tests/functional.js`: a walk from a blank profile to a recorded release at 1600 and 390; kill and reload at each screen and assert the resume point and that no typed word is lost; assert the number of required decisions before the first release (TDD: one, and further gap G3 asks which); `tools/monitor.js` reads every new surface; `tests/design.js` floors; `python3 tools/terms.py`; `python3 .claude/skills/atuned-voice/check.py --objections` over every screen string in the table. |
| **O5** | **Ground and the gift.** `GROUNDS` table (owner's content for the twelve), the ground's offer ordering, `journey.ground` and `journey.gift`, derived gift status, the funnel's ground screen writing a local key, `journeyClaim` at first boot (atomic, idempotent). Gives the unread story a fallback source of patterns. | O1; the owner's ground content; question 1 | M | `tests/journey.js`: a claim twice equals a claim once; a payload that fails the boundary changes nothing and says why; derived gift status equals `planAllowance`; `tests/funnel.js`: the new screen renders at both widths, every control is at least 44 by 44, and the existing "nothing leaves the machine" gate stays green because nothing leaves. |
| **O6** | **The post-release response set and the six derived names,** with a recovery line per state (owner's copy). | O3; further gap G7 | S | `tests/engine.js`: no combination maps to a failure word; the voice gate reads the recovery copy. |
| **O7** | **The ten-question integrity check.** | O1; further gap G1 (which laws, which wording) | M | `tests/engine.js`: ten answers leave CQ filling with `tier` null; the later 63-answer intake overwrites cleanly; round trip. |
| **O8** | **The archetype check.** | O1; further gap G10 (poles to archetypes) | M | `tests/engine.js`: answers never change `soul.arcs`; tendency and saturation are pure and unstored; `both` is a real value. |
| **O9** | **Disclosure and the achievement gate** (section e4). | O3; POINTS-AUDIT slice 0; question 5 | S | `tests/engine.js`: the predicate at each tier boundary and for a legacy record; `tests/functional.js`: marks absent from the Compass and the Ritual page in a first session and present after the threshold; the mark sound is silent below tier 2 (`tests/sound.js`). |
| **O10** | **The local event log, complete.** Every event in d1 and d2 wired; funnel log claimed; Export carries it. | O1, O4, O5 | S | `tests/journey.js`: a recount command reads the enumeration and the table in d1 and fails if they disagree; every `analytics_events` name on every screen is in the enumeration. |
| **O11** | **The server seams.** Record fetch at sign in through the existing seam (`pImport`'s second caller); a signed referral grant read through `planFromServer`'s sibling; the sniffer route; aggregate counters through the outbox. Each is separately blocked. | accounts ruling; question 1 option B; question 2; POINTS-AUDIT question 12; the open ruling "Save conflict between two devices. Blocks the record store" | L, not sized | not specified here. The gates are the existing ones plus the privacy refusals asserted on the wire. |

**Order and dependency, in one line.** O0, then O1, then O2 and O3 (O3 needs O2), then O4. That is the first release. O5, O6, O9 and O10 follow O4 in any order. O7 and O8 wait on rulings and can run in parallel with them. O11 waits on the owner. The first release does not need the ground, the gift, the assessments, any event beyond the log's first lines, or any network.

**What this ordering costs.** Until O5, a story that reads nothing (the TDD's own example) gets no automatic patterns. The mirror says so and asks for more words, which is the honest behaviour and does not meet TDD section 21 for that story. That is a known gap in the earliest release, not a hidden one.

---

## (g) Five questions that change the plan

Written for the person who holds the vision. Each quotes the thing it is about, gives the ways it could go with what each costs, and a recommendation. A way he may not have an answer to is left open, and none is answered for him.

### 1. Does the funnel's state travel over the network when the person creates an account?

The TDD, section 10: "When the user creates an account, the funnel state transfers directly into the account. There should be no manual export or import." Its `FunnelActivation` carries `user_input`, which is the story.

Your standing ruling, `DECISIONS.md`, data, 18 September: "We do not keep the record joined to the story. The record identifies, the story does not, and the two are not held together." And the same section: "The funnel record exists only to hand back to the person. It is not an asset, not a list, not a segment." The quiz's own door says: "There is no account and no server, so nothing here can be fetched later by anybody, including us." and "Your story is not in it."

- **A. Device-local handoff, no network.** The funnel and the app are both served from atuned.world, so they share a browser's storage. The funnel writes a local key; the app claims it at first start and checks it through the same door every import uses. The story never leaves the device. A person who downloaded the single file still has the file route. Cost: it does not follow a person from a phone to a laptop, and a cleared browser loses it.
- **B. The server holds a funnel record without the story** (ground, gift issued, assessment answers), fetched at sign in through the record fetch CLAUDE.md already names. Cost: a controller exists, with access, deletion and breach duties; the open ruling on a save conflict between two devices blocks it; the funnel gate that says nothing leaves the machine has to change.
- **C. The server holds the story as well.** Cost: it reverses the ruling above. I would not build this.

Recommendation: A for the first release, B when the record store lands. Changes: whether slice O5 needs a network at all, and whether the funnel's "nothing leaves the machine" gate changes.

### 2. Where does the Story Sniffer's interpretation run?

The TDD, section 18: "SOURCE OS must reinterpret the correction." Section 13: "Do not claim certainty when the system is interpreting."

The rule you gave, `DECISIONS.md`, round OK: "The lookup runs on our server and the app never holds the API key and never calls Anthropic. It sends the person's name off the device, so it needs the person's yes in plain words and it is a second network seam, which `CLAUDE.md` allows only by his ruling." And `SPEC-source-ai.md`: "It does not say whether any of it leaves the device, and that is a separate ruling with the privacy floor attached."

What I measured: the offline sniffer reads the TDD's example, "I keep taking care of everybody else.", as nothing at all.

- **A. Offline only.** The mirror shows the seat, the person's own words and the charge word they used. "Cause" is their own clause quoted back, or blank. "Adjust" re-reads their correction. Cost: the example tag "Over-responsibility" and the paraphrased cause cannot appear, and stories outside the lexicon read as nothing.
- **B. Our server, story text only.** No name, no profile id, no history, with the person's yes first, and the result kept on the device marked as looked up. Cost: a second seam; the story leaves the device; the funnel needs a consent screen before any account exists.
- **C. Offline first, the server only after the person says yes.** Cost: two paths to test. It is A and B together.

Recommendation: A for slices O2 to O4, C as slice O11 with the consent in plain words. Changes: what the Mirror can print, and whether the first release can wait for a server.

### 3. What is "a pattern" in the hundred and in the ten, and is the gift a bank or a budget?

The TDD, section 10: "The starter gift becomes the user's actual pattern bank." Section 21: "The initial mini release should contain approximately 10 relevant patterns."

The code, `engine/plan.js`, the gift row: "A hundred patterns, free. Twenty five releases at one address, or fewer and wider. It is spent by opening new ground and never by rerunning what is already open." One pattern is one thought line, and the smallest run is one address across four channels, four lines, because "a run has to cover the address on both sides and both tracks to be a release at all". The sniffer offers at most three addresses.

- **A. A budget, with the ground deciding what is offered first.** Nothing is withheld, the hundred is spent wherever the person opens ground, and the ground only orders the offer. Cost: "bank" is a word and not a list.
- **B. A bank.** Only the hundred ground-relevant lines are free. Opening anything else costs from the Free allowance at once. Cost: it changes the ruled gift and `planAllowance`, and punishes a person who follows their own interest.
- **C. A budget plus a visible recommended list.** A with the list shown. Cost: one more thing on a screen.

And the mini release: ten lines cannot be a whole number of addresses. It is eight (two addresses) or twelve (three). Recommendation: A or C, and eight or twelve according to what the story read. Changes: slices O3 and O5, and whether `planAllowance` is touched.

### 4. What does "success" claim, and what does the person report?

The TDD, section 40: six states, `RELEASE_SUCCESS` to `RELEASE_NO_EFFECT`. The funnel TDD, section 6: "Presentation state, processing state, and evidence state remain separate. A visually completed release is not automatically verified change." The MVP architecture, section 22: "A first meaningful shift is explicitly measured and distinguished from completion."

The six names mix how the run ended (completed, ended early, closed), what the person said happened (changed, nothing, confused), and whether they accepted what was proposed (rejected). Three docs give three response lists: the sensations of section 24 (something, nothing, density, relief, movement), the five choices in the funnel TDD (I feel different, I see it differently, something moved, nothing changed, I'm not sure), and the Practice outcome (improved, unchanged, worsened, unclear).

- **A. Store two facts, derive the six names.** How the run ended, and what the person said. Cost: the six names become labels you read off a table and not a field.
- **B. Store the six as one field.** Cost: a completed release where nothing changed cannot be told from a failed one, and the second and third release cannot be counted.
- **C. A, with the funnel TDD's five choices as the response list.** Cost: it is a copy ruling and the sensation list of section 24 is dropped from the capture.

Recommendation: A, and tell me which response list is yours. Changes: the shape of `journey.runs`, slice O6, and how the Practice build is cut over later.

### 5. What reveals achievements, what is the word, and what counts as repeated use?

The TDD, section 23: `achievement_layer: hidden`. Section 42: "After repeated use, reveal: Advanced vocabulary. Deeper system architecture. Achievements. Additional tools."

The code, `engine/ladder.js`: "Earned marks are shown. The next one is named with what it takes. The ones beyond it are not enumerated." The ruling in `DESIGN-progression.md`, as POINTS-AUDIT C11 quotes it, bans "points, XP, score, level, badge, achievement, trophy, streak, coin" from every surface. The product's own word for the thing is "mark". Sound is on by default and a first story chimes a mark.

- **A. Marks, revealed on a rule over runs.** A count of completed releases on a count of days, in one table. Cost: you pick two numbers, and "repeated use" is not defined anywhere I read.
- **B. Rename the thing "achievements" on the surface.** Cost: it breaks one word per concept and the ruling above, and needs a ruling that reverses it.
- **C. A, and hide the Compass ladder and the Ritual marks entirely until the reveal.** What I would read the TDD to mean. Cost: a person who reads the Compass in week one sees no record at all.

Recommendation: A with C, `marks` as the word, and the mark sound silent until the reveal. Say the two numbers. Changes: slice O9, and whether POINTS-AUDIT slices 0 to 2 are prerequisites.

### Further gaps, listed and not answered for him

Each is a place the TDD says to implement and does not say what.

| # | Gap | The TDD says |
|---|---|---|
| G1 | Which ten of the twenty-one laws, and what each question says | "There are 10 integrity questions." "The questions should map to the established CQ100 integrity architecture." |
| G2 | Which intensity scale: how hot the words are, or how often it returns | "Intensity: 8" |
| G3 | Which is the one decision before the first release. Ground and the accuracy verdict are already two. | "Maximum required decision count before first release: One." |
| G4 | Whether voice is allowed to be a primary first-session input when the browser's recogniser is a vendor network service | "Provide two equivalent input modes: Text. Voice." |
| G5 | Who receives the 25, what caps it, and the server that mints it | "Invite-a-friend behavior: 25 free patterns" (`funnel/buy.html` adds "capped at four a month") |
| G6 | Whether the four-card onboarding and five-step tutorial built under earlier rulings are replaced, or this flow sits in front of them | the TDD does not mention them; `DESIGN-onboarding-narrative.md` says the tutorial "has to start with the journal" |
| G7 | The recovery path for each release state, and the response list | "Each state needs a recovery path." No path is written. |
| G8 | Whether the feeling page's answer is words that join the story or a choice | "What are you feeling today?" then "How does that feeling run through you?" |
| G9 | A `PAYWALL` state in section 7, and its events | present in funnel TDD section 12, absent here |
| G10 | Which pole maps to which of the twelve archetypes, and Mage against Magician | "Act immediately or Understand it deeply first?" |
| G11 | The cap on the local event log and what happens at it | "Events should contain enough context to reconstruct the user's journey." |

---

## Appendix A. The probes

Built the engine into a scratch path with `sh atuned_src/BUILD-engine.sh <scratch>/engine.js` (prints "engine is host free" and "engine ok, 644 exports" at this commit), then ran node against it. The tracked `engine.js` was not touched.

**P1. The two onboarding flags through the boundary.** Bound an in-memory store, made a profile, set `onboarded`, `tutorialSeen` and a stray `funnel` key on it, saved, read the disk, then reloaded through `pStore`.

    save ok true
    on disk has onboarded true tutorialSeen true funnel true
    after boundary onboarded undefined tutorialSeen undefined funnel undefined

**P2. Tables.** `SCHEMA_V 2`, `GIFT_N 100`, `RUN_MIN 4`, `RUN_MAX 25`, plan grants gift 100, free 10, one 400, two 800, three 1200, four 1200, 16 `MARKS`, 25 entries in the `PRACTICE` table, 112 addresses, 21 laws, 12 archetypes, 14 tab entries, no `progressEvents` export, `ladderRead` present. The blank profile's top-level keys, in order: `v, id, name, created, updated, soul, axes, who, ui, seed, meter, plan, avatar, purpose, laws, intake, work, gates, story, rituals, history, practice, trace, summaries`.

**P3. The offline sniffer on the TDD's own sentences.**

    "I keep taking care of everybody else."
      hits 0, bands none, imprints 0, offer none, boundaryCross null
      srcHear: unread true.   srcDims answered: contact, behaviour. open: the rest.

    "I keep taking care of everybody else. I am overwhelmed and I am scared things will fall apart
     if I do not handle them. My chest is tight when my mother calls."
      hits: overwhelmed (solar 26), scared (root 18, and adj charge fear), apart (adj, separation),
            chest is tight (heart 24)
      bands: solar 26, root 18, heart 24.   named axes: Fear, Apathy
      imprints 12; the first three are Pride, Arrogance, Competition at Solar, fetter Anger,
            inferred true
      offer: Celiac Plexus (Anger, replacement Calm / Integrated Power), Pericardial Nerve (Sad),
            Lumbar Plexus (Fear)
      srcDims answered: trigger, contact, prediction, belief, body, feeling, behaviour. open: meaning, goal
      boundaryCross: family

    "I am so tired and I feel overwhelmed all the time."
      hits: overwhelmed (solar 26).  axes: Anger shadow 8.8 at Celiac Plexus.  imprints 4, inferred.

## Appendix B. Recount commands

Counts above are read off the files, not typed into them. Run from the repository root.

    awk '/^# 46\./,/^# 47\./' ATUNED-onboarding-first-experience-TDD.md | grep -cE '^[a-z_]+$'
                    the events in section 46
    awk '/^# 7\./,/^# 8\./'   ATUNED-onboarding-first-experience-TDD.md | grep -cE '^[A-Z_]+$'
                    the states in section 7
    awk '/^# 45\./,/^# 46\./' ATUNED-onboarding-first-experience-TDD.md | grep -cE '^  [a-z_]+:'
                    the fields of the screen schema
    awk '/^# 40\./,/^# 41\./' ATUNED-onboarding-first-experience-TDD.md | grep -cE '^RELEASE_'
                    the release states
    awk '/^## 14. Analytics/,/^Primary/' ATUNED-funnel-to-software-journey-TDD-v1.md | grep -cE '^[A-Z_]+$'
                    the events in the funnel TDD
    sed -n '/^### d1/,/^### d2/p' ATUNED-onboarding-REVIEW-2-systems.md | grep -oE '\| (DERIVABLE|PARTIAL|MISSING) \|' | sort | uniq -c
                    the tallies in the event table of section d1

At the stamp the first four read 31, 18, 15 and 6, the fifth reads 24, and the sixth reads 3
derivable, 9 partial and 19 missing.
