/* ============================================================
   THE JOURNEY, THE READ HALF. Where a new person is on the way in,
   and what their first release is, both read off the record and
   neither stored.

   PORTED FROM 3869d96 (worktree-agent-ad7f4b5294abbc82c), whose base
   7b2941b is about two hundred commits behind this branch. Two
   functions came across: onbMiniPlan whole and unchanged in body, and
   journeyRead cut to the part the current record can answer. That
   file also held the journey record itself (runs, a log, the gift's
   stored counter, the ten integrity answers, the claim packet), and
   that is F13 in REVIEW-funnel/FINAL-SPEC.md, a schema addition with
   its own boundary. It is not landed here, so nothing in this file
   reads or writes p.journey, and validateProfile is untouched.

   HOST FREE. No document, no store, no network, and no writer. Every
   function here takes the record and returns an answer, and the record
   is the same object afterwards byte for byte (tests/journey.js holds
   that on every call).

   NO SCHEMA_V BUMP, and none is needed. releaseVerify below is the one
   function here that builds something to store, and it stores it as
   practice evidence, which the boundary already guards; its one new field,
   story_t, is additive and optional and an older record reads as null.
   It is still pure: it returns a new practice object and the caller saves.
   ============================================================ */

/* ---------------- the read ---------------- */
/* WHERE THE PERSON IS, derived off the record and never stored.

   A record that has used the product, a first line spoken, a finished intake
   or a ritual on the log, reads `continuing`, and onboarding does not treat it
   as a first run. A record with a story and none of those reads `storied`, and
   a record with nothing reads `new`. Both of the last two are a first run.

   WHAT THE PORT LEFT BEHIND, said so a caller does not assume it. The original
   had a fourth stage, `released`, which needs the run log F13 stores, so that a
   record released inside onboarding can be told from one that was in use
   before onboarding existed. Without the log the two read the same, and both
   read `continuing`, which is the conservative answer: neither is a first run.
   The count of releases is unknown for the same reason, and `runs.known` says
   so rather than reporting a nought nobody counted. When F13 lands it fills
   runs from the log and restores `released`; no caller of `first` changes. */
function journeyRead(p){
 var m=(p&&p.meter)||{}, entries=(p&&p.story&&Array.isArray(p.story.entries))?p.story.entries:[];
 var prior=!!(m.first||(p&&p.intake&&p.intake.completedAt)
  ||(p&&Array.isArray(p.rituals)&&p.rituals.length));
 var stage=prior?'continuing':(entries.length?'storied':'new');
 return {stage:stage, first:stage==='new'||stage==='storied',
  runs:{n:0, known:(+m.lines||0)===0}};}

/* ---------------- the mini release's plan ---------------- */
/* THE PLAN FOR A FIRST RELEASE, in whole addresses, and it writes nothing.

   A run is an address across four channels, four lines, and an address is never
   cut in half: half an address is not a release at all (RUN_MIN, plan.js). The
   owner ruled the mini release is twelve lines, three addresses (ONB_MINI_ADDRS).
   Fewer when the allowance leaves fewer, and a whole number of addresses
   whatever it leaves: the cap is the allowance read through meterBudget, and
   an address is only taken if all four of its lines are inside it.

   DETERMINISTIC. The same record and the same signal give the same plan, so a
   plan a person was shown is the plan that runs. No clock but the one handed
   in, and no randomness.

   THE SIGNAL is what the story read: { unread, addrs }, where addrs is a list
   of { node, stated, inferred } in the order the reading weighed them, which
   is parseStory's imprints exactly (a signal may also carry them as
   `imprints`). An unread signal plans nothing, because there is nothing to
   choose from and inventing a plan for a story that read as nothing is the
   Mirror claiming a certainty it does not have. A stated address goes first, an
   address the words did not name but the seat did goes after, and an inferred
   one last: the charge still lands where the body holds it, and the plan says
   how many of its addresses were inferred (`inferred`) so the card can say so.
   New ground only: an address with a line already open down any channel is
   still planned, at its next unopened line, but one with nothing left to open
   is skipped, since a plan that opens nothing is a rerun and not this.

   WHAT THE READING FOUND, BESIDE WHAT WAS TAKEN. Added in the port, for the
   card (F5): `found` is how many distinct addresses the reading carried,
   `foundInferred` how many of those the words did not name, and `rest` how
   many were found and not taken, so a first release of three out of eight says
   five more were read rather than hiding them. Counts only. They are derived
   from the signal on every call and nothing stores them.

   Returns { ok, addrs, keys, lines, inferred, cap, found, foundInferred, rest }
   or { ok:false, why } with why one of: 'no record', 'unread', 'no new ground',
   'allowance', and the found counts beside it whenever there is a signal. */
