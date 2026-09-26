
/* ============================================================
   THE GLASS BAR. DK in TASKS.md, revised on DR, DV, DY and ED, and ported
   out of proto/glassbar into the build on EV, because every one of those
   rounds was reported done while being true of the prototype alone. The
   Field he opened still carried the depth row, the renditions switch in the
   centre pane and the readings along the stage's foot, and his words for it
   were "you still have those when I'm on field ... I don't know why you're
   not adding this shit."

   His words for the bar: "it's glass, like Apple glass, it floats over the
   design and it has all of the iconography for the field and it can turn
   everything on and off, and this would be consistent across all the tools,
   saboteurs, complexes, hyper complexes, turn them all on and off." And: "I
   don't want that secondary navigation."

   WHAT IT REPLACES. The four depth words in the sub bar (VIEWS in
   ui/wheel.js), the renditions' ten layer row (FLAYS in ui/rings.js), and
   the Wheel, Frames, Dial switch in the stage's left lane, which is three
   circles at the head of the right rail now.

   WHAT IT DOES NOT TOUCH. compute() and everything under engine/. Every
   saboteur, complex and domain is still read on every frame exactly as
   before. The bar decides what is DRAWN, never what is READ: the layer model
   is layVisible in ui/wheel.js, and the wheel and both renditions ask it.

   PORTED, NOT REBUILT. The prototype reached the wheel by reading drawWheel
   as text, splicing a guard into each layer block and evaluating it back.
   The guards are written into drawWheel itself here, and the prototype's
   own questions panel is not carried, because each of its options is either
   ruled or still his to rule, named in the report.

   Loads after ui/rings.js, whose FLAYS and FVIEWS it draws its marks from,
   and before ui/panels.js, so it reaches for nothing declared later at load.
   getElementById and not $, which is a const in panels.js.
   ============================================================ */

/* ---- the marks. The product's own wherever it already had one ----
   The renditions' row for eight of them and the rail's stack tabs for the
   four chain tiers. One concept, one mark, on every surface. */
function fbFlay(k){var f=FLAYS.filter(function(x){return x.k===k;})[0];return f?f.d:'';}
/* the one mark the product did not have: the seven seats, up the body */
const FB_IC_SEAT='M12 7.1v2.8M12 14.1v2.8'+frCirc(12,4.9,2.2)+frCirc(12,12,2.2)+frCirc(12,19.1,2.2);
/* ADDRESSES GETS A NEW MARK, the one change to the product's own icons. Its
   renditions' mark, a hub with eight ticks, sat beside the wheel's hub with
   eight spokes and the laws' hub with seven, so three of the first nine
   icons in one row read as the same sun. The shell as the Field draws it is
   a ring cut into short segments, so that is the mark: twelve of them,
   against the domains' five long ones. */
const FB_IC_ADDR=frSegRing(12,8.2,13)+frCirc(12,12,1.6);
const FB_IC={zin:'M10.5 4.5a6 6 0 110 12 6 6 0 010-12M15 15l5 5M10.5 8v5M8 10.5h5',
 zout:'M10.5 4.5a6 6 0 110 12 6 6 0 010-12M15 15l5 5M8 10.5h5',
 zfit:'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M9.5 12a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0',
 layers:'M12 3.6l8.4 4.2-8.4 4.2-8.4-4.2zM3.6 12l8.4 4.2 8.4-4.2M3.6 16.2l8.4 4.2 8.4-4.2',
 depth:'M4 19.5h4.4v-4M8.4 15.5h4.2v-4M12.6 11.5h4.2v-4M16.8 7.5H21'};
/* THE FOUR DEPTHS' MARKS, moved here from ui/panels.js with the depth row
   that drew them. They are the depth menu's marks now. */
const VICON=[
 '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6"/>',
 '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 5.2v2.6M7.2 15.4l2.2-1.3M16.8 15.4l-2.2-1.3"/>',
 '<circle cx="12" cy="12" r="9.4"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.4"/>',
 '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3.6M12 18.4V22M2 12h3.6M18.4 12H22"/>'];

