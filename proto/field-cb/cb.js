/* CB. What the round CB comps share: the shipped Frames and Dial pictures,
   mounted from cap/cap.js, and the parts every comp redraws on them, the
   centre and the six gates. Everything else in a picture is the product's own
   markup, captured and left alone, so a difference between a comp and the
   shipped screen is a difference somebody chose.

   The picture's groups arrive in the order ui/rings.js writes them, FR_L then
   FR_T: shadow, ground, domains, stories, addresses, masks, archetypes,
   patterns, chains, laws, core, gates, and then the seven label layers. The
   core is the eleventh and the gates the twelfth, found by that order and
   checked, never guessed from a position on screen. */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg', TAU=Math.PI*2;
const C=window.CB={TAU:TAU};

/* ---------- colour ---------- */
C.hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
C.mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
C.rgb=c=>'rgb('+c.map(v=>Math.round(v)).join(',')+')';
C.rgba=(c,a)=>'rgba('+c.map(v=>Math.round(v)).join(',')+','+a+')';
C.INK=[239,237,232]; C.GROUND=[16,16,16]; C.PANEL=[26,29,38];
C.DIM=C.mix(C.INK,C.GROUND,.4);            /* M.dim in rings.js */
C.TIER=C.hx('#7D93E0');                    /* Oscillating, TIERCOL */
C.DQ=C.hx('#B9757B');                      /* see --dq in cb.css */
C.HI=C.hx('#5FD5A6'); C.LO=C.hx('#D6524C'); /* the higher gates in Heart, the lower in Root, as frGate draws them */

/* ---------- the reading ----------
   James with his five story lines, the one reading every comp in this round
   and in proto/field-rings is drawn from. CQ and DQ are the live figures.
   The six gate shares are EXAMPLE values: no reference profile has ever lit
   a gate (BO3), so the shipped pictures show six dashes, and a placement for
   six percentages cannot be judged on six dashes. They sum to 100, as
   verpShare's do, because every share is of one whole. */
C.R={CQ:43.67,DQ:34.5,tier:'Oscillating',lo:38.29,hi:49.04};
C.GATES=[
 {k:'aware', nm:'Awareness', side:'higher',pct:12},
 {k:'detach',nm:'Detachment',side:'higher',pct:9},
 {k:'intent',nm:'Intention', side:'higher',pct:17},
 {k:'ignore',nm:'Ignorance', side:'lower', pct:24},
 {k:'attach',nm:'Attachment',side:'lower', pct:22},
 {k:'averse',nm:'Aversion',  side:'lower', pct:16}];
C.G={};C.GATES.forEach(g=>{C.G[g.k]=g;});
/* THE THREE OPPOSITIONS. "They're in opposition": each higher gate has one
   lower gate it stands against, and VERP's own descriptions pair them. Present
   against not seeing, out of the story against in it, holding course against
   going around. Higher first, lower second, and the goal is the higher. */
C.PAIRS=[['aware','ignore'],['detach','attach'],['intent','averse']];
/* the six from canon.js, GATEGLYPH. ring, never fill */
C.GLYPH={
 aware:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
 detach:'M10 14m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
 intent:'M12 20V5M6 11l6-6 6 6',
 ignore:'M2 12s4 5 10 5 10-5 10-5M6 15l-2 3M12 17v3M18 15l2 3',
 attach:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5',
 averse:'M3 19C3 9 21 9 21 19M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'};

/* ---------- svg ---------- */
C.el=function(tag,at,parent){const e=document.createElementNS(NS,tag);
 for(const k in (at||{}))if(at[k]!==undefined&&at[k]!==null)e.setAttribute(k,at[k]);
 if(parent)parent.appendChild(e);return e;};
C.text=function(parent,s,x,y,at){const e=C.el('text',Object.assign({x:(+x).toFixed(1),y:(+y).toFixed(1)},at||{}),parent);
 e.textContent=s;return e;};
