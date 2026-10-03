/* ============================================================
   THE DAILY AFFIRMATIONS, A FIRST SLICE. Round QX, 3 October. His words:
   "I should see three. Daily affirmations."

   WHERE AN AFFIRMATION COMES FROM, in the order the Ritual page reads them
   (ui/ritcal.js, ritAffirm):
     first   the person's own avatar lines, the "who I want to be" half of
             each pair, newest first. These are theirs and are quoted, never
             paraphrased. The avatar page already asks for one of them to be
             said out loud once a day (its "Say it" rule), so this is the same
             act, offered on the Ritual page.
     then    one line per pattern held at four or more, heaviest first, read
             off this table by the pattern's name. Each line is the coherent
             opposite of that pattern (CHILD's opp, engine/data/canon.js), said
             as a claim about the body and not as a wish.

   WHY A CLAIM ABOUT THE BODY. The glossary says it plainly: "An affirmation
   does only the second and skips the first" (Letting go, gloss.js), and the
   release card says "state the installation. Not as an affirmation, as a
   somatic claim" (cards.js). So each line names a place or a posture the body
   can check, the Somatic Truth Check's own test: said, it either opens or it
   contracts.

   FIRST DRAFT, AND HIS TO CHANGE. Nine lines, one per axis. This is content
   and not code: a line can be rewritten here and nothing else moves. The key
   is CHILD's nm, so a renamed axis is a line that stops being found, which
   the flowtools gate (FT31) checks.
   ============================================================ */
var AFFIRM={
 'Fear':'My weight is down. The floor holds it.',
 'Anger':'The heat moves through. My hands stay open.',
 'Shame':'I take up the space I am standing in.',
 'Disgust':'What is here can stay here. My skin stays soft.',
 'Apathy':'There is charge in my arms, and I can spend it.',
 'Shock':'My feet are on the ground, and the ground is still.',
 'Sad':'My chest is open. What I lost made room.',
 'Surprise':'My shoulders are down. I can meet what comes.',
 'Anticipation':'I am here, below the heart, on this breath.'};
/* where a person with nothing held starts: the three axes nearest the ground,
   the same posture ritFor takes when nothing is read, the lightest place */
var AFFIRM_START=['Fear','Shock','Anticipation'];

/* ============================================================
   THE DAILY CHALLENGES, AND THE ONE GAP IN THEM. Round QX. His words: "Three
   challenges."

   Most already exist. Every named saboteur in SABDEF (engine/data/kb.js)
   carries an intervention, i, that is a challenge in shape: "Make one direct
   request for connection." The Ritual page reads those first and writes
   nothing over them.

   What does not exist is a challenge for an INFERRED saboteur: a cluster the
   library does not name, called by its seat and the agent noun for its
   fetter (INFER_NOUN, canon.js), "the Root Mourner". On a person who has
   written three stories these are often the heaviest running, measured on
   the flowtools seed: two of its three. So this is the first slice of new
   content: one challenge per fetter, nine, each a single act a body can do
   today, and the moment it is for. First draft, and his to change.
   ============================================================ */
var CHALLENGE={
 'Fear':{act:'Do the one thing you flinched from today. Keep it small, and start before the reasons arrive.',
  when:'Before something you would rather not do.'},
 'Anger':{act:'When the heat rises, wait five breaths before you answer. Then answer once.',
  when:'When you feel heat in your face or your hands.'},
 'Shame':{act:'Let one person see one thing you would usually hide. Say it plainly, once.',
  when:'When you want to hide what you did or who you are.'},
 'Disgust':{act:'Stay one minute longer with the thing you want to push away, and name what is there.',
  when:'When you want to push something or someone away.'},
 'Apathy':{act:'Pick one task and finish it today, start to end, before you open anything else.',
  when:'When nothing feels worth starting.'},
 'Shock':{act:'When you freeze, put both feet flat and name three things you can see. Then move one hand.',
  when:'When your body goes still and your mind goes blank.'},
 'Sad':{act:'Name one thing you lost, out loud. Then do one thing with what is here now.',
  when:'When the old loss comes back up.'},
 'Surprise':{act:'When something catches you off guard, drop your shoulders before you answer it.',
  when:'When something lands that you did not see coming.'},
 'Anticipation':{act:'Catch yourself bracing for what has not happened. Breathe out, and do the next thing in front of you.',
  when:'When you are already braced for the worst.'}};
