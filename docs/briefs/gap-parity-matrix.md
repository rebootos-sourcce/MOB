# Parity matrix: MOB (A) against reboot-os (B)

Read only. Nothing in either repository was edited.

- **A**: `/home/user/MOB`, commit `bc29d9e`. The engine is `atuned_src/engine/`. Tables were measured by loading the built `engine.js` in node. The three design briefs in the scratchpad were written at `eb788a2` and were used for the formulas. Every count below that disagrees with them was re-measured.
- **B**: `/home/user/reboot-os`, branch `claude/app-migration-decision-yx56cj`, commit `8ba42de`. The engine is `atuned/src/30..53`. Tables were read from `atuned/data/canon_tables/*.json`. Those files are asserted equal to the build: I evaluated B's live `LEX` construction and it matched `LEX.json` key for key and value for value. The formulas come from the source files, not from the docs. Where a B doc disagrees with B code, both are given and the code is what runs.
- Method: diffs were made by script (`parity_nodes.py` in the scratchpad) and by node against A's `engine.js`. "Same model" means the same arithmetic on the same kind of input. "Same concept" means the same idea computed differently.

A structural fact comes first because it colours every row. **A's engine is host free and runs headless**, which `hostfree.py` enforces. **B has no engine as a separate thing.** Every file from `30_` to `53_` except `42b_cloud.js` and `49_the-overlays.js` references `document`. B's arithmetic sits in the same global script as its renderers, and B's formulas can only be exercised through the page or through the simulation harness in `46_`.

---

## The matrix at a glance

| # | System | A | B | Same model? | Ahead | Gap in one line |
|---|---|---|---|---|---|---|
| 1 | Address canon | `data/nodes.js` (112) | `data/nodes_112.json`, `canon_tables/NODEREG.json` (112 each) | **Same table.** Every body row matches in id, seat, nerve, axis and distortion, and in name except node 8 | Tie on rows. A derives an axis per address and B does not | Three names differ (node 8, 109, 112). B has no per-address axis in its arithmetic |
| 2 | Laws | `data/canon.js` `SI` (21), `intake.js` | `32_story.js` `LAWS1` (20), `THE_NINE_LAWS.md` | **Different rosters.** B's "nine laws" are A's nine axes under another word | A on measurement, B on roster recency (ruled 24 Sep) | Only 11 names match exactly, plus Beauty against Aesthetic Beauty |
| 3 | Axes, fetters, charges | `CHILD` (9 axes), `CHG2SEAT`, `CHG2FET`, `REROUTE` | `CHARGE` (14 charges), `ILAXES` (9), `AXISOF` (12) | **Different unit.** A holds nine axis values. B holds 14 charge densities folded onto the same nine names | A in arithmetic, B in vocabulary | Doubt, silence and separation route to different axes. Five opposites differ |
| 4 | Coherence | `compute.js` | `45_the-psyche-map.js` `readings()` | **Different formula.** A scales with the square of the law mean, B scales linearly | Different jobs | The same answers give 36 in A and 60 in B |
| 5 | Sniffer | `sniff.js`, `lexicon.js` | `31_the-mark-set.js` `readSegment`, `30_` `LEX` | **Different method** over a shared phrase table | B on recall, A on inspectability | B stems and A refuses to. B reads one hit per segment and A reads every hit. Neither handles negation |
| 6 | Charge and release | `compute.js` per address, `ui/release.js` | `chargeLevels`, `coolDown`, `applyCascade` | Same release decrement, **different target** | B on time dynamics, A on address resolution | B has the cascade and the before/after density record. A has per-address charge |
| 7 | Quotients | CQ built. IQ, EQ, AQ, PQ designed with formulas | CQ built, plus vit, awa, flo. `QUOTIENTS_ENGINE_SPEC.md` is dictation only | Different | A (designed with formulas) | B defines no quotient formula. B has three built readouts that A lacks |
| 8 | Ladder and currency | `ladder.js`, `plan.js`, `schema.js` meter | `33_soul-bux.js`, `41_` WINS, `34_` RELLADDER, D1 `entitlements` | Same streak rule in spirit, **different economy** | B on earned rewards and billing, A on the spend model | B built the clearing achievements that A's brief says are undesigned. The two tier ladders contradict |
| 9 | Avatar | `avatar.js` (data, no writer, no figure) | `42_the-avatar.js` (data, writer, a page) | Same concept, different shape | B on built surface, A on design depth | A has the rise designed. B has a writer and a page |
| 10 | Seed, type, birth | `seed.js`, `astro.js`, `birth.js`, `numerology.js` | `49_the-overlays.js` (typed text only) | **B has no equivalent** | A | B stores what the person types and computes nothing |
| 11 | Intake and onboarding | `intake.js` (63 questions) | `LAWS1` diagnostic (20), `ONBQ` (7) | Different | Split | A triangulates each law three ways. B has a somatic onboarding that A lacks |
| 12 | B-only systems | partial: `verp.js`, `balance()`, pattern chain | `50_`, `51_`, `39_`, `44_`, lattice | Mixed | B | Four have near equivalents in A. Two have none |
| 13 | Persistence | `schema.js` `validateProfile`, `bindStore`, localStorage | IndexedDB blob, `user_schema.json`, D1 0001 to 0008 | Different | B on server, A on boundary | A has a validating boundary and no server. B has a server and no validating boundary |
| 14 | Undo | `undo.js` | none | A only | A | B has no undo at all |
| 15 | Export, outbox, practitioner | `outbox.js`, `plan.js` `LEAD_SEES` | `42c_ops.js`, `server/src/ops.js`, `CLIENTS` | Different | B on operations, A on the outbound rule | B stores the story joined to the account. A's ruling forbids that |

---

## 1. The address canon

**A.** `atuned_src/engine/data/nodes.js`, `const NODES`, 112 rows of shape `{i, k, b, n, a, d, c}`. Rows 109 to 112 are field anchors (`b` of `Field-Above` or `Field-Below`, `n` null, `c` null). The somatic ring is the other rows, and `compute()` divides by the ring length as a literal. Seat counts: Crown 21, Root 16, Sacral 16, Solar 16, Heart 15, Throat 12, 3rd Eye 12. `c` is a raw charge label (Fear 17, Anger 17, Disgust 16, Resentment 13, Shame 12, Sadness 12, Joy 12, Shock 8, null 5). The axis per address, `n.cf`, is **derived at load** in `core.js` by `ANTKEY`, `SURPKEY`, `HEARTKEY` and `REROUTE`. Measured over the ring: Anger 27, Sad 17, Disgust 16, Fear 11, Shame 11, Apathy 11, Shock 6, Anticipation 5, Surprise 3, null 1.

**B.** Two copies of the canon. `atuned/data/nodes_112.json` has shape `{id, key, band, nerve, axis, distortion, physical, tier_evidence?, display?}` with keys in upper case. `canon_tables/NODEREG.json`, which is the `NODEREG` the build ships in `30_`, has shape `{id, k, b, nv, ax, ds, ph}`. A third register, `data/pattern_data.json`, holds 114 `fetters` for the pattern map. `register_join.json` joins it to the canon **by name**, because the two files disagree on id for three nodes and the map puts four body nodes on the canon's field ids 109 to 112. Four rulings, R1 to R4, are open.

**The diff, by script:**

| | Result |
|---|---|
| Ids | Identical sets, 1 to 112, and identical order in all three tables |
| Axis (`a`/`axis`/`ax`) and distortion (`d`/`distortion`/`ds`) | 0 differences in 112 |
| Nerve | 0 differences on the body rows. NODEREG writes `field` for the anchors, where A and nodes_112 have null |
| Seat | 0 differences on the body rows. **NODEREG seats the anchors at `crown` (109, 110) and `root` (111, 112)**, so its counts read crown 23 and root 18. A and nodes_112 keep `Field-Above` and `Field-Below` |
| Names | Three differ, listed below |

