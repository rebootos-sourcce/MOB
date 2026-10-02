/* wheel.js. The feelings wheel as data and as a ring. Data transcribed from
   FEELINGS-WHEEL.md (the wheel the owner sent in round PA): seven primary
   families, 41 secondary words, 82 tertiary words. Nothing is invented here
   except the colour each family takes, which is PROPOSED and is always a seat
   colour, so no colour on the ring lacks a reason:
     Fearful   Root       the Fear axis sits at the Lumbar plexus
     Angry     Solar      the Anger axis sits at the Celiac plexus
     Disgusted Sacral     the Disgust axis sits at Sacral and dermis
     Sad       Heart      the Sad axis sits at the Cardiac plexus
     Bad       Throat     the Apathy axis sits at the base of the neck
     Surprised 3rd Eye    the Shock axis sits at the forehead
     Happy     Crown      the coherent side, where the poles are held open
   The first five come straight off CHILD in engine/data/canon.js. Surprised
   and Happy are the two proposals. */
var WHEEL=[
 {f:'Happy',seat:6,s:[['Playful','Aroused','Cheeky'],['Content','Free','Joyful'],['Interested','Curious','Inquisitive'],['Proud','Successful','Confident'],['Accepted','Respected','Valued'],['Powerful','Courageous','Creative'],['Peaceful','Loving','Thankful'],['Trusting','Sensitive','Intimate'],['Optimistic','Hopeful','Inspired']]},
 {f:'Surprised',seat:5,s:[['Startled','Shocked','Dismayed'],['Confused','Disillusioned','Perplexed'],['Amazed','Astonished','Awe'],['Excited','Eager','Energetic']]},
 {f:'Bad',seat:4,s:[['Bored','Indifferent','Apathetic'],['Busy','Pressured','Rushed'],['Stressed','Overwhelmed','Out of control'],['Tired','Sleepy','Unfocussed']]},
 {f:'Fearful',seat:0,s:[['Scared','Helpless','Frightened'],['Anxious','Overwhelmed','Worried'],['Insecure','Inadequate','Inferior'],['Weak','Worthless','Insignificant'],['Rejected','Excluded','Persecuted'],['Threatened','Nervous','Exposed']]},
 {f:'Angry',seat:2,s:[['Let down','Betrayed','Resentful'],['Humiliated','Disrespected','Ridiculed'],['Bitter','Indignant','Violated'],['Mad','Furious','Jealous'],['Aggressive','Provoked','Hostile'],['Frustrated','Infuriated','Annoyed'],['Distant','Withdrawn','Numb'],['Critical','Skeptical','Dismissive']]},
 {f:'Disgusted',seat:1,s:[['Disapproving','Judgmental','Embarrassed'],['Disappointed','Appalled','Revolted'],['Awful','Nauseated','Detestable'],['Repelled','Horrified','Hesitant']]},
 {f:'Sad',seat:3,s:[['Lonely','Isolated','Abandoned'],['Vulnerable','Victimized','Fragile'],['Despair','Grief','Powerless'],['Guilty','Ashamed','Remorseful'],['Depressed','Empty','Inferior'],['Hurt','Disappointed','Embarrassed']]}];
function wheelFam(name){for(var i=0;i<WHEEL.length;i++)if(WHEEL[i].f===name)return WHEEL[i];return null;}

/* the ring. Three rings of arcs, one stroke each, no fills. Inner is the
   family, middle the secondary word, outer the tertiary word. Arc length is
   proportional to the number of tertiary words under it, so the ring is the
   wheel's own proportions. o.path = {f,s,t} is the lit chain; o.also is a
   second chain the same tertiary word sits under, drawn dashed. */
