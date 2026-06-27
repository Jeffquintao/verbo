/**
 * Plano de leitura de 365 dias (canônico). Distribui os 1189 capítulos da
 * Bíblia de forma determinística e equilibrada ao longo do ano.
 */
import { BOOKS, getBook } from './bible';

export const PLAN_DAYS = 365;

export type DayReading = { bookIndex: number; chapter: number };

// Lista plana de todos os capítulos em ordem canônica (1189 itens).
const ALL_CHAPTERS: DayReading[] = (() => {
  const list: DayReading[] = [];
  BOOKS.forEach((b, bookIndex) => {
    for (let chapter = 1; chapter <= b.chapters; chapter++) list.push({ bookIndex, chapter });
  });
  return list;
})();

export const TOTAL_CHAPTERS = ALL_CHAPTERS.length;

/** Capítulos atribuídos ao dia `day` (1-based, 1..365). */
export function getDayReadings(day: number): DayReading[] {
  const d = Math.max(1, Math.min(PLAN_DAYS, day)) - 1;
  const start = Math.floor((d * TOTAL_CHAPTERS) / PLAN_DAYS);
  const end = Math.floor(((d + 1) * TOTAL_CHAPTERS) / PLAN_DAYS);
  return ALL_CHAPTERS.slice(start, end);
}

/** Resumo legível das leituras de um dia, ex.: "Gênesis 1–3 · Mateus 1". */
export function summarizeDay(day: number): string {
  const readings = getDayReadings(day);
  if (readings.length === 0) return '';
  const parts: string[] = [];
  let i = 0;
  while (i < readings.length) {
    const bookIndex = readings[i].bookIndex;
    const first = readings[i].chapter;
    let last = first;
    while (i + 1 < readings.length && readings[i + 1].bookIndex === bookIndex) {
      i++;
      last = readings[i].chapter;
    }
    const name = getBook(bookIndex)?.name ?? '';
    parts.push(last > first ? `${name} ${first}–${last}` : `${name} ${first}`);
    i++;
  }
  return parts.join(' · ');
}
