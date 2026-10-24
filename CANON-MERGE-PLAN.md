# The canon merge, phase two

Systems seat, 24 October 2026. Branch `canon-merge-phase2`, cut from `atuned/mvp-alpha-recursive-execution` at `607bb0ee`. Three code commits, `b0a5b124`, `386eddf5` and `22be39c8`, then this file. Nothing is pushed.

canon.json is the owner's register file, SOURCE OS CANON 1.0.0, issued 8 September, kept in reboot-os at `atuned/data/canon.json`. A register is one of its tables: the nodes, the saboteurs, the laws and so on. This repository is now the one source of truth, and canon.json is an input to it: a pinned copy is held at `vendor/reboot-os/canon.json`, and every merge from now on is a named difference against that copy.

Every number below was read off a run on 24 October at `22be39c8`, mostly by `node tools/canon-port.js report`, which reads the file and the engine on the day it is run. Run it again rather than trusting a figure here.

## His three questions, answered for what this round touched

The owner's words, repeated on 24 October: "does everything have a record, is everything in a templated format, is the description from parent to children clear".

- **Does everything have a record?** Every top level part of canon.json now has a row in `REG_MAP` (`atuned_src/engine/registers.js`) saying where it lives in this repository: ported here, held here in this repository's own version, or held out of the product and why. On 24 October that is 18 registers and 7 other sections. The gate fails if the vendored file has a part the map does not place, so a register reboot-os adds later is a named failure on the next merge and never a silent gap.
- **Is everything in a templated format?** The seven ported registers have one template each, and `codesCheck()` holds every row to it: the fields it must carry, of the right kind, with codes that run without a gap. Two places where canon.json breaks its own template are kept as written and held by name, so neither is hidden and neither is rewritten without him: the Dermis row of the organs, whose fourth field is a note where every other organ has a sentence the pattern says in the first person, and four words canon.json puts on two ladders each.
- **Is the description from parent to children clear?** Every ported row names its parent, and the gate holds each link to something this repository holds. A ladder's charge reads as a child emotion, or is refused by a row that says why. A word on a ladder is its ladder and its step. An amplifier stands on a body address. A route runs from a ladder's charge to a body quadrant. A derived measure names its charge and the law it is. The astrology overlay keys only signs, animals and archetypes that have codes, or that are refused by a row that says why.

For the registers this repository already had its own version of, the answer is no, and the decisions at the end are the reason.

## What the reboot line holds, measured this round

The local reboot-os clone tracks only `main`, at `242e995` from 19 October. A scratch clone fetched all 80 of its branches on 24 October. Nothing in either repository's own checkout was written.

- **canon.json is one file everywhere.** Every one of the 80 branches carries the identical canon.json, md5 `7e844c0d`, but one: `claude/keen-brahmagupta-qt32zr`, the manuscript line, which has none. So the registers ported here are current on every line of reboot-os.
- **The look development line is `claude/app-migration-decision-yx56cj`.** It shares no history with reboot-os `main`. It was last written today, 24 October, with 115 commits on 23 October alone, and it holds `lookdev/`: design notes, a status file, 29 built pages and 29 patches against this repository's source (`lookdev/handoff/builds/`, 28 `.patch` files and one `.diff`). They cover the ritual page (four versions), the journal (four rounds and a regression fix), the Field cleanup, the Field and Body pole bars, the compass gauge, nav bar B, the side menu polarity meter, an SAB33 rename, a CQ, DQ and expression fix, and a knowledge restore. Some add files this repository has never had, such as `ui/ritplan.js`, `ui/journal.js`, `engine/data/harmdef.js` and `engine/kbdef.js`.
- **Most of those patches cannot be applied as they are.** Each was dry run against this branch, forward and in reverse. Three apply cleanly today: `SIDE_MENU_POLARITY_METER_e7d97be.patch`, `field_pole_horizontal_41d1e97.patch` and `SPEC-source-ai_20261023.patch`. The other 26 neither apply nor are already here. Git writes into a patch the version of every file it was cut against, and reading those: 7 of the 26 were cut against file versions this repository's history holds (the ritual page's first three rounds, the combined merge and both SAB33 patches among them, cut from this repository as it stood on or after 16 and 17 October), so each can be applied to that version and carried forward as a branch. 12 were cut partly or wholly on top of earlier look development patches, against file versions no repository holds. 7 carry no version marks at all. The hashes in the patch files' names, such as `cdd54067`, are commits in neither repository, on GitHub or locally. The thread's coordination note, dated 16 October, says "Lance has ruled that nothing is ported until he says so", and that the port would come "as one pull request from a branch".
- **The manuscript line, `claude/keen-brahmagupta-qt32zr`, is the book.** It holds the book's versions up to v342 and dictation notes. It is content for the book and has no app code to merge.
- **This repository has two lines of its own.** On 24 October, `origin/main` carries 118 commits that `607bb0ee` does not, and `607bb0ee` carries 162 that `origin/main` does not. MOB's own `lookdev/mvp-alpha-checklist-2026-10-22` adds documents and a psychological registry audit tool (20 files). Reconciling `main` with this line is the devops seat's, and it has to happen before any merge lands on `main`.

