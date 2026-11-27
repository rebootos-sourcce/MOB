---
name: mob-canon
description: The working architecture of The Mechanics of Being (the formulas, the three axes, the Laws by name, the stack from nerve to character, the archetypes, the domains, the Nine Emotional Architectures, the adversarial architecture, the Practice, and a glossary of its terms of art), built from the May 2026 locked manuscript and reconciled against this repository's own rulings. Load before writing copy, engine logic, or review notes that reference CQ, DQ, SQ, a Law by name, a fetter, a saboteur, a complex, a hyper-complex, a mask, an archetype, a domain, a node address, or any other term from the book.
---

# The Mechanics of Being: canon reference

## 0. What this file is, and its edition

This is a working reference, built from seven section-by-section reads of the manuscript labeled "locked May 2026" in Lance's Drive and in the `rebootos-sourcce/MOB-Manuscript` repo. An October 2026 edition exists and was not available when this was written. Treat every book quotation below as May-2026 wording. Where a dated owner ruling in `DECISIONS.md` or `CLAUDE.md` overrides the book, that ruling is named next to the book's position, not silently substituted for it. The book is not the last word on anything already ruled.

Two files stand above this one and must be checked first, every time, before this file is trusted on a disputed point: `/home/user/MOB/DECISIONS.md` (what Lance has ruled) and `/home/user/MOB/BOOK-ERRATA.md` (every place the book contradicts itself, already catalogued). This file adds new contradictions found during the seven-section read that were not yet in `BOOK-ERRATA.md`; those are marked **new finding** below so they can be merged into that file rather than live only here.

Source hierarchy for everything in this document: `DECISIONS.md` and `CLAUDE.md` first, then the book, then this file's own flags, which are observations, not rulings.

---

## 1. The core formulas

### 1.1 Naming

The book never calls this "the Soul Alignment Formula." Searched directly across all seven sections and found no match. The book's own name for it is **"The Formula"** (Chapter 06 heading). Use the book's name, not an invented one, until Lance says otherwise.

### 1.2 What the book states

Chapter 06 gives, as its own structural equation:

> CQ = (True Intention × Integrity) / Resistance

and three companions, printed in the same chapter:

> DQ = (Distortion × Resistance) / Integrity
> SQ = Resistance, Shadow Quotient
> Free Will = CQ as Resistance approaches zero

The same chapter also gives a second, different definition of SQ a few lines later: "SQ, the Shadow Quotient, is the complete diagnostic picture: Resistance (aggregate node load across all 114 nodes) plus Integrity gaps... These are distinct." That is SQ = Resistance, and separately SQ = Resistance plus Integrity gaps, inside the same chapter, unreconciled. A later chapter (Chapter 18, the Two Spirals) gives yet a third DQ formula, identical in shape to the Chapter 06 one but stated independently: "DQ = (Distortion × Resistance) / Integrity," with Distortion and Resistance both climbing as Integrity drops. Appendix D's technical specification gives a fourth variant again: "DQ = (SQ × Distortion / Integrity) × k," k = 0.1, with "Revealed_CQ = 100 − DQ." None of these book variants is what the engine runs.

### 1.3 What governs the product (owner ruling, supersedes all of the above)

Per `DECISIONS.md` and `BOOK-ERRATA.md` items 24 to 26:

- **CQ**: the 21 Laws of Moral Integrity, each scored, summed over 210, times 100. Nothing divides it. "To keep it really simple, we can have the sum equal to 10, and that 210 equals one hundred percent." (`engine/compute.js:151`, function `cqSum`.)
- **DQ**: a total shadow, not a gap and not a ratio. The 112 address weights summed over 1120, times 100. "DQ is a total shadow... Settled, and it is not to be asked again." (`engine/compute.js:326`.)
- **SQ**: not a single aggregate number. "SQ is an individual fetter, there are 112 that we track, period." SQ is 112 per-address values. CQ moves against them as a lever, not as a divisor: "you can always put SQ within CQ and say CQ 100 SQ 0, DQ 0, SQ 100, any deviation, one pulls down and the other, it's a lever."
- **Distortion**: struck from the formula on 13 May 2026, "as a double count of SQ." The book's own text in Chapter 06 carries this struck position as settled prose ("Distortion is derived, not independent... No separate diagnostic instrument needed"), even while other chapters still print formulas that divide by or multiply it.

Do not cite any of the book's own four DQ variants, or either of its two SQ definitions, as the product's math. Cite the three bullets above.

### 1.4 The formula's two numerator terms, confirmed elsewhere in the book

Chapter 24 (Expression laws) states plainly: "the numerator of the CQ formula collapses from both directions at once, Intention dims because there is nothing animating it, Integrity erodes because the Expression laws are the felt experience of integrity in motion." This matches "coherence equals intention times integrity divided by resistance" exactly as Lance gave it to Emmy directly. The word "resistance" itself appears exactly once in the Laws section of the book, as a polarity label under Law 48 (Peace): "Resistance, the agitation that drags will down." That is corroborating, not the formula's own statement.

### 1.5 Supporting terms

- **True Intention**: "what the soul does in the absence of nodes." Defined by subtraction. Test given: charge from True Intention sustains itself without an audience; charge from the adversarial algorithm needs one.
- **Integrity**: "the structural condition of the hull." The Laws of Spiritual Integrity running as felt conditions in the body, not concepts in the mind.
- **The Adversarial Algorithm**: the ego running a corrupted program, same architecture as self-direction, not malicious: "structural self-defense, the system protecting the character from the examination that would dissolve it."
- **Corruption Gap**: the distance between a person's current embodiment of a value and full embodiment of it. The target of work at that address.

