# Site map. Where every surface and every engine table actually lives

Read off the code at commit `fb09a7d` on 20 November 2026, clean tree. Every
line number below is from that commit. Line numbers move with every build, so
re-grep the name rather than trust the number once this file is a week old.
Every count below was read off the array on that day, and is dated for that
reason: read the count off the code, the way `CLAUDE.md` rules.

The general index of documents is `DOCS-INDEX.md`. This file is the code.

Three ways to use this file:

- "Which file draws tab X?" Part 1.
- "Which table answers question Y?" Part 3, and read its traps list first.
- "Does a paragraph in CLAUDE.md still match the code?" Part 4.

---

## Part 1. The product: tabs, hosts, renderers

### 1.1 Identity versus display order

| Thing | Where | What it is |
|---|---|---|
| `TAB` | `atuned_src/engine/core.js:133` | The integers. Identity, persisted and compared. Never renumbered. |
| `SECTIONS` | `core.js:280-296` | The nav sections: `discover`, `play`, `flow`, `embody`, plus `practitioner`, shown only when `CURP.ui.mode==='practitioner'`. |
| `TABDEF` | `core.js:297-431` | Display order of the bar. Reorder freely. Look an entry up by `.k`, never by position. |
| `SECOF()` | `core.js:446-448` | Section of a tab, read from each entry's `.sec`. This is the section logic. |
| `TABEXTRA` | `core.js:453` | Surfaces with no door on the bar. |
| `TABFOLD` | `core.js:496` | A tab whose surface is drawn inside another tab. |
| `TABHOME` | `core.js:520` | `TAB.STORY`. The app opens on Discover. |
| `WANT` | `ui/panels.js:371-388` | NOT section logic. A private per tab map of which rail accordions auto open. Easy to confuse with `SECOF`. |

### 1.2 The TAB integers

| Constant | Int | Constant | Int | Constant | Int |
|---|---|---|---|---|---|
| STORY | 0 | INTAKE | 5 | RITUAL | 10 |
| SUMMARY | 1 | KNOW | 6 | MASKS | 11 |
| FIELD | 2 | GAMES | 7 | PRACTITIONER | 12 |
| ENERGY | 3 | COMPASS | 8 | QUESTIONS | 13 |
| ANALYTICS | 4 | SETTINGS | 9 | ACCOUNT | 14 |

### 1.3 On the bar: `TABDEF`, in display order

`TABDEF` carried 11 entries on 20 November. Re-count with
`sed -n '/^const TABDEF/,/^];/p' atuned_src/engine/core.js | grep -c "{k:TAB\."`.

