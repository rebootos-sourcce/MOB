---
name: atuned-anatomy
description: How to make the 108 somatic address positions (54 per side) and their nerve/plexus names anatomically precise, sourced and cited rather than eyeballed, and how to trace real nerve paths between them. Load before touching atuned_src/engine/data/figure.js (ANAT), atuned_src/engine/data/nodes.js's address nerve names, atuned_src/ui/map.js's BMPROP table, or any task scoped to body-map anatomical accuracy.
---

# Anatomical precision for the 108 addresses

This exists because the current table is not anatomically precise and the
project's own audits already proved it, address by address. This file is the
method for fixing that without inventing a second, competing set of rules,
and the running log of what real source material has confirmed so far.

## Where the 108 actually stand today. Read this before assuming anything is settled.

`atuned_src/engine/data/figure.js` is `ANAT`, the engine's trusted placement
table. Of the 108 somatic addresses:

    80   have a derived coordinate: 32 from real brain-atlas centroids
         (figure.js `h:`, Harvard-Oxford/Juelich/Neuromorphometrics, the
         "second anatomy pass" BQ), 6 from vertebral spine levels (`v:`,
         sourced in BI3a/BI3c), 41 from the two reference charts the owner
         sent 26 September (`f:`, figure.js:62-67, re-derived from the chart
         on every build by proto/anatomy-ref/measure.js, which fails the
         build if a row has drifted), 1 (108, Ascension Column) explicitly
         filed with no anatomy at all (figure.js:128, `at:'crown'`).
    28   have NO coordinate in the engine. They live only in
         atuned_src/ui/map.js:1443 as BMPROP, hand-researched guesses the
         comment there calls "the older and more cautious claim," kept out
         of ANAT on purpose. Moving a BMPROP row into ANAT is a ruling (it
         means trusting the guess as measured fact), never a mechanical
         port — map.js:46461-46464.

Ruled 26 September (figure.js:38-46): "place everything as close as it can,
precision but feel, roughly the right spot," and a plexus branches, so more
than one address may share one real place. That ruling is why today's table
is allowed to be approximate. This file's job is to replace "roughly" with
"sourced," not to overturn the ruling that a shared place is fine.

**The nerve NAMES are a separate, worse problem than the coordinates.**
`atuned_src/engine/data/nodes.js`: every one of the 108 somatic rows has a
non-null `n` (a specific nerve/plexus name) beside its seat label `b`. Three
regional audits (TASKS.md, BI3a addresses 49-75, BI3b addresses 76-108,
BI3c addresses 1-48) checked every one of those 108 names against real
anatomical reference identifiers (UBERON, FMA, SNOMED CT, an NIH atlas) and
found:

    14    name no real structure at all (one more, 108, isn't anatomy in
          any sense — found only on meditation pages)
    ~20   are real but ambiguous between two or more structures
    16    Root/Sacral addresses sit on only 7 real distinct structures
          (heavy duplication)
    3     exact duplicate pairs in Heart/Throat, plus 9 nested relationships
    5/33  of the HEAD addresses are actually nerves; the rest are brain
          tissue, one a vein, one nothing, though the table's own header
          claims every address sits "at a named plexus or nerve"

Three of the product's seven seat definitions are themselves anatomically
self-contradicted (Root, Throat, Crown), not just individual rows inside
them — the deeper problem sits above the row level. Full detail,
address by address: TASKS.md, search `BI3a`, `BI3b`, `BI3c`. Seven open
owner decisions are logged there too (Q1-Q7) and are not re-litigated here;
this file is the sourcing method, not the ruling on what to rename, split,
or merge.

**Known trap:** `proto/body-map-spec/gen.js:56-61` — `HEADY` (front-to-back
head depth) was computed once by the atlas pass and then dropped; the
engine kept only 2 of the 3 coordinates that pass produced. Check before
assuming a head placement is using everything that was actually measured.

## The method: landmark + proportion, not a pixel

The real precedent for "put a precise point on a flat body drawing" is not
a general anatomy atlas alone — it's how acupuncture point atlases solve
the exact same problem at a similar scale (WHO Standard Acupuncture Point
Locations, ~361 bilateral points). Their method, and the one this project
uses from here on:

