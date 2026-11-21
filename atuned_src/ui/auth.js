/* ============================================================
   SIGN IN, AGAINST THE REAL SERVER. Round IA, "I need the login page, I need
   it wired in", round JJ, "the login page is tied to the database", and the
   order that put it first, 30 September: "finish the login first."

   THE ONE SEAM. This is the only file in the product that calls fetch, and it
   stays that way so "the app gains network at exactly one seam" (CLAUDE.md) is
   one grep and not an audit. It lives under ui/ because hostfree.py refuses
   fetch anywhere in engine/, and it should: the engine is pure, and a request
   is a thing the host does. ui/login.js and ui/account.js are its two callers
   and neither of them holds a request of its own.

   WHAT IT DOES AND DOES NOT CARRY. Sign up, sign in, the forgotten password
   request, the new password its link sets, and sign out, against the routes
   the reboot-os Worker serves for them.
   It syncs only on the person's yes. Since 21 November a person signed in
   can turn on Keep my record on my account, and only then does the record,
   without its name, go to the account and come back on another device
   (PROFILE SYNC IS ON, below). Without that yes every story, reading and
   imprint stays in this browser exactly as before. Apart from a pull, one
   field of a profile is written from here and nothing else is: the plan, read back off the account by authPlanTake at the foot of
   this file, because only the server knows what was paid for. The session
   is held under its own key beside the profiles and never inside one: Export
   copies a profile to the clipboard, so a token written onto one would leave
   with the first export, and validateProfile now refuses one by name.

   AND EVERY CALL RESOLVES. A promise that rejects is a failure somebody has to
   remember to catch, and a caller that forgets it is a button that stays
   disabled for ever. authCall never rejects: a dropped connection, a refused
   CORS preflight, a blocked host and a server that never answers all come back
   as status 0, and the timer below turns "never answers" into an answer. The
   file runs with no network at all, which is its ordinary state for most
   people who download it, and nothing here may hang or throw because of that.
   ============================================================ */
/* THE ADDRESS IS PUBLIC AND IS NOT A SECRET. It is the Worker's own
   workers.dev name, printed in HOSTING-SETUP.md, and a browser shows it to
   anybody who opens the network tab. What must never be committed is a key,
   and there is none on this side: the only credential is the person's own
   session token, which the server hands back and this file keeps in their own
   browser. A var so a gate can point it at a stub. */
var AUTH_API='https://atuned-api.lance-o-powell.workers.dev';
/* the production address, kept apart from AUTH_API so a copy that is not
   served from the site can tell it is talking to the real server and not to
   a gate's stub; see authFunnelStart */
var AUTH_API_LIVE=AUTH_API;
var AUTH_KEY='source.session';
var FUNNEL_KEY='funnel.session';
var VOICE_DEV_KEY='source.voicedev';
/* HOW LONG A REQUEST MAY TAKE BEFORE IT IS A FAILURE. A sign in runs a
   deliberately slow hash on the server, so this is generous, and it is still
   a ceiling: a request with none sits on "Checking with the server" for as
   long as a dead connection takes to give up, which in a browser can be
   minutes. */
var AUTH_WAIT_MS=15000;
/* THE SERVER'S OWN BOUNDS, mirrored so a password it will refuse is refused
   here before anything is sent. Read off atuned/server/src/index.js on main,
   30 September: signup requires 8 to MAX_PASSWORD, which is 200, and signin
   refuses over 200. The email shape is the server's validEmail, character for
   character, so this never passes an address the server refuses or refuses
   one it would take. If the server moves either, the server's own refusal
   still arrives and is shown; this only saves a round trip. */
var AUTH_PW_MIN=8, AUTH_PW_MAX=200;
var AUTH_MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* The session in memory, and whether the store has been read into it yet.
   Held in memory as well as in the store because a browser that blocks
   storage still deserves a sign in that lasts the visit, and says so. */
var AUTH_S=null, AUTH_READ=false;
/* READ ONCE THE STORE IS BOUND AND NOT BEFORE. ui/ui.js binds localStorage
   near the end of the build, and a read before that meets the engine's no-op
   store, which answers null. Caching that null would sign a person out for the
   whole visit, so the store is only read, and the read only remembered, once
   STORE_BOUND says there is a real one. Only the two fields a sign in needs
   come back out: the token, and the email to print beside "Signed in as". */
function authSession(){
 if(!AUTH_READ&&typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  AUTH_READ=true;
  try{ var o=JSON.parse(STORE.get(AUTH_KEY)||'null');
   if(o&&typeof o.token==='string'&&o.token&&typeof o.email==='string')
    AUTH_S={token:o.token, email:o.email, accountId:typeof o.accountId==='string'?o.accountId:null}; }
  catch(e){ AUTH_S=null; } }
 return AUTH_S;}
/* True when the write landed, read back to prove it, the way storeSetAside in
   engine/schema.js proves its own. A set that did not throw is not a set that
   landed. */
function authKeep(s){
 AUTH_S=s; AUTH_READ=true;
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 var txt=s?JSON.stringify(s):'';
 try{ STORE.set(AUTH_KEY,txt); return STORE.get(AUTH_KEY)===txt; }catch(e){ return false; }}
function authForget(){ return authKeep(null); }
/* THE FUNNEL SESSION, beside the auth session and never inside the profile.
   The browser holds the one-time credential because it is the proof that this
   browser created the anonymous journey. The server stores only its hash. */
var FUNNEL_S=null, FUNNEL_READ=false;
function funnelSession(){
 if(!FUNNEL_READ&&typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  FUNNEL_READ=true;
  try{
   var o=JSON.parse(STORE.get(FUNNEL_KEY)||'null');
   if(o&&typeof o.id==='string'&&o.id&&typeof o.anonymousId==='string'&&o.anonymousId
    &&typeof o.credential==='string'&&o.credential.length>=32){
    FUNNEL_S=o;
   }
  }catch(e){ FUNNEL_S=null; }
 }
 return FUNNEL_S;
}
function funnelKeep(s){
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 var previous=FUNNEL_S, previousRead=FUNNEL_READ, prior;
 /* A failed read means we cannot establish what rollback must preserve. */
 try{ prior=STORE.get(FUNNEL_KEY); }catch(e){ return false; }
 function restorePrior(){
  try{
   var current=STORE.get(FUNNEL_KEY);
   if(prior===null||prior===undefined){
    if(current===null||current===undefined)return true;
    if(typeof STORE.remove!=='function')return false;
    STORE.remove(FUNNEL_KEY);
    current=STORE.get(FUNNEL_KEY);
    return current===null||current===undefined;
   }
   if(current===prior)return true;
   STORE.set(FUNNEL_KEY,prior);
   return STORE.get(FUNNEL_KEY)===prior;
  }catch(e){ return false; }
 }
 try{
  var txt=s?JSON.stringify(s):'';
  STORE.set(FUNNEL_KEY,txt);
  if(STORE.get(FUNNEL_KEY)===txt){
   FUNNEL_S=s; FUNNEL_READ=true;
   return true;
  }
 }catch(e){}
 /* A non-throwing corrupt write or a partial-write exception must not destroy
    the previous visit credential. Never report success until the exact bytes
    read back, and keep the prior in-memory state on refusal. */
 restorePrior();
 FUNNEL_S=previous; FUNNEL_READ=previousRead;
 return false;
}
function funnelUuid(){
 try{ if(typeof crypto!=='undefined'&&crypto.randomUUID)return crypto.randomUUID(); }catch(e){}
 return 'anon_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);
}
/* Concurrent entrypoints may race before the first session is persisted. Share the
   in-flight create promise, then clear it on either outcome. This complements
   the persisted-session check below: reloads reuse durable state; concurrent
   calls reuse the same network operation. */
var FUNNEL_STARTING=null;
function authFunnelStart(){
 var existing=funnelSession();
 if(existing){ authFunnelJoin(); return Promise.resolve({ok:true,session:existing.session||null,reused:true}); }
 if(FUNNEL_STARTING)return FUNNEL_STARTING.then(function(r){ return Object.assign({},r,{reused:true}); });
 /* A COPY OPENED FROM A FILE NEVER STARTS A FIRST VISIT ON THE REAL SERVER.
    16 October. Every browser gate opens this app from a file, and from 9
    October, when the first visit shipped, every one of those openings made
    a session in production: 6,965 by the first KPI read, all at the door,
    rising by the hundred in the hours the gates ran, against 14 people who
    ever chose a ground. A downloaded copy is the same case: the server
    turns its null origin away for everything else (E3f), so a session it
    cannot use is a count it should not add to. A gate that points AUTH_API
    at its own stub still starts one, which is what the stubs are for. */
 try{ if(location.protocol==='file:'&&AUTH_API===AUTH_API_LIVE)
  return Promise.resolve({ok:false,status:0,body:null,copy:true}); }catch(e){}
 var anonymousId=funnelUuid();
 var request=authCall('POST','/v1/funnel/session',{anonymousId:anonymousId},null,false).then(function(r){
  /* The Worker intentionally creates the anonymous id. Keep the caller's id
     out of the request body so the browser cannot claim somebody else's id. */
  if(!r.ok)return {ok:false,status:r.status,body:r.body};
  var b=r.body||{}, s=b.session;
  if(!s||typeof s.id!=='string'||!s.id||typeof b.credential!=='string'||b.credential.length<32)return {ok:false,status:r.status,body:null};
  var state={session:s,id:s.id,anonymousId:s.anonymousId||anonymousId,credential:b.credential};
  var kept=funnelKeep(state);
  if(!kept)return {ok:false,status:0,body:null,kept:false};
  authFunnelJoin();
  return {ok:true,session:s,reused:false,kept:true};});
 var shared;
 shared=request.then(function(r){
  if(FUNNEL_STARTING===shared)FUNNEL_STARTING=null;
  return r;
 },function(){
  if(FUNNEL_STARTING===shared)FUNNEL_STARTING=null;
  return {ok:false,status:0,body:null};
 });
 FUNNEL_STARTING=shared;
 return shared;
}
/* JOINED TO THE ACCOUNT ONCE BOTH EXIST, WHICHEVER CAME FIRST. The join was
   tried at sign in and nowhere else, and the first visit's session is made by
   onboarding, which opens behind the door. So a person who pressed Create
   account at the door, the ordinary way in, was signed in before the session
   existed: the one try found nothing to join, and the session stayed anonymous
   for good. tests/golden.js walked it and the server held userId null after
   the whole first run. So the join is asked again wherever it can newly
   succeed: when the session is made or found, and after each mark, because
   the Worker refuses a session with no starter gift and will issue that gift
   either with the session or at the first mark (REVIEW-audit-2026-10-09
   pass2.md W3), and a no for that reason must not be the last word. A session
   already joined is never sent again, and one ask is out at a time. */
