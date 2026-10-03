/* ============================================================
   THE BOOT'S GEOMETRY, WRITTEN FROM THE ENGINE AND NOT BY HAND.

     node tools/bootgeo.js           rewrite the figure in shell/body.html
     node tools/bootgeo.js --check   exit 1 if the figure is out of date

   The boot runs before any script, so it cannot ask the engine where the
   seats sit. This does, off the built engine.js: one tick per address on the
   loop, each seat's arc as wide as its own run of addresses, the seam at
   twelve and root to crown clockwise, which is exactly how frMount lays out
   Frames and Dial. So the ring the boot draws is the ring the Field opens on,
   to the slot.

   Ported from proto/arrival/build.js, the arrival he called "the one I like"
   (ET, EX and EZ in TASKS.md). What changed on the way in is timing only, and
   the timing is not in here: every delay is a calc() in shell/head.html off
   the index this writes, so the whole choreography is tuned in one sheet.

   IT CARRIES INDICES, NOT DELAYS. Each seat carries --i, its place root to
   crown. Each tick carries --i, its seat, and --j, its place inside that seat.
   It also carries --s, its place on the whole loop, for the throw that sends
   every address out from the centre clockwise from twelve, and --c, its
   seat's colour, which the throw cools to from white. A count written into the markup is the
   defect this repository keeps being bitten by; an index the stylesheet
   multiplies is not a count.

   tests/design.js gate 11 reads the figure in a browser against the live
   engine, tick by tick, so if the loop ever changes shape and this was not
   rerun, the gate says so rather than the owner.
   ============================================================ */
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..');
const BODY=path.join(ROOT,'atuned_src','shell','body.html');
const E=require(path.join(ROOT,'engine.js'));
const BANDS=E.BANDS, PAL=E.PAL, W=E.W, N=W.length;

const sector={};
W.forEach((n,s)=>{const q=sector[n.b]||(sector[n.b]={s0:s,s1:s,n:0});q.s1=s;q.n++;});
let prev=-1;
BANDS.forEach(b=>{const q=sector[b];
 if(!q||q.s0!==prev+1||q.s1-q.s0+1!==q.n)throw new Error('seat '+b+' is not contiguous on the loop');
 prev=q.s1;});

const f2=v=>(+v).toFixed(2);
const C=100;
const pt=(r,deg)=>{const a=(deg-90)*Math.PI/180;return [C+Math.cos(a)*r,C+Math.sin(a)*r];};
const arc=(r,d0,d1)=>{const a=pt(r,d0),b=pt(r,d1),large=(d1-d0)>180?1:0;
 return 'M'+f2(a[0])+' '+f2(a[1])+'A'+r+' '+r+' 0 '+large+' 1 '+f2(b[0])+' '+f2(b[1]);};

/* the radii, in a 200 unit box, ET's own */
const R_SEAT=62, R_DOT=51, R_TICK0=68.5, TICK_LEN=13, R_CORE=24, R_HALO=88;
/* THE BANDS ARE THICKER. FA, his words: "The one I like, needs the kind of
   like thicker bands." ET's were 3.2 units. 5.6 is as thick as the room
   between the seats inside and the addresses outside allows while leaving
   each a clear gap, measured: inner edge 59.2 against the seat dots' 54.4,
   outer edge 64.8 against the ticks' 68.5. The stroke width is in the sheet;
   this number only decides the gap, which has to grow with the round caps
   or neighbouring bands touch: each cap reaches half the width past its end,
   so the gap either side is half the width plus a unit and a half of air. */
const BAND=5.6;
/* BREATH'S OUTSIDE RING. FA: "breath, the outside rings I like." The wave of
   the seven colours that leaves the centre and travels out past the ring,
   carried over from proto/arrival2's Breath at its own radius, 116 units,
   and its own two strokes: a soft band 18 wide and a line 2.4 wide on it.
   The element is drawn to the band's outer edge and scaled, so the ring is a
   compositor layer and never a repaint. */
