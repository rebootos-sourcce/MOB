# ATÜNED — SOURCE Signal Register, Adjective, Intensity and Imprints TDD Addendum
**Version:** 1.0 — design proposal  
**Date:** 2026-10-29  
**Status:** DESIGN ONLY / NOT IMPLEMENTED / NOT VALIDATED  
**Parent:** [SOURCE Conversational Soul TDD](ATUNED_SOURCE_CONVERSATION_FIRST_SOUL_TDD_2026-10-29.md)

## 1. Ruling and purpose

The owner clarified that Source must hear **the words as behavioral evidence** as well as the human story: adjectives associated with the chakra/seat registers, intensity language that changes the weight of a statement, repeated expressions over time, and the language that may reveal internalized or structural limiting beliefs. The existing Sniffer's *highlighted story → Imprints → Bank* pathway remains an important **feedback mechanism**, even though the old text-entry Journal interface has been superseded by a natural, conversation-first experience.

**Principle:** an emotional word is a signal worth noticing, not a diagnosis, moral defect, proof of a fixed limiting belief, or permission to attribute a body sensation the person never reported. Repetition creates **evidence of recurrence in the language**; independent events, confirmed actions, contexts, and user corrections establish whether the underlying *behavior* recurs.

ATUNED's language of energetic **upregulation/downregulation** is its own interpretive framework. The detector must not present a word-derived seat, intensity or signal as a clinically verified physiological measurement, a law-of-nature finding, or the true cause of a person's feeling.

## 2. The listening stack — four simultaneous questions

For each meaningful span of a conversational turn:

1. **WHAT:** What phrase, adjective, verb, event, belief statement or somatic descriptor was actually said? Preserve exact words and original offsets.
2. **HOW MUCH / HOW QUALIFIED:** Does the person say *slightly angry*, *angry*, *furious*, *completely overwhelmed*, *not angry*, *formerly angry*, *angry every day*? Parse degree, frequency, certainty, escalation, denial, and direction. Stronger language can indicate reported intensity, but lexical strength is not a validated measure of nervous-system activation.
3. **WHERE IN THE ATUNED MODEL:** Which proposed emotional axis, chakra/seat, coherent/shadow pole, and linked node records might this language touch? Retain the actual lexicon path, proposed mapping, confidence and alternate mappings. No anatomy assertion from a lexicon match.
4. **HOW IT MOVES:** Is this one emphasized statement, several references to the same event, an independently recurring event, an increasingly intense description, a quote of another person, or a reported shift after a release/ritual? Count independent event windows separately from phrase frequency.

The four questions operate **concurrently**; the Sniffer must not take the largest adjective and then infer all higher-level psyche structures from it.

## 3. Concrete rule: modifier + register + context + recurrence

**Proposed, not the shipped computation:**

~~~~text
Utterance → segmentation + raw spans
          → speaker / experiencer / target resolution
          → polarity / negation / tense / quotation / hypothetical guards
          → idiom and limiting-frame detection
          → adjective, feeling, event, somatic and action descriptors
          → scoped degree modifiers, frequency terms and certainty cues
          → candidate register(s): axis / seat / coherent or shadow direction
          → provisional evidence weights and uncertainty
          → within-turn repeat vs independent-episode recurrence
          → longitudinal change, contradictions and missing evidence
          → supported Imprint candidates + Source conversation signals
~~~~

