
/* ============================================================
   THE DRILLS. Every element that carries data opens one. Same panel
   for all of them, so there is one place to look.
   ============================================================ */
/* Opening a drill only set display:block on a div far down a long rail, so
   the answer to a click arrived below the fold with nothing saying it had. */
function rdOpen(){var b=document.getElementById('rdrill');if(!b)return null;
 b.style.display='block';
 var none=document.getElementById('rdrill-none'); if(none)none.style.display='none';
 /* open Selection, and leave open whatever else the person had open. */
 if(typeof OPENSEC==='object'&&OPENSEC&&OPENSEC.right){OPENSEC.right.sel=1;
  if(typeof paintSections==='function')paintSections();}
 /* BRING THE DRILL INTO VIEW, BUT ONLY WHEN IT IS BESIDE THE SURFACE.

    A drill opens in the right rail. Beside the stage, scrolling it into view
    is the whole courtesy: a person pressed something and the answer appears
    where they are looking.

    Stacked under the stage, which is every phone, it is the opposite. The
    rail sits below the whole surface, so this scrolled the page four
    thousand pixels down and left a person who had pressed Compass looking at
    a rail with the compass off the top of the screen. Measured at 390: the
    canvas at minus 3617 with the page at 4165. It reads as the tab doing
    nothing, which is the worst kind of defect, because the answer a person
    tries is to press it again.

    Found with a trap on scrollIntoView after two wrong theories, a scroll
    reset and a focus move, both of which measured clean on their own and
    neither of which was the cause. The rule the repository already carries:
    reproduce the failure before fixing it, and re-measure after.

    The test is where the rail actually is, read at run time, not a width
    somebody typed. A rail that starts below the surface it belongs to is
    stacked, and a stacked drill does not move the page. */
 var sec=b.closest?b.closest('.lsec'):null;
 var stage=document.querySelector('.stage');
 var beside=true;
 try{
  var rr=(sec||b).getBoundingClientRect(), sr=stage?stage.getBoundingClientRect():null;
  if(sr)beside=(rr.top<sr.bottom-8);
 }catch(e){}
 if(beside&&sec&&sec.scrollIntoView){
  try{sec.scrollIntoView({block:'start',behavior:REDUCED?'auto':'smooth'});}
  catch(e){sec.scrollIntoView();}}
 return b;}
function rdClose(){ANA_PICK=null;S.pin=null;
 var b=document.getElementById('rdrill');if(b){b.innerHTML='';b.style.display='none';}
 var none=document.getElementById('rdrill-none'); if(none)none.style.display='';
 render();}
/* THE WAY BACK, AND IT WAS AT THE BOTTOM. Ruled: "If I click, how do I get
   back?" A close control existed and it sat after the whole card, so on a long
   drill a person had to read to the end of something they did not want in
   order to leave it. That is a one way door on the one surface built to be
   pressed into, which punishes exactly the behaviour the Field invites.

   The control moves to the top and sticks there, it says where it goes rather
   than saying close, and escape does the same thing. The bottom one stays,
   because a person who did read to the end should not have to scroll back up. */
/* A LABEL IS A NAME FOR A REGION. A STATEMENT TAKES PLAIN.

   The rule is the stylesheet's and is stated there in full: a label is four
   words or fewer with no comma and a word after it, and it keeps the capital
   on every word. Everything else is a statement, takes plain, and stays in
   sentence case.

   It is applied here, once, to the markup on its way into the panel, rather
   than judged at each of forty sites. The reason is measured. A drill eyebrow
   is a statement more often than it is a name, and until the surface walk
   learned to open a drill nothing read any of them: eighty eight distinct
   strings in these two classes came back titled on the screen, including
   "Law Of Integrity, Throat", "What Did You Argue About With A Friend, And
   Which Corner Did You Take?" and "Depth 2, Lust". Every one of them is
   written correctly in the source, in sentence case, because the transform is
   what does the capitalising. They were only wrong on the screen.

   Deciding it here also means the next drill somebody writes is right without
   their having to remember, which is the only version of this rule that does
   not rot. A site that has already chosen plain keeps it: this only reads the
   bare class. */
/* THE PATTERN IS BUILT FROM A STRING, not written as a regular expression
   literal. A literal needs the closing tag's slash escaped, and BUILD.sh
   counts opening and closing divs across the whole file to prove the shell
   closes everything it opens. An escaped slash is not the closing tag it
   counts, so the literal form reported the build one div out of balance. */
var RD_CASE=new RegExp('<div class="(pm-eye|ad-nm)">([\\s\\S]*?)</div>','g');
function rdCase(h){
 return String(h).replace(RD_CASE,
  function(all,cls,body){
   var t=body.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
   /* AND A VALUE WRITTEN IN LOWER CASE IS A READING, NOT A NAME. This
      product writes a name with its capital on it, so a string that starts
      lower case is a reading and a reading is never titled: "not read yet"
      came back as "Not Read Yet", which reads like a proper noun. Four words
      was not enough on its own to tell the two apart. */
   var label=t&&!/[,;:]\s*\S*[A-Za-z]/.test(t)&&!/[.!?]\s+\S/.test(t)
    &&t.split(/\s+/).length<=4&&/^[A-Z0-9]/.test(t);
   return '<div class="'+cls+(label?'':' plain')+'">'+body+'</div>';});}
function rdShell(h){
 h=rdCase(h);
 var b=rdOpen(); if(!b)return;
 var backTo=(typeof TABDEF!=='undefined'&&typeof S!=='undefined')
  ? (TABDEF.filter(function(t){return t.k===S.tab;})[0]||{}).nm : '';
 b.innerHTML='<div class="rd-card">'
  +'<div class="rd-top"><button type="button" class="rd-back" id="rdback">'
  +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
  +'<span>'+esc(backTo?'Back to the '+String(backTo).toLowerCase():'Back')+'</span>'
  +'</button></div>'
  +h
  +'<button class="btn" id="rdx" style="margin-top:14px">Close</button></div>';
 var x=document.getElementById('rdx'); if(x)x.onclick=rdClose;
 var k=document.getElementById('rdback'); if(k)k.onclick=rdClose;}
/* ESCAPE LEAVES, the same as every other sheet in this product. It is bound
   once rather than per drill, and it only fires when a drill is actually open,
   so it never eats an escape another surface wanted. */
addEventListener('keydown',function(e){
 if(e.key!=='Escape')return;
 var b=document.getElementById('rdrill');
 if(!b||b.style.display==='none'||!b.innerHTML)return;
 rdClose();});
/* addrRow lives in component.js, beside the component it renders. */

function runDrill(o){
 if(!o){rdClose();return;}
 var lv=leaves(o), bs=[], fets=[];
 lv.forEach(function(n){if(bs.indexOf(n.b)<0)bs.push(n.b);
  if(n.cf&&fets.indexOf(n.cf)<0)fets.push(n.cf);});
 var oppOf=function(f){var c=CHILD.filter(function(x){return x.nm===f;})[0];return c?c.opp:'';};
 var opps=fets.map(oppOf).filter(Boolean);
 var inst=fets.filter(function(f){return (S.replace[f]||0)>=4;});
 var TN={sup:'Character layer',hy:'Hyper-complex',cx:'Complex',sab:'Saboteur'};
 var h='<div class="pm-eye">'+(TN[o.kind]||'Pattern')+(o.over?', overshot':'')+'</div>'
  +'<div class="ad-nm">'+esc(o.nm)+'</div>'
  +(o.auth?'<div class="ad-sub">'+esc(o.auth)+'</div>':'')
  +(o.kind==='sab'&&o.unnamed?'<div class="ad-sub">Inferred. The library has no name for this cluster, so it is named for its seat and its child emotion.</div>'
   :(o.kind==='sab'&&SAB_PI.indexOf(o.nm)>=0?'<div class="ad-sub">One of the ten Positive Intelligence saboteurs, after Shirzad Chamine.</div>':''))
  +'<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +(o.over
   ? 'Jouissance. The coherent opposite installed past the point where it serves. The address '
     +'will not shut, rather than will not open.'
   : 'Built from <b>'+lv.length+'</b> held addresses across '+bs.join(', ')+'. It fires when '
     +'those carry at once, and the output bends on the way out.')
  /* SUBJECT FIRST, ONE SENTENCE, NO GLOSS. This was two sentences, the first
     defining the thing by what it is not and the second deferring its subject
     by two words and then explaining itself with a which. Same length, one
     gloss gone, and it starts on the noun. */
  +(o.kind==='sup'?' A character layer costs more than it looks like it should, '
   +'because you cannot see it as separate from you.':'')
  +(o.score?' Matched at <b>'+o.score+'%</b>'
    +(o.exact?', every charge inside its range.':'.'):'')+'</p>'
  +'<div class="pm-eye">The opposite</div><p class="ad-p">'
  +(opps.length
   ? 'It runs on '+fets.join(', ')+'. The coherent opposite is <b>'+opps.join(', ')+'</b>. '
     +(inst.length?'You already have '+inst.map(oppOf).join(', ')+' partly installed.'
       :'None of it is installed yet. Release empties the address, the opposite is what fills it.')
   : 'No poled axis sits underneath this one.')+'</p>'
  +(o.kind==='sab'?kbSabBlock(o.nm):'')
  +'<div class="pm-eye">Made of</div><div class="ad-rows">'
  +lv.slice(0,8).map(addrRow).join('')
  +(lv.length>8?'<div class="pm-more">and '+(lv.length-8)+' more</div>':'')+'</div>';
 rdShell(h);}