---

## 2. The three-axis system: Sat, Chit, Ananda

The book's three-axis coordinate system (also called "the Harmonic Table," "the periodic table," 64 elements, 7 layers) spans only Chapters 08 to 10, 39 of the book's 48 laws. Chapter 11's 9 Laws of Expression are a separate table, organized by chakra, and are never given an X/Y/Z label anywhere in the manuscript. Sat, Chit and Ananda themselves are defined as axis labels, not spelled out as standalone words, in the Laws chapters; the fullest definitions found are in the system-mechanics section:

- **Sat = X axis = Energy / Being / Amplitude.** "The sum of total energy. All energies from void to full manifestation. How the field behaves." Governs the Laws of Nature. Apex: Truth / Light.
- **Chit = Y axis = Intelligence / Consciousness / Information.** "Energy as information. Signal and consciousness." Governs the Laws of Human Nature. Apex: Wisdom / Awareness.
- **Ananda = Z axis = Dynamics / motion itself, both poles.** Not simply "bliss." The book marks this itself as a correction: "Ananda corrected: the conventional translation as bliss describes a downstream effect. Ananda is the Z-axis, the coordinate of motion itself... maximum expansion (zero resistance) and maximum contraction (frozen nerve, collapsed consciousness)." Will governs this axis. Love is its apex. Governs the Laws of Spiritual Integrity.

The cover's own "six resolutions" claim (nerve, emotion, life, law, consciousness, civilization) and the "Scale" unified theory's own list (nerve, person, room, civilization) are two different enumerations of the same scale-invariance claim; they share only two words. Report both, do not merge them into one list.

The Ascended Masters are placed on this coordinate system with explicit coordinates in the cosmological section (Akhenaten at the Sat apex, Buddha at the Chit apex, Christ at the Ananda apex, Krishna in Ananda motion, Rama holding all three, Lao Tzu perpendicular to all three, Moses at the Sat midpoint, Rumi at Ananda expressed, Musashi at the practice layer below the axes). This is nine named positions, not twelve; see §9 below for the "twelve are eleven" problem.

---

## 3. The Laws

The book names **48 laws across four chapters**, plus the product runs a separate, settled **21 Laws of Moral Integrity**. These are two different rosters. Do not conflate them.

### 3.1 Chapter 08, Laws of Nature (Sat / X axis), 01 to 13

All Is One, Vibration, Polarity, Correspondence, Attraction, Inspired Action, Transmutation, Cause and Effect, Compensation, Potential, Relativity, Rhythm, Gender. Six carry Hermetic lineage from the Kybalion; seven are original. Polarity sits at position 03 by explicit architectural note ("This is a periodic table, not a curriculum"), having moved there from an earlier position 10.

### 3.2 Chapter 09, Laws of Human Nature (Chit / Y axis), 14 to 26

Form, Archetype, Biofield, Attunement, Perception, Intelligence, Symbol, Identity, Choice, Ego, Intention, Action, Memory. All thirteen are stated as original contributions. Choice (22) precedes Ego (23): "Ego forms AFTER Choice." Law 24, Intention, is the book's own stated link between a Law and the CQ formula's numerator. Law 26, Memory, and Law 03, Polarity, are each separately described as where "the 112 Fetters" live, unreconciled with each other.

A cross-reference anomaly: Chapter 09's own intro points to "the work of Law 10" to describe duality versus ego, but Law 10 in the book's own numbering is Potential, which has nothing to do with that theme. Law 22 (Choice) actually matches the description. Likely renumbering residue from the Polarity move noted in §3.1; not resolved in the text.

### 3.3 Chapter 10, Laws of Spiritual Integrity (Ananda / Z axis), 27 to 39

Truth, Unity, Awareness, Compassion, Beauty, Courage, Duty, Responsibility, Accountability, Transparency, Presence, Nature, Reverence.

**The book calls this chapter "Laws of Spiritual Integrity," never "Moral Integrity," here and again in Chapter 19.** This is a live, named, and already-settled distinction, not an error to fix. Lance, 2026-10-15: "Spiritual integrity is the coherence of your entire field. Moral integrity is the behaviors required to upregulate the nervous system to make this system 100% coherent... Leave it alone." Both words stand, each with its own meaning. The product's scoring instrument and Emmy's own operating rule use "Moral Integrity" and the 21-law roster in §3.5; never swap the words, in the book, the app, or this file.

Laws 34 (Responsibility) and 35 (Accountability) print the identical upward-pole sentence word for word ("Claiming authorship of every outcome without self-punishment"). Figures repeat across this axis: Jesus/Christ twice, Rumi twice, Musashi twice, Lao Tzu twice. Law 37 (Presence) names Lance Powell himself alongside Ramana Maharshi as the exemplar figure, the only self-naming on this table.

### 3.4 Chapter 11, Laws of Expression, 40 to 48

Organized by chakra, root to throat, not by X/Y/Z: Peace (48, root), Curiosity (40, sacral), Play (41, sacral), Creativity (42, sacral), Flow (43, sacral/spirit), Beauty (44, sacral), Order (45, solar plexus), Love (46, heart), Will (47, throat, apex). Every law has a parallel downward "shadow table." Peace carries the highest number (48) yet is displayed first and foundational; this is a structural oddity, not a numbering error (40 to 48 is a clean run of nine).

