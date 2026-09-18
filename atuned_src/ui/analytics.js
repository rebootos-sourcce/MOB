
/* ============================================================
   ANALYTICS. Bubbles. Size is magnitude, colour is seat or tier. The
   biggest circle is the biggest thing. Line charts answered nothing
   about a single session; packed circles are what one snapshot looks
   like.
   ============================================================ */
var ANA_PICK=null;
function anaHist(){
 var h=(CURP&&CURP.history)||[];
 return h.slice().sort(function(a,b){return new Date(a.t)-new Date(b.t);});}
/* deterministic packing. biggest first, then spiral out until it fits. */
function anaPack(items,w,h){
 var out=[],cx=w/2,cy=h/2;
 items=items.slice().sort(function(a,b){return b.v-a.v;});
 /* a cleared field has every value at zero. dividing by that maximum gives NaN
    and the browser rejects the radius, so the floor is 1 and the circles come
    out uniformly small, which is the correct reading of nothing held. */
 var max=(items.length&&items[0].v>0)?items[0].v:1;
 /* size by AREA BUDGET. radius goes as sqrt(value), and the constant comes from
    how many circles must fit, not from the box. budget 46 percent of the field. */
 var sumS=items.reduce(function(a,x){return a+Math.max(0.05,x.v||0)/max;},0)||1;
 var K=Math.sqrt((w*h*0.46)/(Math.PI*sumS));
 items.forEach(function(it,i){
  var r=Math.max(7,Math.min(Math.min(w,h)*0.30, Math.sqrt(Math.max(0.05,it.v||0)/max)*K));
  var placed=false,ang=i*2.399,rad=0,tries=0;
  while(!placed&&tries<800){
   var x=cx+Math.cos(ang)*rad,y=cy+Math.sin(ang)*rad;
   var ok=(x-r>2&&x+r<w-2&&y-r>2&&y+r<h-2);
   if(ok)for(var k=0;k<out.length;k++){
    if(Math.hypot(x-out[k].x,y-out[k].y)<r+out[k].r+2.5){ok=false;break;}}
   if(ok){out.push({x:x,y:y,r:r,it:it});placed=true;}
   else{ang+=0.34;rad+=1.1;tries++;}}
  /* if it still will not fit, shrink rather than stack it on the pile */
  if(!placed){var rr=r;
   for(var s=0;s<14&&!placed;s++){
    rr*=0.82; ang=i*2.399; rad=0;
    for(var t=0;t<400&&!placed;t++){
     var x2=cx+Math.cos(ang)*rad,y2=cy+Math.sin(ang)*rad;
     var ok2=(x2-rr>2&&x2+rr<w-2&&y2-rr>2&&y2+rr<h-2);
     if(ok2)for(var m=0;m<out.length;m++){
      if(Math.hypot(x2-out[m].x,y2-out[m].y)<rr+out[m].r+2){ok2=false;break;}}
     if(ok2){out.push({x:x2,y:y2,r:rr,it:it});placed=true;}
     else{ang+=0.34;rad+=1.1;}}}
   if(!placed)out.push({x:cx,y:cy,r:Math.max(5,rr),it:it});}});
 return out;}
