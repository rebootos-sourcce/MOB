# Architecture 9/10: P0 integration candidate

Base: a0863bc29daed9e2b779b6fe24b5666abd312591. Review only, not accepted for Alpha or production.

Integrates draft PRs #222, #223, #225, #226, #230 and #233. Retains nightly exact-SHA and inventory checks, imported-plan fail-closed policy, boot pending-animation watchdog, finalized story durability, Discover glass rendering, and consolidated browser probes. Panels changes occupy independent source regions; #233 supersedes the #222 Talk test flags. All generated assets must be rebuilt together. Original draft PRs remain open and owner review is required.

Acceptance: full product equivalence and mandatory gates, seven repeated runs per scoped probe with floors intact, nightly three-solo/four-concurrent runs, separate cloud-on geometry and real GPU validation, production identity/authorization and deployment smoke evidence. Report-only failures remain open; no promotion or release claim. Profile sync remains disabled. No billing, production or main changes.

Subsequent architecture work: schema and persistence audit, canonical calculation reconciliation, record provenance, trace graph integrity, intelligence evidence contracts, application profiling and measured acceptance. No 9/10 claim until evidence exists for all categories.
