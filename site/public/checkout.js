/* Checkout. Picks volumes where the sku needs them, then hands off to
   Stripe. No price is ever sent from the browser. */
(function () {
  var VOLUMES = ["ANXIETY", "SHAME", "MONEY", "ANGER", "BURNOUT", "DRIVE", "WORTH", "GRIEF", "VOICE", "CONTROL", "DUTY"];
  var NEEDS = { cluster: 3 };
  var busy = false;

  function go(sku, volumes, btn, label) {
    busy = true; if (btn) { btn.disabled = true; btn.textContent = 'One moment'; }
    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku: sku, volumes: volumes })
    }).then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.url) { window.location = d.url; return; }
        throw new Error((d && d.error) || 'Checkout is not available.');
      })
      .catch(function (e) {
        busy = false;
        if (btn) { btn.disabled = false; btn.textContent = label; }
        alert(e.message + ' Write to hello@thelittlebooksof.com and it will be sorted by hand.');
      });
  }

  function picker(n, then) {
    var chosen = [];
    var back = document.createElement('div');
    back.className = 'sheet';
    back.innerHTML =
      '<div class="sheet-inner"><div class="caps">Choose ' + n + '</div>' +
      '<h2>Which three?</h2>' +
      '<p class="note">Take the band the diagnostic named, plus the two it leans on.</p>' +
      '<div class="picks">' + VOLUMES.map(function (v) {
        return '<button type="button" class="pick" data-v="' + v + '">' + v + '</button>';
      }).join('') + '</div>' +
      '<p><button class="cta" id="pk-go" disabled>Continue</button> ' +
      '<button class="cta ghost" id="pk-no">Cancel</button></p></div>';
    document.body.appendChild(back);
    var go2 = back.querySelector('#pk-go');
    back.addEventListener('click', function (e) {
      if (e.target === back || e.target.id === 'pk-no') { back.remove(); return; }
      var b = e.target.closest('.pick');
      if (!b) return;
      var v = b.getAttribute('data-v'), i = chosen.indexOf(v);
      if (i > -1) { chosen.splice(i, 1); b.classList.remove('on'); }
      else if (chosen.length < n) { chosen.push(v); b.classList.add('on'); }
      go2.disabled = chosen.length !== n;
      go2.textContent = chosen.length === n ? 'Continue' : 'Choose ' + (n - chosen.length) + ' more';
    });
    go2.addEventListener('click', function () { back.remove(); then(chosen); });
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('button.buy');
    if (!b || busy) return;
    var sku = b.getAttribute('data-sku');
    if (!sku) return;
    ev.preventDefault();
    var label = b.textContent;
    var vol = b.getAttribute('data-volume');
    if (vol) { go(sku, [vol], b, label); return; }
    if (NEEDS[sku]) { picker(NEEDS[sku], function (vs) { go(sku, vs, b, label); }); return; }
    go(sku, [], b, label);
  });
})();
