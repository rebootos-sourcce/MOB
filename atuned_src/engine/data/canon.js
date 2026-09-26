
/* ============================================================
   SAB33 · the 33-saboteur library. Each row is
   [name, [[charge, lo, hi], ...]]. A range is a BAND, not a floor:
   below it the saboteur has not formed, above it the charge has
   escalated past this one into a heavier profile.

   PORTED 2026-09-20 FROM SNIFFER_SPEC.md SECTION 3, which the owner rules is
   canon and not a proposal. The shipped table and the spec's table carried the
   same 33 names in the same shape and disagreed on 17 of the 33 rows, so this
   is not a tuning change, it is two vocabularies being reduced to one.

   WHAT WAS WRONG WITH THE SHIPPED TABLE, measured before it was touched with
   proto/sniffer/sab.js rather than argued:

     17 of 33 rows carried different numbers or different fetters.
     5 rows changed arity. the spec gives Victim, Judge, Martyr and Control
       Freak a third fetter and reduces Innocent to one.
     2 rows keyed on `anxiety`, WHICH IS NOT ONE OF THE NINE AXES. core.js
       papered over it with `L.anxiety=L.anticipation`, so Avoider and Restless
       were being read off a term the instrument does not score.
     Apathy keyed NOTHING. The shipped table never mentioned apathy or
       anticipation, so one of the nine axes fired no saboteur at all while the
       spec keys twelve rows on it. That is the single largest thing this port
       fixes and no amount of retuning the other sixteen rows would have found
       it.

   KEYS ARE THE ENGINE'S OWN CHARGE VOCABULARY, lowercase, with the Sad axis
   spelled `sadness`, so CHG2SEAT and sabLevels keep working across the port
   with no change to either file. Anticipation is spelled out where the shipped
   table said anxiety. Nothing here is transliterated by hand twice: the same
   table is transcribed once more in proto/sniffer/bands.js and the gate asserts
   the two agree row for row, so a typo in one is a failure rather than a
   silent disagreement.

   WHAT THE PORT MOVES, measured on the 14 stated profiles in people.js with
   proto/sniffer/cohort.js. Every profile but Rosa reads differently. Ana's
   third saboteur goes from Judge to Manipulator, Derek loses Avoider
   altogether, and Lance goes from nothing to Innocent. Readings in this
   product have moved.
   ============================================================ */
var SAB33=[
 ["Negotiator",     [["fear",4,6],["apathy",3,5]]],
 ["Controller",     [["fear",7,10],["anger",5,8]]],
 ["Victim",         [["sadness",6,8],["anger",5,7],["apathy",2,5]]],
 ["Perfectionist",  [["disgust",5,7],["anger",4,6]]],
 ["Pleaser",        [["apathy",3,5],["fear",3,8]]],
 ["Hyper-Achiever", [["apathy",5,7],["fear",4,8]]],
 ["Hyper-Rational", [["shock",2,4],["disgust",3,6]]],
 ["Hyper-Vigilant", [["fear",7,9],["anger",5,7]]],
 ["Restless",       [["apathy",5,7],["fear",2,4]]],
 ["Stickler",       [["disgust",4,6],["anger",4,6]]],
 ["Judge",          [["disgust",6,8],["anger",5,7],["apathy",3,6]]],
 ["Deflector",      [["shame",4,6],["anger",4,6]]],
 ["Dramatizer",     [["shock",6,8],["sadness",4,6]]],
 ["Worrywart",      [["fear",6,8],["sadness",3,5]]],
 ["Loner",          [["sadness",6,8],["fear",5,7]]],
 ["People-Pleaser", [["apathy",4,6],["shame",3,5]]],
 ["Skeptic",        [["disgust",5,7],["shock",3,5]]],
 ["Dreamer",        [["apathy",3,5],["sadness",2,4]]],
 ["Procrastinator", [["fear",4,6],["sadness",3,5]]],
 ["Imposter",       [["shame",5,7],["fear",4,6]]],
 ["Aggressor",      [["anger",6,9],["apathy",4,7]]],
 ["Martyr",         [["sadness",6,8],["shame",5,7],["apathy",3,5]]],
 ["Cynic",          [["disgust",6,8],["sadness",4,6]]],
 ["Manipulator",    [["anger",5,8],["apathy",4,7]]],
 ["Overthinker",    [["fear",5,7],["shame",4,6]]],
 ["Escapist",       [["apathy",4,6],["fear",6,8]]],
 ["Nihilist",       [["disgust",7,9],["sadness",5,7]]],
 ["Innocent",       [["fear",2,4]]],
 ["Pessimist",      [["sadness",5,7],["fear",4,6]]],
 ["Catastrophizer", [["fear",8,10],["sadness",6,8]]],
 ["Enabler",        [["apathy",3,5],["shame",4,6]]],
 ["Control Freak",  [["fear",7,9],["anger",5,7],["anticipation",5,7]]],
 ["Avoider",        [["apathy",6,8],["fear",5,7]]]];