| Int | Host id | Name a person reads | Section | `core.js` line | Renderer | Key engine dependencies |
|---|---|---|---|---|---|---|
| STORY 0 | `#story` | Discover | discover | 303 | `ui/storyui.js` `stRender()` :415, the largest UI file | `compute()` `engine/compute.js:351`; `parseStory()` `engine/sniff.js:1022`; `engine/undo.js`; data `affirm.js`, `cards.js`, `compass.js`, `crisis.js`, `gloss.js`, `people.js` |
| FIELD 2 | `#cv` (one canvas) | Field | play | 308 | Three files on one canvas: `ui/wheel.js` `enterStart()` :998, `ui/fieldbar.js` `fbEnter()` :449, `ui/rings.js` `fviewOn()` :84 and `ringsDraw` | `compute()`; `engine/archexpr.js`; data `figure.js`, `compass.js`, `nodes.js` |
| ENERGY 3 | `#emap` | Body | play | 318 | `ui/map.js` `renderMap()` :345 | `compute()`; `engine/charfield.js`; data `figure.js` (`ANAT`), `nerves.js` |
| COMPASS 8 | `#cone` | Path | play | 325 | `ui/cone.js` `coneOpen()` :3102 | `compute()`; `engine/archexpr.js`, `archseed.js`; data `compass.js` (four separate depth tables, see 3.1), `figure.js`, `registers.js`, `people.js` |
| INTAKE 5 | `#iq` holding `#avbody`, `#iqbody` | Avatar | play | 364 | `ui/avatarui.js` `renderAvatar()` :1867, `avRefresh()` :1933; laws by hand through `ui/intakeui.js` `renderIntake()` :1357 | `compute()`; `parseStory()`; `engine/intake.js`, `intakemore.js`, `numerology.js`; data `intakemore.js`, `gloss.js`, `nodes.js` |
| RITUAL 10 | `#rit` | Ritual | flow | 392 | `ui/ritual.js` `ritOpen()` :159, with `ui/ritstage.js`, `ui/ritcal.js`, and `ui/accountability.js` `acctSideHtml()` :337 drawn as its right column (`ritual.js:1581`) | `engine/practice.js`, `ritex.js`; data `practice.js` (`PRACTICE` :18, `TEACHER_PRACTICE` :137), `teachers_recipes.js`, `affirm.js`, `cards.js` |
| KNOW 6 | `#know` holding `#knowbody` | Wisdom school | embody | 402 | `ui/knowledge.js` `kbRender()` :495 | data `kb.js` (`SABDEF`, `DOMDEF`, `KB_RENAME`), `canon.js`, `gloss.js`, `nodes.js` |
| SUMMARY 1 | `#sum` holding `#sumbody` | Summary | embody | 411 | `ui/summary.js` `sumRender()` :687 | `compute()`; `engine/insight.js`, `read.js`, `trace.js`, `tracesummary.js`, `numerology.js`; data `people.js` |
| QUESTIONS 13 | `#iqp` | Intake | embody | 419 | Borrows `ui/intakeui.js` `renderIntake()` :1357. `#iqbody` is physically moved from the Avatar into `#iqp` first, `ui/panels.js:396-403` | `engine/intake.js`, `intakemore.js`; data `intakemore.js` |
| ANALYTICS 4 | `#ana` (inside `#sum`) | Analytics | embody | 424 | `ui/analytics.js` `anaRender()` :94 | `compute()`; `archExpr`; `engine/numerology.js`; data `nodes.js`, `gloss.js` |
| PRACTITIONER 12 | `#prac` | Clients | practitioner | 431 | `ui/practitioner.js` `renderPrac()` :990 | `compute()`; `ui/personas.js` `loadP()` :969; `engine/profiles.js`; data `people.js`, `nodes.js` |

Two names that collide: TAB.INTAKE (5) is the Avatar, and TAB.QUESTIONS (13)
is the tab a person reads as "Intake". Two integers, one borrowed renderer.

Two renames where only the readable name moved: Compass to Path (17
November) and Knowledge base to Wisdom school (18 November). The integer, the
id, the class and the file keep their old spelling.

### 1.4 Off the bar

| Int | Host id | Name | Mechanism | `core.js` line | Renderer | State |
|---|---|---|---|---|---|---|
| SETTINGS 9 | `#settings` | Settings | `TABEXTRA`, no `.sec` | 454 | `ui/account.js` `renderAccount()` :658 | Reached only from the profile button, on purpose |
| GAMES 7 | `#games` | Games | `TABEXTRA`, not in `TABFOLD` | 455 | `ui/games.js` `gmRender()` :129 | Hidden for now; not folded into Knowledge (`core.js:440-442`) |
| MASKS 11 | `#masksview` | Character | `TABEXTRA`, `held:'play'` | 474 | `ui/character.js` `renderCharacter()` :559 | Held 17 November. A held tab is never remembered as the reopen tab (`tabKeepable`, `ui/panels.js`) |
| ACCOUNT 14 | none | Accountability | `TABFOLD[TAB.ACCOUNT]=TAB.RITUAL` | 497 | `acctSideHtml()` in Ritual's right column | Folded onto Ritual. `TABREAL()` resolves a stored ACCOUNT to RITUAL |

### 1.5 The shell

| File | What is in it |
|---|---|
| `atuned_src/shell/head.html` | `<head>`: one embedded Inter `@font-face` (base64) at line 28, then one `<style>` block to the end. All CSS, no markup, no script. |
| `atuned_src/shell/body.html` | `<body>` markup only. Onboarding, login and paid welcome sheets at the top; section buttons (`data-sec=...`) around lines 602-619; per section `tabgrp` button groups around 648-702; every stage host around 1215-1317; the message dock and live region at the tail. |
| `atuned_src/shell/guard.html` | The boot guard as one closed `<script>`, then one opened and unclosed `<script>` that every MANIFEST `.js` body is concatenated into. `BUILD.sh:65-70` injects a `window.__at('<file>')` checkpoint after each file. |
| `atuned_src/shell/foot.html` | Closes that script, then `<div id="eof" hidden data-len="BUILD_LEN">`, the truncation sentinel the guard checks. |

