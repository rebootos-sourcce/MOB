# The SoulCraft card decks — corrected

Written in pass 5, after re-reading the source against what passes 2–4 claimed.
**It corrects errors in those passes.** See the corrections log at the bottom.

Source: `corpus/soulcraft-development-tish-steve.txt`.

## There are two card formats, not one

40 deck sections total, in two structurally different families.

| | Subject format | Escalation format |
|---|---|---|
| Sections | 25 | 15 |
| Fragments | **2,400** | **747** |
| Fragment case | lowercase | Capitalised |
| Paired truths | yes | **none — zero** |
| Capstone | `fundamentally…` | `Convinced that…` / `Certain that…` |
| Ordering | thematic | **ascending intensity** |

**Total fragments: 3,147.**

The `2400 Patterns` heading in the document matches the Subject format exactly,
so 2,400 is a real designed target — but it is the target for *one format*, not
for the deck as a whole.

---

## Format 1 — Subject

25 sections headed `# Subject: X`. Each carries `#### Limiting Beliefs` and
`#### Empowered Truths`, lowercase fragments completing a stem, closing on a
`fundamentally…` capstone that inverts its own opening.

Fragment length: 4–16 words, **mean 8.58**, median 9.

**Block sizes are not uniform.** My earlier claim of "50 per side" is wrong:

- 23 sections run 50 / 50
- `Embarrassed, Humiliated, Guilty, and Shame Because of Being Broke` runs **10 / 10**
- `Forgiving Self and Forgiving Others` splits into **four blocks of 20**
  (Limiting/Empowered × Self/Others)

23×100 + 20 + 80 = 2,400. ✓

---

## Format 2 — Escalation

15 sections. **These have no Empowered Truths at all.** 747 fragments of
release with nothing to replace them.

### The stem carries the intensity ladder

Twelve of the fifteen open with a compound stem that embeds an eleven-rung
escalation *inside* the sentence:

> *"I'm letting go of believing, perceiving, thinking, behaving, acting, and
> feeling that I am **tense, stressed, bothered, irritated, annoyed, frustrated,
> angry, mad, pissed, furious, enraged**, that I am…"*

This is the same ladder drawn by hand in `Charge of Words.jpg`, here built into
the card itself. The doctrine's abstract claim — *"stress is an intensity curve
with limiting beliefs attached to points on the curve"* — is literally
implemented here.

### The fragments escalate to match

Cards are ordered by rising intensity, and the vocabulary tracks the stem's
ladder as it climbs. From `4a - Confidence to Move Forward`:

> Unsure → Lacking → Stuck → **Bothered** → **Annoyed** → **Irritated** →
> **Tense** → **Stressed** → **Angry** → **Mad** → **Pissed off** → **Furious**
> → **Enraged** → Resentful → Embittered → Distraught → Devastated → Panicked →
> Paralyzed → Crushed → Broken → Hopeless → *Convinced that my lack of
> confidence will define my life.*

### The third stem

The three `# 3 -` sections use a stem found nowhere else, adding *speaking,
saying*:

> *"I'm letting go of believing, perceiving, thinking, behaving, acting,
> feeling, speaking, saying that I am…"*

So the document carries **three stem families**, not the two reported earlier.

### Section inventory

| Section | Fragments | Stem |
|---|---|---|
| 4a - Confidence to Move Forward | 50 | compound |
| 4a - Uncertain of Next Steps in Life | 50 | compound |
| 4a - I Need to Show Courage Over Fear | 50 | compound |
| 4a - Change Is Difficult | 50 | compound |
| 4a - That I Feel Strong and Weak | 50 | compound |
| 3 - Tortured Soul | 49 | speaking/saying |
| 3 - Ruminating on the Past | 49 | speaking/saying |
| 3 - Sensitive Nerves | 50 | speaking/saying |
| Ruminating Over Sadness | 50 | compound |
| Ruminating About Depression | 50 | compound |
| Ruminating Over Anger | 50 | compound |
| Ruminating About Being Frustrated | 49 | compound |
| Overstimulated | 50 | compound |
| Overwhelmed and Stressed | 50 | compound |
| Overwhelmed by Work & Life | 50 | compound |

Three sections land on 49 rather than 50.

### Capstone convention

13 of 15 close on `Convinced that…` (9) or `Certain that…` (4) — the structural
equivalent of the Subject format's `fundamentally…`. Three break it:
`Paralyzed by…`, `Helpless to…`, `Enraged by…`.

---

## The finding that matters

**747 fragments release without replacing.**

Every other artefact in this corpus pairs a release with a truth — the Little
Books pair every Fetter with a Truth, the Subject decks pair every Limiting
Belief with an Empowered Truth, the children's book replaces every echo with
*I am here. I am alive.* The Escalation decks do neither. They are half-built,
and the missing half is the half that heals.

By the corpus's own logic that is not a gap in content but a safety problem: the
practice is to empty and then fill, and these cards only empty. Fifteen decks,
covering depression, anger, overwhelm and a "tortured soul", end on
*Convinced that depression will define the rest of my life* with nothing after it.

Writing the 747 counterpart truths is the single largest unfinished job in the
folder — larger than the Crown book and larger than Chapter 6.

---

## Quality issues

**14 fragments are duplicated** across the Subject decks, including:
`defined by my mistakes and failures` · `constantly needing to prove my worth` ·
`defined by what others think of me` · `not enough just as I am` ·
`too afraid to show the real me` · `incapable of seeing myself as successful`

**Subject-name collisions:** `Hates Stepmom` and `Hate Stepmom` are separate
decks; `Abandoned by Absent Parent`, `Abandoned by Mom` and `Dad Not Present`
overlap heavily.

---

## Corrections to passes 2–4

| Claimed | Actual |
|---|---|
| 39 decks | **40** sections |
| 2,400 fragments in the deck | 2,400 in **one of two formats**; **3,147** total |
| 50 fragments per side, universally | 23 decks yes; one is 10/10; one splits 4×20; three escalation decks are 49 |
| Two stem families | **Three** |
| *(not reported at all)* | The entire 15-section Escalation format, its embedded ladder, its capstone convention, and its **total absence of Empowered Truths** |

**Why the error happened, so it doesn't repeat:** pass 2 counted fragments with
a `^[a-z]` pattern after observing that the first decks used lowercase. The
Escalation decks capitalise their fragments, so every automated count in passes
2–4 was blind to 747 cards — and the count returning exactly 2,400, matching the
document's own heading, made a wrong number look like a confirmed one.

A tidy number that matches a stated target is the easiest kind of false
confirmation to accept. It should have been the trigger to check, not to stop.

## Verified and standing

- Children's book: 20 chapters written, **Chapter 6 absent**, arcs 1–21 ✓
- Discover → Play → Flow → Embody present in **all 20** chapters ✓
- Mean Subject-format fragment length **8.58 words** ✓
- Little Books: all six ship **16 pairs** against a spec of 15 ✓
- The river-whisper closing runs **15 of 20** chapters, not all of them
  (earlier wording "near-universal" was loose)
