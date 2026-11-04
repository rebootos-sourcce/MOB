#!/usr/bin/env node
'use strict';
/* ============================================================
   ARCHETYPE TO DOMAIN, PORTED FROM REBOOT-OS. 4 November.

   The owner: "wire up archetype to domain... you should have all of the
   records as well... look on GitHub, look in the different repos." The table
   already exists in Reboot-OS as ARCHDOM, eighteen rows, archetype name to
   domain word. This regenerates MOB's read only copy of it,
   atuned_src/engine/data/archdom.js, the way
   tools/regen-celestial-browser-bridge.cjs regenerates the Celestial
   snapshot (PR 149): from the source files themselves, never from a hand
   copied table, with the source SHAs written into the output.

     node tools/regen-archetype-domain.cjs <Reboot-OS repo> <mob-manuscript repo> [--ref R] [--check]

   ONE DIFFERENCE FROM PR 149, ON PURPOSE. That generator hashes the files in
   the working tree. The Reboot-OS checkout this was written against sat on a
   feature branch with another branch's 32_story.js staged over it, so a
   working tree hash would cite a state no commit holds. Every input here is
   read as a git blob at a named ref (default origin/main for Reboot-OS, HEAD
   for the book), and the output names the commit as well as each blob, so
   anyone can check it out and get the same bytes.

   WHAT IS READ, AND WHY EACH ONE.
     Reboot-OS atuned/data/canon_tables/ARCHDOM.json   the table, as canon.py
         pulled it out of the running Reboot-OS build.
     Reboot-OS atuned/data/canon_tables/manifest.json  canon.py's row count
         and hash for it. The hash is recomputed here the way canon.py makes
         it, so a table edited after extraction is refused.
     Reboot-OS atuned/server/migrations/0001_canon.sql the same table as the
         server's database holds it.
     Reboot-OS atuned/src/32_story.js                  the literal the build
         runs. All three copies must agree, row for row, or nothing is
         written.
     Reboot-OS atuned/data/canon.json                  the canon's own domain
         register, to record which ARCHDOM words that register does not
         carry (it is the upstream gap pass6_foundation.md names).
     mob-manuscript index.html                         the book. The numbered
         "Blueprint Domain Descriptions" are the tie breaker for the words
         MOB's DOMAINS spells another way, and every quotation the output
         cites is checked to occur in it.
     MOB atuned_src/engine/data/canon.js and kb.js     ARCH, DOMAINS, ROOTD,
         DOMDEF and KB_RENAME, read in a VM, never parsed by pattern.

   HOW A WORD BECOMES A MOB DOMAIN. Four routes, tried in order, and no
   other. There is no hand typed crosswalk in this file.
     same    the word is a DOMAINS name.
     codex   KB_RENAME (engine/data/kb.js) already records MOB's domain as
             "called <word> in the codex". kb.js says which name is canon is
             the owner's call; it records them as one domain with two names,
             and that join is used as it stands. The book's numbered heading
             for that domain must carry both names, and DOMDEF must file it
             at the same numeral.
     book    the word opens one of the book's numbered headings, and DOMDEF
             files that numeral's text under a DOMAINS name. The first two
             phrases of "Clear:" must agree between the book and DOMDEF, so a
             numeral that drifted between the two is refused.
     root    the word is one of the four roots, ROOTD. That is a different
             kind of answer from every other row: a family of domains, not
             one. It is emitted as the root with no domain, and open.
   A word none of these reach stops the script.

   AND ONE ARCHETYPE NAME. MOB's ARCH says Rebel where ARCHDOM says Outlaw.
   ui/analytics.js and ui/avatarui.js already join the two as one row, and
   the book uses both names for one archetype in the same slot of the same
   twelve, both checked below. Whether they are one is still recorded as the
   owner's call (engine/data/codes.js, DECISIONS.md "Rebel or Outlaw, are
   open"), so the alias is carried as an alias, never as a rename. Any other
   ARCH name ARCHDOM lacks stops the script.

   AND ONE OPEN ROW, RULER. Reboot-OS gives it the root Architect. The book
   points two ways, and both quotations are verified below; see OPEN.
   ============================================================ */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),
 vm=require('node:vm'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const OUT='atuned_src/engine/data/archdom.js';
const UP='rebootos-sourcce/Reboot-OS',BOOKREPO='rebootos-sourcce/mob-manuscript';
const P={table:'atuned/data/canon_tables/ARCHDOM.json',manifest:'atuned/data/canon_tables/manifest.json',
 sql:'atuned/server/migrations/0001_canon.sql',story:'atuned/src/32_story.js',canon:'atuned/data/canon.json'};
const BOOKFILE='index.html';

/* the book's own words, each of which must occur in it exactly once */
const Q={
 ruler_is_a_domain:'Zeus, Odin, Ra point at the same domain: Ruler.',
 power_took_royal:'Power consolidated from prior Directed Force + Royal (one can be a king or a warrior, they are both Power)',
 rebel_in_the_twelve:'"Explorer \\u00b7 Rebel \\u00b7 Lover \\u00b7 Creator"',
 outlaw_in_the_twelve:'The system is corrupt and I must oppose it. Authority is the enemy.',
 domain_list:'Blueprint Domain Descriptions'};

/* THE ONE ROW THIS DOES NOT RESOLVE. Reboot-OS's ARCHDOM gives Ruler the word
   Architect, which is a root here, not a domain. Two readings of the book
   are live and they disagree, so the leaf is left for the owner:
     Imperium  the book's "IV, Rulership and Order" (templates Zeus, Jupiter,
               Ra) is the text DOMDEF files under imperium, Imperium sits under
               Architect, which is the root Reboot-OS gives, and ARCH's Ruler
               already wears Imperium's glyph. The book's "Zeus, Odin, Ra point
               at the same domain: Ruler" is weaker than it looks: "Ruler" there
               is the archetype's own name, and the book's table files Odin
               under I, Knowledge, not under IV (mob-canon section 6).
     Power     the book's own line beside the consolidated list says royal
               went into Power. MOB's DOMAINS reads Power "directed force. the
               warrior, not the king", which says the opposite, and Power sits
               under Engine, which would also move Ruler off the root the
               upstream table gives it.
   Each reading names the quotation that carries it, checked against the
   book on every run. */
const OPEN={Ruler:{why:'Reboot-OS gives the root Architect, not a domain, and the book points two ways',
 read:[{nm:'Imperium',cite:['domain_list','ruler_is_a_domain'],
   says:'the book\'s Rulership and Order is the text DOMDEF files under imperium, and Imperium sits under Architect, the root Reboot-OS gives. The book\'s Zeus, Odin, Ra line names the archetype, and its own table files Odin under Knowledge'},
  {nm:'Power',cite:['power_took_royal'],
   says:'the book folds royal into Power, which DOMAINS contradicts ("the warrior, not the king") and which moves Ruler to the Engine root'}]}};
const ALIAS={Rebel:{as:'Outlaw',cite:['rebel_in_the_twelve','outlaw_in_the_twelve']}};

/* ---------------------------------------------------------------- reading */
function git(repo,args){return cp.execFileSync('git',['-C',repo,...args],{encoding:'utf8',maxBuffer:1<<27});}
function commitOf(repo,ref){return git(repo,['rev-parse','--verify',ref+'^{commit}']).trim();}
function blob(repo,commit,p){
 const sha=git(repo,['rev-parse','--verify',commit+':'+p]).trim();
 return {path:p,sha,text:git(repo,['cat-file','blob',sha])};}

/* canon.py's hash: sha256 of json.dumps(o, sort_keys=True, ensure_ascii=False),
   first sixteen hex. Python's default separators are ", " and ": ". Only a
   flat table of strings is needed, and anything else is refused rather than
   approximated. Checked against the manifest's own value for ARCHDOM and
   CDOMAIN, and against a tampered ARCHDOM, before this was relied on. */
function pyHash(o){
 if(!o||typeof o!=='object'||Array.isArray(o)||Object.values(o).some(v=>typeof v!=='string'))
  throw Error('pyHash reads a flat table of strings only');
 const s='{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+': '+JSON.stringify(o[k])).join(', ')+'}';
 return crypto.createHash('sha256').update(s,'utf8').digest('hex').slice(0,16);}