### 1.6 Load order: `atuned_src/MANIFEST`

Read top to bottom. It is load bearing: a var used before its declaration
throws at parse.

| Lines | What |
|---|---|
| 1-3 | `shell/head.html`, `shell/body.html`, `shell/guard.html` |
| 4-28 | `engine/data/*.js`, starting `nodes`, `figure`, `nerves`, `canon`, ending `registers`, `codes`, `safe` |
| 29-81 | `engine/*.js` logic. `core.js` is line 32, before every UI file |
| 82 | `engine/data/funnelquiz.js`, the one data file placed after the logic |
| 83-137 | `ui/*.js`. `ui/ui.js` is last at 137 |
| 138 | `shell/foot.html` |

Build products, never edited by hand: `source.html` (`atuned_src/BUILD.sh`),
`engine.js` (`atuned_src/BUILD-engine.sh`), the packed file (`tools/pack.js`,
called from `BUILD.sh`).

---

## Part 2. Tests and tools

Measured 20 November by running `node tools/orphans.js`, the repository's own
check that a gate no workflow runs is not a gate. It prints the current split
of `tests/*.js` into run by a workflow, pulled in by `require()` from one that
is, and manual. Read the numbers off that run.

| Where it runs | Defined at | What is in it |
|---|---|---|
| `gates-fast`, required, node only | `.github/workflows/deploy.yml`, around lines 156-258 | `tests/engine.js`, `anatomy.js`, `evidence.js`, `plan-selfgrant.js` (a watch on the known `pImport` self grant hole J11, it fails if the hole closes silently), `chrome-path.js`, and the five voice contracts revived 17 November (`voice-sniffer.js`, `source-voice-narrative.js`, `source-voice-charge-cycle.js`, `source-voice-intelligence.js`, `source-evidence-bus.js`, not yet reviewed by the owner). Plus the meta gates in `tools/`: `workflow-lint.py`, `discord-workflows.py`, `orphans.js`, `flakes.js`, `floors.js`, `products.js`, `gates-repeat.js --self-test`. |
| `gates-browser`, required, real Chromium | `deploy.yml`, around lines 276-313 | One leg per file: `boot`, `collide`, `funnel`, `functional`, `design`, `voice`, `golden` (as `alpha-journey`), `storage`, `firstrelease`, `journey2`, `onboarding2`, `srcintro`, `release-screen`, `avatarpurpose`, `ownbirth`, `insightread`, `insightrail`, `affirm`, `honest`, `dailyui`, `becoming`, `personas-tier`, `valuefeltui`, `record`, `examples-showonly`, `paywall`, `safepage`, `allowance`, `gift`, `money`, `releasechain`, `pct`, `loopui`. Plus `tools/monitor.js`, the render watch. |
| `gates-report`, every PR, never blocks | `deploy.yml`, around lines 397-424 | Gates waiting on consecutive greens for promotion: `copy`, `reset`, `landing`, `quit`, `sniffpage`, `srcchat`, `practitioner`, `release-percent`, `unpack`, `layer-observatory`, `recordlink`, `golden` (full walk), `valuefelt`, `claims`, `discordfeedback`, `lightmenu`, `psychepanel`, `talksilence`, `glassblue`, `srcconvo`, `menutip`, `remind`. |
| Pulled in by `require()` | mostly `tests/functional.js` and `tests/engine.js` | `addrlayer`, `anatrail`, `casing`, `daily`, `device`, `feedback`, `flowtools`, `helpstamp`, `honeststatus`, `intro`, `journey`, `locks`, `loop`, `msglog`, `net` (the stub that keeps gates off the real voice Worker), `persist`, `practice`, `protocol`, `railmenu`, `relhit`, `seed`, `sound`, `stackname`, `stfull`, `tabtips`, `trace`, `tracesummary`, `typein`, `voicefall`. |
| Manual, by allowlist | `tools/orphans.js` `MANUAL`, lines 48-78 | `tests/exampleprofiles.js`, `tests/stksay.js` (its surface was removed by the insight rail unnesting), `tests/vocab.js` (not clean yet). |
| Inside `BUILD.sh`, so in every job | `atuned_src/BUILD.sh:130,153,162` | `tools/tokens.py`, `tools/slim.py`, `tools/pack.js`. |
| Nightly only | `.github/workflows/nightly-gates.yml:12-24,62-70` | `tools/gates.js --list --json` reads the legs out of `deploy.yml` live, and every browser and report leg is repeated to catch flakes. |
| By hand, in no workflow | `tools/` | `equiv.py` (changed a data table), `shots.js` and `terms.py` (changed anything a person can see), `serve-local.sh` (local voice testing), `bootgeo.js` (nothing checks `tools/` for orphans, so this can drift silently), `canon-port.js`, `registry-dump.js`, `registry-reconcile.py`, `zonetab.py`, `stripe-setup.js`, `vocab-sweep.py`, `vocab-rules.py`, `objections.py`, `backlog.js`, `questions.js`, `records.js`, the simulations (`simulate-path.js`, `loopsim.js`, `ritualsim.js`, `flowsim.js`), the mutation testers (`insightread-mutants.js`, `golden-mutants.sh`), the capture family (`*shots*.js`, `*motion.js`, `relcapture.js`, `unpack-walk.js`, `prac-dump.js`), and `tools/reloadrace/`. |
| Not gates | `.github/workflows/` | `feedback-probe.yml`, `cloudflare-inspect.yml`, `discord-post.yml`, `whats-running-discord.yml` are operational. |