var FUNNEL_JOINING=false;
function authFunnelJoin(){
 var f=funnelSession(), s=authSession();
 if(!f||!s||f.userId||FUNNEL_JOINING)return Promise.resolve({ok:false,status:0,body:null,asked:false});
 FUNNEL_JOINING=true;
 return authFunnelAttach().then(function(r){ FUNNEL_JOINING=false; return r; });
}
function authFunnelRead(){
 var f=funnelSession(); if(!f)return Promise.resolve({ok:false,status:0,body:null});
 var s=authSession();
 var token=s&&s.token, path='/v1/funnel/session/'+encodeURIComponent(f.id);
 if(token)return authCall('GET',path,null,token);
 return authCall('GET',path,null,null,false);
}
function authFunnelCheckpoint(patch){
 var f=funnelSession(), s=authSession(), extra=f&&f.credential?{'x-funnel-credential':f.credential}:null;
 if(!f||!f.id||!patch)return Promise.resolve({ok:false,status:0});
 return authCall('PATCH','/v1/funnel/session/'+encodeURIComponent(f.id)+'/checkpoint',patch,s&&s.token,false,undefined,extra)
  .then(function(r){
   if(r.ok&&r.body&&r.body.session){
    /* read again now, not the copy taken before the request: a join that
       landed while this mark was out has already written its userId */
    var g=funnelSession()||f;
    funnelKeep(Object.assign({},g,{session:r.body.session,userId:r.body.session.userId||g.userId||null}));
    authFunnelJoin();
    return {ok:true,session:r.body.session};
   }
   return {ok:false,status:r.status,body:r.body};
  });
}
function authFunnelAttach(){
 var f=funnelSession(), s=authSession();
 if(!f||!s)return Promise.resolve({ok:false,status:0,body:null});
 return authCall('POST','/v1/funnel/session/'+encodeURIComponent(f.id)+'/attach',{credential:f.credential},s.token)
  .then(function(r){
   if(r.ok&&r.body&&r.body.session){
    var next=Object.assign({},funnelSession()||f,{session:r.body.session,userId:r.body.session.userId||s.email||null});
    funnelKeep(next);
   }
   return r;
  });
}
function authFunnelClear(){ return funnelKeep(null); }
/* ============================================================
   PROFILE SYNC IS ON, 21 November. The owner, that day: "let's approve the
   privacy copy for now. We'll have a lawyer review that later... We can use
   temporary consent privacy wording for now." The ruling it replaces, 18
   November, held this false "until privacy copy, consent and retention are
   approved together". They are approved now, on a temporary footing, and the
   legal pass is still owed (SYNC_CONSENT_V, below).

   ON IS NOT A DEFAULT FOR A PERSON. This switch makes the feature exist and
   nothing more. Nothing leaves a device until the person signed in on it
   presses Turn on under Settings, Account, beside the words in
   SYNC_CONSENT_SAY, and that yes is held per account, on this device, never
   inside the record (syncConsented). CLAUDE.md's posture for a consequential
   grant is explicit consent, a visible state and revocation, and the group
   that holds the switch carries all three.

   IT WAS NEVER RUN BEFORE TODAY, and two defects were waiting. The eligibility
   test asked for a profiles() that has never existed anywhere in the build
   (DECISIONS.md, "Profile sync, 9 October", found that and it was still
   true), so with the flag on it still skipped every call; and the pull took
   the older copy of the record out of PROFILES after pImport had already
   saved, so the store kept both under one id and the next boot loaded the
   older one beside the new. Both are fixed below, and tests/sync.js is the
   first gate that ever drove this against a server. */
var PROFILE_SYNC_ENABLED=true;
var PROFILE_SYNC_ID='atuned.primary-profile';
var PROFILE_SYNC_META_KEY='source.profile.sync';
var PROFILE_SYNC_TIMER=null;
var PROFILE_SYNC_BUSY=false;
/* the last thing a pass found, for the Account group to show and so the
   status line speaks once per change and not every thirty seconds */
var PROFILE_SYNC_LAST=null, PROFILE_SYNC_SAID='';

/* ============================================================
   THE CONSENT WORDS. TEMPORARY, PENDING LEGAL REVIEW.
   Approved by the owner on 21 November as temporary wording, his words: "add
   a note that needs to be reviewed by legal, but that shouldn't stop us from
   moving forward." Counsel has not read these sentences. They are written to
   be complete and true of the code as it stands (what goes, where, who can
   reach it, how long, how to stop), because a person is agreeing to them
   today, and "temporary" means a lawyer will revise them, not that they are
   loose. Every sentence was read off this file and the reboot-os Worker
   (atuned/server/src/index.js PUT and GET /v1/sync, seal.js, deleteAccount)
   on 21 November.

   WHEN COUNSEL CHANGES THEM, BUMP SYNC_CONSENT_V. A yes is held against the
   version it was given to, so a person who agreed to these words is asked
   again under the new ones rather than carried over to text they never read.
   The same review covers PRIVACY-POLICY.md section 4, 6 and 7, which say the
   same thing at length, and its counsel notes list this item.

   THE NAME IS NOT IN THE COPY. DECISIONS.md, "The name never leaves", is a
   standing ruling and the sync is held to it: profileSyncBare takes the
   profile name and the first, middle and last name off before anything is
   sent, and a pull puts this device's own back (profileSyncDress). Birth
   details do go, and the words say so, because a record brought to a new
   device without them cannot draw the blueprint it was read from. */
var SYNC_CONSENT_V='2026-11-21-temporary';
var SYNC_CONSENT_KEY='source.sync.consent';
var SYNC_CONSENT_SAY=[
 'Turned on, a copy of this record is kept on our server under your account, so it opens on any device you log in on.',
 'The copy holds your stories, answers, readings, snapshots, imprints, releases, practices, avatar, purpose, plan and birth details.',
 'It never holds the name you enter. That stays on this device, and on a new device you enter it again.',
 'The copy is sealed with a key before it is stored. Only the people who run Atüned can open it, to fix a fault or answer you.',
 'It is never sold, never used for ads, never shared for research, and no AI model is trained on it.',
 'Turn this off and the copy on our server is removed. Delete this account removes it too. The record on this device stays either way.'];
function syncConsentRead(){
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return null;
 try{ var o=JSON.parse(STORE.get(SYNC_CONSENT_KEY)||'null'); return o&&typeof o==='object'?o:null; }
 catch(e){ return null; }}
/* a yes counts for the account it was given under and the words it was given
   to, and for nothing else */
function syncConsented(){
 var o=syncConsentRead(), id=profileSyncIdentity();
 return !!(o&&id&&o.id===id&&o.v===SYNC_CONSENT_V);}
/* True when the yes landed, read back, the way authKeep proves its own. A yes
   the browser would not keep is refused rather than held for the visit: it
   would read as on until a reload quietly turned it off, which is a state the
   person never chose. */
function syncConsentGive(){
 var id=profileSyncIdentity();
 if(!id||typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 var txt=JSON.stringify({id:id, v:SYNC_CONSENT_V, at:new Date().toISOString()});
 try{ STORE.set(SYNC_CONSENT_KEY,txt); return STORE.get(SYNC_CONSENT_KEY)===txt; }catch(e){ return false; }}
function syncConsentDrop(){
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 try{ STORE.set(SYNC_CONSENT_KEY,''); return !STORE.get(SYNC_CONSENT_KEY); }catch(e){ return false; }}

function profileSyncMeta(){
 try{
  var o=JSON.parse(STORE.get(PROFILE_SYNC_META_KEY)||'null');
  return o&&typeof o==='object'?o:{accountId:null,version:0,hash:'',updated:null};
 }catch(e){ return {accountId:null,version:0,hash:'',updated:null}; }
}
function profileSyncIdentity(){
 var s=authSession();
 return s&&((typeof s.accountId==='string'&&s.accountId)||String(s.email||'').toLowerCase())||'';
}
async function profileSyncHash(text){
 try{
  var bytes=new TextEncoder().encode(text);
  var digest=await crypto.subtle.digest('SHA-256',bytes);
  return Array.prototype.map.call(new Uint8Array(digest),function(b){
   return ('0'+b.toString(16)).slice(-2);
  }).join('');
 }catch(e){ return String(text.length)+':'+text.slice(0,64); }
}
function profileSyncMetaSave(meta){
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 try{ STORE.set(PROFILE_SYNC_META_KEY,JSON.stringify(meta)); return true; }catch(e){ return false; }
}
/* PROFILES, NOT profiles(). The second never existed, so this was false on
   every call from the day it was written. And the open record must be the one
   this account synced: with two records on a device, opening the second and
   letting a pass run would push it over the first one's account copy, so a
   record that is not the synced one is left alone (meta.profileId). */
function profileSyncEligible(){
 if(!(PROFILE_SYNC_ENABLED&&authSession()&&syncConsented()&&typeof CURP!=='undefined'&&CURP
  &&typeof pExport==='function'&&typeof pImport==='function'&&typeof S!=='undefined'&&(!S.who||S.who===0)
  &&typeof PROFILES!=='undefined'&&Array.isArray(PROFILES)))return false;
 var m=profileSyncMeta();
 return !(m.accountId===profileSyncIdentity()&&m.profileId&&m.profileId!==CURP.id);
}
/* The name off, a copy. DECISIONS.md: "The name never leaves." */
function profileSyncBare(p){
 var o=JSON.parse(JSON.stringify(p));
 delete o.name;
 if(o.who&&typeof o.who==='object'){o.who.first=''; o.who.middle=''; o.who.last='';}
 return o;}
/* and this device's own name back onto a copy that came without one */
function profileSyncDress(remote,local){
 var o=JSON.parse(JSON.stringify(remote));
 o.name=(local&&typeof local.name==='string'&&local.name)||o.name||'You';
 var lw=(local&&local.who)||{};
 if(o.who&&typeof o.who==='object')['first','middle','last'].forEach(function(f){
  o.who[f]=typeof lw[f]==='string'?lw[f]:'';});
 return o;}
/* the live row, and the highest version the server holds for this id, live
   or removed. A removed row still owns its version on the server, which keeps
   only a higher one: a push after Turn off and Turn on again that started
   back at one would be answered stale for ever. */
function profileSyncReadRemote(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,status:0,body:null});
 return authCall('GET','/v1/sync',null,s.token).then(function(r){
  if(!r.ok)return r;
  var rows=(r.body&&Array.isArray(r.body.records))?r.body.records:[];
  var found=null, top=0;
  rows.forEach(function(x){
   if(!x||x.kind!=='state'||x.id!==PROFILE_SYNC_ID)return;
   if(Number.isInteger(x.version)&&x.version>top)top=x.version;
   found=x.deleted?null:x;
  });
  return {ok:true,status:r.status,body:found,version:top};
 });
}
function profileSyncPush(profile,version,gone){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,status:0,body:null});
 return authCall('PUT','/v1/sync',{
  records:[{kind:'state',id:PROFILE_SYNC_ID,version:version,body:gone?null:profileSyncBare(profile),deleted:!!gone}]
 },s.token).then(function(r){
  if(!r.ok)return r;
  var kept=(r.body&&Array.isArray(r.body.kept))?r.body.kept:[];
  var accepted=kept.some(function(x){
   return x&&x.kind==='state'&&x.id===PROFILE_SYNC_ID&&x.version===version;
  });
  return {ok:accepted,status:r.status,body:r.body};
 });
}
/* THE PULL, AND IT SAVES WHAT IT LEAVES. pImport pushes the incoming copy and
   saves, and the older copy under the same id was spliced out after that save,
   so the store still held both and the next boot read two records with one id
   (every verb keyed by id reaches only the first). The splice is saved now,
   and a save that fails says so through the same status the import uses. A
   copy with a different id is a different record: it is opened beside the one
   already here, which pImport keeps, and beside says so. */