/* ---- the layers, one word each, in the order the rings sit ----
   The keys are LAYADD's in ui/wheel.js, which is the model; this is only
   what each one is called and drawn as. */
const FB_LAYERS=[
 {k:'addresses',g:'carry',nm:'Addresses',ic:FB_IC_ADDR,
  tip:'Your 112 addresses. Each mark is the charge held at one place.'},
 {k:'seats',g:'carry',nm:'Seats',ic:FB_IC_SEAT,
  tip:'The seven seats, Root to Crown, named round their own run of the ring.'},
 {k:'laws',g:'carry',nm:'Laws',ic:fbFlay('laws'),
  tip:'The twenty one laws, set by seat. Their sum is the number at the centre.'},
 {k:'gates',g:'carry',nm:'Gates',ic:fbFlay('gates'),
  tip:'The six gates round the core. Each higher gate sits across from the lower one it stands against.'},
 {k:'shadow',g:'carry',nm:'Shadow',ic:fbFlay('shadow'),
  tip:'The weight on all 112 addresses, as a wash behind everything.'},
 {k:'stories',g:'carry',nm:'Stories',ic:fbFlay('stories'),
  tip:'One line for each story that put charge on an address.'},
 {k:'saboteurs',g:'run',nm:'Saboteurs',ic:CHAINGLYPH.sab,
  tip:'The saboteurs running on the charge, threaded to the addresses that built them.'},
 {k:'complexes',g:'run',nm:'Complexes',ic:CHAINGLYPH.cx,
  tip:'Where saboteurs join. Each complex is built from the saboteurs outside it.'},
 {k:'hyper',g:'run',nm:'Hyper complexes',ic:CHAINGLYPH.hy,
  tip:'Where complexes join, one ring further in.'},
 {k:'character',g:'run',nm:'Character',ic:CHAINGLYPH.sup,
  tip:'The innermost layer. What the whole chain compounds into.'},
 {k:'archetypes',g:'run',nm:'Archetypes',ic:fbFlay('archetypes'),
  tip:'The twelve, each set in the seat it runs through.'},
 {k:'domains',g:'before',nm:'Domains',ic:fbFlay('domains'),
  tip:'The nineteen blueprint domains, what was there before any of it.'},
 {k:'masks',g:'before',nm:'Masks',ic:fbFlay('masks'),
  tip:'The six masks, each at its weight.'}];
var FB_BYK={}; FB_LAYERS.forEach(function(l){FB_BYK[l.k]=l;});
/* three clusters, kept apart by space alone. The names are for the folded
   panel and for a screen reader; the full row shows no words. */
const FB_GROUPS=[{k:'carry',nm:'What you carry'},{k:'run',nm:'What runs on it'},{k:'before',nm:'What was there before'}];

/* ON A PHONE THE FIRST TAP WOULD EXPLAIN AND THE SECOND WOULD ACT. That is the
   product's tooltip rule for every data-tip carrier on a coarse pointer, and
   it is right for a row that navigates. It is wrong for a toggle: the press is
   cheap, it undoes itself, and what it does is visible at once. So on a phone
   the bar carries no tooltip, every circle in the folded panel wears its
   name, and the panel's own line says what the last press did. */
var FB_COARSE=false;try{FB_COARSE=matchMedia('(pointer: coarse)').matches;}catch(e){}
function fbTip(b,t){if(FB_COARSE)b.removeAttribute('data-tip');else b.setAttribute('data-tip',t);}
function fbSvg(ic){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+glyphPath(ic)+'</svg>';}

/* ============================================================
   ONE OBJECT: a circle, the mark inside it, a ring round the rim carrying a
   real number off this person's reading, and that number in a small pill
   riding the lower right. Ruled on DR: "I'm not a fan of the pills as much
   as I used to be, they take up a lot of real estate. I want ... a circle and
   the icon inside of it, and the percent complete ring around it are the
   primary features, and then there's a pill to the lower right hand side with
   the percent or whatever the value is."
   ============================================================ */
