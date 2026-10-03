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

   NOTHING HERE READS ANOTHER PERSON'S RECORD, and nothing can: sign in has
   existed since 30 September (ui/auth.js), but no store holds a record off
   the device and there is no grant. CLAUDE.md names a practitioner seeing a
   person's self report as a consequential grant that needs consent, a
   visible list of who has sight, and revocation, and none of the three
   exists. The page says so in the stub pattern account.js set down: full
   opacity, the real label, "not built yet" where a value would sit, and
   nothing that takes a press and then refuses.
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

   The rails go the way they go on Settings. A practitioner's list of other
   people is not a reading of this person's field, and the rails beside it
   are this person's field. The lshut form is written out because the rule
   that narrows a shut left rail carries one class more than a plain
   tab-prac rule and would win.

   THE THREE COLUMN LAYOUT BELOW IS NEW, round PT, replacing the dashed
   sketch (three identical rows, three stub buttons) with the client list,
   the reading and the notes. It does not reuse .ac-wrap, which Account
   caps at 980px for a single topic read top to bottom: this page is three
   things read side by side, so it gets its own grid, width matching the
   Field's own stage rather than a settings column. Everything inside each
   column is still .ac-grp/.ac-row/.ac-gh/.ac-rl/.ac-rv, the account area's
   own card and row, so a practitioner reading this page is reading the
   same product and not a second one wearing its colours. */
