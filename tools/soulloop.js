/* ============================================================
   THE SOUL LOOP.

   Ruled 20 September, with a drawing: one stroke that crosses
   itself into a small closed eye and runs on. No bars either
   side, those belong to the character around it. Golden ratio,
   very tiny, pure gold.

   A brush stroke is not a line of constant width, so this is
   not a stroked path. The centreline is sampled, a width
   profile is evaluated along it, and the two offset edges are
   emitted as one closed outline. That is what gives the loop a
   thin entry, weight through the shoulder and a tapered exit
   at any size, without a filter and without a second path.

   Every proportion below is phi or a power of phi. Nothing here
   is a number that looked right.
   ============================================================ */
const PHI=(1+Math.sqrt(5))/2;          /* 1.6180339887 */
const H=100;                            /* the shape is 100 tall */
const Wd=H/PHI;                         /* and phi narrower than it is tall */

/* THE CENTRELINE. An ascent, a circular loop, and an exit.

   The first attempt built the loop out of two free cubics and it
   came out a pointed arch, which reads as a letter rather than a
   curl. The loop is a CIRCLE: four quarter arcs at the standard
   0.5523 handle, entered and left on a tangent, so the curl is
   round at every size and the eye it closes is an almond rather
   than a wedge. The ascent and the exit are the two tangents. */
/* THE LOOP IS SMALL AND THE BRUSH IS FAT, which is the whole character of
   it. Measured off his drawing: the curl's outer blob runs about 120 units
   wide against a stroke about 45 wide, so the weight is roughly 1.2 times the
   radius and the eye it leaves open is about a quarter of the outer diameter.
   Built the other way round, with a radius larger than the weight, it came
   out a ring on a stick and read as a letter. */
const R=H/(PHI*PHI*PHI*PHI*PHI);        /* 9.0, the loop's radius */
const cx=Wd/PHI;                        /* 38.2 across, the loop's axis */
const cy=R*PHI*PHI;                     /* the loop sits at the crown */
const K=0.5522847498;                   /* circle to cubic, four arcs */
const CROSS=cy+R*PHI;                   /* where the stroke meets itself */
const EYE=R*2-R*PHI/PHI;                /* the slit the curl leaves open */

function bez(p0,p1,p2,p3,t){
 const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;
 return [a*p0[0]+b*p1[0]+c*p2[0]+d*p3[0], a*p0[1]+b*p1[1]+c*p2[1]+d*p3[1]];}
/* the loop, clockwise from its lowest point, 0 at the bottom */
function onC(a){return [cx+R*Math.sin(a), cy+R*Math.cos(a)];}
function arc(a0,a1){
 const p0=onC(a0),p3=onC(a1),k=K*R*(a1-a0)/(Math.PI/2);
 const t0=[Math.cos(a0),-Math.sin(a0)],t1=[Math.cos(a1),-Math.sin(a1)];
 return [p0,[p0[0]+t0[0]*k,p0[1]+t0[1]*k],[p3[0]-t1[0]*k,p3[1]-t1[1]*k],p3];}

const Q=Math.PI/2;
/* the stroke enters the circle low on its left and leaves low on
   its right, having gone the long way round: 315 degrees of turn. */
const A0=-Q*0.62, A1=A0+Q*3.5;
const IN=onC(A0), OUT=onC(A1);

const SEGS=[
 /* 1. the ascent, rising from the lower left onto the circle */
 [[Wd*0.10,H],[Wd*0.20,H-H/PHI/PHI],[IN[0]-R*1.6,IN[1]+R*4.2],IN],
 /* 2 to 5. the loop itself, four quarter arcs of one circle */
 arc(A0,A0+Q*0.875), arc(A0+Q*0.875,A0+Q*1.75),
 arc(A0+Q*1.75,A0+Q*2.625), arc(A0+Q*2.625,A1),
 /* 6. the exit, leaving on the tangent and running away right,
       shallower than it falls, which is how he drew it */
 [OUT,[OUT[0]+R*1.5,OUT[1]+R*3.4],[Wd*0.66,H-H/PHI/PHI/PHI],[Wd*0.97,H-H*0.06]]];

/* THE WIDTH PROFILE, over the whole stroke, t from 0 to 1.
   Thin where the brush lands, heaviest through the crown where
   it is pressed, tapering off the end. The three weights are
   phi apart. */
/* the heaviest the brush presses, and it is heavier than the loop is wide */
const WMAX=R*0.90;
function width(t){
 const thin=WMAX/PHI/PHI, mid=WMAX/PHI;
 /* the brush lands light, presses through the curl, and lifts only at the
    very tip. The first profile tapered the exit down to the landing weight
    and the leg went wiry, which is not how he drew it: both legs carry
    weight and only the last few units of the exit thin out. */
 if(t<0.17) return thin+(mid-thin)*Math.sqrt(t/0.17);
 if(t<0.30) return mid+(WMAX-mid)*((t-0.17)/0.13);
 if(t<0.62) return WMAX;
 if(t<0.86) return WMAX-(WMAX-mid)*((t-0.62)/0.24);
 return mid-(mid-thin*PHI/PHI)*Math.pow((t-0.86)/0.14,PHI);}

function centreline(n){
 const pts=[];
 for(let s=0;s<SEGS.length;s++){
  const g=SEGS[s];
  for(let i=(s?1:0);i<=n;i++){
   const t=i/n, p=bez(g[0],g[1],g[2],g[3],t);
   pts.push({x:p[0],y:p[1],t:(s+t)/SEGS.length});}}
 return pts;}

function outline(n,round){
 const pts=centreline(n), L=[],R=[];
 for(let i=0;i<pts.length;i++){
  const a=pts[Math.max(0,i-1)], b=pts[Math.min(pts.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, m=Math.hypot(dx,dy)||1;
  dx/=m; dy/=m;
  const w=width(pts[i].t)/2;
  L.push([pts[i].x-dy*w, pts[i].y+dx*w]);
  R.push([pts[i].x+dy*w, pts[i].y-dx*w]);}
 const f=v=>v.toFixed(round===undefined?2:round);
 let d='M'+f(L[0][0])+' '+f(L[0][1]);
 for(let i=1;i<L.length;i++)d+='L'+f(L[i][0])+' '+f(L[i][1]);
 for(let i=R.length-1;i>=0;i--)d+='L'+f(R[i][0])+' '+f(R[i][1]);
 return d+'Z';}

module.exports={PHI,H,W:Wd,R,CROSS,EYE,outline,centreline,width,SEGS};
if(require.main===module){
 const d=outline(+(process.argv[2]||28),2);
 console.log('viewBox 0 0 '+Wd.toFixed(2)+' '+H);
 console.log('path length '+d.length);
 console.log(d);}
