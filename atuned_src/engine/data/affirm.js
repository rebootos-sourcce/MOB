/* ============================================================
   THE DAILY AFFIRMATIONS, A FIRST SLICE. Round QX, 3 October. His words:
   "I should see three. Daily affirmations."

   WHERE AN AFFIRMATION COMES FROM, in the order the Ritual page reads them
   (ui/ritcal.js, ritAffirm):
     first   the person's own avatar lines, the "who I want to be" half of
             each pair, newest first. These are theirs and are quoted, never
             paraphrased, with one exception since SV24 ("Affirmations are I
             am statements"): a line written as who to become, "Someone who
             picks a way and walks it", is said as I am that, "I am someone
             who picks a way and walks it", by ritIAm in ui/ritcal.js. Two
             words go in front and none of theirs change. The avatar page already asks for one of them to be
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
/* I AM STATEMENTS, SV24, his ruling: "Affirmations are I am statements."
   Measured before this: seven of these nine opened on My, The, What or
   There is, and only Anticipation opened on I am. Each line keeps its own
   place in the body and its own posture, the reason above, and is said from
   I am: the weight and the floor, open hands in the heat, the skin, the arms,
   both feet, the chest, the shoulders. */
var AFFIRM={
 'Fear':'I am down in my weight, and the floor holds it.',
 'Anger':'I am open handed while the heat moves through.',
 'Shame':'I am taking up the space I stand in.',
 'Disgust':'I am soft in my skin, and what is here can stay here.',
 'Apathy':'I am carrying charge in my arms, and I can spend it.',
 'Shock':'I am standing on still ground, with both feet down.',
 'Sad':'I am open in the chest. What I lost made room.',
 'Surprise':'I am loose in the shoulders, and I can meet what comes.',
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

/* ============================================================
   THE AFFIRMATION GENERATOR'S WORDS, 18 November. His words: "This is a small
   affirmation engine utility that I want added to the ritual builder. We'll
   use this to generate high quality affirmations." And the same day, the
   story: Source AI "will spot my avatar's intentions and then generate high
   quality affirmations. That a person can add to the ritual."

   His package wrote one line per point, Root to Crown, each opening on a
   locked anchor. The anchors below are his, word for word and in his order.
   The package never read its own anchor field: it wrote the anchor into each
   template by hand and then, under Creator Mode, lowercased the first letter
   of every line, so "I magnetize" printed as "i magnetize" on every theme.
   Here every line is built from AFF_ANCHOR and engine/affirmgen.js throws
   rather than emit a line that does not open on it in exact case.

   THE WRAPPER is his too, word for word, capital I kept. The control that
   turns it on is called All that is and not Creator Mode, because Creator is
   already an archetype name (ARCH, canon.js) and the rule is one word per
   concept. Its hover carries his full words.

   THE FRAMES REPLACED HIS SEVEN TEMPLATES. Five of the seven were
   manifestation register ("into tangible reality", "manifesting", "highest
   vision") and all seven broke on anything but a bare noun: "I speak to ask
   for help into tangible reality". A theme is read for its shape first
   (engine/affirmgen.js, affShape) and each shape has its own frame per point.
   Each frame is a core, which holds the anchor and the theme, and a tail, a
   body image or a closing clause. Under All that is the tail drops and the
   core never does: the wrapper alone is 73 characters, and a full line ran
   past three rows at 390. A line is a claim a body can check, the same test
   the AFFIRM lines above are held to, so the tails name the floor, the chest
   and the next step, never a wish.

   HIS DEFAULT SET IS GONE. Seven money lines showed on open and on an empty
   box. Nobody asked for them and nothing marked them as composed, so an empty
   box now composes nothing.

   Content and not code, and the voice seat owns AFF_ADJ, AFF_VOICE and the
   frames' wording: a word can be added here and nothing else moves.
   ============================================================ */
var AFF_ANCHOR=['I am','I magnetize','I command','I receive','I speak','I foresee','I empower'];
var AFF_PRE='I am the creator of all that is, ';
var AFF_SUF=' across all space, time, and dimensions.';
/* what a refusal says. Each one names what to write instead, because a box
   that only says no teaches nothing. safety is not here on purpose: a trip
   prints CRISIS_SAY.entryNow (engine/data/crisis.js) and never a copy of it. */
var AFF_SAY={
 empty:'Write who you are becoming, or one word for it.',
 shape:'Write who you are becoming, or one word for it.',
 sentence:'Say it as something you do.',
 gerund:'Say it as something you do, starting with "to".',
 list:'One at a time. Pick the one that matters today.',
 long:'Too long for one line. Use twelve words or fewer.',
 toward:'Say what you are moving toward.',
 thin:function(w){return '"'+w+'" names nothing your body can check. Name one quality.';},
 person:function(w){return 'An affirmation is about you. Name what you bring to your '+w+': patience, time, honesty.';},
 flip:function(w,o){return '"'+w+'" is what you release. Its opposite is '+o+'. Use '+o+'?';}};
/* THE QUALITY TABLE, adjective to its noun. A word here reads as a state and
   takes the adjective frames; any other short theme is a noun and keeps its
   own part of speech, so "clarity" is never silently turned into "clear".
   "whole" is left out on purpose: Whole is the Avatar's percent. */
var AFF_ADJ={calm:'calm', clear:'clarity', patient:'patience', honest:'honesty', brave:'courage',
 steady:'steadiness', focused:'focus', rested:'rest', confident:'confidence', grounded:'groundedness',
 present:'presence', ready:'readiness', worthy:'worth', open:'openness', even:'evenness', awake:'wakefulness'};
/* the qualities that read as a voice, "I speak in a calm voice". The rest
   speak from a body, "I speak from a rested body", because a rested voice is
   not a thing a throat can check */
var AFF_VOICE={calm:1, clear:1, patient:1, honest:1, steady:1, confident:1, even:1};
/* words that name nothing a body can check. "good" in seven frames is seven
   lines that say nothing. */
var AFF_THIN={good:1, better:1, best:1, nice:1, fine:1, things:1, stuff:1, everything:1, more:1};
/* someone else as the theme. An affirmation is about the person saying it. */
var AFF_PERSON=/^(my|our) (son|daughter|kids|children|partner|wife|husband|mother|father|mom|dad|boss|team|friend|friends|family|brother|sister|landlord)$/i;
/* THE GENERATOR'S OWN STOP, and why srcSafe is not enough here. srcSafe asks
   whether a hit is the writer's own and said without a no, which is right for
   a story: "I would never kill myself" is not a statement to meet. It is wrong
   for a generator, because a Become line is written in recovery phrasing, and
   "Someone who no longer wants to die" passes srcSafe as denied and would then
   be chanted seven times. Measured, R2: with srcSafe alone the shaper's own
   refusal hid the gap, because that line is a negative and was told "Say what
   you are moving toward", which is the wrong thing to say to that person.
   These run word edged and with no reading of polarity, after srcSafe and any
   safeOf hit. The cost is chosen and counted in the gate: "finish the shift
   and end it on time" trips and shows one line instead of seven. */
var AFF_STOP=[/\b(hurt|hurting|harm|harming|kill|killing|cut|cutting)\s+(myself|me|my\s+(arms?|wrists?|skin|body))\b/i,
 /\bself[\s-]?harm/i, /\bsuicid/i, /\b(want|wants|wanting|wanted)\s+to\s+die\b/i, /\bwish\s+i\s+(was|were)\s+dead\b/i,
 /\bend\s+(it|it all|my life|things)\b/i, /\boverdose/i, /\bcutting\s*$/i, /\bnot\s+(be\s+)?here\s+any\s*more\b/i];
/* THE FRAMES, one per point per shape, each returning [core, tail]. vp is a
   verb phrase (vb its base, v1 its first person form), np a whole someone
   line kept as written, adj a quality from AFF_ADJ, n a short noun. */
var AFF_FRAMES={
 vp:[function(s){return ['I am built to '+s.vb,''];},
  function(s){return ['I magnetize what it takes to '+s.vb,''];},
  function(s){return ['I command my body to '+s.vb,''];},
  function(s){return ['I receive what I need to '+s.vb,', and my chest stays open'];},
  /* "I speak it out loud: I ask for help out loud" said out loud twice */
  function(s){return [(/\b(out loud|aloud)\b/.test(s.vb)?'I speak it plainly: I ':'I speak it out loud: I ')+s.v1,''];},
  function(s){return ['I foresee the next step to '+s.vb,', and I take it'];},
  function(s){return ['I empower myself to '+s.vb,''];}],
 np:[function(s){return ['I am '+s.np,''];},
  function(s){return ['I magnetize what it takes to be '+s.np,''];},
  function(s){return ['I command my body to act as '+s.np,''];},
  function(s){return ['I receive the room to be '+s.np,''];},
  function(s){return ['I speak it out loud: I am '+s.np,''];},
  function(s){return ['I foresee the next step toward being '+s.np,''];},
  function(s){return ['I empower myself to be '+s.np,''];}],
 adj:[function(s){return ['I am '+s.a,', with both feet on the floor'];},
  function(s){return ['I magnetize what keeps me '+s.a,''];},
  function(s){return ['I command my body to stay '+s.a,''];},
  function(s){return ['I receive the day as it comes and stay '+s.a,''];},
  function(s){return [AFF_VOICE[s.a]?'I speak in '+affArt(s.a)+s.a+' voice':'I speak from '+affArt(s.a)+s.a+' body',''];},
  function(s){return ['I foresee myself '+s.a+' in the room that tests me',''];},
  function(s){return ['I empower myself to stay '+s.a+' among the people I belong to',''];}],
 n:[function(s){return ['I am the ground '+s.n+' grows from',''];},
  function(s){return ['I magnetize '+s.n,', and I let the want show'];},
  function(s){return ['I command my body toward '+s.n,''];},
  function(s){return ['I receive '+s.n,', and my chest stays open'];},
  function(s){return ['I speak about '+s.n+' out loud',''];},
  function(s){return ['I foresee the next step toward '+s.n,', and I take it'];},
  function(s){return ['I empower myself and the people I belong to toward '+s.n,''];}]};
/* the article a quality takes, "an honest voice" */
function affArt(a){return /^(a|e|i|o|u|hon)/i.test(a)?'an ':'a ';}
