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

   NOTHING HERE READS ANOTHER PERSON'S RECORD, and nothing can: there is no
   sign in, no store and no grant. CLAUDE.md names a practitioner seeing a
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
  'body.tab-prac .mid,body.lshut.tab-prac .mid{grid-template-columns:1fr}',
  'body.tab-prac .mid .col{display:none}',
  '.pr-wrap{display:flex;flex-direction:column;gap:14px;width:100%;max-width:1400px;margin:0 auto;padding:4px 2px 28px}',
  '.pr-cols{display:grid;grid-template-columns:272px minmax(0,1fr) 304px;gap:14px;align-items:start}',
  /* the right column (notes, sight) rides under the reading on a narrower
     desktop rather than vanishing: nothing here is only for a wide screen */
  '@media (max-width:1180px){.pr-cols{grid-template-columns:260px minmax(0,1fr)}.pr-right{grid-column:1/-1}}',
  /* BELOW THIS WIDTH THE LIST AND THE OPEN CLIENT TRADE PLACES, the way the
     Field's own sheets do on a phone, because 272 plus a reading plus a
     notes column has no room to sit side by side under about 900px. The
     wrap carries which one is open so CSS decides what shows, and the one
     hidden state is "nothing is open yet", which is not a width rule at
     all and holds at every size. */
  '@media (max-width:900px){.pr-cols{grid-template-columns:1fr}'
   +'.pr-wrap[data-open="1"] .pr-list-col{display:none}'
   +'.pr-wrap:not([data-open="1"]) .pr-mid,.pr-wrap:not([data-open="1"]) .pr-right{display:none}}',
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
  '.pr-ringsvg path{cursor:pointer}',
  '.pr-ringsvg path:focus{outline:2px solid var(--accent);outline-offset:2px}',
  '.pr-ringmid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
   +'text-align:center;padding:0 46px}',
  '.pr-ringtier{font-size:15px;font-weight:600;color:var(--ink);line-height:1.3}',
  /* ADDRESSES GROUPED UNDER THEIR SEAT AND COLLAPSED, right column. One seat
     open at a time (PRAC_OPENSEAT), the heaviest by default, opened either
     from its own header here or by tapping its arc on the ring: the two
     controls write the same one state and this redraw is the only thing
     either of them does, the rule every other control on this page follows. */
  '.pr-seatgrp{border-bottom:1px solid var(--edge)}',
  '.pr-seatgrp:last-child{border-bottom:0}',
  '.pr-seathd{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;'
   +'min-height:var(--tap);padding:9px 15px;background:transparent;border:0;cursor:pointer;'
   +'font-family:var(--sans);font-size:14px;color:var(--ink);text-align:left}',
  '.pr-seatgrp.open .pr-seathd{color:var(--c)}',
  '.pr-seatct{font-family:var(--num);font-variant-numeric:tabular-nums;color:var(--dim);font-size:13px}',
  '.pr-seatbody{display:none}',
  '.pr-seatgrp.open .pr-seatbody{display:block}',
  '.pr-addr{padding:8px 15px 10px 29px;border-top:1px solid var(--edge)}',
  '.pr-seatbody .pr-addr:first-child{border-top:0}',
  '.pr-addr-k{font-size:13.5px;font-weight:600;color:var(--ink)}',
  '.pr-addr-x{font-size:13px;color:var(--mid);line-height:1.55;margin-top:3px}',
  '.pr-meter{height:4px;border-radius:2px;background:var(--sunk);margin-top:7px;overflow:hidden}',
  '.pr-meter i{display:block;height:100%;border-radius:2px;background:var(--c)}',
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
var PRAC_SEL=null, PRAC_SORT='attn', PRAC_OPENSEAT=null, PRAC_RCACHE={};
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
 var snap={cq:r.CQ,tier:(r.complete&&r.tier)?r.tier:null,tierDef:tierObj?tierObj.def:'',unread:r.unread,
  darkB:r.darkB,loaded:loaded,
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
   markup and is used as given, not re-escaped, the same as pracAddrCard(). */
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
  +'<div class="ac-gf">Ten of the product’s worked examples, not clients, picked to cover the '
  +'whole range from the heaviest field to the lightest. A real client list needs a way for a '
  +'person to let a practitioner see their record, which this build does not have yet.</div>';}
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
  return '<path d="M'+x0+' '+y0+' A'+r+' '+r+' 0 0 1 '+x1+' '+y1+'" fill="none" stroke="'+seatCol(b)
   +'" stroke-width="'+sw+'" opacity="'+op+'"'
   +(withButtons?' data-prseat="'+esc(b)+'" tabindex="0" role="button" aria-label="'+esc(b)+'">'
     +'<title>'+esc(b)+'</title></path>':'/>');}).join('');}
