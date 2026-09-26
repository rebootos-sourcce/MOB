/* ============================================================
   THE WORDS AROUND THE NUMBERS on the verdict sheet. The numbers are all
   computed in verdict.js from shots/facts.json; nothing here states a
   measured figure by hand except where it quotes the run it was read from.

   THE REACTIONS ARE SIMULATED. One model reading the six persona records
   (engine/data/people.js, RESEARCH-icp.md), each person's own grid level off
   the engine, and each person's measured first screens. Nobody said any of it.
   ============================================================ */
module.exports={
 headline:nm=>nm+' wins. It is the only layout that tells the story and puts the action on the first screen at both widths.',
 lede:'He graded round EL a D minus on five things: how information displays, what sits above the fold, how it looks, whether it tells a story, and whether a glance says what to do. '
  +'Four new layouts were built over the real build, on the same mechanic, and measured against the graded one with the six reference people, each loaded with their own story bank and their own pairs, at a desk and on a phone. A fifth, Told, was then built from what that run measured, and measured the same way. '
  +'Every release below ran on the shipped release card.',
 scoring:'Each of his five criteria became numbers the run can read, scored 0 to 10 at each width and averaged. Above the fold: controls on the first screen (4 or fewer scores full, 16 scores nothing) and words on it (40 or fewer full, 160 nothing). '
  +'Glance: ideal, their words and the action all on the first screen. Story: those three in reading order. What to do: words read before the action (10 or fewer full, 90 nothing) and how long before it is on screen (3 seconds scores nothing). '
  +'The loop: the release result shown where the person is looking, the next step shown after it, and a typed journal entry\'s result in view. Looks: the figure\'s share of the first screen (45 percent scores full) and whether anything moves on landing, which he asked for. '
  +'No bare figures: a number standing alone with no word, the house rule that a reading is not a score. The weights are equal and are a choice, written here so the ranking can be argued with.',
 research:'<ul>'
  +'<li><b>Oura, the Today tab.</b> Their 2024 redesign built the home screen around "one big thing", the single score or insight to act on now, with the rest of the scores as small shortcuts across the top. Taken: one lead, and the other two in the way as small marks, never three equal cards. '
  +'Source: ouraring.com/blog/new-oura-app-experience.</li>'
  +'<li><b>WHOOP, the home screen.</b> Three dials at the top (sleep, recovery, strain), then My Day and My Plan underneath, redesigned twice since 2023 toward one scrolling view. Taken: the dial as a ring whose arc is the value, which is already this product\'s glass bar grammar. Not taken: three equal dials, which is what the Three layout tests and what the run shows costs words. '
  +'Source: whoop.com, the all-new WHOOP home screen.</li>'
  +'<li><b>Apple Activity rings.</b> Three rings, one goal each day, and, in the words of the team that built them, a ring is either closed or it is not, which is what makes it glanceable. Taken: the seat\'s weight drawn as an arc and never printed on the first screen. '
  +'Sources: Apple Human Interface Guidelines, Activity rings; apple.com, close your rings.</li>'
  +'<li><b>Duolingo, the path.</b> The 2022 home screen replaced a tree of choices with one path and one next step. Taken: a single lit next station in Loop and one action in every layout. Not taken: removing the person\'s choice of which seat, which the product\'s own ruling on the pairs forbids. '
  +'Source: blog.duolingo.com, new home screen design.</li>'
  +'<li><b>His own product.</b> The glass bar\'s ring buttons (proto/glassbar) for every seat mark: a ring, the seat\'s own glyph inside it, the value as an arc. The Field wheel\'s seat arcs, charge ticks and the glow on the hot seat for the ring itself. Nothing on these pages is a new visual language.</li>'
  +'</ul><p class="rests">Read through search on 26 September. The summaries, not full page reads.</p>',
 found:'<div class="finding"><p><b>Two of the six highest ideals read to no seat.</b> Angela\'s second sentence, "I am so tired of being the one who understands everybody else", and Derek\'s, "I raced on a stress fracture and my shoulders were up by my ears", both return nothing from the real resolver (readSeat). Checked sentence by sentence: "my chest is tight" resolves, "my jaw is tight" resolves, "shoulders up by my ears" alone does not, and "tired" is not read. So the one pair a person states as their highest ideal can be the one the instrument cannot place, and every layout here has to say so and fall back to the heaviest pair. The journal\'s own error says "Say what your body did, and where", and a sentence that does exactly that about the shoulders still lands nowhere.</p></div>'
  +'<div class="finding"><p><b>A stranger who writes a pair meets nothing held.</b> Measured on all six layouts: a new person writes the pair on the first screen, it resolves to a seat, and that seat carries no weight because no story has been read yet, so there is nothing to release and the action does not appear. The pair only gets weight after the journal. So on this page a first run has to start with the journal and not with the pair, which is the opposite of what every empty state here asks, round EL\'s included. This touches milestone M2, a first session that ends in a change.</p></div>'
  +'<div class="finding"><p><b>The page is not the whole screen, and the rest is most of the count.</b> The best layouts here put 2 to 12 controls on the page\'s own first screen. The whole desk screen, rails included, carries 81 to 107 whatever the centre does, almost all of it the left rail\'s tiles; on a phone the shell spends 253 pixels, 30 percent of the first screen, before the page starts. The standing 57 to 71 choices per screen problem is in the rails, and no layout of the centre can fix it.</p></div>',
 questions:'<div class="finding"><p><b>One question, and the drawing is in the dock.</b> When the ideal a person stated and the heaviest thing in their way sit at different seats, which one leads the page? It differs for two of the six: James said he is becoming a great public speaker (the heart) and the heaviest weight is his evenings (the sacral); Sofia said held (the heart) and the heaviest is reading herself (the sacral). For Diane and Marcus the two are the same seat, and for Angela and Derek the ideal has no seat, so it cannot lead.</p>'
  +'<ul><li><b>Heaviest leads</b>, as Told is built. The instrument names the biggest cost first, which is its whole claim. Costs: the page opens on "I am numb every evening" under "Becoming a great public speaker", and the simulated James read that as the product not listening.</li>'
  +'<li><b>Ideal leads</b>, as Story does. The page starts from the sentence his own mechanic starts from. Costs: the first release may not be where the most weight is, so the first change a person sees can be smaller.</li></ul>'
  +'<p>Both are one press apart in the dock at the foot of the page: open Told, choose James, and press Heaviest leads or Ideal leads.</p></div>',
 who:{Sofia:'41, somatic practitioner. Reads bodies for a living; closes the tab on being handled.',
  Diane:'46, founder. Runs on a ranked list; rest reads to her as failure.',
  Marcus:'44, creative director. Sees what is wrong with anything in four seconds.',
  Angela:'36, seeker, six modalities. Wants it to mean something; her ideal has no seat.',
  Derek:'39, endurance. Wants the dashboard and the number; his ideal has no seat.',
  James:'57, C-suite. Least nonsense, one decision; said public speaker.'},
 react:{
  Sofia:{graded:['hold','The ring is the instrument. Then four more sections under it, each asking me for something.','Fourteen controls on the first screen, seven bare figures.'],
   ring:['buy','That is a body, drawn. I saw where it sits before I read a word.','The figure is 42 percent of the first screen.'],
   three:['hold','Three cards read like a to do list. I do not work from lists.','The ring shrinks to a key.'],
   story:['hold','Well put. I had to read it to see it.','The figure is 14 percent of the first screen.'],
   loop:['hold','I see the loop. I would have to learn it before I could use it.','On her phone between clients the action is below the drawing.'],
   told:['buy','My words, then where it sits, then one thing. I would show a client this.','All three on the first screen at both widths.']},
  Diane:{graded:['resist','Numbers, a list, a wheel, a summary. Which of these is the thing?','Eight bare figures at a desk; on a phone, no action on the first screen.'],
   ring:['hold','Release it, in the middle. Release what, and why?','The reason sits under the ring, after the button.'],
   three:['buy','Heaviest first, one button. That is how I run a company.','One action, ranked list.'],
   story:['hold','Good sentence. I waited for the button.','The action arrives 1.4 seconds after landing.'],
   loop:['hold','The next step is lit, good. On my phone it is under the drawing.','Glance 2 of 3 on a phone.'],
   told:['buy','What I said, what is in the way, the button, in that order, on my phone.','Her ideal and her heaviest are the same seat.']},
  Marcus:{graded:['resist','Five sections fighting for the same screen, and a zero in the middle of it.','He sees it in four seconds, as the owner did.'],
   ring:['hold','Finally something to look at. The button comes before the reason.','Reading order fails on all six.'],
   three:['resist','Three boxes of text, and the ring is a thumbnail.','The figure is 3 percent of the first screen.'],
   story:['hold','The type is right. Where is the picture?','The figure is 14 percent.'],
   loop:['hold','A clever diagram. It explains the product instead of showing me.','The loop takes the hero space.'],
   told:['buy','Read it down: what you want, what stops you, where. Then the ring pays it off.','Order holds and the figure is the largest on the page.']},
  Angela:{graded:['hold','A pretty ring. I do not know what the zero means.','The centre reads 0 percent cleared on day one.'],
   ring:['hold','Beautiful. It told me to release before it told me why.','Order fails.'],
   three:['hold','It is a list of my problems.','Three quotes on the first screen.'],
   story:['buy','It started with what I said I want, and it read my own words back to me.','Her ideal has no seat, so the second line says so and moves on.'],
   loop:['hold','Journal, release, ritual, record. I have done six of these loops.','The frame is the method, not her.'],
   told:['buy','My words, then my body, then one thing. It feels made for me.','Same story as Story, with the ring.']},
  Derek:{graded:['hold','Numbers, ranked. Where do I press?','On a phone the first screen carries no action.'],
   ring:['hold','Looks like a watch face. What is the number?','No figure is printed on the first screen, on purpose.'],
   three:['buy','Ranked, heaviest first, one button. That is a training plan.','His pick.'],
   story:['resist','Too many words before the button.','73 words before the action at a desk.'],
   loop:['hold','A circle diagram. On my phone the button is under it.','Glance 2 of 3 on a phone.'],
   told:['hold','Clear, and fast. I still want the number.','Level 5, and the hardest sell on the grid.']},
  James:{graded:['resist','A title, a percentage at zero, a list, a wheel, a summary, masks. Board packs are shorter.','Fifteen controls on the first screen at a desk.'],
   ring:['hold','One button. I will press it when I know what it does.','The why sits under the ring.'],
   three:['hold','Rested is first. I said public speaker.','Heaviest leads, not his stated ideal.'],
   story:['buy','It opened on what I said I want and quoted me. Then one thing, today.','Story leads with the ideal\'s own seat, the heart.'],
   loop:['resist','A process diagram. I have consultants for that.','The loop is the hero.'],
   told:['hold','The layout is right. It led with my evenings, and I said public speaker.','Press Ideal leads in the dock to see it his way. The one question below.']}},
 verdict:function(agg,score,rank){
  var nm={graded:'Graded',ring:'Ring',three:'Three',story:'Story',loop:'Loop',told:'Told'};
  var w=rank[0], s=function(L){return (Math.round(score[L].total*100)/10).toFixed(1);};
  var a=function(L,W){return agg[L][W];};
  return '<p><b>'+nm[w]+' wins, at '+s(w)+' of 10, ahead of '+rank.slice(1).map(function(L){return nm[L]+' '+s(L);}).join(', ')+'.</b></p>'
   +'<p>'+nm[w]+' was not one of the four drawn first. It was built from what the first run measured. Ring won the first screen and the look, and failed the story on all six people at both widths: its action sat in the centre of the ring, above the words saying why. Story told it in order and had almost no figure, and its action arrived '+(a('story',1600).at/1000).toFixed(1)+' seconds after landing. Three read in order and led with a list, with the ring shrunk to '+Math.round(a('three',1600).fig)+' percent of the screen. Loop put the core loop in the hero space, and on a phone its action fell below the drawing for all six. Told is the ring as the hero with the sentence moved above it: who you said you are becoming, your own words on a bad day, then the ring, with the one action in its centre on the seat that holds those words.</p>'
   +'<p>Measured on Told: the ideal, the person\'s own words and the action on the first screen for '+a(w,1600).storyTold+' of 6 at a desk and '+a(w,390).storyTold+' of 6 on a phone, in that order; '+Math.round(a(w,1600).ctl)+' controls on the page\'s first screen at a desk and '+Math.round(a(w,390).ctl)+' on a phone, against '+Math.round(a('graded',1600).ctl)+' and '+Math.round(a('graded',390).ctl)+' for the graded layout; no bare figure; the ring '+Math.round(a(w,1600).fig)+' percent of the first screen at a desk and '+Math.round(a(w,390).fig)+' on a phone; the seats draw in and the seats in the way breathe the moment the page opens, which is the movement he asked for.</p>'
   +'<p>One change came from measuring Told itself: on the first run, after a release on a phone, the next step sat under the ring and 1 of 6 saw it without scrolling. The result and the ritual now take the sentence slot above the ring once a release lands; measured again, '+a(w,390).relNext+' of 6 on a phone and '+a(w,1600).relNext+' of 6 at a desk.</p>'
   +'<p>Where it still loses: the two level 5 people did not buy it. Derek wanted a ranked list and a number, which is Three; James wanted his own ideal first, which is the one question below. BUYERS.md says levels 4 and 5 are the hardest sell and the largest population, and this panel agrees with it.</p>'
   +'<p><b>Next real step</b>, as every round: five people, twenty minutes each, on their own phones, on Told.</p>';}};
