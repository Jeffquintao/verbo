import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { DIVISIONS } from '@/constants/ranking';

export default function QuizHomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Quiz Bíblico"
        subtitle="Ranking mensal · zera todo dia 1°"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Quiz de hoje */}
        <View className="mb-4 rounded-3xl bg-primary p-6">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/70">
            Quiz de hoje
          </Text>
          <Text className="mb-4 text-xl font-bold text-white">10 perguntas · 30s cada</Text>
          <Pressable
            onPress={() => router.push('/quiz/play' as never)}
            className="flex-row items-center justify-center gap-2 rounded-full bg-gold py-3 active:opacity-80">
            <Ionicons name="play" size={18} color={BrandColors.ink} />
            <Text className="font-bold text-ink">Jogar agora</Text>
          </Pressable>
        </View>

        {/* Ranking */}
        <Pressable
          onPress={() => router.push('/quiz/ranking' as never)}
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4 active:opacity-70">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gold/15">
              <Ionicons name="trophy" size={20} color={BrandColors.gold} />
            </View>
            <View>
              <Text className="font-semibold text-foreground">Ranking mensal</Text>
              <Text className="text-xs text-foreground/50">Veja sua posição e suba de divisão</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.muted} />
        </Pressable>

        {/* Sala privada */}
        <Pressable className="mb-8 flex-row items-center justify-between rounded-2xl bg-surface p-4 active:opacity-70">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="people" size={20} color={BrandColors.primary} />
            </View>
            <View>
              <Text className="font-semibold text-foreground">Sala privada</Text>
              <Text className="text-xs text-foreground/50">Jogue com amigos · Premium</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.muted} />
        </Pressable>

        {/* Divisões */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/40">
          Divisões do ranking
        </Text>
        {DIVISIONS.map((d) => (
          <View
            key={d.name}
            className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="trophy" size={20} color={d.color} />
              <Text className="font-medium text-foreground">{d.name}</Text>
            </View>
            <Text className="text-foreground/50">{d.range} pts</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
