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
   more speaking, because a rerun costs nothing by construction. Sight
   is the second axis and is ruled below, at SIGHT.
   ============================================================ */

/* ============================================================
   SIGHT BY TIER. Ruled by the owner on 1 October 2026, reversing the ruling
   of 19 September that stood on this spot, "Sight is not for sale".

   > Yeah, you see your own reading. However, the tiers, the differences are:
   > tier one can see saboteurs, tier two can see saboteurs and complexes,
   > tier three and four can see hyper complexes on. That means that they
   > can't see what's running them in the field or the body or how the point
   > cloud is expressed or the child masks.

   WHAT EVERYBODY SEES, free included, is their own reading at the level of
   the 112 addresses (the fetters), the domains, the archetypes, the laws,
   the gates and the shadow. That is PLAN_ALWAYS below. What a tier buys is
   how far up the chain from a fetter a person may look: saboteur, complex,
   hyper complex, character. And two surfaces that express what is running
   somebody rather than listing it, the Compass's Registers (the point cloud)
   and the Character page's masks, which sit on the same ladder.

   It is the second axis of the tier system, beside velocity. DECISIONS.md
   calls them "two axes of the same tier system": how many new patterns a
   tier opens (grant, below) and how far up the chain it lets a person see
   (SIGHT, below). Neither one buys the other.

   ONE TABLE, AND NOTHING ELSE TYPES A TIER. SIGHT is the only place that says
   which tier a thing needs. The ladder rows in PLANS no longer carry a `see`
   of their own, because that was a second place the same fact lived and the
   first one to drift. What a tier sees is read off SIGHT by planSight, and
   what a tier adds over the one below it is read by planAdds, which is what
   the tiers page prints.

   THIS IS A PRODUCT BOUNDARY AND NOT SECURITY. The record is on the person's
   own device, so nothing here can stop somebody who edits their own record
   from reading their own data. What it stops is the product drawing it for
   a tier that has not bought it. Said once here so no surface has to pretend
   otherwise.
   ============================================================ */
/* THE TABLE. k is identity and is compared, stored nowhere. nm is what a
   sentence calls it. what is the one plain sentence a lock says about it, in
   the product's own words. need is the tier that unlocks it, a key of PLANS.
   layer marks the four rungs of the chain, in the order they stack: each one
   is built from the one before, so a tier that sees a rung sees every rung
   below it, and the table is checked for that in tests/engine.js.

   built:false MARKS A ROW WITH NO SURFACE YET, and the copy readers below skip
   it. The owner ruled "Tier two unlocks the Kundalini" on 1 October and the
   shipped app has a glossary entry for it and nothing that draws it (the rise
   bar is in proto/avatar/rise.js, which is not in the build). The row is here
   so the ruling is held in the one table and planSees answers it, but a tiers
   page that listed it under tier two would be selling something that is not
   there, so planAdds, planSeesAt, planLockedSay and the lock lists leave it
   out until the surface exists. Building it is one word here, built:true, and
   one lockApply on its control.

   THE TIERS OF THE TWO THAT ARE NOT RUNGS. The owner ruled the point cloud
   on 1 October, in answer to the question this table asked: "Tier three
   unlocks the point cloud." That is the Compass's Registers view, so reg is
   tier three. He has not named a tier for the masks, which he listed with
   "how the point cloud is expressed or the child masks", so the masks are
   PROPOSED at tier three, where the character layer that lights them sits.
   That one is still open, and moving it is one word in this table. */
