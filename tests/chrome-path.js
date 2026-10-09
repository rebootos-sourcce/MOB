/* THE CHROMIUM PATH, HELD TO ONE EXPRESSION. Every browser gate launched
   /opt/pw-browsers/chromium-1194/chrome-linux/chrome as a bare literal. That
   is this sandbox's own Playwright install, and a GitHub Actions runner has
   no such path, so not one browser gate could launch in CI: each would die
   at chromium.launch before its first check, which reads as the gate being
   broken when it is only the machine that differs.

   The fix is one expression, process.env.CHROME || '<that path>', so the
   sandbox runs exactly as before with CHROME unset and CI points CHROME at
   its own browser. This scan holds tests/, tools/ and funnel/ to it, by two
   rules, and prints each breach as FAIL file:line with the rule it broke.
   It has to be a scan and not a habit, because a bare literal that slips
   back in still passes here, where every gate is written and run, and only
   breaks on the runner nobody is watching.

   THE FIRST CUT LOOKED FOR ONE VERSION NUMBER, AND THAT WAS THE HOLE. Its
   needle was chromium-1194 and nothing else, so the sandbox's next
   Playwright bump, chromium-1200, walked straight past it, and so did
   chromium_headless_shell-1194, a path built as '/opt/pw-browsers/chromium-'
   plus a revision, and one put together by path.join out of 'pw-browsers'
   and 'chrome-linux'. Review B found each of them passing. So the first rule
   is: a line that, with every approved expression cut out of it, still names
   pw-browsers, chromium- and a digit, chromium_headless_shell or
   chrome-linux is an offender. The needle is pw-browsers and not
   /opt/pw-browsers because path.join writes the directory without a slash.

   AND A LAUNCH WITH NO PATH AT ALL GAVE THE FIRST RULE NOTHING TO FIND.
   tests/valuefeltui.js and tests/recordlink.js called chromium.launch() with
   no options, so they took Playwright's own default browser and never read
   CHROME, and a scan for a bad path passed them because there was no path in
   them to be bad. So the second rule is: every chromium.launch or
   chromium.launchPersistentContext in a .js file carries executablePath
   inside its own parentheses. The call is read to its matching close paren
   across lines, because tests/funnel.js and funnel/words.js put the options
   on the line after the call. Comments, strings and regex literals are
   blanked first, newlines kept so the line numbers hold, so that a comment
   explaining a bare chromium.launch() is not a call, a paren inside a string
   does not close one, and executablePath written in a comment inside the
   call does not count as passing it. Whether a slash opens a regex is the
   usual guess from the character before it, and a quote or a regex is never
   read past the end of its own line, so a wrong guess costs one line and not
   the rest of the file.

   Two spacings are approved, || bare and || with a space each side, because
   the files it covers are written both ways and the replacement keeps each
   line's own idiom. Nothing else is: a double quoted path, the fallback
   written first, or a different binary under chromium-1194 all fail.

   The root is this file's own parent and never the working directory, so a
   run from the wrong place cannot pass by scanning nothing, and a missing
   directory fails by name for the same reason. node_modules is skipped, and
   so is this file, which has to name the path in order to look for it.
   Symbolic links are not followed, so a link cannot walk the scan in a loop.

   Run from anywhere: node tests/chrome-path.js */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const SELF=path.resolve(__filename);
const NEEDLE=/pw-browsers|chromium-\d|chromium_headless_shell|chrome-linux/;
const APPROVED=/(?<![\w$])process\.env\.CHROME(?:\|\|| \|\| )'\/opt\/pw-browsers\/chromium-1194\/chrome-linux\/chrome'/g;
const LAUNCH=/\bchromium\s*\.\s*launch(?:PersistentContext)?\s*\(/g;
let files=0,launches=0,offenders=0,missing=0;
const fail=(p,line,why)=>{offenders++;console.log('FAIL '+path.relative(ROOT,p)+':'+line+' '+why);};

const codeOnly=src=>{
 let out='',i=0,prev='(';
 while(i<src.length){
  const c=src[i],d=src[i+1];
  let j;
  if(c==='/'&&d==='/'){j=src.indexOf('\n',i);if(j<0)j=src.length;}
  else if(c==='/'&&d==='*'){j=src.indexOf('*/',i+2);j=j<0?src.length:j+2;}
  else if(c==="'"||c==='"'||c==='`'||(c==='/'&&!/[\w$)\]]/.test(prev))){
   let cls=false;j=i+1;
   while(j<src.length){
    const x=src[j];
    if(x==='\\'){j+=2;continue;}
    if(x==='\n'&&c!=='`')break;
    j++;
    if(c==='/'){if(x==='[')cls=true;else if(x===']')cls=false;else if(x==='/'&&!cls)break;}
    else if(x===c)break;
   }
   j=Math.min(j,src.length);prev='a';
  }
  else{out+=c;if(!/\s/.test(c))prev=c;i++;continue;}
  out+=src.slice(i,j).replace(/[^\n]/g,' ');i=j;
 }
 return out;
};

const walk=dir=>{
 for(const name of fs.readdirSync(dir).sort()){
  const p=path.join(dir,name),st=fs.lstatSync(p);
  if(st.isDirectory()){if(name!=='node_modules')walk(p);continue;}
  if(!st.isFile()||p===SELF)continue;
  const src=fs.readFileSync(p,'utf8');
  if(NEEDLE.test(src)){
   files++;
   src.split('\n').forEach((line,i)=>{
    if(NEEDLE.test(line.replace(APPROVED,'')))fail(p,i+1,'names the browser outside the approved expression');
   });
  }
  if(!/\.[cm]?js$/.test(name))continue;
  const code=codeOnly(src);
  for(const m of code.matchAll(LAUNCH)){
   launches++;
   let depth=0,k=m.index+m[0].length-1;
   for(;k<code.length;k++){if(code[k]==='(')depth++;else if(code[k]===')'&&--depth===0)break;}
   if(k>=code.length||!/\bexecutablePath\b/.test(code.slice(m.index,k+1)))
    fail(p,code.slice(0,m.index).split('\n').length,'launches chromium with no executablePath');
  }
 }
};

for(const d of ['tests','tools','funnel']){
 const p=path.join(ROOT,d);
 if(!fs.existsSync(p)||!fs.lstatSync(p).isDirectory()){
  missing++;console.log('FAIL '+d+'/ is missing, so nothing in it was scanned');continue;}
 walk(p);
}
console.log('chrome-path: '+files+' files, '+launches+' launches, '+offenders+' offenders');
process.exit(offenders||missing?1:0);
