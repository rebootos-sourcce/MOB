#!/usr/bin/env node
/* ============================================================
   measure-coherence.js  (REVIEW-skin, PASS 1, DevOps and QA)

   Measures the BUILT page at runtime, per surface, at 1600 and 390 wide, and
   reports how many distinct values the product uses for each visual
   dimension, plus accessibility floors. It is a probe first and can become a
   gate (--baseline FILE --gate).

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node REVIEW-skin/measure-coherence.js
   Options:
     --file PATH        build to measure (default source.html)
     --json PATH        write the full raw result as JSON
     --md PATH          write the markdown tables to a file (stdout always gets them)
     --widths 1600,390  default both
     --profile N        loadP(N), default 3 (Marcus, example). --profile -1 = blank
     (contrast is always checked twice: from the CSS cascade, and again from a
      photograph of the page with every glyph blanked. See PIXHIDE.)
     --settle MS        wait after setTab before measuring (default 2200)
     --only A,B         only these surfaces by name, e.g. Field,Body
     --selftest         run only the fixture self-test, then exit
     --baseline PATH    a --json file from an earlier run to compare against
     --gate             exit 1 if any "lower is better" metric got worse
                        than the baseline (needs --baseline)

   THE PROBE CHECKS ITSELF FIRST, every run. This project has caught six probes
   lying (see the seat's notes). selftest() loads a fixture whose answers are
   known by hand: black on white is 21 to 1, #777 on white is 4.48 to 1, a
   color-mix() ground, a gradient ground, a 20px and a 48px button, a 24 unit
   icon stroke drawn at 2x, and four elements that have a bounding box and no
   paint (display none, clipped to zero height, off screen, one pixel wide).
   If any answer is wrong the run stops before it measures the product.

   WHAT IS MEASURED (visible elements only; "visible" means display, visibility,
   opacity, a non zero box, on screen horizontally, and not wholly clipped by an
   overflow hidden or clip ancestor. A bounding box alone is NOT visibility):
     text:    font size, weight, family, colour, contrast against its ground
     paint:   fills (CSS backgrounds and SVG fills), borders, radii, shadows
     icons:   SVG up to 48px: rendered stroke width (authored width times the
              real CTM scale), ring or solid, linecap, size
     input:   every interactive element, its smaller side, tap target floors
     voice:   upper case text, em dashes, glyph icons found in rendered text
   Colours are parsed by a canvas, never by a regex, because a regex that only
   knew rgb() read null from color-mix() once and reported four lightings
   identical.

   KNOWN LIMITS, stated so nobody trusts a number past what it is:
     - canvas pixels (the Field wheel) are not text and are not measured; text
       sitting over a canvas is reported as UNRESOLVED, never as a pass.
     - a url() image ground is UNRESOLVED. A gradient ground is the worst case
       across its stops, so a gradient can only over-report a failure.
     - ancestors with opacity below 1 do not dim their descendants' grounds.
     - listeners added with addEventListener are not visible to the DOM; the
       tap target list is native controls, ARIA roles, onclick attributes and
       the root of every cursor:pointer region.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');

const ARGV=process.argv.slice(2);
const opt=(k,d)=>{const i=ARGV.indexOf('--'+k);return i<0?d:(ARGV[i+1]&&!ARGV[i+1].startsWith('--')?ARGV[i+1]:true);};
const FILE=path.resolve(opt('file','source.html'));
const WIDTHS=String(opt('widths','1600,390')).split(',').map(Number);
const HEIGHT={1600:1000,390:844};
const PROFILE=+opt('profile',3);
/* THE SETTLE TIME IS A MEASUREMENT PARAMETER. The Field's bars fill over about a second and flip the ink
   on top of them between light and dark as they pass underneath, so a probe that reads too early
   measures the animation, not the screen. */
const SETTLE=+opt('settle',2200);
const ONLY=opt('only',false);
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/* ---------------------------------------------------------------
   THE IN PAGE PROBE. Self contained: Playwright serialises its source.
   --------------------------------------------------------------- */
