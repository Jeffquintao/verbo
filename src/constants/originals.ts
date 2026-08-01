/**
 * Textos originais (grego/hebraico) — amostra curada com dicionário Strong,
 * nos três idiomas do app.
 *
 * A palavra original, a transliteração e o código Strong são iguais em todos
 * os idiomas; só o significado, a raiz, a gramática e as glosas mudam.
 *
 * Recurso Premium (escopo 2.2). Para cobertura total, importar
 * OpenScriptures / STEPBible (MorphGNT + OSHB), licença CC BY 4.0.
 */
import type { Locale } from '@/store/useLocaleStore';

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
  gloss: string; // tradução da palavra
  strong: string;
};

export type InterlinearVerse = {
  id: string;
  ref: string;
  testament: 'AT' | 'NT';
  source: string;
  words: InterlinearWord[];
};

/** Parte traduzível de um verbete. */
type StrongText = { meaning: string; root: string; grammar: string; occurrences: string };

type StrongData = {
  lemma: string;
  translit: string;
  en: StrongText;
  pt: StrongText;
  es: StrongText;
};

const STRONG_DATA: Record<string, StrongData> = {
  // ---------------- Grego (NT) ----------------
  G1722: {
    lemma: 'ἐν',
    translit: 'en',
    en: { meaning: 'in, within, by means of', root: 'Primary preposition', grammar: 'Preposition (dative)', occurrences: '2752x in the New Testament' },
    pt: { meaning: 'em, dentro de, por meio de', root: 'Preposição primária', grammar: 'Preposição (dativo)', occurrences: '2752x no Novo Testamento' },
    es: { meaning: 'en, dentro de, por medio de', root: 'Preposición primaria', grammar: 'Preposición (dativo)', occurrences: '2752x en el Nuevo Testamento' },
  },
  G746: {
    lemma: 'ἀρχή',
    translit: 'archē',
    en: { meaning: 'beginning, origin, first cause', root: 'ἄρχω (archō) — to rule, to begin', grammar: 'Feminine noun, dative singular', occurrences: '58x in the New Testament' },
    pt: { meaning: 'princípio, origem, começo', root: 'ἄρχω (archō) — governar, começar', grammar: 'Substantivo feminino, dativo singular', occurrences: '58x no Novo Testamento' },
    es: { meaning: 'principio, origen, comienzo', root: 'ἄρχω (archō) — gobernar, comenzar', grammar: 'Sustantivo femenino, dativo singular', occurrences: '58x en el Nuevo Testamento' },
  },
  G2258: {
    lemma: 'ἦν',
    translit: 'ēn',
    en: { meaning: 'was, existed (continuous existence)', root: 'εἰμί (eimi) — to be, to exist', grammar: 'Verb, imperfect indicative', occurrences: '448x in the New Testament' },
    pt: { meaning: 'era, estava (existência contínua)', root: 'εἰμί (eimi) — ser, existir', grammar: 'Verbo, imperfeito do indicativo', occurrences: '448x no Novo Testamento' },
    es: { meaning: 'era, estaba (existencia continua)', root: 'εἰμί (eimi) — ser, existir', grammar: 'Verbo, imperfecto de indicativo', occurrences: '448x en el Nuevo Testamento' },
  },
  G3588: {
    lemma: 'ὁ',
    translit: 'ho',
    en: { meaning: 'the (definite article)', root: 'Definite article', grammar: 'Article, nominative masculine singular', occurrences: '19870x in the New Testament' },
    pt: { meaning: 'o, a, os, as (artigo definido)', root: 'Artigo definido', grammar: 'Artigo, nominativo masculino singular', occurrences: '19870x no Novo Testamento' },
    es: { meaning: 'el, la, los, las (artículo definido)', root: 'Artículo definido', grammar: 'Artículo, nominativo masculino singular', occurrences: '19870x en el Nuevo Testamento' },
  },
  G3056: {
    lemma: 'λόγος',
    translit: 'logos',
    en: { meaning: 'word, reason, discourse, Word', root: 'λέγω (legō) — to speak, to say', grammar: 'Masculine noun, nominative singular', occurrences: '330x in the New Testament' },
    pt: { meaning: 'palavra, razão, discurso, verbo', root: 'λέγω (legō) — falar, dizer', grammar: 'Substantivo masculino, nominativo singular', occurrences: '330x no Novo Testamento' },
    es: { meaning: 'palabra, razón, discurso, Verbo', root: 'λέγω (legō) — hablar, decir', grammar: 'Sustantivo masculino, nominativo singular', occurrences: '330x en el Nuevo Testamento' },
  },
  G4314: {
    lemma: 'πρός',
    translit: 'pros',
    en: { meaning: 'to, towards, with', root: 'Primary preposition', grammar: 'Preposition (accusative)', occurrences: '700x in the New Testament' },
    pt: { meaning: 'para, junto a, em direção a', root: 'Preposição primária', grammar: 'Preposição (acusativo)', occurrences: '700x no Novo Testamento' },
    es: { meaning: 'a, hacia, junto a', root: 'Preposición primaria', grammar: 'Preposición (acusativo)', occurrences: '700x en el Nuevo Testamento' },
  },
  G2316: {
    lemma: 'θεός',
    translit: 'theos',
    en: { meaning: 'God, deity', root: 'Uncertain origin', grammar: 'Masculine noun, accusative singular', occurrences: '1343x in the New Testament' },
    pt: { meaning: 'Deus, divindade', root: 'Origem incerta', grammar: 'Substantivo masculino, acusativo singular', occurrences: '1343x no Novo Testamento' },
    es: { meaning: 'Dios, deidad', root: 'Origen incierto', grammar: 'Sustantivo masculino, acusativo singular', occurrences: '1343x en el Nuevo Testamento' },
  },
  G2532: {
    lemma: 'καί',
    translit: 'kai',
    en: { meaning: 'and, also, but', root: 'Primary conjunction', grammar: 'Conjunction', occurrences: '9161x in the New Testament' },
    pt: { meaning: 'e, também, mas', root: 'Conjunção primária', grammar: 'Conjunção', occurrences: '9161x no Novo Testamento' },
    es: { meaning: 'y, también, pero', root: 'Conjunción primaria', grammar: 'Conjunción', occurrences: '9161x en el Nuevo Testamento' },
  },
  // ---------------- Hebraico (AT) ----------------
  H7225: {
    lemma: 'רֵאשִׁית',
    translit: 'reshit',
    en: { meaning: 'beginning, first, firstfruits', root: 'רֹאשׁ (rosh) — head, top, first', grammar: 'Feminine noun + preposition בְּ (in)', occurrences: '51x in the Old Testament' },
    pt: { meaning: 'início, começo, primícia', root: 'רֹאשׁ (rosh) — cabeça, topo, primeiro', grammar: 'Substantivo feminino + preposição בְּ (em/no)', occurrences: '51x no Antigo Testamento' },
    es: { meaning: 'inicio, comienzo, primicia', root: 'רֹאשׁ (rosh) — cabeza, cima, primero', grammar: 'Sustantivo femenino + preposición בְּ (en)', occurrences: '51x en el Antiguo Testamento' },
  },
  H1254: {
    lemma: 'בָּרָא',
    translit: 'bara',
    en: { meaning: 'to create (out of nothing), to form', root: 'Primitive root', grammar: 'Verb, qal perfect 3rd person masc. sing.', occurrences: '54x in the Old Testament' },
    pt: { meaning: 'criar (do nada), formar', root: 'Raiz primitiva', grammar: 'Verbo, qal perfeito 3ª pessoa masc. sing.', occurrences: '54x no Antigo Testamento' },
    es: { meaning: 'crear (de la nada), formar', root: 'Raíz primitiva', grammar: 'Verbo, qal perfecto 3ª persona masc. sing.', occurrences: '54x en el Antiguo Testamento' },
  },
  H430: {
    lemma: 'אֱלֹהִים',
    translit: 'Elohim',
    en: { meaning: 'God, gods (plural of majesty)', root: 'אֱלוֹהַּ (eloah) — deity', grammar: 'Masculine plural noun', occurrences: '2606x in the Old Testament' },
    pt: { meaning: 'Deus, deuses (plural majestático)', root: 'אֱלוֹהַּ (eloah) — divindade', grammar: 'Substantivo masculino plural', occurrences: '2606x no Antigo Testamento' },
    es: { meaning: 'Dios, dioses (plural mayestático)', root: 'אֱלוֹהַּ (eloah) — divinidad', grammar: 'Sustantivo masculino plural', occurrences: '2606x en el Antiguo Testamento' },
  },
  H853: {
    lemma: 'אֵת',
    translit: 'et',
    en: { meaning: 'direct object marker (untranslated)', root: 'Particle', grammar: 'Accusative particle', occurrences: '11050x in the Old Testament' },
    pt: { meaning: 'marcador de objeto direto (não traduzido)', root: 'Partícula', grammar: 'Partícula de acusativo', occurrences: '11050x no Antigo Testamento' },
    es: { meaning: 'marcador de objeto directo (no se traduce)', root: 'Partícula', grammar: 'Partícula de acusativo', occurrences: '11050x en el Antiguo Testamento' },
  },
  H8064: {
    lemma: 'שָׁמַיִם',
    translit: 'shamayim',
    en: { meaning: 'heavens, sky, firmament', root: 'Unused root (meaning to be lofty)', grammar: 'Masculine plural noun + article', occurrences: '421x in the Old Testament' },
    pt: { meaning: 'céus, firmamento', root: 'Raiz não usada (significando ser alto)', grammar: 'Substantivo masculino plural + artigo', occurrences: '421x no Antigo Testamento' },
    es: { meaning: 'cielos, firmamento', root: 'Raíz no usada (con sentido de ser alto)', grammar: 'Sustantivo masculino plural + artículo', occurrences: '421x en el Antiguo Testamento' },
  },
  H776: {
    lemma: 'אֶרֶץ',
    translit: 'erets',
    en: { meaning: 'earth, land, ground, country', root: 'Unused root', grammar: 'Feminine noun + article', occurrences: '2504x in the Old Testament' },
    pt: { meaning: 'terra, chão, país', root: 'Raiz não usada', grammar: 'Substantivo feminino + artigo', occurrences: '2504x no Antigo Testamento' },
    es: { meaning: 'tierra, suelo, país', root: 'Raíz no usada', grammar: 'Sustantivo femenino + artículo', occurrences: '2504x en el Antiguo Testamento' },
  },
};

