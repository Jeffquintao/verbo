/**
 * Plano de leitura de 365 dias. Distribui os 1189 capítulos da Bíblia de forma
 * determinística ao longo do ano, em duas ordens:
 *  - canônico: Gênesis → Apocalipse (ordem dos livros na Bíblia)
 *  - cronológico: aproximada à ordem em que os eventos aconteceram (nível livro)
 */
import { BOOKS, getBook } from './bible';

export const PLAN_DAYS = 365;

export type PlanOrder = 'canonico' | 'cronologico';
export type DayReading = { bookIndex: number; chapter: number };

// Ordem cronológica (índices canônicos 0–65). Aproximação a nível de livro,
// baseada em planos cronológicos amplamente usados.
const CHRONO_ORDER = [
  // Antigo Testamento
  0, 17, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 18, 10, 11, 13, 19, 20, 21, 30, 28, 31,
  29, 27, 22, 32, 33, 35, 34, 23, 24, 25, 26, 36, 37, 16, 14, 15, 38,
  // Novo Testamento
  41, 40, 39, 42, 43, 58, 47, 51, 52, 45, 46, 44, 48, 49, 50, 56, 53, 55, 59,
  60, 54, 57, 64, 61, 62, 63, 65,
];

function buildChapters(order: PlanOrder): DayReading[] {
  const bookOrder = order === 'cronologico' ? CHRONO_ORDER : BOOKS.map((_, i) => i);
  const list: DayReading[] = [];
  for (const bookIndex of bookOrder) {
    const book = BOOKS[bookIndex];
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      list.push({ bookIndex, chapter });
    }
  }
  return list;
}

const CHAPTERS: Record<PlanOrder, DayReading[]> = {
  canonico: buildChapters('canonico'),
  cronologico: buildChapters('cronologico'),
};

export const TOTAL_CHAPTERS = CHAPTERS.canonico.length;

/** Capítulos atribuídos ao dia `day` (1-based, 1..365) na ordem escolhida. */
export function getDayReadings(day: number, order: PlanOrder = 'canonico'): DayReading[] {
  const all = CHAPTERS[order];
  const d = Math.max(1, Math.min(PLAN_DAYS, day)) - 1;
  const start = Math.floor((d * TOTAL_CHAPTERS) / PLAN_DAYS);
  const end = Math.floor(((d + 1) * TOTAL_CHAPTERS) / PLAN_DAYS);
  return all.slice(start, end);
}

/** Resumo legível das leituras de um dia, ex.: "Gênesis 1–3 · Jó 1". */
export function summarizeDay(day: number, order: PlanOrder = 'canonico'): string {
  const readings = getDayReadings(day, order);
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