function pracCss(){
 if(document.getElementById('pr-css'))return;
 var st=document.createElement('style'); st.id='pr-css';
 st.textContent=[
  /* one literal and not two: split across two, the voice gate read the first
     half as a figure's label standing over the second */
  '@media not all and (max-width:720px){.top[data-sec="practitioner"] #tabbar .tabgrp:not([data-sec="practitioner"]){display:none}}',
  /* THE RIGHT RAIL COMES BACK, CARRYING SELECTION ONLY, round QB. His words:
     "if I select any of the analytic information, telemetry information, or
     graph information, it shows up on the right-hand side of the screen."
     The product already has that rule and one panel for it: every element
     that carries data opens a drill in the right rail's Selection section
     (ui/drills.js, rdShell), and round PE gave the Character page the same
     arrangement, the rail stepping aside to Selection and the page's own
     section. This page has no rail section of its own, so the rail shows
     Selection alone. The left rail stays shut: it is the practitioner's own
     field, and a list of other people beside it reads as one of them. The
     track is the rail's usual 336, and a shut rail keeps its 58 pixel fold,
     the two lines Ritual and Accountability already carry for a page with a
     right rail and no left one. */
  'body.tab-prac .mid>#lcol{display:none}',
  'body.tab-prac #rpanel>*:not(.rfold):not([data-sec="sel"]){display:none!important}',
  '@media (min-width:1181px){body.tab-prac .mid,body.lshut.tab-prac .mid{grid-template-columns:minmax(0,1fr) 336px}'
   +'body.rshut.tab-prac .mid,body.lshut.rshut.tab-prac .mid{grid-template-columns:minmax(0,1fr) 58px}}',
  /* the Selection empty line names what to press on this page and not the
     Field's address, law, saboteur and core, none of which is here */
  'body:not(.tab-prac) #pr-selnone{display:none}',
  'body.tab-prac #rdrill-none{display:none!important}',
  '#rdrill[style*="block"]~#pr-selnone{display:none}',
  '.pr-wrap{display:flex;flex-direction:column;gap:14px;width:100%;max-width:1400px;margin:0 auto;padding:4px 2px 28px}',
  /* the one line under the heading that says what this mode is, round RB,
     held to a reading measure so it never runs the full 1400 */
  '.pr-what{margin:-4px 0 0;max-width:68ch}',
  /* on a phone with an example open, the list column is hidden and so is
     this line, which is about the list and would push the reading down */
  '@media (max-width:900px){.pr-wrap[data-open="1"] .pr-what{display:none}}',
  /* TWO COLUMNS, NOT THREE, since the right one is the rail's Selection now:
     the list, and the open client. The client splits in two side by side
     when the room is there, what moved on the left and what is held on the
     right, and stacks when it is not. */
  '.pr-cols{display:grid;grid-template-columns:272px minmax(0,1fr);gap:14px;align-items:start}',
  '@media (max-width:1180px){.pr-cols{grid-template-columns:260px minmax(0,1fr)}}',
  '.pr-mid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:14px;align-items:start}',
  '.pr-mid>.pr-head{grid-column:1/-1}',
  '.pr-stack{display:flex;flex-direction:column;gap:14px;min-width:0}',
  '@media (max-width:1500px){.pr-mid{grid-template-columns:minmax(0,1fr)}}',
  /* BELOW THIS WIDTH THE LIST AND THE OPEN CLIENT TRADE PLACES, the way the
     Field's own sheets do on a phone, because 272 plus a reading plus a
     notes column has no room to sit side by side under about 900px. The
     wrap carries which one is open so CSS decides what shows, and the one
     hidden state is "nothing is open yet", which is not a width rule at
     all and holds at every size. */
  '@media (max-width:900px){.pr-cols{grid-template-columns:1fr}'
   +'.pr-wrap[data-open="1"] .pr-list-col{display:none}'
   +'.pr-wrap:not([data-open="1"]) .pr-mid{display:none}}',
  '.pr-back{display:none}',
  '@media (max-width:900px){.pr-wrap[data-open="1"] .pr-back{display:flex}}',
  '.pr-sort{display:flex;align-items:center;gap:6px;margin:11px 15px 10px}',
  /* THE TAP FLOOR IS 44, EVERYWHERE. tests/design.js gate 8 caught these at
     30: a pill sized to its text and not to a finger, the same defect the
     account switches were built to avoid (.ac-sw is var(--tap) tall). The
     pill still reads small, at 30px of visible height inside a 44px box,
     because a 44px high pill between two client rows would read as a much
     louder control than a sort toggle is. */
  '.pr-sort button{min-width:44px;min-height:var(--tap);padding:0 12px;border-radius:999px;'
   +'border:1px solid var(--edge);background:transparent;color:var(--dim);font-family:var(--sans);'
   +'font-size:12.5px;cursor:pointer}',
  '.pr-sort button[aria-pressed="true"]{color:var(--ink);border-color:var(--c);background:var(--panel-2)}',
  '.pr-list-col{display:flex;flex-direction:column;gap:14px}',
  '.pr-client{width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid var(--edge);'
   +'display:flex;gap:10px;align-items:flex-start;padding:10px 15px;min-height:56px;cursor:pointer;'
   +'font-family:var(--sans)}',
  '.pr-client:last-child{border-bottom:0}',
  '.pr-client:hover{background:var(--panel-2)}',
  '.pr-client.on{box-shadow:inset 3px 0 0 var(--c);background:var(--panel-2)}',
  /* THE ROW CIRCLE WAS A FLAT TINT AND AN INITIAL, the same for all ten rows
     bar the letter, which a design pass read as "mean nothing". It is a tiny
     copy of the centre ring instead (pracMiniRing), one arc a seat, so the
     shape of a client's field is visible closed, before a row is ever opened. */
  '.pr-av{width:30px;height:30px;flex:0 0 auto}',
  '.pr-miniring{width:100%;height:100%;display:block}',
  /* NAME AND STATE EACH TAKE THEIR OWN LINE. Both are plain <span>s so the
     two ran together inline with nothing to break them, "Gordon exampleNot
     opened yet." on one line with no gap at the join: caught in the first
     screenshot of this page, round PT. */
  '.pr-cinfo{min-width:0;flex:1 1 auto;display:flex;flex-direction:column;gap:2px}',
  '.pr-cnm{display:block;font-size:14px;color:var(--ink);font-weight:500}',
  '.pr-cnm em{font-style:normal;font-weight:400;color:var(--dim)}',
  '.pr-cst{font-size:12.5px;color:var(--dim);line-height:1.5;margin-top:2px}',
  '.pr-empty{padding:13px 15px;font-size:14px;color:var(--dim);line-height:1.6}',
  /* THE RING, centre column. One SVG of seven arcs (pracRingSvg), equal angle
     each, a seat's own colour at an opacity its own held total earns: the
     same language stDrawRing already draws on Story, in SVG rather than a
     canvas because this card has no animation loop to justify one. The tier
     word sits over the hole in the middle as real HTML and not SVG text, so
     unp() can carry its tooltip, and the full sentence TIERDEF already
     writes for that tier sits in the lead paragraph under it: the first
     always visible, so a hover is never the only way to the meaning. */
  '.pr-ringwrap{position:relative;width:208px;max-width:100%;margin:6px auto 0}',
  '.pr-ringsvg{display:block;width:100%;height:auto}',
  /* each arc is drawn thin and pressed thick: a transparent stroke forty
     wide over the drawn one is the finger's target, the 44 floor on a ring */
  '.pr-ringsvg .pr-hit{cursor:pointer;pointer-events:stroke}',
  '.pr-ringsvg .pr-hit:focus{outline:none;stroke:var(--edge-2);stroke-opacity:.5}',
  '.pr-ringsvg .pr-hit.pr-sel{stroke:var(--accent);stroke-opacity:.22}',
  '.pr-ringmid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
   +'text-align:center;padding:0 46px}',
  '.pr-ringtier{font-size:15px;font-weight:600;color:var(--ink);line-height:1.3}',
  /* A SEAT'S ADDRESSES, in Selection now: the seat groups that sat in the
     page's own right column went with that column, round QB, and a seat is
     opened from its arc. Inside the rail panel, so the indent is the rail's. */
  '.pr-addr{padding:8px 0 10px;border-top:1px solid var(--edge)}',
  '.pr-addr:first-of-type{border-top:0}',
  '.pr-addr-k{font-size:13.5px;font-weight:600;color:var(--ink);text-align:left}',
  '.pr-addr-x{font-size:13px;color:var(--mid);line-height:1.55;margin-top:3px}',
  '.pr-meter{height:4px;border-radius:2px;background:var(--sunk);margin-top:7px;overflow:hidden}',
  '.pr-meter i{display:block;height:100%;border-radius:2px;background:var(--c)}',
  /* THE FIGURES are Your patterns' own four (ui/loopread.js .lp-f), made
     presses: each one opens its list in Selection */
  '.pr-figs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:12px 15px 14px}',
  '@media (max-width:720px){.pr-figs{grid-template-columns:repeat(2,minmax(0,1fr))}}',
  'button.lp-f{min-height:var(--tap);text-align:left;background:transparent;cursor:pointer;font-family:var(--sans)}',
  'button.lp-f:hover,.pr-pat:hover,.pr-day:hover,.pr-link:hover{background:var(--panel-2)}',
  '.pr-sel{box-shadow:inset 0 0 0 2px var(--accent)}',
  '.pr-say{margin:12px 15px 15px;font-size:15px;line-height:1.65;color:var(--ink)}',
  '.pr-say p{margin:0 0 6px}.pr-say p:last-child{margin:0}',
  /* THE DAYS. Three rows of seven, oldest first, the last cell yesterday: a
     week to a row, so a run of misses reads as a gap in a row. 44 a cell,
     the floor, which also sets the strip's width and fits a phone. */
  '.pr-days{display:grid;grid-template-columns:repeat(7,44px);gap:5px;padding:12px 15px 6px}',
  '.pr-day{margin:0;width:44px;height:44px;border-radius:var(--r-xs);border:1px solid var(--edge);background:var(--sunk);'
   +'display:flex;align-items:flex-end;justify-content:flex-end;padding:3px 5px;box-sizing:border-box;'
   +'font-family:var(--num);font-size:11px;color:var(--dim);font-variant-numeric:tabular-nums}',
  'button.pr-day{cursor:pointer}',
  '.pr-day.st-completed{background:var(--c);border-color:var(--c);color:var(--bg)}',
  '.pr-day.st-partial{background:linear-gradient(to top,var(--c) 50%,var(--sunk) 50%);border-color:var(--c)}',
  '.pr-day.st-skipped{border-style:dashed;border-color:var(--mid);background:transparent}',
  /* a miss is struck through and not painted red: a missed day is a fact
     about a schedule, and alarm colour on it is a penalty the product rules out */
  '.pr-day.st-missed{background:linear-gradient(135deg,transparent 46%,var(--mid) 46%,var(--mid) 54%,transparent 54%);'
   +'border-color:var(--mid);color:var(--ink)}',
  '.pr-day.st-scheduled{background:transparent;border-color:var(--c)}',
  '.pr-key{display:flex;flex-wrap:wrap;gap:6px 14px;padding:4px 15px 14px;font-size:12.5px;color:var(--dim)}',
  '.pr-key span{display:inline-flex;align-items:center;gap:6px}',
  '.pr-key i{width:12px;height:12px;border-radius:3px;border:1px solid var(--edge);background:var(--sunk);display:inline-block}',
  '.pr-key i.st-completed{background:var(--c);border-color:var(--c)}',
  '.pr-key i.st-partial{background:linear-gradient(to top,var(--c) 50%,var(--sunk) 50%);border-color:var(--c)}',
  '.pr-key i.st-skipped{border-style:dashed;border-color:var(--mid);background:transparent}',
  '.pr-key i.st-missed{background:linear-gradient(135deg,transparent 42%,var(--mid) 42%,var(--mid) 58%,transparent 58%);border-color:var(--mid)}',
  '.pr-key i.st-scheduled{background:transparent;border-color:var(--c)}',
  /* the patterns, one press each, the same row Your patterns draws */
  '.pr-pats{display:flex;flex-direction:column;gap:8px;padding:12px 15px 14px}',
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
  '.pr-note-item{padding:9px 15px;border-bottom:1px solid var(--edge);font-size:13px;color:var(--ink);line-height:1.5}',
  '.pr-note-item:last-child{border-bottom:0}',
  '.pr-note-date{display:block;font-size:11.5px;color:var(--dim);margin-bottom:2px}',
  '.pr-note-form{padding:11px 15px}'
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
 if(top&&top.getAttribute('data-sec')==='practitioner'){
  var k=SECOF(TAB.FIELD), pb=document.querySelector('#secbar .secb[data-sec="'+k+'"]');
  top.setAttribute('data-sec',k);
  if(pb&&typeof secAlign==='function'&&!document.querySelector('#secbar .secb[aria-pressed="true"]')){
   pb.setAttribute('aria-pressed','true'); secAlign(); pb.setAttribute('aria-pressed','false');}}
 if(typeof SEC_LAST!=='undefined')delete SEC_LAST.practitioner;
 if(S.tab===TAB.PRACTITIONER)setTab(TAB.FIELD);}

/* ============================================================
   PR1 TO PR4, round PT: the client list, the reading from structure, private
   notes, and the honest empty sight list. Built against the example roster,
   never a real person: there is no sign in, no store and no grant, which is
   exactly as true as it was in the sketch this replaces, and the page still
   says so.

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
   scale the ICPs do not reach on their own: Gordon near the floor (Collapsed,
   a defended field that calls itself fine), Ana in the middle (Oscillating,
   "in the middle of something"), Abraham near the ceiling (Embodied, real
   load still in it), and Wren at the top (Mastery, one thing still held).
   Rosa, Tomas and Nkem were left out as close seconds to Wren, Gordon and
   Diane respectively, and Lance was left out because his table is the
   owner's own simulated self and listing him as a "client" among examples
   reads as the one name on this page that is not an example.
   THE ROSTER ABOVE IS THE ONE THESE TEN WERE CHOSEN FROM, and it is gone.
   Round QD, 2 October, cut PEOPLE to twelve examples, these ten plus Rosa and
   Tomas, and four of the owner (Lance 15, 50, 85 and 100). The ten stand as
   they were, and the four of him stay off this list for the same reason the
   first Lance was: they are the owner and not a client. */
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
 S.dom=p.dom;S.a1=p.a1;S.a2=p.a2;
 S.doms=p.doms?p.doms.slice():[p.dom];
 S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
 S.roots=p.roots?p.roots.slice():[];
 buildSoul();
 CHARGES.forEach(function(c){
  S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 if(!PROF_BY[p.nm]){
  var blank=blankProfile(p.nm);
  if(p.intakeAnswers)blank.intake.answers=Object.assign({},p.intakeAnswers);
  PROF_BY[p.nm]=blank;}
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
   from. Measured here on the roster this page carries: Sofia carries 52
   addresses and nothing crosses the line, Marcus 99 and nothing crosses,
   so a sentence built on r.carrying.length would have told a practitioner
   "52 addresses are carrying" directly above a list that then printed
   nothing, the exact self-contradiction CLAUDE.md names as a fabricated or
   lying surface. The sentence below reads the loaded count, the one the
   list is actually built from, and when that is zero it says what analytics.js
   already says in the same spot: the heaviest address by name, under the
   line, rather than a flat "nothing is carrying" that is not true either. */
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
 var snap={cq:r.CQ,tier:(r.complete&&r.tier)?r.tier:null,tierDef:tierObj?tierObj.def:'',unread:r.unread,
  darkB:r.darkB,loaded:loaded,top:top,
  heaviest:r.heaviest?{k:r.heaviest.k,b:r.heaviest.b,sq:r.heaviest.sq}:null};
 S.dom=oldDom;S.a1=oldA1;S.a2=oldA2;S.doms=oldDoms;S.arcs=oldArcs;S.roots=oldRoots;S.rec=oldRec;
 CHARGES.forEach(function(c){S.charge[c]=oldCharge[c];S.replace[c]=oldReplace[c];});
 SINAMES.forEach(function(l){S.law[l]=oldLaw[l];LAW_UNSET[l]=oldUnset[l];LAW_SEED[l]=oldSeed[l];});
 LAW_REC=oldLawRec;
 /* repair W and DOMAIN, which compute() just overwrote in place, before
    anything else in the app reads them again */
 buildSoul(); compute();
 return (PRAC_RCACHE[p.nm]=snap);}
function pracTierWord(snap){return snap.unread||!snap.tier?'not read yet':snap.tier.toLowerCase();}
/* DEVICE STORAGE, NEVER THE PROFILE. The same store the practitioner switch
   itself uses (devGet/devSet, engine/schema.js), under two keys of its own:
   when this browser last opened each example, so the list can say what
   changed, and the notes a practitioner wrote on this device. Neither ever
   touches a profile or goes near pPersist, and a failed write is reported
   through status() and not swallowed, the same rule pracSwitch follows. */
function pracSeenAll(){var o=devGet('pracSeen'); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}
function pracSeenSet(nm,tier){
 var o=pracSeenAll(); o[nm]={tier:tier,at:new Date().toISOString()};
 var r=devSet('pracSeen',o);
 if(!r.ok&&typeof status==='function')
  status('The last-opened date for '+nm+' was not saved. This browser would not keep it.','fail');
 return r.ok;}
function pracNotesAll(){var o=devGet('pracNotes'); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}
function pracNotesFor(nm){var l=pracNotesAll()[nm]; return Array.isArray(l)?l:[];}
function pracNoteAdd(nm,text){
 text=(text||'').trim(); if(!text)return false;
 var o=pracNotesAll(), list=pracNotesFor(nm).slice();
 list.push({t:new Date().toISOString(),text:text}); o[nm]=list;
 var r=devSet('pracNotes',o);
 if(!r.ok){if(typeof status==='function')
   status('The note on '+nm+' was not saved. This browser would not keep it.','fail'); return false;}
 if(typeof status==='function')status('Note saved.','ok');
 return true;}
/* THE LIST ROW'S ONE LINE. What changed since this browser last opened this
   example, in words, never a score: round PQ. Honest in both directions, a
   first visit says so rather than inventing a history, and a second visit
   compares two real tier words rather than two numbers, because a tier word
   is the thing a practitioner already reads everywhere else in the product.
   Each tier word is wrapped in unp(), the tooltip the product already has
   (seat:root and its six siblings use the same one): round PO's unpack rule
   named every tier word on this page as printed with no meaning beside it,
   which gloss.js now carries as tier:<name>, built off TIERDEF the same way
   law: and archetype: already are. The return value therefore carries real
   markup and is used as given, not re-escaped. */
function pracClientLine(p){
 var snap=pracRead(p), now=pracTierWord(snap), seen=pracSeenAll()[p.nm];
 var nowU=unp(now,null,'tier');
 if(!seen)return 'Not opened yet. Reads '+nowU+' today.';
 var was=(seen.tier||'not read yet').toLowerCase();
 if(was===now)return 'Quiet. Still reads '+nowU+'.';
 return 'Reading moved from '+unp(was,null,'tier')+' to '+nowU+' since you last opened this.';}
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
function pracList(){
 var ids=pracSorted(), rows=ids.map(function(i){
  var p=PEOPLE[i], on=(PRAC_SEL===i);
  return '<button type="button" class="pr-client'+(on?' on':'')+'" data-pri="'+i+'" aria-pressed="'+on+'">'
   +'<span class="pr-av">'+pracMiniRing(pracRead(p))+'</span>'
   +'<span class="pr-cinfo"><span class="pr-cnm">'+esc(p.nm)+' <em>example</em></span>'
   +'<span class="pr-cst">'+pracClientLine(p)+'</span></span></button>';}).join('');
 return '<div class="pr-sort">'
  +'<button type="button" data-prs="attn" aria-pressed="'+(PRAC_SORT==='attn')+'">Attention</button>'
  +'<button type="button" data-prs="name" aria-pressed="'+(PRAC_SORT==='name')+'">Name</button></div>'
  +(rows||'<div class="pr-empty">No example people are loaded.</div>')
  /* never a real person, never a server, said once at the foot of the list
     and not repeated under every row, and in plain words: round 25 September
     ruled against shorthand reaching the person, so neither the research
     term for the six and the names PRACTITIONER-STORY.md uses for the grant
     system print here any more */
  /* the second sentence moved to Your clients above, round RB, which is
     where the real list now says it is empty and why */
  +'<div class="ac-gf">Ten of the product’s worked examples, not clients, picked to cover the '
  +'whole range from the heaviest field to the lightest. Open one to practise reading.</div>';}
/* ONE RING, SEVEN SEATS. Each arc is one of the seven seats (BANDS), equal
   angle so the shape never distorts, its colour at full strength and the
   rest dimmed by how much that seat actually holds against the heaviest
   seat here: the same language Story's own ring view draws (stDrawRing,
   ui/storyui.js), an SVG rather than a canvas because nothing here animates.
   data-prseat makes every arc a button; pracWire reads it the same way it
   reads a seat's own header in the grouped list below. */
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
  /* THE MINI RING DREW AS ONE SMUDGED MARK, THE SAME ON EVERY ROW, because
     this closed the opening tag only on the branch that adds the button
     attributes: withButtons false left "<path ...opacity=\"0.9\"</path>"
     with no ">" between them, which a browser's own error recovery then
     folded every one of the seven arcs into. Caught by reading the raw
     markup for three different clients and finding it identical where the
     data was not (tools, not screenshots, the rule this file already keeps). */
  /* AN ARC IS A PRESS NOW, round QB, and it is pressed on a stroke forty
     wide laid over the drawn one, transparent, so the target meets the 44
     floor while the ring keeps its weight. It opens the seat in Selection. */
  var d='M'+x0+' '+y0+' A'+r+' '+r+' 0 0 1 '+x1+' '+y1;
  var drawn='<path d="'+d+'" fill="none" stroke="'+seatCol(b)+'" stroke-width="'+sw+'" opacity="'+op+'"'
   +(withButtons?' pointer-events="none"':'')+'/>';
  if(!withButtons)return drawn;
  return drawn+'<path class="pr-hit" d="'+d+'" fill="none" stroke="transparent" stroke-width="40"'
   +' data-prd="seat:'+esc(b)+'" tabindex="0" role="button" aria-label="'+esc(b)+'"><title>'+esc(b)+'</title></path>';}).join('');}
