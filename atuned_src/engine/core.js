
/* ============================================================
   DERIVED INDEXES
   ============================================================ */
const SOM=NODES.filter(n=>!n.b.startsWith('Field'));
const FIELD=NODES.filter(n=>n.b.startsWith('Field'));
const W=[];BANDS.forEach(b=>SOM.filter(n=>n.b===b).forEach(n=>W.push(n)));
W.forEach((n,i)=>{n.slot=i;n.ang=(i/108)*Math.PI*2-Math.PI/2;
 n.cf = ANTKEY.test(n.k)?'Anticipation' : SURPKEY.test(n.k)?'Surprise'
      : HEARTKEY.test(n.k)?'Sad' : (REROUTE[n.c]||null);});
const BY={};NODES.forEach(n=>BY[n.i]=n);
const NAMED=new Set();SAB_LIB.forEach(s=>s.nids.forEach(i=>NAMED.add(i)));
/* the six families are poled. collapsed on the left, overshot on the right.
   the roster doubles at the family tier, not the saboteur tier. */
const FAM_POLE={Dysregulation:'Numbness',Collapse:'Mania',Rigidity:'Indiscriminate',
 Predatory:'Enabling',Grandiosity:'Self-erasure',Dissociation:'Enmeshment'};
const FAM_OF={Fear:'Dysregulation',Shock:'Dysregulation',Anticipation:'Dysregulation',
 Anger:'Predatory',Shame:'Collapse',Sad:'Collapse',Surprise:'Dysregulation',
 Disgust:'Rigidity',Apathy:'Dissociation'};
const GRAND=/PRIDE|SUPERIOR|ENTITLE|HUBRIS|ARROGAN|GRANDIOS|SPECIAL/i;
const UNNAMED=[],PLACED=new Set();
BANDS.forEach(b=>{const grp={};
 W.filter(n=>n.b===b&&!NAMED.has(n.i)&&n.cf).forEach(n=>{(grp[n.cf]=grp[n.cf]||[]).push(n);});
 Object.keys(grp).forEach(c=>{if(grp[c].length<2)return;
  const fam=GRAND.test(grp[c].map(n=>n.k).join(' '))?'Grandiosity':FAM_OF[c];
  grp[c].forEach(n=>PLACED.add(n.i));
  UNNAMED.push({nm:b+' '+(INFER_NOUN[c]||c),hcx:fam,nids:grp[c].map(n=>n.i),unnamed:true});});});
/* leftovers. a singleton in its band joins the cross-band cluster for its own
   child fetter, so every address that can hold charge can also compound. */
const LEFT={};
W.filter(n=>n.cf&&!NAMED.has(n.i)&&!PLACED.has(n.i)).forEach(n=>{(LEFT[n.cf]=LEFT[n.cf]||[]).push(n);});
Object.keys(LEFT).forEach(c=>{
 const fam=GRAND.test(LEFT[c].map(n=>n.k).join(' '))?'Grandiosity':FAM_OF[c];
 UNNAMED.push({nm:'Diffuse '+(INFER_NOUN[c]||c),hcx:fam,nids:LEFT[c].map(n=>n.i),unnamed:true,diffuse:true});});
const ALL_SAB=SAB_LIB.concat(UNNAMED);
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CHG2SEAT={fear:'Root',anger:'Solar',shame:'Sacral',disgust:'Sacral',apathy:'Throat',
 shock:'3rd Eye',sadness:'Heart',grief:'Heart',surprise:'Heart',anticipation:'Solar',
 anxiety:'Solar',pride:'Crown',guilt:'Sacral',craving:'Sacral',separation:'Crown'};
const CHG2FET={anxiety:'Anticipation',fear:'Fear',anger:'Anger',shame:'Shame',
 disgust:'Disgust',apathy:'Apathy',shock:'Shock',sadness:'Sad',sad:'Sad',
 grief:'Sad',surprise:'Surprise',separation:'Apathy',silence:'Apathy',
 doubt:'Shock',pride:'Shame',guilt:'Shame',craving:'Disgust'};
