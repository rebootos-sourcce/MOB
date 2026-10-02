/* ============================================================
   THE TEACHERS' STORED BLOCK, THEIR LINES AND THEIR REACHES. Round PD,
   DESIGN-teachers.md v2 sections 4, 6, 8 and 9. The roster is
   engine/data/teachers.js and the recipes are engine/recipes.js. This file is
   what a person DOES with a teacher and what is kept of it.

   WHAT IS STORED, AND NOTHING ELSE. One block on the profile, additive:

     teach:{v:1,
       focus:[{k, at, mine:[ids], share:{on, at}}],   up to three pole keys
       opened:[{k, r, at}],                            a reach opened, never removed
       runs:[{t, tc, kind, n}]}                        a count, never which addresses

   It holds no free text, no story, no address id, no name, no number about the
   person and no match number. `mine` is a list of ids from a closed set of
   eight (TEACH_IMP_IDS), never a sentence, so it adds no free text field that
   a practitioner model would later have to hide. `n` in a run is a count of
   steps or addresses, so a release start does not write which addresses it
   covered.

   AND WHAT IS DERIVED, NEVER STORED. Where a person sits on an axis, whether
   a reach is earned, the line for the day, how many days a ritual was done:
   all read off the record on every call. The one place a derivable fact is
   also stored is `opened`, and that is deliberate and the only one: a derived
   mark can vanish when the record changes (a ritual day deleted, a clock set
   wrong) and a reach once opened must not close. The grant is the event, "this
   opened on this day"; the derivation is only how the build decides to write
   it.

   NO SCHEMA_V BUMP. teach.v is the block's own version, as PRACTICE_SCHEMA_V
   is for practice. The profile stays version 2, and whether this touches the
   contract with SOURCE is the owner's call (CLAUDE.md), so the block is
   additive and a record with none loads and reads as never worked toward.
   ============================================================ */
function teachBlank(){return {v:TEACH_V, focus:[], opened:[], runs:[]};}
/* what a stored block may carry. A closed set, not a second deny list: it
   refuses what nobody thought of, and the two lists below only change which
   words the refusal says: any other key, PR_NEVER's identity and payment names
   included and every name a stored match number could wear, is refused by name
   as "teach may not carry x", and a gate asserts both lists are refused. */
