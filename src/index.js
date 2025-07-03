import BibleText from './bible-text.js';
import VotdText from './votd-text.js';
import YouVersionLogin from './login.js';
import YouVersionLoginButton from './login-button.js';
import BibleReference from './bible-reference.js';
import BibleVersion from './bible-version.js';
import userInfo from './auth.js';

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
YouVersionPlatform.userInfo = userInfo;

// Make it available globally
window.YouVersionPlatform = YouVersionPlatform;

export {
  BibleReference,
  BibleVersion,
  BibleText,
  userInfo,
  VotdText,
  YouVersionLogin,
  YouVersionLoginButton,
  YouVersionPlatform as default
};
