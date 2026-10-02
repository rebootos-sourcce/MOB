/* ============================================================
   THE THREE BLOCKS UNDER THE 63, THE ENGINE HALF. Archetypes, the nine
   emotional axes and the six action axes. The questions are data
   (engine/data/intakemore.js); this is the record they are answered into, the
   boundary that guards it, and the read-out sentence. No browser in here.

   WHERE THE ANSWERS LIVE. p.intake.more, three bags keyed by the row's own
   name, each value 0 to 10 and an absent key meaning not answered:

     p.intake.more = {arch:{Warrior:7, ..}, axes:{Fear:4, ..}, acts:{aware:5, ..}}

   Beside the 63 and not mixed into them, because the 63 are indexed by
   position and read by iqScore, iqApply and CQ, and these are read by none of
   them. THAT IS THE WHOLE POINT AND IT IS WHAT THE GATE PINS: answering any
   question here must leave every law, every charge, every gate count and CQ
   exactly where they were. They are evidence the person gave about themselves,
   shown back to them, and a number that moved the reading would turn a draft
   questionnaire nobody has calibrated into a verdict.

   NO SCHEMA_V BUMP. The field is additive, and an older record has none and is
   filled from the blank, which is the posture the practice objects and the
   daily summaries already take. Named here AND in loadProfile AND at the
   boundary, because a key the boundary does not name is deleted on the next
   load.
   ============================================================ */
/* UNDER THIS A SPREAD IS NOISE. The same floor iqScore uses for the 63: three
   framings of one law that sit within three points of each other do not
   distinguish a lean, and twelve answers within three points of each other
   do not distinguish a leading archetype. Said as "level" rather than
   inventing a winner. */
var IX_FLOOR=3;
/* MORE THAN THIS TIED AT THE TOP IS LEVEL TOO. Two or three tied is a real
   answer (a person can lead with the Sage and the Rebel). Five tied at 10 is a
   person who pressed ten twelve times. */
var IX_TIE_MAX=3;
function ixBlank(){return {arch:{}, axes:{}, acts:{}};}
function ixBlock(id){
 for(var i=0;i<IX_BLOCKS.length;i++)if(IX_BLOCKS[i].id===id)return IX_BLOCKS[i];
 return null;}
function ixRow(id,k){
 var b=ixBlock(id); if(!b)return null;
 for(var i=0;i<b.rows.length;i++)if(b.rows[i].k===k)return b.rows[i];
 return null;}
/* WHAT A ROW IS CALLED ON THE PAGE, from the product's own table so a rename
   there is carried here. An archetype and an axis are keyed by their name; a
   gate is keyed by a short key and named by VERP. */
function ixName(id,k){
 var i;
 if(id==='acts'){for(i=0;i<VERP.length;i++)if(VERP[i].k===k)return VERP[i].nm; return k;}
 return k;}
/* A LOADED OR OLDER RECORD IS FILLED FROM THE BLANK, never refused: loadProfile
   trusts its input and everything a person can paste goes through ixValidate
   first. A profile with no intake at all, which the Avatar's own writer can
   leave behind (CURP.intake=CURP.intake||{answers:[]}), gets one rather than a
   throw on the first press. */
function ixFill(p){
 if(!p)return p;
 if(!p.intake||typeof p.intake!=='object'||Array.isArray(p.intake))
  p.intake={answers:{}, done:[], startedAt:null, completedAt:null};
 var m=p.intake.more;
 if(!m||typeof m!=='object'||Array.isArray(m))m=p.intake.more=ixBlank();
 ['arch','axes','acts'].forEach(function(id){
  if(!m[id]||typeof m[id]!=='object'||Array.isArray(m[id]))m[id]={};});
 return p;}
function ixGet(p,id,k){
 var m=p&&p.intake&&p.intake.more, v=m&&m[id]&&m[id][k];
 return (typeof v==='number')?v:null;}
/* THE ONE WRITE. A key the product does not have, or a value that is not a
   number from 0 to 10, writes nothing and says so by returning false, so a
   control cannot report an answer it did not record. Never clamped: 9999 is
   not a 10 the person pressed. */
function ixSet(p,id,k,v){
 if(!ixRow(id,k))return false;
 if(!NUM(v)||v<0||v>10)return false;
 /* startedAt is NOT stamped here. It says the 63 were begun, and a person who
    has answered only these has not begun them. */
 ixFill(p); p.intake.more[id][k]=v;
 return true;}
/* THE READ OF ONE BLOCK. Nothing is named until every row is answered, because
   a leader among seven of twelve is a leader among the ones you happened to
   reach. got and left count the answers, and the page says what is left and
   never a count against a total.
     state  'none' no answer, 'part' some, 'level' all answered and nothing
            stands out, 'lead' all answered and one to IX_TIE_MAX stand out
     lead   the row keys at the top, in table order
     spread top minus bottom, so a gate can see why a block read level */
