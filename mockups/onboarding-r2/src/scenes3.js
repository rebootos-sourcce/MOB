/* scenes3.js. Round PA drawings: the saboteur chain, the release's matrix and
   address strip, the voice ring, the cooldown clock, and the 21 laws. Pure
   functions of their arguments, so a strip frame and a live frame are the same
   drawing. */

/* ---------- THE LINK: pattern, the charge under it, what can form ----------
   Real names, read off the engine by running sniffStory on the sample sentence:
     axes       Fear 5.2 at the Lumbar plexus (Root), Anger 8.8 at the Celiac
                plexus (read from the Solar seat for "overwhelmed")
     saboteurs  Innocent, Controller, Hyper-Vigilant, in the order the engine
                ranks them. Controller and Hyper-Vigilant read both fetters.
                Innocent reads Fear alone, the least specific row in SAB33.
   No number is drawn. A saboteur here is dashed, because it has not formed:
   it forms if the charge on its fetters stays in its band. The edges are
   drawn from the fetters each SAB33 row is defined by (canon.js). */
var CHAIN={pattern:'Over-responsibility',
 fetters:[{k:'Fear',a:'Lumbar plexus',seat:0},{k:'Anger',a:'Celiac plexus',seat:2}],
 sabs:[{k:'Controller',f:[0,1]},{k:'Hyper-Vigilant',f:[0,1]},{k:'Innocent',f:[0]}]};
function chainSVG(W,H,o){
 o=o||{};var small=W<420,fs=small?13:14,fs2=small?11.5:12.5,out='<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" class="chain" role="img" aria-label="Over-responsibility rests on Fear at the Lumbar plexus and Anger at the Celiac plexus. Charge on those can form Controller, Hyper-Vigilant and Innocent.">';
 var lx=small?0:34,y1=small?24:28,y2=Math.round(H*.4),y3=H-(small?54:58);
 var x0=small?6:lx+54,x1=W-(small?6:10);var span=x1-x0;
 var px=x0+span*.5;
 var fx=[x0+span*.28,x0+span*.72];
 var sx=[x0+span*.14,x0+span*.5,x0+span*.86];
 var sc=SEATS[2].c;
 // edges first
 CHAIN.fetters.forEach(function(ft,i){
  out+='<path d="M'+f(px)+' '+f(y1+20)+' C'+f(px)+' '+f((y1+y2)/2)+' '+f(fx[i])+' '+f((y1+y2)/2)+' '+f(fx[i])+' '+f(y2-18)+'" fill="none" stroke="'+SEATS[ft.seat].c+'" stroke-width="2" opacity=".9"/>';});
 CHAIN.sabs.forEach(function(sb,j){sb.f.forEach(function(fi){
  var multi=sb.f.length>1;
  out+='<path d="M'+f(fx[fi])+' '+f(y2+18)+' C'+f(fx[fi])+' '+f((y2+y3)/2)+' '+f(sx[j])+' '+f((y2+y3)/2)+' '+f(sx[j])+' '+f(y3-19)+'" fill="none" stroke="'+SEATS[CHAIN.fetters[fi].seat].c+'" stroke-width="'+(multi?1.8:1.4)+'" stroke-dasharray="'+(multi?'5 4':'2 5')+'" opacity="'+(multi?.85:.55)+'"/>';});});
 // row labels, left, desktop only
 if(!small){
  [['Pattern',y1],['Charge on',y2],['Can form',y3]].forEach(function(r){out+='<text x="0" y="'+f(r[1]+4)+'" font-size="12" font-weight="600" fill="#94908A" font-family="Inter,sans-serif">'+r[0]+'</text>';});}
 // pattern node: a ring with a hollow centre, in its seat colour
 out+='<circle cx="'+f(px)+'" cy="'+y1+'" r="19" fill="#0C0D12" stroke="'+sc+'" stroke-width="2.8"/><circle cx="'+f(px)+'" cy="'+y1+'" r="6.5" fill="'+sc+'"/>';
 out+='<text x="'+f(px+30)+'" y="'+(y1+5)+'" font-size="'+fs+'" font-weight="600" fill="#EFEDE8" font-family="Inter,sans-serif">'+CHAIN.pattern+'</text>';
 // fetters
 CHAIN.fetters.forEach(function(ft,i){var c=SEATS[ft.seat].c;
  out+='<circle cx="'+f(fx[i])+'" cy="'+f(y2)+'" r="15" fill="#0C0D12" stroke="'+c+'" stroke-width="2.4"/><circle cx="'+f(fx[i])+'" cy="'+f(y2)+'" r="5" fill="'+c+'"/>';
  out+='<text x="'+f(fx[i]+21)+'" y="'+f(y2-1)+'" font-size="'+fs+'" font-weight="600" fill="#EFEDE8" font-family="Inter,sans-serif">'+ft.k+'</text>';
  out+='<text x="'+f(fx[i]+21)+'" y="'+f(y2+15)+'" font-size="'+fs2+'" fill="#94908A" font-family="Inter,sans-serif">'+ft.a+'</text>';});
 // saboteurs: dashed rings, not formed yet
 CHAIN.sabs.forEach(function(sb,j){
  out+='<circle cx="'+f(sx[j])+'" cy="'+f(y3)+'" r="14" fill="#0C0D12" stroke="'+(sb.f.length>1?ACC:MID)+'" stroke-width="2" stroke-dasharray="4 4"/>';
  out+='<text x="'+f(sx[j])+'" y="'+f(y3+34)+'" text-anchor="middle" font-size="'+fs+'" font-weight="'+(sb.f.length>1?600:500)+'" fill="'+(sb.f.length>1?'#EFEDE8':'#B4B0A8')+'" font-family="Inter,sans-serif">'+sb.k+'</text>';});
 return out+'</svg>';}

