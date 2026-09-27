/* ============================================================
   Shared by the four knowledge base mockups. One entry shape, one
   figure per person, one record of what was seen and known, one sheet.
   The mockups differ in structure, and only in structure, so the ICP
   walk compares four layouts over the same words and the same numbers.
   ============================================================ */
var KB_MSG=null;
var KB=(function(){
 var E=KBD.entries, BY={}; E.forEach(function(e){BY[e.id]=e;});
 var PAL=KBD.pal, GLY=KBD.glyph;

 /* one word per concept: these are the shipped deck names, kept */
 var KIND={seat:['Seat','The stack'], axis:['Child emotion','Child emotions'],
  node:['Fetter','Fetters'], sab:['Saboteur','Saboteurs'], hcx:['Architecture','Architectures'],
  mask:['Mask','Masks'], arch:['Archetype','Archetypes'], dom:['Domain','Domains'],
  term:['Term','Terms']};
 /* what each percent is a percent of, from KB_OF in ui/knowledge.js */
 var OF={node:'of the address at full load', axis:'of the axis held', sab:'of the pattern at full weight',
  mask:'of the mask at full weight', arch:'of your strongest archetype', dom:'of your strongest blueprint lobe',
  seat:'of the seat’s addresses carrying charge'};

 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function col(e){return (e&&e.seat&&PAL[e.seat])||'#8E96A8';}

 /* ---- who is looking ---- */
 var WHO=null;
 try{WHO=localStorage.getItem('kbp-who')||null;}catch(err){}
 if(WHO&&!KBD.icp[WHO])WHO=null;
 function who(){return WHO;}
 function person(){return WHO?KBD.icp[WHO]:null;}

 /* the percent this person carries on an entry, or null where there is no
    honest one. A stranger has none on anything: not read yet. */
 function pct(e){
  var p=person(); if(!p||!e)return null;
  var c=function(v){return Math.max(0,Math.min(100,Math.round(v)));};
  if(e.kind==='axis')return c(p.charge[e.nm]*10);
  if(e.kind==='node')return c(p.node[e.idx]*10);
  if(e.kind==='sab')return c((p.sab[e.nm]||0)*10);
  if(e.kind==='mask')return c((p.mask[e.nm]||0)*10);
  if(e.kind==='arch')return c(p.arch[e.idx]*100);
  if(e.kind==='dom')return c(p.dom[e.idx]*100);
  if(e.kind==='seat'){var all=E.filter(function(n){return n.kind==='node'&&n.seat===e.nm&&n.fam!=='field anchor';});
   var lit=all.filter(function(n){return p.node[n.idx]>=1;}).length;
   return all.length?c(lit/all.length*100):0;}
  return null;}

 /* the line that makes an entry about the person reading it. Self
    reference roughly doubles what is remembered (Symons and Johnson,
    1997, d = .45), and it is the one thing no encyclopedia can do. */
 function youLine(e){
  var p=person(); if(!p)return null;
  if(e.kind==='axis'){
   var rank=Object.keys(p.charge).sort(function(a,b){return p.charge[b]-p.charge[a];});
   var r=rank.indexOf(e.nm)+1;
   /* a rank against nine is a count against a total, which the product
      rules out, so the line names the heaviest instead of placing this one */
   return 'You carry this at a weight of '+p.charge[e.nm].toFixed(1)+'. '
    +(r===1?'Nothing you carry is heavier.':'Your heaviest is '+rank[0]+', at '+p.charge[rank[0]].toFixed(1)+'.');}
  /* held means the product's own held list, compute().loaded, and
     nothing looser: a weight under the line is said as one. */
  if(e.kind==='node'){var v=p.node[e.idx];
   return held(e)?'Held here at a weight of '+v.toFixed(1)+'.'
    :v>0?'A weight of '+v.toFixed(1)+' here, under the line for held.':'Nothing held here.';}
  if(e.kind==='sab'){var w=p.sab[e.nm];
   return w?'Running in your reading at a weight of '+w.toFixed(1)+'.':'Not running in your reading.';}
  var q=pct(e); if(q==null)return null;
  return q+'% '+(OF[e.kind]||'')+'.';}
 function held(e){var p=person(); return !!(p&&e.kind==='node'&&p.held.indexOf(e.nm)>=0);}

 /* ---- the record: what was seen, what is known. Counts of events,
    never a count against a total (ladder.js, the standing ruling). ---- */
 var REC={};
 function rkey(){return 'kbp-rec-'+(WHO||'stranger');}
 function load(){REC={seen:{},known:{}}; try{var s=localStorage.getItem(rkey()); if(s)REC=JSON.parse(s);}catch(err){}
  REC.seen=REC.seen||{}; REC.known=REC.known||{};}
 function save(){try{localStorage.setItem(rkey(),JSON.stringify(REC));}catch(err){}}
 load();
 function seen(id){return !!REC.seen[id];}
 function known(id){return !!REC.known[id];}
 function markSeen(id){if(!REC.seen[id]){REC.seen[id]=Date.now(); save();}}
 function markKnown(id){REC.seen[id]=REC.seen[id]||Date.now(); if(!REC.known[id]){REC.known[id]=Date.now(); save();}}
 function counts(){return {seen:Object.keys(REC.seen).length, known:Object.keys(REC.known).length};}
 var subs=[]; function on(f){subs.push(f);} function fire(){subs.forEach(function(f){f();});}

 /* ---- the ring ---- */
 function ring(e,size,p){
  size=size||40; var c=col(e), r=size/2-3, C=2*Math.PI*r;
  var g=e.ic||GLY[e.seat]||GLY._||'';
  if(g&&g.charAt(0)!=='<')g='<path d="'+g+'"/>';
  var arc=(p==null||!p)?'':'<circle class="arc" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke="'+c
   +'" stroke-dasharray="'+(C*p/100).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 '+size/2+' '+size/2+')"/>';
  var s=size*0.46, o=(size-s)/2;
  return '<svg class="ring" width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" aria-hidden="true">'
   +'<circle class="trk" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke="'+c+'" stroke-opacity=".35"/>'+arc
   +'<g class="gl" stroke="'+c+'" transform="translate('+o+' '+o+') scale('+(s/24)+')">'+g+'</g></svg>';}

 /* ---- one question, retrieval rather than rereading (Roediger and
    Karpicke, 2006: 61 percent kept at a week against 40 for rereading). */
 function pick(a,n,not){var b=a.filter(function(x){return not.indexOf(x)<0;}), o=[];
  while(o.length<n&&b.length){o.push(b.splice(Math.floor(Math.random()*b.length),1)[0]);} return o;}
 function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
 function question(e){
  var seats=KBD.bands, q, right, wrong;
  if(e.kind==='axis'){q='Where in the body does '+e.nm+' sit?'; right=e.seat; wrong=pick(seats,2,[right]);}
  else if(e.kind==='node'&&e.axis){q='Which child emotion runs at '+e.nm+'?'; right=e.axis;
   wrong=pick(E.filter(function(x){return x.kind==='axis';}).map(function(x){return x.nm;}),2,[right]);}
  else if(e.kind==='sab'&&e.arch){q='Which architecture does the '+e.nm+' belong to?'; right=e.arch;
   wrong=pick(E.filter(function(x){return x.kind==='hcx';}).map(function(x){return x.nm;}),2,[right]);}
  else if(e.kind==='dom'){q='Which root does '+e.nm+' belong to?'; right=e.fam.replace(' root','');
   wrong=pick(['Architect','Engine','Weaver','Witness'],2,[right]);}
  else if(e.kind==='term'||e.kind==='hcx'||e.kind==='mask'||e.kind==='arch'||e.kind==='seat'||e.kind==='sab'){
   var pool=E.filter(function(x){return x.kind===e.kind&&x.id!==e.id;});
   q='Which line is '+e.nm+'?'; right=short(e.def,e.nm);
   wrong=pick(pool,2,[]).map(function(x){return short(x.def,x.nm);});}
  else {q='Which seat carries '+e.nm+'?'; right=e.seat; wrong=pick(seats,2,[right]);}
  return {q:q, right:right, opts:shuffle([right].concat(wrong))};}
 /* the definition with its own name taken out, so the answer is not in the question */
 function short(d,nm){var s=String(d).replace(new RegExp('^(the )?'+nm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[,:]?\\s*','i'),'');
  s=s.charAt(0).toUpperCase()+s.slice(1); return s.length>150?s.slice(0,147).replace(/\s+\S*$/,'')+'…':s;}

 function checkHtml(e){var c=question(e);
  return '<div class="check" data-check="'+esc(e.id)+'"><p class="q">'+esc(c.q)+'</p><div class="opts">'
   +c.opts.map(function(o){return '<button type="button" class="opt" data-ok="'+(o===c.right?1:0)+'">'+esc(o)+'</button>';}).join('')
   +'</div><p class="res" aria-live="polite"></p></div>';}
 function wireCheck(root,after){
  root.querySelectorAll('.check').forEach(function(ch){
   ch.querySelectorAll('.opt').forEach(function(b){b.onclick=function(){
    if(ch.dataset.done)return;
    var ok=b.dataset.ok==='1', id=ch.dataset.check;
    b.classList.add(ok?'right':'wrong');
    if(!ok)ch.querySelector('.opt[data-ok="1"]').classList.add('right');
    ch.dataset.done=1;
    var M=(typeof KB_MSG!=='undefined'&&KB_MSG)||{ok:'Known. It is on your record.',no:'The marked answer is the one. Try it again another day.'};
    ch.querySelector('.res').innerHTML=ok?'<span style="color:#9FE6C7">'+M.ok+'</span>':M.no;
    if(ok)markKnown(id);
    if(after)after(ok,id);};});});}

 /* ---- the sheet: one entry, read in place, at full width ---- */
 function sec(t,body,cls){return body?'<div class="sec"><div class="eyebrow">'+t+'</div><p'+(cls?' class="'+cls+'"':'')+'>'+esc(body)+'</p></div>':'';}
 function sheet(e,opt){
  opt=opt||{}; var p=pct(e), y=youLine(e);
  var h='<div class="sheet"><div class="read">'
   +'<div style="display:flex;align-items:center;gap:14px">'+ring(e,56,p)
   +'<div><div class="eyebrow">'+esc(KIND[e.kind][0])+(e.fam&&e.kind!=='term'?' · '+esc(e.fam):'')+'</div>'
   +'<h2>'+esc(e.nm)+'</h2></div></div>'
   +'<p class="def">'+esc(e.def)+'</p>'
   +(y?'<div class="you"><div class="eyebrow">In your reading</div><p>'+esc(y)+'</p></div>'
      :(WHO?'':'<div class="you"><div class="eyebrow">In your reading</div><p class="muted">Not read yet. Write what happened and this line fills with your own figure.</p></div>'))
   +sec('Where it sits',e.where)
   +(e.theme?sec('What it governs',e.theme):'')
   +(e.distort?sec('What it distorts into',e.distort):'')
   +(e.body&&e.body!==e.def?sec('How it runs',e.body):'')
   +(e.trigger?sec('When it fires',e.trigger):'')
   +(e.says?sec('What it says',e.says,'say'):'')
   +(e.clear?sec('Read clear',e.clear):'')
   +(e.dist?sec('Read distorted',e.dist):'')
   +(e.sub?sec('Also called',e.sub):'')
   +(e.out?sec(e.kind==='sab'?'The interrupt':'The release line',e.out):'')
   +(e.inst?sec('What fills it',e.inst):'')
   +(opt.check===false?'':checkHtml(e))
   +'</div>'+linksHtml(e)+'</div>';
  return h;}
 function linksHtml(e){
  var L=(e.links||[]).map(function(id){return BY[id];}).filter(Boolean);
  if(!L.length)return '<aside class="links"><h3>Linked</h3><p class="dim">Nothing links from here yet.</p></aside>';
  var shown=L.slice(0,14);
  return '<aside class="links"><h3>Linked</h3>'+shown.map(function(x){
   return '<button type="button" class="lk" data-open="'+esc(x.id)+'" data-pv="'+esc(x.id)+'">'+ring(x,32,pct(x))
    +'<span class="t"><span>'+esc(x.nm)+'</span><small>'+esc(KIND[x.kind][0])+'</small></span>'
    +(known(x.id)?'<span class="state known" style="margin-left:auto"><i></i>Known</span>':'')+'</button>';}).join('')
   +(L.length>shown.length?'<p class="dim" style="font-size:14px;padding:6px 10px">And '+(L.length-shown.length)+' more, in the search.</p>':'')
   +'</aside>';}

 /* ---- the preview on hover or focus ---- */
 var PV=null;
 function preview(root){
  root.addEventListener('mouseover',show); root.addEventListener('focusin',show);
  root.addEventListener('mouseout',hide); root.addEventListener('focusout',hide);
  function show(ev){var t=ev.target.closest&&ev.target.closest('[data-pv]'); if(!t)return;
   var e=BY[t.getAttribute('data-pv')]; if(!e)return;
   if(!PV){PV=document.createElement('div'); PV.className='pv'; document.body.appendChild(PV);}
   var y=youLine(e);
   PV.innerHTML='<b>'+esc(e.nm)+'</b>'+esc(e.def)+(y?'<div style="margin-top:6px;color:#B9D9E8">'+esc(y)+'</div>':'');
   var r=t.getBoundingClientRect(), x=Math.min(innerWidth-356,Math.max(8,r.left)), yy=r.bottom+8;
   if(yy+160>innerHeight)yy=Math.max(8,r.top-170);
   PV.style.left=x+'px'; PV.style.top=yy+'px'; PV.style.display='block';}
  function hide(){if(PV)PV.style.display='none';}
  return hide;}

 /* ---- the prototype chrome ---- */
 function chrome(letter,name,line){
  var opts='<option value="">A stranger, first visit</option>'+Object.keys(KBD.icp).map(function(k){
   var p=KBD.icp[k]; return '<option value="'+k+'"'+(WHO===k?' selected':'')+'>'+k+', '+p.age+', '+esc(p.role)+'</option>';}).join('');
  var bar=document.createElement('div'); bar.className='proto-bar';
  bar.innerHTML='<span><b>Prototype '+letter+' of four: '+esc(name)+'.</b> Knowledge base, round GQ. Not the shipped app, and nothing here saves to a profile.</span>'
   +'<span class="sp"></span><label>Looking as <select id="pwho" aria-label="Looking as">'+opts+'</select></label>'
   +'<button type="button" id="preset">Reset this prototype</button>'
   +'<button type="button" id="pnote" aria-expanded="false">Why this design</button>';
  var nav=document.createElement('div'); nav.className='nav-ph'; nav.setAttribute('aria-hidden','true');
  nav.innerHTML='<span class="mk"></span>'+[70,52,44,40,44,72,76,54,70].map(function(w){return '<span class="pl" style="width:'+w+'px"></span>';}).join('')
   +'<span class="cap">App navigation sits here, unchanged</span>';
  document.body.insertBefore(nav,document.body.firstChild);
  document.body.insertBefore(bar,document.body.firstChild);
  var note=document.createElement('div'); note.className='proto-note'; note.id='pnotebody';
  note.style.cssText='display:none;margin:12px var(--gut) 0'; note.innerHTML=line;
  nav.parentNode.insertBefore(note,nav.nextSibling);
  document.getElementById('pwho').onchange=function(){WHO=this.value||null;
   try{if(WHO)localStorage.setItem('kbp-who',WHO); else localStorage.removeItem('kbp-who');}catch(err){}
   load(); fire();};
  document.getElementById('preset').onclick=function(){
   try{Object.keys(localStorage).forEach(function(k){if(k.indexOf('kbp-rec-')===0)localStorage.removeItem(k);});}catch(err){}
   load(); fire();};
  document.getElementById('pnote').onclick=function(){var o=note.style.display==='none';
   note.style.display=o?'block':'none'; this.setAttribute('aria-expanded',String(o));};}

 function award(what){return '<span class="award-slot" title="Prototype annotation"><svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><path d="M8.5 15l-1.5 6 5-3 5 3-1.5-6"/></svg>'
  +'Award slot: '+esc(what)+'. The reward word is unruled, round GP.</span>';}

 return {E:E, BY:BY, KIND:KIND, OF:OF, esc:esc, col:col, who:who, person:person, pct:pct, held:held, youLine:youLine,
  seen:seen, known:known, markSeen:markSeen, markKnown:markKnown, counts:counts, on:on, fire:fire,
  ring:ring, question:question, checkHtml:checkHtml, wireCheck:wireCheck, sheet:sheet, preview:preview,
  chrome:chrome, award:award, rec:function(){return REC;}};
})();
