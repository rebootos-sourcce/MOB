/* login.js. Login A, the ring. The owner's pick, round PA. Hash picks a frame:
   #signin #filled #create #create-ready #underage #error #confirm #dev
   #forgot #forgot-sent
   One form. One row of three buttons: Log in, Create account, Guest. */
(function(){
var H=setHash()||'signin';
var W=innerWidth,Ht=innerHeight,M=W<=700;
var S={mode:'login',u:'',p:0,email:'',age:false,agree:false,err:false,under:false,dev:false,ok:false,show:false,pop:false};
if(H==='filled'||H==='error'||H==='confirm'||H==='dev'){S.u='mika.salas';S.p=14;}
/* a held moment for the frame strip: s-u4-p0 is four characters and no passphrase */
var MM=/^s-u(\d+)-p(\d+)(-ok)?$/.exec(H);
if(MM){S.u='mika.salas'.slice(0,+MM[1]);S.p=+MM[2];S.ok=!!MM[3];}
if(H==='create'||H==='create-ready'||H==='underage'){S.mode='create';S.u='mika.salas';S.p=16;}
if(H==='create-ready'){S.email='mika@example.com';S.age=true;S.agree=true;}
if(H==='underage'){S.agree=true;S.under=true;}
if(H==='error')S.err=true;
if(H==='confirm')S.ok=true;
if(H==='dev')S.dev=true;
if(H==='forgot'||H==='forgot-sent'){S.mode=(H==='forgot'?'forgot':'sent');S.email=H==='forgot-sent'?'mika@example.com':'';S.u='';S.p=0;}

var HEAD={login:'There is more running you than you can see.',create:'Keep what you find.',forgot:'Get back in.',sent:'Check your inbox.'};
var SUB={forgot:'Enter the recovery email on the account.',sent:''};

function field(id,label,dot,val,extra,type,ac,opt){
 return '<label class="fld '+(extra||'')+'" id="f_'+id+'"><span class="fl"><i class="dot" style="--c:'+dot+'"></i>'+label+(opt?' <span class="opt">'+opt+'</span>':'')+'</span>'
  +'<input id="'+id+'" type="'+(type||'text')+'" autocomplete="'+ac+'" autocapitalize="none" spellcheck="false" value="'+val+'">';}
function ckbox(id,html,on,cls){
 return '<label class="ck '+(cls||'')+'"><input type="checkbox" id="'+id+'"'+(on?' checked':'')+'><span class="bx">'+ico('tick',18)+'</span><span>'+html+'</span></label>';}
var TERMS='<a class="il" href="#terms">Terms</a>',PRIV='<a class="il" href="#privacy">Privacy policy</a>';

function formHTML(){
 var m=S.mode,h='';
 if(m==='forgot'||m==='sent'){
  if(m==='forgot'){
   h+='<div class="lg-fields">'+field('em','Recovery email','var(--heart)',S.email,'','email','email')+'</label></div>';
   h+='<p class="msg" id="msg" role="status"></p>';
   h+='<div class="lg-acts"><button type="button" class="btn pri" id="send">Send a link</button><button type="button" class="btn" data-m="login">Back to log in</button></div>';
   h+='<p class="cap">No recovery email on the account? A lost passphrase cannot be recovered.</p>';
  }else{
   h+='<p class="msg" id="msg" role="status">'+ico('mail',20,'','style="color:var(--accent)"')+'If that email is on an account, a link is on its way.</p>';
   h+='<div class="lg-acts"><button type="button" class="btn pri" data-m="login">Back to log in</button></div>';
   h+='<p class="cap">The link works once. Nothing here says whether the email was found.</p>';}
  return h;}
 h+='<div class="lg-fields">'
  +field('u','Username','var(--throat)',S.u,'u'+(m==='create'&&S.u.length>2?' has-av':''),'text','username')+'<span class="av">'+ico('check',20)+'Free</span></label>'
  +field('p','Passphrase','var(--root)',Array(S.p+1).join('x'),'p','password',m==='create'?'new-password':'current-password')
  +'<button type="button" class="show" aria-label="Show passphrase">Show</button></label>';
 if(m==='create'){
  h+='<span class="hint" id="hint" style="margin-top:-8px">Four words or more. Easy to say, hard to guess.</span>';
  h+=field('em','Recovery email','var(--heart)',S.email,'','email','email','optional')+'</label>'
   +'<span class="hint" style="margin-top:-8px">Without one, a lost passphrase cannot be recovered.</span>';}
 h+='</div>';
 if(m==='login')h+='<div class="row-forgot"><button type="button" class="lnk" data-m="forgot">Forgot your passphrase?</button></div>';
 if(m==='create')h+='<div class="checks">'+ckbox('age','I am 18 or over.',S.age,S.under?'bad':'')
  +ckbox('agree','I agree to the '+TERMS+' and the '+PRIV+'.',S.agree)+'</div>';
 h+='<p class="msg" id="msg" role="status"></p>';
 var cr=(m==='create');
 h+='<div class="lg-acts">'
  +(cr?'<button type="button" class="btn pri" id="go">Create account</button><button type="button" class="btn" data-m="login">Log in</button>'
      :'<button type="button" class="btn pri" id="go">Log in</button><button type="button" class="btn" data-m="create">Create account</button>')
  +'<button type="button" class="btn g" id="guest">'+ico('guest',20)+'Guest</button></div>';
 if(!cr){
  h+='<p class="cap">Guest tries it on this device. Nothing is saved to an account.</p>'
   +'<p class="cap consent">By continuing you agree to <span class="nw">the '+TERMS+' and the '+PRIV+'.</span></p>';}
 return h;}
function devHTML(){
 return '<div class="dev'+(S.dev?' open':'')+'" id="dev"><div class="dev-p"><span class="eyebrow">Developer options</span>'
  +'<label>Onboarding<span class="sw on"></span></label><label>Tutorial<span class="sw"></span></label></div>'
  +'<button type="button" class="dev-b" id="devb" aria-expanded="'+S.dev+'">'+ico('gear',16)+'Developer options</button></div>';}

var root=document.createElement('div');root.className='stage';document.body.appendChild(root);
root.innerHTML='<div class="fieldbg" id="ringhost"></div>'
 +'<div class="lg-logo">'+mark(M?132:176)+'</div>'
 +'<div class="lg" id="lg"></div>'+devHTML();
var host=$('#ringhost'),lg=$('#lg');

/* geometry of the ring. Desktop: centred. 390: a smaller ring above the form. */
function geo(){
 if(M)return {W:W,H:Ht,M:true,cx:W/2,cy:142,r:62};
 /* the ring opens wider when the form asks for more: create account has three
    fields and two ticks, and the ring must clear them */
 return {W:W,H:Ht,M:false,cx:W/2,cy:Ht/2+(S.mode==='create'?14:0),r:Math.min(W,Ht)*(S.mode==='create'?.405:.35),am:S.mode==='create'?1.34:1.2};}
var G=geo(),lastP=0;
function drawRing(){
 G=geo();
 var o=Object.assign({},G,{nu:S.u.length,np:S.p,err:S.err,ok:S.ok,live:true,sweep:S.mode==='login'||S.mode==='create'?20:20,arcFrom:lastP,pop:S.pop});
 if(S.mode==='forgot'||S.mode==='sent'){o.nu=0;o.np=0;o.err=false;o.ok=false;}
 host.innerHTML=loginRingSVG(o);
 var tgt=S.ok?1:(S.err?.6:Math.min(S.p,20)/20);
 var cl=$('#cl'),cr=$('#cr');
 if(cl&&cr&&Math.abs(lastP-tgt)>.001){
  cl.getBoundingClientRect();
  [cl,cr].forEach(function(e){e.style.transition='stroke-dashoffset .8s ease-out';e.style.strokeDashoffset=e.getAttribute('data-to');});}
 lastP=tgt;}
function paint(){
 var m=S.mode;
 lg.innerHTML=(m==='login'?'':'')+'<h1 class="lg-h" style="'+(m==='create'?'font-size:'+(M?19:23)+'px':'')+'">'+HEAD[m==='create'?'create':(m==='login'?'login':m)]+'</h1>'
  +(SUB[m]?'<p class="lg-sub">'+SUB[m]+'</p>':'')+formHTML();
 var msg=$('#msg');
 if(S.err){msg.className='msg bad';msg.innerHTML=ico('stop',20,'','style="color:#FF6A5C"')+'That username and passphrase do not match.';var pf=$('#f_p');if(pf)pf.classList.add('bad');}
 else if(S.under){msg.className='msg';msg.innerHTML=ico('stop',20,'','style="color:var(--ink)"')+'Atüned is for people 18 and over. No account was made.';}
 else if(S.ok){msg.textContent='Opening your field.';}
 drawRing();
 if(S.mode==='login'||S.mode==='create'){S.pop=false;}}
root.addEventListener('click',function(e){
 var t=e.target.closest('button');if(!t)return;
 if(t.getAttribute('data-m')){S.mode=t.getAttribute('data-m');S.err=false;S.under=false;paint();return;}
 if(t.id==='devb'){S.dev=!S.dev;$('#dev').classList.toggle('open',S.dev);t.setAttribute('aria-expanded',S.dev);return;}
 if(t.classList.contains('show')){S.show=!S.show;$('#p').type=S.show?'text':'password';t.textContent=S.show?'Hide':'Show';return;}
 if(t.id==='send'){S.mode='sent';paint();return;}
 if(t.id==='go'){
  if(S.mode==='create'){S.under=!S.age;S.ok=(!S.under&&S.agree&&S.u&&S.p);}
  else if(S.u&&S.p){S.err=(S.u!=='mika.salas');S.ok=!S.err;}
  paint();return;}
 if(t.id==='guest'){S.ok=true;paint();}
});
root.addEventListener('input',function(e){
 var t=e.target;
 if(t.id==='u'){S.u=t.value;S.pop=true;}
 if(t.id==='p'){S.p=t.value.length;S.pop=true;}
 if(t.id==='em')S.email=t.value;
 if(t.id==='age'){S.age=t.checked;S.under=false;}
 if(t.id==='agree')S.agree=t.checked;
 S.err=false;S.ok=false;
 // keep focus: redraw only the ring and the message, not the form
 if(t.id==='u'||t.id==='p'){
  var msg=$('#msg');if(msg){msg.className='msg';msg.textContent='';}
  var pf=$('#f_p');if(pf)pf.classList.remove('bad');
  var fu=$('#f_u');if(fu)fu.classList.toggle('has-av',S.mode==='create'&&S.u.length>2);
  drawRing();}
});
paint();
})();
