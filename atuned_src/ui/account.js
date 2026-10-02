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
 /* THE PROFILES ON THIS DEVICE, round JZ. Throat, the family of the section
    above it, because both are the person and not a setting. Two heads, the
    one in front drawn whole, because the section is about there being more
    than one. */
 {k:'profiles',nm:'Profiles',      b:'Throat',
  ic:'<circle cx="10" cy="8.6" r="3.3"/><path d="M3.6 19.6a6.4 6.4 0 0112.8 0"/>'
    +'<path d="M15.4 5.6a3.1 3.1 0 010 6M17.6 13.9a6.2 6.2 0 012.8 5.7"/>'},
 {k:'display', nm:'Display',       b:'3rd Eye',
  ic:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21'
    +'M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>'},
 {k:'security',nm:'Security',      b:'Root',
  ic:'<path d="M12 3l7 3.5v5.5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6.5z"/><path d="M12 11v3"/>'},
 {k:'privacy', nm:'Privacy',       b:'Heart',
  ic:'<rect x="4.5" y="10.5" width="15" height="9.5" rx="2"/>'
    +'<path d="M8 10.5V7.8a4 4 0 018 0v2.7"/>'},
 /* ONE WORD, AND THE WORD SAYS WHAT THE SURFACE DOES. Ruled in COPY.md, and
    every other section here is one word. A tier is what the billing is for. */
 {k:'billing', nm:'Billing',b:'Solar',
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
   the switch carries no label of its own. col paints the note, for the one
   switch whose note is a seat's hertz: ruled, a hertz number is the seat's own
   colour. */
function accTog(label,id,on,note,col){
 return '<div class="ac-row ac-tog"><span class="ac-rl">'+esc(label)
  +(note?'<em'+(col?' style="color:'+col+'"':'')+'>'+esc(note)+'</em>':'')+'</span>'
  +'<button class="ac-sw'+(on?' on':'')+'" id="'+id+'" type="button" role="switch" '
  +'aria-checked="'+(!!on)+'" aria-label="'+esc(label)+'"><i></i></button></div>';}
function accGroup(title,rows,foot){
 return '<div class="ac-grp">'+(title?'<div class="ac-gh">'+esc(title)+'</div>':'')
  +rows+(foot?'<div class="ac-gf">'+foot+'</div>':'')+'</div>';}

/* ---------- 4.1 account ---------- */
function accAccount(){
 var w=(CURP&&CURP.who)||{}, bn=w.born||{};
 var nm=[w.first,w.middle,w.last].filter(function(x){return x&&x.trim();}).join(' ');
 var born=[bn.date,(bn.timeUnknown?'time not known':bn.time),bn.place,bn.zone]
  .filter(function(x){return x;}).join(' · ');
 /* SIGN IN. Round IA, his words: "I need the login page, I need it wired in".
    This was a shell that said so, because there was nothing to sign in to:
    Continue said "Accounts are not live yet" and cleared the password. The
    reboot-os Worker deployed on 30 September and this goes to it now, through
    ui/auth.js, the one file that makes a request.

    It goes first on this section: a sign in is the first thing an account
    page is for, and it is what he asked to look at. Signed out, it is the
    form, and Create account is a row of its own under it rather than a second
    button beside Continue, because an action is one of the six row types and
    a row carrying two actions would be a seventh. Signed in, it is the email
    and Sign out, which returns the row the stubs took away while nothing
    could reach it.

    THE FOOTER IS THE DISCLOSURE AND IT CHANGED BECAUSE THE FACT DID. "Nothing
    typed here is sent or kept" was true of the shell and is false now: the
    email and password go to the server. What stays true is the part a person
    most needs, that a sign in does not copy their record anywhere, so both
    footers say that. Neither field is written to the record or the outbox;
    the session is kept by ui/auth.js under its own key in this browser. */
 var ses=(typeof authSession==='function')?authSession():null;
 var h=ses?accGroup('Sign in',
   accRow('Signed in as',ses.email)
   +accAct('Sign out of this browser','acout',{btn:'Sign out'}),
   'Your stories and readings stay on this device. Signing in does not copy them anywhere.')
  :accGroup('Sign in',
   accStub('Signed in as','not signed in')
   +'<form id="acsignin" novalidate>'
   +'<div class="ac-row ac-edit"><label class="ac-rl" for="acmail">Email</label>'
   +'<input type="email" id="acmail" autocomplete="email" spellcheck="false"></div>'
   +'<div class="ac-row ac-edit"><label class="ac-rl" for="acpass">Password</label>'
   +'<input type="password" id="acpass" autocomplete="current-password"></div>'
   +'<div class="ac-row ac-act"><span class="ac-rl"></span>'
   +'<button class="btn pri" id="acgo" type="submit">Continue</button></div>'
   +'</form>'
   +accAct('No account yet','acnew',{btn:'Create account'}),
   'Your email and password go to the account server. Your stories and readings stay on this device.');
 /* THE NAME IS EDITED IN ONE PLACE, and since round JZ that place is Profiles,
    where the list it has to be unique in is on the same screen. This row said
    "Profile name" as an input, and two editors for one field is two answers to
    one question, so it states the name and opens the section that edits it. */
 h+=accGroup('This account',
   accRow('Open profile',capName((CURP&&CURP.name)||'You'))
   +accAct('Save, open or delete a profile','acgoprof',{btn:'Open profiles'}));
 /* A NOTE TO A TESTER, NOT TO A PERSON. "The profile picker sits in the top
    bar today. It is a demo control, and it comes out of the bar when sign in
    lands." is a roadmap line, the kind he named in GX: "screen when entry,
    known, zero entries, what is that, get rid of it." */
 /* IDENTITY IS READ OUT HERE AND EDITED NOWHERE BUT ENERGETICS. Two editors
    for one field is two answers to one question. */
 h+=accGroup('Identity',
   accRow('Name',nm||'not entered')
   +accRow('Born',born||'not entered')
   +accAct('Change it','acgoiq',{btn:'Open Energetics'}));
 /* "There is only ever one editor for a field" was the engineering rule
    printed under the button that already says where to change it. */
 /* REPLAYABLE, AND IT LIVES IN THE PROFILE. Ruled: "the tutorial lives in the
    profile, toggleable and replayable, and it does not spend real charge."
    The onboarding is the same: nothing it does writes to the nine axes, so
    running it again costs nothing and can be offered without a warning. */
 h+=accGroup('The opening',
   accAct('Run the signal test again','acob',{btn:'Open it'})
   /* THE TUTORIAL IS THE SAME RULE. Round NF: built on the same promise as
      the signal test above, replayable and no charge of its own; what it
      walks through is the real commit of whatever is typed into it, same as
      the Story tab's own Apply, so running it again is a real entry each
      time rather than a rehearsal. */
   +accAct('Replay the Day One tutorial','actut',{btn:'Open it'}));
 /* PRACTITIONER MODE, round LL: "Add a practitioner mode to the profile."
    Account and not Display, because it changes what a person is in the
    product, a practitioner with clients, and not how the screen looks; and
    not Privacy, because Privacy is who has sight of this record, which is
    the other direction. Account is also the section that opens first, so it
    is where he will look. The footer is a disclosure and not a description
    of the switch: it says the page it opens is a sketch before a person
    turns it on expecting clients. */
 h+=accGroup('Practitioner',
   accTog('Practitioner mode','acprac',pracOn(),
    'adds Practitioner to the menu'),
   'Turned on, it opens a sketch with no clients on it.');
 /* HS SWEEP, SETTINGS. A footer that only described the control above it is
    cut: this one, Sign in, Lighting, Screen, Motion, the feedback pair and the
    reproducibility clause on the build. Every footer that is a disclosure
    stays, word for word: what is held, where, who has sight, what a delete
    does, what a failed load does, that nothing is sent, that storage is
    blocked. Those are obligations to the person, not a section explaining
    itself, and CLAUDE.md names them as the ones that must be visible. */
 /* Sign In moved to the top of this section in round IA, as a form. Key and
    Sign out went with the stubs: a sign out row under a sign in that cannot
    succeed names a state nobody can reach. Sign out is back, in the Sign In
    group, since 30 September, when the state became reachable. Key is not:
    nothing on this side holds one. */
 return h;}

/* ---------- 4.1b profiles. round JZ ----------
   His words: "build out the profile page. So if I enter my profile, it saves
   my data. Under Lance. And I can delete or retrieve it."

   Every profile was already a named record in PROFILES and already saved as
   it changed. What this adds is the door: the name, the list, and the three
   verbs, over engine/profiles.js, which validates, writes atomically and
   reports. Nothing here writes the store itself except the two side keys a
   delete has to clear (accForget, below). */
function accOwn(){
 return !!(typeof S!=='undefined'&&S.who===0&&CURP&&PROFILES.indexOf(CURP)>=0);}
function accWhen(iso){
 if(!iso)return '';
 var d=new Date(iso); if(isNaN(d.getTime()))return '';
 return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
function accProfiles(){
 var own=accOwn(), h='';
 if(own)h+=accGroup('This profile',
   '<form id="acpform" class="ac-row ac-edit pf-edit" novalidate>'
   +'<label class="ac-rl" for="acpnm">Name</label>'
   +'<span class="pf-act"><input type="text" id="acpnm" autocomplete="off" spellcheck="false" '
   +'value="'+esc(CURP.name||'')+'">'
   +'<button class="btn pri" id="acpsave" type="submit">Save</button></span></form>',
   'Every change saves as you go, under this name.');
 else h+=accGroup('This profile',
   accRow('Open now',((PEOPLE[S.who]||{}).nm||'A worked example')+', example'),
   'A worked example is not saved on this device. Open one of your own below.');
 var L=profList();
 h+=accGroup('Saved on this device',
   L.map(function(x){
    var cur=own&&x.cur;
    var meta=['saved '+accWhen(x.updated||x.created),
     x.stories?(x.stories===1?'1 story':x.stories+' stories'):'']
     .filter(function(s){return s&&s!=='saved ';}).join(' · ');
    return '<div class="ac-row pf-row'+(cur?' on':'')+'">'
     +'<span class="ac-rl"><b class="pf-nm">'+esc(x.name||'You')+'</b><em>'+esc(meta)+'</em></span>'
     +'<span class="pf-act">'
     +(cur?'<span class="pf-now">Open now</span>'
      :'<button class="btn" type="button" data-pfo="'+esc(x.id)+'" aria-label="Open '+esc(x.name)+'">Open</button>')
     +'<button class="btn dgr" type="button" data-pfd="'+esc(x.id)+'" aria-label="Delete '+esc(x.name)+'">Delete</button>'
     +'</span></div>';}).join(''),
   'Held in this browser and nowhere else. Delete cannot be undone and there is '
   +'no copy unless you made one.');
 h+=accGroup('Start a new profile',
   '<form id="acpnewf" class="ac-row ac-edit pf-edit" novalidate>'
   +'<label class="ac-rl" for="acpnew">Name</label>'
   +'<span class="pf-act"><input type="text" id="acpnew" autocomplete="off" spellcheck="false">'
   +'<button class="btn" id="acpstart" type="submit">Start</button></span></form>',
   'A new profile starts blank. The one open now stays saved under its own name.');
 return h;}
/* THE SURFACE'S OWN RULES, injected once, the way the intake and the ritual
   carry theirs, because the shell stylesheet is held by another seat. */
function accProfCss(){
 if(document.getElementById('pf-css'))return;
 var st=document.createElement('style'); st.id='pf-css';
 st.textContent=[
  '.pf-act{display:flex;align-items:center;gap:8px;flex:0 0 auto}',
  '.pf-edit .pf-act{flex:1 1 auto;justify-content:flex-end;min-width:0}',
  '.pf-edit .pf-act input{flex:1 1 auto;min-width:0;width:100%}',
  '.pf-nm{font-weight:600;color:var(--ink)}',
  '.pf-row.on{box-shadow:inset 3px 0 0 var(--c)}',
  '.pf-now{min-width:64px;text-align:center;font-size:13px;color:var(--mid)}',
  '.pf-act .btn{min-width:64px;min-height:var(--tap)}',
  /* the Discord door is the one .btn on this page that is a link, because it
     leaves for another site, and a link takes the browser's underline and
     wraps; looked at, "Open Discord" read as underlined text on two lines
     inside the pill at 390 */
  '#accomm{text-decoration:none;white-space:nowrap;display:inline-flex;align-items:center;'
   +'justify-content:center;min-height:var(--tap)}',
  /* the kind switch in the feedback sheet sat flush on the lead under it */
  '.ob-kinds{margin:2px 0 10px}',
  '@media (max-width:520px){.pf-row{flex-wrap:wrap}.pf-row .pf-act{margin-left:auto}}'].join('\n');
 document.head.appendChild(st);}

/* ONTO THE PERSON'S OWN FIELD FIRST. A profile of their own is only ever
   loaded with S.who at 0, and loadP(0) is the one writer of S.who, so a person
   looking at a worked example is walked back onto their own before anything
   moves. The pending slider write lands first, so leaving a profile never
   drops the last drag on it. */
function accToOwn(){
 if(typeof YOU_T!=='undefined'&&YOU_T&&typeof persistNow==='function')persistNow();
 if(S.who!==0)loadP(0);}
/* AND THE MIRROR FOLLOWS THE PROFILE. PEOPLE[0] is what loadP(0) reads the
   person's field back out of, so after any change of profile it is filled from
   the one now open, the way the boot fills it. Without it a trip to a worked
   example and back put the last profile's field onto this one. */
function accSwitched(){
 PROF_BY[PEOPLE[0].nm]=CURP;
 mirrorYou();
 var sel=$('psel'); if(sel)sel.value='0';
 if(typeof IQ_OPEN!=='undefined')IQ_OPEN=null;
 syncCh(); if(typeof syncLw==='function')syncLw(); if(typeof syncSoul==='function')syncSoul();
 if(typeof applyUiPrefs==='function')applyUiPrefs();
 if(typeof renderSpirit==='function')renderSpirit();
 if(typeof renderIntake==='function')renderIntake();
 renderAccount(); render();}
/* the engine's reason, as the first letter of a sentence */
function accWhy(){
 var e=profErr()||['it was refused'];
 var t=e.join('. '); return t.charAt(0).toUpperCase()+t.slice(1)+'.';}
function accProfSave(){
 var i=$('acpnm'); if(!i)return false;
 if(!profRename(i.value)){status('Not saved. '+accWhy(),'fail'); return false;}
 status('Saved as '+CURP.name+'.','ok');
 accSwitched(); return true;}
function accProfStart(){
 var i=$('acpnew'); if(!i)return false;
 accToOwn();
 var p=profCreate(i.value);
 /* the redraw is for a person walked off a worked example, and the name they
    typed goes back in the box, because a refusal that also erases the input
    makes them type it again to see what was wrong with it */
 if(!p){var typed=i.value; status('Nothing was started. '+accWhy(),'fail'); renderAccount();
  var i2=$('acpnew'); if(i2)i2.value=typed; return false;}
 accSwitched();
 status(p.name+' is open. It starts blank.','ok'); return true;}
function accProfOpen(id){
 var p=profFind(id), nm=(p&&p.name)||'That profile';
 accToOwn();
 if(!profOpen(id)){status(nm+' was not opened. '+accWhy(),'fail'); renderAccount(); return false;}
 accSwitched();
 status(CURP.name+' is open.','ok'); return true;}
/* THE SIDE KEYS GO WITH THE PROFILE. The avatar ratings and the active
   rituals are held beside the record under its id, so a delete that left them
   would leave part of a deleted profile in this browser. Only that id's entry
   is removed. False when either key would not take the write. */
function accForget(id){
 var ok=true;
 [typeof AV_KEY!=='undefined'?AV_KEY:null, typeof RIT_KEY!=='undefined'?RIT_KEY:null]
  .forEach(function(k){
   if(!k)return;
   try{var o=JSON.parse(STORE.get(k)||'{}');
    if(o&&typeof o==='object'&&!Array.isArray(o)&&Object.prototype.hasOwnProperty.call(o,id)){
     delete o[id]; STORE.set(k,JSON.stringify(o));}}
   catch(e){ok=false;}});
 return ok;}
function accProfDelete(id){
 var p=profFind(id);
 if(!p){status('Nothing was deleted.','fail'); return false;}
 if(!confirm('Delete '+(p.name||'this profile')+' from this browser?\n\nThe identity, the 63 answers, the '
  +'stories, the imprints and every snapshot go. It cannot be undone and there is no '
  +'copy unless you made one.')) return false;
 /* onto the person's own field first, so the engine can tell whether the
    profile going is the open one, and so the mirror is refilled whenever the
    profile it was filled from is the one that went */
 accToOwn();
 var d=profDelete(id);
 if(!d){status('Nothing was deleted. '+accWhy(),'fail'); renderAccount(); return false;}
 var side=accForget(d.id);
 if(d.moved||PROFILES.indexOf(PROF_BY[PEOPLE[0].nm])<0)accSwitched(); else renderAccount();
 if(!side)status(d.name+' is deleted. Its rituals and avatar ratings could not be cleared from this browser.','fail');
 else status(d.name+' is deleted from this browser, the only place it was held.'
  +(d.moved?' '+CURP.name+' is open.':''),'ok');
 return true;}

/* ---------- 4.2 display ---------- */
function accDisplay(){
 var h=accGroup('Lighting',
   '<div class="seg ac-seg" id="acthemes"></div>');
 h+=accGroup('Screen','<div class="dens-list" id="acdens"></div>');
 h+=accGroup('Motion',
   accTog('Quiet','acquiet',!!(CURP&&CURP.ui&&CURP.ui.quiet),
    'no background wash, no breathing, no motion on arrival'));
 /* SOUND, beside Motion, because it is the same kind of question: how much of
    the product reaches the person besides the words. Off on every profile.
    The footer is a disclosure and not a description: two things silence the
    switch without moving it, and a person who turned it on and hears nothing
    is owed the reason before they go looking. A browser with no Web Audio
    gets no switch, because a control that cannot act is not offered. */
 h+=accGroup('Sound',
   (typeof bedCan==='function'&&bedCan())
    ? accTog('Sound effects','acsfx',sfxIsOn(),
       'a short sound on a tab or a Field press, when something is kept, done or refused, when a release starts and ends, and when a timer ends. A crackle when the pointer meets a line on the Field, or on the Body zoomed in')
    : accStub('Sound effects','this browser has no audio'),
   'Quiet turns them off too. A release has its own sound switches.');
 return h;}

/* ---------- 4.3 security ---------- */
/* SIGNED IN, FOUR ROWS STOP BEING TRUE AND ONE DOES NOT. The method and the
   password are real once a person has signed in. Sessions and devices said
   "this browser only", which is false for an account any browser can sign in
   to, and the activity row said "nothing to show" while the server keeps a
   log of every sign in: neither has a route to read it yet, so both say not
   built. Two factor stays not set whatever happens here, round EZ: it is his
   systems engineer's to design. The lead stays exactly as it is in both
   states, because it is still true: a sign in names an account and does not
   lock the record, which is held in this browser either way. */
function accSecurity(){
 var ses=(typeof authSession==='function')?authSession():null;
 return '<p class="ac-lead">Nothing about this record is protected by a password '
  +'today. It is held in this browser, so anybody with this browser has it.</p>'
  +accGroup('How this is protected',
   accRow('Sign in method',ses?'email and password':'none, this browser only')
   +(ses?accRow('Password','set'):accStub('Password','not set'))
   +accStub('Two factor','not set')
   +accStub('Sessions and devices',ses?'not built yet':'this browser only')
   +accStub('Recent account activity',ses?'not built yet':'nothing to show'),
   /* the design of a sign in that does not exist, and "address" meaning an
      email in a product where an address is a place in the body. One word
      per concept. The design lives in DECISIONS.md, not on this screen. */
   ses?'':'Every row here waits on sign in.');}

/* ---------- 4.4 privacy. the one section here that is not generic ---------- */
var ACC_HELD=[
 ['The identity and birth moment','name, sex, date, time and place'],
 ['The 63 answers','what you said about the twenty one laws'],
 ['The charge on nine axes','what the answers and the stories wrote'],
 ['The archetype, axis and action answers','what you said about how you act and feel, kept beside the 63'],
 ['The stories','every entry, in your words, as you typed it'],
 ['The imprints','what the engine read out of them'],
 ['The meter','which addresses have been opened and when'],
 ['The snapshots','every saved state of the field'],
 ['The avatar and purpose','what you said you are becoming'],
 ['The plan','the tier word, and nothing about a card']];
function accPrivacy(){
 var snaps=(CURP&&CURP.history&&CURP.history.length)||0;
 var h='<p class="ac-lead">We never sell anybody’s data. Ever.</p>';
 h+=accGroup('What is held here',
   ACC_HELD.map(function(x){return accRow(x[0],x[1]);}).join(''),
   'Held in this browser and nowhere else.');
 h+=accGroup('This device',
   accRow('Snapshots on file',snaps,{num:true})
   +accRow('Storage',STORE_BOUND?'writing':'blocked'),
   STORE_BOUND?'If a save fails, it tells you.'
    :'Storage is blocked in this browser, so nothing you do here will survive '
     +'a reload. Export is the only way to keep it.');
 /* "WHO HAS SIGHT" WAS TEAM SHORTHAND. The owner said he did not know what
    sight meant, so a customer would not either. Same disclosure, same three
    duties CLAUDE.md names for a practitioner grant: explicit consent, a
    visible list, and revocation. "Never a silent default" said the same as
    the first sentence in the team's words, and came out with it. */
 h+=accGroup('Who can see this',
   accRow('People who can see this record','nobody'),
   'Nobody sees this but you. A practitioner can see it only after you say yes. '
   +'Each yes is listed here by name, with what they see and the date you gave '
   +'it, and one press on the row takes it back.');
 h+=accGroup('Improve the Models',
   accTog('Use my stories to refine the reading','acmodel',
     !!(CURP&&CURP.ui&&CURP.ui.model)),
   'Off unless you turn it on. What would be used is the story with nothing '
   +'that identifies you attached, and the record and the story are never held '
   +'together. Saying no keeps the product whole.');
 /* LOAD IS THE THIRD CONTROL OF THIS SET, AND IT HAD NO DOOR AT ALL.
    The importer was written inside profileSheet in ui/panels.js and nothing in
    the app opens profileSheet: measured in the built product, the token appears
    twice, the definition and one call inside itself. So a person finished the
    web reading, saved a real record, and had nowhere to put it.
    It goes here rather than in a sheet of its own because Export and Delete are
    already here and load is the inverse of export. A person holding a record
    file looks where the other two record controls are, and this is the surface
    that already says what is held and where. */
 h+=accGroup('Load a record',
   recordImportHtml('ac'),
   /* "the whole handoff" is CO-26's own word, "Keep it: it is the handoff",
      and "validated" is the boundary function's name. Said as what happens. */
   'The web reading saves your answers as a file. Load it here. Nothing on '
   +'this device changes unless the whole file loads, and if it does not, '
   +'this says which field failed.');
 h+=/* A HEADING IS A THING A PERSON WOULD SAY. This one read "Getting It Out,
   And Getting Rid Of It": seven words, a comma, and a conjunction capitalised
   in a file that is otherwise in title case. It names two controls, so it
   says their two names. */
 accGroup('Export and delete',
   accAct('Export this record','acexp',{btn:'Copy'})
   +accAct('Delete this record','acdel',{btn:'Delete',danger:true}),
   'Delete removes this record from this browser now. There is no store yet, '
   +'so there is nowhere else it could be and nothing else to ask. It cannot '
   +'be undone and there is no copy unless you made one.');
 return h;}

/* ---------- 4.5 billing. almost entirely real, ported not rebuilt ---------- */
function accBilling(m){
 /* the tiers sit under the plan in force, ui/plans.js, and carry the presses */
 if(typeof planTiersCss==='function')planTiersCss();
 return planSection(m,{brief:true})
  +(typeof planTiersHtml==='function'?planTiersHtml():'')
  +accGroup('Invoices',accStub('Invoices','held by the processor'),
  'Invoices live with whoever takes the payment, which is never this file. '
  +'Nothing about a card is held here and the record carries no customer number.');}

/* ---------- 4.6 help ---------- */
/* THE COMMUNITY DOOR, 2 October. The owner: "the community work is on
   Discord so there needs to be a doorway to Discord as well." The invite link
   is the owner's to make, from his own Discord server, and it does not exist
   yet (WAITING-ON-YOU.md item 13). It is not a secret: an invite link is made
   to be handed out, so it lives here in the open, and this is the one place it
   is written. Paste it between the quotes and rebuild.

   EMPTY SAYS NOT OPEN YET, AND A WRONG ONE SAYS THE SAME. A door that opens
   onto Discord's "invite invalid" page is a dead button in a new tab, so the
   link only becomes a door when it is an https invite on one of Discord's own
   two invite hosts. Anything else, a typo or a link to some other site pasted
   here by mistake, stays a stub and never reaches a person as a link. */
var COMMUNITY_INVITE='';
function commInvite(){
 var u=String(COMMUNITY_INVITE||'').trim();
 return /^https:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]{2,64}\/?$/.test(u)?u:'';}
function accHelp(){
 /* THE THREE THE OWNER NAMED, comment, question and bug, in one group and one
    sheet. Each row opens the sheet on its own kind, and the sheet can be
    switched to either of the other two without losing what was typed, because
    a person who opened Ask and is writing about a fault should not have to
    start again to file it as one. */
 var h=accGroup('Write to us',
   accAct('Leave a comment','achelpc',{btn:'Write'})
   +accAct('Ask a question','achelpq',{btn:'Ask'})
   +accAct('Report something broken','achelpb',{btn:'Report'}),
   'They all go to the same place. What you write is held on this device first, '
   +'and the outbox below says whether it has gone.');
 var inv=commInvite();
 h+=accGroup('Community',
   inv?'<div class="ac-row ac-act"><span class="ac-rl">Talk to other people who use this</span>'
    +'<a class="btn" id="accomm" href="'+esc(inv)+'" target="_blank" rel="noopener noreferrer">'
    +'Open Discord</a></div>'
   :accStub('Talk to other people who use this','not open yet'),
   /* UNPACKED, round PO. Discord is a name a person may not know, so what it
      is goes beside it, and the one fact a person needs before pressing: it
      is somebody else's site with its own sign in, and nothing from here goes
      with them. */
   'Discord is a free chat app where the community talks. It opens in a new tab, '
   +'it needs its own Discord account, and nothing from this app goes with you.');
 h+=accGroup('Tell us how it is going',
   accAct('Rate the product','acrate',{btn:'Rate'})
   +accAct('Product feedback','acsurv',{btn:'Open'}));
 h+=accGroup('Reading this',
   accAct('How to read this','achowto',{btn:'Open'}),'');
 /* A RETRY HAS A DOOR. The drain runs on every Send, so without this a held
    entry only left when the person wrote another one, which is a queue that
    asks for more words to move the old ones. */
 var nq=obCount();
 h+=accGroup('What is waiting',
   accRow('Outbox',nq?nq+' waiting':'\u2013',{num:false})
   +(nq&&typeof SEND_HOST==='function'?accAct('Try sending them again','acobsend',{btn:'Send now'}):''),
   nq?'What you wrote is kept here until the server takes it, and nothing is '
    +'thrown away while it waits.'
   :'Nothing waiting.');
 h+=accGroup('This build',
   accRow('Build',(typeof BUILD_ID!=='undefined'&&BUILD_ID)||'not stamped')
   +accRow('Version',(typeof VERSION!=='undefined'&&VERSION)||'alpha'),
   'Quote this when you report something.');
 return h;}

/* ---------- the surface ---------- */
function renderAccount(){
 var host=$('settings'); if(!host)return;
 accProfCss();
 var m=(typeof meterRead==='function')?meterRead(CURP):null;
 var who=capName((CURP&&CURP.name)||'You');
 var body;
 switch(ACC_OPEN){
  case 'profiles':body=accProfiles(); break;
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
 /* the profiles section. A form each, so Enter in a name is the same press as
    its button. */
 var gp=$('acgoprof'); if(gp)gp.onclick=function(){ACC_OPEN='profiles'; renderAccount();};
 var pf=$('acpform'); if(pf)pf.onsubmit=function(e){e.preventDefault(); accProfSave();};
 var pn=$('acpnewf'); if(pn)pn.onsubmit=function(e){e.preventDefault(); accProfStart();};
 host.querySelectorAll('[data-pfo]').forEach(function(b){
  b.onclick=function(){accProfOpen(b.getAttribute('data-pfo'));};});
 host.querySelectorAll('[data-pfd]').forEach(function(b){
  b.onclick=function(){accProfDelete(b.getAttribute('data-pfd'));};});
 /* a form, so Enter in either field is the same press as Continue. This said
    "Accounts are not live yet" on every press and cleared the password,
    because there was nothing to send it to. There is now, so the press asks,
    and the answer is what gets said: accEnter, below. */
 var si=$('acsignin');
 if(si)si.onsubmit=function(e){ e.preventDefault(); accEnter('signin'); };
 var an=$('acnew'); if(an)an.onclick=function(){ accEnter('signup'); };
 var ao=$('acout'); if(ao)ao.onclick=function(){ accSignOut(); };
 var gi=$('acgoiq'); if(gi)gi.onclick=function(){setTab(TAB.INTAKE);};
 var ob=$('acob'); if(ob)ob.onclick=function(){
  if(typeof sheetShut==='function')sheetShut();
  if(typeof obOpen==='function')obOpen(true);};
 var tu=$('actut'); if(tu)tu.onclick=function(){
  if(typeof sheetShut==='function')sheetShut();
  if(typeof tutorialOpen==='function')tutorialOpen(true);};
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
 /* turned on, it plays the commonest one at once, so the person hears what
    they turned on and can set the volume by it. Only once the save landed. */
 var sx=$('acsfx');
 /* A DEVICE SETTING, NOT A PROFILE WRITE. This went through uiSet, which saves
    the profile, so on a worked example turning sound off answered "Nothing
    saved on a worked example." sfxSwitch writes the browser's own store, says
    what it did, and plays the keep whenever it ends up on, saved or not,
    because what a person hears is the state and not the write. */
 if(sx)sx.onclick=function(){var want=!sfxIsOn();
  sfxSwitch(want); if(want&&typeof sfx==='function')sfx('kept'); renderAccount();};
 var mo=$('acmodel');
 if(mo)mo.onclick=function(){uiSet('model',!(CURP.ui&&CURP.ui.model)); renderAccount();};
 var pr=$('acprac');
 /* a device setting and not a profile write: see pracOn in ui/practitioner.js */
 if(pr)pr.onclick=function(){pracSwitch(!pracOn()); renderAccount();};
 var ex=$('acexp');
 if(ex)ex.onclick=function(){var t=pExport();
  try{navigator.clipboard.writeText(t); status('Record copied to the clipboard.','ok');}
  catch(e){status('Could not reach the clipboard. Nothing was copied.','fail');}};
 var dl=$('acdel');
 if(dl)dl.onclick=function(){accDelete();};
 /* the same importer the profile sheet draws, under its own ids, and the page
    redraws on a load that landed because the record's own name is printed on it */
 if(typeof recordImportWire==='function')recordImportWire('ac',function(){renderAccount();});
 var hw=$('achowto'); if(hw)hw.onclick=function(){sheetOpen(helpSheet());};
 var ac=$('achelpc'); if(ac)ac.onclick=function(){obCompose('comment');};
 var os=$('acobsend'); if(os)os.onclick=function(){obFlush(os);};
 var aq=$('achelpq'); if(aq)aq.onclick=function(){obCompose('question');};
 var ab=$('achelpb'); if(ab)ab.onclick=function(){obCompose('bug');};
 var ar=$('acrate');  if(ar)ar.onclick=function(){obCompose('rating');};
 var as=$('acsurv');  if(as)as.onclick=function(){obCompose('feedback');};
 planWire();
 if(typeof planTiersWire==='function')planTiersWire();}
/* THE SIGN IN PRESSES. The request and every sentence it can end in are
   ui/auth.js's; what is here is the waiting and the redraw. A signed in
   section is a different set of rows, so a yes redraws the section and a no
   leaves the form exactly as it was, typed values included, so the fix is one
   field. The redraw comes before the status line, because renderAccount does
   not touch the status line and the order makes the sentence the last thing
   written. Both controls wait while a request is out, so a second press
   cannot send a second request under the first one's answer. */
var ACC_BUSY=false;
function accBusy(on){
 ['acgo','acnew','acout'].forEach(function(id){ var b=$(id); if(b)b.disabled=!!on; });}
function accEnter(route){
 if(ACC_BUSY||typeof authEnter!=='function')return false;
 var m=$('acmail'), pw=$('acpass');
 ACC_BUSY=true; accBusy(true);
 status(route==='signup'?'Creating the account.':'Checking with the server.');
 authEnter(route,m?m.value.trim():'',pw?pw.value:'').then(function(r){
  ACC_BUSY=false;
  if(r.ok){ renderAccount(); status(r.say,r.kept?'ok':'fail'); return; }
  accBusy(false); status(r.say,'fail'); });
 return true;}
/* THE PROFILE MENU, round OI. His words: "for the profile, I want a drop down
   that has the left menu settings there. And if I click settings, then it
   takes me to this single page." and "for my profile, it gave me a logout".
   The profile button used to go straight to the Settings page. It opens a menu
   now: the page's own left index (ACC_SECS) as quick doors, each opening the
   page on that section, then Settings, which opens the single page where it
   was left, and Sign out only while signed in. The rows are read off ACC_SECS
   and not typed, so a new section appears here the moment it exists. */
function profMenuShut(){
 var m=document.getElementById('profmenu'), b=document.getElementById('profbtn');
 if(m)m.hidden=true; if(b)b.setAttribute('aria-expanded','false');}
function profMenuGo(k){
 profMenuShut();
 if(k)ACC_OPEN=k;
 setTab(TAB.SETTINGS);}
function profMenu(){
 var b=document.getElementById('profbtn'); if(!b)return;
 var m=document.getElementById('profmenu');
 if(!m){
  m=document.createElement('div'); m.id='profmenu'; m.className='pmenu'; m.setAttribute('role','menu');
  m.setAttribute('aria-label','Profile'); m.hidden=true; document.body.appendChild(m);
  document.addEventListener('click',function(e){
   var x=document.getElementById('profmenu'); if(!x||x.hidden)return;
   if(e.target.closest&&(e.target.closest('#profmenu')||e.target.closest('#profbtn')))return;
   profMenuShut();});
  document.addEventListener('keydown',function(e){
   var x=document.getElementById('profmenu'); if(!x||x.hidden)return;
   if(e.key==='Escape'){profMenuShut(); var pb=document.getElementById('profbtn'); if(pb)pb.focus(); return;}
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    var it=[].slice.call(x.querySelectorAll('[role^=menuitem]')), i=it.indexOf(document.activeElement);
    i=e.key==='ArrowDown'?(i+1)%it.length:(i-1+it.length)%it.length; it[i].focus(); e.preventDefault();}});}
 if(!m.hidden){profMenuShut(); return;}
 var who=capName((typeof CURP!=='undefined'&&CURP&&CURP.name)||'Profile');
 var ses=(typeof authSession==='function')?authSession():null;
 var sfxOn=sfxIsOn();
 m.innerHTML='<div class="pm-who">'+esc(who)+(ses?'<span>'+esc(ses.email)+'</span>':'')+'</div>'
  +ACC_SECS.map(function(s){
   return '<button type="button" role="menuitem" class="pm-it" data-pms="'+s.k+'" style="--c:'+seatCol(s.b)+'">'
    +'<span class="ac-gl"><svg viewBox="0 0 24 24" aria-hidden="true">'+s.ic+'</svg></span>'
    +'<span>'+esc(s.nm)+'</span></button>';}).join('')
  +'<div class="pm-sep" role="separator"></div>'
  +((typeof bedCan==='function'&&bedCan())
   ?'<button type="button" role="menuitemcheckbox" class="pm-it pm-sfx" data-pmsfx="1" aria-checked="'+sfxOn+'">'
    +'<span class="ac-gl"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.5h3l4-3.5v12l-4-3.5h-3z"/>'
    +'<path d="M15.2 9.2a4 4 0 010 5.6M17.6 7a7 7 0 010 10"/></svg></span>'
    +'<span>Sound effects</span><span class="pm-sw" aria-hidden="true"><i></i></span></button>':'')
  /* THE LOG IS REACHABLE WHEN NOTHING IS ON SCREEN. The dock shows for three
     seconds, so its Log button is only there while a message is, and a person
     who looked away needs a door that does not depend on timing. */
  +'<button type="button" role="menuitem" class="pm-it" data-pmlog="1">'
  +'<span class="ac-gl"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14M5 12h14M5 17.5h9"/></svg></span>'
  +'<span>Message log</span></button>'
  +'<button type="button" role="menuitem" class="pm-it pm-all" data-pms="">'
  +'<span class="ac-gl"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/>'
  +'<path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M18 6l-1.6 1.6M7.6 16.4L6 18"/></svg></span>'
  +'<span>Settings</span></button>'
  +(ses?'<button type="button" role="menuitem" class="pm-it" data-pmout="1"><span class="ac-gl"><svg viewBox="0 0 24 24" aria-hidden="true">'
   +'<path d="M9 4.5H6.5A1.5 1.5 0 005 6v12a1.5 1.5 0 001.5 1.5H9M14 8l4 4-4 4M18 12H9"/></svg></span><span>Sign out</span></button>':'');
 m.querySelectorAll('[data-pms]').forEach(function(x){
  x.onclick=function(){profMenuGo(x.getAttribute('data-pms'));};});
 var sw=m.querySelector('[data-pmsfx]');
 if(sw)sw.onclick=function(){
  var want=!sfxIsOn();
  sfxSwitch(want); sw.setAttribute('aria-checked',want?'true':'false');
  if(want&&typeof sfx==='function')sfx('kept');};
 var lg=m.querySelector('[data-pmlog]');
 if(lg)lg.onclick=function(){profMenuShut(); if(typeof msgLogOpen==='function')msgLogOpen();};
 var o=m.querySelector('[data-pmout]');
 if(o)o.onclick=function(){profMenuShut(); if(typeof accSignOut==='function')accSignOut();};
 var r=b.getBoundingClientRect();
 m.style.top=(r.bottom+8)+'px'; m.style.right=Math.max(8,window.innerWidth-r.right)+'px';
 m.hidden=false; b.setAttribute('aria-expanded','true'); b.setAttribute('aria-haspopup','menu');
 var f=m.querySelector('[role^=menuitem]'); if(f)f.focus();}
function accSignOut(){
 if(ACC_BUSY||typeof authSignOut!=='function')return false;
 ACC_BUSY=true; accBusy(true);
 status('Signing out.');
 authSignOut().then(function(r){
  ACC_BUSY=false; renderAccount(); status(r.say,r.ok?'ok':'fail'); });
 return true;}
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
 document.body.classList.toggle('quiet',q);
 /* the practitioner door follows its switch. The switch is the device's and
    not the profile's since 2 October, so a change of profile no longer moves
    the door; this still runs on one because a legacy profile that carries the
    old flag is read until the device has been asked. */
 if(typeof pracPaint==='function')pracPaint();}
