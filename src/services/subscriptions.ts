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
import { usePremiumStore } from '@/store/usePremiumStore';

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

/**
 * Compra simulada — só existe em build de desenvolvimento (`__DEV__`).
 *
 * Serve para testar o app assinado antes de o RevenueCat estar ligado. Num APK
 * de produção `__DEV__` é `false`, então esse caminho não existe: sem a loja
 * configurada o app diz que a assinatura ainda não está disponível em vez de
 * dar Premium de graça.
 */
export const isTestPurchaseAvailable = !isPurchasesConfigured && __DEV__;

/** Inicializa o SDK (no-op enquanto não configurado). */
export async function initPurchases(): Promise<void> {
  if (!isPurchasesConfigured) return;
  // TODO: Purchases.configure({ apiKey: REVENUECAT_KEY });
}

/** Compra um plano. */
export async function purchase(planId: Plan['id']): Promise<void> {
  if (isPurchasesConfigured) {
    // TODO: const { customerInfo } = await Purchases.purchasePackage(pkg);
    // syncEntitlement(customerInfo.entitlements.active['premium'] != null);
    void planId;
    return;
  }

  if (isTestPurchaseAvailable) {
    syncEntitlement(true, 'dev');
    return;
  }

  throw new Error('subscriptions-unavailable');
}

/** Restaura compras anteriores. */
export async function restore(): Promise<void> {
  if (!isPurchasesConfigured) return;
  // TODO: const info = await Purchases.restorePurchases();
  // syncEntitlement(info.entitlements.active['premium'] != null);
}

/** Atualiza o direito de acesso a partir do RevenueCat (ou do modo de teste). */
export function syncEntitlement(isPremium: boolean, source: 'purchase' | 'dev' = 'purchase'): void {
  usePremiumStore.getState().setPremium(isPremium, source);
}
