# ATUNED Vritti — Nerve-Level Signal and Fetter Marker TDD
Version: 1.0
Date: 2026-10-21
Status: Owner-defined contract; runtime implementation and tests remain to be verified.

## 1. Purpose
Define Vritti as a first-class nerve-level record and make its relationship to a fetter explicit in the record model and UI. Vritti must not be collapsed into the fetter itself, a somatic address, an emotional label, or a score.

## 2. Canonical definitions
- **Vritti** (V-R-I-T-T-I): the waveform of sensory input plus emotional input, belonging at the nerve-level record layer.
- **Nerve-level record**: the record of the sensory-emotional signal at its nerve address, preserving input, context, timing, and provenance.
- **Fetter**: the name/type of a node. It is the node identity, not the waveform.
- **Vritti–fetter association**: a recorded relationship established when a Vritti is identified with a fetter. Association may be candidate, confirmed, or rejected.
- **Fetter marker**: a UI icon/status marker on a fetter record indicating that one or more Vritti records are associated with it. The marker is a navigation affordance, not a metric.

## 3. Data contract
Use the repository's existing record and trace ownership. Do not create a parallel profile store.

Suggested typed shape (field names may adapt to canonical schema conventions):

```yaml
VrittiRecord:
  id: string
  nerve_address: string
  sensory_input:
    raw: string
    normalized: object | null
    source: string
  emotional_input:
    raw: string
    normalized: object | null
    source: string
  waveform:
    representation: object | string | null
    method: string | null
    units: string | null
  context: object
  observed_at: timestamp
  provenance:
    origin: user | observed | inferred | imported
    confidence: number | null
  associations:
    - fetter_id: string
      status: candidate | confirmed | rejected
      evidence: object
      created_at: timestamp
      updated_at: timestamp
  schema_version: integer
```

The waveform's exact encoding is not defined by this conceptual contract. Do not fabricate numeric physiological units or imply medical measurement. Preserve raw user input separately from normalized interpretation.

## 4. Cardinality and provenance
1. A Vritti can exist before a fetter is identified.
2. One Vritti can associate with more than one fetter if evidence supports it.
3. One fetter can have multiple Vritti records.
4. Inferred, observed, and user-confirmed associations must remain distinguishable.
5. A user can confirm, correct, or reject an association without deleting the underlying Vritti record.
6. A release run or a Vritti marker does not itself confirm a fetter, prove causality, or count as a release hit.

## 5. Fetter marker behavior
- No associated Vritti: no marker, or a neutral empty state where discoverability requires it.
- Candidate association only: show a visually distinct candidate marker.
- Confirmed association: show the confirmed marker.
- Rejected association: do not display as active; retain the rejection event for provenance and model correction.
- Activating the marker opens a detail view/list of associated Vritti records, including sensory input, emotional input, nerve address, context, source, confidence, and association status.
- If a link is missing or invalid, show an explicit unresolved-link state; do not silently attach it to a different fetter.
- Marker state is derived from association records and should not be stored as a second independent truth when it can be computed from the canonical association.

## 6. Metric isolation
The presence, count, intensity, or marker state of Vritti records does not by itself modify:
- node/fetter weight;
- SQ, total shadow weight;
- DQ, total shadow / Resistance;
- CQ, Coherence;
- release-hit accumulation;
- stored-charge estimates.

Metric changes require their own owner-defined evidence and calculation rules. This prevents a UI marker from becoming an accidental scoring mechanism.

## 7. Integration points
Wire Vritti through the existing architecture:
1. Nerve/somatic record owner captures sensory and emotional inputs and their provenance.
2. Pattern/fetter owner supplies canonical fetter IDs.
3. Existing trace graph stores or references the association with allowed provenance.
4. Existing record persistence validates, saves, reloads, exports, and imports the Vritti record and association.
5. Existing fetter/node UI renders the derived marker and opens the Vritti details.
6. Release pile can reference the related Vritti/fetter but does not automatically mark it as a hit.

## 8. Acceptance tests
1. Vritti can be persisted with no fetter association.
2. A candidate association renders a candidate marker and remains distinct from confirmation.
3. Confirming an association updates marker state and retains provenance.
4. Rejecting an association hides it from active marker state but preserves its decision history.
5. Multiple Vritti records can link to one fetter without overwriting each other.
6. A Vritti can link to multiple fetters without duplicating the Vritti record.
7. Reload and export/import preserve identifiers and association state.
8. Duplicate event replay does not duplicate association or evidence.
9. Missing fetter references are handled explicitly and never silently reassigned.
10. Marker activation opens the correct Vritti details.
11. Marker and association changes do not alter CQ, DQ, SQ, node weight, or release-hit counts.
12. Raw user input and normalized interpretation remain separately inspectable.

## 9. Implementation sequence
1. Inspect the canonical nerve/somatic record schema and trace-edge allowlist.
2. Add the Vritti record and association using existing schema conventions.
3. Add validation and persistence/reload/import/export coverage.
4. Add a derived marker to the existing fetter/node record view.
5. Add detail navigation from marker to Vritti record.
6. Add tests above to existing test owners.
7. Run build, engine tests, and release-chain tests in a real runner.
8. Report each step as implemented only with source path and passing verification evidence.

## 10. Verification boundary
This TDD defines intended semantics and acceptance criteria. It does not claim production Vritti records, markers, or persistence are implemented.