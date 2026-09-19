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

/* ============================================================
   SIGHT IS NOT FOR SALE. Ruled.

   > Tier one can see the Jungian archetypes. Actually, they can
   > see all that shit. It is really about the patterns and what
   > the patterns are doing. And then how many they can release.

   The ladder used to stop each tier somewhere along the chain.
   That is gone. Everybody sees the whole reading at every tier,
   free included. What a tier buys is one thing: how much new
   ground you may open.

   Simpler to explain, simpler to price, and it removes the one
   mechanic in the product that withheld a person's own reading
   from them in order to sell it back.
   ============================================================ */
const SEE_ORDER=['sab','cx','hy','sup'];
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
 {k:'gift',  nm:'The gift',    per:'once',  grant:100,  see:'sup', lead:false,
  d:'A hundred patterns, free, with everything visible. Twenty five releases at one address, or fewer and wider. It is spent by opening new ground and never by rerunning what is already open.'},
 {k:'free',  nm:'Free',        per:'week',  grant:10,   see:'sup', lead:false,
  d:'Ten patterns a week, for life. Two releases at one address, and unlimited rerunning of anything already open. The whole reading is visible, the same as on every tier.'},
 {k:'one',   nm:'Tier one',    per:'month', grant:400,  see:'sup', lead:false,
  d:'Four hundred a month, a hundred a week. About what a month of half an hour of practice every day would release.'},
 {k:'two',   nm:'Tier two',    per:'month', grant:800,  see:'sup',  lead:false,
  d:'Eight hundred a month, two hundred a week. Twice the ground and nothing else different.'},
 {k:'three', nm:'Tier three',  per:'month', grant:1200, see:'sup',  lead:false,
  d:'Twelve hundred a month, three hundred a week. Three times the ground.'},
 /* TIER FOUR IS NOT MORE OF THE SAME. It carries the same twelve hundred as
    tier three, so patterns do not separate them at all: what tier four buys
    is the cohort lead suite. Ruled, and it is the one rung with a price
    attached. */
 {k:'four',  nm:'Tier four',   per:'month', grant:1200, see:'sup', lead:true,
  d:'The same twelve hundred as tier three, and the cohort lead suite. Manage profiles, build rituals and build accountability for the people you lead.'}];
const PLAN_BY={}; PLANS.forEach(function(p){PLAN_BY[p.k]=p;});
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
const LEAD_SEES=['fetters','saboteurs','complexes','hyper complexes','analytics'];
const LEAD_HIDDEN=['the story cloud','the spiritual material','the tools themselves'];
function leadSees(what){ return LEAD_SEES.indexOf(what)>=0; }
/* the pain map and the tools are on every tier, ruled, so they are named
   here rather than left for a renderer to remember */
/* on every tier including free, and the list is long on purpose: it is
   everything except how much new ground you may open. */
const PLAN_ALWAYS=['the whole reading','saboteurs, complexes, hyper complexes and character',
 'the archetypes','the pain map','every tool','the journal',
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
   discount. */
const PLAN_YEAR_FREE=0;
function planYear(k){
 var t=PLAN_BY[k]; if(!t||t.per!=='month')return null;
 var pay=12-PLAN_YEAR_FREE;
 return {pay:pay, grant:t.grant,
  say:(PLAN_YEAR_FREE>0
    ? 'Twelve months for the price of '+pay+'. The allowance still arrives '
      +'monthly, because it is a pace.'
    : 'Paid for the year. The allowance still arrives monthly, because it is '
      +'a pace.')};}

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
 /* everybody, on every plan, including free. ruled. */
 return SEE_ORDER.indexOf(kind)>=0;}
/* the first rung this plan cannot see, which is what an upgrade buys and
   what a locked row has to name. null when everything is visible. */
/* there is no next rung of sight to sell, on any plan, ever. kept so a
   renderer asking the question gets a straight no rather than an error. */
function planNextSight(){ return null; }
/* ALLOWANCE. What is left to open this period. The gift is spent first and
   spent once, because it is a gift and not a monthly grant. Spend is never
   stored: it is always the unique count minus what has been granted, so the
   two cannot drift. */
function planAllowance(pl,uniqueCount){
 var used=Math.max(0,uniqueCount||0);
 var giftLeft=Math.max(0,100-used);
 if(giftLeft>0)return {source:'gift', left:giftLeft, of:100, inGift:true,
  base:0, spent:used, runs:Math.floor(giftLeft/RUN_MIN),
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
 /* HOW MANY RUNS THAT IS, which is the unit a person actually acts in. Counted
    against the smallest run and not the largest: a run costs the minimum for
    what was picked, so what an allowance buys is answered by the floor. Saying
    nought runs on ten patterns was true only while every run cost twenty five. */
 var runs=Math.floor(left/RUN_MIN);
 return {source:t.k, left:left, of:granted, inGift:false, base:base, spent:spent,
  runs:runs,
  say:!granted?'nothing left to open'
   :(runs>0?(left+' of '+granted+' left this '+t.per)
    :(left+' left this '+t.per+', banking toward a run of '+RUN_MIN))};}
/* WHAT AN UPGRADE WOULD BUY, said in the two things a tier actually changes.
   Never phrased as what a person is missing out on, because the product does
   not sell by making somebody feel short. */
function planUpgrade(pl){
 var now=planOf(pl);
 var i=PLANS.map(function(p){return p.k;}).indexOf(now.k);
 var nxt=null;
 for(var j=i+1;j<PLANS.length;j++){if(PLANS[j].k!=='gift'){nxt=PLANS[j];break;}}
 if(!nxt)return null;
 var moreSight=false;                /* sight is not for sale. ruled. */
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
const EQUIV_NONE='Plant medicine is not on this list. The book gives no rate for it, '
 +'and a number invented to make a comparison look good is the first thing a person who '
 +'has done it will check.';
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

