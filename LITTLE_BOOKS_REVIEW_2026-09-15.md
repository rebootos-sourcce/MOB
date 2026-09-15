# THE LITTLE BOOKS REVIEW
**2026-09-15 · five passes over the handshake and the doc set · Claude Code**

Read against the voice rules, the canon rulings and the five gates.
Every finding below is checked, not inferred. Line references included.

---
---

# 0 · THE BLOCKER, STATED FIRST

**The eleven volumes are not in this session.**

The repository holds one file, `index.html`, 5.9 MB. That is the source
manuscript, *The Mechanics of Being*, rendered. Git history has never held
anything else. Checked with `git log --all --diff-filter=A --name-only`.

The upload holds ten files. Nine documents and the generator shell.

The handshake manifest in section 11 describes roughly a hundred files.
Ten arrived. The book content is in the ninety that did not.

**Missing, and each one is load bearing.**

| Missing | Why it stops the work |
|---|---|
| `volumes/*.json`, twelve specs | **This is the books.** All 99 pairs, prefaces, circuit pages, cascades, impact lines, saboteur lines. Without it there is no text to pass, mark or replace. |
| `bodymap.py` | `build_volume.py` line 14 imports it. The generator will not start. |
| `compose/` six modules | ladders, pairs, caps, adj, compose2, money_duty. The composition layer. |
| `assets/crown.png`, `crown_light.png` | Every cover and every gold seal. |
| 22 PDFs | The built state. Nothing to render and look at. |
| `LETGO_CLEAN_v1.md`, sort, index | The corpus. The shame objects come from here and nowhere else. |
| `plates/`, 45 scans | The strongest evidence artifact in the manuscript. |
| `SOMATIC_BOOKS_MASTER_SPEC_v2.md` | The physical and structural spec. |
| `RULINGS_LOG`, `CIRCUIT_PAGES_VOICE_PASS` | The review sheets. |
| Cover system and marks HTML | The ruled design. |

**Proof the generator cannot run:**

```
$ python3 build_volume.py
ModuleNotFoundError: No module named 'bodymap'
```

It fails at import, before any spec is read. Section 12 of the handshake,
the handoff test, cannot be executed as written.

**What is needed:** zip the working directory that holds `generator/`,
`volumes/`, `plates/` and the corpus files. Then the books can be worked.

Everything below is what could be done without them, and it is not nothing.

---
---

# 1 · WHAT THE FIVE PASSES FOUND

Eight defects. Two are in the shipped manuscript. Three are in the
generator. Three are contradictions across the documents.

Ranked by what they cost.

---

## 1.1 · THE MANUSCRIPT SHIPS THE OLD 108 ARCHITECTURE

**Severity: canon violation, currently public.**

The handshake rule is absolute. *The node count is 114. Never say 108.*
The agent package lists it first among the corrections, and notes it
appeared four times in the old package.

Appendix B is correct. The distribution table reads Root 16, Sacral 16,
Solar 16, Heart 15, Throat 12, Third Eye 12, Crown 19, Anchor 6, Field 2.
Total 114. The master table runs clean to 114, with *Limb and Anchor Nodes*
opening at 107 and the two field nodes, Earth Star and Soul Star, at
113 and 114.

**The Pattern Catalog does not.** It carries a second, parallel node
listing. Its final band heading reads:

> `Crown, Union, Divine Perception (88-108)`

It stops at 108. Node 108, Endless Seeking, is filed under Crown. The
distribution table puts 107 through 112 under Anchor, not Crown. And
nodes 109 through 114 are absent from the catalog entirely.

That is the superseded architecture, sitting in the book, contradicting
the appendix forty lines above it.

**Every other use of 108 in the manuscript is legitimate** and should be
left alone. Checked all seven occurrences:

| Where | Use | Verdict |
|---|---|---|
| Technique, Count to 108 | revolution count | correct |
| 112 points x 108 patterns = 12,096 | patterns per point | correct |
| Evidence tier note on 12,096 | same derivation | correct |
| Master table row 108 | a row number | correct |
| **Pattern Catalog band heading** | **node count** | **wrong** |

**Fix:** the Pattern Catalog band heading becomes `(88-106)`, and the
catalog extends to cover 107 through 114 using Appendix B as the source.
One heading and six rows. It cannot be done here because the catalog is
rendered inside `index.html` and the fix should come from whatever
generates that file, not from a patch to built output.

---

## 1.2 · THE CASCADE GATE MEASURES AGAINST THE WRONG STEM

**Severity: the 88 word floor is not actually 88.**

`build_volume.py` line 91:

```python
CHARGE_STEM = "I'm letting go of believing, perceiving, thinking, behaving, acting, feeling that I am"
```

