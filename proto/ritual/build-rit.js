/* Assembles the ritual page into one standalone HTML file. Everything
   inlined: no stylesheet, no script, no font, no sibling and no network
   request of any kind, which is the constraint source.html itself is held to.

   build.js and build-cal.js are left alone. calendar.html is the before and
   it still builds. */
const fs=require('fs'), path=require('path'), D=__dirname;
const R=f=>fs.readFileSync(path.join(D,f),'utf8');
const data=R('rit.json'), css=R('_rit.css'), body=R('_RIT.html');
const out='ritual.html';

const h='<!doctype html><html lang="en"><head><meta charset="utf-8">'
 +'<meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>Ritual</title><style>\n'+css+'\n</style></head><body>\n'
 +body.replace(/<script>/,'<script>\nwindow.RITDATA='+data+';\n')
 +'\n</body></html>';

/* THE NETWORK CHECK IS A CHECK, NOT AN ASSUMPTION. Anything that could pull a
   byte off a wire fails the build here, and the screenshot run watches the
   request log on top of it.

   SpeechRecognition is in the list, and it is the one addition over
   build-cal.js. The record button is on this page by RJ2 and browser speech
   recognition is a network service by RJ3, so the control says what it would
   do and this gate proves that the page does not then do it. A privacy
   ruling that is only written in a comment is not a ruling. */
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
   file counts both arms of every branch in a template string, so a function
   with two returns that each close the same section reads as one close too
   many. The real check on the rendered tree is a parse round trip and it runs
   in the browser, in shots-rit.js, where a repaired tag actually shows up. */
const stat=body.split('<script>')[0];
const opens=(stat.match(/<div\b/g)||[]).length, closes=(stat.match(/<\/div>/g)||[]).length;
if(opens!==closes){console.error('  FAIL  static div balance: '+opens+' open, '+closes+' close');
 process.exit(1);}
if(/—/.test(h)){console.error('  FAIL  em dash in '+out);process.exit(1);}

/* ALL CAPS IN COPY. tests/design.js gate 4 watches it in the build and it is
   the single loudest thing that made the calendar look like another product.
   The wordmark is the one initialism on the page and it is exempt by name. */
const caps=[];
stat.replace(/>([^<>]{3,})</g,(m,txt)=>{
 const t=txt.trim();
 if(/^[A-Z][A-Z ·]{2,}$/.test(t)&&t!=='ATUNED')caps.push(t);
 return m;});
/* the check reads the rules and not the comments. The first cut failed on
   this file's own note about the defect it is guarding against, which is a
   tool lying about a known good case. */
const cssRules=css.replace(/\/\*[\s\S]*?\*\//g,'');
if(/text-transform\s*:\s*uppercase/i.test(cssRules)){
 console.error('  FAIL  the stylesheet sets text-transform:uppercase. The '
  +'product’s label role is capitalize at letter-spacing zero.');
 process.exit(1);}
if(caps.length){console.error('  FAIL  all caps in copy: '+caps.join(' | '));
 process.exit(1);}

fs.writeFileSync(path.join(D,out),h);
console.log(out.padEnd(13)+(h.length/1024).toFixed(1)+' kB   '
 +'divs '+opens+' balanced, no network reference, no microphone, no em dash, '
 +'no all caps');
