/* THE AIR. A low resolution colour field, computed from the cloud, that every glow and every torus point reads its colour from.
   "Make the glow pixels the color of the air, of their sampled area."
   How it is made, once per frame (every second frame on a live page):
     1. a grid of 48 by 51 cells covers the figure and the torus, 3.2 by 3.4 figure units, cells of about 0.067.
     2. a quarter of the body points are splatted into the cell they sit in, each carrying its own colour (the pattern hue, or the
        seat hue where a seat band is lit) weighted by how bright that point is this frame. Dark points weigh nothing.
     3. the grid is blurred, a box of radius three, twice each way, so the colour of a region leaks into the air round it by about
        a fifth of a figure unit.
     4. the ambient is laid under it: at each height, the seat spectrum for that height (red at the feet, violet at the crown) mixed
        toward the cool grey ember by how lit that height is at this coherence. The ambient has a fixed weight, so near the body the
        cloud wins and far from it the spectrum does.
     5. each cell's colour is normalised to a bright version of itself and snapped to one of 343 colours, so a frame can batch by colour.
   A torus point, an address, a leak spark or a glow asks the grid for the cell it sits in. Nothing about their colour is fixed. */
const QB=7;
const NBIN=QB*QB*QB;
const binOf=(r,g,b)=>{let a=(r*QB/256)|0,c=(g*QB/256)|0,d=(b*QB/256)|0;if(a>=QB)a=QB-1;if(c>=QB)c=QB-1;if(d>=QB)d=QB-1;return a*QB*QB+c*QB+d;};
const BINRGB=(()=>{const a=[];for(let i=0;i<NBIN;i++){const r=(i/(QB*QB))|0,g=((i/QB)|0)%QB,b=i%QB;a.push([(r+.5)*256/QB,(g+.5)*256/QB,(b+.5)*256/QB]);}return a;})();
function boxH(s,d,W,H,r){const n=2*r+1;for(let y=0;y<H;y++){const b=y*W*4;for(let c=0;c<4;c++){let sum=0;for(let x=0;x<=r&&x<W;x++)sum+=s[b+x*4+c];
 for(let x=0;x<W;x++){d[b+x*4+c]=sum/n;const xa=x+r+1,xr=x-r;if(xa<W)sum+=s[b+xa*4+c];if(xr>=0)sum-=s[b+xr*4+c];}}}}
function boxV(s,d,W,H,r){const n=2*r+1,st=W*4;for(let x=0;x<W;x++){for(let c=0;c<4;c++){const b=x*4+c;let sum=0;for(let y=0;y<=r&&y<H;y++)sum+=s[b+y*st];
 for(let y=0;y<H;y++){d[b+y*st]=sum/n;const ya=y+r+1,yr=y-r;if(ya<H)sum+=s[b+ya*st];if(yr>=0)sum-=s[b+yr*st];}}}}