/* THE SEAT A RANGE MATCH IS CHECKED AT, READ OFF THE ADDRESSES. 22 October.

   compute() names a SAB33 range match only when the seat of its first charge
   holds an address at sq 3 or more, and it draws the saboteur there. That
   seat was CHG2SEAT, the owner's ruling about where a charge is held, and for
   every axis but one the ruled seat holds at least one address carrying the
   charge. Apathy is the one. CHG2SEAT and CHILD put it at the throat, the
   shoulder girdle and the base of the neck, and no throat address carries
   Apathy: REROUTE sends the node map's Joy label to Apathy, and every Joy
   address sits at the root, the sacral, the third eye or the crown. So a row
   led by apathy was checked at a seat its own charge never reaches. Measured
   on 22 October over 270 or more settings a row (six law levels, five souls,
   every combination of each band's low, centre and high): Pleaser,
   Hyper-Achiever, Restless, Dreamer, Escapist and Avoider were never named
   from their own configuration. People-Pleaser and Enabler escaped only
   because their second charge, shame, happens to sit at the throat.

   THE RULE. A charge is checked at its CHG2SEAT seat wherever that seat holds
   an address carrying it, so the ruling stands everywhere it can be honoured.
   Where the ruled seat holds none, the check moves to the seat holding the
   most of that charge's addresses, and BANDS order breaks a tie. It is read
   off W at load and never typed, so a change to the node map moves it and no
   second table is left holding the old answer. On the map as it stands it
   moves exactly one charge, apathy, from the throat to the sacral.

   CHG2SEAT itself is not touched. It is also where the lexicon seats a story
   word and where the path draws one, and sniff.js records that reconciling it
   with the address map is a ruling nobody has made. This table answers a
   narrower question with no ruling in it: which seat's addresses can carry
   this charge at all. */
const SAB_SEAT=(function(){
 var out={};
 Object.keys(CHG2SEAT).forEach(function(ch){
  var fet=CHG2FET[ch]||CHARGES.filter(function(c){return String(c).toLowerCase()===ch;})[0]||null;
  var ruled=CHG2SEAT[ch], at=fet?W.filter(function(n){return n.cf===fet;}):[];
  if(!at.length||at.some(function(n){return n.b===ruled;})){out[ch]=ruled;return;}
  var cnt={}; at.forEach(function(n){cnt[n.b]=(cnt[n.b]||0)+1;});
  out[ch]=BANDS.reduce(function(best,b){return (cnt[b]||0)>(cnt[best]||0)?b:best;},ruled);});
 return out;})();
/* ONE SABOTEUR, ONE LIBRARY ROW, found by identity. KB_KEY is the key SABDEF
   and SABCARD already use, so a saboteur is the same saboteur in every table
   however its name is cased or hyphenated. compute() reads the library row's
   family through this, so the range route and the address route can no
   longer put one saboteur in two families. */
const SAB_LIB_BY={};SAB_LIB.forEach(s=>{SAB_LIB_BY[KB_KEY(s.nm)]=s;});
/* WHERE A NAMED SABOTEUR SITS IS WHERE ITS ADDRESSES ARE, 24 October, systems
   audit SG-05. The seats of the addresses SAB_LIB builds the saboteur from,
   once each, from the root up in BANDS order, and the seat that holds the most
   of them, the root end winning a tie. The Analytics archetype card and the
   Avatar page printed the third column of ARCH18 as the primary saboteur's
   seat, and measured on 23 October that seat held none of the saboteur's
   addresses in 9 of the 18 rows: Pleaser was put at the heart, and its
   addresses sit at the root and the sacral. Read off the addresses, the words
   and the body map cannot disagree. A saboteur with no library row has no
   seats and says none. */
function sabSeats(nm){
 var s=SAB_LIB_BY[KB_KEY(String(nm===undefined||nm===null?'':nm))]; if(!s)return [];
 var at={}; s.nids.forEach(function(i){var n=BY[i]; if(n)at[n.b]=(at[n.b]||0)+1;});
 return BANDS.filter(function(b){return at[b];});}
function sabSeatMain(nm){
 var s=SAB_LIB_BY[KB_KEY(String(nm===undefined||nm===null?'':nm))]; if(!s)return null;
 var at={}; s.nids.forEach(function(i){var n=BY[i]; if(n)at[n.b]=(at[n.b]||0)+1;});
 var best=null; BANDS.forEach(function(b){if(at[b]&&(best===null||at[b]>at[best]))best=b;});
 return best;}

/* ============================================================
   TABS. A stale tab index caused the same class of bug four times in
   this codebase, so the integers are named once and never typed again.
   Order is load bearing and must not change.
   ============================================================ */
/* SETTINGS IS INTEGER 9, APPENDED, for the same reason Compass was integer 8:
   these are identity, they are persisted and compared, and renumbering them
   is the bug this file has warned about since the rebuild. It is a surface
   with no tab, reached from the profile button, because a setting is not a
   place in the product a person navigates to as a peer of the instrument. */
