"""Cut a tall phone capture into columns side by side so it can be read as one picture.
python3 mockups/summary-layout/sheet.py LABEL-loaded-390-full.png [colHeight]"""
import sys
from PIL import Image
src=sys.argv[1]; ch=int(sys.argv[2]) if len(sys.argv)>2 else 1700
im=Image.open(src).convert('RGB'); w,h=im.size
n=(h+ch-1)//ch
sheet=Image.new('RGB',(n*(w+12)-12,ch),(8,8,10))
for i in range(n):
    seg=im.crop((0,i*ch,w,min(h,(i+1)*ch)))
    sheet.paste(seg,(i*(w+12),0))
out=src.replace('-full.png','-sheet.png')
sheet.save(out); print(out,sheet.size,n,'columns')
