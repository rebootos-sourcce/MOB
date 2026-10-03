
/* ============================================================
   THE DIAGNOSTIC. 21 blocks of 3. Resumable, any order, nothing
   required. Every finished law is a finding on its own.
   ============================================================ */
var IQ_OPEN=null;
/* ROUND OP, THE INTAKE REDESIGN. His words: "pull some elements, UI, UX ...
   more of the layout above the fold. Use iconography. And maybe even nesting
   techniques. So it doesn't look so overwhelming. And then the visual design
   is very bland. It looks like the design was stubbed in."

   Five pieces of state, each only a view of what is open and none of it data:
     IQ_SEAT  the seat whose laws are showing under the map. null means the seat
              of the next law to answer, and with nothing left to answer the
              first seat. '' means the person closed them all.
     IQ_WHO   the birth moment form, nested behind its one row summary.
     IQ_MORE  the profile actions, nested behind one icon.
     IQ_ANIM  what the last press opened, so only that thing arrives. The page
              rewrites its whole host on every press, so an arrival class left
              on the markup would replay on every answer.
     IQ_PULSE the law the last answer landed on, so its ring can show the
              reading arriving. IQ_ANIM and IQ_PULSE are read once and cleared. */
var IQ_SEAT=null, IQ_WHO=false, IQ_MORE=false, IQ_ANIM=null, IQ_PULSE=null, IQ_DOORS=false;
/* THE ICONS THIS PAGE ADDS, drawn on the product's own 24 grid and stroked, not
   filled. The law and seat glyphs come from the product's tables, SI[].ic and
   SEATGLYPH, and nothing here redraws them. */
var IQ_IC={
 person:'M12 4.5a3.6 3.6 0 1 1 0 7.2a3.6 3.6 0 0 1 0-7.2M5 20c0-3.7 3-6 7-6s7 2.3 7 6',
 date:'M5 6.5h14v13H5zM5 10.5h14M9 4v4M15 4v4',
 time:'M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16M12 8v4.5l3 1.5',
 place:'M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10zM12 8.8a2.2 2.2 0 1 1 0 4.4a2.2 2.2 0 0 1 0-4.4',
 zone:'M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16M4 12h16M12 4c2.3 2.2 3.4 4.9 3.4 8s-1.1 5.8-3.4 8c-2.3-2.2-3.4-4.9-3.4-8s1.1-5.8 3.4-8',
 type:'M5 5h5.5v5.5H5zM13.5 5H19v5.5h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z',
 more:'M5.7 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0M10.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0M15.9 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0',
 chev:'M7 10l5 5 5-5',
 cost:'M7.5 9h9l1.5 10H6zM9.5 9a2.5 2.5 0 1 1 5 0',
 unseen:'M4 4l16 16M9.9 5.3A9.6 9.6 0 0 1 12 5c5.5 0 9 7 9 7a15.6 15.6 0 0 1-2.9 3.7M6.3 7.6C4.3 9.3 3 12 3 12s3.5 7 9 7c1.5 0 2.8-.4 4-1M10 10.3a2.5 2.5 0 0 0 3.7 3.4',
 day:'M12 8.2a3.8 3.8 0 1 1 0 7.6a3.8 3.8 0 0 1 0-7.6M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M18 6l-1.4 1.4M7.4 16.6L6 18'};
/* the three framings keep their icon beside their name, in every view */
var IQ_SIDEIC={left:'cost',right:'unseen',neutral:'day'};
function iqSvg(path,cls){
 return '<svg class="'+(cls||'iqa-ic')+'" viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg>';}
/* an arc on a circle, in degrees, 0 at the top and clockwise */
function iqArc(cx,cy,r,d0,d1){
 var a=(d0-90)*Math.PI/180, b=(d1-90)*Math.PI/180;
 return 'M'+(cx+r*Math.cos(a)).toFixed(2)+' '+(cy+r*Math.sin(a)).toFixed(2)
  +'A'+r+' '+r+' 0 '+(d1-d0>180?1:0)+' 1 '+(cx+r*Math.cos(b)).toFixed(2)+' '+(cy+r*Math.sin(b)).toFixed(2);}
/* THE RING GRAMMAR, ONE RULE FOR EVERYTHING ON THIS PAGE. Segments are what
   has been answered and an unbroken arc is what it reads. A law is three
   segments, one per framing, and each lights as its answer lands. Once all
   three are in the segments close into one arc whose length is the score. A
   seat is a segment per law. The page's own ring is a segment per law, all
   twenty one, in the seat colours. So the same figure means the same thing at
   every size, and nothing on it is a count against a total.
     vals  one number per segment: 1 held, .5 started, 0 untouched
     col   the colour of segment i
   Butt ends, because a round end eats the gap that makes it a segment. */
function iqSegs(vals,col,cx,cy,r,w,gap,tag){
 var n=vals.length, span=360/n, s='';
 vals.forEach(function(v,i){
  var d0=i*span+gap/2, d1=(i+1)*span-gap/2, d=iqArc(cx,cy,r,d0,d1);
  s+='<path d="'+d+'" fill="none" stroke-width="'+w+'" style="stroke:var(--dim);stroke-opacity:.26"/>';
  if(v>0)s+='<path class="iqa-sg" data-i="'+(tag==null?i:tag+i)+'" d="'+d+'" fill="none" stroke="'+col(i)
   +'" stroke-width="'+w+'" stroke-opacity="'+(v>=1?1:.5)+'"/>';});
 return s;}
/* the unbroken arc, for a reading. A full turn is a circle, because an arc
   from a point to itself draws nothing. */
