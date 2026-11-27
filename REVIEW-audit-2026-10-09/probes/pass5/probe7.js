const E=require('./engine.js');
const S=["I stated the concern directly.","I avoided telling them what I actually wanted.","I postponed the conversation again.","I handled the situation directly.","I put it off again and changed the subject."];
S.forEach(s=>{const r=E.parseStory(s); console.log(JSON.stringify(s),'->',JSON.stringify({bands:r.bands,imprints:(r.imprints||[]).length,unread:r.unread||r.unreadRuns||null}).slice(0,160));});
console.log('exports with Drawer:',Object.keys(E).filter(k=>/drawer/i.test(k)).join(','));
