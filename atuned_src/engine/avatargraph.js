/* ATUNED Avatar graph projection v0.8. Pure, read-only. Canon: trace.js/read.js. */
var AVATAR_GRAPH=(function(){
'use strict';
var VERSION=2,CAP=16,SEATS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
var CHAIN=['saboteur','complex','hyper_complex','super_complex'], TYPES=['pattern'].concat(CHAIN);
var PROVENANCE=['known','inferred','proposed','user_confirmed','observed'];
var REL=['supports','obstructs','reinforces','addresses','targets','implements','executes','produces','contradicts','replaces','requires','measures','occurs_in','generalizes_to','transfers_to'];
function key(t,id){return t+':'+id;}
function kind(k){return String(k).slice(0,String(k).indexOf(':'));}
function own(o,k){return Object.prototype.hasOwnProperty.call(o,k);}
function nr(s){
 if(!s||typeof s!=='object')return null;
 if(s.kind==='seat'&&typeof s.id==='string'){var b=SEATS.filter(function(x){return x.toLowerCase()===s.id.toLowerCase();})[0];return b?{kind:'seat',id:b}:null;}
 if(s.kind==='pattern'&&/^(?:0|[1-9]\d{0,2})$/.test(String(s.id)))return {kind:'pattern',id:String(s.id)};
 if(s.kind==='structure'&&CHAIN.indexOf(s.type)>=0&&typeof s.id==='string'&&s.id.length>0&&s.id.length<=120&&!/[\u0000-\u001f]/.test(s.id))return {kind:'structure',type:s.type,id:s.id};
 return null;
}
function base(status,notice){return {v:VERSION,status:status,readingStatus:'not_measured',selection:null,nodes:[],edges:[],
 evidence:{known:0,inferred:0,proposed:0,user_confirmed:0,observed:0,storyLinks:0,confirmed:0,rejected:0,conflicted:0},
 graph:{alg:null,gaps:0,refused:0},truncated:false,notice:notice||'Registration is not causation. An inference is not a diagnosis.'};}
function verdict(p,id){
 var yes=false,no=false,arr=p&&p.story&&Array.isArray(p.story.entries)?p.story.entries:[];
 arr.forEach(function(e){var o=e&&e.ob;if(!o)return;
 if(Array.isArray(o.yes)&&o.yes.some(function(x){return String(x)===id;}))yes=true;
 if(Array.isArray(o.no)&&o.no.some(function(x){return String(x)===id;}))no=true;});
 return yes&&no?'conflicted':no?'rejected':yes?'confirmed':'not_recorded';
}
function personal(e,reading){
 if(!e||e.edge==='causes')return false;
 if(e.src==='user_confirmed'||e.src==='observed')return true;
 if(e.src==='inferred'&&kind(e.from)==='story'&&kind(e.to)==='pattern'&&e.edge==='supports')return true;
 if(reading&&e.src==='inferred'&&e.edge==='supports'&&
 ((kind(e.from)==='pattern'&&kind(e.to)==='saboteur')||
 (CHAIN.indexOf(kind(e.from))>=0&&CHAIN.indexOf(kind(e.to))>=0)))return true;
 return false;
}
function relation(e){return !!(e&&e.edge!=='causes'&&REL.indexOf(e.edge)>=0&&TYPES.indexOf(kind(e.from))>=0&&TYPES.indexOf(kind(e.to))>=0&&
 (e.edge==='supports'||e.edge==='obstructs'||e.edge==='reinforces')&&e.src!=='known');}
function safeNode(n,p){
 var id=String(n.id),type=n.type,st=type==='pattern'?verdict(p,id):'not_recorded';
 var label=type==='pattern'?String(n.name||n.fetter||('Address '+id)):id;
 return {key:key(type,id),type:type,label:label.slice(0,120),seat:typeof n.seat==='string'?n.seat:null,
 provenance:PROVENANCE.indexOf(n.src)>=0?n.src:'inferred',status:st,
 weight:CHAIN.indexOf(type)>=0&&typeof n.w==='number'&&isFinite(n.w)?n.w:null};
}
function project(args){
 args=args||{};
 if(args.authorized!==true)return base('access_denied','No authorized active profile supplied.');
 var p=args.profile,e=args.engine,s=nr(args.selection);
 if(!p||typeof p!=='object'||typeof p.id!=='string'||!p.id)return base('no_record','No active record.');
 if(!e||typeof e.traceFromRecord!=='function'||typeof e.traceNeighbors!=='function')return base('unavailable','Canonical trace engine unavailable.');
 if(!s)return base('unsupported_selection','No canonical target for this Avatar element.');
 var r=args.reading;
 if(r!=null&&(typeof r!=='object'||r.rec!==p.id))return base('reading_mismatch','The reading does not belong to this record.');
 var out=base('no_evidence');out.selection=s;out.readingStatus=r&&!r.unread?'measured':'not_measured';
 var intents=[];
 if(p.practice&&typeof e.practiceTraceIntents==='function'){
  try{intents=e.practiceTraceIntents(p.practice);}catch(x){return base('unavailable','Practice graph intents could not be read.');}
  if(!Array.isArray(intents))return base('unavailable','Invalid canonical practice graph intents.');
 }
 var g;
 try{g=e.traceFromRecord(p,intents,r||undefined);}catch(x){return base('unavailable','Canonical graph read failed.');}
 if(!g||!Array.isArray(g.nodes)||!Array.isArray(g.edges))return base('unavailable','Invalid canonical graph.');
 out.graph={alg:typeof g.alg==='number'?g.alg:null,gaps:Array.isArray(g.gaps)?g.gaps.length:0,refused:Array.isArray(g.refused)?g.refused.length:0};
 if(r&&Array.isArray(g.refused)&&g.refused.some(function(x){return x&&x.reading;})){
 out.status='graph_refused';out.notice='The canonical engine refused this structural reading.';return out;}
 var lookup=Object.create(null),personalNodes=Object.create(null),edges=[];
 g.nodes.forEach(function(n){if(n&&TYPES.indexOf(n.type)>=0)lookup[key(n.type,n.id)]=n;});
 g.edges.forEach(function(x){if(!x||x.edge==='causes')return;
  if(personal(x,r&&!r.unread)){personalNodes[x.from]=true;personalNodes[x.to]=true;}
  if(relation(x))edges.push(x);
 });
 var roots=[];
 if(s.kind==='seat')roots=g.nodes.filter(function(n){return n&&n.type==='pattern'&&n.seat===s.id&&personalNodes[key(n.type,n.id)];});
 else {var wanted=s.kind==='pattern'?key('pattern',s.id):key(s.type,s.id);
  if(own(lookup,wanted)&&personalNodes[wanted])roots=[lookup[wanted]];}
 function score(n){var k=key(n.type,n.id),v=verdict(p,String(n.id));
  var story=g.edges.some(function(x){return x&&x.to===k&&kind(x.from)==='story'&&x.edge==='supports';});
  return (v==='confirmed'?8:v==='conflicted'?4:v==='rejected'?-8:0)+(story?2:0);}
 roots.sort(function(a,b){return score(b)-score(a)||key(a.type,a.id).localeCompare(key(b.type,b.id));});
 var limit=Number.isInteger(args.limit)?Math.max(1,Math.min(CAP,args.limit)):10;
 var seen=Object.create(null),picked=[];
 function add(n){var k=key(n.type,n.id);if(!lookup[k]||seen[k])return;
 if(picked.length>=limit){out.truncated=true;return;}seen[k]=true;picked.push(n);}
 roots.forEach(add);
 roots.forEach(function(n){
 var near=[];try{near=e.traceNeighbors(g,key(n.type,n.id));}catch(x){near=[];}
 near.forEach(function(x){if(x&&own(lookup,x.key)&&personalNodes[x.key]&&
 edges.some(function(y){return (y.from===x.key&&y.to===key(n.type,n.id))||(y.to===x.key&&y.from===key(n.type,n.id));}))add(lookup[x.key]);});
 });
 out.nodes=picked.map(function(n){var x=safeNode(n,p);
 if(x.status==='confirmed')out.evidence.confirmed++;
 if(x.status==='rejected')out.evidence.rejected++;
 if(x.status==='conflicted')out.evidence.conflicted++;
 return x;});
 var chosen=Object.create(null);out.nodes.forEach(function(n){chosen[n.key]=1;});
 g.edges.forEach(function(x){if(!x||x.edge==='causes')return;
 if(chosen[x.to]&&kind(x.from)==='story'&&x.edge==='supports')out.evidence.storyLinks++;
 if(chosen[x.from]&&chosen[x.to]&&relation(x)){
 if(own(out.evidence,x.src))out.evidence[x.src]++;
 out.edges.push({from:x.from,to:x.to,relationship:x.edge,provenance:x.src});}
 });
 out.status=out.nodes.length?(out.graph.refused?'partial':'ready'):'no_evidence';
 if(out.status==='partial')out.notice='Some graph inputs were refused. Only supported relationships are shown.';
 return out;
}
return {version:VERSION,seats:SEATS.slice(),project:project};
})();
if(typeof module!=='undefined'&&module.exports&&typeof __filename!=='undefined'&&/avatargraph\.js$/.test(__filename))module.exports=AVATAR_GRAPH;
