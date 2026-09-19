
/* ============================================================
   PEOPLE. Six ICPs with both poles, plus three reference cases.
   c = held fetter, rep = coherent opposite installed. A high rep is
   not health. Past 7 it is jouissance: the thing done past the point
   where it serves, and not able to stop.
   ============================================================ */
const PEOPLE=[
 {nm:'Sofia',age:41,role:'somatic practitioner · ICP',dom:12,a1:3,a2:1,
  says:'I hold the room for everyone. I have not been held in four years and I would not know how to ask.',
  c:{Fear:1.5,Anger:1,Shame:2,Disgust:1,Apathy:1,Shock:1,Sad:2.5,Surprise:1,Anticipation:2},
  rep:{Anger:8.6,Sad:6,Fear:5}},
 {nm:'Diane',age:46,role:'founder, second company · ICP',dom:6,a1:4,a2:6,
  says:'I work until the work is done and the work is never done. Rest feels like a moral failure.',
  c:{Fear:6,Anger:5,Shame:5,Disgust:3,Apathy:2,Shock:4,Sad:3,Surprise:3,Anticipation:8},
  rep:{Apathy:9.2,Anticipation:8.8}},
 {nm:'Marcus',age:44,role:'creative director · ICP',dom:1,a1:1,a2:6,
  says:'I can see what is wrong with anything in four seconds. It has cost me two studios.',
  c:{Fear:2,Anger:3.5,Shame:2,Disgust:4,Apathy:1.5,Shock:1.5,Sad:1.5,Surprise:1,Anticipation:3},
  rep:{Surprise:8.9,Anticipation:8.2}},
 {nm:'Angela',age:36,role:'seeker, six modalities · ICP',dom:17,a1:11,a2:5,
  says:'Everything happens for a reason. I have said that at three funerals and I believed it each time.',
  c:{Fear:2,Anger:1,Shame:2.5,Disgust:1,Apathy:2,Shock:2,Sad:3,Surprise:1.5,Anticipation:2},
  rep:{Sad:9.4,Disgust:9.1}},
 {nm:'Derek',age:39,role:'high performer, endurance · ICP',dom:5,a1:0,a2:7,
  says:'Pain is information. I have raced on a stress fracture. I would do it again.',
  c:{Fear:5,Anger:6,Shame:6,Disgust:4,Apathy:2,Shock:6,Sad:4,Surprise:3,Anticipation:7},
  rep:{Apathy:9,Shock:8.7}},
 {nm:'James',age:57,role:'C-suite, third turnaround · ICP',dom:2,a1:6,a2:0,
  says:'I make the call and I sleep fine. People find that cold. It is what they hired.',
  c:{Fear:6,Anger:8,Shame:7,Disgust:7,Apathy:5,Shock:7,Sad:4,Surprise:4,Anticipation:5},
  rep:{Shock:9.3,Shame:8.4}},
 {nm:'Rosa',age:61,role:'retired midwife',dom:12,a1:11,a2:1,
  says:'Nothing in particular. Things do not sit on me the way they used to.',
  c:{Fear:0,Anger:0,Shame:0,Disgust:0,Apathy:0,Shock:0,Sad:.5,Surprise:0,Anticipation:0},
  rep:{Fear:6,Anger:6,Shame:6,Disgust:6,Apathy:6,Shock:6,Sad:6,Surprise:6,Anticipation:6}},
 {nm:'Ana',age:47,role:'teacher, one year out',dom:8,a1:2,a2:5,
  says:'I am in the middle of something and I cannot see the far side of it.',
  c:{Fear:9,Anger:7,Shame:9,Disgust:7,Apathy:5,Shock:8,Sad:9,Surprise:6,Anticipation:7},
  rep:{Sad:4,Fear:3}},
 /* ---- the ends of the scale ----
    Four reference cases added on the owner's ruling, because the roster sat in
    the middle and the vocabulary at the ends had never been looked at with a
    real field behind it. Two at the floor and two near the ceiling, and the
    pairs are the point: 2 and 10 are both Collapsed, 92 and 98 are both Mastery.
    If one word has to carry both ends of each pair, the word is doing no work.

    The charge vectors were solved against compute() rather than invented, and
    the law scale for each was found by bisection to land the CQ on target. The
    two high cases deliberately still carry something, because a high reading
    with an empty wheel tells a person they are the wrong customer. */
 {nm:'Tomas',age:58,role:'long haul driver, off the road fourteen months',dom:0,a1:9,a2:4,
  says:'I used to drive nine hundred miles and feel nothing. Now I cannot get to the end of the street.',
  c:{Fear:9.4,Anger:8.2,Shame:9.1,Disgust:7.6,Apathy:9.6,Shock:8.8,Sad:9.5,Surprise:6.4,Anticipation:8.9},
  rep:{}},
 {nm:'Nkem',age:35,role:'paediatric nurse, third year of nights',dom:12,a1:3,a2:9,
  says:'I am very good at the job. I have started crying in the car park before the shift, not after.',
  c:{Fear:7.8,Anger:6.2,Shame:8.4,Disgust:5.1,Apathy:7.1,Shock:6,Sad:8,Surprise:4.2,Anticipation:7.4},
  rep:{}},
 {nm:'Wren',age:66,role:'luthier, forty one years at the bench',dom:1,a1:0,a2:11,
  says:'Most of it went quiet a long time ago. One thing did not, and I know exactly which.',
  c:{Fear:2,Anger:1.2,Shame:7.5,Disgust:1,Apathy:1.5,Shock:1.1,Sad:2,Surprise:0.7,Anticipation:2},
  rep:{Fear:5.4,Anger:4.8,Apathy:4.2,Sad:4.6}},
 {nm:'Abraham',age:74,role:'retired judge, eleven years of practice',dom:6,a1:8,a2:0,
  says:'I spent a career deciding for other people. The last decade has been learning to sit still.',
  c:{Fear:1,Anger:0.6,Shame:5.4,Disgust:0.4,Apathy:0.8,Shock:0.5,Sad:1.2,Surprise:0.3,Anticipation:0.9},
  rep:{Fear:6.2,Anger:5.8,Apathy:5.4,Sad:5.6,Shock:5,Disgust:4.8}},
 {nm:'Gordon',age:58,role:'managing partner',dom:2,a1:6,a2:0,
  says:'There is nothing wrong with me. Four people left in a year and each had their reasons.',
  c:{Fear:10,Anger:10,Shame:10,Disgust:10,Apathy:7,Shock:9,Sad:8,Surprise:6,Anticipation:8},rep:{}},
 /* THE OWNER'S OWN, added at his request so he can use the instrument as
    himself rather than as somebody he invented. He gave the shape and asked
    for the numbers to be simulated: fifty four, coherence near ninety two,
    high eights and high nines across the laws, and no true tens, because he
    does not believe in them. The whole let go list is behind him, which is
    why the held charge is low and the installed side is not.

    The laws were found by bisection against compute() rather than chosen by
    feel, the same way Tomas was. A ten would have been easy and wrong. */
 {nm:'Lance',age:54,role:'author',dom:0,a1:0,a2:6,
  says:'I built the instrument to read me. It does, and that is the part I did not plan for.',
  c:{Fear:.5,Anger:1,Shame:.5,Disgust:.5,Apathy:.5,Shock:.5,Sad:1,Surprise:.5,Anticipation:1.5},
  rep:{Fear:9,Anger:8.8,Shame:9.3,Disgust:9,Apathy:9.2,Shock:8.6,Sad:8.9,Surprise:8.4,Anticipation:8.7}}];


