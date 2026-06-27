import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { useTalentsStore } from '@/store/useTalentsStore';

const REWARDS = [
  { km: 1, icon: 'diamond' as const, title: '+50 Talentos', value: '+50' },
  { km: 5, icon: 'star' as const, title: '1 dia Premium grátis', value: 'A cada 5 km' },
  { km: 10, icon: 'book' as const, title: 'Devocional exclusivo', value: '800' },
];

const TALENTS_PER_KM = 50;

function haversineKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function RunScreen() {
  const earn = useTalentsStore((s) => s.earn);
  const talents = useTalentsStore((s) => s.balance);
  const [tracking, setTracking] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const subRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCoord = useRef<{ latitude: number; longitude: number } | null>(null);
  const awardedKm = useRef(0);

  useEffect(() => {
    return () => {
      subRef.current?.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function startRun() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à localização para registrar sua corrida.');
      return;
    }
    setDistanceKm(0);
    setElapsed(0);
    lastCoord.current = null;
    awardedKm.current = 0;
    setTracking(true);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    subRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 2000 },
      (loc) => {
        const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        if (lastCoord.current) {
          const step = haversineKm(lastCoord.current, coord);
          if (step < 0.5) {
            setDistanceKm((prev) => {
              const next = prev + step;
              const kmDone = Math.floor(next);
              if (kmDone > awardedKm.current) {
                const delta = kmDone - awardedKm.current;
                awardedKm.current = kmDone;
                earn(TALENTS_PER_KM * delta, 'Corrida da Fé');
              }
              return next;
            });
          }
        }
        lastCoord.current = coord;
      },
    );
  }

  function stopRun() {
    subRef.current?.remove();
    subRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTracking(false);
  }

  const pace = distanceKm > 0.01 ? elapsed / 60 / distanceKm : 0;
  const kmDone = Math.floor(distanceKm);
  const milestones = [1, 2, 3, 4, 5];

  return (
    <View className="flex-1 bg-ink">
      <ScreenHeader
        title="Corrida da Fé"
        subtitle="Ganhe Talentos por km"
        right={
          <View className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <Ionicons name="diamond" size={14} color={BrandColors.gold} />
            <Text className="font-bold text-gold-light">{talents}</Text>
          </View>
        }
      />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Painel de sessão (verde) */}
        <View className="mb-6 rounded-3xl border border-green-800 bg-green-950 p-5">
          <View className="mb-4 flex-row justify-around">
            <Stat value={distanceKm.toFixed(1)} label="km hoje" />
            <Stat value={formatTime(elapsed)} label="tempo" />
            <Stat value={pace > 0 ? pace.toFixed(2).replace('.', ':') : '0:00'} label="ritmo/km" />
          </View>

          <Text className="mb-2 text-xs text-white/50">Progresso da sessão</Text>
          <View className="mb-4 flex-row gap-2">
            {milestones.map((m) => {
              const done = m <= kmDone;
              const current = m === kmDone + 1 && tracking;
              return (
                <View
                  key={m}
                  className={`h-9 w-9 items-center justify-center rounded-full border-2 ${
                    done
                      ? 'border-green-400 bg-green-500'
                      : current
                        ? 'border-green-400 bg-green-900'
                        : 'border-white/15 bg-transparent'
                  }`}>
                  <Text className={`text-xs font-bold ${done || current ? 'text-white' : 'text-white/40'}`}>
                    {m}
                  </Text>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={tracking ? stopRun : startRun}
            className={`flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-80 ${
              tracking ? 'bg-green-600' : 'bg-green-500'
            }`}>
            <Ionicons name={tracking ? 'pause' : 'play'} size={20} color="#052e16" />
            <Text className="text-base font-bold text-green-950">
              {tracking ? 'Pausar corrida' : 'Iniciar corrida'}
            </Text>
          </Pressable>
        </View>

        {/* Recompensas */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
          Recompensas por km
        </Text>
        {REWARDS.map((r) => {
          const unlocked = distanceKm >= r.km;
          return (
            <View
              key={r.km}
              className="mb-3 flex-row items-center justify-between rounded-2xl bg-white/5 p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Ionicons name={r.icon} size={18} color={BrandColors.gold} />
                </View>
                <View>
                  <Text className="font-semibold text-white">{r.title}</Text>
                  <Text className="text-xs text-white/40">A cada {r.km} km</Text>
                </View>
              </View>
              {unlocked ? (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                  <Text className="text-xs font-semibold text-green-400">Desbloqueado</Text>
                </View>
              ) : (
                <Text className="font-bold text-gold-light">{r.value}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-3xl font-bold text-green-400">{value}</Text>
      <Text className="text-xs text-white/50">{label}</Text>
    </View>
  );
}
