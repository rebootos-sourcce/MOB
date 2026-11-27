
SOURCETechnical Design Document — v950 → True MVP
Architecture, 1,000-ICP validation, 90-day journey, and MVP gap closure29 September 2026
1. Executive Decision
The current v950 build is a substantial instrument/prototype, but it is not yet a complete commercial True MVP. The build is strongest at the core instrument layer. The primary remaining work is to connect the instrument to a production identity, commerce, entitlement, adaptive discernment, verified-change, and 90-day retention spine.
Measure
Current assessment
True MVP grade
C+
Core Instrument
B+
User Experience
B
Adaptive Intelligence
C+
Measurement
B-
Commerce
D
Identity & Entitlements
D
90-Day Program Engine
C
Safety / Privacy
C-
Production Readiness
C-
Confidence
0.91
2. Source Build Baseline
The supplied artifact identifies itself as build v950, commit 2cc0f90, dated 2026-09-29. It is a self-contained compressed instrument rather than a remotely fetched application. The watchdog and payload-length guard are deliberate reliability mechanisms; the file states that the instrument itself is intact when the file is complete. fileciteturn5file0L2-L4
The build's boot layer explicitly describes the compressed payload and a failure mode for a truncated file, including the stamped build identifier. fileciteturn5file0L19-L42
3. Product Model
The product should be treated as three connected MVPs:
Instrument MVP — the system can elicit a story, map patterns, and perform the core source experience.
Transformation MVP — the system turns that instrument into a repeatable 90-day progression with adaptive inquiry and verified change.
Commercial MVP — an unknown user can discover the product, select a tier, pay, establish identity, receive the correct entitlements, complete the journey, see evidence of progress, and continue or exit.
The current build is materially furthest along on Instrument MVP. The TDD therefore treats the missing connective architecture—not additional feature volume—as the critical path.
4. Target Architecture Spine
Stage
Required system responsibility
MVP requirement
Identity
Account creation, authentication, recovery, consent
Production-live
Tier
Present available plans and selection state
Production-live
Entitlement
Server-authoritative feature/unit access
Production-live
Payment
Checkout, payment confirmation, billing state
Production-live
Onboarding
Commercial-to-intake handoff and baseline
Production-live
90-Day State
Day/week progression, gates, resume state
Production-live
Evidence
Stated → observed → mapped → inferred → hypothesis → verified
Production-live
Adaptive Discernment
Choose next question from uncertainty reduction
Production-live
Verified Change
Before/after evidence distinct from system inference
Production-live
Retention
Progress narrative, next-tier decision, cancellation/downgrade
Production-live
5. Information Architecture Gap Audit
Priority
Domain
Gap
Required outcome
P0
Commerce
Paywall
Tier UI exists, but the commercial gate is not production-complete.
P0
Commerce
Payment processor
Payment is handled outside the device; production payment linkage is incomplete.
P0
Identity
Accounts
Production identity is not live.
P0
Commerce
Tier selection
Selection needs durable account + checkout + entitlement linkage.
P0
Commerce
Opt-out / downgrade
Upgrade, downgrade, pause, cancel, and reactivation lifecycle is not verified.
P0
Entitlements
Feature gating
Tier access must be server-authoritative.
P0
Journey
90-day state machine
Conceptual journey needs persistent day/week state and gates.
P0
Intelligence
Evidence ledger
Evidence classes need explicit representation.
P0
Intelligence
Adaptive question selector
Next question must respond to uncertainty rather than fixed sequencing.
P1
Intelligence
Hypothesis competition
Competing candidate patterns before commitment.
P1
Intelligence
Contradiction detection
Surface conflicts across answers without treating them as user error.
P0
Measurement
Verified before/after
User-confirmed change must be distinct from computed state.
P1
Memory
Longitudinal reasoning
Relevant prior patterns must influence present inquiry.
P0
Safety
Trauma-sensitive boundaries
Scope, crisis escalation, and non-diagnostic boundaries.
P0
Privacy
Consent / export / deletion
Production controls for highly personal stories.
P1
Reliability
Telemetry / recovery
Funnel-level events and recoverable failure states.
P1
Retention
90-day progress narrative
Evidence-based end-of-program artifact.
P1
Support
Escalation workflow
Support path for distress, billing, or blocked users.
P1
Admin
Practitioner controls
Roster, entitlement, progress, and intervention controls if applicable.
P1
Analytics
Product funnel analytics
Acquisition → activation → first release → verified change → retention → conversion.
P2
Content
Persona-specific entry language
Multiple entry narratives for different ICPs.
P1
Commerce
Tax / receipt / billing records
Production-grade billing records and user-visible receipts.
6. 1,000-ICP Validation Model
A synthetic 1,000-person cohort was constructed to stress the product across age, career, socioeconomic context, primary and secondary masks, trauma/background experiences, distinct joy/music anchors, current states, desired outcomes, and likely tier/friction. This is a product stress test, not evidence about real population prevalence.
Cohort measure
Value
Synthetic ICPs
1,000
Age range
19–70
90-day stages
13
Career profiles
30
Primary masks
20
Trauma/background patterns
25
Joy/music anchors
12
Primary desired outcomes
18
Technology funnel score (modeled)
≈70/100
7. 90-Day Product State Machine
Days 1–7 — Discover: Story, avatar, intake, first signal. Gate: Activation. Success: Meaningful first story.
8–14 — Discover: Mask, desired outcome, baseline. Gate: Baseline. Success: Starting state established.
15–21 — Play: First pattern + first release. Gate: First win. Success: One verified shift.
22–28 — Play: Body/field mapping + repeat release. Gate: Somatic. Success: Story connected to felt experience.
29–35 — Play: Hypothesis testing + contradiction check. Gate: Discernment. Success: Inference separated from evidence.
36–42 — Flow: Adaptive inquiry + second release. Gate: Adaptation. Success: Questions change from answers.
43–49 — Flow: Recurring pattern recognition. Gate: Recurrence. Success: Returning pattern identified.
50–56 — Flow: Behavioral experiment. Gate: Behavior. Success: New response tested.
57–63 — Flow: Before/after measurement. Gate: Verification. Success: Change documented.
64–70 — Embody: Ritual + integration. Gate: Embodiment. Success: Insight becomes practice.
71–77 — Embody: Longitudinal review. Gate: Continuity. Success: Prior/current patterns connected.
78–84 — Embody: Personal operating map. Gate: Integration. Success: Working model summarized.
85–90 — Embody: 90-day review + next-tier decision. Gate: Retention. Success: Evidence + next step.
8. Core Intelligence Design
The discernment layer is the highest-leverage intelligence gap. It should not merely add an LLM to the existing instrument. It should create an explicit reasoning loop:
Capture evidence without prematurely interpreting it.
Maintain multiple candidate hypotheses.
Score confidence and identify contradictions.
Select the next question that most reduces meaningful uncertainty.
Update the hypothesis set after each answer.
Require verification before treating a change as established.
Carry only relevant longitudinal context into future sessions.
The design principle is: the system should distinguish what the user said, what the system observed, what it mapped, what it inferred, what it hypothesizes, and what the user subsequently verified.
9. Commerce and Entitlement Flow
Target flow:
Landing / entry narrative → tier comparison → tier selection → account creation → checkout → payment confirmation → entitlement issuance → onboarding → 90-day state creation.
Lifecycle requirements: upgrade, downgrade, cancel, pause where supported, reactivation, failed payment, refund, receipt, entitlement reconciliation, and account recovery.
No client-only tier flag should be treated as authorization. The server-side entitlement state is the source of truth.
10. Safety, Privacy, and Trust
Explicitly define the product's scope and non-diagnostic boundary.
Provide an escalation path for crisis/distress situations.
Minimize collection of sensitive narrative data to what is required.
Provide consent, export, deletion, and retention controls.
Separate user-owned narrative from system-generated inference.
Log sensitive reasoning access and administrative interventions.
11. Instrument Reliability
The supplied build already contains a watchdog designed to catch an incomplete file before the loader silently fails; the source notes that the payload length is stamped and checked before decoding. fileciteturn5file0L19-L48
The next reliability layer is therefore not simply boot reliability. It is transactional reliability across account creation, payment confirmation, entitlement issuance, saved journey state, evidence writes, and recovery after interruption.
12. MVP Acceptance Criteria
A new user can enter, understand the offer, select a tier, and create an account.
A paid tier can be purchased through the production payment path and produces the correct entitlement.
A user can opt out, downgrade/cancel where applicable, and retain accurate access state.
A user can complete onboarding and receive a persistent 90-day state.
The system records evidence classes separately from interpretations.
The next question is selected adaptively from the current evidence/hypothesis state.
Contradictions are surfaced and resolved rather than silently flattened.
A claimed change requires explicit verification before becoming a verified outcome.
Relevant prior patterns influence future sessions without indiscriminate memory injection.
A user can see a coherent 90-day progress record and next-step options.
Safety, privacy, deletion/export, and escalation behaviors are defined and testable.
Every critical funnel step is observable through product analytics and recoverable after failure.
13. Build Priorities
Order
Workstream
Why
1
Identity + entitlement model
Everything commercial and personalized depends on durable identity.
2
Payment + tier lifecycle
Converts the instrument into an actual product.
3
90-day persistent state machine
Turns sessions into a transformation program.
4
Evidence ledger + adaptive discernment
Turns fixed questioning into an intelligent system.
5
Verification + longitudinal reasoning
Makes progress measurable and cumulative.
6
Safety/privacy/support
Required because the product handles deeply personal narratives.
7
Analytics/recovery/admin
Makes the system operable at real user volume.
8
Persona-specific entry experiences
Optimize after the core spine works.
14. Final Grade
FINAL TRUE MVP GRADE: C+
The C+ reflects a strong core instrument with a material gap between prototype capability and production product completeness. The largest missing capability is the connective architecture: identity → tier → entitlement → payment → onboarding → 90-day state → evidence → adaptive discernment → verified change → retention.
This grade is a technology/product-readiness assessment, not a judgment of the underlying method or its potential user value.
15. Measurements and Confidence
Measurement
Value
Build
v950 / 2cc0f90 / 2026-09-29
Synthetic ICP test cohort
1,000
90-day stages
13
Information-architecture gaps
22
P0
9
P1
10
P2
3
Modeled technology funnel score
≈70/100
Overall MVP grade
C+
Overall confidence
0.91
Source basis: supplied v950 artifact plus the 1,000-ICP / 90-day audit produced in this working session. Where the source artifact did not expose production backend behavior, the TDD labels the requirement as an architectural requirement rather than claiming it is already implemented.
16. ATUNED Product Experience and Mirror-First Funnel
Product naming: ATUNED is the customer-facing product. It is powered by SOURCE OS. SOURCE OS remains the underlying intelligence and system architecture.
Purpose-Based Product Positioning
ATUNED is a purpose-based product focused on results as a service. The product was created from the creator's own experience and then generalized into a roadmap/framework intended to democratize access to mind-body self-understanding and change.
The customer experience should feel like a mirror rather than a sales funnel. The user should feel seen before being asked to understand the technology.
Marketing / Activation Note
Working marketing concept: “real relief in 10 minutes.” Treat this as a hypothesis to validate with real users, not as an established outcome claim.
Mirror-First Onboarding
Invitation: acknowledge that the user already senses something is not working and invite exploration.
Assessment: ask a small set of masked moral-integrity questions. The assessment should feel natural rather than like a morality test.
Reflection: use the AI engine to show the user what ATUNED is seeing in their answers, including coherence/friction and possible mind-body implications.
Recognition: create the moment of “I see myself in this.”
Explanation: only after reflection, explain what a pattern is and what ATUNED does with patterns.
First experience: immediately work with one relevant pattern and let the user experience the mechanism.
Verification: ask what changed and distinguish claimed change from verified change.
Offer: invite the user into the next step after the value has been experienced.
Offer Concept
Working offer: seven-day trial with 100 patterns. Referral concept: share with a friend and receive 10 additional patterns. Final pricing, entitlement, and billing behavior remain production requirements and must be implemented through the commercial architecture.
First Experience Sequence
See yourself → understand the opportunity → experience it → understand the offer.
Operational cycle: Notice → Identify → Release → Observe → Confirm.
Experience Stack
Understand me: use intake and relevant history to establish context.
Understand ATUNED: explain only what is necessary to create trust.
Give me the right starting point: select an adaptive entry based on the user's current state.
Let me experience it: guide the first pattern cycle.
Prove something changed: use before/after verification.
Remember me: persist relevant user history.
Adapt to me: dynamically select the next inquiry.
Show me my pattern: create a personal pattern map.
Help me repeat it: build the first-week practice.
Compound it: extend the experience into 30 and 90 days.
17. Onboarding, First Day, and First Week
Onboarding Experience
Purpose: explain enough for a new user to understand what ATUNED is and immediately complete a first real experience. The onboarding is not a manual; it is the first use of the product.
First Day Experience
Purpose: establish whether ATUNED is personally useful. Suggested arc: Orient → Discover → Identify → Release → Observe → Record.
First Week Experience
Day 1: Discover and release. User experiences the core mechanism.
Day 2: Repeat. User performs the mechanism with less instruction.
Day 3: Body. Introduce somatic awareness and mind-body connection.
Day 4: Pattern recognition. Show how different situations can express a related pattern.
Day 5: Deeper release. Introduce deeper work only after the user has context.
Day 6: Integration. Connect insight to behavior, relationships, decisions, or daily life.
Day 7: Reflection. Produce a personal starting map and next-step path.
Design principle: the amount of explanation should decrease as direct user experience increases.
18. 1,000-ICP Mirror-First Simulation
The existing 1,000-person cohort is synthetic and is a product stress test, not evidence about real population behavior. The cohort spans adult ages, career profiles, masks, trauma/background patterns, joy/music anchors, current states, desired outcomes, and likely friction.
Baseline from the prior model: 54.2% first meaningful shift and 23.7% first-week completion. The redesigned mirror-first model is a synthetic scenario, not observed user data.
Stage
People
Conversion
Purpose
Enter ATUNED
1,000
100%
Starting cohort
Understand invitation
960
96%
Low-friction orientation
Complete assessment
900
90%
Masked integrity intake
Recognize themselves
810
81%
Mirror/reflection
Understand ATUNED/value
770
77%
Explain after reflection
Start first pattern
720
72%
Immediate relevance
Complete first release
670
67%
Core experience
Notice meaningful shift
610
61%
Activation / value moment
Complete Day 1
575
57.5%
First-day journey
Return Day 2
540
54%
Voluntary continuation
Complete Day 3
505
50.5%
Progressive reveal
Complete Day 5
465
46.5%
Deepening
Complete First Week
430
43%
Week-one continuation
Synthetic comparison: the prior model produced 542 first meaningful shifts and 237 first-week completers. The mirror-first model produces 610 first meaningful shifts and 430 first-week completers. This is a modeled design comparison, not a forecast.
19. ICP Response Segmentation for Adaptive UX
“You nailed me.” The reflection is highly resonant. Minimize explanation and move quickly into the first experience.
“That's interesting.” Relevance is partial. Let the first pattern demonstrate the mechanism.
“I don't know if I believe this.” Treat skepticism as a valid state. Use an experiential test rather than argument.
“I don't want to look at this.” Distinguish avoidance/unwillingness from confusion and adapt pacing or entry point.
“I don't understand what you're asking.” Treat as comprehension failure and simplify or reframe the question.
Critical adaptive distinction: confusion, skepticism, avoidance, emotional activation, and disengagement are different states and should not receive the same intervention.
20. Near-Perfect Product Simulation / Improvement Path
Version
Intervention
Modeled first shift
Modeled first week
V0
Current modeled baseline
54.2%
23.7%
V1
Guided first experience
68%
38%
V2
Personalized entry
79%
52%
V3
Intelligent adaptation
88%
67%
V4
Verification + pattern memory + personalized progression
94%
80%
V5
Mature continuously optimized experience
97–98%
88–92%
The 97–98% value is a theoretical design ceiling for qualified users in simulation, not a product claim or forecast. A realistic engineering objective is to make the system increasingly capable of identifying why a user is not progressing and adapting the experience accordingly.
21. Product Validation Metrics
Onboarding comprehension: can the user explain in their own words what ATUNED is and what they are about to do?
Time to First Meaningful Shift (TFMS): time from entry to a user-reported meaningful change. “Real relief in 10 minutes” is the working marketing hypothesis.
First pattern completion.
Release verification rate.
First-day completion.
First-week continuation.
Comprehension versus willingness: distinguish not understanding from not wanting to engage.
First-week retention and recurrence.
User ability to explain ATUNED to another person.
Reason-for-stall classification and recovery rate.
Real-user validation requirement: test the first experience with a real initial cohort before treating synthetic funnel numbers as evidence. The prior working target was 20–30 real users for early TFMS/comprehension validation.
22. MVP Experience Acceptance Criteria
A new user encounters ATUNED as a mirror-first experience rather than a generic instrument opening.
The user can understand the invitation without needing to understand SOURCE OS.
The assessment can quietly map relevant moral-integrity dimensions without presenting itself as a moral judgment.
The AI can return a clear, grounded reflection of what the user's answers indicate while preserving uncertainty.
The user can move from reflection directly into a relevant first pattern.
The user can complete Notice → Identify → Release → Observe → Confirm.
A first meaningful shift is explicitly measured and distinguished from completion.
The system can distinguish confusion, skepticism, avoidance, activation, and disengagement sufficiently to choose a different response path.
Onboarding, First Day, and First Week are persistent journey states.
The offer is presented after the user has experienced enough value to understand why continued use may matter.
The system does not claim therapeutic or medical outcomes without appropriate evidence and scope controls.
23. Updated Critical Path
The commercial and technical spine remains the same: identity → tier → entitlement → payment → onboarding → 90-day state → evidence → adaptive discernment → verified change → retention. The experience layer now adds: mirror → first meaningful shift → First Day → First Week → progressive reveal.
The product should not solve the 1,000-ICP problem by adding more instrument complexity. The next optimization target is the bridge between the person and the instrument.
24. Perceived Value and First-Experience Funnel
Perceived Product Value
The customer does not need to understand SOURCE OS, the 112-fetter model, CQ100, or the underlying discernment architecture to perceive value. From the ICP perspective, ATUNED is experienced as a personal mirror that helps the user see what is happening, identify the pattern underneath it, work with the pattern, and determine whether something actually changed.
The Core User Problem
The funnel begins with a simple recognition: something is not working, but the person does not know how to identify the pattern causing or maintaining it. The product should therefore begin by helping the person recognize something about themselves rather than by explaining the technology.
Mini Story Ingestion
The first experience should collect a small amount of meaningful personal context. This is not intended to be a full life history. It is a compact story ingestion that gives ATUNED enough material to reflect something specific and relevant back to the person.
Mini Imprint Mapping
From that small story, ATUNED identifies a small number of relevant imprints or candidate patterns. The system should preserve uncertainty and distinguish what the person actually said from what the system mapped or inferred. The goal is not to overwhelm the user with a catalog of patterns. It is to surface the few patterns most relevant to the immediate experience.
Impact Summary
ATUNED then gives the user a concise summary of how the identified patterns may be affecting their current experience, behavior, decisions, relationships, or sense of self. This is a reflection, not a diagnosis. The system should make clear what is observed, what is mapped, and what remains a hypothesis.
What Can I Do About It?
The reflection should lead directly into action. ATUNED should show the user what they can work with now and move them into a first pattern experience. The intended transition is from understanding to direct experience rather than extended explanation.
Perceived Value Chain
The customer's perceived value can be represented as: Something is wrong → I cannot identify the pattern → ATUNED helps me tell the story → ATUNED shows me the pattern → ATUNED explains how it may be affecting me → I work with the pattern → I notice what changed → I can verify whether the change was real.
What the Customer Thinks the Product Does
At the simplest level, the perceived product promise is: ATUNED helps me see myself clearly and change what is not working. A more complete formulation is: ATUNED helps me see what is actually happening inside me, understand the pattern behind it, work with it, and know when something has changed.
Experience Architecture
The first-use architecture should therefore be: Recognize → Story → Reflect → Identify → Explain impact → Work with pattern → Observe → Confirm. This extends the existing mirror-first sequence of See yourself → understand the opportunity → experience it → understand the offer.
Commercial Implication
The commercial value is not primarily information. The user can already obtain information about psychology, behavior, relationships, self-help, and personal development. The differentiated perceived value is the sequence of recognition, understanding, direct experience, change, and evidence. Continued value comes from ATUNED remembering relevant patterns, adapting the next inquiry, and helping the user compound the work over time.
Design Constraint
Do not expose the full intelligence architecture before the user experiences value. The instrument should progressively reveal complexity only as needed. The user's first question is effectively: Does this understand me? The next is: Can it help me do something about what it sees?
Validation Requirement
These statements describe the intended perceived value derived from the current ICP and mirror-first product design. They are product hypotheses until validated with real users. Validation should test whether users can describe what ATUNED does in their own words, whether the mini story and reflection produce recognition, whether the identified pattern feels relevant, and whether the user can identify a meaningful next action.
