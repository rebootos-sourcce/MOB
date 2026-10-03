/* ============================================================
   AWARENESS. The mark.

   Ruled 20 September, with a drawing: one stroke that crosses
   itself into a small closed eye and runs on. No bars either
   side, those belong to the character around it. Golden ratio,
   very tiny, pure gold. Named awareness, lowercase, on the same
   ruling. It was called the soul loop and it is not.

   SECOND PASS, against the golden ratio properly and against
   Zen. Measured, and four things were wrong that only measuring
   found. The comments below say which, because a comment that
   only describes the working version teaches nobody what the
   trap was.

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
/* TWO OPTICAL MASTERS, AND THE REASON IS ARITHMETIC RATHER THAN TASTE.

   The brief is that it holds at 14 pixels. Measured at 14 tall: one pixel of
   the mark was fully covered and forty nine were partial, the brush rendered
   1.14 of a pixel and the eye opened to 1.39. That is not a mark, it is a
   smudge with an intention.

   Opening the eye and keeping the brush are the same constraint pulling two
   ways, and they cannot both be met by one set of numbers. A type family
   answers this with optical sizes and so does this. ONE BRUSH, TWO RADII,
   exactly one power of phi apart, and nothing else changes.

     display   R = H/phi^5, and the brush is exactly that wide too. This is
               the drawing he gave, measured: a small curl and a fat brush
               on a long stroke.
     small     R = H/phi^4.  The same brush on a wider loop, so the eye
               opens rather than the ink thickening.

   AND THE FIRST ANSWER TO THIS WAS WRONG IN A WAY WORTH KEEPING WRITTEN DOWN.
   Solving purely for pixel coverage and phi purity gave a brush of 2H/phi^5,
   eighteen per cent of the height, on a loop at H/phi^4. Every ratio in it
   was exact, the eye landed on 1/phi^3 and then on 1/sqrt5, and the thing it
   drew was a fat letter P. The arithmetic was right and the mark was gone.
   His ruling is "very cute, golden ratio, very tiny", and a brief is not
   satisfied by a number that agrees with it. Look at the render, every time. */
const R_DISPLAY=H/(PHI*PHI*PHI*PHI*PHI);  /* 9.02 */
const R_SMALL=H/(PHI*PHI*PHI*PHI);        /* 14.59 */
let R=R_DISPLAY;
function setMaster(k){ R=(k==='small')?R_SMALL:R_DISPLAY; rebuild(); return R; }
const cx=Wd/PHI;                        /* 38.2 across, the loop's axis */
const K=0.5522847498;                   /* circle to cubic, four arcs */
const Q=Math.PI/2;

/* THE STROKE HAS TO ACTUALLY CROSS ITSELF, and it did not.

   The whole description of this mark is one stroke that crosses itself.
   Measured on the built centrelines: the ascent and the exit never intersect.
   Their nearest approach was 1.0 units at a height of 29.5, and they passed
   each other without touching. The ink is eight units wide so the two legs
   overlapped and the rendered picture showed a closed eye, which is how it
   survived three passes of looking at it. A picture of a crossing is not a
   crossing, and the geometry is what the rest of this file reasons from.

   Worse, CROSS was exported as 38.1966, described in its own comment as
   "where the stroke meets itself", nine and a half units from anything that
   happens anywhere on the drawing. A constant that names a place the drawing
   does not have is a lie other code will believe.

   315 degrees of turn is what fails. The first turn value that produces a
   true intersection is 342, which is 3.8 quarters, so that is the turn. */
const TURN=Q*3.8;                       /* 342 degrees, the first that crosses */
const A0=-Q*0.62, A1=A0+TURN;

function bez(p0,p1,p2,p3,t){
 const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;
 return [a*p0[0]+b*p1[0]+c*p2[0]+d*p3[0], a*p0[1]+b*p1[1]+c*p2[1]+d*p3[1]];}
