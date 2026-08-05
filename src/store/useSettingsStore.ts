import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, type TextStyle } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Preferências de leitura e acessibilidade.
 *
 * Tudo aqui muda algo de verdade na tela — nenhuma opção é decorativa. Ver
 * `useVerseStyle` (texto bíblico) e `useModalAnimation` (reduzir animações).
 */

export const FONT_SCALES = [0.9, 1, 1.15, 1.35, 1.6] as const;
export type FontScale = (typeof FONT_SCALES)[number];

export const LINE_SPACINGS = {
  compact: 1.45,
  normal: 1.75,
  relaxed: 2.1,
} as const;
export type LineSpacing = keyof typeof LINE_SPACINGS;

/** Corpo do versículo antes de qualquer ajuste (equivale a `text-base`). */
const BASE_FONT_SIZE = 16;

type SettingsState = {
  /** Nome escolhido pelo usuário. Tem prioridade sobre o nome da conta. */
  displayName: string | null;
  fontScale: FontScale;
  lineSpacing: LineSpacing;
  serif: boolean;
  boldText: boolean;
  keepAwake: boolean;
  reduceMotion: boolean;

  setDisplayName: (name: string | null) => void;
  setFontScale: (scale: FontScale) => void;
  setLineSpacing: (spacing: LineSpacing) => void;
  toggle: (key: 'serif' | 'boldText' | 'keepAwake' | 'reduceMotion') => void;
  reset: () => void;
};

const DEFAULTS = {
  displayName: null,
  fontScale: 1 as FontScale,
  lineSpacing: 'normal' as LineSpacing,
  serif: false,
  boldText: false,
  keepAwake: false,
  reduceMotion: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setDisplayName: (displayName) => set({ displayName: displayName?.trim() || null }),
      setFontScale: (fontScale) => set({ fontScale }),
      setLineSpacing: (lineSpacing) => set({ lineSpacing }),
      toggle: (key) => set((s) => ({ [key]: !s[key] }) as Pick<SettingsState, typeof key>),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'reading-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/**
 * Estilo do texto bíblico. Devolve valores calculados em vez de classes porque
 * o tamanho é contínuo — Tailwind só tem degraus fixos.
 */
export function useVerseStyle(): { verse: TextStyle; number: TextStyle } {
  const fontScale = useSettingsStore((s) => s.fontScale);
  const lineSpacing = useSettingsStore((s) => s.lineSpacing);
  const serif = useSettingsStore((s) => s.serif);
  const boldText = useSettingsStore((s) => s.boldText);

  const fontSize = Math.round(BASE_FONT_SIZE * fontScale);
  // 'serif' é o nome genérico no Android; no iOS é preciso nomear a fonte.
  const fontFamily = serif ? (Platform.OS === 'ios' ? 'Georgia' : 'serif') : undefined;

  return {
    verse: {
      fontSize,
      lineHeight: Math.round(fontSize * LINE_SPACINGS[lineSpacing]),
      fontFamily,
      fontWeight: boldText ? '600' : 'normal',
    },
    number: {
      // O número do versículo acompanha, mas discreto.
      fontSize: Math.max(10, Math.round(fontSize * 0.7)),
      fontFamily,
    },
  };
}

/** 'none' quando o usuário pediu menos animação. */
export function useModalAnimation(preferred: 'slide' | 'fade'): 'slide' | 'fade' | 'none' {
  return useSettingsStore((s) => (s.reduceMotion ? 'none' : preferred));
}

/** Nome a exibir: o escolhido nas configurações, senão o da conta. */
export function useDisplayName(accountName: string | undefined, fallback: string): string {
  const displayName = useSettingsStore((s) => s.displayName);
  return displayName ?? accountName ?? fallback;
}
