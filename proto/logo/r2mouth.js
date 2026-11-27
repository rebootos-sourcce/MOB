/* THE E'S MOUTH, EXACTLY. The raster probe could not isolate it: the
   ring and the bar are adjacent where they join at both ends, so a
   nearest distance over the whole letter reports the join and not the
   opening. The mouth is the clear passage between two specific pieces
   of ink, the bar's right cap and the ring's terminal cap, and both are
   known segments, so it is computed rather than probed. */
const path=require('path'), R=require(path.join(__dirname,'r2geom.js'));
const {RCX,RCY,RR,H,W}=R;
function seg(a,b,c,d){ /* min distance between segments ab and cd */
  const d1=[b[0]-a[0],b[1]-a[1]], d2=[d[0]-c[0],d[1]-c[1]];
  const pd=(p,q,r)=>{const vx=r[0]-q[0],vy=r[1]-q[1],L=vx*vx+vy*vy;
    let t=L?((p[0]-q[0])*vx+(p[1]-q[1])*vy)/L:0; t=Math.max(0,Math.min(1,t));
    return Math.hypot(p[0]-(q[0]+t*vx), p[1]-(q[1]+t*vy));};
  return Math.min(pd(a,c,d),pd(b,c,d),pd(c,a,b),pd(d,a,b));
}
function mouth(barY, termDeg){
  const dy=barY-RCY, barEnd=RCX+Math.sqrt(RCX*RCX-dy*dy);
  const th=termDeg*Math.PI/180, tx=RCX+RR*Math.cos(th), ty=RCY+RR*Math.sin(th);
  const tan=[-Math.sin(th),Math.cos(th)];
  const A=[tx+H*tan[0],ty+H*tan[1]], B=[tx-H*tan[0],ty-H*tan[1]];
  const C=[barEnd,barY-H], D=[barEnd,barY+H];
  return { mouth:+seg(A,B,C,D).toFixed(2), barEnd:+barEnd.toFixed(2),
           term:[+tx.toFixed(2),+ty.toFixed(2)],
           upperCounter:+((barY-H)-(RCY-(RR-H))).toFixed(2) };
}
const M={ e1:mouth(RCY+3,42), e2:mouth(RCY+3,66), e3:mouth(RCY,20), e3b:mouth(RCY,42) };
if (require.main===module) console.log(JSON.stringify(M,null,1));
module.exports=M;
