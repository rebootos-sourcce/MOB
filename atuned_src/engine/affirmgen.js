/* ============================================================
   THE AFFIRMATION GENERATOR, 18 November. Seven lines, one per point, Root to
   Crown, each opening on his anchor (AFF_ANCHOR, engine/data/affirm.js), from
   one theme. The theme is what Source AI spots in the person's own record, a
   Become line, a tag, a banked release, a confirmed claim, the pair chosen on
   the Path, or a word they type. Deterministic and offline: no model, no
   network, the same theme in gives the same seven lines out.

   THE ORDER, every time, and it is load bearing:
     safety   affSafe on the raw text of every source, before anything reads
              it. His package had none and affirmed "I want to hurt myself"
              seven times. In a weave one trip stops the whole set.
     clean    whitespace, quotes at both ends, trailing punctuation, and only
              then the empty test: "..." tested before the strip is not empty
              and composed seven lines about nothing (mutant M5, R3).
     shape    affShape reads what kind of phrase it is, or refuses it by name
              with what to write instead.
     frames   one frame per shape per point. lineOf throws on a line that
              does not open on its anchor in exact case, so the defect his
              Creator Mode shipped, "i magnetize", cannot be emitted.

   NOTHING IS SWAPPED SILENTLY. A held pattern, "fear", is refused and its
   opposite is offered behind one press. A word keeps its part of speech.

   THE ENGINE NEVER READS CURP. affSources is handed the profile and what the
   UI already read (banked rows, claims, the chosen Path pair, a seat reader),
   the way avatarMarks is handed parse and seatOf, so this file reads no store
   and no page. hostfree.py holds it.

   WHY IT SITS AFTER engine/export.js. The decision spec placed it after
   engine/safe.js. Everything it calls is declared before export.js either
   way, and export.js assigns module.exports whole, so a module ahead of it
   would have to edit the list other seats are appending to. charfield.js set
   this precedent: add its own names to what export.js left.
   ============================================================ */

/* A HELD PATTERN AND WHAT RELEASE PUTS BACK, built from CHILD on first use so
   no table copies the canon: a renamed opposite moves here on its own. The
   adjective and common forms follow, each pointing at the same opposite. */
var AFF_FLIP=null;
function affFlips(){
 if(AFF_FLIP)return AFF_FLIP;
 var f={};
 CHILD.forEach(function(c){f[c.nm.toLowerCase()]=c.opp.toLowerCase();});
 /* the adjective and common forms of the nine, and three words the canon
    does not name, each released toward a quality in AFF_ADJ's own words */
 var more={afraid:'Fear', scared:'Fear', angry:'Anger', ashamed:'Shame', disgusted:'Disgust', apathetic:'Apathy',
  shocked:'Shock', sadness:'Sad', surprised:'Surprise'};
 Object.keys(more).forEach(function(w){f[w]=f[more[w].toLowerCase()];});
 f.anxious='calm'; f.anxiety='calm'; f.doubt='confidence';
 return (AFF_FLIP=f);}

/* THE STOP. srcSafe first, the product's one question; then any safeOf hit
   whatever its polarity, because a denied hit in a Become line is recovery
   phrasing and still not a thing to chant; then AFF_STOP, word edged. */
function affSafe(text){
 var t=String(text||'');
 if(srcSafe(t))return {ok:false, why:'src'};
 if(safeOf(t).length)return {ok:false, why:'safeOf'};
 for(var i=0;i<AFF_STOP.length;i++)if(AFF_STOP[i].test(t))return {ok:false, why:'lex'};
 return {ok:true, why:null};}

/* a third person verb to its base and its first person form. is is the one
   whose two differ, so Throat says "I am held" and never "I be held". */
var AFF_IRR={is:['be','am'], has:['have','have'], does:['do','do'], goes:['go','go']};
function affConj(w){
 var f=String(w).toLowerCase(), b=null;
 if(AFF_IRR[f])return AFF_IRR[f];
 if(/ies$/.test(f))b=f.slice(0,-3)+'y';
 else if(/(ches|shes|sses|xes|zes|oes)$/.test(f))b=f.slice(0,-2);
 else if(/[^s]s$/.test(f))b=f.slice(0,-1);
 return b?[b,b]:null;}
function affVp(vb){
 var v1=/^be\b/.test(vb)?vb.replace(/^be\b/,'am'):vb;
 return {k:'vp', vb:vb, v1:v1};}
