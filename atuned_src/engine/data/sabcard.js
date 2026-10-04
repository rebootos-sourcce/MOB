/* ============================================================
   SABCARD · the saboteur card, said as lived behaviour. Round SB.

   Ruled by the owner on the copy feedback, round SB: "that's good copy...
   let's integrate this across the system, wire it all in." The card
   kbSabBlock printed was SABDEF read out field by field, a clinical
   definition, a trigger, the sentence and a bare command, and it read as a
   case note about the person holding it. This table is the same four facts
   turned to face the reader, keyed exactly as SABDEF is (KB_KEY), one row
   for each of the 33.

     h  what happens. The situation and the behaviour in sequence, before any
        label: SABDEF.t is the trigger, SABDEF.d is what the person does, and
        the payoff lands before the cost. Composed from those two fields and
        from nothing else. No fact here is new canon.
     a  what becomes available. Composed from TWO tables, never guessed: the
        axes this saboteur's SAB33 row keys on, and each axis's opp in CHILD.
        Controller keys on fear and anger, so its row names trust and
        equanimity. tests/engine.js reads every row against SAB33 and CHILD
        and fails a row that leaves out one of its own opposites, because
        that is how the first draft of Martyr shipped: the approved mock-up
        said "Rest becomes available", and rest is not the opposite of any
        axis Martyr runs on. It names worth, joy and vitality now.
     n  next move. SABDEF.i, same meaning, reframed as notice, separate,
        choose, because a bare command reads as an order to a person who is
        already under one.

   SABDEF.q is not copied here. It is the pattern's own sentence and the card
   prints it verbatim from SABDEF, so there is one source for it.

   What this table may never say: "you are a" anything. The pattern is
   something a person runs, and a card that collapses it into who they are is
   the accusation pass 9 of the voice skill exists to catch.

   Every string went through check.py --line before it landed, and the file
   goes through check.py whole. Superior is in SAB_LIB and in neither SABDEF
   nor SAB33, so it has no row here and kbSabBlock prints nothing for it,
   which is what it printed before.
   ============================================================ */
