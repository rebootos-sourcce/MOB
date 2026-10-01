/* ============================================================
   THE STORY PAGE IS THREE COLUMNS NOW, AND THE RIGHT RAIL STEPS ASIDE.

   Round IJ in TASKS.md, his words: "This looks good for the story. Wired in."
   That approves round II's prototype, proto/story-redesign2, and this is the
   port of its layout H, Flow: write, imprints and release side by side, all
   of it above the fold at 1600, and the column a person is working in takes
   the room. H is the one the round II panel favoured on a phone, 67 per cent
   of a thousand reaching the release against 24 on the old page, because it
   is the only layout that kept every control on the first screen. He named no
   other layout when he approved it.

   His two rulings from round HY and IG that it carries: "I want story,
   imprints and release to all be above the fold ... feel free to break that
   right navigation", and the release cut to "your selections, pace, and how
   many patterns ... and this, just, run release button".

   WHAT IS PORTED AND WHAT IS NOT. The read is the prototype's, on the same
   engine calls: parseStory and marksOf for the marks, srcHear and srcTurn for
   Source AI, compute and meterPlan for the release. The instrument is its
   Trace strip chart with Route's line through it and the five sorts. Three
   things of the prototype's are not ported, because each was standing in for
   something the product already has:
     the in panel run, which was a preview that released nothing. Run opens
       the real release card, ui/release.js, which spends and records.
     the vault's page only memory of previews. The vault reads the record's
       own meter, which is what a release actually wrote.
     the flying word chip. The bars rise on their own spring as a word lands,
       which is the same event, drawn once rather than twice.
   ============================================================ */
/* ---- the journal ---- */
function stRender(){
 var h=document.getElementById('story'); if(!h) return;
 var p=ST_PARSED;
 var out='<div class="st-flow" id="stflow" data-focus="'+STV.focus+'">'
  /* ---- the write column: the journal, with Source AI inside it ---- */
  +'<div class="st-colw">'
  +'<div class="st-pan st-jr" id="stjr">'
  /* SPEAK BECAME RECORD, AND IT CARRIES ITS STATE.

     Speak is what you do, record is what the control does, and the ruling
     everywhere else in this product is that a menu word describes exactly
     what the thing does. The dot says which mode you are in without reading
     the label: green while it is recording, red while you are typing.

     THE EYEBROW AND THE LINE UNDER IT ARE GONE, round LO, his words: "I want
     to remove the text saying the day and re remove the recording sends the
     audio to browser. Just get rid of that text." The eyebrow read "The day";
     the box keeps it as its accessible name, which nobody sees and a screen
     reader needs. The line read "Recording sends the audio to your browser's
     speech service. Typing does not leave this device." It was put there
     because that is true and was nowhere else, and it is still true: browser
     speech recognition is a network service and the audio reaches the
     browser vendor. So the fact moved rather than went. It is in the
     button's own tooltip, on the one control that sends the audio anywhere,
     and it is off the page. */
  +'<div class="st-hd">'
   +'<button class="st-mic'+(ST_LISTEN?' on':'')+'" id="stmic" type="button" '
   +'title="'+(ST_LISTEN?'Recording. Press to stop and keep what it heard.'
     :'Record what happened out loud instead of typing it. Recording sends the audio to your browser\'s speech service; typing does not leave this device.')+'">'
   +'<span class="st-dot"></span>'
   +'<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">'
   +'<rect x="9" y="3" width="6" height="11" rx="3"/>'
   +'<path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg>'
   +'<span>'+(ST_LISTEN?'Recording':'Record')+'</span>'
   /* THE CLOCK, ROUND LV. His words: "I want the time showing how long my
      recording is." mm:ss, in the button itself so it reads as one control
      rather than two things to track, and gone the moment recording is,
      never left standing at a number that stopped being true. stFrame ticks
      it every frame it is on screen, see below; this is only its first
      paint, at whatever stmicElapsed() already reads the instant the render
      that shows it runs. */
   +(ST_LISTEN?'<span class="st-mictime" id="stmictime" aria-hidden="true">'
     +stMicFmt(stMicElapsed())+'</span>':'')
   +'</button></div>'
  /* SOURCE AI AND THE JOURNAL'S MENU CHANGED PLACES, round LO, his words: "I
     want you to swap the main journal menu with the source AI question." The
     column read Source AI, then the journal's own top line with Record on it,
     then the box. It reads Record, then Source AI, then the box now, so the
     question sits straight over the place it is answered. Source AI came
     inside the journal's panel to do that, and it wears its own ground, the
     same sunk ground as the box and the chart, because he asked for it to
     read as a display: "right now the source scripted area is on gray ... I
     want it to have its own black background."

     It keeps its id, #stsrc, and its one speaking line, so a screen reader
     still hears only what it says. HT in TASKS.md put it above the journal,
     "above the journal part will be a prompt engine", and it is still above
     the part a person writes in.

     ROUND LV WRAPS IT IN ITS OWN HALO. His words: "I want that location to
     feel like it's alive and innovative... a different nature to it... pull
     elements from the field style... to give this a more animated, alive
     feel." Not the field's canvas, which has no business on a page a person
     is writing in: its aesthetic, see the CSS at .st-glow. The wrapper is
     the only change here; #stsrc keeps its id, its aria-label and its one
     spoken line exactly as they were, so nothing that already reads it has
     to change. It has to be a real element and not a third pseudo on .st-pe,
     because that panel already spends both of its own, ::before and
     ::after, on the passing light and the scan; see the same CSS. */
  +'<div class="st-glow"><div class="st-pe" id="stsrc" aria-label="Source AI"></div></div>'
  /* THE FETTERS LIGHT UP IN THE PERSON'S OWN SENTENCE.

     The sniffer already names every word it is reading and which seat that
     word belongs to, and none of that reached the page: a person watched a
     counter say "14 tagged" with no way to see which fourteen. A textarea
     cannot carry colour, so the highlight is a layer behind it holding the
     same text at the same metrics, and the textarea's own text is
     transparent with only its caret showing. */
  +'<div class="st-ed"><div class="st-hl" id="sthl" aria-hidden="true"></div>'
  +'<textarea id="sttext" class="st-ta" spellcheck="false" aria-label="The day" '
  +'placeholder="What happened. Write it the way you would say it out loud.">'+esc(ST_TEXT)+'</textarea></div>'
  /* THE COUNTER UNDER THE JOURNAL IS GONE. Round HS, his words: "under the
     left window it says two words zero tag get rid of that so it's never
     there" It read "2 words, 0 tagged". The word count is a number nobody
     acts on, and what the sniffer tagged is already shown twice: lit in the
     sentence itself, and counted on the Commit button beside it. Reproduced
     before it was cut, on the blank profile, by typing two words. The spacer
     keeps the two buttons at the right edge where the counter pushed them.
     The prototype this page is ported from put a word count back here, and
     it stays out: the ruling is his and names this exact place. */
  +'<div class="st-bar">'
   +'<span class="st-ct" aria-hidden="true"></span>'
   +'<button class="btn" id="stclear">Clear</button>'
   +'<button class="btn pri" id="stapply"'+(p&&p.imprints.length?'':' disabled')+'>'
    +'Commit '+(p?p.imprints.length:0)+'</button>'
  +'</div></div></div>'
  /* ---- the read column: the instrument over the list ---- */
  +'<div class="st-colr">'
  +'<div class="st-pan st-ch" id="stch" aria-label="Imprints, as read">'
   +'<div class="st-chd"><span class="st-eb">Imprints</span><span class="st-tag" id="stpend"></span>'
   /* THE BANK AND THE VAULT, round IG, his words: "We need to be able to see
      the bank as an icon, which goes to the main imprints page. And the
      vault, which is what's been released." Both were icons with their word
      beside them at 1600 and the icon alone on a phone. Round LO took the
      word off at every width, his words: "for the bank and the vault, I just
      want their icons only, not the text." The word is still in the button,
      clipped the way a folded tab's name is, so a screen reader still hears
      Bank and Vault; .st-lb in the shell does it. The vault keeps its count,
      which is a figure and not a label, as it always has on a phone. He also
      asked for the two to swap places and withdrew it in the same breath,
      "actually, never mind", so they stand where they stood. */
   +'<button type="button" class="st-ico" id="stbank" aria-pressed="'+STV.bank+'" '
    +'title="The bank: every imprint you hold, on the Imprints page">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5L12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20.5h18"/></svg>'
    +'<span class="st-lb">Bank</span></button>'
   +'<button type="button" class="st-ico" id="stvault" aria-pressed="'+(STV.list==='vault')+'" '
    +'title="The vault: what you have released">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5h16v14H4zM7 18.5v2M17 18.5v2"/>'
    +'<circle cx="12" cy="11.5" r="3.6"/><path d="M12 7.9v1.2M12 13.9v1.2"/></svg>'
    +'<span class="st-lb">Vault</span><b id="stvn">0</b></button>'
   +'<button type="button" class="btn st-open" id="stlist">List</button></div>'
   +'<div class="st-sort" id="stsort" role="group" aria-label="Sort imprints by"></div>'
   /* the key probe is never shown. The canvas cannot read a custom property,
      so the chart reads the lighting's ink and dim off these two computed
      colours, which is the one answer that follows every lighting. */
   +'<div class="st-cvw" id="stcvw"><canvas id="stcv" aria-hidden="true"></canvas><i class="st-cvk"></i></div>'
   /* THE VIEW TOGGLE SITS ON THE CHART'S OWN CAPTION LINE, under the drawing
      it changes. It was first put at the end of the sort row, and measured
      there it opened a line of its own whenever the journal had the room:
      the chart lost 48 of its 273 pixels at 1600 by 1000, and at 1280 by 800
      it reached its 120 pixel floor and this caption ran 9 pixels past the
      panel's edge. Here it costs the chart 23 pixels at every width and
      overflows nothing at 1280 by 800. The words wrap beside it rather than
      being cut, so the count is whole on a phone.
      THE ROW IS AN INNER WRAPPER, NOT THE LINE ITSELF. Set on #stctr, the
      inline display beat the stacked rule that hides this line until the
      imprints are touched, and at 390 by 844 the caption came back on the
      arrival screen and pushed Run to the bottom edge, which is the one
      thing layout H exists to stop. The class keeps the say over whether the
      line shows; the wrapper only lays it out. */
   +'<div class="st-ctr" id="stctr"><div style="display:flex;align-items:center;gap:8px">'
   +'<span id="stctrt" style="flex:1 1 0;min-width:0"></span>'+stViewHtml()+'</div></div></div>'
  +'<div class="st-pan st-ls" id="stls" aria-label="Imprints, listed">'
   +'<div class="st-lshd" id="stlshd"></div><div class="st-lsb" id="stimps"></div></div>'
  +'</div>'
  /* ---- the release column. It keeps the id its rail section had. The
     analytics preview is last in it, closed, see stAnaHtml. ---- */
  +'<div class="st-colx"><div class="st-rl" id="strel" aria-label="Release"></div>'+stAnaHtml()+'</div>'
  +'</div>'
  /* WHAT A SCREEN READER HEARS IS WHAT SOURCE AI SAYS, ONCE. The column is
     rewritten on every keystroke, so a live column would read itself aloud
     at every letter. One hidden line carries only the question, the "Cool."
     or the opener, and srcPaint writes it only when it changes. */
  +'<p class="src-say" id="srcsay" aria-live="polite"></p>';
 h.innerHTML=out;
 /* THE LANES AND THE BARS OUTLIVE A RENDER. This emptied both, so every
    arrival at the tab and every redraw of the page faded all seven lanes in
    and grew every bar again from the floor: motion that said a word had
    landed when none had. It also cost frames: measured in the design gate's
    Chromium under Glass white, 23 frames in 1.2 seconds with the chart
    replaying against 36 with it still, which left the lighting's own
    transition half done when the gate read it. Only what is new moves now. */
 STC.cv=null; STC.dirty=true;
 /* MEASURED BEFORE ANYTHING IS LAID OUT ON IT. setTab shows the host before
    it calls this, so the canvas has its size the moment it exists. Left to
    the resize observer, the first layout ran at a height of nought and every
    lane sprang in from above the chart on each arrival at the tab. */
 stSize();
 stRead(); stSortPaint();
 var ta=document.getElementById('sttext');
 if(ta){ta.oninput=function(){ ST_TEXT=ta.value;
  ST_PARSED=ST_TEXT.trim()?parseStory(ST_TEXT):null; stRefresh(); };
  /* the layer behind has to travel with the text, or a long entry drifts
     out of register the moment the box scrolls. */
  ta.onscroll=function(){var hl=document.getElementById('sthl');
   if(hl){hl.scrollTop=ta.scrollTop;hl.scrollLeft=ta.scrollLeft;}};
  ta.onfocus=function(){stFocus('write');};}
 stPaintHL();
 stPaintAll();
 stWire();
 stAnaWire();
 var cl=document.getElementById('stclear');
 if(cl)cl.onclick=function(){ST_TEXT='';ST_PARSED=null;SRC_PASSED=false;srcFresh();stRender();};
 var ap=document.getElementById('stapply');
 if(ap)ap.onclick=stCommit;
 var mic=document.getElementById('stmic');
 if(mic)mic.onclick=stMic;}

/* ============================================================
   THE PAGE'S OWN STATE. None of it is a reading: which way the lanes are
   sorted, which column has the room, which list is up, and whether the bank
   is open. Kept across a return to the tab, never saved.
   ============================================================ */
var STV={sort:'seat',focus:'write',list:'entry',bank:false,lastFound:[],hot:null,view:'lanes',ana:false};
/* the one width the page changes shape at is the one the product stacks its
   columns at, so the Story cannot be in three columns while the rails are
   already one. */
function stPhone(){return typeof innerWidth==='number'&&innerWidth<=1180;}
function stFocus(f){
 if(STV.focus===f)return; STV.focus=f;
 var fl=document.getElementById('stflow'); if(fl)fl.setAttribute('data-focus',f);}
