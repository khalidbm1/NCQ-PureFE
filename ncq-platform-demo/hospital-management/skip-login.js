// Paste this in the browser console at http://localhost:3001
// This will set up mock authentication and redirect to dashboard

// Set mock authentication data
const mockToken = 'mock-jwt-token-' + Date.now();
const mockUser = {
  id: 'admin-1',
  email: 'admin@hospital.com',
  first_name: 'Admin',
  last_name: 'User',
  role: 'hospital_admin',
  tenant_id: 'default',
  full_name: 'Admin User',
  is_active: true
};

// Store in localStorage
localStorage.setItem('token', mockToken);
localStorage.setItem('subdomain', 'default');

// Set Redux state directly
if (window.__REDUX_STORE__) {
  window.__REDUX_STORE__.dispatch({
    type: 'auth/setUser',
    payload: mockUser
  });
}

// Redirect to dashboard
window.location.href = '/dashboard';

console.log('✅ Mock login complete! Redirecting to dashboard...');