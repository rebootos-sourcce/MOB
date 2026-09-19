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
   +'<span>'+(ST_LISTEN?'Recording':'Record')+'</span></button></div>'
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
  +'<div class="st-col st-read" id="imp"></div></div>';
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
 var cl=document.getElementById('stclear');
 if(cl)cl.onclick=function(){ST_TEXT='';ST_PARSED=null;stRender();};
 var ap=document.getElementById('stapply');
 if(ap)ap.onclick=function(){
  if(!ST_PARSED||!ST_PARSED.imprints.length)return;
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
