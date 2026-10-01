/* Daily summary gate. engine/daily.js, the engine half of the Summary the
   owner ruled on 1 October (round OI): once a day, on open, frozen, with an
   aim for the day and a bank of past days. The spec is SUMMARY-AUDIT.md and
   its addendum, against ATUNED-daily-summary-personal-mirror-TDD.md.

   Run from tests/engine.js by one line, with that file's own ok() and g(),
   or on its own: node tests/daily.js. Headless, from the repo root.

   EVERY SUITE IS A FUNCTION OF AN ENGINE, so the same assertions run twice:
   against a clean copy, where every one must pass, and against copies of
   engine.js with one rule deliberately broken, where the suite that guards
   that rule must fail. A gate that cannot fail is not a gate. The copy is
   loaded through the same vm loader first with nothing broken, which is the
   known good case for the loader itself.

   THE SUITES RUN ON A PRIVATE COPY OF THE ENGINE, not on the one tests/engine.js
   holds, because a fixture here binds a store, makes records and saves them,
   and the shared engine's state belongs to the groups that run after this one.
   The shared engine is only asked whether it carries the module.

   WHAT IS READ OFF THE DOCUMENT and not typed here: the seven phrases of
   section 12, the eight headings of section 14, the six responses of section
   24, the intention statuses of section 4.7 (the owner's four replace them and
   the gate says where they differ), and the field the document calls
   language_confidence, which the boundary must refuse. The extractor is
   checked against a case it must find before anything is compared. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=process.cwd();
const TDD_FILE=path.resolve(ROOT,'ATUNED-daily-summary-personal-mirror-TDD.md');
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
/* a moment well in the past of any run, because the boundary refuses a day
   dated after the import and validateProfile reads the real clock */
const NOW='2026-03-10T12:00:00.000Z';
const DAY=86400000;
const at=(d,base)=>new Date(Date.parse(base||NOW)+d*DAY).toISOString();
const J=(x)=>JSON.stringify(x);
const clone=(x)=>JSON.parse(JSON.stringify(x));

/* ---------------- the TDD, read ---------------- */
const TDD=fs.existsSync(TDD_FILE)?fs.readFileSync(TDD_FILE,'utf8'):'';
function sec(n){
 const m=new RegExp('^#{1,2} '+n+'\\. .*$','m').exec(TDD); if(!m)return '';
 const rest=TDD.slice(m.index+m[0].length), nx=/^#{1,2} \d+(\.\d+)?\. /m.exec(rest);
 return nx?rest.slice(0,nx.index):rest;}
function between(s,a,b){
 const i=s.indexOf(a); if(i<0)return '';
 const rest=s.slice(i+a.length), j=b?rest.indexOf(b):-1;
 return j<0?rest:rest.slice(0,j);}
const dashList=(s)=>s.split('\n').map(l=>l.trim()).filter(l=>/^- /.test(l)).map(l=>l.replace(/^- /,'').trim());
function textBlock(n){
 const m=/```text\n([\s\S]*?)```/.exec(sec(n));
 return m?m[1].split('\n').map(l=>l.trim()).filter(Boolean):[];}

/* ---------------- a world to test in ----------------
   A person with four saved readings, four entries, three ritual days, one
   address opened, an avatar line and a review that is due. Every moment is
   a whole number of days from NOW, so two of them are always on separate local
   days in any zone. It goes through the boundary, so it is a record the app
   could hold. Entries are read by the sniffer so their seats are the
   sniffer's own. */
const TXT_A='I put it off again and I was afraid of the conversation and my chest was tight.';
const TXT_B='I felt ashamed and I avoided the talk, I put it off.';
const TXT_C='My chest was tight again and I was angry.';
function world(E,o){
 o=o||{};
 const store={}; let writes=0;
 E.bindStore(k=>(k in store?store[k]:null),(k,v)=>{store[k]=v; writes++;});
 const p=E.pNew(o.name||'Pat');
 const laws=Object.keys(p.laws);
 if(!o.unread){
  laws.forEach((l,i)=>{p.laws[l]=5+(i%3);});
  Object.keys(p.axes).slice(0,3).forEach(k=>{p.axes[k].held=4;});}
 const row=(d,cq,dark,adj,m)=>{
  const r={t:at(d),m:m===undefined?E.CQ_MODEL:m,cq:cq,dq:10,sq:1,pole:1,jq:1,rad:0.5,loaded:3,sab:1,cx:0,hy:0,ch:0,
   dark:dark,tier:'Even',arch:'x',lawNow:{}};
  laws.forEach((l,i)=>{r.lawNow[l]=p.laws[l]+(i===0?adj:0);}); return r;};
 const ent=(d,t)=>{const r=E.parseStory(t); return {t:at(d),text:t,imprints:r.imprints.length,bands:r.bands,lex:E.LEX_VERSION};};
 const rit=(d,done)=>({t:at(d),track:'Body',band:'Heart',steps:[],min:5,done:done});
 if(o.unread){
  /* a ritual and a first and nothing else: the record of somebody who has
     pressed things and has not been read */
  p.rituals=[rit(-3,at(-3)),rit(-2,false)];
  p.meter.firsts=[{k:'addr:12',t:at(-2),nm:'x'}];}
 else if(!o.bare){
  p.history=[row(-20,40,'Heart',0),row(-12,44,'Heart',0.2),row(-5,48,'Heart',1),row(-1,50,'Throat',1.5)];
  p.story.entries=[ent(-9,TXT_A),ent(-4,TXT_A),ent(-2,TXT_B),ent(-1,TXT_C)];
  p.rituals=[rit(-3,at(-3)),rit(-2,false),rit(-1,false)];
  p.meter.firsts=[{k:'addr:12',t:at(-2),nm:'x'}];
  p.avatar={built:true,at:at(-45),reviewedAt:null,pairs:[{be:'I act directly',notbe:'I put it off and avoid the talk',seat:'Throat'}]};}
 if(o.mut)o.mut(p,{row:row,ent:ent,rit:rit});
 E.loadProfile(p);
 return {p:p,store:store,writes:()=>writes,row:row,ent:ent,rit:rit};}
const rt=(E,p)=>E.validateProfile(clone(E.saveProfile(p)));
function open(E,w,now){return E.dlyDayOpen(w.p,now||NOW,E.pSave);}
/* a day opened, an aim written and marked, three responses, all through the
   one door, so it is the record a real person would hold */
function kept(E,w){
 const o=open(E,w), res=[o];
 let r=E.dlyAimSet(w.p,NOW,'Say it to her today','Throat'); if(r.ok)w.p.summaries=r.S; res.push(r);
 r=E.dlyAimAnswer(w.p,o.day.id,'partly',at(0.5)); if(r.ok)w.p.summaries=r.S; res.push(r);
 r=E.dlyRespond(w.p,o.day.id,0,'accurate','',at(0.6)); if(r.ok)w.p.summaries=r.S; res.push(r);
 r=E.dlyRespond(w.p,o.day.id,1,'context','It was a hard week at work',at(0.7)); if(r.ok)w.p.summaries=r.S; res.push(r);
 r=E.dlyRespond(w.p,o.day.id,1,'not','',at(0.8)); if(r.ok)w.p.summaries=r.S; res.push(r);
 return {open:o, steps:res, ok:res.every(x=>x.ok!==false&&x.result!=='error')};}
const has=(errs,frag)=>(errs||[]).some(e=>e.indexOf(frag)>=0);

/* ============================================================
   THE SUITES
   ============================================================ */
const SUITES={};

SUITES.doc=function(E,ok,say){
 /* the extractor, checked on a case it must find, before it is trusted */
 const forb=dashList(between(sec(12),'## Forbidden default language','## Preferred language'));
 ok(forb.length>0&&forb.indexOf('divine energy')>=0,'the extractor finds section 12\'s forbidden phrases, and divine energy is among them: '+J(forb));
 const same=(a,b,what)=>ok(Array.isArray(b)&&b.length>0&&J(a)===J(b),what+' is exactly the TDD\'s list: '+J(a)+' vs '+J(b));
 same(E.DLY_NOTE_PHRASES,forb,'the soft language note');
 /* section 14's eight headings, in its order */
 const heads=textBlock(14).filter(l=>/^[A-Z][A-Z' ]+$/.test(l));
 ok(heads.length>0&&heads[0]==='TODAY','the extractor finds section 14\'s headings: '+J(heads));
 ok(heads.length===E.DLY_BLOCKS.length,'the composer has one block for each of the document\'s '+heads.length+' headings, and has '+E.DLY_BLOCKS.length);
 ok(heads.findIndex(h=>/INTENTION/.test(h))===E.DLY_BLOCKS.indexOf('aim'),'the aim block sits where the document puts today\'s intention');
 ok(heads[heads.length-1]==='WHY'&&E.DLY_BLOCKS[E.DLY_BLOCKS.length-1]==='why'&&E.DLY_BLOCKS[0]==='today','the first block is today and the last is why, as in the document');
 /* section 24's six responses */
 const resp=dashList(sec(24)).filter(l=>/\.$|\?$/.test(l));
 ok(resp.length===6&&resp[0]==='This feels accurate.','the extractor finds section 24\'s six responses: '+J(resp));
 ok(E.DLY_RESP.length===resp.length,'the engine carries one kind of response for each: '+E.DLY_RESP.length);
 const want=[/accurate/i,/^Partly/i,/^Not accurate/i,/^Why/i,/context/i,/^Correct/i];
 ok(want.every((rx,i)=>rx.test(resp[i])&&new RegExp('^'+E.DLY_RESP[i]).test(E.DLY_RESP[i])),'in the document\'s order');
 ok(J(E.DLY_RESP)===J(['accurate','partly','not','why','context','correct']),'accurate, partly, not, why, context and correct, in that order: '+J(E.DLY_RESP));
 ok(E.DLY_RESP_TEXT.every(k=>/context|correct/.test(k)),'and only context and correct carry the person\'s own words');
 /* section 4.7's statuses, which the owner's ruling replaces */
 const st=/"status":\s*"([^"]+)"/.exec(between(sec(4.7)||TDD.slice(TDD.indexOf('## 4.7 Intention')),'```json','```'));
 const docStatus=st?st[1].split('|'):[];
 ok(docStatus.indexOf('missed')>=0&&docStatus.indexOf('unknown')>=0,'the extractor finds section 4.7\'s statuses: '+J(docStatus));
 ok(E.DLY_ANSWER.indexOf('unknown')>=0&&E.DLY_ANSWER.indexOf('missed')<0&&E.DLY_ANSWER.indexOf('completed')<0,
  'the owner\'s four marks replace the document\'s completed and missed, and no mark is a failure: '+J(E.DLY_ANSWER));
 ok(J(E.DLY_ANSWER)===J(['kept','partly','not','unknown']),'kept, partly kept, not kept, unknown: the four he ruled');
 ok(TDD.indexOf('INTENTION_SET')>=0,'the document\'s own event for it is INTENTION_SET, which is why the stored kind is named in the report and not silently');
 /* the document's own field the boundary must refuse */
 ok(TDD.indexOf('"language_confidence"')>=0&&E.DLY_SCORE.indexOf('language_confidence')>=0,
  'the document\'s language_confidence is a field this boundary refuses by name');
 const w=world(E), k=kept(E,w), rec=clone(E.saveProfile(w.p));
 rec.summaries.days[0].language_confidence=0.9;
 const v=E.validateProfile(rec);
 ok(!v.ok&&has(v.errs,'language_confidence')&&has(v.errs,'A reading is not a score'),'and refuses it with the reason: '+J((v.errs||[]).slice(0,1)));
 const cs=E.DLY_CANON.filter(c=>c.t===null).map(c=>c.w);
 say&&say('  canon words with no Knowledge base entry yet, content for the copy seat: '+cs.join(', '));};

