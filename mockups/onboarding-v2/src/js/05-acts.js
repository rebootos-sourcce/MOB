
/* ================================================================ acts
   fm is the Field's mood in that act: amp multiplies the wave, spd the drift, warm shifts the tick colour, dim the
   brightness, br the breath depth (0 to 1), arc the tide arcs. A change of mood is a wave from the centre, not a cut. */
var ACT={};
var SECS={};
['login','flow','rel','b1','b2','b3','sig','end'].forEach(function(k){SECS[k]=$('#s-'+k);});
function showSec(k){Object.keys(SECS).forEach(function(j){SECS[j].classList.toggle('on',j===k);});}
var FM={calm:{amp:1,spd:1,br:.3},settle:{amp:.6,spd:.45,warm:.25,br:1},listen:{amp:.5,spd:.5,dim:.8,br:.3},
 rel:{amp:.35,spd:.4,dim:.55,br:.6},after:{amp:.5,spd:.5,dim:.7,br:.4}};

ACT.login={sec:'login',ctl:'',enter:function(){var lg=$('#lg');lg.classList.remove('gone');}};
ACT.transit={sec:'login',ctl:'',clocked:true,len:1.0,next:'arr1',film:true,pose:'arrive',pdur:.01,enter:function(){
 /* the door's text leaves in 220 ms; its ring (the same 112 ticks) morphs into the Field's, hue draining to ink,
    and the figure begins to assemble inside it. */
 FD.door=1;FD.doorT=1;
 cue(0,function(){$('#lg').classList.add('gone');});
 cue(.15,function(){FD.doorT=0;});}};
ACT.arr1={sec:'flow',ctl:'pause sound skip',clocked:true,film:true,len:3.0,next:'arr2',pose:'arrive',box:'under',fm:FM.calm,
 enter:function(o){var nt=!!(o&&o.snap);cue(.35,function(){DECK.fl.show('<p class="hero">Welcome to a neurosomatic experience.</p>',nt);say('Welcome to a neurosomatic experience.');});}};
ACT.arr2={sec:'flow',ctl:'pause sound skip',clocked:true,film:true,len:4.0,next:'ask',pose:'arrive',box:'under',fm:FM.calm,
 enter:function(o){var nt=!!(o&&o.snap);cue(.3,function(){DECK.fl.show('<p class="hero">Something brought you here.</p><p class="hero rv" style="--pd:620ms">Let’s start there.</p>',nt);say('Something brought you here. Let us start there.');});}};
ACT.ask={sec:'flow',ctl:'leave',pose:'ask',box:'head',fm:FM.calm,enter:function(o){enterAsk(o);}};
ACT.settle={sec:'flow',ctl:'pause sound skip',clocked:true,film:true,len:13.0,next:'feel',pose:'settle',box:'under',fm:FM.settle,trail:true,enter:function(o){enterSettle(o);}};
ACT.feel={sec:'flow',ctl:'',pose:'ask',box:'head',fm:FM.calm,trail:true,enter:function(o){enterFeel(o);}};
ACT.body={sec:'flow',ctl:'',pose:'body',pdur:.52,box:'bodyhead',fm:{amp:.75,spd:.8,br:.3},trail:true,body:1,enter:function(o){enterBody(o);}};
ACT.story={sec:'flow',ctl:'',pose:'side',pdur:.52,box:'side',fm:FM.listen,trail:true,body:.3,enter:function(o){enterStory(o);}};
ACT.mirror={sec:'flow',ctl:'',pose:'side',box:'side',fm:FM.listen,body:.3,enter:function(o){enterMirror(o);}};
ACT.recog={sec:'flow',ctl:'',pose:'side',box:'side',fm:null,body:.3,enter:function(o){enterRecog(o);}};