const TAB={STORY:0,SUMMARY:1,FIELD:2,ENERGY:3,ANALYTICS:4,INTAKE:5,KNOW:6,GAMES:7,
 /* RITUAL IS 10, APPENDED. Ruled: the ritual builder is a primary product and
    goes in the primary navigation, with the accountability tracker built
    inside it rather than beside it. Appended for the same reason Compass was:
    the integers are identity, they are persisted and compared, and they do not
    renumber to make a list look tidy. */
 COMPASS:8,SETTINGS:9,RITUAL:10,
 /* MASKS IS 11, APPENDED, on the same rule as Ritual and Compass: a new
    surface takes the next free integer and nothing before it moves. */
 MASKS:11,
 /* PRACTITIONER IS 12, APPENDED, round LL, on the same rule again. It is the
    one integer whose door comes and goes at run time, so it is also the one
    most likely to be stored while its door is shut: a profile that had the
    mode on, saved, then had it switched off. The integer still names a real
    surface, so setTab still opens it the way it still opens Games, and the
    only thing the switch moves is whether a person can see the door. */
 PRACTITIONER:12,
 /* QUESTIONS IS 13, APPENDED, round OG, on the same rule again. It is the Intake
    page: the diagnostic's 21 blocks of questions on a page of their own, in
    Discover. The integer's name says what it holds so it is never confused
    with TAB.INTAKE, which is the Avatar and keeps that name as history. */
 QUESTIONS:13,
 /* ACCOUNTABILITY IS 14, APPENDED, on the same rule as every integer above it.
    Ruled 2 October, in his words: "you're supposed to move accountability to
    its own tool set." It had been built inside Ritual since round JQ, and the
    note at TAB.RITUAL above says so: "built inside it rather than beside it".
    That ruling is superseded, not erased. The integer names a surface of its
    own now, host #acct, and DESIGN-flow-tools.md is where the split is
    written down with a gate under every rule. */
 ACCOUNT:14};
/* TABDEF is DISPLAY order. TAB above is identity and does not move: the
   integers are persisted, compared and passed around, and renumbering them
   is the bug this file already warns about. Compass is a new integer at the
   end for exactly that reason. Anything that needs the entry for a tab looks
   it up by .k, never by position.

   ANALYTICS IS UNFOLDED, round LV, on his words: "I want you to break out
   the analytics from summary and give it its own summary page, sorry, its
   own analytics page after summary, so it'll go story, avatar, summary,
   analytics." Games carries the template, TWICE: folded into Knowledge and
   then unfolded again, on the ruling that a game folded into a reference
   page is neither. Same integer, TAB.ANALYTICS, never renumbered. Same
   renderer, anaRender in ui/analytics.js, never rewritten. What moved is
   where the door sits and where the host lives: it has an entry here again,
   right after Summary as he named the order, and body.html gives #ana its
   own place on the stage, a sibling of #sum and not a child inside it,
   which is the #know and #games lesson this file already carries below.
   TABFOLD no longer answers TAB.ANALYTICS with Summary, the same line Games
   came out of when it was unfolded the first time.

   Summary read last of the three Discover doors, on the ruling that put it
   there: "then my intake then my summary." Analytics read after it, his own
   order, so Discover was Story, Avatar, Summary, Analytics and the bar still
   closes the loop on Embody. Round OD moved the body map into Discover as
   Intake and round OG moved it back to Play as Body; see the note above
   TAB.ENERGY's own entry in TABDEF. On 23 October all four left Discover for
   Play, keeping that order, and Discover became the journal page alone; see
   the note above SECTIONS. */
/* THE MENU RULE, ruled. One word, and the word names exactly what the surface
   does. Not what it is about, not what it belongs to. What it does.

   Intake became Energetics on the owner's word: a person does not arrive to
   perform an intake, they arrive to have their energetics read. Energy became
   Body, because the surface is a body with seven seats on it and Energy named
   the subject rather than the thing on screen. The rest already passed the
   rule and were left alone rather than churned to look busy. */
/* SETTINGS IS NOT IN TABDEF AND THAT IS THE POINT. TABDEF is the bar, and a
   surface in the bar is a peer of the instrument. Settings is reached from
   the profile button and nothing else, so it has a host, a class and a
   renderer and no door in the navigation. */
/* THE BAR IS SECTIONS, AND EVERY TAB SITS IN ONE. Rounds KC and KM in
   TASKS.md, his words: "Let's organize our menus by discover, play, flow as
   the core top navigation. And the sub navigation will be discover will be
   avatar and summary. And your journal imprints. Play is all the tools. Flow
   is the knowledge base and ritual."

   A section is a group of doors and never a surface of its own: pressing one
   opens a tab in it, so every route still ends in setTab with one of the
   identity integers above, and none of them moved. Journal and imprints are
   the Story, which already carries the journal, the imprints read off it and
   the bank. Achievements are earned on the way through rather than visited,
   so they have no door here. Settings has no section, as it has no tab.

   TABDEF below is in section order and each entry names its section in .sec,
   which is the one place membership is written. The markup groups the same
   buttons under the same keys and a gate proves the two agree. */
/* AND THEN IT WAS THE LOOP, because three was the defect. Round KT in
   TASKS.md, flagged by him as an emergency. The loop this whole file serves is
   discover, play, flow, embody, and CLAUDE.md has said so since 20 September,
   but the bar built at KC stopped at flow: there was no Embody to press.

   He talked the mapping through more than once in that round, correcting
   himself as he went, and the last pass is the one built. His words: "When I
   click on Discover, I want to start right immediately on my journal. and
   then my next secondary navigation is my avatar then my summary then my
   intake. Sorry, then my intake then my summary. I want to move all the tools
   to play. And then get rid of the tools tab. Sorry, discovers opening on
   story. That's what I meant. Flow is ritual and accountability. Embody is
   knowledge."

   So four sections, the loop's own four in its own order, and no fifth: a
   Tools section was built on his earlier pass and taken out on this one.
   Only .sec and the order of this array moved. No TAB integer changed, and
   the gate holds every one to its value. */