Note the name collision: "Beauty" is used for two different laws with two different definitions, Law 31 (Ananda axis, "order over chaos, nervous system stabilizer") and Law 44 (Expression axis, "the meaning-producing quality of creation"), both attributed to Rumi. Law 45, Order, is the book's own textual anchor for the Harmonic Table of Consciousness ("Moses built it for a people").

### 3.5 The product's 21 Laws of Moral Integrity (settled, governs scoring)

Truth, Transparency, Unity, Awareness, Presence, Equanimity, Compassion, Forgiveness, Courage, Temperance, Duty, Accountability, Justice, Non-Harm, Responsibility, Humility, Generosity, Detachment, Patience, Aesthetic Beauty, Nature.

Twelve of these names match the book's Chapter 10 list exactly or by rename (Beauty renamed Aesthetic Beauty); the book's Reverence is dropped; nine names (Equanimity, Forgiveness, Temperance, Justice, Non-Harm, Humility, Generosity, Detachment, Patience) exist nowhere in the book's own 48-law roster, checked directly. Each law is scored 0 to 10, five is the reference midpoint, ten is full embodiment. CLAUDE.md's "Law three is not justice" correction concerns the display order of `LAWS1.json`, a different object again from either the book's Law 03 (Polarity, a Law of Nature) or the Chapter 10 roster (which never contains Justice).

### 3.6 Other named law and number systems, not to be merged with the above

- **The Seven Laws of Harmonics** (Chapter 20-ish, "not the same as the Laws of Nature"): The Conductor, The Node, Crystallization, The Cage, Flow vs Binary, The Field, Radiance.
- **"The ten Laws of Spirit Coherence"**, named once in the cosmological Genesis reading, with "Honor" as a member, a name that is on neither the 48-law roster nor the 21-law roster. Unconfirmed against any fuller list; flag, do not assert.
- **The Divine Numbers 0 to 12**, a separate compression system mapping each number to a Law of Nature name by its own index, which does not match the engine's E01-E13 knowledge-base codes for the same law names.

---

## 4. The stack, nerve to character

### 4.1 The owner's ruling, 23 October (governs)

Quoted from `DECISIONS.md`, "called canon and ordered locked in": "Our stack goes psychophysical, that's nerve, to super complex, deep psychological, it's our archetypes to domains, and then we have our energetic... From fetter to super complex. After the super complex are the masks. The mask layer is the hybrid. Then one up from that is the archetype to the spiritual. And then at the very top is the character."

Ordered bottom to top: **1. Nerve / fetter → 2. Saboteur / complex / hyper-complex → 3. Super complex → 4. Masks ("the hybrid") → 5. Archetype through domain ("deep psychological") → 6. Character (top).**

### 4.2 The book's own stacking diagram, and where it disagrees

The book's own "Stacking Architecture" box orders outermost to innermost: Blueprint Domains → Jungian Archetypes → Saboteurs → Hyper-Complexes → 7 Mask Layers → 9 Child Fetters → Empty/Cleared State. **This places masks between hyper-complexes and the fetter floor**, the opposite relative position from the owner's ruling, which places masks above super complex and below archetype/domain. The owner's ruling governs for product purposes; the book's placement is superseded, not corrected in place, and should be named as such wherever cited.

A second internal disagreement sits inside the same book box: its prose caption puts masks "between the saboteurs and the Jungian archetypes," but its own diagram arrow order puts masks between hyper-complexes and the 9 child fetters, closer to the floor. The caption and the diagram disagree with each other.

### 4.3 Each rung, as the book defines it

- **Fetter / nerve** (floor): one of the nine child emotional axes, seated at a nerve plexus. "9 axes." The book's own Behavior Algorithm Evolution gives six exponential stages from this floor: Behavior Response (3) → Conditioned Behavior (9) → Compulsive Behaviors (27) → Saboteurs (81) → Complexes (243) → Hyper-Complexes (729).
- **Saboteur**: "Complexes of the 9 child fetters at certain magnitudes." The book's stack box says "32 confirmed"; the actual named library runs to 33 (the Negotiator plus 32 numbered entries, 01 Avoider through 32 Control Freak), a mismatch the book never reconciles. 11 of the 33 names (Avoider, Controller, Victim, Perfectionist, Pleaser, Hyper-Achiever, Hyper-Rational, Hyper-Vigilant, Restless, Stickler, Judge) are explicitly credited to Shirzad Chamine's *Positive Intelligence*; the Negotiator and the remaining 19 are the book's own taxonomy. (This 11-name list both includes Avoider and Perfectionist together, a different malformation from the 10-name list `BOOK-ERRATA.md` item 3 flags elsewhere in the book, which has Perfectionist but not Avoider.)
- **Complex**: "2+ saboteurs interacting." Narcissism is the book's worked example: Entitlement → Justification → Comparison → Judgment, four nodes in sequence.
- **Hyper-complex**: "2+ complexes stabilized," or "Saboteurs co-mingling in sequence, each produces the next." The book states this sequence **two different ways in the same manuscript**: once as Narcissism → Machiavellianism → Sociopathy → Psychopathy → Borderline-Sociopath → Megalomania (Machiavellianism second), once as Narcissism → Sociopath → Psychopath → Malignant → Megalomania/Grandiosity → Machiavellianism (Machiavellianism last). `DECISIONS.md`'s own 27 October ruling gives a third ordering again, naming psychopathy a "supercomplex" containing narcissism, with sociopath as a hyper-complex. None of the three match.
- **Super complex**: the term `DECISIONS.md` uses for the rung "the running engine currently builds and calls Character; it is being renamed." The book itself never uses this exact term as a generic stack rung; it uses "super-complex" once, only to describe Psychopathy specifically ("the dark triad as a super-complex, structural absence of the empathy feedback loop").
- **Masks**: seven developmental, social-interface layers, distinct from the internal archetype pattern classes: Child, Preteen, Teen ("where the archetypes emerge"), Young Adult, Professional, Religious, Archetypal (the last named "the full glyph," suppressing all twelve archetypes at once, crown and third eye). Each mask has two layers, one practice-maintained and decaying, one hardened and not decaying with time alone.
- **Archetype**: see §5.
- **Domain**: see §6.
- **Character**: top of the owner's ruled stack. The book separately describes character as "a field topology," the sum of overlapping compressed-volume shapes, dissolving (not transforming into something else) when node load clears, leaving "the original signal, the Blueprint Domains conducting without distortion."

