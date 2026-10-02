/* ============================================================
   THE READINGS ARE LINES, round PD, built from mockups/rail-lines (rounds OM,
   OO, OR, OT, OV, OX and PC in TASKS.md).

   WHAT HE RULED, in the order it landed. The rail's readings were six bars
   with their names written in them, a vertical wire down the left, a caption
   for Radiance that had no bar, two dials under them and a switch for the
   dials' style. He asked for one line per reading, the mark inside the line
   at the left and the figure at the right, and nothing standing free. Names
   live in the tooltip and in the reading a press opens on the right, which is
   where the full word and the numbers are now.

   THE PAIR. Coherence and decoherence are two systems pulling on each other,
   so they are one solid bar of two colours and the line where they meet is
   the termination point. Its x is CQ's share of the bar, and it OSCILLATES by
   cqRange (ui/personas.js) on the drift renderPol2 writes (cqDrift), so the
   edge and the compass's marker are one motion drawn twice. The bar is a
   hundred points wide, so the range in points is the range in per cent of
   the bar and nothing is converted to pixels. The two words on screen are CQ
   and DQ and the figures sit inside the ends, painted twice so a letter
   changes ink where the colour does. The hard edge leaves a faint trail of
   where it was in the last three seconds, so a wide swing leaves a wide smear
   and a settled person leaves none.

   THE SEVEN MARKS ARE A STRIP UNDER THE BAR and not inside it. In the mockup
   they stood inside the DQ colour and were clipped to it, so a person at CQ
   of 90 had a DQ side nine points wide and the marks had nowhere to stand.
   The strip is the bar's whole width whatever the edge does, so they never
   clip.

   ONE DOOR EACH. The bar is drawn once and pressed in two halves: two
   transparent buttons laid over it, split at CQ's mean position and held at
   the 44 pixel floor in both directions, so a bar with CQ at 3 still has a CQ
   door the size of a finger. Each opens its own reading on the right.

   THE OTHER LINES. Vitality, awareness, will and radiance are rbRow
   (ui/component.js) with a seat's colour and no word. Flow is a live band, the
   seven seats' wave in their colours with dotted limits for the room the
   shadow leaves. Orientation and balance are the pair's grammar with a static
   edge: two colours, a mark inside each end and its figure.

   STILL. Reduced motion, body.quiet and body.rm draw one settled state: the
   edge at CQ, no trail, the wave at phase zero. A near blank profile draws
   dashes and empty tracks, no edge and no oscillation, because a bar must not
   claim a reading nobody entered.

   COST. The edge is three clip paths written only when it has moved a tenth
   of a point, the trail is written at twenty a second, and the wave is seven
   path strings. Nothing here reads layout in the frame: every element is
   found when the rail is rendered and kept. A throw in the frame would end
   requestAnimationFrame for the session, so it is held, and a failure stops
   this layer and goes once to the console.
   ============================================================ */
var RLN={pair:null,wv:null,dead:false,who:'',trT:0,rate:1.5,TRAIL:3.0,NT:24};
function rlnFail(e){RLN.dead=true;
 try{console.error('raillines stopped: '+(e&&e.message?e.message:e));}catch(x){}}
function rlnEdge(cq,band,t){return Math.max(0,Math.min(100,cq+cqDrift(t)*(band/2)));}
/* the marks the pair and the two split lines carry. The halo and the pitchfork
   are the compass's own two ends (ui/personas.js renderPol2) redrawn on the 24
   grid with the same ring terminals. Ring, never fill. */
var RLN_IC={
 halo:'<ellipse cx="12" cy="7.2" rx="7.4" ry="2.9"/><path d="M5.4 19.6Q12 11.6 18.6 19.6"/>',
 fork:'<path d="M12 21V10.5M5 10.5h14M5.6 10.5V4M12 10.5V3M18.4 10.5V4"/>'};
function rlnSvg(inner){return '<svg class="rl-li" viewBox="0 0 24 24" aria-hidden="true">'+inner+'</svg>';}

/* ============================================================
   THE PAIR
   ============================================================ */
