export default class YouVersionLoginButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this.handleLogin);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
        }
        button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #2c7d4d;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #23663b;
        }
        .icon {
          font-size: 16px;
          line-height: 1;
          margin-right: 2px;
        }
      </style>
      <button type="button">
        <span class="icon">📖</span>
        <span>Sign in with YouVersion</span>
      </button>
    `;
  }

  handleLogin = () => {
    const appId = document.body?.dataset.youversionPlatformAppId;
    if (!appId) {
      console.error('YouVersion Platform App ID not found. Add data-youversion-platform-app-id to the body tag.');
      return;
    }
    
    // The YouVersionLogin class must be available globally
    const url = window.YouVersionPlatform?.Login?.constructAuthUrl
      ? window.YouVersionPlatform.Login.constructAuthUrl(appId)
      : null;
    if (url) {
      window.location.href = url;
    }
  };

  static get observedAttributes() {
    return [];
  }
}
