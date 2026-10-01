/* ============================================================
   THE TIERS, SIDE BY SIDE. Round NZ: "We need to prioritize the
   paywall story."

   The Billing section said which tier a person is on and offered one
   button, the next rung up. Nothing in the product laid the ladder
   out, so a person deciding whether to pay was deciding about one
   line of prose. This is the ladder, read off engine/plan.js and
   nothing else, with a press on every rung above the one in force.

   WHERE IT LIVES. Under Billing, in the account area, directly below
   "Your plan", because that is where a person already goes to change
   what they pay, and a second surface for the same decision would be
   two answers to one question. It is reached three ways:

     Settings, Billing                    the standing route
     the release panel, when spent        "See the tiers", which opens
                                          Billing at this group. This is
                                          the moment of decision: a
                                          person who has just picked
                                          what to release and has
                                          nothing left to open it with.
     Account, signed out                  unchanged, it is the sign in

   Before this, the release panel's button said "Open settings" and
   landed on whichever account section was last open, the sign in form
   by default, which is the one screen in the product that says
   nothing about a plan.

   WHAT IT MAY SHOW. Sight is not for sale, ruled, so nothing a person
   can see differs between rows and no row lists a thing it unlocks.
   What every tier gets is said once, across the top, the whole width
   of the group, and the rows under it differ in one quantity: how
   much new ground opens. The bar on each row is that quantity drawn,
   so "the only thing that moves is volume" is a shape before it is a
   sentence.

   WHAT IT MAY NOT. No badge naming a tier as popular, no struck
   price, no count of anything running down, no tier pre-selected.
   A person on a tier sees it marked as the one they are on, which is
   a fact about their record. A press goes through planOpen, the same
   seam the "Move to" button uses, so a press here and a press there
   do exactly the same thing.
   ============================================================ */

/* the per-month figure a bar is drawn against. Free is a week of ten, so a
   month of it is forty, by the same four-week month plan.js reads. */
function ptMonthly(r){ return r.per==='week'?r.grant*4:r.grant; }

/* THE ONE LINE A ROW SAYS ABOUT ITSELF. Each one is checked against the
   arithmetic it describes: free banks (planAllowance, "FREE BANKS"), tier
   one's line is planWorth's own, two and three are multiples of tier one's
   grant, and four is the cohort lead suite at tier three's grant. */
function ptLine(r){
 var one=PLAN_BY.one.grant;
 if(r.k==='free')return 'What you do not spend carries over, week to week, until there is enough for a run.';
 if(r.k==='one')return planWorth(r.grant);
 /* "GRANTS A LEAD SIGHT" WAS TEAM SHORTHAND, and the owner said he did not know
    what sight meant here, so a customer would not either. The fact is the
    consent rule CLAUDE.md sets for a practitioner: nothing crosses until that
    person says yes, and they can take it back. LEAD_SEES is part of a reading
    and not all of it, so the line says part. */
 if(r.lead)return 'The same ground as tier three, and the cohort lead suite: manage profiles, '
  +'build rituals and build accountability for the people you lead. You see part of a person\'s '
  +'reading only after they say yes, and they can take that back at any time.';
 var x=r.grant/one;
 if(x===2)return 'Twice the ground of tier one. Nothing else changes.';
 if(x===3)return 'Three times the ground of tier one. Nothing else changes.';
 return planWorth(r.grant);}

/* EVERY RUNG CARRIES ITS PRICE NOW. The owner stated 12, 29, 59 and 99 on 1
   October (quoted at PLAN_PRICE in engine/plan.js), and
   PLAN_PRICE holds all four, so the "shown at checkout" this printed for tiers
   one to three is gone from the screen. The branch stays for a rung added
   later without a ruled price, which must still never print a guessed one. */
function ptPrice(r){
 if(r.price===0)return 'nothing';
 if(r.price!=null)return r.price+' dollars a month';
 return 'shown at checkout';}
/* 1,200 and not 1200, the way the funnel's own ladder prints it */
function ptN(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,','); }

