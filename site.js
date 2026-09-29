/* Weave site: progressive enhancement only.
   The page reads and works without this file: the Thread is fully drawn, the
   contact form posts to contact.php, and "Show the week" shows both lanes.
   No libraries, no third-party requests. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- The Thread: IntersectionObserver fallback ----------
     Browsers with scroll-driven animations draw the line in CSS. Elsewhere,
     draw each section's segment once when it scrolls into view. */
  (function thread() {
    var sections = document.querySelectorAll('.threaded');
    var hasScrollTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
    if (reduceMotion || hasScrollTimeline || !('IntersectionObserver' in window) || !sections.length) return;

    root.classList.add('thread-io');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-drawn');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -25% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- Show the week: Before / After switch ---------- */
  (function week() {
    var box = document.getElementById('week');
    if (!box) return;
    var sw = box.querySelector('.switch');
    if (!sw) return;

    sw.hidden = false;
    sw.addEventListener('click', function () {
      var after = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(after));
      box.setAttribute('data-state', after ? 'after' : 'before');
    });
  })();

  /* ---------- Contact form ---------- */
  (function contact() {
    var form = document.getElementById('contact-form');
    if (!form || !window.fetch || !window.FormData) return;

    var loadedAt = Date.now();
    var status = document.getElementById('cf-status');
    var button = form.querySelector('button[type="submit"]');
    var timer = form.elements.t;
    var fields = ['name', 'email', 'message'];
    var labels = { name: 'your name', email: 'your email address', message: 'a short description' };

    form.noValidate = true; // we show our own messages; without JS the browser validates natively

    function errorEl(name) { return document.getElementById('cf-' + name + '-error'); }

    function setError(name, text) {
      var input = form.elements[name];
      var el = errorEl(name);
      if (!input || !el) return;
      if (text) {
        el.textContent = text;
        el.hidden = false;
        input.setAttribute('aria-invalid', 'true');
      } else {
        el.textContent = '';
        el.hidden = true;
        input.removeAttribute('aria-invalid');
      }
    }

    function check(name) {
      var input = form.elements[name];
      var value = input.value.trim();
      if (!value) return 'Please enter ' + labels[name] + '.';
      if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address, like name@company.com.';
      if (name === 'message' && value.length < 10) return 'Please add a little more detail (at least 10 characters).';
      return '';
    }

    function show(text, state) {
      status.textContent = text;
      if (state) status.setAttribute('data-state', state); else status.removeAttribute('data-state');
    }

    fields.forEach(function (name) {
      // Clear a message as soon as the visitor fixes the field.
      form.elements[name].addEventListener('input', function () {
        if (form.elements[name].getAttribute('aria-invalid') === 'true' && !check(name)) setError(name, '');
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      show('', null);

      var firstBad = null;
      fields.forEach(function (name) {
        var problem = check(name);
        setError(name, problem);
        if (problem && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) {
        show('Please check the highlighted fields.', 'error');
        firstBad.focus();
        return;
      }

      timer.value = String(Date.now() - loadedAt); // ms the page was open; the server rejects impossibly fast sends
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      show('Sending…', null);

      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
        })
        .then(function (r) {
          if (r.res.ok && r.data.ok) {
            form.reset();
            show(r.data.message || 'Thanks, we’ve got your note. We’ll reply soon.', 'ok');
            return;
          }
          var errs = r.data.errors || {};
          var focused = false;
          fields.forEach(function (name) {
            setError(name, errs[name] || '');
            if (errs[name] && !focused) { form.elements[name].focus(); focused = true; }
          });
          show(r.data.message || 'Sorry, that did not send. Please try WhatsApp instead.', 'error');
        })
        .catch(function () {
          show('Sorry, we could not reach the server. Please check your connection or use WhatsApp instead.', 'error');
        })
        .then(function () {
          button.disabled = false;
          form.removeAttribute('aria-busy');
        });
    });
  })();
})();
