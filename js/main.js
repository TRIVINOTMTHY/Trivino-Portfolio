/* =====================================================
   DAINIEL TRIVIÑO PORTFOLIO — MAIN JS
   ===================================================== */

'use strict';

// === LOADER ===
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1600);
});

// === CUSTOM CURSOR ===
(function initCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.append(cursor, follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Hover effects
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .project-card, .highlight-card, .filter-btn, .skill-card')) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .project-card, .highlight-card, .filter-btn, .skill-card')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }
})();

// === NAVBAR SCROLL ===
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

// === MOBILE MENU ===
(function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

// === SCROLL REVEAL ===
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

// === SKILL BARS ANIMATION ===
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// === COUNTER ANIMATION ===
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current) + (el.getAttribute('data-suffix') || '');
          if (current < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// === PROJECTS FILTER ===
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(',');
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.style.opacity = '0';
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Apply transitions
  cards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
})();

// === CONTACT FORM ===
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const msgEl = document.getElementById('formMessage');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let valid = true;

    if (!name) { showError('name', 'Name is required'); valid = false; }
    if (!email || !isValidEmail(email)) { showError('email', 'Valid email required'); valid = false; }
    if (!subject) { showError('subject', 'Subject is required'); valid = false; }
    if (!message) { showError('message', 'Message is required'); valid = false; }

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate sending — replace with real backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

    showMessage('Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
    form.reset();
  });

  function showError(field, msg) {
    const input = form[field];
    input.classList.add('error');
    const errEl = document.createElement('span');
    errEl.className = 'form-error-msg';
    errEl.textContent = msg;
    input.parentNode.appendChild(errEl);
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    if (msgEl) { msgEl.className = 'form-message'; msgEl.textContent = ''; }
  }

  function showMessage(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = 'form-message ' + type;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

// === SMOOTH HOVER TILT (project cards) ===
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .highlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(1000px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
})();

// === TYPED TEXT EFFECT ===
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = ['Web Developer', 'UI/UX Enthusiast', 'Front-End Engineer', 'Creative Coder'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1500);
})();

// === PARALLAX ORBS ===
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const speed = i === 0 ? 15 : 8;
      orb.style.transform = `translate(${mx * speed}px, ${my * speed}px) scale(1)`;
    });
  }, { passive: true });
})();