const SIGHT=[
 {k:'sab', nm:'saboteurs', need:'one', layer:true,
  what:'Which saboteurs are running on your charge.'},
 {k:'cx', nm:'complexes', need:'two', layer:true,
  what:'Where your saboteurs join into complexes.'},
 {k:'hy', nm:'hyper complexes', need:'three', layer:true,
  what:'Where your complexes join into hyper complexes.'},
 {k:'sup', nm:'character', need:'three', layer:true,
  what:'The character your whole chain builds up into.'},
 {k:'kund', nm:'the Kundalini', need:'two', layer:false, built:false,
  what:'How far the Kundalini has risen up your seven seats.'},
 {k:'reg', nm:'the registers', need:'three', layer:false,
  what:'The registers, your point cloud: where each pattern sits in the compass.'},
 {k:'mask', nm:'the masks', need:'three', layer:false,
  what:'The six masks, and how your chain lights each one.'}];
/* the rows a person can be told about: the table less any with no surface */
function sightRows(){ return SIGHT.filter(function(g){return g.built!==false;}); }
const SEE_ORDER=SIGHT.filter(function(g){return g.layer;}).map(function(g){return g.k;});
/* THE RUN CAP. A release run is at most twenty five patterns. It is a ceiling
   and not a size: a run costs the minimum for what was picked, and the cap
   only truncates a wide selection. It used to be both, which made every run
   cost twenty five and the free grant unspendable. */
const RUN_MAX=25;
/* THE SMALLEST RUN THERE IS: one address crossed with the four channels. It is
   the floor because a run has to cover the address on both sides and both
   tracks to be a release at all, and it is what an allowance is measured in
   now that a run costs the minimum rather than filling to the cap. Ten free
   patterns is two of these a week, which is a product. Ten against a run of
   twenty five was nought, which was not. */
const RUN_MIN=4;
const PLANS=[
 {k:'gift',  nm:'The gift',    per:'once',  grant:100,  lead:false,
  d:'A hundred patterns, free. Twenty five releases at one address, or fewer and wider. It is spent by opening new ground and never by rerunning what is already open.'},
 {k:'free',  nm:'Free',        per:'week',  grant:10,   lead:false,
  d:'Ten patterns a week, for life. Two releases at one address, and unlimited rerunning of anything already open.'},
 {k:'one',   nm:'Tier one',    per:'month', grant:400,  lead:false,
  d:'Four hundred a month, a hundred a week. About what a month of half an hour of practice every day would release.'},
 {k:'two',   nm:'Tier two',    per:'month', grant:800,  lead:false,
  d:'Eight hundred a month, two hundred a week. Twice the ground of tier one.'},
 {k:'three', nm:'Tier three',  per:'month', grant:1200, lead:false,
  d:'Twelve hundred a month, three hundred a week. Three times the ground.'},
 /* TIER FOUR IS NOT MORE OF THE SAME. It carries the same twelve hundred as
    tier three, so patterns do not separate them at all, and it sees what tier
    three sees: what tier four buys is the cohort lead suite. Ruled, and it is
    the one rung with a price attached. */
 {k:'four',  nm:'Tier four',   per:'month', grant:1200, lead:true,
  d:'The same twelve hundred as tier three, and the cohort lead suite. Manage profiles, build rituals and build accountability for the people you lead.'}];
const PLAN_BY={}; PLANS.forEach(function(p){PLAN_BY[p.k]=p;});
/* THE GIFT'S SIZE, NAMED ONCE. It is the gift row's grant above. planAllowance
   carried its own literal 100 in five places beside that row, which is the same
   number held twice and one edit away from two answers. */
const GIFT_N=PLAN_BY.gift.grant;
/* A FREE WEEK, as a length. The free tier's weeks are counted from the moment
   the gift ran out, seven days at a time, so a week needs no calendar, no zone
   and no host to start it. */
const WEEK_MS=7*24*3600*1000;
/* HOW MANY FREE WEEKS HAVE OPENED since the gift ran out, counting the one it
   ran out in. One when there is no date to count from, which is the reading a
   record that has never been stamped always had. Never below one, so a clock
   set backwards cannot take a week away. */
function planWeeks(at,now){
 var a=at?new Date(at).getTime():NaN; if(!isFinite(a))return 1;
 var n=(now!=null)?new Date(now).getTime():Date.now(); if(!isFinite(n))return 1;
 return Math.max(1,Math.floor((n-a)/WEEK_MS)+1);}
