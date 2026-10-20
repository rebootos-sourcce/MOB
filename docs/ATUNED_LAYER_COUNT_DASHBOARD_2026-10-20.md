# ATÜNED Layer Count Dashboard — 2026-10-20

**Status:** OPEN. This is the current source-backed count snapshot, not a completion declaration.  
**Rule:** Refresh this dashboard and the TDD/work log after every meaningful change and at every thread handoff. Remove an outstanding flag only after verification. Never claim a persistent monitoring agent is active unless one is configured and tested.

## Required quick count on every round

| Layer / record family | Count currently supported by inspected source | Record/template completion | Status |
|---|---:|---|---|
| Nerve artwork branches | 72 | Not audited as individual framework records | Count confirmed by opening comment in atuned_src/engine/data/nerves.js; branch count is not the same as nerve-to-character mapping count |
| Nerve-to-character relationships | Unverified | Not audited | OPEN — must inventory expected relationships and each current mapping |
| Nodes / addresses | 112 | Individual completeness not audited | Count supported by atuned_src/engine/data/nodes.js; includes 108 somatic nodes and 4 field anchors in prior audit |
| Fetters / emotional axes | 9 | Record-level coverage not audited | SNIFFER_SPEC.md identifies nine emotional axes as fetters; full record inventory and mapping completeness remain OPEN |
| Saboteurs | 33 | Record/template coverage not fully audited | Canonical SAB33 table; required record-level validation remains OPEN |
| Ordinary complexes | Total unverified; at least 1 explicit definition located | Generated complex records: 0 in inspected proto/knowledge generator path; complete source records/templates unverified | OPEN — Narcissism is explicitly typed as kind 'complex' in compass.js; do not infer total from this one hit |
| Hyper-complex modes | 6 | Record/template coverage not fully audited | SNIFFER_SPEC.md names six modes; this is a separate layer from ordinary complexes |
| Super-complexes | Total unverified | Record/template coverage not audited | Psychopathy appears as one explicit super-complex entry in compass.js; not proof of total |
| Inferred records | Denominator unverified | Not audited | Must list individually and mark as inferred, with provenance and confidence |

## Sources to re-fetch and reconcile

- atuned_src/engine/data/nerves.js — SHA fc85b609ffba8cd1a24105fa9dec829f6a12b082
- atuned_src/engine/data/nodes.js — SHA 51e73e4c6061da77c629861ca7fc1b1b5de747eb
- atuned_src/engine/data/canon.js — SHA e7aa11668008aa145e47f023c622ef026e1c662f
- atuned_src/engine/data/compass.js — SHA b165e957b4c0db8dea75de8caf1f9f4b3ebc0282
- SNIFFER_SPEC.md — SHA ea172cd3ac68ebfd6212eb010f1f5724d1026cec
- proto/knowledge/src/gen-data.js — SHA 65e6a7f8377d0f3bc437094f0f0c1eb175cc4c8c
- proto/knowledge/src/validate-templates.js — SHA 78b2c8039b61605256cf3e6b25ff18a82b8246b
- docs/ATUNED_COMPLEX_RECORD_INVENTORY_SOURCE_MAP_2026-10-20.md — complex source map, candidate classification, and next actions

## Completion fields required per layer

For each layer, the next verified dashboard must record: canonical expected count; unique IDs/names; records present; records substantively complete; templates present and complete; source provenance; relationship edges expected/present/verified; outstanding IDs; unresolved exceptions; validation command and result. A layer is not complete merely because the source has a list or a generator has a schema.

## Execution order (P0)

1. Reconcile all canonical source inventories and establish denominators for every layer.
2. Create/complete all required records and templates.
3. Inventory and wire relationships only after the records are accounted for.
4. Run record, template, dangling-reference, graph-integrity, and navigation tests.
5. Update this dashboard, master TDD, gap register, source index, audit log, executive handshake, and handoff ZIP in the same checkpoint.
6. Do no unrelated work until the all-layer gate passes or the owner explicitly changes priority.

## Automation limitation

This document establishes the update rule; it does not itself create continuous monitoring or cross-thread synchronization. No persistent monitoring agent has been configured or tested in this change. Until such an agent is actually configured and verified, refresh these counts during each work round and verify them at thread startup/handoff.
