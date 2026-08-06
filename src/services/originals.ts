/**
 * Interlinear grego (NT) e hebraico (AT) — texto original palavra a palavra
 * com código Strong, gramática e glosa.
 *
 * Dados: TAGNT e TAHOT do STEPBible.org / Tyndale House Cambridge, sob
 * CC BY 4.0 (uso comercial permitido, com atribuição — que aparece na tela).
 * Gerados por scripts/build-originals.js.
 *
 * Como as Bíblias, cada livro é um ASSET (~24MB no total) e não um módulo JS:
 * só o livro aberto é lido do disco. Ver metro.config.js.
 */
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

/** [palavra original, transliteração, glosa em inglês, glosa em espanhol, Strong] */
export type OriginalWord = [string, string, string, string, string];

/** [lema, significado, código gramatical] */
export type LexEntry = [string, string, string];

export type BookOriginals = {
  lex: Record<string, LexEntry>;
  /** chave "capítulo.versículo" */
  v: Record<string, OriginalWord[]>;
};

// Um require por livro: o Metro precisa do caminho literal para registrar o
// asset, e é isso que mantém os ~24MB fora do bundle JavaScript.
/* eslint-disable @typescript-eslint/no-require-imports */
const ASSETS: Record<string, number> = {
  gn: require('../../assets/originals/gn.orig'),
  ex: require('../../assets/originals/ex.orig'),
  lv: require('../../assets/originals/lv.orig'),
  nm: require('../../assets/originals/nm.orig'),
  dt: require('../../assets/originals/dt.orig'),
  js: require('../../assets/originals/js.orig'),
  jz: require('../../assets/originals/jz.orig'),
  rt: require('../../assets/originals/rt.orig'),
  '1sm': require('../../assets/originals/1sm.orig'),
  '2sm': require('../../assets/originals/2sm.orig'),
  '1rs': require('../../assets/originals/1rs.orig'),
  '2rs': require('../../assets/originals/2rs.orig'),
  '1cr': require('../../assets/originals/1cr.orig'),
  '2cr': require('../../assets/originals/2cr.orig'),
  ed: require('../../assets/originals/ed.orig'),
  ne: require('../../assets/originals/ne.orig'),
  et: require('../../assets/originals/et.orig'),
  'jó': require('../../assets/originals/jó.orig'),
  sl: require('../../assets/originals/sl.orig'),
  pv: require('../../assets/originals/pv.orig'),
  ec: require('../../assets/originals/ec.orig'),
  ct: require('../../assets/originals/ct.orig'),
  is: require('../../assets/originals/is.orig'),
  jr: require('../../assets/originals/jr.orig'),
  lm: require('../../assets/originals/lm.orig'),
  ez: require('../../assets/originals/ez.orig'),
  dn: require('../../assets/originals/dn.orig'),
  os: require('../../assets/originals/os.orig'),
  jl: require('../../assets/originals/jl.orig'),
  am: require('../../assets/originals/am.orig'),
  ob: require('../../assets/originals/ob.orig'),
  jn: require('../../assets/originals/jn.orig'),
  mq: require('../../assets/originals/mq.orig'),
  na: require('../../assets/originals/na.orig'),
  hc: require('../../assets/originals/hc.orig'),
  sf: require('../../assets/originals/sf.orig'),
  ag: require('../../assets/originals/ag.orig'),
  zc: require('../../assets/originals/zc.orig'),
  ml: require('../../assets/originals/ml.orig'),
  mt: require('../../assets/originals/mt.orig'),
  mc: require('../../assets/originals/mc.orig'),
  lc: require('../../assets/originals/lc.orig'),
  jo: require('../../assets/originals/jo.orig'),
  atos: require('../../assets/originals/atos.orig'),
  rm: require('../../assets/originals/rm.orig'),
  '1co': require('../../assets/originals/1co.orig'),
  '2co': require('../../assets/originals/2co.orig'),
  gl: require('../../assets/originals/gl.orig'),
  ef: require('../../assets/originals/ef.orig'),
  fp: require('../../assets/originals/fp.orig'),
  cl: require('../../assets/originals/cl.orig'),
  '1ts': require('../../assets/originals/1ts.orig'),
  '2ts': require('../../assets/originals/2ts.orig'),
  '1tm': require('../../assets/originals/1tm.orig'),
  '2tm': require('../../assets/originals/2tm.orig'),
  tt: require('../../assets/originals/tt.orig'),
  fm: require('../../assets/originals/fm.orig'),
  hb: require('../../assets/originals/hb.orig'),
  tg: require('../../assets/originals/tg.orig'),
  '1pe': require('../../assets/originals/1pe.orig'),
  '2pe': require('../../assets/originals/2pe.orig'),
  '1jo': require('../../assets/originals/1jo.orig'),
  '2jo': require('../../assets/originals/2jo.orig'),
  '3jo': require('../../assets/originals/3jo.orig'),
  jd: require('../../assets/originals/jd.orig'),
  ap: require('../../assets/originals/ap.orig'),
};
/* eslint-enable @typescript-eslint/no-require-imports */

const cache: Partial<Record<string, BookOriginals>> = {};
const inFlight: Partial<Record<string, Promise<BookOriginals>>> = {};

/** Créditos exigidos pela licença CC BY dos dados. */
export const ORIGINALS_CREDIT = 'STEPBible.org · Tyndale House Cambridge (CC BY 4.0)';

export function hasOriginals(abbrev: string): boolean {
  return abbrev in ASSETS;
}

/** Carrega (e memoriza) o interlinear de um livro. */
export function loadBookOriginals(abbrev: string): Promise<BookOriginals> {
  const cached = cache[abbrev];
  if (cached) return Promise.resolve(cached);
  const pending = inFlight[abbrev];
  if (pending) return pending;

  const moduleId = ASSETS[abbrev];
  if (moduleId === undefined) {
    return Promise.reject(new Error(`livro sem interlinear: ${abbrev}`));
  }

  const task = (async () => {
    const asset = Asset.fromModule(moduleId);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    const raw = await FileSystem.readAsStringAsync(uri);
    const data = JSON.parse(raw) as BookOriginals;
    cache[abbrev] = data;
    delete inFlight[abbrev];
    return data;
  })();

  inFlight[abbrev] = task;
  return task;
}

/** Palavras de um versículo. Lista vazia quando o versículo não existe. */
export function verseWords(
  data: BookOriginals | undefined,
  chapter: number,
  verse: number,
): OriginalWord[] {
  return data?.v[`${chapter}.${verse}`] ?? [];
}

/**
 * Quantos versículos o capítulo tem no texto original.
 *
 * Conta a partir do 1 e para no primeiro buraco: a numeração hebraica às vezes
 * difere da das traduções, então o total da Bíblia em português não serve.
 */
export function chapterVerseCount(data: BookOriginals | undefined, chapter: number): number {
  if (!data) return 0;
  let n = 0;
  while (data.v[`${chapter}.${n + 1}`]) n++;
  return n;
}
