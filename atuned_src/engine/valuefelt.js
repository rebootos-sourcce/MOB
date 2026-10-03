/* ============================================================
   VALUE FELT AFTER SESSION ONE.

   reviews/ATUNED-Creative-Storyboard-TDD.md section 49, "New required
   measure", and section 72, the value research handshake. After a person's
   first release, three questions, in the document's own words because a
   research question reworded is a different measure:

     How valuable was that experience to you?
     What made it valuable or not valuable?
     Would you spend ten minutes doing this again?

   Captured as section 72 names them: PERCEIVED_VALUE, VALUE_REASON,
   REPEAT_INTENT. Section 49 also lists REPEAT_REASON and STOP_REASON, and
   section 73 rules that "each measure must be tied to an actual question".
   Neither of those two has a question in the document, so neither is
   captured here, and that is said rather than invented.

   THE DOCUMENT ASKS IT TWICE, IN TWO WORDINGS. Sections 49 and 72 say "How
   valuable was that experience to you?". Section 51, frame 14, says "Was that
   useful to you?" and "Do not ask for a generic satisfaction score first".
   This uses sections 49 and 72, the two that define the measure. Which one
   he wants is his; the wording lives in VF_Q, one table, so the change is
   one line.

   WHERE IT IS KEPT, AND WHY NOT A NEW FIELD. On the record, as evidence,
   through practiceDo and so through the same boundary an import passes. The
   evidence spec already holds a free metric, a string or number value and a
   notes field, so nothing in the schema moves and v1 records still load. It
   is the person's own report about how the experience felt, so the
   dimension is affect and never effect, which keeps section 72's rule that
   value is not outcome: prClaimErr already refuses an outcome that claims
   change on affect alone. It names no pattern and no practice event, so it
   emits no graph edge: a value report is not evidence for or against any
   address.

   IT STAYS ON THE DEVICE. Nothing here sends. Counting value across people
   is a measure of many people's self report, which needs the owner's
   privacy and business decision first (reviews/MASTER-BMT-AUDIT.md 2.3,
   section 35). The outbox in engine/outbox.js is the one seam that already
   sends, with consent said before typing, so if he rules it should travel,
   it travels there and not through a second path.

   WHEN IT IS ASKED. Read off the record and never stored: a release has run
   (meter.relLines or meter.truthLines), nothing has been answered yet, and the first spoken line
   (meter.first) is inside the window. The window is what keeps this a
   measure of session one. Asked a month later it measures something else,
   so after the window it is never asked. A skip writes nothing, the same
   rule the release card's What changed keeps (RV_METRIC, engine/practice.js),
   so a person who skips is asked again on a later open, and only inside the
   window.

   HOST FREE. No document, no window, no storage. ui/valuefelt.js is the
   host half.
   ============================================================ */
var VF_METRIC='session_value';
var VF_AGAIN_METRIC='repeat_intent';
var VF_CONTEXT='first_release';
/* the answers, as keys, and the words each is shown in. Words and not a
   number, because a reading is not a score and neither is this. Not sure is
   the product's own wording for the same tap (RV_SAY). */
var VF_VALUE=['very','somewhat','a_little','not_at_all','not_sure'];
var VF_AGAIN=['yes','no','not_sure'];
var VF_SAY={very:'Very', somewhat:'Somewhat', a_little:'A little',
 not_at_all:'Not at all', not_sure:'Not sure', yes:'Yes', no:'No'};
var VF_Q={value:'How valuable was that experience to you?',
 reason:'What made it valuable or not valuable?',
 again:'Would you spend ten minutes doing this again?'};
var VF_WINDOW_DAYS=3;
var VF_REASON_MAX=600;

function vfIsOwn(e){return !!(e&&(e.metric===VF_METRIC||e.metric===VF_AGAIN_METRIC));}
/* what the record says was answered, newest last. Read off the evidence. */
function valueFeltRead(P){
 var ev=(P&&Array.isArray(P.evidence))?P.evidence:[];
 return ev.filter(vfIsOwn).map(function(e){
  return {metric:e.metric, value:e.value, reason:e.notes||null, at:e.timestamp};})
  .sort(function(a,b){return String(a.at)<String(b.at)?-1:String(a.at)>String(b.at)?1:0;});}
/* whether to ask, and why, so a gate can hold every branch by its reason */
function valueFeltDue(p,now){
 if(!p||typeof p!=='object')return {due:false, why:'no record'};
 var m=p.meter||{};
 /* a release is either kind of line said: a run of reframe lines alone
    adds to truthLines and leaves relLines at nothing, and it is still a
    release the person ran */
 var said=(typeof m.relLines==='number'?m.relLines:0)+(typeof m.truthLines==='number'?m.truthLines:0);
 if(!(said>0))return {due:false, why:'no release yet'};
 if(valueFeltRead(p.practice).length)return {due:false, why:'answered'};
 var first=(typeof m.first==='string')?new Date(m.first).getTime():NaN;
 if(isNaN(first))return {due:false, why:'no time for the first release'};
 var t=now?new Date(now).getTime():Date.now();
 if(isNaN(t))return {due:false, why:'no time for now'};
 if(t-first>VF_WINDOW_DAYS*864e5)return {due:false, why:'window closed', since:m.first};
 return {due:true, why:'due', since:m.first};}
/* THE ONE WRITER. ans is {value, reason, again}. value is required, because
   it is the measure; reason and again are optional, and an answer not given
   is not written. All or nothing: either every record the answer makes is on
   the practice object handed back, or none is and the object comes back
   untouched. Returns {ok, P, ids} or {ok:false, P, errs}, every reason named,
   and nothing is ever clamped or cut: a reason over the limit is refused by
   name, because a silently shortened sentence reads back as something the
   person never said. */
function valueFeltRecord(P,ans,now){
 var base=P||practiceBlank(), errs=[], a=ans||{};
 if(VF_VALUE.indexOf(a.value)<0)
  errs.push('a value answer is one of '+VF_VALUE.join(', ')+', not '+JSON.stringify(a.value));
 if(a.again!=null&&VF_AGAIN.indexOf(a.again)<0)
  errs.push('an again answer is one of '+VF_AGAIN.join(', ')+', not '+JSON.stringify(a.again));
 var why=null;
 if(a.reason!=null){
  if(typeof a.reason!=='string')errs.push('a reason is words, not '+typeof a.reason);
  else{ why=a.reason.trim()||null;
   if(why&&why.length>VF_REASON_MAX)
    errs.push('a reason is at most '+VF_REASON_MAX+' characters, and this one is '+why.length);}}
 if(errs.length)return {ok:false, P:base, errs:errs};
 var t=now||new Date().toISOString(), Q=base, out=[];
 var recs=[{metric:VF_METRIC, value:a.value, notes:why}];
 if(a.again!=null)recs.push({metric:VF_AGAIN_METRIC, value:a.again, notes:null});
 for(var i=0;i<recs.length;i++){
  var r=practiceDo(Q,'evidence_record',{source:'user', type:'internal', dimension:'affect',
   pattern_id:null, context:VF_CONTEXT, metric:recs[i].metric, value:recs[i].value,
   notes:recs[i].notes, timestamp:t},t);
  if(!r.ok)return {ok:false, P:base, errs:r.errs};
  Q=r.P; out.push(r.id);}
 return {ok:true, P:Q, ids:out};}