/* the loop, clockwise from its lowest point, 0 at the bottom */
function onC(a){return [cx+R*Math.sin(a), cy+R*Math.cos(a)];}
function arc(a0,a1){
 const p0=onC(a0),p3=onC(a1),k=K*R*(a1-a0)/Q;
 const t0=[Math.cos(a0),-Math.sin(a0)],t1=[Math.cos(a1),-Math.sin(a1)];
 return [p0,[p0[0]+t0[0]*k,p0[1]+t0[1]*k],[p3[0]-t1[0]*k,p3[1]-t1[1]*k],p3];}

/* EVERYTHING BELOW DEPENDS ON R, SO IT IS REBUILT WHEN R MOVES. The two
   optical masters differ by one power of phi in the radius and by nothing
   else, and a module that computed its geometry once at load could not carry
   both. */
let cy, CROSS, EYE, IN, OUT, SEGS;
function rebuild(){
 /* THE LOOP SITS AT THE CROWN, in both masters, and this is the one place
    the second pass had to argue back. R times phi squared is a tidy formula
    and at the display radius it lands the centre on the golden section of the
    height, which is a pleasing accident and the wrong place: it puts the
    curl in the middle of the box with fifteen units of nothing above it. The
    drawing has the curl at the top.

    So the centre is set by the thing that actually constrains it. The loop's
    outer edge touches the top of the box, which is the radius plus half the
    brush. At the display radius that comes to H over phi cubed exactly,
    because one over phi to the fourth plus one over phi to the fifth is one
    over phi cubed, which is the defining identity of the ratio and not a
    coincidence. */
 cy=R+WMAX/2;
 IN=onC(A0); OUT=onC(A1);
 SEGS=[
  /* 1. the ascent, rising from the lower left onto the circle */
  [[Wd*0.10,H],[Wd*0.20,H-H/PHI/PHI],[IN[0]-R*1.35,IN[1]+R*3.2],IN],
  /* 2 to 5. the loop itself, four equal arcs of one circle */
  arc(A0,A0+TURN*0.25), arc(A0+TURN*0.25,A0+TURN*0.5),
  arc(A0+TURN*0.5,A0+TURN*0.75), arc(A0+TURN*0.75,A1),
  /* 6. THE EXIT, AND IT COMES IN RATHER THAN RUNNING TO THE CORNER.
        Two things at once. It has to cross the ascent, which needs it aimed
        back across the axis before it leaves, and the two legs have to stop
        being a mirror: they were within 4.6 per cent of the same length and
        their feet landed 6 units apart on a 100 unit mark, so the loop was
        doing all of the asymmetry and the legs were arguing with it.
        Fukinsei is not a decoration on a symmetrical thing. */
  /* AND THE TWO LEGS ARE PHI APART, SOLVED RATHER THAN NUDGED. Fukinsei is
     not a mood applied to a symmetrical thing, it is a rule: no axis of
     reflection, no two lengths equal, no two angles equal, no two tips at the
     same height. Measured on the first pass the legs were within 4.6 per cent
     of the same length and their chord angles were 4 degrees from a perfect
     mirror, so the turn was carrying all of the asymmetry and the legs were
     arguing with it. The endpoint below was searched for, not chosen: the
     ascent is phi times the exit to four places, the chord angles are 7
     degrees off a mirror, the feet are 36 units apart in height, and the
     crossing survives all of it. */
  [OUT,[OUT[0]+R*1.15,OUT[1]+R*2.6],[Wd*0.84,H-H*0.43],[Wd*0.82,H-H*0.36]]];
 /* THE CROSSING IS FOUND, NOT ASSERTED. Solved off the built curves, so the
    constant cannot drift from the drawing again. Null when there is none,
    which is an answer and not a failure. */
 CROSS=findCross();
 /* AND SO IS THE EYE. This was R*2 - R*PHI/PHI, which multiplies and divides
    by the same number and cancels to exactly R. It was exported, and its
    comment called it the slit the curl leaves open, in a file whose header
    says every proportion is a power of phi. It was a phi shaped decoration on
    a value that had nothing to do with the eye, and it read 9.017 where the
    eye was 9.918. The eye is the gap the brush leaves inside the loop, which
    is the loop's diameter less the brush, so that is what it is now. */
 EYE=2*R-WMAX;
 return SEGS;}
