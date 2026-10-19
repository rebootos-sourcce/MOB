/* ============================================================
   RELEASE MOCKUPS, SHARED. SESSION (the lines, off the engine), TIMING
   (the product's speech constants), WELCOME, IC (the release's marks),
   ALLOW (tier one), CRISIS and BODY are injected by build.js. Everything
   a person reads that is not one of those is in W below, in one place,
   so the voice gate reads one list.

   ONE SCREEN. Nothing here navigates. Each version mounts its regions
   once and paints them from one model on every change, so Begin, the
   script, the list, the cooldown and the completion are the same page
   changing in place, never a jump to another screen.
   ============================================================ */
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const Q=new URLSearchParams(location.search);
const EMBED=Q.get('embed')==='1', PHONE=Q.get('ph')==='1';
const RM=Q.get('rm')==='1'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const PACE=Math.max(1,+(Q.get('pace')||1));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const N=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const and=a=>a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const words=t=>String(t).split(/\s+/).filter(Boolean).length;
const mmss=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};

const STATES=[
 {k:'before', nm:'Before begin',   note:'The setup and the script on one screen. Nothing has been said yet.'},
 {k:'script', nm:'Voice script',   note:'Begin was pressed. The voice is reading the setup; the screen shows what it says.'},
 {k:'run',    nm:'Mid list',       note:'The list is running: the release half at the first address.'},
 {k:'reframe',nm:'Reframe half',   note:'The same address, its reframe half. The prompt above changes to his "I know that I am".'},
 {k:'paused', nm:'Paused',         note:'Pause was pressed. Play and End session are the two choices.'},
 {k:'cool',   nm:'Cooldown',       note:'The last line is said. Two minutes of stillness, counted down.'},
 {k:'ended',  nm:'Ended early',   note:'End was pressed partway through the second address. His 18 October ruling: the count is what was actually said, not the full planned run.'},
 {k:'done',   nm:'Completion',     note:'Congratulations, and the numbers that moved.'},
 {k:'spent',  nm:'Allowance spent',note:'The same completion, on a run that opened the last new patterns this month.'}];
const S0=STATES.some(s=>s.k===Q.get('s'))?Q.get('s'):'before';