/* a word over line work carries a halo of the ground, as frLabel does */
C.halo=(at,bg)=>Object.assign({stroke:C.rgb(bg||C.GROUND),'stroke-width':4,'stroke-linejoin':'round','paint-order':'stroke'},at);
/* frArcD, including its reason: a full turn is two arcs, or SVG draws none */
C.arcD=function(cx,cy,r,a0,a1){
 if(a1-a0>=TAU-1e-6)return C.arcD(cx,cy,r,a0,a0+Math.PI)+C.arcD(cx,cy,r,a0+Math.PI,a0+TAU).replace(/^M[^A]+/,'');
 const neg=a1<a0; if(neg){const t=a0;a0=a1;a1=t;}
 const large=(a1-a0)>Math.PI?1:0;
 const p=a=>(cx+Math.cos(a)*r).toFixed(2)+' '+(cy+Math.sin(a)*r).toFixed(2);
 return neg?'M'+p(a1)+'A'+r.toFixed(2)+' '+r.toFixed(2)+' 0 '+large+' 0 '+p(a0)
           :'M'+p(a0)+'A'+r.toFixed(2)+' '+r.toFixed(2)+' 0 '+large+' 1 '+p(a1);};
C.glyph=function(parent,d,x,y,size,col,w){const s=size/24;
 const g=C.el('g',{transform:'translate('+(x-size/2).toFixed(2)+' '+(y-size/2).toFixed(2)+') scale('+s.toFixed(4)+')'},parent);
 C.el('path',{d:d,fill:'none',stroke:col,'stroke-width':(w/s).toFixed(2),'stroke-linecap':'round','stroke-linejoin':'round'},g);
 return g;};

/* ---------- mounting a captured picture ---------- */
C.mount=function(host,key){
 const src=window.CAP&&CAP.svg[key]; if(!src)throw new Error('no capture for '+key);
 host.insertAdjacentHTML('beforeend',src);
 const svg=host.lastElementChild;
 const gs=[...svg.children].filter(n=>n.tagName==='g');
 if(gs.length!==19)throw new Error(key+': expected the 19 groups rings.js writes, found '+gs.length);
 const core=gs[10],gates=gs[11];
 const cs=core.querySelectorAll('circle');
 if(cs.length<2)throw new Error(key+': the core has no ring');
 const disc=cs[0],track=cs[1];
 const M={key:key,svg:svg,gs:gs,core:core,gates:gates,W:+svg.getAttribute('width'),H:+svg.getAttribute('height'),
  cx:+track.getAttribute('cx'),cy:+track.getAttribute('cy'),R:+track.getAttribute('r'),
  w:+track.getAttribute('stroke-width'),disc:+disc.getAttribute('r')};
 M.halo=M.disc-M.R-M.w/2;
 M.small=M.W<500;
 return M;};
C.clear=g=>{while(g.firstChild)g.removeChild(g.firstChild);};

/* ---------- the centre ----------
   'A' one ring, two arcs. Coherence runs clockwise from twelve and shadow
       anticlockwise from twelve, on the one ring. The literal picture of
       "drawing one down to gain one up".
   'B' two rings. Coherence the outer ring at the weight it has now, shadow a
       finer ring inside it. Two scales, two rings.
   'C' one ring. Coherence keeps the only arc and shadow is a number under a
       rule, with no arc of its own.
   'arcs' B with no numbers at all, for the phone, where the numbers move out.
   Every numeric variant stacks three levels: coherence large and light,
   shadow smaller and heavier in its own tone, the two names at eleven. */
