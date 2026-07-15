// Общая логика LensAI: анимации, плавный скролл и имитация авторизации.
const STORAGE_KEY = 'lensai_user';

function getUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function setupRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px' });

  items.forEach((item) => observer.observe(item));
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"], .js-scroll').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function setupStoreAlert() {
  document.querySelectorAll('.js-store-alert').forEach((button) => {
    button.addEventListener('click', () => {
      alert('Приложение LensAI скоро появится в App Store и Google Play.');
    });
  });
}

function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const repeat = document.getElementById('register-password-repeat').value;
    const message = document.getElementById('register-message');

    if (password !== repeat) {
      message.textContent = 'Пароли не совпадают.';
      return;
    }

    saveUser({ name, email, plan: 'Про', requestsLeft: 30, createdAt: new Date().toISOString() });
    window.location.href = 'profile.html';
  });
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const stored = getUser();
    saveUser(stored || { name: email.split('@')[0] || 'друг', email, plan: 'База', requestsLeft: 15, createdAt: new Date().toISOString() });
    window.location.href = 'profile.html';
  });
}

function setupProfile() {
  if (!document.body.classList.contains('profile-body')) return;
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('profile-greeting').textContent = `Привет, ${user.name}! Твой агент готов`;
  document.getElementById('profile-plan').textContent = user.plan || 'Про';
  const left = Number(user.requestsLeft ?? 30);
  const max = (user.plan === 'База') ? 15 : 30;
  document.getElementById('requests-left').textContent = left;
  document.getElementById('usage-fill').style.width = `${Math.min(100, (left / max) * 100)}%`;

  document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'index.html';
  });
}

// Инициализация после загрузки DOM.
document.addEventListener('DOMContentLoaded', () => {
  setupRevealAnimations();
  setupSmoothScroll();
  setupStoreAlert();
  setupRegisterForm();
  setupLoginForm();
  setupProfile();
});