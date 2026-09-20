/* ============================================================
   THE ACCOUNT AREA. Six sections, one column, no rails.

   Ruled by the owner: "our profile page is non-standard, I want for now go out
   to the internet, let's get a very standard profile page for a technology
   such as this. We don't need coherence and everything else, because coherence
   is all over the app. What we need are security settings, privacy settings,
   account settings, billing, your tier."

   Two independent passes reached the same two rulings without seeing each
   other's working, which is the strongest evidence either of them produced.

   THE RAILS DO NOT RENDER HERE. The architect counted 98 simultaneous choices
   on this surface against a working memory of about four, 52 of them the left
   rail, and 12 of them actually settings. The art director measured the same
   thing from the other end: 69 percent of the phone scroll on this surface is
   the instrument the person navigated away from. One CSS rule takes 98 to 27.

   A STUB IS NOT A DISABLED CONTROL. Five of the things the owner asked for
   have no route at all today, and four of them cannot exist until sign in
   does. A stub row renders at full opacity with its real label and the words
   "not built yet" where a value would sit. It is never dimmed, because dim
   reads as "you may not" rather than "not yet", and it never takes a press,
   because a control that takes a press and then says no is the dead upgrade
   button this surface already shipped.

   WHAT IS A READING DOES NOT LIVE HERE. Coherence, tier as a band, addresses
   carrying, ground opened and the next marker are all printed on Summary or by
   record.js. Printing them a third time on an account page is what made a
   stranger's account page say "not read yet" four times.
   ============================================================ */
var ACC_OPEN='account';

/* One glyph per section. A named thing wears its own mark, the mark has a
   family, and the family has a colour. Crown is deliberately left unspent. */
