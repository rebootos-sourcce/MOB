/* ============================================================
   THE INSIGHT WELL TALKS, 17 November. The owner, his words: "the insight
   panel is source ai's translation of whats selected. i want this to be an
   audio button too. if i press it, i can talk to source ai about the parent
   and children and how it works through me and run a protocol to release it."

   ONE BUTTON ON THE READING ROW (stkWellHtml, ui/ui.js), and this module is
   all of what it does. A press speaks the well's own three facts (Built from,
   Feeds, Reading) through stSrcSpeak, the one voice, then listens. What the
   person says next is matched against a closed set and answered only out of
   what the engine already computed. Saying release opens the release card
   through relPick, the same door Summary's Release all uses, and the card's
   own Release press is what starts a run. A word never starts one: a run
   spends the allowance and speech to text mishears.

   SCOPED, AND NAMED SO. DECISIONS.md, 10 November, "No two-way chat,
   anywhere, including the voice," is overridden by this request for this one
   button only, and is recorded there on this date. The Journal is unchanged.

   THIS IS NOT THE JOURNAL'S CONVERSATION, on purpose. Talk here is talk
   about a pattern, not the person's story: filing it through srcTurnCommit
   would put it in ST_TEXT, re-parse it, charge the field and keep it at
   Commit. So this recogniser has its own onresult, it never writes ST_TEXT
   or SRC_CHAT, and the Journal's Talk is stopped first so only one
   recogniser ever holds the microphone (stkSayJournalOff, and stMic cuts
   this one on its own press).

   EVERY WORD SPOKEN IS READ OFF A RECORD OR A FIXED LINE. railStkKids,
   railStkParent and insightSpeak (ui/ui.js) carry the facts; the rest are
   the fixed lines below. No body place is said, because the pattern's
   addresses are the engine's reading and not something the person has said
   fits (EV_PLACEABLE). No percent is said, because a figure read after a
   name lands as a mark. The person's name is never in a line, because the
   line goes to the voice server.

   THE SAFETY DOOR COMES FIRST. While stSafe() stands the button speaks the one
   line the Journal's voice speaks (srcSayNow, which reads CRISIS_SAY) and
   nothing else: no pattern reading, no release, no microphone after it. The
   button is never greyed or hidden for it. Emmy's 17 October ruling holds,
   nothing escalates: the look is the same.

   ONE SPELLING, ONE SENTENCE. The line sent to the voice is the line the
   Reading row shows while it plays, character for character, and the kind is
   said the way the row says it (INSIGHT_KW, ui/ui.js). A name the voice would
   read badly, a + or a / between two parts, is made plain once, in
   stkSayWord, and the plain form is the one shown too.

   THE STATE LIVES HERE AND NEVER IN THE DOM. railStack rewrites the well's
   whole innerHTML on every render, so a button that kept its own phase would
   reset to idle mid sentence. STK_SAY is read back on every render, and its
   key is the pin's kind and name, the stkSame identity, because render()
   rebuilds every pattern object.
   ============================================================ */
var STK_SAY={key:'', pin:null, phase:'idle', seq:0, vseq:0, playing:false, line:'', live:'', rec:null, t:0, relId:''};
/* how long listening waits with nothing heard before it closes, quietly,
   because nothing failed. THE HARNESS SEAM: a gate sets window.STKSAY_WAIT_MS
   before the page loads to shorten it, read once here the way PW_PAY_SEAM is
   (ui/paywall.js). It can only shorten: a value at or above the ceiling, or
   none, leaves the ceiling, so nothing can hold the microphone open longer
   than this file says. The gate that uses it is tests/stksay.js, group N3. */
var STK_SAY_WAIT_MAX=12000;
var STK_SAY_WAIT=(function(){
 var s=(typeof window!=='undefined')?+window.STKSAY_WAIT_MS:0;
 return s>0&&s<STK_SAY_WAIT_MAX?s:STK_SAY_WAIT_MAX;})();
function stkSayKey(o){ return o?o.kind+'|'+o.nm:''; }
/* the screen's own form of a name: o.nm already carries ' overshot' when
   o.over is set, insightSay's own note */
