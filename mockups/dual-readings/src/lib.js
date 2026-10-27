/* ============================================================
   DUAL READINGS, the shared half of four mockups. Design exploration only:
   nothing here is wired into atuned_src/ or source.html.

   EVERY FIGURE IS READ OFF THE BUILD, NOT TYPED FOR LOOKS. Sampled 27 October
   from the committed HEAD build (87dd2cdf) through the real compute(),
   leanRead(), leanSwing(), cqRange(), balance and flSeats(), for every one of
   PEOPLE. Five are carried here, and the blank profile.

   PORTED, NOT REBUILT. rbDrift is ui/component.js's own; the field lean is
   leanSwing's (ui/ui.js) with the trust every sampled person has, nought; the
   seat passes are rbSeatPass(), root first; flow is their product, flSpeed;
   rbWavePts is copied whole. The rounding is pct()'s, engine/pct.js.
   ============================================================ */
var PAL={'Root':'#D6524C','Sacral':'#D8924E','Solar':'#DABF6A','Heart':'#5FD5A6',
 'Throat':'#5EBBDB','3rd Eye':'#7D93E0','Crown':'#A77EDB'};
var ACCENT='#7EB8D4', LIGHT='#E9E2CF';
var BANDS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
var PLACE={'Root':'the base of the spine','Sacral':'below the navel','Solar':'the stomach','Heart':'the chest',
 'Throat':'the throat','3rd Eye':'between the brows','Crown':'the top of the head'};
var ENTER_SPAN=380, ENTER_STAGGER=62, HEAD=700;

var PEOPLE_D=[
 {id:'diane',nm:'Diane',age:46,role:'founder, second company',CQ:59.0,cqlo:55.5,cqhi:62.4,DQ:19.7,pos:100,masc:54.3,
  X:24,Y:64,Z:33,rad:44,hot:[[0,16],[1,16],[7,16],[0,15],[0,12],[0,12],[0,21]],pass:[1,.957,.747,1,1,1,1]},
 {id:'derek',nm:'Derek',age:39,role:'high performer, endurance',CQ:48.5,cqlo:43.8,cqhi:53.2,DQ:26.2,pos:97,masc:52.1,
  X:24,Y:42,Z:24,rad:31,hot:[[3,16],[5,16],[7,16],[0,15],[5,12],[0,12],[0,21]],pass:[.86,.77,.70,1,.75,1,1]},
 {id:'ana',nm:'Ana',age:47,role:'teacher, one year out',CQ:37.0,cqlo:30.6,cqhi:43.4,DQ:37.4,pos:74,masc:45.8,
  X:15,Y:21,Z:16,rad:18,hot:[[2,16],[11,16],[14,16],[8,15],[3,12],[0,12],[3,21]],pass:[.922,.459,.323,.531,.837,1,.915]},
 {id:'tomas',nm:'Tomas',age:58,role:'long haul driver, off the road fourteen months',CQ:3.6,cqlo:0,cqhi:16.9,DQ:59.3,pos:7,masc:45.6,
  X:1,Y:2,Z:1,rad:2,hot:[[14,16],[13,16],[16,16],[12,15],[7,12],[12,12],[21,21]],pass:[.05,.36,.22,.46,.64,.18,.054]},
 {id:'wren',nm:'Wren',age:66,role:'luthier, forty one years at the bench',CQ:91.1,cqlo:89.8,cqhi:92.5,DQ:3.8,pos:100,masc:30.3,
  X:76,Y:98,Z:59,rad:79,hot:[[2,16],[0,16],[0,16],[0,15],[0,12],[0,12],[0,21]],pass:[.93,1,1,1,1,1,1]},
 {id:'blank',nm:'Not read yet',age:null,role:'a profile with nothing entered',unread:true}];

