/**
 * Gera os dados interlineares (grego/hebraico) a partir do STEPBible-Data.
 *
 *   node scripts/build-originals.js
 *
 * Fonte: TAGNT (grego) e TAHOT (hebraico), de STEPBible.org / Tyndale House,
 * sob CC BY 4.0 — uso comercial permitido com atribuição. A atribuição fica
 * visível na própria tela de Textos Originais.
 *   https://github.com/STEPBible/STEPBible-Data
 *
 * Saída: um arquivo por livro em assets/originals/<abbrev>.orig, para o app
 * carregar só o livro aberto (do mesmo jeito que as Bíblias). O formato é
 * enxuto de propósito — nomes de campo longos multiplicados por 550 mil
 * palavras custam megabytes.
 *
 * Formato de cada arquivo:
 *   {
 *     "lex": { "G3056": ["λόγος", "word, reason", "N-NSM"] },   // por Strong
 *     "v":   { "1.1": [["Ἐν","En","In [the]","En","G1722"], ...] }  // cap.ver
 *   }
 */
const fs = require('fs');
const path = require('path');

const BASE =
  'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Translators%20Amalgamated%20OT%2BNT/';

const SOURCES = [
  { file: 'TAHOT Gen-Deu - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt', testament: 'AT' },
  { file: 'TAHOT Jos-Est - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt', testament: 'AT' },
  { file: 'TAHOT Job-Sng - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt', testament: 'AT' },
  { file: 'TAHOT Isa-Mal - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt', testament: 'AT' },
  { file: 'TAGNT Mat-Jhn - Translators Amalgamated Greek NT - STEPBible.org CC-BY.txt', testament: 'NT' },
  { file: 'TAGNT Act-Rev - Translators Amalgamated Greek NT - STEPBible.org CC-BY.txt', testament: 'NT' },
];

/** Sigla do STEPBible -> abbrev usado no app (src/data/bible/books.json). */
const BOOK_MAP = {
  Gen: 'gn', Exo: 'ex', Lev: 'lv', Num: 'nm', Deu: 'dt', Jos: 'js', Jdg: 'jz', Rut: 'rt',
  '1Sa': '1sm', '2Sa': '2sm', '1Ki': '1rs', '2Ki': '2rs', '1Ch': '1cr', '2Ch': '2cr',
  Ezr: 'ed', Neh: 'ne', Est: 'et', Job: 'jó', Psa: 'sl', Pro: 'pv', Ecc: 'ec', Sng: 'ct',
  Isa: 'is', Jer: 'jr', Lam: 'lm', Ezk: 'ez', Dan: 'dn', Hos: 'os', Jol: 'jl', Amo: 'am',
  Oba: 'ob', Jon: 'jn', Mic: 'mq', Nam: 'na', Hab: 'hc', Zep: 'sf', Hag: 'ag', Zec: 'zc',
  Mal: 'ml',
  Mat: 'mt', Mrk: 'mc', Luk: 'lc', Jhn: 'jo', Act: 'atos', Rom: 'rm', '1Co': '1co',
  '2Co': '2co', Gal: 'gl', Eph: 'ef', Php: 'fp', Col: 'cl', '1Th': '1ts', '2Th': '2ts',
  '1Ti': '1tm', '2Ti': '2tm', Tit: 'tt', Phm: 'fm', Heb: 'hb', Jas: 'tg', '1Pe': '1pe',
  '2Pe': '2pe', '1Jn': '1jo', '2Jn': '2jo', '3Jn': '3jo', Jud: 'jd', Rev: 'ap',
};

const CACHE = path.join(__dirname, '..', '.cache', 'stepbible');
const OUT = path.join(__dirname, '..', 'assets', 'originals');

async function download(file) {
  fs.mkdirSync(CACHE, { recursive: true });
  const dest = path.join(CACHE, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log('  (cache)', file.slice(0, 45));
    return dest;
  }
  process.stdout.write('  baixando ' + file.slice(0, 45) + '… ');
  const res = await fetch(BASE + encodeURIComponent(file));
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${file}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log((buf.length / 1e6).toFixed(1) + ' MB');
  return dest;
}

/** "Ἐν (En)" -> ['Ἐν', 'En'] */
function splitSurface(raw) {
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(raw);
  return m ? [m[1].trim(), m[2].trim()] : [raw.trim(), ''];
}

/**
 * O hebraico separa morfemas com "/" (prefixo/raiz/sufixo) e traz marcas de
 * pontuação massorética escapadas ("\׃"). Nada disso deve aparecer na tela.
 */
