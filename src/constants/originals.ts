/**
 * Textos originais (grego/hebraico) — amostra curada com dicionário Strong.
 * Recurso Premium (escopo 2.2). Para cobertura total, importar OpenScriptures /
 * STEPBible (MorphGNT + OSHB), licença CC BY 4.0.
 */
export type StrongEntry = {
  id: string; // ex.: 'G3056', 'H7225'
  lemma: string; // palavra original
  translit: string;
  meaning: string;
  root: string;
  grammar: string;
  occurrences: string;
};

export type InterlinearWord = {
  surface: string; // grego/hebraico
  translit: string;
  gloss: string; // tradução
  strong: string; // id no dicionário
};

export type InterlinearVerse = {
  id: string;
  ref: string;
  testament: 'AT' | 'NT';
  source: string; // ex.: 'Textus Receptus'
  words: InterlinearWord[];
};

export const STRONGS: Record<string, StrongEntry> = {
  // --- Grego (NT) ---
  G1722: {
    id: 'G1722',
    lemma: 'ἐν',
    translit: 'en',
    meaning: 'em, dentro de, por meio de',
    root: 'Preposição primária',
    grammar: 'Preposição (dativo)',
    occurrences: '2752x no Novo Testamento',
  },
  G746: {
    id: 'G746',
    lemma: 'ἀρχή',
    translit: 'archē',
    meaning: 'princípio, origem, começo',
    root: 'ἄρχω (archō) — governar, começar',
    grammar: 'Substantivo feminino, dativo singular',
    occurrences: '58x no Novo Testamento',
  },
  G2258: {
    id: 'G2258',
    lemma: 'ἦν',
    translit: 'ēn',
    meaning: 'era, estava (existência contínua)',
    root: 'εἰμί (eimi) — ser, existir',
    grammar: 'Verbo, imperfeito do indicativo',
    occurrences: '448x no Novo Testamento',
  },
  G3588: {
    id: 'G3588',
    lemma: 'ὁ',
    translit: 'ho',
    meaning: 'o, a, os, as (artigo definido)',
    root: 'Artigo definido',
    grammar: 'Artigo, nominativo masculino singular',
    occurrences: '19870x no Novo Testamento',
  },
  G3056: {
    id: 'G3056',
    lemma: 'λόγος',
    translit: 'logos',
    meaning: 'palavra, razão, discurso, verbo',
    root: 'λέγω (legō) — falar, dizer',
    grammar: 'Substantivo masculino, nominativo singular',
    occurrences: '330x no Novo Testamento',
  },
  G4314: {
    id: 'G4314',
    lemma: 'πρός',
    translit: 'pros',
    meaning: 'para, junto a, em direção a',
    root: 'Preposição primária',
    grammar: 'Preposição (acusativo)',
    occurrences: '700x no Novo Testamento',
  },
  G2316: {
    id: 'G2316',
    lemma: 'θεός',
    translit: 'theos',
    meaning: 'Deus, divindade',
    root: 'Origem incerta',
    grammar: 'Substantivo masculino, acusativo singular',
    occurrences: '1343x no Novo Testamento',
  },
  G2532: {
    id: 'G2532',
    lemma: 'καί',
    translit: 'kai',
    meaning: 'e, também, mas',
    root: 'Conjunção primária',
    grammar: 'Conjunção',
    occurrences: '9161x no Novo Testamento',
  },
  // --- Hebraico (AT) ---
  H7225: {
    id: 'H7225',
    lemma: 'רֵאשִׁית',
    translit: 'reshit',
    meaning: 'início, começo, primícia',
    root: 'רֹאשׁ (rosh) — cabeça, topo, primeiro',
    grammar: 'Substantivo feminino + preposição בְּ (em/no)',
    occurrences: '51x no Antigo Testamento',
  },
  H1254: {
    id: 'H1254',
    lemma: 'בָּרָא',
    translit: 'bara',
    meaning: 'criar (do nada), formar',
    root: 'Raiz primitiva',
    grammar: 'Verbo, qal perfeito 3ª pessoa masc. sing.',
    occurrences: '54x no Antigo Testamento',
  },
  H430: {
    id: 'H430',
    lemma: 'אֱלֹהִים',
    translit: 'Elohim',
    meaning: 'Deus, deuses (plural majestático)',
    root: 'אֱלוֹהַּ (eloah) — divindade',
    grammar: 'Substantivo masculino plural',
    occurrences: '2606x no Antigo Testamento',
  },
  H853: {
    id: 'H853',
    lemma: 'אֵת',
    translit: 'et',
    meaning: 'marcador de objeto direto (não traduzido)',
    root: 'Partícula',
    grammar: 'Partícula de acusativo',
    occurrences: '11050x no Antigo Testamento',
  },
  H8064: {
    id: 'H8064',
    lemma: 'שָׁמַיִם',
    translit: 'shamayim',
    meaning: 'céus, firmamento',
    root: 'Raiz não usada (significando ser alto)',
    grammar: 'Substantivo masculino plural + artigo',
    occurrences: '421x no Antigo Testamento',
  },
  H776: {
    id: 'H776',
    lemma: 'אֶרֶץ',
    translit: 'erets',
    meaning: 'terra, chão, país',
    root: 'Raiz não usada',
    grammar: 'Substantivo feminino + artigo',
    occurrences: '2504x no Antigo Testamento',
  },
};

