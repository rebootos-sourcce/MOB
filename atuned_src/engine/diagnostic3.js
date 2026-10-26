
/* Core 10 and full 21 share one law and register ID space.
 * Stored evidence is not a second CQ. Mechanism is reverse-facing and never
 * interpreted as proof of a hidden cause. Missing differs from 0. */
var D3_V=2,D3_REG=['BEHAVIOR','PRESSURE','MECHANISM'];
function d3Blank(){return {v:D3_V,answers:{},startedAt:null,completedAt:null};}
function d3Question(id){
 for(var i=0;i<D3_BANK.length;i++)for(var j=0;j<3;j++)
  if(D3_BANK[i].questions[j].id===id)return D3_BANK[i].questions[j];
 return null;
}
function d3Ensure(p){if(!p)return null;
 if(!p.diagnostic3||p.diagnostic3.v!==D3_V)p.diagnostic3=d3Blank();
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
 Object.keys(raw).forEach(function(k){if(['v','answers','startedAt','completedAt'].indexOf(k)<0)
  errs.push('three-register record may not carry '+k);});
 Object.keys(raw.answers).forEach(function(id){
  var v=raw.answers[id];
  if(!d3Question(id))errs.push('three-register answer map may not carry '+id);
  else if(v!==null&&!(typeof v==='number'&&isFinite(v)&&v>=0&&v<=10))
   errs.push('three-register answer '+id+' is not 0 through 10 or null');
  else d.answers[id]=v;
 });
 ['startedAt','completedAt'].forEach(function(k){
  var v=raw[k];
  if(v!=null){if(typeof v!=='string'||!isFinite(Date.parse(v)))errs.push('three-register record '+k+' is not a date');
    else d[k]=v;}
 });
 if(d.completedAt&&d3Counts({diagnostic3:d}).answered!==63)errs.push('three-register completion requires all 63 answered prompts');
 return d;
}
