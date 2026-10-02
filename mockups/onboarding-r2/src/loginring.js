/* loginring.js. The ring behind Login A, as a pure function of a state object,
   so the live page and the frame strip draw the same thing.

   What each motion means. Motion is state, never decoration.
     breathe   the 112 quiet ticks rise and fall over nine seconds. It means the
               instrument is waiting. It stops mattering the moment you type.
     sweep     one short arc travels the outer edge, one turn in 48 seconds. It
               means nobody has said anything yet. It fades out on the first
               character, because a ring that keeps turning while you type is
               watching the wrong thing.
     typing    each character of the username lights one tick in the Throat
               sector (the name, said aloud). Each character of the passphrase
               lights one tick in the Root sector (ground) and one node on the
               inner path, a pair, left and right, working down from the top.
               Twenty characters close the path.
     confirm   every tick reads full, the path closes, one ring leaves outward.
     mismatch  the path stops, splits into two dashed branches, and one alarm
               marker sits at the break. The alarm is used here because
               something is wrong.
   o: W,H,M, cx,cy,r, nu (username characters), np (passphrase characters),
      arcFrom (where the path was, for the transition), err, ok, sweep (degrees,
      or null for none), live (adds the CSS animations). */
var LR_THROAT=4, LR_ROOT=0;
function loginRingSVG(o){
 var W=o.W,H=o.H,cx=o.cx,cy=o.cy,r=o.r,M=!!o.M,tl=M?8:11,sw=2,i,out='';
 var rc=r-(M?12:16),L=Math.PI*rc,nu=Math.min(o.nu||0,16),np=Math.min(o.np||0,20);
 var typing=(nu+np)>0;
 var p=o.ok?1:(o.err?.6:np/20), from=o.arcFrom==null?p:o.arcFrom;
 var litT=[],litR=[];
 for(i=0;i<nu;i++)litT.push(LR_THROAT*16+i);
 for(i=0;i<np&&i<16;i++)litR.push(LR_ROOT*16+i);
 var litAll=o.ok?null:litT.concat(litR);
 out+='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
 // quiet ticks and the seven concentric arcs, breathing
 out+='<g class="'+(o.live&&!o.ok?'breathe':'')+'" opacity="'+(o.live?'':'.75')+'">';
 var quiet='';
 for(i=0;i<112;i++){
  var k=Math.floor(i/16),a=90+i*360/112+360/224;
  if(o.ok||litAll.indexOf(i)>-1)continue;
  var p0=polar(cx,cy,r,a),p1=polar(cx,cy,r+tl,a);
  quiet+='<line x1="'+f(p0[0])+'" y1="'+f(p0[1])+'" x2="'+f(p1[0])+'" y2="'+f(p1[1])+'" stroke="'+SEATS[k].c+'" stroke-width="'+sw+'" stroke-linecap="round" opacity=".62"/>';
 }
 out+=quiet+fieldRing({cx:cx,cy:cy,r:r,ticks:false,radii:[r*(o.am||1.2),r*(o.am||1.2)*1.2,r*(o.am||1.2)*1.43]})+'</g>';
 // lit ticks: do not breathe, they are the answer
 out+='<g class="lit">';
 var all=o.ok?(function(){var a=[];for(var j=0;j<112;j++)a.push(j);return a;})():litAll;
 all.forEach(function(idx,n){
  var k=Math.floor(idx/16),a=90+idx*360/112+360/224;
  var q0=polar(cx,cy,r,a),q1=polar(cx,cy,r+tl*1.9,a),last=(!o.ok&&n===all.length-1&&o.live&&o.pop);
  out+='<line class="'+(last?'pop':'')+'" x1="'+f(q0[0])+'" y1="'+f(q0[1])+'" x2="'+f(q1[0])+'" y2="'+f(q1[1])+'" stroke="'+SEATS[k].c+'" stroke-width="'+(o.ok?2.4:3)+'" stroke-linecap="round"/>';
 });
 out+='</g>';
 // the sweep: waiting
 if(o.sweep!=null||o.live){
  var sa=o.sweep==null?0:o.sweep, rs=r+tl*1.9+9;
  out+='<g transform="rotate('+sa+' '+f(cx)+' '+f(cy)+')" class="swwrap'+(typing||o.ok||o.err?' off':'')+'"><g class="'+(o.live?'sweep':'')+'" style="transform-origin:'+f(cx)+'px '+f(cy)+'px">'
   +'<path d="'+arcPath(cx,cy,rs,-98,-84)+'" fill="none" stroke="'+ACC+'" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'
   +'<path d="'+arcPath(cx,cy,rs,-84,-70)+'" fill="none" stroke="'+ACC+'" stroke-width="1.4" stroke-linecap="round" opacity=".32"/></g></g>';
 }
 // inner track, the path and its nodes
 out+='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+f(rc)+'" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>';
 var top=polar(cx,cy,rc,270),bot=polar(cx,cy,rc,90);
 var dR='M'+f(top[0])+' '+f(top[1])+' A'+f(rc)+' '+f(rc)+' 0 0 1 '+f(bot[0])+' '+f(bot[1]);
 var dL='M'+f(top[0])+' '+f(top[1])+' A'+f(rc)+' '+f(rc)+' 0 0 0 '+f(bot[0])+' '+f(bot[1]);
 out+='<path id="cr" d="'+dR+'" fill="none" stroke="'+ACC+'" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="'+f(L)+'" stroke-dashoffset="'+f(L*(1-from))+'" data-to="'+f(L*(1-p))+'"/>';
 out+='<path id="cl" d="'+dL+'" fill="none" stroke="'+ACC+'" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="'+f(L)+'" stroke-dashoffset="'+f(L*(1-from))+'" data-to="'+f(L*(1-p))+'"/>';
 for(i=1;i<=20;i++){
  if(M&&i%2)continue; // the small ring carries ten pairs, not twenty
  var ang=9*i,reached=(o.ok||i<=np);
  var nr=polar(cx,cy,rc,270+ang),nl=polar(cx,cy,rc,270-ang);
  [nr,nl].forEach(function(q){
   out+='<circle cx="'+f(q[0])+'" cy="'+f(q[1])+'" r="'+(reached?3.6:2.2)+'" fill="'+(reached?'#0C0D12':'none')+'" stroke="'+(reached?ACC:'rgba(255,255,255,.22)')+'" stroke-width="'+(reached?1.8:1.1)+'"/>'
    +(reached?'<circle cx="'+f(q[0])+'" cy="'+f(q[1])+'" r="1.2" fill="'+ACC+'"/>':'');});
 }
 // the top node: a name has been placed
 out+='<g opacity="'+((o.nu||o.ok)?1:0)+'"><circle cx="'+f(cx)+'" cy="'+f(cy-rc)+'" r="8" fill="#0C0D12" stroke="'+SEATS[LR_THROAT].c+'" stroke-width="2.2"/><circle cx="'+f(cx)+'" cy="'+f(cy-rc)+'" r="2.8" fill="'+SEATS[LR_THROAT].c+'"/></g>';
 // the bottom node: ground, waiting until a passphrase begins
 out+='<g opacity="'+(np||o.ok?1:.55)+'"><circle cx="'+f(cx)+'" cy="'+f(cy+rc)+'" r="'+(np||o.ok?8:5)+'" fill="#0C0D12" stroke="'+(np||o.ok?SEATS[LR_ROOT].c:'rgba(255,255,255,.34)')+'" stroke-width="'+(np||o.ok?2.2:1.5)+'"/>'+((np||o.ok)?'<circle cx="'+f(cx)+'" cy="'+f(cy+rc)+'" r="2.8" fill="'+SEATS[LR_ROOT].c+'"/>':'')+'</g>';
 // confirm: one ring leaves outward
 if(o.ok)out+='<circle class="'+(o.live?'leave-ring':'')+'" cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+f(r+tl*2+30)+'" fill="none" stroke="'+ACC+'" stroke-width="1.4" opacity=".4"/>';
 // mismatch: the path stops and splits in two, one alarm marker
 if(o.err){
  var x=polar(cx,cy,rc,270-108);
  out+='<path d="M'+f(x[0])+' '+f(x[1])+' L'+f(x[0]-62)+' '+f(x[1]-48)+'" stroke="'+MID+'" stroke-width="1.5" stroke-dasharray="3 5" fill="none" stroke-linecap="round"/>'
   +'<path d="M'+f(x[0])+' '+f(x[1])+' L'+f(x[0]-70)+' '+f(x[1]+44)+'" stroke="'+MID+'" stroke-width="1.5" stroke-dasharray="3 5" fill="none" stroke-linecap="round"/>'
   +'<path d="M'+f(x[0]-9)+' '+f(x[1]-9)+' L'+f(x[0]+9)+' '+f(x[1]+9)+'" stroke="'+ALARM+'" stroke-width="2.6" stroke-linecap="round"/>'
   +'<circle cx="'+f(x[0])+'" cy="'+f(x[1])+'" r="11" fill="none" stroke="'+ALARM+'" stroke-width="1.6"/>';
 }
 return out+'</svg>';}