var TEACH_KEYS=['v','focus','opened','runs'];
var TEACH_SCORE=['score','match','fit','rank','percent'];
var TEACH_FOCUS_KEYS=['k','at','mine','share'];
var TEACH_RUN_KINDS=['practice','ritual','release'];
var TEACH_RUN_N=25;
function teachWholeNum(v,lo,hi){return typeof v==='number'&&isFinite(v)&&Math.floor(v)===v&&v>=lo&&v<=hi;}
function teachValidate(errs,o,path){
 path=path||'teach';
 var out=teachBlank();
 if(!o||typeof o!=='object'||Array.isArray(o)){errs.push(path+' is not an object'); return out;}
 Object.keys(o).forEach(function(k){
  if(TEACH_KEYS.indexOf(k)<0)errs.push(path+' may not carry '+k);});
 /* the version is the block's own. A newer one is refused by name: backward
    compatibility is promised and forward is not, and dropping what a newer
    build wrote would be the silent clamp this product refuses. Missing is an
    older block and reads as this one. */
 if(o.v!==undefined){
  if(typeof o.v!=='number'||!isFinite(o.v)||Math.floor(o.v)!==o.v||o.v<1)errs.push(path+'.v is not a version');
  else if(o.v>TEACH_V)errs.push(path+'.v '+o.v+' is newer than this build reads ('+TEACH_V+')');}
 if(o.focus!==undefined){
  if(!Array.isArray(o.focus))errs.push(path+'.focus is not a list');
  else if(o.focus.length>TEACH_FOCUS_MAX)
   errs.push(path+'.focus holds '+o.focus.length+', which is more than '+TEACH_FOCUS_MAX);
  else{
   var seenK={};
   o.focus.forEach(function(f,i){
    var fp=path+'.focus['+i+']';
    if(!f||typeof f!=='object'||Array.isArray(f)){errs.push(fp+' is not an object'); return;}
    Object.keys(f).forEach(function(k){if(TEACH_FOCUS_KEYS.indexOf(k)<0)errs.push(fp+' may not carry '+k);});
    var bad=0;
    if(TEACH_KEYS_ALL.indexOf(f.k)<0){errs.push(fp+'.k names no teacher: '+f.k); bad++;}
    else if(seenK[f.k]){errs.push(path+'.focus repeats '+f.k); bad++;}
    else seenK[f.k]=1;
    var at=vDate(errs,fp+'.at',f.at); if(at===null)bad++;
    var mine=[];
    if(f.mine!==undefined){
     if(!Array.isArray(f.mine)){errs.push(fp+'.mine is not a list'); bad++;}
     else{var ms={};
      f.mine.forEach(function(m,j){
       if(TEACH_IMP_IDS.indexOf(m)<0){errs.push(fp+'.mine['+j+'] names no impression: '+m); bad++; return;}
       if(ms[m]){errs.push(fp+'.mine repeats '+m); bad++; return;}
       ms[m]=1; mine.push(m);});}}
    /* CONSENT IS OFF UNLESS IT SAYS OTHERWISE. A missing share is off, and an
       on with no date is refused, because a switch that is on and cannot say
       since when is a consent nobody can read back. An off with a date is a
       revoke and keeps its date, so the person can see off since. */
    var share={on:false, at:null};
    if(f.share!==undefined){
     if(!f.share||typeof f.share!=='object'||Array.isArray(f.share)){errs.push(fp+'.share is not an object'); bad++;}
     else{
      Object.keys(f.share).forEach(function(k){if(k!=='on'&&k!=='at'){errs.push(fp+'.share may not carry '+k); bad++;}});
      if(typeof f.share.on!=='boolean'){errs.push(fp+'.share.on is not true or false'); bad++;}
      else{
       share.on=f.share.on;
       if(f.share.at!==undefined&&f.share.at!==null){var sa=vDate(errs,fp+'.share.at',f.share.at);
        if(sa===null)bad++; else share.at=sa;}
       if(share.on&&share.at===null){errs.push(fp+'.share.on is true and has no date'); bad++;}}}}
    if(!bad)out.focus.push({k:f.k, at:at, mine:mine, share:share});});}}
 if(o.opened!==undefined){
  if(!Array.isArray(o.opened))errs.push(path+'.opened is not a list');
  else{
   var seenR={};
   o.opened.forEach(function(g,i){
    var gp=path+'.opened['+i+']';
    if(!g||typeof g!=='object'||Array.isArray(g)){errs.push(gp+' is not an object'); return;}
    Object.keys(g).forEach(function(k){if(['k','r','at'].indexOf(k)<0)errs.push(gp+' may not carry '+k);});
    var bad=0;
    if(TEACH_KEYS_ALL.indexOf(g.k)<0){errs.push(gp+'.k names no teacher: '+g.k); bad++;}
    if(!teachWholeNum(g.r,1,TEACH_REACH.length)){errs.push(gp+'.r is out of range: '+g.r); bad++;}
    var at=vDate(errs,gp+'.at',g.at); if(at===null)bad++;
    if(!bad){var key=g.k+':'+g.r;
     if(seenR[key]){errs.push(path+'.opened repeats '+g.k+' reach '+g.r); return;}
     seenR[key]=1; out.opened.push({k:g.k, r:g.r, at:at});}});}}
 if(o.runs!==undefined){
  if(!Array.isArray(o.runs))errs.push(path+'.runs is not a list');
  else if(o.runs.length>TEACH_RUNS_CAP)
   errs.push(path+'.runs holds '+o.runs.length+', which is more than '+TEACH_RUNS_CAP);
  else o.runs.forEach(function(x,i){
   var xp=path+'.runs['+i+']';
   if(!x||typeof x!=='object'||Array.isArray(x)){errs.push(xp+' is not an object'); return;}
   Object.keys(x).forEach(function(k){if(['t','tc','kind','n'].indexOf(k)<0)errs.push(xp+' may not carry '+k);});
   var bad=0;
   var t=vDate(errs,xp+'.t',x.t); if(t===null)bad++;
   if(TEACH_KEYS_ALL.indexOf(x.tc)<0){errs.push(xp+'.tc names no teacher: '+x.tc); bad++;}
   if(TEACH_RUN_KINDS.indexOf(x.kind)<0){errs.push(xp+'.kind is not a kind of run: '+x.kind); bad++;}
   if(!teachWholeNum(x.n,0,TEACH_RUN_N)){errs.push(xp+'.n is out of range: '+x.n); bad++;}
   if(!bad)out.runs.push({t:t, tc:x.tc, kind:x.kind, n:x.n});});}
 /* the version the block leaves with is this build's, so a block written
    before the field existed validates to the same thing twice */
 out.v=TEACH_V;
 return out;}
