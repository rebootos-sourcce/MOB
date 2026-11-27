/* ============================================================
   ILLUSTRATIVE PAIRS. Mockup data, not product data.

   No reference person in engine/data/people.js carries avatar pairs, and
   nothing in the shipped product can write one (there is no entry surface;
   only a profile import reaches avatar.pairs). So these are written for
   the demonstration, in each person's own voice off their story bank in
   sim/stories.js, in the exact shape engine/avatar.js validates:
   {be, notbe}, both non empty strings under 200 characters.

   "be" is a value and has no address. "notbe" is a sentence about a bad
   day, and the real resolver (readSeat, ui/drills.js) parses it to a seat.
   James's first pair is the owner's own example, "I want to be a great
   public speaker".
   ============================================================ */
const PAIRS={
 James:[
  {be:'A great public speaker. I stand up and the room hears me.',
   notbe:'My chest is tight and my throat closes when I stand up in front of the board, so I read the slides.'},
  {be:'Present with my people when the news is bad.',
   notbe:'I felt nothing when we let forty people go and I left the room first.'},
  {be:'Honest with my doctor and my wife.',
   notbe:'I have told no one about my chest and I am ashamed of hiding it.'},
  {be:'Rested, for real, not managed.',
   notbe:'I am numb every evening and I call it discipline.'},
  {be:'Someone my team can bring bad news to.',
   notbe:'I am angry before they finish the sentence and they stop bringing it.'}],
 Angela:[
  {be:'Held, for once, instead of holding.',
   notbe:'I am so tired of being the one who understands everybody else.'},
  {be:'Choosing a partner who is good for me.',
   notbe:'I keep choosing the same kind of person and I am afraid it is who I am.'},
  {be:'Committed to one practice long enough to feel it land.',
   notbe:'I drop each modality after a month and feel ashamed that nothing stuck.'},
  {be:'Grieving what happened, instead of explaining it.',
   notbe:'I said everything happens for a reason at the funeral and felt sad for weeks.'}],
 Derek:[
  {be:'An athlete who listens to his body.',
   notbe:'I raced on a stress fracture and my shoulders were up by my ears the whole way.'},
  {be:'Calm with my family after a hard session.',
   notbe:'I am angry all the time and I snap at my kids when I get home.'},
  {be:'Someone who sleeps.',
   notbe:'I have not slept properly in eleven days and I am afraid to stop training.'},
  {be:'Feeling the last ten percent again.',
   notbe:'I am numb through the end of every race and I used to feel everything there.'}]};
if(typeof module!=='undefined')module.exports=PAIRS;