function fbOrb(o){
 var b=document.createElement('button'); b.type='button'; b.className='fb-b';
 if(o.k)b.setAttribute('data-fb',o.k);
 b.setAttribute('aria-label',o.nm);
 if(!FB_COARSE)b.setAttribute('data-tip-t',o.nm); fbTip(b,o.tip||'');
 b.innerHTML='<span class="fb-orb"><svg class="fb-arc" viewBox="0 0 40 40" aria-hidden="true">'
  +'<circle class="trk" cx="20" cy="20" r="18"/>'
  +'<circle class="val" cx="20" cy="20" r="18" pathLength="100" stroke-dasharray="0 100"/></svg>'
  +'<span class="fb-gl">'+fbSvg(o.ic)+'</span>'
  +(o.val?'<span class="fb-v"></span>':'')+'</span>'
  +(o.label?'<span class="fb-nm">'+esc(o.nm)+'</span>':'');
 return b;}

/* ---- what each ring carries. Real numbers, read off compute() ----
   Where the product already prints a number for the thing, the ring prints
   the same number, so one concept keeps one figure across the Field: SQ, CQ
   and DQ are the readings' own, and the four chain tiers carry the rail's
   own running counts. Where the product had no number, Domains, Stories and
   Gates, the one chosen is said in the tooltip, and what to call each is
   still his question, DV in TASKS.md. */
var FB_VALS={};
function fbReach(list,carry){
 if(!carry.length)return 0;
 var s={}; list.forEach(function(o){leaves(o).forEach(function(x){s[x.i]=1;});});
 return carry.filter(function(n){return s[n.i];}).length/carry.length*100;}
