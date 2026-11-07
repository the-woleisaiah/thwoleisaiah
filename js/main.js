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
    const openMenu = () => {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', openMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });
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

  /* ── Contact / newsletter forms — real Netlify AJAX submit ──
     Consolidated handler for all Netlify-enabled forms. Submits
     via fetch() with URL-encoded form data and handles dedicated
     success states or button feedback. */
  document.querySelectorAll('form.contact-form, form#contactForm, form[data-netlify="true"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      // These styled forms should never trigger a raw/native submit.
      e.preventDefault();

      const isNetlify = form.hasAttribute('data-netlify') ||
                        form.querySelector('input[name="form-name"]');
      if (!isNetlify) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.innerHTML : '';
      const successEl = document.getElementById('formSuccess');

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      // Build the URL-encoded payload (every field + the form-name value).
      const formData = new FormData(form);
      if (!formData.has('form-name')) {
        const nm = form.getAttribute('name');
        if (nm) formData.set('form-name', nm);
      }
      const body = new URLSearchParams(formData).toString();

      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
        if (!res.ok) throw new Error('Netlify responded with ' + res.status);

        // SUCCESS — reveal the real success state.
        if (successEl && form.id === 'contactForm') {
          form.style.display = 'none';
          successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = form.getAttribute('name') === 'newsletter' ? 'Subscribed ✓' : 'Sent ✓';
            setTimeout(() => { submitBtn.innerHTML = originalLabel; }, 4000);
          }
        }
      } catch (err) {
        // FAILURE — keep the form visible and let the visitor retry.
        console.error('Form submission failed:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Couldn’t send — retry';
          setTimeout(() => { submitBtn.innerHTML = originalLabel; }, 4000);
        }
      }
    });
  });

  /* ── Light / Dark theme toggle ─────────────────────────
     The initial theme is set pre-paint by a tiny inline <head>
     script (reads localStorage / prefers-color-scheme). Here we
     just build the nav button and let the visitor flip it. */
  (function themeToggle() {
    const root = document.documentElement;
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle light and dark theme');

    const sync = () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      btn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    };
    sync();

    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked — session only */ }
      sync();
    });

    navRight.insertBefore(btn, navRight.firstChild);
  })();

  /* ── Reading / Scroll Progress Bar ─────────────────── */
  (function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      bar.setAttribute('aria-hidden', 'true');
      document.body.prepend(bar);
    }
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        bar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

  /* ── Back to Top Floating Button ───────────────────── */
  (function initBackToTop() {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top of page');
      btn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
      document.body.appendChild(btn);
    }
    const toggleBtn = () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ── Smooth Internal Anchors ───────────────────────── */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
