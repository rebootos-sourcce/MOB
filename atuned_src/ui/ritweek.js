/* ============================================================
   THE RITUAL PAGE AS A CENTRE AND A RAIL, 21 November. The layout half of
   the 18 November rebuild, approved; the six pieces that did not wait on the
   approval landed at d04c0dd8 and 86cd2823 (ui/ritbank.js says what each is).

   His words, 18 November, the spec for this file: "I want the actions that
   the user is supposed to do as blocks under the days of the week, sorted by
   the action color or type. Some are affirmations, some are actions, some may
   be meditations ... everything beneath that, where it says done, planned,
   missed, the rituals, the affirmations, that can go away. You can move the
   challenges to the very top above the week, so it's front and center. Same
   with the goal."

   A FIRST CUT OF THIS WAS BUILT ON 18 NOVEMBER and never merged
   (exec/ritual-week, 002c0741). Main then grew its own shared card, pop-up
   and writer in ui/ritbank.js, so that branch's second pop-up and second card
   could not come across: two cards for one practice is the defect ritbank.js
   exists to close. What is taken from it is the kind table, re-read against
   every practice's own text, and the top row. Everything that opens goes
   through ritBankOpen.

   WHAT THIS FILE OWNS.
     kinds        the four kinds of act, their colour and their mark, and the
                  kind of every practice in the library, by hand.
     the top row  the Goal and the challenges, ritTopHtml.
     the look     of both, ritWeekCss.
   ============================================================ */

/* ---------------- the four kinds ----------------
   Each kind is a physical act and carries its one sentence on hover and tap,
   the unpack rule. Colour on this page means the kind now, everywhere: the
   blocks on the week, the Called for cards and the key over the week. The
   seat keeps its own small mark, so where in the body is not lost, it just
   stops being the fill. Each kind also has its own mark, one ring and one
   stroke, ring not fill, so the kind is never carried by colour alone. */
var RIT_KINDS=[
 {k:'aff', nm:'Affirmation', says:'A line you say out loud.', ic:'<circle cx="11" cy="12" r="7"/><path d="M18 12h4"/>'},
 {k:'act', nm:'Action', says:'You do something with your body or with another person.', ic:'<circle cx="12" cy="12" r="7"/><path d="M7 17L17 7"/>'},
 {k:'med', nm:'Meditation', says:'You hold your attention on one thing, the breath included.', ic:'<circle cx="12" cy="12" r="7"/><path d="M9 12h6"/>'},
 {k:'rel', nm:'Release', says:'You let go of charge a place in your body is holding.', ic:'<circle cx="12" cy="13" r="7"/><path d="M12 13V2"/>'},
 /* A FIFTH KIND, 22 November, for the law of the week (ui/ritlaw.js): three
    questions about one law on an eleven point scale. Each of the four above
    is defined by a physical act, and this is none of them. Action's own
    sentence says the body or another person, and answering how often you
    stop at enough is neither, so filing it there would print a false
    sentence on its hover. It is not attention held on one thing either. The
    word is the Intake page's own: a law with three answers "is measured".
    Its mark is the ring with a needle, a gauge read once. week:false keeps it
    out of the week's key, because it is never a block on a day; its card
    carries its own word and sentence, the unpack rule. */
 {k:'msr', nm:'Measure', says:'You answer three questions about one law, and the law is measured.', ic:'<circle cx="12" cy="12" r="7"/><path d="M12 12l4-4"/>', week:false}];
var RIT_KIND_ORD={aff:0, act:1, med:2, rel:3, msr:4};
/* EVERY PRACTICE'S KIND, BY HAND, read off its own how text in
   engine/data/practice.js, never off its track: a track is a topic and not an
   act. Sitting with the attention held on the breath, a point, a sound or a
   feeling is a Meditation. Doing or saying something, to the body or to
   another person, is an Action. A practice whose own words are to stay with
   charge until it goes (resist, observer, hardtrauma, superego) is a Release.
   No practice is an Affirmation: affirmations are the set ritAffirm writes.
   Changed from the 18 November table on its text: listen was Action, and its
   how is "attend to environmental sound ... no naming", which is a
   meditation; resist, observer, hardtrauma and superego were Meditation, and
   each one's how says to stay until the charge shifts or to run the release.
   A practice missing here has no kind, and tests/ritkind.js fails on it the
   day it lands rather than drawing it in a guessed colour. */
