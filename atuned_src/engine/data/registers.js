/* ============================================================
   THE REGISTERS, ported. 24 October. The check that holds them is
   engine/registers.js.

   canon.json calls each of its tables a register. Seven had no table in this
   repository: ladders, amplifiers, quadrants, organs, charge_routing,
   derived_measures and astrology_overlay. They are here, row for row, from
   SOURCE OS CANON 1.0.0, md5 7e844c0d, the copy held at
   vendor/reboot-os/canon.json. The other registers each have a table here
   already, and where the two disagree the owner decides: REG_MAP in
   engine/registers.js says where each one lives, and CANON-MERGE-PLAN.md
   names each disagreement and what each answer costs.

   PORTED, NOT REBUILT. Every word, number and order is canon.json's. Two
   things are added. A name for each field, where canon.json has only a
   position: the names are this port's reading of what each position holds,
   checked against every row, and canon.json names none of them. And a code
   for each row, the c field, which is its identity (engine/data/codes.js says
   why a code and not a name). Two things are not carried, and each table
   says why: the amplifiers' nerve, which NODES already holds, and the derived
   measures' descriptions.

   NOTHING READS THEM YET but the codes and the gate, and nothing here moves a
   number: the gate holds compute() to the same reading with every table here
   scrambled. Four are blocked in canon.json itself by one of its own open
   rulings, and each table quotes it. The astrology overlay is under one of
   its locks.

   THE CHARGE WORDS. canon.json keys ladders, charge_routing,
   derived_measures and the overlay's load_map by its own charge labels,
   lowercase: joy, sadness, disgust, shock, fear, anger, shame and resent.
   They are kept as it spells them, because they are its keys. codeOf reads
   each one under the canon source: the six that are child emotions here
   answer with their code, sadness being the Sad axis, and joy and resent are
   refused by name, because neither is one (CODE_UNMAPPED says why).

   THE MERGE IS REPEATABLE. When reboot-os issues another canon.json,
   node tools/canon-port.js check <file> names every row that differs from
   these tables, and node tools/canon-port.js emit <register> <file> writes
   the rows in this file's shape with every code kept. Each table below is
   exactly what emit writes for the vendored copy, and the gate holds that.
   ============================================================ */

/* LADDERS, canon.json registers.ladders. For each of canon.json's charges,
   nine words from the mildest to the strongest. A word's code is its
   ladder's and its step, LD05.6 for the sixth fear word, composed by rule in
   engine/codes.js and never listed, because a word is not the name of one
   thing: some words sit on two ladders (node tools/canon-port.js report says
   which). ladderPlaces(word) answers with every place a word sits.

   NOT C3_LADDER, which is the 3C card spec's one intensity ladder across
   every charge (engine/data/cards.js), and not the age ladder or the paid
   ladder. Nothing reads these. The lexicon is not fed from them, and the
   weight a word carries in a story is still the lexicon's alone.

   Blocked in canon.json by its open ruling 1, the nine base emotions: "Three
   incompatible rosters. Surprise against Shock unresolved." */
const CHARGE_LADDER=[
 {c:"LD01",ch:"joy",w:["Content","Pleased","Cheerful","Joyful","Elated","Thrilled","Ecstatic","Overjoyed","Blissful"]},
 {c:"LD02",ch:"sadness",w:["Disappointed","Dismal","Downcast","Mournful","Despondent","Grief-stricken","Heartbroken","Depressed","Despairing"]},
 {c:"LD03",ch:"disgust",w:["Displeased","Disapproving","Repelled","Revolted","Appalled","Horrified","Nauseated","Loathsome","Detested"]},
 {c:"LD04",ch:"shock",w:["Startled","Surprised","Astonished","Amazed","Flabbergasted","Stunned","Aghast","Thunderstruck","Dumbfounded"]},
 {c:"LD05",ch:"fear",w:["Apprehensive","Uneasy","Worried","Frightened","Terrified","Horrified","Panic-stricken","Petrified","Paralyzed"]},
 {c:"LD06",ch:"anger",w:["Annoyed","Irritated","Aggravated","Angry","Furious","Enraged","Seething","Infuriated","Wrathful"]},
 {c:"LD07",ch:"shame",w:["Embarrassed","Regretful","Guilty","Remorseful","Humiliated","Disgraced","Mortified","Degraded","Stigmatized"]},
 {c:"LD08",ch:"resent",w:["Peeved","Irked","Annoyed","Aggravated","Bitter","Indignant","Hostile","Vindictive","Wrathful"]}];

