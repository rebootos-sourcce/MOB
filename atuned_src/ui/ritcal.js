/* ============================================================
   THE RITUAL PAGE AS A CALENDAR, round QX, 3 October. His words, a long
   dictation, read as five asks (the report that carried this names which
   fragments were read as instructions and which were dictation):

     "the whole thing should look effectively like a calendar"
     "The ones on the left add a text description. And the success of what it
      leads to."
     "cards from my journal for my ritual that allow me to add them to my
      daily practice or bank them to my vault or dismiss"
     "I should see three. Daily affirmations. Three challenges. Three.
      Tuesday, Thursday, Saturday. Protocol runs in my ritual."
     "The center column. As my complete list of daily, weekly, monthly goals,
      and my success win in my accountability tracker that I can look at over
      a period of a year, broken up into a year, six months, three months, two
      months, one month, two weeks, one week. Five days, three days, one day."

   WHAT THIS FILE ADDS, and every read names where it comes from.

     the goals      one card, Goals, three views of one set. Today is the
                    Active list (ritActiveBody, unchanged), three affirmations
                    and three challenges. This week is a calendar week, Sunday
                    first since SV24, one row per active ritual, so a ritual set for
                    Tuesday, Thursday and Saturday is drawn on those three days
                    and nowhere else. This month is each ritual with where its
                    span ends, and the month's counts.
     affirmations   ritAffirm. The person's own avatar lines first, then one
                    line per pattern held, off AFFIRM (engine/data/affirm.js).
     challenges     ritChallenge. The heaviest saboteurs compute() reads, each
                    with its own intervention from SABDEF (engine/data/kb.js),
                    which is already a challenge in shape: "Make one direct
                    request for connection." Nothing new was written for them.
     success        Success over time, the span he named, ten of them, a year
                    down to a day. Every figure is a count of days or minutes
                    off the record (ritDaySegs, the month's own read), and the
                    days before a record starts are drawn blank and said to be
                    blank, never counted as missed.
     a suggestion   its own record with that practice (ritSugRec), what it is
                    for (ritSugToward), and two more answers: Save for later and
                    Dismiss, kept beside the record (ritMore).

   WHERE THE NEW THINGS ARE KEPT. Beside the record, under their own key, the
   posture ritual.js takes for plans and avatarui.js for its rules, because
   the boundary rebuilds a record from the fields it names and would drop
   anything else, and adding a field is schema v2, his call. It survives a
   reload and does not travel with an export, the same named cost the plans
   carry. A said affirmation or a done challenge is NOT a kept ritual day: it
   does not move the streak, the avatar's cycles or the thirty day loop,
   because those read CURP.rituals and nothing here writes there.

   WHAT "BANK TO MY VAULT" MEANS HERE, decided and said. Bank and Vault are
   already two words on the Story page with meanings of their own: the bank is
   every imprint held, the vault is what has been released. A suggestion is
   neither, so using either word for it would be one word for two concepts.
   His intent, keeping a suggestion without starting it, is Save for later,
   and what is saved sits under Saved for later in the same column.
   ============================================================ */

/* ---------------- beside the record ---------------- */
var RIT_MORE_KEY='atuned-ritual-more';
var RIT_MORE_CAP=4000;
/* THE CENTRE OPENED ON THE WEEK, round RB, behind a three way switch, and the
   switch is gone, SV16: the week is a card of its own at the top of the
   centre and is never one press away. Its state is RIT.wk, at ritWeekCalHtml
   below. */
RIT.span='1m';
RIT.sgGone=null;
function ritMoreAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(RIT_MORE_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
/* anything that is not the shape the writers below put there is left out on
   the read, the boundary's posture, and a store that cannot be read is an
   empty one and never a reason to throw the page */
function ritMore(){
 var out={save:[], gone:[], said:[], did:[]};
 if(!CURP||!CURP.id)return out;
 var e=ritMoreAll()[CURP.id];
 if(!e||typeof e!=='object')return out;
 var seen={};
 (Array.isArray(e.save)?e.save:[]).forEach(function(s){
  if(!s||typeof s!=='object'||typeof s.k!=='string')return;
  var p=ritPr(s.k); if(!p||p.tc)return;
  if(s.rel!=null&&(typeof s.rel!=='number'||!BY[s.rel]))return;
  if(s.b&&BANDS.indexOf(s.b)<0)return;
  if(typeof s.why!=='string'||s.why.length>240||typeof s.t!=='string'||pracDay(s.t)===null)return;
  var key=ritSugKey(s); if(seen[key])return; seen[key]=1;
  out.save.push({k:s.k, rel:(s.rel==null?null:s.rel), b:s.b||'', why:s.why, t:s.t});});
 (Array.isArray(e.gone)?e.gone:[]).forEach(function(g){
  if(typeof g==='string'&&g.length<=60&&/^[A-Za-z0-9_]+\|\d*$/.test(g)&&out.gone.indexOf(g)<0)out.gone.push(g);});
 ['said','did'].forEach(function(k){
  (Array.isArray(e[k])?e[k]:[]).forEach(function(x){
   if(Array.isArray(x)&&x.length===2&&typeof x[0]==='number'&&Math.floor(x[0])===x[0]
    &&typeof x[1]==='string'&&x[1].length<=80)out[k].push([x[0],x[1]]);});});
 return out;}
/* ONE WRITER for this key. It refuses a worked example by name, writes, and
   says so if the store would not take it: a control never claims a save it
   does not have. */
function ritMoreWrite(fn,msg){
 if(!ritOwn()){status(ritWhose()+' is a worked example, so nothing was saved to it.','fail');return false;}
 var ok=false;
 if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  try{var all=ritMoreAll(), cur=ritMore(); fn(cur);
   ['said','did'].forEach(function(k){if(cur[k].length>RIT_MORE_CAP)cur[k]=cur[k].slice(-RIT_MORE_CAP);});
   all[CURP.id]=cur; STORE.set(RIT_MORE_KEY,JSON.stringify(all)); ok=true;}
  catch(err){ok=false;}}
 if(!ok){status('Could not save that. Nothing changed.','fail'); ritRender(); return false;}
 if(msg)status(msg);
 ritRender(); return true;}
function ritSugKey(x){return x.k+'|'+(x.rel==null?'':x.rel);}

/* ---------------- a suggestion's three answers ---------------- */
function ritSugSave(i){
 var x=(RIT.sug||[])[i]; if(!x)return false;
 return ritMoreWrite(function(m){
  if(m.save.some(function(s){return ritSugKey(s)===ritSugKey(x);}))return;
  m.save.push({k:x.k, rel:x.rel, b:x.seats[0]||'', why:String(x.why[0]||'').slice(0,240), t:new Date().toISOString()});},
  'Saved. '+x.p.nm+' waits under Saved until you add it.');}
function ritSugDrop(i){
 var x=(RIT.sug||[])[i]; if(!x)return false;
 var key=ritSugKey(x);
 var ok=ritMoreWrite(function(m){if(m.gone.indexOf(key)<0)m.gone.push(key);},null);
 if(ok){RIT.sgGone={key:key, nm:x.p.nm}; ritRender();}
 return ok;}
function ritSugBack(){
 var g=RIT.sgGone; if(!g)return false;
 var ok=ritMoreWrite(function(m){m.gone=m.gone.filter(function(k){return k!==g.key;});},'Put back.');
 if(ok){RIT.sgGone=null; ritRender();}
 return ok;}
function ritSugAll(){
 return ritMoreWrite(function(m){m.gone=[];},'Every dismissed practice is back on the list.');}
/* a saved one starts the way a suggestion does, through ritStartPlan, and
   leaves the shelf only once the plan is written */
function ritSavedStart(i){
 var s=ritMore().save[i]; if(!s)return false;
 var p=ritPr(s.k), q={steps:[s.k], band:s.b, track:p.track, days:7, tags:s.b?[s.b]:[]};
 var ok;
 if(s.rel!=null&&BY[s.rel]){q.rel=s.rel;
  ok=ritStartPlan(q,'Set. '+p.nm+' each day for a week, for '+String(BY[s.rel].k).toLowerCase()+'.');}
 else ok=ritStartPlan(q,'Started. '+p.nm+' each day for a week.');
 if(ok)ritMoreWrite(function(m){m.save=m.save.filter(function(x){return ritSugKey(x)!==ritSugKey(s);});},null);
 return ok;}
function ritSavedDrop(i){
 var s=ritMore().save[i]; if(!s)return false;
 return ritMoreWrite(function(m){m.save=m.save.filter(function(x){return ritSugKey(x)!==ritSugKey(s);});},
  'Removed from Saved.');}

/* ---------------- what a suggestion has done for you ----------------
   "The success of what it leads to." Searched for anything that measures how
   well a practice works: there is no such number anywhere in the engine, for
   any person or for anyone. The practice domain (engine/practice.js) has
   Outcome records and nothing writes them. So a success rate would be made
   up, and it is not printed. What does exist is the person's OWN record with
   the practice, and for a release schedule, what they said after releasing
   at that place. Both are read here and nothing else is. */
