import { useEffect } from 'react';

import { defaultVersionForLocale, isVersionInLocale } from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';
import { useLocaleStore } from '@/store/useLocaleStore';

/**
 * Mantém a versão da Bíblia coerente com o idioma da interface.
 *
 * Se o idioma muda (ou o estado salvo tem uma versão de outro idioma — por
 * exemplo ACF com a interface em inglês), troca para a versão padrão do idioma.
 * Montado uma vez no layout raiz.
 */
export function useLocaleSync() {
  const locale = useLocaleStore((s) => s.locale);
  const version = useBibleStore((s) => s.version);
  const setVersion = useBibleStore((s) => s.setVersion);

  useEffect(() => {
    if (!isVersionInLocale(version, locale)) {
      setVersion(defaultVersionForLocale(locale));
    }
  }, [locale, version, setVersion]);
}