1. **A fixed bony landmark** you can always find (a joint, a process, a
   named bone edge), never a screen pixel.
2. **A proportional measurement** from that landmark (a fraction of the
   distance to a second landmark), never an absolute unit — this is what
   makes a point reproducible on a figure of any proportions.
3. **A citation**: which real source, which plate or page, says so.

This is also the mechanism `proto/anatomy-ref/measure.js` already enforces
for the 41 `f:` rows — re-derives the figure coordinate from the source
chart on every build. Any new source added under this skill should be
checkable the same way: a human (or a gate) can trace a row back to the
page and landmark it came from.

**Nerve paths between addresses are a separate, harder step.** A straight
line between two addresses is wrong; real nerves curve along a known
course. A dermatome/nerve-distribution chart shows a nerve's TERRITORY, not
its physical path — don't conflate the two. Tracing a real path needs a
small number of guide points along the actual route, taken from the same
source as the endpoints, drawn as a curve.

## Four resolution tiers. Pick one before starting a pass, name which tier a change is in.

    1  Eyeball        (today's state for 28 addresses, and some of the 80
                       with wrong names). Free. Not defensible if challenged.
    2  Landmark-sourced   Every point gets a named bony landmark, a
                       measured fraction, and a citation to a real atlas
                       page. Cheap (labor only). Makes every point
                       defensible. THIS IS THE BASELINE — start here.
    3  Cross-checked  Tier 2, plus each point checked against a second
                       independent source (e.g. a dermatome chart), to
                       catch cases where the simple proportional rule
                       breaks on real anatomical variation.
    4  Clinically reviewed   A licensed medical illustrator or anatomist
                       signs off on the finished set. Real cost, real time.
                       Budget this for only the handful of points most
                       likely to be shown to a clinician or challenged
                       publicly — never all 108 by default.

## The six passes

    1  Inventory        one list of all 108: current name, current
                         coordinate status (ANAT vs BMPROP vs neither),
                         flagged wrong/ambiguous/duplicate per the audits
                         above. Mostly already done; keep it current.
    2  Atlas lookup      by region (head/neck, shoulder/arm, trunk,
                         abdomen/pelvis, leg — the book's own chapter
                         split). For each address: real plate, landmark,
                         proportional position, citation.
    3  Convert to our    turn each landmark into x,y on OUR figure's own
       figure            proportions (extend gen.js's h/v/f mechanism with
                         a new sourced type; never hand-type a pixel).
    4  Render and check  draw every updated point on our real front/back
                         figure, compare side by side against the atlas
                         plate. Catches points outside the body outline,
                         wrong left/right mirroring, wrong overlaps.
    5  Second-source     recheck each point against an independent source
       cross-check       (tier 3). Skip only where you've deliberately
                         chosen to stay at tier 2 for that address.
    6  Nerve paths       once points are solid, trace the real curved path
                         between addresses sharing a nerve trunk, from the
                         same source as the endpoints.

Six passes, five of them labor-only. That lands at tier 2-3. Tier 4 is a
seventh, optional pass, budgeted narrowly if at all.

## Source material log

A running record of what's been confirmed from real sources, so the next
session doesn't re-ask the same question or re-derive what's already found.

**Color Atlas of Anatomy, Rohen/Yokochi/Lütjen-Drecoll, 7th edition**
(Lippincott Williams & Wilkins / Wolters Kluwer, 2011; ISBN 9781582558561).
Real, cadaver-photograph-based, 1,211 figures. Owned by Lance (Google
Drive), copyrighted — use it to extract FACTS for our own coordinates,
never copy its images, captions or text into this repo.

