# Nerve to celestial: what is wired, audited 31 October 2026

Asked by the owner on the night of 30 October: "Please verify that the
intelligence and the graph has every nerve to celestial record and that
they're wired together."

Verification only. Nothing was built or changed. Every count below was read
off a run on commit `3f09b595` (branch `nerve-celestial-audit-30oct`), from an
engine built fresh out of `atuned_src/` into a scratch folder and checked byte
for byte against the committed `engine.js` (identical). `node tests/trace.js`
was green on the same commit. These counts are true on that commit and that
day, and they are not meant to be quoted later without a fresh run.

## The verdict

- **The conditioned chain is real and wired, from nerve up to super complex.**
  `compute()` in `engine/compute.js` builds every rung out of the rung below
  it, and the trace graph (`engine/trace.js`) can carry the whole chain as four
  typed edges. Measured: an address reaches its super complex in four steps.
- **But the graph the product actually builds never holds the chain.** The
  three places in the product that build a graph (`ui/character.js`,
  `engine/daily.js`, `engine/loop.js`) never pass in a reading, and without a
  reading the graph has no saboteur, complex, hyper complex or super complex
  in it at all. `trace.js` says so itself, at `TRACE_ALG`. The chain is wired
  in the engine, and nothing that runs asks for it.
- **The celestial crossing is mostly not wired.** There is one real link and
  it is a strong one: the blueprint domains and archetypes a person picks set
  how much charge every one of the 108 body addresses takes. But the actual
  birth chart (sun, moon, rising, design gate, gene key, life path, year
  animal) reaches nothing below it. Measured: two different births, every
  other field the same, move zero addresses, zero saboteurs and zero
  archetypes. The chart is computed, shown and compared, and it never enters
  the arithmetic.
- **The one table that would join a sign to a charge exists and is locked
  off on purpose.** `ASTRO_OVERLAY.load_map` in `engine/data/registers.js`
  maps each sign and year animal to a charge. It was ported from canon.json
  with canon.json's own lock: "Display-only overlay. Failed a permutation test
  for convergence at p = 1.000. Never enters a number." Lifting that lock is
  the owner's call, not a seat's.
- **The layers above the super complex are not joined to it.** The owner's
  23 October ruling puts masks above the super complex and archetype through
  domain above the masks. In the code the masks are read straight off seat
  averages, not off any rung, and `engine/archexpr.js` says in its own words
  that "nothing in the data ties an archetype to a mask."
- **The unmerged Compass branch does not change this.** Its engine work is a
  diagnostic and a hero journey. The rest of it is research documents, and its
  own cross-layer graph holds no address, fetter, sign or domain node.

So, in one line: the body half is wired; the sky half is computed beside it
and joined only through the domain a person picks by hand.

## The map, layer by layer

Each row says where the layer's data lives, what the run measured, and the
function that builds the edge to the layer beside it. "Graph" means whether
the trace graph carries that edge.

