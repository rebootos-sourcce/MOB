
/* Diagnostic V2 is an independent, 0–10 self-report screen.
 * It never silently rewrites legacy intake or coherence. */
var D3_OPEN=false,D3_CORE_ONLY=false,D3_LAW=null,D3_STEP=0;
function d3Css(){
 if(document.getElementById('d3-css'))return;
 var style=document.createElement('style');style.id='d3-css';
 style.textContent=[
 '.d3-panel{border:1px solid var(--edge-2);border-radius:14px;padding:14px;margin:16px 0;background:var(--panel);color:var(--ink)}',
 '.d3-head{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}',
 '.d3-sub{font-size:12px;color:var(--mid);margin:8px 0}',
 '.d3-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:6px;margin:10px 0}',
 '.d3-law{border-radius:9px;padding:7px 10px;min-height:38px;border:1px solid var(--edge-2);color:var(--ink);background:var(--panel);cursor:pointer;text-align:left}',
 '.d3-law[data-sel="true"]{outline:2px solid var(--accent)}',
 '.d3-question{border-top:1px solid var(--edge-2);padding-top:12px;margin:12px 0}',
 '.d3-prompt{font-size:16px;line-height:1.48;font-weight:600;margin:8px 0}',
 '.d3-values{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}',
 '.d3-values button,.d3-nav button,.d3-head button{border:1px solid var(--edge-2);border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;min-width:34px;min-height:36px;cursor:pointer}',
 '.d3-values button[aria-pressed="true"]{background:color-mix(in srgb,var(--accent) 25%,var(--panel));border-color:var(--accent)}',
 '.d3-nav{display:flex;gap:8px;margin-top:8px}',
 '.d3-note{font-size:12px;color:var(--mid);line-height:1.4}'
 ].join('\n');document.head.appendChild(style);
}
function d3Panel(p){
 if(typeof D3_BANK==='undefined'||!p)return '';
 d3Css();
 var c=d3Counts(p),q=p.diagnostic3||d3Blank();
 var s='<section class="d3-panel" aria-label="Three-register behavioral diagnostic">';
 s+='<div class="d3-head"><b>Behavior · Pressure · Mechanism</b><button type="button" data-d3toggle aria-expanded="'+(D3_OPEN?'true':'false')+'">'+(D3_OPEN?'Hide':'Open')+'</button></div>';
 s+='<div class="d3-sub">'+c.answered+'/63 answered · '+c.coreLaws+'/10 Core laws · '+c.completeLaws+'/21 total</div>';
 if(!D3_OPEN)return s+'</section>';
 s+='<div class="d3-note">Answer for situations that actually happened in the last 30 days. 0 = never; 5 = about half; 10 = always. If it did not occur, choose N/A. The third answer measures a defensive response and does not directly add to CQ.</div>';
 s+='<div class="d3-head"><button type="button" data-d3core> '+(D3_CORE_ONLY?'Show all 21 laws':'Show Core 10 only')+'</button></div>';
 var shown=D3_CORE_ONLY?D3_BANK.filter(function(l){return l.core;}):D3_BANK;
 var law=shown.filter(function(l){return l.law===D3_LAW;})[0]||shown[0];
 s+='<div class="d3-list">';
 shown.forEach(function(l){
  var n=l.questions.filter(function(z){return typeof q.answers[z.id]==='number';}).length;
  s+='<button class="d3-law" type="button" data-d3law="'+esc(l.law)+'" data-sel="'+(l.law===law.law?'true':'false')+'">'+esc(l.law)+' · '+n+'/3</button>';
 });
 s+='</div>';
 var step=Math.max(0,Math.min(2,D3_STEP)),x=law.questions[step],v=q.answers[x.id],rev=step===2;
 s+='<div class="d3-question"><div class="d3-sub">'+esc(law.law)+' · '+esc(x.register)+' ('+(step+1)+'/3)'+(rev?' · protective response':'')+'</div>'
  +'<p class="d3-prompt">'+esc(x.prompt)+'</p>';
 s+='<div class="d3-values" role="group" aria-label="How often, from 0 to 10">';
 for(var n=0;n<=10;n++){
  s+='<button type="button" data-d3answer="'+n+'" aria-pressed="'+(v===n?'true':'false')+'">'+n+'</button>';
 }
 s+='<button type="button" data-d3answer="na" aria-pressed="'+(v===null?'true':'false')+'">N/A</button></div>';
 s+='<div class="d3-nav"><button type="button" data-d3step="-1"'+(step===0?' disabled':'')+'>Previous</button>'
  +'<button type="button" data-d3step="1">'+(step===2?'Next law':'Next question')+'</button></div>'
  +'<p class="d3-note">These are your original reported frequencies. CQ continues to use the approved, existing 21-law scoring engine until the new diagnostic scoring rule is approved.</p></div>';
 return s+'</section>';
}
function d3Bind(host){
 if(!host||!host.querySelector('[data-d3toggle]'))return;
 var press=host.querySelector('[data-d3toggle]');
 press.onclick=function(){D3_OPEN=!D3_OPEN;renderIntake();};
 var core=host.querySelector('[data-d3core]');
 if(core)core.onclick=function(){D3_CORE_ONLY=!D3_CORE_ONLY;D3_LAW=null;D3_STEP=0;renderIntake();};
 host.querySelectorAll('[data-d3law]').forEach(function(el){el.onclick=function(){D3_LAW=el.getAttribute('data-d3law');D3_STEP=0;renderIntake();};});
 host.querySelectorAll('[data-d3step]').forEach(function(el){el.onclick=function(){
  var d=Number(el.getAttribute('data-d3step'));
  if(d<0)D3_STEP=Math.max(0,D3_STEP-1);
  else if(D3_STEP<2)D3_STEP++;
  else{var shown=D3_CORE_ONLY?D3_BANK.filter(function(l){return l.core;}):D3_BANK;
   var idx=shown.findIndex(function(l){return l.law===D3_LAW;});
   D3_LAW=shown[(idx+1+shown.length)%shown.length].law;D3_STEP=0;}
  renderIntake();};});
 host.querySelectorAll('[data-d3answer]').forEach(function(el){el.onclick=function(){
  var shown=D3_CORE_ONLY?D3_BANK.filter(function(l){return l.core;}):D3_BANK;
  var law=shown.filter(function(l){return l.law===D3_LAW;})[0]||shown[0],qid=law.questions[D3_STEP].id;
  var n=el.getAttribute('data-d3answer'),v=n==='na'?null:+n,previous=CURP.diagnostic3?JSON.stringify(CURP.diagnostic3):null;
  if(!d3Answer(CURP,qid,v))return;
  if(!pSave()){CURP.diagnostic3=previous?JSON.parse(previous):null;status('Not saved. Your answer was kept only on this screen.','fail');return;}
  if(D3_STEP<2)D3_STEP++;
  else{var idx=shown.indexOf(law);D3_LAW=shown[(idx+1)%shown.length].law;D3_STEP=0;}
  renderIntake();
 };});
}
