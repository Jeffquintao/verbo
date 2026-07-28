import { useLocaleStore, type Locale } from '@/store/useLocaleStore';

import { en, type Translation } from './en';
import { es } from './es';
import { pt } from './pt';

const TRANSLATIONS: Record<Locale, Translation> = { en, pt, es };

/**
 * Textos da interface no idioma atual.
 *
 *   const t = useTranslation();
 *   <Text>{t.home.verseOfDay}</Text>
 *   <Text>{t.home.greeting(nome)}</Text>
 *
 * As chaves são tipadas a partir de `en` — errar o nome é erro de compilação.
 */
export function useTranslation(): Translation {
  const locale = useLocaleStore((s) => s.locale);
  return TRANSLATIONS[locale] ?? en;
}

/** Versão fora de componentes (ex.: dentro de serviços). */
export function getTranslation(): Translation {
  return TRANSLATIONS[useLocaleStore.getState().locale] ?? en;
}

export type { Translation };