/* AND THEN DISCOVER WAS THE JOURNAL ALONE, AND THE APP OPENS ON IT. Recorded
   23 October 2026. His words, across two messages: "I want to get rid of the
   Story or move the Story link. Sorry, attach the Story link to Discover. So
   we're removing the word Story. We're keeping the word Discover... the app
   opens on Discover. So when you click Discover, you only get the journal and
   the imprints and the release. If I click on play, then I get all the other
   tools." And, on whether that changes the rule: "Yeah, I've changed that
   rule. The most important portions of the app are core loop. The core loop
   is discover, play, flow, and embody. That really is the journal to the
   release. Plus the ritual."

   WHAT HIS THREE WORDS ARE, read off the code rather than guessed. The
   journal, the imprints and the release are the Story page's own three
   columns, and they have carried exactly those three names since round QB,
   his words: "I want journal, the word journal and prints and release"
   (stMark, ui/storyui.js). The middle column is the imprints as the journal
   reads them, and its bank opens the record of every imprint held (impRender,
   ui/imprints.js). The third column is the release, and its Run opens the
   real release card (ui/release.js). Summary and Analytics are readings of
   the whole field, not the imprints, and the release was never hidden: it is
   the third column. So nothing new is built for either word. Discover is that
   one page, and the section is its door.

   ONE DOOR, AND IT IS THE SECTION. door:'section' on the entry says so, and
   three things read it. Above the phone width the bar shows no second door
   under Discover, because the section button already is one, and a door
   reading Discover under a button reading Discover is one word printed
   twice. The phone has no section buttons, so its menu shows the door once,
   as the menu's first line. The folded bar on a phone names the section
   alone. The name is the section's own word because "we're keeping the word
   Discover". The integer, the id story and the class tab-story stay, on the
   rule the Body and Character renames follow: they are identity, never the
   name a person reads.

   PLAY IS EVERY OTHER TOOL, in two orders he gave and none invented here: his
   Play order first, Field, Body, Compass, Character (rounds LE and OG), then
   the four that leave Discover in the order they stood in it, Avatar,
   Summary, Intake, Analytics (rounds LV and OG). Checked against what each
   page does before it moved: the Avatar builds who a person is becoming and
   borrows the journal's commit for it, the Intake page is the diagnostic's
   questions, and neither is the journal, the imprints or the release. No
   integer moved, and Play still opens on Field the first time it is pressed.
   tests/functional.js holds every placement by name. */
const SECTIONS=[
 {k:'discover', nm:'Discover'},
 {k:'play',     nm:'Play'},
 {k:'flow',     nm:'Flow'},
 {k:'embody',   nm:'Embody'},
 /* A FIFTH SECTION THAT IS NOT PART OF THE LOOP, round LL. His words: "Add a
    practitioner mode to the profile. If I turn it on, it adds a new tab item
    called practitioner." So it is a section, a peer of the four in the bar,
    and it is not a fifth station: the loop is still the four above and the
    circle still closes on Embody. .mode is what says so. A section carrying
    it is shown only while that key is on in CURP.ui, and anything that means
    the loop reads SECTIONS without the ones carrying a mode.

    It goes last so that with the mode off the four keep the positions they
    have always had, and nothing measured against the bar moves when the
    switch is off, which is how nearly everyone will see it. */
 {k:'practitioner', nm:'Practitioner', mode:'practitioner'}];