/* ---- the words ---- */
const ADDR=SESSION.addr;
const RENEWS='14 Nov 2026';
const W={
 /* his, 17 October, said by the voice and shown as it is said */
 opening:'Okay, we are getting into a release session.',
 releasing:'You are releasing '+and(ADDR.map(a=>a.k.toLowerCase()))+'.',
 ready:'When you\'re ready, let\'s begin.',
 resonance:'I\'m letting go of believing, perceiving, thinking, behaving, acting, feeling.',
 prompt:{release:'I\'m releasing believing, perceiving, thinking, behaving, acting, feeling that I am',
  reframe:'I know that I am'},
 /* his exact words, 18 October, in place of the four line rotation this replaced */
 cool:['Focus your awareness inside your body for the next 2 minutes.'],
 /* the setup */
 title:'Release',
 fromStory:'Story', fromSeat:'Seat',
 story:'I keep bracing for the next thing to go wrong. I check my phone over and over, and my stomach knots before every message.',
 written:'Written 17 October',
 seatLine:'Your three heaviest places, read off your field.',
 place:a=>a.place+', '+a.seatWord,
 dose:'Left and right', doseMeans:'How many times each side is said.',
 est:(d,l,m)=>d+' times each side: '+N(l)+' lines, about '+m+' minutes.',
 voice:'Voice', voiceMeans:'ElevenLabs, a voice company, reads each line aloud over the network.',
 tone:'Binaural tone', toneMeans:'A low tone, a little different in each ear. Needs headphones.',
 begin:'Begin',
 /* the run */
 pause:'Pause', play:'Play', end:'End session',
 left:n=>N(n)+(n===1?' line left':' lines left'),
 /* his 18 October ask: the countdown split by the engine's own two channels
    inside the half that is running, left release/right release or left
    reframe/right reframe (schema.js: "left release, right release, left
    reframe, right reframe"). Each side starts at the dose and counts to
    nought as that side is said. */
 split:(l,r)=>N(l)+' left, '+N(r)+' right',
 minLeft:m=>m<=1?'About a minute left':'About '+m+' minutes left',
 half:{release:'Release',reframe:'Reframe'},
 halfMeans:{release:'Letting go, left side then right.',reframe:'Putting back what is true, left side then right.'},
 pausedSay:'Paused. The list waits on this line.',
 /* the cooldown */
 coolNm:'Cooldown', finish:'Finish now',
 /* the completion */
 congrats:'Congratulations.',
 did:(p,k)=>'You released '+N(p)+' patterns at '+k+' places in your body.',
 ended:(p,k)=>'You ended early. You released '+N(p)+' patterns at '+k+(k===1?' place':' places')+' in your body.',
 fig:{released:'Released',bank:'Bank',vault:'Vault'},
 figU:{released:'this session',bank:'still held',vault:'released, ever'},
 figM:{released:'Opened for the first time today.',bank:'Waiting in your body to be released.',vault:'Kept on your record.'},
 pattern:'A pattern is one line at one place in your body, the first time it is said.',
 month:n=>N(n)+' new patterns left this month.',
 another:'Run another session',
 rerun:'Rerun these', close:'Close', tiers:'See the tiers',
 /* his 18 October completion buttons. Run another session stays in the
    release flow (his "back to your bank in session"); End session is new
    and provisional, his own words: "We'll change it if we need to." Demo
    only, the same pattern as Close and See the tiers above: a status line
    says where it goes rather than a page that does not exist here. */
 endSession:'End session',
 summaryNote:'Demo: in the app this opens Summary, with today\'s reading already on it.',
 /* the 17 October allowance ruling's words, with this period's name, and its day */
 spent:'This month\'s new patterns are all opened. Everything you have opened still runs, free, as often as you like. New ones arrive on '+RENEWS+'.',
 spentSlot:'Run another session',
 spentWhen:'New patterns arrive on '+RENEWS+'.',
 /* demo only, never product copy */
 demo:'Mockup, not the product. Silent: the voice is shown as words.'};

/* ---- the session ---- */
const DOSE0=TIMING.doses.indexOf(+Q.get('dose'))>=0?+Q.get('dose'):100;   /* his default, round LY */
const ST={ph:'before',si:0,ri:0,cool:TIMING.settle,paused:false,live:false,halted:false,reach:0,
 dose:DOSE0,from:'story',voice:true,tone:false,spent:S0==='spent',crisis:null,status:''};
const PER_ADDR=()=>4*ST.dose;
const TOTAL=()=>ADDR.length*PER_ADDR();
/* the line at a position on the list: the address, its channel in the product's order
   (left release, right release, left reframe, right reframe), and the card's sentence
   for that pass, cycled the way the product cycles a printed card */
function lineAt(i){
 if(i<0||i>=TOTAL())return null;
 const a=Math.floor(i/PER_ADDR()), r=i%PER_ADDR(), c=Math.floor(r/ST.dose), p=r%ST.dose;
 const A=ADDR[a], C=A.ch[c];
 return {i,a,c,p,addr:A,half:C.half,side:C.side,text:C.lines[p%C.lines.length]+'.',col:'var('+A.col+')'};}
