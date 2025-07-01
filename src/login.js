import YouVersionLoginButton from './login-button.js';

// Register the custom element if not already defined
if (!customElements.get('youversion-login-button')) {
  customElements.define('youversion-login-button', YouVersionLoginButton);
}

export class YouVersionLogin {
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

// Add Login to the YouVersionPlatform namespace, creating if necessary
window.YouVersionPlatform = window.YouVersionPlatform || {};
window.YouVersionPlatform.Login = YouVersionLogin;
window.YouVersionPlatform.LoginButton = YouVersionLoginButton;

// Initialize when the script is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.YouVersionPlatform = window.YouVersionPlatform || {};
    window.YouVersionPlatform.Login = YouVersionLogin;
    YouVersionLogin.initialize();
  });
} else {
  window.YouVersionPlatform = window.YouVersionPlatform || {};
  window.YouVersionPlatform.Login = YouVersionLogin;
  YouVersionLogin.initialize();
}

// Export the YouVersionPlatform object
export default window.YouVersionPlatform || {};
