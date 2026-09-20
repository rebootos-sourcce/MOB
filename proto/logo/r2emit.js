const fs=require('fs'), path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const a=require(path.join(__dirname,'r2round2.js'));
const b=require(path.join(__dirname,'r2round2b.js'));
const c=require(path.join(__dirname,'r2round2c.js'));
const lede=`Nine cuts, two rounds each, and a stated floor every tile on this page clears. A round here is a change
argued from what the last round measured, not a second sheet of the same thing. Every number is read off a
Chromium raster of the same path data, and every actual size tile is that raster rather than a scaled drawing.
Nothing on this page makes a network request and nothing outside <code>proto/logo/</code> was touched.`;
fs.writeFileSync(path.join(__dirname,'round2.html'),
  B.page('The nine cuts, two rounds each', lede, a+b+c,
         'Atüned / Source OS · Art direction · Logotype round 2'));
console.log('round2.html', fs.statSync(path.join(__dirname,'round2.html')).size, 'bytes');
const r3a=require(path.join(__dirname,'r2round3.js'));
const r3b=require(path.join(__dirname,'r2round3b.js'));
const r3c=require(path.join(__dirname,'r2round3c.js'));
const lede3=`Tracking and the two letter pair collisions, drawn at the sizes the mark is actually used at, with the
gap stated in pixels and in em for every state. Then the favicon as a band of the seven seats, at sixteen, thirty
two and one hundred and eighty pixels, in both rhythms. Then the dots on paper. Every number is read off a
Chromium raster of the same path data, and every actual size tile is that raster. Nothing on this page makes a
network request.`;
fs.writeFileSync(path.join(__dirname,'round3.html'),
  B.page('Spacing, the favicon, and the dots on paper', lede3, r3a+r3b+r3c,
         'Atüned / Source OS · Art direction · Logotype round 3'));
console.log('round3.html', fs.statSync(path.join(__dirname,'round3.html')).size, 'bytes');