**Head, neck and trunk, book p.1-256, fully indexed (2026-11-07, parts
01-03).** Deduplicated findings, by address region this project uses:

    p.31, 33-34   all 12 cranial nerves tabulated by their real skull
                  exit foramen (optic canal, superior orbital fissure,
                  foramen rotundum/ovale, internal acoustic meatus,
                  jugular foramen, hypoglossal canal) -- the single best
                  landmark-keyed reference for correcting Crown/3rd Eye,
                  whose own audit (TASKS.md BI3b) found only 5 of 33 head
                  addresses are actually nerves and the rest are brain
                  tissue wrongly claimed as "a named plexus or nerve."
                  Ten of the twelve cranial nerves attach at the
                  brainstem, confirmed here, none at the crown -- this
                  atlas plate is the citation that finding needed.
    p.77-78       parotid plexus (facial nerve CN VII branches)
    p.126         tympanic plexus
    p.165         pharyngeal plexus
    p.170-186     cervical and brachial plexus, built up over several
                  plates to the richest single plexus plate in the whole
                  book at p.186 (roots, cords, median/ulnar/
                  musculocutaneous/thoracodorsal/long thoracic/
                  suprascapular nerves), plus the sympathetic chain's
                  stellate ganglion (p.185), ansa cervicalis (p.182),
                  and two named SURFACE landmarks worth using directly:
                  Erb's point (p.178) and the punctum nervosum (p.77,
                  242), both already named points on skin, not
                  dissection-only.
    p.205         "Head's zones" -- a true dermatome/referred-pain map,
                  torso segments C3-L2 on a skin silhouette
    p.216-217     intercostal and thoraco-abdominal nerve roots
                  (iliohypogastric L1, ilioinguinal L1, genitofemoral
                  L1-L2) given as a clean root-level table, PLUS the
                  atlas's own named surface reference lines (sternal,
                  midclavicular, axillary lines; the transpyloric plane)
                  -- exactly the landmark set the Root/Sacral/Solar
                  addresses need, and those three seats are the ones
                  TASKS.md (BI3c) found most duplicated and worst defined
    p.226-242     back and nuchal region: cluneal nerves (L1-S3,
                  landmarked to the iliac crest and coccyx), the
                  suboccipital triangle (p.237, the key C1 deep landmark)

Found as real plates, not just named in text: cervical, brachial, parotid,
pharyngeal, tympanic and dental/alveolar plexuses, plus the solar/celiac
plexus dissected at p.18 (not a dedicated plate, but real and labeled).
**Not yet confirmed anywhere read: a dedicated cardiac plexus plate** --
only individual cardiac branches/nerves are named in this range. Worth
flagging if a Heart-seat address specifically needs it.

**The two plates this file originally existed to find are now both
confirmed, read, and cited** (2026-11-07, "Atlas_Retry_Part_5/6/7"):

