/* ============================================================
   THE STARTER RECIPE FOR EACH TEACHER. Round PL, block J14. His words, the
   click on the Compass: "When I come to the compass and I click on any of the
   teachers, I want to see the behaviors that I need to install. I want to see
   a summary of who this person is, not the person per se, but I want to see
   the behavior complex. Of both behaviors." And for what goes inside it: "I'm
   sure the behaviors and the rituals within that recipe set, and then we'll
   refine that. So just give me some basics to start with."

   SO THIS FILE IS BASICS, AND EVERY ROW IS MARKED A FIRST DRAFT. It is a table
   and nothing else, so a row is edited in place with no code touched: change a
   line, add a behaviour, swap a step in a ritual, and the panel, the tests and
   the voice gate all read the new text. The one loop at the bottom is the only
   code here and it only registers the steps.

   WHAT A ROW IS. One pole of the roster in DESIGN-teachers.md section 2, which
   is fourteen poles for thirteen people, Jesus standing at two. The key is the
   pole's key, the same one MIRROR, PATHS and BECOMING use, and it is identity:
   it is never renumbered and never reused.
     who      the teacher's name, shown as a small credit and never as the
              headline. The panel is about a behaviour, not a person.
     q        the quality the pole is named for.
     opp      the inverted end, by name. Shown only as a caption on the release
              column, never as an entity, on the standing ruling that both ends
              are behaviours.
     line     the pole as one behaviour pair, the headline of the panel.
     release  the old pattern, 3 to 5 short behaviours a person runs now.
              Plain, physical, a thing a camera could film or a body report.
     install  what to practise instead, 3 to 5 short behaviours.
     rituals  2 to 3 starter rituals. A ritual is a list of practice keys, which
              is the grammar the ritual builder already uses, so a ritual added
              from here is exactly the plan a person would have built by hand.
     draft    true until he has read the row. The panel says first draft on
              every one of them, and a row he has ruled on has the flag removed.

   WHY THE STEPS ARE PRACTICE ROWS AND NOT TEXT. ritPlanOk refuses a plan whose
   step is not a key in PRACTICE, and the boundary does the same in schema.js,
   which reads RIT_STEP off the table. A ritual written as free text could not
   be added through the builder's own path, and a second path would be a second
   mechanism. So every step a recipe uses that the library does not already
   carry is a row below, in the same shape as every row in practice.js, and it
   is pushed onto PRACTICE before schema.js loads, which is why this file sits
   straight after practice.js in MANIFEST and nothing else may move it.

   WHY EVERY STEP CARRIES tc, AND WHY IT ALSO CARRIES rc. ritFor filters on
   !p.tc, so a teacher's step is never what a seat calls for and the builder's
   library is what it was before this file existed. That is the posture round
   KQ took for the eight teacher practices and this keeps it. But those eight
   are tied one to one to BECOMING, and a test says so. A recipe step is a
   second kind of row, so rc marks it, and the test that walks the round KQ
   rows skips rc rows rather than being edited to expect them.

   THREE POLES HAVE NO PLACE ON THE COMPASS YET. Akhenaten, Zoroaster and
   Confucius are rows 12 to 14 of the roster and the figure, MIRROR, PATHS and
   BECOMING do not carry them until the roster change lands. Their recipes are
   written now, so that landing them is a drawing task and not a writing one.
   Until then recipeOf finds them and nothing on the Compass can open them, and
   a ritual added from one of them carries no tc, because becomingOf answers
   null for a pole it does not know and ritPlanOk would refuse the whole plan.

   NO COUNT, NO SCORE, NO PERCENT. Nothing in this file is measured against a
   total. A behaviour is listed or it is not.

   ALL OF THIS IS PASSED THROUGH check.py --line. The rows are in the corpus
   the voice gate sweeps, and tests/engine.js runs every string through the
   same rules so a row he edits cannot arrive failing.
   ============================================================ */
