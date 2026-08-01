import { useEffect, useState } from 'react';

import {
  chapterVerses,
  getLoadedVersion,
  loadVersion,
  type BibleText,
  type BibleVersion,
} from '@/services/bible';

/**
 * Carrega o texto de uma versão bíblica (asset lido do disco).
 *
 * Se a versão já estiver em memória, `text` vem preenchido de imediato e
 * `loading` é false — ou seja, só a primeira abertura de cada versão mostra
 * carregamento.
 */
export function useBibleText(version: BibleVersion): {
  text: BibleText | undefined;
  loading: boolean;
} {
  const [text, setText] = useState<BibleText | undefined>(() => getLoadedVersion(version));
  const [loading, setLoading] = useState(!getLoadedVersion(version));

  useEffect(() => {
    const already = getLoadedVersion(version);
    if (already) {
      setText(already);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    loadVersion(version)
      .then((data) => {
        if (!active) return;
        setText(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setText(undefined);
        setLoading(false);
      });

    // Evita aplicar o resultado se a versão mudar antes de terminar.
    return () => {
      active = false;
    };
  }, [version]);

  return { text, loading };
}

/**
 * Carrega várias versões de uma vez — usado pelo comparador, que mostra
 * as versões do idioma lado a lado.
 */
export function useBibleTexts(versions: BibleVersion[]): {
  texts: Partial<Record<BibleVersion, BibleText>>;
  loading: boolean;
} {
  const key = versions.join(',');
  const [texts, setTexts] = useState<Partial<Record<BibleVersion, BibleText>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(versions.map((v) => loadVersion(v).then((data) => [v, data] as const)))
      .then((pairs) => {
        if (!active) return;
        setTexts(Object.fromEntries(pairs));
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // `key` representa a lista de versões (o array em si muda de identidade a cada render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { texts, loading };
}

/** Atalho: versículos de um capítulo da versão, com estado de carregamento. */
export function useChapter(
  version: BibleVersion,
  bookIndex: number,
  chapter: number,
): { verses: string[]; loading: boolean } {
  const { text, loading } = useBibleText(version);
  return { verses: chapterVerses(text, bookIndex, chapter), loading };
}
