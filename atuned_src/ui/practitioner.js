/* ============================================================
   PRACTITIONER MODE. A switch, a door and a sketch. Round LL.

   His words, and they draw the line this file stops at: "Add a practitioner
   mode to the profile. If I turn it on, it adds a new tab item called
   practitioner... I can see my customers, and then I can view their profile.
   I don't want that set up now. The technology, what I do want is the
   profile toggle on and off. The profile tab item being our main nav item
   being added when I toggle it on and a very rough framework."

   So three things and no fourth. The switch is accTog in ui/account.js,
   stored as a DEVICE setting through pracSwitch below and never on a profile,
   see pracOn.
   The door is the fifth section in the bar, written shut into the document
   and opened here. The sketch is the page behind it.

   NOTHING HERE READS ANOTHER PERSON'S RECORD WITHOUT THEIR OWN YES. Sharing
   is ui/praclive.js's, against the real server, consent first on the
   client's own device (C1), a visible list of who has sight (P3, and C2 on
   their own Privacy page), and one press to take it back (Disconnect). The
   worked examples below are the owner's own roster and carry no such grant
   because nothing about them is anybody's record.
   ============================================================ */
/* A DEVICE SETTING, THE SAME FIX AS THE SOUND SWITCH, 2 October. This was
   stored on the profile through uiSet, which saves the profile, so on a worked
   example the switch slid on, the save was refused with "Nothing saved on a
   worked example.", the door never opened and the person was left looking at a
   switch that said on over a menu that said nothing. Whether this browser
   shows the Practitioner section is a fact about the person using it, not
   about whose record is loaded, and a worked example has no record to write.

   The device key wins once written. A device never asked reads the profile's
   own ui.practitioner, which is what a person who turned it on before this
   existed wrote, so nobody loses the door to an update. PRAC_SESSION is what
   was asked for this visit, first, so a browser that would not keep the
   setting still does what the switch says until the page is closed. */
var PRAC_SESSION=null;
function pracOn(){
 if(PRAC_SESSION!==null)return PRAC_SESSION;
 var d=(typeof devGet==='function')?devGet('practitioner'):null;
 if(d!==null)return d===true;
 return !!(typeof CURP!=='undefined'&&CURP&&CURP.ui&&CURP.ui.practitioner);}
/* the one writer. It reports a store that will not keep it, in words that are
   true, and opens or shuts the door either way, because what a person sees is
   the state and not the write. */
function pracSwitch(on){
 PRAC_SESSION=!!on;
 var r=(typeof devSet==='function')?devSet('practitioner',!!on):{ok:false,err:'NoStore'};
 if(r.ok)PRAC_SESSION=null;
 if(typeof applyUiPrefs==='function')applyUiPrefs(); else pracPaint();
 if(typeof status==='function'&&!r.ok)
  status('Practitioner mode is '+(on?'on':'off')+' for this visit only. This browser would not keep the setting.','fail');
 return r.ok;}

/* THE SURFACE'S OWN RULES, injected once, the way accProfCss carries the
   profiles section's, because the shell stylesheet is held by another seat.

   The first line is the one head.html asks every new section for: "a section
   key with no line here is not hidden, it shows every group at once." With
   Practitioner pressed and no line, all five groups showed in the second
   row. It is only ever needed once start up has written data-sec onto the
   bar, which is after this has run, so carrying it here loses nothing a
   stylesheet line would have had.

   REBUILT, PHASE 1 OF THE PRACTITIONER PAGE'S OWN REDRAW, on the owner's
   own ruling (CLAUDE.md quotes it verbatim): the left rail comes back,
   carrying the client list that used to sit in the centre column; the right
   rail carries three sections now instead of Selection alone, What is
   running in front of it and Notes behind it; the centre is the client's
   name and their body figure and nothing else. The three column grid this
   replaces (.pr-cols/.pr-mid/.pr-list-col and the ring card rules under
   them) is gone with it: a rail section already folds, already has a tap
   floor on its header and already keeps its own scroll, so building a
   second set of the same mechanics inside the page was three ways to do one
   job, and the two drifted the day the rail's own padding changed and this
   page's copy of it did not. */
