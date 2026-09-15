# THE ORIGINAL LITTLE BOOKS · INTAKE
**2026-09-15 · five volumes consumed · Claude Code**

*The Little Book of Reprogramming*, five of a planned nine.
Courage, Power, Love, Insight, Stability. Read end to end, measured, and
set against the current eleven.

This is the first genuinely new material in the session. It is not the
eleven Somatic Books. It is their ancestor.

---
---

# 1 · WHAT ARRIVED

| File | Title on page one | Band | Pages | Pairs |
|---|---|---|---|---|
| Courage RED | *Reprogramming: Courage* | Root | 35 | 16 |
| POWER YELLOW | *Reprogramming: Power* | Solar Plexus | 32 | 16 |
| LOVE GREEN | *Reprogramming: Love* | Heart | 29 | 16 |
| INSIGHT INDIGO | *Reprogramming: Insight* | Third Eye | 28 | 16 |
| EARTHSTAR BLACK-SILVER | *Reprogramming: STABILITY* | Earthstar | 21 | 10 |

**Trim, all five:** 396 × 612 pt. 5.5 × 8.5 in. Ratio 1.5455.
The current series is 306 × 492, ratio 1.6078, within 0.006 of φ.
The trim changed and the new one is the golden section. The old one is not.

**Imprint:** `www.thelittlebookof.com`, `thelittlebookof@gmail.com`.
Not Tula Unified. Not sharinghuman.com. A different house.

**Dedication, Courage:** *For Keely.* The manuscript spells the same person
Keeley, in the Burning Man and Sacramento passages. One of the two is wrong.

---
---

# 2 · THE ORIGINAL SERIES IS NINE, AND IT IS THE 114 ARCHITECTURE IN EMBRYO

Both Courage and Stability carry the same series page. Nine volumes:

| Volume | Chakra | Transform |
|---|---|---|
| Courage | Root | Fear into Safety |
| Wonder | Sacral | Shame into Joy |
| Power | Solar Plexus | Guilt into Confidence |
| Love | Heart | Grief into Connection |
| Will | Throat | Silence into Expression |
| Sight | Third Eye | Illusion into Insight |
| Source | Crown | Separation into Unity |
| Stability | Earthstar | Instability into Grounding |
| Purpose | Soulstar | Identity into Authenticity |

**Seven chakras plus Earthstar and Soulstar.**

Those last two are nodes 113 and 114 in current canon. Appendix B calls
them the field nodes, the poles of the torus, Earth Star below the feet and
Soul Star above the head. The original series gave each of them a book.

**And the arithmetic lands.** Every chakra volume measured carries sixteen
pairs. Courage 16, Power 16, Love 16, Insight 16. Four of seven confirmed
directly, counted two ways, by heading and by impact line.

Seven chakra volumes at sixteen is **112**.

The manuscript states it exactly: *The 114-node architecture is 112 nodes
within the physical body and 2 field nodes just outside it.*

The original series is where the 112 comes from. Seven bands of sixteen,
plus two poles. The current distribution redistributes the same 112
unevenly, Root 16, Sacral 16, Solar 16, Heart 15, Throat 12, Third Eye 12,
Crown 19, Anchor 6. Same total, different partition.

Stability breaks the pattern at ten pairs, not sixteen. A field volume, not
a band volume. Consistent with it being one node rather than a band.

**One naming drift.** The series page calls the Third Eye volume *Sight*.
The book itself is titled *Insight*. Stability is consistent, the file is
named for the chakra and the book for the state.

---
---

# 3 · THE STEM WAS SIX CHANNELS, AND THE GENERATOR INHERITED IT

**This changes finding 1.2 in the review. Materially.**

Every cascade in all five originals opens on six channels:

> *I'm letting go of believing, perceiving, thinking, behaving, acting, and
> feeling that I am...*

Believing, perceiving, thinking, behaving, acting, feeling. Six.

`build_volume.py` line 91 carries exactly that. I called it a defect. It is
not a typo. **It is a fossil.** The generator inherited the stem from these
books, where it was correct.

The nine channel form is later. `CASCADE_GRAMMAR_v1.md` dates it
2026-09-03, measured from Lance's nine ANXIETY dictations, and states the
correction in those words: *Nine channels, not six.* The handshake repeats
it as canon in section 5.

So the honest diagnosis is not that someone mistyped a constant. **It is
that the grammar ruling landed and the generator was never updated.**

**And there is a fork I cannot close without `volumes/*.json`.**

Either the eleven volumes carry nine channel stems, in which case the gate
is measuring against the wrong stem and the floor has been running at 85,
which is what the review says. Or the eleven still carry six channel stems
inherited from these originals, in which case the gate is calibrated
correctly and **the volumes themselves are off-canon**, which is worse.

One of those two is true. Both need the same file to settle. I have
corrected the review to state the fork rather than assert the first branch.

