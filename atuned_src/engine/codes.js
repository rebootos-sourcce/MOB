/* ============================================================
   THE CODES, the door. 23 October. The tables are engine/data/codes.js.

   One door turns any label, from any source, into the one code it means, or
   refuses it by name. Nothing here reads a story, moves a number or changes
   what compute() makes, and nothing calls it yet but the gate. It is the
   identity layer the content library and the trace will key on, built first
   so the content that follows has one key to hang on.

   codeOf(label, {source, kind})
     source   one of CODE_SOURCES, mob when left out.
     kind     one of CODE_KINDS, or a list of them, when the caller knows what
              it is looking for. Left out, every kind is a candidate.
   It answers in three steps.
     1. The source's own rows, alias, unmapped and retired, answer first for
        their own kind, because they say what that source means by the label.
     2. Then a code given as itself, a name in MOB's own tables, and the rows
        written for every source, for every kind step one left open.
     3. Only when nothing has answered, the rules the engine names by: a pair
        of saboteurs, A + B, a pair of families, A / B, and an overshot
        reading, A overshot.
   One candidate is the answer. None is unknown. Two or more are ambiguous
   and every candidate is named. A label with no code is refused with the
   reason it has none. Nothing is picked for the caller and nothing is
   matched to a near miss.

   It never throws. Every answer is {ok:true, code, kind, nm, via} or
   {ok:false, why}, and an ambiguous refusal carries its candidates.

   codeEmotionOf(address) IS THE ONE FETTER ASSIGNMENT RULE. It answers with
   the address's n.cf, which core.js sets once at load: a keyword in the
   address's name first (ANTKEY to Anticipation, SURPKEY to Surprise,
   HEARTKEY to Sad), otherwise REROUTE of the node map's charge label. The
   library reads an address's child emotion through this and nowhere else,
   so a page and the reading cannot disagree, and no table stores a second
   answer. If the owner rules for another charge table, the change is that
   table, and every caller follows it.
   ============================================================ */

function codeKey(s){
 return KB_KEY(String(s===undefined||s===null?'':s).trim()).replace(/\s+/g,' ').trim();}

/* every table the codes read, by name, so the gate can hand codesCheck a
   copy with one table changed and the live ones never move */
function codeTables(){
 return {SAB33:SAB33,SABDEF:SABDEF,SAB_LIB:SAB_LIB,SABCARD:SABCARD,SAB_PI:SAB_PI,SAB_PI_AS:SAB_PI_AS,
  SABAUTH:SABAUTH,ALL_SAB:ALL_SAB,HCX_LIB:HCX_LIB,FAM_POLE:FAM_POLE,CHILD:CHILD,CHARGES:CHARGES,
  ARCH:ARCH,ARCH18:ARCH18,NODES:NODES,DESCENT:DESCENT,BANDS:BANDS,B2K:B2K,INFER_NOUN:INFER_NOUN,
  CHG2FET:CHG2FET,REROUTE:REROUTE,
  CODE_SOURCES:CODE_SOURCES,CODE_KINDS:CODE_KINDS,CODE_FAMILY:CODE_FAMILY,CODE_STRUCT:CODE_STRUCT,
  CODE_ARCH:CODE_ARCH,CODE_EMOTION:CODE_EMOTION,CODE_ALIAS:CODE_ALIAS,CODE_UNMAPPED:CODE_UNMAPPED,
  CODE_RETIRED:CODE_RETIRED};}

/* THE INDEX. Built from the tables and never stored in them. codeOf keeps
   one for the live tables, which do not change after load. codesCheck builds
   its own from whatever tables it is handed. */
