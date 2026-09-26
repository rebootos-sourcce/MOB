/* ============================================================
   THE STATES COPY. Prototype, round DK, 26 September.

   His model, and the four definitions below are his words given back:
     "your sun is how you express yourself physically, your moon is your
      internal monologue, your rising is the driving energy, the driving kind
      of motivators, and your Eastern symbol is how you navigate the world."

   Those four are the four stations of the circuit the product already
   reads. BIBLE.md: "the world around you, what arrives from it, the way you
   read what arrives, the intention behind it, and the action that follows.
   Four stations, one circuit." The stack stands them up bottom to top:

     Year    the ground: the world, and how you move through it
     Moon    how you read what arrives
     Rising  the intention behind it
     Sun     the action, which is the body

   and closes the loop from the sun back to the moon, the body against the
   voice inside, which is the mind and body gap the product exists to close.
   The first cut closed it from the sun to the year instead, and read every
   joint on push and hold. See synth.js for why that was dropped.

   COMPOSITIONAL, NOT A TABLE OF EVERY CHART. 12 x 12 x 12 x 12 x 5 is about
   a hundred thousand charts. Every sign is written once per position, every
   animal once, every element once, and every joint is derived. The whole
   reading is those pieces in circuit order, so a combination nobody wrote
   still reads as a sentence somebody did.

   Every line is a Reading or a Definition, never both. Second person,
   present tense, physical verbs. No line tells a person what they should
   do, because a birth date is not something to change.
   ============================================================ */
var ST_POS={
 year:  {nm:'Year',   def:'How you navigate the world.', station:'the world'},
 moon:  {nm:'Moon',   def:'Your internal monologue.', station:'the read'},
 rising:{nm:'Rising', def:'The driving energy. What motivates you.', station:'the intention'},
 sun:   {nm:'Sun',    def:'How you express yourself physically.', station:'the action'}};
/* THE STACK, BOTTOM UP. The year is the ground: how you move through the
   world, counted on a different wheel from the other three. On it stand the
   read, the intention and the action, and the loop closes where the action
   comes back to the read, which is the body against the voice inside. That
   joint is the gap between mind and body the product exists to close, so it
   is the one that closes the circle. */
var ST_ORDER=['year','moon','rising','sun'];
var ST_WHEEL=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
 'Sagittarius','Capricorn','Aquarius','Pisces'];

/* ---- the sun. the body, in front of people. ---- */
var ST_SUN={
 Aries:'You move first and find out by moving. The body is through the door before the plan is.',
 Taurus:'You plant your feet. The body moves slowly, and once it is set it does not get pushed.',
 Gemini:'Your hands and your mouth run together. You talk with the whole body and change direction mid sentence.',
 Cancer:'You turn side on to protect what is soft. The body guards first and opens once it is sure.',
 Leo:'You take the centre of the room. The body is built to be seen doing the work.',
 Virgo:'Your hands go to the detail. You straighten the crooked thing on the table before you sit down.',
 Libra:'You match the room. Your posture mirrors whoever is in front of you, and you smooth the edges.',
 Scorpio:'You go still and watch. The body holds its force back until it is certain, then commits all of it.',
 Sagittarius:'You range. The body wants open ground and a longer stride than the room allows.',
 Capricorn:'You carry weight upright. The body works the long climb and does not show the load.',
 Aquarius:'You stand at the edge of the group. The body keeps a little distance so the eyes can see the whole.',
 Pisces:'Your edges are soft. The body takes on the mood of the room and moves with it.'};
/* ---- the moon. the voice inside. ---- */
var ST_MOON={
 Aries:'The voice inside is impatient. It says go now, and it argues with anything that makes you wait.',
 Taurus:'The voice inside wants the ground solid. It says keep what works, and it pushes back on any change you did not choose.',
 Gemini:'The voice inside never stops talking. It runs three conversations at once and replays the last one.',
 Cancer:'The voice inside keeps watch over the people you hold. It remembers every slight and every kindness.',
 Leo:'The voice inside wants to know it mattered. It replays the moment and asks whether anyone saw.',
 Virgo:'The voice inside checks the work. It finds the flaw first and says it is not finished yet.',
 Libra:'The voice inside weighs both sides. It keeps asking what the other person thinks, and the answer waits on it.',
 Scorpio:'The voice inside goes to the bottom of it. It trusts nothing it has not tested and forgets nothing it found.',
 Sagittarius:'The voice inside looks past the edge of the map. It says there is more out there, and it gets restless when there is not.',
 Capricorn:'The voice inside says hold it together. It plans three moves ahead and counts what it is carrying.',
 Aquarius:'The voice inside stands back and watches. It takes a feeling apart before it lets you have it.',
 Pisces:'The voice inside has no hard edge. It takes in what everyone around you feels and cannot always tell whose it is.'};
