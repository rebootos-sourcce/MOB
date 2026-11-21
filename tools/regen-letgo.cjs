#!/usr/bin/env node
'use strict';
/* ============================================================
   THE LET GO LIST, PORTED FROM REBOOT-OS. 21 November.

   The owner: "the 96 patterns, the 17,000 lines, let's get that in too... go
   knock out these 96 patterns and close this thing up." The list was taken
   into Reboot-OS on 11 September (atuned/data/letgo, its manifest says
   "intaken": "2026-09-11") and was never wired into this app: no Let Go data
   or code anywhere in atuned_src, tools or tests before this file.

     node tools/regen-letgo.cjs <Reboot-OS repo> [--ref R] [--check]

   Every input is read as a git blob at a named ref (default origin/main), the
   way tools/regen-archetype-domain.cjs reads ARCHDOM, and the output names
   the commit and each blob, so anyone can check it out and get the same
   bytes. Nothing in the output is typed by hand.

   WHAT "17,000 LINES" MEASURES AS. No file in Reboot-OS states 17,704.
   Counted at the commit this reads: 11,700 written lines in the supplement's
   233 cards (10,681 once the repeats between cards are dropped), and 5,831
   dictated "I'm letting go of" statements across the three dictated lists
   (376 topics in 2026, 64 and 120 in the two PDFs). 11,700 and 5,831 is
   17,531, which is the figure his "about 17,000" most plausibly names.

   WHAT IS BUNDLED, AND WHAT IS NOT, AND WHY. The build is one file with no
   network (CLAUDE.md), so the list is carried in it rather than fetched.
   Carried whole would be wrong twice: the supplement's raw text is 10.8 MB,
   most of it the chat that produced the cards, and the dictation is speech
   to text with its errors in it ("bleeding" for believing). So two compact
   things are written, each from the cleanest form Reboot-OS already holds:

     atuned_src/engine/data/letgo.js   THE CUES. Short phrases the engine can
         find in what a person types or says. From letgo_tails.json, the
         dictation cut at each "I'm letting go of" into the thing being let
         go of (Reboot-OS's letgo_tails.py), filed under the seat of the
         fetter its topic joined to; and from canon_tables/LETGO.json, the
         list's own index, topic titles of two words or more, filed under
         their seat with the channel and layer the index gives.
     atuned_src/ui/letgopacks.js       THE PACKS. Every distinct written line
         of the supplement's cards, grouped by the feeling word it opens on
         (Anxious, Worried, Afraid...), one pack per family. Only the Wisdom
         school reads it, so it is a ui file and does not ride inside the
         engine, and so not inside the quiz page that embeds the engine.

   The raw dictation and the cards' chat headings are left in Reboot-OS.

   A CUE IS A MATCH, NEVER A READING. The seat a cue carries is the seat
   Reboot-OS's join filed its topic under, an inference about the topic and
   not a fact about a person. engine/letgo.js says what a match may be used
   for.
   ============================================================ */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const ROOT=path.resolve(__dirname,'..');
const UP='rebootos-sourcce/Reboot-OS';
const OUT_CUES='atuned_src/engine/data/letgo.js', OUT_PACKS='atuned_src/ui/letgopacks.js';
const P={tails:'atuned/data/letgo/letgo_tails.json', cards:'atuned/data/letgo/letgo_cards.json',
 manifest:'atuned/data/letgo/manifest.json', index:'atuned/data/canon_tables/LETGO.json',
 layer:'atuned/data/canon_tables/LETGO_LAYER.json'};
const SEATS=['crown','eye','throat','heart','solar','sacral','root'];

function git(repo,args){return cp.execFileSync('git',['-C',repo,...args],{encoding:'utf8',maxBuffer:1<<27});}
function commitOf(repo,ref){return git(repo,['rev-parse','--verify',ref+'^{commit}']).trim();}
function blob(repo,commit,p){
 const sha=git(repo,['rev-parse','--verify',commit+':'+p]).trim();
 return {path:p,sha,text:git(repo,['cat-file','blob',sha])};}

/* THE SNIFFER'S OWN NORMALISATION, so a cue is written in the exact form the
   engine searches. normMap (engine/sniff.js) lower cases, drops the
   apostrophe straight or curly, turns anything outside a to z into a space
   and collapses runs. tests/engine.js holds every cue to normMap itself, so
   this copy cannot drift from it unseen. */
