import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumBadge } from '@/components/premium-badge';
import { BrandColors } from '@/constants/colors';
import { formatRef, getPlace, type PlaceRef } from '@/constants/places';
import { useTheme } from '@/hooks/use-theme';

type Tab = 'hoje' | 'seculo' | 'mapa';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlace(id);
  const { colors } = useTheme();
  const [tab, setTab] = useState<Tab>('hoje');

  if (!place) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground/60">Local não encontrado.</Text>
      </SafeAreaView>
    );
  }

  function openMaps() {
    if (!place) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    Linking.openURL(url);
  }

  function openRef(ref: PlaceRef) {
    router.push(`/bible/${ref.abbrev}/${ref.chapter}` as never);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-bold text-foreground">Local histórico</Text>
        <PremiumBadge />
      </View>

      <ScrollView contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="mx-4 mb-4 overflow-hidden rounded-3xl" style={{ backgroundColor: place.color }}>
          <View className="h-40 items-center justify-center">
            <Ionicons name="business" size={44} color="rgba(255,255,255,0.5)" />
          </View>
          <View className="px-5 pb-4">
            <Text className="text-xl font-bold text-white">{place.name}</Text>
            <Text className="text-sm text-white/70">
              {place.city}, {place.country}
            </Text>
          </View>
        </View>

        {/* Abas */}
        <View className="mx-4 mb-4 flex-row gap-2">
          <TabButton label="Hoje" icon="camera" active={tab === 'hoje'} onPress={() => setTab('hoje')} />
          <TabButton
            label="Séc. I d.C."
            icon="business"
            active={tab === 'seculo'}
            onPress={() => setTab('seculo')}
          />
          <TabButton label="No mapa" icon="map" active={tab === 'mapa'} onPress={() => setTab('mapa')} />
        </View>

        <View className="px-5">
          {/* Sobre o local */}
          <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
            Sobre o local
          </Text>
          <Text className="mb-5 text-base leading-6 text-foreground/80">{place.about}</Text>

          {/* Conteúdo da aba */}
          {tab === 'hoje' && (
            <>
              <Text className="mb-4 text-base leading-6 text-foreground/80">{place.today}</Text>
              <View className="mb-5 flex-row flex-wrap gap-3">
                <InfoCard label="Localização" value={`${place.city}, ${place.country}`} />
                {place.builtYear && <InfoCard label="Construída em" value={place.builtYear} />}
                <InfoCard label="Coordenadas" value={`${place.lat.toFixed(4)}° N`} />
                {place.denomination && <InfoCard label="Denominação" value={place.denomination} />}
              </View>
            </>
          )}

          {tab === 'seculo' && (
            <Text className="mb-5 text-base leading-6 text-foreground/80">{place.centuryI}</Text>
          )}

          {tab === 'mapa' && (
            <View className="mb-5">
              <View className="mb-3 items-center justify-center rounded-2xl bg-surface py-10">
                <Ionicons name="location" size={40} color={BrandColors.primary} />
                <Text className="mt-2 font-semibold text-foreground">
                  {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                </Text>
                <Text className="text-xs text-foreground/50">
                  {place.city}, {place.country}
                </Text>
              </View>
              <Pressable
                onPress={openMaps}
                className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5 active:opacity-80">
                <Ionicons name="navigate" size={18} color="#fff" />
                <Text className="font-bold text-white">Abrir no Google Maps</Text>
              </Pressable>
            </View>
          )}

          {/* Curiosidade arqueológica */}
          <View className="mb-5 rounded-2xl bg-gold/10 p-4">
            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons name="sparkles" size={16} color={BrandColors.goldDark} />
              <Text className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                Curiosidade arqueológica
              </Text>
            </View>
            <Text className="text-sm leading-6 text-foreground/80">{place.curiosity}</Text>
          </View>

          {/* Mencionado em */}
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground/40">
            Mencionado em
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {place.refs.map((ref, i) => (
              <Pressable
                key={i}
                onPress={() => openRef(ref)}
                className="rounded-lg bg-primary/10 px-3 py-2 active:opacity-70">
                <Text className="text-sm font-semibold text-primary">{formatRef(ref)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-2.5 ${
        active ? 'bg-gold' : 'bg-surface'
      }`}>
      <Ionicons name={icon} size={15} color={active ? BrandColors.ink : BrandColors.muted} />
      <Text className={`text-xs font-semibold ${active ? 'text-foreground' : 'text-foreground/50'}`}>{label}</Text>
    </Pressable>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="w-[47%] rounded-2xl bg-surface p-3">
      <Text className="text-xs text-foreground/50">{label}</Text>
      <Text className="mt-0.5 font-semibold text-foreground">{value}</Text>
    </View>
  );
}
