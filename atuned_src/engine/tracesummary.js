/* ============================================================
   TRACE SUMMARY. One blended, hedged paragraph over a graph
   engine/trace.js already built: what a node's real parents and
   real children actually say, read off the libraries that already
   carry their content, never invented.

   WHAT THIS ANSWERS. Lance's own words, confirmed 2026-10-29: "I
   should be able to select anywhere in that chain, either in the
   field or the left-hand menu, and have it show me all the
   connections parent to child and give me a summary from source AI
   as a blend of all those records showing me how all the patterns
   are playing through me." traceSummary(g, node) below is that: it
   takes the graph traceFromRecord(p, intents, reading) already built
   for one person and a node already on it, and returns the real
   parent(s) and real child(ren) THE CHAIN (trace.js) connects it to,
   plus one paragraph narrating how their real content relates to the
   selected node.

   A SIBLING FILE, ON PURPOSE, NOT A NEW BLOCK INSIDE trace.js.
   trace.js's own header says what that file is: it reads the objects
   that exist and holds the relationships nothing else holds, plain
   data, safe to JSON round trip. traceChainAttrs there is explicit
   about why a rung's own display line is kept off the graph node:
   "never d, the line a person is shown... a graph that carried them
   would be one more place to print them from." A narrated paragraph
   IS printing, so it is kept out of that file and reads it instead,
   the same way engine/loop.js (the one read of the graph a screen
   asks) already sits beside trace.js rather than inside it. Nothing
   here adds a node, adds an edge, or changes p.trace: every function
   below takes a graph and returns data, and never mutates the graph
   it is handed.

   WHERE A NODE'S REAL CONTENT ACTUALLY LIVES. Checked against the
   real tables rather than assumed:
     pattern (address)   engine/data/nodes.js's own 112-row table,
                          its a (what becomes available) and d (the
                          collapsed expression), by address number.
                          A fetter pseudo-pattern (pattern:fetter:X,
                          THE SIGNAL -> FETTER PATH in trace.js) is
                          the classification several addresses share
                          and carries none of that itself.
     saboteur             engine/data/kb.js's SABDEF.q, the pattern's
                          own sentence, what it says, and engine/data/
                          sabcard.js's SABCARD.h and .a, the lived
                          behaviour and what becomes available, both
                          keyed by KB_KEY off the name with any
                          " overshot" suffix stripped first (THE SAME
                          CLUSTER, OVERSHOT, engine/compute.js). An
                          unnamed cluster (chain attrs carry
                          unnamed:true) and a TULA-only name with no
                          SAB33 row (SABAUTH's own list in
                          engine/data/canon.js) resolve to neither
                          table, by design, and the paragraph says so
                          rather than printing a blank.
     complex              no table of its own. By THE CHAIN a complex
                          IS its own two saboteurs compounded
                          (engine/compute.js, cxs.push), so its real
                          content is exactly its real children's,
                          read below it, never guessed at from its own
                          name (which is literally "A + B", the two
                          saboteur names joined, not a label a card
                          could be keyed by).
     hyper_complex        engine/data/nodes.js's HCX_LIB.d and .sub,
                          by the family name the rung is literally
                          named after. An overshoot pairing can carry
                          a pole family name HCX_LIB has no row for
                          (FAM_POLE, engine/core.js); checked against
                          the table by the node's own real name either
                          way, and reported honestly when it misses
                          rather than borrowed from the family it is
                          the overshoot of.
     super_complex        no table of its own either, same reason as
                          complex: its name is its two hyper complexes
                          joined ("A / B"), not a label. DESCENT
                          (engine/data/compass.js) separately names
                          Narcissism, Machiavellianism, Sociopathy and
                          Psychopathy, but those are the dark read's
                          own clinical register for specific rungs,
                          held there on purpose and never pushed into
                          a reading's real sabs/cxs/hys/sups lists
                          (engine/compute.js says so directly), so a
                          real super_complex node's own name does not
                          match a DESCENT entry and this file does not
                          pretend otherwise by matching on anything
                          looser than the literal name.

   THE RESOLVE THEN NARRATE IDIOM. The same two steps atuned/data/
   celestial/integration/source-ai-behavioral-synthesis.cjs and
   source-ai-reading-pipeline.cjs already run over astrology and
   numerology records: resolve every real input's own fields first,
   with where each one came from; find what the resolved set actually
   shares; narrate it hedged, crediting which side said what, and say
   plainly when nothing connects rather than forcing a sentence that
   only sounds like it does. traceSummaryCard below is the resolve
   half and traceSummaryNarrate the narrate half. Rule 6 (this
   project's working rules): every number or claim shown to a person
   is real or it does not ship, so where a side has no real content
   on file the paragraph names that plainly instead of writing a
   plausible-sounding line to fill the space.

   WHAT THIS DOES NOT DO. It does not call compute(), does not read or
   write CQ, DQ or SQ, does not write a release or a reframe, does not
   write a ritual, and holds no opinion any of those could be checked
   against. It is a pure read of a graph and a few static libraries,
   handed back as data and one paragraph of prose.
   ============================================================ */