C.centre=function(M,v,o){o=o||{};const g=M.core;C.clear(g);
 const grow=o.grow||1,R=M.R*grow,w=M.w,cx=M.cx,cy=M.cy,halo=M.halo;
 C.el('circle',{cx:cx,cy:cy,r:(R+w/2+halo).toFixed(1),fill:C.rgb(C.GROUND)},g);
 const top=-Math.PI/2,fc=C.R.CQ/100,fd=C.R.DQ/100;
 C.el('circle',{cx:cx,cy:cy,r:R,fill:'none',stroke:'rgba(128,128,128,.22)','stroke-width':w},g);
 C.el('path',{d:C.arcD(cx,cy,R,top,top+TAU*fc),fill:'none',stroke:C.rgb(C.TIER),'stroke-width':w,'stroke-linecap':'round'},g);
 /* the swing, cqRange, drawn and never stated, as the core draws it now */
 C.el('path',{d:C.arcD(cx,cy,R+w/2+halo/2,top+TAU*C.R.lo/100,top+TAU*C.R.hi/100),fill:'none',
  stroke:C.rgba(C.TIER,.55),'stroke-width':3,'stroke-linecap':'round'},g);
 let inner=R-w/2-3;
 if(v==='A'){
  C.el('path',{d:C.arcD(cx,cy,R,top-TAU*fd,top),fill:'none',stroke:C.rgb(C.DQ),'stroke-width':w,'stroke-linecap':'round'},g);}
 if(v==='B'||v==='arcs'){
  const ri=R-w/2-(M.small?4:6),wi=M.small?2:2.5;
  C.el('circle',{cx:cx,cy:cy,r:ri,fill:'none',stroke:'rgba(128,128,128,.16)','stroke-width':wi},g);
  C.el('path',{d:C.arcD(cx,cy,ri,top,top+TAU*fd),fill:'none',stroke:C.rgb(C.DQ),'stroke-width':wi,'stroke-linecap':'round'},g);
  inner=ri-wi/2-2;}
 if(v==='arcs')return {inner:inner};
 /* the stack, sized off the free radius. The names hold at eleven: the
    product's floor does not scale with a ring */
 const s=inner/45, f1=Math.max(22,38*s), f2=Math.max(13,17*s), lab=11;
 const c1=f1*.727, c2=f2*.727, lc=lab*.727, g1=Math.max(4,6*s), g2=Math.max(7,11*s);
 const H=c1+g1+lc+g2+c2, y0=cy-H/2;
 C.text(g,String(Math.round(C.R.CQ)),cx,y0+c1,{'text-anchor':'middle',fill:C.rgb(C.TIER),'font-size':f1.toFixed(1),'font-weight':300,'letter-spacing':'-0.02em'});
 C.text(g,'coherence',cx,y0+c1+g1+lc,{'text-anchor':'middle',fill:C.rgb(C.DIM),'font-size':lab,'font-weight':500});
 const ry=y0+c1+g1+lc+g2/2+.5;
 C.el('line',{x1:cx-12,y1:ry,x2:cx+12,y2:ry,stroke:'rgba(255,255,255,.16)','stroke-width':1},g);
 const t=C.text(g,'',cx,y0+H,{'text-anchor':'middle'});
 const a=C.el('tspan',{fill:C.rgb(C.DQ),'font-size':f2.toFixed(1),'font-weight':500},t);a.textContent=String(Math.round(C.R.DQ));
 const b=C.el('tspan',{fill:C.rgb(C.DIM),'font-size':lab,'font-weight':500,dx:4},t);b.textContent='shadow';
 return {inner:inner,f1:f1,f2:f2,block:[cx-inner,y0,2*inner,H]};};
/* the figure the shipped core sets, read off the capture before it is redrawn */
C.shipFs=M=>{const t=M.core.querySelector('text');return t?+t.getAttribute('font-size'):0;};
/* the gap two arcs on one ring would leave, for every read reference profile */
C.gaps=()=>((CAP.geo[1600]||{}).roster||[]).filter(p=>!p.unread).map(p=>({nm:p.nm,gap:100-p.CQ-p.DQ}));

/* ---------- the six gates ----------
   'hex'    three diameters. Each pair stands on one line through the core,
            higher above the waist and lower below, every gate directly
            opposite the one it stands against, pressed to the core's edge.
   'beams'  three balances under the core. One row per opposition, the lower
            gate on the left and the higher on the right, so a reading that
            improves moves right on every row.
   'collar' six arcs on the core's own rim, the hex's bearings, and each
            opposite pair a see-saw: the two fills across a diameter always
            make one sector between them. */