/** Glosas do interlinear (a tradução que aparece sob cada palavra). */
type WordEntry = { surface: string; translit: string; strong: string; gloss: Record<Locale, string> };

const JOHN_1_1: WordEntry[] = [
  { surface: 'Ἐν', translit: 'En', strong: 'G1722', gloss: { en: 'In', pt: 'No', es: 'En' } },
  { surface: 'ἀρχῇ', translit: 'archē', strong: 'G746', gloss: { en: 'beginning', pt: 'princípio', es: 'principio' } },
  { surface: 'ἦν', translit: 'ēn', strong: 'G2258', gloss: { en: 'was', pt: 'era', es: 'era' } },
  { surface: 'ὁ', translit: 'ho', strong: 'G3588', gloss: { en: 'the', pt: 'o', es: 'el' } },
  { surface: 'Λόγος', translit: 'Logos', strong: 'G3056', gloss: { en: 'Word', pt: 'Verbo', es: 'Verbo' } },
  { surface: 'καὶ', translit: 'kai', strong: 'G2532', gloss: { en: 'and', pt: 'e', es: 'y' } },
  { surface: 'ὁ', translit: 'ho', strong: 'G3588', gloss: { en: 'the', pt: 'o', es: 'el' } },
  { surface: 'Λόγος', translit: 'Logos', strong: 'G3056', gloss: { en: 'Word', pt: 'Verbo', es: 'Verbo' } },
  { surface: 'ἦν', translit: 'ēn', strong: 'G2258', gloss: { en: 'was', pt: 'era', es: 'era' } },
  { surface: 'πρὸς', translit: 'pros', strong: 'G4314', gloss: { en: 'with', pt: 'com', es: 'con' } },
  { surface: 'τὸν', translit: 'ton', strong: 'G3588', gloss: { en: 'the', pt: 'o', es: 'el' } },
  { surface: 'Θεόν', translit: 'Theon', strong: 'G2316', gloss: { en: 'God', pt: 'Deus', es: 'Dios' } },
];

