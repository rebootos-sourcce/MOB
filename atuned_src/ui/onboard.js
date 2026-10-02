/* ============================================================
   ONBOARDING, ROUND PS. The three reviews (REVIEW-onboarding/) and three
   rounds of mockup (mockups/onboarding-v2/) converged on one flow: arrive,
   the twelve starting points, settle, feel, body, story, a mirror with a
   correction path, then a bridge into the release. The owner watched the
   mockup's video and asked to "update the onboarding and tutorial" rather
   than ask for another design, so this ports that flow into real code
   rather than drawing a new one.

   WHAT IS PORTED AND WHAT IS NOT, same rule storyui.js states for its own
   port of a prototype. The mockup's canvas Field, its 112 tick ring and its
   choreographed motion are a standalone animation built to pitch a feel; none
   of that is a document this product's engine can be asked to move for real,
   so it is not ported. What is ported is the sequence, the twelve starting
   points, the six feeling words, the seven body places, and the rule that
   the mirror is built only from what the person gave and never invented.
   The card is this file's own .ob-card, the same sheet a stranger already
   meets, carrying the Field's own watermark figure and wash rather than a
   second visual language copied from the mockup's CSS.

   EVERY RULING THE OLD FLOW CARRIED STILL HOLDS AND IS NOT RETYPED HERE
   WHERE IT WOULD JUST REPEAT: humble and warm, the same flow for both
   arrivals, replayable from the profile. One thing changed on purpose.
   "it does not spend real charge" was true of the sheet and is still true
   of the sheet; it was never true of a real entry typed into it, which
   ui/tutorial.js's own header already states for the Day One tutorial: "the
   entry is real and costs whatever any entry costs." The reviewed design
   ends in a real release, which is the engine actually moving charge, so
   this flow now carries a real entry the same way the tutorial does, through
   the exact same functions the Story tab's own Apply button calls. Nothing
   here is a second writer.

   THE SIGNAL TEST, round MP's breath script, is gone from this sheet. It was
   the thing it asked a stranger to do before a story existed to read; the
   reviewed design asks for the story itself instead, which is the one
   interactive thing with something real behind it. The breath script is
   not deleted from the product's history, it is superseded, the same way
   the old six slides of Reel A were cut from the mockup itself.

   WHAT THIS IS NOT: a second parser. The mirror's one real-engine line comes
   from parseStory and stCommit, read exactly as the Story tab and the Day
   One tutorial already read them. Nothing here guesses a feeling or a place
   from a word list of its own; the taps the person makes are kept as exactly
   that, a tap, never dressed up as something the engine found.

   J0, SAID LOUDLY BECAUSE IT IS STILL OPEN. There is no distress detector
   anywhere in this engine, and this flow reads a stranger's first story
   through parseStory with no check of any kind ahead of it. The mockup's
   own stop frame (06-controls.js, body.html) is inert by its own account,
   "draft text, needs a clinician's sign off", reachable only from a
   reviewer's own strip and triggered by nothing a person's words say. Adding
   a frame that looks like a safety check but answers no real signal would be
   worse than adding nothing, so none is added here. See obStory below,
   where the first stranger's words are actually read, for the same warning
   placed at the exact line it describes. Tracked in the owner's plan as J0,
   a ship blocker for any build a stranger who is not the owner can reach.
   ============================================================ */
/* THE AUTOMATIC OPEN IS OFF BY ITS OWN FLAG, unchanged: ui/login.js's
   loginEnter runs this sheet on its own switch, DEV_PLAY_ONBOARDING, and
   never reads this one. OB_AUTO is kept only because a gate still asserts
   it reads false; nothing in the product reads it to decide anything. */
var OB_AUTO=false;
/* THE TWELVE STARTING POINTS. REVIEW-onboarding/PROPOSAL.md calls for
   "twelve starting points as ring chips"; mockups/onboarding-v2/src/js/
   01-data.js names the twelve itself, built and reviewed in that round, and
   this is that list, unchanged, because inventing a different twelve here
   would be a second, disagreeing answer to a question that round already
   settled. The shapes of motion the mockup hung off each one are its own
   animator's reading (NOTES.md says so) and are not a claim this file
   carries forward; only the twelve names are. */