function anaField(title,sub,items,w,h){
 items=(items||[]).filter(function(x){return x&&x.nm;});
 if(!items.length)
  return '<div class="ab-f"><div class="pm-eye">'+title+'</div>'
   +'<div class="ab-none">nothing here</div></div>';
 var P=anaPack(items,w,h),top=P[0]?P[0].it.v:1, LMIN=13;
 var s='<div class="ab-f"><div class="pm-eye">'+title+'</div>'
  +'<svg viewBox="0 0 '+w+' '+h+'" class="ab-svg">';
 P.forEach(function(p){
  var fit=p.r>=26, tiny=p.r<LMIN;
  var on=(ANA_PICK&&ANA_PICK.k===p.it.k&&ANA_PICK.nm===p.it.nm);
  s+='<g class="ab-b'+(on?' on':'')+'" data-ab="'+esc((p.it.k||'')+'|'+p.it.nm)+'">'
   +'<title>'+esc(p.it.nm+', '+p.it.v.toFixed(1))+'</title>'
   +'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+p.r.toFixed(1)
   +'" fill="'+p.it.c+'" opacity="'+(0.26+0.56*(p.it.v/(top||1))).toFixed(2)+'"/>'
   +'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+p.r.toFixed(1)
   +'" fill="none" stroke="'+p.it.c+'" stroke-width="1.2" opacity=".85"/>';
  if(!tiny){
   var fs=Math.max(11,Math.min(14,p.r*0.30));
   var room=Math.floor((p.r*1.7)/(fs*0.56));
   /* A name cut to "Hyper-Ach\u2026" names nothing and still costs the ink.
      A name that does not fit is dropped, and the bubble carries its value
      instead. The full name is on hover and in the list beside the chart. */
   var t=(p.it.nm.length<=room)?p.it.nm:'';
   if(t){
    s+='<text x="'+p.x.toFixed(1)+'" y="'+(p.y-(fit?3:-3)).toFixed(1)+'" text-anchor="middle" '
     +'class="ab-t" style="font-size:'+fs.toFixed(1)+'px">'+esc(t)+'</text>';
    if(fit)s+='<text x="'+p.x.toFixed(1)+'" y="'+(p.y+13).toFixed(1)+'" text-anchor="middle" '
     +'class="ab-v" style="font-size:'+Math.max(11,p.r*0.24).toFixed(1)+'px">'+p.it.v.toFixed(1)+'</text>';}}
  s+='</g>';});
 return s+'</svg><div class="ab-s">'+sub+'</div></div>';}