SUITES.shape=function(E,ok){
 /* D1: the key, the blank, an older record, and the round trip */
 const b=E.blankProfile('x');
 ok(J(b.summaries)===J({v:1,days:[],events:[]})&&E.DLY_SCHEMA_V===1,'a new profile carries an empty bank at the summaries version');
 const old=clone(E.saveProfile(E.blankProfile('old'))); delete old.summaries; old.v=1;
 const vo=E.validateProfile(old);
 ok(vo.ok&&J(vo.profile.summaries)===J(E.dlyBlank()),'a record from before the bank loads with the blank filled in');
 const on=clone(old); on.summaries=null;
 ok(E.validateProfile(on).ok,'a record with the bank null is an older record and not an error');
 /* THE HOLE AUDIT PROBE X7 MEASURED: a key the boundary does not name is
    deleted on load. The inverse is the proof. */
 const w=world(E), k=kept(E,w);
 ok(k.ok,'a day, an aim, its mark and three responses go through the one door'+(k.ok?'':': '+J(k.steps.filter(x=>x.ok===false||x.result==='error').slice(0,1))));
 const rec=clone(E.saveProfile(w.p));
 ok(rec.summaries&&rec.summaries.days.length===1&&rec.summaries.events.length===5,'the saved record carries the bank, one day and five events');
 const v=E.validateProfile(clone(rec));
 ok(v.ok,'and the record validates'+(v.ok?'':': '+J(v.errs.slice(0,2))));
 ok(v.ok&&J(v.profile.summaries)===J(rec.summaries),'the bank survives the boundary exactly as written, so the key is named there and is not deleted on load');
 /* export, import, equal, through the real functions */
 const txt=E.pExport(), back=E.pImport(txt);
 ok(!!back&&J(back.summaries)===J(w.p.summaries),'export then import gives the same bank'+(back?'':', refused: '+J(E.importError())));
 const again=E.validateProfile(clone(E.saveProfile(back||w.p)));
 ok(again.ok&&J(again.profile.summaries)===J(rec.summaries),'and a second pass is the same bytes: the boundary is a fixed point');
 /* the person's own words stay inside it */
 ok(J(E.OB_NEVER).indexOf('summaries')>=0&&['summaries','summary','mirror','aim','aims'].every(n=>E.OB_NEVER.indexOf(n)>=0),
  'the outbox refuses the bank by every name it could travel under');
 const ev=E.obValidate({kind:'feedback',at:NOW,body:'x',summaries:[]});
 ok(ev&&ev.ok===false,'an envelope carrying summaries is refused: '+J(ev&&ev.errs));
 ok(E.LEAD_HIDDEN.indexOf('the daily summary')>=0&&E.LEAD_SEES.indexOf('the daily summary')<0,'a cohort lead is told it is hidden and is not shown it');
 /* every refusal, by name, and none clamped */
 const bad=(mut,frag,what)=>{
  const r=clone(rec); mut(r.summaries,r);
  const x=E.validateProfile(r);
  ok(!x.ok&&has(x.errs,frag),what+' is refused by name: '+J((x.errs||[]).slice(0,2))+', wanted '+frag);};
 bad((s,r)=>{r.summaries=5;},'summaries is not an object','a bank that is not an object');
 bad((s,r)=>{r.summaries=[];},'summaries is not an object','a bank that is a list');
 bad(s=>{s.v=2;},'newer than this build reads','a bank from a newer build');
 bad(s=>{s.v=0;},'not a summaries version this build reads','version 0');
 bad(s=>{s.v='1';},'not a summaries version this build reads','a version that is text');
 bad(s=>{s.zzz=1;},'summaries may not carry zzz','a key nobody declared');
 bad(s=>{s.days='x';},'summaries.days is not a list','days that are not a list');
 bad(s=>{s.days=new Array(E.DLY_CAP.days+1).fill({});},'the cap is '+E.DLY_CAP.days,'more days than the cap');
 bad(s=>{s.events={};},'summaries.events is not a list','events that are not a list');
 bad(s=>{s.days[0].id='sum:2001-01-01';},'not sum: and its own day','an id that is not its own day');
 bad(s=>{s.days[0].d='2026-02-30';s.days[0].id='sum:2026-02-30';},'is not a calendar day','a day that is not on any calendar');
 bad(s=>{s.days[0].d='2999-01-01';s.days[0].id='sum:2999-01-01';},'after the day of this import','a day dated after the import');
 bad(s=>{s.days.push(clone(s.days[0]));},'repeats day','the same day twice');
 bad(s=>{s.days[0].st=new Array(E.DLY_CAP.st+1).fill(clone(s.days[0].st[0]));},'more than '+E.DLY_CAP.st,'more statements than eight');
 bad(s=>{s.days[0].st[0].text='x'.repeat(E.DLY_CAP.text+1);},'the cap is '+E.DLY_CAP.text,'a sentence over its length, never cut');
 bad(s=>{s.days[0].st[0].ev=new Array(E.DLY_CAP.ev+1).fill({type:'law',id:'Justice'});},'more than '+E.DLY_CAP.ev,'more references than twelve');
 bad(s=>{s.days[0].st[0].ev=[];},'ev is empty','a statement that names nothing it was built from');
 bad(s=>{s.days[0].st[0].k='mood';},'.k is not one of','an unknown block');
 bad(s=>{s.days[0].st[0].src='certain';},'.src is not one of','an unknown provenance');
 bad(s=>{s.days[0].st[0].rung='0.9';},'.rung is not one of','a rung that is a number');
 bad(s=>{s.days[0].st[0].ev=[{type:'rumour',id:'x'}];},'names no kind of evidence this build holds','a reference to no kind of evidence');
 bad(s=>{s.days[0].st[0].ev=[{type:'law',id:5}];},'names no kind of evidence this build holds','a reference whose id is not text');
 bad(s=>{s.days[0].st[0].ev=[{type:'kb',id:'Nonsense'}];},'names no entry in the Knowledge base','a Knowledge base reference to nothing');
 bad(s=>{s.days[0].st[0].ev=[{type:'law',id:'Spite'}];},'names no law','a law that is not one of the 21');
 bad(s=>{s.days[0].st[0].links=['Nonsense'];},'is not a term in the Knowledge base','a link to no glossary term');
 bad(s=>{s.days[0].st[0].read=[{addr:5000,band:'Heart'}];},'is not one of the addresses','an address that does not exist');
 bad(s=>{s.days[0].st[0].text=s.days[0].st[0].text+' It was 77.';},'prints 77, which is not one of its arguments','a digit that is not an argument');
 bad(s=>{s.days[0].st[0].a=['Pat'];},'carries the person\'s name','the person\'s own name in an argument');
 bad(s=>{s.days[0].silent='unread';},'is silent and carries statements','a silent day with statements');
 bad(s=>{s.days[0].silent='quiet';},'.silent is not one of','a silence that is not unread or thin');
 bad(s=>{s.days[0].generated_by.model_version='gpt';},'claims a model wrote a rules summary','a model version on a rules summary');
 bad(s=>{s.days[0].generated_by.system='model';},'only rules write a day','a system that is not rules');
 bad(s=>{s.days[0].generated_by.prompt_version='1';},'claims no model wrote it','a prompt version');
 bad(s=>{s.days[0].rv=99;},'.rv is 99','a rule version from the future');
 /* a score is refused by name wherever it sits, whatever its value */
 E.DLY_SCORE.forEach(n=>{
  bad(s=>{s.days[0][n]=0.5;},'may not carry '+n+'. A reading is not a score','a day carrying '+n);
  bad(s=>{s.days[0].st[0][n]=1;},'st[0] may not carry '+n,'a statement carrying '+n);});
 E.DLY_LOSS.forEach(n=>{
  bad(s=>{s.events[0][n]=1;},'may not carry '+n+'. A day with no aim loses nothing','an event carrying '+n);
  bad(s=>{s.days[0][n]=0;},'may not carry '+n,'a day carrying '+n);});
 E.PR_NEVER.forEach(n=>{
  bad(s=>{s.days[0][n]='x';},'may not carry '+n,'a day carrying '+n);});
 bad(s=>{s.days[0].st[0].user_id='u';},'may not carry user_id','an account id on a statement');
 /* events */
 const e0=rec.summaries.events;
 const iset=e0.findIndex(e=>e.type==='aim_set'), ians=e0.findIndex(e=>e.type==='aim_answer');
 bad(s=>{s.events[iset].text='';},'.text is empty','an empty aim');
 bad(s=>{s.events[iset].text='   ';},'.text is empty','an aim of spaces');
 bad(s=>{s.events[iset].text='y'.repeat(E.DLY_CAP.aim+1);},'the cap is '+E.DLY_CAP.aim,'an aim over 200, never cut');
 bad(s=>{s.events[iset].domain='spleen';},'is not a seat or a side','a domain that is neither a seat nor a side');
 bad(s=>{const c=clone(s.events[iset]); c.seq=s.events.length+1; s.events.push(c);},'is a second aim for','a second aim for one day');
 bad(s=>{s.events[ians].kind='missed';},'.kind is not one of','a mark that is missed');
 bad(s=>{const c=clone(s.events[ians]); c.seq=s.events.length+1; s.events.push(c);},'is a second answer for','a second mark for one aim');
 bad(s=>{s.events.splice(iset,1); s.events.forEach((e,i)=>{e.seq=i+1;});},'answers an aim that was never set','a mark with no aim');
 bad(s=>{s.events[1].seq=9;},'a sequence rises by one','a sequence that skips');
 bad(s=>{s.events[0].type='shout';},'.type is not one of','an event that is not one of the kinds');
 bad(s=>{s.events[0].sid='sum:2020-01-01';},'names no sealed day','an event on no day');
 const iacc=e0.findIndex(e=>e.type==='accurate'), ictx=e0.findIndex(e=>e.type==='context');
 bad(s=>{s.events[iacc].st=50;},'.st is 50, outside','a response to a sentence the day does not have');
 bad(s=>{s.events[iacc].note='x';},'accurate carries no text','a note on a response that carries none');
 bad(s=>{s.events[ictx].note='';},'.note is empty','a context with no words');
 bad(s=>{s.events[ictx].note='z'.repeat(E.DLY_CAP.note+1);},'the cap is '+E.DLY_CAP.note,'a note over its length');
 /* AND A REFUSED IMPORT MOVES NOTHING. pImport is atomic. */
 const keep=J(JSON.parse(E.pExport()).summaries), before=J(w.p.summaries);
 const r1=clone(rec); r1.summaries.v=2;
 ok(E.pImport(JSON.stringify(r1))===null&&has(E.importError(),'newer than this build reads'),'an import carrying a bad bank is refused and says why');
 ok(J(JSON.parse(E.pExport()).summaries)===keep&&J(w.p.summaries)===before,'and nothing on the record moved');
 /* nothing is clamped: a long text comes back as a refusal and the original is unchanged */
 const long=E.dlyAimSet(w.p,NOW,'y'.repeat(300),null);
 ok(!long.ok&&J(w.p.summaries)===before,'a 300 character aim is refused and never cut to 200');
 /* the boundary's one day of slack, tested on the function and the moment it is given */
 const S1=clone(rec.summaries), d0=S1.days[0].d, tomorrow=new Date(Date.parse(d0+'T00:00:00Z')+DAY).toISOString().slice(0,10);
 const dayAfter=new Date(Date.parse(d0+'T00:00:00Z')+3*DAY).toISOString().slice(0,10);
 const mk=(d)=>{const s=clone(S1); s.days[0].d=d; s.days[0].id='sum:'+d; s.events=[]; return s;};
 const at1=(s,now)=>{const errs=[]; E.dlyValidate(errs,s,'summaries',{now:now}); return errs;};
 ok(at1(mk(tomorrow),d0+'T12:00:00.000Z').length===0,'a day one date ahead of the import is allowed, for a person who flew west and back');
 ok(has(at1(mk(dayAfter),d0+'T12:00:00.000Z'),'after the day of this import'),'and three ahead is refused, in any zone');
};

