# Deep-Psychological Registry Audit — 2026-10-22

Status: OPEN. Static registry audit completed; runtime execution and integration remain unverified.

## Method
Retrieved the full JSON through Git blob SHA after the ordinary file-content endpoint returned an empty body. Parsed the 1,050,307-character registry and counted its records directly. This is static analysis, not execution of the Node adapter.

## Verified inventory

| Record family | Count |
|---|---:|
| Psychological roots | 4 |
| Behavioral domains | 15 |
| Archetype candidates | 18 |
| Conscious domains | 8 |
| Cultural-figure/domain mappings | 12 |
| Archetype/domain mapping rows | 18 |
| Archetype/fetter/seat mapping rows | 18 |
| Blueprint visualization slots | 14 |
| Canonical-domain candidates | 18 |
| **Total** | **125** |

The registry's declared count is also 125. The earlier 107 count was stale/incomplete.

## Findings
- Template assignments: 125/125.
- Structurally complete according to registry validation metadata: 102/125.
- Incomplete records: 23/125. These are all 15 behavioral-domain records and all 8 conscious-domain records. The behavioral domains lack `def` and `body`; conscious-domain records lack required affirmation fields, and seven also lack `def` and `body`.
- Research pass 1 marked complete: 125/125.
- Research passes 2 and 3 marked complete: 103/125; 22 remain blocked. These are the eight conscious-domain records and fourteen blueprint visualization slots.
- Blueprint canonical names recovered: 0/14. These slots are visualization placeholders, not established canonical records.
- Archetype candidates with three passes and semantic fields populated: 18/18; canonical taxonomy resolved: 0/18.
- Mapping rows reviewed: 36; approved semantic edges: 0.
- Cultural-figure mappings reviewed: 12/12; approved crosswalks: 0/12.
- Canonical-domain candidates reviewed: 18/18; domain-count ruling remains unresolved.
- A basic scan of child IDs, influence IDs, and links found no dangling IDs. This does not prove semantic validity, reciprocal parent/child correctness, or runtime traversal.
- Runtime integration remains false/not wired.

## Required interpretation
Do not invent definitions, affirmations, canonical names, or mapping semantics to fill gaps. Preserve source-backed facts, owner-stated language, unresolved taxonomy questions, and visualization-only placeholders as distinct states. A research-pass slot marked complete is not sufficient without distinct evidence and findings.

## Next actions
1. Recover source-backed definitions for the 15 behavioral domains and canonical Conscious Domain names/affirmations.
2. Recover blueprint domain names; do not promote visualization slots to canonical entities without evidence.
3. Resolve the 18-versus-15-versus-14 domain-count conflict using underlying source editions and document the ruling.
4. Validate all 125 records against the JSON Schema and template catalog; produce a record-by-record missing-field report.
5. Execute the adapter in Node and capture command, exit code, output, and commit SHA. The available GitHub connector does not provide a Node runtime, so this gate remains open.
6. Add registry-aware generator/validator integration without breaking the experiential Nerve-to-Super-Complex graph.
7. Validate approved relationship targets and reciprocity; run forward/backward traversal tests for every approved edge.
8. Update the TDD, checkpoint, source index, and executive handshake from one consistent measured snapshot.

## Gate status

| Gate | Result |
|---|---|
| Registry denominator | PASS: 125 verified |
| Template assignment | PASS: 125/125 |
| Required content | OPEN: 23 incomplete |
| Three research passes | OPEN: 22 blocked |
| Canonical taxonomy | OPEN |
| Approved semantic mappings | OPEN: 0 currently approved |
| Basic dangling-ID scan | PASS: 0 found in scanned fields |
| Adapter execution | NOT VERIFIED |
| Engine integration | NOT DONE |
| Runtime traversal | NOT VERIFIED |
| Overall closure | OPEN — NOT COMPLETE |

This audit supersedes earlier estimates of the registry denominator. It does not claim content, research, semantic wiring, or runtime closure.
