/* The two reference charts the owner sent on 26 September, read into numbers.

   refs/112-node-chart.png     1024 x 559, "Advanced # 112-node Energetic
                               Architecture", a front and a back figure.
   refs/marma-points-chart.png 550 x 494, a classical marma chart, front and
                               back, labelled in Sanskrit.

   Every x and y below is a pixel in the image named, read two ways that had to
   agree: a dot finder (a solid dark disc three to seven pixels across, found
   by flood fill, see find.py beside this) for the dots it could see, and a zoomed crop
   with a five pixel grid, read by eye, for the dots it could not (a circle
   drawn open, a dot under a leader line, the lower resolution marma scan).
   Which leader line ends at which dot was read by eye from the crops. Where
   it could not be read, the point says so and is not used.

   A LANDMARK IS SOMETHING EVERY FIGURE HAS, INCLUDING OURS. The Body page draws
   a silhouette and nothing inside it: no navel, no nipples, no face. So a
   chart is carried onto our figure only through things a silhouette shows on
   all five figures alike, and the chart's own navel and nipples are then a
   result to look at, not an input:
     V  top of the skull          E  middle of the ear
     N  the neck at its narrowest S  the base of the neck, where the
                                     outline first runs a quarter wider
                                     than the neck, into the shoulders
     C  the crotch, where the legs part
     F  the sole
   and three widths, read across the same five figures: the skull above the
   ears, the neck at N, and the waist at its narrowest (wy, its height). The
   skull and the waist set the scale across; the neck is read and printed, and
   measure.js says why it is not used.

   Our own figure's numbers are in measure.js beside the code that reads them
   off BODYPATH, so nothing here is typed from the product.

   ok:false marks a point that is on the chart but cannot stand for anything
   on a body: the chart draws it on an arm or a hand while naming a place in
   the chest or the pelvis. They are kept, named, so the count of what was
   left out is a count and not a silence. */
const FIGS={
 /* 112 chart, front. Ears 89 to 108. Neck constant 116 to 130. Waist 234 to
    312 from 236 to 248. Legs part at 320.5. Toes end at 537. */
 '112F':{img:'112-node-chart.png', view:'front', mid:273,
  V:58.5, E:98.5, N:123, S:133.7, C:320.5, F:537, skull:48.5, neck:34, waist:78, wy:242},
 /* 112 chart, back. Drawn at the front's scale and height. Ears 88 to 106.
    The gluteal cleft meets the fold of the buttocks at 321. */
 '112B':{img:'112-node-chart.png', view:'back', mid:749,
  V:58.5, E:97, N:121, S:132.6, C:321, F:535, skull:48.5, neck:33, waist:79, wy:250},
 /* marma chart, front. Scanned at a lower resolution than the other, with
    the face under a knot of leader lines. Hair top 51.5, brows 80.6, chin
    107.5. The ear is not separable from the lines crossing it; 88 is the
    canon's ear, brow to nose base, and no point used below sits in the head,
    so it moves nothing measured. */
 'MF':{img:'marma-points-chart.png', view:'front', mid:179.25,
  V:51.5, E:88, N:113.5, S:119.1, C:288, F:468, skull:42, neck:31, waist:67.5, wy:212},
 /* marma chart, back. Ears 76 to 91, neck 421 to 450 from 100 to 108 (a line
    inside it at 424 to 447 is the trapezius, not the neck: read as the neck
    on the first pass, and it made this neck a fifth too thin), and the legs
    part under the buttocks at 270. */
 'MB':{img:'marma-points-chart.png', view:'back', mid:435.6,
  V:46, E:83.5, N:100, S:110.3, C:270, F:455, skull:42, neck:29, waist:68, wy:214}};

/* the chart's own words, then where. p is one point or a pair [a,b], each
   [x,y]. src says how it was read: dot (the finder found it), grid (read by
   eye on a grid crop), ring (the centre of a drawn circle). */
