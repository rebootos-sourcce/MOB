/* Release session mockups, 17 October 2026. Joins the shared parts and one
   version into a single self contained page per version.
   Run from the repo root (engine.js must be built, it is committed):
     node mockups/release/src/build.js

   NOTHING A PERSON HEARS OR READS ON THE RUN IS TYPED HERE. It is read out of
   the product at build time:
   - the "I am" lines are the printed Anxiety card (No.01), through the
     engine's own relLine at three real addresses whose fetter is Anticipation,
     so they are the owner's sentences, verbatim, cycled the way the product
     cycles them. They are NOT what the product says at Fear, Control and
     Insecurity today: there every line is one sentence (see README).
   - the welcome lines are REL_WELCOME in ui/release.js
   - the speech timing is REL_WORD_S, REL_GAP_S and REL_FRAME_S in ui/release.js
   - the two minutes is REL_SETTLE_S in ui/release.js
   - the crisis words and numbers are engine/data/crisis.js
   - the allowance is tier one's grant and period in engine/plan.js
   - the seat colours, the accent and the face are shell/head.html
   - the marks are REL_IC in ui/release.js, the figure is engine/data/figure.js
   The lines the owner gave on 17 October (the session opening, the beginning
   resonance, the new prompt and the cooldown) are his words and are typed in
   shared.js under W, in one place, so the voice gate reads one list. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'../../..'),dir=__dirname,out=path.join(dir,'..');
const rd=f=>fs.readFileSync(path.join(dir,f),'utf8');
const src=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const E=require(path.join(ROOT,'engine.js'));

/* ---- the session: three addresses that run on the printed Anxiety card ---- */
const NAMES=['Anxiety','Expectation','Hypervigilance'];
const ADDR=NAMES.map(k=>{const n=E.W.filter(x=>x.k===k)[0];if(!n)throw new Error('no address '+k);return n;});
const SEATCSS={Root:'--root',Sacral:'--sacral',Solar:'--solar',Heart:'--heart',Throat:'--throat','3rd Eye':'--eye',Crown:'--crown'};
const SEATWORD={Root:'root',Sacral:'sacral',Solar:'solar plexus',Heart:'heart','3rd Eye':'third eye',Throat:'throat',Crown:'crown'};
const STEM=E.C3_STEM,TRUTH=E.C3_TRUTH;
const tail=(t,stem)=>{if(t.indexOf(stem)!==0)throw new Error('a line that does not open on its stem: '+t);return t.slice(stem.length).replace(/\.$/,'');};
/* the order the product runs an address in: left release, right release, left reframe, right reframe */
const CH=[['L','limit'],['R','limit'],['L','truth'],['R','truth']];
const SESSION={addr:ADDR.map(n=>{
 const ch=CH.map(([s,p])=>{const seen=[];for(let i=0;i<E.LINES_PER_CH;i++){const l=E.relLine(n,s+p,i);
  const t=tail(l.text,p==='truth'?TRUTH:STEM);if(seen.indexOf(t)<0)seen.push(t);}
  return {side:s,half:p==='truth'?'reframe':'release',lines:seen};});
 return {k:n.k,seat:n.b,seatWord:SEATWORD[n.b],place:n.n,col:SEATCSS[n.b],src:E.relLine(n,'Llimit',0).src,ch};})};
if(SESSION.addr.some(a=>a.ch.some(c=>c.lines.length<2)))throw new Error('an address with one sentence: the mockup must not show the broken case as the fix');

/* ---- the run's own constants, off ui/release.js ---- */
const rel=src('atuned_src/ui/release.js');
const num=(re,nm)=>{const m=rel.match(re);if(!m)throw new Error(nm+' not found in release.js');return +m[1];};
const TIMING={word:num(/REL_WORD_S=([\d.]+)/,'REL_WORD_S'),gap:num(/REL_GAP_S=([\d.]+)/,'REL_GAP_S'),
 frame:num(/REL_FRAME_S=([\d.]+)/,'REL_FRAME_S'),settle:num(/var REL_SETTLE_S=(\d+)/,'REL_SETTLE_S'),doses:[25,50,100]};
