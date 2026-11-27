/* ============================================================
   THE INSIGHT READING. 18 November, the owner's words, on the right rail:
   "Whatever I select, it should give me source AI's reading of the cascade
   of that information, how it flows through me, and what the appropriate
   actions are." And: "The insight panel will always show 3 paragraphs with
   dots for more information that you can select and click through."

   WHAT THIS IS. One pure function, insightRead(sel, r, g, o). It takes what
   was selected, the reading compute() made, the trace graph when there is
   one, and a few facts only the host knows (is the safety check on, which
   addresses have already been released, how the avatar ranks them), and it
   returns four registers, one a page (THE FOUR REGISTERS, below; until 20
   November it was three paragraphs a page). No language model: every clause is a
   fixed template plus a named record field or a computed figure, and a slot
   with no data is dropped or said as one short gap sentence. It is never
   filled by invention. 17 November, his words: "the insight panel is source
   ai's translation of whats selected."

   THE SEGMENT SHAPE IS THE POINT. A paragraph is a list of segments, and a
   segment is {t, text, src, kind, speak}, plus fig (the percents it prints,
   each with the registry kind and the value they were read from) and q (the
   words it quotes). src is a list of dotted paths that insightResolve can
   walk back to the field the clause came from. That is what the CQ 10 law
   monitor needs in order to check a Source AI sentence, and it is the seam an
   audio button can speak from, character for character: the screen and the
   voice render from one list, and nobody ever runs a pattern over HTML.

     kind   model  the product's own map, true by construction
            mine   a fact read off this person's record
            quote  the person's own words (none are quoted yet: every
                   imprint the sniffer places is inferred, and an inferred
                   imprint is never quoted at an address)
            book   a library line, quoted, its source on hover
            offer  an action the product can actually run
            gap    what is missing, said once and short
     speak  false on any segment holding a percent or a body place, the same
            line the voice branch already holds

   WHAT IT MAY NEVER SAY. A percent is fmtPct of the field it names and never
   a decimal. A body place is the map's, never claimed as the person's. A
   graph edge is a registration and never a cause. An offer says is
   available, you can or if you want, and never should, must, need to or
   have to. No identity sentence: a pattern is something you run. No word of
   the clinical register (HCXCARD sub, impact and behavior are never printed).
   When the safety check holds, the third paragraph is the safety line and
   nothing else is offered.

   leaves() and patFam() moved here from ui/component.js unchanged, because
   the composer needs them and the engine may not read a renderer. The names
   did not change, so every caller still finds them.
   ============================================================ */

/* every address a pattern is built on, once each */
function leaves(o){if(!o||!o.parts)return o?[o]:[];
 var a=[],sn={};(function dig(x){if(x.parts)x.parts.forEach(dig);
  else if(!sn[x.i]){sn[x.i]=1;a.push(x);}})(o);return a;}
/* THE SEAT A PATTERN'S CHARGE SITS IN, 27 November. His words on the live
   rail: "the insight panel has red, but there's nothing in it that's red."
   The rail coloured a pattern by its first address, (leaves(o)[0]).b, and the
   first address is the lowest numbered one, which is a Root address whenever
   the pattern touches Root at all, because the Root addresses are numbered
   first. So a pattern drew Root's red when Root held a sliver of it (Gordon's
   Micromanager + Solar Striker: one Root address, eight Solar, painted red),
   or none of it (an overshot pattern carries no held charge at its addresses
   and still painted red). The same first-is-dominant default the face's
   centre glow had (ui/srcface.js, DOM=-1). This answers the seat carrying the
   most charge over the pattern's own addresses, summed by seat, and null when
   none of them carries any: a pattern with no charge has no seat colour to
   claim, and the caller draws it neutral, never Root. */
function patSeat(o){
 var by={},best=null,bv=0;
 leaves(o).forEach(function(n){var v=+n.sq||0; if(n&&n.b&&v>0)by[n.b]=(by[n.b]||0)+v;});
 BANDS.forEach(function(b){if((by[b]||0)>bv){bv=by[b];best=b;}});
 return best;}
/* THE FAMILY A PATTERN BELONGS TO, AND ITS RECORD. 4 November, his live
   reaction to the pattern drill: the words must come "from the records", and
   "built from 5 held addresses" is "a big no". A saboteur and a complex name
   their family in hcx, a hyper complex is its family; the record is HCX_LIB's
   d, the line that already prints on every hover of a hyper complex. An
   overshoot family has no row there, and its sentence is the one compute()
   gives the same family (engine/compute.js, FAMS), read the same way here
   off FAM_POLE so the two cannot word it differently. */
function patFam(o){
 var nm=!o?'':o.kind==='hy'?o.nm:(o.hcx||''); if(!nm)return null;
 var h=HCX_LIB.filter(function(x){return x.nm===nm;})[0];
 if(h)return {nm:nm,d:h.d};
 var base=Object.keys(FAM_POLE).filter(function(k){return FAM_POLE[k]===nm;})[0];
 return base?{nm:nm,d:'the fix for '+base.toLowerCase()+', done past the point where it helps'}:null;}

/* ---------- the words ---------- */
var INS_WORD={sab:'saboteur',cx:'complex',hy:'hyper complex',sup:'super complex'};
var INS_CAP={sab:'Saboteur',cx:'Complex',hy:'Hyper complex',sup:'Super complex',fet:'Child emotion',
 addr:'Address',dom:'Blueprint domain',arch:'Archetype',mask:'Mask',law:'Law',seat:'Point',core:'Core',
 path:'Compass',bal:'Balance',atom:'Imprint',gates:'Gates',pole:'Pole'};
var INS_LIST={sab:'sabs',cx:'cxs',hy:'hys',sup:'sups'};
var INS_UP={sab:'cx',cx:'hy',hy:'sup'};
/* THE FOUR REGISTERS, one a page. OVERRIDDEN, 20 November, his words on this
   rail: "I want to be able to cycle through the depth of the insight... from
   what it is and how it works down to the behavior, down to the mechanic...
   not compressed insight on one page." 18 November's "always show 3
   paragraphs" put all of it on one page under Where it sits, How it runs and
   What to do, and the dots paged sideways into the next record. The dots now
   page down through one selection, in his order, and the run-in header of
   each page is the register's name, a label and never data. The first three
   are the three paragraphs that were already written, the fourth is the
   chain they used to fold into the first: what it is built from and what it
   feeds. */
var INS_HEAD=['What it is.','How it works.','The behaviour.','The mechanic.'];
var INS_REG=['what','how','behaviour','mechanic'];
var INS_REG_NAME=['What it is','How it works','The behaviour','The mechanic'];
/* the register ceilings. A page holds one register now, so 210 is no longer a
   sum across three: each ceiling keeps one register inside a short scroll at
   390, and the chain that moved out of the first is the fourth's own 70. */
var INS_MAX=[70,70,60,70];
var INS_BAN=/\b(should|must|need to|needs to|have to|has to)\b/i;
/* what a person sees on hover over a book line: where it came from, in words */
var INS_SRC_WORDS={SABDEF:'the saboteur record',SABCARD:'the saboteur card',HCX_LIB:'the hyper complex record',
 HCXCARD:'the hyper complex card',CHILD:'the child emotion table',AFFIRM:'the affirmation table',
 CHALLENGE:'the daily challenge table',DOMDEF:'the domain record',APC:'the point record',HARM:'the law record',
 ARCH:'the archetype record',MASKS:'the mask record',NODES:'the address table',FAM_POLE:'the family table',
 CRISIS_SAY:'the safety line',VERP:'the Laws of Action record',TIER_BY:'the coherence word record'};

/* ---------- small helpers ---------- */
function insArt(w){return /^[aeiou]/i.test(w)?'an':'a';}
function insCap1(s){s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1);}
function insLow1(s){s=String(s||'');return s.charAt(0).toLowerCase()+s.slice(1);}
function insWords(s){var t=String(s||'').trim();return t?t.split(/\s+/).length:0;}
function insSeat(b){return b==='3rd Eye'?'3rd eye':String(b||'').toLowerCase();}
/* WHERE A CHILD EMOTION SITS, as a phrase that carries its own preposition. The
   table names six of them as places ('Cardiac plexus') and three as regions or
   a direction ('Below the heart', 'Prefrontal and dermis'), and 'at the below
   the heart' came out of a reading, found by looking at it. A direction stands
   alone, and a pair of regions says what it is a region of. */
function insAtPlace(a){
 var s=String(a||'').toLowerCase();
 if(/^(below|above|behind|under|beside)\b/.test(s))return s;
 return 'at the '+s.replace(/^(prefrontal|sacral) and /,'$1 region and ');}
/* WHERE AN ADDRESS SITS. A somatic address is seated at a named plexus or nerve
   and says so. The four field anchors have none (their nerve is null) and sit
   above or below the body, which a scan of every reading found as 'at the
   null'. */
function insNodeAt(n){
 if(n&&n.n)return 'at the '+String(n.n).toLowerCase();
 return /below/i.test(String(n&&n.b))?'below the body':'above the body';}
function insBase(o){return traceSummaryBase(o.nm);}
function insFirst(s){var t=String(s||'').trim(), m=/^(.*?[.!?])(\s|$)/.exec(t);return m?m[1]:t;}
function insFind(r,kind,nm){return (r[INS_LIST[kind]]||[]).filter(function(x){return x.nm===nm;})[0]||null;}
function insUp(o,r){
 var up=INS_UP[o.kind]; if(!up)return null;
 return (r[INS_LIST[up]]||[]).filter(function(p){
  return (p.parts||[]).some(function(c){return c.kind===o.kind&&c.nm===o.nm;});})[0]||null;}
/* the heaviest first, ties kept in the order the reading gave them */
function insByW(list){return (list||[]).map(function(x,j){return {x:x,j:j};})
 .sort(function(a,b){return (b.x.w-a.x.w)||(a.j-b.j);}).map(function(z){return z.x;});}
function insBySq(list){return (list||[]).map(function(x,j){return {x:x,j:j};})
 .sort(function(a,b){return ((+b.x.sq||0)-(+a.x.sq||0))||(a.j-b.j);}).map(function(z){return z.x;});}
/* the child emotions a selection runs on, heaviest held first */
function insFets(o){
 var seen={}; leaves(o).forEach(function(n){if(n.cf)seen[n.cf]=1;});
 return CHILD.filter(function(c){return seen[c.nm];})
  .sort(function(a,b){return (S.charge[b.nm]||0)-(S.charge[a.nm]||0);});}
