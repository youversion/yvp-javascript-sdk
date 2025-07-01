// Import all components
import { BibleText } from './bible-text.js';
import { VotdText } from './votd-text.js';
import { YouVersionLogin, YouVersionLoginButton } from './login.js';

// Register all custom elements
if (!customElements.get('bible-text')) {
  customElements.define('bible-text', BibleText);
}

if (!customElements.get('votd-text')) {
  customElements.define('votd-text', VotdText);
}

if (!customElements.get('youversion-login-button')) {
  customElements.define('youversion-login-button', YouVersionLoginButton);
}

// Set up the global YouVersionPlatform object
const YouVersionPlatform = window.YouVersionPlatform || {};
YouVersionPlatform.Login = YouVersionLogin;

// Make it available globally
window.YouVersionPlatform = YouVersionPlatform;

export default YouVersionPlatform;
