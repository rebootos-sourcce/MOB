/* ============================================================
   SOURCE AI TALKS ON THE SUMMARY, IN PLACE. Ruled 27 November, his words: "I
   also want my Source AI button here so I can press it and have Source AI
   talk to me about this stuff... that shouldn't take me to a brand new page.
   That should be a little button that activates source as a conversational AI
   on that page." DECISIONS.md, "The Summary is who I am today and what Source
   AI is seeing", is the ruling and the 21 November button that jumped to
   Discover is gone.

   WHY IT IS NOT THE JOURNAL'S CONVERSATION. Every turn of that one goes
   through srcTurnCommit (ui/storyui.js), which writes the person's words into
   the journal entry (ST_TEXT), reads it again as a story and saves the draft.
   A Summary conversation run through it would be filed as a journal entry the
   person never wrote. The voice and the microphone are not tied to the
   Journal, though: stSrcSpeak is the one voice and touches no Journal
   document, and ui/stksay.js already runs a separate talk session the same
   way, its own recogniser and a closed set of answers. This is a sibling of
   that file, copied and renamed, and nothing here writes ST_TEXT or SRC_CHAT
   or keeps the conversation anywhere.

   WHAT SHE TALKS ABOUT is what the page already says: the three paragraphs of
   the Reading (sumStoryParts, the same array the page prints, with the meaning
   spans stripped because the page's meanings are for the eye) and the stack
   in the left rail. No sentence is composed here. A question outside that set
   gets one fixed line, because a missed question costs one honest line and an
   invented answer costs the instrument.

   THE STATE LIVES HERE AND NEVER IN THE DOM. sumRender writes the whole of
   #sumbody on every render, so a button that kept its own phase would reset to
   idle mid sentence. SUM_TALK is read back by sumTalkBtn and sumTalkPanel, and
   a press repaints only those two nodes (sumTalkPaint), never sumRender.
   ============================================================ */
var SUM_TALK={phase:'idle', seq:0, vseq:0, playing:false, live:'', rec:null, t:0, turns:[], who:null};
/* Source AI's opening offer, and the one line for anything outside the set */
var SUM_TALK_ASK='Ask about your blueprint, your body, your energy or your stack.';
/* a spoken line is kept under the voice's own thirty second cut
   (SRC_VOICE_MAX, ui/storyui.js): about three sentences, and never past this
   many characters, which at a spoken pace is well inside it */
var SUM_TALK_MAXCH=480;

/* ---- the words, read off the page's own Reading ---- */
function sumTalkTidy(t){
 return String(t||'').replace(/ ([.,;:!?])/g,'$1').replace(/\s+/g,' ').trim();}
/* the Reading's paragraphs as plain sentences: the page's markup out, and the
   meaning spans (.s-un) out with it, so what is spoken is the reading and not
   the glossary standing beside it */
function sumTalkParas(r){
 return sumStoryParts(r).map(function(p){
  return sumTalkTidy(sumPlain(String(p).replace(/<span class="s-un">[^<]*<\/span>/g,'')));});}
function sumTalkSentences(t){return String(t||'').match(/[^.!?]+[.!?]+(?=\s|$)/g)||(t?[t]:[]);}
/* the first n sentences of a paragraph, whole, stopping before the limit */
function sumTalkTake(t,n){
 var out=[], len=0;
 sumTalkSentences(t).forEach(function(s){
  s=s.trim(); if(!s||out.length>=n)return;
  if(out.length&&len+s.length>SUM_TALK_MAXCH)return;
  out.push(s); len+=s.length+1;});
 return out.join(' ');}
function sumTalkOffer(){return stkSayCanHear()?' '+SUM_TALK_ASK:'';}
/* THE OPENING: the first sentence of each paragraph, then the offer */
function sumTalkOpening(r){
 var line=sumTalkParas(r).map(function(p){return sumTalkTake(p,1);}).filter(Boolean).join(' ');
 return (line+sumTalkOffer()).trim();}
/* THE STACK, SAID. The root, the domain and the two archetypes, read off the
   same state the left rail's bars read. No percent is spoken. */
function sumTalkStack(){
 var p=PEOPLE[S.who]||PEOPLE[0], sp=spiritual(p.nm)||spiritualOf(bornAsBirth(CURP));
 var out=[], roots=ssRoots(sp);
 if(roots.length)out.push('Your root is '+stkSayList(roots)+'.');
 var doms=(S.doms||[]).filter(function(i){return DOMAINS[i];}).map(function(i){return DOMAINS[i].nm;});
 if(doms.length)out.push('Your domain is '+stkSayList(doms)+'.');
 var a0=ARCH[(S.arcs||[])[0]], a1=ARCH[(S.arcs||[])[1]];
 if(a0)out.push('Your first archetype is '+a0.nm+(a1?', and your second is '+a1.nm:'')+'.');
 return out.length?out.join(' '):'Nothing in your stack is chosen yet.';}
