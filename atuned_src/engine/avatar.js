/* ============================================================
   THE AVATAR, THE PURPOSE MAP AND THE BOUNDARY.

   The becoming half. Release empties an address and replace fills
   it, and neither says what the person is filling it toward.

   Ported from the original Atuned build, not rebuilt. The owner's
   own sentence governs it: "one side is who the person is at their
   best, the other is who they are not. The app never rules on
   whether an attribute is a real edge or a saboteur wearing a
   virtue. That depends on where they are in their growth, and it
   is the thing they revise upward as they climb."

   Host free. The resolver and the seat weights come in as
   arguments, so nothing here reaches for a document or a store.
   ============================================================ */
const AV_MONTH=30*24*3600*1000;
/* ============================================================
   THE BECOMING SLICES S1 AND S2, round RB. ATUNED-becoming-system-TDD.md,
   audited in BECOMING-AUDIT.md, whose section 11 orders the build. His words
   at round RB: "The avatar page has a new TDD. It doesn't look like it was
   ever updated or touched." It had not been: none of S1 to S4 was built.

   S1. What the Avatar page writes now travels with the record. The archetype
   ratings (arch), the weight each pair was written against (load0) and the
   tags a person put on or took off (tags) lived under their own key in the
   browser beside the record, so an export dropped them and another device
   never saw them (R08). They are fields of the avatar now. The daily rule
   stays beside the record until S7 makes it a ritual step, as the audit says.
   movedAt says when the old key was read across, once, so a person who then
   takes every rating off does not have them read back in on the next paint.

   S2. Identity and bookkeeping the document's section 6.2 asks for: a name,
   a title and a description the person writes; a version that moves only when
   the person says they revised it; a status, draft, active or archived, which
   is a declared fact (R06: evolving and integrated are readings and are never
   stored); and an id on every pair, so a weight is kept against the pair and
   not against its words, which changed meaning every time a word was fixed.

   All additive inside schema version 2, the house's own precedent for the
   practice objects and the bank of days: an older record has none of these
   and is filled from this blank.
   ============================================================ */
const AV_STATUS=['draft','active','archived'];
/* the caps on what a person writes, one place, read by the boundary and the
   surface alike so the field and the refusal agree about the number */
const AV_CAP={name:60, title:80, description:280, tag:60, tags:60};
function avatarBlank(){
 return {built:false, at:null, reviewedAt:null, pairs:[],
  name:'', title:'', description:'', version:1, status:'draft',
  arch:{}, load0:{}, tags:{}, movedAt:null};}
/* the status a record carries, or for one written before there was a status,
   the one its own built flag already said */
function avatarStatus(av){
 if(av&&AV_STATUS.indexOf(av.status)>=0)return av.status;
 return (av&&av.built)?'active':'draft';}
/* A PAIR'S ID. A pair written before ids existed is given one that is the same
   on every load, read off its own words and seat, so the weight kept against
   it does not move to a new key each time the record is opened. Two pairs
   with the same words take the next free suffix, in order. */
function avatarHash(t){
 var h=2166136261; t=String(t);
 for(var i=0;i<t.length;i++){h^=t.charCodeAt(i); h=Math.imul(h,16777619);}
 return (h>>>0).toString(36);}
function avatarPairId(pr,taken){
 var base='p'+avatarHash((pr.be||'')+'\n'+(pr.notbe||'')+'\n'+(pr.seat||'')), id=base, n=1;
 while(taken&&taken[id]){n++; id=base+'x'+n;}
 return id;}
const AV_ID=/^[a-z0-9]{1,24}$/;
/* every pair carries an id after this, and no two share one */
function avatarEnsureIds(av){
 if(!av||!Array.isArray(av.pairs))return av;
 var taken={};
 av.pairs.forEach(function(pr){if(pr&&typeof pr.id==='string'&&AV_ID.test(pr.id)&&!taken[pr.id])taken[pr.id]=1;
  else if(pr)pr.id=null;});
 av.pairs.forEach(function(pr){if(pr&&!pr.id){pr.id=avatarPairId(pr,taken); taken[pr.id]=1;}});
 return av;}
/* a new pair's id, minted at the moment of writing, never reused */
function avatarNewId(now,rnd){
 return 'n'+Math.floor(now||Date.now()).toString(36)+Math.floor((rnd==null?Math.random():rnd)*1679616).toString(36);}
/* THE MONTHLY REVIEW, ANSWERED. avatarDue says a month has passed; this is
   the person's answer. Still true moves the review date and nothing else.
   Revised moves the version, because the version counts the times the person
   said who they are becoming has changed, and nothing else may move it. */