function codeIndexOf(t){
 var ix={code:Object.create(null),name:Object.create(null),rows:Object.create(null),
  cluster:Object.create(null),live:Object.create(null),t:t};
 var put=function(code,kind,nm,more){var e={code:code,kind:kind,nm:nm};
  if(more)Object.keys(more).forEach(function(k){e[k]=more[k];}); ix.code[code]=e;};
 var named=function(label,code){var k=codeKey(label); if(!k)return;
  var l=ix.name[k]||(ix.name[k]=[]); if(l.indexOf(code)<0)l.push(code);};
 /* saboteurs, by SABDEF's own code, printed the way SAB33 prints them */
 var print=Object.create(null);
 t.SAB33.forEach(function(r){var d=t.SABDEF[codeKey(r[0])]; if(d&&!print[d.c])print[d.c]=r[0];});
 Object.keys(t.SABDEF).forEach(function(k){var c=t.SABDEF[k].c; put(c,'saboteur',print[c]||k); named(k,c);});
 /* inferred clusters: every seat and emotion core.js can build a name for,
    whether or not today's node map makes one. live says whether it does. */
 t.CODE_EMOTION.forEach(function(e){var noun=t.INFER_NOUN[e]||e;
  t.BANDS.forEach(function(b){var c='S.'+t.B2K[b]+'.'+e, nm=b+' '+noun;
   put(c,'cluster',nm,{seat:b,emotion:e}); ix.cluster[codeKey(nm)]=c; named(nm,c);});
  var d='S.diffuse.'+e, dn='Diffuse '+noun;
  put(d,'cluster',dn,{seat:null,emotion:e}); ix.cluster[codeKey(dn)]=d; named(dn,d);});
 t.ALL_SAB.forEach(function(s){if(s.unnamed){var c=ix.cluster[codeKey(s.nm)]; if(c)ix.live[c]=true;}});
 /* families and their poles */
 t.CODE_FAMILY.forEach(function(r){put(r[0],'family',r[1],{cluster:r[2]}); named(r[1],r[0]);
  var p=t.FAM_POLE[r[1]]; if(p){put(r[0]+'o','pole',p,{of:r[0]}); named(p,r[0]+'o');}});
 /* canon.json's complexes and hyper-complexes */
 t.CODE_STRUCT.forEach(function(r){put(r[0],'structure',r[1],{filed:r[2],row:r[3],tag:r[4]}); named(r[1],r[0]);});
 /* addresses, child emotions, archetypes */
 t.NODES.forEach(function(n){var c=String(n.i); put(c,'address',n.k,{n:n.i}); named(n.k,c);});
 t.CODE_EMOTION.forEach(function(e){put(e,'emotion',e); named(e,e);});
 t.CODE_ARCH.forEach(function(r,i){put(r[0],'archetype',r[1],{index:i}); named(r[1],r[0]);});
 /* the rows. A row for several sources is one row per source here. */
 var row=function(type,src,kind,label,code,why,date){
  [].concat(src).forEach(function(s){var k=codeKey(label);
   (ix.rows[k]=ix.rows[k]||[]).push({type:type,source:s,kind:kind,label:label,code:code,why:why,date:date||null});});};
 t.CODE_ALIAS.forEach(function(r){row('alias',r[0],r[1],r[2],r[3],r[4]);});
 t.CODE_UNMAPPED.forEach(function(r){row('unmapped',r[0],r[1],r[2],null,r[3]);});
 t.CODE_RETIRED.forEach(function(r){row('retired',r[0],r[1],r[2],null,r[4],r[3]);});
 return ix;}
var codeCache=null;
function codeIndex(){return codeCache||(codeCache=codeIndexOf(codeTables()));}

/* a value for a refusal, which must never throw on what it was handed:
   JSON.stringify throws on a cycle and on a BigInt */
function codeShow(v){try{var j=JSON.stringify(v); return j===undefined?String(v):j;}catch(e){return 'a '+typeof v;}}
/* a kind with its article, for a sentence */
function codeAn(w){return (/^[aeiou]/i.test(String(w))?'an ':'a ')+w;}
function codeNo(why,more){var o={ok:false,why:why};
 if(more)Object.keys(more).forEach(function(k){o[k]=more[k];}); return o;}

/* a code given as itself: one the index holds, or one the rules compose, in
   its one spelling. A pair's two codes are sorted, so a pair written the
   other way round is not its code. */
