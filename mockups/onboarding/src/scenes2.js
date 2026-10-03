/* scenes2.js. The loop, as a ring. discover at the top, then clockwise.
   done = quarters closed. lit = the station named now. A circle, never a list. */
var LOOP=[{k:'discover',n:'Discover',i:'eye'},{k:'play',n:'Play',i:'play'},{k:'flow',n:'Flow',i:'flow'},{k:'embody',n:'Embody',i:'embody'}];
function loopRing(sz,o){
 o=o||{};var bare=!!o.bare,done=o.done||0,dset=o.doneSet||null,lit=o.lit==null?-1:o.lit,labels=o.labels!==false,c=sz/2,r=sz*.34,ns=bare?sz*.075:sz*.085;
 var out='<svg viewBox="0 0 '+sz+' '+sz+'" width="'+sz+'" height="'+sz+'" class="loop" role="img" aria-label="The loop: discover, play, flow, embody, and back to discover">';
 for(var i=0;i<4;i++){
  var a0=-90+i*90+20,a1=-90+(i+1)*90-20,isDone=dset?dset.indexOf(i)>-1:i<done;
  out+='<path d="'+arcPath(c,c,r,a0,a1)+'" fill="none" stroke="'+(isDone?ACC:'rgba(255,255,255,.22)')+'" stroke-width="'+(isDone?2.6:1.6)+'" stroke-linecap="round"/>';
  if(bare)continue;
  var pe=polar(c,c,r,a1),pa=polar(c,c,r,a1-4),dx=pe[0]-pa[0],dy=pe[1]-pa[1],L=Math.sqrt(dx*dx+dy*dy)||1;dx/=L;dy/=L;
  out+='<path d="M'+f(pe[0]-dx*7-dy*4.5)+' '+f(pe[1]-dy*7+dx*4.5)+' L'+f(pe[0])+' '+f(pe[1])+' L'+f(pe[0]-dx*7+dy*4.5)+' '+f(pe[1]-dy*7-dx*4.5)+'" fill="none" stroke="'+(isDone?ACC:'rgba(255,255,255,.34)')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
 }
 for(var k=0;k<4;k++){
  var p=polar(c,c,r,-90+k*90),on=(k===lit),dn=dset?dset.indexOf(k)>-1:k<done;
  out+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+f(ns*(on?1.14:1))+'" fill="#0C0D12" stroke="'+((on||dn)?ACC:'rgba(255,255,255,.32)')+'" stroke-width="'+(on?2.6:1.8)+'"/>';
  if(!bare)out+='<svg x="'+f(p[0]-ns*.58)+'" y="'+f(p[1]-ns*.58)+'" width="'+f(ns*1.16)+'" height="'+f(ns*1.16)+'" viewBox="0 0 48 48" style="color:'+((on||dn)?ACC:'#94908A')+'" class="ic">'+ICONS[LOOP[k].i]+'</svg>';
  if(labels){var lp,anc='middle';
   if(k===0)lp=[c,p[1]-ns*1.5];
   if(k===2)lp=[c,p[1]+ns*2.3];
   if(k===1){lp=[p[0]+ns*1.5,p[1]+4];anc='start';}
   if(k===3){lp=[p[0]-ns*1.5,p[1]+4];anc='end';}
   out+='<text x="'+f(lp[0])+'" y="'+f(lp[1])+'" text-anchor="'+anc+'" font-size="'+(sz>260?15:12)+'" font-weight="'+(on?600:500)+'" fill="'+(on?INK:'#B4B0A8')+'" font-family="Inter,sans-serif">'+LOOP[k].n+'</text>';}
 }
 return out+'</svg>';}