/* ---------- the icons. ring, never fill, on the 24 unit grid ---------- */
var IC={
 cq:'<path d="M3 9c3-3.5 6 3.5 9 0s6 3.5 9 0M3 15c3-3.5 6 3.5 9 0s6 3.5 9 0"/>',
 dq:'<path d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17M4.2 14.2h15.6"/>',
 /* the self-read shadow: CQ's other half, so the shadow ring split where CQ ends */
 shadow:'<path d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17M12 3.5v17M12 8.5l4.2-3.4M12 13l6.6-5M12 17.5l7.6-6"/>',
 halo:'<path d="M4 12 A8 3.4 0 1 0 20 12 A8 3.4 0 1 0 4 12"/>',
 fork:'<path d="M12 21V9M6 9V3.5M12 9V3M18 9V3.5M5 9h14"/>',
 masc:'<circle cx="10" cy="14" r="6"/><path d="M14.5 9.5L20 4M15.5 4H20v4.5"/>',
 fem:'<circle cx="12" cy="9" r="6"/><path d="M12 15v7M8.5 19h7"/>',
 vitality:'<path d="M12 21v-8M12 13c0-3.4 2.4-6 5.6-6.4C17.2 10 15 12.6 12 13M12 13c0-2.8-2-5-4.7-5.4C7.7 10.4 9.6 12.4 12 13M9 21h6"/>',
 awareness:'<path d="M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17M12 3.5L17.8 9.3M20.5 12h-8.2M17.8 14.7L12 20.5M6.2 14.7L12 8.9M3.5 12h8.2M6.2 9.3L12 15.1"/>',
 will:'<path d="M12 21V4M12 4l-4 4M12 4l4 4M5 13.5h3.2M15.8 13.5H19"/>',
 flow:'<path d="M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8"/>',
 rad:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 /* the two families' own marks: a centre line with a mark off it, and a run from
    an end with a mark along it */
 lean:'<path d="M12 3.5v17M3.5 12h17"/><circle cx="16.5" cy="12" r="2.4"/>',
 amount:'<path d="M3.5 7v10M3.5 12h11.5"/><circle cx="17.4" cy="12" r="2.4"/><path d="M20.5 12h0"/>',
 info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.1"/>',
 chevL:'<path d="M14.5 6l-6 6 6 6"/>', chevR:'<path d="M9.5 6l6 6-6 6"/>'};
