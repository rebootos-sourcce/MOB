
/* ============================================================
   THE DRILLS. Every element that carries data opens one. Same panel
   for all of them, so there is one place to look.
   ============================================================ */
/* Opening a drill only set display:block on a div far down a long rail, so
   the answer to a click arrived below the fold with nothing saying it had. */
function rdOpen(){var b=document.getElementById('rdrill');if(!b)return null;
 b.style.display='block';
 var none=document.getElementById('rdrill-none'); if(none)none.style.display='none';
 if(typeof OPENSEC==='object'&&OPENSEC){OPENSEC.right='sel';
  if(typeof paintSections==='function')paintSections();}
 var sec=b.closest?b.closest('.lsec'):null;
 if(sec&&sec.scrollIntoView){
  try{sec.scrollIntoView({block:'start',behavior:REDUCED?'auto':'smooth'});}
  catch(e){sec.scrollIntoView();}}
 return b;}
function rdClose(){ANA_PICK=null;S.pin=null;
 var b=document.getElementById('rdrill');if(b){b.innerHTML='';b.style.display='none';}
 var none=document.getElementById('rdrill-none'); if(none)none.style.display='';
 render();}
function rdShell(h){
 var b=rdOpen(); if(!b)return;
 b.innerHTML='<div class="rd-card">'+h
  +'<button class="btn" id="rdx" style="margin-top:14px">Close</button></div>';
 var x=document.getElementById('rdx'); if(x)x.onclick=rdClose;}
/* addrRow lives in component.js, beside the component it renders. */

function runDrill(o){
 if(!o){rdClose();return;}
 var lv=leaves(o), bs=[], fets=[];
 lv.forEach(function(n){if(bs.indexOf(n.b)<0)bs.push(n.b);
  if(n.cf&&fets.indexOf(n.cf)<0)fets.push(n.cf);});
 var oppOf=function(f){var c=CHILD.filter(function(x){return x.nm===f;})[0];return c?c.opp:'';};
 var opps=fets.map(oppOf).filter(Boolean);
 var inst=fets.filter(function(f){return (S.replace[f]||0)>=4;});
 var TN={sup:'Character layer',hy:'Hyper-complex',cx:'Complex',sab:'Saboteur'};
 var h='<div class="pm-eye">'+(TN[o.kind]||'Pattern')+(o.over?', overshot':'')+'</div>'
  +'<div class="ad-nm">'+esc(o.nm)+'</div>'
  +(o.auth?'<div class="ad-sub">'+esc(o.auth)+'</div>':'')
  +(o.kind==='sab'&&o.unnamed?'<div class="ad-sub">Inferred. The library has no name for this cluster, so it is named for its seat and its fetter.</div>'
   :(o.kind==='sab'&&SAB_PI.indexOf(o.nm)>=0?'<div class="ad-sub">One of the ten Positive Intelligence saboteurs, after Shirzad Chamine.</div>':''))
  +'<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +(o.over
   ? 'Jouissance. The coherent opposite installed past the point where it serves. The address '
     +'will not shut, rather than will not open.'
   : 'Built from <b>'+lv.length+'</b> held addresses across '+bs.join(', ')+'. It fires when '
     +'those carry at once, and the output bends on the way out.')
  +(o.kind==='sup'?' A character layer is not something you have. It is something you cannot '
   +'see as separate from you, which is why it costs more than it looks like it should.':'')
  +(o.score?' Matched at <b>'+o.score+'%</b>'
    +(o.exact?', every charge inside its range.':'.'):'')+'</p>'
  +'<div class="pm-eye">The opposite</div><p class="ad-p">'
  +(opps.length
   ? 'It runs on '+fets.join(', ')+'. The coherent opposite is <b>'+opps.join(', ')+'</b>. '
     +(inst.length?'You already have '+inst.map(oppOf).join(', ')+' partly installed.'
       :'None of it is installed yet. Release empties the address, the opposite is what fills it.')
   : 'No poled axis sits underneath this one.')+'</p>'
  +(o.kind==='sab'?kbSabBlock(o.nm):'')
  +'<div class="pm-eye">Made of</div><div class="ad-rows">'
  +lv.slice(0,8).map(addrRow).join('')
  +(lv.length>8?'<div class="pm-more">and '+(lv.length-8)+' more</div>':'')+'</div>';
 rdShell(h);}