function avatarReview(av,revised,now){
 if(!av)return av;
 av.reviewedAt=new Date(now||Date.now()).toISOString();
 if(revised)av.version=Math.max(1,(+av.version||1))+1;
 return av;}
/* the side key's entry for one profile, read across into the avatar, once.
   keyOf maps the old text key of a pair to the pair, because the side key
   kept weights against the pair's words. What is read across is only what the
   avatar does not already hold, so a record that was written by a newer
   build wins over the browser's older copy. Returns how many were moved. */
function avatarMoveSide(av,e,keyOf,now){
 if(!av||av.movedAt)return 0;
 var n=0;
 if(e&&typeof e==='object'){
  if(e.arch&&typeof e.arch==='object')Object.keys(e.arch).forEach(function(k){
   var v=e.arch[k]; if(av.arch[k]===undefined&&[1,2,3,4,5].indexOf(v)>=0){av.arch[k]=v; n++;}});
  if(e.load0&&typeof e.load0==='object')Object.keys(e.load0).forEach(function(k){
   var v=e.load0[k], pr=keyOf?keyOf(k):null;
   if(pr&&pr.id&&av.load0[pr.id]===undefined&&typeof v==='number'&&v>=0&&v<=10){av.load0[pr.id]=v; n++;}});
  if(e.tags&&typeof e.tags==='object')Object.keys(e.tags).forEach(function(b){
   var t=e.tags[b]; if(!t||typeof t!=='object'||av.tags[b])return;
   var keep=function(a){return (Array.isArray(a)?a:[]).filter(function(w){
    return typeof w==='string'&&w.length>0&&w.length<=AV_CAP.tag;}).slice(0,AV_CAP.tags);};
   av.tags[b]={add:keep(t.add), off:keep(t.off)}; n++;});}
 av.movedAt=new Date(now||Date.now()).toISOString();
 return n;}
/* A PAIR IS WRITTEN AS A PAIR. The left side is a value and a value has no
   address. The right side is a sentence about a bad day, and a sentence about
   a bad day parses. That is why neither half is written alone. */
function avatarValid(pair){
 return !!(pair&&typeof pair.be==='string'&&pair.be.trim()
  &&typeof pair.notbe==='string'&&pair.notbe.trim());}
function avatarDue(av,now){
 if(!av||!av.built)return false;
 var last=av.reviewedAt||av.at||0;
 return ((now||Date.now())-new Date(last).getTime())>=AV_MONTH;}
function avatarDaysLeft(av,now){
 if(!av||!av.built)return null;
 var last=new Date(av.reviewedAt||av.at||(now||Date.now())).getTime();
 return Math.max(0,Math.ceil((AV_MONTH-((now||Date.now())-last))/86400000));}
/* THE GAP. The right side goes to the resolver, the resolver returns a seat,
   the seat has live imprints and the imprints have weight. The distance
   between who somebody is and who they are becoming is not a mood, it is a
   number at an address. seatLoad and seatIg are handed in so this stays pure. */
function avatarGap(pair,seat,seatLoad,seatIg){
 if(!avatarValid(pair)||!seat)return null;
 var clear=(seatLoad<=0);
 return {seat:seat, load:seatLoad, ig:seatIg, clear:clear,
  at:mirrorAt(seatLoad,seatIg)};}
/* completion read from work done rather than from work declared */
function avatarProgress(rows){
 var list=rows||[];
 if(!list.length)return null;
 var done=list.filter(function(r){return r.gap&&r.gap.clear;}).length;
 return {done:done, total:list.length,
  pct:Math.round(100*done/Math.max(1,list.length))};}

/* ============================================================
   THE PURPOSE MAP. Two overlapping triangles, and the overlap is
   the boundary.

   The owner's model. "Meaning is the end point of expression. At
   the end of expression, meaning creates purpose." The direction
   runs one way and purpose is what is left standing at the end of
   it, so a person may not type any of the three readings.

   Upward: the higher purpose, the soul's, three universal values.
   Downward: the earthly purpose, the ego's, three with a body
   attached. Each centre is the sum of its three corners. The line
   between the two centres is how a person makes money and how they
   find fulfilment doing it.

   Six values in. Nothing else is stored, because a derived value
   that is also stored is a value that can drift.
   ============================================================ */