function ic(k,cls,extra){return '<svg class="ic '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true"'+(extra||'')+'>'+(IC[k]||'')+'</svg>';}

/* ---------- the meaning of every word, said where the word is ---------- */
var SAY={
 groupA:'Each pair is one reading. The line down the middle is 50 and 50, and the mark is where you sit.',
 groupB:'Each is one reading, from none of it at the left end to all of it at the right.',
 coherence:'Your answers to the 21 laws, read as CQ against the shadow they leave. The two always make 100. Under 50, your field starts to lean negative.',
 CQ:'CQ is the Laws of Moral Integrity added up, the integrity that coherence is built on.',
 Shadow:'Shadow, on this line, is the part of the laws your answers leave out.',
 orientation:'Orientation is which way the charge you hold leans, toward costing you nothing or toward taking something from you. 50 is even.',
 Positive:'Positive is charge you hold that is not costing you anything.',
 Negative:'Negative is charge you hold that is taking something from you.',
 balance:'Balance is which way your body moves under what you feel, out toward the world or in toward yourself. 50 is even.',
 Masculine:'Masculine is energy given a shape and a direction and sent outward, and it does not mean men.',
 Feminine:'Feminine is energy held and taken inward, and it does not mean women.',
 DQ:'DQ is your shadow weight: all the charge you carry, on every address, against the most your body could hold.',
 Vitality:'Vitality is how much energy you have left once apathy and the charge you carry have taken their share.',
 Awareness:'Awareness is how strong what you mean is, and how little of it gets bent on the way out. Drawn as an aperture: the wider it opens, the more gets through.',
 Will:'Will is your willpower: how much of your integrity gets through the charge you are carrying.',
 Radiance:'Radiance is vitality, awareness and will put together, and it sets how bright the field behind the wheel is.',
 Flow:'Flow is how much gets from the base of your spine to the top of your head. Each seat passes on part of what reaches it and holds the rest back. Held back is collapsed. The seat holding back the most is where you are blocked.'};

/* ---------- arithmetic that already exists ---------- */
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function pct(v){return Math.round(clamp(v,0,100));}
function fmt(v,unread){var p=pct(v);return (unread||!p)?'–':p+'%';}
function rbDrift(t){return Math.sin(t*0.55)*0.62+Math.sin(t*0.23+1.1)*0.38;}
/* the field's share of the lean, leanSwing's fm(): nothing at 50 and over */
function fieldNeg(cq){return cq>=50?0:(50-cq)/50*100;}
function e3(x){return x<=0?0:x>=1?1:1-Math.pow(1-x,3);}
/* a rise throws past and settles inside the head's 700ms, rbFx's spring */
function spring(k){if(k<=0)return 0; if(k>=1)return 1; var ts=k*HEAD/1000; return 1-Math.cos(13*ts)*Math.exp(-7.5*ts)*(1-k);}
function cumPass(pass){var c=1;return pass.map(function(v){c*=v;return c;});}
function flowOf(p){return p.unread?0:cumPass(p.pass)[6]*100;}
/* WHERE FLOW IS BLOCKED, by the engine's own rule and not a new one. A seat is
   held when at least two of its addresses, and at least 28 percent of them,
   are carrying (flSeats, ui/map.js: hot>=max(2,tot*0.28)). Blocked is the held
   seat that passes on the least. A person with no held seat is not blocked
   anywhere, even when a little is lost: round 2 caught "blocked at Root" on a
   root holding back 7 percent with two addresses of sixteen carrying. */
function heldOf(p,i){var h=p.hot&&p.hot[i];return !!h&&h[0]>=Math.max(2,h[1]*0.28);}
function blockOf(p){if(p.unread)return -1;var i=-1;p.pass.forEach(function(v,j){if(heldOf(p,j)&&(i<0||v<p.pass[i]))i=j;});return i;}

/* THE THREE PAIRS. Each is whole: the left share and the right share make
   100. x is the mark's place from the left end, which is the right pole's
   share. The left share is rounded the registry's way and the right is its
   complement, so the two printed figures always make 100. */
function pairsOf(p){
 var u=!!p.unread;
 var mk=function(k,nm,L,R,left,band,drift){
  var l=u?50:clamp(left,0,100), lr=pct(l), rr=100-lr;
  return {k:k,nm:nm,L:L,R:R,unread:u,left:l,x:100-l,lr:lr,rr:rr,band:band,drift:drift,
   side:u?0:lr>rr?-1:rr>lr?1:0};};
 var half=u?0:(p.cqhi-p.cqlo)/2;
 return [
  mk('coherence','Coherence',{nm:'CQ',ic:'cq',c:ACCENT},{nm:'Shadow',ic:'shadow',c:PAL.Root},u?50:p.CQ,
   u?null:[100-p.cqhi,100-p.cqlo], u||half<.05?null:function(t){return 100-clamp(p.CQ+rbDrift(t)*half,0,100);}),
  mk('orientation','Orientation',{nm:'Positive',ic:'halo',c:PAL.Heart},{nm:'Negative',ic:'fork',c:PAL.Root},u?50:p.pos,
   (function(){if(u)return null;var a=fieldNeg(p.cqhi),b=fieldNeg(p.cqlo);return b-a>.05?[100-p.pos+(a-fieldNeg(p.CQ)),100-p.pos+(b-fieldNeg(p.CQ))]:null;})(),
   (function(){if(u)return null;var a=fieldNeg(p.cqhi),b=fieldNeg(p.cqlo);if(b-a<=.05)return null;
    return function(t){return clamp(100-p.pos+fieldNeg(clamp(p.CQ+rbDrift(t)*half,0,100))-fieldNeg(p.CQ),0,100);};})()),
  /* balance holds still: nothing in the engine moves it between readings */
  mk('balance','Balance',{nm:'Masculine',ic:'masc',c:PAL.Solar},{nm:'Feminine',ic:'fem',c:PAL.Throat},u?50:p.masc,null,null)];}
function leanWords(P){
 if(P.unread)return {w:'Not read yet',f:'–',dir:0};
 if(P.side===0)return {w:'Even',f:'50%',dir:0};
 var s=P.side<0?P.L:P.R; return {w:s.nm,f:(P.side<0?P.lr:P.rr)+'%',dir:P.side};}

/* THE SIX AMOUNTS */
function amountsOf(p){
 var u=!!p.unread;
 return [
  {k:'DQ',nm:'DQ',ic:'dq',c:PAL.Root,v:u?0:p.DQ,bad:true},
  {k:'Vitality',nm:'Vitality',ic:'vitality',c:PAL.Solar,v:u?0:p.X},
  {k:'Awareness',nm:'Awareness',ic:'awareness',c:PAL['3rd Eye'],v:u?0:p.Y},
  {k:'Will',nm:'Will',ic:'will',c:PAL.Throat,v:u?0:p.Z},
  {k:'Radiance',nm:'Radiance',ic:'rad',c:LIGHT,v:u?0:p.rad},
  {k:'Flow',nm:'Flow',ic:'flow',c:null,v:flowOf(p),pass:u?[1,1,1,1,1,1,1]:p.pass,block:blockOf(p)}].map(function(a){a.unread=u;return a;});}

/* THE WAVE, rbWavePts copied whole from ui/component.js. Root to crown, two
   clean cycles when every seat passes everything; each seat keeps only what it
   passes and adds chop by what it holds back. */
var RB_WV={W:216,H:34,N:84};
function rbWavePts(pass,W0,H0){
 W0=W0||RB_WV.W;H0=H0||RB_WV.H;var N=RB_WV.N,cum=[],c=1,i;
 for(i=0;i<7;i++){c*=pass[i];cum.push(c);}
 var pts=[];
 for(i=0;i<=N;i++){var x=i/N*W0, f=i/N*7, s=Math.min(6,Math.floor(f)), u=f-s;
  var a0=s===0?1:cum[s-1], A=a0+(cum[s]-a0)*u;
  var ld=(1-pass[s]), ldp=s>0?(1-pass[s-1]):ld, ldn=s<6?(1-pass[s+1]):ld,
   L=u<.5?ldp+(ld-ldp)*(u+.5):ld+(ldn-ld)*(u-.5);
  var base=Math.sin(Math.PI*4*i/N),
   chop=L*(.55*Math.sin(Math.PI*2*(7*2.1)*i/N+s*1.9)+.3*Math.sin(Math.PI*2*(7*3.3)*i/N+s*.7));
  var y01=Math.max(0,Math.min(1,.5+.5*(A*base+chop)));
  pts.push([x,3+(H0-6)*(1-y01)]);}
 return {pts:pts,cum:cum};}

/* ---------- THE SYMBOLS THAT CARRY THEIR FIGURE ----------
   Ring, never fill, on the 24 unit grid, the same strokes as the static icons.
   AWARENESS, the aperture: six blades, each tangent to the opening, and the
   opening's radius is the figure, so at nought it is shut and at 100 the
   blades have folded into the rim.
   WILL, willpower: the shaft is integrity pushing up, the two bars either side
   of the gap are the charge it has to pass. Under about forty five percent the
   head does not reach the gap. Over it, it is through.
   RADIANCE: the rays are as long as the figure.
   VITALITY: the shoot's stem grows to the figure and the leaves open with it. */
function apertureD(v,cx,cy,R){cx=cx||12;cy=cy||12;R=R||8.5;
 var r=0.9+(R-0.9)*clamp(v/100,0,1)*0.96, d='M'+(cx-R)+' '+cy+'a'+R+' '+R+' 0 1 0 '+(2*R)+' 0a'+R+' '+R+' 0 1 0 '+(-2*R)+' 0';
 var t=Math.sqrt(Math.max(0,R*R-r*r));
 for(var k=0;k<6;k++){var a=k*Math.PI/3+0.26, px=cx+r*Math.cos(a), py=cy+r*Math.sin(a), dx=-Math.sin(a), dy=Math.cos(a);
  d+='M'+px.toFixed(2)+' '+py.toFixed(2)+'L'+(px+t*dx).toFixed(2)+' '+(py+t*dy).toFixed(2);}
 return d;}
function willD(v,s){s=s||1;var f=clamp(v/100,0,1), top=21-15.5*f;
 return 'M12 21V'+top.toFixed(2)+'M12 '+top.toFixed(2)+'l-3.4 3.4M12 '+top.toFixed(2)+'l3.4 3.4M4.5 13.5h4.6M14.9 13.5h4.6';}
function radD(v){var f=clamp(v/100,0,1), a=4.6, b=a+0.6+3.4*f, d='M7.5 12a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0';
 for(var k=0;k<8;k++){var g=k*Math.PI/4; d+='M'+(12+a*1.18*Math.cos(g)).toFixed(2)+' '+(12+a*1.18*Math.sin(g)).toFixed(2)+'L'+(12+b*1.18*Math.cos(g)).toFixed(2)+' '+(12+b*1.18*Math.sin(g)).toFixed(2);}
 return d;}
function vitD(v){var f=clamp(v/100,0,1), top=21-8*(.6+.4*f), l=2.6+3*f;
 return 'M12 21V'+top.toFixed(2)+'M12 '+top.toFixed(2)+'c0-'+(l*.75).toFixed(2)+' '+(l*.55).toFixed(2)+'-'+(l*1.35).toFixed(2)+' '+(l*1.25).toFixed(2)+'-'+(l*1.45).toFixed(2)
  +'M12 '+top.toFixed(2)+'c0-'+(l*.62).toFixed(2)+'-'+(l*.45).toFixed(2)+'-'+(l*1.12).toFixed(2)+'-'+(l*1.05).toFixed(2)+'-'+(l*1.2).toFixed(2)+'M9 21h6';}
var LIVE={Awareness:apertureD,Will:willD,Radiance:radD,Vitality:vitD};
function liveIc(k,v,cls){var f=LIVE[k]; if(!f)return ic(k==='DQ'?'dq':k==='Flow'?'flow':k,cls);
 return '<svg class="ic live '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true" data-live="'+k+'"><path d="'+f(v)+'"/></svg>';}
function paintLive(root,k,v){var el=root.querySelector('[data-live="'+k+'"] path'); if(!el)return;
 var key=Math.round(v*2)/2; if(el._v===key)return; el._v=key; el.setAttribute('d',LIVE[k](key));}

/* ---------- the page: people, the panels, the clock ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var REDUCED=false;try{REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
try{if(/[?&]still=1/.test(location.search))REDUCED=true;}catch(e){}
var PANELS=[];
/* a panel keeps its own values and tweens between them: a person arriving
   is not an edit, so the marks travel but nothing says by how much */
function Panel(host,person){
 this.host=host; this.p=null; this.from=null; this.to=null; this.t0=0; this.meant=false;
 this.set(person,true);}
Panel.prototype.set=function(person,first){
 var prev=this.cur?this.cur():null;
 this.p=person;
 this.host.innerHTML=CONCEPT.build(person);
 this.host.setAttribute('data-who',person.id);
 this.to=CONCEPT.values(person);
 this.from=prev||CONCEPT.start(person);
 this.t0=performance.now()+(first?240:0); this.first=!!first;
 wireTips(this.host);
 if(REDUCED){this.from=this.to;}
 this.paint(performance.now());};
Panel.prototype.cur=function(){if(!this.to)return null;var now=performance.now(),o={},self=this;
 Object.keys(this.to).forEach(function(k){o[k]=self.at(k,now);});return o;};
Panel.prototype.at=function(k,now){
 var a=this.from[k],b=this.to[k]; if(a===undefined)a=b;
 var i=(CONCEPT.order||[]).indexOf(k.split('.')[0]); i=i<0?0:i;
 var kk=(now-this.t0-i*ENTER_STAGGER)/(CONCEPT.kind&&CONCEPT.kind(k)==='mark'?HEAD:ENTER_SPAN);
 var e=CONCEPT.kind&&CONCEPT.kind(k)==='mark'?spring(clamp(kk,0,1)):e3(kk);
 if(REDUCED)e=1;
 if(Array.isArray(b))return b.map(function(v,j){var av=Array.isArray(a)?a[j]:v;return av+(v-av)*e;});
 /* a mark throws past where it lands and settles, but never past either end
    of its scale: round 3 caught Tomas's mark at 101.8 percent for a frame, a
    figure the reading cannot have */
 return clamp(a+(b-a)*e,0,100);};
Panel.prototype.paint=function(now){var v=this.cur();CONCEPT.paint(this.host,this.p,v,REDUCED?0:now/1000);};
function tick(now){PANELS.forEach(function(P){P.paint(now);});requestAnimationFrame(tick);}

/* the meaning of a word, on hover, focus or a hold, one tip for the page */
var TIP=null;
function wireTips(root){
 [].forEach.call(root.querySelectorAll('[data-say]'),function(el){
  if(!el.hasAttribute('tabindex')&&el.tagName!=='BUTTON')el.setAttribute('tabindex','0');
  var show=function(){showTip(el);}, hide=function(){if(TIP)TIP.style.opacity='0';};
  el.addEventListener('mouseenter',show);el.addEventListener('focus',show);
  el.addEventListener('mouseleave',hide);el.addEventListener('blur',hide);});}
function showTip(el){
 if(!TIP){TIP=document.createElement('div');TIP.className='tip';TIP.setAttribute('role','tooltip');document.body.appendChild(TIP);}
 TIP.innerHTML='<b>'+esc(el.getAttribute('data-say-k')||'')+'</b> '+esc(el.getAttribute('data-say'));
 var r=el.getBoundingClientRect(), w=Math.min(300,innerWidth-32);
 TIP.style.width=w+'px';
 var x=clamp(r.left+r.width/2-w/2,16,innerWidth-16-w);
 TIP.style.left=x+'px'; TIP.style.top=(r.bottom+window.scrollY+8)+'px'; TIP.style.opacity='1';}

function boot(){
 var grid=document.getElementById('grid'), chips=document.getElementById('chips');
 var pick=0; try{var m=/[?&]who=(\w+)/.exec(location.search);if(m)PEOPLE_D.forEach(function(p,i){if(p.id===m[1])pick=i;});}catch(e){}
 PEOPLE_D.forEach(function(p,i){
  var card=document.createElement('section');card.className='card'+(i===pick?' on':'');
  card.innerHTML='<header class="who"><b>'+esc(p.nm)+'</b>'+(p.age?'<span>'+p.age+', '+esc(p.role)+'</span>':'<span>'+esc(p.role)+'</span>')+'</header>'
   +'<div class="panel" role="group" aria-label="Readings for '+esc(p.nm)+'"></div>';
  grid.appendChild(card);
  PANELS.push(new Panel(card.querySelector('.panel'),p));
  var b=document.createElement('button');b.type='button';b.className='chip'+(i===pick?' on':'');b.textContent=p.nm;
  b.setAttribute('aria-pressed',i===pick?'true':'false');
  b.addEventListener('click',function(){
   [].forEach.call(grid.children,function(c,j){c.classList.toggle('on',j===i);});
   [].forEach.call(chips.children,function(c,j){c.classList.toggle('on',j===i);c.setAttribute('aria-pressed',j===i?'true':'false');});
   PANELS[i].set(p,true);});
  chips.appendChild(b);});
 var mt=document.getElementById('meanings');
 if(mt)mt.addEventListener('click',function(){var on=document.body.classList.toggle('say');mt.setAttribute('aria-pressed',on?'true':'false');});
 try{if(/[?&]say=1/.test(location.search)){document.body.classList.add('say');if(mt)mt.setAttribute('aria-pressed','true');}}catch(e){}
 requestAnimationFrame(tick);}
document.addEventListener('DOMContentLoaded',boot);