function fromSql(text){
 const re=/^INSERT INTO "canon_ARCHDOM" VALUES\('((?:[^']|'')*)','((?:[^']|'')*)'\);$/gm,out={};let m;
 while((m=re.exec(text))){const k=m[1].replace(/''/g,"'");
  if(k in out)throw Error('0001_canon.sql carries '+k+' twice');
  out[k]=JSON.parse(m[2].replace(/''/g,"'"));}
 return out;}
function fromStory(text){
 const re=/\bvar ARCHDOM=(\{[^}]*\});/g,hits=[...text.matchAll(re)];
 if(hits.length!==1)throw Error('32_story.js should declare var ARCHDOM once, found '+hits.length);
 return vm.runInNewContext('('+hits[0][1]+')',Object.create(null),{timeout:200});}

function sameTable(a,b){
 const ka=Object.keys(a).sort(),kb=Object.keys(b).sort(),diff=[];
 ka.filter(k=>!(k in b)).forEach(k=>diff.push(k+' only in the first'));
 kb.filter(k=>!(k in a)).forEach(k=>diff.push(k+' only in the second'));
 ka.filter(k=>k in b&&a[k]!==b[k]).forEach(k=>diff.push(k+': '+a[k]+' against '+b[k]));
 return diff;}

/* the book's numbered domain headings, each with the opening of its "Clear:" */
function bookDomains(html){
 const a=html.indexOf(Q.domain_list);
 const re=/<h4 class="subhead-sm">([IVX]+) · ([^<]+)<\/h4>\s*<p[^>]*><strong[^>]*>Clear:<\/strong>\s*([^<]+)/g;
 re.lastIndex=a;const seq=[];let m;
 /* the run of headings I, II, III and on, stopping at the first that is not
    the next numeral, so a later section that numbers its own headings is
    never read as more domains */
 while((m=re.exec(html))&&roman(m[1])===seq.length+1)
  seq.push({n:m[1],title:m[2].trim(),clear:m[3].trim()});
 return seq;}