const PUR_SIDES=['partner','family','friends','community','coworkers','alone'];
const PUR_PER_SIDE=5;
/* THE CAPS, said once, round RB, S3. A value is a word or two and stays under
   120 characters; a commitment is one sentence and stays under 200. The
   boundary used to replace an over long value with an empty string and say
   nothing (R10), which is a value the person thinks they wrote and the record
   does not hold. It refuses by name now, and the field on the page stops at
   the same number, so the refusal is never met by typing. */
const PUR_VAL_MAX=120, PUR_LINE_MAX=200;
/* THE SIX SIDES, IN HIS WORDS, round RB, S3. The stored keys are his ruling
   (DECISIONS.md, the purpose map) and are identity, so they never rename. The
   document's names, Self, Relationship and Work, are not used: "alone" and
   "self" are not the same idea, and choosing between them is his (Q4). Each
   label carries its plain meaning beside it, round PO, unpack every symbol. */
const PUR_SIDE_SAY={
 partner:{nm:'Partner',say:'the person you share a life with'},
 family:{nm:'Family',say:'the people you were born or married into'},
 friends:{nm:'Friends',say:'the people you chose'},
 community:{nm:'Community',say:'the groups you belong to'},
 coworkers:{nm:'Coworkers',say:'the people you work with or for'},
 alone:{nm:'Alone',say:'you, with nobody else there'}};
/* what is wrong with one value or one commitment, or null when nothing is.
   The surface and the boundary both ask it, so they refuse the same thing. */
function purposeRefuse(text,max){
 if(typeof text!=='string')return 'is not text';
 if(text.length>=max)return 'is '+text.length+' characters, and the most is '+(max-1);
 return null;}
const PUR_SOUL='Universal. Freedom, free will, knowledge, wisdom, that register.';
const PUR_EGO='With a body attached. Health, fitness, financial stability, wealth, family.';
function purposeBlank(){
 var sides={}; PUR_SIDES.forEach(function(s){sides[s]=[];});
 return {soul:['','',''], ego:['','',''], sides:sides};}
function purposeReady(p){
 if(!p)return false;
 var f=function(a){return (a||[]).filter(function(x){return x&&String(x).trim();}).length===3;};
 return f(p.soul)&&f(p.ego);}
/* THE CENTRE IS THE SUM OF THE CORNERS and is never entered. With three words
   and no measurement behind them, the only honest centre is the three said
   together, so the product returns them rather than inventing a fourth. */
function purposeCentre(three){
 var a=(three||[]).filter(function(x){return x&&String(x).trim();});
 return a.length===3?a.join(', '):null;}
function purposeRead(p){
 if(!purposeReady(p))return null;
 return {higher:purposeCentre(p.soul), earthly:purposeCentre(p.ego),
  /* what the relation between the two centres answers, ruled */
  between:'Where those two meet is how you make money and how you find fulfilment doing it.'};}
/* THE HEXAGON IS THE BOUNDARY. Six sides, five commitments each, thirty in
   all. Inside is yours to protect and outside is choice. Thirty is not a lot
   to ask: this is the instrument, not an onboarding form, and a mirror half
   described shows half a person. */
function boundaryCount(p){
 if(!p||!p.sides)return {filled:0, of:PUR_SIDES.length*PUR_PER_SIDE, thin:PUR_SIDES.slice()};
 var n=0, thin=[];
 PUR_SIDES.forEach(function(s){
  var a=(p.sides[s]||[]).filter(function(x){return x&&String(x).trim();});
  n+=Math.min(a.length,PUR_PER_SIDE);
  if(a.length<PUR_PER_SIDE)thin.push(s);});
 return {filled:n, of:PUR_SIDES.length*PUR_PER_SIDE, thin:thin};}
/* which side an imprint landed on, so the journal can say WHY the charge
   landed rather than only where. null when the entry names nobody. */
function boundaryCross(text){
 var t=String(text||'').toLowerCase();
 var MAP={partner:/\b(wife|husband|partner|girlfriend|boyfriend|spouse|marriage)\b/,
  family:/\b(mum|mom|mother|dad|father|parent|brother|sister|son|daughter|family)\b/,
  friends:/\b(friend|mate|friends)\b/,
  community:/\b(neighbour|neighbor|church|team|club|community|group)\b/,
  coworkers:/\b(boss|manager|colleague|coworker|co-worker|client|work)\b/,
  alone:/\b(myself|alone|on my own|by myself)\b/};
 for(var i=0;i<PUR_SIDES.length;i++)
  if(MAP[PUR_SIDES[i]].test(t))return PUR_SIDES[i];
 return null;}
