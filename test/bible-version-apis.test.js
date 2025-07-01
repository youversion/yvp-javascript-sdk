import BibleVersionAPIs from '../src/bible-version-apis.js';

global.youversionplatformkey = 'IiotL64yrkUgWkMorSy6srHFVrO17YoiyCSnpY3cRprKKk6R';

describe('BibleVersionAPIs', () => {
  test('fetch versions list', async () => {
    const versions = await BibleVersionAPIs.versions('eng');
    expect(Array.isArray(versions)).toBe(true);
    const found = versions.find(v => v.id === 111);
    expect(found).toBeDefined();
  }, 10000);
});
