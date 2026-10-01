/* ============================================================
   THE TEACHERS AS IMPRINTS. Round PD, 1 October, and DESIGN-teachers.md v2,
   which he accepted ("Yeah, the roster's right").

   WHAT IS HERE AND WHAT IS NOT. The compass tables (MIRROR, PATHS,
   POLES_EXTRA, MASTERS) own a teacher's name, quality, opposite, the codex
   line and the seat. This file owns only what they do not: the eight
   impression lines a pole leaves in a day (four channels, runs clean and runs
   as the opposite), the five addresses the opposite is marked at, the laws a
   pole is read through, and the six limit breaking lines. teachPole composes
   the two so no sentence is copied from one table into the other, which is
   how three lists joined by a name came to disagree about Jesus.

   EVERY STRING IN TEACH_ROWS IS A DRAFT FOR THE OWNER TO EDIT, in the posture
   round KQ took for the rituals of becoming ("plug that in, we'll edit it
   later"). The impressions are the design's Appendix A. The lines are the
   design's twelve worked ones (Zoroaster and Rumi) and seventy two more
   written to the same five checks: behaviour first, no "I am", one sentence,
   a belief it goes past, a cost or a condition where one exists.

   THE MARKED ADDRESSES ARE PROPOSED. The codex gives each opposite a sentence
   and a seat and never a list of addresses, so each list is argued from that
   sentence, and every name has to resolve to one of the 112 or the gate
   fails. They need the CQ seat's signature before they are called anything
   but proposed.

   KEYS ARE APPEND ONLY. A pole key is never reused or renamed, and a retired
   teacher keeps its key (`retired:true`) so a record that names it still
   loads. TEACH_ORDER is display order and moves freely, the rule the tab
   integers carry. Socrates, whom v1 proposed, was never issued a key, so
   there is nothing to retire.

   NO MATCH NUMBER, ANYWHERE. He ruled it: "they shouldn't carry a match
   number". Nothing in this file or in recipes.js stores, returns for display
   or shares a score of how well a thing fits a person. A rank is an order, and
   an order is all a surface is given.
   ============================================================ */
var TEACH_V=1;
/* working memory holds about four, so the person pins at most three */
var TEACH_FOCUS_MAX=3;
/* refused above this, never truncated, which is PR_CAP's posture */
var TEACH_RUNS_CAP=2000;
var TEACH_CH=['do','think','body','say'];
/* the closed set a mark may name, so a mark is an id and never a sentence */
var TEACH_IMP_IDS=['pos.do','pos.think','pos.body','pos.say','neg.do','neg.think','neg.body','neg.say'];
/* THREE REACHES, NAMED FOR WHAT THE PERSON DOES. The word tier already names
   the plan (free to four) and the practice's pacing step, so a reach is not
   called one. */
var TEACH_REACH=[{r:1,nm:'Say it'},{r:2,nm:'Walk it'},{r:3,nm:'Hold it'}];
/* WHAT OPENS A REACH, from a closed vocabulary of things a person did, read
   from marks that exist today. `any` is a list of ways in and each way is a
   list of conditions that must all hold. A reading of the person is never a
   condition: an unlock reads what somebody did and never a state of them.
   Every reach has a way in that spends nothing, because ground opened spends
   patterns and a release must never be the only door (a gate asserts it).
   Values are a first pass and the owner's to move, like BECOMING.
     chosen    the teacher is pinned (teach.focus)
     days      the teacher's own ritual steps done on this many different days
     released  addresses of the opposite found in what was released */
var TEACH_UNLOCK=[
 {r:1, any:[[{c:'chosen'}]]},
 {r:2, any:[[{c:'days',n:5}]]},
 {r:3, any:[[{c:'days',n:14},{c:'released',n:1}], [{c:'days',n:28}]]}];
/* the alignment's three weights, one table and the owner's to move. They sum
   to one by gate. The score they make is an internal sort key and is never
   printed. */
