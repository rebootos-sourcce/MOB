/* ============================================================
   THE HUNDRED. Scored on the 21 Laws of Spiritual Integrity,
   which are read out of the engine and not retyped here.
   The names below must match SI in engine/data/canon.js exactly.
   A name that does not match is refused at load, out loud, because
   a silently dropped question is a law scored on fewer points than
   the page claims.

   WHY THESE ARE WRITTEN AS PAIN AND NOT AS TRAITS. A personality
   item asks what kind of person you are and gets back the person
   somebody wants to be. Every item here is a thing that happened,
   in a body, in a room, on a day. A person either recognises it or
   does not. That is the only reading self report can honestly give.

   Each item carries:
     k   which way Always points. '-' is every item in this hundred:
         Always is the law open and the axis loaded. '+' is the other
         way, Always is the law held, which is how the owner's 42
         question draft is written (QQ_42, below). Required on every
         item and refused at load when it is missing, because an item
         scored the wrong way round reads as the opposite of what the
         person answered and nothing else on the page would show it.
     l   the law it scores
     c   the charge axis the violation loads, one of the nine
     q   the question, second person, answerable as a frequency

   One scale across all hundred, because five labels learned once is
   four fewer things to hold than a hundred scales learned each time.
   Never, Rarely, Sometimes, Often, Always.
   A law score is the mean of its items inverted: never is ten,
   always is nought. A charge is the mean of the items that load it.
   ============================================================ */
