/* Assembles the second rebuild of the ritual page into one standalone HTML
   file. Everything inlined: no stylesheet, no script, no font, no sibling and
   no network request of any kind, which is the constraint source.html itself
   is held to.

   build-rit.js is left alone and ritual.html still builds, so the C minus is
   still there to diff against. */
const fs=require('fs'), path=require('path'), D=__dirname;
const R=f=>fs.readFileSync(path.join(D,f),'utf8');
const data=R('rit.json'), css=R('_rit2.css'), body=R('_RIT2.html');
const out='ritual2.html';

const h='<!doctype html><html lang="en"><head><meta charset="utf-8">'
 +'<meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>Ritual</title><style>\n'+css+'\n</style></head><body>\n'
 +body.replace(/<script>/,'<script>\nwindow.RITDATA='+data+';\n')
 +'\n</body></html>';

/* THE NETWORK CHECK IS A CHECK, NOT AN ASSUMPTION. Anything that could pull a
   byte off a wire fails the build here, and the screenshot run watches the
   request log on top of it. SpeechRecognition is in the list because the
   record control is on this page and browser speech recognition is a network
   service: the control says what it would do and this gate proves that the
   page does not then do it. */
const BAD=[[/<(?:script|img|iframe|video|audio|source|embed|object)[^>]*\ssrc\s*=/i,'a src attribute'],
 [/<link[^>]*\shref\s*=/i,'a link href'],
 [/@import/i,'a css @import'],
 [/url\(\s*['"]?(?:https?:)?\/\//i,'a remote url() in css'],
 [/\b(?:fetch|XMLHttpRequest|EventSource|WebSocket|importScripts|navigator\.sendBeacon)\b/,'a network call'],
 [/\b(?:webkitSpeechRecognition|SpeechRecognition|getUserMedia|MediaRecorder)\b/,'a microphone or speech service'],
 [/https?:\/\//,'an absolute http url']];
let bad=0;
BAD.forEach(([re,what])=>{const m=h.match(re);
 if(m){bad++;console.error('  FAIL  '+out+' carries '+what+': '+JSON.stringify(m[0].slice(0,70)));}});
if(bad){console.error(bad+' network references. refusing to write.');process.exit(1);}

/* DIV BALANCE, ON THE STATIC MARKUP ONLY. Counting div tags across the whole
   file counts both arms of every branch in a template string. The real check
   on the rendered tree is a parse round trip and it runs in the browser. */
const stat=body.split('<script>')[0];
const opens=(stat.match(/<div\b/g)||[]).length, closes=(stat.match(/<\/div>/g)||[]).length;
if(opens!==closes){console.error('  FAIL  static div balance: '+opens+' open, '+closes+' close');
 process.exit(1);}
if(/—/.test(h)){console.error('  FAIL  em dash in '+out);process.exit(1);}

/* ALL CAPS IN COPY. The wordmark is the one initialism on the page. */
const caps=[];
stat.replace(/>([^<>]{3,})</g,(m,txt)=>{
 const t=txt.trim();
 if(/^[A-Z][A-Z ·]{2,}$/.test(t)&&t!=='ATUNED')caps.push(t);
 return m;});
const cssRules=css.replace(/\/\*[\s\S]*?\*\//g,'');
if(/text-transform\s*:\s*uppercase/i.test(cssRules)){
 console.error('  FAIL  the stylesheet sets text-transform:uppercase.');
 process.exit(1);}
if(caps.length){console.error('  FAIL  all caps in copy: '+caps.join(' | '));
 process.exit(1);}

/* THE ONE WORD RULE, AS A GATE. His words: "Instead of 85 days kept, just one
   word. Recurring, missed, active, streak."

   The figure tile's label is one word. It was a sentence and it had a second
   sentence under it, and five tiles became five paragraphs. A gate rather
   than a habit, because the two rules that collided to produce it are both
   his and both still stand. It reads the labels out of the built script by
   the shape drawFigures writes them in, so a sentence cannot come back. */
const kMatch=[...body.matchAll(/n:[^,]+,\s*k:'([^']*)'/g)].map(m=>m[1]);
if(!kMatch.length){console.error('  FAIL  no figure labels found, so the one '
 +'word gate is reading nothing and cannot be trusted');process.exit(1);}
const longLabels=kMatch.filter(k=>k.trim().split(/\s+/).length>1);
if(longLabels.length){
 console.error('  FAIL  a figure label is more than one word: '
  +longLabels.map(l=>JSON.stringify(l)).join(', '));process.exit(1);}

/* AND THE COUNT STATED TO USERS IS 112. The voice gate carries it too, and
   this build refuses rather than relying on a pass that might not be run. */
if(/\b108\b/.test(h)){console.error('  FAIL  '+out+' prints 108');process.exit(1);}

fs.writeFileSync(path.join(D,out),h);
console.log(out.padEnd(13)+(h.length/1024).toFixed(1)+' kB   '
 +'divs '+opens+' balanced, no network reference, no microphone, no em dash, '
 +'no all caps, '+kMatch.length+' figure labels and every one is one word: '
 +kMatch.join(', '));
