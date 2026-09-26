/* ============================================================
   THE AVATAR, FOUR WAYS. Prototype over the shipped build, round DY.
   Not part of the product. Nothing under atuned_src/ is touched.

   His words, 26 September: "the avatar needs to be a, let's do it with the
   body, actually, well, the body's symbolic, give me two mockups with the
   body and then two with the seven seats."

   ONE READING, FOUR DRAWINGS. Every number below is the product's own:
   compute() for coherence, radiance and the darkest seat, flSeats() (the
   Body page's own seat pass, ui/map.js) for how far each seat conducts,
   pmNode() for where an address really sits on the figure, NERVEBR for the
   nerve branches, ritFor() for the ritual the product would call. The four
   drawings are compared on exactly the same reading, so what differs between
   them is the drawing and nothing else.

   THE GRAMMAR IS SHARED, so the comparison is fair:
     charge      what is held now. It can go up and down.
     pass        how far a seat conducts, 0 to 1. Drawn as a ring or a bank.
     record      addresses a release has reached. Append only, never dims.
     radiance    his vibrancy, compute().radiance. Moves the exposure of the
                 ink structure, never the saturation of a seat colour.
     coherence   CQ, the 21 laws over 210.

   RELEASES ARE THE PRODUCT'S OWN ARITHMETIC. The release control refuses on
   a worked example (ui/release.js, relCoolDown), because a reference case is
   not a record. So this replays the same writes the release makes, on the
   same queue the release button builds (ui/personas.js, bRel: the eight
   heaviest at or above the line, else the eight heaviest carrying), and the
   same law lift (releaseWork). The lift is counted at one pattern per
   address, which is the smallest a run can lift, so CQ here moves no more
   than the product would move it.
   ============================================================ */
window.AVX=(function(){
'use strict';
var BANK=window.AVX_BANK||{};
/* bottom up, the order a channel conducts in */
var ORDER=['root','sacral','solar','heart','throat','eye','crown'];
var NM={root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',throat:'Throat',eye:'3rd Eye',crown:'Crown'};
var THE={root:'the root',sacral:'the sacral',solar:'the solar plexus',heart:'the heart',
 throat:'the throat',eye:'the third eye',crown:'the crown'};
function col(k){return 'var(--'+k+')';}
function P(n){return (+n).toFixed(2);}
var TAU=Math.PI*2;

var ST={v:'figure', who:'James', runs:0, max:12, snaps:[], rec:null};
var VARIANTS=[
 {k:'figure', grp:'Body', nm:'The figure', sub:'A body, carrying its story'},
 {k:'nerves', grp:'Body', nm:'The nerves', sub:'A body, conducting'},
 {k:'channel',grp:'Seats',nm:'The channel',sub:'Seven seats, in series'},
 {k:'ring',   grp:'Seats',nm:'The ring',   sub:'Seven seats, closed'}];

/* ---------------- the person, and the releases ---------------- */
function pIndex(nm){for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)return i;return 0;}
function reset(who){
 loadP(who==='blank'?0:pIndex(who));
 if(CURP){CURP.work={};CURP.story={entries:[]};}
 (BANK[who]||[]).forEach(function(t,k){
  applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);
  if(CURP){var ps=parseStory(t);
   CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});}});
 return {runs:0, addr:{}, seats:{}, freed:0};}
/* one release, as relCoolDown writes it */
function runOnce(rec){
 compute();
 var hot=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;});
 var pool=hot.length?hot:W.filter(function(n){return n.sq>0;}).sort(function(a,b){return b.sq-a.sq;});
 var q=pool.slice(0,8).filter(function(n){return n&&n.cf;});
 if(!q.length)return false;
 rec.runs++;
 q.forEach(function(n){
  var w0=n.sq*10, d=-Math.round(w0*0.21+2);
  var share=Math.abs(d)/10/Math.max(1,q.filter(function(x){return x.cf===n.cf;}).length);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
  rec.freed+=Math.abs(d);
  if(!rec.addr[n.i])rec.addr[n.i]=rec.runs;
  rec.seats[B2K[n.b]]=true;});
 if(typeof releaseWork==='function'&&LAW_REC)
  releaseWork(LAW_REC,q.map(function(n){return n.i+':p:0';}));
 return true;}