**Score separation is mandatory.** Do not merge these into one uninterpretable "charge" value:
- **Base lexical weight:** lookup table's authored weight, on its original scale. In the existing lexicon, e.g. *angry* maps to solar 18, *furious* to solar 24; they are *model weights*, not clinical intensity.
- **Modifier effect:** a versioned, scope-aware factor; "a little" should not be treated like "absolutely", and modifiers must attach to the correct expression rather than the whole turn. **Actual numerical multipliers are not ruled or calibrated yet**; do not invent them as established constants.
- **Reported intensity:** how the person describes their own experience, where supported by their language or explicit self-rating.
- **Statement repetition:** multiple phrases in the same retelling; can indicate emphasis, not separate lifetime events.
- **Episode recurrence:** independently contextualized incidents across time; a stronger signal of repeat behavior when comparability is established.
- **Structural belief evidence:** generalized self/world rule or conditional schema such as "I always mess things up" or "I'm not allowed to say no." This may arise without any emotion adjective.
- **Behavioral confirmation:** an action/choice/consequence corroborated by further account, not inferred from adjective alone.
- **Source uncertainty:** explicit uncertainty and counterevidence, separate from magnitude.

A single turn that repeats "angry" three times must not count as three independent experiences. Conversely, "I was angry with my manager on Monday, angry with my father on Tuesday, and angry with myself today" refers to **three reported episodes** with different targets; the possible shared structure is a hypothesis, not an established single root.

**Do not use a negative-minus-positive net score as the sole readout.** Coherent and shadow directions can both be present in a person's account and must remain inspectable independently. The owner's coherence model governs interpretation of signal degradation; this detector only provides evidence for discussing it.

## 4. Context gates and why they matter

The contextual safeguards apply before an Imprint is treated as a candidate for this person:

| Utterance | What is supportable | What is not supportable |
|---|---|---|
| "I was furious." | self-reported past anger, high-strength adjective | current anger, precise bodily seat, moral breach |
| "I wasn't angry; he was furious." | denial of self anger, report of another's anger | scoring the speaker as angry |
| "I was a little angry." | mild degree modifier on self anger | same reported degree as "furious" |
| "I was angry three times this week." | reported frequency; needs episode contexts | three corroborated independent patterns |
| "I always ruin everything." | generalized self-limiting statement, possible structural belief | proof it is true, psychopathy, a diagnosis, confirmed root |
| "My father always said I'm useless." | a quoted external message and possible imprint source | proof the speaker currently endorses that belief |
| "I used to panic, but now I can speak up." | possible temporal improvement plus behavior change | present-tense fear from the word "panic" |
| "I was angry, but I told her calmly why." | anger and a potentially coherent response at once | automatic integrity violation |
| "Anger is useful in fiction." | abstract mention, not self-report | person's charge or imprint |

Additional guards: quoted speech, sarcasm, ASR uncertainty, double-negation, "I don't want to be angry," hypothetical language, ambiguous "you", other-person attribution, split clauses, historic-versus-current status, cultural and dialect variations, multiple readings of "intense", and emotional language used for emphasis or humor.

**Intensity is not recurrence, recurrence is not causation, and an emotion is not an integrity violation.** All three distinctions must survive the whole pipeline.

## 5. Data contract — evidence travels intact

A candidate **RegisterEvidence** event should include:

~~~~json
{
  "evidence_id": "stable-id",
  "turn_id": "turn-id",
  "raw_span": "I was incredibly angry in that meeting",
  "offsets": {"start": 0, "end": 39},
  "descriptor": {"surface": "angry", "lemma": "angry", "type": "adjective"},
  "modifier": {"surface": "incredibly", "scope": "angry", "degree": "high", "multiplier": null},
  "experiencer": "self",
  "event_target": "meeting",
  "tense": "past",
  "polarity": "affirmed",
  "quoting": false,
  "register_candidates": [
    {
      "axis": "Anger",
      "seat": "Solar",
      "direction": "shadow_candidate",
      "lexicon_weight": 18,
      "source_ref": "atuned_src/engine/lexicon.js",
      "mapping_confidence": null
    }
  ],
  "within_turn_mentions": 1,
  "independent_episode_key": null,
  "longitudinal_recurrence": "unknown",
  "belief_frame": null,
  "causal_claim": false,
  "imprint_status": "candidate_unconfirmed",
  "storage_consent": "not_requested",
  "contradictions": [],
  "unresolved": ["modifier multiplier not calibrated", "no exact body location reported"]
}
~~~~