function runLawDrill(l){
 if(!l)return;
 var v=S.law[l.nm], seg=W.filter(function(n){return n.b===l.b;});
 var hot=seg.filter(function(n){return n.sq>=4;});
 var sc=CURP?(iqScore(CURP)[l.nm]||null):null;
 var h='<div class="pm-eye">Law of integrity, '+l.b.toLowerCase()+'</div>'
  +'<div class="ad-nm">'+l.nm+' '+v.toFixed(1)+'</div>'
  +'<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +(v<4?'This law is <b>shut</b>. Under 4 it is not resisting, it is closed, and everything '
    +'seated at the '+l.b.toLowerCase()+' pays for it.'
   :v>=7?'This law is <b>open</b>. It is one of the things carrying your coherence.'
   :'Working but not strong. It holds in some contexts and slips in others.')
  /* the count of what is held is the fact. Against the seat's total it is a
     score, and this is a reading. */
  +' Seated at the '+l.b.toLowerCase()+', where <b>'+hot.length+'</b> address'
  +(hot.length===1?' is':'es are')+' held.</p>';
 h+= sc
  /* ONE SENTENCE, NOT A STOP AND THEN A LOWER CASE CLAUSE. It printed
     "Spread 3.6. holds when it costs, slips when unseen", which is a full stop
     with a sentence after it starting in lower case. The intake prints the
     same two facts joined by a comma and reads correctly, so this joins them
     the same way. */
  ? '<div class="pm-eye">From your diagnostic</div><p class="ad-p">Spread <b>'+sc.spread
    +'</b>, '+sc.lean+'.</p>'
  : '<div class="pm-eye">Not measured</div><p class="ad-p">Not answered in the diagnostic, so '
    +'it defaults to '+v.toFixed(1)+'. Three questions would replace the guess.</p>';
 if(hot.length)h+='<div class="pm-eye">Held here</div><div class="ad-rows">'
  +hot.slice(0,6).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runNodeDrill(n){
 if(!n)return;
 var c=CHILD.filter(function(x){return x.nm===n.cf;})[0]||{};
 var r=compute();
 var owners=[].concat(r.sups,r.hys,r.cxs,r.sabs).filter(function(o){return leaves(o).indexOf(n)>=0;});
 /* The header read "Address 007, root". The index is a storage key and a
    person's Scarcity is not 007 to them. The seat is what carries meaning. */
 var h='<div class="pm-eye">'+esc(n.b)+'</div>'
  +'<div class="ad-nm">'+esc(n.k)+'</div>'
  +'<div class="ad-sub">'+esc(n.n||'field anchor')+(n.a?' · axis '+esc(n.a):'')+'</div>'
  +'<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +'Held <b>'+n.held.toFixed(1)+'</b>, opposite installed <b>'+n.rep.toFixed(1)+'</b>, net SQ <b>'
  +n.sq.toFixed(1)+'</b>. Distorts as '+esc(n.d||'')+'.</p>'
  +'<div class="pm-eye">The opposite</div><p class="ad-p">'
  +(c.opp?'This sits on the <b>'+c.nm+' toward '+c.opp+'</b> axis, at the '+c.addr.toLowerCase()
    +'. '+((S.replace[c.nm]||0)>=4?'You have '+c.opp+' partly installed.'
      :c.opp+' is what fills this address once it is emptied.')
   :'A field address, with no poled axis under it. This one is an open ruling.')+'</p>'
  +'<div class="pm-eye">Feeds '+owners.length+'</div><div class="pm-chips">'
  +(owners.length?owners.slice(0,8).map(function(o){
    return '<span class="pm-chip'+(o.over?' over':'')+'">'+esc(o.nm)+' '+o.w.toFixed(1)+'</span>';}).join('')
   :'<span class="pm-chip">nothing compounds from here</span>')+'</div>';
 /* RUN THE PROTOCOL HERE. The reading ended at the reading: a person could see
    exactly which address was costing them and had no way to act on it from
    where they were standing. The release runner has always taken a list of
    node ids, so scoping a run to one address is the call it was built for and
    nothing new had to be invented. Only offered where there is something to
    release: a protocol on an empty address is a ritual, not a protocol. */
 if(n.sq>=1)
  h+='<div class="ad-prot"><button class="btn pri" data-prot="'+n.i+'">'
   +'Run the protocol here</button>'
   +'<span class="ad-prot-n">'+esc(n.k)+', '+(c.nm?esc(c.nm)+' toward '+esc(c.opp):'this address')
   +'. Four channels, twenty five lines.</span></div>';
 else
  h+='<p class="ad-p">Nothing is held here, so there is nothing to release. '
   +'The protocol opens once this address is carrying.</p>';
 rdShell(h);}
/* one listener for every protocol control, wherever it is drawn */
addEventListener('click',function(e){
 var b=e.target&&e.target.closest?e.target.closest('[data-prot]'):null;
 if(!b)return;
 var i=+b.getAttribute('data-prot');
 if(!isFinite(i))return;
 rdClose(); relPick([i]);});

/* THE CORE DRILL LED WITH ITS OWN ARITHMETIC.

   Every word a person got about the most important number in the product was
   a restatement of the formula: intention times integrity over resistance,
   three values divided. That explains the calculation to somebody who already
   knows what the calculation is for, which is nobody who opens this.

   What it measures goes first. Then where the distortion sits, because that
   is the only actionable thing on the screen. Then the arithmetic, which is
   how the number was reached and not what it says. */
function runCoreDrill(){
 var r=compute();
 var h='<div class="pm-eye">The core</div>'
  +'<div class="ad-nm">'+(r.unread?'not read yet'
    :'CQ '+Math.round(r.CQ)+', '+tierSay(r).toLowerCase())+'</div>'
  +'<div class="pm-eye">What coherence is</div><p class="ad-p">'
  +'Coherence is the alignment between the world around you, what arrives from '
  +'it, the way you read what arrives, the intention behind it, and the action '
  +'that follows. Four stations and one circuit. This instrument reads every '
  +'register in that circuit and reports where they stop agreeing.</p>'
  +'<div class="pm-eye">Where the distortion sits</div><p class="ad-p">'
  +'A circuit distorts somewhere specific. In the field, and it shows up as '
  +'perception. In the body, and it shows up in the nervous system or in what '
  +'the ego is holding. The reading does not tell you that you are incoherent. '
  +'It tells you which register bent, and the body page shows you where.</p>'
  +'<div class="pm-eye">How the number is reached</div><p class="ad-p">'
  /* THIS PARAGRAPH DESCRIBED A FORMULA THAT IS GONE. It said intention times
     integrity over resistance, with shadow weight the only thing dividing
     you down. Ruled 25 September: CQ is the 21 laws and nothing else, and
     the shadow pulls on expression instead. It says that now, with the
     person's own figures in it. */
  +'The '+SI.length+' laws, each out of 10, summed out of 210. '
  +(r.complete?'All '+SI.length+' are in. '
    :'<b>'+(SI.length-r.answered)+'</b> are still to answer, and each counts 0 until it is. ')
  +'The shadow does not touch this number. It pulls on expression, which is '
  +'coherence times what the shadow leaves: expression <b>'+Math.round(r.EX)
  +'</b>, with the shadow taking <b>'+Math.round(r.PULL*100)+' per cent</b>.</p>'
  +'<div class="pm-eye">The read</div><p class="ad-p">'
  /* benign is null while CQ is still filling, and the clause waits with it */
  +(r.benign===null?'':'The field is <b>'
    +(r.benign?'expanding':'contracting '+r.malig+'%')+'</b>. ')+'Radiance <b>'
  +(r.radiance*100).toFixed(0)+'%</b>. The field is the geometry of that '
  +'radiance. It is harmonic, so patterns sit at registers rather than '
  +'anywhere, and what radiates outward tends to carry the colour of the '
  +'loudest seat. The core takes its colour from the coherence ramp, so '
  +'saturation and size are coherence and nothing else.</p>'
  +gatesBlock(null);
 rdShell(h);}

/* the six gates. three higher keep charge from binding, three lower bind it.
   the percent is the share of the story that ran through each gate, the
   multiplier is what that gate does to everything held. */
function gatesBlock(focus){
 var V=verpRead(), evid=V.some(function(v){return v.pct>0;});
 var rows=V.map(function(v){
  var c=v.side==='higher'?seatCol('Heart'):seatCol('Root');
  return '<button class="ad-r gate-r'+(focus===v.k?' on':'')+'" data-gate="'+v.k+'" style="--c:'+c+'">'
   +'<span class="ad-k">'+esc(v.nm)+'</span>'
   +'<span class="ad-v">'+(evid?v.pct+'%':'')+'</span>'
   +'<span class="ad-m">\u00d7'+v.mult.toFixed(2)+'</span></button>';}).join('');
 return '<div class="pm-eye">The six gates</div><p class="ad-p">'
  +(evid?'The share of the story that ran through each gate. ':'No story yet, so no gate has evidence. ')
  +'Higher gates leave charge where it is. Lower gates bind it, and the multiplier is the cost on everything held.</p>'
  +'<div class="ad-rows">'+rows+'</div>';}
function runGatesDrill(k){
 var v=verpRead().filter(function(x){return x.k===k;})[0];
 if(!v){runCoreDrill();return;}
 var h='<div class="pm-eye">'+(v.side==='higher'?'Higher gate':'Lower gate')+'</div>'
  +'<div class="ad-nm">'+esc(v.nm)+'</div>'
  +'<div class="pm-eye">What it sounds like</div><p class="ad-p">'+esc(v.d)+'</p>'
  +'<div class="pm-eye">What it does</div><p class="ad-p">'
  +(v.pct?'<b>'+v.pct+'%</b> of the story ran through this gate, '+v.n+' sentence'+(v.n===1?'':'s')+'. ':'Nothing in the story has run through it yet. ')
  +'Everything held is multiplied by <b>'+v.mult.toFixed(2)+'</b> for the share that passes here'
  +(v.mult<1?', so it lightens the load.':v.mult>1?', so it adds to the load.':'.')+'</p>'
  +gatesBlock(k);
 rdShell(h);}

/* the three quotients and the pole. the key strip above the wheel opens
   these, one per element, so nothing on the stage is a label without a door. */
