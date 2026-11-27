/* ============================================================
   PRACTITIONER SHARING, LIVE. Round PS, 26 November, the owner: "this
   practitioner mode is good, let's go ahead and wire it in." The flow is the
   design pass's, P1 to P5 on the practitioner's page and C1 to C4 on the
   client's, and the mockup that was sent to him is what each screen is drawn
   after. The worked examples on the practitioner page stay exactly as they
   were: this is a second path beside them, for people who are signed in.

   THE SERVER IS reboot-os atuned/server/src/prac.js, and every request here
   goes through authCall (ui/auth.js), the one seam that may hold a fetch.
   Nothing in this file holds one.

   WHAT LEAVES THIS DEVICE, all of it built in engine/pracshare.js: a code
   one person makes for another, the client's yes and two switches, the
   snapshot the client's own device computes, a ritual a practitioner writes,
   and the client's answer to it. Never a story, never the client's name: a
   practitioner sees a client as the grant's key, and may give that key a
   name of their own, which is kept on the practitioner's device (devSet) and
   never sent.

   EVERY PRESS RESOLVES AND SAYS SO. authCall never rejects; each control
   here disables itself while its request is out, and reports the server's
   own sentence through status() on a no (authWhy). A control never claims a
   change it has not been answered for.
   ============================================================ */
var PL={roster:null, mine:null, sel:null, tab:'sum', snap:{}, props:{}, made:null, held:'',
 busy:false, pubAt:0, pubSig:'', timer:null, write:false};
/* a sentence for a refusal, the server's own words, set in sentence case */
/* A SERVER WITHOUT THESE ROUTES. This side can ship before the Worker that
   serves it is deployed (reboot-os PR 92), and the Worker's answer for an
   unknown route is "no such route", which said to a person is noise. So that
   one answer is said as what it means, and the lists read as off, not broken. */
function plOff(r){return !!r&&r.status===404&&!!r.body&&r.body.error==='no such route';}
var PL_OFF='Connecting with a practitioner is not switched on on the server yet.';
function plWhy(r){if(plOff(r))return PL_OFF; return (typeof authWhy==='function')?authWhy(r,'prac'):'The server refused that.';}
function plCall(method,path,body){
 var s=(typeof authSession==='function')?authSession():null;
 if(!s)return Promise.resolve({ok:false, status:0, body:null, out:true});
 return authCall(method,path,body||null,s.token);}
function plSignedIn(){return !!((typeof authSession==='function')&&authSession());}
/* WHERE A LINK OPENS. The site's own address when this copy is served from
   one, and atuned.world when it is a file, because a link to a file on the
   practitioner's own disk opens nothing on the client's. The token rides in
   the fragment, which a browser never sends to any server, the same carrier
   the quiz's record link uses (recordLinkBoot, ui/panels.js). */
function plLinkOf(token){
 var base=/^https?:$/.test(location.protocol)?location.origin+location.pathname:'https://atuned.world/atuned.html';
 return base+'#prac='+token;}
function plDate(t){var d=new Date(t); return isNaN(d)?'':d.toLocaleDateString(undefined,{day:'numeric',month:'long'});}
/* the practitioner's own names for their clients, on this device only */
function plNames(){var o=devGet('pracLiveNames'); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}
function plNameOf(g){var n=plNames()[g.id]; return (typeof n==='string'&&n)?n:'Client '+g.key;}
function plNameSet(gid,nm){
 var o=plNames(); nm=String(nm||'').trim().slice(0,60); if(nm)o[gid]=nm; else delete o[gid];
 var r=devSet('pracLiveNames',o);
 status(r.ok?'Saved on this device only.':'The name was not saved. This browser would not keep it.',r.ok?'ok':'fail');}
/* the three layers, each with its own nav mark read off the bar and its
   meaning beside it, round PO. Summary wears Throat because the practitioner
   page is Throat; Body is the Body tab's; Field is the Field tab's. */
function plNavIc(tab){var b=document.querySelector('[data-tabk="'+tab+'"] svg'); return b?b.innerHTML:'';}
function plLay(){return {
 sum:{nm:'Summary',b:'Throat',ic:plNavIc(1),say:'The tier word and the seven seats ring. Every connection shares this. It never carries a story.'},
 body:{nm:'Body',b:'Sacral',ic:plNavIc(3),say:'Where charge sits: each address, at which nerve and plexus, and how much.'},
 field:{nm:'Field',b:'3rd Eye',ic:plNavIc(2),say:'The patterns and the practice over time: what was said yes to, which days were kept, and the rituals running.'}};}
function plTip(k,s){return ' tabindex="0" data-tip-k="'+esc(k)+'" data-tip="'+esc(s)+'"';}
function plGl(inner,col){return '<span class="ac-gl"'+(col?' style="color:'+col+'"':'')+'><svg viewBox="0 0 24 24" aria-hidden="true">'+inner+'</svg></span>';}
function plTags(sight){var L=plLay();
 return '<span class="pl-tags">'+['sum','body','field'].map(function(k){
  var on=k==='sum'?!!sight.summary:!!sight[k], x=L[k];
  return '<em class="pl-tg'+(on?'':' pl-off')+'" style="--t:'+(on?seatCol(x.b):'var(--dim)')+'"'
   +plTip(x.nm+(on?', shared':', not shared'),x.say)+'><svg viewBox="0 0 24 24" aria-hidden="true">'+x.ic+'</svg>'+x.nm+'</em>';}).join('')+'</span>';}
/* the house glyphs for what the product had none for, drawn on its grammar:
   24 box, open stroke, no fill. The mockup's three, unchanged. */
var PL_IC={
 key:'<circle cx="8" cy="15" r="3.6"/><path d="M10.6 12.4L19 4M15.5 7.5l2.5 2.5M13.3 9.7l1.8 1.8"/>',
 link:'<path d="M9 17H7a5 5 0 010-10h2M15 7h2a5 5 0 010 10h-2M8 12h8"/>',
 unlink:'<path d="M9 17H7a5 5 0 010-10h2M15 7h2a5 5 0 010 10h-2"/>'};

