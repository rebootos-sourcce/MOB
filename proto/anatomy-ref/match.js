/* Which chart point stands for which address, and why.

   Nothing here matches by name. The two systems were never built to share
   names (BI1), so a chart point stands for an address only through anatomy:
   the structure the point sits on, as docs/research/marma-validation.md
   checked it against published dissection, and the structure the address
   names in engine/data/nodes.js, as the three anatomy passes read it (BI3a,
   BI3b, BI3c, and their tables in proto/anatomy-check/research.js).

   tier 1  the point and the address are the same structure, or the address
           is the nerve of the very thing the point names.
   tier 2  the address lies straight under the point on a front view and
           serves what the point names, but is not the structure the point is.
   Both are scored, and scored apart, so a tier 2 match never props up a
   tier 1 number.

   Side is not scored. Every structure below is on the midline or has a copy
   on each side, and the Body page draws one mark per address on a side
   chosen to spread the marks, not by anatomy (CG Q3, still open). So an
   address is measured against the nearer of the chart point and its mirror
   across the midline. */
const MATCH=[
 /* ---------- tier 1 ---------- */
 {ids:[49,55], pts:['m.hridaya','112.sternal'], tier:1,
  why:'Hridaya is the cardiac plexus, checked against dissection (marma-validation item 8), and the 112 chart labels its point T4 to T5, the plexus\'s own level'},
 {ids:[75], pts:['m.kaksha','112.axilla'], tier:1,
  why:'Kakshadhara, the front of the armpit, is the brachial plexus cords round the axillary artery (item 16). The 112 chart calls the same place the axillary gateway'},
 {ids:[65], pts:['112.manya'], tier:1,
  why:'Manya is the carotid and the vagus nerve, and its injury takes the voice (item 6). The 112 chart\'s "vocal cords pillars" is the pasted document\'s Manya. The marma chart\'s own Nila and Manya line is illegible'},
 {ids:[66,67,71], pts:['112.manya'], tier:1,
  why:'The same point read by its organ, the vocal cords. The superior and recurrent laryngeal nerves and the plexus inside the larynx are the vocal cords\' own nerves'},
 {ids:[54], pts:['m.stanamula','112.breast'], tier:1,
  why:'Stanamula sits in the space between the ribs under the breast, and the 112 chart names that space outright. The intercostal nerve runs in it'},
 {ids:[58], pts:['m.apastambha'], tier:1,
  why:'Apastambha is the air carrying channels, read as the bronchi, and the document\'s "lung nerve plexus" checks out in substance (item 9). The pulmonary plexus rides the bronchi into the lung. The 112 chart\'s bronchi point is drawn on the arm and is not used'},
 {ids:[18], pts:['m.vitapa'], tier:1,
  why:'Vitapa is the spermatic cord with the ilioinguinal nerve and the genital branch of the genitofemoral nerve, checked (item 20)'},
 /* ---------- tier 2 ---------- */
 {ids:[53,62,63], pts:['m.hridaya','112.sternal'], tier:2,
  why:'Pericardial, great cardiac and coronary: the heart\'s own nerves, under Hridaya, but not the plexus the point names'},
 {ids:[56], pts:['m.apalapa'], tier:2,
  why:'Apalapa, the side of the chest under the armpit (item 10). Address 56 names no real nerve; its nearest real one, the side branches of the intercostal nerves (BI3a), surface along exactly this line'},
 {ids:[64], pts:['112.matrika'], tier:2,
  why:'The cervical plexus comes out from under the sternocleidomastoid, which the 112 chart names at this point. The marma chart points at Matrika only as a group'},
 {ids:[69,73], pts:['m.amsa','112.trapezius'], tier:2,
  why:'Amsa is the top of the shoulder on the trapezius, and the 112 chart names the trapezius. The accessory nerve is that muscle\'s nerve, but runs across the neck to reach it'},
 {ids:[84], pts:['m.krikatika','112.occiput'], tier:2,
  why:'Krikatika is where the skull meets the spine (item 5). The greater occipital nerve surfaces beside it, rising toward the inion'},
 {ids:[50,59], pts:['m.brihati','112.T4'], tier:2,
  why:'Brihati sits beside the spine between the shoulder blades; the 112 chart labels it T4. The thoracic nerves and the sympathetic ganglia leave the spine there'},
 {ids:[38,39,43,45], pts:['m.parshva','112.kidney'], tier:2,
  why:'Parshvasandhi is the flank at the waist beside the spine (item 14), which the 112 chart calls the kidney gates. The renal and suprarenal plexuses and the adrenal sit on the kidney under it'},
 {ids:[44], pts:['m.nabhi','112.navel'], tier:2,
  why:'The navel sits at L3 to L4 (item 11), and the inferior mesenteric plexus sits on the aorta at L3, under it. The document\'s own claim, that Nabhi is the celiac plexus, is at the wrong level and is not used'},
 {ids:[3,26,22], pts:['m.basti','112.belly'], tier:2,
  why:'Basti is the bladder, above the pubic bone. The inferior hypogastric plexus serves it from beside it; the superior hypogastric plexus sits above it at the front of the sacrum'},
 /* added on the second pass, once the first had shown the Basti place held */
 {ids:[5,24,21,30,29], pts:['m.basti','112.belly'], tier:2,
  why:'The pelvic splanchnic nerves (5, 24, 21 and 30 name them, BI3c) are the bladder\'s own motor nerves, and the pelvic ganglia sit inside the inferior hypogastric plexus beside it'},
 {ids:[2,19,11,32], pts:['m.guda'], tier:2,
  why:'Guda is the anus. The pudendal nerve and its perineal branch serve its sphincter and the perineum round it; 32\'s nearest real nerve is that perineal branch (BI3c)'},
 {ids:[12,6], pts:['112.floor','m.guda'], tier:2,
  why:'The 112 chart names its lowest spine point the pelvic floor. The nerve to the pelvic floor (12\'s nearest real nerve, BI3c) and the coccygeal plexus sit at the bottom of the sacrum and the tailbone'},
 {ids:[17,28,4,13], pts:['m.kukundara','112.sacral'], tier:2,
  why:'Kukundara, the dimples over the sacroiliac joints, is tied to the nerve trunk feeding the sciatic nerve (item 13): the lumbosacral trunk (28\'s nearest real name, BI3c) and the sacral plexus, whose roots leave the sacrum just inside the dimples'},
 {ids:[14,9], pts:['m.katika','112.katika'], tier:2,
  why:'Katikataruna, the middle of the buttock. The sciatic and gluteal nerves leave the pelvis under it. A reading from the location; the research did not check this point'},
 {ids:[107], pts:['112.vertex'], tier:2,
  why:'The top of the brain on the midline, under the vertex. The 112 chart draws its vertex on the forehead, which this measures honestly as far'},
 {ids:[79,76], pts:['112.glabella'], tier:2,
  why:'The optic chiasm lies straight behind the brow on a front view'}];

