
/* ============================================================
   THE DRILLS. Every element that carries data opens one. Same panel
   for all of them, so there is one place to look.
   ============================================================ */
function rdOpen(){var b=document.getElementById('rdrill');if(!b)return null;
 b.style.display='block';return b;}
function rdClose(){ANA_PICK=null;S.pin=null;
 var b=document.getElementById('rdrill');if(b){b.innerHTML='';b.style.display='none';}render();}
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
 var h='<div class="pm-eye">Address '+String(n.i).padStart(3,'0')+', '+n.b.toLowerCase()+'</div>'
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
  +'saturation and size are coherence and nothing else.</p>';
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
