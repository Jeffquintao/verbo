import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import {
  isTestPurchaseAvailable,
  PLANS,
  purchase,
  syncEntitlement,
  type Plan,
} from '@/services/subscriptions';
import { usePremiumStore } from '@/store/usePremiumStore';

export default function PremiumScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const [selected, setSelected] = useState<Plan['id']>('annual');
  const [loading, setLoading] = useState(false);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const since = usePremiumStore((s) => s.since);

  const BENEFITS = [
    t.premium.benefit1,
    t.premium.benefit2,
    t.premium.benefit3,
    t.premium.benefit4,
    t.premium.benefit5,
    t.premium.benefit6,
  ];

  // Nome e período de cada plano vêm das traduções; o preço vem do serviço.
  const PLAN_LABELS: Record<Plan['id'], { title: string; period: string }> = {
    monthly: { title: t.premium.monthly, period: t.premium.perMonth },
    annual: { title: t.premium.annual, period: t.premium.perYear },
    lifetime: { title: t.premium.lifetime, period: t.premium.oneTime },
  };

  async function handleSubscribe() {
    setLoading(true);
    try {
      await purchase(selected);
      Alert.alert(t.premium.purchaseDone);
      router.back();
    } catch (err) {
      const msg =
        err instanceof Error && err.message === 'subscriptions-unavailable'
          ? t.premium.unavailable
          : t.common.somethingWentWrong;
      Alert.alert(t.premium.title, msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => router.back()}
          className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-70">
          <Ionicons name="close" size={22} color={colors.foreground} />
        </Pressable>

        <View className="mb-6 items-center">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="diamond" size={32} color="#fff" />
          </View>
          <Text className="text-2xl font-bold text-foreground">{t.premium.title}</Text>
          <Text className="text-sm text-foreground/50">
            {isPremium ? t.premium.active : t.premium.subtitle}
          </Text>
          {isPremium && since && (
            <Text className="mt-1 text-xs text-foreground/40">
              {t.premium.activeSince(new Date(since).toLocaleDateString())}
            </Text>
          )}
        </View>

        {/* Benefícios */}
        <View className="mb-6 rounded-3xl bg-surface p-5">
          {BENEFITS.map((b) => (
            <View key={b} className="mb-2.5 flex-row items-center gap-3">
              <Ionicons name="checkmark-circle" size={20} color={BrandColors.primary} />
              <Text className="flex-1 text-foreground">{b}</Text>
            </View>
          ))}
        </View>

        {/* Planos — escondidos para quem já assina. */}
        {!isPremium &&
          PLANS.map((p) => {
          const active = selected === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setSelected(p.id)}
              className={`mb-3 flex-row items-center justify-between rounded-2xl border-2 p-4 ${
                active ? 'border-primary bg-primary/5' : 'border-transparent bg-surface'
              }`}>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">
                  {PLAN_LABELS[p.id].title}
                </Text>
                {p.id === 'annual' && (
                  <Text className="text-xs text-gold-dark">{t.premium.annualHighlight}</Text>
                )}
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-foreground">{p.price}</Text>
                <Text className="text-xs text-foreground/50">{PLAN_LABELS[p.id].period}</Text>
              </View>
              <View className="ml-3">
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={active ? BrandColors.primary : BrandColors.muted}
                />
              </View>
              </Pressable>
            );
          })}

        {!isPremium && (
          <Pressable
            onPress={handleSubscribe}
            disabled={loading}
            className="mt-3 items-center rounded-full bg-primary py-4 active:opacity-80">
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-bold text-white">{t.premium.subscribe}</Text>
            )}
          </Pressable>
        )}

        {/* Modo de teste: só existe em build de desenvolvimento. Fica explícito
            para nunca ser confundido com uma cobrança de verdade. */}
        {isTestPurchaseAvailable && (
          <View className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 p-4">
            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons name="construct" size={16} color={BrandColors.goldDark} />
              <Text className="font-bold text-gold-dark">{t.premium.testMode}</Text>
            </View>
            <Text className="text-xs leading-4 text-foreground/60">{t.premium.testModeBody}</Text>
            {isPremium && (
              <Pressable
                onPress={() => syncEntitlement(false)}
                className="mt-3 items-center rounded-full bg-surface py-3 active:opacity-70">
                <Text className="font-semibold text-foreground">{t.premium.testTurnOff}</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text className="mt-4 text-center text-xs text-foreground/40">
          {t.premium.disclaimer}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