/* what the voice says for a line: his stem's last words and the sentence */
const spoken=l=>(l.half==='reframe'?'I know that I am ':'that I am ')+l.text;
const secLine=l=>words(spoken(l))*TIMING.word+TIMING.gap;
const SCRIPT=[W.opening,W.releasing].concat(WELCOME,[W.ready,W.resonance]);
const secSay=(t,k)=>words(t)*TIMING.word+TIMING.gap+TIMING.frame+(t===W.ready?3:0);
function secsFrom(ri){let s=0;for(let i=ri;i<TOTAL();i++)s+=secLine(lineAt(i));return s;}
function estMin(){return Math.round((SCRIPT.reduce((s,t)=>s+secSay(t),0)+secsFrom(0))/60);}
/* his 18 October ask: the countdown split by side, left and right, inside
   the half now running (schema.js's own order: left release, right
   release, left reframe, right reframe). Each half is two channels, the
   left one then the right one; whichever has not started yet still reads
   the full dose, never a number that has not been earned. */
function sideSplit(i){
 const within=Math.floor((i%PER_ADDR())/ST.dose), pos=i%ST.dose, atLeft=within%2===0;
 return {left:atLeft?ST.dose-pos:0, right:atLeft?ST.dose:ST.dose-pos};}

/* ---- the allowance, tier one, this month ---- */
/* his 18 October ruling: ending early counts only what was actually said.
   A channel (left release, right release, left reframe or right reframe)
   opens its pattern the first time any of its lines is said, so the count
   on an early end is the number of channels actually reached, global
   across the whole run, never the full planned run. */
function money(){
 const left0=ST.spent?12:300, vault0=88, bank0=56, full=ADDR.length*ALLOW.patternsPerAddress;
 const p=ST.halted?ST.reach:full, places=ST.halted?Math.min(ADDR.length,Math.ceil(p/ALLOW.patternsPerAddress)):ADDR.length;
 return {released:p,places,bank:bank0-p,vault:vault0+p,left:Math.max(0,left0-p),
  canRun:(left0-p)>=ALLOW.patternsPerAddress};}

/* ---- the model every version paints from ---- */
function model(){
 const cur=ST.ph==='run'?lineAt(ST.ri):null;
 const half=cur?cur.half:(ST.ph==='script'||ST.ph==='before'?'release':'release');
 return {ph:ST.ph,paused:ST.paused,live:ST.live,rm:RM,dose:ST.dose,from:ST.from,voice:ST.voice,tone:ST.tone,
  script:{items:SCRIPT,i:ST.si,cur:SCRIPT[Math.min(ST.si,SCRIPT.length-1)]},
  run:{i:ST.ri,N:TOTAL(),left:TOTAL()-ST.ri,cur,half,prompt:W.prompt[half],addr:cur?cur.addr:ADDR[0],
   split:ST.ph==='run'?sideSplit(ST.ri):null,
   min:Math.max(1,Math.ceil(secsFrom(ST.ri)/60))},
  est:{lines:TOTAL(),min:estMin()},
  cool:{left:ST.cool,said:Math.min(W.cool.length,Math.floor((TIMING.settle-ST.cool)/6)+1)},
  done:Object.assign(money(),{halted:ST.halted})};}

/* ---- the clock. Live only after a press: a state opened from the demo bar is a
   still picture of that moment until Begin, Play or Rerun is pressed. ---- */
let TMR=null;
function stop(){clearTimeout(TMR);TMR=null;}
function arm(){
 stop(); if(!ST.live||ST.paused)return;
 if(ST.ph==='script'){TMR=setTimeout(()=>{ST.si++;if(ST.si>=SCRIPT.length){ST.ph='run';ST.ri=0;}paint();arm();},secSay(SCRIPT[ST.si])*1000/PACE);}
 else if(ST.ph==='run'){TMR=setTimeout(()=>{ST.ri++;if(ST.ri>=TOTAL()){ST.ph='cool';ST.cool=TIMING.settle;}paint();arm();},secLine(lineAt(ST.ri))*1000/PACE);}
 else if(ST.ph==='cool'){TMR=setTimeout(()=>{ST.cool--;if(ST.cool<=0){ST.ph='done';}paint();arm();},1000/PACE);}}
