/* ============================================================
   ONBOARDING. Humble and warm, and it has them do exactly one
   thing.

   Every line of this is his ruling and the wording of the rulings
   is kept where it is his.

   "Onboarding, humble, warm. This is for you. No one's coming to
   save you. Save yourself. That's what this tool does. It helps
   you recognise the patterns that impair your success and make
   you mentally, physically and spiritually weak." Speak to their
   pain. Inviting, welcoming, they are not alone, this is here to
   help. AND WE DO NOT DO MECHANICAL, which settles the collision
   between this and the instrument's own voice: the instrument is
   mechanical about measurements and this is not a measurement.

   "The somatic opener, the signal test, should be on the
   onboarding." It is the one thing it asks them to do, and it is
   interactive because he ruled onboarding has to capture
   something rather than be read.

   "Same onboarding for both arrivals." One flow, no branch on
   where they came from.

   "The tutorial lives in the profile, toggleable and replayable,
   and it does not spend real charge." So does this. Nothing here
   writes to the nine axes, nothing here is a reading, and it can
   be run again from the account area any time.

   WHAT IT CAPTURES, and why that is not a form. Round MP replaced the
   original neutral/charged word draw with his own breath and
   awareness script: think yes ten times, think no ten times, compare
   the two at the throat. What is captured is only whether the two
   felt different, yes, no or nothing, never a seat name: "remove all
   the solar plex, sacral, I don't want any of that there in this
   onboarding." The point stands the same as it always did, obtained
   by having them feel something rather than by asking them to
   describe themselves.
   ============================================================ */
/* THE AUTOMATIC OPEN IS OFF. Ruled 20 September: "let's turn off onboarding
   for now." Off means a stranger is not met by a sheet, not that the flow is
   deleted: every step below still exists, the account area still replays it,
   and the gate still walks all four steps through obOpen(true). One flag, read
   in one place, so turning it back on is a single word and not an archaeology
   exercise. */
var OB_AUTO=false;
var OB={open:false, step:0, felt:null, replay:false};

/* THE SIGNAL TEST IS A BREATH EXERCISE NOW, ROUND MP. His own script,
   replacing the neutral/charged word draw entirely: "the signal test is
   simple, yes, no, say it to yourself... think yes ten times, see where
   it feels, see what the quality is, note its nature, think no ten times,
   feel its quality, note its nature, compare the difference between the
   two." Nothing here reads S.charge or CHILD any more, and OB.felt now
   holds 'yes', 'no' or 'none' rather than a seat name: there is no seat
   in this exercise to hold. */

/* THE FIGURE, AT REST. Ruled: "show, not tell, Japanese Zen, we do not have to
   go super text heavy," and separately, "when I come to this page off the
   funnel I need to be welcomed, there is something here that needs to be like,
   these people see me."

   Text cannot do that and a stock illustration would be a lie. So the welcome
   carries the same column the boot just drew: seven seats on a spine with a
   gold halo over the crown, standing still. A person has watched it assemble
   four seconds ago, and meeting it again at rest is the product saying this is
   the thing, and it is you, without a sentence.

   Drawn here rather than shared with the boot because the boot sheet is
   removed from the document and this one has to outlive it. */
function obFigure(){
 var y=[160,140,120,100,80,60,40];
 var col=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
 return '<svg class="ob-fig" viewBox="0 0 200 178" aria-hidden="true">'
  +'<ellipse class="ob-fig-h" cx="100" cy="21" rx="13" ry="4.4"/>'
  +'<line class="ob-fig-s" x1="100" y1="160" x2="100" y2="40"/>'
  +y.map(function(yy,i){
    return '<circle class="ob-fig-d" cx="100" cy="'+yy+'" r="4.6" '
     +'style="fill:'+seatCol(col[i])+';animation-delay:'+(0.1+i*0.07).toFixed(2)+'s"/>';}).join('')
  +'</svg>';}
function obOpen(replay){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=true; OB.step=0; OB.felt=null; OB.replay=!!replay;
 h.classList.remove('ob-leaving');
 obRender();
 h.style.display='flex';
 /* the sheet takes focus, because a person arriving here has nothing else to
    do and a keyboard user should not have to find it */
 var f=h.querySelector('button'); if(f)f.focus();}
/* THE HANDOFF TO THE FIELD IS A FADE, NOT A CUT, ROUND MP: "there needs to
   be a transition between the last onboarding screen and the field." The
   sheet's own CSS transition (see .ob-leaving in head.html) plays first,
   then the sheet is actually removed once it has had time to finish; a
   person who somehow skips ahead before it ends is still left with a sheet
   that is at least invisible and non-interactive, never a stuck one. */
