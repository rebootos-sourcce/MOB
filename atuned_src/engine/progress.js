/* ATUNED progress seam. Host-free; deliberately not in MANIFEST until schema and save hooks land.
   Baseline: ATUNED-points-achievements-unlocks-TDD-v3.md. 2026-11-02. */
var PG_SCHEMA_V=1, PG_RULE=1, PG_CAP={credits:8000,marks:200,seen:50};
var PG_RATES=[null,{'ritual.day':5,'story.day':2,'address.first':5}];
var PG_EVENTS=['ritual.day','story.day','address.first','seat.first','reading','turn.closed'];
var PG_INTROS=['i.saboteur','i.complex','i.hyper','i.graph'];
var PG_QUARTERS=[
 {k:'discover',seat:'3rd Eye'}, {k:'play',seat:'Sacral'},
 {k:'flow',seat:'Root'}, {k:'embody',seat:'Heart'}, {k:'turn',seat:'Solar'}];
var PG_FAMILIES={
 told:'discover',kept:'discover',ten:'discover',fifty:'discover',named:'discover',
 first:'play',hour:'play',tracks:'play',week:'flow',month:'flow',
 season:'flow',back:'flow',nine:'embody',laws:'embody',
 stated:'embody',aimed:'embody',poled:'embody',seat:'embody',
 watched:'embody',ring:'turn',rings:'turn'};
var PG_MARKS=(typeof MARKS==='undefined'?[]:MARKS).map(function(m){
 var k=m.k==='turned'?'poled':m.k;
 var q=PG_FAMILIES[k], seat=PG_QUARTERS.filter(function(s){return s.k===q;})[0];
 return {k:k,q:q,b:seat?seat.seat:m.b,nm:m.nm,to:m.to||null,d:m.d,ic:m.ic,v:1,
  t:m.t,retired:false};
});
PG_MARKS.push(
 {k:'named',q:'discover',b:'3rd Eye',nm:'Every seat opened',to:'Open ground at every seat.',
  d:'Ground opened at all seven seats.',ic:'M12 3v18 M3 12h18',v:1,retired:false,
  t:function(c){return c.seats.length>=7;}},
 {k:'ring',q:'turn',b:'Solar',nm:'First turn',to:'Complete the circle once.',
  d:'You completed discover, play, flow and embody.',ic:'M12 3a9 9 0 109 9',v:1,retired:false,
  t:function(c){return c.turn.n>=1;}},
 {k:'rings',q:'turn',b:'Solar',nm:'Ten turns',to:'Complete ten circles.',
  d:'Ten full circles on the record.',ic:'M12 3a9 9 0 109 9',v:1,retired:false,
  t:function(c){return c.turn.n>=10;}}
);
function progressBlank(){return {v:PG_SCHEMA_V,credits:[],marks:[],seen:[]};}
function pgMs(x){var v=Date.parse(x);return isFinite(v)?v:null;}
function pgNow(now){return typeof now==='number'?now:Date.parse(now);}
function pgSoon(stamp,now){var d=pracDay(stamp),today=pracDay(now);return d!==null&&today!==null&&d<=today+1;}
function pgFirstDate(a,b){return !a||pgMs(b)<pgMs(a)?b:a;}
function pgUniqueSorted(rows){var seen={},out=[];
 rows.forEach(function(x){if(!seen[x.id]){seen[x.id]=1;out.push(x);}});
 return out.sort(function(a,b){return pgMs(a.at)-pgMs(b.at)||(a.id<b.id?-1:a.id>b.id?1:0);});}
