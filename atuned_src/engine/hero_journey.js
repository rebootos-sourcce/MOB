
/* The realm boundary is exact and CQ is the only coordinate. Stages are
 * equal subdivisions pending approved sub-realm landmarks. */
function hjLocate(cq){
 if(typeof cq!=='number'||!isFinite(cq)||cq<0||cq>100)return null;
 var i=cq<40?Math.min(8,Math.floor(cq/40*9))
  :cq<60?9+Math.min(6,Math.floor((cq-40)/20*7))
  :16+Math.min(9,Math.floor((cq-60)/40*10));
 return HJ_SCENES[i]||null;
}
function hjScene(id){return HJ_SCENES.filter(function(x){return x.id===id;})[0]||null;}
/* Release keys are one line at one somatic address on one channel.
 * The shared meter also holds the reframe keys. Only new release-side
 * Llimit and Rlimit keys may count toward the avatar's release marks. */
function hjReleaseKeys(p){
 var keys=((p&&p.meter&&p.meter.unique)||[]), seen={}, out=[];
 keys.forEach(function(k){if(typeof k!=='string'||!/^\d+:(?:Llimit|Rlimit):\d+$/.test(k)||seen[k])return;
  seen[k]=1;out.push(k);});
 return out;
}
function hjOrigin(p){
 var a=(p&&p.avatar&&p.avatar.cqOrigin)||null;
 if(a&&a.m===CQ_MODEL&&typeof a.cq==='number'&&isFinite(a.cq)&&a.cq>=0&&a.cq<=100)return a;
 /* Older profiles: only a history row with all 21 measured laws can prove
    a full initial CQ. An older row without lawNow is not proof. */
 var h=(p&&p.history)||[];
 for(var i=0;i<h.length;i++){
  var x=h[i], l=x&&x.lawNow;
  if(x&&x.m===CQ_MODEL&&typeof x.cq==='number'&&isFinite(x.cq)&&x.cq>=0&&x.cq<=100&&l&&SINAMES.every(function(n){return typeof l[n]==='number'&&isFinite(l[n]);}))
   return {cq:x.cq,m:x.m,at:x.t,source:'historic-complete-snapshot'};
 }
 return null;
}
function hjRead(p,r){
 r=r||compute(); var span=cqSpan(),complete=!!span.complete&&!r.unread;
 var cq=complete?r.CQ:null,loc=complete?hjLocate(cq):null;
 var origin=hjOrigin(p), keys=hjReleaseKeys(p), h=(p&&p.history)||[];
 var last=null;
 for(var i=h.length-1;i>=0;i--){
  var x=h[i], l=x&&x.lawNow;
  if(x&&x.m===CQ_MODEL&&typeof x.cq==='number'&&isFinite(x.cq)&&x.cq>=0&&x.cq<=100&&l&&SINAMES.every(function(n){return typeof l[n]==='number'&&isFinite(l[n]);})){
   last=x;break;}}
 return {cq:cq,complete:complete,coverage:span.answered,total:span.of,realm:loc&&loc.realm,
  location:loc,origin:origin,delta:origin&&cq!==null?cq-origin.cq:null,
  fromLast:last&&cq!==null?cq-last.cq:null,uniqueReleaseCount:keys.length,
  lastSnapshot:last,active:hjScene(p&&p.avatar&&p.avatar.activeJourneyScene)||loc,
  model:CQ_MODEL};
}
/* Called from saveProfile after actual law values are written, before its one
 * persistence operation. Never invent a CQ baseline from 10 answered laws. */
function hjStampOrigin(p){
 if(!p||!p.avatar||p.avatar.cqOrigin||!p.laws||!SINAMES.every(function(n){return typeof p.laws[n]==='number';}))return false;
 if(typeof S==='undefined'||S.rec!==p.id||!cqSpan().complete)return false;
 var r=compute();
 if(r.unread||!r.complete||!isFinite(r.CQ))return false;
 var origin=hjOrigin(p);
 p.avatar.cqOrigin=origin
  ?{cq:origin.cq,m:origin.m,at:origin.at,source:origin.source}
  :{cq:r.CQ,m:CQ_MODEL,at:new Date().toISOString(),source:'first-complete-reading'};
 return true;
}
/* Identifies eligible imprints by law SEAT, never asserts the imprint is
 * caused by a scene. The person reviews the release card before proceeding. */
function hjReleaseAddresses(scene){
 if(!scene||typeof W==='undefined'||typeof SI==='undefined')return [];
 var bands={},lawList=scene.laws||[];
 SI.forEach(function(l){if(lawList.indexOf(l.nm)>=0)bands[l.b]=true;});
 return W.filter(function(n){return n&&bands[n.b]&&n.cf&&n.sq>=4;})
  .sort(function(a,b){return b.sq-a.sq;}).slice(0,3).map(function(n){return n.i;});
}
function hjRitualCandidate(scene,r){
 if(!scene||!scene.laws||!scene.laws.length||typeof SI==='undefined'||typeof ritFor!=='function')return null;
 var law=SI.filter(function(x){return x.nm===scene.laws[0];})[0];
 if(!law)return null;
 var c=ritFor({darkB:law.b,DQ:r.DQ});
 return c.called?{practice:c.called,band:law.b,law:law.nm,days:7}:null;
}
