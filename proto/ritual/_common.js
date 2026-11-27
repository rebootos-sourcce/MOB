/* ============================================================
   SHARED BY THE THREE PROTOTYPES. Inlined into each one at build, so every
   page runs with no sibling file. Nothing here reaches the network.

   ICONOGRAPHY. Four tracks, four glyphs, RING AND NOT FILL, which is the
   standing ruling. Each is a stroke path in a 24 box and carries the track's
   colour, so the glyph and the colour say the same thing twice and a person
   who cannot tell the blue from the green still reads the shape.
   ============================================================ */
var TRACKS={
 Somatic:{c:'#DBBF68', ic:'M12 21c-4 0-7-3-7-6s2-5 4-5 3 1 3 3-1 3-2 3',
   nm:'Somatic', d:'sensation, read directly'},
 Body:{c:'#68CBA4', ic:'M12 4a8 8 0 100 16 8 8 0 100-16 M4 12h16',
   nm:'Body', d:'breath, and the nervous system'},
 Energy:{c:'#AF89D6', ic:'M12 8a4 4 0 100 8 4 4 0 100-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3',
   nm:'Energy', d:'attention, held at a point'},
 Mind:{c:'#7B97E2', ic:'M4 8h16 M4 12h10 M4 16h13',
   nm:'Mind', d:'thought, watched and not followed'}};
var SEATC={Root:'#CF5953',Sacral:'#D19255',Solar:'#D4BC70',Heart:'#65CFA5',
 Throat:'#65B8D4','3rd Eye':'#8296DB',Crown:'#A883D6'};
/* where each seat sits on the dial, in degrees clockwise from the top. Root at
   the bottom and Crown at the top, because that is where they sit on the body
   and the figure on every other surface already draws them that way. */
var SEATDEG={Crown:0,'3rd Eye':26,Throat:51,Heart:77,Solar:103,Sacral:129,Root:180};
var SEATORDER=['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'];

function svgIc(path,c,sz){
 return '<svg viewBox="0 0 24 24" width="'+(sz||20)+'" height="'+(sz||20)+'" fill="none" '
 +'stroke="'+c+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
 +'<path d="'+path+'"/></svg>';}

/* THE RUN, READ OFF A WALK. Same rule as engine/ladder.js streakRead: a gap of
   one or two days is carried, three or more halves what was standing, and it
   never resets. Ported rather than reinvented so the prototype cannot claim a
   number the build would not. */
function runOf(walk){
 var run=0,gap=0;
 for(var i=0;i<walk.length;i++){
  if(walk[i]){run++;gap=0;}
  else{gap++; if(gap>2){run=Math.max(1,Math.ceil(run/2));gap=0;}}}
 return run;}
function bestOf(walk){var b=0,c=0;
 for(var i=0;i<walk.length;i++){if(walk[i]){c++;if(c>b)b=c;}else c=0;}return b;}

/* THE SPAN IS EARNED, NOT FIXED. A thirteen week grid drawn for somebody with
   seven days on the record is eighty four empty squares beside seven full
   ones, which reads as a tally of failures nobody asked for. The grid starts
   at the history it has, rounded up to a whole week with one week of room
   ahead, and grows to the cap. Nothing is ever drawn that the person has not
   lived through.  */
function spanOf(walk,cap){
 return Math.max(2,Math.min(cap||13,Math.ceil(walk.length/7)+1));}
/* the walk laid out as calendar weeks ending today, so the heat map has a
   weekday axis and is not just a run of squares. */
function weeksOf(walk,cols){
 cols=cols||13; var cells=cols*7, out=[];
 var pad=cells-walk.length;
 for(var i=0;i<cells;i++){
  var j=i-pad;
  out.push(j<0?null:(walk[j]===undefined?null:walk[j]));}
 return out;}

/* ARC. One segment of a ring, drawn as a stroked path so nothing is ever
   filled. a0 and a1 in degrees clockwise from the top. */
function arc(cx,cy,r,a0,a1){
 var p=function(a){var t=(a-90)*Math.PI/180;
  return [cx+r*Math.cos(t),cy+r*Math.sin(t)];};
 var s=p(a0), e=p(a1), big=(a1-a0)>180?1:0;
 return 'M'+s[0].toFixed(2)+' '+s[1].toFixed(2)
  +'A'+r+' '+r+' 0 '+big+' 1 '+e[0].toFixed(2)+' '+e[1].toFixed(2);}

/* a name made possessive without producing Marcuss */
function poss(n){return n+(/s$/i.test(n)?'\u2019':'\u2019s');}
function plural(n,w){return n+' '+w+(n===1?'':'s');}
