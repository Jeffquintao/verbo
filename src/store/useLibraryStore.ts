import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * "Minha biblioteca" — highlights e notas pessoais, persistidos localmente.
 * Chave do versículo é independente de versão: `${bookIndex}:${chapter}:${verse}`.
 * Será sincronizado com Firestore quando o backend estiver ligado.
 */
export type Note = {
  id: string;
  bookIndex: number;
  chapter: number;
  verse: number;
  text: string;
  createdAt: number;
};

export function verseKey(bookIndex: number, chapter: number, verse: number): string {
  return `${bookIndex}:${chapter}:${verse}`;
}

export const HIGHLIGHT_COLORS = [
  { id: 'yellow', hex: '#FACC15' },
  { id: 'green', hex: '#34D399' },
  { id: 'blue', hex: '#60A5FA' },
  { id: 'pink', hex: '#F472B6' },
  { id: 'gold', hex: '#D4AF37' },
] as const;

type LibraryState = {
  highlights: Record<string, string>; // verseKey -> hex
  notes: Note[];
  toggleHighlight: (key: string, hex: string) => void;
  clearHighlight: (key: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  removeNote: (id: string) => void;
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      highlights: {},
      notes: [],
      toggleHighlight: (key, hex) =>
        set((s) => {
          const next = { ...s.highlights };
          if (next[key] === hex) delete next[key];
          else next[key] = hex;
          return { highlights: next };
        }),
      clearHighlight: (key) =>
        set((s) => {
          const next = { ...s.highlights };
          delete next[key];
          return { highlights: next };
        }),
      addNote: (note) =>
        set((s) => ({
          notes: [
            { ...note, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() },
            ...s.notes,
          ],
        })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    {
      name: 'library-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