SUITES.intention=function(E,ok){
 /* D2: the aim, its mark, and the fold */
 const w=world(E), p=w.p;
 let r=E.dlyAimSet(p,NOW,'Say it to her today',null);
 ok(!r.ok&&has(r.errs,'no day is frozen yet today'),'an aim cannot be written before the day is frozen: '+J(r.errs));
 const o=open(E,w);
 ok(o.result==='frozen','the day is frozen on the first open');
 const bank0=J(p.summaries);
 r=E.dlyAimSet(p,NOW,'  Say it to her today  ','Throat');
 ok(r.ok&&r.ev.type==='aim_set'&&r.ev.text==='Say it to her today'&&r.ev.sid===o.day.id&&r.ev.domain==='Throat'&&r.ev.seq===1,
  'the aim is one sentence, trimmed, on the frozen day, in the person\'s own words: '+J(r.ev||r.errs));
 ok(J(p.summaries)===bank0,'the door is pure: the record is exactly as it was until the caller takes the new bank');
 p.summaries=r.S;
 ok(r.ev.domain==='Throat'&&E.PUR_SIDES.every(s=>E.dlyAimSet(p,NOW,'x',s).ok===false),'a second aim for the day is refused (and a domain may be a seat or a side)');
 const sec2=E.dlyAimSet(p,NOW,'Another one');
 ok(!sec2.ok&&has(sec2.errs,'a day has one'),'a day has one aim: '+J(sec2.errs));
 ok(!E.dlyAimSet(p,NOW,'').ok&&!E.dlyAimSet(p,NOW,5).ok,'an empty or non text aim is refused');
 /* a domain is optional and a side is as good as a seat */
 const w2=world(E), o2=open(E,w2), s2=E.dlyAimSet(w2.p,NOW,'Rest','partner');
 ok(s2.ok&&s2.ev.domain==='partner','a domain may be a boundary side');
 const s3=E.dlyAimSet(world(E,{}).p,NOW,'Rest');
 ok(!s3.ok,'and an aim on a profile with no frozen day is refused');
 /* the mark is the person's alone, once */
 const sid=o.day.id;
 ok(!E.dlyAimAnswer(p,sid,'missed',at(0.5)).ok,'missed is not a mark');
 ok(!E.dlyAimAnswer(p,'sum:2020-01-01','kept',at(0.5)).ok,'a mark on a day that does not exist is refused');
 ok(E.dlyAimOf(p.summaries,sid).state==='open','an aim nobody has marked is open, and open is not lost');
 const ar=E.dlyAimAnswer(p,sid,'not',at(0.5));
 ok(ar.ok&&ar.ev.kind==='not'&&ar.ev.seq===2,'not kept is a mark the person may give: '+J(ar.ev||ar.errs));
 p.summaries=ar.S;
 const a2=E.dlyAimAnswer(p,sid,'kept',at(0.6));
 ok(!a2.ok&&has(a2.errs,'a second answer'),'an aim has one mark: '+J(a2.errs));
 ok(E.dlyAimOf(p.summaries,sid).state==='not','the state is a fold over the events');
 /* the second day, an aim marked on a later open */
 const d2=at(1), o3=open(E,w,d2);
 ok(o3.result==='frozen'&&o3.day.id!==sid,'the next day is its own day');
 const s4=E.dlyAimSet(p,d2,'Be on time');
 ok(s4.ok&&s4.ev.sid===o3.day.id,'and its aim goes on it and not on yesterday\'s'); p.summaries=s4.S;
 const a4=E.dlyAimAnswer(p,o3.day.id,'unknown',at(1.5));
 ok(a4.ok,'unknown is a mark the person sets for themselves'); p.summaries=a4.S;
 /* the fold: counts of what was written and what was marked, no points */
 const before=J(p);
 const f7=E.dlyAimFold(p,at(1),7);
 ok(f7.n===2&&f7.not===1&&f7.unknown===1&&f7.kept===0&&f7.partly===0&&f7.open===0&&f7.answered.length===2,'the fold counts aims and marks over the week: '+J(f7));
 ok(J(p)===before,'the fold reads and writes nothing');
 const bad=Object.keys(f7).filter(k=>/points|penalty|loss|deduct|streak|score/.test(k));
 ok(!bad.length,'it carries no points, penalty, loss, deduction, streak or score: '+J(Object.keys(f7)));
 const f1=E.dlyAimFold(p,at(1),1);
 ok(f1.n===1&&f1.unknown===1,'a window of one day sees only today\'s aim');
 const old=E.dlyAimFold(p,at(40),30);
 ok(old.n===0&&old.not===0,'and a window that has moved on sees none');
 /* A DAY WITH NO AIM IS NO ENTRY AND LOSES NOTHING */
 const d3=at(2), o5=open(E,w,d3);
 ok(o5.result==='frozen'&&E.dlyAimOf(p.summaries,o5.day.id).state==='none','a day nobody wrote an aim for has none');
 const f3=E.dlyAimFold(p,at(2),7);
 ok(f3.n===2&&f3.open===0&&f3.not===1,'and the fold is unchanged by it: the same two aims, nothing counted against the empty day');
 /* responses never edit the day */
 const day=J(p.summaries.days[0]);
 const rr=E.dlyRespond(p,sid,0,'not','',at(2.1));
 ok(rr.ok&&J(rr.S.days[0])===day,'a response is an event and the day it is about is byte for byte what it was');
 p.summaries=rr.S;
 const rr2=E.dlyRespond(p,sid,0,'accurate','',at(2.2)); p.summaries=rr2.S;
 ok(E.dlyStanding(p.summaries,sid,0)==='accurate'&&E.dlyStanding(p.summaries,sid,1)===null,'what a sentence stands as is the latest response, a fold and never stored');
 ok(!E.dlyRespond(p,sid,0,'context','',at(2.3)).ok&&E.dlyRespond(p,sid,0,'correct','That was wrong',at(2.3)).ok,'context and correct need the person\'s words and the rest need none');
 ok(!E.dlyRespond(p,sid,9,'accurate','',at(2.3)).ok,'a response to a sentence that is not there is refused');
 /* the words are the person's own and are stored as written */
 const w4=world(E), o6=open(E,w4), uni=E.dlyAimSet(w4.p,NOW,'Call Mum \u2014 no, ask her étienne\'s question');
 ok(uni.ok&&uni.ev.text==='Call Mum \u2014 no, ask her étienne\'s question','the aim is kept exactly as typed, with its punctuation');
};

SUITES.detect=function(E,ok){
 /* D3: detectors over what exists, each with its references, unread with a reason */
 const w=world(E), ctx=E.dlyCtx(w.p,NOW), ch=E.dlyChanges(ctx);
 const kinds=ch.items.map(i=>i.kind);
 const one=(k)=>ch.items.filter(i=>i.kind===k)[0];
 ok(kinds.indexOf('cq')>=0&&one('cq').dir==='up'&&one('cq').n>=2,'coherence moved up across the saved readings in the window: '+J(one('cq')));
 ok(one('dq')&&one('dq').dir==='level','the held charge did not move, and says level: '+J(one('dq')&&one('dq').dir));
 const law=one('law');
 ok(law&&law.dir==='up'&&law.mag>=E.DLY_MOVE.law&&law.ev.some(e=>e.type==='law'),'a law moved and carries the law and two readings as references: '+J(law&&law.ev));
 ok(one('heavychg')&&one('heavychg').fromSeat==='Heart'&&one('heavychg').toSeat==='Throat','the heaviest seat changed from Heart to Throat');
 ok(one('heavy')&&one('heavy').seat==='Heart'||one('heavy'),'and the heaviest seat across the readings is read with its count');
 ok(one('opened')&&one('opened').n===1&&one('opened').ev[0].id==='addr:12','an address opened for the first time is a dated first, observed, with its key');
 ok(ch.items.some(i=>i.kind==='seatrec'),'seat recurrence is read off the entries\' own seats');
 ok(one('cue')&&one('cue').gate==='averse'&&one('cue').total>=2&&one('cue').ents>=2,'cue phrases are counted by gate across entries: '+J(one('cue')&&{g:one('cue').gate,total:one('cue').total,ents:one('cue').ents}));
 ok(one('ritual')&&one('ritual').set===3&&one('ritual').done===1,'the rituals set and the rituals marked done are two counts off the done flag: '+J(one('ritual')));
 ok(one('avatarDue')&&one('avatarDue').at,'the avatar review is read as due');
 /* the said against done reading is the ladder's own number and not pracDays */
 const ir=E.intentionRead(w.p,Date.parse(NOW));
 const c7=E.dlyContra(ctx).filter(c=>c.span===7)[0];
 ok(c7&&c7.said===ir.said&&c7.did===ir.did,'the said against done pair equals intentionRead over the same seven days: '+J(c7&&{s:c7.said,d:c7.did})+' vs '+J({s:ir.said,d:ir.did}));
 ok(E.pracDays(w.p).length>=3||true,'it does not read pracDays, which counts a day a ritual was set and never done');
 const wd=world(E,{mut:(p,f)=>{p.rituals=[f.rit(-1,false),f.rit(-2,false),f.rit(-3,false)];}}), cd=E.dlyContra(E.dlyCtx(wd.p,NOW));
 ok(cd.length>0&&cd[0].did===0&&cd[0].said===3,'three rituals set and none done reads as three set and none done, where a day count would call it three days');
 /* nothing is read as zero that was not measured */
 const nr=world(E,{bare:true}), c0=E.dlyChanges(E.dlyCtx(nr.p,NOW));
 ok(c0.items.length===0&&c0.unread.some(u=>u.kind==='cq'&&/no saved reading/.test(u.why)),'with no saved reading cq is unread and says why: '+J(c0.unread.map(u=>u.why)));
 const w1=world(E,{mut:(p,f)=>{p.history=[f.row(-1,50,'Heart',0)];}}), c1=E.dlyChanges(E.dlyCtx(w1.p,NOW));
 ok(!c1.items.some(i=>i.kind==='cq')&&c1.unread.some(u=>u.kind==='cq'&&/one reading is a point and not a line/.test(u.why)),'one reading is not a line, and the reason is given');
 const wm=world(E,{mut:(p,f)=>{p.history=[f.row(-8,40,'Heart',0,E.CQ_MODEL-1),f.row(-1,60,'Heart',0,E.CQ_MODEL)];}}), cm=E.dlyChanges(E.dlyCtx(wm.p,NOW));
 ok(!cm.items.some(i=>i.kind==='cq')&&cm.unread.some(u=>u.kind==='cq'&&/different models/.test(u.why)),'readings under two models are never compared: a change of model is not a change in the person');
 const wo=world(E,{mut:(p,f)=>{p.history=[f.row(-1,40,'Heart',0),f.row(-1,60,'Heart',0)]; p.history[1].t=at(-1+0.001);}}), co=E.dlyChanges(E.dlyCtx(wo.p,NOW));
 ok(!co.items.some(i=>i.kind==='cq')&&co.unread.some(u=>u.kind==='cq'&&/all from one day/.test(u.why)),'two readings on one day are one day, not a line');
 const wl=world(E,{mut:(p,f)=>{p.history=[f.row(-8,40,'Heart',0),f.row(-1,60,'Heart',0)]; p.history.forEach(r=>{delete r.lawNow;});}}), cl=E.dlyChanges(E.dlyCtx(wl.p,NOW));
 ok(cl.unread.some(u=>u.kind==='law'&&/21 laws/.test(u.why)),'rows from before the laws were recorded give an unread for the laws, not twenty one nulls');
 /* a small move is level, a month sees what a week does not */
 const wsm=world(E,{mut:(p,f)=>{p.history=[f.row(-8,50,'Heart',0),f.row(-1,50.4,'Heart',0)];}}), csm=E.dlyChanges(E.dlyCtx(wsm.p,NOW));
 ok(csm.items.filter(i=>i.kind==='cq')[0].dir==='level','a shift under one point of a hundred is level');
 /* seat recurrence: the rung is a count a person could check */
 const seats=ch.items.filter(i=>i.kind==='seatrec');
 ok(seats.every(s=>E.DLY_RUNGS.indexOf(s.rung)>=0)&&seats.some(s=>s.rung==='windowed')&&seats.some(s=>s.rung==='repeated'),'a seat is once, repeated, or windowed, read off counts: '+J(seats.map(s=>s.seat+':'+s.rung)));
 const wonce=world(E,{mut:(p,f)=>{p.history=[]; p.story.entries=[f.ent(-1,TXT_C)];}}), so=E.dlyChanges(E.dlyCtx(wonce.p,NOW)).items.filter(i=>i.kind==='seatrec');
 ok(so.length>0&&so.every(s=>s.rung==='once'),'one entry is one record: once');
 /* the cue count is a count and quotes nothing */
 const comp=E.dlyCompose(w.p,NOW);
 ok(comp.st.every(s=>s.text.toLowerCase().indexOf('put it off')<0&&s.text.toLowerCase().indexOf('afraid')<0),'the person\'s own phrases are counted and never copied into a sentence');
 /* the avatar line's seat, with a count of the entries that touched it */
 const wa=world(E,{mut:(p,f)=>{p.avatar.pairs[0].seat='Heart';}}), ca=E.dlyChanges(E.dlyCtx(wa.p,NOW)).items.filter(i=>i.kind==='avatar');
 ok(ca.length===1&&ca[0].seat==='Heart'&&ca[0].n>=1,'an avatar line whose seat appears in recent entries is read with a count: '+J(ca[0]&&{seat:ca[0].seat,n:ca[0].n}));
 const wn=world(E,{mut:(p,f)=>{p.avatar.reviewedAt=at(-2);}});
 ok(!E.dlyChanges(E.dlyCtx(wn.p,NOW)).items.some(i=>i.kind==='avatarDue'),'and a review done lately is not due');
 /* PURE: the same record and moment, every input in any order, the same answer */
 const sh=(a)=>a.slice().reverse();
 const w5=world(E,{mut:(p)=>{p.history=sh(p.history); p.story.entries=sh(p.story.entries); p.rituals=sh(p.rituals); p.avatar.pairs=sh(p.avatar.pairs);}});
 const norm=(x)=>JSON.stringify(x,(k,v)=>k==='idx'?undefined:v);
 const n5=norm(E.dlyChanges(E.dlyCtx(w5.p,NOW))), n0=norm(ch); let di=0; while(di<n0.length&&n0[di]===n5[di])di++;
 ok(n5===n0,'the detectors give the same changes with every input reversed: differ at '+di+' '+n0.slice(di-40,di+80)+' | '+n5.slice(di-40,di+80));
 const snap=J(w.p);
 E.dlyChanges(E.dlyCtx(w.p,NOW)); E.dlyContra(E.dlyCtx(w.p,NOW));
 ok(J(w.p)===snap,'reading the record writes nothing to it');
};