/* ---------------- changing the block, through the boundary ----------------
   Every function returns {ok:true, teach} or {ok:false, why}, and the block it
   returns has been through teachValidate, so a surface can never write a block
   the boundary would then refuse on the next load. Nothing mutates its input. */
function teachClone(t){return JSON.parse(JSON.stringify(t&&typeof t==='object'?t:teachBlank()));}
function teachDone(t){
 var errs=[], v=teachValidate(errs,t,'teach');
 return errs.length?{ok:false, why:errs[0]}:{ok:true, teach:v};}
function teachFocusOf(t,k){
 var f=(t&&t.focus)||[]; for(var i=0;i<f.length;i++)if(f[i].k===k)return f[i];
 return null;}
function teachFocusAdd(t,k,now){
 var n=teachClone(t);
 if(TEACH_KEYS_ALL.indexOf(k)<0)return {ok:false, why:'teach.focus names no teacher: '+k};
 if(teachFocusOf(n,k))return {ok:true, teach:n};
 if(n.focus.length>=TEACH_FOCUS_MAX)return {ok:false, why:'You have chosen '+TEACH_FOCUS_MAX
  +' teachers. Unpin one before you choose another.'};
 n.focus.push({k:k, at:now, mine:[], share:{on:false, at:null}});
 return teachDone(n);}
function teachFocusRemove(t,k){
 var n=teachClone(t), f=teachFocusOf(n,k);
 if(!f)return {ok:true, teach:n};
 /* a teacher that is shared is not unpinned out from under the consent: the
    switch goes off first, so the record of it keeps its date */
 if(f.share&&f.share.on)return {ok:false, why:'Turn sharing off before you unpin this teacher.'};
 n.focus=n.focus.filter(function(x){return x.k!==k;});
 return teachDone(n);}
function teachMarkToggle(t,k,id){
 var n=teachClone(t), f=teachFocusOf(n,k);
 if(!f)return {ok:false, why:'Choose this teacher before you mark what is yours.'};
 var i=f.mine.indexOf(id);
 if(i>=0)f.mine.splice(i,1); else f.mine.push(id);
 return teachDone(n);}
function teachShareSet(t,k,on,now){
 var n=teachClone(t), f=teachFocusOf(n,k);
 if(!f)return {ok:false, why:'Choose this teacher before you share it.'};
 f.share={on:!!on, at:now};
 return teachDone(n);}
function teachGrantAdd(t,k,r,now){
 var n=teachClone(t);
 if(!n.opened.some(function(g){return g.k===k&&g.r===r;}))n.opened.push({k:k, r:r, at:now});
 return teachDone(n);}
