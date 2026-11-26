/* ============================================================
   THE ENERGY DIALS, 21 November (energy-dials-wired-21nov). Vitality,
   Awareness, Will and Radiance as four radial dials in the Avatar page's
   top left corner, the cell avHero kept empty once the question moved to
   the Source AI corner (avSides, "The first slot is kept, empty"). That
   corner was the one dead zone on the page: the Source AI card stood top
   right with nothing level with it on the left, which is the asymmetric
   dead space his Dashboard ruling of 14 November names. Energy now mirrors
   Source AI across the ring, both cards the height of the taller, and the
   release and embody boxes sit level under them as before.

   Approved twice before it was wired: the look is round 3 of the dials
   mockup (the figure rides the tip of the arc, the icon and the word sit
   inside the ring, no line under the tile), the motion is Study 1, Breath.
   His three notes on top, his words:

   1. "Make their speeds a little variable so they're not all going at the
      same time, so they feel like they have a little bit of identity of
      their own." Each dial breathes on its own period, AVD_PERIOD below.
   2. "I want that gradient to get more vibrant towards the end." The last
      stretch of the arc gains saturation, not only light, avdShade.
   3. "These should fit on two, and they should fit perfectly to the left
      and right column." Two rows of two, head.html ".avd-grid". The review
      strip of rest, hovered and pressed in the mockup was for review only
      and is not here.

   Every figure is the registry's: the arc fills pct(kind) and the pill
   prints fmtPct(kind) at rest, the same two calls the rail's bars make
   (ui/ui.js, #keylo), so the dial and the bar can never print different
   numbers for one reading.

   A PRESS DOES NOT OPEN THE READING HERE, though the rail's bar does. The
   bar's press is the delegated .kb[data-q] handler in ui/ui.js, which paints
   the drill into Selection, and Selection is hidden on this page: Become
   stands in its place (head.html, tests/dashavatar.js "Become shows and
   Selection does not"). Wired the same way, the dial was measured opening a
   drill nobody could see, a button that does nothing. So a press here is
   Study 1's held inhale and nothing else, and the meaning is the one
   tooltip's, on hover, tap and focus, the "unpack every symbol" rule.
   ============================================================ */
/* word, field on the reading, icon, pct kind, colour. The three take their
   element's colour, round OT: "Vitality to me is energy. Energy is yellow.
   Awareness is Indigo will is blue." Radiance is drawn in light, the ink
   warmed by Solar, the r1 review's reading of round RZ, as the rail draws it. */
var AVD_K=[
 ['Vitality','X','vitality','vitality',function(){return seatCol('Solar');}],
 ['Awareness','Y','awareness','awareness',function(){return seatCol('3rd Eye');}],
 ['Will','Z','will','will',function(){return seatCol('Throat');}],
 ['Radiance','radiance','rad','radiance',function(){return avdMix(avdTok('--ink','#EFEDE8'),seatCol('Solar'),.14);}]];
/* the live dials, one record per press of renderAvatar, and the key of the
   last reading whose fill was played, so a repaint that changes nothing
   (a click elsewhere on the page, a drill opening) lands on the end state
   and breathes, instead of replaying the fill on every render */
var AVD={dials:[], raf:0, last:0, played:null, io:null, vis:false, wait:false};

/* ---------------- colour ---------------- */
/* a token read off the live sheet, so the four lightings and Punch carry the
   arc: seatCol already answers per lighting, and the dark end of the arc is
   mixed toward the page's own ground, not toward a fixed black */
