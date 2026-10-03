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
var TUT={open:false, step:0, text:'', commit:null, deep:null, replay:false, parsed:null, plan:null, shown:-1, leaveT:null};
/* ============================================================
   THE STAGE, ROUND QJ. His words, on the first run's rebuild: "Continue full
   build in the style. For the funnel, onboarding, tutorial... Make this
   priority." This sheet was the last first run surface still opening as the
   old popup card over a dimmed app, which is exactly what the onboarding's
   welcome was before round QH took it full screen.

   SO IT STANDS ON THAT STAGE, AND NOT ON A COPY OF IT. obStage, obSwap,
   obCard, obGhost, obPushOut and obRailAt are ui/onboard.js's own: the far
   wash, the ring of the 112, the body with its seats, the arrival (the
   spine climbs, the seats pop as its tip passes, the outline pours from the
   crown, the ring winds in), the Field's 4.2 second breath at rest, the
   ghost out and the rise in on a change of step, the pulse up the spine,
   and the push through on the way out. Not one keyframe is new. What is the
   tutorial's own is its five poses, in shell/head.html under .tutx, and
   which seats it lights.

   THE LIGHT CARRIES THE ENTRY. A seat lights only where this entry put
   weight, read off the same commit the words on the card are read off: the
   two places What this found names, the one the chain names, and the plan's
   own addresses on Release and Flow. Nothing is lit before the commit,
   because nothing has been read. So the commit, which is the moment the
   words become charge in the field, is the moment the body lights, root to
   crown on the boot's beat, and a person can see where it landed with the
   words still rising beside it.

   REDUCED MOTION GETS THE END STATE: no arrival, no ghost, no camera, no
   breath, no pulse. Every one of those is already held under the stage's
   own reduced block, and the script paths all ask obCalm first.
   ============================================================ */
var TUT_N=5;
/* the rail's names: the storyboard's own, this file's header, in order */
var TUT_STEPNM=['Journal','Discover','Understand','Release','Flow'];

function tutOpen(replay){
 var h=document.getElementById('tutorial'); if(!h)return;
 TUT.open=true; TUT.step=0; TUT.text=''; TUT.commit=null; TUT.deep=null; TUT.replay=!!replay; TUT.parsed=null; TUT.plan=null;
 TUT.shown=-1;
 if(TUT.leaveT){ clearTimeout(TUT.leaveT); TUT.leaveT=null; }
 h.classList.remove('ob-leaving');
 /* a fresh stage on every open, so the arrival plays from its first frame */
 h.innerHTML=''; h.classList.remove('obx','obx-lit','obx-in-arrive');
 h.classList.add('tutx');
 if(typeof obStage==='function')obStage(h,TUT_N,'data-tut="skip"');
 /* the running app goes out of the picture while the stage is up */
 document.body.classList.add('tut-on');
 tutRender();
 h.style.display='flex';
 if(typeof obPenWidth==='function')obPenWidth(h);
 var f=h.querySelector('.obx-slot textarea,.obx-slot button'); if(f)f.focus({preventScroll:true});}
/* the login.js hook already calls tutorialOpen(); this is the real name,
   kept short for the five screens below that call it on themselves. */
function tutorialOpen(replay){ tutOpen(replay); }

var TUT_LEAVE_MS=520;
function tutClose(){
 var h=document.getElementById('tutorial'); if(!h)return;
 TUT.open=false; h.classList.add('ob-leaving');
 document.body.classList.remove('tut-on');
 /* the first run's own way out: the body goes forward past the camera */
 if(typeof obPushOut==='function')obPushOut(h);
 TUT.leaveT=setTimeout(function(){ TUT.leaveT=null; if(TUT.open)return;
  h.style.display='none'; h.classList.remove('ob-leaving','obx','tutx','obx-lit','obx-in-arrive');
  h.removeAttribute('data-ts'); h.removeAttribute('data-dir'); h.innerHTML=''; },TUT_LEAVE_MS);
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

/* THE CARD IS THE STAGE'S COLUMN NOW, round QJ: obCard's eyebrow, its
   headline a word to a masked line, the body, the actions. The five dots it
   carried are the stage's rail at the top of the screen, which fills as the
   run goes. nsteps is kept in the signature so no caller has to change. */
function tutCard(title,body,acts,nsteps){
 return obCard('Day one',title,body,acts);}

/* WHICH SEATS THIS STEP LIGHTS, read off what the card on the same step
   prints and nothing else. Seat names are the node's own .b, the band the
   word lit, the same name the stage's seats carry. */
function tutLitNow(){
 var s=TUT.step, c=TUT.commit, kept=(c&&c.ok&&c.k&&c.kept)||[], lit=[];
 var add=function(b){ if(b&&BANDS.indexOf(b)>=0&&lit.indexOf(b)<0)lit.push(b); };
 if(s===1){ add(kept[0]&&kept[0].b); add(kept[1]&&kept[1].b); }
 else if(s===2){ add(kept[0]&&kept[0].b); }
 else if(s>=3){
  var pl=TUT.plan;
  if(pl&&pl.ok)pl.addrs.forEach(function(i){ add(BY[i]&&BY[i].b); });
  else{ var off=(TUT.deep&&TUT.deep.offer&&TUT.deep.offer[0])||null;
   if(off&&kept.length)add(kept[0].b); }}
 return {lit:lit, pick:null, mark:null};}

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
     /* the body's row wears its seat's colour, the seat lit on the figure
        beside it (round QJ): the same place, said twice in one picture */
     .map(function(x,j){var sb=(j===2&&kept[0]&&BANDS.indexOf(kept[0].b)>=0)?kept[0].b:null;
       return '<div class="ob-g'+(sb?' ob-g-seat" style="--c:'+seatCol(sb):'')+'"><b>'+esc(x[0])+'</b>'
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
 /* ROUND QJ: onto the stage, through the first run's own change of step */
 if(typeof obStage==='function')obStage(h,TUT_N,'data-tut="skip"');
 var sw=obSwap(h,out,{s:s, shown:TUT.shown, attr:'data-ts', lit:tutLitNow(),
  rail:function(h){ obRailAt(h,TUT.step,TUT_N,TUT_STEPNM); }});
 TUT.shown=s;
 var ta=document.getElementById('tuttext');
 if(ta){ta.oninput=function(){
   var go=h.querySelector('.obx-slot [data-tut="commit"]'); if(go)go.disabled=!ta.value.trim();};
  ta.value=TUT.text; ta.focus({preventScroll:true});}
 else if(sw.moved&&!sw.arrive){ var hd=sw.card&&sw.card.querySelector('.ob-h'); if(hd)hd.focus({preventScroll:true}); }
 var f=sw.card&&sw.card.querySelector('.ob-scroll'); if(f)f.scrollTop=0;}

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
  if(ids.length&&typeof relPick==='function')
   relPick(ids,(TUT.commit&&TUT.commit.ok&&TUT.commit.t)?{story_t:TUT.commit.t}:null);
  return;}
 if(k==='field'){ tutClose(); if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.FIELD); return; }
 if(k==='ritual'){ tutClose(); if(typeof setTab==='function'&&typeof TAB!=='undefined')setTab(TAB.RITUAL); return; }
 if(k==='skip'||k==='done'){ tutClose(); return; }});
addEventListener('keydown',function(e){
 if(TUT.open&&e.key==='Escape')tutClose();});
