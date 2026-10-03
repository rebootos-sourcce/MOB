/* ============================================================
   BUILD THE PROTOTYPE. info.src.html + the real tip block + the real tip
   module -> info.html.

   It exists so the page and the shipped component cannot drift, and so the
   two changed lines are a named diff rather than a hand edit. It asserts on
   both replacement targets, so if tip.js moves the build fails loudly
   instead of producing a page that looks right and is stale.

     node proto/info/build.js
   ============================================================ */
const fs=require('fs'), path=require('path');
const D=__dirname, P=path.resolve(D,'..','tip');
const page0=fs.readFileSync(path.join(D,'info.src.html'),'utf8');
const tip=fs.readFileSync(path.join(P,'tip.html'),'utf8').split('\n');

/* THE TOKEN BLOCK, BY ITS OWN BOUNDARIES AND NOT BY LINE NUMBER. The first
   cut took the slice from the <style> tag inclusive and inlined a second
   <style> inside this page's own. Every token in the first :root then
   resolved to nothing: --tap came back empty, min-height:var(--tap) was
   ignored, and nineteen controls sat under the 44 pixel floor while the page
   looked correct. That is the silent var() failure DESIGN.md law 7 names,
   caused by a build step rather than by a missing declaration. */
const a=tip.findIndex(l=>l.trim().startsWith('/* ---- tokens'));
const b=tip.findIndex((l,i)=>i>a&&l.trim().startsWith('/* ====')&&/THE TIP\./.test(tip[i+1]||''));
if(a<0||b<0)throw new Error('token block boundaries not found in proto/tip/tip.html');
const tokens=tip.slice(a,b).join('\n');
if(/<style|<\/style/.test(tokens))throw new Error('token slice carries a style tag');
if(!/--tap:\s*44px/.test(tokens))throw new Error('token slice lost --tap');

const css=fs.readFileSync(path.join(P,'tip.css'),'utf8');
let js=fs.readFileSync(path.join(P,'tip.js'),'utf8');

/* ---- the two lines, and only the two lines ---- */
const OLD_CARRIER=` function carrier(t){
  return t&&t.closest?t.closest('[data-tip],[data-tip-t]'):null;}`;
const NEW_CARRIER=` /* LINE ONE OF THE SYSTEM. A carrier may name itself instead of carrying
    prose. [data-gloss] joins the selector and nothing else changes.

    Measured on the live build, and this is why it matters: with the selector
    as it was, the title fallback in read() below was unreachable. A
    title-only element was never recognised as a carrier, so the migration's
    claim that landing the module makes all 195 title definitions reachable
    is false as landed. Four carriers in the whole product open a panel. */
 function carrier(t){
  return t&&t.closest?t.closest('[data-gloss],[data-tip],[data-tip-t]'):null;}`;
const OLD_READ=` function read(e){
  var b=e.getAttribute('data-tip');
  if(b==null)b=e.getAttribute('title');`;
const NEW_READ=` function read(e){
  /* LINE TWO OF THE SYSTEM. One lookup, and it is the only lookup. A name
     resolves to its definition here and nowhere else, so a renderer can
     never hold a second copy of a sentence and the two can never drift. */
  var gk=e.getAttribute('data-gloss');
  if(gk&&typeof TIP==='object'&&TIP.gloss){
   var g=TIP.gloss(gk);
   if(g)return {t:g.t, k:g.kind||'', a:g.row?'Press to read it':'',
     b:g.short||g.d, n:g.n||[],
     c:(getComputedStyle(e).getPropertyValue('--c')||'').trim()};}
  var b=e.getAttribute('data-tip');
  if(b==null)b=e.getAttribute('title');`;
for(const [o,n] of [[OLD_CARRIER,NEW_CARRIER],[OLD_READ,NEW_READ]]){
 if(js.indexOf(o)<0)throw new Error('tip.js has moved, this target is gone:\n'+o);
 js=js.replace(o,n);}

const out=page0.replace('/*@TOKENS@*/',tokens).replace('/*@TIPCSS@*/',css).replace('/*@TIPJS@*/',js);
if(/@TOKENS@|@TIPCSS@|@TIPJS@/.test(out))throw new Error('a slot was not filled');
fs.writeFileSync(path.join(D,'info.html'),out);
console.log('proto/info/info.html  '+(out.length/1024).toFixed(1)+'kb');