/* a list said in words: a, b and c */
function insAnd(a){
 if(a.length<2)return a.join('');
 return a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
/* a name with its percent, and the name alone when the figure rounds to
   nothing, because a percent that is the dash is never printed as 0% */
function insAtPct(nm,kind,v){var f=fmtPct(kind,v);return f===PCT_DASH?nm:nm+' at '+f;}
function insHeld(kind,v){return fmtPct(kind,v)!==PCT_DASH;}
/* the segment, one clause. fig lists the percents it prints, each as
   [registry kind, value], so a test can read the figure back off its field */
function insSeg(text,src,kind,x){
 x=x||{};
 var g={t:'text',text:text,src:(src instanceof Array)?src:[src],kind:kind||'model',
  speak:!(/%/.test(text)||x.place)};
 if(x.fig)g.fig=x.fig;
 if(x.q)g.q=x.q;
 return g;}
/* a book line, quoted, with the exact quoted words kept apart for the check */
function insBook(lead,q,src,tail,place){
 /* a line that already ends on a stop takes no second one */
 if(tail==='.'&&/[.!?]$/.test(q))tail='';
 return insSeg(lead+'“'+q+'”'+(tail||''),src,'book',{q:q,place:!!place});}
/* a paragraph, packed to its ceiling. Each clause carries a priority, 0 is
   always kept, and clauses join in priority order until the ceiling is
   reached, then print in the order they were written. Nothing is cut in the
   middle of a clause. */
function insPack(h,clauses,max){
 var list=clauses.filter(function(c){return c&&c.s&&c.s.text;})
  .map(function(c,i){return {s:c.s,p:c.p||0,i:i};});
 var used=insWords(h), keep={};
 list.slice().sort(function(a,b){return (a.p-b.p)||(a.i-b.i);}).forEach(function(c){
  var w=insWords(c.s.text);
  if(c.p===0||used+w<=max){keep[c.i]=1;used+=w;}});
 return {h:h,segs:list.filter(function(c){return keep[c.i];}).map(function(c){return c.s;})};}
function insClause(s,p){return {s:s,p:p};}
/* a record line may not carry a word an offer is banned from using, so the
   clause is left out and the reading says less rather than something else */
function insOk(t){return t&&!INS_BAN.test(String(t))&&!/\u2014/.test(String(t));}

/* THE RELEASE THE READING MAY OFFER, one answer for the pill, the run glyph
   on a stack bar, and the third paragraph, so the three can never disagree.
   Never on an overshot pattern (ui/release.js: the opposite pushed past where
   it helps, so a release has nothing to work), never where no address holds
   charge, never on Entitlement (no child emotion is mapped to it, so
   relPick drops it), and the host adds the safety check and the plan lock.
   o.rank orders the addresses the way the release door will, o.released is
   the set of addresses already opened. */
function insightRelease(sel,r,o){
 o=o||{};
 var base={ok:false,ids:[],first:null,why:'none'}, list=[], opp='';
 if(!sel||!r||r.unread){base.why='unread';return base;}
 if(INS_LIST[sel.kind]){
  var p=insFind(r,sel.kind,sel.nm); if(!p){base.why='gone';return base;}
  if(p.over){base.why='over';return base;}
  list=leaves(p);}
 else if(sel.kind==='fet'){list=W.filter(function(n){return n.cf===sel.nm;});}
 else if(sel.kind==='addr'){var n0=BY[sel.i]; list=n0?[n0]:[];}
 else{base.why='kind';return base;}
 list=list.filter(function(n){return n.cf&&n.sq>=1;});
 if(!list.length){base.why='quiet';return base;}
 var rel=o.released||{};
 var ranked=(typeof o.rank==='function')?o.rank(list):insBySq(list);
 var fresh=ranked.filter(function(n){return !rel[n.i];});
 var first=(fresh[0]||ranked[0]);
 var c=CHILD.filter(function(x){return x.nm===first.cf;})[0];
 opp=c?c.opp:'';
 return {ok:true,ids:ranked.map(function(n){return n.i;}),first:{i:first.i,k:first.k,sq:first.sq,cf:first.cf,opp:opp,fresh:fresh.length>0},why:''};}

/* ---------- the trace graph, read for the entries that land ---------- */
/* the distinct journal entries whose imprints land at any of these addresses,
   never edges: one entry that reaches three addresses is one entry */
function insStories(g,ids){
 if(!g||typeof traceIsGraph!=='function'||!traceIsGraph(g))return null;
 var any=false, seen={};
 (g.nodes||[]).forEach(function(n){if(n.type==='story')any=true;});
 ids.forEach(function(i){
  traceNeighbors(g,traceKey('pattern',i),'supports').forEach(function(e){
   if(e.dir==='in'&&/^story:/.test(e.key))seen[e.key]=1;});});
 return {any:any,n:Object.keys(seen).length};}

/* ---------- resolving a src path back to its field ---------- */
var INS_ARR={HCX_LIB:'nm',CHILD:'nm',NODES:'i',DOMAINS:'nm',ARCH:'nm',MASKS:'nm',SI:'nm',APC:'b',HARM:'t',VERP:'k',MIRROR:'k'};
function insightResolve(path,r){
 var t=String(path||'');
 if(/^(model|gap):/.test(t))return true;
 var tok=t.split('.'), root=tok.shift(), cur;
 var T={S:S,SABDEF:SABDEF,SABCARD:SABCARD,HCXCARD:HCXCARD,DOMDEF:DOMDEF,AFFIRM:AFFIRM,CHALLENGE:CHALLENGE,
  FAM_POLE:FAM_POLE,CRISIS_SAY:CRISIS_SAY,HCX_LIB:HCX_LIB,CHILD:CHILD,NODES:NODES,DOMAINS:DOMAINS,ARCH:ARCH,
  MASKS:MASKS,SI:SI,APC:APC,HARM:HARM,VERP:VERP,MIRROR:MIRROR,TIER_BY:TIER_BY,r:r};
 if(!(root in T))return undefined;
 cur=T[root];
 for(var i=0;i<tok.length;i++){
  var k=tok[i]; if(cur===undefined||cur===null)return undefined;
  if(root==='r'&&i===0){var m=/^(sabs|cxs|hys|sups):(.*)$/.exec(k);
   if(m){cur=(cur[m[1]]||[]).filter(function(x){return x.nm===m[2];})[0];continue;}}
  if(cur instanceof Array){
   var f=INS_ARR[root]||'nm';
   cur=cur.filter(function(x){return String(x[f])===k||String(x.nm)===k;})[0];}
  else cur=cur[k];}
 return cur;}

/* ============================================================
   ONE SELECTION, THREE PARAGRAPHS
   ============================================================ */
function insFig(kind,v){return [kind,v];}

/* the chain above a pattern, one rung at a time, said once */
function insFeeds(o,r,leadKind){
 var chain=[], x=o, up;
 while((up=insUp(x,r))){chain.push(up); x=up;}
 return chain;}

function insP1Pattern(o,r){
 var base=insBase(o), word=INS_WORD[o.kind], over=!!o.over;
 var kw=(over?'overshot ':'')+word, cl=[];
 var path='r.'+INS_LIST[o.kind]+':'+o.nm;
 cl.push(insClause(insSeg(base+' is '+insArt(kw)+' '+kw+', at '+fmtPct('chain',o.w)+'.',[path+'.w'],'mine',
  {fig:[insFig('chain',o.w)]}),0));
 if(o.kind==='sab'&&o.unnamed)
  cl.push(insClause(insSeg('The library has no name for this cluster, so it is named for its point and its feeling.',
   [path+'.unnamed'],'mine'),2));
 if(over)
  cl.push(insClause(insSeg('That is the opposite pushed past where it helps.',['FAM_POLE'],'model'),1));
 /* the step down and the step up were here, and they are the fourth register
    now (insP4Pattern): one page said what it is and what it is made of at
    once, which is the compression he asked to have taken apart */
 /* ITS OWN LINE, FROM THE BOOK. A hyper complex is its family, so it quotes
    the line and does not say it belongs to itself, which was circular. */
 if(o.kind==='sab'&&!over){
  var def=SABDEF[KB_KEY(base)];
  if(def&&def.q&&insOk(def.q))
   cl.push(insClause(insBook('Its line: ',def.q,['SABDEF.'+KB_KEY(base)+'.q'],'.'),1));
  else{var f=patFam(o); if(f&&insOk(f.d))cl.push(insClause(insSeg('It belongs to the '+f.nm+' family: '+f.d+'.',['HCX_LIB.'+f.nm+'.d'],'book'),1));}}
 else if(o.kind==='hy'){
  var fh=patFam(o);
  if(fh&&insOk(fh.d)){
   if(over)cl.push(insClause(insSeg('Its family line: '+fh.d+'.',['FAM_POLE'],'model'),1));
   else cl.push(insClause(insBook('Its line: ',fh.d,['HCX_LIB.'+fh.nm+'.d'],'.'),1));}}
 else if(o.kind==='cx'){
  var fc=patFam(o);
  if(fc&&insOk(fc.d))cl.push(insClause(insSeg('It belongs to the '+fc.nm+' family: '+fc.d+'.',
   [over?'FAM_POLE':'HCX_LIB.'+fc.nm+'.d'],'book'),1));}
 return insPack(INS_HEAD[0],cl,INS_MAX[0]);}

/* THE MECHANIC OF A PATTERN: what it is built from, one step down with each
   part's percent, and what it feeds, up to the top of the chain on file. These
   clauses are the ones the first register carried until 20 November, moved
   here unchanged. A super complex is the top of the chain compute() builds,
   and the trace graph carries the climb above it, the masks worn over points
   that hold its addresses (engine/trace.js, traceAboveRead), so that one
   step is read off the graph when there is one, and never guessed without. */
function insP4Pattern(o,r,g){
 var cl=[];
 /* ONE STEP DOWN, EACH PART WITH ITS PERCENT */
 if(o.kind==='sab'){
  var top=insBySq(leaves(o)).slice(0,3);
  if(top.length){
   var bits=top.map(function(n){return insAtPct(n.k,'weight',n.sq);});
   var held=top.filter(function(n){return insHeld('weight',n.sq);});
   cl.push(insClause(insSeg('It is built on '+insAnd(bits)+'.'+(held.length?'':' Each has nothing left after the opposite.'),
    top.map(function(n){return 'NODES.'+n.i+'.k';}),
    'mine',{fig:held.map(function(n){return insFig('weight',n.sq);})}),1));
   cl.push(insClause(insSeg(top[0].k+' sits '+insNodeAt(top[0])+', in the '+insSeat(top[0].b)+' point.',
    ['NODES.'+top[0].i+'.n','NODES.'+top[0].i+'.b'],'model',{place:true}),3));}}
 else{
  var parts=insByW(o.parts).slice(0,3);
  if(parts.length){
   var pl=parts.map(function(p){return insAtPct(insBase(p),'chain',p.w);});
   var lead=o.kind==='cx'?'It joins ':(o.kind==='hy'?'It is built from ':'It joins ');
   cl.push(insClause(insSeg(lead+insAnd(pl)+'.',
    parts.map(function(p){return 'r.'+INS_LIST[p.kind]+':'+p.nm+'.w';}),'mine',
    {fig:parts.map(function(p){return insFig('chain',p.w);})}),1));}}
 /* ONE STEP UP, AND ON TO THE TOP OF THE CHAIN ON FILE */
 var chain=insFeeds(o,r);
 if(chain.length){
  var fl=chain.map(function(u,i){return (i?'then ':'')+'the '+INS_WORD[u.kind]+' '+insBase(u)+' at '+fmtPct('chain',u.w);});
  cl.push(insClause(insSeg('It feeds '+fl.join(', ')+'.',
   chain.map(function(u){return 'r.'+INS_LIST[u.kind]+':'+u.nm+'.w';}),'mine',
   {fig:chain.map(function(u){return insFig('chain',u.w);})}),0));}
 else if(o.kind==='sup'){
  var worn=insAbove(g,traceKey('super_complex',o.nm),'mask');
  if(worn.length)cl.push(insClause(insSeg('Nothing in the chain sits above it. It feeds the '+insAnd(worn)
   +(worn.length===1?' mask, worn':' masks, worn')+' over points that hold its addresses.',['model:trace'],'mine'),0));
  else cl.push(insClause(insSeg('Nothing sits above it.',['model:top'],'model'),0));}
 else
  cl.push(insClause(insSeg('Nothing above it is joined to it yet.',['model:top'],'model'),0));
 cl.push(insClause(insSeg('Each step is a registration the reading made, not a cause.',['model:trace'],'model'),3));
 return insPack(INS_HEAD[3],cl,INS_MAX[3]);}
/* the names one step above a node on the trace graph, of one type, sorted.
   Empty with no graph or no such node, so the reading says what the chain
   says and never borrows what a graph would have said. */
function insAbove(g,key,type){
 if(!g||!key||typeof traceIsGraph!=='function'||!traceIsGraph(g))return [];
 return traceNeighbors(g,key,'supports').filter(function(e){return e.dir==='out';})
  .map(function(e){return traceSplit(e.key);}).filter(function(s){return s.type===type;})
  .map(function(s){return String(s.id);}).sort();}

/* the heaviest saboteur under a pattern: a complex, a hyper complex and a super
   complex have no sentence of their own, and what they run is what their
   heaviest saboteur runs */
function insHeavySab(o){
 if(o.kind==='sab')return o;
 var best=null;
 (function dig(x){(x.parts||[]).forEach(function(c){
  if(c.kind==='sab'){if(!best||c.w>best.w)best=c;}else dig(c);});})(o);
 return best;}
/* the pattern's pole: where the work moves to, from the record that has one */
function insPole(o){
 var base=insBase(o), key=KB_KEY(base);
 if(o.kind==='sab'&&!o.over){var c=SABCARD[key]; if(c&&c.op&&insOk(c.op))return {t:c.op,src:'SABCARD.'+key+'.op'};}
 if(o.kind==='hy'&&!o.over){var h=HCXCARD[key]; if(h&&h.inverseName&&insOk(h.inverseName))return {t:h.inverseName,src:'HCXCARD.'+key+'.inverseName'};}
 return null;}

function insP2Pattern(o,r,g){
 var cl=[], path='r.'+INS_LIST[o.kind]+':'+o.nm, fets=insFets(o);
 var top=fets.filter(function(c){return (S.charge[c.nm]||0)>0;}).slice(0,3);
 if(top.length){
  var bits=top.map(function(c){return c.nm+' held at '+fmtPct('charge',S.charge[c.nm]);});
  cl.push(insClause(insSeg('It runs on '+insAnd(bits)+'.',top.map(function(c){return 'S.charge.'+c.nm;}),'mine',
   {fig:top.map(function(c){return insFig('charge',S.charge[c.nm]);})}),0));
  var c0=top[0];
  cl.push(insClause(insSeg('The map points '+c0.nm+' '+insAtPlace(c0.addr)+'.',
   ['CHILD.'+c0.nm+'.addr'],'model',{place:true}),2));}
 else cl.push(insClause(insSeg('No child emotion under it holds charge yet.',['gap:charge'],'gap'),0));
 /* WHAT FIRES IT, from the record, and only for a named saboteur */
 if(o.kind==='sab'&&!o.over){
  var def=SABDEF[KB_KEY(insBase(o))];
  if(def&&def.t&&insOk(def.t))cl.push(insClause(insBook('It fires in this moment: ',def.t,['SABDEF.'+KB_KEY(insBase(o))+'.t'],''),1));}
 /* WHERE THE WORK MOVES TO */
 var pole=insPole(o);
 if(pole)cl.push(insClause(insSeg((/,/.test(pole.t)?'Its higher poles: ':'Its higher pole: ')+pole.t+'.',[pole.src],'book'),1));
 if(top.length){
  var opp=top[0].opp;
  var inst=S.replace[top[0].nm]||0;
  cl.push(insClause(insSeg('The opposite of '+top[0].nm+' is '+opp+', '+(inst>0?'installed at '+fmtPct('installed',inst):'not installed yet')+'.',
   ['CHILD.'+top[0].nm+'.opp','S.replace.'+top[0].nm],'mine',inst>0?{fig:[insFig('installed',inst)]}:{}),2));}
 /* WHAT IT RUNS, in the words of the part that carries it: the sentence the
    heaviest saboteur under a complex, a hyper complex or a super complex runs,
    from that saboteur's own record */
 if(o.kind!=='sab'){
  var hs=insHeavySab(o), hd=hs&&!hs.over?SABDEF[KB_KEY(insBase(hs))]:null;
  if(hd&&hd.q&&insOk(hd.q))
   cl.push(insClause(insBook('Its heaviest part, '+insBase(hs)+', runs: ',hd.q,['SABDEF.'+KB_KEY(insBase(hs))+'.q'],'.'),1));}
 /* THE ENTRIES THAT LAND UNDER IT */
 var st=insStories(g,leaves(o).map(function(n){return n.i;}));
 if(st&&st.any){
  if(st.n>0)cl.push(insClause(insSeg((st.n===1?'One entry in your journal lands':st.n+' entries in your journal land')+' at addresses under it.',
   ['model:stories'],'mine'),1));
  else cl.push(insClause(insSeg('No entry in your journal is linked to it yet. The reading did not pick one up.',['gap:stories'],'gap'),1));}
 return insPack(INS_HEAD[1],cl,INS_MAX[1]);}

/* the step the record itself names, first sentence only, for the third paragraph */
function insStep(o){
 var base=insBase(o), key=KB_KEY(base), src, t;
 if(o.kind==='sab'&&!o.over){
  var c=SABCARD[key], d=SABDEF[key];
  if(c&&c.n&&insOk(insFirst(c.n))){t=insFirst(c.n);src='SABCARD.'+key+'.n';}
  else if(d&&d.i&&insOk(insFirst(d.i))){t=insFirst(d.i);src='SABDEF.'+key+'.i';}}
 else if(o.kind==='hy'&&!o.over){
  var h=HCXCARD[key]; if(h&&h.practice&&insOk(insFirst(h.practice))){t=insFirst(h.practice);src='HCXCARD.'+key+'.practice';}}
 else if(o.kind==='cx'||o.kind==='sup'){
  var heavy=insByW(o.parts)[0];
  if(heavy)return insStep(heavy);}
 return t?{t:t,src:src}:null;}

function insP3Pattern(o,r,rel,safe){
 if(safe)return insSafeP3();
 var cl=[];
 if(rel.ok){
  var f=rel.first, lead=o.kind==='sup'
   ?'One run works its heaviest places first, starting at '+f.k+' ('+fmtPct('weight',f.sq)+').'
   :'A release at '+f.k+' ('+fmtPct('weight',f.sq)+') is available.';
  cl.push(insClause(insSeg(lead,['NODES.'+f.i+'.k'],'offer',{fig:[insFig('weight',f.sq)],place:true}),0));
  cl.push(insClause(insSeg('It lowers the charge there, then installs '+f.opp+' while the address is open.',
   ['model:release','CHILD.'+f.cf+'.opp'],'offer'),1));}
 else if(rel.why==='over')
  cl.push(insClause(insSeg('This is the opposite pushed past where it helps, so a release has nothing to work on it.',['model:over'],'model'),0));
 else
  cl.push(insClause(insSeg('Nothing under it holds charge yet, so a release has nothing to open.',['gap:release'],'gap'),0));
 var st=insStep(o);
 if(st)cl.push(insClause(insBook('If you want a step from its record: ',st.t,[st.src],''),2));
 var fets=insFets(o), dom=fets.filter(function(c){return AFFIRM[c.nm];})[0];
 if(dom&&rel.ok)cl.push(insClause(insBook('After the release, this line is available: ',AFFIRM[dom.nm],['AFFIRM.'+dom.nm],''),3));
 cl.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 return insPack(INS_HEAD[2],cl,INS_MAX[2]);}

function insSafeP3(){
 return {h:INS_HEAD[2],segs:[insSeg(CRISIS_SAY.q,['CRISIS_SAY.q'],'model')]};}

/* ---------- a child emotion ---------- */
function insFetSabs(r,nm){
 return insByW((r.sabs||[]).filter(function(s){return leaves(s).some(function(n){return n.cf===nm;});}));}
function insP1Fet(c,r){
 var cl=[], v=S.charge[c.nm]||0, p=S.replace[c.nm]||0;
 cl.push(insClause(insSeg(c.nm+' is a child emotion, held at '+fmtPct('charge',v)+'.',['S.charge.'+c.nm],'mine',
  {fig:[insFig('charge',v)]}),0));
 cl.push(insClause(insSeg(c.opp+' is its opposite, '+(p>0?'installed at '+fmtPct('installed',p):'not installed yet')+'.',
  ['CHILD.'+c.nm+'.opp','S.replace.'+c.nm],'mine',p>0?{fig:[insFig('installed',p)]}:{}),0));
 cl.push(insClause(insSeg('The map points it '+insAtPlace(c.addr)+', in the '+insSeat(c.seat)+' point.',
  ['CHILD.'+c.nm+'.addr','CHILD.'+c.nm+'.seat'],'model',{place:true}),1));
 return insPack(INS_HEAD[0],cl,INS_MAX[0]);}
/* THE MECHANIC OF A CHILD EMOTION: the addresses that carry it, and the
   saboteurs built on them. The saboteurs line is the one the first register
   carried until 20 November, moved here unchanged. */
function insP4Fet(c,r){
 var cl=[], all=W.filter(function(n){return n.cf===c.nm;}), held=all.filter(function(n){return n.sq>=SEAT_LOADED;});
 cl.push(insClause(insSeg('It is carried by '+all.length+' address'+(all.length===1?'':'es')+' on the map, and '
  +(held.length?held.length+' of them '+(held.length===1?'is':'are')+' held.':'none of them is held.'),
  ['CHILD.'+c.nm+'.nm','model:cf'],'mine'),0));
 var sabs=insFetSabs(r,c.nm).slice(0,3);
 if(sabs.length)cl.push(insClause(insSeg('It feeds '+insAnd(sabs.map(function(s){return insBase(s)+' at '+fmtPct('chain',s.w);}))+': '+(sabs.length===1?'that saboteur runs':'those saboteurs run')+' on it.',
  sabs.map(function(s){return 'r.sabs:'+s.nm+'.w';}),'mine',{fig:sabs.map(function(s){return insFig('chain',s.w);})}),0));
 else cl.push(insClause(insSeg('No saboteur runs on it yet.',['gap:sabs'],'gap'),0));
 cl.push(insClause(insSeg('Each step is a registration the reading made, not a cause.',['model:trace'],'model'),3));
 return insPack(INS_HEAD[3],cl,INS_MAX[3]);}
function insP2Fet(c,r,g){
 var cl=[], v=S.charge[c.nm]||0, p=S.replace[c.nm]||0;
 var lv=W.filter(function(n){return n.cf===c.nm&&n.sq>=1;});
 var top=insBySq(lv).slice(0,3);
 if(top.length)cl.push(insClause(insSeg('Its heaviest addresses are '+insAnd(top.map(function(n){return n.k+' at '+fmtPct('weight',n.sq);}))+'.',
  top.map(function(n){return 'NODES.'+n.i+'.k';}),'mine',{fig:top.map(function(n){return insFig('weight',n.sq);}),place:true}),0));
 else cl.push(insClause(insSeg('No address carrying it holds charge yet.',['gap:charge'],'gap'),0));
 var lean=(v-p)*5>0?'It leans toward being held: more is held than installed.'
  :((v-p)*5<0?'It leans toward '+c.opp+': more is installed than held.':'Held and installed sit level.');
 if(v>0||p>0)cl.push(insClause(insSeg(lean,['S.charge.'+c.nm,'S.replace.'+c.nm],'mine'),1));
 var st=insStories(g,lv.map(function(n){return n.i;}));
 if(st&&st.any){
  if(st.n>0)cl.push(insClause(insSeg((st.n===1?'One entry in your journal lands':st.n+' entries in your journal land')+' at addresses that carry it.',
   ['model:stories'],'mine'),1));
  else cl.push(insClause(insSeg('No entry in your journal is linked to it yet. The reading did not pick one up.',['gap:stories'],'gap'),1));}
 return insPack(INS_HEAD[1],cl,INS_MAX[1]);}
function insP3Fet(c,r,rel,safe){
 if(safe)return insSafeP3();
 var cl=[];
 if(rel.ok){
  var f=rel.first;
  cl.push(insClause(insSeg('A release at '+f.k+' ('+fmtPct('weight',f.sq)+') is available.',['NODES.'+f.i+'.k'],'offer',
   {fig:[insFig('weight',f.sq)],place:true}),0));
  cl.push(insClause(insSeg('It lowers the charge there, then installs '+c.opp+' while the address is open.',['model:release','CHILD.'+c.nm+'.opp'],'offer'),1));}
 else cl.push(insClause(insSeg('No address carrying it holds charge yet, so a release has nothing to open.',['gap:release'],'gap'),0));
 var ch=CHALLENGE[c.nm];
 if(ch&&ch.act&&insOk(insFirst(ch.act)))cl.push(insClause(insBook('If you want a step for today: ',insFirst(ch.act),['CHALLENGE.'+c.nm+'.act'],''),2));
 if(AFFIRM[c.nm]&&rel.ok)cl.push(insClause(insBook('After the release, this line is available: ',AFFIRM[c.nm],['AFFIRM.'+c.nm],''),3));
 cl.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 return insPack(INS_HEAD[2],cl,INS_MAX[2]);}

/* ---------- an address ---------- */
function insSabsAt(r,i){
 return insByW((r.sabs||[]).filter(function(s){return leaves(s).some(function(n){return n.i===i;});}));}
function insP1Addr(n,r){
 var cl=[];
 cl.push(insClause(insSeg(n.k+' is an address, '+insNodeAt(n)+', in the '+insSeat(n.b)+' point'
  +(insHeld('weight',n.sq)?', at '+fmtPct('weight',n.sq)+'.':'. It has nothing left after the opposite.'),
  ['NODES.'+n.i+'.k','NODES.'+n.i+'.n','NODES.'+n.i+'.b'],'mine',{fig:insHeld('weight',n.sq)?[insFig('weight',n.sq)]:[],place:true}),0));
 if(n.a&&n.d&&insOk(n.a)&&insOk(n.d))
  cl.push(insClause(insSeg('Held clear, it reads '+insLow1(n.a)+'. Distorted, it reads '+insLow1(n.d)+'.',['NODES.'+n.i+'.a','NODES.'+n.i+'.d'],'book'),1));
 return insPack(INS_HEAD[0],cl,INS_MAX[0]);}
/* THE MECHANIC OF AN ADDRESS: what it belongs to and what it feeds. The
   saboteurs line is the one the first register carried until 20 November,
   moved here unchanged; the point's pass is seatRows' own (engine/compute.js),
   the figure the Analytics point card prints off flSeats' same arithmetic. */
function insP4Addr(n,r){
 var cl=[];
 if(n.cf){
  var same=W.filter(function(x){return x.cf===n.cf;}).length;
  cl.push(insClause(insSeg('It is one of the '+same+' addresses that carry '+n.cf+'.',['NODES.'+n.i+'.cf'],'model'),1));}
 var sabs=insSabsAt(r,n.i).slice(0,3);
 if(sabs.length)cl.push(insClause(insSeg('Running on it: '+insAnd(sabs.map(function(s){return insBase(s)+' at '+fmtPct('chain',s.w);}))+'.',
  sabs.map(function(s){return 'r.sabs:'+s.nm+'.w';}),'mine',{fig:sabs.map(function(s){return insFig('chain',s.w);})}),0));
 else cl.push(insClause(insSeg('No saboteur runs on it yet.',['gap:sabs'],'gap'),0));
 var row=insSeatRow(r,n.b);
 if(row)cl.push(insClause(insSeg('It feeds the '+insSeat(n.b)+' point, which passes '+fmtPct('pass',row.pass)+' of what reaches it.',
  ['NODES.'+n.i+'.b','r.seats'],'mine',{fig:[insFig('pass',row.pass)],place:true}),2));
 cl.push(insClause(insSeg('Each step is a registration the reading made, not a cause.',['model:trace'],'model'),3));
 return insPack(INS_HEAD[3],cl,INS_MAX[3]);}
function insP2Addr(n,r,g){
 var cl=[];
 if(n.cf){
  var v=S.charge[n.cf]||0, p=S.replace[n.cf]||0, c=CHILD.filter(function(x){return x.nm===n.cf;})[0];
  cl.push(insClause(insSeg('It carries '+n.cf+', held at '+fmtPct('charge',v)+'.',['S.charge.'+n.cf],'mine',{fig:[insFig('charge',v)]}),0));
  if(c)cl.push(insClause(insSeg(c.opp+' is its opposite, '+(p>0?'installed at '+fmtPct('installed',p):'not installed yet')+'.',
   ['CHILD.'+n.cf+'.opp','S.replace.'+n.cf],'mine',p>0?{fig:[insFig('installed',p)]}:{}),1));}
 else cl.push(insClause(insSeg('No child emotion is mapped to it yet, so nothing is held or installed here.',['gap:fetter'],'gap'),0));
 var st=insStories(g,[n.i]);
 if(st&&st.any){
  if(st.n>0)cl.push(insClause(insSeg((st.n===1?'One entry in your journal lands':st.n+' entries in your journal land')+' here.',['model:stories'],'mine'),1));
  else cl.push(insClause(insSeg('No entry in your journal is linked to it yet. The reading did not pick one up.',['gap:stories'],'gap'),1));}
 return insPack(INS_HEAD[1],cl,INS_MAX[1]);}
function insP3Addr(n,r,rel,safe){
 if(safe)return insSafeP3();
 var cl=[];
 if(rel.ok){
  var f=rel.first;
  cl.push(insClause(insSeg('A release here, at '+fmtPct('weight',f.sq)+', is available.',['NODES.'+f.i+'.k'],'offer',{fig:[insFig('weight',f.sq)],place:true}),0));
  cl.push(insClause(insSeg('It lowers the charge here, then installs '+f.opp+' while the address is open.',['model:release','CHILD.'+f.cf+'.opp'],'offer'),1));}
 else if(!n.cf)cl.push(insClause(insSeg('No child emotion is mapped to this address yet, so a release cannot run here.',['gap:fetter'],'gap'),0));
 else cl.push(insClause(insSeg('This address holds too little to open a release.',['gap:release'],'gap'),0));
 if(n.cf&&AFFIRM[n.cf]&&rel.ok)cl.push(insClause(insBook('After the release, this line is available: ',AFFIRM[n.cf],['AFFIRM.'+n.cf],''),2));
 cl.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 return insPack(INS_HEAD[2],cl,INS_MAX[2]);}

/* ---------- a blueprint domain ---------- */
function insParasDom(d,o,g){
 /* four domains are a different key in DOMDEF, the book's own name for them */
 var key=KB_KEY(d.nm), alt=(typeof KB_RENAME!=='undefined')?KB_RENAME[key]:null;
 if(!DOMDEF[key]&&alt&&DOMDEF[KB_KEY(alt)])key=KB_KEY(alt);
 var def=DOMDEF[key]||{};
 var cl1=[insClause(insSeg(d.nm+' is a blueprint domain'+(d.r?', in the '+d.r+' cluster':'')+'.',['DOMAINS.'+d.nm+'.nm'],'model'),0)];
 var pick=o.soulFrom==='default'?'It is the default. You have not picked one yet.':(o.soulFrom==='picked'?'You picked it.':'');
 if(pick)cl1.push(insClause(insSeg(pick,['model:soul'],'mine'),1));
 if(def.c&&insOk(insFirst(def.c)))cl1.push(insClause(insBook('Read clear: ',insFirst(def.c),['DOMDEF.'+key+'.c'],''),1));
 /* HOW IT RUNS WAS ONE GAP LINE FOR EVERY DOMAIN, round ana-treemap: "Nothing
    in your entries is linked to a domain yet", on every record, while the
    Selection card beside it (ui/analytics.js anaDomCard) already counted the
    addresses the domain owns and how many of them are held. The slot rule is
    that card's own, moved here unchanged, so the two can never disagree about
    which addresses a domain owns. No domain percent is printed: compute()
    never measures one, and the rail's headline already leaves it blank for
    that reason. The gap line stays, last and lowest, because it is still true. */
 var di=DOMAINS.indexOf(d), own=insBySq(W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===di;}));
 var cl2=[];
 if(di>=0&&own.length){
  var heldN=own.filter(function(n){return n.sq>=4;}).length;
  cl2.push(insClause(insSeg('It owns '+own.length+' address'+(own.length===1?'':'es')+', and '
   +(heldN?heldN+' of them '+(heldN===1?'is':'are')+' held.':'none of them is held.'),['DOMAINS.'+d.nm+'.nm','model:slot'],'mine'),0));
  var topD=own.filter(function(n){return insHeld('weight',n.sq);}).slice(0,3);
  if(topD.length)cl2.push(insClause(insSeg('The heaviest '+(topD.length===1?'is ':'are ')
   +insAnd(topD.map(function(n){return n.k+' at '+fmtPct('weight',n.sq);}))+'.',
   topD.map(function(n){return 'NODES.'+n.i+'.k';}),'mine',{fig:topD.map(function(n){return insFig('weight',n.sq);}),place:true}),1));}
 cl2.push(insClause(insSeg('Nothing in your entries is linked to a domain yet. The engine reads it from your blueprint.',['gap:domain'],'gap'),2));
 var cl3=[];
 if(def.x&&insOk(def.x))cl3.push(insClause(insBook('Read distorted: ',insFirst(def.x),['DOMDEF.'+key+'.x'],''),1));
 cl3.push(insClause(insSeg('A release works at an address, so pick a pattern or an address to start one.',['model:release'],'model'),0));
 cl3.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 /* THE MECHANIC. Built from the same slot rule as the second register, and
    fed upward only where the trace graph climbs (engine/trace.js, domain
    to character). No domain figure, for the reason above. */
 var cl4=[insClause(insSeg('It is built from the '+own.length+' address'+(own.length===1?'':'es')+' whose place on the wheel falls in its share.',
  ['DOMAINS.'+d.nm+'.nm','model:slot'],'model'),0)];
 cl4.push(insClause(insAbove(g,traceKey('domain',d.nm),'character').length
  ?insSeg('It feeds your character, the whole of what sits below it.',['model:trace'],'mine')
  :insSeg('It is a selection out of your blueprint and not a measurement, so no figure is computed up from it.',['model:soul'],'model'),0));
 return [insPack(INS_HEAD[0],cl1,INS_MAX[0]),insPack(INS_HEAD[1],cl2,INS_MAX[1]),insPack(INS_HEAD[2],cl3,INS_MAX[2]),insPack(INS_HEAD[3],cl4,INS_MAX[3])];}

