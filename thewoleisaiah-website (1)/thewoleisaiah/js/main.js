/* ═══════════════════════════════════════════════════════
   thewoleisaiah — Main JavaScript
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Reveal ─────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Fire hero reveals immediately on load
  setTimeout(() => {
    document.querySelectorAll(
      '.hero-section .reveal, .about-hero .reveal, .fw-hero .reveal, ' +
      '.contact-hero .reveal, .work-hero .reveal, .blog-hero .reveal, ' +
      '.services-hero .reveal, .page-hero .reveal'
    ).forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 100);
    });
  }, 50);

  /* ── Nav scroll state ──────────────────────────────── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Active nav link ───────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Mobile nav ────────────────────────────────────── */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const close = () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    };
    if (mobileClose) mobileClose.addEventListener('click', close);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ── Animated counters ─────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── FAQ accordion ─────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ── Contact / newsletter forms ────────────────────── */
  document.querySelectorAll('form.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Sent ✓';
        btn.style.background = '#1a7a4a';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3500);
      }
    });
  });

  /* ── Contact page: show success div ───────────────── */
  const contactForm = document.getElementById('contactForm');
  const successDiv  = document.getElementById('formSuccess');
  if (contactForm && successDiv) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      successDiv.style.display = 'block';
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
