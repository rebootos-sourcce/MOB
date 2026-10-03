/* ============================================================
   THE FOUR ROOT GLYPHS. Prototype, round DR, 26 September. Not product code.

   Same grammar as every family already in the build: a 24 box, open stroke,
   round caps and joins, no fill, drawn to inherit the colour it is given.
   Each is argued from the root's own sentence in the product, the Western
   lens in ui/summary.js ("Builds and holds", "Initiates and burns", "Joins
   and dissolves", "Observes and names"), and from the domains it holds in
   engine/data/canon.js, never from what the word sounds like.

   RECOMMENDED is one per root. ALTERNATE is shown only where a second
   drawing survived the contact sheet (contact.html, every one of the 86
   named glyphs already in the build at rail size). Engine has no alternate:
   the one drawn, a flywheel and crank, read as a banjo at 22 pixels and was
   cut rather than shown to make up a count.

   Cut on the contact sheet, and why, so nobody redraws them:
     post and lintel for Architect   the Duty law is the same shape, two
                                     meanings on one mark. Kept as alternate.
     flywheel and crank for Engine   read as a banjo or a key at badge size
     loom, warp and weft for Weaver  read as mixer faders, echoes the hash of
                                     Fifty addresses
     two strand cord for Weaver      the over and under gap closes at 22px
                                     and it reads as "xx"
     needle and thread for Weaver    a smudge at 22px
   ============================================================ */
var RI_GLYPH={
 rec:{
  /* ARCHITECT. A drafting set square with its cut out, the instrument a
     right angle is drawn with. Knowledge, Justice, Imperium, Duty, Fate is
     order that is designed before it is built. Creator is an equal sided
     triangle standing on its base; this is a right triangle in its corner,
     and the inner cut is what keeps them apart at 22 pixels. */
  Architect:'M4 20V4l16 16z M8 16v-5.4l5.4 5.4z',
  /* ENGINE. A flame, open, with the tongue inside it. Power, Creation,
     Dissolution, Descent, Death is form made and unmade by force, and a
     flame is the one thing that both starts and consumes. The Sacral seat
     glyph is a closed lens; the inner tongue and the broken crown keep the
     two apart. */
  Engine:'M12 21c-3.8 0-6.4-2.6-6.4-6.1 0-3.9 3-5.9 4-9.9 1.9 1.3 3.3 3.3 3.5 5.7 1-.8 1.7-2 1.8-3.4 2.3 1.9 3.5 4.6 3.5 7.6 0 3.5-2.6 6.1-6.4 6.1z M12 21c-1.5 0-2.5-1-2.5-2.5 0-1.6 1.2-2.6 2.5-4.1 1.3 1.5 2.5 2.5 2.5 4.1 0 1.5-1 2.5-2.5 2.5',
  /* WEAVER. A confluence: two streams that meet and run on as one.
     Connection, Exchange, Restoration, Provision, Play is what passes
     between, and the root's sentence is joins and dissolves, which is
     exactly what two waters do. Water is the root's own element. */
  /* drawn taller than first cut, 4 to 20 rather than 6 to 18: two lines
     carry less ink than a flame or a set square, and at the same box they
     read a size smaller beside them. Optical, not mathematical. */
  Weaver:'M3 4.5c5.5 0 6 7.5 11 7.5h7 M3 19.5c5.5 0 6-7.5 11-7.5',
  /* WITNESS. A viewfinder's four corners around a point. Nature,
     Trickster, Mystery, Guardian is observation without interference: the
     frame holds the thing and never touches it. The eye was the obvious
     answer and it is taken twice already, by the 3rd Eye seat and by the
     awareness gate. */
  Witness:'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5 M12 12m-1.7 0a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0-3.4 0'},
 alt:{
  /* post and lintel on its ground line: what holds weight up. Echoes the
     Duty law, which is why it is not the recommendation. */
  Architect:'M3 4.5h18V8H3z M7 8v12 M17 8v12 M4 20h16',
  Engine:null,
  /* three strands plaited, the literal weave. Reads as a braid, and at a
     glance also as a helix, which is the reason it is second. */
  Weaver:'M8 3c0 3 8 3 8 6s-8 3-8 6 8 3 8 6 M16 3c0 1.5-2 2.3-4 3 M8 9c0 1.5 2 2.3 4 3 M16 15c0 1.5-2 2.3-4 3',
  /* a glass on its tripod: looks from far off and changes nothing. Reads,
     but it is the busiest of the eight and the diagonal fights the grid. */
  Witness:'M3.5 13l11-4.6 1.6 3.8-11 4.6z M14.5 8.4l4.2-1.8 1.6 3.8-4.2 1.8 M10.3 14.6L7.5 21 M10.3 14.6L13 21'}};
if(typeof module!=='undefined')module.exports={RI_GLYPH};
