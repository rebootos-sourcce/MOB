/* ============================================================
   THE TRACE SUMMARY, WIRED INTO THE EXISTING DRILLS. Round of 2 November,
   continuing PR #161 (the stack section on the left rail) and PR #158
   (traceSummary(g,node), engine/tracesummary.js), on his own words after
   seeing the rebuilt wheel: "the full cascade wiring of the Psyche stack
   for the field... nerve to fetter, address, to saboteur, complex, hyper-
   complex, super-complex."

   WHAT WAS ALREADY REAL, CHECKED BEFORE ANYTHING WAS ADDED. A click on a
   wheel bead already opens a real drill: runNodeDrill(n) for an address
   (ui/drills.js, nodeDrillHtml) and runDrill(o) for a saboteur, complex,
   hyper-complex or super-complex (ui/drills.js, runDrill), both wired from
   hitPress in ui/ui.js, both already real and already shipped. The address
   drill already shows what it "Feeds" upward (the saboteurs or complexes
   built partly from it). The chain's own four rungs (runDrill) show only
   what they are "Made of" downward; nothing on this product today shows a
   saboteur, complex or hyper-complex what it itself feeds into, and
   nothing on either drill blends the two directions into one read.

   THE ONE REAL GAP THIS FILE CLOSES. traceSummary(g,node) already computes
   exactly that: real parents (what a node feeds up into) and one narrated
   paragraph, tested, never wired to a screen. This file is the one real
   call site. tsBlockHtml(type,id) is appended to both existing drills,
   never replacing what they already show.

   THE GRAPH. The same one loopRead already builds (engine/loop.js:
   traceFromRecord(p, practiceTraceIntents(p.practice), readSeenOf(p))),
   rebuilt here rather than exposed from loopRead, because loopRead's own
   contract (engine/loop.js) returns processed counts and never the graph
   itself, and changing that return shape risks every caller and test that
   already reads it. Memoised the same way loopOf memoises (ui/loopread.js,
   LP), against the same two things a graph is built from: the record's own
   signature and the reading it was handed. */
var TSG={memo:null, sig:''};
function tsSig(p,rd){
 var es=(p&&p.story&&p.story.entries)||[];
 try{return JSON.stringify([p&&p.id||null, es.map(function(e){return [e&&e.t,e&&e.text,e&&e.lex];}),
  p&&p.practice||null, p&&p.trace||null, p&&p.soul||null, rd&&rd.CQ||null]);}
 catch(e){return String(Math.random());}}
function tsGraphFor(p){
 if(!p||typeof p!=='object')return null;
 var rd=null; try{rd=readSeenOf(p);}catch(e){rd=null;}
 var s=tsSig(p,rd);
 if(TSG.memo&&s===TSG.sig)return TSG.memo;
 var P=(p.practice&&typeof p.practice==='object')?p.practice:null, g=null;
 try{g=traceFromRecord(p,P?practiceTraceIntents(P):[],rd);}catch(e){g=null;}
 TSG.memo=g; TSG.sig=s; return g;}
function tsCurrentGraph(){ return tsGraphFor(typeof CURP!=='undefined'?CURP:null); }

/* the human word for a graph node's type, fetter split out from pattern the
   same way traceSummaryWord already does it (engine/tracesummary.js), kept
   as its own small copy rather than reused directly: that function's own
   TRACE_SUMMARY_WORD table is for a sentence's subject ("a fetter"), and a
   drill's small kind tag wants the bare word, no article. */
function tsWord(type,id){
 if(type==='pattern'&&/^fetter:/.test(String(id)))return 'fetter';
 if(type==='pattern')return 'address';
 return {saboteur:'saboteur', complex:'complex', hyper_complex:'hyper-complex',
  super_complex:'super-complex'}[type]||type;}

/* one resolved parent or child, as a row: its name, its kind, and its own
   real content quoted exactly as traceSummaryCard reads it (coherent and
   collapsed for an address, says/lived for a saboteur, the family line for
   a hyper-complex), or, honestly, why it carries nothing further. */
