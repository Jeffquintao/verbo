import { useEffect, useState } from 'react';

import { loadBookOriginals, type BookOriginals } from '@/services/originals';

/**
 * Carrega o interlinear de um livro. Cada livro é um asset lido do disco, o
 * que leva alguns instantes — daí o `loading` para a tela não piscar vazia.
 */
export function useBookOriginals(abbrev: string | undefined): {
  data: BookOriginals | undefined;
  loading: boolean;
  error: boolean;
} {
  const [data, setData] = useState<BookOriginals>();
  const [loading, setLoading] = useState(Boolean(abbrev));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!abbrev) {
      setData(undefined);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    loadBookOriginals(abbrev)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [abbrev]);

  return { data, loading, error };
}
