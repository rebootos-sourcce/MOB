# ATÜNED Template Closure — Three-Pass Research Findings
**Date:** 2026-10-20  
**Repository:** rebootos-sourcce/MOB, branch main  
**Status:** OPEN — research findings and implementation blockers, not a closure claim.

## Mission scope
Close template coverage and parent-to-child connectivity for every applicable fetter, saboteur, complex, hypercomplex, supercomplex, and inferred item. Selecting a supercomplex must resolve its downstream children and their full applicable template content. Do not invent canonical definitions or silently promote proposals.

## Pass 1 — Inventory and authoritative-source recovery
Inspected the full default-branch Git tree (6,031 paths; not truncated), the current gap register, the closure execution record, `SNIFFER_SPEC.md`, `atuned_src/engine/data/canon.js`, `atuned_src/engine/data/nodes.js`, `atuned_src/engine/data/sabcard.js`, `proto/knowledge/src/gen-data.js`, generated `proto/knowledge/src/data.js`, and `mockups/teacher-complex/NOTES.md`.

Findings:
- The source tree contains an authoritative-looking detection specification with the chain bias → fetter → saboteur → complex → hyper-complex and says pattern installation may occur from any direction. It explicitly says masks are output, not another rung.
- `canon.js` contains the 33 saboteur charge-band table. `sabcard.js` contains lived-behaviour narrative cards keyed to saboteur definitions. These are substantive domain content, but are not a complete universal template-assignment registry.
- `gen-data.js` generates knowledge entries from engine tables. It generates 112 node entries, 39 saboteur entries, and six hypercomplex architecture entries (plus other kinds). It computes links from node axis/seat, saboteur node IDs, and architecture membership. It does not currently generate a universal template reference field or a supercomplex/inferred item assignment graph in the inspected output.
- The knowledge generator's six architecture entries are built from `HCX_LIB`; that is evidence for six hypercomplex architecture records, not proof that every supercomplex or inferred record has a complete template.
- The teacher-complex mockup is a separate behavioural recipe UI and is not proof of the domain template catalog being complete.
- The inspected repository tree does not expose an obvious dedicated domain-template catalog by filename. This is a search result, not proof that no catalog exists in another repository or source artifact.

## Pass 2 — Content and semantic review
- Fetter/node records currently have concise generated display fields (name, address, theme/distortion, axis) but no explicit template ID/reference in the generated knowledge schema.
- Saboteur content has stronger coverage: the 33 SAB33 definitions encode charge bands; SABCARD has behaviour, availability, and next-move narrative for its keyed rows. The generator emits 39 saboteur entries, so the extra six entries need membership and applicability adjudication rather than automatic treatment as canonical members of SAB33.
- Hypercomplex architecture entries expose name, seat, definition, and sub-description in the generated data. This does not yet establish complete parent→child template expansion for supercomplex selection.
- The generator creates some relationships automatically, but no inspected code proves a complete, typed graph for all inferred records, all hypercomplexes, all supercomplexes, and every downstream template.
- The existing node record `node:8 / Root_08_Unnamed` has a null category. This requires source-backed adjudication; no category should be guessed.
- Existing source explicitly distinguishes canon, implementation details, and proposals. Proposed thresholds and proposed body placements must remain marked proposed until source/owner approval.

## Pass 3 — Adversarial closure challenge
A record is not complete merely because it has prose or a generated knowledge-card entry. For every applicable item, closure must prove:
1. stable record ID and authoritative source/provenance;
2. exactly one valid template assignment, or a documented multi-template rule;
3. required template fields present and substantively populated;
4. typed parent/child and downstream edges resolve to real records;
5. selecting a parent returns all required downstream definitions, behaviour, energy, template fields, and provenance;
6. no dangling IDs, duplicate IDs, unclassified applicable records, or silent proposal-to-canon promotions;
7. automated tests cover every record, not only samples.

## Current blocker and next implementation actions
1. Recover and reconcile the authoritative domain template specifications and the historical inference-template assignment backlog against stable IDs; include the companion manuscript/source material where needed.
2. Build a canonical template registry and assignment map only from those recovered specifications. Do not invent the template taxonomy.
3. Extend the generator to emit template IDs, complete template payloads, and typed parent/child/downstream links into generated data; never hand-edit generated `data.js`.
4. Add automated coverage checks for every fetter, saboteur, complex, hypercomplex, supercomplex, and inferred record, plus a recursive selection test that proves downstream information is returned.
5. Resolve node 8 from source, or mark it blocked with explicit rationale.
6. Run the checks and repair failures iteratively; report closure only when all applicable records and edges pass.

## Measured state from inspected artifacts
- Repository tree: 6,031 paths, not truncated.
- Generated knowledge records: 266 total (seat 7, axis 9, node 112, sab 39, hcx 6, mask 6, arch 12, dom 19, term 56).
- Generated records with an explicit field name containing “template”: 0.
- Node registry: 108 somatic nodes plus four field anchors; at least one null category.
- Verified category-specific template coverage: not measurable from the current generated schema.
- Parent→child recursive template expansion tests: not evidenced in inspected artifacts.
- Closure status: OPEN. No 100% completion claim is supported yet.
