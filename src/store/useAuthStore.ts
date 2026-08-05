import { create } from 'zustand';

/**
 * Estado de autenticação.
 * Conecta ao Firebase Auth quando configurado; caso contrário, opera em
 * modo visitante (user = null).
 *
 * A assinatura NÃO fica aqui — vive em `usePremiumStore`, porque o direito de
 * acesso não depende de estar logado (um visitante pode assinar).
 */
export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthStatus = 'loading' | 'authenticated' | 'guest';

type AuthState = {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
}));