function ritSugRec(x,now){
 var days={}, runs=0, last=null;
 ((CURP&&CURP.rituals)||[]).forEach(function(e){
  if(!e||!Array.isArray(e.steps)||e.steps.indexOf(x.k)<0||!ritIsDone(e))return;
  var d=pracDay(e.t); if(d!==null)days[d]=1;});
 ritPlans().forEach(function(p){if(p.steps.indexOf(x.k)<0)return; runs++;
  if(!last||ritStart0(p)>ritStart0(last))last=p;});
 var then=null;
 if(last){var h=ritSnapBefore(last.from); if(h&&typeof h.loaded==='number')then=h.loaded;}
 var said={};
 if(x.rel!=null&&typeof releaseVerifyAt==='function')
  releaseVerifyAt((CURP&&CURP.practice)||null,x.rel).forEach(function(a){said[a.value]=(said[a.value]||0)+1;});
 return {kept:Object.keys(days).length, runs:runs, then:then, now:now, said:said};}
function ritSugRecSays(x,R){
 var out=[];
 if(!R.kept&&!R.runs)out.push('Not tried yet, so your record says nothing about what it does for you.');
 else{out.push('Kept on '+acctDays(R.kept)+(R.runs>1?', across '+R.runs+' runs.':'.'));
  if(R.then!==null)out.push('Held places: '+R.then+' when you last started it, '+R.now+' now. The two moved together; that does not say this practice moved them.');}
 var ks=Object.keys(R.said);
 if(ks.length)out.push('After releasing at '+String(BY[x.rel].k).toLowerCase()+' you said: '
  +ks.map(function(k){return (RV_SAY[k]||k)+(R.said[k]>1?', '+R.said[k]+' times':', once');}).join('; ')+'.');
 return out;}
/* what it is for: the coherent opposite of the pattern at the place the card
   is for, CHILD's own opp. A word from the canon, not a measurement. */
function ritSugToward(x){
 var b=x.seats[0]||'', n=(x.rel!=null&&BY[x.rel])?BY[x.rel]:null;
 if(!n&&b)n=ritHeld().filter(function(h){return h.b===b&&h.cf;}).sort(function(a,c){return c.sq-a.sq;})[0]||null;
 var cf=n&&n.cf?CHILD.filter(function(c){return c.nm===n.cf;})[0]:null;
 if(!cf)return null;
 return {opp:cf.opp, nm:cf.nm, k:n.k, b:n.b};}
function ritCfWord(nm){return nm==='Sad'?'sadness':String(nm||'').toLowerCase();}

/* ---------------- the saved shelf ----------------
   NAMED SAVED, SV16. The card's press became Save on his word ("Instead of
   saying save for later, just do save"), and a shelf still called Saved for
   later under a press called Save says one act in two wordings. Everything on
   a shelf of things not started is for later, so the two words carried
   nothing. Ruled by the narrative director, 5 November. */
function ritSavedHtml(){
 var m=ritMore(); if(!m.save.length)return '';
 return '<div class="rv-sec rv-saved"><div class="rv-hd"><span class="rv-h">Saved</span></div>'
  +'<p class="rv-mean">Suggestions you kept without starting. Add one when you are ready; it runs each day for a week.</p>'
  +'<ul class="rv-svl">'+m.save.map(function(s,i){var p=ritPr(s.k), col=s.b?seatCol(s.b):'var(--accent)';
   return '<li class="rv-sv1" style="--c:'+col+'"><span class="rv-svt"><span class="rv-sgn">'+esc(p.nm)+'</span>'
    +'<span class="rv-sgm">'+p.min+' min'+(s.rel!=null&&BY[s.rel]?', for '+esc(String(BY[s.rel].k).toLowerCase()):'')+'</span></span>'
    +'<span class="rv-sva"><button type="button" class="btn" data-act="sv-rm" data-i="'+i+'" aria-label="Remove '+esc(p.nm)+' from Saved">Remove</button>'
    +'<button type="button" class="btn pri" data-act="sv-add" data-i="'+i+'" aria-label="Add '+esc(p.nm)+' to practice">Add</button></span></li>';}).join('')
  +'</ul></div>';}

/* ---------------- the day's affirmations and challenges ---------------- */
function ritHash(s){var h=0; s=String(s); for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0; return (h>>>0).toString(36);}
function ritAffirm(st){
 var out=[], seen={}, cfs={};
 var pairs=(CURP&&CURP.avatar&&CURP.avatar.pairs)||[];
 for(var i=pairs.length-1;i>=0&&out.length<3;i--){
  var pr=pairs[i]; if(!pr||!pr.be)continue;
  var be=String(pr.be).trim().replace(/^"+|"+$/g,''); if(!be||seen[be])continue; seen[be]=1;
  var b=(pr.seat&&BANDS.indexOf(pr.seat)>=0)?pr.seat:((typeof readSeat==='function')?readSeat(pr.notbe||''):null);
  out.push({id:'av:'+ritHash(be), line:be, b:b||'', own:true});}
 /* NO LINE UNDER AN AFFIRMATION, 4 November. Every card carried a second
    line saying where it came from: "Toward equanimity. You hold pride at the
    solar plexus, and it runs on anger.", or "Your own avatar line, at the
    heart.", or "Nothing is read yet, so this starts toward" a quality "near
    the ground." He struck it in red on the live page, on every card. It was one
    template, ritAffHtml printing a.from, so the field went from all three
    sources here and the slot went from the card. The seat still colours the
    ring, which is where the card says where it sits. */
 ritHeld().forEach(function(n){
  if(out.length>=3||!n.cf||cfs[n.cf]||!AFFIRM[n.cf])return; cfs[n.cf]=1;
  if(!CHILD.some(function(f){return f.nm===n.cf;}))return;
  out.push({id:'ax:'+n.cf, line:AFFIRM[n.cf], b:n.b});});
 AFFIRM_START.forEach(function(cf){
  if(out.length>=3||cfs[cf])return; cfs[cf]=1;
  var c=CHILD.filter(function(f){return f.nm===cf;})[0]; if(!c)return;
  out.push({id:'ax:'+cf, line:AFFIRM[cf], b:c.seat});});
 return out;}
function ritSabKey(nm){return String(nm||'').replace(/\s+overshot$/i,'').toLowerCase().replace(/-/g,' ').trim();}
/* the fetter an inferred saboteur runs on, read off its agent noun, the last
   word of its name: "Root Mourner" is Mourner, which is Sad */
function ritInferFetter(nm){
 var w=String(nm||'').replace(/\s+overshot$/i,'').trim().split(/\s+/).pop();
 for(var f in INFER_NOUN)if(INFER_NOUN[f]===w)return f;
 return null;}
/* THREE, IN THIS ORDER, and each one says where it came from. The heaviest
   saboteurs the reading names, with SABDEF's own intervention; then an
   inferred one, with the fetter's challenge from CHALLENGE; then, if fewer
   than three run, a place held at four or more, by its fetter. One per
   fetter, so two Mourners are not two copies of one act. */
function ritChallenge(st){
 var out=[], seen={}, fet={};
 var sabs=(st.r.sabs||[]).slice().sort(function(a,b){return (b.w||0)-(a.w||0);});
 sabs.forEach(function(s){
  if(out.length>=3)return;
  var b=(s.parts&&s.parts[0]&&BANDS.indexOf(s.parts[0].b)>=0)?s.parts[0].b:'';
  var k=ritSabKey(s.nm), D=(typeof SABDEF!=='undefined')?SABDEF[k]:null;
  if(D){if(seen[k])return; seen[k]=1;
   out.push({id:'sab:'+k.replace(/\s+/g,'_'), nm:'The '+String(s.nm).replace(/\s+overshot$/i,''), act:D.i, when:D.t,
    who:'the voice that says "'+String(D.q).split(' / ')[0]+'"', b:b}); return;}
  var f=ritInferFetter(s.nm); if(!f||!CHALLENGE[f]||fet[f])return; fet[f]=1;
  var nm=String(s.nm).replace(/\s+overshot$/i,'');
  out.push({id:'cf:'+f, nm:'The '+nm, act:CHALLENGE[f].act, when:CHALLENGE[f].when,
   who:'a pattern the reading finds and does not name, running on '+ritCfWord(f)+(b?' at '+ritThe(b):''), b:b});});
 ritHeld().forEach(function(n){
  if(out.length>=3||!n.cf||fet[n.cf]||!CHALLENGE[n.cf])return; fet[n.cf]=1;
  out.push({id:'cf:'+n.cf, nm:ritCap(String(n.k).toLowerCase())+' at '+ritThe(n.b), act:CHALLENGE[n.cf].act, when:CHALLENGE[n.cf].when,
   who:'a place you hold, running on '+ritCfWord(n.cf), b:n.b});});
 return out;}
function ritDayOn(list,d,id){return list.some(function(x){return x[0]===d&&x[1]===id;});}
/* today only. A said line is a moment, and a record a person can backdate at
   will is not a record. Pressed again it comes off. */
