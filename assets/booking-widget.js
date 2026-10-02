/* booking-widget.js — booking agent inside the AI Concierge chatbot.
   Renders the flow as native chat bubbles; talks to /api/booking/*. */
(function () {
  'use strict';

  var API = '/api/booking';
  var CAL_GLYPH = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z"/></svg>';
  var CHECK_GLYPH = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>';

  var state = { config: null, typeId: null, typeName: '', minutes: 0, date: '', time: '', busy: false };
  var preselect = null;

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function messagesBox() { return document.getElementById('ifq-messages'); }
  function scrollDown() {
    var m = messagesBox();
    if (m) m.scrollTop = m.scrollHeight;
  }
  function api(path, opts) {
    return fetch(API + path, opts).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; });
    });
  }
  function fmtDay(dateStr) {
    var d = new Date(dateStr + 'T12:00:00Z');
    return {
      wd: d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }),
      dm: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
    };
  }
  function fmtDayLong(dateStr) {
    return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  }
  function localHint(dateStr, time) {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz || tz === 'Asia/Dubai') return '';
      var d = new Date(dateStr + 'T' + time + ':00+04:00');
      return ' (' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' your time)';
    } catch (e) { return ''; }
  }

  /* ---------- card lifecycle ---------- */
  var card = null;

  function openFlow() {
    var box = messagesBox();
    if (!box) return;
    if (card && card.isConnected) { card.remove(); }
    var item = el('div', 'ifq-msg-item ifq-msg-bot');
    var bubble = el('div', 'ifq-msg-bubble ifqbk-bubble');
    card = el('div', 'ifqbk-card');
    bubble.appendChild(card);
    item.appendChild(bubble);
    box.appendChild(item);
    stepLoading('Consulting her calendar');
    api('/ping').then(function (r) {
      if (!r.ok) throw new Error('offline');
      return api('/config');
    }).then(function (r) {
      if (!r.ok) throw new Error('offline');
      state.config = r.body;
      stepType();
    }).catch(function () {
      card.innerHTML = '';
      card.appendChild(el('p', 'ifqbk-title', 'Booking is momentarily unavailable'));
      card.appendChild(el('p', 'ifqbk-sub',
        'Please use the contact form at the bottom of this page, and Dr. Ishha\u2019s office will reach out to arrange your meeting.'));
      scrollDown();
    });
  }

  function stepLoading(label) {
    card.innerHTML = '';
    var l = el('div', 'ifqbk-loading');
    l.appendChild(el('span', 'ifqbk-spinner'));
    l.appendChild(el('span', '', label + '\u2026'));
    card.appendChild(l);
    scrollDown();
  }

  function header(title, sub) {
    card.appendChild(el('p', 'ifqbk-title', title));
    if (sub) card.appendChild(el('p', 'ifqbk-sub', sub));
  }

  function backRow(onBack) {
    var row = el('div', 'ifqbk-row');
    var b = el('button', 'ifqbk-back', '\u2190 Back');
    b.addEventListener('click', onBack);
    row.appendChild(b);
    card.appendChild(row);
  }

  /* ---------- steps ---------- */
  function stepType() {
    if (preselect && state.config) {
      var pre = state.config.types.filter(function (t) { return t.id === preselect; })[0];
      preselect = null;
      if (pre) {
        state.typeId = pre.id; state.typeName = pre.name; state.minutes = pre.minutes;
        return stepDate();
      }
    }
    card.innerHTML = '';
    header('Book a Meeting with Dr. Ishha',
      state.config.location + '. Requests are reviewed and confirmed by her office.');
    card.appendChild(el('p', 'ifqbk-step-label', '1 \u00B7 Choose the meeting type'));
    var opts = el('div', 'ifqbk-options');
    state.config.types.forEach(function (t) {
      var o = el('button', 'ifqbk-opt', '<span>' + t.name + '</span><small>' + t.minutes + ' min</small>');
      o.addEventListener('click', function () {
        state.typeId = t.id; state.typeName = t.name; state.minutes = t.minutes;
        stepDate();
      });
      opts.appendChild(o);
    });
    card.appendChild(opts);
    scrollDown();
  }

  function stepDate() {
    card.innerHTML = '';
    header(state.typeName, 'All times are Dubai time (GST).');
    card.appendChild(el('p', 'ifqbk-step-label', '2 \u00B7 Pick a date'));
    var chips = el('div', 'ifqbk-chips');
    state.config.days.slice(0, 21).forEach(function (d) {
      var f = fmtDay(d);
      var c = el('button', 'ifqbk-chip', '<b>' + f.wd + '</b>' + f.dm);
      c.addEventListener('click', function () { state.date = d; stepTime(); });
      chips.appendChild(c);
    });
    card.appendChild(chips);
    backRow(stepType);
    scrollDown();
  }

  function stepTime() {
    stepLoading('Finding open times');
    api('/slots?date=' + state.date + '&type=' + state.typeId).then(function (r) {
      card.innerHTML = '';
      header(fmtDayLong(state.date), 'Dubai time (GST). Each meeting includes private buffer time.');
      card.appendChild(el('p', 'ifqbk-step-label', '3 \u00B7 Pick a time'));
      var slots = (r.body && r.body.slots) || [];
      if (!slots.length) {
        card.appendChild(el('p', 'ifqbk-sub', 'No times remain on this day \u2014 please choose another date.'));
      } else {
        var chips = el('div', 'ifqbk-chips');
        slots.forEach(function (t) {
          var c = el('button', 'ifqbk-chip', '<b>' + t + '</b>' + (localHint(state.date, t) || 'GST'));
          c.addEventListener('click', function () { state.time = t; stepForm(); });
          chips.appendChild(c);
        });
        card.appendChild(chips);
      }
      backRow(stepDate);
      scrollDown();
    });
  }

  function stepForm(prefill) {
    card.innerHTML = '';
    header(state.typeName + ' \u00B7 ' + fmtDayLong(state.date) + ' \u00B7 ' + state.time,
      'A few details for Dr. Ishha\u2019s office.');
    card.appendChild(el('p', 'ifqbk-step-label', '4 \u00B7 Your details'));

    var form = el('div', 'ifqbk-form');
    function input(id, ph, type, val) {
      var i = el('input', 'ifqbk-input');
      i.id = 'ifqbk-' + id; i.placeholder = ph; i.type = type || 'text';
      if (val) i.value = val;
      return i;
    }
    var p = prefill || {};
    var fName = input('name', 'Full name *', 'text', p.name);
    var fEmail = input('email', 'Email *', 'email', p.email);
    var fPhone = input('phone', 'Phone / WhatsApp', 'tel', p.phone);
    var fOrg = input('org', 'Organization', 'text', p.org);
    var fPurpose = el('textarea', 'ifqbk-textarea');
    fPurpose.id = 'ifqbk-purpose'; fPurpose.placeholder = 'Purpose of the meeting';
    if (p.purpose) fPurpose.value = p.purpose;
    var hp = input('website', 'Website', 'text'); hp.className = 'ifqbk-hp'; hp.tabIndex = -1; hp.autocomplete = 'off';

    [fName, fEmail, fPhone, fOrg, fPurpose, hp].forEach(function (f) { form.appendChild(f); });
    card.appendChild(form);
    var err = el('p', 'ifqbk-error', ''); err.style.display = 'none';
    card.appendChild(err);

    var row = el('div', 'ifqbk-row');
    var back = el('button', 'ifqbk-back', '\u2190 Back');
    back.addEventListener('click', stepTime);
    var next = el('button', 'ifqbk-btn', 'Review Request');
    next.addEventListener('click', function () {
      var name = fName.value.trim(), email = fEmail.value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        err.innerText = 'Please provide your name and a valid email.';
        err.style.display = 'block';
        return;
      }
      stepReview({
        name: name, email: email, phone: fPhone.value.trim(),
        org: fOrg.value.trim(), purpose: fPurpose.value.trim(), website: hp.value
      });
    });
    row.appendChild(back); row.appendChild(next);
    card.appendChild(row);
    scrollDown();
  }

  function stepReview(details) {
    card.innerHTML = '';
    header('One last look', 'Dr. Ishha\u2019s office will confirm by email once approved.');
    card.appendChild(el('div', 'ifqbk-summary',
      '<b>' + state.typeName + '</b> \u00B7 ' + state.minutes + ' min<br>' +
      '<b>' + fmtDayLong(state.date) + '</b> at <b>' + state.time + '</b> (Dubai, GST)' + localHint(state.date, state.time) + '<br>' +
      state.config.location + '<br><br>' +
      details.name + (details.org ? ' \u00B7 ' + details.org : '') + '<br>' +
      details.email + (details.phone ? ' \u00B7 ' + details.phone : '') +
      (details.purpose ? '<br><i>' + details.purpose.replace(/</g, '&lt;') + '</i>' : '')));

    var err = el('p', 'ifqbk-error', ''); err.style.display = 'none';
    card.appendChild(err);
    var row = el('div', 'ifqbk-row');
    var back = el('button', 'ifqbk-back', '\u2190 Edit');
    back.addEventListener('click', function () { stepForm(details); });
    var send = el('button', 'ifqbk-btn', 'Send Request');
    send.addEventListener('click', function () {
      if (state.busy) return;
      state.busy = true; send.disabled = true;
      api('/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          typeId: state.typeId, date: state.date, time: state.time,
          name: details.name, email: details.email, phone: details.phone,
          org: details.org, purpose: details.purpose, website: details.website
        })
      }).then(function (r) {
        state.busy = false;
        if (r.ok) return stepDone();
        send.disabled = false;
        err.innerText = (r.body && r.body.error) || 'Something went wrong \u2014 please try again.';
        err.style.display = 'block';
        if (r.status === 409) setTimeout(stepTime, 1600); // slot taken -> refresh times
      }).catch(function () {
        state.busy = false; send.disabled = false;
        err.innerText = 'Connection issue \u2014 please try again.';
        err.style.display = 'block';
      });
    });
    row.appendChild(back); row.appendChild(send);
    card.appendChild(row);
    scrollDown();
  }

  function stepDone() {
    card.innerHTML = '';
    var s = el('div', 'ifqbk-success');
    s.appendChild(el('div', 'ifqbk-check', CHECK_GLYPH));
    s.appendChild(el('p', 'ifqbk-title', 'Request sent with grace \u2728'));
    s.appendChild(el('p', 'ifqbk-sub',
      'Your requested slot is now held. Dr. Ishha\u2019s office will review and confirm to <b>your email</b> shortly. ' +
      'Venue details in Dubai are shared upon confirmation.'));
    card.appendChild(s);
    scrollDown();
  }

  /* ---------- launchers ---------- */
  function installLaunchers() {
    var win = document.getElementById('ifq-window');
    if (!win || win.__ifqbk) return false;
    win.__ifqbk = true;

    // 1. Launcher bar above the input area
    var inputArea = win.querySelector('.ifq-chat-input-area');
    if (inputArea) {
      var bar = el('div', 'ifqbk-launcher');
      var btn = el('button', 'ifqbk-launch-btn', CAL_GLYPH + '<span>Book a Meeting with Dr. Ishha</span>');
      btn.addEventListener('click', openFlow);
      bar.appendChild(btn);
      inputArea.parentNode.insertBefore(bar, inputArea);
    }

    // 2. Header calendar icon (next to settings)
    var actions = win.querySelector('.ifq-header-actions');
    if (actions) {
      var hbtn = el('button', 'ifq-header-btn', CAL_GLYPH);
      hbtn.title = 'Book a Meeting';
      hbtn.addEventListener('click', openFlow);
      actions.insertBefore(hbtn, actions.firstChild);
    }
    return true;
  }

  // 3. Typed intent: intercept /api/chat and open the flow on booking phrases
  var INTENT = /\b(book(ing)?|appoint(ment)?|schedul(e|ing)|meet(ing)? (with|her|dr)|calendar|available|availability|free slot|time slot)\b/i;
  var realFetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    if (typeof url === 'string' && url.indexOf('/api/chat') !== -1) {
      var msg = '';
      try { msg = (JSON.parse((opts && opts.body) || '{}').message || ''); } catch (e) {}
      if (INTENT.test(msg)) {
        var reply = 'It would be my honour to arrange that. Allow me to open Dr. Ishha\u2019s calendar for you \u2728';
        setTimeout(openFlow, reply.length * 12 + 800); // after the typewriter finishes
        return Promise.resolve(new Response(JSON.stringify({ reply: reply }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
    }
    return realFetch(url, opts);
  };

  // Public hook: open the booking flow (optionally preselecting a meeting type)
  window.IFQ_OPEN_BOOKING = function (typeId) {
    preselect = typeId || null;
    var w = document.getElementById('ifq-window');
    if (w && !w.classList.contains('is-active')) {
      var f = document.getElementById('ifq-fab');
      if (f) f.click();
    }
    setTimeout(openFlow, 400);
  };

  // Wait for the chatbot UI to exist
  if (!installLaunchers()) {
    var mo = new MutationObserver(function () {
      if (installLaunchers()) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', function () { installLaunchers(); });
  }
})();
