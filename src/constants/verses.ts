/**
 * Versículo do dia.
 *
 * Guardamos apenas a REFERÊNCIA; o texto é lido da versão bíblica que o
 * usuário está usando. Assim o versículo do dia sai automaticamente no idioma
 * certo (inglês, português ou espanhol) sem lista traduzida à mão.
 */
import { bookIndexByAbbrev } from '@/services/bible';

export type VerseRef = { abbrev: string; chapter: number; verse: number };

export const DAILY_VERSES: VerseRef[] = [
  { abbrev: 'mt', chapter: 25, verse: 21 }, // Bem está, servo bom e fiel
  { abbrev: 'fp', chapter: 4, verse: 13 }, // Posso todas as coisas...
  { abbrev: 'sl', chapter: 119, verse: 105 }, // Lâmpada para os meus pés
  { abbrev: 'pv', chapter: 3, verse: 5 }, // Confia no Senhor
  { abbrev: 'js', chapter: 1, verse: 9 }, // Esforça-te e tem bom ânimo
  { abbrev: 'jo', chapter: 3, verse: 16 }, // Porque Deus amou o mundo
  { abbrev: 'is', chapter: 41, verse: 10 }, // Não temas, porque eu sou contigo
];

/** Referência do dia, determinística pela data. */
export function getVerseRefOfTheDay(date = new Date()): VerseRef {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

/** Índice do livro da referência (-1 se não encontrado). */
export function refBookIndex(ref: VerseRef): number {
  return bookIndexByAbbrev(ref.abbrev);
}