function planTiersHtml(){
 var pl=(typeof CURP!=='undefined'&&CURP&&CURP.plan)||null;
 var rows=planLadder(pl);
 var top=Math.max.apply(null,rows.map(ptMonthly));
 var bud=(typeof CURP!=='undefined'&&CURP&&typeof meterBudget==='function')?meterBudget(CURP):null;
 var al=bud&&bud.allow;
 var signed=(typeof authSession==='function')&&!!authSession();
 var h='<div class="ac-grp pt-grp" id="plantiers">'
  +'<div class="ac-gh">The tiers</div>'
  /* the same on every row, said once and the full width, because it is the
     part a comparison would otherwise repeat five times or leave out */
  +'<div class="pt-same"><div class="pt-sh">On every tier, free included</div>'
  +'<p>'+esc(PLAN_ALWAYS.join(', ').replace(/^./,function(c){return c.toUpperCase();}))+'.</p>'
  /* patterns and not "new ground", the team's word for them, said in the unit
     the rows below are counted in */
  +'<p class="pt-so">A tier changes one thing: how many new patterns you can open.</p></div>'
  +'<div class="pt-list" role="list">';
 rows.forEach(function(r){
  var w=Math.max(2,Math.round(ptMonthly(r)/top*100));
  h+='<div class="pt-row'+(r.now?' on':'')+'" role="listitem"'+(r.now?' aria-current="true"':'')+'>'
   +'<div class="pt-who"><div class="pt-nm">'+esc(r.nm)+'</div>'
   +'<p class="pt-d">'+esc(ptLine(r))+'</p></div>'
   +'<div class="pt-fig"><div class="pt-n"><b class="num">'+ptN(r.grant)+'</b> patterns a '+esc(r.per)+'</div>'
   +(r.per==='week'?'':'<div class="pt-w">'+ptN(r.week)+' a week</div>')
   +'<div class="pt-bar" aria-hidden="true"><i style="width:'+w+'%"></i></div>'
   /* price sits under the figure it buys, a row of its own on every width.
      As a fourth column it wrapped to two lines at 1600, measured. */
   +'<div class="pt-pr"><span>Price</span><b>'+esc(ptPrice(r))+'</b></div></div>'
   +'<div class="pt-go">'
   +(r.now?'<span class="pt-now">You are on this</span>'
     :(r.up?'<button class="btn" type="button" data-ptier="'+esc(r.k)+'">Move to '
       +esc(r.nm.toLowerCase())+'</button>':''))
   +'</div></div>';});
 h+='</div>';
 /* THE FOOT SAYS WHAT A PRESS WILL MEET, before it is pressed. */
 var foot=[];
 if(al&&al.inGift)foot.push('You have '+al.left+' patterns left of the '+GIFT_N+' you were given. '
  +'While any of the gift is left, a run spends the gift first, on every tier.');
 if(!signed)foot.push('Moving to a tier needs a sign in, because the plan is held on your record. '
  +'Sign in from Account, then come back here.');
 /* the price is on every row now, so the foot says when it is charged rather
    than promising to show it. Monthly and nothing more: no annual price is
    ruled (PLAN_YEAR_FREE), so nothing here implies a year.
    "MOVING DOWN OR STOPPING" became stopping alone when Manage billing was
    built. The server hears a finished checkout and nothing else, so a tier
    lowered on Stripe's page would not lower the plan here; panels.js
    planSection carries the full reason beside its own line. */
 foot.push('Each price is charged once a month until you stop. You pay on a separate payment page, '
  +'and nothing is charged until you confirm there. '
  +'Stopping goes through Manage billing above, and stopping deletes nothing.');
 h+='<div class="ac-gf">'+foot.map(function(s){return '<p>'+esc(s)+'</p>';}).join('')
  +(signed?'':'<div class="pt-acts"><button class="btn" type="button" id="ptacc">Go to Account</button></div>')
  +'</div></div>';
 return h;}

/* every press goes through planOpen, the seam "Move to" already uses, so a
   tier pressed here and the same tier pressed there cannot do different
   things */
function planTiersWire(){
 var host=document.getElementById('plantiers'); if(!host)return;
 host.querySelectorAll('[data-ptier]').forEach(function(b){
  b.onclick=function(){planOpen('checkout',b.getAttribute('data-ptier'));};});
 var a=document.getElementById('ptacc');
 if(a)a.onclick=function(){ACC_OPEN='account'; renderAccount();};}

