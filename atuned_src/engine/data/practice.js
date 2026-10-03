
/* ============================================================
   EXPRESSION · the third scale type. Not bipolar. There is no
   "too much Peace". 10 is full and whatever is unfilled leaks the
   named shadow automatically.
   ============================================================ */
var EXPR=[
 {nm:'Peace',    sh:'agitation',    b:'Root'},   {nm:'Wonder',   sh:'banality',     b:'Crown'},
 {nm:'Purpose',  sh:'drift',        b:'Solar'},  {nm:'Will',     sh:'inertia',      b:'Solar'},
 {nm:'Order',    sh:'chaos',        b:'3rd Eye'},{nm:'Beauty',   sh:'ugliness',     b:'Heart'},
 {nm:'Voice',    sh:'silence',      b:'Throat'}, {nm:'Play',     sh:'grimness',     b:'Sacral'},
 {nm:'Devotion', sh:'indifference', b:'Heart'},  {nm:'Presence', sh:'absence',      b:'3rd Eye'}];

/* ============================================================
   THE PRACTICE LIBRARY. Four tracks, three tiers. Tier one is what
   a first-week person can actually do.
   ============================================================ */
var PRACTICE=[
 {k:'escan', nm:'The Emotional Scan', track:'Somatic', min:20, tier:1,
  d:'Where the nine live in your body. The first practice in the Body Tract.',
  how:'Sit upright somewhere quiet. Twenty breaths, each exhale longer than the last, until '
   +'the energy drops below the heart. Three grounding affirmations: I am grounded and safe '
   +'in my body. Then bring up a happy moment, feel its charge, and turn your senses inward. '
   +'Where does it land. Then disgust. Then each of the nine in turn, thirty seconds each. '
   +'You are mapping, not fixing. When the system is clear all nine live around the heart. '
   +'Where you feel them now is where they are displaced to.'},
 {k:'box', nm:'Box Breathing', track:'Body', min:5, tier:1,
  d:'Four and four, or eight and eight. The entry into a grounded state.',
  how:'Inhale, hold, exhale, hold, each for the same count. Four to start, eight when it is '
   +'easy. This regulates the autonomic nervous system and it is the door into every other '
   +'practice here.'},
 {k:'slow', nm:'Controlled Breath', track:'Body', min:10, tier:1,
  d:'Two to six breaths a minute. Gets the energy below the heart.',
  how:'Slow the breath until you are taking between two and six a minute. When the breaths '
   +'are really slow a great deal of healing happens. Once you are grounded, high frequency '
   +'charge is easier to release, because it vibrates faster than the pranic breath.'},
 {k:'sig', nm:'The Signal Test', track:'Somatic', min:3, tier:1,
  d:'Proof that a word with no quality of its own moves your body.',
  how:'Built into the app. Run it from your protocol any time the felt reference drifts.'},
 {k:'sysbreath', nm:'Systematic Body Breathing', track:'Body', min:15, tier:2,
  d:'Breathe through each region in turn. Stimulates the whole nerve network.',
  how:'Left leg, right leg, hip, front torso, back torso, left shoulder down the arm, right '
   +'shoulder down the arm, neck, face, top of head. The pranic breath activates each region '
   +'as attention passes through it.'},
 {k:'resist', nm:'Feel the Resistance', track:'Somatic', min:10, tier:2,
  d:'Direct contact dissolves charge. No analysis, no escape.',
  how:'Find the resistance in the body. Do not move away from it. Stay with it until it '
   +'shifts. There is nothing to think about here.'},
 {k:'truth', nm:'The Somatic Truth Check', track:'Somatic', min:2, tier:2,
  d:'Expansion is true. Contraction is distortion.',
  how:'Hold the statement and read the body. Expansion means true. Contraction means '
   +'distortion. Use it live, in the moment, as an instrument.'},
 {k:'heartpt', nm:'Heart Point Focus', track:'Energy', min:10, tier:2,
  d:'A white point at the centre of the heart, held for ten minutes.',
  how:'Visualise a white point glowing bright at the centre of the heart. Hold it. Every '
   +'time attention breaks, bring it back. This dissolves somatic energy around the heart.'},
 {k:'noting', nm:'Noting Meditation', track:'Mind', min:15, tier:2,
  d:'Observer of thoughts. No engagement.',
  how:'Sit. Watch a thought arrive and leave. Do not follow it, do not argue with it, do not '
   +'finish it. Note that it came and let it pass.'},
 {k:'listen', nm:'Active Listening', track:'Mind', min:10, tier:2,
  d:'Ten minutes on sound. No labelling.',
  how:'Attend to environmental sound. Depth, distance, layering. No naming and no analysis. '
   +'A month of this changes presence.'},
 {k:'observer', nm:'The Observer Technique', track:'Somatic', min:20, tier:3,
  d:'Memory without charge. The technique for memory-attached patterns.',
  how:'Breathe first. Run the mantras: I am grounded. I am calm. I am safe. I am relaxed. '
   +'Get the energy below the heart. Then bring up something that bothers you, at intensity '
   +'one to three to begin. Take the observer position, the cameraman and not the actor. Let '
   +'the charge rise unnamed and fall unnamed. Do not engage the thoughts. When it falls, the '
   +'memory is discharged. Check by revisiting it. Then climb: four to six, seven to nine, '
   +'then ten.'},
 {k:'detect', nm:'The Detection Practice', track:'Somatic', min:20, tier:3,
  d:'The pre-linguistic foundation. Building your own nervous system map.',
  how:'Breath asymmetry, every other exhale longer. Visualise water descending from the '
   +'crown to the tailbone, slowly. When vibration appears, zoom in. Investigate it in six '
   +'dimensions: shape, centre, rhythm, temperature, colour, direction.'},
 {k:'hands', nm:'Healing Hands', track:'Energy', min:15, tier:3,
  d:'The palm field as a directable instrument.',
  how:'Locate the energy in the palms. Visualise the hands. Notice the link between the '
   +'visualisation and the sensation. Direct it. Wrap the area. Hold. Contact is not '
   +'required. Intention plus motion does the work.'},
 {k:'hardtrauma', nm:'Hard Trauma Meditation', track:'Somatic', min:20, tier:3,
  d:'For the deep ones. Observer mode on a traumatic memory.',
  how:'Five minutes of breath and centring. Visualise the moment. Allow the charge to build '
   +'and arise. Do not engage the thoughts or the emotions as they come. When the charge '
   +'falls, that memory is discharged of its emotion and it can no longer land on you. '
   +'Several times a week.'},
 {k:'superego', nm:'Superego Pattern Meditation', track:'Mind', min:20, tier:3,
  d:'What you absorbed from the people who raised you.',
  how:'Visualise your parents and grandparents. Identify what you took on from each. For '
   +'every pattern, decide: keep, transform, or release. Then run the release on the ones '
   +'you named.'},
 {k:'chakra', nm:'Individual Chakra Meditation', track:'Energy', min:20, tier:3,
  d:'One band at a time. Five minutes of breath, ten of visualisation.',
  how:'Choose the band carrying the most. Five minutes of breath to ground. Then hold a '
   +'coloured sphere at that nerve plexus for ten to fifteen minutes. One band per sitting.'},
 {k:'candle', nm:'Candle Visualisation', track:'Mind', min:15, tier:3,
  d:'Concentration training. Hold one image.',
  how:'Hold the image of a flame for ten to fifteen minutes. When it slips, rebuild it. '
   +'This is training, not release.'}];