/* AMPLIFIERS, canon.json registers.amplifiers. The addresses canon.json
   names as amplifiers, each with the name canon.json gives it, its address,
   and its tag, R ruled by the owner or I inferred. An amplifier has a code of
   its own and its address is a field, so a ruling that moves one changes i
   and never c.

   canon.json writes each address's nerve beside it. NODES already holds the
   nerve, so it is not stored here a second time; regDiff reads it off NODES
   to compare, and a nerve that moves in NODES is a named difference.

   Two of the names are not the name NODES gives the address. Entitlement is
   at address 8, which NODES holds unnamed as Root_08_Unnamed, the owner's
   call; NODES's own Entitlement is address 38. Justification is inferred at
   address 34, which NODES and canon.json's own nodes register both name
   Arrogance. canon.json's open ruling 5: "Justification has no node.
   Component two of four in narcissism. Inferred candidate: node 034."

   RULED 25 October, his words: "Justification and arrogance in many ways
   share similar features. Justification is rejection of accountability.
   Arrogance is using intimidation to avoid accountability. So they share a
   trait. I would put them together." Address 34 carries both. CLOSED 27
   October: canon.json's own open ruling 5 is resolved upstream (reboot-os
   PR #75) and vendor/reboot-os/canon.json is re-pinned to the copy that
   carries it, so the tag moves to "R" here too, regDiff holding this table
   to that file row for row the way it always does. Recorded in full in
   DECISIONS.md. */
const AMPLIFIER=[
 {c:"AM01",nm:"Entitlement",i:8,tag:"R"},
 {c:"AM02",nm:"Obsession",i:29,tag:"R"},
 {c:"AM03",nm:"Judgment",i:37,tag:"R"},
 {c:"AM04",nm:"Perfectionism",i:40,tag:"R"},
 {c:"AM05",nm:"Comparison",i:69,tag:"R"},
 {c:"AM06",nm:"Justification",i:34,tag:"R"}];

/* QUADRANTS, canon.json registers.quadrants. The body in four, right and left
   by front and back. Not the Compass's quadrant() (engine/data/compass.js),
   which is a corner of the firing stack and nothing to do with the body, so
   the table and its code kind both say body quadrant.

   canon.json gives each row as eight positions. The name is the side and the
   face written together, so codesCheck holds the two to agree.

   The symptoms are body correspondences, kept as the engine keeps its other
   clinical correspondences: internally (marketing/refuse.js, the medical
   rule). None may be printed at a person without the claims boundary and the
   owner's ruling. */
const BODY_QUADRANT=[
 {c:"BQ01",nm:"Right-Front",
  layer:"Conscious external",
  theme:"Action, leadership, responsibility, control",
  regions:"right shoulder/neck, right chest/arm, right hip/lower back, right leg",
  symptoms:"Shoulder pain, chest tightness, lower back ache",
  patterns:"Too much carried, fear of failure, hesitation to act",
  side:"right",
  face:"front"},
 {c:"BQ02",nm:"Left-Front",
  layer:"Conscious internal",
  theme:"Emotional expression, relationship, self-worth",
  regions:"left shoulder/neck, left chest/heart, left hip, left leg",
  symptoms:"Chest tightness, foot pain, lower back tension",
  patterns:"Suppressed emotion, unresolved heartache, resistance to change",
  side:"left",
  face:"front"},
 {c:"BQ03",nm:"Right-Back",
  layer:"Subconscious external",
  theme:"Suppressed control, hidden anger, past failure",
  regions:"right back shoulder, right mid-back, right lower back, right posterior hip/leg",
  symptoms:"Chronic back pain, hip pain, mid-back tension",
  patterns:"Suppressed frustration, deep insecurity, risk avoidance",
  side:"right",
  face:"back"},
 {c:"BQ04",nm:"Left-Back",
  layer:"Subconscious internal",
  theme:"Repressed grief, sadness, emotional pain",
  regions:"left back shoulder, left mid-back, left lower back, left posterior hip/leg",
  symptoms:"Chronic heaviness, persistent sadness, emotional withdrawal",
  patterns:"Unprocessed grief, wounding never named, support never received",
  side:"left",
  face:"back"}];

