/* node mockups/views/src/build.js -> mockups/views/index.html
   One file. The real shell's CSS and DOM (captured by snap.js), Onest embedded, the five views on top. */
const fs=require('fs'),path=require('path');
const d=__dirname, rd=f=>fs.readFileSync(path.join(d,f),'utf8');
const font=fs.readFileSync(path.join(d,'onest.woff2')).toString('base64');
const snap=JSON.parse(rd('snap.json'));
const productCss=snap.css; delete snap.css;
const fontCss=`@font-face{font-family:'Onest';font-style:normal;font-weight:300 700;src:url(data:font/woff2;base64,${font}) format('woff2')}:root,body{--sans:'Onest','Inter',system-ui,sans-serif;--num:'Onest','Inter',system-ui,sans-serif}`;
const barCss=`
#mockbar{position:fixed;left:0;right:0;top:0;z-index:50;background:var(--bg);border-bottom:1px solid var(--edge);padding:8px 14px 9px;display:flex;flex-direction:column;gap:6px;font-family:var(--sans)}
#mockbar .mb-line{font-size:13.5px;color:var(--mid);line-height:1.4}
#mockbar .mb-line b{color:var(--ink);font-weight:600}
#mockbar .mb-row{display:flex;gap:6px 18px;flex-wrap:wrap;align-items:center}
#mockbar .mb-grp{display:flex;gap:4px;flex-wrap:wrap;align-items:center}
#mockbar .mb-grp>span{font-size:12px;color:var(--dim);margin-right:4px}
#mockbar button{background:transparent;border:1px solid var(--edge-2);color:var(--mid);border-radius:999px;padding:0 13px;min-height:36px;font:inherit;font-size:13.5px;cursor:pointer}
#mockbar button[aria-pressed=true]{background:var(--accent);color:var(--on-accent);border-color:var(--accent);font-weight:600}
.app{inset:var(--mbh,84px) 0 0 0!important}
body{overflow:hidden}`;
const js=`const VWDATA=${rd('data.json').trim()};const VWBODY=${JSON.stringify(rd('body.txt').trim())};
const SNAP=${JSON.stringify(snap)};
${rd('views.js')}
${rd('shell.js')}`;
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Views mockups</title>
<style>${productCss}</style>
<style>${fontCss}\n${rd('views.css')}\n${barCss}</style></head>
<body class="lshut booted tab-summary">
<div id="mockbar"></div><div id="root"></div>
<noscript>This mockup needs scripts to draw the screens.</noscript>
<script>${js}</script></body></html>`;
fs.writeFileSync(path.join(d,'..','index.html'),html);
console.log('index.html',html.length,'bytes');