function turnRead(p,now){
 var rows=[],limit=pgNow(now)+86400000, qs=['discover','play','flow','embody'];
 function put(q,t,id){var ms=pgMs(t);if(ms!==null&&ms<=limit)rows.push({q:q,ms:ms,id:id});}
 ((p&&p.story&&p.story.entries)||[]).forEach(function(x,i){put('discover',x.t,'story:'+i);});
 ((p&&p.rituals)||[]).forEach(function(x,i){
  put('play',x.t,'ritual:'+i);
  if(x.done!==false)put('flow',(typeof x.done==='string'?x.done:x.t),'done:'+i);
 });
 ((p&&p.history)||[]).forEach(function(x,i){put('embody',x.t,'reading:'+i);});
 rows.sort(function(a,b){return a.ms-b.ms||(a.id<b.id?-1:a.id>b.id?1:0);});
 var touched={}, turns=[];
 rows.forEach(function(r){touched[r.q]=r.ms;
  if(qs.every(function(q){return touched[q]!==undefined;})){turns.push(r.ms);touched={};}});
 return {n:turns.length,turns:turns,last:turns.length?turns[turns.length-1]:null,
  lit:qs.filter(function(q){return touched[q]!==undefined;}),
  open:qs.filter(function(q){return touched[q]===undefined;})};
}
function progressEvents(p,now){
 var out=[],rit={},story={};
 ((p&&p.rituals)||[]).forEach(function(x){
  if(!x||x.done===false||!pgSoon(x.t,now))return;
  var day=pracDay(x.t);rit[day]=pgFirstDate(rit[day],x.t);});
 Object.keys(rit).forEach(function(k){out.push({id:'rd:'+k,type:'ritual.day',at:rit[k],
   day:+k,src:'rituals',ref:String(k)});});
 ((p&&p.story&&p.story.entries)||[]).forEach(function(x){
  if(!x||!(x.imprints>=1)||!pgSoon(x.t,now))return;
  var day=pracDay(x.t);story[day]=pgFirstDate(story[day],x.t);});
 Object.keys(story).forEach(function(k){out.push({id:'sd:'+k,type:'story.day',at:story[k],
   day:+k,src:'story',ref:String(k)});});
 ((p&&p.meter&&p.meter.firsts)||[]).forEach(function(x){
  if(!x||!pgSoon(x.t,now))return;
  var m=/^addr:(\d+)$/.exec(x.k||'');
  if(m&&+m[1]>=0&&+m[1]<112)out.push({id:'ad:'+(+m[1]),
   type:'address.first',at:x.t,day:pracDay(x.t),src:'firsts',ref:x.k});
  if(/^seat:[^:]+$/.test(x.k||''))out.push({id:'st:'+x.k.slice(5),
   type:'seat.first',at:x.t,day:pracDay(x.t),src:'firsts',ref:x.k});});
 ((p&&p.history)||[]).forEach(function(x,i){
  if(x&&pgSoon(x.t,now))out.push({id:'rg:'+i+':'+x.t,type:'reading',
   at:x.t,day:pracDay(x.t),src:'history',ref:String(i)});});
 turnRead(p,now).turns.forEach(function(ms,i){var at=new Date(ms).toISOString();
  out.push({id:'tn:'+(i+1),type:'turn.closed',at:at,
   day:pracDay(at),src:'turn',ref:String(i+1)});});
 return pgUniqueSorted(out);
}
function pgContext(p,now){
 var ev=progressEvents(p,now), seats={}, addrs={}, stories={}, done={};
 ev.forEach(function(e){
  if(e.type==='seat.first')seats[e.id.slice(3)]=1;
  if(e.type==='address.first')addrs[e.id.slice(3)]=1;
  if(e.type==='ritual.day')done[e.day]=1;});
 ((p&&p.story&&p.story.entries)||[]).forEach(function(e){
  if(e&&pgSoon(e.t,now))stories[pracDay(e.t)]=1;});
 return {p:p,now:now,events:ev,ledger:ledgerRead(p,now),streak:streakRead(p,now),
  turn:turnRead(p,now),seats:Object.keys(seats),addrs:Object.keys(addrs),
  storyDays:Object.keys(stories).length,ritualDays:Object.keys(done).length};}