const GENESIS_1_1: WordEntry[] = [
  { surface: 'בְּרֵאשִׁית', translit: 'Bereshit', strong: 'H7225', gloss: { en: 'In the beginning', pt: 'No princípio', es: 'En el principio' } },
  { surface: 'בָּרָא', translit: 'bara', strong: 'H1254', gloss: { en: 'created', pt: 'criou', es: 'creó' } },
  { surface: 'אֱלֹהִים', translit: 'Elohim', strong: 'H430', gloss: { en: 'God', pt: 'Deus', es: 'Dios' } },
  { surface: 'אֵת', translit: 'et', strong: 'H853', gloss: { en: '[object]', pt: '[objeto]', es: '[objeto]' } },
  { surface: 'הַשָּׁמַיִם', translit: 'hashamayim', strong: 'H8064', gloss: { en: 'the heavens', pt: 'os céus', es: 'los cielos' } },
  { surface: 'וְאֵת', translit: "ve'et", strong: 'H853', gloss: { en: 'and', pt: 'e', es: 'y' } },
  { surface: 'הָאָרֶץ', translit: "ha'arets", strong: 'H776', gloss: { en: 'the earth', pt: 'a terra', es: 'la tierra' } },
];

const VERSES: { id: string; ref: string; testament: 'AT' | 'NT'; source: string; words: WordEntry[] }[] = [
  { id: 'jo1-1', ref: 'John 1:1', testament: 'NT', source: 'Textus Receptus', words: JOHN_1_1 },
  { id: 'gn1-1', ref: 'Genesis 1:1', testament: 'AT', source: 'BHS — Masoretic Text', words: GENESIS_1_1 },
];