function runQDrill(q){
 if(q==='cq'){runCoreDrill();return;}
 if(q==='xyz'){runXYZDrill();return;}
 if(q==='flow'){runFlowDrill();return;}
 var r=compute(), h='';
 if(q==='dq'){
  var top=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;}).slice(0,5);
  /* REWRITTEN 25 SEPTEMBER. It said DQ was every address above its floor
     and the whole of resistance, with CQ divided by it. DQ is the total
     shadow on all 112 now, out of 100, and it pulls on expression. */
  h='<div class="pm-eye">Shadow weight</div><div class="ad-nm">DQ '+Math.round(r.DQ)+'%</div>'
   +'<div class="pm-eye">How it is built</div><p class="ad-p">The weight at all 112 addresses, summed, out of the most they can hold. '
   +'It is the wash pressing in from the edge of the wheel. It leaves coherence alone and pulls on expression, and an address near 10 pulls far harder than one near 2.</p>'
   +'<div class="pm-eye">Where it sits</div><p class="ad-p"><b>'+r.loaded.length+'</b> addresses carry it. The heaviest:</p>'
   +'<div class="ad-rows">'+top.map(addrRow).join('')+'</div>';}
 else if(q==='sq'){
  h='<div class="pm-eye">Segment depth</div><div class="ad-nm">SQ '+r.SQm.toFixed(1)+' mean</div>'
   +'<div class="pm-eye">How it is built</div><p class="ad-p">The charge held at one address, 0 to 10. '
   +'Each segment of the shell is drawn to its own depth, so the wheel is 112 of these side by side. The mean is across the addresses that hold anything.</p>'
   +'<div class="pm-eye">Heaviest seat</div><p class="ad-p"><b>'+esc(r.darkB)+'</b> at <b>'+r.darkV.toFixed(1)+'</b>. Click a segment on the wheel to read one address.</p>';}
 else {
  var inst=CHARGES.filter(function(c){return (S.replace[c]||0)>=4;});
  h='<div class="pm-eye">Pole</div><div class="ad-nm">'+r.poleMean.toFixed(2)+' coherent opposite in</div>'
   +'<div class="pm-eye">How it is built</div><p class="ad-p">Each child emotion has a coherent opposite. Fear to trust, anger to equanimity. '
   +'Release empties the address, replace fills it with the opposite, and the pole is how much of that opposite is installed, 0 to 1 averaged across the nine.</p>'
   +'<div class="pm-eye">Installed</div><p class="ad-p">'+(inst.length?inst.map(function(c){
     var o=CHILD.filter(function(x){return x.nm===c;})[0];return esc(o.opp)+' over '+esc(c);}).join(', ')+'.':'Nothing installed yet.')+'</p>';}
 rdShell(h);}

/* THE THREE AXES. energy read on three independent lines, each a pure
   function of quantities already in the reading. Vitality is what is left
   after apathy and shadow weight. Awareness is intention against
   distortion. Will is integrity through a clear segment. */
function runXYZDrill(){
 var r=compute();
 var A=[['Vitality',r.X,'Solar','what is left after apathy and the shadow weight. Apathy <b>'
   +(S.charge.Apathy||0).toFixed(1)+'</b>, shadow weight <b>'+Math.round(r.DQ)+' per cent</b>.'],
  ['Awareness',r.Y,'3rd Eye','intention against distortion. Intention <b>'+r.It.toFixed(1)
   +'</b>, distortion <b>'+r.dist.toFixed(1)+'</b>.'],
  ['Will',r.Z,'Root','integrity carried through a clear segment. Integrity <b>'+r.Ig.toFixed(1)
   +'</b>, mean depth <b>'+r.SQm.toFixed(1)+'</b>.']];
 var mean=(r.X+r.Y+r.Z)/3;
 var low=A.slice().sort(function(a,b){return a[1]-b[1];})[0];
 var h='<div class="pm-eye">Energy</div><div class="ad-nm">'+(mean*100).toFixed(0)+'% across three axes</div>'
  +'<div class="pm-eye">How to read it</div><p class="ad-p">Three independent lines. They do not average into '
  +'a score, they say which of the three is carrying and which is short. Yours reads shortest at <b>'
  +low[0]+'</b>.</p>'
  +'<div class="ad-rows">'+A.map(function(a){
    return '<div class="ad-r static"><span class="ad-k">'+cr(a[2],a[1]*100,{size:'xs',raw:a[1].toFixed(2),hot:false})
     +a[0]+'</span><span class="ad-m">'+(a[1]*100).toFixed(0)+'%</span></div>';}).join('')+'</div>'
  +A.map(function(a){return '<div class="pm-eye">'+a[0]+'</div><p class="ad-p">'+a[3]+'</p>';}).join('');
 rdShell(h);}

/* ONE ATOM. The smallest true unit this instrument holds: one story, one
   address, one weight. Everything above it on the wheel is a sum of these.

   It is the person's own sentence that did this, so the sentence is quoted
   whole and not summarised, and the address it landed on is named with what
   it is standing on and what it costs. */
function runAtomDrill(n,x){
 var d=''; try{d=new Date(x.t).toLocaleDateString(undefined,
   {year:'numeric',month:'long',day:'numeric'});}catch(e){d='';}
 var cf=CHILD.filter(function(y){return y.nm===n.cf;})[0];
 var all=(atomIndex()||{})[n.i]||[];
 var tot=all.reduce(function(a,y){return a+y.amt;},0);
 var h='<div class="pm-eye">What put it here</div>'
  +'<div class="ad-nm">'+esc(n.k)+'</div>'
  +'<div class="pm-eye">Your words</div>'
  +'<p class="ad-p"><em>'+esc(x.text)+'</em></p>'
  +'<div class="pm-eye">What it weighed</div><p class="ad-p">'
  +(d?'Written '+d+'. ':'')+'This entry put <b>'+x.amt.toFixed(1)+'</b> at this '
  +'address'+(all.length>1?', out of <b>'+tot.toFixed(1)+'</b> from '+all.length
    +' entries that landed here':'')+'.</p>'
  +'<div class="pm-eye">The address</div><p class="ad-p">'
  +esc(n.k)+' sits at the '+String(n.b).toLowerCase()+', on the <b>'
  +esc(n.cf||'unrouted')+'</b> axis'+(cf&&cf.opp?', against <b>'+esc(cf.opp)+'</b>':'')
  +'. It is holding <b>'+n.sq.toFixed(1)+'</b> and the opposite is installed at <b>'
  +(n.pole||0).toFixed(1)+'</b>.</p>'
  /* ONE CONTROL, ONE LABEL. The same button, the same data-prot attribute and
     the same handler, two hundred lines above this one, says "Run the protocol
     here", which is the phrasing COPY.md carries as the example and the
     phrasing the refusal beside it uses. This one said "Run a release here". */
  +(n.cf?'<div class="ad-acts"><button class="btn ad-prot" data-prot="'+n.i
    +'">Run the protocol here</button></div>':'');
 rdShell(h);}

/* FLOW. WHAT REACHES THE CROWN FROM THE ROOT.

   The seven seats pass signal in series, so the throughput of the whole
   column is each seat's pass multiplied by the next. One shut seat closes
   the column regardless of how clear the six above it are, which is the
   reading, and it is why this is drawn as a channel on the Body page rather
   than as seven numbers.

   It was computed there and read nowhere else. */
function runFlowDrill(){
 var r=compute(), seats=flSeats(), f=flSpeed();
 var stop=null; seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 var h='<div class="pm-eye">Flow</div><div class="ad-nm">'+(r.unread?'not read yet'
    :(f*100).toFixed(0)+'% reaches the crown')+'</div>'
  +'<div class="pm-eye">How it is built</div><p class="ad-p">'
  +'The seven seats pass signal in series, root upward. Each one passes a share '
  +'and the column carries the product of all seven, so one shut seat closes '
  +'the column whatever the six above it are doing. This is the number the Body '
  +'page draws as a channel, and where it pinches is where the work is.</p>'
  +'<div class="pm-eye">Seat by seat</div><div class="ad-rows">'
  +seats.slice().reverse().map(function(s){
    return '<div class="ad-r static"><span class="ad-k">'
     +cr(K2B[s.p.k],s.pass*100,{size:'xs',raw:s.pass.toFixed(2),hot:false})+esc(s.p.n)+'</span>'
     +'<span class="ad-m">'+Math.round(s.pass*100)+'%</span></div>';}).join('')+'</div>'
  +'<div class="pm-eye">Where it stops</div><p class="ad-p">'
  +(stop?'The column closes at the <b>'+esc(String(stop.p.n).toLowerCase())+'</b>, which is '
    +'carrying <b>'+stop.hot+'</b> address'+(stop.hot===1?'':'es')+'. Clear those and the '
    +'seats above it open with them.'
   :'No seat is holding enough to close the column.')+'</p>';
 rdShell(h);}