/* law values per persona. `_` is the baseline; named laws override it.
   The original assigned a `Humility` law to James and Gordon. There is no
   Humility among the 21, so it was silently dropped and their intended
   character note never reached the engine. Carried here by the laws that
   do exist. */
const LAWSET={
 You:    {_:6.5},
 /* found by bisection against compute(), not chosen by feel */
 Tomas:  {_:2.669, Courage:1.1, Truth:1.4, Patience:1.2, Duty:3.8, 'Non-Harm':4.1},
 Nkem:   {_:4.378, Compassion:8.2, Duty:8.8, 'Non-Harm':8.4, Temperance:1.6, Detachment:1.2, Patience:1.9},
 Wren:   {_:9.221, Patience:9.4, Temperance:9.2, 'Aesthetic Beauty':9.6, Forgiveness:6.8},
 Abraham:{_:8.702, Equanimity:9.7, Justice:9.8, Humility:9.5, Presence:9.6, Temperance:9.4},
 Sofia:  {_:7.6, Compassion:8.6, 'Non-Harm':9.1, Generosity:8.2, Detachment:2.4, Temperance:3.1},
 Diane:  {_:6.1, Duty:8.4, Responsibility:8.1, Accountability:7.6, Temperance:2.2, Patience:2.6, Detachment:3.4},
 Marcus: {_:6.4, Humility:8.8, Truth:7.9, 'Aesthetic Beauty':9.2, Compassion:2.8, Forgiveness:2.4, Unity:3.3},
 Angela: {_:6.9, Unity:8.4, Nature:8.1, Awareness:7.4, Truth:2.6, Humility:2.1, Accountability:3.2},
 Derek:  {_:4.6, Courage:9.0, Duty:8.3, Responsibility:7.7, Temperance:1.8, 'Non-Harm':2.9, Equanimity:3.1},
 James:  {_:4.4, Accountability:7.8, Truth:6.9, Compassion:1.6, Forgiveness:1.9, Unity:2.2, Transparency:2.4},
 /* HIGH EIGHTS AND HIGH NINES, AND NOTHING AT TEN. His own account of
    himself, and the one hard constraint here.

    He also said coherence around ninety two, and on his own blueprint those
    two statements cannot both be true. Measured against compute() on his soul:
    every law at 9.9 with nothing in the eights reaches 90.8. Nineteen laws at
    a full ten with two in the high eights reaches 90.5. Ninety two arrives
    only when all twenty one are at ten, which is the one thing he ruled out.

    So this is the honest maximum of what he described rather than the number
    he named: eighty nine. The two in the eights are patience and humility,
    which is a shape and not an accident, and the gap between eighty nine and
    ninety two is his to close or to revise. Found by bisection, not by feel. */
 Lance:  {_:9.9, Truth:9.9, 'Aesthetic Beauty':9.9, Awareness:9.9,
          Accountability:9.9, Transparency:9.9, 'Non-Harm':9.9,
          Responsibility:9.9, Courage:9.9, Justice:9.9, Compassion:9.9, Duty:9.9,
          Presence:9.8, Nature:9.8, Generosity:9.8,
          Unity:9.7, Forgiveness:9.7, Equanimity:9.7, Temperance:9.6,
          Detachment:9.5, Humility:8.9, Patience:8.8},
 Rosa:   {_:9.6, Presence:10, Equanimity:10, Compassion:10, 'Non-Harm':10, Unity:9.8, Patience:9.9},
 Ana:    {_:4.2, Truth:7.1, Courage:6.8, Equanimity:2.2, Patience:2.4, Detachment:1.9, Temperance:3.0},
 Gordon: {_:1.9, Duty:3.0, Compassion:1.0, Forgiveness:1.0, Transparency:1.0, Truth:1.2, Unity:1.1}};

