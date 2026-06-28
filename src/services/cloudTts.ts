/**
 * Narração em nuvem (Google Cloud Text-to-Speech) — vozes WaveNet/Neural,
 * bem mais naturais que o TTS do aparelho.
 *
 * PLUGÁVEL: só ativa se EXPO_PUBLIC_GOOGLE_TTS_KEY estiver no .env. Sem a chave,
 * o app usa a voz do dispositivo (expo-speech) normalmente.
 *
 * Para ativar:
 *  1. Console Google Cloud > ative "Cloud Text-to-Speech API"
 *  2. Crie uma API key (restrinja à API de TTS)
 *  3. Coloque EXPO_PUBLIC_GOOGLE_TTS_KEY=... no .env
 *
 * Vozes pt-BR masculinas recomendadas: pt-BR-Neural2-B, pt-BR-Wavenet-B.
 * Preço: ~US$16 por 1M de caracteres (WaveNet/Neural). 1M chars ≈ a Bíblia toda.
 */
const KEY = process.env.EXPO_PUBLIC_GOOGLE_TTS_KEY;
const VOICE_NAME = process.env.EXPO_PUBLIC_GOOGLE_TTS_VOICE || 'pt-BR-Neural2-B';

export const isCloudTtsEnabled = Boolean(KEY);

/**
 * Sintetiza o texto e devolve o áudio MP3 em base64 (para tocar com expo-av).
 * Retorna null em caso de erro (o player então cai para a voz do dispositivo).
 */
export async function synthesizeToBase64(
  text: string,
  opts: { rate?: number; pitch?: number } = {},
): Promise<string | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'pt-BR', name: VOICE_NAME },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: opts.rate ?? 1.0,
            // Google usa semitons (-20 a 20); converte do nosso pitch (~1.0).
            pitch: opts.pitch != null ? (opts.pitch - 1) * 10 : 0,
          },
        }),
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { audioContent?: string };
    return json.audioContent ?? null;
  } catch {
    return null;
  }
}