function stWire(){
 var on=function(id,ev,fn){var e=document.getElementById(id); if(e)e.addEventListener(ev,fn);};
 /* FOCUS FOLLOWS THE LOOP, layout H. Typing is write, touching the imprints
    is read, touching the release is release. Every column stays on screen;
    the one being worked in takes the room. Run itself is excluded, because
    widening the panel under a press moves the button the finger is on.

    ON CLICK, NOT ON POINTERDOWN, which is where the prototype had it. Stacked,
    a focus change reflows the column: the journal shrinks and everything
    under it rises. Changed on pointerdown, the Vault moved up between the
    press and the release and the click landed on the chart instead, measured
    at 390 by 844: Vault pressed, the list stayed on the entry. A click
    bubbles here after the button has already acted. */
 on('stch','click',function(){stFocus('read');});
 on('stls','click',function(){stFocus('read');});
 on('strel','click',function(e){if(!(e.target&&e.target.closest&&e.target.closest('#strun')))stFocus('release');});
 on('stlist','click',function(){stFocus('read');});
 on('stbank','click',stBank);
 /* the press bubbles on to #stch, which gives the imprints column the room */
 document.querySelectorAll('#stctr [data-view]').forEach(function(b){
  b.addEventListener('click',function(){stView(b.getAttribute('data-view'));});});
 on('stvault','click',function(){
  STV.list=STV.list==='vault'?'entry':'vault';
  this.setAttribute('aria-pressed',STV.list==='vault');
  stFocus('read'); stListPaint();});
 var cv=document.getElementById('stcv');
 if(cv){
  /* the hover reads the sorted lanes' rows, which only the Lanes view draws.
     Over the Ring or the Strip the same height is a different seat, so it
     would light the wrong group in the list. */
  cv.addEventListener('pointermove',function(e){if(STV.view!=='lanes'){stHot(null);return;}
   var r=cv.getBoundingClientRect(),y=e.clientY-r.top,k=null;
   STC.lm.lanes.forEach(function(l){var o=STC.lane[l.key];if(o&&l.active&&y>=o.y&&y<o.y+o.h)k=l.key;});stHot(k);});
  cv.addEventListener('pointerleave',function(){stHot(null);});}
 var w=document.getElementById('stcvw');
 if(w&&typeof ResizeObserver==='function'){
  if(STC.ro)STC.ro.disconnect();
  STC.ro=new ResizeObserver(function(){stSize();stRelayout();});
  STC.ro.observe(w);}}

/* ============================================================
   THE BANK OPENS THE IMPRINTS PAGE, and the Imprints page is the one this
   product already has: impRender's record in #imp, every imprint held, the
   five groupings, the child patterns, and the pills a person selects to
   release. It lives in the right rail's Imprints section, where it has been
   since GO, beside Selection, where its Detail opens a drill. On the Story
   that rail steps aside so the three columns get its width, and the bank
   brings it back.

   WHAT IS PICKED THERE IS WHAT THE RELEASE RUNS. His words, round IG: "In
   that imprints I can select what I want to be released and then I've got
   my settings for release, then I can run release." So a pill pressed in the
   bank feeds the release column directly, see stRelModel.
   ============================================================ */
function stBank(){
 STV.bank=!STV.bank;
 document.body.classList.toggle('st-bank',STV.bank);
 var b=document.getElementById('stbank'); if(b)b.setAttribute('aria-pressed',STV.bank);
 if(STV.bank){
  if(typeof OPENSEC==='object'&&OPENSEC&&OPENSEC.right)OPENSEC.right.simp=1;
  if(typeof paintSections==='function')paintSections();
  impRender();
  /* stacked, the rail sits under the whole surface, so the bank is taken to
     rather than left for a person to find four screens down */
  var sec=document.querySelector('.lsec[data-sec="simp"]');
  if(sec&&stPhone()&&sec.scrollIntoView)sec.scrollIntoView({block:'start'});}
 stFocus('read');}

/* ============================================================
   THE ONE READ. Every surface on this page reads the same marks off the
   same text, so the sentence, the chart and the list cannot disagree about
   which words were scored.

   A NEGATED WORD IS SHOWN AS SET ASIDE. "I was not scared" is heard by
   Source AI as negated, srcNegated, and parseStory still charges it. The two
   halves of the engine disagree and round HX chose to show that rather than
   pick a side for him: the mark runs back over the negator and is struck,
   the bar is dashed, and the list says which words were the only ones.
   ============================================================ */
