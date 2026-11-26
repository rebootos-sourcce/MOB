# Documents index. What each document is, and whether it is still true

Classified 20 November 2026 at commit `fb09a7d`: every `.md` at the repository
root, under `docs/` and under `reviews/`. Other folders (`HANDOFF-*`, `proto/`,
`.claude/`, `tests/README.md`) were not part of this pass.

The code map is `SITEMAP.md`. Where any document here disagrees with
`CLAUDE.md` or `DECISIONS.md`, those two win.

How each file was dated. Git history does not date these: one commit,
`08c0ba0c` on 11 November, added almost every file at once. Each file was
dated from its own text (its stated date, commit, and any "superseded",
"replaced by", "stopped" notice it carries), and checked for whether
`TASKS.md` or `DECISIONS.md` still points at it. Since that import only
`CLAUDE.md`, `DECISIONS.md`, `TASKS.md`, `FEEDBACK-log.md` and
`docs/WHATS-RUNNING.md` have been edited.

The four classes:

- **Read these first.** The canonical set `CLAUDE.md` names under Records, plus
  the status board.
- **Live reference.** Not in that set, but still the only or latest word on its
  topic.
- **Historical.** Real work, overtaken. Read for why, not for what is true.
- **Not referenced.** Nothing continues or cites it.

---

## 1. Read these first

| File | What it is |
|---|---|
| `CLAUDE.md` | Project instructions, build, standing rulings |
| `DECISIONS.md` | The owner's rulings, verbatim. Everything defers to it |
| `TASKS.md` | The one backlog |
| `docs/WHATS-RUNNING.md` | The status board: live now, being built, next |
| `STABILITY.md` | The measured build and gate snapshot |
| `MILESTONES.md` | The sequenced plan. Its own text says its open list was dated by 27 September |
| `REVIEW-source.md` | The original review and the rebuild |
| `REVIEW-pass2.md` | The second engineering pass |
| `BOOK-ERRATA.md` | Every place the codex and the engine disagree |
| `FEEDBACK-log.md` | One entry per piece of feedback that moved the product |
| `FEEDBACK-alexander.md` | One review session, with numbers |
| `SITEMAP.md` | Where every surface and engine table lives |

---

## 2. Live reference, by topic

**Sniffer** (reading order per `HANDSHAKE-sniffer.md`)
- `HANDSHAKE-sniffer.md`: the reading order for anyone touching the sniffer
- `REVIEW-sniffer-audit-2026-10-09.md`: the sniffer audit of 9 October, required reading 1
- `SNIFFER_SPEC.md`: the detection spec, cited repeatedly from `TASKS.md`
- `TDD-sniffer.md`: the engineering contract, required reading 3
- `DESIGN-sniffer.md`: what the sniffer may claim
- `FEELINGS-WHEEL.md`: the owner's feelings wheel as sniffer data, read by `engine/lexicon.js`

**Source AI**
- `reviews/SPEC-source-ai.md`: self declared as the one maintained spec of Source AI
- `reviews/source-ai-conversation-diagnosis-2026-10-31.md`: why Source AI does not feel like a conversation

**Path (Compass), teachers, depth**
- `DESIGN-compass.md`: the axis and descent design, cited from `TASKS.md` and `BOOK-ERRATA.md`
- `DESIGN-teachers.md`: teachers as imprints, v2, cited from `TASKS.md` as right
- `reviews/compass-creative-and-tutorial-scope-2026-10-31.md`: scope for Path creative and tutorial cards
- `reviews/shadow-figure-research-2026-10-30.md`: naming super complexes
- `reviews/nerve-to-celestial-audit-2026-10-30.md`: nerve to celestial wiring, with its test run
- `reviews/SI7-nerve-charge-grammar.md`: nerve charge grammar verdict, with a mockup

**Intake, laws, archetypes, character**
- `DESIGN-archetype-questions.md`: archetype question block v2, replaces part of `DESIGN-intake-axes.md`
- `DESIGN-integrity.md`: the laws of integrity, with a duplicated law table defect not confirmed fixed
- `DESIGN-sheet.md`: the character sheet, "the stat is the ceiling"

**Ladder, points, simulation**
- `RESEARCH-ladder.md`: the ladder already exists in the engine
- `DESIGN-ladder.md`: the ladder on the loop, self checking via `proto/ladder/probe.js`
- `SIM-YEAR-10000.md`: 10,000 people over a year, run 5 November, the current retention model
- `PANEL-10k.md`: the 10,000 person segment model behind pricing work

