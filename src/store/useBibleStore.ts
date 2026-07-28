import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BibleVersion } from '@/services/bible';

export type ReadingPosition = { bookIndex: number; chapter: number };

const VALID_VERSIONS: BibleVersion[] = ['ACF', 'NVI', 'KJV', 'ASV', 'RVR'];

type BibleState = {
  version: BibleVersion;
  lastRead: ReadingPosition | null;
  setVersion: (version: BibleVersion) => void;
  setLastRead: (pos: ReadingPosition) => void;
};

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      // O padrão real vem do idioma (ver useLocaleSync); 'KJV' é o fallback
      // porque o inglês é o idioma principal do app.
      version: 'KJV',
      lastRead: null,
      setVersion: (version) => set({ version }),
      setLastRead: (lastRead) => set({ lastRead }),
    }),
    {
      name: 'bible-store',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // Estado salvo com uma versão que não existe mais volta para o padrão.
      // O useLocaleSync depois ajusta para a versão do idioma escolhido.
      migrate: (persisted) => {
        const state = persisted as Partial<BibleState> | undefined;
        if (state && !VALID_VERSIONS.includes(state.version as BibleVersion)) {
          state.version = 'KJV';
        }
        return state as BibleState;
      },
    },
  ),
);
