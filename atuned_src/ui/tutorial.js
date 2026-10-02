/* ============================================================
   THE DAY ONE TUTORIAL. Round NF, his own ruling at round NE: "the day
   one tutorial has to start with the journal, right, journal is the
   beginning of the journey." DESIGN-onboarding-narrative.md section 7
   through 13 is the storyboard this walks: Discover, Play folded into
   Discover's own framing since the tutorial is one entry and not a
   session, Understand, Release, Flow.

   WHAT THIS IS NOT: a simulated reading built from invented categories.
   Every number and name on these screens comes from the real engine,
   read off the exact same commit the Story tab's own Apply button
   makes (ui/storyui.js's stCommit, factored out for this). A person's
   first entry is a real entry, not a rehearsal, so it is written to
   their field once, for real, the moment they continue past it.

   THE TUTORIAL LIVES IN THE PROFILE, TOGGLEABLE AND REPLAYABLE, same
   rule as onboarding, ui/account.js's own line: "and it does not spend
   real charge." That line is true of the sheet itself, never of the
   entry typed into it: the entry is real and costs whatever any entry
   costs. What is free to repeat is walking someone through what an
   entry does, not the entry's own effect.
   ============================================================ */
var TUT={open:false, step:0, text:'', commit:null, deep:null, replay:false};

function tutOpen(replay){
 var h=document.getElementById('tutorial'); if(!h)return;
 TUT.open=true; TUT.step=0; TUT.text=''; TUT.commit=null; TUT.deep=null; TUT.replay=!!replay;
 h.classList.remove('ob-leaving');
 tutRender();
 h.style.display='flex';
 var f=h.querySelector('button'); if(f)f.focus();}
/* the login.js hook already calls tutorialOpen(); this is the real name,
   kept short for the five screens below that call it on themselves. */
function tutorialOpen(replay){ tutOpen(replay); }

var TUT_LEAVE_MS=520;
function tutClose(){
 var h=document.getElementById('tutorial'); if(!h)return;
 TUT.open=false; h.classList.add('ob-leaving');
 setTimeout(function(){ h.style.display='none'; h.classList.remove('ob-leaving'); h.innerHTML=''; },TUT_LEAVE_MS);
 /* EVERY WRITE THAT CAN FAIL REPORTS, the same lesson onboard.js's own
    obClose carries: a flag that silently fails to save reopens the sheet
    on every launch with no explanation a person can act on. */
 try{
  if(CURP){ if(!CURP.ui||typeof CURP.ui!=='object')CURP.ui={}; CURP.ui.tutorialSeen=true;
   if(!pSave()&&typeof status==='function')
    status('This browser would not save. The tutorial will open again.','fail'); }
 }catch(e){
  if(typeof status==='function')
   status('This browser would not save. The tutorial will open again.','fail'); }
 if(typeof render==='function')render();}

function tutCard(title,body,acts,nsteps){
 var n=nsteps||5;
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">Day one</span>'
  +'<h2 class="ob-h">'+esc(title)+'</h2>'
  +body
  +'<div class="ob-acts">'+acts+'</div>'
  +'<div class="ob-dots">'+Array.from({length:n}).map(function(_,i){
    return '<span class="ob-dot'+(i===TUT.step?' on':'')+'"></span>';}).join('')+'</div>'
  +'</div></div>';}

/* a node's own fields, read exactly as the engine stores them: .b is the
   seat the word lit (a band name, "Heart"), .k is the word itself, .cf is
   the fetter family the word resolved to. Nothing here is invented. */
function tutSeatLine(n){
 if(!n)return '';
 return 'at your <b>'+esc(n.b||'')+'</b>, around the word &ldquo;'+esc(n.k||'')
  +'&rdquo;, named <b>'+esc(n.cf||'')+'</b>';}