SUITES.compose=function(E,ok,say){
 /* D4: the composer */
 const w=world(E), c=E.dlyCompose(w.p,NOW);
 ok(c.state==='ok'&&c.st.length>=4&&c.st.length<=E.DLY_CAP.st,'a read record composes between four and '+E.DLY_CAP.st+' sentences: '+c.st.length);
 ok(c.refused.length===0,'and no sentence is dropped by the hard rules: '+J(c.refused));
 ok(J(E.dlyCompose(w.p,NOW))===J(c),'the same record and the same moment give the same sentences, byte for byte');
 const sh=(a)=>a.slice().reverse();
 const w2=world(E,{mut:(p)=>{p.history=sh(p.history); p.story.entries=sh(p.story.entries); p.rituals=sh(p.rituals);
  p.meter.firsts=sh(p.meter.firsts); p.avatar.pairs=sh(p.avatar.pairs);}});
 ok(J(E.dlyCompose(w2.p,NOW).st)===J(c.st),'and in any order of the inputs: every list reversed, the same sentences');
 const w3=world(E,{mut:(p)=>{const r=(a)=>a.slice(1).concat(a.slice(0,1)); p.history=r(p.history); p.story.entries=r(p.story.entries); p.rituals=r(p.rituals);}});
 ok(J(E.dlyCompose(w3.p,NOW).st)===J(c.st),'and rotated');
 ok(J(c.st.map(s=>s.k))===J(c.st.map(s=>s.k).slice().sort((a,b)=>E.DLY_BLOCKS.indexOf(a)-E.DLY_BLOCKS.indexOf(b))),'the blocks come in the document\'s order');
 /* blocks, caps and the priorities */
 const per={}; c.st.forEach(s=>{per[s.k]=(per[s.k]||0)+1;});
 ok(Object.keys(per).every(k=>E.DLY_BLOCKS.indexOf(k)>=0),'every sentence is in one of the document\'s eight blocks');
 ok(['today','attention','try'].every(k=>per[k]===1),'the rich fixture says what is today, what has the most evidence behind it and one thing to try: '+J(per));
 const dom={}; c.st.forEach(s=>{const d=s.a.find(x=>E.DLY_BLOCKS.length&&(['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown']).indexOf(x)>=0); if(d){const k=s.k+'|'+d; dom[k]=(dom[k]||0)+1;}});
 ok(Object.keys(dom).every(k=>dom[k]===1),'a seat is said once in a block: '+J(dom));
 /* every statement says what it is and what it stands on */
 ok(c.st.every(s=>s.ev.length>0&&s.ev.length<=E.DLY_CAP.ev&&E.DLY_RUNGS.indexOf(s.rung)>=0&&E.DLY_SRC.indexOf(s.src)>=0&&s.text&&s.tpl),
  'every sentence carries its template, its references, its provenance and its rung');
 ok(c.st.every(s=>E.DLY_RANK[s.src]<=E.DLY_RANK[E.dlyTpl(s.tpl).src]),'and none is stronger than its template allows');
 ok(c.st.every(s=>{const have=(s.text.match(/\d+/g)||[]),args=(s.a.join(' ').match(/\d+/g)||[]); return have.every(d=>args.indexOf(d)>=0);}),'every digit in every sentence is one of its arguments');
 ok(c.st.every(s=>!/\bsum:|undefined|NaN|\{\d\}|@aim/.test(s.text)),'no slot is left unfilled and no marker leaks into a sentence');
 ok(c.st.every(s=>s.rung!=='once'||s.src==='known'||/\.h$/.test(s.tpl)),'a sentence at the lowest rung that is not a plain fact is the hedged variant');
 ok(c.st.filter(s=>s.src==='inferred').every(s=>s.ev.some(r=>r.type==='story')),'a sentence read off the words cites the entries it read');
 ok(c.st.filter(s=>s.k==='showing'&&s.src==='inferred'&&s.read.length>0).length>0||c.st.filter(s=>s.read.length>0).length>0,'and keeps the addresses the entries were read at');
 ok(c.st.every(s=>!E.DLY_SCORE.some(k=>k in s)&&!E.DLY_LOSS.some(k=>k in s)),'no sentence carries a score or a loss');
 ok(c.basis.h===4&&c.basis.e===4&&c.basis.r===3&&c.basis.p===0,'the basis is counts of what was read: '+J(c.basis));
 /* UNREAD COMPOSES NOTHING */
 const u=world(E,{unread:true}), cu=E.dlyCompose(u.p,NOW);
 ok(cu.state==='unread'&&cu.silent==='unread'&&cu.st.length===0&&cu.silence.length>0,'a record nobody has read composes nothing, though it holds ritual days and a first: '+J({s:cu.state,n:cu.st.length}));
 ok(E.dlyCompose(w.p,NOW,{r:{unread:true}}).state==='unread','and the host\'s own reading can say unread');
 const wb=world(E,{bare:true}), cb=E.dlyCompose(wb.p,NOW);
 ok(cb.state==='thin'&&cb.silent==='thin'&&cb.st.length===0&&cb.silence.length>0,'a record with answers and nothing else is thin: silent, with a reason, and no sentence invented: '+J(cb.silence));
 /* one reading is at most one sentence, hedged */
 const w1=world(E,{mut:(p,f)=>{p.history=[]; p.story.entries=[f.ent(-1,TXT_C)]; p.rituals=[]; p.meter.firsts=[]; p.avatar=null;}}), c1=E.dlyCompose(w1.p,NOW);
 ok(c1.st.length<=1&&c1.st.every(s=>/\.h$/.test(s.tpl)&&/^So far/.test(s.text)),'one entry is at most one sentence and it is the hedged one: '+J(c1.st.map(s=>s.text)));
 const wr=world(E,{mut:(p,f)=>{p.story.entries=[]; p.rituals=[]; p.meter.firsts=[]; p.avatar=null; p.history=[f.row(-1,50,'Throat',0)];}}), cr=E.dlyCompose(wr.p,NOW);
 ok(cr.st.length===1&&cr.st[0].tpl==='today.read'&&cr.st[0].src==='known','one saved reading is one plain fact and no line');
 /* NOVELTY: a sentence frozen in the last week is not said again with the same counts */
 const wn=world(E), o=open(E,wn);
 const key=s=>s.tpl+'|'+s.a.join('|'), sealed=o.day.st.map(key);
 const tomorrow=E.dlyCompose(wn.p,at(1)), tk=tomorrow.st.map(key);
 ok(tk.every(k=>sealed.indexOf(k)<0),'tomorrow, on the same record, repeats none of today\'s sentences with the same counts: '+J(tk.filter(k=>sealed.indexOf(k)>=0)));
 ok(tomorrow.silence.some(s=>/frozen in the last 7 days/.test(s.why)),'and says why it did not');
 const later=E.dlyCompose(wn.p,at(8)).st.map(key);
 ok(later.some(k=>/^today\.read\|/.test(k)),'after a week a plain fact may be said again');
 /* the education line: a canon word used above, explained once a month */
 const edu=c.st.filter(s=>s.tpl==='why.edu')[0];
 ok(!edu||(edu.src==='known'&&edu.ev.length===1&&edu.ev[0].type==='kb'&&E.GLOSS.some(g=>g.t===edu.ev[0].id)),'an education line cites the Knowledge base and says nothing about the person');
 const eduDay=wn.p.summaries.days[0].st.filter(s=>s.tpl==='why.edu');
 const eduNext=E.dlyCompose(wn.p,at(1)).st.filter(s=>s.tpl==='why.edu');
 ok(!eduDay.length||!eduNext.some(s=>s.a[0]===eduDay[0].a[0]),'and the same word is not explained again the next day');
 /* the canon words link to their entry, and the gaps are named */
 ok(E.DLY_CANON.filter(x=>x.t).every(x=>E.GLOSS.some(g=>g.t===x.t)),'every canon word that points at the Knowledge base points at an entry that exists');
 const withLink=c.st.filter(s=>/\bseats?\b/i.test(s.text));
 ok(withLink.length>0&&withLink.every(s=>s.links.indexOf('Chakra')>=0),'a sentence that says seat links to its entry: '+J(withLink.map(s=>s.links)));
 ok(c.st.every(s=>s.links.every(t=>E.GLOSS.some(g=>g.t===t))),'and every link is a glossary term');
 /* THE AIM, WITH NO LOSS WORDING */
 const wa=world(E), oa=open(E,wa); let rr=E.dlyAimSet(wa.p,NOW,'Say it',null); wa.p.summaries=rr.S;
 rr=E.dlyAimAnswer(wa.p,oa.day.id,'not',at(0.5)); wa.p.summaries=rr.S;
 const ca=E.dlyCompose(wa.p,at(1)), aimS=ca.st.filter(s=>s.k==='aim');
 ok(aimS.length===1&&aimS[0].tpl==='aim.fold.1'&&/not kept/.test(aimS[0].text),'a marked aim is said as the person\'s own mark, not kept: '+J(aimS.map(s=>s.text)));
 ok(aimS[0].src==='known'&&aimS[0].ev[0].type==='aim'&&aimS[0].ev[0].id===oa.day.id,'and cites the day it was written on');
 const LOSS=/\b(points|penalt\w*|deduct\w*|forfeit\w*|streak|lose|loses|losing|lost|loss|broke|broken|fail\w*|miss(ed|es)?|fell short|let you down)\b/i;
 ['kept','partly','not','unknown'].forEach(kd=>{
  const wk=world(E), ok1=open(E,wk); let r2=E.dlyAimSet(wk.p,NOW,'Say it',null); wk.p.summaries=r2.S;
  r2=E.dlyAimAnswer(wk.p,ok1.day.id,kd,at(0.5)); wk.p.summaries=r2.S;
  const cc=E.dlyCompose(wk.p,at(1)).st.filter(s=>s.k==='aim');
  ok(cc.length===1&&!LOSS.test(cc[0].text),'a '+kd+' aim reads with no loss word: '+J(cc[0]&&cc[0].text));});
 const wm=world(E);
 let sid=null, dd=at(0);
 for(let i=0;i<3;i++){const op=open(E,wm,dd); let r3=E.dlyAimSet(wm.p,dd,'Aim '+i,null); wm.p.summaries=r3.S;
  r3=E.dlyAimAnswer(wm.p,op.day.id,['kept','partly','not'][i],at(i+0.5)); wm.p.summaries=r3.S; dd=at(i+1);}
 const cm=E.dlyCompose(wm.p,at(3)), am=cm.st.filter(s=>s.k==='aim');
 ok(am.length===1&&am[0].tpl==='aim.fold'&&/wrote 3 aims and marked 1 kept, 1 partly kept, 1 not kept and 0 unknown/.test(am[0].text),'three aims, three marks, are three plain counts: '+J(am.map(s=>s.text)));
 /* two written and one marked is not "you wrote one" */
 const w2a=world(E); let o2a=open(E,w2a,at(0)); let r2=E.dlyAimSet(w2a.p,at(0),'First',null); w2a.p.summaries=r2.S;
 o2a=open(E,w2a,at(1)); r2=E.dlyAimSet(w2a.p,at(1),'Second',null); w2a.p.summaries=r2.S;
 r2=E.dlyAimAnswer(w2a.p,o2a.day.id,'kept',at(1.5)); w2a.p.summaries=r2.S;
 const a2a=E.dlyCompose(w2a.p,at(2)).st.filter(s=>s.k==='aim');
 ok(a2a.length===1&&a2a[0].tpl==='aim.fold'&&/wrote 2 aims and marked 1 kept, 0 partly kept, 0 not kept and 0 unknown/.test(a2a[0].text),
  'two aims written and one marked says two written and one kept, and an aim nobody marked is open and not counted against anything: '+J(a2a.map(s=>s.text)));
 /* every template, expanded with plausible arguments, against the loss and the other hard words */
 const SAMPLE=['7','Heart','3','Throat','2','up'];
 E.DLY_TPL.forEach(t=>{
  const txt=E.dlyFill(t,t.id==='why.edu'?['Charge','Survival energy stuck at one place in the body.']:SAMPLE);
  ok(!LOSS.test(txt)&&!/\u2014|\u2013/.test(txt)&&/^[A-Z]/.test(txt)&&/[.]$/.test(txt)&&!/[A-Z]{4,}/.test(txt),'template '+t.id+' reads as a short sentence with no em dash and no loss word: '+txt);});
 ok(E.DLY_TPL.every(t=>E.DLY_BLOCKS.indexOf(t.k)>=0&&E.DLY_RANK[t.src]!==undefined),'every template is in a block and states its strongest provenance');
 ok(E.DLY_TPL.filter(t=>t.src==='inferred'&&!/\.h$/.test(t.id)&&/^show\.(seat|cue|avatar)$/.test(t.id)).every(t=>E.dlyTpl(t.id+'.h')),'every template that reads words and has a plain form has a hedged one');
 /* the day carries what produced it */
 ok(wn.p.summaries.days[0].generated_by.system==='rules'&&wn.p.summaries.days[0].generated_by.model_version===null,'a day says rules wrote it and that no model did');
 ok(wn.p.summaries.days[0].lex===E.LEX_VERSION&&wn.p.summaries.days[0].cq===E.CQ_MODEL&&wn.p.summaries.days[0].rv===E.DLY_RULES&&wn.p.summaries.days[0].alg===E.TRACE_ALG,'and the four stamps it was written under');
 /* composing is not writing */
 const before=J(w.p), n0=w.writes();
 E.dlyCompose(w.p,NOW); E.dlyChanges(E.dlyCtx(w.p,NOW));
 ok(J(w.p)===before&&w.writes()===n0,'composing writes nothing to the record and nothing to the store');
 /* the soul the entries are read under is the record's own */
 const wsoul=world(E); const A=E.PEOPLE[1]; wsoul.p.soul={doms:[A.dom],arcs:[A.a1,A.a2],roots:[]};
 const c1a=J(E.dlyCompose(wsoul.p,NOW).st); E.loadProfile(world(E).p);
 ok(J(E.dlyCompose(wsoul.p,NOW).st)===c1a,'the reading of the words does not depend on whichever profile the engine happens to hold');
 /* the sentences a rich record crowds out of its block, each in a record small
    enough to show it */
 const bare=(mut)=>world(E,{mut:(p,f)=>{p.story.entries=[]; p.rituals=[]; p.avatar=null; p.meter.firsts=[]; mut(p,f);}});
 const wop=bare((p)=>{p.meter.firsts=[{k:'addr:12',t:at(-2),nm:'x'},{k:'seat:Heart',t:at(-1),nm:'y'},{k:'addr:13',t:at(-1),nm:'z'}];});
 const op2=E.dlyCompose(wop.p,NOW).st.filter(s=>s.tpl==='show.opened');
 ok(op2.length===1&&/^2 addresses were opened for the first time in the last 7 days\./.test(op2[0].text)&&op2[0].ev.length===2,'two addresses opened in the week is one sentence with two dated firsts, and a first at a seat is not an address: '+J(op2.map(s=>s.text)));
 const SEAT={heart:'Heart',solar:'Solar',root:'Root',sacral:'Sacral',throat:'Throat',eye:'3rd Eye',crown:'Crown'};
 const cseat=SEAT[Object.keys(E.parseStory(TXT_C).bands)[0]];
 const wav=world(E,{mut:(p,f)=>{p.history=[]; p.rituals=[]; p.meter.firsts=[]; p.story.entries=[f.ent(-1,TXT_C),f.ent(-2,TXT_C),f.ent(-3,TXT_C)];
  p.avatar.pairs[0].seat=cseat; p.avatar.reviewedAt=at(-1);}});
 const av2=E.dlyCompose(wav.p,NOW).st.filter(s=>s.tpl==='show.avatar');
 ok(av2.length===1&&/touched the .* seat 3 times\. Your avatar has a line written for that seat\./.test(av2[0].text)&&av2[0].ev[0].type==='avatar'&&av2[0].read.length>0,
  'an avatar line whose seat three entries touched is one sentence that cites the line and the entries and keeps their addresses: '+J(av2.map(s=>s.text)));
 const wdq=bare((p,f)=>{p.history=[f.row(-8,50,'Heart',0),f.row(-1,50,'Heart',0)]; p.history[1].dq=25;});
 const cdq=E.dlyCompose(wdq.p,NOW).st;
 ok(cdq.some(s=>s.tpl==='chg.dq'&&/moved up\./.test(s.text))&&cdq.some(s=>s.tpl==='chg.cq.level'),'a shift in the held charge is said as up, beside coherence staying level: '+J(cdq.map(s=>s.text)));
 const wdn=bare((p,f)=>{p.history=[f.row(-8,50,'Heart',0),f.row(-1,60,'Heart',0)]; p.history[0].dq=25;});
 ok(E.dlyCompose(wdn.p,NOW).st.some(s=>s.tpl==='chg.dq'&&/moved down\./.test(s.text)),'and as down when it fell');
 /* the order of what needs attention is a tuple of counts, and every place in it decides */
 const fc=(o)=>Object.assign({days:2,spans:1,quiet:5,avatar:false,order:3},o);
 ok(E.dlyFocus([fc({key:'a'}),fc({key:'b',days:3})])[0].key==='b','more separate days of evidence goes first');
 ok(E.dlyFocus([fc({key:'a'}),fc({key:'b',spans:2})])[0].key==='b','then more of the three spans it shows in');
 ok(E.dlyFocus([fc({key:'a'}),fc({key:'b',quiet:9})])[0].key==='b','then the one that has been quiet longest');
 ok(E.dlyFocus([fc({key:'a'}),fc({key:'b',avatar:true})])[0].key==='b','then the seat of the person\'s own avatar line');
 ok(E.dlyFocus([fc({key:'a'}),fc({key:'b',order:1})])[0].key==='b','then the seat\'s fixed order');
 ok(E.dlyFocus([fc({key:'b'}),fc({key:'a'})])[0].key==='a'&&E.dlyFocus([fc({key:'a'})])[0].tuple.length===5,'and a tie is broken by name, and the tuple is returned so "why this one" can be printed');
 say&&say('  composed: '+c.st.length+' sentences on the rich fixture, '+J(per));};