/* THE ROUTE IN FROM THE MOMENT OF DECISION. Opens Billing and brings the
   tiers into view, rather than leaving a person on the sign in form. */
/* The scroll waits a frame. setTab's own render repaints the account area
   after this returns, and a scroll made before that repaint scrolled a node
   that was then replaced: measured at 390, the press landed on Billing with
   the tiers below the fold. */
function planTiersOpen(){
 if(typeof ACC_OPEN!=='undefined')ACC_OPEN='billing';
 setTab(TAB.SETTINGS);
 if(typeof renderAccount==='function')renderAccount();
 var go=function(){var t=document.getElementById('plantiers');
  if(t&&t.scrollIntoView){try{t.scrollIntoView({block:'start'});}catch(e){}}};
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(function(){setTimeout(go,0);});
 else setTimeout(go,0);}

/* the surface's own rules, injected once, the way accProfCss carries the
   profiles section's, because the shell stylesheet is held by another seat */
function planTiersCss(){
 if(document.getElementById('pt-css'))return;
 var st=document.createElement('style'); st.id='pt-css';
 st.textContent=[
  '.pt-same{padding:13px 15px 14px;border-bottom:1px solid var(--edge);background:var(--panel-2)}',
  'body.punch .pt-same{border-bottom-color:transparent}',
  '.pt-sh{font-size:12px;font-weight:600;color:var(--dim);letter-spacing:.06em;margin-bottom:6px}',
  '.pt-same p{margin:0;font-size:14px;line-height:1.65;color:var(--ink);max-width:70ch}',
  '.pt-same p.pt-so{margin-top:8px;color:var(--mid)}',
  '.pt-row{display:grid;grid-template-columns:minmax(0,1fr) 228px 168px;gap:20px;align-items:center;',
  ' padding:14px 15px;border-bottom:1px solid var(--edge)}',
  'body.punch .pt-row{border-bottom-color:var(--panel)}',
  '.pt-row.on{box-shadow:inset 3px 0 0 var(--c)}',
  '.pt-nm{font-size:15px;font-weight:600;color:var(--ink)}',
  '.pt-d{margin:4px 0 0;font-size:13px;line-height:1.55;color:var(--mid)}',
  '.pt-n{font-size:13px;color:var(--mid)}',
  '.pt-n b{font-family:var(--num);font-variant-numeric:tabular-nums;font-size:20px;font-weight:500;color:var(--ink);margin-right:2px}',
  '.pt-w{font-size:12.5px;color:var(--dim);margin-top:2px}',
  '.pt-bar{height:6px;border-radius:3px;background:var(--sunk);margin-top:8px;overflow:hidden}',
  '.pt-bar i{display:block;height:100%;border-radius:3px;background:color-mix(in srgb,var(--c) 70%,var(--mid))}',
  '.pt-pr{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:9px}',
  '.pt-pr span{font-size:12px;font-weight:600;color:var(--dim);letter-spacing:.06em}',
  '.pt-pr b{font-size:13.5px;font-weight:400;color:var(--ink);text-align:right}',
  '.pt-go{display:flex;justify-content:flex-end}',
  '.pt-go .btn{min-height:var(--tap);white-space:nowrap}',
  '.pt-now{font-size:13px;color:var(--ink);padding:0 4px}',
  '.pt-grp .ac-gf p{margin:0 0 6px}',
  '.pt-grp .ac-gf p:last-of-type{margin-bottom:0}',
  '.pt-acts{margin-top:10px}',
  '.pt-acts .btn{min-height:var(--tap)}',
  /* ONE COLUMN ON A PHONE. The first cut put price beside the figure and
     squeezed "400 patterns a month" onto three lines, measured at 390. */
  '@media (max-width:760px){',
  ' .pt-row{grid-template-columns:1fr;gap:10px}',
  ' .pt-go{justify-content:stretch}',
  ' .pt-go .btn{width:100%}',
  ' .pt-now{padding:0}',
  ' .pt-go:empty{display:none}}'].join('\n');
 document.head.appendChild(st);}
