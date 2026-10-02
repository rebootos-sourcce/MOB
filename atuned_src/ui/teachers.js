/* ============================================================
   THE IMPRINT PANEL. Round PD, DESIGN-teachers.md v2 section 3, and his words
   from round OX: "with the teachers, we want to see almost like an imprint on
   the right-hand side, and we want to find their impressions, positive and
   negative ... this should tie to the ritual builder as well."

   A press on a teacher's name, anywhere on the Compass, opens this in the
   right-hand panel (#rdrill, through rdShell) in place of the old drill. It
   shows, top to bottom: who, the imprint (what the quality leaves in a day and
   what its inversion leaves, four channels each), what is running in the
   person that keeps them from it, the recipe, the lines with their reaches,
   the ritual and the release in his library order, and the share switch.

   NO SECOND ANYTHING. The ritual starts through ritTeachStart and so
   ritStartPlan, the one writer every ritual uses. The release runs through
   relPick, the one runner. Reads come from the recipe engine and the teachers'
   block (engine/recipes.js, engine/teach.js), writes go through their
   boundary functions and then pSave, and a control never claims success
   before pSave has answered.

   NO MATCH NUMBER. He ruled it. A reason is a sentence. An order is an order.
   Nothing here prints a score, a percent of fit, or a count against a total.

   WHAT IS SHOWN ON EVERY PLAN. The reading is open on every plan: the five
   addresses, what is carrying, the person's own quoted sentences. Which
   saboteur runs on them is a rung of sight (SIGHT in engine/plan.js) and is
   read from lockSees, never typed: below the tier it is the lock sentence and
   not a shorter list.
   ============================================================ */
var TP={k:null, end:'up', confirm:false, said:{}};
var TP_MONTHS=['January','February','March','April','May','June','July','August',
 'September','October','November','December'];
function teachDate(iso){
 var d=new Date(iso); if(isNaN(d.getTime()))return '';
 return d.getDate()+' '+TP_MONTHS[d.getMonth()];}
function teachCol(P){return P.seat?seatCol(P.seat):(P.home?seatCol(P.home):'var(--accent)');}
function teachIc(path,col,cls){
 return '<span class="tp-ic'+(cls?' '+cls:'')+'" style="--c:'+col+'"><svg viewBox="0 0 24 24" aria-hidden="true">'
  +(path?'<path d="'+path+'"/>':'<circle cx="12" cy="12" r="6"/>')+'</svg></span>';}
function teachProf(){return (typeof CURP!=='undefined'&&CURP)||null;}
function teachBlock(){var p=teachProf(); return (p&&p.teach)||teachBlank();}
function teachEntries(){var p=teachProf(); return (p&&p.story&&Array.isArray(p.story.entries))?p.story.entries:[];}
/* the word for a seat, sentence case, the third eye spelled as it is said */
function teachSeatWord(b){return typeof ritSeatNm==='function'?ritSeatNm(b):String(b||'').toLowerCase();}

/* ---------------- writes ----------------
   One writer for the block. A worked example refuses by name, a write that the
   boundary would refuse is refused before it is made, and a write pSave did not
   take is put back and said. okMsg is said only after pSave has answered. */
function teachWrite(fn,okMsg,failMsg){
 if(typeof ritOwn==='function'&&!ritOwn()){
  status(ritWhose()+' is a worked example, so nothing here is saved.','fail'); return false;}
 var p=teachProf(); if(!p)return false;
 var was=JSON.stringify(p.teach||teachBlank());
 var r=fn(p.teach||teachBlank());
 if(!r.ok){status(r.why,'fail'); teachRedraw(); return false;}
 p.teach=r.teach;
 var ok=false; try{ok=!!pSave();}catch(e){ok=false;}
 if(!ok){p.teach=JSON.parse(was); status(failMsg||'Not saved.','fail'); teachRedraw(); return false;}
 if(okMsg)status(okMsg);
 teachRedraw(); return true;}
function teachNow(){return new Date().toISOString();}
function teachChoose(k){
 var nm=(teachPole(k)||{}).who||'this teacher';
 return teachWrite(function(t){return teachFocusAdd(t,k,teachNow());},
  'Chosen. '+nm+' is pinned, and the first set of lines is open.','Not saved. '+nm+' was not chosen.');}
function teachUnpin(k){
 return teachWrite(function(t){return teachFocusRemove(t,k);},'Unpinned.','Not saved. It is still pinned.');}
function teachMark(k,id){
 return teachWrite(function(t){return teachMarkToggle(t,k,id);},null,'Not saved. Your mark was not recorded.');}
