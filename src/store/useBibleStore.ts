import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BibleVersion } from '@/services/bible';

export type ReadingPosition = { bookIndex: number; chapter: number };

type BibleState = {
  version: BibleVersion;
  lastRead: ReadingPosition | null;
  setVersion: (version: BibleVersion) => void;
  setLastRead: (pos: ReadingPosition) => void;
};

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      version: 'ACF',
      lastRead: null,
      setVersion: (version) => set({ version }),
      setLastRead: (lastRead) => set({ lastRead }),
    }),
    {
      name: 'bible-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Migra estado antigo: versões removidas (ex.: 'KJV') voltam para 'ACF'.
      migrate: (persisted) => {
        const state = persisted as Partial<BibleState> | undefined;
        if (state && state.version !== 'ACF' && state.version !== 'NVI') {
          state.version = 'ACF';
        }
        return state as BibleState;
      },
    },
  ),
);
