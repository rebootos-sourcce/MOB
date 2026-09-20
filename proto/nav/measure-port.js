/* THE PORT, MEASURED ON THE REAL BUILD AND NOT ON A MOCK.

   NODE_PATH=/opt/node22/lib/node_modules node proto/nav/measure-port.js

   It opens source.html, reads the chrome as it ships, then applies the port's
   two changes in the page and reads the chrome again:

     1. the bar carries four doors instead of nine
     2. the sharpening: bar padding, strip gap, label size, weight spread, and
        the sub bar folded onto the bar's own edge instead of a second slab

   Nothing is written. atuned_src is untouched and this is a reading, not an
   edit. The mock in index.html is lighter than the build, so a number taken
   off the mock would have understated what the change costs.
*/
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');

/* THE SHARPENING, AS ONE SHEET. Every rule here is a number against a
   measured before, and the tap floor is not one of them: the doors stay 44
   high and the density comes out of the chrome around them. */
const SHARP=`
.top{padding:6px 13px;gap:8px;row-gap:4px}
#tabbar{gap:2px;border-bottom:0}
.tabtop{padding:8px 9px;font-size:13px;font-weight:420;letter-spacing:.01em}
.tabtop[aria-pressed=true]{font-weight:600;letter-spacing:.01em}
/* THE SUB BAR STOPS BEING A SECOND SLAB and becomes the bar's second row. One
   row, two jobs, in one order: the open door's children first, then the
   surface's own tools behind a rule. At a width where the two do not fit it
   wraps, which is the rule this project already holds: wrap, never hide. */
.subbar{padding:0 13px;background:transparent!important;border-top:1px solid var(--edge);
 display:flex;align-items:center;gap:0;flex-wrap:wrap;min-height:44px}
#navkids{flex:0 0 auto}
#navkids+#vbar,#navkids+div{position:relative}
#vbar,#lbar,#rbar{min-height:44px;align-items:center}
.subbar>#vbar:not(:empty),.subbar>#lbar:not(:empty){
 margin-left:10px;padding-left:10px;border-left:1px solid var(--edge)}
`;
/* and the ruling: the second row starts at the first menu item, not the logo */
const ALIGN=`.subbar{padding-left:var(--navgut,13px)}`;