function teachShare(k,on){
 return teachWrite(function(t){return teachShareSet(t,k,on,teachNow());},
  on?'Shared. A lead sees this teacher once one is linked.':'Sharing is off.',
  on?'Not saved. Sharing is still off.':'Not saved. Sharing is still on.');}
/* A RITUAL STARTED TOWARD A TEACHER IS THE CLEAREST WAY OF CHOOSING ONE, so it
   pins the teacher when there is room, and logs the start as a count. Neither
   is a precondition: the ritual already started through its own writer, and a
   record of it that did not save is said and does not undo it. */
function teachAfterStart(k,kind,count){
 if(typeof ritOwn==='function'&&!ritOwn())return;
 var p=teachProf(); if(!p)return;
 var t=p.teach||teachBlank(), was=JSON.stringify(t), failed=false;
 if(!teachFocusOf(t,k)){var f=teachFocusAdd(t,k,teachNow()); if(f.ok)t=f.teach;}
 var r=teachRunAdd(t,k,kind,count,teachNow());
 if(!r.ok){status(r.why,'fail'); return;}
 p.teach=r.teach;
 var ok=false; try{ok=!!pSave();}catch(e){ok=false;}
 if(!ok){p.teach=JSON.parse(was);
  status('Not saved. Your start toward '+((teachPole(k)||{}).who||'this teacher')+' was not recorded.','fail');}}
/* the release's own completion calls this (ui/release.js relCoolDown), once,
   after the run has landed and been saved, so a refused run logs nothing */
function teachRunLogged(){
 var k=RUN.toward; RUN.toward=null;
 if(!k)return;
 teachAfterStart(k,'release',Math.min(TEACH_RUN_N,(RUN.queue||[]).length));}
/* the reaches a person has earned and the block does not yet hold, written once
   on the way in. If the write fails the reach still shows open this session,
   because the record earned it, and the status says it will open again. */
function teachGrantOpen(k){
 if(typeof ritOwn==='function'&&!ritOwn())return;
 var p=teachProf(); if(!p)return;
 var due=teachGrantsDue(p,k); if(!due.length)return;
 var t=p.teach||teachBlank(), was=JSON.stringify(t);
 due.forEach(function(r){var g=teachGrantAdd(t,k,r,teachNow()); if(g.ok)t=g.teach;});
 p.teach=t;
 var ok=false; try{ok=!!pSave();}catch(e){ok=false;}
 if(!ok){p.teach=JSON.parse(was);
  status('Not saved. This will open again when you do the next practice.','fail');}}

/* ---------------- the panel ---------------- */
function teachOpen(k,end){
 var P=teachPole(k); if(!P)return;
 TP.k=k; TP.end=(end==='dn')?'dn':'up'; TP.confirm=false;
 teachGrantOpen(k);
 teachRedraw();
 if(TP.end==='dn'){var o=document.querySelector('#rdrill .tp-opp');
  if(o&&o.scrollIntoView){try{o.scrollIntoView({block:'start'});}catch(e){}}}}
function teachRedraw(){
 if(!TP.k)return;
 var P=teachPole(TP.k); if(!P)return;
 teachCss();
 rdShell(teachHtml(P));
 teachWire(P);}

function teachRosterHtml(P){
 var at={}; teachRoster().forEach(function(t,i){t.poles.forEach(function(k){at[k]=i;});});
 var h='<div class="tp-roster" role="group" aria-label="Teachers">';
 teachRoster().forEach(function(t){
  var cur=t.poles.indexOf(P.k)>=0, k=cur?P.k:t.poles[0], x=teachPole(k);
  h+='<button type="button" class="tp-chip'+(cur?' on':'')+'" data-tpk="'+k+'" aria-pressed="'+cur+'" style="--c:'+teachCol(x)+'">'
   +teachIc(x.ic,teachCol(x))+'<span>'+esc(t.who)+'</span></button>';});
 return h+'</div>';}
/* WHO. The ring, the name, the quality in his word with the engine's word beside
   it where the axis was renamed, one sentence of where the person stands, and
   the one sentence every teacher carries. */