The example values illustrate a proposed schema, not a real parser result or calibrated probability. Keep canonical source text and the mapped normalized representation separate. Attach evidence IDs to every derived graph edge, candidate Imprint, proposed belief structure, summary connection and display event.

**No unapproved automutation:** perception yields a candidate, not an automatic change to a person's moral score, canonical graph, stored story history or a release outcome. Explicit save/processing permissions and actual existing account rules govern persistence. When the app already automatically persists authorized session events, do not change that policy without a separate privacy decision.

## 6. Imprints and the Bank — the visible experience

**Source talks naturally while the Sniffer listens underneath.** The conversational stage should be calm, spacious and responsive. The user's own words may be revealed in an optional, inspectable **story-trace layer**, not in a permanent editor full of colored tokens.

- **Highlight:** the exact original words that contributed to an interpreted signal; distinguish descriptor, modifier and belief phrase. Avoid painting whole sentences as negative based on one word. Preserve correct offsets for live ASR corrections and user edits.
- **Explain:** selecting a trace reveals its actual phrase, proposed register, context and why it was considered; never claim a specific body address when it was inferred from the seat.
- **Imprint preview:** a live, *provisional* rendering of what the Sniffer currently sees. It can appear and disappear as the person clarifies or corrects speech. Explicitly show "possible" or equivalent uncertainty.
- **Bank:** the maintained working inventory of supported and appropriately saved Imprints/patterns, with evidence and version; distinguish pending/provisional from accepted/saved. Existing application-specific commit/saving semantics must be migrated to conversation-appropriate controls rather than removed without a persistence plan.
- **Longitudinal evolution:** new episodes can strengthen, weaken, separate or contradict a proposed pattern. An animation should represent these evidence changes, not a fictional physical energy reading.
- **Conversation:** Source can say, "You've described being angry in several different situations. What feels similar about those moments?" It **does not** say, "Three angry words mean your Solar is downregulated." It can show the candidate mapping only when the user explores it.

Visual experience should communicate **signal → possible relation → verified/accepted working interpretation** through motion/appearance, not through flashy color or scores. Stable relationships become clear; ambiguous ones remain open; corrected ones gracefully retract.

## 7. How this changes the SOURCE reasoning policy

Source takes register evidence as a **private observational input**, alongside intention, action, context, conditioning, the 13 nature laws, 15 human-nature principles, 21 integrity laws, expression, coherent opposites, trace graph, and longitudinal episodes. It should seek the smallest discriminating question between plausible explanations.

The order of **interpretation** is:
1. What exactly was said, by whom and about whom?
2. What reported experience and degree are present?
3. What optional register mapping does the model propose?
4. Is this emphasis, a repeat telling, or a genuinely distinct episode?
5. What generalized belief or behavioral choice is actually evidenced?
6. What contradictory or coherent evidence is also present?
7. Is a Source question useful, or should it simply listen?
8. What, if anything, is eligible for provisional Imprint preview, consented Bank storage, or a graph proposal?

Emotion can reveal conditioning without being equivalent to conditioning. "Only repeating because it was experienced" is a useful **working hypothesis about autobiographical language**, not a universal truth: language can be quoted, imagined, hypothetical, scripted, or repeated rhetorically.

## 8. Existing implementation evidence and exact gaps

Read against the connected MOB repository on 2026-10-29:

