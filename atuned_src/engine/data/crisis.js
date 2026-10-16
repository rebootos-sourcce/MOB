/* ============================================================
   THE CRISIS BUTTON'S WORDS AND NUMBERS, 16 October. His words: "Maybe [the
   crisis check] belongs in the pop-up, the welcome. Maybe it's an option. Is
   this a crisis? Hit that button. Tell me about it. Do you need immediate
   emergency contact, or would you like to talk it through? It's always a
   story."

   A BUTTON THE PERSON PRESSES, AND NOT A DETECTOR. On 9 October he deferred
   the automatic check, a phrase list reading what a person writes (parked on
   claude/b2a-crisis and claude/b2a-crisis2, not merged), and J0 in
   ui/onboard.js stays open for exactly that. Nothing here reads a word
   anybody types. It is three numbers and the sentences around them, shown
   when somebody says, by pressing, that this is a crisis.

   HERE AND NOT IN A RENDERER, because two surfaces print it: the app's panel
   (ui/crisis.js) and the funnel's quiz page, which carries engine.js and no
   ui module. One table, so a number corrected once is corrected on both, the
   rule funnel/quiz.html states for the engine it references rather than
   copies.

   EACH NUMBER CARRIES ITS SENTENCE, round PO's unpack rule: a bare 741741 is
   a symbol, so every row says what the number reaches and what happens when
   you use it, in one sentence, and tests/copy.js holds each sentence so none
   of them can be cut without the gate failing. They are United States
   numbers, and the panel says so beside them and names what to use instead,
   because outside the US they are not the numbers that answer.

   go is the row's links, [what the button says, the address]. tel: and sms:
   open the phone's own dialler or messages on a phone; on a desktop the
   number is still in the sentence as plain text, so nothing depends on the
   link working. sms: carries the keyword in body=, which iOS and Android
   both read; a phone that ignores it still opens the right number, and the
   sentence says what to type.

   THE KEYWORD IS IN SENTENCE CASE. The brief asked for "text HOME", and the
   service prints it in capitals, but all caps is ruled out of copy and the
   voice gate fails it. The line takes any case, so the sentence says "the
   word home", which a person can type as read, and the link still sends HOME
   for them. The button is "Text 741741", the same shape as "Text 988"
   beside it.
   ============================================================ */
const CRISIS_LINES=[
 {k:'988', go:[['Call 988','tel:988'],['Text 988','sms:988']],
  say:'Call or text 988 to reach the Suicide and Crisis Lifeline, where a trained person answers at any hour.'},
 {k:'741741', go:[['Text 741741','sms:741741?body=HOME']],
  say:'Text the word home to 741741 to reach the Crisis Text Line, where a trained person writes back at any hour.'},
 {k:'911', go:[['Call 911','tel:911']],
  say:'Call 911 if you are in danger now, for police, fire or an ambulance.'}];
/* THE PANEL'S WORDS, once, so the app and the quiz say the same thing. open is
   the button; h and q are his two lines as the build was asked for them; the
   two choices are verbs for what each does; where is the line beside the US
   numbers; story is the first line the Story box shows after Talk it through,
   his "It's always a story" said as a fact and then the one thing to do. */
const CRISIS_SAY={
 open:'Is this a crisis?',
 h:'Tell me about it.',
 q:'Do you need to reach someone right now, or would you like to talk it through?',
 reach:'Reach someone now',
 talk:'Talk it through',
 close:'Close',
 where:'These are US numbers. Outside the US, call your local emergency number.',
 story:'It is always a story. Write what happened, in your own words.'};