const R_WAVE=116, WAVE_BAND=18, WAVE_LINE=2.4, R_WAVE_BOX=R_WAVE+WAVE_BAND/2;
/* where each seat stands on the spine, root at the foot, crown at the head,
   twenty apart: the shipped boot's own figure, kept as the opening pose */
const SPINE=[60,40,20,0,-20,-40,-60];
if(BANDS.length!==SPINE.length)throw new Error('the spine has '+SPINE.length+' places and the engine '+BANDS.length+' seats');

let seats='', arcs='', ticks='', prism='';
BANDS.forEach((b,i)=>{
 const q=sector[b], t0=q.s0/N, t1=(q.s1+1)/N, a1=(t0+t1)/2*360;
 /* the angle it leaves the spine at. Below the heart the spine points down,
    above it points up. The heart sits on the centre and only reaches out */
 const y=SPINE[i];
 let a0=y>0?180:(y<0?360:a1);
 /* every seat turns the same way, anticlockwise, so seven moves read as one
    gesture: the column unfurling rather than seven dots finding seats */
 if(y<0&&a0-a1>360)a0-=360;
 seats+='\n   <g class="bx-sa" style="--i:'+i+';--a0:'+f2(a0)+'deg;--a1:'+f2(a1)+'deg">'
  +'<circle class="b-seat b-s'+(i+1)+' bx-sd" cx="100" cy="100" r="'+(i===3?3.9:3.4)
  +'" style="--r0:'+Math.abs(y)+';--r1:'+R_DOT+'"/></g>';
 /* the seat's arc on the ring, a gap either side the way seats.js leaves one */
 const gap=(BAND/2+1.5)/R_SEAT*180/Math.PI, d0=t0*360+gap, d1=t1*360-gap;
 arcs+='\n    <path class="bx-trk" d="'+arc(R_SEAT,d0,d1)+'" stroke="'+PAL[b]+'"/>'
  +'<path class="bx-arc" d="'+arc(R_SEAT,d0,d1)+'" stroke="'+PAL[b]+'" data-s0="'+q.s0+'" data-n="'+q.n+'" style="--i:'+i+'"/>';
 /* the addresses, one tick a place, in the seat's colour. Each peaks and then
    settles to a resting length shaped like its seat: short at the sector's
    ends, long at its middle */
 for(let j=0;j<q.n;j++){
  const s=q.s0+j, deg=(s+.5)/N*360, lobe=Math.sin(Math.PI*(j+.5)/q.n);
  const p0=pt(R_TICK0,deg), p1=pt(R_TICK0+TICK_LEN,deg);
  ticks+='\n    <line x1="'+f2(p0[0])+'" y1="'+f2(p0[1])+'" x2="'+f2(p1[0])+'" y2="'+f2(p1[1])
   +'" pathLength="100" data-s="'+s+'" style="--c:'+PAL[b]+';--i:'+i+';--j:'+j+';--s:'+s
   +';--pk:'+Math.round(46+54*lobe)+';--rs:'+Math.round(20+22*lobe)+'"/>';}
});
/* THE PRISM, under the lens: the seven colours on their own sectors, which
   the glass turns into soft light */
BANDS.forEach(b=>{const q=sector[b];
 prism+='<path class="bx-pr" d="'+arc(8.5,q.s0/N*360+2,(q.s1+1)/N*360-2)+'" stroke="'+PAL[b]+'"/>';});

/* the wash: seven pools of the seats' own light, each on its seat's bearing,
   in a layer two and a half times the figure so the light reaches past it */
const washW=2.6;
const wash=BANDS.map(b=>{const q=sector[b],tm=((q.s0+q.s1+1)/2)/N*360;
 const a=(tm-90)*Math.PI/180, rr=.44/washW*100;
 const x=50+Math.cos(a)*rr, y=50+Math.sin(a)*rr, h=PAL[b];
 const rgb=[1,3,5].map(k=>parseInt(h.slice(k,k+2),16)).join(',');
 return 'radial-gradient(circle at '+x.toFixed(1)+'% '+y.toFixed(1)+'%, rgba('+rgb+',.20) 0, rgba('+rgb+',.07) 9%, rgba('+rgb+',0) 19%)';})
 .concat(['radial-gradient(circle at 50% 50%, rgba(126,184,212,.16) 0, rgba(126,184,212,0) 12%)']).join(',');

