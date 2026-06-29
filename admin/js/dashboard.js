const panelTitles = {
  news: 'News & Announcements',
  gallery: 'Photo Gallery',
  departments: 'Academic Departments',
  authorities: 'School Authorities',
};

async function checkAuth() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) { window.location.href = '/admin/index.html'; return; }
  const { admin } = await res.json();
  document.getElementById('adminEmail').textContent = admin.email;
}

function switchTab(tab) {
  document.querySelectorAll('.dash-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
  document.getElementById('panelTitle').textContent = panelTitles[tab];
}

document.querySelectorAll('.dash-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/admin/index.html';
});

function openModal(name) { document.getElementById(`modal-${name}`).classList.add('open'); }
function closeModal(name) { document.getElementById(`modal-${name}`).classList.remove('open'); }

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.remove('open'));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
});
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.open;
    const form = document.getElementById(`form-${name}`);
    form.reset();
    form.querySelector('[name="id"]')?.remove?.();
    if (form.elements.id) form.elements.id.value = '';
    const titleEl = document.getElementById(`${name}-modal-title`);
    if (titleEl) titleEl.textContent = `Add ${name === 'department' ? 'Department' : name === 'authority' ? 'Authority / Staff' : 'News Post'}`;
    openModal(name);
  });
});

async function api(path, opts = {}) {
  const res = await fetch(path, { credentials: 'include', ...opts });
  if (res.status === 401) { window.location.href = '/admin/index.html'; throw new Error('Not authenticated'); }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}

/* ---------- NEWS ---------- */
async function loadNews() {
  const items = await api('/api/news/admin');
  const list = document.getElementById('newsList');
  list.innerHTML = items.length ? '' : '<p>No news posts yet.</p>';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'dash-item';
    el.innerHTML = `
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="" />` : `<div class="item-noimg"><i class="fas fa-newspaper"></i></div>`}
      <div class="dash-item-body">
        <p class="dash-item-title">${item.title} ${!item.published ? '<span class="badge-unpublished">Draft</span>' : ''}</p>
        <p class="dash-item-sub">${item.category || 'General'} · ${new Date(item.publishedAt).toLocaleDateString()}</p>
      </div>
      <div class="dash-item-actions">
        <button data-edit><i class="fas fa-pen"></i></button>
        <button class="danger" data-delete><i class="fas fa-trash"></i></button>
      </div>`;
    el.querySelector('[data-edit]').addEventListener('click', () => editNews(item));
    el.querySelector('[data-delete]').addEventListener('click', () => deleteItem('news', item._id, loadNews));
    list.appendChild(el);
  });
}

function editNews(item) {
  const form = document.getElementById('form-news');
  form.reset();
  form.elements.title.value = item.title;
  form.elements.category.value = item.category || '';
  form.elements.excerpt.value = item.excerpt;
  form.elements.body.value = item.body || '';
  form.elements.publishedAt.value = new Date(item.publishedAt).toISOString().slice(0, 10);
  form.elements.published.checked = item.published;
  form.dataset.editId = item._id;
  document.getElementById('news-modal-title').textContent = 'Edit News Post';
  openModal('news');
}

document.getElementById('form-news').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  fd.set('published', form.elements.published.checked ? 'true' : 'false');
  const id = form.dataset.editId;
  try {
    await api(id ? `/api/news/${id}` : '/api/news', { method: id ? 'PUT' : 'POST', body: fd });
    delete form.dataset.editId;
    closeModal('news');
    loadNews();
  } catch (err) { alert(err.message); }
});

/* ---------- GALLERY ---------- */
async function loadGallery() {
  const items = await api('/api/gallery');
  const list = document.getElementById('galleryList');
  list.innerHTML = items.length ? '' : '<p>No photos yet.</p>';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'gallery-tile';
    el.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.caption || ''}" />
      ${item.caption ? `<div class="caption">${item.caption}</div>` : ''}
      <button data-delete><i class="fas fa-trash"></i></button>`;
    el.querySelector('[data-delete]').addEventListener('click', () => deleteItem('gallery', item._id, loadGallery));
    list.appendChild(el);
  });
}

document.getElementById('form-gallery').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  try {
    await api('/api/gallery', { method: 'POST', body: fd });
    e.target.reset();
    closeModal('gallery');
    loadGallery();
  } catch (err) { alert(err.message); }
});