var TEACHER_RECIPES=[
 {k:'IL', who:'Jesus', q:'Light', opp:'Lucifer', draft:true,
  line:'Give with no audience instead of for the room',
  release:['Warm in the room, flat when it empties',
   'Keep count of who noticed the kindness',
   'Tell the story of the favour afterwards',
   'Chest tight when nobody is looking'],
  install:['Give one thing away and tell nobody',
   'Ask what the person in front of you needs',
   'Say the kind thing once and do not wait for thanks',
   'Let the chest widen, then leave it alone'],
  rituals:[
   {id:'IL-give', nm:'Give and tell nobody', steps:['box','given']},
   {id:'IL-need', nm:'Ask what they need', steps:['box','il_need']},
   {id:'IL-alone', nm:'Kind when alone', steps:['il_alone','given']}]},
 {k:'RE', who:'Jesus', q:'Revelation', opp:'The Furies', draft:true,
  line:'Update the belief instead of guarding it',
  release:['Steer away from what would test the belief',
   'Answer before the other person has finished',
   'Decide what it means before it has finished happening',
   'Jaw sets the moment someone disagrees'],
  install:['Hold what cuts against you for one minute before you answer',
   'Ask what it would change if it were true',
   'Say "that changes what I thought" and stop there',
   'Keep the jaw loose while you hear it out'],
  rituals:[
   {id:'RE-hold', nm:'Hold it a minute', steps:['box','meetit']},
   {id:'RE-changed', nm:'Say what changed', steps:['box','re_changed']},
   {id:'RE-jaw', nm:'Loose jaw, open ear', steps:['re_jaw','meetit']}]},
 {k:'DE', who:'Ramakrishna', q:'Desire and will', opp:'Asmodeus', draft:true,
  line:'Stop at enough instead of reaching for more',
  release:['Get it, then reach for the next one within the hour',
   'Say "one more" and keep going',
   'Decide that having it will end the wanting',
   'Belly stays tight after you have it'],
  install:['Name one want and find where it pulls',
   'Ask who else the want would serve',
   'Say "that is enough" and put it down',
   'Let the pull rise and fall within ten breaths'],
  rituals:[
   {id:'DE-want', nm:'Name one want', steps:['slow','offered']},
   {id:'DE-enough', nm:'Say enough', steps:['box','de_enough']},
   {id:'DE-pull', nm:'Ride the pull', steps:['de_pull','offered']}]},
 {k:'OR', who:'Moses', q:'Order', opp:'Set', draft:true,
  line:'Keep the rule others stand on instead of bending it',
  release:['Change the rule after others have built on it',
   'Agree in the meeting and say something else afterwards',
   'Keep the plan only while somebody is watching',
   'Throat dry when you are asked to repeat the plan'],
  install:['Set one rule others can lean on',
   'Say the plan before it starts and write it down',
   'Keep the rule on the day it costs you',
   'Ask who is standing on it before you move it'],
  rituals:[
   {id:'OR-rule', nm:'Keep one rule', steps:['box','onerule']},
   {id:'OR-plan', nm:'Say the plan', steps:['box','or_plan']},
   {id:'OR-stand', nm:'Who stands on it', steps:['or_stand','onerule']}]},
 {k:'PO', who:'Musashi', q:'Power', opp:'Moloch', draft:true,
  line:'Pay for your own standard instead of billing others',
  release:['Meet your standard with other people’s time',
   'Say "somebody will cover it" and move on',
   'Count a day only if you won it',
   'Upper stomach clenches when someone else sets the pace'],
  install:['Do the same hard thing at the same hour',
   'Pay the cost yourself',
   'Write one line on a missed day and nothing about what it says of you',
   'Keep the breath low in the belly while you work'],
  rituals:[
   {id:'PO-cut', nm:'The same cut', steps:['box','samecut']},
   {id:'PO-small', nm:'The small version', steps:['box','po_small']},
   {id:'PO-own', nm:'Own the cost', steps:['po_own','samecut']}]},
 {k:'PE', who:'Buddha', q:'Perception', opp:'Geryon', draft:true,
  line:'See it as it is instead of managing how it looks',
  release:['Manage the gap between how you look and how you are',
   'Edit yourself before the words leave your mouth',
   'Read people as ground to cross',
   'Hold a face that does not match your stomach'],
  install:['Name what you feel and do nothing with it',
   'Describe the situation as you would to the person in it',
   'Say what you see before you say what you make of it',
   'Keep the space between the eyebrows soft'],
  rituals:[
   {id:'PE-name', nm:'Name it', steps:['box','pe_name']},
   {id:'PE-match', nm:'Face and stomach', steps:['box','pe_match']},
   {id:'PE-see', nm:'See it as it is', steps:['pe_name','pe_match','noting']}]},
 {k:'TR', who:'Rumi', q:'Trust', opp:'Charon', draft:true,
  line:'Let it land before you explain it',
  release:['Wait at the edge of a feeling until it can be proven',
   'Ask for more information about what you already feel',
   'Prepare for the moment and miss it',
   'Chest braced while it goes past'],
  install:['Stop for what moves you and stay before you explain it',
   'Let it reach the chest before you decide what it means',
   'Tell one person what moved you, with no evidence',
   'Let the breath drop while it lands'],
  rituals:[
   {id:'TR-land', nm:'Let it land', steps:['box','tr_land']},
   {id:'TR-tell', nm:'Tell one person', steps:['tr_land','tr_tell']}]},
 {k:'CH', who:'Elijah', q:'Charge', opp:'Phlegyas', draft:true,
  line:'Move the heat through the body instead of aiming it',
  release:['Let it go off at somebody',
   'Go flat for the afternoon',
   'Decide you are either fine or finished',
   'Belly locks, then the legs go heavy'],
  install:['Walk or lift until the heat has somewhere to go',
   'Find the anger in the body before you ask who caused it',
   'Say "I need ten minutes" and take them',
   'Stay on your feet while the heat rises'],
  rituals:[
   {id:'CH-move', nm:'Move the heat', steps:['box','ch_move']},
   {id:'CH-ten', nm:'Take ten minutes', steps:['box','ch_ten']},
   {id:'CH-feel', nm:'Find it in the body', steps:['slow','resist']}]},
 {k:'FL', who:'Krishna', q:'Flow', opp:'Kaliya', draft:true,
  line:'Let the plan move instead of holding it in place',
  release:['Hold one routine or grievance in place until it sours',
   'Tell the same complaint a fourth time',
   'Decide that moving it would be losing it',
   'Jaw locked and hands shut'],
  install:['Make the call you were holding',
   'Ask what the day wants to do before you tell it',
   'Say "let us do it the other way" and mean it',
   'Move the jaw, shoulders and belly when you ask them to'],
  rituals:[
   {id:'FL-move', nm:'Let it move', steps:['box','letmove']},
   {id:'FL-call', nm:'Make the call', steps:['box','fl_call']},
   {id:'FL-other', nm:'The other way', steps:['fl_other','letmove']}]},
 {k:'AL', who:'Rama', q:'Alignment', opp:'Ravana', draft:true,
  line:'Hold the line you named instead of making an exception',
  release:['Know the rule and cross it because you want the thing more',
   'Decide this one is an exception',
   'Give a good reason for what you should not have done',
   'Spine slumps when the rule is read out'],
  install:['Do what you said, without a grudge',
   'Ask what you owe before you ask what it costs',
   'Say "I will" only when you will',
   'Feel the spine long from the base of the back to the neck'],
  rituals:[
   {id:'AL-line', nm:'Hold one line', steps:['box','linehold']},
   {id:'AL-said', nm:'Do what you said', steps:['box','al_said']},
   {id:'AL-owe', nm:'What you owe', steps:['al_owe','linehold']}]},
 {k:'HO', who:'Lao Tzu', q:'The horizontal', opp:'Shu and Hu', draft:true,
  line:'Stop one thing and wait instead of rushing in to help',
  release:['Hurry in to help and make it worse',
   'Offer the fix nobody asked for',
   'Decide that whatever is whole needs one more fix',
   'Hands reach before you have decided'],
  install:['Find the one thing making the noise and stop it for the day',
   'Ask what finishes by itself if you leave it',
   'Say "I will wait" and wait',
   'Let the hands rest open'],
  rituals:[
   {id:'HO-stop', nm:'Stop one thing', steps:['box','stopone']},
   {id:'HO-wait', nm:'Say I will wait', steps:['ho_open','ho_wait']},
   {id:'HO-rest', nm:'Open hands', steps:['ho_open','stopone','ho_wait']}]},
 {k:'SA', who:'Akhenaten', q:'Light', opp:'Apep', draft:true,
  line:'Hand it on and name the source instead of keeping it',
  release:['Take it in and pass nothing on',
   'Tell it as if it started with you',
   'Decide that what you were given is yours to keep',
   'Chest folds in around what you are holding'],
  install:['Hand on what you were given',
   'Say who gave it to you',
   'Keep none of the credit',
   'Say it as it is, in one line'],
  rituals:[
   {id:'SA-hand', nm:'Hand it on', steps:['box','sa_hand']},
   {id:'SA-name', nm:'Say who gave it', steps:['sa_name','sa_hand']}]},
 {k:'TU', who:'Zoroaster', q:'Truth', opp:'The Lie', draft:true,
  line:'Say the plain true sentence instead of the softer one',
  release:['Say the smaller thing to keep the room warm',
   'Say "it is probably nothing" about the thing that is something',
   'Decide that saying it plainly means losing them',
   'Throat closes just before the sentence you meant'],
  install:['Say the true thing once, in one sentence',
   'End the sentence where it ends, with no softener after it',
   'Let the room go quiet',
   'Ask what is so before you ask what it will cost'],
  rituals:[
   {id:'TU-plain', nm:'The plain word', steps:['box','tu_plain']},
   {id:'TU-end', nm:'End the sentence', steps:['box','tu_end']},
   {id:'TU-both', nm:'Say it and stop', steps:['box','tu_plain','tu_end']}]},
 {k:'NA', who:'Confucius', q:'Nature', opp:'The farmer of Song', draft:true,
  line:'Tend it at its own pace instead of pulling it faster',
  release:['Pull the shoot up to help it grow',
   'Ask "why is this taking so long" every day',
   'Decide the season is the problem',
   'Hands grip while you wait'],
  install:['Tend what is growing and keep the hours it asks',
   'Ask what season it is before you ask what to do',
   'Say "it is not ready" and leave it alone',
   'Let the breath follow the pace of the work'],
  rituals:[
   {id:'NA-tend', nm:'Tend, do not pull', steps:['box','na_tend']},
   {id:'NA-season', nm:'Name the season', steps:['na_season','na_tend']}]}];