**Brachial Plexus — book p.413** (`Atlas_Retry_Part_5.pdf`, PDF-internal
page 67; that file's printed range is 386-436, upper limb). Real cadaver
dissection, clavicle and pectoral muscles partly removed: roots C5-T1,
posterior/lateral/medial cords, and every terminal nerve (axillary,
musculocutaneous, median, radial, ulnar) traced out, paired with a
schematic that color-codes each cord against the scalenes/first
rib/clavicle. Surrounding plates worth citing by address: p.399
(radial/median/musculocutaneous/ulnar branch schematics), p.400
(cutaneous-nerve-territory map of the whole arm, roots C4-T1 labeled
directly on it), p.408-409 (the quadrangular and triangular spaces — the
atlas's own named surgical landmarks for the axillary and radial nerves
against teres major/minor and the triceps heads), p.416-418 (four
successive depth layers at the elbow, landmarked off the medial
epicondyle), p.431 (true axial cross-sections of the elbow and
mid-forearm, each paired with its own MRI slice — the single best depth
reference in the file).

**Lumbosacral Plexus — book p.470-475** (`Atlas_Retry_Part_6.pdf`,
PDF-internal pages 34-39; that file's printed range is 437-486, lower
limb only, no upper-limb content). p.470 is the schematic overview
(lumbar plexus L1-L4, sacral plexus L4-S4, pudendal plexus S2-S4,
bracketed together as the lumbosacral plexus). p.471 is the real
dissection, landmarked off the sacral promontory and pubic bone. p.475
("Spinal Cord and Lumbar Plexus") landmarks the plexus origin against the
posterior abdominal wall and gives a companion segmental-level schematic.
p.476-477 ("Surface Anatomy of the Lower Limb") pair a real intact-leg
surface photo with a dermatome map, landmarked off the iliac crest,
popliteal fossa, malleoli and patella — exactly the surface/landmark
pairing this skill's method calls for.

**The clearest worked example of this skill's own method, already in the
book — book p.482 (Gluteal Region).** The atlas draws the method itself:
a triangle between the posterior superior iliac spine, the greater
trochanter, and the ischial tuberosity, then states in its own words
where the sciatic nerve crosses it — "between the middle and posterior
third" of the tuberosity-to-trochanter line. That is a bony landmark plus
a proportional fraction, cited to a real plate, with nothing invented.
Use this plate as the template for how every other address's citation
should read.

Delivered in 7 files total, 2026-11-07 ("Part one" = `Anatomy_Atlas_90pg_01/02/03.pdf`,
fully indexed through book p.256; "retry" batch = `Atlas_Retry_Part_5/6/7.pdf`,
covering book p.347-532, including the index). All real PDFs, read
directly with the Read tool's `pages` parameter (max 20 pages/request).
Still not delivered: book p.~257-346 (the gap between the two batches --
likely thorax/abdomen viscera, not nerve-plexus territory based on the
chapter order either side of it, but unconfirmed; this is also the most
likely place a dedicated cardiac plexus plate would sit, which nothing
read so far has confirmed). A Drive-hosted copy of
the whole book exists but can't be pulled whole through this project's
Drive access: download caps at 10MB against this book's 43MB, and the
text-extraction tool truncates partway through (stopped at its own page
199 of ~520, not a fixed book boundary) — the direct file uploads above
are the real working channel, not the Drive copy.

**Used, 2026-11-12: four names corrected, one address placed.** Read
directly off the PDFs (text layer, plus the plate images for p.233 and
p.471): p.137 labels the optic radiation between the lateral geniculate
body and the visual cortex (85, was "Cortical Visual Pathway"); p.233's
adult median section puts the conus medullaris at L1, with p.230 and p.475
showing it (16, was "Spinal Cord Base", and moved from BMPROP into ANAT as
`v:[[20,0]]`); p.471 labels the lumbosacral trunk running past the sacral
promontory into the sacral plexus (28, was "Lumbar-Sacral Overlap");
p.214 and p.216 label the thoraco-abdominal nerves and their anterior
cutaneous branches, p.217 the epigastric region (46, was "Epigastric
Branches"). p.470 confirms ANAT's lumbar plexus level, L1 to L4. Not found
in any page read: the nerve to levator ani (12), the nerve to subclavius
(74), a stated vertebral span for the cauda equina (8). `measure.js`
re-derives only `f:` rows; nothing yet holds a `v:` row to its page.

**Used, 2026-11-13: one more name corrected, no address placed.** 56 was
"Costal Branches" (BI3a: no nerve has that name; the lateral costal branch
is an artery). p.207 (thoracic wall, anterior aspect, item 22) and p.214
(items 18 and 32) label the lateral cutaneous branches of the intercostal
nerves on the side of the chest, and p.400 draws their skin territory. That
is the single candidate BI3a gave and the structure 56's own ANAT row
(Apalapa) already drew, so only `n` moved. Every remaining BMPROP row was
checked for a sourced placement and none closed on the delivered pages:
the solar rows (35, 40, 41, 42, 47, 48) and 52 sit on book p.257-346,
the gap still not delivered (the index puts the mesenteric vessels at
p.302-308); every bilateral torso row (15, 23, 27, 57, 72, and others)
needs a distance from the midline, which `v:` takes in typed figure units,
the very thing this method forbids; 10 and 20 sit on the thigh, where no
sourced type reaches yet; 8 still has no stated vertebral span (p.230,
p.232 and p.233 label it but give no level for its lower end).

*(Extend this log, don't replace it, as more parts arrive or more pages
get confirmed. Cite page numbers as PRINTED in the book, not a PDF file's
own internal page index, which runs about 14 pages ahead of the printed
number once front matter is counted.)*
