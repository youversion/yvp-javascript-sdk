import BibleVersionAPIs from './bible-version-apis.js';
import BibleReference from './bible-reference.js';

export default class BibleVersion {
  constructor(id) {
    this.id = id;
    this.metadata = null;
  }

  async loadMetadata() {
    this.metadata = await BibleVersionAPIs.metadata(this.id);
    return this.metadata;
  }

  get abbreviation() {
    return this.metadata?.local_abbreviation || this.metadata?.abbreviation || null;
  }

  static async findByLanguage(lang = null) {
    try {
      return await BibleVersionAPIs.versions(lang);
    } catch (e) {
      console.error('findByLanguage error:', e.message);
      return [];
    }
  }

  isValidUSFMBookName(name) {
    if (!this.metadata) return null;
    const usfm = name.toUpperCase();
    for (const book of this.metadata.books ?? []) {
      if (book.usfm === usfm) return usfm;
    }
    return null;
  }

  shareUrl(reference) {
    const book = reference.bookUSFM;
    if (!book) return null;
    const prefix = `https://www.bible.com/bible/${this.id}/`;
    if (reference.isRange) {
      return `${prefix}${book}.${reference.chapterStart}.${reference.verseStart}-${reference.verseEnd}.${this.abbreviation ?? this.id}`;
    }
    return `${prefix}${book}.${reference.chapterStart}.${reference.verseStart}.${this.abbreviation ?? this.id}`;
  }

  formatWithVersion(reference) {
    const base = this.format(reference);
    const abbr = this.metadata?.local_abbreviation ?? this.metadata?.abbreviation;
    if (abbr) {
      if (this.metadata?.language?.text_direction === 'rtl') {
        return `${abbr} ${base}`;
      }
      return `${base} ${abbr}`;
    }
    return base;
  }

  format(reference) {
    let chunks = this.formatWorker(reference);
    if (this.metadata?.language?.text_direction === 'rtl') {
      chunks = [...chunks].reverse();
    }
    return chunks.join('');
  }

  formatWorker(reference) {
    const b = reference.bookUSFM;
    const c = reference.chapterStart;
    const v = reference.verseStart;
    const c2 = reference.chapterEnd;
    const v2 = reference.verseEnd;

    const bcPart1 = this.bookName(b) ?? '';
    let bcPart2;
    let bcPart3;
    let csep = ':';

    if (this.numberOfChaptersInBook(b) === 1) {
      csep = ' ';
      bcPart2 = '';
      bcPart3 = '';
    } else {
      bcPart2 = ' ';
      bcPart3 = String(c);
    }

    if (v === 0 || (v <= 1 && v2 === 0)) {
      if (c === c2) return [bcPart1, bcPart2, bcPart3];
      return [bcPart1, bcPart2, bcPart3, '-', String(c2)];
    } else if (c !== c2) {
      let vNotZero = v === 0 ? 1 : v;
      let v2NotZero = v2 === 0 ? 999 : v2;
      return [bcPart1, bcPart2, bcPart3, csep, String(vNotZero), '-', String(c2), csep, String(v2NotZero)];
    } else {
      if (v2 === 999) return [bcPart1, bcPart2, bcPart3, csep, String(v), '-'];
      if (reference.isRange) return [bcPart1, bcPart2, bcPart3, csep, String(v), '-', String(v2)];
      if (v !== 0) return [bcPart1, bcPart2, bcPart3, csep, String(v)];
      return [bcPart1, bcPart2, bcPart3];
    }
  }

  isContiguousWith(first, other) {
    if (first.bookUSFM !== other.bookUSFM) return false;
    if (!first.bookUSFM) return false;
    let a, b;
    if (BibleReference.compare(first, other) < 0) {
      a = first;
      b = other;
    } else {
      a = other;
      b = first;
    }

    if (a.chapterEnd < b.chapterStart) return false;
    if (a.chapterEnd > b.chapterStart) return true;
    if (a.verseEnd + 1 < b.verseStart) return false;
    return true;
  }

  mergeOverlapping(refs) {
    const tmp = [...refs].sort(BibleReference.compare);
    let i = 1;
    while (i < tmp.length) {
      if (this.isContiguousWith(tmp[i - 1], tmp[i])) {
        tmp[i - 1] = this.fromOverlappingPair(tmp[i - 1], tmp[i]);
        tmp.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return tmp;
  }

  fromOverlappingPair(a, b) {
    if (a.bookUSFM !== b.bookUSFM || !a.bookUSFM) return a;
    const x = BibleReference.compare(a, b) > 0 ? b : a;
    const y = x === a ? b : a;
    let further;
    if (x.chapterEnd > y.chapterEnd) further = x;
    else if (x.chapterEnd < y.chapterEnd) further = y;
    else if (x.verseEnd > y.verseEnd) further = x;
    else further = y;
    return new BibleReference({
      versionId: x.versionId,
      bookUSFM: x.bookUSFM,
      chapterStart: x.chapterStart,
      verseStart: x.verseStart,
      chapterEnd: further.chapterEnd,
      verseEnd: further.verseEnd
    });
  }

  get copyrightLong() {
    return this.metadata?.copyright_long?.text ?? null;
  }

  get copyrightShort() {
    return this.metadata?.copyright_short?.text ?? null;
  }

  get bookCodes() {
    return this.metadata?.books?.map(b => b.usfm).filter(Boolean) ?? [];
  }

  bookName(book) {
    if (!this.metadata || !book) return null;
    for (const b of this.metadata.books) {
      if (b.usfm === book) return b.human ?? b.human_long;
    }
    return null;
  }

  numberOfChaptersInBook(bookCode) {
    if (!this.metadata || !bookCode) return 0;
    for (const b of this.metadata.books) {
      if (b.usfm === bookCode) {
        if (b.chapters) {
          return b.chapters.reduce((acc, ch) => acc + (ch.canonical === true ? 1 : 0), 0);
        }
      }
    }
    return 0;
  }

  chapterLabels(bookCode) {
    if (!this.metadata) return [];
    for (const b of this.metadata.books) {
      if (b.usfm === bookCode) {
        if (b.chapters) {
          return b.chapters.map(ch => (ch.canonical === true ? ch.human : null)).filter(Boolean);
        }
      }
    }
    return [];
  }
}
