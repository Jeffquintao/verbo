import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { PLANS, purchase, type Plan } from '@/services/subscriptions';

const BENEFITS = [
  'Todas as versões bíblicas (NVI, NAA, NVT, NIV, ESV…)',
  'Textos originais: grego e hebraico com Strong',
  'Bíblia em áudio com narração profissional',
  'Modo offline e comparador de versões',
  'Locais históricos e viagens de Paulo',
  'Quiz ilimitado e salas privadas',
];

export default function PremiumScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<Plan['id']>('annual');
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      await purchase(selected);
      Alert.alert('Pronto!', 'Assinatura ativada.');
      router.back();
    } catch (err) {
      Alert.alert('Assinaturas', err instanceof Error ? err.message : 'Falha na compra.');
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
          <Text className="text-2xl font-bold text-foreground">Verbo Premium</Text>
          <Text className="text-sm text-foreground/50">Desbloqueie tudo</Text>
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

        {/* Planos */}
        {PLANS.map((p) => {
          const active = selected === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setSelected(p.id)}
              className={`mb-3 flex-row items-center justify-between rounded-2xl border-2 p-4 ${
                active ? 'border-primary bg-primary/5' : 'border-transparent bg-surface'
              }`}>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">{p.title}</Text>
                {p.highlight && <Text className="text-xs text-gold-dark">{p.highlight}</Text>}
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-foreground">{p.price}</Text>
                <Text className="text-xs text-foreground/50">{p.period}</Text>
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

        <Pressable
          onPress={handleSubscribe}
          disabled={loading}
          className="mt-3 items-center rounded-full bg-primary py-4 active:opacity-80">
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-bold text-white">Assinar agora</Text>
          )}
        </Pressable>

        <Text className="mt-4 text-center text-xs text-foreground/40">
          Renovação automática. Cancele quando quiser na Play Store.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