function pracCss(){
 if(document.getElementById('pr-css'))return;
 var st=document.createElement('style'); st.id='pr-css';
 st.textContent=[
  /* one literal and not two: split across two, the voice gate read the first
     half as a figure's label standing over the second */
  '@media not all and (max-width:720px){.top[data-sec="practitioner"] #tabbar .tabgrp:not([data-sec="practitioner"]){display:none}}',
  /* LEFT RAIL: ONLY THE CLIENT LIST. Every other .lsec in #lpanel is built
     for the Field or the Ritual page and has no job here; #flownew is not
     a .lsec at all (ui/ritual.js owns it) and this rule still has to catch
     it, the same way the Field's own practitioner-adjacent rules do. */
  'body.tab-prac .mid #lpanel>*:not(.lfold):not([data-sec="prlist"]){display:none!important}',
  /* RIGHT RAIL: WHAT IS RUNNING, SELECTION, NOTES, IN THAT ORDER, his words:
     "the right rail is our system information window." The three sections
     sit in the document in that order already (shell/body.html), so this
     rule only has to hide every stranger, never reorder anything. */
  'body.tab-prac #rpanel>*:not(.rfold):not([data-sec="prrun"]):not([data-sec="sel"]):not([data-sec="prnotes"]){display:none!important}',
  /* AND HIDDEN ON EVERY OTHER TAB, the half of the rule a one-sided
     ":not([data-sec=...])" cannot carry: #prrun and #prnotes are real
     .lsec rows that sit in the document all the time (shell/body.html), so
     off this page their own fold header still has height even folded shut,
     and tests/insightrail.js caught both printing after Selection on Field,
     Energy and Compass, which is the rule against anything living after
     Selection (CLAUDE.md, 18 November) this page is the one named exception
     to, Notes included, and only on its own tab. The same shape every other
     one-tab rail section already uses (".av-rail" on avrel/avbec, head.html). */
  'body:not(.tab-prac) [data-sec="prrun"],body:not(.tab-prac) [data-sec="prnotes"]{display:none!important}',
  /* BOTH RAILS KEEP THEIR USUAL TRACKS, open or folded: this page reuses the
     grid every other three-column surface already has rather than drawing
     a second one, which is the asymmetry a design review would catch on any
     other page and is caught here before it ships. */
  '@media (min-width:1181px){'
   +'body.tab-prac .mid{grid-template-columns:336px minmax(0,1fr) 336px}'
   +'body.lshut.tab-prac .mid{grid-template-columns:58px minmax(0,1fr) 336px}'
   +'body.rshut.tab-prac .mid{grid-template-columns:336px minmax(0,1fr) 58px}'
   +'body.lshut.rshut.tab-prac .mid{grid-template-columns:58px minmax(0,1fr) 58px}}',
  /* the Selection empty line names what to press on this page and not the
     Field's address, law, saboteur and core, none of which is here */
  'body:not(.tab-prac) #pr-selnone{display:none}',
  'body.tab-prac #rdrill-none{display:none!important}',
  '#rdrill[style*="block"]~#pr-selnone{display:none}',
  '.pr-wrap{display:flex;flex-direction:column;gap:14px;width:100%;max-width:640px;margin:0 auto;padding:4px 2px 28px}',
  /* THE SORT, A CENTRED PAIR, ruled: "Attention" first because that is the
     direction a practitioner actually works a roster in, DECISIONS.md's
     own rule for a group view. One control sorts both the real clients and
     the examples beneath them, each within its own group. */
  '.pr-sort{display:flex;align-items:center;justify-content:center;gap:8px;margin:2px 0 12px}',
  '.pr-sort button{min-width:44px;min-height:var(--tap);padding:0 16px;border-radius:999px;'
   +'border:1px solid var(--edge);background:transparent;color:var(--dim);font-family:var(--sans);'
   +'font-size:13px;cursor:pointer}',
  '.pr-sort button[aria-pressed="true"]{color:var(--ink);border-color:var(--c);background:var(--panel-2)}',
  '.pr-rail-h{display:flex;align-items:center;gap:10px;margin:18px 2px 8px;font-family:var(--sans);'
   +'font-size:13px;font-weight:600;color:var(--ink)}',
  '.pr-rail-h:first-of-type{margin-top:4px}',
  '.pr-rail-h button{margin-left:auto;min-height:var(--tap);min-width:44px;padding:0 12px;border-radius:999px;'
   +'border:1px solid var(--edge);background:transparent;color:var(--ink);font-family:var(--sans);'
   +'font-size:12.5px;display:inline-flex;align-items:center;gap:6px;cursor:pointer}',
  '.pr-rail-h button svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
  '.pr-list-col{display:flex;flex-direction:column;gap:0}',
  '.pr-client{width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid var(--edge);'
   +'display:flex;gap:10px;align-items:flex-start;padding:10px 4px;min-height:56px;cursor:pointer;'
   +'font-family:var(--sans)}',
  '.pr-client:last-child{border-bottom:0}',
  '.pr-client:hover{background:var(--panel-2)}',
  '.pr-client.on{box-shadow:inset 3px 0 0 var(--c);background:var(--panel-2)}',
  '.pr-client[aria-disabled="true"]{cursor:default;color:var(--mid)}',
  /* THE ROW CIRCLE IS A TINY COPY OF THE CENTRE RING (pracMiniRing), one arc
     a seat, so the shape of a client's field reads at a glance, closed. A
     client with nothing published yet, or a pending or ended row, wears the
     link glyph this page's own icon set already carries instead. */
  '.pr-av{width:30px;height:30px;flex:0 0 auto}',
  '.pr-miniring{width:100%;height:100%;display:block}',
  '.pr-cinfo{min-width:0;flex:1 1 auto;display:flex;flex-direction:column;gap:2px}',
  '.pr-cnm{display:block;font-size:14px;color:var(--ink);font-weight:500}',
  '.pr-cnm em{font-style:normal;font-weight:400;color:var(--dim)}',
  /* THE ONE VALUE, ruled: a place word, never a tier or a score, in the seat's
     own colour, its meaning on a hover and never printed beside it. A clock
     glyph and "waiting" stand in for a pending connection, and "ended" for
     one that has closed; a dash is an unread field, never a blank cell. */
  '.pr-cst{font-size:13px;line-height:1.5;margin-top:1px;display:flex;align-items:center;gap:5px}',
  '.pr-cst svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;color:var(--dim)}',
  '.pr-empty{padding:13px 4px;font-size:14px;color:var(--dim);line-height:1.6}',
  /* THE CENTRE: NAME, THEN THE FIGURE, NOTHING ELSE. The ring card, the lead
     paragraph under it and the tab switcher between Summary, Body and Field
     all moved or were cut; what is running moved to the rail (pracRunPaint)
     and the figure is the one reading left here. */
  '.pr-centre{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;max-width:640px;margin:0 auto;padding:10px 2px 30px}',
  '.pr-centre h2{margin:0;text-align:center}',
  '.pr-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}',
  '.pr-conn{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0;border:0;'
   +'background:transparent;cursor:pointer;border-radius:999px}',
  '.pr-fig-wrap{position:relative;width:100%;max-width:560px}',
  '.pr-fig-wrap svg.pr-outline{display:block;width:100%;height:auto}',
  '.pr-fig-wrap svg.pr-outline path{fill:none;stroke:var(--edge-2);stroke-width:.5;stroke-opacity:.6}',
  '.pr-fig-cv{position:absolute;inset:0;width:100%;height:100%}',
  '.pr-fig-ov{position:absolute;inset:0;width:100%;height:100%}',
  '.pr-fig-ring{pointer-events:none}',
  /* THE HIT TARGET IS THE WHOLE DISK, not its stroke: a transparent fill with
     pointer-events:all catches a finger anywhere inside the circle, the way
     the Body page's own seat arcs widen a thin stroke into a 40 unit band to
     meet the same 44px floor (pracArcs, round QB). r is picked in viewBox
     units so it clears 22px of radius at the figure's narrowest rendered
     width, a 320px phone showing one 100-unit-wide view: see pracFigOverlay. */
  '.pr-fig-hit{cursor:pointer;pointer-events:all;fill:transparent}',
  '.pr-fig-hit:focus{outline:none}',
  '.pr-fig-hit.pr-sel{stroke:currentColor;stroke-opacity:.9!important}',
  '.pr-face{display:none;gap:8px;margin-top:8px}',
  '@media (max-width:900px){.pr-face{display:flex}}',
  '.pr-face button{min-width:44px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--edge);'
   +'background:transparent;color:var(--dim);font-family:var(--sans);font-size:13px;cursor:pointer}',
  '.pr-face button[aria-pressed="true"]{color:var(--ink);border-color:var(--c);background:var(--panel-2)}',
  '.pr-say{font-size:15px;line-height:1.65;color:var(--ink)}',
  '.pr-say p{margin:0 0 6px}.pr-say p:last-child{margin:0}',
  '.pr-figs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
  'button.lp-f{min-height:var(--tap);text-align:left;background:transparent;cursor:pointer;font-family:var(--sans)}',
  'button.lp-f:hover,.pr-pat:hover,.pr-day:hover,.pr-link:hover{background:var(--panel-2)}',
  '.pr-sel{box-shadow:inset 0 0 0 2px var(--accent)}',
  '.pr-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;justify-content:center}',
  '.pr-day{margin:0;width:100%;aspect-ratio:1;min-width:44px;min-height:44px;border-radius:var(--r-xs);'
   +'border:1px solid var(--edge);background:var(--sunk);display:flex;align-items:flex-end;justify-content:flex-end;'
   +'padding:3px 5px;box-sizing:border-box;font-family:var(--num);font-size:11px;color:var(--dim);'
   +'font-variant-numeric:tabular-nums}',
  'button.pr-day{cursor:pointer}',
  '.pr-day.st-completed{background:var(--c);border-color:var(--c);color:var(--bg)}',
  '.pr-day.st-partial{background:linear-gradient(to top,var(--c) 50%,var(--sunk) 50%);border-color:var(--c)}',
  '.pr-day.st-skipped{border-style:dashed;border-color:var(--mid);background:transparent}',
  /* a miss is struck through and not painted red: a missed day is a fact
     about a schedule, and alarm colour on it is a penalty the product rules out */
  '.pr-day.st-missed{background:linear-gradient(135deg,transparent 46%,var(--mid) 46%,var(--mid) 54%,transparent 54%);'
   +'border-color:var(--mid);color:var(--ink)}',
  '.pr-day.st-scheduled{background:transparent;border-color:var(--c)}',
  '.pr-pats{display:flex;flex-direction:column;gap:8px}',
  '.pr-pat{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:var(--tap);width:100%;'
   +'padding:8px 12px;border:1px solid var(--edge);border-radius:var(--r-s);background:transparent;cursor:pointer;'
   +'text-align:left;font-family:var(--sans)}',
  '.pr-pat .lp-st.lp-declined{border-style:dashed}',
  '.pr-link{background:transparent;border:0;border-bottom:1px dotted var(--mid);padding:0;min-height:var(--tap);'
   +'font:inherit;color:var(--ink);cursor:pointer}',
  '.pr-more{align-self:flex-start;min-height:var(--tap)}',
  '.pr-note-ta{width:100%;min-height:72px;background:var(--sunk);border:1px solid var(--edge);color:var(--ink);'
   +'border-radius:var(--r-xs);padding:9px 11px;font-family:var(--sans);font-size:14px;resize:vertical;'
   +'box-sizing:border-box}',
  '.pr-note-ta:focus{border-color:var(--accent)}',
  '.pr-note-item{padding:9px 0;border-bottom:1px solid var(--edge);font-size:13px;color:var(--ink);line-height:1.5}',
  '.pr-note-item:last-child{border-bottom:0}',
  '.pr-note-date{display:block;font-size:11.5px;color:var(--dim);margin-bottom:2px}',
  '.pr-note-form{padding:4px 0 0}',
  /* SENTENCE CASE, NEVER ALL CAPS, CLAUDE.md's voice rule: this read
     uppercase until tests/design.js gate 5 caught it, the same .ac-gh
     treatment (small, bold, dim, a little letter spacing) without the
     text-transform that broke the rule. */
  '.pr-run-sub{font-family:var(--sans);font-size:12.5px;font-weight:600;color:var(--dim);'
   +'letter-spacing:.02em;margin:16px 0 8px}',
  '.pr-run-sub:first-child{margin-top:0}',
  '.pr-meter{height:4px;border-radius:2px;background:var(--sunk);margin-top:7px;overflow:hidden}',
  '.pr-meter i{display:block;height:100%;border-radius:2px;background:var(--c)}'
 ].join('\n');
 document.head.appendChild(st);}

/* THE DOOR, and the one writer of it. Called by applyUiPrefs, so the switch
   and a change of profile both reach it, and once at start up, because
   applyUiPrefs itself does not run at start up and a door that came back
   shut after every reload would be the switch lying about its own state.

   Shut, a person cannot be left standing on the surface whose door just went,
   so they go to the Field, where the app opens. And the bar forgets it was
   in this section: Settings keeps the last section's tabs in sight, and with
   this section's group shut that row would otherwise be empty.

   THE ROW HAS TO MOVE WITH IT, and the first cut did not. Settings presses no
   section, so secAlign found nothing to measure and kept the offset it last
   had, which was Practitioner's: shot at 1600, Field, Intake, Compass and
   Masks sat at x 596, under where Practitioner had been and nowhere near
   Play. secAlign is the one measurement and measures only a pressed section,
   so Play is pressed for the length of one synchronous call and let go. No
   frame is painted between the two writes, so nothing can be seen to flash. */
function pracPaint(){
 var on=pracOn();
 pracCss();
 document.querySelectorAll('#secbar .secb[data-sec="practitioner"],#tabbar .tabgrp[data-sec="practitioner"]')
  .forEach(function(e){e.style.display=on?'':'none';});
 if(on)return;
 var top=document.querySelector('.top');
 /* the bar and the person go home, TABHOME in engine/core.js: Play and the
    Field while the app opened there, Discover since 23 October. Discover's
    one door is its section, so its row has no tab to line up and secAlign
    below returns without measuring, which is correct: nothing is left under
    the section that went. */
 if(top&&top.getAttribute('data-sec')==='practitioner'){
  var k=SECOF(TABHOME), pb=document.querySelector('#secbar .secb[data-sec="'+k+'"]');
  top.setAttribute('data-sec',k);
  if(pb&&typeof secAlign==='function'&&!document.querySelector('#secbar .secb[aria-pressed="true"]')){
   pb.setAttribute('aria-pressed','true'); secAlign(); pb.setAttribute('aria-pressed','false');}}
 if(typeof SEC_LAST!=='undefined')delete SEC_LAST.practitioner;
 if(S.tab===TAB.PRACTITIONER)setTab(TABHOME);}

/* ============================================================
   THE EXAMPLE ROSTER, round PT, kept whole by this rebuild. Built against
   the example roster, never a real person: there is no sign in, no store
   and no grant on this half of the page, and it still says so on every row.

   EVERY NUMBER ON THIS PAGE IS A REAL COMPUTE(), not a guess at one. The
   engine is a function of shared state (S, W, LAW_REC) and not of a profile
   argument, which CLAUDE.md names as the impure core and defers rewriting.
   Rather than duplicate its arithmetic a second time here, which would drift
   from the real engine the day either one changed, pracRead() below points
   that shared state at one example, calls the real compute(), copies out
   what the card needs, and puts the state back exactly as it found it
   before anything else can run. Nothing this file does is allowed to leave
   S, W or LAW_REC pointed at a client: the header's own profile picker, the
   Field and the Avatar all read the same shared state, and a practitioner
   opening a client must not silently become that client everywhere else in
   the app. The swap and the restore happen inside one synchronous call with
   no await between them, so nothing else ever observes the state mid swap. */
