/* THE SEED EVERY BROWSER GATE USES, so the hundreds of checks written against
   the full reading keep measuring the full reading.

   The tier ruling of 1 October put the chain (saboteurs, complexes, hyper
   complexes, character), the Compass's Registers and the Character page's masks
   behind a plan. Every persona the gates load is a free record, so without
   this every check that presses a saboteur layer, opens Character or reads the
   Running list would be measuring a lock panel and failing for that reason,
   which is the gate measuring nothing rather than the product breaking.

   ui/lock.js reads window.SIGHT_PLAN once at load and uses it in place of the
   record's own plan for sight and for nothing else: the allowance, the tiers
   page and the Billing section still read CURP.plan, so the billing checks
   are unchanged. The lock's own gate sets it back to null, which is how it
   measures a lock. It is a seam for a harness and said so in ui/lock.js. */
/* THE LEFT COLUMN SEED TOUCHES THE STORE WHEN THE PAGE DOES, AND NOT BEFORE.
   17 October. It was `localStorage.getItem('lcol')` at document start, the
   first instant an init script runs, and that is the one moment Chromium can
   refuse to connect a page to its store and say nothing. The page's first
   touch of localStorage asks the browser for the store, naming the frame; if
   that request reaches the browser before the browser has taken the commit of
   the new document, the frame still has the blank page's storage key, the two
   do not match, and the browser drops the request
   (content/browser/dom_storage/dom_storage_context_wrapper.cc, IsRequestValid:
   "it's possible this is the result of a race condition between committing
   the new document and binding the DOM Storage. For now, we'll just fail to
   bind."). The page is not told. Its reads and writes go to its own copy, read
   back true inside the page, and reach nothing: a second page, a third page
   and the reload all see the store as it was before the page opened.

   That is the failure called a flake on three heads in one day: "the tone
   switch had not left the page before the reload within 20000 ms", then
   "remembered across a reload" off, then bedOnWait timing out on a switch
   that was never on. Measured under four busy loops with tools/reloadrace:
   the page that lost had written source.profiles 33 s before the check and
   no other page ever saw a byte of it, and a fresh key written at the miss did
   not arrive in 5 s, so it was never late, it was never connected. The
   product's own first touch is at the foot of a 5 MB document, after every
   module has parsed and run, which is long after the browser has the commit;
   only a script injected at document start lands in the window.

   So the seed wraps the global's localStorage accessor and seeds at the
   page's own first touch, through the real accessor, which it puts back
   first. The store is asked for at exactly the moment it would be asked for
   with no seed at all, and lcol is in it before the page reads anything. The
   rule is the same as before: only a store with no lcol, never on #landing. */
const LCOL_SEED=`(function(){
 var d=Object.getOwnPropertyDescriptor(window,'localStorage');
 if(!d||!d.get||!d.configurable){ window.__lcolSeed='refused: no configurable accessor'; return; }
 Object.defineProperty(window,'localStorage',{configurable:true,enumerable:d.enumerable,
  get:function(){
   Object.defineProperty(window,'localStorage',d);
   var s=d.get.call(window);
   try{ if(!/landing/.test(location.hash)&&s.getItem('lcol')===null)s.setItem('lcol','open');
    window.__lcolSeed='seeded at first touch'; }catch(e){ window.__lcolSeed='threw '+e.name; }
   return s;},
  set:d.set});
 window.__lcolSeed='waiting';
})();`;
module.exports={
 FULL_SIGHT:"window.SIGHT_PLAN={tier:'four',status:'active'};",
 LCOL_SEED};