function profileSyncImport(remote,remoteVersion){
 var text=JSON.stringify(remote);
 var imported=pImport(text,true);
 if(!imported)return {ok:false, why:(typeof importError==='function'&&importError())||null};
 var list=PROFILES, beside=false;
 for(var i=list.length-1;i>=0;i--){
  if(list[i]&&list[i]!==imported){ if(list[i].id===imported.id)list.splice(i,1); else beside=true; }
 }
 if(typeof pPersist==='function'&&!pPersist())return {ok:false, why:['could not save: '+((typeof SAVE_ERR!=='undefined'&&SAVE_ERR)||'error')]};
 return {ok:true,text:text,version:remoteVersion,updated:imported.updated||null,beside:beside};
}
function authProfileSync(){
 if(PROFILE_SYNC_BUSY||!profileSyncEligible())return Promise.resolve({state:'skip'});
 PROFILE_SYNC_BUSY=true;
 var done=function(r){PROFILE_SYNC_BUSY=false; return r;};
 /* THE RECORD AS SAVED, NOT pExport. pExport runs saveProfile, which stamps
    updated with the moment of the call, so every pass read this side as just
    written: its hash never matched the last one and it was pushed every
    thirty seconds, and no copy from another device could ever be newer, so
    the pull below never ran. The saved record carries the stamp of its last
    real save, which is the fact the comparison needs. */
 var localText;
 try{ localText=JSON.stringify(CURP); }catch(e){return Promise.resolve(done({state:'refused'}));}
 if(!localText)return Promise.resolve(done({state:'refused'}));
 var local;
 try{ local=JSON.parse(localText); }catch(e){return Promise.resolve(done({state:'refused'}));}
 if(!local||typeof local!=='object')return Promise.resolve(done({state:'refused'}));
 return Promise.all([profileSyncHash(localText),profileSyncReadRemote()]).then(function(pair){
  var localHash=pair[0], rr=pair[1], meta=profileSyncMeta(), identity=profileSyncIdentity();
  if(!rr.ok)return done({state:'retry',status:rr.status,why:rr.body&&rr.body.error});
  var remote=rr.body&&rr.body.body&&typeof rr.body.body==='object'?profileSyncDress(rr.body.body,local):null;
  var remoteVersion=rr.body&&Number.isInteger(rr.body.version)?rr.body.version:0;
  var topVersion=Math.max(remoteVersion,rr.version||0);

  /* ALWAYS KEEP THE HIGHER NUMBER, accounts-badges. Both pulls below used to
     import the remote profile whole, so a device with the newer stamp and
     the shorter record took every badge the other had earned off it.
     ladderKeep (engine/ladder.js) carries the ritual list and the ground
     opened across from this side, and names any mark it cannot carry; while
     it names one nothing is pulled and nothing is pushed. Read on the pull
     only: a push sends this side, which is the higher one by then, and
     holding it as well would leave the higher record unable to leave. */
  var keep=remote&&typeof ladderKeep==='function'?ladderKeep(local,remote,Date.now()):null;
  if(keep&&!keep.lost.length)keep.remote=keep.kept;
  /* AND NEVER ERASE A STORY OR A SNAPSHOT, 21 November. A record this device
     holds under the same id is replaced by a pull, so what it has that the
     incoming copy lacks is counted first (syncAtRisk) and the pull is held
     while anything would go. A copy under another id replaces nothing. */
  var same=remote&&remote.id===local.id;
  var mine=same&&typeof syncAtRisk==='function'?syncAtRisk(local,remote):null;
  var held=function(){
   return done({state:'held',lost:(keep&&keep.lost)||[],mine:mine||{stories:0,snaps:0},theirs:{stories:0,snaps:0}});};
  var blocked=function(){return (keep&&keep.lost.length)||(mine&&syncAtRiskAny(mine));};
  /* the hash a pull records is the server's copy and not the kept one, so a
     pull that carried this side's rituals across differs from it on the next
     pass and is pushed, and the other device gets the union too. Where
     nothing was carried the two are the same text, as before. */
  var remoteText=remote?JSON.stringify(remote):'';
  var pull=function(first){
   if(blocked())return held();
   var pulled=profileSyncImport(keep?keep.remote:remote,remoteVersion);
   if(!pulled.ok)return done({state:'refused',why:pulled.why});
   return profileSyncHash(remoteText).then(function(remoteHash){
    profileSyncMetaSave({accountId:identity,profileId:CURP&&CURP.id,version:remoteVersion,hash:remoteHash,updated:pulled.updated});
    if(typeof render==='function')render();
    return done({state:first?'pulled-first':'pulled',version:remoteVersion,beside:pulled.beside});
   });
  };

  /* First association with an account is deliberately conservative. */
  if(meta.accountId!==identity){
   if(remote)return pull(true);
   meta={accountId:identity,profileId:local.id,version:topVersion,hash:'',updated:local.updated||null};
   profileSyncMetaSave(meta);
  }
  else if(remote){
   var lu=local.updated?Date.parse(local.updated):0;
   var ru=remote.updated?Date.parse(remote.updated):0;
   if(ru>lu)return pull(false);
  }

  if(meta.hash===localHash&&topVersion===meta.version)return done({state:'clean',version:meta.version});

  /* THE PUSH HAS THE SAME DUTY THE OTHER WAY. Another device that wrote since
     this one last synced moved the server's version on; if its copy holds a
     story or a snapshot this side does not, sending this side would erase it
     from the account, so the push is held and named too. A copy this device
     itself sent last time is not checked: what it lacks now, this person took
     out here on purpose. */
  if(remote&&remoteVersion>(meta.version||0)&&typeof syncAtRisk==='function'){
   var theirs=syncAtRisk(remote,local);
   if(syncAtRiskAny(theirs))return done({state:'held',lost:[],mine:{stories:0,snaps:0},theirs:theirs});
  }
  var nextVersion=Math.max(meta.version||0,topVersion)+1;
  return profileSyncPush(local,nextVersion).then(function(pr){
   if(!pr.ok)return done({state:'retry',status:pr.status,why:pr.body&&pr.body.error});
   profileSyncMetaSave({accountId:identity,profileId:local.id,version:nextVersion,hash:localHash,updated:local.updated||null});
   return done({state:'pushed',version:nextVersion});
  });
 }).catch(function(){
  return done({state:'retry'});
 });
}
/* WHAT A PASS FOUND, SAID TO THE PERSON. Every pass resolved to a state and
   nothing read it, so a held pull was held in silence and a refusal from the
   server looked like a sync that worked. Each state that changes what the
   person has is said once through status(), the channel every other write in
   the product reports through, and the Account group reads the same answer
   (profileSyncLine). A pass that found nothing new says nothing. */
function profileSyncCount(n,one,many){return n+' '+(n===1?one:many);}
function profileSyncWhat(x){
 var a=[];
 if(x&&x.stories)a.push(profileSyncCount(x.stories,'story','stories'));
 if(x&&x.snaps)a.push(profileSyncCount(x.snaps,'snapshot','snapshots'));
 return a.join(' and ');}
