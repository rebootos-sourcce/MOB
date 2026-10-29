# Purgatorio Oscillation — Research and Technical Direction

## The behavioral mechanism

Purgatorio is the **swing**. Limiting beliefs pull conduct toward one expression while conscious intention and moral-integrity capacity pull toward another. An observed behavior is the evidence, not a spiritual judgment. Each terrace is a distinct loop in the middle of the Compass: **cue → belief → energetic movement → action → consequence → reframe/practice → action again**. A user can oscillate on one or several loops; the metaphor does not require visiting terraces in a fixed order.

In Dante's design, pride, envy and wrath are misdirected love; sloth is insufficient love directed toward the good; avarice, gluttony, lust are disproportionate attachment to secondary goods. The arrangement is explicit in Purgatorio XVII–XVIII (see UT Austin Danteworlds, Sloth). ATUNED translates this into dynamic behavior; it does not assert that the original poem establishes psychological laws.

## No new coherence formula

The live engine already reports CQ through the 21 moral-integrity laws and binds an `Oscillating` tier to 41–50 (while the overall median waist is 40–60). Purgatorio displays the region and adds **direction**, with real behavioral evidence, rather than trying to transform an individual's behavior into a vice based on a number. The unit tested adapter accepts the computed CQ as input and modifies nothing. No extra “Purgatorio points”, no pseudo-scientific frequency readouts.

## Core data contract

For each terrace, three separate records share a family and reference each other: `purgatorio:P01` (terrace), `purgatorio:P01-V` (limiting-belief expression), `purgatorio:P01-C` (constructive expression). `P00` and `P08` represent the narrative entry and exit. Every record carries the same 21 keys as the normalized Inferno Super-Complex-compatible record `template`, plus four deep passes, sources, discriminants, and graph relationships. Polarity references are reciprocal. The Inferno IDs are known and preserved. The Purgatorio IDs are not engine-native kinds and must not be registered as `supercomplex` in the generator.

## Transition API

`readPurgatorio(registry, coherence, events)`:

- `registry`: versioned descriptive registry.
- `coherence`: existing `compute().CQ`, range 0–100; this reader **does not compute CQ**.
- `events`: chronological or unordered records `{terraceId, poleId, observedAt, evidence}`; any event missing recorded text, a valid pole/terrace or a valid time is ignored. No unverified behavior is created.
- Returns median region; all seven terraces; per-terrace counts of observed vice/capacity behaviors; `turns` representing actual change between poles; most recently observed pole. No automatic assignment based on mere CQ.

Persistence, profile ownership, and a UI are absent from this package. They must be connected to current app storage and journey evidence, not created as a second ledger.

## Journey design

**Entrance / recognition:** user recognizes a first-person belief without being called a sinner. **Seven lanes:** each shows a trigger, the belief and its energy movement, an example in everyday life, and the virtue as practiced capacity. **Practice:** one short behavior an ordinary person can complete. **Return:** record what was actually different; a swing backward can be observed without shame or resetting prior evidence. **Exit / integration:** a pattern can be observed, interrupted and approached by choice; the image is a transition to Paradisio, not a certificate of moral perfection.

## Research sources

- UT Austin Danteworlds Pride — https://danteworlds.laits.utexas.edu/purgatory/03pride.html
- UT Austin Danteworlds Envy — https://danteworlds.laits.utexas.edu/purgatory/04envy.html
- UT Austin Danteworlds Wrath — https://danteworlds.laits.utexas.edu/purgatory/05wrath.html
- UT Austin Danteworlds Sloth — https://danteworlds.laits.utexas.edu/purgatory/06sloth.html
- UT Austin Danteworlds Avarice and Prodigality — https://danteworlds.laits.utexas.edu/purgatory/07avarice.html
- UT Austin Danteworlds Gluttony — https://danteworlds.laits.utexas.edu/purgatory/08gluttony.html
- UT Austin Danteworlds Lust — https://danteworlds.laits.utexas.edu/purgatory/09lust.html
- UT Austin Danteworlds Ante-Purgatory — https://danteworlds.laits.utexas.edu/purgatory/01antepurgatory.html
- UT Austin Danteworlds Terrestrial Paradise — https://danteworlds.laits.utexas.edu/purgatory/10terrestrialparadise.html
- Princeton Dante Project seven Ps — https://dante.princeton.edu/cgi-bin/dante/DispToynbeeByTitOrId.pl?INP_ID=214356&SMALL=0
- Yale Institute of Sacred Music, seven terraces — https://www.ismreview.yale.edu/climbing-the-mountain-of-the-beatitudes
- Association for Behavioral and Cognitive Therapies, thoughts/behaviors — https://www.abct.org/get-help/what-is-cognitive-behavioral-therapy/
- NCBI Bookshelf, belief/automatic thought definitions — https://www.ncbi.nlm.nih.gov/books/NBK470241/

## Safeguards and discriminants

Behaviors are context dependent and do not define the whole person. Do not infer moral failure from poverty, illness, consensual sexuality, anger about genuine harm, rest, medical need, or enjoyment. The pairs are descriptive working models for user choice and discovery, not diagnoses or a normative sexual doctrine. Personal journal evidence remains private under existing ATUNED permissions.