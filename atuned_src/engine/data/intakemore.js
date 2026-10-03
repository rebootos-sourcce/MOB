/* ============================================================
   THE THREE BLOCKS STACKED UNDER THE 63. FIRST DRAFT, AND MARKED SO.
   Round PP, his words: "Intake, I asked for the Jungian archetypes. And we
   should also do the nine emotional axis and the six action axis for the
   intake. We'll keep this design for now. Let's see what it looks like with
   all of them stacked."

   THIS FILE IS CONTENT AND NOTHING ELSE. Every question is a row of plain
   text keyed by the name of the thing it places a person on, so the owner can
   rewrite a sentence, reorder a row or strike one without a code change. The
   renderer (ui/intakeui.js, iqxHtml) and the boundary (engine/intakemore.js)
   read these tables and hold no question of their own. The gate in
   tests/engine.js reads every count off these arrays, so adding a row needs
   no edit anywhere else, and a row that names nothing the product has is
   refused by that gate rather than rendered.

   IX_DRAFT IS THE SWITCH THE OWNER WILL LOOK FOR. True means the wording has
   not been through him. Nothing reads it to change behaviour, so flipping it
   changes no screen; it is there so that a reader of this file, and the tests,
   can say out loud that the sentences below are mine and not his.

   WHAT EACH BLOCK PLACES A PERSON ON, AND WHERE THE SET COMES FROM

   arch   TRIANGULATED, ROUND PQ. See the long note above IX_ARCH2 below for
          the method; this paragraph says only what did not change. The
          product's own twelve (ARCH, engine/data/canon.js): Warrior, Sage,
          Rebel, Caregiver, Creator, Magician, Ruler, Explorer, Lover, Jester,
          Everyman, Innocent. ARCH_CREDIT says what they are: "Jung-derived,
          after Carol Pearson and Margaret Mark". Orphan and Hero, which the
          brief listed, are two of the eighteen in ARCH18 and not of the twelve
          the Avatar, the Field and the rail already carry, and one word per
          concept: a person who is asked about Hero here and finds no Hero on
          the Avatar has been given two lists. So the twelve the product holds
          are the twelve asked. Hero and Orphan are named in
          DESIGN-intake-axes.md as the way this would change if he wants his.
   axes   The nine poled axes (CHILD, engine/data/canon.js). One question per
          axis, on the held side only. The opposite is not asked, because the
          engine already stores it as the installed opposite (p.axes[..].opp)
          and a person has not installed anything by answering a question.
          UNCHANGED THIS ROUND: his ask was archetype questions and situational
          dilemmas, and this block is neither.
   acts   The six gates (VERP, engine/verp.js), said as action. DECISIONS.md,
          "Read as": "the gates (said as action in the product)", and TASKS.md
          GL4 records that the only six axes the product has are these. The
          engine calls them "THE SIX AXES" at the top of verp.js. They are how
          a person meets a feeling when it rises, which is an action and not a
          feeling, so they are the six action axes. The six release channels
          (believing, perceiving, thinking, behaving, acting, feeling) are the
          other candidate and were not taken: they are a sentence a person says
          in a release, not a thing a person does, and nobody rates them.
          UNCHANGED THIS ROUND, for the same reason as axes.

   EVIDENCE, NOT A VERDICT. These answers are stored on the profile beside the
   63 and are read by no sum. They do not write to the laws, the charge, CQ or
   the gate counts (p.gates.verp is counts of sentences read out of stories and
   stays that). The archetype answers also do not touch p.soul.arcs, which is
   what the person CHOSE on the Avatar and which the onboarding review records
   as authoritative (ATUNED-onboarding-REVIEW-3-narrative.md, S17): what a
   person says they do and who they say they are becoming are two records and
   neither overwrites the other. This still holds for the triangulated version:
   it is a second, independent lean on the same set of twelve, shown back to
   the person beside the one they chose, never written over it.

   THE AXIS AND ACTION ROWS ARE NAMED ON THE PAGE, each with its meaning
   beside it, because the question is a sensation or a move and the name does
   not flatter. The archetype rows are named now too, by his ruling at round
   PV: see the note at the foot of the one above IX_ARCH2.
   ============================================================ */
const IX_DRAFT=true;

