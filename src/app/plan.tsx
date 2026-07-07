import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { getBook } from '@/services/bible';
import { getDayReadings, PLAN_DAYS, summarizeDay } from '@/services/readingPlan';
import { usePlanStore } from '@/store/usePlanStore';
import { useTalentsStore } from '@/store/useTalentsStore';

const DAYS = Array.from({ length: PLAN_DAYS }, (_, i) => i + 1);

export default function PlanScreen() {
  const completed = usePlanStore((s) => s.completed);
  const toggleDay = usePlanStore((s) => s.toggleDay);
  const order = usePlanStore((s) => s.order);
  const setOrder = usePlanStore((s) => s.setOrder);
  const earn = useTalentsStore((s) => s.earn);
  const { colors } = useTheme();

  const doneCount = Object.keys(completed).length;
  const pct = Math.round((doneCount / PLAN_DAYS) * 100);
  const currentDay = DAYS.find((d) => !completed[d]) ?? PLAN_DAYS;

  const handleToggle = useCallback(
    (day: number) => {
      const wasComplete = doneCount === PLAN_DAYS;
      toggleDay(day);
      // Recompensa ao concluir o plano inteiro (escopo 3.2: +500 Talentos).
      if (!wasComplete && !completed[day] && doneCount + 1 === PLAN_DAYS) {
        earn(500, 'Plano de leitura concluído');
      }
    },
    [doneCount, completed, toggleDay, earn],
  );

  function openDay(day: number) {
    const first = getDayReadings(day, order)[0];
    const abbrev = first ? getBook(first.bookIndex)?.abbrev : undefined;
    if (abbrev && first) router.push(`/bible/${abbrev}/${first.chapter}` as never);
  }

  const renderHeader = (
    <View>
      <View className="flex-row items-center gap-2 pb-3 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Plano de 365 dias</Text>
      </View>

      {/* Ordem do plano */}
      <View className="mb-4 flex-row gap-2 rounded-2xl bg-surface p-1.5">
        {(
          [
            { id: 'canonico', label: 'Canônico' },
            { id: 'cronologico', label: 'Cronológico' },
          ] as const
        ).map((o) => {
          const active = order === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => setOrder(o.id)}
              className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-primary' : ''}`}>
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-foreground/60'}`}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Progresso */}
      <View className="mb-4 rounded-3xl bg-primary p-6">
        <Text className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Seu progresso
        </Text>
        <Text className="my-1 text-4xl font-bold text-white">{pct}%</Text>
        <Text className="mb-3 text-sm text-white/70">
          {doneCount} de {PLAN_DAYS} dias concluídos
        </Text>
        <View className="h-2 overflow-hidden rounded-full bg-surface/20">
          <View className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
        </View>
      </View>

      {/* Hoje */}
      <Pressable
        onPress={() => openDay(currentDay)}
        className="mb-5 flex-row items-center justify-between rounded-2xl bg-gold p-4 active:opacity-80">
        <View className="flex-1">
          <Text className="text-xs font-semibold text-foreground/60">Leitura de hoje · Dia {currentDay}</Text>
          <Text className="font-bold text-foreground">{summarizeDay(currentDay, order)}</Text>
        </View>
        <Ionicons name="play-circle" size={28} color={BrandColors.ink} />
      </Pressable>

      <Text className="mb-2 text-lg font-bold text-foreground">Todos os dias</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <FlatList
        data={DAYS}
        keyExtractor={(d) => String(d)}
        ListHeaderComponent={renderHeader}
        extraData={order}
        contentContainerClassName="px-4 pb-10"
        initialNumToRender={20}
        windowSize={11}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: day }) => {
          const done = Boolean(completed[day]);
          return (
            <View className="mb-2 flex-row items-center rounded-2xl bg-surface p-3">
              <Pressable
                onPress={() => handleToggle(day)}
                className="mr-3 active:opacity-60"
                hitSlop={8}>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={26}
                  color={done ? BrandColors.primary : BrandColors.muted}
                />
              </Pressable>
              <Pressable className="flex-1 active:opacity-70" onPress={() => openDay(day)}>
                <Text className={`text-xs ${done ? 'text-foreground/40' : 'text-foreground/60'}`}>Dia {day}</Text>
                <Text
                  className={`font-medium ${done ? 'text-foreground/40 line-through' : 'text-foreground'}`}
                  numberOfLines={1}>
                  {summarizeDay(day)}
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
