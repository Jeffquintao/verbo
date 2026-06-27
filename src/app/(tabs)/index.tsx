import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { getVerseOfTheDay } from '@/constants/verses';
import { PLAN_DAYS } from '@/services/readingPlan';
import { useAuthStore } from '@/store/useAuthStore';
import { usePlanStore } from '@/store/usePlanStore';
import { useTalentsStore } from '@/store/useTalentsStore';

type Module = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
  color: string;
};

const MODULES: Module[] = [
  { label: 'Bíblia', icon: 'book', href: '/bible', color: '#6D28D9' },
  { label: 'Estudos', icon: 'language', href: '/originals', color: '#2563EB' },
  { label: 'Corrida', icon: 'walk', href: '/run', color: '#059669' },
  { label: 'Quiz', icon: 'help-circle', href: '/quiz', color: '#D4AF37' },
  { label: 'Vídeos', icon: 'play-circle', href: '/midia', color: '#DC2626' },
  { label: 'Louvores', icon: 'musical-notes', href: '/midia', color: '#DB2777' },
];

export default function HomeScreen() {
  const verse = getVerseOfTheDay();
  const user = useAuthStore((s) => s.user);
  const talents = useTalentsStore((s) => s.balance);
  const completed = usePlanStore((s) => s.completed);

  const doneCount = Object.keys(completed).length;
  const currentDay = doneCount + 1;
  const pct = Math.round((doneCount / PLAN_DAYS) * 100);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={`Olá, ${user?.name ?? 'Visitante'} 👋`}
        subtitle={`Leitura em dia • Dia ${currentDay}`}
        right={
          <Pressable
            onPress={() => router.push('/profile' as never)}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:opacity-70">
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </Pressable>
        }
      />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Versículo do dia */}
        <View className="mb-4 rounded-3xl bg-ink p-6">
          <View className="mb-2 flex-row items-center gap-1.5">
            <Ionicons name="sparkles" size={14} color="#EAC84F" />
            <Text className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Versículo do dia
            </Text>
          </View>
          <Text className="mb-3 text-lg leading-7 text-white">“{verse.text}”</Text>
          <Text className="text-sm font-semibold text-primary-light">{verse.ref}</Text>
        </View>

        {/* Talentos */}
        <Pressable
          onPress={() => router.push('/profile' as never)}
          className="mb-6 flex-row items-center justify-between rounded-2xl bg-ink p-4 active:opacity-80">
          <View className="flex-row items-center gap-3">
            <Ionicons name="diamond" size={22} color={BrandColors.gold} />
            <Text className="font-semibold text-white">Talentos</Text>
          </View>
          <Text className="text-2xl font-bold text-gold-light">{talents}</Text>
        </Pressable>

        {/* Módulos */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/40">
          Módulos
        </Text>
        <View className="mb-6 flex-row flex-wrap justify-between">
          {MODULES.map((m) => (
            <Pressable
              key={m.label}
              onPress={() => router.push(m.href as never)}
              className="mb-3 w-[31%] items-center rounded-2xl bg-surface py-5 active:opacity-70">
              <View
                className="mb-2 h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: m.color + '22' }}>
                <Ionicons name={m.icon} size={24} color={m.color} />
              </View>
              <Text className="text-sm font-medium text-foreground">{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Plano de leitura */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/40">
          Plano de leitura
        </Text>
        <Pressable
          onPress={() => router.push('/plan' as never)}
          className="rounded-2xl bg-surface p-4 active:opacity-70">
          <Text className="mb-3 font-semibold text-foreground">Gênesis ao Apocalipse • 365 dias</Text>
          <View className="mb-2 h-2 overflow-hidden rounded-full bg-foreground/10">
            <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </View>
          <Text className="text-xs text-foreground/50">{doneCount} de {PLAN_DAYS} dias completos</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
