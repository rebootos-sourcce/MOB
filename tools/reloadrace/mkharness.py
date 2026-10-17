# Cut tests/functional.js down to its prelude, the six masks group (the
# stranger's overlay reload) and the seat tone block (the tone switch reload),
# keeping every line of those as written.
# Usage: mkharness.py IN OUT TESTSDIR [PERSIST [INIT]]
# PERSIST, when given, replaces ./persist.js with an instrumented copy; INIT,
# when given, is added as an init script to every context the harness makes.
import sys
src,out,tests=sys.argv[1],sys.argv[2],sys.argv[3]
pers=sys.argv[4] if len(sys.argv)>4 else None
L=open(src).read().split('\n')
def find(s,start=0):
  for i in range(start,len(L)):
    if s in L[i]: return i
  raise SystemExit('not found: '+s)
first=find("console.log('=== figure fallback ===');")
chh=find("const CH_HELP=`")
masks=find("console.log('\\n=== the six masks, as pixels on the figure ===');")
masksEnd=find("console.log('\\n=== Character: the five masks",masks)
tone=find("console.log('\\n=== the seat tone is binaural")
toneEnd=find("console.log('\\n=== the Field drawn three ways",tone)
tail=find("await browser.close();",toneEnd)
body=L[:first]+L[chh:masks]+L[masks:masksEnd]+L[tone:toneEnd]+L[tail:]
t='\n'.join(body)
if pers: t=t.replace("require('./persist.js')","require('"+pers+"')")
t=t.replace("require('./","require('"+tests+"/")
init=sys.argv[5] if len(sys.argv)>5 else None
if init:
  anchor="const page=await browser.newPage({viewport:{width:1600,height:1000}});"
  assert anchor in t
  t=t.replace(anchor,"browser.newContext=(orig=>async function(...a){const cx=await orig.apply(this,a);await cx.addInitScript({path:'"+init+"'});return cx;})(browser.newContext);\n"+anchor,1)
open(out,'w').write(t)
print('harness lines',len(body))
