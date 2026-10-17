/* Presses each mockup the way a person would and checks it answers. Run from the repo root under the browser lock:
   flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/paywall/src/play.js */
const {chromium}=require('playwright');const D='file://'+require('path').resolve(__dirname,'..')+'/';
(async()=>{const b=await chromium.launch();let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'BAD ')+m);if(!c)bad++;};
const pg=await b.newPage({viewport:{width:1600,height:1000}});pg.on('pageerror',e=>{bad++;console.log('ERR',e.message)});
await pg.goto(D+'p2-icon-grid.html?s=open&t=sab');
ok((await pg.textContent('.go'))==='Start tier one, $12 a month','p2 door picks tier one for saboteurs');
await pg.click('.chip[data-t="three"]');ok((await pg.textContent('.go'))==='Start tier three, $59 a month','p2 button follows the picked card');
ok(await pg.$$eval('.cell.opens',e=>e.length)===6,'p2 tier three fills all six marks');
await pg.goto(D+'p2-icon-grid.html?s=open&t=none');ok(!(await pg.$('.go'))&&(await pg.textContent('.pickline'))==='Pick a tier','p2 from Billing picks nothing and has no dead button');
await pg.goto(D+'p2-icon-grid.html?s=out&t=cx');await pg.click('.go');ok(!!(await pg.$('.acct')),'p2 signed out: account step inside the panel');
await pg.click('[data-act=acctswap]');ok((await pg.textContent('.acct .go'))==='Sign in and pay','p2 account swap to sign in');
await pg.goto(D+'p3-figure-leads.html?s=open&t=sab');await pg.hover('.seg[data-pv="two"]');
ok(await pg.$$eval('circle.rg.fill',e=>e.length)===2,'p3 pointing at tier two fills two rings');
await pg.goto(D+'p4-one-plan.html?s=open&t=hy');ok((await pg.textContent('.go'))==='Start tier three, $59 a month','p4 hyper complexes door is tier three');
await pg.click('.more');ok(await pg.$$eval('.rows .row',e=>e.length)===3,'p4 see all plans opens three rows');
await pg.click('.row[data-t="two"]');ok((await pg.textContent('.go'))==='Start tier two, $29 a month','p4 pick in the list moves the button');
await pg.goto(D+'p1-three-flat-cards.html?s=one&t=cx');await pg.click('[data-act=stop]');await pg.waitForLoadState();
ok(pg.url().includes('s=stop'),'p1 foot Stop or change plan opens the stop screen, one press');
await pg.click('[data-act=stopgo]');ok((await pg.textContent('h1')).startsWith('Tier one stops on'),'stop screen: second press stops');
await pg.goto(D+'p1-three-flat-cards.html?s=closed');ok(!(await pg.$('.card button')),'p1 closed: no card has a press');
await pg.click('#dtog');ok(await pg.isVisible('#drawer'),'demo drawer opens');
await pg.goto(D+'p2-icon-grid.html?ph=1&s=open');const fr=await pg.$('iframe');const box=await fr.boundingBox();ok(Math.round(box.width)===390&&Math.round(box.height)===844,'phone view frames 390 by 844');
await pg.goto(D+'p2-icon-grid.html?s=gift');ok(!(await pg.$('.lk'))&&!(await pg.$('.num')),'gift: no padlock and no price');
await b.close();console.log(bad?bad+' problems':'all played');process.exit(bad?1:0);})();
