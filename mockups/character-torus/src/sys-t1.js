/* TORUS 1, FLOW. The clean one. Two nested tori of cubic Bezier loops: sixteen meridians on the outer, twelve on the inner, and the
   parallels at the seat heights between them, so the lattice reads as a torus before it reads as anything else. Pulses climb the
   outside of the body, go over the head, and come back down through the axis, in step at full coherence and falling apart as it drops. */
const SYS_T1={id:'torus-1',name:'Torus 1, Flow',ver:3,torus:true,lineK:1,lineY:.004,
 blurb:'Two nested tori made of cubic Bezier loops, turning slowly in perspective. Pulses climb the outside of the body and return down the axis. The seats pinch, bulge and pull the loops at their own heights.',
 how:'Two nested tori, a lattice of loops',
 init(sc){torusInit(sc);sc.mem.T=[mkT(0,1.12,1.32,16,3),mkT(1,.74,1.06,12,2)];},
 draw(sc){prepFrame(sc);const ss=sc.ss;drawBody(sc,ss);PF(sc,'body');const g=sc.g,d=sc.dpr,M=sc.mem,LB=M.LB,DB=M.DB;LB.reset();DB.reset();
  M.T.forEach((T,i)=>{tEff(sc,T);const fr=loopFrame(sc,T),o={M:T.M,P:T.P,gain:i?.82:1,inner:.42,LB,DB,nodes:true,jit:true};
   drawMeridians(sc,T,fr,o);drawRings(sc,T,fr,{gain:i?.8:1,inner:0,P:T.P,LB});if(!i)drawRays(sc,T,fr,{gain:.85,LB,DB,NR:36});});
  drawLeaks(sc,M.T[0],DB);PF(sc,'build');LB.flush(g,d,COLQ,AQ,LWQ,1);DB.flush(g,d,COLQ,AQ,SQ5,dotBase(sc));PF(sc,'flush');drawAddrs(sc,ss);PF(sc,'addr');},
 overlay:overlayTorus,bloom(sc){const c=sc.c;return[.2*c,.15*c];},glance:GLANCE};