/* a chain node's name after compute()'s own " overshot" suffix
   (engine/compute.js, pushSab) is stripped. Only saboteur names carry
   that literal suffix; a hyper complex's overshoot is a different,
   real family name (FAM_POLE), not this pattern, so this helper is
   never applied to one. */
function traceSummaryBase(nm){ return String(nm).replace(/ overshot$/,''); }

/* ONE NODE'S REAL CONTENT, read off whichever library actually carries
   it. Never throws, never guesses: found is false and why names the
   reason whenever nothing resolves. attrs is the node object already
   on the graph (traceChainAttrs' or tracePatternAttrs' own output, or
   {} for a neighbor not found, which traceSummary below never actually
   hands it, kept only so this function is as safe as the rest of the
   file against a hand built graph). */
function traceSummaryCard(type,id,attrs){
 attrs=attrs||{};
 if(type==='pattern'){
  if(/^fetter:/.test(String(id)))
   return {found:false, label:attrs.fetter||String(id).replace(/^fetter:/,''),
    why:'a fetter is the classification several addresses share (NODES[].cf), and carries no address-level content of its own'};
  var n=BY[+id];
  if(!n)return {found:false, label:String(id), why:'address '+id+' is not on the 112-address table'};
  return {found:true, label:n.k,
   fields:{coherent:n.a, distorted:n.d, charge:n.c||null},
   source:'the 112-address table, NODES['+n.i+'].a and .d for '+n.k};}
 if(type==='saboteur'){
  var over=/ overshot$/.test(String(id)), base=traceSummaryBase(id), key=KB_KEY(base),
   def=SABDEF[key]||null, card=SABCARD[key]||null;
  if(!def&&!card){
   if(attrs.unnamed)
    return {found:false, label:base, over:over,
     why:'this is an unnamed cluster: it reached the saboteur threshold without matching one of the library\'s 33 named patterns, so no card or definition is on file for it'};
   return {found:false, label:base, over:over,
    why:'no saboteur card or definition is on file for '+base+(SABAUTH&&SABAUTH[base]?', though it does carry a composition of its own in SABAUTH':'')};}
  return {found:true, label:base, over:over,
   fields:{says:def?def.q:null, livedBehavior:card?card.h:null, becomesAvailable:card?card.a:null},
   source:'SABDEF.q (what it says) and SABCARD.h/.a (the lived behaviour, and what becomes available) for '+base
    +(over?', read off the base pattern: the overshoot is the same cluster run past the point it helps, not a different one':'')};}
 if(type==='complex')
  return {found:false, label:String(id),
   why:'a complex has no card of its own; by THE CHAIN it is its own two saboteurs compounded, so its content is exactly its real children\'s, below'};
 if(type==='hyper_complex'){
  var h=null;
  for(var i=0;i<HCX_LIB.length;i++)if(HCX_LIB[i].nm===id){h=HCX_LIB[i]; break;}
  if(!h)return {found:false, label:String(id), why:'no family entry is on file for '+id};
  return {found:true, label:h.nm, fields:{familyLine:h.d, clinicalCorrespondence:h.sub||null},
   source:'HCX_LIB.d and .sub for '+h.nm};}
 if(type==='super_complex')
  return {found:false, label:String(id),
   why:'a super complex has no card of its own; by THE CHAIN it is its own two hyper complexes paired, so its content is exactly its real children\'s, below'};
 return {found:false, label:String(id), why:'no content source is wired for node type '+type};}

