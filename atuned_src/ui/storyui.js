/* ---- the journal ---- */
function stRender(){
 var h=document.getElementById('story'); if(!h) return;
 var p=ST_PARSED;
 var out='<div class="st-wrap">'
  +'<div class="st-col st-write">'
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
  +'<textarea id="sttext" class="st-ta" spellcheck="false" '
  +'placeholder="What happened. Write it the way you would say it out loud.">'+esc(ST_TEXT)+'</textarea></div>'
  +'<div class="st-bar">'
   +'<span class="st-ct">'+(ST_TEXT.trim()?ST_TEXT.trim().split(/\s+/).length:0)+' words'
   +(p?', '+p.hits.length+' tagged':'')+'</span>'
   +'<button class="btn" id="stclear">Clear</button>'
   +'<button class="btn pri" id="stapply"'+(p&&p.imprints.length?'':' disabled')+'>'
    +'Commit '+(p?p.imprints.length:0)+'</button>'
  +'</div></div>'
  /* THE RIGHT COLUMN IS TWO HALVES THAT SCROLL ON THEIR OWN. Ruled.

     Imprints on top, the release and every setting it takes on the bottom, so
     a person can see what the sniffer found and run a release against it
     without leaving the page they wrote on. The release was reachable only
     from a button somewhere else, which meant the two halves of one act were
     on two surfaces. */
  +'<div class="st-col st-read">'
   +'<div class="st-half st-imp" id="imp"></div>'
   +'<div class="st-half st-rel" id="strel"></div>'
  +'</div></div>';
 h.innerHTML=out;
 impRender();
 var ta=document.getElementById('sttext');
 if(ta){ta.oninput=function(){ ST_TEXT=ta.value;
  ST_PARSED=ST_TEXT.trim()?parseStory(ST_TEXT):null; stRefresh(); };
  /* the layer behind has to travel with the text, or a long entry drifts
     out of register the moment the box scrolls. */
  ta.onscroll=function(){var hl=document.getElementById('sthl');
   if(hl){hl.scrollTop=ta.scrollTop;hl.scrollLeft=ta.scrollLeft;}};}
 stPaintHL();
 stRelPanel();
 var cl=document.getElementById('stclear');
 if(cl)cl.onclick=function(){ST_TEXT='';ST_PARSED=null;stRender();};
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
     already uses for the same crossing. */
  if(typeof S!=='undefined'&&S.who!==0){
   status('You are looking at '+(((typeof PEOPLE!=='undefined'&&PEOPLE[S.who])||{}).nm
    ||'a reference case')+', which is a worked example rather than your record. '
    +'Switch to your own profile to commit a story.','fail');
   return;}
  /* the field is about to change and until now there was no way back */
  undoPush('committing the story');
  applyStory(ST_TEXT); verpApply(ST_TEXT); leanApply(ST_TEXT);
  if(CURP){CURP.story=CURP.story||{entries:[]};
   CURP.story.entries.push({t:new Date().toISOString(),text:ST_TEXT,
    imprints:ST_PARSED.imprints.length,bands:ST_PARSED.bands});
   pSave();pSnap();}
  ST_TEXT='';ST_PARSED=null;
  toYou();syncCh();stRender();render();};
 var mic=document.getElementById('stmic');
 if(mic)mic.onclick=stMic;}
/* ============================================================
   THE RELEASE PANEL, on the story, under the imprints.

   Every setting a run takes, stated before it starts, because a person is
   entitled to see what a run costs before they begin it. How many patterns,
   how fast, and which ones: the heaviest first, or the ones this story just
   found.
   ============================================================ */
/* the pace, in seconds a line. Named rather than numeric, because a person
   choosing how fast to run a release is choosing a feeling and not a number. */