/* BALANCE. which way the field discharges, and what it is built from. */
function runBalDrill(){
 var r=compute(), b=r.balance;
 var sx=CURP&&CURP.who?CURP.who.sex:'';
 var SXN={m:'male',f:'female',o:'other'}[sx]||'';
 var row=function(c,v,col){return '<div class="ad-r static"><span class="ad-k">'
  +cr(col,v*10,{size:'xs',raw:v.toFixed(1)})+esc(c)+'</span></div>';};
 /* THE SAME REFUSAL IN THE SAME KIND OF SLOT, one door further in. ad-nm is
    the drill's value line and it read "not enough held to read", which is the
    engine's own wording for declining to call a direction, printed where the
    direction goes. It is less wrong here than on the strip, because there are
    no pole labels either side of it to make a sentence out of, but it is the
    same defect and it gets the same treatment: the slot says the state in the
    product's one term for it, and the paragraph two lines down already
    carries the reason with both means printed beside it.

    The term is the copy seat's, not mine and not provisional: five phrasings
    of this one state were in the product and its sweep rules them down to
    "not read yet" as a value. It is the same string the strip now carries. */
 var h='<div class="pm-eye">Balance</div><div class="ad-nm">'
  +(!b.read?'not read yet'
    :b.lean===0?'even':(Math.abs(b.lean)*100).toFixed(0)+'% '+(b.lean>0?'outward':'inward'))+'</div>'
  +'<div class="pm-eye">How to read it</div><p class="ad-p">The nine axes split by the direction the '
  +'body takes under them. Four discharge outward, five withdraw inward. Four against five is not a '
  +'fair sum, so the means are what compare. Outward mean <b>'+b.outMean.toFixed(1)
  +'</b> against inward mean <b>'+b.inMean.toFixed(1)+'</b>.'
  /* THE REFUSAL, IN FULL, ONE DOOR IN. The strip's value slot carries a dash
     and nothing else, which is the whole of the fix: a refusal is not a value.
     This is where the refusal is allowed its own sentence, because there is
     room here to say what failed and what changes it. Wording from the copy
     seat's sweep, which also rules the five phrasings of the empty state down
     to one. "Too little held" was one of the five. */
  +(b.read?'':' Neither side reaches 1, so no direction is named. '
    +'Write what happened and both sides move.')+'</p>'
  +(SXN?'<div class="pm-eye">Sex at birth</div><p class="ad-p">You gave <b>'+SXN+'</b>. It is stored '
    +'and marked on the strip, and it does not enter the arithmetic. The distance between the tick '
    +'and the marker is the reading, not a verdict.</p>':'')
  +'<div class="pm-eye">Outward</div><div class="ad-rows">'
  +OUTWARD.map(function(c){return row(c,S.charge[c]||0,'Solar');}).join('')+'</div>'
  +'<div class="pm-eye">Inward</div><div class="ad-rows">'
  +INWARD.map(function(c){return row(c,S.charge[c]||0,'Throat');}).join('')+'</div>';
 rdShell(h);}

/* ---- the knowledge base drills. every drill lives in this file. ---- */
/* the catalog entry for one seat. the counts are the clinical record, not a
   score, so they are stated as what was released and what installed. */
