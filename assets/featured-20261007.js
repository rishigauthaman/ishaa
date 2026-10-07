/* featured.js — "As Featured In" press strip + stats + feature cards,
   injected directly after the hero (#home), before #about. */
(function () {
  'use strict';

  /* Press outlets. url: '' renders non-clickable; img: '' renders the styled
     wordmark. Drop official press-kit logo files into /images/press/ and set
     img paths — the image takes over automatically (text is the fallback). */
  var PRESS = [
    { name: 'Forbes',        cls: 'forbes',  url: '', img: '' },
    { name: 'Khaleej Times', cls: 'khaleej', url: 'https://www.khaleejtimes.com/city-times/this-dubai-beauty-is-on-a-social-mission', img: '' },
    { name: 'Gulf News',     cls: 'gulf',    url: '', img: '' },
    { name: 'Zee TV',        cls: 'zee',     url: '', img: '' },
    { name: 'HP',            cls: 'hp',      url: '', img: '' },
    { name: 'TEDx',          cls: 'tedx',    url: '', img: '' }
  ];

  var STATS = [
    ['3\u00D7',  'TEDx'],
    ['500+',     'AI Summits & Keynotes'],
    ['25K+',     'Lives Impacted'],
    ['100+',     'Social Initiatives'],
    ['500+',     'Stages'],
    ['200+',     'Live Television Broadcast']
  ];

  var CARDS = [
    {
      eyebrow: 'Artificial Intelligence',
      title: 'A leading voice on AI in the Gulf',
      copy: 'Keynoting AI summits, panel discussion and tech conferences \u2014 translating artificial ' +
            'intelligence for business leaders, women in tech and the next generation.',
      cta: 'Invite Isha to Speak \u2192',
      url: '#contact',
      external: false,
      booking: 'speaking'
    },
    {
      eyebrow: 'As Featured In',
      title: 'Forbes',
      copy: 'Profiled for the rare blend of tech brilliance, beauty and grace \u2014 ' +
            'alongside Khaleej Times, Gulf News and Zee TV.',
      cta: 'Read the Coverage \u2192',
      url: 'https://www.khaleejtimes.com/city-times/this-dubai-beauty-is-on-a-social-mission',
      external: true
    },
    {
      eyebrow: 'Social Change',
      title: '25K+ lives changed, and counting',
      copy: '100+ social initiatives and 500+ stages amplifying empowerment, ' +
            'education and dignity for communities worldwide.',
      cta: 'Join a Campaign \u2192',
      url: '#contact',
      external: false
    }
  ];

  function el(tag, className, html) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (html) n.innerHTML = html;
    return n;
  }

  function buildSection() {
    var section = el('section', 'ifq-ft-section');
    section.id = 'featured';
    var inner = el('div', 'ifq-ft-inner');

    inner.appendChild(el('p', 'ifq-ft-eyebrow', 'As Featured In'));

    // Press wordmark strip
    var strip = el('div', 'ifq-ft-press');
    PRESS.forEach(function (p) {
      var node;
      var brandCls = 'ifq-ft-brand ifq-ft-brand--' + p.cls;
      if (p.url) {
        node = el('a', brandCls);
        node.href = p.url;
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
        node.setAttribute('aria-label', p.name + ' coverage of Dr. Ishha Farha Quraishy');
        node.setAttribute('data-cursor-hover', '');
      } else {
        node = el('span', brandCls);
      }
      if (p.img) {
        var im = document.createElement('img');
        im.src = p.img;
        im.alt = p.name;
        im.loading = 'lazy';
        im.onerror = function () {           // file missing -> styled text fallback
          node.removeChild(im);
          node.appendChild(document.createTextNode(p.name));
        };
        node.appendChild(im);
      } else {
        node.textContent = p.name;
      }
      strip.appendChild(node);
    });
    inner.appendChild(strip);

    // Stats band
    var stats = el('div', 'ifq-ft-stats');
    STATS.forEach(function (s) {
      var d = el('div');
      d.appendChild(el('div', 'ifq-ft-stat-num', s[0]));
      d.appendChild(el('div', 'ifq-ft-stat-label', s[1]));
      stats.appendChild(d);
    });
    inner.appendChild(stats);

    // Feature cards
    var cards = el('div', 'ifq-ft-cards');
    CARDS.forEach(function (c) {
      var card = el('article', 'ifq-ft-card');
      card.appendChild(el('p', 'ifq-ft-card-eyebrow', c.eyebrow));
      card.appendChild(el('h3', 'ifq-ft-card-title', c.title));
      card.appendChild(el('p', 'ifq-ft-card-copy', c.copy));
      var a = el('a', 'ifq-ft-card-cta', c.cta);
      a.href = c.url;
      if (c.external) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      if (c.booking) {
        a.addEventListener('click', function (ev) {
          if (window.IFQ_OPEN_BOOKING) { ev.preventDefault(); window.IFQ_OPEN_BOOKING(c.booking); }
        });
      }
      a.setAttribute('data-cursor-hover', '');
      card.appendChild(a);
      cards.appendChild(card);
    });
    inner.appendChild(cards);

    section.appendChild(inner);
    return section;
  }


  var YT_INTRO_ID = 'JiSOiqyjHHw'; // [PLACEHOLDER — replace with her intro video]
  var PODCAST_URL = 'https://www.linkedin.com/posts/he-amb-dr-ishha-farha-quraishy-56224519_thenextchapter-podcast-activity-7355263129062141952-m4bh';

  function buildIntro() {
    var section = el('section', 'ifq-in-section');
    section.id = 'intro';
    var inner = el('div', 'ifq-ft-inner');
    inner.appendChild(el('p', 'ifq-ft-eyebrow', 'A Personal Welcome'));

    var grid = el('div', 'ifq-in-grid');

    // Video intro (click-to-play)
    var frame = el('figure', 'ifq-in-frame');
    var play = el('button', 'ifq-in-play');
    play.setAttribute('aria-label', 'Play Dr. Ishha\u2019s introduction');
    play.setAttribute('data-cursor-hover', '');
    var img = document.createElement('img');
    img.src = '/images/hero-slide-3.jpg';
    img.alt = 'Dr. Ishha Farha Quraishy \u2014 introduction';
    img.loading = 'lazy';
    play.appendChild(img);
    play.appendChild(el('span', 'ifq-in-playbtn',
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>'));
    play.appendChild(el('span', 'ifq-in-caption', 'Meet Dr. Ishha \u00B7 In Her Own Words'));
    play.addEventListener('click', function () {
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube-nocookie.com/embed/' + YT_INTRO_ID + '?autoplay=1&rel=0';
      ifr.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      ifr.allowFullscreen = true;
      ifr.className = 'ifq-in-iframe';
      frame.innerHTML = '';
      frame.appendChild(ifr);
    });
    frame.appendChild(play);
    grid.appendChild(frame);

    // The Book & The Podcast
    var side = el('div', 'ifq-in-side');
    side.appendChild(el('h2', 'ifq-in-heading',
      'The Author & <span class="ifq-in-gold">The Voice</span>'));
    var book = el('div', 'ifq-in-book');
    book.appendChild(el('span', 'ifq-in-book-rule', ''));
    book.appendChild(el('span', 'ifq-in-book-title', 'The Prolific Woman'));
    book.appendChild(el('span', 'ifq-in-book-by', 'by Dr. Ishha Farha Quraishy'));
    side.appendChild(book);
    side.appendChild(el('p', 'ifq-in-copy',
      'Her book \u2014 and her seat at the mic. Conversations on artificial intelligence, ' +
      'grace under pressure, and the making of a modern woman in the Arab world.'));
    var pod = el('a', 'ifq-in-pod',
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/></svg>' +
      '<span>The Next Chapter \u2014 Podcast \u2197</span>');
    pod.href = PODCAST_URL;
    pod.target = '_blank';
    pod.rel = 'noopener noreferrer';
    pod.setAttribute('data-cursor-hover', '');
    side.appendChild(pod);
    grid.appendChild(side);

    inner.appendChild(grid);
    section.appendChild(inner);
    return section;
  }

  var done = false;
  function tryInsert() {
    if (done || document.getElementById('featured')) { done = true; return true; }
    var about = document.getElementById('about');
    if (!about || !about.parentNode) return false;
    about.parentNode.insertBefore(buildSection(), about);
    if (!document.getElementById('intro'))
      about.parentNode.insertBefore(buildIntro(), about);
    done = true;
    return true;
  }

  if (!tryInsert()) {
    var mo = new MutationObserver(function () {
      if (tryInsert()) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', tryInsert);
    window.addEventListener('load', function () {
      tryInsert();
      if (done) mo.disconnect();
    });
  }
})();