/* THE STEPS A RECIPE NEEDS THAT THE LIBRARY DOES NOT CARRY. The shape is
   practice.js's own: k, nm, track, min, tier, d for the one line, how for the
   instruction. Every one is tier one, on purpose. Pacing is the safety system
   in the ritual builder, and a starter set that opened with a step a heavy
   field is held back from would hand that person nothing. The steps borrowed
   from the library keep the tier the library gave them and are held back the
   usual way, said in words on the panel. A step that says "in the next
   conversation" carries the minutes the instruction takes to carry out, and
   never a timer on the conversation itself. */
var RECIPE_STEPS=[
 {k:'il_need', tc:'IL', rc:1, nm:'What They Need', track:'Mind', min:5, tier:1,
  d:'Before one conversation, ask what the other person needs from it.',
  how:'Pick the next conversation you will have. Before it starts, ask what this person needs '
   +'from it, and not how you will come across. Hold the answer in mind while you talk. '
   +'Afterward write one line on what they needed.'},
 {k:'il_alone', tc:'IL', rc:1, nm:'Kind When Alone', track:'Somatic', min:5, tier:1,
  d:'Do one kind thing where nobody will see it, then check the chest.',
  how:'Do one small kind thing that nobody will see or hear about: leave something for '
   +'somebody, fix something that is not yours, pay for something. Say nothing. Afterward '
   +'put a hand on the middle of the chest and notice whether it tightens when nobody is '
   +'looking, and where.'},
 {k:'re_changed', tc:'RE', rc:1, nm:'Say What Changed', track:'Mind', min:5, tier:1,
  d:'Tell one person what you changed your mind about this month.',
  how:'Pick one thing you believed a month ago and no longer do. Tell one person in one '
   +'sentence that begins "that changes what I thought". Do not defend the old view and do '
   +'not explain it away. Afterward notice your jaw.'},
 {k:'re_jaw', tc:'RE', rc:1, nm:'Loose Jaw, Open Ear', track:'Body', min:3, tier:1,
  d:'Hear out one disagreement with the jaw loose.',
  how:'In the next disagreement, drop the jaw a finger’s width before you answer. Let the '
   +'other person finish, then wait one breath. If the jaw sets, drop it again and listen to '
   +'the rest.'},
 {k:'de_enough', tc:'DE', rc:1, nm:'Say Enough', track:'Somatic', min:5, tier:1,
  d:'Decide where enough is before you start, and stop there.',
  how:'Pick one thing you can have more of today: food, scrolling, a drink, a purchase. Decide '
   +'before you start where enough is. Stop there and put it down. Notice the belly for ten '
   +'breaths and write down whether it let go.'},
 {k:'de_pull', tc:'DE', rc:1, nm:'Ride the Pull', track:'Body', min:5, tier:1,
  d:'Let a pull in the belly rise and fall without acting on it.',
  how:'When a want arrives, find where it pulls, usually low in the belly. Put a hand there and '
   +'breathe out slowly. Do not act until it has peaked and fallen, usually inside ten breaths. '
   +'Write how long it took.'},
 {k:'or_plan', tc:'OR', rc:1, nm:'Say the Plan', track:'Mind', min:5, tier:1,
  d:'Say the plan before it starts and write it where others can see it.',
  how:'Before one meeting or job today, say the plan out loud to the people it touches and write '
   +'it in one place they can see. If it changes, tell them before they build on it.'},
 {k:'or_stand', tc:'OR', rc:1, nm:'Who Stands on It', track:'Mind', min:3, tier:1,
  d:'Before you change a rule, name who is standing on it.',
  how:'Before you move a deadline, a promise or a rule, name each person who is building on it. '
   +'Tell them first, then change it. If nobody is standing on it, say so in one line.'},
 {k:'po_small', tc:'PO', rc:1, nm:'The Small Version', track:'Body', min:10, tier:1,
  d:'When the full hard thing is not on offer, do the smallest honest version.',
  how:'Pick the hard thing you do. On a day it cannot be done in full, do the smallest honest '
   +'version: two squats, one line, one scale. Pay the cost yourself and write nothing about '
   +'what it says of you.'},
 {k:'po_own', tc:'PO', rc:1, nm:'Own the Cost', track:'Mind', min:5, tier:1,
  d:'Name who covered for your standard today, and take it back.',
  how:'At night, write who covered for your standard today: a colleague’s time, a partner’s '
   +'patience, a child’s quiet. Pick one and take that cost back on yourself tomorrow. Do not '
   +'apologise in the list.'},
 {k:'pe_name', tc:'PE', rc:1, nm:'Name It', track:'Mind', min:5, tier:1,
  d:'Name what you feel in one word and do nothing with it.',
  how:'Three times today, stop and name what you feel in one word. Do not fix it, hide it or '
   +'explain it. Check whether your face matches the word, and let it match or say so.'},
 {k:'pe_match', tc:'PE', rc:1, nm:'Face and Stomach', track:'Somatic', min:5, tier:1,
  d:'Check that the face and the belly say the same thing.',
  how:'Sit with the eyes open. Notice what the face is holding, then what the belly is holding. '
   +'If they differ, let the face drop to match the belly and stay for ten breaths. Do not '
   +'change the belly.'},
 {k:'tr_land', tc:'TR', rc:1, nm:'Let It Land', track:'Somatic', min:5, tier:1,
  d:'Stay with what moves you for one minute before you explain it.',
  how:'When something moves you today, a face, a song, a line of text, stop for one minute. Let '
   +'it reach the chest and do not explain it. Breathe out and let the chest open.'},
 {k:'tr_tell', tc:'TR', rc:1, nm:'Tell One Person', track:'Mind', min:3, tier:1,
  d:'Say what moved you with no proof attached.',
  how:'Pick one thing that moved you this week. Tell one person in two sentences, with no '
   +'source, no reasoning and no hedge. If you reach for proof, stop at the full stop.'},
 {k:'ch_move', tc:'CH', rc:1, nm:'Move the Heat', track:'Body', min:10, tier:1,
  d:'Walk or lift until the heat has somewhere to go.',
  how:'When charge builds, walk fast or lift something heavy for ten minutes. Stay on your '
   +'feet. Stop when the heat sits in the legs and no longer in the jaw.'},
 {k:'ch_ten', tc:'CH', rc:1, nm:'Ten Minutes', track:'Mind', min:2, tier:1,
  d:'Say you need ten minutes, and take them.',
  how:'Next time the charge is rising at somebody, say "I need ten minutes" and leave the room. '
   +'Spend the ten minutes finding where in the body the anger sits, before you decide who '
   +'caused it.'},
 {k:'fl_call', tc:'FL', rc:1, nm:'Make the Call', track:'Mind', min:5, tier:1,
  d:'Make the one call you were holding.',
  how:'Pick the call, message or decision you have been holding still. Do it in the next five '
   +'minutes, before you rehearse it. Let the plan change if the answer changes it.'},
 {k:'fl_other', tc:'FL', rc:1, nm:'The Other Way', track:'Mind', min:3, tier:1,
  d:'Once today, change the route instead of pushing the plan.',
  how:'Once today, when the plan meets resistance, change the route instead of pushing it. Say '
   +'"let us do it the other way" and take the new route to the end of the task.'},
 {k:'al_said', tc:'AL', rc:1, nm:'What I Said', track:'Mind', min:5, tier:1,
  d:'Do the one thing you said you would do and have been avoiding.',
  how:'Write the one promise you have been avoiding, however small. Do it today without comment '
   +'or grudge. At night write done, and nothing about what it cost.'},
 {k:'al_owe', tc:'AL', rc:1, nm:'What I Owe', track:'Mind', min:3, tier:1,
  d:'Write what you owe before you write what it costs.',
  how:'Before the next decision that tempts you, write what you owe first and what it costs '
   +'second. Do the owed thing. Notice the spine while you do it.'},
 {k:'ho_wait', tc:'HO', rc:1, nm:'Say I Will Wait', track:'Mind', min:2, tier:1,
  d:'Leave one thing alone and say you will wait.',
  how:'Pick something you would normally fix, hurry or help along. Say "I will wait" out loud. '
   +'Keep the hands open on your lap until it has moved by itself or the day is over. Write '
   +'what finished without you.'},
 {k:'ho_open', tc:'HO', rc:1, nm:'Open Hands', track:'Body', min:3, tier:1,
  d:'Rest the hands open and let the breath run.',
  how:'Sit with the palms up on your knees. Let the breath run at its own pace and do not count '
   +'it. Each time the hands close or reach, open them again.'},
 {k:'sa_hand', tc:'SA', rc:1, nm:'Hand It On', track:'Somatic', min:5, tier:1,
  d:'Pass on something you were given and say who gave it to you.',
  how:'Take one thing you were given this week: an idea, a skill, a kindness. Pass it to '
   +'somebody who can use it and say who gave it to you. Keep none of the credit. Afterward '
   +'turn the palms up on your knees and notice your hands and your face.'},
 {k:'sa_name', tc:'SA', rc:1, nm:'Say Who Gave It', track:'Mind', min:3, tier:1,
  d:'Each time you use a given idea today, name where it came from.',
  how:'Today, each time you use an idea, a skill or a phrase you were given, say who gave it '
   +'to you, in one line. Keep none of the credit. Notice the face and the backs of the hands.'},
 {k:'tu_plain', tc:'TU', rc:1, nm:'The Plain Word', track:'Mind', min:5, tier:1,
  d:'Say one true thing you have been softening, in one sentence.',
  how:'Pick one true thing you have been softening. Say it once, out loud or in writing, in one '
   +'sentence, and stop where the sentence ends. Then say nothing for ten breaths and notice '
   +'what the throat does. If the sentence shrank on the way out, write down the word that '
   +'shrank it.'},
 {k:'tu_end', tc:'TU', rc:1, nm:'End the Sentence', track:'Mind', min:3, tier:1,
  d:'Stop speaking where the true sentence ends.',
  how:'In your next hard conversation, say the true sentence once. Stop where it ends and leave '
   +'out the softener after it. Keep the silence for three breaths. Notice the throat.'},
 {k:'na_tend', tc:'NA', rc:1, nm:'Tend, Do Not Pull', track:'Body', min:10, tier:1,
  d:'Do only the work the slow thing asks today, at the pace it asks.',
  how:'Pick one thing that grows slowly: a habit, a project, a child, a body. Do only the work it '
   +'asks today, at the pace it asks. When the urge comes to pull it faster, breathe out and take '
   +'the hands off it. Write one line on what you left alone.'},
 {k:'na_season', tc:'NA', rc:1, nm:'Name the Season', track:'Mind', min:3, tier:1,
  d:'Name what season the slow thing is in before you decide what to do.',
  how:'Pick one thing that is growing slower than you want. Write what season it is in: seed, '
   +'root, leaf or wait. Do only the work that season asks. Say "it is not ready" and leave it.'}];
