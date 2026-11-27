/* ============================================================
   THE RITUAL PAGE, THREE WAYS. Round JQ, 27 September.

   Every option is the shipped page's own parts, from atuned_src/ui/ritual.js,
   on the real engine and the real record: the chain, the rings, the Active
   list, the builder, the month and the list. What an option changes is which
   part leads and how the record is drawn. Option A is exactly what the build
   ships. B and C replace ritLayout and add one part each, so a control that
   works in A works the same in B and C.

     A  Rings and month   today first, the record beside it
     B  Calendar first    the month is the page, today sits beside it
     C  Lanes             one row per ritual, the last fourteen days across

   Two profiles, switched from the bar: Blank is a first visit, and Five weeks
   is Derek's field with three stories, his avatar pair, and thirty six days of
   record with real gaps in it. Both live in memory only (src/shim.js).
   ============================================================ */
var PROTO={opt:'a', who:'weeks', base:null};

/* ---------------- the seed ---------------- */
function protoSeed(){
 var m=PEOPLE.filter(function(p){return /Derek/.test(p.nm);})[0]||PEOPLE[5];
 CHARGES.forEach(function(c){S.charge[c]=(m.c&&m.c[c])||0; S.replace[c]=(m.rep&&m.rep[c])||0;});
 var now=Date.now(), D=86400000, iso=function(d){return new Date(now-d*D).toISOString();};
 CURP.story=CURP.story||{entries:[]};
 /* the avatar pair round JX reads: who you want to become, and who you do
    not, which the sniffer places at the root */
 CURP.avatar={built:true,at:iso(20),reviewedAt:null,pairs:[{be:'I speak to the whole company and enjoy it',notbe:'Someone who is scared of being judged when he speaks'}]};
 CURP.story.entries=[
  {t:iso(30),text:'I said yes to the pitch again when I meant no.',imprints:[],bands:['Throat']},
  {t:iso(12),text:'The board meeting ran over and my jaw was tight all night.',imprints:[],bands:['Throat']},
  {t:iso(2),text:'I lost the thread in the edit and blamed the team.',imprints:[],bands:['Solar']}];
 var A={id:'rA',steps:['box'],when:'after I put the kettle on',where:'the kitchen',days:0,from:iso(36),stop:null,band:'Root',track:'Body'};
 var B={id:'rB',steps:['listen','heartpt'],when:'before the first call',where:'the studio',days:14,from:iso(9),stop:null,band:'Throat',track:'Mind'};
 var C={id:'rC',steps:['noting'],when:'',where:'',days:7,from:iso(30),stop:iso(24),band:'3rd Eye',track:'Mind'};
 CURP.rituals=[];
 var miss={3:1,11:1,12:1,19:1,27:1};
 for(var d=36;d>=1;d--){
  if(!miss[d])CURP.rituals.push({t:iso(d),track:'Body',band:'Root',steps:['box'],min:5,when:A.when,where:A.where,done:iso(d)});
  if(d<=9&&d!==4&&d!==6)CURP.rituals.push({t:iso(d),track:'Mind',band:'Throat',steps:['listen','heartpt'],min:20,when:B.when,where:B.where,done:iso(d)});
  if(d<=30&&d>24&&d!==28)CURP.rituals.push({t:iso(d),track:'Mind',band:'3rd Eye',steps:['noting'],min:15,when:'',where:'',done:iso(d)});}
 CURP.rituals.push({t:iso(0),track:'Body',band:'Root',steps:['box'],min:5,when:A.when,where:A.where,done:new Date().toISOString()});
 CURP.rituals.sort(function(a,b){return a.t<b.t?-1:1;});
 var all={}; all[CURP.id]=[A,B,C]; STORE.set(RIT_KEY,JSON.stringify(all));
 pSave();}
function protoBlank(){
 CHARGES.forEach(function(c){S.charge[c]=0; S.replace[c]=0;});
 CURP.story={entries:[]}; CURP.rituals=[];
 CURP.avatar={built:false,at:null,reviewedAt:null,pairs:[]};
 var all={}; all[CURP.id]=[]; STORE.set(RIT_KEY,JSON.stringify(all));
 pSave();}

