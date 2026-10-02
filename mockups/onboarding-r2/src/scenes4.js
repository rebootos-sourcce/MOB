/* scenes4.js. The release screens, as HTML builders that take a state, so the
   live prototype and the frame strips are the same markup.

   WHAT THE SOFTWARE DOES, which these frames now match (atuned_src/ui/
   release.js, DESIGN-release.md, round OZ):
     1. It opens on a recorded voice, not on a sequence of text screens. The
        intro text is on one screen and writes out as the words are said.
     2. At the prompt, "I am releasing ...", the line writes out, freezes and
        pulses a little. No number and no word "now" sits under it.
     3. The run is address by address. At each address four blocks, in the
        order CHAN gives: left release, right release, left install, right
        install. The mini release says one line a block: 3 addresses of 4
        lines, 12 lines. Left and right are the counter, so there is no timer.
     4. Then the cooldown: stop the work, the charge moves up and out, notice
        which place answers, two minutes of awareness inside the body. That
        two minutes is the one clock left (REL_SETTLE_S in release.js).
     5. Buttons: pause, voice on and off, end session. End does not abandon
        the run: it commits and runs the cooldown. */
var SUBJECT='taking care of everybody else';
var STMT_REL='I am releasing believing, thinking, feeling, behaving and acting that I am ';
var STMT_INS='I now embody the truth that I am safe when I put things down.';
var INTRO=['Sit down. Put both feet on the floor.','Move your awareness inside your body.','Take one breath. Feel what your body is doing.','Keep your awareness inside it.'];
var COOLING=['Stop the work. Stay where you are.','The charge moves up and out through the mouth.','Notice which place answers.','Keep your awareness inside your body.'];

function waveSVG(){var d='';for(var x=0;x<=600;x+=5){var a=18*Math.sin(x/38)*Math.sin(x/170+.6);d+=(x?'L':'M')+x+' '+f(24+a);}
 return '<svg viewBox="0 0 600 48" preserveAspectRatio="none" aria-label="Voice level"><path d="'+d+'" fill="none" stroke="'+ACC+'" stroke-width="2" stroke-linecap="round"/></svg>';}
function relButtons(o){
 o=o||{};
 return '<div class="rbtns">'
  +'<button type="button" class="btn rb" aria-label="Pause">'+ico('pause',20)+'<span>Pause</span></button>'
  +'<button type="button" class="btn rb" aria-pressed="'+(!o.mute)+'" aria-label="Voice '+(o.mute?'off':'on')+'">'+ico(o.mute?'voiceoff':'voice',20)+'<span>Voice '+(o.mute?'off':'on')+'</span></button>'
  +'<button type="button" class="btn rb end" aria-label="End session" data-go="'+(o.endGo||'observe')+'">'+ico('stop',20)+'<span>End session</span></button></div>';}

/* the opening. chars is how many characters of INTRO then the statement have
   been written, in order. The statement is the last thing written; once it is
   whole it freezes and pulses (class .frozen). */
function relOpenHTML(chars,o){
 o=o||{};var left=chars,out='',total=0;
 INTRO.forEach(function(l){total+=l.length;});
 var stm=STMT_REL+SUBJECT+'.';
 out+='<div class="vbadge"><span class="vring">'+ico('mic',22)+'</span><span><b>Recorded voice</b><span class="small"> Speaking now</span></span><span class="vwave">'+waveSVG()+'</span></div>';
 out+='<div class="intro">';
 INTRO.forEach(function(l,i){
  var n=Math.max(0,Math.min(l.length,left));left-=l.length;
  var done=n>=l.length,cur=(!done&&n>0);
  out+='<p class="iln'+(done?' dn':'')+'">'+l.slice(0,n)+(cur&&!o.nocaret?'<i class="caret"></i>':'')+(n===0?'&nbsp;':'')+'</p>';});
 out+='</div>';
 var sn=Math.max(0,Math.min(stm.length,left)),whole=sn>=stm.length;
 var shown=stm.slice(0,sn),k=STMT_REL.length;
 var html=shown.length<=k?shown:shown.slice(0,k)+'<span class="sbj">'+shown.slice(k)+'</span>';
 out+='<div class="stm t-said'+(whole?' frozen':'')+'" aria-live="off"><p class="quote">'+html+(!whole&&sn>0&&!o.nocaret?'<i class="caret"></i>':'')+(sn===0?'&nbsp;':'')+'</p></div>';
 return out;}

/* the run. i is the line being said, 0..11. p is how far through it. */
var START_PCT=[62,88,71],END_PCT=[24,35,29];
function runState(i,p){
 var a=Math.floor(i/4),b=i%4,cells=[0,1,2,3].map(function(j){return {s:j<b?'done':(j===b?'now':'wait'),p:j===b?p:null};});
 var pcts=[0,1,2].map(function(k){
  if(k<a)return END_PCT[k];
  if(k>a)return START_PCT[k];
  var frac=(b+p)/4;return Math.round(START_PCT[k]+(END_PCT[k]-START_PCT[k])*frac);});
 return {a:a,b:b,cells:cells,pcts:pcts};}
function relRunHTML(M,i,p,o){
 o=o||{};var st=runState(i,p),a=st.a,b=st.b;
 var strip='<div class="astrip">'+ADDR.map(function(ad,k){return addrCard(ad,st.pcts[k],k<a?'done':(k===a?'now':'wait'));}).join('')+'</div>';
 var stmt=(b<2)?'<p class="quote">'+STMT_REL+'<span class="sbj">'+SUBJECT+'</span>.</p>':'<p class="quote">'+STMT_INS+'</p>';
 var msz=M?236:400;
 return strip
  +'<div class="rmain"><div class="mx">'+matrixSVG(msz,st.cells)+'</div>'
  +'<div class="rtext2 t-said"><p class="small dim">'+ADDR[a].k+', '+ADDR[a].a.toLowerCase()+'</p>'+stmt+'</div></div>'
  +'<div class="rpath">'+twelveSVG(M?330:620,i,i)+'</div>'
  +relButtons(o);}

/* the cooldown */
function relCoolHTML(M,left,o){
 o=o||{};
 return '<div class="cool"><div class="clk">'+clockSVG(M?200:300,left)+'</div>'
  +'<div class="cl">'+COOLING.map(function(l,i){return '<p class="'+(i===2?'on':'')+'">'+l+'</p>';}).join('')+'</div></div>'
  +relButtons(Object.assign({endGo:'observe'},o));}
