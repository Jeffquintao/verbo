/**
 * Serviço de leitura bíblica. Todas as versões são domínio público e ficam
 * embutidas no app (offline). Geradas por scripts/build-bible.js.
 * Schema: versao[bookIndex][chapterIndex][verseIndex].
 *
 * As versões disponíveis dependem do idioma escolhido pelo usuário.
 */
import type { Locale } from '@/store/useLocaleStore';

export type BibleVersion = 'ACF' | 'NVI' | 'KJV' | 'ASV' | 'RVR';

export type BookMeta = {
  abbrev: string;
  name: string; // português
  nameEn: string;
  nameEs: string;
  testament: 'AT' | 'NT';
  chapters: number;
};

// require (em vez de import) evita o TypeScript inferir o tipo literal de
// ~4MB de JSON por versão. O Metro resolve e embute os arquivos normalmente.
const booksData = require('../data/bible/books.json') as BookMeta[];

/**
 * Carrega o texto de uma versão só quando ela é usada pela primeira vez.
 * São ~4MB por versão — carregar as cinco na inicialização pesaria à toa.
 * O require do Metro faz cache, então o custo é pago uma única vez.
 */
const cache: Partial<Record<BibleVersion, string[][][]>> = {};

function load(version: BibleVersion): string[][][] {
  const cached = cache[version];
  if (cached) return cached;
  let data: string[][][];
  switch (version) {
    case 'ACF': data = require('../data/bible/acf.json'); break;
    case 'NVI': data = require('../data/bible/nvi.json'); break;
    case 'KJV': data = require('../data/bible/kjv.json'); break;
    case 'ASV': data = require('../data/bible/asv.json'); break;
    case 'RVR': data = require('../data/bible/rvr.json'); break;
  }
  cache[version] = data;
  return data;
}

export const BOOKS = booksData;

export type VersionMeta = { id: BibleVersion; label: string; name: string };

/** Versões oferecidas em cada idioma. A primeira é a padrão. */
const VERSIONS_BY_LOCALE: Record<Locale, VersionMeta[]> = {
  en: [
    { id: 'KJV', label: 'KJV', name: 'King James Version' },
    { id: 'ASV', label: 'ASV', name: 'American Standard Version' },
  ],
  pt: [
    { id: 'ACF', label: 'ACF', name: 'Almeida Corrigida Fiel' },
    { id: 'NVI', label: 'NVI', name: 'Nova Versão Internacional' },
  ],
  es: [{ id: 'RVR', label: 'RVR', name: 'Reina-Valera 1909' }],
};

export function versionsForLocale(locale: Locale): VersionMeta[] {
  return VERSIONS_BY_LOCALE[locale] ?? VERSIONS_BY_LOCALE.en;
}

/** Versão padrão do idioma (usada ao trocar de idioma). */
export function defaultVersionForLocale(locale: Locale): BibleVersion {
  return versionsForLocale(locale)[0].id;
}

/** A versão pertence ao idioma atual? Usado para corrigir estado antigo. */
export function isVersionInLocale(version: BibleVersion, locale: Locale): boolean {
  return versionsForLocale(locale).some((v) => v.id === version);
}

export function versionMeta(version: BibleVersion): VersionMeta | undefined {
  for (const list of Object.values(VERSIONS_BY_LOCALE)) {
    const found = list.find((v) => v.id === version);
    if (found) return found;
  }
  return undefined;
}

/** Índice do livro pelo abbrev (ex.: 'gn' -> 0). -1 se não existir. */
export function bookIndexByAbbrev(abbrev: string): number {
  return BOOKS.findIndex((b) => b.abbrev === abbrev);
}

export function getBook(bookIndex: number): BookMeta | undefined {
  return BOOKS[bookIndex];
}

/** Nome do livro no idioma da interface. */
export function bookName(book: BookMeta, locale: Locale): string {
  if (locale === 'en') return book.nameEn;
  if (locale === 'es') return book.nameEs;
  return book.name;
}

/** Versículos de um capítulo (chapter é 1-based). */
export function getChapterVerses(
  version: BibleVersion,
  bookIndex: number,
  chapter: number,
): string[] {
  return load(version)[bookIndex]?.[chapter - 1] ?? [];
}

export function chapterCount(bookIndex: number): number {
  return BOOKS[bookIndex]?.chapters ?? 0;
}

export type SearchResult = {
  bookIndex: number;
  chapter: number;
  verse: number;
  text: string;
};

/** Remove acentos e baixa caixa para comparação tolerante. */
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Busca textual em toda a versão. Para na quantidade `limit` de resultados. */
export function searchVerses(
  version: BibleVersion,
  query: string,
  limit = 100,
): SearchResult[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  const data = load(version);
  const results: SearchResult[] = [];

  for (let bi = 0; bi < data.length; bi++) {
    const chapters = data[bi];
    for (let ci = 0; ci < chapters.length; ci++) {
      const verses = chapters[ci];
      for (let vi = 0; vi < verses.length; vi++) {
        const text = verses[vi];
        if (text && normalize(text).includes(q)) {
          results.push({ bookIndex: bi, chapter: ci + 1, verse: vi + 1, text });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}

/** Encontra um livro pelo nome (em qualquer idioma) ou abbrev. */
export function findBook(query: string): number {
  const q = normalize(query.trim());
  if (!q) return -1;
  return BOOKS.findIndex(
    (b) =>
      b.abbrev === q ||
      normalize(b.name).startsWith(q) ||
      normalize(b.nameEn).startsWith(q) ||
      normalize(b.nameEs).startsWith(q),
  );
}

/** Próximo capítulo (atravessa livros). null se for o fim da Bíblia. */
export function nextChapter(
  bookIndex: number,
  chapter: number,
): { bookIndex: number; chapter: number } | null {
  if (chapter < chapterCount(bookIndex)) return { bookIndex, chapter: chapter + 1 };
  if (bookIndex < BOOKS.length - 1) return { bookIndex: bookIndex + 1, chapter: 1 };
  return null;
}

/** Capítulo anterior (atravessa livros). null se for o início da Bíblia. */
export function prevChapter(
  bookIndex: number,
  chapter: number,
): { bookIndex: number; chapter: number } | null {
  if (chapter > 1) return { bookIndex, chapter: chapter - 1 };
  if (bookIndex > 0) return { bookIndex: bookIndex - 1, chapter: chapterCount(bookIndex - 1) };
  return null;
}
