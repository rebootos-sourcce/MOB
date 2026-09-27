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
  /* ---- the write column: Source AI over the journal ---- */
  +'<div class="st-colw">'
  /* THE COLUMN BESIDE THE JOURNAL WAS SOURCE AI, AND IT IS ABOVE IT NOW. HT in
     TASKS.md, his words: "above the journal part will be a prompt engine." It
     keeps its id, #stsrc, and its one speaking line, so a screen reader still
     hears only what it says. */
  +'<div class="st-pe" id="stsrc" aria-label="Source AI"></div>'
  +'<div class="st-pan st-jr" id="stjr">'
  /* SPEAK BECAME RECORD, AND IT CARRIES ITS STATE.

     Speak is what you do, record is what the control does, and the ruling
     everywhere else in this product is that a menu word describes exactly
     what the thing does. The dot says which mode you are in without reading
     the label: green while it is recording, red while you are typing. */
  +'<div class="st-hd"><span class="pm-eye">The day</span>'
   +'<button class="st-mic'+(ST_LISTEN?' on':'')+'" id="stmic" type="button" '
   +'title="'+(ST_LISTEN?'Recording. Press to stop and keep what it heard.'
     :'Record what happened out loud instead of typing it.')+'">'
   +'<span class="st-dot"></span>'
   +'<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">'
   +'<rect x="9" y="3" width="6" height="11" rx="3"/>'
   +'<path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg>'
   +'<span>'+(ST_LISTEN?'Recording':'Record')+'</span></button>'
   /* WHERE THE AUDIO GOES, SAID BEFORE IT GOES THERE.

      The owner keeps the microphone and promises the data is never sold, and
      both of those are true. A third fact is also true and was nowhere on
      screen: browser speech recognition is a network service, so the audio
      reaches the browser vendor. We do not sell it and we do not control it
      either, which is exactly why it has to be said rather than assumed.

      One line, always visible, not a dialog. A dialog asks for a decision the
      person cannot yet make anything of, and it would sit between somebody and
      the thing they came to do. Typing stays the equal path and is named here
      so the alternative is in the same sentence as the cost. */
   +'<span class="st-mnote">Recording sends the audio to your browser\'s '
   +'speech service. Typing does not leave this device.</span></div>'
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
      vault, which is what's been released." Both are icons with their word
      beside them at 1600 and the icon alone on a phone. */
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
   +'<div class="st-ctr" id="stctr"></div></div>'
  +'<div class="st-pan st-ls" id="stls" aria-label="Imprints, listed">'
   +'<div class="st-lshd" id="stlshd"></div><div class="st-lsb" id="stimps"></div></div>'
  +'</div>'
  /* ---- the release column. It keeps the id its rail section had. ---- */
  +'<div class="st-colx"><div class="st-rl" id="strel" aria-label="Release"></div></div>'
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
 var cl=document.getElementById('stclear');
 if(cl)cl.onclick=function(){ST_TEXT='';ST_PARSED=null;SRC_PASSED=false;stRender();};
 var ap=document.getElementById('stapply');
 if(ap)ap.onclick=function(){
  if(!ST_PARSED||!ST_PARSED.imprints.length)return;
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
   return;}
  /* the field is about to change and until now there was no way back */
  undoPush('committing the story');
  /* WHAT THIS ENTRY FOUND IS KEPT FOR THE RELEASE, because the chain he ruled
     is journal, imprint, release. The box empties on commit, so without this
     the release would fall back to the heaviest held the moment the entry it
     was offering left the page. Read before applyStory moves the field. */
  var kept=stFound(), k=ST_PARSED.imprints.length;
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
  ST_TEXT='';ST_PARSED=null;SRC_PASSED=false;STV.lastFound=kept;
  /* the release takes the room on a desktop. On a phone it stays the bar
     with Run on it: widening it there would push Run off the first screen,
     which is the one thing layout H exists to stop. */
  STV.focus=stPhone()?'write':'release';
  toYou();syncCh();stRender();render();
  status('Committed. '+k+(k===1?' imprint':' imprints')+' written to the field.');};
 var mic=document.getElementById('stmic');
 if(mic)mic.onclick=stMic;}

/* ============================================================
   THE PAGE'S OWN STATE. None of it is a reading: which way the lanes are
   sorted, which column has the room, which list is up, and whether the bank
   is open. Kept across a return to the tab, never saved.
   ============================================================ */