class Air{
 constructor(){this.GW=48;this.GH=51;this.X0=-1.6;this.Y0=-1.7;this.inv=48/3.2;const n=this.GW*this.GH;
  this.acc=new Float32Array(n*4);this.tmp=new Float32Array(n*4);this.bin=new Uint16Array(n);this.rgb=new Float32Array(n*3);this.lum=new Float32Array(n);this.amb=new Float32Array(this.GH*3);this.n=0;}
 clear(){this.acc.fill(0);this.n=0;}
 splat(x,y,r,g,b,w){const ix=((x-this.X0)*this.inv)|0,iy=((y-this.Y0)*this.inv)|0;if(ix<0||iy<0||ix>=this.GW||iy>=this.GH)return;
  const o=(iy*this.GW+ix)*4,a=this.acc;a[o]+=r*w;a[o+1]+=g*w;a[o+2]+=b*w;a[o+3]+=w;this.n++;}
 /* the ambient, one colour per row of the grid: the spectrum for that height, drawn toward ember where that height is not yet lit */
 ambient(c){const A=this.amb;for(let y=0;y<this.GH;y++){const yf=this.Y0+(y+.5)/this.inv,sf=seatF(yf),lit=litAt(sf,c);
   const col=mixc(EMBER,specAt(sf),.2+.8*lit);A[y*3]=col[0];A[y*3+1]=col[1];A[y*3+2]=col[2];}}
 finish(wa){const W=this.GW,H=this.GH,a=this.acc,t=this.tmp;
  boxH(a,t,W,H,3);boxV(t,a,W,H,3);boxH(a,t,W,H,3);boxV(t,a,W,H,3);
  for(let y=0;y<H;y++){const ar=this.amb[y*3],ag=this.amb[y*3+1],ab=this.amb[y*3+2];
   for(let x=0;x<W;x++){const i=y*W+x,o=i*4;const w=a[o+3];let r=a[o]+wa*ar,g=a[o+1]+wa*ag,b=a[o+2]+wa*ab;const s=w+wa;r/=s;g/=s;b/=s;
    const m=Math.max(r,g,b)||1,k=236/m;r*=k;g*=k;b*=k;this.rgb[i*3]=r;this.rgb[i*3+1]=g;this.rgb[i*3+2]=b;this.lum[i]=w/s;this.bin[i]=binOf(r,g,b);}}}
 /* the cell a figure-unit point sits in, clamped to the grid */
 cell(x,y){let ix=((x-this.X0)*this.inv)|0,iy=((y-this.Y0)*this.inv)|0;if(ix<0)ix=0;else if(ix>=this.GW)ix=this.GW-1;if(iy<0)iy=0;else if(iy>=this.GH)iy=this.GH-1;return iy*this.GW+ix;}
 binAt(x,y){return this.bin[this.cell(x,y)];}
 lumAt(x,y){return this.lum[this.cell(x,y)];}
 rgbAt(x,y){const i=this.cell(x,y)*3;return[this.rgb[i],this.rgb[i+1],this.rgb[i+2]];}}
/* colour tables for batched drawing. five levels of brightness: the colour is the sampled one, the level sets alpha and a little white. */
const AQ=[.16,.3,.46,.66,.86],WQ=[0,0,.05,.14,.26],SQ5=[.82,.95,1.08,1.25,1.45],LWQ=[.9,1,1.15,1.3,1.5];
const COLQ=BINRGB.map(c=>AQ.map((a,l)=>css(mixc(c,INK,WQ[l]),1)));
/* a run of line segments, drawn bin by bin and level by level so a frame is a couple of hundred strokes and not three thousand */
class LineBatch{
 constructor(nmax,nb,nl){this.n=0;this.nb=nb;this.nl=nl;this.x0=new Float32Array(nmax);this.y0=new Float32Array(nmax);this.x1=new Float32Array(nmax);this.y1=new Float32Array(nmax);
  this.b=new Uint16Array(nmax);this.cnt=new Int32Array(nb*nl+1);this.ord=new Int32Array(nmax);this.pos=new Int32Array(nb*nl+1);this.max=nmax;}
 reset(){this.n=0;}
 add(x0,y0,x1,y1,bin,l){if(this.n>=this.max)return;const i=this.n++;this.x0[i]=x0;this.y0[i]=y0;this.x1[i]=x1;this.y1[i]=y1;this.b[i]=bin*this.nl+l;}
 flush(g,d,COLS,ALPHA,WID,wscale){const n=this.n,nb=this.nb*this.nl,cnt=this.cnt;cnt.fill(0);
  for(let i=0;i<n;i++)cnt[this.b[i]+1]++;for(let i=0;i<nb;i++)cnt[i+1]+=cnt[i];const pos=this.pos;for(let i=0;i<=nb;i++)pos[i]=cnt[i];
  const ord=this.ord;for(let i=0;i<n;i++)ord[pos[this.b[i]]++]=i;
  g.lineCap='round';
  for(let b=0;b<nb;b++){const a=cnt[b],e=cnt[b+1];if(a===e)continue;const h=(b/this.nl)|0,l=b%this.nl;
   g.globalAlpha=ALPHA[l];g.strokeStyle=COLS[h][l];g.lineWidth=WID[l]*wscale*d;g.beginPath();
   for(let j=a;j<e;j++){const i=ord[j];g.moveTo(this.x0[i]*d,this.y0[i]*d);g.lineTo(this.x1[i]*d,this.y1[i]*d);}g.stroke();}
  g.globalAlpha=1;}}