/* DELETE IS A REAL CONTROL AND IT SAYS EXACTLY WHAT IT DID. It removes this
   record from this browser. There is no store, so it does not claim to have
   deleted anything from anywhere else, because that would be a lie about the
   one thing a person most needs the truth about. */
/* ONE DELETE, TWO DOORS. This was its own splice, and it had two faults the
   profiles section would have copied: the list was cut before the write was
   known to land, so a refused write reported "Could not write" over a list
   already missing the record, and the mirror in PEOPLE[0] was never refilled,
   so a trip to a worked example and back loaded the deleted profile's field
   onto the one left. It goes through the same path as a delete from the list
   now (accProfDelete), which is atomic in the engine and refills the mirror. */
function accDelete(){
 if(!CURP||PROFILES.indexOf(CURP)<0){status('Nothing was deleted.','fail');return false;}
 var ok=accProfDelete(CURP.id);
 if(ok){ACC_OPEN='privacy'; renderAccount();}
 return ok;}

/* ============================================================
   COMPOSING SOMETHING TO SEND, AND THE HONEST FAILURE.

   Every kind in OB_KINDS through one sheet: a comment, a question, a bug, a
   rating and the questionnaire. The rating and the questionnaire carry their
   answers; the other three carry a body. (This said "four kinds" until the
   comment made it wrong, so the kinds are named and not counted.)

   The line above the field is always the same words and it is there before
   anybody types, per the practice: say it at the moment of contribution, not
   in a policy page. The boundary refuses a mail shaped string or a long run of
   digits by name and never strips them, because a silently cut sentence reads
   back as something the person never said. It will not catch a first name in a
   sentence, and nothing here claims that it does.
   ============================================================ */