/* ---------- an archetype and a mask ----------
   THESE READ "Source AI has no longer reading of it so far" UNDER A CARD
   THAT HAD THE NUMBERS, round ana-treemap. A press on an Analytics cell now
   opens the Insight rail beside the Selection card (anaDrill calls insDoor),
   and the two sat side by side: the card printing how fully the archetype is
   expressed, its primary saboteur and whether that saboteur runs, and the
   rail printing one gap line. Every figure below is one the card already
   prints off the same record (anaArchCard, anaMaskCard in ui/analytics.js):
   archExpr, ARCH18's saboteur column, r.maskRing's average and the addresses
   at the mask's points. Nothing new is measured here, only said.

   NO RELEASE IS OFFERED for either. A release works at an address and
   insightRelease answers neither kind (tests/insightread.js holds that), so
   the third paragraph names where a release would start and offers nothing. */
function insParasArch(sel,r,o){
 var ai=-1; ARCH.forEach(function(a,i){if(a.nm===sel.nm)ai=i;});
 if(ai<0)return insParasOther(sel,o);
 var a=ARCH[ai], ex=archExpr(ai), lead=ai===r.pi, cl1=[], cl2=[], cl3=[];
 cl1.push(insClause(insSeg(a.nm+' is an archetype, expressed at '+fmtPct('archetype',ex)+'.',
  ['ARCH.'+a.nm+'.nm','r.aff'],'mine',{fig:[insFig('archetype',ex)]}),0));
 cl1.push(insClause(insSeg(lead?'It is your primary, how the soul expresses.'
  :'It is not your primary'+(ARCH[r.pi]?'. '+ARCH[r.pi].nm+' is.':'.'),['r.pi'],'mine'),0));
 var ln=insLineFor(sel);
 if(ln&&insOk(ln.t))cl1.push(insClause(insBook('The record says: ',ln.t,[ln.src],''),1));
 /* ARCH names it Rebel and the eighteen name it Outlaw, the card's own join */
 var a18=(typeof ARCH18!=='undefined')?ARCH18.filter(function(x){return x[0]===a.nm||(a.nm==='Rebel'&&x[0]==='Outlaw');})[0]:null;
 var sab=a18?a18[1]:'', run=sab?(r.sabs||[]).filter(function(s){return s.nm===sab;})[0]:null;
 cl2.push(insClause(insSeg('Charge held at its point pulls it down, and a release lifts it. The archetype itself does not change.',
  ['model:archexpr'],'model'),1));
 if(sab){
  var seats=sabSeats(sab);
  cl2.push(insClause(insSeg('Its primary saboteur is '+sab
   +(seats.length?', with addresses at the '+insAnd(seats.map(insSeat))+(seats.length===1?' point':' points'):'')+'.',
   ['model:arch18'],'model',{place:true}),0));
  if(run)cl2.push(insClause(insSeg(sab+' is running now, at '+fmtPct('chain',run.w)+'.',['r.sabs:'+run.nm+'.w'],'mine',
   {fig:[insFig('chain',run.w)]}),0));
  else cl2.push(insClause(insSeg(sab+' is not running now.',['model:arch18'],'mine'),0));}
 cl3.push(insClause(insSeg(run?'A release works at an address, so open '+sab+' to start one on what bends this.'
  :'A release works at an address, so pick a pattern or an address to start one.',['model:release'],'model'),0));
 cl3.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 /* THE MECHANIC: archExpr's input, and ARCHDOM's row, the table the trace
    graph climbs from an archetype to a domain by (archDomainOf) */
 var cl4=[insClause(insSeg('It is built from how fully it is expressed: charge held at the '+insSeat(a.b)+' point pulls it down.',
  ['ARCH.'+a.nm+'.b','model:archexpr'],'model',{place:true}),0)];
 var ad=(typeof archDomainOf==='function')?archDomainOf(a.nm):null;
 cl4.push(insClause(ad&&ad.nm
  ?insSeg('It points at the '+ad.nm+' domain, by the archetype to domain table, which is the same for everybody.',['model:archdom'],'model')
  :insSeg('The archetype to domain table does not join it to a domain yet.',['gap:archdom'],'gap'),1));
 return [insPack(INS_HEAD[0],cl1,INS_MAX[0]),insPack(INS_HEAD[1],cl2,INS_MAX[1]),insPack(INS_HEAD[2],cl3,INS_MAX[2]),insPack(INS_HEAD[3],cl4,INS_MAX[3])];}