/* ============================================================
   ENERGETICS. Nothing is stored beyond date, time and place.
   Everything else is a pure function of those three, so the schema
   stays clean and a sixth system costs nothing. The point of the
   overlay is CONVERGENCE: where independent systems agree, that is
   the signal. Where they disagree the instrument says so rather
   than picking a winner.
   ============================================================ */
var BIRTH={
 You:null,
 Sofia:  {d:'1985-03-14', t:'04:20', p:'Asheville, NC'},
 Diane:  {d:'1980-11-02', t:'09:05', p:'Chicago, IL'},
 Marcus: {d:'1982-07-23', t:'23:40', p:'Portland, OR'},
 Angela: {d:'1990-06-08', t:'12:15', p:'Santa Fe, NM'},
 Derek:  {d:'1987-01-19', t:'06:50', p:'Boulder, CO'},
 James:  {d:'1969-09-27', t:'17:30', p:'Boston, MA'},
 Rosa:   {d:'1965-02-11', t:'03:10', p:'Oaxaca, MX'},
 Ana:    {d:'1979-04-30', t:'20:45', p:'Lisbon, PT'},
 Gordon: {d:'1968-08-05', t:'14:00', p:'Greenwich, CT'},
 Tomas:  {d:'1967-11-22', t:'03:55', p:'Chicago, IL'},
 Nkem:   {d:'1990-09-03', t:'19:10', p:'Boston, MA'},
 Wren:   {d:'1959-04-17', t:'08:35', p:'Portland, OR'},
 Abraham:{d:'1951-06-29', t:'11:20', p:'Boulder, CO'}};
/* FULL NAMES, because numerology reads the name on the certificate and not the
   one on the door. The roster carried first names only, so every name number
   in the product was computed off a nickname, which is the numerological
   equivalent of reading a birth chart off the year alone. A real person's own
   full name comes off the profile; these are the reference cases.

   Middle names are here on purpose: the middle name is the one nobody uses and
   numerology reads it as the part that is carried rather than shown. Leaving
   them out would have moved every Expression in the roster. */
var FULLNAME={
 You:null,
 Sofia:  'Sofia Beatriz Alarcon',
 Diane:  'Diane Elizabeth Halloran',
 Marcus: 'Marcus Aurelius Vance',
 Angela: 'Angela Mercedes Ruiz',
 Derek:  'Derek Thomas Whitfield',
 James:  'James Edward Cavanaugh',
 Rosa:   'Rosa Milagros Otero',
 Ana:    'Ana Cristina Ferreira',
 Gordon: 'Gordon Blake Ashcroft',
 Tomas:  'Tomas Eduardo Ibarra',
 Nkem:   'Nkem Adaeze Okonkwo',
 Wren:   'Wren Josephine Halliday',
 Abraham:'Abraham Isaac Stern'};