function runLawDrill(l){
 if(!l)return;
 var v=S.law[l.nm], seg=W.filter(function(n){return n.b===l.b;});
 var hot=seg.filter(function(n){return n.sq>=4;});
 var sc=CURP?(iqScore(CURP)[l.nm]||null):null;
 var h='<div class="pm-eye">Law of integrity, '+l.b.toLowerCase()+'</div>'
  +'<div class="ad-nm">'+l.nm+' '+v.toFixed(1)+'</div>'
  +'<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +(v<4?'This law is <b>shut</b>. Under 4 it is not resisting, it is closed, and everything '
    +'seated at the '+l.b.toLowerCase()+' pays for it.'
   :v>=7?'This law is <b>open</b>. It is one of the things carrying your coherence.'
   :'Working but not strong. It holds in some contexts and slips in others.')
  +' Seated at the '+l.b.toLowerCase()+', where <b>'+hot.length+'</b> of '+seg.length
  +' addresses are held.</p>';
 h+= sc
  ? '<div class="pm-eye">From your diagnostic</div><p class="ad-p">Spread <b>'+sc.spread
    +'</b>. '+sc.lean+'</p>'
  : '<div class="pm-eye">Not measured</div><p class="ad-p">Not answered in the diagnostic, so '
    +'it defaults to '+v.toFixed(1)+'. Three questions would replace the guess.</p>';
 if(hot.length)h+='<div class="pm-eye">Held at this seat</div><div class="ad-rows">'
  +hot.slice(0,6).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runNodeDrill(n){
 if(!n)return;
 var c=CHILD.filter(function(x){return x.nm===n.cf;})[0]||{};
 var r=compute();
 var owners=[].concat(r.sups,r.hys,r.cxs,r.sabs).filter(function(o){return leaves(o).indexOf(n)>=0;});
 /* The header read "Address 007, root". The index is a storage key and a
    person's Scarcity is not 007 to them. The seat is what carries meaning. */
 var h='<div class="pm-eye">'+esc(n.b)+'</div>'
  +'<div class="ad-nm">'+esc(n.k)+'</div>'
  +'<div class="ad-sub">'+esc(n.n||'field anchor')+(n.a?' · axis '+esc(n.a):'')+'</div>'
  +'<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +'Held <b>'+n.held.toFixed(1)+'</b>, opposite installed <b>'+n.rep.toFixed(1)+'</b>, net SQ <b>'
  +n.sq.toFixed(1)+'</b>. Distorts as '+esc(n.d||'')+'.</p>'
  +'<div class="pm-eye">The opposite</div><p class="ad-p">'
  +(c.opp?'This sits on the <b>'+c.nm+' toward '+c.opp+'</b> axis, at the '+c.addr.toLowerCase()
    +'. '+((S.replace[c.nm]||0)>=4?'You have '+c.opp+' partly installed.'
      :c.opp+' is what fills this address once it is emptied.')
   :'A field address, with no poled axis under it. This one is an open ruling.')+'</p>'
  +'<div class="pm-eye">Feeds '+owners.length+'</div><div class="pm-chips">'
  +(owners.length?owners.slice(0,8).map(function(o){
    return '<span class="pm-chip'+(o.over?' over':'')+'">'+esc(o.nm)+' '+o.w.toFixed(1)+'</span>';}).join('')
   :'<span class="pm-chip">nothing compounds from here</span>')+'</div>';
 rdShell(h);}

function runCoreDrill(){
 var r=compute();
 var h='<div class="pm-eye">The core</div>'
  +'<div class="ad-nm">'+(r.unread?'Not read yet'
    :'CQ '+Math.round(r.CQ)+', '+r.tier.toLowerCase())+'</div>'
  +'<div class="pm-eye">How it is built</div><p class="ad-p">'
  +'CQ is intention times integrity, divided by resistance. Intention <b>'+r.It.toFixed(1)
  +'</b>, integrity <b>'+r.Ig.toFixed(1)+'</b>, resistance <b>'+r.Rz.toFixed(2)+'</b>. '
  +'Resistance is a floor of 1 plus DQ, so shadow weight is the only thing dividing you down.'
  +(r.vf!==1?' Your gate mix multiplies that cost by <b>'+r.vf.toFixed(2)+'</b>.':'')+'</p>'
  +'<div class="pm-eye">The read</div><p class="ad-p">The field is <b>'
  +(r.benign?'expanding':'contracting '+r.malig+'%')+'</b>. Radiance <b>'
  +(r.radiance*100).toFixed(0)+'%</b>. The core takes its colour from the coherence ramp, so '
  +'saturation and size are coherence and nothing else.</p>'
  +gatesBlock(null);
 rdShell(h);}

/* the six gates. three higher keep charge from binding, three lower bind it.
   the percent is the share of the story that ran through each gate, the
   multiplier is what that gate does to everything held. */
function gatesBlock(focus){
 var V=verpRead(), evid=V.some(function(v){return v.pct>0;});
 var rows=V.map(function(v){
  var c=v.side==='higher'?seatCol('Heart'):seatCol('Root');
  return '<button class="ad-r gate-r'+(focus===v.k?' on':'')+'" data-gate="'+v.k+'" style="--c:'+c+'">'
   +'<span class="ad-k">'+esc(v.nm)+'</span>'
   +'<span class="ad-v">'+(evid?v.pct+'%':'')+'</span>'
   +'<span class="ad-m">\u00d7'+v.mult.toFixed(2)+'</span></button>';}).join('');
 return '<div class="pm-eye">The six gates</div><p class="ad-p">'
  +(evid?'The share of the story that ran through each gate. ':'No story yet, so no gate has evidence. ')
  +'Higher gates leave charge where it is. Lower gates bind it, and the multiplier is the cost on everything held.</p>'
  +'<div class="ad-rows">'+rows+'</div>';}
function runGatesDrill(k){
 var v=verpRead().filter(function(x){return x.k===k;})[0];
 if(!v){runCoreDrill();return;}
 var h='<div class="pm-eye">'+(v.side==='higher'?'Higher gate':'Lower gate')+'</div>'
  +'<div class="ad-nm">'+esc(v.nm)+'</div>'
  +'<div class="pm-eye">What it sounds like</div><p class="ad-p">'+esc(v.d)+'</p>'
  +'<div class="pm-eye">What it does</div><p class="ad-p">'
  +(v.pct?'<b>'+v.pct+'%</b> of the story ran through this gate, '+v.n+' sentence'+(v.n===1?'':'s')+'. ':'Nothing in the story has run through it yet. ')
  +'Everything held is multiplied by <b>'+v.mult.toFixed(2)+'</b> for the share that passes here'
  +(v.mult<1?', so it lightens the load.':v.mult>1?', so it adds to the load.':'.')+'</p>'
  +gatesBlock(k);
 rdShell(h);}

/* the three quotients and the pole. the key strip above the wheel opens
   these, one per element, so nothing on the stage is a label without a door. */
