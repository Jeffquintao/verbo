import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Preferências da narração (TTS): voz escolhida, velocidade e tom.
 * Persistido para o usuário não precisar reconfigurar.
 */
type AudioSettings = {
  voiceId: string | null; // identifier da voz (expo-speech)
  rate: number;
  pitch: number;
  setVoice: (voiceId: string | null) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
};

export const useAudioSettings = create<AudioSettings>()(
  persist(
    (set) => ({
      voiceId: null, // null = escolha automática (melhor voz masculina PT)
      rate: 1.0,
      pitch: 0.96, // levemente mais grave = mais natural/masculino
      setVoice: (voiceId) => set({ voiceId }),
      setRate: (rate) => set({ rate }),
      setPitch: (pitch) => set({ pitch }),
    }),
    {
      name: 'audio-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