/* ============================================================
   WHAT A COHORT LEAD SEES OF SOMEBODY THEY LEAD.

   A separate axis from the personal sight ladder, and deliberately
   narrower than it. The owner's ruling: the outputs, not the tools.
   Fetters, saboteurs, complexes, hyper complexes. Their analytics.
   Not the spiritual material and not the story cloud. A snapshot.

   The story is the one thing that never crosses, because the story
   is the person's own words and the standing promise is that the
   record and the story are never held joined. A lead who can read
   twelve journals is a different product with a different
   obligation attached.
   ============================================================ */
/* ROUND PD, HIS WORDS: "a cohort, they can see the teachers if that's shared
   with them. No, they shouldn't carry a match number." A person's chosen teacher
   is spiritual material, which stays hidden below, so this carves one exception
   and it is narrow on purpose: only when the person has switched sharing on for
   that teacher, only the pole key and the reach opened (teachShareOut is the one
   function that builds it, engine/teach.js), never the lines they marked, a word
   they wrote or their story. Off by default and inert until accounts exist. */
const LEAD_SEES=['fetters','saboteurs','complexes','hyper complexes','analytics','the teachers, when shared'];
const LEAD_HIDDEN=['the story cloud','the spiritual material','the tools themselves',
 /* a daily summary is a derived join of the story and the record, and the
    person's own aim is written into its bank, so it takes the story's class */
 'the daily summary'];
function leadSees(what){ return LEAD_SEES.indexOf(what)>=0; }
/* WHAT IS ON EVERY TIER, free included, and the list is long on purpose: it is
   everything except how far up the chain a person sees (SIGHT) and how much
   new ground they may open (grant). The first six are the owner's own words of
   1 October, "your own reading at the level of the 112 addresses, domains,
   archetypes, laws, gates and shadow", with gates said as action because that
   is the word the Field's bar already prints for them. */
const PLAN_ALWAYS=['your 112 addresses','the domains','the archetypes','the laws',
 'action','shadow','the pain map','every tool','the journal',
 'rerunning anything already open'];
/* ANNUAL. TWO MONTHS FREE IS OUT, on the owner's ruling.

   It was ruled in as the convention and has been ruled back out, and this was
   not a document: planYear built the sentence "twelve months for the price of
   ten" and the settings surface printed it to a person. An offer the owner
   has withdrawn cannot keep being made by the product because the reversal
   only reached the design records.

   The discount is zero until a number is ruled. PLAN_YEAR_FREE stays as the
   one place that number lives, so setting it is the whole change when there
   is one, and at zero planYear says nothing about price at all.

   The allowance still arrives monthly rather than as a year in one lump,
   whatever the price, because the allowance is a pace and a year of patterns
   handed over at once is not a practice. That part was never about the
   discount.

   AND IT SPEAKS ONLY TO A RECORD THAT IS PAID BY THE YEAR. It took a tier key
   and nothing else, so the plan sheet printed "Paid for the year." to every
   monthly subscriber, which is a claim about their bill that is false.
   DECISIONS.md rules monthly only and leaves annual open, and every price
   Stripe is set up with is monthly. It reads the record now and answers null
   unless the record says per:'year'. No record says that today: the boundary
   in schema.js does not admit a per field and the server does not send one,
   so this is silent for everybody until an annual plan is ruled and both
   ends carry it. */
const PLAN_YEAR_FREE=0;
function planYear(k,pl){
 if(!pl||pl.per!=='year')return null;
 var t=PLAN_BY[k]; if(!t||t.per!=='month')return null;
 var pay=12-PLAN_YEAR_FREE;
 return {pay:pay, grant:t.grant,
  say:(PLAN_YEAR_FREE>0
    ? 'Twelve months for the price of '+pay+'. The allowance still arrives '
      +'monthly, because it is a pace.'
    : 'Paid for the year. The allowance still arrives monthly, because it is '
      +'a pace.')};}