const TABDEF=[
 /* DISCOVER'S ONE DOOR, 23 October: the journal, the imprints and the release,
    which are this page's three columns. See the note above SECTIONS. Being
    first here is still what makes it the opening of its section, since secGo
    sends a first visit to a section's first entry, and TABHOME below is where
    the app itself opens. */
 {k:TAB.STORY,   id:'story', nm:'Discover',  cls:'tab-story',   sec:'discover', door:'section'},
 /* "I want to move all the tools to play. And then get rid of the tools
    tab." The instruments are Play. The app opened on the Field and Play was
    the section pressed at start until 23 October; it opens on Discover now,
    see TABHOME. */
 {k:TAB.FIELD,   id:'cv',    nm:'Field',     cls:'tab-field',   sec:'play'},
 /* BODY, BETWEEN FIELD AND COMPASS, round OG, reversing round OD. OD moved
    this surface to Discover and called it Intake on a misreading of his
    word. Round OG, his words: "Body is missing from this current build. So
    play, field, compass, character. Body should be between field and
    compass... the intake that you call intake is body. So discover intake is
    actual body. The actual intake should be all of the questions." The
    surface is the body map and its name is Body. Same integer, id and class
    as always (TAB.ENERGY, emap, tab-energy). The questions are a different
    surface: they are the diagnostic under the Avatar, intakeui.js. */
 {k:TAB.ENERGY,  id:'emap',  nm:'Body',      cls:'tab-energy',  sec:'play'},
 {k:TAB.COMPASS, id:'cone',  nm:'Compass',   cls:'tab-compass', sec:'play'},
 /* THE MASKS HAVE THEIR OWN DOOR, AFTER COMPASS, in the order he gave. Round
    LE, his words, marked urgent: "the point cloud data and the masks should
    be under the play tab. It should go field intake compass mask
    visualization or something like that. Why is that not there?" They were
    there, but only as one circle among seven in the Intake's overlay column,
    which a person has to know to look for. This is the same figure drawn by
    the same renderer, with the masks the only thing on it (bmRender and
    BMVIEW in ui/map.js), so the two cannot disagree about a pixel. */
 /* THE DOOR IS CHARACTER NOW, round LP, his words: "and all of those form
    the character. So that's the character page. Let's rename masks there to
    character. And then all the masks will just be the masks." The six grids
    on it are the masks; the page they make is the character. Integer 11, the
    id masksview and the class tab-masksview stay, on the rule the Body rename
    above follows: they are identity, never the name a person reads. What is
    drawn inside the host is new too (ui/character.js); the figure the
    comment above describes is gone from this door.

    THE PAGE KEEPS THE WORD, 23 October. The chain's top rung was called
    character as well until he ruled that rung the super complex and put
    Character at the very top of the stack, the whole person, above the
    masks and above archetype through domain (DECISIONS.md, "The full stack,
    nerve to Character"). This page draws the whole person, the masks and
    what is running them, so it stays the one thing on screen called
    Character, and the rung gave the word up rather than the page. */
 {k:TAB.MASKS,   id:'masksview', nm:'Character', cls:'tab-masksview', sec:'play'},
 /* THE FOUR THAT LEFT DISCOVER, 23 October, after his Play order and in the
    order they stood in Discover. See the note above SECTIONS. */
 /* TAB.INTAKE is the Avatar and keeps that name. The integer's own name is
    history, from when this surface was the intake; the door called Intake
    below is a different tab, TAB.QUESTIONS. Two integers, one word each. */
 {k:TAB.INTAKE,  id:'iq',    nm:'Avatar',    cls:'tab-intake',  sec:'play'},
 /* Summary after the Avatar, the order his own correction gave it in Discover:
    "then my intake then my summary". */
 {k:TAB.SUMMARY, id:'sum',   nm:'Summary',   cls:'tab-summary', sec:'play'},
 /* THE INTAKE PAGE IS BACK, round OG. His words: "we'll do the intake questions
    at the very end for now, just restore the intake page." It is the
    questions, on a page of their own, after Summary and before Analytics, the
    place round OD named for it. The body map is Body, in Play: this is not
    that surface and never was. Integer 13, appended, host #iqp, which
    borrows #iqbody from intakeui.js the way the Avatar's menu does. What it
    asks, and how, is the redesign he put last. */
 {k:TAB.QUESTIONS, id:'iqp',  nm:'Intake',    cls:'tab-questions', sec:'play'},
 /* ANALYTICS, RIGHT AFTER SUMMARY, his own order at round LV: "so it'll go
    story, avatar, summary, analytics." Integer 4, unfolded: see the note
    above TABDEF. #ana is body.html's own sibling of #sum now, never nested
    inside it, and anaRender in ui/analytics.js is unchanged. */
 {k:TAB.ANALYTICS, id:'ana', nm:'Analytics', cls:'tab-analytics', sec:'play'},
 /* "Flow is ritual and accountability." The Ritual tab carries both the
    building of a ritual and the accountability for keeping it, so the whole
    tab moves and nothing is split. */
 /* FLOW IS ONE PAGE OF THREE COLUMNS, round QF, 2 October, and that is the
    third ruling on this one surface. Round JQ attached the accountability
    tracker to the ritual page, round PO split it out into a tool set of its
    own, and round QF put it back, with a column each and a job named for
    every column. His words: "we're re-merging the knowledge base and the
    accountability tracker. Left menu will be for inputting new. Right side
    of the menu is for the accountability tracker. Center piece is for the
    ritual."
    So TAB.RITUAL is the whole of Flow again: the left column inputs a new
    ritual, the centre is the ritual, the right column is the accountability
    tracker. DESIGN-flow-tools.md is the rulebook and every rule names its
    gate. */
 {k:TAB.RITUAL,  id:'rit',   nm:'Ritual',    cls:'tab-ritual',  sec:'flow'},
 /* "Embody is knowledge." */
 {k:TAB.KNOW,    id:'know',  nm:'Knowledge', cls:'tab-know',    sec:'embody'},
 /* The practitioner section's one door. Clients and not Practitioner, on the
    menu rule above: the section says who a person is being, the tab says
    what the surface does, and a tab carrying its section's own word is two
    names for two different things spelt the same. Clients is the word
    DECISIONS.md already uses, "a panel listing their clients". The surface
    behind it is a sketch until sign in exists, ui/practitioner.js. */
 {k:TAB.PRACTITIONER, id:'prac', nm:'Clients', cls:'tab-prac', sec:'practitioner'}];
