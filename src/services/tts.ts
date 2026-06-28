/**
 * Seleção de voz para a narração (expo-speech / TTS do aparelho).
 *
 * O dispositivo costuma ter várias vozes em português. Aqui pontuamos para
 * preferir: qualidade "Enhanced" (premium) > pt-BR > voz masculina.
 * O usuário pode trocar manualmente (com pré-escuta) no seletor de voz.
 *
 * Dica: no iOS, vozes premium adicionais podem ser baixadas em
 * Ajustes > Acessibilidade > Conteúdo Falado > Vozes.
 */
import * as Speech from 'expo-speech';

export type TtsVoice = Speech.Voice;

// Marcadores comuns em nomes/identificadores de vozes masculinas e femininas.
const MALE_HINTS = [
  'felipe', 'ricardo', 'daniel', 'joão', 'joao', 'carlos', 'heitor', 'antônio',
  'antonio', 'male', 'masc', 'homem', '-md', '_md', 'ptd', 'pte',
];
const FEMALE_HINTS = [
  'luciana', 'maria', 'joana', 'fernanda', 'catarina', 'helena', 'female',
  'fem', 'mulher', 'afs', 'pta', 'ptb',
];

function voiceScore(v: Speech.Voice): number {
  let s = 0;
  if (v.quality === Speech.VoiceQuality.Enhanced) s += 100;
  const lang = (v.language ?? '').toLowerCase();
  if (lang.startsWith('pt-br')) s += 50;
  else if (lang.startsWith('pt')) s += 20;
  const tag = `${v.name ?? ''} ${v.identifier ?? ''}`.toLowerCase();
  if (MALE_HINTS.some((m) => tag.includes(m))) s += 30;
  if (FEMALE_HINTS.some((f) => tag.includes(f))) s -= 20;
  return s;
}

/** Vozes em português disponíveis, da melhor para a pior. */
export async function getPortugueseVoices(): Promise<Speech.Voice[]> {
  try {
    const all = await Speech.getAvailableVoicesAsync();
    return all
      .filter((v) => (v.language ?? '').toLowerCase().startsWith('pt'))
      .sort((a, b) => voiceScore(b) - voiceScore(a));
  } catch {
    return [];
  }
}

/** Melhor voz padrão (masculina/PT/premium). null se nenhuma disponível. */
export function pickDefaultVoice(voices: Speech.Voice[]): string | null {
  return voices[0]?.identifier ?? null;
}

/** Nome amigável da voz para exibição. */
export function voiceLabel(v: Speech.Voice): string {
  const enhanced = v.quality === Speech.VoiceQuality.Enhanced ? ' · Premium' : '';
  return `${v.name || v.identifier} (${v.language})${enhanced}`;
}

export const VOICE_SAMPLE = 'No princípio, Deus criou os céus e a terra.';