| id | A `nodes.js` | B `nodes_112.json` | B `NODEREG` (shipped) |
|---|---|---|---|
| 8 | `Root_08_Unnamed` | `ROOT_08_UNNAMED` | **`Entitlement (Root)`** |
| 109 | `Sol Star` | `SOUL STAR` | `Soul Star` |
| 112 | `Gaia Gateway` | **`PARAM SHIVA / ASCENSION`** | `Gaia Gateway` |

**Same model?** The table is the same. Its use is not. A attaches an axis to every address and computes charge per address (section 6). B's shipped code never assigns an axis to an address. `nodesForCharge(c)` in `30_` returns the addresses at the charge's band whose name contains the charge's name, or else every address at that band. It is used only to label a release record (`fetterOf` gives the first match). B's pattern register carries an `emoFamily` on 31 of its 114 fetters and null on 83. Joined to A by name, 103 of A's ring addresses matched. The five that did not are node 8, the two Resentment rows, Self-Judgment (Solar) and Spiritual Language To Manipulate. Of the 28 where B names an axis, **15 agree with A's derived `cf` and 13 differ** (for example Pride, Arrogance, Judgment and Superiority are Anger in A and Disgust in B, Panic is Surprise in A and Fear in B, and Anxiety and Hypervigilance are Anticipation in A and Fear in B). The other 75 have no axis in B.

**Which side is ahead.** They are level on the canon itself. A is ahead on use: every address participates in the reading. B has named node 8 in its shipped table, which is the owner's open item in A (`Root_08_Unnamed`, TASKS KU13) and is still R1 in B's own `register_join.json`. So B's build has quietly resolved a ruling that B's own docs list as open.

**Gap:** the same 112, with three names that disagree and a node 8 that one shipped table has named without a ruling. B has no per-address axis in its arithmetic.

---

## 2. The laws

**A.** `data/canon.js` `SI`, 21 laws, each seated at a band: Throat 3, Crown 3, 3rd Eye 3, Heart 4, Solar 4, Sacral 2, Root 2. The roster: Truth, Transparency, Justice, Unity, Awareness, Nature, Presence, Humility, Equanimity, Compassion, Forgiveness, Generosity, Aesthetic Beauty, Courage, Duty, Responsibility, Accountability, Temperance, Detachment, Non-Harm, Patience. They are called the Laws of Moral Integrity by ruling. An unmeasured law is null on the profile and `LAW_DEFAULT = 6` in working state.

**B.** Two unrelated things carry the word "laws".

- **The integrity laws**, `LAWS1` in `src/32_story.js`, with shape `[key, name, question, domain]`. **Twenty**, ruled 2026-09-24 ("Beauty should be under expression"), down from 21 (ruling 1244). Twelve are integrity: Truth, Unity, Awareness, Compassion, Courage, Duty, Responsibility, Accountability, Transparency, Presence, Nature, Reverence. Eight are expression: Curiosity, Play, Creativity, Flow, Beauty, Order, Love, Will. No law has a seat.
- **The nine laws of emotion**, `THE_NINE_LAWS.md` and `data/nine_laws.json` (1252): Fear, Anger, Shame, Disgust, Apathy, Shock, Sad, Surprise, Anticipation. **These are exactly A's nine axes, in A's order.** The doc calls a law "an emotion at its own axis" and says the nine are "the friction", meaning the resistance term.

**Same concept at different granularity, or different concepts?** Both. B's nine laws are A's nine axes, so the 9 against 21 comparison is a naming collision and not a count disagreement. B's 20 integrity laws are the same concept as A's 21 laws (they set the ceiling of CQ), and the rosters genuinely differ:

| | Names |
|---|---|
| Both, exactly | Truth, Transparency, Unity, Awareness, Nature, Presence, Compassion, Courage, Duty, Responsibility, Accountability (11) |
| Near match | A `Aesthetic Beauty` against B `Beauty` (in B, an expression law) |
| A only | Justice, Humility, Equanimity, Forgiveness, Generosity, Temperance, Detachment, Non-Harm, Patience (9) |
| B only | Reverence, Curiosity, Play, Creativity, Flow, Order, Love, Will (8) |

B also contradicts itself. `canon_tables/PATHLAW.json` and `MASTERLAW.json` give each of the twelve masters a law, and six of them (Justice, Detachment, Patience, Ownership, Humility, Temperance) are not in B's own `LAWS1`. Five of those six are A's roster. `canon_tables/PROFILES.json` scores 13 laws including discipline, gratitude and service. The `AXES` card in `49_` still labels Integrity `13x3`, and `COHERENCE_LOGIC.md` and `srcContext()` disagree on 20 against 21.

**Ahead.** A on measurement: 63 triangulated questions, seat-level integrity through `bandIg`, and seat attenuation of charge. B on recency of the ruling about the roster (24 September). **Neither roster has been reconciled with the other, and that is the owner's call.**

**Gap:** two law rosters that share 11 names, and one word ("law") used for two different things.

---

## 3. The axes, fetters and charges

**A.** `CHILD`, nine poled axes, each held as two numbers from 0 to 10: `S.charge[axis]` (held) and `S.replace[axis]` (the installed opposite). Seats and opposites:

| Axis | A seat | A opposite (`CHILD.opp`) | A spec pole (`SPEC_POLE`, sniff.js) |
|---|---|---|---|
| Fear | Root | Trust | Safety / Ground |
| Anger | Solar | Equanimity | Calm / Integrated Power |
| Shame | Sacral | Worth | Worth / Self-respect |
| Disgust | Sacral | Acceptance | Acceptance / Equanimity |
| Apathy | Throat | Vitality | Joy / Aliveness |
| Shock | 3rd Eye | Groundedness | Groundedness |
| Sad | Heart | Joy | Happy / Restoration |
| Surprise | Heart | Readiness | Readiness |
| Anticipation | Solar | Presence | Presence |

Routing words onto axes: `CHG2FET` (anxiety to Anticipation, separation to Apathy, silence to Apathy, doubt to Shock, pride to Shame, guilt to Shame, craving to Disgust, grief to Sad). Routing address labels onto axes: `REROUTE` (Resentment to Anger, Joy to Apathy).

**B.** `CHARGE`, **14 charges**, each with a name, a pole, a band and a prose address. `ILAXES` holds the same nine axis names as A. `AXISOF` (12 entries) folds charges onto axes, and `COHERENT_CHG = {joy, love}` is excluded from load. Each charge is a density from 0 to 10: `chargeLevels()[c] = round(10w/(w+90))`, where `w` is the sum of live story weights naming that charge. "114 fetters" is retired: the Bible ruled 114 at row 893 and replaced it with 112 at row 951. `FETTER_CORPUS_MAP.json` has 78 keys, and `pattern_data.json` holds the map's own 114.

**The map from B's 14 onto A's 9:**

