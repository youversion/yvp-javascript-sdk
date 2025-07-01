import BibleVersion from '../src/bible-version.js';

global.youversionplatformkey = 'IiotL64yrkUgWkMorSy6srHFVrO17YoiyCSnpY3cRprKKk6R';

describe('BibleVersion', () => {
  test('fetch metadata for NIV (111)', async () => {
    const version = new BibleVersion(111);
    await version.loadMetadata();
    expect(version.metadata.id).toBe(111);
    expect(version.abbreviation).toBe('NIV');
    expect(Array.isArray(version.metadata.books)).toBe(true);
    expect(version.bookName('GEN')).toBe('Genesis');
    expect(version.numberOfChaptersInBook('GEN')).toBeGreaterThan(0);
    const labels = version.chapterLabels('GEN');
    expect(Array.isArray(labels)).toBe(true);
    expect(labels[0]).toBe('1');
  }, 15000);

  test('findByLanguage', async () => {
    const list = await BibleVersion.findByLanguage('eng');
    expect(Array.isArray(list)).toBe(true);
    expect(list.find(v => v.id === 111)).toBeDefined();
  }, 10000);
});
