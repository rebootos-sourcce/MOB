# The deep psychological registry

Merged into the working line on 24 October 2026, from `main` and from pull
request 129. This page says what the files are and what they are not.

The measured comparison with the engine, the vendored canon.json and the
owner's book is in `CANON-MERGE-PLAN.md`, in the sections "The third source:
the deep psychological registry, reconciled five ways" and "Tactics for the
registry, layer by layer". In short, by that
reading: where the registry and the engine describe the same thing, the
engine's tables are the newer and agree with his book. Of what the
registry adds, the Conscious Domains, the three related consciousness
concepts and the long form archetype content are proposed as inert ports
by code, the archetype to domain rows and the cultural figures are held,
and the blueprint slots are held out. The rulings that would move any of it
are D14 to D16 there, and they are his. Run the comparison again rather
than trusting a figure:

    python3 -I tools/registry-reconcile.py --book MOB_Complete_v341.html docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json

The book is `MOB_Complete_v341.html` on reboot-os branch
`claude/keen-brahmagupta-qt32zr`, the file the registry cites by its
SHA-256.

## What is here

- `ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json`, the registry: one
  record per root, domain, archetype, Conscious Domain and mapping row, each
  with its sources, three research passes, a confidence and its open
  questions.
- `ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json` and
  `ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json`, the shape of a record
  and its templates.
- `ATUNED_DEEP_PSYCHOLOGICAL_RECORD_AUDIT_2026-10-24.csv`, the record by
  record audit of 24 October.
- The tools that read them are in `proto/knowledge/src/`: the adapter, two
  audits, and the knowledge prototype's generator and validator.

## What it is not

- **Not part of the product.** Nothing in the build reads this folder. The
  registry's own records say they are not wired: `runtimeIntegration` reads
  `not_yet_wired`, or `not_verified` on the records added on 24 October.
- **Not approved.** Its own status is open and provisional, and no record
  carries a canonical approval.
- **Not a replacement for the engine's tables.** The research's own
  contract, `docs/ATUNED_DEEP_PSYCHOLOGICAL_CODE_TO_REGISTRY_CONTRACT_2026-10-22.md`,
  calls its fields "useful provenance extensions, not replacements". The
  tables in `atuned_src/engine/data/` are what the product reads, and a row
  of the registry reaches the product only when the owner rules it in, one
  table change at a time.

## Changed on the way in

Commit `5f56e120` made every em dash in these files, and in the research
documents that came with them, a comma, and every en dash a hyphen. That is
the house rule, carried out the way the owner's handshake of 15 October was
carried, "as sent, em dashes made commas". No other character moved, which
the commit proves file by file. The records' own changelogs do not show the
change; this page and that commit are its record.

## Open, measured 24 October

- `node proto/knowledge/src/validate-templates.js` was red on `main` before
  the registry arrived. The registry adds one open item of its own: its v341
  roster records lack the parent links its last commit made required, which
  it records as source blocked.
- `proto/knowledge/src/data.js` was not regenerated here. The generator runs
  with the registry in, and regenerating is the knowledge prototype's own
  step.
- The registry's `sourceRefs` point at reboot-os `blob/main`, which moves.
  On 24 October reboot-os `main` was `242e995`.