function ritDayMark(kind,id){
 if(!id)return false;
 var today=ritToday0(), m0=ritMore(), on=ritDayOn(m0[kind],today,id);
 var ok=ritMoreWrite(function(m){
  if(on)m[kind]=m[kind].filter(function(x){return !(x[0]===today&&x[1]===id);});
  else m[kind].push([today,id]);},
  on?'Taken off.':(kind==='said'?'Said. Marked for today.':'Done. Marked for today.'));
 if(ok&&!on&&typeof sfx==='function')sfx('done');
 return ok;}
function ritTickHtml(on,col){
 return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" class="rv-track" style="stroke-width:4"/>'
  +(on?'<circle cx="20" cy="20" r="14" class="rv-s rv-s-done" style="stroke:'+col+';stroke-width:4"/><path d="M13 20l5 5 9-10" class="rv-tick" style="stroke:'+col+'"/>':'')
  +'</svg>';}
function ritAffHtml(st,M){
 var A=ritAffirm(st), today=st.today;
 var body='<ul class="rv-afl">'+A.map(function(a){var on=ritDayOn(M.said,today,a.id), col=a.b?seatCol(a.b):'var(--accent)';
  return '<li class="rv-af1'+(on?' rv-on':'')+'" style="--c:'+col+'">'
   +'<button type="button" class="rv-log" data-act="said" data-id="'+esc(a.id)+'" aria-pressed="'+on+'" aria-label="'
   +(on?'Said today. Press to take it off':'Mark said today: '+esc(a.line))+'">'+ritTickHtml(on,col)+'</button>'
   +'<span class="rv-aft"><span class="rv-afq">'+(a.own?'"'+esc(a.line)+'"':esc(a.line))+'</span></span></li>';}).join('')+'</ul>';
 return '<div class="rv-gblk rv-aff"><div class="rv-gh"><span class="rv-gt">Affirmations</span>'
  /* "Say each one out loud, once today, and press its ring." stood under this
     heading and is cut, SV17. His word for a line that tells a person how to
     use a ring was insult, so it is not moved into a tooltip either: the ring
     carries a press and an accessible name, and that is the instruction. */
  +'</div>'+body+'</div>';}
function ritChalHtml(st,M){
 var C=ritChallenge(st), today=st.today, body;
 if(!C.length)body='<p class="rv-empty">'+(st.r.unread
   ?'Nothing is read yet. A challenge comes from a pattern your reading shows running, so write a story first.'
   :'Nothing your reading shows running or held has a challenge written for it yet.')+'</p>'
  +(st.r.unread?'<div class="rv-acts"><button type="button" class="btn" data-act="go-story">Write a story</button></div>':'');
 else body='<ul class="rv-afl">'+C.map(function(c){var on=ritDayOn(M.did,today,c.id), col=c.b?seatCol(c.b):'var(--accent)';
  return '<li class="rv-af1 rv-ch1'+(on?' rv-on':'')+'" style="--c:'+col+'">'
   +'<button type="button" class="rv-log" data-act="did" data-id="'+esc(c.id)+'" aria-pressed="'+on+'" aria-label="'
   +(on?'Done today. Press to take it off':'Mark done today: '+esc(c.nm))+'">'+ritTickHtml(on,col)+'</button>'
   /* WHEN A CHALLENGE APPLIES IS ON THE PRESS, SV19. It was a third line
      under every challenge, "When accountability is required.", the third
      tier text he struck everywhere else on this page this round. The name
      and its voice stay, because the voice is what the name means (the
      unpack rule), and the action stays, because it is the challenge. The
      when rides in the one tooltip on the text. */
   +'<span class="rv-aft"'+rvTip(c.nm,c.when)+'><span class="rv-chn">'+esc(c.nm)+'<small>, '+esc(c.who)+'</small></span>'
   +'<span class="rv-afq">'+esc(c.act)+'</span></span></li>';}).join('')+'</ul>';
 /* FEWER THAN THREE IS STILL NEVER PADDED with a challenge nothing points
    to, and it is no longer said. A line counted the rows aloud ("One pattern
    in your reading has a challenge, so one is shown. More come as your
    stories show more.") over a list a person can count, and the heading's own
    line said how to press a ring. Both are cut, SV17, on the same ruling as
    the affirmations above. */
 return '<div class="rv-gblk rv-chal"><div class="rv-gh"><span class="rv-gt">Challenges</span></div>'+body+'</div>';}

/* ---------------- the week ----------------
   THE CENTRE IS A WEEK, SV16, 5 November. His words, over an annotated
   screenshot of the live page: "I'm at the center panel to look at, like a
   calendar. A weekly calendar. All 7 days. I can cycle through. Underneath
   it, every day shows me which rituals I need to do."

   Round RB had already opened the Goals card on This week, and he still did
   not read it as a calendar. The reason was its shape and not its place: it
   was a row per ritual and a square per day, which is a tracker's grid, and
   on a calendar the thing a person looks at is the day. So the day is the
   column now, Sunday first since SV24, and under each date are the rituals that day
   carries, by name, in their seat's colour, done, set or missed. The switch
   between Today, This week and This month went with the grid: a week one
   press away behind a Today is the arrangement he said does not look like a
   calendar.

   ONE READ FOR A DAY. What a day carries is ritDaySegs, the read the Record's
   month already draws one column over, so the two calendars on this page
   cannot disagree about a day. It is the record first and then every plan
   that covered the day, so a ritual that has ended or was stopped still
   shows on the days it ran: a past week is a record, not a list of what is
   running now.

   THE ARROWS. RIT.wk is weeks from this one, and it is page state, never
   kept: leaving Flow puts it back to this week (ritRender), because a person
   who comes back to the page is asking what is due now. */
RIT.wk=0;
/* how far ahead the forward arrow goes. Every span the builder offers ends
   within two weeks except No end, which runs for ever, so a week past that
   only repeats the one before it. Back goes to the week the record starts:
   before it every day is empty for a reason no week can show. */
var RIT_WK_AHEAD=4;
var RIT_DAY_SAY={done:'Done', plan:'Planned for today', ahead:'Planned', miss:'Missed'};
/* the date of a day key, at local noon, so the number printed is the day the
   person lived and not the one UTC is on */
function ritDateOf(d){var off=new Date().getTimezoneOffset()*60000; return new Date(d*DAY_MS+off+12*3600000);}
/* the furthest week back, as a negative count of weeks from this one */
function ritWkMin(st){
 var rs=ritRecordStart(st); if(rs===null||rs>st.today)return 0;
 return -Math.round(((st.today-ritWc(st.today))-(rs-ritWc(rs)))/7);}
/* one day's rituals, once each: the record can hold the same steps twice on a
   day, and a calendar names a ritual once on the day it carries it */
function ritWeekDay(d,st){
 var seen={}, out=[];
 ritDaySegs(d,st.plans,st.today).forEach(function(s){var k=s.nm+'|'+s.st;
  if(seen[k])return; seen[k]=1; out.push(s);});
 return out;}