function PROBE(arg){
 const hostIds=arg.hostIds, activeHost=arg.hostId;
 const IW=window.innerWidth, IH=window.innerHeight;
 const cv=document.createElement('canvas');cv.width=cv.height=1;
 const cx=cv.getContext('2d',{willReadFrequently:true});
 const pm=new Map();
 /* any CSS colour -> [r,g,b,a] with a in 0..1, or null if the browser rejects it */
 function parse(str){
  if(pm.has(str))return pm.get(str);
  let out=null;
  cx.fillStyle='#010203';cx.fillStyle=str;let g=cx.fillStyle;
  if(g==='#010203'){cx.fillStyle='#040506';cx.fillStyle=str;g=cx.fillStyle;if(g==='#040506')g=null;}
  if(g){
   let m;
   if((m=/^#([0-9a-f]{6})$/i.exec(g))){const n=parseInt(m[1],16);out=[n>>16&255,n>>8&255,n&255,1];}
   else if((m=/^rgba?\(([^)]*)\)$/.exec(g))){const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);out=[p[0],p[1],p[2],p.length>3?p[3]:1];}
   else{ /* color(srgb ...), color-mix() and anything else: read the pixel */
    cx.clearRect(0,0,1,1);cx.fillRect(0,0,1,1);const d=cx.getImageData(0,0,1,1).data;
    out=[d[0],d[1],d[2],d[3]/255];}
  }
  pm.set(str,out);return out;}
 const over=(f,b)=>{const a=f[3];return [f[0]*a+b[0]*(1-a),f[1]*a+b[1]*(1-a),f[2]*a+b[2]*(1-a),1];};
 const lin=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
 const lum=c=>0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]);
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
 const hex=c=>{const h=n=>('0'+Math.round(Math.max(0,Math.min(255,n))).toString(16)).slice(-2);
  return '#'+h(c[0])+h(c[1])+h(c[2])+(c[3]<0.995?h(c[3]*255):'');};
 const cs0=new Map();
 const cstyle=n=>{let s=cs0.get(n);if(!s){s=getComputedStyle(n);cs0.set(n,s);}return s;};
 const COLTOK=/(rgba?\([^)]*\)|hsla?\([^)]*\)|color\([^)]*\)|color-mix\((?:[^()]|\([^)]*\))*\)|#[0-9a-f]{3,8}\b|\btransparent\b)/gi;

 /* inherited opacity and the clip rectangle each element lives inside */
 const info=new Map();
 function infoOf(el){
  if(info.has(el))return info.get(el);
  const cs=cstyle(el),par=el.parentElement;
  const pi=par?infoOf(par):{op:1,clip:null,hidden:false};
  const o={op:pi.op*(+cs.opacity),clip:pi.clip,hidden:pi.hidden||cs.display==='none'};
  if(cs.position==='fixed')o.clip=null;
  const ox=cs.overflowX,oy=cs.overflowY;
  if(!o.hidden&&(ox==='hidden'||ox==='clip'||oy==='hidden'||oy==='clip')){
   const r=el.getBoundingClientRect();
   const c={l:r.left,t:r.top,r:r.right,b:r.bottom};
   if(o.clip){c.l=Math.max(c.l,o.clip.l);c.t=Math.max(c.t,o.clip.t);c.r=Math.min(c.r,o.clip.r);c.b=Math.min(c.b,o.clip.b);}
   /* the clip applies to descendants, not to the element itself */
   o.own=pi.clip; o.clip=c;}
  info.set(el,o);return o;}
 const counts={offscreen:0,clipped:0,hiddenSkipped:0};
 /* returns the rect if the element can be seen, else null and a reason counted */
 function seen(el,minSide){
  const cs=cstyle(el);
  if(cs.display==='none'||cs.visibility!=='visible'){counts.hiddenSkipped++;return null;}
  const inf=infoOf(el);
  if(inf.hidden||inf.op<0.02){counts.hiddenSkipped++;return null;}
  const r=el.getBoundingClientRect();
  if(r.width<minSide||r.height<minSide){counts.hiddenSkipped++;return null;}
  if(r.right<=0||r.left>=IW){counts.offscreen++;return null;}
  /* the clip that applies to this element is its parent's clip chain */
  const par=el.parentElement,c=par?infoOf(par).clip:null;
  if(c&&(r.right<=c.l||r.left>=c.r||r.bottom<=c.t||r.top>=c.b)){counts.clipped++;return null;}
  return r;}
 const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;
  const k=(typeof el.className==='string'?el.className:(el.className&&el.className.baseVal)||'').trim().split(/\s+/).filter(Boolean).slice(0,2);
  return s+(k.length?'.'+k.join('.'):'');};

 /* background layers beneath an element, as a list of worst case candidate grounds */
 const canvases=[...document.querySelectorAll('canvas')].filter(c=>{const r=c.getBoundingClientRect();return r.width>0&&r.height>0;});
 function grounds(el,svgPoint){
  const L=[];let unresolved=null,opaque=false;
  if(svgPoint){ /* shapes inside the same svg that sit under the text, top first */
   const svg=el.ownerSVGElement;
   if(svg){
    if(!svg.__shapes)svg.__shapes=[...svg.querySelectorAll('path,circle,rect,ellipse,polygon,polyline')].filter(s=>!s.closest('defs,symbol,clipPath,mask,marker,pattern'));
    const pt=svg.createSVGPoint();pt.x=svgPoint.x;pt.y=svgPoint.y; /* screen space */
    for(let i=svg.__shapes.length-1;i>=0;i--){
     const s=svg.__shapes[i];
     if(!(s.compareDocumentPosition(el)&4))continue; /* only shapes painted before the text */
     const sc=cstyle(s);if(sc.display==='none'||sc.visibility!=='visible'||sc.fill==='none')continue;
     const ctm=s.getScreenCTM();if(!ctm)continue;
     let ok=false;try{ok=s.isPointInFill(pt.matrixTransform(ctm.inverse()));}catch(e){}
     if(!ok)continue;
     let c=null;const f=sc.fill;
     if(/^url\(/.test(f)){const id=(/#([^")]+)/.exec(f)||[])[1];const ge=id&&document.getElementById(id);
      if(ge){const st=[...ge.querySelectorAll('stop')].map(x=>{const q=parse(cstyle(x).stopColor);const o=+cstyle(x).stopOpacity;return q?[q[0],q[1],q[2],q[3]*o]:null;}).filter(Boolean);
       if(st.length){L.push({grad:st.map(q=>[q[0],q[1],q[2],q[3]*(+sc.fillOpacity)*(+sc.opacity)])});continue;}}
      unresolved='svg paint server';continue;}
     c=parse(f);if(!c)continue;
     c=[c[0],c[1],c[2],c[3]*(+sc.fillOpacity)*(+sc.opacity)];
     if(c[3]>0)L.push({c});
     if(c[3]>=0.995)return resolve(L,unresolved,null,true); /* opaque shape: nothing beneath it matters */
    }}}
  for(let n=el;n&&n.nodeType===1;n=n.parentElement){
   const cs=cstyle(n),bi=cs.backgroundImage;
   if(bi&&bi!=='none'){
    const toks=bi.match(COLTOK);
    if(/gradient\(/.test(bi)&&toks){const st=toks.map(parse).filter(Boolean);if(st.length)L.push({grad:st,o:n});}
    else unresolved='image';}
   const c=parse(cs.backgroundColor);
   if(c&&c[3]>0){L.push({c,o:n});if(c[3]>=0.995){opaque=true;break;}}}
  return resolve(L,unresolved,null,opaque);}
 function resolve(L,unresolved,base,opaque){
  let cand=base||[[255,255,255,1]];
  for(let i=L.length-1;i>=0;i--){
   const l=L[i];
   if(l.c)cand=cand.map(b=>over(l.c,b));
   else{const nc=[];const seenk={};
    l.grad.forEach(s=>cand.forEach(b=>{const o=over(s,b);const k=o.map(Math.round).join();if(!seenk[k]){seenk[k]=1;nc.push(o);}}));
    cand=nc;if(cand.length>40){cand.sort((a,b)=>lum(a)-lum(b));const keep=[];for(let j=0;j<40;j++)keep.push(cand[Math.floor(j*(cand.length-1)/39)]);cand=keep;}}}
  return {cand,unresolved,opaque:!!opaque,L};}
 /* A 2D canvas can be READ. When the DOM stack above a piece of text never reaches
    an opaque layer, the ground is whatever the canvas under it painted, so sample
    those pixels instead of assuming white. A canvas that is not 2D (WebGL) cannot be
    read and stays UNRESOLVED rather than passing. */
 const cdat=new Map();
 function canvasPixels(c){
  if(cdat.has(c))return cdat.get(c);
  let d=null;
  try{const x=c.getContext('2d');if(x&&c.width&&c.height)d=x.getImageData(0,0,c.width,c.height);}catch(e){}
  cdat.set(c,d);return d;}
 function canvasCands(r){
  const cxm=(r.left+r.right)/2,cym=(r.top+r.bottom)/2;
  let hit=null;canvases.forEach(c=>{const q=c.getBoundingClientRect();if(cxm>q.left&&cxm<q.right&&cym>q.top&&cym<q.bottom)hit=c;});
  if(!hit)return null;
  const d=canvasPixels(hit);if(!d)return {fail:'webgl or unreadable canvas'};
  const q=hit.getBoundingClientRect(),sx=hit.width/q.width,sy=hit.height/q.height;
  const base=grounds(hit,null).cand[0];
  const under=hit;
  const x0=Math.max(r.left,q.left),x1=Math.min(r.right,q.right),y0=Math.max(r.top,q.top),y1=Math.min(r.bottom,q.bottom);
  const seenk={},out=[];
  for(let i=0;i<7;i++)for(let j=0;j<5;j++){
   const px=Math.min(hit.width-1,Math.max(0,Math.floor((x0+(x1-x0)*(i+0.5)/7-q.left)*sx)));
   const py=Math.min(hit.height-1,Math.max(0,Math.floor((y0+(y1-y0)*(j+0.5)/5-q.top)*sy)));
   const o=(py*hit.width+px)*4,c=[d.data[o],d.data[o+1],d.data[o+2],d.data[o+3]/255];
   const v=over(c,base),k=v.map(Math.round).join();if(!seenk[k]){seenk[k]=1;out.push(v);}}
  return {cand:out,hit};}
 /* does a rect sit over a visible canvas (whose pixels we cannot read as a ground) */
 const overCanvas=r=>{const x=(r.left+r.right)/2,y=(r.top+r.bottom)/2;
  return canvases.some(c=>{const q=c.getBoundingClientRect();return x>q.left&&x<q.right&&y>q.top&&y<q.bottom;});};

 /* ---- collectors ---- */
 const mk=()=>({ffS:{},fs:{},fw:{},ff:{},tc:{},tce:{},fill:{},bd:{},bw:{},rad:{},sh:{},shg:{},
  stI:{},stIa:{},stF:{},cap:{},icSz:{},icCls:{},stCol:{},
  nText:0,chars:0,unres:{},fsChars:{},fwChars:{},fails:{},nFail:0,nFailLarge:0,nUnres:0,nChecked:0,minRatio:99,
  tiny:0,tinyS:{},caps:{},capsN:0,dash:0,dashS:[],glyph:{},
  tap:[],nTap:0,nTapFold:0});
 const A=mk(),H=mk();
 const add=(m,k,n,c)=>{const o=m[k]||(m[k]={n:0,c:0});o.n+=(n===undefined?1:n);o.c+=(c||0);};
 const both=(side,fn)=>{fn(A);if(side==='host')fn(H);};
 const sideOf=el=>(activeHost&&el.closest('#'+activeHost))?'host':'chrome';
 const num=v=>{const s=(+v).toFixed(1);return s.replace(/\.0$/,'');};
 const SKIP=/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|TITLE|HEAD|META|LINK|DEFS|CLIPPATH|MASK|MARKER|PATTERN|SYMBOL|OPTION|OPTGROUP)$/i;
 const GLY=/[←-⇿⌀-⏿■-◿☀-➿⬀-⯿]|\p{Extended_Pictographic}/gu;

 const bodyFF=(cstyle(document.body).fontFamily.split(',')[0]||'').replace(/["']/g,'').trim();
 const TX=[];window.__TXEL=[];window.__TXCP=[];
 function trect(el,r){
  if(el instanceof SVGElement||/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))return r;
  const nodes=[...el.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim());
  if(!nodes.length)return r;
  const g=document.createRange();g.setStartBefore(nodes[0]);g.setEndAfter(nodes[nodes.length-1]);
  const q=g.getBoundingClientRect();return (q.width>0&&q.height>0)?q:r;}
 const all=document.body.querySelectorAll('*');
 for(const el of all){
  if(SKIP.test(el.tagName))continue;
  if(el.closest('defs,symbol,clipPath,mask,marker,pattern,noscript,template'))continue;
  const isSvgChild=el instanceof SVGElement;
  const cs=cstyle(el);
  const side=sideOf(el);

  /* ---------- text ---------- */
  let text='';
  const tn=el.tagName;
  if(tn==='INPUT'||tn==='TEXTAREA'){
   /* a checkbox's value is "on" and nobody reads it; only controls that print their value count as text */
   text=/^(hidden|checkbox|radio|range|file|color|image)$/.test(el.type||'')?'':(el.value||el.placeholder||'').trim();}
  else if(tn==='SELECT'){text=(el.options&&el.options[el.selectedIndex]?el.options[el.selectedIndex].text:'').trim();}
  else text=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue).join('').replace(/\s+/g,' ').trim();
  const pseudo=[];
  if(!isSvgChild){['::before','::after'].forEach(p=>{const c=getComputedStyle(el,p).content;
   if(c&&c!=='none'&&c!=='normal'&&c!=='""'&&c!=="''"){const t=c.replace(/^["']|["']$/g,'');if(t&&!/^(counter|attr|url)\(/.test(t)&&t!=='\\"')pseudo.push([p,t]);}});}
  const texts=[];if(text)texts.push(['',text]);pseudo.forEach(p=>texts.push(p));
  if(texts.length){
   const r=seen(el,2);
   if(r){
    /* a placeholder is painted by ::placeholder, never by the control's own color */
    const isPh=(tn==='INPUT'||tn==='TEXTAREA')&&!el.value&&!!el.placeholder;
    const phs=isPh?getComputedStyle(el,'::placeholder'):null;
    for(const [ps,t] of texts){
     const tcs=ps?getComputedStyle(el,ps):cs; /* generated content has its own font and colour */
     const fs=parseFloat(tcs.fontSize),fw=tcs.fontWeight;
     const ff=(tcs.fontFamily.split(',')[0]||'').replace(/["']/g,'').trim();
     const fg0=parse(isSvgChild?cs.fill:(isPh?phs.color:tcs.color));
     const chars=t.length;
     if(ff!==bodyFF)both(side,m=>{const a=m.ffS[ff]||(m.ffS[ff]={});if(Object.keys(a).length<5)a[sel(el)+(ps?' '+ps:'')+' "'+t.slice(0,12)+'"']=1;});
     both(side,m=>{m.nText++;m.chars+=chars;add(m.fs,num(fs)+'px',1,chars);add(m.fw,fw,1,chars);add(m.ff,ff,1,chars);});
     if(fs<12)both(side,m=>{m.tiny++;if(Object.keys(m.tinyS).length<8)m.tinyS[num(fs)+'px '+sel(el)+' "'+t.slice(0,18)+'"']=1;});
     /* voice rulings: no all caps copy, no em dashes, glyph icons are a style choice worth counting */
     const letters=(t.match(/[A-Za-z]/g)||[]).length;
     const caps=cs.textTransform==='uppercase'&&letters>=3||(letters>=4&&t===t.toUpperCase()&&/[A-Z]/.test(t));
     if(caps)both(side,m=>{m.capsN++;if(Object.keys(m.caps).length<10)m.caps[t.slice(0,24)+(cs.textTransform==='uppercase'?' [css]':' [source]')]=1;});
     if(t.indexOf('\u2014')>=0)both(side,m=>{m.dash++;if(m.dashS.length<5)m.dashS.push(t.slice(0,40));});
     const gl=t.match(GLY);if(gl)gl.forEach(g=>both(side,m=>add(m.glyph,g)));
     /* colour and contrast */
     if(!fg0)continue;
     const op=infoOf(el).op;
     const fg=[fg0[0],fg0[1],fg0[2],fg0[3]*op*(isPh&&phs.opacity!==''?+phs.opacity:1)];
     if(fg[3]<0.02){both(side,m=>{m.nInvisInk=(m.nInvisInk||0)+1;});continue;} /* transparent ink paints nothing (a textarea drawn by a highlight layer) */
     let gr;
     if(isSvgChild){ /* the centre of the text, in svg user space */
      let b=null;try{b=el.getBBox();}catch(e){}
      const svg=el.ownerSVGElement;let pt=null;
      if(b&&svg){const ctm=el.getScreenCTM();
       if(ctm){const q=svg.createSVGPoint();q.x=b.x+b.width/2;q.y=b.y+b.height/2;const s=q.matrixTransform(ctm);
        pt={x:s.x,y:s.y};}} /* screen coordinates of the text centre */
      gr=grounds(el,pt);}
     else gr=grounds(el,null);
     let unres=gr.unresolved;
     if(!unres&&overCanvas(r)){
      /* the canvas paints over any layer that contains it and under any layer that does not */
      const cc=canvasCands(trect(el,r));
      if(!cc||cc.fail)unres=cc?cc.fail:'over canvas';
      else{gr=resolve(gr.L.filter(l=>!l.o||!l.o.contains(cc.hit)),null,cc.cand,false);}}
     const disabled=el.disabled||el.closest('[disabled],[aria-disabled=true]');
     const eff=gr.cand.map(b=>over(fg,b));
     const worst=eff.reduce((a,b,i)=>{const q=ratio(b,gr.cand[i]);return q<a.q?{q,e:b,g:gr.cand[i]}:a;},{q:99,e:eff[0],g:gr.cand[0]});
     both(side,m=>{add(m.tc,hex(fg0),1,chars);add(m.tce,hex(worst.e),1,chars);});
     if(unres){both(side,m=>{m.nUnres++;const u=m.unres[unres]||(m.unres[unres]={n:0,s:{}});u.n++;if(Object.keys(u.s).length<6)u.s[sel(el)]=1;});continue;}
     if(disabled)continue;
     const large=fs>=24||(fs>=18.66&&+fw>=700);
     if(!ps){const tr=trect(el,r);const cpf=(()=>{for(let n=el;n&&n.nodeType===1;n=n.parentElement){const c=cstyle(n).clipPath;if(c&&c!=='none')return true;}return false;})();window.__TXEL.push(el);window.__TXCP.push(cpf);TX.push({cp:cpf,x:tr.left+scrollX,y:tr.top+scrollY,w:tr.width,h:tr.height,fg:[fg[0],fg[1],fg[2],fg[3]],css:+worst.q.toFixed(2),large,side,fs:num(fs),fw,sel:sel(el),sample:t.slice(0,28),e:hex(worst.e),g:hex(worst.g)});}
     both(side,m=>{m.nChecked++;if(worst.q<m.minRatio)m.minRatio=worst.q;
      if(worst.q<4.5){
       if(large&&worst.q>=3){m.nFailLarge++;}
       else{m.nFail++;}
       {const k=hex(worst.e)+'|'+hex(worst.g)+'|'+num(fs);
       const f=m.fails[k]||(m.fails[k]={n:0,ratio:+worst.q.toFixed(2),fg:hex(worst.e),bg:hex(worst.g),fs:num(fs),fw,large:large&&worst.q>=3,sample:t.slice(0,28),sel:sel(el)});
       f.n++;}}});
    }}}

  /* ---------- paint: fills, borders, radii, shadows (HTML boxes) ---------- */
  if(!isSvgChild||tn==='svg'){
   const r=seen(el,1);
   if(r&&!isSvgChild){
    const bg=parse(cs.backgroundColor);let paints=false;
    if(bg&&bg[3]>0){both(side,m=>add(m.fill,hex(bg)));paints=true;}
    const bi=cs.backgroundImage;if(bi&&bi!=='none'){paints=true;both(side,m=>add(m.fill,/gradient/.test(bi)?'gradient':'image'));}
    ['Top','Right','Bottom','Left'].forEach(s=>{
     const w=parseFloat(cs['border'+s+'Width']);
     if(w>0&&cs['border'+s+'Style']!=='none'&&cs['border'+s+'Style']!=='hidden'){
      const c=parse(cs['border'+s+'Color']);
      if(c&&c[3]>0){paints=true;both(side,m=>{add(m.bd,hex(c));add(m.bw,num(w)+'px');});}}});
    if(cs.boxShadow!=='none'){paints=true;
     const raw=cs.boxShadow,geom=raw.replace(COLTOK,'C').replace(/\s+/g,' ');
     both(side,m=>{add(m.sh,raw);add(m.shg,geom);});}
    if(cs.textShadow!=='none')both(side,m=>{add(m.sh,'text: '+cs.textShadow);add(m.shg,'text: '+cs.textShadow.replace(COLTOK,'C'));});
    if(/drop-shadow/.test(cs.filter))both(side,m=>{add(m.sh,'filter: '+cs.filter);add(m.shg,'filter: '+cs.filter.replace(COLTOK,'C'));});
    const rd=['TopLeft','TopRight','BottomRight','BottomLeft'].map(c=>parseFloat(cs['border'+c+'Radius'])||0);
    if(rd.some(v=>v>0)&&(paints||/^(IMG|CANVAS|VIDEO|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(tn))){
     const half=Math.min(r.width,r.height)/2;let k;
     if(rd.every(v=>v>=half-0.5)&&Math.abs(r.width-r.height)<1.5)k='circle';
     else if(rd.every(v=>v>=half-0.5))k='pill';
     else k=rd.every(v=>v===rd[0])?num(rd[0])+'px':rd.map(num).join(' ')+'px';
     both(side,m=>add(m.rad,k));}}}

  /* ---------- svg: icons and figures ---------- */
  if(tn==='svg'||tn==='SVG'){
   if(el.parentElement&&el.parentElement.closest('svg'))continue; /* nested svg is part of its parent */
   const r=seen(el,1);if(!r)continue;
   const size=Math.max(r.width,r.height);
   const icon=size<=48;
   const shapes=[...el.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse')].filter(s=>!s.closest('defs,symbol,clipPath,mask,marker,pattern'));
   let nS=0,nF=0;
   shapes.forEach(s=>{
    const sc=cstyle(s);if(sc.display==='none'||sc.visibility!=='visible')return;
    const sw=parseFloat(sc.strokeWidth)||0;
    const stroked=sc.stroke!=='none'&&sw>0&&+sc.strokeOpacity>0;
    const filled=sc.fill!=='none'&&+sc.fillOpacity>0;
    if(stroked){nS++;
     const ctm=s.getScreenCTM();let k=1;
     if(ctm&&sc.vectorEffect!=='non-scaling-stroke')k=Math.sqrt(Math.abs(ctm.a*ctm.d-ctm.b*ctm.c));
     const rw=sw*k,sc2=parse(sc.stroke);
     both(side,m=>{add(icon?m.stI:m.stF,num(Math.round(rw*10)/10)+'px');if(icon){add(m.stIa,num(sw));add(m.cap,sc.strokeLinecap+'/'+sc.strokeLinejoin);}
      if(sc2)add(m.stCol,hex([sc2[0],sc2[1],sc2[2],sc2[3]*(+sc.strokeOpacity)]));});}
    if(filled){nF++;const f=parse(sc.fill);if(f)both(side,m=>add(m.fill,hex([f[0],f[1],f[2],f[3]*(+sc.fillOpacity)])));
     else both(side,m=>add(m.fill,'svg paint server'));}});
   if(icon){const cls=nS&&!nF?'ring':nF&&!nS?'solid':nS&&nF?'ring+fill':'empty';
    both(side,m=>{add(m.icSz,Math.round(size)+'px');add(m.icCls,cls);});}
  }

  /* ---------- interactive ---------- */
 }
 /* second pass: interactive elements, so ancestor tests see the whole set */
 const NAT='button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button],[role=tab],[role=link],[role=switch],[role=checkbox],[role=menuitem],[role=slider],[role=option],[tabindex]:not([tabindex="-1"]),[onclick],[contenteditable=true]';
 const cands=[];
 for(const el of all){
  if(el.closest('defs,symbol,noscript,template'))continue;
  const cs=cstyle(el);let kind=null;
  if(el.matches(NAT)){kind='native';if(el.tagName==='A'&&cs.display==='inline'&&el.parentElement&&(el.parentElement.textContent||'').trim().length>(el.textContent||'').trim().length+8)kind='inline';}
  else if(cs.cursor==='pointer'&&(!el.parentElement||cstyle(el.parentElement).cursor!=='pointer'))kind='pointer';
  if(!kind)continue;
  if(el.tagName==='LABEL')continue;
  const anc=el.parentElement&&el.parentElement.closest(NAT);
  if(anc&&kind!=='native')continue;
  if(anc&&kind==='native'&&el.matches('[onclick],[tabindex]')&&!el.matches('button,a[href],input,select,textarea'))continue;
  cands.push([el,kind]);}
 for(const [el,kind] of cands){
  let target=el;
  if(el.tagName==='INPUT'&&/checkbox|radio|file|range/.test(el.type)){
   const r0=el.getBoundingClientRect();
   if(r0.width<=4||r0.height<=4||+cstyle(el).opacity===0){const lb=el.closest('label')||(el.id&&document.querySelector('label[for="'+el.id+'"]'));if(lb)target=lb;}}
  const r=seen(target,1);if(!r)continue;
  if(cstyle(el).pointerEvents==='none')continue;
  const side=sideOf(el);
  const nm=(el.getAttribute('aria-label')||el.title||el.textContent||el.value||el.placeholder||'').replace(/\s+/g,' ').trim().slice(0,24);
  const rec={t:el.tagName.toLowerCase(),k:kind,n:nm,w:Math.round(r.width),h:Math.round(r.height),m:Math.round(Math.min(r.width,r.height)),sel:sel(el)};
  const fold=r.top<IH&&r.bottom>0;
  both(side,m=>{m.tap.push(rec);m.nTap++;if(fold)m.nTapFold++;});
 }
 const trim=m=>{m.tap.sort((a,b)=>a.m-b.m);return m;};
 trim(A);trim(H);
 return {all:A,host:H,counts,texts:TX,
  doc:{scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,iw:IW,ih:IH,
   overflowX:document.documentElement.scrollWidth-IW,canvases:canvases.length,
   svgs:document.querySelectorAll('svg').length,els:all.length}};
}

/* THE PIXEL ORACLE. The CSS cascade is a model of what the screen shows, and a
   model can be wrong: a chip painted by a sibling, a canvas wash that varies
   across a block, an ancestor with opacity. So every checked piece of text is
   also measured against the real screen. PIXHIDE blanks every glyph in the
   document (colour, fill, shadow, placeholder) without moving anything; the
   caller photographs the whole page; PIXREAD then takes the commonest pixel
   inside each text's own box as the ground and recomputes the ratio with the
   ink the CSS pass found. Text the photograph cannot reach (inside a scrolled
   container) keeps its CSS verdict and is counted as unphotographed. */
function PIXHIDE(on){
 let st=document.getElementById('__pixhide');
 if(on&&!st){st=document.createElement('style');st.id='__pixhide';
  st.textContent='*,*::before,*::after{color:transparent !important;-webkit-text-fill-color:transparent !important;text-shadow:none !important;caret-color:transparent !important}svg text,svg tspan{fill:transparent !important;stroke:none !important}::placeholder{color:transparent !important;-webkit-text-fill-color:transparent !important}';
  document.head.appendChild(st);}
 if(!on&&st)st.remove();
 return {w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight};}
async function PIXREAD(arg){
 const blob=await (await fetch('data:image/png;base64,'+arg.b64)).blob();const bm=await createImageBitmap(blob);
 const c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0);
 const lin=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
 const lum=q=>0.2126*lin(q[0])+0.7152*lin(q[1])+0.0722*lin(q[2]);
 const out=[];
 for(const t of arg.texts){
  const X=Math.max(0,Math.floor(t.x)),Y=Math.max(0,Math.floor(t.y)),W=Math.min(bm.width-X,Math.ceil(t.w)),H=Math.min(bm.height-Y,Math.ceil(t.h));
  if(W<2||H<2||t.y>=bm.height||t.x>=bm.width){out.push(null);continue;}
  const d=x.getImageData(X,Y,W,H).data,h={};
  for(let i=0;i<d.length;i+=4){const k=(d[i]>>2)+','+(d[i+1]>>2)+','+(d[i+2]>>2);h[k]=(h[k]||0)+1;}
  let best=null,bn=0;for(const k in h)if(h[k]>bn){bn=h[k];best=k;}
  const g=best.split(',').map(v=>v*4+2);
  const a=t.fg[3],f=[t.fg[0]*a+g[0]*(1-a),t.fg[1]*a+g[1]*(1-a),t.fg[2]*a+g[2]*(1-a)];
  const L1=lum(f),L2=lum(g);
  out.push({g,r:+((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(2),f:f.map(Math.round)});}
 return out;}
/* Scroll containers: the window, and any element that scrolls its own content. A
   photograph of the viewport only shows what is in the viewport, and this app
   scrolls inside .stage while the document itself stays one screen tall, so a
   "full page" screenshot of it is a viewport with black padding. (The first
   cut of this oracle did exactly that and read dark ink on a dark ground for
   a button that is bright blue. The fixture could not have caught it because
   the fixture does not scroll.) So each text is photographed at a scroll
   position where its whole box is on screen and the hit test finds it. */
function PIXSCROLLERS(){
 window.__SC=[];
 const out=[{i:-1,total:document.documentElement.scrollHeight,view:innerHeight,vw:innerWidth,vh:innerHeight}];
 [...document.querySelectorAll('body,body *')].forEach(e=>{
  if(e.clientHeight>40&&e.scrollHeight>e.clientHeight+8&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)){window.__SC.push(e);out.push({i:window.__SC.length-1,total:e.scrollHeight,view:e.clientHeight,vw:innerWidth,vh:innerHeight});}});
 return out;}
function PIXSCROLL(a){
 window.__SC.forEach(e=>{e.scrollTop=0;});window.scrollTo(0,0);
 if(a.i<0)window.scrollTo(0,a.off);else window.__SC[a.i].scrollTop=a.off;
 return true;}
function PIXRECTS(pending){
 const out=[];
 for(const i of pending){
  const el=window.__TXEL[i];if(!el||!el.isConnected)continue;
  let r;
  if(el instanceof SVGElement||/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))r=el.getBoundingClientRect();
  else{const nodes=[...el.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim());
   if(!nodes.length)continue;const g=document.createRange();g.setStartBefore(nodes[0]);g.setEndAfter(nodes[nodes.length-1]);r=g.getBoundingClientRect();
   if(!(r.width>0&&r.height>0))r=el.getBoundingClientRect();}
  if(r.width<2||r.height<2||r.left<0||r.top<0||r.right>innerWidth||r.bottom>innerHeight)continue;
  const hit=document.elementsFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);
  if(!hit.includes(el)&&getComputedStyle(el).pointerEvents!=='none'&&!window.__TXCP[i])continue; /* a clip-path hides an element from hit testing too, and the paint test is what decides those */
  out.push({i,x:r.left,y:r.top,w:r.width,h:r.height});}
 return out;}
/* THE PAINT TEST. A box is not paint. The Field draws every bar's label twice, a light copy and a
   dark copy clipped to the fill with clip-path, so the dark copy has a bounding box everywhere and
   paints only over the fill, and the light copy is overdrawn where the fill is. A probe that reads
   boxes and colours reports a dark ink on a dark ground that nobody can see. So any text that looks
   like a failure, or sits in a clip-path, is photographed twice, as it is and with that one element's
   glyphs blanked, and the difference between the two is the paint. No difference, no paint. */
function PIXONE(a){
 const el=window.__TXEL[a.i];if(!el)return false;
 if(a.on){window.__saved1=[el,el.getAttribute('style')];
  ['color','fill','text-shadow','-webkit-text-fill-color'].forEach(k=>el.style.setProperty(k,'transparent','important'));el.style.setProperty('text-shadow','none','important');}
 else{const [e,st]=window.__saved1;if(st===null)e.removeAttribute('style');else e.setAttribute('style',st);}
 return true;}
async function PIXDIFF(a){
 const dec=async b=>{const bm=await createImageBitmap(await (await fetch('data:image/png;base64,'+b)).blob());
  const c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0);return x.getImageData(0,0,bm.width,bm.height).data;};
 const N=await dec(a.n),H=await dec(a.h);
 let max=0;const diffs=[];
 for(let i=0;i<N.length;i+=4){const d=Math.max(Math.abs(N[i]-H[i]),Math.abs(N[i+1]-H[i+1]),Math.abs(N[i+2]-H[i+2]));diffs.push(d);if(d>max)max=d;}
 /* the ground is the commonest colour of the blanked photograph over the whole box. (The first cut took the
    colour under the changed pixels, which for an overdrawn label is the fringe of the copy on top, and read a
    light ground for a label that sits on a mid blue fill.) */
 const hist={};
 for(let i=0;i<H.length;i+=4){const q=(H[i]>>2)+','+(H[i+1]>>2)+','+(H[i+2]>>2);hist[q]=(hist[q]||0)+1;}
 let best=null,bn=0;for(const q in hist)if(hist[q]>bn){bn=hist[q];best=q;}
 const g=best.split(',').map(v=>v*4+2);
 const al=a.fg[3],f=[a.fg[0]*al+g[0]*(1-al),a.fg[1]*al+g[1]*(1-al),a.fg[2]*al+g[2]*(1-al)];
 const D0=Math.max(Math.abs(f[0]-g[0]),Math.abs(f[1]-g[1]),Math.abs(f[2]-g[2]));
 const lin=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
 const lum=q=>0.2126*lin(q[0])+0.7152*lin(q[1])+0.0722*lin(q[2]);
 const L1=lum(f),L2=lum(g);
 return {ghost:D0>=20&&max<0.4*D0,maxDiff:max,D0:Math.round(D0),g,f:f.map(Math.round),r:+((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(2)};}
async function pixelPass(page,helper,texts){
 const res=texts.map(()=>null);
 let pending=texts.map((t,i)=>i);
 const scs=await page.evaluate(PIXSCROLLERS);
 for(const sc of scs){
  if(!pending.length)break;
  const step=Math.max(30,Math.floor(sc.view*0.6));
  for(let off=0;off<=Math.max(0,sc.total-sc.view)+1&&pending.length;off+=step){
   await page.evaluate(PIXSCROLL,{i:sc.i,off});
   const got=await page.evaluate(PIXRECTS,pending);
   if(!got.length)continue;
   await page.evaluate(PIXHIDE,true);
   let b64=null;try{b64=(await page.screenshot()).toString('base64');}catch(e){}
   await page.evaluate(PIXHIDE,false);
   if(!b64)continue;
   const rd=await helper.evaluate(PIXREAD,{b64,texts:got.map(g=>({x:g.x,y:g.y,w:g.w,h:g.h,fg:texts[g.i].fg}))});
   got.forEach((g,k)=>{if(rd[k]){res[g.i]=rd[k];}});
   const done=new Set(got.filter((g,k)=>rd[k]).map(g=>g.i));
   /* second look, by paint difference, at everything that looks like a failure or sits in a clip-path */
   for(let k=0;k<got.length;k++){
    const g=got[k];if(!rd[k]||!(rd[k].r<5||texts[g.i].cp))continue;
    const x=Math.max(0,Math.floor(g.x)-1),y=Math.max(0,Math.floor(g.y)-1);
    const w=Math.min(sc.vw-x,Math.ceil(g.w)+2),h=Math.min(sc.vh-y,Math.ceil(g.h)+2);
    if(w<2||h<2)continue;
    try{
     const nb=(await page.screenshot({clip:{x,y,width:w,height:h}})).toString('base64');
     await page.evaluate(PIXONE,{i:g.i,on:true});
     const hb=(await page.screenshot({clip:{x,y,width:w,height:h}})).toString('base64');
     await page.evaluate(PIXONE,{i:g.i,on:false});
     const d=await helper.evaluate(PIXDIFF,{n:nb,h:hb,fg:texts[g.i].fg});
     res[g.i]=d.ghost?{ghost:true,r:d.r,g:d.g,f:d.f}:{g:d.g,r:d.r,f:d.f,paint:true};
    }catch(e){try{await page.evaluate(PIXONE,{i:g.i,on:false});}catch(_){}}}
   pending=pending.filter(i=>!done.has(i));}}
 await page.evaluate(PIXSCROLL,{i:-1,off:0});
 return res;}
const toHex=c=>'#'+c.map(v=>('0'+Math.max(0,Math.min(255,Math.round(v))).toString(16)).slice(-2)).join('');

/* ---------------------------------------------------------------
   NODE SIDE: aggregation
   --------------------------------------------------------------- */
const MAPS=['fs','fw','ff','tc','tce','fill','bd','bw','rad','sh','shg','stI','stIa','stF','cap','icSz','icCls','stCol','glyph'];
function labOf(h){ /* #rrggbb[aa] -> Lab */
 const n=parseInt(h.slice(1,7),16),r=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
 const X=(0.4124*r[0]+0.3576*r[1]+0.1805*r[2])/0.95047,Y=0.2126*r[0]+0.7152*r[1]+0.0722*r[2],Z=(0.0193*r[0]+0.1192*r[1]+0.9505*r[2])/1.08883;
 const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116;
 return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))];}
const dE=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
/* greedy families: colours within dE 3 of a more used colour are the same family */
function families(map){
 const ent=Object.entries(map).filter(([k])=>/^#[0-9a-f]{6}/i.test(k)).sort((a,b)=>b[1].n-a[1].n);
 const fam=[];
 for(const [k,v] of ent){const L=labOf(k);const f=fam.find(x=>dE(x.lab,L)<3);if(f){f.n+=v.n;f.members++;}else fam.push({k,lab:L,n:v.n,members:1});}
 return fam.length;}
function summarise(map,wantFam){
 const ent=Object.entries(map||{}).sort((a,b)=>b[1].n-a[1].n);
 const uses=ent.reduce((s,e)=>s+e[1].n,0);
 const top5=ent.slice(0,5).reduce((s,e)=>s+e[1].n,0);
 const o={distinct:ent.length,uses,top5pct:uses?Math.round(100*top5/uses):100,singletons:ent.filter(e=>e[1].n===1).length,
  top:ent.slice(0,6).map(e=>[e[0],e[1].n])};
 if(wantFam)o.families=families(map||{});
 return o;}
const sumMaps=list=>{const out={};MAPS.forEach(k=>{out[k]={};list.forEach(m=>{Object.entries(m[k]||{}).forEach(([v,o])=>{const t=out[k][v]||(out[k][v]={n:0,c:0});t.n+=o.n;t.c+=o.c;});});});return out;};
const median=a=>{if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};

function digest(raw){ /* raw = one PROBE result's .all or .host */
 const o={};
 o.size=summarise(raw.fs);o.weight=summarise(raw.fw);o.family=summarise(raw.ff);o.family.samples=Object.fromEntries(Object.entries(raw.ffS||{}).map(([k,v])=>[k,Object.keys(v)]));
 o.textColor=summarise(raw.tc,true);o.textEff=summarise(raw.tce,true);
 o.fill=summarise(raw.fill,true);o.border=summarise(raw.bd,true);o.borderW=summarise(raw.bw);
 o.radius=summarise(raw.rad);o.shadow=summarise(raw.sh);o.shadowGeom=summarise(raw.shg);
 o.iconStroke=summarise(raw.stI);o.iconStrokeAuthored=summarise(raw.stIa);o.figStroke=summarise(raw.stF);
 o.cap=summarise(raw.cap);o.iconSize=summarise(raw.icSz);o.iconClass=summarise(raw.icCls);o.strokeColor=summarise(raw.stCol,true);
 const smallC=Object.entries(raw.fs).reduce((a,[k,v])=>a+(parseFloat(k)<12?v.c:0),0);
 o.text={n:raw.nText,chars:raw.chars,smallCharPct:raw.chars?Math.round(100*smallC/raw.chars):0,tiny:raw.tiny,tinyS:Object.keys(raw.tinyS),caps:raw.capsN,capsS:Object.keys(raw.caps),dash:raw.dash,dashS:raw.dashS,glyph:Object.entries(raw.glyph).map(([k,v])=>[k,v.n])};
 o.contrast={checked:raw.nChecked,fail:raw.nFail,failLargeOnly:raw.nFailLarge,unresolved:raw.nUnres,unresWhy:Object.fromEntries(Object.entries(raw.unres).map(([k,v])=>[k,{n:v.n,sel:Object.keys(v.s)}])),min:raw.nChecked?+raw.minRatio.toFixed(2):null,
  fails:Object.values(raw.fails).sort((a,b)=>a.ratio-b.ratio)};
 const mins=raw.tap.map(t=>t.m);
 const hard=raw.tap.filter(t=>t.k!=='inline');
 o.tap={n:raw.nTap,fold:raw.nTapFold,inline:raw.tap.length-hard.length,lt24:hard.filter(t=>t.m<24).length,lt44:hard.filter(t=>t.m<44).length,
  median:median(hard.map(t=>t.m)),min:hard.length?hard[0].m:null,worst:hard.slice(0,8)};
 return o;}

/* Combine the CSS verdict and the photograph. Where the screen was photographed the
   photograph decides; where it was not, the CSS verdict stands and is counted. */
function contrastOf(texts,px,side){
 const o={checked:0,photographed:0,ghost:0,fail:0,hard:0,failLargeOnly:0,falsePos:0,falseNeg:0,min:null,fails:[]};
 const g={};
 texts.forEach((t,i)=>{
  if(side&&t.side!==side)return;
  if(!(px[i]&&px[i].ghost))o.checked++;
  const cssBad=t.css<4.5&&!(t.large&&t.css>=3);
  const p=px[i];
  if(p&&p.ghost){o.ghost++;return;} /* blank it and nothing changes: it paints nothing */
  let r=t.css,bad=cssBad,fgHex=t.e,gHex=t.g,largeOnly=t.large&&t.css<4.5&&t.css>=3;
  if(p){o.photographed++;r=p.r;bad=p.r<4.5&&!(t.large&&p.r>=3);largeOnly=t.large&&p.r<4.5&&p.r>=3;fgHex=toHex(p.f);gHex=toHex(p.g);
   if(cssBad&&!bad)o.falsePos++;if(!cssBad&&bad)o.falseNeg++;}
  if(o.min===null||r<o.min)o.min=r;
  if(largeOnly)o.failLargeOnly++;
  if(bad){o.fail++;if(r<4.0)o.hard++;const k=fgHex+'|'+gHex+'|'+t.fs;
   const f=g[k]||(g[k]={n:0,ratio:r,fg:fgHex,bg:gHex,fs:t.fs,fw:t.fw,sample:t.sample,sel:t.sel,photo:!!p});f.n++;}});
 o.fails=Object.values(g).sort((a,b)=>a.ratio-b.ratio);
 return o;}

/* ---------------------------------------------------------------
   SELF TEST: a fixture with answers known by hand
   --------------------------------------------------------------- */
const FIXTURE=`<!doctype html><meta charset=utf-8><body style="margin:0;background:#fff">
<style>.pp::before{content:"Q";font:700 21px Arial;color:#111}#phi::placeholder{color:#bbbbbb;opacity:1}</style>
<div id=h>
<p class=pp style="margin:0"></p><input type=checkbox id=cbx><input id=phi placeholder="ph text" style="box-sizing:border-box;width:150px;height:24px;border:0;padding:0;background:#fff;color:#000;font:400 15px Arial">
<p id=t1 style="margin:0;font:400 16px Arial;color:#000">black on white</p>
<p id=t2 style="margin:0;font:400 14px Arial;color:#777777">grey on white</p>
<p id=t3 style="margin:0;font:400 12px Arial;color:#fff;background:color-mix(in srgb,#000 50%,#fff)">white on mix</p>
<p id=t4 style="margin:0;font:400 16px Arial;color:#fff;background:linear-gradient(90deg,#000,#fff)">white on gradient</p>
<p id=t5 style="margin:0;font:700 24px Arial;color:rgba(0,0,0,.5)">half black large bold</p>
<button id=b1 style="box-sizing:border-box;width:20px;height:20px;padding:0;border:2px solid #f00;border-radius:4px;box-shadow:0 1px 2px #000">x</button>
<button id=b2 style="box-sizing:border-box;width:48px;height:48px;padding:0;border:0;background:#0a0;border-radius:999px">y</button>
<svg id=s1 width=24 height=24 viewBox="0 0 24 24"><circle cx=12 cy=12 r=8 fill=none stroke=#000 stroke-width=1.5 stroke-linecap=round /></svg>
<svg id=s2 width=48 height=48 viewBox="0 0 24 24"><path d="M2 2L20 20" stroke=#000 stroke-width=2 fill=none /></svg>
<svg id=s3 width=16 height=16 viewBox="0 0 16 16"><rect width=8 height=8 fill=#000 /></svg>
<svg id=s4 width=200 height=40><rect width=200 height=40 fill=#000 /><text x=10 y=25 font-size=16 fill=#fff>svg white on black</text></svg>
<div style="position:relative;height:30px"><canvas id=cA width=100 height=30 style="position:absolute;left:0;top:0;width:100px;height:30px"></canvas><span style="position:relative;font:400 16px Arial;color:#fff">white on black canvas</span></div>
<div style="position:relative;height:30px"><canvas id=cB width=100 height=30 style="position:absolute;left:0;top:0;width:100px;height:30px"></canvas><span style="position:relative;font:400 17px Arial;color:#fff">white on grey canvas</span></div>
<script>document.getElementById('cA').getContext('2d').fillRect(0,0,100,30);var xb=document.getElementById('cB').getContext('2d');xb.fillStyle='#888888';xb.fillRect(0,0,100,30);</script>
<div style="position:relative;width:200px;height:30px;background:#222"><div style="position:absolute;left:0;top:0;width:100px;height:30px;background:#88ccff"></div>
<span style="position:absolute;left:8px;top:6px;font:400 16px Arial;color:#eeeeee">fill label</span>
<span style="position:absolute;left:8px;top:6px;font:400 16px Arial;color:#001018;clip-path:inset(0)">fill label</span></div>
<div style="position:relative;width:200px;height:30px;background:#222">
<span style="position:absolute;left:8px;top:6px;font:400 16px Arial;color:#eeeeee">bare label</span>
<span style="position:absolute;left:8px;top:6px;font:400 16px Arial;color:#001018;clip-path:inset(0 100% 0 0)">bare label</span></div>
<div id=sc style="height:100px;overflow:auto;background:#000"><div style="height:400px"></div><p id=sp style="margin:0;background:#00aaff;color:#001018;font:400 16px Arial">scrolled text</p><div style="height:200px"></div></div>
<div style="overflow:hidden;height:0"><p id=g1 style="margin:0;font:400 31px Arial;color:#111">ghost clipped</p></div>
<p id=g2 style="margin:0;display:none;font:400 33px Arial">ghost none</p>
<p id=g3 style="margin:0;position:absolute;left:-999px;font:400 35px Arial">ghost offscreen</p>
<p id=g4 style="margin:0;width:1px;height:1px;overflow:hidden;font:400 37px Arial">ghost one pixel</p>
</div>`;
async function selftest(browser){
 const p=await browser.newPage({viewport:{width:400,height:700}});
 await p.setContent(FIXTURE);
 const r=await p.evaluate(PROBE,{hostIds:['h'],hostId:'h'});
 await p.close();
 const A=r.all,d=digest(A),bad=[];
 /* the pixel oracle is checked against the fixture before it is trusted */
 const hp=await browser.newPage();await hp.goto('about:blank');
 const p3=await browser.newPage({viewport:{width:400,height:700}});await p3.setContent(FIXTURE);
 const r3=await p3.evaluate(PROBE,{hostIds:['h'],hostId:'h'});
 const px3=await pixelPass(p3,hp,r3.texts);
 await p3.close();await hp.close();
 const near=(a,b,t)=>Math.abs(a-b)<=t;
 const f=k=>A.fails[Object.keys(A.fails).find(x=>x.endsWith('|'+k))];
 const chk=(name,ok,got)=>{if(!ok)bad.push(name+' got '+JSON.stringify(got));};
 const byFs=fs=>Object.values(A.fails).find(x=>x.fs===fs);
 /* font sizes present: 16 (t1,t4,s4 text), 14, 12, 24, 16 buttons text default 13.333 */
 chk('size 14px counted once',A.fs['14px']&&A.fs['14px'].n===1,A.fs['14px']);
 chk('size 24px counted once',A.fs['24px']&&A.fs['24px'].n===1,A.fs['24px']);
 chk('ghost sizes absent (31,33,35,37px)',!A.fs['31px']&&!A.fs['33px']&&!A.fs['35px']&&!A.fs['37px'],[A.fs['31px'],A.fs['33px'],A.fs['35px'],A.fs['37px']]);
 /* contrast: black 21 is a pass (not in fails); #777 14px 4.48 fails; color-mix 3.95 fails; gradient fails ~1; half black 24px bold large >=3 passes as large */
 const f777=Object.values(A.fails).find(x=>x.fs==='14');
 chk('#777 on white = 4.48',f777&&near(f777.ratio,4.48,0.02),f777);
 const fmix=Object.values(A.fails).find(x=>x.fs==='12');
 chk('white on color-mix 50% = about 3.95',fmix&&near(fmix.ratio,3.95,0.08),fmix);
 const fgrad=Object.values(A.fails).filter(x=>x.fs==='16'&&x.ratio<1.2)[0];
 chk('white on black to white gradient worst = 1.0',fgrad&&near(fgrad.ratio,1,0.02),fgrad);
 chk('large bold half black is a large-text pass (3.98 >= 3), not a failure',A.nFailLarge===1&&A.nFail===7&&Object.values(A.fails).filter(x=>x.fs==='24').every(x=>x.large),[A.nFailLarge,A.nFail]);
 chk('black on white not a failure',!Object.values(A.fails).some(x=>x.sample==='black on white'),A.fails);
 chk('svg white on black passes (ground from the rect under it)',!Object.values(A.fails).some(x=>/svg white/.test(x.sample)),A.fails);
 chk('four ghosts add no text elements: 17 visible (t1..t5, b1, b2, the svg text, two canvas spans, one text inside a scroller, one pseudo element, one placeholder, two layers each of two bar labels)',A.nText===17,A.nText);
 chk('a placeholder is measured with its own ink (#bbb on white = 1.9), not the control\'s black',Object.values(A.fails).some(x=>x.sample==='ph text'&&near(x.ratio,1.9,0.1)),A.fails);
 chk('generated content is measured with its own font (21px bold), a checkbox contributes no text',A.fs['21px']&&A.fs['21px'].n===1&&A.fw['700'].n>=2&&A.fs['13.3px'].n===2,[A.fs,A.fw]);
 chk('text over a 2D canvas reads the canvas pixels: white on black passes, white on #888 = 3.54 fails',!Object.values(A.fails).some(x=>/black canvas/.test(x.sample))&&Object.values(A.fails).some(x=>/grey canvas/.test(x.sample)&&near(x.ratio,3.54,0.05))&&A.nUnres===0,[A.nUnres,A.fails]);
 /* taps: b1 20px, b2 48px */
 chk('four taps found (two buttons, the checkbox, the input)',A.nTap===4,A.nTap);
 chk('smallest tap is the 13px checkbox, then the 20px button',A.tap[0]&&A.tap[0].m>=12&&A.tap[0].m<=16&&A.tap[1]&&A.tap[1].m===20,A.tap.slice(0,2));
 chk('lt24 = 2 and lt44 = 3',d.tap.lt24===2&&d.tap.lt44===3,d.tap);
 /* paint */
 chk('radius 4px and pill and circle? b1=4px, b2 circle',A.rad['4px']&&A.rad['4px'].n===1&&A.rad['circle']&&A.rad['circle'].n===1,A.rad);
 chk('one box shadow',Object.keys(A.sh).length===1,A.sh);
 chk('border 2px #ff0000',A.bw['2px']&&A.bd['#ff0000'],[A.bw,A.bd]);
 /* icons: s1 24px ring 1.5, s2 48px ring rendered 4 (authored 2), s3 solid */
 chk('icon stroke 1.5px and 4px rendered',A.stI['1.5px']&&A.stI['4px'],A.stI);
 chk('authored widths 1.5 and 2',A.stIa['1.5']&&A.stIa['2'],A.stIa);
 chk('icon classes 2 ring 1 solid',A.icCls.ring&&A.icCls.ring.n===2&&A.icCls.solid&&A.icCls.solid.n===1,A.icCls);
 chk('icon sizes 24 48 16 (and the 200px svg is a figure)',A.icSz['24px']&&A.icSz['48px']&&A.icSz['16px']&&!A.icSz['200px'],A.icSz);
 /* parser alone, through the page */
 const byS=sm=>{const i=r3.texts.findIndex(t=>t.sample.indexOf(sm)===0);return i<0?null:{css:r3.texts[i].css,px:px3[i]&&px3[i].r};};
 const P={black:byS('black on white'),grey:byS('grey on white'),mix:byS('white on mix'),grad:byS('white on gradient'),cb:byS('white on black canvas'),cg:byS('white on grey canvas'),svg:byS('svg white'),sp:byS('scrolled text')};
 chk('pixel oracle: black on white photographs as 21 (+-0.3)',P.black&&P.black.px&&near(P.black.px,21,0.3),P);
 chk('pixel oracle: #777 on white photographs near 4.48 (+-0.1)',P.grey&&P.grey.px&&near(P.grey.px,4.48,0.1),P.grey);
 chk('pixel oracle: color-mix ground photographs near 3.95 (+-0.15)',P.mix&&P.mix.px&&near(P.mix.px,3.95,0.15),P.mix);
 chk('pixel oracle: gradient is a CSS false positive (css 1.0, pixels well above 4.5)',P.grad&&P.grad.css<1.2&&P.grad.px>4.5,P.grad);
 chk('pixel oracle: canvas black 21 and canvas grey 3.54 (+-0.15)',P.cb&&P.cb.px>20&&P.cg&&near(P.cg.px,3.54,0.15),[P.cb,P.cg]);
 const ix=(sm,dark)=>r3.texts.findIndex(t=>t.sample.indexOf(sm)===0&&(dark?t.fg[0]<10:t.fg[0]>200));
 const fl=ix('fill label',0),fd=ix('fill label',1),bl=ix('bare label',0),bd=ix('bare label',1);
 chk('paint test: the light copy of a two layer label is overdrawn by the dark copy over the fill, so it is a ghost (a box and no paint)',fl>=0&&px3[fl]&&px3[fl].ghost===true,[fl,px3[fl]]);
 chk('paint test: the dark copy clipped to the fill paints dark on light (about 11, where CSS alone said 1.1)',fd>=0&&r3.texts[fd].css<1.5&&px3[fd]&&!px3[fd].ghost&&px3[fd].r>8,[fd,r3.texts[fd]&&r3.texts[fd].css,px3[fd]]);
 chk('paint test: a dark copy clipped away entirely is a ghost, and the light copy beside it paints at about 14',bd>=0&&px3[bd]&&px3[bd].ghost===true&&bl>=0&&px3[bl]&&!px3[bl].ghost&&px3[bl].r>12,[px3[bd],px3[bl]]);
 chk('pixel oracle: text far down inside a scroller is reached by scrolling and reads its own bright ground (about 8.6, not the 1.0 of a black padded screenshot)',P.sp&&P.sp.px>7&&P.sp.px<10,P.sp);
 chk('pixel oracle: svg text over a rect reads 21',P.svg&&P.svg.px>20,P.svg);
 const p2=await browser.newPage();await p2.setContent('<body>');
 const pr=await p2.evaluate(()=>{const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d',{willReadFrequently:true});
  const t=s=>{cx.fillStyle='#010203';cx.fillStyle=s;return cx.fillStyle;};
  return {rgb:t('rgb(10,20,30)'),mix:t('color-mix(in srgb,#000 50%,#fff)'),srgb:t('color(srgb 1 0 0)'),bad:t('notacolour'),a:t('rgba(0,0,0,.5)')};});
 await p2.close();
 chk('canvas rejects a bad colour (stays at the sentinel)',pr.bad==='#010203',pr);
 chk('canvas serialises color-mix as something we can read',typeof pr.mix==='string'&&pr.mix.length>3,pr);
 return {ok:bad.length===0,bad,fails:Object.values(A.fails),nText:A.nText,pr};}

/* ---------------------------------------------------------------
   MAIN
   --------------------------------------------------------------- */
/* Wait until the surface has stopped changing: the same element count and host markup length on two reads half a
   second apart. A fixed sleep measured the Story as a half drawn page under load (5 sizes, 16 controls, against
   11 and 36 on the next two runs), which is a flake in the gate and a flake is a defect. */
const waitStable=async(page,hostId)=>{let last=null;
 for(let i=0;i<16;i++){
  const cur=await page.evaluate(h=>{const e=document.getElementById(h);return document.body.querySelectorAll('*').length+':'+(e?e.innerHTML.length:0)+':'+(document.body.className);},hostId);
  if(cur===last)return i;last=cur;await page.waitForTimeout(500);}
 return -1;};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
const fmtTop=(s,n)=>s.top.slice(0,n).map(e=>e[0]+' x'+e[1]).join(', ');

(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 const st=await selftest(browser);
 if(!st.ok){
  /* nText expectation is recomputed by hand below so a wrong guess in the fixture count is visible */
  console.error('SELFTEST FAILED. The probe is lying; not measuring the product.\n'+st.bad.map(x=>'  - '+x).join('\n'));
  await browser.close();process.exit(2);}
 console.log('selftest: ok ('+st.nText+' visible text elements in the fixture, 4 ghosts excluded)');
 if(opt('selftest',false)){await browser.close();return;}

 const cp=require('child_process');
 const sh=c=>{try{return cp.execSync(c,{encoding:'utf8',cwd:path.dirname(FILE)}).trim();}catch(e){return '?';}};
 const out={file:FILE,md5:sh('md5sum '+JSON.stringify(path.basename(FILE))).split(' ')[0],commit:sh('git rev-parse --short HEAD'),dirty:sh('git status --short -- '+JSON.stringify(path.basename(FILE)))!=='',profile:PROFILE,profileName:null,theme:null,widths:{},when:new Date().toISOString()};
 const helper=await browser.newPage();await helper.goto('about:blank');
 const errs=[];
 for(const W of WIDTHS){
  const page=await browser.newPage({viewport:{width:W,height:HEIGHT[W]||900}});
  page.on('pageerror',e=>errs.push(W+': '+String(e.message)));
  page.on('request',r=>{const u=r.url();if(!/^(file|data|blob|about):/.test(u))(out.requests=out.requests||[]).push(u);});
  await page.goto('file://'+FILE+'?dev=1');await booted(page);await page.waitForTimeout(400);
  const surfaces=await page.evaluate(()=>{const a=TABDEF.map(t=>({nm:t.nm,k:t.k,id:t.id,sec:t.sec||null,door:true}));
   Object.keys(TABEXTRA).forEach(k=>{const t=TABEXTRA[k];a.push({nm:t.nm,k:t.k,id:t.id,sec:null,door:false});});return a;});
  const hostIds=surfaces.map(s=>s.id);
  const run=surfaces.filter(s=>!ONLY||String(ONLY).split(',').indexOf(s.nm)>=0);
  out.widths[W]={surfaces:{}};
  for(const s of run){
   await page.evaluate(a=>{if(a.p>=0)loadP(a.p);setTab(a.k);render();},{p:PROFILE,k:s.k});
   await page.waitForTimeout(SETTLE);
   const stab=await waitStable(page,s.id);if(stab<0)out.unstable=(out.unstable||[]).concat([W+' '+s.nm]);
   const raw=await page.evaluate(PROBE,{hostIds,hostId:s.id});
   const stateOk=await page.evaluate(k=>S.tab===TABREAL(k),s.k);
   const theme=await page.evaluate(()=>S.theme||document.body.className);
   out.theme=theme;out.profileName=await page.evaluate(i=>i>=0&&PEOPLE[i]?(PEOPLE[i].name||PEOPLE[i].nm||PEOPLE[i].n||'?'):'blank',PROFILE);
   out.widths[W].surfaces[s.nm]={meta:s,stateOk,counts:raw.counts,doc:raw.doc,all:digest(raw.all),host:digest(raw.host),rawAll:raw.all};
   const px=await pixelPass(page,helper,raw.texts);
   const rec=out.widths[W].surfaces[s.nm];
   rec.all.contrast=Object.assign(contrastOf(raw.texts,px,null),{unresolved:rec.all.contrast.unresolved,unresWhy:rec.all.contrast.unresWhy,css:{fail:rec.all.contrast.fail,min:rec.all.contrast.min}});
   rec.host.contrast=contrastOf(raw.texts,px,'host');
  }
  await page.close();
 }
 await browser.close();
 out.errors=errs;

 /* ---------------- markdown tables ---------------- */
 const L=['Build '+path.basename(FILE)+' md5 '+out.md5+' commit '+out.commit+(out.dirty?' (file dirty)':'')+', theme '+out.theme+', profile '+PROFILE+' '+out.profileName+', widths '+WIDTHS.join(' and ')+', measured '+out.when];
 const names=Object.keys(out.widths[WIDTHS[0]].surfaces);
 for(const W of WIDTHS){
  const S=out.widths[W].surfaces;
  L.push('', '### '+W+' wide: distinct values per surface (whole screen: chrome plus the surface)','');
  L.push('| surface | text px | weights | text ink (families) | fills (families) | borders (families) | radii | shadows | icon strokes | interactive | tap <44 | tap <24 | contrast <4.5 | text <12px |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for(const n of names){const d=S[n].all;
   L.push('| '+n+(S[n].stateOk?'':' (TAB MISMATCH)')+' | '+d.size.distinct+' | '+d.weight.distinct+' | '+d.textEff.distinct+' ('+d.textEff.families+') | '+d.fill.distinct+' ('+d.fill.families+') | '+d.border.distinct+' ('+d.border.families+') | '+d.radius.distinct+' | '+d.shadow.distinct+' | '+d.iconStroke.distinct+' | '+d.tap.n+' | '+d.tap.lt44+' | '+d.tap.lt24+' | '+d.contrast.fail+' of '+d.contrast.checked+' | '+d.text.tiny+' |');}
 }
 /* overall: union over surfaces */
 const overall={};
 for(const W of WIDTHS){
  const S=out.widths[W].surfaces;
  const un=sumMaps(names.map(n=>S[n].rawAll));
  const reuse={};
  MAPS.forEach(k=>{const keys=Object.keys(un[k]);reuse[k]={distinct:keys.length,
   inMany:keys.filter(v=>names.filter(n=>S[n].rawAll[k]&&S[n].rawAll[k][v]).length>=Math.ceil(names.length/2)).length,
   onOne:keys.filter(v=>names.filter(n=>S[n].rawAll[k]&&S[n].rawAll[k][v]).length===1).length};});
  overall[W]={un,reuse,dig:Object.fromEntries(Object.entries(un).map(([k,m])=>[k,summarise(m,['tc','tce','fill','bd','stCol'].includes(k))]))};
 }
 out.overall=Object.fromEntries(Object.entries(overall).map(([w,o])=>[w,{reuse:o.reuse,dig:o.dig}]));
 L.push('','### Overall: union across all surfaces','');
 L.push('| dimension | width | distinct | families | shared by half the surfaces or more | seen on one surface only | top 5 cover | most used |');
 L.push('|---|---|---|---|---|---|---|---|');
 const LBL={fs:'text sizes',fw:'weights',ff:'families',tce:'text ink',fill:'fills',bd:'border colours',bw:'border widths',rad:'radii',sh:'shadows',shg:'shadow geometry',stI:'icon stroke px',stIa:'icon stroke authored',stF:'figure stroke px',cap:'linecap/join',icSz:'icon sizes',icCls:'icon style',stCol:'stroke colours'};
 for(const k of Object.keys(LBL))for(const W of WIDTHS){const d=overall[W].dig[k],r=overall[W].reuse[k];
  L.push('| '+LBL[k]+' | '+W+' | '+d.distinct+' | '+(d.families||'')+' | '+r.inMany+' | '+r.onOne+' | '+d.top5pct+'% | '+fmtTop(d,3).replace(/\|/g,'/')+' |');}

 const DIMS=[['fs','text sizes'],['fw','weights'],['tce','text ink'],['fill','fills'],['bd','border colours'],['rad','radii'],['shg','shadow geometry'],['stIa','icon stroke authored'],['icSz','icon sizes']];
 {const fam={};for(const W of WIDTHS)names.forEach(n=>{const sm=out.widths[W].surfaces[n].all.family.samples;Object.entries(sm).forEach(([k,v])=>{(fam[k]=fam[k]||new Set());v.forEach(x=>fam[k].add(x));});});
  L.push('','### Text not set in the house font ('+Object.keys(fam).join(', ')+'): first samples','');Object.entries(fam).forEach(([k,v])=>L.push('- '+k+': '+[...v].slice(0,8).join('; ')));
  L.push('','Requests that were not file, data, blob or about: '+((out.requests||[]).length)+((out.requests||[]).length?' '+(out.requests||[]).slice(0,5).join(' '):'')+'. Surfaces still changing after 8 seconds: '+((out.unstable||[]).join(', ')||'none')+'.');}
 L.push('','### Coherence summary (not a grade: two ratios a skin can move)','');
 L.push('| width | concentration: mean share of uses covered by the top 5 values, over nine dimensions | local dialect: values seen on one surface only, as a share of all distinct values | text under 12px, share of characters |','|---|---|---|---|');
 for(const W of WIDTHS){
  const conc=Math.round(DIMS.reduce((a,[k])=>a+overall[W].dig[k].top5pct,0)/DIMS.length);
  const dist=DIMS.reduce((a,[k])=>a+overall[W].reuse[k].distinct,0),one=DIMS.reduce((a,[k])=>a+overall[W].reuse[k].onOne,0);
  const sm=names.reduce((a,n)=>a+out.widths[W].surfaces[n].all.text.smallCharPct,0)/names.length;
  out.overall[W].concentration=conc;out.overall[W].dialectPct=Math.round(100*one/dist);out.overall[W].smallCharPct=Math.round(sm);
  L.push('| '+W+' | '+conc+'% | '+Math.round(100*one/dist)+'% ('+one+' of '+dist+') | '+Math.round(sm)+'% (mean of surfaces) |');}
 L.push('','### Accessibility and voice floors, per surface','');
 for(const W of WIDTHS){
  const S=out.widths[W].surfaces;
  L.push('', '**'+W+' wide**','');
  L.push('| surface | min contrast (pixels) | fails under 4.5 (pixels) | of which under 4.0 | css said fail, pixels disagree (false+) | css said pass, pixels fail (false-) | photographed of checked | ghosts (box but no paint) | unresolved ground | smallest tap | median tap | above the fold taps | all caps | em dash | glyph icons | h overflow px |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for(const n of names){const d=S[n].all;
   L.push('| '+n+' | '+(d.contrast.min===null?'n/a':d.contrast.min)+' | '+d.contrast.fail+' | '+d.contrast.hard+' | '+d.contrast.falsePos+' | '+d.contrast.falseNeg+' | '+d.contrast.photographed+' of '+d.contrast.checked+' | '+d.contrast.ghost+' | '+d.contrast.unresolved+' | '+(d.tap.min===null?'n/a':d.tap.min+'px')+' | '+d.tap.median+'px | '+d.tap.fold+' | '+d.text.caps+' | '+d.text.dash+' | '+d.text.glyph.reduce((s,g)=>s+g[1],0)+' | '+Math.max(0,S[n].doc.overflowX)+' |');}
 }
 /* findings: the actual offenders, deduplicated across surfaces */
 for(const W of WIDTHS){
  const S=out.widths[W].surfaces,seenF={},fl=[];
  names.forEach(n=>S[n].all.contrast.fails.forEach(f=>{const k=f.sel+'|'+f.sample+'|'+f.fg+'|'+f.bg;if(!seenF[k]){seenF[k]=1;fl.push(Object.assign({surface:n},f));}else seenF[k]++;}));
  fl.sort((a,b)=>a.ratio-b.ratio);
  L.push('','### '+W+' wide: contrast failures under 4.5 (pixel verified, unique by element, '+fl.length+' unique)','');
  L.push('| ratio | ink on ground | px | element | text | first seen on |','|---|---|---|---|---|---|');
  fl.slice(0,40).forEach(f=>L.push('| '+f.ratio+' | '+f.fg+' on '+f.bg+' | '+f.fs+' | '+f.sel+' | '+f.sample.replace(/\|/g,'/')+' | '+f.surface+' |'));
  const tl=[],seenT={};
  names.forEach(n=>S[n].all.tap.worst.forEach(t=>{const k=t.sel+'|'+t.n;if(!seenT[k]){seenT[k]=1;tl.push(Object.assign({surface:n},t));}}));
  tl.sort((a,b)=>a.m-b.m);
  L.push('','### '+W+' wide: smallest tap targets (unique, under 44)','');
  L.push('| smaller side | size | element | name | surface |','|---|---|---|---|---|');
  tl.filter(t=>t.m<44).slice(0,25).forEach(t=>L.push('| '+t.m+'px | '+t.w+'x'+t.h+' | '+t.sel+' ('+t.k+') | '+t.n.replace(/\|/g,'/')+' | '+t.surface+' |'));
 }
 const md=L.join('\n');
 console.log(md);
 if(opt('md',false))fs.writeFileSync(opt('md'),md);
 if(opt('json',false)){const j=JSON.parse(JSON.stringify(out));
  fs.writeFileSync(opt('json'),JSON.stringify(j));}
 if(errs.length)console.log('\nPAGE ERRORS: '+errs.join(' | '));

 /* ---------------- gate: nothing that is "lower is better" may get worse ---------------- */
 if(opt('gate',false)){
  const bp=opt('baseline',false);
  if(!bp||bp===true){console.error('--gate needs --baseline FILE');process.exit(2);}
  const base=JSON.parse(fs.readFileSync(bp,'utf8'));
  const worse=[];
  for(const W of WIDTHS){
   const Bs=base.widths[W]&&base.widths[W].surfaces;if(!Bs)continue;
   for(const n of names){if(!Bs[n])continue;const a=out.widths[W].surfaces[n].all,b=Bs[n].all;
    const pairs=[['text sizes',a.size.distinct,b.size.distinct],['weights',a.weight.distinct,b.weight.distinct],
     ['text ink families',a.textEff.families,b.textEff.families],['fills families',a.fill.families,b.fill.families],
     ['border families',a.border.families,b.border.families],['radii',a.radius.distinct,b.radius.distinct],
     ['shadows',a.shadow.distinct,b.shadow.distinct],['icon strokes',a.iconStroke.distinct,b.iconStroke.distinct],
     ['contrast under 4.0',a.contrast.hard,b.contrast.hard],['contrast under 4.5 (tolerance 1: the canvas wash moves the ground)',a.contrast.fail,b.contrast.fail,1],['tap <44',a.tap.lt44,b.tap.lt44],['tap <24',a.tap.lt24,b.tap.lt24],
     ['text <12px',a.text.tiny,b.text.tiny],['all caps',a.text.caps,b.text.caps],['em dashes',a.text.dash,b.text.dash]];
    pairs.forEach(([k,x,y,tol])=>{if(x>y+(tol||0))worse.push(W+' '+n+': '+k+' '+y+' -> '+x);});}}
  if(worse.length){console.log('\nGATE FAIL: '+worse.length+' metric(s) worse than the baseline');worse.slice(0,60).forEach(w=>console.log('  '+w));process.exit(1);}
  console.log('\nGATE PASS: no metric worse than the baseline');
 }
})().catch(e=>{console.error(e);process.exit(3);});
