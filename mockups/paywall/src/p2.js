/* ============================================================
   P2, ICON GRID THEN PLANS. THE LEAD. Closest to his phone example: the
   six real layers as ring marks with one word and a short meaning, then
   three plan chips, then one big button.

   EMMY'S CALLS, ALL OF THEM, are this version:
   1  one button, and its words name the card: "Start tier one, $12 a month"
   2  the door picks: the cheapest tier that opens what was touched, never
      higher; nothing when the person came from Billing, and then a plain
      line "Pick a tier" where the button would be, never a dead button
   3  any picked card is the same one flat colour, so colour never ranks a
      tier, with a ring check beside it so colour is not the only sign
   6  no tier four, no Free row, no "Your tier", the refund line off
   Picking a card fills, flat, the marks of what it opens. Nothing glows.
   ============================================================ */
function picked(){
 const p=STATE.pick!==null?STATE.pick:DOOR;
 return p&&RANK[p]>RANK[ON]?p:null;}
function cellHtml(g,pk){
 const seen=seesNow(g.k), opens=!seen&&pk&&RANK[pk]>=RANK[g.need];
 const tag=seen?W.seen:TIER(g.need).nm;
 return '<li class="cell'+(opens?' opens':'')+(seen?' seen':'')+'">'
  +'<span class="disc">'+mark(g.k,innerWidth>760?34:30,!seen&&!opens)+'</span>'
  +'<b>'+WORD[g.k]+'</b><span class="m">'+MEAN[g.k]+'</span><span class="tg">'+tag+'</span></li>';}
function chipHtml(t,pk){
 const now=ON===t.k, on=pk===t.k;
 if(now)return '<div class="chip now"><span class="cn">'+t.nm+'</span><span class="prw"><span class="pr">'+price(t)+'</span><span class="per">'+W.per+'</span></span><span class="ln">'+W.onThis+'</span></div>';
 return '<button type="button" class="chip'+(on?' on':'')+'" role="radio" aria-checked="'+on+'" data-act="pick" data-t="'+t.k+'">'
  +(on?pickSvg(true):'')+'<span class="cn">'+t.nm+'</span><span class="prw"><span class="pr">'+price(t)+'</span><span class="per">'+W.per+'</span></span>'
  +'<span class="ln">'+W.grant(t)+'</span></button>';}
function actHtml(pk){
 if(S==='closed')return '<div class="shut">'+soonSvg+'<span>'+W.soonGo+'</span></div>';
 if(!pk)return '<p class="pickline">'+W.pickFirst+'</p>';
 const t=TIER(pk);
 return '<button class="go" type="button" data-act="buy" data-t="'+t.k+'">'+W.start(t)+'</button>';}
function render(){
 const pk=picked();
 const step2=!SIGNED&&STATE.go;
 const chosen=step2?TIER(pk||'one'):null;
 return '<div class="sheet p2" role="dialog" aria-modal="true" aria-labelledby="t1">'+xBtn()
  +'<header class="hd"><h1 class="t1" id="t1">'+W.title+'</h1>'+ledeP()+'</header>'
  +(step2
   ?'<div class="step2"><div class="chip on one">'+pickSvg(true)+'<span class="cn">'+chosen.nm+'</span><span class="prw"><span class="pr">'+price(chosen)+'</span><span class="per">'+W.per+'</span></span><span class="ln">'+W.grant(chosen)+'</span></div>'+acctHtml(chosen)+'</div>'
   :'<ul class="grid" aria-label="What a tier opens">'+ROWS.map(g=>cellHtml(g,pk)).join('')+'</ul>'
    +'<div class="chips" role="radiogroup" aria-label="Tiers">'+TIERS.map(t=>chipHtml(t,pk)).join('')+'</div>'
    +glossP()+'<div class="act">'+actHtml(pk)+'</div>')
  +footHtml()+'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}
