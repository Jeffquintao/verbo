import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumBadge } from '@/components/premium-badge';
import { BrandColors } from '@/constants/colors';
import { formatRef, PLACE_REGIONS, PLACES, type Place } from '@/constants/places';

export default function PlacesScreen() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PLACES;
    return PLACES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Locais bíblicos</Text>
          <PremiumBadge />
        </View>

        {/* Busca */}
        <View className="mb-5 flex-row items-center gap-3 rounded-2xl bg-surface px-4">
          <Ionicons name="search" size={20} color={BrandColors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar local…"
            placeholderTextColor={BrandColors.muted}
            className="flex-1 py-3.5 text-base text-foreground"
          />
        </View>

        {PLACE_REGIONS.map((region) => {
          const items = filtered.filter((p) => p.region === region);
          if (items.length === 0) return null;
          return (
            <View key={region} className="mb-2">
              <Text className="mb-2 mt-3 text-xs font-bold uppercase tracking-wider text-foreground/40">
                {region}
              </Text>
              {items.map((p) => (
                <PlaceRow key={p.id} place={p} />
              ))}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View className="mt-16 items-center">
            <Ionicons name="location-outline" size={40} color={BrandColors.muted} />
            <Text className="mt-3 text-foreground/50">Nenhum local encontrado.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlaceRow({ place }: { place: Place }) {
  return (
    <Pressable
      onPress={() => router.push(`/places/${place.id}` as never)}
      className="mb-3 flex-row items-center gap-3 rounded-2xl bg-surface p-3 active:opacity-70">
      <View
        className="h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: place.color }}>
        <Ionicons name="location" size={22} color="#fff" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-foreground">{place.name}</Text>
        <Text className="text-xs text-foreground/50">
          {place.refs.slice(0, 2).map(formatRef).join(' · ')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={BrandColors.muted} />
    </Pressable>
  );
}