/* ---------------- B, calendar first ----------------
   The month is the page. Each day is a tile, and each ritual that day is a
   bar in the ritual's colour: solid when done, faint when planned, dashed and
   grey when missed. Today's rings and the Active list sit beside it. */
function protoCalBig(plans,today){
 var now=new Date(), y=now.getFullYear(), m=now.getMonth()+RIT.mo;
 var first=new Date(y,m,1,12), yy=first.getFullYear(), mm=first.getMonth();
 var nd=new Date(yy,mm+1,0).getDate(), lead=(first.getDay()+6)%7;
 var sel=RIT.day===null?today:RIT.day;
 var out='<div class="rv-sec pb-cal"><div class="rv-hd"><span class="rv-h">Record</span>'
  +'<div class="rv-calh"><button type="button" class="rv-ib" data-act="mo" data-d="-1" aria-label="Month before">'+ritIc('back')+'</button>'
  +'<span class="rv-mon">'+first.toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</span>'
  +'<button type="button" class="rv-ib" data-act="mo" data-d="1" aria-label="Month after"'+(RIT.mo>=1?' disabled':'')+'>'+ritIc('fwd')+'</button></div></div>'
  +'<div class="pb-grid">';
 ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function(w){out+='<span class="rv-wd">'+w+'</span>';});
 for(var i=0;i<lead;i++)out+='<span class="rv-blank"></span>';
 for(var d=1;d<=nd;d++){
  var day=pracDay(new Date(yy,mm,d,12)), segs=ritDaySegs(day,plans,today);
  out+='<button type="button" class="pb-day'+(day===today?' rv-now':'')+(day===sel?' rv-sel':'')+(day>today?' rv-fut':'')
   +'" data-act="day" data-d="'+day+'" aria-pressed="'+(day===sel)+'" aria-label="'+esc(ritDayName(day,today))+'">'
   +'<span class="pb-n">'+d+'</span><span class="pb-bars">'
   +segs.map(function(s){return '<i class="pb-bar rv-s-'+s.st+'" style="--c:'+s.col+'"></i>';}).join('')
   +'</span></button>';}
 out+='</div><div class="rv-key" aria-hidden="true"><span><i class="rv-k-done"></i>Done</span><span><i class="rv-k-plan"></i>Planned</span><span><i class="rv-k-miss"></i>Missed</span></div>'
  +'<div class="rv-dayh">'+esc(ritDayName(sel,today))+'</div>'+ritDayRows(sel,plans,today)+'</div>';
 return out;}

/* ---------------- C, lanes ----------------
   One row per active ritual and the last fourteen days across it, the shape
   the habit grids use. Today and yesterday are presses; the rest is record. */
function protoLanes(act,today){
 var N=14, out='<div class="rv-sec pc-lanes"><div class="rv-hd"><span class="rv-h">Last two weeks</span>'
  +'<button type="button" class="btn rv-add" data-act="add">'+ritIc('plus')+'New</button></div>';
 if(!act.length)return out+'<p class="rv-empty">Nothing active yet.</p></div>';
 out+='<div class="pc-head"><span></span><span class="pc-days">';
 for(var i=N-1;i>=0;i--){var dd=today-i, dt=new Date((dd*DAY_MS)+new Date().getTimezoneOffset()*60000+43200000);
  out+='<span class="pc-dh'+(i>6?' pc-old':'')+'">'+['S','M','T','W','T','F','S'][dt.getDay()]+'</span>';}
 out+='</span></div>';
 act.forEach(function(p){
  var col=ritCol(p);
  out+='<div class="pc-row" style="--c:'+col+'"><button type="button" class="rv-open pc-nm" data-act="exp" data-id="'+p.id+'" aria-expanded="'+(RIT.exp===p.id)+'">'
   +'<span class="rv-nm">'+esc(ritName(p.steps))+'</span><span class="rv-sub">'+ritMin(p.steps)+' minutes<i>'+ritLeft(p,today)+'</i></span></button><span class="pc-days">';
  for(var i=N-1;i>=0;i--){
   var day=today-i, e=ritEntryFor(p,day), on=ritCovers(p,day)||!!e;
   var st=e&&ritIsDone(e.x)?'done':(on?(day<today?'miss':'plan'):'off');
   var cell='<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" class="pc-c pc-'+st+'"/></svg>';
   out+=(i<=1)
    ?'<button type="button" class="pc-cell pc-tap'+(i>6?' pc-old':'')+'" data-act="logday" data-id="'+p.id+'" data-d="'+day+'" aria-pressed="'+(st==='done')
      +'" aria-label="'+(i===0?'Today':'Yesterday')+', '+(st==='done'?'done':'mark done')+'">'+cell+'</button>'
    :'<span class="pc-cell'+(i>6?' pc-old':'')+'">'+cell+'</span>';}
  out+='</span></div>';
  if(RIT.exp===p.id){
   out+='<div class="rv-more pc-more">'+ritSteps(p).map(function(s,i){
    return '<div class="rv-step"><b>'+(p.steps.length>1?(i+1)+'. ':'')+esc(s.nm)+' <small>'+s.min+' min</small></b><p>'+esc(s.how)+'</p></div>';}).join('')
    +'<div class="rv-acts"><button type="button" class="btn" data-act="edit" data-id="'+p.id+'">Edit</button>'
    +'<button type="button" class="btn" data-act="up" data-id="'+p.id+'">Move up</button>'
    +'<button type="button" class="btn" data-act="stop" data-id="'+p.id+'">Stop</button></div></div>';}});
 return out+'</div>';}

