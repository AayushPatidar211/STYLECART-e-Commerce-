/**
 * StyleCart - Auth Pages Controller (Login & Register)
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { auth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('login');
  renderFooter();

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const demoUserBtn = document.getElementById('btn-demo-user');
  const demoAdminBtn = document.getElementById('btn-demo-admin');

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;

      try {
        const u = await auth.login(email, pass);
        setTimeout(() => {
          if (u.role === 'ROLE_ADMIN' || u.role === 'ADMIN') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 300);
      } catch (err) {}
    });
  }

  // Handle Register
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        firstName: document.getElementById('reg-firstname').value.trim(),
        lastName: document.getElementById('reg-lastname').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phoneNumber: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value
      };

      try {
        await auth.register(data);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 300);
      } catch (err) {}
    });
  }

  // Quick Demo Buttons
  if (demoUserBtn) {
    demoUserBtn.addEventListener('click', () => {
      auth.quickLogin('user');
      setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      auth.quickLogin('admin');
      setTimeout(() => { window.location.href = 'admin.html'; }, 300);
    });
  }
});