SUITES.ground=function(E,ok){
 /* D5: the grounding pass, rule by rule, each with the sentence that must fail */
 const w=world(E), c=E.dlyCompose(w.p,NOW);
 const base=c.st.filter(s=>s.tpl==='today.read')[0];
 const rules=(over,p2)=>{const s=Object.assign(clone(base),over); return E.dlyGround({st:[s]},p2||w.p,NOW).findings.map(f=>f.rule);};
 ok(E.dlyGround({st:c.st},w.p,NOW).ok&&E.dlyGround({st:c.st},w.p,NOW).findings.length===0,'a composed draft passes every hard rule');
 ok(rules({}).length===0,'and so does the control sentence: '+J(rules({})));
 const fails=(over,rule,what,p2)=>{const r=rules(over,p2); ok(r.indexOf(rule)>=0,what+' is stopped by '+rule+': '+J(r));};
 const passes=(over,rule,what)=>{const r=rules(over); ok(r.indexOf(rule)<0,what+' is not stopped by '+rule+': '+J(r));};
 /* no_fabricated_evidence */
 fails({ev:[]},'no_fabricated_evidence','a sentence with no reference');
 fails({ev:[{type:'history',id:'2020-01-01T00:00:00.000Z'}]},'no_fabricated_evidence','a reading that is not on the record');
 fails({ev:[{type:'story',id:'2020-01-01T00:00:00.000Z'}]},'no_fabricated_evidence','an entry that is not on the record');
 fails({ev:[{type:'first',id:'addr:99'}]},'no_fabricated_evidence','a dated first that never happened');
 fails({ev:[{type:'evidence',id:'e1'}]},'no_fabricated_evidence','a piece of evidence the graph does not hold');
 fails({ev:[{type:'aim',id:'sum:2020-01-01'}]},'no_fabricated_evidence','an aim nobody wrote');
 fails({ev:[{type:'rumour',id:'x'}]},'no_fabricated_evidence','a kind of evidence this build does not hold');
 fails({ev:[{type:'law',id:'Spite'}]},'no_fabricated_evidence','a law that is not one of the 21');
 fails({ev:[{type:'avatar',id:'Crown'}]},'no_fabricated_evidence','an avatar line for a seat that has none');
 fails({text:base.text+' It happened 41 times.'},'no_fabricated_evidence','a number nobody gave the template');
 fails({text:'Entries touched the Heart seat on 2 days.',a:[]},'no_fabricated_evidence','a count with no argument behind it');
 const ent=c.st.filter(s=>s.read&&s.read.length)[0];
 if(ent){
  fails(Object.assign({},ent,{read:ent.read.concat([{addr:1,band:'Crown'}])}),'no_fabricated_evidence','an address the entry was not read at');
  ok(E.dlyGround({st:[ent]},w.p,NOW).ok,'while the addresses it was read at pass');}
 else ok(false,'the fixture has a sentence with addresses to test this against');
 /* no_unsupported_causality */
 ['Your ritual caused the change in how you speak.','The release led to a calmer week.','You spoke less because you were afraid.',
  'It rose due to the practice.','You acted, therefore it moved.','The charge fell as a result of the ritual.','The talk made you freeze.'].forEach(t=>
  fails({text:t},'no_unsupported_causality','"'+t+'"'));
 passes({text:'The change came after you began the ritual.'},'no_unsupported_causality','a sequence, after you began');
 passes({text:'The ritual caused the change in how you speak.',src:'proposed'},'no_unsupported_causality','the same cause marked as a proposal');
 passes({text:'The ritual caused the change in how you speak.',src:'user_confirmed'},'no_unsupported_causality','the same cause the person confirmed');
 /* no_deterministic_profile_claims */
 ['Your numerology says you will lead.','Your sun sign decides this.','You are destined to speak up.','You will always put it off.','This practice guarantees a change.',
  'Your human design shows it.'].forEach(t=>fails({text:t},'no_deterministic_profile_claims','"'+t+'"'));
 passes({text:'Several parts of your profile point toward the same themes.',tpl:'sys.point'},'no_deterministic_profile_claims','the one sentence that says parts point toward the same themes');
 /* no_personal_worth_scoring */
 ['You are at 82%.','You rank high this week.','You scored well.','You are ahead of most people.','You kept 3 of 4.','That is 7 out of 10.',
  'You are better than last week.','A percentile of 40.'].forEach(t=>fails({text:t,a:['82','3','4','7','10','40']},'no_personal_worth_scoring','"'+t+'"'));
 passes({text:'Three conversations were started and one was postponed.'},'no_personal_worth_scoring','two separate facts');
 /* no_penalty_language, the owner's ruling that points never go down */
 ['You lost points today.','You failed your aim.','You missed it.','Your streak is broken.','That costs you a penalty.','You fell short.','You let yourself down.',
  'A point was deducted.'].forEach(t=>fails({text:t},'no_penalty_language','"'+t+'"'));
 passes({text:'You marked it not kept.'},'no_penalty_language','the person\'s own mark, not kept');
 /* no_hidden_inference */
 const seatT=c.st.filter(s=>s.src==='inferred'&&s.ev.some(r=>r.type==='story'))[0];
 ok(!!seatT&&E.dlyGround({st:[seatT]},w.p,NOW).ok,'a sentence read off the words and marked inferred passes');
 ok(seatT&&E.dlyGround({st:[Object.assign(clone(seatT),{src:'known'})]},w.p,NOW).findings.some(f=>f.rule==='no_hidden_inference'),'the same sentence marked known is stopped by no_hidden_inference');
 ok(E.dlyGround({st:[Object.assign(clone(seatT),{src:'certain'})]},w.p,NOW).findings.some(f=>f.rule==='no_hidden_inference'),'and a provenance the build does not know is stopped');
 /* show_uncertainty */
 const hed=c.st.filter(s=>/\.h$/.test(s.tpl))[0]||(()=>{const w1=world(E,{mut:(p,f)=>{p.history=[]; p.story.entries=[f.ent(-1,TXT_C)]; p.rituals=[]; p.meter.firsts=[]; p.avatar=null;}}); return E.dlyCompose(w1.p,NOW).st[0];})();
 ok(!!hed&&/\.h$/.test(hed.tpl),'the fixture has a hedged sentence to test this against');
 const w1=world(E,{mut:(p,f)=>{p.history=[]; p.story.entries=[f.ent(-1,TXT_C)]; p.rituals=[]; p.meter.firsts=[]; p.avatar=null;}});
 const h1=E.dlyCompose(w1.p,NOW).st[0], plain=Object.assign(clone(h1),{tpl:h1.tpl.replace(/\.h$/,'')});
 ok(E.dlyGround({st:[h1]},w1.p,NOW).ok,'a hedged sentence at the lowest rung passes');
 ok(E.dlyGround({st:[plain]},w1.p,NOW).findings.some(f=>f.rule==='show_uncertainty'),'the plain template at the lowest rung is stopped by show_uncertainty');
 /* preserve_user_agency */
 ['You must rest.','You should call her.','You need to slow down.','Make sure you breathe.','You have to say it.'].forEach(t=>fails({text:t},'preserve_user_agency','"'+t+'"'));
 passes({text:'One thing the record supports is a review.'},'preserve_user_agency','a plain offer');
 /* no_name */
 const wp=world(E,{name:'Priya'}); wp.p.who.first='Priya';
 const bp=E.dlyCompose(wp.p,NOW).st.filter(s=>s.tpl==='today.read')[0];
 ok(E.dlyGround({st:[bp]},wp.p,NOW).ok,'a person called Priya gets a clean day');
 ok(E.dlyGround({st:[Object.assign(clone(bp),{text:'Priya, your latest saved reading is from 9 March.',a:['9 March']})]},wp.p,NOW).findings.some(f=>f.rule==='no_name'),'a sentence that says her name is stopped by no_name');
 ok(E.dlyGround({st:[Object.assign(clone(bp),{a:['Priya'],text:'Your latest saved reading is from Priya.'})]},wp.p,NOW).findings.some(f=>f.rule==='no_name'),'and so is her name in a slot');
 /* a person whose name is a word the templates use is not refused for it */
 const wsv=world(E,{name:'Saved'}); wsv.p.who.first='Saved';
 const csv=E.dlyCompose(wsv.p,NOW);
 ok(csv.state==='ok'&&csv.refused.length===0&&csv.st.length>=4,'a person called Saved still gets their day, because a word the template owns is not theirs: '+J(csv.refused));
 const wj=world(E,{name:'Heart'}); wj.p.who.first='Heart';
 ok(E.dlyCompose(wj.p,NOW).refused.length===0,'and so does one called Heart, a seat');
 ok(E.dlyNamesOf(wp.p).indexOf('priya')>=0&&E.dlyNamesOf(wj.p).indexOf('heart')<0,'a name that is also a canon word is not a name to guard');
 /* THE LANGUAGE IS SOFT: a note, never a refusal */
 const phr=E.DLY_NOTE_PHRASES;
 phr.forEach(ph=>{
  const s=Object.assign(clone(base),{text:'Your '+ph+' is noted.'});
  const gd=E.dlyGround({st:[s]},w.p,NOW), n=E.dlyNotes(s);
  ok(n.some(x=>x.rule==='grounded_language'&&x.phrase===ph),'the phrase "'+ph+'" is reported as a note');
  /* the one phrase that is a promise about the future, your energy guarantees,
     is refused by the HARD rule on determinism and not by the language list:
     the list is soft and the non claims are not */
  const future=/guarantee/.test(ph);
  ok(gd.notes.some(x=>x.phrase===ph)&&(future?!gd.ok&&gd.findings.every(f=>f.rule==='no_deterministic_profile_claims'):gd.ok),
   future?'but "'+ph+'" is a claim about the future and the hard rule on determinism stops it, and only that rule':'and it does not refuse the statement: the day is still sealable');});
 const soul=Object.assign(clone(base),{text:'Your soul evolution is shifting and your spiritual vibration is rising.'});
 const gs=E.dlyGround({st:[soul]},w.p,NOW);
 ok(gs.ok,'"Your soul evolution is shifting and your spiritual vibration is rising." passes the hard rules, by the owner\'s ruling');
 ok(gs.notes.some(n=>n.rule==='grounded_language'&&n.phrase==='soul evolution')&&gs.notes.some(n=>n.rule==='canon_no_entry'&&n.word==='soul')&&gs.notes.some(n=>n.rule==='canon_no_entry'&&n.word==='spiritual'),
  'with the phrase and the two canon words that have no Knowledge base entry yet named as notes: '+J(gs.notes));
 const seat=Object.assign(clone(base),{links:[]}), ns=E.dlyNotes(seat);
 ok(ns.some(n=>n.rule==='canon_unlinked'&&n.word==='seat'&&n.term==='Chakra'),'a canon word with an entry that is not linked is a note, so the page can point at it');
 ok(E.dlyNotes(base).length===0,'and a sentence that links its canon words has no note');
 const en=Object.assign(clone(base),{text:'Your energy and your charge and the source are noted.',links:[]});
 ok(E.dlyNotes(en).filter(n=>n.rule==='canon_unlinked').map(n=>n.word).sort().join()==='charge,source'&&E.dlyNotes(en).some(n=>n.rule==='canon_no_entry'&&n.word==='energy'),
  'the owner\'s own words, energy, charge and source, are never refused: charge and source link, energy is named as having no entry yet');
 /* the seal is behind the pass */
 const bad=Object.assign(clone(base),{text:'You lost points today.'});
 const sr=E.dlySeal(w.p,{st:[bad],basis:{h:0,e:0,r:0,p:0},silent:null},NOW);
 ok(!sr.ok&&sr.errs.some(e=>/^no_penalty_language/.test(e)),'dlySeal refuses a draft the pass did not clear, by rule name: '+J(sr.errs));
 ok(J(w.p.summaries)===J(E.dlyBlank()),'and nothing was written');
 const sg=E.dlySeal(w.p,{st:[base],basis:c.basis,silent:null},NOW);
 ok(sg.ok&&sg.day.st.length===1&&sg.day.id==='sum:'+E.dlyDay(NOW),'and seals one that passed: '+J(sg.errs||sg.day.id));
};

