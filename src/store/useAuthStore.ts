import { create } from 'zustand';

/**
 * Estado de autenticação e plano do usuário.
 * Conecta ao Firebase Auth quando configurado; caso contrário, opera em
 * modo visitante (user = null). Premium será resolvido por RevenueCat/Firestore.
 */
export type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
};

type AuthStatus = 'loading' | 'authenticated' | 'guest';

type AuthState = {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setPremium: (isPremium: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
  setPremium: (isPremium) =>
    set((s) => (s.user ? { user: { ...s.user, isPremium } } : s)),
}));