/* sentence case, because sh-h is capitalised by the sheet */
var OB_TITLE={question:'Ask a question',bug:'Report something broken',
 rating:'Rate the product',feedback:'Product feedback',comment:'Leave a comment'};
/* the three free text kinds and their names on the switch. The bug's name is
   the row's own words, "something broken", because bug is a programmer's word
   and the row a person pressed to get here did not use it. */
var OB_FREE=[['comment','Comment'],['question','Question'],['bug','Something broken']];
function obFree(k){ return OB_FREE.some(function(x){return x[0]===k;}); }
var OB_LEAD={
 comment:'Anything you want the team to know. What works, what does not, what '
  +'you would change.',
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
 {lens:'What this is',k:'m1',q:'Do you know what this product is for?',
  a:['No idea','Roughly','Yes, I could explain it']},
 {lens:'What this is',k:'m2',q:'Do you know why we are doing this?',
  a:['No','I have a guess','Yes']},
 {lens:'What this is',k:'m3',q:'Who would you hand this to?',
  a:['Nobody','Somebody who is stuck','Somebody who trains hard',
     'Somebody who works with people','Anybody']},
 {lens:'The content',k:'p1',q:'Does the information make sense?',
  a:['No','In places','Yes']},
 {lens:'The content',k:'p2',q:'Do you know what you are reading when a reading prints?',
  a:['No','Some of it','Yes']},
 {lens:'The content',k:'p3',q:'Is the information helpful?',
  a:['It cost me time','Neither','A little','A lot']},
 {lens:'The content',k:'p4',q:'Does the explanation of the problem make sense?',
  a:['No','In places','Yes']},
 {lens:'The content',k:'p5',q:'Does the protocol make sense?',
  a:['No','I understand it and I do not believe it','Mostly','Yes']},
 {lens:'The content',k:'p6',q:'Does the knowledge base make sense?',
  a:['I have not opened it','No','In places','Yes']},
 {lens:'The product',k:'d1',q:'Do you know what you are doing when you open it?',
  a:['No','I work it out each time','Yes']},
 {lens:'The product',k:'d2',q:'How good is it?',
  a:['Bad','Weak','Fine','Good','Very good']},
 {lens:'The product',k:'d3',q:'How would you feel if you could no longer use it?',
  a:['Not bothered','A little disappointed','Very disappointed']}];