/* ---------------- the reading ---------------- */
/* parseStory reports bands by seat key, crown to root, not by band name */
function storyFor(k){
 var best=null,bv=0;
 (BANK[ST.who]||[]).forEach(function(t){var v=(parseStory(t).bands||{})[k]||0;if(v>bv){bv=v;best=t;}});
 return best;}
/* HOW FAR A SEAT CONDUCTS, AND WHY IT IS NOT flSeats. The Body page's own
   seat pass counts only addresses at or above the line of 4, so it reads a
   cliff: Angela carries 74 addresses and every seat reads 100 percent, and
   James reads 100 percent everywhere after four runs while still carrying
   89. An avatar on that says clear to people who are not. Each address
   already carries its own conduction, n.open, set in compute(): nothing held
   conducts, charge does not, the opposite installed conducts most. A seat is
   the mean of its addresses, capped at 1. flSeats is kept beside it as
   `line`, so the gap between the two is measurable. */
function seatOpen(b){
 var g=W.filter(function(n){return n.b===b;});
 return g.reduce(function(a,n){return a+Math.min(1,Math.max(0,n.open));},0)/Math.max(1,g.length);}
function read(rec){
 var r=compute(), fs=flSeats(), by={};
 fs.forEach(function(s){by[s.p.k]=s;});
 ORDER.forEach(function(k){by[k].line=by[k].pass;by[k].pass=seatOpen(K2B[k]);});
 var cum={},run=1;
 ORDER.forEach(function(k){run*=by[k].pass;cum[k]=run;});
 var dk=B2K[r.darkB]||'root';
 var nodes=W.map(function(n){return {i:n.i,k:B2K[n.b],sq:n.sq,nm:n.k};});
 var atSeat=r.carrying.filter(function(n){return n.b===r.darkB;})[0]||null;
 var sab=null;
 (r.sabs||[]).slice().sort(function(a,b){return b.w-a.w;}).some(function(o){
  var lv=(typeof leaves==='function')?leaves(o):[];
  if(lv.some(function(n){return n.b===r.darkB;})){sab=o;return true;}return false;});
 var rit=null;try{rit=ritFor(r);}catch(e){}
 return {
  /* a blank profile reads radiance 0.80, brighter than James after twelve
     releases at 0.70, so a stranger would outshine somebody who did the
     work. Unread is drawn dark, whatever radiance says. */
  CQ:r.CQ, tier:r.tier, complete:r.complete, unread:r.unread, radiance:r.unread?0:r.radiance,
  rad0:r.radiance,
  EX:r.EX, DQ:r.DQ, carryingN:r.carrying.length,
  seats:ORDER.map(function(k){var s=by[k];
   return {k:k,pass:s.pass,line:s.line,load:s.load,hot:s.hot,tot:s.tot};}),
  cum:cum, speed:run, nodes:nodes, dk:dk,
  place:atSeat?atSeat.k:null, sab:sab?sab.nm:null,
  rit:(rit&&rit.called)?{nm:rit.called.nm,min:rit.called.min,track:rit.called.track}:null,
  story:r.unread?null:storyFor(dk), clear:r.carrying.length===0,
  rec:{runs:rec.runs, addr:Object.assign({},rec.addr), seats:Object.assign({},rec.seats),
   n:Object.keys(rec.addr).length, ns:Object.keys(rec.seats).length}};}

/* every step from arrival to max, in one pass, then the engine is left
   standing on the step being viewed so the rails agree with the avatar */
function build(who){
 ST.who=who;
 var rec=reset(who); ST.snaps=[read(rec)];
 for(var i=1;i<=ST.max;i++){
  if(!runOnce(rec))break;
  ST.snaps.push(read(rec));}
 settle();}
function settle(){
 var n=Math.min(ST.runs,ST.snaps.length-1);
 var rec=reset(ST.who);
 for(var i=0;i<n;i++)runOnce(rec);
 ST.rec=rec;}

/* ---------------- drawing primitives ---------------- */
var NS=' vector-effect="non-scaling-stroke"';
function arcD(cx,cy,r,a0,a1){
 if(a1-a0>=TAU-1e-4)
  return 'M'+P(cx+r)+','+P(cy)+' A'+P(r)+','+P(r)+' 0 1 1 '+P(cx-r)+','+P(cy)
   +' A'+P(r)+','+P(r)+' 0 1 1 '+P(cx+r)+','+P(cy);
 var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
 return 'M'+P(x0)+','+P(y0)+' A'+P(r)+','+P(r)+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+P(x1)+','+P(y1);}