/* ============================================================
   THE BAND EDGE. Ruled: "a band edge is a ramp, not a cliff."

   The shipped rule, in core.js sabLevels and sab33Detect, was a three step
   staircase over a level ROUNDED TO AN INTEGER FIRST: full membership flat
   across the band, a half step at exactly one integer outside it, zero beyond.
   Two things follow from that and both are defects.

   The rounding means the spec's own example is not quite the bug. 6.9 and 7.1
   both round to 7, so they are in fact the same answer. The cliff is real and
   it sits at x.5, not at the band edge: 6.4 and 6.6 are different answers, and
   nothing about a body changes across a fifth of a point.

   And flat-inside cannot express "intensity peaks inside the band", which the
   spec states outright. A reading at the very edge of the band and a reading
   dead centre were the same number.

   EVERY WIDTH HAS A REASON. Measured with proto/sniffer/ramp.js, which checks
   itself against a known good case in both directions and refuses to run if
   either fails.

   SAB_EDGE 0.75   membership at the band edge. Not 1, because a peak needs
                   somewhere to fall to. Not lower, because the edge is inside
                   the band the canon states and must not read as half absent.
   SAB_BELOW 2     points under the low edge before membership reaches zero.
                   Two, so a reading ONE point under the band, which the spec
                   calls the normal condition of a reader, keeps half the
                   membership it would have had at the edge. One would put the
                   normal error at zero, which is the failure being fixed.
   SAB_ABOVE 3     points over the high edge before zero, wider than below on
                   the spec's own asymmetry, "tapers above it". The reason it
                   is asymmetric: the low edge is a threshold of PRESENCE and
                   under it the configuration has not formed, while the high
                   edge is a threshold of DISPLACEMENT and over it the
                   configuration HAS formed and is being overrun by a heavier
                   one. Evidence that decays is not evidence that never arrived.

   WHAT THE RAMP BUYS, AND WHAT IT DOES NOT. Stated plainly because the
   measurement did not say what this seat expected.

   It buys resolution. The largest move in confidence one tenth of a point of
   input can cause falls from 0.5000 to 0.0375, thirteen times finer. That is
   the whole of the "no practitioner reads a body to a tenth of a point"
   argument and it needs no cohort to establish.

   It buys steadiness. Mean absolute move in confidence under an off by one
   reading falls 9 to 15 percent.

   IT DOES NOT BUY SET AGREEMENT, and the first measurement said so: behind a
   hard floor the ramp scored 54.4 against the staircase's 58.8, WORSE. The
   finding is that a ramp inside the membership does nothing while the OUTPUT
   is still a cliff. The edge simply moved from the band to the floor. That is
   why sniffStory emits ranked confidence with no boolean firing set, and why
   this file carries no firing threshold at all.
   ============================================================ */
var SAB_EDGE=0.75, SAB_BELOW=2, SAB_ABOVE=3;
function sabMember(lvl,lo,hi){
 var m=(lo+hi)/2, h=(hi-lo)/2;
 if(lvl>=lo&&lvl<=hi) return h>0?1-(1-SAB_EDGE)*Math.abs(lvl-m)/h:1;
 if(lvl<lo)  return Math.max(0,SAB_EDGE*(1-(lo-lvl)/SAB_BELOW));
 return Math.max(0,SAB_EDGE*(1-(lvl-hi)/SAB_ABOVE));}

/* COMBINING THE FETTERS. The geometric mean, and the spec's own sentence is
   the argument: "a saboteur is a configuration of fetters at specific
   intensities. Break the co-mingling and the saboteur is gone." An arithmetic
   mean cannot go. On a three part row it averages 1, 1 and 0 to 0.67 and fires
   with one fetter entirely absent, and the shipped code used the arithmetic
   mean. It had no three part rows so it never showed; the port adds four, so
   this stopped being academic at the moment the table landed. */
function sabFetters(parts,L){
 var p=1;
 for(var i=0;i<parts.length;i++){
  var f=sabMember(L[parts[i][0]]||0,parts[i][1],parts[i][2]);
  if(f<=0) return 0;
  p*=f;}
 return Math.pow(p,1/parts.length);}

/* ============================================================
   SPECIFICITY. How much a row is worth once its fetters are read.

   TWO WEIGHTS, AND BOTH ARE DERIVED RATHER THAN TYPED.

   1. ARITY. A configuration naming one fetter is the least specific claim in
      the table and a configuration naming three is the most, so confidence
      scales with how much the row had to find. This is the same rule
      lexicon.js already applies to a bare axis noun taking its family floor:
      less specific evidence is worth less. It is also the fix for a defect the
      port introduced and this seat did not expect. The spec reduces Innocent
      to a single fetter, Fear 2 to 4, and a one part row beats a multi part row
      under ANY conjunctive combination because it has nothing to disagree with.
      Measured on the 14 stated profiles, Innocent reached the top three in 38.4
      percent of runs, which is the "fires on everything" shape the spec warns
      about, moved from Avoider onto Innocent by the port itself.

   2. AVOIDER, held low on the owner's ruling. The spec: "Avoider fires in 81
      percent of runs and costs 0.1 points. Weight it low or your sniffer will
      report Avoider on everything." The ruling is implemented. THE PREMISE IS
      NOT TRUE OF THIS POPULATION and it is raised rather than buried: measured
      on the ported bands over the 14 stated profiles, Avoider reaches the top
      three in 1.4 percent of runs, not 81. Whatever cohort produced 81 is not
      in this repository. The weight is applied because he ruled it; this seat
      reports that on the data here it suppresses a row that was already quiet,
      and that Innocent is the row his sentence actually describes.
   ============================================================ */
var SAB_ARITY={1:0.80,2:1.00,3:1.10};
var SABW={Avoider:0.55};
function sabWeight(nm,parts){
 return (SABW[nm]!==undefined?SABW[nm]:1)*(SAB_ARITY[parts.length]||1);}

/* THE CONFIDENCE, 0 to 1. Fetter membership times specificity, clamped,
   because a weight over 1 must not manufacture certainty. */
function sabConfidence(nm,parts,L){
 var f=sabFetters(parts,L);
 if(f<=0) return 0;
 return Math.max(0,Math.min(1,f*sabWeight(nm,parts)));}

/* the authored clinical composition per saboteur. the original carried this
   and never read it; it is the sub-line on every named saboteur drill now. */
