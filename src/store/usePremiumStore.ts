import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Assinatura Premium.
 *
 * Fica fora do `useAuthStore` de propósito: o direito de acesso não depende de
 * login. Um visitante pode assinar, e no RevenueCat o "app user" existe mesmo
 * sem conta. Ficando junto do usuário, sair da conta apagaria a assinatura.
 *
 * Persistido para não sumir a cada abertura do app. A fonte da verdade continua
 * sendo a loja: `restore()` reconsulta e sobrescreve o que estiver aqui.
 */
export type PremiumSource =
  | 'none'
  | 'purchase' // compra real via RevenueCat/Play
  | 'dev'; // liberado manualmente em build de desenvolvimento

type PremiumState = {
  isPremium: boolean;
  source: PremiumSource;
  since: number | null;
  /** Marca (ou remove) o acesso Premium. */
  setPremium: (isPremium: boolean, source?: PremiumSource) => void;
};

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      isPremium: false,
      source: 'none',
      since: null,
      setPremium: (isPremium, source = 'purchase') =>
        set({
          isPremium,
          source: isPremium ? source : 'none',
          since: isPremium ? Date.now() : null,
        }),
    }),
    {
      name: 'premium',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Hook curto para as telas: `const isPremium = usePremium();` */
export function usePremium(): boolean {
  return usePremiumStore((s) => s.isPremium);
}
