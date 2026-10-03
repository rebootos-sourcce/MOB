/* ============================================================
   BUILD THE ARRIVAL PROTOTYPE. EQ in TASKS.md, two asks.

     committed source.html + boot.css + arrive.css + arrive.js -> arrival.html

   ONE, the boot, graded D: "it feels blocked in, not visually interesting.
   We have all these cool elements in our Field now, is there anything we can
   pull in from that." TWO, Frames and Dial: "when I land on this page the
   first thing I want to see is movement, Dial looks dead."

   The prototype is the shipped build with both laid over it, the way
   proto/glassbar does it, so every ring and number is the product's own.
   Nothing under atuned_src/ is touched.

   IT READS THE COMMITTED BUILD, NOT THE WORKING TREE, and the engine from
   the same commit, because other seats have work in flight in the tree.

   THE BOOT'S GEOMETRY IS COMPUTED HERE, NOT TYPED. The boot runs before any
   script, so it cannot ask the engine where the seats sit. This does, at
   build time, off the committed engine: 108 places on the loop, each seat's
   sector as wide as its own count of addresses, the seam at twelve and root
   to crown clockwise, which is exactly how frMount lays out Frames and Dial.
   So the ring the boot draws is the ring the Field opens on, to the slot.

     node proto/arrival/build.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const git=a=>cp.execSync('git '+a,{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const src=git('show HEAD:source.html');
const commit=git('rev-parse --short HEAD').trim();
/* the engine from the same commit, loaded from a temporary copy */
const tmp=path.join(os.tmpdir(),'arrival-engine-'+process.pid+'.js');
fs.writeFileSync(tmp,git('show HEAD:engine.js'));
const E=require(tmp); fs.unlinkSync(tmp);
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const james=(STORYBANK.James||[]).map(x=>x[1]);
if(james.length!==5)throw new Error('James story bank changed shape: '+james.length);

/* ---------------- the loop, as frMount lays it ---------------- */
const BANDS=E.BANDS, PAL=E.PAL, W=E.W;
const N=W.length;
const sector={};
W.forEach((n,s)=>{const q=sector[n.b]||(sector[n.b]={s0:s,s1:s,n:0});q.s1=s;q.n++;});
/* contiguous, root to crown, or the ring below is not the Field's */
let prev=-1;BANDS.forEach(b=>{const q=sector[b];if(!q||q.s0!==prev+1||q.s1-q.s0+1!==q.n)throw new Error('seat '+b+' is not contiguous on the loop');prev=q.s1;});
const f2=v=>(+v).toFixed(2);
const TAU=Math.PI*2, C=100;
const pt=(r,deg)=>{const a=(deg-90)*Math.PI/180;return [C+Math.cos(a)*r,C+Math.sin(a)*r];};
const arc=(r,d0,d1)=>{const a=pt(r,d0),b=pt(r,d1),large=(d1-d0)>180?1:0;
 return 'M'+f2(a[0])+' '+f2(a[1])+'A'+r+' '+r+' 0 '+large+' 1 '+f2(b[0])+' '+f2(b[1]);};

/* the radii, in a 200 unit box */
const R_SEAT=62, R_DOT=51, R_TICK0=68.5, TICK_LEN=13, R_CORE=24, R_HALO=88;
/* where each seat stands on the spine, root at the foot, crown at the head,
   twenty apart: the shipped boot's own figure, kept as the opening pose */
const SPINE=[60,40,20,0,-20,-40,-60];

let seats='', arcs='', ticks='', prism='';
const T0=1.62, TSTEP=.06;               /* when each seat leaves the spine */
BANDS.forEach((b,i)=>{
 const q=sector[b], t0=q.s0/N, t1=(q.s1+1)/N, tm=(t0+t1)/2;
 const a1=tm*360;
 /* the angle it leaves the spine at. Below the heart the spine points down,
    above it points up. The heart sits on the centre and only reaches out */
 const y=SPINE[i];
 let a0=y>0?180:(y<0?360:a1), r0=Math.abs(y);
 /* every seat turns the same way, anticlockwise, so seven moves read as one
    gesture: the column unfurling rather than seven dots finding seats */
 if(y<0&&a0-a1>360)a0-=360;
 const leave=T0+i*TSTEP, pop=.78+i*.09;
 seats+='<g class="bx-sa" style="--a0:'+f2(a0)+'deg;--a1:'+f2(a1)+'deg;animation-delay:'+f2(leave)+'s">'
  +'<circle class="b-seat b-s'+(i+1)+' bx-sd" cx="100" cy="100" r="'+(i===3?3.9:3.4)+'" style="--r0:'+r0+';--r1:'+R_DOT
  +';animation-delay:'+f2(pop)+'s,'+f2(leave)+'s"/></g>';
 /* the seat's arc on the ring, a gap either side the way seats.js leaves one,
    grown from its middle, which is the bearing the seat has just landed on */
 const gap=.05*180/Math.PI, d0=t0*360+gap, d1=t1*360-gap;
 arcs+='<path class="bx-trk" d="'+arc(R_SEAT,d0,d1)+'" stroke="'+PAL[b]+'"/>'
  +'<path class="bx-arc" pathLength="100" d="'+arc(R_SEAT,d0,d1)+'" stroke="'+PAL[b]+'" style="animation-delay:'+f2(leave+.42)+'s"/>';
 /* the addresses, one tick a place, in the seat's colour. Each peaks and then
    settles to a resting length shaped like its seat: short at the sector's
    ends, long at its middle, the same growth from the middle as the arcs */
 for(let j=0;j<q.n;j++){
  const s=q.s0+j, deg=(s+.5)/N*360, lobe=Math.sin(Math.PI*(j+.5)/q.n);
  const p0=pt(R_TICK0,deg), p1=pt(R_TICK0+TICK_LEN,deg);
  ticks+='<line x1="'+f2(p0[0])+'" y1="'+f2(p0[1])+'" x2="'+f2(p1[0])+'" y2="'+f2(p1[1])+'" pathLength="100" style="stroke:'+PAL[b]+';--pk:'+Math.round(46+54*lobe)+';--rs:'+Math.round(20+22*lobe)+';animation-delay:'+(2.20+s*.006).toFixed(3)+'s"/>';}
});