const wl=rel.match(/var REL_WELCOME=\[([\s\S]*?)\];/);if(!wl)throw new Error('REL_WELCOME not found');
const WELCOME=vm.runInNewContext('['+wl[1]+']');
const ic=rel.match(/var REL_IC=\{([\s\S]*?)\};\nfunction relIc/);if(!ic)throw new Error('REL_IC not found');
const IC=vm.runInNewContext('({'+ic[1].replace(/\/\*[\s\S]*?\*\//g,'')+'})');

/* ---- the allowance: tier one, read off the plan ---- */
const T1=E.PLAN_BY.one;if(!T1||!T1.grant)throw new Error('tier one has no grant');
const ALLOW={tier:T1.nm,grant:T1.grant,per:T1.per,patternsPerAddress:CH.length};

/* ---- the crisis door ---- */
const CRISIS={say:E.CRISIS_SAY,lines:E.CRISIS_LINES};

/* ---- the colours and the face ---- */
const head=src('atuned_src/shell/head.html');
const tok=k=>{const m=head.match(new RegExp(k.replace(/-/g,'\\-')+':(#[0-9A-Fa-f]{6})'));if(!m)throw new Error(k+' not in head.html');return m[1];};
const COL={};['--root','--sacral','--solar','--heart','--throat','--eye','--crown','--accent','--ink','--mid','--dim','--alarm'].forEach(k=>COL[k]=tok(k));
const f0=head.indexOf("@font-face{font-family:'Inter'"),f1=head.indexOf('}',f0);
if(f0<0||f1<0)throw new Error('the embedded Inter was not found in head.html');
const FONT=head.slice(f0,f1+1);
const fctx={};vm.createContext(fctx);
vm.runInContext(src('atuned_src/engine/data/figure.js').replace(/\bconst\s+/g,'var '),fctx);
const BODY={d:fctx.BODYPATH,s:fctx.PMS,tx:fctx.PMTX,ty:fctx.PMTY};

const VERSIONS=[
 {id:'r1-one-stream',n:1,name:'One stream',file:'r1.js',css:'r1.css'},
 {id:'r2-three-bands',n:2,name:'Three bands',file:'r2.js',css:'r2.css'},
 {id:'r3-the-dial',n:3,name:'The dial',file:'r3.js',css:'r3.css'},
 {id:'r4-the-figure',n:4,name:'The figure',file:'r4.js',css:'r4.css'}];
const pick=process.argv[2]?process.argv[2].split(','):null;
const seatCss=':root{'+Object.keys(COL).map(k=>k+':'+COL[k]).join(';')+'}\n';
VERSIONS.forEach(v=>{
 if(!fs.existsSync(path.join(dir,v.file)))return;
 if(pick&&!pick.some(p=>v.id.startsWith(p)))return;
 const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
  +'<title>Release, '+v.name.toLowerCase()+'</title>\n<style>\n'+FONT+'\n'+seatCss+rd('shared.css')+'\n'+rd(v.css)+'\n</style></head>\n'
  +'<body class="punch">\n'
  +'<noscript><p style="padding:24px;color:#EFEDE8">This mockup draws with script. Open it in a browser with script on.</p></noscript>\n'
  +'<div id="app"></div>\n<script>\n"use strict";\n'
  +'const VERSION='+JSON.stringify({id:v.id,n:v.n,name:v.name})+';\n'
  +'const VERSIONS='+JSON.stringify(VERSIONS.map(x=>({id:x.id,n:x.n,name:x.name})))+';\n'
  +'const SESSION='+JSON.stringify(SESSION)+';\nconst TIMING='+JSON.stringify(TIMING)+';\nconst WELCOME='+JSON.stringify(WELCOME)+';\n'
  +'const IC='+JSON.stringify(IC)+';\nconst ALLOW='+JSON.stringify(ALLOW)+';\nconst CRISIS='+JSON.stringify(CRISIS)+';\n'
  +'const BODY='+JSON.stringify(BODY)+';\n'+rd('shared.js')+'\n'+rd(v.file)+'\nboot();\n</script>\n</body></html>\n';
 if(html.indexOf('—')>=0)throw new Error('em dash in '+v.id);
 if(/https?:\/\//.test(html.replace(/http:\/\/www\.w3\.org\/2000\/svg/g,'')))throw new Error('a network address in '+v.id);
 fs.writeFileSync(path.join(out,v.id+'.html'),html);
 console.log('wrote',v.id+'.html',Math.round(html.length/1024)+' KB');});
console.log('session',SESSION.addr.map(a=>a.k+' ('+a.seat+', '+a.place+') '+a.ch.map(c=>c.lines.length).join('/')+' sentences, '+a.src).join(' | '));
console.log('timing',JSON.stringify(TIMING),'allowance',JSON.stringify(ALLOW));