function runSeatDrill(c){
 var h='<div class="pm-eye">Seat</div><div class="ad-nm">'+esc(c.b)+'</div>'
  +'<div class="ad-sub">'+esc(c.nv)+'</div>'
  +'<div class="pm-eye">What encodes here</div><p class="ad-p">'+esc(c.d)+'</p>'
  +'<div class="pm-eye">The record</div><div class="ad-rows">'
  +c.sub.map(function(x){
    return '<div class="ad-r static"><span class="ad-k">'+esc(x[0])+'</span>'
     +'<span class="ad-m">'+x[1]+' released, '+x[2]+' installed</span></div>';}).join('')
  +'</div>'
  +'<div class="pm-eye">Addresses here</div><div class="ad-rows">'
  +W.filter(function(n){return n.b===c.b;}).slice(0,10).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runFetterDrill(c){
 var held=S.charge[c.nm]||0, inst=S.replace[c.nm]||0;
 var at=W.filter(function(n){return n.cf===c.nm;});
 var h='<div class="pm-eye">Child emotion</div><div class="ad-nm">'+esc(c.nm)+'</div>'
  +'<div class="ad-sub">toward '+esc(c.opp)+'</div>'
  +'<div class="pm-eye">Where it sits</div><p class="ad-p">'+esc(c.addr)+', at '+esc(c.loc)
  +'. Seated at the '+esc(c.seat).toLowerCase()+'.</p>'
  +'<div class="pm-eye">Both halves</div><p class="ad-p">Held <b>'+held.toFixed(1)+'</b>. '
  +esc(c.opp)+' installed <b>'+inst.toFixed(1)+'</b>. Release empties the address, the opposite is what fills it.</p>'
  +'<div class="pm-eye">It runs '+at.length+' addresses</div><div class="ad-rows">'
  +at.slice(0,10).map(addrRow).join('')
  +(at.length>10?'<div class="pm-more">and '+(at.length-10)+' more</div>':'')+'</div>';
 rdShell(h);}

/* a saboteur the reading is not currently carrying. it still has a definition. */
function runSabDrill(s){
 var pi=SAB_PI.indexOf(s.nm)>=0;
 var nodes=(s.nids||[]).map(function(i){return BY[i];}).filter(Boolean);
 var h='<div class="pm-eye">Saboteur, not running</div><div class="ad-nm">'+esc(s.nm)+'</div>'
  +'<div class="ad-sub">'+(s.unnamed?'Inferred from the connection types'
    :(pi?'One of the ten Positive Intelligence saboteurs, after Shirzad Chamine':'SOURCE library'))+'</div>'
  +'<div class="pm-eye">What it would take</div><p class="ad-p">It fires when its addresses carry at '
  +'once. Yours are not carrying enough for it to run, which is why it is here and not on the wheel.'
  +(s.hcx?' It compounds into <b>'+esc(s.hcx)+'</b>.':'')+'</p>'
  +kbSabBlock(s.nm)
  +'<div class="pm-eye">Made of</div><div class="ad-rows">'+nodes.map(addrRow).join('')+'</div>';
 rdShell(h);}

/* THE DOMAIN, read clear and read distorted. The book prints both readings
   for all nineteen. Four are under a different name in the engine, and the
   drill says both rather than picking one, because that ruling is not mine. */
function runDomDrill(d){
 var k=KB_KEY(d.nm), def=DOMDEF[k], alt=KB_RENAME[k];
 var h='<div class="pm-eye">Blueprint domain'+(def&&def.n?' '+def.n:'')+'</div>'
  +'<div class="ad-nm">'+esc(d.nm)+'</div>'
  +'<div class="ad-sub">'+esc(d.r)+' cluster'+(alt?', called '+esc(alt)+' in the codex':'')+'</div>';
 if(def){
  h+='<div class="pm-eye">Read clear</div><p class="ad-p">'+esc(def.c)+'</p>'
   +'<div class="pm-eye">Read distorted</div><p class="ad-p">'+esc(def.x)+'</p>';}
 else h+='<div class="pm-eye">What it is</div><p class="ad-p">'+esc(d.d||'')+'</p>';
 rdShell(h);}

/* the definition, the trigger and the interrupt. an interrupt is the only
   part a person can act on in the moment, so it is printed last and plainly. */
function kbSabBlock(nm){
 var def=SABDEF[KB_KEY(nm)]; if(!def)return '';
 return (def.d?'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(def.d)+'</p>':'')
  +(def.t?'<div class="pm-eye">When it fires</div><p class="ad-p">'+esc(def.t)+'</p>':'')
  +(def.q?'<div class="pm-eye">What it says</div><p class="ad-p"><em>'+esc(def.q)+'</em></p>':'')
  +(def.i?'<div class="pm-eye">The interrupt</div><p class="ad-p">'+esc(def.i)+'</p>':'');}

function runKbDrill(eyebrow,title,sub,body){
 rdShell('<div class="pm-eye">'+esc(eyebrow)+'</div><div class="ad-nm">'+esc(title)+'</div>'
  +(sub?'<div class="ad-sub">'+esc(sub)+'</div>':'')
  +(body?'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(body)+'</p>':''));}

/* ============================================================
   THE TWO ENDS OF THE COMPASS.

   The cone points up toward twelve coherent expressions of eight
   human qualities, and down toward the inversion of the same eight.
   Same energy, opposite direction, and the person reading is
   somewhere between them on every axis.

   Rendered as behaviours and never as figures. Nobody meets Lucifer.
   A person runs pride as false light, and the name is what four
   thousand years of people called that behaviour when they saw it.
   That is the only reason the names earn their place: they carry
   the historical footprint, and the echo is in the room today.
   ============================================================ */
/* ONE TEACHER, OR ONE INVERSION. Clicking a name on the compass did nothing,
   because the figure had no hit testing at all: sixteen names were drawn as
   though they were buttons and were not.

   Named as behaviours, on the owner's standing ruling. Nothing here treats a
   teacher or a demon as an entity. Each is one end of one axis and what the
   reading says is how far along that axis this person currently sits. */
function runTeacherDrill(m,end){
 if(!m)return;
 var up=(end!=='dn'), r=compute();
 var nm=up?m.up:m.dn, d=up?m.upd:m.dnd, ic=up?m.ic:m.dic;
 var other=up?m.dn:m.up, od=up?m.dnd:m.upd;
 var load=(typeof flSeats==='function')
  ?(flSeats().filter(function(x){return x.p.n===m.seat;})[0]||{load:0}).load:0;
 var ig=(typeof bandIg==='function')?bandIg(m.seat):0;
 var at=(typeof mirrorAt==='function')?mirrorAt(load,ig):null;
 var h='<div class="pm-eye">'+esc(m.q)+(up?', at the crown':', at the floor')+'</div>'
  +'<div class="ad-nm">'+(ic?'<svg class="ad-ic" viewBox="0 0 24 24" aria-hidden="true">'
    +'<path d="'+ic+'"/></svg>':'')+esc(nm)+'</div>'
  +'<div class="ad-sub">'+esc(m.seat)+' \u00b7 '
  +(up?'the quality running clean':'the same quality, inverted')+'</div>'
  +'<div class="pm-eye">What this is</div><p class="ad-p">'+esc(d)+'</p>'
  +'<div class="pm-eye">The other end</div><p class="ad-p"><b>'+esc(other)+'</b>. '
  +esc(od)+'</p>'
  +'<div class="pm-eye">Where you sit</div><p class="ad-p">'
  +(r.unread
    ?'Nothing has been entered yet, so this axis has no reading. It is still the axis.'
    :'The '+esc(String(m.seat).toLowerCase())+' is carrying <b>'
     +Math.round(load*100)+'%</b> and its integrity reads <b>'+ig.toFixed(1)
     +'</b>.'+(at?' That puts you at <b>'+esc(at)+'</b> on this axis.':''))
  +'</p>'
  +'<div class="pm-eye">The question that separates them</div>'
  +'<p class="ad-p">'+esc(m.ask||'')+'</p>'
  +'<p class="ad-p">Neither of these is a being. Both are behaviours, and they '
  +'are the same behaviour at two settings.</p>';
 rdShell(h);}
function runPoleDrill(end){
 var up=(end!=='dn'), r=compute();
 var h='<div class="pm-eye">'+(up?'The upward cone':'The downward cone')+'</div>'
  +'<div class="ad-nm">'+(up?'Eight qualities at full expression':'The same eight, inverted')+'</div>'
  +'<p class="ad-p">'+(up
    ?'Each of the twelve is the maximum coherent expression of one human quality, at one moment when it was most needed. They are coordinates, not a summit. Nothing here is a person to become.'
    :'The same quality at maximum inversion. Same energy, opposite direction. These are behaviours, not entities, and they are named because the names have survived: the patterns are still running.')
  +'</p>';
 /* where this person sits on each axis, read rather than asked */
 h+='<div class="pm-eye">Where you sit on each</div><div class="ad-rows">';
 MIRROR.forEach(function(m){
  var grp=W.filter(function(n){return n.b===m.seat;});
  var load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
  var pos=mirrorAt(load,bandIg(m.seat));
  var c=seatCol(m.seat);
  h+='<button type="button" class="ad-r" data-mirror="'+m.k+'" title="'+esc(m.ask)+'">'
   +cr(m.seat,pos,{size:'xs',raw:String(pos),hot:false})
   +'<span>'+esc(up?m.up:m.dn)+'</span>'
   +'<em style="color:'+c+'">'+esc(m.q.toLowerCase())+'</em></button>';});
 h+='</div>';
 if(up){
  /* AND IT IS WRITTEN IN SENTENCE CASE. Title case was typed into this one
     string by hand, so it printed "The Eleven, And Where Each One Stood" and
     would have gone on doing it with the transform turned off. The source is
     sentence case everywhere and the sheet does the capitalising. */
  h+='<div class="pm-eye">'+NUMWORD(MASTERS.length)+', and where each one stood'
   +'</div><div class="ad-rows">';
  /* IF IT HAS A NAME IT HAS AN ICON. Ruled: "every figure gets an icon. Rumi,
     Buddha, Geryon, Moloch, all of them. Today they are names with marks on
     some and nothing on others." The sixteen mirror poles had theirs; these
     three lists were the ones with nothing. Names that appear on both reuse
     the mirror icon rather than getting a second drawing. */
  MASTERS.forEach(function(x){
   h+='<div class="ad-r static" title="'+esc(x.d)+'">'
    +'<span class="ad-k">'+adGl(x.ic)+esc(x.nm)+'</span>'
    +'<span class="ad-v">'+esc(x.was.toLowerCase())+'</span></div>';});
  /* THE COUNT IS READ, NEVER TYPED. This heading said "the twelve" while the
     list under it held eleven, from the moment Eckhart came out on a ruling.
     Three gates in this repository have already failed on a number somebody
     typed into a label and the product then grew past. */
  h+='</div><p class="ad-p">They appeared at moments of maximum collective decoherence. '
   +'That is the law of rhythm running at the scale of a civilisation rather than a person.</p>';
 } else {
  /* malignancy, not the outward share. See the note on darkRead: the two are
     different measurements and passing the second one meant this read false
     for every person in the roster, the heaviest case included. */
  /* NEITHER IS READ WHILE CQ IS STILL FILLING. CQ 0 with no law answered
     lit the deepest of the nine circles for somebody who had only not done
     the intake, and a null malignancy divided to 0 rather than to unread.

     AND THE DEPTH IS READ OFF EXPRESSION, NOT CQ, because this is where the
     clinician referral lives. The descent is decoherence, which is load, and
     since 25 September CQ is the laws alone and cannot see load at all:
     Gordon, the heaviest case in the roster with 22 addresses near
     paralysis, went from CQ 0.8 to 17.5 and the referral at under 11 went
     dark for him. Expression is CQ with the shadow's pull taken off, 7.9 for
     him, so the referral reaches the person it was written for. Whether the
     tier word names CQ or expression is the owner's open question 1; a
     safety referral is not a label, so it does not wait on that. */
  var dk=darkRead(r.malig===null?null:r.malig/100,r.EX), circ=r.complete?circleAt(r.EX):null;
  h+='<div class="pm-eye">The blueprint, where the downward cone ends</div><div class="ad-rows">';
  BLUEPRINT.forEach(function(x){
   h+='<div class="ad-r static" title="'+esc(x.d)+'"><span class="ad-k">'
    +adGl(x.ic)+esc(x.nm)+'</span></div>';});
  h+='</div>';
  h+='<div class="pm-eye">The descent, nine depths</div><div class="ad-rows">';
  CIRCLES.forEach(function(c){
   var here=circ&&circ.c===c.c;
   h+='<div class="ad-r static'+(here?' on':'')+'" title="'+esc(c.p+' '+c.at+'.')+'">'
    +'<span class="ad-k">'+esc(c.nm)+'</span>'
    +'<span class="ad-v">'+adGl(c.ic)+esc(c.by)+'</span></div>';});
  h+='</div>';
  h+='<p class="ad-p">Read as a taxonomy rather than a poem. Each depth is a behaviour at a '
   +'specific compression, and the floor is stasis rather than power: no flow, no movement, '
   +'nothing completing anywhere. The pit is a downward triangle and the frozen figure at the '
   +'point of it is expressing every depth above it outward at once.</p>';
  /* THE FOUR CORNERS. Two axes, and the fourth corner is the one this
     material has got wrong for a thousand years. Chaos is not malice. */
  h+='<div class="pm-eye">Organised or chaotic, benign or malignant</div>'
   +'<div class="ad-rows">'+GOVERN.map(function(gv){
     var on=r.gov&&r.gov.nm===gv.nm;
     return '<div class="ad-r static'+(on?' on':'')+'" title="'+esc(gv.d)+'">'
      +'<span class="ad-k">'+esc(gv.nm)+'</span>'
      +'<span class="ad-v">'+(gv.org?'organised':'chaotic')+', '
      +(gv.mal?'malignant':'benign')+'</span></div>';}).join('')+'</div>'
   /* NAMES A PATTERN, NEVER A PERSON. The corner describes the shape of what
      is firing. With nothing firing there is no shape and the surface says
      that rather than defaulting a quiet field to the top corner. */
   +'<p class="ad-p">Two measurements, not one twice. <b>Shape</b> is where what is running '
   +'points, at other people or at the person carrying it. <b>Control</b> is whether the will '
   +'is directing or the drag is. '
   +(r.gov
     ?('What is running here reads <b>'+esc(r.gov.nm.replace(/^The /,''))+'</b>: shape '
       +Math.round(r.outward*100)+', control '+Math.round((r.organized||0)*100)+'.')
     :'Nothing is firing that points either way, so there is no shape to read here.')
   +'</p>'
   +'<p class="ad-p">The devil is the ordinary case, not a rare one: resistance dominating, '
   +'aimed outward, and compounded into structure. It starts small, gets conditioned, and '
   +'becomes who we are. A demon is the same harm before it has compounded. Turned inward is '
   +'the same conditioning with the person carrying it as the target, and it has no figure '
   +'because history named outward harm and never named this. Loose charge aimed at nobody is '
   +'the storm, and calling that a demon is the oldest mistake in this material. Angel is not '
   +'a fifth shape. It is what is left when nothing is running.</p>';
  /* THE DARK READ. Only when both conditions hold, once, with the referral. */
  if(dk.dark){
   h+='<div class="pm-eye">Both at once</div><p class="ad-p">'+esc(dk.say)+'</p>'
    +'<div class="ad-rows">'+DESCENT.map(function(d){
      return '<div class="ad-r static'+(dk.step&&dk.step.nm===d.nm?' on':'')
       +'" title="'+esc(d.d)+'"><span class="ad-k">'+esc(d.nm)+'</span>'
       +'<span class="ad-v">'+esc(d.kind)+'</span></div>';}).join('')+'</div>';
   if(dk.refer)h+='<p class="ad-p"><b>'+esc(DESCENT_REFER)+'</b></p>';}
 }
 /* one row of doors, on BOTH ends of the cone, so the volume is reachable
    from the flat reading rather than only from a tab nobody has found. This
    sat inside the downward branch on its first write, so the upward roster
    had no way through to the thing it describes. */
 h+='<div class="ad-act">'
  +'<button class="btn pri" id="rdcone">Go to the compass</button>'
  +(up?'':'<button class="btn" id="rdsee">Start from a sentence</button>')
  +'</div>';
 rdShell(h);
 var cn=document.getElementById('rdcone');
 if(cn)cn.onclick=function(){rdClose();coneOpen();};
 var see=document.getElementById('rdsee');
 if(see)see.onclick=runRecogniseDrill;
 /* a row opens the axis, both poles and the question a practitioner asks */
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-mirror]').forEach(function(b){
  b.onclick=function(){runMirrorDrill(b.getAttribute('data-mirror'));};});}

/* ============================================================
   THE ENTRY FRAMEWORK, WHICH IS THE OWNER'S OWN.

   "When I first started getting into my limiting beliefs I didn't
   have a framework, because I didn't think of myself as bad. So I
   started looking at the seven deadly sins, Dante's Inferno, and
   the psychological behaviour description of the Inferno as a
   layer."

   That is the discovery problem this product has, solved once
   already by the person who has it. Nobody ticks a box that says
   narcissist. Everybody recognises a sentence about themselves.
   Nine sentences, plain, first person, no diagnosis in any of
   them, and each one routes to a seat that already has addresses
   at it.
   ============================================================ */
function runRecogniseDrill(){
 var h='<div class="pm-eye">Where to start</div>'
  +'<div class="ad-nm">Nine sentences</div>'
  +'<p class="ad-p">None of these is a diagnosis and none of them is about being a bad '
  +'person. They are descriptions of things that run. Read them and notice which ones you '
  +'recognise. The one you would rather skip is usually the one.</p>'
  +'<div class="ad-rows">';
 CIRCLES.forEach(function(c){
  h+='<button type="button" class="ad-r" data-circ="'+c.c+'" title="'+esc(c.p)+'">'
   +'<span>'+esc(c.see)+'</span>'
   +'<em>'+esc(c.sin||c.nm)+'</em></button>';});
 h+='</div><p class="ad-p">Each one has a body address behind it, which is where the work '
  +'happens. The name on the right is what people called the pattern for eight hundred years '
  +'before anybody measured it.</p>'
  +'<div class="ad-act"><button class="btn" id="rdage">None of these. Try by age</button></div>';
 rdShell(h);
 var ag=document.getElementById('rdage'); if(ag)ag.onclick=runAgeDrill;
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-circ]').forEach(function(b){
  b.onclick=function(){runCircleDrill(+b.getAttribute('data-circ'));};});}