/* WHAT WAS HEARD, against a closed set, checked in this order. Pure given the
   page's reading, so a gate can put a table of sentences through it. */
function sumTalkAnswer(text,r){
 var t=' '+stkSayWords(text)+' ', ps=sumTalkParas(r), a='';
 if(/ (stack|root|domain|archetype|archetypes|who am i) /.test(t))a=sumTalkStack();
 else if(/ (body|hold|holding|held|weight|seat|law|where) /.test(t))a=sumTalkTake(ps[1],3);
 else if(/ (energy|lean|avatar|becoming|momentum) /.test(t))a=sumTalkTake(ps[2],3);
 else if(/ (blueprint|born|birth|sign|sun|moon|rising|life path|number|numerology|name) /.test(t))a=sumTalkTake(ps[0],3);
 if(a)return (a+sumTalkOffer()).trim();
 return ('I can only say what this reading holds.'+sumTalkOffer()).trim();}

/* ---- the button and the conversation, drawn from SUM_TALK on every render ---- */
/* the Journal's own three circles, in the same order, so it reads as one
   control: ring, ring, dot */
var SUM_TALK_SVG='<svg viewBox="0 0 88 88" aria-hidden="true"><circle class="sth-ring2" cx="44" cy="44" r="40"></circle>'
 +'<circle class="sth-ring" cx="44" cy="44" r="30"></circle><circle class="sth-dot" cx="44" cy="44" r="3.2"></circle></svg>';
/* a different profile is a different person, so what was said about the last
   one is not carried over. Read on every render and every press. No paint
   here: this runs inside sumRender. */
function sumTalkSync(){
 var id=(CURP&&CURP.id)||'';
 if(SUM_TALK.who===null){SUM_TALK.who=id; return;}
 if(SUM_TALK.who!==id){sumTalkStop(); SUM_TALK.turns=[]; SUM_TALK.who=id;}}
function sumTalkState(r){
 if(SUM_TALK.phase!=='idle')return SUM_TALK.phase;
 /* the safety door is never greyed: a press under it speaks the safe line,
    reading or no reading, worked example or not (sumTalkSafe) */
 if(!stSafe()){
  if(r.unread)return 'unread';
  if(typeof showOnly==='function'&&showOnly())return 'show';}
 if(typeof authVoice!=='function'||srcVoiceWhyNot())return 'off';
 if(SRC_VOICE.fail===429)return 'limit';
 return 'idle';}
function sumTalkBtn(r){
 sumTalkSync();
 var st=sumTalkState(r||computeSeen());
 /* the symbol first, its meaning on hover and tap in one short sentence */
 var L={idle:['Talk to Source AI','Talk with Source AI about this reading.'],
  speak:['Stop Source AI','Stop.'],
  listen:['Listening. Press to stop.','Stop.'],
  unread:['Talk to Source AI','Nothing read yet. Record a story, then press this again.'],
  show:['Talk to Source AI','A worked example shows every reading and runs nothing.'],
  off:['Talk to Source AI',srcVoiceWhyNot()||'Source AI cannot speak in this build.'],
  limit:['Talk to Source AI','The voice has reached today\'s limit.']}[st];
 var grey=st==='unread'||st==='show'||st==='off'||st==='limit';
 /* pressed only once the voice is really playing, or the microphone really
    open: a control never claims the voice started before it has */
 var on=(st==='speak'&&SUM_TALK.playing)||st==='listen';
 return '<button type="button" class="sum-talk" id="sumtalkb" data-talk="'+st+'"'+(grey?' aria-disabled="true"':'')
  +' aria-pressed="'+on+'" aria-label="'+esc(L[0])+'" data-tip-k="Source AI" data-tip="'+esc(L[1])+'">'
  +SUM_TALK_SVG+'<span>Source AI</span></button>';}
/* Source AI's rows wear her mark and her colour (the 15 November ruling), the
   person's are upright and in the ink, and what is being heard shows plain */
function sumTalkPanel(){
 var h=SUM_TALK.turns.map(function(t){
  return t.w==='src'
   ?'<p class="src-ai">'+srcMark()+'<span class="src-ai-t">'+esc(t.t)+'</span></p>'
   :'<p class="me">'+esc(t.t)+'</p>';}).join('');
 if(SUM_TALK.phase==='listen'&&SUM_TALK.live)h+='<p class="me live">'+esc(SUM_TALK.live)+'</p>';
 return h;}