var TEACH_W={authored:0.5, seat:0.2, cover:0.3};
var TEACH_ORDER=['IL','RE','DE','OR','PO','PE','TR','CH','FL','AL','HO','SA','TU','NA'];
var TEACH_ROWS=[
 {k:'IL', word:"Love",
  imp:{pos:{do:"You give something away and tell nobody.", think:"You ask what the person in front of you needs, and not who is watching.", body:"Your chest feels wide and your shoulders sit lower.", say:"You say the kind thing once and do not wait for thanks."},
       neg:{do:"You are warm in the room and flat when it empties.", think:"You count who noticed the kindness.", body:"Your chest tightens when nobody is looking.", say:"You tell the story of the favour afterwards."}},
  marks:["Manipulative Kindness", "False Love", "Stage Performing", "Spiritual Pride", "Seeking Validation"],
  laws:["Compassion", "Forgiveness", "Generosity"],
  lines:[{r:1, line:"I give one thing away today and tell nobody.",
     past:"A kindness only counts if somebody sees it."},
    {r:1, line:"I stay warm to the person who can do nothing for me.",
     past:"Warmth is for people who can repay it."},
    {r:2, line:"I finish the favour before I look around to see who noticed.",
     past:"If nobody saw it, it did not happen."},
    {r:2, line:"I help in a room where nobody knows me and I leave my name out.",
     past:"My name on the help is what makes it worth doing."},
    {r:3, line:"I keep the gift quiet while someone else takes the credit for it.",
     past:"If I do not claim it, I lose it."},
    {r:3, line:"I stay warm for the whole hour with the room empty and no one watching.",
     past:"My warmth is for the audience."}]},
 {k:'RE', word:"Love",
  imp:{pos:{do:"You change your mind in front of people and do not defend the old view.", think:"You ask what it would change if the thing that cuts against you were true.", body:"Your head and jaw stay loose while you hear it out.", say:"You say \"that changes what I thought\" and stop there."},
       neg:{do:"You steer away from the place that would test the belief.", think:"You decide what it means before it has finished happening.", body:"Your jaw sets the moment someone disagrees.", say:"You answer before the other person has finished."}},
  marks:["Speaking To Be Right", "Dogma", "Condemnation", "Knowing Better Than God", "Denial Of Truth"],
  laws:["Unity", "Awareness", "Nature"],
  lines:[{r:1, line:"I say \u201cthat changes what I thought\u201d and I stop there.",
     past:"Changing my mind in front of people loses their respect."},
    {r:1, line:"I hear the whole sentence that disagrees with me before I answer.",
     past:"I already know where this is going."},
    {r:2, line:"I walk toward the place that would test what I hold.",
     past:"My view is safe only while nothing tests it."},
    {r:2, line:"I ask the person who disagrees what they saw that I did not.",
     past:"They are wrong because they disagree."},
    {r:3, line:"I let the thing that cuts against me stay in my chest for one minute before I reply.",
     past:"A view I hold has to be defended at once."},
    {r:3, line:"I drop a view I have defended for years while people watch, and I say what changed it.",
     past:"Being wrong in public removes me."}]},
 {k:'DE', word:"Will",
  imp:{pos:{do:"You name one want and stop when you have enough.", think:"You ask who else the want would serve.", body:"The pull low in your belly rises, peaks and falls within ten breaths.", say:"You say \"that is enough\" and put the plate or the phone down."},
       neg:{do:"You get it and reach for the next one within the hour.", think:"You decide having it will settle the wanting.", body:"Your belly stays tight after you have it.", say:"You say \"one more\" and keep going."}},
  marks:["Addiction", "Lust", "Hypersexuality", "Infatuation", "Obsession"],
  laws:["Temperance", "Detachment"],
  lines:[{r:1, line:"I name one want and say who else it would serve.",
     past:"A want is mine alone and serves only me."},
    {r:1, line:"I say \u201cthat is enough\u201d and put the plate or the phone down.",
     past:"One more will settle it."},
    {r:2, line:"I let the pull in my belly rise and fall for ten breaths without acting.",
     past:"The pull gets worse unless I feed it."},
    {r:2, line:"I give away the thing I wanted most this week to somebody who needs it.",
     past:"Having it is what ends the wanting."},
    {r:3, line:"I stay with the want after I have it and I do not reach for the next one.",
     past:"The next one will be the one that satisfies."},
    {r:3, line:"I follow the one want that points past me, on the day it costs me the other three.",
     past:"Every want has to be kept alive."}]},
 {k:'OR', word:"Order",
  imp:{pos:{do:"You set one rule others can lean on and keep it on the day it costs.", think:"You ask who is standing on this rule before you move it.", body:"Your throat is steady when you state the plan.", say:"You say the plan before it starts and write it down."},
       neg:{do:"You change the rule after others have built on it.", think:"You decide the plan only has to hold while you are watching.", body:"Your throat goes dry when you are asked to repeat the plan.", say:"You agree in the meeting and say something else afterwards."}},
  marks:["Manipulation Through Emotion", "Betrayal", "Deceit", "Lying", "Spiritual Language To Manipulate"],
  laws:["Justice", "Truth", "Transparency"],
  lines:[{r:1, line:"I say the plan out loud before it starts and I write it down.",
     past:"A plan only has to hold while I am watching."},
    {r:1, line:"I name one rule others can lean on and I say it to them.",
     past:"Rules are for other people to keep."},
    {r:2, line:"I keep the rule on the day it costs me.",
     past:"A rule can bend when it is inconvenient."},
    {r:2, line:"I ask who is standing on this rule before I change it.",
     past:"I can change the rule without telling anyone."},
    {r:3, line:"I tell the room the plan has changed before they build on the old one.",
     past:"It is easier to let them find out."},
    {r:3, line:"I say the same thing in the meeting and in the message afterwards.",
     past:"One person in the room and another in the message is just tact."}]},
 {k:'PO', word:"Power",
  imp:{pos:{do:"You do the same hard thing at the same hour and pay for it yourself.", think:"You ask what the small version is when the big one is not on offer.", body:"Your breath stays low in the belly while you work.", say:"You write one line on a missed day and nothing about what it says about you."},
       neg:{do:"Your standard is met with other people\u2019s time.", think:"You decide a day does not count unless you won it.", body:"Your upper stomach clenches when someone else sets the pace.", say:"You say \"somebody will cover it\" and move on."}},
  marks:["Competition", "Entitlement", "Need To Win", "Superiority", "Force"],
  laws:["Courage", "Responsibility", "Accountability"],
  lines:[{r:1, line:"I do the same hard thing at the same hour today.",
     past:"A standard is something other people help me meet."},
    {r:1, line:"I write one line on a missed day and nothing about what it says about me.",
     past:"A missed day proves I am weak."},
    {r:2, line:"I pay for my own standard with my own hours.",
     past:"Somebody will cover it."},
    {r:2, line:"I do the small version when the big one is not on offer.",
     past:"A day does not count unless I won it."},
    {r:3, line:"I keep my breath low in the belly while somebody else sets the pace.",
     past:"If I do not set the pace I lose."},
    {r:3, line:"I take the cost of a missed standard myself and I ask nobody to cover it.",
     past:"Costs belong to whoever is nearest."}]},
 {k:'PE', word:"Awareness",
  imp:{pos:{do:"You notice what you feel and name it without acting on it.", think:"You describe the situation as you would to the person in it.", body:"The space between your eyebrows stays soft while you look.", say:"You say what you see before you say what you make of it."},
       neg:{do:"You manage the gap between how you look and how you are.", think:"You read people as terrain to cross.", body:"Your face holds a shape that does not match your stomach.", say:"You edit how you are before it leaves your mouth."}},
  marks:["False Love", "Stage Performing", "Delusion", "Projection", "Distortion"],
  laws:["Presence", "Humility", "Equanimity", "Awareness"],
  lines:[{r:1, line:"I name what I feel before I act on it.",
     past:"If I name it I become it."},
    {r:1, line:"I say what I see before I say what I make of it.",
     past:"My reading of a person is the person."},
    {r:2, line:"I describe the situation to myself as I would to the person in it.",
     past:"People are terrain to cross."},
    {r:2, line:"I let my face match my stomach for one conversation.",
     past:"The version I run is safer than the real one."},
    {r:3, line:"I say how it is with me when someone asks and I do not edit it on the way out.",
     past:"I must manage the gap between how I look and how I am."},
    {r:3, line:"I keep the space between my eyebrows soft while someone tells me what I dislike.",
     past:"I have to react to stay safe."}]},
 {k:'TR', word:"Beauty",
  imp:{pos:{do:"You stop for the thing that moves you and stay with it before you explain it.", think:"You let it reach your chest before you decide what it means.", body:"Your chest opens and your breath drops while it lands.", say:"You tell one person what moved you, with no evidence attached."},
       neg:{do:"You wait at the edge of it until it can be proven.", think:"You prepare for the feeling instead of having it.", body:"Your chest stays braced while the moment goes past.", say:"You ask for more information about what you already feel."}},
  marks:["Closed Heart", "Cynicism", "Distrust", "Overanalysis", "Doubt"],
  laws:["Aesthetic Beauty", "Compassion", "Forgiveness", "Generosity"],
  lines:[{r:1, line:"I stop for the one thing that moves me and stay with it for three breaths before I explain it.",
     past:"I have to understand it before I let it move me."},
    {r:1, line:"I let what moves me land in my chest before I decide what it means.",
     past:"If I feel it before it is proved, I am a fool."},
    {r:2, line:"I take one step toward what moves me before I have proof that it is safe.",
     past:"I will go when I have enough information."},
    {r:2, line:"I tell one person what moved me and I attach no evidence.",
     past:"If I cannot prove it, I should not say it."},
    {r:3, line:"I keep my chest open while the beautiful thing and the loss are in it together.",
     past:"If I let it in, I will not be able to bear it."},
    {r:3, line:"I cross the threshold I have been measuring and I leave the measuring unfinished.",
     past:"I am not ready until I have checked everything."}]},
 {k:'CH', word:"Charge",
  imp:{pos:{do:"You walk or lift until the heat has somewhere to go, and nobody pays.", think:"You ask where the anger is in the body before you ask who caused it.", body:"Heat rises in your legs and belly and you stay on your feet.", say:"You say \"I need ten minutes\" and take them."},
       neg:{do:"You go off at somebody, or you go flat for the afternoon.", think:"You decide you are either fine or finished.", body:"Your belly locks, then your legs go heavy.", say:"You shout, or you stop talking."}},
  marks:["Fear", "Lethargy", "Panic", "Collapse", "Anger"],
  laws:["Non-Harm", "Patience"],
  lines:[{r:1, line:"I say \u201cI need ten minutes\u201d and I take them.",
     past:"I am either fine or finished."},
    {r:1, line:"I say where the anger sits in my body before I say who caused it.",
     past:"The anger belongs to whoever set it off."},
    {r:2, line:"I walk or lift until the heat has somewhere to go, and nobody pays.",
     past:"It has to go off at somebody or go flat."},
    {r:2, line:"I stay on my feet while the heat rises in my legs and belly.",
     past:"If I stay in it I will break something."},
    {r:3, line:"I keep my voice level while I tell someone what I will not do again.",
     past:"Saying it plainly means shouting or silence."},
    {r:3, line:"I let the charge end in an action and not in a freeze or a shout.",
     past:"There is no middle setting."}]},
 {k:'FL', word:"Flow",
  imp:{pos:{do:"You make the call you were holding and let the plan change.", think:"You ask what the day wants to do before you tell it what to do.", body:"Your jaw, shoulders and belly move when you ask them to.", say:"You say \"let us do it the other way\" and mean it."},
       neg:{do:"You hold one routine or grievance in place until it sours.", think:"You decide that moving it would be losing it.", body:"Your jaw is locked and your hands are shut.", say:"You tell the same complaint a fourth time."}},
  marks:["Control", "Possession", "Resistance", "Compulsion", "Avoidance Of Grief"],
  laws:[],
  lines:[{r:1, line:"I say \u201clet us do it the other way\u201d and I mean it.",
     past:"Moving the plan means losing it."},
    {r:1, line:"I ask what the day wants to do before I tell it what to do.",
     past:"A day goes where I hold it."},
    {r:2, line:"I make the call I have been holding.",
     past:"Waiting will keep it safe."},
    {r:2, line:"I drop one routine that has stopped feeding anyone.",
     past:"A routine is owed because I kept it."},
    {r:3, line:"I let the plan change in front of the people who built on it and I thank them.",
     past:"Changing the plan shows I was wrong."},
    {r:3, line:"I open my jaw, my shoulders and my hands while the old grievance is in the room.",
     past:"Letting go of it means it did not matter."}]},
 {k:'AL', word:"Duty",
  imp:{pos:{do:"You do what you said, and you do it without a grudge.", think:"You ask what you owe before you ask what it costs.", body:"Your spine feels long from the base of the back to the neck.", say:"You say \"I will\" only when you will."},
       neg:{do:"You know the rule and cross it because you want the thing more.", think:"You decide this one is an exception.", body:"Your spine slumps when the rule is read out.", say:"You give a good reason for the thing you should not have done."}},
  marks:["Lust", "Entitlement", "Excuse", "Hubris", "Knowing Better Than God"],
  laws:["Duty", "Responsibility"],
  lines:[{r:1, line:"I say \u201cI will\u201d only when I will.",
     past:"A promise is whatever sounds good when I say it."},
    {r:1, line:"I say the line I will hold today before the day starts.",
     past:"I can decide where the line is when I get there."},
    {r:2, line:"I do what I said without a grudge.",
     past:"Doing it grudgingly cancels it."},
    {r:2, line:"I keep a promise nobody would check.",
     past:"If nobody checks, it does not bind me."},
    {r:3, line:"I hold the line on the day I want the thing more.",
     past:"This one is an exception."},
    {r:3, line:"I give a plain reason and not a good one for the thing I should not have done.",
     past:"A good enough reason makes it right."}]},
 {k:'HO', word:"Non-resistance",
  imp:{pos:{do:"You find the one activity making the noise and stop it for the day.", think:"You ask what finishes by itself if you leave it.", body:"Your hands rest open and your breath runs on its own.", say:"You say \"I will wait\" and wait."},
       neg:{do:"You hurry to help and make it worse.", think:"You decide that whatever is whole needs one more fix.", body:"Your hands reach before you have decided to.", say:"You offer the fix nobody asked for."}},
  marks:["Force", "Need To Be Needed", "Interrupting", "Savior Complex"],
  laws:["Patience", "Detachment"],
  lines:[{r:1, line:"I say \u201cI will wait\u201d and I wait.",
     past:"If I do not help now it will fall apart."},
    {r:1, line:"I ask what finishes by itself if I leave it.",
     past:"Whatever is whole needs one more fix."},
    {r:2, line:"I stop the one activity making the noise for the day.",
     past:"Stopping it leaves a hole."},
    {r:2, line:"I leave the fix nobody asked for unsaid.",
     past:"Saying it is how I show I care."},
    {r:3, line:"I keep my hands open while someone else does it badly.",
     past:"I have to reach in before it goes wrong."},
    {r:3, line:"I let a finished thing stay finished and I walk away from it.",
     past:"One more change makes it better."}]},
 {k:'SA', word:"Light",
  imp:{pos:{do:"You hand on what you were given, and you keep none of the credit.", think:"You ask what the light is landing on, not how it looks on you.", body:"Your face and the back of your hands feel open to the air.", say:"You say it as it is, in one line, with the source named."},
       neg:{do:"You take it in and pass nothing on.", think:"You decide that what you were given is yours to keep.", body:"Your chest folds in around what you are holding.", say:"You tell it as if it started with you."}},
  marks:["Denial Of Light", "Distortion", "Nihilism", "Self-Exclusion", "Rejection Of Spirit"],
  laws:["Transparency"],
  lines:[{r:1, line:"I say it as it is, in one line, with the source named.",
     past:"It sounds better if it started with me."},
    {r:1, line:"I name who gave me the thing before I pass it on.",
     past:"What I was given is mine to keep."},
    {r:2, line:"I hand on what I was given this week to somebody who can use it.",
     past:"If I pass it on I have less."},
    {r:2, line:"I let the person I taught do it without me and I say it was theirs.",
     past:"My share has to be visible to count."},
    {r:3, line:"I keep none of the credit when the thing I passed on succeeds.",
     past:"Credit is what I am owed for being the source."},
    {r:3, line:"I say what was given to me on the day it costs me the look of having made it.",
     past:"Being the origin is the only safe place."}]},
 {k:'TU', word:"Truth",
  imp:{pos:{do:"You say the true thing once, in one sentence, and let the room go quiet.", think:"You ask what is so before you ask what it will cost.", body:"Your throat is open and your breath drops after you speak.", say:"You end the sentence where it ends, with no softener after it."},
       neg:{do:"You say the smaller thing to keep the room warm.", think:"You decide that saying it plainly means losing them.", body:"Your throat closes just before the sentence you meant.", say:"You say \"it is probably nothing\" about the thing that is something."}},
  marks:["Lying", "Excuse", "Denial Of Truth", "Self-Silencing", "Talking To Avoid Feeling"],
  laws:["Truth"],
  lines:[{r:1, line:"I say the true thing once, in one sentence, and I let the room go quiet.",
     past:"If I say it plainly I lose the room."},
    {r:1, line:"I end the true sentence where it ends and add no softener after it.",
     past:"A softened truth is still the same truth."},
    {r:2, line:"When the excuse starts in my mouth, I say what happened instead.",
     past:"An excuse protects the people I care about."},
    {r:2, line:"I tell the person the thing I have been telling everyone but them.",
     past:"It is kinder to say it behind their back."},
    {r:3, line:"I let them be angry at what I said and I keep my feet where they are.",
     past:"If they are angry, I was wrong to say it."},
    {r:3, line:"On the day my word costs me, I keep it and I say what it cost.",
     past:"A promise only binds me on the day it is easy."}]},
 {k:'NA', word:"Nature",
  imp:{pos:{do:"You tend what is growing, keep the hours it asks and pull on nothing.", think:"You ask what season this is before you ask what to do.", body:"Your breath follows the pace of the work and not the clock.", say:"You say \"it is not ready\" and leave it alone."},
       neg:{do:"You pull the shoot up to help it grow.", think:"You decide the season is the problem.", body:"Your hands grip while you wait.", say:"You say \"why is this taking so long\" every day."}},
  marks:["Force", "Perfectionism", "Rigidity", "Hubris", "Endless Seeking"],
  laws:["Nature", "Patience"],
  lines:[{r:1, line:"I say \u201cit is not ready\u201d and I leave it alone.",
     past:"Faster is better."},
    {r:1, line:"I ask what season this is before I ask what to do.",
     past:"The season is the problem."},
    {r:2, line:"I do only the work the slow thing asks today.",
     past:"More work today means faster growth."},
    {r:2, line:"I take my hands off it when the urge to pull comes.",
     past:"If I stop pulling it will stop growing."},
    {r:3, line:"I keep the hours it asks for a week and I add nothing.",
     past:"Effort is measured by how hard I pull."},
    {r:3, line:"I let something grow slower than I wanted and I do not ask why it is taking so long.",
     past:"A slow thing is a failing thing."}]}];