/* ---- the rising. what drives. ---- */
var ST_RISE={
 Aries:'What drives you is the start. The first move, the open field, the thing nobody has tried.',
 Taurus:'What drives you is security. Something built, held and paid for, that nobody can take.',
 Gemini:'What drives you is the next piece of information. An open question is a motor running.',
 Cancer:'What drives you is the safety of your people. You work hardest when someone you hold is exposed.',
 Leo:'What drives you is being seen doing it. Recognition is the fuel, and without it the engine stalls.',
 Virgo:'What drives you is getting it right. A broken system you can fix pulls harder than a reward.',
 Libra:'What drives you is balance. A gap between people pulls you in to close it.',
 Scorpio:'What drives you is what sits under the surface. You go after it and stay until you have it.',
 Sagittarius:'What drives you is the horizon. A bigger question, a further place, room to run.',
 Capricorn:'What drives you is the summit. Rank, structure, a thing that will stand after you.',
 Aquarius:'What drives you is the new version. You push against how it has always been done.',
 Pisces:'What drives you is the pull of something larger than you. Meaning moves you more than reward does.'};

/* ---- the short forms, which the headline is built from ---- */
var ST_SUN_PH={
 Aries:'a body that moves first', Taurus:'planted feet', Gemini:'quick hands',
 Cancer:'a guarded front', Leo:'a body built to be seen', Virgo:'exact hands',
 Libra:'a posture that matches the room', Scorpio:'a still body holding its force',
 Sagittarius:'a long stride', Capricorn:'a straight back under load',
 Aquarius:'a body at the edge of the group', Pisces:'soft edges'};
var ST_MOON_PH={
 Aries:'an impatient voice inside', Taurus:'a voice inside that wants solid ground',
 Gemini:'a voice inside that never stops talking', Cancer:'a watchful voice inside',
 Leo:'a voice inside asking whether anyone saw', Virgo:'a voice inside checking the work',
 Libra:'a voice inside weighing both sides', Scorpio:'a voice inside that tests everything',
 Sagittarius:'a restless voice inside', Capricorn:'a voice inside saying hold it together',
 Aquarius:'a voice inside standing back to watch', Pisces:'a voice inside with no hard edge'};
var ST_RISE_PH={
 Aries:'driven by the start', Taurus:'driven by security', Gemini:'driven by the next question',
 Cancer:'driven to keep your people safe', Leo:'driven to be seen', Virgo:'driven to get it right',
 Libra:'driven to close the gap between people', Scorpio:'driven to reach what is underneath',
 Sagittarius:'driven by the horizon', Capricorn:'driven by the summit',
 Aquarius:'driven by the new version', Pisces:'driven by something larger than you'};

/* ---- the year. the animal is how you move, the element is what that
   movement does to the ground. His two, given back:
     water rat  "constantly on the hunt to find solutions, to look for the
                cheese, the water symbol means I conform to a shape or I can
                change the shape of mountains"
     fire horse "trample and change, setting everything ablaze" ---- */
var ST_ANIMAL={
 Rat:'You hunt. You are always on the move for the solution, scanning for the gap and the cheese behind it.',
 Ox:'You plough. You pull the load in a straight line, one furrow at a time, and do not renegotiate the field.',
 Tiger:'You pounce. You take the risk in one leap and deal with the landing after.',
 Rabbit:'You find the side path. You avoid the collision and keep every relationship whole on the way through.',
 Dragon:'You take the sky. You occupy more space than you were offered, and the room rearranges around you.',
 Snake:'You coil. You wait, you watch, and you strike once.',
 Horse:'You run. You move to relieve pressure, and you trample what stands in the way.',
 Goat:'You climb. You give way on the surface and keep your footing underneath, on ground others will not try.',
 Monkey:'You swing. You find the shortcut, try it, and are three branches on before anyone follows.',
 Rooster:'You call it. You name the thing out loud, early, and keep order in the yard.',
 Dog:'You guard. You stay with your pack and walk the perimeter long after the threat has gone.',
 Pig:'You forage and share. You give more than the exchange required and make the table bigger.'};