function go(id,o){
 o=o||{};var A=ACT[id];if(!A)return;
 var prev=ACT[S.act];
 if(prev&&prev.deck&&prev.deck!==A.deck)DECK[prev.deck].hide();
 if(A.deck&&(!prev||prev.deck!==A.deck))DECK[A.deck].clear();
 S.act=id;S.t=o.t||0;S.cues=[];S.outDone=false;S.card=null;S.rate=o.snap?1:S.rate;S.dw=null;
 if(id!=='ask'&&id!=='feel'&&id!=='body'){S.live=false;}
 trace('go',id);
 stage.dataset.act=id;stage.dataset.ctl=A.ctl||'';
 stage.classList.toggle('film',!!A.film);
 stage.classList.toggle('stats-on',id==='rel');
 $('#soundl').textContent=id==='rel'?'Hear it':'';
 showSec(A.sec);
 $('#trail').classList.toggle('on',!!A.trail);
 if(A.pose)setPose(lay(A.pose),A.pdur||.42,o.snap||id==='transit');
 if(A.box)placeBox(A.box,A.pose,o.snap||!prev||prev.sec!=='flow');
 if(A.body!=null){S.bodyAT=A.body;if(A.body>=1&&!S.bodyOn){S.bodyOn=true;S.bodyW=0;}}
 else if(id==='transit'||id==='login'||/^arr/.test(id)||id==='ask'||id==='settle'||id==='feel'){S.bodyAT=0;}
 if(A.fm!==undefined){
  S.mood=A.fm;var m=A.fm||{};FD.breathAT=m.br!=null?m.br:.3;FD.arcAT=m.arc!=null?m.arc:1;
  if(JSON.stringify(fieldTarget())!==FD.sig)FD.aim(centre(),{delay:.12,snap:!!o.snap});}
 if(A.lean&&!o.nolean)FD.leanTo(A.lean(),!!o.snap);
 if(A.enter)A.enter(o);
 runCues();
 if(!o.nopush)pushH(id);
 var js=$('#c-jump');if(js&&$('option[value="'+id+'"]',js))js.value=id;
 ctlState();}

/* ---- the release (shortened). Its address ring is the Field's own ticks: the line being said is lit in its seat colour,
   the ones already said stay lit at ink 85, and the Field remembers them in Reel B. */
ACT.rel={sec:'rel',ctl:'pause sound skip',clocked:true,film:true,len:REL.end,next:'b1',deck:'rel',pose:'rel',pdur:.52,fm:FM.rel,body:0,enter:function(o){enterRel(o);}};
function relNodes(){
 var seat=BAND[S.seat==null?0:S.seat];
 return NODES.filter(function(n){return n[2]===seat&&!/Unnamed/.test(n[1]);}).slice(0,REL.n);}
function relLine(i,list){
 var n=list[i%list.length];var k=n[1].toLowerCase().replace(/\s*\((solar|heart)\)/,'');
 return ENTRY[i%3]+k+'.';}
function enterRel(o){
 S.sealed=0;var list=relNodes();S.relList=list;FD.resetLit();
 var seals=$('#seals');seals.innerHTML='';for(var i=0;i<REL.n;i++)seals.appendChild(document.createElement('i'));seals.classList.remove('on');
 $('#cnt').textContent=GIFT_START;$('#cnt').classList.remove('land');$('#cnt').classList.add('pre');
 $('#mocklab').textContent='Mockup, shortened. Real: his voice for about '+Math.round(REAL.open)+' s, '+REL.n+' lines at 4 s, a '+REAL.relsettle+' s settle. Here: '+REL.lineLen+' s lines, a '+REL.settleLen+' s settle.';
 var d=DECK.rel,nt=!!(o&&o.snap);
 cue(REL.gift,function(){var c=$('#cnt');c.classList.add('land');d.show('<p class="lead20">'+GIFT_START+' patterns are open to you.</p>',nt);});
 REL_WELCOME.forEach(function(l,i){cue(REL.caps[i],function(){d.show('<p class="hero">'+l+'</p>',nt);say(l);});});
 cue(REL.stem,function(){d.show('<p class="hero">I am releasing believing, thinking, feeling, behaving and acting that I am ...</p><p class="own" id="own"></p>',nt);
  var own=$('#own');own.textContent=S.words?'“'+quoteOf(S.words)+'”':'';});
 cue(REL.own,function(){var o2=$('#own');o2&&o2.classList.add('in');});
 cue(REL.hint,function(){d.show('<p class="lead20">Each line names one pattern. Repeat it in thought as it lands.</p>',nt);});
 for(var j=0;j<REL.n;j++)(function(j){cue(REL.lines0+j*REL.lineLen,function(){var l=relLine(j,list);d.show('<p class="hero">'+l+'</p>',nt);say(l);});})(j);
 cue(REL.settle0,function(){d.show('<p class="hero s">'+REL_SETTLE_LINE+'</p>',nt);say(REL_SETTLE_LINE);});
 cue(REL.settle0+REL.settleLen-.22,function(){d.hide();});}