function rlnPairTxt(un){
 return '<span class="rl-tl">'+rlnSvg(RB_IC.cq)+'<b>CQ</b><i data-n="cq">'+(un?'–':'')+'</i></span>'
  +'<span class="rl-tr"><i data-n="dq">'+(un?'–':'')+'</i><b>DQ</b>'+rlnSvg(RB_IC.dq)+'</span>';}
function rlnPairBuild(host,un){
 var trail='';
 for(var i=0;i<RLN.NT;i++)trail+='<rect y="0" height="100" width="0" style="opacity:'+(.30*Math.pow(1-i/RLN.NT,2)).toFixed(3)+'"/>';
 host.innerHTML='<div class="rl-pair'+(un?' rl-off':'')+'" id="rlpair">'
  +'<span class="rl-cqL" aria-hidden="true"></span>'
  +'<svg class="rl-trl" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+trail+'</svg>'
  +'<span class="rl-tx rl-base" aria-hidden="true">'+rlnPairTxt(un)+'</span>'
  +'<span class="rl-tx rl-over" aria-hidden="true">'+rlnPairTxt(un)+'</span>'
  +'<button type="button" class="kb rl-hit rl-hit-cq" data-q="cq" data-fk="laws"><span class="rb-d" aria-hidden="true"></span></button>'
  +'<button type="button" class="kb rl-hit rl-hit-dq" data-q="dq" data-fk="shadow"><span class="rb-d" aria-hidden="true"></span></button>'
  +'</div>'
  +'<div class="rl-seats'+(un?' rl-off':'')+'" aria-hidden="true">'
  +BANDS.map(function(b,i){return '<s style="--k:'+seatCol(b)+';--q:'+i+'"><b><u></u></b></s>';}).join('')+'</div>';
 host.setAttribute('data-sig',un?'u':'r');}
/* a change in a figure says by how much for 2.4 seconds, the chip every row
   carries (rbChip in ui/component.js), on the door that owns the figure */
function rlnChip(b,d,bad){
 var c=b.querySelector('.rb-d'); if(!c)return;
 var now=performance.now(), R=b._chip||(b._chip={t:-1e9,sum:0});
 var up=(now-R.t<RB_CHIP)&&((R.sum>0)===(d>0));
 R.sum=up?R.sum+d:d; R.t=now;
 c.textContent=(R.sum>0?'+':'−')+Math.abs(R.sum);
 c.className='rb-d on'+(bad&&R.sum>0?' bad':'');
 if(rbStill()){
  /* every CSS animation is off at the root under reduced motion, so the chip
     is held lit by its class and put away by a timer, once, as rbChip does */
  c.classList.add('st'); clearTimeout(R.to);
  R.to=setTimeout(function(){c.className='rb-d';},RB_CHIP);}
 else{c.style.animation='none'; void c.offsetWidth; c.style.animation='';}}
