# Atüned / SOURCE: the mechanisms

Design brief, section: the arithmetic and inference core. For the desktop port team.

Written from the source at `atuned_src/engine/` (commit `eb788a2`, 25 September) and checked against the built `engine.js` with probe runs. The test vectors in section 11 are that engine's actual output, not figures I typed from reading. Where I could not run something (for example a renderer), I say so.

---

## 0. What this is, in one paragraph

There is no model in this product. Nothing is trained, nothing is learned, and nothing is estimated from data. A person's story is lowercased and matched against hand-built word and phrase tables. Every match carries a body seat and an intensity number that someone typed in. Those numbers are summed, divided by constants, and added to nine 0 to 10 sliders called axes. Everything after that is arithmetic over the nine axes, 21 self-rated law scores, and a self-selected "soul" (domains and archetypes). The headline number, CQ, is mostly the square of the self-rated law mean. The story can divide it by at most about 2.4. A port that copies the arithmetic exactly copies the product. A port that "improves" it with a classifier has built a different product, and it would also collide with the privacy ruling (section 10).

Three kinds of input feed the reading, and they should stay distinguishable in the port:

| Kind | What it is | Where it enters |
|---|---|---|
| **Matched from the text** | Word and phrase lookups on what the person wrote | `scanStory` > `parseStory` > `applyStory`, `verpScan`, `leanScan` |
| **Self-report** | Sliders, the 63 intake answers, the four-letter type, the soul picker | `S.charge`, `S.replace`, `S.law`, `S.doms/arcs/roots`, `seedApply` |
| **Symbolic, from birth data** | Astrology, I Ching gates, numerology | `astro.js`, `birth.js`, `numerology.js`. Never feeds the charge arithmetic |

"Matched from the text" is the most accurate label for the first row. It is detection only in the sense that `indexOf` detects something. It is not measurement of a body.

---

## 1. The shared vocabulary

Every mechanism reads the same small set of tables. Port these tables byte for byte first, because every number downstream depends on their exact contents and order.

### 1.1 The nine axes (`CHILD`, `CHARGES`) in `engine/data/canon.js`

`Fear, Anger, Shame, Disgust, Apathy, Shock, Sad, Surprise, Anticipation`, in that order. Order matters: `compute()` picks the dominant axis by scanning in this order, so on a tie the earlier one wins.

Each axis has a coherent opposite (`opp`: Trust, Equanimity, Worth, Acceptance, Vitality, Groundedness, Joy, Readiness, Presence), a seat, and a prose body location. The axes hold two numbers each: `S.charge[axis]` (held, 0 to 10) and `S.replace[axis]` (the installed opposite, 0 to 10).

### 1.2 The seven seats (`BANDS`)

`Root, Sacral, Solar, Heart, Throat, 3rd Eye, Crown`. The sniffer uses lowercase keys (`root, sacral, solar, heart, throat, eye, crown`) plus an eighth pseudo-seat, `coherent`, for words that subtract. The maps are `K2BAND` and `B2K` in `sniff.js`.

### 1.3 The 112 addresses (`NODES`) in `engine/data/nodes.js`

The user-facing count is 112 (voice rule: never state the other figure to users). In the arithmetic, 4 of them are field anchors (`b` starts with `Field`) that never carry charge. The somatic ring `W` is the rest, and several formulas in `compute()` divide by that ring's length as a literal, so the port must keep that literal.

Each node carries: `i` id, `k` name (Pride, Grief...), `b` seat, `n` anatomical label (Celiac Plexus...), `c` a raw charge label from the source data (Fear, Anger, Shame, Disgust, Sadness, Shock, Resentment, Joy, or null).

**Which axis an address belongs to (`n.cf`) is derived at load in `core.js`, not stored.** The rule, in precedence order:

1. name matches `ANTKEY` (`EXPECTATION|ANXIETY|WORRY|HYPERVIGIL|DREAD|ANTICIPAT|OBSESS|COMPULS`) > `Anticipation`
2. else name matches `SURPKEY` (`SHOCK|BETRAYAL|OVERSENSITIV|STARTLE|PANIC`) > `Surprise`
3. else name matches `HEARTKEY` (`LONGING|CLOSED HEART|REJECTION|RECEIV|UNWORTH|GRIEF|SORROW`) > `Sad`
4. else `REROUTE[n.c]`: Fear>Fear, Anger>Anger, Shame>Shame, Disgust>Disgust, Sadness>Sad, Shock>Shock, **Resentment>Anger, Joy>Apathy**
5. else null

Measured distribution over the ring: Anger 27, Sad 17, Disgust 16, Fear 11, Shame 11, Apathy 11, Shock 6, Anticipation 5, Surprise 3, null 1 (`Root_08_Unnamed`). The axes are not equally represented, and that asymmetry flows straight into every per-address reading.

Each ring node also gets `slot` (0 to 107, seat order then file order) and `ang = slot/108 * 2π - π/2`.

### 1.4 The routing tables in `core.js`

- `CHG2SEAT`: charge word to seat (fear>Root, anger>Solar, shame>Sacral, disgust>Sacral, apathy>Throat, shock>3rd Eye, sadness/grief/surprise>Heart, anticipation/anxiety>Solar, pride/separation>Crown, guilt/craving>Sacral).
- `CHG2FET`: charge word to axis (anxiety>Anticipation, separation>Apathy, silence>Apathy, doubt>Shock, pride>Shame, guilt>Shame, craving>Disgust, grief>Sad, and the nine by name). **There is no entry for `joy` or `anticipation`.**

These are the owner's rulings about where a feeling is held. `CHG2SEAT` and the addresses' own `cf` disagree on four of the nine axes (Shame, Apathy, Surprise, Anticipation). The code refuses to pick between them and reports it (section 9).

### 1.5 The 33 saboteurs (`SAB33`) and the named clusters (`SAB_LIB`)

- `SAB33`: `[name, [[charge, lo, hi], ...]]`, 33 rows, one to three charge bands each, keyed on lowercase charge names with Sad spelled `sadness`. Ported from `SNIFFER_SPEC.md` section 3, which the owner rules canon.
- `SAB_LIB`: 14 named clusters with fixed address ids (Controller = nodes 4, 36, 50 and so on), each with a family (`hcx`).
- `UNNAMED`: derived at load. Within each seat, two or more ring nodes with the same `cf` that are not in a named cluster form an inferred cluster ("Heart Mourner"). Leftover singletons join a cross-seat "Diffuse" cluster for their axis. A cluster whose names match `/PRIDE|SUPERIOR|ENTITLE|HUBRIS|ARROGAN|GRANDIOS|SPECIAL/` goes to the Grandiosity family instead of its axis family.
- Families: `FAM_OF` maps axis to family (Fear/Shock/Anticipation/Surprise>Dysregulation, Anger>Predatory, Shame/Sad>Collapse, Disgust>Rigidity, Apathy>Dissociation). `FAM_POLE` gives each family's overshot pole (Collapse>Mania and so on).

### 1.6 The 21 laws (`SI`)

Each law is seated at a band (Throat 3, Crown 3, 3rd Eye 3, Heart 4, Solar 4, Sacral 2, Root 2). `bandIg(b)` is the mean of that band's law scores. An unmeasured law takes `LAW_DEFAULT = 6` in working state and stays `null` on the stored profile.

### 1.7 The tier scale (`TIERDEF`, `tierOf`)

Ten bands on CQ: floors 91 Mastery, 81 Embodied, 71 Compounding, 61 Gaining, 51 Even, 41 Oscillating, 31 Incoherent, 21 Corrupt, 11 Severe, 0 Collapsed. `tierOf(cq)` returns the first band whose floor is at or below `cq`. The names are flagged in the source as a draft awaiting the owner's ruling.

---