| B charge | B band | B pole | B `AXISOF` | A says | Agree? |
|---|---|---|---|---|---|
| fear | root | Safety | Fear | Fear, Root, opposite Trust | axis and seat yes. **Pole no** (A's spec pole agrees with B) |
| doubt | eye | Clarity | **Fear** | `CHG2FET` doubt to **Shock** | **no** |
| anger | solar | Calm | Anger | Anger, Solar, Equanimity | axis and seat yes, **pole no** |
| resent | solar | Release | Anger | Resentment to Anger | yes |
| shame | **root** (moved 24 Sep) | Worth | Shame | Shame, **Sacral** | **seat no** |
| silence | throat | Voice | **Shame** | silence to **Apathy** | **no** |
| disgust | sacral | Acceptance | Disgust | Disgust, Sacral | yes |
| sadness | heart | Gratitude | Sad | Sad, Heart, opposite Joy | axis yes, **pole no** |
| separation | crown | Union | **Sad** | separation to **Apathy**, seat Crown | **axis no** |
| shock | eye | **Readiness** | Shock | Shock, 3rd Eye, **Groundedness** | axis yes, **pole no** (B gives Shock the pole A gives Surprise) |
| anxiety | solar | Presence | Anticipation | anxiety to Anticipation, Solar | yes |
| apathy | **heart** | Joy | Apathy | Apathy, **Throat**, opposite Vitality | **seat no, pole no** (A's spec pole agrees with B) |
| joy | heart | Apathy | coherent, no load | address label Joy routes to the **Apathy** axis | same pairing, opposite treatment |
| love | heart | Separation | coherent, no load | none | B only |
| (none) | | | Surprise | Surprise is an axis in A, at Heart, with 3 addresses | **B has no charge row for Surprise** |

B's own `nine_laws.json` still records Apathy as having no charge row and being unmeasurable. The shipped `CHARGE` table now has an `apathy` row at heart, so that document is stale. Surprise has no row in either version.

**Ahead.** A is ahead in the arithmetic: nine values that are actually held, each with an installed opposite, and every address carries one. B is ahead in vocabulary: 14 named charges, each with a prose somatic address and descent places (`DESCENT`, `DESCENT_MATH.md`). B has no equivalent of `S.replace`: nothing in B holds an installed opposite as its own number.

**Gap:** three words route to different axes (doubt, silence, separation), two seats differ (shame, apathy), and five opposites differ. B's per-charge density has no "installed opposite" state.

---

## 4. Coherence (CQ)

**A, exactly** (`compute.js`):

```
held(n) = S.charge[n.cf] * n.susc * (1 - 0.42*bandIg(n.b)/10)          per ring address
rep(n)  = S.replace[n.cf] * (0.72 + 0.28*bandIg(n.b)/10)
sq(n)   = clamp(held - 0.86*rep, 0, 10) ; pole = clamp(rep - held, 0, 10)
jq(n)   = clamp(rep - 6, 0, 4)/4*10 ;     loaded if sq >= 4
poleMean = sum(pole)/108 ; JQ = sum(jq)/108          (the ring divisor, a literal)
Ig = clamp(mean of 21 laws + 0.30*poleMean - 0.42*JQ, 0, 10)
It = clamp(mean over 7 seats of bandIg + 0.22*poleMean - 0.30*JQ, 0, 10)
DQ = sum over loaded of sq/10
Rz = max(1, (1 + 0.05*DQ) * verpFactor())           verpFactor in 0.60..1.35
CQ = clamp(It * Ig / Rz, 0, 100)
```

Inputs: the 21 self-rated laws (default 6), the nine axes (from the story, sliders and seed), the self-selected soul (through `susc`), and gate cue counts. With nothing installed, CQ is roughly the square of the law mean divided by Rz. Blank gives 36.00 with `unread: true`. Laws all at 10 give 100.00. Laws at 6 with every axis at 10 give 14.99.

**B, as it runs** (`readings()` in `src/45_the-psyche-map.js:697`, `diagBase()` in `src/46_...:695`):

```
diagBase   = round(mean of the committed LAWS1 scores * 10)      0 if none committed
intention  = kept/(kept+broke) over ritual steps in the last 7 days, 1 if none   (intentionOne)
chargeLevels[c] = round(10w/(w+90)), joy and love forced to 0
bandTen(b) = min(10, 10*active/min(2, nCharges(b)))    active = charges at b with level > 0
sqTen      = mean of bandTen over the 7 bands
R          = 1 + A_SQ*sqTen/10,  A_SQ = 1.0            "still a PLACEHOLDER"
CQ         = max(1, min(100, round(diagBase * sqrt(intention) / R)))
DQ         = 100 - CQ
```

Inputs: the 20 self-rated laws (only committed blocks count, ruled 25 September), the ritual record of kept and broken steps, and which charges have any live story. **B's resistance is a presence count, not a magnitude.** A single live story of weight 5 or more lifts its charge level to at least 1, and releases clear a story at weight 6 or less. So `sqTen` counts which charges are present per band, and a release moves CQ only when the last story on a charge clears. B's own UI says so: "the number moves when a level clears". R ranges from 1 to 2, so the resistance can at most halve CQ. Unmeasured gives CQ 1, shown as `--`.

**B's documents state four other forms, and none of them is what runs:**

| Where | Stated |
|---|---|
| `ATUNED_PRODUCT_BIBLE_v1.md` 9.1 | `CQ = 100 x (Intention/10 x Integrity/10) / Resistance` (canon), and a "live" `base x (1 - load/900)` |
| `MVP_STATUS.md` section 2 (dated 11 Sep) | `sqrt(Intention x Integrity) x 10 / (1 + SQ/10 + 2 DQ/10)` |
| `COHERENCE_LOGIC.md` | `ceiling * sqrt(intention) / (1 + SQ/10 + 2*DQ/10)` |
| `readings()` comment and code | one resistance term. **The DQ term was struck on 14 Sep** ("Distortion and SQ are the same reading under two names") |

So the formula in the brief, with its `2 DQ/10` term, is B's documentation and not B's code.

**Same answers, different numbers.**

| Laws | Load | A CQ | B CQ |
|---|---|---|---|
| all 6 | none | 36.00 | 60 |
| all 8 | none | about 64 | 80 |
| all 10 | none | 100 | 100 |
| all 6 | everything present | 14.99 | 30 |

A squares the law mean because `It` and `Ig` are both law means. B is linear in the law mean and uses the behavioural record, not the laws, for the second factor. The two agree on one ruling: the structures that fire (A's `dist`, B's `firingTen`) are reported and kept out of the denominator (A: struck 13 May, BOOK-ERRATA 24; B: ruled 14 Sep). **They disagree on DQ**: A's DQ is `sum of sq/10` over loaded addresses, unbounded and measured up to 54.7, while B's is `100 - CQ`. B implements what A's own book says (BOOK-ERRATA 26), and A's engine does not.

**Ahead.** A's model is richer: per-address charge, seat attenuation, installed opposites and gate evidence. B's is the more recently ruled, it has the one behavioural term A lacks (intention as follow-through), and it is pinned by `data/readings_fixture.json` plus a 10,000-run probe (`simulateReadings`). A's two briefs call its own intention term "the same law scores weighted two ways".

**Gap:** the headline number is a different function in each product. A person answering identically would see 36 in one and 60 in the other.

---

## 5. The sniffer and lexicon

| | A (`sniff.js`, `lexicon.js`) | B (`31_` `readSegment`, `30_` `LEX`) |
|---|---|---|
| Main table | `LEX` 231 keys (192 authored, 9 canon, 27 fold, 3 composite), amounts 12 to 28 (calm words -12 to -14) | `LEX` 232 keys, built at load from `LEX`, `LEX_EYE` 31, `LEX_CROWN` 28, `LEX_CHAIN` 46, `LEX_TIER` 28, three intensity curves and `WORDLADDER` (seven charges, nine rungs each, `rungWeight(r) = round(6 + (r-1)*24/8)`). Amounts 6 to 30, 5 negative |
| Overlap | 95 keys shared: 81 at the same seat, 67 at the same amount. 136 are A only and 137 are B only | |
| Seat spread | solar 60, heart 50, throat 38, root 26, sacral 25, coherent 15, eye 9, crown 8 | eye 45, root 39, heart 35, solar 30, sacral 27, crown 27, throat 24, coherent 5 |
| Phrases | `PHRASES` 22 rows, 124 strings | **The same 22 rows and 124 strings.** 21 rows are byte identical. One differs in its label: A `frozen`, B `numb` (crown 26) |
| Multi-word | Phrases, plus 47 multi-word `LEX` keys | Phrases, 2 multi-word `LEX` keys, and `MULTI` (18 idioms such as "burnt out" and "on edge") inside `readSegment` |
| Adjective to charge | `ADJ2CHG` 83 rows (7 are `joy` and name nothing) | `ADJ2CHG` 62 rows onto B's 14 charges |
| Intensifiers | none | `MOD`, 23 multipliers from 0.6 to 1.9 ("slightly" to "catastrophic"), nearest one before the word |
| Body words | none. The seat comes from the lexicon | `BODYMAP`, about 45 body parts, longest first. **A named body part overrides the word's seat** |
| Ambiguity | none | `AMBIG` (down, low, flat, cold...) counts only with a carrier verb or pronoun within 3 words before. `AMBIGLIB` likewise for the library |
| Inflection | **No stemmer, deliberately.** `lexFold` admits only 27 corpus-confirmed forms and refuses four by name ("contents" would subtract charge). The brief: "a port must not replace it with one" | `stemCandidates` (-ied, -ies, -ing, -ed, -s, doubled consonants) against `LEX`, then `libRoot`, a fixed-point derivational stemmer (-ousness, -ness, -ment, -ation, -ity...) against the register |
| Matching | Three passes over the whole text: phrases (all occurrences, overlapping allowed), then `LEX` longest first with an overlap window, then every adjective. Every hit counts | Split into segments. Per segment: phrase, then `MULTI`, then the **single strongest word** (max absolute weight), then body plus sensation word (`SENSE`), then phrase, then the person's own learned words (`LEXNEW`), then the owner's library by root. **One reading per segment** |
| Negation | **None** in the core path (`I am not angry` scores as `angry`). A three-word look-back exists in the law and lean layers only. Q3 is open | **None in code** (no negation token anywhere in `src/`). `SNIFFER_GAPS.md` proposes "read the negation as suppression", at the throat, for negations with no feeling word. It is a proposal and it is not built |
| Unknown words | Counted as a gap, never guessed | Asked once, with one tap ("the grammar names it, ask where it sat"). The answer becomes `LEXNEW[word] = {band, d, n, at}` for that person, at `LEARN_W = 18` |
| Output | Hits then imprints `{node, name, band, fetter, amt, inferred, stated}`, the path and kink, and the `sniffStory` contract | `{band, adj, at, len, mod, modw, d, part, name, via}` becomes a story `{id, q, b, w, adj, charge, type, gate, gone}` |
| Scaling onto state | `amt/3`, then `x0.35` onto the axis, clamped. Calm words subtract `amt/140` from every axis | `d = round(base*mod)` **is** the story weight. Weights sum per charge through `10w/(w+90)` |
| Evaluation | Coverage: 91% of the book's sentences produce no hit | `SNIFFER_GAPS.md`: 210 persona sentences, 155 heard (74%). By its projection, 96% with the one-tap rule |

**Is B's "Source AI" a real model call?** No. `srcSend()` in `35_source-ai.js` builds a full system prompt (the canon, CQ, DQ, shadow, vitality, awareness, flow, heart field, the bands, **every live imprint's verbatim sentence**, and the top saboteurs) and then does not send it: "no key, no server, no consent screen yet: the call is not made (1205)". The reply is a fixed line plus the CQ and the heaviest band. The file named `30_lexicon-look-dev-stand-in-for-source-ai.js` is named for that reason: the lexicon is the stand-in. **B's sniffer is a lexicon like A's**, with more recall machinery and less inspectability.

**Ahead.** B on recall: intensifiers, body-part override, stemming, a learned per-person vocabulary, and a measured drop list. A on inspectability and precision: no stemmer, every hit citable, an `inferred` flag separating evidence from inference, and a documented output contract. **Both lack negation.**

**Gap:** the phrase table is shared and almost nothing else is. The methods disagree on stemming and on one hit against all hits.

---

## 6. Charge and release

**A.** The charge is per axis and per address (section 4 formulas). A story adds `min(10, byBand/3) * 0.35` to an axis (at most 3.5 per seat per story). Release, in `ui/release.js`, for each queued address: `w0 = n.sq*10; d = -round(w0*0.21 + 2)`, `share = |d|/10/(queued addresses on that axis)`, `S.charge[cf] -= share`, `S.replace[cf] += share*0.62`. So releasing installs the opposite. The unit spent is the pattern (`meterKey = node:channel:line`, `LINES_PER_CH = 50`, `RUN_MIN 4`, `RUN_MAX 25`). A rerun is free. The run log is `meter {lines, unique[], firsts[]}` and a snapshot is pushed onto `history`.

**B.** The charge is per story (the imprint) and per charge (`10w/(w+90)`). Release, in `coolDown()` in `34_calibration.js`, for each story in the queue: `d = -round(s.w*0.21 + 2)`, `s.w = max(0, s.w + d)`, and when `s.w <= 6` the story is `gone`. **This is A's decrement, applied to the story weight instead of the address charge.** B installs no opposite. Each release writes a record `{b, id, q, charge, node, w0, w1, cleared, ts, chargeBefore, chargeAfter, via?}`. `chargeBefore` and `chargeAfter` are the 0 to 10 density at that charge, and `released = count of cleared records`, derived and never stored on its own.

**The cascade** (`scheduleCascade`, `applyCascade` in `33_soul-bux.js`) has no equivalent in A. On `CHAIN = [root, sacral, solar, heart, throat]`, releasing a story at position i queues, for every live story at each band j above it, `delta = -round(released/(dist+1)/count)`, due `dist*SETTLE_H` hours later (`SETTLE_H = 6`, "PENDING, tunable, not ruled"). Firing applies it and clears at weight 6 or less, and the overnight report ("while you were away") shows the last six. Eye and crown are not in the chain. **Defect, read and not reproduced:** `coolDown` calls `scheduleCascade(s, |round(s.w*0.21+2)|)` *after* `s.w` has been reduced, and after it has been set to 0 when the story cleared. The cascade is therefore priced from the remaining weight, not from what was released, and a fully cleared story always passes on exactly 2.

**Ahead.** B on time dynamics (the cascade) and on the longitudinal release record with before and after. A on resolution (112 addresses carrying charge) and on the installed opposite, which is the second number every A axis has.

**Gap:** the same decrement acting on a different object. A has no cascade and no per-release before/after. B has no installed opposite and no per-address charge.

---

## 7. Quotients

**A.** Built: CQ, plus the secondary readouts `radiance` (X, Y, Z), `will`, `drag`, `balance`, `outward`, `organized` and the quadrant. **Designed with formulas** (`DESIGN-quotients.md`, `proto/quotients/quotients.js`, not in `atuned_src`):

- IQ (aperture) = `clamp(area x factor - JQ x 4.2/100, 0, 1) x 100`, where area is the squared mean `n.open` over 1.18 and factor comes from the gate cues.
- EQ (turn) = mean of `rep/(rep+held)` minus a JQ term.
- AQ (release) = `(met - now)/met` against the highest shadow ever recorded.
- PQ (boundary) = `boundaryCount.filled/30`, labelled stated.
- WQ is open.

**B.** `QUOTIENTS_ENGINE_SPEC.md` (dictated 24 Sep) names PQ, IQ, EQ, WQ and AQ, **defines none of them**, and pitches "one engine, five tracks" on the `PRACTICE` table. Its status line reads "Captured, not scoped". `grep` finds no PQ, IQ, EQ, AQ or WQ in `src/`. **B defines and builds no quotient beyond CQ.** B has three built readouts A does not:

```
vit = clamp(3, 100, round(100/(1 + load/110)))                       "allostatic load"
awa = clamp(3, 100, round(100 * resolved * (0.35 + 0.65*(1 - sq/100))))
      resolved = weight-share of stories with a band (.34), a charge (.33), a gate (.33)
flo = clamp(2, 100, round(45 + 40*clamp(mov, -1, 1) + min(15, recent*3)))
      mov = load shed over the last 8 real readings / starting load
```

B also has the five `AXES` of the diagnostic (Integrity, Intention, Emotions, Dynamics, Flow), self-scored up to three passes each and never folded into CQ. It has `heartField()` (`100*(1 - w/(w+90))`, with weight discounted by solfeggio distance from 639 Hz) and `concentration()`.

**Name collisions.** A's `JQ` is the overshoot quotient. B's `JQ` is the journal question table. A's `iqScore`, `iqList` and `iqApply` mean "intake question". Both products use "aperture": A's is the designed IQ, and B's `apertureRing()` is `min(4, floor(awa/20))`.

**Ahead.** A on quotient design, with four formulas. B on shipped readouts (vit, awa, flo).

**Gap:** B has no quotient formulas, and A has no vitality, awareness or flow readout.

---

## 8. Ladder, progression and currency

| | A | B |
|---|---|---|
| Streak | `streakRead` in `ladder.js`, derived from days with a saved ritual. A gap of 2 or less extends the run, a gap of 3 or more gives `max(1, ceil(run/2))`, it never resets, and today is not required | `streakTouch` in `33_`, incremented **on release** (`coolDown`). A gap of 1 extends, a gap of 2 extends once (grace, restored on a kept day), otherwise `max(1, floor(n/2))`. `STREAK {n, grace, lastDay, best}` is **stored** |
| Marks and badges | `MARKS`, 16 in three families (Practice at Root, Ground at Throat, Structure at Heart), recomputed each render and never stored. Only the next mark is shown | **None.** `31_the-mark-set.js` is a glyph language for saboteurs and complexes, not badges |
| Achievements | **Not built, and per the gamification brief not designed**: the owner's "you cleared a fetter, a saboteur, a hyper complex, and they scale" | **Built.** `WINS` and `WINTIER` in `41_the-band-strip.js`: node 1, cluster 5, protocol 3, ritual 4, band 12, saboteur 20, complex 35, hypercomplex 60, imprints 100. `checkWins()` diffs before and after each clearing. `WINRANK` rolls a release up to its highest tier |
| Earned currency | **None.** Karma is designed (1 per ritual, 5 per mark, and so on) and not built | **Soul Bux**, built: `buxForEntry` pays `2 + min(4, round(abs(d)/8))` per imprint, 3 per coherent word, and `+3 x (run - 1)` momentum for staying in one band. `award(max(4, round(abs(wd)/2)))` per release. `LEDGER` (500 rows, capped) records earn and spend |
| Spend currency | Patterns: the gift of 100, free 10 a week, tiers 400, 800 and 1,200 a month, tier four 1,200 plus the lead suite. Unique ground only, reruns free, spend derived | Release sessions counted, with caps by tier (below). Bux is never spent anywhere |
| Distance ladder | `MARKERS` as **fractions of the person's own load**, where load = age x `PAT_PER_YEAR = 300` (reference 50 years, 15,000). The comment says the owner's SOURCE OS document names 3,500 **Integration** where the engine had Christ consciousness | `RELLADDER`, **absolute release counts**: 2,500 Buddha Nature, 3,500 **Christ Consciousness**, 4,500 God Consciousness, 10,000 Nirvana. `carriedEstimate` = age-band floor x **200** a year, x 1.10 for women |
| Lifetime counter | Not a hero number | "Front and centre, like a video game score" (`RELEASE_COUNTER_SPEC.md`). One increment is one completed release at one address |
| Tiers | Gift, free, one, two, three, four. **Every tier sees everything** ("sight is not for sale"). Only tier four has a ruled price, 99 | `TIERS`: Growth 9.99 (400 a month, reach up to saboteur), Power 29.99 (900 unique, up to hyper), Super 49.99 (unlimited, everything), Practitioner 99.99 (plus clients). **`tierCanSee(layer)` sells depth of reach** |
| Billing | `bindPlan` seam, no processor | D1 `entitlements` (Apple and Google, derived plan, `plan_override`), store notifications, an hourly sweep |
| `LADDER.json` | | This is **not** a progression ladder. It is the intensity ladder for Shock (1 to 4 Surprise, 5 to 10 Shock) and Anticipation (1 to 4 Anticipation, 5 to 10 Anxiety) |

**Ahead.** B is ahead on rewards and billing as built. A is ahead on the spend model (unique ground, free reruns, derived spend) and on the record (marks, ledger, dated firsts).

**Gap:** the streak rules differ in rounding (ceil against floor) and in what counts (a saved ritual against a release). The distance ladders use different rates and a different name at 3,500. The tier ladders contradict each other on whether sight is sold.

---

## 9. Avatar

**A.** `avatar.js`, data only. `avatar {built, at, reviewedAt, pairs:[{be, notbe}]}`, and `purpose {soul:[3], ego:[3], sides:{partner, family, friends, community, coworkers, alone}: up to 5 each}`. Functions: `avatarGap`, `avatarProgress`, `boundaryCount`, `boundaryCross`. **No writer exists for `pairs`, and there is no figure.** Designed (`DESIGN-avatar.md` Part Two): the kundalini rise, `t(seat) = clamp(mean n.open / 1.18, 0, 1)`, cumulative in series from root to crown, `pct = round(100 x sum(cum)/7)`, with `rise0` written once and three channels (record, reach, weather).

**B.** `42_the-avatar.js`: `AVATAR {built, at, reviewedAt, be:[{nm, inv}], notbe:[]}`. `be` and `notbe` are separate lists, and each `be` carries its own inverse sentence rather than being paired. **A writer exists:** `avatarActivate()` sets it built and adds a monthly "Avatar review" ritual step. `onbApply()` writes up to two `be` attributes from the sleep and breath answers "without the person writing anything". `avatarGap` resolves `inv` through `readSegment`. `toolAvatar()` is a built page with six panes (`AVTABS`: Summary, CQ, Psyche, Overlay, Integrity, Resistance) and a coherence hero ring. The purpose and boundary are in `BOUND {values, wants:[3], facets}` on six facets (self, relationship, family, friends, work, community) up to 5 each: **the same shape as A's `purpose`, with different side names.** `AVATAR_PEAK_POTENTIAL_SPEC.md` (dictated 24 Sep, "captured, not scoped") reframes it as seven "become" fields, one per chakra along the spine, that weight release priority and supply the top three ritual suggestions. No kundalini rise exists in `src/`. The word appears only in docs.

**Ahead.** B on built surface (a writer and a page). A on design depth (the rise, the three channels, the honesty rules).

**Gap:** the pair shapes differ (bound pairs against two lists). B invents avatar attributes from onboarding answers, which A's model (the person's own words) does not allow. Neither has a figure.