/* ---------- THE RELEASE MATRIX ----------
   Two columns, two rows. Left and right are the two sides of the body: left is
   inward, right is outward, the book's own words (REL_SIDE in ui/release.js).
   Release sits above install: release is a ring that empties, install is a ring
   that fills. cells[0..3] = Left release, Right release, Left install, Right
   install; each {s:'wait'|'now'|'done', p:0..1}. The cell is symbolic, so the
   difference between the four is drawn: the side is a half ring with a chevron,
   and the direction of the count is the arc's own. */
function sideGlyph(cx,cy,r,side,c,sw){
 var d=side==='L'?-1:1,out='';
 // a half ring on the side that is working, and a node on its middle: "(o" is left, "o)" is right
 out+='<path d="'+arcPath(cx,cy,r,side==='L'?100:-80,side==='L'?260:80)+'" fill="none" stroke="'+c+'" stroke-width="'+(sw||2.6)+'" stroke-linecap="round"/>';
 out+='<circle cx="'+f(cx+d*r*.18)+'" cy="'+f(cy)+'" r="'+f(r*.24)+'" fill="#0C0D12" stroke="'+c+'" stroke-width="'+(sw||2.6)*.8+'"/><circle cx="'+f(cx+d*r*.18)+'" cy="'+f(cy)+'" r="'+f(r*.08)+'" fill="'+c+'"/>';
 return out;}