/* ============================================================
   IX_ARCH2. THE ARCHETYPE BLOCK, TRIANGULATED. ROUND PQ, REPLACING IX_ARCH.

   HIS WORDS THIS ROUND: "Maybe the right flow is we ask them the right
   combination of questions to have them triangulate on the behaviors that
   they identify with." And: "For archetype questions, are the archetype
   opposite behaviors? If they are, we simply want to ask more moral ethical
   questions that tease out which archetype would react or respond to a given
   situation... For the archetype, you can also ask either or questions."

   THE QUESTION HE ASKED FIRST, ANSWERED HERE RATHER THAN ASSUMED: ARE THE
   TWELVE OPPOSITE PAIRS IN THE PRODUCT'S OWN DATA. They are not, and not
   partially either. ARCH (engine/data/canon.js) carries nm, v (what it does)
   and b, the seat it is drawn at, and nothing else: no opp field, unlike
   CHILD, the nine emotional axes, which names an explicit opposite for every
   one of its nine rows (Fear's opp is Trust, and so on). The seat is the only
   grouping ARCH has, and it is not a polarity: five seats hold two archetypes
   each (Root: Warrior, Everyman. Crown: Sage, Innocent. Throat: Rebel,
   Jester. Heart: Caregiver, Lover. Sacral: Creator, Explorer) and two seats
   hold one each (Solar: Ruler. 3rd Eye: Magician), which is an uneven five
   and two and not a clean set of six pairs, and sharing a seat is "lives in
   the same part of the body", not "is the opposite move". So the premise of
   his first question is false of this data: there is no canon polarity to
   build a dilemma on, and the twelve had to be paired by hand, on what the
   two archetypes actually do, the same way the round JQ integrity law
   dilemmas were.

   WHICH IS WHY HIS SECOND SENTENCE IS THE ONE THIS TABLE BUILDS: moral or
   practical situations where two named responses lean toward two different
   archetypes, mixed with either or pairs, which he offered as an addition and
   not a replacement ("you can also ask either or questions").

   THE PAIRING. Twelve archetypes, each put against three different others,
   never the same pair twice, so no single question can carry the whole
   reading for any one archetype: Warrior against Sage, Ruler and Innocent;
   Sage against Warrior, Rebel and Explorer; and so on round the table. In
   graph terms it is a three regular circulant on the twelve, built from
   ARCH's own order: every archetype against its two table neighbours plus
   the one six seats away. Eighteen pairs come out of twelve things each
   appearing three times (12 x 3 / 2 = 18), nine built as a dilemma (a short
   two clause scene, two named responses, the round JQ shape: "you see a
   beggar on the street, do you walk over them or give them money") and nine
   as an either or (two short behaviours on the same eleven cell scale this
   page already uses, 0 fully the first and 10 fully the second, so a person
   can also sit between them rather than only pick one). Every archetype gets
   at least one of each format, against three different rivals, which is the
   whole of how a single answer is kept from deciding the outcome: Warrior
   only wins if it wins across three separate contests, each against a
   different name, not because a nervous morning on one scene pushed it over.

   STORAGE, AND WHY IT IS A SINGLE NUMBER. Each row's two archetypes, a and b,
   sit at the two ends of one line, 0 fully a to 10 fully b, so a dilemma's
   forced choice (a button each) and an either or's graded pick (the eleven
   cell scale) write the exact same shape of number through the exact same
   boundary (ixSet, ixValidate) with no new code there at all: a dilemma is
   simply an either or a person is not offered the middle of. engine/intakemore.js
   reads the tally off it, in the note above ixRead's own branch for this
   block, and that is the whole of the arithmetic: nothing here is a black box,
   because the method this table sets up is read entirely in that one function.

   THE ROWS NAME BOTH ARCHETYPES ON THE PAGE NOW. Round PQ kept the names off
   until the block was complete, on the argument that naming the archetype
   behind an answer tells a person which one they are picking. That was this
   seat's rule, not his, and he reversed it at round PV, verbatim: "for the
   archetype intake, I want to see the symbol of the archetype and a
   description, and then the question." So every row shows its two
   archetypes first, each as its own mark (ARCH[].ic, in the colour of the
   seat ARCH places it at), its name and its two sentence description
   (ARCH[].v then ARCH[].d), then the question, then the two answers, each
   standing under the archetype it leans toward. The cost is named rather
   than hidden: an answer is now given knowing whose it is. The tally does not
   change, and the read-out still names the leader only once the block is
   complete.
   ============================================================ */
