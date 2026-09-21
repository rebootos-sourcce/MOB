
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
 var note;
 if(!sd) note='Optional. A four letter type is the ego\u2019s own account of itself, not a reading. '
  +'Giving one puts charge on the nine axes so the field is not empty on the first day. '
  +'Your own answers and your own stories move it from there.';
 else note='Seeded from <b>'+esc(sd.type)+'</b>. <b>'+Math.round(share*100)+'%</b> of what the axes carry is still '
  +'that seed'+(share<=0.25?', so the field is mostly yours now.':share>=0.9?'. Nothing has moved it yet.':'.')
  +' It is charge only. No law, no gate and no domain was written by it, because those are measured.';
 return '<div class="iq-seed"><div class="iq-fields">'+sel
  +'<div class="iq-f" style="grid-column:span 2"><label>&nbsp;</label><p class="iq-why" style="margin:0">'+note+'</p></div>'
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
 var P=[
  ['Asked three ways',false,
   'Each law is asked once where it costs you something, once where nobody would know, '
   +'and once on an ordinary day. The gap between the three is the reading, so answering '
   +'the same law differently is the point rather than a mistake.'],
  ['What a ten means',false,
   'Not what you intend and not what you would like to be true. What you actually do, '
   +'every time, without exception. A nine means you slip about one time in ten, and that '
   +'is a real number this instrument can use.'],
  ['What accuracy looks like',false,
   'Do you go to the gym four days a week like you say. Do you tell the truth to yourself '
   +'as readily as you tell it to other people. Everybody slips, and the slip is what is '
   +'being measured.']];
 return '<div class="iq-acc">'
  +'<div class="iq-accg">'
  +P.map(function(x){return '<div class="iq-accp"><div class="pm-eye'
    +(x[1]?' plain':'')+'">'+x[0]+'</div>'
    +'<p>'+x[2]+'</p></div>';}).join('')
  +'</div>'
  +'<p class="iq-sc-key"><b>0</b> never <span>·</span> <b>5</b> about half the time '
  +'<span>·</span> <b>10</b> every time <span>·</span> '
  +'about fifteen minutes for all of it, in any order. Stop whenever and come back: '
  +'nothing is required and what you have entered is kept.</p>'
  +'<p class="iq-accw">Integrity regulates the nervous system in both directions: held, the '
  +'connection stays open, and dropped, it closes. Your stories weight these answers '
  +'afterwards, so an answer that flatters you gets corrected later by what you write, '
  +'slowly and at a cost. Answering accurately now is cheaper.</p>'
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
 if(w.sex) bits.push({f:'female',m:'male',o:'other'}[w.sex]||w.sex);
 /* WHAT IS MISSING IS SAID OUT LOUD. A rolled up card that hides a blank date
    reads as complete, and the birth chart is then quietly running on nothing.
    The card names the gap and the edit control is right beside it. */
 var gaps=[];
 if(!nm) gaps.push('no name');
 if(!bn.date) gaps.push('no date of birth');
 if(!bn.place) gaps.push('no place of birth');
 if(bn.date&&!bn.time&&!bn.timeUnknown) gaps.push('no time of birth');
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
function iqEnsure(){
 if(!PROFILES.length) PROFILES=pStore();
 if(!PROFILES.length){ pNew('You'); loadProfile(CURP); }
 if(!CURP){ CURP=PROFILES[0]; loadProfile(CURP); }
 return CURP;}