**Tooltip and design law**
- `DESIGN.md`: the design law over the `DESIGN-*` files
- `DESIGN-tooltip.md`: the one tooltip, replacing eight mechanisms

**Phone**
- `reviews/SPEC-phone.md`: the phone spec, carrying forward both `DESIGN-mobile*` files

**Billing, accounts, practitioner**
- `STRIPE-GO-LIVE.md`: the one page for turning on payments and the voice, 9 October; replaces three older Stripe pages
- `DESIGN-billing.md`: Stripe, tiers and the seam
- `OAUTH-DESIGN-AND-STEPS.md`: Google sign in design and steps
- `DESIGN-profiles.md`: profile and practitioner architectures
- `PRACTITIONER-STORY.md`: the practitioner user story
- `reviews/founding-pricing-business-case-2026-10-31.md`: answers `TASKS.md` SO1a
- `reviews/SPEC-enterprise-and-stores.md`: developer and app store spec

**Legal and privacy**
- `PRIVACY-POLICY.md`, `TERMS.md`, `CONSUMER-HEALTH-DATA.md`: the shipped pages' sources, last changed 16 October
- `PRIVACY-BREAKDOWN.md`: the one page summary
- `LEGAL-IA.md`: where those pages sit
- `reviews/LEGAL-floor.md`: disclaimers and copyright floor
- `SECURITY-IP.md`: IP and security protection

**Brand, copy, sound**
- `BRAND.md`: name, mark, promise
- `BUYERS.md`: the owner's buyer resonance grid (CQ scale partly drifted)
- `COPY.md`: the copy buckets
- `COPY-OBJECTIONS.md`: build product of `.claude/skills/atuned-voice/objections.json`; never edit
- `SOUND-MAP.md`: build product of `node tools/soundmap.js`; re-run, never edit
- `reviews/AD-mark-stack.md`: the mark, final direction
- `docs/briefs/earcons-note.md`: what sound can and cannot do

**Research, independent of the build**
- `RESEARCH-somatics.md`: what the product can honestly claim about somatics
- `RESEARCH-sources.md`: calculation sources and APIs
- `docs/research/marma-validation.md`: marma points against the address doc
- `docs/briefs/harmonic-research.md`: can the nervous system be measured in hertz
- `reviews/NEUROHARMONICS-SPEC.md`: which neuroharmonics claims hold
- `docs/briefs/cq-unified.md`: why CQ is what it is
- `docs/briefs/gap-ux-opportunities.md`: the best single list of UX openings

**Team, repositories, technology, inbox**
- `reviews/technology.md`: the technology package decisions, build cost and size
- `TEAM.md`: the subagent roster in `.claude/agents/`
- `docs/ATUNED_SOURCE_REGISTER.md`: the two real repositories, MOB and reboot-os
- `NOTES-OWNER-DICTATION.md`: raw dictation, not rulings, still unconsumed
- `docs/RITUAL-ACCOUNTABILITY-source.md`: the owner's pasted ritual history, input to the spec
- `docs/briefs/README.md`: the briefs folder index; its ratings are from 27 September
- `README.md`: the repository front page. Line 5 sends readers to `docs/ATUNED_SOURCE_INDEX.md`, which is not a general index (see 3)

