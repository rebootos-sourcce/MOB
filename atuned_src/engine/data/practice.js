
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

/* ---------- the seven seats, and where they sit on the figure ---------- */
var PMBANDS=[
 {k:'crown', c:PAL.Crown,     nm:'Crown',     b:'Crown',  yp:4.98, r:9},
 {k:'eye',   c:PAL['3rd Eye'],nm:'Third Eye', b:'3rd Eye',yp:12.56,r:8},
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
var PML=[['bands','Fetters'],['sab','Saboteurs'],['cx','Complexes'],['hyper','Hyper'],
         ['masks','Masks'],['pain','Pain'],['nerves','Flow']];

/* pain regions, front view. each owns a band set and a y-span on the figure. */
var PAINREG=[
 {k:'head',nm:'Head',bands:['Crown','3rd Eye'],y0:0,y1:16,
  common:'tension headache, migraine, jaw clench, eye strain',
  pattern:'Overthinking and hypervigilance. The eye and crown holding what the body cannot resolve.'},
 {k:'throat',nm:'Throat',bands:['Throat'],y0:16,y1:25,
  common:'globus, thyroid strain, chronic clearing, voice loss',
  pattern:'Truth withheld. Apathy at the shoulder girdle and the throat, silence chosen over cost.'},
 {k:'shoulders',nm:'Shoulders',bands:['Throat','Heart'],y0:19,y1:28,
  common:'trapezius knots, frozen shoulder, upper back burn',
  pattern:'Carrying what is not yours. Duty overshot into martyrdom.'},
 {k:'arms',nm:'Arms',bands:['Heart','Throat'],y0:22,y1:52,
  common:'tennis elbow, carpal tunnel, radiating ache',
  pattern:'Reaching and not receiving. Blocked receiving at the anterior cardiac.'},
 {k:'torso',nm:'Torso',bands:['Heart','Solar'],y0:26,y1:45,
  common:'reflux, IBS, rib tension, shallow breath, chest tightness',
  pattern:'Anger held at the celiac and grief at the cardiac. The two most loaded plexuses in most fields.'},
 {k:'pelvis',nm:'Pelvis',bands:['Sacral','Root'],y0:44,y1:60,
  common:'low back pain, hip impingement, pelvic floor tension, sciatica',
  pattern:'Shame at the pudendal and fear at the lumbar. Safety and worth, held in the base.'},
 {k:'legs',nm:'Legs',bands:['Root','Sacral'],y0:56,y1:94,
  common:'knee pain, plantar strain, restless legs, shin ache',
  pattern:'Ground not trusted. Fear at the root refusing to let weight down.'},
 {k:'hands',nm:'Hands',bands:['Heart'],y0:46,y1:56,
  common:'grip pain, finger stiffness, cold hands',
  pattern:'Holding on. Control chosen over flow.'},
 {k:'feet',nm:'Feet',bands:['Root'],y0:90,y1:99,
  common:'plantar fasciitis, arch collapse, numbness',
  pattern:'Contact with the ground refused. The root address will not discharge.'}];