var OB_KIND=null, OB_ANS={}, OB_BODY='';
function obCompose(kind){
 OB_KIND=kind; OB_ANS={}; OB_BODY='';
 sheetOpen(obSheet());
 obWire();}
function obSheet(){
 var k=OB_KIND, lim=OB_LIMIT[k]||600;
 var h='<div class="pm-eye">Help</div><p class="sh-h">'+esc(OB_TITLE[k]||'Send')+'</p>'
  +(obFree(k)?'<div class="seg ob-kinds" role="group" aria-label="What this is">'
   +OB_FREE.map(function(x){
    return '<button type="button" data-obk="'+x[0]+'" aria-pressed="'+(x[0]===k)+'">'
     +esc(x[1])+'</button>';}).join('')+'</div>':'')
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
  /* THE DISCLOSURE CHANGED BECAUSE THE FACT DID. "There is nowhere to send
     this yet" was true while no host was bound. One is now, and what it sends
     to is a channel on the team's Discord server, so the line says where it
     lands and who can read it there, before anybody types. Whether that channel
     is private to the team or open to the community is the owner's to set, and
     "anyone who can read that channel" is true either way. */
  +'<p class="sh-p dim">Kept on this device first, then sent to a channel on our '
  +'Discord server. Anyone who can read that channel can read it. Nothing about '
  +'who you are travels with it.</p>';
 return h;}