function runQDrill(q){
 if(q==='cq'){runCoreDrill();return;}
 if(q==='xyz'){runXYZDrill();return;}
 var r=compute(), h='';
 if(q==='dq'){
  var top=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;}).slice(0,5);
  h='<div class="pm-eye">Shadow weight</div><div class="ad-nm">DQ '+r.DQ.toFixed(1)+'</div>'
   +'<div class="pm-eye">How it is built</div><p class="ad-p">Every address holding charge above its floor, summed. '
   +'It is the wash pressing in from the edge of the wheel, and it is the whole of resistance: CQ divides by 1 plus DQ, so this is the only number that divides you down.</p>'
   +'<div class="pm-eye">Where it sits</div><p class="ad-p"><b>'+r.loaded.length+'</b> addresses carry it. The heaviest:</p>'
   +'<div class="ad-rows">'+top.map(addrRow).join('')+'</div>';}
 else if(q==='sq'){
  h='<div class="pm-eye">Segment depth</div><div class="ad-nm">SQ '+r.SQm.toFixed(1)+' mean</div>'
   +'<div class="pm-eye">How it is built</div><p class="ad-p">The charge held at one address, 0 to 10. '
   +'Each segment of the shell is drawn to its own depth, so the wheel is 112 of these side by side. The mean is across the addresses that hold anything.</p>'
   +'<div class="pm-eye">Heaviest seat</div><p class="ad-p"><b>'+esc(r.darkB)+'</b> at <b>'+r.darkV.toFixed(1)+'</b>. Click a segment on the wheel to read one address.</p>';}
 else {
  var inst=CHARGES.filter(function(c){return (S.replace[c]||0)>=4;});
  h='<div class="pm-eye">Pole</div><div class="ad-nm">'+r.poleMean.toFixed(2)+' coherent opposite in</div>'
   +'<div class="pm-eye">How it is built</div><p class="ad-p">Each child fetter has a coherent opposite. Fear to trust, anger to equanimity. '
   +'Release empties the address, replace fills it with the opposite, and the pole is how much of that opposite is installed, 0 to 1 averaged across the nine.</p>'
   +'<div class="pm-eye">Installed</div><p class="ad-p">'+(inst.length?inst.map(function(c){
     var o=CHILD.filter(function(x){return x.nm===c;})[0];return esc(o.opp)+' over '+esc(c);}).join(', ')+'.':'Nothing installed yet.')+'</p>';}
 rdShell(h);}

/* THE THREE AXES. energy read on three independent lines, each a pure
   function of quantities already in the reading. Vitality is what is left
   after apathy and shadow weight. Awareness is intention against
   distortion. Will is integrity through a clear segment. */
function runXYZDrill(){
 var r=compute();
 var A=[['Vitality',r.X,'Solar','what is left after apathy and the shadow weight. Apathy <b>'
   +(S.charge.Apathy||0).toFixed(1)+'</b>, shadow weight <b>'+r.DQ.toFixed(1)+'</b>.'],
  ['Awareness',r.Y,'3rd Eye','intention against distortion. Intention <b>'+r.It.toFixed(1)
   +'</b>, distortion <b>'+r.dist.toFixed(1)+'</b>.'],
  ['Will',r.Z,'Root','integrity carried through a clear segment. Integrity <b>'+r.Ig.toFixed(1)
   +'</b>, mean depth <b>'+r.SQm.toFixed(1)+'</b>.']];
 var mean=(r.X+r.Y+r.Z)/3;
 var low=A.slice().sort(function(a,b){return a[1]-b[1];})[0];
 var h='<div class="pm-eye">Energy</div><div class="ad-nm">'+(mean*100).toFixed(0)+'% across three axes</div>'
  +'<div class="pm-eye">How to read it</div><p class="ad-p">Three independent lines. They do not average into '
  +'a score, they say which of the three is carrying and which is short. Yours reads shortest at <b>'
  +low[0]+'</b>.</p>'
  +'<div class="ad-rows">'+A.map(function(a){
    return '<div class="ad-r static"><span class="ad-k">'+cr(a[2],a[1]*100,{size:'xs',raw:a[1].toFixed(2)})
     +a[0]+'</span><span class="ad-m">'+(a[1]*100).toFixed(0)+'%</span></div>';}).join('')+'</div>'
  +A.map(function(a){return '<div class="pm-eye">'+a[0]+'</div><p class="ad-p">'+a[3]+'</p>';}).join('');
 rdShell(h);}

/* BALANCE. which way the field discharges, and what it is built from. */
function runBalDrill(){
 var r=compute(), b=r.balance;
 var sx=CURP&&CURP.who?CURP.who.sex:'';
 var SXN={m:'male',f:'female',o:'other'}[sx]||'';
 var row=function(c,v,col){return '<div class="ad-r static"><span class="ad-k">'
  +cr(col,v*10,{size:'xs',raw:v.toFixed(1)})+esc(c)+'</span></div>';};
 var h='<div class="pm-eye">Balance</div><div class="ad-nm">'
  +(!b.read?'not enough held to read'
    :b.lean===0?'even':(Math.abs(b.lean)*100).toFixed(0)+'% '+(b.lean>0?'outward':'inward'))+'</div>'
  +'<div class="pm-eye">How it is read</div><p class="ad-p">The nine axes split by the direction the '
  +'body takes under them. Four discharge outward, five withdraw inward. Four against five is not a '
  +'fair sum, so the means are what compare. Outward mean <b>'+b.outMean.toFixed(1)
  +'</b> against inward mean <b>'+b.inMean.toFixed(1)+'</b>.'
  +(b.read?'':' Both sides sit under 1, which is too little held to name a direction.')+'</p>'
  +(SXN?'<div class="pm-eye">Sex at birth</div><p class="ad-p">You gave <b>'+SXN+'</b>. It is stored '
    +'and marked on the strip, and it does not enter the arithmetic. The distance between the tick '
    +'and the marker is the reading, not a verdict.</p>':'')
  +'<div class="pm-eye">Outward</div><div class="ad-rows">'
  +OUTWARD.map(function(c){return row(c,S.charge[c]||0,'Solar');}).join('')+'</div>'
  +'<div class="pm-eye">Inward</div><div class="ad-rows">'
  +INWARD.map(function(c){return row(c,S.charge[c]||0,'Throat');}).join('')+'</div>';
 rdShell(h);}