function rlnPair(r){
 var host=$('key'); if(!host)return;
 var un=!!r.unread, sig=un?'u':'r';
 if(host.getAttribute('data-sig')!==sig)rlnPairBuild(host,un);
 var P=host.querySelector('.rl-pair'); if(!P)return;
 var cq=un?0:r.CQ, dq=un?0:r.DQ, rg=cqRange(cq), band=rg.band;
 var who=((typeof CURP!=='undefined'&&CURP&&CURP.id)||'')+':'+S.who, arrival=(who!==RLN.who);
 /* the two doors split at CQ's mean position, held at the floor each way by
    the sheet (.rl-hit), so the share is all the script writes */
 P.style.setProperty('--h',(un?50:cq).toFixed(1)+'%');
 var cb=P.querySelector('.rl-hit-cq'), db=P.querySelector('.rl-hit-dq');
 var ci=P.querySelectorAll('i[data-n=cq]'), di=P.querySelectorAll('i[data-n=dq]');
 var nc=un?'–':String(Math.round(cq)), nd=un?'–':String(Math.round(dq));
 /* the chips, off the rounded figures the bar prints, and not on a first
    sight or on somebody else's reading: switching person moves both figures
    to a stranger's and that is not an edit */
 if(!un&&!arrival&&RLN.pair){
  var oc=+RLN.pair.nc, od=+RLN.pair.nd;
  if(isFinite(oc)&&+nc!==oc)rlnChip(cb,+nc-oc,false);
  if(isFinite(od)&&+nd!==od)rlnChip(db,+nd-od,true);}
 ci.forEach(function(e){e.textContent=nc;}); di.forEach(function(e){e.textContent=nd;});
 var tier=un?'':(r.complete?'The '+SI.length+' laws, summed.':tierSay(r)+'.');
 var tCQ='Coherence '+(un?'not read yet.':Math.round(cq)+' of 100. '+tier
  +(r.PULL>0.003?' Decoherence is holding '+(r.CQ-r.EX).toFixed(0)+' points of it back, so what gets out is '+Math.round(r.EX)+'.':'')
  +' It is the colour on the left. The edge stands at '+Math.round(cq)+' and swings by how far coherence wanders, '
  +band.toFixed(1)+' points here, the same range the compass draws.');
 var tDQ='Decoherence '+(un?'not read yet.':Math.round(dq)+' of 100. All the charge on all 112 addresses, '
  +'against the most they could hold. It is the colour on the right. The seven marks under the bar are the seats, '
  +'root to crown, each as high as the charge on its own addresses, and a seat holding half of what it could stands full height.');
 cb.title=tCQ; db.title=tDQ;
 cb.setAttribute('aria-label','Coherence'+(un?', not read yet':', '+Math.round(cq)+' of 100'));
 db.setAttribute('aria-label','Decoherence'+(un?', not read yet':', '+Math.round(dq)+' of 100'));
 /* the seven marks. Written in place so a changed charge moves the mark on
    the strip's own transition and does not swap a new picture in */
 var sv=rbSeatShadow(), cells=host.querySelectorAll('.rl-seats b');
 for(var i=0;i<cells.length;i++)
  cells[i].style.transform='scaleY('+(un?0:Math.max(.07,Math.min(1,sv[i]*RB_GAIN))).toFixed(3)+')';
 host.querySelector('.rl-seats').title='Decoherence by seat. The seven seats, root to crown, each as high as the charge on its own '
  +'addresses against what they could hold. A seat holding half of what it could stands full height.';
 RLN.who=who;
 /* the frame reads these and never looks anything up */
 RLN.pair={el:P,cq:cq,band:band,un:un,nc:nc,nd:nd,e:-1,
  cqL:P.querySelector('.rl-cqL'),base:P.querySelector('.rl-base'),over:P.querySelector('.rl-over'),
  rects:[].slice.call(P.querySelectorAll('.rl-trl rect')),trClear:false,rk:[]};}

/* ============================================================
   THE SPLIT LINES, orientation and balance. Two colours, a static edge, a
   mark inside each end and its figure. Built once per state and then only
   written, so a changed reading slides the edge on the sheet's transition.
   o: {k, cA, cB, icA, icB, a, b, e, read, tick, title, lbl}
   ============================================================ */
function rlnSplit(host,o){
 if(!host)return;
 var sig=o.k+(o.read?'r':'u')+(o.tick||'');
 var txt=function(){return '<span class="rl-tl">'+rlnSvg(o.icA)+'<i data-n="a">'+(o.read?'':'–')+'</i></span>'
  +'<span class="rl-tr"><i data-n="b">'+(o.read?'':'–')+'</i>'+rlnSvg(o.icB)+'</span>';};
 if(host.getAttribute('data-sig')!==sig){
  host.className='kb rl-split'+(o.read?'':' rl-off');
  host.setAttribute('data-q',o.k);
  host.innerHTML='<span class="rl-cqL" aria-hidden="true"></span>'
   +(o.tick?'<span class="rl-sx" style="left:'+(o.tick==='l'?25:75)+'%" aria-hidden="true"></span>':'')
   +'<span class="rl-tx rl-base" aria-hidden="true">'+txt()+'</span>'
   +'<span class="rl-tx rl-over" aria-hidden="true">'+txt()+'</span>';
  host.setAttribute('data-sig',sig);
  /* the empty state is committed first, so the edge grows out of the middle
     the way a change does and not from nothing */
  host.style.setProperty('--e','50%'); void host.offsetWidth;}
 host.style.setProperty('--cA',o.cA); host.style.setProperty('--cB',o.cB);
 host.style.setProperty('--e',(o.read?o.e:50).toFixed(1)+'%');
 host.title=o.title||''; host.setAttribute('aria-label',o.lbl||'');
 if(o.read){
  host.querySelectorAll('i[data-n=a]').forEach(function(e){e.textContent=String(Math.round(o.a));});
  host.querySelectorAll('i[data-n=b]').forEach(function(e){e.textContent=String(Math.round(o.b));});}}