function plCss(){
 if($('pl-css'))return;
 var s=document.createElement('style'); s.id='pl-css';
 s.textContent=[
 '.pl-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}',
 /* THE LAYER TAG, THE RITUAL PAGE'S .rv-tg SHAPE, WRITTEN HERE. It first
    borrowed .rv-tg and pulled the Ritual page's whole sheet in to style it,
    off that page; that sheet carries .rv-calh twice, and tests/design.js
    gate 6 met the pair on Settings, where it had never been loaded before. */
 '.pl-tg{display:inline-flex;align-items:center;gap:5px;padding:0 8px;border-radius:999px;font-style:normal;font-size:12.5px;cursor:help;'
  +'color:var(--mid);border:1px solid color-mix(in srgb,var(--t) 50%,transparent)}',
 '.pl-tg svg{width:13px;height:13px;fill:none;stroke:var(--t);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
 '.pl-tg.pl-off{opacity:.55;border-style:dashed}',
 '.pl-rl{display:flex;align-items:center;gap:var(--g2)}',
 '.pl-rl em{display:block;font-style:normal;font-size:12.5px;color:var(--dim);margin-top:2px}',
 '.pl-code{display:flex;flex-direction:column;gap:var(--g2);padding:16px 15px;border-bottom:1px solid var(--edge)}',
 '.pl-code input{font-family:var(--num);width:100%;box-sizing:border-box}',
 '.pl-ctabs{padding:0 15px 15px}',
 '.pl-ctabs button{display:inline-flex;align-items:center;gap:6px}',
 '.pl-span{grid-column:1/-1}',
 '.pl-locked{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--g2);min-height:220px;text-align:center;padding:24px 15px}',
 '.pl-locked b{font-weight:500;color:var(--ink)}',
 '.pl-note{border-style:dashed}',
 '.pl-note .ac-row{border-bottom:0}',
 '.pl-ro .lp-f,.pl-ro .pr-pat,.pl-ro .pr-day{cursor:default}',
 '.pl-why{padding:0 15px 4px;display:flex;flex-direction:column;gap:6px}',
 '.pl-acts{padding:4px 15px 15px;display:flex;gap:var(--g2);flex-wrap:wrap;align-items:center}',
 '.pl-wd{display:flex;gap:6px;flex-wrap:wrap}',
 '.pl-wd button[aria-pressed=true]{border-color:var(--c,var(--ink))}',
 '.pl-sheet .ac-grp{margin:14px 0 6px}',
 '.pl-shead{display:flex;gap:12px;align-items:flex-start}',
 '.pl-shead .ac-gl svg{width:28px;height:28px}',
 '.pl-sug{list-style:none;margin:0 0 12px;padding:0}',
 /* the state chip on a sent ritual: the Ritual page's chip rule only holds
    inside its own card, and off it the svg drew at the size of the row */
 '.pl-st{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--mid);cursor:help}',
 '.pl-st svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
 '.pr-wrap .ac-row .pf-act{display:flex;gap:var(--g2);align-items:center;flex-wrap:wrap}',
 '.pr-wrap .ac-act .btn{white-space:nowrap;flex:0 0 auto}',
 /* the real sheet hides .pr-mid on a phone with nothing open, because there
    it was a placeholder; here it holds Invite and Pending */
 '@media (max-width:900px){.pr-wrap:not([data-open="1"]) .pr-mid.pl-inv{display:flex!important;flex-direction:column;gap:14px}}'
 ].join('\n');
 document.head.appendChild(s);}

/* ============================================================
   THE PRACTITIONER'S SIDE, P1 to P5
   ============================================================ */
function pracLiveRead(){
 if(!plSignedIn()){PL.roster=null; return Promise.resolve(false);}
 return plCall('GET','/v1/prac/roster').then(function(r){
  if(!r.ok||!r.body){PL.roster={err:plWhy(r), off:plOff(r), grants:[], invites:[]}; return false;}
  PL.roster=r.body; return true;});}
/* the real list the account page and the empty state read. Live grants only:
   a pending one has not been said yes to, and an ended one sees nothing. */
function pracLiveGrants(){return (PL.roster&&PL.roster.grants)||[];}
function pracLiveActive(){return pracLiveGrants().filter(function(g){return g.status==='active';});}

function plLevel(g){var t='Summary'; if(g.sight.body)t+=' +Body'; if(g.sight.field)t+=' +Field'; return t;}
/* P3, the roster. Each row is the client's key or the practitioner's own
   name for it, the grant level, and the mini ring off its Summary. */
function plClientsGrp(){
 if(!plSignedIn())return accGroup('Your clients',accRow('People who let you see their record','nobody yet'),
  'Clients connect to an account, so this list fills once you are signed in. Account, at the top, signs you in.','empty');
 if(!PL.roster)return accGroup('Your clients',accRow('People who let you see their record','reading'),'');
 if(PL.roster.err)return accGroup('Your clients',accRow('People who let you see their record',PL.roster.off?'nobody yet':'could not read'),esc(PL.roster.err),'refusal');
 var live=pracLiveActive(), ended=pracLiveGrants().filter(function(g){return g.ended_by;});
 var rows=live.map(function(g){var on=PL.sel===g.id, sm=g.summary&&g.summary.sum;
  return '<button type="button" class="pr-client'+(on?' on':'')+'" data-plo="'+esc(g.id)+'" aria-pressed="'+on+'">'
   +'<span class="pr-av">'+(sm?pracMiniRing(sm):plGl(PL_IC.link,'var(--dim)'))+'</span>'
   +'<span class="pr-cinfo"><span class="pr-cnm">'+esc(plNameOf(g))+'</span>'
   +'<span class="pr-cst">'+(!sm?'Nothing published yet. ':sm.unread||!sm.tier?'Nothing read yet. ':'Reads '+unp(pracTierWord(sm),null,'tier')+'. ')
   +'Since '+esc(plDate(g.accepted_at))+'</span>'+plTags(g.sight)+'</span></button>';}).join('');
 var gone=ended.map(function(g){
  return '<div class="pr-client" aria-disabled="true" style="cursor:default;color:var(--mid)"><span class="pr-av">'+plGl(PL_IC.unlink,'var(--dim)')+'</span>'
   +'<span class="pr-cinfo"><span class="pr-cnm">'+esc(plNameOf(g))+'</span>'
   +'<span class="pr-cst">'+(g.ended_by==='expired'?'Not answered in time, ':'Ended by '+(g.ended_by==='client'?'them':'you')+', ')
   +esc(plDate(g.ended_at))+'. Nothing of this record is visible.</span></span></div>';}).join('');
 return '<div class="ac-grp"><div class="ac-gh">Your clients</div>'
  +(rows||'<div class="pr-empty">Nobody yet. Send a link from Invite.</div>')
  +(gone?'<div class="ac-gh" style="border-top:1px solid var(--edge)">Ended</div>'+gone:'')
  +'<div class="ac-gf">A person says yes on their own device before you see anything of theirs, and can take it back with one press.</div></div>';}
/* P1, a link for one person. The token is shown once, the moment it is
   made, because only its hash is kept anywhere. */
function plInviteGrp(){
 var m=PL.made;
 var made=m?'<div class="pl-code"><span class="ac-rl">The link for this person. It works once and stops after fourteen days. It is shown once.</span>'
   +'<input type="text" id="pllink" readonly value="'+esc(plLinkOf(m.token))+'" aria-label="The link">'
   +'<span class="pf-act"><button class="btn pri" type="button" data-pl="copy">Copy link</button></span></div>':'';
 return '<div class="ac-grp"><div class="ac-gh">Invite</div>'+made
  +'<form class="ac-row ac-edit pf-edit" id="plinvform"><label class="ac-rl" for="pllabel">Your name, as your client reads it</label>'
  +'<span class="pf-act"><input type="text" id="pllabel" maxlength="60" autocomplete="name" spellcheck="false" value="'+esc(devGet('pracLiveLabel')||'')+'">'
  +'<button class="btn'+(m?'':' pri')+'" type="submit">'+(m?'Another link':'Make a link')+'</button></span></form>'
  +'<form class="ac-row ac-edit pf-edit" id="plredform"><label class="ac-rl" for="plcode">Have a link from a client? Paste it</label>'
  +'<span class="pf-act"><input type="text" id="plcode" autocomplete="off" spellcheck="false"><button class="btn" type="submit">Connect</button></span></form></div>';}
