# ATÜNED — SOURCE Intelligence Architecture and Cross-System Seams TDD
**Version:** 1.0 design handoff | **Date:** 2026-10-29 | **Status:** DESIGN CONTRACT, NOT RUNTIME CODE, NOT ACCEPTED IMPLEMENTATION
**Repository:** rebootos-sourcce/MOB | **Design branch:** design/source-conversation-first-soul-2026-10-29
**Supersedes:** text-first conversation assumptions, not existing functional storage/engine services.
**Companions:** [Soul TDD](ATUNED_SOURCE_CONVERSATION_FIRST_SOUL_TDD_2026-10-29.md), [Register and Intensity Addendum](ATUNED_SOURCE_SIGNAL_REGISTER_INTENSITY_SNIFFER_TDD_ADDENDUM_2026-10-29.md), [Schema](data/ATUNED_SOURCE_CONVERSATION_SEAM_SCHEMA_v1.json), [Acceptance Matrix](ATUNED_SOURCE_CONTRACT_ACCEPTANCE_MATRIX_2026-10-29.md).

## 0. Design-only instruction and definition of done
The user authorized developing **systems, reasoning logic, record formats, schemas, architecture, interface seams, TDDs and executable-by-next-engineer acceptance criteria**. No application code, UI code, live database, current engine behavior, graph records or CQ calculation may be changed as part of this design block. This contract is an intended future implementation interface, not a claim those events or APIs exist today.

The objective is not a generic chatbot facade; it is SOURCE as the **top-level orchestrating and discerning intelligence**, receiving *versioned, provenance-preserving observations* from every ATUNED subsystem, selecting a natural conversational move and asking for authorization before changes with downstream consequences. SOURCE is not the authoritative writer of the canon, CQ engine, bank, release engine, ritual engine or graph.

**Definition of design-complete:** each named boundary has a provider/consumer contract, types, identifiers, provenance, authorization, correction path, failure behavior, versioning, tests and an assigned implementation owner. **Definition of runtime-complete:** implementation plus run evidence showing the same contracts work end to end. These are distinct statuses.

## 1. Authority stack and single-source-of-truth rules
- **Owner decisions / newer authorized rulings** take precedence over stale interaction patterns (conversation is primary; user controls topics; "What are we talking about today?" is the opener).
- **Shared canonical records** own entity identity, taxonomy, record structure and sourced behavioral descriptions; SOURCE consumes them read-only, may propose links, never silently declares a pattern as canon.
- **Current canonical 21 integrity laws** are the SI records in `atuned_src/engine/data/canon.js`, not old LAWVIO aliases. Legacy `sniff.js` names Ownership and Wisdom where SI carries Responsibility and Accountability; no automatic alias substitution.
- **SNlFFER** owns word/phrase/attribution/negation/seat candidate observations; not person-level truth or physiology.
- **Trace Graph** owns versioned person-level evidence nodes, candidate relationships, contradiction and lifecycle state, with person and tenant isolation.
- **CQ engine** alone owns numerical CQ / integrity / intention / resistance computation and versions. SOURCE does not manufacture a number because a user says "always" or "furious".
- **Bank / Imprints / Vault** own accepted working patterns and historical intervention records; a live highlight is not a stored imprint.
- **Release / Ritual** own interventions and outcomes; SOURCE offers assistance based on consent, never announces a release happened until the subsystem confirms it.
- **Person** owns the meaning of their experience, permission, corrections and decisions. SOURCE may distinguish an inference from the user's own account.

**Important unresolved truth:** `docs/ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md` reports the formula arithmetic integrated on another branch but Intention comes from an incompatible derived band value, whereas canonical evidence ties intention to said-versus-did follow-through. The older `SNIFFER_SPEC.md` separately says Resistance acts on expression, never CQ. **No new CQ formula or migration is authorized here.** The CQ adapter MUST expose `formula_status: "unresolved"` where appropriate, source version and unknown inputs. A framework ideal of SOURCE CQ 100 is a behavioral design standard and does not make the deployed model mathematically enlightened.

## 2. Coherence philosophy translated to operational behavior
ATUNED describes a conceptual signal pathway: 13 laws of nature → 15 principles of human nature → perceptions and conditioning → intention and integrity → expression/action. Resistance/limiting structures may distort that signal. The 21 integrity laws offer a behavioral mirror; the ten expression principles describe outward expression. These are interpretive mappings within the ATUNED framework, **not independent clinical or physical measurements**.