/* ---- the knowledge base drills. every drill lives in this file. ---- */
/* the catalog entry for one seat. the counts are the clinical record, not a
   score, so they are stated as what was released and what installed. */
function runSeatDrill(c){
 var h='<div class="pm-eye">Seat</div><div class="ad-nm">'+esc(c.b)+'</div>'
  +'<div class="ad-sub">'+esc(c.nv)+'</div>'
  +'<div class="pm-eye">What encodes here</div><p class="ad-p">'+esc(c.d)+'</p>'
  +'<div class="pm-eye">The record</div><div class="ad-rows">'
  +c.sub.map(function(x){
    return '<div class="ad-r static"><span class="ad-k">'+esc(x[0])+'</span>'
     +'<span class="ad-m">'+x[1]+' released, '+x[2]+' installed</span></div>';}).join('')
  +'</div>'
  +'<div class="pm-eye">Addresses at this seat</div><div class="ad-rows">'
  +W.filter(function(n){return n.b===c.b;}).slice(0,10).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runFetterDrill(c){
 var held=S.charge[c.nm]||0, inst=S.replace[c.nm]||0;
 var at=W.filter(function(n){return n.cf===c.nm;});
 var h='<div class="pm-eye">Child fetter</div><div class="ad-nm">'+esc(c.nm)+'</div>'
  +'<div class="ad-sub">toward '+esc(c.opp)+'</div>'
  +'<div class="pm-eye">Where it sits</div><p class="ad-p">'+esc(c.addr)+', at '+esc(c.loc)
  +'. Seated at the '+esc(c.seat).toLowerCase()+'.</p>'
  +'<div class="pm-eye">Both halves</div><p class="ad-p">Held <b>'+held.toFixed(1)+'</b>. '
  +esc(c.opp)+' installed <b>'+inst.toFixed(1)+'</b>. Release empties the address, the opposite is what fills it.</p>'
  +'<div class="pm-eye">It runs '+at.length+' addresses</div><div class="ad-rows">'
  +at.slice(0,10).map(addrRow).join('')
  +(at.length>10?'<div class="pm-more">and '+(at.length-10)+' more</div>':'')+'</div>';
 rdShell(h);}

/* a saboteur the reading is not currently carrying. it still has a definition. */
function runSabDrill(s){
 var pi=SAB_PI.indexOf(s.nm)>=0;
 var nodes=(s.nids||[]).map(function(i){return BY[i];}).filter(Boolean);
 var h='<div class="pm-eye">Saboteur, not running</div><div class="ad-nm">'+esc(s.nm)+'</div>'
  +'<div class="ad-sub">'+(s.unnamed?'Inferred from the connection types'
    :(pi?'One of the ten Positive Intelligence saboteurs, after Shirzad Chamine':'SOURCE library'))+'</div>'
  +'<div class="pm-eye">What it would take</div><p class="ad-p">It fires when its addresses carry at '
  +'once. Yours are not carrying enough for it to run, which is why it is here and not on the wheel.'
  +(s.hcx?' It compounds into <b>'+esc(s.hcx)+'</b>.':'')+'</p>'
  +kbSabBlock(s.nm)
  +'<div class="pm-eye">Made of</div><div class="ad-rows">'+nodes.map(addrRow).join('')+'</div>';
 rdShell(h);}

/* THE DOMAIN, read clear and read distorted. The book prints both readings
   for all nineteen. Four are under a different name in the engine, and the
   drill says both rather than picking one, because that ruling is not mine. */
function runDomDrill(d){
 var k=KB_KEY(d.nm), def=DOMDEF[k], alt=KB_RENAME[k];
 var h='<div class="pm-eye">Blueprint domain'+(def&&def.n?' '+def.n:'')+'</div>'
  +'<div class="ad-nm">'+esc(d.nm)+'</div>'
  +'<div class="ad-sub">'+esc(d.r)+' cluster'+(alt?', called '+esc(alt)+' in the codex':'')+'</div>';
 if(def){
  h+='<div class="pm-eye">Read clear</div><p class="ad-p">'+esc(def.c)+'</p>'
   +'<div class="pm-eye">Read distorted</div><p class="ad-p">'+esc(def.x)+'</p>';}
 else h+='<div class="pm-eye">What it is</div><p class="ad-p">'+esc(d.d||'')+'</p>';
 rdShell(h);}

/* the definition, the trigger and the interrupt. an interrupt is the only
   part a person can act on in the moment, so it is printed last and plainly. */
function kbSabBlock(nm){
 var def=SABDEF[KB_KEY(nm)]; if(!def)return '';
 return (def.d?'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(def.d)+'</p>':'')
  +(def.t?'<div class="pm-eye">When it fires</div><p class="ad-p">'+esc(def.t)+'</p>':'')
  +(def.q?'<div class="pm-eye">What it says</div><p class="ad-p"><em>'+esc(def.q)+'</em></p>':'')
  +(def.i?'<div class="pm-eye">The interrupt</div><p class="ad-p">'+esc(def.i)+'</p>':'');}

function runKbDrill(eyebrow,title,sub,body){
 rdShell('<div class="pm-eye">'+esc(eyebrow)+'</div><div class="ad-nm">'+esc(title)+'</div>'
  +(sub?'<div class="ad-sub">'+esc(sub)+'</div>':'')
  +(body?'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(body)+'</p>':''));}

/* ============================================================
   THE TWO ENDS OF THE COMPASS.

   The cone points up toward twelve coherent expressions of eight
   human qualities, and down toward the inversion of the same eight.
   Same energy, opposite direction, and the person reading is
   somewhere between them on every axis.

   Rendered as behaviours and never as figures. Nobody meets Lucifer.
   A person runs pride as false light, and the name is what four
   thousand years of people called that behaviour when they saw it.
   That is the only reason the names earn their place: they carry
   the historical footprint, and the echo is in the room today.
   ============================================================ */
function runPoleDrill(end){
 var up=(end!=='dn'), r=compute();
 var h='<div class="pm-eye">'+(up?'The upward cone':'The downward cone')+'</div>'
  +'<div class="ad-nm">'+(up?'Eight qualities at full expression':'The same eight, inverted')+'</div>'
  +'<p class="ad-p">'+(up
    ?'Each of the twelve is the maximum coherent expression of one human quality, at one moment when it was most needed. They are coordinates, not a summit. Nothing here is a person to become.'
    :'The same quality at maximum inversion. Same energy, opposite direction. These are behaviours, not entities, and they are named because the names have survived: the patterns are still running.')
  +'</p>';
 /* where this person sits on each axis, read rather than asked */
 h+='<div class="pm-eye">Where you sit on each</div><div class="ad-rows">';
 MIRROR.forEach(function(m){
  var grp=W.filter(function(n){return n.b===m.seat;});
  var load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
  var pos=mirrorAt(load,bandIg(m.seat));
  var c=seatCol(m.seat);
  h+='<button type="button" class="ad-r" data-mirror="'+m.k+'" title="'+esc(m.ask)+'">'
   +cr(m.seat,pos,{size:'xs',raw:String(pos)})
   +'<span>'+esc(up?m.up:m.dn)+'</span>'
   +'<em style="color:'+c+'">'+esc(m.q.toLowerCase())+'</em></button>';});
 h+='</div>';
 if(up){
  h+='<div class="pm-eye">The twelve, and where each one stood</div><div class="ad-rows">';
  MASTERS.forEach(function(x){
   h+='<div class="ad-r static" title="'+esc(x.d)+'">'
    +'<span class="ad-k">'+esc(x.nm)+'</span>'
    +'<span class="ad-v">'+esc(x.was.toLowerCase())+'</span></div>';});
  h+='</div><p class="ad-p">They appeared at moments of maximum collective decoherence. '
   +'That is the law of rhythm running at the scale of a civilisation rather than a person.</p>';
 } else {
  var dk=darkRead(r.outward,r.CQ), circ=circleAt(r.CQ);
  h+='<div class="pm-eye">The blueprint, where the downward cone ends</div><div class="ad-rows">';
  BLUEPRINT.forEach(function(x){
   h+='<div class="ad-r static" title="'+esc(x.d)+'"><span class="ad-k">'+esc(x.nm)+'</span></div>';});
  h+='</div>';
  h+='<div class="pm-eye">The descent, nine depths</div><div class="ad-rows">';
  CIRCLES.forEach(function(c){
   var here=circ&&circ.c===c.c;
   h+='<div class="ad-r static'+(here?' on':'')+'" title="'+esc(c.p+' '+c.at+'.')+'">'
    +'<span class="ad-k">'+esc(c.nm)+'</span>'
    +'<span class="ad-v">'+esc(c.by)+'</span></div>';});
  h+='</div>';
  h+='<p class="ad-p">Read as a taxonomy rather than a poem. Each depth is a behaviour at a '
   +'specific compression, and the floor is stasis rather than power: no flow, no movement, '
   +'nothing completing anywhere. The pit is a downward triangle and the frozen figure at the '
   +'point of it is expressing every depth above it outward at once.</p>';
  /* THE FOUR CORNERS. Two axes, and the fourth corner is the one this
     material has got wrong for a thousand years. Chaos is not malice. */
  h+='<div class="pm-eye">Organised or chaotic, benign or malignant</div>'
   +'<div class="ad-rows">'+GOVERN.map(function(gv){
     var on=r.gov&&r.gov.nm===gv.nm;
     return '<div class="ad-r static'+(on?' on':'')+'" title="'+esc(gv.d)+'">'
      +'<span class="ad-k">'+esc(gv.nm)+'</span>'
      +'<span class="ad-v">'+(gv.org?'organised':'chaotic')+', '
      +(gv.mal?'malignant':'benign')+'</span></div>';}).join('')+'</div>'
   /* NAMES A PATTERN, NEVER A PERSON. The corner describes the shape of what
      is firing. With nothing firing there is no shape and the surface says
      that rather than defaulting a quiet field to the top corner. */
   +'<p class="ad-p">Two measurements, not one twice. <b>Shape</b> is where what is running '
   +'points, at other people or at the person carrying it. <b>Control</b> is whether the will '
   +'is directing or the drag is. '
   +(r.gov
     ?('What is running here reads <b>'+esc(r.gov.nm.replace(/^The /,''))+'</b>: shape '
       +Math.round(r.outward*100)+', control '+Math.round((r.organized||0)*100)+'.')
     :'Nothing is firing that points either way, so there is no shape to read here.')
   +'</p>'
   +'<p class="ad-p">The devil is the ordinary case, not a rare one: resistance dominating, '
   +'aimed outward, and compounded into structure. It starts small, gets conditioned, and '
   +'becomes who we are. A demon is the same harm before it has compounded. Turned inward is '
   +'the same conditioning with the person carrying it as the target, and it has no figure '
   +'because history named outward harm and never named this. Loose charge aimed at nobody is '
   +'the storm, and calling that a demon is the oldest mistake in this material. Angel is not '
   +'a fifth shape. It is what is left when nothing is running.</p>';
  /* THE DARK READ. Only when both conditions hold, once, with the referral. */
  if(dk.dark){
   h+='<div class="pm-eye">Both at once</div><p class="ad-p">'+esc(dk.say)+'</p>'
    +'<div class="ad-rows">'+DESCENT.map(function(d){
      return '<div class="ad-r static'+(dk.step&&dk.step.nm===d.nm?' on':'')
       +'" title="'+esc(d.d)+'"><span class="ad-k">'+esc(d.nm)+'</span>'
       +'<span class="ad-v">'+esc(d.kind)+'</span></div>';}).join('')+'</div>';
   if(dk.refer)h+='<p class="ad-p"><b>'+esc(DESCENT_REFER)+'</b></p>';
  h+='<div class="ad-act"><button class="btn" id="rdsee">Start from a sentence</button></div>';}
 }
 rdShell(h);
 var see=document.getElementById('rdsee');
 if(see)see.onclick=runRecogniseDrill;
 /* a row opens the axis, both poles and the question a practitioner asks */
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-mirror]').forEach(function(b){
  b.onclick=function(){runMirrorDrill(b.getAttribute('data-mirror'));};});}

/* ============================================================
   THE ENTRY FRAMEWORK, WHICH IS THE OWNER'S OWN.

   "When I first started getting into my limiting beliefs I didn't
   have a framework, because I didn't think of myself as bad. So I
   started looking at the seven deadly sins, Dante's Inferno, and
   the psychological behaviour description of the Inferno as a
   layer."

   That is the discovery problem this product has, solved once
   already by the person who has it. Nobody ticks a box that says
   narcissist. Everybody recognises a sentence about themselves.
   Nine sentences, plain, first person, no diagnosis in any of
   them, and each one routes to a seat that already has addresses
   at it.
   ============================================================ */
function runRecogniseDrill(){
 var h='<div class="pm-eye">Where to start</div>'
  +'<div class="ad-nm">Nine sentences</div>'
  +'<p class="ad-p">None of these is a diagnosis and none of them is about being a bad '
  +'person. They are descriptions of things that run. Read them and notice which ones you '
  +'recognise. The one you would rather skip is usually the one.</p>'
  +'<div class="ad-rows">';
 CIRCLES.forEach(function(c){
  h+='<button type="button" class="ad-r" data-circ="'+c.c+'" title="'+esc(c.p)+'">'
   +'<span>'+esc(c.see)+'</span>'
   +'<em>'+esc(c.sin||c.nm)+'</em></button>';});
 h+='</div><p class="ad-p">Each one has a body address behind it, which is where the work '
  +'happens. The name on the right is what people called the pattern for eight hundred years '
  +'before anybody measured it.</p>'
  +'<div class="ad-act"><button class="btn" id="rdage">None of these. Try by age</button></div>';
 rdShell(h);
 var ag=document.getElementById('rdage'); if(ag)ag.onclick=runAgeDrill;
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-circ]').forEach(function(b){
  b.onclick=function(){runCircleDrill(+b.getAttribute('data-circ'));};});}