var OB_STARTS=[
 {k:'anxiety',n:'Anxiety'},{k:'anger',n:'Anger'},{k:'overwhelm',n:'Overwhelm'},
 {k:'burnout',n:'Burnout'},{k:'grief',n:'Grief'},{k:'fear',n:'Fear'},
 {k:'relationships',n:'Relationships'},{k:'pain',n:'Pain'},
 {k:'selfworth',n:'Self-worth'},{k:'purpose',n:'Purpose'},{k:'money',n:'Money'},
 {k:'other',n:'Something else'}];
/* THE SIX FEELING WORDS, the same six the mockup's FEELS carries. Neither
   set is tinted to a seat: a feeling is not one place in the body, and
   tinting it that way would be a claim this sheet has not earned. */
var OB_FEELS=[{k:'heavy',n:'Heavy'},{k:'tight',n:'Tight'},{k:'numb',n:'Numb'},
 {k:'restless',n:'Restless'},{k:'hollow',n:'Hollow'},{k:'hot',n:'Hot'}];
/* THE SEVEN BODY PLACES, one on each seat, root to crown, the engine's own
   seven bands (obFigure's own col array, below, in the same order). Each is
   tinted with seatCol, because this one is an engine fact: the place really
   is that seat and nothing here is guessing. */
var OB_PLACES=[{k:'pelvis',n:'Pelvis',b:'Root'},{k:'belly',n:'Belly',b:'Sacral'},
 {k:'stomach',n:'Stomach',b:'Solar'},{k:'chest',n:'Chest',b:'Heart'},
 {k:'throat',n:'Throat',b:'Throat'},{k:'forehead',n:'Forehead',b:'3rd Eye'},
 {k:'head',n:'Head',b:'Crown'}];
/* nsteps is 8: arrive, ask, settle, feel, body, story, mirror, bridge. */
var OB_NSTEPS=8;
var OB={open:false, step:0, replay:false,
 pick:null, feel:null, place:null,
 text:'', commit:null, corr:'', fixes:[], corrFound:null,
 /* the reading the commit was made from, kept because stCommit clears
    ST_PARSED, and the first release's plan read off it (F5) */
 parsed:null, plan:null};

/* THE FIGURE, AT REST. Unchanged from the shipped sheet: seven seats on a
   spine with a gold halo over the crown, the same column the boot just
   drew. Kept here rather than moved, because every card below still wants
   it as its watermark (obCard's own .ob-fig-wm) and the welcome still wants
   it at full strength. */
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
 OB.open=true; OB.step=0; OB.replay=!!replay;
 OB.pick=null; OB.feel=null; OB.place=null;
 OB.text=''; OB.commit=null; OB.corr=''; OB.fixes=[]; OB.corrFound=null;
 OB.parsed=null; OB.plan=null;
 h.classList.remove('ob-leaving');
 obRender();
 h.style.display='flex';
 var f=h.querySelector('button,textarea'); if(f)f.focus();}
/* THE HANDOFF TO THE FIELD IS A FADE, NOT A CUT, unchanged from round MP. */
var OB_LEAVE_MS=520;
function obClose(){
 var h=document.getElementById('ob'); if(!h)return;
 OB.open=false; h.classList.add('ob-leaving');
 setTimeout(function(){ h.style.display='none'; h.classList.remove('ob-leaving'); h.innerHTML=''; },OB_LEAVE_MS);
 /* EVERY WRITE THAT CAN FAIL REPORTS, unchanged lesson. */
 try{
  if(CURP){ if(!CURP.ui||typeof CURP.ui!=='object')CURP.ui={}; CURP.ui.onboarded=true;
   if(!pSave()&&typeof status==='function')
    status('This browser would not save. The first run will open again.','fail'); }
 }catch(e){
  if(typeof status==='function')
   status('This browser would not save. The first run will open again.','fail'); }
 if(typeof render==='function')render();}

/* ---- the card shell. nsteps carries over tutorial.js's own pattern,
   because a sheet of a fixed four steps is no longer the only one. ---- */
