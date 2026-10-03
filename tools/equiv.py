# -*- coding: utf-8 -*-
"""Prove the module split changed nothing but order.
Extract every top-level declaration from both JS bundles and compare
the multiset of (name, body). Order may differ; content may not."""
import re,io,hashlib,sys,os
def js(path):
    s=io.open(path,encoding='utf-8').read()
    return s[s.index('<script>')+8:s.rindex('</script>')]
def decls(src):
    out={}
    # top-level only: declarations that begin at column 0
    for m in re.finditer(r'^(?:function|var|const|let)\s+([A-Za-z_$][\w$]*)',src,re.M):
        name=m.group(1); start=m.start()
        # body runs to the next column-0 declaration or comment block
        nxt=re.search(r'^(?:function|var|const|let)\s+[A-Za-z_$][\w$]*|^/\*',src[start+1:],re.M)
        end=start+1+(nxt.start() if nxt else len(src)-start-1)
        body=re.sub(r'\s+','',src[start:end])
        out.setdefault(name,[]).append(hashlib.md5(body.encode()).hexdigest()[:12])
    return out
A=decls(js(sys.argv[1])); B=decls(js(sys.argv[2]))
onlyA=sorted(set(A)-set(B)); onlyB=sorted(set(B)-set(A))
changed=sorted(n for n in set(A)&set(B) if sorted(A[n])!=sorted(B[n]))
print('declarations in shipped :',len(A))
print('declarations in rebuilt :',len(B))
print('only in shipped         :',onlyA or 'none')
print('only in rebuilt         :',onlyB or 'none')
print('bodies changed          :',changed or 'none')
# a deleted declaration is a difference too. The old fallback exited 0 whenever
# nothing was added or changed, so deleting relPick outright read as clean.
sys.exit(0 if (not onlyB and not changed and set(onlyA)<= {'__probe__'}) else 1)