/* one depth, what it is, where it sits, and the way out of it */
function runCircleDrill(n){
 var c=CIRCLES.filter(function(x){return x.c===n;})[0]; if(!c)return;
 var seat=(c.at.match(/Crown|Sacral|Solar|Root|Third eye|Heart|Throat/i)||[''])[0];
 seat=seat?seat.replace(/^Third eye$/i,'3rd Eye'):'';
 seat=BANDS.indexOf(seat)>=0?seat:(BANDS.indexOf(seat.replace(/^\w/,function(m){return m.toUpperCase();}))>=0?seat:'');
 var h='<div class="pm-eye">Depth '+c.c+(c.sin?', '+esc(c.sin.toLowerCase()):'')+'</div>'
  +'<div class="ad-nm">'+esc(c.nm)+'</div>'
  +'<div class="ad-sub">'+esc(c.by)+'</div>'
  +'<div class="pm-eye">What you might recognise</div><p class="ad-p">'+esc(c.see)+'</p>'
  +'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(c.p)+'</p>'
  +'<div class="pm-eye">Where it sits</div><p class="ad-p">'+esc(c.at)+'.</p>';
 if(seat){
  var grp=W.filter(function(x){return x.b===seat;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,5);
  if(grp.length){
   h+='<div class="pm-eye">The addresses there</div><div class="ad-rows">'
    +grp.map(function(x){return addrRow(x);}).join('')+'</div>';}}
 h+='<p class="ad-p">The governor is a name for the pattern, not a person and not a thing '
  +'that exists. It is still recognisable because the pattern is still running.</p>';
 rdShell(h);}

/* ============================================================
   THE AGE LADDER, on screen.

   Sixteen years, one question each, and then a three question test
   that turns an answer into a finding. The order of the test is
   load bearing: defence, then cost, then care. Asking care first
   lets a person answer for the person they would like to be.
   ============================================================ */
var AGE_AT=null, AGE_ANS={};
function runAgeDrill(){
 var h='<div class="pm-eye">Another way in</div>'
  +'<div class="ad-nm">Three to eighteen</div>'
  +'<p class="ad-p">Not a memory exercise. A person who cannot think of anything they identify '
  +'with is not unusual, because an identification that is working does not feel like one. So '
  +'go year by year and look at what got picked up. Toys, games, characters, teams, machines, '
  +'sides taken in arguments that did not matter.</p>'
  +'<div class="pm-eye">How it was found</div><p class="ad-p">'+esc(AGE_WORKED)+'</p>'
  +'<div class="pm-eye">The mechanic</div><p class="ad-p"><b>The mind sticks to anything that '
  +'it defends. Once it is stuck, the bias is set.</b> So the question is never what you liked. '
  +'It is what you would still argue for, and whether you actually care.</p>'
  +'<div class="ad-rows">';
 AGES.forEach(function(x){
  var done=AGE_ANS[x.a];
  h+='<button type="button" class="ad-r'+(done?' on':'')+'" data-age="'+x.a+'" '
   +'title="'+esc(x.q)+'"><span class="ad-k">'+x.a+'</span>'
   +'<span>'+esc(x.k)+'</span>'
   +'<em>'+(done?esc(done.found?'a groove':'clear'):'')+'</em></button>';});
 h+='</div>';
 var found=Object.keys(AGE_ANS).filter(function(k){return AGE_ANS[k].found;});
 if(found.length)h+='<p class="ad-p"><b>'+found.length+'</b> position'
  +(found.length===1?'':'s')+' defended and not meant. Each one is a groove worn by arguing '
  +'for it, and a groove is releasable at the address it sits on.</p>';
 rdShell(h);
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-age]').forEach(function(b){
  b.onclick=function(){runAgeYear(+b.getAttribute('data-age'));};});}
