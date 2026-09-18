/* ============================================================
   THE PLAN. What a person is on, what it grants, and what it
   lets them see.

   HOST FREE, and deliberately so. Stripe is a network and this
   half of the product has none. Everything here is arithmetic over
   a plan record the host hands it, so the engine can answer what
   somebody may open and what they may see without ever knowing
   there is a payment processor in the world.

   The seam is one function in the UI that opens a hosted page. The
   engine never sees a key, a card, a customer id or a URL.

   THE LADDER IS THE OWNER'S, from DECISIONS. The gift is a hundred
   patterns with everything visible. Free is ten a week. The four
   paid tiers buy unique ground and sight, and neither of them buys
   more speaking, because a rerun costs nothing by construction.
   ============================================================ */

/* What a tier may SEE. The chain is saboteur, complex, hyper, character,
   and a tier stops somewhere along it. Sight is a separate thing from
   allowance and they are not traded against each other. */
const SEE_ORDER=['sab','cx','hy','sup'];
const PLANS=[
 {k:'gift',  nm:'The gift',    per:'once',  grant:100,  see:'sup',
  d:'A hundred patterns, free, with everything visible. It is spent by opening new ground and never by rerunning what is already open.'},
 {k:'free',  nm:'Free',        per:'week',  grant:10,   see:'sab',
  d:'Ten patterns a week. Inviting somebody who joins earns twenty five more, once each.'},
 {k:'one',   nm:'Tier one',    per:'month', grant:400,  see:'sab',
  d:'Four hundred patterns a month. Fetters and saboteurs.'},
 {k:'two',   nm:'Tier two',    per:'month', grant:800,  see:'cx',
  d:'Eight hundred a month. Complexes as well.'},
 {k:'three', nm:'Tier three',  per:'month', grant:1200, see:'hy',
  d:'Twelve hundred a month. Hyper complexes as well.'},
 {k:'four',  nm:'Tier four',   per:'month', grant:1200, see:'sup',
  d:'Twelve hundred a month. Everything, and the practitioner panel.'}];
const PLAN_BY={}; PLANS.forEach(function(p){PLAN_BY[p.k]=p;});
/* the pain map and the tools are on every tier, ruled, so they are named
   here rather than left for a renderer to remember */
const PLAN_ALWAYS=['the pain map','the tools','the journal','rerunning anything already open'];

/* THE STATES A SUBSCRIPTION CAN BE IN, and what each one means for access.
   past_due keeps access, because cutting somebody off mid month over a card
   that expired is a punishment for a bank's timing. unpaid and canceled do
   not. The names are the processor's so that a record round trips without
   translation, and translation is where access bugs live. */
const PLAN_LIVE={trialing:1, active:1, past_due:1};
const PLAN_DEAD={canceled:1, unpaid:1, incomplete_expired:1, paused:1};
function planState(pl){
 if(!pl||!pl.tier||pl.tier==='free'||pl.tier==='gift')return 'none';
 if(PLAN_LIVE[pl.status])return 'live';
 if(PLAN_DEAD[pl.status])return 'ended';
 return 'pending';}
/* WHICH TIER IS ACTUALLY IN FORCE. A record can say tier three and be
   cancelled, and the answer is free, not tier three. Never read pl.tier
   directly anywhere else. */
function planOf(pl){
 var st=planState(pl);
 if(st==='live'&&PLAN_BY[pl.tier])return PLAN_BY[pl.tier];
 return PLAN_BY.free;}
/* SIGHT. Whether a rung of the chain is visible on this plan. */
function planSees(pl,kind){
 var lim=SEE_ORDER.indexOf(planOf(pl).see), at=SEE_ORDER.indexOf(kind);
 return at>=0&&lim>=0&&at<=lim;}
/* the first rung this plan cannot see, which is what an upgrade buys and
   what a locked row has to name. null when everything is visible. */
function planNextSight(pl){
 var lim=SEE_ORDER.indexOf(planOf(pl).see);
 if(lim<0||lim>=SEE_ORDER.length-1)return null;
 var want=SEE_ORDER[lim+1];
 for(var i=0;i<PLANS.length;i++)
  if(PLANS[i].k!=='gift'&&SEE_ORDER.indexOf(PLANS[i].see)>=lim+1)
   return {kind:want, tier:PLANS[i]};
 return null;}
/* ALLOWANCE. What is left to open this period. The gift is spent first and
   spent once, because it is a gift and not a monthly grant. Spend is never
   stored: it is always the unique count minus what has been granted, so the
   two cannot drift. */
function planAllowance(pl,uniqueCount){
 var used=Math.max(0,uniqueCount||0);
 var giftLeft=Math.max(0,100-used);
 if(giftLeft>0)return {source:'gift', left:giftLeft, of:100, inGift:true,
  base:0, spent:used,
  say:giftLeft+' of the gift left'};
 var t=planOf(pl);
 /* The grant comes from the tier that is IN FORCE, not from the number
    written on the record, unless the plan is live and the host has written
    one for this period, which is how proration and a carried remainder
    arrive. A cancelled record carrying granted 400 must not spend 400: it
    drops to free and gets free's ten, which is the honest behaviour and not
    the punitive one. */
 var granted=(planState(pl)==='live'&&pl&&pl.granted>0)?Math.floor(pl.granted):t.grant;
 /* SPEND IS PER PERIOD, which needs a baseline and cannot be derived from a
    lifetime count. The first build subtracted every address ever opened from
    one month's grant, so somebody in their ninth month read nothing left on
    the day the month opened. base is the unique count when the current period
    began, written by the host when it writes the grant, and it defaults to the
    end of the gift so a record that has never had a period still reads
    correctly on its first one. */
 var base=Math.max(0,(pl&&pl.base!=null)?pl.base:100);
 var spent=Math.max(0,used-base-Math.max(0,(pl&&pl.carried)||0));
 var left=Math.max(0,granted-spent);
 return {source:t.k, left:left, of:granted, inGift:false, base:base, spent:spent,
  say:granted?left+' of '+granted+' left this '+t.per:'nothing left to open'};}
/* WHAT AN UPGRADE WOULD BUY, said in the two things a tier actually changes.
   Never phrased as what a person is missing out on, because the product does
   not sell by making somebody feel short. */
function planUpgrade(pl){
 var now=planOf(pl);
 var i=PLANS.map(function(p){return p.k;}).indexOf(now.k);
 var nxt=null;
 for(var j=i+1;j<PLANS.length;j++){if(PLANS[j].k!=='gift'){nxt=PLANS[j];break;}}
 if(!nxt)return null;
 var moreSight=SEE_ORDER.indexOf(nxt.see)>SEE_ORDER.indexOf(now.see);
 /* A DIFFERENCE ONLY MEANS SOMETHING WHEN THE PERIODS MATCH. Free is ten a
    week and tier one is four hundred a month, and subtracting one from the
    other gave "390 more a month", which is arithmetic over two different
    units. Across a period boundary the tier states its own figure instead. */
 var same=(nxt.per===now.per);
 var moreGround=same?(nxt.grant-now.grant):nxt.grant;
 return {to:nxt, ground:moreGround>0?moreGround:0, sight:moreSight, same:same,
  say:(moreGround<=0?'the same ground'
     :same?(moreGround+' more of new ground a '+nxt.per)
     :(nxt.grant+' of new ground a '+nxt.per))
   +(moreSight?', and the next rung of the chain':'')};}