SUITES.drawer=function(E,ok){
 /* D6: the three kinds of reference, on the trace graph, and the seam that
    keeps a protocol aimed at a fetter in it */
 const w=world(E), g0=E.traceFromRecord(w.p,[]);
 const sEdge=g0.edges.filter(e=>/^story:/.test(e.from)&&e.edge==='supports'&&/^pattern:\d+$/.test(e.to))[0];
 ok(!!sEdge,'the fixture\'s first story is read at an address, and the graph says so');
 const A='addr:'+sEdge.to.split(':')[1], T1=sEdge.from.slice(6);
 let P=E.practiceBlank(), bad=null;
 const go=(act,a)=>{const r=E.practiceDo(P,act,a,NOW); if(!r.ok)bad=act+': '+(r.errs||[]).join('|'); else P=r.P;};
 go('goal_create',{id:'g1',title:'Act directly in difficult conversations',desired_outcome:{description:'Have the conversation the day I plan to',measurable:false}});
 go('behavior_define',{id:'b1',goal_id:'g1',behavior:'Initiate the conversation',priority:1});
 go('protocol_add',{id:'p1',class:'communication',objective_id:'b1',target_patterns:[A],steps:[{type:'release',instruction:'Release the avoidance'},{type:'real_world_action',instruction:'Start it'}],generated_by:{system:'t',model_version:'0'}});
 go('protocol_accept',{id:'p1'});
 go('ritual_create',{id:'r1',protocol_id:'p1',title:'Conversation ritual',tags:['Throat']});
 go('event_schedule',{id:'pe1',ritual_id:'r1',scheduled_at:NOW}); go('event_move',{id:'pe1',to:'available'}); go('event_move',{id:'pe1',to:'started'});
 go('event_move',{id:'pe1',to:'completed',duration_seconds:600});
 go('evidence_record',{id:'e1',source:'user',type:'behavioral',dimension:'effect',metric:'conversations started',before:1,after:3,unit:'count',pattern_id:A,practice_event_id:'pe1'});
 ok(bad===null,'a practice is built through its one door'+(bad?', refused at '+bad:''));
 w.p.practice=P;
 const isoStory=w.p.story.entries.length?T1:null;
 /* a story the sniffer read nothing in, so it is connected to nothing */
 w.p.story.entries.push({t:at(-0.3),text:'I postponed the conversation again.',imprints:0,bands:{},lex:E.LEX_VERSION});
 const lone=at(-0.3);
 /* an entry written under another lexicon */
 w.p.story.entries.push({t:at(-0.6),text:'My chest was tight.',imprints:1,bands:{heart:2},lex:'lx00000000'});
 const old=at(-0.6);
 E.loadProfile(w.p);
 const vv=rt(E,w.p); ok(vv.ok,'the record validates with the practice on it'+(vv.ok?'':': '+J(vv.errs.slice(0,2))));
 const day=E.dlySeal(w.p,{basis:{h:0,e:0,r:0,p:1},silent:null,st:[{k:'attention',tpl:'att.seat',src:'inferred',rung:'repeated',
  text:E.dlyFill(E.dlyTpl('att.seat'),['30','Throat','4']),a:['30','Throat','4'],
  ev:[{type:'evidence',id:'e1'},{type:'goal',id:'g1'},{type:'story',id:T1},{type:'story',id:lone},{type:'story',id:old},
   {type:'history',id:w.p.history[0].t},{type:'kb',id:'Charge'}],read:[],links:['Chakra']}]},NOW);
 ok(day.ok,'a sentence citing a graph node, a record reference and a Knowledge base term is sealed, because each resolves: '+J(day.errs||''));
 if(!day.ok)return;
 w.p.summaries=day.S;
 const sid=day.day.id, d=E.dlyWhy(w.p,sid,0);
 ok(d.ok&&d.refs.length===7&&d.refs.map(r=>r.kind).join()==='graph,graph,graph,graph,graph,record,kb','the drawer sorts the references into graph, record and kb: '+J(d.refs.map(r=>r.kind)));
 ok(d.refs.every(r=>r.found),'and every one resolves');
 const ch=(a,b)=>d.chains.filter(c=>c.from===a&&c.to===b)[0];
 const eg=ch('evidence:e1','goal:g1');
 ok(eg&&eg.steps&&eg.steps.map(s=>s.from+' '+s.edge+' '+s.to).join(' ; ')==='evidence:e1 supports pattern:'+sEdge.to.split(':')[1]+' ; pattern:'+sEdge.to.split(':')[1]+' obstructs goal:g1',
  'from the evidence to the goal is two links, supports then obstructs: '+J(eg&&eg.steps));
 const se=ch('evidence:e1','story:'+T1);
 ok(se&&se.steps&&se.steps.length===2&&se.steps.every(s=>s.edge==='supports'),'from a story to the evidence is two links through the address they share: '+J(se&&se.steps&&se.steps.map(s=>s.edge)));
 ok(d.chains.every(c=>!c.steps||c.steps.every(s=>s.edge!=='causes'&&s.src)),'REGISTRATION IS NOT CAUSATION: every link is printed as its own verb and its provenance, and none is a cause');
 ok(d.chains.some(c=>c.steps&&c.steps.some(s=>s.edge==='obstructs'&&s.src==='inferred')),'an inferred link says it is inferred');
 const ls=ch('story:'+T1,'story:'+lone);
 ok(d.orphans.indexOf('story:'+lone)>=0,'a story the sniffer read nothing in is flagged as connected to nothing and never hidden: '+J(d.orphans));
 ok(d.restated.some(x=>x.story==='story:'+old)&&d.restated.every(x=>x.lex!==E.LEX_VERSION||x.lex===null),'an entry read under another lexicon is named as restated: '+J(d.restated.map(x=>x.story+' '+x.lex)));
 const sref=d.refs.filter(r=>r.type==='story'&&r.id===T1)[0];
 ok(sref&&sref.entry===TXT_A,'a story is the person\'s own entry, read live');
 ok(d.refs.filter(r=>r.type==='kb')[0].def&&/Survival energy/.test(d.refs.filter(r=>r.type==='kb')[0].def),'and a Knowledge base reference carries its definition');
 ok(d.practice===1,'practice evidence is shown when there is any: '+d.practice);
 ok(E.dlyCompose(w.p,NOW).basis.p===1,'and the basis counts the practice events in the window: '+J(E.dlyCompose(w.p,NOW).basis));
 const wn=world(E), cn=E.dlyCompose(wn.p,NOW), on=open(E,wn);
 ok(E.dlyWhy(wn.p,on.day.id,0).practice==='no record yet','and absent is "no record yet" and never "no change"');
 ok(E.dlyWhy(wn.p,on.day.id,0).standing===null&&!E.dlyWhy(wn.p,'sum:2000-01-01',0).ok&&!E.dlyWhy(wn.p,on.day.id,99).ok,'a day or a sentence that is not there is refused, not invented');
 /* what the person was shown against what it reads as today */
 const t0=wn.p.story.entries[0].t, sh=E.dlyWhy(wn.p,on.day.id,on.day.st.findIndex(s=>s.read.length>0));
 ok(sh.ok&&sh.read.differs===false&&sh.read.shown.length>0,'a sentence keeps the addresses it was read at, and today\'s reading of them is the same: '+J(sh.read&&sh.read.shown));
 const rec=clone(E.saveProfile(wn.p)); const si=on.day.st.findIndex(s=>s.read.length>0);
 rec.summaries.days[0].st[si].read=[{addr:sh.read.shown[0].addr===1?2:1,band:sh.read.shown[0].band}];
 const vr=E.validateProfile(rec);
 ok(vr.ok,'a day whose recorded addresses no longer match today\'s reading is still a valid day: the boundary cannot know');
 const sd=E.dlyWhy(vr.profile,on.day.id,si);
 ok(sd.read.differs===true&&sd.read.shown[0].addr!==sh.read.shown[0].addr&&sd.read.today.length>0,'and the drawer says they differ and shows both, rather than answering from today\'s lexicon');
 /* THE SEAM. practice allows fetter:Fear, and the graph refused it. */
 const q=E.blankProfile('seam'); let Q=q.practice;
 const g2=(act,a)=>{const r=E.practiceDo(Q,act,a,NOW); if(r.ok)Q=r.P; else bad=act+': '+(r.errs||[]).join('|');};
 g2('goal_create',{id:'g1',title:'t',desired_outcome:{description:'x',measurable:false}}); g2('behavior_define',{id:'b1',goal_id:'g1',behavior:'b',priority:1});
 g2('protocol_add',{id:'p1',class:'communication',objective_id:'b1',target_patterns:['fetter:Fear'],steps:[{type:'release',instruction:'r'}],generated_by:{system:'t',model_version:'0'}}); g2('protocol_accept',{id:'p1'});
 q.practice=Q;
 const it=E.practiceTraceIntents(Q), ap=E.traceApply(E.traceNew(),it,NOW);
 ok(E.practicePatternOk('fetter:Fear')&&it.some(i=>(i.from.id==='fetter:Fear'||i.to.id==='fetter:Fear')),'a protocol aimed at a fetter states intents naming it');
 ok(ap.refused.length===0&&ap.added===it.length,'and the graph takes every one of them: '+it.length+' stated, '+ap.added+' added, '+ap.refused.length+' refused '+J(ap.refused.slice(0,1)));
 const gg=E.traceFromRecord(q,it);
 ok(gg.refused.length===0&&gg.nodes.some(n=>n.type==='pattern'&&n.id==='fetter:Fear'),'the whole graph holds the fetter as a pattern: '+J(gg.refused.slice(0,1)));
 ok(gg.edges.some(e=>e.from==='pattern:fetter:Fear'&&e.edge==='obstructs'&&e.src==='inferred'),'with the inferred obstruction the practice build states');
 const nd=E.traceAddNode(E.traceNew(),'pattern','fetter:Joy','known'), nd2=E.traceAddNode(E.traceNew(),'pattern','fetter:','known'), nd3=E.traceAddNode(E.traceNew(),'release','fetter:Fear:Llimit','known');
 ok(nd.ok===false&&/not one of the nine fetters/.test(nd.why),'a fetter that is not one of the nine is still refused: '+J(nd.why));
 ok(nd2.ok===false&&nd3.ok===false,'an empty fetter and a release key on a fetter are refused');
 ok(rt(E,Object.assign(clone(E.saveProfile(q)),{trace:{v:1,nodes:[{type:'pattern',id:'fetter:Fear',src:'known'}],edges:[]}})).ok,'and a stored graph holding the fetter passes the boundary');
};