---

## 10. Seed, type and birth material

**A.** `seed.js`: a stated four-letter type becomes four additive terms over the nine axes from a base of 3 (`SEED16`), written by `seedApply`, with `seedShare`. `astro.js`: Meeus sun and moon, ascendant, `GATE_WHEEL`, nine towns in `PLACE`. `birth.js`: sun, moon and rising, life path, Chinese year and element, HD gates and profile (type and authority deliberately null), gene key, and `converge()`. `numerology.js`: Pythagorean, with masters and karmic debt. None of these feeds the charge arithmetic except the seed.

**B.** **No equivalent computation.** `49_the-overlays.js` has three `OVERLAY` cards (Western astrology, Eastern astrology, Human Design) with a free-text input each, stored in `OVDATA`, plus a fixed "where they converge" paragraph. Nothing is calculated. B's `SEED` in `31_` is unrelated: five demo stories, cleared on first open. B's `PERSON` is `{name}` only. B collects no birth date, time or place (`ONB.age` is a band).

**Ahead.** A, entirely.

**Gap:** B has no type seed, no astronomy, no numerology and no birth record. The ruling "overlays confirm, never override" is shared in spirit with A's `converge`.

---

## 11. Intake and onboarding

**A.** `intake.js`: **63 questions**, 21 laws x 3 framings (left "when it costs you", right "when nobody would know", neutral), in blocks of three and resumable. Per law, `score = round1(mean)`, `spread = max - min`, `reliable = spread >= 3`. `iqApply` writes `p.laws` and `S.law`. `intake {answers{0..62}, done[], startedAt, completedAt}` is validated at the boundary.

