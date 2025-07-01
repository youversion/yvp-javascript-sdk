export default class URLBuilder {
  static get BASE_URL() {
    return 'https://api-dev.youversion.com';
  }

  static versionURL(versionId) {
    const url = new URL('/bible/version', this.BASE_URL);
    url.searchParams.set('version', String(versionId));
    return url.toString();
  }

  static versionsURL(languageTag) {
    const url = new URL('/bible/versions', this.BASE_URL);
    url.searchParams.set('language', languageTag);
    return url.toString();
  }
}