function teachWhoHtml(P,r){
 var col=teachCol(P), qual=P.word+(P.engine&&P.engine!==P.word?' ('+P.engine.toLowerCase()+' before round PD)':'');
 var sub=P.kind==='axis'?esc(P.q)+', at the '+esc(teachSeatWord(P.seat))
  :(P.home?esc(P.word)+', read through the '+esc(teachSeatWord(P.home))+'’s law'
  :esc(P.word)+', read across the field');
 var h='<div class="pm-eye">Teacher</div>'
  +'<div class="tp-who">'+teachIc(P.ic,col,'big')+'<div><div class="ad-nm">'+esc(P.who)+'</div>'
  +'<div class="ad-sub">'+sub+'</div></div></div>';
 /* Jesus stands at two poles, and a switch between them is how one figure stays
    two rituals at two seats */
 var same=teachRoster().filter(function(t){return t.poles.indexOf(P.k)>=0;})[0];
 if(same&&same.poles.length>1)
  h+='<div class="tp-switch" role="group" aria-label="Which pole">'+same.poles.map(function(k){var x=teachPole(k);
   return '<button type="button" class="tp-chip'+(k===P.k?' on':'')+'" data-tpk="'+k+'" aria-pressed="'+(k===P.k)+'" style="--c:'+teachCol(x)+'">'
    +'<span>'+esc(x.q)+', at the '+esc(teachSeatWord(x.seat))+'</span></button>';}).join('')+'</div>';
 h+='<p class="ad-p">'+esc(P.d)+'</p>';
 /* where the person stands, in the sentences the Compass already uses, so the
    drill and the Compass panel read one axis position */
 var line='';
 if(r.unread)line='Nothing has been entered yet, so this has no reading. It is still the quality.';
 else if(P.kind==='axis'){
  var m=MIRROR.filter(function(x){return x.k===P.k;})[0];
  var seg=(typeof flSeats==='function')?flSeats().filter(function(x){return K2B[x.p.k]===m.seat;})[0]:null;
  var at=(typeof coneMirPos==='function')?coneMirPos(m):null;
  line='The '+esc(teachSeatWord(m.seat))+' is carrying <b>'+Math.round((seg?seg.load:0)*100)+'%</b> and its integrity reads <b>'
   +bandIg(m.seat).toFixed(1)+'</b>.'+(at?' That puts you at <b>'+esc(at)+'</b> on this axis.':'');}
 else if(P.home&&P.laws.length){
  var lw=P.laws[0], p=teachProf(), got=p&&p.laws&&p.laws[lw]!=null;
  line=got?'This one stands at no seat of its own. The '+esc(lw.toLowerCase())+' law reads <b>'+Number(S.law[lw]).toFixed(1)+'</b> of 10 for you.'
   :'This one stands at no seat of its own. The '+esc(lw.toLowerCase())+' law has not been answered yet.';}
 else line='This one is read across the field, so it has no position on an axis.';
 h+='<p class="ad-p">'+line+'</p>'
  +'<p class="tp-note">A behaviour a person runs, not a person to become.</p>';
 return h;}
/* THE OPPOSITE. The figure, the codex line and the question that tells them apart. */
function teachOppHtml(P){
 return '<div class="tp-sec tp-opp"><div class="pm-eye">The opposite</div>'
  +'<div class="tp-who">'+teachIc(P.opp.ic,teachCol(P),'dash')+'<div><div class="ad-nm plain">'+esc(P.opp.nm)+'</div>'
  +'<div class="ad-sub">the same quality, inverted'+(P.from==='proposed'?', a proposed figure':(P.from==='research'?', from the teacher’s own tradition':''))+'</div></div></div>'
  +'<p class="ad-p">'+esc(P.opp.d)+'</p>'
  +(P.ask?'<p class="tp-note">'+esc(P.ask)+'</p>':'')+'</div>';}
/* THE IMPRINT. Two blocks, four channels each, a mark beside every line. A mark
   is an id from a closed set and never text, and it needs the teacher chosen. */