function roman(s){const v={I:1,V:5,X:10};let t=0;for(let i=0;i<s.length;i++){const a=v[s[i]],b=v[s[i+1]]||0;t+=a<b?-a:a;}return t;}
/* the first two comma phrases of a "Clear:" line, compared without the
   contractions MOB's copy pass introduced ("what is" against "what's") */
const opening=s=>s.toLowerCase().replace(/'s\b/g,' is').split(',').slice(0,2).map(x=>x.trim()).join(', ');

/* ---------------------------------------------------------------- resolving */
function resolveWord(w,mob,book){
 const D=mob.DOMAINS,dn=D.map(d=>d.nm);
 if(dn.includes(w))return {nm:w,how:'same'};
 const byKey=k=>D.filter(d=>mob.KB_KEY(d.nm)===k);
 const atNumeral=n=>Object.keys(mob.DOMDEF).filter(k=>mob.DOMDEF[k].n===n);
 const heading=book.filter(b=>b.title.split(/\s+/)[0]===w);
 const renamed=Object.keys(mob.KB_RENAME).filter(k=>mob.KB_RENAME[k]===w);
 if(renamed.length){
  if(renamed.length!==1)throw Error('KB_RENAME calls '+renamed.length+' domains '+w);
  const d=byKey(renamed[0]);
  if(d.length!==1)throw Error('KB_RENAME key '+renamed[0]+' is not one DOMAINS name');
  const def=mob.DOMDEF[mob.KB_KEY(w)];
  if(!def)throw Error('DOMDEF has no '+w+' to hold the codex text for '+d[0].nm);
  const h=book.filter(b=>b.n===def.n);
  if(h.length!==1||!h[0].title.includes(w)||!h[0].title.includes(d[0].nm))
   throw Error('The book\'s heading '+def.n+' should name both '+w+' and '+d[0].nm+', reads '+(h[0]&&h[0].title));
  return {nm:d[0].nm,how:'codex',n:def.n,title:h[0].title};}
 if(heading.length){
  if(heading.length!==1)throw Error(heading.length+' book headings open on '+w);
  const h=heading[0],ks=atNumeral(h.n);
  if(ks.length!==1)throw Error('DOMDEF files '+ks.length+' entries at numeral '+h.n);
  const d=byKey(ks[0]);
  if(d.length!==1)throw Error('DOMDEF '+ks[0]+' at '+h.n+' is not one DOMAINS name');
  if(opening(mob.DOMDEF[ks[0]].c)!==opening(h.clear))
   throw Error('DOMDEF '+ks[0]+' and the book\'s '+h.n+' open differently: '+opening(mob.DOMDEF[ks[0]].c)+' | '+opening(h.clear));
  return {nm:d[0].nm,how:'book',n:h.n,title:h.title};}
 if(mob.ROOTD.includes(w))return {nm:null,root:w,how:'root',open:true};
 throw Error('Reboot-OS word '+w+' has no route into MOB\'s DOMAINS: rule it, then port it by hand');}

/* ---------------------------------------------------------------- the dash rule, as PR 149 */
const DASH=String.fromCharCode(0x2014);
const undash=s=>s.replace(new RegExp('(\\s*)'+DASH+'(\\s*)','g'),(m,a,b)=>a&&b?' - ':', ');
const clean=o=>typeof o==='string'?undash(o):Array.isArray(o)?o.map(clean):
 o&&typeof o==='object'?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,clean(v)])):o;
