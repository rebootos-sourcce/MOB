Probes for review pass 5. Run from a scratch copy of MOB main (b2b7a03) that holds atuned_src, tests, tools and the root documents:
  git -C /home/user/wp2a-storage2 archive origin/main atuned_src tests tools | tar -x -C <dir>   (then copy the root *.md and .claude)
  cd <dir> && ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh        (source.html; the funnel step needs funnel/ and may fail, source.html is already written)
  node probeN.js                      probe1,2,3,5,7,8 use only engine.js
  NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers flock -o -w 1800 /tmp/atuned-browser.lock node probe4.js   (probe4 and probe6 use source.html)
probe1,2: streak and marks. probe3: export and import round trip. probe4: profile delete and the three side stores. probe5: boundary strictness. probe6: profile sync never runs. probe7: behaviour sentences. probe8: same record imported twice.