function pgMarkTrue(m,c){
 if(m.k==='named'||m.k==='ring'||m.k==='rings')return !!m.t(c);
 if(m.k==='told')return ((c.p&&c.p.story&&c.p.story.entries)||[]).some(function(e){return e&&pgSoon(e.t,c.now);});
 if(m.k==='kept')return c.storyDays>=10;
 if(m.k==='ten')return c.addrs.length>=10;
 if(m.k==='fifty')return c.addrs.length>=50;
 if(m.k==='first')return c.ledger.done>=1;
 if(m.k==='week')return c.streak.days>=7;
 if(m.k==='month')return c.streak.days>=30;
 if(m.k==='season')return c.streak.days>=90;
 if(m.k==='watched')return c.events.filter(function(e){return e.type==='reading';}).length>=10;
 try{return !!m.t(c.ledger,c.streak,c.p);}catch(e){return false;}
}
function pgProof(m,c){
 var E=c.events, filter=function(t){return E.filter(function(e){return e.type===t;});},
  rows=[],cut=null;
 if(m.k==='first'||m.k==='week'||m.k==='month'||m.k==='season'){
  rows=filter('ritual.day');cut={first:1,week:7,month:30,season:90}[m.k];}
 else if(m.k==='ten'||m.k==='fifty'){rows=filter('address.first');cut=m.k==='ten'?10:50;}
 else if(m.k==='named'){rows=filter('seat.first');cut=7;}
 else if(m.k==='watched'){rows=filter('reading');cut=10;}
 else if(m.k==='ring'||m.k==='rings'){rows=filter('turn.closed');cut=m.k==='ring'?1:10;}
 else if(m.k==='kept'||m.k==='told'){
  var dates={};((c.p&&c.p.story&&c.p.story.entries)||[]).forEach(function(x){
   if(x&&pgSoon(x.t,c.now)){var day=pracDay(x.t);dates[day]=pgFirstDate(dates[day],x.t);}});
  rows=Object.keys(dates).map(function(k){return {id:'story:'+k,at:dates[k]};})
   .sort(function(a,b){return pgMs(a.at)-pgMs(b.at);});
  cut=m.k==='told'?1:10;
 }else if(m.k==='hour'){
  var d=((c.p&&c.p.rituals)||[]).filter(function(x){return x&&x.done!==false&&pgSoon(x.t,c.now);})
   .sort(function(a,b){return pgMs(a.t)-pgMs(b.t);}),minutes=0;
  for(var i=0;i<d.length;i++){minutes+=(+d[i].min||0);if(minutes>=60){return {at:d[i].t,ev:filter('ritual.day').map(function(e){return e.id;})};}}
 }
 if(cut!==null&&rows.length>=cut)return {at:rows[cut-1].at,
  ev:rows.slice(0,cut).map(function(e){return e.id;})};
 return {at:null,ev:[]};
}
function markTest(p,now){var c=pgContext(p,now),out=[];
 PG_MARKS.forEach(function(m){if(!m.retired&&pgMarkTrue(m,c)){
  var proof=pgProof(m,c);out.push({k:m.k,ev:proof.ev,at:proof.at});}});
 return out;}
function pointsRead(p){var cr=((p&&p.progress&&p.progress.credits)||[]),by={};
 var n=0;cr.forEach(function(x){n+=x.n;var t=pgType(x.id);by[t]=(by[t]||0)+x.n;});
 return {n:n,credits:cr.length,byType:by};}
function pgType(id){if(/^rd:/.test(id))return 'ritual.day';
 if(/^sd:/.test(id))return 'story.day';if(/^ad:/.test(id))return 'address.first';return null;}