SOURCE's CQ-100-inspired operating constitution:
- **Free will / agency:** no coercion, attachment to a reply, forced release, manipulative question, or imposed interpretation.
- **Discernment:** differentiate observed words, narrated events, subject attribution, tentative model links and verified facts.
- **Embodiment:** claim only what actual engine/state/evidence warrants, and honor expressed intent in output actions.
- **Flow:** nonmechanical, context-sensitive conversation including silence, correction, humor and changed topics.
- **Accountability:** errors retract, records and graph proposals remain auditable, unknowns stay unknown.
Use the 21 SOURCE loss-of-integrity candidates as **guards on SOURCE itself**, not automatic violations assigned to people.

## 3. Architectural planes (not parent-child psychology)
**Interaction plane:** live speech/text intake, turn boundaries, playback/captions, visual presentation, optional story-trace inspect. No transcript-as-product assumption.
**Perception plane:** Sniffer parse, adjective/intensity/quantifier clauses, partial ASR correction, self/other/quote, time, named body sensations, candidate chakra/seat mapping.
**Evidence plane:** immutable authorized evidence anchors, observation revision ledger, event/episode grouping, provenance, session memory policy.
**Model plane:** contextual retrieval, 13/15/21/10 interpretive lenses, records, trace graph, competing hypotheses, contradiction, recurrence and change.
**Decision plane:** SOURCE move selection, relevance, user intentions and depth permission, 21-law self-integrity check, response generation/revision.
**Action plane:** consented Bank/graph changes, Release/Ritual, CQ read requests, scheduled re-evaluation; each subsystem retains write authority.
**Presentation plane:** natural speech, minimal accessible text, living responsive vector presence, optional inspectable highlights, status/correction/retraction animations.

~~~~text
Voice or text → one canonical TURN INPUT (raw/ASR-final/permission context)
              → PERCIEVED SPANS (Sniffer candidates, not conclusions)
              → OBSERVATION + EVIDENCE LEDGER (raw anchoring and corrections)
              → GRAPH + CANON + CONTEXT READ (typed, versioned, authorized)
              → HYPOTHESES / CONTRADICTIONS / COHERENT ALTERNATIVES
              → SOURCE MOVE + 21-SOURCE-LAW GUARD + PERSON AGENCY
              → NATURAL RESPONSE + DECLARED PRESENTATION CUES
              → optional explicit proposal/approval → authorized subsystem
              → event acknowledgement → updated graph/Bank/history → next turn
~~~~

The arrows are **contract seams**, not the rule that every conversational reply must touch every database. Good conversations may proceed without a single Sniffer-derived Imprint.

## 4. Canonical communication envelope
All cross-system messages are **versioned logical envelopes**, carried synchronously or asynchronously by whatever transport the implementation chooses. Do not mandate a bus, vendor, queue, LLM provider or cloud service without an approved deployment design. [JSON Schema](data/ATUNED_SOURCE_CONVERSATION_SEAM_SCHEMA_v1.json) specifies the proposed serialized shapes.

Envelope required: `schema_version`, `event_id`, `event_type`, `occurred_at`, `correlation_id` (turn/session), `actor` (system or user, no guessed identity), `subject_scope` (person/tenant ref), `payload`, `provenance`, `consent`, `state`. Version identifiers and IDs are stable; transport timestamps are not evidence of when an experience actually happened.

Invariants:
1. **Idempotency:** `event_id` is stable on retries; only one downstream write for a recognized event; replay doesn't duplicate an imprint or release.
2. **Causality:** source evidence references exist before a derived candidate; derived event must cite it. Missing evidence = withheld, never hallucinated.
3. **Attribution:** quote ≠ endorsement; "my sister always" ≠ user emotion; "I wasn't angry" ≠ positive anger hit.
4. **Revisability:** corrections supersede derived nodes and re-evaluate dependencies; do not erase history silently.
5. **Scoped storage:** `consent.scope` must authorize the particular purpose, retention, and external processing; visual preview is not permission to persist.
6. **Graph integrity:** hypothetical edges are `PROPOSED`, not `CANONICAL`; only graph authority promotes.
7. **CQ integrity:** no computed CQ from preliminary adjective / law-cue hits; query the CQ owner for a versioned snapshot or respond `unavailable`.
8. **Response integrity:** if a downstream write fails, SOURCE must not say "saved", "released" or "updated".
9. **Fail closed for consequential writes, gracefully for conversation.** Source can continue listening when a graph/CQ adapter is unavailable.

