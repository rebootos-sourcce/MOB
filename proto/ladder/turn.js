/* ============================================================
   proto/ladder/turn.js  ·  THE TURN, THE MARKS AND THE AWARDS.

   The module this design proposes, written in the shape it would land in as
   atuned_src/engine/turn.js. Host free: no document, no window, no storage, no
   fetch, and no clock of its own. The caller passes the moment, so a test can
   hold time still, which is the rule engine/ladder.js already works under.

   It is loaded by proto/ladder/index.html in a browser and by
   proto/ladder/probe.js in node, so the page and the document cannot disagree
   about a number. One copy, two readers.

   WHAT IS NEW HERE AND WHAT IS NOT.
     turnRead      new. reads four timestamps the profile already carries.
     markRead      the sixteen marks at engine/ladder.js, re-keyed to the four
                   quarters of the loop, five conditions corrected, six added.
     awardRead     new. what moved, as a dated fact, conferred once.
     curveOf       new. the arithmetic of the ladder, so it can be drawn.

   THE ONE RULE UNDER ALL OF IT. A person must be able to stop and be glad they
   used it. Nothing here counts down, nothing expires, nothing names an absence,
   and nothing is a count against a total.
   ============================================================ */

/* ------------------------------------------------------------
   THE FOUR QUARTERS. The loop he ruled, and it is a circle.

   Each quarter carries the seat it belongs to, because if it has a name it has
   an icon, and the icon has a family, and the family has a colour. The colours
   are the seat colours already in PAL and they mean the same thing here as
   everywhere else.

   Discover sits at the 3rd Eye because seeing what is running is the act.
   Play sits at the Sacral. Flow sits at the Root, which is where the existing
   Practice family already sat and is the reason keeping the day is the base.
   Embody sits at the Heart. The closed circle itself sits at the Solar, which
   is the seat of will, and it is the only one that is a count of the whole ring
   rather than of one quarter of it.
   ------------------------------------------------------------ */
var QUARTER=[
 {k:'discover', nm:'Discover', seat:'3rd Eye', job:'find what is running',
  act:'write or speak one entry'},
 {k:'play',     nm:'Play',     seat:'Sacral',  job:'do something with it',
  act:'take the ritual it deals'},
 {k:'flow',     nm:'Flow',     seat:'Root',    job:'keep the day',
  act:'mark it done, or run the floor'},
 {k:'embody',   nm:'Embody',   seat:'Heart',   job:'see what moved',
  act:'the next reading'}];
var TURN_SEAT='Solar';

/* ------------------------------------------------------------
   THE TURN. One closed circle, and it cannot be farmed.

   THE PROFILE ALREADY CARRIES ALL FOUR TIMESTAMPS AND NOTHING READS THEM.
   That is the finding this whole module rests on. A story entry is stamped at
   ui/storyui.js:85. A ritual is stamped when it is saved and again when it is
   marked done, at ui/ritual.js:186 and :193. A reading is stamped by
   snapshot(). Four streams, four stamps, no schema change, and no new write
   anywhere in the app.

   THE ARITHMETIC. Merge the four streams in time order and walk them once.
   Hold the set of quarters touched. When all four are in the set, a turn closed
   at that moment and the set empties.

   WHY THIS SHAPE AND NOT A COUNT OF ANYTHING. Ten entries close no turns. Ten
   rituals close no turns. Volume in one quarter buys nothing at all, which is
   the whole reason to count the circle instead of the acts. To close a turn a
   person has to go round, which is what the loop is for.

   AND IT DOES NOT HAVE TO CLOSE IN ONE SESSION. Write on Monday, practise on
   Tuesday, and the reading moves on Wednesday: the turn closes on Wednesday.
   A circle that had to close inside one visit would be a twenty minute
   product with a hostile five minute mode.
   ------------------------------------------------------------ */