/* THE PRICE, NAMED ONCE, in dollars a month. Only what is ruled carries a
   number, and all four rungs are ruled. The owner stated them himself on 1
   October, after checking the documentation: "Free: $0. Tier 1: $12/month.
   Tier 2: $29/month. Tier 3: $59/month. Tier 4: $99/month. Tier 4 includes
   the same 1,200 pattern allowance as Tier 3, plus cohort lead capability."

   That supersedes DECISIONS.md line 1095, "The ladder is 12, 24, 36, 99",
   which this table carried for one round. Before that, tiers one to three
   sat at null because this comment read the 12/29/59 passage as an unruled
   recommendation, so the tiers page said "shown at checkout" for prices the
   owner had in mind. Three figures moved twice in two rounds, which is the
   reason the ruling is quoted here with its date rather than summarised.

   A number printed in this file that the processor then charges differently
   is a bill nobody agreed to, so the four Stripe prices are created at
   exactly these figures (STRIPE-SETUP.md) and null stays the answer for
   anything unruled.

   And never a dollar figure against a pattern. One pattern is valued at one
   dollar internally and DECISIONS.md rules that it is never published. */
const PLAN_PRICE={free:0, one:12, two:29, three:59, four:99};
function planPrice(k){ var v=PLAN_PRICE[k]; return (typeof v==='number'&&isFinite(v))?v:null; }
/* THE LADDER, READ FOR A COMPARISON. One row per tier a person can be on, the
   gift left out because it is given once and never chosen. Each row says what
   it opens, in the tier's own period and in a week, whether it is the tier in
   force, and whether moving to it is a step up. Read off planOf, so a record
   that says tier three and is cancelled reads free here as everywhere.

   Sight is on the row now, as the two reads a comparison needs: sees is every
   thing the tier can see beyond what is on every plan, adds is what it sees
   that the rung below did not. Both are SIGHT rows read by planSeesAt and
   planAdds, so the ladder types no tier of its own. */
function planLadder(pl){
 var now=planOf(pl), keys=PLANS.map(function(p){return p.k;});
 var at=keys.indexOf(now.k);
 return PLANS.filter(function(p){return p.k!=='gift';}).map(function(p){
  var i=keys.indexOf(p.k);
  return {k:p.k, nm:p.nm, per:p.per, grant:p.grant,
   /* a month here is four weeks, which is the owner's own arithmetic: four
      hundred a month is a hundred a week in DECISIONS.md */
   week:(p.per==='week')?p.grant:Math.round(p.grant/4),
   runs:Math.floor(p.grant/RUN_MIN), lead:!!p.lead, price:planPrice(p.k),
   sees:planSeesAt(p.k), adds:planAdds(p.k),
   now:(p.k===now.k), up:(i>at&&p.k!=='free')};});}

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
/* THE PLAN THE SERVER HOLDS, LAID ONTO A RECORD. Nothing wrote CURP.plan from
   the server, so a person who paid came back to a Billing section reading
   Free. ui/auth.js reads the account's billing off /v1/me and hands it here;
   this decides the record, and the host validates and saves it. Pure, so the
   arithmetic is gated headless and the host only does the writing.

   b is the server's {tier, status, since, until}: the tier as this file's own
   key, the status as Stripe's own word, which PLAN_LIVE and PLAN_DEAD already
   read, and the paid period as two dates. null is an account that has never
   paid, and it reads as free. The host never calls this with undefined: a
   server too old to send billing at all has said nothing, and nothing is
   written on nothing.

   A NEW PERIOD OPENS A NEW ALLOWANCE. When the tier or the period start moves,
   base is set to the unique count now, so planAllowance charges this period
   only for what is opened from here, granted goes back to the tier's own grant
   and nothing is carried. Floored at the end of the gift, the same floor
   planAllowance holds, so a period cannot open on ground the gift paid for. It
   is the count when the server was read and not when the period began, which
   charges anything opened in between to the period before: the record knows
   no unique count at an earlier time, and erring that way never takes
   patterns from somebody. An upgrade or a downgrade mid month is a new tier,
   so it opens a full allowance of the new tier.

   same says whether anything a person can see moved, which is what the host
   speaks on. A renewal moves since and until and is not same, but it keeps
   the tier and stays live, so the host says nothing about it. */