function relCell(cx,cy,R,kind,side,cell){
 var s=cell.s,p=cell.p==null?(s==='done'?1:0):cell.p,out='',live=(s==='now'),col=(s==='wait'?'rgba(255,255,255,.34)':ACC),track='rgba(255,255,255,.16)';
 var L=2*Math.PI*R;
 // the track
 out+='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+R+'" fill="none" stroke="'+track+'" stroke-width="1.6"'+(kind==='rel'?' stroke-dasharray="1.5 6" stroke-linecap="round"':'')+'/>';
 if(kind==='rel'){ // release: the ring is full and empties
  var rem=s==='done'?0:(s==='now'?1-p:1);
  if(rem>0)out+='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+R+'" fill="none" stroke="'+col+'" stroke-width="'+(live?3.4:2.4)+'" stroke-linecap="round" stroke-dasharray="'+f(L*rem)+' '+f(L)+'" transform="rotate(-90 '+f(cx)+' '+f(cy)+')"/>';
 }else{ // install: the ring is empty and fills
  var fil=s==='done'?1:(s==='now'?p:0);
  if(fil>0)out+='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+R+'" fill="none" stroke="'+col+'" stroke-width="'+(live?3.4:2.4)+'" stroke-linecap="round" stroke-dasharray="'+f(L*fil)+' '+f(L)+'" transform="rotate(-90 '+f(cx)+' '+f(cy)+')"/>';
 }
 if(live)out+='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+f(R+9)+'" fill="none" stroke="'+ACC+'" stroke-width="1.2" opacity=".4"/>';
 out+=sideGlyph(cx,cy,R*.5,side,(s==='wait'?'#94908A':(live?INK:ACC)),2.4);
 if(s==='done')out+='<circle cx="'+f(cx+R*.78)+'" cy="'+f(cy-R*.78)+'" r="'+f(R*.2)+'" fill="#0C0D12" stroke="'+ACC+'" stroke-width="1.8"/><path d="M'+f(cx+R*.7)+' '+f(cy-R*.78)+' l'+f(R*.065)+' '+f(R*.07)+' l'+f(R*.12)+' '+f(-R*.15)+'" fill="none" stroke="'+ACC+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
 return out;}
function matrixSVG(sz,cells,o){
 o=o||{};var small=sz<300,R=sz*.18,gx=sz*.3,pad=small?26:34,out='<svg viewBox="0 0 '+sz+' '+(sz*1.0)+'" width="'+sz+'" height="'+sz+'" class="matrix" role="img" aria-label="Left and right, release and install. '+(o.aria||'')+'">';
 var xs=[sz*.34+(small?4:6),sz*.78],ys=[sz*.3,sz*.72];
 xs=[pad+R+(small?6:14)+ (small?10:18),sz-pad-R-4];
 xs=[sz*.37,sz*.8]; ys=[sz*.31,sz*.74];
 // headers: written once each
 out+='<text x="'+f(xs[0])+'" y="'+f(sz*.06)+'" text-anchor="middle" font-size="'+(small?12:13.5)+'" font-weight="600" fill="#B4B0A8" font-family="Inter,sans-serif">Left</text>';
 out+='<text x="'+f(xs[1])+'" y="'+f(sz*.06)+'" text-anchor="middle" font-size="'+(small?12:13.5)+'" font-weight="600" fill="#B4B0A8" font-family="Inter,sans-serif">Right</text>';
 out+='<text x="0" y="'+f(ys[0]+4)+'" font-size="'+(small?12:13.5)+'" font-weight="600" fill="#B4B0A8" font-family="Inter,sans-serif">Release</text>';
 out+='<text x="0" y="'+f(ys[1]+4)+'" font-size="'+(small?12:13.5)+'" font-weight="600" fill="#B4B0A8" font-family="Inter,sans-serif">Install</text>';
 out+=relCell(xs[0],ys[0],R,'rel','L',cells[0])+relCell(xs[1],ys[0],R,'rel','R',cells[1])
  +relCell(xs[0],ys[1],R,'ins','L',cells[2])+relCell(xs[1],ys[1],R,'ins','R',cells[3]);
 return out+'</svg>';}

/* the twelve lines of the mini release as one path of twelve nodes, three
   groups of four, one group per address. a path, never a ring: the ring is
   the loop's. done = lines said, now = the line being said. */
