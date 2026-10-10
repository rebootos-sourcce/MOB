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
   It does not sync. Every story, reading and imprint stays in this browser
   exactly as before. One field of a profile is written from here and nothing
   else is: the plan, read back off the account by authPlanTake at the foot of
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
   if(o&&typeof o.id==='string'&&o.id&&typeof o.anonymousId==='string'&&o.anonymousId){
    FUNNEL_S=o;
   }
  }catch(e){ FUNNEL_S=null; }
 }
 return FUNNEL_S;
}
function funnelKeep(s){
 FUNNEL_S=s; FUNNEL_READ=true;
 if(typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 try{
  var txt=s?JSON.stringify(s):'';
  STORE.set(FUNNEL_KEY,txt);
  return STORE.get(FUNNEL_KEY)===txt;
 }catch(e){ return false; }
}
function funnelUuid(){
 try{ if(typeof crypto!=='undefined'&&crypto.randomUUID)return crypto.randomUUID(); }catch(e){}
 return 'anon_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);
}
/* Read back the session after attempting its account attachment. The server
   remains the authority; the browser keeps only the public row and the private
   credential returned when this browser created the anonymous session. */
function authFunnelStartFinish(result){
 return Promise.resolve().then(function(){return authFunnelJoin();})
  .catch(function(){return {ok:false,status:0};})
  .then(function(join){
   result.joined=!!(join&&join.ok);
   return authFunnelRead().then(function(r){
    result.readBack=!!(r&&r.ok&&r.body&&r.body.session);
    result.readStatus=(r&&r.status)||0;
    if(result.readBack)result.session=r.body.session;
    return result;
   }).catch(function(){result.readBack=false;result.readStatus=0;return result;});
  });
}
function authFunnelStart(){
 var existing=funnelSession();
 if(existing)return authFunnelStartFinish({ok:true,session:existing.session||null,reused:true});
 var anonymousId=funnelUuid();
 return authCall('POST','/v1/funnel/session',{anonymousId:anonymousId},null,false).then(function(r){
  /* The Worker creates the session id. Only a random browser id crosses this
     boundary; the record, story, name and patterns stay in this browser. */
  if(!r.ok)return {ok:false,status:r.status,body:r.body};
  var b=r.body||{}, s=b.session;
  if(!s||typeof s.id!=='string'||typeof b.credential!=='string')return {ok:false,status:r.status,body:null};
  var state={session:s,id:s.id,anonymousId:s.anonymousId||anonymousId,credential:b.credential};
  var kept=funnelKeep(state);
  return authFunnelStartFinish({ok:true,session:s,reused:false,kept:kept});
 });
}
/* JOINED TO THE ACCOUNT ONCE BOTH EXIST, WHICHEVER CAME FIRST. The join was
   tried at sign in and nowhere else, and the first visit's session is made by
   onboarding, which opens behind the door. So a person who pressed Create
   account at the door, the ordinary way in, was signed in before the session
   existed: the one try found nothing to join, and the session stayed anonymous
   for good. tests/golden.js walked it and the server held userId null after
   the whole first run. So the join is asked again wherever it can newly
   succeed: when the session is made or found, and after each mark, because
   the Worker permits the visit to attach before a starting ground is selected.
   The gift is issued with the session or at the selected-ground checkpoint.
   A failed attachment can be retried when state changes. A session
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
 var s=authSession(), token=s&&s.token, path='/v1/funnel/session/'+encodeURIComponent(f.id);
 var extra=f.credential?{'x-funnel-credential':f.credential}:null;
 var remember=function(r){
  if(r&&r.ok&&r.body&&r.body.session){
   var session=r.body.session;
   funnelKeep(Object.assign({},f,{session:session,userId:session.userId||f.userId||null}));
  }
  return r;
 };
 /* An account token is preferred once attached. If this first visit is still
    anonymous, the Worker correctly refuses the account read; retry only with
    this browser's credential, never with an untrusted session id alone. */
 return authCall('GET',path,null,token||null,false,undefined,extra).then(function(r){
  if((r&&r.ok)||!token||!f.credential)return remember(r);
  return authCall('GET',path,null,null,false,undefined,extra).then(remember);
 });
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
/* Owner ruling in DECISIONS.md: profile sync is not part of alpha. The stored profile contains identity, birth details and story entries. Keep this false until privacy copy, consent and retention are approved together. */
var PROFILE_SYNC_ENABLED=false;
var PROFILE_SYNC_ID='atuned.primary-profile';
var PROFILE_SYNC_META_KEY='source.profile.sync';
var PROFILE_SYNC_TIMER=null;
var PROFILE_SYNC_BUSY=false;

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
function profileSyncEligible(){
 return !!(PROFILE_SYNC_ENABLED&&authSession()&&typeof CURP!=='undefined'&&CURP&&typeof pExport==='function'
  &&typeof pImport==='function'&&typeof S!=='undefined'&&(!S.who||S.who===0)
  &&typeof profiles==='function');
}
function profileSyncReadRemote(){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,status:0,body:null});
 return authCall('GET','/v1/sync',null,s.token).then(function(r){
  if(!r.ok)return r;
  var rows=(r.body&&Array.isArray(r.body.records))?r.body.records:[];
  var found=null;
  rows.forEach(function(x){
   if(x&&x.kind==='state'&&x.id===PROFILE_SYNC_ID&&!x.deleted)found=x;
  });
  return {ok:true,status:r.status,body:found};
 });
}
function profileSyncPush(profile,version){
 var s=authSession();
 if(!s)return Promise.resolve({ok:false,status:0,body:null});
 return authCall('PUT','/v1/sync',{
  records:[{kind:'state',id:PROFILE_SYNC_ID,version:version,body:profile,deleted:false}]
 },s.token).then(function(r){
  if(!r.ok)return r;
  var kept=(r.body&&Array.isArray(r.body.kept))?r.body.kept:[];
  var accepted=kept.some(function(x){
   return x&&x.kind==='state'&&x.id===PROFILE_SYNC_ID&&x.version===version;
  });
  return {ok:accepted,status:r.status,body:r.body};
 });
}
function profileSyncImport(remote,remoteVersion){
 var text=JSON.stringify(remote);
 var imported=pImport(text);
 if(!imported)return {ok:false};
 var list=profiles();
 for(var i=list.length-1;i>=0;i--){
  if(list[i]&&list[i].id===imported.id&&list[i]!==imported)list.splice(i,1);
 }
 return {ok:true,text:text,version:remoteVersion,updated:imported.updated||null};
}
function authProfileSync(){
 if(PROFILE_SYNC_BUSY||!profileSyncEligible())return Promise.resolve({state:'skip'});
 PROFILE_SYNC_BUSY=true;
 var localText;
 try{ localText=pExport(); }catch(e){PROFILE_SYNC_BUSY=false;return Promise.resolve({state:'refused'});}
 var local;
 try{ local=JSON.parse(localText); }catch(e){PROFILE_SYNC_BUSY=false;return Promise.resolve({state:'refused'});}
 if(!local||typeof local!=='object'){PROFILE_SYNC_BUSY=false;return Promise.resolve({state:'refused'});}
 return Promise.all([profileSyncHash(localText),profileSyncReadRemote()]).then(function(pair){
  var localHash=pair[0], rr=pair[1], meta=profileSyncMeta(), identity=profileSyncIdentity();
  var remote=rr.body&&rr.body.body&&typeof rr.body.body==='object'?rr.body.body:null;
  var remoteVersion=rr.body&&Number.isInteger(rr.body.version)?rr.body.version:0;
  if(!rr.ok){PROFILE_SYNC_BUSY=false;return {state:'retry',status:rr.status};}

  /* First association with an account is deliberately conservative. */
  if(meta.accountId!==identity){
   if(remote){
    var pulled=profileSyncImport(remote,remoteVersion);
    if(!pulled.ok){PROFILE_SYNC_BUSY=false;return {state:'refused'};}
    return profileSyncHash(pulled.text).then(function(remoteHash){
     profileSyncMetaSave({accountId:identity,version:remoteVersion,hash:remoteHash,updated:pulled.updated});
     PROFILE_SYNC_BUSY=false;
     if(typeof render==='function')render();
     return {state:'pulled-first',version:remoteVersion};
    });
   }
   profileSyncMetaSave({accountId:identity,version:0,hash:localHash,updated:local.updated||null});
   PROFILE_SYNC_BUSY=false;
   return {state:'associated',version:0};
  }

  if(remote){
   var lu=local.updated?Date.parse(local.updated):0;
   var ru=remote.updated?Date.parse(remote.updated):0;
   if(ru>lu){
    var pulled2=profileSyncImport(remote,remoteVersion);
    if(!pulled2.ok){PROFILE_SYNC_BUSY=false;return {state:'refused'};}
    return profileSyncHash(pulled2.text).then(function(remoteHash2){
     profileSyncMetaSave({accountId:identity,version:remoteVersion,hash:remoteHash2,updated:pulled2.updated});
     PROFILE_SYNC_BUSY=false;
     if(typeof render==='function')render();
     return {state:'pulled',version:remoteVersion};
    });
   }
  }

  if(meta.hash===localHash&&remoteVersion===meta.version){
   PROFILE_SYNC_BUSY=false;
   return {state:'clean',version:meta.version};
  }

  var nextVersion=Math.max(meta.version||0,remoteVersion)+1;
  return profileSyncPush(local,nextVersion).then(function(pr){
   PROFILE_SYNC_BUSY=false;
   if(!pr.ok)return {state:'retry',status:pr.status};
   profileSyncMetaSave({accountId:identity,version:nextVersion,hash:localHash,updated:local.updated||null});
   return {state:'pushed',version:nextVersion};
  });
 }).catch(function(){
  PROFILE_SYNC_BUSY=false;
  return {state:'retry'};
 });
}
function profileSyncStart(){
 /* A dormant adapter is not permission to transfer a profile. This call stays
    in the auth path so enabling sync later has one owner, but alpha never polls
    or sends a profile until its privacy and consent design is approved. */
 if(!PROFILE_SYNC_ENABLED){profileSyncStop();return false;}
 if(PROFILE_SYNC_TIMER)clearInterval(PROFILE_SYNC_TIMER);
 PROFILE_SYNC_TIMER=setInterval(function(){authProfileSync();},30000);
 authProfileSync();
 return true;
}
function profileSyncStop(){
 if(PROFILE_SYNC_TIMER){clearInterval(PROFILE_SYNC_TIMER);PROFILE_SYNC_TIMER=null;}
 PROFILE_SYNC_BUSY=false;
}
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

   Resolves true on a yes and rejects with authWhy's sentence on a no, because
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
function authEnter(route,mail,pw){
 var bad=authFieldsWhy(mail,pw,route==='signup');
 if(bad)return Promise.resolve({ok:false, say:bad});
 /* A file copy is deliberately offline. Do not make a request from origin
    null and then tell the person that the server or their connection failed. */
 try{if(typeof location!=='undefined'&&location.protocol==='file:')
  return Promise.resolve({ok:false,say:'This downloaded copy runs offline. Sign in requires the hosted app. No account request was sent.'});}catch(e){}
 return authCall('POST','/v1/auth/'+route,{email:mail, password:pw}).then(function(r){
  var b=r.body||{}, acc=b.account||{};
  if(!r.ok)return {ok:false, say:authWhy(r,route)};
  if(typeof b.token!=='string'||!b.token)
   return {ok:false, say:'The server answered without a sign in. Nothing changed.'};
  var held=authHold(b,mail);
  return {ok:true, kept:held.kept,
   say:(route==='signup'?'Account created. ':'')+'Signed in as '+held.s.email+'.'
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
   account that paid is gone. The record itself stays: it was never on the
   server (the sync does not run, DECISIONS.md, "Profile sync, 9 October"), and
   deleting a person's record because they closed an account is a second
   delete they did not ask for. The receipt says where it is and how to remove
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
 if(r.refused){
  status('The server named a plan this build does not know, '+r.refused
   +', so this record was not changed.','fail');
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
  say='The last card payment for '+nm+' did not go through. The plan stays on while Stripe '
   +'tries the card again, and Manage billing replaces the card.'; kind='fail';}
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
 return authCall('GET','/v1/me',null,s.token).then(function(r){
  if(!r.ok||!r.body)return {ok:false, took:'unread', status:r.status};
  return {ok:true, took:authPlanTake(r.body.billing)};});}
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
   never for a managed or cancelled return. It rides the tutorial's own sheet
   host, which is idle at that moment. The flag is a ui fact, so it survives a
   load. */
function paidWelcomeOpen(){
 var h=document.getElementById('tutorial'); if(!h)return false;
 if(CURP&&CURP.ui&&CURP.ui.paidWelcomed)return false;
 if(typeof TUT!=='undefined'&&TUT.open)return false;
 /* the tutorial's stage leaves its classes on the host until its own exit
    has run (ui/tutorial.js, tutClose); this card is the old sheet and must
    not open wearing them, nor be wiped by that exit's timer */
 if(typeof TUT!=='undefined'&&TUT.leaveT){ clearTimeout(TUT.leaveT); TUT.leaveT=null; }
 document.body.classList.remove('tut-on');
 h.classList.remove('ob-leaving','obx','tutx','obx-lit','obx-in-arrive');
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
