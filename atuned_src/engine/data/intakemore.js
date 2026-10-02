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

   arch   The product's own twelve (ARCH, engine/data/canon.js): Warrior, Sage,
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
   acts   The six gates (VERP, engine/verp.js), said as action. DECISIONS.md,
          "Read as": "the gates (said as action in the product)", and TASKS.md
          GL4 records that the only six axes the product has are these. The
          engine calls them "THE SIX AXES" at the top of verp.js. They are how
          a person meets a feeling when it rises, which is an action and not a
          feeling, so they are the six action axes. The six release channels
          (believing, perceiving, thinking, behaving, acting, feeling) are the
          other candidate and were not taken: they are a sentence a person says
          in a release, not a thing a person does, and nobody rates them.

   EVIDENCE, NOT A VERDICT. These answers are stored on the profile beside the
   63 and are read by no sum. They do not write to the laws, the charge, CQ or
   the gate counts (p.gates.verp is counts of sentences read out of stories and
   stays that). The archetype answers also do not touch p.soul.arcs, which is
   what the person CHOSE on the Avatar and which the onboarding review records
   as authoritative (ATUNED-onboarding-REVIEW-3-narrative.md, S17): what a
   person says they do and who they say they are becoming are two records and
   neither overwrites the other.

   THE DIRECTION OF EVERY QUESTION IS THE SAME, how often, 0 never to 10 every
   time, the scale the 63 already use. A person who says yes to everything
   produces a level read and the read-out says so, and does not name a winner
   (IX_FLOOR, engine/intakemore.js). Forced choice would resist that better and
   needs a control the page does not have; it is the first thing to try if this
   draft reads flat.

   THE ARCHETYPE ROWS CARRY NO NAME ON THE PAGE. A row labelled "Ruler" is a
   question about whether you would like to be called a ruler. The name appears
   in the read-out, with its meaning, once all of them are answered. The axes
   and the actions are named on the page, each with its meaning beside it,
   because the question is a sensation or a move and the name does not flatter.
   ============================================================ */
const IX_DRAFT=true;

const IX_ARCH=[
 {k:'Warrior',  q:'When something you care about is threatened, how often do you move on it at once?'},
 {k:'Sage',     q:'When something goes wrong, how often do you stop and work out what is happening before you act?'},
 {k:'Rebel',    q:'When you are handed a rule you did not make, how often do you push back on it?'},
 {k:'Caregiver',q:'When someone near you is struggling, how often do you put your own plans down to help?'},
 {k:'Creator',  q:'When you have a free hour, how often do you spend it making something?'},
 {k:'Magician', q:'When you are stuck, how often do you change the set up so the problem stops being one?'},
 {k:'Ruler',    q:'When a group has nobody in charge, how often do you step in and set the order?'},
 {k:'Explorer', q:'When a place or a path is new to you, how often do you go on past where the others stop?'},
 {k:'Lover',    q:'When you care about someone, how often do you move closer and say so?'},
 {k:'Jester',   q:'When the room goes tense and nobody speaks, how often do you break it with a joke?'},
 {k:'Everyman', q:'When you walk into a room where everyone already knows each other, how often do you stay with the group and fit in?'},
 {k:'Innocent', q:'When someone tells you something, how often do you take it as they said it, without looking for a catch?'}];

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
 {id:'arch', nm:'Archetypes', rows:IX_ARCH,
  line:'An archetype is a stock role people play, like the one who leads or the one who helps. Each question is a moment. Say how often you act that way.'},
 {id:'axes', nm:'Emotional axes', rows:IX_AXIS,
  line:'An axis is a line from a feeling to its opposite. Each question is a feeling the body can hold. Say how often it runs in you.'},
 {id:'acts', nm:'Action axes', rows:IX_ACT,
  line:'An action axis is a move you make when a feeling rises, from meeting it to going around it. Say how often you make each one.'}];