function pracRingSvg(snap){
 return '<svg viewBox="0 0 200 200" class="pr-ringsvg">'+pracArcs(snap.loaded,100,100,74,18,0.05,true)+'</svg>';}
/* THE SAME RING, SMALL AND QUIET, on a client's own row in the list: the
   row carried a flat tint and an initial before this, the same for every
   one of the ten bar the letter, which a design pass read correctly as a
   circle that means nothing. This means the same thing the big one does,
   at a glance, closed. */
function pracMiniRing(snap){
 return '<svg viewBox="0 0 40 40" class="pr-miniring" aria-hidden="true">'+pracArcs(snap.loaded,20,20,14,5,0.08,false)+'</svg>';}

/* ============================================================
   THE CLIENT'S ANALYTICS, round QB. His words: "when I select somebody
   within my cohort, it gives me their analytics... And if I select any of
   the analytic information, telemetry information, or graph information, it
   shows up on the right-hand side of the screen."

   WHAT IS READ. pracRead above is the structure, a real compute(). pracEx
   below is what moved: engine/pracex.js builds the example's practice
   history through practiceDo and reads it back with loopRead, the trace
   graph's one read (engine/loop.js), which is the same read the Field's
   Your patterns block makes. So a figure here and a figure there are one
   function's answer. Nothing on this page walks the graph.

   CONVERGE LATER. Your patterns (ui/loopread.js) is written to the person
   about themselves, "you said yes", and this page is a practitioner reading
   about somebody else, so the labels, figures and chain are its classes and
   its order but the sentences are third person, from the client: entries in
   the meaning table. The Daily Summary's page had not landed when this was
   built; the plain words card below is an interim, built off the same loop
   read, and should give way to that page's own component when it exists.

   EVERY PRESS GOES TO SELECTION. One attribute, data-prd, "kind:key", on
   every element that carries a figure, a day, a pattern, a seat or an
   address, on the page and inside a drill, and one handler for all of
   them, the rule this file already keeps for its own state. The drill is
   written through rdShell (ui/drills.js), so it has the same back control,
   the same close and the same escape as every other drill in the product.
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
   the days. Interim, see above. Third person, the client's name as subject,
   because the reader is the practitioner. No score and no total: a count
   of what happened, and never one set against a count of what could have. */
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

