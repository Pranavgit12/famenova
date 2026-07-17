/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== MOBILE MENU ===== */
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== MODAL ===== */
function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ===== REVEAL ON SCROLL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== ANIMATED COUNTERS ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.result-stat-value').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (target * eased).toFixed(target % 1 !== 0 ? 1 : 0);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ===== HERO BAR ANIMATION ===== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.hero-card-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const heroCard = document.querySelector('.hero-card');
if (heroCard) barObserver.observe(heroCard);

/* ===== FORM VALIDATION ===== */
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
    const input = group.querySelector('input, select');
    if (!input) return;

    const value = input.value.trim();
    let fieldValid = true;

    if (!value) {
      fieldValid = false;
    } else if (input.type === 'tel') {
      fieldValid = /^[\d\s\-+()]{7,}$/.test(value);
    }

    if (!fieldValid) {
      group.classList.add('error');
      valid = false;
    }
  });
  return valid;
}

function getFormData(formEl) {
  return {
    fullName: formEl.querySelector('[name="fullName"]').value.trim(),
    phone: formEl.querySelector('[name="phone"]').value.trim(),
    location: formEl.querySelector('[name="location"]').value.trim(),
    businessName: formEl.querySelector('[name="businessName"]').value.trim(),
    niche: formEl.querySelector('[name="niche"]').value,
  };
}

function showSuccess(formEl) {
  formEl.style.display = 'none';
  const note = formEl.parentElement.querySelector('.form-note');
  if (note) note.style.display = 'none';
  const successEl = formEl.id === 'inquiryForm'
    ? document.getElementById('formSuccess')
    : document.getElementById('modalSuccess');
  successEl.classList.add('show');
}

function setLoading(formEl, loading) {
  const btn = formEl.querySelector('.form-submit');
  if (loading) {
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = 'Apply for a Strategy Session';
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

async function submitForm(formEl) {
  if (!validateForm(formEl)) return;

  setLoading(formEl, true);

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData(formEl)),
    });

    const data = await res.json();

    if (data.success) {
      showSuccess(formEl);
    } else {
      if (data.errors) {
        Object.entries(data.errors).forEach(([field, msg]) => {
          const group = formEl.querySelector(`[name="${field}"]`)?.closest('.form-group');
          if (group) {
            group.classList.add('error');
            group.querySelector('.error-msg').textContent = msg;
          }
        });
      }
      setLoading(formEl, false);
    }
  } catch (err) {
    setLoading(formEl, false);
    alert('Network error. Please check your connection and try again.');
  }
}

document.getElementById('inquiryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm(this);
});

document.getElementById('modalForm').addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm(this);
});

/* Clear error on input */
document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
  input.addEventListener('input', function() {
    this.closest('.form-group').classList.remove('error');
  });
  input.addEventListener('change', function() {
    this.closest('.form-group').classList.remove('error');
  });
});
