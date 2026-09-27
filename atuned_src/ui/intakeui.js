
/* ============================================================
   THE DIAGNOSTIC. 21 blocks of 3. Resumable, any order, nothing
   required. Every finished law is a finding on its own.
   ============================================================ */
var IQ_OPEN=null;
/* THE SEED. A four letter type is what a person says about themselves, so
   it is never presented as a reading. It puts charge on the nine axes so a
   new field is not empty, and the line underneath says how much of the
   field is still the seed and how much the person has moved. */
function iqSeedBlock(p){
 var sd=p.seed, share=seedShare(p);
 /* It said "Type, if you know it", which names nothing. It is a Myers-Briggs
   four letter type and saying so costs one word and removes all the guessing. */
 var sel='<div class="iq-f"><label for="wtype">Myers-Briggs</label>'
  +'<select id="wtype"><option value="">not said</option>'
  +TYPE16.map(function(t){return '<option value="'+t+'"'+(sd&&sd.type===t?' selected':'')+'>'+t+'</option>';}).join('')
  +'</select></div>';
 /* HS sweep. Before a type is chosen this carried three sentences on what a
    four letter type is and what giving one does, beside a select whose own
    first option says "not said". That is the section explaining itself, and
    it is gone. Once a type is chosen the line is a reading, how much of the
    field is still the seed, and it stays. Its last sentence, on what the seed
    does not write, explained the mechanism and is cut. */
 var note=sd?('Seeded from <b>'+esc(sd.type)+'</b>. <b>'+Math.round(share*100)+'%</b> of what the axes carry is still '
  +'that seed'+(share<=0.25?', so the field is mostly yours now.':share>=0.9?'. Nothing has moved it yet.':'.')):'';
 /* auto-fill and not the sheet's auto-fit when the note is gone: auto-fit
    collapses the empty tracks and the one select stretched across the whole
    row, measured at 1600 on the blank profile. auto-fill keeps the tracks, so
    the select is one field wide, the width of the fields above it. */
 return '<div class="iq-seed"><div class="iq-fields"'
  +(sd?'':' style="grid-template-columns:repeat(auto-fill,minmax(168px,1fr))"')+'>'+sel
  +(note?'<div class="iq-f" style="grid-column:span 2"><label>&nbsp;</label><p class="iq-why" style="margin:0">'+note+'</p></div>':'')
  +'</div></div>';}
/* WHAT A TEN MEANS. Ruled by the owner, and the single most consequential
   sentence on this surface: a scale nobody has calibrated is not a
   measurement, it is a mood. The instrument reads the gap between three
   framings of one law, so a person answering from how they would like to be
   seen poisons all three at once and the gap goes flat. Say what the number
   is before the first one is pressed, in the place it is pressed. */
function iqAccuracy(){
 /* THREE PANELS, NOT A WALL. The same three facts were a sixteen pixel
    paragraph of nine lines followed by a second card of three more, and a
    person about to answer sixty three questions reads neither. One panel per
    fact, side by side, each short enough to finish. */
 /* THREE HEADINGS, AND TWO OF THEM WERE WRONG BEFORE THE CASE RULE TOUCHED
    THEM. They were also written in title case by hand, which is what the
    stylesheet exists to stop: the transform does the capitalising so nobody
    has to remember the rule while writing a heading.

    "A Ten Is A Hundred Out Of A Hundred" is the phrasing the owner struck. A
    number has to say what it is out of in regular words, and a hundred out of
    a hundred is not regular words, it is the same number said twice. The scale
    key eight lines down already says it properly: never, about half the time,
    every time. So the heading names the panel and the panel says what a ten
    means, which is what it was already doing underneath.

    "This Is Accuracy, Not Judgment" denies a judgement nobody raised. A
    reassurance against a fear that has not been mentioned is how the idea gets
    planted, and a person about to answer sixty three questions about their own
    integrity does not need to be told it is not a verdict. The panel gives two
    examples of an accurate answer, so the heading says that and nothing more.

    The first heading was going to keep its words and take plain, and seeing
    the three of them rendered side by side killed that: one sentence case
    heading between two title case ones, in three identical cards in one row,
    is a row that looks like two people built it. Three sibling headings in one
    component are one visual unit and they take one case. So all three are
    labels, which is also the shorter answer, and the panel under this one
    already says which three ways. */
 /* THE THREE PANELS ARE GONE, AND SO IS THE PARAGRAPH UNDER THEM. Round HS,
    his words: "get rid of all this like second or three third tier text pick
    how much to run each pattern is what like we have overlays for all this
    shit." Three headed panels explaining how the
    questionnaire works, then a fourth paragraph on why accuracy is cheaper,
    were the section explaining itself four times before the first question.

    What survives is the one thing that has to be in the place it is pressed,
    and it is the owner's own ruling above: what the number means. The key
    says it in six words across the three points of the scale. The duration
    and "stop whenever" stay because they are the two measured panel findings
    the functional gate holds, and each is a fact a person needs before starting,
    not a description of the section. The three ways are shown by layout: an
    open law sets its three framings side by side, each with its own name,
    Under cost, Unseen and Ordinary day. */
 return '<div class="iq-acc">'
  +'<p class="iq-sc-key"><b>0</b> never <span>·</span> <b>5</b> about half the time '
  +'<span>·</span> <b>10</b> every time <span>·</span> '
  +'about fifteen minutes. Stop whenever and come back.</p>'
  +'</div>';}

/* THE SEVEN SEATS, CROWN DOWN TO ROOT, and one plain line saying what each
   one governs. Twenty one laws in one flat accordion is a list, and a list is
   what the owner called boring. Grouped by seat in body order it is a figure
   read top to bottom, and the colour of the group is the colour of that seat
   everywhere else in the product. */
var IQ_SEATS=['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'];
/* THE THREE FRAMINGS, NAMED IN ENGLISH. Q3 keys them left, right and neutral,
   which is the axis the arithmetic runs on and identity in the engine, so it
   does not move. It was also being printed on the card as the heading a person
   reads, and "neutral" tells nobody anything. The card says what the framing
   actually is. The key stays where it belongs. */
var IQ_SIDE={left:'Under cost',right:'Unseen',neutral:'Ordinary day'};
var IQ_SEATLINE={'Crown':'what you belong to','3rd Eye':'what you see',
 'Throat':'what you say','Heart':'what you give','Solar':'what you carry',
 'Sacral':'what you want','Root':'what you stand on'};
/* THE IDENTITY ROLLS UP ON SAVE. Ruled by the owner, and the reasoning is his:
   once a person has entered their birth moment and pressed save, they should
   not be standing in front of that form every time they come back. A birth
   moment does not change. The block collapses to one line stating what was
   entered, and an edit control is what reopens it.

   The seal is a stamp and not a lock. Nothing is thrown away and nothing is
   refused. Edit reopens the same fields with the same values in them.

   A profile with nothing in it never rolls up, because there is nothing to
   state and a collapsed empty card is a dead end on a stranger's first pass. */
