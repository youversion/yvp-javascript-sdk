import YouVersionLoginButton from './login-button.js';

export default class YouVersionLogin {
  static BASE_URL = 'https://api-dev.youversion.com';

  static constructAuthUrl(
    appKey,
    requiredPermissions = [],
    optionalPermissions = []
  ) {
    const url = new URL('/auth/login', this.BASE_URL);
    const params = new URLSearchParams({
      app_id: appKey,
      language: navigator.language.split('-')[0] || 'en',
      required_perms: requiredPermissions.join(','),
      opt_perms: optionalPermissions.join(',')
    });
    
    url.search = params.toString();
    return url.toString();
  }

  static initialize() {
    // TODO: can we remove this? Is it necessary?
    if (!customElements.get('youversion-login-button')) {
      customElements.define('youversion-login-button', YouVersionLoginButton);
    }
    this.handleAuthCallback();
  }

  static handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    
    if (status == "success") {
      const authData = {
        status: status,
        yvp_user_id: params.get('yvp_user_id'),
        lat: params.get('lat'),
        grants: params.get('grants')
      };
      
      localStorage.setItem('youversion_auth', JSON.stringify(authData));
      
      window.history.replaceState({}, document.title, window.location.pathname);
      
      if (typeof window.onYouVersionAuthComplete === 'function') {
        window.onYouVersionAuthComplete(authData);
      }
      
      return authData;
    } else {
      const storedAuth = localStorage.getItem('youversion_auth');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          if (typeof window.onYouVersionAuthLoad === 'function') {
            window.onYouVersionAuthLoad(authData);
          }
          return authData;
        } catch (e) {
          console.error('Failed to parse stored auth data', e);
          localStorage.removeItem('youversion_auth');
        }
      }
    }
    return null;
  }

  static logout() {
    localStorage.removeItem('youversion_auth');
    if (typeof window.onYouVersionLogout === 'function') {
      window.onYouVersionLogout();
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem('youversion_auth');
  }

  static getAuthData() {
    const stored = localStorage.getItem('youversion_auth');
    return stored ? JSON.parse(stored) : null;
  }
}

// Initialize when the script is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    YouVersionLogin.initialize();
  });
} else {
  YouVersionLogin.initialize();
}