/* one year, the question, and the three that test the answer */
function runAgeYear(a){
 var x=AGES.filter(function(y){return y.a===a;})[0]; if(!x)return;
 AGE_AT=a;
 var st=AGE_ANS[a]||{defend:null,care:null};
 var h='<div class="pm-eye">Age '+a+', '+esc(x.k)+'</div>'
  +'<div class="ad-nm">'+esc(x.q)+'</div>'
  +'<p class="ad-p">Name it to yourself. Nothing is stored here, and nothing is scored.</p>'
  +'<div class="pm-eye">Now test it</div>';
 AGE_TEST.forEach(function(t){
  if(t.k==='cost')return;                       /* the middle one is to sit with, not to answer */
  var v=st[t.k];
  h+='<div class="ag-q"><span>'+esc(t.q)+'</span>'
   +'<span class="ag-b"><button type="button" class="btn'+(v===true?' pri':'')
   +'" data-ag="'+t.k+'" data-v="1">Yes</button>'
   +'<button type="button" class="btn'+(v===false?' pri':'')
   +'" data-ag="'+t.k+'" data-v="0">No</button></span></div>';});
 h+='<p class="ad-p">'+esc(AGE_TEST[1].q)+' Sit with that one rather than answering it.</p>';
 if(st.defend!==null&&st.care!==null){
  var f=ageFinding(st.defend,st.care);
  h+='<div class="pm-eye">'+(f.found?'A groove':'Not a groove')+'</div>'
   +'<p class="ad-p">'+esc(f.say)+'</p>';}
 h+='<div class="ad-act"><button class="btn" id="agback">All sixteen</button></div>';
 rdShell(h);
 var host=document.getElementById('rdrill'); if(!host)return;
 host.querySelectorAll('[data-ag]').forEach(function(b){
  b.onclick=function(){
   var k=b.getAttribute('data-ag'), v=b.getAttribute('data-v')==='1';
   var cur=AGE_ANS[a]||{defend:null,care:null};
   cur[k]=v;
   if(cur.defend!==null&&cur.care!==null)cur.found=ageFinding(cur.defend,cur.care).found;
   AGE_ANS[a]=cur; runAgeYear(a);};});
 var bk=document.getElementById('agback'); if(bk)bk.onclick=runAgeDrill;}