var SABAUTH={
 'Hyper-Achiever':"Fear of being ordinary + Overwork + Worth tied to output",
 'Restless':"Intolerance of stillness + Novelty seeking + Avoidance",
 'Stickler':"Rigidity + Correction of others + Fear of disorder",
 'Judge':"Othering + Contempt + Certainty without evidence",
 'Worrywart':"Rehearsal of disaster + Fear + Illusion of preparedness",
 'Skeptic':"Pre-emptive doubt + Disgust + Refusal to be moved",
 'Dreamer':"Retreat into the possible + Sadness + Avoidance of the actual",
 'Aggressor':"Aggression + Cruelty + Self-importance",
 'Manipulator':"Covert control + Dishonesty + Fear of direct request",
 'Nihilist':"Refusal of meaning + Contempt + Despair worn as clarity",
 'Innocent':"Refusal to see + Shock + Deference",
 'Catastrophizer':"Terminal forecasting + Fear + Grief taken in advance",
 'Control Freak':"Anxiety + Micromanagement + Distrust of others' hands",
 'Imposter':"Shame + Anticipation of exposure + Discounting of evidence",
 'People-Pleaser':"Self-erasure + Fear of rejection + Approval as safety",
 'Avoider':"Fear of confrontation + Delusion + Laziness",
 'Bully':"Aggression + Cruelty + Self-importance",
 'Codependent':"Fear of abandonment + Lack of self-esteem + Dependency",
 'Controller':"Anxiety + Manipulation + Impatience",
 'Critic':"Self-hatred + Judgment of others + Perfectionism",
 'Cynic':"Doubt + Procrastination + Lack of effort",
 'Deflector':"Insecurity + Dishonesty + Pretending",
 'Dramatizer':"Craving for attention + Emotional instability + Exaggeration",
 'Enabler':"Need to be needed + Self-neglect + Overindulgence",
 'Escapist':"Overindulgence in fantasies + Apathy + Sensual desire",
 'Hero':"Pride + Overcommitment + Self-importance",
 'Hyper-Rational':"Dismissal of emotions + Arrogance + Skepticism",
 'Hyper-Vigilant':"Paranoia + Panic + Fear",
 'Intellectualizer':"Overanalysis + Detachment from feelings + Arrogance",
 'Loner':"Distrust + Fear of intimacy + Independence",
 'Martyr':"Self-pity + Resentment + Sacrificial over-giving",
 'Negotiator':"Doubt + Procrastination + Lack of effort",
 'Nonconformist':"Rebellion against norms + Pride + Isolation",
 'Overthinker':"Anxiety + Doubt + Procrastination",
 'Perfectionist':"Fear of failure + Excessive desire for wealth + Overindulgence",
 'Pessimist':"Nihilism + Hopelessness + Cynicism",
 'Pleaser':"Need for approval + Fear of rejection + Lack of moral dread",
 'Procrastinator':"Avoidance + Doubt + Fear of failure",
 'Rebel':"Resentment against authority + Pride + Hostility",
 'Savior':"Need to rescue + Self-importance + Neglect of own needs",
 'Victim':"Sadness + Self-loathing + Hopelessness"};

/* archetype rolls up from its primary saboteur. wired into the archetype drill. */
var ARCH18=[['Warrior','Controller','Solar'],['Caregiver','Pleaser','Heart'],
 ['Creator','Stickler','Throat'],['Sage','Hyper-Rational','3rd Eye'],
 ['Jester','Avoider','Sacral'],['Lover','Hyper-Vigilant','Heart'],
 ['Magician','Victim','Crown'],['Innocent','Restless','Root'],
 ['Outlaw','Judge','Solar'],['Ruler','Hyper-Achiever','Crown'],
 ['Explorer','Avoider','Sacral'],['Orphan','Worrywart','Root'],
 ['Hero','Hyper-Achiever','Solar'],['Everyman','Pleaser','Heart'],
 ['Mentor','Stickler','3rd Eye'],['Shadow','Judge','Solar'],
 ['Shapeshifter','Restless','Sacral'],['Healer','Hyper-Vigilant','Heart']];

const BANDS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
/* Hue is the language and does not move. Chroma comes down 30 to 40 percent on
   the warm three, which carry the arousal, and slightly on the cool four, which
   are already doing the calming work. Full chroma is reserved for ALARM.

   AND THE FAMILY NOW READS AS ONE. Ruled: "some of these colours are dull and
   some are vibrant, punch the dull ones up about ten percent, on the dark
   version." Three sat outside the group: Crown at 41 saturation, Heart at 43
   and Root at 46, against 54 to 57 for the other four. Each of those three
   takes ten points of saturation with hue and lightness held, which closes the
   spread from 17 points to 7. Contrast on the dark ground was checked after,
   and the lowest of the seven is Root at 4.8 to 1. */
const PAL={'Root':'#D6524C','Sacral':'#D8924E','Solar':'#DABF6A','Heart':'#5FD5A6',
 'Throat':'#5EBBDB','3rd Eye':'#7D93E0','Crown':'#A77EDB'};
/* THE THIRD PALETTE. Lumen puts paper under the rails and keeps the centre
   stage at 101010, and its whole brief is vibrancy, so neither of the other
   two fits: the dark palette is invisible on paper and the Snow palette is
   deepened ink, which is the opposite of what was asked for. Full chroma,
   chosen to hold on paper and on the black stage both. */
const PAL_VIVID={'Root':'#F02E3C','Sacral':'#FF7A00','Solar':'#C79200','Heart':'#00A85C',
 'Throat':'#0091C4','3rd Eye':'#3D5AFE','Crown':'#9B27E8'};
const PAL_LIGHT={'Root':'#9B4B47','Sacral':'#8E6231','Solar':'#7E6C29','Heart':'#2A7A5C',
 'Throat':'#2C6F88','3rd Eye':'#4C5F9E','Crown':'#6E5490'};
const GOLD='#7EB8D4', ALARM='#FF2E1F';   /* the accent. blue, ruled. */

/* the seat glyphs. the direction's vocabulary: each seat has a mark, so the
   ring can name where it sits without a word. */
const SEATGLYPH={
 'Root':'<path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z"/>',
 'Sacral':'<path d="M12 4c4 4 4 12 0 16-4-4-4-12 0-16z"/>',
 'Solar':'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
 'Heart':'<path d="M12 20s-7-4.5-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.5-7 9-7 9z"/>',
 'Throat':'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 3"/>',
 '3rd Eye':'<circle cx="12" cy="12" r="3"/><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/>',
 'Crown':'<path d="M12 3v18M3 12h18"/>',
 '_':'<circle cx="12" cy="12" r="7"/>'};

/* ============================================================
   THE NINE POLED AXES. Poles ruled 14 September 2026 for
   Anticipation, Surprise and Shock; the other six follow the same
   binary: a held state and its coherent opposite.
   ============================================================ */
