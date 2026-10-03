/* ============================================================
   TODAY. The daily summary on the page, slice D8 of SUMMARY-AUDIT.md.

   engine/daily.js has composed, grounded and frozen a day since 1 October and
   nothing in the app called it. The owner asked, round QA, why it was never
   finished. This is the screen.

   WHERE IT SITS. The Summary's own side column, the right rail, the way the
   Story's rail became the Imprints page in round GO. The funnel review's
   placement row F24 put it there: "D7 (dlyCompose in its own side column)",
   in the grammar F12 named, the picture in the middle and the words to the
   side. The shared rail it replaces on this tab repeated the page beside it
   (the uiux pass, "the right rail is wallpaper"), so nothing is lost; the
   Selection section stays, because every drill on the Summary opens there.

   WHAT IS SHOWN, AND WHAT IS NEVER WRITTEN HERE.
     a record, today frozen    the frozen day's sentences, as they were shown
     a record, not yet today   nothing, for the moment between the paint and
                               sumDayOpen, which freezes it and paints again
     a worked example          the composition, live. A roster person is not a
                               record and is never frozen (NotARecord), so
                               nothing here is kept and no aim can be set
     nothing read yet          silent. CLAUDE.md: a surface that prints a
                               reading silences itself on r.unread, and a day
                               is not frozen for it either, so a person's first
                               real day can still be the one written
   No sentence is written in this file. Every sentence is the engine's, sealed
   on the day; this file only places them and carries the meaning of the terms
   in them. The block eyebrows, the aim prompt and the marks are the only
   words here, and none of them is a reading.

   NO DAY COUNT. The bank is listed by date and never numbered, and nothing
   here prints "day" with a number beside it or a share of a span. The journey
   is shown as what the record says, never as a counter.

   THE ONE WRITE. sumDayOpen, called by the two places that paint the Summary
   and never by a render (SUMMARY-AUDIT.md, "never inside sumRender"), inside
   one try. A save that fails is reported through status() and the day is not
   claimed: the engine puts the old bank back, and this paints the live
   composition so the person can still read today's sentences.
   ============================================================ */

/* the eyebrow over each of the engine's eight blocks, in DLY_BLOCKS order.
   attention is never "needs attention", which is a verdict the record cannot
   give: the sentence under it is a count of days, so the eyebrow says that. */
var DLY_EYE={today:'Latest reading', showing:'Showing up', interfering:'In the way',
 changing:'Changing', attention:'Most often', aim:'Your '+DLY_AIM_WORD+'s',
 try:'One thing to do', why:'Where this comes from'};
/* the four marks, in DLY_ANSWER order, as the button and as the line after */
var DLY_MARK={kept:['Kept','kept'], partly:['Partly','partly kept'], not:['Not kept','not kept'],
 unknown:['Not sure','not sure']};
/* one live composition per worked example, read again only when what it reads
   changes. Composing borrows the record's soul, which is the expensive part. */
var DLY_LIVE={key:null, res:null};
/* a record whose day could not be frozen this session is not asked again on
   every repaint: one failure, one message */
var DLY_TRIED=(typeof WeakMap==='function')?new WeakMap():null;
var DLY_R=null;

function dlyIsRec(p){return !!p&&typeof PROFILES!=='undefined'&&PROFILES.indexOf(p)>=0;}
function dlyLiveKey(p,now){
 var h=p.history||[], e=(p.story&&p.story.entries)||[], ri=p.rituals||[];
 return [S.who, dlyDay(now), h.length, h.length?h[h.length-1].t:'', e.length, e.length?e[e.length-1].t:'',
  ri.length, ((p.meter&&p.meter.firsts)||[]).length, p.avatar?(p.avatar.reviewedAt||p.avatar.at||''):'',
  ((p.summaries&&p.summaries.events)||[]).length].join('|');}
function dlyLive(p,now,r){
 var k=dlyLiveKey(p,now);
 if(DLY_LIVE.key!==k||DLY_LIVE.p!==p){DLY_LIVE={key:k, p:p, res:dlyCompose(p,new Date(now).toISOString(),{r:r})};}
 return DLY_LIVE.res;}

/* ---- the meaning of every term, carried in the sentence ----
   UNPACK EVERY SYMBOL, round PO. A sealed sentence is plain text, so the terms
   in it are found here and each becomes the one tooltip the product has, with
   the table's own sentence in it. A seat is carried with its seat ("the Root
   seat"), a law by its name, and coherence, charge, an address and a bare seat
   by their own entries. The education sentence is left alone: it is a meaning
   already. */
var DLY_TERM_RX=null;
function dlyTermRx(){
 if(DLY_TERM_RX)return DLY_TERM_RX;
 var q=function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');};
 var seats=BANDS.map(q).join('|'), laws=SINAMES.slice().sort(function(a,b){return b.length-a.length;}).map(q).join('|');
 DLY_TERM_RX=new RegExp('\\b(?:('+seats+') seat|('+laws+')\\b|(seats?)\\b|(coherence)\\b|(charge)\\b|(address(?:es)?)\\b)','g');
 return DLY_TERM_RX;}
