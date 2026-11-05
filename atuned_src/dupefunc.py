"""Two modules can each define a function that works alone and still break the
build once concatenated: the second top-level declaration silently wins, so
which body actually runs is decided by MANIFEST order, not by anyone's intent.
Caught here, once, across every module, instead of once per instance of the
bug it causes downstream.

ASYNC AND GENERATOR DECLARATIONS COUNT TOO. The first cut matched only a line
starting `function NAME(`, so `async function profileSyncHash` in ui/auth.js
was invisible to it, and a second declaration of that name, sync or async,
would have replaced the record sync hash by load order with nothing said.
`function* NAME` was invisible the same way.

AND A TOP LEVEL CONST, LET OR CLASS MAY NOT BE DECLARED TWICE. Every module
goes into one script, so `const TABHOME` in two modules, or a `let` beside a
`function` of the same name, is a SyntaxError for the whole app. Each module
passed `node --check` alone, the build printed its all clear, and the file
opened to an empty shell. This names the pair the way a duplicate function is
named. BUILD.sh then compiles the joined script as well, which catches any
cross module parse failure this line scan cannot see. A top level var beside a
var of the same name is legal JavaScript and is not refused here.

Comments and strings are stripped first, the same way hostfree.py does it, so
a function named inside a comment or a string is never mistaken for a real
declaration.

The scan proves itself against known bad and known good pairs before it reads
a module, because a check that has gone blind passes everything."""
import re,sys
def stripped(s):
    s=re.sub(r'/\*.*?\*/','',s,flags=re.S)
    s=re.sub(r'(?m)^\s*//.*$','',s)
    s=re.sub(r"'(?:\\.|[^'\\\n])*'",'""',s)
    s=re.sub(r'"(?:\\.|[^"\\\n])*"','""',s)
    s=re.sub(r'`(?:\\.|[^`\\])*`','""',s)
    return s
FUNC=re.compile(r'(?m)^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(')
LEX=re.compile(r'(?m)^(const|let|class)\s+([A-Za-z_$][\w$]*)')
VAR=re.compile(r'(?m)^var\s+([A-Za-z_$][\w$]*)')

def scan(mods):
    """mods is a list of (path, source). Returns (dupes, function count)."""
    funcs={}; lex={}; vars_={}
    dupes=[]; count=0
    for path,src in mods:
        s=stripped(src)
        for m in FUNC.finditer(s):
            name=m.group(1); count+=1
            if name in funcs: dupes.append(('function',name,funcs[name],path))
            elif name in lex: dupes.append(('function and '+lex[name][0],name,lex[name][1],path))
            else: funcs[name]=path
        for m in LEX.finditer(s):
            kind,name=m.group(1),m.group(2)
            if name in lex: dupes.append((kind,name,lex[name][1],path))
            elif name in funcs: dupes.append((kind+' and function',name,funcs[name],path))
            elif name in vars_: dupes.append((kind+' and var',name,vars_[name],path))
            else: lex[name]=(kind,path)
        for m in VAR.finditer(s):
            name=m.group(1)
            if name in lex: dupes.append(('var and '+lex[name][0],name,lex[name][1],path))
            else: vars_.setdefault(name,path)
    return dupes,count

# THE SELF TEST. Each known bad pair must be refused and the known good set
# must pass, or the scan is not trusted to read the real modules.
BAD=[
    ('plain function','function a(){return 1}','function a(){return 2}'),
    ('async function','async function b(){return 1}','async function b(){return 2}'),
    ('async then sync','async function c(){}','function c(){}'),
    ('generator','function* g(){}','function *g(){}'),
    ('const','const T=1;','const T=0;'),
    ('let and const','let U=1;','const U=2;'),
    ('class and function','class K{}','function K(){}'),
    ('var and let','var V=1;','let V=2;'),
]
GOOD=[('x.js','function a(){}\nasync function b(){}\nconst C=1;\nvar D=1;\n'),
      ('y.js','function e(){}\nlet F=2;\nclass G{}\nvar D=2;\n// const C=3;\nvar s="const C=4";\n')]
for label,one,two in BAD:
    if not scan([('k1.js',one),('k2.js',two)])[0]:
        print('dupefunc self test: the known bad %s pair was not refused'%label); sys.exit(1)
if scan(GOOD)[0]:
    print('dupefunc self test: the known good set was refused'); sys.exit(1)

paths=[p for p in sys.argv[1:] if p.endswith('.js')]
dupes,count=scan([(p,open(p,encoding='utf-8').read()) for p in paths])
if dupes:
    for kind,name,first,second in dupes:
        if first==second:
            print('  %s %s declared twice in %s'%(kind,name,first))
        else:
            print('  %s %s declared in both %s and %s'%(kind,name,first,second))
    print('%d top-level name declared more than once'%len(dupes)); sys.exit(1)
print('%d top-level functions across %d modules, each declared once, and no const, let or class name repeated'%(count,len(paths)))
