/* socials.js — injects Instagram (after #about) plus YouTube & LinkedIn
   (before #collaborations). Standalone pattern, safe alongside React. */
(function () {
  'use strict';

  /* ---------- Config ---------- */
  var IG_URL   = 'https://www.instagram.com/ishhafarhaquraishy/';
  var IG_HANDLE = '@ishhafarhaquraishy';

  var YT_CHANNEL_URL = 'https://www.youtube.com/@TheIshaCode';
  var YT_VIDEOS = [
    {
      id: 'HwALWtCwBak',
      title: 'Is The Reality Deceiving Us?',
      tag: 'Chapter 1'
    },
    {
      id: 'P-CR5aj566Y',
      title: 'Who Really Owns the Future?',
      tag: 'Chapter 2',
      poster: '/images/youtube-chapter-2.jpg'
    },
    {
      id: 'GBYBPloMPLg',
      title: 'The 16-Year-Old Building AI in India',
      tag: 'The Isha Code'
    }
  ];

  var LI_URL = 'https://www.linkedin.com/in/amb-dr-isha-farha-quraishy-56224519/';
  var LI_POST_URL = 'https://www.linkedin.com/posts/isha-farha-quraishy-for-mankind-56224519_how-technology-can-change-education-for-activity-6894725445971968000-sj2H';
  var LI_FOLLOWERS = '9.8K+ Followers \u00B7 500+ Connections';

  /* Local poster used if YouTube thumbnails are unreachable (e.g. offline preview) */
  var YT_LOCAL_POSTER = '/images/runway-black-gold.png';

  /* ---------- Icons ---------- */
  var IG_GLYPH =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2m0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.72 1.48 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Z"/>' +
    '<path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 4Z"/>' +
    '<circle cx="18.41" cy="5.59" r="1.44"/></svg>';

  var YT_GLYPH =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.55 15.57V8.43L15.82 12Z"/></svg>';

  var PLAY_GLYPH =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M8 5.14v13.72c0 .9.98 1.45 1.75.99l10.9-6.86a1.15 1.15 0 0 0 0-1.98L9.75 4.15A1.15 1.15 0 0 0 8 5.14Z"/></svg>';

  var LI_GLYPH =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z"/></svg>';

  /* ---------- Content ---------- */
  var IG_POSTS = [
    { url: 'https://www.instagram.com/p/CxdhK5ivS5u/', type: 'p', code: 'CxdhK5ivS5u', label: 'Beyond the Crown' },
    { url: 'https://www.instagram.com/p/CnZccbwubDy/', type: 'p', code: 'CnZccbwubDy', label: 'On the Journey' },
    { url: 'https://www.instagram.com/reel/DaBYQz-tGmg/', type: 'reel', code: 'DaBYQz-tGmg', label: 'Latest Reel' },
    { url: 'https://www.instagram.com/reel/DaGsOgdtZ2w/', type: 'reel', code: 'DaGsOgdtZ2w', label: 'In Motion' }
  ];
  var IG_STATS = [
    ['637K+', 'Followers'],
    ['1.7K+', 'Posts & Reels'],
    ['\u221E',  'Moments Shared']
  ];

  var BLOG_POSTS = [
    {
      number: '01',
      category: 'Biography',
      title: 'The Story of an Extraordinary Life',
      excerpt: 'The Prolific Woman: The Ishha Experience documents a remarkable journey across AI, diplomacy, global leadership and peace.',
      image: '/images/linkedin-blog-1.jpg',
      url: 'https://www.linkedin.com/feed/update/urn:li:activity:7494866125818585088/'
    },
    {
      number: '02',
      category: 'Legacy',
      title: 'A Glimpse Into a Two-Year Journey',
      excerpt: 'An exclusive birthday edition exploring the discipline, artistry, resilience and humanitarian purpose behind the Ishha experience.',
      image: '/images/linkedin-blog-2.jpg',
      url: 'https://www.linkedin.com/feed/update/urn:li:activity:7444707798413721600/'
    },
    {
      number: '03',
      category: 'Global Visionary',
      title: 'The First Definitive Account of a Global Visionary',
      excerpt: 'A portrait of a bridge-builder connecting AI innovation and international diplomacy with empathy, education and social impact.',
      image: '/images/linkedin-blog-3.jpg',
      url: 'https://www.linkedin.com/feed/update/urn:li:activity:7437068264381247488/'
    },
    {
      number: '04',
      category: 'Leadership',
      title: 'A Powerful New Chapter in Technology Leadership',
      excerpt: 'Celebrating a new journey shaping Cloud Infrastructure, Data and AI for the public sector across the Middle East and Africa.',
      image: '/images/linkedin-blog-4.jpg',
      url: 'https://www.linkedin.com/feed/update/urn:li:activity:7455981449754693632/'
    }
  ];

  /* ---------- Helpers ---------- */
  function el(tag, className, html) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (html) n.innerHTML = html;
    return n;
  }
  function extLink(node, href, label) {
    node.href = href;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    if (label) node.setAttribute('aria-label', label);
    node.setAttribute('data-cursor-hover', '');
    return node;
  }

  function updateContactCopy() {
    var contact = document.getElementById('contact');
    if (!contact) return;
    var heading = contact.querySelector('h2');
    if (heading) heading.textContent = 'Connect With Ishha Farha Quraishy Team';
    Array.prototype.forEach.call(contact.querySelectorAll('p, span'), function (node) {
      if (node.textContent.trim().toUpperCase() === 'GET IN TOUCH') {
        node.textContent = 'CONNECT WITH THE TEAM';
      }
    });

    var form = contact.querySelector('form');
    if (form && !contact.querySelector('.ifq-contact-simple')) {
      var simple = el('div', 'ifq-contact-simple');
      simple.appendChild(el('p', 'ifq-contact-copy',
        'For collaborations, appearances, speaking engagements and partnerships, connect with the team directly.'));
      var links = el('div', 'ifq-contact-links');
      Array.prototype.forEach.call(form.querySelectorAll('a[aria-label]'), function (link) {
        var label = link.getAttribute('aria-label');
        if (label !== 'Instagram' && label !== 'LinkedIn' && label !== 'Email') return;
        link.classList.add('ifq-contact-link');
        link.appendChild(el('span', '', label));
        links.appendChild(link);
      });
      simple.appendChild(links);
      form.parentNode.replaceChild(simple, form);
    }
  }

  /* ---------- Instagram section ---------- */
  function buildInstagram() {
    var section = el('section', 'ifq-soc-section ifq-ig-section');
    section.id = 'instagram';
    var inner = el('div', 'ifq-soc-inner');

    var head = el('div', 'ifq-soc-head');
    var copy = el('div');
    copy.appendChild(el('p', 'ifq-soc-eyebrow', 'Social Presence'));
    copy.appendChild(el('h2', 'ifq-soc-heading',
      'Life Beyond <span class="ifq-soc-gold">the Crown</span>'));
    copy.appendChild(el('p', 'ifq-soc-sub',
      'From global stages and tech summits to quiet moments in Dubai \u2014 ' +
      'follow Dr. Ishha\u2019s world in real time, curated frame by frame on Instagram.'));
    head.appendChild(copy);
    head.appendChild(extLink(
      el('a', 'ifq-soc-cta', IG_GLYPH + '<span>Follow ' + IG_HANDLE + '</span>'),
      IG_URL, 'Follow ' + IG_HANDLE + ' on Instagram'));
    inner.appendChild(head);

    var grid = el('div', 'ifq-ig-grid');
    IG_POSTS.forEach(function (post) {
      var card = el('article', 'ifq-ig-tile');
      var embed = document.createElement('iframe');
      embed.src = 'https://www.instagram.com/' + post.type + '/' + post.code + '/embed/';
      embed.title = 'Instagram: ' + post.label;
      embed.loading = 'lazy';
      embed.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
      embed.setAttribute('allowfullscreen', '');
      embed.setAttribute('frameborder', '0');
      card.appendChild(embed);

      var meta = el('div', 'ifq-ig-tile-meta');
      meta.appendChild(el('span', 'ifq-ig-tile-label', post.label));
      meta.appendChild(extLink(
        el('a', 'ifq-ig-open', IG_GLYPH + '<span>Open</span>'),
        post.url, 'Open ' + post.label + ' on Instagram'));
      card.appendChild(meta);
      grid.appendChild(card);
    });
    inner.appendChild(grid);

    var stats = el('div', 'ifq-soc-stats');
    IG_STATS.forEach(function (s) {
      var d = el('div');
      d.appendChild(el('div', 'ifq-soc-stat-num', s[0]));
      d.appendChild(el('div', 'ifq-soc-stat-label', s[1]));
      stats.appendChild(d);
    });
    inner.appendChild(stats);

    section.appendChild(inner);
    return section;
  }

  function buildYouTubeCard(video) {
    var card = el('article', 'ifq-yt-card');
    var wrap = el('div', 'ifq-yt-player-wrap');
    var frame = el('div', 'ifq-yt-frame');
    var facade = el('button', 'ifq-yt-facade');
    facade.type = 'button';
    facade.setAttribute('aria-label', 'Play video: ' + video.title);
    facade.setAttribute('data-cursor-hover', '');

    var poster = document.createElement('img');
    poster.alt = 'YouTube thumbnail for ' + video.title;
    poster.loading = video.poster ? 'eager' : 'lazy';
    poster.src = video.poster || ('https://i.ytimg.com/vi/' + video.id + '/maxresdefault.jpg');
    var posterStep = 0;
    poster.onerror = function () {
      posterStep++;
      if (posterStep === 1) {
        poster.src = 'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg';
      } else {
        poster.onerror = null;
        poster.src = YT_LOCAL_POSTER;
      }
    };
    facade.appendChild(poster);
    facade.appendChild(el('span', 'ifq-yt-play', PLAY_GLYPH));

    var caption = el('div', 'ifq-yt-caption');
    caption.appendChild(el('span', 'ifq-yt-caption-title', video.title));
    caption.appendChild(el('span', 'ifq-yt-caption-tag', video.tag));

    facade.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + video.id +
        '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = video.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(iframe);
    });

    frame.appendChild(facade);
    frame.appendChild(caption);
    wrap.appendChild(frame);
    card.appendChild(wrap);

    var below = el('div', 'ifq-yt-below');
    below.appendChild(extLink(
      el('a', 'ifq-yt-watchlink', 'Watch on YouTube \u2197'),
      'https://www.youtube.com/watch?v=' + video.id,
      'Watch ' + video.title + ' on YouTube'));
    below.appendChild(el('span', 'ifq-yt-caption-tag', video.tag));
    card.appendChild(below);
    return card;
  }

  /* ---------- YouTube section (cinematic lite-embeds) ---------- */
  function buildYouTube() {
    var section = el('section', 'ifq-soc-section ifq-yt-section');
    section.id = 'youtube';
    var inner = el('div', 'ifq-soc-inner');

    var head = el('div', 'ifq-soc-head');
    var copy = el('div');
    copy.appendChild(el('p', 'ifq-soc-eyebrow', 'The World Vibez \u00B7 YouTube'));
    copy.appendChild(el('h2', 'ifq-soc-heading',
      'Stories in <span class="ifq-soc-gold">Motion</span>'));
    copy.appendChild(el('p', 'ifq-soc-sub',
      'Conversations, keynotes and journeys \u2014 experience Dr. Ishha\u2019s voice and vision ' +
      'on her channel, The Isha Code.'));
    head.appendChild(copy);
    head.appendChild(extLink(
      el('a', 'ifq-soc-cta', YT_GLYPH + '<span>Visit the Channel</span>'),
      YT_CHANNEL_URL, 'Visit The Isha Code on YouTube'));
    inner.appendChild(head);

    var grid = el('div', 'ifq-yt-grid');
    YT_VIDEOS.forEach(function (video) {
      grid.appendChild(buildYouTubeCard(video));
    });
    inner.appendChild(grid);

    section.appendChild(inner);
    return section;
  }

  /* ---------- Blogs section ---------- */
  function buildBlogs() {
    var section = el('section', 'ifq-soc-section ifq-blog-section');
    section.id = 'blogs';
    var inner = el('div', 'ifq-soc-inner');

    var head = el('div', 'ifq-soc-head');
    var copy = el('div');
    copy.appendChild(el('p', 'ifq-soc-eyebrow', 'Thoughts & Stories'));
    copy.appendChild(el('h2', 'ifq-soc-heading',
      'From the <span class="ifq-soc-gold">Journal</span>'));
    copy.appendChild(el('p', 'ifq-soc-sub',
      'Stories of vision, leadership and the making of a legacy \u2014 selected reads from LinkedIn.'));
    head.appendChild(copy);
    head.appendChild(el('span', 'ifq-blog-count', '04 STORIES'));
    inner.appendChild(head);

    var grid = el('div', 'ifq-blog-grid');
    BLOG_POSTS.forEach(function (post) {
      var card = extLink(el('a', 'ifq-blog-card'), post.url,
        'Read ' + post.title + ' on LinkedIn');
      var media = el('div', 'ifq-blog-media');
      var img = document.createElement('img');
      img.src = post.image;
      img.alt = 'LinkedIn post thumbnail: ' + post.title;
      img.loading = 'lazy';
      media.appendChild(img);
      var top = el('div', 'ifq-blog-card-top');
      top.appendChild(el('span', 'ifq-blog-number', post.number));
      top.appendChild(el('span', 'ifq-blog-category', post.category));
      media.appendChild(top);
      media.appendChild(el('span', 'ifq-blog-media-link', LI_GLYPH + '<span>View post</span>'));
      card.appendChild(media);

      var body = el('div', 'ifq-blog-body');
      body.appendChild(el('span', 'ifq-blog-rule'));
      body.appendChild(el('h3', 'ifq-blog-title', post.title));
      body.appendChild(el('p', 'ifq-blog-excerpt', post.excerpt));
      var foot = el('div', 'ifq-blog-foot');
      foot.appendChild(el('span', '', 'Read on LinkedIn'));
      foot.appendChild(el('span', 'ifq-blog-arrow', '\u2197'));
      body.appendChild(foot);
      card.appendChild(body);
      grid.appendChild(card);
    });
    inner.appendChild(grid);
    section.appendChild(inner);
    return section;
  }

  /* ---------- LinkedIn section ---------- */
  function buildLinkedIn() {
    var section = el('section', 'ifq-soc-section ifq-li-section');
    section.id = 'linkedin';
    var inner = el('div', 'ifq-soc-inner');

    var row = el('div', 'ifq-li-row');
    var left = el('div', 'ifq-li-left');
    left.appendChild(el('div', 'ifq-li-badge', LI_GLYPH));

    var text = el('div');
    text.appendChild(el('h2', 'ifq-li-heading',
      'Connect With <span class="ifq-soc-gold">Ishha Farha Quraishy</span> Team'));
    text.appendChild(el('p', 'ifq-li-copy',
      'Thought leadership in AI, the Metaverse and emerging technology \u2014 ' +
      'keynotes, panels and partnerships, shared with a global professional network.'));
    var chips = el('div', 'ifq-li-chips');
    ['AI & Spatial-AI Strategy', 'Keynotes & Panels', 'Global Partnerships']
      .forEach(function (c) { chips.appendChild(el('span', 'ifq-li-chip', c)); });
    text.appendChild(chips);
    left.appendChild(text);
    row.appendChild(left);

    var ctaCol = el('div', 'ifq-li-ctacol');
    ctaCol.appendChild(extLink(
      el('a', 'ifq-soc-cta', LI_GLYPH + '<span>Connect on LinkedIn</span>'),
      LI_URL, 'Connect with Dr. Ishha Farha Quraishy on LinkedIn'));
    ctaCol.appendChild(el('p', 'ifq-li-followers', LI_FOLLOWERS));
    row.appendChild(ctaCol);

    inner.appendChild(row);

    // Featured post — links to her real LinkedIn post
    var post = extLink(el('a', 'ifq-li-post'), LI_POST_URL,
      'Read Dr. Ishha\u2019s featured post on LinkedIn');
    var ph = el('div', 'ifq-li-post-head');
    ph.appendChild(el('span', 'ifq-li-post-badge', LI_GLYPH));
    ph.appendChild(el('span', 'ifq-li-post-eyebrow', 'Featured Post'));
    post.appendChild(ph);
    post.appendChild(el('p', 'ifq-li-post-text',
      '\u201CHow Technology can change Education for a better Tomorrow\u201D ' +
      '\u2014 a talk session for the Government of Sharjah, organized by Art4you Gallery.'));
    var pm = el('div', 'ifq-li-post-meta');
    pm.appendChild(el('span', '', 'Amb. Dr. Isha Farha Quraishy'));
    pm.appendChild(el('span', 'ifq-li-post-read', 'Read on LinkedIn \u2197'));
    post.appendChild(pm);
    inner.appendChild(post);

    section.appendChild(inner);
    return section;
  }

  /* ---------- Injection: Instagram after #about; YouTube & LinkedIn before #collaborations ---------- */
  var done = false;
  function tryInsert() {
    if (done) return true;
    var about = document.getElementById('about');
    var anchor = document.getElementById('collaborations') || document.getElementById('contact');
    var journey = document.getElementById('journey');
    if (!about || !about.parentNode || !anchor || !anchor.parentNode ||
        !journey || !journey.parentNode) return false;
    if (journey && !document.getElementById('blogs')) {
      var blogs = buildBlogs();
      var navSentinel = el('span', 'ifq-blog-nav-sentinel');
      navSentinel.id = 'journey';
      blogs.insertBefore(navSentinel, blogs.firstChild);
      journey.id = 'journey-removed';
      journey.parentNode.insertBefore(blogs, journey);
      journey.hidden = true;
      journey.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(document.querySelectorAll('a[href="#journey"]'), function (link) {
        link.setAttribute('href', '#blogs');
        if (link.getAttribute('aria-label') === 'Journey') link.setAttribute('aria-label', 'Blogs');
        if (link.textContent.trim() === 'Journey') {
          var label = link.querySelector('span');
          if (label) label.textContent = 'Blogs';
          else link.textContent = 'Blogs';
        }
        if (link.textContent.trim() === 'View Achievements') link.textContent = 'Read the Stories';
      });
    }
    if (!document.getElementById('youtube'))
      about.parentNode.insertBefore(buildYouTube(), about.nextSibling);
    if (!document.getElementById('instagram')) {
      var yt = document.getElementById('youtube');
      yt.parentNode.insertBefore(buildInstagram(), yt.nextSibling);
    }
    if (!document.getElementById('linkedin'))
      anchor.parentNode.insertBefore(buildLinkedIn(), anchor);
    updateContactCopy();
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
