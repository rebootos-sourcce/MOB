
/* ============================================================
   THE ENERGY SHELF LEFT THE RAIL, 18 November. renderShelf drew the Flow ring,
   the heaviest seat and the seven seat rows into #eshelf, the Flow section
   under Selection on the right rail. His words: "Everything beneath
   selection, including flow, including seats... like it's all repeat." It is
   removed with its section and its two callers in ui/map.js. The flow sentence
   is on Summary's reading, the seats' held counts are on Analytics' The Seven
   Seats, and the heaviest seats are on Summary's In the body. What stays in
   this file is what answers a press on the figure: pmAnswer and the two drills
   it opens.
   ============================================================ */
/* ============================================================
   BODY ANSWERS WHERE EVERYTHING ELSE ANSWERS.

   One press, one door, and every kind goes to the drill that already exists
   for it, which is the rule the codex already keeps in kbOpen. A saboteur,
   a complex, a hyper-complex and a super-complex are the same objects the
   Field and the codex open with runDrill, so they open with runDrill here:
   the shelf had a second, shorter renderer for them, which is two places for
   one reading to disagree, and it printed the clinical correspondence that
   ui.js keeps off this person's screen by name. The Hyper rows above still
   print it on their sub-line, "bipolar · ADHD" on Gordon, which is a
   separate defect and is not widened into this one. A mask opens the
   codex's own mask entry, the only door a mask has, because it is a shape
   over seats and not a set of addresses.

   A seat read for flow and a pain region have no door anywhere else. Their
   readings are the two the shelf printed, moved rather than rewritten, so
   the numbers are the ones a person was already shown.

   A press that puts the pick down puts the answer down with it. The
   render comes after the drill, the order the Field's presses use.

   inRail is true for the shelf's own rows, which sit in the same rail as
   the answer, so on a phone the answer is still brought into view for
   them. See the phone half of the test in rdOpen. The flag is dropped in a
   finally, because a drill that threw would otherwise leave it set for the
   next press, which might be one made on the stage. */
function pmAnswer(pick,pain,inRail){
 if(!pick){rdClose();return;}
 RD_INRAIL=!!inRail;
 try{
  if(pain)runPainDrill(pick);
  else if(typeof pick==='string')runSeatFlowDrill(pick);
  else if(pick.kind)runDrill(pick);
  else {var mk=MASKS.filter(function(m){return m.nm===pick.nm;})[0];
   if(mk)kbOpen({k:'mask',o:mk});}
 }finally{RD_INRAIL=false;}
 render();}
/* one seat, read for flow: what passes, what is held, which laws sit here */
function runSeatFlowDrill(k){
 var seats=flSeats();
 var sd=FLOWSEAT.filter(function(p){return p.k===k;})[0];
 var ss=seats.filter(function(x){return x.p.k===k;})[0],bnd=K2B[k];
 if(!sd||!ss)return;
 insDoor('seat',bnd);
 var seg=W.filter(function(n){return n.b===bnd;}).sort(function(a,b){return b.sq-a.sq;});
 var lws=SI.filter(function(l){return l.b===bnd;});
 /* AX8, closed 2 October. The eyebrow printed "Muladhara · 396 Hz · source
    502" and the line under the plexus printed "vritti L1 to L4". Every term
    is now a carrier of its sentence in engine/data/gloss.js, the house way
    (unp, ui/component.js), and the level is printed as its own sentence,
    which names it. Vritti is gone: the codex makes it the wave around a
    nerve, never a spine level. The reason is written at the table. The Hz
    wears its own seat's colour, as ruled 25 September (TASKS.md AX8). */
 var h='<div class="pm-eye">'+unp(sd.n,sd.sk,'yoga')+' · <span style="color:'+seatCol(bnd)+'">'
  +unp('seat tone',sd.hz+' Hz')+'</span>'
  +' · '+unp('codex page','codex page '+sd.src)+'</div>'
  +'<div class="pm-dn">'+unp(sd.n,sd.n,'seat')+'</div><div class="pm-dm"><b>'+unp('plexus',sd.nv)+'</b><br>'
  +unpSay('level:'+sd.k)
  +'<br>Seated at '+unp('spot:'+sd.k,sd.seat)+'.</div>'
  /* the Flow circle's step, KV, so the answer to a pressed seat says the
     same word the figure prints beside it; a phone has no lane for the word */
  +'<div class="pm-grid"><span>flow</span><b>'+bmFlowStep(ss.pass)+'</b>'
  +'<span>passes</span><b>'+(ss.hot?fmtPct('pass',ss.pass):'\u2013')+'</b>'
  +'<span>held</span><b>'+(ss.hot||'\u2013')+'</b>'
  +'<span>mean SQ</span><b>'+(ss.mean>0?fmtPct('weight',ss.mean):'\u2013')+'</b>'
  +'<span>integrity</span><b>'+(unreadNow()?'\u2013':fmtPct('integrity',bandIg(bnd)))+'</b></div>'
  /* plain, because six words is a sentence and not a label (shell/head.html,
     the capitalize rule), so it keeps the case it is written in */
  +'<div class="pm-eye plain" style="margin-top:12px">Laws of Moral Integrity seated here</div><div class="pm-chips">'
  +lws.map(function(l){return '<span class="pm-chip" style="opacity:'
    +(0.4+S.law[l.nm]/10*0.6).toFixed(2)+'">'+l.nm+(unreadNow()?'':' '+fmtPct('law',S.law[l.nm]))+'</span>';}).join('')+'</div>'
  +'<div class="pm-eye" style="margin-top:12px">Addresses</div><div class="pm-rows">';
 seg.slice(0,8).forEach(function(n){
  var opp3=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
  /* the address number is the data model read out loud, CO-15, and the row
     reads as a name now */
  h+='<div class="pm-r"><span>'+esc(n.k)+'</span><em>toward '
   +esc(opp3||'no pole')+(n.pole>=4?', installed':'')+'</em><b>'+(n.sq>0?fmtPct('weight',n.sq):'\u2013')+'</b></div>';});
 h+='</div>';
 rdShell(h);}
/* one painted region: what it presents as, and what is heaviest under it */
function runPainDrill(k){
 var rg=PAINREG.filter(function(p){return p.k===k;})[0]; if(!rg)return;
 var rn=W.filter(function(n){return rg.bands.indexOf(n.b)>=0&&n.sq>=LOADED+1;})
  .sort(function(a,b){return b.sq-a.sq;});
 var h='<div class="pm-eye">Pain region</div><div class="pm-dn">'+rg.nm+'</div>'
  +'<div class="pm-dm">'+rg.bands.join(' + ')+' · '+rn.length+' addresses above the line</div>'
  +'<div class="pm-eye" style="margin-top:12px">Commonly presents as</div>'
  +'<div class="pm-dm" style="color:var(--mid)">'+rg.common+'</div>'
  +'<div class="pm-eye" style="margin-top:12px">The pattern under it</div>'
  +'<div class="pm-pat">'+rg.pattern+'</div>';
 if(rn.length){h+='<div class="pm-eye" style="margin-top:12px">Heaviest here</div><div class="pm-rows">';
  rn.slice(0,6).forEach(function(n){
   var opp=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
   h+='<div class="pm-r"><span>'+esc(n.k)+'</span><em>toward '+esc(opp||'no pole')
    +'</em><b>'+fmtPct('weight',n.sq)+'</b></div>';});
  h+='</div>';}
 rdShell(h);}
