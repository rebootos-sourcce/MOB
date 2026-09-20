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

   WHAT IT CAPTURES, and why that is not a form. One answer: where
   they felt the second word. That is a seat, it is the first real
   parameter the instrument has about them, and it is obtained by
   having them feel something rather than by asking them to
   describe themselves. Everything else a form would ask for is
   somewhere else in the product already.
   ============================================================ */
var OB={open:false, step:0, felt:null, neutral:null, charged:null, replay:false};

/* THE TWO WORDS. The first has no quality of its own and the second does, and
   the contrast between them is the whole proof. They are drawn from his own
   nine rather than invented, so the charged word is a word this instrument
   actually measures, and a person who goes looking for it later finds it.

   The neutral word is deliberately dull and concrete. A neutral word that is
   secretly evocative proves nothing. */
const OB_NEUTRAL=['table','pavement','envelope','stairwell','doorframe'];
function obPick(){
 /* the charged word is the axis this person is most likely to feel, which on
    a blank profile is the commonest one rather than a claim about them. A
    person who has entered something gets their own heaviest. */
 var live=null;
 try{ live=CHILD.map(function(c){return {c:c,v:+(S.charge[c.nm]||0)};})
   .sort(function(a,b){return b.v-a.v;})[0]; }catch(e){}
 var c=(live&&live.v>0)?live.c:(CHILD.filter(function(x){return x.nm==='Fear';})[0]||CHILD[0]);
 OB.neutral=OB_NEUTRAL[Math.floor(Math.random()*OB_NEUTRAL.length)];
 OB.charged=c;}

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
 obPick(); obRender();
 h.style.display='flex';
 /* the sheet takes focus, because a person arriving here has nothing else to
    do and a keyboard user should not have to find it */
 var f=h.querySelector('button'); if(f)f.focus();}
function obClose(){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=false; h.style.display='none'; h.innerHTML='';
 try{ if(CURP){ CURP.onboarded=true; pSave(); } }catch(e){}
 if(typeof render==='function')render();}

/* ---- the steps ---- */
function obCard(eye,title,body,acts){
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'
  +'<span class="pm-eye">'+esc(eye)+'</span>'
  +'<h2 class="ob-h">'+esc(title)+'</h2>'
  +body
  +'<div class="ob-acts">'+acts+'</div>'
  +'<div class="ob-dots">'+[0,1,2,3].map(function(i){
    return '<span class="ob-dot'+(i===OB.step?' on':'')+'"></span>';}).join('')+'</div>'
  +'</div>';}

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
   +'<p class="ob-p">No judgment. Nothing here grades you. This one is for you, '
   +'and whatever you find in it, you are not carrying it alone.</p>'
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
  out=obCard('What this is','We walk you through you.',
   '<p class="ob-p">Most of the strain we have agreed to call normal is making '
   +'us ill. This shows you where it sits in the body, what it costs you, and '
   +'what to do about it.</p>'
   +'<p class="ob-p">It reads one thing: the body mind complex. How you run, '
   +'which patterns are running, and where they are held.</p>'
   +'<div class="ob-grid">'
   +[['You write what happened','in your own words, not a questionnaire'],
     ['It finds where that sits','a place in the body, not a label'],
     ['You clear what is there','one address at a time'],
     ['And you watch it move','the same numbers, over months']]
    .map(function(x){return '<div class="ob-g"><b>'+esc(x[0])+'</b>'
      +'<span>'+esc(x[1])+'</span></div>';}).join('')
   +'</div>'
   +'<p class="ob-p ob-dim">Nothing here is invented. Where it has not read '
   +'something it says so rather than guessing. The work is yours, which is the '
   +'good news, because it means it is available.</p>',
   '<button type="button" class="btn pri" data-ob="next">Then try one thing</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===2){
  /* THE SIGNAL TEST. The one interactive thing, and it is the somatic opener
     he named. Two words, read slowly, and the body answers before the mind
     does. The instruction is the whole practice: there is nothing to get
     right, which is said out loud because a person who thinks they are being
     tested will perform rather than feel. */
  out=obCard('The signal test','Say these to yourself, slowly.',
   '<p class="ob-p">Read the first word. Let it land. Notice whether anything '
   +'in your body changes, and do not go looking for it, just let it be there '
   +'or not.</p>'
   +'<div class="ob-word ob-word-n">'+esc(OB.neutral)+'</div>'
   +'<p class="ob-p ob-dim">Most people get nothing from that one. That is the '
   +'point of it. Now the second.</p>'
   +'<div class="ob-word ob-word-c">'+esc(OB.charged.nm.toLowerCase())+'</div>'
   +'<p class="ob-p">Where did that one land? There is no right answer, and '
   +'nothing at all is an answer.</p>'
   +'<div class="ob-seats">'
   +BANDS.map(function(b){
     return '<button type="button" class="ob-seat'+(OB.felt===b?' on':'')
      +'" data-obseat="'+esc(b)+'" style="--c:'+seatCol(b)+'">'+esc(b)+'</button>';}).join('')
   +'<button type="button" class="ob-seat'+(OB.felt==='none'?' on':'')
   +'" data-obseat="none">Nothing</button></div>',
   '<button type="button" class="btn pri" data-ob="next"'
   +(OB.felt?'':' disabled')+'>'+(OB.felt?'Next':'Choose one to go on')+'</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else {
  /* WHAT IT READ, AND WHAT IT DOES NOT CLAIM. One signal is one signal. The
     product's whole claim is that it does not invent a reading, and the first
     screen a person meets is the worst possible place to break that. */
  var said;
  if(OB.felt==='none'){
   said='<p class="ob-p">Nothing, and that is a real answer. Sometimes the '
    +'word is not yours, and sometimes the signal is quiet because it has been '
    +'quiet for a long time. Both of those are things this instrument reads, '
    +'and neither of them is a failure.</p>';
  }else{
   var same=(OB.charged.seat===OB.felt);
   said='<p class="ob-p">You felt <b>'+esc(OB.charged.nm.toLowerCase())+'</b> at '
    +'the <b>'+esc(String(OB.felt).toLowerCase())+'</b>. '
    +(same?'That is where this instrument reads it too, which means your felt '
        +'sense and the measurement agree before you have entered anything.'
       :'This instrument usually reads that one at the '
        +esc(String(OB.charged.seat).toLowerCase())+', and yours went elsewhere. '
        +'Yours is the one that counts. The measurement follows what you feel, '
        +'not the other way round.')
    +'</p>';}
  out=obCard('What just happened',
   'A word with no power over you moved your body.',
   said
   +'<p class="ob-p">That is the whole mechanism, and you have just watched it '
   +'work. A pattern is a word, a picture or a moment that still has a hold '
   +'somewhere. This finds where, and gives you a way to put it down.</p>'
   +'<p class="ob-p ob-dim">Nothing has been written to your record. You can run '
   +'this again any time from your profile.</p>',
   '<button type="button" class="btn pri" data-ob="done">Go in</button>');
 }
 h.innerHTML=out;
 var f=h.querySelector('.ob-card'); if(f)f.scrollTop=0;}

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