function pracSayCard(p,R){
 return '<div class="ac-grp"><div class="ac-gh">In plain words</div><div class="pr-say">'
  +pracSay(p,R).map(function(t){return '<p>'+t+'</p>';}).join('')+'</div></div>';}

/* THE FOUR FIGURES, Your patterns' own four. A zero is a dash, V8. */
function pracFigs(R){
 var L=R.loop, f=function(k,lab,n){
  return '<button type="button" class="lp-f" data-prd="fig:'+k+'" aria-label="'+esc(lab+', '+(n||'none'))+'">'
   +'<span class="lp-fl">'+esc(lab)+'</span><b class="lp-fv">'+(n?String(n):'–')+'</b></button>';};
 return '<div class="ac-grp"><div class="ac-gh">Patterns and practice</div><div class="pr-figs">'
  +f('confirmed','Confirmed',L.confirmed)+f('unanswered','Unanswered',L.unanswered)
  +f('declined','Declined',L.declined.length)+f('practised','Practised',L.practice.events)+'</div></div>';}

/* THE DAYS, the telemetry. A day something was scheduled on is a press; a
   day nothing was is a mark and not a control, because a press that opens
   "nothing scheduled" is a dead end. The key prints every state with its
   meaning beside it, round PO. */
function pracDaysCard(R){
 var cells=R.days.map(function(d){
  var lab=pracDayWord(d.day)+', '+pracStWord(d.status), n=String(+d.day.slice(8));
  if(d.status==='none')return '<span class="pr-day st-none" title="'+esc(lab)+'">'+n+'</span>';
  return '<button type="button" class="pr-day st-'+d.status+'" data-prd="day:'+d.day+'" aria-label="'+esc(lab)+'">'+n+'</button>';}).join('');
 var seen={}; R.days.forEach(function(d){seen[d.status]=1;});
 var key=PRAC_ST_ORDER.filter(function(st){return seen[st];}).map(function(st){
  return '<span><i class="st-'+st+'"></i>'+unp(pracStWord(st),pracCap(pracStWord(st)),'client')+'</span>';}).join('');
 return '<div class="ac-grp"><div class="ac-gh">Practice, the last '+PRAC_WINDOW_WORD+'</div>'
  +'<div class="pr-days">'+cells+'</div><div class="pr-key">'+key+'</div></div>';}

