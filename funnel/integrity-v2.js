(function(){
'use strict';
/* ATÜNED integrity 21 V2. Public Core 10 + companion diagnostic use ONE
   canonical question bank and ONE versioned raw-answer store.
   This module deliberately DOES NOT call legacy iqApply, read or CQ.
   Production server/account linking remains a separate, unverified gate. */
var bank=window.ATUNED_INTEGRITY21_V2;
var app=document.getElementById('app');
var mode=document.body.getAttribute('data-mode')==='diagnostic'?'diagnostic':'core';
var STORE_KEY='atuned.integrity21.v2.answers';
var KIND='atuned.integrity21.v2';
var statuses=['answered','not_applicable','skipped'];
var keys=['BEHAVIOR','PRESSURE','MECHANISM'];
var stored={kind:KIND,schemaVersion:'2.0.0',updatedAt:null,answers:{}};
var persistence=true,notice='',stage='intro',step=0;
var idset={}, lawById={};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function checkedBank(){
 if(!bank||bank.schemaVersion!=='2.0.0'||!Array.isArray(bank.laws)||bank.laws.length!==21)throw Error('The 21-law question bank has an invalid version or count.');
 var ids={};
 bank.laws.forEach(function(l){
  if(lawById[l.id]||!l.questions||l.questions.length!==3)throw Error('Duplicate or incomplete law: '+l.id);
  lawById[l.id]=l;
  l.questions.forEach(function(q,k){
   if(ids[q.id]||q.id!==l.id+':'+['B','P','M'][k]||q.register!==keys[k]||
    q.polarity!==(k===2?'REVERSE_PROTECTIVE_PATTERN':'ALIGNED'))throw Error('Question register is incompatible: '+q.id);
   ids[q.id]=true;
  });
 });
 if(Object.keys(ids).length!==63||bank.funnel.lawIds.length!==10||
  bank.diagnostic.lawIds.length!==21)throw Error('Incompatible question bank or funnel subset.');
 bank.funnel.lawIds.forEach(function(id){if(!lawById[id])throw Error('Unrecognized funnel law '+id);});
 idset=ids;
}
function validate(data){
 if(!data||data.kind!==KIND||data.schemaVersion!=='2.0.0'||!data.answers||
  typeof data.answers!=='object'||Array.isArray(data.answers))throw Error('This file is not a version 2 integrity assessment.');
 var out={kind:KIND,schemaVersion:'2.0.0',updatedAt:data.updatedAt||null,answers:{}};
 Object.keys(data.answers).forEach(function(id){
  if(!idset[id])throw Error('File contains an unknown question '+id);
  var a=data.answers[id];
  if(!a||statuses.indexOf(a.status)<0)throw Error('Invalid answer status for '+id);
  if(a.status==='answered'){
   if(typeof a.value!=='number'||!Number.isInteger(a.value)||a.value<0||a.value>10)
    throw Error('Invalid 0–10 answer for '+id);
  }else if(a.value!==null)throw Error('Missing response must carry null: '+id);
  out.answers[id]={status:a.status,value:a.status==='answered'?a.value:null,
   updatedAt:typeof a.updatedAt==='string'?a.updatedAt:null};
 });
 return out;
}
function load(){
 try{var text=localStorage.getItem(STORE_KEY);if(text)stored=validate(JSON.parse(text));}
 catch(e){persistence=false;notice='This browser cannot retrieve saved answers. You can complete the quiz in this session and export a copy.';}
}
function save(){
 stored.updatedAt=new Date().toISOString();
 try{localStorage.setItem(STORE_KEY,JSON.stringify(stored));
  if(localStorage.getItem(STORE_KEY)!==JSON.stringify(stored))throw Error('Save verification failed');persistence=true;
 }catch(e){persistence=false;notice='Local saving failed. Export your answers before leaving this page.';}
}
function answer(q){return stored.answers[q.id]||null;}
function setAnswer(qid,status,value){
 if(!idset[qid]||statuses.indexOf(status)<0)return;
 stored.answers[qid]={status:status,value:status==='answered'?Number(value):null,updatedAt:new Date().toISOString()};
 save();
}
function questions(laws){var a=[];laws.forEach(function(l){l.questions.forEach(function(q){a.push(q);});});return a;}
var core,remaining,all;
function active(){return mode==='core'?core:remaining;}
function counts(laws){
 var out={answered:0,not_applicable:0,skipped:0,unanswered:0,total:laws.length*3};
 questions(laws).forEach(function(q){var a=answer(q);if(!a)out.unanswered++;else out[a.status]++;});
 return out;
}
function stat(k,label){return '<div class="stat"><b>'+esc(k)+'</b><span>'+esc(label)+'</span></div>';}
function bands(laws){
 var order=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
 return '<div class="seven" role="list" aria-label="Seven Compass bands: question coverage, not a coherence score">'+
  order.map(function(b){
   var ls=laws.filter(function(l){return l.band===b;});
   var n=counts(ls);return '<div class="band" role="listitem"><strong>'+esc(b)+'</strong>'+
    '<span>'+n.answered+'/'+n.total+' ratings</span></div>';
  }).join('')+'</div><p class="micro">The Compass shows response coverage. Filling a band does not mean your coherence improved.</p>';
}
function progress(laws){
 var n=counts(laws),complete=n.answered+n.not_applicable+n.skipped;
 return '<p class="micro">'+complete+' of '+n.total+' prompts completed or explicitly passed · '+
 n.answered+' numeric · '+n.not_applicable+' N/A · '+n.skipped+' skipped</p>'+
 '<div class="progress" role="progressbar" aria-label="Assessment response progress" aria-valuemin="0" aria-valuemax="'+n.total+'" aria-valuenow="'+complete+'"><i style="width:'+(100*complete/n.total)+'%"></i></div>';
}
function intro(){
 var c=counts(core),n=counts(remaining);
 var title=mode==='core'?'How coherent are you?':'Complete your 21-law diagnostic.';
 var txt=mode==='core'?'Start with ten integrity laws. Each one asks about an action, a difficult moment, and a protective reaction. Your answers create a starting picture—not a diagnosis or a final CQ number.'
 :'Your first 30 responses stay as you gave them. The remaining eleven laws use the same three questions and the same scale. You can revisit earlier answers without taking the Core 10 again.';
 return '<section><p class="eyebrow">'+(mode==='core'?'Compass · Core 10':'Compass · Complete Diagnostic')+'</p><h1>'+title+'</h1>'+
 '<p class="lead">'+txt+'</p>'+
 '<div class="panel"><h2>One scale for every question</h2>'+
 '<p>Think of the occasions when the exact situation in the question occurred and acting was reasonably possible. <strong>0 = Never. 5 = About half. 10 = Always.</strong></p>'+
 '<p><strong>Not applicable</strong> means the occasion did not occur. <strong>Prefer not to answer</strong> means you chose not to report. Neither is scored as zero.</p>'+
 '<p>The third question asks how often a <em>specific possible protective action</em> happened. A 10 there is not higher integrity, and it does not establish your hidden motivation. Safety, coercion, disability and genuine lack of opportunity should not be treated as personal failure.</p>'+
 '<p class="notice">Responses are stored only in this browser and are not sent to a server. This is not yet account sync or native app intake. You may export, import or clear your data; avoid shared devices.</p>'+
 (notice?'<p role="alert" class="caution">'+esc(notice)+'</p>':'')+
 '</div>'+bands(mode==='core'?core:all)+
 '<div class="row"><button class="primary" data-act="begin">'+(c.answered+c.not_applicable+c.skipped||n.answered+n.not_applicable+n.skipped?'Continue':'Begin')+'</button>'+
 '<button class="secondary" data-act="summary">View my starting picture</button></div>'+
 '<div class="panel"><h2>Keep control of your answers</h2>'+actions()+'</div></section>';
}
function actions(){
 return '<div class="download"><button class="secondary" data-act="export">Export versioned answers</button>'+
 '<label class="secondary" style="cursor:pointer">Import saved answers<input type="file" id="importfile" accept=".json,application/json" style="display:block;max-width:165px;font-size:.75rem;margin-top:5px"></label>'+
 '<button class="secondary" data-act="clear">Erase local answers</button></div>'+
 '<p class="micro">A download contains the raw ratings and question IDs, including N/A and skipped. It is sensitive information: store and share it carefully. No account upload occurs.</p>';
}
function answerButtons(q){
 var a=answer(q),val=a&&a.status==='answered'?a.value:null;
 var n='<div class="answers" role="group" aria-label="Frequency from zero through ten">';
 for(var i=0;i<=10;i++)n+='<button type="button" data-act="rate" data-id="'+q.id+'" data-value="'+i+'" aria-pressed="'+(val===i)+'" aria-label="'+i+' out of ten">'+i+'</button>';
 n+='</div><div class="answer-actions">'+
 '<button data-act="na" data-id="'+q.id+'" aria-pressed="'+!!(a&&a.status==='not_applicable')+'">Not applicable</button>'+
 '<button data-act="skip" data-id="'+q.id+'" aria-pressed="'+!!(a&&a.status==='skipped')+'">Prefer not to answer</button>'+
 '<button data-act="unanswer" data-id="'+q.id+'">Clear answer</button></div>';
 var state=a?(a.status==='answered'?'Your rating: '+a.value+'/10':a.status==='not_applicable'?'Marked not applicable':'Skipped at your choice'):'Not answered';
 return n+'<p class="answer-state" aria-live="polite">'+state+'</p>';
}
function stepPage(){
 var laws=active(),law=laws[step];if(!law){stage='summary';return summary();}
 var n=counts([law]);
 return '<section><p class="eyebrow">'+(mode==='core'?'Core 10':'Additional Diagnostic')+' · '+(step+1)+' / '+laws.length+'</p>'+
 '<h1>'+esc(law.law)+'</h1><p class="muted">'+esc(law.band)+' · Three distinct self-report registers</p>'+progress(laws)+
 '<div class="panel">'+law.questions.map(function(q,i){
  var desc=i===0?'Ordinary behavior':i===1?'Under pressure, when reasonably safe':'Potential protective pattern (reverse-facing)';
  return '<section class="question"><p class="qname">'+esc(desc)+'</p><p class="number">Question '+(i+1)+' of 3</p>'+
  '<h2>'+esc(q.prompt)+'</h2>'+answerButtons(q)+'</section>';
 }).join('')+'</div>'+
 '<p class="micro">'+(n.answered+n.skipped+n.not_applicable)+'/3 prompts on this law explicitly completed or passed. You can leave any question unanswered.</p>'+
 '<div class="row">'+(step?'<button class="secondary" data-act="back">Previous law</button>':'')+
 '<button class="primary" data-act="next">'+(step===laws.length-1?'See my starting picture':'Next law')+'</button>'+
 '<button class="secondary" data-act="summary">View partial picture</button></div>'+
 '<p class="micro">Your responses are saved locally when the browser permits. No CQ figure is calculated from this partial instrument.</p></section>';
}
function answerSay(q){
 var a=answer(q);
 if(!a)return 'No response';
 if(a.status==='not_applicable')return 'Not applicable';
 if(a.status==='skipped')return 'Not reported';
 return a.value+'/10';
}
function summaryRows(laws){
 return laws.map(function(l){
  var b=answer(l.questions[0]),p=answer(l.questions[1]),m=answer(l.questions[2]);
  var gap=(b&&p&&b.status==='answered'&&p.status==='answered')?p.value-b.value:null;
  return '<div class="lawrow"><h3>'+esc(l.law)+' <span class="micro">· '+esc(l.band)+'</span></h3>'+
  '<p class="micro"><b>Behavior:</b> '+answerSay(l.questions[0])+
  ' · <b>Pressure:</b> '+answerSay(l.questions[1])+
  ' · <b>Protective response:</b> '+answerSay(l.questions[2])+'</p>'+
  (gap===null?'':'<p class="micro">Pressure compared with ordinary behavior: '+(gap>0?'+':'')+gap+' points. This is descriptive, not a calibrated integrity deduction.</p>')+
  (m&&m.status==='answered'&&m.value>0?'<p class="micro">The suggested mechanism occurred at your reported frequency; whether this explanation fits remains yours to decide.</p>':'')+'</div>';
 }).join('');
}
function summary(){
 var c=counts(core),d=counts(remaining),a=counts(all);
 var completed=a.answered+a.not_applicable+a.skipped;
 var activeLaws=mode==='core'?core:all;
 var strengths=activeLaws.filter(function(l){var ans=answer(l.questions[0]);return ans&&ans.status==='answered';})
  .sort(function(x,y){return answer(y.questions[0]).value-answer(x.questions[0]).value;}).slice(0,3);
 var challenges=activeLaws.filter(function(l){var ans=answer(l.questions[1]);return ans&&ans.status==='answered';})
  .sort(function(x,y){return answer(x.questions[1]).value-answer(y.questions[1]).value;}).slice(0,3);
 return '<section><p class="eyebrow">Your starting picture · version 2</p><h1>Here is what your answers say.</h1>'+
 '<p class="lead">These are your own responses, not an invented psychological profile. A partial Core 10 cannot establish the final 21-law Coherence Quotient.</p>'+
 '<div class="stats">'+stat(c.answered+'/30','Core 10 numeric responses')+
 stat(d.answered+'/33','Additional diagnostic numeric responses')+
 stat(a.not_applicable,'Not applicable')+
 stat(a.skipped,'Chose not to answer')+'</div>'+
 bands(mode==='core'?core:all)+
 '<div class="panel"><h2>Patterns to look at, not labels to accept</h2>'+
 '<p><span class="smallcaps">Self-reported strengths</span><br>'+
 (strengths.length?strengths.map(function(l){return esc(l.law)+' ('+answer(l.questions[0]).value+'/10)';}).join(' · '):'Not enough reported behavior ratings yet.')+'</p>'+
 '<p><span class="smallcaps">Possible areas to explore</span><br>'+
 (challenges.length?challenges.map(function(l){return esc(l.law)+' under pressure ('+answer(l.questions[1]).value+'/10)';}).join(' · '):'Not enough pressure ratings yet.')+'</p>'+
 '<p class="notice">These rankings cover only the questions you answered. The protective mechanism questions do not prove motives, saboteurs, complexes, or a physical condition. You can reject any proposed interpretation.</p></div>'+
 '<div class="panel"><h2>Your exact report by law</h2>'+summaryRows(activeLaws)+'</div>'+
 '<div class="panel"><h2>One real-world example to test</h2>'+
 (challenges.length&&challenges[0].vignette?
 '<p class="smallcaps">'+esc(challenges[0].law)+' · illustrative situation</p>'+
 '<h3>'+esc(challenges[0].vignette.title)+'</h3>'+
 '<p>'+esc(challenges[0].vignette.story)+'</p>'+
 '<p><b>One action to consider:</b> '+esc(challenges[0].vignette.becomingAction)+'</p>'+
 '<p class="micro">'+esc(challenges[0].vignette.contextBoundary)+'</p>'+
 '<p class="notice">This story is an example, not something we know happened to you. Keep or reject it based on your lived experience.</p>'
 :'<p>When you have an example from your own day, the application can help you test a possible pattern.</p>')+
 '</div>'+
 '<div class="panel"><h2>What has not been measured</h2>'+
 '<p>'+a.unanswered+' unanswered prompts, '+a.not_applicable+' N/A, '+a.skipped+' skipped. '+(mode==='core'?'The remaining eleven laws are not included in this initial snapshot. ':'')+
 'No canonical CQ has been calculated, and we have not read personal stories, specific body tissue, hidden beliefs, or intentions.</p>'+
 '<p>Try a concrete event next: What happened, what did you do, and what did you notice? You decide whether any interpretation fits.</p></div>'+
 '<div class="row"><button class="primary" data-act="edit">Review my questions</button>'+
 (mode==='core'?'<a class="primary" href="diagnostic-v2.html">Continue the remaining 33</a>':'<a class="primary" href="quiz-v2.html">Review the original 30</a>')+
 '<a class="secondary" href="../source.html">Open app and import responses</a></div>'+
 '<div class="panel"><h2>Keep your reading</h2><p>The updated diagnostic uses the same local answers. The app now has an explicit Core 10 import control inside its three-register Diagnostic. After opening the app, open Diagnostic, choose Import from this browser, or import your downloaded quiz file. The app does not auto-import without your choice. Cross-device account synchronization is not yet verified.</p>'+
 actions()+'</div><p class="micro">'+completed+'/63 recorded question statuses overall. Your answer history and canonical IDs remain exportable without rerating answered Core 10 laws.</p></section>';
}
function render(){
 app.innerHTML=stage==='intro'?intro():stage==='step'?stepPage():summary();
}
function focusMain(){render();window.scrollTo(0,0);app.focus({preventScroll:true});}
function download(){
 var blob=new Blob([JSON.stringify(stored,null,2)],{type:'application/json'});
 var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='atuned-integrity21-v2-answers.json';
 document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},1000);
}
async function importFile(file){
 try{
  if(!file||file.size>200000)throw Error('File missing or too large.');
  var parsed=validate(JSON.parse(await file.text()));
  if(Object.keys(stored.answers).length&&!window.confirm('Replace your current local quiz answers with the imported file?'))return;
  stored=parsed;save();notice='Your version 2 answers were imported. Core 10 responses will not be repeated in the remaining diagnostic.';
  stage='intro';step=0;focusMain();
 }catch(e){notice='Import rejected: '+e.message;stage='intro';focusMain();}
}
function firstPending(laws){
 for(var i=0;i<laws.length;i++)if(laws[i].questions.some(function(q){return !answer(q);}))return i;
 return 0;
}
app.addEventListener('click',function(e){
 var b=e.target.closest('[data-act]');if(!b)return;var action=b.getAttribute('data-act'),id=b.getAttribute('data-id');
 if(action==='rate'||action==='na'||action==='skip'||action==='unanswer'){
  if(action==='unanswer'){delete stored.answers[id];save();}
  else setAnswer(id,action==='rate'?'answered':action==='na'?'not_applicable':'skipped',
    action==='rate'?Number(b.getAttribute('data-value')):null);
  render();
  var match=app.querySelector('[data-act="'+action+'"][data-id="'+id+'"]');
  if(action==='rate')match=app.querySelector('[data-act="rate"][data-id="'+id+'"][data-value="'+b.getAttribute('data-value')+'"]');
  if(match)match.focus({preventScroll:true});
  return;
 }
 if(action==='begin'){stage='step';step=firstPending(active());focusMain();}
 else if(action==='next'){if(step<active().length-1){step++;stage='step';}else stage='summary';focusMain();}
 else if(action==='back'){step=Math.max(0,step-1);stage='step';focusMain();}
 else if(action==='summary'){stage='summary';focusMain();}
 else if(action==='edit'){stage='step';step=0;focusMain();}
 else if(action==='export'){download();}
 else if(action==='clear'){
  if(window.confirm('Erase all saved Core 10 and remaining diagnostic responses from this browser?')){
   stored={kind:KIND,schemaVersion:'2.0.0',updatedAt:null,answers:{}};save();
   notice='Local answers cleared.';stage='intro';step=0;focusMain();}
 }
});
app.addEventListener('change',function(e){if(e.target.id==='importfile'){importFile(e.target.files[0]);}});
try{
 checkedBank();
 core=bank.funnel.lawIds.map(function(id){return lawById[id];});
 remaining=bank.diagnostic.lawIds.filter(function(id){return bank.funnel.lawIds.indexOf(id)<0;}).map(function(id){return lawById[id];});
 all=bank.diagnostic.lawIds.map(function(id){return lawById[id];});
 if(core.length!==10||remaining.length!==11)throw Error('Question ordering is inconsistent.');
 load();render();
}catch(e){app.innerHTML='<h1>Assessment unavailable</h1><p role="alert">'+esc(e.message)+
 '</p><p>The quiz cannot safely guess or show an incorrect reading. Please report this problem.</p>';}
window.ATUNED_QV2_DEBUG={counts:function(){return {core:counts(core),remaining:counts(remaining)};},
 validate:validate, bankVersion:function(){return bank.schemaVersion;}};
})();