var PRAC_SEL=null, PRAC_SORT='attn', PRAC_RCACHE={};
/* TEN, NAMED, ON THE OWNER'S OWN WORD. "Just do 10 of the clients from our
   profiles... let's see what data we can see." PEOPLE carries 44 worked
   examples: the six ICPs (Sofia, Diane, Marcus, Angela, Derek, James), the
   roster around them (Rosa, Ana, Tomas, Nkem, Wren, Abraham, Gordon, Lance),
   and thirty more (Pavel to Mei) added purely to fill three rungs of every
   coherence band, which read as near duplicates of whichever ICP solved the
   same band: a wider list would be longer and not more worth looking at.
   These ten are the six ICPs plus four reference cases chosen to span the
   scale the ICPs do not reach on their own: Gordon near the floor (Contracted,
   a defended field that calls itself fine), Ana in the middle (Oscillating,
   "in the middle of something"), Abraham near the ceiling (Embodied, real
   load still in it), and Wren at the top (Mastery, one thing still held).
   Rosa, Tomas and Nkem were left out as close seconds to Wren, Gordon and
   Diane respectively, and Lance was left out because his table is the
   owner's own simulated self and listing him as a "client" among examples
   reads as the one name on this page that is not an example. */
var PRAC_TEN=['Sofia','Diane','Marcus','Angela','Derek','James','Ana','Wren','Gordon','Abraham'];
function pracRoster(){
 var out=[]; PEOPLE.forEach(function(p,i){if(PRAC_TEN.indexOf(p.nm)>=0)out.push(i);}); return out;}
/* ONE COMPUTE, POINTED AT ONE EXAMPLE, THEN PUT BACK. Mirrors the handful of
   lines in personas.js loadP() that set S from a PEOPLE row (S.dom/doms/
   arcs/roots, S.charge, S.replace, S.law, S.rec, LAW_REC), but never calls
   loadP itself: loadP also repoints CURP, writes $('psel'), and repaints the
   Field and the Avatar, which is loadP's job everywhere else it is called
   and is exactly the wrong thing here. Cached per name, because the roster
   is static data and every one of these fields is a pure function of it. */
