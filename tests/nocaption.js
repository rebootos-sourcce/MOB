const {chromium}=require('playwright');const path=require('path');
/* ============================================================
   NO CAPTION LINES. Ruled 27 November, CO-33, the fifth logged time.

   His words: "Get rid of all the text that says an axis is a line from a
   feeling to its opposite... all that is junk. Strip it out. Everywhere...
   I keep telling you not to have it. You keep adding it."

   A caption is a line on the screen ABOUT the screen and not about the
   person: it says what a thing is, how it is drawn, counted, scored or
   sourced, or what to do with it, and it shows without anyone pressing
   anything. The test is to cover the line. If the person loses no fact about
   themselves, their data or what just happened, it was junk, and its meaning
   belongs in gloss.js as the label's tooltip.

   WHY THIS READS THE RENDERED PAGE AND NOT THE SOURCE. The four earlier
   sweeps (CO-16, CO-27, CO-28, CO-32) were patterns over strings, and each
   one missed the next caption, because a caption is a shape on a screen:
   muted, small, three words or more, sitting under something bold. No regex
   sees that, and a string is only a caption once it is rendered next to a
   label. So this walks every tab in a real Chromium and measures the shape.

   An element is flagged when ALL of these hold:
     its own text (not a child's) is three words or more and not a question;
     it is not a short value carrying a digit (a figure, a date, a count);
     it is not inside a button, label, link, tooltip, role=status or
       aria-live, or a drill the person opened (#rdrill);
     its contrast is under 0.72 of body text, so it reads as secondary;
     it sits next to a label (bold, a heading, or 15px and up) OR is 13.5px
       or smaller, which is the size a caption is set in.

   A KEEPER OPTS OUT BY NAME with data-say="reading|empty|refusal|status|
   disclosure|value|question|name|label". Those are the only things a
   surface may say: the question, a name, a value, a reading about the
   person, an empty state or refusal that names what puts it in, a status()
   report, and a disclosure about their data. Declaring one is a claim the
   reviewer can read, which is the point.

   REPORT ONLY, 27 November. It prints the flagged lines per tab and exits 0
   on them. Only its own self checks can fail the run: a tool that lies is
   worse than no tool, so a known bad fixture (label, caption, question) must
   be caught and a known good one (label with a tooltip, a question, a
   declared empty state, a value) must pass, before any tab is believed.
   NOCAPTION_STRICT=1 makes a flagged line fail, which is the form the gate
   takes when it is promoted into the required list.

   The same sweep that landed this gate removed the captions on the tabs
   nobody else was rebuilding, so the counts it prints are the measure of
   what is left on the others.
   ============================================================ */
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const STRICT=process.env.NOCAPTION_STRICT==='1';
const SAY=['reading','empty','refusal','status','disclosure','value','question','name','label'];
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
 catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}};
let PASS=0,FAIL=0;const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

