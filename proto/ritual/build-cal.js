/* Assembles the calendar into one standalone HTML file. Everything inlined:
   no stylesheet, no script, no font, no sibling and no network request of any
   kind, which is the constraint source.html itself is held to.

   build.js is left alone. It still builds the three parked designs. */
const fs=require('fs'), path=require('path'), D=__dirname;
const R=f=>fs.readFileSync(path.join(D,f),'utf8');
const data=R('cal.json'), css=R('_shell.css'), js=R('_common.js'), body=R('_CAL.html');
const out='calendar.html';

const h='<!doctype html><html lang="en"><head><meta charset="utf-8">'
 +'<meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>Ritual, the calendar</title><style>\n'+css+'\n</style></head><body>\n'
 +body.replace(/<script>/,'<script>\n'+js+'\nvar DATA='+data+';\n')
 +'\n</body></html>';

/* THE NETWORK CHECK IS A CHECK, NOT AN ASSUMPTION. Anything that could pull a
   byte off a wire fails the build here, and the screenshot run watches the
   request log on top of it. */
const BAD=[[/<(?:script|img|iframe|video|audio|source|embed|object)[^>]*\ssrc\s*=/i,'a src attribute'],
 [/<link[^>]*\shref\s*=/i,'a link href'],
 [/@import/i,'a css @import'],
 [/url\(\s*['"]?(?:https?:)?\/\//i,'a remote url() in css'],
 [/\b(?:fetch|XMLHttpRequest|EventSource|WebSocket|importScripts|navigator\.sendBeacon)\b/,'a network call'],
 [/https?:\/\//,'an absolute http url']];
let bad=0;
BAD.forEach(([re,what])=>{const m=h.match(re);
 if(m){bad++;console.error('  FAIL  '+out+' carries '+what+': '+JSON.stringify(m[0].slice(0,70)));}});
if(bad){console.error(bad+' network references. refusing to write.');process.exit(1);}

/* DIV BALANCE, ON THE STATIC MARKUP ONLY, AND THE REASON IS A FALSE FAILURE
   THIS CHECK ALREADY PRODUCED. Counting div tags across the whole file counts
   both arms of every branch in a template string, so dayView's two returns,
   which each close the same section once, read as one close too many. The
   count is only meaningful where there are no branches. The real check on the
   rendered tree is a parse round trip and it runs in the browser, in
   shots-cal.js, where a repaired tag actually shows up. */
const stat=body.split('<script>')[0];
const opens=(stat.match(/<div\b/g)||[]).length, closes=(stat.match(/<\/div>/g)||[]).length;
if(opens!==closes){console.error('  FAIL  static div balance: '+opens+' open, '+closes+' close');
 process.exit(1);}
if(/—/.test(h)){console.error('  FAIL  em dash in '+out);process.exit(1);}

fs.writeFileSync(path.join(D,out),h);
console.log(out.padEnd(15)+(h.length/1024).toFixed(1)+' kB   '
 +'divs '+opens+' balanced, no network reference, no em dash');