**B.** Two separate things.
- **The law diagnostic** (`renderDiag` in `46_`, `LAWS1` in `32_`): **20 questions, one per law**, in `LAWBLOCK = 7`, with the number shown after the first block. `PRECISION = [null, 14, 9, 6, 4, 2]` gives a plus-or-minus by level. Only committed blocks count toward the ceiling.
- **Onboarding** (`ONBQ` in `49_the-overlays.js`): 7 somatic and context questions (hand, sex, age band, sleep, breath, pain, practice). `onbApply` sets `DIAG.opening = clamp(5 + lift, 0, 10)` and writes avatar attributes. **`canon_tables/ONBOARD.json` is not onboarding:** it is the seven-line voice script that opens a release ("Welcome to Release and Reframe..."). **`34_calibration.js` is not intake either:** it holds the felt-against-computed nerve calibration, the fold, the heart field, the release counter, the ICP fixtures and the release run.

**Ahead.** A on law measurement (three framings, spread, reliability). B on onboarding context (handedness, which B uses for polarity geometry, and sleep and breath) and on progressive precision.

**Gap:** 63 triangulated questions against 20 single ones. A has no somatic onboarding. B's plus-or-minus band and A's `accuracy.band` are both confidence-shaped numbers, and neither is an interval.

---

## 12. B's systems: six modes, double bind, aperture, influence, polarity, lattice