function turnStamps(p){
 var out=[];
 function ms(x){ if(!x)return null; var t=Date.parse(x); return isNaN(t)?null:t; }
 ((p&&p.story&&p.story.entries)||[]).forEach(function(e){
  var t=ms(e&&e.t); if(t!==null)out.push({q:'discover', t:t});});
 ((p&&p.rituals)||[]).forEach(function(x){
  var t=ms(x&&x.t); if(t!==null)out.push({q:'play', t:t});
  /* a ritual saved is a plan. a ritual marked done is a thing that happened,
     and that distinction is already in ledgerRead and is kept here. an entry
     written before the done key existed carries no done and is read as
     practised, for the same reason ledgerRead reads it that way: a person's
     history is not ours to delete over a schema change. */
  var d=(x&&x.done!==undefined)?x.done:x&&x.t;
  if(d===true)d=x&&x.t;
  var td=ms(d); if(td!==null)out.push({q:'flow', t:td});});
 ((p&&p.history)||[]).forEach(function(s){
  var t=ms(s&&s.t); if(t!==null)out.push({q:'embody', t:t});});
 out.sort(function(a,b){return a.t-b.t;});
 return out;}

function turnRead(p,now){
 var st=turnStamps(p), seen={}, turns=[], n=0;
 for(var i=0;i<st.length;i++){
  seen[st[i].q]=st[i].t;
  var full=true;
  for(var j=0;j<QUARTER.length;j++) if(!seen[QUARTER[j].k]){full=false; break;}
  if(full){ n++; turns.push(st[i].t); seen={}; }}
 /* what is still open, in the loop's own order, so a surface can draw the ring
    with the quarters that are already lit. Never as a count of four. */
 var open=[], lit=[];
 QUARTER.forEach(function(q){ (seen[q.k]?lit:open).push(q.k); });
 return {n:n, turns:turns, last:turns.length?turns[turns.length-1]:null,
  lit:lit, open:open, stamps:st.length,
  /* the newest touch per quarter, for the ring's own drawing */
  at:seen};}

/* ------------------------------------------------------------
   DAYS PRACTISED, AND WHY THE MARKS READ IT RATHER THAN A ROW.

   engine/ladder.js computes two numbers off the same day list. run halves on a
   gap of three or more with one grace day, on Lally 2010, cited in that file.
   best counts strictly consecutive days and nothing softens it.

   Three of the sixteen marks test best. Seven days, Thirty days and Ninety
   days therefore demand a perfect row from a product whose own streak
   arithmetic was deliberately built not to demand one, on a citation printed
   six lines above. A person who used the grace day has a live run of seven and
   no Seven days mark. That is a mark shaming a gap, and it is the only place in
   the ladder where the badge is stricter than the mechanic beside it.

   The correction: the practice marks count days practised. Seven days means
   seven days of practice are on the record. It is a count of events that
   happened, which is the only kind of count this product allows, and it is
   earnable by somebody working honestly and slowly. The run is still drawn and
   is still live or not. It is simply not what the mark reads.
   ------------------------------------------------------------ */
function dayKey(t){
 var d=new Date(t); if(isNaN(d))return null;
 return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000);}
function dayList(p){
 var seen={}, out=[];
 ((p&&p.rituals)||[]).forEach(function(x){
  var k=dayKey(x&&x.t); if(k===null||seen[k])return; seen[k]=1; out.push(k);});
 return out.sort(function(a,b){return a-b;});}
/* THE RETURN. The largest gap in the day list, in days.

   It exists so one mark can be earned by coming back, and it is the only
   quantity in the product that reads a gap. It is read for that one purpose and
   is never rendered on its own, because a number printed beside the word gap is
   a product naming an absence. */
function gapMax(p){
 var d=dayList(p), g=0;
 for(var i=1;i<d.length;i++){ var x=d[i]-d[i-1]; if(x>g)g=x; }
 return g;}
/* distinct days carrying an entry, which is what the ten stories mark reads
   instead of ten entries, because ten lines typed in one sitting is volume and
   ten days of looking is the thing the mark claims. */
function entryDays(p){
 var seen={}, n=0;
 ((p&&p.story&&p.story.entries)||[]).forEach(function(e){
  var k=dayKey(e&&e.t); if(k===null||seen[k])return; seen[k]=1; n++;});
 return n;}
/* the tracks a person has actually practised in. PRACTICE carries the track on
   every entry and the ritual writes it, so this is a read and not a store.
   The count is never typed: it is the length of what came back. */
