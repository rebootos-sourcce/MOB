/* THE CHROMIUM PATH, HELD TO ONE EXPRESSION. Every browser gate launched
   /opt/pw-browsers/chromium-1194/chrome-linux/chrome as a bare literal. That
   is this sandbox's own Playwright install, and a GitHub Actions runner has
   no such path, so not one browser gate could launch in CI: each would die
   at chromium.launch before its first check, which reads as the gate being
   broken when it is only the machine that differs.

   The fix is one expression, process.env.CHROME || '<that path>', so the
   sandbox runs exactly as before with CHROME unset and CI points CHROME at
   its own browser. This scan holds tests/, tools/ and funnel/ to it: a line
   that names chromium-1194 anywhere outside that expression is an offender,
   printed as FAIL file:line. It has to be a scan and not a habit, because a
   bare literal that slips back in still passes here, where every gate is
   written and run, and only breaks on the runner nobody is watching.

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
const NEEDLE='chromium-1194';
const APPROVED=/(?<![\w$])process\.env\.CHROME(?:\|\|| \|\| )'\/opt\/pw-browsers\/chromium-1194\/chrome-linux\/chrome'/g;
let files=0,offenders=0,missing=0;

const walk=dir=>{
 for(const name of fs.readdirSync(dir).sort()){
  const p=path.join(dir,name),st=fs.lstatSync(p);
  if(st.isDirectory()){if(name!=='node_modules')walk(p);continue;}
  if(!st.isFile()||p===SELF)continue;
  const buf=fs.readFileSync(p);
  if(!buf.includes(NEEDLE))continue;
  files++;
  buf.toString('utf8').split('\n').forEach((line,i)=>{
   if(line.replace(APPROVED,'').includes(NEEDLE)){
    offenders++;console.log('FAIL '+path.relative(ROOT,p)+':'+(i+1));}
  });
 }
};

for(const d of ['tests','tools','funnel']){
 const p=path.join(ROOT,d);
 if(!fs.existsSync(p)||!fs.lstatSync(p).isDirectory()){
  missing++;console.log('FAIL '+d+'/ is missing, so nothing in it was scanned');continue;}
 walk(p);
}
console.log('chrome-path: '+files+' files, '+offenders+' offenders');
process.exit(offenders||missing?1:0);
