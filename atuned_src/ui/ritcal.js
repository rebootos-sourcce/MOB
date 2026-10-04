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
                    and three challenges. This week is a calendar week, Monday
                    first, one row per active ritual, so a ritual set for
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
/* THE CENTRE OPENS ON THE WEEK, round RB. His words: "The center area of the
   ritual does not look like a calendar of what's running this week. It
   should." The week was built in round QX and was there, one press away,
   behind a Today that opened first and drew the same rings the right column's
   Due today already draws. So the week is what the centre opens on whenever
   something is running, and Today and This month stay one press away. With
   nothing running there is no week to draw, so it opens on Today, which
   carries the one press that starts a ritual. null is no choice made yet; a
   press on a view is a choice and is kept. */
RIT.gview=null;
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
  'Saved for later. '+x.p.nm+' waits under Saved for later until you add it.');}
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
 return ritMoreWrite(function(m){m.gone=[];},'Every dismissed suggestion is back on the list.');}
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
  'Removed from Saved for later.');}

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

/* ---------------- the saved shelf ---------------- */
function ritSavedHtml(){
 var m=ritMore(); if(!m.save.length)return '';
 return '<div class="rv-sec rv-saved"><div class="rv-hd"><span class="rv-h">Saved for later</span></div>'
  +'<p class="rv-mean">Suggestions you kept without starting. Add one when you are ready; it runs each day for a week.</p>'
  +'<ul class="rv-svl">'+m.save.map(function(s,i){var p=ritPr(s.k), col=s.b?seatCol(s.b):'var(--accent)';
   return '<li class="rv-sv1" style="--c:'+col+'"><span class="rv-svt"><span class="rv-sgn">'+esc(p.nm)+'</span>'
    +'<span class="rv-sgm">'+p.min+' min'+(s.rel!=null&&BY[s.rel]?', for '+esc(String(BY[s.rel].k).toLowerCase()):'')+'</span></span>'
    +'<span class="rv-sva"><button type="button" class="btn" data-act="sv-rm" data-i="'+i+'" aria-label="Remove '+esc(p.nm)+' from Saved for later">Remove</button>'
    +'<button type="button" class="btn pri" data-act="sv-add" data-i="'+i+'" aria-label="Add '+esc(p.nm)+' to daily practice">Add</button></span></li>';}).join('')
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
  out.push({id:'av:'+ritHash(be), line:be, b:b||'', own:true,
   from:'Your own avatar line'+(b?', at '+ritThe(b):'')+'.'});}
 ritHeld().forEach(function(n){
  if(out.length>=3||!n.cf||cfs[n.cf]||!AFFIRM[n.cf])return; cfs[n.cf]=1;
  var c=CHILD.filter(function(f){return f.nm===n.cf;})[0]; if(!c)return;
  out.push({id:'ax:'+n.cf, line:AFFIRM[n.cf], b:n.b,
   from:'Toward '+c.opp.toLowerCase()+'. You hold '+String(n.k).toLowerCase()+' at '+ritThe(n.b)+', and it runs on '+ritCfWord(n.cf)+'.'});});
 AFFIRM_START.forEach(function(cf){
  if(out.length>=3||cfs[cf])return; cfs[cf]=1;
  var c=CHILD.filter(function(f){return f.nm===cf;})[0]; if(!c)return;
  out.push({id:'ax:'+cf, line:AFFIRM[cf], b:c.seat,
   from:(st.r.unread?'Nothing is read yet':'Nothing else is held at four or more')+', so this starts toward '+c.opp.toLowerCase()+', near the ground.'});});
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
   +'<span class="rv-aft"><span class="rv-afq">'+(a.own?'"'+esc(a.line)+'"':esc(a.line))+'</span><span class="rv-afs">'+esc(a.from)+'</span></span></li>';}).join('')+'</ul>';
 return '<div class="rv-gblk rv-aff"><div class="rv-gh"><span class="rv-gt">Affirmations</span>'
  +'<span class="rv-gs">Say each one out loud, once today, and press its ring.</span></div>'+body+'</div>';}
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
   +'<span class="rv-aft"><span class="rv-chn">'+esc(c.nm)+'<small>, '+esc(c.who)+'</small></span>'
   +'<span class="rv-afq">'+esc(c.act)+'</span><span class="rv-afs">'+esc(c.when)+'</span></span></li>';}).join('')+'</ul>';
 /* fewer than three is said, never padded with a challenge nothing points to */
 if(C.length&&C.length<3)body+='<p class="rv-afs rv-few">'+(C.length===1?'One pattern':'Two patterns')
  +' in your reading have a challenge, so '+(C.length===1?'one is':'two are')+' shown. More come as your stories show more.</p>';
 return '<div class="rv-gblk rv-chal"><div class="rv-gh"><span class="rv-gt">Challenges</span>'
  +'<span class="rv-gs">One small act against each pattern running heaviest in you. Press its ring once you have done it today.</span></div>'+body+'</div>';}