---

## 5. The archetypes

**Twelve**, presented as "Jungian," addressed to a specific body location each, with a distorted belief and a cleared description:

1. **Warrior**, Solar Plexus / Throat. Distorted: "I must dominate. Vulnerability is weakness." Clear: courage without control.
2. **Innocent**, Root / Sacral. Distorted: "I don't want to be involved."
3. **Orphan**, Root / Crown. Distorted: "No one is coming. I have to do everything alone."
4. **Caregiver**, Heart / Throat. Distorted: "My worth is the care I provide."
5. **Explorer**, Sacral / Root. Distorted: "If I stop moving, something will catch up."
6. **Outlaw**, Solar Plexus. Distorted: "The system is corrupt and I must oppose it."
7. **Lover**, Heart. Distorted: "If I am fully seen, I will be left."
8. **Creator**, Throat / Sacral. Distorted: "The work has to be perfect or it doesn't exist."
9. **Jester**, Sacral / Third Eye. Distorted: "If I stay light, nothing serious can land."
10. **Sage**, Third Eye. Distorted: "If I understand it, I am safe from it."
11. **Magician**, Crown / Throat. Distorted: "I see what others cannot. My perception entitles me."
12. **Ruler**, Crown / Solar Plexus. Distorted: "Without my hand on it, it falls apart."

**Already settled in `BOOK-ERRATA.md`:** calling this roster "Jungian" is the book's own mislabel. Jung never enumerated twelve archetypes; this is Carol Pearson's twelve-archetype model. Carry that correction whenever this list is cited.

**Already settled in `DECISIONS.md` and in direct conflict with the book's own printed addresses:** Lance's own seat ruling, 16 October, "an archetype's percent... where it acts is its seat." His words, quoted directly: "the warrior's root, the sage is crown, the mage is third eye." Compare the printed addresses above: Warrior is Solar Plexus/Throat in the book, not root. Sage is Third Eye in the book, not crown. There is no archetype literally named "the mage" in the book's twelve; the nearest is the Magician, printed at Crown/Throat, not third eye. All three of the owner's own worked examples disagree with the book's printed table. `DECISIONS.md` itself already names this an open gap ("the sector each covers disagrees with its ruled seat for ten of the twelve"). Do not use the book's printed addresses as a seat source without flagging this conflict.

**A second, unrelated use of "archetype"** exists in the same book: the **Four Parent Archetypes** underneath the saboteur layer (Victim, Perfectionist, Judge, Sabotage Archetype), explicitly self-flagged by the text as a different sense of the word to prevent collision with the saboteur-layer meaning of "saboteur."

**A third, unrelated system**, the **Archetype Behavioral Loadouts** (cosmological section): seven planes (God, Goddess, Angels, Awakened Human, Egoic Human, Demons, Devils), each running five automatic "primitives." Not claimed to be Jungian by the text. Keep separate from the twelve above.

---

## 6. The domains, and how archetypes relate to them

The **Blueprint Domains** are "the soul's original operating systems. Native functional modes before any nodes loaded." The book's own header says **"14 domains,"** organized into Four Directive Clusters: **Architect** (Order: Knowledge, Justice, Imperium, Duty), **Engine** (Dynamics: Power, Creation, Dissolution, Descent), **Weaver** (Connection: Connection, Exchange, Restoration, Play), **Witness** (Awareness: Nature, Trickster). 4+4+4+2 = 14, matching the header.

**But the book's own "Blueprint Domain Descriptions · All 14" table, in the same manuscript, runs I through XV, fifteen entries**, with Domain XIII, "Mystery and the Unseen" (templates Hades, Hecate, Anubis), unassigned to any of the four clusters. The header says 14, the list prints 15. Not resolved in the text. This is the same failure mode `BOOK-ERRATA.md` already catalogues for other counts in the book (a heading naming "the twelve" above a list of eleven); flag it the same way.

**How archetypes point at domains (the deity-overlay mechanic):** the Archetypal Mask passage states that pantheon deities across cultures each "point at the same domain": "Zeus, Odin, Ra point at the same domain: Ruler. Thoth, Hermes, Horus point at the same domain: Knowledge." "Ruler" here names one of the twelve archetypes; "Knowledge" names one of the Blueprint Domains, meaning the sentence uses "domain" for two different layers in its own two clauses.

