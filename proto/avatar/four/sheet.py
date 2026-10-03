"""Contact sheet: the avatar cell cropped out of each 1600 shot, four across.
   python3 proto/avatar/four/sheet.py"""
from PIL import Image, ImageDraw, ImageFont
import os, sys
D=os.path.dirname(os.path.abspath(__file__)); S=os.path.join(D,'shots')
V=['figure','nerves','channel','ring']
def sheet(rows,name,box=(340,255,1140,985),scale=0.5):
    w=int((box[2]-box[0])*scale); h=int((box[3]-box[1])*scale)
    out=Image.new('RGB',(w*len(V)+10*(len(V)+1),(h+10)*len(rows)+10),(12,13,18))
    for j,r in enumerate(rows):
        for i,v in enumerate(V):
            f=os.path.join(S,r.format(v=v))
            if not os.path.exists(f): continue
            im=Image.open(f).convert('RGB').crop(box).resize((w,h),Image.LANCZOS)
            out.paste(im,(10+i*(w+10),10+j*(h+10)))
    out.save(os.path.join(S,name)); print(name,out.size)
sheet(['{v}-James-0-1600.png','{v}-James-4-1600.png','{v}-James-12-1600.png'],'sheet-james.png')
sheet(['{v}-Angela-0-1600.png','{v}-Angela-9-1600.png','{v}-blank-0-1600.png'],'sheet-angela-blank.png')
sheet(['snow-{v}-James-4-1600.png','punch-{v}-James-4-1600.png','glass-{v}-James-4-1600.png'],'sheet-lightings.png')
def phone(rows,name,w=300):
    ims=[[Image.open(os.path.join(S,r.format(v=v))).convert('RGB') for v in V] for r in rows]
    H=max(int(im.size[1]*w/im.size[0]) for row in ims for im in row)
    out=Image.new('RGB',(w*4+50,(H+10)*len(rows)+10),(12,13,18))
    for j,row in enumerate(ims):
        for i,im in enumerate(row):
            h=int(im.size[1]*w/im.size[0]); out.paste(im.resize((w,h),Image.LANCZOS),(10+i*(w+10),10+j*(H+10)))
    out.save(os.path.join(S,name)); print(name,out.size)
phone(['{v}-James-0-390.png','{v}-James-12-390.png'],'sheet-phone.png')