var QSCALE=['Never','Rarely','Sometimes','Often','Always'];
var QQ_HUNDRED=[

/* ---------- Truth. Throat. ---------- */
{k:'-',l:'Truth',c:'Shame',q:'You say yes while your chest tightens, because no is going to cost more than you have.'},
{k:'-',l:'Truth',c:'Apathy',q:'You soften a true thing until the person hearing it can no longer hear it.'},
{k:'-',l:'Truth',c:'Sad',q:'There is a sentence you have not said at home. You have known it for months.'},
{k:'-',l:'Truth',c:'Apathy',q:'Somebody asks how you are and the answer is out of your mouth before you have checked.'},
{k:'-',l:'Truth',c:'Shock',q:'You catch yourself telling a version of your life you have stopped believing.'},

/* ---------- Transparency. Throat. ---------- */
{k:'-',l:'Transparency',c:'Fear',q:'You keep one part of your life in a separate room, and keeping it there costs you sleep.'},
{k:'-',l:'Transparency',c:'Shame',q:'You would not want the people who love you to see the inside of an ordinary day.'},
{k:'-',l:'Transparency',c:'Apathy',q:'You hold a room well and then sit in the car a while before you drive.'},
{k:'-',l:'Transparency',c:'Fear',q:'You edit the story before you tell your nearest person, out of habit and not out of kindness.'},
{k:'-',l:'Transparency',c:'Surprise',q:'Somebody gets close and your body changes the subject before your mouth does.'},

/* ---------- Justice. Throat. ---------- */
{k:'-',l:'Justice',c:'Anger',q:'You carry a debt somebody owes you and it is louder at night than in the day.'},
{k:'-',l:'Justice',c:'Anger',q:'You take less than your share and then resent the person who let you.'},
{k:'-',l:'Justice',c:'Anger',q:'You keep score in a close relationship and the other person does not know there is a score.'},
{k:'-',l:'Justice',c:'Fear',q:'Something unfair lands on somebody smaller than you and you say nothing.'},

/* ---------- Unity. Crown. ---------- */
{k:'-',l:'Unity',c:'Sad',q:'You are in a full room and the distance between you and everybody in it does not close.'},
{k:'-',l:'Unity',c:'Disgust',q:'You have decided some people are a different kind of creature to you.'},
{k:'-',l:'Unity',c:'Surprise',q:'You meet somebody new already braced for how it ends.'},
{k:'-',l:'Unity',c:'Anger',q:'Somebody else wins and it lands in your body as a loss.'},

/* ---------- Awareness. Crown. ---------- */
{k:'-',l:'Awareness',c:'Shock',q:'You arrive somewhere and cannot account for the twenty minutes before it.'},
{k:'-',l:'Awareness',c:'Shock',q:'You learn you were angry from how you spoke to somebody, not from feeling it.'},
{k:'-',l:'Awareness',c:'Shock',q:'The same argument starts again and you cannot find the moment you entered it.'},
{k:'-',l:'Awareness',c:'Anticipation',q:'Your hand is on the phone before you notice deciding to reach for it.'},
{k:'-',l:'Awareness',c:'Fear',q:'Your body tells you first and you overrule it.'},

/* ---------- Nature. Crown. ---------- */
{k:'-',l:'Nature',c:'Anger',q:'You are fighting something that is not going to change, and you have been fighting it for years.'},
{k:'-',l:'Nature',c:'Disgust',q:'Your body asks for rest and you read the request as weakness.'},
{k:'-',l:'Nature',c:'Anticipation',q:'You cannot let a slow month be slow. Slow reads as falling behind.'},
{k:'-',l:'Nature',c:'Surprise',q:'Something ends and you had no idea it was ending.'},

/* ---------- Presence. 3rd Eye. ---------- */
{k:'-',l:'Presence',c:'Sad',q:'You are with somebody you love and you are somewhere else the whole time.'},
{k:'-',l:'Presence',c:'Anticipation',q:'You cannot sit in a room with nothing playing in it.'},
{k:'-',l:'Presence',c:'Apathy',q:'You finish a meal without tasting it.'},
{k:'-',l:'Presence',c:'Apathy',q:'Somebody is still talking and you are already drafting the reply.'},
{k:'-',l:'Presence',c:'Anticipation',q:'You wake and the day has started in your head before your feet are on the floor.'},

/* ---------- Humility. 3rd Eye. ---------- */
{k:'-',l:'Humility',c:'Anger',q:'You would rather be right than let the argument end.'},
{k:'-',l:'Humility',c:'Anger',q:'Somebody tells you something true about you and you go looking for what is wrong with them.'},
{k:'-',l:'Humility',c:'Shame',q:'You cannot ask for help without paying for it somehow first.'},
{k:'-',l:'Humility',c:'Disgust',q:'You refuse advice you need because of who is giving it.'},
{k:'-',l:'Humility',c:'Shame',q:'You explain instead of listening, and you can hear yourself doing it.'},

/* ---------- Equanimity. 3rd Eye. ---------- */
{k:'-',l:'Equanimity',c:'Surprise',q:'A small thing goes wrong and the whole day goes with it.'},
{k:'-',l:'Equanimity',c:'Anger',q:'Your voice is up before you have decided to raise it.'},
{k:'-',l:'Equanimity',c:'Shock',q:'You are level all day and then something breaks over nothing at home.'},
{k:'-',l:'Equanimity',c:'Anticipation',q:'Your jaw is tight when you notice it, and you notice it most days.'},
{k:'-',l:'Equanimity',c:'Shock',q:'You need the last word before you can put the thing down.'},

/* ---------- Compassion. Heart. ---------- */
{k:'-',l:'Compassion',c:'Apathy',q:'Somebody tells you their pain and you start fixing it so you do not have to feel it.'},
{k:'-',l:'Compassion',c:'Shame',q:'You are harder on yourself than you would let anybody be on a person you love.'},
{k:'-',l:'Compassion',c:'Disgust',q:'You have run out of patience for people struggling the way you once struggled.'},
{k:'-',l:'Compassion',c:'Disgust',q:'Somebody cries in front of you and the first thing you feel is irritation.'},
{k:'-',l:'Compassion',c:'Sad',q:'You cannot sit with your own grief unless there is a task in your hands.'},

/* ---------- Forgiveness. Heart. ---------- */
{k:'-',l:'Forgiveness',c:'Anger',q:'You are still holding something from years ago and you can point to where you hold it.'},
{k:'-',l:'Forgiveness',c:'Sad',q:'You rehearse the conversation where they finally understand what they did.'},
{k:'-',l:'Forgiveness',c:'Sad',q:'You cannot say a certain name out loud without your chest changing.'},
{k:'-',l:'Forgiveness',c:'Disgust',q:'You forgive somebody out loud and take it back in private.'},
{k:'-',l:'Forgiveness',c:'Anger',q:'You do not want them well. You want them to know.'},

/* ---------- Generosity. Heart. ---------- */
{k:'-',l:'Generosity',c:'Shame',q:'You give and then wait to see whether it was noticed.'},
{k:'-',l:'Generosity',c:'Sad',q:'You are the one everybody asks, and nobody asks you.'},
{k:'-',l:'Generosity',c:'Shame',q:'You cannot take anything from anybody without a knot forming.'},
{k:'-',l:'Generosity',c:'Apathy',q:'You give until there is nothing left and call it love.'},
{k:'-',l:'Generosity',c:'Disgust',q:'You hold back something somebody needs, and you have it to give.'},

/* ---------- Aesthetic Beauty. Heart. ---------- */
{k:'-',l:'Aesthetic Beauty',c:'Sad',q:'You have stopped making the thing you used to make, and you know the month you stopped.'},
{k:'-',l:'Aesthetic Beauty',c:'Shame',q:'You put work out unfinished because finishing it had become unbearable.'},
{k:'-',l:'Aesthetic Beauty',c:'Apathy',q:'Nothing lands any more. Not music, not weather, not a face.'},
{k:'-',l:'Aesthetic Beauty',c:'Apathy',q:'You live in a room you have not properly looked at in a year.'},

/* ---------- Courage. Solar. ---------- */
{k:'-',l:'Courage',c:'Fear',q:'There is one conversation that would change your life and you get near it and stop.'},
{k:'-',l:'Courage',c:'Fear',q:'You know what the next step is. You have known for a long time.'},
{k:'-',l:'Courage',c:'Fear',q:'You stay because leaving is frightening, not because staying is right.'},
{k:'-',l:'Courage',c:'Shame',q:'You go quiet in a room where you are holding the thing that needs saying.'},
{k:'-',l:'Courage',c:'Anticipation',q:'You check the same fear every morning and never go near it.'},

/* ---------- Duty. Solar. ---------- */
{k:'-',l:'Duty',c:'Anger',q:'You are doing work that is not yours and the person it belongs to has stopped noticing.'},
{k:'-',l:'Duty',c:'Shame',q:'You drop something that is yours to do and somebody else has been carrying it since.'},
{k:'-',l:'Duty',c:'Disgust',q:'You do what you promised only while somebody is watching.'},
{k:'-',l:'Duty',c:'Anticipation',q:'You have taken on so much that nothing you do is done well.'},

/* ---------- Responsibility. Solar. ---------- */
{k:'-',l:'Responsibility',c:'Apathy',q:'You have a reason ready for everything that has not happened yet.'},
{k:'-',l:'Responsibility',c:'Disgust',q:'You explain the same obstacle to different people and it has stopped being true.'},
{k:'-',l:'Responsibility',c:'Sad',q:'You wait to be rescued from a situation you built.'},
{k:'-',l:'Responsibility',c:'Apathy',q:'Your health is something that happens to you rather than something you run.'},
{k:'-',l:'Responsibility',c:'Shame',q:'Somebody left and you have still not looked at your half of it.'},

/* ---------- Accountability. Solar. ---------- */
{k:'-',l:'Accountability',c:'Shame',q:'You have never said the whole of it out loud to anybody.'},
{k:'-',l:'Accountability',c:'Disgust',q:'You apologise in a way that turns it back into being about you.'},
{k:'-',l:'Accountability',c:'Fear',q:'You break something and let somebody else believe it broke itself.'},
{k:'-',l:'Accountability',c:'Fear',q:'There is nobody in your life who is allowed to tell you no.'},
{k:'-',l:'Accountability',c:'Apathy',q:'You say you will change and nothing you could measure changes.'},

/* ---------- Temperance. Sacral. ---------- */
{k:'-',l:'Temperance',c:'Disgust',q:'You do not stop at enough. You stop when it is gone.'},
{k:'-',l:'Temperance',c:'Shock',q:'You know the hour of the night when it gets away from you.'},
{k:'-',l:'Temperance',c:'Anticipation',q:'You work until your body stops you and then you call that discipline.'},
{k:'-',l:'Temperance',c:'Fear',q:'You reach for something the moment the day goes quiet.'},
{k:'-',l:'Temperance',c:'Disgust',q:'You have swapped one thing you could not put down for another.'},

/* ---------- Detachment. Sacral. ---------- */
{k:'-',l:'Detachment',c:'Anticipation',q:'You cannot begin a thing without already needing it to work.'},
{k:'-',l:'Detachment',c:'Anticipation',q:'You check for a reply more often than you would admit to anybody.'},
{k:'-',l:'Detachment',c:'Shock',q:'You cut somebody off entirely because caring less was not available.'},
{k:'-',l:'Detachment',c:'Surprise',q:'The outcome arrives and it does not touch you the way you had rehearsed.'},
{k:'-',l:'Detachment',c:'Fear',q:'You hold a plan so tightly that a change to it reads as a threat.'},

/* ---------- Non-Harm. Root. ---------- */
{k:'-',l:'Non-Harm',c:'Anger',q:'You say the accurate cruel thing because it is accurate.'},
{k:'-',l:'Non-Harm',c:'Disgust',q:'You go silent at somebody, and you know what it does to them.'},
{k:'-',l:'Non-Harm',c:'Shame',q:'You take it out on your own body first.'},
{k:'-',l:'Non-Harm',c:'Sad',q:'There is a person who is careful around you now.'},
{k:'-',l:'Non-Harm',c:'Disgust',q:'You use something told to you in confidence to win something.'},

/* ---------- Patience. Root. ---------- */
{k:'-',l:'Patience',c:'Anger',q:'You are early, ready, and furious at everybody slower.'},
{k:'-',l:'Patience',c:'Sad',q:'You leave a thing just before it was going to work.'},
{k:'-',l:'Patience',c:'Shock',q:'You cannot wait for something without leaking it onto whoever is nearest.'},
{k:'-',l:'Patience',c:'Surprise',q:'Bad news arrives and you find you were already braced for it.'},
{k:'-',l:'Patience',c:'Anticipation',q:'You are moving faster than the thing needs and you cannot slow down.'}];

