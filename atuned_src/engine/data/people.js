
/* ============================================================
   PEOPLE. Twelve worked examples across the coherence scale, and four of the
   owner at four points on it. c = held fetter, rep = coherent opposite
   installed. A high rep is not health. Past 7 it is jouissance: the thing
   done past the point where it serves, and not able to stop.

   CUT TO TWELVE IN ROUND QD, 2 October, his words: "There are too many now.
   let's have 12, with a range that gives us a little bit of flavor across the
   scale from 0 to 100." The roster was forty four: the six ICPs, eight
   reference cases and thirty in a tier ladder (round PL, J12). The twelve kept
   are the ten the practitioner page lists (PRAC_TEN, ui/practitioner.js), and
   Tomas and Rosa, because those twelve are the ones gates and surfaces name:
   tests/engine.js reads Rosa, Ana and Gordon as the cleared, middle and
   collapsed cases and Tomas, Wren and Abraham as the ends of the scale. With
   the four below they run from 3.8 to 100 and touch nine of the ten bands.
   The one band no example sits in is Corrupt, 21 to 30: the ladder carried it
   (Hamid, Beatrix, Jonah) and the twelve the gates name do not. Nkem and the
   first Lance, the author at 92, went with the ladder: Nkem sat at 14.5
   beside Gordon at 17.5 and the developer at 15, and four of the owner
   replace one. Their tables are in git history at 4742bf6.

   THE TIER A PERSON SITS IN IS READ OFF THEIR LAW TABLE IN LAWSET AND NOTHING
   ELSE. CQ is the 21 laws summed over 210 (compute.js), so the charge a person
   carries does not move the word. That is the ruling and it is the reason a
   heavy field can sit beside a high tier on purpose (Wren), and it is also the
   reason a new person's tier is chosen by solving the law table against a
   target CQ and then confirming it in the browser, where the intake seeded in
   ui/personas.js hands the same mean back. Append new people at the end: the
   browser's persona index is this index plus one, because ui/personas.js puts
   the blank profile in front, and a number typed into a gate or a doc is only
   right while the order holds. The first eight are in their original order for
   that reason, since tests/design.js and tests/device.js still load by index.
   The picker is sorted by tier on its own (ui/personas.js), so the order here
   carries no meaning.

   THE NAME IS THE KEY. LAWSET, BIRTH, FULLNAME, the scratch record loadP keeps
   (PROF_BY), the practitioner list and both history tables (pracex.js,
   exdepth.js) look a person up by nm, so no two entries may share one. Two
   entries called Lance would share one scratch record, and the second one
   opened would show the first one's intake answers.

   EACH ONE HAS A BANK AND A VAULT: a journal and a release history, replayed
   through the real writers by engine/exdepth.js when the example is opened.
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
 {nm:'Angela',age:36,role:'seeker, six kinds of healing · ICP',dom:17,a1:11,a2:5,
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
    with an empty wheel tells a person they are the wrong customer.

    THE TARGETS ABOVE ARE THE ORIGINAL ONES, AND ONLY TWO OF THE FOUR STILL
    HOLD. CQ stopped being load times laws on 25 September, and the four tables
    were never re-solved, so they read 25.9, 45.6, 91.3 and 89.2: the floor pair
    sat in two different bands, one of them the median, and the ceiling pair in
    two. Measured again on 2 October (J12). Tomas is solved again to 3.8 and
    reads Collapsed. Nkem was solved to 14.5, Severe, and was cut with the
    ladder in round QD.
    Wren (91.1, Mastery) and Abraham (89.1, Embodied) are left where they are.
    Abraham carries a held shame of 5.4 and six installed poles near 5, which
    is Embodied, "real load still in it", and moving him to the top of the
    scale would have made the field contradict the word. */
 {nm:'Tomas',age:58,role:'long haul driver, off the road fourteen months',dom:0,a1:9,a2:4,
  says:'I used to drive nine hundred miles and feel nothing. Now I cannot get to the end of the street.',
  c:{Fear:9.4,Anger:8.2,Shame:9.1,Disgust:7.6,Apathy:9.6,Shock:8.8,Sad:9.5,Surprise:6.4,Anticipation:8.9},
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
 /* ---- the owner, four times. Round QD, his words: "give me ... one of me
    with a CQ of fifteen, fifty, eighty-five and one hundred. That says Lance,
    comma, developer." He said three and then named four numbers, and all four
    are here because four were named.

    Each is a whole worked example in the shape every other one has, not a
    special case. The soul is his: dom 0, a1 0, a2 6, carried from the profile
    he asked for in round PL. The laws keep the shape he gave for himself then,
    patience and humility lowest, detachment next, then temperance, then the
    three of forgiveness, unity and equanimity, then presence, nature and
    generosity, and the rest level, moved up or down together to land on each
    target. The held side follows his own: anticipation heaviest, then anger
    and sadness. Measured off compute(): fifteen holds 49 addresses over the
    line, fifty holds 12, eighty five holds one, the waiting he names in his
    line, and a hundred holds none: the held side is his own table from 92, the
    whole let go list behind him. Its installed side is his shape set under 7
    and not his 8.4 to 9.3, for two reasons. Past 7 is jouissance, by the
    header above, which a ceiling reading should not carry. And an installed
    side that high outweighs any charge a story can write, so the engine finds
    nothing carrying and refuses every release, and his vault could only ever
    read empty. Measured: with every law at ten a held charge lands at 58 per
    cent of itself, and two anxious entries left nought addresses carrying.
    Anticipation carries nothing installed at all, the need to know what comes
    next, which is the one thread through all four of him: five addresses
    carry it under the line, none is held, and it is what his journal writes to
    and his releases take. No birth and no
    full name, the same ruling as before: they are his to enter, and a made up
    birth would be read back to him as his own.

    ONE HUNDRED IS EVERY LAW AT A FULL TEN. CQ is the 21 laws over 210, so
    there is no other way to read 100. In round PL he said he does not believe
    in true tens, and the first Lance was solved to 92 with none for that
    reason. Built as asked, and the contradiction is his to rule on.

    The number in each name is there because four people cannot share a name
    in this roster (the header above says why). The picker reads "Lance 15, 54,
    developer". */
 {nm:'Lance 15',age:54,role:'developer',dom:0,a1:0,a2:6,
  says:'I ship at four in the morning and wake at six with my jaw already set. I built the thing that reads this, and it reads me as heavy.',
  c:{Fear:7.6,Anger:8.2,Shame:7.4,Disgust:5.2,Apathy:6.8,Shock:6.4,Sad:7.8,Surprise:4.4,Anticipation:8.8},
  rep:{Anticipation:1.4}},
 {nm:'Lance 50',age:54,role:'developer',dom:0,a1:0,a2:6,
  says:'Some weeks the work runs clean and I sleep through. Then one call lands wrong and I watch my own hands go back to the old wiring.',
  c:{Fear:5.8,Anger:6.6,Shame:5.4,Disgust:3.6,Apathy:4.4,Shock:4,Sad:6,Surprise:3,Anticipation:7.4},
  rep:{Anticipation:3,Anger:2.4}},
 {nm:'Lance 85',age:54,role:'developer',dom:0,a1:0,a2:6,
  says:'Most of it moves through me now. I still catch on waiting, and on needing to be the one who is right in the room.',
  c:{Fear:1.6,Anger:6.8,Shame:1.4,Disgust:1,Apathy:1.2,Shock:1,Sad:2,Surprise:0.8,Anticipation:8.2},
  rep:{Fear:6.4,Anger:1.2,Shame:6.6,Disgust:6.2,Apathy:6.4,Shock:6,Sad:5.8,Surprise:6,Anticipation:0.8}},
 {nm:'Lance 100',age:54,role:'developer',dom:0,a1:0,a2:6,
  says:'Nothing is holding. I keep this one to see what the instrument says at the ceiling, and whether it still tells the truth up there.',
  c:{Fear:.5,Anger:1,Shame:.5,Disgust:.5,Apathy:.5,Shock:.5,Sad:1,Surprise:.5,Anticipation:1.5},
  rep:{Fear:6.6,Anger:6.4,Shame:6.8,Disgust:6.6,Apathy:6.7,Shock:6.3,Sad:6.5,Surprise:6.2}}];