/* one axis, both ends, and the question that tells them apart */
function runMirrorDrill(k){
 var m=MIRROR.filter(function(x){return x.k===k;})[0]; if(!m)return;
 var grp=W.filter(function(n){return n.b===m.seat;});
 var load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
 var pos=mirrorAt(load,bandIg(m.seat)), c=seatCol(m.seat);
 rdShell('<div class="pm-eye">'+esc(m.q)+'</div>'
  +'<div class="ad-nm">'+esc(m.up)+' against '+esc(m.dn)+'</div>'
  +'<div class="ad-sub">at the '+String(m.seat).toLowerCase()+'</div>'
  +'<div class="pm-eye">At full expression</div><p class="ad-p">'+esc(m.upd)+'</p>'
  +'<div class="pm-eye">At full inversion</div><p class="ad-p">'+esc(m.dnd)+'</p>'
  +'<div class="pm-eye">The question that tells them apart</div>'
  +'<p class="ad-p"><b>'+esc(m.ask)+'</b></p>'
  +'<div class="pm-eye">Where you sit</div>'
  +'<div class="ad-rows"><div class="ad-r static">'
   +cr(m.seat,pos,{size:'sm',raw:String(pos)})
   +'<span class="ad-k">'+esc(m.dn)+' at nought, '+esc(m.up)+' at a hundred</span>'
   +'<span class="ad-v" style="color:'+c+'">'+pos+'</span></div></div>'
  +'<p class="ad-p">Read from what is held at the '+String(m.seat).toLowerCase()
  +' and the integrity measured there. Not asked, and not a verdict. Both ends are behaviours '
  +'and the axis is one you are on whether or not you look at it.</p>');}