function insParasMask(sel,r,o){
 var m=(r.maskRing||[]).filter(function(x){return x.nm===sel.nm;})[0];
 if(!m)return insParasOther(sel,o);
 var sb=m.bands||[], cl1=[], cl2=[], cl3=[];
 var all=insBySq(W.filter(function(n){return sb.indexOf(n.b)>=0;})), held=all.filter(function(n){return n.sq>=4;});
 cl1.push(insClause(insSeg(m.nm+' is a mask, speaking from the '+insAnd(sb.map(insSeat))+(sb.length===1?' point':' points')
  +(insHeld('weight',m.w)?', with a load of '+fmtPct('weight',m.w)+'.':', with no load on it yet.'),
  ['r.maskRing.'+m.nm+'.w'],'mine',{fig:insHeld('weight',m.w)?[insFig('weight',m.w)]:[],place:true}),0));
 cl1.push(insClause(insSeg('The load is the average charge left across every address at those points.',['model:mask'],'model'),1));
 var ln=insLineFor(sel);
 if(ln&&insOk(ln.t))cl1.push(insClause(insBook('The record says: ',ln.t,[ln.src],''),2));
 cl2.push(insClause(insSeg(all.length+' address'+(all.length===1?' sits':'es sit')+' under it, and '
  +(held.length?held.length+' of them '+(held.length===1?'is':'are')+' held.':'none of them is held.'),['model:mask'],'mine'),0));
 var top=all.filter(function(n){return insHeld('weight',n.sq);}).slice(0,3);
 if(top.length)cl2.push(insClause(insSeg('The heaviest '+(top.length===1?'is ':'are ')
  +insAnd(top.map(function(n){return n.k+' at '+fmtPct('weight',n.sq);}))+'.',
  top.map(function(n){return 'NODES.'+n.i+'.k';}),'mine',{fig:top.map(function(n){return insFig('weight',n.sq);}),place:true}),1));
 cl3.push(insClause(insSeg(top.length?'A release works at an address, so open '+top[0].k+' to start one under this mask.'
  :'A release works at an address, so pick a pattern or an address to start one.',
  top.length?['model:release','NODES.'+top[0].i+'.k']:['model:release'],'model',top.length?{place:true}:{}),0));
 cl3.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 /* THE MECHANIC: the load's own inputs, and the one step up the trace graph
    takes from a mask, to the first or second archetype seated under it
    (engine/trace.js, traceAboveRead), read off the same r.pi and r.si */
 var cl4=[insClause(insSeg('It is built from the '+all.length+' address'+(all.length===1?'':'es')+' at its points. Its load is their average charge.',
  ['model:mask'],'model'),0)];
 var under=[r.pi,r.si].map(function(x){return ARCH[x];}).filter(function(a,j,l){return a&&sb.indexOf(a.b)>=0&&l.indexOf(a)===j;});
 cl4.push(insClause(under.length
  ?insSeg('It is worn over the point of '+insAnd(under.map(function(a){return a.nm;}))+', '+(under.length===1?'an archetype':'archetypes')+' your reading leads with.',['r.pi','r.si'],'mine')
  :insSeg('Neither archetype your reading leads with is seated under it.',['r.pi','r.si'],'mine'),1));
 return [insPack(INS_HEAD[0],cl1,INS_MAX[0]),insPack(INS_HEAD[1],cl2,INS_MAX[1]),insPack(INS_HEAD[2],cl3,INS_MAX[2]),insPack(INS_HEAD[3],cl4,INS_MAX[3])];}

