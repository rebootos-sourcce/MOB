# The Sniffer · detection spec for incoming journal text
**Built 2026-09-20 from `reviews/canon.json`, `ENGINE.json`, `reviews/elements.json`
and `MOB_Complete_v330.html`.** Everything below is already ruled in the canon
unless marked OPEN. Nothing here is invented.

---

## 0 · The mirror principle

You asked for the sniffer to mirror the release structure. It already can,
because the release protocol is four moves and each one has a detection twin.

| Release (ruled) | Sniffer twin | Output |
|---|---|---|
| **Locate** the address | which of 112 addresses does this language point at | node id |
| **Charge** — read the load | intensity of the adjectives at that address | 0-10 shadow load (SQ) |
| **Release through the gates** | which gate is holding: aware/ignorant, detached/attached | gate id |
| **Uncover the replacement state at the same address** | which coherent pole is absent | pole id |

**The last row is the one that makes this a sniffer and not a sentiment
classifier.** Every shadow in the system has a named coherent opposite at the
same address. Detecting the shadow tells you the replacement to offer. That map
is `reviews/elements.json`, and it is complete.

---

## 1 · Detection layers, in firing order

The canon rules the causal chain. Sniff in this order; each layer constrains the
next.

```
bias  →  fetter  →  saboteur  →  complex  →  hyper-complex
                                    ↓
                        (mask is OUTPUT, not a rung)
```

**Ruled:** the mask is not a layer. The archetype is always running and cannot
be released — it was never installed. The seam between native and acquired has
**no operator**; do not write one.

**Also ruled:** the arrow is not strictly top-down. Pattern can install from any
direction. The strongest joint is **fetter → saboteur**, which is where the
bands live and where a sniffer should put its confidence.

---

## 2 · Layer one · the nine emotional axes (fetters)

This is the base lexicon. Each axis has a somatic address, a shadow pole and a
coherent pole.

| Axis | Address | Shadow | Coherent |
|---|---|---|---|
| Fear | Lumbar | Contraction | Safety / Ground |
| Anger | Celiac | Compressed will | Calm / Integrated Power |
| Shame | Pudendal | Collapse | Worth / Self-respect |
| Disgust | Sacral / Dermis | Rejection | Acceptance / Equanimity |
| Apathy | Shoulder / Throat | Resignation | Joy / Aliveness |
| Shock | Dermis | Flooding | Groundedness |
| Sad | Inferior Cardiac | Perceived loss · grief at depth | Happy / Restoration |
| Surprise | Lower solar plexus, bilateral at lung edges | The burst of the new | Readiness |
| Anticipation | Below the heart | Waiting | Presence |

### The scoring rule that matters most

> **Each of the nine axes carries TWO independent readings, 0-10: a shadow load
> and a coherent load. They are not two ends of one number. A person can hold
> real Safety in one context and real Fear in another.**

**The sniffer must emit two numbers per axis, not one.** A journal entry can be
simultaneously high Fear and high Safety. Collapsing them into a single
signed value destroys the reading.

### Known gaps

Shock, Surprise and Anticipation carried "pole pending confirmation" in
`elements.json`, but were **closed 2026-09-14**: groundedness, readiness,
presence. Use the closed poles. `elements.json` is stale here.

**Surprise scores no saboteur and should score none.** It clarifies rather than
distorts. If your sniffer wants to fire a saboteur off Surprise, that is a bug.

---

## 3 · Layer two · the 33 saboteurs, with firing bands

A saboteur is a **configuration of fetters at specific intensities**, not a
thing. Break the co-mingling and the saboteur is gone.

**Firing rule, ruled 2026-09-15:**
- `present_if` address load ≥ band low
- intensity **peaks inside the band and tapers above it**
- **"A band edge is a ramp, not a cliff."** A hard floor makes 6.9 and 7.1
  different answers, and no practitioner reads a body to a tenth of a point.
  Measured: a hard edge scores 94% on exact readings and collapses to **73%**
  when the reader is off by one point, which is the normal condition.

