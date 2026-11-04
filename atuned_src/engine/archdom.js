/* ============================================================
   WHICH DOMAIN AN ARCHETYPE POINTS AT. Ported 4 November from Reboot-OS's
   canon_ARCHDOM, eighteen rows, by tools/regen-archetype-domain.cjs into
   engine/data/archdom.js. The owner: "wire up archetype to domain... you
   should have all of the records as well." The canon's own lock orders the
   top of the stack ARCHETYPE then BLUEPRINT / DOMAIN, and the book's reason
   is "Zeus, Odin, Ra point at the same domain: Ruler. Thoth, Hermes, Horus
   point at the same domain: Knowledge."

   WHAT KIND OF FACT THIS IS. A lookup, read off a table, the same for every
   person and for ever. It does not move with a story, a release or an
   answer, like affinity() and unlike archExpr(). It is not an inference and
   it is not a rung of the trace chain (engine/trace.js): nothing here reads
   a person, so nothing here may be shown as something learned about one.
   Reboot-OS's influence layer does go further, and that half is not ported:
   rung 7 there takes each archetype it detected, looks its domain up here,
   keeps the strongest archetype's score per domain and calls the domain
   "distorted by the chain below it". MOB does not detect archetypes that
   way, and a score carried up a lookup is the archetype's score again, not a
   reading of the domain.

   WHY IT IS NOT IN engine/archexpr.js. That file's ruling is that where an
   archetype acts is its seat, ARCH[i].b, and its figure is the seat's. A
   domain is a different fact about the archetype. Nothing here feeds
   archExpr(), affinity(), buildSoul() or compute(), and nothing here gives
   an archetype a seat.

   WHAT THE SOUL MAP ALREADY DOES, AND WHY IT IS LEFT ALONE. buildSoul() and
   affinity() (engine/core.js) couple the twelve archetypes to the nineteen
   domains by list position on two rings, twelve arcs of thirty degrees
   against nineteen of 360/19. That position is not this table. Measured 4
   November, for none of the eleven archetypes this table resolves is the
   domain under the archetype's arc, or under its lobe's centre, the domain
   ARCHDOM names (tests/engine.js recomputes it). That is arithmetic about
   where things were drawn, and changing it is a ruling on the soul map, so
   it is recorded in DECISIONS.md and not touched here: port, do not rebuild.

   WHAT IS RESOLVED, AND HOW. Every row's domain word reaches DOMAINS by one
   of four routes, named in each answer's `how`:
     same   the word is a DOMAINS name. Power, Creation, Knowledge, Play,
            Mystery, Nature, Guardian, Death, Trickster.
     codex  KB_RENAME already records the domain as "called <word> in the
            codex": Love is Connection, Communication is Exchange, Healing is
            Restoration. kb.js keeps both names because which one is canon
            is the owner's call, so `word` carries Reboot-OS's name and `nm`
            the engine's, and neither is renamed.
     book   Destruction is the opening word of the book's "VI, Destruction
            and Renewal", whose clear reading opens "deliberate dissolution",
            and DOMDEF files that numeral under dissolution.
     root   the word is a root, not a domain. Only Ruler's, below.

   REBEL IS OUTLAW HERE BY THE HOUSE JOIN, NOT BY A NEW RULING. ARCHDOM says
   Outlaw where ARCH says Rebel. ui/analytics.js and ui/avatarui.js already
   read the two as one row, and the book names one archetype both ways in
   the same slot of the same twelve. Whether they are one is still the
   owner's open call (engine/data/codes.js), so the answer says `upstream`
   beside `arch` and never renames either.

   RULER IS OPEN. Reboot-OS gives it the root Architect, which is a family of
   five domains and not one. The book points two ways: its Rulership and
   Order (Zeus, Jupiter, Ra) is the text DOMDEF files under Imperium, under
   Architect (its "Zeus, Odin, Ra point at the same domain: Ruler" names the
   archetype, and its own table files Odin under Knowledge, so that line
   settles nothing); and its line beside the consolidated list folds royal into
   Power, which DOMAINS contradicts ("the warrior, not the king") and which
   would move the root to Engine. The answer gives the root Reboot-OS gives,
   no domain, open:true, and both readings in `read`. Resolving it is a
   ruling, and the gate fails if the snapshot resolves it without one.

   THE ENGINE MAY NOT TOUCH THE HOST and this file does not. It sits after
   engine/archexpr.js and adds its names to what export.js left.
   ============================================================ */