/* P2, codes still open and connections waiting for the client's yes */
function plPendingGrp(){
 var inv=((PL.roster&&PL.roster.invites)||[]).filter(function(i){return i.status==='open';});
 var wait=pracLiveGrants().filter(function(g){return g.status==='pending';});
 var rows=inv.map(function(i){
  return '<div class="ac-row"><span class="ac-rl pl-rl">'+plGl(RIT_IC.arrow,seatCol('Throat'))
   +'<span>'+(i.side==='client'?'A link you made as a client':'Link made '+esc(plDate(i.created_at)))
   +'<em>Not used yet. Stops '+esc(plDate(i.expires_at))+'.</em></span></span>'
   +'<span class="pf-act"><button class="btn" type="button" data-plre="'+esc(i.id)+'"'+plTip('New link','Stops this link at once and makes a fresh one in its place.')+'>New link</button>'
   +'<button class="btn" type="button" data-plrv="'+esc(i.id)+'">Turn off</button></span></div>';}).join('')
  +wait.map(function(g){
  return '<div class="ac-row"><span class="ac-rl pl-rl">'+plGl(RIT_IC.clock,seatCol('Solar'))
   +'<span>'+esc(plNameOf(g))+'<em>Used '+esc(plDate(g.created_at))+'. Waiting for their yes.</em></span></span>'
   +'<button class="btn" type="button" data-plend="'+esc(g.id)+'">Cancel</button></div>';}).join('');
 return accGroup('Pending',rows||accRow('Links and answers waiting','none'),
  'A link no one answers stops working after fourteen days.');}

/* P4, one client. Summary always; Body and Field as tabs that read
   locked while the client has not switched them on, and no button that asks */
function plSnapOf(gid){return PL.snap[gid]||null;}
/* keep: stay on the tab already open. A send or a withdraw reads the client
   again and must leave the practitioner where they pressed, not on Summary */
function plOpen(gid,keep){
 PL.sel=gid; if(!keep)PL.tab='sum'; PL.write=false; renderPrac();
 return Promise.all([
  plCall('GET','/v1/prac/grants/'+encodeURIComponent(gid)+'/snapshot').then(function(r){
   if(!r.ok||!r.body){PL.snap[gid]={err:plWhy(r)}; return;}
   var s=r.body.snapshot;
   if(s){var e=pracShareCheck(s); if(e.length){PL.snap[gid]={err:'The snapshot did not read: '+e.join('; ')+'.'}; return;}}
   PL.snap[gid]={snap:s, grant:r.body.grant};}),
  plCall('GET','/v1/prac/grants/'+encodeURIComponent(gid)+'/proposals').then(function(r){
   PL.props[gid]=(r.ok&&r.body)?r.body.proposals:{err:plWhy(r)};})
 ]).then(function(){if(PL.sel===gid)renderPrac();});}
/* A READ ONLY COPY OF A CARD. The cards below are the example page's own
   (pracSayCard, pracFigs, pracDaysCard, pracPatsCard), and every figure in
   them is a press that opens a drill on PEOPLE[PRAC_SEL]. A live client is
   not a row of PEOPLE, so each press would be a control that does nothing,
   which is the one thing a control here may not be. The press is taken off,
   the markup is otherwise theirs. */
function plRO(h){
 return '<div class="pl-ro">'+String(h).replace(/<button type="button" class="([^"]*)" data-pr[a-z]+="[^"]*"([^>]*)>/g,'<div class="$1"$2>')
  .replace(/<\/button>/g,'</div>')+'</div>';}
function plRingCard(nm,s){
 var now=pracTierWord(s), tierWord=s.tierDef?unp(now,null,'tier'):esc(now);
 var n=s.loaded.length, heavy=n?s.loaded[0]:s.heaviest;
 var sent=n?'<b>'+n+'</b> address'+(n===1?' is':'es are')+' carrying. The heaviest: '+esc(heavy.k)
  :heavy?'Nothing is above the line. The heaviest, under it: '+esc(heavy.k):'Nothing is carrying.';
 return accGroup('The reading','<div class="pr-ringwrap"><svg viewBox="0 0 200 200" class="pr-ringsvg">'
   +pracArcs(s.loaded,100,100,74,18,0.05,false)+'</svg><div class="pr-ringmid"><div class="pr-ringtier">'+tierWord+'</div></div></div>'
   +(s.tierDef?'<p class="ac-lead" style="margin:14px 15px 0">'+esc(s.tierDef)+'</p>':'')
   +'<p class="ac-lead" style="margin:10px 15px 15px">'+sent+'</p>',
  'One ring, seven assemblage points. A brighter arc holds more charge at that point. Computed on '
  +esc(nm)+'’s own device and never from their own words, which are never shared.');}
function plLocked(nm,k){
 return '<div class="ac-grp pl-span"><div class="ac-gh">'+plLay()[k].nm+'</div><div class="pl-locked">'
  +plGl(ACC_SECS.filter(function(x){return x.k==='privacy';})[0].ic,'var(--dim)')
  +'<b>'+esc(nm)+' has not shared this</b><span class="ac-rv">Only '+esc(nm)+' can turn it on, on their own device.</span></div></div>';}
/* BODY, AS ITS ADDRESSES. The body figure (bmRender, ui/map.js) draws the
   loaded profile's own field and is not built to draw a second person's from
   a list of numbers, so this is the same data as rows by seat: the places,
   the nerve at each, the weight. Named as not done in the hand back. */
function plBodyCard(nm,b){
 var by={}; b.addrs.forEach(function(a){(by[a.b]=by[a.b]||[]).push(a);});
 var rows=BANDS.filter(function(s){return by[s];}).map(function(s){
  return '<div class="ac-gh" style="--c:'+seatCol(s)+'">'+esc(s)+'</div>'+by[s].map(function(a){
   return accRow(a.k+(a.n?', '+a.n:''),String(a.sq),{num:true});}).join('');}).join('');
 return '<div class="ac-grp pl-span"><div class="ac-gh">'+esc(nm)+'’s body, by seat</div>'
  +(rows||'<div class="pr-empty">Nothing is carrying.</div>')
  +'<div class="ac-gf">Every address carrying charge, heaviest first in each seat, as '+esc(nm)+'’s device read it.</div></div>';}
function plFieldR(f){return {loop:{patterns:f.loop.patterns, confirmed:f.loop.confirmed, unanswered:f.loop.unanswered,
 declined:f.loop.declined, practice:{events:f.loop.practised}, misses:f.loop.misses}, days:f.days};}