/* THE PRISM, under the lens. The glass bar reads as glass because the Field
   shows through it, blurred. Under the boot's lens there was nothing to
   blur, so it read as a dark disc. The seven seats' colours sit under it
   here, on their own sectors, and the glass turns them into soft light. */
BANDS.forEach(b=>{const q=sector[b];prism+='<path class="bx-pr" d="'+arc(8.5,q.s0/N*360+2,(q.s1+1)/N*360-2)+'" stroke="'+PAL[b]+'"/>';});

/* the wash: seven pools of the seats' own light, each on its seat's bearing,
   in a layer two and a half times the figure so the light reaches past it */
const washW=2.6;
const wash=BANDS.map(b=>{const q=sector[b],tm=((q.s0+q.s1+1)/2)/N*360;
 const a=(tm-90)*Math.PI/180, rr=.44/washW*100;
 const x=50+Math.cos(a)*rr, y=50+Math.sin(a)*rr, h=PAL[b];
 const rgb=[1,3,5].map(k=>parseInt(h.slice(k,k+2),16)).join(',');
 return 'radial-gradient(circle at '+x.toFixed(1)+'% '+y.toFixed(1)+'%, rgba('+rgb+',.20) 0, rgba('+rgb+',.07) 9%, rgba('+rgb+',0) 19%)';})
 .concat(['radial-gradient(circle at 50% 50%, rgba(126,184,212,.16) 0, rgba(126,184,212,0) 12%)']).join(',');

const bootNew=`<div id="boot" class="boot bx" aria-hidden="true">
 <div class="bx-stage">
  <div class="bx-wash" style="background:${wash}"></div>
  <div class="bx-fig">
   <svg viewBox="0 0 200 200" class="bx-svg">
    <line class="bx-spine" x1="100" y1="160" x2="100" y2="40" pathLength="100"/>
    <g class="bx-arcs">${arcs}</g>
    <g class="b-addr">${ticks}</g>
    <circle class="bx-halo" cx="100" cy="100" r="${R_HALO}" pathLength="100"/>
    <g class="bx-prism">${prism}</g>
    <circle class="b-core" cx="100" cy="100" r="3.4"/>
    <circle class="bx-ctrk" cx="100" cy="100" r="${R_CORE}"/>
    <circle class="bx-cval" cx="100" cy="100" r="${R_CORE}" pathLength="100"/>
    ${seats}
   </svg>
   <div class="bx-lens"></div>
  </div>
 </div>
 WORDMARK
</div>`;

/* ---------------- the shipped boot, kept for the side by side ---------------- */
const b0=src.indexOf('<div id="boot"'), b1=src.indexOf('<canvas id="bgaura"');
if(b0<0||b1<0||b1<b0)throw new Error('cannot find the boot sheet in source.html');
const bootOld=src.slice(b0,b1).replace(/\s+$/,'');
/* the wordmark is ruled to the pixel, so it is carried over verbatim */
const w0=bootOld.indexOf('<div class="boot-wm">'), w1=bootOld.lastIndexOf('</div>');
const wordmark=bootOld.slice(w0,bootOld.indexOf('</div>',bootOld.indexOf('</span>\n',w0))+6);
if(w0<0||!/Source OS/.test(wordmark))throw new Error('cannot find the wordmark');
const bootNewFull=bootNew.replace('WORDMARK',wordmark);

const css=fs.readFileSync(path.join(D,'boot.css'),'utf8');
const acss=fs.readFileSync(path.join(D,'arrive.css'),'utf8');
const ajs=fs.readFileSync(path.join(D,'arrive.js'),'utf8');

const setup=`
window.AR_JAMES=${JSON.stringify(james)};
window.AR_BOOT={next:${JSON.stringify(bootNewFull)},shipped:${JSON.stringify(bootOld)}};
window.AR_BUILD=${JSON.stringify({commit:commit})};`;

let out=src.slice(0,b0)+bootNewFull+'\n'+src.slice(b1);
/* the boot's sheet goes in the head, after the product's own, so it is
   styled before the first paint exactly as the shipped boot is */
const h=out.indexOf('</head>');
out=out.slice(0,h)+'<style id="ar-boot-css">\n'+css+'\n</style>\n'+out.slice(h);
const inject='\n<!-- ===== THE ARRIVAL PROTOTYPE, round EQ. Not part of the product build. ===== -->\n'
 +'<style id="ar-css">\n'+acss+'\n</style>\n'
 +'<script id="ar-setup">'+setup+'</script>\n'
 +'<script id="ar-js">\n'+ajs+'\n</script>\n';
const at=out.lastIndexOf('</body>');
out=out.slice(0,at)+inject+out.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Arrival prototype, over $1</title>');
fs.writeFileSync(path.join(D,'arrival.html'),out);
const m=src.match(/data-build="([^"]+)"/);
const md5=crypto.createHash('md5').update(src).digest('hex');
const omd5=crypto.createHash('md5').update(out).digest('hex');
console.log('wrote proto/arrival/arrival.html over HEAD '+commit+', build '+(m?m[1]:'?')
 +', source md5 '+md5+', out md5 '+omd5+', '+(out.length/1024|0)+' KB');
console.log('sectors',BANDS.map(b=>b+' '+sector[b].n).join(', '));