function twelveSVG(w,done,now){
 var out='<svg viewBox="0 0 '+w+' 34" width="'+w+'" height="34" class="twelve" role="img" aria-label="Twelve lines, three addresses of four. '+done+' said.">';
 var pad=10,step=(w-2*pad-2*22)/11,x=pad;
 out+='<line x1="'+pad+'" y1="14" x2="'+(w-pad)+'" y2="14" stroke="rgba(255,255,255,.16)" stroke-width="1.4"/>';
 var xs=[];
 for(var i=0;i<12;i++){xs.push(x);x+=step+(i%4===3?22:0);}
 if(done>0)out+='<line x1="'+f(xs[0])+'" y1="14" x2="'+f(xs[Math.min(done,11)])+'" y2="14" stroke="'+ACC+'" stroke-width="1.8"/>';
 xs.forEach(function(px,i){var d=i<done,n=i===now;
  out+='<circle cx="'+f(px)+'" cy="14" r="'+(n?7:5)+'" fill="'+(d||n?ACC:'#0C0D12')+'" stroke="'+(d||n?ACC:'rgba(255,255,255,.36)')+'" stroke-width="1.7"/>'+((d||n)?'<circle cx="'+f(px)+'" cy="14" r="'+(n?2.6:1.9)+'" fill="#0C0D12"/>':'');});
 return out+'</svg>';}

/* the three addresses the release works on. glyph path is the engine's own
   (CHILD in canon.js, 24 box), colour is the address's seat. pct is charge
   left, the number the app already prints on a release row (sqNow*10). */
var ADDR=[
 {k:'Fear',a:'Lumbar plexus',seat:0,ic:'M12 3l8 14H4z'},
 {k:'Anger',a:'Celiac plexus',seat:2,ic:'M13 2L4 14h6l-1 8 9-12h-6z'},
 {k:'Anticipation',a:'Below the heart',seat:2,ic:'M12 4v11M8 11l4 4 4-4M6 20h12'}];
function addrIco(ad,sz){return '<svg class="ic" viewBox="0 0 24 24" width="'+sz+'" height="'+sz+'" aria-hidden="true" style="color:'+SEATS[ad.seat].c+'"><path d="'+ad.ic+'"/></svg>';}
function addrCard(ad,pct,state){ // state: done, now, wait
 var c=SEATS[ad.seat].c,R=19,L=2*Math.PI*R,rem=pct/100;
 return '<div class="ad '+state+'" style="--c:'+c+'"><span class="adr"><svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><circle cx="24" cy="24" r="'+R+'" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2"/><circle cx="24" cy="24" r="'+R+'" fill="none" stroke="'+c+'" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="'+f(L*rem)+' '+f(L)+'" transform="rotate(-90 24 24)"/></svg>'+addrIco(ad,22)+'</span>'
  +'<span class="adt"><b>'+ad.k+'</b><span>'+ad.a+'</span></span><span class="adp num">'+pct+'%</span></div>';}

/* ---------- THE VOICE RING: the field ring, ticks lengthened by the voice ----------
   amp is a list of 112 values 0..1. The ring is the same 112 ticks as every
   other screen, so the voice is drawn on the Field's own grammar. */
function voiceTicks(cx,cy,r,amp,tl){
 var out='';
 for(var i=0;i<112;i++){var k=Math.floor(i/16),a=90+i*360/112+360/224,v=amp[i%amp.length];
  var p0=polar(cx,cy,r,a),p1=polar(cx,cy,r+tl*(.7+v*2.2),a);
  out+='<line x1="'+f(p0[0])+'" y1="'+f(p0[1])+'" x2="'+f(p1[0])+'" y2="'+f(p1[1])+'" stroke="'+SEATS[k].c+'" stroke-width="'+(1.6+v*1.4)+'" stroke-linecap="round" opacity="'+(.45+v*.5)+'"/>';}
 return out;}
function ampAt(t,seed){var a=[];for(var i=0;i<112;i++){var v=.5+.5*Math.sin(i*.31+t*2.1+seed)*Math.sin(i*.117-t*1.3);a.push(Math.max(0,Math.min(1,v*(.55+.45*Math.sin(t*.9+i*.05)))));}return a;}

/* ---------- THE COOLDOWN CLOCK ----------
   The two minute settle is the one clock left on the release. A ring that
   empties, and the time in the middle. left is seconds remaining. */