var ARCHDOM_HOW=['same','codex','book','root'];
function archDomainOf(name){
 var A=ARCHDOM_SNAPSHOT, own=Object.prototype.hasOwnProperty;
 var nm=String(name===undefined||name===null?'':name);
 var up=own.call(A.alias,nm)?A.alias[nm].as:nm;
 if(!own.call(A.rows,up))return null;
 var word=A.rows[up], w=own.call(A.words,word)?A.words[word]:null;
 if(!w)return null;
 var d=w.nm?DOMAINS.filter(function(x){return x.nm===w.nm;})[0]:null;
 var r={arch:nm, upstream:up, word:word, nm:w.nm||null,
  root:w.nm?(d?d.r:null):(w.root||null), how:w.how, open:!!w.open};
 if(w.n){r.n=w.n; r.title=w.title;}
 if(own.call(A.open,up))r.read=A.open[up].read.map(function(x){return x.nm;});
 return r;}
/* by index into ARCH, the roster a record stores */
function archDomain(i){var a=ARCH[i]; return a?archDomainOf(a.nm):null;}
/* all twelve in ARCH order, so a renderer asks once per render */
function archDomainAll(){return ARCH.map(function(a){return archDomainOf(a.nm);});}

/* archDomFaults(snapshot, arch, domains, roots, names) HOLDS A SNAPSHOT TO THE
   TABLES IT POINTS INTO and names every fault. It reads only what it is
   handed, never throws, and answers [] when the snapshot is sound. The gate
   runs it on the real snapshot and on broken copies of it, so a check that
   could not fail would show. names is any further roster that must reach a
   row, ARCH18 in the gate. */
function archDomFaults(snap,arch,domains,roots,names){
 var out=[], own=Object.prototype.hasOwnProperty;
 try{
  var isObj=function(o){return !!o&&typeof o==='object'&&!Array.isArray(o);};
  if(!isObj(snap)||!isObj(snap.rows)||!isObj(snap.words)||!isObj(snap.alias)||!isObj(snap.open)){
   out.push('not an archetype to domain snapshot: rows, words, alias and open are required'); return out;}
  var dn=(domains||[]).map(function(d){return d.nm;});
  var reach=function(n,from){
   var up=own.call(snap.alias,n)?snap.alias[n].as:n;
   if(!own.call(snap.rows,up))out.push(from+' '+n+' reaches no row'+(up!==n?' through its alias '+up:''));};
  (arch||[]).forEach(function(a){reach(a.nm,'ARCH');});
  (names||[]).forEach(function(n){reach(n,'roster');});
  Object.keys(snap.alias).forEach(function(a){
   if(!snap.alias[a]||!own.call(snap.rows,snap.alias[a].as))out.push('alias '+a+' points at a row that does not exist');});
  Object.keys(snap.rows).forEach(function(r){
   if(!own.call(snap.words,snap.rows[r]))out.push('row '+r+' names the word '+snap.rows[r]+', which has no route');});
  var openWords=Object.keys(snap.open).map(function(a){return snap.rows[a];});
  Object.keys(snap.words).forEach(function(k){
   var w=snap.words[k];
   if(!w||ARCHDOM_HOW.indexOf(w.how)<0){out.push('word '+k+' has no known route'); return;}
   if(w.open){
    if(w.nm)out.push('word '+k+' is open and still names the domain '+w.nm);
    if((roots||[]).indexOf(w.root)<0)out.push('word '+k+' is open on '+w.root+', which is not a root');
    if(openWords.indexOf(k)<0)out.push('word '+k+' is open and no open row says why');}
   else{
    if(w.how==='root')out.push('word '+k+' is a root and is not marked open');
    if(dn.indexOf(w.nm)<0)out.push('word '+k+' resolves to '+w.nm+', which is not a DOMAINS name');}});
  Object.keys(snap.open).forEach(function(a){
   var w=snap.words[snap.rows[a]];
   if(w&&!w.open)out.push(a+' is recorded open and its word resolves to '+w.nm+' without a ruling');
   ((snap.open[a]&&snap.open[a].read)||[]).forEach(function(x){
    if(dn.indexOf(x.nm)<0)out.push(a+' is read as '+x.nm+', which is not a DOMAINS name');});});
  if(JSON.stringify(snap).indexOf(String.fromCharCode(0x2014))>=0)out.push('the snapshot carries an em dash');
 }catch(e){out.push('archDomFaults could not finish: '+(e&&e.message?e.message:String(e)));}
 return out;}

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{archDomainOf:archDomainOf, archDomain:archDomain,
  archDomainAll:archDomainAll, archDomFaults:archDomFaults, ARCHDOM_SNAPSHOT:ARCHDOM_SNAPSHOT});}