**This directly contradicts the book's own Domain Descriptions template lists, in the same manuscript:** Odin is listed under Domain I (Knowledge), not grouped with Zeus and Ra under Rulership. Hermes is listed under Domain II (Communication and Exchange), not under Knowledge. Horus is listed under Domain XIV (Devotion and Right Action), not under Knowledge. Only Thoth is consistent between the two passages. Of six named deities used to illustrate "archetypes point at domains," four are placed differently by the book's own dedicated domain table. Report this as found; do not pick a winner.

---

## 7. The Nine Emotional Architectures

Chapter 15's own claim: "All [112/114] nodes map to one or more of these axes... not states, they are physical locations." Eight words cover the shadow (contracted) range; one word, happy, covers the expansion range, a stated 8:1 asymmetry that the book calls diagnostic in itself.

1. **Fear → Safety**, Lumbar Plexus (L1-L4). Trigger: "I am stuck. I am trapped." Coherent pole: the ground.
2. **Anger → Calm**, Solar Plexus / Celiac Plexus. Trigger: "This is wrong. Move." Cluster bell curve: anger will not clear without releasing the shame cluster underneath it first; work ascending (toward anger) before descending.
3. **Shame → Worth**, Pudendal Nerve. Trigger: "I am not worthy." Release sequence runs outer to inner: Sad → Deflated → Humiliated → Embarrassed → Guilty → Shame. Shame forms earliest, clears last.
4. **Disgust → Acceptance**, Sacral / Solar Plexus / Dermis. Trigger: "Things are not as they should be." The only axis with a built-in physical reflex.
5. **Receiving blocked → Gratitude**, Inferior/Upper anterior heart. Trigger: "I am too small to be seen." Shortest entry in the book, no cluster nodes given.
6. **Grief → Renewal**, center chest, bilateral. Trigger: "I cannot move forward." Two kinds: loss grief (something was there, then gone) and absence grief (something was never there). "Sadness is treble. Grief is bass."
7. **Apathy → Joy**, shoulder girdle and throat (coupled). Trigger: "What is the point?" "Apathy is grief that stopped moving." Release order: throat first, then shoulders.
8. **Shock → Anticipation**, dermis, full skin surface. Trigger: "This should not be happening." Fastest-forming, most scattered emotion.
9. **Sad → Happy**, inferior anterior cardiac nerves. Trigger: "I cannot have what I want." The book notes this axis's pairing was a correction within the May 2026 edition itself ("Sad was not discovered. The omission was discovered. Happy had been listed without its pole").

**Carry forward unresolved, not silently fixed:** axes 1 and 8 share three of four identically named, identically addressed cluster nodes (Panic/Lumbar Sympathetic Chain, Disconnection/Sacral Root Ganglia, Collapse/Spinal Cord Base), unremarked by the text. Axis 6's cluster nodes are printed twice in the same chapter with the fourth entry changed between printings. Anxiety is explicitly not a standalone axis; it is "signal chain behavior of multiple axes firing," a monitoring loop that multiplies charge through repeated check-ins. A second, separate "creative sadness" location (sacral, two points) exists alongside axis 9's cardiac "sadness," under the same English word, unreconciled.

**Safety flag, carried forward from `BOOK-ERRATA.md` item 15 and confirmed independently in this read:** every axis is given an "action threshold" word, and sadness's threshold word is printed as "suicidal," with no stop line, no referral, and no caution text anywhere near it, in more than one place in the manuscript.

---

## 8. The adversarial / shadow architecture

**The Decoherent Blueprint**, as named in the Nine Emotional Architectures chapter (this exact phrase and all four figures occur there, not in the cosmological chapter, which never names Malak or Baal at all when searched directly): "When DQ reaches its ceiling, the four adversarial archetypes activate simultaneously: **Malak** (structured extraction), **Baal** (consuming chaos), **Set** (internal betrayal), **Lucifer** (pride as separation). Their sum is the Decoherent Blueprint." A separate passage in the same chapter restates this as "their behavioral sum corresponds to Malak, Baal, Set, and Lucifer as named modes. The coherent opposite of all of them is Source, not another archetype." Consistent between the two mentions.

**The cosmological chapter's own adversarial figures are a different, overlapping set**, built around the Eight Mirror Pairs (coherent pole / compressed pole): Illumination (Jesus / **Lucifer**), Desire-Will (Ramakrishna / Asmodeus), Order (Moses / **Set**), Power (Musashi / **Moloch**), Perception (Buddha / Geryon), Trust (Rumi / Charon), Charge (Elijah / Phlegyas), Revelation (Meister Eckhart / The Furies). Of the four Decoherent Blueprint names, only Set and Lucifer appear here; Malak and Baal appear nowhere in this chapter. Moloch and Geryon, present here, are not part of the Decoherent Blueprint foursome.

**Already settled, and the book has not caught up:** `BOOK-ERRATA.md` ("The Twelve Are Eleven, And That Is A Live Hole") records that Lance ruled on 20 September, "Eckhart comes out. Classic figures only," with the engine substituting Lao Tzu on the Revelation axis and the master-roster count dropping from twelve to eleven. The manuscript, as read in this pass, still prints Eckhart at Revelation in both the mirror-pair table and nowhere corrects it. Do not cite Eckhart as current without this flag.