/* A TIER THIS BUILD DOES NOT KNOW IS REFUSED, NOT ROUNDED TO FREE, the rule
   validateProfile already holds: a server one tier ahead of this file would
   otherwise downgrade everybody on it. refused names it and nothing moves. */
function planFromServer(prev,b,unique){
 var pv=(prev&&typeof prev==='object')?prev:{};
 if(b&&typeof b==='object'&&!PLAN_BY[b.tier]){
  var k=planOf(prev).k, lv=planState(prev)==='live';
  return {plan:pv, same:true, refused:String(b.tier), was:k, now:k, wasLive:lv, nowLive:lv,
   status:(typeof pv.status==='string')?pv.status:'', wasStatus:(typeof pv.status==='string')?pv.status:''};}
 var paid=!!(b&&typeof b==='object'&&PLAN_BY[b.tier]&&b.tier!=='free'&&b.tier!=='gift');
 var next;
 if(!paid)next={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null};
 else {
  var since=(typeof b.since==='string')?b.since:null, until=(typeof b.until==='string')?b.until:null;
  var fresh=(pv.tier!==b.tier)||((pv.since==null?null:pv.since)!==since);
  var n=Array.isArray(unique)?unique.length:Number(unique); if(!isFinite(n)||n<0)n=0;
  /* in the blank's own key order (schema.js), so a record written here and
     the same record after the boundary serialise the same */
  next={tier:b.tier, status:(typeof b.status==='string')?b.status:'',
   granted:fresh?0:(pv.granted||0), carried:fresh?0:(pv.carried||0),
   base:fresh?Math.max(GIFT_N,Math.floor(n)):(pv.base==null?null:pv.base),
   since:since, until:until};}
 var eq=function(k){return (pv[k]==null?null:pv[k])===(next[k]==null?null:next[k]);};
 var was=planOf(prev), now=planOf(next);
 return {plan:next, same:['tier','status','since','until'].every(eq),
  was:was.k, now:now.k, wasLive:planState(prev)==='live', nowLive:planState(next)==='live',
  status:next.status, wasStatus:(typeof pv.status==='string')?pv.status:''};}
/* ============================================================
   SIGHT, READ OFF SIGHT. Everything below is arithmetic over the one table at
   the top of this file and a plan record, and none of it knows what a surface
   is.

   THE TIERS IN ORDER, as keys: every row of PLANS but the gift, which is given
   once and is never a tier a person is on, so it has no rank. Free is the
   floor, rank 0. planOf is what puts a person on a rung, so a record that says
   tier three and is cancelled, one that names a tier this build has never
   heard of and one with no plan at all all read free here, the same way they
   read free for the allowance. Nothing in this section reads pl.tier.
   ============================================================ */
const TIER_KEYS=PLANS.filter(function(p){return p.k!=='gift';}).map(function(p){return p.k;});
function planRank(k){ return TIER_KEYS.indexOf(k); }
/* WHAT THIS PLAN CAN SEE. sees maps every key in SIGHT to a boolean, so a
   caller never has to treat a missing key as an answer, and locked is the rows
   it cannot, in table order, which is what a lock has to name. tier is the key
   of the rung in force. */
function planSight(pl){
 var t=planOf(pl), at=planRank(t.k), sees={}, locked=[];
 SIGHT.forEach(function(g){
  var ok=at>=planRank(g.need); sees[g.k]=ok; if(!ok&&g.built!==false)locked.push(g);});
 return {tier:t.k, sees:sees, locked:locked, all:locked.length===0};}
