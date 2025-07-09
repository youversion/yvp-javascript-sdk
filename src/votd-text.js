export default class VotdText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.debouncedLoadContent = this.debounce(() => this.loadContent(), 0);
  }

  connectedCallback() {
    this.debouncedLoadContent();
  }

  async loadContent() {
    const host = "https://api-dev.youversion.com";
    const version = this.getAttribute('version');
    const styles = `<style>
      .votd-text { display: block; }
      .votd-text header { display: flex; justify-content: space-between; margin-bottom: 0.5em; }
      .votd-text .ref { font-weight: bold; }
      .votd-text .abbr { background:#f0f0f0; border-radius:6px; padding:0.2em 0.5em; font-size:0.9em; }
      .votd-text .error { color: red; }
      .votd-text .copyright { font-size: 0.8em; color: #666; margin-top: 0.5em; }
    </style>`;

    let content = "";
    try {
      const appId = document.body?.dataset.youversionPlatformAppId;
      if (!appId) {
        throw new Error('The YouVersion Platform App ID is required.');
      }
      if (!version) {
        content = `<div class="error">Unable to display verse of the day: missing attributes.</div>`;
      } else {
        const url = `${host}/votd/today?version=${version}`;
        const resp = await fetch(url, {
          headers: { 'X-App-ID': appId }
        });
        if (!resp.ok) {
          content = `<div class="error">Unable to load verse of the day.</div>`;
        } else {
          const data = await resp.json();
          const header = `<header>
            <span class="ref" aria-label="Bible reference">${data.human}</span>
            <span class="abbr" aria-label="Bible version">${data.abbreviation}</span>
          </header>`;
          const body = `<div class="body">${data.text.replace(/\n/g, '<br>')}</div>`;
          //const copyright = `<div class="copyright">${data.copyright}</div>`;
          content = header + body;
          this.setAttribute('usfm', data.usfm);
        }
      }
    } catch (err) {
      content = `<div class="error">Unable to load verse of the day: ${err.message}</div>`;
    }
    this.shadowRoot.innerHTML = `${styles} <div class="votd-text">${content}</div>`;
  }

  debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}