/* Runs inside the page. arg.sel scopes it, arg.say is the opt out vocabulary. */
function scan(arg){
 var KEEP=arg.say.map(function(s){return '[data-say="'+s+'"]';}).join(',');
 function lum(c){var m=c.match(/[\d.]+/g);if(!m)return 1;var v=m.slice(0,3).map(Number);
  if(/color\(srgb/.test(c))v=v.map(function(x){return x*255;});
  v=v.map(function(x){x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);});
  return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];}
 /* the first painted background up the tree, so a muted line on a card is
    measured against the card and not against the page behind it */
 function bgOf(e){for(var x=e;x;x=x.parentElement){var b=getComputedStyle(x).backgroundColor;
  if(b&&!/rgba\(0, 0, 0, 0\)|transparent/.test(b))return b;}return getComputedStyle(document.body).backgroundColor;}
 function contrast(a,b){var A=lum(a),B=lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05);}
 var ink=getComputedStyle(document.body).color,
     inkC=contrast(ink,getComputedStyle(document.body).backgroundColor);
 function vis(e){var s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;
  var r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.right>0&&r.left<innerWidth;}
 function own(e){var t='';for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3)t+=n.nodeValue;
  return t.replace(/\s+/g,' ').trim();}
 function isLabel(e){if(!e||!vis(e))return false;
  if(/^H[1-6]$|^LEGEND$|^SUMMARY$/.test(e.tagName))return true;
  var t=(e.innerText||'').replace(/\s+/g,' ').trim(),w=t?t.split(' ').length:0,s=getComputedStyle(e);
  return w>0&&w<=5&&(+s.fontWeight>=550||parseFloat(s.fontSize)>=15||/^(B|STRONG|EM)$/.test(e.tagName)||
   !!e.querySelector('b,strong,em,svg'));}
 /* a label sits above the line, as a sibling of it or of one of its first
    three ancestors, which is how a row, a card and a section are built */
 function nearLabel(e){
  for(var x=e,d=0;x&&d<3;x=x.parentElement,d++){var p=x.previousElementSibling;
   for(var k=0;p&&k<2;p=p.previousElementSibling,k++){
    if(isLabel(p))return (p.innerText||'').replace(/\s+/g,' ').trim().slice(0,40);
    var l=p.querySelectorAll&&[].slice.call(p.querySelectorAll('h1,h2,h3,h4,b,strong,em,summary')).pop();
    if(l&&isLabel(l))return (l.innerText||'').trim().slice(0,40);}}
  return '';}
 var root=arg.sel?document.querySelector(arg.sel):document.body,out=[];
 if(!root)return out;
 root.querySelectorAll('*').forEach(function(e){
  if(/^(SCRIPT|STYLE|NOSCRIPT|BUTTON|INPUT|TEXTAREA|SELECT|OPTION|LABEL|A)$/.test(e.tagName))return;
  if(e.closest('svg,#tip,#rdrill,[role=status],[role=alert],[aria-live],button,label,a,blockquote,.status,'+KEEP))return;
  var t=own(e);if(!t)return;var w=t.split(' ');
  if(w.length<3)return;if(/\?$/.test(t))return;
  if((t.match(/[A-Za-z]/g)||[]).length<t.length*0.5)return;
  if(/\d/.test(t)&&w.length<=6)return;                 /* a value, a date, a figure */
  if(!vis(e))return;var s=getComputedStyle(e);
  /* AN EYEBROW IS A LABEL, NOT A CAPTION. Small, muted and three words or more
     ("Light and breath", "The seven assemblage points") is what a section
     name looks like when it is set as a small heading, and the first run of
     this gate flagged a dozen of them. It is told by its own styling: the
     house sets a heading eyebrow in capitals or in the pm-eye class (or in a
     tooltip carrier inside one, which is how a label gets its meaning), and a
     sentence of prose is never either. */
  if(s.textTransform==='uppercase'||e.closest('.pm-eye'))return;
  var c=contrast(s.color,bgOf(e)),muted=c<inkC*0.72,lab=nearLabel(e),small=parseFloat(s.fontSize)<=13.5;
  if(muted&&(lab||small))out.push({text:t.slice(0,160),fs:parseFloat(s.fontSize),ratio:+(c/inkC).toFixed(2),label:lab,
   cls:e.tagName.toLowerCase()+'.'+String(e.className||'').trim().split(/\s+/).join('.'),tipped:!!e.closest('[data-tip]')});});
 return out;}