function teachImpHtml(P){
 var t=teachBlock(), f=teachFocusOf(t,P.k), mine=f?f.mine:[], chosen=!!f;
 var CH={do:'Do',think:'Think',body:'Body',say:'Say'};
 var blk=function(side,title,sub,col,ic,dash){
  var h='<div class="tp-blk '+side+'" style="--c:'+col+'"><div class="tp-blk-h">'+teachIc(ic,col,dash?'dash':'')
   +'<div><b>'+esc(title)+'</b><span>'+esc(sub)+'</span></div></div>';
  TEACH_CH.forEach(function(c){
   var id=side+'.'+c, on=mine.indexOf(id)>=0;
   h+='<div class="tp-row"><span class="tp-ch">'+CH[c]+'</span><span class="tp-tx">'+esc(P.imp[side][c])+'</span>'
    +'<button type="button" class="tp-mark'+(on?' on':'')+'" data-tpmark="'+id+'" role="switch" aria-checked="'+on+'"'
    +' aria-label="'+(on?'This is mine. Press to take the mark off':'Mark this as yours')+'"'
    +(chosen?'':' aria-disabled="true"')+'>'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/>'+(on?'<path d="M8.5 12.5l2.5 2.5 4.5-5.5"/>':'')+'</svg></button></div>';});
  return h+'</div>';};
 return '<div class="tp-sec"><div class="pm-eye">The imprint</div>'
  +'<p class="ad-p">What the quality leaves in a day, and what its inversion leaves. '
  +(chosen?'Mark the ones that are yours.':'Choose this teacher to mark the ones that are yours.')+'</p>'
  +blk('pos','Runs clean',P.word.toLowerCase(),teachCol(P),P.ic,false)
  +blk('neg','Runs as '+P.opp.nm,'the same quality, inverted',teachCol(P),P.opp.ic,true)
  +'<p class="tp-note">Marks stay on this device. They are not shared unless you share this teacher below, and even then they are not sent.</p></div>';}

/* RUNNING IN YOU. The inversion's behaviours the person's own entries describe,
   most in the way first, each with the sentence quoted and the addresses it
   sits at. Then the quality's ingredients already there. The claim line is
   printed with it, every time: this shows what the entries describe and does
   not say why. */
function teachRunningHtml(P,ctx,bl,ing){
 var h='<div class="tp-sec"><div class="pm-eye">Running in you</div>';
 if(!teachEntries().length){
  return h+'<p class="ad-p">Nothing has been written yet, so there is nothing to find. Write an entry and the behaviours it describes show here, in your own words.</p></div>';}
 if(!bl.length){
  h+='<p class="ad-p">Nothing in your entries describes this inversion.</p>';}
 else{
  h+='<p class="ad-p">These are behaviours of the opposite that your entries describe, the one most in the way first.</p><ol class="tp-bl">';
  bl.slice(0,5).forEach(function(b,i){
   h+='<li class="tp-bli"><b>'+esc(b.behaviour)+'</b>'
    +'<span class="tp-bch">'+esc(({do:'Do',think:'Think',body:'Body',say:'Say'})[b.ch])+'</span>';
   b.evidence.slice(0,2).forEach(function(e){
    h+='<q class="tp-ev">'+esc(e.snippet)+(e.at?'<small>'+esc(teachDate(e.at))+'</small>':'')+'</q>';});
   h+='<span class="tp-adr">'+b.addrs.map(function(a){
     return '<i class="tp-pill'+(a.carrying?' hot':'')+'" style="--c:'+seatCol(a.seat||'Heart')+'">'+esc(a.k)
      +(a.sq!==null?' <small>'+a.sq.toFixed(1)+'</small>':'')+'</i>';}).join('')+'</span>'
    +'<span class="tp-why">'+esc(b.reason)+'</span></li>';});
  h+='</ol>';
  if(bl.length>5)h+='<p class="tp-note">More are in your entries than are listed here.</p>';
  h+='<p class="tp-note">'+esc(RECIPE_CLAIM)+'</p>';}
 /* WHICH SABOTEUR RUNS ON THESE ADDRESSES is a rung of sight. Below the tier
    it is the lock sentence, read off the table, and never a shorter list. The
    addresses and what is carrying above are open on every plan. */
 var hot=[]; bl.forEach(function(b){b.addrs.forEach(function(a){if(a.carrying&&hot.indexOf(a.id)<0)hot.push(a.id);});});
 if(hot.length){
  if(typeof lockSees==='function'&&!lockSees('sab'))
   h+='<p class="tp-note">The addresses above are open on every plan.</p>'+lockPanelHtml('sab',{brief:true});
  else{
   var names=[]; ((typeof computeSeen==='function'?computeSeen().sabs:[])||[]).forEach(function(s){
    if(!s||s.over)return; var lv=leaves(s);
    if(lv.some(function(n){return hot.indexOf(n.i)>=0;})&&names.indexOf(s.nm)<0)names.push(s.nm);});
   if(names.length)h+='<p class="ad-p">Saboteurs running through those addresses: <b>'+esc(names.slice(0,4).join(', '))+'</b>.</p>';}}
 if(ing.length){
  h+='<div class="pm-eye">Already in your entries</div><ul class="tp-ing">'+ing.map(function(x){
   return '<li><b>'+esc(x.behaviour)+'</b><span>'+esc(x.reason)+'</span></li>';}).join('')+'</ul>';}
 return h+'</div>';}
/* THE RECIPE. The quality as four behaviours and the step of the ritual that
   builds each. Shown plainly so the ritual below is read as what builds it. */
function teachRecipeHtml(P,recipe,ing){
 var have={}; ing.forEach(function(x){have[x.id]=1;});
 var CH={do:'Do',think:'Think',body:'Body',say:'Say'};
 return '<div class="tp-sec"><div class="pm-eye">The recipe</div>'
  +'<p class="ad-p">'+esc(P.word)+' is four behaviours, one in each channel. The ritual below builds them.</p>'
  +'<ul class="tp-ing">'+recipe.ingredients.map(function(x){
   return '<li'+(have[x.id]?' class="have"':'')+'><b><em>'+CH[x.ch]+'</em> '+esc(x.behaviour)+'</b>'
    +'<span>Built by '+esc(x.builds?x.builds.nm:'')+(have[x.id]?'. Your entries already describe it.':'.')+'</span></li>';}).join('')+'</ul></div>';}
/* THE LINES. Three reaches, two lines each. What is open shows its lines with
   today's marked; the next one is named with what it takes, in words and with no
   total; the ones past it are not enumerated. Below the level the line is shown
   in hold form. The release-first sentence sits above them when an address of
   the opposite is carrying, because a line said at an address that has not been
   cleared is an installation into charge. */
function teachLinesHtml(P,reach,hotNames,form){
 var row=teachRow(P.k), day=(typeof ritToday0==='function')?ritToday0():Math.floor(Date.now()/86400000);
 var today=teachLineOf(P.k,reach.open,day);
 var seat=P.seat||P.home;
 var h='<div class="tp-sec"><div class="pm-eye">Lines</div>'
  +'<p class="ad-p">One sentence a day'+(seat?', said at the '+esc(teachSeatWord(seat)):'')+'. Each goes past a belief and does not argue with it.</p>';
 if(hotNames.length)h+='<p class="tp-note">'+esc(hotNames.slice(0,2).join(' and '))+(hotNames.length>1?' are':' is')
  +' carrying, so the release comes first and the line follows.</p>';
 TEACH_REACH.forEach(function(rc){
  if(rc.r>reach.open+1){return;}
  var open=rc.r<=reach.open;
  h+='<div class="tp-reach'+(open?' open':' shut')+'"><div class="tp-rh"><b>'+esc(rc.nm)+'</b><span>'
   +(open?'Open':'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 016 0v3"/></svg>Locked')+'</span></div>';
  if(open){
   row.lines.filter(function(l){return l.r===rc.r;}).forEach(function(l){
    var isT=today&&today.line===l.line;
    h+='<div class="tp-line'+(isT?' today':'')+'">'
     +(isT&&form==='hold'?'<span class="tp-hold">'+esc(TEACH_HOLD_PREFIX)+'</span>':'')
     +'<span class="tp-lt">'+esc(l.line)+(isT?' <em>Today</em>':'')+'</span>'
     +'<span class="tp-past"><small>Goes past</small> '+esc(l.past)+'</span></div>';});
   if(rc.r===1)h+='<p class="tp-note">Hold the line at the '+esc(seat?teachSeatWord(seat):'place you feel it most')
    +' and read what the body does. A tight response is data. It is not a verdict on the line or on you.</p>';}
  else{
   h+='<p class="tp-note">'+esc(reach.next&&reach.next.r===rc.r?reach.next.say:'')+'</p>';}
  h+='</div>';});
 if(reach.open<TEACH_REACH.length-1)h+='<p class="tp-note">A further set opens after that one.</p>';
 if(reach.open===0)h+='<div class="rv-acts"><button type="button" class="btn pri" data-tpchoose="1">Choose '+esc(P.who)+'</button></div>';
 return h+'</div>';}
/* THE LIBRARY, in his order: his own saved rituals, then the practices that ship
   in the app, then a release when an address is carrying. The practices lane is
   ritTeachHtml, the section the old drill carried, so the start is the same
   button on the same writer. */
function teachLibHtml(P,R){
 var h='<div class="tp-sec"><div class="pm-eye">A ritual toward '+esc(P.word.toLowerCase())+'</div>'
  +'<p class="ad-p">The lines become a step in a ritual, between the breath and the practice.</p>';
 var saved=R.lanes[0];
 h+='<div class="tp-lane"><b>Your saved rituals</b>';
 if(saved.items.length)h+=saved.items.map(function(x){
   return '<div class="tp-sv"><span>'+esc(typeof ritName==='function'?ritName(x.steps):x.steps.join(', '))+'</span><small>'+esc(x.reason)+'</small></div>';}).join('')
   +'<div class="rv-acts"><button type="button" class="btn" data-tbgo="1">Open the ritual</button></div>';
 else h+='<p class="tp-note">'+esc(saved.empty)+'</p>';
 h+='</div>';
 h+='<div class="tp-lane"><b>Practices in the app</b>'+(typeof ritTeachHtml==='function'?ritTeachHtml(P.k):'')+'</div>';
 var rel=R.lanes[2];
 h+='<div class="tp-lane"><b>Release what the opposite is running</b>';
 if(rel.items.length){
  var x=rel.items[0];
  h+='<p class="ad-p">'+esc(rel.reason)+'</p><p class="tp-note">The '+esc(String(x.charge||'').toLowerCase())+' release, over '
   +esc(x.names.join(', '))+(x.rest?', with '+x.rest+' more waiting for the next run':'')+'.</p>'
   +'<div class="rv-acts"><button type="button" class="btn pri" data-tprel="1">Release these addresses</button></div>';}
 else h+='<p class="tp-note">'+esc(rel.empty)+'</p>';
 return h+'</div></div>';}
/* SHARING. Off by default. The switch is a real switch, the confirmation says
   exactly what is sent, and the list of who sees is empty until accounts exist.
   Revoking stops new views and cannot recall what was seen, and the panel says
   so. */
function teachShareHtml(P){
 var f=teachFocusOf(teachBlock(),P.k);
 var h='<div class="tp-sec"><div class="pm-eye">Share with your lead</div>';
 if(!f)return h+'<p class="tp-note">Choose this teacher to share it. Nothing is shared unless you switch it on.</p></div>';
 var on=!!(f.share&&f.share.on);
 h+='<button type="button" class="tp-sw'+(on?' on':'')+'" role="switch" aria-checked="'+on+'" data-tpshare="1">'
  +'<span>Share this teacher and the lines I have opened</span><i aria-hidden="true"></i></button>';
 if(on)h+='<p class="tp-note">On since '+esc(teachDate(f.share.at))+'. A lead sees only the teacher and which set is open. Never your marks, your words or your story.</p>'
  +'<div class="tp-seen"><b>Seen by</b><span>Seen by nobody. No lead is linked.</span></div>'
  +'<p class="tp-note">Turning it off stops new views at once. It cannot take back what a lead has already seen.</p>';
 else if(f.share&&f.share.at)h+='<p class="tp-note">Off since '+esc(teachDate(f.share.at))+'.</p>';
 else h+='<p class="tp-note">Off. Nothing about this teacher leaves this device.</p>';
 if(TP.confirm&&!on)h+='<div class="tp-conf" role="group" aria-label="Confirm sharing"><p><b>Share '+esc(P.who)+' with your lead?</b></p>'
  +'<p>This sends that you chose '+esc(P.who)+' and which set of lines is open.</p>'
  +'<p>It does not send the lines you marked as yours, any word you wrote, or your story.</p>'
  +'<p>Turning it off stops new views at once. It cannot take back what a lead has already seen.</p>'
  +'<div class="rv-acts"><button type="button" class="btn pri" data-tpgo="1">Share</button>'
  +'<button type="button" class="btn" data-tpno="1">Not now</button></div></div>';
 return h+'</div>';}
function teachHtml(P){
 var r=compute(), p=teachProf(), ctx=recipeCtx(), scan=recipeSniff(teachEntries());
 var recipe=recipeFor(P.k);
 var bl=recipeBlockers(p,P.k,{scan:scan,ctx:ctx}), ing=recipeIngredients(p,P.k,{scan:scan});
 var R=recipeToRitual(p,P.k,{ctx:ctx,saved:(typeof ritPlans==='function'?ritPlans():[])});
 var reach=teachReach(p,P.k), hotNames=[];
 bl.forEach(function(b){b.addrs.forEach(function(a){if(a.carrying&&hotNames.indexOf(a.k)<0)hotNames.push(a.k);});});
 if(!hotNames.length&&R.protocol)hotNames=R.protocol.names.slice();
 return teachRosterHtml(P)+'<div class="tp">'
  +teachWhoHtml(P,r)+teachOppHtml(P)+teachImpHtml(P)
  +teachRunningHtml(P,ctx,bl,ing)+teachRecipeHtml(P,recipe,ing)
  +teachLinesHtml(P,reach,hotNames,teachForm(r))+teachLibHtml(P,R)+teachShareHtml(P)
  +'<p class="tp-foot">These are behaviours a reading can place, not people. A line supports the work and does not cause a change. Nothing here diagnoses or treats anything.</p></div>';}

function teachWire(P){
 var box=document.getElementById('rdrill'); if(!box)return;
 box.querySelectorAll('[data-tpk]').forEach(function(b){
  b.onclick=function(){teachOpen(b.getAttribute('data-tpk'),'up');};});
 box.querySelectorAll('[data-tpmark]').forEach(function(b){
  b.onclick=function(){
   if(b.getAttribute('aria-disabled')==='true'){status('Choose this teacher before you mark what is yours.','fail');return;}
   teachMark(P.k,b.getAttribute('data-tpmark'));};});
 var ch=box.querySelector('[data-tpchoose]'); if(ch)ch.onclick=function(){teachChoose(P.k);};
 var sw=box.querySelector('[data-tpshare]');
 if(sw)sw.onclick=function(){
  var f=teachFocusOf(teachBlock(),P.k);
  if(f&&f.share&&f.share.on){teachShare(P.k,false);return;}
  TP.confirm=true; teachRedraw();};
 var go=box.querySelector('[data-tpgo]'); if(go)go.onclick=function(){TP.confirm=false; teachShare(P.k,true);};
 var no=box.querySelector('[data-tpno]'); if(no)no.onclick=function(){TP.confirm=false; teachRedraw();};
 /* THE RELEASE. relPick is the one runner. A worked example keeps the button and
    answers in the release's own words, and the marker says which teacher the run
    is toward so its start is logged when it lands. */
 var rel=box.querySelector('[data-tprel]');
 if(rel)rel.onclick=function(){
  if(typeof ritOwn==='function'&&!ritOwn()){status('Nothing released on a worked example.','fail');return;}
  var R=recipeToRitual(teachProf(),P.k,{ctx:recipeCtx(),saved:[]});
  if(!R||!R.protocol)return;
  rdClose(); RUN.toward=P.k; relPick(R.protocol.addrs);};
 /* the ritual's own wire, so a start is the same button on the same writer, and
    the panel says Active in place afterwards */
 if(typeof ritTeachWire==='function')ritTeachWire(function(){teachRedraw();});}

function teachCss(){
 if(document.getElementById('tp-css'))return;
 var st=document.createElement('style'); st.id='tp-css';
 st.textContent=[
  '.tp-roster{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}',
  '.tp-switch{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}',
  '.tp-chip{display:inline-flex;align-items:center;gap:8px;min-height:var(--tap,44px);padding:6px 12px 6px 8px;border-radius:999px;',
  ' border:1px solid var(--edge-2);background:transparent;color:var(--mid);font:inherit;font-size:13px;cursor:pointer}',
  '.tp-chip.on{border-color:var(--c,var(--accent));color:var(--ink);background:color-mix(in srgb,var(--c,var(--accent)) 14%,transparent)}',
  '.tp-chip .tp-ic{width:28px;height:28px}',
  '.tp-ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;flex:0 0 auto;border-radius:50%;',
  ' border:1.5px solid var(--c,var(--accent));color:var(--c,var(--accent))}',
  '.tp-ic svg{width:60%;height:60%;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
  '.tp-ic.big{width:48px;height:48px}',
  '.tp-ic.dash{border-style:dashed}',
  '.tp-who{display:flex;align-items:center;gap:12px;margin:0 0 10px}',
  '.tp-sec{margin:20px 0 0}',
  '.tp-note{margin:8px 0 0;font-size:13px;line-height:1.55;color:var(--dim)}',
  '.tp-blk{margin:10px 0;padding:6px 12px 10px;border:1px solid var(--edge);border-left:3px solid var(--c);border-radius:var(--r-s);background:var(--sunk)}',
  '.tp-blk.neg{border-left-style:dashed}',
  '.tp-blk-h{display:flex;align-items:center;gap:10px;padding:8px 0}',
  '.tp-blk-h b{display:block;font-size:14px;color:var(--c)}',
  '.tp-blk-h span{font-size:12.5px;color:var(--dim)}',
  '.tp-blk-h .tp-ic{width:30px;height:30px}',
  '.tp-row{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;gap:6px;padding:8px 0;border-top:1px solid var(--edge)}',
  '.tp-ch{font-size:12px;color:var(--dim)}',
  '.tp-tx{font-size:14.5px;line-height:1.5;color:var(--ink)}',
  '.tp-mark{width:44px;height:44px;min-width:44px;padding:0;border:0;background:transparent;color:var(--dim);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}',
  '.tp-mark svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
  '.tp-mark.on{color:var(--accent)}',
  '.tp-mark[aria-disabled=true]{opacity:.55}',
  '.tp-bl{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:10px}',
  '.tp-bli{display:block;padding:12px;border:1px solid var(--edge);border-radius:var(--r-s);background:var(--sunk)}',
  '.tp-bli b{display:block;font-size:14.5px;font-weight:600;color:var(--ink);margin-bottom:4px}',
  '.tp-bch{display:inline-block;margin:0 0 6px;font-size:12px;color:var(--dim)}',
  '.tp-ev{display:block;margin:6px 0;padding:0 0 0 10px;border-left:2px solid var(--edge-2);font-size:14px;line-height:1.55;color:var(--mid);quotes:none;font-style:normal}',
  '.tp-ev small{display:block;margin-top:2px;font-size:12px;color:var(--dim)}',
  '.tp-adr{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 4px}',
  '.tp-pill{display:inline-block;padding:3px 10px;border-radius:999px;border:1px solid var(--edge-2);font-style:normal;font-size:12.5px;color:var(--mid)}',
  '.tp-pill small{color:var(--dim);font-size:12px}',
  '.tp-pill.hot{border-color:var(--c);color:var(--ink);background:color-mix(in srgb,var(--c) 14%,transparent)}',
  '.tp-why{display:block;font-size:13px;color:var(--dim)}',
  '.tp-ing{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.tp-ing li{padding:8px 0;border-top:1px solid var(--edge)}',
  '.tp-ing b{display:block;font-size:14.5px;font-weight:500;color:var(--ink)}',
  '.tp-ing em{font-style:normal;font-size:12px;color:var(--dim);margin-right:6px}',
  '.tp-ing span{display:block;font-size:13px;color:var(--dim);margin-top:2px}',
  '.tp-ing li.have b{color:var(--good)}',
  '.tp-reach{margin:10px 0;padding:12px;border:1px solid var(--edge);border-radius:var(--r-s);background:var(--sunk)}',
  '.tp-reach.shut{border-style:dashed;opacity:.9}',
  '.tp-rh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px}',
  '.tp-rh b{font-size:15px;color:var(--ink)}',
  '.tp-rh span{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--accent)}',
  '.tp-reach.shut .tp-rh span{color:var(--dim)}',
  '.tp-rh svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
  '.tp-line{padding:10px 0;border-top:1px solid var(--edge)}',
  '.tp-line.today .tp-lt{color:var(--ink)}',
  '.tp-lt{display:block;font-size:15px;line-height:1.55;color:var(--mid)}',
  '.tp-lt em{font-style:normal;font-size:12px;color:var(--on-accent);background:var(--accent);padding:2px 8px;border-radius:999px;margin-left:6px;white-space:nowrap}',
  '.tp-past{display:block;margin-top:4px;font-size:13px;color:var(--dim)}',
  '.tp-past small{font-size:12px;margin-right:4px}',
  '.tp-hold{display:block;margin:0 0 6px;font-size:13px;color:var(--ink);font-weight:500}',
  '.tp-lane{margin:14px 0 0;padding:12px;border:1px solid var(--edge);border-radius:var(--r-s)}',
  '.tp-lane>b{display:block;font-size:14px;color:var(--ink);margin-bottom:6px}',
  '.tp-sv{display:flex;justify-content:space-between;gap:8px;padding:6px 0;font-size:14px;color:var(--mid)}',
  '.tp-sv small{font-size:12.5px;color:var(--dim)}',
  '.tp-sw{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:var(--tap,44px);padding:8px 12px;border:1px solid var(--edge-2);border-radius:var(--r-s);background:transparent;color:var(--ink);font:inherit;font-size:14px;text-align:left;cursor:pointer}',
  '.tp-sw i{position:relative;flex:0 0 44px;width:44px;height:26px;border-radius:999px;background:var(--panel-2);border:1px solid var(--edge-2)}',
  '.tp-sw i::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:var(--dim);transition:transform var(--t-element) var(--ease-out)}',
  '.tp-sw.on i{background:color-mix(in srgb,var(--accent) 40%,var(--panel-2))}',
  '.tp-sw.on i::after{transform:translateX(18px);background:var(--accent)}',
  '.tp-seen{display:flex;flex-direction:column;gap:2px;margin:10px 0 0;padding:10px 12px;border:1px solid var(--edge);border-radius:var(--r-s);background:var(--sunk);font-size:13px;color:var(--dim)}',
  '.tp-seen b{font-size:13px;color:var(--ink)}',
  '.tp-conf{margin:12px 0 0;padding:12px;border:1px solid var(--accent);border-radius:var(--r-s)}',
  '.tp-conf p{margin:0 0 8px;font-size:14px;line-height:1.55;color:var(--mid)}',
  '.tp-conf p b{color:var(--ink)}',
  '.tp-foot{margin:22px 0 0;padding-top:14px;border-top:1px solid var(--edge);font-size:13px;line-height:1.55;color:var(--dim)}',
  '.tp .rv-acts{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0}',
  '@media (max-width:760px){.tp-chip span{font-size:12.5px}.tp-row{grid-template-columns:40px 1fr 44px}}'].join('\n');
 document.head.appendChild(st);}