var RIT_KIND_OF={
 escan:'med', box:'med', slow:'med', sig:'med', sysbreath:'med', resist:'rel', truth:'med', heartpt:'med',
 noting:'med', listen:'med', observer:'rel', detect:'med', hands:'med', hardtrauma:'rel', superego:'rel',
 chakra:'med', candle:'med',
 given:'act', offered:'med', onerule:'act', samecut:'act', meetit:'med', letmove:'act', linehold:'act', stopone:'act',
 il_need:'act', il_alone:'act', re_changed:'act', re_jaw:'act', de_enough:'act', de_pull:'med',
 or_plan:'act', or_stand:'act', po_small:'act', po_own:'act', pe_name:'med', pe_match:'med',
 tr_land:'med', tr_tell:'act', ch_move:'act', ch_ten:'act', fl_call:'act', fl_other:'act',
 al_said:'act', al_owe:'act', ho_wait:'act', ho_open:'med', sa_hand:'act', sa_name:'act',
 tu_plain:'act', tu_end:'act', na_tend:'act', na_season:'med'};
function ritKind(k){for(var i=0;i<RIT_KINDS.length;i++)if(RIT_KINDS[i].k===k)return RIT_KINDS[i]; return RIT_KINDS[2];}
/* a plan, a record entry, a suggestion or a schedule block. An affirmation
   row is an Affirmation and a challenge row an Action. A plan tied to a held
   place (rel) is a Release whatever its steps, because the schedule is the
   release; anything else is the kind of its first step, the act a person
   starts with. */
function ritKindOf(x){
 if(!x)return 'med';
 if(x.sc)return x.sc.kind==='aff'?'aff':'act';
 if(x.rel!=null)return 'rel';
 return RIT_KIND_OF[(x.steps&&x.steps[0])||x.k]||'med';}
function ritKindCol(k){return 'var(--kd-'+(RIT_KIND_ORD[k]==null?'med':k)+')';}
function ritKindIc(k,cls){
 return '<svg viewBox="0 0 24 24" class="'+(cls||'rv-kic')+'" aria-hidden="true">'+ritKind(k).ic+'</svg>';}
/* the kind's chip: the mark, then the word, carrying the sentence */
function ritKindChip(k){
 var K=ritKind(k);
 return '<span class="rv-kch" style="--c:'+ritKindCol(K.k)+'"'+rvTip(K.nm,K.says)+' role="img" aria-label="'+esc(K.nm+'. '+K.says)+'">'
  +ritKindIc(K.k)+'<span>'+esc(K.nm)+'</span></span>';}
/* the key for the four, in the Week's head. It replaces nothing: the Done,
   Planned, Missed key went on 18 November, and a block's state is on its
   press. Each word is its own carrier. */
function ritKindKeyHtml(){
 return '<div class="rv-kkey" role="group" aria-label="Kinds">'+RIT_KINDS.filter(function(K){return K.week!==false;})
  .map(function(K){return ritKindChip(K.k);}).join('')+'</div>';}
/* A DAY'S BLOCKS IN KIND ORDER, Affirmation, Action, Meditation, Release, so
   the colours line up in rows across the week the way he drew them; inside a
   kind a set time comes before any time, then the order they were read. Each
   block is given its kind and its kind's colour here, the one place, so the
   week, a day's list and a block's pop-up agree. */
function ritWeekBlocks(segs,d,st){
 segs.forEach(function(s,i){
  var p=s.sc?null:(s.p||(typeof ritSashPlan==='function'?ritSashPlan(s,d,st):null));
  s.kind=s.sc?ritKindOf(s):ritKindOf(p||s.x); s.at=(p&&p.at)||(s.sc&&s.sc.at)||''; s.col=ritKindCol(s.kind); s.o=i;});
 return segs.slice().sort(function(A,B){
  var ka=RIT_KIND_ORD[A.kind], kb=RIT_KIND_ORD[B.kind]; if(ka!==kb)return ka-kb;
  var ta=A.at||'99', tb=B.at||'99'; return ta<tb?-1:ta>tb?1:A.o-B.o;});}