const PTS=[
 /* ---------- 112 chart, front ---------- */
 {id:'112.vertex', fig:'112F', w:'Cranial Vertex (Supreme Overlord Midline Crown). Its left label, Cortical Cortex Area, points at the same dot',
  p:[272.7,68.5], src:'dot',
  note:'Drawn on the upper forehead, ten pixels under the top of the skull, not at the top of the head the name says'},
 {id:'112.glabella', fig:'112F', w:'Glabella (Pillar of Stillness)', p:[272.9,82.3], src:'dot',
  note:'Five pixels above the drawn brows (87.5)'},
 {id:'112.sinus', fig:'112F', w:'Sinus Whirlpools (Calamity Whirlpools Pair)', p:[256.6,88.0], src:'dot', note:'Drawn on one side only'},
 {id:'112.eye', fig:'112F', w:'Lateral Eye (Outer Visual Edge Pair)', p:[[262.1,93.1],[283.5,93.7]], src:'dot'},
 {id:'112.palate', fig:'112F', w:'Palate Quad Junction Cluster (nasopharyngeal, palate, tongue, sensum)', p:[265,103], src:'grid',
  note:'Four dots in a knot beside the nose; the centre of the knot'},
 {id:'112.nostril', fig:'112F', w:'Lateral Nostrils (Serpent Hoods Pair)', p:[277.5,105.3], src:'dot', note:'Drawn on one side only'},
 {id:'112.jaw', fig:'112F', w:'Jaw (Jaw Gateways Pair)', p:[[259.6,115.6],[284.5,116.7]], src:'dot'},
 {id:'112.nila', fig:'112F', w:'Thyroid Lateral Neck (Cerulean Vessels Pair)', p:[[263.3,129.5],[282.9,129.5]], src:'dot'},
 {id:'112.manya', fig:'112F', w:'Vocal Cords Pillars (Throat Honor Pillars Pair)', p:[[265.6,135.4],[280.6,135.4]], src:'dot'},
 {id:'112.matrika', fig:'112F', w:'Sternocleidomastoid Group Cluster (Eight Neural Mothers, Matrika)', p:[[267.4,142.6],[279.0,142.5]], src:'dot'},
 {id:'112.sternal', fig:'112F', w:'Sternal Core T4-T5 (Sacred Heart Core)', p:[273.2,164.5], src:'dot'},
 {id:'112.axilla', fig:'112F', w:'Front shoulder gate (Axillary Gateway)', p:[218.5,176.0], src:'dot',
  note:'Drawn once, on the person\'s right, on the inside of the arm where it leaves the chest'},
 {id:'112.breast', fig:'112F', w:'Below Breast intercostal (Roots of Breast Pair)', p:[[243.2,197.5],[302.8,197.5]], src:'dot'},
 {id:'112.bronchi', fig:'112F', w:'Upper lung/bronchi 3rd intercostal (Upper Pectoral Uplifts Pair)', p:[325.5,212.7], src:'dot', ok:false,
  note:'The dot is inside the right upper arm (the trunk edge is at 317, the arm runs 319 to 344 on this row)'},
 {id:'112.costal', fig:'112F', w:'Sternal border costal cart. (Bronchial Pillars Pair)', p:[333.8,232.6], src:'dot', ok:false,
  note:'The dot is on the right forearm, nowhere near the sternal border it names'},
 {id:'112.navel', fig:'112F', w:'Navel (Origin Navel)', p:[273.2,254.5], src:'dot'},
 {id:'112.belly', fig:'112F', w:'Lower belly Fluid Reservoir (Midline above pubic symphysis)', p:[273.2,281.0], src:'dot'},
 {id:'112.lunar', fig:'112F', w:'111: Lunar / Receptive Flank', p:[313.9,293.9], src:'dot',
  note:'One of the pasted document\'s side points, not this product\'s field anchors (BI, research section 4)'},
 {id:'112.inguinal', fig:'112F', w:'Inguinal hinge (Luminal hinge)', p:[256.8,298.5], src:'dot'},
 {id:'112.thigh', fig:'112F', w:'Vast Thigh Channel (Left Thigh)', p:[[263.5,309.7],[282.7,309.5]], src:'dot'},
 {id:'112.groin', fig:'112F', w:'Crimson Groin Eye femoral (Lohitaksha)', p:[360.0,307.8], src:'dot', ok:false,
  note:'The leader line ends in the palm of the right hand'},
 {id:'112.pelvic', fig:'112F', w:'Deep Pelvic Viscera', p:[322,356], src:'grid', ok:false,
  note:'The leader line ends at the fingertips of the right hand'},
 {id:'112.earthstar', fig:'112F', w:'109: Subterranean Root Anchor (Earth Star)', p:[273.7,546.3], src:'dot',
  note:'Below the feet. The Body page draws the 108 addresses in the body and none of the four field anchors'},
 /* ---------- 112 chart, back ---------- */
 {id:'112.stellar', fig:'112B', w:'112: Transpersonal Crown Gateway (Stellar Gateway)', p:[748.8,46.6], src:'dot',
  note:'Above the head. Not drawn on the Body page, as above'},
 {id:'112.occiput', fig:'112B', w:'102: Occiput Atlas Fulcrum (Occipital Fulcrums Pair)', p:[749.0,101.5], src:'dot',
  note:'Drawn once, on the midline, though named a pair'},
 {id:'112.earlobe', fig:'112B', w:'108: Depressions behind ear lobes (Sonic Void / Agitation Pair)', p:[761.8,105.6], src:'dot', note:'Drawn on one side only'},
 {id:'112.trapezius', fig:'112B', w:'R3: Weight-Bearing Shoulders, trapezius ridge pair', p:[[704.5,152.7],[793.5,152.7]], src:'dot'},
 {id:'112.T4', fig:'112B', w:'T4: Interscapular (Brihati scapular roots pair)', p:[749,173], src:'grid',
  note:'A large dot on the midline, missed by the finder for its size, read off the rows: 171 to 175'},
 {id:'112.T5', fig:'112B', w:'T5: Center Scapular, Amsaphalaka scapular shield plate pair', p:[749,200], src:'grid',
  note:'A large dot on the midline, rows 198 to 202'},
 {id:'112.kidney', fig:'112B', w:'R4: Parshvasandhi kidney gates pair', p:[[731.8,246.2],[766.6,246.6]], src:'dot'},
 {id:'112.katika', fig:'112B', w:'Katikataruna SI anchors pair', p:[[727.6,258.8],[770.5,258.9]], src:'dot'},
 {id:'112.sacral', fig:'112B', w:'Ka: Sacral dimple, sacral dimples (Kukundara)', p:[[731.8,273.0],[766.5,272.7]], src:'dot'},
 {id:'112.solarflank', fig:'112B', w:'110: Solar / Ancestral Flank', p:[718.2,271.8], src:'dot',
  note:'The pasted document\'s other side point'},
 {id:'112.floor', fig:'112B', w:'Lower spinal midline Pelvic Floor point (Root Floor)', p:[749.2,290.4], src:'dot'},
 {id:'112.calf', fig:'112B', w:'132: Indrabasti, Low Calf', p:[781.7,294.5], src:'dot', ok:false,
  note:'Indrabasti is the calf, and the leader line ends on the buttock'},
 /* ---------- marma chart, front ---------- */
 {id:'m.avarta', fig:'MF', w:'Avartas', p:[158.9,65.6], src:'dot', note:'At the edge of the head above the brow'},
 {id:'m.apanga', fig:'MF', w:'Apanga', p:[159.0,80.0], src:'dot'},
 {id:'m.vidhura', fig:'MF', w:'Vidhura', p:[161.0,93.7], src:'dot'},
 {id:'m.face', fig:'MF', w:'Shankha, Utkshepa, Adhipati, Sthapani, Phana, Nila and Manya', p:null, src:'none',
  note:'Illegible. Seven leader lines cross the face and end in the hair or on the jaw with no dot at the end that can be told from the lines themselves'},
 {id:'m.matrika', fig:'MF', w:'Matrika', p:[177.8,111.2], src:'dot', ok:false,
  note:'One pointer, to the middle of the chin, for a group the text counts as eight points down both sides of the neck. It marks the group, not a place'},
 {id:'m.apastambha', fig:'MF', w:'Apastambha', p:[[168.9,129.0],[191.7,128.7]], src:'dot'},
 {id:'m.kaksha', fig:'MF', w:'Kakshadhara', p:[[147.8,147.8],[212.0,147.5]], src:'dot',
  note:'Labelled on the person\'s right; the left is the unlabelled mirror dot'},
 {id:'m.stanarohita', fig:'MF', w:'Stanarohita', p:[[158.8,153.7],[207.8,151.6]], src:'dot'},
 {id:'m.stanamula', fig:'MF', w:'Stanamula', p:[[159.2,168.6],[198.0,168.0]], src:'dot'},
 {id:'m.hridaya', fig:'MF', w:'Hridaya', p:[180.0,170.4], src:'ring'},
 {id:'m.apalapa', fig:'MF', w:'Apalapa', p:[[143.0,166.7],[213.8,165.5]], src:'grid'},
 {id:'m.nabhi', fig:'MF', w:'Nabhi', p:[180.3,225.0], src:'ring'},
 {id:'m.basti', fig:'MF', w:'Basti', p:[180.8,242.5], src:'ring'},
 {id:'m.lohitaksha', fig:'MF', w:'Lohitaksha', p:[[168.1,259.7],[191.7,259.7]], src:'dot'},
 {id:'m.vitapa', fig:'MF', w:'Vitapa', p:[[174.7,269.7],[185.3,269.8]], src:'dot'},
 {id:'m.guda', fig:'MF', w:'Guda', p:[180.8,275.3], src:'ring'},
 /* ---------- marma chart, back ---------- */
 {id:'m.krikatika', fig:'MB', w:'Krikatika. The Vidhura label points at the same pair', p:[[430.7,97.1],[441.7,97.4]], src:'dot',
  note:'Two labels, one pair of dots. Krikatika is the joint of head and neck, which is where these sit; Vidhura, behind the ear, is not separately drawn'},
 {id:'m.amsa', fig:'MB', w:'Amsa', p:[[398.9,118.3],[472.4,117.9]], src:'dot'},
 {id:'m.amsaphalaka', fig:'MB', w:'Amsaphalaka', p:[[407.8,138.7],[463.0,138.6]], src:'dot'},
 {id:'m.brihati', fig:'MB', w:'Brihati Shirah', p:[[430.4,153.6],[441.4,153.9]], src:'grid'},
 {id:'m.parshva', fig:'MB', w:'Parshva Sandhi', p:[[406.5,213.0],[466.3,212.2]], src:'dot'},
 {id:'m.nitamba', fig:'MB', w:'Nitamba', p:[[410.0,224.0],[463.6,223.3]], src:'dot'},
 {id:'m.kukundara', fig:'MB', w:'Kukundara', p:[[428.8,248.0],[443.5,248.0]], src:'dot'},
 {id:'m.katika', fig:'MB', w:'Katikataruna', p:[[407.7,264.9],[464.6,264.9]], src:'dot'}];

module.exports={FIGS,PTS};