That is six channels. Thirteen words.

`CASCADE_GRAMMAR_v1.md` rules nine, under Measured Constants:

> **Nine channels, not six.** Believing, perceiving, thinking, behaving,
> acting, feeling, speaking, saying, voicing.

The handshake repeats it in section 5. *Stem, nine channels.*

The nine channel stem is sixteen words. The gate subtracts thirteen.

```python
def cascade_words(text, stem):
    return len(text.split()) - len(stem.split())
```

**Every charge is measured three words longer than it is.** A cascade of
85 true words reports as 88 and passes. The floor is operating at 85.

This matters most exactly where it should not. The composed cascades are
the ones the floor exists to catch, and they are the 144 awaiting a keep
or replace mark. Three words of slack across eight volumes is the
difference between a gate and a formality.

**Fix:** one line. Set `CHARGE_STEM` to the nine channel form. Then re-run
the gate across all eleven and expect new failures. Those failures are the
gate working, not a regression.

---

## 1.3 · THE GATE REPORTS A DENOMINATOR IT NEVER TESTED

**Severity: the build log overstates coverage by half.**

Lines 110 and 121:

```python
print(f"\n  CASCADE GATE: {len(fails)} of {len(v['pairs'])*2} below {MIN_CASCADE} words")
...
print(f"  CASCADE GATE: all {len(v['pairs'])*2} clear {MIN_CASCADE} words")
```

`len(pairs) * 2` is 18. Charges and installs.

But the loop above it only ever walks charges:

```python
for p in v["pairs"]:
    c = cascade_words(p["charge_text"], CHARGE_STEM)
```

Nine tested. Eighteen reported. The ruling behind this is correct, and it
is written into the comment: the floor applies to the charge only, because
installs run 45 to 92 words and about 60 percent of the charge. The logic
is right. **The message is wrong.** A green line reading *all 18 clear 88
words* is a claim about nine installs that were never looked at.

The handshake rule is *render and look at the output before claiming it
works.* This gate claims something it did not look at.

**Fix:** `len(v['pairs'])` not `len(v['pairs'])*2`, and say charges.

---

## 1.4 · `DICTATED_EXEMPT` IS DEAD

**Severity: low, but it is a ruling with no effect.**

Line 90 sets `DICTATED_EXEMPT = True`. Grep across the file returns one
hit. It is never read.

The exemption is real and it works, but it is implemented implicitly,
through a different mechanism, at line 118:

```python
if strict and len(dictated) < len(fails):
    raise SystemExit(...)
```

The build halts only if some failure is **not** Lance's. That is the
correct behaviour and it matches the ruling. But the constant that appears
to control it controls nothing. Anyone setting it to `False` to tighten
the gate will get no change and will not know why.

**Fix:** either wire it into the line 118 condition, or delete it and let
the comment carry the ruling.

---

## 1.5 · SHAME IS RULED A COMPLEX AND THE GENERATOR STILL SAYS ROOT

**Severity: a canon ruling that did not propagate.**

Three sources, two answers.

| Source | Says |
|---|---|
| `HANDSHAKE.md` line 50, volume table | **Complex** |
| `HANDSHAKE.md` line 146, canon | *Shame is a complex.* Lower back, then solar, then upper back, then depowering into the throat. |
| `PUBLISHING_BRIEF.md` line 24 | Root |
| `build_volume.py` BANDS | `"SHAME": ("Root", "#A02E2E")` |

Compare how Grief was handled. Grief was ruled a complex on the same day
and the generator carries the note:

```python
"GRIEF":   ("Heart",     "#1B6353"),   # complex: Solar, Heart, Throat
```

Shame has no such note. It reads as a plain Root volume.

The colour and the band slot may well be correct to leave alone. Grief
kept Heart. But Grief's ruling is recorded at the code and Shame's is not,
and the publishing brief is telling an external reader that Shame is a
Root volume when canon says otherwise.

This is also item 32 on the running log, still open, because Shame moving
to Root left the Throat charge vacant. Answer sheet B7 asks what sits
there. Unanswered.

**Fix:** mirror the Grief comment in BANDS, and correct the brief. The
band question itself is Lance's, not mine.

---

## 1.6 · COURAGE IS PRICED THREE WAYS AND ITS STATE IS CONTESTED

**Severity: an external-facing document disagrees with canon.**

| Source | Price | State |
|---|---|---|
| `HANDSHAKE.md` line 159 | **$11** | Ruled. *Lead magnet is a sampler, not Courage.* |
| `PUBLISHING_BRIEF.md` line 87 | $9 | *Recommendation: reposition as a lead magnet.* |
| `ANSWER_SHEET.md` B2 | $9 | Open question. Standalone or lead magnet. |
| `RUNNING_LOG.md` item 48 | - | Open, marked **L** |