var STR={t:null,marks:[],toks:[],heard:null};
function stMarks(t,p){
 if(!p||!p.hits||!p.hits.length||typeof marksOf!=='function')return [];
 var marks=marksOf(t,p), nm=normMap(t), negAt={}, modAt={};
 p.path.steps.forEach(function(s){if(!s.seat||s.coherent)return;
  if(srcNegated(nm.s,s.at)){var a=nm.map[s.at+1];if(a!=null)negAt[a]=1;}});
 p.hits.forEach(function(h){if(!h.mod)return;var a=nm.map[h.at+1];if(a!=null)modAt[a]={f:h.mod,w:h.modw};});
 var toks=[],re=/[A-Za-z']+/g,m; while((m=re.exec(t)))toks.push({s:m.index,e:m.index+m[0].length,w:m[0]});
 var seen={};
 marks.forEach(function(k){
  k.txt=t.slice(k.s,k.e); k.neg=!!negAt[k.s]; k.mod=modAt[k.s]||null;
  var base=(k.bn||'coh')+':'+k.txt.toLowerCase(); seen[base]=(seen[base]||0)+1; k.key=base+':'+seen[base];
  k.depth=k.amt!=null?Math.min(1,Math.abs(k.amt)/PATHMAX):0.3;
  k.t0=-1; k.t1=-1;
  toks.forEach(function(o,j){if(o.s>=k.s&&o.e<=k.e){if(k.t0<0)k.t0=j;k.t1=j;o.m=k;}});
  /* the negator, found the way srcNegated finds it: within SRC_NEG_W words */
  if(k.neg)for(var q=1;q<=SRC_NEG_W;q++){var d=toks[k.t0-q];
   if(d&&SRC_NEG.indexOf(d.w.toLowerCase().replace(/'/g,''))>=0)k.negFrom=d.s;}});
 marks.toks=toks;
 return marks;}
function stRead(){
 var t=ST_TEXT, ents=(CURP&&CURP.story&&CURP.story.entries)||[];
 var marks=stMarks(t,ST_PARSED);
 STR={t:t,marks:marks,toks:marks.toks||(t?(t.match(/[A-Za-z']+/g)||[]).map(function(w){return {w:w};}):[]),
  heard:srcHear(t,srcPrior(ents))};}
/* the addresses this entry reaches, or the last committed entry's */
function stFound(){
 var found=[];
 if(ST_PARSED)ST_PARSED.imprints.forEach(function(im){var n=BY[im.node];if(n&&n.cf&&found.indexOf(n)<0)found.push(n);});
 return found.length?found:STV.lastFound;}

/* THE REAL COMMIT, FACTORED OUT OF THE APPLY BUTTON'S OWN ONCLICK, round NF,
   so the Day One Tutorial can write a person's first entry through the exact
   same path the Story tab's own button uses rather than a second copy of it.
   Two writers for one commit is the same mistake setTab's own history
   warns against, a thing read in one table and written from two; this is one
   function, called from both. Returns what happened rather than only acting,
   so a caller that is not the button itself (the tutorial) can act on a real
   result instead of re-deriving it. */
function stCommit(){
 if(!ST_PARSED||!ST_PARSED.imprints.length)return {ok:false,why:'empty'};
 /* AND A STORY CANNOT BE COMMITTED ONTO A WORKED EXAMPLE, for the same reason
    the release cannot be run on one: the words are the person's and the field
    is not. This wrote the charge onto the case's field, pushed the entry onto
    the case's record, and then called toYou() on the last line, which moves
    the pointer to the person's own record. So the entry landed in a record the
    person does not own, the charge landed on a field they were about to leave,
    and the undo for it stayed with the example. While the persona loader was
    pushing its scratch profiles onto PROFILES that entry was then written into
    the person's own store, which is the leak ui/personas.js now refuses; with
    that closed the same press would keep nothing at all and say nothing about
    it. Refusing is the version that is true, and it is the wording the release
    already uses for the same crossing. That wording is one line since BA9, 25
    September: he struck the long form above the Field, and the state it
    carried is on the profile picker now. */
 if(typeof S!=='undefined'&&S.who!==0){
  status('Nothing committed on a worked example.','fail');
  return {ok:false,why:'example'};}
 /* the field is about to change and until now there was no way back */
 undoPush('committing the story');
 /* WHAT THIS ENTRY FOUND IS KEPT FOR THE RELEASE, because the chain he ruled
    is journal, imprint, release. The box empties on commit, so without this
    the release would fall back to the heaviest held the moment the entry it
    was offering left the page. Read before applyStory moves the field. */
 var kept=stFound(), k=ST_PARSED.imprints.length, bands=ST_PARSED.bands;
 applyStory(ST_TEXT); verpApply(ST_TEXT); leanApply(ST_TEXT);
 /* THE CHARGE HAS TO REACH THE MIRROR, OR THE NEXT VISIT TAKES IT BACK OUT.
    applyStory writes S and pSave writes the record, and neither writes
    PEOPLE[0], which is the table loadP(0) reads the person's field back out
    of. This was the one write of charge in the product that skipped saveYou.
    Measured: 7.24 units committed and on disk, a visit to James and back
    through the picker read 0.00 out of the stale mirror, saveProfile put 0.00
    on the record, and the next ordinary save wrote 0.00 over the disk. The
    entry text survived and the charge it wrote did not. S.who is 0 here, the
    guard above sees to it, so this mirrors and writes the way every slider
    does. */
 saveYou();
 if(CURP){CURP.story=CURP.story||{entries:[]};
  CURP.story.entries.push({t:new Date().toISOString(),text:ST_TEXT,
   imprints:ST_PARSED.imprints.length,bands:ST_PARSED.bands});
  pSave();pSnap();}
 /* a new entry is a new conversation, so moving on from the last one does
    not silence the next. */
 var text=ST_TEXT;
 ST_TEXT='';ST_PARSED=null;SRC_PASSED=false;if(typeof srcFresh==='function')srcFresh();STV.lastFound=kept;
 /* the release takes the room on a desktop. On a phone it stays the bar
    with Run on it: widening it there would push Run off the first screen,
    which is the one thing layout H exists to stop. */
 STV.focus=stPhone()?'write':'release';
 toYou();syncCh();if(typeof stRender==='function')stRender();render();
 status('Committed. '+k+(k===1?' imprint':' imprints')+' written to the field.');
 return {ok:true,k:k,kept:kept,bands:bands,text:text};}

/* refresh only what the text moves, so typing never loses the caret */
function stRefresh(){
 var keep=document.getElementById('sttext'), pos=keep?keep.selectionStart:0;
 /* the counter is gone, see stRender: nothing is written into .st-ct */
 var ap=document.getElementById('stapply');
 if(ap){ap.disabled=!(ST_PARSED&&ST_PARSED.imprints.length);
  ap.textContent='Commit '+(ST_PARSED?ST_PARSED.imprints.length:0);}
 stRead();
 stFocus('write');
 /* the highlight is refreshed with the count, not with the whole surface,
    because stRefresh exists so typing never loses the caret. */
 stPaintHL();
 stPaintAll();
 if(keep){keep.focus(); try{keep.setSelectionRange(pos,pos);}catch(e){}}}
/* everything below the sentence, off the one read */
function stPaintAll(){
 STC.sync(); stRelayout();
 srcPaint(); stPendPaint(); stCtrPaint(); stListPaint(); stVaultCount(); stRelPanel();
 impRender();}
/* THE FIELD MOVED UNDER THE PAGE. render() calls this on the Story, because
   a release that finishes, an undo, or a profile change all change what is
   held, what the release column offers and what the vault holds, and none of
   them passes through this file. Without it the vault read 0 after a run
   until the tab was left and entered again. */
function stFieldPaint(){
 if(!document.getElementById('stflow'))return;
 /* a lighting change arrives here too, and the chart's ink is read off it.
    Only then: reading it forces a style flush, and render() runs on every
    slider step. */
 if(STC.cv&&STC.lit!==S.theme){STC.lit=S.theme; stInk(); STC.dirty=true;}
 stVaultCount(); stRelPanel();
 if(STV.list==='vault')stListPaint();
 /* a release moves what is running hot, so an open preview is repainted with
    it. The windows are cached on the record, so this is one pass over the 112. */
 if(STV.ana)stAnaPaint();
 /* the bank only while it is open. Closed, its rail is not drawn, and
    stBank repaints it on the way in, so nothing stale is ever on screen.
    Repainting it here on every render() was measured doubling the work a
    lighting change does on this tab. */
 if(STV.bank)impRender();}

/* ============================================================
   SOURCE AI, THE SPEAKING HALF. The listening half is engine/sourceai.js
   and the whole behaviour is written down in reviews/SPEC-source-ai.md.

   Scripted. No model is called: every line below is chosen by srcTurn off a
   count the person can check in their own words. It said so on screen, a
   small "scripted" beside its name, until round LO, his words: "Remove the
   text that says scripted." The fact is unchanged and is still written down
   in the spec above; only the label is off the page.

   Four moves, and the person decides which one it makes:
     open    the opening question, which a press turns to another one
     listen  it has heard something and asks nothing. The seat nearest a
             question and its rung show as a gauge; the words it heard are
             on the chart beside it, in the lanes they landed in.
     ask     one why question, about one seat, at seven or over
     pass    the person pressed Move on. "Cool." Nothing more is asked in
             this entry, however much more it hears. His words: "it's their
             job to lead ... if they want to move on, source's job isn't to
             dig deeper, it's just to go cool."

   What it may say is narrow on purpose. A place in the body, how often the
   story comes back to it, and the person's own words. Never an address, a
   fetter or a saboteur, because those are definitions and the ruling is that
   it discerns the energy and does not define it. Never a because about the
   person, since nothing the instrument measures is a cause. It asks why and
   the person answers, which is how the root gets found by the person who
   carries it.

   ONE BECAUSE IS ALLOWED, AND IT IS ABOUT THE BODY, NOT THE PERSON. Ruled 27
   September, his words: "Source AI also needs to add a why, right? Why you're
   releasing this. This is the most important part ... The stress response is
   impairing the nerve flow. While the story happened, the resistance is
   blocking the flow. So to bring you back to stasis and the baseline, all
   stories must go." That is a why of release, the mechanism the product
   already states as its definition of Charge, and it says nothing about why
   the person is the way they are. So the rule above still holds for the root:
   Source AI never answers the why it asks. See srcWhy below.

   THE HEARD ROWS WENT TO THE CHART. They printed each seat, the words heard
   there and the rung, which is exactly what a lane of the instrument now
   draws: the name, the words standing on it, and the ten pips at its right.
   Printing both would be the same reading in two places to disagree.
   ============================================================ */
var SRC_PASSED=false;
/* THE OPENER IS HIS SECOND WORDING, AND IT USES THE NAME. It was "What are
   we writing about today?", one of the two he offered at round GO. Round JS
   replaced it in his own words: "That's not quite what I want you to use. We
   need to invite them to writing. We first need to welcome them with their
   name. Hello, Lance. What would you like to write about today? Or would you
   like me to offer some suggestions?" Recorded in DECISIONS.md as ruled and
   not built. Built at round LT, where he asked for the questions to read like
   "a friend who knows me very well".

   The name is the first name the person entered on the intake, who.first,
   and nothing else: a profile called Custom is not greeted as Custom, and a
   worked example is not greeted by a case name. No name, no greeting, and the
   question stands alone.

   HIS LAST SENTENCE IS NOT PRINTED, AND THAT IS A CHOICE FOR HIM TO OVERRULE.
   "Or would you like me to offer some suggestions?" is a yes or no with no
   yes and no on the screen. The two buttons beside the question are the
   offer: one turns to another question, one builds one from what the person
   wrote. The sentence would describe the buttons next to the buttons. */
var SRC_OPEN='What would you like to write about today?';
function srcOpen(){
 var w=(typeof CURP!=='undefined'&&CURP&&CURP.who)||{};
 var f=String(w.first||'').trim().split(/\s+/)[0];
 return (f?'Hello, '+f+'. ':'')+SRC_OPEN;}
/* SIMPLE, STRAIGHTFORWARD, DEEP. His three words for what the page should
   ask. Each is a physical event a person can answer from memory, the shape
   funnel/questions.js already proved works in this product, and none of them
   names a feeling for the person. One at a time, turned by the day, so the
   page does not become furniture.

   THEY WERE A SECOND LINE UNDER THE OPENER, AND THEY ARE THE OPENER'S NEXT
   QUESTIONS NOW. Round LO, his words: "have source AI question have a button
   to generate new questions ... Remove the text that says or start from
   where did you feel it first." That line was "Or start from" and one of
   these, picked by the day, and on the day he read it the day picked "Where
   did you feel it first?". The line is gone and the list is what the button
   walks. The opener is still his own sentence and still comes first; the
   first press lands on the day's question, which keeps the turn by the day,
   and each press after it is the next one round. SRC_QI is where the walk
   is, and below nought means the opener. It is not reset by Clear or by a
   new entry, because the question a person chose is theirs until they press
   again.

   REWRITTEN AT ROUND LT, his words: "these are horrible questions, they're
   not deep personal questions, they make it feel like a person, a friend who
   knows me very well is asking me a personal question." The six they replace:

     What happened today that your body is still holding?
     Where did you feel it first?
     What did you not say?
     Who was in the room?
     What keeps coming back?
     What did you do straight after?

   Each of those was a physical event, which was right, and each was asked
   from outside the room, which was the defect: a form asks "who was in the
   room", a friend asks who got under your skin. The rule kept from the old
   list is that no question names a feeling for the person. What changed is
   that each one now assumes the thing a close friend already knows about
   you: that you swallow things, that your shoulders go up, that you replay
   the conversation, that you reach for something after. Warmth here is the
   specific question, never a soft word. Eight rather than six, so the walk
   takes longer to come round. */
var SRC_QI=-1;
function srcQuestion(){
 if(SRC_DQ)return SRC_DQ;
 return SRC_QI<0?srcOpen():SRC_JOG[SRC_QI%SRC_JOG.length];}
function srcNextQ(){
 SRC_DQ='';
 SRC_QI=SRC_QI<0?Math.floor(Date.now()/864e5)%SRC_JOG.length:(SRC_QI+1)%SRC_JOG.length;
 return srcQuestion();}
var SRC_JOG=['Who got under your skin today?',
 'When did your shoulders go up today?',
 'What did you swallow instead of saying?',
 'What did your stomach know before you did?',
 'What conversation are you still having in your head?',
 'Who did you make yourself small for?',
 'What did you reach for today to take the edge off?',
 'What have you not told anyone yet?'];
function srcSeatSay(b){
 return b==='Solar'?'the solar plexus':(b==='3rd Eye'?'the third eye':'the '+String(b).toLowerCase());}
function srcTimes(n){return n===1?'once':(n===2?'twice':(n===3?'three times':n+' times'));}
/* the one question, by the evidence that raised it, and about a place rather
   than a label.

   REWRITTEN AT ROUND LT, with the same three cases and the same evidence.
   They read, with the heart as the seat:

     root     You keep coming back to the heart, here and in what you wrote
              before. Why do you think that is?
     earlier  The heart was in an earlier entry too. Why do you think it
              comes back?
     again    The heart comes up three times in this. Why do you think it
              keeps landing there?

   Two things moved. The person's own words come back to them in quotes,
   heard.top.words, which srcHear has already cleared of negated mentions:
   a friend who knows you says "you wrote tight", and a form says "the throat
   comes up". And the seat is said as the place it is, the same phrase the Why
   line under it uses, SRC_WHY_AT, "in your throat" and not "the throat".
   "Why do you think" went, because it is a hedge on a question: the question
   is still a why, and the person still answers it. Nothing here says a cause.
   The root case asks what is at the bottom of it, which is the root in a
   physical picture, and it is only asked when the rung is ten. */
function srcPlace(b){return SRC_WHY_AT[b]||('at '+srcSeatSay(b));}
function srcQuote(ws){
 return (ws||[]).slice(0,2).map(function(w){return '“'+w+'”';}).join(' and ');}
function srcAsk(t,words){
 var at=srcPlace(t.band), ws=(words||[]).slice(0,2), q=srcQuote(ws);
 var said=q?'You wrote '+q+'. ':'';
 if(t.why==='root')
  return said+'Here and in what you wrote before, it lands '+at+'. What sits at the bottom of it?';
 if(t.why==='earlier')
  return said+'It lands '+at+', and an earlier entry did too. What takes you back there?';
 if(ws.length>1)return said+'Both land '+at+'. Why there?';
 return (q?'You wrote '+q+' '+srcTimes(t.mentions)+'. ':'')+'It lands '+at+(q?' each time':' '+srcTimes(t.mentions))+'. Why there?';}

/* A QUESTION FROM WHAT YOU WROTE. Round LT, his words: "Then you need to be
   another button next to it that makes it dynamic." He did not say what
   dynamic does, so this is one reading of it, and the report that shipped it
   says so. The other button walks a fixed list. This one reads the person:

     1  what they are writing now. Every seat srcHear heard in this entry,
        with the person's own words for it, one seat per press, heaviest rung
        first, and one of four questions about the moment it happened.
     2  nothing heard yet, so what they wrote before. The seat keys their
        committed entries stored, srcPrior, the only thing Source AI may read
        from an earlier entry. Never the text.
     3  nothing on either. It says so, and asks nothing.

   WHAT IT IS NOT, SAID PLAINLY. It is not a model and it generates nothing.
   It picks a seat and a word the engine already read and puts them into one
   of a handful of written questions. What makes it personal is that the words
   are the person's and the place is where their own story landed, which is
   every claim the instrument can make and no more. */
var SRC_DQ='', SRC_DN=0, SRC_DW='';
/* a new entry is a new conversation: the built question quoted the last one */
function srcFresh(){SRC_DQ='';SRC_DW='';SRC_DN=0;SRC_DNONE=false;}
var SRC_DYN=[
 function(w,at){return 'You wrote '+w+'. It lands '+at+'. What happened in the minute before?';},
 function(w){return 'You wrote '+w+'. Who was there when it started?';},
 function(w){return 'You wrote '+w+'. What did your body want to do right then?';},
 function(w){return 'You wrote '+w+'. What did you do straight after?';}];
function srcDyn(heard,entries){
 var n=SRC_DN++, seats=((heard&&heard.seats)||[]).filter(function(s){return s.words&&s.words.length;});
 if(seats.length){
  var s=seats[n%seats.length], lap=Math.floor(n/seats.length);
  SRC_DW=s.words[lap%s.words.length];
  return SRC_DYN[lap%SRC_DYN.length]('“'+SRC_DW+'”',srcPlace(s.band));}
 SRC_DW='';
 var ents=entries||[], pr=srcPrior(ents);
 var ks=Object.keys(pr).sort(function(a,b){return pr[b]-pr[a]||(a<b?-1:1);});
 if(!ks.length)return '';
 /* the last entry's heaviest seat, then the seats most often landed on */
 var last=(ents[ents.length-1]||{}).bands||{};
 var lk=Object.keys(last).filter(function(k){return K2BAND[k]&&last[k]>0;})
  .sort(function(a,b){return last[b]-last[a]||(a<b?-1:1);})[0];
 var turn=[];
 if(lk)turn.push(function(){return 'Last time, what you wrote landed '+srcPlace(K2BAND[lk])+'. What has moved since?';});
 ks.forEach(function(k){if(pr[k]<2&&turn.length)return;
  turn.push(function(){return 'What you write has landed '+srcPlace(K2BAND[k])+' '+srcTimes(pr[k])+(pr[k]>1?' now':'')+'. Is it back today?';});});
 return turn[n%turn.length]();}
/* WHY RELEASE IT. His dictation, translated to the ten year old rule (V21):

     his        The stress response is impairing the nerve flow. While the
                story happened, the resistance is blocking the flow. So to
                bring you back to stasis and the baseline, all stories must go.
     shipped    The stress from this story is stuck in the nerves behind your
                stomach. They rest again once every story stuck there is
                released.

   stress response and resistance become the stress, stuck, which is the
   shipped Charge definition's own word ("It gets stuck when a stress reaction
   starts and never gets to finish"). Impairing the nerve flow becomes stuck in
   the nerves at a named place. Stasis and the baseline become rest. All
   stories must go becomes every story released. It was "gone" in the first
   cut, and read as a bereaved person it said the father goes, where a release
   takes the charge and leaves the memory: ruling GS, "a release empties a
   story from the body". Released is also the word on the button.

   GROUNDED IN TWO FIELDS, AND NO OTHER. The seat is heard.seats[].band, which
   srcHear has already cleared of negated mentions, so "I was not angry" never
   earns a why. The place is that seat's nerve bundle in APC, the pattern
   catalog: each phrase below is taken from the APC entry's own d, which
   describes the nv it names, so the words say where that bundle sits and not
   what it is called. The nerve names themselves stay off this line: "celiac
   plexus" fails the ten year old test, and a single address's nerve would be
   read off a fallback most of the time (parseStory marks those inferred),
   which is the precision the place cannot fake. A seat APC does not carry is
   not spoken about. At most two seats, heaviest rung first, because one or two
   sentences is the length and the chart beside it already shows every lane. */
var SRC_WHY_AT={'Root':'at the base of your spine','Sacral':'low in your belly',
 'Solar':'behind your stomach','Heart':'around your heart','Throat':'in your throat',
 '3rd Eye':'behind your eyes','Crown':'at the top of your head'};
function srcWhy(heard){
 var at=((heard&&heard.seats)||[]).filter(function(s){
  return SRC_WHY_AT[s.band]&&APC.some(function(a){return a.b===s.band;});})
  .slice(0,2).map(function(s){return SRC_WHY_AT[s.band];});
 if(!at.length)return '';
 return 'The stress from this story is stuck in the nerves '+at.join(' and ')+'.'
  +' They rest again once every story stuck there is released.';}
/* ten marks, filled to the rung, the last four drawn as the end it asks at.
   Drawn and never printed, because a reading is not a score. */
function srcPips(rung,col){
 var s='<span class="src-pips" aria-hidden="true" style="--c:'+col+'">';
 for(var i=1;i<=10;i++)s+='<i class="'+(i<=rung?'on':'')+(i>=SRC_ASK?' ask':'')+'"></i>';
 return s+'</span>';}
function srcPaint(){
 var h=document.getElementById('stsrc'); if(!h)return;
 var heard=STR.heard||srcHear(ST_TEXT,null);
 /* a built question that quotes a word the person has since deleted is no
    longer true, so it goes and the walk's own question comes back */
 if(SRC_DQ&&SRC_DW&&ST_TEXT.indexOf(SRC_DW)<0){SRC_DQ='';SRC_DW='';}
 var turn=srcTurn(heard,{typed:!!ST_TEXT.trim(),passed:SRC_PASSED});
 /* THE LIVE MARK. A dot beside the name that breathes while Source AI is
    idle and holds lit while it is reading, see srcHearing. It is drawn and
    carries no word, because "thinking" printed on a scripted reader would be
    a claim, and the dot only says what is true: it reads on every key. */
 var o='<div class="src-hd"><span class="src-live" aria-hidden="true"></span><span class="pm-eye">Source AI</span></div>';
 var ask=turn.move==='ask'?srcAsk(turn,heard.top&&heard.top.words):'';
 /* THE QUESTION, AND THE TWO PRESSES THAT CHANGE IT, ON THE RIGHT. Round LT,
    his words: "The cycle a new question needs to go on the right hand side.
    Then you need to be another button next to it that makes it dynamic."
    The turn arrow sat straight after the question's own measure, 44
    characters, so on a panel wider than that it stood in the middle of the
    line: measured on the build before this one at 1920 by 1080, the panel ran
    114 to 962 and the button stood at 754. The pair is its own group now and
    the group takes the right edge at every width.

    The question and its buttons share a line, the way the Avatar's question
    and its turn arrow do. They are here on the opener and while Source AI is
    listening, which is every move where the person leads the asking. Not on
    an ask, which has its own question and Move on, and not after Move on,
    which is final for the entry. A press repaints and puts the focus back on
    the button pressed, so the next press is one key away. */
 var acts='<div class="src-acts">'
   +'<button type="button" class="src-new" id="srcnew" aria-label="Another question" title="Another question">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/></svg>'
   +'</button>'
   +'<button type="button" class="src-new" id="srcdyn" aria-label="A question from what you wrote" title="A question from what you wrote">'
   +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5h15v10.5H10l-4.5 4v-4h-1z"/><path d="M10 8.6l-1.1 2.6M14.2 8.6l-1.1 2.6"/></svg>'
   +'</button></div>';
 var q=turn.move==='open'||turn.move==='listen'?srcQuestion():ask;
 if(turn.move==='open')
  o+='<div class="src-ask">'+srcLand('src-open',q)+acts+'</div>';
 else if(turn.move==='ask'){
  o+=srcLand('src-q',ask,'--c:'+seatCol(turn.band))
   +'<div class="src-row"><button type="button" class="btn" id="srcpass">Move on</button>'
   +'<span class="src-note">Answer in the journal, or leave it.</span></div>';}
 else if(turn.move==='pass'){
  o+='<p class="src-q">Cool.</p><p class="src-note">Nothing more asked in this entry.</p>';}
 else{
  /* listening, the question steps back, unless the person asked for this
     one: a question built from their words is the one thing on this move
     they pressed for, so it stands at full size. */
  o+='<div class="src-ask">'+srcLand('src-open'+(SRC_DQ?'':' quiet'),q)+acts+'</div>';
  if(heard.top)o+='<div class="src-row"><span class="src-gauge" style="--c:'+seatCol(heard.top.band)+'">'
   +'<span>Next question</span>'+srcPips(heard.top.rung,seatCol(heard.top.band))
   +'<span class="src-seat">'+esc(heard.top.band)+'</span></span></div>';
  else o+='<p class="src-note">Nothing read yet, so '+(SRC_DNONE?'there is nothing of yours to ask from':'nothing is asked')
   +'. Say what your body did, and where.</p>';}
 /* THE REFUSAL FOR A PRESS WITH NOTHING TO READ. Nothing heard in this entry
    and nothing on the record, so the button has nothing of the person's to
    build from, and it says so rather than handing back a question from the
    walk dressed as a personal one. While listening it takes the listening
    note's place above, so the column never says nothing read twice. */
 if(SRC_DNONE&&turn.move==='open')
  o+='<p class="src-note">Nothing read yet, so there is nothing of yours to ask from. Write a line first.</p>';
 /* the why, under whatever move was made, on every move that has heard a
    seat. It is not a question, so Move on does not silence it: moving on ends
    the asking, and the reason for a release is still true. */
 var why=turn.move==='open'?'':srcWhy(heard);
 /* an id and no class: the shell carries no rule for it, and the design gate
    fails a class with no rule. Found by its id, the way the house finds a host. */
 if(why)o+='<div id="srcwhy" style="margin-top:14px"><span class="pm-eye">Why</span>'
  +'<p class="src-open quiet" style="margin:2px 0 0">'+esc(why)+'</p></div>';
 h.innerHTML=o;
 SRC_SHOWN=turn.move==='pass'?'':q;
 srcHearing(h);
 /* a screen reader hears the opener, an ask, "Cool.", and while listening
    only a question the person pressed for. */
 var said=turn.move==='open'?q:(turn.move==='ask'?ask:(turn.move==='pass'?'Cool.'
  :((SRC_DQ||SRC_QI>=0)?q:'')));
 var sy=document.getElementById('srcsay');
 if(sy&&sy.textContent!==said)sy.textContent=said;
 var mv=document.getElementById('srcpass');
 if(mv)mv.onclick=function(){SRC_PASSED=true; srcPaint();};
 var press=function(id,fn){var b=document.getElementById(id); if(!b)return;
  b.onclick=function(){fn(); srcPaint(); var a=document.getElementById(id); if(a)a.focus();};};
 press('srcnew',function(){SRC_DNONE=false; srcNextQ();});
 press('srcdyn',function(){
  var d=srcDyn(STR.heard||heard,(CURP&&CURP.story&&CURP.story.entries)||[]);
  SRC_DNONE=!d; if(d)SRC_DQ=d;});}
/* WHAT WAS LAST ON SCREEN, so a repaint that changes nothing moves nothing.
   The column is rewritten on every key, and a question that faded in on
   every key would be motion saying something new landed when nothing had. */
var SRC_SHOWN='', SRC_DNONE=false, SRC_HT=0, SRC_HX=null;
/* A QUESTION LANDS WORD BY WORD, round LT, his words: "I want Source AI to
   feel like it's a thinking system ... makes that text look like it's
   alive." And from round GQ, the same ask the first time: "I want it to feel
   dynamic and alive when the text gets typed ... like there's a little brain
   behind it. And I want it to feel a little digital."

   Only a question that is new to the screen lands. Each word arrives in the
   accent and settles to ink, one after the other at the product's stagger,
   and a block caret blinks twice at the end of it and goes. The words are
   real text the whole time, in order, with their spaces, so a copy, a find
   and a screen reader all read the sentence and never the pieces. There is
   no pause before it: a delay dressed as thought, on a reader that answers
   in a millisecond, would be the product pretending. */
function srcLand(cls,q,style){
 var id=cls.indexOf('src-open')===0?' id="srcq"':'';
 var st=style?' style="'+style+'"':'';
 if(!q||q===SRC_SHOWN)return '<p class="'+cls+'"'+id+st+'>'+esc(q)+'</p>';
 var ws=String(q).split(' ');
 return '<p class="'+cls+' src-land"'+id+' style="--n:'+ws.length+(style?';'+style:'')+'">'
  +ws.map(function(w,i){return '<span class="src-w" style="--i:'+i+'">'+esc(w)+'</span>';}).join(' ')+'</p>';}
/* AND IT HEARS AS THE PERSON TYPES. srcHear reads the whole entry again on
   every key, which is true, and until now nothing on the screen said so. The
   light on the accent bar runs quick and bright while keys are coming and
   settles back to a slow pass about a second after the last one. It is on the
   host, which outlives the repaint, so the run is not restarted by the key
   that keeps it running. */
function srcHearing(h){
 var t=ST_TEXT;
 if(SRC_HX===null){SRC_HX=t;return;}
 if(t===SRC_HX)return;
 SRC_HX=t;
 if(!t.trim()){h.classList.remove('hear');return;}
 h.classList.add('hear');
 clearTimeout(SRC_HT);
 SRC_HT=setTimeout(function(){var e=document.getElementById('stsrc'); if(e)e.classList.remove('hear');},1100);}
/* THE RAIL HOST IS STATIC, SO IT IS EMPTIED ON THE WAY OUT. A hidden surface
   never sits in the document asserting a stale reading, the rule Summary
   already keeps. setTab calls this on every tab but Story. The bank closes
   with it, so the rail a person comes back to on another tab is that tab's. */
function stRailClear(){
 var e=document.getElementById('imp'); if(e&&e.innerHTML)e.innerHTML='';
 STV.bank=false; document.body.classList.remove('st-bank');}

/* ============================================================
   THE LANES. One model decides what a lane is and what order the lanes
   stand in, and the chart and the list both read it, so a sort moves both.
   Ported from proto/story-redesign2 as it was measured, round II.

     seat        body order, crown at the top, root at the foot. Route's order.
     heard       first seat the story reached at the top. Trace's order in time.
     weight      the entry's reading at the seat, parseStory bands, heaviest top
     came back   the rung, srcHear, the seat nearest a question at the top
     charge      lanes are the charge each imprint carries, not the seat: the
                 Imprints page's own Charge grouping, with its symbol
   ============================================================ */
var ST_SORTS=[['seat','Seat'],['heard','When heard'],['weight','Weight'],['rung','Came back'],['charge','Charge']];
var ST_BKEY={}; Object.keys(K2BAND).forEach(function(k){ST_BKEY[K2BAND[k]]=k;});
function stLaneModel(){
 var p=ST_PARSED,imps=p?p.imprints:[],rg={},wds={},heard=STR.heard;
 ((heard&&heard.seats)||[]).forEach(function(s){rg[s.band]=s.rung;wds[s.band]=s.words;});
 var first={},cnt={};
 STR.marks.forEach(function(m){if(!m.bn)return;
  if(first[m.bn]==null||m.t0<first[m.bn])first[m.bn]=m.t0; if(!m.neg)cnt[m.bn]=(cnt[m.bn]||0)+1;});
 var seatW={}; BANDS.forEach(function(b){seatW[b]=p&&p.bands[ST_BKEY[b]]?p.bands[ST_BKEY[b]]:0;});
 var byBand={}; imps.forEach(function(im){(byBand[im.band]=byBand[im.band]||[]).push(im);});
 var lanes=[],keyOf;
 if(STV.sort==='charge'&&imps.length){
  var fb={};
  Object.keys(byBand).forEach(function(b){var t={};byBand[b].forEach(function(im){t[im.fetter]=(t[im.fetter]||0)+im.amt;});
   fb[b]=Object.keys(t).sort(function(x,y){return t[y]-t[x];})[0];});
  var L={};
  imps.forEach(function(im){var f=im.fetter,c=CHILD.filter(function(x){return x.nm===f;})[0];
   var o=L[f]=L[f]||{key:'c:'+f,label:f,seat:c?c.seat:im.band,icon:c?c.ic:null,active:true,
    weight:0,rung:0,first:1e9,bands:[],imps:[]};
   o.weight+=im.amt; o.imps.push(im); if(o.bands.indexOf(im.band)<0)o.bands.push(im.band);
   o.rung=Math.max(o.rung,rg[im.band]||0); if(first[im.band]!=null)o.first=Math.min(o.first,first[im.band]);});
  lanes=Object.keys(L).map(function(k){return L[k];}).sort(function(a,b){return b.weight-a.weight||a.first-b.first;});
  keyOf=function(m){return m.bn&&fb[m.bn]?'c:'+fb[m.bn]:null;};}
 else{
  lanes=BANDS.slice().reverse().map(function(b,i){return {key:b,label:b,seat:b,icon:null,band:b,body:i,
   active:seatW[b]>0||cnt[b]>0||first[b]!=null,weight:seatW[b],rung:rg[b]||0,
   first:first[b]!=null?first[b]:1e9,bands:[b],imps:byBand[b]||[],words:wds[b]||[],count:cnt[b]||0};});
  var cmp={seat:function(a,b){return a.body-b.body;},
   heard:function(a,b){return a.first-b.first||a.body-b.body;},
   weight:function(a,b){return b.weight-a.weight||a.body-b.body;},
   rung:function(a,b){return b.rung-a.rung||b.weight-a.weight||a.body-b.body;}}[STV.sort==='charge'?'seat':STV.sort];
  lanes.sort(cmp);
  keyOf=function(m){return m.bn||null;};}
 /* the seat the story keeps returning to, Route's dwell, stress lines on it */
 var dw=null,best=0; Object.keys(cnt).forEach(function(b){if(cnt[b]>best){best=cnt[b];dw=b;}});
 var dwKey=dw?(STV.sort==='charge'?keyOf({bn:dw}):dw):null;
 return {lanes:lanes,keyOf:keyOf,dwell:best>=2?dwKey:null};}
/* THREE VIEWS OF ONE READ, round IW, his words: "add little three icons for
   the three versions of the imprint, so I can see toggle through, see which
   ones I like." All three are drawn on the one canvas off the same marks,
   rungs and bands, so switching changes the drawing and never the reading.
     lanes  what shipped at round IJ: Trace's strip chart with Route's line
            through it and the five sorts. The default, because he approved it.
     ring   mockup A of round HT, proto/story-redesign: the Field small, seven
            seat arcs in the Field's own order, a spoke per kept word.
     strip  mockup C of round HT, Trace as first drawn and as he picked it in
            round IG: fixed body lanes, the newest word at the right edge and
            the chart sliding left as the story is written.
   The sort still orders the list under all three. Only Lanes re-orders its
   chart by it, because the other two were drawn in body order on purpose. */
var ST_VIEWS=[
 ['lanes','Lanes','Lanes: Trace and Route together, the view wired in',
  'M3 20h18M6 17v-4M10 17v-9M14 17v-3M18 17v-7M6 11l4-5 4 6 4-4'],
 ['ring','Ring','Ring: the seven seats as a circle, a spoke for each word kept',
  'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17M12 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M12 7V3.5M16.3 14.5l3 1.7M7.7 14.5l-3 1.7'],
 ['strip','Strip','Strip: Trace as first drawn, sliding left as you write',
  'M3 6.5h13M3 12h13M3 17.5h13M19.5 4v16M8 12V9M12 6.5V4M14 17.5v-3']];
/* inline styles only, because the page's stylesheet is not this file's to
   change. .st-ico is the Bank and Vault's own button, so the three carry the
   tap floor, the pressed ring and the Punch treatment those two already have. */
function stViewHtml(){
 return '<span role="group" aria-label="Imprints view" style="display:inline-flex;gap:4px;flex:0 0 auto">'
  +ST_VIEWS.map(function(v){
   return '<button type="button" class="st-ico" data-view="'+v[0]+'" aria-pressed="'+(STV.view===v[0])+'" '
    +'aria-label="'+esc(v[1])+'" title="'+esc(v[2])+'">'+stSvg(v[3])+'</button>';}).join('')+'</span>';}
function stView(v){
 if(STV.view===v)return; STV.view=v;
 /* the Strip's slide is banked from the moment it is up, never before */
 STC.shift=0; STC.lastN=STR.toks.length; stSeatT(); STC.dirty=true;
 document.querySelectorAll('#stctr [data-view]').forEach(function(b){
  b.setAttribute('aria-pressed',b.getAttribute('data-view')===v);});}
function stSortPaint(){
 var el=document.getElementById('stsort'); if(!el)return;
 el.innerHTML='<span class="st-eb">Sort</span>'+ST_SORTS.map(function(s){
  return '<button type="button" class="st-rb'+(STV.sort===s[0]?' on':'')+'" data-sort="'+s[0]+'" '
   +'aria-pressed="'+(STV.sort===s[0])+'">'+s[1]+'</button>';}).join('');
 el.querySelectorAll('[data-sort]').forEach(function(b){b.onclick=function(){
  STV.sort=b.getAttribute('data-sort'); stSortPaint(); stRelayout(); stListPaint(); stFocus('read');};});}

/* ============================================================
   THE INSTRUMENT. Trace and Route, one canvas.

   From Trace: every word written is a tick on the floor, left to right in
   the order it was written, and a word the sniffer kept rises into its lane
   as tall as it weighs. From Route: a dashed line runs from each kept word to
   the next, so the story's path through the body is drawn over the bars, and
   the lane the story keeps returning to carries stress lines. The heaviest
   word is named on the chart; where the chart is wide enough, every kept
   word is.

   IT DRAWS ON THE PRODUCT'S OWN FRAME. The main loop in ui/ui.js calls
   stFrame while the Story is up, so there is no second requestAnimationFrame
   running behind another tab, and leaving the tab stops it by construction.
   It paints only while something is moving: the springs, or the stress
   lines, which are still under reduced motion.
   ============================================================ */
var STC={cv:null,g:null,W:0,H:0,dpr:1,lane:{},items:{},prev:{},ro:null,dirty:true,last:0,
 lm:{lanes:[],keyOf:function(){return null;},dwell:null},
 GL:94,GR:64,FLOOR:22,TOP:6,shift:0,lastN:0,
 sync:function(){var now={},items=STC.items;
  STC.stressTo=performance.now()+ST_STRESS_MS;
  /* at is when the word landed, which the Ring's ripple reads. The prototype
     stamped it when the flying chip arrived; there is no chip here, see the
     head of this file, so it is stamped when the read first holds the word. */
  STR.marks.forEach(function(m){now[m.key]=m;
   if(!items[m.key])items[m.key]={m:m,g:REDUCED?1:0,gv:0,alive:true,at:performance.now()};
   else{items[m.key].m=m;items[m.key].alive=true;}});
  Object.keys(items).forEach(function(k){if(!now[k])items[k].alive=false;});
  /* the Strip slides only once the words are packed at their narrowest, the
     prototype's rule: before that each word already moves the strip left by
     a whole step, because the newest word is pinned to the right edge. */
  var N=STR.toks.length;
  if(STV.view==='strip'&&N>STC.lastN&&!REDUCED&&stStripDx()<=3)STC.shift+=(N-STC.lastN)*3;
  STC.lastN=N;
  stSeatT();
  STC.dirty=true;}};
/* the chart's colours, read off the lighting rather than typed. A seat
   colour comes through seatCol, which is the ladder every HTML ring uses. */
function stCol(b){var c=seatCol(b);return /^#[0-9a-f]{6}$/i.test(c)?hx(c):STC.acc;}
function stRgb(s){var m=String(s||'').match(/[\d.]+/g); if(!m||m.length<3)return null;
 var v=m.slice(0,3).map(Number);
 /* color(srgb 0.1 0.2 0.3) is what a colour built with color-mix computes to */
 if(/^color\(/.test(s))v=v.map(function(x){return Math.round(x*255);});
 return v;}
function stInk(){
 var w=document.getElementById('stcvw'), k=w&&w.querySelector('.st-cvk');
 STC.ink=(w&&stRgb(getComputedStyle(w).color))||[239,237,232];
 STC.dim=(k&&stRgb(getComputedStyle(k).color))||[148,144,138];
 STC.acc=(k&&stRgb(getComputedStyle(k).borderTopColor))||[126,184,212];}
function stSize(){
 var w=document.getElementById('stcvw'), cv=document.getElementById('stcv'); if(!w||!cv)return;
 STC.cv=cv; STC.g=cv.getContext('2d');
 STC.dpr=Math.min(2,window.devicePixelRatio||1);
 STC.W=w.clientWidth; STC.H=w.clientHeight;
 cv.width=Math.round(STC.W*STC.dpr); cv.height=Math.round(STC.H*STC.dpr);
 /* a narrow chart gives the lane names the room and drops the gutter a
    word would otherwise be named in */
 STC.GL=STC.W<420?84:94;
 STC.lit=S.theme; stInk(); STC.dirty=true;}
function stBox(){return {x0:STC.GL,x1:STC.W-STC.GR,y0:STC.TOP,y1:STC.H-STC.FLOOR};}
/* the lane targets: an empty lane is kept, thin, so a slot keeps its place */
function stRelayout(){
 STC.lm=stLaneModel();
 /* a chart with no height yet places nothing; the observer lays it out the
    moment it has one, and a lane born there starts at its own place */
 if(STC.H<=STC.FLOOR+STC.TOP){STC.dirty=true;return;}
 var q=stBox(),L=STC.lm.lanes,tot=0; L.forEach(function(l){tot+=l.active?1:0.42;});
 var u=tot?(q.y1-q.y0)/tot:0,y=q.y0,T={};
 L.forEach(function(l){var h=u*(l.active?1:0.42);T[l.key]={y:y,h:h};y+=h;});
 Object.keys(STC.lane).forEach(function(k){if(!T[k])STC.lane[k].gone=true;});
 Object.keys(T).forEach(function(k){var o=STC.lane[k];
  if(!o||o.gone&&o.a<.02)STC.lane[k]={y:T[k].y,h:T[k].h,vy:0,vh:0,a:REDUCED?1:0,ty:T[k].y,th:T[k].h};
  else{o.ty=T[k].y;o.th=T[k].h;o.gone=false;}});
 STC.dirty=true;}
function stDx(){var q=stBox(),N=Math.max(1,STR.toks.length);return Math.max(3,Math.min(22,(q.x1-q.x0-8)/N));}
function stXOf(j){var q=stBox(),N=STR.toks.length,dx=stDx();
 return N*dx<=q.x1-q.x0-4?q.x0+4+j*dx:q.x1-(N-1-j)*dx;}
/* the springs. Critically damped enough that a sort slides rather than
   rings, stepped at 120 a second whatever the frame rate. */
function stStep(dt){
 var moving=false;
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k],t=it.alive?1:0;
  if(REDUCED){it.g=t;it.gv=0;}else{var a=220*(t-it.g)-2*.55*14.8*it.gv;it.gv+=a*dt;it.g+=it.gv*dt;}
  if(Math.abs(t-it.g)>.004||Math.abs(it.gv)>.004)moving=true;
  if(!it.alive&&it.g<0.01&&Math.abs(it.gv)<0.01)delete STC.items[k];});
 Object.keys(STC.lane).forEach(function(k){var o=STC.lane[k],ta=o.gone?0:1;
  if(REDUCED){o.y=o.ty;o.h=o.th;o.a=ta;o.vy=o.vh=0;if(o.gone)delete STC.lane[k];return;}
  var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
  for(var s=0;s<sub;s++){var a=170*(o.ty-o.y)-2*.86*13*o.vy;o.vy+=a*sd;o.y+=o.vy*sd;
   var a2=170*(o.th-o.h)-2*.86*13*o.vh;o.vh+=a2*sd;o.h+=o.vh*sd;}
  o.a+=(ta-o.a)*Math.min(1,dt*9);
  if(Math.abs(o.ty-o.y)>.2||Math.abs(o.th-o.h)>.2||Math.abs(ta-o.a)>.01)moving=true;
  if(o.gone&&o.a<.02)delete STC.lane[k];});
 return moving;}
/* THE STRESS LINES MOVE WHILE THE READING IS MOVING, AND THEN HOLD.
   The prototype pulsed them for ever. On the product that is a canvas
   repainting sixty times a second on a page where somebody is typing, inside
   a stage the Glass lightings blur behind: measured in the design gate's own
   Chromium, the Glass white lighting could not finish its transition, two
   reads of the body 120ms apart came back equal half way, and the child
   treatment gate scored its pills against a ground that was half dark. They
   pulse for a few seconds after each change in what was read and then stand
   at the middle of their swing, which is where reduced motion puts them. */
var ST_STRESS_MS=2600;
function stFrame(ts){
 /* the clock, ahead of the canvas guard below, so a recording still ticks
    on a frame where the chart itself has nothing to draw. */
 stMicTick();
 if(!STC.cv||!STC.cv.isConnected){if(document.getElementById('stcv'))stSize();else return;}
 var dt=Math.min(.05,(ts-(STC.last||ts))/1000); STC.last=ts;
 var live=!REDUCED&&STC.lm.dwell&&performance.now()<(STC.stressTo||0);
 var moving=stStep(dt);
 /* the seat springs only drive the Ring and the Strip, so Lanes pays for
    nothing it does not draw */
 if(STV.view!=='lanes')moving=stSeatStep(dt)||moving;
 /* one more frame once the pulse ends, so it comes to rest at the still phase */
 if(!live&&STC.pulsing){STC.pulsing=false;STC.dirty=true;}
 if(live)STC.pulsing=true;
 if(!moving&&!live&&!STC.dirty)return;
 STC.dirty=false; stDraw();}
function stDraw(){
 if(STV.view==='ring')return stDrawRing();
 if(STV.view==='strip')return stDrawStrip();
 var g=STC.g,q=stBox(),W=STC.W,H=STC.H; if(!g||!W||!H)return;
 var ink=STC.ink,dim=STC.dim,wide=W>=900;
 g.setTransform(STC.dpr,0,0,STC.dpr,0,0); g.clearRect(0,0,W,H);
 /* the lanes: a floor line, the name, the rung pips, stress lines on the dwell */
 STC.lm.lanes.forEach(function(l){var o=STC.lane[l.key];if(!o)return;
  var c=stCol(l.seat),al=o.a,y=o.y,h=o.h,on=l.active;
  if(STV.hot===l.key){g.fillStyle=rgba(c,.08*al);g.fillRect(4,y,W-8,h);}
  g.beginPath();g.moveTo(q.x0,y+h-1);g.lineTo(q.x1,y+h-1);g.strokeStyle=rgba(c,(on?.24:.07)*al);g.lineWidth=1;g.stroke();
  var ly=y+h*.6;g.textBaseline='middle';
  /* a lane too thin to carry a name carries its ring only, never a name over
     its neighbour's */
  if(h<12){if(h>=6){g.beginPath();g.arc(15,y+h/2,Math.min(4,h/2-1),0,TAU);g.strokeStyle=rgba(c,.4*al);g.lineWidth=1.2;g.stroke();}}
  else{
   if(l.icon){g.save();g.translate(8,ly-7);g.scale(14/24,14/24);g.strokeStyle=rgba(c,al);g.lineWidth=1.8*24/14;
    g.lineJoin='round';g.lineCap='round';g.stroke(new Path2D(l.icon));g.restore();}
   else{g.beginPath();g.arc(15,ly,4,0,TAU);g.strokeStyle=rgba(c,(on?1:.45)*al);g.lineWidth=1.6;g.stroke();}
   g.fillStyle=rgba(on?mixc(c,ink,.12):c,(on?1:.6)*al);g.font='600 12px Inter,system-ui,sans-serif';g.textAlign='left';
   g.fillText(l.label.length>11&&STC.GL<94?l.label.slice(0,10)+'.':l.label,26,ly);}
  if(h>=11)for(var i=0;i<10;i++){var lit=i<Math.round(l.rung);
   g.fillStyle=lit?rgba(c,al):rgba(c,(i>=SRC_ASK-1?.3:.12)*al);g.fillRect(W-STC.GR+8+i*5,ly-5,3,10);}
  if(STC.lm.dwell===l.key&&l.rung>=1){var str=Math.min(1,l.rung/10),gp=3.2-1.1*str,f=(REDUCED||!STC.pulsing)?.5:((performance.now()/1400)%1);
   for(var k=0;k<3;k++){var pos=k+f,sa=str*Math.sin(Math.PI*pos/3)*.45*al;if(sa<.02)continue;
    [-1,1].forEach(function(sg){var yy=y+h*.5+sg*(h*.18+pos*gp);g.beginPath();g.moveTo(q.x0,yy);g.lineTo(q.x1,yy);
     g.strokeStyle=rgba(c,sa);g.lineWidth=1;g.stroke();});}}});
 g.save();g.beginPath();g.rect(q.x0,0,q.x1-q.x0+2,H);g.clip();
 /* the floor: every word read, a tick. The ones it kept are in their colour */
 var dx=stDx(),tw=Math.max(1.5,dx-(dx>8?4:2));
 STR.toks.forEach(function(o,j){var x=stXOf(j);if(x<q.x0-8)return;
  g.fillStyle=o.m?rgba(o.m.bn?stCol(o.m.bn):STC.acc,1):rgba(dim,.45);g.fillRect(x,H-STC.FLOOR+6,tw,o.m?9:6);});
 /* the bars */
 var pts=[];
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k],m=it.m,g1=Math.max(0,it.g);if(g1<.01||m.t0<0)return;
  var x=stXOf(m.t0),x2=stXOf(m.t1)+tw;
  if(m.coh){g.fillStyle=rgba(STC.acc,.9);g.fillRect(x,H-STC.FLOOR+2-10*g1,x2-x,3);return;}
  var lk=STC.lm.keyOf(m),o=lk&&STC.lane[lk];if(!o)return;
  var c=stCol(m.bn),hh=Math.max(3,g1*(0.22+0.78*m.depth)*o.h*.82),base=o.y+o.h-1,al=o.a;
  if(m.neg){g.strokeStyle=rgba(c,.55*al);g.setLineDash([2,2]);g.strokeRect(x+.5,base-hh+.5,x2-x-1,hh-1);g.setLineDash([]);}
  else{g.fillStyle=rgba(c,al);g.fillRect(x,base-hh,x2-x,hh);
   /* a modifier's share of the bar is drawn lighter, so "really tight" shows
      how much of its height the "really" added */
   if(m.mod){var hb=hh/m.mod.f;g.fillStyle=rgba(mixc(c,ink,.55),al);g.fillRect(x,base-hh,x2-x,hh-hb);}}
  pts.push({m:m,x:(x+x2)/2,y:base-hh,g:g1,c:c});});
 pts.sort(function(a,b){return a.m.s-b.m.s;});
 /* the route over the bars, Route's dashed trajectory, grown as each word lands */
 g.lineWidth=1.6;g.setLineDash([4,4]);
 for(var i=1;i<pts.length;i++){var a=pts[i-1],b2=pts[i],gg=Math.max(0,Math.min(1,b2.g));if(gg<.01)continue;
  var grd=g.createLinearGradient(a.x,a.y,b2.x,b2.y);
  grd.addColorStop(0,rgba(a.c,a.m.neg?.3:.9));grd.addColorStop(1,rgba(b2.c,b2.m.neg?.3:.9));
  g.strokeStyle=grd;g.beginPath();var mx=(b2.x-a.x)/2;g.moveTo(a.x,a.y);
  var N=18;for(var s2=1;s2<=Math.round(N*gg);s2++){var tt=s2/N,u=1-tt;
   var xx=u*u*u*a.x+3*u*u*tt*(a.x+mx)+3*u*tt*tt*(b2.x-mx)+tt*tt*tt*b2.x,
       yy=u*u*u*a.y+3*u*u*tt*a.y+3*u*tt*tt*b2.y+tt*tt*tt*b2.y;g.lineTo(xx,yy);}
  g.stroke();}
 g.setLineDash([]);
 /* the stations on the line, and the newest one lit */
 pts.forEach(function(p,i){var r=2.6+2.4*p.m.depth;
  if(i===pts.length-1){var hg=g.createRadialGradient(p.x,p.y,0,p.x,p.y,15);hg.addColorStop(0,rgba(p.c,.45));hg.addColorStop(1,rgba(p.c,0));
   g.fillStyle=hg;g.beginPath();g.arc(p.x,p.y,15,0,TAU);g.fill();}
  /* THE STATION IS HOLLOW BY CUTTING, NOT BY PAINTING. It was filled with a
     ground colour read off the panel, and the panel's ground is the ink at 3
     per cent, so the read came back as the ink itself and every station drew
     as a solid white dot on the dark lightings. Cutting the disc out of the
     canvas lets the lighting's own ground show through, on all seven. */
  g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(p.x,p.y,r,0,TAU);g.fill();g.restore();
  g.beginPath();g.arc(p.x,p.y,r,0,TAU);
  if(p.m.neg)g.setLineDash([2,2]);g.strokeStyle=rgba(p.c,p.m.neg?.5:1);g.lineWidth=1.6;g.stroke();g.setLineDash([]);});
 /* the words: the heaviest always, the rest where there is room */
 var kink=null;pts.forEach(function(p){if(!p.m.neg&&p.m.amt!=null&&(!kink||p.m.amt>kink.m.amt))kink=p;});
 var placed=[];g.font='500 12px Inter,system-ui,sans-serif';g.textAlign='center';g.textBaseline='bottom';
 pts.slice().sort(function(a,b){return (b===kink)-(a===kink)||b.m.depth-a.m.depth;}).forEach(function(p){
  if(p.m.neg&&!wide)return; if(p!==kink&&!wide&&dx<12)return; if(p.g<.6)return;
  var w=g.measureText(p.m.txt).width+6,x0=p.x-w/2,y1=p.y-6,y0=y1-14;
  if(x0<q.x0||x0+w>q.x1+2||y0<0)return;
  if(placed.some(function(r){return !(x0+w<r[0]||x0>r[2]||y1<r[1]||y0>r[3]);}))return;
  placed.push([x0,y0,x0+w,y1]);g.fillStyle=p.m.neg?rgba(dim,.9):rgba(mixc(p.c,ink,.15),1);g.fillText(p.m.txt,p.x,y1);});
 var N2=STR.toks.length;if(N2){var px=stXOf(N2-1)+dx;g.fillStyle=rgba(STC.acc,.55);g.fillRect(px,q.y0,1,H-q.y0-6);}
 g.restore();
 g.fillStyle=rgba(dim,1);g.font='12px Inter,system-ui,sans-serif';g.textAlign='left';g.textBaseline='middle';
 g.fillText('every word',26,H-STC.FLOOR/2+3);}
function stHot(k){
 if(STV.hot===k)return; STV.hot=k; STC.dirty=true;
 document.querySelectorAll('#stimps .st-grp').forEach(function(gp){gp.classList.toggle('hot',gp.getAttribute('data-k')===k);});}

/* ============================================================
   THE RING AND THE STRIP, PORTED FROM proto/story-redesign/src/shared.js,
   its VA and VC. The drawing is the prototype's, number for number. What
   changed is only where the numbers come from, and each change is the one
   this file already made for Lanes:
     the read is STR and ST_PARSED, not the prototype's own copy of it
     colours come through stCol and the lighting's ink, dim and accent, so
       both views follow all seven lightings rather than the Dark one the
       prototype was drawn on
     a hollow is cut, not painted, for the reason given at the stations
     the frame is the product's own, and it stops when nothing moves
   ============================================================ */
/* THE SEATS, AS SPRINGS. The prototype's targets, unchanged:
     rd   the entry's reading at the seat, parseStory bands over three, capped at ten
     rg   the rung, srcHear
     bend the Field's own stress curve, frStress in ui/wheel.js, which is the
          prototype's frStressP on the same LEVER_MU, so it is called rather
          than copied a second time */
var STSEAT={}; BANDS.forEach(function(b){STSEAT[b]={rd:0,rv:0,rdT:0,rg:0,rgv:0,rgT:0,bend:0,bv:0,ph:0,rise:0};});
function stSeatT(){
 var p=ST_PARSED,rg={},snap=STV.view==='lanes';
 ((STR.heard&&STR.heard.seats)||[]).forEach(function(s){rg[s.band]=s.rung;});
 BANDS.forEach(function(b){var o=STSEAT[b],k=ST_BKEY[b],t=p&&p.bands[k]?Math.min(10,p.bands[k]/3):0;
  if(t>o.rdT+0.01)o.rise=1.6; o.rdT=t; o.rgT=rg[b]||0;
  /* WHILE LANES IS UP THE SPRINGS ARE NOT STEPPED, so they are held at their
     targets instead. Left behind, a switch to the Ring grew every arc and
     spoke from nothing for a reading that had not changed, which is the
     motion that says a word landed when none had, the defect the head of
     stRender records for the lanes. */
  if(snap){o.rd=t;o.rg=o.rgT;o.rv=o.rgv=o.bv=0;o.bend=frStress(t);o.rise=0;}});}
function stSeatStep(dt){
 var moving=false,now=performance.now();
 BANDS.forEach(function(b){var o=STSEAT[b],tb=frStress(Math.max(0,o.rdT));
  if(REDUCED){o.rd=o.rdT;o.rg=o.rgT;o.rv=o.rgv=0;o.bend=tb;o.bv=0;o.rise=0;return;}
  var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
  for(var s=0;s<sub;s++){
   var a=144*(o.rdT-o.rd)-2*.72*12*o.rv;o.rv+=a*sd;o.rd+=o.rv*sd;
   var a2=196*(o.rgT-o.rg)-2*.8*14*o.rgv;o.rgv+=a2*sd;o.rg+=o.rgv*sd;
   /* the Field's bend: w 14, damping .42, so it lands a fifth past its mark */
   var a3=196*(tb-o.bend)-2*.42*14*o.bv;o.bv+=a3*sd;o.bend+=o.bv*sd;}
  o.rise=Math.max(0,o.rise-dt); o.ph+=dt*(o.rise>0?0.9:0);
  if(Math.abs(o.rdT-o.rd)>.004||Math.abs(o.rv)>.004||Math.abs(o.rgT-o.rg)>.004||Math.abs(o.rgv)>.004
   ||Math.abs(tb-o.bend)>.002||Math.abs(o.bv)>.004||o.rise>0)moving=true;});
 if(STV.view==='strip'){STC.shift*=REDUCED?0:Math.exp(-dt*9);
  if(STC.shift>.05)moving=true; else STC.shift=0;}
 /* the ripple outlives the spoke's spring by a few hundred milliseconds, and
    a frame that stopped with it would leave a ring standing on the canvas */
 if(STV.view==='ring'&&!REDUCED)Object.keys(STC.items).forEach(function(k){if(now-(STC.items[k].at||0)<900)moving=true;});
 return moving;}
/* the seven sectors in the Field's own order and size: Root at twelve
   o'clock, clockwise, each as wide as its share of the somatic addresses */
var ST_SECT=null;
function stSect(){
 if(ST_SECT)return ST_SECT;
 var cnt={},a=-Math.PI/2,o={};W.forEach(function(n){cnt[n.b]=(cnt[n.b]||0)+1;});
 BANDS.forEach(function(b){var w=(cnt[b]||0)/W.length*TAU;o[b]={a0:a,a1:a+w};a+=w;});
 return (ST_SECT=o);}
/* ---- A. THE LISTENING RING ---- */
function stDrawRing(){
 var g=STC.g,CW=STC.W,CH=STC.H; if(!g||!CW||!CH)return;
 var s=Math.min(CW,CH)/300,q={cx:CW/2,cy:CH/2,core:22*s,sp0:28*s,spL:44*s,ring:100*s};
 var SE=stSect(),ink=STC.ink,acc=STC.acc,now=performance.now();
 g.setTransform(STC.dpr,0,0,STC.dpr,0,0); g.clearRect(0,0,CW,CH); g.setLineDash([]);
 /* the seat arcs, bent by the Field's rule, and the fringes past five */
 BANDS.forEach(function(b){var o=STSEAT[b],S_=SE[b],c=stCol(b),gap=.025,heard=o.rgT>0||o.rd>0.05;
  var r=q.ring+o.bend*9*s;
  g.beginPath();g.arc(q.cx,q.cy,r,S_.a0+gap,S_.a1-gap);g.strokeStyle=rgba(c,heard?.92:.2);g.lineWidth=5*s;g.lineCap='butt';g.stroke();
  /* the rung, ten ticks along the outside of the arc; seven to ten are the end it asks at */
  for(var i=0;i<10;i++){var a=S_.a0+gap+(i+.5)/10*(S_.a1-S_.a0-2*gap),on=i<Math.round(o.rg),ask=i>=SRC_ASK-1,r0=r+8*s,r1=r0+(ask?8:6)*s;
   g.beginPath();g.moveTo(q.cx+Math.cos(a)*r0,q.cy+Math.sin(a)*r0);g.lineTo(q.cx+Math.cos(a)*r1,q.cy+Math.sin(a)*r1);
   g.strokeStyle=on?rgba(c,1):rgba(c,heard?(ask?.4:.18):.08);g.lineWidth=(on?2.2:1.3)*s;g.stroke();}
  var str=Math.max(0,o.bend);
  if(str>=.03){var gp=(10-6*str)*s,f=REDUCED?.5:(o.ph-Math.floor(o.ph)),lift=mixc(c,ink,.55);
   for(var k=0;k<5;k++){var pos=k+f,al=Math.pow(Math.min(1,str),1.3)*Math.sin(Math.PI*pos/5)*.85;if(al<.02)continue;
    g.beginPath();g.arc(q.cx,q.cy,r+22*s+pos*gp,S_.a0+gap*2,S_.a1-gap*2);g.strokeStyle=rgba(k%2?c:lift,al);g.lineWidth=(k%2?1.1:1.6)*s;g.stroke();}}
  if(heard){var am=(S_.a0+S_.a1)/2,lr=q.ring-15*s;g.fillStyle=rgba(c,.95);g.font='600 '+Math.max(11,11*s)+'px Inter,system-ui,sans-serif';
   g.textAlign='center';g.textBaseline='middle';g.fillText(b,q.cx+Math.cos(am)*lr,q.cy+Math.sin(am)*lr);}});
 /* the spokes, one per kept stretch of text, as long as it weighed */
 var per={},coh=[];
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k];
  if(it.m.coh){coh.push(it);return;} if(!it.m.bn||!SE[it.m.bn])return; (per[it.m.bn]=per[it.m.bn]||[]).push(it);});
 Object.keys(per).forEach(function(b){var L=per[b].sort(function(x,y){return x.m.s-y.m.s;}),S_=SE[b],c=stCol(b),n=L.length;
  L.forEach(function(it,j){var a=S_.a0+(j+1)/(n+1)*(S_.a1-S_.a0),g1=Math.max(0,it.g),len=q.sp0+g1*(0.25+0.75*it.m.depth)*q.spL,
   ca=Math.cos(a),sa=Math.sin(a);if(g1<.01)return;
   g.beginPath();g.moveTo(q.cx+ca*q.sp0,q.cy+sa*q.sp0);g.lineTo(q.cx+ca*len,q.cy+sa*len);
   if(it.m.neg){g.setLineDash([2*s,3*s]);g.strokeStyle=rgba(c,.45);}else{g.setLineDash([]);g.strokeStyle=rgba(c,1);}
   g.lineWidth=2.2*s;g.lineCap='round';g.stroke();g.setLineDash([]);
   /* a degree word's share of the spoke is drawn lighter, as on Lanes */
   if(it.m.mod&&!it.m.neg){var base=q.sp0+g1*(0.25+0.75*it.m.depth/it.m.mod.f)*q.spL;
    g.beginPath();g.moveTo(q.cx+ca*base,q.cy+sa*base);g.lineTo(q.cx+ca*len,q.cy+sa*len);g.strokeStyle=rgba(mixc(c,ink,.6),1);g.lineWidth=3*s;g.stroke();}
   var age=(now-(it.at||0))/900;
   if(age<1&&!REDUCED){var rr=(6+10*age)*s;g.beginPath();g.arc(q.cx+ca*len,q.cy+sa*len,rr,0,TAU);g.strokeStyle=rgba(c,.5*(1-age));g.lineWidth=1.4*s;g.stroke();}});});
 /* the core. A coherent word places nothing, so it lands here and grows
    nothing. Hollow by cutting, like the stations on Lanes. */
 g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(q.cx,q.cy,q.core,0,TAU);g.fill();g.restore();
 g.beginPath();g.arc(q.cx,q.cy,q.core,0,TAU);g.strokeStyle=rgba(acc,Math.min(1,.35+.1*coh.length));g.lineWidth=1.4*s;g.stroke();
 coh.forEach(function(it,j){var a=-Math.PI/2+j*.5,g1=Math.max(0,it.g),r0=q.core+3*s,r1=r0+6*s*g1;
  g.beginPath();g.moveTo(q.cx+Math.cos(a)*r0,q.cy+Math.sin(a)*r0);g.lineTo(q.cx+Math.cos(a)*r1,q.cy+Math.sin(a)*r1);
  g.strokeStyle=rgba(acc,1);g.lineWidth=2*s;g.stroke();});
 g.lineCap='butt';}
/* ---- C. THE TRACE, AS FIRST DRAWN: THE STRIP ---- */
function stStripBox(){return {x0:70,x1:STC.W-60,y0:8,y1:STC.H-26};}
function stStripLane(b){var q=stStripBox(),i=BANDS.length-1-BANDS.indexOf(b),h=(q.y1-q.y0)/7;return {y:q.y0+i*h,h:h};}
/* a chart with no width yet reads as packed, and would bank a slide it never
   drew; nothing slides until the canvas has been measured */
function stStripDx(){var q=stStripBox(),N=Math.max(1,STR.toks.length);
 return STC.W?Math.max(3,Math.min(9,(q.x1-q.x0-8)/N)):9;}
function stStripX(j){var q=stStripBox(),N=STR.toks.length;return q.x1-(N-1-j)*stStripDx()-STC.shift;}
function stDrawStrip(){
 var g=STC.g,CW=STC.W,CH=STC.H; if(!g||!CW||!CH)return;
 var q=stStripBox(),dx=stStripDx(),ink=STC.ink,dim=STC.dim,acc=STC.acc;
 g.setTransform(STC.dpr,0,0,STC.dpr,0,0); g.clearRect(0,0,CW,CH); g.setLineDash([]);
 BANDS.forEach(function(b){var l=stStripLane(b),c=stCol(b),o=STSEAT[b],heard=o.rgT>0;
  g.beginPath();g.moveTo(q.x0,l.y+l.h-1);g.lineTo(q.x1,l.y+l.h-1);g.strokeStyle=rgba(c,heard?.22:.07);g.lineWidth=1;g.stroke();
  g.fillStyle=rgba(c,heard?1:.76);g.font='600 12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText(b,q.x0-10,l.y+l.h*.6);
  for(var i=0;i<10;i++){var on=i<Math.round(o.rg);g.fillStyle=on?rgba(c,1):rgba(c,i>=SRC_ASK-1?.3:.12);g.fillRect(CW-54+i*5,l.y+l.h*.6-5,3,10);}});
 g.save();g.beginPath();g.rect(q.x0,0,q.x1-q.x0+8,CH);g.clip();
 /* every word read, a tick on the floor; the ones it kept rise into their seat */
 STR.toks.forEach(function(o,j){var x=stStripX(j);if(x<q.x0-8)return;
  g.fillStyle=o.m?rgba(o.m.bn?stCol(o.m.bn):acc,1):rgba(dim,.45);g.fillRect(x,CH-20,Math.max(1.5,dx-3),o.m?9:6);});
 Object.keys(STC.items).forEach(function(k){var it=STC.items[k],m=it.m,g1=Math.max(0,it.g);if(g1<.01||m.t0<0)return;
  var x=stStripX(m.t0),x2=stStripX(m.t1)+Math.max(5,dx-1.5);
  if(m.coh){g.fillStyle=rgba(acc,.9);g.fillRect(x,CH-20-12*g1,x2-x,3);return;}
  if(!m.bn)return;
  var l=stStripLane(m.bn),c=stCol(m.bn),hh=g1*(0.2+0.8*m.depth)*l.h*.9,base=l.y+l.h-1;
  if(m.neg){g.strokeStyle=rgba(c,.55);g.setLineDash([2,2]);g.strokeRect(x+.5,base-hh+.5,x2-x-1,hh-1);g.setLineDash([]);return;}
  g.fillStyle=rgba(c,1);g.fillRect(x,base-hh,x2-x,hh);
  if(m.mod){var hb=hh/m.mod.f;g.fillStyle=rgba(mixc(c,ink,.55),1);g.fillRect(x,base-hh,x2-x,hh-hb);}});
 var N=STR.toks.length;if(N){var px=stStripX(N-1)+dx;g.fillStyle=rgba(acc,.55);g.fillRect(px,q.y0,1,CH-q.y0-6);}
 g.restore();
 g.fillStyle=rgba(dim,.9);g.font='12px Inter,system-ui,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText('read',q.x0-10,CH-15);}

/* ---- the words under the chart and the tag beside its name ----
   THE TAG IS EMPTY UNTIL THERE IS SOMETHING TO SAY. Round LO, his words:
   "For the imprints, I remove the text saying imprints not read yet, unless
   that does something specific." Checked before it was cut: it was the tag's
   fourth state, shown only with the box empty and nothing committed since
   the page opened, and it did nothing. It was not a control, nothing reads
   it, and it said the same thing as the list directly under it, "You have
   not written anything yet. Whatever you write gets pulled apart and
   collected here", and as the empty chart beside it. On a phone that list
   is folded away behind List, and there the empty chart and the empty box
   with its placeholder still say it, the chart on the same line of sight
   the tag sat on. The other three states
   each say something only the tag says and they stay: how many are pending,
   that the words kept nothing, and that the last entry was committed. The
   span stays in place empty, because it is the spacer that holds the Bank
   and the Vault at the row's right edge. */
function stPendPaint(){
 var e=document.getElementById('stpend'); if(!e)return;
 var n=ST_PARSED?ST_PARSED.imprints.length:0;
 e.textContent=n?n+' pending':(ST_TEXT.trim()?'Nothing kept yet':(STV.lastFound.length?'Committed':''));
 var l=document.getElementById('stlist'); if(l)l.textContent=n?'List '+n:'List';}
function stCtrPaint(){
 /* its own span, because the line also carries the view toggle and writing
    the whole line's text would take the three buttons off it */
 var e=document.getElementById('stctrt'); if(!e)return;
 var toks=STR.toks,tg=STR.marks.length,ng=STR.marks.filter(function(m){return m.neg;}).length;
 e.textContent=toks.length?(toks.length+' words read, '+tg+' kept'+(ng?', '+ng+' set aside as negated':'')):'';}

/* ============================================================
   THE LIST, in the lanes' order, so a sort moves the chart and the list
   together. Inferred imprints fold to one pill per seat and charge, the
   shipped round GR rule: four addresses the words did not name are one
   reading, not four findings. Or the vault, when it is open.
   ============================================================ */
function stSvg(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';}
var ST_SEEN={};
function stListPaint(){
 var hd=document.getElementById('stlshd'), box=document.getElementById('stimps'); if(!hd||!box)return;
 if(STV.list==='vault'){stVaultPaint(hd,box);return;}
 var p=ST_PARSED,n=p?p.imprints.length:0,o='';
 hd.textContent='Pending imprints, by '+ST_SORTS.filter(function(s){return s[0]===STV.sort;})[0][1].toLowerCase();
 /* THE EMPTY STATE SAYS WHAT IS TRUE. After a commit the box is empty and the
    person has just written, so "you have not written anything yet" would be
    the false empty state ui/imprints.js already records. */
 if(!n){
  box.innerHTML='<p class="st-none">'+(ST_TEXT.trim()
   ?'Nothing in this entry reads as held yet. Keep writing, or write where you felt it.'
   :(STV.lastFound.length?'Your last entry is in the field and its addresses are queued in the release. The next entry gathers here.'
    :'You have not written anything yet. Whatever you write gets pulled apart and collected here.'))+'</p>';
  ST_SEEN={};return;}
 var heardB={};((STR.heard&&STR.heard.seats)||[]).forEach(function(s){heardB[s.band]=s;});
 var seen={};
 STC.lm.lanes.forEach(function(l){if(!l.imps||!l.imps.length)return;var c=seatCol(l.seat),pills=[],fold={};
  l.imps.slice().sort(function(a,b){return b.amt-a.amt;}).forEach(function(im){
   if(im.inferred){var fk=im.band+':'+im.fetter;
    if(!fold[fk]){fold[fk]={label:STV.sort==='charge'?im.band:im.fetter,amt:0,inf:true,band:im.band};pills.push(fold[fk]);}
    fold[fk].amt+=im.amt;}
   else pills.push({label:im.name,amt:im.amt,inf:false,band:im.band});});
  /* THE TWO HALVES OF THE ENGINE DISAGREE, AND IT IS SHOWN. A seat whose only
     words were negated is charged by parseStory and set aside by srcHear. */
  var note;
  if(STV.sort!=='charge'){
   var only=!heardB[l.band]?STR.marks.filter(function(m){return m.bn===l.band&&m.neg;}):[];
   note=only.length?'<em class="warn">only from '+only.map(function(m){
     return '&ldquo;'+esc(ST_TEXT.slice(m.negFrom!=null?m.negFrom:m.s,m.e))+'&rdquo;';}).join(', ')+'</em>'
    :'<em>'+pills.length+' pending</em>';}
  else note='<em>at '+l.bands.map(srcSeatSay).join(', ')+'</em>';
  var sym=l.icon?stSvg(l.icon):'<span class="st-ring"></span>';
  o+='<div class="st-grp'+(STV.hot===l.key?' hot':'')+'" data-k="'+esc(l.key)+'" style="--c:'+c+'">'
   +'<div class="st-ghd"><b>'+sym+esc(l.label)+'</b>'+note+'</div><div class="st-pills">'
   +pills.map(function(q){var k=l.key+':'+q.label;seen[k]=1;
    return '<span class="st-pill'+(q.inf?' inf':'')+(ST_SEEN[k]?'':' new')+'" style="--c:'+seatCol(q.band)+'" '
     +'title="'+(q.inf?'The seat was read. The words did not name this address.':'Named by the words.')+'">'
     +'<span class="st-ring"></span>'+esc(q.label)+' <small>+'+(Math.round(q.amt*10)/10)+'</small></span>';}).join('')
   +'</div></div>';});
 ST_SEEN=seen; box.innerHTML=o;
 box.querySelectorAll('.st-grp').forEach(function(gp){
  gp.onmouseenter=function(){stHot(gp.getAttribute('data-k'));};gp.onmouseleave=function(){stHot(null);};});}

/* ============================================================
   THE VAULT: WHAT HAS ACTUALLY BEEN RELEASED, read off the record.

   A release writes one key per pattern into the record's meter, address,
   channel and line, meterRun in engine/schema.js, and a dated first per
   address, meterFirst. That is the whole history and it is the person's own:
   nothing here is inferred from charge, which also moves by writing and by
   the sliders. A worked example has no meter of its own, because a release
   is refused on one, so its vault is honestly empty.
   ============================================================ */
function stVaultRows(){
 var m=(typeof CURP!=='undefined'&&CURP&&CURP.meter)||null, by={}, first={};
 ((m&&m.unique)||[]).forEach(function(k){var id=+String(k).split(':')[0];if(BY[id])by[id]=(by[id]||0)+1;});
 ((m&&m.firsts)||[]).forEach(function(f){if(/^addr:\d+$/.test(f.k))first[+f.k.slice(5)]=f.t;});
 return Object.keys(by).map(function(id){return {n:BY[+id],lines:by[id],t:first[id]||''};})
  .sort(function(a,b){return String(b.t).localeCompare(String(a.t))||b.lines-a.lines;});}
function stVaultCount(){
 var e=document.getElementById('stvn'); if(e)e.textContent=String(stVaultRows().length);}
function stVaultPaint(hd,box){
 var rows=stVaultRows();
 hd.textContent='Released';
 box.innerHTML=rows.length?rows.map(function(v){
   return '<div class="st-grp" style="--c:'+seatCol(v.n.b)+'"><div class="st-ghd"><b><span class="st-ring"></span>'
    +esc(v.n.k)+'</b><em>'+esc(v.n.b)+', '+v.lines+(v.lines===1?' pattern':' patterns')+'</em></div></div>';}).join('')
  :'<p class="st-none">Nothing released yet. What a release runs is kept here.</p>';}

/* ============================================================
   THE RELEASE PANEL, CUT TO HIS WORDS, AND TO THE CARD'S. Round IG: "it's
   release your selections, pace, and how many patterns ... and this, just,
   run release button." Commit 2c6e38b made that cut on the release card in
   ui/release.js, and this panel is cut the same way so the two surfaces say
   one thing: the selection as rings and nothing else, Pace, Patterns, and
   Run release. No address rows, no weights, no price, no count printed as a
   figure or a sentence. The price is still enforced, at the card's door.

   WHICH ADDRESSES, in the order his chain reads. What was picked in the bank
   first, because picking there is how he said he chooses. Otherwise what this
   entry reaches, or the last committed one's, because the chain is journal,
   imprint, release. Otherwise the three heaviest held. Every ring starts
   selected and a tap takes it out of the run; its name is its label.

   PACE AND PATTERNS ARE THE CARD'S OWN TWO FIELDS, RUN.pace and RUN.dose,
   so a setting made here is the setting the run uses and there is one of
   each. Patterns is the dose a channel, fifty by default, the engine's
   LINES_PER_CH, and Pace is 1 at speaking pace. relPick reads the pace back
   off RUN.speed, so the speed is written to match rather than the pace
   being set twice.

   RUN RELEASE BEGINS THE RUN. The setup is here, so the card opens on the
   opening rather than on a second copy of this panel. It presses the card's
   own Begin, inside this press, because Begin is also the gesture a browser
   needs before it will speak. A spent allowance has no Begin, and the card
   stays on its refusal and names the way out, which this panel must not
   duplicate. There is no Cancel here: nothing has started until Run release,
   and the card that opens carries Pause and Stop.
   ============================================================ */
var ST_OFF={};
function stRelModel(){
 var r=compute(), bySq=function(a,b){return b.sq-a.sq;};
 var picked=Object.keys(IMP_PICK).filter(function(k){return IMP_PICK[k];})
  .map(function(k){return BY[+k];}).filter(function(n){return n&&n.cf;});
 var found=stFound(), take;
 if(picked.length)take=picked.sort(bySq);
 else if(found.length)take=found.slice().sort(bySq).slice(0,3);
 else take=r.loaded.filter(function(n){return n.cf;}).sort(bySq).slice(0,3);
 return {take:take,sel:take.filter(function(n){return ST_OFF[n.i]!==true;}),bank:!!picked.length,
  added:!!(picked.length||found.length)};}
function stRelPanel(){
 var e=document.getElementById('strel'); if(!e)return;
 var M=stRelModel(), o='';
 o+='<div class="st-rlhd"><span class="st-ring"></span><h3>Release</h3></div>'
  +'<div class="st-rlmid">';
 /* The refusal stays, because with nothing held the panel would be a button
    that does nothing and no word why. */
 if(!M.take.length)o+='<p class="st-none">Nothing is held above the line yet, so there is nothing to release.</p>';
 else o+='<div class="st-rings">'+M.take.map(function(a){var on=ST_OFF[a.i]!==true;
   return '<button type="button" class="st-rq" data-rq="'+a.i+'" aria-pressed="'+on+'" '
    +'aria-label="'+esc(a.k+', '+a.b)+'" title="'+esc(a.k+', '+a.b)+'">'+crNode(a,'sm',{raw:'',title:''})+'</button>';}).join('')
  +'</div>';
 o+='</div><div class="st-rlfoot">'
  +'<div class="rel-fields st-fields">'
   +'<label class="rel-field"><span>Pace</span><input type="number" id="strpace" min="0.5" max="2" step="0.1" value="'+RUN.pace+'"></label>'
   +'<label class="rel-field"><span>Patterns</span><input type="number" id="strdose" min="1" max="'+LINES_PER_CH+'" step="1" value="'+RUN.dose+'"></label>'
  +'</div>'
  /* ENABLED ON A SELECTION, NOT ON A PRICE, so a spent allowance still
     reaches the card that refuses it and says why. */
  +'<button type="button" class="st-go" id="strun"'+(M.sel.length?'':' disabled')+'>Run release</button></div>';
 e.innerHTML=o;
 /* lit from within, in the heaviest selected seat's colour, as bright as
    that address is heavy. Round HX, B, which he did not strike.

    AND ONLY ONCE SOMETHING HAS BEEN ADDED TO IT. Round LO, his words:
    "release should not start red. It should only become red once you add
    things to it." It started lit because of the third source above: with
    nothing picked in the bank and nothing found in the journal, the panel
    offers the three heaviest addresses the field already holds, and it lit
    in the first one's colour on arrival. Root is the heaviest seat on many
    fields and Root is red, so the panel opened red on a person who had done
    nothing. The offer stays, because Run on the heaviest three is a real
    route, but it is drawn in the accent like an empty panel. The seat's
    colour arrives the moment a word the journal read or a pick from the bank
    puts something in, which is what added means here. */
 var lit=M.added&&M.sel.length;
 e.style.setProperty('--glow',lit?seatCol(M.sel[0].b):'var(--accent)');
 e.style.setProperty('--lux',lit?(0.15+0.2*Math.min(10,M.sel[0].sq)/10).toFixed(2):'.1');
 e.querySelectorAll('[data-rq]').forEach(function(b){b.onclick=function(){
  var i=+b.getAttribute('data-rq'); ST_OFF[i]=ST_OFF[i]!==true; stRelPanel();};});
 /* the card's own clamps, so a value typed here cannot be one the card
    would refuse */
 var f;
 if((f=document.getElementById('strpace')))f.onchange=function(){
  RUN.pace=Math.max(0.5,Math.min(2,Math.round((+this.value||1)*10)/10));
  RUN.speed=2.2/RUN.pace; this.value=RUN.pace;};
 if((f=document.getElementById('strdose')))f.onchange=function(){
  RUN.dose=Math.max(1,Math.min(LINES_PER_CH,Math.round(+this.value)||1)); this.value=RUN.dose;};
 var go=document.getElementById('strun');
 if(go)go.onclick=function(){
  if(!M.sel.length)return;
  RUN.speed=2.2/(RUN.pace||1);
  relPick(M.sel.map(function(n){return n.i;}));
  var begin=document.getElementById('relgo'); if(begin)begin.click();};}

/* ============================================================
   THE ANALYTICS PREVIEW, CLOSED, AT THE FOOT OF THE RELEASE COLUMN.

   Round JJ, his words: "add in a button for one of the analytic layers, just
   off the imprints ... low on the right hand side in the menu, in a closed tab
   at the very bottom. This will collect analytics from the sniffer, over the
   last week, over the last month, what are the major patterns. It branches
   naturally back to the analytic, main analytic page." And, in the same
   breath: "I'm not certain how I want that shaped yet." So this is the least
   that answers the sentence, and it is written to be thrown away when he
   shapes it: two windows, three names each, one line off Analytics, one door.

   A PATTERN HERE IS A CHARGE THE WORDS NAMED, counted by entry. The record
   keeps each entry's text and its seat totals and nothing finer, so the only
   way to say what a week of writing named is to run the sniffer, parseStory,
   over each committed entry again. That is the engine's own read and not a
   second one, and it is pure over the text: it reads the address table and
   nothing a release or a slider moves. Two things are kept out on purpose.
   An inferred imprint, because parseStory marks it as the seat's modal charge
   chosen by arithmetic and a renderer must not print it as a finding; on "my
   chest was tight and I felt scared" that is Disgust four times, which the
   words never said. And the weight, because a count of entries is a thing a
   person can check by reading their own journal, where a summed amount is a
   figure with no scale beside it.

   The word is charge and not pattern, because Patterns is already the field
   beside Run in the panel above this one, where it means how many lines a
   channel runs. One word per concept, and that one was taken first.

   RUNNING HOT IS ANALYTICS' OWN LIST, CALLED AND NOT COPIED. hotList, hotDir
   and anaHotInk are the three calls anaHot makes, so the names here are the
   first rows the full page prints and the two cannot disagree. Analytics has
   no windowed view of the journal for this to reuse, which is why the windows
   above are read here and the hot line is not. Nothing on an unread field,
   the rule anaHot already keeps.

   THE DOOR IS ANALYTICS ITSELF, since round LV. Analytics is integer 4 and
   had no door of its own for a while, folded into Summary and reached only
   through TABREAL, which is why this used to call setTab(TAB.ANALYTICS) and
   let the redirect find Summary rather than naming a tab that did not
   exist. It has its own door again, TABREAL no longer answers it with
   Summary, and the call below needs no change: it always meant Analytics
   and now it also lands there. #ana is brought into view at its Running hot
   list on arrival, which is the part of it this preview is a slice of.
   ============================================================ */
var ST_ANA_TOP=3, ST_ANA_WIN=[[7,'Last 7 days'],[30,'Last 30 days']];
/* the windows are cached on the record and the hour, so a render that moves
   nothing in the journal re-reads nothing. The hour lets the window slide. */
var STA={key:null,wins:null};
function stAnaWins(){
 var ents=(typeof CURP!=='undefined'&&CURP&&CURP.story&&CURP.story.entries)||[];
 var now=Date.now(), key=S.who+'|'+ents.length+'|'+(ents.length?ents[ents.length-1].t:'')+'|'+Math.floor(now/36e5);
 if(STA.key===key)return STA.wins;
 var far=ST_ANA_WIN[ST_ANA_WIN.length-1][0], read=[];
 /* each entry is read once, against the widest window, then bucketed */
 ents.forEach(function(e){var at=Date.parse(e&&e.t);
  if(!(at>=now-far*864e5)||typeof e.text!=='string')return;
  var got={};
  parseStory(e.text).imprints.forEach(function(im){if(im.inferred||!im.fetter)return;
   got[im.fetter]=(got[im.fetter]||0)+im.amt;});
  read.push({at:at,got:got});});
 var wins=ST_ANA_WIN.map(function(w){var from=now-w[0]*864e5,by={},n=0;
  read.forEach(function(r){if(r.at<from)return; n++;
   Object.keys(r.got).forEach(function(f){var o=by[f]=by[f]||{nm:f,n:0,amt:0};o.n++;o.amt+=r.got[f];});});
  /* ties go to the heavier, so two charges named equally often keep a stable order */
  var top=Object.keys(by).map(function(f){return by[f];})
   .sort(function(a,b){return b.n-a.n||b.amt-a.amt||(a.nm<b.nm?-1:1);}).slice(0,ST_ANA_TOP);
  return {say:w[1],entries:n,top:top};});
 STA={key:key,wins:wins};
 return wins;}
/* inline styles only, for the reason stViewHtml gives. A details element is
   closed by the platform, so the section costs its one line until it is
   opened and needs no script to open. Its state is STV's, so a redraw of the
   page does not shut it under a person reading it. */
var ST_ANA_CHEV='M9 6l6 6-6 6';
function stAnaHtml(){
 return '<details class="st-pan" id="stana"'+(STV.ana?' open':'')+' style="display:block;flex:0 0 auto;padding:0">'
  +'<summary style="display:flex;align-items:center;gap:8px;min-height:var(--tap);padding:0 16px;cursor:pointer;list-style:none">'
  +'<svg id="stanachev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="flex:0 0 auto;fill:none;'
  +'stroke:var(--dim);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--t-micro) var(--ease-out);'
  +'transform:rotate('+(STV.ana?90:0)+'deg)"><path d="'+ST_ANA_CHEV+'"/></svg>'
  +'<span class="st-eb">Analytics</span><span class="st-tag">preview</span></summary>'
  +'<div id="stanab" style="padding:0 16px 14px;font-size:13px;color:var(--mid)"></div></details>';}
function stAnaWire(){
 var d=document.getElementById('stana'); if(!d)return;
 d.addEventListener('toggle',function(){STV.ana=d.open;
  var c=document.getElementById('stanachev'); if(c)c.style.transform='rotate('+(d.open?90:0)+'deg)';
  if(d.open)stAnaPaint();});
 if(STV.ana)stAnaPaint();}
function stAnaRow(ring,name,right,title){
 return '<div style="display:flex;align-items:center;gap:8px;padding:3px 0"'+(title?' title="'+esc(title)+'"':'')+'>'
  +ring+'<span style="flex:1 1 auto;min-width:0;color:var(--ink)">'+esc(name)+'</span>'+right+'</div>';}
function stAnaHead(t,right){
 return '<div style="display:flex;justify-content:space-between;gap:8px;margin-top:12px;padding-bottom:3px;'
  +'border-bottom:1px solid var(--edge)"><span class="st-eb">'+t+'</span>'
  +'<span style="font-size:12px;color:var(--dim)">'+right+'</span></div>';}
function stAnaPaint(){
 var b=document.getElementById('stanab'); if(!b)return;
 var o='';
 stAnaWins().forEach(function(w){
  o+=stAnaHead(w.say,w.entries+(w.entries===1?' entry':' entries'));
  if(!w.entries)o+='<p class="st-none" style="margin-top:4px">Nothing written.</p>';
  else if(!w.top.length)o+='<p class="st-none" style="margin-top:4px">No charge named in words.</p>';
  else o+=w.top.map(function(t){var c=CHILD.filter(function(x){return x.nm===t.nm;})[0],col=seatCol(c?c.seat:'Heart');
   var ic=c?'<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="flex:0 0 auto;fill:none;stroke:'+col
     +';stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round"><path d="'+c.ic+'"/></svg>'
    :'<span class="st-ring" style="--c:'+col+'"></span>';
   return stAnaRow(ic,t.nm,'<em style="font-style:normal;font-size:12px;color:var(--dim)">in '
    +t.n+(t.n===1?' entry':' entries')+'</em>');}).join('');});
 var r=compute();
 if(!r.unread&&typeof hotList==='function'){
  var L=hotList();
  o+=stAnaHead('Running hot',L.length?L.length+(L.length===1?' address':' addresses'):'');
  o+=L.length?L.slice(0,ST_ANA_TOP).map(function(n){var d=hotDir(n);
    return stAnaRow('<span class="st-ring" style="--c:'+seatCol(n.b)+'"></span>',n.k,
     '<em style="font-style:normal;font-size:12px;color:'+anaHotInk(d)+'">'+d+'</em>',ANA_DIRSAY[d]||'');}).join('')
   :'<p class="st-none" style="margin-top:4px">No address is past five.</p>';}
 o+='<button type="button" class="btn" id="stanago" style="margin-top:14px">Open analytics</button>';
 b.innerHTML=o;
 var go=document.getElementById('stanago');
 if(go)go.onclick=function(){
  setTab(TAB.ANALYTICS);
  /* ON THE FRAME AFTER setTab's OWN. setTab puts the page back at its top,
     once now and once on the next frame, and stacked it is the page that
     scrolls. Brought into view straight away, measured at 390 by 844, the
     list was put on screen and then sent 4993 pixels back down it. A frame
     asked for after setTab's runs after it. */
  var bring=function(){var a=document.getElementById('ana'), at=a&&(a.querySelector('.ana-hot')||a);
   if(at&&at.scrollIntoView)at.scrollIntoView({block:'start'});};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(bring); else bring();};}

/* ============================================================
   WHAT THE SNIFFER IS READING, SHOWN IN THE SENTENCE IT READ IT IN.

   The parse already knows every word it matched and which seat that word
   belongs to. None of it reached the page: the bar said "14 tagged" and
   there was no way to see which fourteen, so the one place the instrument
   explains itself was a number.

   AND THEN IT READ THE SENTENCE TWICE, which is this pass.

   The scanner records hit.at on every hit, an offset into the normalised copy
   it scanned. This threw those offsets away and ran its own global regular
   expression over the raw text, which is a second reading of the same sentence
   by a different rule, and the two rules do not agree. Measured on an 87 word
   story: the engine read 8 hits and this lit 5. It dropped the coherent hit
   because it filtered coherent hits out of the table it built the expression
   from, so the words that take charge OFF a person were the only ones invisible
   on the surface whose whole job is to show the reading. And a phrase the
   scanner matched across punctuation could not be found at all: on "I wanted to
   shut the door, and not come out", the scanner reads one hit, marksOf lights
   the twenty two characters "shut the door, and not" and names them wanting to
   disappear, and the expression over the raw text matches nothing, because the
   normalisation the scanner read through had turned the comma into a space.

   engine/sniff.js carries normMap and marksOf now, ported from proto/story4
   where four prototypes each had a copy. One string, one set of offsets, and a
   mark lands on exactly the characters that were scored.

   AND THE NAME IS CARRIED BUT NOT DRAWN. The engine holds a label on a named
   hit, "silenced" on stayed quiet and "self-attack" on ashamed of myself, and
   marksOf carries them, so each mark states its name, its fetter, its amount
   and whether it is coherent. It is stated and not shown: this layer is
   aria-hidden and sits behind the textarea with pointer-events none, so a
   title on it reaches nobody. The gate asserts the attributes, so they are
   not decoration waiting to rot.

   A NEGATED MARK RUNS BACK OVER ITS NEGATOR AND IS STRUCK, see stMarks. It is
   still one mark per stretch marksOf placed, so the count the gate holds is
   unchanged, and the characters in the layer are still exactly the box's. */
function stHLHtml(txt){
 var p=ST_PARSED;
 if(!p||!p.hits.length)return esc(txt);
 var marks=(STR.t===txt&&STR.marks.length)?STR.marks:stMarks(txt,p);
 if(!marks.length)return esc(txt);
 var out='',last=0;
 marks.forEach(function(m){
  /* marksOf returns one mark per stretch of text, already sorted and already
     merged where a phrase covers the words inside it, so this walks forward
     and never has to decide precedence. That decision is the scanner's. */
  var from=(m.neg&&m.negFrom!=null&&m.negFrom>=last)?m.negFrom:m.s;
  out+=esc(txt.slice(last,from))
   /* A HIT CARRIES A SEAT KEY, NOT A BAND NAME. LEX stores 'throat' and
      seatCol wants 'Throat', so every word used to resolve to the same
      fallback and six fetters across four seats came out in one colour, which
      is the opposite of the point. marksOf has already run the key through
      K2BAND and put the answer in m.bn. A coherent hit has no seat, because
      it is not charge at an address, so it takes the accent the way an
      unseated hit always has here. */
   +'<mark class="st-f'+(m.neg?' neg':'')+'" style="--c:'+(m.bn?seatCol(m.bn):'var(--accent)')+'"'
   +(m.label?' data-nm="'+esc(m.label)+'"':'')
   +(m.fet?' data-fet="'+esc(m.fet)+'"':'')
   +(m.amt!=null?' data-amt="'+esc(m.amt)+'"':'')
   +(m.coh?' data-coh="1"':'')
   +'>'+esc(txt.slice(from,m.e))+'</mark>';
  last=m.e;});
 return out+esc(txt.slice(last));}
function stPaintHL(){
 var hl=document.getElementById('sthl'); if(!hl)return;
 /* the trailing newline keeps the last line's height when the text ends on
    a return, so the two layers stay the same height. */
 hl.innerHTML=stHLHtml(ST_TEXT)+'\n';
 var ta=document.getElementById('sttext'); if(ta)hl.scrollTop=ta.scrollTop;}

/* RECORDING FAILED SILENTLY, WHICH IS WHY IT LOOKED BROKEN.

   Every failure path here flipped the button back to its resting state and
   said nothing: a person pressed Record, the browser refused, and the
   control simply un-pressed itself. The standing rule in this product is
   that every write which can fail reports through status() and a control
   never claims success before it has it. This one broke it three ways.

   Speech recognition needs a secure context. On a file:// page the
   constructor exists and start() either throws or fails on the first
   result, which is the most common way this is met and the one that reads
   most like the feature being broken. It is named now, before anything is
   attempted.

   start() can also throw synchronously, and onerror carries a reason that
   was being discarded. Both are reported in the words that fit them: a
   refused permission is a different problem from no microphone, and a
   person can act on the difference. */
/* THE CLOCK, ROUND LV: "I want the time showing how long my recording is."
   ST_LISTEN_T0 is stamped the instant start() actually succeeds, not the
   instant the button is pressed, so a start that throws or a browser that
   refuses never shows a clock ticking over a recording that is not
   running. stFrame reads it every frame the Story tab is up, the same frame
   the chart already draws on, so this costs no second loop; it only ever
   writes the one span's textContent, and only when the second it shows has
   actually changed. */
var ST_LISTEN_T0=null;
function stMicFmt(ms){
 var s=Math.max(0,Math.floor(ms/1000)), m=Math.floor(s/60); s=s%60;
 return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
function stMicElapsed(){return ST_LISTEN_T0?performance.now()-ST_LISTEN_T0:0;}
function stMicTick(){
 if(!ST_LISTEN||!ST_LISTEN_T0)return;
 var e=document.getElementById('stmictime'); if(!e)return;
 var v=stMicFmt(stMicElapsed());
 if(e.textContent!==v)e.textContent=v;}
function stMicSay(code){
 var M={'not-allowed':'Recording needs microphone permission. Allow it in the browser and press Record again.',
  'service-not-allowed':'The browser blocked speech recognition for this page.',
  'audio-capture':'No microphone was found.',
  'network':'Speech recognition could not reach the network.',
  'no-speech':'Nothing was heard. Press Record and speak, or type it.',
  'aborted':''};
 var m=(code in M)?M[code]:('Recording stopped: '+code+'.');
 if(m)status(m,'fail');}
function stMic(){
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 /* alert() blocks the page and is not the status region, which is the app's
    one writer for anything that can fail. */
 if(!SR){ ST_LISTEN=false; ST_LISTEN_T0=null; stRender();
  status('This browser has no speech recognition. Typing works.','fail'); return; }
 /* named before it is attempted, because this is the common case and the
    failure it produces otherwise is indistinguishable from a broken button. */
 if(typeof isSecureContext!=='undefined'&&!isSecureContext){
  ST_LISTEN=false; ST_LISTEN_T0=null; stRender();
  status('Recording needs a secure page. Opened from a file, the browser will '
   +'not turn the microphone on. Typing works.','fail'); return; }
 if(ST_REC&&ST_LISTEN){ ST_REC.stop(); ST_LISTEN=false; ST_LISTEN_T0=null; stRender(); return; }
 ST_REC=new SR(); ST_REC.continuous=true; ST_REC.interimResults=true; ST_REC.lang='en-US';
 var base=ST_TEXT;
 ST_REC.onresult=function(e){var s='';
  for(var i=e.resultIndex;i<e.results.length;i++) s+=e.results[i][0].transcript;
  ST_TEXT=(base+' '+s).trim();
  ST_PARSED=ST_TEXT?parseStory(ST_TEXT):null; stRender();};
 ST_REC.onend=function(){ST_LISTEN=false;ST_LISTEN_T0=null;stRender();};
 ST_REC.onerror=function(e){ST_LISTEN=false;ST_LISTEN_T0=null;stRender();
  stMicSay((e&&e.error)||'unknown');};
 try{ ST_REC.start(); ST_LISTEN=true; ST_LISTEN_T0=performance.now(); stRender();
  status('Recording. Press again to stop.','ok'); }
 catch(err){ ST_LISTEN=false; ST_LISTEN_T0=null; stRender();
  status('Recording could not start. '+(err&&err.message?err.message:'')+
   ' Typing works.','fail'); }}