var PTRACK={Mind:'#7B97E2',Body:'#68CBA4',Energy:'#AF89D6',Somatic:'#DBBF68'};

/* ============================================================
   THE RITUALS OF BECOMING. Round KQ, his words: "I'd like to be able to
   create routines based off of these teachers. So the teachers kind of
   give us a guide in order to create the rituals of becoming. Create a
   system out of that. And then plug that in. We'll edit it later."

   A teacher is the coherent pole of one axis on the compass (MIRROR) or
   one of the five paths (PATHS). Each one here names the practices a
   person does each day to move toward that teacher's quality. Nothing is
   invented where the library already carries the quality: Buddha, Rumi
   and Elijah are built only from practices above. Where nothing in the
   library carries it, one short practice is written for that teacher and
   appended to PRACTICE, which is what makes it a step the boundary
   accepts (schema.js reads RIT_STEP off this table) with no schema change.

   A TEACHER PRACTICE IS NEVER CALLED BY THE STATE. tc marks it, and
   ritFor leaves every tc row out, so the practice the seat carrying the
   most calls for is exactly what it was before these rows existed, and
   the builder's library is unchanged. A teacher practice is reached
   through its teacher and nowhere else.

   A FIRST PASS, his word "later" is taken at face value. The step lists
   and the eight new practices are the owner's to edit.
   ============================================================ */