function iqScoreArc(col,frac,cx,cy,r,w){
 var f=Math.max(0,Math.min(1,frac)), s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke-width="'+w
  +'" style="stroke:var(--dim);stroke-opacity:.26"/>';
 if(f<=0)return s;
 return s+(f>=.999
  ?'<circle class="iqa-sg" data-i="s" cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="'+w+'"/>'
  :'<path class="iqa-sg" data-i="s" d="'+iqArc(cx,cy,r,0,360*f)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/>');}
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
 /* ROUND OP, THE INTAKE REDESIGN: the same words, drawn as the thing they
    describe. The scale is a ruler with its three calibration points on it, so
    the line is read as a position on a scale and not as a sentence, and the
    duration sits beside a clock. The words are unchanged and so is the gate
    that reads them: never, about half the time, every time, about fifteen
    minutes, stop whenever and come back. */
 return '<div class="iqa-sc iqa-card">'
  +'<div class="iqa-sct" aria-hidden="true"><i class="iqa-sctk"></i>'
  +'<i class="iqa-scd iqa-sc0"></i><i class="iqa-scd iqa-sc5"></i><i class="iqa-scd iqa-sc10"></i></div>'
  +'<p class="iqa-scl"><span class="iqa-sl0"><b>0</b> never</span>'
  +'<span class="iqa-sl5"><b>5</b> about half the time</span>'
  +'<span class="iqa-sl10"><b>10</b> every time</span></p>'
  +'<p class="iqa-scn">'+iqSvg(IQ_IC.time)+'<span>about fifteen minutes. Stop whenever and come back.</span></p>'
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
/* THE BIRTH MOMENT, NESTED. It was nine fields standing open above the first
   question, and on a blank profile that form was the first screen at 1600 and
   at 390, which is the opposite of what a stranger came for. It is one row now:
   a ring for the person, five rings for the five things the birth chart reads,
   lit when held and dashed when missing, and a chevron that opens the form in
   place. What is missing is still said out loud, once a profile has been
   saved, because a closed row that hides a blank date reads as complete and
   the chart is then quietly running on nothing.

   The form is always in the document and only hidden while it is closed, so
   the fields keep their ids and a door that focuses #wdate finds it. The rule
   that a profile with nothing in it never rolls up is kept in its own way: a
   stranger sees the empty rings, which say what is missing, and not a blank
   card to open. */
function iqWhoGaps(p){
 var w=p.who||{}, bn=w.born||{}, gaps=[];
 if(!iqNamed(w)) gaps.push('no name');
 if(!bn.date) gaps.push('no date of birth');
 if(!bn.place) gaps.push('no place of birth');
 if(bn.date&&!bn.time&&!bn.timeUnknown) gaps.push('no time of birth');
 /* only when it changes the reading: a place the table locates carries its
    own offset, and an untimed birth has no instant for an offset to move */
 if(bn.time&&!bn.timeUnknown&&!bn.zone&&!PLACE[bn.place]) gaps.push('no time zone of birth');
 return gaps;}
function iqWhoHtml(p){
 var w=p.who||{}, bn=w.born||{}, nm=iqNamed(w), open=IQ_WHO, sd=p.seed;
 var held=[
  ['date','Date of birth',bn.date,!!bn.date],
  ['time','Time of birth',bn.timeUnknown?'not known':bn.time,!!(bn.time||bn.timeUnknown)],
  ['place','Place of birth',bn.place,!!bn.place],
  ['zone','Time zone of birth',bn.zone,!!(bn.zone||(bn.place&&PLACE[bn.place]))],
  ['type','Myers-Briggs',sd&&sd.type,!!sd]];
 var chips=held.map(function(x){
  return '<span class="iqa-wc" data-on="'+(x[3]?1:0)+'" title="'+esc(x[1]+': '+(x[2]||'missing'))+'">'+iqSvg(IQ_IC[x[0]])+'</span>';}).join('');
 var say=held.map(function(x){return x[1].toLowerCase()+(x[3]?' held':' missing');}).join(', ');
 var gaps=w.sealed?iqWhoGaps(p):[];
 return '<section class="iqa-who iqa-card" data-open="'+(open?1:0)+'">'
  +'<button type="button" class="iqa-whob" id="iqwho" aria-expanded="'+open+'" aria-controls="iqwhop">'
  +'<span class="iqa-wi" data-on="'+(nm?1:0)+'">'+iqSvg(IQ_IC.person)+'</span>'
  +'<span class="iqa-wt"><span class="iqa-eye">Who this is</span>'
  +'<span class="iqa-wn" data-empty="'+(nm?0:1)+'">'+esc(nm||'Unnamed')+'</span></span>'
  +'<span class="iqa-wcs" role="img" aria-label="'+esc(say)+'">'+chips+'</span>'
  +'<span class="iqa-chev">'+iqSvg(IQ_IC.chev)+'</span></button>'
  +(gaps.length&&!open?'<p class="iqa-gapn">'+esc(gaps.join(', '))+'</p>':'')
  +'<div class="iqa-whop" id="iqwhop"'+(open?'':' hidden')+'>'+iqWhoForm(p)+'</div></section>';}
function iqWhoForm(p){
 var w=p.who||{}, bn=w.born||{};
 return '<div class="iqa-fg"><span class="iqa-fgi">'+iqSvg(IQ_IC.person)+'</span><div class="iq-fields">'
  +iqField('First name','first',w.first)
  +iqField('Middle','middle',w.middle)
  +iqField('Last','last',w.last)
  +'<div class="iq-f"><label for="wsex">Sex at birth</label><select id="wsex" data-who="sex">'
   +[['','not said'],['f','Female'],['m','Male'],['o','Other']].map(function(o){
     return '<option value="'+o[0]+'"'+(w.sex===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')
   +'</select></div>'
  +'</div></div>'
  +'<div class="iqa-fg"><span class="iqa-fgi">'+iqSvg(IQ_IC.date)+'</span><div class="iq-fields">'
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
  +'</div></div>'
  +'<div class="iqa-fg"><span class="iqa-fgi">'+iqSvg(IQ_IC.type)+'</span>'+iqSeedBlock(p)+'</div>'
  /* SEAL IS A SAVE THAT ALSO PUTS THE FORM AWAY. It is only offered once there
     is something to state, and it says so rather than sitting there dead. */
  +'<div class="iq-seal-r">'
   +'<button class="btn pri" id="iqseal"'+(iqSealable(w)?'':' disabled')+'>Save and close</button>'
   +(iqSealable(w)?'':'<span class="iq-seal-n">Enter a name or a date of birth first.</span>')
  +'</div>';}
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
/* THE RULES TRAVEL WITH THE RENDERER. The page's stylesheet is in
   shell/head.html and other seats have that file open, so this page carries
   its own sheet, added once, the first time the section draws. Every selector
   is prefixed iqa so nothing here can reach another surface.

   Three things about it are load bearing.

   The breakpoints are container queries on .iqa, not media queries on the
   window. The same renderer draws into the Intake page's centre column, into
   the Avatar's right menu and into a phone, and none of those widths is the
   window's.

   Every rule inside a container query names two classes. The design gate
   walks into a container rule, where it does not walk into a media rule, and
   reads a single class that sets geometry twice as a collision.

   Motion is opacity and transform and nothing else. A ring that filled by
   animating its dash offset would repaint the page on every frame. The
   segments fade in as each answer lands and the ring pops once when a law
   closes, and both are held still by reduced motion, by the quiet and rm
   switches the rest of the product answers to. */
function iqArtCss(){
 if(document.getElementById('iqa-css'))return;
 var st=document.createElement('style'); st.id='iqa-css';
 st.textContent=[
  '.iqa{container-type:inline-size;min-width:0;display:grid;gap:var(--g3);align-content:start}',
  /* ---- the surface. one raised plane, lit from the top, and nothing outlined
     where the lighting says nothing is ---- */
  '.iqa-card{background:var(--panel-2);border:1px solid var(--edge);border-radius:var(--r);',
  ' box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 12px 26px -16px rgba(0,0,0,.6)}',
  'body.snow .iqa-card,body.glasswhite .iqa-card{box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 10px 22px -16px rgba(20,22,28,.35)}',
  'body.punch .iqa-card,body.lumen .iqa-card{border-color:transparent;box-shadow:none}',
  '.iqa-eye{font-size:12px;font-weight:600;letter-spacing:.02em;color:var(--dim)}',
  '.iqa-ic{flex:0 0 auto;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
  '.iqa-chev{display:grid;place-items:center;color:var(--dim);transition:transform var(--t-element) var(--ease-out)}',
  /* ---- the header. where I am, how far, and the three views ---- */
  '.iqa-hero{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px 18px;padding:16px 20px;',
  ' background:radial-gradient(80% 170% at 0% 0%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 62%),var(--panel-2)}',
  '.iqa-hr{position:relative;display:grid;place-items:center}',
  '.iqa-hr svg{display:block;width:88px;height:88px}',
  '.iqa-hn{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;line-height:1}',
  '.iqa-hn b{font-family:var(--num);font-size:28px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--ink)}',
  '.iqa-hn i{font-style:normal;font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--dim);margin-top:3px}',
  '.iqa-ht{display:flex;flex-direction:column;gap:3px;min-width:0}',
  '.iqa-hh{font-size:26px;line-height:1.15;font-weight:600;letter-spacing:-.01em;color:var(--accent)}',
  '.iqa-hs{font-size:14px;color:var(--dim)}',
  '.iqa-tools{display:flex;align-items:center;gap:var(--g2)}',
  '.iqa-views{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--sunk);border:1px solid var(--edge)}',
  '#iqbody .iqa-views .st-ico{border-color:transparent}',
  '#iqbody .iqa-views .st-ico[aria-pressed="true"]{background:var(--panel-2);border-color:var(--accent);color:var(--ink)}',
  '.iqa-mb{display:grid;place-items:center;width:var(--tap);height:var(--tap);padding:0;border-radius:999px;',
  ' border:1px solid var(--edge-2);background:transparent;color:var(--mid);cursor:pointer;',
  ' transition:border-color var(--t-micro) var(--ease-out),color var(--t-micro) var(--ease-out)}',
  '.iqa-mb:hover{color:var(--ink)}',
  '.iqa-mb[aria-expanded="true"]{border-color:var(--accent);color:var(--ink)}',
  '.iqa-more{display:flex;flex-wrap:wrap;align-items:center;gap:var(--g2);padding:12px 16px}',
  '.iqa-more[hidden],.iqa-whop[hidden],.iqa-pn[hidden]{display:none}',
  /* ---- the identity row, and the ruler beside it ---- */
  '.iqa-mid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:var(--g3);align-items:stretch}',
  '.iqa-who{display:flex;flex-direction:column}',
  '.iqa-who[data-open="1"]{grid-column:1/-1}',
  '.iqa-mid[data-who="1"] .iqa-sc{grid-column:1/-1}',
  '.iqa-whob{flex:1 1 auto;display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;grid-template-areas:"i t c v";',
  ' align-items:center;gap:12px;width:100%;min-height:72px;padding:10px 16px;border:0;border-radius:var(--r);',
  ' background:none;color:var(--ink);font-family:var(--sans);text-align:left;cursor:pointer}',
  '.iqa-whob:hover{background:color-mix(in srgb,var(--ink) 4%,transparent)}',
  '.iqa-wi{grid-area:i;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;',
  ' border:1.5px dashed var(--edge-2);color:var(--dim)}',
  '.iqa-wt{grid-area:t;display:flex;flex-direction:column;gap:2px;min-width:0}',
  '.iqa-wn{font-size:17px;font-weight:500;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.iqa-wn[data-empty="1"]{color:var(--dim);font-weight:400}',
  '.iqa-wcs{grid-area:c;display:inline-flex;gap:6px}',
  '.iqa-wc{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;',
  ' border:1.5px dashed var(--edge-2);color:var(--dim)}',
  '.iqa-wc .iqa-ic{width:16px;height:16px}',
  '.iqa-wi[data-on="1"],.iqa-wc[data-on="1"]{border-style:solid;border-color:color-mix(in srgb,var(--accent) 62%,transparent);color:var(--accent)}',
  '.iqa-who .iqa-chev{grid-area:v}',
  '.iqa-who[data-open="1"] .iqa-chev{transform:rotate(180deg)}',
  '.iqa-gapn{margin:-4px 16px 12px 72px;font-size:13px;color:var(--sacral)}',
  '.iqa-whop{display:grid;gap:14px;padding:14px 16px 16px;border-top:1px solid var(--edge)}',
  '.iqa-fg{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:start}',
  '.iqa-fgi{display:grid;place-items:center;width:32px;height:44px;color:var(--dim)}',
  '.iqa-fg .iq-seed{margin:0;padding:0;border:0}',
  '.iqa-sc{display:grid;gap:10px;align-content:center;padding:16px 18px}',
  '.iqa-sct{position:relative;height:12px}',
  '.iqa-sctk{position:absolute;left:0;right:0;top:4px;height:4px;border-radius:2px;',
  ' background:linear-gradient(90deg,var(--sunk),color-mix(in srgb,var(--accent) 72%,var(--sunk)));box-shadow:inset 0 0 0 1px var(--edge)}',
  '.iqa-scd{position:absolute;top:0;width:12px;height:12px;border-radius:50%;background:var(--panel-2);box-shadow:inset 0 0 0 2px var(--accent)}',
  '.iqa-sc0{left:0}',
  '.iqa-sc5{left:calc(50% - 6px)}',
  '.iqa-sc10{right:0}',
  '.iqa-scl{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;margin:0;font-size:14px;color:var(--mid)}',
  '.iqa-scl b{font-family:var(--num);font-weight:600;color:var(--accent);margin-right:2px}',
  '.iqa-sl0{text-align:left}',
  '.iqa-sl5{text-align:center}',
  '.iqa-sl10{text-align:right}',
  '.iqa-scn{display:flex;align-items:center;gap:8px;margin:0;font-size:13.5px;color:var(--dim)}',
  /* ---- the ring ---- */
  '.iqa-rg{position:relative;display:inline-grid;place-items:center;flex:0 0 auto}',
  '.iqa-rg svg{display:block}',
  /* ---- the map: seven seats, crown to root. a tile is a seat and a press ---- */
  '.iqa-list{display:grid;gap:var(--g2)}',
  '.iqa-map{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:var(--g2)}',
  '.iqa-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0;',
  ' min-height:var(--tap);padding:14px 4px 12px;border-radius:var(--r-s);border:1px solid var(--edge);',
  ' background:var(--panel-2);color:var(--ink);font-family:var(--sans);cursor:pointer;',
  ' transition:border-color var(--t-micro) var(--ease-out),background var(--t-micro) var(--ease-out),transform var(--t-element) var(--ease-out)}',
  '.iqa-tile:hover{transform:translateY(-2px)}',
  '.iqa-tile .iqa-rg svg{width:56px;height:56px}',
  '.iqa-tn{font-size:15px;font-weight:500;color:var(--mid);white-space:nowrap}',
  '.iqa-tm{display:flex;gap:4px;align-items:center;min-height:10px}',
  '.iqa-pip{display:block;width:8px;height:8px;border-radius:50%;box-sizing:border-box;',
  ' border:1.4px solid color-mix(in srgb,var(--c) 55%,var(--dim))}',
  '.iqa-pip[data-st="1"]{background:color-mix(in srgb,var(--c) 50%,transparent)}',
  '.iqa-pip[data-st="2"]{background:var(--c);border-color:var(--c)}',
  '.iqa-ts{font-family:var(--num);font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;color:color-mix(in srgb,var(--c) 62%,var(--ink))}',
  '.iqa-nd{position:absolute;top:8px;right:8px;width:9px;height:9px;border-radius:50%;background:var(--accent);',
  ' box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 24%,transparent)}',
  '.iqa-tile[data-st="1"]{border-color:color-mix(in srgb,var(--c) 38%,var(--edge))}',
  '.iqa-tile[data-st="2"]{background:color-mix(in srgb,var(--c) 13%,var(--panel-2));border-color:color-mix(in srgb,var(--c) 48%,var(--edge))}',
  '.iqa-tile[data-st="1"] .iqa-tn,.iqa-tile[data-st="2"] .iqa-tn{color:var(--ink)}',
  '.iqa-tile[aria-expanded="true"]{background:color-mix(in srgb,var(--c) 20%,var(--panel-2));box-shadow:inset 0 0 0 1.5px var(--c)}',
  'body.punch .iqa-tile{border-color:transparent}',
  'body.punch .iqa-tile[aria-expanded="true"]{box-shadow:none;background:color-mix(in srgb,var(--c) 30%,var(--panel-2))}',
  /* ---- the open seat: its laws, nested under the map ---- */
  '.iqa-pn{padding:8px;border-radius:var(--r);border:1px solid color-mix(in srgb,var(--c) 32%,var(--edge));',
  ' background:linear-gradient(180deg,color-mix(in srgb,var(--c) 9%,var(--panel-2)),var(--panel-2) 180px)}',
  'body.punch .iqa-pn{border-color:transparent}',
  '.iqa-ph{display:flex;align-items:baseline;gap:10px;padding:8px 10px 10px}',
  '.iqa-shn{font-size:19px;font-weight:600;color:color-mix(in srgb,var(--c) 62%,var(--ink))}',
  '.iqa-shl{font-size:14px;color:var(--dim)}',
  '.iqa-laws{display:flex;flex-direction:column;gap:2px;min-width:0}',
  '.iqa-lawr{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,220px) 44px 20px;gap:14px;align-items:center;',
  ' width:100%;min-height:64px;padding:8px 12px;border-radius:var(--r-s);border:1px solid transparent;background:none;',
  ' color:var(--ink);font-family:var(--sans);text-align:left;cursor:pointer;',
  ' transition:background var(--t-micro) var(--ease-out),border-color var(--t-micro) var(--ease-out)}',
  '.iqa-lawr:hover{background:color-mix(in srgb,var(--ink) 5%,transparent)}',
  '.iqa-lawr[data-st="2"]{background:color-mix(in srgb,var(--c) 8%,transparent)}',
  '.iqa-lawr[data-next="1"]{border-color:color-mix(in srgb,var(--accent) 52%,transparent)}',
  '.iqa-lawr[aria-expanded="true"]{background:color-mix(in srgb,var(--c) 14%,transparent);border-color:color-mix(in srgb,var(--c) 44%,transparent)}',
  '.iqa-lawr[aria-expanded="true"] .iqa-chev{transform:rotate(180deg)}',
  'body.punch .iqa-lawr[data-next="1"]{border-color:transparent;background:color-mix(in srgb,var(--accent) 14%,transparent)}',
  'body.punch .iqa-lawr[aria-expanded="true"]{border-color:transparent;background:var(--sunk)}',
  '.iqa-lx{display:flex;flex-direction:column;gap:2px;min-width:0}',
  '.iqa-lt{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:500}',
  '.iqa-lv{font-size:13.5px;color:var(--dim)}',
  '.iqa-lawr[data-st="0"] .iqa-lt{color:var(--mid)}',
  '.iqa-nx{font-size:12px;font-weight:600;color:var(--accent);padding:2px 9px;border-radius:999px;',
  ' background:color-mix(in srgb,var(--accent) 16%,transparent)}',
  '.iqa-gw{min-width:0}',
  '.iqa-sv{font-family:var(--num);font-size:18px;font-weight:600;font-variant-numeric:tabular-nums;color:color-mix(in srgb,var(--c) 62%,var(--ink));text-align:right}',
  '.iqa-open{display:grid;gap:10px;padding:8px 6px 14px 62px}',
  /* ---- the three blocks stacked under the laws. the seat panel's own surface,
     open, with the framing card's own scale ---- */
  '.iqx{display:grid;gap:4px}',
  '.iqx-line{margin:0;padding:0 10px 6px;font-size:14px;line-height:1.5;color:var(--mid);max-width:70ch}',
  '.iqx-read{margin:0 6px 6px;padding:10px 12px;border-radius:var(--r-s);font-size:15px;line-height:1.5;color:var(--ink);',
  ' background:color-mix(in srgb,var(--accent) 10%,transparent)}',
  '.iqx-read b{font-weight:600;color:var(--accent)}',
  '.iqx-read[data-st="part"],.iqx-read[data-st="level"]{background:none;color:var(--dim)}',
  '.iqx-read[data-st="part"] b,.iqx-read[data-st="level"] b{color:var(--mid)}',
  '.iqx-qs{display:grid;gap:8px;padding:2px 6px 6px}',
  '.iqx-qs .iqa-fr{grid-template-columns:minmax(0,1fr) minmax(0,540px);gap:20px;align-items:center}',
  '.iqx-m{font-size:13.5px;line-height:1.45;color:var(--dim);margin:0 0 6px}',
  /* ---- the archetype rows, round PV: one plate per pair, mirrored on one
     axis. See the note above iqxArchCard for the why; this is the geometry.
     Every vertical gap is on the 8 px step the cover uses (8, 16, 24, 32,
     40). --mk is the mark, --gt the gutter between the two halves. The pair,
     the pills and the labels share one three column grid, so their centres
     land on the same two verticals by construction. ---- */
  '#iqx-arch{--mk:56px;--gt:64px}',
  '#iqx-arch .iqa-ph{justify-content:center;padding:16px 16px 8px}',
  '#iqx-arch .iqx-line{margin:0 auto;padding:0 16px 8px;text-align:center;max-width:62ch;text-wrap:balance}',
  '#iqx-arch .iqx-read{margin:8px auto 0;text-align:center;max-width:62ch}',
  '#iqx-arch .iqx-qs{gap:0;padding:8px 0 0}',
  '.iqx-ap{display:grid;max-width:816px;width:100%;margin:0 auto;padding:40px 16px;box-sizing:border-box}',
  '.iqx-ap+.iqx-ap{border-top:1px solid var(--edge)}',
  '.iqx-pr,.iqx-dlb,.iqx-eol{display:grid;grid-template-columns:minmax(0,1fr) var(--gt) minmax(0,1fr)}',
  '.iqx-pr{position:relative;align-items:start}',
  '.iqx-af{display:flex;flex-direction:column;align-items:center;text-align:center;min-width:0}',
  '.iqx-af[data-side="a"]{--k:var(--ca);--i:var(--ia)}',
  /* b is placed by name and not by flow: the hairline between them is
     absolutely positioned and takes no cell, so in flow b fell into the
     gutter. Measured at offset 0 from the axis where a sat at minus 212. */
  '.iqx-af[data-side="b"]{--k:var(--cb);--i:var(--ib);grid-column:3}',
  '.iqx-mk{display:block;width:var(--mk);height:var(--mk);color:var(--i);fill:none;stroke:currentColor;',
  ' stroke-linecap:round;stroke-linejoin:round;overflow:visible}',
  /* the seat chip, round QB, on the numbers of the Character masks and the
     Field's orbs. See the note above iqxMark. */
  '.iqx-mk .iqx-dk{stroke:none;fill:color-mix(in srgb,var(--i) 12%,var(--sunk))}',
  /* the track is the seat's identity before anything is answered, so it is
     lit near the Field wheel's own seat rings and not at the Character
     mask's forty percent: on this disc forty read as brown, and the seat
     survived in the glyph alone. The arc over it stays the heavier, brighter
     layer, 3.2 at full strength. */
  '.iqx-mk .iqx-tk{stroke-width:2.4;opacity:.8}',
  '.iqx-mk .iqx-ld{stroke-width:3.2}',
  '.iqx-mk .iqx-gl{stroke-width:1.7}',
  /* THE LIGHT LIGHTINGS. The disc sits on the panel with the seat's wash and
     does not sink below it, the way the Field's orbs lift on Snow; a sunk
     disc read as a grey hole on a white page. And the mark takes the seat
     unlifted (icCol lifts fifteen percent for a dark ground) and deepened
     toward ink, because the track is drawn at eighty percent and is the
     seat's only colour before anything is answered. Measured on Snow against
     the disc it sits on, rendered fresh in that lighting: with icCol the
     track read 2.85 to 3.21, Heart, Solar and Sacral under the 3 to 1 a
     graphic needs; with this, 3.82 to 4.21, and the glyph 5.85 to 6.74.
     On Dark the track reads 3.24 to 6.28 and the glyph 4.41 to 9.04. */
  'body.snow .iqx-mk,body.glasswhite .iqx-mk{color:color-mix(in srgb,var(--k) 78%,var(--ink))}',
  'body.snow .iqx-mk .iqx-dk,body.glasswhite .iqx-mk .iqx-dk{fill:color-mix(in srgb,var(--k) 8%,var(--panel))}',
  '.iqx-an{display:block;margin-top:16px;font-size:17px;font-weight:600;line-height:1.3;',
  ' color:color-mix(in srgb,var(--k) 62%,var(--ink))}',
  /* centred lines are balanced, so no line ends on one stranded word */
  '.iqx-ad{margin:8px 0 0;max-width:30ch;font-size:14px;line-height:1.5;color:var(--mid);text-wrap:balance}',
  /* the hairline between the two rings: from just outside a's ring to just
     outside b's, at the height of their centres, a's seat running into b's,
     with one node on the axis */
  '.iqx-sp{position:absolute;top:calc(var(--mk) / 2);height:1px;',
  ' left:calc((100% - var(--gt)) / 4 + var(--mk) / 2 + 12px);right:calc((100% - var(--gt)) / 4 + var(--mk) / 2 + 12px);',
  ' background:linear-gradient(90deg,color-mix(in srgb,var(--ca) 55%,transparent),color-mix(in srgb,var(--cb) 55%,transparent))}',
  '.iqx-sp::after{content:"";position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:50%;background:var(--dim)}',
  '.iqx-aq{margin:32px auto 0;max-width:34em;text-align:center;font-size:18px;line-height:1.5;color:var(--ink);text-wrap:balance}',
  '.iqx-dlb{margin-top:24px;align-items:stretch}',
  '.iqx-gt{display:block}',
  '.iqx-ab{--k:var(--ca);justify-self:center;width:100%;max-width:320px;min-height:var(--tap);padding:10px 20px;border-radius:999px;',
  ' border:1px solid var(--edge-2,var(--edge));background:transparent;color:var(--ink);font-family:var(--sans);font-size:15px;',
  ' font-weight:500;line-height:1.35;cursor:pointer;',
  ' transition:background var(--t-micro) var(--ease-out),border-color var(--t-micro) var(--ease-out),box-shadow var(--t-micro) var(--ease-out)}',
  '.iqx-ab[data-side="b"]{--k:var(--cb)}',
  '.iqx-ab:hover{border-color:color-mix(in srgb,var(--k) 60%,var(--edge))}',
  /* pressed is a ring in the archetype's own seat over a faint wash of it,
     never the solid accent slab round PQ drew, which was the brightest thing
     on the screen and pulled the eye off the question */
  '.iqx-ab.on{border-color:var(--k);box-shadow:inset 0 0 0 .5px var(--k);background:color-mix(in srgb,var(--k) 14%,transparent)}',
  '.iqx-eo{margin-top:24px}',
  '.iqx-eol{margin:0 0 8px;font-size:15px;font-weight:500;line-height:1.35;color:var(--ink);text-align:center;text-wrap:balance}',
  /* the line as nodes on a path. Each cell is a full height tap target with
     the path drawn through its middle and its node on the path. The node
     grows toward the ends and its colour runs from a's seat to b's. */
  '#iqbody .iqa .iqx-ap .iq-sl{position:relative;border-radius:0;overflow:visible;box-shadow:none}',
  '#iqbody .iqa .iqx-ap .iq-n{--k:color-mix(in srgb,var(--cb) calc(var(--v) * 10%),var(--ca));position:relative;min-height:48px;',
  ' border:0;border-radius:var(--r-xs);background:transparent;color:transparent}',
  '#iqbody .iqa .iqx-ap .iq-n::before{content:"";position:absolute;left:0;right:0;top:50%;height:1px;',
  ' background:color-mix(in srgb,var(--k) 40%,transparent)}',
  '#iqbody .iqa .iqx-ap .iq-n:first-child::before{left:50%}',
  '#iqbody .iqa .iqx-ap .iq-n:last-child::before{right:50%}',
  '#iqbody .iqa .iqx-ap .iq-n::after{content:"";position:absolute;left:50%;top:50%;',
  ' width:calc(6px + var(--d) * 1px);height:calc(6px + var(--d) * 1px);transform:translate(-50%,-50%);border-radius:50%;',
  ' background:color-mix(in srgb,var(--k) 72%,var(--panel-2));transition:box-shadow var(--t-micro) var(--ease-out)}',
  '#iqbody .iqa .iqx-ap .iq-n:hover{background:color-mix(in srgb,var(--k) 8%,transparent)}',
  '#iqbody .iqa .iqx-ap .iq-n:hover::after{box-shadow:0 0 0 6px color-mix(in srgb,var(--k) 22%,transparent)}',
  '#iqbody .iqa .iqx-ap .iq-n.on{background:transparent}',
  '#iqbody .iqa .iqx-ap .iq-n.on::after{width:12px;height:12px;background:var(--k);',
  ' box-shadow:0 0 0 5px var(--panel-2),0 0 0 6.5px var(--k)}',
  /* THE OTHER LIGHTINGS, each its own. Punch draws nothing outlined, so the
     ring becomes a solid disc of the seat under the glyph, the pills are
     solid ground and the pressed one is the seat's own ground. Lumen and Flat
     fill whatever is selected, in its family's colour, their standing rule. */
  'body.punch .iqx-ap+.iqx-ap{border-top-color:transparent}',
  /* the disc goes solid at Punch's own 26 percent, the figure on .cr, and the
     track, an outline, goes. The arc stays: it is a reading and not a border. */
  'body.punch .iqx-mk .iqx-dk{fill:color-mix(in srgb,var(--k) 26%,var(--sunk))}',
  'body.punch .iqx-mk .iqx-tk{display:none}',
  /* the solid pill sits on the sunk ground: on panel-2 it was the panel's own
     colour and the unpressed answer had no shape at all, measured in all three */
  'body.punch .iqx-ab,body.flat .iqx-ab,body.lumen .iqx-ab{border-color:transparent;background:var(--sunk)}',
  'body.punch .iqx-ab.on{box-shadow:none;background:color-mix(in srgb,var(--k) 30%,var(--sunk))}',
  /* Flat and Lumen fill a pressed control with the accent, their own standing
     rule for every other pressed control. Filled with the seat it put a Root
     answer in solid red, 240 46 60 under Lumen, beside the alarm colour,
     which is reserved for something being wrong. */
  'body.flat .iqx-ab.on,body.lumen .iqx-ab.on{box-shadow:none;background:var(--accent);color:var(--on-accent)}',
  /* Lumen's accent is a bright blue, and its on-accent white measured 3.37
     on it, under the 4.5 floor for this size. The panel's own black reads
     4.87 on the same blue. */
  'body.lumen .iqx-ab.on{color:var(--panel)}',
  'body.lumen .iqx-mk .iqx-gl{stroke-width:1.9}',
  /* a phone: the same mirror, closer. The gutter shrinks before anything else
     does, and the type steps down one size on the same scale. */
  /* scoped to the block by id: a bare class here would be a second claim on
     the word, which the design gate refuses for anything setting geometry */
  '@container (max-width:560px){#iqx-arch{--mk:48px;--gt:16px}',
  ' #iqx-arch .iqx-ap{padding:32px 4px}',
  ' #iqx-arch .iqx-an{margin-top:8px;font-size:15px}',
  ' #iqx-arch .iqx-ad{font-size:13px;line-height:1.45}',
  ' #iqx-arch .iqx-aq{margin-top:24px;font-size:16px}',
  ' #iqx-arch .iqx-dlb,#iqx-arch .iqx-eo{margin-top:16px}',
  ' #iqx-arch .iqx-ab{padding:10px 12px;font-size:14px}',
  ' #iqx-arch .iqx-eol{font-size:14px}}',
  '.iqx-note{margin:0;padding:0 10px;font-size:13px;color:var(--dim)}',
  /* ---- one law: its three framings, each a card with its own icon ---- */
  '#iqbody .iqa .iq-law{border:0;background:none;border-radius:0;overflow:visible}',
  '#iqbody .iqa .iq-qc{border:1px solid var(--edge);border-radius:var(--r-s);padding:14px 16px;',
  ' background:color-mix(in srgb,var(--c) 6%,var(--sunk))}',
  'body.punch #iqbody .iqa .iq-qc,body.lumen #iqbody .iqa .iq-qc{border-color:transparent}',
  '.iqa-fr{display:grid;gap:12px;min-width:0}',
  '.iqa-open .iqa-fr{grid-template-columns:minmax(0,1fr) minmax(0,540px);gap:20px;align-items:center}',
  '.iqa-flr{display:flex;align-items:center;gap:8px;margin-bottom:4px}',
  '.iqa-fi{display:grid;place-items:center;color:var(--c)}',
  '.iqa-fl{font-style:normal;font-size:13px;font-weight:600;color:color-mix(in srgb,var(--c) 62%,var(--ink))}',
  '.iqa-ex{font-family:var(--num);font-size:13px;color:var(--dim)}',
  '.iqa-qt{font-size:16px;line-height:1.5;color:var(--ink)}',
  /* the scale ramps from the sunk ground toward the seat, so the ends read as
     ends before a number is read. Pressed is the seat solid. */
  '#iqbody .iqa .iq-sl{border-radius:var(--r-xs)}',
  '#iqbody .iqa .iq-n{min-height:48px;background:color-mix(in srgb,var(--c) calc(var(--v) * 1.6%),var(--sunk))}',
  '#iqbody .iqa .iq-n:hover{background:color-mix(in srgb,var(--c) 34%,var(--sunk));color:var(--ink)}',
  '#iqbody .iqa .iq-n.on{background:var(--c);color:var(--on-accent)}',
  '.iqa-gap{display:block;width:100%;height:auto}',
  '.iqa-sub{font-size:13.5px;color:var(--dim)}',
  '.iqa-sub b{font-weight:500;color:color-mix(in srgb,var(--c) 62%,var(--ink))}',
  /* ---- the wheel ---- */
  '.iqa-stage{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,560px);overflow:hidden;',
  ' border-radius:var(--r);background:var(--sunk);border:1px solid var(--edge)}',
  '.iqa-wheel{display:flex;justify-content:center;align-items:flex-start;padding:14px;min-width:0}',
  '.iqa-wheel svg{width:100%;max-width:640px;height:auto}',
  '.iqa-lb{cursor:pointer;outline:none}',
  '.iqa-lb:focus-visible .iqa-lbf{stroke:var(--accent)}',
  '.iqa-side{display:flex;flex-direction:column;gap:18px;padding:22px;min-width:0;border-left:1px solid var(--edge)}',
  '.iqa-sidehd{display:flex;gap:12px;align-items:center}',
  '.iqa-h3{margin:0;font-size:22px;font-weight:600;color:var(--ink)}',
  '.iqa-inhand{display:grid;gap:12px}',
  /* ---- one law at a time ---- */
  '.iqa-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 14px;padding:8px 12px;',
  ' border-radius:28px;background:var(--sunk);border:1px solid var(--edge)}',
  '.iqa-grp{display:flex;gap:2px}',
  '.iqa-sb{display:grid;place-items:center;min-width:var(--tap);min-height:var(--tap);padding:0;border:0;',
  ' border-radius:999px;background:none;cursor:pointer}',
  '.iqa-sb[aria-current="true"]{box-shadow:inset 0 0 0 1.5px var(--accent)}',
  'body.punch .iqa-sb[aria-current="true"]{box-shadow:none;background:var(--panel-2)}',
  '.iqa-bstrip{display:none}',
  '.iqa-focus{display:grid;grid-template-columns:260px minmax(0,1fr);gap:40px;align-items:start}',
  '.iqa-hero1{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;min-width:0}',
  '.iqa-ring{width:220px;height:220px;max-width:100%}',
  '.iqa-ln{font-size:30px;font-weight:600;line-height:1.15;letter-spacing:-.01em;color:var(--ink)}',
  '.iqa-hgap{width:100%;max-width:240px}',
  '.iqa-qs{display:flex;flex-direction:column;gap:20px;max-width:720px;min-width:0}',
  '.iqa-nav{display:flex;justify-content:space-between;gap:10px}',
  'body.punch .iqa-stage,body.punch .iqa-strip,body.punch .iqa-side,body.punch .iqa-views,',
  'body.lumen .iqa-stage,body.lumen .iqa-strip{border-color:transparent}',
  /* ---- arrival. opacity and transform, once, and held still on request ---- */
  '@keyframes iqa-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
  '@keyframes iqa-pop{0%{transform:scale(1)}38%{transform:scale(1.14)}100%{transform:scale(1)}}',
  '@keyframes iqa-fade{from{opacity:0}to{opacity:1}}',
  '.iqa-in{animation:iqa-in var(--t-surface) var(--ease-out) both}',
  '.iqa-rg.iqa-pop,.iqa-hr.iqa-pop,.iq-n.iqa-pop{animation:iqa-pop var(--t-surface) var(--ease-land)}',
  '.iqa-sg.iqa-new{animation:iqa-fade var(--t-context) var(--ease-enter) both}',
  '@media (prefers-reduced-motion:reduce){',
  ' .iqa-in,.iqa-rg.iqa-pop,.iqa-hr.iqa-pop,.iq-n.iqa-pop,.iqa-sg.iqa-new{animation:none}',
  ' .iqa-tile,.iqa-tile:hover{transform:none;transition:none}}',
  'body.quiet .iqa-in,body.rm .iqa-in,body.quiet .iqa-rg.iqa-pop,body.rm .iqa-rg.iqa-pop,',
  'body.quiet .iqa-hr.iqa-pop,body.rm .iqa-hr.iqa-pop,body.quiet .iq-n.iqa-pop,body.rm .iq-n.iqa-pop,',
  'body.quiet .iqa-sg.iqa-new,body.rm .iqa-sg.iqa-new{animation:none}',
  'body.quiet .iqa-tile:hover,body.rm .iqa-tile:hover{transform:none}',
  /* ---- the middle width, a menu or a narrow column ---- */
  '@container (max-width:1040px){',
  ' .iqa .iqa-stage{grid-template-columns:1fr}',
  ' .iqa .iqa-side{border-left:0;border-top:1px solid var(--edge)}',
  ' .iqa .iqa-open .iqa-fr,.iqa .iqx-qs .iqa-fr{grid-template-columns:1fr;gap:10px}',
  ' .iqa .iqa-open{padding-left:6px}}',
  '@container (max-width:900px){',
  ' .iqa .iqa-whob{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"i t v" "c c c";row-gap:10px}',
  ' .iqa .iqa-wcs{justify-content:space-between;width:100%}',
  ' .iqa .iqa-focus{grid-template-columns:1fr;gap:18px}',
  ' .iqa .iqa-ring{width:150px;height:150px}}',
  '@container (max-width:700px){',
  ' .iqa .iqa-hero{grid-template-columns:auto minmax(0,1fr);padding:12px 14px;gap:10px 14px}',
  ' .iqa .iqa-sc{padding:12px 14px;gap:8px}',
  ' .iqa .iqa-whob{min-height:56px;padding:8px 14px}',
  ' .iqa .iqa-tools{grid-column:1/-1;justify-content:space-between}',
  ' .iqa .iqa-views{flex:1 1 auto}',
  ' .iqa .iqa-views .st-ico{flex:1 1 0}',
  ' .iqa .iqa-hr svg{width:68px;height:68px}',
  ' .iqa .iqa-hn b{font-size:22px}',
  ' .iqa .iqa-hh{font-size:22px}',
  ' .iqa .iqa-mid{grid-template-columns:1fr}',
  ' .iqa .iqa-gapn{display:none}',
  ' .iqa .iqa-map{gap:4px}',
  ' .iqa .iqa-tile{padding:10px 2px 9px;gap:5px}',
  ' .iqa .iqa-tile .iqa-rg svg{width:44px;height:44px}',
  ' .iqa .iqa-tn{font-size:12px}',
  ' .iqa .iqa-ts{font-size:12.5px}',
  ' .iqa .iqa-nd{top:5px;right:5px}',
  ' .iqa .iqa-lawr{grid-template-columns:auto minmax(0,1fr) 40px 20px;gap:12px}',
  ' .iqa .iqa-lawr .iqa-gw{display:none}',
  ' .iqa .iqa-lawr[aria-expanded="true"] .iqa-gw{display:block;grid-column:1/-1;grid-row:2}',
  ' .iqa .iqa-lt{font-size:16px}',
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
  ' .iqa .iqa-wheel{padding:6px}',

  '@container (max-width:460px){',
  ' .iqa .iqa-pn{padding:6px 4px}',
  ' .iqa .iqa-lawr{padding:8px 6px;gap:10px}',
  ' #iqbody .iqa .iq-qc{padding:12px 12px}}'
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
/* ROUND RG. "spread 2.2" named a statistic and "2 left" counted nothing a
   person could name. The spread is how far apart the three answers sit, and
   what is left is questions, so each says so. */
function iqLine(s,g){return s?'answers '+s.spread+' apart, '+s.lean
 :g?(3-g)+((3-g)===1?' question left':' questions left'):'unanswered';}
/* a law as Summary draws a thing: its own glyph in a ring. The ring is the
   page's grammar, written above at iqSegs: segments while it is being
   answered, one arc once it reads. Untouched is the track and a dim glyph,
   started is some segments in the seat colour, read is the arc and the figure
   beside it. The size is a name, and the ring is a span, so a press on the row
   that holds it is the row's. */
var IQ_PX={sm:34,md:44,lg:56};
function iqLawBadge(l,s,g,size){
 var px=IQ_PX[size]||IQ_PX.sm, c=seatCol(l.b), st=s?2:g?1:0;
 var body=s?iqScoreArc(c,s.score/10,24,24,20,3.6)
  :iqSegs([g>0?1:0,g>1?1:0,g>2?1:0],function(){return c;},24,24,20,3.6,16);
 return '<span class="iqa-rg" data-st="'+st+'" style="--c:'+c+'"><svg width="'+px+'" height="'+px+'" viewBox="0 0 48 48" aria-hidden="true">'
  +body
  +'<g transform="translate(15 15) scale(.75)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
  +(st?'stroke="'+c+'"':'style="stroke:var(--dim)"')+'><path d="'+l.ic+'"/></g></svg></span>';}
/* A SEAT IS A SEGMENT PER LAW, and an arc once every law under it reads. */
function iqSeatStat(b,p,sc){
 var L=iqLawsOf(b), ms=L.map(function(x){return sc[x.l.nm];}).filter(Boolean), got=0;
 L.forEach(function(x){got+=iqGot(p,x.li);});
 var mean=ms.length?ms.reduce(function(a,s){return a+s.score;},0)/ms.length:0;
 var done=L.length>0&&ms.length===L.length;
 return {L:L,mean:mean,got:got,done:done,st:done?2:got?1:0};}
function iqSeatRing(b,t,p,sc,px){
 var c=seatCol(b), body=t.done?iqScoreArc(c,t.mean/10,24,24,20,3.6)
  :iqSegs(t.L.map(function(x){var g=iqGot(p,x.li); return sc[x.l.nm]?1:g?.5:0;}),function(){return c;},24,24,20,3.6,14);
 return '<span class="iqa-rg" data-st="'+t.st+'" style="--c:'+c+'"><svg width="'+px+'" height="'+px+'" viewBox="0 0 48 48" aria-hidden="true">'
  +body+'<g transform="translate(15 15) scale(.75)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
  +(t.st?'stroke="'+c+'"':'style="stroke:var(--dim)"')+'>'+(SEATGLYPH[b]||SEATGLYPH._)+'</g></svg></span>';}
/* THE FIRST LAW STILL MISSING AN ANSWER, in body order. It is the next thing
   to do, and the page says so on the seat and on the row. */
function iqNext(p){
 var o=iqBodyOrder();
 for(var i=0;i<o.length;i++)if(iqGot(p,o[i])<3)return o[i];
 return null;}
/* THE SEAT WHOSE LAWS ARE SHOWING. A law that is open always shows its seat,
   so a gate or a door that opens a law by number is never looking at a closed
   panel. Otherwise the person's own choice, and failing that the seat the next
   law is in, so arrival lands on the next thing to answer. */
function iqSeatOpen(p){
 if(IQ_OPEN!=null)return SI[IQ_OPEN].b;
 if(IQ_SEAT!=null)return IQ_SEAT;
 var n=iqNext(p); return n!=null?SI[n].b:IQ_SEATS[0];}
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
   answer more round than the one on file. Each framing now carries its own
   icon beside its name: under cost, unseen, ordinary day. The scale keeps its
   eleven even cells and each cell knows its own number, so it can ramp. */
function iqFramings(p,Q,li){
 var c=seatCol(SI[li].b), h='';
 [0,1,2].forEach(function(t){
  var idx=li*3+t, qq=Q[idx], v=p.intake.answers[idx];
  var near=(v==null)?null:Math.round(v);
  h+='<div class="iq-qc iqa-fr" style="--c:'+c+'"><div>'
   +'<div class="iqa-flr"><span class="iqa-fi">'+iqSvg(IQ_IC[IQ_SIDEIC[qq.side]||'day'])+'</span>'
   +'<em class="iqa-fl">'+esc(IQ_SIDE[qq.side]||qq.side)+'</em>'
   +(v!=null&&v!==near?'<span class="iqa-ex">'+esc(v)+'</span>':'')+'</div>'
   +'<div class="iqa-qt">'+esc(qq.q)+'</div></div>'
   /* the scale is the accordion's own, one row of eleven even cells, which is
      ruled, and the prototype's two row wrap is not taken */
   +'<div class="iq-sl">';
  for(var n=0;n<=10;n++)
   h+='<button type="button" class="iq-n'+(near===n?' on':'')+'" data-a="'+idx+'" data-v="'+n+'" style="--v:'+n+'" '
    +'aria-pressed="'+(near===n)+'">'+n+'</button>';
  h+='</div></div>';});
 return h;}
/* THE HEADER. Where I am, how far, and how to look. The ring is the page's
   figure: one segment per law, all twenty one, in the seat colours crown to
   root, lit as each reads. CQ sits in the middle of it once a law is measured.
   One line under the title: the tier word once a law is read, and until then
   what is left. Never a count against a total, which the accordion's own note
   ruled out: "1 of 3" is a fraction and a fraction is a score. */
function iqHeroRing(p,sc,cq){
 var o=iqBodyOrder(), vals=o.map(function(li){var g=iqGot(p,li); return sc[SI[li].nm]?1:g?.5:0;});
 var seg=iqSegs(vals,function(i){return seatCol(SI[o[i]].b);},48,48,40,6.5,5);
 return '<span class="iqa-hr"><svg viewBox="0 0 96 96" aria-hidden="true">'+seg+'</svg>'
  +'<span class="iqa-hn"><b>'+(cq==null?'–':Math.round(cq))+'</b><i class="tipu"'+unpAttr('cq',null,'CQ')+'>CQ</i></span></span>';}
/* A SIMULATION, NOT A BEHAVIOUR, round OK. His words: "What if we do show CQ
   at 100 on starting? It shows the soul raw expression. And then as the input
   stuff, it comes down. I don't want that to actually happen. But I'm curious
   to see how that works. So I want to simulate that." Behind a switch that a
   person never meets (?sim=cq100 on the address, or window.IQ_SIM_CQ100), the
   ring's figure starts at 100 and every law answered swaps its assumed ten for
   the real answer, so the figure falls as the person speaks. It reads r.CQ
   and the count of laws measured and changes nothing it reads. */
function iqSim(){
 try{return !!(window.IQ_SIM_CQ100||/[?&]sim=cq100\b/.test(location.search));}catch(e){return false;}}
function iqSimCQ(r,scored){return Math.max(0,Math.min(100,(+r.CQ||0)+(21-scored)*10/210*100));}
function iqHeroHtml(p,sc,r,scored,answered,total){
 var left=total-answered;
 /* THE FIGURE WAITS FOR THE BAND. The summary beside this page says it in
    its own words, "The band is named once all 21 are in", and a CQ of 3 printed
    after one law is a stranger being told they are incoherent on the strength
    of a twenty first of the data. The ring still fills as each law lands. */
 var simOn=iqSim();
 return '<header class="iqa-hero iqa-card">'+iqHeroRing(p,sc,simOn?iqSimCQ(r,scored):((scored&&r.tier)?r.CQ:null))
  +'<div class="iqa-ht"><span class="iqa-eye">Energetics</span>'
  +'<span class="iqa-hh">'+(simOn?'Simulation: every unanswered law counts as ten':(r.tier?esc(r.tier):left+' questions left'))+'</span>'
  +'<span class="iqa-hs">'+(scored?scored+' law'+(scored===1?'':'s')+' measured':'No laws measured yet')
  +(r.tier&&left>0?', '+left+' question'+(left===1?'':'s')+' left':'')+'</span></div>'
  +'<div class="iqa-tools">'+iqViewHtml()
  +'<button type="button" class="iqa-mb" id="iqmore" aria-expanded="'+IQ_MORE+'" aria-controls="iqmorep" '
  +'aria-label="Profile" title="Profile">'+iqSvg(IQ_IC.more)+'</button></div></header>';}
/* AND THE SWITCHER NAMES WHAT IS ACTUALLY LOADED. It listed PROFILES only,
   and a reference case is not in that list any more, so with one loaded no
   option matched and the control showed the person's own name above
   somebody else's sixty three answers. It carries the loaded example as an
   entry of its own, marked as what it is, and the handler refuses to switch
   to it, because there is nothing to switch to: it is already up. The four
   profile controls are nested behind the header's one icon, which is the
   same four controls with one decision in front of them. */
function iqMoreHtml(p){
 return '<div class="iqa-more iqa-card iq-act" id="iqmorep"'+(IQ_MORE?'':' hidden')+'>'
  +'<select id="iqprof" aria-label="Profile">'
  +(PROFILES.indexOf(p)<0
    ?'<option value="-1" selected>'+esc(p.name)+', a worked example</option>':'')
  +PROFILES.map(function(x,i){
     return '<option value="'+i+'"'+(x===CURP?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select>'
  +'<button class="btn" id="iqnew">New</button>'
  +'<button class="btn pri" id="iqsave">Save</button>'
  +'<button class="btn" id="iqexp">Export</button></div>';}

/* ---------- A. The map, and the seat that is open ---------- */
function iqViewList(p,Q,sc){
 var open=iqSeatOpen(p), nx=iqNext(p), tiles='', panels='';
 IQ_SEATS.forEach(function(b,bi){
  var t=iqSeatStat(b,p,sc), c=seatCol(b), on=(open===b); if(!t.L.length)return;
  var isNext=(nx!=null&&SI[nx].b===b);
  tiles+='<button type="button" class="iqa-tile" data-seat="'+esc(b)+'" data-st="'+t.st+'" aria-expanded="'+on+'" '
   +'aria-controls="iqa-p'+bi+'" aria-label="'+esc(b)+', '+['not started','started','read'][t.st]+'" style="--c:'+c+'">'+iqSeatRing(b,t,p,sc,56)
   +'<span class="iqa-tn">'+esc(b)+'</span>'
   +'<span class="iqa-tm" aria-hidden="true">'+t.L.map(function(x){
      var g=iqGot(p,x.li); return '<i class="iqa-pip" data-st="'+(sc[x.l.nm]?2:g?1:0)+'"></i>';}).join('')+'</span>'
   +(t.done?'<b class="iqa-ts">'+t.mean.toFixed(1)+'</b>':'')
   +(isNext?'<i class="iqa-nd" aria-hidden="true"></i>':'')+'</button>';
  panels+='<section class="iqa-pn" id="iqa-p'+bi+'" style="--c:'+c+'"'+(on?'':' hidden')+'>'
   +'<div class="iqa-ph"><span class="iqa-shn">'+esc(b)+'</span><span class="iqa-shl">'+esc(IQ_SEATLINE[b])+'</span></div>'
   +'<div class="iqa-laws" role="group" aria-label="The laws in '+esc(b)+'">';
  t.L.forEach(function(x){
   var s=sc[x.l.nm], g=iqGot(p,x.li), lo=(IQ_OPEN===x.li), st=s?2:g?1:0;
   panels+='<button type="button" class="iqa-lawr" data-law="'+x.li+'" data-st="'+st+'" data-next="'+(nx===x.li?1:0)+'" '
    +'aria-expanded="'+lo+'" style="--c:'+c+'">'
    +iqLawBadge(x.l,s,g,'md')
    +'<span class="iqa-lx"><span class="iqa-lt">'+esc(x.l.nm)+(nx===x.li?'<span class="iqa-nx">Next</span>':'')+'</span>'
    +'<span class="iqa-lv">'+esc(iqLine(s,g))+'</span></span>'
    +'<span class="iqa-gw">'+iqGap(p,x.li,200)+'</span>'
    +'<span class="iqa-sv">'+(s?s.score.toFixed(1):'')+'</span>'
    +'<span class="iqa-chev">'+iqSvg(IQ_IC.chev)+'</span></button>';
   if(lo)panels+='<div class="iq-law open iqa-open" style="--c:'+c+'">'+iqFramings(p,Q,x.li)+'</div>';});
  panels+='</div></section>';});
 return '<div class="iqa-list"><div class="iqa-map" role="group" aria-label="The seven seats">'+tiles+'</div>'+panels+'</div>';}

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
  +'<div class="iqa-focus" style="--c:'+c+'"><div class="iqa-hero1">'+ring
  +'<div class="iqa-ln">'+esc(l.nm)+'</div>'
  +'<div class="iqa-sub"><b>'+esc(l.b)+'</b>, '+esc(IQ_SEATLINE[l.b])+'</div>'
  +'<div class="iqa-hgap">'+iqGap(p,ih,240)+'</div><div class="iqa-sub">'+esc(iqLine(q,g))+'</div></div>'
  +'<div class="iqa-qs"><div class="iq-law open iqa-inhand">'+iqFramings(p,Q,ih)+'</div>'
  +'<div class="iqa-nav"><button type="button" class="btn" data-step="-1">Previous law</button>'
  +'<button type="button" class="btn pri" data-step="1">Next law</button></div></div></div>';}

/* ============================================================
   THE THREE BLOCKS STACKED UNDER THE LAWS. Round PP, his words: "Intake, I
   asked for the Jungian archetypes. And we should also do the nine emotional
   axis and the six action axis ... We'll keep this design for now. Let's see
   what it looks like with all of them stacked."

   KEPT TO THE DESIGN IT SITS IN. Each block is the seat panel's own surface
   (.iqa-pn), each question is the law's framing card (.iq-qc, .iqa-fr) with
   the same eleven cell scale, and nothing new is drawn. They are STACKED, all
   open, under the laws in all three views: the point of this round is to see
   the page at its full length, so nothing here is folded behind a press.

   The questions are data (engine/data/intakemore.js) and the record, the
   boundary and the read-out sentence are engine (engine/intakemore.js). This
   draws them and writes one answer through ixSet. It does not call
   lawAnswered, iqApply or render(): these answers are evidence and are read by
   no sum, so there is nothing else on the page to bring up to date.
   ============================================================ */
var IQ_XPOP=null;
/* a row's seat, and so its colour, from the table that already places it. An
   archetype and an axis each have one. The six gates have none of their own
   and the Field's bar draws them at the Heart (ui/fieldbar.js). */
function iqxSeat(id,k){
 var i;
 if(id==='arch'){for(i=0;i<ARCH.length;i++)if(ARCH[i].nm===k)return ARCH[i].b;}
 if(id==='axes'){for(i=0;i<CHILD.length;i++)if(CHILD[i].nm===k)return CHILD[i].seat;}
 return 'Heart';}
/* the mark a named row wears, drawn from the product's own tables: an axis its
   glyph in CHILD, an action its gate glyph. An archetype row is a pair and
   draws its two marks itself, in iqxArchCard below. */
function iqxIcon(id,k){
 var i;
 if(id==='axes'){for(i=0;i<CHILD.length;i++)if(CHILD[i].nm===k)return CHILD[i].ic;}
 if(id==='acts')return GATEGLYPH[k]||null;
 return null;}
/* THE ARCHETYPE ROWS, ROUND PV. His words: "for the archetype intake, I want
   to see the symbol of the archetype and a description, and then the question.
   Uh, also review the layout. This isn't very symmetrical even. It's not using
   any of the design aesthetics that we've come up with. So fail on design."

   A ROW IS A PAIR, SO THE PLATE IS A MIRROR. Every row is a contest between
   two archetypes (row.a, row.b) on one line, 0 fully a to 10 fully b. The
   plate is drawn on that line's own symmetry: one centre axis, a on the left
   and b on the right, and every element either sits on the axis or has its
   twin across it. Read top to bottom, in his order:

     the pair    each archetype's own mark (ARCH[].ic, the twelve marks the
                 Avatar and the rail already carry, inside a ring in the
                 colour of its seat), its name, and its two sentence
                 description (ARCH[].v then ARCH[].d). A hairline joins the
                 two rings, carrying a's seat colour into b's: the line the
                 answer is a point on.
     the question  on the axis. A dilemma's scene, or for an either or the one
                 question all nine share (IX_EO_ASK).
     the answer  a dilemma's two responses as two equal pills, each standing
                 directly under the archetype it leans toward, so the pill's
                 centre and the mark's centre share one vertical. An either
                 or's two behaviours sit in those same two places, over the
                 eleven positions of the line drawn as nodes on a path, the
                 Field's own grammar, centre node on the axis.

   ONE GRID FOR ALL THREE BANDS. The pair, the dilemma's pills and the either
   or's labels all use the same three columns, 1fr, a fixed gutter, 1fr, so
   their centres fall on the same two verticals by construction and never by
   eye. The node line is the one element that runs the full width, the
   single break of that grid.

   NO NUMBER ON THE LINE. The cells printed 0 to 10, and a digit standing
   alone is what round PO fails ("a label, symbol, sign, number or term of art
   never stands alone"). The two behaviours at the ends already say what the
   line measures; the node's size says how far toward an end it is, and its
   colour moves from a's seat to b's. Each node still says its position to a
   screen reader in words.

   NO TINTED CARD. Round PQ washed every row in its seat colour at six
   percent, eighteen muddy boxes. The colour lives on the marks, the names,
   the hairline and the pressed answer, the places it means something, and
   the plates are separated by a hairline rule and space, the way the cover
   is built. */
function iqxArch(nm){
 var i; for(i=0;i<ARCH.length;i++)if(ARCH[i].nm===nm)return ARCH[i]; return null;}
/* THE MARK IS THE SEAT CHIP, ROUND QB. His words: "Archetypes uh, under
   intake. need to be visual. The archetype uh, it should match the same as the
   chakra style." Round PV drew each mark as one closed hairline in the seat's
   colour floating on the panel, and beside the Field's bar, the Character
   page's masks and Summary's rings it read as a line drawing and not as one
   of them. Measured against the three, two things were different:

     the ground  every seat chip on those pages sits on its own disc, darker
                 than the panel and washed with its seat (.fb-orb, .chp-mk,
                 .cr). This mark had none.
     the ring    those rings are two layers, a quiet track and a heavier arc
                 that reports a quantity, at 5 to 7.6 percent of the chip's
                 width (Character 3 on 60, the Field 2.6 on 40, Summary 3.5 on
                 46). This one was a single hairline at 2.7 percent, 1.5 on 56,
                 reporting nothing.

   So the mark is now the chip: a disc on the sunk ground washed with the seat,
   the seat's track under it, and an arc at 3.2 on 56. The arc says the one quantity this row has, how much of the
   person's answer sits with this archetype: a dilemma answered toward it fills
   the ring, an either or at the middle fills half of each. Unanswered there is
   no arc, which is how the Character page draws an unloaded mask. An arc
   drawn full for decoration would lie in a product where every arc is a
   reading. The glyph stays the archetype's own, in its seat's colour, as on
   the Character masks and the Summary rings.

   NO PILL. Those chips carry a figure in a pill at the lower right. This one
   does not, because round PV took the digits off this line for round PO's
   reason, a number standing alone, and the two answers under the pair
   already say what the arc measures. */
function iqxMark(A,share){
 var R=24.5, C=2*Math.PI*R, s=Math.max(0,Math.min(1,share||0));
 return '<svg class="iqx-mk" viewBox="0 0 56 56" aria-hidden="true">'
  +'<circle class="iqx-dk" cx="28" cy="28" r="27"/><circle class="iqx-tk" cx="28" cy="28" r="'+R+'"/>'
  /* a zero length dash with a round cap still paints a dot, so no answer
     draws no arc at all */
  +(s>0?'<circle class="iqx-ld" cx="28" cy="28" r="'+R+'" transform="rotate(-90 28 28)" stroke-dasharray="'
   +(C*s).toFixed(1)+' '+C.toFixed(1)+'"/>':'')
  +'<path class="iqx-gl" transform="translate(16 16)" d="'+A.ic+'"/></svg>';}
function iqxFig(A,side,share){
 var cap=function(t){return t.charAt(0).toUpperCase()+t.slice(1);};
 return '<div class="iqx-af" data-side="'+side+'">'+iqxMark(A,share)
  +'<b class="iqx-an">'+esc(A.nm)+'</b>'
  +'<p class="iqx-ad">'+esc(cap(A.v)+'. '+(A.d||''))+'</p></div>';}
function iqxArchCard(p,row){
 var A=iqxArch(row.a)||{nm:row.a,v:'',d:'',b:'Heart',ic:''}, B=iqxArch(row.b)||{nm:row.b,v:'',d:'',b:'Heart',ic:''};
 var v=ixGet(p,'arch',row.k), cap=function(t){return t.charAt(0).toUpperCase()+t.slice(1);};
 var st='--ca:'+seatCol(A.b)+';--cb:'+seatCol(B.b)+';--ia:'+icCol(A.b)+';--ib:'+icCol(B.b);
 var gt='<span class="iqx-gt" aria-hidden="true"></span>', ans;
 if(row.type==='dilemma'){
  /* two equal pills, each under the archetype it leans toward */
  var pill=function(side,val,txt){var sel=(v===val);
   return '<button type="button" class="iqx-ab'+(sel?' on':'')+'" data-side="'+side+'" data-ixb="arch" data-ixk="'+esc(row.k)
    +'" data-v="'+val+'" aria-pressed="'+sel+'">'+esc(txt)+'</button>';};
  ans='<p class="iqx-aq">'+esc(row.scene)+'</p>'
   +'<div class="iqx-dlb" role="group" aria-label="'+esc(row.scene)+'">'+pill('a',0,row.ra)+gt+pill('b',10,row.rb)+'</div>';}
 else{
  /* the two behaviours in the pills' places, over the line as eleven nodes */
  var near=(v==null)?null:Math.round(v), nodes='';
  for(var n=0;n<=10;n++){
   var d=Math.abs(n-5), say=n===5?'Even between the two'
    :(n<5?'Toward '+row.ta:'Toward '+row.tb)+', '+(d===5?'all the way':d+' of 5 steps from even');
   nodes+='<button type="button" class="iq-n'+(near===n?' on':'')+'" data-ixb="arch" data-ixk="'+esc(row.k)+'" data-v="'+n
    +'" style="--v:'+n+';--d:'+d+'" aria-pressed="'+(near===n)+'" aria-label="'+esc(say)+'"></button>';}
  ans='<p class="iqx-aq">'+esc(IX_EO_ASK)+'</p>'
   +'<div class="iqx-eo"><p class="iqx-eol"><span data-side="a">'+esc(cap(row.ta))+'</span>'+gt
   +'<span data-side="b">'+esc(cap(row.tb))+'</span></p>'
   +'<div class="iq-sl" role="group" aria-label="'+esc(cap(row.ta))+', or '+esc(row.tb)+'">'+nodes+'</div></div>';}
 return '<div class="iqx-ap" data-type="'+row.type+'" style="'+st+'">'
  /* the line runs 0 fully a to 10 fully b, so a holds what b does not */
  +'<div class="iqx-pr">'+iqxFig(A,'a',v==null?0:(10-v)/10)+'<span class="iqx-sp" aria-hidden="true"></span>'
  +iqxFig(B,'b',v==null?0:v/10)+'</div>'
  +ans+'</div>';}
function iqxCard(p,id,row){
 var c=seatCol(iqxSeat(id,row.k)), v=ixGet(p,id,row.k), near=(v==null)?null:Math.round(v);
 var ic=iqxIcon(id,row.k), nm=ixName(id,row.k);
 /* THE LABEL ROW IS THERE FOR A NAMED ROW ONLY, and a name never stands alone:
    the one sentence that says what it means sits under it. */
 var lab=(id==='arch')?'':'<div class="iqa-flr"><span class="iqa-fi">'+iqSvg(ic)+'</span>'
   +'<em class="iqa-fl">'+esc(nm)+'</em></div><div class="iqx-m">'+esc(row.means)+'</div>';
 var h='<div class="iq-qc iqa-fr" style="--c:'+c+'"><div>'+lab
  +'<div class="iqa-qt">'+esc(row.q)+'</div></div>'
  +'<div class="iq-sl" role="group" aria-label="'+esc(row.q)+'">';
 for(var n=0;n<=10;n++)
  h+='<button type="button" class="iq-n'+(near===n?' on':'')+'" data-ixb="'+id+'" data-ixk="'+esc(row.k)+'" data-v="'+n
   +'" style="--v:'+n+'" aria-pressed="'+(near===n)+'">'+n+'</button>';
 return h+'</div></div>';}
function iqxHtml(p){
 ixFill(p);
 return IX_BLOCKS.map(function(b){
  var r=ixRead(p,b.id), say=ixSay(b.id,r);
  return '<section class="iqa-pn iqx" id="iqx-'+b.id+'" data-st="'+r.state+'" style="--c:var(--accent)">'
   +'<div class="iqa-ph"><span class="iqa-shn">'+esc(b.nm)+'</span></div>'
   +'<p class="iqx-line">'+esc(b.line)+'</p>'
   +(say.head?'<p class="iqx-read" data-st="'+r.state+'"><b>'+esc(say.head)+'</b>'+(say.body?' '+esc(say.body):'')+'</p>':'')
   +'<div class="iqx-qs">'+b.rows.map(function(row){return b.id==='arch'?iqxArchCard(p,row):iqxCard(p,b.id,row);}).join('')+'</div>'
   +'</section>';}).join('')
  /* said once under the stack and not under each block: three copies of one
     sentence is the page explaining itself three times */
  +'<p class="iqx-note">These three are kept beside your reading. They do not change it.</p>';}

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
 /* what the last press opened and what it landed on, each read once */
 var an=IQ_ANIM, pu=IQ_PULSE; IQ_ANIM=null; IQ_PULSE=null;
 /* THE PROSE THAT EXPLAINED THIS SECTION IS GONE. His own standing rule,
    violated twice in this one screen: no text that describes what something
    is or how to use it, ever, where an icon, a symbol or the layout itself
    already says it. Round HS, his own words: "why is that text never being
    written out ever again after I keep asking for it to never be written
    out." The page is four bands now and none of them describes itself: the
    header says where you are and how far, the row under it holds who this is
    and the scale, the map holds the seven seats, and the open seat holds its
    laws. The birth moment is nested behind its row and the profile controls
    behind one icon. */
 /* THE FRAME, AND THE DURATION. The panel's two findings, both measured:
    without a stated duration and a visible remainder, 63 questions loses about
    half its finishers; with both, plus one line naming the three way design,
    completion runs 29 points higher. The ruler band carries the duration and
    the header carries the remainder, and the three ways are shown by layout:
    an open law sets its three framings side by side, each with its own name
    and icon. */
 var h='<div class="iqa">'+iqHeroHtml(p,sc,r,scored,answered,Q.length)+iqMoreHtml(p)
  +'<div class="iqa-mid" data-who="'+(IQ_WHO?1:0)+'">'+iqWhoHtml(p)+iqAccuracy()+'</div>';
 /* THE LAW IN HAND IS PINNED ON ARRIVAL. Left unpinned it was worked out
    fresh on every draw as the first law still missing an answer, so the third
    press on a law finished it and the view jumped to the next one before the
    person had seen what they had just made. Measured by driving it: three
    answers on Unity landed the page on Awareness with Unity's reading unseen. */
 if(IQ_VIEW!=='list'&&IQ_OPEN==null)IQ_OPEN=iqInHand(p);
 h+=(IQ_VIEW==='wheel'?iqViewWheel(p,Q,sc,r,scored):IQ_VIEW==='one'?iqViewOne(p,Q,sc):iqViewList(p,Q,sc));
 h+=iqxHtml(p);
 h+='</div>';
 iqArtCss(); iqDoors();
 host.innerHTML=h;
 /* the avatar repaints only when something it reads has moved, so a press on
    a law never throws away a half typed pair above it */
 if(typeof avRefresh==='function')avRefresh();
 /* ARRIVAL. Only the thing the last press opened takes the entrance, and a
    ring that just changed shows it: the segment that landed fades in, a law
    that closed pops once, and so does the cell that was pressed. */
 if(an){
  var at=an.who?host.querySelector('.iqa-whop:not([hidden])'):an.more?host.querySelector('.iqa-more:not([hidden])')
   :an.seat?host.querySelector('.iqa-pn:not([hidden])'):an.law!=null?host.querySelector('.iqa-open'):null;
  if(at)at.classList.add('iqa-in');}
 if(IQ_XPOP){var xe=host.querySelector(IQ_XPOP+'.on'); IQ_XPOP=null; if(xe)xe.classList.add('iqa-pop');}
 if(pu){
  var pg=iqGot(p,pu.li), seg=pu.fresh?(pg>=3?'s':String(pg-1)):null;
  host.querySelectorAll('[data-law="'+pu.li+'"] .iqa-rg').forEach(function(e){
   e.classList.add('iqa-pop');
   var sg=seg!=null&&e.querySelector('.iqa-sg[data-i="'+seg+'"]'); if(sg)sg.classList.add('iqa-new');});
  var hr=host.querySelector('.iqa-hr'); if(hr)hr.classList.add('iqa-pop');
  var tl=host.querySelector('.iqa-tile[data-seat="'+SI[pu.li].b+'"] .iqa-rg'); if(tl)tl.classList.add('iqa-pop');
  var on=host.querySelector('.iq-n.on[data-a="'+pu.a+'"]'); if(on)on.classList.add('iqa-pop');}
 host.querySelectorAll('[data-law]').forEach(function(el){
  /* the list opens and closes a law in place, as the accordion did. The wheel
     and one at a time always have a law in hand, so a press there moves it
     and never empties the panel. getAttribute and not dataset, because on the
     wheel the control is an svg g. A law pressed also holds its seat open. */
  var go=function(){var li=+el.getAttribute('data-law');
   IQ_OPEN=(IQ_VIEW==='list'&&IQ_OPEN===li)?null:li;
   IQ_SEAT=SI[li].b; IQ_ANIM=(IQ_VIEW==='list'&&IQ_OPEN!=null)?{law:li}:null;
   IQ_FOCUS='[data-law="'+li+'"]'; renderIntake();};
  el.onclick=go;
  /* a g is not a button, so Enter and Space are wired by hand */
  if(el.tagName.toLowerCase()==='g')el.onkeydown=function(k){
   if(k.key==='Enter'||k.key===' '){k.preventDefault();go();}};});
 /* a seat tile opens its laws under the map, and pressing the open one puts
    them away. Opening one seat closes the law that was open in another. */
 host.querySelectorAll('[data-seat]').forEach(function(el){el.onclick=function(){
  var b=el.getAttribute('data-seat'), was=iqSeatOpen(CURP);
  if(was===b){IQ_SEAT=''; IQ_OPEN=null; IQ_ANIM=null;}
  else{IQ_SEAT=b; IQ_OPEN=null; IQ_ANIM={seat:b};}
  IQ_FOCUS='[data-seat="'+b+'"]'; renderIntake();};});
 host.querySelectorAll('[data-iqv]').forEach(function(el){el.onclick=function(){
  IQ_VIEW=el.getAttribute('data-iqv'); IQ_FOCUS='[data-iqv="'+IQ_VIEW+'"]'; renderIntake();};});
 /* walks the body order the strip shows, crown to root, not the table order */
 host.querySelectorAll('[data-step]').forEach(function(el){el.onclick=function(){
  var o=iqBodyOrder(), i=o.indexOf(iqInHand(CURP)), d=+el.getAttribute('data-step');
  IQ_OPEN=o[(i+d+o.length)%o.length]; IQ_SEAT=SI[IQ_OPEN].b;
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
 /* THE THREE BLOCKS' ANSWERS. One write through ixSet, which refuses a row or a
    value the product does not have and says so by returning false. It saves and
    reports through the status region like every write that can fail, and the
    answer stays on screen either way, because it is what the person pressed
    and the status line is what says whether it will survive a reload. */
 host.querySelectorAll('[data-ixb]').forEach(function(el){el.onclick=function(){
  var id=el.getAttribute('data-ixb'), k=el.getAttribute('data-ixk'), v=+el.getAttribute('data-v');
  if(!ixSet(CURP,id,k,v)){status('That answer was not recorded.','fail');return;}
  IQ_FOCUS='[data-ixb="'+id+'"][data-ixk="'+k+'"][data-v="'+v+'"]';
  IQ_XPOP=IQ_FOCUS; pSave(); statusSaved(); renderIntake();};});
 host.querySelectorAll('[data-a]').forEach(function(el){el.onclick=function(){
  /* a changed answer is a new reading of that law, so the releases counted
     against the old one stop counting (engine/compute.js, lawAnswered). Even
     when the mean of the three lands on the same number: the person has just
     told us where the law is, and that wins over the model's estimate. */
  var li=Math.floor(+el.dataset.a/3), was=iqGot(CURP,li);
  if(CURP.intake.answers[+el.dataset.a]!==+el.dataset.v)
   lawAnswered(CURP,SI[li].nm);
  CURP.intake.answers[+el.dataset.a]=+el.dataset.v;
  if(!CURP.intake.startedAt)CURP.intake.startedAt=new Date().toISOString();
  IQ_PULSE={li:li,a:+el.dataset.a,fresh:iqGot(CURP,li)>was};
  iqApply(CURP); pSave(); syncLw(); renderIntake(); render();};});
 /* THE NESTED ROWS. Both write the whole host like every other press, and
    both keep their place by the focus rule above. */
 var wb=document.getElementById('iqwho');
 if(wb)wb.onclick=function(){IQ_WHO=!IQ_WHO; IQ_ANIM=IQ_WHO?{who:1}:null; IQ_FOCUS='#iqwho'; renderIntake();};
 var mb=document.getElementById('iqmore');
 if(mb)mb.onclick=function(){IQ_MORE=!IQ_MORE; IQ_ANIM=IQ_MORE?{more:1}:null; IQ_FOCUS='#iqmore'; renderIntake();};
 /* identity writes on change, not on every keystroke, and reports through
    the status region like every other write that can fail. */
 host.querySelectorAll('[data-who]').forEach(function(el){el.onchange=function(){
  /* THE NAME IS READ, so changing it has to repaint what reads it. numerology
     runs off first, middle and last through numFullName, and it prints on
     Summary. Nothing repainted after a name change, so a cleared surname left
     the master number standing on a name that is no longer there. */
  CURP.who[el.dataset.who]=el.value; pSave(); statusSaved();
  renderSpirit&&renderSpirit(); render(); iqWhoRefresh(host);};});
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
  renderSpirit&&renderSpirit(); iqWhoRefresh(host);};});
 /* SEAL. It writes, so it reports through the status region, and claims
    nothing it did not get. It stamps the profile and puts the form away. */
 var sl=document.getElementById('iqseal');
 if(sl)sl.onclick=function(){
  if(!iqSealable(CURP.who)){status('Enter a name or a date of birth first.');return;}
  CURP.who.sealed=new Date().toISOString();
  pSave();
  if(statusSaved()){IQ_WHO=false; IQ_FOCUS='#iqwho'; renderIntake();}
  else{CURP.who.sealed='';}};
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
  /* through profOpen and not a direct CURP assignment, so the device's
     "which one is open" pointer moves with it (profMark, engine/schema.js)
     and a reload finds this profile again instead of falling back to
     PROFILES[0]. */
  if(!profOpen(PROFILES[pi].id)){
   status('Not opened. '+(PROF_ERR||['it was refused']).join('. ')+'.','fail');
   renderIntake();return;}
  IQ_OPEN=null;IQ_SEAT=null;
  syncCh();syncLw();syncSoul();renderIntake();render();};
 var nb=document.getElementById('iqnew');
 if(nb)nb.onclick=function(){var n=prompt('Profile name','Profile '+(PROFILES.length+1));
  if(n){pNew(n);loadProfile(CURP);IQ_OPEN=null;IQ_SEAT=null;syncCh();syncLw();syncSoul();renderIntake();render();}};
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
/* THE ROW AND THE SEAL FOLLOW WHAT IS TYPED, in place. The form is open while
   it is being filled, and rewriting the host on every change would take focus
   from the next field, so the row's rings and the seal button are brought up
   to date without touching the fields. It matters most for the seal: it was
   drawn disabled on a blank profile and stayed disabled after a name was
   typed, because nothing redrew it until some other press did. */
function iqWhoRefresh(host){
 var tmp=document.createElement('div'); tmp.innerHTML=iqWhoHtml(CURP);
 var nb=tmp.querySelector('.iqa-whob'), ob=host.querySelector('.iqa-whob');
 if(nb&&ob)ob.innerHTML=nb.innerHTML;
 var os=host.querySelector('#iqseal'), ns=tmp.querySelector('#iqseal');
 if(!os||!ns)return;
 os.disabled=ns.disabled;
 var sp=host.querySelector('.iq-seal-n');
 if(!ns.disabled&&sp)sp.remove();
 if(ns.disabled&&!sp){sp=document.createElement('span'); sp.className='iq-seal-n';
  sp.textContent='Enter a name or a date of birth first.'; os.parentNode.appendChild(sp);}}
/* TWO DOORS FOCUS THE BIRTH DATE ON THE NEXT FRAME: the worked example's #spgo
   and the root summary's .rs-go. A browser refuses focus on a hidden field
   without a word, and the form is nested now, so the press is caught on the
   way down, before their own handler runs, and the form is opened first. The
   same capture the Avatar keeps for its own doors, and for the same reason. */
function iqDoors(){
 if(IQ_DOORS)return; IQ_DOORS=true;
 document.addEventListener('click',function(e){
  var t=e.target&&e.target.closest&&e.target.closest('#spgo,.rs-go');
  if(t)IQ_WHO=true;},true);}