var STV={sort:'seat',focus:'write',list:'entry',bank:false,lastFound:[],hot:null};
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
 on('stvault','click',function(){
  STV.list=STV.list==='vault'?'entry':'vault';
  this.setAttribute('aria-pressed',STV.list==='vault');
  stFocus('read'); stListPaint();});
 var cv=document.getElementById('stcv');
 if(cv){
  cv.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),y=e.clientY-r.top,k=null;
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
 /* the bank only while it is open. Closed, its rail is not drawn, and
    stBank repaints it on the way in, so nothing stale is ever on screen.
    Repainting it here on every render() was measured doubling the work a
    lighting change does on this tab. */
 if(STV.bank)impRender();}

/* ============================================================
   SOURCE AI, THE SPEAKING HALF. The listening half is engine/sourceai.js
   and the whole behaviour is written down in reviews/SPEC-source-ai.md.

   Scripted, and it says so. No model is called: every line below is chosen
   by srcTurn off a count the person can check in their own words.

   Four moves, and the person decides which one it makes:
     open    the opening question, and one simple one to start from
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
   it discerns the energy and does not define it. Never a because, since
   nothing the instrument measures is a cause. It asks why and the person
   answers, which is how the root gets found by the person who carries it.

   THE HEARD ROWS WENT TO THE CHART. They printed each seat, the words heard
   there and the rung, which is exactly what a lane of the instrument now
   draws: the name, the words standing on it, and the ten pips at its right.
   Printing both would be the same reading in two places to disagree.
   ============================================================ */
var SRC_PASSED=false;
/* the opener is his own sentence, one of the two he offered. "Writing"
   rather than "talking", because this surface is the journal. */
var SRC_OPEN='What are we writing about today?';
/* SIMPLE, STRAIGHTFORWARD, DEEP. His three words for what the page should
   ask. Each is a physical event a person can answer from memory, the shape
   funnel/questions.js already proved works in this product, and none of them
   names a feeling for the person. One at a time, turned by the day, so the
   page does not become furniture. */
var SRC_JOG=['What happened today that your body is still holding?',
 'Where did you feel it first?',
 'What did you not say?',
 'Who was in the room?',
 'What keeps coming back?',
 'What did you do straight after?'];
function srcSeatSay(b){
 return b==='Solar'?'the solar plexus':(b==='3rd Eye'?'the third eye':'the '+String(b).toLowerCase());}
function srcTimes(n){return n===2?'twice':(n===3?'three times':n+' times');}
/* the one question, by the evidence that raised it. Why, every time, and
   about a place rather than a label. */
function srcAsk(t){
 var at=srcSeatSay(t.band);
 if(t.why==='root')
  return 'You keep coming back to '+at+', here and in what you wrote before. Why do you think that is?';
 if(t.why==='earlier')
  return at.charAt(0).toUpperCase()+at.slice(1)+' was in an earlier entry too. Why do you think it comes back?';
 return at.charAt(0).toUpperCase()+at.slice(1)+' comes up '+srcTimes(t.mentions)
  +' in this. Why do you think it keeps landing there?';}
/* ten marks, filled to the rung, the last four drawn as the end it asks at.
   Drawn and never printed, because a reading is not a score. */
function srcPips(rung,col){
 var s='<span class="src-pips" aria-hidden="true" style="--c:'+col+'">';
 for(var i=1;i<=10;i++)s+='<i class="'+(i<=rung?'on':'')+(i>=SRC_ASK?' ask':'')+'"></i>';
 return s+'</span>';}