The column in `CLAUDE.md` under "Before you commit" names a small subset of
these. The workflow is the full list.

---

## Part 3. The engine's data tables

All of `atuned_src/engine/data/`. No file here may touch the host
(`hostfree.py` enforces it).

### 3.0 The traps, read these first

Each of these has either already caused a wrong finding or is shaped to.

1. **Two files are called `codes.js`.** `engine/data/codes.js` holds the code
   tables (`CODE_FAMILY`, `CODE_STRUCT`, `CODE_ALIAS`...). `engine/codes.js`
   holds the functions (`codeOf`, `codeEmotionOf` :232, `codeIndexOf`), and its
   lines 46-55 list nearly every named table in the engine in one place.
2. **The fetter an address carries is `codeEmotionOf()` in `engine/codes.js`
   :232**, documented at :30-37. The chain: `NODES[i].c` (`nodes.js`, one of
   eight node map labels) through `REROUTE` (`canon.js:357`) onto `CHILD`'s
   nine names, unless a keyword in the address's own name fires first:
   `HEARTKEY` :359, `SURPKEY` :360, `ANTKEY` :361 (all `canon.js`).
   `CHILD.seat` and `MIRROR.seat` are chakra band names (`'Root'`, `'Heart'`).
   They are not a fetter and are not this rule. Joining on `.seat` is the
   mistake that produced a wrong "Crown has zero fetters" finding.
3. **`CIRCLES`, `CASCADE`, `DESCENT` and `GOVERN` are four different
   structures in one file** (`compass.js`). `GOVERN` and `CASCADE` both have
   rows named "The Devil" and "The Demon" and mean different things. See 3.1.
4. **`GOVERN` is not a body table.** `BODY_QUADRANT` (`registers.js:104`) is.
   `registers.js:93` says so in its own words.
5. **"Hyper complex" has three rosters**: `HCX_LIB` (`nodes.js:531`, 6),
   `DESCENT` (`compass.js:581`, 8), and the `hyper_complex` rows of
   `CODE_STRUCT` (`data/codes.js:142`, `X24` to `X34`, 11). Overlapping names,
   not one list.
6. **`ARCH` (12, canonical, with icons) is not `ARCH18` (18, canon.json's
   roster)**, both in `canon.js`. `Outlaw` is `Rebel`, `Orphan` is `Everyman`,
   and `Hero`, `Mentor`, `Shadow`, `Shapeshifter`, `Healer` have no `ARCH`
   row. Tracked open in `CODE_UNMAPPED` (`data/codes.js:289-296`), patched by
   hand at `ui/avatarui.js:587` and `ui/analytics.js:664`.