/* THE PATTERNS, confirmed first, the loop read's own order, then the
   practices turned down. LOOP_SHOW at a time, the working memory figure. */
function pracPatsCard(R){
 var L=R.loop, rows=L.patterns.map(function(x){
  return {k:'pat:'+x.key, nm:x.name, seat:pracPatSeat(x), st:x.state};});
 L.declined.forEach(function(d){
  rows.push({k:'dec:'+d.id, nm:d.patterns.join(', ')||'no named pattern', seat:'', st:'declined'});});
 if(!rows.length)return '<div class="ac-grp"><div class="ac-gh">Patterns</div>'
  +'<div class="pr-empty">Nothing read yet, so no pattern is traced.</div></div>';
 var show=PRAC_ALLPAT?rows:rows.slice(0,LOOP_SHOW);
 var lab={confirmed:'Confirmed', unanswered:'Unanswered', declined:'Declined'};
 return '<div class="ac-grp"><div class="ac-gh">Patterns</div><div class="pr-pats">'
  +show.map(function(r){
   return '<button type="button" class="pr-pat" data-prd="'+esc(r.k)+'">'
    +'<span class="lp-pn"><b>'+esc(r.nm)+'</b>'+(r.seat?'<em>'+esc(r.seat)+'</em>':'')+'</span>'
    +'<span class="lp-st lp-'+r.st+'">'+lab[r.st]+'</span></button>';}).join('')
  +(rows.length>LOOP_SHOW?'<button type="button" class="btn pr-more" data-prall="1" aria-expanded="'+PRAC_ALLPAT+'">'
   +(PRAC_ALLPAT?'Show the first '+LOOP_SHOW:'Show all '+rows.length)+'</button>':'')
  +'</div></div>';}

