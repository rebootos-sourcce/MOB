"""python3 mockups/summary-layout/show.py LABEL  : the counts for one pass, compact"""
import json,sys
L=sys.argv[1]
d=json.load(open('mockups/summary-layout/%s-counts.json'%L))
for k in ['blank-1600','loaded-1600','blank-390','loaded-390']:
    v=d[k]; b=v['balance']
    print(L,k,'controls',v['controls'],'whole',v['controlsWholeScreen'],'groups',v['groups'],
          'blocks',v['textBlocks'],'words',v['words'],'rings',v['rings'],'surface',v.get('surfaceHeight'),'height',v['fullHeight'],
          'level',b['mean'],'worst',(b['worst'] or {}).get('cls'),(b['worst'] or {}).get('level'),
          'where',v['where'])