7. **Four charge vocabularies, not one**: `NODES.c` (8 capitalised labels),
   `CHILD` (9, `canon.js:293`), `CODE_EMOTION` (9, a frozen copy of `CHILD`),
   `CHARGE_LADDER` (8, lowercase canon.json words, `resent` kept separate where
   `REROUTE` folds Resentment into Anger, `registers.js:58`).
8. **`CHILD` and `HARM`'s emotion family disagree on three coherent poles.**
   `CHILD` (`canon.js:293`) says Trust, Equanimity, Vitality, Joy; `HARM`
   `E60`-`E68` (`kb.js:34`) says Safety, Calm, Joy (for Apathy), Happy (for
   Sad). "Joy" is the pole of two different axes depending on the table.
9. **Two lists called expression.** `EXPR` (`practice.js:7`, 10) and `HARM`'s
   express family (`kb.js`, `E50`-`E59`, 10) share six names.
10. **Saboteurs live in five tables**: `SAB33` and `SABAUTH` (`canon.js`),
    `SAB_LIB` (`nodes.js:208`, 32 rows, `Innocent` absent), `SABDEF`
    (`kb.js`), `SABCARD` (`sabcard.js`). `SABAUTH` carries names with no
    `SAB33` row (`Bully`, `Codependent`, `Critic`, `Hero`, `Intellectualizer`,
    `Nonconformist`, `Savior`), listed in `CODE_UNMAPPED` lines 278-284.
11. **`CARDSET` is three cards, not nine axes** (`cards.js`). `AXCARD` is the
    nine, and two of them do not land on the address `CHILD` uses
    (`cards.js:212`).
12. **"Pattern" means two things.** `PATTERN96` (`patterns96.js`) is a lineage
    behaviour; `engine/trace.js`'s pattern is an imprint at one address.
13. **Retired names live on in prose.** `Rigidity` was renamed `Unbending` on 7
    November (`CODE_ALIAS`, `data/codes.js:229-230`; `nodes.js:541`).
    `compass.js:1094` still says Rigidity.

### 3.1 `compass.js`

| Table | Line | Rows | What it is | Read by |
|---|---|---|---|---|
| `MIRROR` | 77-141 | 8 (`IL DE OR PO PE TR CH RE`) | The mirror pair axes. `.seat` is a band name | `compassPoleOf` :528 and most of the Path |
| `MASTERS` | 153-180 | 11, on purpose (:167) | The ascended master roster | |
| `BLUEPRINT` | 186-190 | 4 | The Decoherent Blueprint, the DQ terminus. Not `DESCENT`, not `GOVERN` | |
| `CIRCLES` | 197-206 | 9 | Dante shaped depth ladder, one behaviour per circle | `circleAt(CQ)` :981. Above CQ 41 it returns `null` |
| `CASCADE` | 210-216 | 6 (Zombie, Drone, NPC, Energy Vampire, Demon, Devil) | Named decoherence stages | Nothing. `compass.js:542` says nothing in the build renders it |
| `IC_REUSE` | 232-233 | 16, built from `MIRROR` | Icon by behaviour word | |
| `IC_NEW` | 236-418 | 24 keys once the file has run; assignments are scattered and two read `SI` from `canon.js` (:408) | Icons, keyed by person names and behaviour words in one object | |
| `MASTER_AXIS` | 284-285 | 7 | Master to `MIRROR` axis | |
| `PATHS` | 327-346 | 5 (`FL AW BO AL HO`) | `AW`, `BO` re-read `MIRROR`'s `PE`, `IL` | `compassOffAxis()` :438 filters them out |
| `HOME_POLES` | 392-398 | 3 (`SA TU NA`) | Poles with no axis | |
| `MASTER_POLE` | 427-428 | 11 | Master to pole key. Not `MASTER_AXIS` | Prints the behaviour word |
| `POLE_MEANS` | 463-520 | 10 plus 2 aliases (:523) | Plain meaning per pole | Unpack every symbol |
| `DESCENT` | 581-878 | 8 | Clinical referral table behind the dark read | `darkRead()` :954, `descentHeld` :949, `descentStep` :942; fires only at malignancy at least 0.55 and CQ under 31 (:910) |
| `GOVERN` | 1013-1040 | 5 (Devil, Demon, Turned inward, The Storm, Angel) | A two axis organised by malignant quadrant | `quadrant()` :1045, thresholds :1041 |
| `FAM_OUT`, `FAM_IN` | 1097-1098 | 3, 5 | Outward and inward family sets | `outwardShare()` :1099 |

