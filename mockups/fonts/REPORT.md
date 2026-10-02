# Font report

Brief: future technology, frictionless, easy to read, loved. Every face is base64 woff2.

## Recommendation
- **UI face: Geist**, one variable file, latin, weight axis cut to 300 to 700 (the range the product uses). 26.6 KB raw, **35.5 KB base64**.
- **Optional readout mono: Geist Mono**, 400 to 500. 15.1 KB raw, **20.2 KB base64**. Add it only if CQ and field readouts should look like an instrument. Geist alone already has tabular figures (digit width spread 0 px with tabular-nums on).
- Inter today: 62.8 KB base64. Geist alone saves 27 KB (43 percent). Geist plus Geist Mono is 55.7 KB, still under Inter alone.
- Embed weights 300 (hero), 400 (body), 500 (buttons, readouts), 600 (wordmark), 700 (rare).

## Ranking (measured at 1600 and 390, see png/)
1. **Geist.** Reads newest, neutral, 5 percent narrower than Inter (hero line 867 vs 915 px), so no label wraps. x height 0.53 em. Own matching mono. Weak spot: at 14 px on a 1x screen the dots on the u with a diaeresis touch the stem rows (gap 0 px, Inter has 1). Still reads as u with dots, clean at 2x and above and at 56 px. Keep 14 px text at 400, not 600.
2. **Manrope.** Calmer, rounder. 24.3 KB raw, 31.1 KB base64 at 300 to 700. Clean dots (gap 1 px).
3. **Onest.** Safest swap. Looks like Inter, 40.6 KB base64, so little visible change.
4. Sora. Most futuristic, but 5 percent wider than Inter, buttons 7 percent wider, 44 KB. Wrap risk on a phone.
5. Instrument Sans. Good text, no 300 weight, so the hero would be 400.
6. Figtree. Smallest (26 KB), friendly more than technical, x height 0.50.
7 to 11. Plus Jakarta Sans, Space Grotesk, Red Hat Display, Bricolage Grotesque, Outfit (fails: x height 0.46 em, single storey a).
Dropped without render: Urbanist, DM Sans, Hanken Grotesk, Lexend. None has a tabular figures feature.
Inter stays the legibility benchmark (x height 0.546, clean diaeresis). Its only flaw is that it is not new.

## Runners up
Manrope (calm, smallest at 31 KB) and Onest (lowest risk). Manrope is saved in files/.

## Trade-offs
- Geist and Inter are both neo-grotesques. The change reads as sharper, not dramatic. Sora is the loud option and costs width.
- 14 px diaeresis finding was read off a 1x screenshot, enlarged 3x: png/umlaut-14px-zoom.png.