function iqNamed(w){
 return [w.first,w.middle,w.last].filter(function(x){return x&&x.trim();}).join(' ');}
function iqSealable(w){
 var bn=w.born||{};
 return !!(iqNamed(w)||bn.date||bn.place);}
function iqSealedCard(p){
 var w=p.who||{}, bn=w.born||{}, nm=iqNamed(w);
 var bits=[];
 if(bn.date) bits.push(bn.date);
 if(bn.timeUnknown) bits.push('time not known');
 else if(bn.time) bits.push(bn.time);
 if(bn.place) bits.push(bn.place);
 if(bn.zone) bits.push(bn.zone);
 if(w.sex) bits.push({f:'female',m:'male',o:'other'}[w.sex]||w.sex);
 /* WHAT IS MISSING IS SAID OUT LOUD. A rolled up card that hides a blank date
    reads as complete, and the birth chart is then quietly running on nothing.
    The card names the gap and the edit control is right beside it. */
 var gaps=[];
 if(!nm) gaps.push('no name');
 if(!bn.date) gaps.push('no date of birth');
 if(!bn.place) gaps.push('no place of birth');
 if(bn.date&&!bn.time&&!bn.timeUnknown) gaps.push('no time of birth');
 /* only when it changes the reading: a place the table locates carries its
    own offset, and an untimed birth has no instant for an offset to move */
 if(bn.time&&!bn.timeUnknown&&!bn.zone&&!PLACE[bn.place]) gaps.push('no time zone of birth');
 var sd=p.seed;
 return '<div class="iq-sealed">'
  +'<div class="iq-sl-l">'
   /* the same label as the form under it, written the same way. It read
      "Who This Is" here and "Who this is" there, in one file. */
   +'<div class="pm-eye">Who this is</div>'
   +'<div class="iq-sl-nm">'+esc(nm||'Unnamed')+'</div>'
   +(bits.length?'<div class="iq-sl-bt">'+esc(bits.join(' · '))+'</div>':'')
   +(sd?'<div class="iq-sl-bt">seeded from '+esc(sd.type)+'</div>':'')
   +(gaps.length?'<div class="iq-sl-gap">'+esc(gaps.join(', '))+'</div>':'')
  +'</div>'
  +'<button class="btn" id="iqedit">Edit</button></div>';}
function iqField(label,key,v){
 var id='w'+key;
 return '<div class="iq-f"><label for="'+id+'">'+label+'</label>'
  +'<input type="text" id="'+id+'" data-who="'+key+'" value="'+esc(v||'')+'"></div>';}
/* The suggestion list for the time zone field, made once for the page. It
   lives outside the form because renderIntake rewrites the form on every
   change and four hundred options rebuilt each time is work for nothing. A
   browser with no zone list gets no suggestions and a field that still
   takes a typed name. */
function iqZones(){
 if(document.getElementById('wzones'))return;
 var z=[]; try{ z=Intl.supportedValuesOf('timeZone'); }catch(e){ z=[]; }
 var dl=document.createElement('datalist'); dl.id='wzones';
 dl.innerHTML=z.map(function(n){return '<option value="'+esc(n)+'">';}).join('');
 document.body.appendChild(dl);}
function iqEnsure(){
 if(!PROFILES.length) PROFILES=pStore();
 if(!PROFILES.length){ pNew('You'); loadProfile(CURP); }
 if(!CURP){ CURP=PROFILES[0]; loadProfile(CURP); }
 return CURP;}
/* ============================================================
   THE ART PASS, WIRED IN. Round IT drew the questions three ways in
   proto/energetics-art and showed them to the owner. His answer, verbatim:
   "Energetic art pass. I like that for the questions. That design is really
   cool. Run with it, wire it in." He named no one of the three. The same
   question came up on the Story page's three imprint views, and his answer
   there, once asked plainly, was to keep all three as a toggle (TASKS.md
   round JJ). So the same is done here, with the same three icon control:
     list   mockup A, a reading list in Summary's treatment. The default,
            because it is the accordion's own shape redrawn: the seven seats
            crown to root, and a law opens in place under its own row.
     wheel  mockup B, the Field's treatment. CQ is the lit orb in the middle,
            the seats sit on the outer ring, and the law in hand opens in the
            panel beside the wheel so the figure never leaves the screen.
     one    mockup C, one law at a time under a strip of all twenty one.
   PORTED, NOT REBUILT. The prototype carried its own copy of iqScore reading
   a JSON dump of the engine. None of that came across: every view reads
   iqScore(p), iqList(), SI and the seat tables off the live profile, and an
   answer lands in the one handler renderIntake already had. Only the drawing
   changed, so the arithmetic still has exactly one path.
   ============================================================ */
var IQ_VIEW='list', IQ_FOCUS=null;
/* the labels are said to a ten year old, V21: what the picture is, in words
   they already have. The icon is the name and the title says what it shows. */
var IQ_VIEWS=[
 ['list','List','List: every law, from the top of your body to the bottom',
  'M4 6.5h2M9 6.5h11M4 12h2M9 12h11M4 17.5h2M9 17.5h11'],
 ['wheel','Wheel','Wheel: all 21 laws in a circle, your CQ in the middle',
  'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17M12 9a3 3 0 1 1 0 6a3 3 0 1 1 0-6M12 3.5V9M20.5 12H15M12 20.5V15M3.5 12H9'],
 ['one','One at a time','One at a time: one law and its three questions, then the next',
  'M12 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10M5.5 9l-3 3l3 3M18.5 9l3 3l-3 3']];
/* .st-ico is the Story page's own view button, so the three carry the tap
   floor, the pressed ring and the Punch treatment that toggle already has,
   and the two toggles in the product look like one control. */