/* Whether one thing is visible on this plan. A key that is not in SIGHT is not
   a thing the product gates and answers false, the same straight no the old
   version gave a rung that did not exist. */
function planSees(pl,kind){ return planSight(pl).sees[kind]===true; }
/* THE TIER THAT UNLOCKS A THING, as its PLANS row, or null for a key SIGHT does
   not hold. This is what a lock names. */
function planNeed(kind){
 var g=SIGHT.filter(function(x){return x.k===kind;})[0];
 return g?PLAN_BY[g.need]:null;}
/* WHAT A TIER SEES, and WHAT IT ADDS OVER THE ONE BELOW IT, by tier key. The
   tiers page prints the second, which is the only thing about a tier's sight
   that is news: everything a rung sees, the rung below saw too. Both are SIGHT
   rows, so a caller reads nm and what off them and types neither. */
function planSeesAt(k){
 var at=planRank(k); return at<0?[]:sightRows().filter(function(g){return planRank(g.need)<=at;});}
function planAdds(k){
 return sightRows().filter(function(g){return g.need===k;});}
/* WHAT A PLAN SEES, SAID AS ONE CLAUSE for a sheet that has a line for it. The
   reading everybody has is the stem, and what the plan adds is a list off
   SIGHT, so this types no rung. */
function planSightSay(pl){
 var s=planSight(pl), seen=sightRows().filter(function(g){return s.sees[g.k];}).map(function(g){return g.nm;});
 return 'your own reading'+(seen.length?', with '+planList(seen):', without what is running it');}
/* THE LOCKED ROWS, GROUPED BY THE TIER THAT UNLOCKS THEM, as clauses: saboteurs,
   unlocked on tier one and above. Both the tiers page and a partly locked
   preset say this, so it is said here once. keys are SIGHT keys. */
function planLockedSay(keys){
 var by={}, order=[];
 keys.forEach(function(k){var g=SIGHT.filter(function(x){return x.k===k;})[0]; if(!g||g.built===false)return;
  if(!by[g.need]){by[g.need]=[]; order.push(g.need);}
  by[g.need].push(g.nm);});
 return order.map(function(n){
  return planList(by[n])+', unlocked on '+PLAN_BY[n].nm.toLowerCase()+' and above';}).join('; ');}
/* WHAT AN UPGRADE WOULD UNLOCK, as the next rung up that adds anything to see,
   with the rows it adds. null when everything is visible already. It never
   skips a rung that adds something, so a person on free is told tier one, not
   tier three. */
function planNextSight(pl){
 var at=planRank(planOf(pl).k);
 for(var i=at+1;i<TIER_KEYS.length;i++){
  var add=planAdds(TIER_KEYS[i]);
  if(add.length)return {to:PLAN_BY[TIER_KEYS[i]], adds:add};}
 return null;}
/* ALLOWANCE. What is left to open this period. The gift is spent first and
   spent once, because it is a gift and not a monthly grant. Spend is never
   stored: it is always the unique count minus what has been granted, so the
   two cannot drift. */
