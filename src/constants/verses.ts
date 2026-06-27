/**
 * Versículos do dia (amostra). Em produção virão da API.Bible / banco local.
 * ACF — Almeida Corrigida Fiel (domínio público).
 */
export type Verse = {
  ref: string;
  text: string;
};

export const DAILY_VERSES: Verse[] = [
  {
    ref: 'Mateus 25:21',
    text: 'Bem está, servo bom e fiel. Sobre o pouco foste fiel, sobre muito te colocarei; entra no gozo do teu senhor.',
  },
  {
    ref: 'Filipenses 4:13',
    text: 'Posso todas as coisas naquele que me fortalece.',
  },
  {
    ref: 'Salmos 119:105',
    text: 'Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.',
  },
  {
    ref: 'Provérbios 3:5',
    text: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.',
  },
  {
    ref: 'Josué 1:9',
    text: 'Esforça-te, e tem bom ânimo; não temas, nem te espantes, porque o Senhor teu Deus é contigo.',
  },
];

/** Retorna o versículo do dia de forma determinística pela data. */
export function getVerseOfTheDay(date = new Date()): Verse {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}
