import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import {
  mediaForLocale,
  playlistsForTab,
  videoThumb,
  type MediaTab,
  type Playlist,
} from '@/constants/media';
import { useTranslation } from '@/i18n';
import { useLocaleStore } from '@/store/useLocaleStore';

export default function MidiaScreen() {
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [tab, setTab] = useState<MediaTab>('videos');

  // Canais curados no idioma do usuário.
  const media = mediaForLocale(locale);
  const featured = media.featured[tab];
  const items = media.items[tab];
  const playlists = playlistsForTab(locale, tab);
  const TABS: { id: MediaTab; label: string }[] = [
    { id: 'videos', label: t.media.videos },
    { id: 'podcasts', label: t.media.podcasts },
    { id: 'louvores', label: t.media.worship },
  ];

  function open(url: string) {
    Linking.openURL(url);
  }

  return (
    <View className="flex-1 bg-ink">
      <ScreenHeader title={t.media.title} />

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Abas */}
        <View className="mb-6 flex-row gap-2">
          {TABS.map((tb) => (
            <Pressable
              key={tb.id}
              onPress={() => setTab(tb.id)}
              className={`rounded-full px-4 py-2 ${tab === tb.id ? 'bg-primary' : 'bg-white/10'}`}>
              <Text className={`font-semibold ${tab === tb.id ? 'text-white' : 'text-white/60'}`}>
                {tb.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Em destaque */}
        <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
          {t.media.featured}
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

        {/* Playlists curadas */}
        {playlists.length > 0 && (
          <>
            <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
              {t.media.playlists}
            </Text>
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} count={t.media.tracks(pl.tracks.length)} />
            ))}
          </>
        )}

        {/* Grade */}
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
          {tab === 'louvores' ? t.media.popularWorship : tab === 'podcasts' ? t.media.episodes : t.media.recommended}
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
            <Text className="text-lg font-bold text-white">{t.common.premium}</Text>
          </View>
          <Text className="mb-4 text-sm text-white/70">
            {t.media.premiumPitch}
          </Text>
          <Pressable
            onPress={() => router.push('/premium' as never)}
            className="items-center rounded-full bg-gold py-3.5 active:opacity-80">
            <Text className="font-bold text-ink">{t.media.seePlans}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/** Cartão de playlist: mosaico das 4 primeiras capas + título. */
function PlaylistCard({ playlist, count }: { playlist: Playlist; count: string }) {
  return (
    <Pressable
      onPress={() => router.push(`/media/${playlist.id}` as never)}
      className="mb-4 flex-row items-center gap-3 overflow-hidden rounded-2xl bg-white/5 p-3 active:opacity-80">
      <View
        className="h-16 w-16 flex-row flex-wrap overflow-hidden rounded-xl"
        style={{ backgroundColor: playlist.color }}>
        {playlist.tracks.slice(0, 4).map((track) => (
          <Image
            key={track.videoId}
            source={{ uri: videoThumb(track.videoId) }}
            style={{ width: '50%', height: '50%' }}
            resizeMode="cover"
          />
        ))}
      </View>

      <View className="flex-1">
        <Text className="font-bold text-white" numberOfLines={1}>
          {playlist.title}
        </Text>
        <Text className="text-xs text-white/45" numberOfLines={1}>
          {playlist.subtitle}
        </Text>
        <Text className="mt-0.5 text-xs text-white/30">{count}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
    </Pressable>
  );
}
