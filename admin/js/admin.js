const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// If already logged in, skip straight to dashboard
fetch('/api/auth/me', { credentials: 'include' }).then(r => {
  if (r.ok) window.location.href = '/admin/dashboard.html';
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const data = new FormData(loginForm);
  const btn = loginForm.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Signing in...';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    window.location.href = '/admin/dashboard.html';
  } catch (err) {
    loginError.textContent = err.message;
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});