function srcPaint(){
 var h=document.getElementById('stsrc'); if(!h)return;
 var heard=STR.heard||srcHear(ST_TEXT,null);
 var turn=srcTurn(heard,{typed:!!ST_TEXT.trim(),passed:SRC_PASSED});
 var o='<div class="src-hd"><span class="pm-eye">Source AI</span>'
  +'<span class="src-tag">scripted</span></div>';
 if(turn.move==='open'){
  var d=Math.floor(Date.now()/864e5), k=d%SRC_JOG.length;
  o+='<p class="src-open">'+esc(SRC_OPEN)+'</p>'
   +'<p class="src-jog">Or start from <q>'+esc(SRC_JOG[k])+'</q></p>';}
 else if(turn.move==='ask'){
  o+='<p class="src-q" style="--c:'+seatCol(turn.band)+'">'+esc(srcAsk(turn))+'</p>'
   +'<div class="src-row"><button type="button" class="btn" id="srcpass">Move on</button>'
   +'<span class="src-note">Answer in the journal, or leave it.</span></div>';}
 else if(turn.move==='pass'){
  o+='<p class="src-q">Cool.</p><p class="src-note">Nothing more asked in this entry.</p>';}
 else{
  o+='<p class="src-open quiet">'+esc(SRC_OPEN)+'</p>';
  if(heard.top)o+='<div class="src-row"><span class="src-gauge" style="--c:'+seatCol(heard.top.band)+'">'
   +'<span>Next question</span>'+srcPips(heard.top.rung,seatCol(heard.top.band))
   +'<span class="src-seat">'+esc(heard.top.band)+'</span></span></div>';
  else o+='<p class="src-note">Nothing read yet, so nothing is asked. Say what your body did, and where.</p>';}
 h.innerHTML=o;
 var said=turn.move==='open'?SRC_OPEN:(turn.move==='ask'?srcAsk(turn):(turn.move==='pass'?'Cool.':''));
 var sy=document.getElementById('srcsay');
 if(sy&&sy.textContent!==said)sy.textContent=said;
 var mv=document.getElementById('srcpass');
 if(mv)mv.onclick=function(){SRC_PASSED=true; srcPaint();};}
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
 GL:94,GR:64,FLOOR:22,TOP:6,
 sync:function(){var now={},items=STC.items;
  STC.stressTo=performance.now()+ST_STRESS_MS;
  STR.marks.forEach(function(m){now[m.key]=m;
   if(!items[m.key])items[m.key]={m:m,g:REDUCED?1:0,gv:0,alive:true};
   else{items[m.key].m=m;items[m.key].alive=true;}});
  Object.keys(items).forEach(function(k){if(!now[k])items[k].alive=false;});
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
 if(!STC.cv||!STC.cv.isConnected){if(document.getElementById('stcv'))stSize();else return;}
 var dt=Math.min(.05,(ts-(STC.last||ts))/1000); STC.last=ts;
 var live=!REDUCED&&STC.lm.dwell&&performance.now()<(STC.stressTo||0);
 var moving=stStep(dt);
 /* one more frame once the pulse ends, so it comes to rest at the still phase */
 if(!live&&STC.pulsing){STC.pulsing=false;STC.dirty=true;}
 if(live)STC.pulsing=true;
 if(!moving&&!live&&!STC.dirty)return;
 STC.dirty=false; stDraw();}
function stDraw(){
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

/* ---- the words under the chart and the tag beside its name ---- */
function stPendPaint(){
 var e=document.getElementById('stpend'); if(!e)return;
 var n=ST_PARSED?ST_PARSED.imprints.length:0;
 e.textContent=n?n+' pending':(ST_TEXT.trim()?'Nothing kept yet':(STV.lastFound.length?'Committed':'not read yet'));
 var l=document.getElementById('stlist'); if(l)l.textContent=n?'List '+n:'List';}
function stCtrPaint(){
 var e=document.getElementById('stctr'); if(!e)return;
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
 return {take:take,sel:take.filter(function(n){return ST_OFF[n.i]!==true;}),bank:!!picked.length};}
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
    that address is heavy. Round HX, B, which he did not strike. */
 e.style.setProperty('--glow',M.sel.length?seatCol(M.sel[0].b):'var(--accent)');
 e.style.setProperty('--lux',M.sel.length?(0.15+0.2*Math.min(10,M.sel[0].sq)/10).toFixed(2):'.1');
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
 if(!SR){ ST_LISTEN=false; stRender();
  status('This browser has no speech recognition. Typing works.','fail'); return; }
 /* named before it is attempted, because this is the common case and the
    failure it produces otherwise is indistinguishable from a broken button. */
 if(typeof isSecureContext!=='undefined'&&!isSecureContext){
  ST_LISTEN=false; stRender();
  status('Recording needs a secure page. Opened from a file, the browser will '
   +'not turn the microphone on. Typing works.','fail'); return; }
 if(ST_REC&&ST_LISTEN){ ST_REC.stop(); ST_LISTEN=false; stRender(); return; }
 ST_REC=new SR(); ST_REC.continuous=true; ST_REC.interimResults=true; ST_REC.lang='en-US';
 var base=ST_TEXT;
 ST_REC.onresult=function(e){var s='';
  for(var i=e.resultIndex;i<e.results.length;i++) s+=e.results[i][0].transcript;
  ST_TEXT=(base+' '+s).trim();
  ST_PARSED=ST_TEXT?parseStory(ST_TEXT):null; stRender();};
 ST_REC.onend=function(){ST_LISTEN=false;stRender();};
 ST_REC.onerror=function(e){ST_LISTEN=false;stRender();
  stMicSay((e&&e.error)||'unknown');};
 try{ ST_REC.start(); ST_LISTEN=true; stRender();
  status('Recording. Press again to stop.','ok'); }
 catch(err){ ST_LISTEN=false; stRender();
  status('Recording could not start. '+(err&&err.message?err.message:'')+
   ' Typing works.','fail'); }}