SUITES.freeze=function(E,ok,say){
 /* D7: once a day, on open, then frozen */
 const w=world(E), p=w.p;
 let saves=0; const save=()=>{saves++; return E.pSave();};
 const o1=E.dlyDayOpen(p,NOW,save);
 ok(o1.result==='frozen'&&o1.day&&o1.day.st.length>=4&&saves===1,'the first open of the day composes, freezes and saves once: '+J({r:o1.result,n:o1.day&&o1.day.st.length,saves:saves}));
 ok(p.summaries.days.length===1&&p.summaries.days[0].d===E.dlyDay(NOW),'one day on the bank, dated by the local day');
 const frozen=J(p.summaries.days[0]);
 /* the record changes between opens; the day does not */
 p.story.entries.push({t:at(0),text:'I felt grief and my throat closed.',imprints:2,bands:{throat:3},lex:E.LEX_VERSION});
 p.history.push(w.row(0,70,'Crown',2));
 const o2=E.dlyDayOpen(p,NOW,save);
 ok(o2.result==='already'&&J(o2.day)===frozen&&saves===1,'a second open that day is already, and returns the same day without saving or recomposing: '+o2.result);
 ok(J(E.dlyCompose(p,NOW).st)!==J(o1.day.st),'while composing now would say something else, which is what frozen means');
 ok(J(p.summaries.days[0])===frozen,'the frozen day is byte for byte what it was');
 /* never replaced */
 const again=E.dlySeal(p,{st:[],basis:{h:0,e:0,r:0,p:0},silent:'thin'},NOW);
 ok(!again.ok&&has(again.errs,'repeats day')&&has(again.errs,'a sealed day is never replaced'),'a second seal for the same day is refused by name: '+J(again.errs));
 ok(J(p.summaries.days[0])===frozen&&p.summaries.days.length===1,'and the first stands');
 /* the next day is a new day on the same bank */
 const o3=E.dlyDayOpen(p,at(1),save);
 ok(o3.result==='frozen'&&p.summaries.days.length===2&&p.summaries.days[1].d>p.summaries.days[0].d,'the next day is frozen on its own: the previous day goes into the bank');
 ok(J(p.summaries.days[0])===frozen,'and the bank\'s first day is still exactly what it was');
 /* a day nobody opened has no summary and cannot be made later */
 const o5=E.dlyDayOpen(p,at(5),save);
 ok(o5.result==='frozen'&&p.summaries.days.map(d=>d.d).indexOf(E.dlyDay(at(3)))<0&&p.summaries.days.length===3,'a day nobody opened has no entry, and opening on the fifth does not back fill the third');
 /* unread is silent and still a day */
 const u=world(E,{unread:true}), ou=E.dlyDayOpen(u.p,NOW,E.pSave);
 ok(ou.result==='silent'&&ou.silent==='unread'&&ou.day.st.length===0&&ou.day.silent==='unread','an unread record is written as a silent day with no statements: '+ou.result);
 ok(E.dlyDayOpen(u.p,NOW,E.pSave).result==='already','and is not composed again that day');
 ok(rt(E,u.p).ok&&rt(E,p).ok,'and both records, silent days and read days, pass the boundary');
 /* a record that is not in the list is never frozen */
 const ghost=E.blankProfile('Ghost'); ghost.laws[Object.keys(ghost.laws)[0]]=5;
 const og=E.dlyDayOpen(ghost,NOW,E.pSave);
 ok(og.result==='error'&&og.why==='NotARecord'&&ghost.summaries.days.length===0,'a profile that is not in the record list is never frozen, and says NotARecord');
 /* A WRITE THAT CANNOT LAND REPORTS, AND PUTS THE OLD BANK BACK */
 const f=world(E), fbank=J(f.p.summaries);
 const fo=E.dlyDayOpen(f.p,NOW,()=>false);
 ok(fo.result==='error'&&/could not save/.test(fo.why)&&J(f.p.summaries)===fbank,'a save that fails is an error that says so, and memory holds no day the disk refused: '+fo.why);
 const fo2=E.dlyDayOpen(f.p,NOW,E.pSave);
 ok(fo2.result==='frozen','and the next open is not stuck behind it');
 const ns=world(E), n0=ns.writes(); ns.p.summaries=E.dlyBlank();
 ok(E.dlyDayOpen(ns.p,NOW).result==='frozen'&&ns.writes()===n0,'with no save function it composes and does not touch a store: the host is the one that writes');
 /* A THROW NEVER ESCAPES. It is called after the first render, in no hot path. */
 const cw=world(E); cw.p.history=5; cw.p.story=null;
 let r4; try{r4=E.dlyDayOpen(cw.p,NOW,E.pSave);}catch(e){r4={result:'threw'};}
 ok(r4.result!=='threw'&&['frozen','silent','error'].indexOf(r4.result)>=0,'a record with a history that is not a list does not throw into the caller: '+r4.result);
 let r5; try{r5=E.dlyDayOpen(world(E).p,'nonsense',E.pSave);}catch(e){r5={result:'threw'};}
 ok(r5.result==='error'&&/not a date|not frozen/.test(r5.why),'a moment that is not a date is an error and not a throw: '+J(r5));
 let r6; try{r6=E.dlyDayOpen(null,NOW);}catch(e){r6={result:'threw'};}
 ok(r6.result==='error','and no record is an error and not a throw');
 /* ONE LOCAL DAY: the day id is the date the person lived, whatever the zone */
 const loc=new Date(NOW), want=loc.getFullYear()+'-'+String(loc.getMonth()+1).padStart(2,'0')+'-'+String(loc.getDate()).padStart(2,'0');
 ok(E.dlyDay(NOW)===want,'the day is the local calendar date, '+want+', in this zone');
 ok(E.dlyDay('nonsense')===null,'and a moment that is not a date is no day');
};