function trackSet(p){
 var s={}; ((p&&p.rituals)||[]).forEach(function(x){ if(x&&x.track)s[x.track]=1; });
 return Object.keys(s);}
/* the seats a person has opened ground at. a meter key is nodeId:chan:line, so
   the node id is the first field, and W carries the seat. Breadth, not volume:
   it cannot be earned by running one seat harder. */
/* THE ADDRESSES OPENED, WHICH IS NOT THE SAME NUMBER AS THE GROUND OPENED.

   ledgerRead.ground is meter.unique.length, and a meter key is
   nodeId:channel:line. One address run across the four channels is four of
   those. So ground is a count of lines and the two marks that read it print
   "Ten distinct addresses opened. Not ten runs. Ten places." above a test that
   passes at two and a half places. Measured on the harness in this folder: the
   day one profile opens one address and its ground reads 4.

   The count of places is the distinct node ids, which is one split per key. */
function addrSet(p){
 var s={};
 (((p&&p.meter&&p.meter.unique))||[]).forEach(function(k){
  var id=String(k).split(':')[0]; if(id)s[id]=1;});
 return Object.keys(s);}
function seatSet(p,W){
 var byId={}; (W||[]).forEach(function(n){byId[n.i]=n.b;});
 var s={};
 (((p&&p.meter&&p.meter.unique))||[]).forEach(function(k){
  var id=String(k).split(':')[0], b=byId[id]||byId[+id];
  if(b)s[b]=1;});
 return Object.keys(s);}

/* ------------------------------------------------------------
   THE MARKS. What you did.

   The sixteen at engine/ladder.js keep their keys, because a key is identity
   and is compared against a record somebody already has. One is renamed:
   `turned` becomes `poled`, so the word turn means one thing in this product
   and one thing only. Its user facing name, First clearing, does not change, so
   nothing a person has already earned reads differently.

   Six are added and five conditions are corrected. Every correction is named in
   the comment beside it with what it cost.

   Every mark carries its quarter, and the quarter carries the seat and the
   colour. A mark's test takes the ledger, the streak, the profile, the turn
   read and the catalogue. Nothing in a test reaches outside those five.
   ------------------------------------------------------------ */
