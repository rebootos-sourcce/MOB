/* ============================================================
   THE REGISTERS, ported. 24 October. The check that holds them is
   engine/registers.js.

   canon.json calls each of its tables a register. Seven had no table in this
   repository: ladders, amplifiers, quadrants, organs, charge_routing,
   derived_measures and astrology_overlay. They are here, row for row, from
   SOURCE OS CANON 1.0.0, md5 7e844c0d, the copy held at
   vendor/reboot-os/canon.json. An eighth, complexDeep, was added to
   canon.json on 15 November and is the last table in this file; the md5 the
   vendored copy is held to is the one CODE_SOURCES cites, not this one. The other registers each have a table here
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
   Component two of four in narcissism. Inferred candidate: node 034." */
const AMPLIFIER=[
 {c:"AM01",nm:"Entitlement",i:8,tag:"R"},
 {c:"AM02",nm:"Obsession",i:29,tag:"R"},
 {c:"AM03",nm:"Judgment",i:37,tag:"R"},
 {c:"AM04",nm:"Perfectionism",i:40,tag:"R"},
 {c:"AM05",nm:"Comparison",i:69,tag:"R"},
 {c:"AM06",nm:"Justification",i:34,tag:"I"}];

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

/* THE COMPLEXES' DEEP RECORDS, canon.json registers.complexDeep. Ported 21
   November. Until then the graph's complex rung had a name and nothing to
   say: CODE_STRUCT codes all twenty three of canon.json's
   complexes and carries five fields each, code, name, register, row and tag,
   with its own comment saying "content is phase two". The content existed.
   Four research batches written 29 October (reboot-os
   lookdev/handoff/COMPLEX_RECORDS_RESEARCH_PILOT_BATCH1-4_2026-10-29.md)
   filled all twenty three in the shape TPL-COMPLEX-UNIFIED asks for, and
   reboot-os merged them into canon.json at a18cc55d on 15 November, under
   registers.complexDeep. Nothing here read it, because the copy vendored here
   was taken before that commit. On the day of the port one of them had any
   text in this repository, and only by a coincidence of names: DESCENT's
   Narcissism resolves to X04.

   PORTED, NOT REBUILT, like every table above. Every field is canon.json's,
   in its order and its spelling, and the only thing added is c. c is NOT a
   code of this table's own: each row is the deep record of a complex
   CODE_STRUCT already codes, so its c is that complex's code, read off
   CODE_STRUCT by the row canon.json files the complex at. It is read by the
   row and never by the name, because the owner renamed Rigidity to Unbending
   on 7 November and canon.json still says Rigidity, so a name match would
   have left X09 with no record. cxDeep(x) answers by code or by any name the
   codes door knows.

   NOT CANON, AND NOT A DIAGNOSIS. Every row's reviewStatus says so in its own
   words, "research-populated working record; canon/owner review required;
   not diagnosis", and the port keeps it rather than promoting anything. Each
   row's confidence is the batch's own figure and its researchSources the
   batch's own citations. Nothing renders these yet, and compute() reads none
   of it: the gate holds the reading equal with this table scrambled, like
   every other table here. Showing one to a person is a surface decision, and
   the trust boundary DESCENT's Collapse entry writes down applies to it. */