## 5. Interface seams — provider, consumer, contract and reversals
| Seam | Provider → Consumer | Input / Output | Authority and error behavior |
|---|---|---|---|
| S01 Input | Voice/text capture → SOURCE | `TURN_INPUT` with utterance, ASR stability, speaker, topic, source spans, consent | provisional ASR never treated as final; correction revises spans |
| S02 Sniffer | SOURCE turn → Sniffer → SOURCE | raw text + language metadata → `REGISTER_EVIDENCE` candidates, offsets, adjectives, intensity, quantifier, polarity, subject, timestamps, `because` | detection read-only; missing maps = `unread` |
| S03 Observation | SOURCE → evidence ledger → graph consumer | `OBSERVATION` with user's exact words vs derived claims and verification status | immutable evidence, versioned correction chain |
| S04 Canon/records | Record registry → SOURCE + graph | `RECORD_LOOKUP` stable `id/kind/taxonomyVersion/status/sourceRefs/researchPasses` and typed edges | proposed/unresearched nodes cannot be canonical |
| S05 Graph | SOURCE → graph editor/service | `GRAPH_RELATION_PROPOSAL` with typed nodes/edge, evidence, alternate hypotheses and confirmation | **proposal only**; graph's acceptance event is separate |
| S06 Hypotheses | Graph/context → SOURCE | `HYPOTHESIS_CANDIDATE`, `CONTRADICTION`, missing data, conflict of lenses | keep disconfirming evidence and user corrections |
| S07 CQ | SOURCE → CQ owner | `CQ_READ_REQUEST` → `CQ_SNAPSHOT` with input sources/version/status or unavailable | single CQ calculator; no local recompute |
| S08 Imprints/Bank | Sniffer/Source → Bank | `IMPRINT_PREVIEW` then authorized `IMPRINT_ACCEPT_REQUEST` then ACK/rejection | bank owns persistence; no claimed success before ACK |
| S09 Release | SOURCE → Release | offer + user-selected target/evidence + explicit approval → `RELEASE_REQUEST` → outcome | not therapy/diagnosis, cannot assume release succeeded |
| S10 Ritual | SOURCE → Ritual Builder | user-goal-linked `RITUAL_PLAN_PROPOSAL` and practice reports → approvals and results | practice log does not automatically assert causal CQ change |
| S11 Compass/Avatar | CQ+graph/history → Compass/Avatar presentation | versions, thresholds, unique completed release-pattern count, temporal state | visual states reflect accepted snapshots, not unsupported scoring |
| S12 Presence | SOURCE decision → visual renderer | `PRESENCE_CUE`: listening/considering/speaking/quiet/tentative/supported/retract | visual semantic cue is not biological measurement |
| S13 Audit/Analytics | permitted ledger → analytics | de-identified/aggregated if independently authorized, model version and evidence completeness | no cross-user learning without separate explicit permission |

No new child-parent taxonomy imposed: graph edges among records remain *typed peers where appropriate*. The editor must not convert cross-lens overlap into a hierarchical fact.

## 6. Source's eight permitted conversational moves
`receive`: acknowledge the actual content without unsupported inference. `clarify`: ask for missing context if material. `reflect`: accurately mirror the person's words and tension. `connect`: offer tentative cross-story relation. `discriminate`: ask one question that separates competing explanations. `synthesize`: summarize longitudinal evidence, alternatives and direction. `assist`: provide requested help/action through approved adapter. `yield`: stop probing, permit pause/pivot/silence.

The turn chooser must preserve user request priority, ask **at most one genuinely helpful follow-up question** by default, and permit a full answer or no question. Do not force a "why" ladder. Correction of an earlier inference supersedes stale lines, not the user's experience. Narrative should be natural, not a debug print of the Sniffer taxonomy.

