/* hero-slider.js — rotates the home hero image through 3 portraits.
   Swaps only the src + inline opacity of the existing <img>, so it never
   fights React or framer-motion. */
(function () {
  'use strict';

  var SLIDES = [
    '/images/hero-slide-1.jpg',
    '/images/hero-crown-white.png',
    '/images/hero-slide-4.jpg'
  ];
  var MATCH_KEY = SLIDES[1]; // the bundle's original hero src
  var INTERVAL_MS = 2500;   // time each slide is shown
  var FADE_MS = 450;        // fade-through duration (each direction)

  function preload() {
    SLIDES.forEach(function (s) { var i = new Image(); i.src = s; });
  }

  function start(img) {
    if (img.__ifqHeroSlider) return;
    img.__ifqHeroSlider = true;

    img.src = SLIDES[0]; // the LinkedIn portrait becomes the cover frame

    // Respect users who prefer reduced motion: keep the static hero.
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    preload();
    var idx = 0;

    setInterval(function () {
      if (document.hidden) return;            // don't churn in background tabs
      idx = (idx + 1) % SLIDES.length;
      var next = SLIDES[idx];

      img.style.transition = 'opacity ' + FADE_MS + 'ms ease';
      img.style.opacity = '0';

      setTimeout(function () {
        img.src = next;
        var show = function () { img.style.opacity = '1'; };
        if (img.decode) { img.decode().then(show).catch(show); }
        else { setTimeout(show, 60); }
      }, FADE_MS);
    }, INTERVAL_MS + FADE_MS);
  }

  function find() {
    var imgs = document.getElementsByTagName('img');
    for (var k = 0; k < imgs.length; k++) {
      if (imgs[k].closest && imgs[k].closest('#ifq-chatbot-root')) continue;
      var s = imgs[k].getAttribute('src') || '';
      if (s === MATCH_KEY || s.indexOf('hero-crown-white') !== -1) {
        start(imgs[k]);
        return true;
      }
    }
    return false;
  }

  if (!find()) {
    var mo = new MutationObserver(function () {
      if (find()) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', function () { if (find()) mo.disconnect(); });
  }
})();
