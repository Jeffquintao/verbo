/**
 * Serviço de leitura bíblica. Todas as versões são domínio público e ficam
 * no app (offline). Geradas por scripts/build-bible.js.
 * Schema: versao[bookIndex][chapterIndex][verseIndex].
 *
 * IMPORTANTE — por que o carregamento é assíncrono:
 * os textos somam ~20MB. Se fossem `require` de .json, o Metro os embutiria
 * no bundle JavaScript (o bundle passava de 18MB para 39MB). Em vez disso
 * eles são ASSETS (assets/bible/*.bible, ver metro.config.js): ficam como
 * arquivos separados dentro do app e só a versão que o usuário abre é lida
 * do disco e convertida. Depois de carregada, fica em cache em memória.
 */
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

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

// books.json é pequeno (~9KB) e usado em toda a navegação: fica no bundle.
const booksData = require('../data/bible/books.json') as BookMeta[];

export const BOOKS = booksData;

/** Texto de uma versão: [livro][capítulo][versículo]. */
export type BibleText = string[][][];

// Módulos de asset (o require aqui devolve só um ID, não o conteúdo).
// O Metro só registra o asset via require(); com import ele tentaria embutir
// os ~20 MB de texto no bundle JS, que é justamente o que queremos evitar.
/* eslint-disable @typescript-eslint/no-require-imports */
const ASSETS: Record<BibleVersion, number> = {
  ACF: require('../../assets/bible/acf.bible'),
  NVI: require('../../assets/bible/nvi.bible'),
  KJV: require('../../assets/bible/kjv.bible'),
  ASV: require('../../assets/bible/asv.bible'),
  RVR: require('../../assets/bible/rvr.bible'),
};
/* eslint-enable @typescript-eslint/no-require-imports */

const cache: Partial<Record<BibleVersion, BibleText>> = {};
const inFlight: Partial<Record<BibleVersion, Promise<BibleText>>> = {};

/** Versão já carregada em memória, ou undefined. */
export function getLoadedVersion(version: BibleVersion): BibleText | undefined {
  return cache[version];
}

/**
 * Carrega o texto de uma versão (do disco, uma única vez).
 * Chamadas concorrentes compartilham a mesma promessa.
 */
export function loadVersion(version: BibleVersion): Promise<BibleText> {
  const cached = cache[version];
  if (cached) return Promise.resolve(cached);

  const pending = inFlight[version];
  if (pending) return pending;

  const promise = (async () => {
    const asset = Asset.fromModule(ASSETS[version]);
    if (!asset.localUri) await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    const raw = await FileSystem.readAsStringAsync(uri);
    const data = JSON.parse(raw) as BibleText;
    cache[version] = data;
    delete inFlight[version];
    return data;
  })();

  inFlight[version] = promise;
  return promise;
}

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

/** Versículos de um capítulo a partir de um texto já carregado (chapter é 1-based). */
export function chapterVerses(
  text: BibleText | undefined,
  bookIndex: number,
  chapter: number,
): string[] {
  return text?.[bookIndex]?.[chapter - 1] ?? [];
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

/** Busca textual num texto já carregado. Para em `limit` resultados. */
export function searchInText(
  data: BibleText | undefined,
  query: string,
  limit = 100,
): SearchResult[] {
  const q = normalize(query.trim());
  if (!data || q.length < 2) return [];
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