| B system | B file and model | A equivalent | Verdict |
|---|---|---|---|
| **The six modes** | `docs/THE_SIX_MODES.md` is **0 bytes**. What exists is `AXIS6` and `axis6()` in `45_` (ruled 1244): three pairs, **action** (Avoidant against Intending, from `0.65*follow + 0.35*doing`, pulled to the middle when evidence is thin), **perception** (Ignorant against Aware, the weight-share of stories that are named, addressed and gated), and **holding** (Attached against Detached). Each shadow pole has a master and a protocol from `CLAWDATA` | **Same six poles.** A's `verp.js` gates are aware, detach, intent, ignore, attach and averse. A reads them from **text cue counts** (`verpScan`, bare substring, no negation) and **multiplies Resistance** by `verpFactor` (0.60 to 1.35). B reads them from **behaviour and the record** and keeps them out of CQ | Same concept, different measurement, opposite role in CQ |
| **Double bind** | `doubleBind(s)` in `50_`: true when a story's text holds a word from `CHAIN_UP` (mobilisation) and one from `CHAIN_DOWN` (collapse) | **None.** The nearest is A's family poles (`FAM_POLE`, an overshot twin) and `steer` forced or withheld. Neither detects both directions in one story | B only |
| **Aperture of awareness** | `APLAYERS`, five rings (charge, fetter, saboteur, complex, domain), `apertureRing = min(4, floor(awa/20))`. The signal test (`SIGSTEPS`, felt yes and no) sits in the same file | A's IQ "aperture" is designed only (section 7), from `n.open` | Same word, different construction. B built, A designed |
| **Influence layer** | `ILSTACK`, 8 rungs: Fetters 112, Saboteurs 33, Complexes 23, Hyper 8, Super, Masks 6, Archetypes 12, Domains 18. `ILTIER` splits spirit (domain, archetype) from body. `IL_NEED` gates rungs by plan | A's pattern chain in `compute()`: saboteurs (SAB33 plus 14 named clusters plus inferred), complexes, hypers, supers (by `hcx` family), masks (6), archetypes (12) and domains (19) as the self-selected soul | Same stack, **different contents**: A's hypers are six derived families with poles, and B's are 8 clinical names (Narcissism, Bipolar Disorder...). Domains 19 against 18 |
| **Polarity** | `sideOf(s)` in `44_`: `ACTED` (25 phrases) gives R, `HELD` (20 phrases) gives L, and ties fall back to `CHANNEL[charge]`. `HAND` from onboarding sets which side is drawn as doing | A's `balance()` (OUTWARD: Anger, Disgust, Anticipation, Surprise; INWARD: the rest), A's lean `LEANFRAME.self`/`.other` (the writer acting against acted upon), and `C3_POLE` masculine and feminine for release cards | Near concept, different inputs. A has no handedness |
| **The lattice** | `THE_LATTICE.md` and `lattice.json` (1249): enumerates 91 charge pairs against 12 named ones, finds six charges that drive no saboteur, and ranks unnamed pairs by how often they co-occur in a 4,000-run simulation. It is an **audit tool**, not a runtime system | A's `UNNAMED` inferred clusters name gaps at runtime ("Heart Mourner", "Diffuse ..."). A has no offline completeness audit | Different jobs: B audits the names, A infers them per person |

Also B only, with no A equivalent: the nerve states (5 by band weight), the pain map (`PAINZ`, `painRead`), the fold and heart field (period-three frequency, `FOLDRATIO 1.6136`), the felt-against-computed calibration, the descent addresses, the let-go corpus (239 topics with channel and layer), the masters and teachers (12, with CQ and adversary), and the Match deck.

---

## 13. Persistence and schema

**A.** `schema.js`, schema v2. `bindStore(get, set)` binds localStorage in the UI. The key `source.profiles` holds the whole `PROFILES` array plus refused raw records (`STORE_KEPT`). **`validateProfile` is the boundary**: missing fields are filled from the blank, wrong type or range is refused by name, nothing is clamped, it rebuilds rather than patches, and it runs on every load and every import. `pImport` is atomic. Save failures are reported (`SAVE_ERR`). There is no server. The network seam is designed as a record fetch at sign in.

**B.** IndexedDB, one blob under the key `state` (`Store` in `33_`), memory fallback, `PERSIST_FAIL` shown in `#offbar`. `restore(s)` **assigns fields without validating them**: it refuses only `v > 1`, and everything else is `x = s.x || default`. `user_schema.json` documents the shape and a gate checks it, but no runtime boundary enforces it. Server: D1, `0001_canon` (127 canon tables), `0002_identity` (accounts with email, PBKDF2 hash, `research_id` and plan; sessions; consent; `records`; `research_records`; audit), `0003_entitlements`, `0004_push`, `0005_reset_and_limits`, `0006_operations`, `0007_plan_override`, `0008_indexes`. Sync pushes each record by version, and the higher version wins.

**The person record, field by field:**