Only four `DESCENT` rows are tied to a live `compute()` output: `Sociopathy`
`fam:'Predatory'` :636, `Collapse` :690, `Unbending` :743, `Psychopathy`
`pair:['Grandiosity','Predatory']` :859. The other four carry no tie; the
untied fallback (:975) only ever picks `Machiavellianism` (CQ under 21) or
`Narcissism`.

### 3.2 `nodes.js`

| Table | Line | Rows | Fields and notes |
|---|---|---|---|
| `NODES` | 23 | 108 somatic plus 4 field anchors, `i` 1 upward | `i` identity, `k` name, `b` band, `n` nerve (`null` on the anchors), `a` governs, `d` distortion, `c` node map charge label (`null` on `Root_08_Unnamed` and the anchors) |
| `SAB_LIB` | 208 | 32 | `{nm, nids:[3 NODES ids], hcx}` |
| `HCX_LIB` | 531 | 6 | `Grandiosity, Predatory, Collapse, Unbending, Dysregulation, Dissociation` |

### 3.3 `codes.js` (the data file)

| Table | Line | Rows | Purpose |
|---|---|---|---|
| `CODE_SOURCES` | 102 | 6 | Provenance systems |
| `CODE_KINDS` | 110 | 19 | Kinds a code can be |
| `CODE_FAMILY` | 134 | 6 (`K1`-`K6`) | Row for row with `HCX_LIB` |
| `CODE_STRUCT` | 142 | 34 (`X01`-`X23` complex, `X24`-`X34` hyper complex) | canon.json's register |
| `CODE_ARCH` | 203 | 12 | Row for row with `ARCH` |
| `CODE_SIGN`, `CODE_ANIMAL` | 210, 217 | 12 each | Zodiac, Chinese zodiac |
| `CODE_EMOTION` | 222 | 9 | Frozen copy of `CHILD` names |
| `CODE_ALIAS` | 224 | 32 | A source's label that does resolve to a code, with why |
| `CODE_UNMAPPED` | 266 | 36 | A label that has no code, with why. The repository's own list of known confusions |
| `CODE_RETIRED` | 309 | 1 | `Superior`, retired 22 October |

`Entitlement` answers to two addresses: canon.json's is MOB address 8
(`Root_08_Unnamed`), MOB's own is 38 (`CODE_ALIAS` :249).

### 3.4 `registers.js`, ported from canon.json

| Table | Line | Rows | Note |
|---|---|---|---|
| `CHARGE_LADDER` | 58 | 8 (`LD01`-`LD08`) | Lowercase charge words |
| `AMPLIFIER` | 84 | 6 | Keyed by `NODES.i`; two names disagree with `NODES` (:78-83) |
| `BODY_QUADRANT` | 104 | 4 | Right/Left by Front/Back. Not `GOVERN` (:93) |
| `ORGAN` | 145 | 10 | |
| `CHARGE_QUADRANT` | 196 | 8 keys | Known defect; nothing may read it until he rules (:194-195) |
| `DERIVED_MEASURE` | 216 | 3 | Cites `HARM` codes `E32`, `E54` |
| `ASTRO_OVERLAY` | 233 | 12 signs, 12 animals, 12 vectors, 24 key load map | Display only, never enters a number (:226) |

### 3.5 Everything else in `engine/data/`