None of the look development work was merged this round. It is design and interface, it needs a reachable base to merge as a branch, and it needs the interface gates and the owner's eye on every screen it changes. It is the largest body of new code on the reboot side, and phase three below is written for it.

## Findings that build on the audit

The audit of 23 October (the schema, graph and index lane, findings SG-01 to SG-18) was re-checked at `607bb0ee` first. Nothing in the engine's data, the codes or the trace graph had changed since; the only changes were in the inference layer of `compute.js`. Every register measurement it made reads the same on 24 October, and the port tool now makes each of them repeatable. New this round:

1. **Four of the seven "safe" registers are blocked in canon.json itself.** Its own open rulings say so in their `blocks` fields. Ruling 1, the nine base emotions ("Three incompatible rosters. Surprise against Shock unresolved."), blocks the ladders. Ruling 2 blocks the charge routing, and calls it "Defect, not a finding." Ruling 5, "Justification has no node", blocks the amplifiers. Ruling 9, "Awareness and Flow. Rebuild from non-instrument inputs or drop.", blocks the derived measures. All four were ported anyway, so the record is whole, each with its ruling quoted beside it, and nothing reads any of them.
2. **One canon.json description cannot ship as written.** Its derived measure Awareness is "Element 32, a Law of Spiritual Integrity, and a scored diagnostic set." The claims gate (`tests/claims.js`, the medical rule in `marketing/refuse.js`) refuses the word in anything that ships, and `engine.js` ships inside the quiz page, where every string is read. Rewording his sentence is not a seat's to do, so none of the three descriptions is carried into the product. They stay in the vendored file, quoted here.
3. **Vitality has three definitions.** This repository's reading is `r.X` in `compute()`: three tenths of how far Apathy is from full, plus seven tenths of how far DQ is from 14, on a scale of nought to one. canon.json's formula section gives `10 - SQ`. Its derived measure says "Coherent opposite of the Apathy/Joy axis, addressed at the fascia between solar and heart. Also the vitality component of PQ." And PQ is a round label in this repository, round PQ of 2 October, not a quotient, so the one word means two unrelated things.
4. **Four amplifiers carry their address's name, and two do not.** Obsession, Judgment, Perfectionism and Comparison are named as their addresses are, 29, 37, 40 and 69. Entitlement stands on address 8, which `NODES` (the table of the 112 addresses) holds unnamed as `Root_08_Unnamed`, while `NODES`'s own Entitlement is address 38. Justification is inferred at address 34, which both `NODES` and canon.json's own nodes register name Arrogance. The nerve canon.json gives each amplifier is the nerve `NODES` holds at that address in all six cases.
5. **Some intensity words sit on two ladders.** canon.json's ladders give each charge nine words, mildest first. 72 words, 68 different. Horrified is the sixth disgust word and the sixth fear word. Annoyed, Aggravated and Wrathful are on the anger ladder and again on the resent ladder. So a word cannot be the name of one thing, and the codes give a word its ladder and its step instead.
6. **The ladders agree with the lexicon almost everywhere.** 7 of the words are in `C3_LADDER`, the 3C card spec's one intensity ladder across every charge, and none is in another order there. 27 are in the lexicon, the table that weighs a story's words, and its weight rises with the step in every case but one: Heartbroken, the seventh sadness word, weighs 26, and Depressed, the eighth, weighs 22. Nothing was changed, since a weight in the lexicon moves readings.
7. **canon.json's own rulings already have answers here, one whole and one half.** Ruling 3, "Whether a saboteur fires at a band or above a floor", is answered in `SAB33`'s header: "A range is a BAND, not a floor". That answer belongs in canon.json. Ruling 10, coherent opposite against replacement state, is half answered: the glossary a person reads defines "Replacement state", while one drill line still prints "The coherent opposite installed past the point where it serves" (`ui/drills.js`) and the code's comments say coherent opposite throughout. The move to one word is narrative's to finish once he confirms which.
8. **The release rebound.** canon.json's time axis says "Any product that runs a release MUST warn about the rebound before the release", and its contraindications repeat it. On 27 September, round IG, the owner struck the rebound and completion days from the release results screen (`ui/release.js`). Whether a warning before a release still exists is the release seat's to check, and the two rules have to be squared by him.