function pracRingSvg(snap){
 return '<svg viewBox="0 0 200 200" class="pr-ringsvg">'+pracArcs(snap.loaded,100,100,74,18,0.05,true)+'</svg>';}
/* THE SAME RING, SMALL AND QUIET, on a client's own row in the list: the
   row carried a flat tint and an initial before this, the same for every
   one of the ten bar the letter, which a design pass read correctly as a
   circle that means nothing. This means the same thing the big one does,
   at a glance, closed. */
function pracMiniRing(snap){
 return '<svg viewBox="0 0 40 40" class="pr-miniring" aria-hidden="true">'+pracArcs(snap.loaded,20,20,14,5,0.08,false)+'</svg>';}
function pracRingCard(p){
 var snap=pracRead(p), now=pracTierWord(snap);
 var tierWord=snap.tierDef?unp(now,null,'tier'):esc(now);
 var body='<div class="pr-ringwrap">'+pracRingSvg(snap)
  +'<div class="pr-ringmid"><div class="pr-ringtier">'+tierWord+'</div></div></div>'
  +(snap.tierDef?'<p class="ac-lead" style="margin:14px 15px 0">'+esc(snap.tierDef)+'</p>':'');
 return accGroup('The reading',body,
   'One ring, seven seats. A brighter, thicker arc holds more charge at that seat. '
   +'Tap a seat, on the ring or in the list on the right, to open its addresses.');}
/* THE HEAVIEST, NAMED ONCE. This used to read the heaviest SEAT on average
   (r.darkB, every address at that seat meaned together) in the sentence
   while the list beneath it was sorted by the heaviest single ADDRESS, two
   different facts sharing one word: a design review measured the two
   disagreeing on 6 of 10 clients. Both now read snap.loaded[0], the same
   address the list itself leads with, because sq is already sorted
   descending where pracRead() builds it. And an address whose own name
   already carries its seat, "Self-Judgment (Solar)", is only one of four in
   the whole table (the other three are Resentment and Self-Judgment's
   second seat), and naming the seat again after it read "Self-Judgment
   (Solar), at the solar": pracAddrSeatSuffix catches exactly those four and
   nothing else. */
function pracAddrSeatSuffix(n){
 var suf=' ('+n.b+')';
 return n.k.length>=suf.length&&n.k.slice(-suf.length)===suf;}
function pracAddrNamed(n){
 return pracAddrSeatSuffix(n)?esc(n.k):esc(n.k)+', '+unp(n.b,null,'seat');}
/* ADDRESSES, GROUPED UNDER THEIR SEAT AND COLLAPSED, heaviest seat first and
   open by default so the right column is never a wall of forty rows: Gordon
   carries 97. PRAC_OPENSEAT names the one seat open; null (a fresh client,
   or one with nothing carrying) resolves to the heaviest seat here rather
   than leaving every group shut on first paint. */