function renderIntake(){
 var host=document.getElementById('iq'); if(!host) return;
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
 if(w.sealed) var h=iqSealedCard(p);
 else var h='<div class="iq-who">'
  +'<div class="pm-eye">Who this is</div>'
  +'<p class="iq-why">Your energetics were fixed at the moment you were cut from your mother. '
  +'Date, time and place are what locate that moment, and nothing else here can be derived from '
  +'memory the way the 63 questions are. Every culture with a psycho spiritual practice read this '
  +'field at a different resolution. Where independent readings overlap, the triangulation is '
  +'pointing at you, and the inversion of that overlap is where you are compressed. '
  +'If you do not know the time, say so. It is not guessed.</p>'
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
  +'</div>'
  +iqSeedBlock(p)
  /* SEAL IS A SAVE THAT ALSO PUTS THE FORM AWAY. It is only offered once there
     is something to state, and it says so rather than sitting there dead. */
  +'<div class="iq-seal-r">'
   +'<button class="btn pri" id="iqseal"'+(iqSealable(w)?'':' disabled')+'>Save and close</button>'
   +'<span class="iq-seal-n">'+(iqSealable(w)
     ?'This rolls up to one line. Edit reopens it.'
     :'Enter a name or a date of birth first.')+'</span>'
  +'</div>'
  +'</div>';
 h+='<div class="iq-top">'
  +'<div class="iq-cq"><b>'+(scored?Math.round(r.CQ):'–')+'</b>'
  +'<span>'+(scored?'CQ from '+scored+' measured':'no law measured yet')+'</span></div>'
  +'<div class="iq-pr"><div class="iq-bar"><i style="width:'+(answered/63*100).toFixed(0)+'%"></i></div>'
  /* WHAT IS LEFT, not what fraction has been done. A count against a total
     reads as a score and this instrument does not score anybody. It is also
     the more useful of the two: the panel asked to see the remainder while
     they were in it, not their progress as a percentage. The bar still carries
     the proportion, because a bar is a length and not a number. */
  +'<div class="iq-pl">'+answered+' answered, <b>'+(63-answered)+' left</b>'
  +' \u00b7 '+scored+' law'+(scored===1?'':'s')+' measured'
  +(scored<21?', '+(21-scored)+' still at the default':'')
  +(scored?' \u00b7 '+r.tier.toLowerCase():'')+'</div></div>'
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
  +'</div></div>';
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
 h+='<div class="iq-grid">';
 IQ_SEATS.forEach(function(bd){
  var col=seatCol(bd), rows='';
  SI.forEach(function(l,li){
   if(l.b!==bd) return;
   var s=sc[l.nm], open=(IQ_OPEN===li), done=!!s;
   var got=[0,1,2].filter(function(t){return p.intake.answers[li*3+t]!=null;}).length;
   /* THE FRAME OF THE CARD IS THE COLOUR OF THE SEAT. Drawn by the owner on a
      screenshot, in his words so a person knows the band they are answering
      while they are answering it. The card carries --c itself rather than
      inheriting it from the group, because an open card is tall enough that
      its group header is off the top of the screen. */
   rows+='<div class="iq-law'+(done?' done':'')+(open?' open':'')
    +'" style="--c:'+col+'">'
    +'<button class="iq-hd" data-law="'+li+'" aria-expanded="'+(open?'true':'false')+'">'
     /* ANY NAMED THING WEARS ITS OWN MARK. Every law carries an icon and this
        header printed a coloured dot, so twenty one distinct things looked like
        seven. The ring is the law's own, in its seat's colour. */
     +'<span class="iq-gl"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+l.ic+'"/></svg></span>'
     +'<span class="iq-nm">'+l.nm+'</span>'
     /* the seat is the group heading now, so repeating it on every row inside
        the group was the same word three times on one screen. */
     +(done?'<span class="iq-sc">'+s.score.toFixed(1)+'</span>'
           /* NEVER A COUNT AGAINST A TOTAL. It read "1 of 3", which is a
              fraction and a fraction is a score. What is left is the useful
              half and carries no verdict. */
           :'<span class="iq-sc todo">'+(got?(3-got)+' left':'unanswered')+'</span>')
    +'</button>';
   if(done&&!open)
    rows+='<div class="iq-find">spread '+s.spread+', '+s.lean+'</div>';
   if(open){
    rows+='<div class="iq-qs">';
    [0,1,2].forEach(function(t){
     var idx=li*3+t, qq=Q[idx], v=p.intake.answers[idx];
     /* THE THREE FRAMINGS SIT SIDE BY SIDE. Stacked, one short question held a
        full column of nine hundred pixels for a scale thirty two high, and the
        gap between the three readings, which is the whole measurement, was
        never on screen at once. Three cards show the gap. */
     rows+='<div class="iq-qc"><div class="iq-qt"><em>'+(IQ_SIDE[qq.side]||qq.side)+'</em>'+esc(qq.q)+'</div>'
      +'<div class="iq-sl">';
     for(var n=0;n<=10;n++)
      rows+='<button class="iq-n'+(v===n?' on':'')+'" data-a="'+idx+'" data-v="'+n+'">'+n+'</button>';
     rows+='</div></div>';});
    if(s)rows+='<div class="iq-find open"><b>'+l.nm+', '+s.score.toFixed(1)+'</b><br>'
     /* joined by a comma, the same as the closed row six lines above. A full
        stop with a lower case clause after it is a broken sentence. */
     +'spread '+s.spread+', '+s.lean+'.</div>';
    rows+='</div>';}
   rows+='</div>';});
  if(!rows) return;
  h+='<section class="iq-seg" style="--c:'+col+'">'
   +'<div class="iq-sh">'
    +'<span class="iq-gl big"><svg viewBox="0 0 24 24" aria-hidden="true">'+(SEATGLYPH[bd]||SEATGLYPH._)+'</svg></span>'
    +'<span class="iq-shn">'+bd+'</span>'
    +'<span class="iq-shd">'+IQ_SEATLINE[bd]+'</span>'
   +'</div>'
   +'<div class="iq-laws">'+rows+'</div></section>';});
 h+='</div>';
 host.innerHTML=h;
 host.querySelectorAll('[data-law]').forEach(function(el){el.onclick=function(){
  IQ_OPEN=(IQ_OPEN===+el.dataset.law)?null:+el.dataset.law; renderIntake();};});
 host.querySelectorAll('[data-a]').forEach(function(el){el.onclick=function(){
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
 host.querySelectorAll('[data-born]').forEach(function(el){el.onchange=function(){
  CURP.who.born[el.dataset.born]=el.value; pSave(); statusSaved(); renderSpirit&&renderSpirit();};});
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