## 7. Signal-frame logic — adjectives, intensity, "always", ancestral scripts
One source phrase can support more than one **distinct** tentative reading: emotional descriptor, scoped degree, generalization, reported family script, reported conditional self-rule, personal divergence, specific behavior and desired outcome. Do not reduce them to one polarity.

Case: "Our family always goes to Grandma's for Christmas, but I don't want to anymore." Extract two evidence anchors:
- Family practice/generalization: `family_script`, subject=family, frequency asserted=always, verified literal frequency=unknown, moral valence=none.
- Divergence: `agency_direction`, subject=self, desire=stop attending, present preference=explicit; infer `family_expectation_conflict` only as a candidate edge.
Source might ask what no longer fits, rather than announce ancestral trauma or calculate charge.

Separate counts: same-word repeats inside one episode vs independent events on different dates. The word "always" boosts *relevance to explore universalizing language*, never a numerical CQ score. Negative language may be quote, hyperbole, a statement about a third person or an admitted emotion without integrity loss. Coherent and shadow descriptions can coexist and need separate records. A chakra/seat mapping inferred from words remains explicitly an ATUNED register candidate, not a physiological location.

## 8. Schema object model and lifecycle
The companion schema defines:
- `TurnInput`: immutable input reference + revisions, consent and capture status.
- `EvidenceAnchor`: original raw span + speaker/experiencer, polarity, tense, source, confidence, privacy.
- `RegisterEvidence`: lexical descriptor/modifier, charged/coherent mapping candidates, source lexicon version, unknowns.
- `Observation`: what was said, what SOURCE noticed, hypothesis references, `userVerification`.
- `PatternHypothesis`: claim, evidence, alternatives, contradictions, provenance, acceptance lifecycle.
- `GraphRelationProposal`: typed source/target IDs, proposed edge type, evidence and state.
- `ImprintCandidate`: pending/confirmed/rejected state, source, user permission; accepted Bank entry requires separate ACK.
- `CQSnapshot`: version, input-source status and numerical values when valid; unknown explicit.
- `ConversationalDecision`: move, reasoning *summary not chain of thought*, response, important uncertainty and guard results.
- `PresenceCue`: semantic visual event, non-diagnostic.
- `SubsystemReceipt`: accepted/rejected/error/pending and authoritative write version.

The schema is **proposed wire serialization**; implementers must map to actual graph/engine IDs, current persona scopes, and existing persistence mechanisms before any release. Record envelope `id/kind/nm/seat/fam/def/body/links/templateId/template/templateValidation/sourceRefs/sourceClaims/researchPasses/status/taxonomyVersion` remains authoritative for deep records; do not replace or rewrite it with this transport schema.

## 9. User corrections and state transitions
~~~~text
RAW TURN → provisional observation → candidate / live highlight
          → SOURCE tentative reflection → person confirms / rejects / corrects
          → corrected observation revision → dependent inference re-evaluation
          → approved Bank/graph proposal, if requested
          → authoritative receipt → visible status and optional narration
~~~~
Allowed hypothesis transitions: `PROPOSED → SUPPORTED → USER_CONFIRMED`, `PROPOSED/SUPPORTED → REJECTED`, `any nonterminal → SUPERSEDED` with revision link. User-reported truth is preserved as reported rather than branded as externally verified. Data in Bank and Vault must be versioned rather than silently destroyed. Rejection retracts unsupported previews and proposed graph edges; historical release evidence remains auditable. **No invisible promotion of a preliminary highlight into a permanent belief about a person.**

## 10. Retrieval, memory and safety boundaries
Conversation context may retrieve only the user's authorized data, documented canonical research and explicitly approved external sources. Keep current turn, durable user-authorized memory and model-generated hypotheses separate. Missing memories are unknown; SOURCE must not invent them. Define a delete/correction propagation protocol per sink; graph, index, Bank, visual trace and analytics should not silently retain material a person withdrew in violation of their chosen consent.

Safety: no diagnosing people from infernal archetypes, chakra words, law scores or political analogies. Never assert a person is psychopathic/sociopathic on this evidence. Escalate crisis/safety needs through existing appropriate user-facing safety protocols without sacrificing respect. Source's "friend-like peer" character must not imply a real personal relationship, superhuman mind-reading or measured somatic energy.

