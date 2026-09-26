/* ============================================================
   ILLUSTRATIVE PAIRS FOR ALL SIX. Mockup data, not product data.

   James, Angela and Derek are taken unchanged from proto/avatar/seats/pairs.js
   (round EL). Sofia, Diane and Marcus had none, and the simulation needs all
   six, so theirs are written here the same way: in each person's own voice off
   their story bank in sim/stories.js and their `says` line in
   engine/data/people.js, in the exact shape engine/avatar.js validates.

   The FIRST pair of each person is read as their stated highest ideal, the
   one his mechanic starts from ("I want to be a great public speaker"). Every
   second sentence was checked against the real resolver (readSeat) by
   probe.js before any layout was drawn, so no pair here resolves to nothing
   unless probe.js says so.
   ============================================================ */
const BASE=require('../seats/pairs.js');
const PAIRS={
 Sofia:[
  {be:'Held, the way I hold everyone else.',
   notbe:'I have not been held in four years and I feel alone and sad.'},
  {be:'As clear with myself as I am with a client.',
   notbe:'I can read my clients in a minute and I feel lost and numb when I try to read myself.'},
  {be:'Rested, by something sleep can reach.',
   notbe:'I am afraid there will be nothing left of me by the evening.'},
  {be:'Steady with a client who pushes me.',
   notbe:'I am angry with a client and I am ashamed of it.'}],
 Diane:[
  {be:'A founder who can rest without earning it.',
   notbe:'Rest feels like a moral failure and I am ashamed when I stop.'},
  {be:'Honest with my team about the money.',
   notbe:'I am terrified the round does not close and my jaw is tight from the moment I wake up.'},
  {be:'Someone who apologises the same day.',
   notbe:'I snapped at my cofounder in front of the team and I felt disgusted with myself.'},
  {be:'Finished at a reasonable hour.',
   notbe:'I am exhausted and I cannot stop, and I feel sad that nobody sees it.'}],
 Marcus:[
  {be:'A director who lets a good idea live.',
   notbe:'I killed a good idea today because it was not mine and I felt disgusted with myself.'},
  {be:'Straight with people about the timeline.',
   notbe:'I lied about the timeline again and my throat closes before the conversation.'},
  {be:'Kind to the junior, out loud.',
   notbe:'I am ashamed of how I spoke to the junior and my face goes hot when I think of it.'},
  {be:'Interested in my own work again.',
   notbe:'Nothing I made this year interests me and I am numb when I look at it.'}],
 James:BASE.James, Angela:BASE.Angela, Derek:BASE.Derek};
if(typeof module!=='undefined')module.exports=PAIRS;