function rlnSplits(r){
 var un=!!r.unread, L=un?{read:false}:leanRead(r), read=L.read!==false;
 var ben=read?L.ben:0, mal=read?L.mal:0;
 rlnSplit($('polbar'),{k:'ori',cA:'var(--c-ben)',cB:'var(--c-mal)',icA:RLN_IC.halo,icB:RLN_IC.fork,
  a:ben,b:mal,e:ben,read:read,
  lbl:'Orientation'+(read?', benign '+Math.round(ben)+', malignant '+Math.round(mal):', not read yet'),
  title:un?'Orientation. Nothing read yet, so there is no lean to show.'
   :L.read===false?'Orientation. Coherence is still filling, so there is no lean to show.'
   :'Orientation. '+(L.cues?L.cues+' cue'+(L.cues===1?'':'s')+' from the story so far. ':'No story yet, so this is the field alone. ')
    +'Benign '+L.ben.toFixed(0)+', malignant '+L.mal.toFixed(0)+', read from '+L.src
    +'. A halo on the benign end and a pitchfork on the malignant end. Benign is charge held that is not costing you, '
    +'malignant is charge held that is taking something from you.'});
 var b=r.balance, t=b.outMean+b.inMean, m=t?b.outMean/t*100:50;
 var sx=CURP&&CURP.who?CURP.who.sex:'';
 rlnSplit($('bal'),{k:'bal',cA:'var(--c-m)',cB:'var(--c-f)',icA:GLYPH_M,icB:GLYPH_F,
  a:m,b:100-m,e:m,read:!!b.read,tick:b.read&&sx==='m'?'l':b.read&&sx==='f'?'r':null,
  lbl:'Balance'+(b.read?', masculine '+Math.round(m)+', feminine '+Math.round(100-m):', not read yet'),
  title:b.read
   ?'Balance. '+(b.lean===0?'even':Math.round(Math.abs(b.lean)*100)+' percent '+(b.lean>0?'masculine':'feminine'))
    +', masculine '+Math.round(m)+' against feminine '+Math.round(100-m)
    +'. Masculine is structure and direction, held outward. Feminine is energy and receptivity, held inward. '
    +'Not men and not women: the codex is explicit about that.'
   :'Balance. Not read yet. Neither side reaches 1, so no direction is named.'});}

/* ============================================================
   THE OTHER LINES, and the whole block written from one reading.
   Vitality, awareness and will are the core's triad and have no circle on
   the glass bar, so they carry data-fk="core". A pointer on a circle lights
   its line (ui/railtiles.js).
   ============================================================ */
