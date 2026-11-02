/* Assembles the standalone mockup from src/. The output carries its own font,
   styles, data and script: nothing is fetched except the one r1 screenshot it
   shows beside the drill, which sits next to it in this repository.
   node mockups/nerve-charge/src/make.js */
const fs=require('fs'), path=require('path');
const S=__dirname, R=f=>fs.readFileSync(path.join(S,f),'utf8');
const font=fs.readFileSync(path.join(S,'..','..','rail-options','inter.woff2')).toString('base64');
let h=R('shell.html');
const put=(k,v)=>{h=h.split(k).join(v);};
put('__CSS__',R('page.css').replace('__INTER__',font));
put('__JS__',R('page.js').replace('__DATA__',R('data.json')));
if(h.indexOf(String.fromCharCode(0x2014))>=0)throw new Error('index.html carries an em dash');
fs.writeFileSync(path.join(S,'..','index.html'),h);
console.log('index.html',(h.length/1024).toFixed(0)+'KB');
