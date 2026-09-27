/* ============================================================
   THE AVATAR, THE HERO OF ITS OWN TAB. Round HG in TASKS.md, 27 September.

   His words, verbatim, and they are the specification: "the centre panel is
   our hero element, and the avatar page is really about building the avatar,
   so it's me telling the story of who I want to become, and then that
   populating within these fields, maybe the tags, and it's using the sniffer
   to sniff those fields for my stories, and then it gives me the release
   protocols so I can become that person. And the percent complete, that's
   good. And then there should be something for the, not the release protocol,
   but the ritual, like which rituals I can queue up here, and task my
   rituals ... And where it says running, where you're visualizing it, the
   pleaser with the releasing loading, that's really excellent, I want you to
   add that design in there too."

   Five pieces, one surface, and every one of them is a port and not a new
   mechanism:

     the story    a pair, who you want to be and who you do not want to be,
                  in the exact shape engine/avatar.js validates. The second
                  line goes to readSeat, the resolver the avatar drill already
                  asks, so the address is the one the rest of the product
                  would give it. Nothing new parses anything.
     the tags     what the sniffer heard in that second line: the seat it
                  lands at, the person's own words that placed it (srcHear,
                  negation aware), and any fetter the words themselves named.
     the journal  the person's own committed entries, ranked by the charge the
                  sniffer stored at that seat when each was committed, and by
                  the words they share with the pair. The words quoted back
                  are marksOf's, so what is highlighted is what was scored.
     the release  queueFor from proto/avatar/seats4, carried with its body:
                  the addresses at the seat still carrying, the hot ones
                  first. The button is relPick, the shipped door.
     complete     closure from the same prototype, the share of the weight
                  held when the pair was written that has since gone. It is
                  the figure he approved on redesign-GG. avatarGap gives the
                  load now; the load then is kept at the moment of writing.

   And two he named on top of the story:

     running      the body map prototype's Running list, round HE, read off
                  compute().sabs rather than a mock table, with the direction
                  read off hotDir's own record of the last real change. So a
                  row says loading when a story has just raised it, releasing
                  when a release has just lowered it, and steady otherwise,
                  never on a timer. The tension line is drawn across the
                  avatar's own satellites.
     rituals      ritFor asked about each seat the avatar is working on,
                  exactly as seats4 asked it, queued here and tasked through
                  the shipped ritual builder, which is the one writer of a
                  ritual.

   WHAT IS NOT IN THE RECORD, said here and on nothing that claims otherwise.
   The profile boundary, validateProfile, rebuilds every stored record from
   the fields it names and drops the rest on the next load. It names no
   archetype rating and no starting weight for a pair, so both live beside the
   record under their own key in the same bound store, keyed by the profile's
   id. They survive a reload and do not travel with an export. Putting them in
   the record is a schema change, which is the owner's (CLAUDE.md, Schema v2).
   ============================================================ */
var AV={sel:null, area:null, arch:null, trace:null, q:null, draft:{be:'',notbe:''},
 watch:null, sig:'', pc:{}};
var AV_KEY='atuned-avatar-side';
/* the seven areas and their angles are redesign-GG's own, so a satellite sits
   where it sat on the page he approved. The one word names are placeholders
   for his ruling and are marked as such in the report that carried them. */
var AV_AREAS=[
 {k:'meaning', b:'Crown',   nm:'Meaning',  about:'purpose, faith, what it is for', a:-90},
 {k:'clarity', b:'3rd Eye', nm:'Clarity',  about:'seeing straight, deciding',      a:-38.57},
 {k:'voice',   b:'Throat',  nm:'Voice',    about:'saying it, being heard',         a:-141.43},
 {k:'love',    b:'Heart',   nm:'Love',     about:'partner, family, closeness',     a:12.86},
 {k:'drive',   b:'Solar',   nm:'Drive',    about:'work, will, pressure',           a:167.14},
 {k:'pleasure',b:'Sacral',  nm:'Pleasure', about:'desire, play, making things',    a:64.29},
 {k:'ground',  b:'Root',    nm:'Ground',   about:'body, money, home, rest',        a:115.71}];
var AV_OF={}; AV_AREAS.forEach(function(x){AV_OF[x.b]=x;});
var AV_THE={Crown:'the crown','3rd Eye':'the third eye',Throat:'the throat',Heart:'the heart',
 Solar:'the solar plexus',Sacral:'the sacral',Root:'the root'};
var AV_IC={
 ground:'<path d="M4 11.5L12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/><path d="M10.5 19v-4.5h3V19"/>',
 pleasure:'<path d="M3 9.5c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/><path d="M3 15c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/>',
 drive:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
 love:'<path d="M12 19.5s-7.5-4.4-7.5-9.7A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.2c0 5.3-7.5 9.7-7.5 9.7z"/>',
 voice:'<path d="M4.5 5.5h15v10h-9l-4.5 3.5v-3.5h-1.5z"/><path d="M8.5 10.5h7"/>',
 clarity:'<path d="M2.5 12s3.6-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.6 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 meaning:'<path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z"/>',
 person:'<circle cx="12" cy="7" r="3.4"/><path d="M4.5 21c0-4.6 3.4-7.8 7.5-7.8s7.5 3.2 7.5 7.8"/>'};
function avSvg(inner,cls){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+inner+'</svg>';}
function avPos(a,r){var t=a*Math.PI/180;return [50+r*Math.cos(t),50+r*Math.sin(t)];}
function avP(n){return (+n).toFixed(2);}
function avArc(cx,cy,r,f){if(f<=0)return ''; if(f>=1)f=0.9999;
 var a0=-Math.PI/2,a1=a0+f*Math.PI*2;
 return 'M'+avP(cx+r*Math.cos(a0))+' '+avP(cy+r*Math.sin(a0))+' A'+r+' '+r+' 0 '+(f>0.5?1:0)
  +' 1 '+avP(cx+r*Math.cos(a1))+' '+avP(cy+r*Math.sin(a1));}
function avPct(f){return f==null?'–':Math.round(f*100)+'%';}

/* ---------------- whose record this is ----------------
   A worked example is a demonstration and not a record, so nothing on this
   page writes to one. The refusal is the one the release and the story
   already give for the same crossing. */
function avOwn(){
 return !!(typeof S!=='undefined'&&S.who===0&&CURP&&PROFILES.indexOf(CURP)>=0);}

/* ---------------- beside the record ----------------
   One key in the bound store, a map from profile id to that profile's
   ratings and starting weights. Anything that is not the shape this file
   writes is left out on the read rather than trusted, the same posture the
   boundary takes, and a store that cannot be read is an empty one here and
   never a reason to throw the surface. */
