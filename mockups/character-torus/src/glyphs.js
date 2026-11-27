/* THE FIVE SIGNS. Round OR: "let's do the new symbol as the icon, so the colour, our design engine, is consistent".
   Each mask has one sign, drawn in the cloud's own language: a ring for a body, dots for the points that
   surround it. Dots are a stroke with a round cap and a dash of nothing, so they stay rings and strokes and
   nothing is filled. The three treatments dress the same sign in their own light: Prism leaves it plain, Corona
   sets a ring of the seven seat colours round it, Orbit sets one tilted orbit through it. 32 by 32. */
const DOT=' stroke-dasharray="0.1 3.3" stroke-width="2.4"';
const SIGN={
 /* small, under a huge dim mass, with threads drawn up to it */
 Child:'<path d="M3.5 12.5A12.5 12.5 0 0 1 28.5 12.5"'+DOT+'/><path d="M9 12.5A7 7 0 0 1 23 12.5"'+DOT+'/><path d="M16 17.4V13.4"'+DOT+'/>'
  +'<circle cx="16" cy="21.2" r="2.3"/><path d="M11.4 29.2c0-3.6 2-5.4 4.6-5.4s4.6 1.8 4.6 5.4"/>',
 /* a head, and the beam going out over the watchers */
 Preteen:'<circle cx="16" cy="25.4" r="2.4"/><path d="M8.6 21.2A8.4 8.4 0 0 1 23.4 21.2"'+DOT+'/><path d="M4 17.4A14 14 0 0 1 28 17.4"'+DOT+'/>'
  +'<circle cx="23.5" cy="8.4" r="1.9"/><circle cx="8" cy="9.6" r="1.2"/><circle cx="15.5" cy="5.4" r="1.2"/>',
 /* a small ring thrusting at a big dotted one, and the sparks where they meet */
 Teen:'<circle cx="6.4" cy="16.4" r="3"/><path d="M11.6 16.4H18M15.4 13.4 18.4 16.4 15.4 19.4"/><circle cx="22.8" cy="16" r="8.4"'+DOT+'/><path d="M17 9.4l-2.2-2.8M17.4 23.2l-2.2 2.8"/>',
 /* a ring cut across and joined, the halves a hair apart, and a file under it */
 Adult:'<path d="M8.4 12.4A8 8 0 0 1 24.4 12.4"/><path d="M7 14.4A8 8 0 0 0 23 14.4"/><path d="M2.6 13.4H29.4"'+DOT+'/><path d="M19.4 24.4h8M17 28.4h10.4"/><path d="M12.4 24.4h2.4"/>',
 /* a tall rigid body inside a fixed lattice */
 Ideological:'<rect x="12" y="4.6" width="8" height="22.8" rx="3.4"/><path d="M5.4 5V27M26.6 5V27M4.6 10.4H27.4M4.6 21.6H27.4"'+DOT+'/>'};
function arcPath(cx,cy,r,a0,a1){const p=a=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)].map(v=>v.toFixed(2));const A=p(a0),B=p(a1);
 return 'M'+A[0]+' '+A[1]+'A'+r+' '+r+' 0 '+((a1-a0)>180?1:0)+' 1 '+B[0]+' '+B[1];}
/* Corona's dressing: the seven seats as a ring of dots round the sign, crown at the top, going round */
const CORONA=SEATN.slice().reverse().map((n,i)=>'<path d="'+arcPath(16,16,14.9,-90+i*51.43+3,-90+(i+1)*51.43-3)+'" stroke="'+PAL[n]+'" stroke-dasharray="0.1 3.1" stroke-width="2"/>').join('');
/* Orbit's dressing: one tilted orbit through the sign, the way the rings run round the body */
const ORBIT='<ellipse cx="16" cy="16" rx="14.6" ry="4.8" transform="rotate(-26 16 16)"'+DOT+'/>';
const glyphFor=(ver,nm)=>SIGN[nm]+(ver===2?CORONA:ver===3?ORBIT:'');