function onbMiniPlan(p,signal,now){
 if(!p||!p.meter)return {ok:false, why:'no record'};
 var sg=signal||{}, list=sg.addrs||sg.imprints||[];
 var cand=[], seen={};
 list.forEach(function(a,i){
  var id=(a&&typeof a==='object')?a.node:a;
  if(!NUM(id)||seen[id]||!BY[id]||!BY[id].cf)return;
  seen[id]=1;
  var tier=(a&&typeof a==='object')?(a.stated?0:(a.inferred?2:1)):1;
  cand.push({id:id, tier:tier, at:i, inferred:tier===2});});
 var found=cand.length, foundInf=cand.filter(function(c){return c.inferred;}).length;
 if(sg.unread===true||!cand.length)return {ok:false, why:'unread', found:found, foundInferred:foundInf};
 cand.sort(function(a,b){return a.tier-b.tier||a.at-b.at;});
 var cap=meterBudget(p,now).cap;
 var whole=Math.min(ONB_MINI_ADDRS,Math.floor(cap/RUN_MIN));
 if(whole<1)return {ok:false, why:'allowance', cap:cap, found:found, foundInferred:foundInf};
 var open=cand.filter(function(c){return meterPlan(p,[c.id],ONB_CHANS,RUN_MIN).length===RUN_MIN;});
 if(!open.length)return {ok:false, why:'no new ground', found:found, foundInferred:foundInf};
 var take=open.slice(0,whole), ids=take.map(function(c){return c.id;});
 var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN);
 return {ok:true, addrs:ids, keys:keys, lines:keys.length,
  inferred:take.filter(function(c){return c.inferred;}).length, cap:cap,
  found:found, foundInferred:foundInf, rest:found-ids.length};}

/* ---------------- what changed, after a release ---------------- */
/* THE ANSWER TO "WHAT CHANGED?", written as evidence, one record per address
   the run worked. System Congruency TDD section 15; CONGRUENCY-AUDIT.md's
   next task, item 2. The vocabulary and its boundary are the evidence
   domain's own (RV_METRIC, RV_VALUES and prCross in engine/practice.js);
   this is the one host free door that builds the records, so the gate can
   hold it without a browser.

   PURE, AND ALL OR NOTHING. It takes the practice object and returns a new
   one, every record through practiceDo, so each one passes the same boundary
   an import does. If any address is refused, none is written and the object
   handed in comes back untouched: half a run's answer on the record would
   read as the person having answered about some addresses and not others.

   answer   one of RV_VALUES: the five offered answers, or skipped
   addrs    the node ids the run worked, the queue after End cut it
   opt      { story_t }: the entry the run was planned from, or nothing
   now      the time, one for every record, so one answer reads as one moment

   Returns { ok, P, ids } or { ok:false, P, errs } with every reason named. */
function releaseVerify(P,answer,addrs,opt,now){
 var base=P||practiceBlank(), errs=[];
 if(RV_VALUES.indexOf(answer)<0)
  errs.push('a release verification is one of '+RV_VALUES.join(', ')+', not '+JSON.stringify(answer));
 var ids=[];
 if(!Array.isArray(addrs)||!addrs.length)errs.push('a release verification names the addresses the release worked, and none were given');
 else addrs.forEach(function(a){
  if(!NUM(a)||!BY[a])errs.push('no address is '+JSON.stringify(a));
  else if(ids.indexOf(a)<0)ids.push(a);});
 if(errs.length)return {ok:false, P:base, errs:errs};
 var t=now||new Date().toISOString(), st=(opt&&opt.story_t)||null, Q=base, out=[];
 for(var i=0;i<ids.length;i++){
  var r=practiceDo(Q,'evidence_record',{source:'user', type:'internal', dimension:'affect',
   pattern_id:'addr:'+ids[i], metric:RV_METRIC, value:answer, story_t:st, timestamp:t},t);
  if(!r.ok)return {ok:false, P:base, errs:r.errs};
  Q=r.P; out.push(r.id);}
 return {ok:true, P:Q, ids:out};}
/* WHAT THE RECORD SAYS WAS ANSWERED AT ONE ADDRESS, newest last. Read off the
   evidence and never stored. A run's answer is one record per address at one
   timestamp, so at a single address every record is one release's answer. */
function releaseVerifyAt(P,addr){
 var id='addr:'+addr, ev=(P&&Array.isArray(P.evidence))?P.evidence:[];
 return ev.filter(function(e){return e&&e.metric===RV_METRIC&&e.pattern_id===id;})
  .map(function(e){return {value:e.value, at:e.timestamp, story_t:e.story_t||null};})
  .sort(function(a,b){return String(a.at)<String(b.at)?-1:String(a.at)>String(b.at)?1:0;});}
