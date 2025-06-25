// Environment configuration with fallbacks for production
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'https://ncq-sa.web.app',
  PURE_FRONTEND: import.meta.env.VITE_PURE_FRONTEND === 'true' || true,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'NCQ Platform',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
}

// Force pure frontend mode in production
if (window.location.hostname === 'ncq-sa.web.app' || window.location.hostname === 'ncq-sa.firebaseapp.com') {
  env.PURE_FRONTEND = true;
  env.API_URL = window.location.origin;
}