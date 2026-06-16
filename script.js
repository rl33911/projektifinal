/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── STICKY NAVBAR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

/* ── TYPING ANIMATION ── */
const roles = [
  'C++ Developer.',
  'Problem Solver.',
  'Algorithm Designer.',
  'Competitive Programmer.',
  'Software Engineer.',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = roles[roleIndex];
  if (deleting) {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 500);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      setTimeout(() => { deleting = true; type(); }, 1800);
      return;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const observerReveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observerReveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observerReveal.observe(el));

/* ── SKILL BARS (animate on reveal) ── */
const skillFills = document.querySelectorAll('.skill-fill');
const observerSkills = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width + '%';
      observerSkills.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(f => observerSkills.observe(f));

/* ── ANIMATED COUNTERS ── */
function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (target >= 100 ? '+' : '+');
    if (current >= target) clearInterval(timer);
  }, 30);
}

const statNumbers = document.querySelectorAll('.stat-number');
const observerStats = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      observerStats.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(n => observerStats.observe(n));

/* ── PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'fadeInUp .4s ease both';
        });
      }
    });
  });
});

/* ── CONTACT FORM VALIDATION ── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

function showError(id, msg) {
  const errEl = document.getElementById(id + 'Error');
  const input = document.getElementById(id);
  if (errEl) errEl.textContent = msg;
  if (input) input.classList.toggle('error', !!msg);
}

function validateForm() {
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  showError('name',    name.length < 2 ? 'Please enter your full name.' : '');
  if (name.length < 2) valid = false;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  showError('email', !emailOk ? 'Please enter a valid email address.' : '');
  if (!emailOk) valid = false;

  showError('subject',  subject.length < 3 ? 'Please enter a subject.' : '');
  if (subject.length < 3) valid = false;

  showError('message', message.length < 10 ? 'Message must be at least 10 characters.' : '');
  if (message.length < 10) valid = false;

  return valid;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  successMsg.hidden = true;

  if (!validateForm()) return;

  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  btnText.hidden    = true;
  btnLoading.hidden = false;
  submitBtn.disabled = true;

  setTimeout(() => {
    btnText.hidden    = false;
    btnLoading.hidden = true;
    submitBtn.disabled = false;
    successMsg.hidden  = false;
    form.reset();
    ['name','email','subject','message'].forEach(id => showError(id, ''));
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1500);
});

/* Clear error on input */
['name','email','subject','message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => showError(id, ''));
});