const CHILD=[
 {nm:'Fear',        opp:'Trust',       addr:'Lumbar plexus',              loc:'lower back, gut',    seat:'Root',   ic:'M12 3l8 14H4z'},
 {nm:'Anger',       opp:'Equanimity',  addr:'Celiac plexus',              loc:'upper abdomen',      seat:'Solar',  ic:'M13 2L4 14h6l-1 8 9-12h-6z'},
 {nm:'Shame',       opp:'Worth',       addr:'Pudendal plexus',            loc:'pelvic floor',       seat:'Sacral', ic:'M5 20V9a7 7 0 0114 0v11M9 20v-6h6v6'},
 {nm:'Disgust',     opp:'Acceptance',  addr:'Sacral and dermis',          loc:'lower abdomen, skin',seat:'Sacral', ic:'M4 8c4 4 12 4 16 0M6 16c3-3 9-3 12 0'},
 {nm:'Apathy',      opp:'Vitality',    addr:'Shoulder girdle and throat', loc:'base of neck',       seat:'Throat', ic:'M4 12h16M4 7h16M4 17h16'},
 {nm:'Shock',       opp:'Groundedness',addr:'Prefrontal and dermis',      loc:'forehead, skin',     seat:'3rd Eye',ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-4.5 0a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0'},
 {nm:'Sad',         opp:'Joy',         addr:'Cardiac plexus',             loc:'centre chest',       seat:'Heart',  ic:'M12 20s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z'},
 {nm:'Surprise',    opp:'Readiness',   addr:'Upper chest and back',       loc:'upper torso',        seat:'Heart',  ic:'M12 3v18M7 7c-3 2-3 9 0 11M17 7c3 2 3 9 0 11'},
 {nm:'Anticipation',opp:'Presence',    addr:'Below the heart',            loc:'lower sternum',      seat:'Solar',  ic:'M12 4v11M8 11l4 4 4-4M6 20h12'}];
const CHARGES=CHILD.map(c=>c.nm);
/* Ten of the 33 are Shirzad Chamine's Positive Intelligence saboteurs, the
   Judge and its nine accomplices. They are marked so the product gives the
   source its due. The other 23 are SOURCE's own extension of the library. */
/* the six gate glyphs, 24 unit box, stroked. the eye open and shut for
   awareness and ignorance, the dot outside the ring for detachment, the
   raised arrow for intention, the link for attachment, the path bending
   around the dot for aversion. */
const GATEGLYPH={
 aware:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
 detach:'M10 14m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
 intent:'M12 20V5M6 11l6-6 6 6',
 ignore:'M2 12s4 5 10 5 10-5 10-5M6 15l-2 3M12 17v3M18 15l2 3',
 attach:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5',
 averse:'M3 19C3 9 21 9 21 19M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'};
const SAB_PI=['Judge','Avoider','Controller','Hyper-Achiever','Hyper-Rational',
 'Hyper-Vigilant','Pleaser','Restless','Stickler','Victim'];
/* Inferred saboteurs are clusters the library does not name: two or more
   addresses in one seat carrying the same child fetter. They take an agent
   noun for the fetter so they read alongside the named ones, and they carry
   the inferred flag everywhere they show. */
const INFER_NOUN={Fear:'Flincher',Anger:'Striker',Shame:'Hider',Disgust:'Recoiler',
 Apathy:'Drifter',Shock:'Freezer',Sad:'Mourner',Surprise:'Startler',Anticipation:'Bracer'};
/* routing from the node map's eight charge labels onto the nine child fetters */
const REROUTE={Fear:'Fear',Anger:'Anger',Shame:'Shame',Disgust:'Disgust',Sadness:'Sad',
 Shock:'Shock',Resentment:'Anger',Joy:'Apathy'};
const HEARTKEY=/LONGING|CLOSED HEART|REJECTION|RECEIV|UNWORTH|GRIEF|SORROW/i;
const SURPKEY=/SHOCK|BETRAYAL|OVERSENSITIV|STARTLE|PANIC/i;
const ANTKEY=/EXPECTATION|ANXIETY|WORRY|HYPERVIGIL|DREAD|ANTICIPAT|OBSESS|COMPULS/i;

const ROOTD=['Architect','Engine','Weaver','Witness'];
const ROOTCOL={Architect:'#7D93E0',Engine:'#D8924E',Weaver:'#5FD5A6',Witness:'#A77EDB'};
/* WHICH SEAT EACH ROOT WEARS. ROOTCOL above is these four seats' Dark values
   written out once, and that is the whole of why the root family failed on
   paper: Snow's domain icons measured 1.34 to 1 and Glass white's 1.59 against
   a 3 to 1 floor, because the four colours never learned which lighting they
   were drawn on. Naming the seat lets the rail ask seatCol, which does know.
   On Dark the answer is the same four hex values. ROOTCOL stays for the
   surfaces that still read it and for the export contract. */
const ROOTSEAT={Architect:'3rd Eye',Engine:'Sacral',Weaver:'Heart',Witness:'Crown'};
/* THE FOUR ROOTS HAD NO MARK. The owner: "I need icons for Architect, Engine,
   Weaver, Witness, I don't know why those don't have icons." They were built
   as bare text, and every other named family in the product wears a glyph.
   Ruled 26 September from the proto/rooticons board, the recommended set.
   Same grammar as the other families: 24 box, open stroke, no fill, drawn
   from what each root says rather than what the word sounds like, and checked
   against every glyph already in the build so none doubles an existing mark.
     Architect  a set square with its cut out. The Creator is an equal sided
                triangle on its base; the right angle and the inner cut keep
                the two apart at badge size.
     Engine     a flame with its inner tongue, the one thing that both starts
                and consumes. The open crown keeps it off the Sacral lens.
     Weaver     a confluence, two streams meeting and running on as one, which
                is "joins and dissolves" drawn. Taller than the box's usual
                6 to 18 on purpose: two lines carry less ink than a flame and
                read a size smaller beside it at the same height.
     Witness    a viewfinder's corners around a point: the frame holds the
                thing and never touches it. The eye was the obvious answer and
                it is taken twice, by the 3rd Eye seat and the awareness gate. */
const ROOTGLYPH={
 Architect:'M4 20V4l16 16z M8 16v-5.4l5.4 5.4z',
 Engine:'M12 21c-3.8 0-6.4-2.6-6.4-6.1 0-3.9 3-5.9 4-9.9 1.9 1.3 3.3 3.3 3.5 5.7 1-.8 1.7-2 1.8-3.4 2.3 1.9 3.5 4.6 3.5 7.6 0 3.5-2.6 6.1-6.4 6.1z M12 21c-1.5 0-2.5-1-2.5-2.5 0-1.6 1.2-2.6 2.5-4.1 1.3 1.5 2.5 2.5 2.5 4.1 0 1.5-1 2.5-2.5 2.5',
 Weaver:'M3 4.5c5.5 0 6 7.5 11 7.5h7 M3 19.5c5.5 0 6-7.5 11-7.5',
 Witness:'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5 M12 12m-1.7 0a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0-3.4 0'};
/* nineteen named blueprint domains under the four roots. the original header
   comment claimed eighteen with four unnamed; the data has always been
   nineteen named, and DARC divides by nineteen. */
const DOMAINS=[
 {nm:'Knowledge',  r:'Architect',d:'understanding as operating mode',      ic:'M4 6h7v13H4zM20 6h-7v13h7'},
 {nm:'Justice',    r:'Architect',d:'alignment with natural law',           ic:'M12 3v18M4 8h16M7 8l-3 6h6zM17 8l-3 6h6z'},
 {nm:'Imperium',   r:'Architect',d:'rulership through structure',          ic:'M3 19l3-12 6 6 6-6 3 12z'},
 {nm:'Duty',       r:'Architect',d:'obligation held without resentment',   ic:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'},
 {nm:'Fate',       r:'Architect',d:'the order you did not choose',         ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 3v9l6 4'},
 {nm:'Power',      r:'Engine',   d:'directed force. the warrior, not the king',ic:'M13 2L4 14h6l-1 8 9-12h-6z'},
 {nm:'Creation',   r:'Engine',   d:'bringing form from potential',         ic:'M12 12m-1 0a1 1 0 108 0 8 8 0 10-14 5'},
 {nm:'Dissolution',r:'Engine',   d:'releasing form back to potential',     ic:'M4 4h7v7H4zM15 15h5v5h-5M14 6h2M18 6h2M6 14v2M6 18v2'},
 {nm:'Descent',    r:'Engine',   d:'voluntary entry into shadow material', ic:'M12 3v14M6 12l6 6 6-6M4 21h16'},
 {nm:'Death',      r:'Engine',   d:'the ending that makes room',           ic:'M12 21V8M6 8h12M9 8V5a3 3 0 016 0v3M4 21h16'},
 {nm:'Connection', r:'Weaver',   d:'bond without dependency',              ic:'M9 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0M15 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0'},
 {nm:'Exchange',   r:'Weaver',   d:'reciprocal flow of value',             ic:'M3 9h15l-4-4M21 15H6l4 4'},
 {nm:'Restoration',r:'Weaver',   d:'return to coherent baseline',          ic:'M20 12a8 8 0 11-3-6M20 3v6h-6'},
 {nm:'Provision',  r:'Weaver',   d:'supplying what the other needs',       ic:'M4 9h16l-1.6 11H5.6zM8 9V6a4 4 0 018 0v3'},
 {nm:'Play',       r:'Weaver',   d:'unstructured creative exploration',    ic:'M2 15c3-7 5 7 8 0s5 7 8 0'},
 {nm:'Nature',     r:'Witness',  d:'observation without interference',     ic:'M12 21V9M12 9C9 9 5 7 5 3c4 0 7 2 7 6M12 11c3 0 7-2 7-6-4 0-7 2-7 6'},
 {nm:'Trickster',  r:'Witness',  d:'pattern disruption through paradox',   ic:'M4 18c4-10 12 10 16 0M4 8h.01M20 8h.01'},
 {nm:'Mystery',    r:'Witness',  d:'holding the unresolved without closing it',ic:'M9 9a3 3 0 115 2.2c-1 .8-2 1.4-2 2.8M12 18h.01'},
 {nm:'Guardian',   r:'Witness',  d:'watching over what cannot watch itself',ic:'M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6zM9 12l2 2 4-4'}];
/* THE DOMAIN MATRIX. root domain crossed against child fetter. 1.3x on the
   high-affinity pairs. this is what produces Distortion. */
const AFFIN={Architect:['Apathy','Shock'],Engine:['Anger','Shame','Disgust'],
 Weaver:['Sad','Surprise'],Witness:['Fear','Anticipation']};

/* EVERY ARCHETYPE IS SEATED. Ruled by the owner: "the primary and secondary
   archetypes are also associated with chakra colours. The warrior's root, the
   sage is crown, the mage is third eye, that kind of stuff."

   Three of the twelve are his and are written as he gave them. The other nine
   are placed by what the archetype does, which is the line already recorded
   beside each one, against what each seat governs: root is what you stand on,
   sacral what you want, solar what you carry, heart what you give, throat what
   you say, third eye what you see, crown what you belong to.

   This closes a standing rule rather than adding decoration. If it has a name
   it has an icon, the icon has a family, and the family has a colour. Twelve
   named things wore a mark and no family, so twelve distinct archetypes
   rendered in one accent. */
const ARCH=[
 {nm:'Warrior',  v:'moves on the threat',   b:'Root', ic:'M12 2l3 7h7l-6 4 2 8-6-5-6 5 2-8-6-4h7z'},
 {nm:'Sage',     v:'reads the situation',   b:'Crown', ic:'M4 6h7v13H4zM20 6h-7v13h7'},
 {nm:'Rebel',    v:'refuses the frame',     b:'Throat', ic:'M3 12h18M7 7l-4 5 4 5M17 7l4 5-4 5'},
 {nm:'Caregiver',v:'attends to the other',  b:'Heart', ic:'M12 21s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z'},
 {nm:'Creator',  v:'makes the thing',       b:'Sacral', ic:'M3 20l9-16 9 16z'},
 {nm:'Magician', v:'changes the conditions',b:'3rd Eye', ic:'M4 20L18 6M15 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z'},
 {nm:'Ruler',    v:'orders the field',      b:'Solar', ic:'M3 19l3-12 6 6 6-6 3 12z'},
 {nm:'Explorer', v:'goes to the edge',      b:'Sacral', ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M15 9l-2 6-4 2 2-6z'},
 {nm:'Lover',    v:'closes the distance',   b:'Heart', ic:'M12 21s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11zM12 8v13'},
 {nm:'Jester',   v:'breaks the tension',    b:'Throat', ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M8 10h.01M16 10h.01M8 15c2 2 6 2 8 0'},
 {nm:'Everyman', v:'stays with the room',   b:'Root', ic:'M12 8m-4 0a4 4 0 108 0 4 4 0 10-8 0M4 21c0-5 4-7 8-7s8 2 8 7'},
 {nm:'Innocent', v:'takes it at face value',b:'Crown', ic:'M12 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'}];

/* the 21 Laws of Moral Integrity, each seated at the band it governs. The
   book calls this set the Laws of Spiritual Integrity; the owner ruled moral,
   so moral is what the product says and BOOK-ERRATA.md carries the difference.
   integrity is not one aggregate: a closed law dims its own band. */
/* EVERY LAW WEARS ITS OWN MARK. Ruled: if it has a name, it has an icon, and
   the icon has a family and the family has a colour. The colour is the seat,
   which these already carried. The mark was missing, so all twenty one printed
   the glyph of their band and a person looking at the Laws deck saw seven
   glyphs for twenty one laws. Each is a physical metaphor drawn as an open
   stroke in a 24 box, never a fill, so it reads at badge size and inherits
   currentColor from the seat. */
const SI=[
 /* a plumb line. it hangs where it hangs and no opinion moves it. */
 {nm:'Truth',b:'Throat',ic:'M12 3v11 M9 17a3 3 0 006 0 3 3 0 00-6 0'},
 /* a pane. the light crossing it is the proof there is nothing behind it. */
 {nm:'Transparency',b:'Throat',ic:'M4 4h16v16H4z M8 20L20 8'},
 /* a beam balance, loaded on both arms, read at the fulcrum. */
 {nm:'Justice',b:'Throat',ic:'M12 4v4 M4 8h16 M4 8l-2 5h4z M20 8l-2 5h4z'},
 /* two rings that share their middle. neither is dissolved. */
 {nm:'Unity',b:'Crown',ic:'M10 7a5 5 0 100 10 5 5 0 100-10 M14 7a5 5 0 110 10 5 5 0 110-10'},
 /* a horizon, and the arc of what is above it. */
 {nm:'Awareness',b:'Crown',ic:'M3 16h18 M7 16a5 5 0 0110 0'},
 /* a branch. it divides by a rule it did not choose. */
 {nm:'Nature',b:'Crown',ic:'M12 21V6 M12 13L7 9 M12 16l5-4 M12 10l4-3'},
 /* one point, dead centre of the ring. nothing either side of now. */
 {nm:'Presence',b:'3rd Eye',ic:'M12 11.4v1.2 M4 12a8 8 0 1116 0 8 8 0 01-16 0'},
 /* a bowl. it holds because it sits below what it holds. */
 {nm:'Humility',b:'3rd Eye',ic:'M4 11h16 M4 11a8 8 0 0016 0'},
 /* a level, and the bubble reading centre. */
 {nm:'Equanimity',b:'3rd Eye',ic:'M3 10h18v4H3z M12 10v4'},
 /* two arcs leaning into each other, meeting under load. */
 {nm:'Compassion',b:'Heart',ic:'M12 19c-4-3-7-5-7-8a4 4 0 017-2 4 4 0 017 2c0 3-3 5-7 8'},
 /* a chain link opened. the load it carried is set down, not cut. */
 {nm:'Forgiveness',b:'Heart',ic:'M9 9H7a4 4 0 000 6h2 M15 15h2a4 4 0 000-6h-2'},
 /* a vessel, and what leaves it going up rather than out. */
 {nm:'Generosity',b:'Heart',ic:'M5 13a7 7 0 0014 0 M12 11V3 M9 6l3-3 3 3'},
 /* a frame and the arc that divides it where the eye already stopped. */
 {nm:'Aesthetic Beauty',b:'Heart',ic:'M3 6h18v12H3z M3 18a12 12 0 0112-12'},
 /* a spine under load, still upright. */
 {nm:'Courage',b:'Solar',ic:'M12 21V4 M8 8l4-4 4 4 M6 14h12'},
 /* a yoke on two posts. it is carried because it was taken up. */
 {nm:'Duty',b:'Solar',ic:'M4 8h16 M7 8v12 M17 8v12'},
 /* a weight, and the hands under it. */
 {nm:'Responsibility',b:'Solar',ic:'M4 9h16v5H4z M9 14v5 M15 14v5 M9 19h6'},
 /* a tally, closed with the mark that says it was read. */
 {nm:'Accountability',b:'Solar',ic:'M6 4v16 M18 4v16 M6 13h12 M9 8l2 2 4-4'},
 /* a measured pour. two vessels and exactly one measure between them. */
 {nm:'Temperance',b:'Sacral',ic:'M5 5h6l-3 6z M13 19h6l-3-6z M11 10l2 4'},
 /* a gap held open. both ends intact, neither pulling. */
 {nm:'Detachment',b:'Sacral',ic:'M3 12h5 M16 12h5 M10 7v10 M14 7v10'},
 /* a closed ring with the bar down. the hand is stopped, not raised. */
 {nm:'Non-Harm',b:'Root',ic:'M4 12a8 8 0 1116 0 8 8 0 01-16 0 M8 12h8'},
 /* an hourglass. the only thing it needs is the thing it cannot hurry. */
 {nm:'Patience',b:'Root',ic:'M7 4h10 M7 20h10 M7 4l5 8 5-8 M7 20l5-8 5 8'}];
const SINAMES=SI.map(l=>l.nm);
/* six masks. roster closed 14 September 2026. Young Adult out, Adult stands. */
/* THE SIX WEAR ONE FACE WITH SIX DIFFERENT SEAMS, which is the point: a mask
   is the same object every time and what changes is how much has been built
   onto it. The outline is identical across all six so the family reads at a
   glance, and the mark inside is what that stage added. */
const MASK_FACE='M4 9a8 6 0 0116 0c0 6-4 10-8 10S4 15 4 9z';
/* AND EVERY ONE OF THEM SAYS WHAT IT DOES. Ruled: "every named thing is
   described as a behaviour, not a label."

   The archetypes already carried a v, which is a behaviour: the Warrior moves
   on the threat. The masks carried a name and the two seats they sit at, and
   the Summary printed "Child, Root and Sacral", which is a label wearing a
   second label. A person reading their own mask needs to know what it does
   when it comes on, because that is the thing they can catch themselves at.

   Written in the present tense and in the second person's situation rather
   than about them, which is the difference between a description and a
   diagnosis. */
const MASKS=[
 /* one eye open. nothing has been added yet. */
 {nm:'Child',b:['Root','Sacral'],ic:MASK_FACE+' M12 10v1',
  v:'gets small so somebody else decides'},
 /* two. it has learned there is someone watching. */
 {nm:'Preteen',b:['Solar','Throat'],ic:MASK_FACE+' M9 10v1 M15 10v1',
  v:'checks the room before it says the thing'},
 /* a split down the middle, held together from outside. */
 {nm:'Teen',b:['Throat'],ic:MASK_FACE+' M12 6v13',
  v:'pushes back on the person, not the problem'},
 /* a seam across. the two halves are joined and the join shows. */
 {nm:'Adult',b:['Sacral','Solar'],ic:MASK_FACE+' M5 12h14',
  v:'handles it, and files what it cost'},
 /* a squared jaw fitted over the lower half. it was issued, not grown. */
 {nm:'Professional',b:['Solar','Throat'],ic:MASK_FACE+' M8 13h8v5H8z',
  v:'performs competence until the feeling passes'},
 /* a ring above the face, worn where a thought is kept. */
 {nm:'Ideological',b:['3rd Eye'],ic:MASK_FACE+' M9 4a3 3 0 006 0',
  v:'answers from the position instead of the moment'}];

/* ============================================================
   WHAT A LABEL OWES THE PERSON IT IS PUT ON.

   Ruled by the owner: when this product hands somebody a label,
   the label carries three things or it does not go on screen.
   A definition, so the word means something specific. The energy
   and behaviour, so a person can recognise it in their own week
   rather than take it on trust. And the direction, so a label is
   a position and never a verdict.

   The tiers go first because the engine hands five of the six
   reference ICPs a moral adjective and two of them the word
   Severe. A word like that with nothing attached is a judgement.
   The same word with a definition, a behaviour and a way out is
   a reading.

   THE COPY BELOW IS A DRAFT FOR THE OWNER TO RULE ON. The
   structure is settled. The wording is not, and the tier names
   themselves are his call: the panel found these four words are
   the single largest commercial item in the product.
   ============================================================ */
/* ============================================================
   THE SCALE. Ten bands, one word every ten points, and a range
   rather than a threshold.

   The owner's ruling. Seven tiers with uneven widths did not read
   as a nought to a hundred scale: Practicing was nineteen points
   wide, Collapsed was one, and no word told a person how much of
   the line it covered. Ten bands of ten each, so the word moves
   at every tenth point and a person can see the whole line in it.

   Forty to sixty is the median range. Fifty is the median exactly,
   and it sits at the top of Oscillating, which is the band named
   for crossing the line in both directions. A reading of forty is
   Incoherent and still inside the median range: one good week from
   the centre, which is a true statement and not a contradiction.

   Every band carries three things, on the ruling that a label this
   product puts on a person is a reading and not a judgement: what
   it is, what it does, and where it goes.
   ============================================================ */
/* THE STATE AND THE SOMATIC CONDITION, on the owner's grid.

   Ten states, one per band, mapped bottom to top. They say what the body is
   doing at that reading, which is the one thing the three existing fields
   did not: def says what the field is doing, energy says what the day feels
   like, toward says where it goes. None of them says what condition the
   hardware is in.

   Two of the ten were renamed against the grid as given, and both because of
   a collision with a word this table already owns. The grid's level 4 is
   Oscillating, and Oscillating is the band at 41 to 50 here, named for
   crossing the median in both directions, which is a different reading at a
   different place on the line. Its level 4 sits at 31 to 40, so it carries
   Frustrated, which is the grid's own description of it. Level 5 keeps
   Searching.

   The grid's commercial column, the buying probability and its rationale, is
   deliberately NOT here. It is real and it is useful and it belongs in the
   business record: a person opening this product to read themselves must
   never find a percentage saying how likely they are to buy, next to their
   own reading. It is in BUYERS.md. */
/* ============================================================
   THE TEN TIERS CARRY THEIR OWN COLOUR.

   Ruled: "I do not like that it says I am 88 per cent embodied on the right
   hand side and yet my button is not symbolic. The colour is not symbolic."
   He was right and the reason was worse than an oversight: the tier ring was
   drawn in r.darkB, the colour of the seat carrying the most. So a person at
   Embodied whose heaviest seat happened to be the Root got a red ring on the
   best reading but one, and the colour was saying something true about a
   different question.

   THE RAMP IS ARGUED, NOT PICKED. It runs cool and clear at the top, warms
   through the middle where the work is, and DESATURATES at the floor rather
   than reddening further. That last part is the whole of it. Numb is not more
   alarming than frustrated, it is less present, and a palette that shouts
   loudest at the bottom is a palette that tells somebody at the floor that
   they are an emergency. Chroma falls away as coherence does, so collapse
   reads as the colour going out of the picture, which is what it is.

   Every value sits in the same muted family as the seat palette above, and
   none of them is the alarm red, which this product reserves for a thing that
   is actually wrong rather than for a person who is low.
   ============================================================ */
const TIERCOL={
 'Mastery':     '#E8DBA4',   /* clear light. nothing held, nothing shouting */
 'Embodied':    '#8BD4A7',
 'Compounding': '#5FD5A6',   /* the heart green, because this is where it builds */
 'Gaining':     '#6FC5C9',
 'Even':        '#5EBBDB',   /* the throat blue. receptive, level */
 'Oscillating': '#7D93E0',   /* swinging, and the third eye blue is the seat of it */
 'Incoherent':  '#CFAB64',   /* warm, a caution and not an alarm */
 'Corrupt':     '#CF8958',
 'Severe':      '#B58379',   /* chroma coming out. numb is less present, not louder */
 'Collapsed':   '#A48986'};  /* the colour nearly gone. the floor is quiet */
const TIERDEF=[
 {at:91, nm:'Mastery',
  state:'Sovereign',
  soma:'Absolute structural clarity. No unprocessed past experiences.',
  def:'The field builds far more than it costs. Almost nothing is held.',
  energy:'Intention and action arrive together. There is no gap left to manage.',
  toward:'Hold it. The work here is maintenance, and what you can now carry for other people.'},
 {at:81, nm:'Embodied',
  state:'Coherent',
  soma:'Frictionless connection between the field and local experience. Dynamic.',
  def:'The field builds more than it costs, with real load still in it.',
  energy:'You recover fast. A charge lands and clears instead of staying.',
  toward:'Mastery. Close the laws still shut, and clear what is still holding a week later.'},
 {at:71, nm:'Compounding',
  state:'Aligned',
  soma:'High throughput, low friction.',
  def:'Each cleared address makes the next one cheaper. The gains are stacking.',
  energy:'Less effort buys more movement than it did a month ago.',
  toward:'Embodied. Stop opening addresses. Finish the ones already open.'},
 {at:61, nm:'Gaining',
  state:'Tuned',
  soma:'Actively troubleshooting your own bottlenecks. Pragmatic, execution focused.',
  def:'The field builds more than it spends, and the margin is thin.',
  energy:'Forward on most days, and one hard week takes it back.',
  toward:'Compounding. Same seat, same address, repeated, until the load there stops returning.'},
 {at:51, nm:'Even',
  state:'Receptive',
  soma:'Exhausted by the old way and aware that it is broken.',
  def:'The field breaks even and sits just above the line.',
  energy:'What you build holds about as often as it slips.',
  toward:'Gaining. One address cleared entirely beats four reduced.'},
 {at:41, nm:'Oscillating',
  state:'Searching',
  soma:'Consuming and understanding, and still trapped in intellectualisation.',
  def:'The median range is forty to sixty and fifty is the centre of the line. '
     +'The field crosses it in both directions.',
  energy:'The day decides. What is running that morning sets the range.',
  toward:'Even. Consistency rather than intensity. The swing narrows before the number rises.'},
 {at:31, nm:'Incoherent',
  state:'Frustrated',
  soma:'Caught between somatic drag and occasional awareness.',
  def:'The field costs more than it builds. Charge is held at more addresses than are clearing.',
  energy:'Effort goes in and less comes out. You are working, and the work is going into holding.',
  toward:'Oscillating, and the median range starts at forty. Take the heaviest seat first. One address cleared where the load actually sits moves this further than ten cleared anywhere else.'},
 {at:21, nm:'Corrupt',
  state:'Defensive',
  soma:'Bound by dogma. Managing symptoms to protect a position.',
  def:'The held charge is shaping decisions now, not only mood.',
  energy:'The pattern chooses before you do. You can see it afterwards and not while it runs.',
  toward:'Incoherent, then the median range. The move is interruption: name the address while it is running, ahead of the behaviour.'},
 {at:11, nm:'Severe',
  state:'Numb',
  soma:'Medicating or distracting to survive the glitch. The hardware is shutting down.',
  def:'Most of the field is carrying. Very little is clear.',
  energy:'Ordinary demands read as threats. Capacity is spent before the day starts.',
  /* "OFF THE FLOOR" COMES OUT. Ruled. Every other tier's direction names the
     next band and what to do to reach it. This one named where the person was
     lying and told them not to be ambitious, which is a judgement about them
     rather than an instruction about the field, and it is the one band where
     a person is least able to hear it that way. The instruction underneath was
     already right and is kept word for word. */
  toward:'Corrupt, and it is reached one address at a time. One seat, one address, one line. Not a programme.'},
 {at:0, nm:'Collapsed',
  state:'Fragmented',
  soma:'Hijacked by unprocessed past data. Absolute somatic drag.',
  def:'The field is fully loaded. Nothing is clearing.',
  energy:'Flat. Not calm, out of charge.',
  toward:'Weight off, and not alone. A reading this low is not a thing to manage by yourself, and the instrument will not pretend otherwise.'}];
/* one lookup, so the band table stops being copied into renderers */
const TIER_BY={}; TIERDEF.forEach(function(t){TIER_BY[t.nm]=t;});
/* the median, and the width of the swing around it. named once, because three
   renderers asked the same question of the same number. */
const MEDIAN=50, MEDIAN_LO=40, MEDIAN_HI=60;
function medianRange(cq){return cq>=MEDIAN_LO&&cq<=MEDIAN_HI;}
/* a band is a range and says so. the ladder printed one number per row, which
   is a threshold, and a threshold does not tell a person how wide the word is.
   the top of a band is one below the floor of the band above it. */
function tierTop(nm){
 for(var i=0;i<TIERDEF.length;i++) if(TIERDEF[i].nm===nm) return i===0?100:TIERDEF[i-1].at-1;
 return 100;}
function tierRange(t){return t.at+' to '+tierTop(t.nm);}
function tierOf(cq){
 for(var i=0;i<TIERDEF.length;i++) if(cq>=TIERDEF[i].at)return TIERDEF[i];
 return TIERDEF[TIERDEF.length-1];}