function pracRead(p){
 if(PRAC_RCACHE[p.nm])return PRAC_RCACHE[p.nm];
 seedIntake(p);
 var oldDom=S.dom,oldA1=S.a1,oldA2=S.a2,oldDoms=S.doms,oldArcs=S.arcs,oldRoots=S.roots,oldRec=S.rec;
 var oldCharge={},oldReplace={},oldLaw={},oldUnset={},oldSeed={};
 CHARGES.forEach(function(c){oldCharge[c]=S.charge[c];oldReplace[c]=S.replace[c];});
 SINAMES.forEach(function(l){oldLaw[l]=S.law[l];oldUnset[l]=LAW_UNSET[l];oldSeed[l]=LAW_SEED[l];});
 var oldLawRec=LAW_REC;
 /* the named address layer is read by compute beside the charge, so it is
    swapped with the rest. It was not, and every client's loaded list carried
    the addresses the open record's own stories named: Derek read 20 loaded
    on a fresh page and 22 after one story on You. An example row carries no
    layer, so a client is read on its own row's, which is none. */
 var oldAddr=S.addr;
 S.addr=Object.assign({},(p.addr&&typeof p.addr==='object')?p.addr:{});
 S.dom=p.dom;S.a1=p.a1;S.a2=p.a2;
 S.doms=p.doms?p.doms.slice():[p.dom];
 S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
 S.roots=p.roots?p.roots.slice():[];
 buildSoul();
 CHARGES.forEach(function(c){
  S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 /* built through the same door as loadP's (exampleRecord, engine/birth.js):
    this built a blank with the intake answers only, and loadP skips its own
    seeding when a record exists, so opening Clients first left every
    client's Avatar birth empty beside a rail that printed the chart */
 if(!PROF_BY[p.nm])PROF_BY[p.nm]=exampleRecord(p);
 var scratch=PROF_BY[p.nm];
 S.rec=scratch.id||null; LAW_REC=scratch;
 var LS=lawsFor(p);
 SINAMES.forEach(function(l){
  S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:LAW_DEFAULT);
  LAW_UNSET[l]=false; LAW_SEED[l]=S.law[l];});
 var r=compute();
/* HELD, NOT CARRYING. compute.js draws this line in its own long comment:
   "carrying" is every address above zero (r.carrying), "held"/"loaded" is
   the much smaller set at or above the display line, sq 4, which is what
   every other surface in this product actually lists and what DQ is built
   from. */
 var loaded=W.filter(function(n){return n.sq>=4;})
  .sort(function(a,b){return b.sq-a.sq;})
  .map(function(n){return {k:n.k,b:n.b,nerve:n.n,a:n.a,d:n.d,sq:n.sq};});
 /* tierDef is TIERDEF's own one sentence for this tier (canon.js), the
    plain meaning round PO's unpack rule requires beside the word: never
    typed here a second time, read off the same table tierOf() reads. */
 var tierObj=(r.complete&&r.tier)?tierOf(r.CQ):null;
 /* THE HEAVIEST CARRYING ADDRESSES, any weight above zero, heaviest first:
    what the example's practice history aims at (engine/pracex.js). Carrying
    and not only held, because Sofia holds nothing above the line and still
    has a heaviest place a practice would be suggested for. */
 var top=W.filter(function(n){return n.sq>0;})
  .sort(function(a,b){return b.sq-a.sq||a.i-b.i;}).slice(0,6).map(function(n){return n.i;});
 /* CARRY, the body figure's own list, every address above zero as {i,sq}:
    one more cut of the same W this function already reads, added for
    bmPracHeat (ui/map.js), which borrows BY by index and needs nothing more
    than that. Phase 1 of the Practitioner rebuild; see pracFig below. */
 var carry=W.filter(function(n){return n.sq>0;}).map(function(n){return {i:n.i,sq:n.sq};});
 var snap={cq:r.CQ,tier:(r.complete&&r.tier)?r.tier:null,tierDef:tierObj?tierObj.def:'',unread:r.unread,
  darkB:r.darkB,loaded:loaded,top:top,carry:carry,
  heaviest:r.heaviest?{k:r.heaviest.k,b:r.heaviest.b,sq:r.heaviest.sq}:null};
 S.dom=oldDom;S.a1=oldA1;S.a2=oldA2;S.doms=oldDoms;S.arcs=oldArcs;S.roots=oldRoots;S.rec=oldRec;
 CHARGES.forEach(function(c){S.charge[c]=oldCharge[c];S.replace[c]=oldReplace[c];});
 SINAMES.forEach(function(l){S.law[l]=oldLaw[l];LAW_UNSET[l]=oldUnset[l];LAW_SEED[l]=oldSeed[l];});
 LAW_REC=oldLawRec; S.addr=oldAddr;
 /* repair W and DOMAIN, which compute() just overwrote in place, before
    anything else in the app reads them again */
 buildSoul(); compute();
 return (PRAC_RCACHE[p.nm]=snap);}
function pracTierWord(snap){return snap.unread||!snap.tier?'not read yet':snap.tier.toLowerCase();}
/* DEVICE STORAGE, NEVER THE PROFILE, keyed generically: 'ex:'+name for a
   worked example, 'g:'+grant id for a live client, round [Phase 1]. A grant
   id outlives any name a practitioner gives it (plNameSet, ui/praclive.js),
   so a note stays on the right client even after a rename. */
function pracNotesAll(){var o=devGet('pracNotes'); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}
function pracNotesFor(key){var l=pracNotesAll()[key]; return Array.isArray(l)?l:[];}
function pracNoteAdd(key,text){
 text=(text||'').trim(); if(!text)return false;
 var o=pracNotesAll(), list=pracNotesFor(key).slice();
 list.push({t:new Date().toISOString(),text:text}); o[key]=list;
 var r=devSet('pracNotes',o);
 if(!r.ok){if(typeof status==='function')
   status('The note was not saved. This browser would not keep it.','fail'); return false;}
 if(typeof status==='function')status('Note saved.','ok');
 return true;}
/* ATTENTION FIRST, NEVER RANK. DECISIONS.md: "Group views sort by what
   needs attention, never by who is ahead." Attention here is the lowest
   coherence first, the same direction a practitioner would actually work
   down a roster in, and Name is the plain alternative; neither is CQ shown
   as a leaderboard, because the number itself never prints on this page. */
function pracSorted(){
 var ids=pracRoster();
 if(PRAC_SORT==='name')ids.sort(function(a,b){return PEOPLE[a].nm.localeCompare(PEOPLE[b].nm);});
 else ids.sort(function(a,b){return pracRead(PEOPLE[a]).cq-pracRead(PEOPLE[b]).cq;});
 return ids;}
/* the real live roster, attention or name, same direction as the examples'.
   A row with no published summary yet has no cq to sort by and sinks to the
   foot of Attention rather than claiming the top of it on no evidence. */
/* THE REAL LIVE LIST, round PS, carried through this rebuild unchanged:
   who has actually said yes, read off ui/praclive.js and never typed. Only
   an active grant counts, never one waiting. ui/account.js's own Privacy
   count and sight line both still call this by name. */
function pracSightList(){return (typeof pracLiveActive==='function')?pracLiveActive():[];}
function pracLiveSorted(){
 var L=(typeof pracLiveActive==='function')?pracLiveActive():[];
 var ids=L.slice();
 if(PRAC_SORT==='name')ids.sort(function(a,b){return plNameOf(a).localeCompare(plNameOf(b));});
 else ids.sort(function(a,b){
  var sa=(a.summary&&a.summary.sum)||null, sb=(b.summary&&b.summary.sum)||null;
  var ca=sa&&!sa.unread&&typeof sa.cq==='number'?sa.cq:1e9, cb=sb&&!sb.unread&&typeof sb.cq==='number'?sb.cq:1e9;
  return ca-cb;});
 return ids;}

/* ============================================================
   ONE ROW, EVERY LIST. Round [Phase 1], his words: "the right rail is our
   system information window... in the centre, the person's body map." The
   client list moved to the left rail and lost its sentence of "what changed
   since you last opened this": the one value a row carries now is the place
   word for the heaviest-charge seat (OB_PLACES, the same seven words the
   quiz's own intake points a person at, engine/data/onboarding.js), in that
   seat's colour, because a tier word and a score both read as a verdict on
   a person and he named "severe" as a word to cut. The place's own meaning
   sits behind a hover, round PO's unpack rule, never printed beside it.

   o is one of:
    {kind:'example', idx, nm, snap}                       a worked example
    {kind:'live', gid, nm, snap, sight}                    a live, active client
    {kind:'wait', gid, nm}                                 a pending connection
    {kind:'ended', gid, nm, by}                             a closed connection
   ============================================================ */
function pracPlaceOf(snap){
 if(!snap||snap.unread||!snap.darkB)return null;
 return OB_PLACES.filter(function(p){return p.b===snap.darkB;})[0]||null;}
function pracRowHtml(o){
 var ring, val, tags='';
 if(o.kind==='wait'){
  ring=plGl(RIT_IC.clock,'var(--dim)');
  val='<svg viewBox="0 0 24 24" aria-hidden="true">'+RIT_IC.clock+'</svg>waiting';}
 else if(o.kind==='ended'){
  ring=plGl(PL_IC.unlink,'var(--dim)');
  val=esc('ended');}
 else{
  ring=o.snap?pracMiniRing(o.snap):plGl(PL_IC.link,'var(--dim)');
  var pl=o.snap?pracPlaceOf(o.snap):null;
  if(!o.snap||o.snap.unread)val='<span style="color:var(--dim)">–</span>';
  else if(!pl)val='<span style="color:var(--dim)">–</span>';
  else val='<span class="tipu" style="color:'+seatCol(pl.b)+'" tabindex="0" data-tip-k="'+esc(pl.n)+'" '
   +'data-tip="'+esc(unpackOf(pl.b,'seat'))+'">'+esc(pl.n)+'</span>';
  if(o.kind==='live'&&o.sight)tags=plTags(o.sight);}
 var isBtn=o.kind!=='ended';
 var tag=isBtn?'button':'div';
 var attr=o.kind==='example'?' data-pri="'+o.idx+'"':(o.kind==='live'?' data-plo="'+esc(o.gid)+'"':'');
 return '<'+tag+(isBtn?' type="button"':'')+' class="pr-client'+(o.sel?' on':'')+'"'+attr
  +(isBtn?' aria-pressed="'+!!o.sel+'"':' aria-disabled="true"')+'>'
  +'<span class="pr-av">'+ring+'</span>'
  +'<span class="pr-cinfo"><span class="pr-cnm">'+esc(o.nm)+(o.kind==='example'?' <em>example</em>':'')+'</span>'
  +'<span class="pr-cst">'+val+'</span>'+tags+'</span></'+tag+'>';}

/* THE LEFT RAIL, built whole: the sort pair, Clients with its own + Invite
   (or, signed out, Sign in), the client rows, Examples, the example rows. */
function pracClientsHeadBtn(){
 if(!plSignedIn())return '<button type="button" data-pr="signin"><svg viewBox="0 0 24 24" aria-hidden="true">'
  +'<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0114 0"/></svg>Sign in</button>';
 return '<button type="button" data-pr="invite"><svg viewBox="0 0 24 24" aria-hidden="true">'
  +'<path d="M12 5v14 M5 12h14"/></svg>Invite</button>';}
function pracListHtml(){
 plEnsure('roster');
 var liveRows=pracLiveSorted().map(function(g){
  return pracRowHtml({kind:'live',gid:g.id,nm:plNameOf(g),snap:g.summary&&g.summary.sum,sight:g.sight,sel:PL.sel===g.id});});
 var wait=((typeof PL!=='undefined'&&PL.roster&&PL.roster.grants)||[]).filter(function(g){return g.status==='pending';});
 var waitRows=wait.map(function(g){return pracRowHtml({kind:'wait',gid:g.id,nm:plNameOf(g)});});
 var ended=((typeof PL!=='undefined'&&PL.roster&&PL.roster.grants)||[]).filter(function(g){return g.ended_by;});
 var endedRows=ended.map(function(g){
  return pracRowHtml({kind:'ended',gid:g.id,nm:plNameOf(g),
   by:g.ended_by==='expired'?'not answered in time':'ended by '+(g.ended_by==='client'?'them':'you')});});
 var exRows=pracSorted().map(function(i){
  var p=PEOPLE[i]; return pracRowHtml({kind:'example',idx:i,nm:p.nm,snap:pracRead(p),sel:PRAC_SEL===i});});
 var offLine=(typeof PL!=='undefined'&&PL.roster&&PL.roster.off)
  ?'<div class="pr-empty">'+esc(PL_OFF)+'</div>':'';
 return '<div class="pr-sort">'
  +'<button type="button" data-prs="attn" aria-pressed="'+(PRAC_SORT==='attn')+'">Attention</button>'
  +'<button type="button" data-prs="name" aria-pressed="'+(PRAC_SORT==='name')+'">Name</button></div>'
  +'<div class="pr-rail-h"><span>Clients</span>'+pracClientsHeadBtn()+'</div>'
  +offLine
  +'<div class="pr-list-col">'+(liveRows.join('')||waitRows.join('')||endedRows.join('')
    ?liveRows.join('')+waitRows.join('')+endedRows.join('')
    :'<div class="pr-empty">Nobody yet. Press Invite to send a link.</div>')+'</div>'
  +'<div class="pr-rail-h"><span>Examples</span></div>'
  +'<div class="pr-list-col">'+(exRows.join('')||'<div class="pr-empty">No example people are loaded.</div>')+'</div>';}

/* ONE RING, SEVEN SEATS. Each arc is one of the seven seats (BANDS), equal
   angle so the shape never distorts, its colour at full strength and the
   rest dimmed by how much that seat actually holds against the heaviest
   seat here: the same language Story's own ring view draws (stDrawRing,
   ui/storyui.js), an SVG rather than a canvas because nothing here animates.
   Kept for the row avatar; the big ring card itself is gone, replaced by
   the body figure (pracFig). */
function pracSeatTotals(loaded){
 var t={}; BANDS.forEach(function(b){t[b]=0;});
 loaded.forEach(function(n){t[n.b]=(t[n.b]||0)+n.sq;});
 return t;}
function pracArcs(loaded,cx,cy,r,sw,gap,withButtons){
 var tot=pracSeatTotals(loaded), max=0;
 BANDS.forEach(function(b){if(tot[b]>max)max=tot[b];});
 var n=BANDS.length;
 return BANDS.map(function(b,i){
  var a0=(i/n)*Math.PI*2-Math.PI/2+gap, a1=((i+1)/n)*Math.PI*2-Math.PI/2-gap;
  var frac=max?tot[b]/max:0, op=(0.16+0.74*frac).toFixed(2);
  var x0=(cx+Math.cos(a0)*r).toFixed(1), y0=(cy+Math.sin(a0)*r).toFixed(1);
  var x1=(cx+Math.cos(a1)*r).toFixed(1), y1=(cy+Math.sin(a1)*r).toFixed(1);
  var d='M'+x0+' '+y0+' A'+r+' '+r+' 0 0 1 '+x1+' '+y1;
  var drawn='<path d="'+d+'" fill="none" stroke="'+seatCol(b)+'" stroke-width="'+sw+'" opacity="'+op+'"'
   +(withButtons?' pointer-events="none"':'')+'/>';
  if(!withButtons)return drawn;
  return drawn+'<path class="pr-hit" d="'+d+'" fill="none" stroke="transparent" stroke-width="40"'
   +' data-prd="seat:'+esc(b)+'" tabindex="0" role="button" aria-label="'+esc(b)+'"><title>'+esc(b)+'</title></path>';}).join('');}
/* THE SAME RING, SMALL AND QUIET, on a client's own row in the list */
function pracMiniRing(snap){
 return '<svg viewBox="0 0 40 40" class="pr-miniring" aria-hidden="true">'+pracArcs(snap.loaded,20,20,14,5,0.08,false)+'</svg>';}

/* ============================================================
   THE CENTRE: NAME, THEN THE BODY FIGURE. Round [Phase 1], his words: "in
   the centre, the person's body map... so as the practitioner I can select
   the person and get insight on them and see the body." The ring, the lead
   paragraph and the Summary/Body/Field tab switcher this replaces are gone.

   THE FIGURE ITSELF IS BUILT FROM ONE LIST, {i,sq} pairs, address index and
   charge, so the same function draws a worked example (carry, off pracRead)
   and a live client (the same shape, mapped back from the shared body's
   {k,b,sq} rows, which carry no index: pracLiveCarry below). Grouped by
   place rather than by raw address, because a ring on the figure is a press
   and 112 individual targets at that density would overlap on a phone; the
   heaviest address at each lit place carries the press (data-prd), and the
   place's own three facts and meter are what the drill under it already
   prints for one address (pracDrillAddr), so nothing here invents a second
   wording for the same fact.
   ============================================================ */
var PRAC_FACE='front';
/* GROUPED BY THE PLACE ITSELF, not by any name on it: a place from bmPlaces
   (ui/map.js) carries no .nm at all, only x/y/view/ids, and the real one
   point-per-point name lives on a region (BMG.reg), a different table for
   a different purpose. Grouping on p.nm therefore grouped on undefined,
   which is one key for every place on the body: 107 carrying addresses on
   Gordon's own record collapsed to a single ring, and at 390 wide, where
   the reduced figure shows one view, that one ring happened to be the
   back's and the front view, the default, drew none at all. BMG.byId
   hands back the very place objects G.places already holds, the same
   object every time a second address shares it, so a real Map keyed on
   that object groups by the point in space and not by a field it never
   had. */
function pracFigPlaces(carry){
 if(!BMG)bmInit();
 var by=new Map(); (carry||[]).forEach(function(x){
  var n=BY[x.i]; if(!n)return;
  (BMG.byId[x.i]||[]).forEach(function(p){
   var cur=by.get(p); if(!cur||x.sq>cur.sq)by.set(p,{p:p,i:x.i,sq:x.sq,b:n.b});});});
 return Array.from(by.values());}
/* A PLACE'S OWN VIEW IS A WORD (bmView, ui/map.js), and "both" means exactly
   that: the point sits on the front and the back silhouette at once, the
   same mirrored x bmPlaceX already computes for it. One ring per place was
   wrong for every "both" place, which is most of the torso: the back
   figure drew the right heat under it, from the same G.cheat the front
   half reads, with nothing to press there. */
function pracFigViews(v){
 if(v==='both')return [0,1];
 return [v==='back'?1:0];}
function pracFigOverlay(places,reduced){
 var out=[];
 places.forEach(function(x){
  pracFigViews(x.p.view).forEach(function(v){
   if(reduced&&v!==(PRAC_FACE==='back'?1:0))return;
   var x0=bmPlaceX(x.p,v)+bmVX(v), y0=x.p.y;
   out.push('<circle class="pr-fig-ring" cx="'+x0.toFixed(1)+'" cy="'+y0.toFixed(1)+'" r="1.8" fill="none" '
    +'stroke="'+seatCol(x.b)+'" stroke-width="1.1"/>'
    +'<circle class="pr-fig-hit" cx="'+x0.toFixed(1)+'" cy="'+y0.toFixed(1)+'" r="7.8" stroke="'+seatCol(x.b)+'" stroke-width="0"'
    +' data-prd="addr:'+x.i+'" tabindex="0" role="button" aria-label="'+esc(BY[x.i]?BY[x.i].k:'')+'">'
    +'<title>'+esc(BY[x.i]?BY[x.i].k:'')+'</title></circle>');});});
 return out.join('');}
/* reduced: true below 900px, one figure, front or back, with the toggle
   pills; false (or omitted) above it, both figures side by side the way the
   real Body page's own two panels sit, because a practitioner reading a
   client's whole field benefits from both at once and has the width for it. */
function pracFig(carry,reduced){
 if(!BMG)bmInit();
 var places=pracFigPlaces(carry);
 var vbX=BMXA, vbY=BMYA, vbW=reduced?BMCOLS*BMU:BMOX+BMCOLS*BMU, vbH=BMROWS*BMU;
 if(reduced&&PRAC_FACE==='back')vbX=BMXA+BMOX;
 var outline=reduced?bmOutline1():bmOutline();
 var views=reduced?[PRAC_FACE==='back'?1:0]:[0,1];
 return '<div class="pr-fig-wrap" data-prfig="1">'
  +'<svg class="pr-outline" viewBox="'+vbX+' '+vbY+' '+vbW+' '+vbH+'" preserveAspectRatio="xMidYMid meet">'
  +'<path d="'+outline+'"/></svg>'
  +'<canvas class="pr-fig-cv" data-prcv="1" aria-hidden="true"></canvas>'
  +'<svg class="pr-fig-ov" viewBox="'+vbX+' '+vbY+' '+vbW+' '+vbH+'" preserveAspectRatio="xMidYMid meet" data-prov="1">'
  +pracFigOverlay(places,reduced)+'</svg></div>'
  +(reduced?'<div class="pr-face"><button type="button" data-prface="front" aria-pressed="'+(PRAC_FACE==='front')+'">Front</button>'
    +'<button type="button" data-prface="back" aria-pressed="'+(PRAC_FACE==='back')+'">Back</button></div>':'');}
/* paints the canvas a figure's own markup left behind: called after the
   centre's innerHTML lands, because a canvas drawn before it is in the
   document has no clientWidth to size itself against */
function pracFigPaint(host,carry,reduced){
 var wrap=host.querySelector('[data-prfig]'); if(!wrap)return;
 var cv=wrap.querySelector('[data-prcv]'); if(!cv)return;
 var views=reduced?[PRAC_FACE==='back'?1:0]:[0,1];
 bmPracHeat(cv,carry||[],views);}

/* THE EXAMPLE'S CENTRE DATA. A live client's own version, plLiveCentreData,
   lives in ui/praclive.js beside the rest of its server reading. */
function pracCentreData(p){
 var snap=pracRead(p);
 return {nm:p.nm, sub:p.role+(exampleAge(p)!==null?', '+String(exampleAge(p)):'')+'. Example person, not a client.',
  unread:snap.unread, carry:snap.carry, tags:''};}
/* ROLE AND AGE MOVE TO A HOVER, round [Phase 1], the symbol-first rule
   (CLAUDE.md, 16 November): "I should not have to read a bunch of text if
   it forced me." The sentence that used to sit under the name as a visible
   paragraph (pracDetail's own "Example person, not a client. The practice
   history is written for this example...") is still true and still
   reachable, on the name itself, the same carrier unp() already uses for
   every other term this product unpacks on a hover rather than in prose. */
function pracCentreHtml(d,reduced){
 if(!d)return '<div class="pr-centre"><h2 class="kb-h">Open a client to read it here</h2>'
  +'<p class="ac-lead" style="text-align:center;max-width:52ch">Press a client or an example on the left.</p></div>';
 var h='<div class="pr-centre"><h2 class="kb-h"'
  +(d.sub?' tabindex="0" data-tip-k="'+esc(d.nm)+'" data-tip="'+esc(d.sub)+'"':'')+'>'+esc(d.nm)+'</h2>';
 if(d.tags)h+='<div class="pr-tags">'+d.tags+'</div>';
 /* Phase 2: proposal buttons (Add a ritual, Set a release) go here. Not
    built in this pass: CLAUDE.md names ritual and release proposals as a
    separate, later build and this file does not reach for them. */
 if(d.unread)h+='<p class="pr-empty">'+(d.sub2||('Nothing read yet, so there is nothing to show for '+esc(d.nm)+'.'))+'</p>';
 else h+=pracFig(d.carry,reduced);
 return h+'</div>';}

/* ============================================================
   WHAT IS RUNNING, THE RIGHT RAIL'S FRONT SECTION. The example's own four
   cards (plain words, the four figures, the days, the patterns) move here
   whole; a live client's equivalent lives in ui/praclive.js and is handed
   to pracRunPaint the same shape, pre-built markup, because the two differ
   in where their numbers come from and agree on everything else.
   ============================================================ */
function pracExampleRunHtml(p){
 var snap=pracRead(p);
 if(snap.unread)return '<p class="pr-empty">Nothing read yet, so there is nothing running for '+esc(p.nm)+'.</p>';
 var R=pracEx(p);
 if(!R)return '<p class="pr-empty">No practice history is written for '+esc(p.nm)+'.</p>';
 return '<div class="pr-run-sub">In plain words</div><div class="pr-say">'+pracSay(p,R).map(function(t){return '<p>'+t+'</p>';}).join('')+'</div>'
  +'<div class="pr-run-sub">Patterns and practice</div>'+pracFigsBody(R)
  +'<div class="pr-run-sub">Practice, the last '+PRAC_WINDOW_WORD+'</div>'+pracDaysBody(R)
  +'<div class="pr-run-sub">Patterns</div>'+pracPatsBody(R);}
function pracRunPaint(host,html){host.innerHTML=html||'';}

/* ============================================================
   NOTES, THE RIGHT RAIL'S LAST SECTION. Keyed per client, round [Phase 1]:
   'ex:'+name for a worked example, 'g:'+grant id for a live one, so a note
   survives the practitioner renaming a client (pracLiveNames, ui/praclive.js
   is a separate, display-only name and never touches this key).
   ============================================================ */
function pracNoteKey(){
 if(PRAC_SEL!=null&&PEOPLE[PRAC_SEL])return 'ex:'+PEOPLE[PRAC_SEL].nm;
 if(typeof PL!=='undefined'&&PL.sel)return 'g:'+PL.sel;
 return null;}
function pracNotesHtml(key,nm){
 if(!key)return '<p class="pr-empty">Open a client to write a note.</p>';
 var notes=pracNotesFor(key).slice().reverse();
 var items=notes.map(function(n){
  var d=new Date(n.t); var when=isNaN(d)?n.t:d.toLocaleDateString();
  return '<div class="pr-note-item"><span class="pr-note-date">'+esc(when)+'</span>'+esc(n.text)+'</div>';
  }).join('');
 return '<form class="pr-note-form" id="prnoteform"><textarea class="pr-note-ta" id="prnotetxt" '
  +'placeholder="Write a note" aria-label="Write a note on '+esc(nm||'')+'"></textarea>'
  +'<div style="margin-top:8px"><button class="btn pri" type="submit">Save note</button></div></form>'
  +(items||'<p class="pr-empty">No notes yet.</p>')
  +'<p class="ac-gf">Saved to this device only, never to '+esc(nm||'the record')+'’s own record and never sent anywhere.</p>';}

/* ============================================================
   THE CLIENT'S ANALYTICS, round QB, kept for the worked examples. His words:
   "when I select somebody within my cohort, it gives me their analytics...
   And if I select any of the analytic information, telemetry information,
   or graph information, it shows up on the right-hand side of the screen."

   WHAT IS READ. pracRead above is the structure, a real compute(). pracEx
   below is what moved: engine/pracex.js builds the example's practice
   history through practiceDo and reads it back with loopRead, the trace
   graph's one read (engine/loop.js), which is the same read the Field's
   Your patterns block makes.

   EVERY PRESS GOES TO SELECTION. One attribute, data-prd, "kind:key", on
   every element that carries a figure, a day, a pattern, a seat or an
   address, on the page and inside a drill, and one handler for all of
   them. The drill is written through rdShell (ui/drills.js), so it has the
   same back control, the same close and the same escape as every other
   drill in the product.
   ============================================================ */
var PRAC_EX={}, PRAC_PICK=null, PRAC_ALLPAT=false;
var PRAC_WINDOW_WORD='three weeks';
function pracEx(p){
 var now=new Date(), k=p.nm+'|'+now.toISOString().slice(0,10);
 if(PRAC_EX[k]!==undefined)return PRAC_EX[k];
 var R=null;
 try{R=(typeof pracexRead==='function')?pracexRead(p,pracRead(p).top,now.toISOString()):null;}
 catch(e){R=null; if(typeof status==='function')status('The practice history for '+p.nm+' did not build: '+((e&&e.message)||'error'),'fail');}
 return (PRAC_EX[k]=R);}
function pracPl(n,one,many){return n+' '+(n===1?one:many);}
function pracAnd(list){
 if(list.length<2)return list.join('');
 return list.slice(0,-1).join(', ')+' and '+list[list.length-1];}
var PRAC_NUMW=['no','one','two','three','four','five','six','seven','eight','nine','ten'];
function pracNumW(n){return PRAC_NUMW[n]||String(n);}
/* the day word, "2 October", off the day's own date and never the clock */
function pracDayWord(k){return (typeof dlyDayWord==='function')?dlyDayWord(k):k;}
/* the status words, one word per state, each with its meaning in the
   table under client: so a tooltip and a drill read the same sentence */
var PRAC_ST={completed:'done', partial:'part done', skipped:'skipped', missed:'missed',
 scheduled:'not marked yet', none:'nothing scheduled'};
var PRAC_ST_ORDER=['completed','partial','skipped','missed','scheduled','none'];
function pracStWord(st){return PRAC_ST[st]||st;}
function pracStMean(st){return unpackOf(pracStWord(st),'client');}
function pracCap(t){t=String(t); return t.charAt(0).toUpperCase()+t.slice(1);}

/* the pattern a practice aims at, by protocol id, off the record */
function pracProtoOf(R,pid){
 var P=R&&R.rec&&R.rec.practice; if(!P)return null;
 var x=null; P.protocols.forEach(function(v){if(v.id===pid&&(!x||v.version>x.version))x=v;});
 return x;}
function pracProtoAddr(x){
 var id=x&&x.target_patterns&&x.target_patterns.pattern_ids[0];
 var m=/^addr:(\d+)$/.exec(id||''); return m?+m[1]:null;}
function pracPatOfAddr(R,a){
 var L=R&&R.loop; if(!L)return null;
 for(var i=0;i<L.patterns.length;i++)if(L.patterns[i].address===a)return L.patterns[i];
 return null;}
function pracPatSeat(x){return x&&x.seat?String(x.seat):'';}

/* THE PLAIN WORDS, two or three sentences, each read off the loop read and
   the days. Third person, the client's name as subject, because the reader
   is the practitioner. No score and no total: a count of what happened, and
   never one set against a count of what could have. */
function pracSay(p,R){
 var L=R.loop, nm=esc(p.nm), out=[];
 var conf=L.patterns.filter(function(x){return x.state==='confirmed';});
 if(conf.length)out.push(nm+' has said yes to '+pracNumW(conf.length)+' '+(conf.length===1?'pattern':'patterns')+': '
  +pracAnd(conf.map(function(x){return esc(x.name);}))+'.');
 else out.push(nm+' has not said yes to any pattern yet.');
 var bits=[];
 var nw=function(n,one,many){return pracNumW(n)+' '+(n===1?one:many);};
 if(L.unanswered)bits.push(nw(L.unanswered,'pattern is','patterns are')+' waiting for an answer');
 if(L.declined.length)bits.push(nw(L.declined.length,'suggested practice was','suggested practices were')+' turned down');
 if(bits.length)out.push(pracCap(pracAnd(bits))+'.');
 var ran=L.practice.events;
 if(ran)out.push('Practised '+pracPl(ran,'time','times')+' in the last '+PRAC_WINDOW_WORD+'.');
 else if(!conf.length)out.push('Nothing is scheduled, so there is no practice to read.');
 else out.push('Nothing practised in the last '+PRAC_WINDOW_WORD+'.');
 L.misses.forEach(function(m){
  out.push('The last '+pracNumW(m.run)+' times it came due, it was not marked done.'
   +(m.stage==='investigate'?' At three in a row, ask what got in the way: the time, the length, or the practice itself.':''));});
 return out;}

/* THE FOUR FIGURES, Your patterns' own four, a bare body (no card wrapper:
   the card is the rail section itself now) */
function pracFigsBody(R){
 var L=R.loop, f=function(k,lab,n){
  return '<button type="button" class="lp-f" data-prd="fig:'+k+'" aria-label="'+esc(lab+', '+(n||'none'))+'">'
   +'<span class="lp-fl">'+esc(lab)+'</span><b class="lp-fv">'+(n?String(n):'–')+'</b></button>';};
 return '<div class="pr-figs">'
  +f('confirmed','Confirmed',L.confirmed)+f('unanswered','Unanswered',L.unanswered)
  +f('declined','Declined',L.declined.length)+f('practised','Practised',L.practice.events)+'</div>';}

/* THE DAYS, the telemetry. A day something was scheduled on is a press; a
   day nothing was is a mark and not a control. The key is gone from the
   page print, round [Phase 1], "no third-tier text": its meaning is on
   each cell's own hover, the same unp() every other mark on this page uses. */
function pracDaysBody(R){
 var cells=R.days.map(function(d){
  var lab=pracDayWord(d.day)+', '+pracStWord(d.status), n=String(+d.day.slice(8));
  if(d.status==='none')return '<span class="pr-day st-none" title="'+esc(lab)+'">'+n+'</span>';
  return '<button type="button" class="pr-day st-'+d.status+'" data-prd="day:'+d.day+'" '
   +'data-tip-k="'+esc(pracCap(pracStWord(d.status)))+'" data-tip="'+esc(pracStMean(d.status))+'" '
   +'aria-label="'+esc(lab)+'">'+n+'</button>';}).join('');
 return '<div class="pr-days">'+cells+'</div>';}

/* THE PATTERNS, confirmed first, the loop read's own order, then the
   practices turned down. LOOP_SHOW at a time, the working memory figure. */
function pracPatsBody(R){
 var L=R.loop, rows=L.patterns.map(function(x){
  return {k:'pat:'+x.key, nm:x.name, seat:pracPatSeat(x), st:x.state};});
 L.declined.forEach(function(d){
  rows.push({k:'dec:'+d.id, nm:d.patterns.join(', ')||'no named pattern', seat:'', st:'declined'});});
 if(!rows.length)return '<p class="pr-empty">Nothing read yet, so no pattern is traced.</p>';
 var show=PRAC_ALLPAT?rows:rows.slice(0,LOOP_SHOW);
 var lab={confirmed:'Confirmed', unanswered:'Unanswered', declined:'Declined'};
 return '<div class="pr-pats">'
  +show.map(function(r){
   return '<button type="button" class="pr-pat" data-prd="'+esc(r.k)+'">'
    +'<span class="lp-pn"><b>'+esc(r.nm)+'</b>'+(r.seat?'<em>'+esc(r.seat)+'</em>':'')+'</span>'
    +'<span class="lp-st lp-'+r.st+'">'+lab[r.st]+'</span></button>';}).join('')
  +(rows.length>LOOP_SHOW?'<button type="button" class="btn pr-more" data-prall="1" aria-expanded="'+PRAC_ALLPAT+'">'
   +(PRAC_ALLPAT?'Show the first '+LOOP_SHOW:'Show all '+rows.length)+'</button>':'')
  +'</div>';}

function pracAddrIdx(n){
 if(typeof n.i==='number')return n.i;
 for(var i=0;i<W.length;i++)if(W[i].k===n.k&&W[i].b===n.b)return W[i].i;
 return -1;}
function pracAddrSeatSuffix(n){
 var suf=' ('+n.b+')';
 return n.k.length>=suf.length&&n.k.slice(-suf.length)===suf;}

/* ============================================================
   THE DRILLS. One per kind, each into Selection through rdShell. Every one
   names its client in the eyebrow, because the rail is not on the page and
   a reading with no name on it, beside a list of several people, is a
   reading of whoever the eye lands on.
   ============================================================ */
function pracShell(nm,h){
 /* a press made on this page is always answered in view: on a phone the
    rail is under the page, and there is no stage here to keep in sight */
 var was=RD_INRAIL; RD_INRAIL=true;
 try{rdShell('<div data-prdrill="'+esc(nm)+'">'+h+'</div>');}finally{RD_INRAIL=was;}
 var b=document.getElementById('rdrill');
 /* AND AGAIN ONCE IT IS FULL, stacked. rdOpen brings the section up before
    rdShell writes the drill into it, and at the foot of a phone's page the
    empty section cannot rise */
 if(b&&b.closest&&window.matchMedia&&window.matchMedia('(max-width:1180px)').matches){
  var sec=b.closest('.lsec'); if(sec&&sec.scrollIntoView)try{sec.scrollIntoView({block:'start'});}catch(e){}}
 if(b){pracWireIn(b);
  ['rdback','rdx'].forEach(function(id){var e=document.getElementById(id);
   if(e)e.addEventListener('click',function(){PRAC_PICK=null; pracMark();});});}}
function pracEye(nm,what){return '<div class="pm-eye plain">'+esc(nm)+', '+esc(what)+'</div>';}
function pracRowBtn(k,label,sub){
 return '<button type="button" class="ad-r pr-pat" data-prd="'+esc(k)+'"><span class="lp-pn"><b>'+esc(label)+'</b>'
  +(sub?'<em>'+esc(sub)+'</em>':'')+'</span></button>';}
/* an address's own three facts, off NODES, the same words the seat list
   carried before it moved into Selection */
function pracAddrFacts(a){
 var n=BY[a]; if(!n)return '';
 return '<p class="ad-p">Concerns '+esc(String(n.a||'').toLowerCase())+'. Shows up as '
  +esc(String(n.d||'').toLowerCase())+'.'
  +(n.n?' The nerve that serves this place is the '+esc(String(n.n).toLowerCase())+'.':'')+'</p>';}
function pracSqOf(p,a){
 var snap=pracRead(p); for(var i=0;i<snap.loaded.length;i++)if(snap.loaded[i].k===(BY[a]||{}).k&&snap.loaded[i].b===(BY[a]||{}).b)return snap.loaded[i].sq;
 return null;}
function pracMeter(sq){
 return '<div class="pr-meter"><i style="width:'+Math.max(2,Math.min(100,sq/10*100)).toFixed(0)+'%"></i></div>';}

function pracDrillFig(p,R,k){
 var L=R.loop, word={confirmed:'confirmed',unanswered:'unanswered',declined:'declined',practised:'practised'}[k];
 var h=pracEye(p.nm,'patterns and practice')+'<div class="ad-nm">'+pracCap(word)+'</div>'
  +'<p class="ad-p">'+esc(unpackOf(word,'client'))+'</p>';
 if(k==='confirmed'||k==='unanswered'){
  var list=L.patterns.filter(function(x){return x.state===k;});
  h+=list.length?'<div class="ad-rows">'+list.map(function(x){return pracRowBtn('pat:'+x.key,x.name,pracPatSeat(x));}).join('')+'</div>'
   :'<p class="ad-p">None on this record.</p>';}
 else if(k==='declined'){
  h+=L.declined.length?'<div class="ad-rows">'+L.declined.map(function(d){
    return pracRowBtn('dec:'+d.id,d.patterns.join(', ')||'no named pattern','turned down '+(d.at?pracDayWord(d.at.slice(0,10)):''));}).join('')+'</div>'
   :'<p class="ad-p">None on this record.</p>';}
 else{
  var ran=R.days.filter(function(d){return d.status==='completed'||d.status==='partial';});
  h+=ran.length?'<div class="ad-rows">'+ran.slice().reverse().map(function(d){
    return pracRowBtn('day:'+d.day,pracDayWord(d.day),pracStWord(d.status)+(d.seconds?', '+pracPl(Math.round(d.seconds/60),'minute','minutes'):''));}).join('')+'</div>'
   :'<p class="ad-p">Nothing practised in the last '+PRAC_WINDOW_WORD+'.</p>';}
 pracShell(p.nm,h);}

function pracDrillDay(p,R,day){
 var d=null; R.days.forEach(function(x){if(x.day===day)d=x;}); if(!d)return;
 var x=pracProtoOf(R,d.protocol), a=pracProtoAddr(x), pat=a!==null?pracPatOfAddr(R,a):null;
 var h=pracEye(p.nm,'one day of practice')+'<div class="ad-nm">'+esc(pracDayWord(d.day))+'</div>'
  +'<div class="ad-sub">'+esc(pracCap(pracStWord(d.status)))+'</div>'
  +'<p class="ad-p">'+esc(pracStMean(d.status))+'</p>';
 if(d.seconds)h+='<p class="ad-p">It ran for '+pracPl(Math.round(d.seconds/60),'minute','minutes')+'.</p>';
 if(a!==null&&BY[a])h+='<div class="pm-eye">Aimed at</div>'
  +'<div class="ad-rows">'+pracRowBtn(pat?'pat:'+pat.key:'addr:'+a,BY[a].k,BY[a].b)+'</div>';
 var miss=R.loop.misses.filter(function(m){return m.ritual===d.ritual;})[0];
 if(miss&&d.status==='missed')h+='<p class="ad-p">The last '+pracNumW(miss.run)+' times this ritual came due, it was not marked done.'
  +(miss.stage==='investigate'?' At three in a row, ask what got in the way: the time, the length, or the practice itself.':'')+'</p>';
 pracShell(p.nm,h);}

/* THE WHY CHAIN, in the order lpChain draws it and with its classes, and in
   the third person: what was written, what was opened, what practice aims
   at it, and where the answer stands */
function pracChain(p,x,R){
 var st=[], nm=esc(p.nm);
 if(x.stories)st.push(['Written',pracPl(x.stories,'entry','entries')+', '
  +(x.named?'from '+nm+'’s own words':'placed by the point the words pointed at')]);
 var op=[];
 if(x.lines)op.push(pracPl(x.lines,'release line','release lines'));
 if(x.truths)op.push(pracPl(x.truths,'truth line','truth lines'));
 st.push(['Opened',op.length?esc(op.join(', ')):'nothing opened here yet']);
 if(x.protocols.length){
  var acc=x.protocols.some(function(id){var v=pracProtoOf(R,id); return v&&v.status==='accepted';});
  st.push(['Practice',(acc?'chosen':'suggested, no answer yet')
   +(x.practised?', '+unp('practised','practised','client')+' '+pracPl(x.practised,'time','times'):'')]);}
 if(x.evFor||x.evAgainst)st.push(['Evidence',x.evFor+' for, '+x.evAgainst+' against']);
 st.push(['Answer',x.state==='confirmed'
  ?(x.by==='protocol'?nm+' chose a practice for it':nm+' said yes to it')
  :'Not answered yet']);
 return '<ol class="lp-chain" aria-label="Why chain">'+st.map(function(s){
  return '<li><span class="lp-cl">'+s[0]+'</span><span class="lp-cv">'+s[1]+'</span></li>';}).join('')+'</ol>';}

function pracDrillPat(p,R,key){
 var x=null; R.loop.patterns.forEach(function(y){if(y.key===key)x=y;}); if(!x)return;
 var seat=pracPatSeat(x);
 var h=pracEye(p.nm,'one pattern')+'<div class="ad-nm">'+esc(x.name)+'</div>'
  +(seat?'<div class="ad-sub">'+unp(seat.toLowerCase(),seat+' point','seat')+'</div>':'')
  +'<p class="ad-p">'+esc(unpackOf(x.state,'client'))+'</p>';
 if(x.address!==null){
  h+=pracAddrFacts(x.address);
  var sq=pracSqOf(p,x.address); if(sq!==null)h+=pracMeter(sq);}
 h+='<div class="pm-eye">The chain</div>'+pracChain(p,x,R);
 pracShell(p.nm,h);}

function pracDrillDec(p,R,id){
 var d=null; R.loop.declined.forEach(function(y){if(y.id===id)d=y;}); if(!d)return;
 var h=pracEye(p.nm,'a practice turned down')+'<div class="ad-nm">'+esc(d.patterns.join(', ')||'No named pattern')+'</div>'
  +'<p class="ad-p">'+esc(unpackOf('declined','client'))+'</p>'
  +'<p class="ad-p">A '+esc(d.cls||'')+' practice, turned down'+(d.at?' on '+esc(pracDayWord(d.at.slice(0,10))):'')
  +'. No reason was recorded.</p>';
 var x=pracProtoOf(R,d.id), a=pracProtoAddr(x);
 if(a!==null)h+=pracAddrFacts(a);
 pracShell(p.nm,h);}

function pracDrillSeat(p,b){
 var snap=pracRead(p), list=snap.loaded.filter(function(n){return n.b===b;});
 var h=pracEye(p.nm,'one point')+'<div class="ad-nm">'+esc(b)+'</div>'
  +'<p class="ad-p">'+esc(unpackOf(b,'seat'))+'</p>';
 if(!list.length)h+='<p class="ad-p">Nothing at this point is above the line.</p>';
 else h+='<p class="ad-p">'+pracPl(list.length,'address is','addresses are')+' carrying here, heaviest first.</p>'
  +list.map(function(n){
   var a=pracAddrIdx(n);
   return '<div class="pr-addr" style="--c:'+seatCol(b)+'"><button type="button" class="pr-link pr-addr-k" data-prd="addr:'+a+'">'+esc(n.k)+'</button>'
    +'<div class="pr-addr-x">Concerns '+esc(String(n.a||'').toLowerCase())+'. Shows up as '+esc(String(n.d||'').toLowerCase())+'.'
    +(n.nerve?' The nerve that serves this place is the '+esc(String(n.nerve).toLowerCase())+'.':'')+'</div>'
    +pracMeter(n.sq)+'</div>';}).join('');
 pracShell(p.nm,h);}

function pracDrillAddr(p,R,a){
 var n=BY[a]; if(!n)return;
 var pat=R?pracPatOfAddr(R,a):null, sq=pracSqOf(p,a);
 var h=pracEye(p.nm,'one address')+'<div class="ad-nm">'+esc(n.k)+'</div>'
  +'<div class="ad-sub">'+unp(String(n.b).toLowerCase(),n.b+' point','seat')+'</div>'
  +pracAddrFacts(a)+(sq!==null?pracMeter(sq):'')
  +(pat?'<div class="ad-rows">'+pracRowBtn('pat:'+pat.key,'Read it as a pattern',pat.state==='confirmed'?'Confirmed':'Unanswered')+'</div>'
   :'<p class="ad-p">No practice is aimed here yet.</p>');
 pracShell(p.nm,h);}

/* A LIVE CLIENT'S OWN ADDRESS DRILL, round [Phase 1]. A live client is not a
   PEOPLE row and pracEx has no history for one unless Field is shared, so
   this reads only what pracLiveCarry already resolved: the name, the seat,
   the address's own three facts off BY, and the meter. No "aimed at a
   pattern" line unless the client's own Field data names one at this
   address, because inventing that link on no evidence is the fabricated
   reading CLAUDE.md rules out by name. */
function pracDrillAddrLive(nm,a,sq,R){
 var n=BY[a]; if(!n)return;
 var pat=(R&&a!==null)?pracPatOfAddr(R,a):null;
 var h=pracEye(nm,'one address')+'<div class="ad-nm">'+esc(n.k)+'</div>'
  +'<div class="ad-sub">'+unp(String(n.b).toLowerCase(),n.b+' point','seat')+'</div>'
  +pracAddrFacts(a)+(sq!=null?pracMeter(sq):'')
  +(pat?'<div class="ad-rows">'+pracRowBtn('pat:'+pat.key,'Read it as a pattern',pat.state==='confirmed'?'Confirmed':'Unanswered')+'</div>':'');
 pracShell(nm,h);}

/* THE ONE ROUTER. kind:key, from the page or from inside a drill. A live
   client (PL.sel set, no PEOPLE row) answers addr: out of its own published
   carry list rather than out of W, round [Phase 1] point 9; every other
   kind needs the example's own practice history and has no live equivalent
   yet (Phase 2's job, the full body port and the ritual proposals). */
function pracOpen(k){
 if(!k)return;
 var i=k.indexOf(':'), kind=k.slice(0,i), key=k.slice(i+1);
 if(PRAC_SEL==null&&typeof PL!=='undefined'&&PL.sel){
  if(kind!=='addr')return;
  var g=(typeof pracLiveActive==='function'?pracLiveActive():[]).filter(function(x){return x.id===PL.sel;})[0];
  if(!g)return;
  var row=(typeof plLiveAddrRow==='function')?plLiveAddrRow(g.id,+key):null;
  PRAC_PICK=k; pracMark();
  return pracDrillAddrLive(plNameOf(g),+key,row?row.sq:null,(typeof plLiveLoop==='function')?plLiveLoop(g.id):null);}
 var p=PEOPLE[PRAC_SEL]; if(!p)return;
 var R=pracEx(p);
 PRAC_PICK=k; pracMark();
 if(kind==='seat')return pracDrillSeat(p,key);
 if(kind==='addr')return pracDrillAddr(p,R,+key);
 if(!R)return;
 if(kind==='fig')return pracDrillFig(p,R,key);
 if(kind==='day')return pracDrillDay(p,R,key);
 if(kind==='pat')return pracDrillPat(p,R,key);
 if(kind==='dec')return pracDrillDec(p,R,key);}
/* which element is open in Selection, marked on the page so the eye can go
   from the answer back to the question */
function pracMark(){
 ['prlist','prac','prrun'].forEach(function(id){
  var host=$(id); if(!host)return;
  host.querySelectorAll('[data-prd]').forEach(function(e){
   var on=e.getAttribute('data-prd')===PRAC_PICK;
   e.classList.toggle('pr-sel',on);
   if(e.tagName==='BUTTON')e.setAttribute('aria-pressed',on?'true':'false');});});}
function pracWireIn(root){
 root.querySelectorAll('[data-prd]').forEach(function(e){
  var go=function(){pracOpen(e.getAttribute('data-prd'));};
  e.onclick=go;
  if(e.tagName!=='BUTTON')e.onkeydown=function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go();}};});}
