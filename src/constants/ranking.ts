/**
 * Ranking do Quiz (escopo 2.8). Placeholder até o backend (Firebase) — o
 * ranking real zera todo dia 1° via Cloud Function. Dados de exemplo aqui.
 */
export type RankPlayer = {
  pos: number;
  name: string;
  initials: string;
  points: number;
  color: string;
  streak?: number;
};

export const DIVISIONS = [
  { name: 'Bronze', range: '0–499', color: '#CD7F32' },
  { name: 'Prata', range: '500–999', color: '#9CA3AF' },
  { name: 'Ouro', range: '1k–2.4k', color: '#D4AF37' },
  { name: 'Diamante', range: '2.5k+', color: '#60A5FA' },
];

export const RANKING: RankPlayer[] = [
  { pos: 1, name: 'Paulo C.', initials: 'PC', points: 2310, color: '#6D28D9' },
  { pos: 2, name: 'Maria A.', initials: 'MA', points: 1840, color: '#9CA3AF' },
  { pos: 3, name: 'Ruth S.', initials: 'RS', points: 1620, color: '#B8941F' },
  { pos: 4, name: 'João O.', initials: 'JO', points: 1480, color: '#4338CA', streak: 5 },
  { pos: 5, name: 'Ester S.', initials: 'ES', points: 1390, color: '#BE185D' },
  { pos: 6, name: 'Daniel L.', initials: 'DL', points: 1210, color: '#2563EB' },
];

/** Posição do usuário (placeholder). */
export const MY_RANK = {
  pos: 14,
  division: 'Ouro',
  points: 1120,
  toTop10: 230,
};