/* law values per persona. `_` is the baseline; named laws override it.
   The original assigned a `Humility` law to James and Gordon. There is no
   Humility among the 21, so it was silently dropped and their intended
   character note never reached the engine. Carried here by the laws that
   do exist. */
const LAWSET={
 You:    {_:6.5},
 /* found by bisection against compute(), not chosen by feel */
 /* TOMAS, NKEM AND ANA WERE RE-SOLVED ON 2 OCTOBER against the CQ that is the
    21 laws over 210. Their tables were bisected under the model where load
    pulled CQ down, and the 25 September ruling took that out: Tomas, solved to
    2 and described as unable to get to the end of the street, read 25.9 and
    then 30.8 on screen, Incoherent, beside a field carrying 77 addresses.
    Nkem, solved to 10, read the median. The shape of each table is kept (what
    the person still does is the highest thing in it) and the level is the new
    solve. Tomas 3.8, Collapsed. */
 Tomas:  {_:.124, Courage:.5, Truth:.7, Patience:.6, Duty:2, 'Non-Harm':2.2},
 Wren:   {_:9.221, Patience:9.4, Temperance:9.2, 'Aesthetic Beauty':9.6, Forgiveness:6.8},
 Abraham:{_:8.702, Equanimity:9.7, Justice:9.8, Humility:9.5, Presence:9.6, Temperance:9.4},
 Sofia:  {_:7.6, Compassion:8.6, 'Non-Harm':9.1, Generosity:8.2, Detachment:2.4, Temperance:3.1},
 Diane:  {_:6.1, Duty:8.4, Responsibility:8.1, Accountability:7.6, Temperance:2.2, Patience:2.6, Detachment:3.4},
 Marcus: {_:6.4, Humility:8.8, Truth:7.9, 'Aesthetic Beauty':9.2, Compassion:2.8, Forgiveness:2.4, Unity:3.3},
 Angela: {_:6.9, Unity:8.4, Nature:8.1, Awareness:7.4, Truth:2.6, Humility:2.1, Accountability:3.2},
 Derek:  {_:4.6, Courage:9.0, Duty:8.3, Responsibility:7.7, Temperance:1.8, 'Non-Harm':2.9, Equanimity:3.1},
 James:  {_:4.4, Accountability:7.8, Truth:6.9, Compassion:1.6, Forgiveness:1.9, Unity:2.2, Transparency:2.4},
 Rosa:   {_:9.6, Presence:10, Equanimity:10, Compassion:10, 'Non-Harm':10, Unity:9.8, Patience:9.9},
 /* Ana 37.2, Incoherent: "caught between the weight in your body and the odd
    moment of seeing clearly", with forty one addresses carrying. She read 41.1,
    the first number of Oscillating, which is a band about days that swing
    either way and not about a year of being in the middle of something. */
 Ana:    {_:3.828, Truth:6.4, Courage:6, Equanimity:1.9, Patience:2.1, Detachment:1.6, Temperance:2.7},
 Gordon: {_:1.9, Duty:3.0, Compassion:1.0, Forgiveness:1.0, Transparency:1.0, Truth:1.2, Unity:1.1},
 /* THE OWNER, FOUR TIMES. His own shape from round PL, every offset kept and
    the level moved: six laws at the top value, five a tenth under it (the
    tenth is what lands the sum on the target, since a shared step moves the
    sum 2.1 at a time), presence, nature and generosity a tenth under the top,
    unity, forgiveness and equanimity two, temperance three, detachment four,
    humility a whole point and patience a point and a tenth. The sum over 210
    is the target to the tenth, and the browser hands the same mean back
    through the seeded intake. One hundred has no shape left to keep: every
    law is ten. */
 'Lance 15': {_:1.7, Truth:1.7, 'Aesthetic Beauty':1.7, Awareness:1.7, Accountability:1.7, Transparency:1.7, 'Non-Harm':1.7,
            Responsibility:1.6, Courage:1.6, Justice:1.6, Compassion:1.6, Duty:1.6,
            Presence:1.6, Nature:1.6, Generosity:1.6, Unity:1.5, Forgiveness:1.5, Equanimity:1.5,
            Temperance:1.4, Detachment:1.3, Humility:0.7, Patience:0.6},
 'Lance 50': {_:5.2, Truth:5.2, 'Aesthetic Beauty':5.2, Awareness:5.2, Accountability:5.2, Transparency:5.2, 'Non-Harm':5.2,
            Responsibility:5.1, Courage:5.1, Justice:5.1, Compassion:5.1, Duty:5.1,
            Presence:5.1, Nature:5.1, Generosity:5.1, Unity:5, Forgiveness:5, Equanimity:5,
            Temperance:4.9, Detachment:4.8, Humility:4.2, Patience:4.1},
 'Lance 85': {_:8.7, Truth:8.7, 'Aesthetic Beauty':8.7, Awareness:8.7, Accountability:8.7, Transparency:8.7, 'Non-Harm':8.7,
            Responsibility:8.6, Courage:8.6, Justice:8.6, Compassion:8.6, Duty:8.6,
            Presence:8.6, Nature:8.6, Generosity:8.6, Unity:8.5, Forgiveness:8.5, Equanimity:8.5,
            Temperance:8.4, Detachment:8.3, Humility:7.7, Patience:7.6},
 'Lance 100':{_:10}};

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
 Wren:   {d:'1959-04-17', t:'08:35', p:'Portland, OR'},
 Abraham:{d:'1951-06-29', t:'11:20', p:'Boulder, CO'}};
 /* The four Lance profiles have no record here and are left without one: it
    is his to enter, and a made up birth would be read back to him as his own.
    A place this table does not name can carry its time zone, z, which settles
    the clock offset for that year and lends the zone's own point as a horizon,
    so Rising still resolves; the ladder used it and was cut in round QD. */
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
 Aquarius:'stands outside the group to see it',
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
/* WHAT A MEETING POINT SAYS, to the person, when two systems land on it.
   FV in TASKS.md, his words: "take a look at all the behavioral energetics
   where they overlap, because that's the truth." engine/overlap.js finds the
   overlap and these are what it reads out. Second person, because this is
   the one line in Root Energetics said to somebody rather than about a
   placement, and his bar for it is plain, direct and warm without talking
   down. The five elements are the ones two systems can share: Western and
   Eastern both name fire, earth and water, and the Chinese five reach wood
   and metal through the design gate's trigrams. Air has no counterpart in
   either Chinese system, so it can never be a meeting point and has no line.
   The nine planets are the ones numerology gives the digits, which are the
   only planets a sign's ruler can meet a number on. */
