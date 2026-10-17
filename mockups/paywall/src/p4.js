/* ============================================================
   P4, ONE PLAN, ONE SENTENCE. The most restrained: the layer the person
   touched, what it is in one line, and the one tier that opens it as a
   single large flat card with one button. "See all plans" opens the
   other two in place. The shortest path there is: touch, start, pay.

   THE TWO TENSIONS: one button naming the card, and the door picks
   (Emmy's calls 1 and 2), as p2. Came from Billing with nothing touched,
   the list is open and nothing is picked, with "Pick a tier" where the
   button would be.

   THE ONE BEND: the headline is the layer's own name, not Emmy's title,
   because in this composition the thing touched is the whole message.
   ============================================================ */
function picked(){
 const p=STATE.pick!==null?STATE.pick:DOOR;
 return p&&RANK[p]>RANK[ON]?p:null;}
function rowHtml(t,pk){
 const now=ON===t.k,on=pk===t.k;
 const inner='<span class="rn"><span class="cn">'+t.nm+'</span><span class="ln">'+(now?W.onThis:W.grant(t))+'</span>'
  +'<span class="rings">'+t.sees.map(k=>icon(k)).join('')+'</span></span>'
  +'<span class="prw">'+price(t)+'<span class="per">'+W.per+'</span></span>'+(on?pickSvg(true):'<span class="pm0"></span>');
 if(now)return '<div class="row now">'+inner+'</div>';
 return '<button type="button" class="row'+(on?' on':'')+'" role="radio" aria-checked="'+on+'" data-act="pick" data-t="'+t.k+'">'+inner+'</button>';}
function actHtml(pk){
 if(S==='closed')return '<div class="shut">'+soonSvg+'<span>'+W.soonGo+'</span></div>';
 if(!pk)return '<p class="pickline">'+W.pickFirst+'</p>';
 return '<button class="go" type="button" data-act="buy" data-t="'+pk+'">'+W.start(TIER(pk))+'</button>';}
function render(){
 const pk=picked();
 const all=STATE.all||!TOUCHED;
 const L=TOUCHED||ROWS.filter(g=>!seesNow(g.k))[0];
 const step2=!SIGNED&&STATE.go;
 const one=TIER(step2?(pk||'one'):(pk||L.need));
 return '<div class="sheet p4" role="dialog" aria-modal="true" aria-labelledby="t1">'+xBtn()
  +'<div class="lay">'+(TOUCHED?'<span class="disc">'+mark(L.k,44,!seesNow(L.k))+'</span>':'')
  +'<h1 class="t1" id="t1">'+(TOUCHED?WORD[L.k]:W.title)+'</h1>'
  +'<p class="mean">'+(TOUCHED?MEAN[L.k]+' '+TIER(L.need).nm+' opens it.':'')+'</p>'+ledeP()+'</div>'
  +(step2
   ?'<div class="big on">'+pickSvg(true)+'<span class="cn">'+one.nm+'</span><span class="prw">'+price(one)+'<span class="per">'+W.per+'</span></span><span class="ln">'+W.grant(one)+'</span></div>'+acctHtml(one)
   :(all
    ?'<div class="rows" role="radiogroup" aria-label="Tiers">'+TIERS.map(t=>rowHtml(t,pk)).join('')+'</div>'
    :'<div class="big on">'+pickSvg(true)+'<span class="cn">'+one.nm+'</span><span class="prw">'+price(one)+'<span class="per">'+W.per+'</span></span>'
     +'<span class="ln">'+W.grant(one)+'</span><span class="rings" role="img" aria-label="Opens '+one.sees.map(k=>ROW(k).nm).join(', ')+'">'+one.sees.map(k=>icon(k)).join('')+'</span></div>')
   +glossP()+'<div class="act">'+actHtml(all?pk:one.k)+'</div>'
   +(TOUCHED?'<button type="button" class="more" data-act="all">'+(all?W.seeOne:W.seeAll)+'</button>':''))
  +footHtml()+'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}
