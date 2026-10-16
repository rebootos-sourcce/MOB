import sys, fitz, json
out=[]
for path in sys.argv[1:]:
    with fitz.open(path) as doc:
        for pn,page in enumerate(doc,1):
            ln=0
            for raw in page.get_text("text",sort=True).splitlines():
                if not raw.strip(): continue
                ln+=1
                out.append({"file":path.rsplit('/',1)[1],"page":pn,"line":ln,"text":raw})
json.dump(out,sys.stdout,ensure_ascii=False)
