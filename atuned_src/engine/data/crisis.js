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

   EACH NUMBER CARRIES ITS NAME, round PO's unpack rule: a bare 741741 is a
   symbol. Each row opens on the number and the service it reaches (nm), then
   says how to use it and who is there, in short sentences, from the review of
   these screens on 16 October: one long sentence per number buried the name
   of the service in its middle. 911 is named by what it sends, police, fire
   or an ambulance, the same shape as the other two, because "911. If you are
   in danger now." would have left the one number with no meaning beside it.
   tests/copy.js holds each line so none can be cut without the gate failing.

   WHERE THEY ANSWER. 988 answers in the United States and in Canada; 741741
   and 911 are the United States (911 is Canada's too). The panel no longer
   says "These are US numbers", which told a Canadian their 988 did not
   work; it says where 988 also works and what to use anywhere else.

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
/* ONE FILLED BUTTON, 16 October, from the review of these screens. Every link
   in the numbers view was the same outlined pill, so a person who had just
   asked to reach somebody met six equal choices and no first one. Call 988 is
   the first: it answers a call or a text at any hour for anything short of
   danger now, which 911 is for. The third place in a go entry marks it, and
   it is data and not a renderer's choice so the app and the quiz fill the
   same button. Exactly one entry in the table carries it. */
const CRISIS_LINES=[
 {k:'988', nm:'Suicide and Crisis Lifeline', go:[['Call 988','tel:988',true],['Text 988','sms:988']],
  say:'988, Suicide and Crisis Lifeline. Call or text, any hour. A trained person answers.'},
 {k:'741741', nm:'Crisis Text Line', go:[['Text 741741','sms:741741?body=HOME']],
  say:'741741, Crisis Text Line. Text the word home. A trained person writes back.'},
 {k:'911', nm:'police, fire or an ambulance', go:[['Call 911','tel:911']],
  say:'911, police, fire or an ambulance. If you are in danger now.'}];
/* THE PANEL'S WORDS, once, so the app and the quiz say the same thing. open is
   the button; h and q are his two lines as the build was asked for them; the
   two choices are verbs for what each does; journal is the line under the
   question that says where Talk it through goes and who sees it; where is the
   line under the numbers; story is the first line the Story box shows after
   Talk it through, his "It's always a story" said as a fact and then the one
   thing to do, which since 16 October names the present too: a person in a
   crisis is often writing about what is happening, not what happened.

   NO PERSON READS IT, and it is a claim about this build that has to stay
   true. Checked 16 October: the journal is kept in this browser, profile sync
   is off (PROFILE_SYNC_ENABLED, ui/auth.js, "not part of alpha"), and no call
   the app makes carries an entry: the voice is given the release's own
   lines, never the box. DECISIONS.md's privacy ruling expects the story to
   leave the device one day ("The thing that leaves the device is the story
   itself"), and a practitioner can be granted sight; the day either ships,
   this line is wrong. tests/onboarding2.js fails while the line is printed
   and sync is on, so that day cannot pass quietly. */
const CRISIS_SAY={
 open:'Is this a crisis?',
 h:'Tell me about it.',
 q:'Do you need to reach someone right now, or would you like to talk it through?',
 reach:'Reach someone now',
 talk:'Talk it through',
 close:'Close',
 journal:'Talk it through opens your journal. No person reads it.',
 where:'988 also works in Canada. Elsewhere, call your local emergency number.',
 story:'It is always a story. Write what is happening, or what happened.'};