function profileSyncLine(r){
 r=r||PROFILE_SYNC_LAST;
 if(!r)return '';
 if(r.state==='held'){
  var nm=(r.lost||[]).map(function(k){
   var m=(typeof MARKS!=='undefined')&&MARKS.filter(function(x){return x.k===k;})[0];
   return m?m.nm:k;});
  var why=r.mine&&syncAtRiskAny(r.mine)?'This device has '+profileSyncWhat(r.mine)+' the account copy does not.'
   :r.theirs&&syncAtRiskAny(r.theirs)?'The account copy has '+profileSyncWhat(r.theirs)+' from another device that this one does not.'
   :'The account copy would take '+nm.join(', ')+' off this record.';
  return 'Not synced. '+why+' Nothing was replaced or sent, so both copies are as they were. '
   +'Export this record, under Privacy, keeps a copy of this one.';}
 if(r.state==='refused')return 'Not synced. The account copy did not load'
  +(r.why&&r.why.length?': '+r.why.join('; '):'')+'. This record is as it was.';
 if(r.state==='retry'&&r.status===413)return 'Not synced. This record is too large for the account copy. It is safe on this device.';
 if(r.state==='retry'&&r.status&&r.status!==401)return 'Not synced. '
  +(r.why?authSay(r.why):'The server refused it, with code '+r.status+'.')+' This record is safe on this device.';
 if(r.state==='retry')return 'Not synced yet. The server could not be reached. This record is safe on this device.';
 if(r.state==='pulled-first'||r.state==='pulled')return 'Brought your record over from your account.'
  +(r.beside?' The record that was already on this device is kept under Profiles.':'');
 if(r.state==='pushed'||r.state==='clean')return 'Synced. The account copy matches this record.';
 return '';}
function profileSyncSay(r){
 if(!r||r.state==='skip')return r;
 var shown=profileSyncLine(PROFILE_SYNC_LAST);
 PROFILE_SYNC_LAST=r;
 var line=profileSyncLine(r);
 /* clean and pushed are the ordinary pass, every thirty seconds: shown on the
    Account group, never put on the status line */
 var loud=r.state!=='clean'&&r.state!=='pushed';
 if(loud&&line&&line!==PROFILE_SYNC_SAID&&typeof status==='function')
  status(line,(r.state==='held'||r.state==='refused'||r.state==='retry')?'warn':undefined);
 PROFILE_SYNC_SAID=loud?line:'';
 /* redrawn only when the line moved, so a pass every thirty seconds never
    rebuilds a page somebody is reading */
 if(line!==shown&&typeof S!=='undefined'&&typeof TAB!=='undefined'&&S.tab===TAB.SETTINGS&&typeof renderAccount==='function'
  &&typeof ACC_OPEN!=='undefined'&&ACC_OPEN==='account')renderAccount();
 return r;}
function profileSyncRun(){ return authProfileSync().then(profileSyncSay); }
function profileSyncStart(){
 /* the timer runs only with the person's yes for this account; without it a
    sign in is a sign in and nothing else, as it was before sync existed */
 if(!PROFILE_SYNC_ENABLED||!authSession()||!syncConsented()){profileSyncStop();return false;}
 if(PROFILE_SYNC_TIMER)clearInterval(PROFILE_SYNC_TIMER);
 PROFILE_SYNC_TIMER=setInterval(function(){profileSyncRun();},30000);
 profileSyncRun();
 return true;
}
function profileSyncStop(){
 if(PROFILE_SYNC_TIMER){clearInterval(PROFILE_SYNC_TIMER);PROFILE_SYNC_TIMER=null;}
 PROFILE_SYNC_BUSY=false;
}
/* TURN ON. The yes is held first and the first pass runs on it. Resolves
   {ok, say}, never rejects. */
function profileSyncOn(){
 if(!authSession())return Promise.resolve({ok:false, say:'Log in first. The copy is kept under an account.'});
 if(!syncConsentGive())return Promise.resolve({ok:false,
  say:'Storage is blocked in this browser, so the yes could not be kept. Nothing was sent.'});
 PROFILE_SYNC_LAST=null; PROFILE_SYNC_SAID='';
 if(PROFILE_SYNC_TIMER)clearInterval(PROFILE_SYNC_TIMER);
 PROFILE_SYNC_TIMER=setInterval(function(){profileSyncRun();},30000);
 return authProfileSync().then(function(r){
  profileSyncSay(r);
  return {ok:true, say:'Kept on your account. '+(profileSyncLine(r)||'')};});}
/* TURN OFF, AND THE COPY GOES. The words promise "turn this off and the copy
   on our server is removed", so off is a removal sent to the server and not
   only a timer stopped. The server keeps only a higher version, so the
   removal is sent one above the highest it holds. The yes is dropped here
   whatever the server answers, because off is what the person chose; what
   the server did is said as it is, and a removal that did not land says how
   to finish it. */
function profileSyncOff(){
 var s=authSession();
 profileSyncStop();
 var dropped=syncConsentDrop();
 PROFILE_SYNC_LAST=null; PROFILE_SYNC_SAID='';
 if(!s)return Promise.resolve({ok:dropped, say:'Turned off.'});
 return profileSyncReadRemote().then(function(rr){
  if(!rr.ok)return {ok:false, say:'Turned off on this device. The server could not be reached, so the account copy is still there. '
   +'Turn it on and off again once you are online, or Delete this account, to remove it.'};
  var meta=profileSyncMeta();
  if(!rr.body){ profileSyncMetaSave({accountId:null,version:0,hash:'',updated:null});
   return {ok:true, say:'Turned off. There was no account copy to remove.'}; }
  var v=Math.max(meta.version||0,rr.version||0)+1;
  return profileSyncPush(null,v,true).then(function(pr){
   if(!pr.ok)return {ok:false, say:'Turned off on this device. The server did not remove the account copy'
    +(pr.body&&pr.body.error?': '+authSay(pr.body.error):'.')+' Turn it on and off again, or Delete this account, to remove it.'};
   profileSyncMetaSave({accountId:null,version:0,hash:'',updated:null});
   return {ok:true, say:'Turned off. The copy on our server is removed. This record stays on this device.'};});});}
/* One request. Resolves to {ok, status, body, late}, and never rejects. With
   blob set, a yes comes back as the bytes and not as parsed text, because the
   voice route answers audio; a no is still the server's json and still read
   as one, so its error reaches authWhy the same way every other route's does.
   base is the host the path is appended to, AUTH_API unless a caller names
   another: the feedback relay is on the site's own host and not the Worker's,
   and a second fetch for it would be a second seam. */
function authCall(method,path,body,token,blob,base,extraHeaders){
 return new Promise(function(done){
  var ctl=null, timer=null, over=false;
  var end=function(r){ if(over)return; over=true; clearTimeout(timer); done(r); };
  if(typeof fetch!=='function'){ end({ok:false, status:0, body:null}); return; }
  try{ ctl=new AbortController(); }catch(e){ ctl=null; }
  timer=setTimeout(function(){
   if(ctl)try{ ctl.abort(); }catch(e){}
   end({ok:false, status:0, body:null, late:true}); },AUTH_WAIT_MS);
  var h={};
  if(body)h['Content-Type']='application/json';
  if(token)h.Authorization='Bearer '+token;
  if(extraHeaders)Object.keys(extraHeaders).forEach(function(k){h[k]=extraHeaders[k];});
  var req;
  /* credentials omit: the session is the bearer header and nothing else, so no
     cookie of any host's is ever sent along with it. */
  try{ req=fetch((base===undefined?AUTH_API:base)+path,{method:method, headers:h,
   body:body?JSON.stringify(body):undefined, signal:ctl?ctl.signal:undefined,
   cache:'no-store', credentials:'omit'}); }
  catch(e){ end({ok:false, status:0, body:null}); return; }
  /* the body is read as text and parsed here, because a Cloudflare error page
     in front of the Worker is HTML with a real status, and res.json() on it
     would throw away the status along with the page. */
  req.then(function(res){
    if(blob&&res.ok)return res.blob().then(function(b){ return {ok:true, status:res.status, body:b}; },
     function(){ return {ok:false, status:res.status, body:null}; });
    return res.text().then(function(t){
     var b=null; try{ b=JSON.parse(t); }catch(e){ b=null; }
     return {ok:res.ok, status:res.status, body:b}; },
    function(){ return {ok:res.ok, status:res.status, body:null}; }); },
   function(){ return {ok:false, status:0, body:null}; })
  .then(end,function(){ end({ok:false, status:0, body:null}); });});}
/* WHERE FEEDBACK GOES, 3 October. This posted to the reboot-os Worker's
   /v1/feedback, which is a second deploy in a second repository and a cross
   origin request. It goes to functions/feedback.js now, a Cloudflare Pages Function
   that ships with atuned.world itself, so the address is relative and is the
   site's own host wherever the site is deployed, preview or production. A var
   so a gate can point it at a stub, exactly as AUTH_API is. */
var FEEDBACK_URL='/feedback';
/* A RELATIVE ADDRESS HAS NO HOST IN A FILE. Opened from disk, which is how
   every handover build reaches the owner, "/feedback" resolves to the root of
   the person's own drive, and the fetch fails as "could not reach the server",
   which is false: the connection is fine and the server was never asked. So a
   file copy is told the true reason before any request, and the entry is held
   like any other no. An absolute FEEDBACK_URL, the gate's stub, is used as it
   is. */
