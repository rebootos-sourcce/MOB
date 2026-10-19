/* Presses each mockup the way a person would and checks it answers. Run from the
   repo root under the browser lock:
     flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
       PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/release/src/play.js
   It runs the sessions live at a fast pace (the demo's pace switch), so a whole
   session, script to completion, is walked in seconds and nothing is faked by
   jumping state, except where it says so. */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const DIR=path.resolve(__dirname,'..'),D='file://'+DIR+'/';
const FILES=fs.readdirSync(DIR).filter(f=>/^r\d-.*\.html$/.test(f));
(async()=>{const b=await chromium.launch();let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'BAD ')+m);if(!c)bad++;};
const ph=pg=>pg.$eval('#rs',e=>e.dataset.ph);
const focus=pg=>pg.$$eval('#rs .cr[data-d="0"]:not(.gone) .t',e=>e.map(x=>x.textContent).join('|'));
/* text first, aria-label when there is none: the dial's four icons (18
   October) carry no visible caption by his own ask, so a press is still
   named for these checks the way a screen reader would hear it. */
const presses=pg=>pg.$$eval('#rs button,#rs a',e=>e.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(x).visibility!=='hidden';}).map(x=>x.textContent.trim()||x.getAttribute('aria-label')||''));
const until=async(pg,fn,ms)=>{const t=Date.now();while(Date.now()-t<(ms||8000)){if(await fn())return true;await pg.waitForTimeout(50);}return false;};
for(const f of FILES){const v=f.slice(0,2);
 const pg=await b.newPage({viewport:{width:1600,height:1000}});pg.on('pageerror',e=>{bad++;console.log('ERR',v,e.message)});
 pg.on('request',r=>{if(!/^(file|data):/.test(r.url())){bad++;console.log('NETWORK',v,r.url());}});
 /* before: the setup and the script on one screen, and the dose moves the estimate */
 await pg.goto(D+f+'?embed=1&pace=20');
 ok(await ph(pg)==='before'&&!!(await pg.$('[data-act=begin]')),v+' opens on the setup with Begin on it');
 await pg.click('[data-act=dose][data-v="25"]');
 ok((await pg.textContent('#rs')).includes('25 times each side: 300 lines'),v+' the dose 25 reprices the session to 300 lines, on the same screen');
 const url0=pg.url();
 /* Begin: the script plays on the same page, and the running screen offers
    its presses. The dial (18 October) added voice and end to pause and the
    crisis door, four instead of two; every other version still has two. */
 const maxRun=v==='r3'?4:2;
 await pg.click('[data-act=begin]');
 ok(await ph(pg)==='script'&&pg.url()===url0,v+' Begin plays the script in place: no navigation');
 const pr=await presses(pg);ok(pr.length<=maxRun&&pr.some(t=>/Pause/i.test(t))&&pr.some(t=>/crisis/i.test(t)),v+' while the voice speaks: '+pr.length+' presses, Pause and the crisis door among them');
 ok(await until(pg,async()=>await ph(pg)==='run'),v+' the script hands over to the list by itself, no second press');
 const pt=await pg.textContent('#rs .prompt');ok(/^I'm releasing believing, perceiving, thinking, behaving, acting, feeling that I am$/.test(pt.trim()),v+' the prompt above the list is his: '+pt.trim());
 const a=await focus(pg);await pg.waitForTimeout(700);const c=await focus(pg);
 ok(a&&c&&a!==c,v+' the line in focus reads on by itself: "'+a+'" then "'+c+'"');
 const pr2=await presses(pg);ok(pr2.length===maxRun,v+' the running list offers exactly '+maxRun+' presses: '+pr2.join(' | '));
 /* Pause holds the line; Play goes on */
 await pg.click('[data-act=pause]');const h0=await focus(pg);await pg.waitForTimeout(800);
 ok(await focus(pg)===h0&&!!(await pg.$('[data-act=play]'))&&!!(await pg.$('[data-act=end]')),v+' Pause holds the line in focus and offers Play and End session');
 await pg.click('[data-act=play]');await pg.waitForTimeout(700);ok(await focus(pg)!==h0,v+' Play reads on');
 /* End session still runs the two minutes, as the product's End does */
 await pg.click('[data-act=pause]');await pg.click('[data-act=end]');
 ok(await ph(pg)==='cool'&&/2:00|1:5\d/.test(await pg.textContent('#rs')),v+' End session goes to the two minute cooldown, counted from 2:00');
 const pr3=await presses(pg);ok(pr3.length<=2,v+' the cooldown offers '+pr3.length+' presses: '+pr3.join(' | '));
 ok(await until(pg,async()=>await ph(pg)==='done',9000),v+' the cooldown counts to nought and lands on the completion by itself');
 const tx=await pg.textContent('#rs');
 ok(/Congratulations\./.test(tx)&&/You ended early\./.test(tx),v+' a session ended early is told so, under the congratulations');
 ok(/Released/.test(tx)&&/Bank/.test(tx)&&/Vault/.test(tx)&&/new patterns left this month/.test(tx),v+' the completion carries released, bank, vault and this month\'s new patterns');
 ok(!!(await pg.$('[data-act=another]')),v+' one primary: Run another session');
 await pg.click('[data-act=another]');ok(await ph(pg)==='before',v+' Run another session goes back to the setup, same page');
 /* the crisis door from the running list, by data-act and not by .crx: the
    dial (18 October) carries it as one of the four icons, not the words
    only corner link the other versions still use, and both carry data-act */
 await pg.goto(D+f+'?embed=1&s=run');await pg.click('[data-act="crisis"]');
 ok(await pg.isVisible('.cx-card')&&(await pg.textContent('.cx-card h2'))==='Tell me about it.',v+' the crisis door opens from the running list');
 await pg.click('[data-act=cxreach]');ok(!!(await pg.$('.cx-card a[href="tel:988"]')),v+' Reach someone now shows 988 to call');
 await pg.keyboard.press('Escape');ok(!(await pg.$('.cx-bk')),v+' Escape closes it and leaves the list where it was');
 /* allowance spent: the rerun leads, Run another session is words and not a button */
 await pg.goto(D+f+'?embed=1&s=spent&pace=20');
 const sp=await pg.textContent('#rs');
 ok(sp.includes('This month\'s new patterns are all opened. Everything you have opened still runs, free, as often as you like. New ones arrive on 14 Nov 2026.'),v+' spent: the 17 October words, whole');
 ok(!!(await pg.$('.go[data-act=rerun]'))&&!(await pg.$('[data-act=another]'))&&!!(await pg.$('.shut')),v+' spent: Rerun these is the filled press; Run another session is shown greyed and takes no press');
 await pg.click('[data-act=rerun]');ok(await ph(pg)==='script',v+' Rerun these starts the session in one press');
 /* reduced motion: one line, no neighbours, nothing moving */
 await pg.goto(D+f+'?embed=1&s=run&rm=1');
 const rows=await pg.$$eval('#rs .cr',e=>e.filter(x=>getComputedStyle(x).display!=='none').length);
 const tr=await pg.$$eval('#rs .cr',e=>e.map(x=>getComputedStyle(x).transitionDuration).filter(d=>d!=='0s').length);
 ok(rows===1&&tr===0,v+' reduced motion: one static line in focus ('+rows+' shown, '+tr+' moving)');
 /* a whole session, walked live from Begin to the congratulations */
 await pg.goto(D+f+'?embed=1&dose=25&pace=400');await pg.click('[data-act=begin]');
 const seen={};const t0=Date.now();
 while(Date.now()-t0<20000){const p=await ph(pg);seen[p]=1;if(p==='done')break;await pg.waitForTimeout(30);}
 ok(seen.script&&seen.run&&seen.cool&&seen.done,v+' a whole session walks script, list, cooldown, completion on one page: '+Object.keys(seen).join(', '));
 ok(/You released 12 patterns at 3 places in your body\./.test(await pg.textContent('#rs')),v+' and a session run to its end says what it released');
 await pg.close();}
/* the phone frame */
const pg=await b.newPage({viewport:{width:1600,height:1000}});
await pg.goto(D+FILES[0]+'?ph=1');const box=await (await pg.$('iframe')).boundingBox();
ok(Math.round(box.width)===390&&Math.round(box.height)===844,'the phone view frames 390 by 844');
await b.close();console.log(bad?bad+' problems':'all played');process.exit(bad?1:0);})();