function avdTok(k,dflt){
 var v=''; try{v=getComputedStyle(document.body).getPropertyValue(k).trim();}catch(e){}
 return /^#[0-9a-f]{6}$/i.test(v)?v:dflt;}
function avdHex(h){h=String(h||'').replace('#','');
 if(h.length===3)h=h.replace(/(.)/g,'$1$1');
 return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(function(i){return parseInt(h.substr(i,2),16);}):null;}
function avdMix(a,b,t){var x=avdHex(a), y=avdHex(b); if(!x||!y)return a;
 return '#'+x.map(function(v,i){var n=Math.round(v+(y[i]-v)*t).toString(16);return n.length<2?'0'+n:n;}).join('');}
function avdHsl(hex){var c=avdHex(hex).map(function(v){return v/255;});
 var mx=Math.max.apply(null,c), mn=Math.min.apply(null,c), l=(mx+mn)/2, d=mx-mn, h=0, s=0;
 if(d){s=d/(1-Math.abs(2*l-1));
  h=mx===c[0]?((c[1]-c[2])/d+6)%6:mx===c[1]?(c[2]-c[0])/d+2:(c[0]-c[1])/d+4;}
 return [h*60,s,l];}
function avdRgb(h,s,l){var C=(1-Math.abs(2*l-1))*s, X=C*(1-Math.abs((h/60)%2-1)), m=l-C/2, k=Math.floor(h/60)%6;
 var r=[[C,X,0],[X,C,0],[0,C,X],[0,X,C],[X,0,C],[C,0,X]][k];
 return '#'+r.map(function(v){var n=Math.round(Math.max(0,Math.min(1,v+m))*255).toString(16);return n.length<2?'0'+n:n;}).join('');}
/* THE ARC'S RAMP, f a place on the ramp from 0 to 1. Round 3 ran from the
   colour three quarters toward the ground, up to the colour itself at .55,
   then toward white by up to a third. He asked for the end to be more
   vibrant, and white is the opposite of vibrant: mixing toward it takes
   saturation away while it adds light, which is why the end read paler and
   not stronger. So the last stretch is built in HSL instead. Saturation
   climbs most of the way to full, and lightness moves only a quarter of the
   way toward a mid value, up for a dark hue and down for a pale one, so
   Radiance's warm ink deepens toward gold rather than flaring to white and
   each dial keeps its own hue at its brightest point. */
function avdShade(col,bg,f){
 if(f<.55)return avdMix(avdMix(col,bg,.74),col,f/.55);
 var t=Math.min(1,(f-.55)/.45), q=avdHsl(col);
 var s=q[1]+(1-q[1])*.78*t, l=q[2]+(.62-q[2])*.26*t;
 return avdRgb(q[0],Math.min(1,s),Math.max(0,Math.min(1,l)));}

/* ---------------- geometry ---------------- */
/* the 270 degree track, radius 48 in a 120 box, starting at 135 degrees,
   round 3's own numbers */
var AVD_R=48, AVD_C=2*Math.PI*AVD_R, AVD_L=AVD_C*.75;
function avdPt(deg,r){var a=deg*Math.PI/180;r=r||AVD_R;return [60+r*Math.cos(a),60+r*Math.sin(a)];}
function avdP(n){return (+n).toFixed(2);}
/* the arc, painted once at the colours of the final reading and a little
   past it. The motion reveals it through a mask rather than repainting it:
   one attribute per frame instead of sixty paths. It runs past the reading
   so the overshoot has arc to show, and each place on it takes the colour
   round 3 gives it, the ramp topping out at .55 plus .45 of the reading, so a
   full dial ends at its most vivid and a short one at nearer its own hue. */
function avdArc(v,col,bg){
 var top=.55+.45*v, ext=Math.min(1,v*1.07+.02), n=Math.max(3,Math.ceil(72*ext)), out='';
 var p0=avdPt(135);
 out+='<circle cx="'+avdP(p0[0])+'" cy="'+avdP(p0[1])+'" r="3.5" fill="'+avdShade(col,bg,0)+'"/>';
 for(var k=0;k<n;k++){
  var a0=135+270*ext*k/n, a1=Math.min(135+270*ext,135+270*ext*(k+1)/n+.6), m=ext*(k+.5)/n;
  var A=avdPt(a0), B=avdPt(a1);
  out+='<path d="M'+avdP(A[0])+' '+avdP(A[1])+' A'+AVD_R+' '+AVD_R+' 0 0 1 '+avdP(B[0])+' '+avdP(B[1])
   +'" stroke="'+avdShade(col,bg,Math.min(1,v>0?top*m/v:0))+'"/>';}
 return out;}

/* ---------------- the breath ---------------- */
/* STUDY 1's BREATH, the shape and not a sine: an inhale of 38 percent of the
   cycle, an exhale of 47 and a pause at the bottom of 15, the end-expiratory
   pause a resting body actually takes */
function avdBreath(p){p=((p%1)+1)%1;
 if(p<.38)return (1-Math.cos(Math.PI*p/.38))/2;
 if(p<.85)return (1+Math.cos(Math.PI*(p-.38)/.47))/2;
 return 0;}
/* EACH DIAL ITS OWN BREATH, his note 1. Study 1 ran all four on one period,
   Vitality's, the rate engine/charfield.js charOscillation gives the Field's
   torus (Diane's 24 is 8.17 seconds a breath), and staggered only where each
   began, so the four still marched in step. Now:

   Vitality keeps the torus's period exactly, so the dial and the Field still
   breathe as one.

   The other three are scaled off it by their own reading, through the same
   charOscillation: (Vitality's rate over the dial's own rate) to the power
   .3. A higher reading breathes a little faster, which is what the torus
   already does with Vitality, and the power keeps it "a little": Diane's
   Awareness of 64 runs 0.83 of Vitality's period, where the bare rate would
   run it at 0.54, nearly twice as fast, which reads as a different animal and
   not a different temperament.

   A small fixed signature on top, AVD_ID, because a period read off the
   reading alone puts two equal readings in lockstep for ever, and a roster
   profile with two dials at one figure is not rare. 3.5 to 6 percent apart is
   enough that any two drift a whole breath out of phase inside a few
   minutes, and too little to notice as a rate of its own. */
var AVD_ID=[1,1.035,.965,1.06];
function avdPeriod(v,vit,i){
 var rv=charOscillation(vit).rate, ri=charOscillation(v).rate;
 var base=1000/rv;
 return i===0?base:base*Math.pow(rv/ri,.3)*AVD_ID[i];}

/* ---------------- easing ---------------- */
function avdClamp(v,a,b){return v<a?a:v>b?b:v;}
function avdEo3(u){u=avdClamp(u,0,1);return 1-Math.pow(1-u,3);}
function avdEio(u){u=avdClamp(u,0,1);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;}
/* Study 1's overshoot: ease out to the peak at 70 percent of the time, then
   settle on an ease in out. The peak is 3.5 percent of the travel, or 1.2
   percent of the full scale if that is larger: at a 24 a true-scale 3.5
   percent is under a degree and reads as nothing (exaggeration). */
function avdOver(u,v){var pk=Math.max(1.035,1+.012/Math.max(v,.01));
 if(u<.7)return pk*avdEo3(u/.7);return pk-(pk-1)*avdEio((u-.7)/.3);}
/* distance-scaled travel: 320ms plus 380ms for a full sweep */
function avdTravel(v){return 320+380*v;}

/* ---------------- markup ---------------- */
var AVD_UID=0;
function avdOne(r,d,i){
 var word=d[0], raw=r[d[1]], v=avdClamp((pct(d[3],raw)||0)/100,0,1), txt=fmtPct(d[3],raw,{});
 var col=d[4](), bg=avdTok('--bg','#0C0D12'), id='avd'+(AVD_UID++);
 var tc=avdMix(avdShade(col,bg,.55+.45*v),'#ffffff',.18), say=rbSay(word), p0=avdPt(135);
 /* the mask starts six degrees before the track so the round start cap,
    which sits half behind 135 degrees, is never cut in two */
 var mk='<circle data-avdm cx="60" cy="60" r="'+AVD_R+'" fill="none" stroke="#fff" stroke-width="30"'
  +' stroke-dasharray="0 '+avdP(AVD_C)+'" transform="rotate(129 60 60)"/>';
 return '<button type="button" class="avd" data-avd="'+i+'" style="--c:'+col+';--tc:'+tc+'"'
  +' data-tip-t="'+esc(word)+'" data-tip="'+esc(say)+'" aria-label="'+esc(rbAria(word,txt,true,say,'').trim())+'">'
  +'<span class="avd-g">'
  /* layer 1, painted once: the face, the track and the arc through its mask */
  +'<svg viewBox="0 0 120 120" aria-hidden="true"><defs>'
   +'<radialGradient id="'+id+'f" cx=".5" cy=".38" r=".62"><stop offset="0" class="avd-f0"/><stop offset="1" class="avd-f1"/></radialGradient>'
   +'<mask id="'+id+'k" maskUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="160">'+mk+'</mask>'
   +'<g id="'+id+'s" fill="none" stroke-width="7">'+avdArc(v,col,bg)+'</g></defs>'
   +'<circle class="avd-face" cx="60" cy="60" r="40" fill="url(#'+id+'f)"/>'
   +'<circle class="avd-trk" cx="60" cy="60" r="'+AVD_R+'" fill="none" stroke-width="7" stroke-linecap="round"'
   +' stroke-dasharray="'+avdP(AVD_L)+' '+avdP(AVD_C)+'" transform="rotate(135 60 60)"/>'
   +'<use href="#'+id+'s" mask="url(#'+id+'k)"/></svg>'
  /* layer 2, the glow, moved only by opacity and scale so the compositor
     carries the breath and nothing is repainted at rest */
  +'<svg class="avd-glow" viewBox="0 0 120 120" aria-hidden="true"><defs>'
   +'<filter id="'+id+'b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>'
   +'<use href="#'+id+'s" filter="url(#'+id+'b)" mask="url(#'+id+'k)"/></svg>'
  +'<span class="avd-mid" aria-hidden="true">'+rbIcon(d[2])+'<span class="avd-nm">'+esc(word)+'</span></span>'
  /* the figure rides the tip: a wrapper turned to the tip's angle and the
     pill turned back by as much, two transforms and no layout per frame */
  +'<span class="avd-tw" aria-hidden="true"><span class="avd-v" style="left:'+avdP(p0[0]/1.2)+'%;top:'+avdP(p0[1]/1.2)+'%">'
  +avdNum(txt)+'</span></span>'
  +'</span></button>';}
/* the figure and its percent sign, the sign set smaller as round 3 sets it.
   The unread dash has no sign. */
function avdNum(t){t=String(t);return /%$/.test(t)?t.slice(0,-1)+'<small>%</small>':esc(t);}
/* the card. Nothing on an unread record: a dial at a reading nobody has
   entered is the "renders to somebody who has entered nothing" the Discover
   ruling forbids, and avPotHTML, the other reading on this page, is silent
   the same way. The corner is then empty, as it was before this. */
function avDialsHTML(r){
 if(!r||r.unread||typeof charOscillation!=='function')return '';
 return '<section class="av-card avd-card" aria-label="Energy">'
  /* the head carries its sentence from the meaning table, the way the
     rail's two family heads do, so Energy is never a bare word */
  +'<div class="avd-hd" tabindex="0" data-tip-t="Energy" data-tip="'+esc(rbSay('Energy'))+'">'+rbIcon('rad')+'<b>Energy</b></div>'
  +'<div class="avd-grid">'+AVD_K.map(function(d,i){return avdOne(r,d,i);}).join('')+'</div></section>';}

/* ---------------- the live dial ---------------- */
function avdStill(){return typeof rbStill==='function'?rbStill():!!REDUCED;}
function avdSetS(el,k,v){var c=el._avs||(el._avs={});if(c[k]===v)return;c[k]=v;el.style[k]=v;}
function AvDial(el,v,txt,P){var s=this;s.el=el;s.val=v;s.txt=txt;s.P=P;s.f=0;
 s.m=el.querySelector('[data-avdm]');s.glow=el.querySelector('.avd-glow');
 s.tw=el.querySelector('.avd-tw');s.pill=el.querySelector('.avd-v');
 s.fill=null;s.down=false;s.sigh=0;s.t0=0;s.lastArc=-1;s.lastNum=null;}
/* writes, each skipped when nothing moved */
AvDial.prototype.arc=function(f){f=Math.max(0,f);
 var q=f>0?Math.round((f*AVD_L+AVD_C/60)*20)/20:0; if(q===this.lastArc)return; this.lastArc=q;
 this.m.setAttribute('stroke-dasharray',q.toFixed(2)+' '+AVD_C.toFixed(2));};
AvDial.prototype.tip=function(f){var a=(270*Math.max(0,f)).toFixed(2);
 avdSetS(this.tw,'transform','rotate('+a+'deg)');
 avdSetS(this.pill,'transform','translate(-50%,-50%) rotate(-'+a+'deg)');};
/* the figure never prints past the reading, even when the arc overshoots,
   and at rest it is fmtPct's own text, so it is the registry's figure */
AvDial.prototype.num=function(f,rest){
 var t=rest?this.txt:(f<=0?PCT_DASH:Math.round(Math.min(f,this.val)*100)+'%');
 if(t===this.lastNum)return; this.lastNum=t; this.pill.innerHTML=avdNum(t);};
AvDial.prototype.end=function(){this.f=this.val;this.fill=null;this.sigh=0;
 this.arc(this.val);this.tip(this.val);this.num(this.val,true);
 avdSetS(this.glow,'opacity','0.550');avdSetS(this.glow,'transform','none');};

/* FILL. Vitality, Awareness and Will 90ms apart in reading order after
   Study 1's 90ms gather; Radiance is the three together, so it starts as
   the three are settling, at 70 percent of the slowest one's travel */
function avdStart(t0){
 var lastEnd=0;
 AVD.dials.forEach(function(d,i){var delay;
  if(i<3){delay=i*90;lastEnd=Math.max(lastEnd,delay+90+avdTravel(d.val)*.7);}
  else delay=lastEnd;
  d.f=0;d.lastArc=-1;d.lastNum=null;d.fill={t0:t0+delay,dur:avdTravel(d.val)};
  d.arc(0);d.tip(0);d.num(0);avdSetS(d.glow,'opacity','0');});
 avdKick();}
function avdKick(){if(!AVD.raf&&AVD.vis&&!avdStill()){AVD.last=performance.now();AVD.raf=requestAnimationFrame(avdFrame);}}
/* THE LOOP RUNS ONLY WHILE THE CARD CAN BE SEEN. The first cut ended it only
   when the dials left the document, and a move to another tab does not take
   them out: #avbody is hidden, not emptied, so the loop went on writing a
   breath at sixty frames a second into a page nobody had open, measured
   still running on the Field after leaving the Avatar. AVD.vis is the
   observer's answer in avDialsBind, and a hidden host reads as not
   intersecting. The breath is read off the clock and not counted in frames,
   so coming back picks it up at the phase it would have reached. */
function avdFrame(){AVD.raf=0;
 if(!AVD.dials.length||!AVD.dials[0].el.isConnected){AVD.dials=[];return;}
 if(!AVD.vis)return;
 if(avdStill()){AVD.dials.forEach(function(d){d.end();});return;}
 avdStep(performance.now());
 AVD.raf=requestAnimationFrame(avdFrame);}
function avdStep(t){
 var dt=Math.min(64,Math.max(0,t-AVD.last)); AVD.last=t;
 AVD.dials.forEach(function(d){
  if(d.fill){var F=d.fill;
   if(t<F.t0){d.f=0;return;}
   /* the gather is the first 90ms: the arc holds at the start, then goes */
   var u=avdClamp((t-F.t0-90)/F.dur,0,1); d.f=d.val*avdOver(u,d.val);
   d.arc(d.f); d.tip(d.f); d.num(d.f);
   avdSetS(d.glow,'opacity',(.55*Math.min(1,d.f/Math.max(d.val,.01))).toFixed(3));
   /* its breath starts where it lands, so the four are already apart */
   if(u>=1){d.fill=null;d.f=d.val;d.t0=t;d.arc(d.val);d.tip(d.val);d.num(d.val,true);}
   return;}
  /* REST AND PRESS. Each dial takes as much of its own breath as its reading
     holds; a press is a held inhale over 260ms, let go on a 900ms exhale */
  if(d.down)d.sigh=Math.min(1,d.sigh+dt/260);else d.sigh=Math.max(0,d.sigh-dt/900);
  var sg=d.down?avdEo3(d.sigh):avdEio(d.sigh), b=avdBreath((t-d.t0)/d.P+.13);
  var amp=.3+.7*d.val, br=b*(1-sg)+1.6*sg;
  avdSetS(d.glow,'opacity',(.42+.36*amp*br).toFixed(3));
  var gs=1+.03*amp*br; avdSetS(d.glow,'transform',gs===1?'none':'scale('+gs.toFixed(4)+')');});}

/* wired after every paint of the page. host is #avbody. */
function avDialsBind(host,r){
 AVD.dials=[]; AVD.vis=false; AVD.wait=false; if(AVD.io){AVD.io.disconnect();AVD.io=null;}
 var els=[].slice.call(host.querySelectorAll('.avd[data-avd]')); if(!els.length)return;
 var vit=avdClamp((pct('vitality',r.X)||0)/100,0,1);
 AVD.dials=els.map(function(el,i){var d=AVD_K[i], raw=r[d[1]], v=avdClamp((pct(d[3],raw)||0)/100,0,1);
  var D=new AvDial(el,v,fmtPct(d[3],raw,{}),avdPeriod(v,vit,i));
  var dn=function(){if(D.down)return;D.down=true;el.classList.add('down');avdKick();};
  var up=function(){if(!D.down)return;D.down=false;el.classList.remove('down');avdKick();};
  el.addEventListener('pointerdown',function(e){if(e.button===0)dn();});
  el.addEventListener('pointerup',up);el.addEventListener('pointerleave',up);el.addEventListener('pointercancel',up);
  el.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&!e.repeat)dn();});
  el.addEventListener('keyup',function(e){if(e.key===' '||e.key==='Enter')up();});
  return D;});
 /* the fill plays once per reading per person; any other repaint lands on
    the end state and breathes from there */
 var key=(CURP&&CURP.id)+'|'+AVD.dials.map(function(d){return d.txt;}).join(',');
 var fresh=AVD.played!==key; AVD.played=key;
 var t=performance.now();
 AVD.dials.forEach(function(d,i){d.end();d.t0=t+i*90;});
 /* reduced motion: the end state, no loop, and head.html takes the
    transition off the press as well */
 if(avdStill())return;
 var card=host.querySelector('.avd-card');
 if(!card||!('IntersectionObserver' in window)){AVD.vis=true; if(fresh)avdStart(t+120); else avdKick(); return;}
 /* a fill due while the card is off screen (on a phone it is under the ring
    and the Source AI card) starts when it arrives, so nobody scrolls down to
    a fill that already happened unseen. The same observer pauses and
    resumes the breath, avdFrame says why. */
 if(fresh){AVD.wait=true;
  AVD.dials.forEach(function(d){d.arc(0);d.tip(0);d.num(0);avdSetS(d.glow,'opacity','0');});}
 AVD.io=new IntersectionObserver(function(es){es.forEach(function(e){
  AVD.vis=e.isIntersecting; if(!AVD.vis)return;
  if(AVD.wait){AVD.wait=false; avdStart(performance.now()+120);} else avdKick();});});
 AVD.io.observe(card);}
