import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { useTranslation } from '@/i18n';
import { usePremium } from '@/store/usePremiumStore';

/**
 * Envolve uma tela exclusiva de assinante. Sem Premium, mostra o convite no
 * lugar do conteúdo — com o mesmo header, para não parecer que o app quebrou.
 *
 * Isto é experiência do usuário, não segurança: o que precisa mesmo ser
 * protegido (a cota do Professor, por exemplo) é revalidado no servidor.
 */
export function PremiumGate({
  title,
  feature,
  children,
}: {
  title: string;
  /** Nome do recurso, para o texto do convite. */
  feature: string;
  children: React.ReactNode;
}) {
  const isPremium = usePremium();
  const t = useTranslation();

  if (isPremium) return <>{children}</>;

  return (
    <View className="flex-1 bg-ink">
      <ScreenHeader title={title} onBack={() => router.back()} />

      <ScrollView contentContainerClassName="flex-1 items-center justify-center p-8">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-3xl bg-gold/20">
          <Ionicons name="lock-closed" size={36} color={BrandColors.gold} />
        </View>

        <Text className="mb-2 text-center text-xl font-bold text-white">
          {t.premium.lockedTitle(feature)}
        </Text>
        <Text className="mb-7 text-center text-sm leading-5 text-white/50">
          {t.premium.lockedBody}
        </Text>

        <Pressable
          onPress={() => router.push('/premium' as never)}
          className="w-full flex-row items-center justify-center gap-2 rounded-full bg-gold py-4 active:opacity-80">
          <Ionicons name="diamond" size={18} color={BrandColors.ink} />
          <Text className="text-base font-bold text-ink">{t.premium.unlock}</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} className="mt-4 active:opacity-60">
          <Text className="text-sm text-white/40">{t.common.back}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
