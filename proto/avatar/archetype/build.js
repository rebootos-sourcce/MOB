/* ============================================================
   BUILD THE ARCHETYPE PICKER PROTOTYPES. Round GV in TASKS.md.

     pages/<name>.html
       + base.css (the four variations only) + arch.css + lib.js
       + ARCH from proto/fw/data.json
       + ARCH18 from atuned_src/engine/data/canon.js
       + AFF, each reference person's archetype affinity, computed here by
         the COMMITTED engine.js (git show HEAD:engine.js), because the
         working tree can carry another seat's work in flight
                                            ->  out/<name>.html
     tools/pack.js                          ->  out/<name>-packed.html

     node proto/avatar/archetype/build.js [name ...]
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..','..');
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();

const ARCH=JSON.parse(fs.readFileSync(path.join(ROOT,'proto/fw/data.json'),'utf8')).tables.ARCH
 .map(a=>({nm:a.nm,v:a.v,b:a.b,ic:a.ic}));
const canon=fs.readFileSync(path.join(ROOT,'atuned_src/engine/data/canon.js'),'utf8');
const a18=(canon.match(/var ARCH18=(\[[\s\S]*?\]\]);/)||[])[1];
if(!a18)throw new Error('ARCH18 not found in canon.js');
const ARCH18=JSON.parse(a18.replace(/'/g,'"'));

/* THE HALO IS THE ENGINE'S. The same read tests/engine.js makes of a
   persona: its table is its measurement. Checked against proto/fw/data.json,
   which read Angela and Derek off the built app in Chromium: equal to four
   places, so the method is the app's. */
const tmp=path.join(os.tmpdir(),'gv-engine-'+process.pid+'.js');
fs.writeFileSync(tmp,cp.execSync('git show HEAD:engine.js',{cwd:ROOT,maxBuffer:64<<20}));
const E=require(tmp);
const {S,CHARGES,SINAMES,PEOPLE,LAWSET,compute,buildSoul}=E;
function rd(p){S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
 S.roots=p.roots?p.roots.slice():[]; buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT); E.LAW_UNSET[l]=false;});
 return compute();}
const AFF={};
['James','Angela','Derek'].forEach(n=>{const p=PEOPLE.find(x=>x.nm===n); if(!p)throw new Error('no persona '+n);
 AFF[n]=(rd(p).aff||[]).map(v=>+(+v).toFixed(4));});
fs.unlinkSync(tmp);
const fw=JSON.parse(fs.readFileSync(path.join(ROOT,'proto/fw/data.json'),'utf8')).people;
['Angela','Derek'].forEach(n=>{const d=fw[n].aff.map((v,i)=>Math.abs(v-AFF[n][i])).reduce((a,b)=>Math.max(a,b),0);
 if(d>1e-3)throw new Error(n+': engine affinity disagrees with proto/fw/data.json by '+d);});

const base=fs.readFileSync(path.join(D,'base.css'),'utf8');
const arch=fs.readFileSync(path.join(D,'arch.css'),'utf8');
const lib=fs.readFileSync(path.join(D,'lib.js'),'utf8');
const data='var ARCH='+JSON.stringify(ARCH)+';var ARCH18='+JSON.stringify(ARCH18)+';var AFF='+JSON.stringify(AFF)
 +';var STAMP='+JSON.stringify('round GV prototype over '+commit)+';';
fs.mkdirSync(path.join(D,'out'),{recursive:true});
const want=process.argv.slice(2);
const pages=fs.readdirSync(path.join(D,'pages')).filter(f=>f.endsWith('.html')).map(f=>f.slice(0,-5))
 .filter(n=>!want.length||want.includes(n));
for(const name of pages){
 let h=fs.readFileSync(path.join(D,'pages',name+'.html'),'utf8');
 h=h.replace('<!--BASE-->','<style>'+base+'</style>');
 h=h.replace('<!--ARCH-->','<style>'+arch+'</style>');
 h=h.replace('<!--LIB-->','<script>'+data+'\n'+lib+'</script>');
 h=h.replace(/data-build="[^"]*"/,'data-build="round GV prototype '+name+' over '+commit+'"');
 if(/<!--(BASE|ARCH|LIB)-->/.test(h))throw new Error(name+': a placeholder was left in');
 if(/\u2014/.test(h))throw new Error(name+': an em dash');
 const out=path.join(D,'out',name+'.html');
 fs.writeFileSync(out,h);
 cp.execSync(`node tools/pack.js ${path.relative(ROOT,out)} ${path.relative(ROOT,path.join(D,'out',name+'-packed.html'))}`,{cwd:ROOT,stdio:'pipe'});
 const sz=f=>(fs.statSync(path.join(D,'out',f)).size/1024).toFixed(0)+' KB';
 console.log(name.padEnd(14),sz(name+'.html'),'packed',sz(name+'-packed.html'));
}