function plDetail(){
 var g=pracLiveGrants().filter(function(x){return x.id===PL.sel;})[0];
 if(!g)return '';
 var nm=plNameOf(g), o=plSnapOf(g.id), L=plLay();
 var tab=function(k,lab,on){return '<button type="button" data-plt="'+k+'" aria-pressed="'+(PL.tab===k)+'">'
  +(on?'':'<svg viewBox="0 0 24 24" class="rv-ic" aria-hidden="true" style="width:14px;height:14px">'+ACC_SECS.filter(function(x){return x.k==='privacy';})[0].ic+'</svg>')+lab+'</button>';};
 var head='<div class="ac-grp pr-head"><div class="ac-hd" style="padding:13px 15px 0;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center">'
  +'<h2 class="kb-h plain">'+esc(nm)+'</h2>'+plTags(g.sight)+'</div>'
  +'<form class="ac-row ac-edit pf-edit" id="plnameform"><label class="ac-rl" for="plname">Your name for them, on this device only</label>'
  +'<span class="pf-act"><input type="text" id="plname" maxlength="60" value="'+esc(plNames()[g.id]||'')+'"><button class="btn" type="submit">Save</button></span></form>'
  +'<div class="pr-sort pl-ctabs">'+tab('sum','Summary',1)+tab('body','Body',g.sight.body)+tab('field','Field',g.sight.field)+tab('rit','Rituals',1)+'</div></div>';
 var body;
 if(!o)body='<div class="ac-grp pl-span"><div class="pr-empty">Reading.</div></div>';
 else if(o.err)body='<div class="ac-grp pl-span"><div class="pr-empty">'+esc(o.err)+'</div></div>';
 else if(!o.snap)body='<div class="ac-grp pl-span"><div class="pr-empty">'+esc(nm)+'’s device has not published a reading yet. It does the next time they open the app.</div></div>';
 else{var s=o.snap;
  if(PL.tab==='sum')body='<div class="pr-stack">'+plRingCard(nm,s.sum)+'</div><div class="pr-stack">'
   +accGroup('Published',accRow('Computed on their device',new Date(s.published_at).toLocaleString()),
    s.current?'':'They changed what is shared since this was computed, so only Summary shows until their device publishes again.')+'</div>';
  else if(PL.tab==='body')body=!g.sight.body?plLocked(nm,'body'):s.body?plBodyCard(nm,s.body)
   :'<div class="ac-grp pl-span"><div class="pr-empty">Shared, and not published yet at the new setting.</div></div>';
  else if(PL.tab==='field'){var R=s.field?plFieldR(s.field):null;
   body=!g.sight.field?plLocked(nm,'field'):R?'<div class="pr-stack">'+plRO(pracSayCard({nm:nm},R)+pracFigs(R)+pracDaysCard(R))+'</div><div class="pr-stack">'+plRO(pracPatsCard(R))+'</div>'
    :'<div class="ac-grp pl-span"><div class="pr-empty">Shared, and not published yet at the new setting.</div></div>';}
  else body=plRitPane(g,nm,s);}
 if(PL.tab==='rit'&&(!o||!o.snap))body=plRitPane(g,nm,null);
 return '<div class="pr-mid" id="prmid">'+head+body
  +'<div class="pr-stack pl-span">'+accGroup('This connection','<div class="ac-row ac-act"><span class="ac-rl">Ends it at once. '+esc(nm)+' is told it ended, not why.</span>'
   +'<button class="btn dgr" type="button" data-plend="'+esc(g.id)+'">Disconnect</button></div>')+'</div></div>';}
/* P5. What the client is running, when Field is shared, the rituals sent,
   and a writer. The writer is this page's own: the Ritual page's builder
   (ritBuildHtml) writes into the practitioner's own RIT state, and a ritual
   drafted for somebody else must never land in your own builder. */
var PL_ST={sent:['Sent',RIT_IC.arrow,'It is on their Ritual page as a suggestion from you.'],
 accepted:['Accepted','<path d="M5 12.5l4.5 4.5L19 7"/>','They added it to their practice. It is theirs now.'],
 declined:['Declined',RIT_IC.x,'They said no. You see that, and nothing else about it.'],
 withdrawn:['Withdrawn',RIT_IC.back,'You took it back.']};
function plStChip(st){var w=PL_ST[st]||[st,RIT_IC.minus,''];
 return '<span class="pl-st"'+plTip(w[0],w[2])+'><svg viewBox="0 0 24 24" aria-hidden="true">'+w[1]+'</svg>'+w[0]+'</span>';}
function plRitRow(p,tail){
 return '<div class="ac-row"><span class="ac-rl pl-rl">'+plGl(SEATGLYPH[p.band]||SEATGLYPH._,p.band?seatCol(p.band):'var(--mid)')
  +'<span>'+esc(ritName(p.steps)||p.steps.join(', '))+'<em>'+esc(ritOften(p.on))+', '+(p.tm||ritMin(p.steps))+' min'
  +(p.why?'. “'+esc(p.why)+'”':'')+'</em></span></span>'+(tail||'')+'</div>';}
function plRitPane(g,nm,s){
 var run=(s&&s.field&&s.field.rituals)?s.field.rituals.filter(function(x){return x.active;}):null;
 var own=!g.sight.field?accRow('What they are running','shared with Field')
  :run?(run.map(function(x){return plRitRow(x);}).join('')||accRow('What they are running','nothing'))
  :accRow('What they are running','not published yet');
 var P=PL.props[g.id], sent=Array.isArray(P)?P.map(function(p){var x=p.payload||{steps:[]};
   return plRitRow({steps:x.steps||[],on:x.on,tm:x.tm,band:x.band,why:x.why},
    '<span class="pf-act">'+plStChip(p.status)+(p.status==='sent'?'<button class="btn" type="button" data-plw="'+esc(p.id)+'">Withdraw</button>':'')+'</span>');}).join('')
  :P&&P.err?accRow('Sent by you',P.err):'';
 var list=accGroup(nm+'’s rituals',own,'Read only. You cannot mark a day or start a timer for them.')
  +accGroup('Suggested by you',sent||accRow('Rituals you sent','none'),
   'Nothing is added unless '+esc(nm)+' says yes on their own Ritual page.');
 return '<div class="pr-stack">'+list+'</div><div class="pr-stack">'+plWriter(nm)+'</div>';}