function anaRender(){
 var el=document.getElementById('ana'); if(!el)return;
 var r=compute(),H=anaHist(),prev=H.length>1?H[H.length-2]:null;
 var TIER={sup:PAL.Root,hy:PAL.Sacral,cx:PAL.Solar,sab:PAL.Throat};
 var seats=flSeats();
 var stop=null;seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 var loud=[].concat(r.sups,r.hys,r.cxs,r.sabs).sort(function(a,b){return b.w-a.w;})[0];
 var held=W.filter(function(n){return n.sq>=4;});
 var out='<div class="ana-wrap">';
 /* Every figure on this tab was bare except CQ, which carries a percent only
    because cr() appends one. A number with no scale is not a reading, it is a
    digit, and six of them sat here on six different scales. */
 var acc=accuracy(r);
 out+='<div class="ab-hero">'+cr(r.darkB,r.CQ,{size:'lg',label:'coherence'})
  +'<div><div class="pm-eye">Coherence, '+r.tier.toLowerCase()+', 0 to 100</div>'
  +'<div class="ab-say">'
  +(loud?'<b>'+esc(loud.nm)+'</b> is the biggest thing running. ':'Nothing is compounding. ')
  +(stop?'Flow stops at the <b>'+stop.p.n.toLowerCase()+'</b>. ':'Every seat is passing. ')
  +(held.length?'<b>'+held.length+'</b> of the 112 addresses are carrying, at a shadow weight of <b>'+r.DQ.toFixed(1)+'</b>.':'Nothing is carrying.')
  +(prev?' CQ '+(r.CQ-prev.cq>=0?'up ':'down ')+Math.abs(r.CQ-prev.cq).toFixed(1)+' since last session.':'')
  +'</div>'
  /* The accuracy interval is this product's stated substitute for explaining
     a model, and it was rendered into the Field rail and nowhere else. It
     belongs on the tab whose whole job is saying what the instrument knows.
     A move smaller than the interval is not a reading, it is noise, and the
     line says so rather than leaving a person to infer it. */
  +'<div class="ab-acc"><span class="pm-eye">Identification</span>'
  +'<b>'+acc.pct.toFixed(0)+'%</b><span class="ab-band">plus or minus '
  +acc.band.toFixed(0)+'</span>'
  +'<span class="ab-note">'+acc.cov+' of 21 laws measured'
  +(acc.held?', '+acc.held+' addresses carrying':'')
  +'. A move smaller than the interval is not a reading.</span></div>'
  +'</div></div><div class="ab-grid">';
 out+=anaField('Masks','the era you speak from. size is weight, 0 to 10',
  r.maskRing.map(function(m){return {k:'mask',nm:m.nm,v:m.w,
   c:seatCol((m.bands||['Heart'])[0])};}),300,210);
 out+=anaField('Domains','the blueprint you run. yours are lit, the rest are context',
  S.doms.map(function(di){var d=DOMAINS[di];return {k:'dom',nm:d.nm,v:9,c:ROOTCOL[d.r]};})
   .concat(DOMAINS.filter(function(d,i){return S.doms.indexOf(i)<0;}).slice(0,9)
    .map(function(d){return {k:'dom',nm:d.nm,v:2,c:ROOTCOL[d.r]};})),300,210);
 out+=anaField('Archetypes','how the blueprint expresses. size is affinity, 0 to 100 percent',
  (r.aff||[]).map(function(a,i){return {k:'arch',nm:(ARCH[i]||{}).nm||'',
   v:Math.max(0.4,a*10),c:(i===r.pi?GOLD:PAL['3rd Eye'])};}),300,210);
 out+=anaField('What is running','blue saboteur, gold complex, orange hyper, red character. size is weight, 0 to 10',
  [].concat(r.sups,r.hys,r.cxs,r.sabs).slice(0,16).map(function(o){
   return {k:'chain',nm:o.nm,v:o.w,c:o.over?ALARM:(TIER[o.kind]||PAL.Throat)};}),300,210);
 out+=anaField('The nine axes','held charge on each poled axis, 0 to 10',
  CHILD.map(function(c){return {k:'axis',nm:c.nm,v:Math.max(0.3,S.charge[c.nm]||0),
   c:seatCol(c.seat)};}),300,210);
 out+=anaField('The seven seats','size is how much is held there, 0 to 10',
  seats.map(function(s){return {k:'seat',nm:s.p.n,v:Math.max(0.3,s.hot),
   c:seatCol(K2B[s.p.k])};}),300,210);
 out+='</div>';
 var laws=SI.map(function(l){return {nm:l.nm,b:l.b,v:S.law[l.nm]};});
 var shutL=laws.filter(function(l){return l.v<4;});
 /* 21 of the 76, and the 21 are the Laws of Moral Integrity. Saying "the 21
    laws" with no frame reads as though there were only 21. */
 out+='<div class="pm-eye" style="margin-top:20px">Moral integrity, 21 of the 76 laws, each 0 to 10'
  +(shutL.length?', '+shutL.length+' shut':', none shut')+'</div><div class="ana-laws">';
 laws.forEach(function(l){
  out+='<div class="ana-lw'+(l.v<4?' shut':'')+'" title="'+l.nm+' '+l.v.toFixed(1)+'">'
   +'<s><u style="height:'+Math.max(4,Math.round(l.v/10*60))+'px;background:'
   +seatCol(l.b)+'"></u></s><span>'+l.nm.slice(0,3)+'</span></div>';});
 out+='</div>';
 if(shutL.length)out+='<p class="sum-p">Shut: <b>'
  +shutL.map(function(l){return l.nm;}).join(', ')+'</b>.</p>';
 if(H.length>1){
  out+='<div class="pm-eye" style="margin-top:20px">'+H.length+' sessions</div>'
   +'<p class="sum-p">One bar per session. Height is CQ on 0 to 100, colour is the darkest seat. '
   +'The band on the reading above is plus or minus '+acc.band.toFixed(0)+', so a step smaller '
   +'than that is not movement.</p>'
   +'<div class="ana-strip">';
  H.forEach(function(x){out+='<div class="ana-px" title="CQ '+x.cq+', '+x.dark
   +'"><u style="height:'+Math.max(6,Math.round(x.cq/100*50))+'px;background:'
   +seatCol(x.dark)+'"></u></div>';});
  out+='</div>';}
 var meas=SI.filter(function(l){return CURP&&CURP.laws&&CURP.laws[l.nm]!=null;});
 out+='<p class="sum-p" style="margin-top:18px">'
  +(meas.length===21?'Every law is measured, so nothing here is a default.'
    :meas.length?'<b>'+(21-meas.length)+'</b> law'+(21-meas.length===1?' is':'s are')+' still unmeasured and sitting at the default 6, which flatters the score. Answer them in Intake.'
    :'No law is measured yet. All 21 sit at the default 6, which flatters the score. Answer them in Intake.')
  +'</p></div>';
 /* the record. every snapshot the profile carries, and the distance between
    any two of them. the data has been accruing since the rebuild. */
 out+='<div class="ab-f" id="rec"></div>';
 el.innerHTML=out;
 recRender();
 el.querySelectorAll('[data-ab]').forEach(function(gEl){gEl.onclick=function(){
  var p=gEl.getAttribute('data-ab').split('|');
  ANA_PICK=(ANA_PICK&&ANA_PICK.k===p[0]&&ANA_PICK.nm===p[1])?null:{k:p[0],nm:p[1]};
  anaRender();anaDrill();};});
 anaDrill();}