/* ONE LABEL FOR ONE SLOT. The list of addresses belonging to whatever is on
   screen was called four things: "Addresses at this seat", "Its addresses",
   "The addresses there" and "Addresses here". One slot, four names, so a
   person re-parses the same row on every surface. It is "Addresses here"
   everywhere, and the held subset of it is "Held here".

   one depth, what it is, where it sits, and the way out of it */
function runCircleDrill(n){
 var c=CIRCLES.filter(function(x){return x.c===n;})[0]; if(!c)return;
 var seat=(c.at.match(/Crown|Sacral|Solar|Root|Third eye|Heart|Throat/i)||[''])[0];
 seat=seat?seat.replace(/^Third eye$/i,'3rd Eye'):'';
 seat=BANDS.indexOf(seat)>=0?seat:(BANDS.indexOf(seat.replace(/^\w/,function(m){return m.toUpperCase();}))>=0?seat:'');
 var h='<div class="pm-eye">Depth '+c.c+(c.sin?', '+esc(c.sin.toLowerCase()):'')+'</div>'
  +'<div class="ad-nm">'+esc(c.nm)+'</div>'
  +'<div class="ad-sub">'+esc(c.by)+'</div>'
  +'<div class="pm-eye">What you might recognise</div><p class="ad-p">'+esc(c.see)+'</p>'
  +'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(c.p)+'</p>'
  +'<div class="pm-eye">Where it sits</div><p class="ad-p">'+esc(c.at)+'.</p>';
 if(seat){
  var grp=W.filter(function(x){return x.b===seat;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,5);
  if(grp.length){
   h+='<div class="pm-eye">Addresses here</div><div class="ad-rows">'
    +grp.map(function(x){return addrRow(x);}).join('')+'</div>';}}
 h+='<p class="ad-p">The governor is a name for the pattern, not a person and not a thing '
  +'that exists. It is still recognisable because the pattern is still running.</p>';
 rdShell(h);}

/* ============================================================
   THE AVATAR, on screen.

   Two columns. Left is who you are becoming, right is the
   inversion of the same attribute in the person's own words. The
   right side goes to the resolver and comes back as a seat, and
   the seat has addresses with weight on them, which is what turns
   a value into something the release queue can aim at.

   The product never rules on whether an attribute is a real edge
   or a saboteur wearing a virtue. That is the owner's standing
   ruling and the monthly review exists because of it.
   ============================================================ */
/* ONE NAMED FIGURE'S ICON, AS MARKUP. currentColor, so it takes the colour of
   the row it sits in and can never disagree with the name beside it. Nothing
   when the figure has no icon, rather than an empty box. */
function adGl(d){
 if(!d)return '';
 return '<svg class="ad-gl" viewBox="0 0 24 24" aria-hidden="true">'
  +'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="1.7" '
  +'stroke-linecap="round" stroke-linejoin="round"/></svg>';}
/* A COUNT IN A HEADING IS WRITTEN OUT, AND IT IS READ RATHER THAN TYPED.
   "The twelve" sat above a list of eleven for as long as it took to notice,
   because the number was in the string. Sentence case headers spell a small
   number, which is the house style, so this spells it. */
const NUMWORDS=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight',
 'Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
 'Seventeen','Eighteen','Nineteen','Twenty'];
function NUMWORD(n){
 return 'The '+((NUMWORDS[n]||String(n)).toLowerCase());}
function avOf(){ return (CURP&&CURP.avatar)||avatarBlank(); }
function avRows(){
 var av=avOf();
 return (av.pairs||[]).map(function(pr){
  var seg=readSeat(pr.notbe);
  var load=0, ig=6;
  if(seg){var grp=W.filter(function(n){return n.b===seg;});
   load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
   ig=bandIg(seg);}
  return {pair:pr, gap:seg?avatarGap(pr,seg,load,ig):null};});}
/* the seat a sentence about a bad day resolves to. the story parser already
   does this work, so this asks it rather than owning a second lexicon. */
function readSeat(text){
 var p=parseStory(String(text||''));
 /* imprints, not hits. a hit carries a lowercase band name and no node, and
    reading BY[h.i] off it gave undefined for every sentence, so the resolver
    silently answered nothing for text it had in fact parsed. an imprint
    carries the seat already cased the way the rest of the product cases it. */
 if(!p||!p.imprints||!p.imprints.length)return null;
 var tally={};
 p.imprints.forEach(function(x){
  if(x&&x.band)tally[x.band]=(tally[x.band]||0)+(x.amt||1);});
 var best=null,bv=0;
 Object.keys(tally).forEach(function(b){if(tally[b]>bv){bv=tally[b];best=b;}});
 return best;}
function runAvatarDrill(){
 var av=avOf(), rows=avRows(), pg=avatarProgress(rows);
 var h='<div class="pm-eye">The avatar</div>'
  +'<div class="ad-nm">Who you are becoming</div>'
  +'<p class="ad-p">One side is who you are at your best. The other is who you are not, in '
  +'your own words. They are written as a pair, because a value has no address and a '
  +'sentence about a bad day does.</p>'
  +'<p class="ad-p">Nothing here is a diagnosis. This product does not rule on whether an '
  +'attribute is a real edge or a saboteur wearing a virtue. That depends on where you are, '
  +'and it is the thing you revise upward as you climb.</p>';
 if(rows.length){
  h+='<div class="pm-eye">What is in the way</div><div class="ad-rows">';
  rows.forEach(function(r,i){
   var g2=r.gap;
   h+='<button type="button" class="ad-r" data-avp="'+i+'">'
    +(g2?cr(g2.seat,g2.at,{size:'xs',raw:String(g2.at),hot:false}):'')
    +'<span>'+esc(r.pair.be)+'</span>'
    +'<em>'+(g2?(g2.clear?'clear':esc(String(g2.seat).toLowerCase())+', '+g2.load.toFixed(1))
      :'not resolved')+'</em></button>';});
  h+='</div>';
  if(pg)h+='<p class="ad-p"><b>'+pg.done+' of '+pg.total+'</b> clear at the address behind '
   +'them. Read from what you have actually cleared, not from what you wrote.</p>';
 } else {
  h+='<p class="ad-p">Nothing written yet. The journal asks for it in two questions: '
   +'describe yourself on your best day, not what you achieved but how you were. Then the '
   +'opposite.</p>';}
 if(av.built){
  var d=avatarDaysLeft(av);
  h+='<p class="ad-p">Reviewed monthly. '+(avatarDue(av)?'Due now.':d+' days to the next one.')
   +'</p>';}
 h+='<div class="ad-act">'
  +'<button class="btn pri" id="avpur">The purpose map</button>'
  +'</div>';
 rdShell(h);
 var pu=document.getElementById('avpur'); if(pu)pu.onclick=runPurposeDrill;
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-avp]').forEach(function(b){
  b.onclick=function(){runAvPair(+b.getAttribute('data-avp'));};});}
/* one attribute, both halves, and the addresses standing in the way of it */
function runAvPair(i){
 var rows=avRows(), r=rows[i]; if(!r)return;
 var g2=r.gap;
 var h='<div class="pm-eye">At your best</div>'
  +'<div class="ad-nm">'+esc(r.pair.be)+'</div>'
  +'<div class="pm-eye">And not</div><p class="ad-p">'+esc(r.pair.notbe)+'</p>';
 if(g2){
  h+='<div class="pm-eye">Where that sits</div>'
   +'<p class="ad-p">The '+String(g2.seat).toLowerCase()+', carrying <b>'
   +g2.load.toFixed(1)+'</b>. On the axis between the two poles of that seat you read <b>'
   +g2.at+'</b>.</p>';
  var grp=W.filter(function(n){return n.b===g2.seat;})
   .sort(function(a,b){return b.sq-a.sq;}).slice(0,5);
  if(grp.length)h+='<div class="pm-eye">What is in the way</div><div class="ad-rows">'
   +grp.map(function(n){return addrRow(n);}).join('')+'</div>';
  h+='<p class="ad-p">The right hand sentence steers the release, because that is what is '
   +'in the way. The left hand one steers the reframe, because that is what is being '
   +'installed. Never the other way round.</p>';
 } else {
  h+='<p class="ad-p">The resolver could not read a feeling out of the second sentence. '
   +'Say it again with one in.</p>';}
 h+='<div class="ad-act"><button class="btn" id="avback">All of them</button></div>';
 rdShell(h);
 var b=document.getElementById('avback'); if(b)b.onclick=runAvatarDrill;}

/* ============================================================
   THE PURPOSE MAP. Two overlapping triangles and a hexagon.
   Six values in, three readings out, and a person may type none
   of the three.
   ============================================================ */
