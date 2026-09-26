/* ============================================================
   TRACE AND RELEASE. DB in TASKS.md, 26 September.

   His words, in full: "being able to pin it's good, and being able to share
   that pin with someone and say, this is where my pain hurts, this is my
   saboteur, I want to run a protocol from here... that's the power of this,
   dude, that whole could be the whole mechanic of the release mechanic,
   trace and release, give me a simulation of that as well, that gamifies
   the fuck out of it, makes it super sticky."

   THE LOOP, as this page runs it
     trace     rest on a line, the chain traces and hums by its charge
     pin       click it, the chain holds still and stays lit
     name      say what it is: his two examples, one from his Share note,
               or his own words. The label sits on the Field beside the pin.
     release   "Run a release from here" opens the SHIPPED release, in the
               shipped build, on the addresses that feed this chain's
               saboteur, heaviest first, up to eight, which is the same cap
               the Field's own Release button uses (ui/personas.js)
     return    when the release card closes, the chain's charge is read back
               out of that build, and the pin traces again and hums at what
               is left. The card shows before and after.

   That last step is the sticky part, and it is real: the hum is how much
   charge the line carries, so a line that hummed hard before a release hums
   less after it, by the amount the engine actually moved. Nothing here
   invents a reward.

   WHAT THE RELEASE IS, read from ui/release.js and not assumed. A run is a
   plan of thought lines, one pattern each: every address in the queue is
   run through four channels, right limit, left limit, right truth, left
   truth, capped at 25 patterns a run and at what the allowance has left.
   An opening of three lines, then a card per line, then cool down: each
   address loses 21 percent of its weight plus 2, clears at 6 or under, and
   the coherent opposite installs at 62 percent of what it lost.

   ONE REFUSAL, LIFTED HERE AND SAID SO. The shipped build will not release
   a worked example (relCoolDown, "Nothing released on a worked example."),
   and James, Sofia and Gordon are worked examples. Left alone, the run would
   walk to its end and refuse. So by default this page, inside its own copy
   of the build, lets the run finish as if the example were the person's own
   record. A switch on the card puts the refusal back.

   THE MOVE INTO THE RELEASE, pose to pose, 1.0 seconds, which is past the
   600ms a context change is allowed and has a reason: it is the moment a
   person commits, and it carries what the run will open.
     0 to 120      anticipation, the pin head squeezes to eight tenths
     120 to 480    a bright head runs the chain outward, from its character
                   back to its address, 90ms a hop: back to where it starts
     360 to 960    the lines the run will open light one by one, 60ms apart,
                   each traced inward in 180ms, and their address beads ring
     1000          the real build rises over the page, 380ms on the arriving
                   curve, 16px up
   Any press during it skips straight to the release. Reduced motion goes
   straight there.
   ============================================================ */