/* the compass on the right of the stage. it was a picture with no door. */
function runCompassDrill(){
 var r=compute(), cq=Math.max(0,Math.min(100,r.CQ));
 var swing=(1-cq/100), band=2.5+swing*swing*26;
 /* the tier table was a second copy of the one in the engine and could drift
    from it silently. It reads TIERDEF now, which is the only one. */
 var me=r.unread?null:TIER_BY[r.tier];
 var h='<div class="pm-eye">The compass</div><div class="ad-nm">'
  +(r.unread?'Not read yet':'CQ '+Math.round(cq)+', '+r.tier.toLowerCase())+'</div>'
  +'<div class="pm-eye">How to read it</div><p class="ad-p">The line runs 0 at the base to 100 at the crown, and the word changes every ten points. '
  +'Above '+MEDIAN+' the field builds more than it costs. Below '+MEDIAN+' it costs more than it builds. '
  +MEDIAN_LO+' to '+MEDIAN_HI+' is the median range, where the reading crosses the line in both directions'
  +(medianRange(cq)&&!r.unread?', and that is where this one sits':'')+'. '
  +'The marker is where coherence sits now. The band around it is the swing, <b>'+band.toFixed(0)+'</b> points: how far a reading can wander before it settles. Tight alignment leaves little room. A decohering field ranges wide.</p>'
  /* THE RULING. A label this product puts on a person carries a definition,
    the behaviour it produces, and the direction out of it. A word like Severe
    with nothing attached is a judgement. The same word with those three is a
    reading. */
 if(me)h+='<div class="pm-eye">What '+esc(me.nm.toLowerCase())+' means</div>'
  +'<p class="ad-p">'+esc(me.def)+'</p>'
  +'<div class="pm-eye">How it shows up</div><p class="ad-p">'+esc(me.energy)+'</p>'
  +'<div class="pm-eye">Where it goes</div><p class="ad-p">'+esc(me.toward)+'</p>';
 h+='<div class="pm-eye">The whole scale</div><div class="ad-rows">'
  +TIERDEF.map(function(t){
    return '<div class="ad-r static'+(t.nm===r.tier&&!r.unread?' on':'')+'" title="'+esc(t.def)+'">'
     +'<span class="ad-k">'+esc(t.nm)+'</span><span class="ad-v">'+tierRange(t)+'</span></div>';}).join('')
  +'</div>';
 rdShell(h);}

/* the matrix cell. the handshake lists this as never wired: either the cells
   drill to the addresses at that intersection, or they come out. */
function runCellDrill(c,rw){
 var D=DOMAINS[c], cf=CHILD[rw];
 var seg=W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===c&&n.cf===cf.nm;});
 var affine=(AFFIN[D.r]||[]).indexOf(cf.nm)>=0;
 var held=seg.filter(function(n){return n.sq>=4;});
 var h='<div class="pm-eye">Matrix cell</div>'
  +'<div class="ad-nm">'+D.nm+' × '+cf.nm+'</div>'
  +'<div class="ad-sub">'+D.r+' cluster, '+cf.addr.toLowerCase()+'</div>'
  +'<div class="pm-eye">What the crossing does</div><p class="ad-p">'
  +(seg.length
   ? 'This domain seats <b>'+seg.length+'</b> address'+(seg.length===1?'':'es')+' on the '
     +cf.nm.toLowerCase()+' axis, <b>'+held.length+'</b> of them held.'
     +(affine?' This is a <b>1.3× affinity pair</b>: running '+D.r+' makes you more '
       +'susceptible here, and that multiplier is where distortion comes from.'
       :' No affinity multiplier applies to this pair.')
   : 'No address sits at this crossing. '+D.nm+' does not seat the '+cf.nm.toLowerCase()
     +' axis, so the cell is structurally empty rather than merely clear.')+'</p>';
 if(seg.length)h+='<div class="pm-eye">Addresses here</div><div class="ad-rows">'
  +seg.slice().sort(function(a,b){return b.sq-a.sq;}).slice(0,8).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runSpDrill(kind,val){
 var r=compute(), t='', nm=val, sub='', runs='', extra='';
 if(kind==='sign'){
  var z=null; ZSIGN.forEach(function(x){if(x[2]===val)z=x;});
  t='Zodiac sign'; sub=z?(z[3]+', '+z[4]):''; runs=SIGN_RUNS[val]||'';
  nm=(ZGLYPH[val]||'')+' '+val;
  var rootNow=(DOMAINS[S.doms[0]]||{}).r||'', maps=ELEM2ROOT[z?z[3]:''];
  extra=maps?('This element maps to the <b>'+maps+'</b> root. You currently run <b>'+rootNow
   +'</b>. '+(maps===rootNow?'They agree.':'They do not, which means something was installed '
   +'on top of the blueprint.')):'';
 } else if(kind==='chinese'){ t='Year animal'; runs=CH_RUNS[val]||''; sub='twelve year cycle';
 } else if(kind==='celem'){ t='Element'; runs=CE_RUNS[val]||''; sub='ten year stem cycle';
 } else if(kind==='lp'){
  t='Life path'; runs=LP_RUNS[+val]||''; sub='birth date, reduced';
  var archNow=(ARCH[r.pi]||{}).nm||'';
  extra='This path reads <b>'+(LP2ARCH[+val]||'unmapped')+'</b>. Your first archetype is <b>'
   +archNow+'</b>. '+(LP2ARCH[+val]===archNow?'They agree.':'They do not.');
 } else if(kind==='hd'){
  t='Design type'; runs=HD_RUNS[val]||''; sub='type';
  extra='A '+val+' at CQ <b>'+Math.round(r.CQ)+'</b>. '
   +((val==='Generator'||val==='Manifesting Generator')===(r.CQ>=50)
     ?'Type and field point the same way.':'Type and field point differently.');
 } else if(kind==='auth'){
  t='Authority'; sub='where the decision lands';
  runs='the body signal this person is meant to decide from, rather than the mind';
 } else if(kind==='gk'){
  t='Gene key'; sub='gate and line';
  var top=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;})[0];
  var c2=top?(CHILD.filter(function(x){return x.nm===top.cf;})[0]||{}):{};
  runs='shadow to gift to siddhi, read one axis at a time';
  extra=top?('Your heaviest address is <b>'+top.k+'</b>, which sits on the <b>'+c2.nm
   +' toward '+(c2.opp||'')+'</b> axis. That is the shadow and the gift.')
   :'Nothing held, so no shadow is running to read.';}
 rdShell('<div class="pm-eye">'+t+'</div><div class="ad-nm">'+esc(nm)+'</div>'
  +(sub?'<div class="ad-sub">'+esc(sub)+'</div>':'')
  +'<div class="pm-eye">How it runs through you</div>'
  +'<p class="ad-p">'+(runs||'no behaviour on file')+'</p>'
  +(extra?'<div class="pm-eye">Against your field</div><p class="ad-p">'+extra+'</p>':''));}
