
/* ============================================================
   PEOPLE. Six ICPs with both poles, the reference cases, and the tier
   ladder: three people in each of the ten coherence bands, bottom of the
   band to the top, so a range exists to test every surface against.
   c = held fetter, rep = coherent opposite installed. A high rep is
   not health. Past 7 it is jouissance: the thing done past the point
   where it serves, and not able to stop.

   THE TIER A PERSON SITS IN IS READ OFF THEIR LAW TABLE IN LAWSET AND NOTHING
   ELSE. CQ is the 21 laws summed over 210 (compute.js), so the charge a person
   carries does not move the word. That is the ruling and it is the reason a
   heavy field can sit beside a high tier on purpose (Wren), and it is also the
   reason a new person's tier is chosen by solving the base law value, `_` in
   LAWSET, against a target CQ and then confirming it in the browser, where the
   intake seeded in ui/personas.js hands the same mean back. Append new people
   at the end: the browser's persona index is this index plus one, because
   ui/personas.js puts the blank profile in front, and a number typed into a
   gate or a doc is only right while the order holds. The picker is sorted by
   tier on its own (ui/personas.js), so the order here carries no meaning.
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
    reads Collapsed. Nkem is solved to 14.5 and reads Severe, which is her
    story and not a miss: a very good nurse whose day is spent before it starts
    is Severe, and the Collapsed band is now carried by three more people.
    Wren (91.1, Mastery) and Abraham (89.1, Embodied) are left where they are.
    Abraham carries a held shame of 5.4 and six installed poles near 5, which
    is Embodied, "real load still in it", and moving him to the top of the
    scale would have made the field contradict the word. */
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
  rep:{Fear:9,Anger:8.8,Shame:9.3,Disgust:9,Apathy:9.2,Shock:8.6,Sad:8.9,Surprise:8.4,Anticipation:8.7}},
 /* ---- the tier ladder. Thirty people, three to a band, added on the owner's
    ruling, round PL J12: "Fix all of the profiles. By tier. And then add three
    additional ones per tier. With different profiles. From minimum to medium to
    maximum. And stuff in between. I just need a range."

    A tier is the coherence band a reading's CQ lands in, Collapsed to Mastery
    (TIERDEF, canon.js). The three in each band are the bottom, the middle and
    the top of it, in that order, so the thirty and the people above them read
    as one continuous run from about one to about a hundred and no band has a
    gap a surface has never been looked at across. Each law table was solved by
    taking the named laws as the shape of the person and finding the base value
    for the other laws that lands the sum on the target, then every one was
    loaded in Chromium and read back through loadP, because the number a person
    sees is the intake's mean and not the table.

    What is held and what is installed do not follow the tier mechanically, on
    purpose. The tier is the laws. A person near the floor carries almost
    everything and has installed nothing. A person in the middle carries a
    little of several things and has begun to install the opposite. A person
    near the ceiling carries almost nothing and still has an installed side
    under 7, because a high reading with an empty wheel tells a person they are
    the wrong customer. The stories are in the first person, in the product's
    voice, and none of them names what is wrong with anybody. Names and roles
    are invented, and none of them is a real person. */
 {nm:'Pavel',age:52,role:'scaffolder, off the roof since the fall',dom:13,a1:10,a2:0,
  says:'I stopped answering the phone in March. I know who it is and I know what they will ask.',
  c:{Fear:9.2,Anger:6.5,Shame:8.8,Disgust:5,Apathy:9.8,Shock:9,Sad:9.4,Surprise:5.5,Anticipation:8.6},
  rep:{}},
 {nm:'Marisol',age:29,role:'call centre team lead',dom:11,a1:10,a2:3,
  says:'I run the whole shift from a metre behind my own head. The numbers come out right and I am not in them.',
  c:{Fear:8.4,Anger:5.2,Shame:8,Disgust:4.6,Apathy:9,Shock:6.8,Sad:8.2,Surprise:3.9,Anticipation:7.8},
  rep:{}},
 {nm:'Bilal',age:67,role:'taxi driver, widowed two winters',dom:8,a1:11,a2:3,
  says:'The flat is quiet in a way I have no word for. I leave the radio on so the rooms have a voice.',
  c:{Fear:6.2,Anger:3,Shame:6,Disgust:2.2,Apathy:8.6,Shock:5,Sad:9.7,Surprise:2,Anticipation:4.2},
  rep:{}},
 {nm:'Keiko',age:38,role:'restaurant chef, two kitchens',dom:6,a1:4,a2:0,
  says:'I can plate forty covers an hour and I cannot taste one of them. I check by watching the faces.',
  c:{Fear:6.8,Anger:8,Shame:6.2,Disgust:5,Apathy:7.6,Shock:6.5,Sad:6,Surprise:2.8,Anticipation:7.2},
  rep:{}},
 {nm:'Declan',age:44,role:'publican, last one out and first one up',dom:10,a1:3,a2:9,
  says:'I pour for the whole street and I know what everyone owes. Nobody here knows mine. I keep that tab shut.',
  c:{Fear:5.4,Anger:4.2,Shame:7.8,Disgust:3,Apathy:6.4,Shock:4,Sad:7,Surprise:3.2,Anticipation:5.6},
  rep:{Surprise:4.2}},
 {nm:'Zainab',age:23,role:'delivery rider, nights',dom:5,a1:7,a2:2,
  says:'I ride until the cold is a kind of speed. If I stop, the day catches up with me at the next red light.',
  c:{Fear:5,Anger:6.8,Shame:4.2,Disgust:3.5,Apathy:6,Shock:5.4,Sad:4.8,Surprise:4,Anticipation:6.5},
  rep:{Anticipation:3}},
 {nm:'Hamid',age:49,role:'site foreman',dom:2,a1:6,a2:0,
  says:'I have never lost an argument on site. I have lost two crews and a brother.',
  c:{Fear:3.8,Anger:8.4,Shame:6.6,Disgust:6,Apathy:4,Shock:5.6,Sad:3,Surprise:1.8,Anticipation:5.4},
  rep:{Shock:3}},
 {nm:'Beatrix',age:63,role:'retired harbourmaster',dom:1,a1:6,a2:1,
  says:'I ran the harbour by the book for thirty one years. The book was right. It did not follow me home well.',
  c:{Fear:3,Anger:5.8,Shame:5,Disgust:6.8,Apathy:3.4,Shock:2.4,Sad:2.8,Surprise:1,Anticipation:3.2},
  rep:{Sad:2.4}},
 {nm:'Jonah',age:31,role:'regional sales rep',dom:11,a1:9,a2:5,
  says:'I can close anyone in the room. Then I sit in the car outside my own house for twenty minutes.',
  c:{Fear:5.8,Anger:3.6,Shame:7,Disgust:2.6,Apathy:4.6,Shock:3.2,Sad:4.4,Surprise:3.6,Anticipation:7.6},
  rep:{Anticipation:5.2,Surprise:4.6}},
 {nm:'Anjali',age:27,role:'hospital pharmacist, nights',dom:0,a1:1,a2:3,
  says:'I check every dose twice and a third time in the lift. I am right every time. It does not help the third time.',
  c:{Fear:6,Anger:2.4,Shame:5.6,Disgust:2,Apathy:3.8,Shock:3,Sad:5,Surprise:2.2,Anticipation:6.6},
  rep:{Anticipation:3.4}},
 {nm:'Ola',age:55,role:'school bus driver',dom:18,a1:3,a2:10,
  says:'Forty one children on the road and I have never lost one. I count them in my sleep. Some nights I count wrong and wake up sure.',
  c:{Fear:5,Anger:3,Shame:3.8,Disgust:2,Apathy:4.2,Shock:3.4,Sad:5.6,Surprise:2,Anticipation:4},
  rep:{Sad:3.8,Fear:3.2}},
 {nm:'Teo',age:34,role:'freelance illustrator',dom:6,a1:4,a2:7,
  says:'On a good day the line goes down exactly where I meant it. On the other days I do not open the file. I cannot tell in advance which day it is.',
  c:{Fear:4.2,Anger:2,Shame:5.2,Disgust:2.4,Apathy:5,Shock:2,Sad:4.6,Surprise:3,Anticipation:5.4},
  rep:{Surprise:5.6,Anticipation:4.8}},
 {nm:'Fatima',age:40,role:'paramedic',dom:12,a1:3,a2:0,
  says:'I am steady at the scene. It is the kitchen afterwards that gets me. Some days I wash one cup and stand there.',
  c:{Fear:3,Anger:3.6,Shame:3,Disgust:3.4,Apathy:4,Shock:5.4,Sad:3.8,Surprise:2.4,Anticipation:3},
  rep:{Shock:5.6,Fear:4.6}},
 {nm:'Callum',age:50,role:'dairy farmer',dom:15,a1:10,a2:11,
  says:'The herd knows when I am off before my wife does. I get through the milking. It is the hours after that I do not know what to do with.',
  c:{Fear:3.4,Anger:3,Shame:3.6,Disgust:1.6,Apathy:3,Shock:2.8,Sad:3.2,Surprise:1.6,Anticipation:3.6},
  rep:{Apathy:4.4,Sad:3.6}},
 {nm:'Hyunwoo',age:36,role:'software engineer, platform team',dom:0,a1:1,a2:5,
  says:'I find the fault in a system in an afternoon. I have been looking for the fault in the rest of my life for a year and I cannot get it to repeat.',
  c:{Fear:3.8,Anger:2.4,Shame:3,Disgust:2.8,Apathy:3.4,Shock:2,Sad:2.6,Surprise:1.8,Anticipation:4.8},
  rep:{Anticipation:6,Apathy:5.2}},
 {nm:'Lucia',age:33,role:'architect, first practice of her own',dom:6,a1:4,a2:6,
  says:'I can draw a building and now I can carry the argument for it. I still apologise to the client for the price afterwards.',
  c:{Fear:2.8,Anger:2.2,Shame:3.4,Disgust:1.8,Apathy:1.6,Shock:1.6,Sad:2,Surprise:1.4,Anticipation:4.4},
  rep:{Anticipation:6.2,Fear:4}},
 {nm:'Kwame',age:58,role:'union organiser',dom:3,a1:2,a2:3,
  says:'I know how to hold a room of four hundred. I do not know how to hold my own temper at a quarter to midnight.',
  c:{Fear:2.2,Anger:5,Shame:2.4,Disgust:2.6,Apathy:1.4,Shock:2,Sad:2.8,Surprise:1,Anticipation:3.4},
  rep:{Anger:5.8,Sad:4.6}},
 {nm:'Ingrid',age:45,role:'hospice cook',dom:12,a1:3,a2:10,
  says:'I cook for people who eat three bites. I have learned to put the salt where they can find it. I carry the rest of the room home.',
  c:{Fear:1.8,Anger:1,Shame:2.4,Disgust:0.8,Apathy:1.4,Shock:1.6,Sad:4.4,Surprise:0.8,Anticipation:1.6},
  rep:{Sad:5.6,Fear:4.2}},
 {nm:'Rangi',age:41,role:'carpenter',dom:13,a1:10,a2:4,
  says:'I measure twice and I still hand the client a number I made smaller. I am practising saying the true figure out loud.',
  c:{Fear:1.4,Anger:2,Shame:1.8,Disgust:0.8,Apathy:1,Shock:1.2,Sad:1.8,Surprise:0.8,Anticipation:2},
  rep:{Anger:6.2,Fear:5.4,Sad:4.8}},
 {nm:'Yusuf',age:29,role:'river guide',dom:15,a1:7,a2:9,
  says:'Cold water settles me faster than anything I was ever taught to do. I am learning what to do on dry land.',
  c:{Fear:1.6,Anger:0.8,Shame:1,Disgust:0.6,Apathy:0.8,Shock:1.6,Sad:1,Surprise:1.2,Anticipation:2.2},
  rep:{Fear:6.4,Surprise:6,Anticipation:5.8}},
 {nm:'Helena',age:70,role:'retired surveyor',dom:1,a1:1,a2:6,
  says:'I spent forty years finding where the line really runs. I am slower to forgive a line somebody else drew crooked.',
  c:{Fear:0.8,Anger:1.2,Shame:1.6,Disgust:1,Apathy:0.6,Shock:0.6,Sad:1.4,Surprise:0.4,Anticipation:0.8},
  rep:{Sad:6,Anger:5.2,Fear:5}},
 {nm:'Seun',age:39,role:'community radio host',dom:16,a1:10,a2:3,
  says:'Two hundred people hear my voice at six in the morning. They hear it level now. It took eleven years to get the shake out of it.',
  c:{Fear:1,Anger:0.8,Shame:1.4,Disgust:0.4,Apathy:0.6,Shock:0.8,Sad:1.2,Surprise:0.6,Anticipation:1.4},
  rep:{Sad:6.6,Fear:6.2,Shame:5.8}},
 {nm:'Mateusz',age:63,role:'stonemason',dom:13,a1:4,a2:6,
  says:'A wall goes up one stone at a time and I have the hands for that. I am slower at the rest. I have started letting my son lay the corner.',
  c:{Fear:0.6,Anger:1.4,Shame:1,Disgust:0.4,Apathy:0.4,Shock:0.6,Sad:1.2,Surprise:0.2,Anticipation:0.6},
  rep:{Anger:6.8,Shame:6.2,Sad:6.4}},
 {nm:'Aroha',age:47,role:'volunteer fire chief',dom:18,a1:0,a2:3,
  says:'I run toward it and I know why. What is left is the call after the call, when the street is quiet and my hands are not.',
  c:{Fear:0.8,Anger:0.4,Shame:0.6,Disgust:0.2,Apathy:0.4,Shock:1.6,Sad:0.8,Surprise:0.4,Anticipation:0.6},
  rep:{Fear:6.9,Shock:6.7,Anger:6.2,Sad:6.6}},
 {nm:'Linh',age:52,role:'bakery owner',dom:13,a1:3,a2:10,
  says:'I get up at three and it still feels like mine. There is one old argument with my sister that I carry in the flour. I know which bag.',
  c:{Fear:0.4,Anger:0.2,Shame:0.8,Disgust:0.2,Apathy:0.2,Shock:0.2,Sad:0.6,Surprise:0.2,Anticipation:0.8},
  rep:{Fear:6.7,Anger:6.8,Shame:6.4,Sad:6.9,Apathy:6}},
 {nm:'Esperanza',age:78,role:'retired hotel cleaner',dom:12,a1:11,a2:3,
  says:'Forty years of rooms that belonged to other people. I never carried any of it out of the door. I am told that is a skill. I thought it was just Tuesday.',
  c:{Fear:0.2,Anger:0.4,Shame:0.4,Disgust:0.2,Apathy:0,Shock:0.2,Sad:0.8,Surprise:0,Anticipation:0.2},
  rep:{Sad:6.9,Anger:6.6,Fear:6.8,Shame:6.6,Disgust:6}},
 {nm:'Tariq',age:44,role:'ferry captain',dom:4,a1:7,a2:1,
  says:'The crossing is eleven minutes and I have made it eleven thousand times. In fog I stop thinking and stay with the boat. I would like that outside the wheelhouse too.',
  c:{Fear:0.6,Anger:0.2,Shame:0.2,Disgust:0,Apathy:0,Shock:0.4,Sad:0.2,Surprise:0.2,Anticipation:0.4},
  rep:{Fear:6.9,Shock:6.8,Anger:6.6,Anticipation:6.6}},
 {nm:'Dalia',age:52,role:'beekeeper',dom:15,a1:11,a2:1,
  says:'I open the hive and my hands are the temperature of the room. That did not come from the bees. It came from the nine years before them.',
  c:{Fear:0.2,Anger:0,Shame:0.4,Disgust:0,Apathy:0,Shock:0.2,Sad:0.6,Surprise:0,Anticipation:0.2},
  rep:{Fear:6.8,Anger:6.6,Sad:6.8,Apathy:6.7,Shock:6}},
 {nm:'Kofi',age:77,role:'retired choir master',dom:14,a1:1,a2:9,
  says:'The last argument I carried, I put down on a station platform in 1994. I am told that is rare. Mostly I notice there is room in the day.',
  c:{Fear:0.2,Anger:0,Shame:0.4,Disgust:0,Apathy:0,Shock:0,Sad:0.6,Surprise:0,Anticipation:0},
  rep:{Sad:6.2,Fear:5.8,Shame:6,Anger:5.6,Surprise:6.6}},
 {nm:'Mei',age:31,role:'alpine hut warden',dom:17,a1:11,a2:7,
  says:'Not much is left to say. I light the stove at five and read the sky, and that is the whole job. Some days I am sorry it is not harder to explain.',
  c:{Fear:0,Anger:0,Shame:0,Disgust:0,Apathy:0,Shock:0,Sad:0.4,Surprise:0,Anticipation:0.2},
  rep:{Fear:6,Anger:6,Shame:6,Surprise:6.4,Anticipation:5.8,Sad:6}}];


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
 /* Nkem 14.5, Severe: "capacity is spent before the day starts" is her, and a
    very good nurse is a Severe reading and not a Collapsed one. The three care
    laws still stand highest, and they are what the job is made of. */
 Nkem:   {_:.73, Compassion:5.6, Duty:6.4, 'Non-Harm':5.8, Temperance:.6, Detachment:.4, Patience:.7},
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

    He also said coherence around ninety two. On the model this was first
    solved against, CQ was the law mean times a load term, and those two
    statements could not both be true: every law at 9.9 reached 90.8, nineteen
    at a full ten reached 90.5, and the honest maximum of what he described was
    eighty nine. CQ is the 21 laws over 210 since the 25 September ruling, so
    ninety two needs a law mean of 9.2 and no ten at all, and the same table at
    9.9 had drifted to 97.2, five points above the number he gave. Re-solved on
    2 October to 92.0 by taking 0.52 off every law, which keeps the shape he
    described (the two in the eights are still patience and humility, which is
    a shape and not an accident) and brings the level back to what he said. */
 Lance:  {_:9.38, Truth:9.38, 'Aesthetic Beauty':9.38, Awareness:9.38,
          Accountability:9.38, Transparency:9.38, 'Non-Harm':9.38,
          Responsibility:9.38, Courage:9.38, Justice:9.38, Compassion:9.38, Duty:9.38,
          Presence:9.28, Nature:9.28, Generosity:9.28,
          Unity:9.18, Forgiveness:9.18, Equanimity:9.18, Temperance:9.08,
          Detachment:8.98, Humility:8.38, Patience:8.28},
 Rosa:   {_:9.6, Presence:10, Equanimity:10, Compassion:10, 'Non-Harm':10, Unity:9.8, Patience:9.9},
 /* Ana 37.2, Incoherent: "caught between the weight in your body and the odd
    moment of seeing clearly", with forty one addresses carrying. She read 41.1,
    the first number of Oscillating, which is a band about days that swing
    either way and not about a year of being in the middle of something. */
 Ana:    {_:3.828, Truth:6.4, Courage:6, Equanimity:1.9, Patience:2.1, Detachment:1.6, Temperance:2.7},
 Gordon: {_:1.9, Duty:3.0, Compassion:1.0, Forgiveness:1.0, Transparency:1.0, Truth:1.2, Unity:1.1},
 /* THE TIER LADDER. The first laws named in each entry are the shape of the
    person. The base, `_`, is every law not named, and the few at the end of an
    entry are laws moved a tenth off the base so that the sum over 210 lands on
    the target to the second decimal: a shared base alone moves the sum in steps
    of about 0.8 once the intake rounds it to a tenth, which is the wrong size
    of step for a roster that has to cover a scale one point at a time. Each was
    confirmed in the browser, and the figure on screen is the table's own to
    within a hundredth. Bottom of the band to the top, three a band, Collapsed
    first. */
 Pavel:   {_:0, Duty:0.9, Patience:0.7,
           Truth:0.1, Justice:0.1, Awareness:0.1, Presence:0.1, Equanimity:0.1, Forgiveness:0.1, 'Aesthetic Beauty':0.1, Responsibility:0.1, Temperance:0.1},
 Marisol: {_:0, Compassion:3.1, Duty:3.6, Responsibility:3.4, Truth:0.6, Courage:0.8,
           Transparency:0.1, Unity:0.1, Nature:0.1, Humility:0.1, Forgiveness:0.1, 'Aesthetic Beauty':0.1, Temperance:0.1},
 Bilal:   {_:0.5, Compassion:4.4, Generosity:3.9, Patience:3,
           Truth:0.4, Unity:0.4, Presence:0.4, Forgiveness:0.4, Duty:0.4, Temperance:0.4},
 Keiko:   {_:0.8, 'Aesthetic Beauty':4.8, Duty:3.4, Courage:2.9, Temperance:0.4, Patience:0.5, Equanimity:0.6,
           Generosity:0.7, Justice:0.7},
 Declan:  {_:1.2, Generosity:5.9, Compassion:5.2, Humility:3.8, Transparency:0.5, Accountability:0.7, Truth:1,
           Justice:1.1, Awareness:1.1, Presence:1.1, Forgiveness:1.1, Courage:1.1, Responsibility:1.1, Detachment:1.1},
 Zainab:  {_:1.4, Courage:6.4, Nature:5, Detachment:4.9, Temperance:1.2, Forgiveness:1.8, Patience:2,
           Truth:1.5},
 Hamid:   {_:1.4, Duty:7.2, Responsibility:6.4, Courage:6, Humility:0.9, Forgiveness:1.1, Compassion:1.8, Transparency:1.4,
           Awareness:1.5, Presence:1.5, Generosity:1.5, Accountability:1.5, Detachment:1.5},
 Beatrix: {_:1.8, Justice:8, Truth:7.2, Accountability:6.6, Equanimity:1.9, Forgiveness:1.2, Unity:1.6, Humility:1.7,
           Awareness:1.9, Compassion:1.9, Courage:1.9, Temperance:1.9},
 Jonah:   {_:2.7, 'Aesthetic Beauty':6, Courage:6.2, Detachment:5.8, Truth:1.6, Transparency:1.2, Accountability:2.2, Humility:2,
           Awareness:2.8, Duty:2.8},
 Anjali:  {_:2.6, Truth:6.8, Duty:7, Responsibility:7.2, Presence:1.9, Equanimity:2.1, Temperance:2.5,
           Transparency:2.5, Humility:2.5, Courage:2.5},
 Ola:     {_:2.9, Responsibility:7.8, 'Non-Harm':8, Patience:6.6, Courage:2.4, Transparency:2.2, Equanimity:2.9,
           Truth:2.8, Unity:2.8, Nature:2.8, Humility:2.8, Forgiveness:2.8, 'Aesthetic Beauty':2.8, Accountability:2.8},
 Teo:     {_:3.7, 'Aesthetic Beauty':8.6, Awareness:6.4, Nature:6, Duty:2.6, Accountability:2.4, Temperance:2.8,
           Transparency:3.6, Equanimity:3.6, Responsibility:3.6},
 Fatima:  {_:3.9, Courage:7.6, Compassion:6.8, Presence:6.4, Temperance:2.4, Detachment:2.9, Forgiveness:3.1,
           Transparency:3.8, Humility:3.8, Responsibility:3.8},
 Callum:  {_:4.3, Nature:8.6, Patience:7.4, Duty:7.8, Transparency:2.6, Humility:3, Forgiveness:3.4,
           Truth:4.2, Unity:4.2, Presence:4.2, Compassion:4.2, 'Aesthetic Beauty':4.2, Responsibility:4.2, Temperance:4.2},
 Hyunwoo: {_:5, Truth:7.4, Awareness:7, Courage:3, Unity:3.4, Generosity:3.8,
           Transparency:5.1, Humility:5.1, 'Aesthetic Beauty':5.1, Temperance:5.1},
 Lucia:   {_:5.1, 'Aesthetic Beauty':8.2, Courage:6.8, Responsibility:6.6, Temperance:3.4, Detachment:3.6, Patience:3.8,
           Truth:5, Justice:5, Awareness:5, Presence:5, Equanimity:5, Forgiveness:5, Duty:5},
 Kwame:   {_:5.4, Justice:8.6, Unity:7.8, Courage:7.6, Forgiveness:3.6, Detachment:3, Temperance:3.8,
           Truth:5.5, Nature:5.5, Equanimity:5.5, 'Aesthetic Beauty':5.5, Accountability:5.5},
 Ingrid:  {_:5.7, Compassion:8.4, Presence:7.8, Generosity:7.2, Detachment:3.8, Forgiveness:4.4, Truth:4.6,
           Transparency:5.8},
 Rangi:   {_:6.1, Duty:8.2, 'Aesthetic Beauty':7.8, Patience:7.4, Humility:4.6, Accountability:4.8, Transparency:4.4},
 Yusuf:   {_:6.6, Nature:9, Courage:8.6, Presence:8.2, Accountability:5, Duty:5.4, Temperance:4.8,
           Truth:6.7, Justice:6.7, Awareness:6.7, Equanimity:6.7, Forgiveness:6.7, 'Aesthetic Beauty':6.7, Detachment:6.7},
 Helena:  {_:7, Truth:9, Justice:8.8, Accountability:8.2, Forgiveness:4.8, Generosity:5.2,
           Transparency:6.9, Awareness:6.9, Presence:6.9, Equanimity:6.9, 'Aesthetic Beauty':6.9, Duty:6.9},
 Seun:    {_:7.1, Compassion:8.6, Transparency:8.2, Awareness:8, Temperance:5.4, Detachment:5.6,
           Truth:7.2, Unity:7.2, Presence:7.2, Equanimity:7.2, Generosity:7.2, Courage:7.2, Responsibility:7.2, 'Non-Harm':7.2},
 Mateusz: {_:7.6, Patience:9.2, 'Aesthetic Beauty':9, Duty:8.8, Equanimity:6.4, Unity:6, Generosity:6.6,
           Truth:7.5, Awareness:7.5, Humility:7.5, Courage:7.5},
 Aroha:   {_:8.1, Courage:9.4, Responsibility:9.2, Compassion:8.8, Temperance:6, Detachment:6.2, Humility:6.8,
           Truth:8.2, Unity:8.2, Presence:8.2, Generosity:8.2, Accountability:8.2},
 Linh:    {_:8.2, Generosity:9.4, Duty:9.2, 'Aesthetic Beauty':9, Detachment:6.8, Temperance:7, Forgiveness:7.2,
           Truth:8.1, Unity:8.1, Presence:8.1, Compassion:8.1},
 Esperanza:{_:8.5, Compassion:9.4, Presence:9.3, Humility:9.5, Forgiveness:8.2, Detachment:7.8, Temperance:8,
           Truth:8.4},
 Tariq:   {_:8.8, Presence:9.6, Responsibility:9.5, Awareness:9.3, Humility:7.4, Forgiveness:7.6, Detachment:8,
           Justice:8.9, Nature:8.9, Compassion:8.9, 'Aesthetic Beauty':8.9, Duty:8.9, Temperance:8.9},
 Dalia:   {_:9.5, Nature:9.9, Presence:9.7, Patience:9.8, Detachment:8.2, Courage:8.4,
           Truth:9.4, Justice:9.4, Awareness:9.4, Equanimity:9.4, Forgiveness:9.4, 'Aesthetic Beauty':9.4},
 Kofi:    {_:9.8, Unity:10, Awareness:9.9, Forgiveness:9.9, Humility:8.8, Temperance:9,
           Courage:9.9, Responsibility:9.9, Detachment:9.9, Patience:9.9, Transparency:9.9, Nature:9.9},
 Mei:     {_:10, Presence:10, Nature:10, Awareness:10, Unity:10, Humility:9.8, Patience:9.8,
           Truth:9.9, Equanimity:9.9, Generosity:9.9, Duty:9.9}};

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
 Abraham:{d:'1951-06-29', t:'11:20', p:'Boulder, CO'},
 /* The ladder. A place the table above does not name is read through its time
    zone, z, which settles the clock offset for that year and lends the zone's
    own point as a horizon, so Rising still resolves. Lance has no record here
    and is left without one: it is his to enter, and a made up birth would be
    read back to him as his own. */
 Pavel:   {d:'1974-02-09', t:'05:40', p:'Gdansk, PL', z:'Europe/Warsaw'},
 Marisol: {d:'1997-08-21', t:'14:25', p:'San Antonio, TX', z:'America/Chicago'},
 Bilal:   {d:'1959-11-03', t:'22:10', p:'Birmingham, UK', z:'Europe/London'},
 Keiko:   {d:'1988-04-02', t:'09:15', p:'Osaka, JP', z:'Asia/Tokyo'},
 Declan:  {d:'1982-01-27', t:'02:50', p:'Cork, IE', z:'Europe/Dublin'},
 Zainab:  {d:'2003-06-30', t:'18:35', p:'Lagos, NG', z:'Africa/Lagos'},
 Hamid:   {d:'1977-09-12', t:'07:05', p:'Tehran, IR', z:'Asia/Tehran'},
 Beatrix: {d:'1963-05-16', t:'12:30', p:'Rotterdam, NL', z:'Europe/Amsterdam'},
 Jonah:   {d:'1995-03-08', t:'21:00', p:'Perth, AU', z:'Australia/Perth'},
 Anjali:  {d:'1999-12-14', t:'04:45', p:'Pune, IN', z:'Asia/Kolkata'},
 Ola:     {d:'1971-10-25', t:'16:20', p:'Gothenburg, SE', z:'Europe/Stockholm'},
 Teo:     {d:'1992-07-04', t:'10:55', p:'Buenos Aires, AR', z:'America/Argentina/Buenos_Aires'},
 Fatima:  {d:'1986-02-18', t:'13:40', p:'Casablanca, MA', z:'Africa/Casablanca'},
 Callum:  {d:'1976-04-09', t:'06:15', p:'Dunedin, NZ', z:'Pacific/Auckland'},
 Hyunwoo: {d:'1990-11-26', t:'23:05', p:'Busan, KR', z:'Asia/Seoul'},
 Lucia:   {d:'1993-05-29', t:'08:20', p:'Bogota, CO', z:'America/Bogota'},
 Kwame:   {d:'1968-03-06', t:'19:30', p:'Accra, GH', z:'Africa/Accra'},
 Ingrid:  {d:'1981-08-13', t:'03:25', p:'Bergen, NO', z:'Europe/Oslo'},
 Rangi:   {d:'1985-10-01', t:'11:10', p:'Rotorua, NZ', z:'Pacific/Auckland'},
 Yusuf:   {d:'1997-01-16', t:'15:45', p:'Istanbul, TR', z:'Europe/Istanbul'},
 Helena:  {d:'1956-06-04', t:'09:50', p:'Vienna, AT', z:'Europe/Vienna'},
 Seun:    {d:'1987-07-19', t:'20:35', p:'Ibadan, NG', z:'Africa/Lagos'},
 Mateusz: {d:'1963-02-07', t:'05:55', p:'Milwaukee, WI', z:'America/Chicago'},
 Aroha:   {d:'1979-12-02', t:'17:15', p:'Gisborne, NZ', z:'Pacific/Auckland'},
 Linh:    {d:'1974-09-24', t:'01:30', p:'Da Nang, VN', z:'Asia/Ho_Chi_Minh'},
 Esperanza:{d:'1948-10-12', t:'12:05', p:'Guadalajara, MX', z:'America/Mexico_City'},
 Tariq:   {d:'1982-06-21', t:'06:40', p:'Karachi, PK', z:'Asia/Karachi'},
 Dalia:   {d:'1974-03-30', t:'10:25', p:'Haifa, IL', z:'Asia/Jerusalem'},
 Kofi:    {d:'1949-01-05', t:'14:50', p:'Kumasi, GH', z:'Africa/Accra'},
 Mei:     {d:'1995-05-10', t:'04:15', p:'Chengdu, CN', z:'Asia/Shanghai'}};
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
 Abraham:'Abraham Isaac Stern',
 Pavel:   'Pavel Tadeusz Wrobel',
 Marisol: 'Marisol Elena Trevino',
 Bilal:   'Bilal Hassan Qureshi',
 Keiko:   'Keiko Yuriko Matsuda',
 Declan:  'Declan Padraig Moloney',
 Zainab:  'Zainab Folake Adeyemi',
 Hamid:   'Hamid Reza Karimi',
 Beatrix: 'Beatrix Johanna Brouwer',
 Jonah:   'Jonah Samuel Thackeray',
 Anjali:  'Anjali Meenakshi Deshpande',
 Ola:     'Ola Margareta Lindqvist',
 Teo:     'Teo Matias Ferrante',
 Fatima:  'Fatima Zahra Bennani',
 Callum:  'Callum Angus Fraser',
 Hyunwoo: 'Hyunwoo Daniel Seo',
 Lucia:   'Lucia Camila Restrepo',
 Kwame:   'Kwame Yaw Asante',
 Ingrid:  'Ingrid Solveig Haugen',
 Rangi:   'Rangi Tane Parata',
 Yusuf:   'Yusuf Emre Demir',
 Helena:  'Helena Margarethe Gruber',
 Seun:    'Oluwaseun Ayodele Bakare',
 Mateusz: 'Mateusz Jan Kowal',
 Aroha:   'Aroha Mere Tamihana',
 Linh:    'Linh Thuy Nguyen',
 Esperanza:'Esperanza Guadalupe Robles',
 Tariq:   'Tariq Mahmood Siddiqui',
 Dalia:   'Dalia Ruth Mizrahi',
 Kofi:    'Kofi Nana Boateng',
 Mei:     'Mei Lin Zhou'};
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
