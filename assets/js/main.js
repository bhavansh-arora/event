/* The WhatsApp number comes from <body data-wa="...">, set in _src/build.py */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WHATSAPP_NUMBER = document.body.dataset.wa || '';
  document.documentElement.classList.remove('no-js');
  $$('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* Nav: solid on scroll, mobile menu, sticky mobile CTA */
  const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks'), sticky = $('#stickyCta');
  const contact = $('#contact');
  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 40);
    if (sticky) {
      let atForm = false;
      if (contact) {
        const r = contact.getBoundingClientRect();
        atForm = r.top < innerHeight && r.bottom > 0;
      }
      sticky.classList.toggle('show', y > 500 && !atForm);
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggleMenu = (open) => {
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (burger && links) {
    burger.addEventListener('click', () => toggleMenu(!links.classList.contains('open')));
    $$('a', links).forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  }

  /* WhatsApp links */
  const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  $$('.js-wa').forEach(a => {
    a.href = waLink(a.dataset.msg || 'Namaste!');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* Duplicate photo strips for a seamless loop */
  $$('.strip-track').forEach(t => { t.innerHTML += t.innerHTML.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"'); });

  /* Sparkles */
  $$('.sparkles').forEach(sp => {
    for (let i = 0; i < 36; i++) {
      const s = document.createElement('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.top = 15 + Math.random() * 80 + '%';
      s.style.setProperty('--d', 3 + Math.random() * 5 + 's');
      s.style.setProperty('--delay', -Math.random() * 8 + 's');
      sp.appendChild(s);
    }
  });

  /* Reveal on scroll with stagger */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = $$(':scope > .reveal', e.target.parentElement);
      e.target.style.transitionDelay = Math.min(Math.max(sibs.indexOf(e.target), 0), 5) * 90 + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* Count-up stats */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1800;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
        el.textContent = v.toLocaleString('en-IN') + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* Gallery filter */
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('active', b === btn));
    const f = btn.dataset.filter;
    $$('.g-item').forEach(it => it.classList.toggle('hide', f !== 'all' && it.dataset.cat !== f));
  }));

  /* Testimonials slider */
  const track = $('#tTrack');
  if (track) {
    const cards = $$('.t-card', track), dots = $('#tDots');
    let idx = 0, timer;
    const perView = () => innerWidth <= 560 ? 1 : innerWidth <= 900 ? 2 : 3;
    const maxIdx = () => Math.max(0, cards.length - perView());
    const go = (i) => {
      idx = (i + maxIdx() + 1) % (maxIdx() + 1);
      const w = cards[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(${-idx * w}px)`;
      $$('button', dots).forEach((d, j) => d.classList.toggle('active', j === idx));
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    const renderDots = () => {
      dots.innerHTML = '';
      for (let i = 0; i <= maxIdx(); i++) {
        const d = document.createElement('button');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', () => { go(i); restart(); });
        dots.appendChild(d);
      }
    };
    $('#tPrev').addEventListener('click', () => { go(idx - 1); restart(); });
    $('#tNext').addEventListener('click', () => { go(idx + 1); restart(); });
    addEventListener('resize', () => { renderDots(); go(Math.min(idx, maxIdx())); });
    renderDots(); go(0); restart();
  }

  /* Multi-step lead form → WhatsApp */
  const form = $('#leadForm');
  if (form) {
    const steps = $$('.f-step', form), bar = $('#formBar');
    let step = 0, pkg = '';
    const show = (n) => {
      steps.forEach((s, i) => s.classList.toggle('active', i === n));
      bar.style.width = ((n + 1) / steps.length) * 100 + '%';
      step = n;
    };
    const validate = (fs) => {
      let ok = true;
      const radios = $$('input[type=radio][required]', fs);
      if (radios.length) {
        const grid = radios[0].closest('.choice-grid');
        const checked = !!$(`input[name="${radios[0].name}"]:checked`, fs);
        grid.classList.toggle('invalid', !checked);
        ok = checked;
      }
      $$('input:not([type=radio])[required], select[required]', fs).forEach(el => {
        const valid = el.checkValidity() && el.value.trim() !== '';
        el.closest('.field').classList.toggle('invalid', !valid);
        if (!valid && ok) el.focus();
        ok = ok && valid;
      });
      return ok;
    };
    $$('.f-next', form).forEach(b => b.addEventListener('click', () => { if (validate(steps[step])) show(step + 1); }));
    $$('.f-back', form).forEach(b => b.addEventListener('click', () => show(step - 1)));
    $$('input[name=type]', form).forEach(r => r.addEventListener('change', () => {
      $('.choice-grid', form).classList.remove('invalid');
      setTimeout(() => show(1), 280);
    }));
    $$('input, select', form).forEach(el => el.addEventListener('input', () => el.closest('.field')?.classList.remove('invalid')));

    const budgets = ['Under ₹1 L', '₹1 L – ₹3 L', '₹3 L – ₹10 L', '₹10 L – ₹25 L', '₹25 L – ₹50 L', '₹50 L+'];
    const budget = $('#budget'), out = $('#budgetOut');
    budget.addEventListener('input', () => { out.textContent = budgets[budget.value]; });

    // Prefill from ?type=Haldi / ?pkg=Complete+Shaadi, whether arriving from another page or clicking a link on this one
    const prefill = (params) => {
      const type = params.get('type');
      const r = type && $(`input[name=type][value="${CSS.escape(type)}"]`, form);
      if (r) { r.checked = true; show(1); }
      if (params.get('pkg')) pkg = params.get('pkg');
    };
    prefill(new URLSearchParams(location.search));
    $$('a[href^="?"]').forEach(a => a.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(a.href);
      prefill(url.searchParams);
      contact.scrollIntoView({ behavior: 'smooth' });
    }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(steps[step])) return;
      const d = Object.fromEntries(new FormData(form));
      const date = d.date ? new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not fixed yet';
      const msg = [
        'Namaste Utsava! 🙏 I would like a quote.',
        '',
        `*Event:* ${d.type}`,
        `*Date:* ${date}`,
        `*City:* ${d.city}`,
        `*Guests:* ${d.guests}`,
        `*Budget:* ${budgets[d.budget]}`,
        pkg && `*Package:* ${pkg}`,
        `*Name:* ${d.name}`,
        `*Phone:* ${d.phone}`,
        d.notes && `*Notes:* ${d.notes}`,
      ].filter(Boolean).join('\n');
      window.open(waLink(msg), '_blank');
      steps.forEach(s => s.classList.remove('active'));
      $('#sName').textContent = (d.name || 'ji').split(' ')[0] + ' ji';
      $('#fSuccess').hidden = false;
      bar.style.width = '100%';
    });
  }

  /* Gallery lightbox */
  const lb = $('#lightbox');
  if (lb && $('.g-item')) {
    const lbImg = $('#lbImg'), lbCap = $('#lbCap');
    let lbIdx = 0;
    const visible = () => $$('.g-item:not(.hide)');
    const openLb = (i) => {
      const items = visible();
      lbIdx = (i + items.length) % items.length;
      const it = items[lbIdx], img = $('img', it);
      lbImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = img.alt;
      lbCap.textContent = $('b', it)?.textContent || '';
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
    $$('.g-item').forEach(it => it.addEventListener('click', () => openLb(visible().indexOf(it))));
    $('.lb-close').addEventListener('click', closeLb);
    $('.lb-prev').addEventListener('click', () => openLb(lbIdx - 1));
    $('.lb-next').addEventListener('click', () => openLb(lbIdx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') openLb(lbIdx - 1);
      if (e.key === 'ArrowRight') openLb(lbIdx + 1);
    });
  }
})();