## Strategy

- **One source of truth, and canon.json is an input to it.** Nothing here reads reboot-os at run time. The copy merged against is vendored and pinned by md5, and CODE_SOURCES (the table of where every label comes from) cites that md5. A newer canon.json is merged by running the port tool against it, reading the differences it names, and committing the new copy, its md5 and the changed rows together.
- **Identity first, then data, then content, then interface.** Codes come before tables, tables before what a reading prints, and what a reading prints before the screens that draw it. A screen built on a table whose content is still in dispute would have to be rebuilt after the ruling.
- **Nothing ported moves a number until he rules.** Every ported table is inert, and the gate proves it on every run by scrambling them all and finding `compute()` unchanged.
- **His words are carried as written.** Where canon.json breaks its own template, or breaks a house rule, the row is kept or withheld whole, held by name, and put to him. It is never quietly reworded.
- **Identity never moves.** No stored number or name is renumbered by a merge. Where canon.json numbers or names a thing otherwise, the other number or name becomes a row in the codes' alias table, and every record still resolves.

## Tactics, register by register

| canon.json part | Where it lives here | This round | Next | Blocked by |
|---|---|---|---|---|
| ladders | `CHARGE_LADDER` | ported, coded LD01 to LD08, words by rule | his ruling on the roster | its ruling 1 |
| amplifiers | `AMPLIFIER` | ported, coded AM01 to AM06, nerve read off `NODES` | place Justification | its ruling 5 |
| quadrants | `BODY_QUADRANT` | ported, coded BQ01 to BQ04 | a surface, once the routing is ruled | ruling 2, for any use |
| organs | `ORGAN` | ported, coded OG01 to OG10, Dermis held | his word on the Dermis row | none to hold it |
| charge_routing | `CHARGE_QUADRANT` | ported | his eight decisions | its ruling 2 |
| derived_measures | `DERIVED_MEASURE` | names, charges and laws ported, coded DM01 to DM03; descriptions withheld | keep, rebuild or drop | its ruling 9, and the claims rule |
| astrology_overlay | `ASTRO_OVERLAY` | ported, signs coded ZS01 to ZS12 and animals CA01 to CA12 | none: display only by its lock | none |
| nodes | `NODES` | measured | D1 and D2 | his call |
| fetters | `CHILD` | measured | D2 | his call, its ruling 1 |
| saboteurs | `SAB33`, `SABDEF` | measured | D3 | his call |
| complexes, hyper_complexes | `CODE_STRUCT`, `HCX_LIB` | measured | D4 | his call, its rulings 4 and 6 |
| archetypes | `ARCH18` | measured | D5 | his call, its rulings 6 and 7 |
| jungian | `ARCH` | measured | D6 | his call |
| masks | `MASKS` | measured | D7 | his call |
| domains | `DOMAINS`, `DOMDEF` | measured | D8 | his call, its ruling 8 |
| laws | `SI`, `HARM` | measured | D9 | his call |
| axes | `VERP`, the six gates | placed | aliases, no ruling needed | none |
| formula | `compute()`, `TIERDEF` | placed | D10 | his call, its ruling 11 |
| locks | held where each is enforced | placed | see D3 and D4 | his call |
| meta | `CODE_SOURCES` | pinned by md5 | none | none |
| time_axis, contraindications | held out of the product | placed | the release seat checks the rebound warning | his call |
| evidence, open_rulings | held out of the product | placed; the rulings are quoted here | none | none |

