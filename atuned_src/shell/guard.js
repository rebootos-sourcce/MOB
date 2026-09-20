/* ============================================================
   THE BOOT GUARD. First thing in the script, before any data.

   The owner reported a build where the top navigation was gone, the centre
   did not render, and the left rail was there. That is the exact signature of
   a script that started and then threw: the rail is static markup in the
   document, and the tab bar and every surface are built by code.

   It could not be reproduced here. Seven viewport sizes, five shapes of
   stored profile including garbage, and scripts disabled: all of them either
   boot correctly or show the noscript notice. So the cause is something about
   his machine that this container does not have, and guessing at it is how
   two hours get spent on the wrong thing.

   What is wrong regardless of the cause is that the failure was SILENT. A
   half built shell looks like a product with missing features rather than
   like a crash, and a person cannot report what they cannot see. Every write
   that can fail reports through status(); a boot that fails has to report
   too, and it cannot use status() because status() may not exist yet.

   So: catch the first error, show it, and say what to send back. The message
   is plain DOM built by hand, with no dependency on anything this file loads
   after it, because everything after it is what might be broken.
   ============================================================ */
(function(){
 var BOOTED=false, SHOWN=false;
 /* the app calls this at the end of its own init. anything that stops the
    script reaching that line leaves BOOTED false. */
 window.__bootOk=function(){BOOTED=true;};
 function show(what,where){
  if(SHOWN)return; SHOWN=true;
  try{
   var d=document.createElement('div');
   d.setAttribute('role','alert');
   d.style.cssText='position:fixed;inset:0;z-index:99999;background:#0E0E0F;'
    +'color:#E6E7EA;font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;'
    +'display:flex;align-items:center;justify-content:center;padding:32px;'
    +'-webkit-font-smoothing:antialiased';
   var box=document.createElement('div');
   box.style.cssText='max-width:62ch';
   var h=document.createElement('h1');
   h.textContent='This build stopped while it was starting up.';
   h.style.cssText='font-size:22px;margin:0 0 10px;font-weight:600;letter-spacing:-.01em';
   var p1=document.createElement('p');
   p1.textContent='The instrument is built in the browser, so when the script '
    +'stops early you are left looking at the frame: the left rail is in the '
    +'document, and the navigation and every surface are not. Nothing you have '
    +'entered is lost. It is still in this browser.';
   p1.style.cssText='margin:0 0 14px;color:#C9CBD2';
   var p2=document.createElement('p');
   p2.textContent='Send this line back and it names the cause exactly:';
   p2.style.cssText='margin:0 0 8px;color:#8A8C94;font-size:13.5px';
   var pre=document.createElement('pre');
   pre.textContent=what+'\n'+where+'\n'+navigator.userAgent;
   pre.style.cssText='margin:0;padding:14px 16px;background:#141518;'
    +'border:1px solid #26282E;border-radius:10px;white-space:pre-wrap;'
    +'word-break:break-word;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;'
    +'color:#D6A93B;-webkit-user-select:text;user-select:text';
   box.appendChild(h);box.appendChild(p1);box.appendChild(p2);box.appendChild(pre);
   d.appendChild(box);
   (document.body||document.documentElement).appendChild(d);
   /* the boot sheet fades on a CSS animation whether or not scripts ran, so it
      has to be taken off by hand or it uncovers this and then covers it again */
   var bt=document.getElementById('boot'); if(bt)bt.style.display='none';
  }catch(e){
   /* if even that fails, the document is beyond help and the console is all
      that is left. Saying nothing is still not an option. */
   try{document.title='Atuned failed to start: '+what;}catch(e2){}}}
 window.addEventListener('error',function(e){
  if(BOOTED)return;                 /* after boot, a throw is not a dead app */
  show(String((e&&e.message)||'unknown error'),
       String((e&&e.filename)||'')+' line '+((e&&e.lineno)||'?'));});
 window.addEventListener('unhandledrejection',function(e){
  if(BOOTED)return;
  show('unhandled promise rejection: '+String((e&&e.reason&&e.reason.message)||e.reason||''),'');});
 /* AND A THROW IS NOT THE ONLY WAY TO FAIL. A script that is truncated, or
    that a browser refuses to parse past some point, never reaches the end and
    never throws at run time either. So the guard also checks, once, that the
    app said it finished. Eight seconds is past the boot sheet's own five and
    a bit, on a machine slower than any this has been measured on. */
 setTimeout(function(){
  if(BOOTED)return;
  var tb=document.getElementById('tabbar');
  show('the script never reached the end of its own start up',
       'navigation built: '+(tb&&tb.children.length?tb.children.length+' tabs':'none'));},8000);
})();