/* GAMES IS OFF THE BAR, FOR NOW. His words, round KT: "Hide games for now."
   It is hidden the way Settings already is, by an entry in TABEXTRA below
   and none here, so it keeps its integer, its host and its renderer, setTab
   still opens it, and the monitor still walks it because it reads both
   tables. Only the door went, and the button with it, since the gate holds
   the markup to this array. Putting it back is one line moved from TABEXTRA
   to here with a .sec, and a button in body.html.

   It was never folded this time. The earlier ruling still stands, that they
   are independent games and a game folded into a reference page is neither,
   which is why it is not in TABFOLD pointing at Knowledge. */
/* the section a tab sits in, read through TABREAL so a folded surface answers
   with its carrier's section. Settings and anything else with no door answer
   null, which the bar reads as "no section pressed". */
const SECOF=function(k){var r=TABREAL(k);
 for(var i=0;i<TABDEF.length;i++)if(TABDEF[i].k===r)return TABDEF[i].sec;
 return null;};
/* SETTINGS HAS NO TABDEF ENTRY, so TABOF would fall through to the first one
   and put the Energetics body class on the Settings surface, which is how a
   surface with no door ends up wearing another surface's layout. It carries
   its own entry here without being in the bar. */
const TABEXTRA={};
TABEXTRA[TAB.SETTINGS]={k:TAB.SETTINGS,id:'settings',nm:'Settings',cls:'tab-settings'};
TABEXTRA[TAB.GAMES]={k:TAB.GAMES,id:'games',nm:'Games',cls:'tab-games'};
const TABOF=function(k){for(var i=0;i<TABDEF.length;i++)if(TABDEF[i].k===k)return TABDEF[i];
 if(TABEXTRA[k])return TABEXTRA[k];
 return TABDEF[0];};
/* A FOLDED SURFACE IS STILL A SURFACE. TABFOLD is the map from an integer
   with no door to the tab that carries it, so a stored tab from a session
   before a fold still resolves to something rather than silently to the
   first entry in the bar, which is what TABOF would have done.

   AND ONE IS BACK IN IT, round QF: ACCOUNTABILITY. The line above said
   adding one back is a single line here and a TABDEF entry taken out, and
   that is exactly what this is. Integer 14 keeps its value, acctSideHtml in
   ui/accountability.js keeps the body the page's renderer had, and what moved
   is where it draws: it is the right column of the Ritual page rather than a page of
   its own, so a tab stored by anybody who used it while it had a door still
   resolves to the surface that carries it instead of falling through to
   Summary. Games and Analytics were each folded this way before. */
const TABFOLD={};
TABFOLD[TAB.ACCOUNT]=TAB.RITUAL;
const TABREAL=function(k){
 if(TABFOLD[k]!==undefined)return TABFOLD[k];
 for(var i=0;i<TABDEF.length;i++)if(TABDEF[i].k===k)return k;
 /* a real surface with no door is still a real surface. Without this,
    setTab(TAB.SETTINGS) resolved to Summary and the profile button opened
    the summary, which is the folded-surface bug in a new costume. */
 if(TABEXTRA[k])return k;
 return TAB.SUMMARY;};
/* WHERE THE APP OPENS, NAMED ONCE. Recorded 23 October 2026, his words: "the
   app opens on Discover", and "The most important portions of the app are
   core loop... That really is the journal to the release." So home is
   Discover's one door, the journal page, integer 0.

   ONE NAME, BECAUSE FOUR PLACES DECIDED IT. The default on S below, the boot's
   opening step (ui/ui.js), the wordmark's home (ui/panels.js) and the landing
   when the practitioner door shuts under a person (ui/practitioner.js) each
   named a tab of their own. The boot's own note records what that costs: a
   default changed in one place looked right in the source and did nothing on
   screen. All four read this now, so the next ruling on the opening is one
   line here. The one first landing (tabLandFirst, ui/panels.js) names Summary
   and not this, on purpose: his 9 October ruling and the gift's line stand on
   it, and the reasoning is written there. tests/landing.js holds both. */
const TABHOME=TAB.STORY;

/* ============================================================
   STATE
   ============================================================ */
/* THE APP OPENS ON SUMMARY, on the owner's ruling. Field was the opening for
   as long as the wheel was the product. It is not: the wheel is one
   instrument and the summary is the reading, and a person arriving wants the
   reading. Field is one click away and keeps its own integer. */