function dlyCarry(text){
 var rx=dlyTermRx(), out='', at=0, m, used={};
 rx.lastIndex=0;
 while((m=rx.exec(text))){
  var say='', k='';
  if(m[1]){k='seat:'+m[1]; say=unpackOf(m[1],'seat');}
  else if(m[2]){k='law:'+m[2]; say=unpackOf(m[2],'law');}
  else if(m[3]){k='seat'; say=unpackOf('seat');}
  else if(m[4]){k='coherence'; say=unpackOf('coherence');}
  else if(m[5]){k='charge'; say=unpackOf('charge');}
  else if(m[6]){k='address'; say=unpackOf('address');}
  if(!say||used[k])continue;
  used[k]=1;
  out+=esc(text.slice(at,m.index))
   +'<span class="tipu" tabindex="0" data-tip-k="'+esc(m[0])+'" data-tip="'+esc(say)+'">'+esc(m[0])+'</span>';
  at=m.index+m[0].length;}
 return out+esc(text.slice(at));}
function dlyStHtml(s){
 return '<p class="dl-st" data-tpl="'+esc(s.tpl)+'">'+(s.tpl==='why.edu'?esc(s.text):dlyCarry(s.text))+'</p>';}
/* a day's sentences under the eyebrow of each block they belong to, in the
   engine's block order, which is the order the document gives */
function dlyBlocks(st){
 var out='', by={};
 st.forEach(function(s){(by[s.k]=by[s.k]||[]).push(s);});
 DLY_BLOCKS.forEach(function(k){
  if(!by[k])return;
  out+='<div class="dl-blk" data-k="'+k+'"><div class="pm-eye">'+esc(DLY_EYE[k]||k)+'</div>'
   +by[k].map(dlyStHtml).join('')+'</div>';});
 return out;}
function dlyClock(iso){
 var t=new Date(iso), h=t.getHours(), m=t.getMinutes();
 return (h<10?'0':'')+h+':'+(m<10?'0':'')+m;}

/* ---- the aim: one line a day, the person's own, and its mark ----
   The aim goes on today's frozen day, so the line is only offered once there
   is one. Leaving it empty is the skip: a day with no aim loses nothing. The
   mark is asked for the latest aim that has none, today's or one from the
   last week, which is how "asked on the next open" lands. */
function dlyAimHtml(p,day,now){
 var S2=p.summaries||dlyBlank(), a=dlyAimOf(S2,day.id), out='<div class="dl-aim">';
 if(!a.set){
  out+='<label class="pm-eye" for="dlaimin">Your '+esc(DLY_AIM_WORD)+' for today</label>'
   +'<form class="dl-aimf" data-dlaim="1"><input id="dlaimin" class="dl-in" type="text" maxlength="'+DLY_CAP.aim+'" '
   +'autocomplete="off" placeholder="One thing you mean to do today">'
   +'<button type="submit" class="btn dl-go" disabled>Save</button></form>';}
 else out+=dlyAimRow('Your '+DLY_AIM_WORD+' today',day.id,a);
 /* an earlier aim still unmarked, the newest first, from the last week */
 var today=pracDay(now), back=null;
 for(var i=S2.days.length-1;i>=0&&!back;i--){
  var d=S2.days[i]; if(d.id===day.id)continue;
  var gap=today-dlyDayNum(d.d); if(gap<1||gap>7)continue;
  var b=dlyAimOf(S2,d.id); if(b.state==='open')back={d:d, a:b};}
 if(back)out+=dlyAimRow('Your '+DLY_AIM_WORD+' on '+dlyDayWord(back.d.d),back.d.id,back.a);
 return out+'</div>';}
function dlyAimRow(eye,sid,a){
 var out='<div class="dl-aimr" data-sid="'+esc(sid)+'"><div class="pm-eye">'+esc(eye)+'</div>'
  +'<p class="dl-own">'+esc(a.set.text)+'</p>';
 if(a.state==='open')out+='<div class="dl-ask">How did it go?</div><div class="dl-marks">'
  +DLY_ANSWER.map(function(k){return '<button type="button" class="btn dl-mk" data-dlmark="'+k+'" data-sid="'+esc(sid)+'">'
   +esc(DLY_MARK[k][0])+'</button>';}).join('')+'</div>';
 else out+='<p class="dl-done">Marked '+esc(DLY_MARK[a.state][1])+'.</p>';
 return out+'</div>';}