function feedbackWhere(){
 if(/^https?:\/\//.test(FEEDBACK_URL))return FEEDBACK_URL;
 return /^https?:$/.test(location.protocol)?FEEDBACK_URL:'';}
/* THE OUTBOX'S SENDER, 2 October. The owner: "the data gets dumped to
   Discord". The Discord webhook is never in this file: a webhook address lets
   whoever holds it post as the team, and anything here is read by everyone
   who opens the file, so it is a Cloudflare Pages variable,
   DISCORD_FEEDBACK_WEBHOOK, and functions/feedback.js relays. This posts the
   outbox's own envelope, already validated by obDrainAsync, to FEEDBACK_URL
   and nothing else.

   NO TOKEN, EVEN WHEN SIGNED IN. The sheet says "nothing about who you are
   travels with it", and a bearer header would let the server join the words to
   an account. authCall sends Authorization only when handed a token, so null
   here is the whole of that promise.

   Resolves true on a yes, {drop} on a refusal no retry can change (below),
   and rejects with authWhy's sentence on a no, because
   obDrainAsync keeps the entry on a rejection and carries its message to the
   status line. Until the Function is deployed the site answers a post with
   404 or 405, because a static host takes no posts, and until the variable is
   set the Function answers 503 in its own words, and all three are a held
   entry and a sentence, never a loss. */
function authFeedback(e){
 var at=feedbackWhere();
 if(!at)return Promise.reject(new Error('This copy is opened from a file, and only '
  +'the one at atuned.world can send.'));
 return authCall('POST','',e,null,false,at).then(function(r){
  if(r.ok)return true;
  /* THE RELAY'S OWN REFUSAL OF THIS ENVELOPE IS FINAL. A 400, 413 or 415
     carrying the Function's json is its boundary saying no to these exact
     bytes, and sending them again gets the same answer for ever: held, the
     entry stopped every later one behind it (16 October, measured). It is
     handed back as {drop} so the outbox takes it out and says why. Only with
     the Function's own json: the same status from Cloudflare in front of it
     is an HTML page about the edge, not about the envelope, and is held. */
  if((r.status===400||r.status===413||r.status===415)&&r.body&&r.body.ok===false
   &&typeof r.body.error==='string')
   return {drop:'the server refused it as it was: '+r.body.error};
  throw new Error(r.status===404||r.status===405?'The server does not take these yet.'
   :authWhy(r,'feedback')); });}
/* THE SERVER'S OWN WORDS, SET IN SENTENCE CASE. Its errors are lower case
   ("too many attempts. wait fifteen minutes"), and they are the true reason,
   so they are shown rather than rewritten. Rewriting them would also mean
   typing the server's numbers into this file, the fifteen minutes and the
   eight characters, which is the defect CLAUDE.md records a dozen times. */
function authSay(s){
 s=String(s||'').trim(); if(!s)return '';
 s=s.replace(/(^|[.?]\s+)([a-z])/g,function(m,a,b){return a+b.toUpperCase();});
 return /[.?]$/.test(s)?s:s+'.';}
/* What went wrong, as one sentence. Three answers are this file's because
   the server's word for them would mislead here: no connection has no server
   words at all, a refused sign in must not say which of the two fields was
   wrong, and a taken email has a route the server cannot name. */
function authWhy(r,route){
 if(r.late)return 'The server did not answer in time. Try again.';
 /* A DOWNLOADED COPY IS TOLD THE TRUE REASON. Golden E3f, closed 15 October:
    a file page sends the null origin, the server turns it away before any
    answer arrives, and this line blamed the person's connection, which was
    fine. feedbackWhere makes the same protocol check for the outbox. */
 /* The outbox is not an account route: a file copy with an absolute feedback
    address can send, and feedbackWhere already names the true reason when
    it cannot, so the sentence below is for the account, billing and reset
    routes only. */
 if(!r.status&&route!=='feedback'&&!/^https?:$/.test(location.protocol))
  return 'This is a downloaded copy, and the server turns a downloaded copy away. Only the copy at atuned.world can make an account or sign in.';
 if(!r.status)return 'Could not reach the server. Check the connection and try again.';
 if(route==='signin'&&r.status===401)return 'No account matches that email and password.';
 if(route==='signup'&&r.status===409)return 'An account already uses that email. Log in instead.';
 var said=(r.body&&typeof r.body.error==='string')?authSay(r.body.error):'';
 return said||('The server refused that, with code '+r.status+'.');}
/* Refused here, before a request, when the server would refuse it anyway. A
   new account is held to the length; an existing one is not, because an
   account made under an older rule must still be able to sign in. */
function authFieldsWhy(mail,pw,isNew){
 if(!mail)return 'Enter an email address.';
 if(!AUTH_MAIL.test(mail)||mail.length>254)return 'The email address is not complete.';
 if(pw===undefined)return '';
 return authPwWhy(pw,isNew);}
/* The password half, on its own because the reset screen has a password and
   no email. One copy of the bounds and of their sentences, so a new account
   and a new password cannot drift apart: the Worker holds signup and reset
   to the same 8 to MAX_PASSWORD. */
function authPwWhy(pw,isNew){
 if(!pw)return 'Enter a password.';
 if(pw.length>AUTH_PW_MAX)return 'A password can be at most '+AUTH_PW_MAX+' characters.';
 if(isNew&&pw.length<AUTH_PW_MIN)return 'A password needs at least '+AUTH_PW_MIN+' characters.';
 return '';}
/* SIGN IN OR SIGN UP. Both routes answer the same shape, a token and the
   account, so one function carries both. Resolves {ok, kept, say}: say is the
   sentence to show, and kept is false when the browser would not hold the
   session, which is still a sign in and is said as one that ends on reload. */
var AUTH_UNKEPT=' Storage is blocked in this browser, so the sign in ends on reload.';
/* THE FIRST THING A DEVICE SEES OF AN OLDER ACCOUNT IS NOTHING, AND THAT IS
   NOT SAID ANYWHERE, 18 November: his words, after signing in on a device
   with no local record and reading a blank Dashboard, "my account's not
   being set up." It is not a broken sign in. PROFILE_SYNC_ENABLED is still
   false (owner ruling, above: sync is not part of alpha until privacy copy,
   consent and retention are approved together), so a sign in never pulls a
   story onto a device that does not already hold one; the record stays
   wherever it was written. "Signed in as X." said that truthfully and said
   nothing about why the screen behind it was empty, which read as broken
   rather than as the device's own first run. This does not turn sync on; it
   only stops the silence. authSyncNote names the real condition (this
   account has never been seen on this device, read off the same identity
   key profileSyncMeta already keys sync by) rather than guessing from
   whether the profile looks empty, which would be wrong for a returning
   device with a real, full record.
   SYNC WENT ON 21 November, behind the person's own yes, so the sentence
   names the door instead of saying the record cannot come over. With the yes
   already given for this account it says nothing here: the pass that just
   started says what it brought (profileSyncSay). */
function authSyncNote(acc,mail){
 if(PROFILE_SYNC_ENABLED&&typeof syncConsented==='function'&&syncConsented())return '';
 var identity=(typeof acc.id==='string'&&acc.id)||String(mail||'').toLowerCase();
 var seen=false;
 try{ seen=profileSyncMeta().accountId===identity; }catch(e){}
 if(seen)return '';
 return PROFILE_SYNC_ENABLED
  ?' Your story stays on this device. To open it on your other devices, turn on Keep my record on my account, under Account.'
  :' Your story stays on this device; it does not come over from another one yet.';}
function authEnter(route,mail,pw){
 var bad=authFieldsWhy(mail,pw,route==='signup');
 if(bad)return Promise.resolve({ok:false, say:bad});
 return authCall('POST','/v1/auth/'+route,{email:mail, password:pw}).then(function(r){
  var b=r.body||{}, acc=b.account||{};
  if(!r.ok)return {ok:false, say:authWhy(r,route)};
  if(typeof b.token!=='string'||!b.token)
   return {ok:false, say:'The server answered without a sign in. Nothing changed.'};
  var held=authHold(b,mail);
  return {ok:true, kept:held.kept,
   say:(route==='signup'?'Account created. ':'')+'Signed in as '+held.s.email+'.'
    +(route==='signin'?authSyncNote(acc,mail):'')
    +(held.kept?'':AUTH_UNKEPT)};});}
/* A SESSION THE SERVER HANDED BACK, HELD, and everything a sign in starts.
   Out of authEnter because a reset answers the same {token, account} and is a
   sign in too: a copy of these lines in the reset path would be the first
   place a step added here later went missing. b carries a token; mail is the
   address typed, used only when the server did not name one. */
function authHold(b,mail){
 var acc=b.account||{};
 var s={token:b.token, email:typeof acc.email==='string'?acc.email:String(mail||'').toLowerCase(),
  accountId:typeof acc.id==='string'?acc.id:null};
 var kept=authKeep(s);
 /* the plan and the funnel session both use the same bearer boundary.
    Funnel attachment is best effort here because the session or its gift may
    not exist yet; authFunnelJoin asks again when the session is made and
    after each mark, so this is the first ask and not the only one. */
 authFunnelJoin();
 /* the plan is read after the sign in is held, and not waited on: the
    caller says "Signed in as" now, and the plan speaks after it only if the
    record changed. A second device is exactly this path. */
 authPlanRead();
 profileSyncStart();
 return {s:s, kept:kept};}
/* THE FORGOTTEN PASSWORD SAYS WHAT THE SERVER SAYS, AND NO MORE. The server
   answers the same whether or not the address has an account, on purpose, so
   that this form cannot be used to find out who has one. The sentence here is
   one sentence for both cases for the same reason. It names the condition
   rather than promising an email, because for an address with no account no
   email is coming, and a line that promised one would be a lie to exactly the
   person who typed the wrong address. */
function authForgot(mail){
 var bad=authFieldsWhy(mail);
 if(bad)return Promise.resolve({ok:false, say:bad});
 return authCall('POST','/v1/auth/forgot',{email:mail}).then(function(r){
  if(r.ok)return {ok:true,
   say:'If an account uses that email, a link to set a new password is on its way.'};
  return {ok:false, say:authWhy(r,'forgot')};});}
/* THE LINK THAT MAIL CARRIES, open item M3. The Worker mails
   <APP_URL>/?reset=<token> and confirms it at POST /v1/auth/reset, and until
   this nothing read it: the link opened the plain Log in card, so the one way
   back into a record for somebody who had forgotten the password led to the
   door that asks for it.

   OFF THE ADDRESS WHILE THIS FILE IS PARSED, BEFORE ANY REQUEST. The token
   opens the account for an hour. Left on the address it goes into history,
   into the Referer of every request the page sends, and into any picture of
   the address bar, and the boot sends requests early: with a session held,
   the first line of the login step is authCheck asking /v1/me, and the
   onboarding behind it asks the funnel for a session (ui/onboard.js), and
   tests/reset.js read the token off both their Referers before this was
   here. Taken anywhere after that first line, it would already have left.
   So it is taken at load, which is before every boot step, and held only in
   the var below. Never in the store, never on a profile, never on the status
   line: authWhy repeats the server's words, and the server never repeats a
   token.

   The query is what the Worker sends; the hash is read too, because a mail
   client or a shortener can move a parameter there. Only reset= comes out of
   either, so ?dev=1 survives, and a record link after #r= is never parsed,
   because its payload is not a query string and rewriting it could cut it. */
var AUTH_RESET_T='';
function authResetTake(){
 var t='';
 try{
  var q=new URLSearchParams(location.search||''), h=String(location.hash||''), hq=null, moved=false;
  if(q.has('reset')){ t=q.get('reset')||''; q.delete('reset'); moved=true; }
  if(h.indexOf('#r=')!==0&&/(^#|&)reset=/.test(h)){
   hq=new URLSearchParams(h.slice(1)); t=t||hq.get('reset')||''; hq.delete('reset'); moved=true; }
  if(moved){
   var rest=q.toString(), hr=hq?hq.toString():h.slice(1);
   history.replaceState(history.state,'',location.pathname+(rest?'?'+rest:'')+(hr?'#'+hr:'')); } }
 catch(e){}
 return t;}
AUTH_RESET_T=authResetTake();
function authResetHeld(){ return !!AUTH_RESET_T; }
function authResetDrop(){ AUTH_RESET_T=''; }
/* SAVE THE NEW PASSWORD. Refused here first when the server would refuse it,
   with the same bounds and sentences as a new account, plus the one rule a
   second field adds. A yes from the Worker is a sign in: it has ended every
   session the account had, on every device, and answers a fresh one, so the
   person is signed in here and nothing about the password is kept.

   The token is spent on a yes and only then. On a no it is kept with the
   screen, because a dropped connection or a rate limit has not used it, and
   pressing Save again is the whole of the retry. A refused token stays held
   too, which costs one more refusal at most, and the server's words for it
   already say what to do.

   A yes with no session in it is the server saying the password changed and
   naming no sign in, which the Worker never does today. It is said as what it
   is, a saved password and a log in still to do, rather than as a sign in. */
function authReset(pw,again){
 var bad=authPwWhy(pw,true)||(pw!==again?'The two passwords do not match. Type the same one in both.':'');
 if(bad)return Promise.resolve({ok:false, say:bad});
 return authCall('POST','/v1/auth/reset',{token:AUTH_RESET_T, password:pw}).then(function(r){
  var b=r.body||{}, acc=b.account||{};
  if(!r.ok)return {ok:false, say:authWhy(r,'reset')};
  authResetDrop();
  if(typeof b.token!=='string'||!b.token)
   return {ok:true, signed:false, email:typeof acc.email==='string'?acc.email:'',
    say:'New password saved. Log in with it.'};
  var held=authHold(b,'');
  var who=(held.s.email?'Signed in as '+held.s.email+'.':'Signed in.')+(held.kept?'':AUTH_UNKEPT);
  return {ok:true, signed:true, kept:held.kept, who:who, say:'New password saved. '+who};});}
/* SIGN OUT ENDS IT HERE WHATEVER THE SERVER SAYS. A person who pressed Sign
   out on a train has asked for this browser to stop being signed in, and
   refusing that because the server is out of reach would keep a session they
   asked to end. What the sentence then says is where it ended: here always,
   and on the server only when the server confirmed it. A 401 is the server
   saying the session had already ended, which is the same result. */
function authSignOut(){
 var s=authSession();
 if(!s){profileSyncStop();return Promise.resolve({ok:true, say:'Not signed in.'});}
 /* Name this browser's pass so the Worker can end it. A 200 from the sign-out
    route only proves that the account session ended: the Worker separately
    reports whether Supabase ended the first-visit pass. */
 var f=funnelSession();
 var namedPass=!!(f&&f.id&&f.credential);
 var body=namedPass?{funnel:{id:f.id,credential:f.credential}}:null;
 return authCall('POST','/v1/auth/signout',body,s.token).then(function(r){
  profileSyncStop();
  var gone=authForget(), visit=authFunnelClear();
  if(!gone)return {ok:false,
   say:'Signed out for this visit only. Storage would not take the change, so the sign in comes back on reload.'};
  var cleared=visit?'':' The first visit\'s code could not be removed from this browser.';
  if(r.ok&&namedPass&&!(r.body&&r.body.funnel&&r.body.funnel.ended===true)){
   return {ok:true, say:'Signed out on this browser. The server could not confirm that the first visit pass ended, so it may remain available until it expires.'+cleared};
  }
  if(r.ok||(!namedPass&&r.status===401))return {ok:true, say:'Signed out.'+cleared};
  if(r.status===401&&namedPass){
   return {ok:true, say:'Signed out on this browser. The server session was already ended, so it could not confirm that the first visit pass ended; it may remain available until it expires.'+cleared};
  }
  return {ok:true, say:'Signed out on this browser. The server could not confirm that the first visit pass ended, '
   +'so it may remain available until it expires.'+cleared};});}
/* ============================================================
   DELETE THE ACCOUNT. The owner, 9 October: "If they want to quit the
   software, that the cancellation." Nothing in the app called DELETE /v1/me
   (REVIEW-audit-2026-10-09 pass3.md, section 3), so the only way out of an
   account was to write to us. And the route itself stopped nothing at Stripe
   (pass2.md W4), which is why this waited: a button on it would have deleted
   the account and left the card being charged. The Worker stops any paid plan
   first now, and refuses to delete anything if Stripe will not stop it
   (reboot-os stripe.js stopForDelete, branch claude/paywall-worker).

   IT SAYS WHAT THE SERVER SAYS IT DID, AND NOTHING MORE. A yes names what it
   stopped and what it kept, and each of those becomes one line here. A server
   from before that answer says only deleted, and is said to be one rather than
   read as a stop it never claimed.

   ON A YES the account's session, the first visit's session and the sync
   marker go from this browser, because each names an account that no longer
   exists, and a paid plan on the open record drops to free, because the
   account that paid is gone. The record on this device stays: the server's
   copy of it, if the person turned sync on, is one of the rows the Worker's
   deleteAccount removes ("everything it held under the account", below), and
   deleting the device's own record because they closed an account is a second
   delete they did not ask for. The yes to sync goes too, because it was given
   under an account that no longer exists. The receipt says where it is and how to remove
   it.

   ON A NO nothing here moves, so the same press is the retry, except a 401,
   which is the server saying the sign in has ended, and it is ended here too
   the way authCheck ends one. Resolves, never rejects. */
function authAccountDelete(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false, say:'Not signed in, so there is no account here to delete.'});
 return authCall('DELETE','/v1/me',null,s.token).then(function(r){
  var b=(r.body&&typeof r.body==='object')?r.body:{};
  if(r.ok&&b.deleted===true)return authGone(b);
  if(r.status===401){ profileSyncStop(); authForget();
   return {ok:false, say:'The server no longer knows this sign in, so it has ended here too. '
    +'If the account was deleted a moment ago, it is gone. If not, log in again to delete it.'};}
  if(r.late)return {ok:false, say:'The server did not answer in time. Press Delete again to find out '
   +'whether the account is gone.'};
  if(!r.status)return {ok:false, say:'Could not reach the server, so nothing was deleted. '
   +'Check the connection and try again.'};
  return {ok:false, say:authWhy(r,'delete')};});}
