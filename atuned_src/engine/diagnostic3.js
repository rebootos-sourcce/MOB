
/* Core 10 and full 21 share one law and register ID space.
 * Stored evidence is not a second CQ. Mechanism is reverse-facing and never
 * interpreted as proof of a hidden cause. Missing differs from 0. */
var D3_V=2,D3_REG=['BEHAVIOR','PRESSURE','MECHANISM'];
function d3Blank(){return {v:D3_V,answers:{},statuses:{},startedAt:null,completedAt:null};}
function d3Question(id){
 for(var i=0;i<D3_BANK.length;i++)for(var j=0;j<3;j++)
  if(D3_BANK[i].questions[j].id===id)return D3_BANK[i].questions[j];
 return null;
}
function d3Ensure(p){if(!p)return null;
 if(!p.diagnostic3||p.diagnostic3.v!==D3_V)p.diagnostic3=d3Blank();
 if(!p.diagnostic3.statuses||typeof p.diagnostic3.statuses!=='object')p.diagnostic3.statuses={};
 return p.diagnostic3;
}
function d3Counts(p){
 var d=p&&p.diagnostic3&&p.diagnostic3.v===D3_V?p.diagnostic3:d3Blank();
 var laws=0,core=0,answered=0;
 D3_BANK.forEach(function(l){var n=l.questions.filter(function(q){return typeof d.answers[q.id]==='number';}).length;
  answered+=n;if(n===3){laws++;if(l.core)core++;}});
 return {answered:answered,total:63,completeLaws:laws,coreLaws:core,remainingLaws:21-laws};
}
function d3Answer(p,id,value,now){
 if(!p||!d3Question(id)||!p.id||typeof S==='undefined'||p.id!==S.rec)return false;
 if(typeof showRefuse==='function'&&showRefuse('intake',p))return false;
 var d=d3Ensure(p);
 if(value!==null&&!(typeof value==='number'&&isFinite(value)&&value>=0&&value<=10))return false;
 d.answers[id]=value;
 d.statuses[id]=value===null?'not_applicable':'answered';
 if(!d.startedAt)d.startedAt=now||new Date().toISOString();
 var counts=d3Counts(p);
 d.completedAt=counts.answered===63?(d.completedAt||now||new Date().toISOString()):null;
 return true;
}
function d3Valid(errs,raw){
 if(raw==null)return null;
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.v!==D3_V
  ||!raw.answers||typeof raw.answers!=='object'||Array.isArray(raw.answers)){
  errs.push('three-register record must hold the V2 answer map');return null;}
 var d=d3Blank();
 Object.keys(raw).forEach(function(k){if(['v','answers','statuses','startedAt','completedAt'].indexOf(k)<0)
  errs.push('three-register record may not carry '+k);});
 Object.keys(raw.answers).forEach(function(id){
  var v=raw.answers[id];
  if(!d3Question(id))errs.push('three-register answer map may not carry '+id);
  else if(v!==null&&!(typeof v==='number'&&isFinite(v)&&v>=0&&v<=10))
   errs.push('three-register answer '+id+' is not 0 through 10 or null');
  else d.answers[id]=v;
 });
 /* Additive statuses preserve an explicit skip separately from N/A and
    do not change the numeric diagnostic or the canonical CQ calculation. */
 if(raw.statuses!==undefined){
  if(!raw.statuses||typeof raw.statuses!=='object'||Array.isArray(raw.statuses))
   errs.push('three-register statuses must be a map');
  else Object.keys(raw.statuses).forEach(function(id){
   var state=raw.statuses[id],value=raw.answers[id];
   if(!d3Question(id)||!Object.prototype.hasOwnProperty.call(raw.answers,id))
    errs.push('three-register status has no matching answer '+id);
   else if(['answered','not_applicable','skipped'].indexOf(state)<0)
    errs.push('three-register status is invalid '+id);
   else if(state==='answered' && !(typeof value==='number'&&isFinite(value)&&value>=0&&value<=10))
    errs.push('three-register numeric status requires a number '+id);
   else if(state!=='answered'&&value!==null)
    errs.push('three-register missing status requires null '+id);
   else d.statuses[id]=state;
  });
 }
 Object.keys(d.answers).forEach(function(id){
  if(!d.statuses[id])d.statuses[id]=d.answers[id]===null?'not_applicable':'answered';
 });
 ['startedAt','completedAt'].forEach(function(k){
  var v=raw[k];
  if(v!=null){if(typeof v!=='string'||!isFinite(Date.parse(v)))errs.push('three-register record '+k+' is not a date');
    else d[k]=v;}
 });
 if(d.completedAt&&d3Counts({diagnostic3:d}).answered!==63)errs.push('three-register completion requires all 63 answered prompts');
 return d;
}

/* Import the public Core-10 V2 answer envelope into the native Profile.
 * A caller must request this explicitly. No legacy intake, CQ, laws or
 * account fields are changed. If native answers disagree, require separate
 * user permission to replace those specific question IDs.
 * Atomicity: validate the entire envelope before assigning p.diagnostic3.
 */
function d3ImportV2(p,raw,replaceConflicts){
 if(!p||!p.id||typeof S==='undefined'||p.id!==S.rec)
  return {ok:false,reason:'not_current_profile'};
 if(!raw||raw.kind!=='atuned.integrity21.v2'||raw.schemaVersion!=='2.0.0'
  ||!raw.answers||typeof raw.answers!=='object'||Array.isArray(raw.answers))
  return {ok:false,reason:'invalid_version'};
 var staged=p.diagnostic3?JSON.parse(JSON.stringify(p.diagnostic3)):d3Blank();
 var errors=[],changes=0,conflicts=[];
 if(!staged.statuses||typeof staged.statuses!=='object')staged.statuses={};
 var received=Object.keys(raw.answers);
 if(received.length>63)return {ok:false,reason:'too_many_answers'};
 received.forEach(function(id){
  var a=raw.answers[id];
  if(!d3Question(id)||!a||['answered','not_applicable','skipped'].indexOf(a.status)<0||
    (a.status==='answered'&&!(typeof a.value==='number'&&Number.isInteger(a.value)&&a.value>=0&&a.value<=10))||
    (a.status!=='answered'&&a.value!==null)){
   errors.push(id);return;
  }
  var value=a.status==='answered'?a.value:null;
  if(Object.prototype.hasOwnProperty.call(staged.answers,id) &&
    (staged.answers[id]!==value||(staged.statuses[id]||(
      staged.answers[id]===null?'not_applicable':'answered'))!==a.status)){
   conflicts.push(id);
   if(!replaceConflicts)return;
  }
  staged.answers[id]=value;
  staged.statuses[id]=a.status;
  changes++;
 });
 if(errors.length)return {ok:false,reason:'invalid_answers',ids:errors};
 if(conflicts.length&&!replaceConflicts)return {ok:false,reason:'conflicts',ids:conflicts};
 if(!staged.startedAt&&received.length)staged.startedAt=new Date().toISOString();
 staged.completedAt=d3Counts({diagnostic3:staged}).answered===63?
  (staged.completedAt||new Date().toISOString()):null;
 var validation=[];
 var normalized=d3Valid(validation,staged);
 if(validation.length)return {ok:false,reason:'invalid_profile',errors:validation};
 p.diagnostic3=normalized;
 return {ok:true,imported:changes,conflicts:conflicts.length};
}