/* ---- reel B */
ACT.b1={sec:'b1',ctl:'',pose:'reel',deck:'b1',fm:FM.after,body:.3,lean:function(){return S.seat==null?-1:S.seat;},enter:function(o){enterB1(o);}};
ACT.b2={sec:'b2',ctl:'pause sound skip',clocked:true,film:true,len:5.0,next:'b3',pose:'reel',deck:'b2',lean:function(){return S.seat==null?-1:S.seat;},fm:{amp:.5,spd:.5,dim:.7,br:.4,arc:0},body:.3,enter:function(o){enterB2(o);}};
ACT.b3={sec:'b3',ctl:'',pose:'top',deck:null,lean:function(){return S.seat==null?-1:S.seat;},fm:FM.after,body:.3,enter:function(o){enterB3(o);}};
ACT.sig={sec:'sig',ctl:'pause sound skip',clocked:true,film:true,len:SIG_LEN,holdEnd:true,pose:'reel',deck:'sig',lean:function(){return 4;},fm:FM.after,body:.3,enter:function(o){enterSig(o);},
 onEnd:function(){S.sigQ=true;stage.dataset.ctl='';$('#sig-q').classList.add('in');$('#sig-reply').textContent='';$('#sig-back').hidden=true;
  $('#sig-qt').hidden=false;$$('#sig-q .signalq').forEach(function(e){e.hidden=false;});DECK.sig.hide();say('Did the two feel different?');}};
ACT.end={sec:'end',ctl:'',fm:FM.calm,enter:function(){
 var m={login:['Log in goes to the Field.','A returning person skips the film and lands where they left off.'],
  leave:['The Field opens here.','Leave writes that onboarding is done and opens the Field unread. Nothing was read.'],
  notnow:['The Field opens here.','The reading stays on this device.'],
  account:['The Field opens here.','Your story moves to your account.'],
  guest:['The Field opens here.','This stays on this device.'],
  stop:['The Field opens here.','Unread. No release was run.']}[S.end]||['The Field opens here.',''];
 $('#end-h').textContent=m[0];$('#end-sub').textContent=m[1];
 $('#end-cap').textContent='Mockup end. In the build the figure arcs into the Field hub here.';}};
function enterB1(o){
 var d=DECK.b1,nt=!!(o&&o.snap),sn=SEAT[S.seat||0];
 cue(1.2,function(){d.show('<p class="hero">'+sn+' is lower.</p><p class="cap">The outline is where it was. The colour is where it is.</p>'
  +'<div class="after" id="b1-go" style="margin-top:24px"><button type="button" class="ring" id="b1-btn">Go on</button></div>',nt);say(sn+' is lower.');});
 cue(3.0,function(){var g=$('#b1-go');g&&g.classList.add('in');});}
function enterB2(o){
 var d=DECK.b2,nt=!!(o&&o.snap);
 cue(.2,function(){S.card=d.show('<p class="hero">This is your avatar.</p><p class="cap">A lit station is something you did. The rest wait.</p>',nt);say('This is your avatar.');});
 cue(5.0-.22,function(){d.hide();});}
function enterB3(o){
 var guest=S.mode==='guest';
 $('#b3-h').textContent=guest?'This stays on this device.':'Keep this reading?';
 $('#b3-sub').textContent=guest?'Guest keeps everything on this device. Clearing the browser clears it.':'Your story moves to your account. Your name and birth data stay on this device.';
 $('#b3-pair').hidden=guest;$('#b3-guestgo').hidden=!guest;
 $('#b3-fine').classList.remove('on');$('#b3-keep').classList.remove('live');
 $('#b3-tick').checked=false;$('#b3-make').disabled=true;
 say($('#b3-h').textContent);$('#b3-h').focus({preventScroll:true});}
function enterSig(o){
 S.sigQ=false;$('#sig-q').classList.remove('in');$('#sig-qt').hidden=false;$$('#sig-q .signalq').forEach(function(e){e.hidden=false;});$('#sig-reply').textContent='';$('#sig-back').hidden=true;
 var d=DECK.sig,t=0,nt=!!(o&&o.snap);
 SIG.forEach(function(s){cue(t,function(){d.show('<p class="hero s">'+s[0]+'</p>',nt);say(s[0]);});t+=s[1];});}

