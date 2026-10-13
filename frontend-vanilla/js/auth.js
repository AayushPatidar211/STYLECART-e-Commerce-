/**
 * StyleCart - Authentication State & Session Management
 * Vanilla JavaScript Module
 */

import { apiRequest, STORAGE_KEYS, showToast } from './api.js';

export const auth = {
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getUser() {
    try {
      const u = localStorage.getItem(STORAGE_KEYS.USER);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  isAdmin() {
    const u = this.getUser();
    return u && (u.role === 'ROLE_ADMIN' || u.role === 'ADMIN');
  },

  async login(email, password) {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      showToast(`Welcome back, ${data.firstName}!`, 'success');
      return data;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  },

  async register(data) {
    try {
      const resp = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      localStorage.setItem(STORAGE_KEYS.TOKEN, resp.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(resp));
      showToast('Account created successfully!', 'success');
      return resp;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    showToast('You have been signed out.', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  },

  quickLogin(role = 'user') {
    if (role === 'admin') {
      const adminUser = {
        token: 'jwt_admin_token_stylecart_2026',
        tokenType: 'Bearer',
        id: 1,
        email: 'admin@stylecart.com',
        firstName: 'Alexander',
        lastName: 'Vance',
        role: 'ROLE_ADMIN'
      };
      localStorage.setItem(STORAGE_KEYS.TOKEN, adminUser.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(adminUser));
      showToast('Logged in as Store Administrator', 'success');
    } else {
      const customerUser = {
        token: 'jwt_customer_token_stylecart_2026',
        tokenType: 'Bearer',
        id: 2,
        email: 'user@stylecart.com',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        role: 'ROLE_USER',
        phoneNumber: '+1-555-0142',
        defaultAddress: {
          fullName: 'Sarah Jenkins',
          phone: '+1-555-0142',
          streetAddress: '742 Evergreen Terrace',
          apartment: 'Apt 4B',
          city: 'Springfield',
          state: 'OR',
          postalCode: '97477',
          country: 'United States'
        }
      };
      localStorage.setItem(STORAGE_KEYS.TOKEN, customerUser.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(customerUser));
      showToast('Logged in as Sarah Jenkins (Customer)', 'success');
    }
  }
};