## What was executed

**Commit `b0a5b124`, the port.**

- `vendor/reboot-os/canon.json`, byte for byte the reboot-os file, md5 `7e844c0d21489b87ab604cf262a30e62`.
- `atuned_src/engine/data/registers.js`, the seven tables. Every word, number and order is canon.json's. Two things are added: a name for each field where canon.json has only a position, which is this port's reading of each position, checked against every row; and a code in each row. Two things are not carried: the amplifiers' nerve, which `NODES` already holds, and the derived measures' descriptions, for the reason in finding 2.
- `atuned_src/engine/registers.js`: `REG_MAP`; `regDiff(canon)`, which names every row where a canon.json differs from the ported tables, matched by key and never by position, and never throws; and `ladderPlaces(word)`, which names every ladder and step a word sits on.
- `tools/canon-port.js`, the merge made repeatable: `check` runs `regDiff` against a newer file, `emit` writes the rows in the table's own shape with every code kept, `map` places every part of the file, and `report` measures the disagreements behind the decisions below.
- The engine gate's new group `RG`. It holds the vendored copy to the md5 CODE_SOURCES cites, and every ported table to the file row for row, after showing that `regDiff` catches each of thirteen planted changes. It holds the map to every part of the file both ways, and every table in the data file to exactly what the port tool writes, so the generator and the file cannot drift. It holds `compute()` unchanged across 82 fields with every ported table scrambled, after showing on `SAB33` that the harness sees a change, and it holds the astrology overlay to its lock on its own. The two held template exceptions are held by name.

**Commit `386eddf5`, the codes.**

- Seven new kinds of code with an eighth composed by rule: charge ladder, ladder word, amplifier, body quadrant, organ, derived measure, sign and animal. The index lists 336 codes across 15 kinds, up from 281 across 8. A word on a ladder is never listed, because some words sit on two ladders. It is its ladder and its step, `LD05.6`.
- One behaviour changed on purpose: Judgment, Obsession, Perfectionism, Comparison and Entitlement are now refused as ambiguous until the caller names the kind, because each now names an address and an amplifier. Entitlement is the sharpest case: the name is address 38 here, while the amplifier stands on address 8, so a door that picked for the caller would hang the amplifier's content on the wrong address. Nothing calls the codes door yet but the gate.
- `codesCheck()` holds every new table to its template and every row to its parent: a ladder's charge, an amplifier's address, a quadrant's side and face, every route, a measure's law, every overlay key, the sign codes to the index `astro.js` counts the sun in, and the animal codes to `CHINESE` by year. The new group `RC` shows each of eighteen checks catching one planted defect, freezes the 55 codes the registers were born with, and holds the sign and animal codes to what the birth reading actually prints.

**Commit `22be39c8`, one check named once.** `codesCheck()` read the ladder table's shape twice, so an empty table was reported twice. Found on a review of the codes commit, fixed, and held by a check that fails on the engine from before it.

**Verification.**

