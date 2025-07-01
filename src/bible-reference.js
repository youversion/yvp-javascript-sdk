export default class BibleReference {
  constructor({ versionId, bookUSFM, chapterStart = 0, verseStart = 0, chapterEnd = 0, verseEnd = 0 }) {
    this.versionId = versionId;
    this.bookUSFM = bookUSFM;
    this.chapterStart = chapterStart;
    this.verseStart = verseStart;
    this.chapterEnd = chapterEnd || chapterStart;
    this.verseEnd = verseEnd || verseStart;
  }

  get isRange() {
    return this.chapterStart !== this.chapterEnd || this.verseStart !== this.verseEnd;
  }

  static compare(a, b) {
    if (a.bookUSFM !== b.bookUSFM) {
      return a.bookUSFM < b.bookUSFM ? -1 : 1;
    }
    if (a.chapterStart !== b.chapterStart) {
      return a.chapterStart - b.chapterStart;
    }
    if (a.verseStart !== b.verseStart) {
      return a.verseStart - b.verseStart;
    }
    if (a.chapterEnd !== b.chapterEnd) {
      return a.chapterEnd - b.chapterEnd;
    }
    return a.verseEnd - b.verseEnd;
  }
}