var MARK2=[
 /* ---- DISCOVER. What you found. 3rd Eye. ---- */
 {k:'told', q:'discover', nm:'First story',
  d:'You told it something true and let it read the charge out of that.',
  ic:'M4 5h16v11H8l-4 4z',
  t:function(l,s,p){return ((p&&p.story&&p.story.entries)||[]).length>=1;}},
 {k:'kept', q:'discover', nm:'Ten stories',
  d:'Ten days of entries. The field is read from your own words, not a form.',
  ic:'M4 5h16v11H8l-4 4z M8 9h8 M8 12h5',
  /* WAS TEN ENTRIES, WHICH IS TEN MINUTES OF TYPING. Ten lines in one sitting
     is volume in one quarter of the loop, which is the thing this design
     refuses to pay for. Ten distinct days is the claim the copy was already
     making. One line, and it stops being farmable. */
  t:function(l,s,p){return entryDays(p)>=10;}},
 {k:'ten', q:'discover', nm:'Ten addresses',
  d:'Ten distinct addresses opened. Not ten runs. Ten places.',
  ic:'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  /* WAS l.ground>=10, WHICH IS TEN LINES AND TWO AND A HALF PLACES. */
  t:function(l,s,p){return addrSet(p).length>=10;}},
 {k:'fifty', q:'discover', nm:'Fifty addresses',
  d:'Fifty opened at least once.',
  ic:'M3 12h18 M3 7h18 M3 17h18 M7 3v18 M17 3v18',
  t:function(l,s,p){return addrSet(p).length>=50;}},
 {k:'named', q:'discover', nm:'Every seat opened',
  d:'Ground opened at all seven seats. The whole body, not one corner of it.',
  ic:'M12 3v18 M12 6h5 M12 11h6 M12 16h4 M12 6H7 M12 11H6 M12 16H8',
  /* NEW, and it is the one discover mark that cannot be bought harder in one
     place. Breadth across the seven seats, read off the keys already stored. */
  t:function(l,s,p,tn,C){return seatSet(p,C&&C.W).length>=7;}},

 /* ---- PLAY. What you ran. Sacral. ---- */
 {k:'first', q:'play', nm:'First run',
  d:'You ran one. The instrument is no longer a thing you are reading about.',
  ic:'M12 21V6 M7 11l5-5 5 5',
  t:function(l){return l.rituals>=1;}},
 {k:'hour', q:'play', nm:'Sixty minutes',
  d:'An hour of practice on the record, however it was spread.',
  ic:'M12 3a9 9 0 100 18 9 9 0 100-18 M12 7v5l4 2',
  t:function(l){return l.minutes>=60;}},
 {k:'tracks', q:'play', nm:'Every track run',
  d:'One run in each track. Somatic, body, energy and mind have all been used.',
  ic:'M4 7h16 M4 12h16 M4 17h16 M8 4v16',
  /* NEW. The count is read off PRACTICE at run time and never typed, so a
     fifth track costs this mark nothing. */
  t:function(l,s,p,tn,C){
   var want={}; ((C&&C.PRACTICE)||[]).forEach(function(x){if(x.track)want[x.track]=1;});
   var need=Object.keys(want).length; if(!need)return false;
   return trackSet(p).length>=need;}},
 {k:'floor', q:'play', nm:'The short run',
  d:'Sixty seconds, marked done. A day kept is a day kept.',
  ic:'M6 12h12 M12 8v8',
  /* NEW, AND IT IS THE ONE MARK THAT NEEDS A NEW FIELD. A ritual entry carries
     no flag saying it was the floor version, so the floor cannot be told from a
     twenty minute scan that was cut short. One boolean on the entry,
     floor:true, written where done is written. Nothing else in this module
     needs a schema change. */
  t:function(l,s,p){
   return ((p&&p.rituals)||[]).some(function(x){return !!(x&&x.floor&&x.done);});}},

 /* ---- FLOW. What you kept. Root. ---- */
 {k:'week', q:'flow', nm:'Seven days',
  d:'Seven days of practice on the record.',
  ic:'M4 6h16v14H4z M4 11h16 M8 3v4 M16 3v4',
  /* WAS s.best>=7, STRICTLY CONSECUTIVE. See the comment above dayList. */
  t:function(l,s){return s.days>=7;}},
 {k:'month', q:'flow', nm:'Thirty days',
  d:'Thirty days of practice. The nervous system has had long enough.',
  ic:'M4 6h16v14H4z M4 11h16 M8 3v4 M16 3v4 M9 15l2 2 4-4',
  t:function(l,s){return s.days>=30;}},
 {k:'season', q:'flow', nm:'Ninety days',
  d:'Ninety days of practice. Nothing about this is a beginner number.',
  ic:'M12 3a9 9 0 109 9 M12 3v9h9 M12 12l5 5',
  t:function(l,s){return s.days>=90;}},
 {k:'back', q:'flow', nm:'Came back',
  d:'A fortnight away, and then a day of practice. This is the hard one.',
  ic:'M20 12a8 8 0 11-8-8 M12 4l-3 3 3 3 M20 12v4',
  /* NEW, AND IT IS THE MARK THIS WHOLE DESIGN EXISTS TO MAKE POSSIBLE.
     Every other practice mark in every product of this kind pays for an
     unbroken row, which means the only thing it can say to somebody who
     stopped is that they failed. This one requires the gap. It cannot shame an
     absence because an absence is its condition, and it is the only mark here
     that a person in a bad month can earn by doing the single hardest thing
     available to them, which is opening the thing again. */
  t:function(l,s,p){return gapMax(p)>=14 && s.days>=2;}},

 /* ---- EMBODY. What moved. Heart. ---- */
 {k:'nine', q:'embody', nm:'Nine axes',
  d:'Every one of the nine carries a value you entered. Nothing is a default.',
  ic:'M5 5h14v14H5z M5 10h14 M5 15h14 M10 5v14 M15 5v14',
  /* WAS l.clear+l.carry>=9, WHICH COUNTS ONLY AXES AT 4 OR ABOVE. A person who
     entered a 2 on three axes had entered nine values and the mark said they
     had not, while its own description said "has a value you entered". The
     test now reads what the copy claims. */
  t:function(l,s,p,tn,C){
   var ax=(p&&p.axes)||{}, n=0;
   ((C&&C.CHILD)||[]).forEach(function(c){
    var a=ax[c.nm]||{}; if((+a.held||0)>0||(+a.opp||0)>0)n++;});
   return n>=((C&&C.CHILD)||[]).length && n>0;}},
 {k:'laws', q:'embody', nm:'Laws measured',
  d:'The intake is complete, so integrity is measured rather than assumed.',
  ic:'M12 4v4 M4 8h16 M4 8l-2 5h4z M20 8l-2 5h4z',
  t:function(l,s,p){return !!(p&&p.intake&&p.intake.completedAt);}},
 {k:'stated', q:'embody', nm:'Blueprint stated',
  d:'You named your type, and the field carries that until you move it.',
  ic:'M4 20V8l8-5 8 5v12 M9 20v-7h6v7',
  t:function(l,s,p){return !!(p&&p.seed);}},
 {k:'aimed', q:'embody', nm:'Purpose set',
  d:'Six values placed. The compass has something to point at.',
  ic:'M12 3a9 9 0 100 18 9 9 0 100-18 M12 8l3 8-3-2-3 2z',
  t:function(l,s,p,tn,C){
   var f=C&&C.purposeReady; return !!(p&&p.purpose&&f&&f(p.purpose));}},
 {k:'poled', q:'embody', nm:'First clearing',
  d:'An address that was carrying is held at the far pole instead.',
  ic:'M4 12a8 8 0 1116 0 8 8 0 01-16 0 M8 12l3 3 5-6',
  /* KEY RENAMED FROM `turned`. One word per concept: a turn is one closed
     circle and nothing else in the product may use the word. The name a person
     reads is unchanged. */
  t:function(l){return l.clear>=1;}},
 {k:'seat', q:'embody', nm:'Five clear',
  d:'Five axes holding the opposite. That is structure, not a good day.',
  ic:'M4 12a8 8 0 1116 0 8 8 0 01-16 0 M12 4v16 M4 12h16',
  t:function(l){return l.clear>=5;}},
 {k:'watched', q:'embody', nm:'Ten readings',
  d:'Ten readings on file, so the movement is yours to see and not to recall.',
  ic:'M3 17l5-6 4 4 3-4 6 6 M3 5h18v14H3z',
  t:function(l){return l.snaps>=10;}},

 /* ---- THE CIRCLE. Solar. ---- */
 {k:'ring', q:'turn', nm:'First turn',
  d:'You went all the way round once. Found it, ran it, kept it, saw it move.',
  ic:'M12 3a9 9 0 109 9 M21 12l-3-3 3-3',
  t:function(l,s,p,tn){return !!tn && tn.n>=1;}},
 {k:'rings', q:'turn', nm:'Ten turns',
  d:'Ten closed circles. This is the number that says the loop is yours.',
  ic:'M12 3a9 9 0 109 9 M21 12l-3-3 3-3 M12 8a4 4 0 104 4',
  t:function(l,s,p,tn){return !!tn && tn.n>=10;}}];

