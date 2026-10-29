
/* HERO'S JOURNEY BOARD  -  the living avatar's CQ coordinate and work doors.
 * The board has one position: canonical CQ. The selected encounter can differ. */
var HJ_EXPANDED=false;
/* The avatar is a figure, not a generic dot. CQ opens its posture and
 * increases the visible field. Persisted release-side milestones appear as
 * fixed marks: a lower CQ never erases work already completed. This is a
 * symbolic illustration, not biological anatomy or a health reading. */
function hjFigureHtml(h){
 var q=h.cq===null?50:h.cq, openness=q/100;
 var arms=(32+openness*12).toFixed(1),w=(19+openness*5).toFixed(1);
 var glow=(.13+openness*.37).toFixed(3);
 var marks=Math.min(12,Math.floor(h.uniqueReleaseCount/25));
 var dots='';
 for(var i=0;i<marks;i++){
  var a=Math.PI*2*i/12-Math.PI/2;
  dots+='<circle cx="'+(50+41*Math.cos(a)).toFixed(1)+'" cy="'+(58+49*Math.sin(a)).toFixed(1)
   +'" r="1.7" fill="currentColor"/>';
 }
 var nodes=[36,45,54,63,72,81,90].map(function(y,i){
  return '<circle cx="50" cy="'+y+'" r="'+(1.4+openness*1.2).toFixed(1)
    +'" fill="var(--accent)" opacity="'+(.3+openness*.6).toFixed(2)+'"/>';
 }).join('');
 return '<svg class="hj-avatar-form" viewBox="0 0 100 128" role="img" aria-label="Your living avatar form reflects CQ '
  +(h.cq===null?'not yet measured':h.cq.toFixed(1))+' and '
  +h.uniqueReleaseCount+' unique releases">'
  +'<defs><radialGradient id="hj-field" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="var(--accent)" stop-opacity="'+glow+'"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs>'
  +'<ellipse cx="50" cy="63" rx="'+(26+openness*24).toFixed(1)+'" ry="58" fill="url(#hj-field)"/>'
  +'<circle cx="50" cy="22" r="8" stroke="currentColor" stroke-width="1.6" fill="var(--panel)"/>'
  +'<path d="M50 32 Q'+(50-w)+' 40 '+(50-w*.75)+' 61 Q42 76 44 91 L37 121 '
  +'M50 32 Q'+(50+w)+' 40 '+(50+w*.75)+' 61 Q58 76 56 91 L63 121"'
  +' stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
  +'<path d="M'+(50-w)+' 42 L'+(50-arms)+' 77 M'+(50+w)+' 42 L'+(50+arms)+' 77"'
  +' stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'
  +'<path d="M50 30 L50 98" stroke="currentColor" stroke-width="1.1" opacity=".65"/>'+nodes+dots+'</svg>';
}
function hjCss(){
 if(document.getElementById('hj-avatar-css'))return;
 var x=document.createElement('style');x.id='hj-avatar-css';
 x.textContent=[
 '.hj-panel{border:1px solid var(--edge-2);border-radius:18px;padding:16px;margin:12px 0 18px;background:var(--panel);color:var(--ink)}',
 '.hj-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}',
 '.hj-title{font-size:17px;font-weight:700;letter-spacing:.025em}',
 '.hj-metrics{display:flex;align-items:center;gap:14px;flex-wrap:wrap}',
 '.hj-metric{display:flex;flex-direction:column;min-width:68px}',
 '.hj-metric b{font-size:20px;font-variant-numeric:tabular-nums}',
 '.hj-metric small{font-size:11px;color:var(--mid)}',
 '.hj-figure{--hjprogress:0%;display:grid;grid-template-columns:90px 1fr;gap:16px;align-items:center;margin-top:14px}',
 '.hj-character{position:relative;width:88px;height:116px;display:flex;justify-content:center;align-items:flex-end}',
 '.hj-avatar-form{width:100%;height:100%;display:block;color:var(--ink);filter:drop-shadow(0 0 4px color-mix(in srgb,var(--accent) 38%,transparent))}',
 '.hj-human{position:relative;z-index:1;font-size:60px;font-weight:200;line-height:1;filter:brightness(calc(.7 + var(--hjp)*.006))}',
 '.hj-bands{display:grid;grid-template-columns:40fr 20fr 40fr;overflow:hidden;border-radius:8px;height:17px}',
 '.hj-region{border:0;box-sizing:border-box;background:var(--edge-2);position:relative}',
 '.hj-region:nth-child(1){background:#5b4349}.hj-region:nth-child(2){background:#9f7849}.hj-region:nth-child(3){background:#547a77}',
 '.hj-track{height:4px;border-radius:3px;background:var(--edge-2);position:relative;margin:13px 0 5px}',
 '.hj-point{position:absolute;left:var(--hjprogress);top:-6px;width:16px;height:16px;border:2px solid var(--ink);background:var(--accent);border-radius:50%;transform:translateX(-50%)}',
 '.hj-desc{font-size:13px;color:var(--mid);margin:6px 0}',
 '.hj-current{font-size:14px;font-weight:600;margin:6px 0}',
 '.hj-scenes{margin-top:12px;display:grid;grid-template-columns:repeat(13,minmax(0,1fr));gap:5px}',
 '.hj-node{min-height:30px;padding:3px 0;border:1px solid var(--edge-2);border-radius:6px;background:var(--panel);color:var(--ink);font-size:11px;cursor:pointer}',
 '.hj-node[aria-current="location"]{outline:2px solid var(--accent);outline-offset:1px}',
 '.hj-node[aria-pressed="true"]{background:color-mix(in srgb,var(--accent) 20%,var(--panel))}',
 '.hj-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
 '.hj-actions button{font:inherit;border-radius:9px;padding:8px 12px;border:1px solid var(--edge-2);background:var(--panel);color:var(--ink);cursor:pointer}',
 '.hj-actions button:focus-visible,.hj-node:focus-visible{outline:2px solid var(--accent)}',
 '.hj-actions button[disabled]{opacity:.48;cursor:not-allowed}',
 '.hj-story{font-size:13px;line-height:1.5;margin:8px 0}',
 '.hj-explain{font-size:13px;color:var(--mid);line-height:1.55;margin:12px 0;border-top:1px solid var(--edge-2);padding-top:8px}',
 '.hj-explain summary{cursor:pointer;color:var(--ink);font-weight:600;min-height:28px}',
 '@media (max-width:620px){.hj-panel{padding:12px}.hj-figure{grid-template-columns:65px 1fr;gap:10px}.hj-character{width:63px;height:92px}.hj-human{font-size:44px}.hj-scenes{grid-template-columns:repeat(9,minmax(0,1fr))}}',
 '@media (prefers-reduced-motion:reduce){.hj-panel *{transition:none!important;animation:none!important}}'
 ].join('\n');document.head.appendChild(x);
}
function hjSafe(s){return esc(String(s==null?'':s));}
function hjPanel(st){
 if(typeof hjRead!=='function')return '';
 hjCss();/* A visiting reader may browse any encounter without changing the owner's saved quest. */
 var p=CURP,h=hjRead(p,st&&st.r),loc=h.location,
  a=(!avOwn()&&HJ_VIEW_ONLY?hjScene(HJ_VIEW_ONLY):null)||h.active;
 var pc=h.cq==null?50:Math.max(0,Math.min(100,h.cq));
 var visual=hjFigureHtml(h);
 var out='<section class="hj-panel" aria-label="Hero&#39;s Journey Board and avatar position" style="--hjp:'+pc+';--hjprogress:'+pc+'%">';
 out+='<div class="hj-heading"><div class="hj-title">Hero&#39;s Journey Board</div><div class="hj-metrics">'
  +'<span class="hj-metric"><b>'+(h.cq===null?' - ':h.cq.toFixed(1))+'</b><small>CQ / 100</small></span>'
  +'<span class="hj-metric"><b>'+h.uniqueReleaseCount+'</b><small>Unique releases</small></span>'
  +'<span class="hj-metric"><b>'+(h.delta===null?' - ':(h.delta>=0?'+':'')+h.delta.toFixed(2))+'</b><small>CQ movement</small></span>'
  +'</div></div>';
 out+='<div class="hj-figure"><div class="hj-character"><div class="hj-aura"></div>'+visual+'</div><div>'
  +'<div class="hj-bands" aria-label="Inferno 0 to 40, Purgatorio 40 to 60, Paradiso 60 to 100"><span class="hj-region"></span><span class="hj-region"></span><span class="hj-region"></span></div>'
  +'<div class="hj-track"><span class="hj-point"'+(h.cq===null?' style="display:none"':'')+'></span></div>'
  +'<div class="hj-current">'+(loc?hjSafe(loc.realm+' · '+loc.title):'Compass position awaiting all 21 laws')+'</div>'
  +'<div class="hj-desc">'+(h.complete?'Your CQ determines this position. Work can take place anywhere on the path.'
   :'You have '+h.coverage+' of '+h.total+' laws measured. This is a provisional reading, not a fixed location.')+'</div></div></div>';
 out+='<div class="hj-actions"><button type="button" data-hjexpand aria-expanded="'+(HJ_EXPANDED?'true':'false')+'">'+(HJ_EXPANDED?'Hide':'Explore')+' all 26 locations</button></div>';
 if(HJ_EXPANDED){
  out+='<div class="hj-scenes" role="group" aria-label="Choose an encounter">';
  HJ_SCENES.forEach(function(n){out+='<button type="button" class="hj-node" title="'+hjSafe(n.title)+'" data-hjscene="'+hjSafe(n.id)+'" aria-label="'+hjSafe(n.realm+' '+n.title)+'"'
   +(loc&&n.id===loc.id?' aria-current="location"':'')
   +' aria-pressed="'+(a&&a.id===n.id?'true':'false')+'">'+hjSafe(n.id.split(':').pop())+'</button>';});
  out+='</div>';
  if(a){
   var ids=hjReleaseAddresses(a),option=hjRitualCandidate(a,st.r);
   out+='<div class="hj-story"><b>'+hjSafe(a.title)+'</b> · '+hjSafe(a.realm)+'</div>'
    +'<div class="hj-story">'+hjSafe(a.challenge)+'</div>'
    +'<div class="hj-story"><b>Discover:</b> '+hjSafe(a.knowledge)+'</div>'
    +'<div class="hj-story"><b>Become:</b> '+hjSafe(a.becoming)+'</div>'
    +'<details class="hj-explain"><summary>Guidance and progress evidence</summary>'
    +'<p><b>Guide:</b> '+hjSafe(a.guide)+'</p>'
    +'<p><b>Look for:</b> '+hjSafe(a.successEvidence)+'</p>'
    +'<p><b>Source:</b> '+hjSafe(a.source)+'</p></details>'
    +'<div class="hj-desc">This is an optional encounter. It does not label you or move your CQ. '+hjSafe((a.laws||[]).join(', '))+'</div>'
    +'<div class="hj-actions"><button type="button" data-hjrelease'+(!ids.length?' disabled':'')+'>Review '+ids.length+' relevant imprints</button>'
    + '<button type="button" data-hjaffirm>Write my affirmation</button>'
    +'<button type="button" data-hjritual'+(!option?' disabled':'')+'>Start suggested daily practice</button></div>';
  }
 }
 return out+'</section>';
}
function hjBind(host){
 if(typeof hjRead!=='function')return;
 var b=host.querySelector('[data-hjexpand]');if(b)b.onclick=function(){HJ_EXPANDED=!HJ_EXPANDED;renderAvatar();};
 host.querySelectorAll('[data-hjscene]').forEach(function(el){el.onclick=function(){
  var scene=hjScene(el.getAttribute('data-hjscene'));if(!scene)return;
  if(avOwn()&&CURP&&CURP.avatar){
   var old=CURP.avatar.activeJourneyScene;CURP.avatar.activeJourneyScene=scene.id;
   if(typeof pSave==='function'&&!pSave()){CURP.avatar.activeJourneyScene=old;status('Could not save your selected encounter.','fail');}
  }else{HJ_VIEW_ONLY=scene.id;}
  renderAvatar();};});
 var rel=host.querySelector('[data-hjrelease]');if(rel)rel.onclick=function(){
  var a=hjScene((CURP&&CURP.avatar&&CURP.avatar.activeJourneyScene)||HJ_VIEW_ONLY)||hjRead(CURP,compute()).location;
  var ids=hjReleaseAddresses(a);
  if(!ids.length){status('No relevant held imprints are available for this encounter.','fail');return;}
  if(!avOwn()){status('Switch to your own profile to do a release.','fail');return;}
  relPick(ids);
 };
 var affirm=host.querySelector('[data-hjaffirm]');if(affirm)affirm.onclick=function(){
  if(!avOwn()){status('Switch to your own profile to write an affirmation.','fail');return;}
  var active=hjScene(CURP.avatar.activeJourneyScene||HJ_VIEW_ONLY)||hjRead(CURP,compute()).location;
  var law=SI.filter(function(l){return active&&(active.laws||[]).indexOf(l.nm)>=0;})[0];
  if(!law){status('Choose a law-linked encounter first.','fail');return;}
  /* This is the existing Avatar writer; no new affirmation is stored here.
     ritAffirm reads the person's becoming pair once they deliberately save it. */
  AV.sub='becoming';AV.seat=law.b;AV.face='story';
  var row=avState().rows.filter(function(v){return avSeatOf(v)===law.b;}).slice(-1)[0];
  if(row){AV.edit=row.i;AV.drafts[law.b]={be:row.pair.be,notbe:row.pair.notbe};}
  else{AV.edit=null;AV.drafts[law.b]={be:'',notbe:''};}
  renderAvatar();
  status('Write your own becoming statement. When saved, it can appear in your daily affirmations.');
 };
 var rit=host.querySelector('[data-hjritual]');if(rit)rit.onclick=function(){
  if(!avOwn()){status('Switch to your own profile to start a ritual.','fail');return;}
  var a=hjScene((CURP&&CURP.avatar&&CURP.avatar.activeJourneyScene)||HJ_VIEW_ONLY)||hjRead(CURP,compute()).location;
  var c=hjRitualCandidate(a,compute());
  if(!c){status('No practice is available at your current pacing.','fail');return;}
  var ok=ritStartPlan({steps:[c.practice.k],band:c.band,track:c.practice.track,days:7},
   'Started. '+c.practice.nm+' each day for a week, supporting '+a.title+'.');
  if(ok){HJ_EXPANDED=true;renderAvatar();}
 };
}
var HJ_VIEW_ONLY=null;