/* ---------------- the top row: the Goal and the challenges ----------------
   "move the challenges to the very top above the week, so it's front and
   center. Same with the goal." One row of four equal tiles, the Goal first
   and then up to three challenges, centred when fewer and never stretched,
   two by two on a phone. Symbol first, a short header carrying its meaning
   on the press, then the name, and no body text (16 November). The name
   opens the pop-up (ui/ritbank.js), which is where the sentences went. */
var RIT_TOP_SAY={
 goal:'Who your avatar is becoming, and what is held in the way.',
 chal:'One act against a pattern your reading shows running.'};
function ritTopHtml(st){
 var C=ritChallenge(st), tiles=[ritGoalTile(st)].concat(C.map(function(c){return ritChalTile(c,st);}));
 /* ALWAYS FOUR, round SW, his words: "At the very top, I want 4 fields
    always consistent." ritChallenge offers at most three, and fewer than
    that on a light reading, which used to centre the row on however many it
    had (auto-fit, ritWeekCss below) and leave an asymmetric gap down one
    side on every profile but the heaviest, the symmetry ruling by name:
    nothing is laid out pressed to one edge with empty space answering to
    nobody. A missing slot is padded with its own honest empty state, never
    an invented challenge: no data, a dash, and the real reason on hover. */
 while(tiles.length<4)tiles.push(ritChalEmptyTile());
 return '<section class="rv-sec rv-top" aria-label="Goal and challenges"><div class="rv-ttls">'+tiles.join('')+'</div></section>';}
/* THE FOURTH SLOT WHEN NOTHING FILLS IT. Dimmed, because it is not a thing
   a person can act on, only a seat waiting for a pattern a heavier reading
   would name; the dash is the house's own mark for nothing measured
   (COPY.md Value), and the meaning rides the header's tooltip, never a
   pasted sentence, the same unpack rule every other tile on this row keeps. */
function ritChalEmptyTile(){
 return '<div class="rv-ttl rv-tchal rv-tempty" style="--c:var(--dim)">'
  +ritTileHead('Challenge','Opens when your reading shows another pattern running.',ritKindIc('act','rv-tic'))
  +'<span class="rv-tnm" aria-label="Challenge: none running">–</span><span class="rv-tact"></span></div>';}
function ritTileHead(nm,says,ic){
 return '<span class="rv-tlab"'+rvTip(nm,says)+'>'+ic+esc(nm)+'</span>';}
function ritGoalTile(st){
 var bc=ritBecoming(), pairs=(CURP&&CURP.avatar&&CURP.avatar.pairs)||[], last=null;
 for(var i=pairs.length-1;i>=0;i--)if(pairs[i]&&pairs[i].be&&String(pairs[i].be).trim()){last=pairs[i];break;}
 var head=function(col,glyph){return ritTileHead('Goal',RIT_TOP_SAY.goal,glyph||ritIc('ring','rv-tic'));};
 /* nothing read and no avatar line: the one press is the way in */
 if(!bc&&!last){
  if(st.r.unread)return '<div class="rv-ttl rv-tgoal" style="--c:var(--accent)">'+head()
   +'<span class="rv-tnm">Not read yet</span><span class="rv-tact"><button type="button" class="btn pri" data-act="go-story">Write a story</button></span></div>';
  return '<div class="rv-ttl rv-tgoal" style="--c:var(--accent)">'+head()
   +'<button type="button" class="rv-tnm rv-tpr" data-act="pgoal" aria-label="Goal: none written yet. Open">–</button><span class="rv-tact"></span></div>';}
 var be=String((bc?bc.be:last.be)||'').trim().replace(/^"+|"+$/g,''), iam=ritIAm(be)||be;
 var seat=bc?bc.seat:'', col=seat?seatCol(seat):'var(--accent)';
 var on=bc&&st.act.some(function(p){return p.rel===bc.n.i;});
 var glyph=seat&&SEATGLYPH[seat]?'<svg viewBox="0 0 24 24" class="rv-tic" aria-hidden="true">'+SEATGLYPH[seat]+'</svg>':null;
 /* the line is the person's own and is quoted, never marked as Source AI's */
 return '<div class="rv-ttl rv-tgoal" style="--c:'+col+'">'+head(col,glyph)
  +'<button type="button" class="rv-tnm rv-tpr" data-act="pgoal" aria-label="'+esc('Goal: '+iam+'. Open')+'">'+esc(iam)+'</button>'
  +'<span class="rv-tact">'+(!bc?'':on?'<span class="rv-tsub">Release active</span>'
   :'<button type="button" class="btn pri" data-act="why" data-d="7" aria-label="'+esc('Release '+String(bc.n.k).toLowerCase()+', each day for a week')+'">Release</button>')+'</span></div>';}