/* the wave's colours: each seat's own at the middle of its own run, and the
   seam at twelve an even mix of crown and root, so it has no hard edge */
const hexrgb=h=>[1,3,5].map(k=>parseInt(h.slice(k,k+2),16));
const cr=hexrgb(PAL[BANDS[BANDS.length-1]]), rt=hexrgb(PAL[BANDS[0]]);
const seam='rgb('+cr.map((v,k)=>Math.round((v+rt[k])/2)).join(',')+')';
const conic='conic-gradient(from 0deg,'+seam+' 0deg,'+BANDS.map(b=>{const q=sector[b];
 return PAL[b]+' '+f2((q.s0+q.s1+1)/2/N*360)+'deg';}).join(',')+','+seam+' 360deg)';
/* the band and the line as a mask, in percent of the box's radius */
const pc=v=>f2(v/R_WAVE_BOX*100)+'%';
const ringMask='radial-gradient(closest-side,transparent '+pc(R_WAVE-WAVE_BAND/2)+',rgba(0,0,0,.28) '+pc(R_WAVE-WAVE_BAND/4)
 +',rgba(0,0,0,.34) '+pc(R_WAVE-WAVE_LINE/2-.4)+',#000 '+pc(R_WAVE-WAVE_LINE/2)+',#000 '+pc(R_WAVE+WAVE_LINE/2)
 +',rgba(0,0,0,.34) '+pc(R_WAVE+WAVE_LINE/2+.4)+',rgba(0,0,0,.28) '+pc(R_WAVE+WAVE_BAND/4)+',transparent 100%)';
const waveStyle='--wb:'+f2(R_WAVE_BOX/100)+';background:'+conic+';-webkit-mask:'+ringMask+';mask:'+ringMask;

const fig=` <div class="bx-stage">
  <div class="bx-wash" style="background:${wash}"></div>
  <div class="bx-fig">
   <svg viewBox="0 0 200 200" class="bx-svg">
    <line class="bx-spine" x1="100" y1="160" x2="100" y2="40" pathLength="100"/>
    <g class="bx-arcs">${arcs}
    </g>
    <g class="b-addr">${ticks}
    </g>
    <circle class="bx-halo" cx="100" cy="100" r="${R_HALO}" pathLength="100"/>
    <g class="bx-prism">${prism}</g>
    <circle class="b-core" cx="100" cy="100" r="3.4"/>
    <circle class="bx-ctrk" cx="100" cy="100" r="${R_CORE}"/>
    <circle class="bx-cval" cx="100" cy="100" r="${R_CORE}" pathLength="100"/>${seats}
   </svg>
   <div class="bx-wave" style="${waveStyle}"></div>
   <div class="bx-wave bx-echo" style="${waveStyle}"></div>
   <div class="bx-lens"></div>
  </div>
 </div>`;

const A='<!-- BOOT FIGURE BEGIN. Written by tools/bootgeo.js off engine.js. Do not edit by hand. -->';
const Z='<!-- BOOT FIGURE END -->';
const body=fs.readFileSync(BODY,'utf8');
const i0=body.indexOf(A), i1=body.indexOf(Z);
if(i0<0||i1<0||i1<i0)throw new Error('cannot find the boot figure markers in shell/body.html');
const next=body.slice(0,i0+A.length)+'\n'+fig+'\n '+body.slice(i1);
if(process.argv.includes('--check')){
 if(next!==body){console.log('the boot figure in shell/body.html is out of date: run node tools/bootgeo.js');process.exit(1);}
 console.log('boot figure current: '+N+' addresses, '+BANDS.length+' seats');process.exit(0);}
fs.writeFileSync(BODY,next);
console.log('wrote the boot figure: '+N+' addresses, '+BANDS.length+' seats, '
 +BANDS.map(b=>b+' '+sector[b].n).join(', '));
