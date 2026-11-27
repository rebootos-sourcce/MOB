# Pass 1, creative director (Ines Halldors). Round PK, the six-area architecture

**ICP sample, as the brief requires.** `ui/personas.js` is the Matrix grid, not the roster. The roster is `engine/data/people.js`. Sampled: Ana (the crisis persona), Gordon (refuses the frame), Derek (wants a number he can check), Sofia (practitioner), Nkem (cries in the car park before the shift). Records: `RESEARCH-icp.md`, `RESEARCH-90day.md` (finding 5: CQ moves a quarter point in ninety days, and from day 30 the ladder is silent).

**GRADE: 48/100.** How ready this is to build as written, in creative terms. The spine is right. The voice and the shape are wrong in four places, and two of the six areas are mostly already built.

| Criterion | /10 | Evidence |
|---|---|---|
| Serves the soul (see it, put it down) | 5 | Evidence chain and Safety Gate serve it. Orchestrator, next best action and 90-day gates turn the mirror into a monitor. |
| Fits the owner's rulings | 4 | Collides with "not a coach", "not a course", "a reading is not a score", "a circle never a list", "it does not say why". |
| Avatar as centrepiece | 2 | The word avatar does not appear in the proposal. Summary is named the output. |
| Release as the point | 4 | Release is one node on a long chain. Verification becomes the goal. |
| Voice and naming | 4 | Day 0 to Day 90, "JourneyState", "next best action", "behavior changes", "friction" are coach and dashboard words. |
| Honesty of data | 8 | Said, detected, thought, experienced, changed, verified is right. Already half built. |
| Newness (not redundant) | 5 | Roughly half of areas 1, 3 and 5 exist. Genuinely new: the safety screen, the entitlement split, the one rule. |
| Minimal version exists | 7 | Yes, small. Below. |

## Pass 1: intent

It is for consistency and trust. Fine. But a person never sees any of it: six areas of infrastructure and no surface. The owner's loop is discover, play, flow, embody, and it is a circle. The proposal's loudest object is a ninety day line with an end. The thing the product is for, a person looking at their avatar and putting something down, is not on the page.

## Pass 2: truth

The mirror test: does the system say only what the person said, in their own words, and never more? Three places where the proposal says more.

- **Hypothesis Manager.** "Challenge may trigger withdrawal" is a why about the person. Ruled at DECISIONS.md 1983: Source AI "never answers a why", the instrument "does not measure cause, the person can find it." `trace.js` already holds the line: a story supports a pattern, never causes it, and `causes` exists only as the person's own confirmed claim. A manager that ranks competing hypotheses about a person is a diagnosis engine, whatever it is called.
- **Verification.** "User later reports answering a difficult question without withdrawing" is self report. QUESTIONS.md SIG17 records the research: paying or rewarding a self catch produces over reporting. If a gate opens on a verified change, people will report change. The only honest signal dies.
- **Stage gates as verdicts.** RESEARCH-90day measured that CQ moves a quarter point in ninety days. A state machine gated on verified change will tell most people "you are at an early stage" on day 60. That is a score by another name, and it breaks "regardless of our score" (DECISIONS.md 643).

## Pass 3: craft (only where it touches the surface)

Names. `current_friction`, `last_meaningful_change`, `next_best_action` read as a CRM record on a person. One word per concept: the proposal says stage, gate, state and objective. And three ninety day maps now compete: the proposal's ten bands, `ATUNED-MVP-architecture-v2.md` section 7's thirteen weekly gates, and the owner's four loop modes in `engine/core.js`.

## The finding, cause, move, cost, delta

- **Finding.** The architecture's own surface would be a dashboard about a person, run by an agent that has an opinion about their life.
- **Cause.** It starts from the system's knowledge (what is known, uncertain, competing) instead of the person's object. The orchestrator is the hero. The avatar and the release are not in it.
- **Move.** Keep the ledger and the one rule. Cut the orchestrator as an authority. Make the ninety day idea internal bookkeeping that is never drawn as days, a number, or a percent. Every output goes through the avatar and the release.
- **Cost.** Smaller build. Loses "next best action" as sold.
- **Grade delta.** Soul fit 5 to 8, rulings fit 4 to 8, overall 48 to about 72 if the cuts are taken.

## Area by area

**1. Orchestrator.** Exists: `trace.js` provenance (known, inferred, proposed, user_confirmed, observed), `sourceai.js` (discerns, never defines), `sniff.js` (the one hearer). Adds: one record shape for every reasoning module. Conflicts: "owns what intervention is appropriate" is a coach. Keep INPUT, OBSERVATION, EVIDENCE, CONFIDENCE, UNCERTAINTY in the contract. Cut HYPOTHESIS and RECOMMENDATION from anything a person sees. Call it the reading rules, not an orchestrator. MVP cut: the one rule, "no module turns an inference into a fact", enforced as a test over `trace.js` source labels. Size S.