var RUN_SPEED_S={Slow:3.2, Steady:2.2, Quick:1.4};
var ST_RELN=3, ST_RELSRC='heavy', ST_RELSPD='Steady';
function stRelPanel(){
 var e=document.getElementById('strel'); if(!e)return;
 var r=compute();
 var live=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;});
 var found=[];
 if(ST_PARSED)ST_PARSED.imprints.forEach(function(im){
  var n=BY[im.node]; if(n&&found.indexOf(n)<0)found.push(n);});
 var pool=(ST_RELSRC==='story'&&found.length)?found:live;
 var take=pool.slice(0,ST_RELN);
 /* WHAT THE RUN ACTUALLY COSTS, asked of the meter rather than guessed from
    the number of addresses. The panel used to print take.length followed by
    the word patterns, and take.length is how many ADDRESSES were picked. One
    pattern is one thought line, ruled, so a person choosing three was told
    three and the run spent up to twenty five from their allowance. On the free
    tier that is a fortnight's grant against a quote of three.

    meterPlan is the same call the run itself makes, with the same cap, so this
    is the price and not an estimate of it. CHAN lives in release.js, which
    loads after this module, and that is fine because this runs at render. */
 var relIds=take.map(function(n){return n.i;});
 var relCh=(typeof CHAN!=='undefined')?CHAN.map(function(c){return c[0]+c[2];}):[];
 var cost=(CURP&&relIds.length&&relCh.length)
   ? meterPlan(CURP,relIds,relCh,RUN_MAX).length : 0;
 var secs=Math.round(cost*RUN_SPEED_S[ST_RELSPD]);
 e.innerHTML='<div class="pm-eye">Release</div>'
  +'<p class="st-relp">'+(pool.length
    ? 'Pick how much to run. Each pattern is one thought line at one address.'
    : 'Nothing is held above the line yet, so there is nothing to release.')+'</p>'
  +'<div class="st-rrow"><span class="st-rlab">From</span>'
   +'<button type="button" class="st-rb'+(ST_RELSRC==='heavy'?' on':'')+'" data-rsrc="heavy">Heaviest</button>'
   +'<button type="button" class="st-rb'+(ST_RELSRC==='story'?' on':'')+'" data-rsrc="story">'
   +'This story'+(found.length?' '+found.length:'')+'</button></div>'
  /* ADDRESSES, because that is what these numbers pick. It said Patterns, and
     a pattern is a thought line, so the label named the wrong unit entirely. */
  +'<div class="st-rrow"><span class="st-rlab">Addresses</span>'
   +[1,3,5,8].map(function(n){
     return '<button type="button" class="st-rb'+(ST_RELN===n?' on':'')+'" data-rn="'+n+'">'
      +n+'</button>';}).join('')+'</div>'
  +'<div class="st-rrow"><span class="st-rlab">Pace</span>'
   +Object.keys(RUN_SPEED_S).map(function(k){
     return '<button type="button" class="st-rb'+(ST_RELSPD===k?' on':'')+'" data-rsp="'+k+'">'
      +k+'</button>';}).join('')+'</div>'
  +'<div class="st-rlist">'+(take.length?take.map(function(n){
     return '<div class="st-rit">'+crbNode(n,'xs')+'<span>'+esc(n.k)+'</span>'
      +'<em>'+esc(n.b)+'</em></div>';}).join('')
    :'<div class="rnone">Nothing to run.</div>')+'</div>'
  +'<div class="st-rfoot"><span>'+(take.length
    ? take.length+(take.length===1?' address, ':' addresses, ')
      +cost+(cost===1?' pattern, about ':' patterns, about ')+secs+' seconds'
    : '')+'</span>'
   +'<button class="btn pri" id="strun"'+(take.length?'':' disabled')+'>Run a release</button></div>';
 e.querySelectorAll('[data-rsrc]').forEach(function(b){b.onclick=function(){
  ST_RELSRC=b.getAttribute('data-rsrc'); stRelPanel();};});
 e.querySelectorAll('[data-rn]').forEach(function(b){b.onclick=function(){
  ST_RELN=+b.getAttribute('data-rn'); stRelPanel();};});
 e.querySelectorAll('[data-rsp]').forEach(function(b){b.onclick=function(){
  ST_RELSPD=b.getAttribute('data-rsp'); stRelPanel();};});
 var go=document.getElementById('strun');
 if(go)go.onclick=function(){
  if(!take.length)return;
  RUN.speed=RUN_SPEED_S[ST_RELSPD];
  relPick(take.map(function(n){return n.i;}));};}

/* refresh only the read column so typing never loses the caret */
function stRefresh(){
 var keep=document.getElementById('sttext'), pos=keep?keep.selectionStart:0;
 var ct=document.querySelector('.st-ct');
 if(ct)ct.textContent=(ST_TEXT.trim()?ST_TEXT.trim().split(/\s+/).length:0)+' words'
  +(ST_PARSED?', '+ST_PARSED.hits.length+' tagged':'');
 var ap=document.getElementById('stapply');
 if(ap){ap.disabled=!(ST_PARSED&&ST_PARSED.imprints.length);
  ap.textContent='Commit '+(ST_PARSED?ST_PARSED.imprints.length:0);}
 /* the highlight is refreshed with the count, not with the whole surface,
    because stRefresh exists so typing never loses the caret. */
 stPaintHL();
 impRender();
 if(keep){keep.focus(); try{keep.setSelectionRange(pos,pos);}catch(e){}}}
/* WHAT THE SNIFFER IS READING, SHOWN IN THE SENTENCE IT READ IT IN.

   The parse already knows every word it matched and which seat that word
   belongs to. None of it reached the page: the bar said "14 tagged" and
   there was no way to see which fourteen, so the one place the instrument
   explains itself was a number.

   The hits carry an offset into a normalised string, lowercased and stripped
   of punctuation, so those offsets do not address the text a person actually
   typed. Rather than make the engine carry two coordinate systems, the words
   themselves are matched back against the original, longest first so a
   phrase wins over the words inside it, which is the same precedence the
   sniffer uses. */
function stHLHtml(txt){
 var p=ST_PARSED;
 if(!p||!p.hits.length)return esc(txt);
 var band={};
 p.hits.forEach(function(h){ if(h.t&&h.band&&h.band!=='coherent')band[h.t]=h.band; });
 var words=Object.keys(band).sort(function(a,b){return b.length-a.length;});
 if(!words.length)return esc(txt);
 var rx;
 try{ rx=new RegExp('\\b('+words.map(function(w){
   return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|')+')\\b','gi'); }
 catch(e){ return esc(txt); }
 var out='', last=0, m;
 while((m=rx.exec(txt))!==null){
  out+=esc(txt.slice(last,m.index));
  /* A HIT CARRIES A SEAT KEY, NOT A BAND NAME.

     LEX stores 'throat' and seatCol wants 'Throat', so every word resolved
     to the same fallback and six fetters across four different seats came
     out in one colour, which is the opposite of the point. K2BAND is the
     map the sniffer already uses for exactly this. */
  var k=band[m[0].toLowerCase()]||band[m[0]];
  var bn=K2BAND[k]||k;
  out+='<mark class="st-f" style="--c:'+(bn?seatCol(bn):'var(--accent)')+'">'
   +esc(m[0])+'</mark>';
  last=m.index+m[0].length;
  if(rx.lastIndex===m.index)rx.lastIndex++;}
 out+=esc(txt.slice(last));
 return out;}
function stPaintHL(){
 var hl=document.getElementById('sthl'); if(!hl)return;
 /* the trailing newline keeps the last line's height when the text ends on
    a return, so the two layers stay the same height. */
 hl.innerHTML=stHLHtml(ST_TEXT)+'\n';}

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