/* ---------- the other kinds: a short reading, honest about the rest ---------- */
function insLineFor(sel){
 /* the one line the drill for this kind already quotes, with where it came from */
 if(sel.kind==='law'){
  var h=HARM.filter(function(x){return x.a==='spirit'&&x.t===sel.nm;})[0];
  if(h&&h.d)return {t:insFirst(h.d),src:'HARM.'+sel.nm+'.d'};}
 else if(sel.kind==='arch'){
  var a=ARCH.filter(function(x){return x.nm===sel.nm;})[0];
  if(a&&a.d)return {t:a.d,src:'ARCH.'+sel.nm+'.d',v:a.v};}
 else if(sel.kind==='mask'){
  var m=MASKS.filter(function(x){return x.nm===sel.nm;})[0];
  if(m&&m.v)return {t:m.v,src:'MASKS.'+sel.nm+'.v'};}
 else if(sel.kind==='seat'){
  var s=APC.filter(function(x){return x.b===sel.nm;})[0];
  if(s&&s.d)return {t:insFirst(s.d),src:'APC.'+sel.nm+'.d'};}
 return null;}
/* THE NOUN A SENTENCE TAKES FOR A KIND, where it is not the headline's word.
   INS_CAP is the identity line's label and one of them is a plural, Gates,
   the key the Laws of Action kept, so the sentence built from it read
   "Awareness is a gates." A sentence takes the singular, and the article is
   picked against that. */