/* the quarter entry for a mark or an award, looked up by identity and never by
   position, which is the rule the whole repository works under. */
function quarterOf(k){
 if(k==='turn')return {k:'turn', nm:'Turn', seat:TURN_SEAT,
  job:'close the circle', act:'all four of the above'};
 for(var i=0;i<QUARTER.length;i++)if(QUARTER[i].k===k)return QUARTER[i];
 return null;}

/* ------------------------------------------------------------
   THE AWARDS. What moved, as a dated fact.

   AN AWARD'S COLOUR IS WHERE IT HAPPENED, NOT WHICH FAMILY IT IS IN.
   This is the one place this design overrules DESIGN-gamification.md 6.2,
   which put Cleared at the throat, Held at the heart and Moved at the root as
   family colours. An award is about a place in the body, so the body has
   already decided its colour: a Cleared at the root is root coloured and a
   Held of Trust is root coloured, because Fear sits at the root. The family is
   carried by the ring geometry instead. The shelf then reads as a body map at a
   glance, which is the layer sewing that was ruled: the award to the body, the
   body to the story.

   Moved has no seat, because coherence is the whole instrument and not one
   place in it. It takes the neutral ink.

   CONFERRED ONCE, DATED, AND NEVER REMOVED. One new array on the profile,
   p.awards, each entry {k, t, at}. Nothing about a person's state is stored:
   the entry says an award became true on a date, which is a fact about a date.
   ------------------------------------------------------------ */
