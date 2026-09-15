# THE PIPELINE, RUNNING

Working code. Not a spec. Hand this directory to the automation build.

## What is here

| File | What it does |
|---|---|
| `nodes.json` | 106 nodes, parsed from the manuscript. Node, charge, nerve, domain, wrong action, band, plain location. Canon distribution verified. |
| `extract.py` | Builds atomic content units from existing material. Writes nothing new. Every unit cites its source. |
| `gate.py` | The automated gate. Dash, node count, address, voice, substance. Rejects before a human looks. |
| `units.json` | 125 units, all gated PASS. |
| `schedule.py` | Turns gated units into a dated calendar per channel. |
| `calendar.md` | 216 posts across 12 weeks. |

## Run it

```bash
python3 pipeline/extract.py > pipeline/units.json
python3 pipeline/gate.py pipeline/units.json          # exits 1 on any reject
python3 pipeline/schedule.py 12 > pipeline/calendar.md
python3 pipeline/gate.py --text "any copy to check"   # single check
```

## The gate

Five checks. The first three are hard rejects.

**Dash.** Any em dash, in character or entity form. This rule has failed twice
in this project already, once across four of the five original little books
and once in the generator's ISBN fallback reaching all eleven volumes. It
fails in shared boilerplate nobody re-reads, which is exactly what an
automated check is for.

**Node count.** Says 114, which is superseded. Canon is 112: 108 in-body, 4 field.

**Address.** Any named nerve, plexus, ganglia, cortex, nucleus or axis must
exist in the node map. **This is the one that matters most.** Never
interpolate a somatic address. An invented address is the one defect that
would end this business, because the addresses are the product.

**Voice.** Banned words, which are the ones the cascade grammar records Lance
never using: apprehensive, fearful, panic-stricken, sick of. Soft wellness
language flags rather than rejects. Sentences over 34 words flag.

**Substance.** Every unit carries an address or a mechanism. A unit with
neither is inspiration, and inspiration does not go up.

## What the gate will not catch

It checks form, not truth. A unit can pass every check and still overclaim.
The evidence pass is a human job and stays one.

## Current state

```
125 units   ·   125 PASS   ·   0 FLAG   ·   0 REJECT
```

| Type | Count | Source |
|---|---|---|
| address | 106 | ch.36, one per in-body node with a confirmed address |
| correction | 8 | category assumptions the manuscript overturns |
| mechanism | 7 | the nine emotional architectures |
| case | 3 | real sessions, already anonymous in the manuscript |
| evidence | 1 | what is proven and what is not |

216 posts over 12 weeks, none newly written. The manuscript is 91,603 words
and the extraction has barely touched it. Address posts alone cover 106 of
the 112 nodes.

## Adding more

Three sources are untouched and each is large.

**The plates.** 45 scans of the handwritten notebooks. The strongest evidence
artifact in the project, because they show the work being done rather than
described. One field-note unit each, 45 units, needs the files.

**The newsletter archive.** 20 published issues. Each carries two or three
extractable units.

**The eleven volumes.** 99 charge-and-install spreads. Needs
`volumes/*.json`.

That is roughly 300 more units without writing a sentence.
