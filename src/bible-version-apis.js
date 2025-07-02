import URLBuilder from './url-builder.js';

function apiKey() {
  // return global.youversionplatformkey ||
  //   (typeof document !== 'undefined' && document.body?.dataset.youversionplatformkey) ||
  //   process.env.YOUVERSION_PLATFORM_KEY;
  return document.body?.dataset.youversionplatformkey;
}

export default class BibleVersionAPIs {
  static async metadata(versionId) {
    const key = apiKey();
    if (!key) throw new Error('YouVersion Platform app key required');
    const url = URLBuilder.versionURL(versionId);
    const response = await fetch(url, {
      headers: { apikey: key }
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('not permitted');
      throw new Error('cannot download');
    }
    const json = await response.json();
    return json.response?.data || json;
  }

  static async versions(languageTag) {
    const key = apiKey();
    if (!key) throw new Error('YouVersion Platform app key required');
    if (!languageTag || languageTag.length !== 3) return [];
    const url = URLBuilder.versionsURL(languageTag);
    const response = await fetch(url, {
      headers: { apikey: key }
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('not permitted');
      throw new Error('cannot download');
    }
    const data = await response.json();
    return data.versions || [];
  }
}
