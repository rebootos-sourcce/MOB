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
   tab-prac rule and would win. */
function pracCss(){
 if(document.getElementById('pr-css'))return;
 var st=document.createElement('style'); st.id='pr-css';
 st.textContent=[
  /* one literal and not two: split across two, the voice gate read the first
     half as a figure's label standing over the second */
  '@media not all and (max-width:720px){.top[data-sec="practitioner"] #tabbar .tabgrp:not([data-sec="practitioner"]){display:none}}',
  'body.tab-prac .mid,body.lshut.tab-prac .mid{grid-template-columns:1fr}',
  'body.tab-prac .mid .col{display:none}',
  /* the sketch is drawn in dashes, the way a block out is drawn on paper,
     so a person reads it as a plan and never as three empty clients */
  '.pr-sk{justify-content:flex-start}',
  '.pr-ring{width:30px;height:30px;flex:0 0 auto;border-radius:50%;border:1.5px dashed var(--edge)}',
  '.pr-lines{display:flex;flex-direction:column;gap:7px;flex:1 1 auto;min-width:0}',
  '.pr-lines i{display:block;height:7px;border-radius:4px;background:var(--edge)}',
  '.pr-lines i:first-child{width:38%}',
  '.pr-lines i:last-child{width:22%;opacity:.6}',
  '.pr-pill{width:96px;height:28px;flex:0 0 auto;border-radius:14px;border:1.5px dashed var(--edge)}'
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

/* THE SKETCH. Three dashed rows where a list will be, and every part of what
   he described as a stub row that says it is not built. No name is invented
   for a row: a made up client on a page about other people's records is a
   fabricated record, even as a picture. */
function renderPrac(){
 var host=$('prac'); if(!host)return;
 pracCss();
 var row='<div class="ac-row pr-sk" aria-hidden="true"><i class="pr-ring"></i>'
  +'<span class="pr-lines"><i></i><i></i></span><i class="pr-pill"></i></div>';
 host.innerHTML='<div class="ac-wrap" style="--c:'+seatCol('Throat')+'">'
  +'<div class="ac-hd"><div class="pm-eye">Practitioner</div>'
  +'<h2 class="kb-h">Clients</h2></div>'
  +'<p class="ac-lead">A sketch of practitioner mode. No client is listed here yet, and no '
  +'profile opens from this page until sign in and consent are built.</p>'
  +accGroup('Your Clients',row+row+row,
    'Each block marks where a client will sit. None of them is a person.')
  +accGroup('A Client’s Profile',
    accStub('Add a client')+accStub('View a client’s profile')+accStub('Client consent'),
    /* the same promise the Privacy section already makes from the other
       side, "Who Can See This" (it read "Who Has Sight" until the word was
       found to be team shorthand), said here as not yet true */
    'Nothing about a client reaches this page until that client grants it. Once this '
    +'is built, the grant shows by name on the client’s own Privacy page, and one press '
    +'there takes it back.')
  /* the way back to the switch, because the door to this page is the only
     place a person who turned it on is sure to look for how to turn it off */
  +accGroup('This Mode',accAct('Practitioner mode','pracacc',{btn:'Open Account'}))
  +'</div>';
 var b=$('pracacc');
 if(b)b.onclick=function(){ACC_OPEN='account'; setTab(TAB.SETTINGS);};}