/* ================================================================ drawing */
/* the figure: a spine, seven seats (ring marks at rest), a halo, and a body outline drawn on the seat spacing.
   Units are the figure's own, 178 high, so the outline, the seats and the tap targets are one geometry. */
var BODYP=(function(){
 function bz(p0,p1,p2,p3,n,out){for(var i=1;i<=n;i++){var t=i/n,u=1-t;out.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]);}}
 var pts=[[94,74]],o=pts;
 bz([94,74],[86,80],[72,83],[66,92],10,o);bz([66,92],[61,100],[62,112],[64,124],10,o);bz([64,124],[66,138],[68,150],[76,158],10,o);
 bz([76,158],[84,166],[116,166],[124,158],14,o);bz([124,158],[132,150],[134,138],[136,124],10,o);
 bz([136,124],[138,112],[139,100],[134,92],10,o);bz([134,92],[128,83],[114,80],[106,74],10,o);
 var cum=[0],i;for(i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
 return {pts:pts,cum:cum,len:cum[cum.length-1]};})();
function figTime(){
 if(S.figDone)return 9;
 if(S.act==='transit')return S.t-.4;
 if(S.act==='arr1')return .6+S.t;
 return 9;}
function drawFig(c,p,o){
 var s=p.h/178,X=function(x){return p.cx+(x-100)*s;},Y=function(y){return p.cy+(y-89)*s;};
 var i,r=Math.min(4.6*s,6),ft=figTime(),asm=ft<9;
 var sp=asm?tw(ft,0,.7,EDRAW):1,halo=asm?tw(ft,.9,.9,EDRAW):1;
 c.save();c.globalAlpha=o.alpha==null?1:o.alpha;
 /* the body outline: ink at 28 percent, drawn on over 900 ms (straight ahead: it is drawn, not faded) */
 if(S.bodyA>.01){
  var D=EDRAW(clamp(S.bodyD,0,1)),a=S.bodyA;
  c.strokeStyle=rgba(INK,.3*a);c.lineWidth=1.5;c.lineCap='round';c.lineJoin='round';
  var hd=clamp(D/.3,0,1);if(hd>0){c.beginPath();c.ellipse(X(100),Y(56),12.5*s,17*s,0,-Math.PI/2,-Math.PI/2+TAU*hd);c.stroke();}
  var td=clamp((D-.2)/.8,0,1),lim=BODYP.len*td;
  if(td>0){c.beginPath();c.moveTo(X(BODYP.pts[0][0]),Y(BODYP.pts[0][1]));
   for(i=1;i<BODYP.pts.length;i++){if(BODYP.cum[i]>lim){var f=(lim-BODYP.cum[i-1])/(BODYP.cum[i]-BODYP.cum[i-1]);
     c.lineTo(X(BODYP.pts[i-1][0]+(BODYP.pts[i][0]-BODYP.pts[i-1][0])*f),Y(BODYP.pts[i-1][1]+(BODYP.pts[i][1]-BODYP.pts[i-1][1])*f));break;}
    c.lineTo(X(BODYP.pts[i][0]),Y(BODYP.pts[i][1]));}
   c.stroke();}}
 if(sp>0){c.strokeStyle=rgba(INK,.4);c.lineWidth=1.5;c.beginPath();c.moveTo(X(100),Y(160));c.lineTo(X(100),Y(160-120*sp));c.stroke();}
 if(halo>0){c.strokeStyle=rgba(INK,.85);c.lineWidth=1.5;c.beginPath();c.ellipse(X(100),Y(21),13*s,4.4*s,0,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,halo));c.stroke();}
 for(i=0;i<7;i++){
  var L=asm?tw(ft,.2+.09*i,.32,ELAND):1;if(L<=0)continue;
  var hu=o.hue?o.hue[i]:0;
  c.fillStyle=mix(INK40,PALRGB[i],hu);c.beginPath();c.arc(X(100),Y(160-20*i),Math.max(.1,r*L*(o.land?o.land[i]:1)),0,TAU);c.fill();}
 c.restore();}
function arcRing(c,cx,cy,r,prog,col,lw,a){
 if(prog<=0||a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=lw;c.beginPath();
 c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,prog));c.stroke();c.restore();}
function dot(c,x,y,r,col,a){c.save();c.globalAlpha=a==null?1:a;c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();}
function ringMark(c,x,y,r,col,lw,a){c.save();c.globalAlpha=a==null?1:a;c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.restore();}