function fbValues(r){
 var V={}, dash='–', carry=W.filter(function(n){return n.sq>=4;});
 var f1=function(x){return (+x||0).toFixed(1);}, pc=function(x){return Math.round(+x||0)+'%';};
 V.addresses={p:r.SQm*10,v:f1(r.SQm),c:seatCol(r.darkB),
  m:'Ring and number: segment depth, SQ, '+f1(r.SQm)+' of 10. How deep the held charge sits.'};
 V.seats={p:(r.darkV||0)*10,v:f1(r.darkV),c:seatCol(r.darkB),
  m:'Ring and number: the heaviest seat, '+r.darkB+', at '+f1(r.darkV)+' of 10.'};
 V.laws={p:r.CQ,v:pc(r.CQ),c:seatCol('Crown'),
  m:'Ring and number: coherence, CQ, which is the laws summed.'};
 var G=verpRead(), hi=G.filter(function(g){return g.side==='higher';}).reduce(function(a,g){return a+g.pct;},0),
  anyG=G.some(function(g){return g.pct>0;});
 V.gates={p:anyG?hi:0,v:anyG?pc(hi):dash,c:seatCol('Heart'),
  m:anyG?'Ring and number: how much of what you wrote ran through the three higher gates.'
   :'No story has run through a gate yet.'};
 V.shadow={p:r.DQ,v:pc(r.DQ),c:seatCol('Root'),
  m:'Ring and number: shadow weight, DQ, the weight on all 112 addresses.'};
 var ai=atomIndex()||{}, traced=carry.length?carry.filter(function(n){return (ai[n.i]||[]).length;}).length/carry.length*100:0;
 V.stories={p:traced,v:carry.length?pc(traced):dash,c:'var(--accent)',
  m:carry.length?'Ring and number: the share of your carrying addresses a story you wrote reached.'
   :'Nothing is carrying charge yet.'};
 [['saboteurs',r.sabs,r.sabs[0]&&r.sabs[0].parts[0]?r.sabs[0].parts[0].b:r.darkB],
  ['complexes',r.cxs,'Solar'],['hyper',r.hys,'Sacral'],['character',r.sups,'Root']].forEach(function(t){
  var p=fbReach(t[1],carry);
  V[t[0]]={p:p,v:String(t[1].length),c:seatCol(t[2]),
   m:'Number: how many are running, as the rail counts them. Ring: the share of your carrying addresses they are built on, '+pc(p)+'.'};});
 var aff=(r.aff||[]).map(function(v,i){return {i:i,v:v};}).sort(function(a,b){return b.v-a.v;});
 var tot=aff.reduce(function(a,x){return a+x.v;},0)||1, top=aff[0]||{i:0,v:0}, A=ARCH[top.i]||{};
 V.archetypes={p:top.v/tot*100,v:pc(top.v/tot*100),c:seatCol(A.b||'Heart'),
  m:'Ring and number: '+(A.nm||'the first archetype')+', the first archetype, as its share of how the blueprint expresses.'};
 /* the root's colour off the one ladder every other surface reads, rootPlain,
    and not ROOTCOL, which is the Dark values on every lighting */
 var dm=DOMAIN.reduce(function(a,v){return a+v;},0)/DOMAIN.length*100, d0=DOMAINS[S.doms[0]];
 V.domains={p:dm,v:pc(dm),c:(d0&&rootPlain(d0.r))||'var(--gold)',
  m:'Ring and number: how far across the nineteen domains your blueprint reaches.'};
 var mk=(r.maskRing||[]).slice().sort(function(a,b){return b.w-a.w;})[0];
 V.masks={p:mk?mk.w*10:0,v:mk?f1(mk.w):dash,c:'var(--gold)',
  m:mk?'Ring and number: the heaviest mask, '+mk.nm+', at '+f1(mk.w)+' of 10.':'No mask carries weight yet.'};
 /* NOTHING READ, NOTHING PRINTED. The rail's own rule: the ring draws empty
    and the pill carries a dash, because a figure beside "not read yet" is
    the contradiction the words exist to prevent. */
 if(r.unread)Object.keys(V).forEach(function(k){V[k]={p:0,v:dash,c:V[k].c,m:'Nothing read yet.'};});
 Object.keys(V).forEach(function(k){V[k].p=Math.max(0,Math.min(100,+V[k].p||0));});
 return V;}

/* ---- the hosts, which are in the markup so the bar cannot vanish with a
   failed script, and the pieces built into them once ---- */
var FB=null, FB_PANEL=null, FB_MENU=null, FB_FOLD=null, FB_SAY=null, FB_ZOOM=null, FB_VIEW=null;
function fbCluster(g,label){
 var c=document.createElement('div'); c.className='fb-grp';
 c.setAttribute('role','group'); c.setAttribute('aria-label',g.nm);
 FB_LAYERS.filter(function(l){return l.g===g.k;}).forEach(function(l){
  var b=fbOrb({k:l.k,nm:l.nm,ic:l.ic,tip:l.tip,label:label,val:true});
  b.addEventListener('click',function(){fbToggle(l.k);});
  c.appendChild(b);});
 return c;}
/* A PINNED THING WHOSE LAYER HAS GONE OFF IS LET GO, or the rest of the web
   would stay dimmed around something no longer drawn */
const FB_PINK={node:'addresses',seat:'seats',law:'laws',gate:'gates',atom:'stories',sab:'saboteurs',
 cx:'complexes',hy:'hyper',sup:'character',arch:'archetypes',dom:'domains',mk:'masks'};
function fbUnpin(){var p=S.pin;if(!p)return;
 var k=FB_PINK[p.kind]||(p.sq!==undefined&&p.b?'addresses':null);
 if(k&&!layerOn(k))S.pin=null;}
function fbToggle(k){layToggle(k); fbUnpin(); fbSay(k); render();}
function fbSay(k){if(!FB_SAY)return;var l=FB_BYK[k],v=FB_VALS[k],on=layerOn(k);
 var wait=on&&k==='stories'&&FVIEW==='wheel'&&atomA()<=0;
 FB_SAY.innerHTML='<b>'+esc(l.nm)+(on?' on.':' off.')+'</b> '+esc(l.tip)
  +(wait?' They draw once you scroll in on the ring.':'')+(v?' '+esc(v.m):'');}

