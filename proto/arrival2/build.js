/* ============================================================
   BUILD THE FOUR ARRIVALS. Round EV in TASKS.md.

     committed source.html + committed engine + ET's committed boot
       + vx.css + vx-engine.js + vx-ctl.js  ->  arrival2.html

   IT READS THE COMMITTED BUILD, NOT THE WORKING TREE, exactly as ET's
   build does, because other seats have work in flight in the tree. The
   seat colours and each seat's sector are read off the committed engine at
   build time, so the ring every version draws is the Field's, to the slot.

   ET's own boot, the one he praised, is read out of ET's committed
   prototype and carried in beside the four, so the comparison is always
   against the real thing. Nothing under atuned_src/ is touched.

     node proto/arrival2/build.js
     node tools/pack.js proto/arrival2/arrival2.html proto/arrival2/arrival-styles.html
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const git=a=>cp.execSync('git '+a,{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const src=git('show HEAD:source.html');
const commit=git('rev-parse --short HEAD').trim();
const tmp=path.join(os.tmpdir(),'arrival2-engine-'+process.pid+'.js');
fs.writeFileSync(tmp,git('show HEAD:engine.js'));
const E=require(tmp); fs.unlinkSync(tmp);
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const james=(STORYBANK.James||[]).map(x=>x[1]);
if(james.length!==5)throw new Error('James story bank changed shape: '+james.length);

/* ---------------- the loop, as frMount lays it ---------------- */
const BANDS=E.BANDS, PAL=E.PAL, W=E.W, N=W.length;
const sector={};
W.forEach((n,s)=>{const q=sector[n.b]||(sector[n.b]={s0:s,s1:s,n:0});q.s1=s;q.n++;});
let prev=-1;BANDS.forEach(b=>{const q=sector[b];if(!q||q.s0!==prev+1||q.s1-q.s0+1!==q.n)throw new Error('seat '+b+' is not contiguous on the loop');prev=q.s1;});
const VX_G={N,seats:BANDS.map(b=>({b,c:PAL[b],s0:sector[b].s0,n:sector[b].n}))};

/* the light behind: seven pools of the seats' own colour on their own
   bearings, ET's formula, in a layer two and a half figures wide */
const washW=2.6;
const wash=BANDS.map(b=>{const q=sector[b],tm=((q.s0+q.s1+1)/2)/N*360;
 const a=(tm-90)*Math.PI/180, rr=.44/washW*100;
 const x=50+Math.cos(a)*rr, y=50+Math.sin(a)*rr, h=PAL[b];
 const rgb=[1,3,5].map(k=>parseInt(h.slice(k,k+2),16)).join(',');
 return 'radial-gradient(circle at '+x.toFixed(1)+'% '+y.toFixed(1)+'%, rgba('+rgb+',.20) 0, rgba('+rgb+',.07) 9%, rgba('+rgb+',0) 19%)';})
 .concat(['radial-gradient(circle at 50% 50%, rgba(126,184,212,.16) 0, rgba(126,184,212,0) 12%)']).join(',');

/* ---------------- the shipped boot, and its wordmark, verbatim ---------------- */
const b0=src.indexOf('<div id="boot"'), b1=src.indexOf('<canvas id="bgaura"');
if(b0<0||b1<0||b1<b0)throw new Error('cannot find the boot sheet in source.html');
const bootOld=src.slice(b0,b1).replace(/\s+$/,'');
const w0=bootOld.indexOf('<div class="boot-wm">');
const wordmark=bootOld.slice(w0,bootOld.indexOf('</div>',bootOld.indexOf('</span>\n',w0))+6);
if(w0<0||!/Source OS/.test(wordmark))throw new Error('cannot find the wordmark');

/* ---------------- ET's boot, the one he praised, from its committed build ---------------- */
const et=git('show HEAD:proto/arrival/arrival.html');
const m=et.match(/window\.AR_BOOT=\{next:("(?:[^"\\]|\\.)*")/);
if(!m)throw new Error('cannot find ET\'s boot in proto/arrival/arrival.html');
const etBoot=JSON.parse(m[1]);
const etCss=git('show HEAD:proto/arrival/boot.css');
if(!/class="boot bx"/.test(etBoot))throw new Error('ET\'s boot changed shape');

const sheet=`<div id="boot" class="boot vx" data-v="breath" aria-hidden="true">
 <div class="vx-stage"><div class="vx-wash"></div><canvas class="vx-cv"></canvas></div>
 ${wordmark}
</div>`;

const css=fs.readFileSync(path.join(D,'vx.css'),'utf8').split('background:WASH').join('background:'+wash);
const eng=fs.readFileSync(path.join(D,'vx-engine.js'),'utf8');
const ctl=fs.readFileSync(path.join(D,'vx-ctl.js'),'utf8');

/* the engine runs straight after the sheet, before the app's own script is
   parsed, so the first frame is drawn while the instrument is still loading */
let out=src.slice(0,b0)+sheet+'\n<script id="vx-engine">window.VX_G='+JSON.stringify(VX_G)+';\n'+eng+'\n</script>\n'+src.slice(b1);
const h=out.indexOf('</head>');
out=out.slice(0,h)+'<style id="vx-et-css">\n'+etCss+'\n</style>\n<style id="vx-css">\n'+css+'\n</style>\n'+out.slice(h);
const setup=`
window.VX_JAMES=${JSON.stringify(james)};
window.VX_SHEET=${JSON.stringify(sheet)};
window.VX_ET=${JSON.stringify(etBoot)};
window.VX_BUILD=${JSON.stringify({commit})};`;
const inject='\n<!-- ===== FOUR MORE ARRIVALS, round EV. Not part of the product build. ===== -->\n'
 +'<script id="vx-setup">'+setup+'</script>\n<script id="vx-ctl">\n'+ctl+'\n</script>\n';
const at=out.lastIndexOf('</body>');
out=out.slice(0,at)+inject+out.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Arrival styles, over $1</title>');
if(/\u2014/.test(css+eng+ctl+sheet))throw new Error('an em dash in the prototype\'s own text');
fs.writeFileSync(path.join(D,'arrival2.html'),out);
const bm=src.match(/data-build="([^"]+)"/);
console.log('wrote proto/arrival2/arrival2.html over HEAD '+commit+', build '+(bm?bm[1]:'?')
 +', source md5 '+crypto.createHash('md5').update(src).digest('hex')+', '+(out.length/1024|0)+' KB');
console.log('sectors',BANDS.map(b=>b+' '+sector[b].n).join(', '));
