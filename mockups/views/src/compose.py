"""python3 mockups/views/src/compose.py
Cuts every 390 full capture into a side by side sheet, and builds the shipped against new pictures at 1600."""
import glob, os
from PIL import Image, ImageDraw, ImageFont
V='mockups/views'
def font(sz):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/dejavu/DejaVuSans.ttf'):
        if os.path.exists(f): return ImageFont.truetype(f,sz)
    return ImageFont.load_default()
def sheet(path,ch=1500):
    im=Image.open(path).convert('RGB'); w,h=im.size; n=(h+ch-1)//ch
    s=Image.new('RGB',(n*(w+12)-12,min(h,ch)),(8,8,10))
    for i in range(n): s.paste(im.crop((0,i*ch,w,min(h,(i+1)*ch))),(i*(w+12),0))
    out=path.replace('-full.png','-sheet.png'); s.save(out,optimize=True); os.remove(path); return out
# analytics at 390: the first screen, shipped against new, marked where it ends
ba=V+'/before/before-analytics-derek-390-full.png'; aa=V+'/after-analytics-derek-390-full.png'
if os.path.exists(ba) and os.path.exists(aa):
    a=Image.open(ba).convert('RGB').crop((0,0,390,844)); b=Image.open(aa).convert('RGB').crop((0,0,390,844))
    c=Image.new('RGB',(390*2+12,844+44),(8,8,10)); dr=ImageDraw.Draw(c); f=font(20)
    dr.text((10,10),'Shipped, first screen',fill=(239,237,232),font=f); dr.text((402,10),'New, first screen',fill=(239,237,232),font=f)
    c.paste(a,(0,44)); c.paste(b,(402,44)); c.save(V+'/compare-analytics-390.png',optimize=True); print('compare-analytics-390')
for d in (V,V+'/before'):
    for p in glob.glob(d+'/*-390*-full.png'): print(sheet(p))
ACC=(126,184,212)
def mark(im,y,label):
    dr=ImageDraw.Draw(im); w=im.size[0]
    for x in range(0,w,14): dr.line([(x,y),(x+8,y)],fill=ACC,width=3)
    f=font(22); tw=dr.textlength(label,font=f)
    dr.rectangle([w-tw-28,y-34,w-8,y-4],fill=(12,13,18)); dr.text((w-tw-18,y-32),label,fill=ACC,font=f)
def compare(before,after,out,marky=None,label='',crop=None,scale=.5):
    a=Image.open(before).convert('RGB'); b=Image.open(after).convert('RGB')
    if crop: a=a.crop((0,crop[0],a.size[0],min(a.size[1],crop[1]))); b=b.crop((0,crop[0],b.size[0],min(b.size[1],crop[1])))
    if marky:
        mark(a,marky,label); mark(b,marky,label)
    H=max(a.size[1],b.size[1])
    sw=int(a.size[0]*scale)
    def sc(i): return i.resize((sw,int(i.size[1]*scale)),Image.LANCZOS)
    a,b=sc(a),sc(b); H=max(a.size[1],b.size[1])+44
    c=Image.new('RGB',(sw*2+12,H),(8,8,10)); dr=ImageDraw.Draw(c); f=font(22)
    dr.text((14,10),'Shipped',fill=(239,237,232),font=f); dr.text((sw+26,10),'New',fill=(239,237,232),font=f)
    c.paste(a,(0,44)); c.paste(b,(sw+12,44)); c.save(out,optimize=True); print(out,c.size)
B=V+'/before/before-%s-derek-1600-full.png'; A=V+'/after-%s-derek-1600-full.png'
compare(B%'summary',A%'reading',V+'/compare-reading-1600.png')
compare(B%'summary',A%'drives',V+'/compare-drives-1600.png')
compare(B%'summary',A%'summary',V+'/compare-summary-1600.png')
compare(B%'analytics',A%'analytics',V+'/compare-analytics-1600.png',marky=122+700,label='first 700 px of the surface ends here')
compare(B%'practitioner',A%'practitioner',V+'/compare-practitioner-1600.png')
# analytics at 390: the first screen, marked
a=V+'/before/before-analytics-derek-390-sheet.png'
