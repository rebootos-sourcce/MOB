/* ============================================================
   ONE FILE THAT ARRIVES.

   The build is a megabyte of markup and it kept being cut in transit. The
   owner saw the boot guard's own message three times, which is the guard
   working and the delivery failing: "THE FILE IS SHORT. The end of it never
   arrived." Trimming was not going to fix it. There is no single blob to
   remove, only 821 KB of script and 199 KB of style that the product needs.

   So the file is compressed and carries its own decompressor. The payload is
   the whole build, gzipped and base64'd, and the page around it is a few
   hundred bytes that inflate it with DecompressionStream and write it into
   the document. Still one file. Still no dependency and no network: nothing
   is fetched, the bytes are in the page.

   It also turns a silent failure into a loud one. A truncated gzip stream
   fails to inflate rather than parsing most of the way and leaving a shell,
   so a cut file says it was cut instead of looking like a broken product.

   node tools/pack.js  ->  atuned-packed.html
   ============================================================ */
const fs=require('fs'), zlib=require('zlib'), path=require('path');
const ROOT=path.join(__dirname,'..');
const SRC=path.join(ROOT,process.argv[2]||'atuned-slim.html');
const OUT=path.join(ROOT,process.argv[3]||'atuned-packed.html');

const raw=fs.readFileSync(SRC);
const gz=zlib.gzipSync(raw,{level:9});
const b64=gz.toString('base64');

/* the stamp the guard already reads, carried on the outer page too, so a
   person can say which build they are holding before it has inflated. */
const stamp=(raw.toString('utf8').match(/data-build="([^"]+)"/)||[])[1]||'unknown';

const page=`<!doctype html>
<html lang="en" data-build="${stamp}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>SOURCE · your field</title>
<style>
html,body{margin:0;height:100%;background:#0E0E0F;color:#E6E7EA;
 font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
#w{display:flex;align-items:center;justify-content:center;height:100%;padding:32px}
#w div{max-width:60ch}
h1{font-size:20px;margin:0 0 10px;font-weight:600}
p{margin:0 0 12px;color:#C9CBD2}
pre{margin:0;padding:12px 14px;background:#141518;border:1px solid #26282E;
 border-radius:10px;white-space:pre-wrap;word-break:break-word;color:#D6A93B;
 font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
</style></head>
<body><div id="w"><div id="m"><h1>Opening the instrument.</h1>
<p>It is compressed inside this file. Nothing is being fetched.</p></div></div>
<script>
/* THE WATCHDOG COMES BEFORE THE PAYLOAD, BECAUSE A CUT FILE CUTS THE LOADER.

   The first version put the length check inside the loader, which is after the
   payload. Measured on a copy cut to eighty percent: the loader never parsed,
   so the check never ran and the page sat on "Opening the instrument" for
   ever, which is the silent failure again wearing a new coat.

   This script is a few hundred bytes at the top of the file, so it arrives
   whether or not the rest does. If nothing has inflated by the time it fires,
   the file was short. */
var SAID=false, NL=String.fromCharCode(10);
function packFail(what,detail){
 if(SAID)return; SAID=true;
 var m=document.getElementById('m'); if(!m)return;
 m.innerHTML='<h1>This build did not finish arriving.</h1>'
  +'<p>There is nothing wrong with the instrument. The file itself is short, '
  +'so it could not be opened. Save it to your machine and open it from there, '
  +'or ask for the zip, which is a third of the size.</p>'
  +'<p style="color:#8A8C94;font-size:13.5px">Send this line back.</p><pre></pre>';
 m.querySelector('pre').textContent='build ${stamp}'+NL+what+NL+detail
  +NL+navigator.userAgent;}
setTimeout(function(){
 packFail('the file stopped before the instrument could be opened',
  'the payload never finished loading');},6000);
</script>
<script>
/* THE PAYLOAD IS THE BUILD. Its length is stamped beside it so a short file is
   caught before it is decoded, which is the same trick the boot guard plays
   with the end of file marker, moved one layer out. */
var LEN=${b64.length};
var B="${b64}";
(function(){
 var fail=packFail;
 if(B.length!==LEN){
  fail('the payload is short','arrived '+B.length+' of '+LEN+' characters');
  return;}
 if(typeof DecompressionStream!=='function'){
  fail('this browser cannot inflate the payload',
       'DecompressionStream is not available');
  return;}
 var bin;
 try{ bin=atob(B); }catch(e){ fail('the payload did not decode',String(e)); return; }
 var u=new Uint8Array(bin.length);
 for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
 var ds=new DecompressionStream('gzip');
 new Response(new Blob([u]).stream().pipeThrough(ds)).text()
  .then(function(html){
   /* document.write rather than innerHTML, because innerHTML does not run a
      script and the whole instrument is script. */
   SAID=true;                 /* inflated, so the watchdog stands down */
   document.open(); document.write(html); document.close();})
  .catch(function(e){ fail('the payload did not inflate',String(e)); });
})();
</script>
</body></html>`;

fs.writeFileSync(OUT,page);
console.log('  '+path.basename(SRC)+'  '+raw.length.toLocaleString()+' bytes');
console.log('  '+path.basename(OUT)+'  '+page.length.toLocaleString()+' bytes  '
 +(100-Math.round(page.length/raw.length*100))+'% smaller  build '+stamp);