/* THE READING, the ring and the one heaviest address under it */
function pracRingCard(p){
 var snap=pracRead(p), now=pracTierWord(snap);
 var tierWord=snap.tierDef?unp(now,null,'tier'):esc(now);
 var n=snap.loaded.length, sent;
 /* THE HEAVIEST, NAMED ONCE. It reads snap.loaded[0], the heaviest single
    address, never r.darkB, the heaviest seat on average: a design review
    measured the two disagreeing on 6 of 10 clients when both shared one
    word. Under the line, not nothing: Sofia carries 52 addresses and none
    crosses sq 4, and she is never told she is empty. */
 var heavy=n?snap.loaded[0]:snap.heaviest;
 /* the heaviest is a row and not a word in the sentence: a 44 pixel press
    inside a line of text broke the line in two, measured in the first shot */
 var heavyRow=heavy?'<div class="pr-pats" style="padding-top:8px">'
  +pracRowBtn('addr:'+pracAddrIdx(heavy),heavy.k,pracAddrSeatSuffix(heavy)?'':heavy.b)+'</div>':'';
 if(n)sent='<b>'+n+'</b> address'+(n===1?' is':'es are')+' carrying. The heaviest:';
 else if(heavy)sent='Nothing is above the line. The heaviest, under it:';
 else sent='Nothing is carrying.';
 var body='<div class="pr-ringwrap">'+pracRingSvg(snap)
  +'<div class="pr-ringmid"><div class="pr-ringtier">'+tierWord+'</div></div></div>'
  +(snap.tierDef?'<p class="ac-lead" style="margin:14px 15px 0">'+esc(snap.tierDef)+'</p>':'')
  +'<p class="ac-lead" style="margin:10px 15px 0">'+sent+'</p>'+heavyRow;
 return accGroup('The reading',body,
   'One ring, seven seats. A brighter arc holds more charge at that seat. Press a seat to list '
   +'its addresses. Read off the structure, never off '+esc(p.nm)+'’s own words, which a '
   +'practitioner never sees without a separate yes of its own.');}
function pracAddrIdx(n){
 if(typeof n.i==='number')return n.i;
 for(var i=0;i<W.length;i++)if(W[i].k===n.k&&W[i].b===n.b)return W[i].i;
 return -1;}
function pracAddrSeatSuffix(n){
 var suf=' ('+n.b+')';
 return n.k.length>=suf.length&&n.k.slice(-suf.length)===suf;}
function pracNotesCard(p){
 var notes=pracNotesFor(p.nm).slice().reverse();
 var items=notes.map(function(n){
  var d=new Date(n.t); var when=isNaN(d)?n.t:d.toLocaleDateString();
  return '<div class="pr-note-item"><span class="pr-note-date">'+esc(when)+'</span>'+esc(n.text)+'</div>';
  }).join('');
 return accGroup('Notes on '+p.nm,
   '<form class="pr-note-form" id="prnoteform"><textarea class="pr-note-ta" id="prnotetxt" '
   +'placeholder="Write a note" aria-label="Write a note on '+esc(p.nm)+'"></textarea>'
   +'<div style="margin-top:8px"><button class="btn pri" type="submit">Save note</button></div></form>'
   +(items||'<div class="pr-empty">No notes yet.</div>'),
   'Saved to this device only, never to '+esc(p.nm)+'’s own record and never sent '+
   'anywhere. Sending a note on to the person it is about is not built yet.');}
/* ============================================================
   WHO HAS LET THIS PRACTITIONER SEE THEIR RECORD, round RB. The page above
   lists worked examples, which is the owner's own ruling ("Just do 10 of the
   clients from our profiles") and stays. What it never said, on the page
   itself, is the true state of the real list: empty, and why.

   ONE READER, AND IT IS EMPTY BECAUSE NOTHING CAN FILL IT. A yes is given by
   the person whose record it is, on their own Privacy page, and has to cross
   from their device to this one. This build has sign in (ui/auth.js) and
   nothing else on the server: no store holds a record off the device, and
   no route carries a yes, lists it on both sides or takes it back. CLAUDE.md
   names this a consequential grant that needs explicit consent, a visible
   list of who has sight, and revocation, never a silent default, so nothing
   here invents an entry, reads one out of device storage, or offers a
   control that would look like it sent a request. The day the server piece
   exists, this is the function that reads it, and every sentence on both
   pages that says "nobody" reads its length rather than the word.

   The shape an entry will carry is not decided here, on purpose. Who sees
   what (DECISIONS.md, "The practitioner": the tier scope, structure only or
   story with its own yes) is still open, and a field list written now would
   be a schema nobody ruled on. */
function pracSightList(){return [];}
function pracSightGroup(){
 var L=pracSightList();
 return accGroup('Your clients',
   accRow('People who let you see their record',L.length?String(L.length):'nobody yet'),
   'A person says yes on their own Privacy page before you see anything of theirs, and can '
   +'take it back with one press. This build has no way yet to let a practitioner see a record '
   +'on another device. Turning this mode on shares nothing of yours.');}

/* WHO ELSE CAN SEE THIS CLIENT, honestly not here. The mechanism that would
   list a second practitioner on a row like this does not exist in this
   build, so the stub says that in plain words rather than drawing an empty
   list that implies the mechanism is there. */
function pracSightStub(p){
 return accGroup('Who else can see '+p.nm,
   accStub('Other practitioners or services','not built yet'),
   'This waits on a way for a person to let a practitioner see their record, which this build '
   +'does not have yet. Until then the only route to this example is this device, and nothing '
   +'here is sent or shared.');}
/* THE WAY BACK TO THE SWITCH, on every state this renderer draws */
function pracModeGroup(){
 return accGroup('This mode',accAct('Practitioner mode','pracacc',{btn:'Open account'}));}

function pracDetail(){
 if(PRAC_SEL==null||!PEOPLE[PRAC_SEL])
  return '<div class="pr-mid" id="prmid"><div class="ac-grp pr-head"><div class="pr-empty">'
   +'Open a worked example on the left to read it.</div></div></div>';
 var p=PEOPLE[PRAC_SEL], snap=pracRead(p);
 pracSeenSet(p.nm,pracTierWord(snap));
 var head='<div class="ac-grp pr-head"><div class="ac-hd" style="padding:13px 15px 0">'
  +'<h2 class="kb-h">'+esc(p.nm)+'</h2></div>'
  +'<p class="ac-lead" style="margin:11px 15px 15px">'+esc(p.role)+(p.age?', '+esc(String(p.age)):'')
  +'. Example person, not a client. The practice history is written for this example and read by the '
  +'same engine a real record goes through.</p></div>';
 /* SILENT ON AN UNREAD FIELD, the rule every surface that prints a reading
    keeps: nothing below is drawn for a field nothing was read for */
 if(snap.unread)
  return '<div class="pr-mid" id="prmid">'+head+'<div class="ac-grp pr-head"><div class="pr-empty">'
   +'Nothing read yet, so there is nothing to show for '+esc(p.nm)+'.</div></div></div>';
 var R=pracEx(p);
 var left=R?pracSayCard(p,R)+pracFigs(R)+pracDaysCard(R)+pracPatsCard(R)
  :'<div class="ac-grp"><div class="pr-empty">No practice history is written for '+esc(p.nm)+'.</div></div>';
 return '<div class="pr-mid" id="prmid">'+head
  +'<div class="pr-stack">'+left+'</div>'
  +'<div class="pr-stack">'+pracRingCard(p)+pracNotesCard(p)+pracSightStub(p)+'</div></div>';}