function iqViewHtml(){
 return '<span class="iqa-views" role="group" aria-label="How the questions are shown">'
  +IQ_VIEWS.map(function(v){
   return '<button type="button" class="st-ico" data-iqv="'+v[0]+'" aria-pressed="'+(IQ_VIEW===v[0])+'" '
    +'aria-label="'+esc(v[1])+'" title="'+esc(v[2])+'">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+v[3]+'"/></svg></button>';}).join('')+'</span>';}
/* THE RULES TRAVEL WITH THE RENDERER, for now. The page's stylesheet is in
   shell/head.html and another seat has that file open this round, so the art
   pass carries its own sheet, added once, the first time the section draws.
   Every selector is prefixed iqa so nothing here can reach another surface.
   Two things about it are load bearing.

   The breakpoints are container queries on .iqa, not media queries on the
   window. The section sits under the avatar in a centre column whose width is
   not the window's, and the prototype's 1100 and 760 were measured on a page
   that was the whole window.

   Every rule inside a container query names two classes. The design gate
   walks into a container rule, where it does not walk into a media rule, and
   reads a single class that sets geometry twice as a collision. */
function iqArtCss(){
 if(document.getElementById('iqa-css'))return;
 var st=document.createElement('style'); st.id='iqa-css';
 st.textContent=[
  '.iqa{container-type:inline-size;min-width:0;margin-top:14px}',
  '.iqa-hd{display:flex;justify-content:space-between;align-items:center;gap:14px 18px;flex-wrap:wrap}',
  '.iqa-cq{display:flex;align-items:center;gap:12px;min-width:0}',
  '.iqa-cqp{display:inline-flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;border-radius:999px;',
  ' background:var(--sunk);border:1px solid color-mix(in srgb,var(--accent) 40%,transparent)}',
  '.iqa-cqp b{font-family:var(--num);font-size:22px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}',
  '.iqa-cqw{display:flex;flex-direction:column;line-height:1.25}',
  '.iqa-cqt{color:var(--accent);font-size:19px;font-weight:600}',
  '.iqa-cqs{color:var(--dim);font-size:13px}',
  '.iqa-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
  '.iqa-views{display:inline-flex;gap:4px}',
  /* the framings keep the classes the functional gate reads an open law by,
     and the accordion's card treatment is taken off them here. The id is
     what outranks body.punch and body.lumen, which paint .iq-qc as a box. */
  '#iqbody .iqa .iq-law{border:0;background:none;border-radius:0;overflow:visible}',
  '#iqbody .iqa .iq-qc{border:0;background:none;border-radius:0;padding:0}',
  '.iqa-fr{display:grid;gap:8px;min-width:0}',
  '.iqa-flr{display:flex;align-items:baseline;gap:8px}',
  '.iqa-fl{font-style:normal;font-size:12.5px;font-weight:500;color:var(--c)}',
  '.iqa-ex{font-family:var(--num);font-size:12.5px;color:var(--dim)}',
  '.iqa-qt{font-size:15.5px;line-height:1.45;color:var(--ink)}',
  '.iqa-gap{display:block;width:100%;height:auto}',
  '.iqa-sub{font-size:13px;color:var(--dim)}',
  '.iqa-sub b{font-weight:500;color:var(--c)}',
  /* A, the reading list */
  '.iqa-list{margin-top:22px}',
  '.iqa-seat{display:grid;grid-template-columns:220px minmax(0,1fr);gap:24px;padding:18px 0;border-top:1px solid var(--edge)}',
  '.iqa-seat:first-child{border-top:0}',
  '.iqa-sh{display:flex;gap:12px;align-items:flex-start}',
  '.iqa-shn{font-size:17px;font-weight:600;color:var(--c)}',
  '.iqa-shl{font-size:13px;color:var(--dim)}',
  '.iqa-laws{display:flex;flex-direction:column;min-width:0}',
  '.iqa-lawr{display:grid;grid-template-columns:auto minmax(0,1fr) 200px;gap:14px;align-items:center;width:100%;',
  ' min-height:56px;padding:6px 8px;border-radius:12px;border:1px solid transparent;background:none;',
  ' color:var(--ink);font-family:var(--sans);text-align:left;cursor:pointer}',
  '.iqa-lawr:hover{background:var(--sunk)}',
  '.iqa-lawr[aria-expanded="true"]{border-color:color-mix(in srgb,var(--c) 40%,transparent)}',
  'body.punch .iqa-lawr[aria-expanded="true"]{border-color:transparent;background:var(--sunk)}',
  '.iqa-lt{display:block;font-size:16px;font-weight:500}',
  '.iqa-lv{display:block;font-size:13px;color:var(--dim)}',
  '.iqa-gw{min-width:0}',
  '.iqa-open{display:grid;gap:18px;padding:8px 8px 16px 64px}',
  '.iqa-open .iqa-fr{grid-template-columns:minmax(0,1fr) minmax(0,540px);gap:20px;align-items:center}',
  /* B, the wheel */
  '.iqa-stage{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,560px);margin-top:18px;overflow:hidden;',
  ' border-radius:var(--r);background:var(--sunk);border:1px solid var(--edge)}',
  '.iqa-wheel{display:flex;justify-content:center;align-items:flex-start;padding:14px;min-width:0}',
  '.iqa-wheel svg{width:100%;max-width:640px;height:auto}',
  '.iqa-lb{cursor:pointer;outline:none}',
  '.iqa-lb:focus-visible .iqa-lbf{stroke:var(--accent)}',
  '.iqa-side{display:flex;flex-direction:column;gap:18px;padding:22px;min-width:0;border-left:1px solid var(--edge)}',
  '.iqa-sidehd{display:flex;gap:12px;align-items:center}',
  '.iqa-h3{margin:0;font-size:22px;font-weight:600;color:var(--ink)}',
  '.iqa-inhand{display:grid;gap:22px}',
  /* C, one law at a time */
  '.iqa-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 14px;margin-top:18px;padding:8px 12px;',
  ' border-radius:28px;background:var(--sunk);border:1px solid var(--edge)}',
  '.iqa-grp{display:flex;gap:2px}',
  '.iqa-sb{display:grid;place-items:center;min-width:var(--tap);min-height:var(--tap);padding:0;border:0;',
  ' border-radius:999px;background:none;cursor:pointer}',
  '.iqa-sb[aria-current="true"]{box-shadow:inset 0 0 0 1.5px var(--accent)}',
  'body.punch .iqa-sb[aria-current="true"]{box-shadow:none;background:var(--panel-2)}',
  '.iqa-bstrip{display:none}',
  '.iqa-focus{display:grid;grid-template-columns:260px minmax(0,1fr);gap:40px;align-items:start;margin-top:26px}',
  '.iqa-hero{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;min-width:0}',
  '.iqa-ring{width:220px;height:220px;max-width:100%}',
  '.iqa-ln{font-size:30px;font-weight:600;line-height:1.15;letter-spacing:-.01em;color:var(--ink)}',
  '.iqa-hgap{width:100%;max-width:240px}',
  '.iqa-qs{display:flex;flex-direction:column;gap:26px;max-width:720px;min-width:0}',
  '.iqa-nav{display:flex;justify-content:space-between;gap:10px}',
  /* Punch outlines nothing and Lumen draws no edge, and both already say so
     for every other panel in the product */
  'body.punch .iqa-cqp,body.punch .iqa-stage,body.punch .iqa-strip,body.punch .iqa-side,',
  'body.lumen .iqa-cqp,body.lumen .iqa-stage,body.lumen .iqa-strip{border-color:transparent}',
  '@container (max-width:1040px){',
  ' .iqa .iqa-stage{grid-template-columns:1fr}',
  ' .iqa .iqa-side{border-left:0;border-top:1px solid var(--edge)}',
  ' .iqa .iqa-open .iqa-fr{grid-template-columns:1fr;gap:8px}',
  ' .iqa .iqa-open{padding-left:8px}}',
  '@container (max-width:700px){',
  ' .iqa .iqa-seat{grid-template-columns:1fr;gap:10px}',
  ' .iqa .iqa-lawr{grid-template-columns:auto minmax(0,1fr)}',
  ' .iqa .iqa-gw{grid-column:1/-1}',
  ' .iqa .iqa-focus{grid-template-columns:1fr;gap:18px}',
  /* the wheel's cost, measured in the prototype: at phone width a law on it
     is about 27 pixels to press, under the 44 floor. So on a phone the wheel
     is the figure and C's strip above it is the picker. */
  ' .iqa .iqa-bstrip{display:flex}',
  ' .iqa .iqa-strip{gap:8px}',
  ' .iqa .iqa-ln{font-size:24px}',
  /* the ring at full size put the first question under the fold at 390,
     so on a phone it is the law's mark and not the page's figure */
  ' .iqa .iqa-ring{width:140px;height:140px}',
  ' .iqa .iqa-side{padding:16px 10px}',
  ' .iqa .iqa-wheel{padding:6px}}'
 ].join('\n');
 document.head.appendChild(st);}

function iqLawsOf(b){
 var out=[]; SI.forEach(function(l,li){if(l.b===b)out.push({l:l,li:li});}); return out;}
function iqBodyOrder(){
 var o=[]; IQ_SEATS.forEach(function(b){iqLawsOf(b).forEach(function(x){o.push(x.li);});}); return o;}
function iqGot(p,li){
 return [0,1,2].filter(function(t){return p.intake.answers[li*3+t]!=null;}).length;}
/* THE LAW IN HAND. The list can have nothing open, as the accordion could.
   The wheel and one at a time always hold one, and with nothing chosen it is
   the first law in body order that still has a question left, so a person
   arriving lands on the next thing to answer rather than on the Crown again. */
function iqInHand(p){
 if(IQ_OPEN!=null)return IQ_OPEN;
 var o=iqBodyOrder();
 for(var i=0;i<o.length;i++)if(iqGot(p,o[i])<3)return o[i];
 return o[0];}
/* the accordion's own words for a law, kept word for word */
function iqLine(s,g){return s?'spread '+s.spread+', '+s.lean:g?(3-g)+' left':'unanswered';}
/* a law as Summary draws a thing: its own glyph in a ring whose arc is the
   score once all three are in, and the share answered until then */
function iqLawBadge(l,s,g,size,bare){
 return crBadge(l.b,s?s.score*10:g/3*100,{size:size,glyph:'<path d="'+l.ic+'"/>',
  raw:s?s.score.toFixed(1):null,bare:!!bare||!s});}
/* THE GAP, DRAWN. The measurement is the distance between three readings of
   one law, so it is three marks on one line from 0 to 10: hollow for the two
   framings, solid for the ordinary day, and the seat colour spanning the
   outer two. The accordion printed it as a sentence. The strokes that are not
   the seat's colour go through style, because a custom property does not
   resolve inside a presentation attribute and the four lightings move them. */
function iqGap(p,li,w){
 w=w||200; var a=p.intake.answers, c=seatCol(SI[li].b), x0=8, x1=w-8;
 function X(v){return (x0+(x1-x0)*v/10).toFixed(1);}
 var v=[0,1,2].map(function(t){return a[li*3+t];}), have=v.filter(function(x){return x!=null;});
 var s='<svg class="iqa-gap" viewBox="0 0 '+w+' 26" aria-hidden="true">'
  +'<line x1="'+x0+'" x2="'+x1+'" y1="13" y2="13" style="stroke:var(--dim);stroke-opacity:.35"/>';
 [0,5,10].forEach(function(t){
  s+='<line x1="'+X(t)+'" x2="'+X(t)+'" y1="9" y2="17" style="stroke:var(--dim);stroke-opacity:.4"/>';});
 if(have.length>1)s+='<line x1="'+X(Math.min.apply(null,have))+'" x2="'+X(Math.max.apply(null,have))
  +'" y1="13" y2="13" stroke="'+c+'" stroke-width="3" stroke-opacity=".55" stroke-linecap="round"/>';
 v.forEach(function(x,t){if(x==null)return;
  s+='<circle cx="'+X(x)+'" cy="13" r="'+(t===2?3.2:4.6)+'" stroke="'+c+'" stroke-width="1.6" '
   +(t===2?'fill="'+c+'"':'style="fill:var(--sunk)"')+'/>';});
 return s+'</svg>';}
/* THE THREE FRAMINGS OF ONE LAW, the same in all three views.
   A REFERENCE PROFILE CARRIES DECIMALS. Marcus answers 4.7, which no point on
   an eleven point scale equals, and the accordion compared with === so every
   law he had scored opened onto a scale with nothing selected. The prototype
   found it; the port fixes it. The nearest point is marked and the exact
   figure is printed beside the framing's name, so the scale never claims an
   answer more round than the one on file. */
function iqFramings(p,Q,li){
 var c=seatCol(SI[li].b), h='';
 [0,1,2].forEach(function(t){
  var idx=li*3+t, qq=Q[idx], v=p.intake.answers[idx];
  var near=(v==null)?null:Math.round(v);
  h+='<div class="iq-qc iqa-fr" style="--c:'+c+'"><div>'
   +'<div class="iqa-flr"><em class="iqa-fl">'+esc(IQ_SIDE[qq.side]||qq.side)+'</em>'
   +(v!=null&&v!==near?'<span class="iqa-ex">'+esc(v)+'</span>':'')+'</div>'
   +'<div class="iqa-qt">'+esc(qq.q)+'</div></div>'
   /* the scale is the accordion's own, one row of eleven even cells, which is
      ruled, and the prototype's two row wrap is not taken */
   +'<div class="iq-sl">';
  for(var n=0;n<=10;n++)
   h+='<button type="button" class="iq-n'+(near===n?' on':'')+'" data-a="'+idx+'" data-v="'+n+'" '
    +'aria-pressed="'+(near===n)+'">'+n+'</button>';
  h+='</div></div>';});
 return h;}
/* THE HEADER. CQ in a ring, the way Summary carries it, and one line: the
   tier word once all twenty one are in, and until then what is left. Never a
   count against a total, which the accordion's own note ruled out: "1 of 3"
   is a fraction and a fraction is a score. The prototype read "3 of 21 laws
   measured" there, so that one line was not taken across as drawn. */
function iqArtHead(r,scored,answered){
 var cq=scored?r.CQ:null;
 var glyph='<text x="12" y="16" text-anchor="middle" font-size="9" font-weight="600" '
  +'fill="currentColor" stroke="none">CQ</text>';
 return '<div class="iqa-cq"><span class="iqa-cqp">'
  +crBadge('Throat',cq||0,{size:'md',bare:true,glyph:glyph})
  +'<b>'+(cq==null?'–':Math.round(cq))+'</b></span>'
  +'<span class="iqa-cqw"><span class="iqa-cqt">'
  +(r.tier?esc(r.tier):(63-answered)+' questions left')+'</span>'
  +'<span class="iqa-cqs">'+scored+' law'+(scored===1?'':'s')+' measured</span></span></div>';}

/* ---------- A. The reading list ---------- */
function iqViewList(p,Q,sc){
 var h='<div class="iqa-list">';
 IQ_SEATS.forEach(function(b){
  var L=iqLawsOf(b), c=seatCol(b); if(!L.length)return;
  var ms=L.map(function(x){return sc[x.l.nm];}).filter(Boolean);
  var mean=ms.length?ms.reduce(function(a,s){return a+s.score;},0)/ms.length:0;
  h+='<section class="iqa-seat" style="--c:'+c+'"><div class="iqa-sh">'
   +crBadge(b,mean*10,{size:'md',raw:ms.length?mean.toFixed(1):null,bare:!ms.length})
   +'<div><div class="iqa-shn">'+esc(b)+'</div><div class="iqa-shl">'+esc(IQ_SEATLINE[b])+'</div></div></div>'
   +'<div class="iqa-laws">';
  L.forEach(function(x){
   var s=sc[x.l.nm], g=iqGot(p,x.li), on=(IQ_OPEN===x.li);
   h+='<button type="button" class="iqa-lawr" data-law="'+x.li+'" aria-expanded="'+on+'">'
    +iqLawBadge(x.l,s,g,'sm')
    +'<span><span class="iqa-lt">'+esc(x.l.nm)+'</span><span class="iqa-lv">'+esc(iqLine(s,g))+'</span></span>'
    +'<span class="iqa-gw">'+iqGap(p,x.li,200)+'</span></button>';
   if(on)h+='<div class="iq-law open iqa-open">'+iqFramings(p,Q,x.li)+'</div>';});
  h+='</div></section>';});
 return h+'</div>';}

/* the twenty one as a row of rings grouped by seat: the map and the progress
   at once. C's picker, and B's on a phone. */
function iqStrip(p,sc,ih,extra){
 return '<div class="iqa-strip'+(extra||'')+'" role="group" aria-label="The 21 laws">'
  +IQ_SEATS.map(function(b){
   return '<span class="iqa-grp">'+iqLawsOf(b).map(function(x){
    var s=sc[x.l.nm], g=iqGot(p,x.li);
    return '<button type="button" class="iqa-sb" data-law="'+x.li+'" aria-current="'+(ih===x.li)+'" '
     +'aria-label="'+esc(x.l.nm)+'" title="'+esc(x.l.nm)+'">'+iqLawBadge(x.l,s,g,'sm',true)+'</button>';}).join('')
   +'</span>';}).join('')+'</div>';}

/* ---------- B. The wheel ----------
   The prototype's geometry, unchanged: a 640 square, seats on the ring at 292
   in body order with the crown centred at the top, each law a ring at 214 and
   a tick running in toward the orb with a length set by its score. What moved
   is colour: every ink, edge and the orb itself read the lighting's tokens,
   because the prototype was drawn for the Dark lighting alone. And the figure
   is a group, not an img, because an img hides the twenty one controls
   inside it from a screen reader. */
function iqViewWheel(p,Q,sc,r,scored){
 var cq=scored?r.CQ:null, lit=(cq!=null), S=640, C=S/2, per=360/SI.length, gapd=4;
 var start=-iqLawsOf(IQ_SEATS[0]).length*per/2, ih=iqInHand(p);
 function f(n){return n.toFixed(1);}
 function pt(rr,deg){var a=(deg-90)*Math.PI/180; return [C+rr*Math.cos(a),C+rr*Math.sin(a)];}
 function arc(rr,d0,d1){var p0=pt(rr,d0),p1=pt(rr,d1);
  return 'M'+f(p0[0])+' '+f(p0[1])+'A'+rr+' '+rr+' 0 '+(d1-d0>180?1:0)+' 1 '+f(p1[0])+' '+f(p1[1]);}
 var s='<svg viewBox="-44 -8 '+(S+88)+' '+(S+16)+'" role="group" aria-label="All 21 laws in a circle, your CQ in the middle">'
  +'<defs><radialGradient id="iqa-orb" cx="42%" cy="36%" r="70%">'
  +'<stop offset="0" style="stop-color:color-mix(in srgb,var(--accent) 40%,#fff);stop-opacity:'+(lit?.95:.18)+'"/>'
  +'<stop offset=".45" style="stop-color:var(--accent);stop-opacity:'+(lit?.85:.12)+'"/>'
  +'<stop offset="1" style="stop-color:color-mix(in srgb,var(--accent) 45%,#000);stop-opacity:'+(lit?.9:.2)+'"/></radialGradient>'
  +'<radialGradient id="iqa-halo"><stop offset="0" style="stop-color:var(--accent);stop-opacity:'+(lit?.22:.05)+'"/>'
  +'<stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></radialGradient></defs>'
  +'<circle cx="'+C+'" cy="'+C+'" r="200" fill="url(#iqa-halo)"/>';
 [150,236].forEach(function(rr){
  s+='<circle cx="'+C+'" cy="'+C+'" r="'+rr+'" fill="none" stroke-width="10" style="stroke:var(--dim);stroke-opacity:.08"/>';});
 IQ_SEATS.forEach(function(b){
  var L=iqLawsOf(b), c=seatCol(b), d0=start+gapd/2, d1=start+L.length*per-gapd/2; start+=L.length*per;
  var ms=L.map(function(x){return sc[x.l.nm];}).filter(Boolean);
  var mean=ms.length?ms.reduce(function(a,q){return a+q.score;},0)/ms.length:0;
  s+='<path d="'+arc(292,d0,d1)+'" fill="none" stroke="'+c+'" stroke-opacity=".16" stroke-width="5" stroke-linecap="round"/>';
  if(mean>0)s+='<path d="'+arc(292,d0,d0+(d1-d0)*mean/10)+'" fill="none" stroke="'+c+'" stroke-opacity=".75" stroke-width="5" stroke-linecap="round"/>';
  var lp=pt(314,(d0+d1)/2);
  s+='<text x="'+f(lp[0])+'" y="'+f(lp[1]+4)+'" fill="'+c+'" font-size="13" text-anchor="middle">'+esc(b)+'</text>';
  L.forEach(function(x,k){
   var deg=d0+(d1-d0)*(k+.5)/L.length, q=sc[x.l.nm], g=iqGot(p,x.li), on=(ih===x.li);
   var v=q?q.score:0, t0=pt(92,deg), t1=pt(92+(q?v*4.6:0)+4,deg);
   s+='<line x1="'+f(t0[0])+'" y1="'+f(t0[1])+'" x2="'+f(t1[0])+'" y2="'+f(t1[1])+'" stroke="'+c+'" stroke-width="3" stroke-linecap="round" stroke-opacity="'+(q?.85:.25)+'"/>';
   var pp=pt(214,deg), px=f(pp[0]), py=f(pp[1]), rr=20, Cc=2*Math.PI*rr, frac=q?v/10:g/3;
   s+='<g class="iqa-lb" data-law="'+x.li+'" role="button" tabindex="0" aria-pressed="'+on+'" aria-label="'+esc(x.l.nm)+'">'
    +'<circle cx="'+px+'" cy="'+py+'" r="30" fill="#000" fill-opacity="0"/>'
    +'<circle class="iqa-lbf" cx="'+px+'" cy="'+py+'" r="28" fill="none" stroke-width="1.4" '
     +(on?'style="stroke:var(--accent)"':'stroke="none"')+'/>'
    +'<circle cx="'+px+'" cy="'+py+'" r="'+rr+'" fill="none" stroke="rgba(128,128,128,.22)" stroke-width="3"/>'
    +'<circle cx="'+px+'" cy="'+py+'" r="'+rr+'" fill="none" stroke="'+c+'" stroke-width="3" stroke-linecap="round" '
     +'stroke-dasharray="'+Cc.toFixed(1)+'" stroke-dashoffset="'+(Cc*(1-frac)).toFixed(1)+'" transform="rotate(-90 '+px+' '+py+')"/>'
    +'<g transform="translate('+f(pp[0]-9)+' '+f(pp[1]-9)+') scale(.75)" fill="none" stroke="'+c+'" stroke-width="2" '
     +'stroke-linecap="round" stroke-linejoin="round"><path d="'+x.l.ic+'"/></g>'
    +(q?'<text x="'+px+'" y="'+f(pp[1]+38)+'" font-size="12" text-anchor="middle" style="fill:var(--mid)">'+q.score.toFixed(1)+'</text>':'')
    +'</g>';});});
 s+='<circle cx="'+C+'" cy="'+C+'" r="66" fill="url(#iqa-orb)"/>'
  +'<text x="'+C+'" y="'+(C+12)+'" font-size="36" font-weight="600" text-anchor="middle" '
  +'style="fill:'+(lit?'var(--on-accent)':'var(--dim)')+'">'+(lit?Math.round(cq):'–')+'</text></svg>';
 var l=SI[ih], q=sc[l.nm], c=seatCol(l.b), g=iqGot(p,ih);
 var side='<div class="iqa-side" style="--c:'+c+'"><div class="iqa-sidehd">'+iqLawBadge(l,q,g,'md')
  +'<div><h3 class="iqa-h3">'+esc(l.nm)+'</h3><div class="iqa-sub"><b>'+esc(l.b)+'</b>, '+esc(IQ_SEATLINE[l.b])+'</div></div></div>'
  +'<div>'+iqGap(p,ih,356)+'<div class="iqa-sub">'+esc(iqLine(q,g))+'</div></div>'
  +'<div class="iq-law open iqa-inhand">'+iqFramings(p,Q,ih)+'</div></div>';
 return iqStrip(p,sc,ih,' iqa-bstrip')
  +'<div class="iqa-stage"><div class="iqa-wheel">'+s+'</div>'+side+'</div>';}

/* ---------- C. One law at a time ---------- */
function iqViewOne(p,Q,sc){
 var ih=iqInHand(p), l=SI[ih], q=sc[l.nm], c=seatCol(l.b), g=iqGot(p,ih);
 var rr=78, Cc=2*Math.PI*rr, frac=q?q.score/10:g/3;
 var ring='<svg class="iqa-ring" viewBox="0 0 200 200" aria-hidden="true">'
  +'<defs><radialGradient id="iqa-lit" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="'+c+'" stop-opacity=".18"/>'
  +'<stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient></defs>'
  +'<circle cx="100" cy="100" r="96" fill="url(#iqa-lit)"/>'
  +'<circle cx="100" cy="100" r="'+rr+'" fill="none" stroke="rgba(128,128,128,.2)" stroke-width="6"/>'
  +'<circle cx="100" cy="100" r="'+rr+'" fill="none" stroke="'+c+'" stroke-width="6" stroke-linecap="round" '
  +'stroke-dasharray="'+Cc.toFixed(1)+'" stroke-dashoffset="'+(Cc*(1-frac)).toFixed(1)+'" transform="rotate(-90 100 100)"/>'
  +'<g transform="translate(64 60) scale(3)" fill="none" stroke="'+c+'" stroke-width="1.3" stroke-linecap="round" '
  +'stroke-linejoin="round"><path d="'+l.ic+'"/></g>'
  +(q?'<text x="100" y="150" font-size="20" font-weight="600" text-anchor="middle" style="fill:var(--ink)">'
   +q.score.toFixed(1)+'</text>':'')+'</svg>';
 return iqStrip(p,sc,ih,'')
  +'<div class="iqa-focus" style="--c:'+c+'"><div class="iqa-hero">'+ring
  +'<div class="iqa-ln">'+esc(l.nm)+'</div>'
  +'<div class="iqa-sub"><b>'+esc(l.b)+'</b>, '+esc(IQ_SEATLINE[l.b])+'</div>'
  +'<div class="iqa-hgap">'+iqGap(p,ih,240)+'</div><div class="iqa-sub">'+esc(iqLine(q,g))+'</div></div>'
  +'<div class="iqa-qs"><div class="iq-law open iqa-inhand">'+iqFramings(p,Q,ih)+'</div>'
  +'<div class="iqa-nav"><button type="button" class="btn" data-step="-1">Previous law</button>'
  +'<button type="button" class="btn pri" data-step="1">Next law</button></div></div></div>';}

function renderIntake(){
 /* ITS OWN BODY, round HG. The tab is the Avatar now and the avatar is its
    hero, in #avbody above this. This renderer writes the whole of its host on
    every press, so it writes #iqbody and never #iq, which would take the
    avatar with it. */
 var host=document.getElementById('iqbody')||document.getElementById('iq'); if(!host) return;
 var p=iqEnsure(), Q=iqList(), sc=iqScore(p);
 var answered=Object.keys(p.intake.answers).filter(function(k){return p.intake.answers[k]!=null;}).length;
 var scored=Object.keys(sc).length;
 iqApply(p);
 var r=compute();
 /* no measured law means no result. a defaulted CQ reads as a finding and is not one. */
 var w=p.who||{}, bn=w.born||{};
 /* Why this is asked, said once, in the place it is asked. The intake was an
    unlabelled accordion in the left rail and nothing said what it was for. */
 /* sealed, so the form is not the first thing on the surface. */
 /* THE SECTION KEEPS THE TAB'S OLD NAME, because it is still what this half
    reads: the birth moment and the 63 questions. Energetics was the tab until
    the owner's Avatar ruling, and three buttons elsewhere still open it by that
    name, so the word lands on the thing it names. */
 /* THE PROSE THAT EXPLAINED THIS SECTION IS GONE. His own standing rule,
    violated twice in this one screen: no text that describes what something
    is or how to use it, ever, where an icon, a symbol or the layout itself
    already says it. "Your birth moment and the 63 questions" and the
    paragraph on how a birth moment is triangulated were exactly that, and
    stayed only because nobody swept this file after the rule was first
    given. Round HS, his own words: "why is that text never being written
    out ever again after I keep asking for it to never be written out." */
 var hd='<div class="iq-sec"><div class="pm-eye">Energetics</div></div>';
 if(w.sealed) var h=iqSealedCard(p);
 else var h='<div class="iq-who">'
  +'<div class="pm-eye">Who this is</div>'
  +'<div class="iq-fields">'
  +iqField('First name','first',w.first)
  +iqField('Middle','middle',w.middle)
  +iqField('Last','last',w.last)
  +'<div class="iq-f"><label for="wsex">Sex at birth</label><select id="wsex" data-who="sex">'
   +[['','not said'],['f','Female'],['m','Male'],['o','Other']].map(function(o){
     return '<option value="'+o[0]+'"'+(w.sex===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')
   +'</select></div>'
  +'<div class="iq-f"><label for="wdate">Date of birth</label>'
   +'<input type="date" id="wdate" data-born="date" value="'+esc(bn.date||'')+'"></div>'
  /* the checkbox belongs to the time field and sat in its own grid column,
     where it crowded the place of birth and read as a fourth input. */
  +'<div class="iq-f"><label for="wtime">Time of birth</label>'
   +'<input type="time" id="wtime" data-born="time" value="'+esc(bn.time||'')+'"'
   +(bn.timeUnknown?' disabled':'')+'>'
   +'<label class="iq-ck"><input type="checkbox" id="wtu"'
   +(bn.timeUnknown?' checked':'')+'> I do not know it</label></div>'
  +'<div class="iq-f"><label for="wplace">Place of birth</label>'
   +'<input type="text" id="wplace" data-born="place" placeholder="City, region" value="'+esc(bn.place||'')+'"></div>'
  /* THE TIME ZONE, RULED 26 SEPTEMBER. A place was matched against nine cities
     by exact string and anything else was read as Greenwich, so a person born
     in Auckland had their moon and gene key read thirteen hours out. The
     owner chose a named zone over a bigger city list or an asked offset: it is
     something a person already knows, and the rules for its year are computed
     rather than looked up by them. The list is the browser's own, offered as
     suggestions, so typing Auckland finds Pacific/Auckland. */
  +'<div class="iq-f"><label for="wzone">Time zone of birth</label>'
   +'<input type="text" id="wzone" data-born="zone" list="wzones" placeholder="Region/City" '
   +'autocomplete="off" spellcheck="false" value="'+esc(bn.zone||'')+'"></div>'
  +'</div>'
  +iqSeedBlock(p)
  /* SEAL IS A SAVE THAT ALSO PUTS THE FORM AWAY. It is only offered once there
     is something to state, and it says so rather than sitting there dead. */
  +'<div class="iq-seal-r">'
   +'<button class="btn pri" id="iqseal"'+(iqSealable(w)?'':' disabled')+'>Save and close</button>'
   /* HS sweep: "This rolls up to one line. Edit reopens it" described what
      the button does, which pressing it shows. The refusal beside a disabled
      button stays, because nothing else says why it will not press. */
   +(iqSealable(w)?'':'<span class="iq-seal-n">Enter a name or a date of birth first.</span>')
  +'</div>'
  +'</div>';
 /* THE BAR AND THE PROGRESS LINE ARE GONE, round IT. The header is the art
    pass's: CQ as the ring Summary draws it with, and one line under it. The
    rings on the laws are the progress now, each filling as its three land,
    so a bar above them said the same thing a second time. */
 h+='<div class="iqa">'
  +'<div class="iqa-hd">'+iqArtHead(r,scored,answered)
  +'<div class="iqa-tools">'+iqViewHtml()
  +'<div class="iq-act">'
   /* AND THE SWITCHER NAMES WHAT IS ACTUALLY LOADED. It listed PROFILES only,
      and a reference case is not in that list any more, so with one loaded no
      option matched and the control showed the person's own name above
      somebody else's sixty three answers. It carries the loaded example as an
      entry of its own, marked as what it is, and the handler refuses to switch
      to it, because there is nothing to switch to: it is already up. */
   +'<select id="iqprof" aria-label="Profile">'
   +(PROFILES.indexOf(p)<0
     ?'<option value="-1" selected>'+esc(p.name)+', a worked example</option>':'')
   +PROFILES.map(function(x,i){
      return '<option value="'+i+'"'+(x===CURP?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select>'
   +'<button class="btn" id="iqnew">New</button>'
   +'<button class="btn pri" id="iqsave">Save</button>'
   +'<button class="btn" id="iqexp">Export</button>'
  +'</div></div></div>';
 /* THE FRAME, AND THE DURATION. Neither was anywhere on this surface.

    Two findings, both from the panel and both measured. Without a stated
    duration and a visible remainder, 63 questions loses about half its
    finishers; with both, plus one line naming the three way design, completion
    runs 29 points higher. And the person who notices around question 40 that
    the same twenty one things are cycling feels handled, unless it was said at
    the top, in which case the same fact reads as rigour. It costs one
    sentence, so it is one sentence.

    Nothing here promises a result or flatters anybody. It says how long, what
    is being done, and why the repetition is the measurement. */
 h+=iqAccuracy();
 /* THE ACCORDION IS GONE, and what replaces it is the view the toggle names.
    It went because everything it said is said again by the art pass and said
    better: the seat group became a row between two hairlines, the law card a
    ring whose arc is the score, and the spread, which was a sentence, is now
    three marks on one line. The framings and the scale kept their markup, so
    a press lands in the same handler with the same arithmetic behind it. */
 /* THE LAW IN HAND IS PINNED ON ARRIVAL. Left unpinned it was worked out
    fresh on every draw as the first law still missing an answer, so the third
    press on a law finished it and the view jumped to the next one before the
    person had seen what they had just made. Measured by driving it: three
    answers on Unity landed the page on Awareness with Unity's reading unseen. */
 if(IQ_VIEW!=='list'&&IQ_OPEN==null)IQ_OPEN=iqInHand(p);
 h+=(IQ_VIEW==='wheel'?iqViewWheel(p,Q,sc,r,scored):IQ_VIEW==='one'?iqViewOne(p,Q,sc):iqViewList(p,Q,sc));
 h+='</div>';
 iqArtCss();
 host.innerHTML=hd+h;
 /* the avatar repaints only when something it reads has moved, so a press on
    a law never throws away a half typed pair above it */
 if(typeof avRefresh==='function')avRefresh();
 host.querySelectorAll('[data-law]').forEach(function(el){
  /* the list opens and closes a law in place, as the accordion did. The wheel
     and one at a time always have a law in hand, so a press there moves it
     and never empties the panel. getAttribute and not dataset, because on the
     wheel the control is an svg g. */
  var go=function(){var li=+el.getAttribute('data-law');
   IQ_OPEN=(IQ_VIEW==='list'&&IQ_OPEN===li)?null:li;
   IQ_FOCUS='[data-law="'+li+'"]'; renderIntake();};
  el.onclick=go;
  /* a g is not a button, so Enter and Space are wired by hand */
  if(el.tagName.toLowerCase()==='g')el.onkeydown=function(k){
   if(k.key==='Enter'||k.key===' '){k.preventDefault();go();}};});
 host.querySelectorAll('[data-iqv]').forEach(function(el){el.onclick=function(){
  IQ_VIEW=el.getAttribute('data-iqv'); IQ_FOCUS='[data-iqv="'+IQ_VIEW+'"]'; renderIntake();};});
 /* walks the body order the strip shows, crown to root, not the table order */
 host.querySelectorAll('[data-step]').forEach(function(el){el.onclick=function(){
  var o=iqBodyOrder(), i=o.indexOf(iqInHand(CURP)), d=+el.getAttribute('data-step');
  IQ_OPEN=o[(i+d+o.length)%o.length];
  IQ_FOCUS='[data-step="'+d+'"]'; renderIntake();};});
 /* THE PRESS KEEPS ITS PLACE. This renderer writes the whole host, so the
    control a person just pressed is a new element afterwards and focus fell
    to the page. On the wheel that made the keyboard useless: every Enter sent
    the next Tab back to the top. The same control is found again by what it
    is, never by where it sat. */
 if(IQ_FOCUS){
  /* the first visible match, because the wheel carries the phone strip ahead
     of it in the document, hidden on a desktop, and a hidden control takes no
     focus: the first cut sent it there and it fell to the page */
  var kf=[].slice.call(host.querySelectorAll(IQ_FOCUS)).filter(function(e){
   return e.getClientRects().length;})[0]; IQ_FOCUS=null;
  if(kf&&kf.focus)kf.focus({preventScroll:true});}
 host.querySelectorAll('[data-a]').forEach(function(el){el.onclick=function(){
  /* a changed answer is a new reading of that law, so the releases counted
     against the old one stop counting (engine/compute.js, lawAnswered). Even
     when the mean of the three lands on the same number: the person has just
     told us where the law is, and that wins over the model's estimate. */
  if(CURP.intake.answers[+el.dataset.a]!==+el.dataset.v)
   lawAnswered(CURP,SI[Math.floor(+el.dataset.a/3)].nm);
  CURP.intake.answers[+el.dataset.a]=+el.dataset.v;
  if(!CURP.intake.startedAt)CURP.intake.startedAt=new Date().toISOString();
  iqApply(CURP); pSave(); syncLw(); renderIntake(); render();};});
 /* identity writes on change, not on every keystroke, and reports through
    the status region like every other write that can fail. */
 host.querySelectorAll('[data-who]').forEach(function(el){el.onchange=function(){
  /* THE NAME IS READ, so changing it has to repaint what reads it. numerology
     runs off first, middle and last through numFullName, and it prints on
     Summary. Nothing repainted after a name change, so a cleared surname left
     the master number standing on a name that is no longer there. */
  CURP.who[el.dataset.who]=el.value; pSave(); statusSaved();
  renderSpirit&&renderSpirit(); render();};});
 iqZones();
 host.querySelectorAll('[data-born]').forEach(function(el){el.onchange=function(){
  var k=el.dataset.born, v=(k==='zone')?el.value.trim():el.value;
  CURP.who.born[k]=v; pSave();
  /* A zone this browser cannot read is kept, because it is what the person
     typed, and said out loud, because otherwise Saved is the only word they
     see while the rail beside it goes on reading unresolved. Only after a
     save that worked: a failed save already has its own sentence. */
  if(statusSaved()&&k==='zone'&&v&&!zoneOffsets(v,2000,1,1,12))
   status('Saved. '+v+' is not a time zone this browser can read.');
  renderSpirit&&renderSpirit();};});
 /* SEAL AND EDIT. Both write, so both report through the status region, and
    neither claims anything it did not get. */
 var sl=document.getElementById('iqseal');
 if(sl)sl.onclick=function(){
  if(!iqSealable(CURP.who)){status('Enter a name or a date of birth first.');return;}
  CURP.who.sealed=new Date().toISOString();
  pSave();
  if(statusSaved())renderIntake();
  else{CURP.who.sealed='';}};
 var ed=document.getElementById('iqedit');
 if(ed)ed.onclick=function(){CURP.who.sealed=''; pSave(); statusSaved(); renderIntake();};
 var ty=document.getElementById('wtype');
 if(ty)ty.onchange=function(){
  if(ty.value)seedApply(CURP,ty.value); else seedClear(CURP);
  loadProfile(CURP); pSave(); statusSaved();
  syncCh(); syncSoul(); renderIntake(); render();};
 var tu=document.getElementById('wtu');
 if(tu)tu.onchange=function(){CURP.who.born.timeUnknown=tu.checked;
  if(tu.checked)CURP.who.born.time=''; pSave(); statusSaved(); renderIntake();};
 var ps=document.getElementById('iqprof');
 if(ps)ps.onchange=function(){
  var pi=+ps.value; if(pi<0||!PROFILES[pi]){renderIntake();return;}
  CURP=PROFILES[pi];loadProfile(CURP);IQ_OPEN=null;
  syncCh();syncLw();syncSoul();renderIntake();render();};
 var nb=document.getElementById('iqnew');
 if(nb)nb.onclick=function(){var n=prompt('Profile name','Profile '+(PROFILES.length+1));
  if(n){pNew(n);loadProfile(CURP);IQ_OPEN=null;syncCh();syncLw();syncSoul();renderIntake();render();}};
 var sb=document.getElementById('iqsave');
 /* The button used to read "Saved" whether or not anything was written. It
    reports what happened now, and the status region carries the detail. */
 if(sb)sb.onclick=function(){pSave();pSnap();
  var ok=statusSaved();
  sb.textContent=ok?'Saved':'Not saved';
  setTimeout(function(){sb.textContent='Save';},ok?900:2600);};
 var eb=document.getElementById('iqexp');
 if(eb)eb.onclick=function(){var t=pExport();
  try{navigator.clipboard.writeText(t);eb.textContent='Copied';status('Profile copied to the clipboard.');}
  catch(e){eb.textContent=t.length+' bytes';}
  setTimeout(function(){eb.textContent='Export';},1200);};}

