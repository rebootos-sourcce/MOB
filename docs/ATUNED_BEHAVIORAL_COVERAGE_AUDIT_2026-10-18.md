# ATUNED Behavioral Coverage Audit — 2026-10-18

## Status

**Outcome: behavioral scoring is not yet implemented or verified.** This audit records the source-backed gap and defines the test gate without inventing behavioral definitions.

## Sources inspected

- `SNIFFER_SPEC.md` (main): canonical layer order, nine fetter axes, 33 Saboteur firing bands, and known scoring guards.
- `atuned_src/engine/data/canon.js` (main): runtime SAB33 table.
- `proto/sniffer/bands.js` (main): independent SAB33 reference table; the Controller → Micromanager rename is present.

The canonical spec enumerates 33 Saboteurs with fetter-band configurations. In the reviewed sections, it does **not** provide a machine-readable set of behavioral indicators, positive examples, counterexamples, or behavioral weights for each Saboteur. Therefore, the existing sources do not support claiming that all 33 have behavior-informed scoring.

## Canonical constraints the implementation must preserve

1. Detection layers: bias → fetter → Saboteur → complex → hyper-complex; mask is output, not a detection layer.
2. Nine fetter axes have two independent values each: shadow load and coherent load. Do not collapse them into one signed score.
3. Saboteur bands are ramps: membership peaks inside the band and tapers above it; avoid hard cliff thresholds.
4. Surprise must not independently trigger a Saboteur.
5. Resentment is a composite signal (Anger + Apathy), not Anger alone.
6. Avoider is a known weak/high-frequency signal and must not dominate rankings.
7. Keep competing candidates when evidence is ambiguous; do not force a unique cause.
8. Clinical labels are translation only, not diagnoses.

## Implementation gap

The charge-band table can identify compatible candidates, but it cannot by itself distinguish candidates that share or overlap charge bands. Behavioral scoring needs an explicit, sourced indicator catalog and test fixtures before weights or confidence claims can be trusted.

## Required behavioral catalog schema

Each indicator must contain:
- `saboteur_id` and canonical name;
- observable behavior stated without inferring hidden intent;
- evidence direction: supporting or contradicting;
- context/trigger and recurrence criteria where the source provides them;
- source citation or canonical provenance;
- example fixture and counterexample fixture;
- ambiguity links to other candidates;
- status: canonical, proposed, or unresolved.

Do not silently promote proposed indicators into canon. If source provenance is absent, mark the indicator unresolved and do not use it to increase a candidate score.

## Required test gate

For all 33 Saboteurs:
- at least one sourced positive fixture;
- at least one negative/counterexample fixture;
- contrast fixtures against the closest overlapping candidate(s);
- multi-candidate cases that verify alternatives remain visible;
- missing-behavior-input case proving charge-only results are explicitly labeled charge-only;
- regression tests for Surprise, resentment as Anger + Apathy, weak Avoider signal, and dual shadow/coherent axis readings.

Acceptance criteria:
- 33/33 canonical identities represented;
- no unsupported behavioral indicators or weights;
- test outcomes and coverage reported from actual runtime execution;
- no claim of behavioral accuracy until fixture outcomes are measured.

## Current verification

- Canonical Saboteur inventory: 33 entries in the spec.
- Independent band table vs runtime table: prior normalized comparison reported 33/33 matching rows and zero discrepancies.
- Behavioral indicator coverage: **unverified / source gap**.
- Runtime test suite: **not run / no test command established from the inspected repository paths**.
- CI status for this audit: pending.

## Next step

Locate or author the canonical, provenance-backed behavioral indicator source. Once its owner-approved definitions exist, implement the scorer and fixtures, discover the repository's actual test command/CI gate, run tests, and iterate on failures. Do not fabricate the missing behavioral data to make the test suite appear complete.


## Execution delta — 2026-10-18

The initial source gap has been partially closed by inspecting the v29 application file in Reboot-OS. Its `V22_SABOTEUR_DETAIL` object supplies trigger, interrupt, and formation descriptions for 31 legacy entries. The MOB branch now contains:

- `proto/sniffer/behavioral-catalog.json`: 33 canonical names, provenance fields, explicit aliases, and blocked missing/ambiguous records.
- `proto/sniffer/behavioral-score.js`: experimental ranker combining charge compatibility with externally supplied support/contradiction ratings. It requires the catalog entry to be individually eligible before accepting a behavior score.
- `proto/sniffer/behavioral-score.test.js`: Node assertion tests for 33-name coverage, score ranges, weights, charge-only fallback, contrasting candidate ranking, and missing/ambiguous mapping blocks.
- `.github/workflows/behavioral-score.yml`: dedicated Node 22 CI gate.

### Coverage and limitations

- 33/33 canonical names represented in the catalog.
- 28 entries have individual source descriptions eligible for the experimental ranker.
- Victim and Judge remain blocked because the source combines them into one entry.
- Innocent, Enabler, and Control Freak remain blocked because no descriptions were found in the inspected source.
- The source descriptions are not validated positive/negative behavioral indicators. The ranker does not classify raw text; it consumes separately supplied evidence ratings.
- The 65% behavior / 35% charge weighting is provisional, not canonical or empirically validated.
- Initial dedicated CI run passed before the final eligibility guard and regression were added. The updated final-head CI run is pending and must be checked before calling the gate green.
- End-to-end integration into the live Sniffer decision path remains unverified.

Do not mark behavioral scoring complete until source-backed indicator rules, raw-input evaluation, validated contrast fixtures, and final-head CI/runtime integration have been completed.
