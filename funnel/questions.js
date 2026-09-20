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
var QQ=[

/* ---------- Truth. Throat. ---------- */
{l:'Truth',c:'Shame',q:'You say yes while your chest tightens, because no is going to cost more than you have.'},
{l:'Truth',c:'Apathy',q:'You soften a true thing until the person hearing it can no longer hear it.'},
{l:'Truth',c:'Sad',q:'There is a sentence you have not said at home. You have known it for months.'},
{l:'Truth',c:'Apathy',q:'Somebody asks how you are and the answer is out of your mouth before you have checked.'},
{l:'Truth',c:'Disgust',q:'You catch yourself telling a version of your life you have stopped believing.'},

/* ---------- Transparency. Throat. ---------- */
{l:'Transparency',c:'Fear',q:'You keep one part of your life in a separate room, and keeping it there costs you sleep.'},
{l:'Transparency',c:'Shame',q:'You would not want the people who love you to see the inside of an ordinary day.'},
{l:'Transparency',c:'Apathy',q:'You hold a room well and then sit in the car a while before you drive.'},
{l:'Transparency',c:'Fear',q:'You edit the story before you tell your nearest person, out of habit and not out of kindness.'},
{l:'Transparency',c:'Surprise',q:'Somebody gets close and your body changes the subject before your mouth does.'},

/* ---------- Justice. Throat. ---------- */
{l:'Justice',c:'Anger',q:'You carry a debt somebody owes you and it is louder at night than in the day.'},
{l:'Justice',c:'Anger',q:'You take less than your share and then resent the person who let you.'},
{l:'Justice',c:'Anger',q:'You keep score in a close relationship and the other person does not know there is a score.'},
{l:'Justice',c:'Shame',q:'Something unfair lands on somebody smaller than you and you say nothing.'},

/* ---------- Unity. Crown. ---------- */
{l:'Unity',c:'Sad',q:'You are in a full room and the distance between you and everybody in it does not close.'},
{l:'Unity',c:'Disgust',q:'You have decided some people are a different kind of creature to you.'},
{l:'Unity',c:'Surprise',q:'You meet somebody new already braced for how it ends.'},
{l:'Unity',c:'Anger',q:'Somebody else wins and it lands in your body as a loss.'},

/* ---------- Awareness. Crown. ---------- */
{l:'Awareness',c:'Shock',q:'You arrive somewhere and cannot account for the twenty minutes before it.'},
{l:'Awareness',c:'Anger',q:'You learn you were angry from how you spoke to somebody, not from feeling it.'},
{l:'Awareness',c:'Shock',q:'The same argument starts again and you cannot find the moment you entered it.'},
{l:'Awareness',c:'Anticipation',q:'Your hand is on the phone before you notice deciding to reach for it.'},
{l:'Awareness',c:'Fear',q:'Your body tells you first and you overrule it.'},

/* ---------- Nature. Crown. ---------- */
{l:'Nature',c:'Anger',q:'You are fighting something that is not going to change, and you have been fighting it for years.'},
{l:'Nature',c:'Disgust',q:'Your body asks for rest and you read the request as weakness.'},
{l:'Nature',c:'Anticipation',q:'You cannot let a slow month be slow. Slow reads as falling behind.'},
{l:'Nature',c:'Surprise',q:'Something ends and you had no idea it was ending.'},

/* ---------- Presence. 3rd Eye. ---------- */
{l:'Presence',c:'Sad',q:'You are with somebody you love and you are somewhere else the whole time.'},
{l:'Presence',c:'Anticipation',q:'You cannot sit in a room with nothing playing in it.'},
{l:'Presence',c:'Apathy',q:'You finish a meal without tasting it.'},
{l:'Presence',c:'Apathy',q:'Somebody is still talking and you are already drafting the reply.'},
{l:'Presence',c:'Anticipation',q:'You wake and the day has started in your head before your feet are on the floor.'},

/* ---------- Humility. 3rd Eye. ---------- */
{l:'Humility',c:'Anger',q:'You would rather be right than let the argument end.'},
{l:'Humility',c:'Anger',q:'Somebody tells you something true about you and you go looking for what is wrong with them.'},
{l:'Humility',c:'Shame',q:'You cannot ask for help without paying for it somehow first.'},
{l:'Humility',c:'Disgust',q:'You refuse advice you need because of who is giving it.'},
{l:'Humility',c:'Shame',q:'You explain instead of listening, and you can hear yourself doing it.'},

/* ---------- Equanimity. 3rd Eye. ---------- */
{l:'Equanimity',c:'Surprise',q:'A small thing goes wrong and the whole day goes with it.'},
{l:'Equanimity',c:'Anger',q:'Your voice is up before you have decided to raise it.'},
{l:'Equanimity',c:'Anger',q:'You are level all day and then something breaks over nothing at home.'},
{l:'Equanimity',c:'Anticipation',q:'Your jaw is tight when you notice it, and you notice it most days.'},
{l:'Equanimity',c:'Shock',q:'You need the last word before you can put the thing down.'},

/* ---------- Compassion. Heart. ---------- */
{l:'Compassion',c:'Apathy',q:'Somebody tells you their pain and you start fixing it so you do not have to feel it.'},
{l:'Compassion',c:'Shame',q:'You are harder on yourself than you would let anybody be on a person you love.'},
{l:'Compassion',c:'Disgust',q:'You have run out of patience for people struggling the way you once struggled.'},
{l:'Compassion',c:'Disgust',q:'Somebody cries in front of you and the first thing you feel is irritation.'},
{l:'Compassion',c:'Sad',q:'You cannot sit with your own grief unless there is a task in your hands.'},

/* ---------- Forgiveness. Heart. ---------- */
{l:'Forgiveness',c:'Anger',q:'You are still holding something from years ago and you can point to where you hold it.'},
{l:'Forgiveness',c:'Sad',q:'You rehearse the conversation where they finally understand what they did.'},
{l:'Forgiveness',c:'Sad',q:'You cannot say a certain name out loud without your chest changing.'},
{l:'Forgiveness',c:'Disgust',q:'You forgive somebody out loud and take it back in private.'},
{l:'Forgiveness',c:'Anger',q:'You do not want them well. You want them to know.'},

/* ---------- Generosity. Heart. ---------- */
{l:'Generosity',c:'Shame',q:'You give and then wait to see whether it was noticed.'},
{l:'Generosity',c:'Sad',q:'You are the one everybody asks, and nobody asks you.'},
{l:'Generosity',c:'Shame',q:'You cannot take anything from anybody without a knot forming.'},
{l:'Generosity',c:'Apathy',q:'You give until there is nothing left and call it love.'},
{l:'Generosity',c:'Disgust',q:'You hold back something somebody needs, and you have it to give.'},

/* ---------- Aesthetic Beauty. Heart. ---------- */
{l:'Aesthetic Beauty',c:'Sad',q:'You have stopped making the thing you used to make, and you know the month you stopped.'},
{l:'Aesthetic Beauty',c:'Shame',q:'You put work out unfinished because finishing it had become unbearable.'},
{l:'Aesthetic Beauty',c:'Apathy',q:'Nothing lands any more. Not music, not weather, not a face.'},
{l:'Aesthetic Beauty',c:'Apathy',q:'You live in a room you have not properly looked at in a year.'},

/* ---------- Courage. Solar. ---------- */
{l:'Courage',c:'Fear',q:'There is one conversation that would change your life and you get near it and stop.'},
{l:'Courage',c:'Fear',q:'You know what the next step is. You have known for a long time.'},
{l:'Courage',c:'Fear',q:'You stay because leaving is frightening, not because staying is right.'},
{l:'Courage',c:'Shame',q:'You go quiet in a room where you are holding the thing that needs saying.'},
{l:'Courage',c:'Anticipation',q:'You check the same fear every morning and never go near it.'},

/* ---------- Duty. Solar. ---------- */
{l:'Duty',c:'Anger',q:'You are doing work that is not yours and the person it belongs to has stopped noticing.'},
{l:'Duty',c:'Shame',q:'You drop something that is yours to do and somebody else has been carrying it since.'},
{l:'Duty',c:'Disgust',q:'You do what you promised only while somebody is watching.'},
{l:'Duty',c:'Anticipation',q:'You have taken on so much that nothing you do is done well.'},

/* ---------- Responsibility. Solar. ---------- */
{l:'Responsibility',c:'Apathy',q:'You have a reason ready for everything that has not happened yet.'},
{l:'Responsibility',c:'Disgust',q:'You explain the same obstacle to different people and it has stopped being true.'},
{l:'Responsibility',c:'Sad',q:'You wait to be rescued from a situation you built.'},
{l:'Responsibility',c:'Apathy',q:'Your health is something that happens to you rather than something you run.'},
{l:'Responsibility',c:'Shame',q:'Somebody left and you have still not looked at your half of it.'},

/* ---------- Accountability. Solar. ---------- */
{l:'Accountability',c:'Shame',q:'You have never said the whole of it out loud to anybody.'},
{l:'Accountability',c:'Disgust',q:'You apologise in a way that turns it back into being about you.'},
{l:'Accountability',c:'Fear',q:'You break something and let somebody else believe it broke itself.'},
{l:'Accountability',c:'Fear',q:'There is nobody in your life who is allowed to tell you no.'},
{l:'Accountability',c:'Apathy',q:'You say you will change and nothing you could measure changes.'},

/* ---------- Temperance. Sacral. ---------- */
{l:'Temperance',c:'Disgust',q:'You do not stop at enough. You stop when it is gone.'},
{l:'Temperance',c:'Shock',q:'You know the hour of the night when it gets away from you.'},
{l:'Temperance',c:'Anticipation',q:'You work until your body stops you and then you call that discipline.'},
{l:'Temperance',c:'Fear',q:'You reach for something the moment the day goes quiet.'},
{l:'Temperance',c:'Disgust',q:'You have swapped one thing you could not put down for another.'},

/* ---------- Detachment. Sacral. ---------- */
{l:'Detachment',c:'Anticipation',q:'You cannot begin a thing without already needing it to work.'},
{l:'Detachment',c:'Anticipation',q:'You check for a reply more often than you would admit to anybody.'},
{l:'Detachment',c:'Shock',q:'You cut somebody off entirely because caring less was not available.'},
{l:'Detachment',c:'Surprise',q:'The outcome arrives and it does not touch you the way you had rehearsed.'},
{l:'Detachment',c:'Fear',q:'You hold a plan so tightly that a change to it reads as a threat.'},

/* ---------- Non-Harm. Root. ---------- */
{l:'Non-Harm',c:'Anger',q:'You say the accurate cruel thing because it is accurate.'},
{l:'Non-Harm',c:'Disgust',q:'You go silent at somebody, and you know what it does to them.'},
{l:'Non-Harm',c:'Shame',q:'You take it out on your own body first.'},
{l:'Non-Harm',c:'Sad',q:'There is a person who is careful around you now.'},
{l:'Non-Harm',c:'Disgust',q:'You use something told to you in confidence to win something.'},

/* ---------- Patience. Root. ---------- */
{l:'Patience',c:'Anger',q:'You are early, ready, and furious at everybody slower.'},
{l:'Patience',c:'Sad',q:'You leave a thing just before it was going to work.'},
{l:'Patience',c:'Shock',q:'You cannot wait for something without leaking it onto whoever is nearest.'},
{l:'Patience',c:'Surprise',q:'Bad news arrives and you find you were already braced for it.'},
{l:'Patience',c:'Anticipation',q:'You are moving faster than the thing needs and you cannot slow down.'}];