/* every key ever issued, retired ones included, so a record naming a retired
   teacher still validates. Read off the rows and never typed. */
var TEACH_KEYS_ALL=TEACH_ROWS.map(function(r){return r.k;});
function teachRow(k){
 for(var i=0;i<TEACH_ROWS.length;i++)if(TEACH_ROWS[i].k===k)return TEACH_ROWS[i];
 return null;}
/* THE ADDRESSES A POLE'S OPPOSITE IS MARKED AT, by the name every address
   carries (n.k), resolved against the 112 at the call and never at load, so
   this file does not depend on the order the node tables load in. A name that
   resolves to nothing is dropped here and caught by the gate, which is the
   honest place to catch it. */
function teachMarkIds(k){
 var r=teachRow(k); if(!r)return [];
 var out=[];
 r.marks.forEach(function(nm){
  for(var i=0;i<NODES.length;i++)if(NODES[i].k===nm){out.push(NODES[i].i);return;}});
 return out;}
/* ONE POLE, COMPOSED. Everything a surface needs about one teacher, read from
   the compass tables and TEACH_ROWS. The key is the pole key (IL, PO, FL, SA),
   never the name, because Jesus stands at two poles. `seat` is where the axis
   is read (null for a pole with no axis), `home` is where a seatless pole's
   own law sits, and `kind` says which of the three tables the pole came from
   so a surface chooses its sentence by what the pole is. */