(function(){
 FB=document.getElementById('fbar'); if(!FB)return;
 /* the layers, three clusters, the full row */
 var full=document.createElement('div'); full.className='fb-full';
 FB_GROUPS.forEach(function(g){full.appendChild(fbCluster(g,false));});
 FB.appendChild(full);
 /* the folded form: one circle that opens the same three clusters as a panel.
    The full row folds when it does not fit rather than scrolling sideways
    with its end cut off, which was the depth row's defect at 390: Blueprint
    sat past the edge with nothing saying it was there. */
 var fold=document.createElement('div'); fold.className='fb-grp fb-foldp';
 FB_FOLD=fbOrb({k:'fold',nm:'Layers',ic:FB_IC.layers,tip:'Every layer on the Field, each one on or off.'});
 FB_FOLD.setAttribute('aria-expanded','false'); FB_FOLD.setAttribute('aria-controls','fbpanel');
 FB_FOLD.addEventListener('click',function(e){e.stopPropagation();fbOpenPanel(FB_PANEL.hidden);});
 fold.appendChild(FB_FOLD); FB.appendChild(fold);
 /* the ladder, as four presets behind one circle */
 var dp=document.createElement('div'); dp.className='fb-grp';
 var db=fbOrb({k:'depth',nm:'Depth',ic:FB_IC.depth,
  tip:'Four starting sets, each one the last plus a layer: Charge, Patterns, Chains, Blueprint.'});
 db.setAttribute('aria-haspopup','menu'); db.setAttribute('aria-expanded','false');
 db.addEventListener('click',function(e){e.stopPropagation();fbOpenMenu(FB_MENU.hidden);});
 dp.appendChild(db); FB.appendChild(dp);
 /* ZOOM, ON EVERY PICTURE. His words, for Frames: "I want to be able to zoom
    in and out, and then hit the F key and have it reframe." The wheel already
    zoomed by scroll and reframed on F with no control you could see; the
    same three sit at the end of the bar for all three pictures, and the
    reframe circle's ring and pill carry how far in you are. */
 /* AND THEY LEFT THE BAR FOR #fzoom, EZ in TASKS.md, so that the bar and the
    Wheel, Frames and Dial overlay can both hold the top of the stage without
    the bar folding at 1600. Same three circles, same glass, same keys; only
    the host moved, and #fzoom carries the group's role and name itself. */
 FB_ZOOM=document.getElementById('fzoom');
 var end=document.createElement('div'); end.className='fb-grp';
 [['zout','Zoom out',FB_IC.zout,'Move out. Or press minus.',function(){fieldZoomBy(1/1.25);}],
  ['zin','Zoom in',FB_IC.zin,'Move in. Or press plus. Scrolling on the picture does the same, and a drag moves it.',function(){fieldZoomBy(1.25);}],
  ['zfit','Reframe',FB_IC.zfit,'Back to the whole picture. Or press F.',function(){fieldReframe();}]].forEach(function(z){
  var b=fbOrb({k:z[0],nm:z[1],ic:z[2],tip:z[3],val:z[0]==='zfit'});
  b.addEventListener('click',function(e){e.stopPropagation();z[4]();});
  end.appendChild(b);});
 (FB_ZOOM||FB).appendChild(end);
 /* arrow keys walk the bar, the way a toolbar should */
 FB.addEventListener('keydown',function(e){
  if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
  var all=[].slice.call(FB.querySelectorAll('.fb-b')).filter(function(b){return b.offsetParent;});
  var i=all.indexOf(document.activeElement); if(i<0)return;
  all[(i+(e.key==='ArrowRight'?1:all.length-1))%all.length].focus(); e.preventDefault();});

 FB_PANEL=document.getElementById('fbpanel');
 if(FB_PANEL){
  FB_GROUPS.forEach(function(g){
   var h=document.createElement('div'); h.className='fb-ph'; h.textContent=g.nm; FB_PANEL.appendChild(h);
   FB_PANEL.appendChild(fbCluster(g,true));});
  FB_SAY=document.createElement('p'); FB_SAY.className='fb-say'; FB_SAY.setAttribute('role','status');
  FB_SAY.setAttribute('aria-live','polite');
  FB_SAY.textContent='Each one on or off. What is off is still read, only not drawn.';
  FB_PANEL.appendChild(FB_SAY);
  var done=document.createElement('button'); done.type='button'; done.className='fb-done'; done.textContent='Done';
  done.addEventListener('click',function(){fbOpenPanel(false);});
  FB_PANEL.appendChild(done);
  FB_PANEL.addEventListener('click',function(e){e.stopPropagation();});}

 FB_MENU=document.getElementById('fbmenu');
 if(FB_MENU)VIEWS.forEach(function(v,i){
  var m=document.createElement('button'); m.type='button'; m.className='fb-mi'; m.setAttribute('role','menuitemradio');
  m.setAttribute('data-preset',i);
  m.innerHTML='<span class="fb-ic">'+fbSvg(VICON[i])+'</span><span class="fb-mt"><b>'+esc(v.nm)+'</b><span>'+esc(v.tip)+'</span></span>';
  m.addEventListener('click',function(e){e.stopPropagation();layPick(i);S.pin=null;fbOpenMenu(false);render();});
  FB_MENU.appendChild(m);});

 /* WHEEL, FRAMES, DIAL, icon only. Ruled in two steps, DR then DY: "it's
    taking up too much real estate being on the centre pane ... I don't need
    the text, just make it the icon," and then "move that to the secondary
    nav on the right hand side." It stood in the right rail on that reading,
    and EZ is him looking straight at it there and asking where it was, "On
    my right hand side overlay ... opposite of the overlay items that you
    have on the upper left." So it is the overlay in the stage's upper right
    now, the glass bar's mirror. A rendition has no reading, so it carries no
    pill, and its ring is whole when it is the one up. fviewPaint in
    ui/rings.js marks which. */
 var sw=FB_VIEW=document.getElementById('fview');
 if(sw)FVIEWS.forEach(function(f){
  var b=fbOrb({nm:f.nm,ic:f.ic,tip:f.tip});
  b.setAttribute('data-fview',f.k); b.setAttribute('aria-pressed',f.k===FVIEW);
  b.addEventListener('click',function(){fviewSet(f.k);});
  sw.appendChild(b);});

 document.addEventListener('click',function(){fbOpenPanel(false);fbOpenMenu(false);});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){fbOpenPanel(false);fbOpenMenu(false);}});
 addEventListener('scroll',function(){if(FB_MENU&&!FB_MENU.hidden)fbOpenMenu(false);
  if(FB_PANEL&&!FB_PANEL.hidden&&!FB_PANEL.classList.contains('sheet'))fbOpenPanel(false);},true);
 addEventListener('resize',function(){FB_FIT=-1;fbFit();fbOpenPanel(false);fbOpenMenu(false);});})();