/* ORGANS, canon.json registers.organs. Each with its side, centre, right,
   left or full surface, the issue canon.json gives it and, in every row but
   one, the sentence the pattern says, in the first person. Dermis's fourth
   position is a note and not a sentence the pattern says. It is ported as
   written, because rewording his row is his call, and the gate holds the
   exception by name so a change to it is seen. The quadrants' note on
   symptoms applies here too. */
const ORGAN=[
 {c:"OG01",nm:"Heart",
  side:"centre",
  issue:"Fear of giving and receiving love. Past hurts held.",
  voice:"If I open, I will be hurt again."},
 {c:"OG02",nm:"Stomach",
  side:"centre",
  issue:"Anxiety about the future. Scarcity.",
  voice:"There is not enough. I cannot manage this."},
 {c:"OG03",nm:"Right Lung",
  side:"right",
  issue:"Fear of expressing the true self.",
  voice:"If I say what I actually mean, I will be rejected."},
 {c:"OG04",nm:"Left Lung",
  side:"left",
  issue:"Grief and sadness. Difficulty releasing pain.",
  voice:"I cannot let this go. It defines what happened to me."},
 {c:"OG05",nm:"Right Liver",
  side:"right",
  issue:"Anger, frustration, resentment.",
  voice:"This was done to me. I am right to be furious."},
 {c:"OG06",nm:"Right Kidney",
  side:"right",
  issue:"Fear of failure. Performance pressure.",
  voice:"I am only safe if I perform perfectly."},
 {c:"OG07",nm:"Left Kidney",
  side:"left",
  issue:"Fear of rejection. Feeling unsupported.",
  voice:"No one is going to show up for me when I need it."},
 {c:"OG08",nm:"Intestines",
  side:"centre",
  issue:"Holding onto past traumas.",
  voice:"If I let this go, I lose the story that explains me."},
 {c:"OG09",nm:"Spine",
  side:"centre",
  issue:"Fear of support and stability. Rigidity.",
  voice:"I have to hold all of this alone."},
 {c:"OG10",nm:"Dermis",
  side:"full surface",
  issue:"Shock, acute stress overflow.",
  voice:"Overflow system. Psoriasis, stress acne."}];

/* CHARGE ROUTING, canon.json registers.charge_routing. The body quadrant
   each of canon.json's charges goes to, keyed and valued as canon.json writes
   them: a charge label and a quadrant's name. codesCheck holds every key to a
   ladder's charge and every value to a BODY_QUADRANT name.

   canon.json's own open ruling 2 calls this table a defect: "Eight decisions.
   Current routing is inferred and produced a back-weighted population.
   Defect, not a finding." It is ported so the record is whole, and nothing
   may read it until he rules. */
const CHARGE_QUADRANT={
 anger:"Right-Back",fear:"Right-Front",shame:"Left-Front",sadness:"Left-Back",disgust:"Right-Back",
 shock:"Left-Back",resent:"Right-Back",joy:"Left-Front"};

/* DERIVED MEASURES, canon.json registers.derived_measures. Each with the
   charge canon.json pairs it with and, where canon.json's description cites
   one, the law it is, by HARM's own code: Awareness is element 32 and Flow is
   element 54. canon.json does not say what the pairing with a charge means.

   THE DESCRIPTIONS ARE NOT CARRIED. canon.json calls Awareness a scored set
   with a word the claims rules refuse under the medical rule, and engine.js
   ships inside the quiz, where tests/claims.js reads every string. Rewording
   his sentence is not a seat's to do, so all three descriptions stay in the
   vendored canon.json, and regDiff checks what is carried: the name, the
   charge and the law cited. The plan quotes them.

   Blocked in canon.json by its open ruling 9: "Awareness and Flow. Rebuild
   from non-instrument inputs or drop." Vitality is already a reading here,
   r.X in compute(), made another way, and CANON-MERGE-PLAN.md sets the
   definitions side by side. */