/* five words or fewer on a tile, the rest on the press */
function ritChalName(nm){var w=String(nm||'').split(/\s+/); return w.length>5?w.slice(0,5).join(' ')+'…':String(nm||'');}
function ritChalTile(c,st){
 var M=st._mo=st._mo||ritMore(), on=ritDayOn(M.did,st.today,c.id), col=c.b?seatCol(c.b):'var(--accent)';
 var r=typeof ritSchedOf==='function'?ritSchedOf('ch:'+c.id):null, off=r&&ritMissOffer(r,st);
 return '<div class="rv-ttl rv-tchal'+(on?' rv-on':'')+'" style="--c:'+col+'">'
  +ritTileHead('Challenge',RIT_TOP_SAY.chal,ritKindIc('act','rv-tic'))
  +'<button type="button" class="rv-tnm rv-tpr" data-act="chal-set" data-id="'+esc('ch:'+c.id)+'" aria-label="'+esc(c.nm+'. Open')+'">'+esc(ritChalName(c.nm))+'</button>'
  /* THE DID TICK RIDES THE TILE as well as the pop-up: it was on the Today
     list's row, and that list is gone. The same press and writer. */
  +'<span class="rv-tact"><button type="button" class="rv-log rv-ttick" data-act="did" data-id="'+esc(c.id)+'" aria-pressed="'+on+'" aria-label="'
  +esc(on?'Done today. Press to take it off':'Mark done today: '+c.nm)+'">'+ritTickHtml(on,col)+'</button>'
  /* IF I MISS stays the one neutral press, on the tile now (ritMissOfferHtml's
     rule), and opens the challenge with the why question first */
  +(off?'<button type="button" class="rv-mof" data-act="miss-why" data-id="'+esc('ch:'+c.id)+'">'+ritIc('ring')+'Why?</button>'
   :'<span class="rv-tsub">'+(on?'Done today':'Not yet today')+'</span>')+'</span></div>';}

/* ---------------- the affirmations' way in ----------------
   The Today card carried the affirmations and the clock that set their days,
   and it is gone. Their said rings live in their pop-up (ritPopAff, ui/
   ritbank.js), and a pop-up needs a door: before the set is on the week
   there is no block to press. So the set leads Called for, in the card's own
   shape and classes, the Affirmation kind's colour and word, its name the
   press that opens the pop-up. It is not a second Called for card: it has no
   Add and no Dismiss, because the set is not a practice to start or turn
   down, and it is not dragged, because its days are set in its pop-up. It
   is not an rv-sg1 either: every reader of a card takes its place in that
   list as its place in RIT.sug, and this row is not in RIT.sug. Lit
   once the set is on the week, the rule the old clock kept. */
function ritAffCardHtml(st){
 var A=ritAffirm(st); if(!A.length)return '';
 var on=!!ritSchedOf('aff'), K=ritKind('aff');
 return '<li class="rv-affc'+(on?' rv-on':'')+'" style="--c:'+ritKindCol('aff')+'" data-kind="aff">'
  +'<div class="rv-sgh"><button type="button" class="rv-sgn rv-bko'+(on?' rv-on':'')+'" data-act="aff-set" aria-label="'
  +esc('Affirmations, '+(on?'on your week. Say them, change the days':'not on your week yet. Say them, set the days'))+'">Affirmations</button></div>'
  +'<div class="rv-sgo"><span class="rv-sgk"'+rvTip(K.nm,K.says)+'>'+ritKindIc('aff')+esc(K.nm)+'</span>'
  +'<span class="rv-sgm">'+(on?esc(ritOften(ritSchedOf('aff').on)):'Not on your week yet')+'</span></div></li>';}