function runPurposeDrill(){
 var pu=(CURP&&CURP.purpose)||purposeBlank();
 var rd=purposeRead(pu), bc=boundaryCount(pu);
 var h='<div class="pm-eye">The purpose map</div>'
  +'<div class="ad-nm">Two triangles and what they overlap</div>'
  +'<p class="ad-p">Meaning is the end point of expression. At the end of expression, '
  +'meaning creates purpose. So purpose is not entered. It is what is left standing at the '
  +'end of the other two.</p>'
  +'<div class="pm-eye">Upward, the higher purpose</div>'
  +'<p class="ad-p">Three values, the soul\u2019s. '+esc(PUR_SOUL)+'</p>'
  +'<div class="ad-rows">'+[0,1,2].map(function(i){
    return '<div class="ad-r static"><span class="ad-k">'+(i+1)+'</span>'
     +'<span>'+esc(pu.soul[i]||'not written')+'</span></div>';}).join('')+'</div>'
  +'<div class="pm-eye">Downward, the earthly purpose</div>'
  +'<p class="ad-p">Three more, the ego\u2019s. '+esc(PUR_EGO)+'</p>'
  +'<div class="ad-rows">'+[0,1,2].map(function(i){
    return '<div class="ad-r static"><span class="ad-k">'+(i+1)+'</span>'
     +'<span>'+esc(pu.ego[i]||'not written')+'</span></div>';}).join('')+'</div>';
 if(rd){
  h+='<div class="pm-eye">What motivates you in the spirit</div><p class="ad-p">'
   +esc(rd.higher)+'</p>'
   +'<div class="pm-eye">What drives you on the earth</div><p class="ad-p">'
   +esc(rd.earthly)+'</p>'
   +'<div class="pm-eye">And between them</div><p class="ad-p"><b>'+esc(rd.between)+'</b></p>';
 } else {
  h+='<p class="ad-p">Six values in and the three readings come out. Until then there is '
   +'nothing to derive.</p>';}
 h+='<div class="pm-eye">The boundary</div>'
  +'<p class="ad-p">Overlap the two triangles and the six sided shape is the boundary of '
  +'your behaviour. That is your containment. A mirror you hold up to yourself. Inside it is '
  +'yours to protect and outside it is choice.</p>'
  +'<div class="ad-rows">'+PUR_SIDES.map(function(sd){
    var n=((pu.sides&&pu.sides[sd])||[]).filter(function(x){return x&&String(x).trim();}).length;
    return '<div class="ad-r static'+(n>=PUR_PER_SIDE?' on':'')+'">'
     +'<span class="ad-k">'+esc(sd)+'</span>'
     +'<span class="ad-v">'+n+' of '+PUR_PER_SIDE+'</span></div>';}).join('')+'</div>'
  +'<p class="ad-p">'+bc.filled+' of '+bc.of+' written. Thirty is not a lot to ask of a '
  +'mirror you will hold for as long as this takes. A mirror half described shows half a '
  +'person.</p>'
  +'<div class="ad-act"><button class="btn" id="puback">The avatar</button></div>';
 rdShell(h);
 var b=document.getElementById('puback'); if(b)b.onclick=runAvatarDrill;}

/* ============================================================
   THE AGE LADDER, on screen.

   Sixteen years, one question each, and then a three question test
   that turns an answer into a finding. The order of the test is
   load bearing: defence, then cost, then care. Asking care first
   lets a person answer for the person they would like to be.
   ============================================================ */
var AGE_AT=null, AGE_ANS={};
function runAgeDrill(){
 var h='<div class="pm-eye">Another way in</div>'
  +'<div class="ad-nm">Three to eighteen</div>'
  +'<p class="ad-p">Not a memory exercise. A person who cannot think of anything they identify '
  +'with is not unusual, because an identification that is working does not feel like one. So '
  +'go year by year and look at what got picked up. Toys, games, characters, teams, machines, '
  +'sides taken in arguments that did not matter.</p>'
  +'<div class="pm-eye">How it was found</div><p class="ad-p">'+esc(AGE_WORKED)+'</p>'
  +'<div class="pm-eye">The mechanic</div><p class="ad-p"><b>The mind sticks to anything that '
  +'it defends. Once it is stuck, the bias is set.</b> So the question is never what you liked. '
  +'It is what you would still argue for, and whether you actually care.</p>'
  +'<div class="ad-rows">';
 AGES.forEach(function(x){
  var done=AGE_ANS[x.a];
  h+='<button type="button" class="ad-r'+(done?' on':'')+'" data-age="'+x.a+'" '
   +'title="'+esc(x.q)+'"><span class="ad-k">'+x.a+'</span>'
   +'<span>'+esc(x.k)+'</span>'
   +'<em>'+(done?esc(done.found?'a groove':'clear'):'')+'</em></button>';});
 h+='</div>';
 var found=Object.keys(AGE_ANS).filter(function(k){return AGE_ANS[k].found;});
 if(found.length)h+='<p class="ad-p"><b>'+found.length+'</b> position'
  +(found.length===1?'':'s')+' defended and not meant. Each one is a groove worn by arguing '
  +'for it, and a groove is releasable at the address it sits on.</p>';
 rdShell(h);
 var host=document.getElementById('rdrill');
 if(host)host.querySelectorAll('[data-age]').forEach(function(b){
  b.onclick=function(){runAgeYear(+b.getAttribute('data-age'));};});}
/* one year, the question, and the three that test the answer */
function runAgeYear(a){
 var x=AGES.filter(function(y){return y.a===a;})[0]; if(!x)return;
 AGE_AT=a;
 var st=AGE_ANS[a]||{defend:null,care:null};
 var h='<div class="pm-eye">Age '+a+', '+esc(x.k)+'</div>'
  +'<div class="ad-nm">'+esc(x.q)+'</div>'
  +'<p class="ad-p">Name it to yourself. Nothing is stored here, and nothing is scored.</p>'
  +'<div class="pm-eye">Now test it</div>';
 AGE_TEST.forEach(function(t){
  if(t.k==='cost')return;                       /* the middle one is to sit with, not to answer */
  var v=st[t.k];
  h+='<div class="ag-q"><span>'+esc(t.q)+'</span>'
   +'<span class="ag-b"><button type="button" class="btn'+(v===true?' pri':'')
   +'" data-ag="'+t.k+'" data-v="1">Yes</button>'
   +'<button type="button" class="btn'+(v===false?' pri':'')
   +'" data-ag="'+t.k+'" data-v="0">No</button></span></div>';});
 h+='<p class="ad-p">'+esc(AGE_TEST[1].q)+' Sit with that one rather than answering it.</p>';
 if(st.defend!==null&&st.care!==null){
  var f=ageFinding(st.defend,st.care);
  h+='<div class="pm-eye">'+(f.found?'A groove':'Not a groove')+'</div>'
   +'<p class="ad-p">'+esc(f.say)+'</p>';}
 h+='<div class="ad-act"><button class="btn" id="agback">All sixteen</button></div>';
 rdShell(h);
 var host=document.getElementById('rdrill'); if(!host)return;
 host.querySelectorAll('[data-ag]').forEach(function(b){
  b.onclick=function(){
   var k=b.getAttribute('data-ag'), v=b.getAttribute('data-v')==='1';
   var cur=AGE_ANS[a]||{defend:null,care:null};
   cur[k]=v;
   if(cur.defend!==null&&cur.care!==null)cur.found=ageFinding(cur.defend,cur.care).found;
   AGE_ANS[a]=cur; runAgeYear(a);};});
 var bk=document.getElementById('agback'); if(bk)bk.onclick=runAgeDrill;}

/* one axis, both ends, and the question that tells them apart */
function runMirrorDrill(k){
 var m=MIRROR.filter(function(x){return x.k===k;})[0]; if(!m)return;
 var grp=W.filter(function(n){return n.b===m.seat;});
 var load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
 var pos=mirrorAt(load,bandIg(m.seat)), c=seatCol(m.seat);
 rdShell('<div class="pm-eye">'+esc(m.q)+'</div>'
  +'<div class="ad-nm">'+esc(m.up)+' against '+esc(m.dn)+'</div>'
  +'<div class="ad-sub">at the '+String(m.seat).toLowerCase()+'</div>'
  +'<div class="pm-eye">At full expression</div><p class="ad-p">'+esc(m.upd)+'</p>'
  +'<div class="pm-eye">At full inversion</div><p class="ad-p">'+esc(m.dnd)+'</p>'
  +'<div class="pm-eye">The question that tells them apart</div>'
  +'<p class="ad-p"><b>'+esc(m.ask)+'</b></p>'
  +'<div class="pm-eye">Where you sit</div>'
  +'<div class="ad-rows"><div class="ad-r static">'
   +cr(m.seat,pos,{size:'sm',raw:String(pos),hot:false})
   +'<span class="ad-k">'+esc(m.dn)+' at nought, '+esc(m.up)+' at a hundred</span>'
   +'<span class="ad-v" style="color:'+c+'">'+pos+'</span></div></div>'
  +'<p class="ad-p">Read from what is held at the '+String(m.seat).toLowerCase()
  +' and the integrity measured there. Not asked, and not a verdict. Both ends are behaviours '
  +'and the axis is one you are on whether or not you look at it.</p>');}

