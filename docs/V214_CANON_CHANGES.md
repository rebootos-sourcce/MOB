# CANON CHANGES IN v214
**2026-09-15. What moved, and what it breaks.**

v214 replaced the manuscript in this repo. It is 136,282 words against the
previous 116,701. These are the changes that affect other files.

---

## THE COUNTS THAT MOVED

| | Was | Now in v214 |
|---|---|---|
| Nodes | 114 | **112** (108 in-body, 4 field) |
| Harmonic Table | 68 elements | **76 elements** |
| Paths | Four | **Five** |
| Archetypes | XV | **XVIII** (adds Death, Fate, Guardian) |
| Named saboteurs | 32 | **33** |
| Belief map math | 112 x 108 = 12,096 | **108 x 108 = 11,664** |
| Field nodes | 2 (Earth Star, Soul Star) | **4** (Gaia Gateway, Earth Star, Sol Star, Stellar Gateway) |

## THE RULE THAT INVERTED

`HANDSHAKE.md` says: *The node count is 114. Never say 108.*

**That is now backwards.** In v214, 108 is correct as the in-body count and
112 is the total. 114 is the superseded number.

The handshake and README both need this line changed. It is currently
instructing against canon.

## THE DISTRIBUTION, v214

| Band | Range | Count |
|---|---|---|
| Root | 1-16 | 16 |
| Sacral | 17-32 | 16 |
| Solar Plexus | 33-48 | 16 |
| Heart | 49-63 | 15 |
| Throat | 64-75 | 12 |
| Third Eye | 76-87 | 12 |
| Crown | 88-106 | 19 |
| Anchor | 107-108 | 2 |
| Field | 109-112 | 4 |
| **Total** | | **112** |

Parsed from the master table and verified against the distribution table.
They agree exactly.

## TWO ADDRESSES ARE STRUCK

Nodes **99** (Knowing Better than God) and **108** (Endless Seeking) print
`ADDRESS PENDING · struck 2026-09-08`. Struck as not the author's language,
and deliberately not replaced with a guess.

Both are excluded from every generated asset. The content gate now rejects
any post naming them. Restoring them is a ruling, and v214 files it under
Appendix D, G15.

## WHAT v214 FIXED

**The Pattern Catalog is gone.** That was the stale appendix carrying the old
108-node architecture and contradicting Appendix B. It was finding 1.1 in
`LITTLE_BOOKS_REVIEW_2026-09-15.md`. Resolved by deletion.

## WHAT IS NEW AND UNREVIEWED

New chapters and sections not in the previous version: One Mechanism Four
Scripts, The Descent, Borrego Tulum Florida, The Handoff, The Geometry of
the Soul, The Domains, The Five Paths, The Practices by Key, Technical
Specification, Glossary, Index of Keys, What the Author Fills, and a
Colophon carrying rulings and the build record.

## FILES REBUILT ON v214

| File | State |
|---|---|
| `index.html` | replaced with v214 |
| `pipeline/nodes.json` | 112 nodes reparsed |
| `pipeline/gate.py` | 114 now rejects, 108 in-body passes, struck nodes reject |
| `pipeline/units.json` | 123 units, all pass |
| `pipeline/calendar.md` | 216 posts regenerated |
| `diagnostic.html` | 105 usable nodes, republished |

## FILES STILL CARRYING THE OLD COUNT

These say 114 and now contradict canon. They need Lance's confirmation
before I change them, because 114 was previously stated as absolute.

- `docs/HANDSHAKE.md`, the voice rule and section 6
- `docs/README.md`, hard rules
- `docs/MOB_AGENT_PACKAGE_CORRECTED.md`, query letter and correction table
- `docs/PUBLISHING_BRIEF.md`, the Compendium line