/** Referência do versículo no idioma da interface (nome do livro traduzido). */
const REF_LABEL: Record<string, Record<Locale, string>> = {
  'jo1-1': { en: 'John 1:1', pt: 'João 1:1', es: 'Juan 1:1' },
  'gn1-1': { en: 'Genesis 1:1', pt: 'Gênesis 1:1', es: 'Génesis 1:1' },
};

const SOURCE_LABEL: Record<string, Record<Locale, string>> = {
  'jo1-1': { en: 'Textus Receptus', pt: 'Textus Receptus', es: 'Textus Receptus' },
  'gn1-1': {
    en: 'BHS — Masoretic Text',
    pt: 'BHS — Texto Massorético',
    es: 'BHS — Texto Masorético',
  },
};

/** Versículos interlineares no idioma pedido. */
export function interlinearVersesForLocale(locale: Locale): InterlinearVerse[] {
  return VERSES.map((v) => ({
    id: v.id,
    ref: REF_LABEL[v.id]?.[locale] ?? v.ref,
    testament: v.testament,
    source: SOURCE_LABEL[v.id]?.[locale] ?? v.source,
    words: v.words.map((w) => ({
      surface: w.surface,
      translit: w.translit,
      gloss: w.gloss[locale] ?? w.gloss.en,
      strong: w.strong,
    })),
  }));
}

/** Verbete Strong no idioma pedido. */
export function getStrong(id: string, locale: Locale): StrongEntry | undefined {
  const data = STRONG_DATA[id];
  if (!data) return undefined;
  const text = data[locale] ?? data.en;
  return { id, lemma: data.lemma, translit: data.translit, ...text };
}