/* The yes, laid onto this browser, and its receipt as lines. */
function authGone(b){
 profileSyncStop();
 var kept=authForget();
 authFunnelClear();
 try{ if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND)STORE.set(PROFILE_SYNC_META_KEY,''); }catch(e){}
 syncConsentDrop(); PROFILE_SYNC_LAST=null; PROFILE_SYNC_SAID='';
 var dropped=authPlanDrop();
 var lines=[], stopped=(typeof b.stopped==='number')?b.stopped:null;
 if(stopped===null)lines.push('The server did not say whether a paid plan was stopped. '
  +'If you were paying, write to us under Help and we stop it.');
 else if(stopped>0)lines.push('The paid plan is cancelled today, so nothing more is charged.');
 if(b.billedElsewhere==='apple'||b.billedElsewhere==='google')
  lines.push('A plan bought through '+(b.billedElsewhere==='apple'?'the App Store':'Google Play')
   +' keeps charging until you cancel it there.');
 lines.push('Removed from our server: your email, your password, your sign in on every device, '
  +'and everything it held under the account.');
 /* the server's own names for what it kept, each said once. A name this
    build does not know is still said, in the server's word, because a thing
    kept and not mentioned is the defect this receipt exists for */
 var said={first_visit:'Kept on our server: your first-visit record, linked by a random account ID. '
   +'It includes the topic you picked and when you finished each step.',
  activity_log:'Kept on our server: a dated list of when the account signed in and paid, '
   +'linked by that random account ID and with no email.',
  payment_history:'Kept by Stripe, the company that takes the card: its own record of your past payments.'};
 (Array.isArray(b.kept)?b.kept:[]).forEach(function(k){
  if(typeof k!=='string')return;
  lines.push(said[k]||('Kept on our server: '+k.replace(/_/g,' ')+'.'));});
 lines.push('This record is still on this device'+(dropped?', and its plan reads Free now':'')
  +'. Delete it under Profiles to remove it here too.');
 return {ok:true, kept:kept, lines:lines,
  say:'The account is deleted.'+(kept?'':' Storage would not take the change, so the sign in comes back on reload.')};}
/* THE PLAN ON THE OPEN RECORD, DROPPED TO FREE, quietly: the receipt says it.
   authPlanTake(null) would say "the account signed in has no paid plan",
   which is the wrong sentence after the person deleted it on purpose. The same
   writer and the same boundary as every other plan write. */
function authPlanDrop(){
 if(typeof CURP==='undefined'||!CURP||typeof PROFILES==='undefined'||PROFILES.indexOf(CURP)<0)return false;
 var r=planFromServer(CURP.plan,null,(CURP.meter&&CURP.meter.unique)||[]);
 if(r.same)return false;
 var v=validateProfile({v:SCHEMA_V, plan:r.plan});
 if(!v.ok)return false;
 CURP.plan=v.profile.plan; pSave();
 return true;}
/* THE BOOT CHECK. A stored session is asked about once per boot, and only
   when there is one: a person who never signed in makes no request at all,
   which is what tests/design.js gate 7 watches. The answer decides one thing.
   A 401 means the server no longer knows this session, from expiry or a
   password reset elsewhere, and the browser stops claiming it. Anything else
   that is not a yes, including no network, changes nothing and says the check
   did not happen, because being offline is not being signed out. */