function codeParse(ix,code){
 if(typeof code!=='string'||!code)return null;
 var e=ix.code[code];
 if(e){var o={}; Object.keys(e).forEach(function(k){o[k]=e[k];});
  if(e.kind==='cluster')o.live=!!ix.live[e.code]; return o;}
 if(code.indexOf('/')>=0)return codeTwo(ix,code,'/',' / ',['family','pole'],'family-pair');
 if(code.indexOf('+')>=0)return codeTwo(ix,code,'+',' + ',['saboteur','cluster','overshot'],'pair');
 var m=/^(.+)\.over$/.exec(code);
 if(m){var b=codeParse(ix,m[1]);
  if(!b||(b.kind!=='saboteur'&&b.kind!=='cluster'))return null;
  var ov={code:code,kind:'overshot',nm:b.nm+' overshot',of:b.code};
  if(b.kind==='cluster')ov.live=b.live; return ov;}
 return null;}
function codeTwo(ix,code,sep,say,kinds,kind){
 var p=code.split(sep); if(p.length!==2||!(p[0]<p[1]))return null;
 var a=codeParse(ix,p[0]), b=codeParse(ix,p[1]);
 if(!a||!b||kinds.indexOf(a.kind)<0||kinds.indexOf(b.kind)<0)return null;
 return {code:code,kind:kind,nm:a.nm+say+b.nm,parts:[a.code,b.code]};}

function codeYes(ix,code,via,why){var e=codeParse(ix,code);
 if(!e)return codeNo(JSON.stringify(code)+' is not a code this table can read, which is a defect in the table that points at it');
 e.ok=true; e.via=via; if(why)e.why=why; return e;}

function codeResolve(ix,label,hint,depth){
 hint=hint&&typeof hint==='object'?hint:{};
 var srcs=ix.t.CODE_SOURCES.map(function(r){return r[0];}).filter(function(s){return s!=='any';});
 var src=hint.source===undefined||hint.source===null?'mob':hint.source;
 if(srcs.indexOf(src)<0)
  return codeNo('the source '+codeShow(src)+' is not one a label is read under: '+srcs.join(', '));
 var kinds=null;
 if(hint.kind!==undefined&&hint.kind!==null){
  kinds=[].concat(hint.kind); var known=ix.t.CODE_KINDS.map(function(r){return r[0];});
  if(!kinds.length||kinds.some(function(k){return known.indexOf(k)<0;}))
   return codeNo('the kind '+codeShow(hint.kind)+' is not one CODE_KINDS names: '+known.join(', '));}
 if(typeof label==='number'&&isFinite(label))label=String(label);
 if(typeof label!=='string'||!label.trim())
  return codeNo('a label is a string with something in it, got '+codeShow(label));
 var raw=label.trim(), k=codeKey(raw), rows=ix.rows[k]||[];
 /* 1. this source's own rows answer for their own kind */
 var cand=rows.filter(function(r){return r.source===src;}), mine={};
 cand.forEach(function(r){mine[r.kind]=true;});
 var add=function(c){if(!mine[c.kind])cand.push(c);};
 /* 2. the code itself, MOB's own names, the rows for every source */
 var lit=codeParse(ix,raw); if(lit)add({type:'code',code:lit.code,kind:lit.kind});
 (ix.name[k]||[]).forEach(function(c){add({type:'name',code:c,kind:ix.code[c].kind});});
 rows.forEach(function(r){if(r.source==='any')add(r);});
 if(kinds)cand=cand.filter(function(c){return kinds.indexOf(c.kind)>=0;});
 var seen={}, one=[];
 cand.forEach(function(c){var id=c.code?'code '+c.code:c.type+' '+c.kind;
  if(!seen[id]){seen[id]=true; one.push(c);}});
 if(!one.length){
  /* 3. the rules, only when nothing has answered */
  var ru=codeRule(ix,raw,src,kinds,depth); if(ru)return ru;
  return codeNo(JSON.stringify(raw)+' is not a code, nor a name '+src+' has a code or a row for'
   +(kinds?', as '+codeAn(kinds.join(' or ')):''));}
 if(one.length===1){var c=one[0];
  if(c.type==='unmapped')return codeNo(JSON.stringify(raw)+' has no '+c.kind+' code: '+c.why,{kind:c.kind,source:c.source});
  if(c.type==='retired')return codeNo(JSON.stringify(raw)+' was retired as '+codeAn(c.kind)+' on '+c.date+': '+c.why,
   {kind:c.kind,source:c.source,retired:c.date});
  return codeYes(ix,c.code,c.type,c.type==='alias'?c.why:null);}
 return codeNo(JSON.stringify(raw)+' is ambiguous, so name the kind: '+one.map(function(c){
   return c.code?c.code+', '+codeAn(c.kind):'no '+c.kind+' code';}).join('; '),
  {candidates:one.map(function(c){return {code:c.code||null,kind:c.kind,type:c.type};})});}