/* A PRACTITIONER'S DRILL NEVER OUTLIVES ITS PAGE OR ITS CLIENT. Selection is
   one panel shared by every surface, so a drill about Diane left in it would
   sit beside the Field reading as the person's own. Cleared on a change of
   client and on leaving the page (setTab, ui/panels.js), and every host this
   page owns is emptied on the way out for the reason Summary's is: a hidden
   surface holding an example's history is still in the document asserting
   it. */
function pracDrillClear(){
 PRAC_PICK=null;
 var b=document.getElementById('rdrill');
 if(b&&b.querySelector('[data-prdrill]')){b.innerHTML='';b.style.display='none';
  var n=document.getElementById('rdrill-none'); if(n)n.style.display='';}}
function pracLeave(){
 pracDrillClear(); PRAC_BOOTED=false;
 ['prlist','prac','prrun','prnotes'].forEach(function(id){var h=$(id); if(h)h.innerHTML='';});}
function pracSelNone(open){
 var none=document.getElementById('rdrill-none'), d=document.getElementById('pr-selnone');
 if(!d&&none&&none.parentNode){d=document.createElement('div'); d.id='pr-selnone'; d.className='rel-note';
  none.parentNode.insertBefore(d,none.nextSibling);}
 if(d)d.textContent=open
  ?'Nothing selected. Press a figure, a day, a pattern or a place on the body to read it here.'
  :'Nothing selected. Open a client or a worked example on the left.';}

