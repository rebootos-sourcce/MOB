/* ============================================================
   MEASURE THE LAYOUTS, THE WAY A USABILITY SESSION WOULD COUNT THEM.
     NODE_PATH=<playwright> node proto/story-redesign2/src/measure.js

   Nothing in here is judgement. Every figure is read off a real Chromium, on
   each ICP's own words from sim/stories.js typed into the journal, at 1600 by
   1000 and at 390 by 844, inside the product's own frame: the band and rail
   the committed source.html measures on the Story tab (85px down and 78px in
   at 1600; 121px down and a 59px foot bar at 390).

   The control group is round HX's own B (Route) and C (Trace), the two he
   singled out, placed in the same frame: their proposal strip is hidden and
   the product's band and rail are reserved in its place, so the old and the
   new are measured on the same screen.

   Per layout, per width, per person:
     fold        how much of the journal, the instrument and the Run button
                 sits on the first screen, as a fraction of each
     scrollRun   how far a person must scroll before Run is whole on screen
     choices     interactive controls on the first screen, excluding the
                 proposal chrome. The working memory target is under 12
     small       of those, how many are under the 44 by 44 touch floor
     words       words of interface text on the first screen, not counting
                 the person's own entry
     minFont     the smallest text on the first screen, in px
     fitts       Fitts index of difficulty, in bits, summed over the path the
                 loop asks for: journal, then Commit, then Run. A hop to a
                 target off screen adds the scroll to the distance
     reversals   how many times the eye's path through the loop (prompt,
                 journal, instrument, list, release) turns back on itself
     hscroll     whether the page scrolls sideways at all
   And per line of every ICP's story bank, the engine's own read: what was
   kept, what was negated, how many imprints and how many of those the words
   did not name, whether Source AI asks, and whether a release has a queue.
   ============================================================ */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const HERE=path.join(__dirname,'..'),ROOT=path.join(HERE,'..','..');
const NEW=path.join(HERE,'story-redesign2.html'),OLD=path.join(ROOT,'proto','story-redesign','story-redesign.html');
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const PEOPLE_=['Sofia','Diane','Marcus','Angela','Derek','James','Ana','Gordon','Rosa'];
const FRAME={1600:{top:85,left:78,foot:0,H:1000},1440:{top:85,left:78,foot:0,H:900},390:{top:121,left:0,foot:59,H:844}};
const PAGES=[['e',NEW,'#e'],['f',NEW,'#f'],['g',NEW,'#g'],['h',NEW,'#h'],['hx-b',OLD,'#b'],['hx-c',OLD,'#c']];
function entryOf(nm){return STORYBANK[nm].map(r=>r[1]).join(' ');}

