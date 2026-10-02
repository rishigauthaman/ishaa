(function () {
  'use strict';
  function text(root, selector, value) {
    var node = root && root.querySelector(selector);
    if (node && value) node.textContent = value;
  }
  function apply(content) {
    if (!content) return;
    var contact = document.getElementById('contact');
    if (contact && content.contact) {
      text(contact, '.ifq-contact-copy', content.contact.copy);
      text(contact, '.ifq-soc-eyebrow', content.contact.eyebrow);
      var h = contact.querySelector('h2'); if (h) h.textContent = content.contact.heading;
      var social = contact.querySelectorAll('.ifq-contact-link');
      Array.prototype.forEach.call(social, function (a) {
        var label = a.getAttribute('aria-label');
        if (label === 'Instagram') a.href = content.contact.instagram;
        if (label === 'LinkedIn') a.href = content.contact.linkedin;
        if (label === 'Email') a.href = 'mailto:' + content.contact.email;
      });
    }
    if (content.instagram) {
      var profile = document.querySelector('#instagram .ifq-soc-cta'); if (profile) profile.href = content.instagram.profile;
      var igCards = document.querySelectorAll('.ifq-ig-tile');
      Array.prototype.forEach.call(igCards, function (card, i) {
        var post = content.instagram.posts && content.instagram.posts[i]; if (!post) return;
        text(card, '.ifq-ig-tile-label', post.label);
        var open = card.querySelector('.ifq-ig-open'); if (open) open.href = post.url;
        var frame = card.querySelector('iframe'); if (frame) frame.src = post.url.replace(/\?.*$/, '').replace(/\/$/, '') + '/embed/';
      });
    }
    if (content.youtube) {
      var channel = document.querySelector('#youtube .ifq-soc-cta');
      if (channel) channel.href = content.youtube.channel;
      var cards = document.querySelectorAll('.ifq-yt-card');
      Array.prototype.forEach.call(cards, function (card, i) {
        var video = content.youtube.videos && content.youtube.videos[i]; if (!video) return;
        text(card, '.ifq-yt-caption-title', video.title); text(card, '.ifq-yt-caption-tag', video.tag);
        var watch = card.querySelector('.ifq-yt-watchlink'); if (watch) watch.href = 'https://www.youtube.com/watch?v=' + video.id;
        var button = card.querySelector('.ifq-yt-facade'); if (button) button.setAttribute('aria-label', 'Play video: ' + video.title);
        var img = card.querySelector('.ifq-yt-facade img'); if (img) img.src = 'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg';
        if (button) button.onclick = function () {
          var frame = card.querySelector('.ifq-yt-frame'); var iframe = document.createElement('iframe');
          iframe.src = 'https://www.youtube-nocookie.com/embed/' + video.id + '?autoplay=1&rel=0'; iframe.title = video.title;
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; iframe.allowFullscreen = true;
          frame.innerHTML = ''; frame.appendChild(iframe);
        };
      });
    }
    var blogCards = document.querySelectorAll('.ifq-blog-card');
    Array.prototype.forEach.call(blogCards, function (card, i) {
      var post = content.blogs && content.blogs[i]; if (!post) return;
      card.href = post.url; text(card, '.ifq-blog-category', post.category); text(card, '.ifq-blog-title', post.title); text(card, '.ifq-blog-excerpt', post.excerpt);
      var image = card.querySelector('.ifq-blog-media img'); if (image && post.image) image.src = post.image;
    });
  }
  fetch('/api/content').then(function (r) { return r.ok ? r.json() : null; }).then(function (content) {
    if (!content) return;
    var tries = 0, timer = setInterval(function () {
      tries++; if (document.getElementById('blogs') && document.querySelector('.ifq-contact-simple')) { clearInterval(timer); apply(content); }
      if (tries > 100) clearInterval(timer);
    }, 100);
  }).catch(function () {});
})();