var ZSIGN=[[1,20,'Aquarius','air','fixed'],[2,19,'Pisces','water','mutable'],
 [3,21,'Aries','fire','cardinal'],[4,20,'Taurus','earth','fixed'],
 [5,21,'Gemini','air','mutable'],[6,21,'Cancer','water','cardinal'],
 [7,23,'Leo','fire','fixed'],[8,23,'Virgo','earth','mutable'],
 [9,23,'Libra','air','cardinal'],[10,23,'Scorpio','water','fixed'],
 [11,22,'Sagittarius','fire','mutable'],[12,22,'Capricorn','earth','cardinal']];
var CHINESE=['Monkey','Rooster','Dog','Pig','Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat'];
var CELEM=['Metal','Metal','Water','Water','Wood','Wood','Fire','Fire','Earth','Earth'];
var ELEM2ROOT={fire:'Engine',earth:'Architect',air:'Witness',water:'Weaver'};
var MODE2NOTE={cardinal:'initiates',fixed:'holds',mutable:'adapts'};
var HDTYPE=['Manifestor','Generator','Manifesting Generator','Projector','Reflector'];
var LPMEAN={1:'starts',2:'joins',3:'expresses',4:'builds',5:'moves',6:'tends',
 7:'looks',8:'commands',9:'completes',11:'channels',22:'makes it real',33:'teaches'};
var ZGLYPH={Aries:'♈',Taurus:'♉',Gemini:'♊',Cancer:'♋',Leo:'♌',
 Virgo:'♍',Libra:'♎',Scorpio:'♏',Sagittarius:'♐',Capricorn:'♑',
 Aquarius:'♒',Pisces:'♓'};
/* how each thing RUNS through a person. behaviour, not definition. */
var SIGN_RUNS={
 Aries:'starts before it is ready and finds out by moving',
 Taurus:'holds position until the thing is actually built',
 Gemini:'takes in more channels than it closes',
 Cancer:'protects first, then decides whether to',
 Leo:'needs the work to be seen or it stops feeling real',
 Virgo:'corrects the detail that nobody asked about',
 Libra:'waits for the balance point and pays for the wait',
 Scorpio:'goes all the way down or does not go',
 Sagittarius:'widens the frame until the problem looks smaller',
 Capricorn:'builds the structure and then lives inside it',
 Aquarius:'stands outside the group in order to see it',
 Pisces:'dissolves the boundary and absorbs what is there'};
var HD_RUNS={
 Manifestor:'initiates without waiting. the cost is the resistance it creates',
 Generator:'responds to what is in front of it and sustains',
 'Manifesting Generator':'responds, then moves faster than the response expected',
 Projector:'sees the system before it is invited into it',
 Reflector:'takes the temperature of the room and returns it'};
var CH_RUNS={
 Rat:'reads the room and moves first', Ox:'carries the weight without renegotiating',
 Tiger:'takes the risk and deals with it after', Rabbit:'avoids the collision and keeps the relationship',
 Dragon:'occupies more space than was offered', Snake:'waits, then acts once',
 Horse:'moves to relieve pressure', Goat:'yields on the surface, holds underneath',
 Monkey:'finds the shortcut and takes it', Rooster:'names the thing out loud',
 Dog:'stays loyal past the point of evidence', Pig:'gives more than the exchange required'};
var CE_RUNS={
 Wood:'grows outward and needs room', Fire:'burns bright and needs fuel',
 Earth:'stabilises and resists moving', Metal:'cuts clean and holds an edge',
 Water:'finds the low route and gets there'};
var LP_RUNS={
 1:'goes first, alone if needed', 2:'joins and holds the pair together',
 3:'expresses it before it is finished', 4:'builds a thing that outlasts the builder',
 5:'moves before the walls close', 6:'tends the people and forgets the self',
 7:'looks at it until it makes sense', 8:'commands the structure and pays for it',
 9:'completes what others abandoned', 11:'channels more than it can hold',
 22:'makes the imagined thing physical', 33:'teaches by carrying it first'};
var LP2ARCH={1:'Warrior',2:'Lover',3:'Creator',4:'Ruler',5:'Explorer',6:'Caregiver',
 7:'Sage',8:'Ruler',9:'Magician',11:'Magician',22:'Creator',33:'Sage'};
