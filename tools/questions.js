/* ============================================================
   EVERY QUESTION THE TEAM HAS PUT TO HIM AND HE HAS NOT ANSWERED.

   He asked for a markdown document and he cannot open markdown, so this
   writes both from the same pass and neither is typed by hand.

   The source is TASKS.md and only TASKS.md. A `[?]` line is the mark for a
   question waiting on his ruling, which means the answer to "what have I not
   answered" is already in the one list and does not need a second one. If a
   question is missing here it is missing there, and that is where to add it.

   node tools/questions.js  ->  QUESTIONS.md and QUESTIONS.html
   ============================================================ */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const lines=fs.readFileSync(path.join(ROOT,'TASKS.md'),'utf8').split('\n');

const secs=[]; let cur=null, sub='', item=null, at=0;
const push=()=>{ if(item&&cur){cur.qs.push(item.trim()); cur.at.push(at);} item=null; };
lines.forEach((raw,idx)=>{
 const l=raw.replace(/\s+$/,''); let m;
 if((m=l.match(/^## (.+)$/))){ push(); cur={t:m[1],qs:[],at:[]}; secs.push(cur); sub=''; return; }
 if(!cur)return;
 if((m=l.match(/^### (.+)$/))){ push(); sub=m[1]; return; }
 if((m=l.match(/^- \[\?\] (.*)$/))){ push(); item=m[1]; at=idx+1; return; }
 if((m=l.match(/^- \[.\] /))){ push(); return; }
 if(item&&/^ {2,}\S/.test(l)){ item+=' '+l.trim(); return; }
 if(l.trim()==='')push();});
push();

const live=secs.filter(s=>s.qs.length&&!/^How a line moves$/.test(s.t));
const total=live.reduce((a,s)=>a+s.qs.length,0);

/* ---- the gate, and it runs before anything is written ----
   A `[?]` line is a question put to him. A document titled questions that
   carries statements has gone out three times and come back with nothing
   answered, which is the same defect as a count typed into a gate: the
   document asserts something the file does not support. So the file is
   measured rather than trusted. Two checks, and neither carries a number:
   the line has to hold a question mark, and the question has to come first,
   which means no sentence closes ahead of it. Read the count off the run. */
const nameOf=t=>{ const m=t.replace(/\*\*/g,'').trim().match(/^([A-Za-z]{1,4}\d{1,3}[a-z]?)\./); return m?m[1]:null; };
const bad=[];
live.forEach(s=>s.qs.forEach((q,i)=>{
 const t=q.replace(/\*\*/g,'').replace(/^([A-Za-z]{1,4}\d{1,3}[a-z]?)\.\s*/,'').trim();
 const qi=t.indexOf('?');
 const si=t.search(/\.(\s|$)/);
 let why=null;
 if(qi<0) why='no question mark';
 else if(si>=0&&si<qi) why='the question is not first';
 if(why) bad.push({id:nameOf(q),at:s.at[i],sec:s.t,why,q});}));
if(bad.length){
 console.error('QUESTIONS GATE FAILED. '+bad.length+' of '+total+
  ' lines marked [?] do not ask him anything.\n');
 bad.forEach(b=>{
  console.error('  '+(b.id||'(no identifier)')+'  TASKS.md:'+b.at+'  '+b.why);
  console.error('      '+b.q.replace(/\*\*/g,'').slice(0,96));});
 console.error('\nEvery [?] line opens with a question, ending in a question mark,\n'+
  'answerable without reading the finding under it. Nothing was written.');
 process.exit(1);}
let head='unknown';
try{head=require('child_process').execSync('git rev-parse --short HEAD',{cwd:ROOT})
 .toString().trim();}catch(e){}
const day=new Date().toISOString().slice(0,10);

/* ---- markdown, which is what he asked for ---- */
let md='# QUESTIONS FOR THE OWNER\n\n'
 +'Every line in `TASKS.md` marked `[?]`, which is the mark for a question\n'
 +'waiting on his ruling. '+total+' of them, across '+live.length+' sections.\n'
 +'Read off commit '+head+' on '+day+'. Nothing here is typed by hand: answer a\n'
 +'question in TASKS.md and it leaves this file on the next run.\n\n'
 +'Each one opens with the question and names the seat asking it. The generator\n'
 +'refuses to write this file if a line marked `[?]` asks nothing.\n\n'
 +'The same list is in `QUESTIONS.html`, which opens in a browser.\n';
live.forEach(s=>{
 md+='\n## '+s.t+'\n\n';
 s.qs.forEach(q=>{ md+='- [ ] '+q+'\n'; });});
fs.writeFileSync(path.join(ROOT,'QUESTIONS.md'),md);

/* ---- and the page, which is what he can read ---- */
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inline=t=>esc(t).replace(/`([^`]+)`/g,'<code>$1</code>')
 .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Questions for you</title><style>
:root{--bg:#0E0E0F;--card:#16171A;--sunk:#1C1E22;--line:#26282E;--ink:#E6E7EA;
 --dim:#8A8C94;--his:#C9A96A;--accent:#7EB8D4}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);padding:0 0 80px;
 font:15.5px/1.64 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
 -webkit-font-smoothing:antialiased}
.wrap{max-width:820px;margin:0 auto;padding:0 16px}
header{padding:34px 0 22px}
h1{font-size:24px;margin:0 0 6px;font-weight:600;letter-spacing:-.01em}
.n{font-size:44px;font-weight:600;color:var(--his);line-height:1;margin:14px 0 2px}
.sub{color:var(--dim);font-size:13px;margin:0}
.sec{background:var(--card);border:1px solid var(--line);border-radius:14px;
 padding:2px 18px 14px;margin:0 0 14px}
h2{font-size:13.5px;font-weight:600;letter-spacing:.02em;margin:18px 0 6px;
 display:flex;justify-content:space-between;gap:12px;align-items:baseline}
h2 em{font-style:normal;color:var(--dim);font-size:12px;font-weight:400}
ul{list-style:none;margin:0;padding:0}
li{display:flex;gap:11px;padding:9px 0;border-top:1px solid var(--sunk)}
li:first-child{border-top:0}
li s{flex:0 0 auto;width:13px;height:13px;border-radius:50%;margin-top:5px;
 border:1.6px dashed var(--his);text-decoration:none;display:block}
code{background:var(--sunk);border-radius:5px;padding:1px 5px;color:var(--accent);
 font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
b{font-weight:600}
footer{color:var(--dim);font-size:12px;margin-top:26px}
</style></head><body><div class="wrap">
<header><h1>Questions for you</h1>
<p class="n">${total}</p>
<p class="sub">Waiting on your ruling, across ${live.length} sections. Each one
names the seat asking it. Commit ${head}, ${day}.</p>
</header>
${live.map(s=>'<section class="sec"><h2><span>'+inline(s.t)+'</span><em>'
 +s.qs.length+'</em></h2><ul>'
 +s.qs.map(q=>'<li><s></s><div>'+inline(q)+'</div></li>').join('')
 +'</ul></section>').join('')}
<footer>Read out of TASKS.md, where every one of these is a line marked as
waiting on you. Answer one there and it leaves this page. Nothing is stored
here and nothing is sent from it.</footer>
</div></body></html>`;
fs.writeFileSync(path.join(ROOT,'QUESTIONS.html'),html);
console.log('gate passed: '+total+' lines marked [?], every one of them a question');
console.log('wrote QUESTIONS.md and QUESTIONS.html  '+total+' questions in '+live.length+' sections');