const spellsDash=s=>s.includes(DASH)||/\\u2014/i.test(s);

/* ---------------------------------------------------------------- building */
function mobTables(root){
 const ctx=vm.createContext({});
 for(const f of ['atuned_src/engine/data/canon.js','atuned_src/engine/data/kb.js'])
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
 const g=e=>vm.runInContext(e,ctx);
 return {ARCH:g('ARCH'),DOMAINS:g('DOMAINS'),ROOTD:g('ROOTD'),DOMDEF:g('DOMDEF'),KB_RENAME:g('KB_RENAME'),KB_KEY:g('KB_KEY')};}

function build(opts){
 const up=path.resolve(opts.reboot),bk=path.resolve(opts.book);
 const upC=commitOf(up,opts.ref||'origin/main'),bkC=commitOf(bk,opts.bookRef||'HEAD');
 const f={};for(const k in P)f[k]=blob(up,upC,P[k]);
 const book=blob(bk,bkC,BOOKFILE);

 const table=JSON.parse(f.table.text),man=JSON.parse(f.manifest.text).tables.ARCHDOM;
 if(!man)throw Error('canon_tables/manifest.json has no ARCHDOM entry');
 if(man.rows!==Object.keys(table).length)throw Error('manifest says '+man.rows+' rows, ARCHDOM.json has '+Object.keys(table).length);
 if(man.sha!==pyHash(table))throw Error('ARCHDOM.json hashes '+pyHash(table)+', the manifest says '+man.sha+': it was edited after canon.py extracted it');
 for(const [nm,t] of [['0001_canon.sql',fromSql(f.sql.text)],['32_story.js',fromStory(f.story.text)]]){
  const d=sameTable(table,t);
  if(d.length)throw Error('ARCHDOM.json and '+nm+' disagree: '+d.join('; '));}

 for(const k in Q){const n=book.text.split(Q[k]).length-1;
  if(n!==1)throw Error('The book should carry "'+Q[k]+'" once ('+k+'), found '+n);}
 const bookList=bookDomains(book.text);
 if(bookList.length<14)throw Error('Read '+bookList.length+' numbered domains out of the book, expected the list');

 const mob=mobTables(opts.root||ROOT);
 const words={};
 for(const w of [...new Set(Object.values(table))].sort())words[w]=resolveWord(w,mob,bookList);

 const archN=mob.ARCH.map(a=>a.nm),missing=archN.filter(n=>!(n in table));
 const aliased=Object.keys(ALIAS).sort();
 if(JSON.stringify(missing.sort())!==JSON.stringify(aliased))
  throw Error('ARCH names ARCHDOM lacks are '+JSON.stringify(missing)+', the aliases cover '+JSON.stringify(aliased));
 for(const a in ALIAS)if(!(ALIAS[a].as in table))throw Error('Alias '+a+' points at '+ALIAS[a].as+', which ARCHDOM lacks');

 const dn=mob.DOMAINS.map(d=>d.nm);
 for(const a in OPEN){
  if(!(a in table))throw Error('OPEN names '+a+', which ARCHDOM lacks');
  if(!words[table[a]].open)throw Error(a+' resolved to '+words[table[a]].nm+' by route; OPEN no longer applies, so rule it and remove it');
  for(const r of OPEN[a].read){
   if(!dn.includes(r.nm))throw Error('OPEN reading '+r.nm+' is not a DOMAINS name');
   for(const c of r.cite)if(!Q[c])throw Error('OPEN cites '+c+', which Q does not carry');}}
 /* every word that is not a root must have resolved to a domain; every open
    word must be an OPEN row's, so nothing is open by accident */
 for(const w in words)if(words[w].open&&!Object.keys(OPEN).some(a=>table[a]===w))
  throw Error(w+' is open and no OPEN row says why');

 const reg=JSON.parse(f.canon.text).registers.domains;
 const regLeaves=[].concat(...Object.values(reg)),regRoots=Object.keys(reg).map(k=>k.split(' ')[0]);
 const unregistered=Object.keys(words).filter(w=>!regLeaves.includes(w)).map(w=>({word:w,
  as:regRoots.includes(w)?'a root of the register, not one of its domains':'in neither its domains nor its roots'}));

 const origin={schema:'atuned.archdom.mob_snapshot.v1',
  from:{repo:UP,ref:opts.ref||'origin/main',commit:upC,
   files:Object.keys(P).map(k=>({path:f[k].path,sha:f[k].sha}))},
  book:{repo:BOOKREPO,commit:bkC,path:BOOKFILE,sha:book.sha},
  table:{rows:man.rows,canon_py_sha:man.sha},
  generator:'tools/regen-archetype-domain.cjs'};
 const quotes={};for(const k in Q)quotes[k]=Q[k].replace(/\\u00b7/g,'·').replace(/^"|"$/g,'');
 const snap=clean({origin,rows:table,words,alias:ALIAS,open:OPEN,quotes,unregistered});

 let out='/* GENERATED by tools/regen-archetype-domain.cjs. Do not edit: regenerate.\n';
 out+=' * Reboot-OS '+upC+' ('+(opts.ref||'origin/main')+'), canon_ARCHDOM, '+man.rows+' rows, canon.py sha '+man.sha+'.\n';
 out+=' * Blobs: '+Object.keys(P).map(k=>f[k].path.split('/').pop()+' '+f[k].sha.slice(0,12)).join(', ')+'.\n';
 out+=' * Book: mob-manuscript '+bkC.slice(0,12)+' index.html '+book.sha.slice(0,12)+'.\n';
 out+=' * A lookup, not an inference: engine/archdom.js says what it may and may not be used for. */\n';
 out+='var ARCHDOM_SNAPSHOT='+JSON.stringify(snap,null,1)+';\n';
 if(spellsDash(out))throw Error('the snapshot still spells an em dash, raw or as an escape');
 return out;}

