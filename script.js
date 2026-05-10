/* ═══════════════════════════════════════════════════════════
   ARYA SHARMA — INTERIOR DESIGN PORTFOLIO
   script.js
   Features:
     1. Navbar scroll effect (adds shadow on scroll)
     2. Mobile menu open / close
     3. Smooth scroll reveal animation (IntersectionObserver)
     4. Smooth scrolling for nav links (closes mobile menu)
     5. Active nav link highlight on scroll
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Element references ─── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const menuOverlay = document.getElementById('menuOverlay');
  const navLinks    = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const allReveal   = document.querySelectorAll('.reveal');
  const sections    = document.querySelectorAll('section[id], div[id]');

  /* ═══════════════════════════════════════════
     1. NAVBAR — shadow on scroll
  ═══════════════════════════════════════════ */
  const handleNavScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ═══════════════════════════════════════════
     2. MOBILE MENU — open / close
  ═══════════════════════════════════════════ */
  const openMenu = () => {
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu when a mobile link is clicked
  const mobileLinks = document.querySelectorAll('.mobile-menu__links a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ═══════════════════════════════════════════
     3. SCROLL REVEAL (IntersectionObserver)
  ═══════════════════════════════════════════ */
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If user prefers reduced motion, show everything immediately
    allReveal.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    allReveal.forEach(el => revealObserver.observe(el));
  }

  /* ═══════════════════════════════════════════
     4. ACTIVE NAV LINK on scroll
  ═══════════════════════════════════════════ */
  const highlightNav = () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('nav__link--active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ═══════════════════════════════════════════
     5. SMOOTH SCROLL for anchor links
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // skip empty links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });

  /* ═══════════════════════════════════════════
     6. CURRENT YEAR in footer (optional)
     Keeps the copyright year always up to date
  ═══════════════════════════════════════════ */
  const copyEl = document.querySelector('.footer__copy');
  if (copyEl) {
    const currentYear = new Date().getFullYear();
    copyEl.textContent = `© ${currentYear} · Bengaluru, India`;
  }

});