const S={dom:0,doms:[0],arcs:[0,1],roots:[],a1:0,a2:1,charge:{},law:{},
 /* THE APP OPENS ON FIELD. Ruled, and it reverses the earlier ruling that
    put it on Summary.

    It matters because Field is now a stranger's first screen. Everything
    that silences itself on an unread reading still has to, and the four
    doors have to be reachable from here, which they are: the rail prints
    them on every tab but Summary, which was written for exactly this case
    and is the reason the change is safe. */
 /* AND THEN ON DISCOVER, 23 October, which reverses the Field: see TABHOME
    above. The default here is TABHOME so it cannot disagree with the boot's
    step again. A stranger's first screen is the journal now, and the first
    of the four doors (startHTML, ui/component.js) is the page itself: its
    door data-start story opens exactly this surface. The other three are
    drills printed on Summary and in the rail of the tools, which are in
    Play: one press to Play opens the Field with them in its rail. */
 /* AND IT OPENS WITH EVERY LAYER ON. view was 1, Patterns, so the glass bar
    opened with Domains, Masks, Archetypes and the four chain tiers off, and
    since one set of switches drives all three pictures, Frames and Dial
    opened with them off as well. EY named that as his to rule and EZ in
    TASKS.md is the ruling: "the addresses and everything should already be
    on. Yeah, everything should start on." 3 is Blueprint, the preset that is
    every layer in LAYADD, so the first frame draws all of it and a press on
    the bar takes a layer away rather than having to find it. */
 theme:'dark',hover:null,pin:null,t:0,replace:{},view:3,who:0,tab:TABHOME,
 /* atom: the one story weight being held on the wheel, past the fetter
    layer. {i:node id, ei:entry index}, or null for none held. View state,
    like pin and hover, so it is not persisted and not validated. */
 zoom:1,panx:0,pany:0,atom:null,
 /* rec: the id of the record this working state was filled from. Not a view
    field and not persisted, but it is the only thing that can tell two of the
    person's own records apart, because both of them are who 0. loadProfile
    writes it and saveYou reads it. See the note at the end of loadProfile. */
 rec:null};
/* A stranger's first load used to seed every axis at 3, which produced CQ 36
   and the word Incoherent in the largest type on screen, beside a panel that
   correctly said nothing was held. The interval was never the problem. The
   values were invented, and the product named a person from them before they
   had typed a word.

   Zero is the honest opening. Nothing held reads as nothing held, and the
   reading says there is nothing to read yet rather than reaching for a tier.
   The laws stay at the default 6 and the interface already says, in the one
   place it matters, that an unmeasured law is a default and flatters the
   score. */
CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
/* ONE SEED FOR ONE QUANTITY, AND IT LIVES HERE BECAUSE THIS IS THE FIRST USE.

   The value an unmeasured law is given in working state had three answers.
   This line said 6 as a literal, schema.js named the same number LAW_DEFAULT
   for the same purpose, and ui/personas.js seeded the custom persona at 6.5
   and fell back to 5.5 for anybody with no table. Measured on one empty
   profile: the engine boundary read CQ 36.00 and the app read 42.25 the moment
   loadP(0) ran, which is every route a person takes to their own record, so
   the same person had two readings depending on which door they came through.

   6 is the value that was already named, already commented eight lines above
   as what the interface tells a person an unmeasured law is, and already the
   one saveProfile compares against before it agrees to persist a law. The
   other two were literals in a renderer, and a renderer does not get to seed
   the arithmetic.

   Declared in core.js rather than in schema.js because a var is hoisted but
   its assignment is not, so this line runs before schema.js exists and read
   undefined if it referenced it there. */
const LAW_DEFAULT=6;
SINAMES.forEach(l=>S.law[l]=LAW_DEFAULT);

/* ============================================================
   THE SOUL. Multi-select: any number of blueprint domains, root
   clusters and archetypes. Each selection lays a lobe on the
   19-slot ring and the lobes accumulate.
   ============================================================ */