/* ---- THE OVERLAYS ARRIVE WITH THE WHEEL. EZ in TASKS.md: "I want to be able
   to see the animations on these." The circles on the stage were simply
   there when the Field opened, while the wheel under them assembled seat by
   seat. Each one now rises into place and its ring draws round to its value,
   left to right along the bar, then the switch, then zoom, on the stage's own
   step, and all of it inside the wheel's ENTER_TOTAL.

   Once a session, on enterStart's ruling: "as a one time event." The class
   comes off when the last one lands, because a keyframe restarts whenever
   its element comes back from display:none, and leaving it on would replay
   the whole entrance on every return to the Field. Reduced motion never adds
   it; the sheet's own reduced motion rule would stop it anyway. ---- */
var FB_ENTERED=false;
const FB_ENTER_STEP=34;
function fbEnter(){
 if(FB_ENTERED||REDUCED)return; FB_ENTERED=true;
 var hosts=[FB,FB_VIEW,FB_ZOOM].filter(function(h){return h&&h.offsetParent;}), n=0;
 hosts.forEach(function(h){
  [].slice.call(h.querySelectorAll('.fb-b')).filter(function(b){return b.offsetParent;})
   .forEach(function(b){b.style.setProperty('--i',n++);});
  /* held at their first frame while the boot sheet is up, component.js */
  h.classList.add('fb-enter'); h.classList.toggle('fb-hold',!isBooted());});
 afterBoot(function(){
  hosts.forEach(function(h){h.classList.remove('fb-hold');});
  setTimeout(function(){hosts.forEach(function(h){h.classList.remove('fb-enter');});},
   n*FB_ENTER_STEP+ENTER_SPAN+120);});}

