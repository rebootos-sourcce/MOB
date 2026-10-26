# Inferno V2 — source reconstruction, not canonical promotion

Date: 2026-10-26

The 38-record V2 registry was **reconstructed deterministically from the original, archived 2026-10-25 four-pass research document and CSV crosswalk**. It is **not** the missing normalized V1 file, and its SHA must never be substituted for that V1.

## Source inventory

| Source/artefact | Status |
|---|---|
| Original research document | Preserved at `../v1/research/INFERNO_FOUR_PASS_REGISTRY_2026-10-25.md` |
| Original CSV crosswalk | Preserved at `../v1/research/INFERNO_CROSSWALK_2026-10-25.csv` |
| Individual original source sections | 38 markdown files at `../v1/research/records/` |
| 21-field V2 registry | `INFERNO_NORMALIZED_RECONSTRUCTION_V2.json` |
| Validation schema | `INFERNO_NORMALIZED_RECONSTRUCTION_V2.schema.json` |
| Source and section validator | `validate_inferno_reconstruction_v2.cjs` |
| Original V1 normalized JSON | **Not recovered / not imported** |

## Verification

- 38 / 38 stable source IDs, from 15 behaviors, 9 circles, 11 figures, 3 cross-tradition contexts.
- 152 / 152 original P1–P4 analytical text passes preserved.
- 21 / 21 inherited compatible template fields included in every V2 record.
- Verified source research SHA-256: `121f67f0e6625ef44e29bc7730143ddef70ba7e8b27322be832472960da54202`.
- Original normalized V1 **expected** SHA-256: `de3d0099ffbaf698d40873a141010cd2c724ff226e0b33a208b1307f58bc0fdc`. The original V1 archive itself has not been located.
- V2 reconstruction archive is intentionally **not** assigned the expected V1 digest.
- Separate source-graph bridge and documentation-only reader consume these 38 V2 record envelopes with four passes under explicit nonruntime guards.
- Published source files have zero approved runtime/CQ edges.

Run from the repository root:

```sh
node docs/data/compass/integration/v1/validate_full_foundation.cjs
node docs/data/compass/integration/v1/validate_inferno_source_bridge_v1.cjs
node docs/data/compass/integration/v1/validate_inferno_research_and_teacher_joins_v1.cjs
node docs/data/inferno/v2/validate_inferno_reconstruction_v2.cjs
```

GitHub CI activation is configured but not externally confirmed by a completed workflow run.

## Restrictions

V2 preserves modeled links as `UNPROMOTED`; figure identity and behavioral meaning are not the same relation; cultural traditions are not collapsed; no clinical identity or moral worth may be inferred. Inferred constructive opposites, release protocols, CQ scores, and live intelligence routing are not authorized from these records. Semantically ambiguous roots and mappings remain documented for review.
