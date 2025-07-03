export default class BibleText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.debouncedLoadContent = this.debounce(() => this.loadContent(), 0);
  }

  static get observedAttributes() {
    return ['usfm', 'version'];
  }

  connectedCallback() {
    this.debouncedLoadContent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue) {
      this.debouncedLoadContent(); 
    }
  }
  
  async loadContent() {
    const host = "https://api-dev.youversion.com";
    const usfm = encodeURIComponent(this.getAttribute('usfm'));
    const version = this.getAttribute('version');
    const styles = `<style>
      .bible-text { display: block; }
      .bible-text header { display: flex; justify-content: space-between; margin-bottom: 0.5em; }
      .bible-text .ref { font-weight: bold; }
      .bible-text .abbr { background:#f0f0f0; border-radius:6px; padding:0.2em 0.5em; font-size:0.9em; }
      .bible-text .error { color: red; }
    </style>`;

    var content = "";
    try {
      const appId = document.body?.dataset.youversionPlatformAppId;
      if (!appId) {
        throw new Error('The YouVersion Platform App ID is required.');
      }
      if (!usfm || !version || !appId) {
        content = `<div class="error">Unable to display verse: missing attributes.</div>`;
      } else {
        const url = `${host}/bible/passage?format=json&version=${version}&usfm=${usfm}`;
        const resp = await fetch(url, {
          headers: { 'X-App-ID': appId }
        });
        if (!resp.ok) {
          content = `<div class="error">Unable to load verse.</div>`;
        } else {
          const data = await resp.json();
          const style = `<style>${data.css}</style>`;
          const header = `<header>
            <span class="ref" aria-label="Bible reference">${data.human}</span>
            <span class="abbr" aria-label="Bible version">${data.abbreviation}</span>
          </header>`;
          const body = `<div class="body">${data.verse_html}</div>`;
          content = style + header + body;
        }
      }
    } catch (err) {
      content = `<div class="error">Unable to load verse: ${err.message}</div>`;
    }
    this.shadowRoot.innerHTML = `${styles} <div class="bible-text">${content}</div>`;
  }

  debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  
}