function clockSVG(sz,left){
 var R=sz*.4,L=2*Math.PI*R,c=sz/2,m=Math.floor(left/60),s=left%60;
 return '<svg viewBox="0 0 '+sz+' '+sz+'" width="'+sz+'" height="'+sz+'" class="clock" role="img" aria-label="'+m+' minutes '+s+' seconds of settling left">'
  +'<circle cx="'+c+'" cy="'+c+'" r="'+R+'" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2"/>'
  +'<circle cx="'+c+'" cy="'+c+'" r="'+R+'" fill="none" stroke="'+ACC+'" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="'+f(L*left/120)+' '+f(L)+'" transform="rotate(-90 '+c+' '+c+')"/>'
  +'<text x="'+c+'" y="'+(c+sz*.045)+'" text-anchor="middle" font-size="'+f(sz*.17)+'" font-weight="500" fill="#EFEDE8" font-family="Inter,sans-serif" class="num">'+m+':'+(s<10?'0'+s:s)+'</text></svg>';}

/* ---------- THE 21 LAWS, by seat. Real names, seats and icon paths from SI in
   engine/data/canon.js. Icons are the engine's own stroke paths, 24 box. ---------- */
var LAWS=[
 {n:'Truth',b:4,ic:'M12 3v11 M9 17a3 3 0 006 0 3 3 0 00-6 0'},{n:'Transparency',b:4,ic:'M4 4h16v16H4z M8 20L20 8'},{n:'Justice',b:4,ic:'M12 4v4 M4 8h16 M4 8l-2 5h4z M20 8l-2 5h4z'},
 {n:'Unity',b:6,ic:'M10 7a5 5 0 100 10 5 5 0 100-10 M14 7a5 5 0 110 10 5 5 0 110-10'},{n:'Awareness',b:6,ic:'M3 16h18 M7 16a5 5 0 0110 0'},{n:'Nature',b:6,ic:'M12 21V6 M12 13L7 9 M12 16l5-4 M12 10l4-3'},
 {n:'Presence',b:5,ic:'M12 11.4v1.2 M4 12a8 8 0 1116 0 8 8 0 01-16 0'},{n:'Humility',b:5,ic:'M4 11h16 M4 11a8 8 0 0016 0'},{n:'Equanimity',b:5,ic:'M3 10h18v4H3z M12 10v4'},
 {n:'Compassion',b:3,ic:'M12 19c-4-3-7-5-7-8a4 4 0 017-2 4 4 0 017 2c0 3-3 5-7 8'},{n:'Forgiveness',b:3,ic:'M9 9H7a4 4 0 000 6h2 M15 15h2a4 4 0 000-6h-2'},{n:'Generosity',b:3,ic:'M5 13a7 7 0 0014 0 M12 11V3 M9 6l3-3 3 3'},{n:'Aesthetic Beauty',b:3,ic:'M3 6h18v12H3z M3 18a12 12 0 0112-12'},
 {n:'Courage',b:2,ic:'M12 21V4 M8 8l4-4 4 4 M6 14h12'},{n:'Duty',b:2,ic:'M4 8h16 M7 8v12 M17 8v12'},{n:'Responsibility',b:2,ic:'M4 9h16v5H4z M9 14v5 M15 14v5 M9 19h6'},{n:'Accountability',b:2,ic:'M6 4v16 M18 4v16 M6 13h12 M9 8l2 2 4-4'},
 {n:'Temperance',b:1,ic:'M5 5h6l-3 6z M13 19h6l-3-6z M11 10l2 4'},{n:'Detachment',b:1,ic:'M3 12h5 M16 12h5 M10 7v10 M14 7v10'},
 {n:'Non-Harm',b:0,ic:'M4 12a8 8 0 1116 0 8 8 0 01-16 0 M8 12h8'},{n:'Patience',b:0,ic:'M7 4h10 M7 20h10 M7 4l5 8 5-8 M7 20l5-8 5 8'}];
/* the seven the owner named in round PA. "order" and "gratitude" are not among
   the 21, so they cannot be marked. */
var NAMED=['Truth','Duty','Compassion','Transparency','Courage','Aesthetic Beauty','Accountability'];
function lawIco(l,sz,col){return '<svg class="ic" viewBox="0 0 24 24" width="'+sz+'" height="'+sz+'" aria-hidden="true" style="color:'+(col||SEATS[l.b].c)+'"><path d="'+l.ic+'"/></svg>';}