/* The seven seat markers, measured the same way and never moved by this: a
   seat's place is the seat boundary ruling, BR Q1, which is the owner's. */
const SEATS=[
 {k:'crown', pts:['112.vertex'], why:'Adhipati, the crown. The marma chart\'s own Adhipati line is illegible'},
 {k:'eye', pts:['112.glabella'], why:'Sthapani, between the brows. Illegible on the marma chart'},
 {k:'heart', pts:['m.hridaya','112.sternal'], why:'Hridaya, the heart'},
 {k:'solar', pts:['m.nabhi','112.navel'], why:'The navel. The seat\'s own text puts Solar below the ribs and above the navel, so this reads how far above it sits, not a miss'},
 {k:'sacral', pts:['m.basti','112.belly'], why:'Basti, above the pubic bone. The seat\'s own text says below the navel'},
 {k:'root', pts:['m.guda','112.floor'], why:'Guda and the pelvic floor'}];

/* Pairs of points the two charts both draw, for the same place. How far
   apart they land on our figure is the floor under every number here: no
   address can honestly be claimed closer to "the chart" than the two charts
   are to each other. */
const AGREE=[
 ['m.hridaya','112.sternal'],['m.nabhi','112.navel'],['m.basti','112.belly'],
 ['m.kaksha','112.axilla'],['m.stanamula','112.breast'],['m.amsa','112.trapezius'],
 ['m.krikatika','112.occiput'],['m.brihati','112.T4'],['m.parshva','112.kidney'],
 ['m.katika','112.katika'],['m.kukundara','112.sacral']];

module.exports={MATCH,SEATS,AGREE};
