/* Assembles the four standalone mockups from src/. Each output file carries
   its own font, styles, data and script: nothing is fetched. Run from
   anywhere: node mockups/dual-readings/src/make.js */
const fs=require('fs'), path=require('path');
const S=__dirname, OUT=path.join(S,'..');
const R=f=>fs.readFileSync(path.join(S,f),'utf8');
const font=fs.readFileSync(path.join(S,'..','..','rail-options','inter.woff2')).toString('base64');
const C=[
 {n:1,id:'r1',file:'r1-level.html',name:'The level',title:'Dual readings r1, the level'},
 {n:2,id:'r2',file:'r2-instruments.html',name:'The instruments',title:'Dual readings r2, the instruments'},
 {n:3,id:'r3',file:'r3-axis.html',name:'The common axis',title:'Dual readings r3, the common axis'},
 {n:4,id:'r4',file:'r4-mirror.html',name:'The mirror',title:'Dual readings r4, the mirror'}];
const only=process.argv[2];
C.forEach(c=>{
 if(only&&only!==c.id)return;
 if(!fs.existsSync(path.join(S,c.id+'.js')))return;
 const notes=fs.existsSync(path.join(S,c.id+'.notes.html'))?R(c.id+'.notes.html'):'';
 const line=(notes.match(/<!--line:([\s\S]*?)-->/)||[,''])[1].trim();
 const nav=C.map(o=>'<a href="'+o.file+'"'+(o.id===c.id?' class="on" aria-current="page"':'')+'>r'+o.n+' '+o.name+'</a>').join('')+'<a href="index.html">All four, graded</a>';
 let h=R('shell.html');
 const put=(k,v)=>{h=h.split(k).join(v);};
 put('__BASECSS__',R('base.css').replace('__INTER__',font));
 put('__CSS__',R(c.id+'.css'));put('__LIB__',R('lib.js'));put('__JS__',R(c.id+'.js'));
 put('__TITLE__',c.title);put('__N__',String(c.n));put('__NAME__',c.name);put('__LINE__',line);put('__NAV__',nav);
 put('__NOTES__',notes.replace(/<!--line:[\s\S]*?-->/,''));
 if(/—/.test(h))throw new Error(c.file+' carries an em dash');
 fs.writeFileSync(path.join(OUT,c.file),h);
 console.log(c.file,(h.length/1024).toFixed(0)+'KB');});