function progressSettle(p,now){
 var old=(p&&p.progress)||progressBlank(),have={},got={},add={credits:[],marks:[],seen:[]};
 (old.credits||[]).forEach(function(x){have[x.id]=1;});
 progressEvents(p,now).forEach(function(e){var n=PG_RATES[PG_RULE][e.type];
  if(n&&!have[e.id]){add.credits.push({id:e.id,n:n,r:PG_RULE,at:e.at});have[e.id]=1;}});
 (old.marks||[]).forEach(function(x){got[x.k]=1;});
 markTest(p,now).forEach(function(x){if(!got[x.k]){
  var def=PG_MARKS.filter(function(m){return m.k===x.k;})[0];
  if(def){
   /* A fresh state mark has a real grant moment. Older unbagged profiles
      cannot reconstruct when the state first crossed, so backfill stays undated. */
   var at=x.at===null&&p&&p.progress?new Date(pgNow(now)).toISOString():x.at;
   add.marks.push({k:x.k,at:at,v:def.v,ev:x.ev});}
  got[x.k]=1;}});
 return add;
}
function pgValidId(id){if(typeof id!=='string')return false;
 var m=/^(rd|sd):(-?\d+)$/.exec(id);
 if(m)return /^(?:0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(m[2]);
 m=/^ad:(\d+)$/.exec(id);return !!m&&(+m[1]>=0&&+m[1]<112&&String(+m[1])===m[1]);}
function progressValidate(errs,o,path){
 path=path||'progress';
 if(o===undefined||o===null)return progressBlank();
 var blank=progressBlank();
 if(!o||typeof o!=='object'||Array.isArray(o)){errs.push(path+' is not an object');return blank;}
 Object.keys(o).forEach(function(k){if(['points','balance','total','level','userId','user_id'].indexOf(k)>=0)
  errs.push(path+'.'+k+' is not held by this product');
  else if(['v','credits','marks','seen'].indexOf(k)<0)errs.push(path+' may not carry '+k);});
 if(!Number.isInteger(o.v)||o.v<1||o.v>PG_SCHEMA_V)errs.push(path+'.v is not a supported version');
 function list(k,cap){if(!Array.isArray(o[k])){errs.push(path+'.'+k+' is not a list');return [];}
  if(o[k].length>cap)errs.push(path+'.'+k+' holds '+o[k].length+' entries, cap '+cap);return o[k];}
 var cs={},ms={},ss={};
 list('credits',PG_CAP.credits).forEach(function(x,i){
  var at=path+'.credits['+i+']';
  if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(at+' is not an object');return;}
  Object.keys(x).forEach(function(k){if(['id','n','r','at'].indexOf(k)<0)errs.push(at+' may not carry '+k);});
  if(!pgValidId(x.id))errs.push(at+'.id is not a credited event id');
  if(cs[x.id])errs.push(at+'.id is repeated: '+x.id);cs[x.id]=1;
  if(!Number.isInteger(x.r)||x.r<1)errs.push(at+'.r is not a rule version');
  if(!Number.isInteger(x.n)||x.n<0||x.n>100000)errs.push(at+'.n is not a point amount');
  var type=pgType(x.id),rate=PG_RATES[x.r]&&PG_RATES[x.r][type];
  if(PG_RATES[x.r]&&x.n!==rate)errs.push(at+'.n does not match the published rate');
  if(pgMs(x.at)===null)errs.push(at+'.at is not a date');
  blank.credits.push({id:x.id,n:x.n,r:x.r,at:x.at});});
 list('marks',PG_CAP.marks).forEach(function(x,i){
  var at=path+'.marks['+i+']';
  if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(at+' is not an object');return;}
  Object.keys(x).forEach(function(k){if(['k','at','v','ev'].indexOf(k)<0)errs.push(at+' may not carry '+k);});
  if(!PG_MARKS.some(function(m){return m.k===x.k;}))errs.push(at+'.k is not a mark: '+x.k);
  if(ms[x.k])errs.push(at+'.k is repeated: '+x.k);ms[x.k]=1;
  if(x.at!==null&&pgMs(x.at)===null)errs.push(at+'.at is not a date');
  if(!Number.isInteger(x.v)||x.v<1)errs.push(at+'.v is not a rule version');
  if(!Array.isArray(x.ev)||x.ev.some(function(s){return typeof s!=='string';}))
   errs.push(at+'.ev is not a list of evidence ids');
  blank.marks.push({k:x.k,at:x.at,v:x.v,ev:x.ev});});
 list('seen',PG_CAP.seen).forEach(function(x,i){
  var at=path+'.seen['+i+']';
  if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(at+' is not an object');return;}
  Object.keys(x).forEach(function(k){if(['k','at'].indexOf(k)<0)errs.push(at+' may not carry '+k);});
  if(PG_INTROS.indexOf(x.k)<0)errs.push(at+'.k is not an introduction');
  if(ss[x.k])errs.push(at+'.k is repeated: '+x.k);ss[x.k]=1;
  if(pgMs(x.at)===null)errs.push(at+'.at is not a date');
  blank.seen.push({k:x.k,at:x.at});});
 return blank;
}
function progressApply(p,add){
 var old=(p&&p.progress)||progressBlank(),a=add||{},errs=[];
 Object.keys(a).forEach(function(k){if(['credits','marks','seen'].indexOf(k)<0)
  errs.push('progress addition may not carry '+k);});
 var checked=progressValidate(errs,old,'progress');
 if(errs.length)return {ok:false,errs:errs};
 var fresh=progressBlank();
 fresh.credits=checked.credits.concat(a.credits||[]);
 fresh.marks=checked.marks.concat(a.marks||[]);
 fresh.seen=checked.seen.concat(a.seen||[]);
 var v=progressValidate(errs,fresh,'progress');
 return errs.length?{ok:false,errs:errs}:{ok:true,progress:v};
}
function progressIntroReady(p,flags){
 flags=flags||{};if(flags.care)return [];
 var have={};(((p&&p.progress&&p.progress.seen)||[])).forEach(function(x){have[x.k]=1;});
 var res=[];
 [['i.saboteur','saboteur'],['i.complex','complex'],['i.hyper','hyper']]
  .forEach(function(x){if(!have[x[0]]&&flags.allowed&&flags.allowed[x[1]]
    &&flags.present&&flags.present[x[1]])res.push(x[0]);});
 if(!have['i.graph']&&flags.graphReady===true)res.push('i.graph');
 return res;
}
function progressShowIntro(p,k,now,flags){
 if(progressIntroReady(p,flags).indexOf(k)<0)return {ok:false,errs:['introduction not eligible or already shown']};
 return progressApply(p,{credits:[],marks:[],seen:[{k:k,at:new Date(pgNow(now)).toISOString()}]});
}
function progressRead(p,now){
 var saved=(p&&p.progress)||progressBlank(),got={};saved.marks.forEach(function(x){got[x.k]=1;});
 var ctx=pgContext(p,now),trueNow=markTest(p,now),left=[],by={},defs={};
 PG_MARKS.forEach(function(m){defs[m.k]=m;if(!got[m.k]&&!m.retired&&m.to)left.push(m);});
 saved.marks.forEach(function(x){var def=defs[x.k];if(def)by[def.q]=(by[def.q]||0)+1;});
 var next=null,best=-1;
 left.forEach(function(m){var n=by[m.q]||0;if(n>best){best=n;next=m;}});
 var odd=saved.credits.filter(function(c){return c.r>=PG_RATES.length||
  pgMs(c.at)>pgNow(now)+86400000;});
 return {points:pointsRead(p),marks:saved.marks.map(function(x){return {receipt:x,def:defs[x.k]||null};}),
  trueNow:trueNow,next:next,streak:ctx.streak,turn:ctx.turn,odd:odd};
}
function progressWhy(p,id,now){
 var b=(p&&p.progress)||progressBlank(),
  cr=b.credits.filter(function(x){return x.id===id;})[0],
  mk=b.marks.filter(function(x){return x.k===id;})[0];
 if(!cr&&!mk)return {kind:null,rows:[]};
 var events=progressEvents(p,now),have={};
 events.forEach(function(x){have[x.id]=x;});
 var ids=cr?[cr.id]:(mk.ev||[]);
 return {kind:cr?'credit':'mark',rows:ids.map(function(k){
  return {id:k,status:have[k]?'present':'removed',at:have[k]?have[k].at:null};}),
  receipt:cr||mk};
}
function progressExample(i,now){
 var p={rituals:[],story:{entries:[]},meter:{unique:[],firsts:[]},history:[],
  axes:{},intake:{},purpose:{},progress:progressBlank()},cadence=[1,2,3,4,7][((i%5)+5)%5];
 var ms=pgNow(now),base=new Date(ms);
 for(var d=30;d>=0;d-=cadence){
  var t=new Date(base.getTime()-d*86400000).toISOString();
  p.rituals.push({t:t,done:t,min:10,steps:[]});
  p.story.entries.push({t:t,imprints:1,text:'Example'});}
 var applied=progressApply(p,progressSettle(p,now));if(applied.ok)p.progress=applied.progress;
 return progressRead(p,now);
}
if(typeof module!=='undefined'&&module.exports)Object.assign(module.exports,{
 PG_SCHEMA_V:PG_SCHEMA_V,PG_RULE:PG_RULE,PG_CAP:PG_CAP,PG_RATES:PG_RATES,
 PG_EVENTS:PG_EVENTS,PG_INTROS:PG_INTROS,PG_MARKS:PG_MARKS,
 progressBlank:progressBlank,progressEvents:progressEvents,pointsRead:pointsRead,
 markTest:markTest,turnRead:turnRead,progressSettle:progressSettle,
 progressApply:progressApply,progressValidate:progressValidate,
 progressRead:progressRead,progressWhy:progressWhy,progressIntroReady:progressIntroReady,
 progressShowIntro:progressShowIntro,progressExample:progressExample});
