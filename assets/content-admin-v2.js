(function () {
  'use strict';

  var DEFAULT_CONTENT = {
    contact: { eyebrow: 'Connect With the Team', heading: 'Connect With Ishha Farha Quraishy Team', copy: 'For collaborations, appearances, speaking engagements and partnerships, connect with the team directly.', instagram: 'https://www.instagram.com/ishhafarhaquraishy/', linkedin: 'https://www.linkedin.com/in/amb-dr-isha-farha-quraishy-56224519/', email: 'hello@ishafarhaquraishy.com' },
    youtube: { channel: 'https://www.youtube.com/@TheIshaCode', videos: [
      { id: 'HwALWtCwBak', title: 'Is The Reality Deceiving Us?', tag: 'Chapter 1' },
      { id: 'P-CR5aj566Y', title: 'Who Really Owns the Future?', tag: 'Chapter 2' },
      { id: 'GBYBPloMPLg', title: 'The 16-Year-Old Building AI in India', tag: 'The Isha Code' }
    ] },
    instagram: { profile: 'https://www.instagram.com/ishhafarhaquraishy/', posts: [
      { url: 'https://www.instagram.com/p/CxdhK5ivS5u/', label: 'Beyond the Crown' },
      { url: 'https://www.instagram.com/p/CnZccbwubDy/', label: 'On the Journey' },
      { url: 'https://www.instagram.com/reel/DaBYQz-tGmg/', label: 'Latest Reel' },
      { url: 'https://www.instagram.com/reel/DaGsOgdtZ2w/', label: 'In Motion' }
    ] },
    blogs: [], overrides: []
  };

  var content = null, tab = 'visual', key = '', selected = null;
  function $(s) { return document.querySelector(s); }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function esc(s) { return String(s || '').replace(/[&<>\"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]; }); }
  function field(label, path, value, area) { return '<div class="field ' + (area ? 'wide' : '') + '"><label>' + label + '</label>' + (area ? '<textarea data-path="' + path + '">' + esc(value) + '</textarea>' : '<input data-path="' + path + '" value="' + esc(value) + '">') + '</div>'; }
  function merge(base, saved) {
    var out = clone(base);
    Object.keys(saved || {}).forEach(function (k) { out[k] = saved[k]; });
    out.overrides = Array.isArray(out.overrides) ? out.overrides : [];
    return out;
  }
  function setPath(obj, path, value) {
    var p = path.split('.'), x = obj;
    p.slice(0, -1).forEach(function (k) { x = x[k]; });
    x[p[p.length - 1]] = value;
  }
  function localSaved() {
    try { return JSON.parse(localStorage.getItem('ifq_content') || 'null'); } catch (_) { return null; }
  }

  function render() {
    var h = '';
    if (tab === 'visual') {
      h = '<p class="muted visual-help">Click any text, image or link in the website preview. Edit it on the right, then choose <strong>Publish Changes</strong>.</p>' +
        '<div class="visual-grid"><div class="preview-shell"><iframe id="sitePreview" src="/?editorPreview=' + Date.now() + '"></iframe></div>' +
        '<aside class="inspect"><h3 id="inspectTitle">Select an element</h3><p class="note" id="inspectNote">You can edit headings, paragraphs, buttons, image sources and destinations for links.</p><div id="inspectFields"></div><div class="saved"><label>Saved visual changes</label><div id="savedList"></div></div></aside></div>';
    }
    if (tab === 'contact') {
      var c = content.contact;
      h = '<div class="grid">' + field('Section label', 'contact.eyebrow', c.eyebrow) + field('Heading', 'contact.heading', c.heading) + field('Introductory text', 'contact.copy', c.copy, true) + field('Instagram URL', 'contact.instagram', c.instagram) + field('LinkedIn URL', 'contact.linkedin', c.linkedin) + field('Email address', 'contact.email', c.email) + '</div>';
    }
    if (tab === 'youtube') {
      h = field('Channel URL', 'youtube.channel', content.youtube.channel);
      content.youtube.videos.forEach(function (v, i) { h += '<div class="item"><p class="itemhead">Video ' + (i + 1) + '</p><div class="grid">' + field('YouTube video ID', 'youtube.videos.' + i + '.id', v.id) + field('Label', 'youtube.videos.' + i + '.tag', v.tag) + field('Title', 'youtube.videos.' + i + '.title', v.title, true) + '</div></div>'; });
    }
    if (tab === 'instagram') {
      h = field('Profile URL', 'instagram.profile', content.instagram.profile);
      content.instagram.posts.forEach(function (v, i) { h += '<div class="item"><p class="itemhead">Post ' + (i + 1) + '</p><div class="grid">' + field('Label', 'instagram.posts.' + i + '.label', v.label) + field('Post or reel URL', 'instagram.posts.' + i + '.url', v.url) + '</div></div>'; });
    }
    if (tab === 'blogs') {
      (content.blogs || []).forEach(function (v, i) { h += '<div class="item"><p class="itemhead">Story ' + (i + 1) + '</p><div class="grid">' + field('Category', 'blogs.' + i + '.category', v.category) + field('LinkedIn URL', 'blogs.' + i + '.url', v.url) + field('Thumbnail path or URL', 'blogs.' + i + '.image', v.image) + field('Title', 'blogs.' + i + '.title', v.title, true) + field('Excerpt', 'blogs.' + i + '.excerpt', v.excerpt, true) + '</div></div>'; });
    }
    $('#editor').innerHTML = h;
    document.querySelectorAll('[data-path]').forEach(function (el) { el.addEventListener('input', function () { setPath(content, el.dataset.path, el.value); }); });
    if (tab === 'visual') bindPreview();
  }

  function selectorFor(el) {
    if (el.id) return '#' + CSS.escape(el.id);
    var root = el.closest('section[id], header[id], footer[id], main[id]') || el.ownerDocument.body;
    var parts = [];
    while (el && el !== root) {
      var tag = el.tagName.toLowerCase();
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (n) { return n.tagName === el.tagName; });
      parts.unshift(tag + (siblings.length > 1 ? ':nth-of-type(' + (siblings.indexOf(el) + 1) + ')' : ''));
      el = el.parentElement;
    }
    return (root.id ? '#' + CSS.escape(root.id) : 'body') + ' ' + parts.join(' > ');
  }
  function findOverride(selector) {
    return content.overrides.find(function (o) { return o.selector === selector; });
  }
  function bindPreview() {
    var frame = $('#sitePreview');
    frame.addEventListener('load', function () {
      var doc = frame.contentDocument;
      if (!doc) return;
      doc.addEventListener('click', function (ev) {
        var el = ev.target.closest('img,a,h1,h2,h3,h4,p,button,span');
        if (!el || el.closest('#ifq-chatbot-root')) return;
        ev.preventDefault(); ev.stopPropagation();
        if (selected && selected.el) selected.el.style.outline = '';
        el.style.outline = '3px solid #d4af37'; el.style.outlineOffset = '3px';
        selected = { el: el, selector: selectorFor(el), type: el.tagName === 'IMG' ? 'image' : (el.tagName === 'A' ? 'link' : 'text') };
        drawInspector();
      }, true);
      renderSaved();
    });
  }
  function upsertSelected(values) {
    var o = findOverride(selected.selector);
    if (!o) { o = { selector: selected.selector, type: selected.type }; content.overrides.push(o); }
    Object.keys(values).forEach(function (k) { o[k] = values[k]; });
    if (o.type === 'text') selected.el.textContent = o.text;
    if (o.type === 'image') { selected.el.src = o.src; selected.el.alt = o.alt || ''; }
    if (o.type === 'link') { selected.el.href = o.href; if (o.text) selected.el.textContent = o.text; }
    renderSaved();
  }
  function drawInspector() {
    var el = selected.el, box = $('#inspectFields');
    $('#inspectTitle').textContent = selected.type === 'image' ? 'Edit image' : selected.type === 'link' ? 'Edit link' : 'Edit text';
    $('#inspectNote').textContent = selected.selector;
    if (selected.type === 'text') box.innerHTML = '<div class="field"><label>Text</label><textarea id="visualText">' + esc(el.textContent.trim()) + '</textarea></div>';
    if (selected.type === 'image') box.innerHTML = '<div class="field"><label>Image path or URL</label><input id="visualSrc" value="' + esc(el.getAttribute('src') || '') + '"></div><div class="field"><label>Alternative text</label><input id="visualAlt" value="' + esc(el.getAttribute('alt') || '') + '"></div>';
    if (selected.type === 'link') box.innerHTML = '<div class="field"><label>Link text</label><textarea id="visualText">' + esc(el.textContent.trim()) + '</textarea></div><div class="field"><label>Destination URL</label><input id="visualHref" value="' + esc(el.getAttribute('href') || '') + '"></div>';
    box.querySelectorAll('input,textarea').forEach(function (input) { input.addEventListener('input', function () {
      if (selected.type === 'text') upsertSelected({ text: $('#visualText').value });
      if (selected.type === 'image') upsertSelected({ src: $('#visualSrc').value, alt: $('#visualAlt').value });
      if (selected.type === 'link') upsertSelected({ text: $('#visualText').value, href: $('#visualHref').value });
    }); });
  }
  function renderSaved() {
    var list = $('#savedList'); if (!list) return;
    list.innerHTML = content.overrides.length ? '' : '<p class="note">No visual changes saved yet.</p>';
    content.overrides.forEach(function (o, i) {
      var row = document.createElement('div'); row.className = 'saved-item';
      row.innerHTML = '<span>' + esc(o.type + ' · ' + o.selector) + '</span><button class="mini" type="button">Remove</button>';
      row.querySelector('button').onclick = function () { content.overrides.splice(i, 1); render(); };
      list.appendChild(row);
    });
  }
  function openStudio(data) {
    content = merge(DEFAULT_CONTENT, data || localSaved() || {});
    $('#login').classList.add('hide'); $('#app').classList.remove('hide'); render();
  }
  function load() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return Promise.resolve(openStudio(localSaved()));
    return fetch('/api/content', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw Error('Could not load content'); return r.json(); }).then(openStudio);
  }
  $('#enter').onclick = function () {
    key = $('#pass').value.trim();
    if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') && key !== 'admin') { $('#error').textContent = 'Incorrect access key'; return; }
    sessionStorage.setItem('ifq_admin_key', key); load().catch(function (e) { $('#error').textContent = e.message; });
  };
  document.querySelectorAll('.tab').forEach(function (b) { b.onclick = function () { document.querySelector('.tab.on').classList.remove('on'); b.classList.add('on'); tab = b.dataset.tab; render(); }; });
  $('#save').onclick = function () {
    var status = $('#status'); status.textContent = 'Publishing…'; localStorage.setItem('ifq_content', JSON.stringify(content));
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') { status.textContent = 'Saved locally — refresh the website preview'; setTimeout(function () { status.textContent = ''; }, 3500); return; }
    fetch('/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', 'x-admin-key': key || sessionStorage.getItem('ifq_admin_key') || '' }, body: JSON.stringify({ content: content }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw Error(j.error || 'Save failed'); return j; }); })
      .then(function () { status.textContent = 'Published successfully'; setTimeout(function () { status.textContent = ''; }, 2500); })
      .catch(function (e) { status.textContent = e.message; });
  };
  key = sessionStorage.getItem('ifq_admin_key') || '';
  if (key) load().catch(function () {});
})();
