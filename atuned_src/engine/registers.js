/* ============================================================
   THE REGISTERS, the map and the check. 24 October. The ported tables are
   engine/data/registers.js.

   REG_MAP IS EVERY TOP LEVEL PART OF canon.json, and where this repository
   holds it. One row each: [path, state, the tables here, what to know].
     ported  held here row for row from canon.json, and regDiff holds the
             two equal.
     mob     this repository has its own version, and where the two
             disagree, which is canon is the owner's call. The disagreement
             is measured by node tools/canon-port.js report and set out in
             CANON-MERGE-PLAN.md.
     held    not carried into the product, and the row says where it is.
   The gate holds the map to the vendored canon.json both ways, so a register
   or a section reboot-os adds later is a named failure on the next merge and
   never a silent gap. Counts are left out of the rows on purpose: a count in
   a sentence is right on the day it is typed, and the report reads each one
   off the run.

   regDiff(canon) HOLDS THE PORTED TABLES TO A canon.json, row by row, and
   names every difference. Rows are matched by their key, never by position,
   so one row added in the middle of a register is one difference and not a
   cascade, and a register whose rows only moved is said to have moved. It
   reads only what it is handed, never throws, and answers [] when the two
   agree. The gate runs it against the vendored copy, and
   tools/canon-port.js check runs it against a newer one.

   ladderPlaces(word) is every ladder and step a word sits on. A word is not
   the name of one thing, because canon.json puts some words on two ladders,
   so it is not a name the codes door answers for.
   ============================================================ */

const REG_MAP=[
 ['registers.nodes','mob',['NODES'],'canon.json numbers the four field nodes another way, and its charges give another child emotion at many body addresses'],
 ['registers.fetters','mob',['CHILD'],'canon.json gives some of its nine an address, CHILD gives none, and which roster of nine is canon is open in canon.json itself'],
 ['registers.ladders','ported',['CHARGE_LADDER'],'no table here had them'],
 ['registers.saboteurs','mob',['SAB33','SABDEF'],'some charge band rows differ in a number or a charge, and canon.json still prints S02 as Controller'],
 ['registers.complexes','mob',['CODE_STRUCT'],'coded here and never stored. compute() pairs two saboteurs of one family, and some of these sit across two or three'],
 ['registers.hyper_complexes','mob',['CODE_STRUCT','HCX_LIB'],'coded here. By the family arithmetic here, most of them land a rung higher, as a super complex'],
 ['registers.amplifiers','ported',['AMPLIFIER'],'no table here had them. The nerve is read off NODES'],
 ['registers.archetypes','mob',['ARCH18'],'canon.json gives each archetype two saboteurs and two seats, ARCH18 one of each, and the pairings differ'],
 ['registers.jungian','mob',['ARCH'],'canon.json has Orphan, Outlaw and Caretaker where ARCH has Everyman, Rebel and Caregiver'],
 ['registers.masks','mob',['MASKS'],'the two lists of masks differ in members and in seats'],
 ['registers.axes','mob',['VERP'],'its axes are the six gates here, taken in pairs. Here the word axes means the nine child emotions'],
 ['registers.domains','mob',['DOMAINS','DOMDEF'],'canon.json files its domains in four families and has no Provision, and DOMAINS and DOMDEF name four of them two ways'],
 ['registers.laws','mob',['SI','HARM'],'canon.json numbers its laws another way, in four groups, and names some of them otherwise'],
 ['registers.quadrants','ported',['BODY_QUADRANT'],'no table here had them'],
 ['registers.organs','ported',['ORGAN'],'no table here had them'],
 ['registers.charge_routing','ported',['CHARGE_QUADRANT'],'no table here had it'],
 ['registers.derived_measures','ported',['DERIVED_MEASURE'],'no table here had them. The descriptions stay in the vendored file, because one breaks the claims rules for anything that ships'],
 ['registers.astrology_overlay','ported',['ASTRO_OVERLAY'],'no table here had it. Display only, by one of canon.json\'s own locks'],
 ['meta','held',['CODE_SOURCES'],'who issued the file, and its version. CODE_SOURCES cites both, and the gate holds the md5'],
 ['locks','mob',[],'rules, each one held where this repository holds it. Some are contradicted here by the arithmetic or the labels, and the plan lists which'],
 ['formula','mob',['TIERDEF'],'CQ is made another way here, the measured laws summed, with other bands'],
 ['time_axis','held',[],'how a release settles over the days after it. Nothing here models it, and the rebound days were taken off the release screen by his ruling of 27 September'],
 ['evidence','held',[],'trial and practice figures about the method. Not product data'],
 ['contraindications','held',[],'when a release should not be run, or should be paced. The release screens hold the product\'s own wording'],
 ['open_rulings','held',[],'the owner\'s open questions in that file, carried into CANON-MERGE-PLAN.md'],
 ['resolved_rulings','held',[],'closed as of 27 October, ruling 5, Justification and Arrogance: who ruled it, when, and what changed, carried in full in DECISIONS.md and at engine/data/registers.js\'s own AMPLIFIER comment']];

/* the ported tables, by register, as regDiff reads them */
function regDiff(canon){
 var out=[];
 try{regDiffInto(canon,out);}
 catch(e){out.push('regDiff could not finish on this file: '+(e&&e.message?e.message:String(e)));}
 return out;}

