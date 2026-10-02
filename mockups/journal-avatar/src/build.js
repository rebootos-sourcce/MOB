/* Inlines the Onest subset and writes index.html. Run from anywhere. */
const fs=require('fs'),path=require('path');
const d=path.join(__dirname,'..');
const f=fs.readFileSync(path.join(__dirname,'onest.b64'),'utf8').trim();
const html=fs.readFileSync(path.join(__dirname,'page.html'),'utf8').replace('__FONT__',f);
fs.writeFileSync(path.join(d,'index.html'),html);
console.log('index.html',html.length,'bytes');
