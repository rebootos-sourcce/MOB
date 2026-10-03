/* What the three anatomy passes found, as data, so the page counts what it
   draws instead of carrying typed numbers. Nothing here is new research.

   Sources, all read, none re-run except where said:
     BI3a  Heart and Throat, addresses 49 to 75. Per address verdicts, and
           the nesting table written into onetoone.js (NEST_STRICT).
     BI3b  3rd Eye and Crown, 76 to 108. Atlas positions in MNI millimetres
           from measure_out.json, the figure mapping from measure5.py.
     BI3c  Root, Sacral and Solar, 1 to 48. Per address findings from
           findings.py, and the "Across the 48" tables.
   The three reports are the research seats' own hand backs, summarised in
   TASKS.md under BI3a, BI3b and BI3c. The measurement files sit in the
   session scratchpad named in each report. */

/* ---------- view 1: names with no real structure behind them ---------- */
/* kind 'none'   the name is not a real structure (BI3c class D, BI3a
                 "no standard structure", BI3b not a named structure or not
                 an established term)
   kind 'myth'   not anatomy in any sense (BI3b, 108 only) */
const NOSTRUCT=[
 {i:12,kind:'none',src:'BI3c',why:'Describes a region. No nerve goes by this name.',
  near:'Nerve to levator ani, which with the pudendal nerve supplies the pelvic floor'},
 {i:16,kind:'none',src:'BI3c',why:'No structure has this name, and the cord ends at L1 to L2, well above the base of the spine.',
  near:'Conus medullaris, the tapered end of the cord'},
 {i:27,kind:'none',src:'BI3c',why:'No source uses this name. Read literally, splanchnic nerve roots are in the chest.',
  near:'Sacral splanchnic nerves, or the pelvic splanchnic nerves, which are already 21'},
 {i:28,kind:'none',src:'BI3c',why:'Names a real fact, that the lumbar and sacral plexuses share the L4 nerve. Not a structure.',
  near:'Lumbosacral trunk'},
 {i:32,kind:'none',src:'BI3c',why:'No source and no reference list uses this name.',
  near:'Perineal nerve, a branch of the pudendal nerve'},
 {i:37,kind:'none',src:'BI3c',why:'No source defines it.',
  near:'Lesser or least splanchnic nerve, or the celiac ganglion'},
 {i:46,kind:'none',src:'BI3c',why:'In anatomy, epigastric names arteries and veins, not nerves.',
  near:'Front skin branches of the T7 to T9 thoracoabdominal nerves'},
 {i:47,kind:'none',src:'BI3c',why:'No source uses this name.',
  near:'Hepatic branches of the anterior vagal trunk'},
 {i:52,kind:'none',src:'BI3a',why:'The chest is the one region where spinal nerves form no plexus.',
  near:'Thoracic aortic plexus'},
 {i:56,kind:'none',src:'BI3a',why:'No nerve has this name. The lateral costal branch is an artery.',
  near:'Lateral cutaneous branches of the intercostal nerves'},
 {i:71,kind:'none',src:'BI3a',why:'No source uses it for a structure. Searches lead to the pharyngeal plexus instead.',
  near:'Arytenoid plexus, or Galen’s anastomosis, inside the larynx'},
 {i:85,kind:'none',src:'BI3b',why:'A descriptive phrase, not a named structure.',
  near:'Optic radiation'},
 {i:90,kind:'none',src:'BI3b',why:'Not an established term. The real link between the two leaves the skull, runs down to the upper chest and comes back up through the neck.',
  near:'None of its own. The pineal (80) and the hypothalamus (103) are already addresses'},
 {i:98,kind:'none',src:'BI3b',why:'Not an established term, and it looks invented. One review, from a publisher whose standing could not be confirmed, proposes something similar.',
  near:'None found'},
 {i:99,kind:'none',src:'BI3b',why:'A real brain network, spread from front to back. A pattern of activity, not one structure.',
  near:'Its hubs, such as the posterior cingulate, which is already 95'},
 {i:108,kind:'myth',src:'BI3b',why:'Not anatomy. Found only on New Age meditation pages, as a pillar of light built in meditation.',
  near:'None'}];

/* ---------- view 2: one real structure, more than one address ---------- */
/* sure 'named'   identical name, or a synonym a source states
   sure 'reading' the research seat's own reading: the names cannot be
                  told apart, but no source says they are one */
const SAME=[
 {s:'Obturator nerve',ids:[10,20],sure:'named',how:'Identical name',src:'BI3c'},
 {s:'Pudendal nerve',ids:[2,19],sure:'named',how:'Internal Pudendal Nerve is its older name',src:'BI3c'},
 {s:'Pelvic splanchnic nerves',ids:[5,24,21,30],sure:'named',how:'5 and 24 share a name. 30 runs in these nerves',src:'BI3c'},
 {s:'Inferior hypogastric plexus',ids:[3,26],sure:'named',how:'Identical name',src:'BI3c'},
 {s:'Iliac branch',ids:[7,31],sure:'reading',how:'The research could not tell the two apart',src:'BI3c'},
 {s:'Celiac plexus',ids:[33,36],sure:'named',how:'Identical name',src:'BI3c'},
 {s:'Hepatic plexus',ids:[47,48],sure:'reading',how:'Read by the research as the liver’s nerve supply',src:'BI3c'},
 {s:'Cardiac plexus',ids:[49,55],sure:'named',how:'One structure under two spellings',src:'BI3a'},
 {s:'Vagus nerve',ids:[51,65],sure:'named',how:'Identical name',src:'BI3a'},
 {s:'Accessory nerve',ids:[69,73],sure:'named',how:'Spinal Accessory Nerve is its other common name',src:'BI3a'}];

