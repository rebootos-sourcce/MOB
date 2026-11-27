"""Crops the left rail out of the 1600 x 1000 screenshots so the contact sheet can show
four people side by side at a readable size. Run from the repo root:
python3 mockups/rail-simple/make-crops.py"""
import os
from PIL import Image
D=os.path.join(os.path.dirname(__file__),'shots'); C=os.path.join(D,'crops'); os.makedirs(C,exist_ok=True)
WHO=['marcus','tomas','diane','you']
def crop(src,dst,box):
    Image.open(os.path.join(D,src)).convert('RGB').crop(box).save(os.path.join(C,dst))
for w in WHO:
    crop(f'base-1600-{w}-open.png',f'base-{w}-open.png',(8,120,314,1000))
    for o in 'abc':
        crop(f'1600-{o}-{w}-open.png',f'{o}-{w}-open.png',(8,120,314,700))
        crop(f'1600-{o}-{w}-closed.png',f'{o}-{w}-closed.png',(8,120,96,520))
for w in ['marcus','tomas']:
    for o in 'abc':
        crop(f'1600-{o}-{w}-snow.png',f'{o}-{w}-snow.png',(8,120,314,700))
print(sorted(os.listdir(C))[:6],len(os.listdir(C)))