/* ---- the bank, listed by date. Past days stay as they were written. ---- */
function dlyPastHtml(p,day){
 var days=((p.summaries&&p.summaries.days)||[]).filter(function(d){return !day||d.id!==day.id;}).slice(-7).reverse();
 if(!days.length)return '';
 var body=days.map(function(d){
  return '<div class="dl-past" data-sid="'+esc(d.id)+'"><div class="dl-pd">'+esc(dlyDayWord(d.d))+'</div>'
   +(d.st.length?d.st.map(dlyStHtml).join('')
     :'<p class="dl-st dl-quiet">Too little was on the record that day to say anything.</p>')+'</div>';}).join('');
 return '<details class="sg-fold dl-bank"'+(SUM_OPEN.dlpast?' open':'')+' data-fold="dlpast"><summary><span>Past days</span>'
  +sumIc('chev','sg-chev')+'</summary><div class="sg-fold-b">'+body+'</div></details>';}

/* the whole column for one record and one moment. Returns '' when the
   surface is silent. */
function sumDayHtml(r,now){
 var p=CURP; now=now||Date.now();
 if(!p||!r||r.unread)return '';
 var rec=dlyIsRec(p), day=rec?dlyToday(p,now):null, st=null, head='', thin=false;
 if(day){
  st=day.st; thin=!!day.silent;
  head='<p class="dl-when">Written at '+dlyClock(day.t)+', the first time you opened this page today. '
   +'It stays as written until tomorrow.</p>';}
 else if(rec&&!(DLY_TRIED&&DLY_TRIED.get(p)===dlyDay(now)))return '';
 else{
  var res=dlyLive(p,now,r);
  if(res.state==='unread')return '';
  st=res.st; thin=!st.length;}
 var out=head+(thin?'<p class="dl-st dl-quiet">Not enough is on the record yet to say anything about today.</p>':dlyBlocks(st));
 if(day)out+=dlyAimHtml(p,day,now);
 if(rec)out+=dlyPastHtml(p,day);
 return out;}
function sumDayPaint(r){
 var h=document.getElementById('sumday'); if(!h)return;
 DLY_R=r||null;
 var html='';
 try{html=sumDayHtml(r);}catch(e){html=''; if(typeof console!=='undefined')console.error(e);}
 h.innerHTML=html;
 h.closest&&h.closest('.lsec')&&h.closest('.lsec').classList.toggle('dl-empty',!html);
 dlyWire(h);}
function sumDayClear(){var h=document.getElementById('sumday'); if(h&&h.innerHTML)h.innerHTML=''; DLY_R=null;}

/* ---- THE ONE WRITE. The first open of the Summary each local day. ---- */
function sumDayOpen(){
 try{
  if(S.tab!==TAB.SUMMARY||!CURP||!dlyIsRec(CURP))return;
  var r=DLY_R||computeSeen(), now=Date.now(), d=dlyDay(now);
  if(r.unread||dlyToday(CURP,now))return;
  if(DLY_TRIED&&DLY_TRIED.get(CURP)===d)return;
  var o=dlyDayOpen(CURP,now,pSave,{r:r});
  if(o.result==='error'){
   if(DLY_TRIED)DLY_TRIED.set(CURP,d);
   if(o.why!=='NotARecord')status(/could not save/.test(o.why)
    ?'Today\'s summary was not saved. Storage is full or blocked.'
    :'Today\'s summary was not saved. '+o.why,'fail');}
  sumDayPaint(r);}
 catch(e){if(typeof console!=='undefined')console.error(e);}}

/* ---- the writes a person makes, each through the engine's boundary ----
   A refused write changes nothing, because the engine returns a new bank and
   the old one is only replaced once the save has it. */
function dlyCommit(res){
 if(!res||!res.ok){status('Not saved. '+((res&&res.errs&&res.errs[0])||'The record refused it.'),'fail'); return false;}
 var old=CURP.summaries; CURP.summaries=res.S;
 if(!pSave()){CURP.summaries=old; statusSaved(); return false;}
 statusSaved(); return true;}
function dlyWire(h){
 if(!h||h._dlw)return; h._dlw=1;
 h.addEventListener('toggle',function(ev){var d=ev.target;
  if(d&&d.getAttribute&&d.getAttribute('data-fold'))SUM_OPEN[d.getAttribute('data-fold')]=d.open;},true);
 h.addEventListener('input',function(ev){
  var t=ev.target; if(!t||t.id!=='dlaimin')return;
  var b=t.form&&t.form.querySelector('.dl-go'); if(b)b.disabled=!t.value.trim();});
 h.addEventListener('submit',function(ev){
  var f=ev.target; if(!f||!f.getAttribute||!f.getAttribute('data-dlaim'))return;
  ev.preventDefault();
  var i=f.querySelector('#dlaimin'), v=i?i.value.trim():'';
  if(!v||!CURP)return;
  if(dlyCommit(dlyAimSet(CURP,Date.now(),v,null)))sumDayPaint(DLY_R);});
 h.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-dlmark]'):null; if(!b||!CURP)return;
  if(dlyCommit(dlyAimAnswer(CURP,b.getAttribute('data-sid'),b.getAttribute('data-dlmark'),Date.now())))
   sumDayPaint(DLY_R);});}