/* the three layouts. A is the shipped one and is kept as it came. */
var protoLayoutA=null;
function protoLayout(P){
 if(PROTO.opt==='a')return protoLayoutA(P);
 var today=ritToday0(), plans=ritPlans(), act=plans.filter(function(p){return ritActive(p,today);});
 if(PROTO.opt==='b')
  return P.note+P.why+P.chain+'<div class="pb-cols"><div class="rv-col">'+protoCalBig(plans,today)
   +'</div><div class="rv-col">'+P.today+P.active+P.build+P.marks+'</div></div>';
 var sv=RIT.view; RIT.view='list';
 var rec=ritRecordHtml(plans,today).replace(/<div class="rv-seg"[\s\S]*?<\/div><\/div>/,'</div>');
 RIT.view=sv;
 return P.note+P.why+P.chain+P.today+protoLanes(act,today)+P.build
  +'<div class="rv-cols"><div class="rv-col">'+P.marks+'</div><div class="rv-col">'+rec+'</div></div>';}

/* ---------------- the bar that switches them ---------------- */
var PROTO_OPTS=[['a','A','Rings and month'],['b','B','Calendar first'],['c','C','Lanes']];
function protoBar(){
 var b=document.getElementById('protobar');
 if(!b){b=document.createElement('div'); b.id='protobar'; document.body.appendChild(b);
  b.onclick=function(ev){var t=ev.target.closest('[data-po],[data-pw]'); if(!t)return;
   if(t.dataset.po)PROTO.opt=t.dataset.po;
   if(t.dataset.pw){PROTO.who=t.dataset.pw; if(PROTO.who==='blank')protoBlank(); else protoSeed();
    RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; RIT.exp=null; RIT.day=null; RIT.gone=null;
    if(typeof render==='function')render();}
   protoBar(); if(typeof setTab==='function'&&S.tab!==TAB.RITUAL)setTab(TAB.RITUAL); ritRender();};}
 b.innerHTML='<span class="pp-t">Ritual, three ways</span>'
  +PROTO_OPTS.map(function(o){return '<button type="button" data-po="'+o[0]+'" aria-pressed="'+(PROTO.opt===o[0])
   +'" aria-label="Option '+o[1]+', '+o[2]+'"><b>'+o[1]+'</b><span class="pp-l"> '+o[2]+'</span></button>';}).join('')
  +'<span class="pp-sep"></span>'
  +[['weeks','Five weeks in','Weeks'],['blank','First visit','First']].map(function(o){
   return '<button type="button" data-pw="'+o[0]+'" aria-pressed="'+(PROTO.who===o[0])+'" aria-label="'+o[1]+'">'
    +'<span class="pp-l">'+o[1]+'</span><span class="pp-s">'+o[2]+'</span></button>';}).join('');}
