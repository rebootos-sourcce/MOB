
/* ============================================================
   THE DIAGNOSTIC. 21 blocks of 3. Resumable, any order, nothing
   required. Every finished law is a finding on its own.
   ============================================================ */
var IQ_OPEN=null;
function iqEnsure(){
 if(!PROFILES.length) PROFILES=pStore();
 if(!PROFILES.length){ pNew('You'); loadProfile(CURP); }
 if(!CURP){ CURP=PROFILES[0]; loadProfile(CURP); }
 return CURP;}
function renderIntake(){
 var host=document.getElementById('iq'); if(!host) return;
 var p=iqEnsure(), Q=iqList(), sc=iqScore(p);
 var answered=Object.keys(p.intake.answers).filter(function(k){return p.intake.answers[k]!=null;}).length;
 var scored=Object.keys(sc).length;
 iqApply(p);
 var r=compute();
 /* no measured law means no result. a defaulted CQ reads as a finding and is not one. */
 var h='<div class="iq-top">'
  +'<div class="iq-cq"><b>'+(scored?Math.round(r.CQ):'–')+'</b>'
  +'<span>'+(scored?'CQ from '+scored+' measured':'no law measured yet')+'</span></div>'
  +'<div class="iq-pr"><div class="iq-bar"><i style="width:'+(answered/63*100).toFixed(0)+'%"></i></div>'
  +'<div class="iq-pl">'+answered+' of 63 answered, <b>'+scored+' of 21 laws measured</b>'
  +(scored?', '+r.tier.toLowerCase():'')+'</div></div>'
  +'<div class="iq-act">'
   +'<select id="iqprof" aria-label="Profile">'+PROFILES.map(function(x,i){
      return '<option value="'+i+'"'+(x===CURP?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select>'
   +'<button class="btn" id="iqnew">New</button>'
   +'<button class="btn pri" id="iqsave">Save</button>'
   +'<button class="btn" id="iqexp">Export</button>'
  +'</div></div>';
 h+='<p class="iq-note">Answer in any order. Nothing is required. Every law you finish is a '
  +'finding on its own, and the number above moves as you go.</p>';
 h+='<div class="iq-grid">';
 SI.forEach(function(l,li){
  var s=sc[l.nm], open=(IQ_OPEN===li), done=!!s;
  h+='<div class="iq-law'+(done?' done':'')+(open?' open':'')+'">'
   +'<button class="iq-hd" data-law="'+li+'" aria-expanded="'+(open?'true':'false')+'">'
    +'<i style="background:'+seatCol(l.b)+'"></i>'
    +'<span class="iq-nm">'+l.nm+'</span>'
    +'<span class="iq-bd">'+l.b+'</span>'
    +(done?'<span class="iq-sc">'+s.score.toFixed(1)+'</span>'
          :'<span class="iq-sc todo">'+[0,1,2].filter(function(t){
             return p.intake.answers[li*3+t]!=null;}).length+' of 3</span>')
   +'</button>';
  if(done&&!open)
   h+='<div class="iq-find">spread '+s.spread+', '+s.lean+'</div>';
  if(open){
   h+='<div class="iq-qs">';
   [0,1,2].forEach(function(t){
    var idx=li*3+t, qq=Q[idx], v=p.intake.answers[idx];
    h+='<div class="iq-q"><div class="iq-qt"><em>'+qq.side+'</em>'+esc(qq.q)+'</div>'
     +'<div class="iq-sl">';
    for(var n=0;n<=10;n++)
     h+='<button class="iq-n'+(v===n?' on':'')+'" data-a="'+idx+'" data-v="'+n+'">'+n+'</button>';
    h+='</div></div>';});
   if(s)h+='<div class="iq-find open"><b>'+l.nm+', '+s.score.toFixed(1)+'</b><br>'
    +'spread '+s.spread+'. '+s.lean+'<br>'
    +'<span class="iq-seat">seated at the '+l.b.toLowerCase()+'</span></div>';
   h+='</div>';}
  h+='</div>';});
 h+='</div>';
 host.innerHTML=h;
 host.querySelectorAll('[data-law]').forEach(function(el){el.onclick=function(){
  IQ_OPEN=(IQ_OPEN===+el.dataset.law)?null:+el.dataset.law; renderIntake();};});
 host.querySelectorAll('[data-a]').forEach(function(el){el.onclick=function(){
  CURP.intake.answers[+el.dataset.a]=+el.dataset.v;
  if(!CURP.intake.startedAt)CURP.intake.startedAt=new Date().toISOString();
  iqApply(CURP); pSave(); syncLw(); renderIntake(); render();};});
 var ps=document.getElementById('iqprof');
 if(ps)ps.onchange=function(){CURP=PROFILES[+ps.value];loadProfile(CURP);IQ_OPEN=null;
  syncCh();syncLw();syncSoul();renderIntake();render();};
 var nb=document.getElementById('iqnew');
 if(nb)nb.onclick=function(){var n=prompt('Profile name','Profile '+(PROFILES.length+1));
  if(n){pNew(n);loadProfile(CURP);IQ_OPEN=null;syncCh();syncLw();syncSoul();renderIntake();render();}};
 var sb=document.getElementById('iqsave');
 if(sb)sb.onclick=function(){pSave();pSnap();sb.textContent='Saved';
  setTimeout(function(){sb.textContent='Save';},900);};
 var eb=document.getElementById('iqexp');
 if(eb)eb.onclick=function(){var t=pExport();
  try{navigator.clipboard.writeText(t);eb.textContent='Copied';}
  catch(e){eb.textContent=t.length+' bytes';}
  setTimeout(function(){eb.textContent='Export';},1200);};}

