/* ============================================================
   THE AGE LADDER. The second way in, and it is the owner's own.

   "Another way I found my limiting beliefs is by age, because I
   couldn't think of anything that I identified with. That didn't
   make any sense to me. So I started reflecting on things I grew
   up with, toys, games, cartoons, movies, and realised I had
   accumulated a bunch of stuff from the age of three to eighteen
   that I had overly identified with."

   The Inferno is the way in for a person who cannot see themselves
   as bad. This is the way in for a person who cannot see
   themselves as identified, which is most people, because an
   identification that is working does not feel like one.

   THE MECHANIC, in his words: "The mind sticks to anything that it
   defends. Then once it's stuck, the bias is set."

   The worked example is the one that found it. At fourteen he
   argued Superman against the Hulk and took the Hulk, not because
   he cared, but because he was not a DC person. Five years later,
   a different person, the same argument, and he auto picked the
   Hulk because he already had his arguments ready. Again in his
   twenties. Again in his thirties. Then he stopped and said: I do
   not care about either of these. I never have. And I keep taking
   the same position. He let it go and has not talked about it
   since.

   So the tool is not a memory exercise. It is a defence audit. The
   question is never what you liked. It is what you would still
   argue for, and whether you actually care.
   ============================================================ */
const AGE_LO=3, AGE_HI=18;
const AGES=[
 {a:3,  k:'the first thing',      q:'What did you carry everywhere and would not be parted from?'},
 {a:4,  k:'the first building',   q:'What did you make things out of, and what did you always make?'},
 {a:5,  k:'the first favourite',  q:'What was your favourite, and what was the one you were against?'},
 {a:6,  k:'the first collection', q:'What did you collect, and what made one of them better than another?'},
 {a:7,  k:'the first character',  q:'Who did you pretend to be, and who did you refuse to be?'},
 {a:8,  k:'the first side',       q:'What did you take a side on, at school or at home, that other children took the other side of?'},
 {a:9,  k:'the first mastery',    q:'What were you the one who was good at it, and who was better?'},
 {a:10, k:'the first team',       q:'What were you part of, and who were they against?'},
 {a:11, k:'the first taste',      q:'What did you decide was good, and what did you decide was for other people?'},
 {a:12, k:'the first argument',   q:'What did you argue about with a friend, and which corner did you take?'},
 {a:13, k:'the first machine',    q:'What did you learn to use, and what did you think of the ones who used the other thing?'},
 {a:14, k:'the first position',   q:'What position did you hold, and who were you holding it against?'},
 {a:15, k:'the first belonging',  q:'What were you one of, and what did being one of them mean you were not?'},
 {a:16, k:'the first work',       q:'What did you get good at, and what did that let you look down on?'},
 {a:17, k:'the first plan',       q:'What were you going to be, and who decided that?'},
 {a:18, k:'the first leaving',    q:'What did you take with you, and what did you make sure to leave?'}];
/* The three questions that turn an answer into a finding. Order is load
   bearing: defence first, then cost, then care. Asking care first lets a
   person answer for the person they would like to be. */
const AGE_TEST=[
 {k:'defend', q:'Would you still argue its corner today?'},
 {k:'cost',   q:'Has taking that side ever cost you anything?'},
 {k:'care',   q:'Do you actually care, or do you just always take this position?'}];
/* defend yes and care no is the finding. It is the only combination that is,
   because a position you hold and mean is a preference, and a position you
   hold and do not mean is a groove. */
function ageFinding(defend,care){
 if(!defend)return {found:false,say:'Not defended. Nothing is stuck here.'};
 if(care)return {found:false,say:'Defended and meant. That is a preference, not a bias.'};
 return {found:true,say:'Defended and not meant. The mind stuck to it because it argued for it, '
  +'and once it was stuck the bias was set. This one is a groove, not a taste.'};}
const AGE_WORKED='At fourteen the argument was Superman against the Hulk. The Hulk got picked, '
 +'not because he was better, but because the other person was a DC person. Five years later, a '
 +'different person, the same argument, and the Hulk got picked again because the arguments were '
 +'already loaded. Again in the twenties. Again in the thirties. Then: I do not care about either '
 +'of these. I never have. And I keep taking the same position. It was let go and has not come up '
 +'since.';