/* A PRESS REPAINTS THE BUTTON AND THE PANEL AND NOTHING ELSE. sumRender would
   rewrite the Reading under the person's eye on every word heard. */
function sumTalkPaint(){
 var b=document.getElementById('sumtalkb'), pn=document.getElementById('sumtalk');
 var a=document.activeElement, had=!!(a&&a.id==='sumtalkb');
 if(b){ var r=null; try{ r=computeSeen(); }catch(e){}
  if(r){ var tmp=document.createElement('div'); tmp.innerHTML=sumTalkBtn(r);
   var nb=tmp.firstChild; if(nb)b.replaceWith(nb); } }
 if(pn){ pn.innerHTML=sumTalkPanel(); pn.scrollTop=pn.scrollHeight; }
 if(had){ var nb2=document.getElementById('sumtalkb'); if(nb2)nb2.focus(); }}

/* ---- stopping ---- */
/* STOP EVERYTHING THIS BUTTON STARTED, and nothing it did not. The number
   moves first, so a voice or a recogniser still on its way answers a press
   that is already over and is dropped. No paint, so a render can call it. */
function sumTalkStop(){
 if(SUM_TALK.phase==='idle'&&!SUM_TALK.rec)return false;
 SUM_TALK.seq++; clearTimeout(SUM_TALK.t);
 var x=SUM_TALK.rec; SUM_TALK.rec=null;
 if(x){ x.onresult=x.onend=x.onerror=null; try{ if(typeof x.abort==='function')x.abort(); else x.stop(); }catch(e){} }
 /* the voice is cut only while it is still this button's line: when another
    line has gone out since (SRC_VOICE.seq moved past vseq), that line is the
    Journal's or the well's and is not ours to stop */
 if(SUM_TALK.phase==='speak'&&SUM_TALK.vseq===SRC_VOICE.seq)srcVoiceCut();
 SUM_TALK.phase='idle'; SUM_TALK.playing=false; SUM_TALK.live='';
 return true;}
/* the cut the Journal's Talk and the release's microphone call, so one
   recogniser ever holds the microphone (storyui.js stMic, release.js) */
function sumTalkCut(){
 var was=sumTalkStop();
 if(was)sumTalkPaint();
 return was;}
function sumTalkIdle(){ sumTalkStop(); sumTalkPaint(); }
/* leaving the page, or another person: the conversation ends and is not kept */
function sumTalkReset(){
 sumTalkStop(); SUM_TALK.turns=[]; SUM_TALK.who=(CURP&&CURP.id)||'';
 sumTalkPaint();}

/* ---- the press ---- */
/* THE PRESS, its refusals in order: the safety door (which speaks the safe
   line and ends, and is never refused), nothing read, a worked example
   (showRefuse, before anything is spoken), no voice from this page. A page
   opened off disk is told so here, before any request, and a greyed press says
   why through status() like every other one. */
function sumTalkPress(){
 sumTalkSync();
 if(SUM_TALK.phase!=='idle'){ sumTalkIdle(); return; }
 if(stSafe()){ sumTalkSafe(); return; }
 var r=computeSeen();
 if(r.unread){ status('Nothing read yet. Record a story, then press this again.','fail'); return; }
 if(showRefuse('talk'))return;
 if(typeof authVoice!=='function'){ status('Source AI cannot speak in this build.','fail'); return; }
 var why=srcVoiceWhyNot();
 if(why){ status(why,'fail'); return; }
 /* one recogniser on the page: the well's and the Journal's Talk stop through
    their own paths first */
 stkSayCut(); stkSayJournalOff();
 SUM_TALK.turns=[];
 sumTalkSpeak(sumTalkOpening(r),true);}
/* THE SAFETY DOOR, SPOKEN. The line the Journal's voice speaks while the door
   stands, read from the same place (srcSayNow), no word of this module's own:
   no reading and no microphone after it. */
function sumTalkSafe(){
 var why=srcVoiceWhyNot();
 if(why){ status(why,'fail'); return; }
 stkSayCut(); stkSayJournalOff();
 SUM_TALK.turns=[];
 sumTalkSpeak(srcSayNow(),false);}
function sumTalkSpeak(line,listen){
 var seq=++SUM_TALK.seq;
 SUM_TALK.phase='speak'; SUM_TALK.live=''; SUM_TALK.playing=false;
 SUM_TALK.turns.push({w:'src',t:line});
 sumTalkPaint();
 /* the number stSrcSpeak is about to take. Any other line that goes out
    after this one moves it, and then this line was talked over, not
    finished, so the microphone does not open under it */
 var vseq=SRC_VOICE.seq+1; SUM_TALK.vseq=vseq;
 stSrcSpeak(line,{
  onPlay:function(){ if(seq!==SUM_TALK.seq)return; SUM_TALK.playing=true; sumTalkPaint(); },
  onEnd:function(played){
   if(seq!==SUM_TALK.seq)return;
   if(!played){ sumTalkIdle(); return; }
   if(listen&&vseq===SRC_VOICE.seq&&stkSayCanHear())sumTalkListen(seq); else sumTalkIdle(); }});}