/* THE CHAIN'S OWN DIRECTION, read off traceNeighbors and nothing else:
   a 'supports' edge runs from the rung below to the rung above
   (pattern -> saboteur -> complex -> hyper_complex -> super_complex,
   THE CHAIN, trace.js), so dir:'in' on this node is a real child (a
   part counted toward it) and dir:'out' is the real parent (the rung
   it is itself counted toward). The same filter mockups/layer-
   observatory/build-trace.js's realParts() uses and tests against a
   real tracePath, not a new convention invented for this file. */
function traceSummaryParts(g,key){
 var all=traceNeighbors(g,key,'supports');
 return {
  children:all.filter(function(x){return x.dir==='in';}),
  parents:all.filter(function(x){return x.dir==='out';})};}

/* a type name as a person reads it, never the identifier. */
var TRACE_SUMMARY_WORD={pattern:'address', saboteur:'saboteur', complex:'complex',
 hyper_complex:'hyper complex', super_complex:'super complex'};
function traceSummaryWord(type,id){
 if(type==='pattern'&&/^fetter:/.test(String(id)))return 'fetter';
 return TRACE_SUMMARY_WORD[type]||type;}
/* 'a' or 'an', off the word's own first letter, so "a address" never ships. */
function traceSummaryArticle(word){ return /^[aeiou]/i.test(word)?'an':'a'; }
function traceSummaryList(labels){
 if(!labels.length)return '';
 if(labels.length===1)return labels[0];
 return labels.slice(0,-1).join(', ')+' and '+labels[labels.length-1];}

/* ONE NODE'S REAL FIELDS, AS A QUOTED LINE. An address and a saboteur
   each carry a real pair, not a single line: an address's coherent
   pole and its collapse (NODES[].a and .d) are two sides of the same
   row, and a saboteur's own line and what becomes available (SABDEF.q
   and SABCARD.h/.a) are the pattern and its practice. Quoting only one
   side of a real pair would be true and still incomplete, so both are
   named wherever the type carries a pair; a hyper complex's family
   line (HCX_LIB.d) has no such second side on file and is quoted
   alone. Never fabricates a joiner between two fields that were never
   written next to each other: each quoted field stays in its own
   quotation marks. */
function traceSummaryOwnLine(fields){
 fields=fields||{};
 if(fields.coherent!=null||fields.distorted!=null)
  return 'coherent, "'+(fields.coherent||'not named')+'"; collapsed, "'+(fields.distorted||'not named')+'"';
 if(fields.says!=null||fields.livedBehavior!=null){
  var line=fields.says!=null?'it says "'+fields.says+'"':null,
   lived=fields.livedBehavior!=null?'lived out as "'+fields.livedBehavior+'"':null;
  return [line,lived].filter(function(x){return !!x;}).join('; ');}
 if(fields.familyLine!=null)return 'its family line is "'+fields.familyLine+'"';
 return null;}

/* ONE SIDE'S CLAUSE, hedged. Quotes a real field when one side has
   exactly one real-content neighbor (the common case, a saboteur with
   one complex or one hyper complex with one super complex); with more
   than one, names each by what it is and credits each a clause rather
   than blending their words into one borrowed sentence, which would
   claim a connection between them this file never checked. */
var TRACE_SUMMARY_PLURAL={child:'children', parent:'parents'};
function traceSummaryClause(side,items){
 var withCard=items.filter(function(x){return x.card.found;}),
  sideWord=items.length>1?TRACE_SUMMARY_PLURAL[side]||(side+'s'):side;
 if(!items.length)return 'no real '+side+' is on this graph yet';
 if(!withCard.length)
  return traceSummaryList(items.map(function(x){return traceSummaryWord(x.type,x.id)+' '+x.card.label;}))
   +' (the real '+sideWord+', but none carries further content on file)';
 var parts=withCard.map(function(x){
  var line=traceSummaryOwnLine(x.card.fields);
  return traceSummaryWord(x.type,x.id)+' '+x.card.label+(line?', read as '+line:'');});
 var thin=items.filter(function(x){return !x.card.found;});
 var tail=thin.length?('; '+traceSummaryList(thin.map(function(x){return traceSummaryWord(x.type,x.id)+' '+x.card.label;}))+' carries nothing further on file'):'';
 return parts.join('; ')+tail;}

