/* ============================================================
   RELEASE. Four channels: right-limit, left-limit, right-truth,
   left-truth. A queue, so one or many run in the same session.
   coolDown takes 21 percent of weight plus 2, clears at 6 or below,
   and installs the coherent opposite at 62 percent of what it removed.
   ============================================================ */
var CHAN=[['R','Right','limit'],['L','Left','limit'],['R','Right','truth'],['L','Left','truth']];
var OPENING=['Welcome to release and reframe.','We will be here for a few minutes.',
 'Find a quiet space. Sit back and relax,','and turn your senses inward to feel what is released.',
 'As the words repeat, follow along in thought.','Feel what the body is doing as the energy goes.',
 'Let us begin.'];
var RUN={open:false,queue:[],sec:0,idx:0,phase:'idle',speed:2.2,timer:null,
         paused:false,done:false,line:0,log:[],freed:0};
function relPick(nodeIds){
 RUN.queue=nodeIds.map(function(i){return BY[i];}).filter(function(n){return n&&n.cf;});
 RUN.sec=0;RUN.idx=0;RUN.line=0;RUN.phase='idle';RUN.done=false;RUN.log=[];RUN.freed=0;
 RUN.open=true; relRender();}
function relTick(){
 clearInterval(RUN.timer);
 RUN.timer=setInterval(function(){
  if(RUN.paused)return;
  if(RUN.phase==='opening'){
   RUN.line++;
   if(RUN.line>=OPENING.length){RUN.phase='run';RUN.line=0;}
   relRender(); return;}
  RUN.idx++;
  if(RUN.idx>=RUN.queue.length){
   RUN.idx=0; RUN.sec++;
   if(RUN.sec>=CHAN.length){ clearInterval(RUN.timer); relCoolDown(); return; }}
  relRender();}, RUN.speed*1000);}
function relCoolDown(){
 if(RUN.done)return; RUN.done=true; RUN.phase='done';
 var freed=0;
 RUN.queue.forEach(function(n){
  var w0=n.sq*10;                                   /* weights are 0 to 100 here */
  var d=-Math.round(w0*0.21+2);
  var w1=Math.max(0,w0+d);
  freed+=Math.abs(d);
  var share=Math.abs(d)/10/Math.max(1,RUN.queue.filter(function(q){return q.cf===n.cf;}).length);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  /* release empties the address, replace fills it. the second half is not optional. */
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
  RUN.log.push({node:n.i,name:n.k,band:n.b,fetter:n.cf,
   opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'',
   w0:Math.round(w0),d:d,w1:w1,cleared:(w1<=6)});});
 RUN.freed=freed;
 if(CURP){CURP.history=CURP.history||[];CURP.history.push(snapshot(CURP));pSave();}
 toYou();syncCh();relRender();render();}
function relClose(){clearInterval(RUN.timer);RUN.open=false;RUN.phase='idle';relRender();render();}
function relRender(){
 var h=document.getElementById('rel'); if(!h)return;
 if(!RUN.open){h.style.display='none';h.innerHTML='';return;}
 h.style.display='flex';
 var out='<div class="rel-card">';
 if(RUN.phase==='opening'){
  out+='<div class="pm-eye">Release and reframe</div>'
   +'<div class="rel-speak">'+esc(OPENING[Math.min(RUN.line,OPENING.length-1)])+'</div>'
   +'<div class="rel-dots">'+OPENING.map(function(_,i){
     return '<i class="'+(i<=RUN.line?'on':'')+'"></i>';}).join('')+'</div>'
   +'<div class="rel-act"><button class="btn" id="relskip">Skip the opening</button></div>';
 } else if(RUN.phase==='run'){
  var ch=CHAN[RUN.sec], n=RUN.queue[RUN.idx], c=seatCol(n.b);
  out+='<div class="pm-eye">'+ch[1]+' '+ch[2]+', pass '+(RUN.sec+1)+' of '+CHAN.length+'</div>'
   +'<div class="rel-node" style="color:'+c+'">'+esc(n.k)+'</div>'
   +'<div class="rel-sub">'+n.b+' · '+(n.n||'')+'</div>'
   +'<div class="rel-side rel-'+ch[0]+'"><span>'+ch[1]+'</span></div>'
   +'<div class="rel-prog"><i style="width:'+
     (((RUN.sec*RUN.queue.length+RUN.idx+1)/(CHAN.length*RUN.queue.length))*100).toFixed(0)
     +'%;background:'+c+'"></i></div>'
   +'<div class="rel-ct">'+(RUN.idx+1)+' of '+RUN.queue.length+' in the queue</div>'
   +'<div class="rel-act"><button class="btn" id="relpause">'+(RUN.paused?'Resume':'Pause')+'</button>'
   +'<button class="btn" id="relstop">Stop</button></div>';
 } else if(RUN.phase==='done'){
  var cl=RUN.log.filter(function(x){return x.cleared;}).length;
  out+='<div class="pm-eye">Released</div>'
   +'<div class="rel-node">'+RUN.log.length+' addresses</div>'
   +'<div class="rel-sub">'+cl+' cleared entirely, '+RUN.freed+' weight freed</div>'
   +'<div class="rel-log">';
  RUN.log.forEach(function(x){
   out+='<div class="rel-row'+(x.cleared?' cleared':'')+'">'
    +'<i style="background:'+seatCol(x.band)+'"></i>'
    +'<span>'+esc(x.name)+'</span><em>toward '+esc(x.opp||'no pole')+'</em>'
    +'<b>'+x.w0+' '+x.d+'</b></div>';});
  out+='</div><div class="rel-note">Release empties the address. The coherent opposite is '
   +'installing on the same pass. The rebound is day four and a half. Completion is day '
   +'twenty seven.</div>'
   +'<div class="rel-act"><button class="btn" id="relclose">Done</button>'
   +'<button class="btn pri" id="relrit">Build a ritual</button></div>';
 } else {
  var q=RUN.queue;
  out+='<div class="pm-eye">Run a release</div>'
   +'<div class="rel-node">'+q.length+(q.length===1?' address':' addresses')+'</div>'
   +'<div class="rel-log">';
  q.forEach(function(n){
   out+='<div class="rel-row"><i style="background:'+seatCol(n.b)+'"></i>'
    +'<span>'+esc(n.k)+'</span><em>'+n.b+'</em><b>'+n.sq.toFixed(1)+'</b></div>';});
  out+='</div><div class="rel-note">Four passes: right then left, limit before truth. About '
   +(Math.round(CHAN.length*q.length*RUN.speed/60*10)/10)+' minutes.</div>'
   +'<div class="rel-act"><button class="btn" id="relcancel">Cancel</button>'
   +'<button class="btn pri" id="relgo">Begin</button></div>';}
 out+='</div>';
 h.innerHTML=out;
 var b;
 if((b=document.getElementById('relgo')))b.onclick=function(){RUN.phase='opening';RUN.line=0;relTick();relRender();};
 if((b=document.getElementById('relskip')))b.onclick=function(){RUN.phase='run';RUN.line=0;relRender();};
 if((b=document.getElementById('relcancel')))b.onclick=relClose;
 if((b=document.getElementById('relclose')))b.onclick=relClose;
 if((b=document.getElementById('relrit')))b.onclick=function(){var lg=RUN.log.slice();relClose();ritOpen(lg);};
 if((b=document.getElementById('relstop')))b.onclick=function(){clearInterval(RUN.timer);relCoolDown();};
 if((b=document.getElementById('relpause')))b.onclick=function(){RUN.paused=!RUN.paused;relRender();};}