RECIPE_STEPS.forEach(function(p){PRACTICE.push(p);});

/* the recipe for one pole. BECOMING_SAME is read here as well, because the
   needle's badges for Jesus on the body and Buddha on awareness carry the
   keys BO and AW, which are those axes and not second poles. */
function recipeOf(k){
 k=(typeof BECOMING_SAME==='object'&&BECOMING_SAME[k])||k;
 for(var i=0;i<TEACHER_RECIPES.length;i++)if(TEACHER_RECIPES[i].k===k)return TEACHER_RECIPES[i];
 return null;}
/* one starter ritual by its id, with the pole it belongs to */
function recipeRitual(id){
 for(var i=0;i<TEACHER_RECIPES.length;i++){
  var rs=TEACHER_RECIPES[i].rituals;
  for(var j=0;j<rs.length;j++)if(rs[j].id===id)return {pole:TEACHER_RECIPES[i], ritual:rs[j]};}
 return null;}
/* the steps of one ritual a person at this tier may start, and the ones that
   wait. Same rule as becomingSteps and the same reason: pacing is the safety
   system, so a step above the tier waits and is named, and nothing heavier
   than the tier is handed over. tier is ritFor's, where 1 is heavy load. */
function recipeSteps(ritual,tier){
 var byK={}; PRACTICE.forEach(function(p){byK[p.k]=p;});
 var on=[], held=[];
 ritual.steps.forEach(function(s){var p=byK[s]; if(!p)return;
  (p.tier<=tier?on:held).push(s);});
 return {steps:on, held:held};}
