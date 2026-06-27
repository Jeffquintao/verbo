import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { FEATURED, MEDIA, type MediaTab } from '@/constants/media';

const TABS: { id: MediaTab; label: string }[] = [
  { id: 'videos', label: 'Vídeos' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'louvores', label: 'Louvores' },
];

export default function MidiaScreen() {
  const [tab, setTab] = useState<MediaTab>('videos');
  const featured = FEATURED[tab];
  const items = MEDIA[tab];

  function open(url: string) {
    Linking.openURL(url);
  }

  return (
    <View className="flex-1 bg-ink">
      <ScreenHeader title="Mídia" />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Abas */}
        <View className="mb-6 flex-row gap-2">
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 ${tab === t.id ? 'bg-primary' : 'bg-white/10'}`}>
              <Text className={`font-semibold ${tab === t.id ? 'text-white' : 'text-white/60'}`}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Em destaque */}
        <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
          Em destaque
        </Text>
        <Pressable
          onPress={() => open(featured.url)}
          className="mb-6 overflow-hidden rounded-3xl active:opacity-80">
          <View className="h-40 items-center justify-center" style={{ backgroundColor: featured.color }}>
            <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="play" size={26} color="#fff" />
            </View>
          </View>
          <View className="bg-white/5 p-4">
            <Text className="font-bold text-white">{featured.title}</Text>
            <Text className="text-sm text-white/50">
              {featured.author} · {featured.meta}
            </Text>
          </View>
        </Pressable>

        {/* Grade */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
          {tab === 'louvores' ? 'Louvores populares' : tab === 'podcasts' ? 'Episódios' : 'Recomendados'}
        </Text>
        <View className="mb-6 flex-row flex-wrap justify-between">
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => open(item.url)}
              className="mb-4 w-[48%] active:opacity-80">
              <View
                className="mb-2 h-28 items-center justify-center rounded-2xl"
                style={{ backgroundColor: item.color }}>
                <Ionicons name="play-circle" size={32} color="rgba(255,255,255,0.85)" />
              </View>
              <Text className="font-semibold text-white" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-xs text-white/50">{item.author}</Text>
            </Pressable>
          ))}
        </View>

        {/* Premium */}
        <View className="rounded-3xl bg-primary p-5">
          <View className="mb-1 flex-row items-center gap-2">
            <Ionicons name="diamond" size={18} color="#EAC84F" />
            <Text className="text-lg font-bold text-white">Premium</Text>
          </View>
          <Text className="mb-4 text-sm text-white/70">
            Acesse todos os estudos, versões e sem anúncios.
          </Text>
          <Pressable
            onPress={() => router.push('/premium' as never)}
            className="items-center rounded-full bg-gold py-3.5 active:opacity-80">
            <Text className="font-bold text-ink">Ver planos — a partir de $2,99</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