/* ---- the floats, anchored under their circle inside the stage's width ---- */
function fbPhone(){return innerWidth<=720;}
function fbPlace(el,anchor){
 var st=document.getElementById('stage').getBoundingClientRect(), a=anchor.getBoundingClientRect();
 el.style.top=(a.bottom+10)+'px'; el.style.left='0px'; el.style.maxWidth=(st.width-24)+'px';
 var w=el.offsetWidth, left=Math.max(st.left+12,Math.min(a.left,st.right-w-12));
 el.style.left=left+'px';}
/* ON A PHONE THE PANEL IS A SHEET ALONG THE FOOT, AND THE PICTURE IS BROUGHT UP
   ABOVE IT. Dropped under its circle it covered the whole ring at 390, so a
   press changed a picture nobody could see, which is a dead control with
   extra steps. */
function fbRingUp(){var pic=document.getElementById(FVIEW==='wheel'?'cv':'frend');if(!pic)return;
 var r=pic.getBoundingClientRect(), room=innerHeight-FB_PANEL.offsetHeight-16;
 if(r.top>=8&&r.bottom<=room)return;
 var by=r.top-Math.max(8,(room-r.height)/2);
 var sc=document.scrollingElement, b=document.body;
 if(b.scrollHeight>b.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(b).overflowY))b.scrollBy(0,by);
 else sc.scrollBy(0,by);}
function fbOpenPanel(on){if(!FB_PANEL||!FB_FOLD)return;
 if(on)fbOpenMenu(false);
 FB_PANEL.hidden=!on; FB_PANEL.classList.toggle('sheet',on&&fbPhone());
 FB_FOLD.setAttribute('aria-expanded',String(on));
 if(on){if(fbPhone()){FB_PANEL.style.top='';FB_PANEL.style.left='';FB_PANEL.style.maxWidth='';fbRingUp();}
  else fbPlace(FB_PANEL,FB_FOLD);}}
function fbOpenMenu(on){if(!FB_MENU||!FB)return;
 if(on)fbOpenPanel(false);
 FB_MENU.hidden=!on;
 var db=FB.querySelector('[data-fb=depth]'); if(!db)return;
 db.setAttribute('aria-expanded',String(on));
 if(on)fbPlace(FB_MENU,db);}

/* ---- the full row or the folded one, measured only when the width moves,
   because measuring means taking the fold off for a frame ---- */
var FB_FIT=-1;
function fbFit(){
 if(!FB)return;
 /* ONLY A BAR THAT IS ON SCREEN IS MEASURED. The first render at boot runs
    before setTab puts the Field's class on the body, so the bar was
    display:none, measured nothing, fitted, and cached that width: at 390 the
    full row then ran off the edge for the rest of the session. */
 if(!FB.offsetParent)return;
 /* AND THE UPPER RIGHT IS THE SWITCH'S, EZ. The bar fits in what is left
    beside it, with one bar gap between, or it folds; measured off the switch
    itself, because its width is the sheet's to decide. */
 var st=document.getElementById('stage'), vw=FB_VIEW&&FB_VIEW.offsetParent?FB_VIEW.offsetWidth+12:0,
  avail=st?st.clientWidth-28-vw:0;
 if(avail<=0||avail===FB_FIT)return;
 FB_FIT=avail;
 FB.classList.remove('folded');
 var fold=FB.scrollWidth>avail;
 FB.classList.toggle('folded',fold);
 if(!fold)fbOpenPanel(false);}