var ST_CELEM={
 Water:'Water takes the shape of whatever holds it, and given time it changes the shape of the mountain.',
 Fire:'Fire sets what it touches alight, so change follows you whether you meant it or not.',
 Wood:'Wood grows toward the light. You need room, and you split what stands in the way of the growth.',
 Metal:'Metal cuts clean and holds an edge. You decide, divide, and keep the line you drew.',
 Earth:'Earth holds. You steady whatever you stand on, and you are slow to be moved off it.'};

/* ---- push and hold. Both systems carry a direction. A western sign is
   fire or air, which pushes, or earth or water, which holds. A year is yang
   or yin by its stem, and yang pushes. That is the one axis the two systems
   share, so it is the one the year's joints are read on. ---- */
var ST_PUSH={fire:1, air:1, earth:0, water:0};
var ST_POL={
 year:  ['you let the world come to you','you meet the world head on'],
 moon:  ['the voice inside wants to wait and feel it through','the voice inside wants to act'],
 rising:['the drive is to secure and keep','the drive is to go out and start'],
 sun:   ['the body holds back','the body moves first']};
/* what a shear costs depends on where in the circuit it sits */
var ST_SHEAR_COST={
 'moon>rising':'What you tell yourself and what you want pull apart, so a decision gets made twice.',
 'rising>sun':'What you want and what the body does pull apart, so the move arrives late or sideways.',
 'sun>moon':'What the body does and what the voice inside says do not agree, so you act and then argue with it.'};
/* the ground joint, composed from the year's direction and the lean of
   the three on it. {Y} is the year's own clause, {D} the lean. */
var ST_GROUND={
 braced:'The ground carries the stack. {Y}, and most of the layers on it {D} too.',
 offset:'The ground runs across the stack. {Y}, and most of the layers on it {D}. What you build stands on ground moving the other way.'};
var ST_LEANS=['hold','push out'];
var ST_JOINT={
 flush:'Flush. The same sign on both layers, so they are one material.',
 braced:'Braced. Two or four signs apart, one direction, so each holds the other up.',
 offset:'Offset. One or five signs apart. The layers do not line up and do not fight, and each works around the other.',
 shear:'Shear. Three signs apart, or opposite. The joint is loaded and slips.'};
/* the weight, when the three western layers lean one way. with the cost. */
var ST_WEIGHT={
 fire:'Mostly fire. You start things, and the heat shows. The cost is the finish.',
 earth:'Mostly earth. You build and you hold. The cost is speed, and letting go.',
 air:'Mostly air. You think it through and talk it out. The cost is the body, which gets left behind.',
 water:'Mostly water. You feel it before you think it. The cost is telling your own weather from the room.',
 none:'No element carries the three. Each layer runs on its own fuel, and the cost is the switch between them.'};
var ST_CLEAN='No joint shears. Nothing in the stack fights the rest, and the cost is that nothing in it brakes you either.';
/* the method, said once, on demand. Definition bucket. */
var ST_METHOD='The three western joints are read off where the signs sit on the wheel. '
 +'The same sign is flush. Two or four apart is braced. One or five apart is offset. '
 +'Three apart, or opposite, is shear. The year is counted on a different wheel, so it is read '
 +'as the ground: a yang year pushes and a yin year holds, and the ground either carries the '
 +'direction of the layers on it or runs across it.';
if(typeof module!=='undefined')module.exports={ST_POS:ST_POS,ST_ORDER:ST_ORDER,ST_WHEEL:ST_WHEEL,ST_GROUND:ST_GROUND,ST_LEANS:ST_LEANS,ST_SUN:ST_SUN,ST_MOON:ST_MOON,
 ST_RISE:ST_RISE,ST_SUN_PH:ST_SUN_PH,ST_MOON_PH:ST_MOON_PH,ST_RISE_PH:ST_RISE_PH,ST_ANIMAL:ST_ANIMAL,
 ST_CELEM:ST_CELEM,ST_PUSH:ST_PUSH,ST_POL:ST_POL,ST_SHEAR_COST:ST_SHEAR_COST,ST_JOINT:ST_JOINT,
 ST_WEIGHT:ST_WEIGHT,ST_CLEAN:ST_CLEAN,ST_METHOD:ST_METHOD};