var ROOT_SAYS={
 Fire:'You run hot. You start things, burn bright and need something to burn.',
 Earth:'You steady things. You hold your ground and take time to be moved.',
 Water:'You find the low route. You go around what blocks you and still arrive.',
 Wood:'You grow toward room. You push outward and need space to do it.',
 Metal:'You cut clean. You hold an edge and know where the line is.',
 Sun:'You need to be the one doing it, and to be seen doing it.',
 Moon:'You run on feeling first and check the facts after.',
 Mercury:'You think out loud and move on fast.',
 Venus:'You weigh things by how they sit between people.',
 Mars:'You go at the problem head on, and early.',
 Jupiter:'You widen the frame until the problem looks smaller.',
 Saturn:'You build the structure first and carry its weight.',
 Uranus:'You break the pattern to see what it was holding.',
 Neptune:'You soften the edge between you and what you take in.'};
/* THE PROFILE LINES, the one Human Design reading this product computes that
   has a behaviour and no counterpart in the other three systems. Each is the
   line's standing theme in that system, 1 the investigator through 6 the role
   model, said as what the line does rather than by its name, which is how
   every other table here reads. It is never a meeting point, because nothing
   else speaks in lines, so it is always part of the range. */
var HD_LINE_RUNS={
 1:'studies the ground before standing on it',
 2:'does its best work alone, until somebody calls it out',
 3:'learns by what breaks',
 4:'moves through the people it already knows',
 5:'gets handed other people’s hopes, and a practical fix',
 6:'tries everything first, then steps back and shows the way'};
var LP2ARCH={1:'Warrior',2:'Lover',3:'Creator',4:'Ruler',5:'Explorer',6:'Caregiver',
 7:'Sage',8:'Ruler',9:'Magician',11:'Magician',22:'Creator',33:'Sage'};