Two conflicts in one item.

**The price.** Canon says 11. Two documents say 9.

**The state.** The handshake files Courage under *canon ruled in this
thread* and states the lead magnet is a sampler. The brief recommends the
opposite, and the answer sheet and running log both still carry it as an
open decision.

The publishing brief is the document marked *for external handoff*. It is
currently the one carrying the contradicted figure.

**Fix:** Lance confirms 9 or 11, and whether the handshake ruling stands.
Then one number goes into all four. This is a one word answer and it is
sitting in three documents.

---

## 1.7 · SABOTEUR COUNT, 31 OR 32

**Severity: low. A figure in a planning document.**

`PUBLISHING_BRIEF.md` section 2, describing the Compendium:

> holds 114 addresses, 41 clusters, 10 complexes, 6 hypercomplexes,
> **31 saboteurs**, 12 archetypes, 18 domains

The manuscript's own section heading:

> The Saboteur Library · **32 Entries**

The manuscript is the source. The brief is extracted from it. The brief
should read 32, or the manuscript heading is wrong. One of them is.

The other figures in that sentence check out against canon. 114 addresses
is correct. It is the saboteur count alone that drifts.

---

## 1.8 · MONEY AND CREATE HOLD THE SAME COLOUR

**Severity: latent. Fires only if CREATE returns.**

```python
"CREATE":  ("Sacral",    "#E06A0E"),
"MONEY":   ("Sacral",    "#E06A0E"),   # takes the sacral slot CREATE vacated
```

Identical hex. The comment is honest about why. MONEY took the slot when
CREATE went on ice.

Answer sheet B3 asks whether CREATE comes back. If the answer is yes,
two volumes in an eleven or twelve volume series ship in the same field
colour, and the colour is the primary way a reader tells them apart on a
shelf.

Not a defect today. It becomes one the day B3 is answered yes, and that is
the wrong day to discover it.

---
---

# 2 · WHAT PASSED

Checks run that found nothing. Worth stating, because a review that only
reports faults is not a measurement.

**The em dash rule holds, completely.** Zero em dashes in 91,603 words.
Zero en dashes. Checked the rendered text and the raw HTML, including
`&mdash;` and `&#8212;` entities. Nothing. This is the hardest voice rule
to hold at length and it is held.

**The arithmetic is consistent everywhere it appears.**

| Figure | Derivation | Sources agreeing |
|---|---|---|
| 99 pairs | 11 volumes x 9 | running log |
| 198 impact lines | 99 x 2 sides | handshake, running log, answer sheet |
| 144 cascades | 8 volumes x 9 pairs x 2 | handshake, answer sheet |
| 114 nodes | 112 body + 2 field | manuscript distribution table, master table |
| ~620 unaddressed | 634 corpus less 18 live | handshake sections 6 and 8 |

**Page counts agree** across the handshake and the publishing brief on all
eleven volumes, including the four that run 33 and 34.

**Which eight volumes need the cascade pass is consistent.** Eleven less
ANXIETY, MONEY and DUTY, the three sourced from Lance. Eight. Correct in
all three documents that mention it.

**Node 2 confirms the Shame ruling.** Appendix B gives node 2 as Shame at
the Pudendal Nerve, Root. That is exactly what the canon addendum says the
library agrees with, against Product Bible 9.6. The addendum is accurate.

**The 114 architecture is internally sound in Appendix B.** The band ranges
sum to 114 with no gap and no overlap. Only the Pattern Catalog breaks it.

---

## One near miss

`RUNNING_LOG.md` item 3 reads *Cascades, 8 volumes, **144 pairs***.

It is 144 cascades. 72 pairs. Each pair is a charge and an install.
The answer sheet gets it right at D1, *144 cascades across eight volumes*.
The running log says pairs where it means cascades.

Small, and worth fixing, because 144 pairs would be a different and much
larger job than the one actually outstanding.

---
---

# 3 · THE GRAMMAR, READ FIVE TIMES

Not a defect list. What the five passes taught, so the composition work
can proceed the moment the corpus arrives.

**The load bearing ruling is the bell curve.** Every charge escalates
while awareness holds the story, and every charge deflates. Seven
vocabularies, one curve. Awareness plus story is the fuel. The manuscript
carries this at Axis 02, in Lance's own words: *the ascending side builds
the primary node, the descending side produces the shame cluster.* And the
consequence, which is the operational part: *the anger node cannot clear
without the shame cluster that formed on the descending side. Work the
ascending nodes first.*