/* ============================================================
   THE NEXT TABLE, QQ_42. The owner's first draft of 4 November,
   "ATUNED 42-QUESTION FIRST DRAFT": 21 law questions, 12 archetype
   questions and 9 child emotion questions, one each, on one
   frequency scale where Always is the clean end. Only the 21 law
   questions are written here, in his wording exactly, each under
   the name SI carries for it. The other 21 are held on his own open
   calls (TASKS.md SV25, SV26): whether the nine child emotion
   answers feed the live field, and what an archetype answer is
   stored as. They land here as more items under the same rules, a
   c where an item loads one of the nine and its own k, so the table
   grows and nothing that reads it is rewritten.

   IT IS NOT THE SERVED TABLE YET, AND THE REASON IS MEASURED. Every
   item of the hundred scores a law AND loads a charge axis, and the
   charges are what the reading's last three layers are drawn from:
   the saboteurs, the load in the body, where a release starts, and
   the ring in the header. These 21 load no charge, so served alone
   they leave all nine axes at nought. Measured on 5 November through
   read(), the same call the page makes, at every law held at three:
   coherence 30, and no saboteur, no seat carrying anything, no
   address to start a release on. The same laws with the nine axes at
   six give 28 saboteurs and a full release order, the 8 addresses the
   page asks relQueueOf for. Through the page itself, these 21 answered
   by its own buttons print no saboteur card, every seat as a dash, and
   "Charge is present" over a field with none in it. So the swap
   waits for the nine child emotion items, which are the only items
   in his draft that load the axes. Switching is the one line at the
   foot of this file.

   HIS SCALE AND THIS ONE. The draft asks 0 to 10, 0 never, 5 about
   half the time, 10 always. QSCALE above is the same span in five
   steps, Never 0, Sometimes 5, Always 10, and changing the buttons
   is a separate change from changing the questions. His draft also
   allows "not applicable, no chance to observe", which this page
   has no button for. Both are named in the pull request and not
   built.

   ONE WORD IS NOT HIS, and it is named so it can be put back. His
   Detachment question reads "how often do you honor your commitment".
   "honor your" is on the house soft lexicon, a hard failure of the
   voice gate, so it reads "keep your commitment" here until he rules
   on it. The house file scan reads single quoted strings only, which
   is why the five items carrying an apostrophe escape it rather than
   switch quotes: written in double quotes, his wording passed the
   file scan without being read at all.
   ============================================================ */