(function(){
'use strict';
var X=window.OVL_LIB,E=X.E,clamp=X.clamp,mix=X.mix,rgba=X.rgba,WHITE=X.WHITE,fine=window.OVL_HOVER_N.fine,alphaOf=window.OVL_HOVER_N.alphaOf;
var q=new URLSearchParams(location.search);
var APP=q.get('app')||(document.querySelector('meta[name=app]')||{}).content||'../../source.html';
var SPEED=q.get('speed')?+q.get('speed'):null;
var LABELS=['This is my saboteur','This is where my pain hurts','This is what I am going through'];
var SQUEEZE=120,HOP_R=90,QS=360,QSTAG=60,QD=180,OPEN_AT=1000,STAGE_IN=380,STAGE_OUT=240,QMAX=8;
var P=null,R={active:null,g:null,stage:{want:false,at:-1e9},fr:null,W:null,ready:false,results:{},lift:true,tags:{},check:null,seen:false};
var $=function(id){return document.getElementById(id);};
function now(){return P.clock.now();}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function pc(x){return Math.round(x*10);}

/* ---- the pin's own queue: every address feeding its saboteur that holds
   any charge, heaviest first ---- */
function queueOf(p){var G=P.G(),sab=p.path[0].lv===0?p.path[0].to:null;if(!sab)return [];
 return G.links.filter(function(l){return l.lv===0&&l.to===sab&&l.load>0;})
  .sort(function(a,b){return b.load-a.load;}).slice(0,QMAX);}
function nodeName(id){return P.G().nodes[id].nm;}

/* RUNNING A LINE INSIDE THE BUILD. The build's own state lives in top level
   const bindings, S, PEOPLE, TAB, which are not properties of its window, so
   the only way to reach them from here is to run source inside it. W.eval
   does that. A published page can sit under a policy that refuses eval, so
   when eval is refused, and only then, the same source runs as an inline
   script in the build's own document, which lands in the same global scope
   and sees the same bindings. An error thrown by the source itself is not a
   refusal and still comes back as an error. */
function evalIn(W,src){
 try{return W.eval(src);}
 catch(e){if(!e||e.name!=='EvalError')throw e;}
 var d=W.document,s=d.createElement('script');W.__ev=undefined;
 s.textContent='window.__ev=('+src+');';(d.head||d.documentElement).appendChild(s);s.remove();
 var v=W.__ev;W.__ev=undefined;return v;}
/* ============================================================
   THE REAL BUILD, in a frame, same origin, loaded once per profile and
   width, ahead of need, since it takes three seconds to boot
   ============================================================ */
function makeFrame(){
 var box=$('box'),st=P.st;
 if(R.fr)R.fr.remove();R.ready=false;R.W=null;$('wait').style.display='';$('wait').textContent='Opening the instrument';
 var f=document.createElement('iframe');f.className='frame';f.title='The shipped build';f.src=APP;
 var fw=st.w===1600?1600:390,fh=st.w===1600?1000:844;f.width=fw;f.height=fh;f.style.width=fw+'px';f.style.height=fh+'px';
 f.style.opacity='0';box.appendChild(f);R.fr=f;R.fw=fw;R.fh=fh;
 var who=st.who,t0=Date.now();
 f.addEventListener('load',function(){
  (function poll(){
   var W=f.contentWindow,ok=false;
   try{ok=W.document.body&&W.document.body.classList.contains('booted');}catch(e){
    $('wait').textContent='This page has to be served, not opened as a file, to reach the build beside it. Run a local server from the repository root.';return;}
   if(!ok){if(Date.now()-t0<25000)setTimeout(poll,120);else $('wait').textContent='The build did not finish opening.';return;}
   prep(W,who);})();});
 layoutStage();}
/* the state capture.js put the plates in, step for step, so the build in
   the frame is the build the chords were taken from */
function prep(W,who){
 var r=evalIn(W,'(function(nm,lines){'
  +'var i=PEOPLE.findIndex(function(x){return x.nm===nm;});loadP(i);'
  +'lines.forEach(function(t,k){applyStory(t);verpApply(t);if(typeof leanApply==="function")leanApply(t);'
  +' if(CURP){CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);'
  +'  CURP.story.entries.push({t:"2026-09-2"+k+"T08:00:00Z",text:t,imprints:ps.imprints.length,bands:ps.bands});}});'
  +'setTab(TAB.FIELD);if(typeof fviewSet==="function")fviewSet("wheel");S.zoom=1;S.panx=0;S.pany=0;'
  +'var ch=[].slice.call(document.querySelectorAll("#vbar .vt")).filter(function(b){return /Chains/.test(b.textContent);})[0];'
  +'if(ch)ch.click();S.pin=null;if(typeof layout==="function")layout();render();return S.who;})')
  (who,(STORYBANK[who]||[]).map(function(x){return x[1];}));
 /* the one refusal, wrapped so a switch can lift it. relTick and the Stop
    button both call relCoolDown by its global name, so both come through */
 evalIn(W,'(function(){var f=relCoolDown;window.__who0=S.who;relCoolDown=function(){'
  +'if(window.__lift)S.who=0;try{return f.apply(this,arguments);}finally{S.who=window.__who0;}};})()');
 W.__lift=R.lift;
 R.W=W;R.get=evalIn(W,'(function(){return {open:RUN.open,phase:RUN.phase};})');
 R.read=evalIn(W,'(function(){var R=compute(),o={a:{},s:{},c:{},h:{},u:{}};'
  +'W.forEach(function(n){o.a[n.i]=n.sq||0;});'
  +'function put(m,L){var seen={};L.forEach(function(x){seen[x.nm]=(seen[x.nm]||0)+1;m[x.nm+"#"+seen[x.nm]]=x.w||0;});}'
  +'put(o.s,R.sabs);put(o.c,R.cxs);put(o.h,R.hys);put(o.u,R.sups);'
  +'return {o:o,EX:R.EX,CQ:R.CQ};})');
 /* and a check that it is the same field: every chord's load, read back out
    of this build, against the load capture.js wrote */
 var G=P.G(),rd=R.read(),bad=0,worst=0;
 G.links.forEach(function(l){var v=loadIn(rd.o,l);var d=Math.abs(v-(l.load0!=null?l.load0:l.load));if(d>.01)bad++;worst=Math.max(worst,d);});
 R.check={n:G.links.length,bad:bad,worst:worst,who:r};
 window.__releaseCheck=R.check;
 R.ready=true;$('wait').style.display='none';R.fr.style.opacity='1';
 P.renderPins();}
/* a node's weight in a reading of the build, by its kind and its name, and
   nought for a pattern the release has dissolved. TWO PATTERNS CAN SHARE A
   NAME: James carries two saboteurs called Loner and two called Avoider, and
   matching by name alone put one's weight on the other, which the check
   below caught as 2 chords of 141 out by up to 2.5. So a name is keyed with
   how many of the same name came before it, in the engine's own order, on
   both sides. */
var OCC=null;
function occKey(id){
 if(!OCC){OCC={};var G=P.G(),seen={};
  Object.keys(G.nodes).filter(function(k){return k[0]!=='a';})
   .sort(function(a,b){return a[0]<b[0]?-1:a[0]>b[0]?1:(+a.slice(1))-(+b.slice(1));})
   .forEach(function(k){var nm=G.nodes[k].nm,t=k[0]+nm;seen[t]=(seen[t]||0)+1;OCC[k]=nm+'#'+seen[t];});}
 return OCC[id];}
function nodeIn(o,id){var k=id[0],v=k==='a'?o.a[+id.slice(1)]:o[k][occKey(id)];return v==null?0:v;}
function loadIn(o,l){return nodeIn(o,l.from);}
function routeIds(p){return [p.path[0].from].concat(p.path.map(function(l){return l.to;}));}
function layoutStage(){
 if(!R.fr)return;var b=$('box').getBoundingClientRect(),pad=12;
 var s=Math.min(1,(b.width-2*pad)/R.fw,(b.height-2*pad)/R.fh);if(!(s>0))s=.5;
 R.fr.style.transform='scale('+s+')';
 R.fr.style.left=((b.width-R.fw*s)/2)+'px';R.fr.style.top=Math.max(pad,(b.height-R.fh*s)/2)+'px';}
addEventListener('resize',layoutStage);

/* ============================================================
   THE MOVE INTO THE RELEASE, and the way back
   ============================================================ */
function run(p){
 if(!R.ready){P.say('The instrument is still opening. A moment.','warn',2000);return;}
 var t=now();R.active=p;
 P.ov().hover(null,t);
 R.g={p:p,at:t,queue:queueOf(p),open:false};
 if(P.st.rm)openStage(t);}
function openStage(t){
 var g=R.g;if(!g||g.open)return;g.open=true;
 var ids=g.queue.map(function(l){return +l.from.slice(1);});
 R.W.__lift=R.lift;
 evalIn(R.W,'(function(ids,sp){relPick(ids);if(sp)RUN.speed=sp;})')(ids,SPEED);
 R.before=R.read();R.seen=true;
 var p=g.p,r=P.route(p.line);
 $('from').innerHTML='<i style="color:'+P.colOf(p)+'">'+p.num+'</i><span>From your pin'
  +(p.label?': <b>'+esc(p.label)+'</b>':'')+'. '+esc(r[0])+' to '+esc(r[r.length-1])+', '+ids.length+(ids.length===1?' address':' addresses')+'.</span>';
 R.stage.want=true;R.stage.at=t;$('stage').setAttribute('aria-hidden','false');
 layoutStage();
 try{R.fr.focus();}catch(e){}}
function closeStage(){
 var t=now();if(!R.stage.want)return;
 try{if(R.get().open)evalIn(R.W,'relClose()');}catch(e){}
 R.stage.want=false;R.stage.at=t;$('stage').setAttribute('aria-hidden','true');
 var p=R.g&&R.g.p;R.g=null;if(!p)return;
 /* read the whole field back, and move every chord to what the build now
    says, since a release lifts laws and reshapes complexes beyond the one
    chain. The chords keep their places: this is the charge, not a redraw */
 var rd=R.read(),G=P.G();
 var ids=routeIds(p),W0=p.W,before=ids.map(function(id){return nodeIn(R.before.o,id);});
 G.links.forEach(function(l){if(l.load0==null)l.load0=l.load;l.load=loadIn(rd.o,l);
  /* a pattern the release dissolved takes its lines with it: they let go on
     the Field, 420ms on the leaving curve, once the page is back */
  var gone=['from','to'].some(function(e){var id=l[e];return id[0]!=='a'&&nodeIn(R.before.o,id)>0&&nodeIn(rd.o,id)===0;});
  if(gone&&!l.gone){l.gone=true;l.goneAt=t+STAGE_OUT+180;}});
 P.ov().reweigh();
 var after=ids.map(function(id){return nodeIn(rd.o,id);});
 var moved=after.some(function(v,i){return Math.abs(v-before[i])>.005;});
 R.results[p.id]={before:before,after:after,W0:W0,W1:p.W,moved:moved,EX0:R.before.EX,EX1:rd.EX,
  addr0:before[0],addr1:after[0]};
 window.__releaseResult=R.results[p.id];
 /* and the chain traces again, once the page is back, at what is left */
 if(moved)P.ov().replay(p.line,t+STAGE_OUT+180,3200);
 P.renderPins();}
$('back').addEventListener('click',closeStage);
addEventListener('keydown',function(ev){if(ev.key==='Escape'&&R.stage.want)closeStage();});
/* a press during the move skips to the release */
document.addEventListener('pointerdown',function(){if(R.g&&!R.g.open&&!P.st.rm)openStage(now());},true);

/* ============================================================
   THE FRAME: the move, the stage, the labels, and watching the build
   ============================================================ */
function frame(t,s){
 var ov=P.ov(),g=ov.g;
 /* the move, drawn on the overlay's own canvas, which ov.frame has left in
    the Field's coordinates */
 var G=R.g;
 ov.pins.forEach(function(p){p.squeeze=1;});
 if(G&&!P.st.rm){var el=t-G.at,p=G.p,path=p.path,n=path.length;
  if(el<SQUEEZE*2)p.squeeze=1-.2*Math.sin(Math.PI*clamp(el/(SQUEEZE*2),0,1));
  /* outward, from the character back to the address */
  for(var j=n-1;j>=0;j--){var l=path[j],st0=SQUEEZE+(n-1-j)*HOP_R,k=(el-st0)/(HOP_R*1.3);
   if(k<=0||k>=1.6)continue;var F=fine(l),a=alphaOf(p.W),c=mix(l.col,WHITE,.6);
   if(k<1){var pos=X.at(l.S,1-E.io(k));
    X.disc(g,pos[0],pos[1],8,l.col,.22);X.disc(g,pos[0],pos[1],2.8,mix(l.col,WHITE,.85),.95);}
   var fade=k<1?1:1-(k-1)/.6;
   g.strokeStyle=rgba(c,.5*a*fade);g.lineWidth=l.w*1.35+1.2;
   seg(g,F,k<1?1-E.io(k):0,1);}
  /* what the run will open, one line at a time */
  G.queue.forEach(function(l,i){var k=(el-QS-i*QSTAG)/QD;if(k<=0)return;
   var F=fine(l),kk=E.io(clamp(k,0,1)),c=mix(l.col,WHITE,.25);
   g.strokeStyle=rgba(c,.9*alphaOf(p.W));g.lineWidth=l.w*1.35;seg(g,F,0,kk);
   var nd=ov.nodes[l.from];if(nd&&k<1.4){var r=clamp(k/1.4,0,1);
    X.ring(g,nd.p[0],nd.p[1],nd.s+3+5*E.out(r),mix(l.col,WHITE,.6),.85*(1-r),1.4);}});
  if(el>=OPEN_AT&&!G.open)openStage(G.at+OPEN_AT);}
 /* the stage */
 var S=R.stage,k2=t-S.at,f=P.st.rm?(S.want?1:0):(S.want?E.out(clamp(k2/STAGE_IN,0,1)):1-E.in(clamp(k2/STAGE_OUT,0,1)));
 var sg=$('stage');sg.style.opacity=f.toFixed(3);sg.style.visibility=f>0?'visible':'hidden';
 $('box').style.transform='translateY('+((1-f)*16).toFixed(2)+'px)';
 /* the build's own card closing is the way back too */
 if(S.want&&R.W&&k2>600){var st=R.get();if(!st.open)closeStage();}
 paintTags(t);}
/* part of a fine chord, from share a to share b */
function seg(g,F,a,b){var i0=Math.round(clamp(a,0,1)*(F.n-1)),i1=Math.round(clamp(b,0,1)*(F.n-1));if(i1-i0<1)return;
 g.beginPath();g.moveTo(F.pts[i0][0],F.pts[i0][1]);for(var i=i0+1;i<=i1;i++)g.lineTo(F.pts[i][0],F.pts[i][1]);g.stroke();}
/* ---- the labels on the Field ---- */
function paintTags(t){
 var ov=P.ov(),fv=P.fv(),view=fv.el.view,seen={};
 ov.pins.forEach(function(p){
  if(!p.label)return;seen[p.id]=1;
  var tg=R.tags[p.id];
  if(!tg||tg.el.parentNode!==view){tg={el:document.createElement('div'),text:null,at:t};tg.el.className='tag';view.appendChild(tg.el);R.tags[p.id]=tg;}
  if(tg.text!==p.label){if(tg.text==null||!tg.shown)tg.at=t;tg.text=p.label;
   tg.el.innerHTML='<i>'+p.num+'</i><span>'+esc(p.label)+'</span>';tg.el.style.borderColor=P.colOf(p);tg.el.style.color=P.colOf(p);
   tg.el.querySelector('span').style.color='var(--ink)';}
  var a=ov.tagAt(p);if(!a)return;var v=fv.toView(a.x,a.y),w=tg.el.offsetWidth,h=tg.el.offsetHeight;
  var vw=view.clientWidth,vh=view.clientHeight;
  var x=a.ux>=0?v[0]:v[0]-w,y=v[1]-h/2;
  x=clamp(x,4,vw-w-4);y=clamp(y,4,vh-h-4);
  var el=t-tg.at,fi=P.st.rm?1:E.out(clamp(el/220,0,1));
  if(p.tOff!=null)fi*=P.st.rm?0:1-E.in(clamp((t-p.tOff)/180,0,1));
  tg.shown=fi>0;
  var dx=-a.ux*(1-fi)*6,dy=-a.uy*(1-fi)*6;
  tg.el.style.left=x+'px';tg.el.style.top=y+'px';tg.el.style.opacity=fi.toFixed(3);
  tg.el.style.transform='translate('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px)';});
 Object.keys(R.tags).forEach(function(id){if(!seen[id]){R.tags[id].el.remove();delete R.tags[id];}});}

/* ============================================================
   THE CARD
   ============================================================ */
var cardSig=null;
function renderCard(host,live){
 var act=R.active&&live.indexOf(R.active)>=0?R.active:live[live.length-1]||null;R.active=act;
 var res=act&&R.results[act.id];
 var sig=live.map(function(p){return p.id;}).join(',')+'|'+(act?act.id:'')+'|'+(res?'r':'')+'|'+(R.ready?1:0)+'|'+R.lift+'|'+(act?act.W.toFixed(3):'');
 if(sig===cardSig){syncChips(host,act);return true;}cardSig=sig;
 if(!act){host.innerHTML='<div class="card"><h2>Trace, pin, release</h2>'
  +'<p>'+(P.st.w===390?'Tap a line and its whole chain traces and hums. Tap Pin to hold it.':'Rest on a line and its whole chain traces and hums by its charge. Click it to pin the chain.')+'</p>'
  +'<p class="note">Then say what the chain is, and run a release from it. The release that opens is the shipped one, running here in its own frame.</p>'
  +'<p class="note" id="rd">'+(R.ready?'The build is open and ready.':'Opening the build in the background.')+'</p></div>';return true;}
 var G=P.G(),r=P.route(act.line),path=act.path,qu=queueOf(act),sab=nodeName(path[0].to);
 var out='';
 if(live.length>1)out+='<div class="others">'+live.map(function(p){
  return '<button type="button" data-act="'+p.id+'" aria-pressed="'+(p===act)+'"><span style="color:'+P.colOf(p)+'">'+p.num+'</span> '
   +esc(p.label||P.route(p.line)[0])+'</button>';}).join('')+'</div>';
 out+='<div class="card"><div class="eye"><i style="color:'+P.colOf(act)+'">'+act.num+'</i>Pinned chain</div><ol class="route">';
 var ids=routeIds(act);
 r.forEach(function(nm,i){
  var cell;
  if(res){var b=res.before[i],a=res.after[i];
   cell=(i>0&&b>0&&a===0)?'<em><s>'+pc(b)+'</s><b>no longer forms</b></em>'
    :Math.abs(a-b)>.005?'<em><s>'+pc(b)+'</s><b>'+pc(a)+'%</b></em>':'<em>'+pc(a)+'%</em>';}
  else cell='<em>'+pc(G.nodes[ids[i]].load)+'%</em>';
  out+='<li class="lv'+i+'"><span>'+esc(nm)+'</span>'+cell+'</li>';});
 out+='</ol>';
 out+='<div class="q">What is it?</div><div class="chips">'+LABELS.map(function(L){
  return '<button type="button" data-lab="'+esc(L)+'" aria-pressed="'+(act.label===L)+'">'+esc(L)+'</button>';}).join('')+'</div>'
  +'<input class="own" id="own" placeholder="Or name it yourself" maxlength="48" value="'+esc(LABELS.indexOf(act.label)<0?act.label:'')+'">';
 out+='<div class="q">A release from here opens the addresses that feed '+esc(sab)+', heaviest first.</div>'
  +'<div class="qlist">'+qu.length+(qu.length===1?' address: ':' addresses: ')+qu.map(function(l){return esc(nodeName(l.from))+' '+pc(l.load);}).join(', ')+'.</div>'
  +'<button type="button" class="run" id="run">Run a release from here</button>'
  +'<label class="lift"><input type="checkbox" id="lift"'+(R.lift?' checked':'')+'><span>Let the run finish on this example. The shipped build refuses to release a worked example and says so. Ticked, this page lifts that one refusal inside its own copy, so the run can be seen to its end. Nothing leaves this page.</span></label>';
 if(res){var brk=-1;res.after.forEach(function(a,i){if(brk<0&&i>0&&res.before[i]>0&&a===0)brk=i;});
  out+='<div class="after">'+(res.moved
   ?'Released. '+esc(r[0])+' <s>'+pc(res.addr0)+'</s> <b>'+pc(res.addr1)+' percent</b>, chain weight <s>'+pc(res.W0)+'</s> <b>'+pc(res.W1)+'</b>. '
    +(brk>0?'The chain broke at '+esc(r[brk])+', which no longer forms, and its lines let go. ':'')
    +'Expression '+res.EX0.toFixed(1)+' to '+res.EX1.toFixed(1)+'. Rest on the chain to feel what is left.'
   :'Nothing moved. The release card closed without a run, or the run was refused.')+'</div>';}
 out+='<p class="note" style="margin-top:10px">'+(R.ready?'':'Opening the build in the background. ')+(R.check?'The build in the frame agrees with every chord on this Field: '+(R.check.n-R.check.bad)+' of '+R.check.n+' loads match.':'')+'</p>';
 out+='</div>';
 host.innerHTML=out;
 host.querySelectorAll('[data-act]').forEach(function(b){b.addEventListener('click',function(){
  R.active=P.ov().live().filter(function(p){return p.id===+b.dataset.act;})[0]||null;cardSig=null;P.renderPins();});});
 host.querySelectorAll('[data-lab]').forEach(function(b){b.addEventListener('click',function(){
  act.label=act.label===b.dataset.lab?'':b.dataset.lab;var o=$('own');if(o)o.value='';syncChips(host,act);});});
 var own=$('own');own.addEventListener('input',function(){act.label=own.value.trim();syncChips(host,act);});
 $('run').addEventListener('click',function(){run(act);});
 $('lift').addEventListener('change',function(){R.lift=this.checked;if(R.W)R.W.__lift=R.lift;});
 return true;}
function syncChips(host,act){if(!act)return;
 host.querySelectorAll('[data-lab]').forEach(function(b){b.setAttribute('aria-pressed',String(act.label===b.dataset.lab));});
 var rd=$('rd');if(rd)rd.textContent=R.ready?'The build is open and ready.':'Opening the build in the background.';}

P=window.PINPAGE({mode:'release',sideW:420,close:true,hooks:{
 mount:function(api){P=api;
  /* a profile or width change starts clean: loads back to what was captured
     and a fresh build in the frame */
  var G=api.G();G.links.forEach(function(l){if(l.load0!=null)l.load=l.load0;});
  api.ov().reweigh();
  Object.keys(R.tags).forEach(function(id){R.tags[id].el.remove();});R.tags={};
  R.active=null;R.results={};R.g=null;R.stage.want=false;cardSig=null;
  OCC=null;G.links.forEach(function(l){l.gone=false;});
  makeFrame();},
 toggle:function(r){if(r.op==='pin'){R.active=r.pin;cardSig=null;}},
 renderPins:renderCard,
 frame:frame,
 keepHold:function(ev){return !!(ev.target.closest&&ev.target.closest('.side'));}}});
window.__release=R;
})();