function sumTalkListen(seq){
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition, rec;
 try{ rec=new SR(); }catch(e){ sumTalkIdle(); status('Recording could not start. Press Source AI to try again.','fail'); return; }
 rec.continuous=true; rec.interimResults=true; rec.lang='en-US';
 var done={};
 var wait=function(){ clearTimeout(SUM_TALK.t); SUM_TALK.t=setTimeout(function(){ if(seq===SUM_TALK.seq)sumTalkIdle(); },STK_SAY_WAIT); };
 /* by index, never by text, the ST_REC_DONE rule: a browser that reports a
    final twice must not be answered twice */
 rec.onresult=function(e){ if(seq!==SUM_TALK.seq)return;
  var fin='',live='';
  for(var i=e.resultIndex;i<e.results.length;i++){
   var t=e.results[i][0].transcript;
   if(e.results[i].isFinal){ if(done[i])continue; done[i]=1; fin+=t; } else live+=t;}
  wait();
  if(fin.trim()){ sumTalkHeard(fin); return; }
  SUM_TALK.live=live; sumTalkPaint();};
 rec.onerror=function(e){ if(seq!==SUM_TALK.seq)return; var code=(e&&e.error)||'unknown';
  if(code==='no-speech'||code==='aborted')return;
  sumTalkIdle(); stMicSay(code);};
 /* the browser ends a continuous recording on its own; while the button
    still says Listening that end is the browser's, so it starts again */
 rec.onend=function(){ if(seq!==SUM_TALK.seq||SUM_TALK.rec!==rec)return;
  try{ rec.start(); }catch(e){ sumTalkIdle(); }};
 SUM_TALK.phase='listen'; SUM_TALK.live=''; SUM_TALK.rec=rec;
 try{ rec.start(); }catch(e){ SUM_TALK.rec=null; sumTalkIdle(); status('Recording could not start. Press Source AI to try again.','fail'); return; }
 wait(); sumTalkPaint();}
/* WHAT WAS HEARD. Stop is the whole utterance (stkSayIntent, the one matcher
   the well uses), anything else is answered from the closed set, and every
   answer ends on the offer, after which the microphone reopens. Said to the
   page and never filed: the person's words are a row in the panel and nothing
   else. */
function sumTalkHeard(text){
 var x=SUM_TALK.rec; SUM_TALK.rec=null; clearTimeout(SUM_TALK.t);
 if(x){ x.onresult=x.onend=x.onerror=null; try{ if(typeof x.abort==='function')x.abort(); else x.stop(); }catch(e){} }
 var said=String(text).trim().slice(0,200);
 SUM_TALK.turns.push({w:'me',t:said});
 SUM_TALK.live='';
 /* a door that opened while this was listening: the safe line, and nothing
    about the reading, whatever was said */
 if(stSafe()){ sumTalkSpeak(srcSayNow(),false); return; }
 if(stkSayIntent(text)==='stop'){ sumTalkIdle(); return; }
 var r=computeSeen();
 if(r.unread){ sumTalkIdle(); status('Nothing read yet. Record a story, then press this again.','fail'); return; }
 sumTalkSpeak(sumTalkAnswer(text,r),true);}

document.addEventListener('click',function(e){
 var b=e.target.closest?e.target.closest('#sumtalkb'):null;
 if(b){ e.preventDefault(); sumTalkPress(); }});
/* ESCAPE STOPS THE BUTTON ON THE FIRST PRESS, in the capture phase on the
   window, ahead of the tooltip, the way the well's does (ui/stksay.js, which
   records why: the tip the button carries takes the first Escape otherwise).
   With the focus on the button, in the conversation or on the page body. */
window.addEventListener('keydown',function(e){
 if(e.key!=='Escape'||SUM_TALK.phase==='idle')return;
 var a=document.activeElement;
 if(!(a&&(a===document.body||(a.closest&&a.closest('#sum')))))return;
 var tip=document.getElementById('tip'), tipOn=!!(tip&&tip.classList.contains('on'));
 sumTalkIdle();
 if(typeof TIP!=='undefined'&&TIP.hide){
  TIP.hide(); requestAnimationFrame(function(){ TIP.hide(); }); }
 if(tipOn)e.stopPropagation();},true);
