import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { useTranslation } from '@/i18n';
import { BrandColors } from '@/constants/colors';
import { DIVISIONS } from '@/constants/ranking';

export default function QuizHomeScreen() {
  const t = useTranslation();
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={t.quiz.title}
        subtitle={t.quiz.subtitle}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Quiz de hoje */}
        <View className="mb-4 rounded-3xl bg-primary p-6">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/70">
            {t.quiz.todayQuiz}
          </Text>
          <Text className="mb-4 text-xl font-bold text-white">{t.quiz.todayQuizSub}</Text>
          <Pressable
            onPress={() => router.push('/quiz/play' as never)}
            className="flex-row items-center justify-center gap-2 rounded-full bg-gold py-3 active:opacity-80">
            <Ionicons name="play" size={18} color={BrandColors.ink} />
            <Text className="font-bold text-ink">{t.quiz.playNow}</Text>
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
              <Text className="font-semibold text-foreground">{t.quiz.ranking}</Text>
              <Text className="text-xs text-foreground/50">{t.quiz.rankingSub}</Text>
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
              <Text className="font-semibold text-foreground">{t.quiz.privateRoom}</Text>
              <Text className="text-xs text-foreground/50">{t.quiz.privateRoomSub}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.muted} />
        </Pressable>

        {/* Divisões */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/40">
          {t.quiz.divisions}
        </Text>
        {DIVISIONS.map((d) => (
          <View
            key={d.key}
            className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="trophy" size={20} color={d.color} />
              <Text className="font-medium text-foreground">{t.quiz[d.key]}</Text>
            </View>
            <Text className="text-foreground/50">{d.range} {t.quiz.points}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