/* the ring gauge, the glass bar's own grammar: a track, and the value
   round the rim from the top, clockwise */
function gauge(cx,cy,r,v,c,w){
 var h='<circle cx="'+P(cx)+'" cy="'+P(cy)+'" r="'+P(r)+'" fill="none" stroke="'+c
  +'" stroke-opacity=".2" stroke-width="'+w+'"'+NS+'/>';
 if(v>0.004)h+='<path d="'+arcD(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.min(1,v)*TAU)
  +'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"'+NS+'/>';
 return h;}
function bracket(cx,cy,hw,hh){
 var t=Math.min(1.2,hw*0.35);
 return '<path d="M'+P(cx-hw+t)+','+P(cy-hh)+' H'+P(cx-hw)+' V'+P(cy+hh)+' H'+P(cx-hw+t)
  +' M'+P(cx+hw-t)+','+P(cy-hh)+' H'+P(cx+hw)+' V'+P(cy+hh)+' H'+P(cx+hw-t)
  +'" fill="none" stroke="var(--accent)" stroke-width="1.5"'+NS+'/>';}
var _box=null;
function bodyBox(){
 if(_box)return _box;
 var v=BODYPATH.match(/-?\d+(\.\d+)?/g).map(Number),x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
 for(var i=0;i+1<v.length;i+=2){var x=PMTX+v[i]*PMS,y=PMTY+v[i+1]*PMS;
  if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
 return (_box={x:x0,y:y0,w:x1-x0,h:y1-y0});}
function yp(k){for(var i=0;i<PMBANDS.length;i++)if(PMBANDS[i].k===k)return PMBANDS[i].yp;return 50;}
function outline(op){
 return '<path transform="translate('+PMTX+','+PMTY+') scale('+PMS+')" d="'+BODYPATH
  +'" fill="none" stroke="var(--ink)" stroke-opacity="'+P(op)+'" stroke-width="1.2"'+NS
  +' stroke-linejoin="round"/>';}
/* the record: a point where a release has been. It is only ever added to. */
function recordPts(R,op){
 var h='';
 R.nodes.forEach(function(n){if(!R.rec.addr[n.i])return;
  var p=pmNode(n.i,n.k);
  h+='<circle cx="'+P(p.x)+'" cy="'+P(p.y)+'" r=".34" fill="var(--ink)" fill-opacity="'+op+'"/>';});
 return h;}
function spine(R,Y,x){
 var h='';
 for(var i=0;i<ORDER.length-1;i++){
  var a=ORDER[i],b=ORDER[i+1],c=R.cum[a];
  h+='<line x1="'+x+'" y1="'+P(Y(a))+'" x2="'+x+'" y2="'+P(Y(b))+'" stroke="'+col(a)
   +'" stroke-opacity="'+P(0.12+0.8*c)+'" stroke-width="'+P(1+1.4*c)+'"'+NS+'/>';}
 return h;}

/* ---------------- one. the figure ----------------
   The product's own body outline, drawn as a line. Charge is a ring at the
   place the story put it, sized by what it holds. A release leaves a point
   where it has been, and the point stays. The seven seats are ring gauges on
   the midline at their measured heights, and the thread between them is the
   rise, root upward, dimmed by every seat below it. */
function drawFigure(R){
 var B=bodyBox(),pad=2.5,h='<svg class="avx-svg" viewBox="'+P(B.x-pad-4)+' '+P(B.y-pad)+' '+P(B.w+pad*2+8)
  +' '+P(B.h+pad*2)+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The avatar as a figure">';
 /* radiance moves exposure inside a floor: 0.36 is 3.01 to 1 on the ruled
    #101010, the non text floor, so the body is findable before any release */
 h+=outline(0.36+0.26*R.radiance);
 h+=spine(R,yp,50);
 R.nodes.forEach(function(n){if(!(n.sq>0))return;
  var p=pmNode(n.i,n.k),v=n.sq/10;
  h+='<circle cx="'+P(p.x)+'" cy="'+P(p.y)+'" r="'+P(0.24+0.62*v)+'" fill="none" stroke="'+col(n.k)
   +'" stroke-opacity="'+P(0.35+0.6*v)+'" stroke-width="1"'+NS+'/>';});
 h+=recordPts(R,.85);
 R.seats.forEach(function(s){h+=gauge(50,yp(s.k),2.4,R.unread?0:s.pass,col(s.k),2.2);});
 if(!R.unread&&!R.clear)h+=bracket(50,yp(R.dk),4.3,2.2);
 return h+'</svg>';}

/* ---------------- two. the nerves ----------------
   The Body page's own traced nerve branches, each drawn at the conduction of
   its seat and every seat below it, the same arithmetic as the Body page's
   flow layer. No charge rings: this one shows what flows, not what is held.
   The outline is only enough to read as a person. */
function drawNerves(R){
 var B=bodyBox(),pad=2.5,h='<svg class="avx-svg" viewBox="'+P(B.x-pad-4)+' '+P(B.y-pad)+' '+P(B.w+pad*2+8)
  +' '+P(B.h+pad*2)+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The avatar as a nerve tree">';
 h+=outline(0.36+0.18*R.radiance);
 NERVEBR.forEach(function(br){
  var th=R.unread?0:(R.cum[br.s]!=null?R.cum[br.s]:0.5);
  h+='<path d="M'+br.p.map(function(q){return P(q[0])+','+P(q[1]);}).join(' L')
   +'" fill="none" stroke="'+col(br.s)+'" stroke-width="'+P(0.7+th*2.1)+'" stroke-opacity="'
   +P(0.10+th*0.82)+'" stroke-linecap="round" stroke-linejoin="round"'+NS+'/>';});
 h+=spine(R,yp,50);
 h+=recordPts(R,.8);
 R.seats.forEach(function(s){h+=gauge(50,yp(s.k),1.55,R.unread?0:s.pass,col(s.k),1.8);});
 if(!R.unread&&!R.clear)h+=bracket(50,yp(R.dk),3.3,1.8);
 return h+'</svg>';}

/* ---------------- three. the channel ----------------
   The Body page's channel, lifted out of the body and stood up on its own.
   Seven seats evenly spaced, because this is the symbol and not the anatomy.
   The two banks are the reading: they close where a seat holds. The comb on
   the left is the charge now, one tick an address, long when heavy. The comb
   on the right is the record, one tick an address, lit once a release has
   reached it. The halo is the product's own boot mark, and it lights by how
   much of the rise reaches the crown. */
var CH={top:26, step:17.5, x:50};
function chY(k){return CH.top+(ORDER.length-1-ORDER.indexOf(k))*CH.step;}
function drawChannel(R){
 var bot=chY('root'),h='<svg class="avx-svg" viewBox="20 0 60 '+P(bot+16)
  +'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The avatar as a channel of seven seats">';
 var half=function(s){return R.unread?3.4:3.4+s.pass*8.6;};
 var S7=R.seats.slice().reverse();
 var L=[],Rr=[];
 S7.forEach(function(s){L.push([CH.x-half(s),chY(s.k)]);Rr.push([CH.x+half(s),chY(s.k)]);});
 L.unshift([CH.x-half(S7[0])*0.45,chY('crown')-8]);Rr.unshift([CH.x+half(S7[0])*0.45,chY('crown')-8]);
 L.push([CH.x-half(S7[6])*0.45,bot+8]);Rr.push([CH.x+half(S7[6])*0.45,bot+8]);
 var curve=function(A,dir){
  var d='';for(var i=1;i<A.length;i++){var p=A[i-1],q=A[i],my=(p[1]+q[1])/2;
   d+=' C'+P(p[0])+','+P(my)+' '+P(q[0])+','+P(my)+' '+P(q[0])+','+P(q[1]);}return d;};
 var dl='M'+P(L[0][0])+','+P(L[0][1])+curve(L), dr='M'+P(Rr[0][0])+','+P(Rr[0][1])+curve(Rr);
 var y0=chY('crown')-8,y1=bot+8;
 h+='<defs><linearGradient id="avxBank" gradientUnits="userSpaceOnUse" x1="0" y1="'+P(y0)+'" x2="0" y2="'+P(y1)+'">'
  +S7.map(function(s){return '<stop offset="'+P((chY(s.k)-y0)/(y1-y0)*100)+'%" stop-color="'+col(s.k)+'"/>';}).join('')
  +'</linearGradient></defs>';
 var bop=P(0.30+0.55*R.radiance);
 h+='<path d="'+dl+'" fill="none" stroke="url(#avxBank)" stroke-opacity="'+bop+'" stroke-width="1.6"'+NS+'/>'
  +'<path d="'+dr+'" fill="none" stroke="url(#avxBank)" stroke-opacity="'+bop+'" stroke-width="1.6"'+NS+'/>';
 /* the halo */
 h+='<ellipse cx="50" cy="'+P(chY('crown')-15)+'" rx="11" ry="3.2" fill="none" stroke="var(--crown)" stroke-opacity="'
  +P(R.unread?0.12:0.14+0.86*Math.sqrt(R.speed))+'" stroke-width="1.6"'+NS+'/>';
 h+=spine(R,chY,50);
 /* the combs */
 R.seats.forEach(function(s){
  var ns=R.nodes.filter(function(n){return n.k===s.k;}),y=chY(s.k),n=ns.length,gap=0.62,hw=half(s);
  ns.forEach(function(nd,j){
   var yy=y+(j-(n-1)/2)*gap, v=nd.sq/10;
   if(v>0)h+='<line x1="'+P(CH.x-hw-2.2)+'" y1="'+P(yy)+'" x2="'+P(CH.x-hw-2.2-0.6-v*9)+'" y2="'+P(yy)
    +'" stroke="'+col(s.k)+'" stroke-opacity="'+P(0.35+0.6*v)+'" stroke-width="1"'+NS+'/>';
   var lit=!!R.rec.addr[nd.i];
   h+='<line x1="'+P(CH.x+hw+2.2)+'" y1="'+P(yy)+'" x2="'+P(CH.x+hw+5.2)+'" y2="'+P(yy)
    +'" stroke="var(--ink)" stroke-opacity="'+(lit?'.85':'.12')+'" stroke-width="1"'+NS+'/>';});
  h+='<circle cx="50" cy="'+P(y)+'" r="2.7" fill="none" stroke="'+col(s.k)+'" stroke-opacity="'
   +P(R.unread?0.3:0.35+0.65*s.pass)+'" stroke-width="2"'+NS+'/>';});
 if(!R.unread&&!R.clear){var sd=R.seats.filter(function(s){return s.k===R.dk;})[0];
  h+=bracket(50,chY(R.dk),half(sd)+1.4,2.6);}
 return h+'</svg>';}

/* ---------------- four. the ring ----------------
   The seven seats closed into one ring, in the order and the orientation the
   Field wheel already draws them: root just right of the top, heart at the
   bottom, the crown coming back round to meet the root. Each seat's arc grows
   from its own middle as it conducts, so when every seat clears the ring
   closes. Charge ticks stand outside, the record ticks inside, the boot
   mark's own ring of address marks. CQ is the centre, because his own first
   drawing of a seven band ring was "a truncated CQ". */
function drawRing(R){
 var cx=50,cy=50,Rr=31,seg=TAU/7,gap=0.05,h='<svg class="avx-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The avatar as a ring of seven seats">';
 R.seats.forEach(function(s,i){
  var a0=-Math.PI/2+i*seg+gap,a1=-Math.PI/2+(i+1)*seg-gap,am=(a0+a1)/2,len=(a1-a0)*(R.unread?0:s.pass);
  h+='<path d="'+arcD(cx,cy,Rr,a0,a1)+'" fill="none" stroke="'+col(s.k)+'" stroke-opacity="'+P(0.10+0.22*R.radiance)+'" stroke-width="3.2"'+NS+'/>';
  if(len>0.004)h+='<path d="'+arcD(cx,cy,Rr,am-len/2,am+len/2)+'" fill="none" stroke="'+col(s.k)
   +'" stroke-width="3.2" stroke-linecap="round"'+NS+'/>';
  var ns=R.nodes.filter(function(n){return n.k===s.k;}),n=ns.length;
  ns.forEach(function(nd,j){
   var t=a0+(j+0.5)/n*(a1-a0),c=Math.cos(t),sn=Math.sin(t),v=nd.sq/10;
   if(v>0)h+='<line x1="'+P(cx+c*(Rr+3))+'" y1="'+P(cy+sn*(Rr+3))+'" x2="'+P(cx+c*(Rr+3.6+v*8))+'" y2="'+P(cy+sn*(Rr+3.6+v*8))
    +'" stroke="'+col(s.k)+'" stroke-opacity="'+P(0.35+0.6*v)+'" stroke-width="1"'+NS+'/>';
   var lit=!!R.rec.addr[nd.i];
   h+='<line x1="'+P(cx+c*(Rr-3))+'" y1="'+P(cy+sn*(Rr-3))+'" x2="'+P(cx+c*(Rr-5.4))+'" y2="'+P(cy+sn*(Rr-5.4))
    +'" stroke="var(--ink)" stroke-opacity="'+(lit?'.85':'.12')+'" stroke-width="1"'+NS+'/>';});
  if(!R.unread&&!R.clear&&s.k===R.dk)
   h+='<path d="'+arcD(cx,cy,Rr+14.5,a0+0.08,a1-0.08)+'" fill="none" stroke="var(--accent)" stroke-width="1.5"'+NS+'/>';});
 /* the centre */
 var cq=R.unread?0:R.CQ/100;
 h+=gauge(cx,cy,15,cq,'var(--ink)',1.6);
 h+='<text x="50" y="'+(R.tier?'52.6':'54')+'" text-anchor="middle" class="avx-cq">'+(R.unread?'–':Math.round(R.CQ))+'</text>';
 if(R.tier)h+='<text x="50" y="59.6" text-anchor="middle" class="avx-tier">'+R.tier+'</text>';
 return h+'</svg>';}

var DRAW={figure:drawFigure,nerves:drawNerves,channel:drawChannel,ring:drawRing};

/* ---------------- the words beside it ----------------
   The same on all four, so the drawings are compared and not the copy.
   Four cells, the layers his ruling sews: story, body, psyche, ritual. */
var IC={
 story:'M5 6.5h14M5 11h14M5 15.5h9M16.5 15l2.5 3.5',
 body:'M12 7.1v2.8M12 14.1v2.8M12 4.9m-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0M12 12m-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0M12 19.1m-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0',
 psyche:'M8.6 4.8a3.4 3.4 0 013.4 3.4v3.4a3.4 3.4 0 01-6.8 0V8.2a3.4 3.4 0 013.4-3.4M15.4 12.4a3.4 3.4 0 013.4 3.4a3.4 3.4 0 01-6.8 0a3.4 3.4 0 013.4-3.4',
 ritual:'M12 3.5v4M12 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0M12 12m-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M8 20.5h8'};
function ic(k){return '<svg viewBox="0 0 24 24" class="avx-ic" aria-hidden="true"><path d="'+IC[k]+'"/></svg>';}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function short(t,n){t=String(t||'');return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,'')+'…':t;}
function caption(R){
 if(R.unread)
  return '<div class="avx-cap"><div class="avx-read"><div class="avx-n"><b>–</b><span>Not read yet</span></div></div>'
   +'<p class="avx-lede">Dark until a story lights it.</p>'
   +'<button type="button" class="stbtn avx-door" data-start="story"><b>Write what happened</b>'
   +'<span>The day, in your own words. The engine reads the charge out of it.</span></button></div>';
 var h='<div class="avx-cap"><div class="avx-read">';
 if(ST.v!=='ring')h+='<div class="avx-n avx-big"><b>'+Math.round(R.CQ)+'</b><span>'+(R.tier||'Coherence')+'</span></div>';
 h+='<div class="avx-n" title="CQ times what the held charge leaves. A release moves this, and it can rise as far as CQ."><b>'
   +Math.round(R.EX)+'</b><span>Expression</span></div>'
  +'<div class="avx-n" title="Each seat conducts a share, and the channel is in series, so this is the seven multiplied."><b>'
   +Math.round(R.speed*100)+'<i>%</i></b><span>Reaches the crown</span></div>'
  +'<div class="avx-n" title="Addresses a release has reached. It only ever grows."><b>'+R.rec.n+'</b><span>Released</span></div></div>';
 h+='<ol class="avx-chain">'
  +'<li>'+ic('story')+'<span class="avx-k">Story</span><span class="avx-v">'+(R.story?'“'+esc(short(R.story,64))+'”':(R.clear?'Nothing held to trace':'No story lands on this seat'))+'</span></li>'
  +'<li>'+ic('body')+'<span class="avx-k">Body</span><span class="avx-v" style="--c:'+col(R.dk)+'">'+(R.clear?'Nothing held':'<em>'+NM[R.dk]+'</em>'+(R.place?', '+esc(R.place):''))+'</span></li>'
  +'<li>'+ic('psyche')+'<span class="avx-k">Psyche</span><span class="avx-v">'+(R.sab?esc(R.sab):'Nothing named yet')+'</span></li>'
  +'<li>'+ic('ritual')+'<span class="avx-k">Ritual</span><span class="avx-v">'+(R.rit?esc(R.rit.nm)+', '+R.rit.min+' minutes':'Nothing called')+'</span></li>'
  +'</ol></div>';
 return h;}

