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
function avatarBlank(){
 return {built:false, at:null, reviewedAt:null, pairs:[]};}
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