/* ---- read, then paint. render() hands over the reading it just took ---- */
function fbRead(r){
 try{FB_VALS=fbValues(r);}catch(e){FB_VALS={};}
 fbFit(); fbPaint();}
/* every object from the state, one writer */
function fbPaint(){
 if(!FB)return;
 var on=layChosen(), rc=layReached(), wheel=FVIEW==='wheel', atomsOut=atomA()<=0;
 /* THE GLASS TAKES THE TONE OF WHAT IT LIES ON, NOT OF THE THEME'S NAME.
    Under Snow the panels are light and the stage keeps the ruled #101010, so
    glass made of the panel colour was a grey slab on a black field, measured
    on the prototype's lighting sweep. stageLight() is the one reading of
    that ground, the one the wheel's domain ring and the renditions use. */
 var lt=stageLight();
 [FB,FB_PANEL,FB_MENU,FB_ZOOM,FB_VIEW].forEach(function(x){if(x)x.classList.toggle('fb-lt',lt);});
 document.body.classList.toggle('noshadow',!layerOn('shadow'));
 [FB,FB_PANEL].forEach(function(host){if(!host)return;
  host.querySelectorAll('[data-fb]').forEach(function(b){
   var k=b.getAttribute('data-fb'), l=FB_BYK[k]; if(!l)return;
   var isOn=!!on[k], z=!isOn&&!!rc[k], V=FB_VALS[k];
   b.setAttribute('aria-pressed',String(isOn));
   b.classList.toggle('on',isOn); b.classList.toggle('zoomed',z);
   if(V){b.querySelector('.fb-orb').style.setProperty('--c',V.c);
    b.querySelector('.val').setAttribute('stroke-dasharray',V.p.toFixed(1)+' 100');
    var pv=b.querySelector('.fb-v'); if(pv)pv.textContent=V.v;}
   /* Stories on the wheel are drawn out along each address, past the ring,
      and only once it has been brought close. On, and waiting for that, is
      said on the circle, not hidden. */
   var wait=isOn&&k==='stories'&&wheel&&atomsOut;
   b.classList.toggle('wait',wait);
   fbTip(b,l.tip+(V?' '+V.m:'')+(wait?' On. They draw once you scroll in on the ring.':'')
    +(z?' Brought in by zoom. Zoom out and it goes again.':''));});});
 var zf=(FB_ZOOM||FB).querySelector('[data-fb=zfit]');
 if(zf){var zn=fieldZoom(),zp=(zn.s-1)/(zn.max-1)*100;
  zf.querySelector('.val').setAttribute('stroke-dasharray',Math.max(0,Math.min(100,zp)).toFixed(1)+' 100');
  zf.querySelector('.fb-v').textContent=zn.s.toFixed(1)+'×';
  zf.classList.toggle('on',zn.s>1.001);}
 var cur=LAYSET?-1:(S.view|0);
 if(FB_MENU)FB_MENU.querySelectorAll('[data-preset]').forEach(function(m){
  m.setAttribute('aria-checked',String(+m.getAttribute('data-preset')===cur));});
 var db=FB.querySelector('[data-fb=depth]');
 if(db){db.classList.toggle('on',cur>=0);
  db.querySelector('.val').setAttribute('stroke-dasharray',(cur>=0?100:0)+' 100');
  fbTip(db,'Four starting sets, each one the last plus a layer. '
   +(cur>=0?'This is '+VIEWS[cur].nm+'.':'What is on now is your own set.'));}}