function cleanHebrew(s) {
  return s.replace(/\\[^\s]*/g, '').replace(/\//g, '').trim();
}

/**
 * O Strong hebraico vem como "H9003/{H7225G}": os prefixos ficam soltos e a
 * palavra principal entre chaves. É a palavra principal que interessa.
 */
function mainStrong(raw) {
  const s = (raw || '').trim();
  const braced = /\{([^}]+)\}/.exec(s);
  const pick = braced ? braced[1] : s.split('/')[0];
  return (pick || '').replace(/\\.*$/, '').trim();
}

/**
 * Uma linha do TAGNT (grego). Colunas: 0 ref, 1 "grego (translit)",
 * 2 inglês, 3 "dStrong=gramática", 4 "lema=glosa", 8 espanhol.
 */
function parseGreek(c) {
  const [surface, translit] = splitSurface((c[1] || '').trim());
  const [strongRaw, grammar] = (c[3] || '').split('=');
  const [lemma, lexGloss] = (c[4] || '').split('=');
  return {
    surface,
    translit,
    en: (c[2] || '').trim(),
    es: (c[8] || '').trim(),
    strong: (strongRaw || '').trim(),
    lex: [(lemma || '').trim(), (lexGloss || '').trim(), (grammar || '').trim()],
  };
}

/**
 * Uma linha do TAHOT (hebraico) — layout diferente do grego. Colunas:
 * 0 ref, 1 hebraico, 2 transliteração, 3 inglês, 4 dStrongs, 5 gramática.
 * Não há coluna em espanhol nem forma de dicionário separada.
 */
function parseHebrew(c) {
  const surface = cleanHebrew(c[1] || '');
  const strong = mainStrong(c[4]);
  const gloss = (c[3] || '').replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
  return {
    surface,
    translit: (c[2] || '').replace(/\//g, '').trim(),
    en: gloss,
    es: '',
    strong,
    lex: [surface, gloss, (c[5] || '').trim()],
  };
}

async function main() {
  const books = new Map(); // abbrev -> { lex: Map, v: Map }
  let totalWords = 0;
  let unmapped = new Set();

  for (const src of SOURCES) {
    const file = await download(src.file);
    const text = fs.readFileSync(file, 'utf8');

    for (const line of text.split(/\r?\n/)) {
      if (!line || line[0] === '#') continue;
      const c = line.split('\t');
      const m = /^([1-3]?[A-Za-z]{2,3})\.(\d+)\.(\d+)#/.exec(c[0] || '');
      if (!m) continue;

      const abbrev = BOOK_MAP[m[1]];
      if (!abbrev) { unmapped.add(m[1]); continue; }

      const w = src.testament === 'AT' ? parseHebrew(c) : parseGreek(c);
      if (!w.surface || !w.strong) continue;

      if (!books.has(abbrev)) books.set(abbrev, { lex: new Map(), v: new Map() });
      const book = books.get(abbrev);

      // O léxico é por Strong: guardar uma vez em vez de repetir por palavra.
      if (!book.lex.has(w.strong)) book.lex.set(w.strong, w.lex);

      const key = `${m[2]}.${m[3]}`;
      if (!book.v.has(key)) book.v.set(key, []);
      book.v.get(key).push([w.surface, w.translit, w.en, w.es, w.strong]);
      totalWords++;
    }
  }

  if (unmapped.size) {
    throw new Error('siglas do STEPBible sem mapeamento: ' + [...unmapped].join(', '));
  }

  // Um abbrev errado geraria um arquivo que o app nunca acha — e o livro
  // apareceria vazio sem nenhum erro. Melhor quebrar aqui.
  const appBooks = require('../src/data/bible/books.json');
  const expected = new Set(appBooks.map((b) => b.abbrev));
  const missing = [...expected].filter((a) => !books.has(a));
  const extra = [...books.keys()].filter((a) => !expected.has(a));
  if (missing.length || extra.length) {
    throw new Error(
      `livros fora de sincronia com books.json — faltando: [${missing.join(', ')}] ` +
        `sobrando: [${extra.join(', ')}]`,
    );
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let bytes = 0;
  const index = {};
  for (const [abbrev, data] of books) {
    const json = JSON.stringify({
      lex: Object.fromEntries(data.lex),
      v: Object.fromEntries(data.v),
    });
    fs.writeFileSync(path.join(OUT, `${abbrev}.orig`), json);
    bytes += json.length;
    index[abbrev] = data.v.size;
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'originals-index.json'),
    JSON.stringify(index, null, 0),
  );

  console.log('\nlivros :', books.size);
  console.log('palavras:', totalWords.toLocaleString('pt-BR'));
  console.log('tamanho :', (bytes / 1e6).toFixed(1), 'MB em assets/originals/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
