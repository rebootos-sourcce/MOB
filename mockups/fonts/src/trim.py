import os,sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
N='node_modules/@fontsource-variable/'
U="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
def trim(src,dst,lo,hi,unicodes=U,feats=None):
    f=TTFont(src)
    if 'fvar' in f:
        f=instancer.instantiateVariableFont(f,{'wght':(lo,hi)})
    if feats:
        import io
        b=io.BytesIO(); f.flavor=None; f.save(b); b.seek(0); f=TTFont(b)
        opt=subset.Options(); opt.layout_features=feats; opt.notdef_outline=True; opt.name_IDs=['*']; opt.hinting=False
        s=subset.Subsetter(opt); s.populate(unicodes=subset.parse_unicodes(unicodes)); s.subset(f)
    f.flavor='woff2'; f.save(dst)
    n=os.path.getsize(dst); print(os.path.basename(dst),round(n/1024,1),'KB raw',round((n+2)//3*4/1024,1),'KB b64')
os.makedirs('trim',exist_ok=True)
trim(N+'inter/files/inter-latin-wght-normal.woff2','trim/inter-300-700.woff2',300,700)
trim(N+'geist/files/geist-latin-wght-normal.woff2','trim/geist-300-700.woff2',300,700)
trim(N+'geist/files/geist-latin-wght-normal.woff2','trim/geist-400-600.woff2',400,600)
trim(N+'manrope/files/manrope-latin-wght-normal.woff2','trim/manrope-300-700.woff2',300,700)
trim(N+'onest/files/onest-latin-wght-normal.woff2','trim/onest-300-700.woff2',300,700)
trim(N+'geist-mono/files/geist-mono-latin-wght-normal.woff2','trim/geist-mono-400-500.woff2',400,500)
trim(N+'geist-mono/files/geist-mono-latin-wght-normal.woff2','trim/geist-mono-digits.woff2',400,500,"U+0020-007E,U+00B7,U+2212",['tnum','zero','kern'])