/* one structure inside another. BI3a's nine are its strict reading
   (onetoone.js NEST_STRICT). BI3b's are its nesting table. BI3c names
   nesting in passing and does not count it, so only its two explicit
   "inside" lines are carried. */
const INSIDE=[
 {region:'Heart and Throat',src:'BI3a',rows:[
  [53,'is a branch of',57],[57,'is a branch of',64],[54,'is part of',50],
  [61,'is part of',51],[63,'is part of',49],[62,'arises from',72],
  [66,'is a branch of',65],[67,'is a branch of',65],[74,'is a branch of',75]]},
 {region:'3rd Eye and Crown',src:'BI3b',rows:[
  [89,'sits inside',93],[93,'sits inside',94],[106,'is nearly all of',94],
  [104,'sits inside',102],[86,'sits inside',103],[80,'is part of',105],
  [101,'is part of',105],[92,'sits inside',96],[83,'sits inside',87],
  [95,'is a hub of',99]],
  also:'82, 91, 95, 97 and 102 are all cortex, so each sits inside 94 and 106 as well. 76, 79, 83, 85 and 82 lie along one visual pathway. 90, 98 and 100 are an axis, an axis and a tract that run through other addresses.'},
 {region:'Root, Sacral and Solar',src:'BI3c',rows:[
  [29,'sits inside',3],[39,'sits inside',38]],
  also:'29 sits inside 26 as well, since 3 and 26 are one plexus. This pass named nesting where it met it and did not count it.'}];

/* the headline chain, drawn over the head on the plate */
const CORTEX={outer:94,twin:106,mid:93,inner:89};

/* ---------- view 3: where the structure is, measured ---------- */
/* Head. MNI millimetres from the second pass's atlases (measure_out.json,
   and the left and right hippocampus split from the same Harvard-Oxford
   labels 102 and 110). z is height, x is the person's right (+) to left.
   Placed on the figure with that pass's own mapping (measure5.py): the top
   of the skull under the topknot, figure height 4.2, is the Colin27
   vertex, and the middle of the drawn ear, figure height 12.0, is the
   Colin27 ear points. */
const HEADMAP={ytop:4.2,year:12.0,vertexZ:100.2,earZ:-48.0,head:'Colin27',
 browZ:-20.85, /* halfway between the nasion (-40.0) and the forehead point Fpz (-1.7) */
 nasionZ:-40.0};
const HEAD=[
 {i:107,pts:[[2.0,77.0]],what:'Along the midline under the top of the skull',
  today:'Above and right of the skull. Never shown',
  bar:'At the Crown, where it is filed',
  note:'Measured at the top of the brain on the midline, which the sinus runs along'},
 {i:104,pts:[[27.0,-14.9],[-25.4,-15.0]],what:'Deep at ear level, one on each side',
  today:'Above the head. Never shown',
  bar:'Nearer the 3rd Eye marker than the Crown it is filed at'},
 {i:96,pts:[[0.6,-34.0]],what:'The base of the skull, the lowest structure in the head',
  today:'On the top edge of the figure, beside the topknot. Cut off',
  bar:'Nearer the 3rd Eye marker than the Crown it is filed at'},
 {i:79,pts:[[0.5,-19.4]],what:'On the midline, level with the brow',
  today:'Just off the right edge of the head. Cut off',
  bar:'On the brow line, where the 3rd Eye text puts the seat'},
 {i:80,pts:[[0.6,1.0]],what:'The centre of the head, at brow height',
  today:'Just off the left edge of the head. Cut off',
  bar:'At brow height. Which seat owns it waits on the rule for seats'}];

/* Torso. Vertebral levels sourced by the first and third passes, placed
   with the product's own seat anchors as the ruler (practice.js FLOWSEAT
   and PMBANDS): Heart T4 to T5 at 30.51, Solar T12 to L1 at 40.21, Sacral
   L5 at 47.02, and Root, "the base of the spine", at 53.55. Vertebrae are
   counted C1 = 1 through the tailbone = 30. */
const RULER=[[11.5,30.51,'T4 to T5','Heart'],[19.5,40.21,'T12 to L1','Solar'],
 [24,47.02,'L5','Sacral'],[30,53.55,'the tailbone','Root']];
const TORSO=[
 {ids:[49,55],s:'Cardiac plexus',lv:[11.5,11.5],side:0,
  what:'One spot on the midline, at the Heart marker: the 4th and 5th chest vertebrae, at the aortic arch',
  today:'Two spots: right of the heart, and high on the left chest',
  bar:'One plexus, one spot, on the Heart marker'},
 {ids:[33,36],s:'Celiac plexus',lv:[19.5,19.5],side:0,
  what:'One spot on the midline, at the Solar marker: the last chest and first lower back vertebrae, behind the stomach',
  today:'Two spots: right of the Solar marker, and below it toward Sacral',
  bar:'One plexus, one spot, on the Solar marker'},
 {ids:[1],s:'Lumbar plexus',lv:[20,23],side:2.2,
  what:'Both sides of the lower spine, L1 to L4, inside the psoas muscle. Above the Sacral marker',
  today:'At the crotch, below the Root marker',
  bar:'Between the Solar and Sacral markers. Root, where it is filed, is below both'},
 {ids:[6],s:'Coccygeal plexus',lv:[30,30],side:0,
  what:'The tailbone, which is the base of the spine, at the Root marker',
  today:'On the hip, right of the midline',
  bar:'At Root, where it is filed'}];

module.exports={NOSTRUCT,SAME,INSIDE,CORTEX,HEADMAP,HEAD,RULER,TORSO};