function teachRunAdd(t,tc,kind,count,now){
 var n=teachClone(t);
 n.runs.push({t:now, tc:tc, kind:kind, n:count});
 return teachDone(n);}

/* ---------------- what a person did, read off the record ----------------
   The steps that are a teacher's own, as opposed to the shared breath a dozen
   rituals begin with. Counting a day of Box Breathing as a day toward every
   teacher whose ritual starts with it would open Musashi's second reach for
   somebody who has never done anything of his. */
function teachOwnSteps(k){
 return PRACTICE.filter(function(p){return p.tc===k;}).map(function(p){return p.k;});}
/* DISTINCT DAYS A RITUAL WAS DONE WITH ONE OF THIS TEACHER'S OWN STEPS. Not
   pracDays and not the streak: both count a day a ritual was SET and never
   done (PRIORITY.md 21.J2). An entry with no done key was saved before the key
   existed and is left out here and not read as done, which is the stricter
   reading, because an unlock must not open on a day nobody can say was done.
   Days are the person's own local days, through pracDay. */
function teachDays(p,k){
 var own=teachOwnSteps(k), seen={}, n=0;
 ((p&&p.rituals)||[]).forEach(function(x){
  if(!x||typeof x!=='object')return;
  if(x.done===undefined||x.done===false||x.done===null)return;
  if(!Array.isArray(x.steps)||!x.steps.some(function(s){return own.indexOf(s)>=0;}))return;
  var d=pracDay(x.t); if(d===null||seen[d])return;
  seen[d]=1; n++;});
 return n;}
/* DISTINCT ADDRESSES OF THE OPPOSITE FOUND IN WHAT WAS RELEASED. meter.unique
   holds one key a line opened, the address first, so this reads the address
   out of each key and counts the ones this pole's opposite is marked at. */
function teachReleased(p,k){
 var ids={}; teachMarkIds(k).forEach(function(i){ids[i]=1;});
 var seen={}, n=0;
 ((p&&p.meter&&p.meter.unique)||[]).forEach(function(key){
  var a=+String(key).split(':')[0];
  if(ids[a]&&!seen[a]){seen[a]=1; n++;}});
 return n;}
/* WHICH REACHES ARE OPEN, by the table and by the grants. A reach is open when
   any one of its ways in holds, or when it was ever granted. The result says
   what the person has done and what the next reach takes in words, and never a
   count against a total (the voice gate refuses "2 of 5") and never a timer. */
function teachCond(c,st){
 if(c.c==='chosen')return st.chosen;
 if(c.c==='days')return st.days>=c.n;
 if(c.c==='released')return st.released>=c.n;
 return false;}
function teachReach(p,k){
 var t=(p&&p.teach)||teachBlank();
 var st={chosen:!!teachFocusOf(t,k), days:teachDays(p,k), released:teachReleased(p,k)};
 var earned=0;
 TEACH_UNLOCK.forEach(function(u){
  var open=u.any.some(function(way){return way.every(function(c){return teachCond(c,st);});});
  /* in order: a later reach never opens past one that is shut */
  if(open&&earned===u.r-1)earned=u.r;});
 var granted=0;
 (t.opened||[]).forEach(function(g){if(g.k===k&&g.r>granted)granted=g.r;});
 var open=Math.max(earned,granted);
 var next=null;
 if(open<TEACH_REACH.length){
  var u=TEACH_UNLOCK[open], r=TEACH_REACH[open];
  next={r:r.r, nm:r.nm, say:teachSay(u,st)};}
 return {open:open, earned:earned, granted:granted, next:next, days:st.days, released:st.released, chosen:st.chosen};}
/* what a reach takes, in the words a person reads. The ways in are joined by
   "or" and the conditions in one way by "and", and what has been done so far
   is said in words. */