- [SNIFFER_SPEC.md](../SNIFFER_SPEC.md) explicitly calls for "intensity of the adjectives at that address," the 9 axes, their coherent/shadow poles, and the nature → human-nature → expression flow.
- [Lexicon](../atuned_src/engine/lexicon.js) maps adjectives and phrases to model seats and weights; it contains explicit examples *angry: solar, 18* and *furious: solar, 24* and the ADJ2CHG charge mapping.
- [Sniffer](../atuned_src/engine/sniff.js) has scanStory, parseStory, marksOf, and sniffStory. Existing annotations carry some negation/other-person handling; per-source semantics and regression coverage still need end-to-end validation for this new composite signal model.
- [TDD-sniffer.md](../TDD-sniffer.md) describes intensity modifiers as only **partial** (SB2b), not a full scoped, calibrated model. It warns that lexicon matches are evidence of wording, not proof of a person-level condition; this addendum preserves that rule.
- [Journal UI](../atuned_src/ui/storyui.js) contains story highlights, candidate Imprints, a Bank and a Commit path. These mechanisms provide a migration starting point, **not** a mandate to retain the obsolete entry-editor interface.
- [SOURCE intelligence TDD](../SOURCE-TDD-V3-intelligence.md) includes evidence ledgers, graph history, contradiction handling, context transfer and bank/vault. The new Source conversation design must connect to those services.
- [2026-10-29 Source soul TDD](ATUNED_SOURCE_CONVERSATION_FIRST_SOUL_TDD_2026-10-29.md) remains the parent behavior and creative authority.

Not verified as implemented: modifier scope calibration, independent-event counting, new register evidence event shape, causal/integrity-gated graph proposals, live conversation-as-primary visual trace, and automatic/consented Bank transition under the new interface.

## 9. Tests, release gates and coverage metrics

**Automated test pack minimum:**
- Lexical degree: *a little angry* vs *furious* must not be interpreted as identical reported degree; **no invented numeric factor** until calibrated.
- Subject: *he was furious, I was calm* must preserve other-person anger and speaker calm.
- Negation: *I am not angry* must not produce affirmed current anger.
- Time: *I used to panic* vs *I panic every morning* separate past and current.
- Modifier scope: *I was angry, then very relieved* scopes "very" to relieved only.
- Frequency: *angry, angry, angry* one event; three separately dated episodes are three, if context supports it.
- Belief frame: *I always fail* detected as a possible generalized rule even if no emotional adjective occurs.
- Quoted conditioning: *My mother said I was worthless* attributed to mother, not silently endorsed.
- Mixed poles: *I felt furious but made a respectful request* keeps both reports, never a signed cancel-out.
- Revision: user corrects ASR "furious" to "curious" → old mark and provisional candidate retract; saved history respects correction rules.
- No imprints: normal talk with no supported register produces a normal conversation and no fake charge.
- Explainability: every visible highlight maps to original raw span; every Imprint to inspectable evidence; every accepted Bank item to consent/version/provenance.
- Agency: user rejects a classification or moves on → Source doesn't repeat it or silently reinsert it.
- Privacy: unapproved draft signal never leaks to permanent storage/analytics; permitted persistence still functions.

**No completion declaration** until code integration plus end-to-end runs verify these and blinded human review validates naturalness, restraint and clarity.

**Metrics proposed, not achieved:** 100% of visible highlights trace to correct original spans; 100% of stored Imprints trace to permitted evidence and a versioned model; 0 wrong-person Imprints in the adversarial test suite; 0 negated-emotion-as-affirmed failures in the suite; 0 same-event-as-independent-recurrence mistakes in the suite. These are acceptance thresholds, not observed rates.

## 10. Measurements and values

- Faithfulness to the newest user-described Sniffer behavior: **0.98 confidence**.
- Compatibility with checked lexical/Imprint documentation: **0.95 confidence**.
- Modifier/recurrence design testability: **0.94 confidence**.
- Empirical validity of linguistic signals as latent belief evidence: **not established**.
- Actual integrated implementation and acceptance status: **NOT VERIFIED / NO CODE CHANGED**.

**Architecture seam:** keep **Sniffer = observes/weights with provenance; Imprints = provisional structured readings; Bank = governed working inventory; Graph = relationships and history; Source = conversation, discernment, correction and synthesis**. None is a substitute for the others.
