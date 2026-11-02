# Fetter-to-Saboteur Behavioral Evidence Coverage Audit
Date: 2026-10-18
Status: Source-description coverage audited; behavioral indicators not yet validated.

## Summary
- Canonical profiles: 33
- Source-backed descriptive entries: 28
- Shared/ambiguous source entries: 2
- Missing individual source entries: 3
- Eligible for experimental evidence input: 28

**Important distinction:** A source-backed trigger, interrupt, or formation description is not the same as a validated positive/negative behavioral indicator. This audit measures description provenance coverage only; it does not measure classification accuracy.

## Canonical coverage
| Saboteur | Source status | Experimental input | Source label |
|---|---|---|---|
| Negotiator | source_backed | Eligible for experimental evidence input | Negotiator |
| Micromanager | source_backed | Eligible for experimental evidence input | Controller |
| Victim | shared_ambiguous | Blocked from behavioral scoring | Victim / Judge |
| Perfectionist | source_backed | Eligible for experimental evidence input | Perfectionist |
| Pleaser | source_backed | Eligible for experimental evidence input | Pleaser |
| Hyper-Achiever | source_backed | Eligible for experimental evidence input | Hyper-Achiever |
| Hyper-Rational | source_backed | Eligible for experimental evidence input | Hyper-Rational |
| Hyper-Vigilant | source_backed | Eligible for experimental evidence input | Hyper-Vigilant |
| Restless | source_backed | Eligible for experimental evidence input | Restless |
| Stickler | source_backed | Eligible for experimental evidence input | Stickler |
| Judge | shared_ambiguous | Blocked from behavioral scoring | Victim / Judge |
| Deflector | source_backed | Eligible for experimental evidence input | Deflector |
| Dramatizer | source_backed | Eligible for experimental evidence input | Dramatizer |
| Worrywart | source_backed | Eligible for experimental evidence input | Worrywart |
| Loner | source_backed | Eligible for experimental evidence input | Loner |
| People-Pleaser | source_backed | Eligible for experimental evidence input | People-Pleaser |
| Skeptic | source_backed | Eligible for experimental evidence input | Sceptic |
| Dreamer | source_backed | Eligible for experimental evidence input | Dreamer |
| Procrastinator | source_backed | Eligible for experimental evidence input | Procrastinator |
| Imposter | source_backed | Eligible for experimental evidence input | Imposter |
| Aggressor | source_backed | Eligible for experimental evidence input | Aggressor |
| Martyr | source_backed | Eligible for experimental evidence input | Martyr |
| Cynic | source_backed | Eligible for experimental evidence input | Cynic |
| Manipulator | source_backed | Eligible for experimental evidence input | Manipulator |
| Overthinker | source_backed | Eligible for experimental evidence input | Overthinker |
| Escapist | source_backed | Eligible for experimental evidence input | Escapist |
| Nihilist | source_backed | Eligible for experimental evidence input | Nihilist |
| Innocent | missing_source | Blocked from behavioral scoring | No individual source |
| Pessimist | source_backed | Eligible for experimental evidence input | Pessimist |
| Catastrophizer | source_backed | Eligible for experimental evidence input | Catastrophizer |
| Enabler | missing_source | Blocked from behavioral scoring | No individual source |
| Control Freak | missing_source | Blocked from behavioral scoring | No individual source |
| Avoider | source_backed | Eligible for experimental evidence input | Avoider |

## Required annotation before accuracy testing
Each candidate needs independently reviewed observable behavior examples, counterexamples, source references, context/recurrence requirements where justified, and an expected candidate label established independently of the scoring rules. Reviewers must explicitly mark ambiguous cases and must not infer hidden intent from a trigger description alone.

## Blocked records
- **Victim / Judge:** the current source record is shared; do not split it into two independent behavioral definitions without separate source evidence.
- **Innocent:** no individual source description found in the current catalog.
- **Enabler:** no individual source description found in the current catalog.
- **Control Freak:** no individual source description found in the current catalog.

## Acceptance rule
Do not claim behavioral accuracy from source-description coverage or synthetic fixtures. Report annotation coverage, unresolved cases, and independent expected-label performance separately. Keep charge-only rankings available when behavior evidence is absent.
