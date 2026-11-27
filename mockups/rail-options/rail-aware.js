/* The Awareness section, opened, and the right panel it now feeds. Round OT, items 6.
   WHAT CHANGED FROM THE BUILD
     the legend under the four roots is gone ("pale, something you picked is in here", panels.js, syncSoul writes it into #rootlegend).
       The state it keyed is drawn on the chip itself now: a root that holds one of your picks is lit in its own colour and carries a dot,
       so nothing needs a sentence.
     the top ones stand out. In each group the strongest are tiles, larger, with a lit ring, and everything else is a quiet small circle
       behind a fold. Blueprint shows the three the chosen blueprint reaches furthest. Primary shows the primary, Secondary the secondary.
     every group folds, and a folded group keeps its top ones in its own header, so folding never hides what you chose.
     a press on any item, Weaver or a domain or an archetype, puts that item in the right panel and nowhere else. The panel is Summary
       over Reading; Summary starts open and Reading starts closed, and a press on an item opens Summary if it was shut and leaves
       Reading as it was. */
(function(){
var RL=window.RL, R2=window.RD2, f1=RL.f1;
function circ(sz,col,v,ic,cls,extra){
 v=RL.clamp(v||0,0,1);
 return '<span class="awc '+(cls||'')+'" style="width:'+sz+'px;height:'+sz+'px;--c:'+col+';'+(extra||'')+'"><span class="disc" style="inset:'+(sz*.09).toFixed(1)+'px"></span>'
  +'<svg class="arc" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="2.4"/><circle class="val" cx="20" cy="20" r="18" fill="none" stroke="'+col+'" stroke-width="'+(sz>50?3:2.4)+'" stroke-linecap="round" pathLength="100" stroke-dasharray="'+f1(v*100)+' 100" transform="rotate(-90 20 20)"/></svg>'
  +'<svg viewBox="0 0 24 24" width="'+(sz*.46).toFixed(0)+'" height="'+(sz*.46).toFixed(0)+'" fill="none" stroke="'+col+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="position:relative" aria-hidden="true"><path d="'+ic+'"/></svg></span>';}
var CH='<svg class="chev" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg>';
function grp(key,title,summary,body,open){
 return '<section class="ag'+(open?' open':'')+'" data-g="'+key+'"><button type="button" class="agh" aria-expanded="'+!!open+'"><span class="agt">'+title+'</span><span class="ags">'+summary+'</span>'+CH+'</button>'
  +'<div class="agb">'+body+'</div></section>';}
function topN(vals,n){return vals.map(function(v,i){return [v,i];}).sort(function(a,b){return b[0]-a[0];}).slice(0,n).map(function(x){return x[1];});}
function hero(kind,item,v,rank,sel){
 return '<button type="button" class="hero r'+rank+(sel?' sel':'')+'" data-k="'+kind+'" title="'+item.nm+'. Press to show it in Summary."><span class="hc">'+circ(rank===0?60:48,item.col,v,item.ic,'on')+'</span><b>'+item.nm+'</b></button>';}
function rootChip(r,lit,sel){
 return '<button type="button" class="rc'+(lit?' lit':'')+(sel?' sel':'')+'" style="--c:'+r.col+'" title="'+r.nm+'. Holds '+r.holds.join(', ')+'. Press to show it in Summary."><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="'+r.col+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="'+r.glyph+'"/></svg><span>'+r.nm+'</span>'+(lit?'<i class="dot"></i>':'')+'</button>';}

function awareness(P,o){
 o=o||{}; var per=R2.per[P.key]||R2.per.marcus, ST=o.state||{}, sel=o.sel||'';
 var litRoots={}; per.doms.forEach(function(i){litRoots[R2.domains[i].r]=1;}); per.roots.forEach(function(r){litRoots[r]=1;});
 var h='<div class="aw2"><button type="button" class="lhd" style="width:100%" aria-expanded="true"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="3.6"/></svg><span>Awareness</span>'+CH.replace('chev','chev up')+'</button>';
 /* root domains */
 var rb='<div class="rcs">'+R2.roots.map(function(r){return rootChip(r,!!litRoots[r.nm],sel===r.nm);}).join('')+'</div>';
 h+=grp('root','Root domains','<span class="sec-n">'+R2.roots.filter(function(r){return litRoots[r.nm];}).map(function(r){return r.nm;}).join(', ')+'</span>',rb,ST.root!==false);
 /* blueprint */
 var top=topN(per.domV,3), hb='<div class="heros">'+top.map(function(i,k){return hero('dom',R2.domains[i],per.domV[i],k,sel===R2.domains[i].nm);}).join('')+'</div>';
 var rest=R2.domains.filter(function(D){return top.indexOf(D.i)<0;});
 hb+='<button type="button" class="more" aria-expanded="'+!!ST.allDom+'"><span>Other domains</span>'+CH+'</button><div class="grid'+(ST.allDom?' open':'')+'">'+rest.map(function(D){return circ(36,D.col,per.domV[D.i],D.ic,'dim');}).join('')+'</div>';
 h+=grp('dom','Blueprint',top.slice(0,3).map(function(i){return circ(30,R2.domains[i].col,per.domV[i],R2.domains[i].ic,'on');}).join(''),hb,ST.dom!==false);
 /* primary and secondary */
 [['pri','Primary',0],['sec','Secondary',1]].forEach(function(g){
  var ai=per.arcs[g[2]], A=R2.archs[ai], v=per.affV[ai];
  var hb2='<div class="heros one">'+hero('arch',A,v,0,sel===A.nm)+'</div>';
  var others=R2.archs.filter(function(X){return X.i!==ai;});
  hb2+='<button type="button" class="more" aria-expanded="false"><span>Other archetypes</span>'+CH+'</button><div class="grid">'+others.map(function(X){return circ(36,X.col,per.affV[X.i],X.ic,'dim');}).join('')+'</div>';
  h+=grp(g[0],g[1],circ(30,A.col,v,A.ic,'on')+'<span class="sec-n" style="margin-left:6px">'+A.nm+'</span>',hb2,ST[g[0]]===true);});
 return h+'</div>';}

/* the right panel: Summary over Reading. Summary starts open, Reading starts closed. */
function rightPanel(P,sel){
 var per=R2.per[P.key]||R2.per.marcus, item=null, kind='';
 R2.roots.forEach(function(r){if(r.nm===sel){item=r;kind='root';}});
 R2.domains.forEach(function(D){if(D.nm===sel){item=D;kind='dom';}});
 R2.archs.forEach(function(A){if(A.nm===sel){item=A;kind='arch';}});
 var body='';
 if(kind==='root'){
  body='<div class="sel-hd">'+'<span class="sel-g" style="--c:'+item.col+'"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="'+item.col+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="'+item.glyph+'"/></svg></span><div><div class="sel-t">'+item.nm+'</div><div class="sel-s">Root domain</div></div></div>'
   +'<p>Holds '+item.holds.slice(0,-1).join(', ')+' and '+item.holds[item.holds.length-1]+'.</p>'
   +'<p>Running it makes '+item.aff.map(function(a){return a.toLowerCase();}).join(' and ')+' land 1.3 times as heavy.</p>'
   +'<div class="sel-ds">'+item.holds.map(function(n){var D=R2.domains.filter(function(d){return d.nm===n;})[0]; return '<div class="sel-d">'+circ(40,D.col,per.domV[D.i],D.ic,'on')+'<span>'+n+'</span></div>';}).join('')+'</div>';}
 else if(item){body='<div class="sel-hd"><div><div class="sel-t">'+item.nm+'</div><div class="sel-s">'+(kind==='dom'?'Blueprint domain':'Archetype')+'</div></div></div>';}
 else body='<p class="sel-s">Press a root, a domain or an archetype in the left column and it opens here.</p>';
 return '<div class="rp"><section class="rs open"><button type="button" class="rsh" aria-expanded="true"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#7EB8D4" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.2"/></svg><b>Summary</b>'+CH.replace('chev','chev up')+'</button><div class="rsb">'+body+'</div></section>'
  +'<section class="rs"><button type="button" class="rsh" aria-expanded="false"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#7EB8D4" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2.4"/><path d="M8.6 9h6.8M8.6 13h6.8"/></svg><b>Reading</b>'+CH+'</button></section></div>';}

var st=document.createElement('style');
st.textContent='.aw2{margin-top:2px}.ag{border-top:1px solid var(--edge)}.agh{display:flex;align-items:center;gap:8px;width:100%;min-height:44px;padding:0 2px}'
 +'.agt{font-size:12px;font-weight:600;color:var(--mid);flex:none}.ags{display:flex;align-items:center;gap:0;flex:1;justify-content:flex-end;min-width:0}.ags .awc+.awc{margin-left:-6px}'
 +'.agh .chev{color:var(--dim);flex:none;transition:transform .22s var(--ease-out)}.ag.open>.agh .chev,.more[aria-expanded=true] .chev{transform:rotate(180deg)}.chev.up{transform:rotate(180deg)}'
 +'.agb{display:none;padding:2px 0 10px}.ag.open>.agb{display:block}.ag.open>.agh .ags{display:none}'
 +'.rcs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}'
 +'.rc{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:58px;border-radius:var(--r-xs);color:var(--dim);opacity:.62;box-shadow:inset 0 0 0 1px var(--edge)}'
 +'.rc span{font-size:11.5px;font-weight:600;color:var(--mid)}.rc.lit{opacity:1;background:color-mix(in srgb,var(--c) 14%,transparent);box-shadow:inset 0 0 0 1.5px var(--c)}.rc.lit span{color:var(--ink)}'
 +'.rc .dot{position:absolute;right:6px;top:6px;width:6px;height:6px;border-radius:50%;background:var(--c)}'
 +'.rc.sel{opacity:1;box-shadow:inset 0 0 0 2px #fff,0 0 0 3px rgba(126,184,212,.35)}.rc.sel:after{content:"";position:absolute;right:-1px;bottom:-1px;border:6px solid transparent;border-right-color:#7EB8D4;border-bottom-color:#7EB8D4;border-radius:0 0 8px 0}'
 +'.heros{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:4px;align-items:end}.heros.one{grid-template-columns:1fr}'
 +'.hero{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 2px 4px;border-radius:var(--r-xs);min-height:92px;justify-content:flex-end}.hero:hover{background:rgba(255,255,255,.04)}'
 +'.hero b{font-size:12px;font-weight:600;color:var(--ink);text-align:center;line-height:1.2}.hero.r0 b{font-size:13px}'
 +'.hero .awc{filter:drop-shadow(0 0 7px color-mix(in srgb,var(--c) 55%,transparent))}.hero.sel{background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1.5px #fff}'
 +'.heros.one{justify-items:start}.heros.one .hero{flex-direction:row;gap:10px;width:100%;justify-content:flex-start;padding:6px 8px}'
 +'.more{display:flex;align-items:center;width:100%;min-height:44px;font-size:11.5px;color:var(--dim);padding:0 2px;gap:6px}.more span{flex:1}.more .chev{width:18px;height:18px;transition:transform .22s var(--ease-out)}'
 +'.grid{display:none;grid-template-columns:repeat(6,1fr);gap:2px;justify-items:center}.grid.open{display:grid}'
 +'.awc.dim{opacity:.5}.awc.dim:hover{opacity:.9}'
 /* right panel */
 +'.rpbox{position:absolute;left:1254px;top:121px;width:336px;height:869px;background:var(--panel);border:1px solid var(--edge);border-radius:var(--r);box-shadow:0 12px 34px rgba(0,0,0,.34);padding:16px 18px;overflow:hidden}'
 +'.rs{border-radius:var(--r-s);margin-bottom:10px;background:rgba(126,184,212,.06);box-shadow:inset 0 0 0 1px rgba(126,184,212,.24)}.rsh{display:flex;align-items:center;gap:9px;width:100%;height:44px;padding:0 4px 0 12px}.rsh b{flex:1;font-size:12px;font-weight:600}.rsh .ic{width:18px;height:18px}.rsh .chev{color:var(--mid)}'
 +'.rsb{display:none;padding:2px 14px 16px}.rs.open .rsb{display:block}.rsb p{margin:8px 0;font-size:14px;line-height:1.5;color:var(--mid);max-width:34em}.sel-hd{display:flex;align-items:center;gap:12px;margin:6px 0 8px}.sel-g{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 2px var(--c);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.07),rgba(9,10,14,.55))}'
 +'.sel-t{font-size:22px;font-weight:600;color:var(--ink);line-height:1.15}.sel-s{font-size:12px;color:var(--dim)}.sel-ds{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:12px}.sel-d{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;color:var(--mid);text-align:center;line-height:1.2}';
document.head.appendChild(st);
window.RA={awareness:awareness,rightPanel:rightPanel,circ:circ};
})();