function protoCss(){
 var st=document.createElement('style'); st.id='proto-css';
 st.textContent=[
  '#protobar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;display:flex;flex-wrap:wrap;align-items:center;gap:6px;',
  ' max-width:calc(100vw - 20px);padding:6px;border-radius:16px;background:var(--panel-2);border:1px solid var(--edge-2);box-shadow:0 10px 40px rgba(0,0,0,.45)}',
  '#protobar button{min-height:44px;padding:0 14px;border-radius:12px;border:0;background:none;color:var(--mid);font:inherit;font-size:14px;cursor:pointer}',
  '#protobar button[aria-pressed=true]{background:var(--accent);color:var(--on-accent)}',
  '#protobar .pp-t{padding:0 8px;font-size:13px;color:var(--dim)}',
  '#protobar .pp-sep{width:1px;height:28px;background:var(--edge-2)}',
  '#protobar .pp-s{display:none}',
  '@media (max-width:700px){#protobar{flex-wrap:nowrap;gap:2px;bottom:8px} #protobar .pp-t,#protobar .pp-l{display:none}',
  ' #protobar .pp-s{display:inline} #protobar button{min-width:44px;padding:0 10px;font-size:14px}}',
  '.pb-cols{display:grid;grid-template-columns:1fr;gap:0 18px}',
  '@container (min-width:880px){.rv .pb-cols{grid-template-columns:minmax(0,7fr) minmax(0,4fr)}}',
  '.pb-grid{display:grid;grid-template-columns:repeat(7,minmax(44px,1fr));gap:5px}',
  '.pb-day{display:flex;flex-direction:column;align-items:stretch;gap:5px;min-height:64px;padding:6px;border-radius:10px;',
  ' border:1px solid transparent;background:var(--panel-2);color:var(--mid);font:inherit;cursor:pointer;text-align:left}',
  '.pb-day.rv-now{border-color:var(--edge-2);color:var(--ink)} .pb-day.rv-sel{border-color:var(--accent)} .pb-day.rv-fut{background:none}',
  '.pb-n{font-size:13px;font-variant-numeric:tabular-nums}',
  '.pb-bars{display:flex;flex-direction:column;gap:3px}',
  '.pb-bar{display:block;height:7px;border-radius:4px;background:var(--c)}',
  '.pb-bar.rv-s-plan{background:none;box-shadow:inset 0 0 0 1.5px var(--c);opacity:.6}',
  '.pb-bar.rv-s-ahead{background:none;box-shadow:inset 0 0 0 1.5px var(--c);opacity:.35}',
  '.pb-bar.rv-s-miss{background:repeating-linear-gradient(90deg,var(--dim) 0 4px,transparent 4px 7px);opacity:.7}',
  '@container (min-width:880px){.rv .pb-day{min-height:92px}}',
  '.pc-head,.pc-row{display:grid;grid-template-columns:minmax(150px,1fr) auto;align-items:center;gap:8px}',
  '.pc-row{border-top:1px solid var(--edge)}',
  '.pc-days{display:flex;align-items:center;gap:2px}',
  '.pc-dh{width:26px;text-align:center;font-size:12px;color:var(--dim)}',
  '.pc-cell{display:inline-flex;align-items:center;justify-content:center;width:26px;height:44px;padding:0;border:0;background:none;color:inherit}',
  '.pc-cell svg{width:22px;height:22px}',
  '.pc-tap{width:44px;cursor:pointer;border-radius:10px} .pc-tap:hover{background:var(--panel-2)}',
  '.pc-head .pc-days .pc-dh:nth-last-child(-n+2){width:44px}',
  '.pc-c{fill:none;stroke-width:3}',
  '.pc-done{fill:var(--c);stroke:var(--c)} .pc-plan{stroke:var(--c);opacity:.45} .pc-miss{stroke:var(--dim);stroke-dasharray:2 3} .pc-off{stroke:var(--edge-2);opacity:.5}',
  '.pc-more{padding-left:0}',
  '@container (max-width:620px){.rv .pc-old{display:none} .rv .pc-head,.rv .pc-row{grid-template-columns:minmax(0,1fr) auto}}'
 ].join('\n');
 document.head.appendChild(st);}

/* ---------------- start ---------------- */
(function(){
 var go=function(){
  if(!document.body.classList.contains('booted')){setTimeout(go,120);return;}
  protoLayoutA=ritLayout; ritLayout=protoLayout; protoCss(); protoSeed();
  if(typeof render==='function')render();
  setTab(TAB.RITUAL); protoBar(); ritRender();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go); else go();
})();
