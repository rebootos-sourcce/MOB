/* ---- the journal ---- */
function stRender(){
 var h=document.getElementById('story'); if(!h) return;
 var p=ST_PARSED;
 var out='<div class="st-wrap">'
  +'<div class="st-col st-write">'
  +'<div class="st-hd"><span class="pm-eye">The day</span>'
   +'<button class="st-mic'+(ST_LISTEN?' on':'')+'" id="stmic">'+(ST_LISTEN?'Listening':'Speak')+'</button></div>'
  +'<textarea id="sttext" class="st-ta" spellcheck="false" '
  +'placeholder="What happened. Write it the way you would say it out loud.">'+esc(ST_TEXT)+'</textarea>'
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
 if(ta)ta.oninput=function(){ ST_TEXT=ta.value;
  ST_PARSED=ST_TEXT.trim()?parseStory(ST_TEXT):null; stRefresh(); };
 var cl=document.getElementById('stclear');
 if(cl)cl.onclick=function(){ST_TEXT='';ST_PARSED=null;stRender();};
 var ap=document.getElementById('stapply');
 if(ap)ap.onclick=function(){
  if(!ST_PARSED||!ST_PARSED.imprints.length)return;
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
 impRender();
 if(keep){keep.focus(); try{keep.setSelectionRange(pos,pos);}catch(e){}}}
function stMic(){
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 /* alert() blocks the page and is not the status region, which is the app's
    one writer for anything that can fail. */
 if(!SR){ ST_LISTEN=false; stRender();
  status('This browser has no speech recognition. Typing works.'); return; }
 if(ST_REC&&ST_LISTEN){ ST_REC.stop(); ST_LISTEN=false; stRender(); return; }
 ST_REC=new SR(); ST_REC.continuous=true; ST_REC.interimResults=true; ST_REC.lang='en-US';
 var base=ST_TEXT;
 ST_REC.onresult=function(e){var s='';
  for(var i=e.resultIndex;i<e.results.length;i++) s+=e.results[i][0].transcript;
  ST_TEXT=(base+' '+s).trim();
  ST_PARSED=ST_TEXT?parseStory(ST_TEXT):null; stRender();};
 ST_REC.onend=function(){ST_LISTEN=false;stRender();};
 ST_REC.onerror=function(){ST_LISTEN=false;stRender();};
 ST_REC.start(); ST_LISTEN=true; stRender();}
