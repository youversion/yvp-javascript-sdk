import BibleText from './bible-text.js';
import VotdText from './votd-text.js';
import YouVersionLogin from './login.js';
import YouVersionLoginButton from './login-button.js';
import BibleReference from './bible-reference.js';
import BibleVersion from './bible-version.js';

if (!customElements.get('bible-text')) {
  customElements.define('bible-text', BibleText);
}

if (!customElements.get('votd-text')) {
  customElements.define('votd-text', VotdText);
}

if (!customElements.get('youversion-login-button')) {
  customElements.define('youversion-login-button', YouVersionLoginButton);
}

const YouVersionPlatform = window.YouVersionPlatform || {};
YouVersionPlatform.Login = YouVersionLogin;
YouVersionPlatform.BibleReference = BibleReference;
YouVersionPlatform.BibleVersion = BibleVersion;

// Make it available globally
window.YouVersionPlatform = YouVersionPlatform;

export {
  BibleReference,
  BibleVersion,
  BibleText,
  VotdText,
  YouVersionLogin,
  YouVersionLoginButton,
  YouVersionPlatform as default
};