var TEACHER_PRACTICE=[
 {k:'given', tc:'IL', nm:'Given Freely', track:'Somatic', min:5, tier:1,
  d:'Give one thing today with nothing asked back.',
  how:'Once today, give something with no return attached: an hour, a hand, a meal, your full '
   +'attention. Tell nobody. Afterward put a hand flat on the middle of your chest and notice '
   +'what is there. If you caught yourself waiting to be thanked, notice where in your body the '
   +'waiting sat. Warmth that needs no audience is the light this teacher stands for.'},
 {k:'offered', tc:'DE', nm:'The Offered Want', track:'Somatic', min:5, tier:1,
  d:'Name one want, and ask what it is for beyond you.',
  how:'Sit and name one thing you want today. Find where the wanting pulls, usually low in the '
   +'belly, below the navel. Hold it there for ten breaths without acting on it. Then ask who '
   +'else it would serve. If it serves only the having, set it down for today. If it points '
   +'past you, keep it, and let it be the one want you follow.'},
 {k:'onerule', tc:'OR', nm:'One Rule Kept', track:'Mind', min:5, tier:1,
  d:'Set one rule someone else can lean on, and keep it.',
  how:'In the morning, write one rule for today that somebody else can lean on: I answer by noon, '
   +'I am home when I said, I finish one thing before I start the next. Say it once out loud. '
   +'At night, check it and write kept or broken. A rule only carries weight when it is kept on '
   +'the day keeping it costs something.'},
 {k:'samecut', tc:'PO', nm:'The Same Cut', track:'Body', min:10, tier:1,
  d:'One hard thing, the same one, every day. A miss is data.',
  how:'Pick one small hard thing and do it the same way every day: ten slow squats, one page '
   +'written, one skill drilled. You pay the cost and nobody else does. Keep the breath low in '
   +'the belly while you do it. On a day you miss it or do it badly, write one line on what '
   +'happened and nothing about what it says about you.'},
 {k:'meetit', tc:'RE', nm:'Meet It Unopposed', track:'Mind', min:5, tier:2,
  d:'When something cuts against what you believe, hold it before you answer it.',
  how:'Today, when something you live through cuts against what you believe, do not answer it '
   +'yet. Put your attention on the middle of your chest and hold the thing there for one '
   +'minute, the way you would hold something heavy you are not going to throw. Then ask what '
   +'it would change if it were true, and write one line.'},
 {k:'letmove', tc:'FL', nm:'Let It Move', track:'Body', min:10, tier:1,
  d:'Find where the day is held still, and move it.',
  how:'Stand. Find the one place in your body that is held still: a locked jaw, set shoulders, a '
   +'clenched belly. Move it slowly for two minutes, any direction it will go, breathing out as '
   +'it moves. Then find the one thing in the day you are holding still by force, a call not '
   +'made or a word not said, and move it one step.'},
 {k:'linehold', tc:'AL', nm:'The Line Held', track:'Mind', min:5, tier:1,
  d:'Name the one line you will not cross today, and check it at night.',
  how:'In the morning, stand straight and name one line you will hold today whatever it costs: a '
   +'promise, a boundary, a job owed. Feel your spine carry it, from the base of the back to the '
   +'back of the neck. At night, write held or crossed, and what pulled on it.'},
 {k:'stopone', tc:'HO', nm:'Stop One Thing', track:'Mind', min:2, tier:1,
  d:'Find the one activity making the noise, and stop it for today.',
  how:'Look at today and find one activity that makes noise in you: the scrolling, the argument '
   +'rehearsed in your head, the checking. Stop it for the day and put nothing in its place. Each '
   +'time the pull to start it comes back, breathe out and let the pull pass. Notice what your '
   +'body does in the space it leaves.'}];
TEACHER_PRACTICE.forEach(function(p){PRACTICE.push(p);});

/* which practices each teacher calls for, in the order they are done. The
   key is the axis or path key, never the name, because Jesus stands at two
   poles and each is a different quality at a different seat. Jesus on the
   path of the body and Buddha on the path of awareness are the same entries
   PATHS reads off MIRROR, so their rituals are those axes' rituals. */
var BECOMING={
 IL:['heartpt','given'],   /* Jesus, light, at the heart */
 DE:['slow','offered'],    /* Ramakrishna, desire and will, at the sacral */
 OR:['truth','onerule'],   /* Moses, order, at the throat */
 PO:['box','samecut'],     /* Musashi, power, at the solar */
 PE:['noting','listen'],   /* Buddha, perception, at the third eye */
 TR:['truth','heartpt'],   /* Rumi, trust, at the heart */
 CH:['slow','resist'],     /* Elijah, charge, at the root */
 RE:['heartpt','meetit'],  /* Jesus, revelation, at the crown */
 FL:['sysbreath','letmove'],/* Krishna, flow, a path with no seat */
 AL:['box','linehold'],    /* Rama, alignment, a path with no seat */
 HO:['resist','stopone']}; /* Lao Tzu, the horizontal, a path with no seat */