function obWire(){
 document.querySelectorAll('[data-obq]').forEach(function(b){
  b.onclick=function(){OB_ANS[b.getAttribute('data-obq')]=+b.getAttribute('data-obv');
   var host=document.querySelector('.sheet-bd')||document.body;
   var t=$('obtext'); if(t)OB_BODY=t.value;
   sheetOpen(obSheet()); obWire();
   var t2=$('obtext'); if(t2)t2.value=OB_BODY;};});
 /* the switch redraws the sheet, so what was typed is carried across it the
    way the answer buttons above carry it */
 document.querySelectorAll('[data-obk]').forEach(function(b){
  b.onclick=function(){
   var t=$('obtext'); if(t)OB_BODY=t.value;
   OB_KIND=b.getAttribute('data-obk');
   sheetOpen(obSheet()); obWire();
   var t2=$('obtext'); if(t2)t2.value=OB_BODY;};});
 var c=$('obcancel'); if(c)c.onclick=function(){sheetShut();};
 var s=$('obsend'); if(s)s.onclick=function(){obSend();};}
/* WHAT A DRAIN ENDED IN, AS ONE SENTENCE. Held is said as held and sent only
   as sent, because the drain's state is the only thing that knows. A retry
   carries the reason the host gave, which is ui/auth.js's sentence for what
   the server or the connection did. */