function obCard(eye,title,body,acts,nsteps){
 var n=nsteps||OB_NSTEPS;
 return '<div class="ob-card" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'
  +'<div class="ob-wash" aria-hidden="true"></div>'
  +'<div class="ob-fig-wm" aria-hidden="true">'+obFigure()+'</div>'
  +'<div class="ob-scroll">'
  +'<span class="pm-eye">'+esc(eye)+'</span>'
  +'<h2 class="ob-h">'+esc(title)+'</h2>'
  +body
  +'<div class="ob-acts">'+acts+'</div>'
  +'<div class="ob-dots">'+Array.from({length:n}).map(function(_,i){
    return '<span class="ob-dot'+(i===OB.step?' on':'')+'"></span>';}).join('')+'</div>'
  +'</div></div>';}
/* a row of chips, one choice at most. sel is the picked index, -1 for "not
   sure", null for nothing picked yet. b, when given, is the chip's seat
   band and tints it through seatCol, the same colour the body figure and
   the finished card already use for that seat; with no b the chip carries
   no colour, because this file makes no claim it has not earned. */
function obChips(items,attr,sel,withNotSure){
 return '<div class="ob-seats">'+items.map(function(x,i){
   var c=x.b?' style="--c:'+seatCol(x.b)+'"':'';
   return '<button type="button" class="ob-seat'+(sel===i?' on':'')+'"'+c
    +' data-'+attr+'="'+i+'">'+esc(x.n)+'</button>';}).join('')
  +(withNotSure?'<button type="button" class="ob-seat'+(sel===-1?' on':'')+'" data-'+attr+'="-1">Not sure</button>':'')
  +'</div>';}