## 2. The sniffer (`engine/sniff.js`, tables in `engine/lexicon.js`)

### 2.1 Normalisation (`normMap`)

1. Lowercase each character. Anything not `[a-z' ]` becomes a space. **Digits, hyphens and every non-ASCII letter become spaces**, so accented text breaks words apart.
2. Collapse runs of spaces to one.
3. Prefix one space. Append one space only if the text does not already end on one.
4. Keep `map[]`: for every character kept, its index in the raw text. `hit.at` is an offset into the normalised string, and `marksOf` uses `map` to put highlights back on the raw text.

The law, flow and depth matchers use a different normaliser (`lawNorm`), which also deletes apostrophes. The lean uses a third (`leanNorm`), which turns `. ! ? ; :` and newlines into a `|` barrier. The gate scanner (`verpScan`) uses a fourth, inline. These must be ported as four separate functions. They are not interchangeable, and unifying them changes readings.

### 2.2 The tables

| Table | Shape | Size (measured) | Role |
|---|---|---|---|
| `LEX` | `word > [seat, amount, fetter?]` | 231 keys: 192 authored, 9 canon, 27 fold, 3 composite | the scored vocabulary |
| `ADJ2CHG` | `word > charge name` | 83 keys | names a charge, carries no amount or seat |
| `PHRASES` | `[[strings], seat, amount, label]` | 22 rows, 124 strings | idioms, matched before words |

`amount` is an integer, 12 to 28 for charged entries and -12 to -14 for `coherent`. The validator allows magnitude up to 30 (`LEX_AMT_MAX`). **It is not a charge.** `parseStory` divides it by 3 and `applyStory` multiplies by 0.35 before anything reaches an axis.

The optional third element names the axis outright. 30 rows carry one (the exhaustion family states Apathy at the solar seat, the canon words state themselves). Without it, the axis is inferred from the seat.

**Provenance** is recorded per key in `LEXMETA` / `CHGMETA` (`src`: authored, canon, fold, composite). Per the source's own measurement, 87 of the 192 authored words appear anywhere in the owner's book and 105 do not. The authored amounts have no stated derivation. That is an open question, not something a port can resolve.

Seat distribution of `LEX` (measured): solar 60, heart 50, throat 38, root 26, sacral 25, coherent 15, eye 9, crown 8. The vocabulary leans heavily toward solar and heart, so readings will too.

### 2.3 The load-time passes, in load-bearing order

These run once, at the top of `sniff.js`, after `core.js` has declared `CHARGES`. They mutate `LEX` and `ADJ2CHG`. Run them in this order or the fold misses canon words.

1. **`lexCanon()`**: makes every axis name and every `SAB33` cue word matchable. For each such word not already in `LEX`, seat = `CHG2SEAT[w]` and fetter = `CHG2FET[w]`, or the axis itself if the word is an axis name. The amount is the **family floor**: the smallest positive amount among existing `LEX` entries whose fetter (stated, or via `ADJ2CHG`>`CHG2FET`) is that fetter, or the global smallest positive amount (12) if the family is empty. A word with no seat or no fetter is refused and reported. It is never guessed. It also adds `ADJ2CHG[w] = w`. Measured result: 9 added (anger 16, anticipation 14, apathy 16, disgust 12, fear 14, sadness 16, shame 14, shock 12, surprise 12), 1 already present (`sad`).
2. **`lexFold()`**: 14 suffix rules (`LEX_FOLD_RULES`) generate inflections of single-word keys (469 generated). **Only the 27 forms on the allow list `LEX_FOLD_OK` are admitted**, each confirmed against a named corpus (the book plus 14 persona voices). Four corpus-confirmed forms are refused by name because they are different words (`contents, laughing, rests, tenses`). A fold copies seat, amount, fetter and charge name unchanged. This is deliberately not a stemmer. The port must not replace it with one, because a stemmer produces forms like `contents` that subtract charge.
3. **`lexComposite()`**: for the resentment family (`LEXCOMP`), unseated members take the unanimous seat and the floor amount of the seated members (solar, 22) with stated fetter Anger. It refuses if the seat is not unanimous.

### 2.4 `scanStory(text)`: the matcher

Three passes over the normalised string `src`, each a plain `indexOf` of `' ' + key + ' '`, looping over every occurrence:

1. **Phrases**, in table order. Every occurrence is recorded. **Phrases do not block each other**, so overlapping phrases both count.
2. **LEX keys, longest first** (sorted by string length, descending; ties keep `Object.keys` order). An occurrence at `at` is dropped if any existing hit `h` has `h.at <= at < h.at + h.t.length + 1`. That window is the one-character correction documented in the source: `+2` suppressed the word directly after every longer match.
3. **Adjectives (`ADJ2CHG`)**: every occurrence is recorded with **no overlap check**. An adjective inside a phrase still names its charge.

Hits are then sorted by `at`. The sort is stable, so equal offsets keep phrase, word, adjective insertion order.

Hit shapes:
- phrase: `{t, kind:'phrase', band, amt, label, at}`
- word: `{t, kind:'word', band, amt, fet|null, at}`
- adj: `{t, kind:'adj', charge, at}`

**No negation, no subject, no tense.** "I am not angry" scores exactly like "I am angry" (reproduced, section 11). The law and lean layers have a three-word negation look-back. The core charge path does not. The source records whether "not angry" should mean no anger or anger named and denied as the owner's question (`DESIGN-sniffer.md` Q3). A port must reproduce the absence of negation and must not add it silently.

### 2.5 `parseStory(text)`: hits to imprints

```
byBand[k]  = sum of amt over hits with band k (phrases and words), excluding 'coherent'
byChg[c]   = count of adjective hits naming charge c
wanted     = { CHG2FET[c] for every c in byChg that has a route }
           ∪ { h.fet for every word hit that states a fetter }
stated     = { h.fet for every word hit that states a fetter }
```

`wanted` and `stated` are **computed over the whole text, not per seat.** This matters (defect D3, section 12).

For each seat `k` in `byBand`:

```
all  = ring nodes at this seat with a non-null cf
seg  = all nodes whose cf is in wanted   (empty if wanted is empty)
stateHere = stated is non-empty          (as written: stated ⊆ wanted always)

if stateHere and seg is empty:
    ONE imprint: node = all[0], fetter = first key of stated,
                 amt = round1(min(10, byBand[k]/3)), inferred:false, stated:true
    next seat

if |seg| < 0.25 * |all| and not stateHere:            # the quarter rule
    modal = most frequent cf in all (ties: first in Object.keys order of the tally)
    mseg  = all nodes with cf == modal
    if |mseg| > |seg|: seg = mseg
    if seg is empty: seg = all
    named = false

seg = seg sorted by susc descending (missing susc reads as 1)
total = min(10, byBand[k]/3)
share = total / min(4, |seg|)
for the first 4 of seg:
    imprint {node, name:n.k, band, fetter:n.cf, amt: round1(share), inferred: !named, from:k}
```

`named` starts as `seg.length > 0` before the quarter rule. `round1(x) = Math.round(x*10)/10`.

The return value also carries `named` (fetters named by adjectives, sorted by count descending), `weights` (those counts), `bands`, `charges`, `hits`, `path` (2.6) and `words` (count of non-adjective hits).

**Two consequences a port must reproduce, not fix:**

- **The address a story lands on is chosen by susceptibility, not by the words.** The words give a seat and an intensity. The first four addresses by `susc` get the charge. `susc` depends on the person's soul selection (section 4.2), so **the same sentence lands on different named addresses for different people.** Reproduced: "i shouted at him" lands on Pride, Arrogance, Competition, Anger for one soul and on Need To Win, Superiority, Pride, Arrogance for another.
- **`inferred: true` means the address name was not in the text.** A renderer must not print `name` as a finding when it is set. That flag is the whole line between evidence and accusation, and the source documents it after the product told a bereaved person they carried Martyrdom.

