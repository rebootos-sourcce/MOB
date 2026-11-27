/* MEASURE THE HOVER. Two questions, answered off pixels and clocks, not off
   the code's own intentions.

   1. DOES IT READ WHAT HE ASKED. For every line on James and on Gordon, the
      page is made to hold that line, and the overlay canvas is read back:

        swing     how far the line actually moves at its midpoint, from 1.5
                  to 2.5 seconds after it lands, read as the envelope of
                  its edge to a tenth of a pixel. The midpoint is where the
                  string's second harmonic is zero, so the reading is the
                  string alone.
        density   the alpha the canvas actually holds at 15 percent along
                  the line during the trace, behind the head and clear of
                  the beads, where nothing is displaced or overlapped. Only
                  lines drawn at least 2.2px wide count, since a thinner
                  stroke is partly covered by antialiasing and would read
                  low for a reason that has nothing to do with the chain.

      Then each is set against the number it is meant to carry: swing against
      the line's own charge, density against its chain's weight, as a
      correlation and as a table of named lines. A few named lines are held
      by a real mouse move rather than set by the page, and the two are
      compared, so the sweep is known to measure what a pointer does.

   2. WHAT IT COSTS. Gordon at 1600, the worst case profile: each look on the
      longest line he has (the most points to draw) and on that line's whole
      chain, 300 frames on the page's own virtual clock, each ending in a one
      pixel canvas read so the drawing is rasterised inside the timed span.
      Beside them, CL's Hum at 12 lines and Relay, and the shipped wheel's
      own draw() on the same profile, all in this one run, at this machine's
      speed and with the CPU throttled four times.

   Writes measure-hover.json. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/measure-hover.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname,EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const stat=a=>{a=a.slice().sort((x,y)=>x-y);const m=a.reduce((s,x)=>s+x,0)/a.length;
 return {mean:+m.toFixed(3),p95:+a[Math.floor(a.length*.95)].toFixed(3),max:+a[a.length-1].toFixed(3)};};
function pearson(x,y){const n=x.length,mx=x.reduce((a,b)=>a+b)/n,my=y.reduce((a,b)=>a+b)/n;
 let sxy=0,sx=0,sy=0;for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sx+=(x[i]-mx)**2;sy+=(y[i]-my)**2;}
 return +(sxy/Math.sqrt(sx*sy)).toFixed(4);}
function rank(a){const o=a.map((v,i)=>[v,i]).sort((p,q)=>p[0]-q[0]),r=new Array(a.length);
 for(let i=0;i<o.length;){let j=i;while(j+1<o.length&&o[j+1][0]===o[i][0])j++;for(let k=i;k<=j;k++)r[o[k][1]]=(i+j)/2;i=j+1;}return r;}
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const out={truth:{},cost:{}};
 /* ---- 1. truth ---- */
 for(const who of ['James','Gordon']){
  const p=await b.newPage({viewport:{width:1700,height:1100}});
  await p.goto('file://'+path.join(DIR,'hover.html')+'?rec=1&title=0&look=trace&who='+who);
  await p.waitForFunction(()=>window.__rec&&document.getElementById('dim').complete);
  const probe=async(i,real)=>{
   if(real){await p.mouse.move(2,2);await p.evaluate(()=>{__rec.ov().hover(null,0);__rec.ov().entries=[];__rec.at(0);});
    const pt=await p.evaluate(i=>__rec.point(i),i);await p.mouse.move(pt.x,pt.y);}
   return p.evaluate(([i,real])=>{
    const ov=__rec.ov(),G=__rec.G(),l=G.links[i],N=OVL_HOVER_N;
    if(!real){ov.entries=[];ov.cur=null;ov.hover(l,0);}
    const held=ov.cur;
    const e=ov.entries[ov.entries.length-1],s=e.seq[0],P=s.P,land=N.LIFT+s.d;
    const cv=document.getElementById('ov'),g=cv.getContext('2d'),dpr=ov.dpr;
    const alphaAt=(x,y)=>{const X=Math.round(x*dpr),Y=Math.round(y*dpr),d=g.getImageData(X-1,Y-1,3,3).data;let m=0;for(let k=3;k<36;k+=4)m=Math.max(m,d[k]);return m/255;};
    /* density, mid trace, at 15 percent along */
    __rec.at(N.LIFT+s.d*.8);const q=OVL_LIB.at(l.S,.15),alpha=alphaAt(q[0],q[1]);
    /* swing, at the midpoint, along the normal. Read as the envelope: over
       137 moments 7.31ms apart, which never lock to a pitch the way whole
       frames at 60 a second lock to 10 a second, the furthest the stroke's
       half alpha edge reaches on each side, less the stroke's own width.
       The faint second stroke at the far extreme sits at a fifth of the
       alpha and is below the half alpha line, so it is not read as the
       string. The midpoint is where the second harmonic is zero.

       ISOLATED, and why. Many chords are hairpins whose two arms run a few
       pixels apart, and three earlier cuts of this probe read the other arm,
       or a bead's ring, as the string: 9px on a 5px string. So for this
       reading only, the page draws the line from 44 to 56 percent along and
       no beads, through exactly the same displacement code, and nothing else
       can fall in the scan. The density reading above is the whole line,
       drawn normally. */
    const F=N.fine(l),w=l.w*1.35,Ap=P.A*(1+N.PLUCK*Math.exp(-1.5/N.PLUCK_TAU));
    const j=Math.round(.5*(F.n-1)),c=F.pts[j],nr=F.nrm[j],want=N.bendLimit(F,j,Ap);
    F.win=[Math.round(.44*(F.n-1)),Math.round(.56*(F.n-1))];ov.noBeads=true;
    const R=Math.ceil(1.5*Ap+w/2+3);
    const x0=Math.floor((c[0]-R-2)*dpr),y0=Math.floor((c[1]-R-2)*dpr),WW=Math.ceil((2*R+4)*dpr)+2;
    let lo=0,hi=0,peak=0;const frames=[];
    for(let f=0;f<137;f++){__rec.at(land+1500+f*7.31);frames.push(g.getImageData(x0,y0,WW,WW).data);}
    const A=(im,x,y)=>{x=x*dpr-x0;y=y*dpr-y0;const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi;
     const at=(u,v)=>(u<0||v<0||u>=WW||v>=WW)?0:im[(v*WW+u)*4+3];
     return at(xi,yi)*(1-fx)*(1-fy)+at(xi+1,yi)*fx*(1-fy)+at(xi,yi+1)*(1-fx)*fy+at(xi+1,yi+1)*fx*fy;};
    frames.forEach(im=>{for(let o=-R;o<=R;o+=.1)peak=Math.max(peak,A(im,c[0]+nr[0]*o,c[1]+nr[1]*o));});
    const half=peak*.5;
    frames.forEach(im=>{for(let o=-R;o<=R;o+=.1)if(A(im,c[0]+nr[0]*o,c[1]+nr[1]*o)>=half){lo=Math.min(lo,o);hi=Math.max(hi,o);}});
    const swing=Math.max(0,(hi-lo-Math.min(w,hi-lo))/2);
    delete F.win;ov.noBeads=false;
    return {i,nm:l.nm,lv:l.lv,held:held&&held.i,charge:+(l.load*10).toFixed(1),chainW:+(l.chain.W*10).toFixed(1),
     chainLines:l.chain.path.length,width:+(l.w*1.35).toFixed(2),
     swingIntended:+want.toFixed(3),swingPeak:+Ap.toFixed(3),bendLimited:want<P.A*.97,capped:P.capped,swing:+swing.toFixed(2),
     alphaIntended:+P.alpha.toFixed(3),alpha:+alpha.toFixed(3),pitch:+P.f.toFixed(2)};},[i,!!real]);};
  const n=await p.evaluate(()=>__rec.G().links.length);
  const rows=[];for(let i=0;i<n;i++)rows.push(await probe(i,false));
  /* named lines, held by a real pointer */
  const names=await p.evaluate(()=>{const G=__rec.G(),s=G.links.slice().sort((a,b)=>b.load-a.load),mid=l=>OVL_LIB.at(l.S,.5),hm=mid(s[0]);
   const cool=G.links.filter(l=>{const m=mid(l);return l.load>0&&l!==s[0]&&Math.hypot(m[0]-hm[0],m[1]-hm[1])<160;}).sort((a,b)=>a.load-b.load)[0];
   const pick=[s[0].i,cool.i,G.links.filter(l=>l.load>0).sort((a,b)=>a.load-b.load)[0].i];
   const z=G.links.find(l=>l.load===0);if(z)pick.push(z.i);
   G.links.filter(l=>/Victim/.test(l.nm)).forEach(l=>pick.push(l.i));return [...new Set(pick)];});
  const real=[];for(const i of names){const r=await probe(i,true);r.bySweep=rows[i];real.push(r);}
  const ok=rows.filter(r=>r.width>=2.2);
  const nz=rows.filter(r=>!r.capped);
  out.truth[who]={lines:rows.length,
   swing:{pearson_vs_intended:pearson(nz.map(r=>r.swingIntended),nz.map(r=>r.swing)),
    spearman_vs_charge:pearson(rank(nz.map(r=>r.charge)),rank(nz.map(r=>r.swing))),
    meanAbsError:+(nz.reduce((s,r)=>s+Math.abs(r.swing-r.swingIntended),0)/nz.length).toFixed(3),
    capped:rows.filter(r=>r.capped).length,bendLimited:rows.filter(r=>r.bendLimited).length,read:nz.length},
   density:{linesWideEnough:ok.length,pearson_vs_chainWeight:pearson(ok.map(r=>r.chainW),ok.map(r=>r.alpha)),
    meanAbsError:+(ok.reduce((s,r)=>s+Math.abs(r.alpha-r.alphaIntended),0)/ok.length).toFixed(4),
    range:[Math.min(...ok.map(r=>r.alpha)),Math.max(...ok.map(r=>r.alpha))]},
   named:real,all:rows};
  const T=out.truth[who];
  console.log(who,'swing r',T.swing.pearson_vs_intended,'rank r vs charge',T.swing.spearman_vs_charge,'mae px',T.swing.meanAbsError,'capped',T.swing.capped,'bend limited',T.swing.bendLimited,
   '| density r',T.density.pearson_vs_chainWeight,'mae',T.density.meanAbsError,'n',T.density.linesWideEnough);
  nz.slice().sort((a,b)=>Math.abs(b.swing-b.swingIntended)-Math.abs(a.swing-a.swingIntended)).slice(0,+(process.env.OUTLIERS||0))
   .forEach(r=>console.log('   outlier',r.i,r.lv,r.nm,'swing',r.swing,'meant',r.swingIntended,'width',r.width));
  real.forEach(r=>console.log('  ',r.held===r.i?'held':'MISSED',r.nm,'charge',r.charge+'%','swing',r.swing,'px (meant',r.swingIntended+')',
   'chain',r.chainW+'%','alpha',r.alpha,'(meant',r.alphaIntended+')','sweep said',r.bySweep.swing,r.bySweep.alpha));
  await p.close();}
 /* ---- 2. cost ---- */
 if(process.env.TRUTH_ONLY){await b.close();return;}
 for(const thr of [1,4]){
  const R=out.cost['cpu x'+thr]={};
  {const p=await b.newPage({viewport:{width:1600,height:1000}});const cdp=await p.context().newCDPSession(p);
   await p.goto('file://'+path.resolve('source.html'));
   await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
   await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='Gordon'));setTab(TAB.FIELD);
    const ch=[...document.querySelectorAll('#vbar .vt')].find(b=>/Chains/.test(b.textContent));ch.click();render();});
   await p.waitForTimeout(1500);await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
   R['shipped Field draw()']=stat(await p.evaluate(()=>{const cv=document.getElementById('cv'),cx=cv.getContext('2d'),r=compute(),a=[];
    for(let i=0;i<300;i++){const t0=performance.now();DRAW_SIG=null;draw(r);cx.getImageData(0,0,1,1);a.push(performance.now()-t0);}return a;}));
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});await p.close();}
  const p=await b.newPage({viewport:{width:1700,height:1100}});const cdp=await p.context().newCDPSession(p);
  for(const look of ['still','trace','coil','current','stitch','pressure'])for(const scope of ['line','chain']){
   const base=look==='still'?'trace':look,rm=look==='still'?'&rm=1':'';
   await p.goto('file://'+path.join(DIR,'hover.html')+'?rec=1&title=0&who=Gordon&look='+base+'&scope='+scope+rm);
   await p.waitForFunction(()=>window.__rec);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
   const r=await p.evaluate(()=>{const ov=__rec.ov(),G=__rec.G(),cv=document.getElementById('ov'),cx=cv.getContext('2d');
    const l=G.links.slice().sort((a,b)=>b.S.len-a.S.len)[0];ov.hover(l,0);
    const a=[];let lines=0;for(let i=0;i<300;i++){const t=3200+i*1000/60,t0=performance.now();const s=__rec.at(t);cx.getImageData(0,0,1,1);a.push(performance.now()-t0);lines=s.lines;}
    return {a,lines,line:l.nm,len:Math.round(l.S.len)};});
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
   R[look+' '+scope]=Object.assign(stat(r.a),{lines:r.lines,line:r.line+', '+r.len+'px'});
   console.log('x'+thr,(look+' '+scope).padEnd(16),JSON.stringify(R[look+' '+scope]));}
  /* the hit test, per pointer move, over every chord on the profile */
  await p.goto('file://'+path.join(DIR,'hover.html')+'?rec=1&title=0&who=Gordon');await p.waitForFunction(()=>window.__rec);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
  R['hit test per pointer move']=stat(await p.evaluate(()=>{const ov=__rec.ov(),G=__rec.G(),a=[];let s=7;
   const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};
   for(let i=0;i<2000;i++){const an=rnd()*6.283,rr=rnd()*G.U*.8,x=G.CX+Math.cos(an)*rr,y=G.CY+Math.sin(an)*rr;
    const t0=performance.now();ov.hit(x,y,9);a.push(performance.now()-t0);}return a;}));
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  /* CL's toggle looks, in the same run, for a like for like figure */
  for(const [look,n] of [['hum',12],['relay',12]]){
   await p.goto('file://'+path.join(DIR,'index.html')+'?rec=1&title=0&who=Gordon&look='+look+'&n='+n);await p.waitForFunction(()=>window.__rec);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
   R['CL '+look+' n'+n]=stat(await p.evaluate(()=>{const cv=document.getElementById('ov'),cx=cv.getContext('2d'),a=[];
    for(let i=0;i<300;i++){const t=1400+i*1000/60,t0=performance.now();window.__rec.at(t);cx.getImageData(0,0,1,1);a.push(performance.now()-t0);}return a;}));
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});}
  console.log('x'+thr,'field',JSON.stringify(R['shipped Field draw()']),'hit',JSON.stringify(R['hit test per pointer move']),
   'CL hum',JSON.stringify(R['CL hum n12']),'CL relay',JSON.stringify(R['CL relay n12']));
  await p.close();}
 const md=fs.readFileSync(path.resolve('source.html'));
 out.build=require('crypto').createHash('md5').update(md).digest('hex');
 fs.writeFileSync(path.join(DIR,'measure-hover.json'),JSON.stringify(out,null,1)+'\n');
 await b.close();
})();
