/* ---------- the seat spectrum ----------
   The seven seats run root, sacral, solar, heart, throat, third eye, crown, which is red, orange, yellow,
   green, cyan, blue, violet: a spectrum already, in the palette the product ships. Full spectrum light
   here is those seven colours and the blends between them and nothing else. s runs 0 (root) to 6 (crown). */
const SEATN=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
const SEATC=SEATN.map(n=>hx(PAL[n]));
function specAt(s){s=clamp(s,0,5.9999);const i=s|0;return mixc(SEATC[i],SEATC[i+1],s-i);}
/* where on the rest figure a seat sits. the legs carry Root, so the spectrum starts at the feet and
   has climbed to the sacral seat by the pelvis, and the upper body carries the other six where the body map seats them */
const SEATYS=[.96,-.12,-.3,-.5,-.72,-.9,-1.04];
function seatF(y){if(y>=SEATYS[0])return 0;for(let i=0;i<6;i++){if(y>=SEATYS[i+1]){return i+(SEATYS[i]-y)/(SEATYS[i]-SEATYS[i+1]);}}return 6;}
const EMBER=[150,158,174];   /* the colour of an unlit point: a cool grey, the same the pattern colours fade to at no charge */
/* how lit a thing at seat position k is, at coherence c. coherence fills the seats from root up: a seat is
   lit when the coherence has reached it. the front of the light is a gradient, not an edge. */
function litAt(k,c){const X=c*8.6-1.0;return Math.pow(sstep(-.7,.9,X-k),1.4);}
/* the words for a coherence, in the order the owner gave them: compressed is no light, full is full spectrum */
function cohWord(c){return c<.2?'Compressed. No light.':c<.8?'Partial. Some of the spectrum is lit.':'Coherent. Full spectrum.';}
const cohShort=c=>c<.2?'compressed':c<.8?'partial':'full spectrum';
/* a batch of points drawn in as few state changes as possible. A point is a place, a colour bin (hue) and a
   level (how bright). Points are counted into bins and drawn bin by bin, so a frame costs one fill style per
   bin and not one per point. COLS[h][l] is the css colour, ALPHA[l] the alpha, SIZE[l] the size multiplier. */
class Batch{
 constructor(nmax,nh,nl){this.n=0;this.nh=nh;this.nl=nl;this.x=new Float32Array(nmax);this.y=new Float32Array(nmax);this.b=new Uint16Array(nmax);this.s=new Float32Array(nmax);
  this.cnt=new Int32Array(nh*nl+1);this.ord=new Int32Array(nmax);}
 reset(){this.n=0;}
 add(x,y,h,l,sz){const i=this.n++;this.x[i]=x;this.y[i]=y;this.b[i]=h*this.nl+l;this.s[i]=sz;}
 flush(g,d,COLS,ALPHA,SIZE,base){const n=this.n,nb=this.nh*this.nl,cnt=this.cnt;cnt.fill(0);
  for(let i=0;i<n;i++)cnt[this.b[i]+1]++;
  for(let i=0;i<nb;i++)cnt[i+1]+=cnt[i];
  const pos=this.pos||(this.pos=new Int32Array(nb+1));for(let i=0;i<=nb;i++)pos[i]=cnt[i];
  const ord=this.ord;for(let i=0;i<n;i++)ord[pos[this.b[i]]++]=i;
  for(let b=0;b<nb;b++){const a=cnt[b],e=cnt[b+1];if(a===e)continue;const h=(b/this.nl)|0,l=b%this.nl;
   const al=ALPHA[l];if(al<.01)continue;g.globalAlpha=al>1?1:al;g.fillStyle=COLS[h][l];
   const sz=base*SIZE[l];
   for(let j=a;j<e;j++){const i=ord[j],s=sz*this.s[i];g.fillRect((this.x[i]-s/2)*d,(this.y[i]-s/2)*d,s*d,s*d);}}
  g.globalAlpha=1;}}