/* ---------------------------------------------------------------- self test
   A tool that lies is worse than no tool. --self-test builds the real
   snapshot (known good), then plants known bad sources, each a throwaway git
   repository made from the real blobs with one thing changed and committed,
   and proves every refusal fires on its own case and names it. */
function selfTest(reboot,book){
 const os=require('node:os');let pass=0,fail=0;
 const say=(okk,m)=>{if(okk)pass++;else{fail++;console.log('  FAIL  '+m);}};
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'archdom-'));
 const commit=commitOf(reboot,'origin/main'),real={};
 for(const k in P)real[k]=blob(reboot,commit,P[k]).text;
 const repo=(name,files)=>{const d=path.join(tmp,name);
  for(const p in files){fs.mkdirSync(path.dirname(path.join(d,p)),{recursive:true});fs.writeFileSync(path.join(d,p),files[p]);}
  for(const a of [['init','-q'],['add','-A'],['-c','user.email=t@t','-c','user.name=t','commit','-qm','plant']])git(d,a);
  return d;};
 const up=(edit)=>{const f={};for(const k in P)f[P[k]]=real[k];edit(f);return f;};
 /* the same change made to every copy, with canon.py's hash brought along */
 const everywhere=(f,from,to)=>{
  const t=JSON.parse(f[P.table]);Object.assign(t,from);f[P.table]=JSON.stringify(t,null,1);
  const m=JSON.parse(f[P.manifest]);m.tables.ARCHDOM.sha=pyHash(t);f[P.manifest]=JSON.stringify(m,null,1);
  for(const k in from){
   f[P.sql]=f[P.sql].replace("VALUES('"+k+"','\""+to[k]+"\"')","VALUES('"+k+"','\""+from[k]+"\"')");
   f[P.story]=f[P.story].replace(k+":'"+to[k]+"'",k+":'"+from[k]+"'");}};
 const refused=(name,o,re)=>{let msg='';
  try{build(Object.assign({ref:'HEAD'},o));}catch(e){msg=e.message;}
  say(re.test(msg),name+' should be refused with '+re+', got '+(msg||'no refusal'));};

 let good='';try{good=build({reboot,book});}catch(e){good='';say(false,'the real sources should build: '+e.message);}
 if(good){say(true);say(good===fs.readFileSync(path.join(ROOT,OUT),'utf8'),'the real sources should rebuild the committed snapshot byte for byte');}
 /* each copy changed alone */
 refused('ARCHDOM.json edited after extraction',{reboot:repo('a',up(f=>{f[P.table]=f[P.table].replace('"Ruler": "Architect"','"Ruler": "Imperium"');})),book},/hashes .* the manifest says/);
 refused('ARCHDOM.json and its hash moved, the database copy not',{reboot:repo('b',up(f=>{
  const t=JSON.parse(f[P.table]);t.Lover='Connection';f[P.table]=JSON.stringify(t,null,1);
  const m=JSON.parse(f[P.manifest]);m.tables.ARCHDOM.sha=pyHash(t);f[P.manifest]=JSON.stringify(m,null,1);})),book},/disagree: Lover/);
 /* every copy agreeing, and the word wrong */
 refused('a word nothing routes',{reboot:repo('c',up(f=>everywhere(f,{Lover:'Sovereignty'},{Lover:'Love'}))),book},/Sovereignty has no route/);
 refused('Ruler resolved upstream while OPEN still holds it',{reboot:repo('d',up(f=>everywhere(f,{Ruler:'Imperium'},{Ruler:'Architect'}))),book},/OPEN no longer applies/);
 /* the book */
 const html=git(book,['show','HEAD:'+BOOKFILE]);
 refused('a cited quotation missing from the book',{reboot,ref:'origin/main',book:repo('e',{[BOOKFILE]:html.replace(Q.power_took_royal,'Power')})},/should carry .*power_took_royal/);
 refused('the book\'s heading VI renamed so Destruction opens nothing',{reboot,ref:'origin/main',book:repo('f',{[BOOKFILE]:html.replace('VI · Destruction and Renewal','VI · Renewal')})},/Destruction has no route/);
 /* MOB's own tables. Without KB_RENAME's connection, Love falls to the book
    route, whose numeral DOMDEF files under love, which no DOMAINS name
    keys to, so the codex join is what carries it and its absence is loud. */
 const mobRoot=path.join(tmp,'mob');
 for(const p of ['atuned_src/engine/data/canon.js','atuned_src/engine/data/kb.js']){
  fs.mkdirSync(path.dirname(path.join(mobRoot,p)),{recursive:true});fs.copyFileSync(path.join(ROOT,p),path.join(mobRoot,p));}
 const kb=path.join(mobRoot,'atuned_src/engine/data/kb.js');
 fs.writeFileSync(kb,fs.readFileSync(kb,'utf8').replace('"connection":"Love",',''));
 refused('KB_RENAME without the codex name for Connection',{reboot,ref:'origin/main',book,root:mobRoot},/love at VII is not one DOMAINS name/);
 fs.rmSync(tmp,{recursive:true,force:true});
 console.log('SELF-TEST '+pass+' passed, '+fail+' failed');
 return fail;}