| ID | Saboteur | Fetters [band] |
|---|---|---|
| S01 | Negotiator | Fear [4–6], Apathy [3–5] |
| S02 | Controller | Fear [7–10], Anger [5–8] |
| S03 | Victim | Sad [6–8], Anger [5–7], Apathy [2–5] |
| S04 | Perfectionist | Disgust [5–7], Anger [4–6] |
| S05 | Pleaser | Apathy [3–5], Fear [3–8] |
| S06 | Hyper-Achiever | Apathy [5–7], Fear [4–8] |
| S07 | Hyper-Rational | Shock [2–4], Disgust [3–6] |
| S08 | Hyper-Vigilant | Fear [7–9], Anger [5–7] |
| S09 | Restless | Apathy [5–7], Fear [2–4] |
| S10 | Stickler | Disgust [4–6], Anger [4–6] |
| S11 | Judge | Disgust [6–8], Anger [5–7], Apathy [3–6] |
| S12 | Deflector | Shame [4–6], Anger [4–6] |
| S13 | Dramatizer | Shock [6–8], Sad [4–6] |
| S14 | Worrywart | Fear [6–8], Sad [3–5] |
| S15 | Loner | Sad [6–8], Fear [5–7] |
| S16 | People-Pleaser | Apathy [4–6], Shame [3–5] |
| S17 | Skeptic | Disgust [5–7], Shock [3–5] |
| S18 | Dreamer | Apathy [3–5], Sad [2–4] |
| S19 | Procrastinator | Fear [4–6], Sad [3–5] |
| S20 | Imposter | Shame [5–7], Fear [4–6] |
| S21 | Aggressor | Anger [6–9], Apathy [4–7] |
| S22 | Martyr | Sad [6–8], Shame [5–7], Apathy [3–5] |
| S23 | Cynic | Disgust [6–8], Sad [4–6] |
| S24 | Manipulator | Anger [5–8], Apathy [4–7] |
| S25 | Overthinker | Fear [5–7], Shame [4–6] |
| S26 | Escapist | Apathy [4–6], Fear [6–8] |
| S27 | Nihilist | Disgust [7–9], Sad [5–7] |
| S28 | Innocent | Fear [2–4] |
| S29 | Pessimist | Sad [5–7], Fear [4–6] |
| S30 | Catastrophizer | Fear [8–10], Sad [6–8] |
| S31 | Enabler | Apathy [3–5], Shame [4–6] |
| S32 | Control Freak | Fear [7–9], Anger [5–7], Anticipation [5–7] |
| S33 | Avoider | Apathy [6–8], Fear [5–7] |

**Known ambiguity to guard against:** Resentment mapped onto Anger collapsed
Aggressor and Manipulator in simulation. Resentment is ruled as a **composite —
Anger + Apathy**, the grudge held. Sniff it as the composite, not as Anger.

**Avoider fires in 81% of runs and costs 0.1 points.** A saboteur that fires
almost always and changes almost nothing is a weak signal. Weight it low or your
sniffer will report Avoider on everything.

---

## 4 · Layer three · the 12 archetypes

Always running. Cannot be released. Use for **framing the readout**, never as a
target.

| Archetype | Saboteurs | Address |
|---|---|---|
| Warrior | Controller, Judge | Solar Plexus / Throat |
| Innocent | Pleaser, Avoider | Root / Sacral |
| Orphan | Victim, Cynic | Root / Crown |
| Caretaker | Pleaser, Martyr | Heart / Throat |
| Explorer | Restless, Escapist | Sacral / Root |
| Outlaw | Judge | Solar Plexus |
| Lover | Hyper-vigilant, Pleaser | Heart |
| Creator | Stickler, Perfectionist | Throat / Sacral |
| Jester | Avoider, Hyper-rational | Sacral / Third Eye |
| Sage | Hyper-rational, Skeptic | Third Eye |
| Magician | Victim, Manipulator | Crown / Throat |
| Ruler | Hyper-achiever, Controller | Crown / Solar Plexus |

**OPEN:** the roster count is disputed — thirteen here, twelve where the book
describes the glyph, fifteen in the March library. Do not hardcode the count.

---

## 5 · Layer four · the six hyper-complex modes

| Mode | Cluster |
|---|---|
| Grandiosity | I · Narcissism |
| Predatory | II |
| Collapse | III |
| Rigidity | IV |
| Dysregulation | V |
| Dissociation | VI |

Maps one-to-one onto Jeffrey Young's schema therapy modes, **independently
derived**. Descent chain: Narcissism → Machiavellianism → Sociopathy →
Psychopathy → Megalomania.

> **HARD GUARD, ruled:** clinical labels are **TRANSLATION ONLY, never an equals
> sign.** Left column is node load we derive, right column is what a clinician
> would call it. **The app must not present a clinical label as a diagnosis.**

**Dissociation is the most common complex in the general simulated cohort.**
Expect it; do not treat frequency as severity.

---

## 6 · The spiritual laws — what "violated" means

You asked the sniffer to detect where the spiritual laws are being violated.
**CQ is defined as the mean of these 21, each scored 0-10, times 10.** So a law
violation is not decorative — it is the actual input to the coherence number.