var QQ_42=[
{k:'+',l:'Truth',q:'When you want something to be true, how often do you check the facts?'},
{k:'+',l:'Transparency',q:'When something important is at stake, how often do you disclose the whole truth?'},
{k:'+',l:'Unity',q:'When someone is different from you, how often do you treat them as an equal?'},
{k:'+',l:'Awareness',q:'When you react strongly, how often do you recognize what\'s driving you?'},
{k:'+',l:'Presence',q:'When your mind wanders, how often do you return to the present?'},
{k:'+',l:'Equanimity',q:'When emotion rises, how often does your body stay steady?'},
{k:'+',l:'Compassion',q:'When someone is suffering, how often do you show compassion?'},
{k:'+',l:'Forgiveness',q:'When you hold a grudge, how often do you forgive?'},
{k:'+',l:'Courage',q:'When you feel afraid, how often do you act anyway?'},
{k:'+',l:'Temperance',q:'When you\'ve had enough, how often do you stop?'},
{k:'+',l:'Duty',q:'When a commitment becomes difficult, how often do you finish it?'},
{k:'+',l:'Accountability',q:'When something you did goes wrong, how often do you own the outcome?'},
{k:'+',l:'Justice',q:'When someone you favor acts wrongly, how often do you judge them fairly?'},
{k:'+',l:'Non-Harm',q:'When you\'re angry, how often do you avoid causing harm?'},
{k:'+',l:'Responsibility',q:'When others depend on you, how often do you consider how your actions affect them?'},
{k:'+',l:'Humility',q:'When you\'re wrong, how often do you admit it?'},
{k:'+',l:'Generosity',q:'When you give, how often do you expect nothing back?'},
{k:'+',l:'Detachment',q:'When you don\'t feel like acting, how often do you keep your commitment?'},
{k:'+',l:'Patience',q:'When progress is slow, how often do you keep working without forcing a result?'},
{k:'+',l:'Aesthetic Beauty',q:'When your surroundings become cluttered, how often do you put them in order?'},
{k:'+',l:'Nature',q:'When stress builds, how often do you spend time in nature?'}];

/* THE SERVED TABLE, and the browser key its answers are kept under.
   Answers are stored by position in the table, so a second table under
   the same key would read the hundred's answer to item 3 as the answer
   to its own item 3. Each table keeps its own key: the hundred keeps
   the key it has always had, so nobody part way through loses a thing,
   and QQ_42 gets a new one when it is served. */
var QQ=QQ_HUNDRED, QQ_KEY='atuned.quiz.v2';
