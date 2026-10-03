"""Cuts the rail column out of the full screenshots and sets today beside the two
variants, one composite per person. Run after make.js:
python3 mockups/rail-lines/make-crops.py"""
import os
from PIL import Image
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'shots')
os.makedirs(os.path.join(D,'crops'),exist_ok=True)
BOX=(8,119,314,992)           # the left rail, open, at 1600 x 1000
MINI=(6,119,74,430)           # the left rail, closed
def comp(parts,out,gap=14,bg=(12,13,18)):
    ims=[Image.open(p).convert('RGB') for p in parts]
    w=sum(i.width for i in ims)+gap*(len(ims)-1); h=max(i.height for i in ims)
    c=Image.new('RGB',(w,h),bg); x=0
    for i in ims:
        c.paste(i,(x,0)); x+=i.width+gap
    c.save(out)
for who in ['marcus','tomas','diane','you']:
    for tag,box in (('open',BOX),('closed',MINI)):
        crops=[]
        for k,name in (('base',f'base-1600-{who}-{tag}.png'),('hard',f'1600-hard-{who}-{tag}.png'),('soft',f'1600-soft-{who}-{tag}.png')):
            p=os.path.join(D,name); o=os.path.join(D,'crops',f'{k}-{who}-{tag}.png')
            Image.open(p).convert('RGB').crop(box).save(o); crops.append(o)
        comp(crops,os.path.join(D,'crops',f'trio-{who}-{tag}.png'))
for who in ['marcus','tomas']:
    crops=[]
    for k,name in (('base',f'base-1600-{who}-snow.png'),('hard',f'1600-hard-{who}-snow.png'),('soft',f'1600-soft-{who}-snow.png')):
        p=os.path.join(D,name); o=os.path.join(D,'crops',f'{k}-{who}-snow.png')
        Image.open(p).convert('RGB').crop(BOX).save(o); crops.append(o)
    comp(crops,os.path.join(D,'crops',f'trio-{who}-snow.png'),bg=(232,231,226))
print('ok')