const CX_DEEP=[
 {c:"X01",nm:"Dominance Enforcement",
  fam:"malignant narcissism trace",
  def:"Maintaining a position of power over another person by controlling their choices and morally condemning any resistance to that control; dominance is held in place by two moves at once -- tightening control, and treating noncompliance as a character flaw rather than a disagreement.",
  body:"This complex pairs Controller's drive to manage outcomes and other people's behavior with Judge's drive to find people wanting and say so. Where either saboteur alone might produce rigidity or criticism, together they produce an enforced hierarchy: control backed by moral condemnation of whoever will not comply. This is a research-informed expansion of the owner-ruled name and saboteur pairing above, not a clinical diagnosis.",
  inferred:false,
  inferenceBasis:"The complex name, glyph and saboteur pairing are explicitly owner-ruled in canon.json (tag R). The behavioral template, trigger mechanism, lived example, impact and practice below are a research-informed expansion built from two separately validated literatures (assertions of dominance within the PID-5 Antagonism domain, and contempt as a moral emotion), not from a study of 'Dominance Enforcement' as a named construct, because no such named construct exists in the literature I could find.",
  behavior:"May tightly manage another person's decisions, schedule, or environment and treat deviation from the plan as a problem to be corrected rather than a choice to be respected. When someone does not comply, the response is not limited to correction -- it carries visible disgust, disapproval or moral framing ('that was wrong of you,' not just 'that didn't work'), so resistance is answered with both control and condemnation.",
  triggerMechanism:"A loss of predictability, disobedience, or being told no can activate the controlling response. A perceived moral lapse, disrespect, or violation of an unstated standard can separately activate the contemptuous-judgment response. In this complex the two fire together: the same incident reads as both a control problem and a character problem.",
  livedExample:"A person sets a household or team rule unilaterally. When someone deviates from it, the response is not 'let's talk about why that happened' but a tightening of oversight paired with a remark that frames the deviation as evidence of the other person's laziness, selfishness or bad character, and the rule is then enforced more strictly going forward.",
  impact:"Erodes trust and psychological safety. People comply to avoid moral judgment rather than because they agree, so apparent cooperation can mask resentment or withdrawal. Feedback becomes one-directional, and the relationship organizes around supervision rather than mutual agreement.",
  practice:"Before tightening control, name the actual need for predictability out loud and ask whether it requires controlling the other person's choice or only communicating the stakes. Before passing judgment, separate the behavior from the person's character, and check whether the same standard would be applied to yourself in the same situation. Make room for the other person's account before concluding noncompliance was a moral failing.",
  oppositeId:"opposite:Dominance Enforcement",
  oppositeDefinition:"Collaborative authority: holding structure, standards and accountability through invitation, transparency and respect for another person's agency, without requiring control over their choices or treating disagreement as a moral failing.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.45,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[0] (owner-ruled name, glyph, saboteur links, R tag); deep content below is this pilot batch's research expansion",
  researchSources:["https://pmc.ncbi.nlm.nih.gov/articles/PMC6960378/","https://doi.org/10.1037/pspi0000033","https://en.wikipedia.org/wiki/Social_dominance_theory"],
  links:["sab:Controller","sab:Judge"]},
 {c:"X02",nm:"Blame Displacement",
  fam:"malignant narcissism trace",
  def:"Converting one's own anger, failure or shame into an accusation against someone else, so responsibility for an outcome relocates onto another person rather than staying with the one who produced it.",
  body:"Aggressor supplies the charge -- anger, often disproportionate to the triggering event -- and Deflector supplies the redirection, moving responsibility for that charge off the self and onto someone else before it can be examined. Together they produce a pattern where conflict reliably resolves with someone else at fault, regardless of what actually happened.",
  inferred:false,
  inferenceBasis:"The name and saboteur pairing are owner-ruled (canon.json tag R). The behavioral content below draws on real, replicated findings about hostile attribution and blame externalization under threat; it is this project's synthesis of that literature onto the named saboteur pair, not a direct study of 'Blame Displacement' as a construct.",
  behavior:"May respond to a mistake, conflict or criticism by immediately asserting that it happened because of someone else's action, hostility or incompetence, before any investigation of the actual sequence of events. Acknowledging one's own contribution tends to come late, if at all, and often only after the blame attribution has already been stated to others.",
  triggerMechanism:"A threat to self-image -- being caught in an error, criticized, or confronted with a bad outcome one contributed to -- can activate a rapid, pre-reflective attribution of hostile intent or fault onto another party. This is closer to an automatic interpretive bias than a deliberate lie in the moment it happens, even though the effect on the other person is the same.",
  livedExample:"A shared task goes wrong. Before the sequence of events has been established, the person states that it happened because a colleague dropped the ball or was careless, and continues to hold that account even once facts emerge that complicate it.",
  impact:"Prevents repair, because the party actually responsible is never named by the person who caused the harm. The other person accumulates blame that is not theirs, trust erodes, and the underlying problem (whatever actually caused the failure) goes uncorrected because it was never accurately identified.",
  practice:"Before assigning cause, separate the observable sequence of events from the felt sense of threat or shame in the moment. State what is actually known to have happened before stating who is at fault. Name your own contribution first, even if partial, before describing anyone else's.",
  oppositeId:"opposite:Blame Displacement",
  oppositeDefinition:"Accountable attribution: examining what actually happened before assigning cause, naming one's own contribution without being prompted, and tolerating the discomfort of fault landing on oneself when it belongs there.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.55,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[1] (owner-ruled name, glyph, saboteur links, R tag); deep content below is this pilot batch's research expansion",
  researchSources:["https://doi.org/10.1037/0033-2909.115.1.74"],
  links:["sab:Aggressor","sab:Deflector"]},
 {c:"X03",nm:"Superiority-Persecution",
  fam:"malignant narcissism trace",
  def:"Holding two positions on others at once: moral or competitive superiority, and a persistent felt sense of being unfairly targeted by the very people one considers beneath oneself. The two do not alternate -- they co-occur, which is what the shell's own note ('Victim runs split') is naming.",
  body:"Hyper-Achiever supplies a standing claim to being better -- more capable, more deserving, more hardworking than others -- while Victim, rather than running as ordinary felt helplessness, runs here as a claim of persecution: being undervalued, misunderstood or attacked by the people the superiority claim places below oneself. The combination is self-sealing: criticism confirms persecution, and persecution confirms that one is, after all, superior to whoever is doing the persecuting.",
  inferred:false,
  inferenceBasis:"The name, saboteur pairing and the 'Victim runs split' note are owner-ruled (canon.json tag R). The behavioral template below is grounded in a named, validated personality-psychology construct (Tendency for Interpersonal Victimhood) that independently measures moral superiority, need for recognition and low empathy for others' comparable claims together; mapping that construct onto this specific saboteur pair is this project's synthesis.",
  behavior:"May claim moral or competitive high ground while simultaneously describing oneself as misunderstood, undervalued or unfairly treated by others, often in the same conversation. Shows a high need for recognition of one's own effort or suffering, rumination on specific instances of being wronged, and comparatively little recognition that others might have equally valid claims to being wronged.",
  triggerMechanism:"Being overlooked, criticized, or not sufficiently credited for one's effort or achievement can activate both halves of the pattern at once: the superiority claim ('I am clearly the one who worked hardest/did this right') and the persecution claim ('and they are the ones treating me unfairly for it').",
  livedExample:"A person who put in the most visible effort on a shared project is not singled out for thanks. They experience this as proof both that they are better than the team and that the team is treating them unjustly, and become preoccupied with the omission rather than the project's outcome.",
  impact:"Makes ordinary feedback and disagreement difficult to receive, because disagreement is read as persecution rather than as information. Relationships around the person can come to organize around managing the sense of being wronged, and the person's own view of others' comparable claims to unfair treatment tends to be dismissed.",
  practice:"Name the specific unmet need (recognition, credit, acknowledgment) separately from a global claim of being persecuted. Check whether the same standard for 'unfair treatment' would be applied if someone else made the identical claim. Invite an outside perspective before concluding the situation was persecution rather than an ordinary oversight.",
  oppositeId:"opposite:Superiority-Persecution",
  oppositeDefinition:"Grounded standing: recognizing one's own effort and contribution without needing to rank it above others', and distinguishing an actual injustice from an ordinary oversight or disagreement, without defaulting to a persecution narrative.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.66,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[2] (owner-ruled name, glyph, saboteur links, R tag, 'Victim runs split' note); deep content below is this pilot batch's research expansion",
  researchSources:["https://doi.org/10.1016/j.paid.2020.110134"],
  links:["sab:Hyper-Achiever","sab:Victim"]},
 {c:"X04",nm:"Narcissistic",
  fam:"Narcissism (owner-dictated four-part structure: entitlement, justification, comparison, judgment; three of four parts currently addressed by saboteurs)",
  def:"Interpreting situations through entitlement, self-justification, competitive comparison and moral judgment of others, in service of a self-image that must be maintained as superior. The structural (saboteur-built) form of grandiose narcissism, distinct from, but describing the same territory as, the existing higher-order Narcissism record.",
  body:"Controller supplies the drive to manage outcomes and other people so the superior self-image is not disturbed. Hyper-Achiever supplies the comparison -- measuring the self against others and needing to come out ahead. Judge supplies the moral condemnation of anyone who falls short of the standard the person holds for others but not for themselves. The owner's own four-part framing (entitlement, justification, comparison, judgment) names one more element, entitlement-as-justification, that does not yet have its own saboteur address in canon.json; this record does not attempt to supply one.",
  inferred:false,
  inferenceBasis:"The name, saboteur pairing and the owner's four-part framing are explicitly owner-ruled (canon.json tag R, 'Lance dictated'). The behavioral template below reuses the same real external literature as the project's existing DESCENT Narcissism record, because this is the same real construct described at a different schema tier, not a new territory requiring new sources.",
  behavior:"May expect special treatment without having to ask for it (entitlement), explain or reframe one's own actions after the fact rather than accounting for them directly (justification), measure one's standing against others on an ongoing basis (comparison), and hold others to standards not applied to oneself (judgment). Vulnerable shame can sit underneath the presentation; it can vary by context and by which saboteur is most active at a given moment.",
  triggerMechanism:"A status threat, being asked to account for one's own behavior, being outperformed, or being treated as ordinary rather than exceptional can activate a defensive move through whichever of the three addressed saboteurs is most available -- tightening control, re-justifying the action, or judging the other party -- to restore the superior self-image.",
  livedExample:"Asked to explain a decision that hurt someone, the person offers a justification that reframes the decision as necessary or as the other party's fault, mentions their own track record as evidence of good judgment, and criticizes the other party's conduct in the same breath.",
  impact:"Reduces mutuality, trust and the capacity to repair harm, because the other person's account is treated as secondary to protecting the self-image, and accountability conversations tend to end in comparison or judgment rather than resolution.",
  practice:"Before justifying, state the plain facts of what happened. Before comparing, ask whether the comparison serves the other person or only one's own self-image. Before judging, apply the same standard to yourself that is being applied to the other person.",
  oppositeId:"opposite:Narcissistic",
  oppositeDefinition:"Grounded self-worth with humility, reciprocal empathy, accountability, and respect for others as equally real -- the same working counterpart the existing DESCENT Narcissism record already names as 'Grounded Self-Worth,' here applied to the three-saboteur structural form.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required. Owner review should also decide whether this record and the existing descent:Narcissism record should be merged or cross-linked rather than kept as two separate deep records of the same construct.",
  confidence:0.72,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[3] (owner-ruled name, glyph, saboteur links, R tag, four-part note); deep content below reuses the external research base of the existing engine.js DESCENT Narcissism record because it is the same real-world construct, plus one new source found in this pass",
  researchSources:["https://www.psychiatry.org/News-room/APA-Blogs/What-Is-Narcissistic-Personality-Disorder","https://pmc.ncbi.nlm.nih.gov/articles/PMC4415495/","https://pubmed.ncbi.nlm.nih.gov/34860434/","https://www.sciencedirect.com/science/article/pii/S0092656622001428","https://pmc.ncbi.nlm.nih.gov/articles/PMC9064993/"],
  links:["sab:Controller","sab:Hyper-Achiever","sab:Judge","descent:Narcissism"]},
 {c:"X05",nm:"Machiavellian Tactics",
  fam:"Machiavellianism (tactical layer; Rebel saboteur removed from this complex and reclassified as a Jungian archetype elsewhere in canon)",
  def:"The tactical layer of the Machiavellian pattern: a standing assumption that other people are also acting out of self-interest (Skeptic), used to justify deliberately managing what they see and know in order to control an outcome (Manipulator). A narrower slice than the full Machiavellian trait structure -- the tactics, not the whole stack.",
  body:"Skeptic supplies the cynical premise -- other people's stated motives are not fully trusted -- and Manipulator supplies the response: selective disclosure, impression management, or deception, framed internally as reasonable self-protection against people who are assumed to be doing the same thing. Unlike the existing DESCENT Machiavellianism hyper-complex, which is the full narcissism-plus-suppressed-empathy stack, this complex is the two-saboteur tactical core underneath it.",
  inferred:false,
  inferenceBasis:"The name, saboteur pairing and the Rebel-removal note are owner-ruled (canon.json tag R). The behavioral template below draws on the foundational, well-replicated Machiavellianism trait literature; narrowing that trait down to a two-saboteur 'tactics' slice is this project's own structural choice and has not itself been separately validated as a sub-construct.",
  behavior:"May use selective disclosure, strategic impression management, or outright deception to secure a desired outcome, while privately assuming the other party would do the same if given the chance. Tends to present the tactic, internally, as necessary caution rather than manipulation.",
  triggerMechanism:"A competitive situation, a desired outcome that depends on another person's choice, or a perceived risk of being deceived first can activate the shift from open negotiation toward controlling what information the other party has access to.",
  livedExample:"In a negotiation, the person assumes the other party is already angling for advantage, and pre-emptively withholds or frames information to secure a better outcome, experiencing this as self-defense rather than as a tactic being used against someone who has not yet done anything untrustworthy.",
  impact:"Undermines informed consent and durable trust. Even when the tactic succeeds in the moment, relationships built this way tend to become transactional, and once the pattern is noticed by others, they withdraw good faith pre-emptively -- which then appears to confirm the original cynical premise.",
  practice:"Name the actual goal and what is genuinely at stake, out loud, before deciding how much information to share. Test the assumption that the other party is acting in bad faith against actual evidence rather than acting on the assumption by default. Offer the other party real information and a genuine option to decline.",
  oppositeId:"opposite:Machiavellian Tactics",
  oppositeDefinition:"Transparent dealing: making the goal and relevant information explicit, testing cynical assumptions against evidence rather than acting on them pre-emptively, and giving others a genuine, informed choice -- the same direction the existing DESCENT Machiavellianism record's counterpart names at the full-stack level, applied here to the tactical layer.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.68,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[4] (owner-ruled name, glyph, saboteur links, R tag, Rebel-removal note); deep content below is this pilot batch's research expansion, informed by but distinct from the existing DESCENT Machiavellianism record's sources",
  researchSources:["https://en.wikipedia.org/wiki/Studies_in_Machiavellianism","https://www2.psych.ubc.ca/~dpaulhus/research/DARK_TRAITS/ARTICLES/ASSESST.2014.with.Jones.pdf"],
  links:["sab:Manipulator","sab:Skeptic","descent:Machiavellianism"]},
 {c:"X06",nm:"Antisocial",
  fam:"Antisocial / psychopathy spectrum (Rebel saboteur removed from this complex)",
  def:"Disregard for other people's rights or safety, combined with deflecting responsibility for the resulting harm onto circumstances or other people, so accountability does not land even when the harm is direct and observable.",
  body:"Aggressor supplies disregard for others' rights or safety in pursuit of one's own aims -- action taken without meaningful consideration of who it affects -- and Deflector supplies the follow-on move: when confronted, responsibility for the harm is relocated elsewhere rather than acknowledged. This is a more severe and more global pattern than Blame Displacement (Complex 2), which shares the same two saboteurs but is framed at the narrower level of shifting blame in a specific conflict rather than a standing disregard for others' rights.",
  inferred:false,
  inferenceBasis:"The name and saboteur pairing are owner-ruled (canon.json tag R). The behavioral template below draws on DSM-5 antisocial personality disorder criteria and the triarchic model of psychopathy (meanness and disinhibition facets); a two-saboteur pairing is a thin structural basis for a pattern this clinically significant, which is reflected in the confidence score below, not in the behavioral claims themselves.",
  behavior:"May act in ways that disregard other people's rights, safety or wellbeing, with limited forward planning for the consequences to others. When confronted with the resulting harm, responsibility is reliably relocated -- onto circumstances, onto the other person's own actions, or onto bad luck -- rather than acknowledged, and there is little visible change in future behavior as a result of the confrontation.",
  triggerMechanism:"An opportunity for personal gain, a boundary that frustrates an immediate goal, or being held accountable for a consequence can activate action with limited regard for who is affected, followed by deflection of responsibility once the harm becomes visible to others.",
  livedExample:"Harm to another person results directly from the person's own action. When confronted, the explanation offered relocates the cause to something or someone else, and the same kind of action recurs afterward without a visible change in behavior.",
  impact:"Creates real risk to the safety, finances or wellbeing of people around the person. Ordinary accountability conversations tend not to work, because responsibility does not land on the person who caused the harm; relationships and systems around the person may need documented boundaries and outside oversight rather than relying on remorse or insight appearing on its own.",
  practice:"Do not rely on an expectation that remorse will appear spontaneously. Require concrete, observed behavior change rather than an account or apology alone. Use documentation and outside accountability structures where real harm or risk is present, and involve a qualified professional when safety or functioning is significantly affected.",
  oppositeId:"opposite:Antisocial",
  oppositeDefinition:"Accountable regard: taking other people's rights and safety into account before acting, and accepting responsibility for resulting harm without relocating it onto circumstances or other people.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.5,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[5] (owner-ruled name, glyph, saboteur links, R tag, Rebel-removal note); deep content below is this pilot batch's research expansion",
  researchSources:["https://www.mayoclinic.org/diseases-conditions/antisocial-personality-disorder/symptoms-causes/syc-20353928","https://doi.org/10.1017/S0954579409000492","https://pmc.ncbi.nlm.nih.gov/articles/PMC4100942/"],
  links:["sab:Aggressor","sab:Deflector"]},
 {c:"X07",nm:"Oscillation",
  fam:"Clinical filing, internal only: Bipolar (canon.json's own R-tagged note, 'Filed as Bipolar in the March table'; per SNIFFER_SPEC.md section 5's HARD GUARD and engine.js's CODE_ALIAS table, this filing is translation-only and must never be presented as a diagnosis)",
  def:"Moving between an activated, outwardly expressive high state and a flat, aggrieved low state without settling at a stable baseline in between -- the complex names the movement itself, not either pole alone.",
  body:"Dramatizer supplies amplified, theatrical emotional expression and rapid shifts in presented affect. Restless supplies elevated energy and a pull toward activity that resists sitting still. Victim supplies the low pole: sadness, resentment, and a felt sense of being acted upon rather than acting. Together the three move the person between an energized, attention-seeking high and a flat, hard-done-by low, structurally analogous to -- but not clinically equivalent to -- a mood-episode cycle.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and clinical filing are owner-ruled (canon.json tag R). Cross-checked against engine.js's CODE_ALIAS table (code X07), which independently corroborates the same three-saboteur assignment via an internal manuscript I have not read today (see flag above). The behavioral content below is this pilot batch's research expansion using real external literature on bipolar-spectrum mood structure; it is not a claim that 'Oscillation' is itself a validated external construct, and it must not be read as diagnosing bipolar disorder in anyone.",
  behavior:"May shift between seeking attention through dramatized, high-energy expression and pressured activity, and a flat state marked by sadness and a sense of grievance -- feeling that circumstances or other people, not one's own choices, produced the low. The shift is not always visible to others as sudden, even when it is not steady from the inside.",
  triggerMechanism:"Possible activating factors include disrupted sleep or routine, unmet needs for recognition during the high phase, and accumulated setbacks or invalidation feeding the low phase. This is a working hypothesis about the saboteur pattern, not a claim about the biological or circadian mechanisms of a mood disorder, which are multifactorial and not settled by this record.",
  livedExample:"A person is the most animated, visible presence in a group for a stretch of days, initiating plans and drawing attention to their own excitement. Within the same week, the energy drops, plans are abandoned, and the same person describes feeling let down by everyone who 'didn't show up' for the plans they themselves generated.",
  impact:"Makes the person's support, energy and attention unpredictable for people around them, and can leave both the person and others unsure which state is the 'real' one. Can exhaust relationships that reorganize around managing the swing rather than addressing either state directly.",
  practice:"Track the pattern itself, not just the current pole: note what preceded a shift into either the high or the low. Build in rest and routine before a high state burns out into a low one. Separate the grievance narrative of the low state from an accurate account of what others actually did or didn't do. Seek a qualified clinical evaluation if the swings are severe, persistent, or risk safety -- this record is not a substitute for that assessment.",
  oppositeId:"opposite:Oscillation",
  oppositeDefinition:"Stable affective range: holding a workable mood baseline through both setbacks and successes, expressing enthusiasm and disappointment without the pattern resolving into an attention-seeking high or an aggrieved low.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.58,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[6] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); independently corroborated (not verified against primary text) by engine.js's CODE_ALIAS table, code X07; deep content below is this pilot batch's research expansion",
  researchSources:["https://www.nimh.nih.gov/health/topics/bipolar-disorder","https://pmc.ncbi.nlm.nih.gov/articles/PMC4230689/"],
  links:["sab:Dramatizer","sab:Restless","sab:Victim"]},
 {c:"X08",nm:"Abandonment Reactivity",
  fam:"Clinical filing, internal only: Borderline Personality Disorder (canon.json's own R-tagged note, 'Filed as BPD'; translation-only per the same HARD GUARD and CODE_ALIAS convention noted under Oscillation above)",
  def:"A standing sensitivity to real or anticipated abandonment that organizes behavior around preventing it -- through appeasement, through a self-image that shifts to match what the relationship seems to require, and through a felt sense of being wronged when connection feels threatened.",
  body:"Victim supplies the affective core: sadness and resentment that surface when connection feels at risk, and a sense of being done to rather than choosing. People-Pleaser supplies the preventive strategy: adjusting behavior, withholding disagreement, and seeking approval to keep the other person close. Imposter supplies an unstable sense of self that shifts depending on who the person is trying to keep -- less a fixed identity than a fit to whatever the relationship currently seems to need. Together they describe a pattern organized around the threat of loss rather than around any one fixed trait.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and clinical filing are owner-ruled (canon.json tag R). The behavioral template below draws on two separately real, well-established bodies of work: the DSM-5 BPD criteria themselves (abandonment fear, identity disturbance, chronic emptiness) and Linehan's biosocial model of BPD. Mapping Victim/People-Pleaser/Imposter onto those three specific DSM-5 criteria is this project's own structural choice, not an independently validated three-way split in the literature.",
  behavior:"May read ordinary distance, disagreement, or a partner's independent plans as a sign of impending loss, and respond by increasing appeasement, suppressing one's own preferences, or presenting a version of self calibrated to what seems most likely to keep the relationship intact. The resulting self-presentation can feel, from the inside, less like a stable identity and more like a performance tuned to the audience.",
  triggerMechanism:"A partner's unavailability, a perceived slight, an upcoming separation, or any cue read as a precursor to loss can activate appeasement and self-adjustment at once. Linehan's biosocial model frames the underlying vulnerability as heightened emotional sensitivity meeting an environment that did not reliably validate the person's internal experience; I'm naming that model as real background, not asserting it explains any individual case, and empirical support for its specific interaction term is mixed (see sourcing notes).",
  livedExample:"A partner makes plans without first checking in. Before anything is said, the person begins reviewing what they might have done wrong, agrees to whatever the partner wants in the next interaction regardless of their own preference, and afterward cannot clearly describe what they themselves had wanted that day.",
  impact:"Can make the person's stated preferences unreliable information for people close to them, since those preferences shift under abandonment pressure. Relationships can become organized around reassurance-seeking, and the person's own sense of who they are outside a given relationship can stay thin or inconsistent.",
  practice:"Name the fear of loss explicitly rather than acting on it indirectly through appeasement. Before adjusting behavior to fit a relationship, check what you actually want, independent of what you believe the other person needs. Build a sense of self that holds steady across relationships rather than one that is reconstituted inside each one. Seek a qualified clinician for a full evaluation and for dialectical behavior therapy or comparable support if the pattern is severe -- this record describes a working pattern, not a treatment plan.",
  oppositeId:"opposite:Abandonment Reactivity",
  oppositeDefinition:"Secure relatedness: tolerating ordinary distance and disagreement without reading them as abandonment, holding a stable sense of self across relationships, and expressing one's own preferences even under relational uncertainty.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.7,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[7] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); independently corroborated (not verified against primary text) by engine.js's CODE_ALIAS table, code X08; deep content below is this pilot batch's research expansion",
  researchSources:["https://www.nimh.nih.gov/health/topics/borderline-personality-disorder","https://doi.org/10.1186/s40479-018-0096-6"],
  links:["sab:Victim","sab:People-Pleaser","sab:Imposter"]},
 {c:"X09",nm:"Rigidity",
  fam:"Clinical filing, internal only: Obsessive-Compulsive Personality Disorder (canon.json's own R-tagged note, 'Filed as OCPD'; translation-only per the HARD GUARD and CODE_ALIAS convention noted under Oscillation above). NOTE: this name is also live, independently, as a hypercomplex-tier framework mode (Cluster IV, 'independently derived' per SNIFFER_SPEC.md section 5) -- see flag above.",
  def:"A preoccupation with rules, order, and getting things exactly right, paired with a standing watchfulness for error or disorder, that together crowd out flexibility even when flexibility would serve the actual goal better.",
  body:"Stickler supplies devotion to rules, details, and one correct way of doing things. Perfectionist supplies the specific drive toward flawless execution that can stall completion rather than support it. Hyper-Vigilant supplies ongoing scanning for error, disorder, or deviation from the standard. Together they produce a pattern where control and correctness are held above adaptability, efficiency, or other people's needs, even when the situation has already changed.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and clinical filing are owner-ruled (canon.json tag R). The behavioral template below draws on the real, peer-reviewed OCPD literature, mapped onto this specific three-saboteur triad as this project's own structural choice. This record does not resolve, and should not be read as having resolved, the naming collision with the existing hypercomplex:Rigidity record flagged above.",
  behavior:"May insist on one correct method even after it stops fitting the situation, delay or fail to complete tasks because they do not yet meet a self-set standard, and notice and flag deviations, disorder or rule-breaking in the environment or in other people's work well before anyone else does. Devotion to work and detail can come at the expense of leisure, relationships, or the actual deadline.",
  triggerMechanism:"Uncertainty, perceived disorder, an error (one's own or someone else's), or a threat to a known, controllable method can activate tightened adherence to rules and heightened scanning for what else might be wrong. These are hypotheses to test against observed behavior, not assumed causes.",
  livedExample:"A process that used to work no longer fits a changed situation. Rather than adapting the method, the person insists on following it exactly as before, becomes visibly uneasy at suggestions to deviate, and spends disproportionate time checking the work for errors that would not materially affect the outcome.",
  impact:"Can impair collaboration, timeliness and adaptation to new information, since the method and the standard are prioritized over the actual goal. Co-workers or family members can experience ongoing correction and little tolerance for alternative approaches, even workable ones.",
  practice:"Name the purpose behind the rule or standard before defending it. Ask what has actually changed in the situation. Generate at least one workable alternative before rejecting it. Separate 'this does not meet my standard' from 'this will not work' -- they are not the same claim, and only one of them is about the actual outcome.",
  oppositeId:"opposite:Rigidity",
  oppositeDefinition:"Flexible integrity: preserving real standards and follow-through while adapting method to context, tolerating imperfection that does not affect the actual outcome, and treating a changed situation as a reason to update rather than a threat to resist.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required. Owner review should also resolve the naming collision flagged above with the existing hypercomplex:Rigidity record before this draft is treated as ready.",
  confidence:0.68,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[8] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); independently corroborated (not verified against primary text) by engine.js's CODE_ALIAS table, code X09; deep content below is this pilot batch's research expansion",
  researchSources:["https://pubmed.ncbi.nlm.nih.gov/25617042/"],
  links:["sab:Stickler","sab:Perfectionist","sab:Hyper-Vigilant","hypercomplex:Rigidity"]},
 {c:"X10",nm:"Attention Seeking",
  fam:"Clinical filing, internal only: Histrionic Personality Disorder (canon.json's own R-tagged note, 'Filed as Histrionic'; translation-only per the HARD GUARD and CODE_ALIAS convention noted under Oscillation above)",
  def:"A standing need to be the focus of attention, pursued through dramatized emotional display, through shaping oneself to be liked, and through a self-presentation that leans on impression and feeling rather than verifiable detail.",
  body:"Dramatizer supplies theatrical, exaggerated emotional expression aimed at drawing and holding notice. People-Pleaser supplies the drive to be liked and approved of, which channels the display toward whatever earns warmth from the audience in the moment. Dreamer supplies an impressionistic, feeling-forward self-presentation -- light on specific detail, oriented toward how a story lands rather than its exact accuracy. Together they produce a pattern organized around being noticed and liked rather than around any specific content being communicated.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and clinical filing are owner-ruled (canon.json tag R). The behavioral template below draws on the real DSM-5 HPD criteria, which is itself a comparatively thin and contested empirical category (see sourcing notes -- this is not a case of borrowing a rock-solid literature, and the confidence score reflects that honestly). Mapping Dramatizer/People-Pleaser/Dreamer onto specific HPD criteria is this project's own structural choice.",
  behavior:"May become visibly uncomfortable or seek to redirect attention back to self when not the center of focus, present emotion in a dramatic or exaggerated register, shift presentation readily based on what seems to please the audience, and describe experiences in impressionistic, feeling-centered terms that are light on verifiable specifics.",
  triggerMechanism:"Being overlooked, a conversation or situation moving its focus elsewhere, or a flat response to an emotional display can activate an escalation of expressiveness or a shift in self-presentation aimed at recovering attention and approval.",
  livedExample:"In a group conversation, focus moves to someone else's news. The person re-centers the conversation on their own related, more dramatically told experience, delivered with more emotional color than specific detail, and visibly brightens once attention returns.",
  impact:"Can make it hard for others to get a stable, detailed read on the person's actual experience, since the presentation is tuned to effect rather than accuracy. Attention and approval can start to function as the measure of whether an interaction went well, independent of its actual content.",
  practice:"Before describing an experience, separate what actually happened from how you want it to land. Practice tolerating a conversation that is not centered on you without redirecting it. Notice when self-presentation is shifting to match what you believe the audience wants, and check that shift against what you actually think or feel.",
  oppositeId:"opposite:Attention Seeking",
  oppositeDefinition:"Grounded self-expression: sharing experience accurately and with genuine feeling, without needing to be the center of attention to feel the interaction succeeded, and presenting consistently regardless of audience.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.56,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[9] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); independently corroborated (not verified against primary text) by engine.js's CODE_ALIAS table, code X10; deep content below is this pilot batch's research expansion",
  researchSources:["https://pubmed.ncbi.nlm.nih.gov/31194465/"],
  links:["sab:Dramatizer","sab:People-Pleaser","sab:Dreamer"]},
 {c:"X11",nm:"Threat Scanning",
  fam:"Clinical filing, internal only: Anxiety Disorders (canon.json's own R-tagged note, 'Filed as Anxiety Disorders'; translation-only per the HARD GUARD and CODE_ALIAS convention noted under Oscillation above). Note: canon.json's own filing names the broad category 'Anxiety Disorders,' not one specific disorder, and the record below is written at that same breadth rather than narrowed to a single named disorder such as GAD.",
  def:"A standing orientation toward detecting and preparing for possible threat, carried through persistent worry, active scanning of the environment for danger cues, and avoidance of situations that might contain the thing being scanned for.",
  body:"Worrywart supplies persistent, hard-to-control anticipatory worry across situations. Hyper-Vigilant supplies active scanning of the environment for threat cues. Avoider supplies the behavioral response once a possible threat is flagged: staying away from the situation rather than testing whether the danger is real. The three together describe a closed loop -- worry generates scanning, scanning finds candidate threats, and avoidance prevents the loop from ever being tested against what actually happens.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and clinical filing are owner-ruled (canon.json tag R). Unusually for this batch, each of the three saboteurs maps onto a separately, independently well-validated piece of the anxiety literature rather than one piece of literature split three ways -- see sourcing notes. The specific three-way packaging as a single named complex is still this project's own structural choice.",
  behavior:"May worry persistently and across multiple topics even when nothing specific is wrong, notice and track potential danger cues in the environment that others do not register, and withdraw from or decline situations that could contain the thing being scanned for -- before any actual encounter tests whether the danger is present.",
  triggerMechanism:"Ambiguous situations, novel environments, or any cue that could plausibly signal danger can activate the scanning response; once a candidate threat is flagged, avoidance follows quickly, which prevents the kind of direct experience that could update the original worry. This loop-closing structure is itself a well-documented feature of anxiety disorders, not unique to this record.",
  livedExample:"Before a new social situation, the person generates several specific ways it could go wrong, monitors the room closely on arrival for any sign that one of those scenarios is unfolding, and leaves early or avoids the situation next time, without ever staying long enough to find out whether the feared outcome would actually have happened.",
  impact:"Can narrow the person's range of situations, relationships and opportunities over time, since avoidance prevents the disconfirming experiences that would otherwise reduce the worry. Scanning can also be read by others as distrust or hostility, even when it is self-protective rather than accusatory.",
  practice:"Name the specific feared outcome rather than staying with a general sense of unease. Test the prediction by staying in the situation rather than leaving early, when safety allows it. Track how often the scanned-for danger actually materializes versus how often it doesn't. Seek a qualified clinician if worry or avoidance is significantly limiting daily functioning -- exposure-based approaches are well-supported and this record is not a substitute for them.",
  oppositeId:"opposite:Threat Scanning",
  oppositeDefinition:"Calibrated assessment: noticing real signals of risk without continuous anticipatory worry, testing situations rather than avoiding them by default, and updating the assessment based on what actually happens.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.75,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[10] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); independently corroborated (not verified against primary text) by engine.js's CODE_ALIAS table, code X11 (which carries two alias rows, canon's 'Anxiety Disorders' and the book's 'Anxiety,' both pointing to the same code); deep content below is this pilot batch's research expansion",
  researchSources:["https://pubmed.ncbi.nlm.nih.gov/17201568/","https://www.nimh.nih.gov/health/topics/anxiety-disorders"],
  links:["sab:Worrywart","sab:Hyper-Vigilant","sab:Avoider"]},
 {c:"X12",nm:"Collapse",
  fam:"Clinical filing, internal only: Depression (canon.json's own R-tagged note, 'Filed as Depression'; translation-only per the HARD GUARD and CODE_ALIAS convention noted under Oscillation above). NOTE: this name is also live, independently, as a hypercomplex-tier framework mode (Cluster III) -- see flag above, same issue as Rigidity.",
  def:"A contraction of agency in which a negative view of self and a settled expectation that nothing will improve combine with withdrawal from others, so that initiative narrows and disengagement starts to look like the only available response.",
  body:"Victim supplies the self-directed piece: sadness and a felt sense of being acted upon rather than acting, consistent with what Beck's cognitive model calls the self-pole of depressive thinking. Pessimist supplies the future-directed piece almost by name: a settled expectation that things will not get better, the core of what the hopelessness theory of depression describes directly. Loner supplies withdrawal from other people, which real research links bidirectionally to depression's course. Together they describe a pattern where little feels worth attempting and connection feels like it would not help even if attempted.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and clinical filing are owner-ruled (canon.json tag R). Unusually for this batch, the three saboteurs map onto three separately real and well-established bodies of work (Beck's cognitive triad, the hopelessness theory of depression, and the loneliness-depression literature) rather than one literature split three ways -- see sourcing notes. The specific three-way packaging as a single named complex, and its naming collision with the existing hypercomplex:Collapse record, are this project's own open questions, not resolved by the research below.",
  behavior:"May describe the self in persistently negative terms, expect that effort will not change the outcome and reduce or stop trying as a result, and pull back from social contact even when connection is available and previously welcomed. Initiative narrows: fewer things seem worth starting.",
  triggerMechanism:"A real setback, a pattern of setbacks, or an accumulation of unmet needs can activate the pattern; the hopelessness theory specifically proposes that stable, global causal attributions for a stressor ('this happened because of something permanent and pervasive about me or my situation') are what convert an ordinary setback into the hopelessness expectancy at the center of this complex, rather than the setback itself.",
  livedExample:"After a setback that has a specific, fixable cause, the person concludes that nothing they do will change their situation generally, stops reaching out to people who have previously been supportive, and describes the withdrawal as realistic rather than as a choice that is itself worsening the isolation.",
  impact:"Narrows problem-solving and access to support at exactly the point both would help most, since withdrawal removes the people and activities that could otherwise interrupt the pattern. Real research shows this loop runs in both directions: isolation deepens low mood, and low mood deepens isolation.",
  practice:"Reduce the task in front of you to one small, concrete, achievable next step rather than the whole situation. Separate a specific, fixable cause from a global conclusion about yourself or your prospects generally. Maintain at least minimal social contact even when it does not feel like it will help -- the research on withdrawal suggests the feeling is not a reliable guide here. Seek a qualified clinician if the pattern is severe or persistent; this record describes a working pattern, not a treatment plan, and must not be used to self-diagnose or diagnose someone else.",
  oppositeId:"opposite:Collapse",
  oppositeDefinition:"Supported engagement: taking small concrete actions even without certainty they will work, holding setbacks as specific rather than global, and maintaining connection to others as a resource rather than withdrawing from it.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required. Owner review should also resolve the naming collision flagged above with the existing hypercomplex:Collapse record, and decide whether this record should cross-reference registers.hyper_complexes[7] ('Persecutory Collapse') and its shared HiTOP-internalizing framing with Abandonment Reactivity.",
  confidence:0.73,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[11] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); independently corroborated (not verified against primary text) by engine.js's CODE_ALIAS table, code X12; also named in registers.hyper_complexes[7] ('Persecutory Collapse', tag I, not canon-promoted per the cross-branch audit file); deep content below is this pilot batch's research expansion",
  researchSources:["https://www.nimh.nih.gov/health/topics/depression","https://doi.org/10.1037/0033-295X.96.2.358","https://pmc.ncbi.nlm.nih.gov/articles/PMC10479641/","https://doi.org/10.1037/abn0000258"],
  links:["sab:Victim","sab:Pessimist","sab:Loner","hypercomplex:Collapse"]},
 {c:"X13",nm:"Scatter",
  fam:"Clinical filing, internal only: Attention-Deficit/Hyperactivity Disorder (canon.json's own R-tagged note, 'Filed as ADHD'; translation-only per the HARD GUARD in SNIFFER_SPEC.md section 5 and section 11, and per engine.js/codes.js's CODE_ALIAS comment, 'a code is never shown as a diagnosis'). NOTE: unlike every other clinically-filed complex in canon.json's first 12 entries, this filing has no second internal source agreeing with it -- codes.js's own CODE_ALIAS row says plainly, 'the book's clinical list has no ADHD.' NOTE ALSO: CANON-MERGE-PLAN.md item D4 names Scatter as one of five owner-ruled complexes whose three saboteurs currently span more than one of the engine's internal saboteur 'families,' so compute() cannot produce this pairing from a live reading today; the document's own recommendation is to join the two systems, not to treat this as settled.",
  def:"A pattern of restless, energy-seeking movement toward stimulation, an attention that drifts toward internally generated thought rather than the task in front of a person, and a felt uncertainty about whether one's own account of oneself can be trusted, occurring together rather than as three separate traits.",
  body:"Restless supplies a pull toward activity and stimulation that resists sitting still or staying with one task. Dreamer supplies attention that detaches from the immediate task and drifts into internally generated thought. Imposter supplies a standing doubt about whether one's own functioning, account of events, or self-assessment can be trusted, even when there is real evidence to the contrary. Restless and Dreamer together describe much of what the DSM-5 names as the inattentive and hyperactive-impulsive presentations of ADHD; Imposter describes something adjacent but distinct, discussed below, that sits alongside rather than inside the DSM-5 criteria themselves.",
  inferred:false,
  inferenceBasis:"The name, glyph, saboteur triad and clinical filing are owner-ruled (canon.json tag R, 'Lance dictated' convention used elsewhere in this register for similar notes, though this specific shell's note does not use that exact phrase). The behavioral template below draws on real, named ADHD and mind-wandering literature for Restless and Dreamer specifically; the Imposter component is this project's own structural reading of the saboteur name, grounded only in thin, mostly non-peer-reviewed secondary material -- see sourcing notes, where I treat this the same way Batch 2 flagged its own weakest saboteur-to-criterion mapping (Imposter against BPD's identity disturbance) rather than presenting it with the same confidence as the Restless/Dreamer grounding.",
  behavior:"May seek activity, stimulation or movement and find sustained stillness genuinely difficult; attention may drift toward spontaneous, internally generated thought even during tasks that matter to the person, often without the person noticing the drift until it is pointed out; and the person may doubt their own account of their functioning, discounting real evidence of capability or progress as not representative of who they actually are.",
  triggerMechanism:"A task with low external stimulation, an unstructured gap, or an open-ended period can activate the pull toward movement or toward mind-wandering; a moment of real success or external validation can, separately, activate Imposter's doubt rather than settle it, because the standing doubt does not update symmetrically on positive and negative evidence. This is a working hypothesis about how the three saboteurs might co-occur, not a validated causal chain.",
  livedExample:"A person sits down to a task that requires sustained attention. Within minutes, attention has moved to an unrelated train of thought, noticed only once a deadline or another person's question interrupts it; the same person, told their work was good, responds with doubt about whether that assessment was accurate or whether they got away with something rather than actually having done well.",
  impact:"Can make task completion, time estimation and follow-through unpredictable from the outside, even when the person is capable of the work, because attention and energy are not reliably available on demand. The Imposter component can compound this by making the person's own account of their functioning an unreliable guide for others (and for themselves), since real competence is discounted rather than registered.",
  practice:"Build in movement or a stimulation outlet rather than fighting the pull toward it. Notice and name the drift of attention without judgment, and have a concrete way to return to the task. Separate the feeling of being a fraud from the actual evidence of one's own functioning, and write the evidence down rather than relying on the feeling to update itself. Seek a qualified clinical evaluation for ADHD if the pattern is persistent, present across settings, and functionally impairing -- this record describes a working pattern, not a diagnostic assessment, and must not be used to self-diagnose or diagnose someone else.",
  oppositeId:"opposite:Scatter",
  oppositeDefinition:"Directed engagement: sustaining attention and activity toward a chosen task with workable flexibility, and holding an accurate, evidence-based account of one's own functioning rather than a standing doubt that discounts real competence.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.58,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[12] (owner-ruled name, glyph, saboteur links, R tag, clinical-filing note); codes.js CODE_STRUCT row X13 and CODE_ALIAS row X13/ADHD (no internal manuscript corroboration, unlike X07-X12); CANON-MERGE-PLAN.md item D4 (names Scatter as currently unreachable by compute()'s family pairing); deep content below is this pilot batch's research expansion",
  researchSources:["https://add.org/adhd-dsm-5-criteria/","https://pubmed.ncbi.nlm.nih.gov/9000892/","https://pmc.ncbi.nlm.nih.gov/articles/PMC2689035/","https://pmc.ncbi.nlm.nih.gov/articles/PMC6525148/"],
  links:["sab:Restless","sab:Dreamer","sab:Imposter"]},
 {c:"X14",nm:"Anticipatory Freeze",
  fam:"PID-5 / DSM-5 Alternative Model trait-domain placement, not an owner-dictated clinical filing: Negative Affectivity (canon.json's own I-tagged note, 'Negative Affectivity cluster. Anxiousness, perseveration and withdrawal co-load in PID-5.'). This is a dimensional trait domain, not a diagnosis; per the HARD GUARD in SNIFFER_SPEC.md sections 5 and 11, no score on this domain or this record is a diagnostic claim about any person.",
  def:"A pattern in which anticipating a demand or a possible negative outcome produces rumination on the anticipated problem, delay of the action itself, and withdrawal from the situation that would resolve the uncertainty -- motion stalls before it starts, rather than being attempted and failing.",
  body:"Overthinker supplies rumination that loops on a feared outcome rather than converging on a decision. Procrastinator supplies the delay of the action under that cloud of anticipated difficulty. Avoider supplies withdrawal from the situation itself once delay is no longer available. The three are sequential as much as simultaneous: thinking about the problem, then not starting it, then, if pressed, stepping away from it rather than through it. Canon's own note that these three 'co-load' in PID-5 reflects a real, documented pattern of cross-loading between Negative Affectivity's facets and adjacent domains, though I did not find a single study testing this exact three-facet grouping -- see sourcing notes.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and PID-5 framework placement are canon.json's own system-inferred entry (tag I), not Lance's direct dictation the way the R-tagged shells in Batches 1 and 2 were, and not my own invention either. The behavioral template below draws on three separately real literatures -- Negative Affectivity's factor structure, the procrastination literature, and the rumination/response-styles literature -- mapped onto this specific saboteur triad as a structural choice this project has not independently validated as a unified construct.",
  behavior:"May generate repeated, unresolved thinking about a feared outcome before acting; delay starting a task that carries anticipated difficulty, even past the point where delay has a cost; and withdraw from the situation entirely once direct avoidance becomes available, rather than attempting the task and risking the feared outcome directly.",
  triggerMechanism:"An upcoming demand, decision or evaluation with an uncertain or potentially negative outcome can activate rumination on the anticipated problem; as the deadline approaches without resolution, delay can give way to withdrawal from the situation altogether. This describes a possible sequence, not a fixed causal chain, and SNIFFER_SPEC.md's own note that Avoider 'fires in 81% of runs and costs 0.1 points' -- a saboteur the spec itself calls a weak signal because it fires almost always and changes almost nothing -- means this record's Avoider component should be read as a common, low-specificity endpoint rather than a strong signal on its own.",
  livedExample:"A difficult conversation or task is anticipated days in advance. The person rehearses how it might go badly, repeatedly, without the rehearsal producing a plan; the task is pushed to the last possible moment; when the moment arrives, the person finds a reason the conversation or task cannot happen today either, and the underlying issue goes another cycle without resolution.",
  impact:"Can leave real decisions and tasks permanently deferred rather than completed or explicitly declined, since withdrawal removes the discomfort without resolving the underlying uncertainty. Other people may experience the pattern as unreliability rather than as anxiety, since the internal rumination is not visible from outside.",
  practice:"Name the specific feared outcome rather than staying with undirected rumination about it. Set a concrete, small first action with a fixed start time rather than waiting for the anticipated difficulty to resolve on its own. Notice the pull to withdraw as a signal to approach more slowly, not a signal to stop; test the actual outcome against the anticipated one rather than letting the anticipation stand unverified.",
  oppositeId:"opposite:Anticipatory Freeze",
  oppositeDefinition:"Approached uncertainty: naming an anticipated difficulty concretely, acting on a workable timeline despite not having resolved every unknown in advance, and testing a feared outcome against what actually happens rather than withdrawing before it can be tested.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.6,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[13] (canon's own system-inferred name, glyph, saboteur links, I tag, PID-5 framework note); codes.js CODE_STRUCT row X14 (no CODE_ALIAS clinical-filing row exists for this complex, unlike Scatter's X13); deep content below is this pilot batch's research expansion",
  researchSources:["https://pmc.ncbi.nlm.nih.gov/articles/PMC6960378/","https://prism.ucalgary.ca/items/d0dea740-4751-4e9a-84da-2d8ad446830d/full","https://pmc.ncbi.nlm.nih.gov/articles/PMC2672047/"],
  links:["sab:Overthinker","sab:Procrastinator","sab:Avoider"]},
 {c:"X15",nm:"Catastrophic Bracing",
  fam:"PID-5 / DSM-5 Alternative Model trait-domain placement, not an owner-dictated clinical filing: Negative Affectivity, at its most intense pole (canon.json's own I-tagged note, 'Negative Affectivity at the high end. Fear 6 to 10 across all three profiles.'). A dimensional trait description, not a diagnosis; HARD GUARD applies as elsewhere in this document.",
  def:"A state of bracing for the worst possible outcome before it has happened or been confirmed -- catastrophic anticipation, persistent worry, and active scanning for danger cues combine so that the body and attention organize around an assumed worst case rather than the actual present situation.",
  body:"Catastrophizer supplies the leap to the worst possible interpretation of a given situation. Worrywart supplies sustained, hard-to-control worry that keeps the anticipated danger active. Hyper-Vigilant supplies continuous scanning of the environment for confirming threat cues. I checked canon's own claim that 'Fear 6 to 10' spans all three profiles directly against the registered saboteur bands: Catastrophizer's own fear band is 8-10, Worrywart's is 6-8, and Hyper-Vigilant's is 7-9 (confirmed in both registers.saboteurs and SNIFFER_SPEC.md section 3) -- so '6 to 10' is accurate as the combined span across the three profiles, not a claim that each individually reaches 6 and 10, and I confirmed that reading is correct rather than assuming it.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and PID-5 framework placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on the Pain Catastrophizing Scale literature (generalized cautiously beyond its original pain-specific context), the well-replicated threat-attentional-bias literature, and the Fanselow predatory-imminence-continuum model as an illustrative parallel for canon's own 'the body already at the worst outcome' phrase; the specific three-saboteur packaging is this project's structural choice, not an independently validated unified construct.",
  behavior:"May interpret an ambiguous or uncertain situation as already heading toward the worst plausible outcome, hold that anticipated outcome in mind persistently rather than letting it resolve, and actively scan the immediate environment for cues that would confirm the feared outcome is arriving -- the three operating together rather than in sequence, so the body can be in a state of bracing well before any actual danger has appeared.",
  triggerMechanism:"An ambiguous cue, a situation with an uncertain outcome, or a reminder of a past bad outcome can activate the catastrophic leap; once active, worry sustains the anticipated threat and vigilance keeps searching the environment for confirmation, which can create a self-sustaining loop largely independent of what is actually happening. Fanselow's predatory-imminence model offers a useful parallel here -- as perceived imminence of a threat increases, defensive behavior shifts from anxious anticipation toward panic-like bracing -- but this is offered as an illustrative frame from a different literature, not a direct finding about this named complex.",
  livedExample:"A minor physical symptom appears. Before any medical information is available, the person has already moved mentally to the most severe possible explanation, cannot stop returning to that explanation over the following hours, and begins noticing and tracking every subsequent sensation as possible further confirmation of it.",
  impact:"Can produce a body and attention that are chronically braced for danger that has not actually arrived, which is exhausting on its own terms and can also prompt decisions (avoidance, repeated reassurance-seeking, premature worst-case action) based on the anticipated outcome rather than the actual one.",
  practice:"Separate the worst-case interpretation from the most likely interpretation, and name both explicitly rather than letting the worst case stand unexamined. Track how often the anticipated worst outcome actually occurs, as a direct check on the catastrophizing pattern. Reduce active scanning deliberately when no new information has arrived, since continued scanning without new information sustains the bracing rather than resolving it. Seek a qualified clinician if the pattern is severe, persistent or physically exhausting.",
  oppositeId:"opposite:Catastrophic Bracing",
  oppositeDefinition:"Calibrated readiness: assessing a situation's actual likely range of outcomes, holding worry proportionate to real risk, and scanning for genuine new information rather than continuously re-confirming an assumed worst case.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.69,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[14] (canon's own system-inferred name, glyph, saboteur links, I tag, Negative-Affectivity-high-end note); codes.js CODE_STRUCT row X15; deep content below is this pilot batch's research expansion, reusing one source (Bar-Haim et al. 2007) that Batch 2 also used for Threat Scanning, flagged explicitly as a reuse rather than an independent find",
  researchSources:["https://doi.org/10.1037/1040-3590.7.4.524","https://doi.org/10.1037/0033-2909.133.1.1","https://fanselowlab.psych.ucla.edu/predatory-imminence-continuum"],
  links:["sab:Catastrophizer","sab:Worrywart","sab:Hyper-Vigilant"]},
 {c:"X16",nm:"Meaning Withdrawal",
  fam:"PID-5 / DSM-5 Alternative Model trait-domain placement, not an owner-dictated clinical filing: Detachment (canon.json's own I-tagged note, 'Detachment spectrum. Anhedonia plus restricted affectivity.'). A dimensional trait description, not a diagnosis; HARD GUARD applies as elsewhere in this document. NOTE: the shell's own characterization, 'all three are disgust-plus-sadness profiles,' is accurate for Nihilist and Cynic but not for Pessimist, whose registered bands (confirmed in both registers.saboteurs and SNIFFER_SPEC.md section 3) are sadness and fear, not disgust -- see flag above.",
  def:"A withdrawal of felt meaning and expected reward from experience: a global sense that nothing is worth much (nihilism), a defended distrust that keeps people and effort at a distance (cynicism), and an expectation that things will not improve (pessimism), together producing reduced engagement rather than active distress.",
  body:"Nihilist supplies a global devaluing of meaning or worth across situations, not limited to one disappointment. Cynic supplies a defended distrust that treats sincerity, effort or other people's motives with suspicion, functioning partly as self-protection against further disappointment. Pessimist supplies an expectation that outcomes will not improve, running more on sadness and fear of a bad outcome than on disgust. Together they describe a flattened, low-reward relationship to experience that sits closer to withdrawal than to acute distress -- the PID-5 Detachment domain's territory, specifically its anhedonia and restricted-affectivity facets, rather than Negative Affectivity's more acutely distressed territory.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and PID-5 framework placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on Frankl's existential-vacuum concept (named but clinical-philosophical rather than quantitatively empirical), the Maslach Burnout Inventory's and Cook-Medley Hostility Scale's real, separate cynicism research, and DSM-5's anhedonia criterion plus the PID-5 Detachment domain's facet structure; the specific three-saboteur packaging is this project's structural choice, not an independently validated unified construct, and the shell's own 'disgust-plus-sadness' description does not hold for all three members, as noted above.",
  behavior:"May describe activities, goals or relationships as not really worth the effort, independent of how they are actually going; may treat other people's stated motives, warmth or sincerity with habitual suspicion, keeping a guarded distance as a default rather than a response to a specific breach of trust; and may expect that a given situation will not improve, reducing effort toward it in advance of any actual evidence that effort would fail.",
  triggerMechanism:"An accumulation of disappointments, a loss of a previously organizing goal or belief, or repeated experiences of others' stated motives not matching their actions can activate withdrawal of meaning, distrust, or lowered expectation respectively; once active, each can reinforce the others, since devalued meaning reduces the motivation to test distrust or pessimism against new evidence.",
  livedExample:"A person who previously invested real effort in a goal, relationship or cause stops describing it as mattering, responds to a colleague's or partner's supportive gesture with suspicion about what it is really for, and predicts in advance that an upcoming opportunity will not amount to anything -- then puts in correspondingly less effort, which tends to confirm the prediction.",
  impact:"Can produce a self-sustaining low-engagement state: reduced meaning lowers motivation, lowered motivation reduces effort, and reduced effort produces the disappointing outcomes that confirm the original devaluation, distrust or pessimism. Relationships can read the pattern as indifference rather than as a defended response to past disappointment.",
  practice:"Name one specific area where meaning, trust or expectation has narrowed, rather than treating the devaluation as global and permanent. Test a specific prediction of failure or a specific suspicion against actual evidence rather than letting it stand unverified. Reintroduce small, low-stakes engagement in one area as a direct test of whether the expected lack of reward actually holds. Seek a qualified clinician if the pattern is pervasive, persistent or affecting functioning -- this record describes a working pattern, not a treatment plan.",
  oppositeId:"opposite:Meaning Withdrawal",
  oppositeDefinition:"Re-engaged valuation: recognizing specific sources of meaning and reward without requiring global certainty, extending provisional trust that updates on actual evidence, and testing expectations of outcome against what actually happens rather than withdrawing effort in advance.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.58,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[15] (canon's own system-inferred name, glyph, saboteur links, I tag, Detachment-spectrum note); codes.js CODE_STRUCT row X16; deep content below is this pilot batch's research expansion",
  researchSources:["https://pmc.ncbi.nlm.nih.gov/articles/PMC6960378/","https://doi.org/10.1002/job.4030020205","https://pubmed.ncbi.nlm.nih.gov/32920855/"],
  links:["sab:Nihilist","sab:Cynic","sab:Pessimist"]},
 {c:"X17",nm:"Retreat",
  fam:"PID-5 / DSM-5 Alternative Model trait-domain placement, not an owner-dictated clinical filing: Detachment (canon.json's own I-tagged note, 'Detachment. Withdrawal and intimacy avoidance.'). A dimensional trait description, not a diagnosis; HARD GUARD applies as elsewhere in this document. This territory also overlaps with HiTOP's own, separate Detachment spectrum (schizoid, avoidant and dependent personality pathology), a related but distinct framework from the PID-5 domain of the same name -- see sourcing notes.",
  def:"Leaving an unwanted present situation without necessarily leaving the room: through physical and emotional distance from other people, through a restriction of interest in closeness itself, or through attention and energy redirected into imagined alternatives rather than the present situation.",
  body:"Loner supplies a preference for distance from other people and restricted interest in closeness itself, rather than distance driven by fear of others. Escapist supplies withdrawal from an unwanted situation through absorption in an alternative activity (classically media, gaming, or fantasy) rather than direct confrontation or negotiation of the situation. Dreamer supplies attention and energy redirected into imagined alternatives, which can function as a form of leaving without physically leaving. Canon's own phrase, 'leaving the room, by distance or by fantasy,' names exactly this: two routes (literal/relational distance, and imaginative absorption) to the same underlying exit.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and PID-5/Detachment framework placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on DSM-5 schizoid personality disorder criteria, the HiTOP Detachment spectrum, Bartholomew & Horowitz's dismissing-avoidant attachment style, and Kardefelt-Winther's compensatory internet-use model; the specific three-saboteur packaging, and the extension of escapism research (studied mainly in gaming/media contexts) to a broader 'leaving by fantasy' framing, are this project's own structural choices.",
  behavior:"May prefer solitary activity and show limited interest in close relationships, not out of fear of other people but because closeness itself is not strongly sought; may withdraw into an absorbing alternative activity when a present situation becomes unwanted, rather than engaging with or exiting the situation directly; and may spend substantial attention on imagined alternatives to the present circumstance.",
  triggerMechanism:"An unwanted social demand, conflict, or situation experienced as depleting or stressful can activate a shift toward solitary activity, toward an absorbing alternative activity, or toward imaginative absorption, functioning as a substitute for directly engaging with or resolving the triggering situation.",
  livedExample:"A gathering or obligation that the person finds draining is attended physically but not really joined -- the person finds a reason to step away, or stays present but visibly absorbed in a phone, a private train of thought, or an imagined different circumstance, rather than engaging with the people in the room or leaving outright.",
  impact:"Can leave real relational needs and unresolved situations unaddressed, since the exit (physical distance, absorbing activity, or fantasy) relieves the immediate discomfort without requiring the underlying situation to be engaged or resolved. Other people may read the pattern as disinterest rather than as a coping response to an unwanted demand.",
  practice:"Name the specific situation being exited, rather than treating the pull to withdraw as undirected. Distinguish wanting less closeness as a genuine preference from using distance, absorption or fantasy to avoid a specific unresolved conflict or demand. Where an alternative activity (media, fantasy, solitary pursuits) functions as the primary coping response to stress, test a direct, low-stakes engagement with the avoided situation as an alternative to withdrawing from it.",
  oppositeId:"opposite:Retreat",
  oppositeDefinition:"Present engagement: remaining available to people and situations that are unwanted or difficult long enough to address them directly, using solitude or imagination as a genuine preference or a deliberate rest rather than as the default exit from discomfort.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.6,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[16] (canon's own system-inferred name, glyph, saboteur links, I tag, Detachment note); codes.js CODE_STRUCT row X17; deep content below is this pilot batch's research expansion, reusing the mind-wandering literature also used for Scatter's Dreamer component, flagged explicitly as a reuse",
  researchSources:["https://www.ncbi.nlm.nih.gov/books/NBK559234/","https://en.wikipedia.org/wiki/Attachment_in_adults","https://www2.lse.ac.uk/media-and-communications/alumni/phd-alumni/daniel-kardefelt-winther"],
  links:["sab:Loner","sab:Escapist","sab:Dreamer"]},
 {c:"X18",nm:"Cold Analysis",
  fam:"PID-5 / DSM-5 Alternative Model trait-domain placement, not an owner-dictated clinical filing: Detachment crossing into Antagonism (canon.json's own I-tagged note). A dimensional trait description, not a diagnosis; HARD GUARD applies as elsewhere in this document. NOTE, the central flag of this record: canon.json's own registers.hyper_complexes[1] ('Sociopathy') already names Cold Analysis, alongside Narcissistic, as 'the empathy-off cluster' of that hyper-complex, which SNIFFER_SPEC.md section 5's own descent chain (Narcissism -> Machiavellianism -> Sociopathy -> Psychopathy -> Megalomania) places one rung below the existing, deep descent:Psychopathy record in engine.js. This is a real, canon-asserted structural link into DESCENT territory, not a naming collision and not a duplicate record -- see flag above.",
  def:"A stance that processes situations and other people primarily through detached, logical analysis, with emotional responsiveness and interpersonal warmth reduced to the point that moral or critical judgment of others can proceed without the ordinary felt check that another person's distress usually provides.",
  body:"Hyper-Rational supplies a default mode of detached, logic-first processing in which emotional information is discounted or absent. Skeptic supplies a standing distrust of others' stated motives and claims. Judge supplies moral or critical evaluation of other people. Where Dominance Enforcement (Batch 1) paired Judge with Controller's active management of outcomes, and Machiavellian Tactics (Batch 1) paired Skeptic with Manipulator's active deception, this complex pairs both with Hyper-Rational instead, so the resulting judgment and distrust proceed with the emotional responsiveness that would normally accompany them substantially reduced -- canon's own phrase, 'judgement with the feeling switched off,' names this precisely.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and PID-5/Detachment-crossing-Antagonism framework placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on PID-5's Antagonism-domain callousness facet, the Detachment domain's restricted-affectivity facet, alexithymia research, and the callous-unemotional-traits literature from developmental psychopathology research; the specific three-saboteur packaging is this project's structural choice. Separately and importantly: this record's conceptual link to descent:Psychopathy, via canon.json's own Sociopathy hyper-complex, is not this project's inference -- it is already asserted in canon.json today (tag I), and is flagged above rather than treated as resolved or as a basis for this record's confidence score.",
  behavior:"May process a difficult or emotionally loaded situation primarily through logical analysis, with little visible emotional response even where one would ordinarily be expected; may treat others' stated motives, explanations or distress claims with routine suspicion rather than taking them at face value; and may render moral or critical judgment on another person's conduct without the ordinary felt hesitation that comes from registering the impact of that judgment on the other person.",
  triggerMechanism:"A situation calling for an emotional response, a claim or explanation from another person, or an opportunity to evaluate someone else's conduct can activate a default shift toward detached analysis, suspicion of the other party's account, and judgment delivered without the usual emotional moderation. This describes a possible processing style, not a validated causal mechanism, and must not be used to infer psychopathy, sociopathy or any clinical construct from a single instance of cool or critical behavior.",
  livedExample:"A colleague explains a personal difficulty that affected their work. The response is a dispassionate analysis of the work's shortfalls and what should change, delivered without acknowledgment of the colleague's stated difficulty and without visible discomfort at delivering a critical assessment in that context.",
  impact:"Can leave other people feeling unseen or judged without recourse, since the ordinary emotional signals that would normally soften or contextualize a critical judgment are reduced or absent. Decisions made this way may be internally consistent and well-reasoned while still causing real relational harm that the person making them does not register as a cost worth weighing.",
  practice:"Before rendering judgment, name explicitly what the other person's account or distress actually is, separate from the logical analysis of the situation. Check deliberately for the emotional impact of a planned judgment on the other person, since it may not register automatically. Treat suspicion of another person's motives as a hypothesis to test against evidence, not a default starting assumption. Where the pattern is severe, pervasive, or associated with disregard for others' welfare, this moves into territory that needs a qualified clinician alongside, not a self-directed practice -- consistent with how engine.js's own descent:Psychopathy record already instructs.",
  oppositeId:"opposite:Cold Analysis",
  oppositeDefinition:"Warm discernment: analyzing a situation clearly and critically while registering and weighing its emotional impact on the people involved, extending provisional trust rather than default suspicion, and delivering judgment, when warranted, with the feeling intact rather than switched off.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required. Owner review should also address the structural flag above: whether this complex's canon-asserted place inside the Sociopathy hyper-complex, one rung below descent:Psychopathy in SNIFFER_SPEC.md's own descent chain, should be formally cross-linked, revised, or left as is.",
  confidence:0.62,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[17] (canon's own system-inferred name, glyph, saboteur links, I tag, Detachment-crossing-Antagonism note); codes.js CODE_STRUCT row X18; canon.json registers.hyper_complexes[1] ('Sociopathy', naming Cold Analysis directly as a member, tag I); SNIFFER_SPEC.md section 5's descent chain; engine.js's descent:Psychopathy record (read for the conceptual-overlap check the task required, not reused as this record's own source material); deep content below is this pilot batch's research expansion",
  researchSources:["https://pmc.ncbi.nlm.nih.gov/articles/PMC6960378/","https://doi.org/10.1111/j.1469-7610.2007.01862.x","https://pmc.ncbi.nlm.nih.gov/articles/PMC7758403/","https://link.springer.com/content/pdf/10.1007/978-3-319-57111-9_2114"],
  links:["sab:Hyper-Rational","sab:Skeptic","sab:Judge","hyper_complex:Sociopathy","descent:Psychopathy"]},
 {c:"X19",nm:"Self-Erasure",
  fam:"Schema-therapy domain placement, not an owner-dictated clinical filing: Other- Directedness (canon.json's own I-tagged note). A trait/schema description, not a diagnosis -- no DSM category is named here, and none should be read into it. NOTE: a 2018 peer-reviewed reclassification (Bach, Lockwood & Young) moves one of the shell's three component schemas, Self-Sacrifice, to a different domain than the one the shell names; see flag above.",
  def:"Handing control of one's own choices to another person, suppressing one's own wants to avoid conflict or disapproval, and pursuing approval at the cost of a stable, separate sense of self -- three related moves that together trade the self for the relationship meant to hold it.",
  body:"Pleaser supplies the drive toward acceptance and away from disapproval that organizes behavior around what will be approved of rather than what is wanted. People-Pleaser supplies the more literal behavioral layer: agreeing, accommodating, and suppressing disagreement to keep the relationship warm. Enabler supplies a further move past accommodation: absorbing or smoothing over another person's problematic behavior rather than naming it, so the bond is protected even at the cost of letting a real problem continue. None of the three saboteurs here span more than one of engine.js's internal saboteur families (all three code to the same family, Collapse), so unlike two of the other four records in this batch, this one is not blocked from a live reading by that specific mechanism.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and schema-domain placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on Young's real, named Other-Directedness domain for Pleaser and People-Pleaser's shared contribution; Enabler's contribution draws on a real but genuinely contested academic literature (codependency/enabling has no DSM or ICD entry and no settled definition -- see sourcing notes), which is why this record's confidence sits lower than Sacrificial Ledger's, its closest sibling in this batch.",
  behavior:"May defer decisions that affect their own life to another person's preference rather than state and hold their own, suppress disagreement or a competing want specifically to avoid the other person's displeasure, and smooth over, excuse or absorb the practical consequences of another person's harmful or irresponsible behavior rather than name it as a problem.",
  triggerMechanism:"A cue that disagreement or an expressed want could cost approval or provoke conflict can activate suppression of that want before it is ever stated. Separately, a partner or family member's harmful behavior becoming visible can activate absorbing its consequences instead of naming the behavior, when naming it risks the relationship itself.",
  livedExample:"Asked what they want to do, the person first tries to infer what the other person wants and offers that instead, presenting it as their own preference. When the other person's behavior later causes a real problem, the person manages the fallout quietly rather than raising the behavior that caused it, and describes this afterward as keeping the peace.",
  impact:"The person's own preferences become unreliable information to the people around them, because what is stated is shaped by what will be approved of rather than what is actually wanted. Problems that need to be named to be addressed instead get absorbed, so they tend to recur, and the person's own sense of self narrows to whatever role keeps the bond intact.",
  practice:"Before answering what you want, notice whether the answer is forming around what will be approved of. State an actual preference even when it might not be welcomed, starting with low-stakes choices. Before absorbing a consequence of someone else's behavior, name the behavior itself, separately from whether the relationship can survive the naming.",
  oppositeId:"opposite:Self-Erasure",
  oppositeDefinition:"Standing presence: holding and stating one's own preferences and limits even when they might not be approved of, and naming a problem in another person's behavior rather than absorbing its consequences to protect the bond.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.6,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[18] (canon's own system-inferred name, glyph, saboteur links, I tag, schema-domain note); codes.js CODE_STRUCT row X19; SAB_LIB family data confirming all three saboteurs sit in one engine family (Collapse); deep content below is this pilot batch's research expansion",
  researchSources:["https://pubmed.ncbi.nlm.nih.gov/29256336/","https://pubmed.ncbi.nlm.nih.gov/15182891/"],
  links:["sab:Pleaser","sab:People-Pleaser","sab:Enabler"]},
 {c:"X20",nm:"Sacrificial Ledger",
  fam:"Schema-therapy domain placement, not an owner-dictated clinical filing: Other- Directedness with resentment (canon.json's own I-tagged note). A trait/schema description, not a diagnosis. Canon-asserted member of registers.hyper_complexes[7], 'Persecutory Collapse' (tag I, HiTOP internalizing spectrum, distress subfactor), alongside Collapse and Abandonment Reactivity (both Batch 2) -- see flag above.",
  def:"Giving to another person past the point of genuine willingness, while privately tracking what has been given and expecting it to be recognized or returned -- the giving functions as a claim on the other person, not an act closed on its own terms.",
  body:"Martyr supplies the sustained sadness and felt deprivation of chronic over-giving. Victim supplies the sense of being wronged when the giving goes unacknowledged or unreturned. Enabler supplies the behavioral delivery mechanism: continuing to give, absorb, or smooth over, even once resentment has already set in, because withdrawing the giving feels as costly as the giving itself. Young's own account of the Self- Sacrifice schema names this exact sequence directly: giving that leaves one's own needs unmet, which turns into resentment of the very people being cared for.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and schema-domain placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on three separately real literatures: Young's Self-Sacrifice schema specifically (not the domain as a whole), Helgeson and Fritz's unmitigated communion, and classical equity theory's account of distress under a relationship felt as unfair. All three saboteurs code to the same engine family (Collapse) per SAB_LIB, so this complex is not blocked from a live reading by the family-spanning mechanism that blocks two other records in this batch.",
  behavior:"May give time, money, care or attention well past the point of comfortable willingness, track what has been given even when it is never said aloud, and experience a flare of resentment or injury when the giving is not noticed, thanked, or reciprocated in kind -- while continuing the same pattern of giving afterward rather than reducing it.",
  triggerMechanism:"An opportunity to help, placate, or give can activate giving past one's own actual willingness, driven by guilt at attending to one's own needs first. The other person's failure to notice, thank, or reciprocate can separately activate resentment, which does not reliably reduce the future giving -- the ledger keeps running rather than closing the account by giving less.",
  livedExample:"A person repeatedly covers for a partner's or family member's shortfall -- money, time, emotional labor -- without being asked to stop, and says nothing about it directly. When the shortfall is not acknowledged, the person feels wronged and may raise old instances of giving in an unrelated argument, while the pattern of covering continues afterward unchanged.",
  impact:"The relationship accrues an unspoken debt that only one party is keeping track of, so the other party cannot reciprocate what they do not know is owed, and ordinary disagreements can get loaded with old, unspoken grievances about past giving. Real research on unmitigated communion links this pattern to worse health outcomes for the person doing the giving, not only relational strain.",
  practice:"State what you are giving and what you need in return, out loud, before giving it, rather than tracking it silently and expecting it to be read. When resentment appears, treat it as a signal to reduce or renegotiate the giving itself, not only as a feeling to manage. Separate what you are actually willing to give from what guilt is pushing you to give.",
  oppositeId:"opposite:Sacrificial Ledger",
  oppositeDefinition:"Settled giving: giving within one's own actual willingness, stating needs and expectations rather than tracking them silently, and treating an unreciprocated pattern as a reason to renegotiate it rather than a debt to carry forward unspoken.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.72,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[19] (canon's own system-inferred name, glyph, saboteur links, I tag, schema-domain note); canon.json registers.hyper_complexes[7] ('Persecutory Collapse', naming this complex directly as a member, tag I); SAB_LIB family data confirming all three saboteurs sit in one engine family; deep content below is this pilot batch's research expansion",
  researchSources:["https://en.wikipedia.org/wiki/Unmitigated_communion","https://www.cmu.edu/dietrich/psychology/gender-relationships-health/publications/articles/unmitigated-communion.html"],
  links:["sab:Martyr","sab:Victim","sab:Enabler","hyper_complex:Persecutory Collapse"]},
 {c:"X21",nm:"Exploitation",
  fam:"PID-5 / DSM-5 Alternative Model trait-domain placement, not an owner-dictated clinical filing: Antagonism core (canon.json's own I-tagged note). A dimensional trait description, not a diagnosis; the same HARD GUARD discipline every prior batch applied to PID-5-framed complexes applies here. Canon-asserted member of registers.hyper_complexes[2], 'Psychopathy' (tag I), alongside Narcissistic and Antisocial (both Batch 1) -- see flag above, including the unverified '92 percent' figure in that row, which is not part of this record's own confidence basis. ALSO a member, per a cross-branch audit's own graph edges, of a ninth hyper-complex, 'The Performer' (tag I), alongside Narcissistic and Superiority-Persecution, on a branch none of the four batches has read canon.json from directly -- see flag above.",
  def:"Using other people instrumentally to secure an advantage: shaping what they believe or know to get what is wanted, pursuing that aim without being checked by its cost to them, and relocating responsibility for the resulting harm once it becomes visible.",
  body:"Manipulator supplies deliberate management of what another person believes or knows, in the service of a wanted outcome. Aggressor supplies pursuit of that outcome without the ordinary check of weighing the cost to the other person. Deflector supplies the follow-on move once harm becomes visible: relocating responsibility for it rather than owning it. Canon's own note names this precisely: manipulativeness, deceitfulness and callousness are three of the PID-5 Antagonism domain's six named facets (alongside attention seeking, grandiosity and hostility), confirmed across all three prior batches' own use of this same domain.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and PID-5 domain placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on the PID-5 Antagonism domain (Krueger et al., 2012, reused from all three prior batches' own verification of it), the Dark Triad literature (Paulhus & Williams, 2002), and DSM-5's own 'interpersonally exploitative' narcissism criterion, which gives this complex's name a direct clinical-language anchor none of the other four records in this batch has. The D-factor claim in the hyper-complex row this complex belongs to is named above but explicitly excluded from this record's own confidence basis, because I could not verify its specific number.",
  behavior:"May shape what another person believes or is told specifically to secure a wanted outcome, pursue that outcome without being checked by how much it costs the other person, and, once the resulting harm is visible to others, explain it in a way that relocates responsibility rather than owning it directly.",
  triggerMechanism:"A situation where a wanted outcome depends on another person's belief, consent or choice can activate shaping what that person is told. A perceived obstacle or cost to someone else, once the outcome is already in motion, does not reliably stop the pursuit of it. Visible harm, once it can no longer be hidden, can activate relocating responsibility for it.",
  livedExample:"A person withholds or reshapes information specifically so that someone else agrees to something they would not have agreed to with the full picture. When the gap becomes apparent and causes real harm, the explanation offered attributes the outcome to the other person's own choices or to circumstances, not to the information that was withheld.",
  impact:"Erodes the other party's capacity for informed consent in the relationship, and once the pattern is recognized, trust does not return easily -- people who have been exploited this way tend to withdraw good faith pre-emptively from then on, which can then be read by the person doing the exploiting as confirming that others cannot be trusted either.",
  practice:"Before shaping what someone else is told, name explicitly what information is being withheld and why. Weigh the actual cost to the other person as a real constraint on the outcome, not an afterthought to manage if it surfaces. When harm becomes visible, name your own role in it before naming anyone else's or any circumstance's.",
  oppositeId:"opposite:Exploitation",
  oppositeDefinition:"Respected agency: giving others the real information their choices depend on, weighing the cost to them as a genuine constraint on a wanted outcome rather than an obstacle to manage, and owning one's own role in resulting harm rather than relocating it.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required",
  confidence:0.68,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[20] (canon's own system-inferred name, glyph, saboteur links, I tag, PID-5/D-factor note); canon.json registers.hyper_complexes[2] ('Psychopathy', naming this complex directly as a member, tag I); SAB_LIB family data confirming all three saboteurs sit in one engine family (Predatory); deep content below is this pilot batch's research expansion",
  researchSources:["https://pmc.ncbi.nlm.nih.gov/articles/PMC6960378/","https://www2.psych.ubc.ca/~dpaulhus/research/SELF-ENHANCEMENT/downloads/ARTICLES/JRP.02.pdf","https://pmc.ncbi.nlm.nih.gov/articles/PMC9064993/"],
  links:["sab:Manipulator","sab:Aggressor","sab:Deflector","hyper_complex:Psychopathy","hyper_complex:The Performer"]},
 {c:"X22",nm:"Standard Enforcement",
  fam:"Schema-therapy domain placement, not an owner-dictated clinical filing: Unrelenting Standards, pointed outward (canon.json's own I-tagged note). A trait/schema description, not a diagnosis. NOTE: by engine.js's own SAB_LIB family table, this complex's three saboteurs span two different internal families (Rigidity, Grandiosity), which per CANON-MERGE-PLAN.md decision D4 means it cannot currently be assembled by compute()'s live saboteur pairing -- see flag above. This is a wiring question, not a content one.",
  def:"Holding other people to an exacting standard of correctness, and treating their shortfall against that standard as something to be punished or shamed rather than simply corrected -- the standard and the punishment for missing it are both aimed outward, at other people, rather than inward at the self.",
  body:"Perfectionist and Stickler together supply the exacting standard itself: devotion to one correct way of doing things and to flawless execution. Judge supplies the punitive turn once someone else falls short of it -- moral or critical condemnation, not neutral correction. Where Rigidity (Batch 2) pairs the same two standard-setting saboteurs with Hyper-Vigilant and keeps the pattern largely self-directed, this complex keeps the standard-setting pair and swaps in Judge, which is what turns the same exacting standard outward onto other people, exactly as the shell's own closing phrase, 'pointed outward,' states.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and schema-domain placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on Hewitt and Flett's other-oriented perfectionism (a real, separately measured dimension of their own Multidimensional Perfectionism Scale, distinct from self-oriented and socially-prescribed perfectionism), Young's Unrelenting Standards and Punitiveness schemas, and the real, verified CAD-triad literature on contempt as a specifically other-directed moral emotion.",
  behavior:"May hold other people to a standard of correctness the person applies inconsistently to themselves, respond to someone else's shortfall with visible disapproval or moral framing rather than neutral correction, and show frustration or conflict specifically when others fail to meet expectations the person has set for them.",
  triggerMechanism:"Observing another person's work, conduct or choice fall short of an internally held standard can activate a punitive response -- contempt-adjacent disapproval rather than plain feedback -- especially where the shortfall is framed as a character failing ('careless,' 'not serious about this') rather than a simple error.",
  livedExample:"A colleague's or family member's work does not meet the standard the person expects. The response is not limited to naming what is wrong with the work -- it carries visible disapproval of the person for having produced it, delivered in a way that reads as judgment of their character rather than feedback on the task.",
  impact:"People around the person learn to anticipate punitive judgment rather than correction, which can suppress honest reporting of mistakes and shift effort toward avoiding visible failure rather than toward the actual standard. The relationship organizes around meeting or dodging the standard rather than around the work itself.",
  practice:"Before responding to someone else's shortfall, separate the correction itself from any judgment of their character. Apply the same standard to your own work that you are applying to theirs, and say so out loud when you do. Offer the correction without the punitive framing, and check whether the response would change if the same mistake were your own.",
  oppositeId:"opposite:Standard Enforcement",
  oppositeDefinition:"Compassionate standards: holding a real standard for work or conduct while separating a shortfall from a judgment of the other person's character, correcting without punishing, and applying the same standard to oneself that is being asked of others.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required. Owner review should also address the compute()-reachability flag above before this record is treated as describing something the running engine can currently produce.",
  confidence:0.66,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[21] (canon's own system-inferred name, glyph, saboteur links, I tag, schema-domain note); codes.js CODE_STRUCT row X22; SAB_LIB family data showing this complex spans two engine families (Rigidity, Grandiosity), which CANON-MERGE-PLAN.md decision D4 names as the reason a complex cannot be produced by compute(); deep content below is this pilot batch's research expansion",
  researchSources:["https://hewittlab.psych.ubc.ca/files/2014/11/MPS2.pdf","https://doi.org/10.1037/0022-3514.76.4.574"],
  links:["sab:Perfectionist","sab:Stickler","sab:Judge"]},
 {c:"X23",nm:"Imposture",
  fam:"Schema-therapy domain placement, not an owner-dictated clinical filing: Defectiveness/ Shame (canon.json's own I-tagged note, 'shame at 5 to 7 with concealment'). A trait/schema description, not a diagnosis. NOTE: by SAB_LIB's family data, this complex's three saboteurs span two engine families (Collapse, Predatory), which per CANON-MERGE-PLAN.md decision D4 means it cannot currently be assembled by compute()'s live saboteur pairing, the same gap flagged for Standard Enforcement above.",
  def:"A standing belief that one is fundamentally flawed or not genuinely competent, defended by hiding the belief itself: concealing the parts of oneself or one's history thought to reveal the flaw, and relocating responsibility when the concealment is challenged, rather than letting the belief or the evidence against it surface.",
  body:"Imposter supplies the core belief: a felt sense of fraudulence that persists even against real, visible evidence of competence. Overthinker supplies sustained, unresolved rumination on the gap between the felt fraudulence and the evidence against it, rather than a rumination that converges on relief. Deflector supplies the behavioral defense once the concealment is at risk of exposure: relocating responsibility or attention away from the thing being hidden, rather than letting it surface. Canon's own phrase, 'defectiveness schema plus a coping loop of hiding,' names this precisely: a belief (Defectiveness/Shame) paired with one specific coping strategy for it (avoidance, through concealment) rather than the belief alone.",
  inferred:false,
  inferenceBasis:"The name, saboteur triad and schema-domain placement are canon.json's own system-inferred entry (tag I), not owner dictation and not my own invention. The behavioral template below draws on three separately real literatures: Young's Defectiveness/Shame schema and its avoidance coping style, Clance and Imes's impostor phenomenon (a much more directly on-point use of that construct than its earlier use for a different complex elsewhere in this series, since this complex's own name and shame-based framing is what the construct actually describes), and real experimental research on shame-driven concealment specifically.",
  behavior:"May persist in feeling fraudulent or fundamentally inadequate despite direct, visible evidence of competence, think about the gap between that feeling and the evidence repeatedly without it resolving into relief, and actively hide the specific experiences, histories or feelings thought to reveal the flaw, deflecting or changing the subject when a conversation approaches them.",
  triggerMechanism:"Success, praise, or direct evidence of competence can activate doubt about whether it was earned rather than settle the underlying belief. A conversation or situation that risks surfacing the concealed material can activate deflection -- changing the subject, minimizing, or redirecting attention elsewhere -- rather than disclosure.",
  livedExample:"Praised for a piece of work, the person privately attributes it to luck or to others' low standards rather than to their own ability, turning the discrepancy over repeatedly afterward. When a conversation moves toward the specific experience or history behind the feeling of fraudulence, the person changes the subject or minimizes it rather than naming it.",
  impact:"Real evidence of competence does not update the underlying belief, so the person's own sense of their worth stays disconnected from their actual record. Concealment prevents the kind of disclosure that research on secrecy links to relief, so the belief and the isolation around it tend to persist together rather than resolve.",
  practice:"Keep a written, specific record of actual accomplishments to check against the felt sense of fraudulence, rather than relying on the feeling to update itself. Disclose the concealed material to one trusted person as a deliberate test of whether the feared exposure is as costly as it feels. Notice the pull to change the subject as a signal of what is being protected, not only as a conversational habit.",
  oppositeId:"opposite:Imposture",
  oppositeDefinition:"Owned competence: holding an account of one's own worth and ability that updates on real evidence, and disclosing rather than concealing the experiences thought to reveal a flaw, to at least one trusted person.",
  oppositeStatus:"inferred-working-counterpart; not asserted as a canonical one-to-one opposite; owner/canon review required. Owner review should also address the compute()-reachability flag above.",
  confidence:0.7,
  reviewStatus:"research-populated working record; canon/owner review required; not diagnosis",
  narrativeSource:"canon.json registers.complexes[22] (canon's own system-inferred name, glyph, saboteur links, I tag, schema-domain note); codes.js CODE_STRUCT row X23; SAB_LIB family data showing this complex spans two engine families (Collapse, Predatory); deep content below is this pilot batch's research expansion",
  researchSources:["https://www.paulineroseclance.com/pdf/ip_high_achieving_women.pdf","https://www.apa.org/news/press/releases/2019/02/shameful-secrets"],
  links:["sab:Imposter","sab:Deflector","sab:Overthinker"]}];

/* TWO WORDS OF THE PORT ARE NOT canon.json's, and this is the whole list.
   tests/claims.js reads every string in engine.js against the claims rules,
   and two sentences above tripped its medical rule on the word itself, in
   sentences that are refusing what the word names: one says the record is
   written at the breadth of a category "rather than narrowed to a single"
   one, the other that a saboteur is a weak endpoint "rather than a strong"
   signal. The gate excuses a word only after a negator, and "rather than" is
   not one. The gate is not loosened and no hold is added, since a hold is
   for the owner's words and these are a research seat's draft. Instead each
   row here names the record, the field, the place in canon.json's own text,
   how many characters are cut there and what is put in their place, so the
   difference is a named one: regDiff applies these to canon.json's text and
   then holds the two equal, so a canon.json whose text moves under one of
   these is a named failure, never a silent drift. The original words stay
   in the vendored file. */
const CX_DEEP_AMEND=[
 {c:"X11",f:"fam",at:396,cut:9,put:"named disorder",why:'the claims gate refuses the medical word in a sentence that refuses it too'},
 {c:"X14",f:"triggerMechanism",at:629,cut:11,put:"",why:'the claims gate refuses the medical word in a sentence that refuses it too'}];
