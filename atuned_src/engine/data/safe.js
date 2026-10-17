/* ============================================================
   THE WORDS THAT STOP A RELEASE, 17 October. A closed list, and the one
   table that turns the behaviour off.

   WHY IT EXISTS. QA measured main on 16 October: "I keep thinking about
   killing myself" read Disgust 7.2 at the eye and the Story page offered a
   release toward Acceptance; "I have been hurting myself again" read Sad 6 at
   the heart and offered one toward Restoration; said twice, Source AI asked
   "Both land at the heart. Why there?". A release offered on words about
   ending a life treats them as old charge to let go of, and that is the worst
   thing this page could do. "I never feel safe at home" read Fear at the root
   and was offered one too, and danger now is not old charge either.

   WHAT IT IS, AND WHAT IT IS NOT. A phrase list, read on the device, that
   makes the reader read nothing in that entry (engine/safe.js says where).
   It is not the automatic crisis check the owner deferred on 9 October and it
   is not a detector of the person: it says nothing about who wrote the words,
   it scores nothing, and nothing about a match is stored anywhere. The entry
   is still saved as written. The Story page puts the crisis door beside it.

   TURNING IT OFF. One line: set on to false on a family's row below. Both
   rows off and srcSafe never trips, every entry reads exactly as it did on
   main, and the Story page never draws the line. The owner may revert it.

   HOW A ROW IS WRITTEN. Each phrase is in normMap's own form (engine/sniff.js):
   lower case, the apostrophe dropped, every other mark a single space. So
   "self-harm" is self harm, "can't" is cant, "I'm" is im. A phrase may carry
   its own no ("dont want to live", "never feel safe at home"), the way the
   lexicon's "cant sleep" does, and then the no is the phrase's and the
   negation read starts in front of it.

   THE FRAMES ARE ROWS AND NOT A RULE. "I was not going to kill myself" puts
   the no three words in front of kill, and the sniffer's negation window is
   two (SRC_NEG_W). Widening that window would change every reading the
   sniffer makes, so the frame is written as its own phrase, "going to kill
   myself", the longer phrase decides for the shorter one inside it, and the
   no lands in the window it always had.

   held is the refusals, the same kind of table as LEXSYN_NO: a phrase
   followed straight away by one of these words, in its own clause, is an
   idiom and does not trip. Kept short on purpose. A missed statement costs
   far more than a quiet line shown on a joke, so a tail is held only where
   the words after the phrase say outright that no death or injury is meant:
     laughing, of laughter, of embarrassment, a little   the idiom names what
                        is "killing" the writer, and it is not their life
     old, happy         a death in old age, wished for, is not a wish to die now
     at work, at the gym, working, lifting, to get, to finish, to meet,
       to keep up       "killing myself at work", "killing myself to meet the
                        deadline": the overwork idiom
   Each held tail has a test both ways in tests/engine.js: with the tail it
   does not trip, and the same phrase without it does. Idioms that never
   reach this table because no row matches them are tested too: "I could
   kill for a coffee", "this deadline is killing me", "my cutting board",
   "I cut myself a slice of bread".

   LEFT OUT ON PURPOSE, with the reason, so nobody adds them by accident:
     cut myself, hurt myself   "I cut myself shaving", "I hurt myself lifting
                               boxes". Only the forms that carry the intent
                               are rows: cutting myself, hurt myself on purpose
     going to kill me, will kill me
                               "my mum is going to kill me when she sees the
                               car" is the commonest use. Only threatened to
                               kill me, which is never a joke, is a row
     killed himself, took his own life
                               a death, read as grief at the heart by the
                               lexicon (LEXSYN died), and another person's
   ============================================================ */
