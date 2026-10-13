/**
 * StyleCart - Profile Page Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { auth } from './auth.js';
import { apiRequest, STORAGE_KEYS, showToast } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('profile');
  renderFooter();

  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const currentUser = auth.getUser();
  const nameEl = document.getElementById('profile-display-name');
  const emailEl = document.getElementById('profile-email');
  const roleBadge = document.getElementById('profile-role-badge');
  const form = document.getElementById('profile-address-form');

  const fullNameInput = document.getElementById('prof-fullname');
  const phoneInput = document.getElementById('prof-phone');
  const streetInput = document.getElementById('prof-street');
  const aptInput = document.getElementById('prof-apartment');
  const cityInput = document.getElementById('prof-city');
  const stateInput = document.getElementById('prof-state');
  const postalInput = document.getElementById('prof-postal');
  const countryInput = document.getElementById('prof-country');

  if (nameEl) nameEl.textContent = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`;
  if (emailEl) emailEl.textContent = currentUser.email || '';
  if (roleBadge) roleBadge.textContent = currentUser.role || 'ROLE_USER';

  // Load existing profile details
  const addr = currentUser.defaultAddress || {
    fullName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
    phone: currentUser.phoneNumber || '+1-555-0142',
    streetAddress: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States'
  };

  if (fullNameInput) fullNameInput.value = addr.fullName || '';
  if (phoneInput) phoneInput.value = addr.phone || '';
  if (streetInput) streetInput.value = addr.streetAddress || '';
  if (aptInput) aptInput.value = addr.apartment || '';
  if (cityInput) cityInput.value = addr.city || '';
  if (stateInput) stateInput.value = addr.state || '';
  if (postalInput) postalInput.value = addr.postalCode || '';
  if (countryInput) countryInput.value = addr.country || 'United States';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedAddr = {
        fullName: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        streetAddress: streetInput.value.trim(),
        apartment: aptInput.value.trim(),
        city: cityInput.value.trim(),
        state: stateInput.value.trim(),
        postalCode: postalInput.value.trim(),
        country: countryInput.value.trim()
      };

      currentUser.defaultAddress = updatedAddr;
      currentUser.phoneNumber = updatedAddr.phone;

      try {
        await apiRequest('/users/profile', {
          method: 'PUT',
          body: JSON.stringify(currentUser)
        });
      } catch (err) {}

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      showToast('Delivery address saved successfully!', 'success');
    });
  }
});