- Known bad first. The engine gate was run against five engines that should fail, and each did: the engine from before the port (both new groups fail), a planted typo in a ladder (six checks fail), two sign codes swapped (six fail), a planted leak of the overlay into `compute()` (the scrambled-table check and the lock check fail on all 82 fields), and the engine from before `22be39c8` (its one new check fails). The leak case found a flaw in its own first plant, which edited a quoted copy of the line and not the line itself, and was rebuilt before it was trusted.
- Both build scripts, `funnel/BUILD-single.sh`, and `tools/products.js` after each commit: every product matches its source byte for byte. No product was edited by hand. Against `607bb0ee`, the build grows by 37,536 bytes in `source.html`, 37,401 in `engine.js` and in the quiz page that inlines it, and 10,560 in the packed file.
- `tools/equiv.py` against the `607bb0ee` build: 13 new declarations (the seven tables, `REG_MAP`, the new module's three functions, `CODE_SIGN` and `CODE_ANIMAL`) and 6 changed bodies, all in the codes layer. Nothing else in the build moved.
- The engine gate at `22be39c8` reads 6247 passed, 0 failed, 10 expected red, against 6147 at `607bb0ee`. The claims gate has 0 findings, the voice gate's sweep of his objections is unchanged, the percent gate passes, and the engine is host free. Every gate `tests/floors.json` names, 47 runs in all with the render watch and the orphan check, ran at `386eddf5` and every one exited clean, `functional` at 2676 passed and `golden` at 146 with its one expected red; the funnel package passed 44 of 44. `22be39c8` changes one line of `codesCheck()`, which no screen calls, and was run through the engine, products, claims, percent and objections gates. `tools/floors.js` over those logs fails one gate that this branch did not touch: `sniffpage` passes 80 against a floor of 61, and it passes 80 at `607bb0ee` too, so the floor was left behind by the sniffer commits this branch was cut after. It is the sniffer seat's one-line raise.
- The next merge, rehearsed on a planted canon.json 1.1.0 with one ladder word changed, one organ added and one new register: `check` named the word and the organ and exited 1, `map` named the new register as not placed and exited 1, and `emit organs` kept OG01 to OG10 and gave the new organ OG11.
- No em dash in any added line, in any commit message, or in any built product.
- Coverage of the new engine code under the engine gate: `regDiffInto` and `ladderPlaces` run in full. The branches of the new checks that never run are the guards for a missing table.

## How to run the next merge

1. Copy the new canon.json over `vendor/reboot-os/canon.json`, and run `./atuned_src/BUILD-engine.sh`.
2. `node tools/canon-port.js map`: any part the file has that the map does not place is printed first, and the map needs a row for it.
3. `node tools/canon-port.js check`: every ported row that changed is named, register by register.
4. `node tools/canon-port.js emit <register>` for each register it names, pasted over that table. Every code is kept, and a new row takes the next one.
5. Replace the md5 in CODE_SOURCES's canon row, run `node tools/canon-port.js report` to see what moved in the registers this repository holds its own version of, and run the gates.

## Decisions for the owner

Each is what disagrees, what each answer costs, and the systems seat's recommendation. None of them blocks what was built this round, since everything ported is inert until he rules. If one question reaches him, it is D13, because it is the one that blocks the most new code.

**D1. The four field nodes are numbered two ways.** canon.json and the book number them 109 Gaia Gateway, 110 Earth Star, 111 Soul Star and 112 Stellar Gateway. This repository's `NODES` and the reboot-os app's `NODEREG` number them 109 Sol Star (Soul Star there), 110 Stellar Gateway, 111 Earth Star and 112 Gaia Gateway. reboot-os's `nodes_112.json` agrees with them at 109 to 111 and puts PARAM SHIVA at 112. All four sit at another number in canon.json.
- Keep this repository's numbers. Costs nothing here; canon.json and the book are corrected, or their order is called display order. The codes already translate canon.json's numbers.
- Take canon.json's. Every stored record that holds a field node needs a migration, because an address number is identity.
- **Recommendation: keep this repository's.** A stored number never moves, and every other source agrees with it at 109 to 111. Sol Star against Soul Star is a spelling, and narrative's. Whether PARAM SHIVA is Gaia Gateway is the one question left in the numbering.

**D2. Which charge is at each address, and which nine are the child emotions.** canon.json's charges, run through this repository's one rule for an address's child emotion, give another child emotion at 46 of the 108 body addresses, for example address 4, Control, anger there and fear here. canon.json's own ruling 1 says three rosters of the base emotions disagree. Its fetters register and `CHILD` agree on the nine names. Its ladders and routing key eight other labels, joy and resent among them, which are not child emotions, and have no ladder for apathy, surprise or anticipation.
- Keep this repository's node map, and keep the eight labels as a second vocabulary that `REROUTE` (the table that sends a charge label to a child emotion) bridges. Costs nothing.
- Take canon.json's charges. Readings move at 46 addresses for every person, and the inferred saboteurs change with them.
- **Recommendation: keep this repository's**, since every reading, persona and simulation is calibrated on it, and write the nine child emotions into canon.json as its one roster. Then ask whether the ladders are re-keyed to the nine, which means three new ladders.

**D3. Saboteur charge bands.** Of 33 rows matched by code, 17 are the same, 4 differ only by spelling (joy or resent where this repository says apathy or anger), and 12 differ in a number or a charge: Avoider, Victim, Pleaser, Hyper-Achiever, Hyper-Rational, Restless, Judge, Aggressor, Martyr, Manipulator, Control Freak and Negotiator.
- Keep `SAB33`. It was ported on 20 September, twelve days after canon.json was issued, from `SNIFFER_SPEC.md` section 3, which its header says "the owner rules is canon and not a proposal".
- Take canon.json's. Readings move for most people.
- **Recommendation: keep `SAB33`**, and write its rows and its band rule back into canon.json, which also answers canon.json's ruling 3.

**D4. Complexes and hyper-complexes.** 11 of canon.json's 23 complexes put their saboteurs in two or three of this repository's families, and `compute()` only ever pairs two saboteurs of one family, so it can never make them. Five of the 11 are ruled by him: Superiority-Persecution, Oscillation, Attention Seeking, Threat Scanning and Scatter. Of the 8 hyper-complexes, by the family arithmetic here, 1 is a hyper complex, 5 land a rung higher as a super complex, and 2 fit no rung.
- Re-ground the families so his ruled complexes become reachable. Readings move.
- Keep both, the pair `compute()` makes and canon.json's named structure, joined by a table of which saboteurs belong to which named structure. A reading could then name his structure when its members fire. Additive, and nothing moves.
- **Recommendation: keep both, joined.** The codes already keep them apart, pair codes against X codes. What a reading prints is the ai-director's.

**D5. Archetype pairings.** canon.json gives each of its 19 archetypes two saboteurs and two seats. `ARCH18` gives each of its 18 one saboteur and one seat. Of the 17 both carry, `ARCH18`'s saboteur is neither of canon.json's two for 12, and its seat is neither of canon.json's two for 4. canon.json's saboteur columns also hold labels that are not saboteurs here: Rebel, Rescuer, Saboteur.
- Keep `ARCH18`.
- Take canon.json's two-and-two shape as a second column. Additive. The Analytics card and the Avatar page, which print a primary saboteur, would need their wording changed.
- **Recommendation: take the two-and-two shape when he rules**, since it carries more, after canon.json's rulings 6 and 7 settle what Rebel, Rescuer and Saboteur are.

**D6. The jungian twelve.** canon.json's twelve have Orphan, Outlaw and Caretaker where `ARCH` has Everyman, Rebel and Caregiver. `ARCH`'s order and names are stored on every record (`p.soul.arcs`, `p.avatar.arch`). canon.json disagrees with itself here: its jungian register uses Orphan and Outlaw in place of Everyman and Rebel, while its archetypes register carries all four as different archetypes.
- One archetype each: Orphan is Everyman and Outlaw is Rebel. Two alias rows, no migration, and the display names are his to pick.
- Two each: the roster is more than twelve, which is the open count question in `SNIFFER_SPEC.md` section 4.
- **Recommendation: one each.** Both lists follow Carol Pearson's archetypes, as `ARCH_CREDIT` says of this repository's: in her later book with Margaret Mark, the Orphan's place is taken by the Everyman, and the Outlaw is also called the Rebel. Caretaker is already Caregiver in the codes.

**D7. Masks.** canon.json: Child, Preteen, Teen, Professional, Religious or Moral, Relational, one seat each. `MASKS`: Child, Preteen, Teen, Adult, Professional, Ideological, on one or two seats each. 4 of 6 share a name. canon.json's Religious or Moral mask is "Values held as position rather than practice", and the Ideological mask here "answers from the position instead of the moment", which is the same idea.
- **Recommendation:** make Ideological and Religious or Moral one mask under two names, and ask only Adult against Relational, which are different ideas, and the seats.

**D8. Domains.** canon.json has 18 in four families. `DOMAINS` has the same 18 plus Provision. `DOMDEF`, the knowledge page's table, names four of them otherwise, bridged for one reader by `KB_RENAME`: Descent is Sacrifice, Connection is Love, Exchange is Communication, Restoration is Healing. canon.json's ruling 8 counts 18 in the book, 15 in the compilation and 14 in the blueprint file. `p.soul.doms` stores a position in `DOMAINS`, and that order is not frozen yet (audit SG-04).
- **Recommendation:** freeze the order first, then keep `DOMAINS`' names, which are canon.json's, with `DOMDEF`'s four as aliases. Ask only whether Provision stays. It is the fourteenth of nineteen, so dropping it moves every record that holds it or any of the five after it, Play to Guardian.

**D9. Laws.** canon.json numbers 59 laws in four groups, `HARM` carries 76 in seven, and the instrument measures 21 (`SI`). Number for number, 56 are named alike and 3 otherwise: 40 is Ownership there and Accountability here, 43 is Wisdom there and Responsibility here, and 57 is "Love (Expression)" there and Love here. So of the 21 measured, canon.json has no law named Accountability or Responsibility. canon.json calls the 21 the Laws of Spiritual Integrity, where this repository says Moral Integrity, his 15 October correction. The record boundary now carries an answer across a rename safely (SG-01, merged), so either answer is buildable.
- Keep this repository's names, and correct canon.json and the newsletter.
- Take Ownership and Wisdom. Every stored answer moves through `LAW_WAS`, the old-names table, and every intake question and table keyed by law name changes with it. Wisdom is also `HARM`'s E72, so `HARM` would carry two.
- **Recommendation: keep this repository's**, since both names are measured and stored today, and Wisdom at 43 collides with `HARM`'s own Wisdom. But the names of the laws are the content of his framework, so this one is his.

**D10. What CQ is.** canon.json: CQ is the square root of Intention times Integrity, times ten, over one plus a fifth of SQ over ten plus two fifths of Distortion over ten, in seven bands from Mastery down to Collapsed, malignant below 50. Here, by his rulings of 25 September and 22 October: CQ is the 21 laws summed out of 210, "CQ stays pure", in ten bands (`TIERDEF`), and the formula runs as the shape of Expression. canon.json's formula is close to model 3, which was live here briefly and was reverted on 22 October.
- **Recommendation: keep his 22 October ruling, the latest**, and correct canon.json's formula section to say the formula is Expression. Flagged to the ai-director.

**D11. The four ported registers canon.json itself blocks.**
- Ladders, ruling 1: keep the eight, or re-key to the nine child emotions (D2).
- Charge routing, ruling 2: his eight front and back decisions. canon.json calls the current table a defect.
- Amplifiers, ruling 5: is address 34 Justification's? If it is, does 34 keep the name Arrogance?
- Derived measures, ruling 9: Awareness and Flow are already laws, `HARM`'s E32 and E54, and Vitality is already a reading here.
- **Recommendation:** drop Awareness and Flow as derived measures, since they are measured as laws, and keep Vitality as the reading this repository makes (finding 3). If they stay, the Awareness description has to lose the word the claims rules refuse before it can ship. Until he rules, nothing reads any of the four.

**D12. The organ row that breaks its template.** Dermis's fourth field is "Overflow system. Psoriasis, stress acne.", a note, where every other organ has the sentence the pattern says, such as the Heart's "If I open, I will be hurt again." The symptom fields of the quadrants and organs are body correspondences. They are kept inside the engine as its other clinical correspondences are, and may not be printed at a person without the claims boundary.
- **Recommendation:** he gives Dermis a sentence in the first person, and the note moves to its issue field.

**D13. The look development patches.** 29 patches against this repository's source sit in reboot-os's look development line. 3 apply here today, 7 more can be applied to the file versions they were cut against and carried forward, and 19 were cut on top of earlier look development work, or carry no version marks, so no repository holds what they apply to.
- The look development thread pushes the branch its patches were cut from, to this repository, and each round merges as a branch, through every gate, with the owner's eye on each screen. Nothing is redone.
- Re-apply them here by hand, patch by patch, re-testing each. Slow, and each hand port can drift from the design he approved.
- **Recommendation: the first.** It is the one thing that has to happen before most of the new code on the reboot side can reach this repository at all, and it is a request to the look development thread rather than a ruling.

## Phase three, proposed

1. The look development thread pushes its working branch to this repository. Devops reconciles this repository's `main` with `atuned/mvp-alpha-recursive-execution` first, so there is one base to merge onto.
2. The three patches that apply today go first, each through the interface gates and his eye: the side menu polarity meter, the horizontal Field pole and the Source AI spec.
3. Then the engine-side patches (the SAB33 rename, the CQ, DQ and expression fix, the knowledge restore, `harmdef.js` and `kbdef.js`), each held to `tools/equiv.py`, because they change what readings say. Then the interface rounds in the order he approved them.
4. As he rules on D1 to D12, each ruling is one table change, and the codes keep every stored record resolving.