var AFF_NEG=/^(not|never|no longer|no more|free of|less|without|doesn't|does not|don't|do not)\s+/i;
/* "I am afraid", "I keep failing": a sentence about now, not a thing to do */
var AFF_ISTOP={am:1, was:1, were:1, feel:1, felt:1, think:1, thought:1, hate:1, need:1, "can't":1, cannot:1,
 "don't":1, "won't":1, never:1, keep:1, wish:1};
function affRefuse(k,w,o){
 var s=AFF_SAY[k], say=typeof s==='function'?s(w,o):s;
 return o?{refuse:k, say:say, offer:o}:{refuse:k, say:say};}

/* WHAT KIND OF PHRASE IT IS, first match wins. SPEC.md 3.1 step 6 is the
   rule; this is its executable form, ported from r3/ref.js with its bodies. */
function affShape(raw){
 var t=String(raw||'').replace(/\s+/g,' ').trim()
  .replace(/^["'“”‘’]+|["'“”‘’]+$/g,'')
  .replace(/[.,;:!?…]+$/,'').trim();
 if(!/[A-Za-z]/.test(t))return affRefuse('empty');
 var words=t.split(' '), m;
 if(words.length>12)return affRefuse('long');
 if(/[.!?…]\s+\S/.test(t)||/["“”]/.test(t))return affRefuse('sentence');
 /* an all caps theme is shouted, not named: lowercased whole. Otherwise only
    the first word, so "Sundays" stays "Sundays" and "I" stays "I". */
 if(t===t.toUpperCase()&&/[A-Z]{2}/.test(t))t=t.toLowerCase();
 else if(words[0]!=='I')t=t.charAt(0).toLowerCase()+t.slice(1);
 if((m=t.match(/^(someone|somebody) who (\S+)(.*)$/i))){
  var np=t;
  if(AFF_NEG.test(m[2]+m[3]+' ')||/^(no|never)$/i.test(m[2]))return affRefuse('toward');
  /* WITHOUT A PARSER "her" CANNOT BE TOLD APART as owner or object: "calls
     her mother" is not "calls my mother", and a wrong guess changes who is
     meant. So any other person in the line keeps it whole, after I am. */
  if(/\b(he|she|her|him|they|them|their|and|or)\b/i.test(m[3]))return {k:'np', np:np};
  var c=affConj(m[2]); if(!c)return {k:'np', np:np};
  var rest=m[3].replace(/\bhis\b/gi,'my').replace(/\b(himself|herself)\b/gi,'myself');
  if(/^(stop|quit)$/.test(c[0])&&/^\s+\w+ing\b/.test(rest))return affRefuse('toward');
  var o=affVp(c[0]+rest); o.np=np; return o;}
 /* the same rule ritIAm already says a Become line by, RIT_IAM_RX */
 if(/^(someone|somebody|a|an|the one|the person|the kind of person)\b/i.test(t))return {k:'np', np:t};
 if((m=t.match(/^I (?:want to|will|choose to|am going to|can) (.+)$/)))t='to '+m[1];
 else if((m=t.match(/^I am (\S+)$/)))return affShape(m[1]);
 else if((m=t.match(/^I (\S+)(.*)$/))){
  if(AFF_ISTOP[m[1].toLowerCase()])return affRefuse('sentence');
  t='to '+m[1]+m[2];}
 if((m=t.match(/^to (.+)$/i))){
  var v=m[1];
  if(AFF_NEG.test(v+' ')||/^(stop|quit) \w+ing\b/i.test(v))return affRefuse('toward');
  return affVp(v);}
 if(/^\w+ing\b/.test(t)&&!AFF_ADJ[t])return affRefuse('gerund');
 if(/,|;|\s&\s|\band\b|\bor\b/.test(t))return affRefuse('list');
 if(AFF_PERSON.test(t))return affRefuse('person',t.split(' ')[1]);
 var F=affFlips(), low=t.toLowerCase(), neg=low.replace(AFF_NEG,'');
 if(neg!==low){
  if(F[neg])return affRefuse('flip',neg,F[neg]);
  return affRefuse('toward');}
 if(F[low])return affRefuse('flip',low,F[low]);
 if(AFF_THIN[low])return affRefuse('thin',low);
 if(AFF_ADJ[low])return {k:'adj', a:low};
 if(t.split(' ').length<=4)return {k:'n', n:t};
 return affRefuse('shape');}

/* ONE LINE, and the one place a line is made. Both modes are built here so
   the switch re-renders without composing again, which is his live toggle. */
function affLineOf(i,s,src){
 var f=AFF_FRAMES[s.k][i](s), core=f[0], tail=f[1];
 if(core.indexOf(AFF_ANCHOR[i]+' ')!==0)throw new Error('affirm: line '+i+' does not open on '+AFF_ANCHOR[i]);
 return {b:BANDS[i], anchor:AFF_ANCHOR[i], core:core, tail:tail, plain:core+tail+'.',
  wrapped:AFF_PRE+core+AFF_SUF, src:src||null, composed:true};}
function affStopped(g){return {ok:false, stop:'safety', why:g.why, say:CRISIS_SAY.entryNow, lines:[]};}
function affCompose(theme,src){
 var g=affSafe(theme); if(!g.ok)return affStopped(g);
 var s=affShape(theme);
 if(s.refuse)return {ok:false, refuse:s.refuse, say:s.say, offer:s.offer||null, lines:[]};
 return {ok:true, shape:s.k, lines:BANDS.map(function(b,i){return affLineOf(i,s,src);})};}

/* WHAT COUNTS AS AN INTENTION, and only what the person confirmed. The UI
   reads and hands in; this reads only its arguments.
     path    the pair chosen on the Path, becomingOf(k).who, at its point
     avatar  a Become line, CURP.avatar.pairs[].be, at its seat, else the
             seat its Not be line reads at, exactly as ritAffirm seats it
     tag     a tag the person put on, a CHILD name or its opposite, said as
             the opposite. Any other tag is an address name and no intention
     bank    a Banked release row, said as its fetter's CHILD opposite,
             never as the pattern
     claim   confirmed or corrected: confirmed. supported or candidate:
             heard, which the UI may only offer behind a Yes. inferred,
             rejected and unknown never leave here.
     typed   the person's own word
   Order: the Path pair, Become lines newest first, tags, banked rows, claims,
   then the typed word. One text is one source. */
function affSources(profile,o){
 o=o||{};
 var out=[], seen={};
 var opp={}, seatOf={}, rep={};
 CHILD.forEach(function(c){opp[c.nm]=c.opp; seatOf[c.nm]=c.seat; rep[c.opp]=c.nm;});
 var put=function(key,kind,text,b,state){
  text=String(text||'').replace(/\s+/g,' ').trim(); if(!text)return;
  var id=text.toLowerCase(); if(seen[id])return; seen[id]=1;
  out.push({key:String(key).slice(0,40), kind:kind, text:text, b:(b&&BANDS.indexOf(b)>=0)?b:null, state:state});};
 if(o.pathK&&typeof becomingOf==='function'){
  var bc=becomingOf(o.pathK);
  if(bc&&bc.who)put('pa:'+bc.k,'path',String(bc.who).toLowerCase(),bc.seat,'confirmed');}
 var av=(profile&&profile.avatar&&typeof profile.avatar==='object')?profile.avatar:{};
 var pairs=Array.isArray(av.pairs)?av.pairs:[];
 for(var i=pairs.length-1;i>=0;i--){
  var pr=pairs[i]; if(!pr||typeof pr.be!=='string')continue;
  var be=pr.be.trim().replace(/^"+|"+$/g,''); if(!be)continue;
  var b=(pr.seat&&BANDS.indexOf(pr.seat)>=0)?pr.seat:(typeof o.seatOf==='function'?o.seatOf(pr.notbe||''):null);
  put('av:'+(pr.id||avatarHash(be)),'avatar',be,b,'confirmed');}
 var tags=(av.tags&&typeof av.tags==='object')?av.tags:{};
 BANDS.forEach(function(tb){
  var t=tags[tb]; if(!t||!Array.isArray(t.add))return;
  t.add.forEach(function(w){
   if(typeof w!=='string')return;
   var q=opp[w]!==undefined?opp[w]:(rep[w]!==undefined?w:null);
   if(q)put('tg:'+tb+':'+w,'tag',q.toLowerCase(),tb,'confirmed');});});
 (Array.isArray(o.banked)?o.banked:[]).forEach(function(r){
  if(!r||!opp[r.cf])return;
  put('bk:'+(r.key||r.cf),'bank',opp[r.cf].toLowerCase(),r.b||seatOf[r.cf],'confirmed');});
 var ST={confirmed:'confirmed', corrected:'confirmed', supported:'heard', candidate:'heard'};
 (Array.isArray(o.claims)?o.claims:[]).forEach(function(c){
  if(!c||!ST[c.state])return;
  /* a corrected claim says what the person put in its place */
  var text=(c.state==='corrected'&&typeof c.fix==='string'&&c.fix.trim())?c.fix:(opp[c.cf]||'').toLowerCase();
  put('cl:'+(c.key||c.cf),'claim',text,c.b||seatOf[c.cf],ST[c.state]);});
 if(typeof o.typed==='string')put('ty','typed',o.typed,null,'confirmed');
 return out;}

/* THE WEAVE, "Your record". Each point says the confirmed source seated
   there, and a point nobody seated says the primary. A heard source is never
   composed. Safety runs on every source handed in, heard ones included,
   because a heard line is still the person's words. */
function affWeave(sources,primaryKey){
 sources=Array.isArray(sources)?sources:[];
 for(var i=0;i<sources.length;i++){
  var g=affSafe(sources[i]&&sources[i].text); if(!g.ok)return affStopped(g);}
 var ok=sources.filter(function(x){return x&&x.state==='confirmed';});
 var p=ok.filter(function(x){return x.key===primaryKey;})[0]||ok[0];
 if(!p)return {ok:false, refuse:'empty', say:AFF_SAY.empty, offer:null, lines:[]};
 var ps=affShape(p.text);
 if(ps.refuse)return {ok:false, refuse:ps.refuse, say:ps.say, offer:ps.offer||null, lines:[]};
 return {ok:true, shape:'weave', lines:BANDS.map(function(b,k){
  var at=ok.filter(function(x){return x.b===b&&x!==p;})
   .map(function(x){return {x:x, s:affShape(x.text)};})
   .filter(function(z){return !z.s.refuse;})[0];
  return at?affLineOf(k,at.s,at.x.key):affLineOf(k,ps,p.key);})};}
/* how many points a confirmed source other than the primary is seated at.
   The weave is offered only when it would differ from one source's set. */
function affWeaves(sources){
 var seated={};
 (sources||[]).forEach(function(x){if(x&&x.state==='confirmed'&&x.b&&!affShape(x.text).refuse)seated[x.key]=1;});
 return Object.keys(seated).length>=2;}

/* HIS FORMAT FOR COPY, "* Point: line.", plain text, no markdown and nothing
   else. The labels are the product's point names (BANDS), so Solar and 3rd
   Eye, never Solar Plexus or a chakra. keep leaves out unpressed rows. */
function affPlain(lines,creator,keep){
 return (lines||[]).filter(function(l,i){return !keep||keep[i]!==false;})
  .map(function(l){return '* '+l.b+': '+(creator?l.wrapped:l.plain);}).join('\n');}

/* THE READ BOUNDARY for the kept set on this device (atuned-affirm-kept,
   ui/affirmui.js). Browser storage is anyone's to edit, so a row is only
   drawn if it is the shape the writer writes: a point name, a core that
   opens on that point's anchor, a short tail and a short source key. */
function affKeptOk(row){
 if(!row||typeof row!=='object'||row.composed!==true)return false;
 var i=BANDS.indexOf(row.b); if(i<0)return false;
 if(typeof row.core!=='string'||row.core.length<1||row.core.length>200)return false;
 if(row.core.indexOf(AFF_ANCHOR[i]+' ')!==0)return false;
 if(row.tail!=null&&(typeof row.tail!=='string'||row.tail.length>60))return false;
 if(row.src!=null&&(typeof row.src!=='string'||row.src.length>40))return false;
 return true;}

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{AFF_ANCHOR:AFF_ANCHOR, AFF_PRE:AFF_PRE, AFF_SUF:AFF_SUF, AFF_SAY:AFF_SAY,
  AFF_FRAMES:AFF_FRAMES, AFF_ADJ:AFF_ADJ, AFF_VOICE:AFF_VOICE, AFF_THIN:AFF_THIN, AFF_PERSON:AFF_PERSON,
  AFF_STOP:AFF_STOP, affFlips:affFlips, affSafe:affSafe, affShape:affShape, affCompose:affCompose,
  affSources:affSources, affWeave:affWeave, affWeaves:affWeaves, affPlain:affPlain, affKeptOk:affKeptOk,
  affLineOf:affLineOf});}