### 2.6 The path, and the kink (`pathOf`)

A record of the story's route through the body. **It is not an input.** Nothing in `applyStory` or `compute()` reads it.

- Group hits by `at`. Each offset is one step. Within a step, rank phrase < word < adj, then by string.
- A step's seats: for adjectives, `PATHSEAT[charge]` (a lowercased mirror of `CHG2SEAT`, with silence>throat, doubt>eye, joy>null). For others, the band, unless it is `coherent`.
- A step's amount is the largest `|amt|` among its scored hits (adjectives carry none). `depth = clamp(amt/PATHMAX, 0, 1)`, with `PATHMAX = 28` typed as "the largest charged amount in LEX".
- Position comes from `SEATXY`, the centroid of that seat's traced nerve branches in `data/nerves.js`.
- Summary: `span` (total Euclidean distance between consecutive located steps), `net` (last y minus first y, positive is downward), `drop`/`rise` (largest single downward/upward move), `dwell` (the most visited seat, first on a tie), `start`, `end`.
- **`kink`**: the scored step with the highest amount. **`floor`**: the scored step with the lowest. Both are always reported.

**The kink is an open ruling (owner's).** The source says: "parseStory sorts by susceptibility and takes the top, which is to say the app already assumed the block sits at the highest charge. Nobody ruled that. Both ends are reported so it can be ruled from data rather than from a sort order." A port must emit both and must not choose one.

### 2.7 `applyStory(text)`: the only function in the sniffer that writes

```
p = parseStory(text)
touched[f] = sum of imprint.amt over imprints with fetter f
for i, f in enumerate(p.named):        # named: fetters sorted by adjective count desc
    touched[f] += 0.8 / (1 + 0.5*i)
for f in touched:
    S.charge[f] = clamp(S.charge[f] + 0.35 * touched[f], 0, 10)
calm = sum of |amt| over hits with band 'coherent'
if calm: for every axis c: S.charge[c] = clamp(S.charge[c] - calm/140, 0, 10)
```

Effective ceiling per story per seat: `min(10, byBand/3) * 0.35 = 3.5` axis points, plus at most 0.28 from the adjective bonus. Calm words subtract `12/140 ≈ 0.086` to `14/140 = 0.1` from **every** axis, including the one the same story just raised.

**Commit path in the UI** (`ui/storyui.js`): the Apply button returns early if `parseStory(text).imprints` is empty. Then it calls `applyStory`, `verpApply` and `leanApply` in that order and appends `{t, text, imprints:count, bands}` to `profile.story.entries`. **Consequences:** a story made only of calm words, or only of adjectives (for example "I feel doubtful"), cannot be committed at all. The raw story text is stored on the profile, on the device, beside `who` (name and birth record). See section 10.

### 2.8 `marksOf(text, parsed)`

This maps each hit back to raw-text spans through `normMap().map`: one mark per stretch, longest first. An overlapped mark merges its charge, fetter, band and amount into the kept one. It is pure data for the story highlighter.

### 2.9 `sniffStory(text)`: the output contract (`SNIFFER_SPEC.md` section 10)

A read-only layer above `parseStory`. **Nothing in the UI calls it** (checked: its only references are in `sniff.js` and `export.js`). Readings a person sees today come from `applyStory` and `compute()`, not from this. The port should still carry it, because it is the specified contract Release is meant to consume. It does not mutate anything.

| Field | Mechanism | Constants |
|---|---|---|
| `axes[]` | `shadow[axis]` = sum of imprint amounts per fetter (**before** the 0.35 scale, so not on the same scale as `S.charge`). Stated fetters that no imprint carries are recovered at `|amt|/3`. `LEXCOMP` words add `|amt|/3/2` to each of Anger and Apathy. `coherent` = `min(10, Σ|coherent amt|/3)`, reported the same on every axis. `address` = the `n` label of the heaviest imprint on that axis, or null. `region` = the spec's prose location, kept separate because it is not one of the 112 | clamp 10, round1 |
| `saboteurs[]` | For each `SAB33` row: per-part membership `sabMember(level, lo, hi)`, combined by **geometric mean** (any zero part gives zero), times `sabWeight` = arity weight × row weight. Ranked, with **no firing threshold**. Top `SAB_SHOW = 6` returned | `SAB_EDGE 0.75, SAB_BELOW 2, SAB_ABOVE 3, SAB_ARITY {1:0.80, 2:1.00, 3:1.10}, SABW {Avoider:0.55}` |
| `laws[]` | `lawMatch` over `LAWCUE` (21 laws, four keyed in two directions). Longest first, a longer match blocks shorter ones inside it, void if a negator is among the 3 words before. `score = round1(10 * n/(n+2))` | `LAW_NEG` list, `LAW_NEG_W = 3` |
| `flow` | `EXPRCUE` (5 expression shadows), same matcher. `nature` and `human` returned **empty and marked `unread`** because their source file (`reviews/elements.json`) is not in the repository | |
| `gates` | From `verpScan` counts: `aware = aware/(aware+ignore)`, `detached = detach/(detach+attach)`. If both sides have at least one cue: `avoidance = 14.5 + 28.7 × (aware distortion + detached distortion)`, out of 100. Otherwise null | `GATE_BASE 14.5, GATE_STEP 28.7` (fitted to the owner's three stated points) |
| `depth` | C8 test first: a giving marker (`C8_GIVE`) and an audience marker (`C8_AUDIENCE`) within 12 words gives C8 at confidence 0.4. Else the `DANTECUE` circle with the most distinct cues, confidence `min(0.5, 0.15 × cues)`. Else null. Four circles have no cues and are reported `unkeyed` | `C8_WINDOW 12` |
| `offer[]` | Axes with shadow > 0, heaviest first, top 3. The replacement pole comes from `SPEC_POLE`. **`poleDiffers`** is set where the spec's pole disagrees with `CHILD.opp` (4 of 9 differ, and "Joy" names a different axis in each table) | `OFFER_MAX 3` |
| `gaps` | `lawCoverage()`: which laws have fewer than 6 cues, and which spec files are missing | |

`sabMember` exactly:

```
m = (lo+hi)/2 ; h = (hi-lo)/2
lo <= x <= hi : h>0 ? 1 - (1-0.75)*|x-m|/h : 1
x < lo        : max(0, 0.75 * (1 - (lo-x)/2))
x > hi        : max(0, 0.75 * (1 - (x-hi)/3))
```

Test values: `sabMember(5,4,6)=1`, `(4,4,6)=0.75`, `(3,4,6)=0.375`, `(7,4,6)=0.5`, `(9,4,6)=0`.

The laws table and the engine's law roster **do not match**. `LAWCUE` carries Ownership and Wisdom. `SI` carries Responsibility and Accountability instead. Law violation cues never write to `S.law`, so despite the comment in `lexicon.js` ("a law violation is ... the input to the coherence number"), **the text does not move any law score anywhere in the shipped product.** Laws move only through the intake and the sliders.

### 2.10 What the sniffer can and cannot evaluate

Stated in `lexicon.js` and `DESIGN-sniffer.md`, and I agree with it. There is no labelled set, so no precision or recall figure exists for any table, and none may be quoted. What is tested: a cue fires where it should, does not fire on its own negation (laws and lean only), gives the same answer twice, and fires on nothing for empty input. The source measures coverage: 91 percent of the owner's own book sentences produce no hit at all, and 13 of the 14 persona voices, which are stance rather than event, returned nothing before the last pass.

---

## 3. The two other text readers (`engine/verp.js`)

Both are phrase counters. Neither is a model.

### 3.1 The six gates: a cost multiplier

- `VERPCUE`: six lists of short phrases (aware, detach, intent, ignore, attach, averse).
- `verpScan(text)`: normalise, then **bare `indexOf(phrase)` with no space boundaries and no negation**. Reproduced: "it went unignored" counts as `ignore`. This matcher is inconsistent with the other three. It is documented here as behaviour to reproduce, not a design to copy forward.
- `verpApply` adds counts into the accumulating `VERPMIX`.
- `verpFactor()` = the share-weighted mean of `VERPMULT = {aware:0.7, detach:0.6, intent:0.75, ignore:1.3, attach:1.35, averse:1.25}` over `VERPMIX`. It is 1 if no cue was ever seen. **This multiplies Resistance and therefore moves CQ** (range 0.60 to 1.35). Reproduced: aware plus detach gives 0.65, attach plus averse gives 1.317.
- One phrase can move several instruments at once: "put it off" is a gate cue (averse), a phrase in `PHRASES` (avoidance, root 18), and a law cue (Courage). "let it go" is both a detach cue and a coherent `LEX` entry.

### 3.2 The lean: empathy and accountability, read with a frame gate

- Four phrase lists (`LEANLEX.emp, empLack, acc, accLack`) and two frame lists (`LEANFRAME.self`, the writer acting, and `.other`, the writer acted upon).
- Matching: longest first, and a longer span blocks shorter spans inside it even when the longer one was voided by negation. A negator (`LEANNEG`) within 3 words before voids a match. `leanNorm`'s `|` barrier stops the look-back at sentence ends.
- `self = selfFrame + acc`. `admit = self <= 0 ? 0 : self / (self + 2 × other)`. `malignant = (empLack + accLack) × admit`. `benign = emp + acc`.
- **The design choice is stated and correct:** with no evidence of the writer's own agency, the "lack" side is read at zero, so a person describing harm done to them cannot score malignant. A false positive here is the one error the product cannot afford, and the threshold follows from that rather than from a balanced score.
- `leanRead(r)`: `fieldMal` = the compute reading `malig` (from CQ). `trust = 0.62 × tot/(tot + 12)`. Blended `mal = fieldMal × (1 - trust) + storyMal × trust`. A channel reports `read:false` under 2 matched phrases.
- Only `benign` and `malignant` sums persist (`profile.gates.lean`). The four channel counts are session-only, so after a reload the channels read "not read" rather than zero.

---

## 4. The compute core (`engine/compute.js`, with `core.js`, `schema.js`, `intake.js`, `expression.js`, `data/compass.js`)

"Port, do not rebuild": the owner's ruling is that these bodies and signatures stay. `compute()` takes no arguments and reads shared mutable state (`S`, `DOMAIN`, `VERPMIX`, `LEANMIX`, and `W[].susc`). The front door `read.js` is the only place allowed to set that state, and it does so in one fixed order (4.10).

### 4.1 Inputs

| State | Meaning | Written by |
|---|---|---|
| `S.charge[axis]` | held charge, 0 to 10 | `applyStory`, **sliders and drag** (`ui/panels.js`, `ui/ui.js`), release, seed via profile, undo |
| `S.replace[axis]` | installed opposite, 0 to 10 | release, sliders |
| `S.law[law]` | 0 to 10, default 6 | intake answers, sliders |
| `S.doms, S.arcs, S.roots` | the soul: selected domains, archetypes, root clusters | the person, in Energetics |
| `VERPMIX` | gate cue counts | `verpApply` |

**The nine axes are directly editable by slider.** The charge a reading is built on is therefore a mix of text-matched increments and values the person typed or dragged, and nothing on the profile records which is which (the seed is the one exception, section 5).

### 4.2 The soul ring and susceptibility

`buildSoul()` builds `DOMAIN[19]`:

```
DOMAIN = zeros(19)
for i, sd in enumerate(S.doms):
    w = i==0 ? 1 : max(0.5, 0.92 - 0.14*i)
    for d: k = circular distance(d, sd) on 19 ; DOMAIN[d] = max(DOMAIN[d], w*exp(-k²/4.2))
for rn in S.roots: every domain with root rn: DOMAIN[d] = max(DOMAIN[d], 0.72)
for i, j in enumerate(S.arcs):
    c = j/12*19 + 19/24 ; w = i==0 ? 0.86 : i==1 ? 0.62 : max(0.34, 0.55 - 0.06*i)
    for d: k = circular distance(d, c) on 19 ; DOMAIN[d] = max(DOMAIN[d], w*exp(-k²/2.6))
DOMAIN = 0.08 + 0.92 * DOMAIN / max(DOMAIN)
```

`suscAll()`:

```
rootsIn = unique(roots of S.doms) ∪ S.roots
aff     = unique(AFFIN[r] for r in rootsIn)
    AFFIN = {Architect:[Apathy,Shock], Engine:[Anger,Shame,Disgust],
             Weaver:[Sad,Surprise], Witness:[Fear,Anticipation]}
for n in W:
    arc    = min(18, floor(n.slot / (108/19)))
    n.susc = (0.40 + 0.60*DOMAIN[arc]) * (n.cf in aff ? 1.3 : 1)
```

Range 0.448 to 1.3. This is the "Domain Matrix", and **domain weighting is on the owner's open list** (section 9). Susceptibility is driven entirely by self-selection. It decides which addresses a story lands on (2.5) and how strongly an axis shows at each address (4.3).

`loadProfile()` runs `suscAll()`, because an earlier build attributed stories by whichever profile had been computed last (944 of 1560 profile pairs read differently by order).

### 4.3 Per address

For every ring node `n`, with `relief = bandIg(n.b)/10`:

```
held = n.cf ? clamp(S.charge[n.cf] * n.susc * (1 - 0.42*relief), 0, 10) : 0
rep  = n.cf ? clamp(S.replace[n.cf] * (0.72 + 0.28*relief), 0, 10) : 0
sq   = clamp(held - 0.86*rep, 0, 10)
pole = clamp(rep - held, 0, 10)
jq   = clamp(rep - 6, 0, 4) / 4 * 10          # overshoot of the cure
open = clamp(1 - sq/10 + pole/26, 0, 1.18)
loaded if sq >= 4
```

Field anchors are zeroed (`sq 0, open 1`).

**The charge an address shows is not where the story landed.** `held` reads the whole axis value at every address carrying that axis, scaled by susceptibility and by the self-rated laws of that seat. The imprints' node ids from `parseStory` are thrown away by `applyStory`, which keeps only per-fetter totals. Reproduced: "My father died last year" imprints on 4 heart addresses, and after applying, all 17 Sad addresses across Root, Solar, Heart and Crown light. The per-story address survives only in the "atom" view (`ui/wheel.js`), which re-parses stored text and depends on the current soul.

**Self-rated integrity attenuates charge before it is counted.** A seat whose laws average 10 cuts held charge by 42 percent.

**The line is `sq >= 4`.** One story on a blank profile never crosses it: reproduced, "My father died last year" gives `S.charge.Sad = 3.22`, a maximum address sq of 2.41, zero loaded, and CQ unchanged at 36.00. Two stories cross (5 loaded, CQ 32.43). After three, Sad saturates at 10 and CQ settles at 28.17 no matter how many more are added. `under` counts addresses with `0 < sq < 4`, and the `unread` flag counts them so that one surface does not deny charge another surface bills for.

### 4.4 The pattern chain

**Saboteurs, two sources, in `compute()`:**

1. `sab33Detect()` (legacy, in `core.js`): levels are `S.charge` **rounded to integers**, with `anxiety` aliased to `anticipation`. For each `SAB33` row, fit += 1 inside the band, 0.5 at exactly one integer outside, else 0. `score = round(fit/parts*100)`. Kept if `score >= 60`. `w = min(10, mean level of its parts)`. In `compute()` it becomes a saboteur only if its seat (`CHG2SEAT` of its first charge) has at least one address with `sq >= 3`. `parts` = up to 4 such addresses.
2. `ALL_SAB` (the 14 named clusters plus inferred clusters): `w` = mean `sq` over the cluster's nodes. Fires if `w >= 3.7`. An overshot twin (`name + ' overshot'`, family pole) fires if mean `jq >= 3.7`.

**The field's saboteurs and `sniffStory`'s saboteurs use different rules on different inputs.** The field uses the integer staircase on `S.charge`. The contract uses the continuous ramp and geometric mean on per-story shadow. The same table can give different answers on the two surfaces. The ramp's own measurement (in `canon.js`) found it bought resolution and steadiness but no set agreement (51.4 against 51.4 on 14 profiles). The source also records that the spec's 94 and 73 could not be reproduced because the cohort is not in the repository.

Sorted by `w` descending, then:

```
complexes:  for each of 12 families (6 HCX_LIB + their 6 poles):
                fam = saboteurs with hcx == family (in sorted order)
                pair them (0,1), (2,3) ... ; cx.w = mean of the pair
hypers:     family with >= 2 complexes, or exactly 1 complex with w >= 6.5
                hy.w = mean of its complexes ; sorted by w
supers:     pair hypers (0,1), (2,3) ... ; kept if mean w >= 5.6
dist = clamp(0.19*#sab + 0.55*#cx + 1.35*#hy + 2.4*#sup, 0, 10)
```

`dist` (Distortion) is reported, but **no longer divides CQ**. The book struck it on 13 May as a double count of SQ (BOOK-ERRATA 24).

Masks: for each of six `MASKS`, `w` = mean sq over that mask's seats.

### 4.5 The quotients

```
poleMean = Σ pole over W / 108
JQ       = Σ jq   over W / 108
Ig  = clamp( mean of the 21 laws           + 0.30*poleMean - 0.42*JQ, 0, 10)   # Integrity
It  = clamp( mean over 7 seats of bandIg    + 0.22*poleMean - 0.30*JQ, 0, 10)   # Intention
DQ  = Σ over loaded of sq/10
Rz  = max(1, (1 + 0.05*DQ) * verpFactor())                                      # Resistance
CQ  = clamp(It * Ig / Rz, 0, 100)
SQm = mean sq over loaded (0 if none)
```

`Ig` and `It` are the same law scores weighted two ways. `It` weights each seat equally, so a Root or Sacral law counts twice as much as a Heart or Solar law. With nothing installed, **CQ is approximately (law mean)² / Rz.** The code's own `cqCeiling` comment says the ceiling "tracks the square of the law mean".

Reproduced sensitivity (soul `[0]`, arcs `[0,1]`):

| State | CQ |
|---|---|
| blank: charge 0, laws default 6 | 36.00 (`unread: true`) |
| laws all 10, charge 0 | 100.00 |
| laws 6, every axis at 10 | 14.99 (`Rz` 2.401, DQ 28.03) |
| laws 10, every axis at 10 | 56.10 |

The self-rated laws set the ceiling. The story can only divide it. `unread = (nothing loaded) && (no law measured) && (nothing under the line)`. With `unread` set, every surface must show "not read yet" rather than the 36 and the word Incoherent. That is a ruling.

**DQ is derived, not measured.** The book says DQ equals 100 minus CQ and is not an instrument (BOOK-ERRATA 26). The engine returns DQ as the raw sum above, the interface prints it as its own number, and it has no ceiling (measured up to 54.7 on the roster). The source flags this and does not resolve it. A port should label DQ as arithmetic, not as a reading.

The book's operational CQ form, `√(It × Ig) × 10 / (1 + 0.6·SQ/10)`, differs from the engine's ratio and is **open** (BOOK-ERRATA 25): SQ is not yet pinned to a field. The port implements the engine's ratio.

### 4.6 Secondary readouts, all pure functions of the above

```
tier     = tierOf(CQ).nm
benign   = CQ >= 50 ; malig = benign ? 0 : round((50 - CQ)/50 * 100)
X        = clamp((1 - Apathy/10)*0.3 + (1 - clamp(DQ/14,0,1))*0.7, 0, 1)
Y        = clamp((It/10)*0.6 + (1 - dist/10)*0.4, 0, 1)
Z        = clamp((Ig/10)*(1 - SQm/10), 0, 1)
radiance = sqrt(X²+Y²+Z²)/sqrt(3)
will     = (Ig/10)*(It/10) ; drag = clamp(DQ/14,0,1)*1.6 + dist/10
steer    = will >= drag ? 'forced' : 'withheld'
darkB    = seat with the highest mean sq (first on a tie)
weakL    = lowest law (first on a tie) ; dch = highest axis (first on a tie)
mask     = first of supers, hypers, complexes, saboteurs
aff      = affinity(): overlap of DOMAIN (19 arcs of 360/19°) onto 12 archetype arcs of 30°, normalised to max 1
pi, si   = the top two archetypes by aff          # self-selected soul, not the story
balance  = means of OUTWARD (Anger, Disgust, Anticipation, Surprise) and INWARD
           (Fear, Shame, Sad, Apathy, Shock); lean = (om - im)/(om + im);
           read if either mean >= 1
outward  = Σw of Predatory, Grandiosity, Mania ÷ Σw of those plus Collapse,
           Dissociation, Self-erasure, Enabling, Numbness ; null if denominator 0
organized= deepest rung reached, ORG_W {sab:0.2, cx:0.5, hy:0.8, sup:1}, null if none
gov      = quadrant(outward, organized, CQ); thresholds 0.5 and 0.5; Angel only
           when outward is null and CQ >= 71
carrying = every ring address with sq > 0, heaviest first ; heaviest = carrying[0]
```

`childFound(r)`: under `CHILD_READ = 'axis'`, one address per axis (its heaviest loaded address). Which of three meanings "child pattern" has is flagged as the owner's call. The measured counts under the three readings run from 9 to 90 on one profile.

### 4.7 `cqCeiling()` and `cqHeadroom(cq)`

The CQ that zero charge would give, computed rather than simulated. With held at 0, `pole = rep` at every address, `DQ = 0` and `Rz = max(1, verpFactor())`. This is what release can at most reach. Release cannot raise the laws.

### 4.8 `accuracy(r, profile)`: what it is and is not

```
cov  = measured laws / 21
held = addresses with sq >= 4 ; inst = addresses with pole >= 4
sig  = eff > 0 ? 1 - exp(-eff/13) : 0,   eff = held + 0.35*inst
exq  = clamp(mean expression fill / 10, 0, 1)      # exprRead(): per EXPR seat, bandIg*(1 - 1.25*load)
deg  = number of pairs present among [Collapse & Self-erasure], [Numbness & Dissociation]
pct  = clamp((10 + 43*sig + 28*cov + 18*exq) * (1 - 0.10*deg), 8.3, 99)
band = 2.85 + (1-cov)*6 + (1-sig)*8 + deg*4 + (1-rel)*1.2 + (1-exq)*3
```

The comment says it was fitted by layer ablation, with an additive MAE of 5.68 against 7.28 multiplicative. **What it was fitted against is not recorded in this repository**, and with no labelled set it cannot have been accuracy against truth. It is a completeness index: how much of the instrument has input. `band` is not a confidence interval and must never be labelled as one (`reviews/AD-field.md` 4.2). I recommend the port keep the arithmetic and rename the display.

### 4.9 The intake: how laws are set (`engine/intake.js`)

63 questions: 21 laws times three framings (left: "when it costs you", right: "when nobody would know", neutral). Per law: `score = round1(mean of the three)`. `spread = max - min`, and `reliable = spread >= 3`. Below 3 the lean is reported as "even, within measurement noise". `iqApply` writes the scores into `p.laws` and `S.law`. **This is self-report**, and it is the dominant input to CQ.

### 4.10 The front door (`engine/read.js`), in the one order it runs

```
input(profile, {story}):
    loadProfile(p)              # soul > buildSoul, axes > S.charge/S.replace, laws > S.law,
                                # gates > VERPMIX/LEANMIX (zeroed first), suscAll()
    if p.intake.answers: iqApply(p)
    if story: applyStory(story); verpApply(story); leanApply(story)
throughput(p):
    r = compute(); r.accuracy = accuracy(r, p); r.gates = verpRead();
    r.lean = leanRead(r); r.expression = exprRead(); r.sab33 = sab33Detect()
read(p, opts) = {profile, reading, snapshot: snapshot(p)}   # opts.write > saveProfile
```

`profile.story.entries` is **not** replayed. The stories are already baked into `axes`. Calling `read()` twice on one profile gives identical numbers, because accumulators are zeroed on load.

### 4.11 Release arithmetic, for completeness

This belongs to the ritual and gamification seat, and it is documented here only because it writes the same state. From `ui/release.js`, for each queued address `n`:

```
w0 = n.sq*10 ; d = -round(w0*0.21 + 2)
share = |d| / 10 / (number of queued addresses with the same cf)
S.charge[n.cf]  -= share        (clamped 0..10)
S.replace[n.cf] += share*0.62   (clamped 0..10)
```

---

## 5. The seed (`engine/seed.js`)

**What it is.** The person may state a Myers-Briggs four-letter type. The module's own header: "It is not a reading, so this module never claims to have detected one." It exists so a new field is not empty on the first day.

**The model.** Four additive terms, one per letter, from `SEED16`:

| Letter | Terms (axis: delta) |
|---|---|
| E | Anger +0.8, Anticipation +0.8, Surprise +0.5, Fear -0.5, Sad -0.5 |
| I | Anger -0.5, Anticipation -0.4, Surprise -0.4, Fear +0.6, Sad +0.5 |
| N | Anticipation +0.8, Surprise +0.6, Apathy -0.3, Shock -0.3 |
| S | Anticipation -0.6, Shock +0.4, Disgust +0.3, Surprise -0.3 |
| T | Shame -0.8, Sad -0.6, Disgust +0.5 |
| F | Shame +0.6, Sad +0.6, Disgust -0.4 |
| J | Disgust +0.6, Anticipation -0.5, Fear -0.3 |
| P | Anticipation +0.6, Fear +0.3, Disgust -0.4, Apathy +0.2 |

`seedAxes(type)`: start every axis at **3**, apply the four letters in order with a clamp to [0, 10] after each addition, then round1. Invalid types return all 3s. Measured range over all 16 types: 1.5 to 5.2. Test vectors: INTJ gives `Fear 3.3, Anger 2.5, Shame 2.2, Disgust 4.1, Apathy 2.7, Shock 2.7, Sad 2.9, Surprise 3.2, Anticipation 2.9`. ENFP gives `2.8, 3.8, 3.6, 2.2, 2.9, 2.7, 3.1, 4.1, 5.2` in axis order.

**Why additive and not sixteen written patterns.** The source's reason: "Sixteen patterns would be sixteen assertions about people, each unarguable. Four terms are four assertions, each of which can be argued, and the sixteen results follow." This is the right call for inspectability. The eight rows are the entire claim, each row has a one-line rationale in the code, and changing one moves eight types predictably. It is still a claim with no evidence behind the deltas. The E/I term is the only one with an in-engine counterpart, `balance()`, and nothing checks the seed against it.

**What it may not touch.** Charge only. Never a law, a gate or a domain, "because those are measured". (Laws and domains are self-report too. The distinction the code draws is that they are the person's direct answers, while the seed is an inference from a label.)

**`seedApply(p, type)`** **overwrites** `p.axes[c].held` on all nine axes with the seed values and records `p.seed = {type, at, axes}`. **`seedClear`** nulls `p.seed` only.

**`seedShare(p)`**: `seeded = Σ|seed[c] - 3|`, `moved = Σ|now[c] - seed[c]|`, `share = round2(seeded/(seeded + moved))`. It is 1 when untouched since seeding. Moving charge back toward the seed raises it again.

**Open, and it is the owner's.** CLAUDE.md: "A seed decay policy... whether it should fade on its own, or only move when the person moves it, is open." Today it only moves when the person moves it. Nothing fades.

Three behaviours the port should reproduce, with the owner told (defects D6 to D8, section 12): the overwrite discards any story or slider charge already on the axes; clearing the type leaves the seeded charge in place, where it becomes indistinguishable from the person's own; and `seedShare` measures against a baseline of 3, while a blank profile is now 0.

---

## 6. Birth-derived material: symbolic systems, not measurement

None of these reads the story. None writes `S.charge`, `S.replace`, `S.law` or the soul. They are pure functions of name, date, time and place.

### 6.1 `astro.js`: real astronomy, used for symbolic outputs

This is genuine computation of where bodies were in the sky, and it is correct to the precision it claims:

- `julianDay(y, m, d, hours)`: Meeus chapter 7.
- `sunLon(jd)`: low-precision series, about 0.01°. Mean longitude `280.460 + 0.9856474n`, anomaly `357.528 + 0.9856003n`, equation of centre `1.915 sin g + 0.020 sin 2g`.
- `moonLon(jd)`: 13 periodic terms, about 0.3°.
- `gmst`, `ascendant(jd, lat, lon)` with obliquity 23.4392911.
- `gateOf(lon)`: the I Ching wheel `GATE_WHEEL` (64 gates of 5.625°, 6 lines each), starting at 0° Aries. **The source flags the wheel order as "RULING NEEDED"**: it is a claim about someone else's system.
- `designJD`: Newton solve for the sun 88° of arc before birth.
- Birthplaces: `PLACE` holds **nine hard-coded towns**, with US and EU daylight-saving rules. Any other place gives no ascendant.
- `birthJD`: no time given means local noon. **No place means an offset of 0**, so local clock time is treated as UT. Moon sign then carries up to half a day of error, about 6°. The output does say `needsTime` or `needsPlace`.

### 6.2 `birth.js`: the symbolic readouts

`sunSign`, `moonSign`, `risingSign` (null without place and time), `lifePath` (digit sum of the date, keeping 11, 22, 33), `chineseYear` (turns at Li Chun, sun at 315°), `chineseElement`, `hdOf` (personality and design gates and profile; **type and authority deliberately null**, because they need the full bodygraph), `geneKey` (the sun's gate and line), and `spiritualOf(bt)`, which bundles them with `root = ELEM2ROOT[sun element]` (fire>Engine, earth>Architect, air>Witness, water>Weaver).

`converge(name, r)` compares the symbolic readings to the reading. The four checks: birth element's root against the first selected domain's root; life path's archetype (`LP2ARCH`) against the top soul archetype `pi`; cardinal sun mode against `benign` (CQ >= 50); design line 1 or 4 against not benign. It reports `agree`, `differ`, `open` and `score = round(agree/(agree + differ) × 100)` of `of` comparisons.

**What kind of claim this is.** Two of the four comparisons set a symbolic system against the person's own soul selection (self-report). The other two set it against a CQ threshold. None of them is evidence about the person, and agreement between them is not "signal" in any statistical sense, despite the header "where independent systems agree, that is the signal". I recommend the port keep the arithmetic and not call the score a confidence. It also carries `converge` on the reference-case table (`BIRTH[name]`).

### 6.3 `numerology.js`: symbolic, pure

Pythagorean letter values (`A..I = 1..9`, repeating). `numReduce` keeps masters 11, 22, 33 at every step. The Y rule: Y is a vowel only when neither neighbour inside the same name part is a vowel. Expression is reduced **per name part, then summed and reduced** (`byPart`); the flat sum is also kept, and `split` is reported when the two differ. Soul urge uses vowels, personality uses consonants. Karmic debt is read off the unreduced flat total (13, 14, 16, 19). Maturity = reduce(life path + expression). Cornerstone and capstone. Test vector: "Sofia Beatriz Alarcon", 1985-03-14 gives parts 5, 9, 1, expression 6 (flat total 87), soul 3, personality 3, life path 4, birthday 14 (reduced 5), maturity 1, no debt, no master.

`numerologyOf` reads the full name from `who.first/middle/last`, falling back to the reference table and then to the bare roster name.

### 6.4 `plan.js` is not a reading mechanism

Despite its name, it is the subscription ladder: tiers, pattern allowance (`planAllowance`), `RUN_MIN 4`, `RUN_MAX 25`, the gift of 100, and throughput comparisons (`EQUIV`). It reads nothing from the story or the field. Its one relevance here: `LEAD_SEES` lets a practitioner see fetters, saboteurs, complexes, hyper complexes and analytics, and `LEAD_HIDDEN` excludes the story cloud and the spiritual material. That is a structural privacy rule the port must keep.

---

## 7. What is learnable, and what is not

Nothing in the product learns today. The `ui.model` consent flag on the profile ("let a story with nothing identifying attached refine the reading") is stored and toggled in `ui/account.js`, and **nothing reads it**. Source AI is on the queue and undesigned.

What the privacy ruling permits (section 10): stories with no record attached. What that data can support:

- **Learnable from stories alone:** which words and frames occur, how often, in what company, and which of them the instrument currently reads as nothing. That is a vocabulary-gap count, and it needs no model. It is the highest-value thing a record store could produce.
- **Not learnable, permanently:** any supervised "which saboteur does this person have" (the label would have to come from the record), and any calibration of the 0 to 10 charge against an outcome (the outcome lives with the record).
- **Not learnable from any amount of data:** whether a reading is right. There is no ground truth. That is why every claim has to be sourced to the person's own words, and why `inferred` exists as a field.

A port that introduces an embedding model or a classifier for the sniffer would be answering a question the product has no labels for, and it would lose the property that every hit is inspectable and citable (`because` on every `sniffStory` row). In this domain a lexicon with a precedence rule beats a small model because it can be audited. The weakness is recall, not method.

---

## 8. Taxonomy

| Output | Class | Basis |
|---|---|---|
| `scanStory` hits, `parseStory` seats and intensities | **Matched from what the person wrote** | Lookups in hand-typed tables. Amounts authored, source partly undocumented |
| Imprint address names where `inferred: true` | **Arithmetic, not from the text** | Chosen by susceptibility from a self-selected soul |
| Imprint fetter where `stated` or adjective-named | **Matched from the text** (subject to D3) | The word named the axis |
| `S.charge` increments from `applyStory` | **Matched, then scaled** | `× 1/3 × 0.35`, clamp |
| `S.charge` from sliders and drag | **Self-report** | Typed or dragged |
| `S.charge` from the type seed | **Self-report, used to seed** | Four additive terms. Overwrites and never fades |
| `S.law` | **Self-report** | 63 intake answers, or sliders. Default 6 is a placeholder |
| Soul (domains, archetypes, roots), `susc`, `aff`, `pi`/`si` | **Self-report** | Picked by the person |
| `VERPMIX` > `verpFactor` | **Matched from text** | Bare substring counts, no negation |
| Lean `benign`/`malignant`, channels | **Matched from text**, frame-gated | Phrase counts with negation and a stated asymmetry |
| Per-address `held, sq, pole, jq`, DQ, CQ, tier, radiance, dist, saboteurs, complexes, hypers, supers, masks, balance, quadrant | **Derived arithmetic** over the above | Formulas in section 4. No independent measurement |
| DQ as a displayed number | **Derived, shown as if it were a reading** | BOOK-ERRATA 26, open |
| `accuracy.pct`, `band` | **Completeness index** | Fitted curve, target not recorded. Not accuracy, not an interval |
| `sniffStory` axes, saboteurs, laws, flow, gates, depth, offer | **Matched plus derived**, not shown in the UI yet | Section 2.9 |
| `path`, kink and floor | **Matched from the text**, record only | Never reaches the arithmetic |
| Sun, moon, rising, gates, gene key, profile | **Real astronomy mapped into symbolic systems** | Birth record only. Never feeds charge |
| Human Design type and authority | **Deliberately not computed** | Needs the full bodygraph |
| Life path, numerology, Chinese year and element | **Symbolic** | Digit sums and calendar rules |
| `converge` score | **Symbolic compared with self-report and a CQ threshold** | Not evidence |

---

## 9. Open, and whose call

**The owner's, from CLAUDE.md "His, not mine". Documented as they exist. Not resolved here.**

- **Schema v2.** The gates bump (`gates.verp`, `gates.lean` on the profile) is additive, and v1 still loads, with absent gates reading as zeros. It is the cross-compatibility contract with SOURCE. The port must read v1 and v2 and write v2.
- **`Root_08_Unnamed`** (node 8, Root, Cauda Equina, `c: null`). It carries no fetter, so it can never hold or clear charge. Consequence per TASKS KU13: the releasable count is 107 of 108 and the "rise" tops at 99 for everybody. The engine handles the null without complaint. Keep it null.
- **The compressed CQ mid range.** Named as open. **No definition of it exists in the repository.** I have not invented one. Ask.
- **Domain weighting.** What exists is the `buildSoul` lobe weights and the `suscAll` formula in 4.2 (`0.40 + 0.60 × DOMAIN`, times 1.3 on affine pairs). Whether those are right is open.
- **The depth button names and the Matrix wiring.** UI-side. Out of this section's scope, but on the same list.
- **Whether the kink sits at the highest charge or the lowest.** `parseStory().path` reports both. The imprint layer implicitly assumes the top by sorting on susceptibility.

**Also open in the code, found while reading:**

- Negation in the core path (`DESIGN-sniffer.md` Q3): does "not angry" mean no anger, or anger named and denied?
- Whether the lexicon is derived from the book or is a separate instrument vocabulary (Q2). 105 of 192 authored words are not in the book.
- `CHG2SEAT` against the addresses' own modal fetter: they disagree for Shame, Apathy, Surprise and Anticipation. `lexCanon` refuses rather than picks.
- `SPEC_POLE` against `CHILD.opp`: 4 of 9 poles differ, and Joy names Apathy's opposite in one table and Sad's in the other. Surfaced as `poleDiffers`.
- The book's operational CQ estimator against the engine's ratio (BOOK-ERRATA 25). DQ as derived against DQ as displayed (26).
- The `LAWCUE` roster against the `SI` roster (Ownership and Wisdom against Responsibility and Accountability).
- `LEX_DEAD`: whether a longer, specific lexicon entry should beat a shorter idiom. It currently loses by loop order.
- The I Ching wheel order in `astro.js` (flagged "RULING NEEDED").
- The seed decay policy.
- `CHILD_READ`: which of three meanings "child pattern" has.
- The tier names and their copy.

---

## 10. Privacy constraints on the mechanisms

Checked first, as it should be.

- **The ruling (DECISIONS, 18 September):** a person gets a key. The record, which identifies, is never held joined to the story. The story without the record is what refines models. Nobody's data is ever sold.
- **What that means for the port today:** the profile object (schema v2) holds `who` (first, middle and last name, sex, birth date, time and place) and `story.entries[].text` (raw story text) **in the same object**. On the device that is the person's own data and it is permitted. **Any sync, backup or account layer the desktop build adds must not upload the profile as is.** The story has to be split off, keyed, and stripped of `who` before it leaves the machine. That is structural, not a setting.
- Numerology reads the full birth name, and the ascendant needs birthplace and time. These are identifying inputs to symbolic outputs only. They never need to leave the device for any computation here.
- A practitioner never sees the story or the spiritual material (`LEAD_HIDDEN`).
- Every mechanism in `engine/` is host-free (no `document`, `window`, `fetch` and so on, enforced by `hostfree.py`). Keep the engine pure in the port, so the reading can never be the thing that sends data.

---

## 11. Reproducing the numbers exactly

### 11.1 Rules

1. **Port the tables verbatim, including order.** Key order in `LEX` decides ties in the longest-first sort. `NODES` order decides slots, `W` order, `SEATPRIM`, the imprint fallback `all[0]`, and every "first on tie" choice. Several `Object.keys` iteration orders are load-bearing: `wanted`, `stated`, the modal tally, `named` ties.
2. **Run the three load-time passes** (canon, fold, composite) in that order after the axis list exists, before any scan.
3. **Keep the four normalisers separate** (2.1).
4. **Rounding is part of the behaviour.** Imprint amounts round to 0.1 before summing. `sabLevels` rounds axes to integers. `seedAxes` rounds to 0.1. `snapshot` rounds CQ to 0.1 and DQ to 0.01. Do not round anywhere else, and do not round less.
5. **Clamp after each step where the source does.** `seedAxes` clamps after every single letter delta, not once at the end.
6. **The divisor for pole and jq means is the literal 108**, not the node count.
7. **Floating point:** the source is IEEE double JavaScript. `Math.round` rounds half up, toward +∞. A port in another language must match that (Python's `round` does not).
8. **Shared state and order of operations:** `loadProfile` zeroes then loads the gate mixes, rebuilds the soul, then runs `suscAll()`. `applyStory` must see the current profile's `susc`. Story application order is `applyStory`, `verpApply`, `leanApply`.
9. **Do not add** negation, stemming, subject handling or a model to the core path. Each is an open ruling, and each changes every reading.

### 11.2 Test vectors (soul doms `[0]`, arcs `[0,1]`, roots `[]`; laws 6; charge and replace 0; mixes zero)

| Input to `parseStory` / `applyStory` | Imprints (name, fetter, amt) | `S.charge` after `applyStory` |
|---|---|---|
| `I am so angry at him` | Pride, Arrogance, Competition, Anger: Anger 1.5 each | Anger 2.38 |
| `My father died last year` | Separation, Martyrdom, Longing, Closed Heart: Sad 2.3 each, **inferred** | Sad 3.22 |
| `I am exhausted` | Pride: **Apathy 8.7, stated** | Apathy 3.045 |
| `I feel calm and grateful` | none (bands empty) | none. The UI refuses to commit |
| `I am angry and exhausted` | Pride, Arrogance, Competition, Anger: Anger 2.5 each | Anger 3.78, Apathy 0 |
| `i cannot stop thinking about it` | phrase `cannot stop` (sacral 18): Addiction, Lust, Shame Of Desire, Hypersexuality: Apathy 1.5, inferred | Apathy 2.1 |
| `I am not angry` | identical to "angry" | Anger 2.38 |
| `I was furious. Then I felt calm.` | four Anger imprints at 2 | Anger 2.994 (8.8 × 0.35 minus 12/140) |
| `resentment` | four Anger imprints at 2, inferred | Anger 2.8 |

`compute()` checkpoints: blank gives CQ 36.00, `unread: true`. Every axis at 10 gives CQ 14.99, DQ 28.03, 47 loaded, Rz 2.401, tier Severe. Laws at 10 gives CQ 100.00. `sniffStory('I noticed it and let it pass. I went with it and took it personally.').gates.intentional.avoidance` = 33.6.

Astronomy: `spiritualOf({d:'1985-03-14', t:'04:20', p:'Asheville, NC'})` gives sun Pisces, moon Capricorn, rising Aquarius, Chinese Ox, element Wood, life path 4, personality gate 22 line 6, design gate 11 line 2, profile 6/2.

The existing gate `tests/engine.js` asserts contracts rather than numbers. The port team should run their build against the vectors above and against `tests/engine.js` ported, not against a screenshot.

---

## 12. Defects found while writing this, each reproduced against `engine.js`

Reported so the owner can rule. None was fixed here. The ones marked "ruling" change readings and need his call first.

- **D1. A stated fetter can print an unrelated address name as a finding.** `parseStory('I am exhausted')` returns one imprint `{name:'Pride', fetter:'Apathy', inferred:false, stated:true}`, because the stated branch places the charge at `all[0]`, the first solar address. `ui/imprints.js:81` labels a ghost chip with the address name unless `inferred` is true. So, going by the code (I have not seen it on screen), the story page prints "Pride" for "I am exhausted", which is the exact reading the source says it removed. `sniffStory` likewise offers Apathy release at "Celiac Plexus", the Pride address. Fix direction, needs ruling: mark stated-branch imprints so the renderer shows fetter and seat, not `n.k`.
- **D2. The composite is not split.** `LEXCOMP` says resentment is "split rather than doubled". In `sniffAxes`, the imprint layer has already carried the whole amount to Anger, and the composite then adds `amt/3/2` to both Anger and Apathy on top. Measured, "i feel resentment": Anger 10 (8 + 4, clamped) and Apathy 4. The total load rises rather than dividing.
- **D3. Stated and wanted fetters are text-wide, so one seat's word re-labels another seat's charge.** Ruling. Measured:
  - "I was terrified and exhausted": the solar (exhaustion) charge is filed as **Fear** on Perfectionism, Force and Rigidity, not inferred, and part of the root (terror) charge is filed as **Apathy** on Escapism.
  - "I am exhausted and heartbroken": the whole exhaustion charge (8.7) lands on Unworthiness as **Sad**.
  - "I am exhausted. I am not angry.": the exhaustion becomes Anger (the negation is ignored, and "angry" then claims the solar seat).

  The known case "angry and exhausted" (TASKS SN3) is one instance of this. The cause is that `stateHere` is true whenever any stated fetter exists anywhere in the text, which bypasses the quarter rule on every seat.
- **D4. The dead-row gate has a blind spot.** `tests/engine.js` treats a `LEX` key as reachable if any hit has `t === key`. `running on empty` is both a phrase (heart 28, despair) and a `LEX` row (solar 26, stated Apathy). The phrase hit satisfies the gate, and the `LEX` row never lands. Filtering on `kind === 'word'` finds three dead rows, not the two `LEX_DEAD` names. By the owner's exhaustion ruling, "running on empty" should read as Apathy at the solar plexus, and it reads as despair at the heart. This is a probe that lies, the same class CLAUDE.md warns about.
- **D5. `verpScan` has no word boundaries and no negation**, unlike the other three matchers. "unignored" counts as ignoring, and it moves CQ through `verpFactor`.
- **D6. Seeding overwrites existing charge.** Choosing a type at any time replaces all nine axes, including charge from stories and sliders, with no undo entry pushed.
- **D7. Clearing the seed leaves the seeded charge** on the axes with no record that it came from the seed.
- **D8. `seedShare`'s baseline is 3, while a blank profile is now 0.** Measured on ENFP: back at true blank it reports 0.17 of the field still the seed, and at all-3 it reports 0.5. The share it prints is measured against a baseline the product retired.
- **D9. Documentation drift:** `schema.js:167` says a stated type "writes real values onto" the laws through `seedApply`, and `seed.js` says it never touches a law. The code agrees with `seed.js`. `lexicon.js` calls law violations "the input to the coherence number", and in the shipped product they are not.
- **D10. `ADJ2CHG` has eight rows that name nothing**: seven map to `joy`, and `anticipation` maps to `anticipation`. `CHG2FET` has no route for either. The `anticipation` row is covered by its stated fetter. The seven `joy` rows are labels with no effect on the reading.