/* ============================================================
   THE DRILLS. One per kind, each into Selection through rdShell. Every one
   names its client in the eyebrow, because the rail is not on the page and
   a reading with no name on it, beside a list of ten people, is a reading
   of whoever the eye lands on.
   ============================================================ */
function pracShell(p,h){
 /* a press made on this page is always answered in view: on a phone the
    rail is under the page, and there is no stage here to keep in sight */
 var was=RD_INRAIL; RD_INRAIL=true;
 try{rdShell('<div data-prdrill="'+esc(p.nm)+'">'+h+'</div>');}finally{RD_INRAIL=was;}
 var b=document.getElementById('rdrill');
 /* AND AGAIN ONCE IT IS FULL, stacked. rdOpen brings the section up before
    rdShell writes the drill into it, and at the foot of a phone's page the
    empty section cannot rise: measured at 390, the page stopped 2,137 down
    with Selection's top at 762 of 844 and the drill under the screen. */
 if(b&&b.closest&&window.matchMedia&&window.matchMedia('(max-width:1180px)').matches){
  var sec=b.closest('.lsec'); if(sec&&sec.scrollIntoView)try{sec.scrollIntoView({block:'start'});}catch(e){}}
 if(b){pracWireIn(b);
  ['rdback','rdx'].forEach(function(id){var e=document.getElementById(id);
   if(e)e.addEventListener('click',function(){PRAC_PICK=null; pracMark();});});}}
function pracEye(p,what){return '<div class="pm-eye plain">'+esc(p.nm)+', '+esc(what)+'</div>';}
function pracRowBtn(k,label,sub){
 return '<button type="button" class="ad-r pr-pat" data-prd="'+esc(k)+'"><span class="lp-pn"><b>'+esc(label)+'</b>'
  +(sub?'<em>'+esc(sub)+'</em>':'')+'</span></button>';}
/* an address's own three facts, off NODES, the same words the seat list
   carried before it moved here */
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
 var h=pracEye(p,'patterns and practice')+'<div class="ad-nm">'+pracCap(word)+'</div>'
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
 pracShell(p,h);}

function pracDrillDay(p,R,day){
 var d=null; R.days.forEach(function(x){if(x.day===day)d=x;}); if(!d)return;
 var x=pracProtoOf(R,d.protocol), a=pracProtoAddr(x), pat=a!==null?pracPatOfAddr(R,a):null;
 var h=pracEye(p,'one day of practice')+'<div class="ad-nm">'+esc(pracDayWord(d.day))+'</div>'
  +'<div class="ad-sub">'+esc(pracCap(pracStWord(d.status)))+'</div>'
  +'<p class="ad-p">'+esc(pracStMean(d.status))+'</p>';
 if(d.seconds)h+='<p class="ad-p">It ran for '+pracPl(Math.round(d.seconds/60),'minute','minutes')+'.</p>';
 if(a!==null&&BY[a])h+='<div class="pm-eye">Aimed at</div>'
  +'<div class="ad-rows">'+pracRowBtn(pat?'pat:'+pat.key:'addr:'+a,BY[a].k,BY[a].b)+'</div>';
 var miss=R.loop.misses.filter(function(m){return m.ritual===d.ritual;})[0];
 if(miss&&d.status==='missed')h+='<p class="ad-p">The last '+pracNumW(miss.run)+' times this ritual came due, it was not marked done.'
  +(miss.stage==='investigate'?' At three in a row, ask what got in the way: the time, the length, or the practice itself.':'')+'</p>';
 pracShell(p,h);}

/* THE WHY CHAIN, in the order lpChain draws it and with its classes, and in
   the third person: what was written, what was opened, what practice aims
   at it, and where the answer stands */
function pracChain(p,x,R){
 var st=[], nm=esc(p.nm);
 if(x.stories)st.push(['Written',pracPl(x.stories,'entry','entries')+', '
  +(x.named?'from '+nm+'’s own words':'placed by the seat the words pointed at')]);
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
 var h=pracEye(p,'one pattern')+'<div class="ad-nm">'+esc(x.name)+'</div>'
  +(seat?'<div class="ad-sub">'+unp(seat.toLowerCase(),seat+' seat','seat')+'</div>':'')
  +'<p class="ad-p">'+esc(unpackOf(x.state,'client'))+'</p>';
 if(x.address!==null){
  h+=pracAddrFacts(x.address);
  var sq=pracSqOf(p,x.address); if(sq!==null)h+=pracMeter(sq);}
 h+='<div class="pm-eye">The chain</div>'+pracChain(p,x,R);
 pracShell(p,h);}

function pracDrillDec(p,R,id){
 var d=null; R.loop.declined.forEach(function(y){if(y.id===id)d=y;}); if(!d)return;
 var h=pracEye(p,'a practice turned down')+'<div class="ad-nm">'+esc(d.patterns.join(', ')||'No named pattern')+'</div>'
  +'<p class="ad-p">'+esc(unpackOf('declined','client'))+'</p>'
  +'<p class="ad-p">A '+esc(d.cls||'')+' practice, turned down'+(d.at?' on '+esc(pracDayWord(d.at.slice(0,10))):'')
  +'. No reason was recorded.</p>';
 var x=pracProtoOf(R,d.id), a=pracProtoAddr(x);
 if(a!==null)h+=pracAddrFacts(a);
 pracShell(p,h);}