function awardList(C){
 var out=[], seats=(C&&C.SEATS)||[], child=(C&&C.CHILD)||[], bands=(C&&C.TIERDEF)||[];
 /* CLEARED. One per seat. An address at that seat whose far pole now exceeds
    what it is carrying.

    MEASURED, AND IT IS WHY THIS FAMILY DOES NOT READ A RELEASE RUN. The release
    candidate list is compute().excess, which is W filtered on jq>=4, and jq is
    zero everywhere until an opposite has been installed. On the fourteen person
    roster, excess is empty for seven of them, at both ends of the range: Gordon
    at CQ 0.8 carries 107 addresses and has nothing the release mechanic will
    offer him, and Rosa at CQ 100 has nothing to offer either. An award family
    that needed a release run would be shut to half the roster, and the half it
    shut out at the bottom is the half in a bad month. Read off the pole per
    address instead, which compute() already returns for all of them. */
 seats.forEach(function(b){
  out.push({k:'clear:'+b, fam:'Cleared', seat:b, nm:b+' cleared',
   d:'An address at the '+b.toLowerCase()+' is held at its far pole.',
   ring:'open'});});
 /* HELD. One per axis, named after the opposite and not after the fetter,
    because the award is for the thing being held and not for the thing that
    was there. Trust held, not Fear held. */
 child.forEach(function(c){
  out.push({k:'held:'+c.nm, fam:'Held', seat:c.seat, nm:(c.opp||c.nm)+' held',
   d:c.opp+' at its pole across seven readings in a row.',
   ring:'solid', axis:c.nm});});
 /* MOVED. One per band boundary, upward only.

    DESIGN-gamification.md 6.2 has this in either direction on the argument that
    a crossing is a fact and a fact claims nothing. The fact is not in dispute.
    Putting a downward crossing on a shelf of things done is, because a shelf is
    read as a list of what a person achieved and an entry that says the reading
    fell is a product congratulating somebody for getting worse. The downward
    crossing belongs on the graph, which already draws it, and the graph is the
    honest place for it because a graph is a record and a shelf is a reward. */
 for(var i=bands.length-1;i>0;i--){
  var lo=bands[i], hi=bands[i-1];
  out.push({k:'moved:'+hi.at, fam:'Moved', seat:null,
   nm:'Crossed into '+hi.nm.toLowerCase(),
   d:'Coherence crossed '+hi.at+' on a date. It says nothing about why.',
   ring:'half', at:hi.at, from:lo.nm});}
 /* CLOSED. THE FOURTH FAMILY, AND IT EXISTS BECAUSE OF A MEASUREMENT.

    Measured on the fourteen person roster at ninety days and twenty two closed
    circles, with the release arithmetic the product actually runs: the award
    shelf holds NOTHING for Gordon and Tomas, and one award for Ana and Nkem.
    The four most loaded people on the roster do ninety days of work and the
    shelf cannot say anything about any of it.

    Not because they did less. Gordon's coherence moved from 0.8 to 3.0, and his
    ceiling is 3.1, so he closed ninety six percent of the distance available to
    him. Every one of the nine band boundaries sits above 11, so all of that
    movement happens inside one band and the Moved family is blind to it. He has
    no address with a pole, so the Cleared family is blind to it too.

    The band ladder measures a person against everybody. The ceiling measures a
    person against themselves, and the owner has already ruled which of those
    two this instrument is: a person is the most powerful version of themselves
    and the reading is the drag against it, which is the comment above
    cqCeiling in engine/export.js. So the fourth family reads the drag coming
    off, in quarters of the distance that was there on the first reading.

        closed = (cq now - cq first) / (ceiling first - cq first)

    It is the same move MARKERS already makes for ground, where the six
    distances are fractions of a person's own load rather than one man's
    numbers at one man's age. Four awards, and somebody already at their
    ceiling holds all four on the first reading, which is honest: they are at
    their ceiling. */
 [['one quarter',0.25],['half',0.5],['three quarters',0.75],['all of it',1]]
  .forEach(function(x){
   out.push({k:'closed:'+x[1], fam:'Closed', seat:null,
    nm:x[0]+' of the drag off',
    d:'The distance between your reading and your own ceiling, '
      +'closed by '+x[0]+'.',
    ring:'quarter', frac:x[1]});});
 return out;}