var INS_ONE={gates:'Law of Action',seat:'point',path:'compass',bal:'balance',atom:'imprint'};
function insKindNoun(kind){
 var w=INS_ONE[kind]||(INS_CAP[kind]||'Selection').toLowerCase();
 return insArt(w)+' '+w;}
function insParasOther(sel,o){
 var nm=sel.nm||'';
 var lead=sel.kind==='core'?'The core is the centre of the wheel.':(nm?insCap1(nm)+' is '+insKindNoun(sel.kind)+'.':insCap1(insKindNoun(sel.kind).replace(/^an? /,''))+' is selected.');
 var cl1=[insClause(insSeg(lead,['model:'+sel.kind],'model'),0)];
 var ln=insLineFor(sel);
 if(ln&&insOk(ln.t)){
  cl1.push(insClause(insBook('The record says: ',ln.t,[ln.src],'',sel.kind==='seat'),1));}
 var cl2=[insClause(insSeg('Nothing in your entries is linked to this yet. Source AI has no longer reading of it so far.',['gap:'+sel.kind],'gap'),0)];
 var cl3=[insClause(insRouteTo(null),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('Source AI has no reading yet of what this one is built from.',['gap:'+sel.kind],'gap'),0)];
 return insFour(cl1,cl2,cl3,cl4);}

/* ---------- the shared pieces of the readers below ---------- */
function insFour(c1,c2,c3,c4){
 return [insPack(INS_HEAD[0],c1,INS_MAX[0]),insPack(INS_HEAD[1],c2,INS_MAX[1]),
  insPack(INS_HEAD[2],c3,INS_MAX[2]),insPack(INS_HEAD[3],c4,INS_MAX[3])];}