function pracDrillSeat(p,b){
 var snap=pracRead(p), list=snap.loaded.filter(function(n){return n.b===b;});
 var h=pracEye(p,'one seat')+'<div class="ad-nm">'+esc(b)+'</div>'
  +'<p class="ad-p">'+esc(unpackOf(b,'seat'))+'</p>';
 if(!list.length)h+='<p class="ad-p">Nothing at this seat is above the line.</p>';
 else h+='<p class="ad-p">'+pracPl(list.length,'address is','addresses are')+' carrying here, heaviest first.</p>'
  +list.map(function(n){
   var a=pracAddrIdx(n);
   return '<div class="pr-addr" style="--c:'+seatCol(b)+'"><button type="button" class="pr-link pr-addr-k" data-prd="addr:'+a+'">'+esc(n.k)+'</button>'
    +'<div class="pr-addr-x">Concerns '+esc(String(n.a||'').toLowerCase())+'. Shows up as '+esc(String(n.d||'').toLowerCase())+'.'
    +(n.nerve?' The nerve that serves this place is the '+esc(String(n.nerve).toLowerCase())+'.':'')+'</div>'
    +pracMeter(n.sq)+'</div>';}).join('');
 pracShell(p,h);}

function pracDrillAddr(p,R,a){
 var n=BY[a]; if(!n)return;
 var pat=R?pracPatOfAddr(R,a):null, sq=pracSqOf(p,a);
 var h=pracEye(p,'one address')+'<div class="ad-nm">'+esc(n.k)+'</div>'
  +'<div class="ad-sub">'+unp(String(n.b).toLowerCase(),n.b+' seat','seat')+'</div>'
  +pracAddrFacts(a)+(sq!==null?pracMeter(sq):'')
  +(pat?'<div class="ad-rows">'+pracRowBtn('pat:'+pat.key,'Read it as a pattern',pat.state==='confirmed'?'Confirmed':'Unanswered')+'</div>'
   :'<p class="ad-p">No practice is aimed here yet.</p>');
 pracShell(p,h);}

/* THE ONE ROUTER. kind:key, from the page or from inside a drill */
function pracOpen(k){
 var p=PEOPLE[PRAC_SEL]; if(!p||!k)return;
 var i=k.indexOf(':'), kind=k.slice(0,i), key=k.slice(i+1), R=pracEx(p);
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
 var host=$('prac'); if(!host)return;
 host.querySelectorAll('[data-prd]').forEach(function(e){
  var on=e.getAttribute('data-prd')===PRAC_PICK;
  e.classList.toggle('pr-sel',on);
  if(e.tagName==='BUTTON')e.setAttribute('aria-pressed',on?'true':'false');});}
function pracWireIn(root){
 root.querySelectorAll('[data-prd]').forEach(function(e){
  var go=function(){pracOpen(e.getAttribute('data-prd'));};
  e.onclick=go;
  if(e.tagName!=='BUTTON')e.onkeydown=function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go();}};});}
/* A PRACTITIONER'S DRILL NEVER OUTLIVES ITS PAGE OR ITS CLIENT. Selection is
   one panel shared by every surface, so a drill about Diane left in it would
   sit beside the Field reading as the person's own. Cleared on a change of
   client and on leaving the page (setTab, ui/panels.js), and the page host
   is emptied on the way out for the reason Summary's is: a hidden surface
   holding an example's history is still in the document asserting it. */
function pracDrillClear(){
 PRAC_PICK=null;
 var b=document.getElementById('rdrill');
 if(b&&b.querySelector('[data-prdrill]')){b.innerHTML='';b.style.display='none';
  var n=document.getElementById('rdrill-none'); if(n)n.style.display='';}}
function pracLeave(){pracDrillClear(); var h=$('prac'); if(h)h.innerHTML='';}
function pracSelNone(open){
 var none=document.getElementById('rdrill-none'), d=document.getElementById('pr-selnone');
 if(!d&&none&&none.parentNode){d=document.createElement('div'); d.id='pr-selnone'; d.className='rel-note';
  none.parentNode.insertBefore(d,none.nextSibling);}
 if(d)d.textContent=open
  ?'Nothing selected. Press a figure, a day, a pattern or a seat on '+open.nm+'’s page to read it here.'
  :'Nothing selected. Open a worked example on the left.';}

function pracWire(host){
 host.querySelectorAll('[data-pri]').forEach(function(b){
  b.onclick=function(){var i=+b.getAttribute('data-pri');
   if(i!==PRAC_SEL){pracDrillClear(); PRAC_ALLPAT=false;}
   PRAC_SEL=i; renderPrac();};});
 host.querySelectorAll('[data-prs]').forEach(function(b){
  b.onclick=function(){PRAC_SORT=b.getAttribute('data-prs'); renderPrac();};});
 pracWireIn(host);
 var all=host.querySelector('[data-prall]');
 if(all)all.onclick=function(){PRAC_ALLPAT=!PRAC_ALLPAT; renderPrac();};
 var back=host.querySelector('.pr-back');
 if(back)back.onclick=function(){pracDrillClear(); PRAC_SEL=null; renderPrac();};
 var accb=host.querySelector('#pracacc');
 if(accb)accb.onclick=function(){ACC_OPEN='account'; setTab(TAB.SETTINGS);};
 var f=host.querySelector('#prnoteform');
 if(f)f.onsubmit=function(e){
  e.preventDefault();
  var t=$('prnotetxt'), p=PEOPLE[PRAC_SEL];
  if(!p||!t)return;
  if(pracNoteAdd(p.nm,t.value)){t.value=''; renderPrac();}};}
function renderPrac(){
 var host=$('prac'); if(!host)return;
 pracCss();
 var open=(PRAC_SEL!=null&&PEOPLE[PRAC_SEL])?PEOPLE[PRAC_SEL]:null;
 pracSelNone(open);
 host.innerHTML='<div class="pr-wrap" style="--c:'+seatCol('Throat')+'" data-open="'+(open?'1':'0')+'">'
  +'<div class="ac-hd"><div class="pm-eye">Practitioner</div><h2 class="kb-h">Clients</h2></div>'
  /* WHAT THIS MODE IS, said on the page it opens, round RB: the page used to
     begin on a list of names with nothing saying whose they were or what a
     practitioner is in this product */
  +'<p class="ac-lead pr-what">For a coach or therapist who works with other people. A client '
  +'can let you see their reading, and can take that back. You never see their stories.</p>'
  +'<button type="button" class="btn pr-back">Back to clients</button>'
  +'<div class="pr-cols">'
  +'<div class="pr-list-col">'
  +pracSightGroup()
  +'<div class="ac-grp"><div class="ac-gh">Worked examples</div>'+pracList()+'</div>'+pracModeGroup()+'</div>'
  +pracDetail()
  +'</div></div>';
 pracWire(host);
 pracMark();}
