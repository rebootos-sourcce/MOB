#!/usr/bin/env python3
"""Read-only reachability check for public pages; prints no response bodies."""
import sys
from urllib import request, error
from urllib.parse import urlparse

BASE = "https://atuned.world"
PATHS = ("/", "/atuned.html", "/privacy.html", "/terms.html", "/consumer-health-data.html")

def classify(path, opener=request.urlopen):
    try:
        with opener(request.Request(BASE+path, headers={"User-Agent": "ATUNED-readonly-check/1.0"}), timeout=12) as response:
            u = urlparse(response.geturl())
            code = response.getcode()
            if u.scheme != "https" or u.hostname != "atuned.world":
                return "FAIL", "unexpected redirect"
            return ("PASS" if 200 <= code < 300 else "FAIL"), "HTTP "+str(code)
    except error.HTTPError as e:
        return "FAIL", "HTTP "+str(e.code)
    except (error.URLError, TimeoutError, OSError) as e:
        return "UNKNOWN", type(e).__name__

def self_test():
    class Fake:
        def __init__(self, code, url): self.code, self.url = code, url
        def __enter__(self): return self
        def __exit__(self, *args): return False
        def geturl(self): return self.url
        def getcode(self): return self.code
    assert classify("/", lambda *a, **k: Fake(200, BASE+"/"))[0] == "PASS"
    assert classify("/", lambda *a, **k: Fake(503, BASE+"/"))[0] == "FAIL"
    assert classify("/", lambda *a, **k: Fake(200, "https://example.org"))[0] == "FAIL"
    print("3 self-tests PASS")

if __name__ == "__main__":
    if "--self-test" in sys.argv: self_test(); sys.exit(0)
    results = []
    for path in PATHS:
        state, detail = classify(path)
        results.append(state)
        print(state, BASE+path, detail)
    print("Cloudflare commit: UNKNOWN; Worker/API: UNKNOWN")
    sys.exit(1 if "FAIL" in results else (2 if "UNKNOWN" in results else 0))
