/* ============================================================
   THE BACKLOG, AS A PAGE.

   TASKS.md is the one list and the owner cannot open markdown. A backlog he
   cannot read is a backlog that is not agreed, so this renders it.

   It reads the file and nothing else. There is no second list, no database
   and no state here: if a line is wrong on the page it is wrong in TASKS.md,
   which is the only place to fix it. That is the whole design.

   node tools/backlog.js  ->  BACKLOG.html
   ============================================================ */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const SRC=path.join(ROOT,'TASKS.md');
const OUT=path.join(ROOT,'BACKLOG.html');

const MARK={' ':['open','Open'],'x':['done','Built and gated'],
            '?':['his','Waiting on his ruling'],'~':['spec','Specced, not built']};

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
/* the inline markdown that actually appears in this file, and no more. A
   general parser here would be a second thing to maintain and to be wrong. */
function inline(s){
 return esc(s)
  .replace(/`([^`]+)`/g,'<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');}

const lines=fs.readFileSync(SRC,'utf8').split('\n');
const secs=[]; let cur=null, sub=null, item=null;

function closeItem(){ if(item&&sub)sub.items.push(item); item=null; }
function closeSub(){ closeItem(); if(sub&&cur)cur.subs.push(sub); sub=null; }
function closeSec(){ closeSub(); if(cur)secs.push(cur); cur=null; }

for(const raw of lines){
 const l=raw.replace(/\s+$/,'');
 let m;
 if((m=l.match(/^## (.+)$/))){ closeSec(); cur={t:m[1],subs:[],note:[]}; continue; }
 if(!cur)continue;
 if((m=l.match(/^### (.+)$/))){ closeSub(); sub={t:m[1],items:[]}; continue; }
 if((m=l.match(/^- \[(.)\] (.*)$/))){
  closeItem();
  if(!sub){ sub={t:'',items:[]}; }
  item={k:m[1],body:m[2]};
  continue; }
 if(item&&/^ {2,}\S/.test(l)){ item.body+=' '+l.trim(); continue; }
 if(l.trim()===''){ closeItem(); continue; }
 closeItem();
 if(sub&&sub.items.length===0&&l.trim()!=='---')sub.note=(sub.note||'')+' '+l.trim();
 else if(!sub&&l.trim()!=='---')cur.note.push(l.trim());}
closeSec();

/* the first section is the legend, which is instructions and not work */
const work=secs.filter(s=>!/^How a line moves$/.test(s.t));
const all=[]; work.forEach(s=>s.subs.forEach(b=>b.items.forEach(i=>all.push(i))));
const tally=k=>all.filter(i=>i.k===k).length;
const N={open:tally(' '),done:tally('x'),his:tally('?'),spec:tally('~')};

function itemHtml(i){
 const [cls,nm]=MARK[i.k]||['open','Open'];
 return '<li class="it '+cls+'" data-k="'+cls+'"><s title="'+nm+'"></s>'
  +'<div>'+inline(i.body)+'</div></li>';}

function secHtml(s){
 const items=[].concat(...s.subs.map(b=>b.items));
 if(!items.length)return '';
 const open=items.filter(i=>i.k!=='x').length;
 return '<section class="sec" data-open="'+open+'">'
  +'<h2><span>'+inline(s.t)+'</span>'
  +'<em>'+(open?open+' left of '+items.length:'all '+items.length+' done')+'</em></h2>'
  +s.subs.map(b=>(b.items.length
    ?(b.t?'<h3>'+inline(b.t)+'</h3>':'')+'<ul>'+b.items.map(itemHtml).join('')+'</ul>'
    :'')).join('')
  +'</section>';}

const stamp=new Date().toISOString().slice(0,16).replace('T',' ');
let head='';
try{head=require('child_process').execSync('git rev-parse --short HEAD',
 {cwd:ROOT}).toString().trim();}catch(e){head='unknown';}

const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atuned backlog</title>
<style>
:root{--bg:#0E0E0F;--card:#16171A;--sunk:#1C1E22;--line:#26282E;--ink:#E6E7EA;
 --dim:#8A8C94;--accent:#7EB8D4;--au:#D6A93B;--ok:#65CFA5;--his:#C9A96A}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:15px/1.62 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
 -webkit-font-smoothing:antialiased;padding:0 0 80px}
.wrap{max-width:900px;margin:0 auto;padding:0 16px}
header{padding:34px 0 8px}
h1{font-size:23px;margin:0 0 4px;font-weight:600;letter-spacing:-.01em}
.sub{color:var(--dim);font-size:13px;margin:0 0 20px}
.tot{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:0 0 8px}
.tot button{background:var(--card);border:1px solid var(--line);border-radius:12px;
 padding:13px 12px;text-align:left;color:var(--ink);font:inherit;cursor:pointer}
.tot button:hover{border-color:var(--dim)}
.tot button[aria-pressed=true]{border-color:var(--accent)}
.tot b{display:block;font-size:26px;font-weight:600;line-height:1.1}
.tot span{display:block;color:var(--dim);font-size:12px;margin-top:2px}
.tot .open b{color:var(--accent)} .tot .done b{color:var(--ok)}
.tot .his b{color:var(--his)} .tot .spec b{color:var(--au)}
.hint{color:var(--dim);font-size:12.5px;margin:6px 0 24px}
.sec{background:var(--card);border:1px solid var(--line);border-radius:14px;
 padding:4px 18px 14px;margin:0 0 14px}
.sec h2{font-size:14px;font-weight:600;letter-spacing:.02em;margin:16px 0 4px;
 display:flex;gap:12px;align-items:baseline;justify-content:space-between}
.sec h2 em{font-style:normal;color:var(--dim);font-size:12px;
 white-space:nowrap;font-weight:400}
.sec h3{font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--dim);
 text-transform:none;margin:16px 0 2px}
ul{list-style:none;margin:0;padding:0}
.it{display:flex;gap:11px;padding:7px 0;border-top:1px solid var(--sunk);
 align-items:flex-start}
.it:first-child{border-top:0}
.it s{flex:0 0 auto;width:13px;height:13px;border-radius:50%;margin-top:5px;
 border:1.6px solid var(--dim);text-decoration:none;display:block}
.it.done s{border-color:var(--ok);background:var(--ok)}
.it.open s{border-color:var(--accent)}
.it.his s{border-color:var(--his);border-style:dashed}
.it.spec s{border-color:var(--au)}
.it.done div{color:var(--dim)}
.it code{background:var(--sunk);border-radius:5px;padding:1px 5px;
 font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--accent)}
.it b{font-weight:600}
body.filter .it{display:none}
body.f-open .it.open,body.f-done .it.done,body.f-his .it.his,
body.f-spec .it.spec{display:flex}
body.filter .sec:not(:has(.it[style]),:has(li:not([hidden]))){}
footer{color:var(--dim);font-size:12px;margin-top:26px}
@media(max-width:560px){.tot{grid-template-columns:repeat(2,1fr)}}
</style></head><body>
<div class="wrap">
<header>
<h1>Atuned backlog</h1>
<p class="sub">Every line in TASKS.md, rendered. Commit ${head}, read ${stamp}.</p>
<div class="tot">
<button class="open" data-f="open" aria-pressed="false"><b>${N.open}</b><span>open</span></button>
<button class="his" data-f="his" aria-pressed="false"><b>${N.his}</b><span>waiting on you</span></button>
<button class="spec" data-f="spec" aria-pressed="false"><b>${N.spec}</b><span>specced, not built</span></button>
<button class="done" data-f="done" aria-pressed="false"><b>${N.done}</b><span>built and gated</span></button>
</div>
<p class="hint">${all.length} lines in ${work.length} sections. Press a number to see only those. Press it again for all of them.</p>
</header>
${work.map(secHtml).join('')}
<footer>Nothing is stored on this page and nothing is sent from it. It is TASKS.md read once and drawn. A line is wrong here only if it is wrong there.</footer>
</div>
<script>
/* FILTERING HAS TO TAKE THE HEADINGS WITH IT. The first cut hid the lines and
   left their headings standing, so a section read as having work in it and
   then had none under the heading. A heading with nothing under it is worse
   than no heading: it says something is there. */
var B=document.querySelectorAll('.tot button');
function shown(el){return el.offsetParent!==null;}
function apply(cls){
 document.body.className=cls?'filter f-'+cls:'';
 document.querySelectorAll('.sec').forEach(function(s){
  s.style.display='';
  s.querySelectorAll('ul').forEach(function(u){
   var any=[].some.call(u.querySelectorAll('.it'),shown);
   u.style.display=any?'':'none';
   var h=u.previousElementSibling;
   if(h&&h.tagName==='H3')h.style.display=any?'':'none';});
  var live=[].some.call(s.querySelectorAll('.it'),shown);
  s.style.display=live?'':'none';});}
B.forEach(function(b){b.onclick=function(){
 var on=b.getAttribute('aria-pressed')==='true';
 B.forEach(function(o){o.setAttribute('aria-pressed','false');});
 if(on){apply('');return;}
 b.setAttribute('aria-pressed','true');
 apply(b.dataset.f);};});
</script>
</body></html>`;
fs.writeFileSync(OUT,html);
console.log('wrote BACKLOG.html  '+all.length+' lines  open '+N.open
 +'  yours '+N.his+'  specced '+N.spec+'  done '+N.done);