| Layer | Data | Measured on `3f09b595` | Edge to the next layer, and the code that makes it | Graph |
|---|---|---|---|---|
| Nerve | `NODES[].n`, `engine/data/nodes.js` | 108 of 108 body addresses carry a named nerve or plexus. The 4 field anchors (109 to 112) carry none | nerve sits on the address row itself | attribute `nerve` on the pattern node, `tracePatternAttrs` |
| Address | `NODES`, `W`, `FIELD` | 112 rows: 108 body (`W`), 4 field anchors, two above and two below | seated by `NODES[].b` (7 seats) | `pattern:<number>`, always `known` |
| Fetter | `NODES[].cf`, `CHARGES` | 9 fetters. 107 of 108 body addresses carry one. Address 8, `Root_08_Unnamed`, carries none (owner's open item, `CLAUDE.md`) | `traceFromRecord`, canonical membership: address `associated_with` fetter, `known` | yes. Address 8 and the 4 anchors never appear in any graph |
| Saboteur | `SAB33`, `SAB_LIB`/`ALL_SAB`, `engine/data/kb.js`, `core.js` | 33 range rows, 45 address rows, every address row resolves | `compute()`: `sab33Detect` (seat plus the saboteur's own charges) and the `ALL_SAB` address route (fixed address groups at 3.7 or more, `sabFetters` band check) | `pattern supports saboteur`, only when a reading is passed in |
| Complex | `r.cxs` | measured 11 on a record with all nine axes at 7 | `compute()`: two saboteurs of one family (`hcx`) paired | `saboteur supports complex`, reading only |
| Hyper complex | `HCX_LIB`, `FAM_POLE`, `r.hys` | 6 families plus 6 overshoot poles | `compute()`: two complexes of a family, or one at 6.5 or more | `complex supports hyper_complex`, reading only |
| Super complex | `r.sups` | measured 1 on the same record | `compute()`: hyper complexes paired by weight rank at `SUP_W` 5.6 | `hyper_complex supports super_complex`, reading only |
| Psychopathy (the one named super complex) | `DESCENT` pair, `r.psychopathy` | not reached on the probe record | `compute()` asks for the Grandiosity and Predatory hyper complexes by name, wherever they rank, and never pushes into `sups` | **no**. `TRACE_CHAIN_OF` reads `sups` only, so the named one is never a graph node |
| Masks | `MASKS`, `MASKS_READ`, `engine/data/canon.js` | 5 read (Professional hidden) | `compute()` `maskRing`: the mean `sq` of each mask's seats. Read off addresses, **not off any rung** | no type |
| Archetype | `ARCH`, `engine/data/canon.js` | 12, each with a ruled seat `ARCH[i].b` | two wirings that disagree (below) | no type |
| Domain (blueprint) | `DOMAINS`, `AFFIN`, `engine/data/canon.js` | 19 domains under 4 roots | `buildSoul` lays a ring, `suscAll` sets every address's susceptibility off it (below) | no type |
| Birth chart | `engine/astro.js`, `engine/birth.js`, `engine/numerology.js` | sun, moon, rising, design gate, gene key, life path, year animal and element | **none into the layers below**. `converge` and `rootOverlap` only compare and summarise | no type |
| Sign to charge | `ASTRO_OVERLAY`, `engine/data/registers.js` | 12 signs, 12 animals, 12 archetype vectors, a `load_map` to a charge | **none, by canon lock**. Read only by `codesCheck` and `regDiff` | no type |

`TRACE_NODE_TYPES` holds no type for domain, archetype, sign, placement, mask
or character. Character is refused by name, on the 23 October ruling that it
is the whole reading and not a node.

## Where the chain is real

**Address to super complex, in the arithmetic.** Each rung keeps the rung
below it as its `parts`, so the chain is not inferred after the fact: it is
the data structure `compute()` returns. `engine/compute.js`, the block from
`const sabs=[]` to `const sups=[]`.

**Address to super complex, in the graph, when asked.**
`traceFromRecord(p, intents, reading)` adds the four rungs and one `supports`
edge per part the reading counted, all `inferred`, each one saying it is a
registration and not a cause. Measured on a blank record with all nine axes at 7
(the field `tests/trace.js` TG11c loads, without its stories, meter and
rituals): 23 saboteurs, 11 complexes, 3
hyper complexes, 1 super complex, nothing refused, and this path:

    pattern:1 supports saboteur:Control Freak
      supports complex:Control Freak + Hyper-Vigilant
      supports hyper_complex:Rigidity
      supports super_complex:Grandiosity / Rigidity

Walked without direction it reaches the fetter too: `pattern:fetter:Fear` is
`associated_with` address 1, so fetter to super complex is five steps.

**Story to address to fetter, in the graph, always.** Every graph the product
builds carries the story, the impression the sniffer read off it, the
addresses it placed charge at, the fetters it named, the person's own Yes
answers, the release lines opened and the rituals done.

**Domain to address, in the arithmetic.** `suscAll` in `engine/compute.js`:

    n.susc=(0.40+0.60*DOMAIN[arc])*prox;

`DOMAIN` is the 19 slot ring `buildSoul` (`engine/core.js`) lays from the
picked domains, roots and archetypes, and `prox` is 1.3 where the address's
fetter is one of `AFFIN`'s pairs for a root the person runs (Architect:
Apathy and Shock; Engine: Anger, Shame and Disgust; Weaver: Sad and Surprise;
Witness: Fear and Anticipation). `compute()` multiplies every address's held
charge by `n.susc`. Measured: the same record moved from Knowledge (Architect)
to Descent (Engine) changed the reading at 98 of 108 addresses, and changed
the saboteurs, the hyper complexes, the super complex and the first and second
archetype. This is the one celestial link that is wired, and it is real.

**Compass position from the body.** The 8 mirror pairs each sit at a seat, and
`compassAt` (`engine/data/compass.js`) reads a person's place on each axis off
that seat's load and integrity. Real, read at render time, not in the graph.

**Source AI, the intelligence, reads the chain one way.** `srcHyperSeats` in
`engine/sourceai.js` walks each hyper complex down through its complexes and
saboteurs to the seats its addresses sit at, and uses that to rank its
questions. It reads no domain, archetype or birth data, by its own ruling (it
"never names an address, a fetter or a saboteur to the person"). Its evidence
ledger, `engine/evidence.js`, maps its states onto the graph's provenance
words and says: "Nothing here writes the graph yet."

## Where it is partial

**The product's graph has no chain in it.** `ui/character.js` line 317,
`engine/daily.js` line 989 and `engine/loop.js` line 78 are the only callers of
`traceFromRecord` outside tests, and none passes a reading. Measured: the same
record read with no reading holds zero rung nodes. `trace.js` records this
deliberately at `TRACE_ALG` ("no graph the product builds or stores holds a
rung, because a day's graph is read with no reading"). So "the graph has every
nerve to super complex record" is true of the graph engine and false of every
graph a person's screens are drawn from.

**Psychopathy is not a graph node.** The one named super complex lives in
`r.psychopathy`, kept out of `r.sups` on purpose so it does not move the
counts. `TRACE_CHAIN_OF` reads `sups` only, so even a graph built with a
reading carries `super_complex:Grandiosity / Predatory` when the generic
pairing happens to make it, and never the named Psychopathy. Sociopathy is the
same: the graph would carry `hyper_complex:Predatory`, and the name Sociopathy
is attached only by `descentHeld` inside the dark read.

**The upper rungs have three vocabularies.** Recorded precisely, not resolved:

- `compute()` names its hyper complexes by family: Grandiosity, Predatory,
  Collapse, Rigidity, Dysregulation, Dissociation, and their overshoot poles.
- `DESCENT` (`engine/data/compass.js`) names four structures: Narcissism a
  complex, Machiavellianism and Sociopathy hyper complexes, Psychopathy a
  super complex built from the Grandiosity and Predatory pair (ruled 26
  October). Only Sociopathy (`fam`) and Psychopathy (`pair`) are tied to what
  `compute()` builds. Narcissism and Machiavellianism are chosen by depth in
  `darkRead`, not by the chain.
- `CODE_STRUCT` (`engine/data/codes.js`) codes canon.json's 23 complexes and 9
  hyper complexes, and files Psychopathy (X26) as a hyper complex. Its own
  header says nothing in `compute()` or `trace.js` reads it. Of the six family
  names `compute()` builds as hyper complexes, two appear in `CODE_STRUCT`,
  and both are filed there as complexes: Rigidity (X09) and Collapse (X12).
  So the same word sits on two different rungs in two tables.

The Psychopathy disagreement is already flagged in `codes.js` (its header,
under "structure") and ruled for `DESCENT` in `DECISIONS.md`. It is noted
here only because it decides which name a graph node would carry if the named
super complex were ever added to the graph.

**Archetype to body has two wirings, and they disagree.** The ruled seat
(`ARCH[i].b`, "the warrior's root, the sage is crown, the mage is third eye")
is what `archExpr` reads. The ring `buildSoul` lays places archetype j at
position (j/12) times 19 on the domain ring, and `suscAll` reads that ring by
address slot. Measured, by which seat each archetype alone lifts most: Warrior
and Innocent agree with their ruled seat, the other ten do not (Sage, ruled
Crown, lifts Sacral; Magician, ruled 3rd Eye, lifts Heart; Everyman, ruled
Root, lifts Crown). `engine/archexpr.js` states the same disagreement in its
header ("disagree with its ruled seat for ten of the twelve"), which this run
reproduced independently. So the archetype a person picks changes charge at
seats that are not the archetype's own.

## Where a layer exists and is not connected

**Birth chart to anything below it.** `spiritualOf` (`engine/birth.js`)
computes the chart off `engine/astro.js`'s real sky. Two mappings that could
bridge it exist in `engine/data/people.js`: `ELEM2ROOT` (sun element to root)
and `LP2ARCH` (life path to archetype). Both are read only by `converge` and
by `ui/drills.js` and `ui/summary.js`, to print whether the chart agrees with
what the person picked. The picks themselves (`S.doms`, `S.arcs`, `S.roots`)
are written only by the person's clicks (`ui/panels.js`, `ui/ui.js`), by a
worked example loading (`ui/personas.js`, `ui/practitioner.js`), by undo, and
by `loadProfile` from `p.soul`. Measured, reproduced rather than inferred:

- the birth record survives the boundary (`validateProfile` keeps `who.born`);
- two births, 25 March 1980 in Los Angeles (Aries sun, Engine root, life path
  1) and 2 November 1991 in London (Scorpio sun, Weaver root, life path 6),
  on otherwise identical records: 0 of 108 addresses moved, same saboteurs,
  hyper complexes, super complex and archetypes;
- a birth against no birth at all: the same, 0 moved.

The probe was checked against a known moving case first: the domain change
above moved 98 addresses through the same function, so the zero is a real
zero and not a probe that cannot see.

**Sign to charge.** `ASTRO_OVERLAY` is the only table in the engine that joins
a sign to a charge. It is locked display only by canon.json, and nothing but
the codes gate and `regDiff` reads it. Two of its charge words, joy and
resent, are not fetters here (`CODE_UNMAPPED` says why), so it could not be
wired as it stands even if the lock were lifted.

**The natal systems among themselves.** `rootOverlap` (`engine/overlap.js`)
is real and careful: it finds where Western, Eastern, numerology and Human
Design agree, through element and planet bridges, weighed by chance. It
returns a summary and joins to no domain, archetype or address.

**Super complex to masks to archetype.** Not joined. The masks are computed
from seat averages beside the chain, not above it. And `compute()` has a
second thing called mask, `const mask=sups[0]||hys[0]||cxs[0]||sabs[0]`, the
heaviest top rung, which is a different object from the five `MASKS`.

## Two structural defects found on the way

These are mine to report under the schema seat, and neither changes the
verdict.

**A blueprint nobody picked is read as a pick.** `loadProfile` and
`validateProfile` (`engine/schema.js`) fill a missing `soul` with
`{doms:[0], arcs:[0,1], roots:[]}`: Knowledge, under the Architect root, with
Warrior and Sage. Nothing on the record says it was filled. Because the domain
drives susceptibility, everyone who never opens the domain picker is read with
Apathy and Shock addresses taking 1.3 times the charge. The laws had exactly
this problem and solved it with unset marks (`core.js`, the `LAW_DEFAULT`
note: "an unmeasured law is a default and flatters the score"). The soul has
no such mark.

**One word, two things: blueprint.** In `engine/data/gloss.js` and the domain
picker, blueprint is "the pattern you started with", the 19 domains. In
`engine/data/compass.js`, `BLUEPRINT` is the Decoherent Blueprint, the four
figures at the bottom of the descent (Malak, Baal, Set, Lucifer), drawn under
the heading "The blueprint, where the downward cone ends" in `ui/drills.js`.
That breaks the one word per concept rule, on exactly the word this question
turns on.

## The unmerged Compass branch, checked against the repository

`origin/atuned/compass-foundation-closure-20261026`, last commit `598236f1`
on 29 October, is not an ancestor of this worktree's HEAD. Neither is
`08af6d63`, the merge of it into `fix/machiavellianism-kind-mapping-2026-10-29`,
nor `origin/claude/compass-thirteen-rb`, nor
`origin/atunED/paradiso-compass-map-v0-2026-10-25`. The branch is 235 commits
past its merge base with HEAD (`a682ceaa`, 24 October).

What it actually changes, read off the diff and not its own summaries:

- **In the engine:** 13 files under `atuned_src/`, 455 lines added. A
  diagnostic (`engine/diagnostic3.js` and its data) and a hero journey
  (`engine/hero_journey.js` and its data), with small edits to `schema.js`,
  `journey.js` and `avatar.js`. No poles, no deep psyche table, no native
  archetype table, no celestial link.
- **Everywhere else:** research under `docs/data/` (Compass, Inferno,
  Purgatorio, Paradiso), JSON and markdown, none of it in this worktree and
  none of it read by `atuned_src/`.
- **Its own cross-layer graph,** `COMPASS_CROSS_LAYER_GRAPH_V1.json`, holds
  teachers, mirror inverses, Paradiso spheres, Purgatorio terraces, vices and
  capacities, the 12 core archetypes, archived Inferno sources, the 21 laws and
  the 8 Compass axes, with 300 edges, most marked proposed or candidate. It has
  no address, nerve, fetter, sign or domain node, so even merged it would not
  join a nerve to anything celestial.
- **Its 19 domain to deep psyche file** stamps itself
  `AUTHENTICATED_AUTHOR_SOURCE_ID_JOIN_NOT_CANON_OR_RUNTIME` and names no
  fetter, address, nerve or sign.
- **"14 poles"** traces to a plan in `DESIGN-teachers.md` for an
  `engine/data/teachers.js`. That file is absent on HEAD and on all three
  branches checked. HEAD holds 8 mirror pairs, 3 home poles and 14 teacher
  recipes (`TEACHER_RECIPES`), which may be where a count of 14 came from; this
  audit did not confirm what the handshake meant by it.

## Gaps named as tasks, not built

Each is scoped so it can be picked up alone. The first three are additive and
need no version bump. The rest wait on a ruling.

1. **Hand the reading to the product's graph.** The three callers in
   `ui/character.js`, `engine/daily.js` and `engine/loop.js` would pass
   `read(p).reading` so the graph a person's screens are drawn from carries the
   chain. Additive: `traceFromRecord` already accepts it, the gate already
   holds it, and `TRACE_ALG` stays 4 by its own comment. Cost: one `read()` per
   graph build, and the drawer and loop surfaces would start showing rungs, so
   it needs a look at which plan may see them (`sightR` in `ui/lock.js`).
2. **Carry the named super complex.** Add `r.psychopathy` to the graph as a
   `super_complex` node with its two hyper complex parts, without moving
   `r.sups`. Needs the naming decided first (task 4), so the node's id is the
   name the owner ruled.
3. **Mark a defaulted soul.** An additive field beside `p.soul` (or unset
   marks, the way the laws carry them) so a filled default is told apart from a
   pick. Older records read as unknown, never as picked. No version bump: v1
   still loads.
4. **One vocabulary for the upper rungs.** Owner's call: whether the compute
   families, `DESCENT` and `CODE_STRUCT` are one ladder, and where Rigidity and
   Collapse sit (hyper complex in the engine, complex in canon.json).
5. **One place for an archetype in the body.** Owner's call: the ruled seat
   or the ring position. Today the pick lifts the wrong seat for ten of twelve.
6. **One meaning for blueprint.** Owner's call, with the voice seat.
7. **Whether the birth chart should reach the body at all.** Owner's call,
   with three ways it could go:
   - leave it as a mirror that is compared and never counted, which is what is
     built and what canon.json's lock says;
   - let the chart suggest a domain and archetype (through `ELEM2ROOT` and
     `LP2ARCH`) that the person confirms, so the sky seeds the pick without
     ever entering a number on its own;
   - let it enter the arithmetic directly, which would mean lifting a lock that
     its own permutation test set at p = 1.000, and is not recommended.
8. **What a mask is computed from.** Owner's call: his stack puts masks above
   the super complex; the code reads them off seats beside the chain.

## How this was measured

The engine was built with `sh atuned_src/BUILD-engine.sh <scratch>/engine.js`
and compared with `cmp` against the committed `engine.js`. A read only probe
loaded it in node and did four things: counted the tables
(`NODES`, `W`, `CHARGES`, `SAB33`, `ALL_SAB`, `HCX_LIB`, `DESCENT`,
`CODE_STRUCT`, `DOMAINS`, `ARCH`, `TRACE_NODE_TYPES`); built a record with all
nine axes at 7 through `validateProfile`, read it with `read()`, and built
`traceFromRecord` with and without the reading, then walked `tracePath` from
an address to the top rung; read the same record under two domains and under
two births and counted addresses whose `sq` moved; and, for each archetype
alone, compared mean susceptibility by seat against the archetype on the far
side of the ring. Branches were compared with `git merge-base --is-ancestor`
and `git diff --stat` from the merge base, and the branch's own JSON was read
with `git show`, not from its summaries.