/* WHAT IS COMPUTABLE TODAY AND WHAT IS NOT, said by the module rather than by a
   paragraph, so nobody can ship the shelf believing a family works.

   Cleared reads compute() and works today.
   Moved reads p.history, which carries cq on every snapshot, and works today.
   Held cannot be computed at all, because a snapshot carries cq, dq, sq, pole,
   jq, radiance, the seat counts, the band and the archetype, and does not carry
   the nine axes. Seven readings in a row of an axis at its pole is not in the
   record. It needs eighteen characters per snapshot: the nine held and the nine
   opposite values, base thirty six, one string. At two hundred snapshots that
   is 3.6 kilobytes and it is the only storage this design adds beyond one
   boolean and one array. */
var AWARD_READY={Cleared:true, Moved:true, Held:false, Closed:false};
/* and why each of the two is not, by name, so the size of the addition is on
   the record rather than in somebody's head.

   Held   nine held and nine opposite values per snapshot. Eighteen base thirty
          six characters, one string, 3.6 kilobytes at two hundred snapshots.
   Closed the ceiling at the moment of the reading. One number per snapshot.
          cqCeiling is already exported and already pure. */
var AWARD_NEED={Held:'the nine axes on the snapshot, eighteen characters',
 Closed:'the ceiling on the snapshot, one number'};
var HELD_RUN=7;

function awardRead(p,r,now,C){
 var all=awardList(C), got=[], blocked=[];
 var hist=(p&&p.history)||[];
 /* the highest band boundary the record has ever crossed upward */
 var crossed={};
 for(var i=1;i<hist.length;i++){
  var a=hist[i-1], b=hist[i];
  if(!a||!b||typeof a.cq!=='number'||typeof b.cq!=='number')continue;
  ((C&&C.TIERDEF)||[]).forEach(function(t){
   if(a.cq<t.at && b.cq>=t.at)crossed['moved:'+t.at]=b.t||null;});}
 /* an address at a seat whose far pole exceeds what it carries */
 var poled={};
 ((r&&r.loaded)||[]).concat((r&&r.carrying)||[]).forEach(function(n){
  if(n&&typeof n.pole==='number'&&typeof n.held==='number'&&n.pole>n.held)poled[n.b]=1;});
 /* and an address that is not loaded at all and carries a pole is cleared too,
    which is the only way somebody at the top of the range earns one. */
 ((C&&C.W)||[]).forEach(function(n){
  if(n&&typeof n.pole==='number'&&typeof n.sq==='number'&&n.pole>n.sq*10*0.1&&n.pole>=4)poled[n.b]=1;});
 /* the drag that has come off, against the drag that was there on the first
    reading. It reads a ceiling the snapshot does not carry yet, so the caller
    passes the pair and the read says so rather than guessing one. */
 var closed=null;
 if(hist.length>=2){
  var f=hist[0], lastS=hist[hist.length-1];
  var c0=(f&&typeof f.ceil==='number')?f.ceil:((C&&C.ceilFirst)||null);
  if(c0!==null&&typeof f.cq==='number'&&typeof lastS.cq==='number'&&c0>f.cq)
   closed=(lastS.cq-f.cq)/(c0-f.cq);
  else if(c0!==null&&typeof f.cq==='number'&&c0<=f.cq)closed=1;}
 all.forEach(function(a){
  if(a.fam==='Held'){ blocked.push(a); return; }
  var ok=false, at=null;
  if(a.fam==='Cleared')ok=!!poled[a.seat];
  if(a.fam==='Moved'){ at=crossed[a.k]||null; ok=!!at; }
  if(a.fam==='Closed'){ ok=(closed!==null&&closed>=a.frac); }
  if(ok)got.push({k:a.k, fam:a.fam, seat:a.seat, nm:a.nm, d:a.d, ring:a.ring, t:at});});
 return {earned:got, blocked:blocked, all:all, closed:closed,
  ready:AWARD_READY, need:AWARD_NEED, heldRun:HELD_RUN};}