var PLW={k:'',on:null,tm:null,band:''};
function plWriter(nm){
 if(!PL.write)return accGroup('A new ritual','<div class="ac-row ac-act"><span class="ac-rl">Written for '+esc(nm)
  +'. It shows on their Ritual page as a suggestion from you.</span><button class="btn pri" type="button" data-pl="write">New ritual</button></div>');
 var opts=PRACTICE.map(function(p){return '<option value="'+esc(p.k)+'"'+(PLW.k===p.k?' selected':'')+'>'+esc(p.nm)+', '+p.min+' min</option>';}).join('');
 var wd=RIT_WCOL.map(function(d){var on=!!(PLW.on&&PLW.on.indexOf(d)>=0);
  return '<button type="button" class="btn" data-plwd="'+d+'" aria-pressed="'+on+'">'+RIT_WDN[d]+'</button>';}).join('');
 return '<div class="ac-grp"><div class="ac-gh">New, for '+esc(nm)+'</div>'
  +'<div class="ac-row ac-edit"><label class="ac-rl" for="plwk">Practice</label><select id="plwk"><option value="">Choose one</option>'+opts+'</select></div>'
  +'<div class="ac-row"><span class="ac-rl">Days<em>None picked is every day</em></span><span class="pl-wd">'+wd+'</span></div>'
  +'<div class="ac-row ac-edit"><label class="ac-rl" for="plwb">Seat</label><select id="plwb"><option value="">None</option>'
  +BANDS.map(function(b){return '<option'+(PLW.band===b?' selected':'')+'>'+esc(b)+'</option>';}).join('')+'</select></div>'
  +'<div class="pl-why"><label class="ac-rl" for="plwy">Why, in your words</label><textarea class="pr-note-ta" id="plwy" maxlength="600"></textarea></div>'
  +'<div class="pl-acts"><button class="btn" type="button" data-pl="discard">Discard</button>'
  +'<button class="btn pri" type="button" data-pl="send">Send to '+esc(nm)+'</button></div></div>';}

/* the right hand column with nobody open: Invite above Pending */
function pracLiveSide(){
 if(!plSignedIn()||(PL.roster&&PL.roster.off))return '';
 return '<div class="pr-mid pl-inv" id="prmid"><div class="pr-stack">'+plInviteGrp()+'</div><div class="pr-stack">'+plPendingGrp()+'</div></div>';}
function pracLiveDetail(){return PL.sel?plDetail():'';}
function pracLiveOpen(){return !!PL.sel;}
/* A SURFACE THAT DRAWS BEFORE ITS LIST HAS BEEN READ ASKS FOR IT ONCE, and
   repaints when it lands. The flag is what stops a repaint asking again. */
function plEnsure(which){
 if(!plSignedIn()||PL['reading_'+which])return;
 if(which==='roster'?PL.roster:PL.mine)return;
 PL['reading_'+which]=true;
 (which==='roster'?pracLiveRead():pracMineRead()).then(function(){PL['reading_'+which]=false; plRepaint();});}
function pracLiveList(){plCss(); plEnsure('roster'); return plClientsGrp();}
function pracLiveClear(){PL.sel=null;}

function plBusy(b,on){if(b){b.disabled=!!on; b.setAttribute('aria-busy',on?'true':'false');}}
function plThen(b,r,ok,after){
 plBusy(b,false);
 if(r.ok){if(ok)status(ok,'ok');} else status(plWhy(r),'fail');
 return (after?after(r):Promise.resolve()).then(function(){return r;});}
function pracLiveWire(host){
 var q=function(s){return host.querySelectorAll(s);};
 q('[data-plo]').forEach(function(b){b.onclick=function(){if(typeof pracDrillClear==='function')pracDrillClear(); PRAC_SEL=null; plOpen(b.getAttribute('data-plo'));};});
 q('[data-plt]').forEach(function(b){b.onclick=function(){PL.tab=b.getAttribute('data-plt'); renderPrac();};});
 var inv=host.querySelector('#plinvform');
 if(inv)inv.onsubmit=function(e){e.preventDefault(); var b=inv.querySelector('button'), lb=($('pllabel')||{}).value||'';
  devSet('pracLiveLabel',lb.trim()); plBusy(b,true);
  plCall('POST','/v1/prac/invites',{side:'prac',label:lb.trim()}).then(function(r){
   if(r.ok)PL.made={token:r.body.token, invite:r.body.invite};
   return plThen(b,r,'A link is made. Copy it and send it to one person.',function(){return pracLiveRead().then(renderPrac);});});};
 var cp=host.querySelector('[data-pl="copy"]');
 if(cp)cp.onclick=function(){var t=$('pllink'); if(!t)return; t.select();
  var done=function(ok){status(ok?'Copied.':'Copy did not work here. The link is selected, so copy it by hand.',ok?'ok':'fail');};
  try{if(navigator.clipboard)navigator.clipboard.writeText(t.value).then(function(){done(true);},function(){done(false);}); else done(document.execCommand('copy'));}catch(e){done(false);}};
 var red=host.querySelector('#plredform');
 if(red)red.onsubmit=function(e){e.preventDefault(); var b=red.querySelector('button');
  var tok=plTokenOf(($('plcode')||{}).value); if(!tok){status('That is not a link or a code from a client.','fail'); return;}
  plBusy(b,true);
  plCall('POST','/v1/prac/redeem',{token:tok, label:(devGet('pracLiveLabel')||'').trim()||null}).then(function(r){
   return plThen(b,r,'Connected. It goes live when your client says yes on their device.',function(){return pracLiveRead().then(renderPrac);});});};
 q('[data-plrv]').forEach(function(b){b.onclick=function(){plBusy(b,true);
  plCall('DELETE','/v1/prac/invites/'+encodeURIComponent(b.getAttribute('data-plrv'))).then(function(r){
   return plThen(b,r,'That link is off. Nobody can use it.',function(){return pracLiveRead().then(renderPrac);});});};});
 q('[data-plre]').forEach(function(b){b.onclick=function(){plBusy(b,true);
  plCall('POST','/v1/prac/invites/'+encodeURIComponent(b.getAttribute('data-plre'))+'/reissue').then(function(r){
   if(r.ok)PL.made={token:r.body.token, invite:r.body.invite};
   return plThen(b,r,'The old link stopped. A new one is made above.',function(){return pracLiveRead().then(renderPrac);});});};});
 q('[data-plend]').forEach(function(b){b.onclick=function(){plBusy(b,true);
  plCall('POST','/v1/prac/grants/'+encodeURIComponent(b.getAttribute('data-plend'))+'/end').then(function(r){
   if(r.ok&&PL.sel===b.getAttribute('data-plend'))PL.sel=null;
   return plThen(b,r,'Ended. They are told it ended, and nothing of the record is visible.',function(){return pracLiveRead().then(renderPrac);});});};});
 var nf=host.querySelector('#plnameform');
 if(nf)nf.onsubmit=function(e){e.preventDefault(); plNameSet(PL.sel,($('plname')||{}).value); renderPrac();};
 var w=host.querySelector('[data-pl="write"]'); if(w)w.onclick=function(){PL.write=true; PLW={k:'',on:null,tm:null,band:''}; renderPrac();};
 var dz=host.querySelector('[data-pl="discard"]'); if(dz)dz.onclick=function(){PL.write=false; renderPrac();};
 var wk=host.querySelector('#plwk'); if(wk)wk.onchange=function(){PLW.k=wk.value;};
 var wb=host.querySelector('#plwb'); if(wb)wb.onchange=function(){PLW.band=wb.value;};
 q('[data-plwd]').forEach(function(b){b.onclick=function(){var d=+b.getAttribute('data-plwd'), on=PLW.on||[];
  var i=on.indexOf(d); if(i>=0)on.splice(i,1); else on.push(d); PLW.on=on.length?on.sort():null;
  b.setAttribute('aria-pressed',i<0?'true':'false');};});
 var sd=host.querySelector('[data-pl="send"]');
 if(sd)sd.onclick=function(){
  var p={steps:PLW.k?[PLW.k]:[], on:PLW.on&&PLW.on.length<7?PLW.on.slice():null, tm:null, days:0, band:PLW.band||'', why:(($('plwy')||{}).value||'').trim()};
  var e=pracPropCheck(p); if(e.length){status(PLW.k?'Not sent: '+e.join('; ')+'.':'Choose a practice first.','fail'); return;}
  var gid=PL.sel; plBusy(sd,true);
  plCall('POST','/v1/prac/grants/'+encodeURIComponent(gid)+'/proposals',{kind:'ritual', payload:p}).then(function(r){
   if(r.ok)PL.write=false;
   return plThen(sd,r,'Sent. It is on their Ritual page as a suggestion from you.',function(){return plOpen(gid,true);});});};
 q('[data-plw]').forEach(function(b){b.onclick=function(){var gid=PL.sel; plBusy(b,true);
  plCall('POST','/v1/prac/proposals/'+encodeURIComponent(b.getAttribute('data-plw'))+'/withdraw').then(function(r){
   return plThen(b,r,'Withdrawn. It is off their Ritual page.',function(){return plOpen(gid,true);});});};});}