function tutRender(){
 var h=document.getElementById('tutorial'); if(!h)return;
 var s=TUT.step, out='';
 if(s===0){
  /* THE TITLE WAS "Let's look at something from your journal", which is the
     line that says a thing is starting (V1), and the body defined the entry by
     what it is not (V10, "not a summary of your life, just something real").
     It says what to do now, and what kind of thing counts. */
  out=tutCard('Write one thing from your journal.',
   '<p class="ob-p">A sentence or two is enough. Something real from today or '
   +'recently, the kind of thing you would write in here.</p>'
   +'<div class="ob-f"><textarea id="tuttext" rows="4" placeholder="What happened, and what it was like."></textarea></div>',
   '<button type="button" class="btn pri" data-tut="commit">Continue</button>'
   +'<button type="button" class="btn" data-tut="skip">Skip the tutorial</button>');
 }
 else if(s===1){
  var c=TUT.commit, kept=(c&&c.kept)||[];
  var body;
  /* 21.I1, round NZ: stCommit now keeps an entry that read as nothing
     instead of refusing it, so c.ok is true here even with nothing caught.
     The honest empty copy below still needs c.k, the count it actually
     found, not just that the entry was kept. */
  if(!c||!c.ok||!c.k){
   /* HONEST EMPTY, the same rule the signal test already keeps: nothing
      caught is a real answer, not a failure to paper over. */
   /* THE EMPTY READING ASKS ONE QUESTION, AND IT IS HIS: "Where does it land
      in your body?" Ruled, in place of "where do you feel it", which asks for
      a feeling and gets a label. It is a place a person can point at, and the
      reading is placed by exactly that. It stays honest: nothing was caught,
      and the line says so before it asks. */
   body='<p class="ob-p">Nothing in that one lit anything the engine could '
    +'name. Some entries are quiet.</p>'
    +'<p class="ob-p">Where does it land in your body?</p>'
    +'<p class="ob-p ob-dim">Write that in the Story tab, and there is more '
    +'for it to find.</p>';
  }else{
   body='<p class="ob-p">You wrote:</p>'
    +'<p class="ob-p ob-dim">&ldquo;'+esc(c.text.length>220?c.text.slice(0,220)+'…':c.text)+'&rdquo;</p>'
    +'<p class="ob-p">Your words split into parts. What stood out '
    +(kept[0]?tutSeatLine(kept[0]):'landed')+'.</p>'
    +(kept[1]?'<p class="ob-p">And a second place, '+tutSeatLine(kept[1])+'.</p>':'')
    +'<p class="ob-p ob-dim">That is Discover. It shows what is there.</p>';}
  out=tutCard('What this found',body,
   '<button type="button" class="btn pri" data-tut="next">Next</button>');
 }
 else if(s===2){
  var c=TUT.commit, d=TUT.deep, kept=(c&&c.kept)||[], off=(d&&d.offer&&d.offer[0])||null;
  var body;
  if(!c||!c.ok||!c.k){
   body='<p class="ob-p">With nothing named yet, there is no chain to draw '
    +'from this one. The next entry that lands somewhere will have one.</p>';
  }else{
   body='<p class="ob-p">A situation can trigger a story. The story can move '
    +'the body. The body can shape behaviour. The behaviour can repeat the '
    +'situation.</p>'
    +'<div class="ob-grid">'
    +[['Situation', c.text.length>60?c.text.slice(0,60)+'…':c.text],
      ['Story', kept[0]?kept[0].cf:'not named'],
      ['Body response', kept[0]?kept[0].b:'not named'],
      ['What it costs', off?off.because[0]:'not enough here yet to say']]
     .map(function(x){return '<div class="ob-g"><b>'+esc(x[0])+'</b>'
       +'<span>'+esc(x[1])+'</span></div>';}).join('')
    +'</div>'
    +'<p class="ob-p ob-dim">This is not just this one moment. Something runs '
    +'through it, and this is what the Field and the Story tab track over '
    +'time.</p>';}
  out=tutCard('How it runs through you',body,
   '<button type="button" class="btn pri" data-tut="next">Next</button>');
 }
 else if(s===3){
  var d=TUT.deep, off=(d&&d.offer&&d.offer[0])||null;
  var body;
  if(off){
   body='<p class="ob-p">This entry is heavy enough to show up in your Field '
    +'as something to work with: at the <b>'+esc(off.region||off.address||'')
    +'</b>, named <b>'+esc(off.axis)+'</b>'
    +(off.replacement?', with <b>'+esc(off.replacement)+'</b> waiting as its replacement':'')
    +'.</p>'
    +'<p class="ob-p ob-dim">'+esc(off.because[0])+'</p>'
    +'<p class="ob-p">The release protocol does not tell you to let it go. '
    +'It knows the story, the pattern and where it sits, and it picks a way '
    +'to work with exactly that.</p>';
  }else{
   body='<p class="ob-p">This particular entry did not carry enough charge '
    +'to name a release yet. That is fine, most days will have one that '
    +'does, and nothing is lost by writing a quiet one.</p>';}
  out=tutCard('Release',body,
   '<button type="button" class="btn pri" data-tut="next">Next</button>'
   +(off?'<button type="button" class="btn" data-tut="field">See it in your Field</button>':''));
 }
 else {
  out=tutCard('Flow',
   /* THE LOOP CLOSES HERE, AND SAYS SO. "It is a circle, never a list": a last
      card that ends on Done reads as the fourth step being the end. Flow turns
      what just happened into a practice tied to this pattern, and the practice
      is what the next entry starts from. Said in the card's own words, so the
      person who presses Done leaves holding a circle and not a finished list. */
   '<p class="ob-p">Flow turns what just happened into a practice tied to this '
   +'exact pattern.</p>'
   +'<p class="ob-p ob-dim">Notice the moment a pattern starts. Bring your '
   +'attention back to your body. Work the same release again. The ritual '
   +'builder holds what is yours to practice.</p>'
   +'<p class="ob-p ob-dim">Then you write again, and it goes round.</p>',
   '<button type="button" class="btn pri" data-tut="ritual">Go to Ritual</button>'
   +'<button type="button" class="btn" data-tut="done">Done</button>');
 }
 h.innerHTML=out;
 var ta=document.getElementById('tuttext');
 if(ta){ta.oninput=function(){
   var go=h.querySelector('[data-tut="commit"]'); if(go)go.disabled=!ta.value.trim();};
  ta.value=TUT.text; ta.focus();}
 var f=h.querySelector('.ob-scroll'); if(f)f.scrollTop=0;}