/* THE DOOR'S RINGS. Drawn on the stage canvas, so the motion costs no extra layer. The tick ring (112 ticks, one per
   address, seven seat hues) breathes: 1.2 percent scale on 61 s and an alpha on 47 s. The three arc rings drift: each scales
   1.5 percent and turns a few degrees back and forth on periods of 53 to 89 s, staggered so no two ever agree. Reduced
   motion draws the rest pose. Unchanged by round PP: the Field takes over from these same ticks in the transit. */
function FONT(){return getComputedStyle(document.documentElement).getPropertyValue('--font-ui').trim()||'system-ui,sans-serif';}
function loginGeo(){
 var nar=W<=700,tl=nar?8:11,cx=W/2,cy=H/2,R;
 if(nar){var dial=H>=780?208:H>=700?160:0;R=dial?dial/2-tl:72;
  var mk=$('#lg-mark').getBoundingClientRect(),sr=stage.getBoundingClientRect(),k=sr.height?H/sr.height:1;
  if(mk.height)cy=((mk.top+mk.bottom)/2-sr.top)*k;
  return {cx:cx,cy:cy,r:R,tl:tl,ticks:dial>0};}
 return {cx:cx,cy:cy,r:Math.min(W,H)*.335,tl:tl,ticks:true};}
var ARCP2=ARCP;
function loginRing(c,k,a){
 var g=loginGeo(),cx=g.cx,cy=g.cy,r=g.r,tl=g.tl,i,t=S.ringT;
 var br=STILL?.75:.72+.16*Math.sin(TAU*t/47),kt=STILL?1:1+.012*Math.sin(TAU*t/61);
 c.save();c.translate(cx,cy);c.scale(k*kt,k*kt);c.translate(-cx,-cy);c.globalAlpha=a*br;
 c.lineCap='round';c.lineWidth=2;
 if(g.ticks)for(i=0;i<112;i++){var s=Math.floor(i/16),ang=Math.PI/2+i*TAU/112+Math.PI/112;
  c.strokeStyle=PAL[s];c.beginPath();c.moveTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);c.lineTo(cx+Math.cos(ang)*(r+tl),cy+Math.sin(ang)*(r+tl));c.stroke();}
 c.restore();
 [1.2,1.44,1.72].forEach(function(m,ri){
  var P=ARCP2[ri],sc=STILL?1:1+.015*Math.sin(TAU*t/P[0]+P[2]),rot=STILL?0:P[3]*(4+ri*1.5)*Math.PI/180*Math.sin(TAU*t/P[1]+P[2]);
  c.save();c.translate(cx,cy);c.rotate(rot);c.scale(k*sc,k*sc);c.translate(-cx,-cy);
  c.lineCap='round';c.lineWidth=1.4;c.globalAlpha=a*(.38-ri*.09)*(STILL?1:.9+.1*br);
  for(var s=0;s<7;s++){var a0=Math.PI/2+s*TAU/7+.038+ri*.05,a1=Math.PI/2+(s+1)*TAU/7-.038+ri*.05;
   c.strokeStyle=PAL[s];c.beginPath();c.arc(cx,cy,r*m,a0,a1);c.stroke();}
  c.restore();});}

/* the loop: one circle, four stations. Lit only for an act done. */
function loopDraw(c,p,o){
 var R=o.R,cx=p.cx,cy=p.cy,i;
 arcRing(c,cx,cy,R,o.prog,rgba(INK,.4),1.5,1);
 var ang=[-Math.PI/2,0,Math.PI/2,Math.PI];
 c.save();c.font='400 13px '+FONT();c.textBaseline='middle';
 for(i=0;i<4;i++){
  var L=o.st[i];if(L<=0)continue;
  var x=cx+R*Math.cos(ang[i]),y=cy+R*Math.sin(ang[i]),lit=o.lit&&o.lit[i];
  if(lit){dot(c,x,y,6*Math.max(.1,L),rgba(INK,.85));}
  else{dot(c,x,y,6*Math.max(.1,L),BGC);ringMark(c,x,y,6*Math.max(.1,L),rgba(INK,.4),1.5);}
  c.globalAlpha=clamp(L*2,0,1);c.fillStyle=lit?rgba(INK,.85):'#94908A';
  var tx=x,ty=y;
  if(i===0){c.textAlign='center';ty=y+22;}else if(i===2){c.textAlign='center';ty=y-22;}else if(i===1){c.textAlign='right';tx=x-16;}else{c.textAlign='left';tx=x+16;}
  c.fillText(LOOP[i],tx,ty);c.globalAlpha=1;}
 c.restore();
 if(o.dot!=null&&o.dot>0){var a=-Math.PI/2+o.dot*TAU;dot(c,cx+R*Math.cos(a),cy+R*Math.sin(a),4,rgba(INK,.85));}}