/* the compass on the right of the stage. it was a picture with no door. */
function runCompassDrill(){
 var r=compute(), cq=Math.max(0,Math.min(100,r.CQ));
 /* the band formula stood here as a second copy of renderPol2's, kept only to
    print "the swing, 11 points". With the figure gone it had no reader, and a
    duplicated formula with no reader is the drift this file has been bitten
    by before. renderPol2 owns it, and it is the only one. */
 /* the tier table was a second copy of the one in the engine and could drift
    from it silently. It reads TIERDEF now, which is the only one. */
 var me=r.unread?null:TIER_BY[r.tier];
 var h='<div class="pm-eye">The compass</div><div class="ad-nm">'
  +(r.unread?'not read yet':'CQ '+Math.round(cq)+', '+tierSay(r).toLowerCase())+'</div>'
  +'<div class="pm-eye">How to read it</div><p class="ad-p">The line runs 0 at the base to 100 at the crown, and the word changes every ten points. '
  +'Above '+MEDIAN+' the field builds more than it costs. Below '+MEDIAN+' it costs more than it builds. '
  +MEDIAN_LO+' to '+MEDIAN_HI+' is the median range, where the reading crosses the line in both directions'
  +(medianRange(cq)&&!r.unread&&r.complete?', and that is where this one sits':'')+'. '
  /* "THE SWING, 11 POINTS" IS GONE FROM HERE TOO. Ruled as a class rather
     than as two strings: "do a sweep of text like that, 100 plus minus 12,
     swing 11, that shit has to all go." The quantity survives, as the pill
     renderPol2 now draws beside the marker, so this sentence points at a
     shape on the screen instead of restating it as a figure. */
  +'The marker is where coherence sits now, and the pill beside it is the range it moves in. Tight alignment leaves little room. A decohering field ranges wide.</p>'
  /* THE RULING. A label this product puts on a person carries a definition,
    the behaviour it produces, and the direction out of it. A word like Severe
    with nothing attached is a judgement. The same word with those three is a
    reading. */
 if(me)h+='<div class="pm-eye">What '+esc(me.nm.toLowerCase())+' means</div>'
  +'<p class="ad-p">'+esc(me.def)+'</p>'
  /* THE STATE THE BODY IS IN. The other three fields say what the field is
     doing, what the day feels like, and where it goes. None of them says
     what condition the hardware is in, which is the reading a person
     recognises first. */
  +(me.soma?'<div class="pm-eye">The state</div><p class="ad-p"><b>'
    +esc(me.state)+'.</b> '+esc(me.soma)+'</p>':'')
  +'<div class="pm-eye">How it shows up</div><p class="ad-p">'+esc(me.energy)+'</p>'
  +'<div class="pm-eye">Where it goes</div><p class="ad-p">'+esc(me.toward)+'</p>';
 h+='<div class="pm-eye">The whole scale</div><div class="ad-rows">'
  +TIERDEF.map(function(t){
    return '<div class="ad-r static'+(t.nm===r.tier&&!r.unread?' on':'')+'" title="'+esc(t.soma||t.def)+'">'
     /* ten bands, ten colours, so the ladder reads as a gradient a person
        can place themselves on rather than as ten identical rows. */
     +'<span class="ad-k" style="color:'+(TIERCOL[t.nm]||'var(--ink)')+'">'+esc(t.nm)
     +(t.state?'<em>'+esc(t.state)+'</em>':'')+'</span>'
     +'<span class="ad-v">'+tierRange(t)+'</span></div>';}).join('')
  +'</div>';
 rdShell(h);}

/* the matrix cell. the handshake lists this as never wired: either the cells
   drill to the addresses at that intersection, or they come out. */
function runCellDrill(c,rw){
 var D=DOMAINS[c], cf=CHILD[rw];
 var seg=W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===c&&n.cf===cf.nm;});
 var affine=(AFFIN[D.r]||[]).indexOf(cf.nm)>=0;
 var held=seg.filter(function(n){return n.sq>=4;});
 var h='<div class="pm-eye">Matrix cell</div>'
  +'<div class="ad-nm">'+D.nm+' × '+cf.nm+'</div>'
  +'<div class="ad-sub">'+D.r+' cluster, '+cf.addr.toLowerCase()+'</div>'
  +'<div class="pm-eye">What the crossing does</div><p class="ad-p">'
  +(seg.length
   ? 'This domain seats <b>'+seg.length+'</b> address'+(seg.length===1?'':'es')+' on the '
     +cf.nm.toLowerCase()+' axis, <b>'+held.length+'</b> of them held.'
     +(affine?' This is a <b>1.3× affinity pair</b>: running '+D.r+' makes you more '
       +'susceptible here, and that multiplier is where distortion comes from.'
       :' No affinity multiplier applies to this pair.')
   : 'No address sits at this crossing. '+D.nm+' does not seat the '+cf.nm.toLowerCase()
     +' axis, so the cell is structurally empty rather than merely clear.')+'</p>';
 if(seg.length)h+='<div class="pm-eye">Addresses here</div><div class="ad-rows">'
  +seg.slice().sort(function(a,b){return b.sq-a.sq;}).slice(0,8).map(addrRow).join('')+'</div>';
 rdShell(h);}

function runSpDrill(kind,val){
 var r=compute(), t='', nm=val, sub='', runs='', extra='';
 if(kind==='sign'){
  var z=null; ZSIGN.forEach(function(x){if(x[2]===val)z=x;});
  t='Zodiac sign'; sub=z?(z[3]+', '+z[4]):''; runs=SIGN_RUNS[val]||'';
  nm=(ZGLYPH[val]||'')+' '+val;
  var rootNow=(DOMAINS[S.doms[0]]||{}).r||'', maps=ELEM2ROOT[z?z[3]:''];
  extra=maps?('This element maps to the <b>'+maps+'</b> root. You currently run <b>'+rootNow
   +'</b>. '+(maps===rootNow?'They agree.':'They do not, which means something was installed '
   +'on top of the blueprint.')):'';
 } else if(kind==='chinese'){ t='Year animal'; runs=CH_RUNS[val]||''; sub='twelve year cycle';
 } else if(kind==='celem'){ t='Element'; runs=CE_RUNS[val]||''; sub='ten year stem cycle';
 } else if(kind==='lp'){
  t='Life path'; runs=LP_RUNS[+val]||''; sub='birth date, reduced';
  var archNow=(ARCH[r.pi]||{}).nm||'';
  extra='This path reads <b>'+(LP2ARCH[+val]||'unmapped')+'</b>. Your first archetype is <b>'
   +archNow+'</b>. '+(LP2ARCH[+val]===archNow?'They agree.':'They do not.');
 } else if(kind==='hd'){
  t='Design type'; runs=HD_RUNS[val]||''; sub='type';
  /* the comparison reads CQ against the median, which a CQ still filling
     cannot answer: it would call every Generator's field contracting */
  extra=!r.complete?'A '+val+'. Coherence is still filling, so the field has no direction to compare yet.'
   :'A '+val+' at CQ <b>'+Math.round(r.CQ)+'</b>. '
   +((val==='Generator'||val==='Manifesting Generator')===(r.CQ>=50)
     ?'Type and field point the same way.':'Type and field point differently.');
 } else if(kind==='auth'){
  t='Authority'; sub='where the decision lands';
  runs='the body signal this person is meant to decide from, rather than the mind';
 } else if(kind==='gk'){
  t='Gene key'; sub='gate and line';
  var top=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;})[0];
  var c2=top?(CHILD.filter(function(x){return x.nm===top.cf;})[0]||{}):{};
  runs='shadow to gift to siddhi, read one axis at a time';
  extra=top?('Your heaviest address is <b>'+top.k+'</b>, which sits on the <b>'+c2.nm
   +' toward '+(c2.opp||'')+'</b> axis. That is the shadow and the gift.')
   :'Nothing held, so no shadow is running to read.';}
 rdShell('<div class="pm-eye">'+t+'</div><div class="ad-nm">'+esc(nm)+'</div>'
  +(sub?'<div class="ad-sub">'+esc(sub)+'</div>':'')
  +'<div class="pm-eye">How it runs through you</div>'
  +'<p class="ad-p">'+(runs||'no behaviour on file')+'</p>'
  +(extra?'<div class="pm-eye">Against your field</div><p class="ad-p">'+extra+'</p>':''));}

/* ============================================================
   THE NUMEROLOGY DRILL. One number, what it was reduced from, and
   what it says against what the field is actually running. The
   summary prints six of these and every one of them opens.
   ============================================================ */
const NUM_OF={
 lifePath:'the birth date, every digit summed and reduced',
 expression:'every letter of the full name, each name reduced first',
 soul:'the vowels only, which is why it is the one nobody sees',
 personality:'the consonants only, which is what arrives before you speak',
 birthday:'the day of the month, unreduced, because a single day is a single gift',
 maturity:'life path plus expression, which is what the second half is for'};
const NUM_LABEL={lifePath:'Life path',expression:'Expression',soul:'Soul urge',
 personality:'Personality',birthday:'Birthday',maturity:'Maturity'};
function runNumDrill(k){
 var r=compute(), nm=(PEOPLE[S.who]||{}).nm||'You';
 var N=numerologyOf(nm,CURP); if(!N)return;
 var v=N[k]; if(v===undefined||v===null)return;
 var core=NUM_CORE[v]||{};
 var archNow=(ARCH[r.pi]||{}).nm||'';
 var h='<div class="pm-eye">Numerology</div>'
  +'<div class="ad-nm">'+esc(NUM_LABEL[k]||k)+' '+v+'</div>'
  +'<div class="ad-sub">'+esc(core.n||'')+'</div>'
  +'<div class="pm-eye">What it is</div><p class="ad-p">'+esc(NUM_OF[k]||'')+'.</p>'
  +'<div class="pm-eye">What it says</div><p class="ad-p">'+esc(numSays(k,v)||core.n||'')+'.</p>';
 if(NUM_MASTER.indexOf(v)>=0)
  h+='<p class="ad-p">This is a master number. It survives reduction at every step, '
   +'including inside a single name, and a master reduced is a master lost.</p>';
 if(k==='expression'&&N.split)
  h+='<p class="ad-p">Your names reduce to '+N.split.byPart+' and the flat sum of every '
   +'letter comes to '+N.split.flat+'. They disagree because one of your names carries a '
   +'master. The parts are the reading.</p>';
 if(k==='expression'&&N.debt)
  h+='<p class="ad-p">Karmic debt '+N.debt+'. '+esc(NUM_DEBT_SAYS[N.debt])+'</p>';
 if(k==='lifePath'&&typeof LP2ARCH!=='undefined')
  h+='<p class="ad-p">This path reads <b>'+esc(LP2ARCH[v]||'unmapped')+'</b>. Your first '
   +'archetype is <b>'+esc(archNow)+'</b>. '
   +(LP2ARCH[v]===archNow?'They agree.':'They do not.')+'</p>';
 h+='<div class="pm-eye">Every name</div><div class="ad-rows">'
  +N.each.map(function(x){
   return '<div class="ad-r static"><span class="ad-k">'+esc(x.nm)+'</span>'
    +'<span class="ad-m">'+x.role+', '+x.v+(x.debt?', debt '+x.debt:'')+'</span></div>';}).join('')
  +'</div>'
  +'<p class="ad-p">Cornerstone <b>'+esc(N.cornerstone)+'</b>, '+esc(N.cornerSays)
  +'. Capstone <b>'+esc(N.capstone)+'</b>, '+esc(N.capSays)+'.</p>';
 rdShell(h);}
