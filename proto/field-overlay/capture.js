/* CAPTURE. Every connection the overlay mockups animate is taken off the live
   build, never typed in. No line in these looks is one somebody chose.

   For each of three reference profiles, at 1600x1000 and at 390x844:

     plates/<who>-<w>-ship.png   the Field as it ships, at the Chains depth,
                                 which is the first depth that draws the
                                 whole chain from address to character
     plates/<who>-<w>-dim.png    the same frame with the web at the wheel's
                                 own selection alpha, .08. That is what the
                                 wheel already does to every other chord when
                                 one is pinned, so the overlay's "everything
                                 else steps back" is the product's own dim
                                 and not a new one
     data-<who>.js               every chord, as the three points the wheel's
                                 own quad() strokes it through, plus the
                                 numbers the looks are driven by

   The three are Sofia (30 connections, the sparse case), James (141, the
   profile the Field ring renditions were drawn from) and Gordon (193, the
   worst case profile the design gate measures frame rate on). Each has its
   own story bank lines from sim/stories.js committed the way the Story tab
   commits them, as proto/field-rings/capture.js does, so the atom counts per
   address are real.

   Looked up by name, never by position in PEOPLE.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/capture.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),crypto=require('crypto'),cp=require('child_process');
const DIR=__dirname, PL=path.join(DIR,'plates');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const {STORYBANK}=require(path.resolve('sim/stories.js'));
const WHO=['Sofia','James','Gordon'];
const SIZES=[[1600,1000],[390,844]];
fs.mkdirSync(PL,{recursive:true});
(async()=>{
 const src=path.resolve('source.html');
 const md5=crypto.createHash('md5').update(fs.readFileSync(src)).digest('hex');
 let commit='unknown',dirty='';
 try{commit=cp.execSync('git rev-parse --short HEAD').toString().trim();
  dirty=cp.execSync('git status --short -- source.html atuned_src').toString().trim()?' (tree dirty)':'';}catch(e){}
 const b=await chromium.launch({executablePath:EXE});
 const errs=[];
 for(const who of WHO){
  const data={who,build:{commit:commit+dirty,md5},sizes:{}};
  for(const [W_,H_] of SIZES){
   const p=await b.newPage({viewport:{width:W_,height:H_}});
   p.on('pageerror',e=>errs.push(who+' '+W_+': '+e.message));
   await p.goto('file://'+src);
   await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
   await p.waitForTimeout(300);
   const d=await p.evaluate(([nm,bank])=>{
    const i=PEOPLE.findIndex(x=>x.nm===nm); loadP(i);
    const lines=(bank[nm]||[]).map(x=>x[1]);
    lines.forEach(function(t,k){
     applyStory(t); verpApply(t); if(typeof leanApply==='function')leanApply(t);
     if(CURP){CURP.story=CURP.story||{entries:[]};
      const ps=parseStory(t);
      CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,
       imprints:ps.imprints.length,bands:ps.bands});}});
    setTab(TAB.FIELD);
    if(typeof fviewSet==='function')fviewSet('wheel');
    /* the depth is chosen by pressing its own button, found by its name, so
       the bar above the wheel says Chains and not whatever it said before */
    S.zoom=1; S.panx=0; S.pany=0;
    const ch=[...document.querySelectorAll('#vbar .vt')].find(b=>/Chains/.test(b.textContent));
    if(ch)ch.click(); else S.view=2;
    S.pin=null;
    if(typeof layout==='function')layout();
    render();
    return {n:lines.length};},[who,STORYBANK]);
   /* past the Field's one time assembly (900ms) and the address ease */
   await p.waitForTimeout(1800);
   const geo=await p.evaluate(()=>{
    const r=compute(), L=2;
    const R={shell:U*.74,sab:U*.545,cx:U*.425,hy:U*.335,sup:U*.255};
    const w01=o=>clamp((((o&&o.w)||0)-3.5)/3.0,0,1);
    const ten01=n=>clamp((((n&&n.susc)||1)-0.45)/0.85,0,1);
    const sag=(base,t)=>base*(1.28-0.62*t);
    const r2=x=>Math.round(x*1000)/1000;
    const pt=(a,rad)=>[r2(CX+Math.cos(a)*rad),r2(CY+Math.sin(a)*rad)];
    const AT=(typeof atomIndex==='function'&&atomIndex())||{};
    /* the wheel's quad(), reduced to its three points */
    const Q=(a0,r0,a1,r1,pull)=>{const am=meanAng([a0,a1]),rm=(r0+r1)/2*pull;
     return [pt(a0,r0),pt(am,rm),pt(a1,r1)];};
    const links=[];
    /* LOAD IS THE CHARGE THE LINE CARRIES INTO THE NEXT RING, on the one 0 to
       10 scale every level already shares: an address's sq, a pattern's w,
       and w is itself a mean of the sq under it. TENSION is what the wheel
       already draws as the chord's sag: susceptibility on the outer threads,
       the child's own weight on the inner ones. */
    r.sabs.forEach((s,si)=>s.parts.forEach(n=>links.push({lv:0,from:'a'+n.i,to:'s'+si,
     q:Q(n.ang,R.shell*.92,s.ang,R.sab,sag(.42,ten01(n))),
     load:r2(n.sq||0),ten:r2(ten01(n)),pw:r2(w01(s)),col:bc(n.b).map(Math.round),
     stories:(AT[n.i]||[]).length,unnamed:!!s.unnamed,
     nm:n.k+' into '+s.nm})));
    r.cxs.forEach((c,ci)=>c.parts.forEach(s=>links.push({lv:1,from:'s'+r.sabs.indexOf(s),to:'c'+ci,
     q:Q(s.ang,R.sab,c.ang,R.cx,sag(.44,w01(s))),
     load:r2(s.w||0),ten:r2(w01(s)),pw:r2(w01(c)),col:bc('Solar').map(Math.round),
     stories:s.parts.reduce((a,n)=>a+(AT[n.i]||[]).length,0),nm:s.nm+' into '+c.nm})));
    r.hys.forEach((h,hi)=>h.parts.forEach(c=>links.push({lv:2,from:'c'+r.cxs.indexOf(c),to:'h'+hi,
     q:Q(c.ang,R.cx,h.ang,R.hy,sag(.46,w01(c))),
     load:r2(c.w||0),ten:r2(w01(c)),pw:r2(w01(h)),col:bc('Sacral').map(Math.round),
     stories:0,nm:c.nm+' into '+h.nm})));
    r.sups.forEach((u,ui)=>u.parts.forEach(h=>links.push({lv:3,from:'h'+r.hys.indexOf(h),to:'u'+ui,
     q:Q(h.ang,R.hy,u.ang,R.sup,sag(.48,w01(h))),
     load:r2(h.w||0),ten:r2(w01(h)),pw:r2(w01(u)),col:bc('Root').map(Math.round),
     stories:0,nm:h.nm+' into '+u.nm})));
    /* the nodes a line can end on, so a pulse can land on the bead it feeds */
    const nodes={};
    W.forEach(n=>{nodes['a'+n.i]={p:pt(n.ang,R.shell*.92),s:2.2,col:bc(n.b).map(Math.round),nm:n.k,load:r2(n.sq||0)};});
    r.sabs.forEach((s,i)=>{nodes['s'+i]={p:pt(s.ang,R.sab),s:5.4,col:bc(s.parts[0].b).map(Math.round),nm:s.nm,load:r2(s.w)};});
    r.cxs.forEach((c,i)=>{nodes['c'+i]={p:pt(c.ang,R.cx),s:7.2,col:bc('Solar').map(Math.round),nm:c.nm,load:r2(c.w)};});
    r.hys.forEach((h,i)=>{nodes['h'+i]={p:pt(h.ang,R.hy),s:10,col:bc('Sacral').map(Math.round),nm:h.nm,load:r2(h.w)};});
    r.sups.forEach((u,i)=>{nodes['u'+i]={p:pt(u.ang,R.sup),s:13,col:bc('Root').map(Math.round),nm:u.nm,load:r2(u.w)};});
    const cv=document.getElementById('cv').getBoundingClientRect();
    const st=document.getElementById('stage');
    const fv=document.getElementById('fview'), fvr=fv?fv.getBoundingClientRect():null;
    const sr=st.getBoundingClientRect();
    return {cv:{x:cv.x,y:cv.y,w:cv.width,h:cv.height},CX,CY,U,DPR,
     fview:fvr?{x:fvr.x,y:fvr.y,w:fvr.width,h:fvr.height}:null,
     stage:{x:sr.x,y:sr.y,w:sr.width,h:sr.height},view:S.view,
     ground:getComputedStyle(st).backgroundColor,light:LIGHT(),
     CQ:r2(r.CQ),tier:r.tier,counts:{sab:r.sabs.length,cx:r.cxs.length,hy:r.hys.length,sup:r.sups.length},
     links,nodes};});
   const tag=who.toLowerCase()+'-'+W_;
   await p.screenshot({path:path.join(PL,tag+'-ship.png')});
   /* the wheel's own selection dim. A pin that belongs to no chain sends
      every chord to .08, which lit() in ui/wheel.js does for a real pin. It
      is set for one frame and taken off again: the rails are not asked to
      read it, the canvas is repainted with it and shot. */
   await p.evaluate(()=>{S.pin={nm:'',parts:[],kind:'none'};DRAW_SIG=null;
    try{draw(compute());}catch(e){} });
   await p.screenshot({path:path.join(PL,tag+'-dim.png')});
   await p.evaluate(()=>{S.pin=null;});
   data.sizes[W_]=geo; data.stories=d.n;
   await p.close();}
  fs.writeFileSync(path.join(DIR,'data-'+who.toLowerCase()+'.js'),
   '/* Written by capture.js off the live build. Do not edit by hand: run it again. */\n'
   +'(window.OV=window.OV||{})['+JSON.stringify(who)+']='+JSON.stringify(data)+';\n');
  const g=data.sizes[1600];
  console.log(who,'stories',data.stories,'CQ',g.CQ,g.tier,'links',g.links.length,JSON.stringify(g.counts));}
 console.log('build',commit+dirty,'md5',md5);
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