function authCheck(){
 /* the return from Stripe is read and taken off the address first, whatever
    else happens, so a reload never replays it */
 var back=authBillingBack();
 var s=authSession();
 if(!s){
  /* a browser that would not hold the session has lost it across the trip to
     Stripe, and the payment still happened, so it says where the plan is */
  if(back==='done')status('Payment finished. Log in from Account to bring the plan onto this record.','fail');
  return Promise.resolve(null);}
 AUTH_PLAN_READ_AT=Date.now();
 return authCall('GET','/v1/me',null,s.token).then(function(r){
  var acc=r.body&&r.body.account;
  var redraw=function(){
   if(typeof S!=='undefined'&&typeof TAB!=='undefined'&&S.tab===TAB.SETTINGS
    &&typeof renderAccount==='function')renderAccount(); };
  if(r.ok&&acc&&typeof acc.email==='string'){
   if(acc.email!==s.email||acc.id!==s.accountId){
    s={token:s.token,email:acc.email,accountId:typeof acc.id==='string'?acc.id:null};
    authKeep(s); redraw();
   }
   /* the same answer carries the plan, so the boot check reads it without a
      second request */
   authPlanBack(back,r.body.billing);
   authPlanArm();
   profileSyncStart();
   return 'ok';}
  if(r.status===401){
   profileSyncStop();
   authForget(); redraw();
   status('Signed out. The server has ended the sign in on this browser. Log in again from Account.','fail');
   return 'ended';}
  /* two sentences, because a server that answered with an error was reached,
     and saying it was not would send somebody to check a connection that works */
  status(r.status?'The server could not check this sign in. It stays on this browser.'
   :'The server could not be reached, so this sign in was not checked. It stays on this browser.');
  return 'unchecked';});}
/* THE PAYWALL'S HALF OF THE ONE SEAM, round NW: "build the paywall infrastructure." PLAN_HOST
   in ui/panels.js is bound, in ui/ui.js, to a host function that calls this and never fetch
   itself, so the rule this file's own header already states, that it is the only file in the
   product that calls fetch, stays true of a real checkout and not only of sign in.

   This asks for one thing: a Checkout Session Stripe will host, for one of engine/plan.js's
   own ladder keys ('one', 'two', 'three', 'four'), and hands back the URL to send the browser
   to. Nothing about a card ever reaches this file, because nothing about a card ever reaches
   the server either: the server asks Stripe for a page, and Stripe is the one who asks for the
   card, on a page this product never renders and never even links to directly, only through
   the URL Stripe's own answer carries.

   Signed out answers locally, the same reason authSignOut answers locally when there is
   nothing to sign out of: a request the server would refuse anyway, for lack of a session to
   open one for, is a request this file does not need to send to get the same answer. */
function authPlanCheckout(tier){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,
  say:'Sign in first. The plan is read from your record, and billing lives behind sign in.'});
 return authCall('POST','/v1/billing/checkout',{tier:tier},s.token).then(function(r){
  if(!r.ok)return {ok:false, say:authWhy(r,'checkout')};
  var url=r.body&&r.body.url;
  if(typeof url!=='string'||!url)
   return {ok:false, say:'The server answered without a checkout page. Nothing has changed.'};
  return {ok:true, url:url};});}
/* THE VOICE, one line of audio from the reboot-os Worker's
   POST /v1/voice/synthesize, which asks ElevenLabs with a key that lives only
   on the server. D17 in QUESTIONS.md is why it goes this way round: a key in
   this file is a key every person who opens the file can read and spend, so
   this side holds nothing but a random code of its own, plus the person's
   session when there is one.

   IT NEEDS NO SIGN IN. The owner, 9 October: "the 11 Labs voice should be
   automatic. I don't want it to have to sign in or anything special." So a
   signed out person sends a device code, a random string this browser makes
   once and keeps, and the server holds each device, each network address and
   the whole server to a daily ceiling. A signed in person sends the session
   instead and is held to the account's. The code is in the body, not a header,
   so the preflight the server already answers is the only one there is. It is
   not a name, an email or a record, and the server keeps only its hash.

   style is the server's word for which kind of line it is, 'list' for the
   release and reframe statements and 'frame' for the words around them. The
   server turns that into a voice and its settings, so no voice id is ever
   written here.

   Resolves {ok, blob} or {ok:false, status}. The status is handed back rather
   than a sentence, because the server's own words for a 503 name a server
   setting, and that is not a sentence for the person; ui/release.js says what
   each status means for the run. */
var VOICE_DEV='';
function authVoiceDevice(){
 if(VOICE_DEV)return VOICE_DEV;
 var ok=function(v){ return typeof v==='string'&&/^[A-Za-z0-9_-]{16,64}$/.test(v); };
 try{ if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND){
  var o=STORE.get(VOICE_DEV_KEY); if(ok(o)){ VOICE_DEV=o; return o; } } }catch(e){}
 var v=funnelUuid(); if(!ok(v))v='dev_'+Date.now().toString(36)+Math.random().toString(36).slice(2,12);
 VOICE_DEV=v;
 try{ if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND)STORE.set(VOICE_DEV_KEY,v); }catch(e){}
 return v;}
function authVoice(text,style){
 var s=authSession(), b={text:text, style:style||'list'};
 if(!s)b.device=authVoiceDevice();
 return authCall('POST','/v1/voice/synthesize',b,s?s.token:null,true).then(function(r){
  if(r.ok&&r.body&&typeof r.body.size==='number'&&r.body.size>0)return {ok:true, blob:r.body};
  return {ok:false, status:r.ok?502:r.status, late:!!r.late};});}
/* MANAGE BILLING, the second half of the same seam. The server asks Stripe for a Customer
   Portal session for this account's own customer and hands back its URL, and that page is
   where a plan is moved, a card replaced or a plan stopped. Nothing is sent but the session:
   which customer to open is read off the sign in on the server, because a customer id sent
   from here would let one account ask for another's billing.

   Before this, the 'portal' case in ui/ui.js said "Managing billing from here is not built
   yet" and sent a person to email support, because the server had no route to call.

   Two refusals are worth their own sentence here. Signed out answers locally, as checkout
   does. And a 409 is the server saying this account has never finished a checkout, so there
   is no plan to manage: the server's own words say that, and authWhy shows them as they are,
   so this file types none of them. */
function authPlanPortal(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,
  say:'Sign in first. Billing is held on your account, so there is nothing to manage while signed out.'});
 return authCall('POST','/v1/billing/portal',null,s.token).then(function(r){
  if(!r.ok)return {ok:false, say:authWhy(r,'portal')};
  var url=r.body&&r.body.url;
  if(typeof url!=='string'||!url)
   return {ok:false, say:'The server answered without a billing page. Nothing has changed.'};
  return {ok:true, url:url};});}
/* ============================================================
   THE PLAN, READ BACK FROM THE SERVER. Nothing wrote CURP.plan
   from the server, so a person who paid came back to a Billing
   section reading Free. This is the one writer: it reads the
   account's billing off /v1/me, lays it onto the open record
   with planFromServer (engine/plan.js, pure, gated headless),
   puts the result through validateProfile, the same boundary a
   pasted record goes through, saves, and only then says what
   changed.

   WHEN IT READS. After a sign in, which is also the second device
   case. At the boot check, off the same /v1/me answer, so it costs
   no extra request. And on the way back from Stripe, where
   ?billing=done, managed or cancelled is read once and taken off
   the address so a reload does not replay it.

   WHAT IT DECIDED, written down because each one could go another
   way:

   A server too old to send billing has said nothing, and nothing
   is written. undefined is not null: null is an account that never
   paid, and it reads free.

   Free from the server overwrites a paid record, and says so on a
   held line. The server is the one that knows: Stripe ended it, or
   the account signed in is not the one that paid. Either way the
   person is told, by name of the tier, and signing in to the right
   account puts it back. A quiet overwrite is what the ruling
   forbids, and keeping a tier the server says has ended would
   charge nobody for a plan.

   A cancelled plan arrives as its tier with Stripe's word for it,
   so the record keeps which tier ended and planOf reads it free.

   Sign out leaves the record as it is. Signing out says nothing
   about billing, and a person signing out on a train has not
   stopped paying. The next sign in or boot check corrects it.

   It writes the open record only, and only a real one. A worked
   example is not the person's record, so nothing is written while
   one is open. Other profiles on this device take the plan the
   next time they are open at a sign in or a boot.

   Only a change a person can see is said. A renewal moves the
   period and is written, and is not announced.
   ============================================================ */
var AUTH_PLAN_TRIES=5, AUTH_PLAN_WAIT_MS=2500;
function authPlanLive(){
 return typeof CURP!=='undefined'&&!!CURP&&typeof planState==='function'&&planState(CURP.plan)==='live';}
/* Lays b onto the open record. Answers what happened, as one word, for the
   callers below and for the gate. */