/* RESOLVE THEN NARRATE, the second half. One paragraph, hedged, never
   asserting a connection the records themselves do not carry (the
   same discipline atuned/data/celestial/integration/source-ai-
   behavioral-synthesis.cjs's narrateSourceAI runs over astrology and
   numerology records). Ends on the same plain accounting those files
   close with: what kind of statement this is and is not. */
function traceSummaryNarrate(self,selfCard,parents,children){
 var word=traceSummaryWord(self.type,self.id), label=selfCard.label||self.id,
  sentences=[];
 if(selfCard.found){
  var own=traceSummaryOwnLine(selfCard.fields);
  sentences.push('The selected '+word+', '+label+(own?', reads as '+own:'')+'.');}
 else sentences.push('The selected '+word+', '+label+', carries nothing further on file beyond its own name and weight ('+selfCard.why+').');
 if(children.length)
  sentences.push('Below it, the real part'+(children.length>1?'s are':' is')+' '+traceSummaryClause('child',children)+'.');
 else sentences.push('Nothing sits below it on this graph: '+traceSummaryArticle(word)+' '+word+' is the floor of the chain, or none of its own parts reached the threshold yet.');
 if(parents.length)
  sentences.push('Above it, the real part'+(parents.length>1?'s are':' is')+' '+traceSummaryClause('parent',parents)+'.');
 else sentences.push('Nothing sits above it yet: either the chain stops here by design (a super complex is the top this engine reads) or this one has not compounded with another of its kind yet.');
 var cWith=children.filter(function(x){return x.card.found;}), pWith=parents.filter(function(x){return x.card.found;});
 if(cWith.length&&pWith.length)
  sentences.push('Read together, '+traceSummaryWord(cWith[0].type,cWith[0].id)+' '+cWith[0].card.label+' and '+traceSummaryWord(pWith[0].type,pWith[0].id)+' '+pWith[0].card.label
   +' are both counted toward this same '+word+' by the reading, a registration and not a claim that one causes the other or the person.');
 sentences.push('This paragraph narrates what the graph and the library already hold. It does not compute a score, and it does not write a release, a reframe or a ritual.');
 return sentences.join(' ');}

/* ============================================================
   traceSummary(g, node)

   g is a graph traceFromRecord already built. node is a key
   ('saboteur:Negotiator') or a {type,id} ref, the same form
   tracePath's from/to and traceAddEdge's from/to already take
   (traceRef). Returns {ok:false, why} by name on anything that is
   not a real node on this graph, the same convention traceNodeAdd,
   traceEdgeAdd and validateTrace already use; on a real node it
   returns the node's own data, its real parents and real children
   (traceSummaryParts, each decorated with its own real content), and
   one narrated paragraph blending them, so a caller can show the
   prose and the records it came from side by side rather than prose
   alone. Pure: reads g and the static libraries above it in MANIFEST
   order, mutates neither, and never calls compute().
   ============================================================ */
function traceSummary(g,node){
 if(!traceIsGraph(g))return {ok:false, why:'there is no graph to read'};
 var key=traceRef(node);
 if(key===null)return {ok:false, why:'names no node: '+JSON.stringify(node)};
 var ix=traceIx(g), self=ix.node[key];
 if(!self)return {ok:false, why:key+' is not a node on this graph'};
 var parts=traceSummaryParts(g,key);
 var decorate=function(n){
  var s=traceSplit(n.key), found=ix.node[n.key]||{};
  return {key:n.key, type:s.type, id:s.id, edge:n.edge, src:n.src, attrs:found,
   card:traceSummaryCard(s.type,s.id,found)};};
 var byKey=function(a,b){return a.key<b.key?-1:a.key>b.key?1:0;};
 var children=parts.children.map(decorate).sort(byKey);
 var parents=parts.parents.map(decorate).sort(byKey);
 var selfCard=traceSummaryCard(self.type,self.id,self);
 return {ok:true,
  node:{type:self.type, id:self.id, key:key, attrs:self, card:selfCard},
  parents:parents, children:children,
  summary:traceSummaryNarrate(self,selfCard,parents,children)};}