/* ---------------- the prototype's own controls ---------------- */
function ctl(){
 var n=ST.snaps.length-1;
 return '<div class="avx-ctl" role="group" aria-label="Prototype controls">'
  +'<span class="avx-tag">Prototype</span>'
  +'<div class="avx-seg" role="radiogroup" aria-label="Which avatar">'
  +VARIANTS.map(function(v,i){return '<button type="button" data-avx-v="'+v.k+'" aria-pressed="'+(ST.v===v.k)+'">'
   +'<small>'+v.grp+'</small>'+v.nm+'</button>';}).join('')
  +'<button type="button" data-avx-v="off" aria-pressed="false"><small>Shipped</small>The Field</button></div>'
  +'<div class="avx-seg avx-who" role="radiogroup" aria-label="Whose reading">'
  +['James','Angela','blank'].map(function(w){return '<button type="button" data-avx-who="'+w+'" aria-pressed="'+(ST.who===w)+'">'
   +(w==='blank'?'Nobody yet':w)+'</button>';}).join('')+'</div>'
  +'<label class="avx-runs">Releases <input type="range" min="0" max="'+n+'" step="1" value="'+Math.min(ST.runs,n)
  +'" aria-label="Release runs since arrival"><output>'+(ST.runs?ST.runs+' run'+(ST.runs>1?'s':''):'Arrival')+'</output></label>'
  +'</div>';}