var OB_LEAVE_MS=520;
function obClose(){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=false; h.classList.add('ob-leaving');
 setTimeout(function(){ h.style.display='none'; h.classList.remove('ob-leaving'); h.innerHTML=''; },OB_LEAVE_MS);
 /* EVERY WRITE THAT CAN FAIL REPORTS, and this one did not.

    It ignored what pSave returned and swallowed any throw into an empty
    catch. `account.js` does the same call correctly one file over: it checks
    the return and reports through status(). So if storage is full or blocked,
    the flag never persisted, nothing said so, and the onboarding reopened on
    every single launch with no explanation a person could act on. A flow that
    will not close and will not say why is the worst shape a first run can
    take.

    It says so now, and it says the one thing a person can do about it. The
    sheet still closes either way, because trapping somebody inside it to
    punish a storage failure helps nobody. */
 try{
  if(CURP){ CURP.onboarded=true;
   if(!pSave()&&typeof status==='function')
    status('This browser would not save. The first run will open again.','fail'); }
 }catch(e){
  if(typeof status==='function')
   status('This browser would not save. The first run will open again.','fail'); }
 if(typeof render==='function')render();}

/* ---- the steps ---- */
/* THE CARD NOW CARRIES THE SAME GROUND THE FIELD DOES, ROUND MP: "redesign
   this so it's visually appealing, see what you can pull from the field
   page." .ob-wash is the boot sheet's own seven seat colours (bx-wash in
   body.html, same hex values) at a fraction of its strength, so the door
   and the instrument behind it read as one world rather than a plain
   sheet dropped over it. .ob-fig-wm is the same standing figure obFigure
   draws, held very faint behind every card rather than shown once at full
   strength on the welcome screen alone. */
function obCard(eye,title,body,acts){
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-fig-wm" aria-hidden="true">'+obFigure()+'</div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">'+esc(eye)+'</span>'
  +'<h2 class="ob-h">'+esc(title)+'</h2>'
  +body
  +'<div class="ob-acts">'+acts+'</div>'
  +'<div class="ob-dots">'+[0,1,2,3].map(function(i){
    return '<span class="ob-dot'+(i===OB.step?' on':'')+'"></span>';}).join('')+'</div>'
  +'</div></div>';}