function planAllowance(pl,uniqueCount,giftAt,now){
 /* IT TAKES A COUNT, AND IT NOW SAYS SO RATHER THAN TRUSTING IT.

    Two shapes of the same word live in this codebase and they are easy to
    confuse. `CURP.meter.unique` is the array of pattern keys, and
    `meterRead().unique` is already its length. The plan panel reads the
    second, which is correct, and I misread it as the first and changed a
    caller that was never broken. Checked afterwards, properly: that field is
    a number, and no build has ever shown a person a NaN here.

    What is worth keeping from the wrong turn is the guard. An array coerces
    to NaN the moment it holds more than one item, so a future caller handing
    this a list would put an unreadable number on the one surface that tells
    somebody what they have paid for and what is left. This takes either
    shape and can no longer emit NaN from any input. Array.isArray rather
    than a length check, because a string has a length too and the first cut
    read "x" as one pattern spent.

    The rule this broke is the one already written down here: reproduce the
    failure before fixing it. A direct call with a hand made array is not the
    caller, and I did not go and look at what the caller actually passes. */
 var n=Array.isArray(uniqueCount)?uniqueCount.length:uniqueCount;
 n=Number(n); if(!isFinite(n))n=0;
 var used=Math.max(0,n);
 var giftLeft=Math.max(0,GIFT_N-used);
 if(giftLeft>0)return {source:'gift', left:giftLeft, of:GIFT_N, inGift:true,
  base:0, spent:used, runs:Math.floor(giftLeft/RUN_MIN), weeks:0,
  /* what it is of, in words. "92 of the gift left" says ninety two of what. */
  say:giftLeft+' patterns left of the '+GIFT_N+' you were given'};
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
 /* AND IT IS NEVER BELOW THE END OF THE GIFT. That default never fired: the
    schema wrote a literal 0 into every new record, 0 is not null, so every
    record read base 0, the gift's hundred were charged against the first free
    week, and the allowance read nought from the moment the gift ran out, for
    good. The schema no longer writes it, and the floor is here as well because
    every record saved before that fix still carries the 0 on disk. It is the
    rule and not a clamp: a period cannot open on ground the gift already paid
    for, so a baseline under the gift's end, written by anybody, charges the
    gift twice. The stored value is left as written. */
 var stored=(pl&&pl.base!=null&&isFinite(pl.base))?Number(pl.base):null;
 var base=Math.max(GIFT_N,stored===null?GIFT_N:stored);
 var spent=Math.max(0,used-base-Math.max(0,(pl&&pl.carried)||0));
 /* FREE BANKS, RULED IN DECISIONS: "the grant banks, the surface says it is
    banking". Nothing in a one file build starts a new week, so free was ten
    once and then never again. It is derived instead of written: every week
    since the gift ran out adds the tier's grant, and spend is everything opened
    past the gift. Nothing is stored but the date the gift ran out, which
    meterRun stamps as a fact about the meter, so a week cannot fail to start
    because no host was there to start it.

    Only while no host has written a period of its own. A record whose baseline
    sits past the gift's end had a period written by the record store, and the
    store that wrote it writes the next one. */
 var weeks=1, total=granted;
 if(t.k==='free'&&base===GIFT_N){ weeks=planWeeks(giftAt,now); total=granted*weeks; }
 var left=Math.max(0,total-spent);
 /* HOW MANY RUNS THAT IS, which is the unit a person actually acts in. Counted
    against the smallest run and not the largest: a run costs the minimum for
    what was picked, so what an allowance buys is answered by the floor. Saying
    nought runs on ten patterns was true only while every run cost twenty five. */
 var runs=Math.floor(left/RUN_MIN);
 return {source:t.k, left:left, of:total, inGift:false, base:base, spent:spent,
  runs:runs, weeks:weeks,
  say:!granted?'nothing left to open'
   /* more than one week's grant is only reachable by banking, and "18 of 10"
      says nothing, so a bank says what it is and what arrives next */
   :(left>granted?(left+' banked, and '+granted+' more arrive each '+t.per)
   :(runs>0?(left+' of '+granted+' left this '+t.per)
    :(left+' left this '+t.per+', banking toward a run of '+RUN_MIN)))};}
/* A LIST SAID THE WAY A PERSON SAYS IT: a, b and c. */
function planList(a){
 return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
/* WHAT AN UPGRADE WOULD BUY, said in the two things a tier actually changes.
   Never phrased as what a person is missing out on, because the product does
   not sell by making somebody feel short. */
function planUpgrade(pl){
 var now=planOf(pl);
 var i=PLANS.map(function(p){return p.k;}).indexOf(now.k);
 var nxt=null;
 for(var j=i+1;j<PLANS.length;j++){if(PLANS[j].k!=='gift'){nxt=PLANS[j];break;}}
 if(!nxt)return null;
 /* what the next rung lets a person see that this one does not, off SIGHT */
 var moreSight=planAdds(nxt.k);
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
   +(moreSight.length?', and it shows you your '+planList(moreSight.map(function(g){return g.nm;})):'')};}