**Deep psychological registry and Vritti architecture.** A prototype area. None
of it is read by `atuned_src/` (grep for `docs/data`, `DEEP_PSYCHOLOGICAL`,
`psych_` finds nothing), and `DECISIONS.md:3116` records it as "a separate
prototype area... none of it connected to the shipped app." Latest file in each
chain:
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_STATUS_2026-10-24.md`: read this one if only one
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_KPI_CLOSURE_AUDIT_2026-10-24.md`
- `docs/ATUNED_CONSCIOUS_DOMAIN_THREE_PASS_CLOSURE_2026-10-24.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md`: the governing record format
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECURSIVE_CLOSURE_PLAN_2026-10-22.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_THREE-PASS_RECURSIVE_CLOSURE_STRATEGY_2026-10-22.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_TECHNICAL_IMPLEMENTATION_HANDSHAKE_2026-10-22.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_EXTERNAL_RESEARCH_PASSES_2026-10-22.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_V341_CONSCIOUS_DOMAIN_AFFIRMATION_EXTRACTION_2026-10-22.md`
- `docs/ATUNED_CQ_DQ_SQ_RELEASE_HIT_FEEDBACK_ADDENDUM_v1.md`
- `docs/ATUNED_MVP_ALPHA_CANONICAL_RECORD_OWNER_AUDIT_v1.md`
- `docs/ATUNED_MVP_ALPHA_RECURSIVE_EXECUTION_CONTRACT_v1.md`: supersedes the driver contract on CQ
- `docs/ATUNED_UNIFIED_VRITTI_FETTER_NERVE_NODE_ARCHITECTURE_v1.md`
- `docs/ATUNED_VRITTI_NERVE_SIGNAL_FETTER_MARKER_TDD_v1.md`: v1.3, tests written and not run
- `docs/data/README.md`: what the registry JSON is and is not

---

## 3. Historical, superseded

**Plans, backlogs, gap counts**
- `PLAN.md`: the plan of 2 October, replaced by `TASKS.md`
- `PLAN-LIST.md`: the same plan as a flat list
- `PLAN-HISTORY.md`: the done half of `PLAN.md`, by design
- `PLAN-quality.md`: answer to `REVIEW-five-lens.md`
- `PRIORITY.md`: build order, self marked superseded
- `BACKLOG-AUDIT.md`: 27 September scrub, replaced by `TASKS.md`
- `MVP-GAP.md`, `MVP-GAP-2.md`, `MVP-GAP-3.md`: three successive gap counts, 1 and 2 October
- `DEV7-ALPHA-P0-P1-EXECUTION-2026-10-10.md`, `P0-A-INTEGRATED-GATE-CHECK-2026-10-10.md`: a past alpha cycle
- `GAME-PLAN-main-cleanup.md`, `HANDOFF-GAPS-2026-10-08.md`: the finished branch consolidation
- `BIBLE.md`: the whole product compendium, 27 September; no longer in `CLAUDE.md`'s list
- `PRODUCT.md`: product brief, 20 September

**Architecture and engineering reviews**
- `ARCHITECTURE-RESEARCH.md`, `SETUP-PLAN.md`: modular and hosting research, 27 September
- `HOSTING-SETUP.md`: self marked done, kept as a record
- `ATUNED-MVP-architecture-v2.md`, `ATUNED-architecture-security-review.md`: 29 September
- `REVIEW-quality.md`, `REVIEW-five-lens.md`, `REVIEW-RESULTS.md`, `REVIEW-fields.md`
- `reviews/REVIEW-architecture-schema.md`, `reviews/technical.md`, `reviews/FINDINGS-fixed.md`, `reviews/FIX-fetters.md`, `reviews/SCAN-thread.md`
- `REBOOT-OS-STATUS.md`, `CANON-MERGE-PLAN.md`, `docs/briefs/gap-desktop-wiring.md`, `docs/briefs/gap-parity-matrix.md`: cross repository snapshots
- `ARTIFACT-RETIRED-2026-10-08.md`: a retired upload

**Source TDDs and their audits**
- `SOURCE-TDD.md`, `AUDIT-source-tdd.md`
- `SOURCE-TDD-V3-intelligence.md`, `AUDIT-source-tdd-v3.md`
- `SOURCE-TDD-impression-excavation.md`, `SOURCE-TDD-release-intelligence-v2.md`
- `reviews/ATUNED-System-Congruency-MVP-TDD.md`, `reviews/CONGRUENCY-AUDIT.md`
- `reviews/ATUNED-Master-BMT-TDD.md`, `reviews/MASTER-BMT-AUDIT.md`
- `reviews/ATUNED-Next-AI-Experience-Measurement-Handshake.md`, `reviews/NEXT-AI-AUDIT.md`
- `reviews/TUNED-AWARENESS-ARCHITECTURE-TDD.md`, `reviews/TUNED-AWARENESS-AUDIT.md`

**Funnel, onboarding, first run**
- `ATUNED-Funnel-Creative-Direction-TDD-v1.md`, `ATUNED-Funnel-Signal-Story-Pattern-Release-Reframe-TDD-v1.md`
- `ATUNED-funnel-storyboard.md`, `ATUNED-funnel-storyboards-focus-group-validated.md`, `ATUNED-funnel-to-software-journey-TDD-v1.md`
- `ATUNED-onboarding-first-experience-TDD.md` and its three reviews `ATUNED-onboarding-REVIEW-1-product.md`, `-2-systems.md`, `-3-narrative.md`
- `DESIGN-onboard.md` (self marked stopped 20 September), `DESIGN-onboarding-narrative.md`, `DESIGN-firstrun.md`, `RESEARCH-firstrun.md`, `DESIGN-funnel-welcome.md`
- `reviews/ATUNED-Creative-Storyboard-TDD.md`, `reviews/ATUNED-Funnel-Onboarding-Tutorial-Creative-TDD.md`, `reviews/QUESTIONS-onboarding.md`
- `reviews/funnel-strategy.md`, `reviews/funnel-offer.md`, `reviews/funnel-golden-path-2026-10-31.md`
- `RESEARCH-icp.md`, `RESEARCH-signal.md`, `DESIGN-pattern-signal.md`

**Avatar, becoming, summary, analytics**
- `ATUNED-becoming-system-TDD.md`, `BECOMING-AUDIT.md`, `DESIGN-avatar.md`
- `ATUNED-daily-summary-personal-mirror-TDD.md`, `SUMMARY-AUDIT.md`, `reviews/COPY-summary-context.md`
- `RESEARCH-analytics.md`, `RESEARCH-field-summary-restructure.md`

**Ritual, practice, flow**
- `ATUNED-practice-ritual-accountability-trace-graph-TDD.md`, `PRACTICE-AUDIT.md`
- `DESIGN-ritual.md`, `RITUAL-RECONCILE.md` (self marked applied 21 September), `DESIGN-flow-tools.md`
- `reviews/SPEC-ritual-accountability.md`, `PANEL-ritual-1000.md`, `PANEL-flow-1000.md`

**Points, progression, economics**
- `ATUNED-points-achievements-unlocks-TDD-v2.md`, `-v3.md`, `POINTS-AUDIT.md`
- `DESIGN-progression.md`, `DESIGN-gamification.md`, `DESIGN-quotients.md`, `DESIGN-economics.md`, `DESIGN-founding-offers.md`
- `reviews/game-design.md`, `reviews/kpi-and-mvp-alpha-status-2026-10-31.md`, `reviews/records-template-audit-2026-10-31.md`

**Surfaces and screens**
- `DESIGN-ia.md`, `DESIGN-nav.md`, `DESIGN-information.md`, `DESIGN-tooltip-copy.md`
- `DESIGN-knowledge.md`, `reviews/IA-kb-video.md`, `reviews/IA-account-help-feedback.md`
- `DESIGN-story.md`, `DESIGN-story4.md`, `DESIGN-tags.md`, `DESIGN-container.md`, `DESIGN-lean.md`
- `DESIGN-masks.md`, `DESIGN-character-effects.md`, `DESIGN-feathers.md`, `PANEL-fourfields.md`
- `DESIGN-intake-axes.md`: self marked superseded in part by `DESIGN-archetype-questions.md`
- `DESIGN-release.md`, `reviews/REVIEW-release.md`, `BODY-MAP-SPEC.md`
- `DESIGN-mobile.md`, `DESIGN-mobile-icp.md`, `RESEARCH-mobile-gaps.md`

**Panels and simulations**
- `PANEL-usability.md`, `RESEARCH-90day.md`, `RETENTION-90DAY.md`
- `reviews/SIM-ninety-days.md`, `reviews/simulation-quarter.md`
- `ATUNED-art-ux-icp-review.md`, `ATUNED-experience-icp-model.md`, `ATUNED-creative-innovation-brief.md`

**Copy, art, sound, motion**
- `CREATIVE-BRIEF-voice.md`, `COPY-SWEEP-FINDINGS.md`, `COPY-VERIFY.md`, `COPY-questions.md`, `MARKETING-social.md`
- `reviews/copy.md`, `reviews/creative.md`, `reviews/innovation.md`, `reviews/uiux.md`
- `reviews/art-direction.md`, `reviews/animation.md`, `reviews/sound.md`
- `reviews/AD-account-help.md`, `reviews/AD-field.md`, `reviews/AD-field-compass.md`, `reviews/AD-golden-zen.md`
- `reviews/SPEC-feedback-instrument.md`
- `docs/briefs/brief-foundations.md`, `brief-motion.md`, `brief-screens.md`, `brief-technical.md`, `design-architecture.md`, `design-gamification.md`, `design-mechanisms.md` (its CQ formula is wrong), `design-uxdeep.md`

**Setup steps, replaced**
- `STRIPE-SETUP.md`, `STRIPE-API-STEPS.md`, `STRIPE-STEPS-NOW.md`: each self marked replaced on 9 October by `STRIPE-GO-LIVE.md`
- `API-SETUP-NOW.md`: one page API overview whose long versions are the replaced Stripe pages; still cited in `TASKS.md`, check against `STRIPE-GO-LIVE.md` before following it

**Deep psychological registry, earlier links in each chain** (all `docs/`)
- `ATUNED_COMPLEX_RECORD_INVENTORY_SOURCE_MAP_2026-10-20.md`, `ATUNED_FRAMEWORK_CLOSURE_AUDIT_LOG_2026-10-20.md`, `ATUNED_LAYER_COUNT_DASHBOARD_2026-10-20.md`, `ATUNED_MISSING_TEMPLATE_RECORD_GAP_REGISTER_2026-10-20.md`, `ATUNED_SUPER_COMPLEX_PHASE_HANDSHAKE_2026-10-20.md`, `ATUNED_TEMPLATE_CONNECTIVITY_CLOSURE_EXECUTION_2026-10-20.md`, `ATUNED_TEMPLATE_THREE_PASS_RESEARCH_2026-10-20.md`
- `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`, `ATUNED_MVP_ALPHA_DEVELOPMENT_STATS_SNAPSHOT.md`
- `ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_CLOSURE_DRAFT_2026-10-22.md`, `_23_RECORD_POPULATION_UPDATE_`, `_23_RECORD_SOURCE_CROSSWALK_`, `_BUILD_LEDGER_AND_LINK_REGISTER_`, `_CLOSURE_CHECKPOINT_`, `_CODE_TO_REGISTRY_CONTRACT_`, `_EXECUTIVE_HANDSHAKE_NEXT_THREAD_`, `_EXECUTIVE_HANDSHAKE_v2_`, `_RECORD_FORMAT_TDD_ADDENDUM_`, `_RECURSIVE_CLOSURE_EXECUTION_LOG_`, `_RECURSIVE_EXECUTION_LOG_`, `_REGISTRY_AUDIT_`, `_THREE_PASS_RESEARCH_AUDIT_` (all dated 2026-10-22)
- `ATUNED_RECURSIVE_DRIVER_INTEGRATION_PASS1_AUDIT.md`, `_PASS2_SOURCE_AUDIT.md`, `_PASS3_TEST_AUDIT.md`, `_PASS4_CROSSCHECK.md`
- `ATUNED_SOURCE_INDEX.md`: an index of this one thread only. `README.md` still points new readers at it

---

## 4. Not referenced by anything

- `HANDSHAKE-STRIPE.md`
- `QUESTIONS.md`
- `SOURCE-TDD-handoff-master.md`
- `SOURCE-TDD-release-intelligence.md`
- `WAITING-ON-YOU.md`
- `reviews/AD-mark-and-boot.md`
- `reviews/ATUNED-Next-AI-Documentation-Index.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_EXECUTIVE_HANDSHAKE_2026-10-22.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_NEXT_ROUND_TACTICS_2026-10-22.md`
- `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECURSIVE_AUDIT_BLOCKS_1_2_2026-10-22.md`
- `docs/ATUNED_RECURSIVE_DRIVER_INTEGRATION_EXECUTION_CONTRACT_v1.md`

---

## 5. Tests and tools, in one paragraph

The gates are defined by `.github/workflows/deploy.yml`, not by the column in
`CLAUDE.md`, which names a subset. Three jobs: `gates-fast` (node only,
required), `gates-browser` (real Chromium, required, one leg per file) and
`gates-report` (every PR, never blocks, promoted after consecutive greens).
`node tools/orphans.js` prints how many `tests/*.js` each route covers and
fails on a test no workflow reaches; its `MANUAL` list (lines 48-78) holds the
three run by hand. `nightly-gates.yml` repeats every browser leg to find
flakes. `tools/tokens.py`, `slim.py` and `pack.js` run inside `BUILD.sh`.
Everything else in `tools/` is run by hand, and nothing checks `tools/` for
orphans. The full table is `SITEMAP.md` Part 2.

## 6. Open, and whose call

- Whether `BIBLE.md` is formally retired or kept as a dated snapshot. His call.
- `SOURCE-TDD.md` and `SOURCE-TDD-handoff-master.md` are byte different twins.
  Which one is the record is unresolved.
- `reviews/ATUNED-Next-AI-Documentation-Index.md` names its canonical source as
  `ATUNED_System_Congruency_TDD.md`, which does not exist; the nearest file is
  `reviews/ATUNED-System-Congruency-MVP-TDD.md`.