/* ============================================================
   THE CLIENT'S SIDE, C1 to C4
   ============================================================ */
/* a link or a bare code: the token is the part after #prac= when there is
   one, and the whole thing otherwise */
function plTokenOf(v){
 v=String(v||'').trim(); var m=/#prac=([A-Za-z0-9_-]+)/.exec(v); if(m)v=m[1];
 return /^[A-Za-z0-9_-]{20,100}$/.test(v)?v:'';}
function pracMineRead(){
 if(!plSignedIn()){PL.mine=null; return Promise.resolve(false);}
 return plCall('GET','/v1/prac/mine').then(function(r){
  if(!r.ok||!r.body){PL.mine={err:plWhy(r), off:plOff(r), grants:[], proposals:[], invites:[]}; return false;}
  PL.mine=r.body; return true;});}
function plMineGrants(){return (PL.mine&&PL.mine.grants)||[];}
/* the count the account page's practitioner line and the privacy list read */
function pracSightLive(){return plMineGrants().filter(function(g){return g.status==='active';});}

/* C1, the accept sheet. Summary is fixed; Body and Field start off and only
   the person turns them on. Decline ends the pending connection, so the
   practitioner reads that it was not taken up. */
var PL_C1={g:null, body:false, field:false};
function plC1Open(g){
 PL_C1={g:g, body:false, field:false}; plCss(); plC1Paint();}
function plC1Sw(k,nm,em){var L=plLay()[k], on=PL_C1[k];
 return '<div class="ac-row ac-tog"><span class="ac-rl pl-rl">'+plGl(L.ic,on?seatCol(L.b):'var(--dim)')+'<span><span class="tipu"'+plTip(nm,L.say)+'>'+nm+'</span><em>'+em+'</em></span></span>'
  +'<button class="ac-sw'+(on?' on':'')+'" type="button" role="switch" aria-checked="'+!!on+'" aria-label="Share '+nm+'" data-plc1s="'+k+'"><i></i></button></div>';}
function plC1Paint(){
 var g=PL_C1.g, who=g.prac_label||'A practitioner', L=plLay();
 sheetOpen('<div class="pl-sheet"><div class="pl-shead">'+plGl(ACC_SECS[0].ic,seatCol('Throat'))+'<div><h3 class="sh-h">'+esc(who)+' asks to see your record</h3>'
  +'<p class="sh-p dim">Through a link, used '+esc(plDate(g.created_at))+'</p></div></div>'
  +'<div class="ac-grp"><div class="ac-row"><span class="ac-rl pl-rl">'+plGl(L.sum.ic,seatCol('Throat'))
  +'<span><span class="tipu"'+plTip('Summary',L.sum.say)+'>Summary</span><em>Your tier word and the seven seats</em></span></span><span class="ac-rv">always shared</span></div>'
  +plC1Sw('body','Body','Where charge sits in your body')+plC1Sw('field','Field','Your patterns and practice over time')+'</div>'
  +'<p class="sh-p dim">Your stories and your name are never shared by this. Change it any time in Account, Privacy.</p>'
  +'<div class="sh-act"><button class="btn" type="button" data-plc1="no">Decline</button><button class="btn pri" type="button" data-plc1="yes">Accept</button></div></div>');
 var c=$('sheet-card'); if(!c)return;
 c.querySelectorAll('[data-plc1s]').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-plc1s'); PL_C1[k]=!PL_C1[k]; plC1Paint();};});
 c.querySelectorAll('[data-plc1]').forEach(function(b){b.onclick=function(){
  var yes=b.getAttribute('data-plc1')==='yes', gid=PL_C1.g.id; plBusy(b,true);
  (yes?plCall('POST','/v1/prac/grants/'+encodeURIComponent(gid)+'/accept',{body:!!PL_C1.body, field:!!PL_C1.field})
   :plCall('POST','/v1/prac/grants/'+encodeURIComponent(gid)+'/end')).then(function(r){
   plBusy(b,false);
   if(!r.ok){status(plWhy(r),'fail'); return;}
   sheetShut();
   status(yes?'Connected. '+(PL_C1.g.prac_label||'They')+' sees your Summary'+(PL_C1.body?', Body':'')+(PL_C1.field?', Field':'')+'.':'Declined. Nothing was shared.',yes?'ok':'ok');
   return pracMineRead().then(function(){if(yes)return pracPublish(true);}).then(plRepaint);});};});}
function plRedeem(tok,b){
 plBusy(b,true);
 return plCall('POST','/v1/prac/redeem',{token:tok}).then(function(r){
  plBusy(b,false);
  if(!r.ok||!r.body){status(plWhy(r),'fail'); return;}
  if(r.body.grant.side==='client')plC1Open(r.body.grant);
  else{status('Connected. It goes live when your client says yes.','ok'); pracLiveRead().then(plRepaint);}});}