/* ============================================================
   WHAT AN ALLOWANCE IS WORTH, in the units people already price
   against. Every figure here is the codex's own, quoted:

     "Therapy tends to release one to six patterns per session, if
      you are lucky. Meditation, six to twelve patterns per twenty
      minute practice. Breathwork, similar. Plant medicine depends
      on exposure."

   Plant medicine is deliberately absent from the table. The book
   gives no figure for it and inventing one to make a comparison
   look good is the fastest way to lose an argument with somebody
   who has done it.

   TWO RULES ON HOW THIS MAY BE SAID.

   It is a claim about THROUGHPUT, never about outcome. How many
   patterns a thing releases is measurable against the book. What a
   person's life does afterwards is not, and the evidence tier does
   not carry it. So the copy says "as many patterns as", never "the
   same as" and never "instead of".

   And the low end is the one that gets said. A range of one to six
   quoted at six is the most flattering reading of your own number,
   which is exactly the reading a hostile reader will check first.
   ============================================================ */
const EQUIV=[
 {k:'therapy', nm:'therapy sessions',        lo:1,  hi:6,   unit:'a session',
  d:'One to six patterns a session, if you are lucky.'},
 {k:'medit',   nm:'thirty minute sittings',  lo:9,  hi:18,  unit:'per thirty minutes',
  d:'Six to twelve per twenty minutes, so nine to eighteen per half hour.'},
 {k:'breath',  nm:'breathwork sessions',     lo:9,  hi:18,  unit:'per thirty minutes',
  d:'The same rate as meditation.'},
 {k:'month',   nm:'months of daily practice',lo:270,hi:540, unit:'thirty minutes a day',
  d:'A month of half an hour every day, at the meditation rate.'}];
/* the second clause was the team's reasoning printed to the person. The
   reason a person needs is the first one, and tests/engine.js holds it. */
const EQUIV_NONE='Plant medicine is not on this list, because the book gives no rate for it.';
/* how many of a thing an allowance is worth. the low end first, because the
   low end is the claim that survives being checked. */
function equivOf(patterns,k){
 var e=EQUIV.filter(function(x){return x.k===k;})[0];
 if(!e||!(patterns>0))return null;
 return {k:k, nm:e.nm, lo:patterns/e.hi, hi:patterns/e.lo,
  /* the sentence, at the conservative end and phrased as throughput */
  say:'as many patterns as '+fmtN(patterns/e.hi)+' '+e.nm+' would release'};}
function fmtN(n){
 if(n>=10)return String(Math.round(n));
 if(n>=1)return String(Math.round(n*10)/10);
 return String(Math.round(n*100)/100);}
/* the one line a rung gets to say about itself, and it is the meditation month
   because four hundred a month lands inside two hundred and seventy to five
   hundred and forty, which IS a month of half an hour a day. */
function planWorth(patterns){
 var m=equivOf(patterns,'month'), t=equivOf(patterns,'therapy');
 if(!m||!t)return '';
 /* THE TEST IS WHETHER THE RANGE CONTAINS ONE, not whether a ratio is near
    it. Four hundred over the high rate is 0.74 months and over the low rate
    is 1.48, so a month sits inside the band and the honest sentence is "about
    a month". Comparing the conservative end to one instead said sixty seven
    therapy sessions, which is true and is the wrong unit. */
 if(m.lo<=1&&m.hi>=1)
  return 'About what a month of half an hour of practice every day would release.';
 if(m.lo>1)return 'About what '+fmtN(m.lo)+' months of half an hour a day would release.';
 return 'As many patterns as '+fmtN(t.lo)+' therapy sessions would release.';}