var SABCARD={
 "negotiator":{
  h:"You mean to start. In the pause before you begin, a reasonable voice speaks up. Just this once. You've earned a break. It never says stop for good, only stop for today. For a moment the easier option feels earned. Then the thing you meant to do is still waiting, and the next pause is easier to win.",
  a:"Everyone has a pause before starting. When the fear isn't the one talking in it, the gap between meaning to and beginning gets short. Trust becomes available that you can handle the first uncomfortable minute, and vitality goes into the thing itself.",
  n:"Notice the pause between meaning to and starting. Separate the reasonable voice from the discomfort it is steering you around. Choose the first small motion before the argument finishes."},
 "controller":{
  h:"Something turns uncertain. Someone hasn't followed through. An outcome stops feeling guaranteed. Before anything has actually gone wrong, the grip tightens anyway. You check. You correct. You take over. For a moment it works, the grip reads as safety. Then the room gets smaller: less space for the people around you to move, less room in you to trust without checking first.",
  a:"Control isn't the problem. It works. When the fear isn't the one holding the grip, there's a beat of equanimity before you act, long enough to decide instead of react. Trust becomes available instead of something to verify first.",
  n:"Notice the moment the grip tightens. Separate the real risk from the old fear running it. Choose the next move from there."},
 "victim":{
  h:"Something goes wrong and somebody asks what part was yours. The first answer that comes is the list of what was done to you. You tell it again. People lean in. For a moment the attention feels like being held. Then nothing has moved, and the next thing that goes wrong lands on the same spot.",
  a:"The hurt might be real. Some of it probably was done to you. When the charge isn't telling the story, there's room to find the one part that is yours to move. Equanimity becomes available to look at it without a fight, vitality to act on it, and joy has a way back in.",
  n:"Notice the moment the story starts to replay. Separate what happened to you from what is still in your hands. Choose one thing in your hands and do it."},
 "perfectionist":{
  h:"The work is nearly done. You see one more flaw, then another, in your work and in other people's. You fix it. You hold it back a little longer. For a moment the extra pass feels like care. Then the deadline slides, the work never leaves your hands, and the people around you feel the pressure too.",
  a:"High standards make good work. When the charge isn't setting them, there's room to see a finished thing as finished. Acceptance becomes available for work that has flaws, and equanimity when somebody else's work does too.",
  n:"Notice the urge for one more pass. Separate the flaw that matters from the pressure to keep going. Choose a time to hand it over, and hand it over then."},
 "pleaser":{
  h:"Somebody might be let down. A limit is needed, and the limit could cost their approval. So you help instead. You smooth it over, pay a compliment, take on the extra job. For a moment the room stays warm. Then your own preference has gone unsaid again, and the tiredness is the kind rest doesn't fix.",
  a:"Helping can be generous. When the fear isn't asking for approval, there's room to say what you want once and let it stand. Trust becomes available that the relationship can hold a no, and vitality comes back to what you choose to give.",
  n:"Notice the moment you reach to smooth things over. Separate what you want from what will keep them pleased. Choose to say the preference once, with no apology attached."},
 "hyper achiever":{
  h:"Rest is available. Nobody is measuring anything. Something in you won't let the time sit empty. You open the laptop. You find one more thing to finish. For a moment the output feels like proof of your worth. Then the proof wears off by evening, and the next day needs more of it.",
  a:"Real work gets done this way. When the fear isn't keeping score, there's room for an hour that produces nothing. Vitality becomes available that doesn't come from output, and trust that your worth is still there when you stop.",
  n:"Notice the reach for the next task when rest is on offer. Separate what needs doing from what the output is meant to show. Choose an hour with nothing to show for it."},
 "hyper rational":{
  h:"Somebody brings a feeling into the room. You go straight to the problem. You ask for the facts, find the logic, offer the fix. The feeling gets set aside as noise. For a moment the clarity feels like help. Then the other person goes quiet, and whatever you felt yourself never got named.",
  a:"Logic solves real things. When the charge isn't steering away from feeling, there's room to let an emotion count as information. Groundedness becomes available when a feeling shows up, and acceptance of what can't be explained yet.",
  n:"Notice the jump from a feeling to a fix. Separate the problem from what the person in front of you feels. Choose to name the feeling first, then think."},
 "hyper vigilant":{
  h:"Something in the room changes. Somebody asks you to trust them. Your attention goes to the exits, the risks, what could go wrong next. You scan. You plan around it. For a moment the watching feels like protection. Then the scan never switches off, and nothing gets to feel safe for long.",
  a:"Watching has kept you out of real trouble. When the fear isn't running the scan, there's room to notice what is safe right now. Trust becomes available in small amounts, and equanimity when the room changes again.",
  n:"Notice the scan starting when something changes. Separate the real risk in front of you from the one that is always just ahead. Choose one thing that is safe and stay with it for a minute."},
 "restless":{
  h:"Things settle. The job, the place, the plan starts to feel familiar. An itch starts. You look for the next thing, a new project, a new place, a new plan. For a moment the new thing feels alive. Then it settles too, and the itch comes back on schedule.",
  a:"Curiosity moves things forward. When the charge isn't pushing you out of the moment, there's room to stay long enough for something to deepen. Vitality becomes available in the familiar thing, and trust that staying won't trap you.",
  n:"Notice the itch when things go quiet and steady. Separate real curiosity from the push to leave. Choose to stay twice as long as the itch wants."},
 "stickler":{
  h:"Somebody does it differently. The dishwasher is loaded wrong, the report is out of order, the plan skipped a step. You feel the wrongness before you think about it. You correct it. You explain the right way. For a moment the order feels like relief. Then people stop doing things around you, and you end up doing everything the right way alone.",
  a:"Order helps. When the charge isn't enforcing it, there's room to tell a standard you value from one that only keeps the fear down. Acceptance becomes available for another way that works, and equanimity when things are out of place.",
  n:"Notice the jolt when something is done another way. Separate the standard you value from the fear it is guarding. Choose which one to act on."},
 "judge":{
  h:"Somebody falls short, and sometimes that somebody is you. The verdict arrives fast. You find the fault. You replay the old failures that seem to back it up. For a moment the judgment feels like seeing clearly. Then the same eye turns on everything, and every other pattern has something to feed on.",
  a:"Some things really are wrong. When the charge isn't passing the sentence, there's room to see what is also right about the same situation. Acceptance becomes available toward others and toward you, along with equanimity and the vitality the verdicts were using up.",
  n:"Notice the verdict as it forms. Separate what actually went wrong from who you're blaming for it. Choose to find one thing that is right about it."},
 "deflector":{
  h:"Somebody asks a direct question, or something asks you to own your part. You change the subject. You explain why it wasn't really you. You make a joke. For a moment the attention moves somewhere safer. Then the question is still there, and the person asking learns less about you each time.",
  a:"Some things can stay private. When the shame isn't steering the answer, there's room to stay with the question long enough to answer it. Worth becomes available that doesn't depend on staying unseen, and equanimity when someone looks closely.",
  n:"Notice the swerve when a direct question lands. Separate what is being asked from what you fear it shows. Choose to stay with the question for ten seconds before you answer."},
 "dramatizer":{
  h:"A strong feeling arrives and people are around. The volume goes up. You tell it bigger. The story gets sharper with each telling. For a moment the room moves and the feeling is seen. Then people start bracing when you speak, and the real size of what you felt gets lost.",
  a:"The feeling may be big. When the charge isn't turning it up, there's room to say it at the size it actually is. Groundedness becomes available inside a strong feeling, and joy that doesn't need an audience.",
  n:"Notice the volume rising as you start to speak. Separate the size of the feeling from the size of the telling. Choose to say the next part at half the volume."},
 "worrywart":{
  h:"The future is unclear. Your mind runs ahead to what could go wrong. You picture it. You picture the next one. Then you go back and run the first one again. For a moment the worry feels like getting ready. Then nothing has been decided, and you're worn out by a day that hasn't happened.",
  a:"Plans need some thinking ahead. When the fear isn't running the forecast, there's room to name one real risk and one real answer to it. Trust becomes available in your ability to handle what comes, and joy in the day you're actually in.",
  n:"Notice the loop when a new worry starts. Separate the specific worst case from the general dread. Choose one action you would take if it happened, and stop there."},
 "loner":{
  h:"Connection is on offer. Somebody invites you in, or help would make this easier. You decline. You handle it alone, and it feels like preferring your own company. For a moment the distance feels like strength. Then the gap gets wider, and asking gets harder the longer it goes.",
  a:"Solitude can be good. When the fear isn't choosing it for you, there's room to want people and to let them in. Trust becomes available in the people close to you, and joy in being with them.",
  n:"Notice the step back when connection is offered. Separate wanting time alone from avoiding the risk of needing someone. Choose one direct ask for company or help."},
 "people pleaser":{
  h:"You can't tell if they approve. A boundary would help, and it might cost their liking you. You adjust. You agree. You say what lands well over what's true. For a moment their warmth feels like being all right. Then you can't remember what you actually think, and the relationship is with someone you're performing.",
  a:"Caring what people think keeps you connected. When the shame isn't asking for approval, there's room to give the answer that's good for the relationship. Worth becomes available that doesn't hang on their face, and vitality in being yourself with them.",
  n:"Notice the shift as you read their reaction. Separate what serves the relationship from what wins their approval. Choose the first one."},
 "skeptic":{
  h:"Something new arrives that doesn't fit what you already think. The doubt comes first. You look for the flaw. You find a reason it won't work. For a moment the doubt feels like protection from being fooled. Then nothing new gets in, and the picture you're holding stops matching the world.",
  a:"Good questions catch real mistakes. When the charge isn't guarding you against disappointment, there's room to let a new idea sit before you decide. Acceptance becomes available for what doesn't fit yet, and groundedness when it shakes something you believed.",
  n:"Notice the first reason to dismiss it. Separate a real flaw from the old guard against being let down. Choose to sit with it for a day before deciding."},
 "dreamer":{
  h:"You can see how good it could be, and how far away it is. The gap shows, and you go back to the picture. You refine the vision. You wait for better conditions. For a moment the dream feels close. Then the gap stays the same size, and the dream gets harder to look at.",
  a:"Vision points somewhere worth going. When the charge isn't keeping you in the picture, there's room to take the first clumsy step. Vitality becomes available in the work itself, and joy in the thing as it actually gets built.",
  n:"Notice the drift back to the vision when the gap shows. Separate the picture from the next step it needs. Choose one concrete step and do it today."},
 "procrastinator":{
  h:"The important thing is clear, and nothing stands in the way of starting. So you do something else. You tidy, plan, answer messages, stay busy. For a moment the motion feels like progress. Then the deadline gets close, the pressure arrives, and the work gets done in a rush you call your style.",
  a:"Some things do need time. When the fear isn't pushing the start back, there's room to begin before you feel ready. Trust becomes available that a rough start is still a start, and joy in work that gets done without a panic.",
  n:"Notice the side task you pick up in its place. Separate getting ready from actually beginning. Choose to begin for three minutes."},
 "imposter":{
  h:"Somebody praises the work, or the work is about to be judged. A cold drop arrives. You wave the praise off. You over prepare. You wait to be found out. For a moment playing small feels safer. Then the evidence of what you can do keeps piling up, and none of it lands.",
  a:"Humility keeps you learning. When the shame isn't grading you, there's room to count what you actually know. Worth becomes available from the evidence that's already there, and trust that you earned your place in the room.",
  n:"Notice the wave off as praise arrives. Separate what you know from what you fear they'll see. Choose one thing you know that the room doesn't, and say it."},
 "aggressor":{
  h:"Somebody pushes back, or the plan stalls. The heat comes up fast. You raise your voice. You push harder. You override. For a moment it works, people fall in line. Then the agreement turns out to be fear, and what they actually think goes underground.",
  a:"Sometimes things need pushing. When the anger isn't the one pushing, there's room for a pause long enough to see what's underneath it. Equanimity becomes available when you're challenged, and vitality that doesn't need a fight.",
  n:"Notice the heat as somebody pushes back. Separate the anger from the fear underneath it. Choose your next words after a five second pause."},
 "martyr":{
  h:"Giving can become a way to make yourself necessary. You say yes when you mean no. You carry what somebody else could carry. You wait for the sacrifice to be noticed, and when it isn't, something in you hardens.",
  a:"The giving might be real. So might the exhaustion. What matters is whether it was freely chosen, or whether giving became the way a place got earned. When the charge isn't driving it, there's room to ask what you actually want to do. Worth becomes available instead of something to earn, with room for joy and vitality in what you choose to give.",
  n:"Notice the give before you've offered it. Separate what you want to do from what you feel is owed. Choose from the first one."},
 "cynic":{
  h:"Someone gets excited, or you catch yourself hoping. You get there first with the reason it won't last. You roll your eyes. You name the catch. For a moment being unimpressed feels safe from disappointment. Then the hope in the room dries up, including yours.",
  a:"Some things are overhyped. When the charge isn't dismissing it in advance, there's room to see what is actually good. Acceptance becomes available for hope that might not work out, and joy in it while it's here.",
  n:"Notice the eye roll before you say it. Separate a real catch from the guard against being let down. Choose to name one good thing about it."},
 "manipulator":{
  h:"You need something, and asking straight out feels too exposed. So you go around. You hint. You hold something back until they offer. You set things up so they come to you. For a moment it works, and you never had to ask. Then people sense the angle, and trust gets thinner each time.",
  a:"Everyone has needs. When the charge isn't steering around the ask, there's room to say the need straight. Equanimity becomes available for hearing yes or no, and the vitality that went into the setup comes back.",
  n:"Notice the angle forming before you ask. Separate the actual need from the setup around it. Choose to say the need once, directly."},
 "overthinker":{
  h:"A decision is due and the outcome is unclear. You look at it again. You weigh one more angle. You ask one more person. For a moment the thinking feels responsible. Then the loop runs past anything new to learn, and the clock makes the choice for you.",
  a:"Some choices need thinking through. When the fear isn't asking for certainty, there's room to decide with what you know. Trust becomes available in a good enough choice, and worth that doesn't depend on getting it perfect.",
  n:"Notice the loop once you've stopped learning anything new. Separate the information you need from the certainty you want. Choose a time to decide, and decide then."},
 "escapist":{
  h:"Something uncomfortable starts, and there's a way out. You reach for the phone, the snack, the drink, the drive. For a moment the feeling goes quiet. Then it comes back unfinished, and the exits get used more often.",
  a:"A break can help. When the fear isn't reaching for the exit, there's room to stay with a hard feeling until it moves. Vitality becomes available in being here, and trust that you can get through discomfort without leaving.",
  n:"Notice the reach for the exit. Separate needing a real break from leaving before the feeling finishes. Choose to stay for two minutes and name what's there."},
 "avoider":{
  h:"Something needs dealing with, and leaving it costs nothing today. So it slides. You don't argue with it or run from it. You just don't look. For a moment nothing can land on you. Then the pile grows quietly, and the bill comes due all at once.",
  a:"Some things can wait. When the fear isn't keeping your eyes off it, there's room to look at the thing directly. Vitality becomes available for the smallest piece of it, and trust that you can handle what you find.",
  n:"Notice the thing you keep not looking at. Separate what can wait from what you're avoiding. Choose to say it out loud, then do the smallest piece."},
 "nihilist":{
  h:"Effort needs a reason, and the reason starts to look thin. You knock it down before it can let you down. You call it pointless. You stop trying. For a moment nothing can disappoint you. Then nothing can reach you either, and the days go flat.",
  a:"Big questions are worth asking. When the charge isn't answering them in advance, there's room to do something worth doing anyway. Acceptance becomes available for not having the full answer, and joy in what you do meanwhile.",
  n:"Notice the moment you call it pointless. Separate the honest question from the guard against disappointment. Choose one thing worth doing either way, and do it."},
 "innocent":{
  h:"Things get complicated. A conflict starts, or a choice carries moral weight. You step back. You don't ask. You let yourself not know. For a moment staying out of it keeps you clean. Then something you could have seen happens anyway, and staying out made you part of it.",
  a:"Not every fight is yours. When the fear isn't closing your eyes, there's room to see what you already know. Trust becomes available that you can face it, and that knowing won't sink you.",
  n:"Notice the step back when it gets complicated. Separate what isn't yours from what you're pretending not to see. Choose to name one thing you already know."},
 "pessimist":{
  h:"A good outcome becomes possible. You start building the case against it. You list what will go wrong. You lower your hopes before anyone else can. For a moment expecting the worst feels like protection. Then you put in less, the outcome gets smaller, and the case comes true.",
  a:"Some plans do fail. When the charge isn't writing the ending, there's room to picture the good outcome as clearly as the bad one. Trust becomes available that it might work, and joy in giving it a real try.",
  n:"Notice the case building against a good outcome. Separate the real risk from the guard against hope. Choose the best thing that could really happen, and act from there."},
 "catastrophizer":{
  h:"Something is unresolved. A message goes unanswered, a result is pending. In seconds it stops being an unknown and becomes the end of everything. You feel the grief of it ahead of time. For a moment you feel braced. Then the body pays for a disaster that hasn't happened, and usually never does.",
  a:"Some things are serious. When the fear isn't jumping to the end, there's room to see where things actually stand right now. Trust becomes available in the facts in front of you, and joy in a day that isn't a disaster.",
  n:"Notice the jump from not knowing to the worst. Separate what is true right now from what you're picturing. Choose to describe the situation as it is, in the present tense."},
 "enabler":{
  h:"Someone you care about is doing the harmful thing again. You see it. You don't say it. You cover for them, lend the money, make the excuse. For a moment the peace holds and they stay close. Then the pattern grows, and the silence is part of what keeps it going.",
  a:"Standing by people matters. When the shame isn't keeping you quiet, there's room to say what you see once and let them answer. Worth becomes available that doesn't depend on them staying, and vitality that was going into covering for them.",
  n:"Notice the moment you start to cover for them. Separate keeping the peace from keeping the pattern. Choose to say what you see, once, and let them answer."},
 "control freak":{
  h:"You walk into something you didn't set up. A plan you didn't design. A silence where a yes should be. You start running it before any gap opens. You scan ahead for what could go wrong, and check that you're the one in charge. To other people it looks like competence. In the body it never lands, and the scan becomes the normal state.",
  a:"People rely on what you can do. When the fear isn't running the scan, there's room for your body to land in the room you're in. Presence becomes available here and not ahead, equanimity in a plan you didn't design, and trust in other people's hands.",
  n:"Notice the jaw, the shoulders and the breath already locked. Separate the work in front of you from the scan running ahead of it. Choose to loosen them on the out breath, and see what still needs you."}};
