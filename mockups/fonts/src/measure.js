const {chromium}=require('playwright');const fs=require('fs');
const S='/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/fonts/';
const list=JSON.parse(fs.readFileSync('/home/user/MOB-pm-fonts/mockups/fonts/src/fonts.json'));
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({deviceScaleFactor:1});
 let css='';
 for(const f of list){const path=S+'node_modules/'+f.pkg+'/files/'+f.file;const b64=fs.readFileSync(path).toString('base64');
  css+=`@font-face{font-family:'${f.slug}';src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:${f.w};}`;}
 await p.setContent(`<style>${css}</style><body></body>`);
 const out=await p.evaluate(async(list)=>{
  const res={};
  const c=document.createElement('canvas');c.width=200;c.height=80;const x=c.getContext('2d',{willReadFrequently:true});
  function ink(ch,fam,px,wt){x.clearRect(0,0,200,80);x.fillStyle='#000';x.font=`${wt} ${px}px "${fam}"`;x.textBaseline='alphabetic';x.fillText(ch,20,60);
    const d=x.getImageData(0,0,200,80).data;const rows=[];for(let y=0;y<80;y++){let s=0;for(let xx=0;xx<200;xx++)s+=d[(y*200+xx)*4+3];rows.push(s);}return rows;}
  function clusters(rows,th){const cl=[];let cur=null;rows.forEach((v,y)=>{if(v>th){if(!cur)cur={a:y,b:y};else cur.b=y;}else if(cur){cl.push(cur);cur=null;}});if(cur)cl.push(cur);return cl;}
  for(const f of list){
   await document.fonts.load(`400 16px "${f.slug}"`);await document.fonts.load(`600 16px "${f.slug}"`);
   const m=(t,px,wt,tn)=>{const s=document.createElement('span');s.style.cssText=`position:absolute;white-space:nowrap;font:${wt} ${px}px "${f.slug}";`+(tn?'font-variant-numeric:tabular-nums;':'');s.textContent=t;document.body.appendChild(s);const w=s.getBoundingClientRect().width;s.remove();return +w.toFixed(2);};
   const r={};
   r.hero44=m('There is more running you than you can see.',44,300);
   r.hero28=m('There is more running you than you can see.',28,400);
   r.create16=m('Create account',16,500);
   r.mirror20=m('Atüned is a mirror that sees through you.',20,400);
   r.seat13=m('Solar plexus',13,500);
   // tabular: widths of 1111 vs 0000 vs 8888 default and tnum
   const dflt=['1111','0000','8888'].map(t=>m(t,16,500,false)); const tn=['1111','0000','8888'].map(t=>m(t,16,500,true));
   r.tabDefaultSpread=+(Math.max(...dflt)-Math.min(...dflt)).toFixed(2);
   r.tabTnumSpread=+(Math.max(...tn)-Math.min(...tn)).toFixed(2);
   r.cq=m('CQ 62.4',16,500,true);
   // u vs ü at 14px and 56px: gap between diaeresis and body
   for(const px of [14,56]){
     const wt=px==14?400:500;
     const cu=clusters(ink('ü',f.slug,px,wt),px*20);const uu=clusters(ink('u',f.slug,px,wt),px*20);
     r['uml'+px]={clusters:cu.length,dotH:cu[0]?cu[0].b-cu[0].a+1:0,gap:cu.length>1?cu[1].a-cu[0].b-1:0,uTop:uu[0]?uu[0].a:null,umlTop:cu[0]?cu[0].a:null};
   }
   res[f.slug]=r;
  }
  return res;},list);
 console.log(JSON.stringify(out,null,1));
 fs.writeFileSync(S+'measure.json',JSON.stringify(out,null,1));
 await b.close();})();