var ACC_SECS=[
 {k:'account', nm:'Account',       b:'Throat',
  ic:'<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0114 0"/>'},
 {k:'display', nm:'Display',       b:'3rd Eye',
  ic:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21'
    +'M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>'},
 {k:'security',nm:'Security',      b:'Root',
  ic:'<path d="M12 3l7 3.5v5.5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6.5z"/><path d="M12 11v3"/>'},
 {k:'privacy', nm:'Privacy',       b:'Heart',
  ic:'<rect x="4.5" y="10.5" width="15" height="9.5" rx="2"/>'
    +'<path d="M8 10.5V7.8a4 4 0 018 0v2.7"/>'},
 {k:'billing', nm:'Billing And Tier',b:'Solar',
  ic:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10.5h18"/>'},
 {k:'help',    nm:'Help',          b:'Sacral',
  ic:'<circle cx="12" cy="12" r="8.4"/><path d="M9.6 9.6a2.5 2.5 0 114 2.4c-.9.6-1.6 1-1.6 2"/>'
    +'<path d="M12 17.1v.1"/>'}];
function accSec(k){for(var i=0;i<ACC_SECS.length;i++)if(ACC_SECS[i].k===k)return ACC_SECS[i];
 return ACC_SECS[0];}

/* ---------- the six row types, and there is no seventh ---------- */
/* A value row states a fact. The value takes the tabular face, because these
   are numbers in a column and a column of numbers that does not line up is
   the whole reason --num exists. */
function accRow(label,value,o){
 o=o||{};
 return '<div class="ac-row'+(o.cls?' '+o.cls:'')+'">'
  +'<span class="ac-rl">'+esc(label)+'</span>'
  +'<span class="ac-rv'+(o.num?' num':'')+'">'+(o.raw?value:esc(String(value)))+'</span></div>';}
/* A stub row. Full opacity, real label, and the honest value in the value
   slot. aria-disabled and not a button, so nothing can press it. */
function accStub(label,why){
 return '<div class="ac-row ac-stub" aria-disabled="true">'
  +'<span class="ac-rl">'+esc(label)+'</span>'
  +'<span class="ac-rv">'+esc(why||'not built yet')+'</span></div>';}
function accAct(label,id,o){
 o=o||{};
 return '<div class="ac-row ac-act"><span class="ac-rl">'+esc(label)+'</span>'
  +'<button class="btn'+(o.danger?' dgr':'')+'" id="'+id+'" type="button">'
  +esc(o.btn||'Open')+'</button></div>';}
/* A toggle row. The switch is the control and the row label is its name, so
   the switch carries no label of its own. */
function accTog(label,id,on,note){
 return '<div class="ac-row ac-tog"><span class="ac-rl">'+esc(label)
  +(note?'<em>'+esc(note)+'</em>':'')+'</span>'
  +'<button class="ac-sw'+(on?' on':'')+'" id="'+id+'" type="button" role="switch" '
  +'aria-checked="'+(!!on)+'" aria-label="'+esc(label)+'"><i></i></button></div>';}
function accGroup(title,rows,foot){
 return '<div class="ac-grp">'+(title?'<div class="ac-gh">'+esc(title)+'</div>':'')
  +rows+(foot?'<div class="ac-gf">'+foot+'</div>':'')+'</div>';}

/* ---------- 4.1 account ---------- */
function accAccount(){
 var w=(CURP&&CURP.who)||{}, bn=w.born||{};
 var nm=[w.first,w.middle,w.last].filter(function(x){return x&&x.trim();}).join(' ');
 var born=[bn.date,(bn.timeUnknown?'time not known':bn.time),bn.place]
  .filter(function(x){return x;}).join(' · ');
 var h=accGroup('This Account',
   '<div class="ac-row ac-edit"><span class="ac-rl">Profile name</span>'
   +'<input type="text" id="acnm" value="'+esc((CURP&&CURP.name)||'')+'" '
   +'aria-label="Profile name"></div>'
   +accRow('Profiles on this device',PROFILES.length,{num:true}),
   'The profile picker sits in the top bar today. It is a demo control in the '
   +'navigation of a product about to grow accounts, and it comes out of there '
   +'when sign in lands.');
 /* IDENTITY IS READ OUT HERE AND EDITED NOWHERE BUT ENERGETICS. Two editors
    for one field is two answers to one question. */
 h+=accGroup('Identity',
   accRow('Name',nm||'not entered')
   +accRow('Born',born||'not entered')
   +accAct('Change it','acgoiq',{btn:'Open Energetics'}),
   'Entered once on Energetics and read here. There is only ever one editor '
   +'for a field.');
 /* REPLAYABLE, AND IT LIVES IN THE PROFILE. Ruled: "the tutorial lives in the
    profile, toggleable and replayable, and it does not spend real charge."
    The onboarding is the same: nothing it does writes to the nine axes, so
    running it again costs nothing and can be offered without a warning. */
 h+=accGroup('The Opening',
   accAct('Run the signal test again','acob',{btn:'Open it'}),
   'The two words and where they land. Nothing it does is written to your '
   +'record, so it can be run as often as it is useful.');
 h+=accGroup('Sign In',
   accStub('Signed in as','not signed in')
   +accStub('Key','no key yet')
   +accStub('Sign out'),
   'Sign in does not exist yet. This record is in this browser and nowhere '
   +'else, so there is nothing to sign in to and nothing to sign out of.');
 return h;}

/* ---------- 4.2 display ---------- */
function accDisplay(){
 var h=accGroup('Lighting',
   '<div class="seg ac-seg" id="acthemes"></div>',
   'Dark is the default. Snow is the same instrument on paper. Punch removes '
   +'every outline and fills every shape. Glass puts the panes in front of a '
   +'moving ground and lets them refract it.');
 h+=accGroup('Screen','<div class="dens-list" id="acdens"></div>',
   'How much fits on one screen. This scales the whole interface, not just '
   +'the type.');
 h+=accGroup('Motion',
   accTog('Quiet','acquiet',!!(CURP&&CURP.ui&&CURP.ui.quiet),
    'no background wash, no breathing, no motion on arrival'),
   'If your system already asks for reduced motion, that is honoured whatever '
   +'this says. This is the switch for when it does not.');
 return h;}

/* ---------- 4.3 security ---------- */
function accSecurity(){
 return '<p class="ac-lead">Nothing about this record is protected by a password '
  +'today. It is held in this browser, so anybody with this browser has it. '
  +'That is the honest state and it is also the argument for sign in.</p>'
  +accGroup('How This Is Protected',
   accRow('Sign in method','none, this browser only')
   +accStub('Password','not set')
   +accStub('Two factor','not set')
   +accStub('Sessions and devices','this browser only')
   +accStub('Recent account activity','nothing to show'),
   'Every row here waits on sign in. When it lands it is a one time code to '
   +'the address or a signed link, never the address alone, because an address '
   +'alone would be the key to somatic and psychological self report.');}

/* ---------- 4.4 privacy. the one section here that is not generic ---------- */
var ACC_HELD=[
 ['The identity and birth moment','name, sex, date, time and place'],
 ['The 63 answers','what you said about the twenty one laws'],
 ['The charge on nine axes','what the answers and the stories wrote'],
 ['The stories','every entry, in your words, as you typed it'],
 ['The imprints','what the engine read out of them'],
 ['The meter','which addresses have been opened and when'],
 ['The snapshots','every saved state of the field'],
 ['The avatar and purpose','what you said you are becoming'],
 ['The plan','the tier word, and nothing about a card']];
function accPrivacy(){
 var snaps=(CURP&&CURP.history&&CURP.history.length)||0;
 var h='<p class="ac-lead">We never sell anybody’s data. Ever.</p>';
 h+=accGroup('What Is Held Here',
   ACC_HELD.map(function(x){return accRow(x[0],x[1]);}).join(''),
   'Held in this browser and nowhere else. This is a list rather than a '
   +'sentence because a list is what makes export and delete mean something.');
 h+=accGroup('This Device',
   accRow('Snapshots on file',snaps,{num:true})
   +accRow('Storage',STORE_BOUND?'writing':'blocked'),
   STORE_BOUND?'A save that fails says so rather than being swallowed.'
    :'Storage is blocked in this browser, so nothing you do here will survive '
     +'a reload. Export is the only way to keep it.');
 h+=accGroup('Who Has Sight',
   accRow('People with sight of this record','nobody'),
   'Nobody sees this but you. When a practitioner can be granted sight it is '
   +'explicit, it is listed here by name with what they see and when you '
   +'granted it, and revoking is one press on the row. Never a silent default.');
 h+=accGroup('Improve The Models',
   accTog('Use my stories to refine the reading','acmodel',
     !!(CURP&&CURP.ui&&CURP.ui.model)),
   'Off unless you turn it on. What would be used is the story with nothing '
   +'that identifies you attached, and the record and the story are never held '
   +'together. Saying no keeps the product whole.');
 h+=accGroup('Getting It Out, And Getting Rid Of It',
   accAct('Export this record','acexp',{btn:'Copy'})
   +accAct('Delete this record','acdel',{btn:'Delete',danger:true}),
   'Delete removes this record from this browser now. There is no store yet, '
   +'so there is nowhere else it could be and nothing else to ask. It cannot '
   +'be undone and there is no copy unless you made one.');
 return h;}

/* ---------- 4.5 billing. almost entirely real, ported not rebuilt ---------- */
function accBilling(m){
 return planSection(m)+accGroup('Invoices',accStub('Invoices','held by the processor'),
  'Invoices live with whoever takes the payment, which is never this file. '
  +'Nothing about a card is held here and the record carries no customer number.');}

/* ---------- 4.6 help ---------- */
function accHelp(){
 var h=accGroup('Get Help',
   accAct('Ask a question','achelpq',{btn:'Ask'})
   +accAct('Report something broken','achelpb',{btn:'Report'}),
   'Both go to the same place. There is nowhere to send them yet, so what you '
   +'write is held on this device and the outbox below says so.');
 h+=accGroup('Tell Us How It Is Going',
   accAct('Rate the product','acrate',{btn:'Rate'})
   +accAct('Product feedback','acsurv',{btn:'Open'}),
   'The rating is two questions and about five seconds. The feedback is about '
   +'four minutes and it is never asked for inside the instrument.');
 h+=accGroup('Reading This',
   accAct('How to read this','achowto',{btn:'Open'}),'');
 h+=accGroup('What Is Waiting',
   accRow('Outbox',obCount()+' waiting',{num:false}),
   obCount()?'Nothing can be sent yet. What you wrote is kept here and will go '
    +'when there is somewhere to send it.'
   :'Nothing waiting.');
 h+=accGroup('This Build',
   accRow('Build',(typeof BUILD_ID!=='undefined'&&BUILD_ID)||'not stamped')
   +accRow('Version',(typeof VERSION!=='undefined'&&VERSION)||'alpha'),
   'Quote this when you report something. It is what makes a report '
   +'reproducible.');
 return h;}

/* ---------- the surface ---------- */
function renderAccount(){
 var host=$('settings'); if(!host)return;
 var m=(typeof meterRead==='function')?meterRead(CURP):null;
 var who=(CURP&&CURP.name)||'You';
 var body;
 switch(ACC_OPEN){
  case 'display': body=accDisplay(); break;
  case 'security':body=accSecurity(); break;
  case 'privacy': body=accPrivacy(); break;
  case 'billing': body=accBilling(m); break;
  case 'help':    body=accHelp(); break;
  default:        body=accAccount();}
 var sec=accSec(ACC_OPEN);
 var h='<div class="ac-wrap">'
  /* plain: this is a person's own name, and title casing a name is a claim
     about how they spell it. de Vries is not De Vries. */
  +'<div class="ac-hd"><div class="pm-eye">Account</div>'
  +'<h2 class="kb-h plain">'+esc(who)+'</h2></div>'
  +'<div class="ac-body">'
  +'<nav class="ac-ix" aria-label="Account sections">'
  +ACC_SECS.map(function(s){
    return '<button class="ac-ixb'+(s.k===ACC_OPEN?' on':'')+'" data-acs="'+s.k+'" '
     +'type="button" style="--c:'+seatCol(s.b)+'" aria-current="'+(s.k===ACC_OPEN)+'">'
     +'<span class="ac-gl"><svg viewBox="0 0 24 24" aria-hidden="true">'+s.ic+'</svg></span>'
     +'<span>'+esc(s.nm)+'</span></button>';}).join('')
  +'</nav>'
  +'<section class="ac-pane" style="--c:'+seatCol(sec.b)+'">'
  +'<div class="ac-ph">'+esc(sec.nm)+'</div>'+body+'</section>'
  +'</div></div>';
 host.innerHTML=h;
 accWire();}
function accWire(){
 var host=$('settings'); if(!host)return;
 host.querySelectorAll('[data-acs]').forEach(function(b){
  b.onclick=function(){ACC_OPEN=b.getAttribute('data-acs'); renderAccount();};});
 var nm=$('acnm');
 if(nm)nm.onchange=function(){
  var v=nm.value.trim();
  if(!v){status('A profile needs a name. Nothing was changed.','fail');nm.value=CURP.name;return;}
  CURP.name=v; pSave(); statusSaved(); renderAccount(); render();};
 var gi=$('acgoiq'); if(gi)gi.onclick=function(){setTab(TAB.INTAKE);};
 var ob=$('acob'); if(ob)ob.onclick=function(){
  if(typeof sheetShut==='function')sheetShut();
  if(typeof obOpen==='function')obOpen(true);};
 /* the same three steps and the same setter as the bar menu. Two doors onto
    one setter is not a duplicate: one is for changing it while looking at the
    instrument, the other for finding it when you do not know where it is. */
 var d=$('acdens'), now=densGet();
 if(d){d.innerHTML=DENS.map(function(x){
   return '<button type="button" class="dens-opt'+(x[0]===now?' on':'')+'" data-acd="'+x[0]+'" '
    +'aria-pressed="'+(x[0]===now)+'"><b>'+esc(x[1])+'</b><em>'+esc(x[2])+'</em></button>';}).join('');
  d.querySelectorAll('[data-acd]').forEach(function(b){
   b.onclick=function(){densSet(b.getAttribute('data-acd')); renderAccount();};});}
 var th=$('acthemes');
 if(th){th.innerHTML=LIGHTINGS.map(function(t){
   return '<button type="button" data-act="'+t[0]+'" aria-pressed="'+(S.theme===t[0])+'">'
    +esc(t[1])+'</button>';}).join('');
  th.querySelectorAll('[data-act]').forEach(function(b){
   b.onclick=function(){setLighting(b.getAttribute('data-act')); renderAccount();};});}
 var q=$('acquiet');
 if(q)q.onclick=function(){uiSet('quiet',!(CURP.ui&&CURP.ui.quiet)); renderAccount();};
 var mo=$('acmodel');
 if(mo)mo.onclick=function(){uiSet('model',!(CURP.ui&&CURP.ui.model)); renderAccount();};
 var ex=$('acexp');
 if(ex)ex.onclick=function(){var t=pExport();
  try{navigator.clipboard.writeText(t); status('Record copied to the clipboard.','ok');}
  catch(e){status('Could not reach the clipboard. Nothing was copied.','fail');}};
 var dl=$('acdel');
 if(dl)dl.onclick=function(){accDelete();};
 var hw=$('achowto'); if(hw)hw.onclick=function(){sheetOpen(helpSheet());};
 var aq=$('achelpq'); if(aq)aq.onclick=function(){obCompose('question');};
 var ab=$('achelpb'); if(ab)ab.onclick=function(){obCompose('bug');};
 var ar=$('acrate');  if(ar)ar.onclick=function(){obCompose('rating');};
 var as=$('acsurv');  if(as)as.onclick=function(){obCompose('feedback');};
 planWire();}
/* ONE WRITER FOR THE UI PREFERENCES ON THE PROFILE, so a missing ui object on
   an older profile is filled here rather than at nine call sites. */
function uiSet(k,v){
 if(!CURP)return false;
 if(!CURP.ui||typeof CURP.ui!=='object')CURP.ui={};
 CURP.ui[k]=v; pSave();
 if(!statusSaved())return false;
 applyUiPrefs(); return true;}
function applyUiPrefs(){
 var q=!!(CURP&&CURP.ui&&CURP.ui.quiet);
 document.body.classList.toggle('quiet',q);}
/* DELETE IS A REAL CONTROL AND IT SAYS EXACTLY WHAT IT DID. It removes this
   record from this browser. There is no store, so it does not claim to have
   deleted anything from anywhere else, because that would be a lie about the
   one thing a person most needs the truth about. */
function accDelete(){
 var nm=(CURP&&CURP.name)||'this profile';
 if(!confirm('Delete '+nm+' from this browser?\n\nThe identity, the 63 answers, the '
  +'stories, the imprints and every snapshot go. It cannot be undone and there is no '
  +'copy unless you made one.')) return false;
 var i=PROFILES.indexOf(CURP);
 if(i<0){status('Nothing was deleted.','fail');return false;}
 PROFILES.splice(i,1);
 if(!PROFILES.length)pNew('You');
 CURP=PROFILES[0]; loadProfile(CURP);
 if(!pSave()){status('Could not write to storage. Nothing was deleted.','fail');return false;}
 ACC_OPEN='privacy';
 syncCh(); if(typeof syncLw==='function')syncLw(); if(typeof syncSoul==='function')syncSoul();
 renderAccount(); render();
 status('Deleted from this browser. Nothing was held anywhere else.','ok');
 return true;}

/* ============================================================
   COMPOSING SOMETHING TO SEND, AND THE HONEST FAILURE.

   Four kinds through one sheet: a question, a bug, a rating and the
   questionnaire. The rating and the questionnaire carry their answers; the
   question and the bug carry a body.

   The line above the field is always the same words and it is there before
   anybody types, per the practice: say it at the moment of contribution, not
   in a policy page. The boundary refuses a mail shaped string or a long run of
   digits by name and never strips them, because a silently cut sentence reads
   back as something the person never said. It will not catch a first name in a
   sentence, and nothing here claims that it does.
   ============================================================ */
var OB_TITLE={question:'Ask A Question',bug:'Report Something Broken',
 rating:'Rate The Product',feedback:'Product Feedback'};
var OB_LEAD={
 question:'Ask anything about what a reading means, what a control does, or why '
  +'the instrument said what it said.',
 bug:'What did you do, what did you expect, and what happened instead. The build '
  +'string from Help makes it reproducible.',
 rating:'Two questions and about five seconds.',
 feedback:'Three short blocks: what this is, whether the content makes sense, and '
  +'whether the product works. About four minutes.'};
/* THE RATING. Two questions, and neither of them is a star. */
var OB_RATE=[
 {k:'state',q:'How is it working right now?',
  a:['Broken','Rough','Works','Good','Sharp']},
 {k:'again',q:'Would you open it again this week?',
  a:['No','Probably not','Probably','Yes']}];
/* THE QUESTIONNAIRE. The owner's own eleven questions, in the three lenses he
   named. Every one of them survives. What changed is the wording, the response
   type and the order. Two of his were doing two jobs each and are split or
   merged where asking them as one returns an answer actionable neither way. */
var OB_SURVEY=[
 {lens:'What This Is',k:'m1',q:'Do you know what this product is for?',
  a:['No idea','Roughly','Yes, I could explain it']},
 {lens:'What This Is',k:'m2',q:'Do you know why we are doing this?',
  a:['No','I have a guess','Yes']},
 {lens:'What This Is',k:'m3',q:'Who would you hand this to?',
  a:['Nobody','Somebody who is stuck','Somebody who trains hard',
     'Somebody who works with people','Anybody']},
 {lens:'The Content',k:'p1',q:'Does the information make sense?',
  a:['No','In places','Yes']},
 {lens:'The Content',k:'p2',q:'Do you know what you are reading when a reading prints?',
  a:['No','Some of it','Yes']},
 {lens:'The Content',k:'p3',q:'Is the information helpful?',
  a:['It cost me time','Neither','A little','A lot']},
 {lens:'The Content',k:'p4',q:'Does the explanation of the problem make sense?',
  a:['No','In places','Yes']},
 {lens:'The Content',k:'p5',q:'Does the protocol make sense?',
  a:['No','I understand it and I do not believe it','Mostly','Yes']},
 {lens:'The Content',k:'p6',q:'Does the knowledge base make sense?',
  a:['I have not opened it','No','In places','Yes']},
 {lens:'The Product',k:'d1',q:'Do you know what you are doing when you open it?',
  a:['No','I work it out each time','Yes']},
 {lens:'The Product',k:'d2',q:'How good is it?',
  a:['Bad','Weak','Fine','Good','Very good']},
 {lens:'The Product',k:'d3',q:'How would you feel if you could no longer use it?',
  a:['Not bothered','A little disappointed','Very disappointed']}];
var OB_KIND=null, OB_ANS={}, OB_BODY='';
function obCompose(kind){
 OB_KIND=kind; OB_ANS={}; OB_BODY='';
 sheetOpen(obSheet());
 obWire();}
function obSheet(){
 var k=OB_KIND, lim=OB_LIMIT[k]||600;
 var h='<div class="pm-eye">Help</div><p class="sh-h">'+esc(OB_TITLE[k]||'Send')+'</p>'
  +'<p class="sh-p">'+esc(OB_LEAD[k]||'')+'</p>';
 if(k==='rating'||k==='feedback'){
  var list=(k==='rating')?OB_RATE:OB_SURVEY, lens=null;
  h+='<div class="ob-qs">';
  list.forEach(function(q){
   if(q.lens&&q.lens!==lens){lens=q.lens; h+='<div class="ob-lens">'+esc(lens)+'</div>';}
   h+='<div class="ob-q"><div class="ob-qt">'+esc(q.q)+'</div><div class="ob-as">'
    +q.a.map(function(a,i){
      return '<button class="ob-a'+(OB_ANS[q.k]===i?' on':'')+'" type="button" '
       +'data-obq="'+q.k+'" data-obv="'+i+'">'+esc(a)+'</button>';}).join('')
    +'</div></div>';});
  h+='</div>';}
 h+='<div class="ob-f"><label for="obtext">'
  +esc(k==='rating'||k==='feedback'?'What would improve the experience?':'In your words')
  +'</label>'
  /* SAID BEFORE THEY TYPE, not after. Always these words. */
  +'<p class="ob-warn">No names. No addresses. Nothing that identifies you or '
  +'anybody else.</p>'
  +'<textarea id="obtext" maxlength="'+lim+'" rows="5" '
  +'placeholder="'+(k==='bug'?'What you did, what you expected, what happened':'')
  +'"></textarea></div>'
  +'<div class="sh-act"><button class="btn pri" id="obsend" type="button">'
  +(k==='rating'||k==='feedback'?'Send':'Send it')+'</button>'
  +'<button class="btn" id="obcancel" type="button">Cancel</button></div>'
  +'<p class="sh-p dim">There is nowhere to send this yet. It is kept on this '
  +'device and goes when there is somewhere to send it. Nothing about who you '
  +'are travels with it.</p>';
 return h;}
function obWire(){
 document.querySelectorAll('[data-obq]').forEach(function(b){
  b.onclick=function(){OB_ANS[b.getAttribute('data-obq')]=+b.getAttribute('data-obv');
   var host=document.querySelector('.sheet-bd')||document.body;
   var t=$('obtext'); if(t)OB_BODY=t.value;
   sheetOpen(obSheet()); obWire();
   var t2=$('obtext'); if(t2)t2.value=OB_BODY;};});
 var c=$('obcancel'); if(c)c.onclick=function(){sheetShut();};
 var s=$('obsend'); if(s)s.onclick=function(){obSend();};}
function obSend(){
 var t=$('obtext'), body=t?t.value.trim():'';
 var r=compute();
 var e={kind:OB_KIND, at:new Date().toISOString().slice(0,10), body:body,
  answers:OB_ANS, band:obBand(r),
  build:(typeof BUILD_ID!=='undefined'&&BUILD_ID)||'alpha',
  platform:(window.innerWidth<720?'phone':'desktop'),
  viewport:(window.innerWidth<720?'narrow':'wide')};
 var q=obQueue(e);
 if(!q.ok){ status(q.why,'fail'); return false; }
 /* QUEUED SAYS QUEUED. Never sent, because it has not been. */
 var d=obDrain();
 if(d.state==='sent'){ status('Sent. Thank you.','ok'); }
 else { status('Held on this device. There is nowhere to send it yet, so it is '
   +'waiting in the outbox and nothing has been thrown away.','ok'); }
 sheetShut(); renderAccount(); return true;}
