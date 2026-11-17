/* Round RB in a real Chromium: the Becoming slices S1 to S3 on the Avatar
   page, the Knowledge page laid out by the seven seats with both columns
   shut, and Summary's lead row.

   What this holds is what the person sees and what the record keeps:

     S1  the ratings, the starting weights and the tags written before this
         round are read across from the old key once, land on the record
         against the pair's id, travel through an export, and the old key is
         left where it was
     S2  the identity row writes a name, a title and a sentence; the monthly
         look, once due, moves the version only when the person says it
         changed; a new pair carries an id
     S3  the Purpose subtab writes six values and a side's lines, the
         readings come out derived, the figure lights a mark per line, and a
         worked example offers no field that saves
     Knowledge  seven tiles crown to root, one seat open, both columns shut
         on arrival on its own keys, and the Field's right column unmoved
     Summary  what to do stands beside the story, and on a phone it follows
         the story and comes before the drivers

   CHECKED AGAINST A KNOWN BAD CASE FIRST. The read across is run once on a
   record that already says it was done, and must move nothing, before the
   move on the real one is trusted.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/becoming.js */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(b);
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto(FILE); await booted(p); await wait(300);

 console.log('\n=== S1: the avatar\'s own data moves onto the record, once ===');
 const s1=await p.evaluate(async()=>{
  loadP(0); setTab(TAB.INTAKE); AV.sub='becoming';
  const o={own:avOwn()};
  const pair={be:'Someone who stays close when it gets hard.',notbe:'My chest aches and I feel lonely when my partner goes quiet.',seat:'Heart'};
  /* the known bad case: a record that already says it moved reads nothing */
  /* written the way a build before this round wrote it: no status, no id */
  CURP.avatar={built:true,at:new Date().toISOString(),reviewedAt:null,pairs:[Object.assign({},pair)],movedAt:'2026-10-01T00:00:00.000Z'};
  avatarFill(CURP.avatar);
  avatarEnsureIds(CURP.avatar);
  const side={}; side[CURP.id]={arch:{Warrior:4},load0:{},rule:{},tags:{Heart:{add:['Betrayal'],off:[]}}};
  side[CURP.id].load0[avKey(pair)]=3.5;
  STORE.set(AV_KEY,JSON.stringify(side));
  renderAvatar();
  o.badMoved=Object.keys(CURP.avatar.arch).length+Object.keys(CURP.avatar.load0).length;
  /* the real case */
  CURP.avatar.movedAt=null; CURP.avatar.arch={}; CURP.avatar.load0={}; CURP.avatar.tags={};
  AV.sig=''; renderAvatar();
  const id=CURP.avatar.pairs[0].id;
  o.arch=CURP.avatar.arch.Warrior; o.load0=CURP.avatar.load0[id]; o.tag=(CURP.avatar.tags.Heart||{add:[]}).add[0];
  o.moved=!!CURP.avatar.movedAt; o.sideKept=!!JSON.parse(STORE.get(AV_KEY))[CURP.id];
  o.side=avSide(); o.sideArch=o.side.arch.Warrior; o.sideLoad=o.side.load0[id];
  /* an export, read back through the boundary */
  const v=validateProfile(JSON.parse(JSON.stringify(saveProfile(CURP))));
  o.trip=v.ok&&v.profile.avatar.arch.Warrior===4&&v.profile.avatar.load0[id]===3.5&&v.profile.avatar.tags.Heart.add[0]==='Betrayal';
  /* a rating written now goes to the record and not the old key */
  AV.sub='arch'; AV.arch='Sage'; renderAvatar(); avRate(5);
  o.rate=CURP.avatar.arch.Sage; o.rateSide=(JSON.parse(STORE.get(AV_KEY))[CURP.id].arch||{}).Sage;
  delete o.side; return o;});
 ok(s1.own,'the blank profile is the person\'s own, so it can be written');
 ok(s1.badMoved===0,'a record that says it moved reads nothing across, got '+s1.badMoved);
 ok(s1.arch===4&&s1.load0===3.5&&s1.tag==='Betrayal','the rating, the weight and the tag land on the record, '+JSON.stringify(s1));
 ok(s1.moved&&s1.sideKept,'the move is dated and the old key is left for an older build');
 ok(s1.sideArch===4&&s1.sideLoad===3.5,'and the page reads them off the record');
 ok(s1.trip,'and they travel through an export and back');
 ok(s1.rate===5&&s1.rateSide===undefined,'a new rating is written to the record, not the old key');

 console.log('\n=== S2: who the avatar is, the monthly look, the pair id ===');
 const s2=await p.evaluate(async()=>{
  AV.sub='becoming'; AV.sig=''; renderAvatar();
  const host=document.getElementById('avbody'), o={};
  o.pen=!!host.querySelector('[data-avidedit]');
  host.querySelector('[data-avidedit]').click();
  const set=(k,v)=>{const f=host.querySelector('[data-avid="'+k+'"]'); f.value=v;};
  o.cap=+host.querySelector('[data-avid="name"]').maxLength===AV_CAP.name;
  set('name','Steady'); set('title','A founder who rests'); set('description','Someone who builds without burning down.');
  host.querySelector('[data-avidsave]').click();
  o.name=CURP.avatar.name; o.title=CURP.avatar.title; o.desc=CURP.avatar.description;
  o.shown=(host.querySelector('.avi-n b')||{}).textContent;
  /* the monthly look: not due, no buttons; due, two; changed moves the version */
  o.notDue=!host.querySelector('[data-avrev]')&&/Next monthly look/.test(host.textContent);
  CURP.avatar.at=CURP.avatar.reviewedAt=new Date(Date.now()-40*864e5).toISOString(); AV.sig=''; renderAvatar();
  o.due=host.querySelectorAll('[data-avrev]').length;
  const v0=CURP.avatar.version;
  host.querySelector('[data-avrev="same"]').click();
  o.same=CURP.avatar.version===v0&&Date.now()-Date.parse(CURP.avatar.reviewedAt)<6e4;
  CURP.avatar.reviewedAt=new Date(Date.now()-40*864e5).toISOString(); AV.sig=''; renderAvatar();
  host.querySelector('[data-avrev="changed"]').click();
  o.changed=CURP.avatar.version===v0+1;
  o.ids=CURP.avatar.pairs.every(x=>AV_ID.test(x.id||''));
  o.status=CURP.avatar.status;
  return o;});
 ok(s2.pen&&s2.cap,'the identity row opens on the person\'s own profile, its fields capped where the boundary caps them');
 ok(s2.name==='Steady'&&s2.title==='A founder who rests'&&/burning/.test(s2.desc)&&s2.shown==='Steady',
  'a name, a title and a sentence are kept and shown, '+JSON.stringify(s2));
 ok(s2.notDue,'a look that is not due says when the next one is and offers nothing to press');
 ok(s2.due===2,'a due one offers still true and I changed it');
 ok(s2.same,'still true moves the date and not the version');
 ok(s2.changed,'I changed it moves the version');
 ok(s2.ids&&s2.status==='active','every pair carries an id and a built avatar is active');

 console.log('\n=== S3: the purpose map written on the page ===');
 const s3=await p.evaluate(async()=>{
  AV.sub='purpose'; AV.sig=''; renderAvatar();
  const host=document.getElementById('avbody'), o={};
  const put=(sel,v)=>{const f=host.querySelector(sel); f.value=v; f.dispatchEvent(new Event('change'));};
  o.capV=+host.querySelector('[data-avpv="soul"]').maxLength===PUR_VAL_MAX-1;
  ['freedom','wisdom','truth'].forEach((v,i)=>put('[data-avpv="soul"][data-i="'+i+'"]',v));
  ['health','family'].forEach((v,i)=>put('[data-avpv="ego"][data-i="'+i+'"]',v));
  await new Promise(r=>setTimeout(r,50));
  o.notYet=!host.querySelector('.avp-read');
  put('[data-avpv="ego"][data-i="2"]','stability');
  await new Promise(r=>setTimeout(r,50));
  o.soul=CURP.purpose.soul.join(','); o.ego=CURP.purpose.ego.join(',');
  o.read=(host.querySelector('.avp-read')||{}).textContent||'';
  o.ready=purposeReady(CURP.purpose);
  host.querySelector('.avp-sb[data-avside="partner"]').click();
  put('[data-avpl="partner"][data-i="0"]','I say when I need rest');
  await new Promise(r=>setTimeout(r,50));
  put('[data-avpl="partner"][data-i="2"]','I ask before I assume');
  await new Promise(r=>setTimeout(r,50));
  o.lines=JSON.stringify(CURP.purpose.sides.partner);
  o.lit=document.querySelectorAll('#avbody .avp-side[data-avside="partner"] .avp-tk.lit').length;
  o.count=/\b\d+ of (5|30)\b/.test(host.textContent);
  o.saved=JSON.parse(STORE.get(PKEY)||'[]');
  o.persisted=Array.isArray(o.saved)?o.saved.some(x=>x&&x.purpose&&x.purpose.soul&&x.purpose.soul[0]==='freedom'):null;
  delete o.saved;
  /* a worked example: what it carries, and nothing that saves */
  loadP(PEOPLE.findIndex(x=>x.nm==='Diane')); setTab(TAB.INTAKE); AV.sub='purpose'; AV.sig=''; renderAvatar();
  o.exDisabled=[...document.querySelectorAll('#avbody .avp-in')].every(f=>f.disabled);
  o.exPen=!!document.querySelector('#avbody [data-avidedit]');
  AV.sub='becoming';
  return o;});
 ok(s3.capV,'a value field stops where the boundary would refuse');
 ok(s3.notYet,'five values are not a reading, so none is shown');
 ok(s3.soul==='freedom,wisdom,truth'&&s3.ego==='health,family,stability'&&s3.ready,'six values are kept, '+s3.soul+' / '+s3.ego);
 ok(/freedom, wisdom, truth/.test(s3.read)&&/how you make money/.test(s3.read),'and the readings come out derived, never typed');
 ok(s3.lines==='["I say when I need rest","I ask before I assume"]','a side keeps only the lines written, closed up, '+s3.lines);
 ok(s3.lit===2,'the figure lights a mark for each line on that side, got '+s3.lit);
 ok(!s3.count,'and no count against five or thirty is printed');
 ok(s3.persisted!==false,'the record that is saved carries the values');
 ok(s3.exDisabled&&!s3.exPen,'a worked example offers no field that saves');

 console.log('\n=== Knowledge: the seven seats, both columns shut ===');
 const k=await p.evaluate(async()=>{
  ['lcolk','rcolk'].forEach(x=>{try{STORE.set(x,'');}catch(e){}});
  setTab(TAB.FIELD); render(); const fieldR=document.body.classList.contains('rshut');
  setTab(TAB.KNOW); kbRender(); await new Promise(r=>setTimeout(r,50));
  const o={fieldR};
  o.l=document.body.classList.contains('lshut'); o.r=document.body.classList.contains('rshut');
  o.tiles=[...document.querySelectorAll('#knowbody [data-kbseat]')].map(x=>x.dataset.kbseat).join(',');
  o.order=IQ_SEATS.join(',');
  /* THE FORMULA PANEL IS NOT A SEAT. kbRender's showCq (ui/knowledge.js) adds
     a data-kbpn="cq" section beside a seat's own, on every seat's page, since
     the formula is what some of that seat's own laws add up to; counting
     open seat panels is what this block checks, and cq is not a seat. PR
     189's rescue (15 November) is what first made this show on arrival. */
  const seatPn=()=>[...document.querySelectorAll('#knowbody [data-kbpn]')]
   .map(x=>x.dataset.kbpn).filter(x=>x!=='cq').join(',');
  o.open=seatPn();
  document.querySelector('#knowbody [data-kbseat="Heart"]').click();
  o.heart=seatPn();
  o.heartRows=document.querySelectorAll('#knowbody [data-kbpn="Heart"] .kb-row').length;
  o.pressed=document.querySelector('#knowbody [data-kbseat="Heart"]').getAttribute('aria-pressed');
  KB_SEC='addr'; kbRender();
  o.addr=document.querySelectorAll('#knowbody .kb-row').length;
  o.addrSeats=[...document.querySelectorAll('#knowbody [data-kbpn]')].map(x=>x.dataset.kbpn).join(',');
  KB_SEC='all'; KB_SEAT='Crown'; kbRender();
  /* opened here, it stays open here, and the Field is not moved by it */
  document.getElementById('rfold').click();
  setTab(TAB.FIELD); render(); o.fieldAfter=document.body.classList.contains('rshut');
  setTab(TAB.KNOW); kbRender(); o.knowAfter=document.body.classList.contains('rshut');
  return o;});
 ok(!k.fieldR,'the Field\'s right column is open, as it always was');
 ok(k.l&&k.r,'Knowledge arrives with both columns shut');
 ok(k.tiles===k.order,'seven tiles in the Intake page\'s order, '+k.tiles);
 ok(k.open==='Crown','one seat open on arrival, the crown, '+k.open);
 ok(k.heart==='Heart'&&k.heartRows>10&&k.pressed==='true','a tile opens its seat, '+k.heartRows+' rows at the heart');
 ok(k.addr===112&&k.addrSeats.split(',').length===7,'a kind shows across all seven seats, all 112 addresses, '+k.addrSeats);
 ok(!k.fieldAfter&&!k.knowAfter,'opened on Knowledge it stays open there, and the Field is untouched');

 console.log('\n=== Summary: renders after a real entry, the old what-to-do layout gone ===');
 /* THIS WHOLE BLOCK USED TO CHECK THE "WHAT TO DO" COLUMN'S OWN LAYOUT
    (.sg-todo between .sg-told and .sg-story, on a phone and at 1600), and it
    threw outright, not merely failed: .sg-todo does not exist any more, so
    .getBoundingClientRect() on a null querySelector result crashed the whole
    process before S4 below, or the file's own final tally, ever ran. Same 3
    November ruling as tests/sniffpage.js and tests/unpack.js (summary.js:1258):
    the "What to do" column came off Summary outright, replaced by nothing on
    this surface. Checked directly before cutting this: .sg-todo, .sg-told
    are both gone from the real DOM now. Kept a minimal survives-check rather
    than leaving this gate's only Summary coverage at zero. */
 const sm=await p.evaluate(async()=>{
  loadP(PEOPLE.findIndex(x=>x.nm==='Diane'));
  CURP.story.entries=[{t:new Date().toISOString(),text:'My chest aches and I feel lonely when my partner goes quiet.',imprints:1,bands:{}}];
  setTab(TAB.SUMMARY); render(); await new Promise(r=>setTimeout(r,100));
  return {hasStory:!!document.querySelector('#sumbody .sg-story')};});
 ok(sm.hasStory,'Summary renders the story card for a real entry');
 await p.setViewportSize({width:390,height:844}); await wait(400);
 const ph=await p.evaluate(()=>({hasStory:!!document.querySelector('#sumbody .sg-story')}));
 ok(ph.hasStory,'and still renders it at 390 wide');

 console.log('\n=== S4: the primary saboteur sits where its addresses are ===');
 /* SYSTEMS AUDIT SG-05, 24 October. The impact line printed the third column
    of ARCH18 as the primary saboteur's seat, which held none of its addresses
    in 9 of the 18 rows: the Caregiver read "primary saboteur, at the heart"
    while Pleaser's addresses sit at the root and the sacral. The line and its
    colour read the addresses now. What it should say is read here off SAB_LIB
    and the node table directly, not through the helper the page uses. */
 const s4=await p.evaluate(()=>{
  loadP(0); setTab(TAB.INTAKE); AV.sub='arch';
  const lib=nm=>{let s=null; SAB_LIB.forEach(x=>{if(KB_KEY(x.nm)===KB_KEY(nm))s=x;}); return s;};
  const out={n:0, off:[]};
  AV_ROSTER.forEach(a=>{ if(!a.sab)return;
   AV.arch=a.nm; AV.sig=''; renderAvatar();
   const s=lib(a.sab), cnt={}; if(s)s.nids.forEach(i=>{cnt[BY[i].b]=(cnt[BY[i].b]||0)+1;});
   const seats=BANDS.filter(b=>cnt[b]);
   const most=seats.reduce((m,b)=>m===null||cnt[b]>cnt[m]?b:m,null);
   const el=document.querySelector('.av-imp-v>span'), box=document.querySelector('.av-imp');
   const t=el?el.textContent.replace(/\s+/g,' ').trim():'';
   const say=seats.length?'its addresses at '+unpackList(seats.map(b=>AV_THE[b])):'primary saboteur';
   const col=box?box.style.getPropertyValue('--s').trim():'';
   out.n++;
   if(!el||t.indexOf(say)<0||/primary saboteur, at /.test(t)||(most&&col!==seatCol(most)))
    out.off.push(a.nm+' ('+a.sab+'): "'+t+'" coloured '+col+', want "'+say+'" coloured by '+most);});
  return out;});
 ok(s4.n>0&&s4.off.length===0,'every archetype\'s impact line puts its primary saboteur where its own addresses sit, '
  +'coloured by the seat holding most of them, of '+s4.n+': '+s4.off.slice(0,3).join(' | '));

 console.log('\n=== AVS2 to AVS5: a build a person edits, and a tag that orders the release ===');
 /* 17 November, his words of 20 September: "Adding in data so that I can tag
    and have Source attach what I'm tagging to my releases, so that it can
    prioritise those releases ... Who is the person I'm releasing ... who's
    the person I'm becoming. And you should be able to edit that." Written
    through the page's own controls and the Avatar's own commit, avSeatAdd.
    THE KNOWN CASE FIRST: the Discover order is read with no tag before the
    tag is put on, so the reorder is proved against the order it replaced. */
 await p.setViewportSize({width:1600,height:1000}); await wait(300);
 const av=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  loadP(0); CURP.avatar=avatarBlank(); CURP.story={entries:[]};
  setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await w(50);
  const host=document.getElementById('avbody'), $=s=>host.querySelector(s), o={};
  o.noCard=!$('.avq');
  /* the header is the two people, even either side of the subtabs */
  const hd=$('.avs-who'), sb=hd&&hd.querySelector('.avs-subs');
  if(hd&&sb){const H=hd.getBoundingClientRect(), B=sb.getBoundingClientRect();
   o.mid=Math.round(Math.abs((B.left+B.right)/2-(H.left+H.right)/2));}
  o.sides=!!$('.avw-l [data-avshededit]')&&!!$('.avw-r [data-avidedit]');
  /* who is released, through its own editor, refused past the cap by name */
  $('[data-avshededit]').click(); await w(20);
  o.cap=+$('[data-avshed="shedName"]').maxLength===AV_CAP.shedName;
  $('[data-avshed="shedName"]').value='x'.repeat(AV_CAP.shedName+1);
  $('[data-avshedsave]').click(); await w(20);
  o.refused=CURP.avatar.shedName===''&&!!$('[data-avshedform]');
  $('[data-avshed="shedName"]').value='The one who waits to be picked';
  $('[data-avshed="shedDescription"]').value='Goes quiet and feels alone when nobody calls first.';
  $('[data-avshedsave]').click(); await w(20);
  o.shed=CURP.avatar.shedName; o.shedShown=($('.avw-l .avi-n b')||{}).textContent;
  /* two seats written through the page's own commit */
  const add=(b,be,nb)=>{AV.seat=b; AV.face='story'; AV.edit=null; AV.drafts[b]={be:be,notbe:nb}; avSeatAdd(b);};
  add('Heart','Someone who stays close when it gets hard.','My chest aches and I feel lonely and rejected when my partner goes quiet.');
  add('Solar','Someone who does the work and lets it be checked.','My stomach knots and I get angry when my boss checks my work.');
  await w(50);
  const st=avState();
  o.first=st.first.length; o.firstAllPulled=st.first.every(n=>avatarPull(n,avMarksNow())>0);
  o.card=!!$('.avq')&&host.querySelectorAll('.avq-one').length===st.first.length;
  o.cardSays=[...host.querySelectorAll('.avq-one')].every(e=>/^First, because/.test(e.getAttribute('data-tip')||''));
  /* the seats say something: every ring carries its meaning */
  o.tips=[...host.querySelectorAll('[data-avsat]')].every(e=>/written\./.test(e.getAttribute('data-tip')||''));
  /* one press runs the avatar's own order */
  $('[data-avfirst]').click(); await w(50);
  o.ran=RUN.open&&JSON.stringify(RUN.pick.map(n=>n.i))===JSON.stringify(st.first.map(n=>n.i));
  if(typeof relClose==='function')relClose();
  /* AVS4 ON DISCOVER: the heaviest Solar address and the heaviest Heart one,
     picked in the bank. Both seats are written, so both pull at the same
     level and the charge orders them. Then the LIGHTER one is tagged by its
     own name, and it must go first. The lighter one, because the first cut of
     this check tagged the Heart's and the Heart's was also the heavier, so
     the charge order put it first too and the check passed with the ranking
     taken out: measured, the known bad case went green. Tagging the lighter
     is the one case the charge alone can never produce. */
  const top=b=>W.filter(n=>n.b===b&&n.cf&&n.sq>0).sort((a,c)=>c.sq-a.sq)[0];
  const hN=top('Heart'), sN=top('Solar');
  o.fixture=!!(hN&&sN)&&hN.sq!==sN.sq;
  Object.keys(IMP_PICK).forEach(k=>delete IMP_PICK[k]); IMP_PICK[hN.i]=true; IMP_PICK[sN.i]=true;
  const order=()=>stRelModel().take.map(n=>n.i);
  const heavy=hN.sq>sN.sq?hN:sN, lite=heavy===hN?sN:hN;
  o.before=order()[0]===heavy.i;
  avTagSet(lite.b,lite.k,true,avState()); await w(20);
  o.after=order()[0]===lite.i;
  /* and the same press with the ranking swapped for the old charge sort
     must NOT put it first, or this check proves nothing */
  const keep=window.avRank; window.avRank=L=>L.sort((a,c)=>c.sq-a.sq);
  o.bad=order()[0]===lite.i; window.avRank=keep;
  o.tagKept=(CURP.avatar.tags[lite.b].add||[]).indexOf(lite.k)>=0;
  setTab(TAB.STORY); render(); await w(100);
  o.mark=document.querySelectorAll('#strel .st-rq-av').length;
  o.markSays=/First, because you tagged/.test((document.querySelector('#strel .st-rq-av .st-rq')||{}).title||'');
  Object.keys(IMP_PICK).forEach(k=>delete IMP_PICK[k]);
  /* and the record keeps all of it through an export */
  const v=validateProfile(JSON.parse(JSON.stringify(saveProfile(CURP))));
  o.trip=v.ok&&v.profile.avatar.shedName===o.shed&&v.profile.avatar.tags[lite.b].add.indexOf(lite.k)>=0;
  return o;});
 ok(av.noCard,'an avatar with nothing on it shows no release first card');
 ok(av.mid<=4&&av.sides,'the header is who is released left, who is become right, the subtabs centred within '+av.mid+'px');
 ok(av.cap&&av.refused,'the releasing name stops at the boundary\'s cap, and a longer one is refused and not kept');
 ok(av.shed==='The one who waits to be picked'&&av.shedShown===av.shed,'who is released is kept and shown on the left, '+JSON.stringify(av.shedShown));
 ok(av.first>0&&av.firstAllPulled&&av.card&&av.cardSays,'release first lists what the avatar pulls, each with its reason, '+av.first+' addresses');
 ok(av.tips,'every seat on the ring carries what it holds on hover and tap');
 ok(av.ran,'one press runs the avatar\'s own order through the release');
 ok(av.fixture&&av.before,'with no tag, Discover orders two written seats by charge');
 ok(av.after&&av.tagKept,'a tag by name puts the lighter address first on Discover');
 ok(!av.bad,'and with the old charge sort in its place the same tag does not, so the check can fail');
 ok(av.mark>=1&&av.markSays,'and the ring on Discover says the avatar put it there, '+av.mark+' marked');
 ok(av.trip,'who is released and the tag travel through an export and back');

 console.log('\n=== AVS5 on a charged profile, and MS22 and MS23 on Character ===');
 const ch=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await w(50);
  const o={}, r=compute();
  /* each badge is the count of held addresses at that ring's own seat */
  o.badges=[...document.querySelectorAll('#avbody [data-avsat]')].map(e=>{
   const A=AV_AREAS.find(x=>x.k===e.dataset.avsat), n=e.querySelector('.avs-n');
   return {want:r.loaded.filter(x=>x.b===A.b).length, got:n?+n.textContent:0};});
  o.badgeOk=o.badges.every(x=>x.want===x.got)&&o.badges.some(x=>x.got>0);
  setTab(TAB.MASKS); render(); await w(150);
  const rail=document.getElementById('charrail');
  o.locked=!lockSees('mask');
  if(!o.locked){
   const arch=[...rail.querySelectorAll('.chr-ar')];
   o.twelve=arch.length===ARCH.length;
   const emb=avArchEmbodied(computeSeen());
   o.filled=arch.filter(e=>e.classList.contains('on')).map(e=>e.dataset.charch).join(',');
   o.want=ARCH.filter((a,i)=>emb[i]).map(a=>a.nm).join(',');
   o.tips=arch.every(e=>(e.getAttribute('data-tip')||'').length>20);
   /* every printed percent wears the hue of its own figure */
   const rows=[...rail.querySelectorAll('.chr-row b, .chr-sv')].filter(e=>/%$/.test(e.textContent.trim()));
   const hex=c=>{const m=c.match(/\d+/g); return '#'+m.slice(0,3).map(x=>('0'+(+x).toString(16)).slice(-2)).join('');};
   o.hued=rows.length>0&&rows.every(e=>hex(getComputedStyle(e).color)===pctHue(parseInt(e.textContent,10),LIGHT()));
   o.nRows=rows.length;
   arch[0].click(); await w(80);
   o.door=S.tab===TAB.INTAKE&&AV.sub==='arch'&&AV.arch===ARCH[0].nm;}
  return o;});
 ok(ch.badgeOk,'every seat\'s badge is the count held at that seat, '+JSON.stringify(ch.badges));
 if(ch.locked)ok(false,'James can see the masks, so Character can be checked');
 else{
  ok(ch.twelve&&ch.tips,'Character shows all twelve archetypes, each with its meaning on hover and tap');
  ok(ch.filled===ch.want&&ch.want.length>0,'the ones James embodies fill in, and only those, '+ch.filled+' against '+ch.want);
  ok(ch.hued,'every percent on the rail wears its own hue, read off pctHue, '+ch.nRows+' figures');
  ok(ch.door,'an archetype opens on the Avatar page where it is rated');}

 ok(errs.length===0,'no page errors, '+errs.join(' | '));
 await b.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