function figAlpha(){
 if(STILL||FD.breathA<.05)return 1;
 return 1-FD.breathA*.36*(1-breathShape());}
/* the flow scenes: the figure, the seat marks (a ring that Lands with 35 percent overshoot), the hover ring, the bead */
function sceneFlow(c,p){
 var hue=[0,0,0,0,0,0,0],land=[1,1,1,1,1,1,1],mk=S.mark;
 if(mk){var u=tw(mk.t,0,.42,EOUT);hue[mk.seat]=mk.t<0?0:u;
  var pu=mk.t>0&&mk.t<.32&&!STILL?Math.sin(Math.PI*mk.t/.32):0;land[mk.seat]=1+.35*pu;}
 if(S.lexMark){hue[S.lexMark.seat]=tw(S.lexMark.t,0,.42,EOUT);}
 drawFig(c,p,{hue:hue,land:land,alpha:figAlpha()});
 var s=p.h/178,rr=.062*p.h;
 if(S.hover>=0&&S.act==='body'&&!(S.mark&&S.mark.seat===S.hover)){var h=seatXY(p,S.hover);ringMark(c,h.x,h.y,rr*.8,rgba(INK,.6),1.5,1);}
 if(mk&&mk.t>=-.0){var q=seatXY(p,mk.seat),a=tw(mk.t,0,.32,ELAND);ringMark(c,q.x,q.y,rr*Math.max(a,0)*(1+.2*(mk.t>0&&mk.t<.32&&!STILL?Math.sin(Math.PI*mk.t/.32):0)),PAL[mk.seat],1.5,clamp(a,0,1));}
 if(S.lexMark&&S.lexMark.t>=0){var q2=seatXY(p,S.lexMark.seat),a2=tw(S.lexMark.t,0,.32,ELAND);ringMark(c,q2.x,q2.y,rr*Math.max(a2,0),PAL[S.lexMark.seat],1.5,clamp(a2,0,1));}}
function sceneBead(c){
 var b=S.bead;if(!b||b.done||b.t<0)return;
 var g=centre(),u=EIN(clamp(b.t/b.dur,0,1)),dx=g.x-b.x0,dy=g.y-b.y0,d=Math.sqrt(dx*dx+dy*dy)||1,bend=.12*d*Math.sin(Math.PI*u);
 dot(c,lerp(b.x0,g.x,u)+(-dy/d)*bend,lerp(b.y0,g.y,u)+(dx/d)*bend,4,rgba(INK,.85));}

function sceneRel(c,t){
 var nar=W<=700,cs=$('#cslot');
 var sealed=clamp(Math.floor((t-REL.lines0)/REL.lineLen),0,REL.n);if(t<REL.lines0)sealed=0;
 var list=S.relList||[],cur=(t>=REL.lines0&&t<REL.settle0)?list[clamp(Math.floor((t-REL.lines0)/REL.lineLen),0,list.length-1)]:null;
 FD.resetLit();for(var q=0;q<sealed&&q<list.length;q++)FD.lit[list[q][0]-1]=1;
 if(cur){FD.litCur=cur[0]-1;S.litSeat=BAND.indexOf(cur[2]);}
 var sr=stage.getBoundingClientRect(),k=sr.width/(stage.clientWidth||1)||1;
 var r2=cs.getBoundingClientRect(),gx=(r2.left+r2.width/2-sr.left)/k,gy=(r2.top+r2.height/2-sr.top)/k,gr=r2.width/k/2-5;
 var show=tw(t,REL.gift,.42,EOUT);
 if(show>0){c.save();c.lineWidth=1;c.lineCap='butt';c.globalAlpha=show;
  for(var j=0;j<GIFT_START;j++){var ang=-Math.PI/2+j*TAU/GIFT_START,spent=j>=GIFT_START-sealed;
   c.strokeStyle=spent?rgba(INK,.4):rgba(INK,.85);c.beginPath();c.moveTo(gx+Math.cos(ang)*gr,gy+Math.sin(ang)*gr);c.lineTo(gx+Math.cos(ang)*(gr+5),gy+Math.sin(ang)*(gr+5));c.stroke();}
  c.restore();}
 if(t>=REL.settle0){
  var qq=(t-REL.settle0)/REL.settleLen;if(STILL)qq=Math.floor(qq*REL.settleLen)/REL.settleLen;
  var dr=nar?54:68,dcx=W/2,dcy=H*(nar?.7:.74);
  arcRing(c,dcx,dcy,dr,1,rgba(INK,.4),1.5,1);arcRing(c,dcx,dcy,dr,clamp(qq,0,1),rgba(INK,.85),2,1);
  var an=-Math.PI/2+clamp(qq,0,1)*TAU;dot(c,dcx+dr*Math.cos(an),dcy+dr*Math.sin(an),4,rgba(INK,.85));}
 syncRel(sealed,t);}