| Concept | A field | B field |
|---|---|---|
| Version | `v` 1 or 2 | `v` 1 |
| Identity | `id`, `name`, `who {first, middle, last, sex, sealed, born{date, time, place, timeUnknown}}` | `PERSON {name}`. On the server, `accounts {id, email, research_id, plan}`. `ONB.sex`, `ONB.age` (a band) |
| Axis charge | `axes {Fear:{held, opp}...}` (9) | none stored. Derived from `stories` |
| Installed opposite | `axes.X.opp` | **none** |
| Laws | `laws {21: number or null}` | `DIAG {level, band, scores{20}, opening?}` |
| Intake | `intake {answers{0..62}, done, startedAt, completedAt}` | `DIAG.scores` (one per law) |
| Soul | `soul {doms[], arcs[], roots[]}` | none (archetypes are detected from saboteurs, `detectArchetypes`) |
| Seed | `seed {type, at, axes}` | none |
| Gate evidence | `gates {verp{6}, lean{benign, malignant}}` | none stored. `axis6()` is derived |
| Stories | `story.entries[{t, text, imprints, bands}]` | `stories[{id, q, b, adj, charge, w, w0, sabo, type, sel, gone, gate}]`. **Each segment is its own record, with a weight that release mutates** |
| Releases | `meter {lines, unique[], firsts[], first, last}` | `runLog[{b, id, q, charge, node, w0, w1, cleared, ts, chargeBefore, chargeAfter, via, legacy}]` (500 cap), `released`, `TESTED`, `freed` |
| Cascade | none | `cascade[]`, `applied[]` |
| Rituals | `rituals[{t, track, band, steps, min, when, where, done}]` | `proto[]` (steps), `ACC{}` (kept or broke per step), `week[]` |
| Streak | derived | `STREAK {n, grace, lastDay, best}`, `streakBand`, `streakN` |
| Currency | none earned | `BUX`, `LEDGER[]`, `WINS[]` |
| Plan | `plan {tier, status, granted, carried, base, since, until}`, written by the store only | `PLAN` 0 to 4 on the device. On the server, `accounts.plan`, `plan_override`, `entitlements` |
| Avatar and purpose | `avatar {built, at, reviewedAt, pairs}`, `purpose {soul, ego, sides}` | `AVATAR {built, at, reviewedAt, be, notbe}`, `BOUND {values, wants, facets}` |
| History | `history[{t, cq, dq, sq, pole, jq, rad, loaded, sab, cx, hy, ch, dark, tier, arch}]` | `HIST[{date, cq, dq, sq, vit, awa, flo, load, freed, released, bands, charges, diagLevel, precision, start, demo}]` (400 cap) |
| Consent | `ui.model` (stored, and read by nothing) | `CONSENT {share, at, v}`, plus the server `consent` table, which is enforced on research sync |
| Other | `ui.quiet` | `ONB`, `ONBOARDED`, `HAND`, `THEME`, `LEXNEW`, `SIG`, `PAIN`, `DENSLOG`, `DENSPAT`, `DECKLOG`, `MATCH`, `CLIENTS`, `MORNING`, `ARCHCORRECT`, `CLOCK` |

**Ahead.** B on server plumbing (accounts, sync, deletion, entitlements, push, reset, rate limits). A on the boundary (validation, refusal by name, atomic import, kept refused records).

**Gap:** A has no server. B has no runtime validation, and its record carries no birth data, no installed opposites and no soul.

---

## 14. Undo

**A.** `engine/undo.js`: unlimited (`UNDO_MAX = 0`), with a redo stack, keyed by record id, capturing the inputs (`S.charge`, `S.replace`, `S.law`, soul). It pushes before the mutation and carries a label. The known gap is that it does not take back `VERPMIX`, the story entry, the snapshot or the meter.

**B.** **None.** No undo or redo appears in `src/`. The only occurrences are "cannot be undone" in the delete and wipe copy. `UX_PRINCIPLES.md` recommends "a prominent Undo, not 'are you sure?'", and nothing implements it.

**Gap:** A only.

---

## 15. Export, outbox and practitioner

**A.** `outbox.js`: four envelope kinds (support, bug, rating, feedback), the closed key set `OB_KEYS`, the deny list `OB_NEVER` (about forty names: identity, story, readings, birth, practitioner), validated on queue and again on drain, with the reading sent only as a three-bucket band. `bindSend` is unbound and says "Held on this device". `export.js` is the module contract, not a person-facing export. The person gets a clipboard export and the quiz handoff `atuned-record.json`. Practitioner: `LEAD_SEES` (fetters, saboteurs, complexes, hyper complexes, analytics) and `LEAD_HIDDEN` (the story cloud, the spiritual material, the tools). DECISIONS: "the record and the story are never held joined".

**B.** `42c_ops.js`: crash capture (the last 20 on the device, POSTed to `/v1/crash`, with a toggle), a version gate, a server export (`GET /v1/export` returns every record body), and a local `exportAll()` download of the snapshot. `server/src/ops.js`: `supportView` (counts, events and entitlements, never a body), `crashSummary`, and an admin console with plan set and delete. Practitioner: `CLIENTS [{id, handle, consentUntil, scope:'read'}]` and `clientLink(handle, days)`, gated at `PLAN >= 4`. `PRACTITIONER_CLIENTS_SPEC.md` records **zero callers**, no screen, no invite, no disconnect, and an open question on what a practitioner may see.

**The privacy contradiction.** B's `cloudRecords()` pushes every `imprint` (whose `q` is the person's sentence, verbatim) into `records` keyed by `account_id`, beside `accounts.email`. **On B's server the story is held joined to the identity.** B's research copy (`research_records`, filed under `research_id` only, and only with consent) does follow A's ruling. B's unsent Source AI prompt would carry every verbatim sentence alongside the readings.

**Ahead.** B on operations (crash capture, support console, deletion, export route). A on the outbound rule (a closed envelope, a deny list, a banded reading) and on the practitioner sight rule, which is ruled while B's is open.

**Gap:** B's sync model stores what A's ruling says must never be stored together. A has none of B's operations.

---

## What is foundation in A that B does not have

1. **A host-free, headless engine** with a front door (`read.js`), a module contract (`export.js`) and an enforced purity check (`hostfree.py`). B's math cannot be run without its page.
2. **Per-address arithmetic over all 112**: a derived axis per address, susceptibility, `held`, `rep`, `sq`, `pole`, `jq` and `open` at every address, and seat attenuation by that seat's laws. B's addresses are labels.
3. **The installed opposite as state** (`S.replace`, `axes.X.opp`), which release raises. Every downstream quotient design (EQ turn, the pole, the kundalini rise) depends on it. B has no such number.
4. **The self-selected soul**: 19 domains, 12 archetypes, roots, `buildSoul` and `suscAll`, which decide where a story lands.
5. **Law measurement by triangulation**: 63 questions, spread and reliability, and seat-level integrity (`bandIg`).
6. **The seed and birth systems**: the type seed, real astronomy, HD gates, numerology and `converge`.
7. **Text layers beyond charge**: the six gates as a Resistance multiplier, and the lean (empathy and accountability, frame-gated, with negation look-back and the "no agency, no malignant" asymmetry).
8. **An inspectable sniffer contract**: `sniffStory` with `because` on every row, `inferred` against `stated`, the path, and the kink and floor both reported. There is also a deliberate no-stemmer allow-list with provenance per key (`LEXMETA`).
9. **The validating boundary** (`validateProfile`, atomic `pImport`, refused records kept) and honest save reporting.
10. **Undo and redo.**
11. **The outbound rule** (`OB_KEYS`, `OB_NEVER`, the banded reading) and **the practitioner sight rule** (`LEAD_SEES`, `LEAD_HIDDEN`).
12. **The spend model**: unique ground as the unit, free reruns, derived spend, the gift, and "sight is not for sale".
13. **The record ladder**: 16 marks with next-only display, dated firsts, and markers as fractions of the person's own load.
14. **Designed quotients with formulas** (IQ, EQ, AQ, PQ) and the designed kundalini rise.

## What is foundation in B that A does not have

