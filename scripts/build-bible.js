/* eslint-disable */
/**
 * Baixa e normaliza as Bíblias usadas pelo app (todas em domínio público)
 * para o schema único: versao[livro][capitulo][versiculo] (string[][][]).
 *
 * Fontes:
 *   ACF  (pt) — Almeida Corrigida Fiel      — thiagobodruk/biblia
 *   NVI  (pt) — Nova Versão Internacional   — thiagobodruk/biblia
 *   KJV  (en) — King James Version          — bibleapi/bibleapi-bibles-json
 *   ASV  (en) — American Standard Version   — bibleapi/bibleapi-bibles-json
 *   RVR  (es) — Reina-Valera 1909           — aruljohn/Reina-Valera (1 arquivo por livro)
 *
 * Saída:
 *   assets/bible/{acf,nvi,kjv,asv,rvr}.bible — string[][][] (assets, fora do bundle JS)
 *   src/data/bible/books.json — [{ abbrev, name, nameEn, nameEs, testament, chapters }]
 *
 * Rodar: node scripts/build-bible.js   (precisa de internet; Node 18+)
 */
const fs = require('fs');
const path = require('path');

// books.json fica em src/ (é módulo JS); os textos vão para assets/ como
// arquivos .bible, para NÃO entrarem no bundle JavaScript (ver metro.config.js).
const META_DIR = path.join(__dirname, '..', 'src', 'data', 'bible');
const TEXT_DIR = path.join(__dirname, '..', 'assets', 'bible');

// --- Nomes dos livros, em ordem canônica (66) ---
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
const NAMES_ES = [
  'Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut',
  '1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías',
  'Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías',
  'Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas',
  'Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías',
  'Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas',
  'Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo',
  '2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan',
  '3 Juan','Judas','Apocalipsis',
];

// Nomes dos ARQUIVOS no repo aruljohn/Reina-Valera (grafia própria do repo),
// em ordem canônica. Não confundir com NAMES_ES (o que exibimos na UI).
const RVR_FILES = [
  'Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut',
  '1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Ésdras','Nehemías',
  'Ester','Job','Salmos','Proverbios','Eclesiástes','Cantares','Isaías','Jeremías',
  'Lamentaciones','Ezequiel','Daniel','Oséas','Joel','Amós','Abdías','Jonás','Miquéas',
  'Nahum','Habacuc','Sofonías','Aggeo','Zacarías','Malaquías',
  'San Mateo','San Márcos','San Lúcas','San Juan','Los Actos','Romanos','1 Corintios',
  '2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses',
  '2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago',
  '1 San Pedro','2 San Pedro','1 San Juan','2 San Juan','3 San Juan','San Júdas','Revelación',
];

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ao baixar ${url}`);
  return res.json();
}

/** Formato thiagobodruk: [{ abbrev, chapters: string[][] }] -> string[][][] */
async function fetchBodruk(file, label) {
  const raw = await getJson(`https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/${file}`);
  if (raw.length !== 66) throw new Error(`${label}: esperava 66 livros, veio ${raw.length}`);
  return { chapters: raw.map((b) => b.chapters), abbrevs: raw.map((b) => b.abbrev) };
}

/** Formato bibleapi: resultset.row[].field = [id, livro, cap, ver, texto] */
async function fetchBibleApi(file, label) {
  const raw = await getJson(`https://raw.githubusercontent.com/bibleapi/bibleapi-bibles-json/master/${file}`);
  const out = Array.from({ length: 66 }, () => []);
  for (const row of raw.resultset.row) {
    const [, bookNum, chapter, verse, text] = row.field;
    const b = bookNum - 1;
    if (!out[b][chapter - 1]) out[b][chapter - 1] = [];
    out[b][chapter - 1][verse - 1] = text;
  }
  const filled = out.filter((b) => b.length > 0).length;
  if (filled !== 66) throw new Error(`${label}: esperava 66 livros, veio ${filled}`);
  return out;
}

/** Formato aruljohn: um arquivo por livro, { book, chapters: [{ chapter, verses: [{verse, text}] }] } */
async function fetchRvr() {
  const out = [];
  // Baixa em lotes para não abrir 66 conexões de uma vez.
  const BATCH = 8;
  for (let i = 0; i < RVR_FILES.length; i += BATCH) {
    const slice = RVR_FILES.slice(i, i + BATCH);
    const books = await Promise.all(
      slice.map((name) =>
        getJson(
          `https://raw.githubusercontent.com/aruljohn/Reina-Valera/master/${encodeURIComponent(name)}.json`,
        ),
      ),
    );
    for (const book of books) {
      out.push(book.chapters.map((ch) => ch.verses.map((v) => v.text)));
    }
    process.stdout.write(`  RVR ${out.length}/66\r`);
  }
  if (out.length !== 66) throw new Error(`RVR: esperava 66 livros, veio ${out.length}`);
  return out;
}

(async () => {
  fs.mkdirSync(META_DIR, { recursive: true });
  fs.mkdirSync(TEXT_DIR, { recursive: true });

  console.log('Baixando ACF…');
  const acf = await fetchBodruk('acf.json', 'ACF');
  console.log('Baixando NVI…');
  const nvi = await fetchBodruk('nvi.json', 'NVI');
  console.log('Baixando KJV…');
  const kjv = await fetchBibleApi('kjv.json', 'KJV');
  console.log('Baixando ASV…');
  const asv = await fetchBibleApi('asv.json', 'ASV');
  console.log('Baixando RVR (66 arquivos)…');
  const rvr = await fetchRvr();
  console.log('');

  const books = acf.abbrevs.map((abbrev, i) => ({
    abbrev,
    name: NAMES_PT[i],
    nameEn: NAMES_EN[i],
    nameEs: NAMES_ES[i],
    testament: i < 39 ? 'AT' : 'NT',
    chapters: acf.chapters[i].length,
  }));

  const write = (name, data) =>
    fs.writeFileSync(path.join(TEXT_DIR, name + '.bible'), JSON.stringify(data));
  write('acf', acf.chapters);
  write('nvi', nvi.chapters);
  write('kjv', kjv);
  write('asv', asv);
  write('rvr', rvr);
  fs.writeFileSync(path.join(META_DIR, 'books.json'), JSON.stringify(books, null, 2));

  const count = (v) => v.reduce((n, b) => n + b.length, 0);
  console.log(`OK — ${books.length} livros.`);
  console.log(`ACF: ${count(acf.chapters)} capítulos`);
  console.log(`NVI: ${count(nvi.chapters)} capítulos`);
  console.log(`KJV: ${count(kjv)} capítulos`);
  console.log(`ASV: ${count(asv)} capítulos`);
  console.log(`RVR: ${count(rvr)} capítulos`);
})().catch((err) => {
  console.error('FALHOU:', err.message);
  process.exit(1);
});