const DERIVED_MEASURE=[
 {c:"DM01",nm:"Vitality",ch:"joy",el:null},
 {c:"DM02",nm:"Awareness",ch:"shock",el:"E32"},
 {c:"DM03",nm:"Flow",ch:"fear",el:"E54"}];

/* THE ASTROLOGY OVERLAY, canon.json registers.astrology_overlay. A vector
   of whole numbers, one for each of dims, for each sign, each animal and each
   of canon.json's archetypes, and a charge for each sign and animal. Kept in
   canon.json's own shape, under its five keys.

   UNDER ONE OF canon.json's LOCKS: "Display-only overlay. Failed a
   permutation test for convergence at p = 1.000. Never enters a number." The
   gate holds it: compute() reads the same with every vector here scrambled.
   The signs and animals are the ones ZSIGN and CHINESE hold, and each has a
   code (CODE_SIGN, CODE_ANIMAL). The archetypes are canon.json's labels:
   Orphan and Outlaw have no code here until he rules on the jungian twelve,
   and Caretaker is AR04, Caregiver. */
const ASTRO_OVERLAY={
 west:{
  Aries:[3,0,-2,3,2,2,-2,1],Taurus:[-1,1,2,-3,0,0,3,3],Gemini:[1,2,-2,1,0,3,-2,-1],
  Cancer:[-1,3,1,-2,-1,1,2,1],Leo:[2,2,-1,1,3,3,0,1],Virgo:[0,0,3,-2,-1,-1,2,3],
  Libra:[-1,3,1,-1,-2,1,1,0],Scorpio:[1,-1,1,2,1,-2,0,0],Sagittarius:[2,1,-3,3,1,2,-2,-2],
  Capricorn:[1,-1,3,0,1,-2,3,3],Aquarius:[1,0,-2,2,0,0,-3,-3],Pisces:[-2,2,-2,-1,-2,1,-1,-3]},
 east:{
  Rat:[2,1,0,1,1,1,-1,2],Ox:[0,-1,3,-2,0,-2,3,3],Tiger:[3,0,-2,3,2,2,-2,0],
  Rabbit:[-2,2,1,-3,-1,0,2,1],Dragon:[3,1,-1,2,3,3,-1,0],Snake:[0,-2,1,1,1,-3,1,0],
  Horse:[2,2,-3,2,1,3,-2,-1],Goat:[-2,2,-1,-2,-2,1,0,0],Monkey:[2,1,-2,2,1,2,-2,-1],
  Rooster:[0,0,3,-1,2,-1,2,3],Dog:[0,2,2,-1,-1,0,3,2],Pig:[-1,3,0,-1,-1,1,2,2]},
 archetype_vectors:{
  Innocent:[-1,2,-1,-2,-1,1,1,0],Orphan:[-2,2,0,-2,-2,0,1,1],Warrior:[3,-1,2,3,2,1,0,2],
  Caretaker:[-1,3,1,-2,-3,1,3,1],Explorer:[2,0,-3,3,2,1,-3,-1],Outlaw:[3,-2,-3,3,1,2,-3,0],
  Lover:[0,3,-1,0,-1,3,0,1],Creator:[2,0,1,1,2,3,-1,0],Jester:[1,2,-3,1,0,3,-2,-1],
  Sage:[-1,-1,2,-2,0,-2,1,-2],Magician:[2,0,0,2,1,1,-2,-3],Ruler:[1,0,3,0,2,0,3,2]},
 load_map:{
  Aries:"anger",Taurus:"resent",Gemini:"shock",Cancer:"sadness",Leo:"shame",Virgo:"disgust",
  Libra:"fear",Scorpio:"resent",Sagittarius:"joy",Capricorn:"fear",Aquarius:"disgust",
  Pisces:"sadness",Rat:"fear",Ox:"resent",Tiger:"anger",Rabbit:"fear",Dragon:"shame",Snake:"resent",
  Horse:"joy",Goat:"sadness",Monkey:"shock",Rooster:"disgust",Dog:"anger",Pig:"joy"},
 dims:["initiate","toward","structure","risk","self","expressive","stabilise","concrete"]};
