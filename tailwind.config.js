/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tokens semânticos (trocam com o tema via variáveis CSS — ver themes.ts)
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',

        // Cores de marca (fixas nos dois temas)
        primary: {
          DEFAULT: '#6D28D9',
          dark: '#5B21B6',
          light: '#8B5CF6',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B8941F',
          light: '#EAC84F',
        },
        ink: '#1C1B22', // superfícies sempre escuras (headers premium)
        cream: '#FBF8F1',
      },
    },
  },
  plugins: [],
};