/* ---------------- the look ---------------- */
function ritWeekCss(){
 if(document.getElementById('ritwk-css'))return;
 var st=document.createElement('style'); st.id='ritwk-css';
 st.textContent=[
  /* the four kinds, dark first, then darker inks for the light lightings,
     each at three to one or more against its ground */
  ':root{--kd-aff:#D19255;--kd-act:#C4635E;--kd-med:#8296DB;--kd-rel:#6FC5A3;--kd-msr:#B08CD0}',
  'body.snow,body.glasswhite,body.lumen #lpanel,body.lumen #rpanel,body.lumen #sheet{--kd-aff:#9A6435;--kd-act:#A4473F;--kd-med:#5A6DB0;--kd-rel:#3F8068;--kd-msr:#7B5A9F}',
  '.rv-kic{width:18px;height:18px;flex:0 0 auto;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-kch{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px 0 7px;border-radius:999px;color:var(--ink);font-size:13px;',
  ' background:color-mix(in srgb,var(--c) 16%,transparent);cursor:help}',
  '.rv-kch .rv-kic{color:var(--c)}',
  '.rv-kch:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-kkey{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}',
  /* the Called for card's kind leads with the kind's own mark, so the dot it
     led with when the fill was the track goes */
  '.rv-sg1 .rv-sgk::before,.rv-affc .rv-sgk::before{content:none}',
  '.rv-affc .rv-sgk .rv-kic{width:16px;height:16px;color:var(--c)}',
  /* the affirmations' row wears the card's shape, ritAffCardHtml says why */
  '.rv-sugl>.rv-affc{display:flex;flex-direction:column;gap:8px;padding:12px 12px 12px 14px;border-radius:12px;background:color-mix(in srgb,var(--c) 22%,var(--panel-2))}',
  '.rv-affc .rv-bko{padding:0;border:0;background:none;font:inherit;font-size:14px;font-weight:650;line-height:1.3;color:var(--ink);text-align:left;cursor:pointer;min-height:48px}',
  '.rv-affc .rv-bko:hover{text-decoration:underline;text-underline-offset:3px}',
  '.rv-sg1 .rv-sgk .rv-kic{width:16px;height:16px;color:var(--c)}',
  /* THE TOP ROW: four equal tiles, one even gap, ALWAYS four now, round SW,
     so the row is never shorter than four and never centred on a remainder:
     ritTopHtml pads a missing challenge with its own dimmed tile rather
     than leaving the grid to guess how to lay out three or two or one. */
  '.rv-top{padding:16px}',
  '.rv-ttls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}',
  '.rv-tempty{opacity:.55}',
  '.rv-ttl{box-sizing:border-box;display:flex;flex-direction:column;gap:8px;min-width:0;min-height:148px;padding:14px 16px;border-radius:14px;',
  ' background:color-mix(in srgb,var(--c) 14%,var(--panel-2))}',
  '.rv-tlab{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;min-height:28px;font-size:12.5px;font-weight:600;color:var(--mid);cursor:help}',
  '.rv-tlab:focus-visible,.rv-tnm:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.rv-tic{width:20px;height:20px;flex:0 0 auto;fill:none;stroke:var(--c);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.rv-tnm{flex:1 1 auto;min-height:44px;margin:0;padding:0;border:0;background:none;font:inherit;font-size:15px;font-weight:600;line-height:1.35;',
  ' color:var(--ink);text-align:left;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}',
  'button.rv-tnm{cursor:pointer}',
  'button.rv-tnm:hover{color:var(--c)}',
  '.rv-tact{display:flex;align-items:center;gap:8px;min-height:44px}',
  '.rv-tact .btn{min-height:44px}',
  '.rv-tsub{font-size:13px;color:var(--mid)}',
  '.rv-ttick{flex:0 0 44px;width:44px;height:44px;padding:0;border:0;background:none;cursor:pointer}',
  '.rv-ttick svg{width:40px;height:40px}',
  '.rv-ttl .rv-mof{min-height:44px;margin:0}',
  '@container (max-width:639px){.rv .rv-ttls{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px} .rv .rv-top{padding:12px}}',
  /* THE WEEK'S BLOCKS: the kind's colour, its mark and a short name on one
     line, the seat's small mark at the right edge; under a narrow column the
     mark alone. Planned is the kind's edge over a light tint, done a deeper
     tint and a check, missed a dashed dim edge, never red. */
  /* SV17's grammar is kept, so the three states read as they always did:
     done is the solid fill with dark ink, planned the tint and edge, missed
     the dashed edge. Only the colour moved from the seat to the kind. The
     stagger SV17 gave a heavy day is dropped: blocks are read in rows of a
     kind across the week now, and a stagger breaks the row. */
  '.rv .rv-wdl>li{--o:0px;container-type:inline-size}',
  '.rv-wch.rv-blk{display:flex;align-items:center;justify-content:flex-start;gap:6px;padding:0 8px;text-align:left}',
  '.rv-wch.rv-blk>svg.rv-kic{width:20px;height:20px}',
  '.rv-bn{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600;color:var(--ink)}',
  '.rv-wch-done .rv-bn{color:rgba(0,0,0,.82)}',
  '.rv-wch.rv-blk svg.rv-bs{flex:0 0 auto;width:13px;height:13px;stroke-width:2.2;opacity:.85}',
  /* under a column too narrow for a name, the kind's mark alone, centred.
     The container is the block's list item and not the block, because a
     container cannot restyle itself and the centring is the block's own:
     measured, a block is 84 wide in a desk column and 120 on a phone row */
  '@container (max-width:100px){.rv-bn,.rv-wch.rv-blk svg.rv-bs{display:none} .rv-wch.rv-blk{justify-content:center;padding:0}}',
  '.rv .rv-wkg-now .rv-wd1:not(.rv-now) .rv-wch{opacity:.72}',
  /* CALLED FOR IN THE CENTRE, a row of short cards under the week so a drag
     onto a day is a short reach. Two columns on a desk, one on a phone, one
     even gap. */
  '.rv-cfw .rv-sugl{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}',
  /* the rail's span picker is one dropdown and not ten pills: the rail is
     compact, and the ten spans are one choice */
  '.rv-spsel{display:inline-flex;align-items:center;position:relative}',
  '.rv-spsel select{appearance:none;min-height:44px;padding:0 34px 0 12px;border-radius:10px;border:1px solid var(--edge-2);background:var(--panel-2);color:var(--ink);font:inherit;font-size:13.5px;cursor:pointer}',
  '.rv-spsel .rv-ic{position:absolute;right:10px;width:14px;height:14px;pointer-events:none}',
  '.rv-spsel select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  /* THE GOAL'S POP-UP holds the Goal card's own markup and the chain. The
     sheet already names it, so the card's own head and line are not drawn a
     second time; and the chain, three stops across on a stage, runs down in
     a 480 pixel sheet, its arrows turned to point down, so nothing is cut */
  '.rv-pgoal{display:flex;flex-direction:column;gap:12px}',
  '.rv-pgoal .rv-sec{margin:0;padding:0;background:none;border:0;box-shadow:none}',
  '.rv-pgoal .rv-sec>.rv-hd,.rv-pgoal .rv-sec>.rv-mean{display:none}',
  '.rv-pgoal .rv-chain{grid-template-columns:minmax(0,1fr);margin:0}',
  '.rv-pgoal .rv-arr{height:16px;transform:rotate(90deg)}',
  /* the pop-up's running controls, one row, an even gap */
  '.rv-prun{display:flex;flex-wrap:wrap;gap:8px}',
  '.rv-prun .btn,.rv-prun .rv-tmr{min-height:44px}',
  '.sh-act .rv-prun{display:contents}',
  '.rv-pticks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.rv-ptk{display:flex;align-items:center;gap:10px;padding:2px 12px 2px 2px;border-radius:12px;background:color-mix(in srgb,var(--c) 9%,var(--panel-2))}',
  '.rv-ptk.rv-on{background:color-mix(in srgb,var(--c) 22%,var(--panel-2))}',
  '.rv-ptk .rv-log{flex:0 0 44px;width:44px;height:44px;padding:0;border:0;background:none;cursor:pointer}',
  '.rv-ptk .rv-log svg{width:40px;height:40px}',
  '.rv-ptk .rv-ptq{font-size:14.5px;line-height:1.4;color:var(--ink)}'
 ].join('\n');
 document.head.appendChild(st);}