function rlnRender(r){
 var f=flSpeed(), un=r.unread, dash='–';
 rlnPair(r);
 var lo=$('keylo');
 if(lo)lo.innerHTML=
   rbRow('xyz','',r.X*100,un?dash:r.X.toFixed(2),
    {unread:un,fk:'core',ic:'vitality',col:'var(--c-vit)',lbl:'Vitality',title:'Vitality. '+(un?'not read yet':r.X.toFixed(2)+' of 1')
       +'. How much energy is left once apathy and the decoherence are taken off. Seventy percent of it is what '
       +'decoherence leaves, and decoherence is at '+Math.round(r.DQ)+'.'})
  +rbRow('xyz','',r.Y*100,un?dash:r.Y.toFixed(2),
    {unread:un,fk:'core',ic:'awareness',col:'var(--c-aw)',lbl:'Awareness',title:'Awareness of the instrument. '+(un?'not read yet':r.Y.toFixed(2)+' of 1')
       +'. How strong what you mean is, and how little of it gets bent on the way out.'})
  +rbRow('xyz','',r.Z*100,un?dash:r.Z.toFixed(2),
    {unread:un,fk:'core',ic:'will',col:'var(--c-wi)',lbl:'Will',title:'Will. '+(un?'not read yet':r.Z.toFixed(2)+' of 1')
       +'. How much of your integrity gets through the charge you are carrying.'})
  +rbRow('rad','',r.radiance*100,un?dash:r.radiance.toFixed(2),
    {unread:un,fk:'core',ic:'radiance',col:'var(--c-rad)',lbl:'Radiance',title:'Radiance. '+(un?'not read yet':r.radiance.toFixed(2)+' of 1')
       +'. Vitality, awareness and will combined, the root of their squares. It sets how bright the field behind the wheel is.'})
  +rbRow('flow','',f*100,un?dash:f.toFixed(2),
    {unread:un,fk:'seats',ic:'flow',wave:rbSeatPass(),sqp:un?null:clamp((+r.DQ||0)/100,0,1),lbl:'Flow',
     title:'Flow. '+(un?'not read yet':f.toFixed(2)+' of 1')
       +'. How much gets from the base of your spine to the top of your head, each seat passing on part of what it gets. '
       +'The wave runs root to crown. A clean wave that spans the whole range is every seat passing everything; a seat '
       +'that holds charge back roughens the wave where it sits and shrinks it from there on. The dotted lines are the room '
       +'the shadow leaves.'});
 rlnSplits(r);
 RLN.wv=lo?lo.querySelector('.rb-wave'):null;
 rlnDraw(false);}

/* ============================================================
   THE FRAME. Called from the loop on the Field only.
   ============================================================ */
function rlnDraw(settled){
 var P=RLN.pair, still=rbStill()||settled;
 var t=still?0:S.t;
 RB_PH=still?0:t*RLN.rate;
 if(P&&!P.un){
  var e=Math.round((still?P.cq:rlnEdge(P.cq,P.band,t))*10)/10;
  if(e!==P.e){P.e=e;
   var L=e.toFixed(1)+'%', R=(100-e).toFixed(1)+'%';
   P.cqL.style.clipPath='inset(0 '+R+' 0 0)'; P.base.style.clipPath='inset(0 0 0 '+L+')'; P.over.style.clipPath='inset(0 '+R+' 0 0)';}
  var now=performance.now();
  if(still){
   if(!P.trClear){P.trClear=true; P.rects.forEach(function(r){r.setAttribute('width','0');});}}
  else if(now-RLN.trT>=50){RLN.trT=now; P.trClear=false;
   /* the trail: where the edge has been, in the colour it left behind. A
      slice whose middle is left of the edge now was DQ's ground a moment ago */
   var NT=P.rects.length, T=RLN.TRAIL;
   for(var i=0;i<NT;i++){
    var xi=rlnEdge(P.cq,P.band,t-(i+1)/NT*T), xj=rlnEdge(P.cq,P.band,t-i/NT*T);
    var lo=Math.min(xi,xj), w=Math.max(Math.abs(xj-xi),.14), r=P.rects[i], k=(lo+w/2)<e?'d':'c';
    r.setAttribute('x',lo.toFixed(2)); r.setAttribute('width',w.toFixed(2));
    if(P.rk[i]!==k){P.rk[i]=k; r.setAttribute('class',k);}}}}
 var wv=RLN.wv;
 if(wv){var el=wv.parentNode, ps=el._ps||rbSeatsOf(el);
  if(ps)rbWaveDraw(wv,ps);}}
function rlnFrame(r){
 if(RLN.dead)return;
 try{
  /* a shut column draws nothing, and the check is a class and not a layout */
  if(document.body.classList.contains('lshut'))return;
  if(rbStill()){
   if(RLN.settled)return;
   RLN.settled=true; rlnDraw(true); return;}
  RLN.settled=false;
  rlnDraw(false);
 }catch(e){rlnFail(e);}}