var BECOMING_SAME={BO:'IL', AW:'PE'};
/* one teacher, read off the compass data rather than copied, so a rename
   there is a rename here. seat is null for a path, which sits at no seat. */
function becomingOf(k){
 k=BECOMING_SAME[k]||k;
 if(!BECOMING[k])return null;
 var i, m=null, p=null;
 for(i=0;i<MIRROR.length;i++)if(MIRROR[i].k===k)m=MIRROR[i];
 for(i=0;i<PATHS.length;i++)if(PATHS[i].k===k)p=PATHS[i];
 var x=m||p; if(!x)return null;
 return {k:k, who:x.up, q:x.q, d:x.upd, ic:x.ic||null, seat:m?m.seat:null,
  path:!m, steps:BECOMING[k].slice()};}
/* the steps a person at this tier may start. tier is ritFor's: 1 is heavy
   load, and pacing is the safety system here, so a step above the tier waits
   rather than being handed over. held names what waits, so it can be said. */
function becomingSteps(k,tier){
 var b=becomingOf(k); if(!b)return {steps:[],held:[]};
 var byK={}; PRACTICE.forEach(function(p){byK[p.k]=p;});
 var on=[], held=[];
 b.steps.forEach(function(s){var p=byK[s]; if(!p)return;
  (p.tier<=tier?on:held).push(s);});
 return {steps:on, held:held};}

/* ---------- the seven seats, and where they sit on the figure ---------- */
/* THE THIRD EYE WAS ON THE NOSE. It sat at 12.56, the middle of the drawn ear,
   and on a real head the middle of the ear is level with the nose. Its own
   text below says between the eyebrows, and the brow is level with the top of
   the ear, which this figure draws at 10.5. The head ruler in figure.js
   (ANATHEAD) puts the brow, halfway between the nasion and the forehead point
   on Colin27 at z -20.85, at 10.57. Two landmarks, one height. Ruled 26
   September: always the correct position, not the nose. */
var PMBANDS=[
 {k:'crown', c:PAL.Crown,     nm:'Crown',     b:'Crown',  yp:4.98, r:9},
 {k:'eye',   c:PAL['3rd Eye'],nm:'Third Eye', b:'3rd Eye',yp:10.57,r:8},
 {k:'throat',c:PAL.Throat,    nm:'Throat',    b:'Throat', yp:20.91,r:9},
 {k:'heart', c:PAL.Heart,     nm:'Heart',     b:'Heart',  yp:30.51,r:13},
 {k:'solar', c:PAL.Solar,     nm:'Solar',     b:'Solar',  yp:40.21,r:11},
 {k:'sacral',c:PAL.Sacral,    nm:'Sacral',    b:'Sacral', yp:47.02,r:10},
 {k:'root',  c:PAL.Root,      nm:'Root',      b:'Root',   yp:53.55,r:12}];
var FLOWSEAT=[
 {k:'crown', n:'Crown', sk:'Sahasrara',   nv:'Cranial plexus',   vt:'pineal, cortical',                  seat:'the top of the head',            src:26, hz:963},
 {k:'eye',   n:'Brow',  sk:'Ajna',        nv:'Cavernous plexus', vt:'cavernous sinus, beside the sella', seat:'between the eyebrows',           src:90, hz:852},
 {k:'throat',n:'Throat',sk:'Vishuddha',   nv:'Pharyngeal plexus',vt:'C1 to C4',                          seat:'the suprasternal notch',         src:188,hz:741},
 {k:'heart', n:'Heart', sk:'Anahata',     nv:'Cardiac plexus',   vt:'T4 to T5, the aortic arch',         seat:'mid sternum',                    src:276,hz:639},
 {k:'solar', n:'Solar', sk:'Manipura',    nv:'Celiac plexus',    vt:'T12 to L1',                         seat:'below the ribs, above the navel',src:372,hz:528},
 {k:'sacral',n:'Sacral',sk:'Svadhisthana',nv:'Hypogastric plexus',vt:'L5, the aortic bifurcation',       seat:'below the navel',                src:438,hz:417},
 {k:'root',  n:'Root',  sk:'Muladhara',   nv:'Lumbar plexus',    vt:'L1 to L4, into the pelvic floor',   seat:'the base of the spine',          src:502,hz:396}];