/* ---------- DEPARTMENTS ---------- */
async function loadDepartments() {
  const items = await api('/api/departments');
  const list = document.getElementById('departmentsList');
  list.innerHTML = items.length ? '' : '<p>No departments yet.</p>';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'dash-item';
    el.innerHTML = `
      ${item.hodPhotoUrl ? `<img src="${item.hodPhotoUrl}" alt="" />` : `<div class="item-noimg"><i class="fas fa-user"></i></div>`}
      <div class="dash-item-body">
        <p class="dash-item-title">${item.icon || ''} ${item.name}</p>
        <p class="dash-item-sub">${item.tag || ''} · HOD: ${item.hodName || 'Not set'} · ${(item.courses || []).length} courses</p>
      </div>
      <div class="dash-item-actions">
        <button data-edit><i class="fas fa-pen"></i></button>
        <button class="danger" data-delete><i class="fas fa-trash"></i></button>
      </div>`;
    el.querySelector('[data-edit]').addEventListener('click', () => editDepartment(item));
    el.querySelector('[data-delete]').addEventListener('click', () => deleteItem('departments', item._id, loadDepartments));
    list.appendChild(el);
  });
}

function editDepartment(item) {
  const form = document.getElementById('form-department');
  form.reset();
  form.elements.name.value = item.name;
  form.elements.tag.value = item.tag || '';
  form.elements.icon.value = item.icon || '';
  form.elements.iconTheme.value = item.iconTheme || 'g';
  form.elements.description.value = item.description || '';
  form.elements.courses.value = (item.courses || []).join(', ');
  form.elements.hodName.value = item.hodName || '';
  form.elements.order.value = item.order || 0;
  form.dataset.editId = item._id;
  document.getElementById('department-modal-title').textContent = 'Edit Department';
  openModal('department');
}

document.getElementById('form-department').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = form.dataset.editId;
  try {
    await api(id ? `/api/departments/${id}` : '/api/departments', { method: id ? 'PUT' : 'POST', body: fd });
    delete form.dataset.editId;
    closeModal('department');
    loadDepartments();
  } catch (err) { alert(err.message); }
});

/* ---------- AUTHORITIES ---------- */
async function loadAuthorities() {
  const items = await api('/api/authorities');
  const list = document.getElementById('authoritiesList');
  list.innerHTML = items.length ? '' : '<p>No staff added yet.</p>';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'dash-item';
    el.innerHTML = `
      ${item.photoUrl ? `<img src="${item.photoUrl}" alt="" />` : `<div class="item-noimg"><i class="fas fa-user-tie"></i></div>`}
      <div class="dash-item-body">
        <p class="dash-item-title">${item.name}</p>
        <p class="dash-item-sub">${item.role} · ${item.group}</p>
      </div>
      <div class="dash-item-actions">
        <button data-edit><i class="fas fa-pen"></i></button>
        <button class="danger" data-delete><i class="fas fa-trash"></i></button>
      </div>`;
    el.querySelector('[data-edit]').addEventListener('click', () => editAuthority(item));
    el.querySelector('[data-delete]').addEventListener('click', () => deleteItem('authorities', item._id, loadAuthorities));
    list.appendChild(el);
  });
}

function editAuthority(item) {
  const form = document.getElementById('form-authority');
  form.reset();
  form.elements.name.value = item.name;
  form.elements.role.value = item.role;
  form.elements.group.value = item.group;
  form.elements.description.value = item.description || '';
  form.elements.email.value = item.email || '';
  form.elements.phone.value = item.phone || '';
  form.elements.order.value = item.order || 0;
  form.dataset.editId = item._id;
  document.getElementById('authority-modal-title').textContent = 'Edit Authority / Staff';
  openModal('authority');
}

document.getElementById('form-authority').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = form.dataset.editId;
  try {
    await api(id ? `/api/authorities/${id}` : '/api/authorities', { method: id ? 'PUT' : 'POST', body: fd });
    delete form.dataset.editId;
    closeModal('authority');
    loadAuthorities();
  } catch (err) { alert(err.message); }
});

/* ---------- SHARED ---------- */
async function deleteItem(resource, id, reload) {
  if (!confirm('Are you sure you want to delete this?')) return;
  try {
    await api(`/api/${resource}/${id}`, { method: 'DELETE' });
    reload();
  } catch (err) { alert(err.message); }
}

checkAuth().then(() => {
  loadNews();
  loadGallery();
  loadDepartments();
  loadAuthorities();
});