| File | Main tables | What it is |
|---|---|---|
| `canon.js` | `SAB33`, `SABAUTH`, `ARCH18`, `BANDS`, `PAL*`, `CHILD` :293, `CHARGES`, `REROUTE` :357, `HEARTKEY`/`SURPKEY`/`ANTKEY` :359-361, `ROOTD`, `DOMAINS` (19), `ARCH` (12), `SI` (21 laws), `MASKS`/`MASKS_READ`, `TIERDEF` (10 CQ bands), `NODESTATE_PROPOSED` (unused, :920) | The arithmetic and schema core |
| `kb.js` | `SABDEF`, `DOMDEF`, `KB_RENAME`, `GLOSS`, `HARM` (`E01`-`E76`, 7 families), `HARM_AX`, `HARM_FAM` | The Wisdom school definitions and the harmonic index |
| `sabcard.js` | `SABCARD`, keyed as `SABDEF` | Saboteur card copy, joining `SAB33` to `CHILD` by charge name (the correct join) |
| `hcxcard.js` | `HCXCARD`, keyed to `HCX_LIB` | Hyper complex card copy |
| `people.js` | `PEOPLE`, `LAWSET`, birth tables | The fixed test persona roster. Name is identity |
| `patterns96.js` | `PATTERN96` (32 ancestral, 32 generational, 32 parental) | Revived 17 November, not reviewed, rendered by nothing |
| `researchanchors.js` | `RESEARCHANCHOR`, two id series `R..` and `S..` (from :70) in one array | Citations `PATTERN96` resolves against |
| `cards.js` | `C3_*`, `CARDSET` (3), `AXCARD` (9) | Release card copy |
| `catalog.js` | `APC` (7, one per seat) | Display only catalog counts |
| `figure.js` | `BODYPATH`, `ANATHEAD`, `ANATSPINE`, `ANAT` (:84) | Body figure geometry; `ANAT.ids` places `NODES` on the figure |
| `nerves.js` | `NERVEBR`, `SEATXY` | Nerve artwork. Band spelled `'eye'` here, `'3rd Eye'` elsewhere |
| `zones.js` | `ZONEPT` | Timezone reference cities for the rising sign |
| `ages.js` | `AGES`, `AGE_TEST`, `AGE_WORKED` | Age ladder intake |
| `affirm.js` | `AFFIRM`, `CHALLENGE`, `AFF_*` | Daily affirmation copy, keyed to `CHILD` |
| `crisis.js` | `CRISIS_LINES`, `CRISIS_SAY` | Crisis numbers and copy, shared with the funnel quiz |
| `safe.js` | `SAFE_WORDS`, `SAFE_SAY_V`, `SAFE_*` | The self harm phrase gate that withholds a release |
| `funnelquiz.js` | `SI_SELFQ`, `ARCH_SELFQ`, `FUNNELQ*` | Quiz prose only; loads after the logic (MANIFEST 82) |
| `gloss.js` | `UNPACK_BASE`, `UNPACK_ELEM`, `UNPACK_DOM` | The unpack every symbol meanings, keyed `sign:`, `law:`, `axis:`... |
| `intakemore.js` | `IX_*` | Added intake questions |
| `onboarding.js` | `ONB_*`, `OB_*`, `JOURNEY_*` | Mini release sizing and the journey event log shape |
| `practice.js` | `EXPR` :7, `PRACTICE` :18, `TEACHER_PRACTICE` :137, `PTRACK`, `BECOMING`, `PAINREG` | Ritual step library |
| `teachers_recipes.js` | `TEACHER_RECIPES` (:80, 14, keyed by pole key; no `AW`, `BO`), `RECIPE_STEPS` (:284) | Pushed onto `PRACTICE` at load, so it must load after `practice.js` |

---

## Part 4. Where the prose and the code disagree, 20 November

| Prose | Code | Fix |
|---|---|---|
| `CLAUDE.md`, "Never renumber the TAB integers": Analytics "lost its tab" and is resolved through `TABREAL` | `TABDEF` has an Analytics entry at `core.js:424`, unfolded (`core.js:169-181`); `TABFOLD` (:496-497) does not name it | Drop the folded sentence |
| `CLAUDE.md`, same section: "TABDEF carries nine" | 11 entries on 20 November | Drop the digit; the paragraph already says the length is the answer |
| `compass.js:1094`: Rigidity and Dysregulation are counted in the denominator | Neither `Unbending` nor `Dysregulation` is in `FAM_IN` or `FAM_OUT`, so neither is counted at all; the outcome agrees only because `tot` stays 0 | Correct the comment and the retired name |
| `FAM_OUT`/`FAM_IN` name `Mania`, `Self-erasure`, `Enabling`, `Numbness` | None is in `HCX_LIB` | Dead keys, or a roster that is not `HCX_LIB`. Open |
| `README.md:5` sends a new reader to `docs/ATUNED_SOURCE_INDEX.md` | That file indexes one prototype thread nothing in `atuned_src/` reads | Point it at `SITEMAP.md` and `DOCS-INDEX.md` |
| `tests/README.md` types a check count | Counts drift | Read off the run |