function insDoorSeg(){return insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model');}
/* a seat's row off the reading, seatRows (engine/compute.js): its pass is the
   one the Analytics point card prints, flSeats' arithmetic ported there */
function insSeatRow(r,b){return (r.seats||[]).filter(function(s){return s.seat===b;})[0]||null;}
/* whether a law was entered, lawIn's own answer, and its word, the thresholds
   the law card prints (lawDrillHtml) and the point card's rows (anaSeatCard),
   so the three readers of one law can never word it two ways */
function insLawRead(nm){return (typeof lawIn!=='function')||lawIn(nm);}
function insLawWord(v){return v<4?'shut':v>=7?'open':'working';}
function insLowLaw(){
 var L=SI.filter(function(l){return insLawRead(l.nm);});
 return L.map(function(l,j){return {l:l,j:j};}).sort(function(a,b){return ((S.law[a.l.nm]||0)-(S.law[b.l.nm]||0))||(a.j-b.j);})
  .map(function(z){return z.l;})[0]||null;}
/* WHERE A RELEASE WOULD START: the heaviest address at a point, or anywhere,
   that a release can actually open, insightRelease's own filter (a child
   emotion mapped, at least 1 held). None of these kinds offers a release
   itself, as the archetype and mask readers already do not, so the third
   register names the address and the door it is opened by. */
function insHeavyAt(b){return insBySq(W.filter(function(n){return (!b||n.b===b)&&n.cf&&n.sq>=1;}))[0]||null;}
function insRouteTo(n,where){
 return n?insSeg('A release works at an address, so open '+n.k+' to start one '+where+'.',['model:release','NODES.'+n.i+'.k'],'model',{place:true})
  :insSeg('A release works at an address, so pick a pattern or an address to start one.',['model:release'],'model');}
function insTopHeld(list){return list.filter(function(n){return insHeld('weight',n.sq);}).slice(0,3);}
function insHeaviestSeg(top){
 return insSeg('The heaviest '+(top.length===1?'is ':'are ')+insAnd(top.map(function(n){return n.k+' at '+fmtPct('weight',n.sq);}))+'.',
  top.map(function(n){return 'NODES.'+n.i+'.k';}),'mine',{fig:top.map(function(n){return insFig('weight',n.sq);}),place:true});}
function insHeldSeg(all,held,lead,src){
 return insSeg(lead+(held.length?held.length+' of its '+all.length+' address'+(all.length===1?' is':'es '+(held.length===1?'is':'are'))+' held.'
  :'none of its '+all.length+' address'+(all.length===1?'':'es')+' is held.'),src,'mine',{place:true});}

/* ---------- a law and a point ----------
   THESE FELL THROUGH TO insParasOther, which gave both the same gap line for
   the second register and the same "pick a pattern" for the third, while the
   law card and the point card beside them (lawDrillHtml in ui/drills.js,
   anaLawCard and anaSeatCard in ui/analytics.js) already printed the law's
   state, its point and how much is held there, and the point's pass, its
   held addresses and its laws. Every figure and word below is one those cards
   already print off the same record, through the same helpers, so the rail and
   the cards cannot disagree. A law the person has not answered sits at the
   seed, and the card prints no figure for it (round J13), so neither does
   this, nor the headline. */
function insParasLaw(sel,r,o){
 var l=SI.filter(function(x){return x.nm===sel.nm;})[0]; if(!l)return insParasOther(sel,o);
 var nm=l.nm, bn=l.b, read=insLawRead(nm), v=S.law[nm];
 var all=insBySq(W.filter(function(n){return n.b===bn;})), held=all.filter(function(n){return n.sq>=SEAT_LOADED;});
 var cl1=[insClause(insSeg(nm+' is a Law of Moral Integrity, seated at the '+insSeat(bn)+' point.',['SI.'+nm+'.b'],'model',{place:true}),0)];
 cl1.push(insClause(read?insSeg('It reads '+fmtPct('law',v)+'.',['S.law.'+nm],'mine',{fig:[insFig('law',v)]})
  :insSeg('It is not answered yet.',['gap:law'],'gap'),0));
 var ln=insLineFor(sel);
 if(ln&&insOk(ln.t))cl1.push(insClause(insBook('The record says: ',ln.t,[ln.src],''),1));
 var cl2=[];
 if(read)cl2.push(insClause(insSeg(v<4?'This law is shut. A shut law lets more charge stay held at its point.'
  :v>=7?'This law is open. It is one of the things carrying your coherence.'
  :'It is working but not strong. It holds in some places and slips in others.',['S.law.'+nm],'mine'),0));
 else cl2.push(insClause(insSeg('Nothing is answered for it yet, so how it runs is not read.',['gap:law'],'gap'),0));
 cl2.push(insClause(insHeldSeg(all,held,'At its point, ',['SI.'+nm+'.b','model:slot']),0));
 var top=insTopHeld(held);
 if(top.length)cl2.push(insClause(insHeaviestSeg(top),1));
 var side=SI.filter(function(x){return x.b===bn&&x.nm!==nm;});
 if(side.length)cl2.push(insClause(insSeg('Seated beside it: '+insAnd(side.map(function(x){
  return x.nm+' '+(insLawRead(x.nm)?insLawWord(S.law[x.nm]):'not read yet');}))+'.',side.map(function(x){return 'SI.'+x.nm+'.nm';}),'mine'),2));
 var cl3=[insClause(insRouteTo(insHeavyAt(bn),'at this law’s point'),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from your answers to its questions, each read from nothing to ten.',['model:law'],'model'),0),
  insClause(insSeg('It feeds your coherence: CQ is the '+SI.length+' laws added together, and this is one of them.',['model:cq'],'model'),0),
  insClause(insSeg('It also sets the relief at the '+insSeat(bn)+' point, so a shut law lets more charge stay held there.',['SI.'+nm+'.b','model:relief'],'model',{place:true}),1)];
 return insFour(cl1,cl2,cl3,cl4);}
function insParasSeat(sel,r,o){
 var bn=sel.nm, ap=APC.filter(function(x){return x.b===bn;})[0], row=insSeatRow(r,bn);
 if(!ap||!row)return insParasOther(sel,o);
 var all=insBySq(W.filter(function(n){return n.b===bn;})), held=all.filter(function(n){return n.sq>=SEAT_LOADED;});
 var laws=SI.filter(function(x){return x.b===bn;});
 var cl1=[insClause(insSeg('The '+insSeat(bn)+' point is one of the '+BANDS.length+' assemblage points.',['APC.'+bn+'.b'],'model',{place:true}),0),
  insClause(insSeg('It passes '+fmtPct('pass',row.pass)+' of what reaches it.',['r.seats'],'mine',{fig:[insFig('pass',row.pass)]}),0)];
 var ln=insLineFor(sel);
 if(ln&&insOk(ln.t))cl1.push(insClause(insBook('The record says: ',ln.t,[ln.src],'',true),1));
 var cl2=[insClause(insHeldSeg(all,held,'Here, ',['APC.'+bn+'.b','model:slot']),0)];
 var top=insTopHeld(held);
 if(top.length)cl2.push(insClause(insHeaviestSeg(top),1));
 if(laws.length)cl2.push(insClause(insSeg((laws.length===1?'The law seated here: ':'The laws seated here: ')+insAnd(laws.map(function(x){
  return x.nm+' '+(insLawRead(x.nm)?insLawWord(S.law[x.nm]):'not read yet');}))+'.',laws.map(function(x){return 'SI.'+x.nm+'.nm';}),'mine'),1));
 var cl3=[insClause(insRouteTo(insHeavyAt(bn),'at this point'),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from its '+all.length+' addresses: the charge they hold sets how much it passes.',['model:pass'],'model'),0),
  insClause(insSeg('It feeds Flow. The points pass signal in series, root upward, so what it does not pass, no point above it receives.',['model:flow'],'model'),0),
  insClause(insSeg(row.held?'It holds enough now to close the column here.':'It is not holding enough to close the column.',['r.seats'],'mine'),1)];
 if(laws.length)cl4.push(insClause(insSeg('The laws seated here feed it too: a shut law lets more charge stay held at it.',['model:relief'],'model'),2));
 return insFour(cl1,cl2,cl3,cl4);}

/* ---------- the six kinds with no reader of their own ----------
   The core, the Compass, Balance, an imprint, a Law of Action and a cone of
   the poles all read insParasOther's gap lines, beside a drill that printed
   the real figures (runCoreDrill, runCompassDrill, runBalDrill, runAtomDrill,
   runGatesDrill and runPoleDrill in ui/drills.js). Each reader below says what
   its drill already says, off the same engine reads: compute()'s CQ, EX, PULL,
   tier and balance, TIER_BY, verpRead and VERP_VS, MIRROR through compassAt,
   and the address an imprint landed on. The third register routes to a real
   release the same way the archetype and mask readers do. */
function insParasCore(r){
 var low=insLowLaw(), cl1=[], cl2=[];
 cl1.push(insClause(insSeg('The core is your coherence, CQ, at '+fmtPct('cq',r.CQ)+(r.tier?', which reads '+r.tier+'.':'.'),
  ['r.CQ','r.tier'],'mine',{fig:[insFig('cq',r.CQ)]}),0));
 var td=r.tier&&TIER_BY[r.tier]?TIER_BY[r.tier].def:'';
 if(td&&insOk(td))cl1.push(insClause(insBook('The record says: ',td,['TIER_BY.'+r.tier+'.def'],''),1));
 if(!r.complete)cl1.push(insClause(insSeg((SI.length-(r.answered||0))+' of the '+SI.length+' laws are still to answer, and each counts nothing until it is.',['r.answered'],'mine'),0));
 var pl=fmtPct('pull',r.PULL);
 cl2.push(insClause(insSeg('Expression is '+fmtPct('expression',r.EX)+', coherence times what the shadow leaves'+(pl!==PCT_DASH?', with the shadow taking '+pl:'')+'.',
  ['r.EX','r.PULL'],'mine',{fig:[insFig('expression',r.EX)].concat(pl!==PCT_DASH?[insFig('pull',r.PULL)]:[])}),0));
 if(low)cl2.push(insClause(insSeg('Your lowest law is '+low.nm+' at '+fmtPct('law',S.law[low.nm])+', seated at the '+insSeat(low.b)+' point.',
  ['S.law.'+low.nm,'SI.'+low.nm+'.b'],'mine',{fig:[insFig('law',S.law[low.nm])],place:true}),0));
 cl2.push(insClause(insSeg('Coherence is the alignment between what arrives, the way you read it, the intention behind it and the action that follows.',['model:core'],'model'),1));
 var cl3=[insClause(insRouteTo(low?insHeavyAt(low.b):insHeavyAt(),low?'at that law’s point':'where the most is held'),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from the '+SI.length+' laws, each read from nothing to ten, added together.',['model:cq'],'model'),0),
  insClause(insSeg('The shadow does not touch it. It pulls on expression instead.',['model:pull'],'model'),0),
  insClause(insSeg('It feeds the word your reading carries and the place the compass marks.',['model:tier'],'model'),1)];
 return insFour(cl1,cl2,cl3,cl4);}
/* the axes the Compass and the cones read, each where compassAt places it,
   the unanswered ones left out the way the mirror drill prints them unread */
function insAxes(r){
 return MIRROR.map(function(m){return {m:m,pos:compassAt(insSeatRow(r,m.seat))};});}
function insParasPath(r){
 var cq=Math.max(0,Math.min(100,r.CQ)), cl1=[], cl2=[];
 cl1.push(insClause(insSeg('The compass places your coherence at '+fmtPct('cq',cq)+', on a line from nothing at the base to '+fmtPct('cq',100)+' at the crown.',
  ['r.CQ'],'mine',{fig:[insFig('cq',cq),insFig('cq',100)]}),0));
 if(r.tier)cl1.push(insClause(insSeg('The word there is '+r.tier+'.',['r.tier'],'mine'),0));
 cl2.push(insClause(insSeg('Above '+fmtPct('cq',MEDIAN)+' your energy builds more than it costs. Below it, it costs more than it builds.',
  ['model:median'],'model',{fig:[insFig('cq',MEDIAN)]}),0));
 if(r.complete&&cq>=MEDIAN_LO&&cq<=MEDIAN_HI)cl2.push(insClause(insSeg('It sits in the median range, '+fmtPct('cq',MEDIAN_LO)+' to '+fmtPct('cq',MEDIAN_HI)
  +', where the reading crosses the line both ways.',['r.CQ','model:median'],'mine',{fig:[insFig('cq',MEDIAN_LO),insFig('cq',MEDIAN_HI)]}),1));
 var ax=insAxes(r).filter(function(x){return x.pos!=null;}).sort(function(a,b){return a.pos-b.pos;}), lo=ax[0];
 if(lo)cl2.push(insClause(insSeg('Your lowest axis is '+lo.m.q+', at '+fmtPct('axis',lo.pos)+', between '+lo.m.dn+' at nought and '+lo.m.up+' at a hundred.',
  ['MIRROR.'+lo.m.k+'.q','r.seats'],'mine',{fig:[insFig('axis',lo.pos)]}),1));
 var cl3=[insClause(insRouteTo(lo?insHeavyAt(lo.m.seat):insHeavyAt(),lo?'on that axis’s point':'where the most is held'),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from your coherence alone: the marker is CQ, and how far it drifts is the range it moves in.',['model:compass'],'model'),0),
  insClause(insSeg('Each axis is read from what is held at its point and the integrity measured there, never asked.',['model:axis'],'model'),1)];
 return insFour(cl1,cl2,cl3,cl4);}
function insParasBal(r){
 var b=r.balance||{}, cl1=[], cl2=[];
 var heavy=function(list){return list.filter(function(c){return (S.charge[c]||0)>0;})
  .map(function(c,j){return {c:c,j:j};}).sort(function(x,y){return ((S.charge[y.c]||0)-(S.charge[x.c]||0))||(x.j-y.j);}).map(function(z){return z.c;})[0]||null;};
 cl1.push(insClause(insSeg('Balance is which way your field discharges, outward or inward.',['model:balance'],'model'),0));
 cl1.push(insClause(b.read?insSeg(b.lean===0?'It is even.':'It leans '+(b.lean>0?'outward':'inward')+'.',['r.balance'],'mine')
  :insSeg('Neither side holds enough yet, so no direction is named.',['gap:balance'],'gap'),0));
 cl2.push(insClause(insSeg('The '+(OUTWARD.length+INWARD.length)+' axes split by the direction the body takes under them. '+OUTWARD.length+' discharge outward and '
  +INWARD.length+' withdraw inward, so the means are what compare.',['model:balance'],'model'),1));
 if(b.read)cl2.push(insClause(insSeg('Outward mean '+fmtPct('charge',b.outMean)+' against inward mean '+fmtPct('charge',b.inMean)+'.',['r.balance'],'mine',
  {fig:[insFig('charge',b.outMean),insFig('charge',b.inMean)]}),0));
 var ho=heavy(OUTWARD), hi=heavy(INWARD), bits=[];
 if(ho)bits.push('outward is '+ho+' at '+fmtPct('charge',S.charge[ho]));
 if(hi)bits.push((ho?'inward ':'inward is ')+hi+' at '+fmtPct('charge',S.charge[hi]));
 if(bits.length)cl2.push(insClause(insSeg('The heaviest '+bits.join(', and ')+'.',[ho,hi].filter(Boolean).map(function(c){return 'S.charge.'+c;}),'mine',
  {fig:[ho,hi].filter(Boolean).map(function(c){return insFig('charge',S.charge[c]);})}),1));
 var lean=b.read&&b.lean!==0?(b.lean>0?ho:hi):heavy(OUTWARD.concat(INWARD));
 var can=lean&&insightRelease({kind:'fet',nm:lean},r,{}).ok;
 var cl3=[insClause(can?insSeg('A release works at an address, so open '+lean+' to start one '+(b.read&&b.lean!==0?'on the side it leans.':'on the heaviest charge.'),
  ['model:release','CHILD.'+lean+'.nm'],'model'):insRouteTo(null),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from the same charges every child emotion holds, split by direction.',['model:balance'],'model'),0),
  insClause(insSeg('It names a direction and is never added into coherence, which is the laws alone.',['model:cq'],'model'),0)];
 return insFour(cl1,cl2,cl3,cl4);}
/* AN IMPRINT is one entry's charge at one address. The drill knows which, and
   says so with insDoor's third argument now; the entry's own words stay in
   the drill, quoted whole, because the composer quotes nothing a person
   wrote (the header above). */
function insParasAtom(sel,r,o){
 var n=sel.i!=null?BY[sel.i]:null; if(!n)return insParasOther(sel,o);
 var cl1=[], cl2=[];
 cl1.push(insClause(insSeg('This imprint is charge one of your journal entries placed at '+n.k+'.',['NODES.'+n.i+'.k'],'mine'),0));
 cl1.push(insClause(insSeg(n.k+' sits '+insNodeAt(n)+(n.cf?', in the '+insSeat(n.b)+' point.':'.'),['NODES.'+n.i+'.n','NODES.'+n.i+'.b'],'model',{place:true}),1));
 cl1.push(insClause(insSeg('The reading placed it from your words, so it is inferred, not something you named.',['model:imprint'],'model'),2));
 cl2.push(insClause(insHeld('weight',n.sq)?insSeg(n.k+' now holds '+fmtPct('weight',n.sq)+' in all.',['NODES.'+n.i+'.k'],'mine',{fig:[insFig('weight',n.sq)],place:true})
  :insSeg('Nothing is left held at '+n.k+' after the opposite.',['NODES.'+n.i+'.k'],'mine',{place:true}),0));
 if(n.cf)cl2.push(insClause(insSeg('It carries '+n.cf+', held at '+fmtPct('charge',S.charge[n.cf]||0)+'.',['S.charge.'+n.cf],'mine',{fig:[insFig('charge',S.charge[n.cf]||0)]}),1));
 var cl3=[insClause(n.cf&&n.sq>=1?insRouteTo(n,'there'):insSeg('This address holds too little to open a release.',['gap:release'],'gap'),0),insClause(insDoorSeg(),0)];
 var sabs=insSabsAt(r,n.i).slice(0,3);
 var cl4=[insClause(insSeg('It is built from one entry in your journal, read word by word.',['model:imprint'],'model'),0),
  insClause(insSeg('It feeds the weight at '+n.k+(n.cf?' and the charge on '+n.cf:'')+'.',['NODES.'+n.i+'.k'],'model',{place:true}),0)];
 if(sabs.length)cl4.push(insClause(insSeg('Running on that address: '+insAnd(sabs.map(function(s){return insBase(s)+' at '+fmtPct('chain',s.w);}))+'.',
  sabs.map(function(s){return 'r.sabs:'+s.nm+'.w';}),'mine',{fig:sabs.map(function(s){return insFig('chain',s.w);})}),1));
 cl4.push(insClause(insSeg('Each step is a registration the reading made, not a cause.',['model:trace'],'model'),3));
 return insFour(cl1,cl2,cl3,cl4);}
/* A LAW OF ACTION. The drill opens it by key and the tests by name, so both
   find it. "Nothing read yet" only when nothing was, the drill's own rule. */
function insGate(nm){return verpRead().filter(function(x){return x.k===nm||x.nm===nm;})[0]||null;}
function insParasGates(sel,r,o){
 var v=insGate(sel.nm); if(!v)return insParasOther(sel,o);
 var V=verpRead(), evid=V.some(function(x){return x.n>0;}), up=v.side==='higher';
 var vs=V.filter(function(x){return x.k===VERP_VS[v.k];})[0], cl1=[], cl2=[];
 cl1.push(insClause(insSeg(v.nm+' is '+insKindNoun('gates')+', a move of '+(up?'right':'wrong')+' action.',['VERP.'+v.k+'.side'],'model'),0));
 cl1.push(insClause(v.n?insSeg('It is '+fmtPct('gate',v.pct)+' of every Law of Action read in your stories.',['model:verp'],'mine',{fig:[insFig('gate',v.pct)]})
  :insSeg(evid?'No sentence of yours has run through it yet.':'Nothing read yet, so no sentence of yours has run through it.',['gap:verp'],'gap'),0));
 if(insOk(v.d))cl2.push(insClause(insBook('What it sounds like: ',v.d,['VERP.'+v.k+'.d'],'.'),0));
 cl2.push(insClause(insSeg(up?'It lets the feeling pass without sticking.':'It makes the feeling stick in your body as charge.',['VERP.'+v.k+'.side'],'model'),0));
 if(vs)cl2.push(insClause(insSeg(vs.nm+' stands across from it'+(vs.n?', at '+fmtPct('gate',vs.pct):'')+'.',['VERP.'+vs.k+'.nm'],'mine',
  vs.n?{fig:[insFig('gate',vs.pct)]}:{}),1));
 var cl3=[insClause(insRouteTo(insHeavyAt(),'where the most is held'),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from the sentences in your stories that match its cues'+(v.n?', '+v.n+' so far':'')+'.',['model:verp'],'mine'),0),
  insClause(insSeg('It feeds one share of the '+V.length+' Laws of Action. Nothing you are shown is multiplied by it, and coherence is the laws alone.',['model:verp'],'model'),0)];
 return insFour(cl1,cl2,cl3,cl4);}
function insParasPole(sel,r){
 var up=!/downward/i.test(sel.nm||''), ax=insAxes(r), on=ax.filter(function(x){return x.pos!=null;}), cl1=[], cl2=[];
 cl1.push(insClause(insSeg(up?'The upward cone is the '+MIRROR.length+' qualities at full expression.'
  :'The downward cone is the same '+MIRROR.length+' qualities at full inversion.',['model:pole'],'model'),0));
 cl1.push(insClause(insSeg('They are behaviours, not entities, and coordinates, not a summit.',['model:pole'],'model'),1));
 var byPos=on.slice().sort(function(a,b){return a.pos-b.pos;}), near=up?byPos[byPos.length-1]:byPos[0], far=up?byPos[0]:byPos[byPos.length-1];
 if(near){
  cl2.push(insClause(insSeg('You sit nearest full '+(up?'expression':'inversion')+' on '+near.m.q+', at '+fmtPct('axis',near.pos)+', toward '+(up?near.m.up:near.m.dn)+'.',
   ['MIRROR.'+near.m.k+'.q','r.seats'],'mine',{fig:[insFig('axis',near.pos)]}),0));
  if(far&&far!==near)cl2.push(insClause(insSeg('And furthest on '+far.m.q+', at '+fmtPct('axis',far.pos)+'.',['MIRROR.'+far.m.k+'.q','r.seats'],'mine',{fig:[insFig('axis',far.pos)]}),1));}
 else cl2.push(insClause(insSeg('No axis is answered yet, so nothing places you on one.',['gap:axis'],'gap'),0));
 var open=ax.length-on.length;
 if(near&&open)cl2.push(insClause(insSeg(open+(open===1?' axis is':' axes are')+' not answered yet.',['gap:axis'],'gap'),2));
 var lo=byPos[0];
 var cl3=[insClause(insRouteTo(lo?insHeavyAt(lo.m.seat):insHeavyAt(),lo?'on the point of your lowest axis':'where the most is held'),0),insClause(insDoorSeg(),0)];
 var cl4=[insClause(insSeg('It is built from each axis’s point: the charge held there and the integrity of the laws seated there place you on it.',['model:axis'],'model'),0),
  insClause(insSeg('It is read rather than asked, and it is not a verdict.',['model:axis'],'model'),0)];
 return insFour(cl1,cl2,cl3,cl4);}

/* ============================================================
   THE PAGES. One per register, in his order: what it is, how it works, the
   behaviour, the mechanic. The dots page down through one selection and
   never change it. Until 20 November they paged sideways, into the
   selection's parts and its parent (insPageSels, gone with that): those
   records are named now, with their percents, in the fourth register, and
   each is one press away in the stack below, which is where a selection is
   changed.

   WITH THE SAFETY CHECK ON, the behaviour register is the safety line alone
   and it is the first page, so the line is never behind a dot.
   ============================================================ */
function insTitle(sel,r){
 if(INS_LIST[sel.kind]){var p=insFind(r,sel.kind,sel.nm);return p?insBase(p):sel.nm;}
 if(sel.kind==='addr'||(sel.kind==='atom'&&sel.i!=null)){var n=BY[sel.i];return n?n.k:'';}
 if(sel.kind==='gates'){var v=insGate(sel.nm);if(v)return v.nm;}
 return sel.nm||INS_CAP[sel.kind]||'';}
/* an imprint is keyed by its address, so a second imprint opened is a new
   selection and starts on its first page */
function insSelKey(sel){return sel?sel.kind+':'+(sel.kind==='addr'||(sel.kind==='atom'&&sel.i!=null)?sel.i:(sel.nm||'')):'';}
function insParas(sel,r,g,o){
 o=o||{};
 var safe=!!o.safe, rel=insightRelease(sel,r,o), ps;
 if(INS_LIST[sel.kind]){
  var p=insFind(r,sel.kind,sel.nm); if(!p)return null;
  return [insP1Pattern(p,r),insP2Pattern(p,r,g),insP3Pattern(p,r,rel,safe),insP4Pattern(p,r,g)];}
 if(sel.kind==='fet'){
  var c=CHILD.filter(function(x){return x.nm===sel.nm;})[0]; if(!c)return null;
  return [insP1Fet(c,r),insP2Fet(c,r,g),insP3Fet(c,r,rel,safe),insP4Fet(c,r)];}
 if(sel.kind==='addr'){
  var n=BY[sel.i]; if(!n)return null;
  return [insP1Addr(n,r),insP2Addr(n,r,g),insP3Addr(n,r,rel,safe),insP4Addr(n,r)];}
 if(sel.kind==='dom'){
  var d=DOMAINS.filter(function(x){return x.nm===sel.nm;})[0]; if(!d)return null;
  ps=insParasDom(d,o,g);}
 else{
  var K={arch:insParasArch,mask:insParasMask,law:insParasLaw,seat:insParasSeat,gates:insParasGates,atom:insParasAtom};
  ps=K[sel.kind]?K[sel.kind](sel,r,o)
   :sel.kind==='core'?insParasCore(r):sel.kind==='path'?insParasPath(r):sel.kind==='bal'?insParasBal(r)
   :sel.kind==='pole'?insParasPole(sel,r):insParasOther(sel,o);}
 if(safe)ps[2]=insSafeP3();
 return ps;}
/* THE ONE ENTRY. sel is {kind, nm} or {kind:'addr', i}. Returns
   {ok, id, pages, rel, safe}, or {ok:false, why} when nothing can be read:
   an unread record, a pattern that is no longer running. */
function insightRead(sel,r,g,o){
 o=o||{};
 if(!sel||!r)return {ok:false,why:'none'};
 if(r.unread)return {ok:false,why:'unread'};
 var paras=insParas(sel,r,g,o);
 if(!paras)return {ok:false,why:'gone'};
 var obj=INS_LIST[sel.kind]?insFind(r,sel.kind,sel.nm):null;
 var kindWord=INS_CAP[sel.kind]||'Selection';
 if(obj&&obj.over)kindWord=kindWord+', overshot';
 var fig='';
 if(obj)fig=fmtPct('chain',obj.w);
 else if(sel.kind==='addr'&&BY[sel.i])fig=fmtPct('weight',BY[sel.i].sq);
 else if(sel.kind==='fet')fig=fmtPct('charge',S.charge[sel.nm]||0);
 /* an unanswered law sits at the seed, and its card prints no figure for it */
 else if(sel.kind==='law'&&S.law&&S.law[sel.nm]!==undefined&&insLawRead(sel.nm))fig=fmtPct('law',S.law[sel.nm]);
 /* MASK AND ARCHETYPE HAD NO FIGURE HERE, round <ana-squarified-treemap>: the
    headline carried a figure for a pattern, an address, a fetter and a law,
    and nothing for the two kinds a squarified cell can now open straight into
    Insight on. Both numbers already exist and are already printed elsewhere
    on this same record (ui/analytics.js's anaField call for Masks read
    fmtPct('weight',m.w) off r.maskRing, and for Archetypes read
    fmtPct('archetype',archExpr(i))); this only lets the rail's own headline
    read the same figure instead of staying blank. A domain gets none here on
    purpose: engine/compute.js never measures a domain's charge, a domain is
    a selection out of the blueprint, and anaField's own comment for Domains
    said so by name ("a domain, which is a selection and not a measurement,
    prints none"). Inventing a domain percent here would be exactly the
    fabricated figure this file's own validateProfile boundary exists to
    refuse elsewhere. */
 else if(sel.kind==='mask'){
  var mk=(r.maskRing||[]).filter(function(x){return x.nm===sel.nm;})[0];
  if(mk)fig=fmtPct('weight',mk.w);}
 else if(sel.kind==='arch'){
  var ai=-1; ARCH.forEach(function(a,i){if(a.nm===sel.nm)ai=i;});
  if(ai>=0)fig=fmtPct('archetype',archExpr(ai));}
 var title=insTitle(sel,r);
 var order=o.safe?[2,0,1,3]:[0,1,2,3];
 var pages=order.map(function(j,i){
  return {key:insSelKey(sel)+'#'+INS_REG[j],sel:sel,title:title,reg:INS_REG[j],paras:[paras[j]],
   aria:'Page '+(i+1)+' of '+order.length+', '+INS_REG_NAME[j]+', '+title,
   tip:'Page '+(i+1)+': '+INS_REG_NAME[j]+' of '+title};});
 return {ok:true,safe:!!o.safe,id:{key:insSelKey(sel),title:title,kindWord:kindWord,fig:fig,
  over:!!(obj&&obj.over)},pages:pages,rel:insightRelease(sel,r,o)};}
/* the words of one paragraph or page, plain, for the voice and for the tests.
   speakOnly keeps the segments the voice may say. */
function insightText(paras,speakOnly){
 return paras.map(function(p){
  return p.h+' '+p.segs.filter(function(s){return !speakOnly||s.speak;}).map(function(s){return s.text;}).join(' ');}).join(' ');}