/* ---------------- the goals ---------------- */
var RIT_GVIEW=[['today','Today'],['week','This week'],['month','This month']];
function ritGoalsHtml(st,P){
 var v=RIT.gview; if(!RIT_GVIEW.some(function(x){return x[0]===v;}))v=st.act.length?'week':'today';
 var M=ritMore(), body;
 if(v==='week')body=ritWeekHtml(st,M);
 else if(v==='month')body=ritMonthHtml(st,M);
 else body='<div class="rv-gblk rv-grits"><div class="rv-gh"><span class="rv-gt">Rituals</span></div>'
  +ritActiveBody(st.act,st.today,P.building)+'</div>'+ritAffHtml(st,M)+ritChalHtml(st,M);
 return '<section class="rv-sec rv-act rv-goals"><div class="rv-hd"><span class="rv-h">Goals</span>'
  +'<div class="rv-seg" role="group" aria-label="Goals for">'+RIT_GVIEW.map(function(x){var on=x[0]===v;
   return '<button type="button" class="rv-sg'+(on?' rv-on':'')+'" data-act="gview" data-v="'+x[0]+'" aria-pressed="'+on+'">'+x[1]+'</button>';}).join('')
  +'</div></div>'
  +'<p class="rv-mean">What you set yourself, by the day, the week and the month. Today is what to press now: your rituals, three affirmations and three challenges.</p>'
  +body+'</section>';}
/* the date of a day key, at local noon, so the number printed is the day the
   person lived and not the one UTC is on */
function ritDateOf(d){var off=new Date().getTimezoneOffset()*60000; return new Date(d*DAY_MS+off+12*3600000);}
/* one ritual on one day, the week's cell: the record first, then the plan */
function ritCellSt(p,d,today){
 if(!ritCovers(p,d)){var e0=ritEntryFor(p,d); return e0&&ritIsDone(e0.x)?'done':'off';}
 var e=ritEntryFor(p,d);
 if(e&&ritIsDone(e.x))return 'done';
 return d<today?'miss':(d===today?'plan':'ahead');}
var RIT_CELL_SAY={done:'Done', miss:'Missed', plan:'Set for today', ahead:'Set', off:'Not set for this day', none:'Nothing yet'};
function ritWeekHtml(st,M){
 var today=st.today, mon=today-ritWd(today), days=[0,1,2,3,4,5,6].map(function(i){return mon+i;});
 var head='<span class="rv-wgn" aria-hidden="true"></span>'+days.map(function(d,i){var dt=ritDateOf(d);
  return '<span class="rv-wgh'+(d===today?' rv-now':'')+'" aria-hidden="true">'+RIT_WDN[i]+'<b>'+dt.getDate()+'</b></span>';}).join('');
 var row=function(nm,sub,col,cell){
  return '<span class="rv-wgn" style="--c:'+col+'"><b>'+esc(nm)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span>'
   +days.map(function(d,i){var s=cell(d);
    return '<span class="rv-wc rv-wc-'+s+(d===today?' rv-now':'')+'" style="--c:'+col+'" role="img" aria-label="'
     +esc(nm+', '+RIT_WDF[i]+' '+ritDateOf(d).getDate()+': '+RIT_CELL_SAY[s])+'"></span>';}).join('');};
 var rows=st.act.map(function(p){return row(ritName(p.steps),ritOften(p.on),ritCol(p),function(d){return ritCellSt(p,d,today);});});
 var aff=function(list){return function(d){
  var any=list.some(function(x){return x[0]===d;}); return any?'done':(d>today?'none':'off');};};
 rows.push(row('Affirmations','Each day','var(--sec-embody)',aff(M.said)));
 rows.push(row('Challenges','Each day','var(--sec-play)',aff(M.did)));
 var first=ritDateOf(mon), last=ritDateOf(mon+6);
 return '<div class="rv-gblk"><div class="rv-gh"><span class="rv-gt">'
  +esc(first.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' to '+last.toLocaleDateString('en-GB',{day:'numeric',month:'short'}))+'</span>'
  +'<span class="rv-gs">Each ritual on the days it is set for. A ritual set for Tuesday, Thursday and Saturday shows on those three days and nowhere else.</span></div>'
  +(st.act.length?'':'<p class="rv-empty">Nothing active this week yet.</p>')
  +'<div class="rv-wg" role="group" aria-label="This week">'+head+rows.join('')+'</div>'
  +'<div class="rv-key" aria-hidden="true"><span><i class="rv-k-cube"></i>Done</span><span><i class="rv-k-cplan"></i>Set</span>'
  +'<span><i class="rv-k-cmiss"></i>Missed</span><span><i class="rv-k-off"></i>Not set</span></div></div>';}