function obRender(){
 var h=document.getElementById('ob'); if(!h)return;
 var s=OB.step, out='';
 if(s===0){
  /* ARRIVE. His two rulings, kept exactly: the figure and eleven words
     first, show not tell, and then the warmth he named, "hey, this is you,
     and it is okay. No judgment." The mockup's own first card, "Welcome to
     a neurosomatic experience," is his line too (NOTES.md item 1) and sits
     here as the eyebrow rather than a second sentence, so the card still
     opens on the figure and not on a claim. */
  out=obCard('Welcome to a neurosomatic experience','This is you, and it is okay.',
   obFigure()
   +'<p class="ob-p">No judgment. Nothing here grades you. This one is for you.</p>'
   +'<p class="ob-p ob-dim">A few minutes. One real thing to write. Nothing to fill in.</p>',
   '<button type="button" class="btn pri" data-ob="next">Come in</button>'
   +'<button type="button" class="btn" data-ob="skip">Not now</button>');
 }
 else if(s===1){
  /* ASK. Picking is the advance in the mockup; kept here, with a Back for
     a person who taps the wrong one, which the mockup did not need because
     its chips fly back into the ring and this sheet's do not. */
  out=obCard('Ask','What brought you here?',
   '<p class="ob-p ob-dim">Pick the one that is closest. Nothing is locked in.</p>'
   +obChips(OB_STARTS,'obpick',OB.pick,false),
   '<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===2){
  /* SETTLE. His two lines, kept exactly as the mockup carries them
     (NOTES.md item 1): the awareness line, which answers what this sheet
     is asking the senses to do, and the instruction that follows it. */
  out=obCard('Settle','Do not solve it yet.',
   '<p class="ob-p">Awareness and intuition is a tool we use to turn your senses inward.</p>'
   +'<p class="ob-p">Notice what is here.</p>',
   '<button type="button" class="btn pri" data-ob="next">Continue</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===3){
  out=obCard('Feel','What are you feeling?',
   '<p class="ob-p ob-dim">Take a second.</p>'
   +obChips(OB_FEELS,'obfeel',OB.feel,true),
   '<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===4){
  out=obCard('Body','Where do you notice it?',
   '<p class="ob-p ob-dim">Tap the place on the body.</p>'
   +obChips(OB_PLACES,'obplace',OB.place,true),
   '<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===5){
  /* STORY. THE ONE REAL THING. This is the exact line J0 names in the
     header above: a stranger's first typed words are about to be read by
     parseStory with no distress check of any kind standing in front of it.
     Anybody building that check wires it here, ahead of obStoryDone, and
     nowhere else, because this is the only place in this sheet a stranger's
     own words exist before the engine reads them. */
  out=obCard('Story','What was happening?',
   '<p class="ob-p ob-dim">A sentence or two is enough. Your own words.</p>'
   +'<div class="ob-f"><textarea id="obtext" rows="4" placeholder="What happened, and what it was like."></textarea></div>',
   '<button type="button" class="btn pri" id="obdone" data-ob="storydone" disabled>Done</button>'
   +'<button type="button" class="btn" data-ob="storyskip">I would rather not say</button>'
   +'<button type="button" class="btn" data-ob="back">Back</button>');
 }
 else if(s===6){
  out=obMirrorCard();
 }
 else {
  out=obBridgeCard();
 }
 h.innerHTML=out;
 var ta=document.getElementById('obtext');
 if(ta){ta.value=OB.text; ta.oninput=function(){
   var go=document.getElementById('obdone'); if(go)go.disabled=(ta.value.trim().split(/\s+/).filter(Boolean).length<3);};
  ta.focus();}
 var ci=document.getElementById('obcorr');
 if(ci){ci.oninput=function(){OB.corr=ci.value;};}
 var f=h.querySelector('.ob-scroll'); if(f)f.scrollTop=0;}

/* ============================================================
   THE MIRROR. Built only from what the person gave: the pick, the feel and
   body taps exactly as tapped (never dressed up as an engine reading), the
   person's own words quoted, and the one real-engine line, read off
   stCommit's own kept array the same way ui/tutorial.js's tutSeatLine
   already reads it. Nothing below is scripted copy standing in for that
   read, and an entry that found nothing says so in the same honest-empty
   words the tutorial and the signal test already use.
   ============================================================ */
function obSeatLine(n){
 if(!n)return '';
 return 'at your <b>'+esc(n.b||'')+'</b>, around the word &ldquo;'+esc(n.k||'')
  +'&rdquo;, named <b>'+esc(n.cf||'')+'</b>';}
function obQuote(t){
 var s=String(t||'').replace(/\s+/g,' ').trim(), m=s.match(/^[^.!?]+/), q=(m?m[0]:s).trim();
 var w=q.split(' '); if(w.length>16)q=w.slice(0,16).join(' ')+'...';
 return q;}
function obMirrorCard(){
 var pk=OB.pick!=null&&OB.pick>=0?OB_STARTS[OB.pick]:null;
 var fe=OB.feel!=null&&OB.feel>=0?OB_FEELS[OB.feel]:null;
 var pl=OB.place!=null&&OB.place>=0?OB_PLACES[OB.place]:null;
 var c=OB.commit, kept=(c&&c.kept)||[];
 var lines='';
 lines+='<p class="ob-p">'+(pk&&pk.k!=='other'?'You came in with <b>'+esc(pk.n.toLowerCase())+'</b>.'
   :'You did not pick a starting point.')+'</p>';
 if(fe||pl){
  var a=fe?'It feels <b>'+esc(fe.n.toLowerCase())+'</b>':'You did not say how it feels';
  var b=pl?', and you notice it in your <b>'+esc(pl.n.toLowerCase())+'</b>.':'.';
  lines+='<p class="ob-p">'+a+b+'</p>';
 } else lines+='<p class="ob-p">You did not say how it feels or where.</p>';
 lines+='<p class="ob-p">'+(OB.text?'You said: <b>&ldquo;'+esc(obQuote(OB.text))+'&rdquo;</b>'
   :'You did not say what happened.')+'</p>';
 if(c&&c.ok&&c.k)
  lines+='<p class="ob-p">This separates into its own components. What stood out '
   +(kept[0]?obSeatLine(kept[0]):'landed')+'.</p>'
   +(kept[1]?'<p class="ob-p">And a second place, '+obSeatLine(kept[1])+'.</p>':'');
 else if(OB.text)
  lines+='<p class="ob-p ob-dim">Nothing in that one lit anything the engine could name. '
   +'That happens, and it is not a problem with what you wrote.</p>';
 OB.fixes.forEach(function(t){lines+='<p class="ob-p">You added: <b>&ldquo;'+esc(t)+'&rdquo;</b></p>';});
 if(OB.corrFound)
  lines+='<p class="ob-p">And it lands '+obSeatLine(OB.corrFound)+'.</p>';
 var body=lines
  +'<p class="ob-p" style="margin-top:10px">Does that feel like you?</p>'
  +'<div class="ob-acts" style="margin-top:0"><button type="button" class="btn pri" data-ob="mirroryes">That is me</button>'
  +'<button type="button" class="btn" data-ob="mirrorno">Not quite</button></div>'
  +'<div class="ob-f" id="obcorrwrap" hidden><label for="obcorr">Tell me what is off.</label>'
  +'<textarea id="obcorr" rows="2"></textarea>'
  +'<div class="ob-acts" style="margin-top:8px"><button type="button" class="btn pri" data-ob="mirroradjust">Adjust</button></div></div>';
 return obCard('Mirror',OB.fixes.length?'Here is what I heard now.':'Here is what I heard.',
  body,'<button type="button" class="btn" data-ob="back">Back</button>');}

/* ---- adjust: a correction is read for real, through parseStory, and is
   never a second write. It only changes what this card says. ---- */
function obAdjust(){
 var ta=document.getElementById('obcorr'); if(!ta)return;
 var v=ta.value.trim(); if(!v)return;
 OB.fixes.push(v);
 var found=null;
 try{
  var p=parseStory(v);
  if(p&&p.imprints&&p.imprints.length){var n=BY[p.imprints[0].node]; if(n&&n.cf)found=n;}
 }catch(e){}
 OB.corrFound=found;
 /* the correction is kept on the same real entry the Story path already
    wrote, never a second place: the entry carries what the person said
    about it, same object, same pSave, no second write of charge. */
 try{
  if(CURP&&CURP.story&&CURP.story.entries&&CURP.story.entries.length){
   var ent=CURP.story.entries[CURP.story.entries.length-1];
   ent.ob=ent.ob||{}; ent.ob.fixes=ent.ob.fixes||[]; ent.ob.fixes.push(v);
   pSave();}
 }catch(e){}
 ta.value=''; OB.corr='';
 obRender();}

/* ============================================================
   THE BRIDGE. The hand off this round names by name: never a second
   release engine, the one ui/release.js already carries, through relPick,
   the same one every other door in the product uses (avatarui.js,
   drills.js, imprints.js, map.js, personas.js, ritual.js, storyui.js,
   summary.js). The node ids it hands over come from what the mirror just
   read, never a guess built from a pick or a feeling word: those are taps
   and this is the engine's own read. Since F5 they are the first release's
   plan out of that read, at most three, and not all of it.
   ============================================================ */
/* ============================================================
   THE FIRST RELEASE'S SIZE, F5, ruled round PA: "The mini release is 12
   lines." This bridge handed relPick every address the story read, eight or
   twelve of them, and the card printed the count of addresses as a count of
   lines: "8 lines" over a run that was 25 (RUN_MAX cut the eighth address off
   and the seventh to one line). Measured on the shipped build, 2 October,
   with the gate's own sentence.

   Now the bridge goes through onbMiniPlan (engine/journey.js), which takes at
   most three whole addresses, stated before named before inferred, inside the
   allowance, and writes nothing. The ids handed to relPick are the plan's, so
   relPlan builds the same twelve keys the card counted (tests/onboarding2.js
   holds the two equal), and every number on the card is read off the plan.

   The Day One tutorial is the other door into the same first release and
   calls the same two functions, so there is one size and one sentence.
   ============================================================ */
/* THE SIGNAL IS A LIST, and the caller says which list. Today both doors pass
   parseStory's imprints, which carry node, stated and inferred exactly as
   onbMiniPlan reads them. A door that lets a person answer yes or no per
   address (F4) passes its yes rows in the same shape, and nothing here
   changes. */
function obMini(list){
 if(typeof onbMiniPlan!=='function'||typeof CURP==='undefined'||!CURP)return {ok:false, why:'no record'};
 var ims=Array.isArray(list)?list:[];
 return onbMiniPlan(CURP,{unread:!ims.length, imprints:ims});}
/* parseStory's imprints, or none, for a door that kept the parse */
function obImprints(parsed){ return (parsed&&Array.isArray(parsed.imprints))?parsed.imprints:[]; }
/* WHAT THE CARD SAYS ABOUT THE PLAN. Every number is the plan's. "Address" is
   the product's word and he ruled it means nothing to a person (SX1), so the
   card says place, which is what the mirror above already says. A line is
   unpacked where it is first used (round PO). The count of places the words
   did not name is said, never hidden: those are the engine's guess from where
   the feeling sits, and a person is owed the difference. */
function obMiniSay(pl,first){
 if(!pl||!pl.ok)return '';
 var n=pl.addrs.length, rel=first?'Your first release':'This release';
 var places=function(k){return k+(k===1?' place':' places');};
 var seats=[]; pl.addrs.forEach(function(i){var b=BY[i]&&BY[i].b; if(b&&seats.indexOf(b)<0)seats.push(b);});
 var at=seats.length?(n===1?'It sits':(seats.length===1?'All '+n+' sit':'They sit'))+' at your '
  +seats.map(function(b){return '<b>'+esc(b)+'</b>';}).join(seats.length===2?' and ':', ')
  +(seats.length===1?' seat.':' seats.'):'';
 var out='';
 if(pl.rest>0){
  var nm=pl.found-pl.foundInferred;
  out+='<p class="ob-p">Your story touched '+places(pl.found)+' in your body. '
   +(pl.foundInferred===0?'Your words point to all '+pl.found+'.'
    :(nm===0?'All '+pl.found+' come from where the feeling sits. Your words did not name them.'
     :'Your words point to '+nm+'. The other '+pl.foundInferred+' come from where the feeling sits.'))+'</p>'
   +'<p class="ob-p">'+rel+' takes '+n+(nm>0&&pl.foundInferred>0?', the ones your words point to first':'')
   +'. '+(pl.rest===1?'The other one waits':'The other '+pl.rest+' wait')+' for your next release.</p>';
 } else if(pl.inferred>0){
  out+='<p class="ob-p">'+(pl.inferred===n?(n===1?'This place comes':'All '+n+' come')
    :pl.inferred+' of the '+n+' come')+' from where the feeling sits. Your words did not name '
   +(pl.inferred===1?'it':'them')+'.</p>';
 }
 out+='<p class="ob-p">'+(pl.rest>0?'That is ':rel+' is ')+pl.lines+' lines, '
  +(n===1?'all at one place':(pl.lines/n)+' at each of '+places(n))+'. '+at+'</p>'
  +'<p class="ob-p ob-dim">A line is one short sentence you follow in thought.</p>';
 return out;}
/* WHY THERE IS NO RELEASE TO BEGIN, when the story read and the plan is still
   refused. Said once, plainly; the route is the button beside it. */
function obMiniWhy(pl){
 if(pl&&pl.why==='allowance')
  return 'There are no patterns left in your allowance right now, so no new release can begin from this story. '
   +'A pattern is one line you have not said before.';
 if(pl&&pl.why==='no new ground')
  return 'Every place this story touched is already fully opened, so there is nothing new to release from it.';
 return '';}
function obBridgeCard(){
 var c=OB.commit, kept=(c&&c.kept)||[];
 var pl=OB.plan=(c&&c.ok&&c.k&&kept.length)?obMini(obImprints(OB.parsed)):null;
 if(pl&&pl.ok){
  var first=(typeof journeyRead==='function')?journeyRead(CURP).first:true;
  return obCard('Next',first?'Next is your first release.':'Next is a release.',
   obMiniSay(pl,first)
   +'<p class="ob-p ob-dim">You choose the pace and how many times each line repeats once you are there, and you can stop any time.</p>',
   '<button type="button" class="btn pri" data-ob="release">Begin the release</button>'
   +'<button type="button" class="btn" data-ob="done">Not now</button>');
 }
 if(obMiniWhy(pl))
  return obCard('Next','Nothing new to release yet.',
   '<p class="ob-p">'+obMiniWhy(pl)+'</p>',
   '<button type="button" class="btn pri" data-ob="done">Go in</button>');
 /* HONEST EMPTY, the same rule the signal test and the tutorial already
    keep: nothing to release is a real answer, not a failure to paper over. */
 return obCard('Next','Nothing to release yet.',
  '<p class="ob-p">This entry did not carry enough charge to name a release yet. '
   +'That is fine. You can always write another in the Story tab.</p>',
  '<button type="button" class="btn pri" data-ob="done">Go in</button>');}

/* ---- one listener for the whole sheet ---- */
addEventListener('click',function(e){
 if(!OB.open)return;
 var t=e.target&&e.target.closest?e.target:null; if(!t)return;
 var pk=t.closest?t.closest('[data-obpick]'):null;
 if(pk){ OB.pick=+pk.getAttribute('data-obpick'); OB.step=2; obRender(); return; }
 var fe=t.closest?t.closest('[data-obfeel]'):null;
 if(fe){ OB.feel=+fe.getAttribute('data-obfeel'); OB.step=4; obRender(); return; }
 var pl=t.closest?t.closest('[data-obplace]'):null;
 if(pl){ OB.place=+pl.getAttribute('data-obplace'); OB.step=5; obRender(); return; }
 var b=t.closest?t.closest('[data-ob]'):null; if(!b)return;
 var k=b.getAttribute('data-ob');
 if(k==='next'){ OB.step++; obRender(); return; }
 if(k==='back'){ OB.step=Math.max(0,OB.step-1); obRender(); return; }
 if(k==='storydone'){ obStoryDone(); return; }
 if(k==='storyskip'){ OB.text=''; OB.commit={ok:false,why:'skip'}; OB.parsed=null; OB.plan=null; OB.step=6; obRender(); return; }
 if(k==='mirrorno'){ var w=document.getElementById('obcorrwrap'); if(w)w.hidden=false;
  var ci=document.getElementById('obcorr'); if(ci)ci.focus(); return; }
 if(k==='mirroradjust'){ obAdjust(); return; }
 if(k==='mirroryes'){ OB.step=7; obRender(); return; }
 if(k==='release'){
  /* the plan's addresses, never every address the story read (F5) */
  var pl=OB.plan||obMini(obImprints(OB.parsed)), ids=(pl&&pl.ok)?pl.addrs:[];
  obClose();
  if(ids.length&&typeof relPick==='function')relPick(ids);
  return;}
 if(k==='skip'||k==='done'){ obClose(); return; }});
/* escape leaves, because a sheet a person cannot dismiss is a sheet that has
   stopped being an invitation. */
addEventListener('keydown',function(e){
 if(OB.open&&e.key==='Escape')obClose();});

/* ---- the one commit the story screen makes, through the real path, the
   exact two lines the Story tab's own textarea runs and then stCommit,
   factored out for the Day One tutorial first and reused here rather than
   a third copy of it. ----

   J0 AGAIN, NAMED AT THE LINE IT IS ABOUT. The call to stCommit below is
   where a stranger's own first words, typed into this product for the
   first time, are actually read. Nothing stands between that text and the
   engine's own parser, and nothing here claims otherwise. */
function obStoryDone(){
 var ta=document.getElementById('obtext'); if(!ta)return;
 var v=ta.value; OB.text=v;
 if(v.trim().split(/\s+/).filter(Boolean).length<3)return;
 ST_TEXT=v; ST_PARSED=v.trim()?parseStory(v):null;
 OB.parsed=ST_PARSED; OB.plan=null;
 var r=stCommit();
 OB.commit=r;
 /* THE TAPS WRITE TO THE REAL PROFILE THE WAY THE STORY TAB ALREADY DOES:
    the same entry, the same CURP.story.entries array, the same pSave, never
    a second store. A tap is kept as exactly what it is, a tap, and is never
    run back through parseStory as if the person had typed it: that would be
    inventing their words, which the mirror above is built never to do. */
 try{
  if(r&&r.ok&&CURP&&CURP.story&&CURP.story.entries&&CURP.story.entries.length){
   var ent=CURP.story.entries[CURP.story.entries.length-1];
   ent.ob={pick:OB.pick,feel:OB.feel,place:OB.place};
   pSave();}
 }catch(e){}
 OB.step=6; obRender();}