1. **A server**: accounts, sessions, consent, a research id, record sync by version, deletion, password reset, rate limits, push subscriptions, crash and server-error capture, a support console, export, and 127 canon tables served from D1. Tested offline against the real migrations.
2. **Billing**: store entitlements (Apple and Google), a derived plan, `plan_override` and an hourly sweep. There is also a Capacitor store shell.
3. **A canon database**: 115-plus tables as JSON and SQLite, asserted equal to the build, with a schema and hole register (`holes.json`, 55 holes).
4. **Intention as behaviour**: kept over kept plus broken ritual steps over seven days, entering CQ under a square root.
5. **The release record with before and after density** (`runLog`), which is a longitudinal file, and **the cascade**, where clearing lower bands lightens upper bands over hours.
6. **Earned rewards, built**: Soul Bux with a ledger, momentum for depth in one band, and **clearing achievements scaled by layer** (node 1 through hypercomplex 60, imprints 100). This is the owner's achievement idea that A's brief records as undesigned.
7. **Sniffer recall machinery**: intensifiers, body-part override, carrier-gated ambiguous words, manuscript word ladders (rungs as weights), library resolution by root to the register, **a per-person learned vocabulary with one-tap placement**, and a measured drop report.
8. **Readouts A lacks**: vitality, awareness, flow, heart field, concentration and nerve states. Also the six-axis behavioural read, the double bind, polarity by action verbs with handedness, and the aperture ring.
9. **Somatic onboarding** (hand, sleep, breath, pain, age band, practice), the signal test and the pain map.
10. **A simulation harness and pinned fixture** for the reading model (10,000 runs, `readings_fixture.json`).
11. **Content corpora**: the let-go corpus (239 topics by channel and layer, the owner's release tails), descent addresses, the masters with laws and protocols, journal questions chosen from state, and daily prompts.
12. **An avatar writer and page**, even though its shape differs from A's.

## Where the two models contradict each other on the same concept

The two known ones are listed first. Each row states what each side says.

| # | Concept | A | B |
|---|---|---|---|
| 1 | **The law roster** | 21: Justice, Humility, Equanimity, Forgiveness, Generosity, Temperance, Detachment, Non-Harm and Patience are in, and each law is seated at a band | 20 (ruled 24 Sep): Reverence, Curiosity, Play, Creativity, Flow, Order, Love and Will are in, with no seats. B's own `PATHLAW` and `MASTERLAW` cite six laws not in `LAWS1` |
| 2 | **The CQ formula** | `It x Ig / Rz`, roughly the law mean squared over resistance. Blank reads 36 | `ceiling x sqrt(follow-through) / (1 + sqTen/10)`, linear in the law mean. Unmeasured reads 1, shown as `--`. Its docs state four other forms |
| 3 | **The word "law"** | the 21 integrity laws | also the nine axes ("the nine laws of emotion") |
| 4 | **DQ** | `sum of sq/10` over loaded addresses, unbounded, displayed as its own number | `100 - CQ`, which is what A's own book says (BOOK-ERRATA 26) |
| 5 | **SQ** | the mean `sq` over loaded addresses, a magnitude | the mean over bands of which charges are present, a count. Intensity-blind once a charge is present |
| 6 | **Intention** | a second weighting of the same law scores | follow-through from the ritual record |
| 7 | **Six gates or six modes** | text cue counts that multiply Resistance | a behavioural read that is not in CQ |
| 8 | **Routing words to axes** | doubt to Shock, silence to Apathy, separation to Apathy | doubt to Fear, silence to Shame, separation to Sad |
| 9 | **Seats** | Shame at Sacral, Apathy at Throat, Surprise at Heart | shame at root (moved 24 Sep), apathy at heart. Surprise has no charge row, and the descent dictation puts it at the throat |
| 10 | **Opposites** | Fear-Trust, Anger-Equanimity, Sad-Joy, Shock-Groundedness, Apathy-Vitality | Safety, Calm, Gratitude, Readiness, Joy. B matches A's own `SPEC_POLE` on Fear, Anger and Apathy, and gives Shock the pole A gives Surprise |
| 11 | **Per-address axis** | derived for every address | only 28 of the joined addresses carry an axis in B's register, and 13 of those differ from A |
| 12 | **Node names** | 8 `Root_08_Unnamed` (open ruling), 109 `Sol Star`, 112 `Gaia Gateway`, anchors at Field-Above and Field-Below | shipped `NODEREG` names 8 `Entitlement (Root)` while its own R1 is open. 109 is `Soul Star`. 112 is `PARAM SHIVA / ASCENSION` in `nodes_112.json`. Anchors seated at crown and root |
| 13 | **Masks and their seats** | 6, with Young Adult out and Adult in (closed 14 Sep). Child at Root and Sacral, Preteen at Solar and Throat, Teen at Throat, Adult at Sacral and Solar, Professional at Solar and Throat, Ideological at 3rd Eye | code agrees on the six names, but `MASKBAND` seats Child at root, Preteen at sacral, Teen at solar, Adult at heart, Professional at throat, Ideological at eye and crown. B's `THE_NINE_LAWS.md` lists 7 masks including Young Adult, Religious and Archetypal |
| 14 | **Domains** | 19 | 18, sharing 11 names. A only: Imperium, Duty, Dissolution, Descent, Connection, Exchange, Restoration, Provision. B only: Communication, Architect, Destruction, Love, Healing, Sacrifice, Devotion |
| 15 | **Archetypes** | 12, including Rebel | `ILSTACK` says 12, but the `ARCH12` table holds 18 (adds Orphan, Outlaw, Hero, Mentor, Shadow, Shapeshifter and Healer, and has no Rebel) |
| 16 | **Saboteur table** | 33 rows including Avoider. Integer staircase, kept at score 60 or more with a loaded seat | 33 rows including The Withholder and not Avoider. Of the 32 shared names, only 16 carry identical bands. Kept when every part is in band. Levels come from `10w/(w+90)` rather than from the axis |
| 17 | **Hyper complexes** | six derived families with poles (Predatory, Collapse, Rigidity...) | 8 clinical names (Narcissism, Bipolar Disorder, Machiavellianism...) |
| 18 | **Stemming** | refused by design, with a 27-form allow list | two stemmers |
| 19 | **Hits per text** | every hit counts, and phrases do not block each other | one strongest reading per segment |
| 20 | **Negation** | none, and it is the owner's open question (Q3) | none in code, but a doc proposes "negation is suppression, at the throat", which answers Q3 without a ruling |
| 21 | **Streak** | `ceil(run/2)`. Counts days with a saved ritual. Derived | `floor(n/2)`. Counts days with a release. Stored |
| 22 | **Load per year and the distance ladder** | 300 patterns a year (a 0.10 swing), markers as fractions of the person's own load. The comment says the owner's document names 3,500 Integration | 200 a year (x1.10 for women), absolute thresholds, and 3,500 is Christ Consciousness |
| 23 | **Unit of release** | one pattern: a line at `node:channel`, unique keys | one story cleared per session |
| 24 | **Tiers and sight** | every tier sees everything, and only tier four's price (99) is ruled | reach is sold by tier (`tierCanSee`), at 9.99, 29.99, 49.99 and 99.99 |
| 25 | **Story and identity** | never held joined (DECISIONS, 18 Sep). Practitioners never see the story cloud | server `records` holds verbatim sentences under the account with its email. What a practitioner sees is open |
| 26 | **Avatar attributes** | the person's own paired sentences only | onboarding answers write attributes for the person |
| 27 | **Joy** | an address label Joy routes to the Apathy axis, which carries load | a coherent charge, excluded from load, with pole Apathy |
| 28 | **Release stem** | `C3_STEM`, nine verbs: believing, perceiving, thinking, behaving, acting, feeling, speaking, saying, doing | `STEMS.letgo` lists six verbs. `CHANNELS` lists seven gates (Believe, Perceive, Think, Behave, Act, Say, Feel) |
| 29 | **Name collisions** (same word, different thing) | `JQ` overshoot, `SEED` type seed, `IQ*` intake question, aperture = designed IQ | `JQ` journal questions, `SEED` demo stories, aperture = `floor(awa/20)` |

Rows 1, 2, 4 to 6, 8 to 10, 13, 16, 22 and 24 to 25 change a number or a promise a person sees. The rest change labels or internals. Everything in this table is either the owner's ruling or already on one of the two repositories' open lists. None of it is resolved here.