/* ---- the one commit this sheet makes, through the real path ---- */
function tutCommit(){
 var ta=document.getElementById('tuttext'); if(!ta)return;
 var v=ta.value; TUT.text=v;
 if(!v.trim())return;
 /* the exact two lines the Story tab's own textarea runs on every
    keystroke, run once here instead of on each one. */
 ST_TEXT=v; ST_PARSED=v.trim()?parseStory(v):null;
 var r=stCommit();
 TUT.commit=r;
 if(r.ok){
  TUT.deep=(typeof sniffStory==='function')?sniffStory(r.text):null;
 }
 TUT.step=1; tutRender();}

addEventListener('click',function(e){
 if(!TUT.open)return;
 var t=e.target&&e.target.closest?e.target:null; if(!t)return;
 var b=t.closest?t.closest('[data-tut]'):null; if(!b)return;
 var k=b.getAttribute('data-tut');
 if(k==='commit'){ tutCommit(); return; }
 if(k==='next'){ TUT.step++; tutRender(); return; }
 if(k==='field'){ tutClose(); if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.FIELD); return; }
 if(k==='ritual'){ tutClose(); if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.RITUAL); return; }
 if(k==='skip'||k==='done'){ tutClose(); return; }});
addEventListener('keydown',function(e){
 if(TUT.open&&e.key==='Escape')tutClose();});
