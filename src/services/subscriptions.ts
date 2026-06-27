/**
 * Assinaturas (RevenueCat) — camada plugável.
 *
 * PLACEHOLDER: o SDK nativo `react-native-purchases` NÃO roda no Expo Go.
 * Por isso aqui há só a interface + dados dos planos. Para ativar de verdade:
 *
 *   1. npx expo install react-native-purchases
 *   2. Adicionar o config plugin em app.json:  "plugins": ["react-native-purchases"]
 *   3. Criar conta no RevenueCat, configurar produtos no Google Play Console
 *   4. Preencher EXPO_PUBLIC_REVENUECAT_ANDROID_KEY no .env
 *   5. Trocar os corpos de initPurchases/purchase/restore pelas chamadas do SDK
 *   6. Buildar com EAS (não funciona no Expo Go — precisa de dev build)
 *
 * Ver escopo seções 3.1 (planos) e 4.1 (stack).
 */
import { useAuthStore } from '@/store/useAuthStore';

export type Plan = {
  id: 'monthly' | 'annual' | 'lifetime';
  title: string;
  price: string;
  period: string;
  highlight?: string;
};

export const PLANS: Plan[] = [
  { id: 'monthly', title: 'Mensal', price: '$2,99', period: '/mês' },
  {
    id: 'annual',
    title: 'Anual',
    price: '$17,99',
    period: '/ano',
    highlight: 'Equivale a $1,49/mês · mais popular',
  },
  { id: 'lifetime', title: 'Vitalício', price: '$34,99', period: 'pagamento único' },
];

export const REVENUECAT_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
export const isPurchasesConfigured = Boolean(REVENUECAT_KEY);

/** Inicializa o SDK (no-op enquanto não configurado). */
export async function initPurchases(): Promise<void> {
  if (!isPurchasesConfigured) return;
  // TODO: Purchases.configure({ apiKey: REVENUECAT_KEY });
}

/** Compra um plano. Lança erro enquanto o SDK não está plugado. */
export async function purchase(planId: Plan['id']): Promise<void> {
  if (!isPurchasesConfigured) {
    throw new Error(
      'Assinaturas ainda não configuradas. Pluge o RevenueCat (ver src/services/subscriptions.ts).',
    );
  }
  // TODO: const { customerInfo } = await Purchases.purchasePackage(pkg);
  // syncEntitlement(customerInfo);
  void planId;
}

/** Restaura compras anteriores. */
export async function restore(): Promise<void> {
  if (!isPurchasesConfigured) return;
  // TODO: const info = await Purchases.restorePurchases(); syncEntitlement(info);
}

/** Atualiza o status Premium na store de auth a partir do RevenueCat. */
export function syncEntitlement(isPremium: boolean): void {
  useAuthStore.getState().setPremium(isPremium);
}
