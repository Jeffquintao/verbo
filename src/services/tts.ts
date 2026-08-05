/**
 * Narração (expo-speech / TTS do aparelho).
 *
 * Três coisas decidem o quanto a leitura soa humana, e nenhuma delas custa nada:
 *
 * 1. **Qual voz.** O aparelho costuma ter várias. No Android, o motor do Google
 *    instala pares `…-local` e `…-network`: as `-network` são neurais e soam
 *    muito melhores (exigem internet). No iOS, as vozes `premium`/`enhanced` e
 *    as da Siri são as boas, e as `eloquence` são as robóticas antigas.
 *    `voiceScore` ordena por isso.
 * 2. **Qual idioma.** A voz precisa ser do idioma do texto. Uma voz portuguesa
 *    lendo inglês soa péssima — e era o que acontecia, porque a fala era fixada
 *    em `pt-BR` independentemente do idioma do app.
 * 3. **Como o texto chega.** `SENHOR` em caixa alta faz vários motores soletrarem
 *    "S-E-N-H-O-R" ou mudarem a entonação; travessões viram pausas erradas; e um
 *    versículo sem pontuação final termina cortado, sem cadência de fim de frase.
 *    `humanizeForSpeech` resolve isso antes de mandar falar.
 *
 * Dica para o usuário: no iOS dá para baixar vozes premium em Ajustes >
 * Acessibilidade > Conteúdo Falado > Vozes; no Android, em Configurações >
 * Idiomas > Saída de conversão de texto em voz.
 */
import * as Speech from 'expo-speech';

import type { Locale } from '@/store/useLocaleStore';

export type TtsVoice = Speech.Voice;

/** Idiomas aceitos por locale, do mais para o menos desejado. */
const LANG_PREFS: Record<Locale, string[]> = {
  pt: ['pt-br', 'pt-pt', 'pt'],
  en: ['en-us', 'en-gb', 'en-au', 'en'],
  es: ['es-us', 'es-mx', 'es-es', 'es-419', 'es'],
};

/** Tag passada ao expo-speech quando nenhuma voz explícita foi escolhida. */
const SPEECH_LANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

export function speechLanguage(locale: Locale): string {
  return SPEECH_LANG[locale] ?? 'en-US';
}

// Marcadores comuns em nomes/identificadores de vozes masculinas e femininas.
const MALE_HINTS = [
  'felipe', 'ricardo', 'daniel', 'joão', 'joao', 'carlos', 'heitor', 'antônio',
  'antonio', 'jorge', 'diego', 'enrique', 'pablo', 'alex', 'aaron', 'fred',
  'tom', 'male', 'masc', 'homem', 'hombre', '-md', '_md', 'ptd', 'pte',
];
const FEMALE_HINTS = [
  'luciana', 'maria', 'joana', 'fernanda', 'catarina', 'helena', 'monica',
  'mónica', 'paulina', 'samantha', 'karen', 'moira', 'tessa', 'female',
  'fem', 'mulher', 'mujer', 'afs', 'pta', 'ptb',
];

function langRank(voice: Speech.Voice, locale: Locale): number {
  const lang = (voice.language ?? '').toLowerCase().replace('_', '-');
  const prefs = LANG_PREFS[locale] ?? [];
  for (let i = 0; i < prefs.length; i++) {
    if (lang === prefs[i] || lang.startsWith(prefs[i] + '-')) return prefs.length - i;
  }
  return lang.startsWith(prefs[prefs.length - 1] ?? '') ? 1 : 0;
}

function voiceScore(v: Speech.Voice, locale: Locale): number {
  let s = langRank(v, locale) * 40;

  const tag = `${v.name ?? ''} ${v.identifier ?? ''}`.toLowerCase();

  // Android: as vozes "-network" do Google são neurais — a maior diferença
  // audível entre uma leitura robótica e uma agradável.
  if (tag.includes('-network')) s += 120;
  // iOS
  if (tag.includes('premium')) s += 110;
  if (v.quality === Speech.VoiceQuality.Enhanced || tag.includes('enhanced')) s += 100;
  if (tag.includes('siri')) s += 90;
  // Vozes antigas e sintéticas demais.
  if (tag.includes('eloquence')) s -= 200;
  if (tag.includes('compact')) s -= 60;

  if (MALE_HINTS.some((m) => tag.includes(m))) s += 30;
  if (FEMALE_HINTS.some((f) => tag.includes(f))) s -= 20;

  return s;
}

/** Vozes do idioma pedido, da melhor para a pior. */
export async function getVoicesForLocale(locale: Locale): Promise<Speech.Voice[]> {
  try {
    const all = await Speech.getAvailableVoicesAsync();
    return all
      .filter((v) => langRank(v, locale) > 0)
      .sort((a, b) => voiceScore(b, locale) - voiceScore(a, locale));
  } catch {
    return [];
  }
}

/** Melhor voz do idioma. null se o aparelho não tiver nenhuma. */
export function pickDefaultVoice(voices: Speech.Voice[]): string | null {
  return voices[0]?.identifier ?? null;
}

/** Voz neural/premium — as que realmente soam humanas. */
export function isNaturalVoice(v: Speech.Voice): boolean {
  const tag = `${v.name ?? ''} ${v.identifier ?? ''}`.toLowerCase();
  return (
    tag.includes('-network') ||
    tag.includes('premium') ||
    tag.includes('siri') ||
    v.quality === Speech.VoiceQuality.Enhanced
  );
}

/** Nome amigável da voz para exibição. */
export function voiceLabel(v: Speech.Voice): string {
  return `${v.name || v.identifier} (${v.language})${isNaturalVoice(v) ? ' · HD' : ''}`;
}

// ---------------------------------------------------------------------------
// Preparo do texto
// ---------------------------------------------------------------------------

// Sem \p{Lu}: a classe explícita não depende de suporte a property escapes.
const UPPER = 'A-ZÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ';
const CAPS_RUN = new RegExp(`[${UPPER}]{3,}`, 'g');

/**
 * Deixa um versículo pronto para ser falado.
 *
 * `SENHOR` aparece 644 vezes na ACF e `LORD` 6648 na KJV; em caixa alta vários
 * motores soletram letra a letra ou mudam a ênfase. Vira `Senhor`/`Lord` — só
 * para o áudio, o texto na tela continua como está.
 */
export function humanizeForSpeech(text: string): string {
  let out = text
    .replace(CAPS_RUN, (m) => m.charAt(0) + m.slice(1).toLowerCase())
    // Travessão/meia-risca não têm pausa definida em TTS; vírgula tem.
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  // Sem pontuação final o motor corta a frase seca, sem cadência de fim.
  if (out && !/[.!?;:]$/.test(out)) out += '.';
  return out;
}

/** Frase de pré-escuta do seletor de voz, no idioma do usuário. */
const SAMPLES: Record<Locale, string> = {
  pt: 'No princípio, Deus criou os céus e a terra.',
  en: 'In the beginning God created the heaven and the earth.',
  es: 'En el principio creó Dios los cielos y la tierra.',
};

export function voiceSample(locale: Locale): string {
  return SAMPLES[locale] ?? SAMPLES.en;
}