/* C2, who can see my record, on the person's own Privacy page */
function plWhoRow(g){var L=plLay(), who=g.prac_label||'A practitioner';
 var sw=function(k,nm){var on=!!g.sight[k], x=L[k];
  return '<div class="ac-row ac-tog"><span class="ac-rl pl-rl">'+plGl(x.ic,on?seatCol(x.b):'var(--dim)')+'<span class="tipu"'+plTip(nm,x.say)+'>'+nm+'</span></span>'
   +'<button class="ac-sw'+(on?' on':'')+'" type="button" role="switch" aria-checked="'+on+'" aria-label="Share '+nm+' with '+esc(who)+'" data-plsw="'+esc(g.id)+':'+k+'"><i></i></button></div>';};
 if(g.status==='pending')return '<div class="ac-grp"><div class="ac-gh">'+esc(who)+'</div>'
  +'<div class="ac-row ac-act"><span class="ac-rl">Waiting for your answer. Nothing is shared yet.</span>'
  +'<span class="pf-act"><button class="btn pri" type="button" data-plans="'+esc(g.id)+'">Answer</button></span></div></div>';
 return '<div class="ac-grp"><div class="ac-gh" style="display:flex;gap:8px"><span>'+esc(who)+'</span><span style="margin-left:auto">Since '+esc(plDate(g.accepted_at))+'</span></div>'
  +'<div class="ac-row"><span class="ac-rl pl-rl">'+plGl(L.sum.ic,seatCol('Throat'))+'<span class="tipu"'+plTip('Summary',L.sum.say)+'>Summary</span></span><span class="ac-rv">always shared</span></div>'
  +sw('body','Body')+sw('field','Field')
  +'<div class="ac-row ac-act"><span class="ac-rl">Ends it at once. '+esc(who)+' is told it ended, not why.</span>'
  +'<button class="btn dgr" type="button" data-plend="'+esc(g.id)+'">Disconnect</button></div></div>';}
/* C4, an ended connection, said once on each side until dismissed */
function plEndedSeen(){var o=devGet('pracEndedSeen'); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}
function plEndedNotes(list,mine){
 var seen=plEndedSeen();
 return list.filter(function(g){return g.ended_by&&!seen[g.id];}).map(function(g){
  var who=mine?(g.prac_label||'A practitioner'):plNameOf(g);
  var by=g.ended_by==='expired'?'was not answered in time':(g.ended_by===(mine?'client':'prac')?'was ended by you':'was ended by '+(mine?esc(who):'them'));
  return '<div class="ac-grp pl-note" role="status"><div class="ac-row"><span class="ac-rl pl-rl">'+plGl(PL_IC.unlink,'var(--mid)')
   +'<span>The connection with '+esc(who)+' '+by+', '+esc(plDate(g.ended_at))
   +'<em>'+(mine?esc(who)+' no longer sees your record.':'Nothing of this record is visible any more. Your notes stay on this device.')+'</em></span></span>'
   +'<button class="btn" type="button" data-plseen="'+esc(g.id)+'">Dismiss</button></div></div>';}).join('');}
function pracPrivacyHtml(){
 plCss(); plEnsure('mine');
 if(!plSignedIn())return accGroup('Who can see this',accRow('People who can see this record','nobody'),
  'Nobody sees this but you. A practitioner can see it only after you say yes, which needs you signed in. '
  +'Each yes is listed here, with what they see, and one press takes it back.');
 if(PL.mine&&PL.mine.off)return accGroup('Who can see this',accRow('People who can see this record','nobody'),
  'Nobody sees this but you. '+PL_OFF+' When it is, a practitioner can see this only after you say yes here.');
 var gs=plMineGrants(), live=gs.filter(function(g){return g.status==='active';}), wait=gs.filter(function(g){return g.status==='pending';});
 var h=plEndedNotes(gs,true)
  +accGroup('Who can see this',accRow('People who can see this record',PL.mine?(live.length?String(live.length):'nobody'):'reading'),
   PL.mine&&PL.mine.err?esc(PL.mine.err):'A practitioner sees what you switch on here and nothing else. Your stories and your name are never shared by this.')
  +wait.concat(live).map(plWhoRow).join('')
  +accGroup('Have a link from a practitioner?','<form class="ac-row ac-edit pf-edit" id="plmycode"><label class="ac-rl" for="plmyin">Link or code</label>'
   +'<span class="pf-act"><input type="text" id="plmyin" autocomplete="off" spellcheck="false" value="'+esc(PL.held||'')+'"><button class="btn" type="submit">Connect</button></span></form>',
   'Connecting asks you first what to share. Summary is the floor; Body and Field are off until you turn them on.');
 return h;}
function pracPrivacyWire(host){
 if(!host)return;
 var f=host.querySelector('#plmycode');
 if(f)f.onsubmit=function(e){e.preventDefault(); var tok=plTokenOf(($('plmyin')||{}).value);
  if(!tok){status('That is not a link or a code from a practitioner.','fail'); return;}
  PL.held=''; plRedeem(tok,f.querySelector('button'));};
 host.querySelectorAll('[data-plans]').forEach(function(b){b.onclick=function(){
  var g=plMineGrants().filter(function(x){return x.id===b.getAttribute('data-plans');})[0]; if(g)plC1Open(g);};});
 host.querySelectorAll('[data-plsw]').forEach(function(b){b.onclick=function(){
  var p=b.getAttribute('data-plsw').split(':'), g=plMineGrants().filter(function(x){return x.id===p[0];})[0]; if(!g)return;
  var body={}; body[p[1]]=!g.sight[p[1]]; plBusy(b,true);
  plCall('PUT','/v1/prac/grants/'+encodeURIComponent(g.id)+'/scope',body).then(function(r){
   plBusy(b,false);
   if(!r.ok){status(plWhy(r),'fail'); return;}
   status((p[1]==='body'?'Body':'Field')+(body[p[1]]?' is shared now.':' is not shared any more. It was taken off the server at once.'),'ok');
   return pracMineRead().then(function(){return pracPublish(true);}).then(plRepaint);});};});
 host.querySelectorAll('[data-plend]').forEach(function(b){b.onclick=function(){plBusy(b,true);
  plCall('POST','/v1/prac/grants/'+encodeURIComponent(b.getAttribute('data-plend'))+'/end').then(function(r){
   plBusy(b,false);
   if(!r.ok){status(plWhy(r),'fail'); return;}
   status('Ended. They no longer see your record.','ok');
   return pracMineRead().then(plRepaint);});};});
 host.querySelectorAll('[data-plseen]').forEach(function(b){b.onclick=function(){
  var o=plEndedSeen(); o[b.getAttribute('data-plseen')]=1; var r=devSet('pracEndedSeen',o);
  if(!r.ok)status('Not dismissed for good. This browser would not keep it.','fail');
  plRepaint();};});}

/* C3, a ritual from a practitioner on the person's Ritual page. Add writes
   it through ritStartPlan, the same writer the person's own builder uses, so
   it lands on the record through the same boundary (practicePlansCheck) and
   is theirs from then on. The server is told after the record has it. */