var SAFE_WORDS=[
 /* ending one's own life, or hurting oneself */
 {k:'self', on:true,
  say:['suicide','suicidal','kill myself','killing myself','killed myself',
   'going to kill myself','gonna kill myself','want to kill myself','wanted to kill myself',
   'wanna kill myself','try to kill myself','tried to kill myself','trying to kill myself',
   'thinking about killing myself','thought about killing myself','thinking of killing myself',
   'thought of killing myself',
   'end my life','ending my life','end it all','take my own life','taking my own life',
   'took my own life','take my life',
   'want to die','wanna die','wanted to die','wanting to die','wish i was dead','wish i were dead',
   'wish i could die','better off dead','better off without me','better off if i was gone',
   'better off if i were gone','dont want to live','do not want to live','dont want to be alive',
   'do not want to be alive','dont want to be here anymore','do not want to be here anymore',
   'dont want to wake up','do not want to wake up','no reason to live','nothing to live for',
   'hurting myself','hurt myself on purpose','want to hurt myself','wanted to hurt myself',
   'going to hurt myself','harm myself','harming myself','harmed myself',
   'self harm','self harming','self harmed',
   'cutting myself','cut myself on purpose','cut my wrists','cutting my wrists','slit my wrists',
   'burning myself','burned myself on purpose'],
  held:{
   'want to die':['laughing','of laughter','of embarrassment','a little','old','happy'],
   'wanna die':['laughing','of laughter','of embarrassment','a little','old','happy'],
   'wanted to die':['laughing','of laughter','of embarrassment','a little'],
   'kill myself':['laughing','at work','at the gym','working'],
   'killing myself':['laughing','at work','at the gym','working','to get','to finish','to meet','to keep up'],
   'killed myself':['laughing','at work','at the gym','working'],
   'hurting myself':['at the gym','lifting','at work']}},
 /* danger now: not safe where they live, or their life threatened */
 {k:'now', on:true,
  say:['never feel safe at home','dont feel safe at home','do not feel safe at home',
   'not safe at home','never safe at home','unsafe at home','dont feel safe in my home',
   'do not feel safe in my home','not safe in my own home',
   'afraid to go home','scared to go home','afraid for my life','scared for my life',
   'fear for my life','feared for my life',
   'threatened to kill me','threatens to kill me','threatening to kill me',
   'afraid he will hurt me','scared he will hurt me','afraid she will hurt me',
   'scared she will hurt me','afraid they will hurt me','scared they will hurt me'],
  held:{}}];
/* SOMEONE ELSE'S WORDS, quoted. A phrase inside double quotation marks, in a
   sentence where a word below comes before the opening mark, is a line
   somebody else said or a work's own line, and does not trip:
     She said "I want to die" when her phone broke.
     The last line of the novel is "I want to die free."
   A speech word counts only when its subject is someone else, by whoOf
   (engine/sniff.js), the sniffer's own reader of whose a word is: "I said
   "I want to die"" is the writer and trips. Without quotation marks nothing
   here holds: "she said I should kill myself" is about the writer. Single
   quotation marks are not read, because normMap drops the apostrophe and the
   two cannot be told apart. */
var SAFE_SAY_V=['said','says','say','saying','told','tells','wrote','writes','texted','texts',
 'messaged','posted','yelled','yells','screamed','screams','shouted','shouts','whispered',
 'asked','asks','sang','sings','sobbed','cried','repeated','goes','went'];
/* a work, and the topic words a sentence says one is about without quoting
   it: "I watched a documentary about suicide", a topic word within three
   words after about, on or regarding. Outside quotation marks that is all a
   work holds: "the film made me want to die" trips, and so does "I read the
   news and now I'm suicidal", which names a work and is not about one. */
var SAFE_WORK=['book','books','novel','novels','film','films','movie','movies','documentary',
 'documentaries','show','shows','series','song','songs','lyric','lyrics','poem','poems','play',
 'article','articles','podcast','podcasts','episode','episodes','character','characters','news',
 'video','videos','scene','chapter','lecture','class','course','study','report'];
var SAFE_TOPIC=['suicide','suicidal','self harm','self harming'];
var SAFE_ABOUT=['about','on','regarding'];