**The stem was never locked in the originals.** Five variants across
fifty-five cascades:

| Count | Form |
|---|---|
| 18 | `...acting, and feeling that I am` |
| 13 | `...acting, feeling that I am` |
| 12 | `...acting, feeling that i am` |
| 11 | `...acting, feeling I am` |
| 1 | `...acting, and feeling I am` |

The `and` drifts in and out. The `that` drifts in and out. And twelve
cascades carry a **lowercase i**, which is a typographic defect in a
printed book.

That instability is almost certainly why the current generator treats the
stem as furniture and holds it in one constant. The fix was correct. It
just froze the wrong generation of the stem.

---
---

# 4 · COURAGE WAS VOICE-PASSED AND THE OTHER FOUR WERE NOT

**The sharpest finding in this intake, and it repeats finding 1.0 exactly.**

All five share a *How to Use This Book* page. Same boilerplate. One clause
differs:

| Book | The clause |
|---|---|
| **Courage** | do not take the words personally**;** they are mirrors |
| Power | do not take the words personally**—**they are mirrors |
| Love | do not take the words personally**—**they are mirrors |
| Insight | do not take the words personally**—**they are mirrors |
| Stability | do not take the words personally**—**they are mirrors |

Em dash count, measured:

```
COURAGE    0
POWER      2
LOVE       2
INSIGHT    2
EARTHSTAR  2
```

**Courage is clean. The other four are not.** The same two em dashes sit in
the same shared page in all four, and in Courage both were converted to
semicolons.

Someone applied the rule to Courage and stopped. Courage is the one that
went to print at $9.

This is the same failure mode as finding 1.0, where the em dash sits in the
generator's ISBN fallback and reaches all eleven current volumes. **The rule
is held wherever someone looked and broken everywhere they did not.** It is
not a discipline problem. It is a coverage problem, and a grep closes it.

Courage's How-to also reads differently in substance, not only punctuation.
*Integrating your shadow until only light exists*, and *recognize your
Awareness as the witness*. The other four say *until it no longer exists*
and *recognize the soul (awareness) as the witness*. Courage is a later
revision. The other four were never brought forward.

---
---

# 5 · WHAT THE ORIGINALS PROVE THE GRAMMAR DOCUMENT IS RIGHT ABOUT

`CASCADE_GRAMMAR_v1.md` lists what Lance never does. The originals do those
things, which is the strongest possible evidence that the document is a
genuine correction of earlier work rather than a rule invented after the
fact.

**Forbidden vocabulary, present.** The grammar says *no apprehensive, no
fearful*. Courage's Fear cascade runs *fearful, unsafe, unguarded*. Courage's
Distrust cascade runs *critical, apprehensive, impatient*. Both words, in the
book, in the charge.

**Floating rungs, everywhere.** The grammar rules that a rung never floats,
that it attaches by one of five forms. The originals are flat adjective
lists. *Scared, nervous, worried, concerned, anxious, tense, restless,
unsure, insecure, shy, cautious, hesitant.* Twelve rungs, nothing attached,
no object carried.

That single difference is the distance travelled between the two series. The
originals name states. The current cascades hang every rung on the charge.

**No shame gate.** Embarrassed, humiliated, ashamed, guilty in that fixed
order does not appear. Shame is a pair of its own in Courage, not a movement
inside every cascade.

**A fourth install opener.** The grammar rules three. Insight's Truth install
opens *I am certain that I am truthful*, which is none of them. One
occurrence, and it reads like the opener that got dropped.

---
---

# 6 · WHAT IS DIRECTLY USABLE

Two things in these books are source material in Lance's own hand, which is
the standard the working rules demand. *Never interpolate. If it is not in
canon or dictated, it does not go in.*

## 6.1 · Five energy pages exist, in the exact specified format

`ANSWER_SHEET.md` C1 specifies the energy page: *short lines, one thought
each, closing on a when closed and when open pair. Every line must state
something checkable.*

Every one of these five books carries that page, and four carry the closing
pair verbatim as labelled lines.

> **Solar Plexus Energy.** *When closed: The body holds back because it does
> not think it is safe to take up space or move forward. When open: The body
> supports action and you feel capable of following through.*

> **Heart.** *When closed: The body guards connection because it believes
> vulnerability will lead to harm. When open: The body can stay open while
> still feeling safe and intact.*

> **Insight.** *When closed: The body watches for threat because it does not
> trust what it sees. When open: The body can recognize what is real without
> scanning for danger.*

> **Earthstar Energy.** *When closed: The body stays ungrounded because it is
> unsure it belongs here. When open: The body settles and feels like it has a
> place.*

Courage's Root page carries the same pair, run into the prose rather than
labelled.

**Five bands covered:** Root, Solar Plexus, Heart, Third Eye, Earthstar.