function pracRitHtml(){
 plEnsure('mine');
 var P=(PL.mine&&PL.mine.proposals)||[]; if(!P.length)return '';
 plCss();
 var gs={}; plMineGrants().forEach(function(g){gs[g.id]=g;});
 return '<ul class="pl-sug">'+P.map(function(p){
  var x=p.payload||{}, e=pracPropCheck(x), who=(gs[p.grant_id]&&gs[p.grant_id].prac_label)||'Your practitioner';
  var col=x.band?seatCol(x.band):seatCol('Throat');
  if(e.length)return '<li class="ac-grp"><div class="ac-row"><span class="ac-rl">A ritual from '+esc(who)+' could not be read here: '+esc(e.join('; '))+'.</span></div></li>';
  return '<li class="rv-sg1" style="--c:'+col+'"><div class="rv-sgh"><span class="rv-sgs" aria-hidden="true">'+plGl(ACC_SECS[0].ic,col)+'</span>'
   +'<span class="rv-sgt0"><span class="rv-sgn">'+esc(ritName(x.steps))+'</span><span class="rv-sgm">'+(x.tm||ritMin(x.steps))+' minutes</span></span></div>'
   +(x.why?'<p class="rv-sgd" style="color:var(--mid)">“'+esc(x.why)+'”</p>':'')
   +'<div class="rv-sgo"><span class="rv-sgc"'+plTip('From '+who,who+' wrote this for you. It is not in your practice unless you add it. They see whether you add it or say no, nothing else.')+'>'
   +'<svg viewBox="0 0 24 24" aria-hidden="true">'+ACC_SECS[0].ic+'</svg>From '+esc(who)+'</span>'
   +'<span class="rv-sgc"><svg viewBox="0 0 24 24" aria-hidden="true">'+RIT_IC.cal+'</svg>'+esc(ritOften(x.on))+'</span></div>'
   +'<div class="rv-sga"><button type="button" class="btn pri" data-plra="'+esc(p.id)+'">Add to practice</button>'
   +'<button type="button" class="btn rv-sgq" data-plrd="'+esc(p.id)+'">Dismiss</button></div></li>';}).join('')+'</ul>';}
function pracRitWire(host){
 if(!host)return;
 var find=function(id){return ((PL.mine&&PL.mine.proposals)||[]).filter(function(p){return p.id===id;})[0];};
 host.querySelectorAll('[data-plra]').forEach(function(b){b.onclick=function(){
  var p=find(b.getAttribute('data-plra')); if(!p)return; var x=p.payload;
  if(pracPropCheck(x).length)return;
  /* the record first, because it is theirs: a ritual that landed and an
     answer that did not reach the server is said, and the next press of
     Add finds the steps already running and only wakes them */
  var ok=ritStartPlan({steps:x.steps.slice(), band:x.band||'', on:x.on?x.on.slice():null, tm:x.tm||null,
   days:x.days||0, tags:x.band?[x.band]:[]},'Added to your practice.');
  if(!ok)return;
  plBusy(b,true);
  plCall('POST','/v1/prac/proposals/'+encodeURIComponent(p.id)+'/answer',{accept:true}).then(function(r){
   plBusy(b,false);
   if(!r.ok)status('Added to your practice. Your practitioner was not told yet: '+plWhy(r),'fail');
   return pracMineRead().then(plRepaint);});};});
 host.querySelectorAll('[data-plrd]').forEach(function(b){b.onclick=function(){plBusy(b,true);
  plCall('POST','/v1/prac/proposals/'+encodeURIComponent(b.getAttribute('data-plrd'))+'/answer',{accept:false}).then(function(r){
   plBusy(b,false);
   status(r.ok?'Dismissed. They see that you said no.':plWhy(r),r.ok?'ok':'fail');
   return pracMineRead().then(plRepaint);});};});}

/* ============================================================
   PUBLISHING. The client's own device computes the snapshot and sends it,
   one per live connection, at that connection's scope. Never while the
   loaded record is a worked example: an example is not this person.
   ============================================================ */
function plSnapFor(g){
 var r=compute(), L=null, days=[], plans=[];
 if(g.sight.field){
  try{L=loopOf(CURP);}catch(e){L=null;}
  try{days=pracexDays(CURP,new Date());}catch(e){days=[];}
  try{var t=ritToday0(); plans=ritPlans().map(function(p){var o=ritPlanShape(p); o.active=ritActive(p,t); return o;});}catch(e){plans=[];}}
 var s=pracShareBuild(r,g.sight,L,days,plans); s.scope_v=g.scope_v; return s;}
function pracPublish(force){
 var live=pracSightLive();
 if(!live.length||!plSignedIn()||!CURP||!CURP.id||(typeof ritOwn==='function'&&!ritOwn()))return Promise.resolve(0);
 var snaps=live.map(function(g){return {g:g, s:plSnapFor(g)};});
 var sig=JSON.stringify(snaps.map(function(x){return [x.g.id,x.s];}));
 if(!force&&sig===PL.pubSig)return Promise.resolve(0);
 return Promise.all(snaps.map(function(x){
  return plCall('PUT','/v1/prac/grants/'+encodeURIComponent(x.g.id)+'/snapshot',x.s).then(function(r){
   if(!r.ok&&force)status('Your practitioner’s copy was not updated: '+plWhy(r),'fail');
   return r.ok;});})).then(function(oks){
  if(oks.every(Boolean)){PL.pubSig=sig; PL.pubAt=Date.now();}
  return oks.filter(Boolean).length;});}
function plRepaint(){
 if(typeof S!=='undefined'&&S.tab===TAB.SETTINGS&&typeof renderAccount==='function')renderAccount();
 if(typeof S!=='undefined'&&typeof TAB.RITUAL!=='undefined'&&S.tab===TAB.RITUAL&&typeof ritRender==='function')ritRender();
 if($('prac')&&$('prac').innerHTML&&typeof renderPrac==='function')renderPrac();}
/* AT BOOT: a #prac= link is read and cleared, the way the quiz's record link
   is; signed in, it is used at once and the accept sheet opens; signed out,
   it is held for this visit in the Privacy page's box, because a code used
   before sign in has no account to join. Then both lists are read, the
   snapshot published if anything is live, and published again every few
   minutes while something is live and the reading has moved. */
var PL_EVERY_MS=5*60000;
function pracLiveBoot(){
 var tok='';
 try{var m=/#prac=([A-Za-z0-9_-]+)/.exec(location.hash||''); if(m){tok=plTokenOf(m[1]);
  history.replaceState(null,'',location.pathname+location.search);}}catch(e){}
 if(!plSignedIn()){
  if(tok){PL.held=tok; status('Sign in to connect to your practitioner, then open Account, Privacy. The link is held there for this visit.','ok');}
  return Promise.resolve(null);}
 var go=Promise.all([pracMineRead(), pracOn()?pracLiveRead():Promise.resolve(false)]).then(function(){
  if(tok)return plRedeem(tok,null);}).then(function(){return pracPublish(false);});
 if(!PL.timer)PL.timer=setInterval(function(){if(pracSightLive().length)pracPublish(false);},PL_EVERY_MS);
 try{document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&pracSightLive().length)pracPublish(false);});}catch(e){}
 return go.then(function(){plRepaint(); return true;});}