function norm(t){
 return String(t||'').toLowerCase().replace(/[İı]/g,'i').replace(/['‘’]/g,'')
  .replace(/[^a-z ]/g,' ').replace(/ +/g,' ').trim();}

/* WHAT IS NOT A CUE. The dictation's stem is "believing perceiving thinking
   behaving acting feeling speaking saying voicing", and letgo_tails.py's
   cut sometimes leaves a piece of it ("the same voicing", "sad and
   voicing"). A tail that still carries a channel word is a piece of the
   stem, not a thing let go of. A tail that opens on a conjunction is the
   back half of a clause. Index titles of one word ("Love", "Rejected") are
   left out: the lexicon already reads those words, and a cue of one common
   word would match nearly every entry. A title of two words where one is
   filler ("The truth", "Just ask") is a one word cue in practice, and is
   left out for the same reason. A phrase the dictation service masked
   ("F****** needy") lost its word before Reboot-OS ever saw it, so it is
   not a phrase anyone could type back. */
const STEMW=new Set(['voicing','saying','speaking','perceiving','behaving']);
const OPENW=new Set(['but','and','or','so','because','then','this','out','over']);
const FILLW=new Set(['the','a','an','my','just','i','me','to','of','it','is','so','be','go','do','im']);
function cueOk(n,min,raw){
 const w=n.split(' ');
 if(raw&&raw.indexOf('*')>=0)return false;
 if(w.length<min||w.length>10)return false;
 if(w.length===2&&w.some(x=>FILLW.has(x)))return false;
 if(w.some(x=>STEMW.has(x)))return false;
 if(OPENW.has(w[0]))return false;
 return true;}

/* A LINE THE HOUSE VOICE GATE STOPS IS NOT CARRIED. The packs are shown to
   a person, and a cue's phrase comes back from letgoCues as `said`, so both
   are copy the moment a surface prints them, and check.py --objections
   sweeps engine/data and ui for exactly that. Its stop rules are read from
   .claude/skills/atuned-voice/objections.json, the gate's own database, so
   this is that rule and not a copy of it. Measured 21 November: seven card
   lines ("dynamics", "leverage", "cognitive", "architecture") and two
   dictated phrases ("the construct of reality is real", "not operating at my
   highest level"). Rewriting his lines to pass would put words in his mouth,
   so they are left out and named on every run instead. */
function voiceStops(){
 const d=JSON.parse(fs.readFileSync(path.join(ROOT,'.claude/skills/atuned-voice/objections.json'),'utf8'));
 const out=[];
 for(const r of d.rules||[]){
  if(r.severity!=='stop'||r.gate!=='objections'||!Array.isArray(r.re))continue;
  for(const x of r.re){let src=x,fl='i';
   /* the database is written for Python, whose inline (?m) JavaScript lacks */
   const m=/^\(\?([a-z]+)\)/.exec(src); if(m){src=src.slice(m[0].length); if(m[1].includes('m'))fl+='m';}
   out.push([r.id,new RegExp(src,fl)]);}}
 return s=>out.filter(x=>x[1].test(s)).map(x=>x[0]);}

/* THE PACKS, BY THE FEELING A LINE OPENS ON. A card line is written as a
   feeling and its object: "Anxious that people will always judge me",
   "Worried that I have permanently damaged my future". The first word is the
   feeling, so it is what files the line. A line that opens on "Feeling" is
   filed by the word after it. A line whose first word no family takes goes
   in More, so every line is carried and none is dropped. Order here is the
   order the Wisdom school lists them. */
const PACKS=[
 ['anxiety','Anxiety','anxious nervous uneasy restless agitated jittery uncomfortable'],
 ['worry','Worry','worried troubled distressed concerned unsure uncertain doubting doubtful hesitant insecure confused skeptical'],
 ['fear','Fear','afraid scared fearful fearing threatened terrified frightened panicked panicking shaken'],
 ['stress','Stress','tense stressed pressured overwhelmed tight strained wired braced bracing tensing tightening clenching'],
 ['anger','Anger','angry mad furious pissed enraged explosive heated resentful bitter reactive'],
 ['frustration','Frustration','frustrated irritated annoyed bothered impatient upset fed'],
 ['shame','Shame','ashamed embarrassed humiliated unworthy shaming'],
 ['guilt','Guilt and regret','guilty regretful remorseful sorry apologizing'],
 ['sadness','Sadness','sad hurt lost grieving hopeless empty disappointed'],
 ['collapse','Collapse and fatigue','collapsed collapsing heavy tired weary exhausted drained numb defeated depleted burdened foggy blank'],
 ['stuck','Stuck','stuck frozen trapped locked rigid unable unwilling'],
 ['mistrust','Mistrust','mistrusting distrusting distrustful suspicious guarded defensive'],
 ['withdrawal','Withdrawal','disconnected closed closing rejecting shrinking hiding withdrawn isolated lonely unseen avoiding silencing suppressing'],
 ['belief','Beliefs','believing convinced certain thinking equating assuming mistaking confusing defining identifying'],
 ['holding','Holding on','holding carrying clinging gripping resisting resistant forcing denying forgetting needing trying judging blaming controlling pushing punishing comparing overthinking pretending attached addicted'],
 ['more','More','']];

/* a card line as it is shown: trimmed, its first letter capital, and closed
   on a full stop if it was not closed at all. The words are not touched. */
function lineOf(t){
 let s=String(t||'').replace(/\s+/g,' ').trim();
 if(!s)return '';
 s=s.charAt(0).toUpperCase()+s.slice(1);
 if(!/[.!?]$/.test(s))s+='.';
 return s;}
const EMDASH=String.fromCharCode(0x2014);

function build(opts){
 const upC=commitOf(opts.reboot,opts.ref||'origin/main');
 const f={};for(const k in P)f[k]=blob(opts.reboot,upC,P[k]);
 const man=JSON.parse(f.manifest.text), tails=JSON.parse(f.tails.text), cards=JSON.parse(f.cards.text);
 const index=JSON.parse(f.index.text), layer=JSON.parse(f.layer.text);
 if(!man.files||!man.files.cards||man.files.cards.items!==cards.reduce((n,c)=>n+c.items.length,0))
  throw Error('letgo_cards.json does not carry the item count the manifest records ('+(man.files&&man.files.cards&&man.files.cards.items)+')');
 for(const s of Object.keys(tails.band))if(!SEATS.includes(s))throw Error('letgo_tails.json files a tail under '+s+', which is not one of the seven seats');
 for(const s of Object.keys(index))if(!SEATS.includes(s))throw Error('LETGO.json files a topic under '+s+', which is not one of the seven seats');

 /* THE CUES. Keyed by the normalised phrase, so one phrase filed under two
    seats is one cue carrying both, and the first spelling seen is kept. */
 const cues=new Map(), add=(n,raw,seat,from,extra)=>{
  if(!cues.has(n))cues.set(n,{c:n,raw,seats:[],from,...extra});
  const c=cues.get(n); if(!c.seats.includes(seat))c.seats.push(seat);};
 let tailsSeen=0, indexSeen=0; const stops=voiceStops(), quiet=[], quietLines=[];
 for(const seat of SEATS)for(const t of (index[seat]||[])){
  indexSeen++; const n=norm(t[1]); if(!cueOk(n,2,t[1]))continue;
  if(stops(t[1]).length){quiet.push(t[1]);continue;}
  if(t[5]&&!Object.values(layer).includes(t[5]))throw Error('LETGO.json topic '+t[0]+' names the layer '+t[5]+', which LETGO_LAYER lacks');
  add(n,t[1],seat,'index',{n:t[0],ch:t[4]||'',layer:t[5]||''});}
 for(const seat of SEATS)for(const t of (tails.band[seat]||[])){
  tailsSeen++; const n=norm(t); if(!cueOk(n,3,t))continue;
  if(stops(t).length){quiet.push(t);continue;}
  add(n,t,seat,'tail',{});}
 /* longest first, so the matcher claims "giving up on myself" before
    "giving up", and the order is the same on every run */
 const cueRows=[...cues.values()].sort((a,b)=>b.c.length-a.c.length||(a.c<b.c?-1:1))
  .map(c=>c.from==='index'?[c.c,c.seats.join(' '),'i',c.raw,c.n,c.ch,c.layer]:[c.c,c.seats.join(' '),'t',c.raw]);

 /* THE PACKS */
 const lead=new Map();for(const [id,,ws] of PACKS)for(const w of ws.split(' ').filter(Boolean)){
  if(lead.has(w))throw Error('the feeling word '+w+' is claimed by two packs, '+lead.get(w)+' and '+id);lead.set(w,id);}
 const into={};for(const [id] of PACKS)into[id]=[];
 const seen=new Set(); let all=0, dropped=[], held=[];
 /* A LINE THE SAFETY WORDS TRIP IS NOT CARRIED. engine/safe.js is the rule
    that no release runs on words about ending a life, and a pack is release
    lines a person reads at their own pace with no one beside them. Read
    with the built engine's own srcSafe, so this is that rule and not a
    second copy of it; the gate holds every carried line to srcSafe, so a
    pack written against a stale engine.js is caught there. Measured 21
    November: five lines, one a real one ("no reason to live") and four the
    idiom "cutting myself off", which the safety list reads as cutting. Left
    out over shown, the same side safe.js errs on. */
 const safe=require(path.join(ROOT,'engine.js')).srcSafe;
 if(typeof safe!=='function')throw Error('engine.js carries no srcSafe; build the engine first');
 for(const card of cards)for(const it of card.items){
  all++; const s=lineOf(it); if(!s)continue;
  const k=norm(s); if(seen.has(k))continue; seen.add(k);
  if(s.indexOf(EMDASH)>=0){dropped.push(s);continue;}
  if(safe(s)){held.push(s);continue;}
  if(stops(s).length){quietLines.push(s);continue;}
  const w=k.split(' '); let id=lead.get(w[0]);
  if(!id&&w[0]==='feeling')id=lead.get(w[1]);
  into[id||'more'].push(s);}
 const packs=PACKS.map(([id,nm,ws])=>({id,nm,lead:ws?ws.split(' '):[],lines:into[id]}));
 const carried=packs.reduce((n,p)=>n+p.lines.length,0);

 const origin={schema:'atuned.letgo.mob_snapshot.v1',
  from:{repo:UP,ref:opts.ref||'origin/main',commit:upC,files:Object.keys(P).map(k=>({path:f[k].path,sha:f[k].sha}))},
  intaken:man.intaken, generator:'tools/regen-letgo.cjs'};
 const head='/* GENERATED by tools/regen-letgo.cjs. Do not edit: regenerate.\n'
  +' * Reboot-OS '+upC+' ('+(opts.ref||'origin/main')+'), the Let Go list as intaken '+man.intaken+'.\n'
  +' * Blobs: '+Object.keys(P).map(k=>f[k].path.split('/').pop()+' '+f[k].sha.slice(0,12)).join(', ')+'.\n';

 const cueSnap={origin, counts:{tails:tailsSeen, index:indexSeen, cues:cueRows.length, voice:quiet.length},
  /* each row: [phrase as searched, seat keys, from, phrase as written, and
     for an index row its topic number, channel and layer] */
  cues:cueRows};
 const outCues=head+' * The cues: engine/letgo.js says what a match may and may not be used for. */\n'
  +'var LETGO_SNAPSHOT='+JSON.stringify(cueSnap)+';\n';
 const packSnap={origin, counts:{cards:cards.length, lines:all, distinct:seen.size, carried, dropped:dropped.length, held:held.length, voice:quietLines.length},
  packs};
 const outPacks=head+' * The packs: ui/knowledge.js renders them in the Wisdom school. */\n'
  +'var LETGO_PACKS='+JSON.stringify(packSnap)+';\n';
 for(const o of [outCues,outPacks])if(o.indexOf(EMDASH)>=0||/\\u2014/i.test(o))throw Error('an output still spells an em dash');
 return {cues:outCues, packs:outPacks, dropped, held, quiet:quiet.concat(quietLines)};}

function main(){
 const args=process.argv.slice(2),check=args.includes('--check');
 const ri=args.indexOf('--ref'),ref=ri>=0?args[ri+1]:undefined;
 const pos=args.filter((a,i)=>!a.startsWith('--')&&!(ri>=0&&i===ri+1));
 if(pos.length<1){console.error('Usage: node tools/regen-letgo.cjs <Reboot-OS repo> [--ref R] [--check]');process.exit(2);}
 let out;
 try{out=build({reboot:pos[0],ref});}
 catch(e){console.error('REFUSED '+e.message);process.exit(1);}
 let drift=0;
 for(const [rel,txt] of [[OUT_CUES,out.cues],[OUT_PACKS,out.packs]]){
  const full=path.join(ROOT,rel),old=fs.existsSync(full)?fs.readFileSync(full,'utf8'):'';
  if(old===txt)console.log('MATCH '+rel);
  else if(check){console.error('DRIFT '+rel+': regenerate and review the source SHAs');drift++;}
  else{fs.writeFileSync(full,txt);console.log('REGENERATED '+rel+' ('+Buffer.byteLength(txt)+' bytes)');}}
 if(out.dropped.length)console.log('left out, carrying an em dash the build refuses: '+JSON.stringify(out.dropped));
 if(out.quiet.length)console.log('left out, stopped by the house voice gate: '+JSON.stringify(out.quiet));
 if(out.held.length)console.log('left out, tripping the safety words: '+JSON.stringify(out.held));
 process.exit(drift?1:0);}

if(require.main===module)main();
module.exports={build,norm,cueOk,lineOf,PACKS};
