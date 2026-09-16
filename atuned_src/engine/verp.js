
/* ============================================================
   THE SIX AXES. Three higher gates and three lower gates. This is
   not a display, it is a COST MULTIPLIER on every held pattern.
   A lower gate multiplies what the pattern costs down. A higher
   gate multiplies it up. It moves every CQ in the app.
   ============================================================ */
var VERP=[
 {k:'aware',  nm:'Awareness',  side:'higher', d:'I was present with the sensation.'},
 {k:'detach', nm:'Detachment', side:'higher', d:'I felt it and stayed out of the story.'},
 {k:'intent', nm:'Intention',  side:'higher', d:'It rose and it did not move me off what I was doing.'},
 {k:'ignore', nm:'Ignorance',  side:'lower',  d:'I did not see it coming, or I chose not to look.'},
 {k:'attach', nm:'Attachment', side:'lower',  d:'The story had me. I went with it.'},
 {k:'averse', nm:'Aversion',   side:'lower',  d:'I went around it. I avoided the thing.'}];
var VERPMULT={aware:0.7, detach:0.6, intent:0.75, ignore:1.3, attach:1.35, averse:1.25};
var VERPMIX={aware:0,detach:0,intent:0,ignore:0,attach:0,averse:0};
var VERPCUE={
 aware:['i noticed','i was aware','i felt it','i could feel','present with','i watched'],
 detach:['let it pass','did not take it','stayed out of','let it go','watched it without','did not bite'],
 intent:['kept going','did it anyway','stayed on','finished it','did not stop','carried on'],
 ignore:['did not see','had no idea','did not notice','blindsided','chose not to look','ignored'],
 attach:['could not stop','went with it','took it personally','spiralled','spiraled','it had me','kept going over'],
 averse:['avoided','went around','put it off','changed the subject','walked away','did not want to']};

/* THE LEAN. benign against malignant, read from the story itself. Benign
   language moves toward repair, contact, truth told, weight put down.
   Malignant moves away: blame outward, contempt, concealment, keeping score.
   Not sentiment scoring. Which direction the intention is pointed. */
var LEANCUE={
 benign:['i was wrong','i apologised','i apologized','told the truth','let it go',
  'asked for help','reached out','stayed with','listened','forgave','put it down',
  'owned it','my fault','i chose to','made it right','showed up','said sorry',
  'let them','gave them','i understood','i was honest'],
 malignant:['their fault','they always','they never','should have known',
  'not my problem','i deserved better','made me','if they had','typical of them',
  'i did not tell','kept it to myself','let them think','got them back',
  'they owe me','after everything i','nobody appreciates','i was the only one',
  'proved them wrong','they started it','i had no choice']};
var LEANMIX={benign:0,malignant:0};

/* ---------- the six gates ---------- */
function verpScan(text){
 var src=' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ')+' ';
 var hits={},tot=0;
 Object.keys(VERPCUE).forEach(function(g){hits[g]=0;
  VERPCUE[g].forEach(function(p){var at=src.indexOf(p);
   while(at>=0){hits[g]++;tot++;at=src.indexOf(p,at+1);}});});
 return {hits:hits,total:tot};}
function verpApply(text){var s=verpScan(text);if(!s.total)return s;
 Object.keys(s.hits).forEach(function(g){VERPMIX[g]+=s.hits[g];});return s;}
function verpShare(){
 var tot=Object.keys(VERPMIX).reduce(function(a,k){return a+VERPMIX[k];},0);
 if(!tot) return null;
 var out={};Object.keys(VERPMIX).forEach(function(k){out[k]=VERPMIX[k]/tot;});return out;}
/* THE MULTIPLIER. the weighted average of whichever gates the person runs.
   no story yet means no gate evidence, so it returns 1 and costs nothing. */
function verpFactor(){var sh=verpShare();if(!sh)return 1;
 var f=0;Object.keys(sh).forEach(function(k){f+=sh[k]*VERPMULT[k];});return f;}
function verpRead(){var sh=verpShare();
 return VERP.map(function(v){return {k:v.k,nm:v.nm,side:v.side,d:v.d,mult:VERPMULT[v.k],
  pct: sh?Math.round(sh[v.k]*100):0, n:VERPMIX[v.k]};});}
/* ---------- the lean ---------- */
function leanScan(text){
 var src=' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ')+' ';
 var out={benign:0,malignant:0};
 Object.keys(LEANCUE).forEach(function(k){LEANCUE[k].forEach(function(p){
  var at=src.indexOf(p);while(at>=0){out[k]++;at=src.indexOf(p,at+1);}});});
 return out;}
function leanApply(text){var s=leanScan(text);
 LEANMIX.benign+=s.benign;LEANMIX.malignant+=s.malignant;return s;}
function leanRead(r){
 var fieldMal=Math.max(0,Math.min(100,r.malig||0));
 var tot=LEANMIX.benign+LEANMIX.malignant;
 if(!tot) return {ben:100-fieldMal, mal:fieldMal, src:'field only', cues:0};
 var storyMal=LEANMIX.malignant/tot*100;
 var trust=Math.min(0.62,tot*0.09);
 var mal=fieldMal*(1-trust)+storyMal*trust;
 return {ben:100-mal, mal:mal, src:'field and '+tot+' story cue'+(tot===1?'':'s'), cues:tot};}