/* ============================================================
   THE ONE RENDER, across every host this page owns: #prlist (left rail),
   #prac (centre), #prrun (right rail, before Selection) and #prnotes (right
   rail, after it). Selection itself is rdShell's, answered by pracOpen.

   DEFAULT SELECTION, round [Phase 1], the owner's own ruling that the
   centre must never be empty: with nothing open yet this render picks the
   first row by Attention, a live client first if one is live and loaded at
   this moment, an example otherwise, because the roster is read over the
   network and often is not back yet on the very first paint. Once, per
   visit to the page: pressing Back to the list is a real "nothing open"
   and must not be fought by the same rule that filled it in the first place.
   ============================================================ */
var PRAC_BOOTED=false;
function pracAutoOpen(){
 if(PRAC_BOOTED)return;
 PRAC_BOOTED=true;
 if(PRAC_SEL!=null||(typeof pracLiveOpen==='function'&&pracLiveOpen()))return;
 var live=pracLiveSorted();
 if(live.length){PRAC_SEL=null; PL.sel=live[0].id; return;}
 var ids=pracSorted();
 if(ids.length)PRAC_SEL=ids[0];}
function renderPrac(){
 var lhost=$('prlist'), chost=$('prac'), rhost=$('prrun'), nhost=$('prnotes');
 if(!lhost&&!chost)return;
 pracCss();
 pracAutoOpen();
 var exOpen=(PRAC_SEL!=null&&PEOPLE[PRAC_SEL])?PEOPLE[PRAC_SEL]:null;
 var liveOpen=(!exOpen&&typeof pracLiveOpenGrant==='function')?pracLiveOpenGrant():null;
 pracSelNone(exOpen||liveOpen?{nm:exOpen?exOpen.nm:plNameOf(liveOpen)}:null);
 if(lhost)lhost.innerHTML=pracListHtml();
 var reduced=!!(window.matchMedia&&window.matchMedia('(max-width:900px)').matches);
 if(chost){
  var d=exOpen?pracCentreData(exOpen):(liveOpen&&typeof plCentreData==='function'?plCentreData(liveOpen):null);
  chost.innerHTML=pracCentreHtml(d,reduced);
  if(d&&!d.unread)pracFigPaint(chost,d.carry,reduced);}
 if(rhost){
  var runHtml=exOpen?pracExampleRunHtml(exOpen)
   :(liveOpen&&typeof plRunHtml==='function'?plRunHtml(liveOpen):'<p class="pr-empty">Open a client to see what is running.</p>');
  pracRunPaint(rhost,runHtml);}
 if(nhost)nhost.innerHTML=pracNotesHtml(pracNoteKey(),exOpen?exOpen.nm:(liveOpen?plNameOf(liveOpen):''));
 pracWire();
 if(typeof pracLiveWire==='function')pracLiveWire();
 pracMark();}