const ANG={intent:-150,aware:-90,detach:-30,averse:30,ignore:90,attach:150};
const col=g=>g.side==='higher'?C.HI:C.LO;
const ink=(c,t)=>C.rgb(C.mix(c,C.INK,t==null?.25:t));
C.gates=function(M,v,o){o=o||{};const g=M.gates;C.clear(g);if(v==='none')return;
 const cx=M.cx,cy=M.cy,edge=M.disc*(o.grow||1);
 if(v==='hex'){
  const gR=M.small?7.5:10,rg=edge+gR+(M.small?3:5),fs=11;
  /* the three axes, a hairline each, drawn first and under the discs so the
     opposition is a line and not only a position */
  C.PAIRS.forEach(p=>{const a=ANG[p[0]]*Math.PI/180,b=ANG[p[1]]*Math.PI/180;
   [a,b].forEach(t=>C.el('line',{x1:cx+Math.cos(t)*edge,y1:cy+Math.sin(t)*edge,x2:cx+Math.cos(t)*(rg-gR),y2:cy+Math.sin(t)*(rg-gR),
    stroke:'rgba(255,255,255,.14)','stroke-width':1},g));});
  C.GATES.forEach(G=>{const t=ANG[G.k]*Math.PI/180,x=cx+Math.cos(t)*rg,y=cy+Math.sin(t)*rg,c=col(G);
   C.el('circle',{cx:x,cy:y,r:gR,fill:C.rgb(C.GROUND)},g);
   C.el('circle',{cx:x,cy:y,r:gR,fill:'none',stroke:C.rgba(c,.22),'stroke-width':2},g);
   C.el('path',{d:C.arcD(x,y,gR,-Math.PI/2,-Math.PI/2+TAU*G.pct/100),fill:'none',stroke:C.rgba(c,.95),'stroke-width':2,'stroke-linecap':'round'},g);
   C.glyph(g,C.GLYPH[G.k],x,y,gR*1.15,C.rgba(C.INK,.92),1.5);
   const lr=rg+gR+5,lx=cx+Math.cos(t)*lr,ly=cy+Math.sin(t)*lr,ct=Math.cos(t);
   const anchor=ct<-.2?'end':ct>.2?'start':'middle';
   const dy=Math.abs(ct)<=.2?(Math.sin(t)<0?-2:fs*.73+2):fs*.36;
   C.text(g,G.pct+'%',lx,ly+dy,C.halo({'text-anchor':anchor,'font-size':fs,'font-weight':600,fill:ink(c)}));});
  return;}
 if(v==='beams'){
  const rows=C.PAIRS.length,rh=M.small?18:20,bw=M.small?64:88,gz=M.small?12:13,fs=11;
  const Wt=gz+4+22+6+bw+6+22+4+gz, x0=cx-Wt/2, y0=cy+edge+(o.gap||8);
  C.el('rect',{x:x0-8,y:y0-4,width:Wt+16,height:rows*rh+6,rx:9,fill:C.rgb(C.GROUND),'fill-opacity':.94,stroke:'rgba(255,255,255,.07)'},g);
  C.PAIRS.forEach((p,i)=>{const hi=C.G[p[0]],lo=C.G[p[1]],y=y0+i*rh+rh/2;
   let x=x0;
   C.glyph(g,C.GLYPH[lo.k],x+gz/2,y,gz,C.rgb(C.mix(C.LO,C.INK,.2)),1.5);x+=gz+4;
   C.text(g,lo.pct+'%',x+22,y+4,{'text-anchor':'end','font-size':fs,'font-weight':600,fill:ink(C.LO)});x+=22+6;
   const share=hi.pct/(hi.pct+lo.pct),split=x+bw*(1-share);
   C.el('line',{x1:x,y1:y,x2:split-1,y2:y,stroke:C.rgba(C.LO,.75),'stroke-width':4,'stroke-linecap':'round'},g);
   C.el('line',{x1:split+1,y1:y,x2:x+bw,y2:y,stroke:C.rgba(C.HI,.85),'stroke-width':4,'stroke-linecap':'round'},g);
   C.el('line',{x1:x+bw/2,y1:y-6,x2:x+bw/2,y2:y+6,stroke:'rgba(255,255,255,.28)','stroke-width':1},g);
   x+=bw+6;
   C.text(g,hi.pct+'%',x,y+4,{'text-anchor':'start','font-size':fs,'font-weight':600,fill:ink(C.HI)});x+=22+4;
   C.glyph(g,C.GLYPH[hi.k],x+gz/2,y,gz,C.rgb(C.mix(C.HI,C.INK,.2)),1.5);});
  return;}
 if(v==='collar'){
  const rc=edge+(M.small?3:4),wc=M.small?3:4,span=46*Math.PI/180,gz=M.small?11:13,fs=11;
  C.PAIRS.forEach(p=>{const hi=C.G[p[0]],lo=C.G[p[1]],sh=hi.pct/(hi.pct+lo.pct);
   [[hi,sh],[lo,1-sh]].forEach(q=>{const G=q[0],f=q[1],t=ANG[G.k]*Math.PI/180,c=col(G);
    const a0=t-span/2,a1=t+span/2;
    C.el('path',{d:C.arcD(cx,cy,rc,a0,a1),fill:'none',stroke:C.rgba(c,.18),'stroke-width':wc,'stroke-linecap':'butt'},g);
    /* each fill grows from the middle of its sector, so the two ends of one
       diameter read as a balance and not as two clocks */
    C.el('path',{d:C.arcD(cx,cy,rc,t-span/2*f,t+span/2*f),fill:'none',stroke:C.rgba(c,.92),'stroke-width':wc,'stroke-linecap':'butt'},g);
    const gr=rc+wc/2+gz/2+4,gx=cx+Math.cos(t)*gr,gy=cy+Math.sin(t)*gr;
    C.glyph(g,C.GLYPH[G.k],gx,gy,gz,C.rgb(C.mix(c,C.INK,.25)),1.5);
    const lr=gr+gz/2+4,lx=cx+Math.cos(t)*lr,ly=cy+Math.sin(t)*lr,ct=Math.cos(t);
    const anchor=ct<-.2?'end':ct>.2?'start':'middle';
    const dy=Math.abs(ct)<=.2?(Math.sin(t)<0?-2:fs*.73+2):fs*.36;
    C.text(g,G.pct+'%',lx,ly+dy,C.halo({'text-anchor':anchor,'font-size':fs,'font-weight':600,fill:ink(c)}));});});
  return;}};

