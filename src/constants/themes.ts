import { vars } from 'nativewind';

/**
 * Variáveis de tema aplicadas no root (via style) — fazem os tokens
 * semânticos do Tailwind (background, surface, foreground, border) trocarem
 * entre claro e escuro. Valores em canais RGB ("r g b") para suportar opacidade.
 */
export const themeVars = {
  light: vars({
    '--color-background': '251 248 241',
    '--color-surface': '255 255 255',
    '--color-foreground': '28 27 34',
    '--color-border': '28 27 34',
  }),
  dark: vars({
    '--color-background': '18 17 23',
    '--color-surface': '30 29 38',
    '--color-foreground': '237 237 242',
    '--color-border': '237 237 242',
  }),
};

/** Versão em hex dos tokens, para props de cor JS (ícones, tabBar, status bar). */
export const themeColors = {
  light: {
    background: '#FBF8F1',
    surface: '#FFFFFF',
    foreground: '#1C1B22',
    muted: '#9CA3AF',
    border: '#E7E1D6',
  },
  dark: {
    background: '#121117',
    surface: '#1E1D26',
    foreground: '#EDEDF2',
    muted: '#8A8A99',
    border: '#2A2933',
  },
} as const;

export type ColorScheme = keyof typeof themeColors;
