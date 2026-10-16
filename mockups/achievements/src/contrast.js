/* Contrast, measured against each element's own ground, never the page's.
   Run: node mockups/achievements/src/contrast.js   (prints a table, exits 1 on any failure)
   Text needs 4.5 to 1. A ring, tick, arc or icon that carries meaning needs 3 to 1.
   A colour drawn at an opacity is composited onto its ground first, so the number is the
   colour a person actually sees. Values are the tokens in shared.css, which are head.html's. */
const T={bg:'#0C0D12',panel:'#1A1D26',panel2:'#252833',sunk:'#090A0E',plate:'#14161D',plateEdge:'#101218',
 ink:'#EFEDE8',mid:'#B4B0A8',dim:'#94908A',accent:'#7EB8D4',
 discover:'#D398C6',play:'#9FC56E',flow:'#52AA9C',embody:'#B87A68'};
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const over=(fg,a,bg)=>{const f=rgb(fg),b=rgb(bg);return '#'+f.map((v,i)=>Math.round(v*a+b[i]*(1-a)).toString(16).padStart(2,'0')).join('');};
const lum=h=>{const c=rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const rows=[
 /* [what, where it sits, fg, ground, kind] */
 ['Title, sentence lines','page','ink','bg','text'],
 ['Lede, horizon line, tile sentence','page and tile','mid','bg','text'],
 ['Tile sentence','tile','mid','panel','text'],
 ['Tile sentence, pointed at','tile, pointed at','mid','panel2','text'],
 ['Dates, small notes, "a working figure"','page','dim','bg','text'],
 ['Dates on a tile','tile','dim','panel','text'],
 ['Dates on a tile, pointed at','tile, pointed at','dim','panel2','text'],
 ['Tooltip body','tooltip','mid','panel2','text'],
 ['Demo bar note','demo bar','dim','sunk','text'],
 ['Phone sheet line','bottom sheet','dim','panel','text'],
 ['Wordmark','app bar','accent','bg','text'],
 ['Released ring on the body','figure, lit fill at its brightest','flow',over('#EFEDE8',.085,T.bg),'ring'],
 ['Released ring on the body','page','flow','bg','ring'],
 ['Released tick, horizon arc on the dial','dial plate, centre','flow','plate','ring'],
 ['Horizon arc, phone sheet','bottom sheet','flow','panel','ring'],
 ['Released family icon','tile','flow','panel','ring'],
 ['Kept family icon','tile','embody','panel','ring'],
 ['Kept family icon, pointed at','tile, pointed at','embody','panel2','ring'],
 ['Turn ring, discover quarter','page','discover','bg','ring'],
 ['Turn ring, play quarter','page','play','bg','ring'],
 ['Turn ring, flow quarter','page','flow','bg','ring'],
 ['Turn ring, embody quarter','page','embody','bg','ring'],
 ['Turn ring, embody quarter','dial plate','embody','plate','ring'],
 ['Figure outline','page','dim','bg','ring'],
 ['Figure outline, field version at 70 percent','page',over(T.dim,.7,T.bg),'bg','ring'],
 ['Horizon band, how far off the estimate could be: thin ticks at full colour, faint by spacing','page','flow','bg','ring'],
 ['Horizon band, the same on the dial','dial plate','flow','plate','ring']];
let fail=0;const out=['| What | Sits on | Colour | Ground | Ratio | Needs | Result |','|---|---|---|---|---|---|---|'];
rows.forEach(([w,s,f,g,k])=>{const fg=T[f]||f,gd=T[g]||g,r=ratio(fg,gd),need=k==='text'?4.5:k==='ring'?3:null;
 const ok=need?r>=need:true;if(!ok)fail++;
 out.push('| '+w+' | '+s+' | '+(T[f]?'--'+f.replace('panel2','panel-2')+' '+fg:fg)+' | '+(T[g]?'--'+g.replace('panel2','panel-2')+' '+gd:gd)+' | '+r.toFixed(2)+' | '+(need?need+' to 1':'shape only, see note')+' | '+(need?(ok?'pass':'FAIL'):'n/a')+' |');});
console.log(out.join('\n'));if(fail){console.log('\n'+fail+' below the floor');process.exit(1);}
