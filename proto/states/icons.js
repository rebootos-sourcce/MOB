/* ============================================================
   THE STATES ICONS. Prototype, round DK, 26 September.

   House style, read off the rail rather than invented: a 24 unit box,
   stroke only, round caps and joins, no fill anywhere. The .ib tile sets
   the stroke width and the colour, so nothing here carries either.

   The zodiac is drawn rather than typed. ZGLYPH prints the Unicode signs,
   and those sit in the emoji range: without a text presentation selector a
   phone font is free to draw them as colour pictures in a purple box, which
   is a fill, and a fill is ruled out.
   ============================================================ */
var ST_IC={
 /* the four positions. these mark which layer a tile is, never what is in it */
 pos:{
  sun:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.6"/>',
  moon:'<path d="M15.5 4.2a8 8 0 1 0 4.3 11.6A6.6 6.6 0 0 1 15.5 4.2z"/>',
  rising:'<path d="M3 17.5h18M7 17.5a5 5 0 0 1 10 0M12 3.5v6.5M9.3 6.2L12 3.5l2.7 2.7"/>',
  year:'<circle cx="12" cy="12" r="8"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>'},
 /* the twelve signs, after the classical glyphs */
 sign:{
  Aries:'<path d="M12 20V9.5C12 6 10.4 4 8 4 5.8 4 4.5 5.6 4.5 7.6c0 1.8 1.2 3 2.8 3M12 9.5C12 6 13.6 4 16 4c2.2 0 3.5 1.6 3.5 3.6 0 1.8-1.2 3-2.8 3"/>',
  Taurus:'<circle cx="12" cy="14.5" r="5.5"/><path d="M4 3.5c.8 3.7 3.8 5.5 8 5.5s7.2-1.8 8-5.5"/>',
  Gemini:'<path d="M5 4.5c4.5 1.6 9.5 1.6 14 0M5 19.5c4.5-1.6 9.5-1.6 14 0M9 5.6v12.8M15 5.6v12.8"/>',
  Cancer:'<circle cx="7.5" cy="9" r="2.6"/><path d="M4.9 9C6 5.2 14.5 4 20 6.8"/><circle cx="16.5" cy="15" r="2.6"/><path d="M19.1 15C18 18.8 9.5 20 4 17.2"/>',
  Leo:'<circle cx="7.5" cy="15.5" r="3"/><path d="M10.5 15.5c0-3-1.6-4.8-1.6-7.4a4.1 4.1 0 1 1 8.2 0c0 4.2-3.8 6.2-3.8 9.8a2.2 2.2 0 0 0 4.4.2"/>',
  Virgo:'<path d="M4 7.2c1.1-1 2.2-.8 2.2.8v11M6.2 8c0-2.4 4-2.4 4 0v11M10.2 8c0-2.4 4-2.4 4 0v8.4c0 2.4 2 3.4 3.8 2.6M14.2 12.6c2.2-2 5.8-1.2 5 1.8-.6 2.2-3.4 3.8-6 5.2"/>',
  Libra:'<path d="M4 19.5h16M4 15.5h5a4 4 0 1 1 6 0h5"/>',
  Scorpio:'<path d="M3.5 7.2c1.1-1 2.2-.8 2.2.8v11M5.7 8c0-2.4 4-2.4 4 0v11M9.7 8c0-2.4 4-2.4 4 0v9.4c0 1.3.8 2 2 2h4.3M18 17l2.5 2.4L18 21.8"/>',
  Sagittarius:'<path d="M5 19L19 5M12 5h7v7M7.5 11.5l5 5"/>',
  Capricorn:'<path d="M3.5 6l3 12 3.2-12v8.2c0 3 2 5.3 5 5.3a3.1 3.1 0 1 0-.3-6.2c-2 .1-3.3 1.8-4.2 3.9"/>',
  Aquarius:'<path d="M3 10.5l3-3 3 3 3-3 3 3 3-3 3 3M3 16.5l3-3 3 3 3-3 3 3 3-3 3 3"/>',
  Pisces:'<path d="M6.5 4c3 4.2 3 11.8 0 16M17.5 4c-3 4.2-3 11.8 0 16M5 12h14"/>'},
 /* the twelve animals, each by the one mark that names it at 24 units */
 animal:{
  Rat:'<path d="M19.6 14c0-3.2-3-5.4-7-5.4-3.3 0-5.6 1.6-8.5 4.4L3.6 13.5l.6.6C7 16.6 9.3 18 12.6 18c4 0 7-1.2 7-4z"/><circle cx="13.6" cy="7" r="2.6"/><path d="M19.6 14.4c1.9.9 2.2 3.6.2 4.6M8.2 12.6h.1"/>',
  Ox:'<path d="M3.5 5c.6 3 2.6 4.6 5.5 4.8M20.5 5c-.6 3-2.6 4.6-5.5 4.8M8.5 9.5h7l-.8 7.2c-.3 2-1.4 3.3-2.7 3.3s-2.4-1.3-2.7-3.3z"/><path d="M10.6 17.3h.1M13.4 17.3h.1"/>',
  Tiger:'<circle cx="12" cy="13" r="7"/><path d="M7 7.4L5.6 4.6 8.6 6M17 7.4l1.4-2.8L15.4 6M12 6v3.2M9.2 7l1 2.4M14.8 7l-1 2.4M5 12.6h2.6M5.2 15.2h2.2M19 12.6h-2.6M18.8 15.2h-2.2M10.8 15.4l1.2 1.1 1.2-1.1"/>',
  Rabbit:'<path d="M9.6 10.4C8 7 7.8 3 9.4 3s2.4 3.4 1.8 7.2M14.4 10.4C16 7 16.2 3 14.6 3s-2.4 3.4-1.8 7.2"/><circle cx="12" cy="15.2" r="5.3"/>',
  Dragon:'<path d="M3.5 13l5.2-2.8c1-2.6 3.4-4 6.2-3.6 3 .4 5 2.8 4.8 5.6-.2 2.4-2 4.2-4.4 4.6l-4 .9-7.8-2 4.4-1.1"/><path d="M13.6 6.8l-1.6-3.6M17.2 7.8l1.8-3.4M15.4 10.6h.1M3.5 13c-1.4-.2-2 1-1.4 2.2M14 17.4c.4 2 2.2 3 4.2 2.6"/>',
  Snake:'<path d="M12 12a1.6 1.6 0 1 1 3.2 0 3.2 3.2 0 1 1-6.4 0 4.8 4.8 0 1 1 9.6 0 6.4 6.4 0 0 1-6.4 6.4"/><path d="M12 18.4c-2.4 0-4.2-1-5.4-2.6"/><path d="M6.6 15.8L4.4 16.6M6.6 15.8l-.6 2.2"/>',
  Horse:'<path d="M7 20V11a5 5 0 0 1 10 0v9M4.8 20h4.4M14.8 20h4.4"/><path d="M7 13.5h.1M7 16.8h.1M17 13.5h.1M17 16.8h.1M9.6 7.4h.1M14.4 7.4h.1"/>',
  Goat:'<path d="M9.6 9.6C9 5.6 6.4 4 4.8 5.2c-1.4 1-.8 3.8 1.8 3.8M14.4 9.6c.6-4 3.2-5.6 4.8-4.4 1.4 1 .8 3.8-1.8 3.8"/><path d="M9 9.6h6l-1 7.2c-.3 1.4-1 2.1-2 2.1s-1.7-.7-2-2.1z"/><path d="M11 19.2l1 2.6 1-2.6"/>',
  Monkey:'<circle cx="12" cy="11.8" r="6.4"/><circle cx="4.2" cy="11.2" r="2.1"/><circle cx="19.8" cy="11.2" r="2.1"/><ellipse cx="12" cy="14.6" rx="3.4" ry="2.3"/><path d="M9.8 10.2h.1M14.2 10.2h.1"/>',
  Rooster:'<circle cx="11" cy="13" r="4.6"/><path d="M8 8.8c-.6-1.8.4-3.1 1.7-2.7.2-1.7 2.1-2.1 2.9-.8 1.1-1 2.9-.3 2.6 1.5"/><path d="M15.4 11.6l3.8 1.3-3.6 1.3"/><path d="M13.4 17.2c.5 1.9-.4 3.2-1.5 3.2s-1.5-1-1.1-2.6"/><path d="M12.4 12h.1"/>',
  Dog:'<ellipse cx="12" cy="16" rx="4.4" ry="3.6"/><circle cx="5.6" cy="10.6" r="1.9"/><circle cx="9.6" cy="6.6" r="1.9"/><circle cx="14.4" cy="6.6" r="1.9"/><circle cx="18.4" cy="10.6" r="1.9"/>',
  Pig:'<ellipse cx="12" cy="14" rx="7.5" ry="5.5"/><ellipse cx="9.7" cy="14" rx="1.1" ry="1.8"/><ellipse cx="14.3" cy="14" rx="1.1" ry="1.8"/><path d="M6.4 9.6L5 5.4l4.2 2.2M17.6 9.6L19 5.4l-4.2 2.2"/>'},
 /* the five elements, lifted from CELEM_IC in ui/summary.js so the year's
    element wears the same mark here that it wears on Summary */
 celem:{
  Metal:'<circle cx="12" cy="12" r="7"/><path d="M12 5v14"/>',
  Water:'<path d="M4 10c3 3 5 3 8 0s5-3 8 0M4 16c3 3 5 3 8 0s5-3 8 0"/>',
  Wood:'<path d="M12 21V7M12 7L7 3M12 7l5-4M12 13l-5-3M12 13l5-3"/>',
  Fire:'<path d="M12 21c4 0 6-2.6 6-6 0-4-4-5-4-9 0 0-3 2-3 5 0-1-1.6-2-1.6-2C9.4 11 6 12 6 15c0 3.4 2 6 6 6z"/>',
  Earth:'<path d="M3 17h18M6 13h12M9 9h6"/>'},
 /* the three that are not the four, lifted from Summary for the same reason */
 hd:'<path d="M7 4v16M17 4v16M7 9h10M7 15h10"/>',
 gk:'<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6v16.8"/>'};
if(typeof module!=='undefined')module.exports={ST_IC:ST_IC};