function tsPartRow(part){
 var card=part.card||{}, nm=esc(card.label!=null?card.label:String(part.id)),
  kind=esc(tsWord(part.type,part.id)),
  own=card.found?traceSummaryOwnLine(card.fields):null;
 return '<div class="ts-row"><b>'+nm+'</b> <span class="ts-kind">'+kind+'</span>'
  +(own?'<div class="ts-line">'+esc(own)+'</div>'
    :(card.why?'<div class="ts-why">'+esc(card.why)+'</div>':''))+'</div>';}

/* THE BLOCK ITSELF, appended to an existing drill. type/id are the real
   graph key (traceKey): 'pattern'/address-number for an address,
   'pattern'/'fetter:X' for a fetter, 'saboteur'/'complex'/'hyper_complex'/
   'super_complex' with the node's own real .nm for the chain's four
   rungs, the exact id traceFromRecord itself keys them by
   (engine/trace.js, TRACE_CHAIN_OF.forEach, node(row.type,x.nm,...)).

   Silent and honest on an unread record, the same idiom renderGates and
   loopPaint already use: a cold record shows the sentence that explains
   why, never a blank box and never an invented reading. */
function tsBlockHtml(type,id){
 var g=tsCurrentGraph();
 /* .plain ON EVERY .pm-eye THAT IS A REAL SENTENCE, not a short label, 2
    November: design.js's own capitalize-coverage gate reads every string
    rendered in a .pm-eye (head.html's own text-transform:capitalize rule)
    and refuses one with a comma or more than four words that is not
    marked .plain, the exact defect a capitalize transform mangles word by
    word. Caught live once this block's own fallback and closing headers
    started rendering in #person on every load (item 3, this round)
    instead of only behind a drill click; fixed at the source here so
    every caller, drill and summary alike, gets it right. */
 if(!g)return '<div class="pm-eye plain">Feeds up, and the blend</div>'
  +'<p class="ad-p">Nothing read yet. Write a line in the Journal and this fills in from it.</p>';
 var res=traceSummary(g,traceKey(type,id));
 if(!res.ok)return '<div class="pm-eye plain">Feeds up, and the blend</div>'
  +'<p class="ad-p">'+esc(res.why)+'</p>';
 var up=res.parents||[], h='';
 h+='<div class="pm-eye">Feeds up'+(up.length?' ('+up.length+')':'')+'</div>';
 if(up.length)h+='<div class="ts-rows">'+up.map(tsPartRow).join('')+'</div>';
 else h+='<p class="ad-p">Nothing sits above it yet on this graph: either the chain stops here by design, or this one has not compounded with another of its kind yet.</p>';
 h+='<div class="pm-eye plain">Source AI, blended from the records above and below</div>'
  +'<p class="ad-p ts-narr">'+esc(res.summary||'')+'</p>';
 return h;}

/* THE CHAIN-LOCAL MULTI-SELECT BLOCK, the one call site for
   traceSummarySet (engine/tracesummary.js), the way tsBlockHtml just
   above is the one call site for traceSummary. keys is the real array a
   shift-click builds (S.pinAnchors, ui/ui.js): the anchor plus every
   traceDescendants found under it, widened again by each further
   shift-click. Each member reuses tsPartRow unchanged -- a
   traceSummarySet member carries the exact same {key,type,id,card} shape
   traceSummary's own parents/children already do, so the one row
   renderer this file already has needed no change at all to read either
   kind. */
function tsSetBlockHtml(keys){
 var g=tsCurrentGraph();
 /* .plain on every real sentence here too, the identical fix and the
    identical reason as tsBlockHtml just above. */
 if(!g)return '<div class="pm-eye plain">Selected together, and the blend</div>'
  +'<p class="ad-p">Nothing read yet. Write a line in the Journal and this fills in from it.</p>';
 var res=traceSummarySet(g,keys);
 if(!res.ok)return '<div class="pm-eye plain">Selected together, and the blend</div>'
  +'<p class="ad-p">'+esc(res.why)+'</p>';
 var h='<div class="pm-eye">Selected together ('+res.members.length+')</div>'
  +'<div class="ts-rows">'+res.members.map(tsPartRow).join('')+'</div>';
 h+='<div class="pm-eye plain">Source AI, blended from the whole selection</div>'
  +'<p class="ad-p ts-narr">'+esc(res.summary||'')+'</p>';
 return h;}