**The downward spiral mechanism**, five steps: Separation ("this is the apple") → Distortion → Compensation → Reinforcement → Inversion ("the pattern reverses the polarity of the original intention. The adversary is the inversion point"). Interruption is possible at steps 1, 3, and 5.

**Decoherence Archetypes**, a six-stage behavioral cascade distinct again from the above: The Zombie, The Drone, The NPC, The Energy Vampire, The Demon, The Devil.

**The etymology given for "Satan"** is explicitly self-flagged by the book as non-standard: "an interpretive etymology, not a standard linguistic derivation. Offered as a meaning-frame, not a historical claim." Satan, Devil, Ego, Shadow, Lucifer are read as "different words, different traditions, same description," with the adversary framed as "not evil, the function that creates the friction the soul uses to grow," and its terminus ("Satan frozen," Dante's ice) as stasis, not active malice.

---

## 9. The Practice

### 9.1 The native loop: a book/product mismatch to flag, not to smooth over

The book's own front matter states a **three-stage** native methodology: **"Discover, Play, Flow."** No fourth stage is named anywhere in the sections read. `CLAUDE.md` rules the shipped product's loop as **four-stage and circular**: "The process is discover, play, flow, embody... And it is a circle, never a list," citing Lance's own correction ("the last one is embody and not body"). Within the Practice chapters, one onboarding step does gesture toward a fourth action in the same breath as the three named gates ("the map, the four gates, Discover Play Flow. Still the mind. Reconnect mind and body. Get the spirit to flow. **Embody** the upper compass"), but this does not name "embody" as a fourth gate the way Discover, Play and Flow are named. Report the mismatch; do not assume the book resolves it elsewhere.

### 9.2 What a session is (the book's mechanical definition)

"A session is a precise diagnostic and release sequence. The practitioner identifies which of the [112] in-body nerve addresses is carrying the heaviest load... A release command is sent through nine logic gates simultaneously, each gate corresponding to a chakra zone. The pattern discharges. A coherent opposite installed at the same address... The body integrates." The diagnostic formula given later in a case study: "Find the address. Find the name of the thing at the address. Reverse engineer it."

### 9.3 The Letting Go Statement and the release channels: settled, against a book that cannot agree with itself

**Already settled by owner ruling, 26 September, per `BOOK-ERRATA.md` item 27:** the release protocol uses **six channels**: believing, perceiving, thinking, behaving, acting, feeling. This is what the engine runs.

**The book itself gives at least six different gate counts for this one protocol** across its own chapters and appendices: nine ("I am letting go of believing / perceiving / thinking / feeling / speaking / acting / relating / creating / being"), six ("Believe, Think, Say, Feel, Behave, Act/Do," which substitutes "Say" for "perceiving"), ten (adding speaking, saying, voicing, doing), eight ("eight is overwhelming," no roster given), seven (a gate-to-chakra table), and seven again (Appendix Tier Five, "the seven logic gates"). A separate "Monthly Gate Progression" and "Graduated Entry" passage give two more internally inconsistent step counts for the same pedagogy. None of these is the ruled six. Any copy or logic drawing on the book's own gate language should cite the ruled six, not any of the book's own printed counts.

**The dose**, stated consistently across the chapter: 50 release statements on the left channel, 50 on the right, then 50 embodied-truth statements left, 50 right. This matches `DECISIONS.md`'s recorded card anatomy (100 release plus 100 install, 50/50 each side, left then right).

**Two mechanics, required in sequence**: release opens the address; the embodied truth (coherent opposite) installs into the opened address. "Attempting the second without the first is attempting installation on occupied ground... This is the operational distinction from affirmation practice."

### 9.4 Session arc and aftercare

Four-part arc: Open (identify the primary node) → Deepen (run the release protocol) → Release (discharge) → Close (node uncovers). Explicit aftercare note: "The body does not stop releasing when the practitioner declares the session complete... Set that expectation."

### 9.5 Case-rate claims, carry with their own caveats

Vicky's 12-week case states "400 patterns released per week" and a total of "approximately 3,200" over 12 weeks; 400/week over 12 weeks is 4,800, which does not reconcile against the stated total under either reading. `BOOK-ERRATA.md` item 14 already flags a related 3,200-total claim with a different paraphrase of the rate ("about 400 a month"); this file's own "per week" wording is the book's exact phrase, and the arithmetic gap stands either way. Do not repeat the 3,200 or 400/week figures as settled without this caveat.

### 9.6 Named techniques worth carrying into copy or engine review

Merkaba Center-Point Release Protocol ("the canonical release protocol, every other technique serves this one"), the Snowball Technique (chained statements, multiplicative not additive charge), the Timeline Technique (isolating an impulse at "frame ten" on a constructed timeline), the Awareness Untether, Field Extension, the Five-Stage Node Diagnostic Ladder (Flowing, Impaired, Heavily Impaired, Blocked, Off), and the 369/555/77 methods (21-33 days, 5 days, 7 days respectively). Several of these carry explicit self-hedging language in the text itself ("working theory," "not a clinical claim"), which should be preserved, not dropped, if quoted.

---

## 10. Glossary of terms of art

Every term below needs its plain meaning stated beside it wherever it appears to a reader, per this repository's own "unpack every symbol" rule.

- **CQ (Coherence Quotient)**: the product's single coherence score, 0 to 100. Settled computation: the 21 Laws summed over 210, times 100. Not divided by anything.
- **DQ (Decoherence/Distortion Quotient)**: the total shadow, 0 to 100. Settled computation: the 112 address weights summed over 1120, times 100. Not "100 minus CQ."
- **SQ (Shadow Quotient)**: not a single number. 112 individual per-address fetter values. Acts on CQ as a lever, not as a term inside its equation.
- **Resistance**: aggregate node load; the book's own denominator term, superseded in the engine by SQ acting as a lever rather than a divisor.
- **True Intention**: what a person's motion looks like with the survival architecture subtracted out.
- **Integrity**: the Laws of Spiritual (not Moral) Integrity, running as felt body conditions.
- **Distortion**: struck from the formula, 13 May 2026, as a double count of SQ.
- **Node / fetter**: a charge-holding address, named and anatomically seated. Canonical product count: **112**, which is **108 somatic (at a named plexus or nerve) plus 4 field anchors, two above the body and two below.** Never state the total as a bare, undifferentiated number; say the structure. The book itself is inconsistent on this count: multiple sections say "114" (112 inside the body plus 2 field nodes, named Soul Star and Earth Star); other sections say "112" matching the engine; the appendix titled "The 114 Nodes" is the single most visible instance of the wrong number inside the book's own front matter. Use 112 (108+4) as governing; flag any book passage that says otherwise rather than silently correcting the quotation.
- **Field anchors**: per the 28 October ruling and `BOOK-ERRATA.md` item 23, the four named field points are Gaia Gateway, Earth Star, Sol Star, and Stellar Gateway. "Soul Star" and "Param Shiva" are named in `BOOK-ERRATA.md` as the engine's own prior, since-corrected terms; several sections of the book still use "Soul Star."
- **Vritti**: the composite energetic wave produced when sensory input and emotional charge combine at the moment of an experience. Not the tag itself; what the tag attaches to.
- **Soma**: the physical tissue correlate of the same event, at the same anatomical address.
- **Psychosomatic tag**: a limiting belief, defined mechanically as a label attached simultaneously to the vritti and the soma, which both distorts and pins (crystallizes) the vritti in place.
- **Myelin kink**: the site where chronic stress produces disorganized, thickened, less conductive myelin repair at a node, radiating charge into surrounding tissue (the "leaky capacitor effect").
- **Coherent opposite**: the specific felt quality a pattern was suppressing, installed at the same address once it is cleared. Not a generic positive statement.
- **Saboteur / complex / hyper-complex / super complex**: see §4.3.
- **Mask**: a social-interface layer, distinct from an internal archetype. Seven named developmental masks, see §4.3.
- **Archetype**: in its primary sense, one of the twelve Pearson-model character templates the book mislabels "Jungian." Two other, unrelated senses of the word also appear in the book (parent archetypes of the saboteur layer; the seven-plane Archetype Behavioral Loadouts). Keep all three senses distinct; see §5.
- **Domain (Blueprint Domain)**: one of the soul's native, pre-load operating modes. Book header claims 14; book's own list runs to 15. See §6.
- **Character**: top of the stack per the owner's 23 October ruling; described in the book as a field topology, dissolving (not transforming) when node load clears.
- **SPS (Somatic Psychology Stack)**: the nested-doll name the book uses for the whole fetter-to-character architecture. Never expanded to full words in the sections read; used as a load-bearing acronym throughout.
- **The Record**: the book's own founding metaphor. Every person as an unpressed record; experience is not the groove, identification with it is.
- **Ego rebound**: "the intensified reaction of the ego when limiting beliefs and attachments are dissolved."
- **Pratyaya (compositor)**: the term the book uses for the layer that assembles the distorted composite signal before awareness identifies with it. Never defined as a standalone word in the sections read; used only functionally.
- **Hypercube vertex / the SA-node summons**: the book's geometric account of how the soul localizes into form, attuning to the sinoatrial node's first fetal heartbeat. The text itself flags this as "structural analogy, not a literal quantum mechanical claim."
- **Torus field, Earth Star, Soul Star**: the two-pole field model the book uses for the body as a battery. Note the naming conflict with the ruled four-anchor structure above.
- **Divine Numbers 0-12**: a separate numerological compression system mapping each number to one Law of Nature.
- **Ascended Masters**: a set of historical/mythic figures placed as coordinates on the Sat/Chit/Ananda cone. The book never lists all twelve together in one place in any section read; nine appear with explicit coordinates, and the union with the Eight Mirror Pairs' coherent poles produces twelve names (now eleven, per the Eckhart ruling).
- **Mirror pairs**: eight coherent/compressed figure pairs (Illumination, Desire-Will, Order, Power, Perception, Trust, Charge, Revelation), each with its own diagnostic question. See §8.
- **Decoherent Blueprint**: Malak, Baal, Set, Lucifer, the four adversarial archetypes that activate together when DQ reaches ceiling. See §8.
- **26 Clairs**: the book's sensory-architecture model, eight foundational clairs (clairsentience, claircognizance, clairvoyance, clairaudience, clairgustance, clairalience, clairempathy, clairtangency) plus 18 further sub-faculties, 26 total, each with a claimed anatomical address.
- **Ascension**: defined behaviorally in the book ("the threshold at which the external environment loses automatic control over internal state"), with a numeric distance already settled by owner ruling, below.

---

## 11. Contradictions and overrides index

**Already settled; check `DECISIONS.md` first, not the book, on each of these:**

- CQ formula: owner's 21-laws-over-210 ruling supersedes all book variants (§1.3).
- DQ formula: owner's total-shadow ruling supersedes the book's "100 minus CQ" and its ratio variants (§1.3).
- Distortion: struck from the formula, 13 May 2026.
- Node count: 112 (108 somatic + 4 field anchors) governs; never state a bare 112 or 114 without the structure, on a screen that has not already established it.
- Field anchor names: Gaia Gateway, Earth Star, Sol Star, Stellar Gateway govern; "Soul Star" and "Param Shiva" are the engine's old, corrected terms.
- Ascension distance: owner's fifteen-thousand-by-fifty ruling supersedes the book's printed 11,664 (and the smaller thresholds derived from it).
- Release channels: the ruled six (believing, perceiving, thinking, behaving, acting, feeling) supersede every one of the book's own gate counts (9, 6, 10, 8, 7).
- Eckhart / Revelation: Lao Tzu supersedes Eckhart on the mirror-pair table; master count is eleven, not twelve.
- Masks' position in the stack: the owner's 23 October full-stack ruling (masks above super complex, below archetype/domain) supersedes the book's own diagram (masks between hyper-complexes and the fetter floor).
- Archetype seats: the owner's 16 October seat ruling (Warrior at root, Sage at crown, "the mage" at third eye) supersedes the book's printed archetype addresses, on all three examples Lance himself gave.
- "Spiritual Integrity" vs "Moral Integrity": both words stand, by explicit ruling; never swap one for the other in either direction.
- Discover/Play/Flow vs the ruled four-stage circular loop: the product runs four stages (discover, play, flow, embody) as a circle; the book's front matter names only three. Not yet confirmed whether a later book chapter adds the fourth; report as an open gap, not a resolved one.

**New findings from this synthesis pass, not yet in `BOOK-ERRATA.md`, worth merging there:**

- The appendix titled "The 114 Nodes" is itself the clearest instance of the wrong number inside the book's own front matter and should be named specifically when errata item on 108/112/114 is revisited.
- SQ is defined twice, differently, inside one chapter of the book (equal to Resistance; and separately, Resistance plus Integrity gaps).
- The hyper-complex sequence (Narcissism through Machiavellianism) is given in at least three mutually inconsistent orders across the book and `DECISIONS.md`'s own 27 October ruling.
- Saboteur count: book header says 32, the book's own named library totals 33.
- "Four Paths" chapter: the chapter title says four, the opening list and a dedicated numbered section give five, a table header says six, and the closing summary says five again, all within one chapter.
- Two different full wordings of "the seven affirmations" exist in the book, one labeled "locked May 2026," one not; the Burning Man test statement itself is quoted two different ways inside the one chapter that tests it.
- Blueprint Domains: header says 14, the book's own descriptions table lists 15, with one domain (Mystery and the Unseen) unassigned to any cluster.
- The deity-overlay "archetypes point at domains" passage contradicts the book's own domain-template table for three of its six named deities (Odin, Hermes, Horus).
- "Alpha on waking" and "theta on waking" both appear, stated as fact, inside the practice section of this same manuscript, not only across distant chapters.
- Two differently themed appendices are both labeled "Appendix A" in the closing section (Coherent Opposite Library, and later, the Pattern Catalog).

---

## 12. What this skill does not cover

**Edition gap.** Everything above is built from the manuscript labeled "locked May 2026." A later October 2026 edition exists and was too large to fetch during this synthesis. Anything below that a future reader finds changed in the newer edition should be checked against that edition directly, not assumed stable from this file.

**Coverage gaps within the May 2026 edition itself:**

- Chapter 25 and everything after the "V · Horizon" divider in the Practice section was not available; the file used for that pass ends at the bare heading "Chapter 25" with no body text.
- Chapter 12's full body text (ahead of its Stacking Architecture summary box) and Chapter 16 (the full saboteur library's individual entries, charge ranges, triggers and interrupts for all 33 named saboteurs) exist in the source but are not individually re-quoted here; they are flagged as directly quotable from the source extraction rather than retyped, since the charge-range figures are numeric data worth copying exactly.
- Appendix A's "Coherent Opposite Library" entries (20 of a stated 112/114 fully codified nodes) are named by number and title only here, not reproduced in full; same for Appendix B's full 1-114 node table and the 52-card Letting Go deck roster.
- The 26-Clairs sub-faculty table (items 9 through 26) is named by count and example only, not reproduced row by row.
- The organizational outcome case studies (Illogika, Equinox Games, Subluminal Games) and the individual physician accounts (Guzik, Smith, Humphries, Pastor) are summarized, not quoted in full, and their evidence-tier status (audited versus not) could not be confirmed from the sections read; the "not formally audited" disclaimer `BOOK-ERRATA.md` attributes to this material was not found verbatim in the passages read here.
- No definition of the word "SPS," "Pratyaya," or "SFN" as full words (not acronyms) was found anywhere in the seven sections read. They are used as load-bearing terms without expansion; if the full-length terms exist, they are elsewhere in the book, not in the material this file draws from.
- The book's "Three Energy Channels Per Node" (masculine, feminine, integrated) is the closest candidate found to a concept that might elsewhere be called "the Three Orientations"; this was not confirmed under that exact name anywhere in the sections read.

Treat any claim in this file that is not backed by a direct quotation above as a gap to check against the full manuscript or against Lance directly, not as settled.
