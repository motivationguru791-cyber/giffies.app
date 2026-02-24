// auth.js — handles login/register, token storage, navbar updates, logout
const TOKEN_KEY = 'giffies_token';
const USER_KEY = 'giffies_user';

function saveAuth(token, user){
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getToken(){ return localStorage.getItem(TOKEN_KEY); }
function getUser(){ try{ return JSON.parse(localStorage.getItem(USER_KEY)); }catch(e){return null;} }

function updateNav(){
  const user = getUser();
  const navUser = document.getElementById('nav-user');
  const loginLink = document.getElementById('nav-login');
  const registerLink = document.getElementById('nav-register');
  if(user){
    if(navUser) navUser.innerHTML = `<span class="muted">Hello,</span> <strong>${user.name}</strong> <button id="logout-btn" class="btn small">Logout</button>`;
    if(loginLink) loginLink.style.display='none';
    if(registerLink) registerLink.style.display='none';
    const logout = document.getElementById('logout-btn');
    if(logout) logout.addEventListener('click', ()=>{ clearAuth(); updateNav(); window.location.href = '/'; });
  } else {
    if(navUser) navUser.textContent = '';
    if(loginLink) loginLink.style.display='inline';
    if(registerLink) registerLink.style.display='inline';
  }
}

// Handle register form
async function handleRegister(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
    const json = await res.json();
    if(!res.ok){ alert(json.error || 'Register failed'); return; }
    saveAuth(json.token, json.user);
    updateNav();
    window.location.href = '/';
  }catch(err){ console.error(err); alert('Network error'); }
}

// Handle login form
async function handleLogin(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
    const json = await res.json();
    if(!res.ok){ alert(json.error || 'Login failed'); return; }
    saveAuth(json.token, json.user);
    updateNav();
    window.location.href = '/';
  }catch(err){ console.error(err); alert('Network error'); }
}

// Init on pages
document.addEventListener('DOMContentLoaded', ()=>{
  updateNav();
  const reg = document.getElementById('register-form'); if(reg) reg.addEventListener('submit', handleRegister);
  const log = document.getElementById('login-form'); if(log) log.addEventListener('submit', handleLogin);
});

// Expose helpers
window.GIFFIES_AUTH = { getToken, getUser, clearAuth };
