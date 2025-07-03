import URLBuilder from './url-builder.js';

function appId() {
  const appId = document.body?.dataset.youversionPlatformAppId;
  if (!appId) {
    throw new Error('The YouVersion Platform App ID is required.');
  }
  return appId;
}

export default class BibleVersionAPIs {
  static async metadata(versionId) {
    const url = URLBuilder.versionURL(versionId);
    const response = await fetch(url, {
      headers: { 'X-App-ID': appId() }
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('not permitted');
      throw new Error('cannot download');
    }
    const json = await response.json();
    return json.response?.data || json;
  }

  static async versions(languageTag) {
    if (!languageTag || languageTag.length !== 3) return [];
    const url = URLBuilder.versionsURL(languageTag);
    const response = await fetch(url, {
      headers: { 'X-App-ID': appId() }
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('not permitted');
      throw new Error('cannot download');
    }
    const data = await response.json();
    return data.versions || [];
  }
}