function obRender(){
 var h=document.getElementById('ob'); if(!h)return;
 var s=OB.step, out='';
 if(s===0){
  /* THE WELCOME. Ruled twice, and the second ruling moved it.

     It opened on "nobody is coming to save you," which is his sentence and a
     true one, and it is the wrong first sentence. He said: "I want to be
     greeted, I want to be welcomed. This is a mirror of the person. We are
     going to be showing them their inside. We do not want to be cold. We just
     want to let them know, hey, this is you, and it is okay. No judgment."

     So the hard sentence moves one screen in, where it belongs, and the first
     screen is a figure and eleven words. Show, not tell. Everything that used
     to be here is still in the product and none of it is said first. */
  out=obCard('Welcome','This is you, and it is okay.',
   obFigure()
   /* HIS TWO SENTENCES, AND THEN IT STOPS. "No judgment. Nothing here grades
      you." is the ruling and it stands. A third clause had been added to it,
      "you are not carrying it alone", which answers a fear nobody has raised
      on this screen and claims companionship this product does not provide:
      it is not a coach, a friend or a guide. Silence is a copy decision. */
   +'<p class="ob-p">No judgment. Nothing here grades you. This one is for you.</p>'
   +'<p class="ob-p ob-dim">Two minutes. One thing to try. Nothing to fill in.</p>',
   '<button type="button" class="btn pri" data-ob="next">Come in</button>'
   +'<button type="button" class="btn" data-ob="skip">Not now</button>');
 }
 else if(s===1){
  /* HIS SENTENCE, AND IT IS THE ONE THAT EARNS THE PRODUCT. "The stress that
     we condition as normal is actually making us sick, and this tool shows you
     how and where, and it gives you the what and the how." It is said second
     rather than first, because it is a claim and a claim needs somebody
     already in the room.

     And the thing it reads is named: the body mind complex. His term, kept
     because it says what it is. */
  /* A MIRROR, NOT A GUIDE. "We walk you through you" is a guide claim and it
     is the only place in the product that speaks as we. His own sentence for
     what this is, kept as he says it: everything that is running you, from the
     top to the bottom. */
  out=obCard('What this is','Everything that is running you, top to bottom.',
   /* V21, speak to a ten year old. "The strain we have agreed to call
      normal" moves back toward his own sentence, which was already plain:
      the stress we treat as normal is making us sick. The body mind complex
      is his term and stays, said once in words a child has. */
   '<p class="ob-p">Most of the stress we call normal is making us sick. This '
   +'shows you where it sits in your body, what it costs you, and what to do '
   +'about it.</p>'
   +'<p class="ob-p">It reads one thing: the body mind complex, your body and '
   +'your mind working as one. How you run, which patterns are running, and '
   +'where in your body they sit.</p>'
   +'<div class="ob-grid">'
   /* TWO OF THESE FOUR DEFINED A THING BY WHAT IT IS NOT, on the first
      screen a person sees, in the file that runs antithesis at five times the
      house rate. The replacements are positive and concrete, and the first is
      copy this product already ships in the story box. */
   +[['You write what happened','the day, in your own words'],
     ['It finds where that sits','one exact spot in your body'],
     ['You release what is there','one spot at a time'],
     ['And you watch it move','the same numbers, over months']]
    .map(function(x){return '<div class="ob-g"><b>'+esc(x[0])+'</b>'
      +'<span>'+esc(x[1])+'</span></div>';}).join('')
   +'</div>'
   /* "which is the good news" is the writer telling a person how to feel
      about a fact. The fact is the sentence. */
   +'<p class="ob-p ob-dim">Nothing here is made up. If it does not know '
   +'something, it says so. The work is yours.</p>',
   /* a control names what it does, and it starts on the verb. "Then" is
      narration, and nobody says it pressing a button. */
   '<button type="button" class="btn pri" data-ob="next">Try one thing</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===2){
  /* THE SIGNAL TEST, ROUND MP, HIS OWN SCRIPT, REPLACING THE WORD DRAW
     ENTIRELY. "The signal test is simple, yes, no, say it to yourself...
     this is a neurosomatic product, meaning the story you create
     conditions a body, one impacts the other and vice versa." No seat
     names anywhere in this screen, his own ruling: "remove all the solar
     plex, sacral, I don't want any of that there." The capture is
     Yes / No / Nothing, never a disabled Next with no other way through,
     the exact trap he hit: "I can't click next to go, I can only click
     solar." Nothing is disabled here; Nothing is itself a real answer, on
     the same honest-empty rule the reflection screen already keeps. */
  out=obCard('The signal test','Say yes. Say no.',
   '<p class="ob-p">This product works with the body and the mind '
   +'together. A thought changes what your body does, and what your body '
   +'does changes the thought back.</p>'
   +'<p class="ob-p">Sit down. Put both feet on the floor. Take ten slow breaths.</p>'
   +'<p class="ob-p">When you are ready, bring your attention to your '
   +'throat.</p>'
   +'<p class="ob-p">Think <b>yes</b>, ten times. Notice what that feels '
   +'like there.</p>'
   +'<p class="ob-p">Now think <b>no</b>, ten times. Notice what that '
   +'feels like.</p>'
   +'<p class="ob-p">Compare the two. Did they feel different?</p>',
   '<div class="ob-seats">'
   +[['yes','Yes'],['no','No'],['none','Nothing']].map(function(x){
     return '<button type="button" class="ob-seat'+(OB.felt===x[0]?' on':'')
      +'" data-obseat="'+x[0]+'">'+esc(x[1])+'</button>';}).join('')
   +'</div>'
   +'<button type="button" class="btn pri" data-ob="next"'
   +(OB.felt?'':' disabled aria-describedby="ob-need"')+'>Next</button>'
   +(OB.felt?'':'<span id="ob-need" class="ob-need">Pick one to go on.</span>')
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else {
  /* WHAT IT SAYS, SHARPENED, ROUND MP: "you felt anticipation, actually
     that doesn't even apply, it's just yes, no." There is no seat and no
     word left to name, only whether the two felt different. */
  var said;
  if(OB.felt==='none'){
   said='<p class="ob-p">Nothing stood out, and that is a real answer. '
    +'Sometimes it takes stillness to notice. This works with quiet as '
    +'well as loud.</p>';
  }else{
   said='<p class="ob-p">You noticed a difference between yes and no. '
    +'Neither one is a word with any power of its own. What moved was '
    +'your body.</p>';}
  out=obCard('What just happened',
   OB.felt==='none'?'Nothing moved this time.':'A thought moved your body.',
   said
   +'<p class="ob-p">'+(OB.felt==='none'?'':'That is the whole idea. ')
   +'Words like anxious, overwhelmed, burned out or depressed do the same '
   +'thing somewhere in you. This finds where, and gives you a way to '
   +'work with it.</p>',
   '<button type="button" class="btn pri" data-ob="done">Go in</button>');
 }
 h.innerHTML=out;
 var f=h.querySelector('.ob-scroll'); if(f)f.scrollTop=0;}

/* ---- one listener for the whole sheet ---- */
addEventListener('click',function(e){
 if(!OB.open)return;
 var t=e.target&&e.target.closest?e.target:null; if(!t)return;
 var seat=t.closest?t.closest('[data-obseat]'):null;
 if(seat){ OB.felt=seat.getAttribute('data-obseat'); obRender(); return; }
 var b=t.closest?t.closest('[data-ob]'):null; if(!b)return;
 var k=b.getAttribute('data-ob');
 if(k==='next'){ if(OB.step===2&&!OB.felt)return; OB.step++; obRender(); return; }
 if(k==='back'){ OB.step=Math.max(0,OB.step-1); obRender(); return; }
 if(k==='skip'||k==='done'){ obClose(); return; }});
/* escape leaves, because a sheet a person cannot dismiss is a sheet that has
   stopped being an invitation. */
addEventListener('keydown',function(e){
 if(OB.open&&e.key==='Escape')obClose();});
