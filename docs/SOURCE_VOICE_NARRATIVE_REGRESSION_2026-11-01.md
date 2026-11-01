# Source voice narrative regression: family-to-self attribution
Date: 2026-11-01. Scope: Source AI pilot voice + isolated HTML. Draft production PR #163 remains unmerged.

## Root cause (verified)
The latest voice conversation had accurately spaced ElevenLabs transcripts. The one-file browser tracker rendered each token in a separate inline span with no text-node whitespace. Copying the displayed transcript concatenated words.

The canonical MOB `atuned_src/engine/lexicon.js` does **not** contain the descriptor lemmas `indignant` or `avoidant`; the 112-address lexical tracker therefore could not underline them. Do not silently map these words to a fixed fetter/seat or change canonical CQ weights without the owner's mapping decision and evidence test.

The V2 assistant invoked `read_sniffer_evidence` early but not during a later substantive multirelative/self-reflection passage. More than a keyword/fetter matching gap: the live pilot lacked a narrative *subject / attribution / self-recognition* layer.

## The corrected interpretation contract
Synthetic nonprivate test fixture:
'I felt excluded. My sister seemed indignant. My mother seemed avoidant. My father was angry. Now I notice some of those patterns in myself.'

What Source should distinguish:
- Speaker's experience: user-reported exclusion (doesn't prove nobody loves them).
- Family-member descriptions: three user-reported third-party attributions; NOT identity diagnoses or verified facts.
- Explicit self-recognition: the speaker says they notice some overlap in themselves. This is a *family-to-self / intergenerational narrative candidate*. Which specific behavior applies to self is UNKNOWN; ask at most one non-leading question if inquiry is helpful.
- "Ancestral" as a genetic/epigenetic or transgenerational mechanism is NOT established. Never invent great-grandparents, inherited cause, chakra load, fetter or CQ measurement.
- Denials and contrasts must suppress candidate promotion. Recognize 'I do NOT see this in myself', 'unlike my mother' and corrections.

## Local executable fix outside repo
`SOURCE_AI_NARRATIVE_V3.html` (delivered in owner chat, not committed to repository) keeps the **same V2 ElevenLabs agent** `agent_8301m6aqwbrje4v8218ty5rz2w2b`, voice and startup handling. Adds:
1. Actual whitespace between word spans (copy/paste restored).
2. Neutral purple underlining for observed descriptors `indignant`, `avoidant`, etc., with no fabricated chakra color or canonical match.
3. Speaker-attributed narrative panel, self-recognition and reported self-worth beliefs as separate, explicitly tentative signals.
4. A family-to-self narrative attached to the existing `read_sniffer_evidence` client tool, across recent session turns.
5. Documented SDK `sendContextualUpdate` after confirmed substantive transcripts when narrative content changes. It is non-interrupting, not a user message, and does **not** trigger Source to speak.

Agent V2 prompt updated to version `agtvrsn_6401m6bwsjnefevar6cxwx68bae9` with a narrative subject/role shift rule and instructions to call the evidence tool for substantive new turns. Greeting, Matilda voice, and -1 idle timeout independently read back unchanged. No production system prompt or production code deployed.

## Local regression test results
17/17 local visual/semantic test cases passed (12+ structured family relationship examples, display whitespace, observed descriptor underlines, cross-turn client-tool evidence, mobile width). Separate mock SDK conversation test passed: start -> two confirmed turns -> non-interrupting context updates -> client tool returns family-to-self evidence -> stop. Node inline JS syntax passed. No live audio / provider tool retrieval turn was tested after this update.

## Required MOB integration seam
Do not copy the local HTML's heuristic into the production canonical lexicon as a new scoring model. Instead:
- extend `srcVoiceIntelligence` on draft PR #163 with explicit subject/relationship attribution and evidence states, sourced to the user report;
- create a canonical narrative record shape: person role, text/source span, descriptive behavior, negation, self-attribution, uncertainty, correction, consent;
- add tests for sibling+parents+self recognition, self-only observation, denial, hypothetical, contradiction, early history, cross-turn reference, and corrected inference;
- define approved ontology mappings for `indignant` and `avoidant` only with canonical review; do not guess chakra/fetter;
- connect through same-origin read-only `srcVoiceIntelligence` and verified tool evidence before declaring full graph/CQDQ wiring.
- continue build-gate repairs: `engine.js` / `source.html` / funnel generated files are stale on draft PR #163.

Owner-visible behavior priority: listen to the narrative, not only individual words. No double-question, no automatic check-in, no unsupported motive/ancestry conclusions.
