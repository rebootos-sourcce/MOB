#!/usr/bin/env python3
"""
THE DELIVERY BUILD.

The owner's browser reported "THE FILE IS SHORT. The end of it never arrived."
with the navigation present and no module having loaded. That is not a defect
in the product: the file is being cut in transit, and three rounds were spent
looking for a fault in code that was fine.

So the shipped file gets smaller. Measured on the build that failed: comments
are 445,164 of 1,267,857 characters, which is 35 per cent of what is being
sent. They are the most valuable thing in the source and they are worth
nothing at all inside a browser.

WHAT THIS IS NOT. It is not a minifier. Nothing is renamed, nothing is
reordered, no expression is rewritten and no whitespace inside a statement is
touched. Every identifier a person could read in a stack trace is the same
identifier. The only thing removed is commentary, which is why the gates can
be run against the result and be expected to pass unchanged.

The JavaScript goes through the TypeScript compiler rather than a regular
expression, because a regular expression cannot tell a comment from the same
characters inside a string or a regex literal, and this file contains both.
CSS and HTML comments are removed with a scanner that tracks string state for
the same reason.

    python3 tools/slim.py source.html atuned-slim.html
"""
import io,os,re,subprocess,sys,tempfile

def strip_css(css):
    """CSS comments, respecting strings and url() payloads."""
    out=[];i=0;n=len(css);q=None
    while i<n:
        c=css[i]
        if q:
            out.append(c)
            if c=='\\' and i+1<n: out.append(css[i+1]); i+=2; continue
            if c==q: q=None
            i+=1; continue
        if c in '"\'': q=c; out.append(c); i+=1; continue
        if c=='/' and i+1<n and css[i+1]=='*':
            j=css.find('*/',i+2)
            if j<0: break
            i=j+2; continue
        out.append(c); i+=1
    return ''.join(out)

def strip_html_comments(h):
    """<!-- --> only, and only outside script and style, which are handled
    by their own strippers."""
    out=[];i=0;n=len(h)
    while i<n:
        if h.startswith('<!--',i):
            j=h.find('-->',i+4)
            if j<0: break
            i=j+3; continue
        if h.startswith('<style',i):
            j=h.find('</style>',i)
            if j<0: j=n
            out.append(h[i:j]); i=j; continue
        out.append(h[i]); i+=1
    return ''.join(out)

def strip_js(js):
    """Through the TypeScript compiler, which actually parses."""
    d=tempfile.mkdtemp()
    src=os.path.join(d,'m.js')
    io.open(src,'w',encoding='utf-8').write(js)
    r=subprocess.run(['npx','--no-install','tsc','--allowJs','--removeComments',
                      '--target','esnext','--outDir',os.path.join(d,'o'),src],
                     capture_output=True,text=True)
    out=os.path.join(d,'o','m.js')
    if not os.path.exists(out):
        sys.stderr.write('tsc produced nothing\n'+r.stdout+r.stderr); sys.exit(1)
    return io.open(out,encoding='utf-8').read()

def blank_runs(s):
    """collapse runs of blank lines left behind, and trailing spaces. Nothing
    inside a line is touched, so no statement can change meaning."""
    s=re.sub(r'[ \t]+\n','\n',s)
    return re.sub(r'\n{3,}','\n\n',s)

def main():
    src=sys.argv[1] if len(sys.argv)>1 else 'source.html'
    dst=sys.argv[2] if len(sys.argv)>2 else 'atuned-slim.html'
    s=io.open(src,encoding='utf-8').read()
    before=len(s.encode('utf-8'))

    # every script block, in order, handled by the JS stripper
    parts=[];last=0
    for m in re.finditer(r'<script>(.*?)</script>',s,re.S):
        parts.append(('html',s[last:m.start()]))
        parts.append(('js',m.group(1)))
        last=m.end()
    parts.append(('html',s[last:]))

    out=[]
    for kind,txt in parts:
        if kind=='js':
            out.append('<script>'+blank_runs(strip_js(txt))+'</script>')
        else:
            # style blocks inside this stretch
            def css_sub(m): return '<style'+m.group(1)+'>'+strip_css(m.group(2))+'</style>'
            txt=re.sub(r'<style([^>]*)>(.*?)</style>',css_sub,txt,flags=re.S)
            out.append(blank_runs(strip_html_comments(txt)))
    r=''.join(out)

    # THE LENGTH STAMP IS NOW WRONG AND HAS TO BE RE-SOLVED, because the whole
    # point of it is that a browser can tell a short file from a stopped one.
    # Fixed width again, so writing it cannot change it.
    m=re.search(r'data-len="(\d{9})"',r)
    if not m:
        sys.stderr.write('the end of file marker did not survive\n'); sys.exit(1)
    r=r[:m.start(1)]+'%09d'%0+r[m.end(1):]
    r=re.sub(r'data-len="\d{9}"','data-len="%09d"'%len(r.encode('utf-8')),r,count=1)

    io.open(dst,'w',encoding='utf-8').write(r)
    after=len(r.encode('utf-8'))
    print('%s  %s bytes  from %s  %.1f%% smaller'
          %(dst,format(after,','),format(before,','),100.0*(before-after)/before))
    # the stamp has to be true or the guard lies about a short file
    chk=io.open(dst,encoding='utf-8').read()
    said=int(re.search(r'data-len="(\d{9})"',chk).group(1))
    if said!=after:
        sys.stderr.write('length stamp %d does not match the file %d\n'%(said,after)); sys.exit(1)
    print('length stamp is exact')

main()