function teachPole(k){
 var r=teachRow(k); if(!r)return null;
 var i, m=null, p=null, e=null;
 for(i=0;i<MIRROR.length;i++)if(MIRROR[i].k===k)m=MIRROR[i];
 for(i=0;i<PATHS.length;i++)if(PATHS[i].k===k)p=PATHS[i];
 for(i=0;i<POLES_EXTRA.length;i++)if(POLES_EXTRA[i].k===k)e=POLES_EXTRA[i];
 var x=m||p||e; if(!x)return null;
 return {k:k, who:x.up, word:r.word, q:x.q, engine:(m&&m.engine)||null,
  kind:m?'axis':(p?'path':'extra'),
  seat:m?m.seat:null, home:e?e.home:null,
  d:x.upd, ic:x.ic||null, ask:x.ask||'',
  from:m?'codex':(x.from||'codex'), src:x.src||null,
  opp:{nm:x.dn, d:x.dnd, ic:x.dic||null},
  imp:r.imp, marks:r.marks.slice(), laws:r.laws.slice(), lines:r.lines.slice(),
  retired:!!r.retired};}
/* THE ROSTER, as the person reads it: one entry a teacher, in display order,
   with the poles that teacher stands at. Jesus is one entry with two poles. */
function teachRoster(){
 var out=[], at={};
 TEACH_ORDER.forEach(function(k){
  var x=teachPole(k); if(!x||x.retired)return;
  if(at[x.who]===undefined){at[x.who]=out.length; out.push({who:x.who, poles:[k]});}
  else out[at[x.who]].poles.push(k);});
 return out;}
