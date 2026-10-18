# Fetter-to-Saboteur Evaluator — Block 3/4 Implementation Note
Date: 2026-10-18

## Change
Added `fetter-saboteur-evaluator.js` at the framework mapping boundary. It consumes canonical fetter levels and optional explicitly supplied evidence, scores all 33 canonical Saboteurs using the bands table, and returns charge ranking and evidence ranking separately.

## Safety and validity rules
- Behavioral evidence is never inferred from prose or journal text.
- A behavioral score requires a catalog entry marked scoring-eligible plus caller-supplied support, contradiction, and `sourceVerified: true`.
- Blocked or ambiguous entries (including Victim and Control Freak where the catalog marks them ineligible) remain behaviorally unscored.
- Charge and behavior scores remain separate; `combinedScore` is deliberately null. The current 65/35 experimental weights are not used because coverage and validity have not been established.
- No accuracy percentage is emitted without independent expected labels.

## Tests added
- All 33 canonical names represented and unique.
- Charge-only evaluation returns all 33 candidates and no behavioral scores.
- Verified eligible evidence changes the evidence-only ranking.
- Ineligible/ambiguous entries cannot be scored by passing caller-supplied numbers.
- Invalid fetter levels fail closed.
- No unsupported global blended ranking is produced.

## Limits / next work
This is a deterministic framework evaluator and logic test, not an empirically validated classifier. The next validation block must compare against independent expected labels, expand provenance-backed behavioral indicators, and run CI on the branch. Do not merge or claim accuracy until those checks pass.
