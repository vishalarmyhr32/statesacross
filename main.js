/* =========================================================
   StatesAcross Tax and Business Services — Main Script
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Lucide Icons ---------- */
  if (window.lucide) lucide.createIcons();
  else window.addEventListener('load', () => window.lucide && lucide.createIcons());

  /* ---------- AOS ---------- */
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 40 });

  /* ---------- Footer Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky Header state ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Scroll progress bar
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    document.getElementById('scroll-progress').style.width = progress + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

  function closeMenu(){
    mobileMenu.classList.remove('open');
    mobileMenuBackdrop.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu(){
    mobileMenu.classList.add('open');
    mobileMenuBackdrop.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenuClose.addEventListener('click', closeMenu);
  mobileMenuBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 84;
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Dark Mode Shooting Stars ---------- */
  const starsContainer = document.getElementById('stars-bg');
  if (starsContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const STAR_COUNT = 12;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      const len = Math.round(Math.random() * 40 + 70);
      const travel = Math.round(Math.random() * 150 + 180);
      const top = (Math.random() * 55).toFixed(2);
      const left = (Math.random() * 90).toFixed(2);
      const duration = (Math.random() * 6 + 8).toFixed(1);
      const delay = (Math.random() * -14).toFixed(1);
      star.style.setProperty('--len', `${len}px`);
      star.style.setProperty('--travel', `${travel}px`);
      star.style.top = `${top}%`;
      star.style.left = `${left}%`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;
      frag.appendChild(star);
    }
    starsContainer.appendChild(frag);
  }

  /* ---------- Hero growth line draw (GSAP) ---------- */
  const growthLine = document.getElementById('growth-line');
  if (window.gsap && growthLine) {
    gsap.to(growthLine, { strokeDashoffset: 0, duration: 1.8, delay: 0.4, ease: 'power2.out' });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, delay: (i % 3) * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        }
      );
    });
  }

  /* ---------- Button Ripple Effect ---------- */
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-el';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Theme Toggle (light / dark) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('theme-toggle-mobile');
  const themeButtons = [themeToggle, mobileThemeToggle].filter(Boolean);

  function setTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('sa-theme', isDark ? 'dark' : 'light');
    themeButtons.forEach(btn => btn.setAttribute('aria-pressed', String(isDark)));
  }

  function toggleTheme() {
    setTheme(!document.documentElement.classList.contains('dark'));
  }

  themeButtons.forEach(btn => btn.addEventListener('click', toggleTheme));

  // Sync button state with whatever the anti-flash script already applied
  setTheme(document.documentElement.classList.contains('dark'));

  /* ---------- Contact Form Validation ---------- */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  const validators = {
    fullName: v => v.trim().length >= 2,
    companyName: () => true, // optional
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: v => /^[\d\s()+.-]{7,}$/.test(v.trim()),
    service: v => v.trim().length > 0,
    message: v => v.trim().length >= 10,
  };

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      Object.keys(validators).forEach(name => {
        const field = form.elements[name];
        if (!field) return;
        const wrapper = field.closest('.form-field');
        const valid = validators[name](field.value || '');
        if (!valid) {
          isValid = false;
          wrapper.classList.add('invalid');
        } else {
          wrapper.classList.remove('invalid');
        }
      });

      if (isValid) {
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      } else {
        const firstInvalid = form.querySelector('.form-field.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // live re-validate on input
    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener('input', () => {
        const wrapper = field.closest('.form-field');
        if (validators[name](field.value || '')) wrapper.classList.remove('invalid');
      });
    });
  }

});