function go(ph){ST.ph=ph;ST.paused=false;paint();arm();}
function setState(k){
 Object.assign(ST,{ph:'before',si:0,ri:0,cool:TIMING.settle,paused:false,live:false,halted:false,spent:k==='spent'});
 if(k==='script')Object.assign(ST,{ph:'script',si:4});
 if(k==='run')Object.assign(ST,{ph:'run',ri:ST.dose+11});
 if(k==='reframe')Object.assign(ST,{ph:'run',ri:2*ST.dose+3});
 if(k==='paused')Object.assign(ST,{ph:'run',ri:ST.dose+11,paused:true});
 if(k==='cool')Object.assign(ST,{ph:'cool',cool:84});
 /* a believable partial run: the first address fully said (4 patterns) and
    the second address's left release channel started and said, one more
    pattern, then End was pressed before the second address finished and
    before the third was touched at all. */
 if(k==='ended')Object.assign(ST,{ph:'done',halted:true,reach:5});
 if(k==='done'||k==='spent')ST.ph='done';}

/* ---- the presses, one place ---- */
const ACT={
 begin(){ST.live=true;ST.si=0;ST.ri=0;ST.halted=false;go('script');},
 pause(){ST.paused=true;stop();paint();},
 play(){ST.paused=false;ST.live=true;paint();arm();},
 /* his 18 October ruling: the count an early end reports is what was said
    up to that point, never the full planned run. A channel opens its
    pattern the first time one of its lines is said, so a line said inside
    a channel counts that whole channel; a channel never reached does not. */
 end(){ST.halted=true;ST.reach=ST.ph==='run'?Math.ceil(ST.ri/ST.dose):(ST.ph==='script'?0:ADDR.length*ALLOW.patternsPerAddress);ST.ph='cool';ST.cool=TIMING.settle;ST.paused=false;ST.live=true;paint();arm();},
 finish(){stop();ST.ph='done';paint();},
 another(){stop();setState('before');paint();},
 rerun(){ST.spent=false;ST.live=true;ST.si=0;ST.ri=0;ST.halted=false;say('Demo: a rerun spends nothing, so the allowance does not move.');go('script');},
 close(){say('Demo: in the app this closes the release and goes back to where it was opened.');},
 tiers(){say('Demo: in the app this opens the plan sheet.');},
 /* his completion button, provisional ("We'll change it if we need to").
    Demo only, the same pattern as Close and See the tiers: this one page
    has nowhere to go, so a status line says where it goes in the app. */
 endsession(){say(W.summaryNote);},
 from(b){ST.from=b.dataset.v;paint();},
 dose(b){ST.dose=+b.dataset.v;paint();},
 voice(){ST.voice=!ST.voice;paint();},
 tone(){ST.tone=!ST.tone;paint();},
 crisis(){ST.crisis='ask';crisisPaint();},
 cxreach(){ST.crisis='reach';crisisPaint();},
 cxtalk(){ST.crisis=null;crisisPaint();say('Demo: in the app Talk it through opens your journal.');},
 cxclose(){ST.crisis=null;crisisPaint();const b=$('.crx');if(b)b.focus();}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const f=ACT[b.dataset.act];if(f){e.preventDefault();f(b);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ST.crisis){ACT.cxclose();e.stopPropagation();}
 if(e.key===' '&&!ST.crisis&&ST.ph==='run'&&!/BUTTON|INPUT/.test((document.activeElement||{}).tagName||'')){e.preventDefault();(ST.paused?ACT.play:ACT.pause)();}});
function say(t){const s=$('.st');if(!s)return;s.textContent=t;s.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>s.classList.remove('on'),3200);}

