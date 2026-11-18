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
   returns three paragraphs per page. No language model: every clause is a
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
 addr:'Address',dom:'Blueprint domain',arch:'Archetype',mask:'Mask',law:'Law',seat:'Seat',core:'Core',
 path:'Path',bal:'Balance',atom:'Imprint',gates:'Gates',pole:'Pole'};
var INS_LIST={sab:'sabs',cx:'cxs',hy:'hys',sup:'sups'};
var INS_UP={sab:'cx',cx:'hy',hy:'sup'};
/* the three fixed run-in headers, a label and never data */
var INS_HEAD=['Where it sits.','How it runs.','What to do.'];
/* the paragraph ceilings that keep three paragraphs inside a short scroll at
   390: 70, 70 and 60 words, 200 in all, under the 210 the owner's own "much
   longer" was set against. */
var INS_MAX=[70,70,60];
var INS_BAN=/\b(should|must|need to|needs to|have to|has to)\b/i;
/* what a person sees on hover over a book line: where it came from, in words */
var INS_SRC_WORDS={SABDEF:'the saboteur record',SABCARD:'the saboteur card',HCX_LIB:'the hyper complex record',
 HCXCARD:'the hyper complex card',CHILD:'the child emotion table',AFFIRM:'the affirmation table',
 CHALLENGE:'the daily challenge table',DOMDEF:'the domain record',APC:'the seat record',HARM:'the law record',
 ARCH:'the archetype record',MASKS:'the mask record',NODES:'the address table',FAM_POLE:'the family table',
 CRISIS_SAY:'the safety line'};

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
var INS_ARR={HCX_LIB:'nm',CHILD:'nm',NODES:'i',DOMAINS:'nm',ARCH:'nm',MASKS:'nm',SI:'nm',APC:'b',HARM:'t'};
function insightResolve(path,r){
 var t=String(path||'');
 if(/^(model|gap):/.test(t))return true;
 var tok=t.split('.'), root=tok.shift(), cur;
 var T={S:S,SABDEF:SABDEF,SABCARD:SABCARD,HCXCARD:HCXCARD,DOMDEF:DOMDEF,AFFIRM:AFFIRM,CHALLENGE:CHALLENGE,
  FAM_POLE:FAM_POLE,CRISIS_SAY:CRISIS_SAY,HCX_LIB:HCX_LIB,CHILD:CHILD,NODES:NODES,DOMAINS:DOMAINS,ARCH:ARCH,
  MASKS:MASKS,SI:SI,APC:APC,HARM:HARM,r:r};
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
  cl.push(insClause(insSeg('The library has no name for this cluster, so it is named for its seat and its feeling.',
   [path+'.unnamed'],'mine'),2));
 if(over)
  cl.push(insClause(insSeg('That is the opposite pushed past where it helps.',['FAM_POLE'],'model'),1));
 /* ONE STEP DOWN, EACH PART WITH ITS PERCENT */
 if(o.kind==='sab'){
  var top=insBySq(leaves(o)).slice(0,3);
  if(top.length){
   var bits=top.map(function(n){return insAtPct(n.k,'weight',n.sq);});
   var held=top.filter(function(n){return insHeld('weight',n.sq);});
   cl.push(insClause(insSeg('It is built on '+insAnd(bits)+'.'+(held.length?'':' Each has nothing left after the opposite.'),
    top.map(function(n){return 'NODES.'+n.i+'.k';}),
    'mine',{fig:held.map(function(n){return insFig('weight',n.sq);})}),1));
   cl.push(insClause(insSeg(top[0].k+' sits '+insNodeAt(top[0])+', in the '+insSeat(top[0].b)+' seat.',
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
   {fig:chain.map(function(u){return insFig('chain',u.w);})}),2));}
 else if(o.kind==='sup')
  cl.push(insClause(insSeg('Nothing sits above it.',['model:top'],'model'),2));
 else
  cl.push(insClause(insSeg('Nothing above it is joined to it yet.',['model:top'],'model'),2));
 /* ITS OWN LINE, FROM THE BOOK. A hyper complex is its family, so it quotes
    the line and does not say it belongs to itself, which was circular. */
 if(o.kind==='sab'&&!over){
  var def=SABDEF[KB_KEY(base)];
  if(def&&def.q&&insOk(def.q))
   cl.push(insClause(insBook('Its line: ',def.q,['SABDEF.'+KB_KEY(base)+'.q'],'.'),3));
  else{var f=patFam(o); if(f&&insOk(f.d))cl.push(insClause(insSeg('It belongs to the '+f.nm+' family: '+f.d+'.',['HCX_LIB.'+f.nm+'.d'],'book'),3));}}
 else if(o.kind==='hy'){
  var fh=patFam(o);
  if(fh&&insOk(fh.d)){
   if(over)cl.push(insClause(insSeg('Its family line: '+fh.d+'.',['FAM_POLE'],'model'),3));
   else cl.push(insClause(insBook('Its line: ',fh.d,['HCX_LIB.'+fh.nm+'.d'],'.'),3));}}
 else if(o.kind==='cx'){
  var fc=patFam(o);
  if(fc&&insOk(fc.d))cl.push(insClause(insSeg('It belongs to the '+fc.nm+' family: '+fc.d+'.',
   [over?'FAM_POLE':'HCX_LIB.'+fc.nm+'.d'],'book'),3));}
 return insPack(INS_HEAD[0],cl,INS_MAX[0]);}

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
  cl.push(insClause(insSeg('The map seats '+c0.nm+' '+insAtPlace(c0.addr)+'.',
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
 cl.push(insClause(insSeg('The map seats it '+insAtPlace(c.addr)+', in the '+insSeat(c.seat)+' seat.',
  ['CHILD.'+c.nm+'.addr','CHILD.'+c.nm+'.seat'],'model',{place:true}),1));
 var sabs=insFetSabs(r,c.nm).slice(0,3);
 if(sabs.length)cl.push(insClause(insSeg(insAnd(sabs.map(function(s){return insBase(s)+' at '+fmtPct('chain',s.w);}))+(sabs.length===1?' runs':' run')+' on it.',
  sabs.map(function(s){return 'r.sabs:'+s.nm+'.w';}),'mine',{fig:sabs.map(function(s){return insFig('chain',s.w);})}),1));
 else cl.push(insClause(insSeg('No saboteur runs on it yet.',['gap:sabs'],'gap'),1));
 return insPack(INS_HEAD[0],cl,INS_MAX[0]);}
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
 cl.push(insClause(insSeg(n.k+' is an address, '+insNodeAt(n)+', in the '+insSeat(n.b)+' seat'
  +(insHeld('weight',n.sq)?', at '+fmtPct('weight',n.sq)+'.':'. It has nothing left after the opposite.'),
  ['NODES.'+n.i+'.k','NODES.'+n.i+'.n','NODES.'+n.i+'.b'],'mine',{fig:insHeld('weight',n.sq)?[insFig('weight',n.sq)]:[],place:true}),0));
 if(n.a&&n.d&&insOk(n.a)&&insOk(n.d))
  cl.push(insClause(insSeg('Held clear, it reads '+insLow1(n.a)+'. Distorted, it reads '+insLow1(n.d)+'.',['NODES.'+n.i+'.a','NODES.'+n.i+'.d'],'book'),1));
 var sabs=insSabsAt(r,n.i).slice(0,3);
 if(sabs.length)cl.push(insClause(insSeg('Running on it: '+insAnd(sabs.map(function(s){return insBase(s)+' at '+fmtPct('chain',s.w);}))+'.',
  sabs.map(function(s){return 'r.sabs:'+s.nm+'.w';}),'mine',{fig:sabs.map(function(s){return insFig('chain',s.w);})}),0));
 else cl.push(insClause(insSeg('No saboteur runs on it yet.',['gap:sabs'],'gap'),0));
 return insPack(INS_HEAD[0],cl,INS_MAX[0]);}
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
function insParasDom(d,o){
 /* four domains are a different key in DOMDEF, the book's own name for them */
 var key=KB_KEY(d.nm), alt=(typeof KB_RENAME!=='undefined')?KB_RENAME[key]:null;
 if(!DOMDEF[key]&&alt&&DOMDEF[KB_KEY(alt)])key=KB_KEY(alt);
 var def=DOMDEF[key]||{};
 var cl1=[insClause(insSeg(d.nm+' is a blueprint domain'+(d.r?', in the '+d.r+' cluster':'')+'.',['DOMAINS.'+d.nm+'.nm'],'model'),0)];
 var pick=o.soulFrom==='default'?'It is the default. You have not picked one yet.':(o.soulFrom==='picked'?'You picked it.':'');
 if(pick)cl1.push(insClause(insSeg(pick,['model:soul'],'mine'),1));
 if(def.c&&insOk(insFirst(def.c)))cl1.push(insClause(insBook('Read clear: ',insFirst(def.c),['DOMDEF.'+key+'.c'],''),1));
 var cl2=[insClause(insSeg('Nothing in your entries is linked to a domain yet. The engine reads it from your blueprint.',['gap:domain'],'gap'),0)];
 var cl3=[];
 if(def.x&&insOk(def.x))cl3.push(insClause(insBook('Read distorted: ',insFirst(def.x),['DOMDEF.'+key+'.x'],''),1));
 cl3.push(insClause(insSeg('A release works at an address, so pick a pattern or an address to start one.',['model:release'],'model'),0));
 cl3.push(insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0));
 return [insPack(INS_HEAD[0],cl1,INS_MAX[0]),insPack(INS_HEAD[1],cl2,INS_MAX[1]),insPack(INS_HEAD[2],cl3,INS_MAX[2])];}

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
function insParasOther(sel,o){
 var nm=sel.nm||'', word=(INS_CAP[sel.kind]||'Selection').toLowerCase();
 var lead=sel.kind==='core'?'The core is the centre of the wheel.':(nm?insCap1(nm)+' is '+insArt(word)+' '+word+'.':insCap1(word)+' is selected.');
 var cl1=[insClause(insSeg(lead,['model:'+sel.kind],'model'),0)];
 if(sel.kind==='law'&&S.law&&S.law[nm]!==undefined)
  cl1.push(insClause(insSeg('It reads '+fmtPct('law',S.law[nm])+'.',['S.law.'+nm],'mine',{fig:[insFig('law',S.law[nm])]}),0));
 var ln=insLineFor(sel);
 if(ln&&insOk(ln.t)){
  cl1.push(insClause(insBook('The record says: ',ln.t,[ln.src],'',sel.kind==='seat'),1));}
 var cl2=[insClause(insSeg('Nothing in your entries is linked to this yet. Source AI has no longer reading of it so far.',['gap:'+sel.kind],'gap'),0)];
 var cl3=[insClause(insSeg('A release works at an address, so pick a pattern or an address to start one.',['model:release'],'model'),0),
  insClause(insSeg('Leaving it costs nothing. It is here next time.',['model:door'],'model'),0)];
 return [insPack(INS_HEAD[0],cl1,INS_MAX[0]),insPack(INS_HEAD[1],cl2,INS_MAX[1]),insPack(INS_HEAD[2],cl3,INS_MAX[2])];}

/* ============================================================
   THE PAGES. One per rung: the selection, then its direct parts heaviest
   first, up to three, then its parent. A child emotion pages through the
   saboteurs that run on it. A page with no data is not drawn, so there is
   never a dead dot. The dots page into the next record, never into new
   prose, and paging never changes the selection.
   ============================================================ */
function insTitle(sel,r){
 if(INS_LIST[sel.kind]){var p=insFind(r,sel.kind,sel.nm);return p?insBase(p):sel.nm;}
 if(sel.kind==='addr'){var n=BY[sel.i];return n?n.k:'';}
 return sel.nm||INS_CAP[sel.kind]||'';}
function insSelKey(sel){return sel?sel.kind+':'+(sel.kind==='addr'?sel.i:(sel.nm||'')):'';}
function insParas(sel,r,g,o){
 o=o||{};
 var safe=!!o.safe, rel=insightRelease(sel,r,o);
 if(INS_LIST[sel.kind]){
  var p=insFind(r,sel.kind,sel.nm); if(!p)return null;
  return [insP1Pattern(p,r),insP2Pattern(p,r,g),insP3Pattern(p,r,rel,safe)];}
 if(sel.kind==='fet'){
  var c=CHILD.filter(function(x){return x.nm===sel.nm;})[0]; if(!c)return null;
  return [insP1Fet(c,r),insP2Fet(c,r,g),insP3Fet(c,r,rel,safe)];}
 if(sel.kind==='addr'){
  var n=BY[sel.i]; if(!n)return null;
  return [insP1Addr(n,r),insP2Addr(n,r,g),insP3Addr(n,r,rel,safe)];}
 if(sel.kind==='dom'){
  var d=DOMAINS.filter(function(x){return x.nm===sel.nm;})[0]; if(!d)return null;
  var ps=insParasDom(d,o); if(safe)ps[2]=insSafeP3(); return ps;}
 var ps2=insParasOther(sel,o); if(safe)ps2[2]=insSafeP3(); return ps2;}
function insPageSels(sel,r){
 var out=[], p, up;
 if(INS_LIST[sel.kind]){
  p=insFind(r,sel.kind,sel.nm); if(!p)return out;
  var parts=p.kind==='sab'
   ?insBySq(leaves(p)).slice(0,3).map(function(n){return {sel:{kind:'addr',i:n.i},rung:'part'};})
   :insByW(p.parts).slice(0,3).map(function(x){return {sel:{kind:x.kind,nm:x.nm},rung:'part'};});
  out=out.concat(parts);
  up=insUp(p,r); if(up)out.push({sel:{kind:up.kind,nm:up.nm},rung:'parent'});}
 else if(sel.kind==='fet'){
  out=insFetSabs(r,sel.nm).slice(0,3).map(function(s){return {sel:{kind:'sab',nm:s.nm},rung:'part'};});}
 else if(sel.kind==='addr'){
  out=insSabsAt(r,sel.i).slice(0,3).map(function(s){return {sel:{kind:'sab',nm:s.nm},rung:'parent'};});}
 return out;}
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
 else if(sel.kind==='law'&&S.law&&S.law[sel.nm]!==undefined)fig=fmtPct('law',S.law[sel.nm]);
 var title=insTitle(sel,r);
 var pages=[{key:insSelKey(sel),sel:sel,title:title,rung:'self',
  tip:'Page 1: '+title+', what you picked',paras:paras}];
 insPageSels(sel,r).forEach(function(ps){
  var pp=insParas(ps.sel,r,g,o); if(!pp)return;
  var t=insTitle(ps.sel,r);
  pages.push({key:insSelKey(ps.sel),sel:ps.sel,title:t,rung:ps.rung,paras:pp,
   tip:ps.rung==='parent'?t+', what this feeds':'Page '+(pages.length+1)+': '+t+', a part of this'});});
 pages.forEach(function(pg,i){
  pg.aria='Page '+(i+1)+' of '+pages.length+', '+pg.title;
  if(pg.rung==='parent')pg.tip='Page '+(i+1)+': '+pg.title+', what this feeds';
  else if(pg.rung==='part')pg.tip='Page '+(i+1)+': '+pg.title+', a part of this';});
 return {ok:true,safe:!!o.safe,id:{key:insSelKey(sel),title:title,kindWord:kindWord,fig:fig,
  over:!!(obj&&obj.over)},pages:pages,rel:insightRelease(sel,r,o)};}
/* the words of one paragraph or page, plain, for the voice and for the tests.
   speakOnly keeps the segments the voice may say. */
function insightText(paras,speakOnly){
 return paras.map(function(p){
  return p.h+' '+p.segs.filter(function(s){return !speakOnly||s.speak;}).map(function(s){return s.text;}).join(' ');}).join(' ');}