(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(b);
const p=await b.newPage({viewport:{width:1600,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message||e)));
await p.addInitScript(require('./seed.js').FULL_SIGHT);
await p.goto(FILE,{waitUntil:'load'});await booted(p);await p.waitForTimeout(1200);

console.log('=== self checks: the tool, before the product ===');
/* A KNOWN BAD FIXTURE, shaped like the Intake row that started this: a label,
   a muted caption under it, and the question. It must be caught. */
await p.evaluate(()=>{
 var d=document.createElement('section');d.id='nc-bad';d.style.cssText='position:relative;z-index:9';
 d.innerHTML='<div><em style="font-weight:600">Fear</em></div>'
  +'<div style="color:var(--mid);font-size:13.5px">The body braces against a threat, real or not.</div>'
  +'<div>How often does your gut clench?</div>';
 (document.querySelector('.stage')||document.body).prepend(d);
 /* A KNOWN GOOD FIXTURE: the same label carrying its meaning as a tooltip, a
    question, a declared empty state, a value, a status and a drill. None may
    be flagged, or the gate would fail the keepers the ruling protects. */
 var g=document.createElement('section');g.id='nc-good';
 g.innerHTML='<div><em style="font-weight:600" data-tip="Fear is one end of an axis.">Fear</em></div>'
  +'<div>How often does your gut clench?</div>'
  +'<p style="color:var(--mid);font-size:13px" data-say="empty">Nothing has been read yet. Write a story.</p>'
  +'<span style="color:var(--mid);font-size:12px">72%, 3 addresses held</span>'
  +'<div role="status" style="color:var(--mid);font-size:12px">Saved to this device just now.</div>';
 (document.querySelector('.stage')||document.body).prepend(g);});
const bad=await p.evaluate(scan,{sel:'#nc-bad',say:SAY}),good=await p.evaluate(scan,{sel:'#nc-good',say:SAY});
ok(bad.length===1&&/braces/.test(bad[0].text),'known bad: the caption under Fear is caught '+JSON.stringify(bad));
ok(good.length===0,'known good: a tooltip label, a question, a declared empty state, a value and a status pass '+JSON.stringify(good));
await p.evaluate(()=>{['nc-bad','nc-good'].forEach(i=>{var e=document.getElementById(i);if(e)e.remove();});});
console.log('  fixtures: '+PASS+' passed, '+FAIL+' failed');

const TABS=await p.evaluate(()=>{var a=TABDEF.map(t=>[t.nm,t.k]);
 Object.keys(TABEXTRA).forEach(k=>a.push([TABEXTRA[k].nm,TABEXTRA[k].k]));return a;});
ok(TABS.length>=9,'TABDEF and TABEXTRA name every surface, read '+TABS.length);
const res={};let flagged=0;
for(const who of ['blank','loaded']){
 if(who==='loaded'){
  /* the heaviest person in the roster is looked up by name and falls back to
     the last one, so a roster that grows or renames does not blank this walk */
  await p.evaluate(()=>{var i=PEOPLE.findIndex(x=>x.nm==='Lance 85');loadP(i<0?PEOPLE.length-1:i);});
  await p.waitForTimeout(800);}
 for(const [nm,k] of TABS){
  /* a tab is entered by identity, never by position, and any drill a
     previous tab left open is closed so it cannot be read as this surface */
  await p.evaluate(k=>{try{rdClose();}catch(e){}setTab(k);},k);await p.waitForTimeout(700);
  const len=await p.evaluate(()=>document.body.innerText.length);
  ok(len>0,who+'/'+nm+': the surface rendered text');
  const f=await p.evaluate(scan,{sel:'body',say:SAY});
  res[who+'|'+nm]=f;flagged+=f.length;}}
ok(errs.length===0,'no page errors during the walk '+errs.slice(0,2).join(' / '));

console.log('\n=== flagged caption lines per tab (report only) ===');
console.log('  '+'tab'.padEnd(16)+'blank'.padStart(6)+'loaded'.padStart(8));
for(const [nm] of TABS){
 const a=res['blank|'+nm]||[],c=res['loaded|'+nm]||[];
 console.log('  '+nm.padEnd(16)+String(a.length).padStart(6)+String(c.length).padStart(8));}
for(const [nm] of TABS){
 const seen=new Set();
 ['blank','loaded'].forEach(w=>(res[w+'|'+nm]||[]).forEach(x=>{
  if(seen.has(x.text))return;seen.add(x.text);
  if(seen.size===1)console.log('\n  '+nm);
  console.log('    ['+x.fs+'px '+x.ratio+(x.tipped?' tipped':'')+'] '+(x.label?x.label+' | ':'')+x.text);}));}
console.log('\n  '+flagged+' flagged across both profiles'+(STRICT?'':', report only, not counted as failures'));
if(STRICT)ok(flagged===0,flagged+' caption lines flagged');
await b.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);})();