function ritMonthHtml(st,M){
 var now=new Date(), today=st.today, first=pracDay(new Date(now.getFullYear(),now.getMonth(),1,12));
 var mn=now.toLocaleDateString('en-GB',{month:'long'}), kd={};
 ((CURP&&CURP.rituals)||[]).forEach(function(x){if(!x||!ritIsDone(x))return; var d=pracDay(x.t); if(d!==null&&d>=first&&d<=today)kd[d]=1;});
 var said={}; M.said.forEach(function(x){if(x[0]>=first&&x[0]<=today)said[x[0]]=1;});
 var did=M.did.filter(function(x){return x[0]>=first&&x[0]<=today;}).length;
 var fig=function(n,u,lb){return '<div class="rv-fig"><b>'+(n?n+'<small> '+u+'</small>':'–')+'</b><span>'+lb+'</span></div>';};
 var kn=Object.keys(kd).length, sn=Object.keys(said).length;
 var list=!st.act.length?'<p class="rv-empty">Nothing active this month.</p>'
  :'<ul class="rv-mol">'+st.act.map(function(p){
   var end=p.days?ritStart0(p)+p.days-1:null;
   return '<li class="rv-mo1" style="--c:'+ritCol(p)+'">'+ritPctHtml(p,today)
    +'<span class="rv-mot"><span class="rv-nm">'+esc(ritName(p.steps))+'</span>'
    +'<span class="rv-sub">'+esc(ritOften(p.on))+', '+(end===null?'no end':(end<=today?'ends today':'ends '+esc(ritDayName(end,today))))+'</span></span></li>';}).join('')+'</ul>';
 return '<div class="rv-gblk"><div class="rv-gh"><span class="rv-gt">'+esc(mn)+'</span>'
  +'<span class="rv-gs">Every ritual you are running and where its span ends, and what this month holds so far. Counts of days, never a grade.</span></div>'
  +'<div class="rv-figs rv-mofigs">'+fig(kn,kn===1?'day':'days','Kept')+fig(sn,sn===1?'day':'days','Affirmations said')
  +fig(did,did===1?'time':'times','Challenges done')+'</div>'+list+'</div>';}

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
 var today=S.today, wide=S.n>62, pad=ritWd(S.t0), out='';
 if(!wide){
  out='<div class="rv-scal" role="group" aria-label="'+esc(S.R.nm)+', a day to a square">'
   +RIT_WD.map(function(w){return '<span class="rv-scw" aria-hidden="true">'+w+'</span>';}).join('');
  S.days.forEach(function(X,i){var k=pad+i, Q=ritSpanCell(X,today,S.n>31), dt=ritDateOf(X.d);
   out+='<span class="rv-sc rv-sc-'+X.st+(X.d===today?' rv-now':'')+'" style="grid-row:'+(Math.floor(k/7)+2)+';grid-column:'+(k%7+1)
    +';--c:'+Q.c+Q.bg+'"'+(S.n>31?' aria-hidden="true"':Q.tip)+'><b>'+(dt.getDate()===1?dt.toLocaleDateString('en-GB',{month:'short'})+' ':'')+dt.getDate()+'</b></span>';});
  return out+'</div>';}
 /* a year is weeks as columns, Monday at the top, the way a wall planner
    folds a year onto one sheet. One picture and not 365 presses: the
    figures beside it are the read, and the grid is described once. */
 var cols=Math.floor((pad+S.n-1)/7)+1, mon='', lastM=-1;
 for(var w=0;w<cols;w++){var d=S.t0-pad+w*7, dt=ritDateOf(Math.max(d,S.t0));
  if(dt.getMonth()!==lastM){lastM=dt.getMonth(); mon+='<span class="rv-sym" style="grid-column:'+(w+2)+'">'+dt.toLocaleDateString('en-GB',{month:'short'})+'</span>';}}
 out='<div class="rv-syr" role="img" style="--cols:'+cols+'" aria-label="'+esc(S.R.nm+': '+acctDays(S.kept)+' kept and '+S.missed+' missed, a square a day, a column a week.')+'">'+mon
  +['M','','W','','F','','S'].map(function(w,i){return '<span class="rv-syw" style="grid-row:'+(i+2)+'">'+w+'</span>';}).join('');
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
 else if(S.rs>S.t0)note='<p class="rv-sparse">Your record starts '+esc(String(ritDayName(S.rs,S.today)).replace(/^(Today|Yesterday)$/,function(m){return m.toLowerCase();}))
  +'. The '+acctDays(S.rs-S.t0)+' of this span before that are drawn blank: there is nothing to read there, and none of them counts as missed.</p>';
 var extra=[S.said?'Affirmations said on '+acctDays(S.said)+'.':'', S.did?'Challenges done '+S.did+(S.did===1?' time.':' times.'):'']
  .filter(Boolean).join(' ');
 var held=S.then===null?'<p class="rv-okf rv-shel">No reading from before this span, so there is nothing to set the held places against.</p>'
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
  '.rv-gs{font-size:13px;line-height:1.5;color:var(--mid);max-width:62ch}',
  '.rv-afl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-af1{display:flex;align-items:center;gap:6px;border-radius:12px;background:color-mix(in srgb,var(--c) 6%,var(--panel-2));',
  ' border:1px solid color-mix(in srgb,var(--c) 26%,var(--edge));box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-af1.rv-on{border-color:color-mix(in srgb,var(--c) 60%,transparent)}',
  '.rv-aft{display:flex;flex-direction:column;gap:3px;flex:1 1 auto;min-width:0;padding:9px 12px 9px 2px}',
  '.rv-afq{font-size:15.5px;line-height:1.45;color:var(--ink)}',
  '.rv-afs{font-size:13px;line-height:1.45;color:var(--mid)}',
  '.rv-chn{font-size:14px;font-weight:600;color:var(--c)}',
  '.rv-chn small{font-weight:400;color:var(--mid);font-size:13px}',
  '.rv-ch1 .rv-afq{font-size:15px}',
  /* the week, a calendar row per ritual */
  '.rv-wg{display:grid;grid-template-columns:minmax(96px,1.5fr) repeat(7,minmax(30px,1fr));gap:5px;align-items:center}',
  '.rv-wgh{display:flex;flex-direction:column;align-items:center;font-size:12px;color:var(--dim)}',
  '.rv-wgh b{font-size:14px;font-weight:600;color:var(--mid);font-variant-numeric:tabular-nums}',
  /* TODAY IS FOUND BEFORE IT IS READ, round RB, his "a calendar of what's
     running this week". Today was a bolder date and a four pixel dot under
     each cell, which at a glance is no mark at all: in the first shot of
     Derek's week the dot read as a stray pixel. So the date sits in a filled
     chip, the way a wall calendar rings a day, and each of today's cells
     carries a ring of the same accent, so the column reads as one. */
  '.rv-wgh.rv-now{color:var(--ink);font-weight:600}',
  '.rv-wgh.rv-now b{color:var(--on-accent);background:var(--accent);border-radius:999px;min-width:26px;height:26px;padding:0 5px;display:inline-grid;place-items:center;margin-top:2px}',
  '.rv-wgn{display:flex;flex-direction:column;min-width:0;padding-left:8px;border-left:3px solid var(--c,transparent)}',
  /* a name wraps rather than being cut: a row whose ritual cannot be read
     is a row of squares */
  '.rv-wgn b{font-size:13px;line-height:1.3;font-weight:600;color:var(--ink);overflow-wrap:anywhere}',
  '.rv-wgn small{font-size:12px;color:var(--mid)}',
  '.rv-wc{position:relative;aspect-ratio:1/1;max-height:40px;border-radius:7px;background:color-mix(in srgb,var(--edge-2) 22%,transparent)}',
  '.rv-wc-done{background:var(--c);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.28),inset 0 -4px 0 rgba(0,0,0,.30)}',
  '.rv-wc-plan,.rv-wc-ahead{background:color-mix(in srgb,var(--c) 12%,transparent);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--c) 70%,transparent)}',
  '.rv-wc-miss{background:none;outline:1.5px dashed var(--dim);outline-offset:-1.5px}',
  '.rv-wc-off{background:none;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--edge-2) 45%,transparent)}',
  '.rv-wc-none{background:none}',
  '.rv-wc.rv-now::after{content:"";position:absolute;inset:-4px;border-radius:10px;border:1.5px solid var(--accent);pointer-events:none}',
  '.rv-key .rv-k-off{border-radius:3px;border:1px solid var(--edge-2);background:none}',
  '.rv-key .rv-k-pre{border-radius:3px;border:0;background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--edge-2) 55%,transparent) 0 2px,transparent 2px 5px)}',
  /* the month */
  '.rv-mofigs{margin:0 0 12px}',
  '.rv-mol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
  '.rv-mo1{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:12px;background:var(--panel-2);border:1px solid var(--edge);box-shadow:inset 3px 0 0 var(--c)}',
  '.rv-mot{display:flex;flex-direction:column;min-width:0}',
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
  '.rv-sga .btn.pri{flex:1 1 auto}',
  '.rv-sgq{background:none;border-color:transparent;color:var(--mid)}',
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
  '.rv-cbmo{margin:0 0 6px;text-align:center;font-size:13px;font-weight:600;color:var(--mid)}'
 ].join('\n');
 document.head.appendChild(st);}
