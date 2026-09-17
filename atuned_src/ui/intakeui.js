
/* ============================================================
   THE DIAGNOSTIC. 21 blocks of 3. Resumable, any order, nothing
   required. Every finished law is a finding on its own.
   ============================================================ */
var IQ_OPEN=null;
/* THE SEED. A four letter type is what a person says about themselves, so
   it is never presented as a reading. It puts charge on the nine axes so a
   new field is not empty, and the line underneath says how much of the
   field is still the seed and how much the person has moved. */
function iqSeedBlock(p){
 var sd=p.seed, share=seedShare(p);
 var sel='<div class="iq-f"><label for="wtype">Type, if you know it</label>'
  +'<select id="wtype"><option value="">not said</option>'
  +TYPE16.map(function(t){return '<option value="'+t+'"'+(sd&&sd.type===t?' selected':'')+'>'+t+'</option>';}).join('')
  +'</select></div>';
 var note;
 if(!sd) note='Optional. A four letter type is the ego\u2019s own account of itself, not a reading. '
  +'Giving one puts charge on the nine axes so the field is not empty on the first day. '
  +'Your own answers and your own stories move it from there.';
 else note='Seeded from <b>'+esc(sd.type)+'</b>. <b>'+Math.round(share*100)+'%</b> of what the axes carry is still '
  +'that seed'+(share<=0.25?', so the field is mostly yours now.':share>=0.9?'. Nothing has moved it yet.':'.')
  +' It is charge only. No law, no gate and no domain was written by it, because those are measured.';
 return '<div class="iq-seed"><div class="iq-fields">'+sel
  +'<div class="iq-f" style="grid-column:span 2"><label>&nbsp;</label><p class="iq-why" style="margin:0">'+note+'</p></div>'
  +'</div></div>';}
function iqField(label,key,v){
 var id='w'+key;
 return '<div class="iq-f"><label for="'+id+'">'+label+'</label>'
  +'<input type="text" id="'+id+'" data-who="'+key+'" value="'+esc(v||'')+'"></div>';}
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
 var w=p.who||{}, bn=w.born||{};
 /* Why this is asked, said once, in the place it is asked. The intake was an
    unlabelled accordion in the left rail and nothing said what it was for. */
 var h='<div class="iq-who">'
  +'<div class="pm-eye">Who this is</div>'
  +'<p class="iq-why">Your energetics were fixed at the moment you were cut from your mother. '
  +'Date, time and place are what locate that moment, and nothing else here can be derived from '
  +'memory the way the 63 questions are. Every culture with a psycho spiritual practice read this '
  +'field at a different resolution. Where independent readings overlap, the triangulation is '
  +'pointing at you, and the inversion of that overlap is where you are compressed. '
  +'If you do not know the time, say so. It is not guessed.</p>'
  +'<div class="iq-fields">'
  +iqField('First name','first',w.first)
  +iqField('Middle','middle',w.middle)
  +iqField('Last','last',w.last)
  +'<div class="iq-f"><label for="wsex">Sex at birth</label><select id="wsex" data-who="sex">'
   +[['','not said'],['f','Female'],['m','Male'],['o','Other']].map(function(o){
     return '<option value="'+o[0]+'"'+(w.sex===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')
   +'</select></div>'
  +'<div class="iq-f"><label for="wdate">Date of birth</label>'
   +'<input type="date" id="wdate" data-born="date" value="'+esc(bn.date||'')+'"></div>'
  +'<div class="iq-f"><label for="wtime">Time of birth</label>'
   +'<input type="time" id="wtime" data-born="time" value="'+esc(bn.time||'')+'"'
   +(bn.timeUnknown?' disabled':'')+'></div>'
  +'<div class="iq-f"><label for="wplace">Place of birth</label>'
   +'<input type="text" id="wplace" data-born="place" placeholder="City, region" value="'+esc(bn.place||'')+'"></div>'
  +'<div class="iq-f"><label>&nbsp;</label><label class="iq-ck"><input type="checkbox" id="wtu"'
   +(bn.timeUnknown?' checked':'')+'> I do not know the time</label></div>'
  +'</div>'
  +iqSeedBlock(p)
  +'</div>';
 h+='<div class="iq-top">'
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
 /* identity writes on change, not on every keystroke, and reports through
    the status region like every other write that can fail. */
 host.querySelectorAll('[data-who]').forEach(function(el){el.onchange=function(){
  CURP.who[el.dataset.who]=el.value; pSave(); statusSaved();};});
 host.querySelectorAll('[data-born]').forEach(function(el){el.onchange=function(){
  CURP.who.born[el.dataset.born]=el.value; pSave(); statusSaved(); renderSpirit&&renderSpirit();};});
 var ty=document.getElementById('wtype');
 if(ty)ty.onchange=function(){
  if(ty.value)seedApply(CURP,ty.value); else seedClear(CURP);
  loadProfile(CURP); pSave(); statusSaved();
  syncCh(); syncSoul(); renderIntake(); render();};
 var tu=document.getElementById('wtu');
 if(tu)tu.onchange=function(){CURP.who.born.timeUnknown=tu.checked;
  if(tu.checked)CURP.who.born.time=''; pSave(); statusSaved(); renderIntake();};
 var ps=document.getElementById('iqprof');
 if(ps)ps.onchange=function(){CURP=PROFILES[+ps.value];loadProfile(CURP);IQ_OPEN=null;
  syncCh();syncLw();syncSoul();renderIntake();render();};
 var nb=document.getElementById('iqnew');
 if(nb)nb.onclick=function(){var n=prompt('Profile name','Profile '+(PROFILES.length+1));
  if(n){pNew(n);loadProfile(CURP);IQ_OPEN=null;syncCh();syncLw();syncSoul();renderIntake();render();}};
 var sb=document.getElementById('iqsave');
 /* The button used to read "Saved" whether or not anything was written. It
    reports what happened now, and the status region carries the detail. */
 if(sb)sb.onclick=function(){pSave();pSnap();
  var ok=statusSaved();
  sb.textContent=ok?'Saved':'Not saved';
  setTimeout(function(){sb.textContent='Save';},ok?900:2600);};
 var eb=document.getElementById('iqexp');
 if(eb)eb.onclick=function(){var t=pExport();
  try{navigator.clipboard.writeText(t);eb.textContent='Copied';status('Profile copied to the clipboard.');}
  catch(e){eb.textContent=t.length+' bytes';}
  setTimeout(function(){eb.textContent='Export';},1200);};}

