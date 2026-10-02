/* kit.js. Shared drawing for the onboarding mockups. No network, no deps. */
var SEATS=[
 {k:'root',n:'Root',c:'#D6524C'},{k:'sacral',n:'Sacral',c:'#D8924E'},
 {k:'solar',n:'Solar plexus',c:'#DABF6A'},{k:'heart',n:'Heart',c:'#5FD5A6'},
 {k:'throat',n:'Throat',c:'#5EBBDB'},{k:'eye',n:'Third eye',c:'#7D93E0'},
 {k:'crown',n:'Crown',c:'#A77EDB'}];
var ACC='#7EB8D4', ALARM='#FF2E1F', INK='#EFEDE8', MID='#B4B0A8', DIM='#94908A';
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function polar(cx,cy,r,deg){var a=deg*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
function f(n){return Math.round(n*100)/100;}
function arcPath(cx,cy,r,a0,a1){
 var p0=polar(cx,cy,r,a0),p1=polar(cx,cy,r,a1),large=(a1-a0)>180?1:0;
 return 'M'+f(p0[0])+' '+f(p0[1])+' A'+r+' '+r+' 0 '+large+' 1 '+f(p1[0])+' '+f(p1[1]);}
/* THE BLUE LOGO. The app's own drawn wordmark, path data copied unchanged from
   atuned_src/shell/body.html (the .brand button): six lowercase letters cut as
   strokes, the umlaut as two white dots. Letters take the sky accent, #7EB8D4
   on Dark, the same token the top bar uses (--sky). w is the width in pixels. */
var WM_PATHS='<g fill="none" stroke="currentColor" stroke-width="19" stroke-linecap="butt" stroke-linejoin="round">'
 +'<path d="M 9.5 80 A 42 42 0 1 0 93.5 80 A 42 42 0 1 0 9.5 80"/><path d="M 93.5 30 L 93.5 130"/>'
 +'<path d="M 24 4 L 24 130" transform="translate(123.75 0)"/><path d="M 0 38.75 L 56 38.75" transform="translate(123.75 0)"/>'
 +'<path d="M 9.5 30 L 9.5 80 A 40.5 40.5 0 0 0 90.5 80 L 90.5 30" transform="translate(189.75 0)"/>'
 +'<path d="M 9.5 130 L 9.5 30" transform="translate(318.25 0)"/><path d="M 9.5 80 A 40.5 40.5 0 0 1 90.5 80 L 90.5 130" transform="translate(318.25 0)"/>'
 +'<path d="M 9.5 83 L 102.91 83" transform="translate(436.75 0)"/><path d="M 93.39 83 A 42 42 0 1 0 82.71 108.1" transform="translate(436.75 0)"/>'
 +'<path d="M 9.5 80 A 42 42 0 1 0 93.5 80 A 42 42 0 1 0 9.5 80" transform="translate(548.5 0)"/><path d="M 93.5 0 L 93.5 130" transform="translate(548.5 0)"/></g>'
 +'<g class="wm-d"><circle cx="214.75" cy="12.5" r="9.5"/><circle cx="264.75" cy="12.5" r="9.5"/></g>';
function mark(w){w=w||96;
 return '<span class="mark" role="img" aria-label="Atuned" style="width:'+w+'px"><svg viewBox="-2 -2 655.5 136" focusable="false" aria-hidden="true">'+WM_PATHS+'</svg></span>';}

/* ICONS. 48 box, 2 stroke, round terminals, ring not fill. One family. */
var ICONS={
 anxiety:'<circle cx="22" cy="24" r="12"/><circle cx="27" cy="24" r="12" opacity=".5"/>',
 overwhelm:'<circle cx="18.5" cy="20" r="9"/><circle cx="29.5" cy="20" r="9"/><circle cx="24" cy="29.5" r="9"/>',
 anger:'<circle cx="24" cy="24" r="17"/><path d="M27 11 L20 25 L28 25 L21 37"/>',
 burnout:'<path d="M24 7 A17 17 0 1 1 7 24"/><circle cx="10" cy="16.5" r="1.3"/><circle cx="15.5" cy="10.5" r="1.3"/>',
 pain:'<path d="M41 15 A17 17 0 1 0 41 33"/><path d="M45 24 H28"/><circle cx="24" cy="24" r="2.4"/>',
 mail:'<rect x="5" y="11" width="38" height="26" rx="6"/><path d="M7 15 L24 28 L41 15"/>',
 link:'<path d="M20 28 a7 7 0 0 0 10 0 l7-7 a7 7 0 0 0-10-10 l-2 2 M28 20 a7 7 0 0 0-10 0 l-7 7 a7 7 0 0 0 10 10 l2-2"/>',
 fatigue:'<circle cx="24" cy="24" r="17"/><path d="M13 30 H35"/><path d="M18 18 L24 24 L30 18"/>',
 grief:'<circle cx="24" cy="19" r="12"/><path d="M24 31 V39"/><circle cx="24" cy="43" r="1.4"/>',
 fear:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="3.5"/><path d="M24 10 V16 M24 38 V32 M10 24 H16 M38 24 H32"/>',
 relationships:'<circle cx="13" cy="24" r="8"/><circle cx="35" cy="24" r="8"/><path d="M21 24 H27"/>',
 selfworth:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="31" r="5"/>',
 money:'<circle cx="24" cy="24" r="17"/><path d="M16 20 H32 M16 28 H32"/>',
 purpose:'<circle cx="24" cy="24" r="17"/><path d="M24 24 L36 12"/><circle cx="36" cy="12" r="2.4"/>',
 other:'<circle cx="24" cy="24" r="17" stroke-dasharray="3 5.2"/><circle cx="24" cy="24" r="2.2"/>',
 mic:'<rect x="17" y="6" width="14" height="22" rx="7"/><path d="M10 23 a14 14 0 0 0 28 0 M24 37 V43"/>',
 keyboard:'<rect x="5" y="12" width="38" height="24" rx="5"/><path d="M12 20 H14 M20 20 H22 M28 20 H30 M34 20 H36 M14 28 H34"/>',
 eye:'<path d="M4 24 Q24 5 44 24 Q24 43 4 24Z"/><circle cx="24" cy="24" r="5.5"/>',
 play:'<circle cx="24" cy="24" r="17"/><path d="M20 16 L33 24 L20 32Z"/>',
 flow:'<path d="M5 16 q6.5-7 13 0 t13 0 t13 0 M5 25 q6.5-7 13 0 t13 0 t13 0 M5 34 q6.5-7 13 0 t13 0 t13 0"/>',
 embody:'<circle cx="24" cy="9" r="4.5"/><path d="M24 14 V30 M9 21 H39 M24 30 L16 43 M24 30 L32 43"/>',
 gear:'<circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="16" stroke-dasharray="4.2 4.4"/>',
 guest:'<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="18" stroke-dasharray="2 4.5"/>',
 user:'<circle cx="24" cy="17" r="8"/><path d="M8 42 a16 12 0 0 1 32 0"/>',
 lock:'<rect x="10" y="22" width="28" height="19" rx="5"/><path d="M16 22 V17 a8 8 0 0 1 16 0 V22"/>',
 check:'<circle cx="24" cy="24" r="17"/><path d="M16 24.5 l6 6 l11-12"/>',
 tick:'<path d="M10 25 l9 9 l19-20"/>',
 think:'<circle cx="24" cy="21" r="15"/><circle cx="16.5" cy="21" r="1.7"/><circle cx="24" cy="21" r="1.7"/><circle cx="31.5" cy="21" r="1.7"/><path d="M19 37 L16 44"/>',
 about:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="6"/><path d="M24 7 V13 M24 35 V41"/>',
 describe:'<circle cx="24" cy="24" r="17"/><path d="M14 20 H34 M14 28 H27"/>',
 feelword:'<circle cx="24" cy="24" r="17"/><path d="M15 29 q9 8 18 0"/><circle cx="18" cy="19" r="1.4"/><circle cx="30" cy="19" r="1.4"/>',
 pause:'<circle cx="24" cy="24" r="17"/><path d="M19 17 V31 M29 17 V31"/>',
 voice:'<path d="M7 19 H13 L24 10 V38 L13 29 H7Z"/><path d="M31 18 a8 8 0 0 1 0 12 M36 12 a15 15 0 0 1 0 24"/>',
 voiceoff:'<path d="M7 19 H13 L24 10 V38 L13 29 H7Z"/><path d="M32 18 L42 30 M42 18 L32 30"/>',
 thatsit:'<path d="M5 24 H43"/><circle cx="24" cy="24" r="7"/>',
 notquite:'<path d="M5 24 H19 L43 11 M19 24 L43 37"/><circle cx="19" cy="24" r="4.5"/>',
 adjust:'<path d="M5 24 H43"/><circle cx="17" cy="24" r="7"/><path d="M30 19 L36 24 L30 29"/>',
 pressure:'<circle cx="24" cy="24" r="16"/><path d="M24 4 V12 M24 44 V36 M4 24 H12 M44 24 H36"/>',
 density:'<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="4"/>',
 relief:'<path d="M10 33 A17 17 0 1 1 38 33"/><path d="M24 24 V36"/>',
 movement:'<circle cx="24" cy="24" r="17"/><path d="M12 24 q4.5-6 9 0 t9 0 t6 0"/>',
 activation:'<circle cx="24" cy="24" r="10"/><path d="M24 4 V9 M24 39 V44 M4 24 H9 M39 24 H44 M10 10 L13.5 13.5 M34.5 34.5 L38 38 M10 38 L13.5 34.5 M34.5 13.5 L38 10"/>',
 nothing:'<circle cx="24" cy="24" r="17" stroke-dasharray="1 5"/>',
 moved:'<circle cx="16" cy="24" r="9"/><path d="M28 24 H42 M37 19 L42 24 L37 29"/>',
 different:'<circle cx="24" cy="24" r="17"/><path d="M24 7 V41" stroke-dasharray="2 4"/>',
 seeit:'<path d="M4 24 Q24 5 44 24 Q24 43 4 24Z"/><path d="M24 15 V33" />',
 unsure:'<circle cx="24" cy="24" r="17"/><path d="M19 19 q0-6 6-6 t5 5 q0 4-5 6 v3"/><circle cx="25" cy="35" r="1.3"/>',
 stop:'<circle cx="24" cy="24" r="17"/><path d="M18 18 H30 V30 H18Z"/>',
 skip:'<path d="M8 10 L26 24 L8 38Z"/><path d="M34 10 V38"/>',
 back:'<path d="M30 8 L14 24 L30 40"/>',
 arrow:'<path d="M8 24 H38 M28 14 L38 24 L28 34"/>',
 reduce:'<circle cx="24" cy="24" r="17"/><path d="M18 24 H30"/>',
 bothway:'<circle cx="14" cy="24" r="8"/><circle cx="34" cy="24" r="8"/><path d="M22 24 H26"/>',
 // loop stations and the two archetype poles
 warrior:'<path d="M24 5 L40 12 V26 Q40 38 24 44 Q8 38 8 26 V12Z"/><path d="M24 14 V34"/>',
 sage:'<path d="M5 12 Q15 8 24 13 Q33 8 43 12 V37 Q33 33 24 38 Q15 33 5 37Z"/><path d="M24 13 V38"/>',
 sidea:'<circle cx="24" cy="24" r="17"/><path d="M24 7 V41"/><path d="M24 24 H8"/>',
 sideb:'<circle cx="24" cy="24" r="17"/><path d="M24 7 V41"/><path d="M24 24 H40"/>',
 pushthrough:'<path d="M5 24 H33 M24 14 L34 24 L24 34"/><path d="M40 10 V38"/>',
 around:'<path d="M5 30 H14 Q24 30 24 20 Q24 10 34 10 H43"/><circle cx="24" cy="20" r="2.2"/>',
 act:'<path d="M8 24 H36 M27 14 L37 24 L27 34"/>',
 rerun:'<path d="M38 24 A14 14 0 1 1 24 10"/><path d="M24 3 V10 H31"/><circle cx="24" cy="24" r="3"/>',
 truth:'<circle cx="24" cy="24" r="12"/><path d="M24 3 V45"/>',
 separate:'<circle cx="10" cy="24" r="7"/><circle cx="38" cy="24" r="7"/><path d="M24 8 V40"/>',
 side:'<circle cx="15" cy="24" r="9"/><path d="M28 24 H44"/>',
 understand:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="8"/><path d="M24 24 L24 24"/>'
};
function ico(name,size,cls,extra){
 return '<svg class="ic '+(cls||'')+'" width="'+(size||24)+'" height="'+(size||24)+'" viewBox="0 0 48 48" aria-hidden="true" '+(extra||'')+'>'+(ICONS[name]||'')+'</svg>';}

/* Starting points. PROPOSED seat for each: where the field is lit when the
   person picks it. Not an engine mapping; none exists (review, question 3). */
var STARTS=[
 {k:'anxiety',n:'Anxiety',s:2},{k:'anger',n:'Anger',s:3},{k:'overwhelm',n:'Overwhelm',s:5},
 {k:'burnout',n:'Burnout',s:1},{k:'grief',n:'Grief',s:4},{k:'fear',n:'Fear',s:0},
 {k:'relationships',n:'Relationships',s:3},{k:'pain',n:'Pain',s:0},{k:'selfworth',n:'Self-worth',s:2},
 {k:'purpose',n:'Purpose',s:6},{k:'money',n:'Money',s:0},{k:'other',n:'Something else',s:-1}];

/* THE FIELD. 112 ticks, 16 per seat, root at the bottom going clockwise.
   Concentric arcs behind them, one arc per seat, in seat colour. This is the
   Field page's own grammar, drawn at a distance. opts.lit is a list of seat
   indexes that read full; everything else reads quiet. */
function fieldRing(o){
 o=o||{};var cx=o.cx,cy=o.cy,r=o.r,out='',i,k;
 var lit=o.lit||[], quiet=o.quiet==null?.55:o.quiet, tl=o.tl||12, sw=o.sw||2;
 if(o.ticks!==false){
  out+='<g class="ticks">';
  for(i=0;i<112;i++){
   k=Math.floor(i/16); var on=lit.indexOf(k)>-1||(o.litTicks&&o.litTicks.indexOf(i)>-1);
   var a=90+i*360/112+ (360/224);
   var p0=polar(cx,cy,r,a),p1=polar(cx,cy,r+(on?tl*1.7:tl),a);
   out+='<line x1="'+f(p0[0])+'" y1="'+f(p0[1])+'" x2="'+f(p1[0])+'" y2="'+f(p1[1])+'" stroke="'+SEATS[k].c+'" stroke-width="'+(on?sw*1.3:sw)+'" stroke-linecap="round" opacity="'+(on?.95:quiet)+'"/>';
  }
  out+='</g>';}
 if(o.arcs!==false){
  var radii=o.radii||[r*1.2,r*1.44,r*1.72];
  radii.forEach(function(rr,ri){
   for(k=0;k<7;k++){
    var a0=90+k*360/7+2.2+ri*3, a1=90+(k+1)*360/7-2.2+ri*3, on2=lit.indexOf(k)>-1&&ri===0;
    out+='<path d="'+arcPath(cx,cy,rr,a0,a1)+'" fill="none" stroke="'+SEATS[k].c+'" stroke-width="'+(on2?3.2:1.4)+'" stroke-linecap="round" opacity="'+(on2?.85:(.38-ri*.09))+'"/>';
   }});}
 return out;}

/* The trace: five nodes on one path, top right of every onboarding frame. It
   is the Field remembering, and the same five the handoff names. It carries no
   count and no percent. n is how many are lit. */
var TRACE_NAMES=['You said','Atüned noticed','You tested','You worked with it','You observed'];
function trace(n,w){
 w=w||26;var out='<svg viewBox="0 0 '+(w*4+14)+' 14" width="'+(w*4+14)+'" height="14" aria-label="What this session has gathered">';
 out+='<path d="M7 7 H'+(w*4+7)+'" stroke="'+'rgba(255,255,255,.16)'+'" stroke-width="1.4"/>';
 if(n>1)out+='<path d="M7 7 H'+(7+(n-1)*w)+'" stroke="'+ACC+'" stroke-width="1.6"/>';
 for(var i=0;i<5;i++){var on=i<n;
  out+='<circle cx="'+(7+i*w)+'" cy="7" r="'+(on?5:4)+'" fill="'+(on?ACC:'#0C0D12')+'" stroke="'+(on?ACC:'rgba(255,255,255,.3)')+'" stroke-width="1.5"/>';
  if(on)out+='<circle cx="'+(7+i*w)+'" cy="7" r="2" fill="#0C0D12"/>';}
 return out+'</svg>';}
/* ring-not-fill node: a lit node is a ring with a hollow centre */

function leaveBtn(){return '<button class="leave" type="button">'+ico('back',16)+'Leave</button>';}
function setHash(){return (location.hash||'').replace('#','');}
