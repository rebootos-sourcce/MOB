/* probe-door.js. Measures the door's symmetry. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/probe-door.js
   Prints, at 1600 and 390: each element's box centre x against the stage centre x, the widest line of each text
   against it, the vertical gap between each pair of stacked items, the margin above the first item and below the
   last, the two button widths and the gap between them. Centre x must hold within 1 px. */
var pw=require('playwright'),path=require('path');
var url='file://'+path.join(__dirname,'..','index.html')+'?clean';
var ITEMS=[['mark','#lg-mark'],['h1','.lg h1'],['mirror','.lg .mirror-line'],['fields','#lg-fields'],['row','.lg .row2'],['create','#lg-create']];
var CENTRE=[['mark','#lg-mark svg'],['h1','.lg h1'],['mirror','.lg .mirror-line'],['label u','#lg-fields .fld:nth-child(1) span'],['input u','#u'],
 ['label p','#lg-fields .fld:nth-child(2) span'],['input p','#p'],['row2','.lg .row2'],['go','#lg-go'],['guest','#lg-guest'],['create','#lg-create']];

/* ---- contrast over the rings. The text is hidden, the ring and wash are screenshotted at ten points of the drift, and the
   brightest pixel under each text box is set against that text's own colour. Floor 4.5 to 1. Then the motion checks. */
