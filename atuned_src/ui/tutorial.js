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

   ROUND PS: IT NOW REACHES A FIRST RELEASE. This used to describe the
   release step and stop; "Go to Ritual" was the only button that went
   anywhere. The gap was named directly: "neither the onboarding nor the
   Day One tutorial reaches a first release today." The Release step below
   now hands the real offer's node to relPick, ui/release.js's own one
   release entry every other door in the product uses, never a second
   engine, so a person who presses Begin on day one is in the real release
   card, running the real walker, for the real charge this entry actually
   carries.

   J0, SAID HERE TOO, BECAUSE IT IS THE SAME GAP ATUNED_SRC/UI/ONBOARD.JS
   NAMES. tutCommit below is the first place a stranger's own words, typed
   on day one, are handed to parseStory. No distress check of any kind
   stands ahead of it. See onboard.js's own header for why nothing is
   added here that only looks like one.
   ============================================================ */
var TUT={open:false, step:0, text:'', commit:null, deep:null, replay:false, parsed:null, plan:null};

function tutOpen(replay){
 var h=document.getElementById('tutorial'); if(!h)return;
 TUT.open=true; TUT.step=0; TUT.text=''; TUT.commit=null; TUT.deep=null; TUT.replay=!!replay; TUT.parsed=null; TUT.plan=null;
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
  out=tutCard('Let’s look at something from your journal.',
   '<p class="ob-p">Write one thing. A sentence or two is enough. Not a '
   +'summary of your life, just something real from today or recently, the '
   +'kind of thing you would actually write in here.</p>'
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
   body='<p class="ob-p">Nothing in that one lit anything the engine could '
    +'name. That happens, and it is not a problem with what you wrote. Some '
    +'entries are quiet.</p>'
    +'<p class="ob-p ob-dim">Longer entries, or ones with a feeling named in '
    +'them, usually give it more to find. You can always write another in '
    +'the Story tab later.</p>';
  }else{
   body='<p class="ob-p">You wrote:</p>'
    +'<p class="ob-p ob-dim">&ldquo;'+esc(c.text.length>220?c.text.slice(0,220)+'…':c.text)+'&rdquo;</p>'
    +'<p class="ob-p">This separates into its own components. What stood out '
    +(kept[0]?tutSeatLine(kept[0]):'landed')+'.</p>'
    +(kept[1]?'<p class="ob-p">And a second place, '+tutSeatLine(kept[1])+'.</p>':'')
    +'<p class="ob-p ob-dim">That is Discover: not labelling you, revealing '
    +'what is actually there.</p>';}
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
  var c=TUT.commit, d=TUT.deep, kept=(c&&c.kept)||[], off=(d&&d.offer&&d.offer[0])||null;
  /* THE FIRST RELEASE'S SIZE, F5: the same plan and the same sentence as the
     onboarding bridge (ui/onboard.js, obMini), so both doors into a first
     release open the ruled twelve lines and say the true count. */
  var pl=TUT.plan=(off&&kept.length&&typeof obMini==='function')?obMini(obImprints(TUT.parsed)):null;
  var go=!!(pl&&pl.ok);
  var body;
  if(off&&kept.length){
   body='<p class="ob-p">This entry is heavy enough to show up in your Field '
    +'as something to work with: at the <b>'+esc(off.region||off.address||'')
    +'</b>, named <b>'+esc(off.axis)+'</b>'
    +(off.replacement?', with <b>'+esc(off.replacement)+'</b> waiting as its replacement':'')
    +'.</p>'
    +'<p class="ob-p ob-dim">'+esc(off.because[0])+'</p>'
    +'<p class="ob-p">The release protocol does not tell you to let it go. '
    +'It knows the story, the pattern and where it sits, and it picks a way '
    +'to work with exactly that. This one is real: pressing Begin opens it '
    +'on what this entry just wrote.</p>'
    +(go?obMiniSay(pl,typeof journeyRead==='function'?journeyRead(CURP).first:true)
     :(typeof obMiniWhy==='function'&&obMiniWhy(pl)?'<p class="ob-p">'+obMiniWhy(pl)+'</p>':''));
  }else{
   body='<p class="ob-p">This particular entry did not carry enough charge '
    +'to name a release yet. That is fine, most days will have one that '
    +'does, and nothing is lost by writing a quiet one.</p>';}
  /* THE REAL HAND OFF, round PS. kept's own node ids, read exactly as the
     mirror in onboard.js reads them, never a second engine and never a
     guess built from off's own axis name: relPick takes node ids and kept
     already carries them. */
  out=tutCard('Release',body,
   (off&&kept.length&&go
     ?'<button type="button" class="btn pri" data-tut="release">Begin the release</button>'
       +'<button type="button" class="btn" data-tut="next">Not now</button>'
       +'<button type="button" class="btn" data-tut="field">See it in your Field</button>'
     :'<button type="button" class="btn pri" data-tut="next">Next</button>'));
 }
 else {
  out=tutCard('Flow',
   '<p class="ob-p">Insight and release are not the end of it. Flow turns '
   +'what just happened into something repeatable: a practice tied to this '
   +'exact pattern, not a generic habit.</p>'
   +'<p class="ob-p ob-dim">Noticing the moment a pattern starts, returning '
   +'attention to the body, working the same release again. The ritual '
   +'builder holds what is yours to practice.</p>',
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
 TUT.parsed=ST_PARSED; TUT.plan=null;
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
 if(k==='release'){
  /* the plan's addresses, never every address the entry read (F5) */
  var pl=TUT.plan||(typeof obMini==='function'?obMini(obImprints(TUT.parsed)):null), ids=(pl&&pl.ok)?pl.addrs:[];
  tutClose();
  if(ids.length&&typeof relPick==='function')relPick(ids);
  return;}
 if(k==='field'){ tutClose(); if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.FIELD); return; }
 if(k==='ritual'){ tutClose(); if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.RITUAL); return; }
 if(k==='skip'||k==='done'){ tutClose(); return; }});
addEventListener('keydown',function(e){
 if(TUT.open&&e.key==='Escape')tutClose();});