function pracSeatGroups(loaded){
 var bySeat={};
 loaded.forEach(function(n){(bySeat[n.b]=bySeat[n.b]||[]).push(n);});
 var seats=Object.keys(bySeat).sort(function(a,b){
   var ta=bySeat[a].reduce(function(s,n){return s+n.sq;},0);
   var tb=bySeat[b].reduce(function(s,n){return s+n.sq;},0);
   return tb-ta;});
 var openB=PRAC_OPENSEAT||seats[0];
 return seats.map(function(b){
  var list=bySeat[b], open=(b===openB);
  var rows=list.map(function(n){
   var concern=(n.a||'').toLowerCase(), shows=(n.d||'').toLowerCase();
   return '<div class="pr-addr"><div class="pr-addr-k">'+esc(n.k)+'</div>'
    +'<div class="pr-addr-x">Concerns '+esc(concern)+'. Shows up as '+esc(shows)+'.'
    +(n.nerve?' The nerve that serves this place is the '+esc(String(n.nerve).toLowerCase())+'.':'')+'</div>'
    +'<div class="pr-meter"><i style="width:'+Math.max(2,Math.min(100,n.sq/10*100)).toFixed(0)+'%"></i></div>'
    +'</div>';}).join('');
  return '<div class="pr-seatgrp'+(open?' open':'')+'" style="--c:'+seatCol(b)+'">'
   +'<button type="button" class="pr-seathd" data-prseat="'+esc(b)+'" aria-expanded="'+open+'">'
   +'<span>'+unp(b,null,'seat')+'</span><span class="pr-seatct">'+list.length+'</span></button>'
   +'<div class="pr-seatbody">'+rows+'</div></div>';}).join('');}
function pracAddrCard(p){
 var snap=pracRead(p), n=snap.loaded.length, sent;
 if(n)sent='<b>'+n+'</b> address'+(n===1?' is':'es are')+' carrying. The heaviest is '+pracAddrNamed(snap.loaded[0])+'.';
 /* under the line, not nothing: the same honest second case analytics.js
    already prints, so a field that is real but spread thin (Sofia carries
    52 addresses and none crosses sq 4) is never told it is empty */
 else if(snap.heaviest)sent='Nothing is above the line. The heaviest is '+pracAddrNamed(snap.heaviest)+'.';
 else sent='Nothing is carrying.';
 return accGroup('What is held',
   '<p class="ac-lead" style="margin:13px 15px 0">'+sent+'</p>'
   +(n?pracSeatGroups(snap.loaded):'<div class="pr-empty">Nothing is carrying. There is nothing to group.</div>'),
   'Read off the structure: which addresses hold charge and the nerve each one '+
   'sits at. This is not the story in '+esc(p.nm)+'’s own words, which a practitioner '+
   'never sees without a separate yes of its own.');}
function pracNotesCard(p){
 var notes=pracNotesFor(p.nm).slice().reverse();
 var items=notes.map(function(n){
  var d=new Date(n.t); var when=isNaN(d)?n.t:d.toLocaleDateString();
  return '<div class="pr-note-item"><span class="pr-note-date">'+esc(when)+'</span>'+esc(n.text)+'</div>';
  }).join('');
 return accGroup('Notes on '+esc(p.nm),
   '<form class="pr-note-form" id="prnoteform"><textarea class="pr-note-ta" id="prnotetxt" '
   +'placeholder="Write a note" aria-label="Write a note on '+esc(p.nm)+'"></textarea>'
   +'<div style="margin-top:8px"><button class="btn pri" type="submit">Save note</button></div></form>'
   +(items||'<div class="pr-empty">No notes yet.</div>'),
   'Saved to this device only, never to '+esc(p.nm)+'’s own record and never sent '+
   'anywhere. Sending a note on to the person it is about is not built yet.');}
/* WHO ELSE CAN SEE THIS CLIENT, honestly not here. "Sight" is team shorthand
   the owner said he did not know the meaning of (ui/account.js, the person's
   own privacy section, carries the fix already: the row there is titled
   "Who can see this"); this stub takes the same wording. The mechanism that
   would let a second practitioner, or anyone else, be listed on a row like
   this does not exist in this build, so the stub says that in plain words
   rather than rendering an empty list that implies the mechanism is there. */
