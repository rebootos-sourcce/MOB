# The funnel, activation and intelligence spec, round PS. Pass 1 brief.

Read `REVIEW-FRAMEWORK/README.md` first: this is the same standing three-pass
procedure used for the skin review and the six-area architecture review, now
run on `OWNER-INPUT.md`, a 92-section implementation spec he pasted whole.

His words bringing it: "It doesn't look like the release protocol has been
updated at all. Per my suggestion, or request. Neither is a practitioner layer.
Let's do the feedback first. On what's been created. Feedback on any remaining
questions and then review the backlog. In the meantime, build the practitioner
layer. Update the sound effects and update the onboarding and tutorial. See
attached, review this three times."

## What the document asks for, in one paragraph

Connect the subsystems that already exist (Story, Sniffer, Pattern, Release,
Practice, Ritual, Trace Graph, Evidence, 90-day history, Identity, Commerce)
into one causal loop a stranger feels from the first ten minutes: feel, say,
ATUNED sees, confirm, ATUNED works, notice, practice, remember, know what to do
next. It gives acceptance criteria (sections 70 to 73), a testing strategy
(74 to 76), a 23-step build order (section 86), and a three-tier priority stack
(section 91, P0 funnel handoff through P2 expansion).

## Known tension with already-settled rulings. Read this before you score it.

The six-area architecture review (`REVIEW-arch/`), already run three times this
session, reconciled much of the same ground with the owner directly and reached
rulings that are now standing, recorded in `DECISIONS.md` round PK:
- "the reading rules," not an orchestrator service;
- "the trace," a DERIVED VIEW over existing stores (Said, Heard, Maybe, Felt,
  Changed, Confirmed), never a new `p.ledger`;
- "where the loop is," a derived read that orders ONE suggestion, never a day
  count shown on screen, never a gate on access;
- a safety screen before the story is read, privacy as a data table with a
  gate, entitlements read off the SIGHT table.

`OWNER-INPUT.md` section 22 to 32 proposes a `JourneyState` object with
`current_stage: day_1 | day_2_7 | ... | day_61_90` and day-numbered syntheses
at 7, 14, 30, 60 and 90. That is closer to the stored 90-day state machine the
architecture review's own merged proposal argued against and he accepted. It
may be that he has changed his mind seeing it written out this way, or that
this document was drafted without that context. EVERY SEAT must name this
tension explicitly where it appears in their section and not silently pick a
side. Do not assume the new document overrides the old ruling. Do not assume
the old ruling overrides the new document. Say where they conflict, what each
would look like built, and recommend one, with your reasoning, for the lead to
carry into pass 2.

The same caution applies to section 9's "replace the front door" (remove the
100-question test from the front door) against the funnel's existing quiz-first
design, and to section 42 to 46's commerce numbers (400/800/1200/1200 patterns
a month) against the shipped `engine/plan.js` SIGHT table and the $12/29/59/99
ladder: measure what is actually shipped before saying it conflicts.

## What is also true right now, so you do not re-discover it

- The onboarding was reviewed three times this round (`REVIEW-onboarding/`) and
  rebuilt twice as a mockup (`mockups/onboarding-v2/`), most recently as
  continuous states on one Field with a feel-then-body-then-story order and a
  Mirror that corrects. It has NOT been wired into the shipped `atuned_src/`
  app yet; it is still a standalone mockup.
- The Practitioner page is 153 lines, three stubs, honestly marked a sketch.
  Nothing from `OWNER-INPUT.md`'s identity or commerce chapters is wired to it.
- `ui/release.js` has not been touched this session despite round PO's "for the
  release protocol, this isn't what we want."
- Round PQ already ruled: no percent on the headline reading, patterns are
  stored in the body at the nerve register of the seat. Both still apply here.
- `atuned_src/engine/practice.js`, `ritual.js`, `imprints.js` already carry
  Goal, Protocol, Ritual, PracticeEvent and a Trace graph of sorts; read them
  before claiming any of sections 33 to 37 are missing.

## Your job, pass 1

Produce `pass1/<your-seat>.md`. For the sections in your lane (assigned below),
use the document's OWN audit format from its section 87:

    REQUIREMENT: [exact requirement, quoted]
    CURRENT IMPLEMENTATION: [file/component/function, or "none found"]
    STATUS: EXISTS | PARTIAL | MISSING | CONFLICT | UNVERIFIED
    DATA DEPENDENCIES: [what must exist]
    REQUIRED CHANGE: [exact change]
    TEST: [how it would be proven]
    REGRESSION RISK: [what could break]

Measure every EXISTS and PARTIAL against the real repository, not the
document's own confidence. A requirement you cannot find evidence for in code
is MISSING, not EXISTS. Grade 0 to 100 at the end, independent, with your
reasoning. No building. Read-only.

## Seats and their sections

- **ai-director**: sections 10 to 15 (Story, Sniffer, Mirror, Correction),
  49 to 53 (adaptive questioning, alternative hypotheses, contradictions,
  evidence ledger), 72 (intelligence acceptance criteria).
- **systems-director**: sections 6 to 8 (activation state, starter gift),
  22 to 32 (90-day engine, THE TENSION SECTION ABOVE IS YOURS TO OWN),
  40 to 41 (recovery), 47 to 48 (identity, account merge), 71 (90-day
  acceptance criteria), 75 (persistence testing).
- **fullstack-td**: sections 16 to 21 (first release, verification), 33 to 37
  (practice, protocol, ritual, progression), 63 (practice as the bridge).
- **narrative-director**: sections 54 to 56 (safety, addiction language, daily
  summary), 81 to 83 (tutorial, progressive disclosure, hide the graph),
  18 (somatic setup copy).
- **technical-director**: section 5 (the P0 funnel-to-app handoff, verify the
  `../source.html` versus `atuned.html` claim against the real funnel files
  before agreeing it is broken), 9 (replace the front door), 42 to 46
  (commerce, measured against the real ladder), 70 (P0 acceptance criteria).
- **uiux-architect**: sections 38 to 39 (the Field as interface and memory),
  73 (visual intelligence acceptance criteria), 84 to 85 (avatar timing, user
  agency), and map every step of the document's intended flow (section 1, 2,
  90) against the shipped Field, Compass, Story and Avatar pages today.
- **devops-qa**: sections 74 to 77 (testing strategy, observability,
  analytics), 67 to 68 (failure and recovery states), prove or disprove at
  least five EXISTS claims other seats make by reproducing them in headless
  Chromium before the pass is called done.
- **project-manager**: sections 64 to 69 (the 90-day simulation requirements),
  91 (the priority stack), and a first-pass reconciliation of section 91
  against `PLAN.md` section K's existing P01-P23 slice table: which rows
  already cover a P0/P1 item here, which are new, which conflict.

Commit your `pass1/<seat>.md` and push nothing; report back when done.