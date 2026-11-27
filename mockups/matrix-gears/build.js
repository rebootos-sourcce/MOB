/* build.js. Writes the six concept pages from one template so they cannot drift apart.
   Run: node mockups/matrix-gears/build.js   (writes m1..m3.html and g1..g3.html) */
const fs=require('fs'),path=require('path');
const P=require('./pages.js');
Object.keys(P).forEach(id=>{
 const o=P[id];
 const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>'+o.title+'</title>\n<link rel="stylesheet" href="mg.css">\n</head><body>\n<script>window.MGPAGE='+JSON.stringify(o)+';</script>\n<script src="data.js"></script>\n<script src="mg.js"></script>\n<script src="'+id+'.js"></script>\n</body></html>\n';
 fs.writeFileSync(path.join(__dirname,id+'.html'),html);});
console.log('wrote',Object.keys(P).join(' '));
