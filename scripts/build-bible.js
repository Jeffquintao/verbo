/* eslint-disable */
/**
 * Normaliza as fontes brutas da Bíblia para o schema único do app.
 *
 * Entrada (em src/data/bible/), formato thiagobodruk/biblia — [{ abbrev, chapters: string[][] }]:
 *   _acf_raw.json  — ACF (Almeida Corrigida Fiel)
 *   _nvi_raw.json  — NVI (Nova Versão Internacional)
 *
 * Saída:
 *   acf.json   — string[][][]  (livro -> capítulo -> versículos)
 *   nvi.json   — string[][][]
 *   books.json — [{ abbrev, name, nameEn, testament, chapters }]
 *
 * Rodar: node scripts/build-bible.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'data', 'bible');

const NAMES_PT = [
  'Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute',
  '1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias',
  'Ester','Jó','Salmos','Provérbios','Eclesiastes','Cânticos','Isaías','Jeremias',
  'Lamentações','Ezequiel','Daniel','Oséias','Joel','Amós','Obadias','Jonas','Miquéias',
  'Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias',
  'Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas',
  'Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo',
  '2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João',
  '3 João','Judas','Apocalipse',
];
const NAMES_EN = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah',
  'Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi',
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians',
  'Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy',
  '2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John',
  '3 John','Jude','Revelation',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8').replace(/^﻿/, ''));
}

/** Versão no formato thiagobodruk -> string[][][] (apenas os capítulos). */
function normalizeVersion(raw, label) {
  if (raw.length !== 66) throw new Error(`${label} deveria ter 66 livros, tem ${raw.length}`);
  return raw.map((b) => b.chapters);
}

const acfRaw = readJson('_acf_raw.json');
const nviRaw = readJson('_nvi_raw.json');

const acf = normalizeVersion(acfRaw, 'ACF');
const nvi = normalizeVersion(nviRaw, 'NVI');
const abbrevs = acfRaw.map((b) => b.abbrev);

const books = abbrevs.map((abbrev, i) => ({
  abbrev,
  name: NAMES_PT[i],
  nameEn: NAMES_EN[i],
  testament: i < 39 ? 'AT' : 'NT',
  chapters: acf[i].length,
}));

fs.writeFileSync(path.join(DIR, 'acf.json'), JSON.stringify(acf));
fs.writeFileSync(path.join(DIR, 'nvi.json'), JSON.stringify(nvi));
fs.writeFileSync(path.join(DIR, 'books.json'), JSON.stringify(books, null, 2));

console.log(`OK — ${books.length} livros.`);
console.log(`ACF: ${acf.reduce((n, b) => n + b.length, 0)} capítulos.`);
console.log(`NVI: ${nvi.reduce((n, b) => n + b.length, 0)} capítulos.`);
