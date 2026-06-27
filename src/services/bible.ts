/**
 * Serviço de leitura bíblica. Dados em domínio público bundlados localmente,
 * ambos em português (ACF — Almeida Corrigida Fiel; NVI — Nova Versão
 * Internacional). Gerados por scripts/build-bible.js.
 * Schema: version[bookIndex][chapterIndex][verseIndex].
 */
// require evita o TypeScript inferir o tipo literal de ~4MB de JSON (lento).
// Metro resolve e bundla os arquivos normalmente.
const acf = require('../data/bible/acf.json') as string[][][];
const nvi = require('../data/bible/nvi.json') as string[][][];
const booksData = require('../data/bible/books.json') as BookMeta[];

export type BibleVersion = 'ACF' | 'NVI';

export type BookMeta = {
  abbrev: string;
  name: string;
  nameEn: string;
  testament: 'AT' | 'NT';
  chapters: number;
};

const VERSIONS: Record<BibleVersion, string[][][]> = {
  ACF: acf as string[][][],
  NVI: nvi as string[][][],
};

export const BOOKS = booksData as BookMeta[];

export const BIBLE_VERSIONS: { id: BibleVersion; label: string; lang: string }[] = [
  { id: 'ACF', label: 'ACF', lang: 'Português' },
  { id: 'NVI', label: 'NVI', lang: 'Português' },
];

/** Índice do livro pelo abbrev (ex.: 'gn' -> 0). -1 se não existir. */
export function bookIndexByAbbrev(abbrev: string): number {
  return BOOKS.findIndex((b) => b.abbrev === abbrev);
}

export function getBook(bookIndex: number): BookMeta | undefined {
  return BOOKS[bookIndex];
}

/**
 * Nome do livro para exibição na UI — sempre em português, independente da
 * versão. A versão (ACF/NVI) muda só o TEXTO dos versículos, não a navegação.
 * O parâmetro `version` é mantido por compatibilidade de assinatura.
 */
export function bookName(book: BookMeta, _version?: BibleVersion): string {
  return book.name;
}

/** Versículos de um capítulo (chapter é 1-based). */
export function getChapterVerses(
  version: BibleVersion,
  bookIndex: number,
  chapter: number,
): string[] {
  return VERSIONS[version]?.[bookIndex]?.[chapter - 1] ?? [];
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
  const data = VERSIONS[version];
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

/** Encontra um livro pelo nome (pt/en) ou abbrev. Útil para "ir para referência". */
export function findBook(query: string): number {
  const q = normalize(query.trim());
  if (!q) return -1;
  return BOOKS.findIndex(
    (b) =>
      b.abbrev === q ||
      normalize(b.name).startsWith(q) ||
      normalize(b.nameEn).startsWith(q),
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
