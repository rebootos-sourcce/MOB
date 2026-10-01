/* tutorial.js. The first-run tutorial, and the skippable questions.
   Hash: #t0 #t1 #t2 #t3 #t4 #q0 #q1 #q2 #q3
   The loop is the only progress object here: a ring docked top right, never a
   list. Each station is shown by doing it, then named. */
(function(){
var W=innerWidth,HT=innerHeight,M=W<=700;
var root=document.createElement('div');root.className='stage';document.body.appendChild(root);
var bg=document.createElement('div');bg.className='fieldbg';root.appendChild(bg);
var ui=document.createElement('div');ui.className='ui';root.appendChild(ui);
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var timers=[];function clearT(){timers.forEach(clearTimeout);timers=[];window.__stop&&window.__stop();window.__stop=null;}
function setBg(o,extra){bg.innerHTML='<svg viewBox="0 0 '+W+' '+HT+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="breathe">'+fieldRing(o)+'</g>'+(extra||'')+'</svg>';}
function chromeT(dset,lit){
 return '<div class="topl">'+mark()+'</div><div class="trace ring">'+loopRing(M?60:76,{doneSet:dset,lit:lit,labels:false,bare:true})+'</div>'+leaveBtn();}
function chromeQ(n,total){
 return '<div class="topl">'+mark()+'</div>'
  +'<div class="trace q"><span class="small">'+n+' of '+total+'</span><button type="button" class="btn ghost skipb" data-go="t4">'+ico('skip',18)+'Skip</button></div>'+leaveBtn();}

/* the wheel: a simplified Field, seven seats around a core. hi = the seat that
   carries the person's words. Everything else is held down to a third. */
function wheel(cx,cy,R,o){
 o=o||{};var hi=o.hi==null?2:o.hi,out='<g>';
 var rs=R*.56;
 out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f(R*.8)+'" fill="none" stroke="rgba(255,255,255,.09)"/>';
 out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f(rs)+'" fill="none" stroke="rgba(255,255,255,.07)"/>';
 for(var k=0;k<7;k++){
  var a=90+(k+.5)*360/7,p=polar(cx,cy,rs,a),on=k===hi,c=SEATS[k].c;
  if(on)out+='<path d="M'+f(cx)+' '+f(cy)+' L'+f(p[0])+' '+f(p[1])+'" stroke="'+c+'" stroke-width="1.8"/>';
  out+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+(on?(o.big||20):14)+'" fill="#0C0D12" stroke="'+c+'" stroke-width="'+(on?3:1.8)+'" opacity="'+(on?1:.42)+'"/>';
  if(on)out+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+(o.big?8:6)+'" fill="'+c+'"/>';
  if(o.labels!==false){var lp=polar(cx,cy,rs+(on?(o.big||20)+34:30),a);
   out+='<text x="'+f(lp[0])+'" y="'+f(lp[1]+4)+'" text-anchor="middle" font-size="'+(on?14:12)+'" font-weight="'+(on?600:500)+'" fill="'+(on?c:'#94908A')+'" opacity="'+(on?1:.7)+'" font-family="Inter,sans-serif">'+SEATS[k].n+'</text>';}
 }
 return out+'</g>';}
function wheelSVG(R,o){var sz=R*2.9;return '<svg viewBox="0 0 '+sz+' '+sz+'" width="'+sz+'" height="'+sz+'" class="wsvg">'+wheel(sz/2,sz/2,R,o)+(o&&o.extra?o.extra(sz/2,sz/2,R):'')+'</svg>';}

var SCR={};
/* ---- t0: the ring, with what the person already did placed on it ---- */
SCR.t0=function(){
 var sz=M?280:440;
 setBg({cx:M?W/2:W*.7,cy:M?HT*.5:HT*.5,r:M?150:300,arcs:false,quiet:.3,tl:M?8:12},'');
 ui.innerHTML=chromeT([0,2],1)
  +'<div class="col t0"><span class="eyebrow acc">The loop</span><h1 class="'+(M?'h1':'display')+'">Two done. Play is next.</h1>'
  +'<p class="lead">You wrote. You ran a release. Two stations are closed.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="t1">Play</button></div></div>'
  +'<div class="t0r">'+loopRing(sz,{doneSet:[0,2],lit:1,labels:true})+'</div>';};

/* ---- t1: play. The app opens an address; then names it. ---- */
SCR.t1=function(){
 var R=M?118:Math.min(HT*.36,320),cx=M?W/2:W*.34,cy=M?250:HT*.52,wsz=R*2.9,c0=wsz/2;
 setBg({cx:cx,cy:cy,r:R*1.12,arcs:false,lit:[2],quiet:.3,tl:M?8:13},'');
 var pt=polar(c0,c0,R*.56,90+2.5*360/7),px=pt[0]+22,py=pt[1]+22;
 // the pointer is a ring with a crosshair, drawn as a ghost: the app opens the address, the person does not have to
 var ptr='<circle cx="'+f(pt[0])+'" cy="'+f(pt[1])+'" r="'+(M?34:40)+'" fill="none" stroke="'+SEATS[2].c+'" stroke-width="1.6" stroke-dasharray="3 4"/>'
  +'<path d="M'+f(c0-R*.2)+' '+f(c0+R*.9)+' Q'+f(c0)+' '+f(c0+R*.3)+' '+f(px)+' '+f(py)+'" fill="none" stroke="'+INK+'" stroke-width="1.4" stroke-dasharray="2 6" stroke-linecap="round" opacity=".6"/>'
  +'<g stroke="'+INK+'" stroke-width="2" stroke-linecap="round" fill="none"><circle cx="'+f(px)+'" cy="'+f(py)+'" r="13" fill="#0C0D12"/><path d="M'+f(px)+' '+f(py-20)+' V'+f(py-13)+' M'+f(px)+' '+f(py+13)+' V'+f(py+20)+' M'+f(px-20)+' '+f(py)+' H'+f(px-13)+' M'+f(px+13)+' '+f(py)+' H'+f(px+20)+'"/></g>';
 var panel='<div class="addr t-noticed"><span class="eyebrow acc">Solar plexus</span><p class="a1">Over-responsibility</p>'
  +'<div class="kv"><span class="sl">Your words</span><span class="sv">\u201ctaking care of everybody else\u201d</span></div>'
  +'<div class="kv"><span class="sl">Opened</span><span class="sv"><span class="si" style="color:'+SEATS[2].c+'">'+ico('density',22)+'</span>10 patterns</span></div></div>';
 ui.innerHTML=chromeT([0,2],1)
  +'<div class="wh" style="left:'+(cx-wsz/2)+'px;top:'+(cy-wsz/2)+'px;width:'+wsz+'px;height:'+wsz+'px">'
  +'<svg viewBox="0 0 '+wsz+' '+wsz+'" width="'+wsz+'" height="'+wsz+'">'+wheel(c0,c0,R,{big:M?22:34})+ptr+'</svg></div>'
  +'<div class="col t1"><span class="eyebrow acc">Play</span><h1 class="'+(M?'h1':'display')+'">Open one.</h1>'
  +'<p class="lead">Your words landed here.</p>'+panel
  +'<div class="row"><button type="button" class="btn pri" data-go="t2">Flow</button></div></div>';
};

/* ---- t2: flow. It can be run again, and a rerun costs nothing. ---- */
SCR.t2=function(){
 var s=M?250:Math.min(HT*.5,470);
 setBg({cx:M?W/2:W*.3,cy:M?250:HT*.5,r:M?125:Math.min(HT*.28,260),arcs:false,lit:[2],quiet:.3,tl:M?8:12},'');
 var tenRings=''; // ten rings of ten patterns. one is spent.
 for(var i=0;i<10;i++){tenRings+='<circle cx="'+(14+i*30)+'" cy="14" r="9" fill="'+(i===0?'#0C0D12':'none')+'" stroke="'+(i===0?ACC:'rgba(255,255,255,.4)')+'" stroke-width="2"/>'+(i===0?'<circle cx="'+(14+i*30)+'" cy="14" r="3.4" fill="'+ACC+'"/>':'');}
 ui.innerHTML=chromeT([0,2],2)
  +'<div class="t2c" style="left:'+(M?(W-s)/2:W*.3-s/2)+'px;top:'+(M?96:HT*.5-s/2-10)+'px;width:'+s+'px"><div class="relbox" id="rb">'+relSVG(REL_P[5])+'</div></div>'
  +'<div class="col t2"><span class="eyebrow acc">Flow</span><h1 class="'+(M?'h1':'display')+'">Run it again.</h1>'
  +'<div class="ledger"><div class="st"><span class="sl">Opened</span><span class="sv">10 patterns</span></div>'
  +'<div class="st"><span class="sl">Left</span><span class="sv">90 patterns</span></div>'
  +'<div class="st z"><span class="sl">Rerun</span><span class="sv">0 patterns</span></div></div>'
  +'<svg class="tenr" viewBox="0 0 300 28" aria-label="Ten rings of ten patterns. One is spent.">'+tenRings+'</svg>'
  +'<p class="small">Ground you have opened costs nothing to run again.</p>'
  +'<div class="row"><button type="button" class="btn">'+ico('rerun',20)+'Run it again</button><button type="button" class="btn pri" data-go="t3">Embody</button></div></div>';
};

/* ---- t3: embody. Pick when. ---- */
SCR.t3=function(){
 setBg({cx:M?-999:W*.76,cy:HT*.5,r:M?10:210,ticks:!M,arcs:false,lit:[2],tl:12},'');
 var chips=['after I put the kettle on','before the first run of the day','when I notice it start'];
 // a day, as a path. morning marked. no ring: the ring is the loop.
 var dw=M?330:600,dp='<svg class="day" viewBox="0 0 '+dw+' 96" aria-label="A day. The morning is marked.">'
  +'<path d="M10 48 H'+(dw-10)+'" stroke="rgba(255,255,255,.22)" stroke-width="2"/>';
 var hrs=[6,9,12,15,18,21];
 hrs.forEach(function(h,i){var x=10+(dw-20)*(h-5)/(22-5);
  dp+='<path d="M'+x+' 40 V56" stroke="rgba(255,255,255,.34)" stroke-width="1.6"/><text x="'+x+'" y="78" text-anchor="middle" font-size="12" fill="#94908A" font-family="Inter,sans-serif">'+(h<10?'0'+h:h)+':00</text>';});
 var mx=10+(dw-20)*(7.25-5)/(22-5);
 dp+='<circle cx="'+f(mx)+'" cy="48" r="15" fill="none" stroke="'+ACC+'" stroke-width="1.4" stroke-dasharray="3 4"/><circle cx="'+f(mx)+'" cy="48" r="11" fill="#0C0D12" stroke="'+ACC+'" stroke-width="2.6"/><circle cx="'+f(mx)+'" cy="48" r="4" fill="'+ACC+'"/>'
  +'<text x="'+f(mx)+'" y="26" text-anchor="middle" font-size="13" font-weight="600" fill="#EFEDE8" font-family="Inter,sans-serif">after the kettle</text></svg>';
 ui.innerHTML=chromeT([0,2],3)
  +(M?'':'<div class="t3v"><div class="relbox" style="width:340px">'+relSVG(REL_P[5])+'</div></div>')
  +'<div class="col t3"><span class="eyebrow acc">Embody</span><h1 class="'+(M?'h1':'display')+'">Pick when you will come back to it.</h1>'
  +'<div class="chipcol">'+chips.map(function(c,i){return '<button type="button" class="chip'+(i===0?' on':'')+'" style="--c:'+ACC+'" aria-pressed="'+(i===0)+'">'+ico('embody',24)+c+'</button>';}).join('')+'</div>'
  +'<div class="ta one"><div class="tx dim">Or say it in your own words.</div></div>'
  +dp
  +'<div class="row"><button type="button" class="btn pri" data-go="t4">Save</button></div></div>';
};

/* ---- t4: the loop closes and becomes the Field's core ---- */
SCR.t4=function(){
 var R=M?118:Math.min(HT*.3,260),cx=M?W/2:W*.34,cy=M?250:HT*.52,wsz=R*2.9;
 setBg({cx:cx,cy:cy,r:R*1.12,arcs:false,lit:[2],quiet:.4,tl:M?8:13},'');
 var ls=R*.8;
 ui.innerHTML=chromeT([0,1,2,3],-1)
  +'<div class="wh" style="left:'+(cx-wsz/2)+'px;top:'+(cy-wsz/2)+'px;width:'+wsz+'px;height:'+wsz+'px"><svg viewBox="0 0 '+wsz+' '+wsz+'" width="'+wsz+'" height="'+wsz+'">'+wheel(wsz/2,wsz/2,R,{labels:false,big:20})+'</svg>'
  +'<div class="core">'+loopRing(ls*1.4,{doneSet:[0,1,2,3],labels:false})+'</div></div>'
  +'<div class="col t4"><span class="eyebrow acc">The Field</span><h1 class="'+(M?'h1':'display')+'">You closed the first turn.</h1>'
  +'<p class="lead">The wheel is your field. Left is what you are made of. Right is what it reads.</p>'
  +'<div class="row"><button type="button" class="btn pri">Open the Field</button><button type="button" class="btn" data-go="q0">'+ico('check',20)+'Ten questions first</button></div>'
  +'<p class="small dim">The questions take two minutes. Skip any of them.</p></div>';
};

/* ---- questions: one question, one symbol, one continuum ---- */
function lawRing(cx,cy,r,answered,hi){ // 21 laws, a quiet ring of nodes. answered ones are marked; none is graded.
 var out='';for(var i=0;i<21;i++){var a=-90+i*360/21,p=polar(cx,cy,r,a),on=answered.indexOf(i)>-1,h=i===hi;
  out+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+(h?7:4.4)+'" fill="'+(on?'#0C0D12':'none')+'" stroke="'+(h?ACC:(on?INK:'rgba(255,255,255,.3)'))+'" stroke-width="'+(h?2.4:1.6)+'"/>'+(on?'<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="1.8" fill="'+INK+'"/>':'');}
 return out;}
function cont(opts){ // the continuum. a path with a node. no colour changes with value.
 var w=opts.w,pos=opts.pos,out='<svg class="cont" viewBox="0 0 '+w+' 110" aria-label="'+opts.aria+'">';
 out+='<path d="M20 50 H'+(w-20)+'" stroke="rgba(255,255,255,.26)" stroke-width="2.4" stroke-linecap="round"/>';
 var n=opts.ticks||11;
 for(var i=0;i<n;i++){var x=20+(w-40)*i/(n-1),mid=(i===(n-1)/2);
  out+='<path d="M'+f(x)+' '+(mid?36:42)+' V'+(mid?64:58)+'" stroke="rgba(255,255,255,'+(mid?.55:.3)+')" stroke-width="'+(mid?2:1.6)+'"/>';
  if(opts.nums)out+='<text x="'+f(x)+'" y="86" text-anchor="middle" font-size="12" fill="'+(mid?'#EFEDE8':'#94908A')+'" font-family="Inter,sans-serif">'+i+'</text>';}
 var nx=20+(w-40)*pos;
 out+='<path d="M20 50 H'+f(nx)+'" stroke="'+ACC+'" stroke-width="2.6" stroke-linecap="round"/>';
 out+='<circle cx="'+f(nx)+'" cy="50" r="14" fill="#0C0D12" stroke="'+ACC+'" stroke-width="3"/><circle cx="'+f(nx)+'" cy="50" r="5" fill="'+ACC+'"/>';
 if(opts.val!=null)out+='<text x="'+f(nx)+'" y="22" text-anchor="middle" font-size="22" font-weight="600" fill="#EFEDE8" font-family="Inter,sans-serif">'+opts.val+'</text>';
 return out+'</svg>';}
function qlayout(sym,symIcon,symColor,lawName,bodyHTML,answered,hi){
 var R=M?106:Math.min(HT*.26,230),cx=M?W/2:W*.3,cy=M?196:HT*.5;
 setBg({cx:cx,cy:cy,r:R*1.5,arcs:false,ticks:false},'');
 var ring='<div class="qs" style="left:'+(cx-R*1.3)+'px;top:'+(cy-R*1.3)+'px;width:'+R*2.6+'px;height:'+R*2.6+'px"><svg viewBox="0 0 '+R*2.6+' '+R*2.6+'" width="'+R*2.6+'" height="'+R*2.6+'">'+lawRing(R*1.3,R*1.3,R*1.12,answered,hi)+'</svg><div class="sym" style="color:'+symColor+'">'+symIcon+'<span>'+lawName+'</span></div></div>';
 return ring;}

SCR.q0=function(){
 var R=M?106:Math.min(HT*.26,230);
 var ring=qlayout(0,'<span class="sym0">'+ico('thatsit',M?54:80)+'</span>',ACC,'Twenty-one laws',null,[],-1);
 ui.innerHTML=chromeQ(0,10)+ring
  +'<div class="col q"><span class="eyebrow acc">Reflect on a real moment</span><h1 class="'+(M?'h1':'display')+'">What do you actually do?</h1>'
  +'<p class="lead">Not how you want to. Not how you think you should. Where would you put yourself on the scale?</p>'
  +cont({w:M?330:600,pos:.5,aria:'A scale from 0 to 10. 5 is the middle.',nums:true,ticks:11})
  +'<div class="legend"><span>0 almost never</span><span>5 about half the time</span><span>10 consistently</span></div>'
  +'<p class="small">Five is the middle. Four to six is oscillating. Be as honest with yourself as you can.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="q1">Start</button><button type="button" class="btn ghost" data-go="t4">Come back later</button></div></div>';
};
SCR.q1=function(){
 var ring=qlayout(0,ico('truth',M?54:80),SEATS[4].c,'Truth',null,[3,8,13],0);
 ui.innerHTML=chromeQ(3,10)+ring
  +'<div class="col q"><span class="eyebrow acc">Truth</span><h1 class="'+(M?'h1':'display')+' q1">Somebody asks you for the truth, and it will cost you something. You say it anyway.</h1>'
  +cont({w:M?330:600,pos:.7,val:7,aria:'7 on a scale from 0 to 10.',nums:true,ticks:11})
  +'<div class="legend"><span>0 almost never</span><span>5 half the time</span><span>10 consistently</span></div>'
  +'<div class="row"><button type="button" class="btn pri" data-go="q2">Next</button><button type="button" class="btn ghost" data-go="q2">Skip this one</button></div></div>';
};
SCR.q2=function(){
 var ring=qlayout(0,'<span class="sym2">'+ico('side',M?44:64)+ico('separate',M?44:64)+'</span>',SEATS[3].c,'Non-harm',null,[3,8,13,17],17);
 ui.innerHTML=chromeQ(5,10)+ring
  +'<div class="col q"><span class="eyebrow acc">Non-harm</span><h1 class="'+(M?'h1':'display')+' q1">You see two kids fighting. Do you choose a side, or break it up?</h1>'
  +cont({w:M?330:600,pos:.82,aria:'Closer to break it up than to choose a side.',ticks:11})
  +'<div class="poles"><span class="pole">'+ico('side',28)+'Choose a side</span><span class="pole mid">Both</span><span class="pole r">Break it up'+ico('separate',28)+'</span></div>'
  +'<div class="row"><button type="button" class="btn pri" data-go="q3">Next</button><button type="button" class="btn ghost" data-go="q3">Skip this one</button></div></div>';
};
SCR.q3=function(){
 var R=M?106:Math.min(HT*.26,230);
 var ring=qlayout(0,'<span class="sym2 arch"><span class="a1" style="opacity:.62">'+ico('warrior',M?44:64)+'</span><span class="a2" style="opacity:.9">'+ico('sage',M?44:64)+'</span></span>',MID,'How you tend to act',null,[],-1);
 ui.innerHTML=chromeQ(8,10)+ring
  +'<div class="col q"><span class="eyebrow acc">Archetypes</span><h1 class="'+(M?'h1':'display')+' q1">When something needs to change, do you tend to:</h1>'
  +cont({w:M?330:600,pos:.64,aria:'A little closer to understanding it deeply first.',ticks:11})
  +'<div class="poles"><span class="pole">'+ico('act',28)+'Act immediately</span><span class="pole mid">Both</span><span class="pole r">Understand it deeply first'+ico('understand',28)+'</span></div>'
  +'<p class="small">This tracks a tendency. It is not who you are.</p>'
  +'<div class="row"><button type="button" class="btn pri" data-go="t4">Next</button><button type="button" class="btn ghost" data-go="t4">Skip this one</button></div></div>';
};

var ROUTE=SCR;
function show(){clearT();var h=setHash()||'t0';(ROUTE[h]||ROUTE.t0)();document.title='Tutorial, '+h;}
ui.addEventListener('click',function(e){var t=e.target.closest('[data-go]');if(!t)return;location.hash=t.getAttribute('data-go');});
addEventListener('hashchange',show);
show();
})();