function wheelSVG(sz,o){
 o=o||{};var c=sz/2,gap=o.gap==null?1.1:o.gap,out='<svg viewBox="0 0 '+sz+' '+sz+'" width="'+sz+'" height="'+sz+'" class="wheelsvg" role="img" aria-label="'+(o.aria||'The feelings wheel, three rings: family, secondary word, tertiary word.')+'">';
 var kk=o.labels?.8:1,rad=o.mini?[sz*.2,sz*.32,sz*.44]:[sz*.215*kk,sz*.31*kk,sz*.40*kk],sw=o.mini?[sz*.105,sz*.11,sz*.11]:[sz*.075*kk,sz*.085*kk,sz*.085*kk];
 var total=0;WHEEL.forEach(function(w){total+=w.s.length*2;});
 var a0=-90,lit=o.path||{},also=o.also||null,ob=o.mini?2:1;
 WHEEL.forEach(function(w){
  var span=w.s.length*2*360/total,col=SEATS[w.seat].c,fOn=(lit.f===w.f),fAlso=also&&also.f===w.f;
  out+='<path d="'+arcPath(c,c,rad[0],a0+gap,a0+span-gap)+'" fill="none" stroke="'+col+'" stroke-width="'+f(sw[0])+'" opacity="'+(fOn?.95:(fAlso?.5:.34*ob))+'"/>';
  var b=a0;
  w.s.forEach(function(sec){
   var sp=2*360/total,sOn=fOn&&lit.s===sec[0],sAlso=fAlso&&also.s===sec[0];
   out+='<path d="'+arcPath(c,c,rad[1],b+gap*.6,b+sp-gap*.6)+'" fill="none" stroke="'+col+'" stroke-width="'+f(sw[1])+'" opacity="'+(sOn?.95:(sAlso?.5:(fOn?.4*ob:.24*ob)))+'"'+(sAlso?' stroke-dasharray="3 3"':'')+'/>';
   for(var k=0;k<2;k++){
    var t0=b+k*sp/2,t1=b+(k+1)*sp/2,tn=sec[k+1],tOn=sOn&&lit.t===tn,tAlso=sAlso&&also.t===tn;
    out+='<path d="'+arcPath(c,c,rad[2],t0+gap*.45,t1-gap*.45)+'" fill="none" stroke="'+col+'" stroke-width="'+f(sw[2])+'" opacity="'+(tOn?.95:(tAlso?.5:(sOn?.45:(fOn?.26*ob:.15*ob))))+'"'+(tAlso?' stroke-dasharray="3 3"':'')+'/>';
   }
   b+=sp;});
  if(o.labels){var mp=polar(c,c,rad[2]+sw[2]*.5+14,a0+span/2),lc=Math.cos((a0+span/2)*Math.PI/180);
   out+='<text x="'+f(mp[0])+'" y="'+f(mp[1]+4)+'" text-anchor="'+(Math.abs(lc)<.3?'middle':(lc>0?'start':'end'))+'" font-size="'+(o.lfs||13)+'" font-weight="'+(fOn?600:500)+'" fill="'+(fOn?col:'#94908A')+'" font-family="Inter,sans-serif">'+w.f+'</text>';}
  a0+=span;});
 if(o.mini&&lit.f){ // at 48 px a lit arc is a speck, so the chain is also drawn as a pointer through the three rings
  var pc=SEATS[wheelFam(lit.f).seat].c,pts=[0,1,2].map(function(r){return wheelPosR(sz,lit,r,rad);});
  out+='<path d="M'+f(pts[0][0])+' '+f(pts[0][1])+' L'+f(pts[1][0])+' '+f(pts[1][1])+' L'+f(pts[2][0])+' '+f(pts[2][1])+'" fill="none" stroke="#0C0D12" stroke-width="'+f(sz*.1)+'" stroke-linecap="round"/>'
   +'<path d="M'+f(pts[0][0])+' '+f(pts[0][1])+' L'+f(pts[1][0])+' '+f(pts[1][1])+' L'+f(pts[2][0])+' '+f(pts[2][1])+'" fill="none" stroke="'+pc+'" stroke-width="'+f(sz*.05)+'" stroke-linecap="round"/>'
   +'<circle cx="'+f(pts[2][0])+'" cy="'+f(pts[2][1])+'" r="'+f(sz*.07)+'" fill="#0C0D12" stroke="'+pc+'" stroke-width="'+f(sz*.04)+'"/>';}
 return out+(o.extra||'')+'</svg>';}
function wheelPosR(sz,path,ring,rad){
 var c=sz/2,total=0;WHEEL.forEach(function(w){total+=w.s.length*2;});
 var a=-90,res=[c,c];
 WHEEL.forEach(function(w){
  var span=w.s.length*2*360/total;
  if(w.f===path.f){
   if(ring===0)res=polar(c,c,rad[0],a+span/2);
   else{var b=a;w.s.forEach(function(sec){var sp=2*360/total;
    if(sec[0]===path.s){if(ring===1)res=polar(c,c,rad[1],b+sp/2);
     else{var ti=sec[1]===path.t?0:1;res=polar(c,c,rad[2],b+sp*(ti*.5+.25));}}
    b+=sp;});}}
  a+=span;});
 return res;}
/* where a lit word sits on the ring, for a label line: ring 0 family, 1 secondary, 2 tertiary */
function wheelPos(sz,path,ring){
 var c=sz/2,total=0;WHEEL.forEach(function(w){total+=w.s.length*2;});
 var rad=[sz*.215,sz*.31,sz*.40],a=-90,res=null;
 WHEEL.forEach(function(w){
  var span=w.s.length*2*360/total;
  if(w.f===path.f){
   if(ring===0)res=polar(c,c,rad[0],a+span/2);
   else{var b=a;w.s.forEach(function(sec){var sp=2*360/total;
    if(sec[0]===path.s){if(ring===1)res=polar(c,c,rad[1],b+sp/2);
     else{var ti=sec[1]===path.t?0:1;res=polar(c,c,rad[2],b+sp*(ti*.5+.25));}}
    b+=sp;});}}
  a+=span;});
 return res;}
/* a 34 px glyph of the same ring, for the Quality cell: no labels, the lit
   chain only. A ring of rings, not a picture of a wheel. */
function wheelMini(px,path){return wheelSVG(px,{path:path,gap:7,mini:true,aria:'Fearful, then anxious, then overwhelmed'});}