var AV_SCALE=[1,2,3,4,5];
function avSideAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(AV_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
function avSide(){
 var out={arch:{}, load0:{}};
 if(!avOwn())return out;
 var e=avSideAll()[CURP.id];
 if(!e||typeof e!=='object')return out;
 if(e.arch&&typeof e.arch==='object')Object.keys(e.arch).forEach(function(k){
  if(avArchByName(k)&&AV_SCALE.indexOf(e.arch[k])>=0)out.arch[k]=e.arch[k];});
 if(e.load0&&typeof e.load0==='object')Object.keys(e.load0).forEach(function(k){
  var v=e.load0[k]; if(typeof v==='number'&&v>=0&&v<=10)out.load0[k]=v;});
 return out;}
/* true only when the store took it. A store that was never bound, or that
   throws on quota or on a blocked origin, answers false and the caller says so. */
function avSideWrite(fn){
 if(!avOwn()||typeof STORE_BOUND==='undefined'||!STORE_BOUND)return false;
 try{var all=avSideAll(), e=all[CURP.id]=all[CURP.id]||{};
  e.arch=e.arch||{}; e.load0=e.load0||{};
  fn(e); STORE.set(AV_KEY,JSON.stringify(all)); return true;}
 catch(err){return false;}}
function avKey(pr){return pr.be+'\n'+pr.notbe;}

/* ---------------- percent complete ----------------
   closure, carried from proto/avatar/seats4 with its body. A seat at no load
   is complete. With no starting weight kept, a pair reads nothing done, which
   understates rather than invents. */
function avClosure(row,load0){
 if(!row||!row.gap)return null;
 if(row.gap.clear)return 1;
 if(load0==null||load0<=0)return 0;
 return clamp(1-row.gap.load/load0,0,1);}

/* ---------------- what the sniffer hears in a pair ---------------- */
function avHeard(notbe){
 var t=String(notbe||'').trim(), out={seat:null, area:null, words:[], named:[]};
 if(!t)return out;
 var b=(typeof readSeat==='function')?readSeat(t):null;
 out.seat=b; out.area=b?AV_OF[b]:null;
 if(typeof srcHear==='function'){
  var h=srcHear(t), k=b?B2K[b]:null;
  h.seats.forEach(function(s){
   if(k&&s.seat!==k)return;
   s.words.forEach(function(w){if(out.words.indexOf(w)<0)out.words.push(w);});});}
 /* a fetter the words named, unless a heard word already carries it: "sad"
    heard and Sad named, or "ashamed" heard and Shame named, is one fact and
    prints once */
 var p=parseStory(t), lw=out.words.map(function(w){return String(w).toLowerCase();});
 out.named=(p.named||[]).filter(function(f){var fl=String(f).toLowerCase();
  return !lw.some(function(w){return w.indexOf(fl)>=0;});}).slice(0,3);
 return out;}

/* ---------------- the journal, sniffed for this pair ----------------
   An entry answers when the sniffer stored charge at the pair's seat when it
   was committed, or when it shares a word with what was heard in the pair.
   Stored bands are read rather than recomputed, because the sniffer has moved
   since the oldest entries were written and recomputing would rewrite what
   the person was told then. The text is parsed only to quote it back. */
function avParsed(t){
 if(AV.pc[t])return AV.pc[t];
 var p=parseStory(t), m=marksOf(t,p);
 return (AV.pc[t]={marks:m});}
function avJournal(seat,heard){
 var E=((CURP&&CURP.story&&CURP.story.entries)||[]).slice(-200);
 var k=B2K[seat], want={};
 (heard.words||[]).forEach(function(w){want[String(w).toLowerCase()]=1;});
 var now=Date.now(), out=[];
 E.forEach(function(e){
  if(!e||typeof e.text!=='string'||!e.text.trim())return;
  var w=(e.bands&&e.bands[k])||0, pm=avParsed(e.text), at=[], shared=0;
  pm.marks.forEach(function(m){
   var s=e.text.slice(m.s,m.e);
   if(m.seat===k){at.push(m);}
   if(want[s.toLowerCase()]){shared++; if(m.seat!==k)at.push(m);}});
  if(w<=0&&!shared)return;
  var d=Math.floor((now-new Date(e.t).getTime())/86400000);
  out.push({e:e, score:Math.min(10,w/3)+shared*2, marks:at, days:d});});
 return out.sort(function(a,b){return b.score-a.score||a.days-b.days;}).slice(0,3);}
function avQuote(e,marks){
 var t=e.text, sorted=marks.slice().sort(function(a,b){return a.s-b.s;});
 var a=0, b=t.length, LIM=200;
 if(t.length>LIM){var c=sorted.length?sorted[0].s:0; a=Math.max(0,c-60); b=Math.min(t.length,a+LIM);}
 var h='', at=a;
 sorted.forEach(function(m){
  if(m.s<at||m.e>b)return;
  h+=esc(t.slice(at,m.s))+'<b>'+esc(t.slice(m.s,m.e))+'</b>'; at=m.e;});
 h+=esc(t.slice(at,b));
 return (a>0?'…':'')+h+(b<t.length?'…':'');}
function avAgo(d){return d<=0?'today':d===1?'yesterday':d+' days ago';}

/* ---------------- the release protocol ----------------
   queueFor, from proto/avatar/seats4, body kept. The run's length is the
   plan the release card will print, read without starting anything. */
function avQueue(seat){
 var at=W.filter(function(n){return n.b===seat&&n.sq>0&&n.cf;}).sort(function(a,b){return b.sq-a.sq;});
 var hot=at.filter(function(n){return n.sq>=4;});
 return (hot.length?hot:at).slice(0,8);}
function avMinutes(q){
 if(!q.length||!CURP||typeof meterPlan!=='function'||typeof relBudget!=='function')return null;
 var cap=relBudget(); if(cap<=0)return 0;
 var pl=meterPlan(CURP,q.map(function(n){return n.i;}),CHAN.map(function(c){return c[0]+c[2];}),cap);
 return pl.length*RUN.speed/60;}
function avMinSay(m){
 if(m===null)return '';
 if(m===0)return 'Allowance spent';
 return m<1?'Under a minute':'About '+Math.round(m)+(Math.round(m)===1?' minute':' minutes');}

/* ---------------- running ----------------
   The heaviest saboteurs compute() reads, one row a name, and which way
   their load last moved. A part that rose is loading, a part that fell is
   releasing, and a saboteur's direction is the sum of its parts. */
function avRunning(r,seats){
 if(typeof hotTrack==='function')hotTrack();
 var seen={}, all=[];
 (r.sabs||[]).forEach(function(s){
  if(seen[s.nm]||!s.parts||!s.parts.length)return; seen[s.nm]=1;
  var dir=0, sb={};
  s.parts.forEach(function(n){dir+=(n.frDir||0); sb[n.b]=(sb[n.b]||0)+(+n.sq||0);});
  var order=Object.keys(sb).sort(function(a,b){return sb[a]-sb[b];});
  var fam=HCX_LIB.filter(function(h){return h.nm===s.hcx;})[0]||null;
  all.push({nm:s.nm, w:s.w, fam:fam, seats:order,
   dir:dir>0?'loading':(dir<0?'releasing':'steady'),
   mine:order.some(function(b){return seats[b];})});});
 var mine=all.filter(function(x){return x.mine;});
 return {mine:mine.length>0, rows:(mine.length?mine:all).slice(0,SAB_SHOW)};}
function avSabNamed(nm,run){
 for(var i=0;i<run.rows.length;i++)if(run.rows[i].nm===nm)return run.rows[i];
 return null;}

/* ---------------- rituals ----------------
   ritFor answers for one seat when it is handed that seat as the darkest,
   which is how seats4 asked it. One practice per seat, the lightest in the
   track, and a practice two seats call for is one row naming both. */
function avRituals(r,rows){
 var by={}, seats=[];
 rows.forEach(function(x){
  if(!x.gap||x.gap.clear)return;
  if(!by[x.gap.seat]){by[x.gap.seat]=x.gap.load; seats.push(x.gap.seat);}});
 seats.sort(function(a,b){return by[b]-by[a];});
 var seen={}, out=[];
 seats.slice(0,4).forEach(function(b){
  var c=ritFor({darkB:b, DQ:r.DQ}); if(!c||!c.called)return;
  var k=c.called.k;
  if(seen[k]){seen[k].areas.push(AV_OF[b]); return;}
  out.push(seen[k]={p:c.called, areas:[AV_OF[b]], track:c.called.track});});
 return out;}

/* ---------------- the archetypes ----------------
   The twelve the instrument reads, ARCH, each seated where ARCH seats it.
   The primary saboteur and its seat come from ARCH18, the table that carries
   them, joined by name. ARCH18 calls the Rebel the Outlaw; ARCH is the table
   the engine reads and the rail prints, so the Rebel keeps its shipped name. */
var AV_DEF={
 Warrior:'The Warrior moves on the threat and counts the damage after. It gets the thing done on a day when feeling it would stop you.',
 Sage:'The Sage reads the situation before it moves. It gives you ground to stand on when the moment is unclear.',
 Rebel:'The Rebel refuses the frame it is handed. It marks where you end and other people begin.',
 Caregiver:'The Caregiver attends to the other person first. It sees who needs something before they ask.',
 Creator:'The Creator makes the thing. It turns what is in your head into something other people can hold.',
 Magician:'The Magician changes the conditions around a problem. It finds the one lever that moves the rest.',
 Ruler:'The Ruler keeps things in order. It keeps you trusted with people, money and decisions.',
 Explorer:'The Explorer goes to the edge of what it knows. It brings back what nobody at home has seen yet.',
 Lover:'The Lover closes the distance to the people it wants near. It stays close when things get hard.',
 Jester:'The Jester breaks the tension. It gets a tight room laughing, and breathing, again.',
 Everyman:'The Everyman stays with the room, so it reads the room first. It keeps you in the group.',
 Innocent:'The Innocent takes things at face value. It lets you trust people and start again after a bad day.'};
/* what taking the role on costs, as a thing that happens in a day. It names
   the saboteur and never calls the person by it. */
var AV_IMPACT={
 'Controller':'Handing a thing over feels like dropping it, so the grip stays on.',
 'Pleaser':'Yes comes out before your own answer has been checked.',
 'Stickler':'Time goes into holding everything to the one right way.',
 'Hyper-Rational':'What cannot be explained gets set aside, feelings first.',
 'Avoider':'What needs dealing with waits, for as long as waiting costs nothing today.',
 'Hyper-Vigilant':'Part of your attention stays on the door, even in a safe room.',
 'Victim':'What happened to you takes up the room the next step needs.',
 'Restless':'Once a thing turns familiar, the next one starts to pull.',
 'Judge':'Every shortfall gets a verdict, your own included.',
 'Hyper-Achiever':'Rest feels like falling behind, so the output keeps running.',
 'Worrywart':'The worst case runs on a loop, and it feels like planning.'};
var AV_ROSTER=ARCH.map(function(a,i){
 var row=ARCH18.filter(function(x){return (x[0]==='Outlaw'?'Rebel':x[0])===a.nm;})[0]||null;
 return {nm:a.nm, v:a.v, b:a.b, ic:a.ic, i:i, sab:row?row[1]:null, sabB:row?row[2]:null};});
function avArchByName(nm){
 for(var i=0;i<AV_ROSTER.length;i++)if(AV_ROSTER[i].nm===nm)return AV_ROSTER[i];
 return null;}
/* two to a seat sit either side of the seat's own angle */
var AV_SPREAD=13;
function avArchAngle(a){
 var same=AV_ROSTER.filter(function(x){return x.b===a.b;}), j=same.indexOf(a), n=same.length;
 return AV_OF[a.b].a+(n<2?0:(j-(n-1)/2)*2*AV_SPREAD);}
function avArchIc(a,cls){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'><path d="'+a.ic+'"/></svg>';}
var AV_RANK=['first','second','third'];
function avCompare(a,rating,r){
 /* HS sweep. Silence on an unread field: there is nothing to set beside the
    person's own rating, and a sentence saying so is a refusal nobody asked
    for, sitting under a control they have not pressed. The two tails below,
    "That gap is what the scale is for" and "Both are kept", explained the
    scale rather than reading it, and are cut the same way. */
 if(r.unread)return '';
 var ro=(r.aff||[]).map(function(v,i){return {i:i,v:v};}).sort(function(x,y){return y.v-x.v;});
 if(!ro.length)return '';
 var at=-1; ro.forEach(function(x,j){if(x.i===a.i)at=j;});
 var top=ARCH[ro[0].i].nm, where=at<3?AV_RANK[at]:'further down';
 if(at===0)return 'Your field reads '+a.nm+' first'+(rating?' too.':'.');
 if(rating&&rating<=2&&at<=2)
  return 'You set '+a.nm+' low and your field reads it '+where+'.';
 return 'Your field reads '+top+' first and '+a.nm+' '+where+'.';}

/* ---------------- the state the page draws ---------------- */
function avState(){
 var r=compute(), side=avSide();
 var rows=(typeof avRows==='function')?avRows():[];
 rows.forEach(function(x,i){x.i=i; x.c=avClosure(x,side.load0[avKey(x.pair)]);});
 var areas={};
 AV_AREAS.forEach(function(A){
  var mine=rows.filter(function(x){return x.gap&&x.gap.seat===A.b;});
  var cs=mine.map(function(x){return x.c;}).filter(function(v){return v!=null;});
  areas[A.k]={rows:mine, pct:cs.length?cs.reduce(function(s,v){return s+v;},0)/cs.length:null};});
 var cs=rows.map(function(x){return x.c;}).filter(function(v){return v!=null;});
 var overall=cs.length?cs.reduce(function(s,v){return s+v;},0)/cs.length:null;
 /* the lead is the one the person pressed, or the heaviest still carrying */
 var lead=(AV.sel!=null&&rows[AV.sel])?rows[AV.sel]:null;
 if(!lead&&AV.area==null){
  var open=rows.filter(function(x){return x.gap&&!x.gap.clear;})
   .sort(function(a,b){return b.gap.load-a.gap.load;});
  lead=open[0]||rows[0]||null;}
 var seats={}; rows.forEach(function(x){if(x.gap)seats[x.gap.seat]=1;});
 var rated=Object.keys(side.arch).sort(function(a,b){return side.arch[b]-side.arch[a];});
 return {r:r, side:side, rows:rows, areas:areas, overall:overall, lead:lead,
  run:avRunning(r,seats), rit:avRituals(r,rows), top:rated[0]?avArchByName(rated[0]):null};}

/* ---------------- the ring ----------------
   redesign-GG's figure: a core carrying percent complete, seven satellites
   at the same angles, each with its own. The core wears the archetype the
   person rates highest. Over it, the running saboteurs as tension lines
   across the satellites of the seats their parts sit at, drawn from the
   lightest seat to the heaviest so a pulse travels toward the heaviest while
   loading and away from it while releasing. */
var AV_ORB=37.5, AV_SR=6.5;
function avLines(st){
 var rows=st.run.rows; if(!rows.length)return '';
 var show=AV.trace?rows.filter(function(x){return x.nm===AV.trace;}):rows.slice(0,3);
 var s='';
 show.forEach(function(x){
  var c=x.fam?seatCol(x.fam.b):'var(--dim)', sw=(0.35+Math.min(10,x.w)*0.05).toFixed(2), d;
  if(x.seats.length<2){
   var A=AV_OF[x.seats[0]]; if(!A)return;
   var o=avPos(A.a,AV_ORB), R=AV_SR+2.4;
   d='M'+avP(o[0])+' '+avP(o[1]-R)+' a'+R+' '+R+' 0 1 1 -0.01 0';}
  else{
   d='';
   x.seats.forEach(function(b,j){
    var A=AV_OF[b]; if(!A)return;
    var p=avPos(A.a,AV_ORB-AV_SR-1.2);
    if(!d){d='M'+avP(p[0])+' '+avP(p[1]);return;}
    var prev=AV_OF[x.seats[j-1]], q=avPos(prev.a,AV_ORB-AV_SR-1.2);
    var mx=(p[0]+q[0])/2, my=(p[1]+q[1])/2, cx=50+(mx-50)*0.35, cy=50+(my-50)*0.35;
    d+=' Q'+avP(cx)+' '+avP(cy)+' '+avP(p[0])+' '+avP(p[1]);});}
  if(!d)return;
  var dur=Math.max(3,9-Math.sqrt(Math.max(0,x.w))*1.8).toFixed(1);
  s+='<path class="av-line" d="'+d+'" style="stroke:'+c+';stroke-width:'+sw+'"/>';
  if(x.dir!=='steady')
   s+='<path class="av-pulse '+(x.dir==='loading'?'av-ld':'av-rl')+'" d="'+d+'" style="stroke:'+c
    +';stroke-width:'+(+sw+0.5).toFixed(2)+';animation-duration:'+dur+'s"/>';});
 return s;}
function avRing(st){
 var ORB=AV_ORB, SR=AV_SR, lead=st.lead, hot=lead&&lead.gap?lead.gap.seat:null;
 var s='<svg class="av-draw" viewBox="0 0 100 100" aria-hidden="true">';
 for(var i=0;i<72;i++){var a=i*5,p0=avPos(a,19.2),p1=avPos(a,i%6===0?21.4:20.4);
  s+='<line x1="'+avP(p0[0])+'" y1="'+avP(p0[1])+'" x2="'+avP(p1[0])+'" y2="'+avP(p1[1])+'" class="av-tick"/>';}
 s+='<circle cx="50" cy="50" r="17.6" class="av-track"/>';
 if(st.overall!=null&&st.overall>0)
  s+='<path d="'+avArc(50,50,17.6,st.overall)+'" class="av-prog"/>';
 AV_AREAS.forEach(function(x){
  var c=avPos(x.a,ORB), A=st.areas[x.k];
  var has=A.rows.length>0, on=hot===x.b||AV.area===x.k, col=seatCol(x.b);
  s+='<circle cx="'+avP(c[0])+'" cy="'+avP(c[1])+'" r="'+SR+'" class="av-sring" style="stroke:'
   +(has||on?col:'var(--edge-2)')+';stroke-opacity:'+(on?.95:has?.35:1)+';stroke-width:'+(on?.8:.55)+'"/>';
  if(A.pct!=null&&A.pct>0)
   s+='<path d="'+avArc(c[0],c[1],SR,A.pct)+'" class="av-sarc" style="stroke:'+col+'"/>';});
 s+=avLines(st)+'</svg>';
 var top=st.top, core='<div class="av-core'+(top?' av-on':'')+'"'+(top?' style="--c:'+seatCol(top.b)+'"':'')+'>'
  +(top?avArchIc(top,'av-core-ic'):avSvg(AV_IC.person,'av-core-ic'))
  +'<span class="av-core-big">'+avPct(st.overall)+'</span><span class="av-core-lb">Complete</span>'
  +(top?'<span class="av-core-an">'+esc(top.nm)+'</span>':'')+'</div>';
 var sats=AV_AREAS.map(function(x){
  var c=avPos(x.a,ORB), A=st.areas[x.k], on=(AV.area===x.k)||(AV.area==null&&hot===x.b);
  /* ON A FIRST RUN THE SEVEN ARE MARKS, NOT BUTTONS. With nothing written a
     press opens nothing worth opening, and seven controls that do no work took
     the first screen to fifteen choices against a floor of twelve. They become
     buttons with the first pair, when there is something behind them. */
  var tag=st.rows.length?'button':'span';
  return '<'+tag+(tag==='button'?' type="button"':' role="img"')+' class="av-sat'+(on?' av-on':'')+'" data-avsat="'+x.k+'" style="left:'
   +avP(c[0])+'%;top:'+avP(c[1])+'%;--c:'+seatCol(x.b)+'"'+(tag==='button'?' aria-pressed="'+on+'"':'')+' aria-label="'+x.nm+', '
   +(A.pct==null?'nothing written':Math.round(A.pct*100)+' percent complete')+'">'
   +avSvg(AV_IC[x.k])+'<span class="av-sat-pc">'+avPct(A.pct)+'</span></'+tag+'>';}).join('');
 var labs=AV_AREAS.map(function(x){var l=avPos(x.a,26.4);
  return '<span class="av-slab" style="left:'+avP(l[0])+'%;top:'+avP(l[1])+'%">'+x.nm+'</span>';}).join('');
 return '<div class="av-ring">'+s+labs+core+sats+'</div>';}

/* ---------------- the panel beside the ring ---------------- */
function avTags(h){
 if(!h.seat)return '';
 return '<div class="av-tags">'
  +'<span class="av-tag" style="--c:'+seatCol(h.seat)+'">'+avSvg(AV_IC[h.area.k])+esc(h.area.nm)+', '+AV_THE[h.seat]+'</span>'
  +h.words.slice(0,4).map(function(w){return '<span class="av-tag av-tw">'+esc(w)+'</span>';}).join('')
  +h.named.map(function(f){return '<span class="av-tag av-tf">'+esc(String(f).toLowerCase())+'</span>';}).join('')
  +'</div>';}
function avPanel(st){
 var x=st.lead;
 if(!x&&AV.area!=null){
  var A=AV_AREAS.filter(function(a){return a.k===AV.area;})[0];
  return '<div class="av-card av-panel" style="--c:'+seatCol(A.b)+'"><div class="av-ph">'
   +'<span class="av-pic">'+avSvg(AV_IC[A.k])+'</span><div><div class="av-pn">'+A.nm+'</div>'
   +'<p class="av-pa">'+esc(A.about)+'. At '+AV_THE[A.b]+'.</p></div><span class="av-pp">'+avPct(null)+'</span></div>'
   /* HS sweep: the empty state keeps its first sentence. The second explained
      how a pair lands, which the form beside it already shows. */
   +'<p class="av-p">Nothing you have written lands here yet.</p></div>';}
 if(!x)return avForm(true);
 var g=x.gap, h=avHeard(x.pair.notbe), A2=g?AV_OF[g.seat]:null;
 var out='<div class="av-card av-panel"'+(A2?' style="--c:'+seatCol(A2.b)+'"':'')+'>'
  +'<div class="av-ph"><span class="av-pic">'+avSvg(A2?AV_IC[A2.k]:AV_IC.person)+'</span>'
  +'<div><div class="av-pn">'+(A2?A2.nm:'No address')+'</div>'
  +'<p class="av-pa">'+(A2?esc(A2.about):'not read yet')+'</p></div>'
  +'<span class="av-pp">'+avPct(x.c)+'<small>Complete</small></span></div>'
  +'<div class="av-pl">Who you want to be</div><p class="av-pv">'+esc(x.pair.be)+'</p>'
  +'<div class="av-pl">Who you do not want to be</div><p class="av-pv av-pq">“'+esc(x.pair.notbe)+'”</p>'
  +avTags(h);
 out+=g?avPanelFor(x,g,h)
  :'<p class="av-p">The sniffer could not read a feeling out of the second line, so it has no '
   +'address yet. Say it again with one in: what the body did, or what you felt.</p>'
   +'<div class="av-act"><button type="button" class="btn" id="avtake">Take it off</button></div>';
 return out+'</div>';}
/* the half of the panel that needs an address: the journal sniffed for this
   pair, and the protocol that clears it */
function avPanelFor(x,g,h){
 var out='';
 var J=avJournal(g.seat,h);
 out+='<div class="av-pl">From your journal</div>';
 if(J.length)
  out+='<div class="av-jr">'+J.map(function(j){
   return '<div class="av-jr-row"><p class="av-jr-q">'+avQuote(j.e,j.marks)+'</p>'
    +'<p class="av-jr-m">'+avAgo(j.days)+(j.marks.length?'. Heard at '+AV_THE[g.seat]:'')+'</p></div>';}).join('')+'</div>';
 else
  /* HS sweep: "What you commit on the Story page is read here" explained
     where this row reads from. The row's own label says it: From your journal. */
  out+='<p class="av-p">Nothing in your journal lands at '+AV_THE[g.seat]+' yet.</p>';
 /* and the protocol that clears it */
 var q=avQueue(g.seat), m=avMinutes(q);
 if(g.clear||!q.length)
  out+='<p class="av-p">Nothing is carrying at '+AV_THE[g.seat]+', so there is nothing to release for this one.</p>'
   +'<div class="av-act"><button type="button" class="btn" id="avtake">Take it off</button></div>';
 else
  out+='<p class="av-p">'+q.length+(q.length===1?' address':' addresses')+' at '+AV_THE[g.seat]
   +' carry what stands in the way, heaviest '+esc(q[0].k)+'.</p>'
   +'<div class="av-act"><button type="button" class="btn pri av-go" id="avrel">Release it'
   +(m!==null?'<small>'+avMinSay(m)+'</small>':'')+'</button>'
   +'<button type="button" class="btn" id="avtake">Take it off</button></div>';
 return out;}
/* THE PLACEHOLDER IS A LINE THE SNIFFER READS, checked against readSeat: it
   lands at the throat. "My throat closes" was the first draft and reads to no
   address at all, because "closes" is not in the lexicon, and an example that
   the instrument cannot hear teaches a person the wrong thing on the first try. */
function avForm(lead){
 var d=AV.draft, h=avHeard(d.notbe);
 /* HS sweep. The lead form opened on a paragraph describing the two fields
    under it ("Two lines. Who you want to be, and a bad day..."). The two
    labels and their placeholders already say it, and the heading above the
    form asks the question. Both forms open on the same label now. */
 return '<div class="av-card av-form'+(lead?' av-panel':'')+'">'
  +'<div class="pm-eye">Tell it</div>'
  +'<label class="av-f"><span>Who you want to be</span>'
  +'<input type="text" id="avbe" maxlength="199" autocomplete="off" '
  +'placeholder="A great public speaker. I stand up and the room hears me." value="'+esc(d.be)+'"></label>'
  +'<label class="av-f"><span>Who you do not want to be</span>'
  +'<input type="text" id="avnotbe" maxlength="199" autocomplete="off" '
  +'placeholder="My throat is tight and I am afraid when I stand up in front of the board." value="'+esc(d.notbe)+'"></label>'
  +'<div class="av-live" id="avlive" role="status" aria-live="polite">'+avLive(h,d)+'</div>'
  +'<div class="av-act"><button type="button" class="btn pri" id="avadd"'
  +(d.be.trim()&&d.notbe.trim()?'':' disabled')+'>Add to your avatar</button></div></div>';}
function avLive(h,d){
 if(!String(d.notbe||'').trim())return '';
 if(!h.seat)return '<p class="av-p">Nothing read yet, so this line has no address. Say what the body did, or what you felt.</p>';
 return '<p class="av-p">Lands at <b>'+esc(h.area.nm)+'</b>, '+AV_THE[h.seat]+'.</p>'+avTags(h);}
function avPairs(st){
 if(!st.rows.length)return '';
 return '<div class="av-pairs"><div class="pm-eye">Written</div>'+st.rows.map(function(x){
  var A=x.gap?AV_OF[x.gap.seat]:null, on=st.lead===x;
  return '<button type="button" class="av-pair'+(on?' av-on':'')+'" data-avpair="'+x.i+'"'
   +(A?' style="--c:'+seatCol(A.b)+'"':'')+' aria-pressed="'+on+'">'
   +'<span class="av-pair-ic">'+avSvg(A?AV_IC[A.k]:AV_IC.person)+'</span>'
   +'<span class="av-pair-t">'+esc(x.pair.be)+'</span>'
   +'<span class="av-pair-pc">'+avPct(x.c)+'</span></button>';}).join('')+'</div>';}

/* ---------------- running, as rows ---------------- */
function avRunHTML(st){
 var R=st.run, out='<section class="av-card av-run"><div class="pm-eye">Running</div>';
 if(!R.rows.length)
  return out+'<p class="av-p">'+(st.r.unread?'Nothing read yet, so no saboteur is running.'
   :'No saboteur is running.')+'</p></section>';
 /* HS sweep. A paragraph here described the list under it: which saboteurs,
    in what order, what the arrow means, and what a press does. The rows are
    ordered, carry their direction word and are buttons, so the list shows all
    four of those things itself. */
 out+='<div class="av-runs">';
 R.rows.forEach(function(x){
  var c=x.fam?seatCol(x.fam.b):'var(--dim)', on=AV.trace===x.nm;
  out+='<button type="button" class="av-run-row'+(on?' av-on':'')+'" data-avsab="'+esc(x.nm)+'" aria-pressed="'+on+'" style="--c:'+c+'">'
   +'<span class="av-run-ic"><svg viewBox="0 0 24 24" aria-hidden="true">'+glyphPath(x.fam?x.fam.ic:'')+'</svg></span>'
   +'<span class="av-run-nm">'+esc(x.nm)+'</span>'
   +'<span class="av-run-v">'+x.w.toFixed(1)+'</span>'
   +'<span class="av-run-d av-'+x.dir+'">'+x.dir+'</span>'
   +'<span class="av-run-bar"><i style="width:'+Math.min(100,x.w*10).toFixed(0)+'%"></i></span></button>';});
 return out+'</div></section>';}

/* ---------------- rituals, queued and tasked ---------------- */
function avRitHTML(st){
 var out='<section class="av-card av-rit"><div class="pm-eye">Rituals</div>';
 var td=(typeof ritToday==='function')?ritToday():null;
 if(td){var ts=ritSteps(td);
  out+='<p class="av-p av-rit-today">Today: '+esc(ts.map(function(p){return p.nm;}).join(', '))
   +', '+((+td.min)||0)+' minutes. '+(td.done?'Done.':'Not done yet.')+'</p>';}
 if(!st.rit.length)
  return out+'<p class="av-p">Nothing to queue yet.</p></section>';
 if(AV.q===null){AV.q={}; AV.q[st.rit[0].p.k]=true;}
 /* HS sweep. "What each area you are working on calls for... Queue them
    here, then task them" described the rows and the button under them, and
    the empty state above carried a second sentence on how a queue fills. Each
    row names its practice and the area it is for, and the button says Task
    these. */
 out+='<div class="av-rits">';
 var mins=0;
 st.rit.forEach(function(x){
  var on=!!AV.q[x.p.k]; if(on)mins+=x.p.min;
  out+='<button type="button" class="av-rit-row'+(on?' av-on':'')+'" data-avrit="'+x.p.k+'" aria-pressed="'+on+'" style="--c:'
   +(PTRACK[x.track]||GOLD)+'"><span class="av-rit-m"></span><span class="av-rit-t"><b>'+esc(x.p.nm)+'</b><em>for '
   +esc(x.areas.map(function(a){return a.nm;}).join(' and '))+'</em></span><span class="av-rit-n">'+x.p.min+' minutes</span></button>';});
 out+='</div><div class="av-act"><span class="av-rit-sum">'+(mins?mins+' minutes queued':'Nothing queued')+'</span>'
  +'<button type="button" class="btn pri" id="avtask"'+(mins?'':' disabled')+'>Task these</button></div>';
 return out+'</section>';}

/* ---------------- the archetype wheel and its scale ----------------
   The merged wheel, round GU mockup D, approved for this page at round GV.
   His later ruling replaced the one press "Rings true" with a line of five:
   "instead of ringing true, change it to a line, but we want to give a scale
   from one to five. People may not see their full potential, they're a
   magician as an example, they may not understand it." A press on a point
   sets it and the same press takes it off, which keeps his GV ruling that
   there is no separate save. */
function avWheel(st){
 var r=st.r, aff=r.aff||[], mx=0; aff.forEach(function(v){if(v>mx)mx=v;});
 var sel=avArchByName(AV.arch)||st.top||(function(){
  if(r.unread||!aff.length)return AV_ROSTER[0];
  var b=0; aff.forEach(function(v,i){if(v>aff[b])b=i;}); return AV_ROSTER[b];})();
 AV.arch=sel.nm;
 var s='<svg class="av-draw" viewBox="0 0 100 100" aria-hidden="true">';
 AV_AREAS.forEach(function(x){
  var a0=(x.a-24)*Math.PI/180, a1=(x.a+24)*Math.PI/180, R=25;
  s+='<path d="M'+avP(50+R*Math.cos(a0))+' '+avP(50+R*Math.sin(a0))+' A'+R+' '+R+' 0 0 1 '
   +avP(50+R*Math.cos(a1))+' '+avP(50+R*Math.sin(a1))+'" class="av-wseat" style="stroke:'+seatCol(x.b)+'"/>';
  var ic=avPos(x.a,25);
  s+='<g transform="translate('+avP(ic[0]-2.4)+' '+avP(ic[1]-2.4)+') scale(.2)" class="av-wic" style="stroke:'
   +seatCol(x.b)+'">'+AV_IC[x.k]+'</g>';});
 s+='</svg>';
 var marks=AV_ROSTER.map(function(a){
  var p=avPos(avArchAngle(a),40), rt=st.side.arch[a.nm]||0, on=a===sel;
  var g=(!r.unread&&mx>0)?(aff[a.i]||0)/mx:0;
  return '<button type="button" class="av-mk'+(on?' av-on':'')+'" data-avmk="'+a.nm+'" style="left:'+avP(p[0])+'%;top:'
   +avP(p[1])+'%;--c:'+seatCol(a.b)+';--g:'+g.toFixed(2)+'" aria-pressed="'+on+'" aria-label="'+a.nm
   +(rt?', set at '+rt:', not set')+'"><span class="av-mk-ic">'+avArchIc(a)
   +(rt?'<span class="av-mk-pill">'+rt+'</span>':'')+'</span><span class="av-mk-nm">'+a.nm+'</span></button>';}).join('');
 var core='<div class="av-wcore" style="--c:'+seatCol(sel.b)+'">'+avArchIc(sel,'av-core-ic')
  +'<span class="av-wcore-nm">'+esc(sel.nm)+'</span><span class="av-core-lb">'+esc(AV_OF[sel.b].nm)+'</span></div>';
 return {html:'<div class="av-wheel">'+s+core+marks+'</div>', sel:sel};}
function avDetail(st,a){
 var rt=st.side.arch[a.nm]||0, A=AV_OF[a.b], sab=a.sab?avSabNamed(a.sab,st.run):null;
 var out='<div class="av-card av-det" style="--c:'+seatCol(a.b)+'">'
  +'<div class="av-ph"><span class="av-pic">'+avArchIc(a)+'</span><div>'
  +'<p class="av-det-e"><b>'+A.nm+'</b>, '+AV_THE[a.b]+'</p><div class="av-pn">'+esc(a.nm)+'</div></div></div>'
  +'<p class="av-def">'+esc(AV_DEF[a.nm]||'')+'</p>';
 if(a.sab)
  out+='<div class="av-imp" style="--s:'+seatCol(a.sabB)+'"><div class="pm-eye">Impact</div>'
   +'<p class="av-imp-v"><b>'+esc(a.sab)+'</b><span>primary saboteur, at '+AV_THE[a.sabB]+'</span></p>'
   +'<p class="av-imp-c">'+esc(AV_IMPACT[a.sab]||'')+'</p>'
   +(sab?'<p class="av-imp-r">Running at a weight of '+sab.w.toFixed(1)+', <span class="av-'+sab.dir+'">'+sab.dir+'</span>.</p>':'')
   +'</div>';
 out+='<div class="av-pl" id="avsclab">How much of this is you</div>'
  +'<div class="av-scale" role="radiogroup" aria-labelledby="avsclab"><span class="av-sl"><i style="width:'
  +(rt?((rt-1)/4*100).toFixed(0):0)+'%"></i></span>'
  +AV_SCALE.map(function(n){
   return '<button type="button" class="av-st'+(n<=rt?' av-on':'')+(n===rt?' av-at':'')+'" role="radio" aria-checked="'+(n===rt)
    +'" data-avst="'+n+'">'+n+'</button>';}).join('')+'</div>'
  +'<div class="av-ends"><span>Hardly</span><span>Fully</span></div>'
  +'<p class="av-hint">One press sets it. The same press again takes it off.</p>'
  +(function(t){return t?'<p class="av-cmp">'+t+'</p>':'';})(avCompare(a,rt,st.r))+'</div>';
 return out;}

/* ---------------- the surface ---------------- */
function renderAvatar(){
 var host=document.getElementById('avbody'); if(!host)return;
 if(typeof iqEnsure==='function')iqEnsure();
 /* a selection, a queue and a half typed pair belong to one person. Moving to
    another profile starts them over rather than carrying one person's draft
    onto somebody else's avatar. */
 var who=S.who+'|'+(CURP&&CURP.id);
 if(AV.who!==who){AV.who=who; AV.sel=null; AV.area=null; AV.arch=null; AV.trace=null; AV.q=null;
  AV.draft={be:'',notbe:''};}
 var st=avState(), h='<div class="av">';
 var lead=st.lead, g=lead&&lead.gap;
 h+='<header class="av-hd"><div class="av-hd-t"><div class="pm-eye">Becoming</div>'
  +(lead?'<h2 class="av-h">'+esc(lead.pair.be)+'</h2>'
    +'<p class="av-hq">“'+esc(lead.pair.notbe)+'”</p>'
    +(g?'<p class="av-hs">'+(g.clear?'Clear at '+AV_THE[g.seat]+'.'
      :'Held at '+AV_THE[g.seat]+', at a weight of '+g.load.toFixed(1)+'.')+'</p>':'')
   :'<h2 class="av-h">Who do you want to be?</h2>')
  +'</div><button type="button" class="btn av-jump" id="avjump">Energetics</button></header>';
 h+='<div class="av-hero">'+avRing(st)+'<div class="av-side">'+avPanel(st)+'</div></div>';
 if(st.rows.length)h+='<div class="av-row2">'+avPairs(st)+avForm(false)+'</div>';
 h+='<div class="av-row2">'+avRunHTML(st)+avRitHTML(st)+'</div>';
 var W2=avWheel(st);
 /* THE PARAGRAPH EXPLAINING WHAT THIS SECTION IS, AND HOW TO USE THE SCALE,
    IS GONE. Round HS, his own words, quoting this exact line back: "you have
    this text again, where it says archetypes, 12 ways of acting, each
    besides the part, holy shit, I told you I don't want text like that
    anymore." The scale's own end labels and each archetype's own detail
    panel already say how the press works; nothing here needs a paragraph
    to explain itself first. */
 h+='<section class="av-arch"><div class="pm-eye">Archetypes</div>'
  +'<div class="av-row2 av-archg">'+W2.html+avDetail(st,W2.sel)+'</div></section>';
 host.innerHTML=h+'</div>';
 AV.sig=avSig();
 avBind(host,st);}
/* repaint only when something the page reads has moved. renderIntake calls
   this on every press of its own, and a press on a law must not throw away a
   half typed pair. */
function avSig(){
 var s=0; CHARGES.forEach(function(c){s+=(S.charge[c]||0)+(S.replace[c]||0)*0.001;});
 var p=CURP||{}, e=(p.story&&p.story.entries)||[], av=(p.avatar&&p.avatar.pairs)||[];
 return [S.who, p.id, e.length, av.length, (p.rituals||[]).length, s.toFixed(4), S.theme].join('|');}
function avRefresh(){
 var host=document.getElementById('avbody');
 if(host&&(!host.firstChild||AV.sig!==avSig()))renderAvatar();}

/* A RELEASE RUNS IN ITS OWN CARD OVER THE PAGE, and relCoolDown repaints the
   Field and not this. So the page watches the run it started and repaints once
   the writes have landed, which is when the percent and the direction move. */
function avWatch(){
 clearInterval(AV.watch);
 AV.watch=setInterval(function(){
  if(RUN.open&&RUN.phase!=='done')return;
  clearInterval(AV.watch); AV.watch=null;
  if(typeof S!=='undefined'&&S.tab===TAB.INTAKE)renderAvatar();},400);}

function avBind(host,st){
 var b;
 host.querySelectorAll('[data-avsat]').forEach(function(el){el.onclick=function(){
  var k=el.dataset.avsat, A=st.areas[k];
  AV.area=k; AV.sel=null;
  if(A.rows.length){
   var pick=A.rows.slice().sort(function(a,b2){return (a.c||0)-(b2.c||0);})[0];
   AV.sel=pick.i; AV.area=null;}
  renderAvatar();};});
 host.querySelectorAll('[data-avpair]').forEach(function(el){el.onclick=function(){
  AV.sel=+el.dataset.avpair; AV.area=null; renderAvatar();};});
 host.querySelectorAll('[data-avsab]').forEach(function(el){el.onclick=function(){
  AV.trace=(AV.trace===el.dataset.avsab)?null:el.dataset.avsab; renderAvatar();};});
 host.querySelectorAll('[data-avrit]').forEach(function(el){el.onclick=function(){
  AV.q[el.dataset.avrit]=!AV.q[el.dataset.avrit]; renderAvatar();};});
 host.querySelectorAll('[data-avmk]').forEach(function(el){el.onclick=function(){
  AV.arch=el.dataset.avmk; renderAvatar();};});
 host.querySelectorAll('[data-avst]').forEach(function(el){el.onclick=function(){avRate(+el.dataset.avst);};});
 /* the two lines. typing reads them live and redraws only the tags */
 ['be','notbe'].forEach(function(k){
  var el=document.getElementById('av'+k); if(!el)return;
  el.oninput=function(){
   AV.draft[k]=el.value;
   var add=document.getElementById('avadd');
   if(add)add.disabled=!(AV.draft.be.trim()&&AV.draft.notbe.trim());
   if(k==='notbe'){clearTimeout(AV.liveT);AV.liveT=setTimeout(function(){
    var lv=document.getElementById('avlive'); if(lv)lv.innerHTML=avLive(avHeard(AV.draft.notbe),AV.draft);},220);}};});
 if((b=document.getElementById('avadd')))b.onclick=avAdd;
 if((b=document.getElementById('avtake')))b.onclick=avTake;
 if((b=document.getElementById('avrel')))b.onclick=function(){
  var x=st.lead; if(!x||!x.gap)return;
  var q=avQueue(x.gap.seat); if(!q.length)return;
  relPick(q.map(function(n){return n.i;})); avWatch();};
 if((b=document.getElementById('avtask')))b.onclick=function(){
  var keys=Object.keys(AV.q||{}).filter(function(k){return AV.q[k];}); if(!keys.length)return;
  /* the shipped builder is the one writer of a ritual. It opens with this
     queue in it and asks the when and the where before it saves. */
  ritOpen(); RIT.sel={}; keys.forEach(function(k){RIT.sel[k]=true;}); RIT.all=true; ritRender();};
 if((b=document.getElementById('avjump')))b.onclick=function(){
  var t=document.getElementById('iqbody'); if(t&&t.scrollIntoView)t.scrollIntoView({block:'start'});};}

/* ---------------- the writes ----------------
   Each one says what happened through status(), and none of them claims a
   save it did not get. A pair goes into the record, so a refused save takes
   it back out. */
function avAdd(){
 var pr={be:AV.draft.be.trim(), notbe:AV.draft.notbe.trim()};
 if(!avatarValid(pr))return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var av=CURP.avatar=CURP.avatar||avatarBlank(), was={built:av.built, at:av.at};
 av.pairs.push(pr); av.built=true; if(!av.at)av.at=new Date().toISOString();
 pSave();
 if(!statusSaved()){av.pairs.pop(); av.built=was.built; av.at=was.at; return;}
 /* the weight at the seat now, which is what percent complete is measured
    from. A pair that lands nowhere has no weight to keep. */
 compute();
 var rows=avRows(), row=rows[rows.length-1];
 if(row&&row.gap&&!avSideWrite(function(e){e.load0[avKey(pr)]=row.gap.load;}))
  status('Saved. The starting weight was not kept, so this one reads from nothing done.','fail');
 AV.draft={be:'',notbe:''}; AV.sel=rows.length-1; AV.area=null; AV.q=null;
 renderAvatar();}
function avTake(){
 var st=AV.sel, rows=avRows();
 var x=(st!=null&&rows[st])?rows[st]:null;
 if(!x){var s2=avState(); x=s2.lead;}
 if(!x)return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var P=CURP.avatar.pairs, i=P.indexOf(x.pair); if(i<0)return;
 P.splice(i,1); pSave();
 if(!statusSaved()){P.splice(i,0,x.pair); return;}
 avSideWrite(function(e){delete e.load0[avKey(x.pair)];});
 AV.sel=null; AV.area=null; AV.q=null; renderAvatar();}
function avRate(n){
 var a=avArchByName(AV.arch); if(!a)return;
 if(!avOwn()){status('Nothing saved on a worked example.','fail');return;}
 var was=avSide().arch[a.nm]||0, to=(was===n)?0:n;
 var ok=avSideWrite(function(e){if(to)e.arch[a.nm]=to; else delete e.arch[a.nm];});
 if(!ok){status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');return;}
 status(to?'Saved. '+a.nm+' at '+to+'.':'Taken off. '+a.nm+' is not set.');
 renderAvatar();}