/* ------------------------------------------------------------
   THE MARK READ. Earned, and the next one. Never how many of how many.

   The same shape ladderRead already returns, for the same reason: the earned
   marks are shown, the next one is named with what it takes, and the ones past
   it are not enumerated, so no surface can render a checklist of a person's
   unfinished self.

   next is the nearest unearned mark in the quarter the person is furthest into,
   because the useful next thing is adjacent to what they are already doing.
   ------------------------------------------------------------ */
function markRead(p,l,s,tn,C){
 var got=[], left=[];
 MARK2.forEach(function(m){
  var ok=false; try{ ok=!!m.t(l,s,p,tn,C); }catch(e){ ok=false; }
  (ok?got:left).push(m);});
 var by={}; got.forEach(function(m){by[m.q]=(by[m.q]||0)+1;});
 var lead=null, best=-1;
 left.forEach(function(m){ var n=by[m.q]||0; if(n>best){best=n; lead=m;} });
 return {earned:got, next:lead, byQuarter:by, total:MARK2.length};}

/* ------------------------------------------------------------
   THE CURVE. Stated as arithmetic so it can be drawn rather than asserted.

   A turn needs all four quarters, so the rate is set by how often a person
   closes the circle and not by how much they do inside one quarter.

       turns(d, c) = floor(d * c / 7)

   d is days since the first session and c is circles closed per week. The
   four session shapes the product is built for:

       the whole ring, daily     c = 7    turns = d
       the whole ring, twice     c = 2    turns = floor(2d/7)
       the whole ring, weekly    c = 1    turns = floor(d/7)
       the floor only            c = 0    turns = 0, days kept = d

   THE FOURTH ROW IS THE ONE THAT MATTERS. A person who only ever runs the
   sixty second floor closes no circles at all and the design pays them
   nothing for a turn, which is correct, and takes nothing away from them,
   which is the rule. They still keep every day, still earn Seven days,
   Thirty days and Ninety days, still carry a live run, and the word turn never
   appears on their screen as something they are missing.

   AND WHAT UNLOCKS IS NOT SET BY A NUMBER SOMEBODY CHOSE. A surface appears
   the moment the arithmetic behind it can be stated honestly and never before
   and never later. seriesRead already works this way: no readings is one state,
   one reading is a second, and two or more is a line, because one point is not
   a flat line, it is one reading. Every rung below is the minimum data a
   statement needs to be true.
   ------------------------------------------------------------ */
function turnsAt(d,per){ return Math.floor(d*per/7); }
var READY=[
 {n:1,  says:'a reading',                   where:'the field, the body, the ladder'},
 {n:2,  says:'a direction',                 where:'the graph draws its first line'},
 {n:7,  says:'an axis held its pole',       where:'the award shelf appears'},
 {n:13, says:'a quarter of the graph',      where:'the quarter span stops being empty'},
 {n:30, says:'a month at a daily cadence',  where:'the month span'}];
function curveOf(days,per){
 var out=[];
 for(var d=0;d<=days;d++)out.push({d:d, turns:turnsAt(d,per)});
 return out;}

if(typeof module!=='undefined'&&module.exports)module.exports={
 QUARTER:QUARTER, TURN_SEAT:TURN_SEAT, quarterOf:quarterOf,
 turnStamps:turnStamps, turnRead:turnRead,
 dayKey:dayKey, dayList:dayList, gapMax:gapMax, entryDays:entryDays,
 trackSet:trackSet, seatSet:seatSet, addrSet:addrSet,
 MARK2:MARK2, markRead:markRead,
 awardList:awardList, awardRead:awardRead, AWARD_READY:AWARD_READY,
 AWARD_NEED:AWARD_NEED, HELD_RUN:HELD_RUN,
 turnsAt:turnsAt, curveOf:curveOf, READY:READY};
