/* ============================================================
   THE PROMPT SET. Ruled at TASKS.md CN4, in his words: "That makes the prompt
   questions for the journal very specific. Almost like when have you been type
   questions. When was the last time?"

   THE TWO CLAUSE RULE, AND IT IS MEASURED RATHER THAN ASSERTED.

   Every prompt here has two clauses: the event, and what it cost. The first
   cut of this set had the event clause only, and three of thirty two prompts
   produced an answer the sniffer read nothing out of. Adding the cost clause
   to all of them took it to thirty eight of thirty eight.

   The reason is in the lexicon rather than in the writing. The event clause
   gets a scene and a scene is mostly nouns and dates. The charge is in the
   aftermath, which is where a person reaches for the words the scanner
   actually holds: tight, exhausted, sick, dreading, could not stop. A prompt
   with no cost clause asks for the half of the sentence the instrument cannot
   read.

   Measured by tools/measure.js in this directory, against the running engine.

   FOUR KEYRINGS, AND THREE OF THEM ARE HIS OWN ROUTE IN. CN5: "I had to use
   Dante's Inferno, and then the seven deadly sins, and then my age. Different
   trajectories and angles at which to see myself." The product carries all
   three today as reference surfaces. Here they are keys.

   The descent and the year keyrings are generated off the engine's own tables,
   CIRCLES and AGES, so a prompt cannot fall out of step with the canon it came
   from. The sins are a separate keyring because a circle asks what condition
   you are in and a sin asks what you did, which are two different questions
   off one word.

   `s` is what the prompt is trying to surface. It is not shown to a person.
   ============================================================ */
var PROMPTS=[
/* ---- PLAIN. No angle. For somebody who came to write, not to be asked. ---- */
['P1','plain','When was the last time you said yes when you meant no, and what did it cost you?','over-giving at the throat, and the cost clause is where the body answers'],
['P2','plain','When was the last time you stayed quiet, and what did you pay for it afterwards?','the silenced idiom, which the engine names and no surface has printed'],
['P3','plain','When was the last time you went off at somebody, and what happened in you after?','anger at the solar plexus, and the shame that follows it at the sacral'],
['P4','plain','When was the last time you could not stop going over something, and how long did it hold you?','the third eye loop, and the duration is the cost'],
['P5','plain','When was the last time you had nothing left at the end of a day, and what did you skip?','exhaustion, which the owner ruled sits at the solar plexus and is not anger'],
['P6','plain','When was the last time somebody talked over you, and what did you do with it?','the throat twice, once for what was done and once for what was swallowed'],
['P7','plain','When was the last time you waited outside before you could go in, and what were you bracing for?','the root. bracing and dread are its words and the event is his own'],
['P8','plain','When was the last time your hand was on the phone before you decided, and what were you avoiding?','compulsion at the sacral, and the avoided thing is usually a person'],
['P9','plain','When was the last time somebody let you down, and where did you feel it?','betrayal at the throat. the where clause asks for a place and gets one'],
['P10','plain','When was the last time you lost somebody, and what has not moved since?','grief at the heart, and what has not moved is the held part'],
['P11','plain','When was the last time you felt nothing where something was expected, and what was the occasion?','the crown. frozen and detached, which nothing else in the set reaches'],
['P12','plain','When was the last time you slept well, and what was different about that day?','the coherent words. one prompt in the set takes charge off rather than on'],
['P13','plain','When was the last time you were the last one still working, and who did you not tell?','exhaustion plus concealment. Derek and James both answer this one'],
['P14','plain','When was the last time you rehearsed a sentence before saying it, and did you say it?','self-silencing, and the did you clause decides which way it reads'],
['P15','plain','When was the last time somebody asked how you were, and what came out of your mouth?','the automatic answer. lifted from funnel/questions.js, which already ships it'],

/* ---- DESCENT. Nine circles, off CIRCLES. Each `see` is already a first
       person sentence, so the prompt asks a person to answer the sentence the
       Compass currently only shows them. ---- */
['C1','descent','When was the last time you decided none of this was real, and came anyway. What made you come?','Limbo. disbelief, and the coming anyway is the evidence against it'],
['C2','descent','When was the last time you arranged a room so somebody would want you, and what did it take out of you?','Lust. the arranging is the work and the cost is where it lands'],
['C3','descent','When was the last time you ate or bought something to close a gap, and was the gap still there?','Gluttony. consumption as substitution, in the engine own words'],
['C4','descent','When was the last time you counted what you had kept, and what were you afraid of?','Greed. the fear clause is what takes it to the root'],
['C5','descent','When was the last time you either went off or went flat, and which was it?','Wrath and sloth. one charge, two exits, and the which clause names the exit'],
['C6','descent','When was the last time you stopped listening because you had already decided, and who was in the room?','Heresy, which is pride. rigidity at the solar plexus'],
['C7','descent','When was the last time you wanted to break something, and did you?','Violence. the did you clause is the difference between a thought and an event'],
['C8','descent','When was the last time you were warm at somebody you do not like, and what did it cost you after?','Fraud. the performance is free at the time and billed afterwards'],
['C9','descent','When was the last time you went against somebody who trusted you, and where has it sat since?','Treachery. the since clause is the held part, which is what a release runs on'],

/* ---- SIN. Seven, asked as acts. Five of the seven are also circle names and
       that is not a duplication: the circle asks what you are in, the sin asks
       what you did. ---- */
['S1','sin','When was the last time you held a position after you knew it was wrong, and who paid for it?','pride. held my position is a phrase the engine names as rigidity'],
['S2','sin','When was the last time somebody elses news landed badly, and what did you do with that?','envy. the did you do clause moves it from a feeling to an event'],
['S3','sin','When was the last time you raised your voice, and at whom?','wrath. at whom is the cost, because the answer is usually somebody smaller'],
['S4','sin','When was the last time you left something undone until it cost you, and what was the cost?','sloth. resignation at the crown, and a real bill at the end'],
['S5','sin','When was the last time you kept something you did not need, and what does keeping it cost?','greed. the second clause is what makes this readable at all'],
['S6','sin','When was the last time you had more than you wanted, and when did you notice?','gluttony. when did you notice is the compulsion question in plain words'],
['S7','sin','When was the last time you wanted somebody who was not available, and what did you do about it?','lust. craving at the sacral, and the doing is what it costs'],

/* ---- YEAR. His third angle. AGES 3 to 18 are the owner's own questions and
       are kept verbatim from the engine, with the cost clause appended where
       they did not already carry one. The adult half is generated in five year
       steps from eighteen to the person's own age, off two forms. ---- */
['A3','year','What did you carry everywhere at three and would not be parted from, and what happened when it was taken?','the first attachment, and the taking is the event'],
['A7','year','Who did you pretend to be at seven, who did you refuse to be, and would you still argue it?','the first character. the still argue clause is AGE_TEST, moved into the prompt'],
['A12','year','What did you argue about with a friend at twelve, which corner did you take, and do you care?','the first argument, and it is the owner worked example'],
['A16','year','What did you get good at by sixteen, and what did that let you look down on?','the first work. contempt is what an identification costs somebody else'],
['A22','year','At twenty two, what did you stop doing, and who decided that?','the adult form. stopping is an event and the deciding names a person'],
['A32','year','At thirty two, when were you the one who left, and what did you not say?','the adult form. leaving, and the unsaid part is the throat'],
['A42','year','At forty two, what have you been carrying that you did not choose, and where does it sit?','the adult form. the where clause asks for a place and gets one']];

if(typeof module!=='undefined'&&module.exports)module.exports={PROMPTS:PROMPTS};