function ritWeekCalHtml(st){
 var today=st.today, lo=ritWkMin(st);
 RIT.wk=Math.max(lo,Math.min(RIT_WK_AHEAD,RIT.wk|0));
 /* the week opens on its Sunday, ritWc (ui/ritual.js), SV24 */
 var sun=today-ritWc(today)+7*RIT.wk, first=ritDateOf(sun), last=ritDateOf(sun+6);
 var fmt=function(dt){return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short'});};
 var range=fmt(first)+' to '+fmt(last);
 var nav='<div class="rv-wkn">'
  +'<button type="button" class="rv-ib" data-act="wk" data-d="-1" aria-label="Week before"'+(RIT.wk<=lo?' disabled':'')+'>'+ritIc('back')+'</button>'
  +'<span class="rv-wkr" aria-live="polite">'+esc(range)+'</span>'
  +'<button type="button" class="rv-ib" data-act="wk" data-d="1" aria-label="Week after"'+(RIT.wk>=RIT_WK_AHEAD?' disabled':'')+'>'+ritIc('fwd')+'</button>'
  /* a person who has cycled away gets one press back to now. It is drawn only
     while away, so on this week it is not a control that does nothing. */
  +(RIT.wk?'<button type="button" class="btn rv-wk0" data-act="wk" data-d="0">This week</button>':'')+'</div>';
 /* THE WEEK HOLDS TODAY or it does not, and only a week that holds it sets
    the other six back: on a week cycled away no day is the one to look at */
 var hasNow=today>=sun&&today<=sun+6;
 var days='<ol class="rv-wkg'+(hasNow?' rv-wkg-now':'')+'" aria-label="'+esc(range)+'">'+[0,1,2,3,4,5,6].map(function(i){
  var d=sun+i, dt=ritDateOf(d), segs=ritWeekDay(d,st);
  /* MORE THAN THREE IS TWO AND A +N, never four squeezed into three slots:
     a day can carry rituals, and each is its own sash, so a heavy day would
     otherwise grow its cell and the grid would stop being a grid */
  var show=segs.length>RIT_SASH_MAX?segs.slice(0,RIT_SASH_MAX-1):segs, rest=segs.slice(show.length);
  var list=segs.length?'<ul class="rv-wdl">'+show.map(function(s,k){return '<li>'+ritSashHtml(s,d,k)+'</li>';}).join('')
    +(rest.length?'<li>'+ritSashMoreHtml(rest,d)+'</li>':'')+'</ul>'
   /* a day with nothing on it is the house dash, COPY.md Value, and never a
      sentence: seven Nothing on this day lines would be the week's loudest
      text on the emptiest week */
   :'<span class="rv-wd0" aria-label="Nothing set">–</span>';
  /* THE DAY ITSELF IS A PRESS, SV19, his words: "If I select a day of the
     week, I don't [get what I expect]." Measured on main before this: a sash
     opened its ritual's sheet and a heavy day's +N opened the day's list, but
     the weekday and the date, the part a person reads as the day, were a span
     and did nothing, and an empty day was a dash with nothing behind it. So
     the head of every column is a button that opens that day in the sheet,
     the same ritDayOpen the +N uses: every ritual on it, each opening its own
     sheet, or Nothing set. It writes nothing, so it repaints nothing. */
  var dnm=dt.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  return '<li class="rv-wd1'+(d===today?' rv-now':'')+(d<today?' rv-past':'')+'">'
   +'<button type="button" class="rv-wdh" data-act="wday" data-d="'+d+'"'+(d===today?' aria-current="date"':'')
   +' aria-label="'+esc(dnm+(segs.length?', '+segs.length+(segs.length===1?' ritual':' rituals'):', nothing set'))+'">'
   +'<span>'+RIT_WDN[RIT_WCOL[i]]+'</span><b>'+dt.getDate()+'</b></button>'+list+'</li>';}).join('')+'</ol>';
 return '<section class="rv-sec rv-week"><div class="rv-hd"><span class="rv-h">Week</span>'+nav+'</div>'+days
  /* Planned, the word the Record and the thirty days beside it use for the
     same state: the grid this replaced said Set, a second word for one thing
     on one page */
  +'<div class="rv-key" aria-hidden="true"><span><i class="rv-k-cube"></i>Done</span><span><i class="rv-k-cplan"></i>Planned</span>'
  +'<span><i class="rv-k-cmiss"></i>Missed</span></div></section>';}

/* ---------------- a sash ----------------
   THE DAY'S RITUALS ARE SASHES, SV17, 5 November. He looked at the week this
   file drew for SV16 and said it does not look like a calendar, that there is
   too much text, and that nothing leads the eye. The cause was the chip: a
   ritual's full name at 12 pixels, wrapping to five lines in a column ninety
   pixels wide, so every day was a different height and the grid was a wall
   of words. Its padding was 5 by 6, so as a press it also sat under the 44
   pixel floor (atuned-ux, measured floors), which is the other half of why
   it read as text and not as a control.

   So a ritual on a day is one 44 pixel button, filled in its seat colour
   (ritCol, the colour every other drawing of the ritual already wears), with
   the seat's own mark from SEATGLYPH inside it and no word on it. Its name and
   its state are the accessible name and the tooltip, RIT_DAY_SAY's word for
   the state, so the unpack rule is met in the same place without a sentence
   on the screen. A ritual with no seat draws no mark: a generic one would be
   a second name for nothing. The three states are the three the chip had,
   kept by class: done filled, planned outlined on a faint tint, missed
   dashed. The press opens the ritual in the sheet, ritSashSheet below.

   THE CELL IS FIXED. Three sashes and two gaps is the height of every day,
   empty or full, which is what makes seven cells read as a week. */
var RIT_SASH_MAX=3;
/* the state word where the day is already named, a sheet's heading or its
   line: today's is Planned and not Planned for today said under Today */
function ritSashWord(s){return s.st==='plan'?'Planned':RIT_DAY_SAY[s.st];}
function ritSashSeat(s){return ritSeat(s.p||s.x);}
function ritSashGlyph(b){
 return b&&SEATGLYPH[b]?'<svg viewBox="0 0 24 24" aria-hidden="true">'+SEATGLYPH[b]+'</svg>':'';}
function ritSashHtml(s,d,k){
 var say=s.nm+', '+RIT_DAY_SAY[s.st];
 return '<button type="button" class="rv-wch rv-wch-'+s.st+'" data-act="wsash" data-d="'+d+'" data-i="'+k+'" data-nm="'+esc(s.nm)+'"'
  +' style="--c:'+s.col+'" aria-label="'+esc(say)+'" data-tip-t="'+esc(s.nm)+'" data-tip="'+esc(RIT_DAY_SAY[s.st])+'">'
  +ritSashGlyph(ritSashSeat(s))+'</button>';}
/* the rest of a heavy day, one sash that names how many and opens the day's
   list. It carries what it holds for a screen reader, and for the gate, which
   reads a day's rituals off the sashes and has to see these too. */
function ritSashMoreHtml(rest,d){
 var say=rest.map(function(s){return s.nm+', '+RIT_DAY_SAY[s.st];});
 return '<button type="button" class="rv-wch rv-wmore" data-act="wday" data-d="'+d+'"'
  +' data-more="'+esc(rest.map(function(s){return s.nm+'|'+s.st;}).join(';'))+'"'
  +' aria-label="'+esc(rest.length+' more: '+say.join('; '))+'" data-tip-t="'+rest.length+' more" data-tip="'+esc(say.join('. ')+'.')+'">'
  +'+'+rest.length+'</button>';}

/* ---------------- the sheet a sash opens ----------------
   What Due today carried and the tile's line carried, in one place one press
   away, through the product's one sheet (sheetOpen, ui/panels.js) and not a
   second modal. Top to bottom: the ritual's mark and name, with the day and
   its state; the two pole bar, only for a ritual aimed at a real pattern;
   the days kept, as a count, and the days left; each step, what it is and how it is done; then
   Done, Edit and Delete.

   THE BAR IS DRAWN ONLY WHEN THERE IS A REAL OPPOSITE. A release schedule
   carries rel, an address in BY, and that address's cf names the CHILD
   pattern it releases: Anger against Equanimity, read off the person's own
   field by fetBar (ui/component.js), the bar the Insight cascade draws. A
   ritual started from the builder has a seat and no pattern, so it has no
   second pole, and a bar invented for it would be a reading nobody took.
   There is no weekly average bar either, for the same reason: nothing in the
   engine computes a week's pattern.

   THE PLAN BEHIND A SASH. A sash drawn from the record carries the entry and
   not the plan, so the plan is found by its steps, the key the record and
   the plans already share (ritKey). An entry whose plan was deleted has no
   plan, and its sheet offers Delete on the entry and nothing that needs one. */
function ritSashPlan(s,d,st){
 if(s.p)return s.p;
 var k=ritKey(s.x&&s.x.steps), all=st.plans.filter(function(p){return ritKey(p.steps)===k;});
 return all.filter(function(p){return ritCovers(p,d);})[0]||all[0]||null;}
function ritFetIndex(p){
 var n=(p&&p.rel!=null&&BY[p.rel])?BY[p.rel]:null; if(!n||!n.cf)return -1;
 return CHILD.map(function(c){return c.nm;}).indexOf(n.cf);}
function ritSashSheet(s,d,st){
 var today=st.today, p=ritSashPlan(s,d,st), b=ritSashSeat(s), col=s.col;
 var steps=ritSteps({steps:p?p.steps:(s.x&&s.x.steps)});
 var out='<div class="rv-sh" style="--c:'+col+'">'
  +'<div class="rv-shh"><span class="rv-shg">'+ritSashGlyph(b)+'</span>'
  +'<span class="rv-sht"><span class="sh-h plain">'+esc(s.nm)+'</span>'
  +'<span class="rv-shs">'+esc(ritDayName(d,today)+', '+ritSashWord(s).toLowerCase())+'</span></span></div>';
 var ci=ritFetIndex(p);
 if(ci>=0)out+='<div class="rv-shb">'+fetBar(ci,'rvsh-'+ci)+'</div>';
 if(p){var P=ritPct(p,today);
  /* the days kept and, for a ritual with an end, the days left, the one
     count against a span the house allows because it says how much is left
     (CO-05's ruling). Kept of set would be a mark out of seven. */
  var kept=P?P.kept:ritRunRead(p,today).kept;
  out+='<p class="rv-shk">Kept '+acctDays(kept)+(p.days&&ritActive(p,today)?'<span>'+esc(ritLeft(p,today))+'</span>':'')+'</p>';}
 out+=steps.map(function(x){
  return '<div class="rv-step"><b>'+esc(x.nm)+' <small>'+x.min+' min</small></b>'
   +(x.d?'<p class="rv-shd">'+esc(x.d)+'</p>':'')+'<p>'+esc(x.how)+'</p></div>';}).join('');
 /* Done is ritLog's press, which takes today and yesterday and nothing
    older, so the ring is offered on those two days and not on a day it would
    refuse. Edit is for a ritual still running, which is what the builder
    edits. */
 var acts='';
 if(p&&(d===today||d===today-1)&&ritCovers(p,d)){
  var e=ritEntryFor(p,d), on=!!(e&&ritIsDone(e.x));
  acts+='<button type="button" class="btn rv-shdone'+(on?' rv-on':'')+'" data-sh="log" data-id="'+p.id+'" data-d="'+d+'" aria-pressed="'+on+'" aria-label="'
   +esc(on?'Done '+ritDayName(d,today).toLowerCase()+'. Press to take it off':'Mark '+s.nm+' done '+ritDayName(d,today).toLowerCase())+'">'
   +ritRingHtml(p,on,col)+'Done</button>';}
 if(p&&ritActive(p,today))acts+='<button type="button" class="btn" data-sh="edit" data-id="'+p.id+'">'+ritIc('edit')+'Edit</button>';
 if(p)acts+='<button type="button" class="btn" data-sh="del-plan" data-id="'+p.id+'">Delete</button>';
 else if(s.x)acts+='<button type="button" class="btn" data-sh="del-entry" data-i="'+s.i+'">Delete</button>';
 acts+='<button type="button" class="btn rv-shx" data-sh="close">Close</button>';
 return out+'<div class="sh-act rv-sha">'+acts+'</div></div>';}
/* a heavy day's list: every ritual on it, each a row that opens its own sheet */
function ritDaySheet(d,st){
 var segs=ritWeekDay(d,st);
 return '<div class="rv-sh"><div class="rv-shh"><span class="rv-sht"><span class="sh-h plain">'+esc(ritDayName(d,st.today))+'</span></span></div>'
  +(segs.length?'':'<p class="rv-empty">Nothing set.</p>')
  +'<ul class="rv-shl">'+segs.map(function(s,k){
   return '<li><button type="button" class="rv-shr" data-sh="sash" data-d="'+d+'" data-i="'+k+'" style="--c:'+s.col+'">'
    +'<span class="rv-wch rv-wch-'+s.st+'" aria-hidden="true">'+ritSashGlyph(ritSashSeat(s))+'</span>'
    +'<span class="rv-shrn">'+esc(s.nm)+'</span><span class="rv-shs">'+esc(ritSashWord(s))+'</span></button></li>';}).join('')+'</ul>'
  +'<div class="sh-act rv-sha"><button type="button" class="btn rv-shx" data-sh="close">Close</button></div></div>';}
function ritSashOpen(d,i){
 var st=ritRead(), s=ritWeekDay(d,st)[i]; if(!s||typeof sheetOpen!=='function')return false;
 ritCalCss(); sheetOpen(ritSashSheet(s,d,st)); ritSheetWire(); return true;}
function ritDayOpen(d){
 if(typeof sheetOpen!=='function')return false;
 ritCalCss(); sheetOpen(ritDaySheet(d,ritRead())); ritSheetWire(); return true;}
/* a press in the sheet does its one thing through the page's own writers and
   then redraws the sheet from a fresh read, so the ring a person pressed
   shows what the record now holds. A sash is found again by its name: a
   planned day that is marked done becomes a record entry and moves to the
   front of the day, so its place in the list is not its identity. */
function ritSheetWire(){
 var c=document.getElementById('sheet-card'); if(!c)return;
 c.onclick=function(ev){
  var b=ev.target.closest&&ev.target.closest('[data-sh]'); if(!b||!c.contains(b)||b.disabled)return;
  var a=b.getAttribute('data-sh'), id=b.getAttribute('data-id'), d=+b.getAttribute('data-d');
  switch(a){
   case 'log': {var nm=(c.querySelector('.rv-sht .sh-h')||{}).textContent||'';
    ritLog(id,d);
    var st=ritRead(), segs=ritWeekDay(d,st), k=-1;
    segs.forEach(function(s,j){if(k<0&&s.nm===nm)k=j;});
    if(k>=0){c.innerHTML=ritSashSheet(segs[k],d,st); var f=c.querySelector('[data-sh="log"]'); if(f)f.focus();}
    return;}
   case 'edit': sheetShut(); ritEditOpen(id); return;
   case 'del-plan': sheetShut(); RIT.goneAt='record'; ritDelPlan(id); return;
   case 'del-entry': sheetShut(); RIT.goneAt='record'; ritDelEntry(+b.getAttribute('data-i')); return;
   case 'sash': ritSashOpen(d,+b.getAttribute('data-i')); return;
   case 'close': sheetShut(); return;}};}

/* ---------------- today ----------------
   WHAT THE GOALS CARD'S TODAY HELD, UNCHANGED, as a card of its own under the
   week, SV16. He asked for the week and said nothing of the rest, and the
   Active list is the one place a ritual's timer, its steps, Edit, Move up and
   Stop are reached: taking it off with the switch would have left those with
   no route at all. So the rituals, the three affirmations and the three
   challenges keep their markup, and only the card around them is new. */
function ritTodayCardHtml(st,P){
 var M=ritMore();
 return '<section class="rv-sec rv-act rv-goals"><div class="rv-hd"><span class="rv-h">Today</span></div>'
  +'<div class="rv-gblk rv-grits"><div class="rv-gh"><span class="rv-gt">Rituals</span></div>'
  +ritActiveBody(st.act,st.today,P.building)+'</div>'+ritAffHtml(st,M)+ritChalHtml(st,M)+'</section>';}

/* ---------------- success over time ----------------
   His ten spans, in his order. A month is a calendar month back from today,
   so three months is the same date three months ago; a week and the days are
   counted in days. Today is in every span. */
var RIT_RANGES=[{k:'1y',nm:'1 year',m:12},{k:'6m',nm:'6 months',m:6},{k:'3m',nm:'3 months',m:3},
 {k:'2m',nm:'2 months',m:2},{k:'1m',nm:'1 month',m:1},{k:'2w',nm:'2 weeks',d:14},{k:'1w',nm:'1 week',d:7},
 {k:'5d',nm:'5 days',d:5},{k:'3d',nm:'3 days',d:3},{k:'1d',nm:'1 day',d:1}];
function ritRange(k){for(var i=0;i<RIT_RANGES.length;i++)if(RIT_RANGES[i].k===k)return RIT_RANGES[i]; return RIT_RANGES[4];}
function ritRangeStart(R,today){
 if(R.d)return today-R.d+1;
 var t=ritDateOf(today); return pracDay(new Date(t.getFullYear(),t.getMonth()-R.m,t.getDate(),12))+1;}
/* the first day anything was on the practice record: an entry, or a plan's
   start. Null when there is nothing. */
function ritRecordStart(st){
 var m=null;
 ((CURP&&CURP.rituals)||[]).forEach(function(x){var d=x&&pracDay(x.t); if(d!==null&&d!==undefined&&(m===null||d<m))m=d;});
 st.plans.forEach(function(p){var d=ritStart0(p); if(d!==null&&(m===null||d<m))m=d;});
 return m;}
function ritSpanRead(st,R){
 var today=st.today, t0=ritRangeStart(R,today), rs=ritRecordStart(st), M=ritMore(), days=[];
 var kept=0, missed=0, mins=0, seat={};
 for(var d=t0;d<=today;d++){
  var X={d:d, pre:(rs===null||d<rs), done:[], miss:[], plan:[]}, seen={};
  if(!X.pre)ritDaySegs(d,st.plans,today).forEach(function(s){
   var k=s.st+'|'+s.nm; if(seen[k])return; seen[k]=1;
   if(s.st==='done'){X.done.push(s); var b=s.x&&s.x.band; if(b)(seat[b]=seat[b]||{})[d]=1; else (seat['']=seat['']||{})[d]=1;}
   else if(s.st==='miss')X.miss.push(s); else if(s.st==='plan')X.plan.push(s);});
  X.st=X.pre?'pre':X.done.length?'done':X.plan.length?'plan':X.miss.length?'miss':'none';
  if(X.st==='done')kept++; if(X.st==='miss')missed++;
  days.push(X);}
 ((CURP&&CURP.rituals)||[]).forEach(function(x){if(!x||!ritIsDone(x))return; var d=pracDay(x.t); if(d!==null&&d>=t0&&d<=today)mins+=(+x.min||0);});
 var md=(typeof markDays==='function')?markDays(CURP,Date.now()):{};
 var marks=(st.L.earned||[]).filter(function(m){var d=md[m.k]; return d!=null&&d>=t0&&d<=today;});
 var said={}; M.said.forEach(function(x){if(x[0]>=t0&&x[0]<=today)said[x[0]]=1;});
 var did=M.did.filter(function(x){return x[0]>=t0&&x[0]<=today;}).length;
 var h=ritSnapBefore(new Date(ritDateOf(t0).getTime()-12*3600000).toISOString());
 var bars=BANDS.slice().reverse().concat(['']).filter(function(b){return seat[b];})
  .map(function(b){return {b:b, n:Object.keys(seat[b]).length};});
 return {R:R, t0:t0, today:today, n:today-t0+1, rs:rs, days:days, kept:kept, missed:missed, mins:mins, marks:marks,
  said:Object.keys(said).length, did:did, then:(h&&typeof h.loaded==='number')?h.loaded:null, now:(st.r.loaded||[]).length, bars:bars};}
function ritSpanCell(X,today,small){
 var c=(X.done[0]||X.plan[0]||X.miss[0]||{}).col||'var(--accent)', bg='';
 if(X.done.length>1){var w=100/X.done.length;
  bg=';background:linear-gradient(90deg,'+X.done.map(function(s,k){return s.col+' '+(k*w).toFixed(1)+'% '+((k+1)*w).toFixed(1)+'%';}).join(',')+')';}
 var nm=function(a){return a.map(function(s){return s.nm;}).join(', ');};
 var said=X.pre?'Before your record starts.':([X.done.length?'Done: '+nm(X.done)+'.':'', X.plan.length?'Set: '+nm(X.plan)+'.':'',
  X.miss.length?'Missed: '+nm(X.miss)+'.':''].filter(Boolean).join(' ')||'Nothing was set for this day.');
 var day=ritDayName(X.d,today);
 return {c:c, bg:bg, tip:small?'':rvTip(day,said)+' aria-label="'+esc(day+'. '+said)+'"'};}
function ritSpanGrid(S){
 var today=S.today, wide=S.n>62, pad=ritWc(S.t0), out='';
 if(!wide){
  out='<div class="rv-scal" role="group" aria-label="'+esc(S.R.nm)+', a day to a square">'
   +RIT_WCOL.map(function(w){return '<span class="rv-scw" aria-hidden="true">'+RIT_WD[w]+'</span>';}).join('');
  S.days.forEach(function(X,i){var k=pad+i, Q=ritSpanCell(X,today,S.n>31), dt=ritDateOf(X.d);
   out+='<span class="rv-sc rv-sc-'+X.st+(X.d===today?' rv-now':'')+'" style="grid-row:'+(Math.floor(k/7)+2)+';grid-column:'+(k%7+1)
    +';--c:'+Q.c+Q.bg+'"'+(S.n>31?' aria-hidden="true"':Q.tip)+'><b>'+(dt.getDate()===1?dt.toLocaleDateString('en-GB',{month:'short'})+' ':'')+dt.getDate()+'</b></span>';});
  return out+'</div>';}
 /* a year is weeks as columns, Sunday at the top (SV24), the way a wall planner
    folds a year onto one sheet. One picture and not 365 presses: the
    figures beside it are the read, and the grid is described once. */
 var cols=Math.floor((pad+S.n-1)/7)+1, mon='', lastM=-1;
 for(var w=0;w<cols;w++){var d=S.t0-pad+w*7, dt=ritDateOf(Math.max(d,S.t0));
  if(dt.getMonth()!==lastM){lastM=dt.getMonth(); mon+='<span class="rv-sym" style="grid-column:'+(w+2)+'">'+dt.toLocaleDateString('en-GB',{month:'short'})+'</span>';}}
 out='<div class="rv-syr" role="img" style="--cols:'+cols+'" aria-label="'+esc(S.R.nm+': '+acctDays(S.kept)+' kept and '+S.missed+' missed, a square a day, a column a week.')+'">'+mon
  +['','M','','W','','F',''].map(function(w,i){return '<span class="rv-syw" style="grid-row:'+(i+2)+'">'+w+'</span>';}).join('');
 S.days.forEach(function(X,i){var k=pad+i, Q=ritSpanCell(X,today,true);
  out+='<i class="rv-sc rv-sc-'+X.st+(X.d===today?' rv-now':'')+'" style="grid-column:'+(Math.floor(k/7)+2)+';grid-row:'+(k%7+2)+';--c:'+Q.c+Q.bg+'"></i>';});
 return out+'</div>';}
function ritSuccessHtml(st,chain){
 var R=ritRange(RIT.span), S=ritSpanRead(st,R);
 var seg='<div class="rv-rg" role="group" aria-label="Span">'+RIT_RANGES.map(function(x){var on=x.k===R.k;
  return '<button type="button" class="rv-rgb'+(on?' rv-on':'')+'" data-act="rng" data-v="'+x.k+'" aria-pressed="'+on+'">'+x.nm+'</button>';}).join('')+'</div>';
 var fig=function(n,u,lb){return '<div class="rv-fig"><b>'+(n?n+(u?'<small> '+u+'</small>':''):'–')+'</b><span>'+lb+'</span></div>';};
 var note='';
 /* THE HONEST PART. A span that reaches back before the record does not
    pretend the record was empty there: those days are drawn as a blank of
    their own, said to be blank, and never counted as missed. */
 if(S.rs===null)note='<p class="rv-sparse">Nothing on your record yet. This fills in, a day at a time, as you keep rituals.</p>';
 /* A SPAN THAT REACHES BACK BEFORE THE RECORD said so in a paragraph, and
    it is cut, SV19, on his ruling against third tier text: the days before
    the record are drawn hatched, and the key under the grid names the hatch
    Before your record, so the picture and its key already say it. None of
    them is counted as missed, which is the honest part, and that is the
    arithmetic in ritSpanRead and not a sentence. */
 var extra=[S.said?'Affirmations said on '+acctDays(S.said)+'.':'', S.did?'Challenges done '+S.did+(S.did===1?' time.':' times.'):'']
  .filter(Boolean).join(' ');
 /* and with no reading before the span the line says nothing, SV19: a
    sentence about a comparison that cannot be made is the third tier line */
 var held=S.then===null?''
  :'<p class="rv-okf rv-shel">Held places: '+S.then+' at the start of this span, '+S.now+' now. A reading is taken each time you commit a story or finish a release.</p>';
 var top=Math.max.apply(null,S.bars.map(function(x){return x.n;}).concat([1]));
 var bars=!S.bars.length?'':'<div class="rv-ana1"><span class="rv-lb">Kept by seat, '+esc(R.nm)+'</span><ul class="rv-sbars">'
  +S.bars.map(function(x){
   return '<li style="--c:'+(x.b?seatCol(x.b):'var(--dim)')+'"><span class="rv-sbn">'+esc(x.b?ritTagNm(x.b):'No seat')+'</span>'
    +'<span class="rv-sbt"><i style="width:'+(100*x.n/top).toFixed(1)+'%"></i></span><span class="rv-sbv">'+acctDays(x.n)+'</span></li>';}).join('')+'</ul></div>';
 return '<section class="rv-sec rv-c rv-c-ana"><div class="rv-hd"><span class="rv-h">Success over time</span></div>'
  +'<p class="rv-mean">What you kept, over the span you pick, from a year down to today. Every figure is a count of days or minutes off your record, never a grade.</p>'
  +chain+seg+'<div class="rv-figs rv-sfigs">'+fig(S.kept,S.kept===1?'day':'days','Kept')+fig(S.missed,S.missed===1?'day':'days','Missed')
  +fig(S.mins,'min','Practised')+fig(S.marks.length,'','Marks earned')+'</div>'
  +(extra?'<p class="rv-okf rv-sext">'+esc(extra)+'</p>':'')+note+ritSpanGrid(S)
  +'<div class="rv-key" aria-hidden="true"><span><i class="rv-k-cube"></i>Kept</span><span><i class="rv-k-cmiss"></i>Missed</span>'
  +'<span><i class="rv-k-pre"></i>Before your record</span></div>'+held+bars+'</section>';}

function ritCalCss(){
 if(document.getElementById('ritcal-css'))return;
 var st=document.createElement('style'); st.id='ritcal-css';
 st.textContent=[
  /* the goals */
  '.rv-goals>.rv-hd{flex-wrap:wrap}',
  '.rv-goals .rv-seg{margin:0}',
  '.rv-gblk{margin:14px 0 0;padding-top:12px;border-top:1px solid color-mix(in srgb,var(--k) 22%,var(--edge))}',
  '.rv-gblk:first-of-type{margin-top:4px}',
  '.rv-gh{display:flex;flex-direction:column;gap:2px;margin:0 0 8px}',
  '.rv-gt{font-size:14.5px;font-weight:600;color:var(--ink)}',
  '.rv-afl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-af1{display:flex;align-items:center;gap:6px;border-radius:12px;background:color-mix(in srgb,var(--c) 6%,var(--panel-2));',
  ' border:1px solid color-mix(in srgb,var(--c) 26%,var(--edge));box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-af1.rv-on{border-color:color-mix(in srgb,var(--c) 60%,transparent)}',
  '.rv-aft{display:flex;flex-direction:column;gap:3px;flex:1 1 auto;min-width:0;padding:9px 12px 9px 2px}',
  '.rv-afq{font-size:15.5px;line-height:1.45;color:var(--ink)}',
  '.rv-chn{font-size:14px;font-weight:600;color:var(--c)}',
  '.rv-chn small{font-weight:400;color:var(--mid);font-size:13px}',
  '.rv-ch1 .rv-afq{font-size:15px}',
  /* THE WEEK, SV16. Seven day columns, and each day is a column a person reads
     down: the weekday and the date, then that day's rituals. Under 640 of
     stage, a phone, seven named columns are seventy pixels each and a ritual's
     name would wrap to one word a line, so each day becomes a row instead, the
     date at the left and its rituals beside it: the same seven days, read down
     the page instead of across it. */
  '.rv-week{--k:var(--sec-flow);border-color:color-mix(in srgb,var(--k) 38%,transparent);background:color-mix(in srgb,var(--k) 6%,var(--panel))}',
  '.rv-week>.rv-hd{flex-wrap:wrap}',
  '.rv-wkn{display:flex;align-items:center;gap:4px;flex-wrap:wrap}',
  '.rv-wkr{min-width:9.5em;text-align:center;font-size:14px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-wk0{min-height:44px;margin-left:4px}',
  '.rv-wkg{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}',
  /* THE CELL IS FIXED, SV17: the date, then a body three sashes tall whether
     the day carries none, one or three, so seven cells are one grid */
  /* THE DAY TAG IS INVERTED, SV24, his words: "Days of the week ... they're
     not legible, make those tags at the very top stand out, same with the
     date" and "instead of it being a lighter gray background, for each day
     of the week, invert the color." Measured before this on Ana at 1600: the
     cell was a one percent white wash over the card, about rgb(31,42,49), the
     weekday --dim at 12 pixels, near 4.4 to 1 against it and under the 4.5
     floor the --dim token itself was raised to meet, and the date --mid. So
     the grey wash leaves the cell, and the head of each column becomes a
     solid tag in --ink with --bg type, the same two tokens the page's text
     and ground already are, the other way round: about 17 to 1 in Dark, and
     the light themes invert themselves with no second rule. */
  '.rv-wd1{display:grid;grid-template-rows:auto calc(3 * 44px + 2 * 6px);gap:6px;min-width:0;padding:6px 5px 8px;border-radius:10px;',
  ' background:none}',
  '.rv-wd1.rv-past{background:none;box-shadow:none}',
  /* today is ringed the way a wall calendar rings a day, round RB's rule for
     the grid this replaces, and its date sits in the accent chip */
  '.rv-wd1.rv-now{box-shadow:inset 0 0 0 1.5px var(--accent);background:color-mix(in srgb,var(--accent) 7%,transparent)}',
  '.rv-wdh{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;width:100%;min-height:44px;padding:4px 0;',
  ' border:0;border-radius:8px;background:var(--ink);font:inherit;font-size:13px;font-weight:600;color:var(--bg);cursor:pointer}',
  '.rv-wdh:hover{background:color-mix(in srgb,var(--ink) 84%,var(--bg))}',
  '.rv-wdh:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-wdh b{font-size:15px;font-weight:700;color:var(--bg);font-variant-numeric:tabular-nums}',
  /* today keeps its two marks: the accent ring round the column, and now the
     whole tag in the accent, where before only the date sat in an accent
     chip. A chip inside a solid tag would be a fill on a fill. */
  '.rv-wd1.rv-now .rv-wdh,.rv-wd1.rv-now .rv-wdh b{background:var(--accent);color:var(--on-accent)}',
  '.rv-wd1.rv-now .rv-wdh:hover{background:color-mix(in srgb,var(--accent) 84%,var(--bg))}',
  '.rv-wd1.rv-now .rv-wdh:hover b{background:none}',
  '.rv-wdl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;min-width:0}',
  '.rv-wdl>li{display:block;min-width:0}',
  /* the stagger, 6 pixels a sash, so three on a day read as a stack laid
     down and not as three rows of a table. Desktop only: under 640 a day is
     a row and the sashes sit side by side, where a step would mean nothing. */
  '.rv-wdl>li:nth-child(2){--o:6px} .rv-wdl>li:nth-child(3){--o:12px}',
  /* A SASH. 44 by 44 at the least, the tap floor; done is filled in its seat
     colour, planned is the faint tint outlined in it, missed is the dashed
     edge the Record and the thirty days use for a miss, so the three read the
     same on every calendar here. The dash is a border and not an outline, so
     the keyboard ring has the outline to itself. */
  '.rv-wch{box-sizing:border-box;display:grid;place-items:center;width:calc(100% - var(--o,0px));min-width:44px;height:44px;min-height:44px;',
  ' margin:0 0 0 var(--o,0px);padding:0;border:0;border-radius:9px;font:inherit;cursor:pointer;color:var(--c);',
  ' background:color-mix(in srgb,var(--c) 12%,transparent);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--c) 70%,transparent);',
  ' transition:opacity var(--t-micro) var(--ease-out),transform var(--t-micro) var(--ease-out)}',
  '.rv-wch svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-wch-done{background:var(--c);color:rgba(0,0,0,.78);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.28),inset 0 -3px 0 rgba(0,0,0,.28)}',
  '.rv-wch-miss{background:none;box-shadow:none;border:1.5px dashed var(--dim);color:var(--dim)}',
  '.rv-wmore{background:color-mix(in srgb,var(--edge-2) 18%,transparent);box-shadow:inset 0 0 0 1.5px var(--edge-2);color:var(--ink);font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}',
  'button.rv-wch:hover{transform:translateY(-1px)}',
  'button.rv-wch:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  /* THE EYE LANDS ON TODAY, SV17. On the week that holds today every other
     day's sashes sit back, so the one column at full strength is the one a
     person came to press; a hover or a focus brings any of them forward. On a
     week cycled away nothing is today and nothing sits back. */
  '.rv-wkg-now .rv-wd1:not(.rv-now) .rv-wch{opacity:.5}',
  '.rv-wkg-now .rv-wd1:not(.rv-now) .rv-wch:hover,.rv-wkg-now .rv-wd1:not(.rv-now) .rv-wch:focus-visible{opacity:1}',
  '.rv-wd0{align-self:center;justify-self:center;color:var(--dim);font-size:14px}',
  '@container (max-width:639px){.rv .rv-wkg{grid-template-columns:minmax(0,1fr);gap:5px}',
  /* a row is one sash tall and padded. Today's date chip, which was drawn a
     size smaller here because at 26 it made today's row three pixels taller
     than the other six, went with SV24: the whole tag is today's mark now,
     the same size as the other six. */
  ' .rv .rv-wd1{box-sizing:border-box;height:56px;grid-template-rows:none;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:10px;padding:6px 10px}',
  ' .rv .rv-wdh{flex-direction:column}',
  ' .rv .rv-wdl{flex-direction:row;height:44px}',
  ' .rv .rv-wdl>li{flex:1 1 0;max-width:120px;--o:0px}',
  ' .rv .rv-wd0{justify-self:start;margin:0}}',
  /* the sheet a sash opens, inside the product's one sheet */
  '.rv-sh{display:flex;flex-direction:column;gap:12px;text-align:left}',
  '.rv-shh{display:flex;align-items:center;gap:12px}',
  '.rv-shg{flex:0 0 44px;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;color:var(--c);',
  ' background:color-mix(in srgb,var(--c) 16%,transparent);box-shadow:inset 0 0 0 1.5px var(--c)}',
  '.rv-shg svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-shg:empty{display:none}',
  '.rv-sht{display:flex;flex-direction:column;gap:2px;min-width:0}',
  '.rv-sht .sh-h{margin:0}',
  '.rv-shs{font-size:13px;color:var(--mid)}',
  /* the bar's own layout lives under .fdock in shell/head.html and does not
     reach a sheet, so the same frame and its tap floor are given here */
  '.rv-shb .rb2{position:relative;display:block;width:100%;min-width:0;min-height:var(--tap);padding:6px 2px 8px;white-space:nowrap;text-align:left}',
  '.rv-shk{display:flex;flex-wrap:wrap;gap:4px 12px;margin:0;font-size:14.5px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.rv-shk span{font-weight:400;color:var(--mid)}',
  '.rv-sh .rv-step{margin:0}',
  '.rv-sh .rv-step b{display:block;font-size:14.5px;color:var(--ink)}',
  '.rv-sh .rv-step b small{font-weight:400;color:var(--mid)}',
  '.rv-sh .rv-step p{margin:4px 0 0;font-size:14px;line-height:1.5;color:var(--mid)}',
  '.rv-sh .rv-step p.rv-shd{color:var(--ink)}',
  '.rv-sha{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 0}',
  '.rv-sha .btn{min-height:44px;display:inline-flex;align-items:center;gap:6px}',
  '.rv-shdone svg{width:28px;height:28px;margin-left:-4px}',
  '.rv-shx{margin-left:auto}',
  '.rv-shl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
  '.rv-shr{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:4px 10px 4px 4px;border:1px solid var(--edge);border-radius:12px;',
  ' background:none;color:var(--ink);font:inherit;text-align:left;cursor:pointer}',
  '.rv-shr:hover{border-color:var(--accent)}',
  '.rv-shr:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-shr .rv-wch{flex:0 0 44px;width:44px;cursor:inherit}',
  '.rv-shrn{flex:1 1 auto;min-width:0;font-size:15px}',
  /* More practices keeps its one label; the chevron turns when it is open */
  '.rv-more-t{display:flex;align-items:center;justify-content:space-between;gap:8px}',
  '.rv-more-t .rv-ic{transition:transform var(--t-micro) var(--ease-out)}',
  '.rv-more-t[aria-expanded="true"] .rv-ic{transform:rotate(180deg)}',
  /* success over time */
  '.rv-rg{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}',
  '.rv-rgb{min-height:44px;padding:0 12px;border-radius:999px;border:1px solid var(--edge-2);background:none;color:var(--mid);font:inherit;font-size:13.5px;cursor:pointer;white-space:nowrap}',
  '.rv-rgb:hover{color:var(--ink);border-color:var(--k)}',
  '.rv-rgb.rv-on{background:var(--k);border-color:var(--k);color:var(--on-accent);font-weight:600}',
  '.rv-rgb:focus-visible,.rv-sc:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-c-ana .rv-fig{--k:var(--sec-discover)}',
  '.rv-sfigs{margin:0 0 10px}',
  '.rv-sext{margin:0 0 10px}',
  '.rv-sparse{margin:0 0 10px;padding:8px 12px;border-radius:10px;font-size:13.5px;line-height:1.5;color:var(--ink);',
  ' background:color-mix(in srgb,var(--edge-2) 16%,transparent);border-left:3px solid var(--edge-2)}',
  '.rv-scal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;max-width:460px;margin:0 0 6px}',
  '.rv-scw{grid-row:1;text-align:center;font-size:12px;color:var(--dim)}',
  '.rv-sc{position:relative;display:block;aspect-ratio:1/1;border-radius:7px;background:color-mix(in srgb,var(--edge-2) 26%,transparent);font-style:normal}',
  '.rv-sc b{position:absolute;left:5px;top:3px;font-size:12px;font-weight:600;color:var(--mid);font-variant-numeric:tabular-nums;white-space:nowrap}',
  '.rv-sc-done{background:var(--c);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.28),inset 0 -4px 0 rgba(0,0,0,.30)}',
  '.rv-sc-done b{color:rgba(0,0,0,.66)}',
  '.rv-sc-plan{background:color-mix(in srgb,var(--c) 12%,transparent);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--c) 70%,transparent)}',
  '.rv-sc-miss{background:none;outline:1.5px dashed var(--dim);outline-offset:-1.5px}',
  '.rv-sc-pre{background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--edge-2) 30%,transparent) 0 2px,transparent 2px 6px)}',
  '.rv-sc-pre b{color:var(--dim)}',
  '.rv-scal .rv-sc{cursor:help}',
  '.rv-scal .rv-sc[aria-hidden]{cursor:default}',
  '.rv-sc.rv-now{box-shadow:0 0 0 2px var(--ink)}',
  /* a square is at most 16 pixels: three months is fourteen columns, and at
     a full fraction each its squares were 46 pixels, a wall of colour rather
     than a planner page. A year at 1600 still fills the card. */
  '.rv-syr{display:grid;grid-template-columns:14px repeat(var(--cols),minmax(0,16px));grid-auto-rows:auto;gap:2px;margin:0 0 6px}',
  '.rv-syr .rv-sc{border-radius:2px}',
  '.rv-syr .rv-sc-miss{outline-width:1px;outline-offset:-1px}',
  '.rv-syr .rv-sc.rv-now{box-shadow:0 0 0 1.5px var(--ink)}',
  '.rv-sym{grid-row:1;font-size:12px;color:var(--dim);white-space:nowrap;overflow:visible}',
  '.rv-syw{grid-column:1;font-size:12px;line-height:1;color:var(--dim);align-self:center}',
  '.rv-shel{margin:10px 0 12px}',
  /* the left column: what it is, what it is for, your record, three answers */
  '.rv-sgd{margin:4px 0 0;font-size:13.5px;line-height:1.45;color:var(--ink)}',
  '.rv-sgo{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0 0}',
  '.rv-sgc{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:2px 10px 2px 8px;border-radius:999px;font-size:12.5px;color:var(--ink);',
  ' background:color-mix(in srgb,var(--c) 12%,transparent);border:1px solid color-mix(in srgb,var(--c) 35%,transparent);cursor:help}',
  '.rv-sgc svg{width:13px;height:13px;fill:none;stroke:var(--c);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}',
  '.rv-sgc.rv-sgc0{background:none;border-style:dashed;color:var(--mid)}',
  '.rv-sgc:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-sgrec{margin:6px 0 0;padding:0;list-style:none;font-size:13px;line-height:1.5;color:var(--mid)}',
  '.rv-sga{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
  '.rv-sga .btn{min-height:44px}',
  /* Add to practice no longer grows to fill the row, SV19: grown, it pushed
     Dismiss onto a second line of its own under the other two, measured at
     1600 on every card, which was the misalignment he named */
  '.rv-sgq{background:none;border-color:transparent;color:var(--mid)}',
  /* the three answers on one row, SV19: measured, the three summed to 305.4
     pixels in a 306 pixel row at 1600, so Dismiss wrapped to a line of its
     own. It is the quiet one, text only, so it gives back its padding and
     sits at the row's right end, where a dismiss is looked for */
  '.rv-sga .rv-sgq{padding-left:8px;padding-right:8px;margin-left:auto}',
  '.rv-sgq:hover{color:var(--ink)}',
  '.rv-sgfoot{display:flex;justify-content:flex-end;margin-top:8px}',
  '.rv-saved{--k:var(--accent)}',
  '.rv-svl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-sv1{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;border-radius:12px;',
  ' background:color-mix(in srgb,var(--c) 8%,var(--panel-2));border:1px solid color-mix(in srgb,var(--c) 35%,var(--edge))}',
  '.rv-svt{display:flex;flex-direction:column;min-width:0}',
  '.rv-sva{display:flex;gap:6px}',
  /* the thirty days, as a calendar: weekday letters, the date in each cube,
     and the rest of this week ahead */
  '.rv-cbw{grid-row:1;text-align:center;font-size:12px;color:var(--dim)}',
  '.rv-cbd{position:absolute;left:5px;top:3px;font-size:12px;font-weight:600;font-style:normal;color:var(--mid);font-variant-numeric:tabular-nums;pointer-events:none}',
  '.rv-cb-done .rv-cbd{color:rgba(0,0,0,.66)}',
  '.rv-cb-ahead{background:none;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--edge-2) 55%,transparent)}',
  '.rv-cb-ahead.rv-cb-set{background:color-mix(in srgb,var(--c) 10%,transparent);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--c) 60%,transparent)}',
  '.rv-cbp{aspect-ratio:1/1}',
  /* ---- FLAT COLOUR ON EVERY CARD, SV19 ----
     His words: "I asked for more flat color on the cards." SV16 made the
     Called for cards one opaque fill of their seat with nothing outlined, the
     Punch lighting's idiom, and this carries the same treatment to every card
     and row on the page that still had the older three: an outline in the
     card's colour, a five percent wash, and an inset stripe or a bevel. Each
     is now one opaque fill of its colour into the panel and no edge. Opaque
     on purpose, as SV16 recorded, so the still layer behind the stage does
     not show through and make a gradient of the card. State grammar is kept,
     because it is information and not decoration: planned is still an
     outline and missed is still dashed, on the week, the cubes and the key.
     Last in the last sheet the page injects (ritCss, ritStageCss, then this),
     so it wins at equal weight without an important. */
  '.rv .rv-sec,.rvr .rv-sec{border-color:transparent;background:color-mix(in srgb,var(--k) 9%,var(--panel))}',
  '.rv-c-ana .rv-fig,.rv-fig{border-color:transparent;background:color-mix(in srgb,var(--k) 14%,var(--panel))}',
  '.rv-item,.rv-af1,.rv-ok1,.rv-kp1,.rv-hc,.rv-sv1{border-color:transparent;box-shadow:none;background:color-mix(in srgb,var(--c) 13%,var(--panel-2))}',
  '.rv-item.rv-done,.rv-af1.rv-on{border-color:transparent;background:color-mix(in srgb,var(--c) 24%,var(--panel-2))}',
  '.rv-why,.rv-nxm{border-color:transparent;background:color-mix(in srgb,var(--c) 14%,var(--panel))}',
  '.rv-nxi{border:0;background:color-mix(in srgb,var(--c) 22%,var(--panel))}',
  '.rv-cb-done,.rv-wch-done,.rv-sc-done{box-shadow:none}',
  '.rv-key .rv-k-cube{box-shadow:none}',
  '.rv-wd1.rv-past{box-shadow:none;background:none}',
  '.rv-gone{background:color-mix(in srgb,var(--accent) 12%,var(--panel-2))}',
  /* History, the right menu's one press, SV19: the More practices press's own
     look, a full width row with its chevron, and its panel under it.
     A BUTTON, SV24, his words: "For the history make it a button." It was
     one, a button element, and it did not look like one: rit-more draws no
     fill, a dashed edge and --dim type, and on this page a dashed edge is
     how a missed day is drawn, so it read as an empty slot with a word in it.
     It now wears .btn's own surface (shell/head.html): --panel-2, a solid
     --edge, --ink type, the pill, and --sunk under a hover. No new look is
     made for it. It keeps its width and its chevron, which carries open and
     shut. Practices in the builder keeps the dashed row, because he asked
     this of History only. */
  '.rv-histt{margin:0 0 var(--rv-gap,14px);padding:9px 17px;background:var(--panel-2);border:1px solid var(--edge);border-style:solid;border-radius:999px;',
  ' color:var(--ink);font-size:14px;font-weight:500}',
  '.rv-histt:hover{background:var(--sunk);border-color:var(--edge-2);color:var(--ink)}',
  '.rv-histp>.rv-sec:last-child{margin-bottom:0}'
 ].join('\n');
 document.head.appendChild(st);}
