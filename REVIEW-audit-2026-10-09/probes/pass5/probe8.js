const E=require('./engine.js');
const mem={}; E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=v;});
const p=E.profCreate('Dup'); const txt=E.pExport();
const n0=E.profiles?E.profiles().length:'n/a';
const a=E.pImport(txt); const b=E.pImport(txt);
console.log('same record imported twice; profile ids in store:', JSON.parse(mem[E.PKEY]).filter(x=>x.id===p.id).length, 'total', JSON.parse(mem[E.PKEY]).length);
