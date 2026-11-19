#!/usr/bin/env node
/* ============================================================
   THE INSIGHT READING AGAINST ITS OWN MUTANTS. 18 November.

   node tools/insightread-mutants.js     (run from the repo root, after the engine build)

   tests/insightread.js is only worth its green if each of its groups goes red
   when the thing it guards is broken. This breaks engine.js one way at a time
   (a copy, in the temp directory, never the file), runs the test against the
   copy with ENGINE=copy, and names the group that noticed. A mutant that no
   group notices, or that only an unrelated group notices, exits non zero.
   tests/insightrail.js carries its own mutants for the browser half
   (MUTANTS=1 node tests/insightrail.js).
   ============================================================ */
const fs=require('fs'), cp=require('child_process'), path=require('path');
const ROOT=path.resolve(__dirname,'..'), E=fs.readFileSync(ROOT+'/engine.js','utf8');
const M=[
 ['segment-with-no-src',"src:(src instanceof Array)?src:[src],kind:kind||'model'","src:[],kind:kind||'model'",'IN1'],
 ['src-that-does-not-resolve',"MASKS:MASKS,SI:SI,APC:APC,HARM:HARM,r:r};","MASKS:MASKS,SI:SI,APC:APC,HARM:HARM};",'IN1'],
 ['decimal-in-a-figure',"base+' is '+insArt(kw)+' '+kw+', at '+fmtPct('chain',o.w)+'.'","base+' is '+insArt(kw)+' '+kw+', at '+o.w.toFixed(1)+'%.'",'IN1'],
 ['banned-word-in-an-offer',":'A release at '+f.k+' ('+fmtPct('weight',f.sq)+') is available.';",":'A release at '+f.k+' ('+fmtPct('weight',f.sq)+') is available. You should start now.';",'IN1'],
 ['safety-line-behind-an-offer',"function insP3Pattern(o,r,rel,safe){\n if(safe)return insSafeP3();","function insP3Pattern(o,r,rel,safe){\n",'IN3'],
 ['overshot-offered-a-release',"if(p.over){base.why='over';return base;}","",'IN4'],
 ['entitlement-offered-a-release',"list=list.filter(function(n){return n.cf&&n.sq>=1;});","list=list.filter(function(n){return n.sq>=1;});",'IN4'],
 ['same-input-different-output',"return (b.x.w-a.x.w)||(a.j-b.j);","return (b.x.w-a.x.w)||(Math.random()-.5);",'IN1'],
 ['reading-changes-the-record',"function insightRead(sel,r,g,o){","function insightRead(sel,r,g,o){S.charge.Fear=(S.charge.Fear||0)+1;",'IN1'],
 ['ceilings-lifted',"var INS_MAX=[70,70,60];","var INS_MAX=[700,700,600];",'IN0'],
 ['gap-blames-the-person',"The reading did not pick one up.',['gap:stories'],'gap'),1));}\n return insPack(INS_HEAD[1],cl,INS_MAX[1]);}\n\n/* the step the record itself names","You did not write about it.',['gap:stories'],'gap'),1));}\n return insPack(INS_HEAD[1],cl,INS_MAX[1]);}\n\n/* the step the record itself names",'IN6'],
 ['edges-counted-as-entries',"seen[e.key]=1;});});\n return {any:any,n:Object.keys(seen).length};}","seen[e.key+'@'+i]=1;});});\n return {any:any,n:Object.keys(seen).length};}",'IN6'],
 ['place-with-two-prepositions',"cl.push(insClause(insSeg('The map seats '+c0.nm+' '+insAtPlace(c0.addr)+'.',","cl.push(insClause(insSeg('The map seats '+c0.nm+' at the '+c0.addr.toLowerCase()+'.',",'IN7'],
 ['anchor-read-as-null-nerve',"if(n&&n.n)return 'at the '+String(n.n).toLowerCase();","return 'at the '+String(n&&n.n).toLowerCase();",'IN7'],
 ['quote-not-in-its-sentence',"return insSeg(lead+'“'+q+'”'+(tail||''),src,'book',{q:q,place:!!place});","return insSeg(lead+'“'+q+'x”'+(tail||''),src,'book',{q:q,place:!!place});",'IN1'],
 ['address-listed-twice',"else if(!sn[x.i]){sn[x.i]=1;a.push(x);}})(o);return a;}","else {sn[x.i]=1;a.push(x);}})(o);return a;}",'IN0'],
 ['blank-record-reads',"if(r.unread)return {ok:false,why:'unread'};","",'IN2'],
];
const tmp=require('os').tmpdir(); let missed=0;
for(const [id,a,b,grp] of M){
 const n=E.split(a).length-1; if(n!==1){console.log('  MUTANT '+id+': the text to break appears '+n+' times, not once'); missed++; continue;}
 const f=path.join(tmp,'insightread-mutant-'+id+'.js'); fs.writeFileSync(f,E.replace(a,()=>b));
 const r=cp.spawnSync('node',['tests/insightread.js'],{cwd:ROOT,env:Object.assign({},process.env,{ENGINE:f}),encoding:'utf8',maxBuffer:1<<26});
 try{fs.unlinkSync(f);}catch(e){}
 const out=(r.stdout||'')+(r.stderr||'').split('\n').slice(0,3).join('\n'); const lines=out.split('\n'); let cur='', first=null, tot=0;
 for(const l of lines){ const m=/^(IN\d) /.exec(l); if(m)cur=m[1]; if(/^  FAIL /.test(l)){tot++; if(!first)first=cur+' '+l.trim().slice(5,110);} }
 const caught=tot>0&&(r.status!==0);
 const hit=caught&&lines.some((l,i)=>{ return false; });
 const groups=[]; let c2=''; for(const l of lines){const m=/^(IN\d) /.exec(l); if(m)c2=m[1]; if(/^  FAIL /.test(l)&&groups.indexOf(c2)<0)groups.push(c2);}
 const ok=caught&&groups.indexOf(grp)>=0;
 console.log((ok?'  CAUGHT ':(caught?'  CAUGHT-ELSEWHERE ':'  MISSED '))+id.padEnd(32)+' by '+groups.join(',')+'  '+(first||'nothing').slice(0,100));
 if(!ok)missed++;}
console.log('\n  '+M.length+' mutants, '+missed+' not caught by the group named');
process.exit(missed?1:0);