function stkSayNm(o){ return o.over?traceSummaryBase(o.nm)+', overshot':o.nm; }
/* THE NAME AS THE LINE SAYS IT AND THE ROW SHOWS IT. A complex is named for
   its two parts with a + and a super complex with a /, and a voice reads
   neither well. "with" is plain, it is not "and" so a list of such names is
   still a list, and it is used in the spoken line and in the line on screen,
   which are one line. The pattern's own name elsewhere is untouched. */
function stkSayWord(nm){ return String(nm).replace(/ [+\/] /g,' with '); }
function stkSaySay(o){ return stkSayWord(stkSayNm(o)); }
function stkSayList(a){
 if(a.length<2)return a.join('');
 if(a.length>3)return a.slice(0,3).join(', ')+' and '+(a.length-3)+' more';
 return a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
function stkSayCanHear(){
 return !!(window.SpeechRecognition||window.webkitSpeechRecognition)
  &&!(typeof isSecureContext!=='undefined'&&!isSecureContext);}
/* THE OFFER. Never reached while the crisis door stands: that press speaks the
   safe line and ends (stkSaySafe), and a door that opens mid conversation is
   met in stkSayHeard before any answer is built. */
function stkSayOffer(){ return 'Ask me about it, or say release to open it.'; }
/* what the pattern feeds, for the line and for a question about it */
function stkSayFeeds(o,r){
 if(o.kind==='sup')return 'Nothing sits above it. It is the top of the chain.';
 var par=railStkParent(o,r,(insightTrace(o)||{}).parents);
 return par?'It feeds '+stkSaySay(par)+', '+INSIGHT_KW[par.kind]+'.':'Nothing above it is running.';}
function stkSayBuilt(o){
 var kids=railStkKids(o);
 return kids.length?'It is built from '+stkSayList(kids.map(function(k){return stkSayWord(k.nm);}))+'.':'Nothing is running under it.';}
/* THE OPENING LINE: the well's three rows, in their order, said */
function stkSayLine(o,r){
 var out=['You picked '+stkSaySay(o)+'. It is '+INSIGHT_KW[o.kind]+'.', stkSayBuilt(o), stkSayFeeds(o,r)];
 var b=insightSpeak(o,r); if(b)out.push(b);
 if(stkSayCanHear())out.push(stkSayOffer());
 return out.join(' ');}
/* the names a person can ask about: the pattern's own parts and its parent.
   A saboteur's Built from is child emotions, which are not nodes on the
   chain, so they are said and never answered as patterns. */
function stkSayNames(o,r){
 var a=o.kind==='sab'?[]:(o.parts||[]).slice();
 var par=o.kind==='sup'?null:railStkParent(o,r,(insightTrace(o)||{}).parents);
 if(par)a.push(par);
 return a;}
/* a name matches when the whole name, or every word of it, was heard */
function stkSayMatch(t,x){
 var nm=String(x.over?traceSummaryBase(x.nm):x.nm).toLowerCase();
 if(t.indexOf(nm)>=0)return true;
 var w=nm.split(/[^a-z]+/).filter(function(s){return s.length>2;});
 return w.length>0&&w.every(function(s){return t.indexOf(s)>=0;});}
function stkSayAsk(o,r){
 /* three names at most, so the list stays one breath, and "or" because
    the person picks one */
 var nm=stkSayNames(o,r).map(stkSaySay).slice(0,3);
 return 'I can only say what this reading holds. '
  +(nm.length?'Ask about '+stkSayList(nm).replace(/ and (?=[^,]*$)/,' or ')+', or say release.':'Say release to open it.');}

/* THE PER-SESSION FUNNEL, in the browser store under source.say and never
   in the record: where people stop between the card opening and Release. */
function stkSayNote(k){
 try{ var s=JSON.parse(localStorage.getItem('source.say')||'{}')||{};
  s[k]=(+s[k]||0)+1; localStorage.setItem('source.say',JSON.stringify(s)); }catch(e){}}

/* THE BUTTON, drawn from STK_SAY on every render */
var STK_SAY_SPK='<path d="M4 9.5h3.2L11.5 6v12l-4.3-3.5H4z"/><path class="stk-say-a" d="M15 9.2a4 4 0 0 1 0 5.6"/><path class="stk-say-a" d="M17.6 6.6a7.6 7.6 0 0 1 0 10.8"/>';
var STK_SAY_TALK='<path d="M6 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7.6l-3.4 2.8a.6.6 0 0 1-1-.46V15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>';
function stkSayState(o,r){
 if(STK_SAY.phase!=='idle'&&STK_SAY.key===stkSayKey(o))return STK_SAY.phase;
 /* the safety door is never greyed: a press under it speaks the safe line,
    reading or no reading, worked example or not (stkSaySafe) */
 if(!stSafe()){
  if(r.unread||!insightPick(o,r))return 'unread';
  if(typeof showOnly==='function'&&showOnly())return 'show';}
 if(typeof authVoice!=='function'||srcVoiceWhyNot())return 'off';
 if(SRC_VOICE.fail===429)return 'limit';
 return 'idle';}
function stkSayBtn(o,r){
 var st=stkSayState(o,r), N=stkSayNm(o);
 /* the symbol first, its meaning on hover and tap in one sentence. Under the
    safety door the press does not read the pattern, so neither label nor tip
    says it will */
 var L={idle:stSafe()?['Hear Source AI','Hear Source AI.']
   :['Hear Source AI read '+N,'Hear Source AI read this, then talk it through.'],
  speak:['Stop Source AI','Stop.'],
  listen:['Listening. Press to stop.','Stop.'],
  unread:['Hear Source AI read '+N,'Nothing read yet. Record a story, then press this again.'],
  show:['Hear Source AI read '+N,'A worked example shows every reading and runs nothing.'],
  off:['Hear Source AI read '+N,srcVoiceWhyNot()||'Source AI cannot speak in this build.'],
  limit:['Hear Source AI read '+N,'The voice has reached today\'s limit.']}[st];
 var grey=st==='unread'||st==='show'||st==='off'||st==='limit';
 /* pressed only once the voice is really playing, or the microphone really
    open: a control never claims the voice started before it has */
 var on=(st==='speak'&&STK_SAY.playing)||st==='listen';
 return '<button type="button" class="stk-say" id="stksay" data-say="'+st+'"'+(grey?' aria-disabled="true"':'')
  +' aria-pressed="'+on+'" aria-label="'+esc(L[0])+'" data-tip-k="Hear" data-tip="'+esc(L[1])+'">'
  +'<svg viewBox="0 0 24 24" aria-hidden="true">'+(st==='listen'?STK_SAY_TALK:STK_SAY_SPK)+'</svg></button>';}
/* THE READING ROW'S OWN WORDS. While the button speaks, the row shows the
   line being said, marked as Source AI's, so the line heard and the line on
   screen are one line. While it listens, what is being heard shows plain,
   the person's own words, with no mark. */
function stkSayRow(o,r,reading){
 var mine=STK_SAY.phase!=='idle'&&STK_SAY.key===stkSayKey(o);
 if(mine&&STK_SAY.phase==='listen'&&STK_SAY.live)return '<span class="stk-live">'+esc(STK_SAY.live)+'</span>';
 if(mine&&STK_SAY.line)return '<span class="src-ai">'+srcMark()+esc(STK_SAY.line)+'</span>';
 return reading;}

function stkSayPaint(){
 var a=document.activeElement, had=!!(a&&a.id==='stksay');
 if(typeof railStack==='function')railStack(computeSeen());
 var b=had&&document.getElementById('stksay'); if(b)b.focus();}
/* STOP EVERYTHING THIS BUTTON STARTED, and nothing it did not. The number
   moves first, so a voice or a recogniser still on its way answers a press
   that is already over and is dropped. */
function stkSayCut(){
 if(STK_SAY.phase==='idle'&&!STK_SAY.rec)return false;
 STK_SAY.seq++; clearTimeout(STK_SAY.t);
 var x=STK_SAY.rec; STK_SAY.rec=null;
 if(x){ x.onresult=x.onend=x.onerror=null; try{ if(typeof x.abort==='function')x.abort(); else x.stop(); }catch(e){} }
 /* the voice is cut only while it is still this button's line: when another
    line has gone out since (SRC_VOICE.seq moved past vseq), that line is the
    Journal's or the intro's and is not ours to stop, and cutting it here, which
    the first cut did, silenced a line this button had only been talked over by */
 if(STK_SAY.phase==='speak'&&STK_SAY.vseq===SRC_VOICE.seq)srcVoiceCut();
 STK_SAY.phase='idle'; STK_SAY.playing=false; STK_SAY.live='';
 return true;}
function stkSayIdle(){ stkSayCut(); STK_SAY.line=''; stkSayPaint(); }
/* the well's pin moved, its tab moved, or the pin left: what was being said
   was about something no longer on screen. Read on every railStack. */
function stkSayHold(){
 if(STK_SAY.phase==='idle')return;
 if(!S.pin||stkSayKey(S.pin)!==STK_SAY.key||STACK_TAB!==S.pin.kind){ stkSayCut(); STK_SAY.line=''; }}
/* the Journal's Talk, stopped through its own stop path, so one recogniser */
function stkSayJournalOff(){
 if(!(ST_LISTEN||ST_WANT_LISTEN))return;
 ST_WANT_LISTEN=false;
 try{ if(ST_REC)ST_REC.stop(); }catch(e){}
 ST_LISTEN=false; ST_LISTEN_T0=null; ST_LIVE='';
 try{ if(typeof stRender==='function')stRender(); }catch(e){}}
/* the pattern this button is about, read again off this reading: a turn,
   a plan change or a new story can drop it, and then it is not talked about */
function stkSayNow(r){ return STK_SAY.pin?insightPick(STK_SAY.pin,r):null; }

/* THE PRESS, its refusals in order: nothing to talk about, the safety door
   (which speaks the safe line and ends, and is never refused), nothing read,
   a pattern gone from the reading, a worked example (showRefuse, before
   anything is spoken), no voice from this page. A page opened off disk is
   told so here, from its address, before any request, and a greyed press
   says why through status() like every other one. */
function stkSayPress(){
 if(STK_SAY.phase!=='idle'){ stkSayIdle(); return; }
 if(!S.pin||!STK_LIST[S.pin.kind]){ status('Pick a pattern first.','fail'); return; }
 if(stSafe()){ stkSaySafe(); return; }
 var r=computeSeen();
 if(r.unread){ status('Nothing read yet. Record a story, then press this again.','fail'); return; }
 var o=insightPick(S.pin,r);
 if(!o){ status('That pattern is not in this reading any more. Pick it again.','fail'); return; }
 if(showRefuse('talk'))return;
 if(typeof authVoice!=='function'){ status('Source AI cannot speak in this build.','fail'); return; }
 var why=srcVoiceWhyNot();
 if(why){ status(why,'fail'); return; }
 stkSayNote('press');
 stkSayJournalOff();
 STK_SAY.key=stkSayKey(o); STK_SAY.pin={kind:o.kind,nm:o.nm};
 stkSaySpeak(stkSayLine(o,r),true);}
/* THE SAFETY DOOR, SPOKEN. The line the Journal's voice speaks while the door
   stands, read from the same place (srcSayNow), no word of this module's own:
   no pattern reading, no release offered and no microphone after it. Nothing
   escalates, so there is no modal and no new look. */
function stkSaySafe(){
 var why=srcVoiceWhyNot();
 if(why){ status(why,'fail'); return; }
 stkSayNote('safe');
 STK_SAY.key=stkSayKey(S.pin); STK_SAY.pin={kind:S.pin.kind,nm:S.pin.nm};
 stkSaySpeak(srcSayNow(),false);}
function stkSaySpeak(line,listen){
 var seq=++STK_SAY.seq;
 STK_SAY.phase='speak'; STK_SAY.line=line; STK_SAY.live=''; STK_SAY.playing=false;
 stkSayPaint();
 /* the number stSrcSpeak is about to take. Any other line that goes out
    after this one moves it, and then this line was talked over, not
    finished, so the microphone does not open under it */
 var vseq=SRC_VOICE.seq+1; STK_SAY.vseq=vseq;
 stSrcSpeak(line,{
  onPlay:function(){ if(seq!==STK_SAY.seq)return; STK_SAY.playing=true; stkSayNote('spoke'); stkSayPaint(); },
  onEnd:function(played){
   if(seq!==STK_SAY.seq)return;
   if(!played){ if(SRC_VOICE.fail)stkSayNote('fail'+SRC_VOICE.fail); stkSayIdle(); return; }
   if(listen&&vseq===SRC_VOICE.seq&&stkSayCanHear())stkSayListen(seq); else stkSayIdle(); }});}
function stkSayListen(seq){
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition, rec;
 try{ rec=new SR(); }catch(e){ stkSayIdle(); status('Recording could not start. Press Hear to try again.','fail'); return; }
 rec.continuous=true; rec.interimResults=true; rec.lang='en-US';
 var done={};
 var wait=function(){ clearTimeout(STK_SAY.t); STK_SAY.t=setTimeout(function(){ if(seq===STK_SAY.seq)stkSayIdle(); },STK_SAY_WAIT); };
 /* by index, never by text, the ST_REC_DONE rule: a browser that reports a
    final twice must not be answered twice */
 rec.onresult=function(e){ if(seq!==STK_SAY.seq)return;
  var fin='',live='';
  for(var i=e.resultIndex;i<e.results.length;i++){
   var t=e.results[i][0].transcript;
   if(e.results[i].isFinal){ if(done[i])continue; done[i]=1; fin+=t; } else live+=t;}
  wait();
  if(fin.trim()){ stkSayHeard(fin); return; }
  STK_SAY.live=live; stkSayPaint();};
 rec.onerror=function(e){ if(seq!==STK_SAY.seq)return; var code=(e&&e.error)||'unknown';
  if(code==='no-speech'||code==='aborted')return;
  stkSayIdle(); stMicSay(code);};
 /* the browser ends a continuous recording on its own; while the button
    still says Listening that end is the browser's, so it starts again */
 rec.onend=function(){ if(seq!==STK_SAY.seq||STK_SAY.rec!==rec)return;
  try{ rec.start(); }catch(e){ stkSayIdle(); }};
 STK_SAY.phase='listen'; STK_SAY.live=''; STK_SAY.rec=rec;
 try{ rec.start(); }catch(e){ STK_SAY.rec=null; stkSayIdle(); status('Recording could not start. Press Hear to try again.','fail'); return; }
 stkSayNote('listened'); wait(); stkSayPaint();}
/* A COMMAND IS THE WHOLE UTTERANCE, NOT A WORD IN IT. The first cut looked
   for stop and release anywhere in the sentence, and measured on the real
   build "I don't want to release it yet" opened the release card and "why
   can't I stop controlling everything" ended the conversation with no reply.
   So, narrowly:
     stop     the utterance begins with a stop word, as a command
     release  the word is there, in a short utterance that is not a question
              and has no negation in it ("don't release", "do not release",
              "not release", "never")
   Everything else goes on to the names and the questions, and what nothing
   matches gets the one fixed line. A missed command costs that line, a
   mistaken one costs the person their place, so the rule leans to the miss.
   Pure, so a gate can put a table of sentences through it. */
var STK_SAY_STOP=/^((ok|okay|please|now) )?(stop|that's all|that is all|nothing else|no thanks)( |$)/;
var STK_SAY_NEG=/(^| )(not|never|no|don't|dont|didn't|didnt|doesn't|doesnt|can't|cant|cannot|won't|wont|wouldn't|shouldn't|couldn't|isn't|aren't|wasn't|haven't|hasn't)( |$)/;
var STK_SAY_ASKS=/^(why|what|what's|whats|how|when|where|who|which|can|could|would|should|will|do|does|did|is|are|am|was|were|have|has)( |$)/;
var STK_SAY_REL=/(^| )release( |$)|^((ok|okay|yes|yeah|please|now|let's|lets) )*run (it|the protocol|the release)( |$)/;
function stkSayWords(text){ return String(text).toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/ +/g,' ').trim(); }
function stkSayIntent(text){
 var w=stkSayWords(text);
 if(!w)return '';
 if(STK_SAY_STOP.test(w))return 'stop';
 if(w.split(' ').length<=6&&!STK_SAY_NEG.test(w)&&!STK_SAY_ASKS.test(w)&&STK_SAY_REL.test(w))return 'release';
 return '';}
/* WHAT WAS HEARD, against a closed set, narrow on purpose: a missed
   question costs one fixed honest line, an invented answer costs the
   instrument. Every answer ends on the offer, and the microphone reopens
   after it through the same onEnd. */
function stkSayHeard(text){
 var x=STK_SAY.rec; STK_SAY.rec=null; clearTimeout(STK_SAY.t);
 if(x){ x.onresult=x.onend=x.onerror=null; try{ if(typeof x.abort==='function')x.abort(); else x.stop(); }catch(e){} }
 var r=computeSeen(), o=stkSayNow(r);
 if(!o){ stkSayIdle(); status('That pattern is not in this reading any more. Pick it again.','fail'); return; }
 /* a door that opened while this was listening: the safe line, and nothing
    about the pattern, whatever was said */
 if(stSafe()){ stkSaySpeak(srcSayNow(),false); return; }
 var it=stkSayIntent(text), t=' '+stkSayWords(text)+' ';
 if(it==='stop'){ stkSayIdle(); return; }
 if(it==='release'){ stkSayRelease(o); return; }
 var hit=stkSayNames(o,r).filter(function(y){return stkSayMatch(t,y);})[0];
 if(hit){ var y=insightPick(hit,r)||hit; stkSayNote('asked');
  stkSaySpeak([stkSaySay(y)+' is '+INSIGHT_KW[y.kind]+'.', stkSayBuilt(y), insightSpeak(y,r), stkSayOffer()].filter(Boolean).join(' '),true); return; }
 var a='';
 if(/ (through me|work through|works through|what is it|what does it do|how does it work) /.test(t))a=insightSpeak(o,r);
 else if(/ (feed|feeds|parent|inside|above) /.test(t))a=stkSayFeeds(o,r);
 else if(/ (built|made of|children|under it|underneath) /.test(t))a=stkSayBuilt(o);
 if(a){ stkSayNote('asked'); stkSaySpeak(a+' '+stkSayOffer(),true); return; }
 stkSaySpeak(stkSayAsk(o,r),true);}
/* RELEASE, OPENED AND NEVER STARTED. relPick plans the run against the
   allowance and opens the card, which says what the run would take; the
   card's own Release (#relgo, relBegin) is the start, the browser's audio
   unlock and the second showRefuse. The voice and the microphone are cut
   first, because the release room has its own voice. "The release is open"
   is said only once the card is: a control never claims success first. */
function stkSayRelease(o){
 stkSayCut();
 if(showRefuse('release')){ STK_SAY.line=''; stkSayPaint(); return; }
 var ids=leaves(o).filter(function(n){return n&&n.cf;}).map(function(n){return n.i;});
 if(!ids.length||typeof relPick!=='function'){ STK_SAY.line=''; stkSayPaint();
  status('Nothing in '+stkSayNm(o)+' is open to release.','fail'); return; }
 relPick(ids);
 if(!(typeof RUN!=='undefined'&&RUN.open)){ STK_SAY.line=''; stkSayPaint();
  status('The release card did not open. Try again from Summary.','fail'); return; }
 STK_SAY.relId=RUN.id; stkSayNote('opened');
 /* a spent allowance draws no Release on the card, and then there is
    nothing to tell the person to press: the card says why */
 if(document.getElementById('relgo'))stkSaySpeak('The release is open. Press Release when you are ready.',false);
 else{ STK_SAY.line=''; stkSayPaint(); }}

document.addEventListener('click',function(e){
 var b=e.target.closest?e.target.closest('#stksay'):null;
 if(b){ e.preventDefault(); stkSayPress(); }});
/* ESCAPE STOPS THE BUTTON ON THE FIRST PRESS, in the capture phase on the
   window, ahead of the tooltip. The button carries a tip that shows whenever
   it has the focus, which is every time it is in use, and the tip's own
   Escape (ui/tip.js, a capture listener on the document) closes the tip and
   stops the key from travelling on: a bubble listener here never ran, and
   measured on the real build it took two Escapes, the first spent on the tip.
   The window's capture listener runs before the document's, so one Escape
   does both jobs: the button stops and the tip closes. The repaint that
   follows puts the focus back on the new button, and the tip opens on that
   focus, so it is shut again here (a pointer resting on the button opens it
   by hover, as it would for any control). The key is stopped only when a tip
   was showing, because that is the one case the tip's own handler would have
   stopped it. Only with the focus inside the well, as before. */
window.addEventListener('keydown',function(e){
 if(e.key!=='Escape'||STK_SAY.phase==='idle')return;
 var a=document.activeElement;
 if(!(a&&a.closest&&a.closest('#stkwell')))return;
 var tip=document.getElementById('tip'), tipOn=!!(tip&&tip.classList.contains('on'));
 stkSayIdle();
 if(typeof TIP!=='undefined'&&TIP.hide){
  /* twice: the tip puts its panel up one frame after a focus (showAt adds
     its class in a requestAnimationFrame), so a hide in this same turn is
     undone a frame later, and the second runs behind that one */
  TIP.hide(); requestAnimationFrame(function(){ TIP.hide(); }); }
 if(tipOn)e.stopPropagation();},true);