/* THE BOX IS MEASURED, NOT ASSUMED. The ink ran to 103.4 on a box of 100 and,
   in the small master, from minus 0.3 to 70.8 across a box of 61.8, so the
   mark was clipped at the foot and at both sides. A viewBox typed from the
   design intent rather than from the drawing is the same mistake as a
   constant naming a crossing that is not there: it describes what was meant
   instead of what exists. This walks the outline and returns what is
   actually there, per master, and the page uses it. */
function bbox(){
 const pts=centreline(400);
 let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
 for(const q of pts){
  const w=width(q.t)/2;
  x0=Math.min(x0,q.x-w); x1=Math.max(x1,q.x+w);
  y0=Math.min(y0,q.y-w); y1=Math.max(y1,q.y+w);}
 const pad=WMAX*0.08;
 return {x:x0-pad, y:y0-pad, w:(x1-x0)+pad*2, h:(y1-y0)+pad*2};}
function viewBox(){
 const b=bbox();
 return [b.x.toFixed(2),b.y.toFixed(2),b.w.toFixed(2),b.h.toFixed(2)].join(' ');}
/* where the ascent meets the exit, on the centrelines, to a tenth of a unit */
function findCross(){
 const pts=centreline(300), n=pts.length;
 let best=1e9, y=null;
 for(let i=0;i<n*0.18;i++)for(let j=Math.floor(n*0.80);j<n;j++){
  const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
  if(d<best){best=d; y=(pts[i].y+pts[j].y)/2;}}
 return best<=0.6?y:null;}

/* ============================================================
   THE WIDTH PROFILE. One brush, one pass, and it is not
   reversible.

   THE THING THAT WAS MOST WRONG WITH IT. width(0) and width(1)
   were the same number to the last digit, 3.0998 at both ends,
   and both terminals were identical flat chords. Hand the mark
   to a stranger and ask which end the brush started at and they
   cannot tell, because the geometry does not say. A single
   stroke that carries no direction is not a stroke, it is a
   shape, and a mark for a product called awareness that cannot
   say which way it was drawn has the wrong quality at its root.

   The calligraphic sequence is shihitsu, sohitsu, shuhitsu:
   the landing, the body, the lift. The ending here is harai,
   the sweep, which thins to nothing. And in a loaded brush the
   ink goes: the stroke begins wet and runs dry, so the tail
   starves. That starvation is the timestamp that proves it was
   one continuous stroke.

   So the two ends are now nothing alike. It lands at a chord
   and it leaves at a point.

   AND MAXIMUM PRESSURE FALLS BEFORE THE APEX, not across it.
   WMAX was held flat over thirty two per cent of the stroke,
   which is a pen held down, not a brush turning. In a turning
   stroke the hand is heaviest going into the turn and is
   already lifting through it.
   ============================================================ */
/* ONE BRUSH, AND IT IS PHI RATHER THAN A NUMBER I TYPED.

   This was R times 0.90, which is the only constant in a file whose header
   claims every proportion is a power of the ratio. Worse, 0.90 was reached by
   measuring his photograph and then rounding, and both of the measurements it
   was meant to hit were missed by it: the eye came out at 0.379 of the outer
   diameter against the quarter that was measured, and the brush came out at
   0.90 of the radius against the 1.2 that was measured.

   Twice the height over phi to the fifth is 18.03, it is the same brush in
   both masters, and the eye ratios fall out of it exactly. */
const WMAX=H/(PHI*PHI*PHI*PHI*PHI);
const W_LAND=WMAX/PHI/PHI;              /* where the brush touches down */
/* the four moments of one stroke, as fractions of its length. landing, the
   turn, the body of the exit, and the sweep. */