/* ---------- the readout, for a picture whose centre has been emptied ----------
   The same three levels the centre uses, set flat: coherence and shadow side
   by side, then the three oppositions as balances with their names, since
   off the drawing there is room for the word and a stranger needs it. */
C.readout=function(host,o){o=o||{};
 const wrap=document.createElement('div');wrap.className='ro';
 let h='';
 if(o.pair!==false){
  const ring=(f,c,sw)=>'<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="11" fill="none" stroke="rgba(128,128,128,.22)" stroke-width="'+sw+'"/>'
   +'<path d="'+C.arcD(15,15,11,-Math.PI/2,-Math.PI/2+TAU*f)+'" fill="none" stroke="'+C.rgb(c)+'" stroke-width="'+sw+'" stroke-linecap="round"/></svg>';
  h+='<div class="ro-pair">'
   +'<div class="ro-q">'+ring(C.R.CQ/100,C.TIER,3.2)+'<span class="ro-n" style="color:var(--tier)">'+Math.round(C.R.CQ)+'</span><span class="ro-l">coherence<b style="color:var(--tier)">'+C.R.tier+'</b></span></div>'
   +'<div class="ro-q">'+ring(C.R.DQ/100,C.DQ,2.4)+'<span class="ro-n ro-n2" style="color:var(--dq)">'+Math.round(C.R.DQ)+'</span><span class="ro-l">shadow<b>of 100</b></span></div>'
   +'</div>';}
 if(o.gates!==false){
  h+='<div class="ro-gates" role="list">';
  C.PAIRS.forEach(p=>{const hi=C.G[p[0]],lo=C.G[p[1]],sh=hi.pct/(hi.pct+lo.pct);
   const gl=(k,c)=>'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="'+C.GLYPH[k]+'" fill="none" stroke="'+c+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
   h+='<div class="ro-g" role="listitem">'
    +'<span class="ro-side lo">'+gl(lo.k,C.rgb(C.mix(C.LO,C.INK,.2)))+'<span class="nm">'+lo.nm+'</span><span class="pc">'+lo.pct+'%</span></span>'
    +'<span class="ro-bar"><i class="lo" style="width:'+((1-sh)*100).toFixed(1)+'%"></i><i class="hi" style="width:'+(sh*100).toFixed(1)+'%"></i><em></em></span>'
    +'<span class="ro-side hi"><span class="pc">'+hi.pct+'%</span><span class="nm">'+hi.nm+'</span>'+gl(hi.k,C.rgb(C.mix(C.HI,C.INK,.2)))+'</span>'
    +'</div>';});
  h+='</div>';}
 wrap.innerHTML=h;host.appendChild(wrap);return wrap;};

/* a piece of a captured screen, placed as a block. The comps use the product's
   own chrome as a picture, so only the part under discussion is drawn live */
C.crop=function(src,x,y,w,h,scale){scale=scale||1;const d=document.createElement('div');
 d.style.cssText='width:'+w*scale+'px;height:'+h*scale+'px;background:url('+src+') no-repeat;background-position:'+(-x*scale)+'px '+(-y*scale)+'px;'
  +'background-size:'+(scale===1?'auto':'')+';flex:0 0 auto';
 return d;};
})();