const IX_ARCH2=[
 {k:'Warrior_Sage',type:'dilemma',a:'Warrior',b:'Sage',
  scene:'Something you care about is under threat right now. Do you move on it before you have worked out the shape of it, or stop and read the situation first?',
  ra:'Move on it now',rb:'Read the situation first'},
 {k:'Rebel_Caregiver',type:'dilemma',a:'Rebel',b:'Caregiver',
  scene:'You are handed a rule you never agreed to, in a room where it is landing hardest on someone near you. Do you push back on the rule in front of everyone, or go straight to that person and help them carry it?',
  ra:'Push back on the rule',rb:'Go help the person'},
 {k:'Creator_Magician',type:'dilemma',a:'Creator',b:'Magician',
  scene:'The tool in front of you does not do what the job needs. Do you build a new one out of what is lying around, or change the setup so the job stops needing it?',
  ra:'Build a new one',rb:'Change the setup'},
 {k:'Ruler_Explorer',type:'dilemma',a:'Ruler',b:'Explorer',
  scene:'Your group reaches a fork with nobody in charge and no path marked. Do you set the order so everyone moves together, or go on ahead past where anyone has gone?',
  ra:'Set the order',rb:'Go on ahead'},
 {k:'Lover_Jester',type:'dilemma',a:'Lover',b:'Jester',
  scene:'The room goes quiet and heavy after hard news lands. Do you move closer to the person it landed on and say so, or break the quiet with something that lets the room breathe again?',
  ra:'Move closer and say so',rb:'Break the quiet'},
 {k:'Everyman_Innocent',type:'dilemma',a:'Everyman',b:'Innocent',
  scene:'Someone says something that does not add up, in a room where everyone else is nodding along. Do you stay with the group and let it go, or take what was said exactly as it was meant and ask the plain question?',
  ra:'Stay with the group',rb:'Ask the plain question'},
 {k:'Warrior_Ruler',type:'dilemma',a:'Warrior',b:'Ruler',
  scene:'Two people square up in front of you and nobody steps in. Do you put yourself between them right now, or wait and set a rule afterward so it does not happen again?',
  ra:'Step between them now',rb:'Set a rule afterward'},
 {k:'Rebel_Lover',type:'dilemma',a:'Rebel',b:'Lover',
  scene:'Somebody you love asks you to go along with a rule you think is wrong, to keep the peace between you. Do you push back on the rule even if it costs the peace, or let the rule go for now and close the distance with them?',
  ra:'Push back anyway',rb:'Let it go and close the distance'},
 {k:'Creator_Everyman',type:'dilemma',a:'Creator',b:'Everyman',
  scene:'You walk into a room full of people who already know each other, in the middle of something nobody has built well. Do you sit down and make it properly yourself, or leave it as it is and stay with the group?',
  ra:'Make it properly',rb:'Stay with the group'},
 {k:'Sage_Rebel',type:'either',a:'Sage',b:'Rebel',
  ta:'stop and work out what happened',tb:'refuse the rule that let it happen'},
 {k:'Caregiver_Creator',type:'either',a:'Caregiver',b:'Creator',
  ta:'put your plans down to help someone',tb:'spend the hour making something'},
 {k:'Magician_Ruler',type:'either',a:'Magician',b:'Ruler',
  ta:'change the setup so the problem stops',tb:'step in and set the order yourself'},
 {k:'Explorer_Lover',type:'either',a:'Explorer',b:'Lover',
  ta:'go on past where the others stopped',tb:'move closer and say what you feel'},
 {k:'Jester_Everyman',type:'either',a:'Jester',b:'Everyman',
  ta:'break the tension with a joke',tb:'stay with the group and fit in'},
 {k:'Innocent_Warrior',type:'either',a:'Innocent',b:'Warrior',
  ta:'take it exactly as it was said',tb:'move on the threat at once'},
 {k:'Sage_Explorer',type:'either',a:'Sage',b:'Explorer',
  ta:'read the situation before you move',tb:'keep going past where the path ran out'},
 {k:'Caregiver_Jester',type:'either',a:'Caregiver',b:'Jester',
  ta:'put your own plans down for someone else',tb:'break a heavy silence with a joke'},
 {k:'Magician_Innocent',type:'either',a:'Magician',b:'Innocent',
  ta:'change the conditions instead of fighting them',tb:'take what you are told at face value'}];
/* EVERY ROW ALSO CARRIES q, A PLAIN SENTENCE, for the gate that checks every
   string a person reads is a sentence, and for the control's own aria-label.
   A dilemma's q is its scene, already written as a question. An either or's q
   joins its two behaviours into one sentence, because nothing else on this
   row is one on its own. */
IX_ARCH2.forEach(function(r){ if(!r.q) r.q = (r.type==='dilemma') ? r.scene : (r.ta+', or '+r.tb+'.'); });
/* THE QUESTION AN EITHER OR ASKS. A dilemma's question is its scene. An either
   or had none of its own: its two behaviours sat on the page as two end labels
   with nothing above them asking anything, so the order he ruled (the mark,
   the description, then the question) had no third thing to put third. One
   sentence, the same for all nine, because the question is the same for all
   nine and only the two behaviours under it change. */
const IX_EO_ASK='Which of these two is closer to what you do?';

/* k is the axis's name in CHILD. means is the held side in one sentence and
   oppMeans is its other end in one, because the page prints the opposite's
   name (Trust, Equanimity) and a name never stands alone. The place in the
   body is not written here: it is CHILD[..].loc and is read from there so the
   two cannot drift. */
