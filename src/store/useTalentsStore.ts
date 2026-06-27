import { create } from 'zustand';

/**
 * Talentos — moeda interna do app (Parábola dos Talentos, Mateus 25).
 * Fonte: escopo seção 3.2. Por enquanto estado local; será sincronizado
 * com Firebase Firestore quando o backend estiver ligado.
 */
type TalentsState = {
  balance: number;
  earn: (amount: number, reason?: string) => void;
  spend: (amount: number) => boolean;
  reset: () => void;
};

export const useTalentsStore = create<TalentsState>((set, get) => ({
  balance: 0,
  earn: (amount) => set((s) => ({ balance: s.balance + amount })),
  spend: (amount) => {
    if (get().balance < amount) return false;
    set((s) => ({ balance: s.balance - amount }));
    return true;
  },
  reset: () => set({ balance: 0 }),
}));
