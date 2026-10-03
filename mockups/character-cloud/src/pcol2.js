/* searches the sibling colour for each seat that holds two patterns, so no two of the nine sit closer than a set distance */
const fs=require('fs'),path=require('path');global.matchMedia=()=>({matches:false});
const vm=require('vm');const ctx={console,Math};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'core.js'),'utf8')+';this.EX={hsl2rgb,rgb2hsl,hx,PAL};',ctx);
const {hsl2rgb,rgb2hsl,hx,PAL}=ctx.EX;
function lab(c){let r=c[0]/255,g=c[1]/255,b=c[2]/255;[r,g,b]=[r,g,b].map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
 let x=(r*.4124+g*.3576+b*.1805)/.95047,y=(r*.2126+g*.7152+b*.0722),z=(r*.0193+g*.1192+b*.9505)/1.08883;
 const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;return[116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z))];}
const dE=(a,b)=>{const p=lab(a),q=lab(b);return Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]);};
const seats={Fear:'Root',Anger:'Solar',Shame:'Sacral',Disgust:'Sacral',Apathy:'Throat',Shock:'3rd Eye',Sad:'Heart',Surprise:'Heart',Anticipation:'Solar'};
const first={Fear:hx(PAL.Root),Anger:hx(PAL.Solar),Shame:hx(PAL.Sacral),Apathy:hx(PAL.Throat),Shock:hx(PAL['3rd Eye']),Sad:hx(PAL.Heart)};
const sib={Disgust:'Sacral',Anticipation:'Solar',Surprise:'Heart'};
const chosen={};
for(const nm of Object.keys(sib)){const base=hx(PAL[sib[nm]]),h=rgb2hsl(base);let best=null;
 for(let dh=-22;dh<=22;dh+=2)for(let dl=-.12;dl<=.14;dl+=.02)for(let ds=-.15;ds<=0;ds+=.05){
  const c=hsl2rgb(h[0]+dh,Math.max(.2,Math.min(.9,h[1]+ds)),Math.max(.3,Math.min(.82,h[2]+dl)));
  let mn=1e9;const others=Object.values(first).concat(Object.values(chosen));
  for(const o of others)mn=Math.min(mn,dE(c,o));
  /* stay in the family: the sibling's own seat colour must be its nearest relative */
  const own=dE(c,base);if(mn<22)continue;
  const score=-own;if(!best||score>best.score)best={score,mn,own,dh,dl,ds,c};}
 chosen[nm]=best.c;console.log(nm,'hue',best.dh,'light',best.dl.toFixed(2),'sat',best.ds.toFixed(2),'min dE',best.mn.toFixed(1),'from seat',best.own.toFixed(1),'#'+best.c.map(v=>('0'+Math.round(v).toString(16)).slice(-2)).join(''));}
const all=Object.assign({},first,chosen);let mn=1e9,pair='';const ks=Object.keys(all);
for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const d=dE(all[ks[i]],all[ks[j]]);if(d<mn){mn=d;pair=ks[i]+' and '+ks[j];}}
console.log('closest pair',pair,mn.toFixed(1));