function authPlanTake(b){
 if(b===undefined)return 'silent';
 if(typeof CURP==='undefined'||!CURP||typeof PROFILES==='undefined'||PROFILES.indexOf(CURP)<0)
  return 'not a record';
 var r=planFromServer(CURP.plan,b,(CURP.meter&&CURP.meter.unique)||[]);
 /* a field refused at the boundary carries its own reason, in words, since
    "a plan this build does not know" said of a share of the month is false */
 if(r.refused){
  status(r.why?'The plan the server sent could not be read, so this record was not changed: '+r.why+'.'
   :'The server named a plan this build does not know, '+r.refused+', so this record was not changed.','fail');
  return 'refused';}
 if(r.same)return 'same';
 var v=validateProfile({v:SCHEMA_V, plan:r.plan});
 if(!v.ok){
  status('The plan the server sent could not be read, so this record was not changed. '
   +authSay(v.errs[0]),'fail');
  return 'refused';}
 CURP.plan=v.profile.plan;
 var saved=pSave();
 if(typeof S!=='undefined'&&typeof TAB!=='undefined'&&S.tab===TAB.SETTINGS
  &&typeof renderAccount==='function')renderAccount();
 var nm=PLAN_BY[r.now].nm, wasNm=PLAN_BY[r.was].nm, say='', kind='ok';
 if(r.nowLive&&(r.now!==r.was||!r.wasLive))say=nm+' is on this record now.';
 else if(r.nowLive&&r.status==='past_due'&&r.wasStatus!=='past_due'){
  /* "the plan stays on" stopped being the whole truth on 17 October, when new
     ground began to wait for the money (planFromServer, engine/plan.js). The
     same words stand on Billing's State row (ui/panels.js) for as long as the
     card has not gone through, so this line is not the only place they live. */
  say='The card for '+nm+' did not go through. Everything you have opened still runs. New patterns '
   +'wait until the card does, and Manage billing replaces the card.'; kind='fail';}
 /* AND WHEN IT DOES, 24 October (P3-3 of the 23 October QA pass). The refused
    card was said on a held line and on Billing's State row, and the read that
    found it paid said nothing, though that read is the one that opens the
    month's new patterns (planFromServer, engine/plan.js). */
 else if(r.nowLive&&r.wasLive&&r.wasStatus==='past_due'&&r.status!=='past_due')
  say='The card for '+nm+' went through. This month\'s new patterns are open.';
 /* STOPPED ON THE PAYMENT PAGE, and turned back on there. Neither moves the
    tier, the status or the period, so neither was said: a person came back
    from pressing stop to silence and a plan that read as running. Said as a
    confirmation and not held, because it is the person's own choice and the
    Billing page carries the day on its State row from here on. */
 else if(r.nowLive&&r.ends&&r.ends!==r.wasEnds)
  say=nm+' stops on '+planDay(r.ends)+'. It stays on until then, and Manage billing turns it back on.';
 else if(r.nowLive&&!r.ends&&r.wasEnds){
  var renews=planDay(r.plan.until);
  say=nm+(renews?' renews on '+renews+'.':' renews each month again.');}
 /* held, because it takes something away, and a line that clears in two
    seconds is a change nobody was told about */
 else if(!r.nowLive&&r.wasLive){
  say=(b?wasNm+' has ended':'The account signed in has no paid plan')
   +', so this record reads Free now.'; kind='fail';}
 if(!saved){
  say=(say?say+' ':'')+'Storage would not take the change, so it holds for this visit '
   +'and is read again at the next sign in.'; kind='fail';}
 if(say)status(say,kind);
 return r.nowLive?'live':'free';}
/* One read of /v1/me and one take. Resolves, never rejects, like everything
   that goes through authCall. */
function authPlanRead(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false, took:'signed out'});
 AUTH_PLAN_READ_AT=Date.now();
 return authCall('GET','/v1/me',null,s.token).then(function(r){
  if(!r.ok||!r.body)return {ok:false, took:'unread', status:r.status};
  var took=authPlanTake(r.body.billing);
  authPlanArm();
  return {ok:true, took:took};});}
/* A PAGE LEFT OPEN ACROSS A RENEWAL, 24 October (P2-2 of the 23 October QA
   pass). The plan was read off the server only at boot, after a sign in and on
   the way back from Stripe, and the record's own end date ends any renewal it
   has not read three days after the period (planPast and PLAN_GRACE_MS,
   engine/plan.js). That is right for a device signed out or offline, which is
   what it was built for, and it was wrong for a signed in page that was simply
   never reloaded: a tab kept open showed a person whose card had just renewed
   "On Free" and "State ended", with the layers they pay for locked, until a
   reload. Measured eight runs in eight, and coming back to the tab sent no
   request.

   So while signed in the plan is read again when the page comes back into
   view or gains focus, at most once an hour, and once on a timer a minute
   before the grace runs out, so the last word before an unread renewal reads
   as an ending is the server's. A stopped plan (ends) needs no timer: it ends
   on its day whatever the server says next. */
var AUTH_PLAN_EVERY_MS=3600*1000, AUTH_PLAN_TIMER=null, AUTH_PLAN_READ_AT=Date.now();
/* setTimeout holds at most 2^31 - 1 milliseconds, about 24.8 days, and a
   longer wait fires at once, so a longer one is armed in steps */
var AUTH_TIMER_MAX=2147483647;
/* when the timer should read, as a time, or null when nothing needs one */
function authPlanDue(){
 if(!authSession()||typeof CURP==='undefined'||!CURP||!CURP.plan)return null;
 var pl=CURP.plan;
 if(planState(pl)!=='live'||pl.ends)return null;
 var u=(typeof pl.until==='string')?Date.parse(pl.until):NaN; if(!isFinite(u))return null;
 var at=u+PLAN_GRACE_MS-60000;
 return at>Date.now()?at:null;}
function authPlanArm(){
 if(AUTH_PLAN_TIMER){ clearTimeout(AUTH_PLAN_TIMER); AUTH_PLAN_TIMER=null; }
 var at=authPlanDue(); if(at===null)return;
 AUTH_PLAN_TIMER=setTimeout(function(){ AUTH_PLAN_TIMER=null;
  if(Date.now()<at-1000){ authPlanArm(); return; }
  authPlanRead(); },Math.min(Math.max(0,at-Date.now()),AUTH_TIMER_MAX));}
function authPlanWake(){
 try{ if(document.visibilityState&&document.visibilityState!=='visible')return; }catch(e){}
 if(!authSession()||Date.now()-AUTH_PLAN_READ_AT<AUTH_PLAN_EVERY_MS)return;
 authPlanRead();}
if(typeof addEventListener==='function'){
 addEventListener('focus',authPlanWake);
 try{ document.addEventListener('visibilitychange',authPlanWake); }catch(e){}}
/* ?billing= is what the server sends Stripe back to (createCheckout and
   createPortal in reboot-os). Read once and removed, keeping every other
   parameter, so ?dev=1 and a hash survive. */
function authBillingBack(){
 var v=null;
 try{
  var q=new URLSearchParams(location.search||''); v=q.get('billing');
  if(v!==null){ q.delete('billing'); var rest=q.toString();
   history.replaceState(history.state,'',location.pathname+(rest?'?'+rest:'')+location.hash); } }
 catch(e){}
 return (v==='done'||v==='managed'||v==='cancelled')?v:null;}
/* THE WELCOME AFTER PAYING, round OX, his words: "after a person's done paying,
   there should be a pop-up screen welcoming them to the software. It should
   tell them to do the loop, go to the journal, input stories, and get used to
   using the software ten minutes a day until you no longer need it." Shown
   once per profile, only when the plan is live after a checkout return, and
   never for a managed or cancelled return. Its sheet host is its own,
   #paidwelcome in shell/body.html. It borrowed the Day One tutorial's host
   until 23 October, when that sequence was removed, so nothing else ever
   stands on this one. The flag is a ui fact, so it survives a load. */
function paidWelcomeOpen(){
 var h=document.getElementById('paidwelcome'); if(!h)return false;
 if(CURP&&CURP.ui&&CURP.ui.paidWelcomed)return false;
 h.classList.remove('ob-leaving');
 h.innerHTML='<div class="ob-card" role="dialog" aria-modal="true" aria-label="You are in">'
  +'<div class="ob-wash" aria-hidden="true"></div><div class="ob-scroll">'
  +'<span class="pm-eye">Paid</span>'
  +'<h2 class="ob-h">You are in.</h2>'
  +'<p class="ob-p">Do the loop: discover, play, flow, embody. Then do it again.</p>'
  +'<p class="ob-p">Go to the journal. Put your stories in.</p>'
  +'<p class="ob-p">Use it ten minutes a day, until you no longer need it.</p>'
  +'<div class="ob-acts"><button type="button" class="btn pri" id="pwgo">Go to the journal</button>'
  +'<button type="button" class="btn" id="pwlater">Later</button></div>'
  +'</div></div>';
 h.style.display='flex';
 var shut=function(){ h.classList.add('ob-leaving');
  setTimeout(function(){ h.style.display='none'; h.classList.remove('ob-leaving'); h.innerHTML=''; },520); };
 document.getElementById('pwgo').onclick=function(){ shut(); if(typeof setTab==='function')setTab(TAB.STORY); };
 document.getElementById('pwlater').onclick=shut;
 var g=document.getElementById('pwgo'); if(g)g.focus();
 /* written straight to the record and not through uiSet, whose "Saved." would
    replace the line the return from Stripe has just printed */
 if(!CURP.ui||typeof CURP.ui!=='object')CURP.ui={};
 CURP.ui.paidWelcomed=true;
 if(!pSave()&&typeof status==='function')
  status('This browser would not save. The welcome will show again.','fail');
 return true;}
/* THE RETURN FROM STRIPE. Stripe sends the browser back the moment the card
   is taken, and its webhook to the server can land a few seconds later, so
   "done" with no live plan yet is waited on, a few reads apart, rather than
   read once as no plan. The wait is said, and so is its end. */
function authPlanBack(back,b){
 var took=authPlanTake(b);
 if(back==='cancelled'){ status('Checkout was closed before paying, so nothing was charged.'); return took; }
 /* BACK FROM MANAGE BILLING. Stripe sends the browser back the moment a
    plan is stopped, moved or a card replaced, and the webhook that tells the
    server can land after it, so the first read here was usually the plan as it
    was and the change was never said. Nothing changed on the first read is
    read again a few times, quietly, and authPlanTake speaks when the change
    lands. A person who only looked, or only replaced a card, changes nothing
    a read can see, and the reads end without a word. */
 if(back==='managed'){ if(took==='same')authPlanSettle(AUTH_PLAN_TRIES); return took; }
 if(back!=='done')return took;
 if(took==='not a record'){
  status('Payment finished. Open your own profile to see the plan on it.','fail'); return took;}
 if(authPlanLive()){
  if(took==='same')status(PLAN_BY[planOf(CURP.plan).k].nm+' is on this record.');
  paidWelcomeOpen();
  return took;}
 status('Payment finished. Waiting for Stripe to confirm it.');
 authPlanWait(AUTH_PLAN_TRIES);
 return took;}
function authPlanSettle(n){
 setTimeout(function(){
  authPlanRead().then(function(x){
   if(x.ok&&x.took==='same'&&n>1)authPlanSettle(n-1);});},AUTH_PLAN_WAIT_MS);}
function authPlanWait(n){
 setTimeout(function(){
  authPlanRead().then(function(){
   if(authPlanLive()){ paidWelcomeOpen(); return; }
   if(n>1){ authPlanWait(n-1); return; }
   status('Stripe has not confirmed the payment yet. The plan shows here once it does, '
    +'so reload this page in a minute.','fail');});},AUTH_PLAN_WAIT_MS);}