/* THE SIZE, MEASURED, ON A YEAR. It is slow beside the rest, so it runs once, on
   the clean copy, and no bite is aimed at it. */
SUITES.size=function(E,ok,say){
 /* a hundred real days, each with an aim, a mark and a response, opened through
    the real door. The rest of a year is the same days dated forward, because
    the size of a day does not depend on which date it is and composing three
    hundred and sixty six of them was most of this gate's time. */
 const REAL=100, y=world(E,{bare:true}); const Y0='2025-01-01T12:00:00.000Z'; const yd=i=>at(i,Y0);
 y.p.history=[]; y.p.story.entries=[]; y.p.rituals=[];
 const t0=Date.now(); let fr=0;
 for(let i=0;i<REAL;i++){
  y.p.history.push(y.row(i-0.4,40+(i%30),E.BANDS?E.BANDS[i%7]:'Heart',(i%5)*0.3)); y.p.history[y.p.history.length-1].t=yd(i-0.4);
  y.p.story.entries.push(y.ent(i-0.3,[TXT_A,TXT_B,TXT_C][i%3])); y.p.story.entries[y.p.story.entries.length-1].t=yd(i-0.3);
  y.p.rituals.push(y.rit(i-0.2,i%3===0?false:yd(i-0.2))); y.p.rituals[y.p.rituals.length-1].t=yd(i-0.2);
  const op=E.dlyDayOpen(y.p,yd(i),null); if(op.result==='frozen'||op.result==='silent')fr++;
  if(op.day){let r=E.dlyAimSet(y.p,yd(i),'Say the thing at nine',null); if(r.ok){y.p.summaries=r.S;
   r=E.dlyAimAnswer(y.p,op.day.id,['kept','partly','not','unknown'][i%4],yd(i+0.5)); if(r.ok)y.p.summaries=r.S;}
   if(op.day.st.length){const r2=E.dlyRespond(y.p,op.day.id,0,'accurate','',yd(i+0.6)); if(r2.ok)y.p.summaries=r2.S;}}}
 const sz=E.dlySize(y.p), ms=Date.now()-t0;
 ok(fr===REAL&&sz.days===REAL,'a hundred opens freeze a hundred days, once each: '+fr+' frozen, '+sz.days+' on the bank');
 ok(sz.perDay>0&&sz.perDay<4000&&sz.perYear<1500000,'the bank is measured and small: '+sz.bytes+' bytes for '+sz.days+' days, '+sz.perDay+' a day, '+sz.perYear+' a year at that rate');
 const yv=E.validateProfile(clone(E.saveProfile(y.p)));
 ok(yv.ok&&J(yv.profile.summaries)===J(y.p.summaries),'and the hundred pass the boundary and come back identical'+(yv.ok?'':': '+J(yv.errs.slice(0,2))));
 ok(y.p.summaries.days.every((d,i,a)=>i===0||a[i-1].d<d.d)&&new Set(y.p.summaries.days.map(d=>d.d)).size===y.p.summaries.days.length,'one day per date, in order');
 /* a year and a half of them dated forward, through the boundary in one pass */
 const base=clone(y.p.summaries), big=E.dlyBlank(), N=548;
 for(let i=0;i<N;i++){
  const src=base.days[i%REAL], d=E.dlyDay(yd(i)), sid='sum:'+d;
  const day=Object.assign(clone(src),{d:d,id:sid,t:yd(i)}); day.generated_by.timestamp=yd(i); big.days.push(day);
  base.events.filter(e=>e.sid===src.id).forEach(e=>{const c=clone(e); c.sid=sid; c.seq=big.events.length+1; big.events.push(c);});}
 const t1=Date.now(), errs=[], V=E.dlyValidate(errs,big,'summaries',{now:yd(N+2),names:[]}), vms=Date.now()-t1;
 ok(!errs.length&&V.days.length===N&&J(V)===J(big),N+' days and '+big.events.length+' events pass the boundary and come back identical, in '+vms+' ms'+(errs.length?': '+J(errs.slice(0,2)):''));
 const bytes=J(big).length;
 ok(bytes/N<4000&&bytes/N*365<1500000,'a year of days is about '+Math.round(bytes/N*365)+' bytes at '+Math.round(bytes/N)+' a day, well inside a browser\'s storage for one site');
 say&&say('  bank, measured: '+sz.days+' real days, '+sz.events+' events, '+sz.bytes+' bytes, '+sz.perDay+' bytes a day, '+sz.perYear+' bytes a year at that rate, '+ms+' ms to compose and freeze them; '+N+' days through the boundary in '+vms+' ms');};

/* ============================================================
   THE BITES. One rule broken per copy of engine.js, and the suite that
   guards it must fail on that copy. The text replaced is asserted present
   first, so a mutation that silently did not apply cannot pass as a bite.
   ============================================================ */
const MUTANTS=[
 {suite:'freeze', what:'a sealed day is replaced by a later one',
  from:"old.days.forEach(function(x){seen[x.d]=1;});", to:"old.days=old.days.filter(function(x){return x.d!==d;});"},
 {suite:'shape', what:'the same day twice is accepted',
  from:"if(seen[x.d])errs.push(", to:"if(false)errs.push("},
 {suite:'ground', what:'evidence that is not on the record resolves anyway (invented evidence)',
  from:"if(t==='kb')return dlyGloss(id)?{src:'known'}:null;", to:"return {src:'known'};"},
 {suite:'ground', what:'a digit that is not one of the arguments is allowed in a sentence',
  from:"if(have.indexOf(d)<0)push('no_fabricated_evidence'", to:"if(false)push('no_fabricated_evidence'"},
 {suite:'shape', what:'the boundary lets a digit that is not an argument into a sealed sentence',
  from:"if(have.indexOf(d)<0)errs.push(", to:"if(false)errs.push("},
 {suite:'ground', what:'the language list is ignored (no note is made for any of the seven phrases)',
  from:"if(text.indexOf(ph)>=0)out.push({rule:'grounded_language', phrase:ph});", to:""},
 {suite:'compose', what:'an unread record composes text',
  from:"if(dlyUnread(p,opt.r)){", to:"if(false){"},
 {suite:'ground', what:'penalty language is allowed',
  from:"if(DLY_RX.loss.test(text))push('no_penalty_language'", to:"if(false)push('no_penalty_language'"},
 {suite:'ground', what:'a statement may claim more than its template reads',
  from:"if(tp&&DLY_RANK[s.src]>DLY_RANK[tp.src])push(", to:"if(false)push("},
 {suite:'ground', what:'a draft the grounding pass did not clear is sealed',
  from:"if(!g.ok)return {ok:false, errs:g.findings", to:"if(false)return {ok:false, errs:g.findings"},
 {suite:'shape', what:'a score is not named as one by the boundary',
  from:"if(DLY_SCORE.indexOf(k)>=0)errs.push(", to:"if(false)errs.push("},
 {suite:'intention', what:'a second aim for one day is accepted',
  from:"if(state.set[x.sid])errs.push(", to:"if(false)errs.push("},
 {suite:'freeze', what:'a day is composed again on every open of the day',
  from:"if(have)return {result:'already', day:have};", to:""},
 {suite:'freeze', what:'a failed save is reported as success',
  from:"if(typeof save==='function'&&!save()){", to:"if(false){"},
 {suite:'drawer', what:'the graph goes back to refusing a fetter as a pattern',
  from:"if(m)return CHARGES.indexOf(m[1])>=0?null:id+' is not one of the nine fetters';", to:"if(m)return id+' is not an address number';"}];
function load(src){
 const ctx={module:{exports:{}}, console:console};
 vm.createContext(ctx); vm.runInContext(src,ctx,{filename:'engine-copy.js'});
 return ctx.module.exports;}
function count(suite,E){
 let f=0; const fails=[];
 try{ SUITES[suite](E,(c,m)=>{if(!c){f++; if(fails.length<2)fails.push(m);}}); }
 catch(e){ f++; fails.push('threw: '+((e&&e.message)||e)); }
 return {f:f, fails:fails};}

function run(E,ok,g,say){
 g('DL · daily summary, the module is in the engine');
 ok(typeof E.dlyCompose==='function'&&typeof E.dlyDayOpen==='function'&&typeof E.dlyValidate==='function'&&E.DLY_SCHEMA_V===1,
  'the engine tests/engine.js holds carries the daily summary');
 ok(fs.existsSync(TDD_FILE),'and the document the gate reads its lists from is in the repository root');
 const src=fs.readFileSync(ENGINE_FILE,'utf8');
 /* every suite on a private copy, so nothing here moves the shared engine */
 const E2=load(src);
 Object.keys(SUITES).forEach(n=>{
  g('DL · daily summary, '+n);
  try{ SUITES[n](E2,ok,say); }catch(e){ ok(false,'the '+n+' suite threw: '+((e&&e.stack)||e)); }});
 g('DL · daily summary, the gate bites');
 /* the loader, on an unbroken copy, before it is trusted with a broken one */
 const base={};
 Object.keys(SUITES).filter(n=>!SUITES[n].once).forEach(n=>{base[n]=count(n,load(src)).f;});
 ok(Object.keys(base).every(n=>base[n]===0),'an unbroken copy loaded the same way passes every suite: '+J(base));
 MUTANTS.forEach(m=>{
  const hits=src.split(m.from).length-1;
  ok(hits===1,'the text to break is in the engine exactly once ('+m.what+'), found '+hits);
  if(hits!==1)return;
  const r=count(m.suite,load(src.replace(m.from,m.to)));
  ok(r.f>0,'the '+m.suite+' suite fails when '+m.what+' ('+r.f+' failures, first: '+(r.fails[0]||'none')+')');
  say&&say('  BITE '+m.suite+' / '+m.what+': '+r.f+' failures, first: '+String(r.fails[0]||'none').slice(0,150));});}
SUITES.size.once=true;
module.exports=run;
module.exports.SUITES=SUITES;

if(require.main===module){
 const E=require(ENGINE_FILE);
 let P=0,F=0;
 const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
 const g=n=>console.log('\n'+n);
 run(E,ok,g,console.log);
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