let DOMAIN=new Array(19).fill(.3);
function buildSoul(){
 DOMAIN=new Array(19).fill(0);
 if(!S.doms.length)S.doms=[S.dom];
 if(!S.arcs.length)S.arcs=[S.a1];
 S.dom=S.doms[0];S.a1=S.arcs[0];S.a2=S.arcs[1]!==undefined?S.arcs[1]:(S.arcs[0]+1)%12;
 S.doms.forEach((sd,i)=>{const wgt=i===0?1:Math.max(.5,.92-i*.14);
  for(let d=0;d<19;d++){let k=Math.abs(d-sd);k=Math.min(k,19-k);
   DOMAIN[d]=Math.max(DOMAIN[d],wgt*Math.exp(-(k*k)/4.2));}});
 S.roots.forEach(rn=>{DOMAINS.forEach((D,d)=>{if(D.r===rn)DOMAIN[d]=Math.max(DOMAIN[d],.72);});});
 S.arcs.forEach((j,i)=>{const c=(j/12)*19+19/24, wgt=i===0?.86:i===1?.62:Math.max(.34,.55-i*.06);
  for(let d=0;d<19;d++){let k=Math.abs(d-c);k=Math.min(k,19-k);
   DOMAIN[d]=Math.max(DOMAIN[d],wgt*Math.exp(-(k*k)/2.6));}});
 const mx=Math.max(...DOMAIN)||1;DOMAIN=DOMAIN.map(v=>.08+.92*v/mx);
}
/* 19 does not divide 360 evenly, so the domain arc is 18.947 degrees and the
   overlap against the 30 degree archetype arcs is computed, not snapped. */
const DARC=360/19;
function affinity(){const a=new Array(12).fill(0);
 for(let d=0;d<19;d++){const d0=d*DARC,d1=d0+DARC;
  for(let j=0;j<12;j++){const a0=j*30,a1=a0+30;
   a[j]+=DOMAIN[d]*(Math.max(0,Math.min(d1,a1)-Math.max(d0,a0))/DARC);}}
 const mx=Math.max(...a)||1;return a.map(v=>v/mx);}
function coreAt(ang){const deg=((ang+Math.PI/2)/TAU*360+3600)%360,f=deg/DARC,i=Math.floor(f),t=f-i,
 s=t*t*(3-2*t);return DOMAIN[i%19]*(1-s)+DOMAIN[(i+1)%19]*s;}
function meanAng(l){let x=0,y=0;l.forEach(a=>{x+=Math.cos(a);y+=Math.sin(a);});return Math.atan2(y,x);}
function bandIg(b){const g=SI.filter(l=>l.b===b);return g.reduce((a,l)=>a+S.law[l.nm],0)/g.length;}

/* ---------- SAB33 detection ---------- */
function sabLevels(exact){
 var L={},F={Fear:'fear',Anger:'anger',Shame:'shame',Disgust:'disgust',Apathy:'apathy',
  Shock:'shock',Sad:'sadness',Surprise:'surprise',Anticipation:'anticipation'};
 CHILD.forEach(function(c){var v=S.charge[c.nm]||0;L[F[c.nm]||c.nm.toLowerCase()]=exact?v:Math.round(v);});
 L.anxiety=L.anticipation;
 return L;}
/* each SAB33 row by identity, for the address route's band check in compute() */
const SAB33_BY={};SAB33.forEach(function(r){SAB33_BY[KB_KEY(r[0])]=r;});
/* THE RANGE SCAN READS THE RAMP, P1-6 of the inference audit, 23 October.
   It was a three step staircase over levels rounded to whole numbers, full
   credit inside a band, half one step out, named at 60: the defect canon.js
   records in its own header, and the owner's ruling is "a band edge is a
   ramp, not a cliff". Measured on 77928172: with apathy at 4, fear at 4.49
   named Innocent and Restless and fear at 4.51 named neither, and one answer
   of the quiz's hundred moved one step changed which four saboteurs a
   newcomer was shown in 8.6 per cent of simulated readings. The ramp, the
   geometric mean and the one charge discount were built in canon.js and
   used only by sniffStory, which no screen calls.

   So this is sabConfidence on the exact levels. It still has to answer
   yes or no, because compute() pairs the saboteurs it names into
   complexes, so it names a row at SAB_NAME and ranks by confidence.
   SAB_NAME is 0.5 because that is the ramp's own membership one point over
   a band's high edge and the old rule's half credit: a row still names
   when one of its charges sits about a point outside its band, as the
   staircase allowed, and never when two do. What goes is the cliff at the
   half point of every whole number. Exact is every charge inside its band,
   read without rounding, and score is the confidence as a percent, which is
   what the drill's "Matched at" prints. */
var SAB_NAME=0.5;
function sab33Detect(){
 var L=sabLevels(true), out=[];
 SAB33.forEach(function(row){
  var nm=row[0], parts=row[1], conf=sabConfidence(nm,parts,L);
  var inAll=parts.every(function(p){var v=L[p[0]]||0; return v>=p[1]&&v<=p[2];});
  var score=Math.round(conf*100);
  if(conf>=SAB_NAME) out.push({nm:nm, score:score, exact:inAll, conf:conf, parts:parts,
   charges:parts.map(function(p){return p[0];}),
   /* the seat that can carry the first charge, SAB_SEAT above, and never a
      seat its own charge cannot reach */
   band:SAB_SEAT[parts[0][0]]||CHG2SEAT[parts[0][0]]||'Root',
   w:Math.min(10, parts.reduce(function(a,p){return a+(L[p[0]]||0);},0)/parts.length)});});
 return out.sort(function(a,b){return b.score-a.score || b.w-a.w;});}