async function contrast(br){
 var TXT=[['h1','.lg h1','#EFEDE8'],['mirror','.lg .mirror-line','#B4B0A8'],['label','#lg-fields .fld>span','#B4B0A8'],['create','#lg-create','#B4B0A8']];
 console.log('\ncontrast of text over the rings, worst case over ten points of the drift (floor 4.5)');
 for(var vp of [[1600,1000],[390,844]]){
  var pg=await (await br.newContext({viewport:{width:vp[0],height:vp[1]}})).newPage();
  await pg.goto(url);await pg.waitForTimeout(500);await pg.evaluate(function(){MOCK.jump('login',0,{freeze:true});});
  var worst={};
  for(var k=0;k<10;k++){
   await pg.evaluate(function(t){MOCK.S.ringT=t;document.querySelector('.lg').style.visibility='hidden';},k*9.5);await pg.waitForTimeout(150);
   var buf=await pg.screenshot();
   var res=await pg.evaluate(async function(A){
    var img=new Image();img.src='data:image/png;base64,'+A.b;await img.decode();var c=document.createElement('canvas');c.width=img.width;c.height=img.height;var x=c.getContext('2d');x.drawImage(img,0,0);
    function L(r,g,b){return [r,g,b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce(function(a,v,i){return a+v*[.2126,.7152,.0722][i];},0);}
    var out={};
    A.t.forEach(function(t){var m=0;Array.prototype.forEach.call(document.querySelectorAll(t[1]),function(e){var b=e.getBoundingClientRect(),d=x.getImageData(Math.max(0,b.left|0),Math.max(0,b.top|0),Math.max(1,b.width|0),Math.max(1,b.height|0)).data;
      for(var i=0;i<d.length;i+=4)m=Math.max(m,L(d[i],d[i+1],d[i+2]));});
     var h=parseInt(t[2].slice(1),16),tl=L(h>>16,(h>>8)&255,h&255);out[t[0]]=+((tl+.05)/(m+.05)).toFixed(2);});
    return out;},{b:buf.toString('base64'),t:TXT});
   Object.keys(res).forEach(function(n){worst[n]=Math.min(worst[n]||99,res[n]);});}
  console.log('  '+vp[0]+': '+JSON.stringify(worst));Object.keys(worst).forEach(function(n){if(worst[n]<4.5)bad++;});
  /* motion: the drift moves the picture, and reduced motion does not */
  async function snap(t){await pg.evaluate(function(t){MOCK.S.ringT=t;document.querySelector('.lg').style.visibility='hidden';},t);await pg.waitForTimeout(120);return (await pg.screenshot()).toString('base64');}
  var a1=await snap(0),a2=await snap(30);console.log('  '+vp[0]+' drift moves the rings: '+(a1!==a2));if(a1===a2)bad++;
  await pg.evaluate(function(){MOCK.setStill(true);});var b1=await snap(0),b2=await snap(30);console.log('  '+vp[0]+' reduced motion holds still: '+(b1===b2));if(b1!==b2)bad++;
  await pg.close();}
}
(async function(){
 var br=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}),bad=0;
 for(var vp of [[1600,1000],[390,844]]){
  var pg=await (await br.newContext({viewport:{width:vp[0],height:vp[1]}})).newPage();
  await pg.goto(url);await pg.waitForTimeout(600);
  await pg.evaluate(function(){MOCK.jump('login',0,{freeze:true});});await pg.waitForTimeout(500);
  var r=await pg.evaluate(function(A){var items=A.items,centre=A.centre;
   var st=document.getElementById('stage').getBoundingClientRect(),sc=st.left+st.width/2,o={sc:sc,w:st.width,h:st.height,c:[],g:[],lines:[]};
   function rc(s){return document.querySelector(s).getBoundingClientRect();}
   centre.forEach(function(c){var b=rc(c[1]);o.c.push([c[0],+((b.left+b.right)/2-sc).toFixed(2),+b.width.toFixed(1)]);});
   [['h1','.lg h1'],['mirror','.lg .mirror-line'],['go','#lg-go'],['guest','#lg-guest'],['create','#lg-create']].forEach(function(c){
    var e=document.querySelector(c[1]),w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),n,dev=0,L=[];
    while(n=w.nextNode()){if(!n.nodeValue.trim())continue;var rg=document.createRange();rg.selectNodeContents(n);
     Array.prototype.forEach.call(rg.getClientRects(),function(b){if(b.width>1){var d=(b.left+b.right)/2-sc;L.push(+d.toFixed(2));}});}
    o.lines.push([c[0],L]);});
   var prev=null;items.forEach(function(it){var b=rc(it[1]);if(prev)o.g.push([prev[0]+' to '+it[0],+(b.top-prev[1]).toFixed(1)]);prev=[it[0],b.bottom];});
   o.first=+rc(items[0][1]).top.toFixed(1);o.last=+(st.height-rc(items[items.length-1][1]).bottom).toFixed(1);
   function content(sel){var e=document.querySelector(sel),b=e.getBoundingClientRect(),l=1e9,r2=-1e9;
    Array.prototype.forEach.call(e.children,function(k){var q=k.getBoundingClientRect();if(q.width){l=Math.min(l,q.left);r2=Math.max(r2,q.right);}});
    var w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),n;while(n=w.nextNode()){if(!n.nodeValue.trim())continue;var rg=document.createRange();rg.selectNodeContents(n);var q=rg.getBoundingClientRect();l=Math.min(l,q.left);r2=Math.max(r2,q.right);}
    return +(((l+r2)/2)-((b.left+b.right)/2)).toFixed(2);}
   o.inb=[content('#lg-go'),content('#lg-guest')];
   var go=rc('#lg-go'),gu=rc('#lg-guest');o.btn=[+go.width.toFixed(1),+gu.width.toFixed(1),+(gu.left-go.right).toFixed(1)];
   o.fields=[+(rc('#lg-fields .fld:nth-child(2)').top-rc('#lg-fields .fld:nth-child(1)').bottom).toFixed(1)];
   return o;},{items:ITEMS,centre:CENTRE});
  console.log('\n== '+vp[0]+' x '+vp[1]+'  stage centre x '+r.sc);
  console.log('centre x offset (px) and box width. go and guest are a pair: they must mirror each other, so their offsets must sum to zero');
  var pr=r.c.filter(function(c){return c[0]==='go'||c[0]==='guest';}),ps=pr[0][1]+pr[1][1];if(Math.abs(ps)>1)bad++;console.log('  pair sum '+ps.toFixed(2)+(Math.abs(ps)>1?'  <-- OFF':''));
  console.log('  label inside go '+r.inb[0]+', inside guest '+r.inb[1]+' (content centre minus button centre)');if(Math.abs(r.inb[0])>1||Math.abs(r.inb[1])>1)bad++;
  r.c.forEach(function(c){if(c[0]==='go'||c[0]==='guest'){console.log('  '+c[0].padEnd(10)+String(c[1]).padStart(7)+'  w '+c[2]);return;}var f=Math.abs(c[1])>1?'  <-- OFF':'';if(f)bad++;console.log('  '+c[0].padEnd(10)+String(c[1]).padStart(7)+'  w '+c[2]+f);});
  console.log('text line centre offsets');r.lines.forEach(function(l){if(l[0]==='go'||l[0]==='guest')return;var m=Math.max.apply(null,l.map(Math.abs).concat([0]));if(m>1)bad++;console.log('  '+l[0].padEnd(10)+JSON.stringify(l.map(function(x){return x;})));});
  console.log('vertical gaps (px)');r.g.forEach(function(g){console.log('  '+g[0].padEnd(20)+g[1]);});
  console.log('  gap between the two fields '+r.fields[0]);
  console.log('  margin above first '+r.first+'   below last '+r.last+'   diff '+(r.first-r.last).toFixed(1));
  console.log('  button widths '+r.btn[0]+' and '+r.btn[1]+', gap between '+r.btn[2]);}
 await contrast(br);
 await br.close();console.log('\nmisses: '+bad);process.exit(bad?1:0);})();