**2. The 90 day engine.** Exists: the loop modes in `core.js`; `ladder.js` streak and "Ninety days" mark; `practice.js` events; proto simulations only. Adds: behaviour gates. Conflicts: a line with an end versus a circle; days counted against 90; "not a course", "not a practice app" (BRAND 7); CO-08 ("85 days kept, of the 90... we should need a rule never to write that"). Keep behaviour over days: that is correct. Cut: the day bands and the review at day 90 as a next tier decision (that is the upsell sitting inside the clinical arc). MVP cut: derive "where the person is in the loop" (discover, play, flow, embody) from the record as a pure function, never stored, never shown as a number. Size M.

**3. Evidence ledger.** Exists, and well: `trace.js` derives, does not store ("DERIVE, DON'T STORE"), five provenance labels, registration is not causation. `practice.js` line 394: an outcome that claims change must name evidence of effect, and "a practice that ran, or felt good, is not evidence of change". Adds: said / detected / thought / experienced / changed / verified as named kinds, and "why do you think that" as a chain. Conflicts: a new "single source of truth" store duplicates the derived graph. Rename: it is the trace, not a ledger. MVP cut: add `experienced` and `changed` as labels on existing nodes, and a read-only "show the chain" for any sentence the product says. Size M. This is the best idea in the proposal.

**4. Safety Gate.** Exists: nothing at runtime. Documents only. (A grep of `atuned_src/` finds no 988 line, per the onboarding review.) Ruling: no permanent safety line, the sniffer must detect distress and respond, never diagnose, follows the feelings wheel. Adds: this is genuinely new and is the one area I would build first. Conflicts: a seven way classifier is too clinical, and "possible trauma activation" is a label about the person. Cut to three: ordinary, strong, needs a person now. The sniffer's output stays words from the wheel, never a category. Size M. The response is the creative problem: one plain sentence in the instrument's voice, the way out beside it, no modal, no lecture.

**5. Privacy as architecture.** Exists: `PRIVACY-POLICY.md` section 4 (what leaves the device), `CONSUMER-HEALTH-DATA.md`, host free engine, defaults at DECISIONS.md round PD. Adds: a data table the product can show. Conflicts: none. Best surface: a page readable in ten seconds (kept here, what leaves, how to delete). Size S to M. A statement about the product, not a dashboard of the person.

**6. Commerce and identity.** Exists: `plan.js` SIGHT table (one place), ladder 12, 29, 59, 99. Conflict: the proposal quotes "Sight is not for sale. New ground is." Reversed by the owner 1 October. Reconcile to SIGHT: everybody sees their own reading at the 112 addresses, tiers add saboteurs, complexes, hyper complexes, character. Keep the one sound idea: downgrading never takes away ground already opened. Size L. Server authority needs a lawyer first.

## Keep, cut, rename

- **Keep:** the one rule; the six way distinction (said to verified); the chain "why do you think that"; the safety screen; downgrade never removes opened ground; privacy as a readable statement.
- **Cut:** Hypothesis Manager as a ranked list of theories about a person; next best action as a prescription; Day bands and the day 90 review; `current_friction` and `last_meaningful_change` as person fields; "CAN LEAD OTHERS" as an entitlement name (it is the practitioner role, ruled).
- **Rename:** orchestrator to reading rules; Evidence Ledger to the trace; JourneyState to where the loop is; verification to "held". Whatever is drawn says what a person did, never what they became.

## Risks

- A gate that rewards reported change teaches people to report change (SIG17).
- Ana or Nkem hitting a safety response that reads as a script. It is the only moment the voice must be warm without a wellness word.
- Gordon and Derek reading "next best action" as a coach and leaving. Sofia reading a practitioner view as surveillance of her clients without the visible consent list.
- A state machine feeding the avatar makes it a progress bar. DESIGN-avatar section 5 forbids an avatar that reflects the reading.

## Minimal version that keeps the soul

1. The one rule, as a gate over `trace.js`.
2. `experienced` and `changed` labels, and "show the chain" on one surface.
3. A runtime distress screen on the Story entry, three outcomes, one sentence each.
4. A derived loop position (pure function, no number on screen).
5. A readable data page.
6. Entitlements reconciled to SIGHT, plus the downgrade guarantee.

Everything else waits.

## Recommended order

1. Safety screen (new, protects a person, no dependency).
2. The one rule plus the label additions (S, proves the ledger without a new store).
3. Show the chain on one surface (the person sees why).
4. Privacy page.
5. Derived loop position, feeding the avatar by dated facts only.
6. Entitlements, last, behind legal and a server.

**What the ICPs feel.** Ana: safe if the screen is one sentence and she is not sorted; harmed if she is classified. Gordon: sees a clinic and refuses. Derek: wants the chain, because it is a number he can check. Sofia: needs the consent list visible before she trusts any of it.
