/* onboarding-v2 mockup, round PP. No network, no dependencies, no audio.

   THE SHAPE. One Field (a ring of 112 ticks round the body figure) is drawn on one canvas and never cuts. The intro is
   states on that Field, not pages: the Field changes pose, the text swaps in words, the chips leave the Field and
   return to it. REEL time S.t is local to the state that is running, so a clocked state can be paused, held, seeked,
   jumped into and screenshotted at an exact instant. CSS motion is transform, translate and opacity only.

   WHAT IS REAL AND WHAT IS A STUB is listed in NOTES.md. The short version: the 112 addresses, the seven seat colours and
   the shipped release lines are read from the engine's own tables at build time; the reading is a fourteen word
   lexicon plus the person's own three taps; the distress frame is inert, there is no audio and no account.

   The files in src/js are joined in name order by build.js inside one function. */
(function(){
'use strict';

/* ================================================================ data */
var PAL=['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'];   /* PAL in engine/data/canon.js */
var SEAT=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];               /* the engine's band names */
var NODES=/*NODES*/[]/*END*/;                                                         /* [i, k, band, nerve] x 112, from engine/data/nodes.js */
var BAND=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
var INK=[239,237,232], INK40=[100,100,99], BGC='#06060a';

/* THE FIELD'S PARAMETERS. Five wave modes (2, 3, 5, 7 and 9 lobes round the ring) plus sag, tight, dim, warm and len.
   Each starting point is a profile of those, so the first tap changes how the ring MOVES and not only a label.
   m is the weight of each mode, sag pulls the ring down, tight pulls it in, dim is brightness, warm is a shift of the
   tick colour toward the Sacral amber (at most 35 percent), len is tick length, spd is the drift rate.
   STUB: no engine table maps a topic to a shape of movement. These are an animator's reading, and are the part the
   owner is most likely to retune. */
var BASE={m:[.12,.1,.06,.04,.02],sag:0,tight:0,dim:1,warm:0,len:1,spd:1};
var STARTS=[
 {k:'anxiety',n:'Anxiety',s:0,f:{m:[0,.2,.5,.9,1],spd:1.5,tight:.2}},
 {k:'anger',n:'Anger',s:2,f:{m:[.9,.5,0,0,0],spd:.8,tight:.4,warm:.5}},
 {k:'overwhelm',n:'Overwhelm',s:2,f:{m:[.2,.5,.8,.9,.6],spd:1}},
 {k:'burnout',n:'Burnout',s:2,f:{m:[.15,.1,0,0,0],spd:.3,sag:.4,dim:.45}},
 {k:'grief',n:'Grief',s:3,f:{m:[.6,.2,0,0,0],spd:.25,sag:.8,dim:.8}},
 {k:'fear',n:'Fear',s:0,f:{m:[.1,.3,.9,.4,0],spd:1,tight:.7}},
 {k:'relationships',n:'Relationships',s:3,f:{m:[1,0,.3,0,0],spd:.5}},
 {k:'pain',n:'Pain',s:0,f:{m:[.3,.3,.3,.3,.3],spd:.4,len:1.2}},
 {k:'selfworth',n:'Self-worth',s:1,f:{m:[.2,.3,0,0,0],spd:.5,tight:.5,sag:.5,dim:.75}},
 {k:'purpose',n:'Purpose',s:6,f:{m:[.3,.2,0,0,0],spd:.4,tight:-.2,warm:.3}},
 {k:'money',n:'Money',s:0,f:{m:[.3,0,.5,0,0],spd:.6,tight:.3}},
 {k:'other',n:'Something else',s:-1,f:{m:[.3,.3,.3,0,0],spd:.5}}];

/* The feeling words. Each one bends the profile: amp multiplies the modes, spd multiplies the drift, the rest add. */
var FEELS=[
 {k:'heavy',n:'Heavy',f:{amp:.8,spd:.6,sag:.7,dim:.9}},
 {k:'tight',n:'Tight',f:{amp:.7,spd:1.1,tight:.6,hi:1.5}},
 {k:'numb',n:'Numb',f:{amp:.3,spd:.4,dim:.35}},
 {k:'restless',n:'Restless',f:{amp:1.2,spd:1.8,hi:1.4}},
 {k:'hollow',n:'Hollow',f:{amp:.8,spd:.7,len:.5,dim:.6}},
 {k:'hot',n:'Hot',f:{amp:1.2,spd:1.2,warm:1,len:1.4}}];

/* The seven body places, one on each seat. s is the seat index in SEAT. The plain word is what the person taps. */
var PLACES=[
 {s:6,n:'Head',seat:'Crown'},{s:5,n:'Forehead',seat:'3rd Eye'},{s:4,n:'Throat',seat:'Throat'},{s:3,n:'Chest',seat:'Heart'},
 {s:2,n:'Stomach',seat:'Solar'},{s:1,n:'Belly',seat:'Sacral'},{s:0,n:'Pelvis',seat:'Root'}];
function placeOf(s){for(var i=0;i<PLACES.length;i++)if(PLACES[i].s===s)return PLACES[i];return null;}
/* words a person may use to correct a place or a feeling. The correction line is read against these and the lexicon. */
var PLACE_WORDS={head:6,crown:6,mind:6,forehead:5,eyes:5,throat:4,neck:4,jaw:4,shoulders:3,chest:3,heart:3,lungs:3,ribs:3,stomach:2,gut:2,belly:1,abdomen:1,pelvis:0,hips:0,groin:0,legs:0,feet:0};
var FEEL_WORDS={heavy:0,weight:0,weighed:0,tight:1,tense:1,clenched:1,numb:2,flat:2,restless:3,jumpy:3,wired:3,hollow:4,empty:4,hot:5,burning:5,angry:5};

/* the stub reading. Values are the engine's own LEX entries (seat, amount), fourteen of the real words. */
var LEX={afraid:[0,16],panicking:[0,28],exhausted:[2,26],snapped:[2,22],angry:[2,18],mortified:[1,26],criticised:[1,22],
 grief:[3,26],lonely:[3,20],sad:[3,16],interrupted:[4,20],betrayed:[4,28],overthinking:[5,22],pointless:[6,22]};

var LOOP=['Discover','Play','Flow','Embody'];

/* The release, SHORTENED for the mockup and labelled so on screen. The real table is in REAL. */
var REL={gift:.6,caps:[3.6,6.6,9.6,13.6],stem:16.6,own:18.4,hint:21.0,lines0:23.0,lineLen:2.0,n:12,settle0:47.0,settleLen:10.0};
REL.end=REL.settle0+REL.settleLen;
var REL_WELCOME=['Sit down. Put both feet on the floor.','Move your awareness inside your body.',
 'Take one deep breath. Feel what your body is doing mechanically.','Keep your awareness inside your body.'];
var REL_SETTLE_LINE='Keep your awareness inside your body for two minutes.';
var ENTRY=['I let go of ','I give up ','I forgive myself for '];
/* seconds, the silent column of the narrative cue table, plus the new feel, body and mirror beats (design time, not measured on a person) */
var REAL={pick:5,feel:8,body:8,settle:11.5,story:30,mirror:22,open:38.5,lines:48,relsettle:120,b:11};
var GIFT_START=100;                                              /* STUB for the engine's gift number */
var SIG=[['Bring your attention to your throat.',3.5],['Think yes, ten times. Notice how it feels there.',12],['Now think no, ten times. Notice how that feels.',12]];
var SIG_LEN=SIG.reduce(function(a,s){return a+s[1];},0);

var ICONS={
 anxiety:'<circle cx="22" cy="24" r="12"/><circle cx="27" cy="24" r="12" opacity=".5"/>',
 overwhelm:'<circle cx="18.5" cy="20" r="9"/><circle cx="29.5" cy="20" r="9"/><circle cx="24" cy="29.5" r="9"/>',
 anger:'<circle cx="24" cy="24" r="17"/><path d="M27 11 L20 25 L28 25 L21 37"/>',
 burnout:'<path d="M24 7 A17 17 0 1 1 7 24"/><circle cx="10" cy="16.5" r="1.3"/><circle cx="15.5" cy="10.5" r="1.3"/>',
 pain:'<circle cx="24" cy="24" r="17"/><path d="M2 24 H21"/><circle cx="24" cy="24" r="3"/>',
 grief:'<circle cx="24" cy="19" r="12"/><path d="M24 31 V39"/><circle cx="24" cy="43" r="1.4"/>',
 fear:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="3.5"/><path d="M24 10 V16 M24 38 V32 M10 24 H16 M38 24 H32"/>',
 relationships:'<circle cx="13" cy="24" r="8"/><circle cx="35" cy="24" r="8"/><path d="M21 24 H27"/>',
 selfworth:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="31" r="5"/>',
 money:'<circle cx="24" cy="24" r="17"/><path d="M16 20 H32 M16 28 H32"/>',
 purpose:'<circle cx="24" cy="24" r="17"/><path d="M24 24 L36 12"/><circle cx="36" cy="12" r="2.4"/>',
 other:'<circle cx="24" cy="24" r="17" stroke-dasharray="3 5.2"/><circle cx="24" cy="24" r="2.2"/>',
 heavy:'<circle cx="24" cy="24" r="17"/><path d="M14 33 H34"/>',
 tight:'<path d="M9 14 Q24 24 9 34 M39 14 Q24 24 39 34"/>',
 numb:'<circle cx="24" cy="24" r="17" stroke-dasharray="2 4.5"/>',
 restless:'<circle cx="15" cy="17" r="4"/><circle cx="32" cy="22" r="4"/><circle cx="20" cy="33" r="4"/>',
 hollow:'<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="8" stroke-dasharray="2 3.4"/>',
 hot:'<circle cx="24" cy="24" r="10"/><path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M10 10 L14 14 M34 34 L38 38 M38 10 L34 14 M10 38 L14 34"/>',
 guest:'<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="18" stroke-dasharray="2 4.5"/>',
 pause:'<path d="M17 13 V35 M31 13 V35"/>',
 play:'<path d="M17 12 L36 24 L17 36Z"/>',
 sound:'<path d="M8 19 H15 L24 11 V37 L15 29 H8Z"/><path d="M31 17 Q37 24 31 31"/>',
 muted:'<path d="M8 19 H15 L24 11 V37 L15 29 H8Z"/><path d="M32 18 L42 30 M42 18 L32 30"/>'};
function ico(n,s){return '<svg class="ic" width="'+(s||24)+'" height="'+(s||24)+'" viewBox="0 0 48 48" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}

/* ================================================================ helpers */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function lerp(a,b,u){return a+(b-a)*u;}
function bez(x1,y1,x2,y2){
 var cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 function X(t){return ((ax*t+bx)*t+cx)*t;} function Y(t){return ((ay*t+by)*t+cy)*t;}
 function dX(t){return (3*ax*t+2*bx)*t+cx;}
 return function(x){
  if(x<=0)return 0; if(x>=1)return 1;
  var t=x,i,e,d;
  for(i=0;i<8;i++){e=X(t)-x; if(Math.abs(e)<1e-5)break; d=dX(t); if(Math.abs(d)<1e-6)break; t-=e/d;}
  if(Math.abs(X(t)-x)>1e-4||t<0||t>1){var lo=0,hi=1;t=x;for(i=0;i<24;i++){if(X(t)<x)lo=t;else hi=t;t=(lo+hi)/2;}}
  return Y(t);};}
var EOUT=bez(.22,1,.36,1), EIN=bez(.4,0,1,1), ELAND=bez(.34,1.56,.64,1), EDRAW=bez(.45,0,.15,1), EIO=bez(.45,0,.55,1);
function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
function hex(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];}
function mix(a,b,u){return 'rgb('+Math.round(lerp(a[0],b[0],u))+','+Math.round(lerp(a[1],b[1],u))+','+Math.round(lerp(a[2],b[2],u))+')';}
function mixA(a,b,u,al){return 'rgba('+Math.round(lerp(a[0],b[0],u))+','+Math.round(lerp(a[1],b[1],u))+','+Math.round(lerp(a[2],b[2],u))+','+al.toFixed(3)+')';}
var PALRGB=PAL.map(hex), AMBER=PALRGB[1];
function words(s){return (String(s).match(/[A-Za-z0-9'’-]+/g)||[]);}
function cap1(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function smooth(x){x=clamp(x,0,1);return x*x*(3-2*x);}
/* a small seeded generator, so the motes are in the same place every run and a screenshot is the same picture twice */
function rng(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}

/* The time line, computed and never typed. It is the sum of the measured design path and it is printed in words,
   rounded to the nearest minute. Round PP: it prints whatever it measures, because the new path is longer than the old
   rule's window (240 s plus or minus 30) and a computed line that hides itself is a worse lie than a longer one. */
function pathSeconds(){return REAL.pick+REAL.feel+REAL.body+REAL.settle+REAL.story+REAL.mirror+REAL.open+REAL.lines+REAL.relsettle+REAL.b;}
function timeLine(){
 var s=pathSeconds(),m=Math.max(1,Math.round(s/60)),w=['zero','one','two','three','four','five','six','seven','eight'];
 return 'About '+(w[m]||m)+' minutes. Stop any time.';}