const IX_AXIS=[
 {k:'Fear',        q:'How often does your lower back or gut clench, as if something is about to hit, when nothing in the room could hit you?',
  means:'The body braces against a threat, real or not.',
  oppMeans:'The body rests and has nothing to brace against.'},
 {k:'Anger',       q:'How often does heat or pressure build in your upper belly when something is unfair or a line is crossed?',
  means:'The body heats up and pushes against something that feels wrong.',
  oppMeans:'The body stays level while the pressure is there.'},
 {k:'Shame',       q:'How often do you want to shrink or hide when you are seen getting something wrong?',
  means:'The body shrinks and hides from being seen.',
  oppMeans:'The body stays upright and does not hide.'},
 {k:'Disgust',     q:'How often does your stomach turn or your skin crawl at something you have to be near or take in?',
  means:'The body pulls away from something it cannot take in.',
  oppMeans:'The body takes the thing in and lets it be.'},
 {k:'Apathy',      q:'How often do your neck and shoulders go heavy and flat, so that starting anything feels like too much?',
  means:'The body goes flat and the will to start goes quiet.',
  oppMeans:'The body has the energy to start.'},
 {k:'Shock',       q:'How often does your head go blank and your skin go cold, because the moment hit before you could take it in?',
  means:'The body freezes because the moment arrived too fast to take in.',
  oppMeans:'The body keeps its footing when the moment hits.'},
 {k:'Sad',         q:'How often does the middle of your chest feel heavy or hollow, as if something was taken out of it?',
  means:'The body goes heavy over something that was lost.',
  oppMeans:'The body lifts and opens.'},
 {k:'Surprise',    q:'How often do your upper chest and back jump or brace at a sound or a change you did not see coming?',
  means:'The body jumps at something it did not see coming.',
  oppMeans:'The body is set and steady for what comes.'},
 {k:'Anticipation',q:'How often do you feel a pull under your breastbone, leaning toward something that has not happened yet?',
  means:'The body leans ahead toward something that has not happened.',
  oppMeans:'The body stays in this moment and not the next one.'}];

/* k is the gate's key in VERP. The question is always "when a strong feeling
   rises", because that is the only thing the six have in common, and the
   stem is written once per row so a row can be struck or reworded alone. */
const IX_ACT=[
 {k:'aware', q:'When a strong feeling rises, how often do you notice where it sits in your body and stay with it?',
  means:'You notice the feeling in your body while it is there.'},
 {k:'detach',q:'When a strong feeling rises, how often do you feel it without following the story it tells?',
  means:'You feel it and stay out of the story it tells.'},
 {k:'intent',q:'When a strong feeling rises, how often do you keep doing what you were doing while it passes?',
  means:'It rises and you keep to what you were doing.'},
 {k:'ignore',q:'When a strong feeling rises, how often do you find out only afterward that it was there?',
  means:'You do not see it coming, or you choose not to look.'},
 {k:'attach',q:'When a strong feeling rises, how often do you get pulled into the story and go wherever it goes?',
  means:'The story takes you and you go with it.'},
 {k:'averse',q:'When a strong feeling rises, how often do you go around it, put it off or change the subject?',
  means:'You go around it, put it off or change the subject.'}];

/* THE THREE BLOCKS, IN THE ORDER THEY STACK. id is the key of the answers on
   the profile (p.intake.more[id]), so it is part of the saved record and a
   rename here is a migration. rows is the table above. nm is the heading and
   line is the one sentence that says what the block is, because a term of art
   never stands alone (UNPACK EVERY SYMBOL, CLAUDE.md): archetype, axis and
   action axis are each said in plain words in the block that uses them.
   A row finds its colour in the renderer, from the seat ARCH and CHILD already
   place it at. The actions have none of their own in the product, and the gates
   are drawn at the Heart in the Field's bar (ui/fieldbar.js), so they take that.
   NO DIGIT AND NO NUMBER WORD IN ANY LINE. A count typed into a heading is the
   defect this repository has been bitten by more than any other. */
const IX_BLOCKS=[
 {id:'arch', nm:'Archetypes', rows:IX_ARCH2,
  line:'An archetype is a stock role people play, like the one who leads or the one who helps. Each one here puts two of those roles against each other, in a short scene or a short pair of actions. Pick the one closer to what you actually do.'},
 {id:'axes', nm:'Emotional axes', rows:IX_AXIS,
  line:'An axis is a line from a feeling to its opposite. Each question is a feeling the body can hold. Say how often it runs in you.'},
 {id:'acts', nm:'Action axes', rows:IX_ACT,
  line:'An action axis is a move you make when a feeling rises, from meeting it to going around it. Say how often you make each one.'}];
