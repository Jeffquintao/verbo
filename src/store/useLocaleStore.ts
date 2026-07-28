import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Locale = 'en' | 'pt' | 'es';

export const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
];

/**
 * Idioma do aparelho, se for um dos suportados. Inglês é o padrão do app,
 * então qualquer outro idioma cai em 'en'.
 */
function detectDeviceLocale(): Locale {
  try {
    const code = getLocales()[0]?.languageCode?.toLowerCase();
    if (code === 'pt' || code === 'es') return code;
  } catch {
    // ambiente sem localização disponível — usa o padrão
  }
  return 'en';
}

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      // Primeira execução: segue o aparelho. Depois, o valor salvo prevalece
      // (a rehidratação do persist sobrescreve este valor inicial).
      locale: detectDeviceLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'locale-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