/* THE DRILL. one resolution down, plus the stories that touched it. */
function anaDrill(){
 var box=document.getElementById('rdrill'); if(!box)return;
 /* Clear in place. rdClose calls render, render calls anaRender, anaRender
    calls this, which recursed until the stack died. */
 if(!ANA_PICK){box.innerHTML='';box.style.display='none';
  var none=document.getElementById('rdrill-none'); if(none)none.style.display='';
  return;}
 /* This set display:block directly and skipped rdOpen, so the content landed
    inside a collapsed accordion section and the click produced no visible
    change at all. rdOpen unfolds the section and scrolls it into view. */
 rdOpen();
 var r=compute(),P=ANA_PICK,h='';
 var ents=((CURP&&CURP.story&&CURP.story.entries)||[]);
 function head(t,nm,sub){return '<div class="pm-eye">'+t+'</div><div class="ad-nm">'+esc(nm)+'</div>'
  +(sub?'<div class="ad-sub">'+esc(sub)+'</div>':'');}
 var addr=addrRow;   /* one definition, in component.js */
 function rows(list){return '<div class="ad-rows">'+list.map(addr).join('')+'</div>';}
 function storyBlock(bands){
  var hit=ents.filter(function(e){return bands.some(function(b){return e.bands&&e.bands[B2K[b]];});});
  var s='<div class="pm-eye" style="margin-top:14px">From your stories, '+hit.length+'</div>';
  return s+(hit.length?hit.slice(0,4).map(function(e){
   return '<div class="ad-q">'+esc(e.text.slice(0,130))+(e.text.length>130?'…':'')+'</div>';}).join('')
   :'<p class="ad-p">No entry has landed on these seats yet.</p>');}
 if(P.k==='dom'){
  var di=-1; DOMAINS.forEach(function(d,i){if(d.nm===P.nm)di=i;});
  var d=DOMAINS[di]||{}, own=W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===di;});
  var ld=own.filter(function(n){return n.sq>=4;});
  var bands=[];own.forEach(function(n){if(bands.indexOf(n.b)<0)bands.push(n.b);});
  h+=head('Blueprint domain',d.nm||P.nm,(d.r||'')+' cluster, '
    +(S.doms.indexOf(di)>=0?'you run this':'not selected'));
  h+='<p class="ad-p">'+esc(d.d||'')+'. It owns <b>'+own.length+'</b> addresses across '
   +bands.join(', ')+'. <b>'+ld.length+'</b> are held, which is what the domain currently '
   +'costs you rather than gives you.</p>'
   +'<div class="pm-eye">Its addresses</div>'
   +rows(own.slice().sort(function(a,b){return b.sq-a.sq;}).slice(0,10))+storyBlock(bands);
 } else if(P.k==='chain'){
  var o=[].concat(r.sups,r.hys,r.cxs,r.sabs).filter(function(x){return x.nm===P.nm;})[0];
  if(o){var lv=leaves(o),bs=[];lv.forEach(function(n){if(bs.indexOf(n.b)<0)bs.push(n.b);});
   h+=head(({sup:'Character layer',hy:'Hyper-complex',cx:'Complex',sab:'Saboteur'}[o.kind]||'Pattern')
     +(o.over?', overshot':''),o.nm,
     (o.auth?o.auth+' · ':'')+(o.score?o.score+'% match, ':'')+'weight '+o.w.toFixed(1));
   h+='<p class="ad-p">'+(o.over
     ? 'Jouissance. The coherent opposite installed past the point where it serves. The '
       +'address will not shut, rather than will not open.'
     : 'Built from <b>'+lv.length+'</b> held addresses across '+bs.join(', ')
       +'. It fires when those carry at once, and the output bends on the way out.')+'</p>'
    +'<div class="pm-eye">Made of</div>'+rows(lv.slice(0,10))+storyBlock(bs);}
 } else if(P.k==='axis'){
  var c=CHILD.filter(function(x){return x.nm===P.nm;})[0]||{};
  var own2=W.filter(function(n){return n.cf===P.nm;});
  h+=head('Poled axis',c.nm+' toward '+(c.opp||''),c.addr+', '+c.loc);
  h+='<p class="ad-p">Held <b>'+(S.charge[c.nm]||0).toFixed(1)+'</b>, opposite installed <b>'
   +(S.replace[c.nm]||0).toFixed(1)+'</b>. Coherence is the centre of this axis, not either '
   +'end. It seats <b>'+own2.length+'</b> addresses, <b>'
   +own2.filter(function(n){return n.sq>=4;}).length+'</b> held.</p>'
   +'<div class="pm-eye">Its addresses</div>'
   +rows(own2.slice().sort(function(a,b){return b.sq-a.sq;}).slice(0,10));
 } else if(P.k==='seat'){
  var s2=flSeats().filter(function(x){return x.p.n===P.nm;})[0];
  if(s2){var bn=K2B[s2.p.k];
   var seg=W.filter(function(n){return n.b===bn;}).sort(function(a,b){return b.sq-a.sq;});
   h+=head('Seat',s2.p.n,s2.p.sk+' · '+s2.p.nv+' · '+s2.p.hz+' Hz');
   h+='<p class="ad-p">Vritti '+s2.p.vt+', seated at '+s2.p.seat+'. It passes <b>'
    +Math.round(s2.pass*100)+'%</b> of what reaches it. <b>'+s2.hot+'</b> of '+s2.tot
    +' addresses here are held.</p>'
    +'<div class="pm-eye">Laws seated here</div><div class="pm-chips">'
    +SI.filter(function(l){return l.b===bn;}).map(function(l){
      return '<span class="pm-chip">'+l.nm+' '+S.law[l.nm].toFixed(1)+'</span>';}).join('')+'</div>'
    +'<div class="pm-eye" style="margin-top:12px">Its addresses</div>'+rows(seg.slice(0,10))
    +storyBlock([bn]);}
 } else if(P.k==='arch'){
  var ai=-1; ARCH.forEach(function(x,i){if(x.nm===P.nm)ai=i;});
  /* ARCH names it Rebel and the eighteen name it Outlaw. one row, two names. */
  var a18=ARCH18.filter(function(x){return x[0]===P.nm||(P.nm==='Rebel'&&x[0]==='Outlaw');})[0];
  h+=head('Archetype',P.nm,(ai===r.pi?'primary, how the soul expresses':'secondary affinity'));
  h+='<p class="ad-p">'+((ARCH[ai]||{}).v||'')+'. Affinity <b>'
   +(((r.aff||[])[ai]||0)*100).toFixed(0)+'%</b>.'
   +(a18?' Its primary saboteur is <b>'+a18[1]+'</b>, seated at the '+a18[2].toLowerCase()+'.':'')
   +' The archetype is invariant. Release does not change it, it only clears what bends its '
   +'output on the way out.</p>';
 } else if(P.k==='mask'){
  var m2=r.maskRing.filter(function(x){return x.nm===P.nm;})[0];
  if(m2){var sb=(m2.bands||[]);
   var lv2=W.filter(function(n){return sb.indexOf(n.b)>=0&&n.sq>=4;})
    .sort(function(a,b){return b.sq-a.sq;});
   h+=head('Mask',m2.nm,'speaks from '+sb.join(' + ')+', load '+m2.w.toFixed(1));
   h+='<p class="ad-p">This is the developmental era the output takes on the way out. It '
    +'carries <b>'+lv2.length+'</b> held addresses at those seats.</p>'
    +'<div class="pm-eye">Underneath it</div>'+rows(lv2.slice(0,10))+storyBlock(sb);}}
 box.innerHTML='<div class="rd-card">'+h
  +'<button class="btn" id="adx" style="margin-top:14px">Close</button></div>';
 var x=document.getElementById('adx');
 if(x)x.onclick=function(){ANA_PICK=null;anaRender();};}