| E | Law | Violation reads as |
|---|---|---|
| 29 | Truth | Deception. The nerve registers falsity before the word arrives |
| 30 | Transparency | Opacity. Energy diverted to concealment |
| 31 | Unity | Division. Enforcing separation where the field is continuous |
| 32 | Awareness | Reactivity. The pattern firing first |
| 33 | Presence | Absence. Rumination and rehearsal, the moment abandoned |
| 34 | Equanimity | Volatility. Peace held hostage to conditions |
| 35 | Compassion | Indifference **or self-abandonment** — withheld in either direction |
| 36 | Forgiveness | Resentment. The grudge fed, vengeance as identity |
| 37 | Courage | Avoidance. The original charge compounding with each refusal |
| 38 | Temperance | Overindulgence. The escalating dose |
| 39 | Duty | Betrayal. The field fragments when word and deed separate |
| 40 | Ownership | Externalization. Victimhood inward, justification outward — one move, two directions |
| 41 | Justice | Corruption. The scale thumbed, punishment as appetite |
| 42 | Non-Harm | Cruelty **and carelessness**. Harm as entertainment or shrugged collateral |
| 43 | Wisdom | Folly and sophistry. The plausible preferred to the true |
| 44 | Humility | Pride and grandiosity, **or the inverse self-abasement** |
| 45 | Generosity | Circuit broken — hoarding on giving, entitlement on receiving |
| 46 | Detachment | Attachment. Outcome-clinging, control, or avoidance wearing robes |
| 47 | Patience | Forcing or scattering. The outcome demanded now |
| 48 | Aesthetic Beauty | Chaos. Environmental noise compounding internal noise |
| 49 | Nature | Synthetic departure. Chronic mismatch |

**Note the bidirectional ones.** Compassion, Humility, Generosity and Ownership
are violated in *both* directions. A sniffer that only looks for the obvious
pole will miss half of them — self-abandonment reads as virtue in a journal.

**Ruled:** *every law against its mirror.* The calculation carries the pair.

---

## 7 · Signal flow — nature → human nature → expression

Your "signal flow being violated" maps to three more lenses of the same table.

**Coherence, defined:** *energy flowing from nature into form, through human
nature, into the psyche, and back out. Any distortion is from the shadow.*

**Nature (13):** All Is One · All Is Motion · Polarity · Correspondence ·
Attraction · Inspired Action · Transmutation · Cause & Effect · Compensation ·
Potential · Relativity · Rhythm · Gender

**Human nature (15):** Form · Archetype · Biofield · Attunement · Perception ·
Intelligence · Pleasure & Pain · The Three Axes · Symbol · Identity · Choice ·
Ego · Intention · Action · Memory

**Expression (10):** Peace · Play · Curiosity · Creativity · Flow · Wonder ·
Order · Love · Purpose · Will

Each carries a shadow and coherent string in `reviews/elements.json` — fields
`sh` and `co`. **That file is your lexicon. Load it directly rather than
retyping it.** 76 numbered slots, 75 live (E43 retired).

High-value expression shadows for journal text: **Flow → Block**, **Curiosity →
Apathy**, **Play → Rigidity**, **Purpose → Driftlessness**, **Will →
Resignation**.

---

## 8 · The three axes — where empathy and intent actually resolve

Ruled architecture, and it is not three peers:

```
Aware / Ignorant  ─┐
                   ├─→  Intentional / Avoidant   (the OUTPUT, the sump)
Detached / Attached┘
```

**Any upstream distortion lands as attachment in the output.** Measured cascade
on a real profile: 14.5% avoidance with both upstream clean → **43.2%** with one
distorted → **71.9%** with both.

**Product consequence, ruled:** an avoidance number shown alone is a readout of
everything upstream, not a trait. **Show the upstream state with it or it reads
as a character flaw.** This applies directly to your sniffer's output panel.

Axes in the Sat-Chit-Ananda frame: X = Sat, energy/being. Y = Chit,
information/awareness. Z = Ananda, directed will/expansion. **Radiance is the
magnitude of the vector, not a fourth axis.**

**Empathy** is not its own axis. It resolves as Compassion (E35) on the law
side, and as *anger with empathy absent* = **Entitlement**, ruled as a superego
amplifier arising downstream of judgment as compensatory dominance.

**Intention vs outcome** is E26 Intention (will and integrity pointing at the
same thing) against E27 Action (movement that generates more charge than it
resolves). The gap between them is the readable thing.

---

## 9 · Dante's nine circles — the depth taxonomy

The book carries this as a **behavioural taxonomy of the downward spiral, read
as diagnostic and explicitly not as allegory.** It gives the sniffer a depth
scale with somatic addresses attached.