function syncRel(n,t){
 if(S.sealed!==n){S.sealed=n;
  $$('#seals i').forEach(function(e,i){e.classList.toggle('on',i<n);});
  var c=$('#cnt');c.textContent=GIFT_START-n;
  if(n>0){c.classList.remove('land');c.classList.add('pre');void c.offsetWidth;c.classList.add('land');}}
 $('#seals').classList.toggle('on',t>=REL.lines0&&t<REL.settle0);}
function seatHue(){var h=[0,0,0,0,0,0,0];h[S.seat||0]=1;return h;}
function sceneB1(c,t,p){
 drawFig(c,p,{hue:seatHue(),alpha:figAlpha()});
 var sp=seatXY(p,S.seat||0),r0=.062*p.h,r1=.034*p.h,u=tw(t,.8,.9,EOUT);
 ringMark(c,sp.x,sp.y,r0,rgba(INK,.4),1.5,1);
 ringMark(c,sp.x,sp.y,lerp(r0,r1,u),PAL[S.seat||0],1.5,1);}
function sceneB2(c,t,p){
 drawFig(c,p,{hue:seatHue(),alpha:figAlpha()});
 /* stations in loop order: Discover, Play, Flow, Embody. Play is games and nothing here played one, so it stays unlit. */
 var lit=[1,0,1,1],earn=[1.2,0,1.6,2.0],st=earn.map(function(e,i){return i===1?tw(t,.9,.32,ELAND):tw(t,e,.32,ELAND);});
 loopDraw(c,p,{R:p.rx+tickLen(p)+20,prog:tw(t,.3,.9,EDRAW),st:st,lit:lit});}
function sceneB3(c,t,p){drawFig(c,p,{hue:seatHue(),alpha:figAlpha()});}
function sceneSig(c,t,p){
 var hue=[0,0,0,0,0,0,0];hue[4]=1;drawFig(c,p,{hue:hue,alpha:figAlpha()});
 var sp=seatXY(p,4);ringMark(c,sp.x,sp.y,.062*p.h*tw(t,.3,.32,ELAND),PAL[4],1.5,1);}

function draw(){
 if(!W)return;
 var c=ctx,t=S.t,p=POSE.cur,a=S.act;
 c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,W,H);
 if(a==='login'){loginRing(c,1,1);return;}
 if(a==='transit'){
  var d=loginGeo(),u=tw(t,.15,.75,EOUT),e={cx:p.cx,cy:p.cy,rx:p.rx,ry:p.ry},g={cx:lerp(d.cx,e.cx,u),cy:lerp(d.cy,e.cy,u),rx:lerp(d.r,e.rx,u),ry:lerp(d.r,e.ry,u)};
  FD.draw(c,g,{tl:lerp(d.tl,tickLen(e),u),a:d.ticks?1:u,motes:false});
  sceneFlow(c,p);return;}
 var g2={cx:p.cx,cy:p.cy,rx:p.rx,ry:p.ry};
 if(a==='rel'){FD.draw(c,g2,{motes:false,litSeat:S.litSeat,a:1});sceneRel(c,t);return;}
 if(a==='end'){return;}
 FD.draw(c,g2,{});
 if(a==='b1')sceneB1(c,t,p);
 else if(a==='b2')sceneB2(c,t,p);
 else if(a==='b3')sceneB3(c,t,p);
 else if(a==='sig')sceneSig(c,t,p);
 else{sceneFlow(c,p);sceneBead(c);}}
