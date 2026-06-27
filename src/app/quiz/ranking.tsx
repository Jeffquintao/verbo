import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { DIVISIONS, MY_RANK, RANKING, type RankPlayer } from '@/constants/ranking';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function RankingScreen() {
  const now = new Date();
  const monthName = MONTHS[now.getMonth()];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysToReset = lastDay - now.getDate() + 1;

  const top3 = RANKING.filter((p) => p.pos <= 3);
  const first = top3.find((p) => p.pos === 1)!;
  const second = top3.find((p) => p.pos === 2)!;
  const third = top3.find((p) => p.pos === 3)!;
  const rest = RANKING.filter((p) => p.pos >= 4);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={`Ranking — ${monthName}`}
        subtitle={`Zera em ${daysToReset} dia${daysToReset > 1 ? 's' : ''}`}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Divisões */}
        <View className="mb-6 flex-row gap-2">
          {DIVISIONS.map((d) => (
            <View
              key={d.name}
              className="flex-1 items-center rounded-2xl border bg-surface p-2"
              style={{ borderColor: d.color + '55' }}>
              <Ionicons name="trophy" size={18} color={d.color} />
              <Text className="mt-1 text-[11px] font-bold text-foreground">{d.name}</Text>
              <Text className="text-[9px] text-foreground/40">{d.range}</Text>
            </View>
          ))}
        </View>

        {/* Pódio */}
        <View className="mb-6 flex-row items-end justify-center gap-3 rounded-3xl bg-surface p-5">
          <PodiumSpot player={second} height="h-12" />
          <PodiumSpot player={first} height="h-16" crown />
          <PodiumSpot player={third} height="h-10" />
        </View>

        {/* Lista 4+ */}
        {rest.map((p) => (
          <View
            key={p.pos}
            className="mb-2 flex-row items-center justify-between rounded-2xl bg-surface p-3">
            <View className="flex-row items-center gap-3">
              <Text className="w-5 text-center font-bold text-foreground/40">{p.pos}</Text>
              <Avatar player={p} size={36} />
              <Text className="font-semibold text-foreground">{p.name}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              {p.streak && (
                <View className="flex-row items-center gap-0.5 rounded-full bg-gold/15 px-2 py-0.5">
                  <Text className="text-[11px]">🔥</Text>
                  <Text className="text-[11px] font-semibold text-gold-dark">{p.streak} dias</Text>
                </View>
              )}
              <Text className="font-bold text-foreground">{p.points.toLocaleString('pt-BR')} pts</Text>
            </View>
          </View>
        ))}

        {/* Sua posição */}
        <View className="mt-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <Text className="mb-2 text-xs text-foreground/50">Sua posição este mês</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl font-bold text-primary">#{MY_RANK.pos}</Text>
              <View>
                <Text className="font-bold text-foreground">Você 🏅</Text>
                <Text className="text-xs text-foreground/50">
                  {MY_RANK.division} · {MY_RANK.points.toLocaleString('pt-BR')} pts
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="arrow-up" size={14} color="#4ade80" />
              <Text className="text-xs font-semibold text-green-500">
                {MY_RANK.toTop10} pts pro Top 10
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/quiz/play' as never)}
          className="mt-5 items-center rounded-full bg-primary py-4 active:opacity-80">
          <Text className="text-base font-bold text-white">Jogar para subir</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Avatar({ player, size }: { player: RankPlayer; size: number }) {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: player.color }}>
      <Text className="font-bold text-white" style={{ fontSize: size * 0.36 }}>
        {player.initials}
      </Text>
    </View>
  );
}

function PodiumSpot({
  player,
  height,
  crown,
}: {
  player: RankPlayer;
  height: string;
  crown?: boolean;
}) {
  const blockColor = player.pos === 1 ? '#D4AF37' : player.pos === 2 ? '#9CA3AF' : '#B8941F';
  return (
    <View className="flex-1 items-center">
      {crown && <Text className="mb-0.5 text-lg">👑</Text>}
      <Avatar player={player} size={player.pos === 1 ? 56 : 46} />
      <Text className="mt-1 text-xs font-semibold text-foreground" numberOfLines={1}>
        {player.name}
      </Text>
      <Text className="mb-1 text-[11px] text-foreground/50">
        {player.points.toLocaleString('pt-BR')} pts
      </Text>
      <View
        className={`w-full items-center justify-center rounded-t-xl ${height}`}
        style={{ backgroundColor: blockColor }}>
        <Text className="text-lg font-bold text-white">{player.pos}</Text>
      </View>
    </View>
  );
}