function ixRead(p,id){
 var b=ixBlock(id), out={id:id, got:0, total:b?b.rows.length:0, left:0, state:'none', lead:[], spread:0};
 if(!b)return out;
 var vals=b.rows.map(function(r){return ixGet(p,id,r.k);});
 vals.forEach(function(v){if(v!==null)out.got++;});
 out.left=out.total-out.got;
 if(!out.got)return out;
 if(out.left){out.state='part'; return out;}
 var hi=Math.max.apply(null,vals), lo=Math.min.apply(null,vals);
 out.spread=Math.round((hi-lo)*10)/10;
 b.rows.forEach(function(r,i){if(vals[i]===hi)out.lead.push(r.k);});
 out.state=(out.spread<IX_FLOOR||out.lead.length>IX_TIE_MAX)?'level':'lead';
 return out;}
function ixJoin(a){
 return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
/* THE SENTENCE UNDER A BLOCK, in the product's own plain words, and every name
   in it carries its meaning in the same sentence (UNPACK EVERY SYMBOL). head is
   the line that says what leads and body is what it means, so the page can set
   the first in weight. Empty strings mean there is nothing to say yet.
   An axis names the place it sits in the body (CHILD.loc) and its other end
   with that end's meaning, which is the pair the engine already holds. */
function ixSay(id,r){
 var none={head:'', body:''};
 if(!r||r.state==='none')return none;
 if(r.state==='part')return {head:r.left+' left', body:''};
 var lbl={arch:['Leading archetype','Leading archetypes'], axes:['Loudest axis','Loudest axes'],
          acts:['Most used move','Most used moves']}[id];
 if(r.state==='level')return {head:'Nothing leads.',
  body:'Your answers sit level across the whole block, so it names none.'};
 var one=r.lead.length===1, names=r.lead.map(function(k){return ixName(id,k);});
 /* TIED, NOT LEVEL. Level is the word for a block that names nothing, and the
    first cut used it for two at the top as well, so "Sage and Rebel, level"
    read as if the answers were flat when they were not. */
 var head=(one?lbl[0]:lbl[1])+': '+ixJoin(names)+(one?'.':', tied.');
 var low=function(t){return t.charAt(0).toLowerCase()+t.slice(1);};
 var body=r.lead.map(function(k,i){
  var row=ixRow(id,k), nm=ixName(id,k);
  if(id==='arch'){
   var a=null; ARCH.forEach(function(x){if(x.nm===k)a=x;});
   return nm+' '+(a?a.v:'')+'.';}
  /* the head already names a single leader, so its meaning follows without the
     name said a second time. With a tie each meaning keeps its name. */
  var pre=one?'':nm+': ', mean=one?row.means:low(row.means);
  if(id==='axes'){
   var c=null; CHILD.forEach(function(x){if(x.nm===k)c=x;});
   return pre+mean+(c?' Felt in the '+c.loc+'. Its other end is '+c.opp+': '+low(row.oppMeans):'');}
  return pre+mean;}).join(' ');
 return {head:head, body:body};}
/* THE BOUNDARY FOR THE THREE BAGS, called from validateProfile with the same
   errs array so one bad answer refuses the whole record and pImport stays
   atomic. Missing or null is an older record and returns the blank. A bag that
   is not an object, a key that names nothing the product has, and a value that
   is not a number from 0 to 10 are each refused BY NAME and never dropped or
   clamped: a dropped key is an answer the person gave that quietly is not
   there, and a clamped one reads as a ten they never pressed. null inside a
   bag is not answered, the way a null in intake.answers is. */
function ixValidate(errs,o,path){
 var out=ixBlank();
 if(o===undefined||o===null)return out;
 if(typeof o!=='object'||Array.isArray(o)){errs.push(path+' is not an object'); return out;}
 Object.keys(o).forEach(function(id){
  if(!ixBlock(id))errs.push(path+' names no block: '+id);});
 IX_BLOCKS.forEach(function(b){
  var bag=o[b.id];
  if(bag===undefined||bag===null)return;
  if(typeof bag!=='object'||Array.isArray(bag)){errs.push(path+'.'+b.id+' is not an object'); return;}
  Object.keys(bag).forEach(function(k){
   if(!ixRow(b.id,k)){errs.push(path+'.'+b.id+' names no question: '+k); return;}
   if(bag[k]===null)return;
   var v=vRange(errs,path+'.'+b.id+'.'+k,bag[k],0,10);
   if(v!==null)out[b.id][k]=v;});});
 return out;}