That is why the shame gate is four rungs and always in that order. It is
not a stylistic tic. It is the descending side of the curve, and it is the
most consistent structure in the corpus because it is the most mechanical.

**The shame object cannot be generated, and the grammar document is right
about why.** It never attaches to the feared event. Across the nine
dictations it attaches to having had the charge, or what the charge cost,
or the behaviour it produced. Time lost waiting. Worrying for nothing. Not
standing tall. Those are not derivable from the charge word. They are
autobiographical.

This is the single reason the 144 composed cascades need Lance rather than
another pass from me. Everything else in the cascade is derivable. The six
movements, the five attachment forms, the ladder vocabulary, the install
shape, the 60 percent length ratio, the close. The shame object is not.

**Where the corpus is silent it gets flagged, not invented.** The grammar
document rules this and the handshake repeats it as absolute. *Never
interpolate a somatic address. Ever.* The same discipline applies to the
shame object. A flagged gap is a working state. An invented one is a
defect that reads as finished.

**The install opens three ways and never twice the same.** *I know that I
am.* Or *I'm not [charge], because.* Or straight on from *because.* Nine
dictations, nine different openings. The two strongest closes are
fragments. *Steady. Calm. At peace.* That is the target and it is not
reachable by lengthening.

**The vocabulary has a floor and a ceiling.** Never apprehensive, fearful
or panic-stricken. Scared, afraid, terrified, petrified, frozen,
paralyzed. No named apex moment. No arbitrary numerals. No floating rung.

---
---

# 4 · WHAT IS ACTUALLY OUTSTANDING

The handshake's section 9 list is accurate. Nothing on it has been
completed since it was written, because the material to complete it did
not arrive.

Re-stated with what each one is truly blocked on.

**Blocked on Lance, and only Lance.**

| | Item | Why it cannot be done for him |
|---|---|---|
| 1 | Ten energy pages | Every line must state something checkable. That is a somatic read. |
| 2 | Money's circuit page | The only one still composed. |
| 3 | Ten back covers | Written in the shape he dictated for Anxiety. |
| 4 | 144 cascades, keep or replace | The shame objects. Section 3 above. |
| 5 | 198 impact lines | Four physical observations per side, against a body. |
| 6 | Communications Guide sequence | Dictation. |
| 7 | MOB epilogue, Johanna scene | Dictation. |
| 8 | Split the Immature entry | 8,726 words. Boundaries, not judgement. |
| 9 | Law counts | 40 or 55. Three documents, three answers. |

**Blocked only on the files arriving.** These need no ruling from him.

- The 108 fix in the Pattern Catalog. Source file needed, not the built HTML.
- The three generator fixes. 1.2, 1.3, 1.4 above. Ten minutes once `bodymap.py` is present.
- Cluster groupings from address overlap.
- Propagate the two complexes and the two poles into Atüned.
- Full print wraps, front, spine and back as one file.
- Reselect each volume's nine pairs against the marked direct hits.
- Audit the card deck against Appendix B.

**Blocked on a decision that precedes everything.** Answer sheet E1.
Publishing business or licensing business. Practitioners convert on twelve
of seventeen modelled products. The largest consumer segment converts on
almost nothing except a free diagnostic. The answer sheet says let it sit
for a week. It has been twelve days.

---
---

# 5 · THE HONEST STATE

The handshake's one-line state is still true and still the right summary.

*Eleven print-ready volumes exist with a working generator and five
automated gates. Every preface and ten of eleven circuit pages are the
author's. The energy pages, back covers and 144 of 198 cascades are not,
and that is the remaining work.*

Two corrections to it, from this review.

**The gates are five, and one of them is measuring three words short.**
Finding 1.2. It has been reporting green on cascades that do not clear the
floor. The number of affected cascades is unknown until the specs arrive.

**Nothing reads PENDING, and that remains the right claim.** It is worth
protecting. A flagged gap and a composed placeholder look identical on a
rendered page, and only one of them is honest. The 144 cascades are
composed, not missing, and they are marked as needing a pass rather than
presented as finished. That distinction is doing real work in this project
and it should survive contact with a deadline.

---

## WHAT I NEED TO CONTINUE

One archive. The working directory containing `generator/` with
`bodymap.py`, `compose/` and `volumes/`, plus `assets/`, `plates/` and the
`LETGO_*` corpus files.

With those present, in order: the three generator fixes, then the gate
re-run across all eleven to find what 1.2 has been hiding, then the full
print wraps and the cluster groupings, then the pair reselection against
the marked direct hits.

The cascades, energy pages, back covers and impact lines wait for Lance.
They are not craft problems and no amount of composition will close them.