function pracSightStub(p){
 return accGroup('Who else can see '+esc(p.nm),
   accStub('Other practitioners or services','not built yet'),
   'This waits on a way for a person to let a practitioner see their record, which this build '
   +'does not have yet. Until then the only route to this example is this device, and nothing '
   +'here is sent or shared.');}
/* THE WAY BACK TO THE SWITCH. The sketch this page replaces carried the same
   reasoning and the same button: the door to this page is the only place a
   person who turned it on is sure to look for how to turn it off, so it
   stays, on every state this renderer draws and not only the empty one. */
function pracModeGroup(){
 return accGroup('This mode',accAct('Practitioner mode','pracacc',{btn:'Open account'}));}
function pracDetail(){
 if(PRAC_SEL==null||!PEOPLE[PRAC_SEL])
  return '<div class="pr-mid" id="prmid"><div class="ac-grp"><div class="pr-empty">'
   +'Select a client on the left to open their reading.</div></div></div><div class="pr-right"></div>';
 var p=PEOPLE[PRAC_SEL];
 pracSeenSet(p.nm,pracTierWord(pracRead(p)));
 /* ONE "PRACTITIONER" EYEBROW, NOT TWO: the list beside this already carries
    one, and the section bar above both carries the word a third time, which
    a design review counted on the one screen. This head card drops its own
    copy and keeps the name, the role and the one honest line. */
 var head='<div class="ac-grp"><div class="ac-hd" style="padding:13px 15px 0">'
  +'<h2 class="kb-h">'+esc(p.nm)+'</h2></div>'
  +'<p class="ac-lead" style="margin:11px 15px 15px">'+esc(p.role)+(p.age?', '+esc(String(p.age)):'')
  +'. Example person, not a client.</p></div>';
 return '<div class="pr-mid" id="prmid">'+head+pracRingCard(p)+'</div>'
  +'<div class="pr-right">'+pracAddrCard(p)+pracNotesCard(p)+pracSightStub(p)+'</div>';}
function pracWire(host){
 host.querySelectorAll('[data-pri]').forEach(function(b){
  b.onclick=function(){PRAC_SEL=+b.getAttribute('data-pri'); PRAC_OPENSEAT=null; renderPrac();};});
 host.querySelectorAll('[data-prs]').forEach(function(b){
  b.onclick=function(){PRAC_SORT=b.getAttribute('data-prs'); renderPrac();};});
 /* THE RING'S OWN ARCS AND A SEAT'S HEADER BELOW WRITE THE SAME ONE STATE.
    Either one opens that seat and nothing else: there is no toggle-closed,
    because the seat a client's own reading leads with being impossible to
    shut again is the one dead end that reads worse than always one open. */
 host.querySelectorAll('[data-prseat]').forEach(function(e){
  var open=function(){PRAC_OPENSEAT=e.getAttribute('data-prseat'); renderPrac();};
  e.onclick=open;
  e.onkeydown=function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();open();}};});
 var back=host.querySelector('.pr-back');
 if(back)back.onclick=function(){PRAC_SEL=null; renderPrac();};
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
 var open=(PRAC_SEL!=null&&PEOPLE[PRAC_SEL]);
 host.innerHTML='<div class="pr-wrap" style="--c:'+seatCol('Throat')+'" data-open="'+(open?'1':'0')+'">'
  +'<div class="ac-hd"><div class="pm-eye">Practitioner</div><h2 class="kb-h">Clients</h2></div>'
  +'<button type="button" class="btn pr-back">Back to clients</button>'
  +'<div class="pr-cols">'
  +'<div class="pr-list-col">'
  +'<div class="ac-grp">'+pracList()+'</div>'+pracModeGroup()+'</div>'
  +pracDetail()
  +'</div></div>';
 pracWire(host);}