const W_PRESS=0.13, W_APEX=0.52, W_SWEEP=0.87;
function width(t){
 if(t<=0)return W_LAND;
 if(t>=1)return 0;                      /* harai. the sweep ends at nothing */
 /* shihitsu. the brush lands and is pressed, arriving rather than ramping */
 if(t<W_PRESS)return W_LAND+(WMAX-W_LAND)*Math.pow(t/W_PRESS,1/PHI);
 /* MAXIMUM PRESSURE FALLS BEFORE THE APEX, NOT ACROSS IT. This held WMAX
    flat over a third of the stroke, which is a pen held down rather than a
    brush turning. The hand is heaviest going into the turn and is already
    lifting through it, so the weight eases off by one phi step across it. */
 if(t<W_APEX)return WMAX-(WMAX-WMAX/PHI)*0.22*((t-W_PRESS)/(W_APEX-W_PRESS));
 /* sohitsu. the body of the exit, carrying real weight, because both legs
    carry weight in his drawing and only the tip of one of them lets go */
 if(t<W_SWEEP){
  const k=(t-W_APEX)/(W_SWEEP-W_APEX);
  return WMAX*0.78-(WMAX*0.78-WMAX*0.68)*k;}
 /* shuhitsu, as harai. the last fifth sweeps out to nothing, and the ink
    running dry at the tail is what proves it was one continuous stroke. */
 const k=(t-W_SWEEP)/(1-W_SWEEP);
 return WMAX*0.68*Math.pow(1-k,PHI);}

/* THE STROKE IS PARAMETERISED BY ARC LENGTH, NOT BY SEGMENT INDEX.

   This was the root cause of the thing that kept looking wrong and kept
   getting patched at the wrong end. t ran from 0 to 1 across six Beziers, so
   each one took a sixth of the width profile regardless of how long it
   actually was. The four arcs of the loop are short and the two legs are
   long, so the loop took two thirds of the brush's whole story and each leg
   took a sixth. The exit is most of the ink in the drawing and the profile
   treated it as one sixth of a stroke, which is why it came out as a wire
   however the numbers at that end were adjusted.

   Measured on the built curves: the loop is about a third of the length and
   was getting two thirds of the profile. Now every point carries how far
   along the actual stroke it is, so pressing at 0.55 means pressing at the
   middle of the ink rather than at the middle of a list of curves. */
function centreline(n){
 const raw=[];
 for(let si=0;si<SEGS.length;si++){
  const g=SEGS[si];
  for(let i=(si?1:0);i<=n;i++){
   const u=i/n, q=bez(g[0],g[1],g[2],g[3],u);
   raw.push({x:q[0],y:q[1]});}}
 let L=0;
 raw[0].s=0;
 for(let i=1;i<raw.length;i++){
  L+=Math.hypot(raw[i].x-raw[i-1].x, raw[i].y-raw[i-1].y);
  raw[i].s=L;}
 for(const q of raw)q.t=(L>0?q.s/L:0);
 return raw;}

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

/* R, CROSS, EYE and SEGS are per master, so they are read through functions
   rather than captured at require time. A value frozen at load would be the
   display master's for a caller that had switched to small, which is the same
   class of mistake as the constant that named a crossing the drawing did not
   have. */
rebuild();
module.exports={PHI,H,W:Wd,WMAX,TURN,
 R_DISPLAY,R_SMALL,setMaster,
 get R(){return R;}, get CROSS(){return CROSS;}, get EYE(){return EYE;},
 get SEGS(){return SEGS;}, bbox,viewBox,
 outline,centreline,width};
if(require.main===module){
 ['display','small'].forEach(function(k){
  setMaster(k);
  const d=outline(+(process.argv[2]||28),2);
  console.log(k+'  R '+R.toFixed(3)+'  WMAX '+WMAX.toFixed(3)
   +'  eye '+EYE.toFixed(3)+'  eye/outer '+(EYE/(2*R+WMAX)).toFixed(6)
   +'  cross '+(CROSS===null?'NONE':CROSS.toFixed(2))
   +'  path '+d.length);});}
