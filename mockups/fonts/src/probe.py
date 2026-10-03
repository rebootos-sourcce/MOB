import glob,os,json,sys
from fontTools.ttLib import TTFont
rows=[]
base='node_modules/@fontsource-variable'
items=[(d,[x for x in glob.glob(f'{base}/{d}/files/{d}-latin-*normal.woff2') if '-ext-' not in x]) for d in os.listdir(base)]
items+= [('ibm-plex-mono',glob.glob('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')+glob.glob('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')),
('space-mono',glob.glob('node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff2'))]
samples={'label':'Password','btn':'Create account','long':'Atüned is a mirror that sees through you.'}
for name,fs in sorted(items):
  for f in fs:
    t=TTFont(f)
    cmap=t.getBestCmap(); hm=t['hmtx']; upm=t['head'].unitsPerEm
    os2=t['OS/2']
    axes={a.axisTag:(a.minValue,a.defaultValue,a.maxValue) for a in t['fvar'].axes} if 'fvar' in t else {}
    feats=set()
    if 'GSUB' in t:
      feats={fr.FeatureTag for fr in t['GSUB'].table.FeatureList.FeatureRecord}
    def w(s): return sum(hm[cmap[ord(c)]][0] for c in s)/upm
    r=dict(name=name,file=os.path.basename(f),kb=round(os.path.getsize(f)/1024,1),axes=axes,
      xh=round(os2.sxHeight/upm,3),cap=round(os2.sCapHeight/upm,3),
      xratio=round(os2.sxHeight/os2.sCapHeight,2),
      u=0xFC in cmap, tnum='tnum' in feats, ss=sorted(x for x in feats if x.startswith(('ss','cv','zero','salt'))),
      wLong=round(w(samples['long']),2), wCreate=round(w(samples['btn']),2),
      wDigit=round(w('0123456789')/10,3))
    rows.append(r); 
for r in rows: print(json.dumps(r))