function regDiffInto(canon,out){
 var no=function(m){out.push(m);}, j=JSON.stringify;
 var own=function(o,k){return Object.prototype.hasOwnProperty.call(o,k);};
 var isObj=function(o){return !!o&&typeof o==='object'&&!Array.isArray(o);};
 if(!isObj(canon)||!isObj(canon.registers)){no('this is not a canon.json: it has no registers'); return;}
 var R=canon.registers;
 var has=function(reg,shape){
  var v=R[reg];
  if(v===undefined){no(reg+': this canon.json has no such register, and this repository ports it'); return false;}
  if(shape==='list'?!Array.isArray(v):!isObj(v)){no(reg+': canon.json gives it as '+(Array.isArray(v)?'a list':typeof v)+', where the port reads '+(shape==='list'?'a list':'keys')); return false;}
  return true;};
 /* the order of two key lists, said once, after the keys themselves */
 var order=function(reg,mine,theirs){
  var a=mine.filter(function(k){return theirs.indexOf(k)>=0;}), b=theirs.filter(function(k){return mine.indexOf(k)>=0;});
  if(j(a)!==j(b))no(reg+': the same rows in another order, '+b.join(', ')+' in canon.json and '+a.join(', ')+' here');};
 /* two sets of rows matched by key: what only one side has, then each field */
 var keyed=function(reg,mine,theirs,fields){
  var mk=Object.keys(mine), tk=Object.keys(theirs);
  tk.forEach(function(k){if(!own(mine,k))no(reg+': canon.json has '+j(k)+', and this table does not');});
  mk.forEach(function(k){if(!own(theirs,k))no(reg+': this table has '+j(k)+', and canon.json does not');});
  tk.forEach(function(k){if(!own(mine,k))return;
   var a=mine[k], b=theirs[k];
   if(!fields){if(j(a)!==j(b))no(reg+': '+j(k)+' is '+j(b)+' in canon.json and '+j(a)+' here'); return;}
   fields.forEach(function(f,i){if(f&&j(a[i])!==j(b[i]))no(reg+': '+j(k)+', its '+f+', is '+j(b[i])+' in canon.json and '+j(a[i])+' here');});});
  order(reg,mk,tk);};
 /* a list register as rows keyed by their first position */
 var byFirst=function(reg,rows){var o={};
  rows.forEach(function(r,i){if(!Array.isArray(r)||typeof r[0]!=='string'){no(reg+': row '+(i+1)+' of canon.json is not a row with a name first, '+j(r)); return;}
   if(own(o,r[0]))no(reg+': canon.json names '+j(r[0])+' twice'); o[r[0]]=r;});
  return o;};
 var mineBy=function(rows,f){var o={}; rows.forEach(function(r){o[r.nm]=f(r);}); return o;};

 if(has('ladders','keys')){var ml={};
  CHARGE_LADDER.forEach(function(l){ml[l.ch]=l.w;});
  keyed('ladders',ml,R.ladders,null);}
 if(has('amplifiers','list'))
  keyed('amplifiers',mineBy(AMPLIFIER,function(r){var n=BY[r.i]; return [r.nm,r.i,n?n.n:null,r.tag];}),
   byFirst('amplifiers',R.amplifiers),[null,'address','nerve','tag']);
 if(has('quadrants','list'))
  keyed('quadrants',mineBy(BODY_QUADRANT,function(r){return [r.nm,r.layer,r.theme,r.regions,r.symptoms,r.patterns,r.side,r.face];}),
   byFirst('quadrants',R.quadrants),[null,'layer','theme','regions','symptoms','patterns','side','face']);
 if(has('organs','list'))
  keyed('organs',mineBy(ORGAN,function(r){return [r.nm,r.side,r.issue,r.voice];}),
   byFirst('organs',R.organs),[null,'side','issue','voice']);
 if(has('charge_routing','keys'))keyed('charge_routing',CHARGE_QUADRANT,R.charge_routing,null);
 /* the description is not carried, so its own field is never compared: the
    law it cites is, and the row keeps that citation as HARM's code */
 if(has('derived_measures','list')){
  var theirs=byFirst('derived_measures',R.derived_measures), cited={};
  Object.keys(theirs).forEach(function(k){var r=theirs[k], m=/\bElement (\d+)\b/.exec(String(r[1]||''));
   cited[k]=[r[0],null,r[2],m?'E'+(m[1].length<2?'0':'')+m[1]:null];});
  keyed('derived_measures',mineBy(DERIVED_MEASURE,function(r){return [r.nm,null,r.ch,r.el];}),cited,[null,null,'charge','law cited']);}
 if(has('astrology_overlay','keys')){var A=R.astrology_overlay;
  Object.keys(A).forEach(function(k){if(!own(ASTRO_OVERLAY,k))no('astrology_overlay: canon.json has '+j(k)+', and this table does not');});
  Object.keys(ASTRO_OVERLAY).forEach(function(k){
   if(!own(A,k)){no('astrology_overlay: this table has '+j(k)+', and canon.json does not'); return;}
   if(Array.isArray(ASTRO_OVERLAY[k])||!isObj(A[k])){if(j(ASTRO_OVERLAY[k])!==j(A[k]))no('astrology_overlay: '+k+' is '+j(A[k])+' in canon.json and '+j(ASTRO_OVERLAY[k])+' here'); return;}
   keyed('astrology_overlay '+k,ASTRO_OVERLAY[k],A[k],null);});}}

function ladderPlaces(w){
 var k=codeKey(w), out=[];
 if(!k)return out;
 CHARGE_LADDER.forEach(function(l){l.w.forEach(function(x,i){
  if(codeKey(x)===k)out.push({code:l.c+'.'+(i+1),ch:l.ch,step:i+1,word:x});});});
 return out;}