## 11. Operational, nonfunctional and observability requirements
- Each turn's contracts include source version, confidence semantics, decision method, field-level null/unknown meaning, model/record versions and exact provenance.
- PII and conversation data are private by default; no cross-user memory from snippets without explicit governance. Data residence, ASR vendor, retention, encryption and logging need platform approval rather than invented defaults.
- Observability captures `event_id, correlation_id, adapter, outcome, duration, failure_code, schema_version` without automatically logging raw sensitive text.
- Replays are idempotent; failed writes are retriable with the same request id. Speculative visual cues do not claim successful state changes.
- Must support voice-first, accessible transcript/replay, keyboard, captions, reduced motion, platform offline/error recovery, and turn interruption.
- Degrade gracefully: if graph/Sniffer/CQ unavailable, continue normal dialogue, say what is unknown when consequential, never show invented metrics.
- Use versioned CQ and lexical weights; compare longitudinal scores only on comparable versions or show a conversion/provenance warning.

## 12. Ownership, acceptance gates and unresolved decisions
Design owner: SOURCE architecture. Implementation owners must be assigned for perception, graph, record registry, CQ, Bank, Release, Ritual and visual renderer when entering build.

**P0 blocking decisions for downstream implementation:**
1. Reconcile formula CQ Intention (said-versus-did versus `It` derived) and whether Resistance divides CQ or merely expression; reconcile with canonical owner rulings, version the outcome.
2. Reconcile legacy 21-law `LAWVIO` labels to current SI names without unapproved invention; create three research passes per actual record, not just candidate rows.
3. Specify canonical ID/mapping and missing-source behavior for 13 nature/15 human-nature lenses; legacy Sniffer reports zero coverage there.
4. Specify the Bank's accepted versus preview storage state and existing account/privacy consent semantics for conversation mode.
5. Fix graph/nerve vs record taxonomy ID crosswalk against actual graph editor implementation; no blind edge port.
6. Define independent event identity in recurring phrases vs separately dated episodes, and modifier calibrations; do not backfill guessed precision.
7. Confirm hosting, model/voice vendors, authorization boundaries and retention before software deployment.

**P0 design gates:** schema validation, all cross-system seams specified, no unverifiable achievement claims, provenance required, correction/retraction path, simulated handshake tests. **P0 runtime gates (not yet executed):** real multi-turn conversation, sniffer-to-highlight alignment, Bank authorization, graph proposal/acceptance/rejection, CQ versioned snapshot, release/ritual receipt, correction cascade, safety/privacy, accessible UI and truthful completion states. The [acceptance matrix](ATUNED_SOURCE_CONTRACT_ACCEPTANCE_MATRIX_2026-10-29.md) is normative.

## 13. Source map, status, verification ledger
Read [Source Index](ATUNED_SOURCE_INDEX.md) first. Checked as of 2026-10-29:
- `SOURCE-TDD-V3-intelligence.md`: evidence, trace nodes/edges, contradiction, longitudinal patterns, Bank/Vault.
- `reviews/ATUNED-System-Congruency-MVP-TDD.md`: canonical observation contract, event ledger, mirror + correction and release loop.
- `SNIFFER_SPEC.md`, `DESIGN-sniffer.md`, `TDD-sniffer.md`: registers, lexicon evidence rules, gaps, nonclinical guards.
- `atuned_src/engine/lexicon.js`, `atuned_src/engine/sniff.js`, `atuned_src/ui/storyui.js`: existing vocabulary/markers/imprint UI; not redesigned application.
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md`, `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json`: shared record envelope, three research passes.
- `docs/ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`: formula and unresolved domain mapping.
- `docs/ATUNED_SOURCE_CONVERSATION_FIRST_SOUL_TDD_2026-10-29.md`: conversation-first behavioral constitution.
- `docs/ATUNED_SOURCE_SIGNAL_REGISTER_INTENSITY_SNIFFER_TDD_ADDENDUM_2026-10-29.md`: new intensity/always/family/choice requirements.

**Design baseline coverage:** 13 named seam interfaces, eight Source moves, key data lifecycles, owner list and test gate. **Implemented by this work:** zero; no code changed. **Confidence that the contract captures the user's latest direction:** 0.97. **Confidence that actual runtime adapter compatibility is already proven:** 0.00; cross-system integration inspection and tests still required.