/* ---- marks. Ring, never fill: the product's own where it has one (REL_IC). ---- */
const svg=(d,cls)=>'<svg viewBox="0 0 24 24" class="ri'+(cls?' '+cls:'')+'" aria-hidden="true">'+d+'</svg>';
const MK={
 x:svg(IC.x), pause:svg(IC.pause), play:svg(IC.play), stop:svg(IC.stop),
 clock:svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
 rerun:svg('<path d="M19 12a7 7 0 1 1-2.05-4.95"/><path d="M19 4.5V8h-3.5"/>'),
 voice:svg('<circle cx="12" cy="12" r="9.5"/><path class="b b1" d="M8.5 10.5v3"/><path class="b b2" d="M12 8v8"/><path class="b b3" d="M15.5 10.5v3"/>'),
 /* the crisis mark, 18 October: his words, "is this a crisis making an
    icon? I don't know what voice make it an icon." A life ring, the
    safety glyph convention (a ring, a hole and four straps), so it reads
    on its own and not as a question mark. Ring, never fill. */
 help:svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M6.3 6.3l2.9 2.9M17.7 6.3l-2.9 2.9M17.7 17.7l-2.9-2.9M6.3 17.7l2.9-2.9"/>')};
const ringSw=()=>'<svg viewBox="0 0 24 24" class="rk" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle class="dot" cx="12" cy="12" r="4.2"/></svg>';
/* a seat mark: a ring in the seat's colour, the family the Field already draws */
const seatMk=(a,sz)=>'<svg viewBox="0 0 24 24" width="'+(sz||14)+'" height="'+(sz||14)+'" aria-hidden="true" style="color:var('+a.col+');flex:none"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3"/></svg>';

/* ---- the shared pieces a version places ---- */
const UI={
 x:()=>'<button type="button" class="x" data-act="close" aria-label="'+W.close+'">'+MK.x+'</button>',
 crx:()=>'<button type="button" class="crx" data-act="crisis" aria-haspopup="dialog">'+esc(CRISIS.say.open)+'</button>',
 from:m=>'<div class="seg" role="group" aria-label="Where the list comes from">'
  +['story','seat'].map(v=>'<button type="button" data-act="from" data-v="'+v+'" aria-pressed="'+(m.from===v)+'">'+(v==='story'?W.fromStory:W.fromSeat)+'</button>').join('')+'</div>',
 dose:m=>'<div class="seg" role="group" aria-label="'+W.dose+'">'
  +TIMING.doses.map(d=>'<button type="button" class="num" data-act="dose" data-v="'+d+'" aria-pressed="'+(m.dose===d)+'">'+d+'</button>').join('')+'</div>',
 voice:m=>'<button type="button" class="sw" data-act="voice" aria-pressed="'+m.voice+'">'+ringSw()+'<span>'+W.voice+'</span></button>',
 tone:m=>'<button type="button" class="sw" data-act="tone" aria-pressed="'+m.tone+'">'+ringSw()+'<span>'+W.tone+'</span></button>',
 begin:()=>'<button type="button" class="go" data-act="begin">'+W.begin+'</button>',
 pause:m=>m.paused
  ?'<button type="button" class="q" data-act="play">'+MK.play+'<span>'+W.play+'</span></button>'
   +'<button type="button" class="q" data-act="end">'+MK.stop+'<span>'+W.end+'</span></button>'
  :'<button type="button" class="q" data-act="pause">'+MK.pause+'<span>'+W.pause+'</span></button>',
 vm:(on,t)=>'<span class="vm'+(on?' on':'')+'">'+MK.voice+(t?'<span>'+esc(t)+'</span>':'')+'</span>',
 /* what follows a completion: one primary, or, with nothing new left, the rerun first */
 after:m=>m.done.canRun
  ?'<button type="button" class="go" data-act="another">'+W.another+'</button>'
  :'<button type="button" class="go" data-act="rerun">'+MK.rerun+'<span>'+W.rerun+'</span></button>',
 /* his second completion button, 18 October, beside the first, same size */
 endsession:()=>'<button type="button" class="go2" data-act="endsession">'+MK.stop+'<span>'+W.endSession+'</span></button>',
 /* his four icons, 18 October: "the 'is this a crisis' button, the voice
    button, and the pause button and the end button, those should all be
    symmetrical and aligned." One row, equal icons, no caption: each one
    is a glyph the house already treats as needing none (the same way the
    exit mark above carries no visible word, only aria-label). */
 quad:m=>{
  const vLbl=W.voice+', '+(m.voice?'on':'off');
  return '<div class="quad" role="group" aria-label="Session controls">'
   +'<button type="button" class="q qi" data-act="crisis" aria-haspopup="dialog" aria-label="'+esc(CRISIS.say.open)+'" title="'+esc(CRISIS.say.open)+'">'+MK.help+'</button>'
   +'<button type="button" class="q qi vm'+(m.voice&&!m.paused?' on':'')+'" data-act="voice" aria-pressed="'+m.voice+'" aria-label="'+esc(vLbl)+'" title="'+esc(W.voice)+'">'+MK.voice+'</button>'
   +(m.paused
    ?'<button type="button" class="q qi" data-act="play" aria-label="'+esc(W.play)+'" title="'+esc(W.play)+'">'+MK.play+'</button>'
    :'<button type="button" class="q qi" data-act="pause" aria-label="'+esc(W.pause)+'" title="'+esc(W.pause)+'">'+MK.pause+'</button>')
   +'<button type="button" class="q qi" data-act="end" aria-label="'+esc(W.end)+'" title="'+esc(W.end)+'">'+MK.stop+'</button>'
   +'</div>';}};

/* ---- the carousel: keyed rows that move, never a redraw ---- */
function carSync(el,get,focus,span){
 if(!el)return; span=RM?0:(span==null?3:span);
 const rows=el._rows||(el._rows={}), keep={};
 for(let d=-span;d<=span;d++){
  const i=focus+d, it=get(i); if(!it)continue; keep[i]=1;
  let r=rows[i];
  if(!r){r=document.createElement('div');r.className='cr'+(it.cls?' '+it.cls:'');r.dataset.k=i;
   r.innerHTML=(it.pre||'')+'<span class="t">'+esc(it.text)+'</span>';
   if(it.col)r.style.setProperty('--c',it.col);
   r.style.transform='translateY(calc(var(--rowh) * '+(d+1)+'))';r.classList.add('gone');
   el.appendChild(r);rows[i]=r;void r.offsetHeight;}
  r.classList.remove('gone');r.dataset.d=Math.abs(d);
  r.style.transform='translateY(calc(var(--rowh) * '+d+'))';}
 Object.keys(rows).forEach(k=>{if(keep[k])return;const r=rows[k];delete rows[k];
  if(RM){r.remove();return;}
  const d=(+k<focus)?-span-1:span+1;r.dataset.d=3;r.classList.add('gone');
  r.style.transform='translateY(calc(var(--rowh) * '+d+'))';setTimeout(()=>r.remove(),700);});}
function carReset(el){if(!el)return;el.innerHTML='';el._rows={};}

/* ---- the crisis panel: the product's words and numbers, its own layer ---- */
function crisisPaint(){
 let bk=$('.cx-bk'); if(!ST.crisis){if(bk)bk.remove();return;}
 if(!bk){bk=document.createElement('div');bk.className='cx-bk';document.body.appendChild(bk);
  bk.addEventListener('click',e=>{if(e.target===bk)ACT.cxclose();});}
 const C=CRISIS.say, reach=ST.crisis==='reach';
 bk.innerHTML='<div class="cx-card" role="dialog" aria-modal="true" aria-labelledby="cxh"><h2 id="cxh" tabindex="-1">'+esc(reach?C.reach:C.h)+'</h2>'
  +(reach?'<ul>'+CRISIS.lines.map(l=>'<li><p>'+esc(l.say)+'</p><div class="cx-go">'+l.go.map(g=>'<a class="'+(g[2]?'go':'q')+'" href="'+esc(g[1])+'">'+esc(g[0])+'</a>').join('')+'</div></li>').join('')+'</ul><p class="dim">'+esc(C.where)+'</p>'
   :'<p>'+esc(C.q)+'</p><p class="dim">'+esc(C.journal)+'</p>')
  +'<div class="cx-acts">'+(reach?'':'<button type="button" class="go" data-act="cxreach">'+esc(C.reach)+'</button>')
  +'<button type="button" class="q" data-act="cxtalk">'+esc(C.talk)+'</button><button type="button" class="q" data-act="cxclose">'+esc(C.close)+'</button></div></div>';
 $('#cxh',bk).focus();}

/* ---- the demo bar and the page ---- */
function demoBar(){
 const keep=(o)=>{const p=new URLSearchParams(location.search);Object.keys(o).forEach(k=>o[k]==null?p.delete(k):p.set(k,o[k]));return '?'+p.toString();};
 const st=STATES.filter(s=>s.k===S0)[0];
 return '<div class="demo"><span class="dl"><b>'+VERSION.n+'. '+esc(VERSION.name)+'</b> <span class="long">'+esc(W.demo)+'</span></span><span class="sp"></span>'
  +'<button type="button" class="dbtn" id="dtog" aria-expanded="false" aria-controls="drawer">States and versions</button></div>'
  +'<div class="drawer" id="drawer"><div class="row"><span class="lab">Version</span>'
  +VERSIONS.map(v=>'<a href="'+v.id+'.html'+keep({})+'"'+(v.id===VERSION.id?' aria-current="page"':'')+'>'+v.n+'. '+esc(v.name)+'</a>').join('')+'</div>'
  +'<div class="row"><span class="lab">State</span>'+STATES.map(s=>'<a href="'+keep({s:s.k})+'"'+(s.k===S0?' aria-current="page"':'')+'>'+esc(s.nm)+'</a>').join('')+'</div>'
  +'<div class="row"><span class="lab">Motion</span><a href="'+keep({rm:null})+'" aria-pressed="'+(!RM)+'">Full</a><a href="'+keep({rm:1})+'" aria-pressed="'+RM+'">Reduced</a></div>'
  +'<div class="row"><span class="lab">Pace</span>'+[1,4,20].map(p=>'<a href="'+keep({pace:p===1?null:p})+'" aria-pressed="'+(PACE===p)+'">'+(p===1?'Real':p+' times')+'</a>').join('')+'</div>'
  +'<div class="row"><span class="lab">Width</span><a href="'+keep({ph:null})+'" aria-pressed="'+(!PHONE)+'">This window</a><a href="'+keep({ph:1})+'" aria-pressed="'+PHONE+'">Phone, 390 by 844</a></div>'
  +'<p class="note">'+esc(st.note)+' A state opened here is still until you press something on it. Begin, Play and Rerun these run it live, at real pace unless Pace says otherwise. The voice is silent: the product speaks through ElevenLabs over the network, and this file makes no request.</p></div>';}
let PAINT=null;
function paint(){if(PAINT)PAINT(model());}
function boot(){
 if(EMBED)document.body.classList.add('embed');
 if(RM)document.body.classList.add('rm');
 const app=$('#app');
 if(PHONE&&!EMBED){const p=new URLSearchParams(location.search);p.delete('ph');p.set('embed','1');
  app.innerHTML=demoBar()+'<div class="stage"><div class="phone"><iframe title="Phone, 390 by 844" src="?'+p.toString()+'"></iframe></div></div>';}
 else{
  app.innerHTML=(EMBED?'':demoBar())+'<div class="stage"><main class="rs" id="rs" aria-label="Release"></main><div class="st" role="status" aria-live="polite"></div></div>';
  setState(S0);
  V.mount($('#rs'));PAINT=V.paint;paint();}
 const t=$('#dtog');if(t)t.onclick=()=>{const d=$('#drawer'),o=!d.classList.contains('open');d.classList.toggle('open',o);t.setAttribute('aria-expanded',o);};}
