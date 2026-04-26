const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const smoothScrollTo = (target) => {
  const startY = window.pageYOffset;
  const targetY = target.getBoundingClientRect().top + startY;
  const distance = targetY - startY;
  const duration = Math.min(1600, Math.max(700, Math.abs(distance) * 0.8));
  const startTime = performance.now();

  const easeInOutSine = (t) => (
    -(Math.cos(Math.PI * t) - 1) / 2
  );

  const step = (time) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutSine(progress);
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

document.querySelectorAll('nav a[href^="#"], footer a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    event.preventDefault();

    if (prefersReducedMotion) {
      target.scrollIntoView();
      history.pushState(null, '', hash);
      return;
    }

    smoothScrollTo(target);
    history.pushState(null, '', hash);
  });
});

const contactForm = document.querySelector('#contact-form');
const contactSuccess = document.querySelector('#contact-success');

if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    contactSuccess.classList.add('visible');
    contactForm.reset();
  });
}