/* THE RULES. A pair and a pair of families split first, because a part may
   itself be overshot: "Judge + Heart Mourner overshot" is a pair. */
function codeRule(ix,raw,src,kinds,depth){
 if(depth>3)return null;
 var want=function(k){return !kinds||kinds.indexOf(k)>=0;};
 var two=function(say,joint,partKinds,kind){
  var p=raw.split(say);
  if(p.length!==2)return codeNo(JSON.stringify(raw)+' reads as '+codeAn(kind)+', which has two parts, and it has '+p.length);
  var a=codeResolve(ix,p[0],{source:src,kind:partKinds},depth+1);
  if(!a.ok)return codeNo(JSON.stringify(raw)+' reads as '+codeAn(kind)+', and its first part does not resolve: '+a.why);
  var b=codeResolve(ix,p[1],{source:src,kind:partKinds},depth+1);
  if(!b.ok)return codeNo(JSON.stringify(raw)+' reads as '+codeAn(kind)+', and its second part does not resolve: '+b.why);
  if(a.code===b.code)return codeNo(JSON.stringify(raw)+' pairs '+a.code+' with itself, and one voice counted twice is not a pair');
  return codeYes(ix,[a.code,b.code].sort().join(joint),'rule');};
 if(raw.indexOf(' / ')>=0&&want('family-pair'))return two(' / ','/',['family','pole'],'family-pair');
 if(raw.indexOf(' + ')>=0&&want('pair'))return two(' + ','+',['saboteur','cluster','overshot'],'pair');
 var m=/^(.*\S)\s+overshot$/i.exec(raw);
 if(m&&want('overshot')){
  var b=codeResolve(ix,m[1],{source:src,kind:['saboteur','cluster']},depth+1);
  if(!b.ok)return codeNo(JSON.stringify(raw)+' reads as an overshot reading, and what it overshoots does not resolve: '+b.why);
  return codeYes(ix,b.code+'.over','rule');}
 return null;}

function codeOf(label,hint){return codeResolve(codeIndex(),label,hint,0);}
function codeKind(code){var e=codeParse(codeIndex(),code); return e?e.kind:null;}
function codeName(code){var e=codeParse(codeIndex(),code); return e?e.nm:null;}
/* every code the tables enumerate, of one kind or all. Pairs and overshot
   readings are composed by rule and are not listed. */
function codeList(kind){var ix=codeIndex();
 return Object.keys(ix.code).filter(function(c){return !kind||ix.code[c].kind===kind;});}

/* the code of one entry a reading made, compute()'s sabs, cxs, hys and sups,
   asked as the kind its rung can be. A rung naming another kind is drift and
   is refused, which is what holds the reading and the table together. */
function codeOfEntry(o){
 if(!o||typeof o!=='object'||typeof o.nm!=='string')
  return codeNo('an entry of a reading is an object with a name, got '+(o===null?'null':typeof o));
 var kinds=o.kind==='sab'?(o.over?['overshot']:['saboteur','cluster'])
  :o.kind==='cx'?['pair']:o.kind==='hy'?(o.over?['pole']:['family']):o.kind==='sup'?['family-pair']:null;
 if(!kinds)return codeNo('an entry of a reading is a sab, cx, hy or sup, got '+codeShow(o.kind));
 return codeOf(o.nm,{source:'mob',kind:kinds});}

function codeEmotionOf(a){
 var s=typeof a==='number'?String(a):typeof a==='string'?a.trim():'';
 var n=/^\d+$/.test(s)?BY[+s]:undefined;
 if(!n)return codeNo('address '+codeShow(a)+' is not one NODES holds');
 if(String(n.b).indexOf('Field')===0)
  return codeNo('address '+n.i+', '+n.k+', is a field node outside the body, so it carries no child emotion');
 if(!n.cf)return codeNo('address '+n.i+', '+n.k+', carries no charge on the node map, so the rule gives it no child emotion');
 return {ok:true,code:n.cf,kind:'emotion',nm:n.cf,via:'rule',address:n.i};}