function pracWire(){
 var lhost=$('prlist'); if(!lhost)return;
 lhost.querySelectorAll('[data-pri]').forEach(function(b){
  b.onclick=function(){var i=+b.getAttribute('data-pri');
   if(i!==PRAC_SEL){pracDrillClear(); PRAC_ALLPAT=false;}
   if(typeof pracLiveClear==='function')pracLiveClear();
   PRAC_SEL=i; renderPrac();};});
 lhost.querySelectorAll('[data-prs]').forEach(function(b){
  b.onclick=function(){PRAC_SORT=b.getAttribute('data-prs'); renderPrac();};});
 var signin=lhost.querySelector('[data-pr="signin"]');
 if(signin)signin.onclick=function(){ACC_OPEN='account'; setTab(TAB.SETTINGS);};
 var inv=lhost.querySelector('[data-pr="invite"]');
 if(inv&&typeof plInviteOpen==='function')inv.onclick=plInviteOpen;
 ['prac','prrun'].forEach(function(id){var h=$(id); if(h)pracWireIn(h);});
 var rhost=$('prrun');
 if(rhost){
  var all=rhost.querySelector('[data-prall]');
  if(all)all.onclick=function(){PRAC_ALLPAT=!PRAC_ALLPAT; renderPrac();};}
 var chost=$('prac');
 if(chost){
  chost.querySelectorAll('[data-prface]').forEach(function(b){
   b.onclick=function(){PRAC_FACE=b.getAttribute('data-prface'); renderPrac();};});}
 var nhost=$('prnotes');
 if(nhost){
  var f=nhost.querySelector('#prnoteform');
  if(f)f.onsubmit=function(e){
   e.preventDefault();
   var t=$('prnotetxt'), key=pracNoteKey();
   if(!key||!t)return;
   if(pracNoteAdd(key,t.value)){t.value=''; renderPrac();}};}}
