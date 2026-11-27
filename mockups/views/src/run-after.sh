#!/bin/sh
# after shots, into mockups/views/ . Run from the repo root with NODE_PATH at playwright.
S=mockups/views/src/shoot.js
O=mockups/views
for W in 1600 390; do
 for P in Derek Wren You; do
  for T in reading drives summary analytics; do echo "$T:$P:$W::full"; done
 done
 for P in Derek Wren; do
  if [ $W = 390 ]; then echo "practitioner:$P:$W:list:full"; echo "practitioner:$P:$W:person:full"; else echo "practitioner:$P:$W::full"; fi
 done
done | xargs node $S $O