function host(){
 var h=document.getElementById('avx');
 if(!h){h=document.createElement('div');h.id='avx';h.setAttribute('aria-live','polite');
  var cv=document.getElementById('cv');cv.parentNode.insertBefore(h,cv.nextSibling);}
 return h;}
function paint(){
 var on=ST.v!=='off';
 document.body.classList.toggle('avx-on',on);
 var h=host();
 if(!on){h.innerHTML='';var c=document.getElementById('avx-float');
  if(!c){c=document.createElement('div');c.id='avx-float';document.body.appendChild(c);}
  c.innerHTML=ctl();return;}
 var f=document.getElementById('avx-float');if(f)f.remove();
 var R=ST.snaps[Math.min(ST.runs,ST.snaps.length-1)];
 var V=VARIANTS.filter(function(v){return v.k===ST.v;})[0];
 h.setAttribute('data-v',ST.v);
 h.innerHTML=ctl()
  +'<div class="avx-stage"><div class="avx-fig">'+DRAW[ST.v](R)+'</div>'
  +'<div class="avx-side"><div class="avx-name"><b>'+V.nm+'</b><span>'+V.sub+'</span></div>'+caption(R)+'</div></div>';}
function set(k,v){
 if(k==='who'){ST.who=v;build(v);}
 else if(k==='runs'){ST.runs=v;settle();}
 else ST[k]=v;
 render();paint();
 document.documentElement.setAttribute('data-avx',ST.v+'|'+ST.who+'|'+ST.runs);}
document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('[data-avx-v],[data-avx-who]');if(!b)return;
 if(b.hasAttribute('data-avx-v'))set('v',b.getAttribute('data-avx-v'));
 else set('who',b.getAttribute('data-avx-who'));});
document.addEventListener('input',function(e){
 if(e.target.closest&&e.target.closest('.avx-runs'))set('runs',+e.target.value);});

function mount(o){
 o=o||{};
 ST.v=o.v||ST.v; ST.runs=+o.runs||0;
 setTab(TAB.FIELD);
 build(o.who||'James');
 render();paint();
 document.documentElement.setAttribute('data-avx',ST.v+'|'+ST.who+'|'+ST.runs);}
return {mount:mount,set:set,ST:ST,VARIANTS:VARIANTS,read:function(){return ST.snaps[Math.min(ST.runs,ST.snaps.length-1)];}};
})();
