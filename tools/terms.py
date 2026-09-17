"""Yale: 'Use the same terms throughout. Do not switch between delete and remove.'
Pull every user visible string out of the UI layer and look for synonym sets
being used for one concept."""
import re,os,collections
SRC='atuned_src'
order=[l.strip() for l in open(SRC+'/MANIFEST') if l.strip()]
ui=[SRC+'/'+m for m in order if m.startswith('ui/') or m.startswith('shell/')]
txt=[]
for f in ui:
    s=open(f,encoding='utf-8').read()
    s=re.sub(r'/\*.*?\*/','',s,flags=re.S)
    for m in re.finditer(r"'([^'\\\n]{3,60})'|\"([^\"\\\n]{3,60})\"",s):
        v=(m.group(1) or m.group(2)).strip()
        if not v or not re.search(r'[a-z]{3}',v): continue
        if re.match(r'^[\w.#\-\[\]]+$',v): continue          # selectors, ids, classes
        if 'px' in v or v.startswith('rgba') or v.startswith('var(') or '<' in v: continue
        txt.append((f.replace(SRC+'/',''),v))
# also the static shell copy
for f in [SRC+'/shell/body.html']:
    s=open(f,encoding='utf-8').read()
    for m in re.finditer(r'>([^<>{}]{4,70})<',s):
        v=m.group(1).strip()
        if v and re.search(r'[a-z]{3}',v): txt.append(('shell/body.html',v))

print('user visible strings pulled:',len(txt))
blob=' '.join(v.lower() for _,v in txt)
SETS={
 'the empty state'   :['nothing held','nothing is held','no story yet','field clear','none','nothing running','0 of 112','nothing is running'],
 'a held address'    :['held','loaded','carrying','running','firing'],
 'clearing'          :['clear','release','empty','reset','shut','close'],
 'the charge value'  :['charge','load','weight','depth','amount'],
 'the person'        :['you','your field','whose field','profile','persona'],
 'measured vs not'   :['measured','scored','unmeasured','not yet','unknown'],
}
print()
for concept,words in SETS.items():
    found=[(w,blob.count(w)) for w in words if blob.count(w)>0]
    if len(found)>1:
        print('  %-18s %s'%(concept,'  '.join('%s x%d'%(w,c) for w,c in sorted(found,key=lambda x:-x[1]))))
print()
print('=== verbs used on buttons ===')
btn=collections.Counter()
for f,v in txt:
    if len(v.split())<=3 and v[0].isupper() if v else False:
        btn[v]+=1
for v,c in sorted(btn.items()):
    if len(v)<20: print('   ',v)