function teachSay(u,st){
 var ways=u.any.map(function(way){
  return way.map(function(c){
   if(c.c==='chosen')return 'you choose this teacher';
   if(c.c==='days')return 'this ritual has been done on '+c.n+' different days';
   if(c.c==='released')return c.n===1?'one address of the opposite has been released'
    :c.n+' addresses of the opposite have been released';
   return '';}).filter(Boolean).join(' and ');});
 var did=st.days===0?'It has been done on none yet.':'It has been done on '+st.days+(st.days===1?' day.':' different days.');
 var needs=u.any.some(function(way){return way.some(function(c){return c.c==='days';});});
 return 'Opens when '+ways.join(', or when ')+'.'+(needs?' '+did:'');}
/* NEW GRANTS DUE, pure. The reaches the record has earned that the block does
   not yet hold. The surface writes each through teachGrantAdd and says so in
   one quiet line, and if the write fails the reach still shows open this
   session and the status line says it will open again, never silent. */
function teachGrantsDue(p,k){
 var r=teachReach(p,k), held={};
 ((p&&p.teach&&p.teach.opened)||[]).forEach(function(g){if(g.k===k)held[g.r]=1;});
 var out=[]; for(var i=1;i<=r.earned;i++)if(!held[i])out.push(i);
 return out;}
/* ---------------- the line for the day ----------------
   READ AND NEVER STORED, so two devices agree and nothing has to be kept: one
   of the open lines, round robin by the day number. A reach that is not open
   contributes no line, and with nothing open there is no line to show. */
function teachLineOf(k,open,day){
 var r=teachRow(k); if(!r||!open)return null;
 var ls=r.lines.filter(function(l){return l.r<=open;});
 if(!ls.length)return null;
 var i=((Math.floor(day)%ls.length)+ls.length)%ls.length;
 return {line:ls[i].line, past:ls[i].past, r:ls[i].r};}
/* THE FORM A LINE IS SHOWN IN. His words asked for ultra high limiting
   affirmations, and the research the product already holds (Wood, Perunovic and
   Lee 2009) found that a person with low self regard who repeats a positive
   statement feels worse, and the arm that did no harm held it as both true and
   not true. So at or below the level the same line is shown in hold form: read
   against the body, never said as a fact. The level is the one the gamification
   design reads, level 4 or below on expression (r.EX against TIERDEF), and
   which reading decides it is the owner's open question, so it is read in one
   place and moves in one place. An unread field is hold form: nothing has been
   measured, and the cautious side is the right default for a line. */
var TEACH_HOLD_LEVEL=4;
function teachLevel(r){
 if(!r||typeof r.EX!=='number')return null;
 var nm=tierOf(r.EX).nm;
 for(var i=0;i<TIERDEF.length;i++)if(TIERDEF[i].nm===nm)return TIERDEF.length-i;
 return null;}
function teachForm(r){
 if(!r||r.unread)return 'hold';
 var l=teachLevel(r);
 return (l===null||l<=TEACH_HOLD_LEVEL)?'hold':'say';}
var TEACH_HOLD_PREFIX='Hold this against the body and read it. Do not say it as a fact.';

/* ---------------- sharing with a cohort lead ----------------
   He said a lead can see the teachers if the person shares them, and no match
   number. This is the ONE function that builds what leaves, and it can only
   ever return a pole key and the reach opened. No name, no line text, no
   marks, no evidence, no story, no number about the person. A lead's own
   screen looks the teacher up by key, so the lead sees the product's public
   content and nothing the person wrote.

   TWO KEYS, and this function holds one of them: the person has switched
   sharing on for that teacher, and a lead is linked. `linked` is false unless
   the caller says so, and nothing in the product can link a lead before
   accounts exist, so until then this returns nothing for anybody. An imported
   record with share.on true is inert for the same reason. */
function teachShareOut(p,o){
 if(!o||o.linked!==true)return [];
 var t=(p&&p.teach)||teachBlank();
 return t.focus.filter(function(f){return f.share&&f.share.on===true;})
  .map(function(f){return {k:f.k, r:teachReach(p,f.k).open};});}