/* THE CHECK. Every problem it finds, by name, and an empty list when there
   are none. It reads the tables it is handed, the live ones by default, so a
   gate can prove each check bites on a copy with one thing broken. */
function codesCheck(t){
 var out=[];
 try{codesCheckInto(t||codeTables(),out);}
 catch(e){out.push('codesCheck could not finish on these tables: '+(e&&e.message?e.message:String(e)));}
 return out;}
function codesCheckInto(t,out){
 var no=function(m){out.push(m);};
 var ix=codeIndexOf(t), res=function(l,h){return codeResolve(ix,l,h,0);};
 var dupes=function(list){var s={},d=[];
  list.forEach(function(x){if(s[x]&&d.indexOf(x)<0)d.push(x); s[x]=true;}); return d;};
 var run=function(codes,pre,width,nm){
  var re=new RegExp('^'+pre+'(\\d{'+width+'})$'), n=[];
  codes.forEach(function(c){var m=re.exec(c);
   if(!m)no(nm+' has the code '+JSON.stringify(c)+', which is not '+pre+' and '+width+' digits'); else n.push(+m[1]);});
  dupes(codes).forEach(function(c){no(nm+' gives the code '+c+' twice');});
  for(var i=1;i<=n.length;i++)if(n.indexOf(i)<0){no(nm+' skips '+pre+String(i).padStart(width,'0')); break;}};
 var srcIds=t.CODE_SOURCES.map(function(r){return r[0];}), kindIds=t.CODE_KINDS.map(function(r){return r[0];});

 /* the sources and the kinds */
 dupes(srcIds).forEach(function(s){no('CODE_SOURCES names '+s+' twice');});
 dupes(kindIds).forEach(function(k){no('CODE_KINDS names '+k+' twice');});
 ['mob','any'].forEach(function(s){if(srcIds.indexOf(s)<0)no('CODE_SOURCES has no '+s);});
 t.CODE_SOURCES.concat(t.CODE_KINDS).forEach(function(r){
  if(typeof r[1]!=='string'||!r[1].trim())no(r[0]+' says nothing about what it is');});
 var used={overshot:1,pair:1,'family-pair':1};
 Object.keys(ix.code).forEach(function(c){used[ix.code[c].kind]=1;});
 kindIds.forEach(function(k){if(!used[k])no('CODE_KINDS names '+k+', and no code is of that kind');});
 Object.keys(used).forEach(function(k){if(kindIds.indexOf(k)<0)no('a code is of the kind '+k+', which CODE_KINDS does not name');});

 /* saboteurs. Every MOB table that names one names a SABDEF key. */
 run(Object.keys(t.SABDEF).map(function(k){return t.SABDEF[k].c;}),'S',2,'SABDEF');
 var sabKey=function(n){return !!t.SABDEF[codeKey(n)];};
 [['SAB33',t.SAB33.map(function(r){return r[0];})],['SAB_LIB',t.SAB_LIB.map(function(s){return s.nm;})],
  ['SABCARD',Object.keys(t.SABCARD)],['SAB_PI',t.SAB_PI],['SAB_PI_AS',Object.keys(t.SAB_PI_AS)],
  ['ARCH18',t.ARCH18.map(function(a){return a[1];})]].forEach(function(p){
  p[1].forEach(function(n){if(!sabKey(n))no(p[0]+' names the saboteur '+JSON.stringify(n)+', which SABDEF has no code for');});});
 Object.keys(t.SABDEF).forEach(function(k){
  if(!t.SAB33.some(function(r){return codeKey(r[0])===k;}))no('SABDEF codes '+k+', and SAB33 has no row for it');});
 Object.keys(t.SAB_PI_AS).forEach(function(k){var own=t.SABDEF[codeKey(k)], r=res(t.SAB_PI_AS[k],{kind:'saboteur'});
  if(own&&(!r.ok||r.code!==own.c))no('SAB_PI_AS keeps '+JSON.stringify(t.SAB_PI_AS[k])+' for '+k
   +', and it does not resolve to '+own.c+': '+(r.ok?r.code:r.why));});
 var rowSays=function(label,kind,type){return (ix.rows[codeKey(label)]||[]).some(function(x){
  return x.type===type&&x.kind===kind&&(x.source==='mob'||x.source==='any');});};
 Object.keys(t.SABAUTH).forEach(function(k){
  if(!sabKey(k)&&!rowSays(k,'saboteur','unmapped'))
   no('SABAUTH names '+JSON.stringify(k)+', which has no saboteur code and no row saying why not');});

 /* clusters. Every inferred row is a name the rule builds, and its addresses
    carry the emotion, in the seat, its code says. */
 var byI={}; t.NODES.forEach(function(n){byI[n.i]=n;});
 t.ALL_SAB.forEach(function(s){
  if(!s.unnamed){if(!sabKey(s.nm))no('ALL_SAB carries '+JSON.stringify(s.nm)+', which SABDEF has no code for'); return;}
  var c=ix.cluster[codeKey(s.nm)];
  if(!c){no('ALL_SAB carries the inferred '+JSON.stringify(s.nm)+', which is not a name the cluster rule builds'); return;}
  var e=ix.code[c], off=s.nids.filter(function(i){var n=byI[i];
   return !n||n.cf!==e.emotion||(e.seat!==null&&n.b!==e.seat);});
  if(off.length)no('the inferred '+s.nm+' is coded '+c+', and its addresses '+off.join(', ')+' do not carry '
   +e.emotion+(e.seat?' in the '+e.seat:''));
  if(!!s.diffuse!==(e.seat===null))no('the inferred '+s.nm+' is '+(s.diffuse?'diffuse':'in one seat')+', and its code '+c+' says otherwise');});
 t.BANDS.forEach(function(b){if(!t.B2K[b])no('B2K has no key for the seat '+b+', so its clusters have no code');});
 dupes(t.BANDS.map(function(b){return t.B2K[b];})).forEach(function(k){no('B2K gives two seats the key '+k);});
 if(t.BANDS.some(function(b){return t.B2K[b]==='diffuse';}))no('B2K keys a seat diffuse, the word the cross seat clusters take');
 dupes(t.CODE_EMOTION.map(function(e){return codeKey(t.INFER_NOUN[e]||e);})).forEach(function(n){
  no('INFER_NOUN gives two emotions the noun '+n+', so one cluster name would mean two');});

 /* families and poles. CODE_FAMILY and HCX_LIB hold the same names, in any order. */
 run(t.CODE_FAMILY.map(function(r){return r[0];}),'K',1,'CODE_FAMILY');
 var fam=t.CODE_FAMILY.map(function(r){return r[1];}), hcx=t.HCX_LIB.map(function(h){return h.nm;});
 dupes(fam).forEach(function(n){no('CODE_FAMILY codes '+n+' twice');});
 fam.filter(function(n){return hcx.indexOf(n)<0;}).forEach(function(n){no('CODE_FAMILY codes '+n+', which HCX_LIB does not carry');});
 hcx.filter(function(n){return fam.indexOf(n)<0;}).forEach(function(n){no('HCX_LIB carries '+n+', which CODE_FAMILY gives no code');});
 Object.keys(t.FAM_POLE).forEach(function(n){if(fam.indexOf(n)<0)no('FAM_POLE poles '+n+', which CODE_FAMILY does not code');});
 fam.forEach(function(n){if(!t.FAM_POLE[n])no(n+' has no pole in FAM_POLE, so a reading past it has no code');});
 var poles=fam.map(function(n){return t.FAM_POLE[n];}).filter(Boolean);
 dupes(poles.map(codeKey)).forEach(function(p){no('FAM_POLE gives two families the pole '+p);});
 poles.forEach(function(p){if(fam.some(function(f){return codeKey(f)===codeKey(p);}))no('the pole '+p+' is also the name of a family');});

 /* structures */
 run(t.CODE_STRUCT.map(function(r){return r[0];}),'X',2,'CODE_STRUCT');
 dupes(t.CODE_STRUCT.map(function(r){return codeKey(r[1]);})).forEach(function(n){no('CODE_STRUCT names '+n+' twice');});
 var filed={};
 t.CODE_STRUCT.forEach(function(r){
  if(r[2]!=='complex'&&r[2]!=='hyper_complex')no('CODE_STRUCT files '+r[1]+' in '+JSON.stringify(r[2])+', which is not one of canon.json\'s two registers');
  if(['R','I','G'].indexOf(r[4])<0)no('CODE_STRUCT tags '+r[1]+' '+JSON.stringify(r[4])+', which is not R, I or G');
  (filed[r[2]]=filed[r[2]]||[]).push(r[3]);});
 Object.keys(filed).forEach(function(f){var rs=filed[f].slice().sort(function(a,b){return a-b;});
  for(var i=0;i<rs.length;i++)if(rs[i]!==i){no('CODE_STRUCT\'s '+f+' rows are not each row of the register once, from 0'); break;}});

 /* archetypes. The record stores ARCH's index and ARCH's name, so both are held. */
 run(t.CODE_ARCH.map(function(r){return r[0];}),'AR',2,'CODE_ARCH');
 if(t.CODE_ARCH.length!==t.ARCH.length)
  no('CODE_ARCH has '+t.CODE_ARCH.length+' rows and ARCH has '+t.ARCH.length+', and p.soul.arcs stores the ARCH index');
 t.ARCH.forEach(function(a,i){var r=t.CODE_ARCH[i];
  if(!r||r[1]!==a.nm)no('ARCH['+i+'] is '+a.nm+' and CODE_ARCH row '+i+' is '+(r?r[1]:'missing')
   +'. p.soul.arcs stores the index and p.avatar.arch the name, so ARCH may not reorder or rename without a migration');});
 t.ARCH18.forEach(function(a){
  if(!res(a[0],{kind:'archetype'}).ok&&!rowSays(a[0],'archetype','unmapped'))
   no('ARCH18 names the archetype '+a[0]+', which has no code and no row saying why not');});

 /* child emotions, and the routing and the rule only ever land on one */
 var emo=t.CODE_EMOTION, child=t.CHILD.map(function(c){return c.nm;});
 dupes(emo).forEach(function(e){no('CODE_EMOTION names '+e+' twice');});
 [['CHILD',child],['CHARGES',t.CHARGES]].forEach(function(p){
  p[1].filter(function(n){return emo.indexOf(n)<0;}).forEach(function(n){no(p[0]+' carries '+n+', which CODE_EMOTION does not freeze');});
  emo.filter(function(n){return p[1].indexOf(n)<0;}).forEach(function(n){no('CODE_EMOTION freezes '+n+', which '+p[0]+' does not carry');});});
 Object.keys(t.REROUTE).forEach(function(k){if(emo.indexOf(t.REROUTE[k])<0)no('REROUTE sends '+k+' to '+t.REROUTE[k]+', which is not a child emotion');});
 Object.keys(t.CHG2FET).forEach(function(k){if(emo.indexOf(t.CHG2FET[k])<0)no('CHG2FET sends '+k+' to '+t.CHG2FET[k]+', which is not a child emotion');});
 t.NODES.forEach(function(n){if(n.cf!==undefined&&n.cf!==null&&emo.indexOf(n.cf)<0)
  no('address '+n.i+' carries '+n.cf+', which is not a child emotion');});

 /* addresses */
 var ids=t.NODES.map(function(n){return n.i;});
 ids.forEach(function(i){if(!(typeof i==='number'&&i>0&&Math.floor(i)===i))
  no('NODES carries the id '+JSON.stringify(i)+', which is not a whole number above zero');});
 dupes(ids).forEach(function(i){no('NODES carries the address '+i+' twice');});
 for(var i=1;i<=ids.length;i++)if(ids.indexOf(i)<0){no('NODES skips the address '+i); break;}
 dupes(t.NODES.map(function(n){return codeKey(n.k);})).forEach(function(k){no('NODES gives two addresses the name '+k);});

 /* a name may not take the shape of a rule, and a cluster name is no other
    code's, so a name and a rule never answer for one label */
 Object.keys(ix.name).forEach(function(k){
  if(/ \+ | \/ | overshot$/.test(k))no('the name '+k+' takes the shape of a rule');
  var cs=ix.name[k], cl=cs.filter(function(c){return ix.code[c].kind==='cluster';});
  if(cl.length&&cs.length>cl.length)no('the cluster name '+k+' is also the name of '
   +cs.filter(function(c){return ix.code[c].kind!=='cluster';}).join(', '));});

 /* DESCENT names structures */
 t.DESCENT.forEach(function(d){var r=res(d.nm,{kind:'structure'});
  if(!r.ok)no('DESCENT names '+d.nm+', which does not resolve to a structure: '+r.why);});

 /* the rows: well formed, one answer per source, kind and label, and each
    still saying something the tables do not */
 var once={};
 var form=function(tbl,r,why){
  var src=[].concat(r[0]), kind=r[1], label=r[2];
  if(!src.length)no(tbl+' has a row with no source: '+JSON.stringify(r));
  src.forEach(function(s){if(srcIds.indexOf(s)<0)no(tbl+' row '+JSON.stringify(label)+' names the source '+JSON.stringify(s)+', which CODE_SOURCES does not');});
  if(kindIds.indexOf(kind)<0)no(tbl+' row '+JSON.stringify(label)+' names the kind '+JSON.stringify(kind)+', which CODE_KINDS does not');
  if(typeof label!=='string'||!codeKey(label))no(tbl+' has a row with no label: '+JSON.stringify(r));
  if(typeof why!=='string'||!why.trim())no(tbl+' row '+JSON.stringify(label)+' gives no reason');
  src.forEach(function(s){var id=s+' '+kind+' '+codeKey(label);
   if(once[id])no('two rows say what '+JSON.stringify(label)+' is as '+codeAn(kind)+' for '+s+', in '+once[id]+' and '+tbl);
   once[id]=tbl;});
  return {src:src,kind:kind,label:label,under:src.map(function(s){return s==='any'?'mob':s;})};};
 var nativeOf=function(o){return (ix.name[codeKey(o.label)]||[]).filter(function(c){return ix.code[c].kind===o.kind;});};
 t.CODE_ALIAS.forEach(function(r){var o=form('CODE_ALIAS',r,r[4]), e=codeParse(ix,r[3]);
  if(!e){no('CODE_ALIAS points '+JSON.stringify(o.label)+' at '+JSON.stringify(r[3])+', which is not a code'); return;}
  if(e.kind!==o.kind)no('CODE_ALIAS calls '+JSON.stringify(o.label)+' '+codeAn(o.kind)+' and points it at '+r[3]+', which is '+codeAn(e.kind));
  if(nativeOf(o).indexOf(r[3])>=0)no('CODE_ALIAS row '+JSON.stringify(o.label)+' is now '+r[3]+'\'s own name, so the row says nothing');
  o.under.forEach(function(s){var x=res(o.label,{source:s,kind:o.kind});
   if(!x.ok||x.code!==r[3])no('CODE_ALIAS says '+JSON.stringify(o.label)+' is '+r[3]+' for '+s+', and it resolves '
    +(x.ok?'to '+x.code:'to nothing: '+x.why));});});
 var refused=function(tbl,o,word){
  var n=nativeOf(o); if(n.length)no(tbl+' says '+JSON.stringify(o.label)+' has no '+o.kind+' code, and it is now the name of '+n.join(', '));
  o.under.forEach(function(s){var x=res(o.label,{source:s,kind:o.kind});
   if(x.ok||x.why.indexOf(word)<0)no(tbl+' row '+JSON.stringify(o.label)+' for '+s+' does not refuse as it says, it answers '
    +(x.ok?x.code:x.why));});};
 t.CODE_UNMAPPED.forEach(function(r){refused('CODE_UNMAPPED',form('CODE_UNMAPPED',r,r[3]),' code: ');});
 t.CODE_RETIRED.forEach(function(r){var o=form('CODE_RETIRED',r,r[4]);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(r[3])))no('CODE_RETIRED retires '+JSON.stringify(o.label)+' on '+JSON.stringify(r[3])+', which is not a date');
  refused('CODE_RETIRED',o,'was retired');});}