async function geometry(p,fr){return p.evaluate((fr)=>{
 const vt=fr.top,vb=fr.H-fr.foot,W=innerWidth;
 const proto=e=>!!(e.closest&&e.closest('[data-proto],.proto,.mk,.mkidea,.notes'));
 const vis=r=>Math.max(0,Math.min(r.bottom,vb)-Math.max(r.top,vt))*Math.max(0,Math.min(r.right,W)-Math.max(r.left,0));
 const frac=el=>{if(!el)return 0;const r=el.getBoundingClientRect(),a=r.width*r.height;return a?vis(r)/a:0;};
 const shown=el=>{if(!el)return false;const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};
 const ta=document.getElementById('ta'),st=document.getElementById('stage'),go=document.getElementById('rlgo'),
  cm=document.getElementById('commit'),pe=document.getElementById('pe'),grp=document.querySelector('#imps .grp'),rl=document.getElementById('rl');
 const out={};
 out.fold={journal:+frac(ta).toFixed(2),instrument:+frac(st).toFixed(2),list:+frac(grp).toFixed(2),run:+frac(go).toFixed(2),prompt:+frac(pe).toFixed(2)};
 const gr=go.getBoundingClientRect();out.scrollRun=Math.max(0,Math.round(gr.bottom-vb));
 out.runFixed=getComputedStyle(rl).position==='fixed';
 /* controls on the first screen */
 const ctl=[...document.querySelectorAll('button,textarea,select,input,a[href],[tabindex]')].filter(e=>!proto(e)&&shown(e)&&vis(e.getBoundingClientRect())>0);
 out.choices=ctl.length;out.small=ctl.filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44;}).length;
 out.smallList=ctl.filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44;}).map(e=>(e.id||e.className||e.tagName)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)).slice(0,6);
 /* interface words on the first screen, and the smallest text */
 let words=0,minF=99;const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=tw.nextNode())){const par=n.parentElement;if(!par||proto(par)||par.closest('#hl,#ta,script,style,.flt'))continue;const t=n.nodeValue.trim();if(!t)continue;
  if(!shown(par))continue;const rg=document.createRange();rg.selectNodeContents(n);const r=rg.getBoundingClientRect();if(!vis(r))continue;
  words+=t.split(/\s+/).length;minF=Math.min(minF,parseFloat(getComputedStyle(par).fontSize));}
 out.words=words;out.minFont=minF;
 /* the path the loop asks for, journal to Commit to Run */
 const c=el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:Math.min(r.width,r.height)};};
 const hop=(a,b)=>{const A=c(a),B=c(b);let D=Math.hypot(B.x-A.x,B.y-A.y);const off=b.getBoundingClientRect().bottom>vb&&!out.runFixed;return Math.log2(D/B.w+1)+(off?1:0);};
 out.fitts=+(hop(ta,cm)+hop(cm,go)).toFixed(2);
 /* the eye's path round the loop, in the order the content moves. Counted
    two ways and judged neither: how often the eye must go back up the page,
    and how often back to the left. A new column is a return to the top and is
    normal reading; it is recorded, not penalised. */
 const seq=[pe,ta,st,grp||st,rl].map(c);let up=0,left=0,len=0;
 for(let i=1;i<seq.length;i++){const dx=seq[i].x-seq[i-1].x,dy=seq[i].y-seq[i-1].y;len+=Math.hypot(dx,dy);if(dy<-150)up++;if(dx<-150)left++;}
 out.upReturns=up;out.leftReturns=left;out.eyePath=Math.round(len);
 /* how far the reward lands from where the person is typing: the flight goes
    from the word to its lane, and a lane off screen is a reward not seen */
 const A=c(ta),B=c(st);out.rewardDist=Math.round(Math.hypot(B.x-A.x,B.y-A.y));
 out.hscroll=document.documentElement.scrollWidth>innerWidth+1;
 return out;},fr);}

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const R={when:new Date().toISOString(),frame:FRAME,geo:{},engine:{},entries:{}},errs=[];
 for(const [key,file,hash] of PAGES){R.geo[key]={};
  for(const Wd of [1600,1440,390]){const fr=FRAME[Wd];R.geo[key][Wd]={};
   const p=await b.newPage({viewport:{width:Wd,height:fr.H},deviceScaleFactor:1});p.on('pageerror',e=>errs.push(key+Wd+': '+e.message));
   await p.goto('file://'+file+hash);await p.waitForTimeout(500);
   if(key.startsWith('hx'))await p.addStyleTag({content:`.proto,.mk,.mkidea{display:none!important}body{padding:${fr.top}px 0 ${fr.foot}px ${fr.left}px!important}`});
   for(const nm of PEOPLE_){
    if(!key.startsWith('hx'))await p.evaluate(n=>{if(PROTO.who)PROTO.who(n);},nm);
    await p.evaluate(()=>scrollTo(0,0));
    await p.evaluate(t=>PROTO.type(t),entryOf(nm));await p.waitForTimeout(key.startsWith('hx')?900:700);
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(80);
    R.geo[key][Wd][nm]=await geometry(p,fr);}
   /* the blank page, which is the stranger's first four seconds */
   await p.evaluate(()=>PROTO.type(''));await p.waitForTimeout(300);await p.evaluate(()=>scrollTo(0,0));
   R.geo[key][Wd]._blank=await geometry(p,fr);
   await p.close();}}
 /* the engine's read of every line in the bank, and of each person's whole entry */
 const p=await b.newPage({viewport:{width:1600,height:1000}});p.on('pageerror',e=>errs.push('engine: '+e.message));
 await p.goto('file://'+NEW+'#e');await p.waitForTimeout(400);
 for(const nm of PEOPLE_){R.engine[nm]=[];
  await p.evaluate(n=>PROTO.who(n),nm);
  for(const [why,line] of STORYBANK[nm]){await p.evaluate(t=>PROTO.type(t),line);R.engine[nm].push(Object.assign({why:why,text:line},await p.evaluate(()=>PROTO.state())));}
  await p.evaluate(t=>PROTO.type(t),entryOf(nm));R.entries[nm]=await p.evaluate(()=>PROTO.state());}
 await b.close();
 fs.writeFileSync(path.join(HERE,'measured.json'),JSON.stringify(R,null,1));
 console.log('errors:',errs.length?errs.join('\n'):'none');
 for(const k of Object.keys(R.geo))for(const Wd of [1600,1440,390]){const g=R.geo[k][Wd],a=g.Angela,bl=g._blank;
  console.log(k.padEnd(5),String(Wd).padEnd(5),'fold j/i/run',a.fold.journal,a.fold.instrument,a.fold.run,'scroll',a.scrollRun,'choices',a.choices,'(blank',bl.choices+')','small',a.small,'words',a.words,'min',a.minFont,'fitts',a.fitts,'up',a.upReturns,'left',a.leftReturns,'reward',a.rewardDist,'h',a.hscroll);}
 if(errs.length)process.exit(1);})();
