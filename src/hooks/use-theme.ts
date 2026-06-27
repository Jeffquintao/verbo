import { useColorScheme } from 'react-native';

import { type ColorScheme, themeColors } from '@/constants/themes';
import { useThemeStore, type ThemeMode } from '@/store/useThemeStore';

/**
 * Resolve o tema efetivo (claro/escuro) a partir da preferência do usuário
 * (claro/escuro/sistema) e devolve as cores em hex para props JS.
 */
export function useTheme(): {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: (typeof themeColors)[ColorScheme];
  setMode: (mode: ThemeMode) => void;
} {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const system = useColorScheme() ?? 'light';
  const scheme: ColorScheme = mode === 'system' ? (system as ColorScheme) : mode;
  return { mode, scheme, colors: themeColors[scheme], setMode };
}