Against the ten volumes still needing an energy page, the bands map like
this:

| Volume needing a page | Band | Source present |
|---|---|---|
| Shame | Root | **Courage** |
| Anger, Burnout, Drive, Worth, Control | Solar | **Power** |
| Grief | Heart, complex | **Love** |
| Voice | Throat | no, *Will* not uploaded |
| Money | Sacral | no, *Wonder* not uploaded |
| Duty | Crown | no, *Source* not uploaded |

**State this carefully.** These are band pages, not volume pages. Five solar
volumes cannot ship one page between them. What exists is authentic
author-written material at the right altitude and in the right shape, for
seven of the ten, which is a far better starting point than a blank page and
very far from a finished one.

**The three missing volumes are the three missing bands.** Wonder, Will and
Source would cover Money, Voice and Duty exactly. Worth finding.

## 6.2 · The impact lines are already in the current spec

The current series needs 198 impact lines, four physical observations per
side, and the running log marks them unverified against a body.

The originals carry them, in that shape, already:

```
COURAGE    4 observations per line
POWER      4        32 lines, 16 pairs both sides
LOVE       4        32 lines
INSIGHT    4        32 lines
EARTHSTAR  5        20 lines, 10 pairs
```

*Impact: tight gut, shallow breath, cold limbs, trembling chest.*
*Impact of Belonging: Hands warm, chest fills, gaze softens, breath flows.*

Four observations, physical, checkable, no abstraction. That is the spec.

**Stability is the exception at five**, every line, twenty of twenty. *Cold
feet, shallow breath, weak legs, hollow hips, dizzy mind.* Either the field
volumes run five and that is deliberate, or Stability drifted. It is
consistent enough within itself to look deliberate.

---
---

# 7 · WHAT THE ORIGINALS DO NOT HAVE

The thing the current series sells.

`PUBLISHING_BRIEF.md` names the distinguishing feature: *every spread
carries a nerve address, a plain-language body location, a left/right and
front/back reading, and a named saboteur.*

**None of it is here.** No node numbers. No nerve names. No foot rule. No
body reading. No saboteur lines. No evidence page, no citation, no ISBN
page, no copyright page at all.

The pairs run continuously across pages rather than sitting one to a spread.
There is no verso and recto discipline, so a cascade breaks mid-word across
a page turn. Courage's Fear install splits across pages 8 and 9 in the
middle of a clause.

That is the whole product difference, stated plainly. The originals are
lists of states with a body note. The current volumes are addressed
instruments. Everything the brief claims as differentiating was built after
these.

---
---

# 8 · THE AUTHOR IS A DIFFERENT PERSON ON THE PAGE

Both back pages carry the same bio:

> *Lance Powell is a lifelong student of art and awareness. His path has been
> one of creation, reflection, and the search for coherence between mind,
> body, and spirit... His paintings and writings are quiet invitations to
> remember what is whole.*

No Oscar. No Emmy. No Game of the Year. No fifteen thousand releases. No
peer-reviewed publication. No somatic engineer.

Set against the corrected agent package, which leads on exactly those.

This is not a defect in either. It is two positions for two audiences, and
canon already names the split: *Somatic Engineer on covers, Soul Architect
for warm audiences.* The originals are the warm position, further warm than
anything currently in the catalog.

Worth knowing which one the little books carry if any of them are reissued.

---
---

# 9 · WHAT THIS INTAKE CHANGES

**Review finding 1.2 is rewritten.** The six channel stem is inherited, not
mistyped, and the real question is whether the eleven carry six or nine.
That fork needs `volumes/*.json` and nothing else.

**Review finding 1.0 gains a precedent.** The em dash rule has now failed
the same way twice, six months apart, in two different products. Once in
four of five originals, once in eleven of eleven current volumes. Both times
the failure sat in shared boilerplate that nobody re-read. Both times a grep
would have caught it.

**Review finding 1.6 has context.** Courage is a real printed book. This one.
$9 in the brief, $11 in canon. Now I have read it, and the question of
whether it stands as a title or becomes a lead magnet is a question about a
16-pair Root volume with no addresses in it, which is a materially different
object from the current ANXIETY.

**The energy page item moves.** `ANSWER_SHEET.md` C1 lists ten energy pages
as dictation, four minutes each. Seven of the ten now have author-written
band material to work from. That does not remove the dictation. It changes
it from writing to confirming.

---

## WHAT WOULD CLOSE THE REST

**The three missing originals.** Wonder, Will and Source. They carry the
Sacral, Throat and Crown energy pages, which are exactly the three bands the
current series still cannot source. If they exist as PDFs they are worth
more than any other file in this project right now, `volumes/*.json` aside.

**Soulstar and Purpose.** The ninth volume. If it was built, it is the only
document in the project that treats node 114 as a subject rather than a row
in a table.
