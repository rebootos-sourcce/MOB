# Pass 3 for the architecture (round PK): executable steps
Read `REVIEW-FRAMEWORK/PASS3.template.md` for the shape, `REVIEW-arch/PROPOSAL.md` (the lead's
merge), then the pass 2 reports in `REVIEW-arch/pass2/`. Write `REVIEW-arch/pass3/<your-seat>.md`,
under 1400 words, plain short words, no em dashes, terms of art explained in the same sentence.
1. THE ARCHITECTURE IN THREE SENTENCES as you understand it; say if the merge lost or bent
   anything your discipline cares about.
2. THE ICP ROOM. Simulate EIGHT people meeting this architecture on screen (Marta in acute
   distress at 02:00; Nils the skeptic; Camille the somatic practitioner; Whitney phone only;
   Renata the operator who wants the chain as a number; Gordon who refuses anything clinical;
   Sofia who needs the consent list; Trey the quiz tourist): what they see, what they do,
   where they leave or trust, one line in their voice.
3. UNIFIED QUALITY out of 100 and the three biggest gaps.
4. FINAL GRADE `GRADE: NN/100` (pass 1 NN, pass 2 NN).
5. YOUR PART OF THE SLICES. The work is cut into slices a build agent can take in its own
   worktree and a gate can prove. For each slice you own or touch give: name, goal, files it
   changes, files it must not touch, the test or gate that proves it, size S, M or L, what it
   unlocks, MVP or later, and what the ICPs feel. Use ids A1..A13 (this repo) and R0..R5 (the
   server repo /home/user/reboot-os) from `REVIEW-arch/pass2/technical-director.md` and the 13
   slices in `REVIEW-arch/pass2/creative-director.md` as the starting point; merge duplicates.
6. THE ORDER, and what can run in parallel (slices that touch the same file run in series;
   `ui/storyui.js` and `engine/schema.js` are the hot files).
7. ONE QUESTION for the owner only if truly blocked, else "none".
Write only your own file. The project manager seat also writes the single merged plan table.