export const INTERLINEAR_VERSES: InterlinearVerse[] = [
  {
    id: 'jo1-1',
    ref: 'João 1:1',
    testament: 'NT',
    source: 'Textus Receptus',
    words: [
      { surface: 'Ἐν', translit: 'En', gloss: 'No', strong: 'G1722' },
      { surface: 'ἀρχῇ', translit: 'archē', gloss: 'princípio', strong: 'G746' },
      { surface: 'ἦν', translit: 'ēn', gloss: 'era', strong: 'G2258' },
      { surface: 'ὁ', translit: 'ho', gloss: 'o', strong: 'G3588' },
      { surface: 'Λόγος', translit: 'Logos', gloss: 'Verbo', strong: 'G3056' },
      { surface: 'καὶ', translit: 'kai', gloss: 'e', strong: 'G2532' },
      { surface: 'ὁ', translit: 'ho', gloss: 'o', strong: 'G3588' },
      { surface: 'Λόγος', translit: 'Logos', gloss: 'Verbo', strong: 'G3056' },
      { surface: 'ἦν', translit: 'ēn', gloss: 'era', strong: 'G2258' },
      { surface: 'πρὸς', translit: 'pros', gloss: 'com', strong: 'G4314' },
      { surface: 'τὸν', translit: 'ton', gloss: 'o', strong: 'G3588' },
      { surface: 'Θεόν', translit: 'Theon', gloss: 'Deus', strong: 'G2316' },
    ],
  },
  {
    id: 'gn1-1',
    ref: 'Gênesis 1:1',
    testament: 'AT',
    source: 'BHS — Texto Massorético',
    words: [
      { surface: 'בְּרֵאשִׁית', translit: 'Bereshit', gloss: 'No princípio', strong: 'H7225' },
      { surface: 'בָּרָא', translit: 'bara', gloss: 'criou', strong: 'H1254' },
      { surface: 'אֱלֹהִים', translit: 'Elohim', gloss: 'Deus', strong: 'H430' },
      { surface: 'אֵת', translit: 'et', gloss: '[objeto]', strong: 'H853' },
      { surface: 'הַשָּׁמַיִם', translit: 'hashamayim', gloss: 'os céus', strong: 'H8064' },
      { surface: 'וְאֵת', translit: "ve'et", gloss: 'e', strong: 'H853' },
      { surface: 'הָאָרֶץ', translit: "ha'arets", gloss: 'a terra', strong: 'H776' },
    ],
  },
];

export function getStrong(id: string): StrongEntry | undefined {
  return STRONGS[id];
}
