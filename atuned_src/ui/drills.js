
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
  +'<div class="ad-nm">CQ '+Math.round(r.CQ)+', '+r.tier.toLowerCase()+'</div>'
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
  +(b.lean===0?'even':(Math.abs(b.lean)*100).toFixed(0)+'% '+(b.lean>0?'outward':'inward'))+'</div>'
  +'<div class="pm-eye">How it is read</div><p class="ad-p">The nine axes split by the direction the '
  +'body takes under them. Four discharge outward, five withdraw inward. The reading is the '
  +'difference over the total, so an empty field reads even rather than either pole. Outward '
  +'<b>'+b.out.toFixed(1)+'</b> against inward <b>'+b.in.toFixed(1)+'</b>.</p>'
  +(SXN?'<div class="pm-eye">Sex at birth</div><p class="ad-p">You gave <b>'+SXN+'</b>. It is stored '
    +'and marked on the strip, and it does not enter the arithmetic. The distance between the tick '
    +'and the marker is the reading, not a verdict.</p>':'')
  +'<div class="pm-eye">Outward</div><div class="ad-rows">'
  +OUTWARD.map(function(c){return row(c,S.charge[c]||0,'Solar');}).join('')+'</div>'
  +'<div class="pm-eye">Inward</div><div class="ad-rows">'
  +INWARD.map(function(c){return row(c,S.charge[c]||0,'Throat');}).join('')+'</div>';
 rdShell(h);}

/* the compass on the right of the stage. it was a picture with no door. */
function runCompassDrill(){
 var r=compute(), cq=Math.max(0,Math.min(100,r.CQ));
 var swing=(1-cq/100), band=2.5+swing*swing*26;
 var T=[[90,'Mastery'],[70,'Embodied'],[50,'Practicing'],[31,'Incoherent'],[21,'Corrupt'],[1,'Severe'],[0,'Collapsed']];
 var h='<div class="pm-eye">The compass</div><div class="ad-nm">CQ '+Math.round(cq)+', '+r.tier.toLowerCase()+'</div>'
  +'<div class="pm-eye">How to read it</div><p class="ad-p">The line runs 0 at the base to 100 at the crown. Above 50 the field builds more than it costs. Below 50 it costs more than it builds. '
  +'The marker is where coherence sits now. The band around it is the swing, <b>'+band.toFixed(0)+'</b> points: how far a reading can wander before it settles. Tight alignment leaves little room. A decohering field ranges wide.</p>'
  +'<div class="pm-eye">The tiers</div><div class="ad-rows">'
  +T.map(function(t){return '<div class="ad-r static'+(t[1]===r.tier?' on':'')+'"><span class="ad-k">'+t[1]+'</span><span class="ad-v">'+t[0]+'</span></div>';}).join('')+'</div>';
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