/* THE SEAT'S TONE, BY THE NAME EVERY ADDRESS CARRIES.

   The release sounds the seat of the address it is on, and an address knows
   its seat as n.b: 'Root' through 'Crown', with '3rd Eye' between. FLOWSEAT
   prints that seat as 'Brow', so a lookup by its display name finds six seats
   and returns nothing for the seventh. Measured: 12 of the 107 addresses a
   release can reach sit at the 3rd Eye, and every one of them would have
   played the previous seat's tone, or none, with nothing anywhere saying so.
   So the name goes through the key PMBANDS already shares with this table.

   A seat with no tone is null and never a guess. The four addresses outside
   the body carry no fetter, so relPick drops them before a run is built, and
   this is the second reason they cannot sound. */
function seatHz(b){
 for(var i=0;i<PMBANDS.length;i++){ if(PMBANDS[i].b!==b)continue;
  for(var j=0;j<FLOWSEAT.length;j++)
   if(FLOWSEAT[j].k===PMBANDS[i].k)return FLOWSEAT[j].hz;}
 return null;}
/* NO MASKS HERE. They were the fifth layer, and he ruled them off every sub
   menu and onto the figure itself, CH in TASKS.md. ui/map.js draws them. */
var PML=[['bands','Fetters'],['sab','Saboteurs'],['cx','Complexes'],['hyper','Hyper'],
         ['pain','Pain'],['nerves','Flow']];

/* pain regions, front view. each owns a band set, a y-span on the figure, and
   now the boxes it occupies in the figure's own 100 by 100 space.

   THE SPAN ALONE COULD NOT BE PAINTED ON. y0 and y1 answer how far down, which
   is all a row of buttons needed, and the owner asked for the map to start
   blank and be painted instead. A band across the whole width cannot be a hit
   area here: arms and torso share every row between 26 and 45, and hands and
   legs share 48 to 56, so a full width strip for either swallows the other.

   box is a list because a limb is two of them, one per side, and a central
   region is a list of one. The coordinates are the same space the addresses
   are placed in, so a box is checked against the figure and not against a
   guess. They are clipped to the silhouette when drawn, which is why a box may
   run past the body: the clip trims it to the arm rather than the author
   having to trace one. Smaller regions are drawn last so they take the click
   where two overlap. */
var PAINREG=[
 {k:'head',box:[[43.5,2,56.5,17]],nm:'Head',bands:['Crown','3rd Eye'],y0:0,y1:16,
  common:'tension headache, migraine, jaw clench, eye strain',
  pattern:'Overthinking and hypervigilance. The eye and crown holding what the body cannot resolve.'},
 {k:'throat',box:[[45,16,55,25]],nm:'Throat',bands:['Throat'],y0:16,y1:25,
  common:'globus, thyroid strain, chronic clearing, voice loss',
  pattern:'Truth withheld. Apathy at the shoulder girdle and the throat, silence chosen over cost.'},
 {k:'shoulders',box:[[36,19,64,28]],nm:'Shoulders',bands:['Throat','Heart'],y0:19,y1:28,
  common:'trapezius knots, frozen shoulder, upper back burn',
  pattern:'Carrying what is not yours. Duty overshot into martyrdom.'},
 {k:'arms',box:[[30.5,23,39.5,50],[60.5,23,69.5,50]],nm:'Arms',bands:['Heart','Throat'],y0:22,y1:52,
  common:'tennis elbow, carpal tunnel, radiating ache',
  pattern:'Reaching and not receiving. Blocked receiving at the anterior cardiac.'},
 {k:'torso',box:[[39,26,61,45]],nm:'Torso',bands:['Heart','Solar'],y0:26,y1:45,
  common:'reflux, IBS, rib tension, shallow breath, chest tightness',
  pattern:'Anger held at the celiac and grief at the cardiac. The two most loaded plexuses in most fields.'},
 {k:'pelvis',box:[[40,44,60,60]],nm:'Pelvis',bands:['Sacral','Root'],y0:44,y1:60,
  common:'low back pain, hip impingement, pelvic floor tension, sciatica',
  pattern:'Shame at the pudendal and fear at the lumbar. Safety and worth, held in the base.'},
 {k:'legs',box:[[40,56,60,90]],nm:'Legs',bands:['Root','Sacral'],y0:56,y1:94,
  common:'knee pain, plantar strain, restless legs, shin ache',
  pattern:'Ground not trusted. Fear at the root refusing to let weight down.'},
 {k:'hands',box:[[27.5,48,38,61],[62,48,72.5,61]],nm:'Hands',bands:['Heart'],y0:46,y1:56,
  common:'grip pain, finger stiffness, cold hands',
  pattern:'Holding on. Control chosen over flow.'},
 {k:'feet',box:[[39,89,61,99]],nm:'Feet',bands:['Root'],y0:90,y1:99,
  common:'plantar fasciitis, arch collapse, numbness',
  pattern:'Contact with the ground refused. The root address will not discharge.'}];
