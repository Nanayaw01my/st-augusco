// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile nav
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// Animated counter
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
fadeEls.forEach(el => fadeObs.observe(el));

// Dynamic content from admin backend (falls back to static markup if API unavailable)
(function () {
  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  }

  function renderDepartments(items) {
    const grid = document.getElementById('dept-grid');
    if (!grid || !items.length) return;
    grid.innerHTML = items.map(d => `
      <div class="dept-card fade-up visible">
        <div class="dept-card-top">
          <div class="dept-icon-wrap ${d.iconTheme === 'y' ? 'y' : 'g'}">${escapeHtml(d.icon || '📚')}</div>
          <div class="dept-head-text">
            <h3 class="dept-card-title">${escapeHtml(d.name)}</h3>
            <span class="dept-prog-tag">${escapeHtml(d.tag || '')}</span>
          </div>
        </div>
        <p class="dept-desc">${escapeHtml(d.description || '')}</p>
        <div class="dept-courses">
          <div class="dept-courses-label"><i class="fas fa-list-check"></i> Courses Offered</div>
          <div class="courses-wrap">
            ${(d.courses || []).map(c => `<span class="c-tag">${escapeHtml(c)}</span>`).join('')}
          </div>
        </div>
        <div class="dept-hod">
          <div class="hod-photo">${d.hodPhotoUrl ? `<img src="${d.hodPhotoUrl}" alt="${escapeHtml(d.hodName || '')}" />` : '<i class="fas fa-user"></i>'}</div>
          <div class="hod-text">
            <div class="hod-role">Head of Department</div>
            <div class="hod-name">${escapeHtml(d.hodName || '[HOD Name]')}</div>
          </div>
        </div>
      </div>`).join('');
  }

  function authorityCard(a, opts = {}) {
    const wrap = opts.small ? 'sm' : '';
    const grad = opts.yellow ? 'yellow-grad' : '';
    return `
      <div class="auth-person-card fade-up visible">
        <div class="auth-photo-area ${grad}">
          ${a.photoUrl ? `<img src="${a.photoUrl}" alt="${escapeHtml(a.name)}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div class="auth-avatar-circle ${wrap}"><i class="fas ${escapeHtml(a.icon || 'fa-user-tie')}"></i></div><div class="auth-up-hint">No Photo</div>`}
        </div>
        <div class="auth-info-area">
          <div class="auth-role-pill">${escapeHtml(a.role)}</div>
          <h4 class="auth-person-name">${escapeHtml(a.name)}</h4>
          <p class="auth-person-desc">${escapeHtml(a.description || '')}</p>
        </div>
      </div>`;
  }

  function renderAuthorities(items) {
    if (!items.length) return;
    const hm = items.find(a => a.group === 'headmaster');
    const assistants = items.filter(a => a.group === 'assistant');
    const officers = items.filter(a => a.group === 'officer');

    const hmEl = document.getElementById('headmaster-feature');
    if (hm && hmEl) {
      hmEl.innerHTML = `
        <div class="hm-photo-col">
          <div class="hm-avatar">${hm.photoUrl ? `<img src="${hm.photoUrl}" alt="${escapeHtml(hm.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />` : '<i class="fas fa-user-tie"></i>'}</div>
          <div class="hm-role-badge">Headmaster</div>
          <div class="hm-name-col">${escapeHtml(hm.name)}</div>
        </div>
        <div class="hm-info-col">
          <div class="hm-title-row">
            <h3 class="hm-title">${escapeHtml(hm.name)}</h3>
            <div class="hm-sub">Headmaster, St. Augustine's SHS, Bogoso</div>
          </div>
          <p class="hm-bio">${escapeHtml(hm.description || '')}</p>
          <div class="hm-contacts">
            ${hm.email ? `<div class="hm-contact"><i class="fas fa-envelope"></i> ${escapeHtml(hm.email)}</div>` : ''}
            ${hm.phone ? `<div class="hm-contact"><i class="fas fa-phone"></i> ${escapeHtml(hm.phone)}</div>` : ''}
          </div>
        </div>`;
    }

    const asstEl = document.getElementById('auth-3col');
    if (asstEl && assistants.length) asstEl.innerHTML = assistants.map(a => authorityCard(a)).join('');

    const offEl = document.getElementById('auth-4col');
    if (offEl && officers.length) offEl.innerHTML = officers.map(a => authorityCard(a, { small: true, yellow: true })).join('');
  }

  function renderNews(items) {
    const grid = document.getElementById('news-grid');
    if (!grid || !items.length) return;
    grid.innerHTML = items.map(n => `
      <div class="news-card fade-up visible">
        <div class="news-img" ${n.imageUrl ? `style="background-image:url('${n.imageUrl}');background-size:cover;background-position:center;"` : ''}>
          <span class="news-cat-tag">${escapeHtml(n.category || 'General')}</span>
          ${n.imageUrl ? '' : '📰'}
        </div>
        <div class="news-body">
          <div class="news-meta"><i class="fas fa-calendar-alt"></i> ${new Date(n.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <h3>${escapeHtml(n.title)}</h3>
          <p>${escapeHtml(n.excerpt)}</p>
        </div>
      </div>`).join('');
  }

  function renderGallery(items) {
    const grid = document.getElementById('gallery-mosaic');
    if (!grid || !items.length) return;
    grid.innerHTML = items.map(g => `
      <div class="gm-item" style="background-image:url('${g.imageUrl}');background-size:cover;background-position:center;">
        <div class="gm-overlay"><i class="fas fa-expand"></i></div>
      </div>`).join('');
  }

  getJSON('/api/departments').then(renderDepartments).catch(() => {});
  getJSON('/api/authorities').then(renderAuthorities).catch(() => {});
  getJSON('/api/news').then(renderNews).catch(() => {});
  getJSON('/api/gallery').then(renderGallery).catch(() => {});
})();

// Admission form submit
document.getElementById('admissionForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Submitting...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Enquiry Sent!';
    btn.style.background = 'var(--green)';
    btn.style.color = 'var(--white)';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'Submit Enquiry';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});

// Contact form submit
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});