function main(){
 const args=process.argv.slice(2),check=args.includes('--check');
 if(args.includes('--self-test')){const pos=args.filter(a=>!a.startsWith('--'));
  if(pos.length<2){console.error('Usage: node tools/regen-archetype-domain.cjs <Reboot-OS repo> <mob-manuscript repo> --self-test');process.exit(2);}
  process.exit(selfTest(path.resolve(pos[0]),path.resolve(pos[1]))?1:0);}
 const ri=args.indexOf('--ref'),ref=ri>=0?args[ri+1]:undefined;
 const pos=args.filter((a,i)=>!a.startsWith('--')&&!(ri>=0&&i===ri+1));
 if(pos.length<2){console.error('Usage: node tools/regen-archetype-domain.cjs <Reboot-OS repo> <mob-manuscript repo> [--ref R] [--check]');process.exit(2);}
 let out;
 try{out=build({reboot:pos[0],book:pos[1],ref});}
 catch(e){console.error('REFUSED '+e.message);process.exit(1);}
 const full=path.join(ROOT,OUT),old=fs.existsSync(full)?fs.readFileSync(full,'utf8'):'';
 if(old===out){console.log('MATCH '+OUT);}
 else if(check){console.error('DRIFT '+OUT+': regenerate and review the source SHAs');process.exit(1);}
 else{fs.writeFileSync(full,out);console.log('REGENERATED '+OUT);}}

if(require.main===module)main();
module.exports={build,pyHash,fromSql,fromStory,bookDomains,resolveWord,mobTables,Q,OPEN,ALIAS};