| Circle | Pattern | Somatic |
|---|---|---|
| C1 Limbo · Charon | Disbelief. Spiritual bypass through rationalism | Crown-to-heart circuit never completed |
| C2 Lust · Minos | Narcissism. Grandiose entitlement, self-appointed arbiter | Sacral, desire looping without ground |
| C3 Gluttony · Cerberus | Consumption as substitution. Appetite replacing connection | Solar plexus collapse driving into oral circuit |
| C4 Greed · Plutus | Scarcity identity. Worth measured in possession | Root locked in survival frequency |
| C5 Wrath & Sloth · Phlegyas | Same suppressed charge. Wrath out as attack, Sloth in as shutdown | Solar plexus, fight-or-freeze split |
| C6 Heresy · The Furies | Ideological decoherence. Doctrine as identity armor | Third eye locked, perception distorted by installed narrative |
| C7 Violence · Minotaur / Centaurs / Harpies | Against others / against self / against nature and order | Full system, no single anchor |
| C8 Fraud · Geryon | Beautiful surface, serpentine beneath. Mask as entire OS. **Test: does this person's warmth cost them anything, or does it require an audience?** | Heart inverted, warmth performed not generated |
| C9 Treachery · Satan frozen | Complete inversion. Stasis at terminal velocity | Full system locked, no circuit completing |

**C8's test is the single most sniffable line in the whole system.** Performed
warmth versus generated warmth is detectable in text: praise that arrives with
an audience, generosity narrated rather than done.

**No seven deadly sins framework exists in the corpus.** Dante covers that
ground. Do not add one — it would collide with the 21 laws, which already carry
Temperance, Humility, Generosity, Non-Harm and Patience.

---

## 10 · Output contract

What the sniffer should emit, so it hands cleanly to release:

```json
{
  "axes":      [{"axis":"Fear","shadow":7.2,"coherent":2.1,"address":"Lumbar"}],
  "saboteurs": [{"id":"S30","name":"Catastrophizer","confidence":0.71,
                 "because":["Fear 7.2 in band 8-10 (ramp)","Sad 6.4 in band 6-8"]}],
  "laws":      [{"e":37,"law":"Courage","violation":"Avoidance","score":3}],
  "flow":      {"nature":[],"human":[],"expression":[{"e":54,"law":"Flow","shadow":"Block"}]},
  "gates":     {"aware":0.8,"detached":0.3,"intentional":0.25},
  "depth":     {"circle":"C5","confidence":0.4},
  "offer":     [{"address":"Lumbar","replacement":"Safety / Ground"}]
}
```

**`offer` is the payload.** Everything else is evidence for it. The sniffer's job
is to end at an address with a named replacement state, because that is exactly
what release consumes.

**Always emit `because`.** A confidence number with no citation is not
inspectable, and this system's whole defence is that it shows its work.

---

## 11 · Guards — non-negotiable

1. **No diagnosis.** Clinical labels are a translation column, never an equals
   sign. Never present a mode as a condition.
2. **Never score another person.** The text may describe someone else; the
   readout is about the writer's field, not the other party's character.
3. **Two readings per axis, never one signed number.**
4. **Band edges are ramps.** Never a hard floor.
5. **Show upstream state with any avoidance number.** Alone it reads as a
   character flaw and it is a readout of everything above it.
6. **Surprise fires no saboteur.**
7. **Resistance acts on Expression, never on CQ.** A person can be coherent and
   still not get it out of the body. Do not let Resistance divide the coherence
   number.
8. **The estimator is an estimator.** `sqrt(Intention × Integrity) × 10 / (1 +
   0.6·SQ/10)` fits r = +0.97 against the full audit, and is for use only when
   the 21-law audit has not been run. Label it as an estimate in the UI.

---

## 12 · Open — do not hardcode

- Archetype roster count: 13 / 12 / 15.
- Patterns per node: about 20, or 108. The 11,664 figure is **struck**.
- Registers: nine, seven, or ten.
- The benign/malignant polarity conflict — see
  `manuscript_notes/2026-09-20_benign_malignant_routing.md`. Malignancy counts
  up in one place and down in another. Resolve before scoring anything on it.
- Whether Shock/Surprise/Anticipation poles in `elements.json` get refreshed to
  the 14 Sept closure. **The JSON is stale; the canon is right.**

---

## 13 · Files to load, not retype

| File | What it gives the sniffer |
|---|---|
| `reviews/elements.json` | 76 elements, `sh`/`co` shadow and coherent strings — **the lexicon** |
| `ENGINE.json` | saboteurs with bands, axes with addresses, archetypes, domains, formulas |
| `reviews/canon.json` | every ruling, with dates and provenance |
| `handoff/ATUNED_SPEC.json` | the app-facing ruled subset |