function obSaid(d){
 var dropped=d.refused?' One waiting entry carried something that identifies a '
  +'person, so it was taken out and not sent.':'';
 switch(d.state){
  case 'sent':   return 'Sent. Thank you.'+dropped;
  case 'empty':  return 'Nothing is waiting to send.';
  case 'busy':   return 'Already sending. What you wrote is held on this device.';
  case 'nohost': return 'Held on this device. There is nowhere to send it yet, so '
   +'it waits in the outbox.';
  case 'refused':return 'Nothing was sent. What was waiting carried something that '
   +'identifies a person, so it was taken out of the outbox.';
  default:       return 'Held on this device, not sent yet. '+(d.why||'')
   +' It waits in the outbox and nothing has been thrown away.'+dropped;}}
function obFlush(btn){
 if(btn)btn.disabled=true;
 status('Sending.');
 return obDrainAsync().then(function(d){
  /* the redraw first, because renderAccount does not touch the status line and
     the order makes the sentence the last thing written */
  renderAccount();
  status(obSaid(d),d.state==='sent'||d.state==='empty'?'ok':'fail');
  return d;});}
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
 /* QUEUED SAYS QUEUED. Never sent, because it has not been. The sheet shuts
    on the queue and not on the send: the words are safe on this device the
    moment obQueue says so, and the send is told separately when it answers.
    obDrain was called here and read a promise as a refusal, so once a network
    host was bound nothing would ever have left. */
 sheetShut(); renderAccount();
 obFlush(null);
 return true;}