const FOUR=['Ritual','Story','Tools','Insight'];

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--disable-background-networking','--no-first-run','--disable-sync',
   '--disable-component-update','--disable-domain-reliability']});
 const out={};
 for(const w of [1600,1280,390]){
  const p=await b.newPage({viewport:{width:w,height:1000}});
  await p.goto('file://'+path.resolve(__dirname,'..','..','source.html'));
  await p.waitForTimeout(1100); await p.keyboard.press('Space'); await p.waitForTimeout(900);

  const read=()=>p.evaluate(()=>{
   const h=s=>{const e=document.querySelector(s);if(!e)return 0;
    const r=e.getBoundingClientRect();
    return getComputedStyle(e).display==='none'?0:Math.round(r.height);};
   const bar=document.getElementById('tabbar');
   const btns=[...bar.querySelectorAll('.tabtop')].filter(b=>b.offsetParent!==null);
   const past=btns.filter(b=>b.getBoundingClientRect().right>bar.getBoundingClientRect().right+1);
   const first=btns[0]?Math.round(btns[0].getBoundingClientRect().left):0;
   const sub=document.getElementById('subbar');
   const subKid=sub&&sub.querySelector('button');
   return {top:h('.glass.top'),sub:h('#subbar'),doors:btns.length,
    past:past.map(b=>b.textContent.trim()),
    firstDoorX:first,
    /* MEASURED BUTTON TO BUTTON. His ruling is about where the first word
       starts, and a box to box read counts each one's own padding twice. */
    subX:subKid?Math.round(subKid.getBoundingClientRect().left):null,
    firstDoorBtnX:btns[0]?Math.round(btns[0].getBoundingClientRect().left):null,
    small:[...document.querySelectorAll('#tabbar .tabtop')].filter(b=>{
     const r=b.getBoundingClientRect();return r.width>0&&(r.width<44||r.height<44);}).length};});

  await p.evaluate(k=>setTab(k),2);  await p.waitForTimeout(250);
  const beforeField=await read();
  await p.evaluate(k=>setTab(k),1);  await p.waitForTimeout(250);
  const beforeSummary=await read();

  /* THE PORT, APPLIED IN THE PAGE, IN THE ORDER THE PORT WILL APPLY IT.

     The sheet lands first and the gutter is read after it, because reading a
     position before restyling the thing that sets it measures the old layout.
     The first cut did exactly that and reported the second row starting at
     23px under doors that start at 124. */
  await p.evaluate(([sharp,align,four])=>{
   const bar=document.getElementById('tabbar');
   [...bar.querySelectorAll('.tabtop')].forEach((b,i)=>{
    if(i<four.length){b.querySelector('.n').textContent=four[i];}
    else b.remove();});
   const st=document.createElement('style');
   st.textContent=sharp+align; document.head.appendChild(st);
   /* THE SUB BAR CARRIES THE OPEN DOOR'S CHILDREN AS ITS FIRST ROW, and it is
      on every surface now because every door has a row. Three children is the
      widest case, under Tools. */
   const kids=document.createElement('div');
   kids.id='navkids'; kids.style.cssText='display:flex;gap:2px;align-items:center';
   ['Field','Body','Compass'].forEach(function(n){
    const b=document.createElement('button');
    b.type='button'; b.className='vt tabtop';
    b.innerHTML='<span class="n">'+n+'</span>';
    kids.appendChild(b);});
   document.getElementById('subbar').prepend(kids);
   document.body.classList.add('hassub');
  },[SHARP,ALIGN,FOUR]);
  await p.waitForTimeout(350);
  /* and the gutter, read off the laid out strip rather than typed */
  /* READ OFF THE FIRST DOOR AND NOT OFF THE STRIP THAT HOLDS IT. The strip's
     own left and the first button's left were eight pixels apart, and eight
     pixels is exactly the kind of number that gets typed into a stylesheet and
     then argued about. The ruling is about where the first word starts. */
  /* AND THE SUB BAR'S OWN ORIGIN COMES OFF IT. The strip's left and the first
     button's left were eight pixels apart, and reading the button closed only
     half of it: the sub bar element does not start at the window's left edge,
     it starts at its own margin, so a padding set to the door's absolute x
     lands that margin further right. The gutter is a difference between two
     measured lefts, which is why it cannot be a number typed into a sheet. */
  await p.evaluate(()=>{
   const b=document.querySelector('#tabbar .tabtop');
   const sb=document.getElementById('subbar');
   const x=Math.round(b.getBoundingClientRect().left-sb.getBoundingClientRect().left);
   document.documentElement.style.setProperty('--navgut',Math.max(0,x)+'px');});
  await p.waitForTimeout(250);

  await p.evaluate(k=>setTab(k),2); await p.waitForTimeout(250);
  await p.evaluate(()=>document.body.classList.add('hassub'));
  const afterField=await read();
  await p.evaluate(k=>setTab(k),1); await p.waitForTimeout(250);
  await p.evaluate(()=>document.body.classList.add('hassub'));
  const afterSummary=await read();

  await p.screenshot({path:path.join(__dirname,`port-${w}.png`),clip:{x:0,y:0,width:w,height:Math.min(320,1000)}});
  out[w]={beforeField,beforeSummary,afterField,afterSummary};
  await p.close();
 }
 await b.close();

 const pct=(a,c)=>Math.round((a-c)/a*1000)/10;
 /* A MEASUREMENT NAMES THE BUILD IT WAS TAKEN ON. source.html moves under a
   seat that is reading it, and a figure with no build behind it cannot be
   checked later. The md5 and the commit go on the run. */
 const SRC=path.resolve(__dirname,'..','..','source.html');
 const md5=require('crypto').createHash('md5').update(fs.readFileSync(SRC)).digest('hex');
 let commit=''; try{commit=require('child_process')
  .execSync('git rev-parse --short HEAD',{cwd:__dirname}).toString().trim();}catch(e){}
 let txt='THE PORT, MEASURED ON source.html. '+new Date().toISOString().slice(0,10)
  +'\ncommit '+commit+'   md5 '+md5+'\n';
 for(const w of Object.keys(out)){
  const o=out[w];
  const cb=k=>o['before'+k].top+o['before'+k].sub, ca=k=>o['after'+k].top+o['after'+k].sub;
  txt+='\n== '+w+' wide ==\n'
   +'doors on the bar          '+o.beforeField.doors+' -> '+o.afterField.doors+'\n'
   +'doors past the right edge '+o.beforeField.past.length+' -> '+o.afterField.past.length
   +(o.beforeField.past.length?'   ('+o.beforeField.past.join(', ')+')':'')+'\n'
   +'chrome, Field             '+cb('Field')+'px -> '+ca('Field')+'px   '+pct(cb('Field'),ca('Field'))+' per cent off\n'
   +'  top bar                 '+o.beforeField.top+' -> '+o.afterField.top+'\n'
   +'  sub bar                 '+o.beforeField.sub+' -> '+o.afterField.sub+'\n'
   +'chrome, Summary           '+cb('Summary')+'px -> '+ca('Summary')+'px   '+pct(cb('Summary'),ca('Summary'))+' per cent off\n'
   +'  top bar                 '+o.beforeSummary.top+' -> '+o.afterSummary.top+'\n'
   +'  sub bar                 '+o.beforeSummary.sub+' -> '+o.afterSummary.sub+'\n'
   +'second row first word at  '+o.beforeField.subX+'px -> '+o.afterField.subX
   +'px, first door at '+o.afterField.firstDoorBtnX+'px\n'
   +'doors under the 44 floor  '+o.afterField.small+'\n';
 }
 fs.writeFileSync(path.join(__dirname,'port.log'),txt);
 console.log(txt);})();
