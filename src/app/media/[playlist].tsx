import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import {
  getPlaylist,
  videoThumb,
  videoUrl,
  type PlaylistTrack,
} from '@/constants/media';
import { useTranslation } from '@/i18n';
import { useLocaleStore } from '@/store/useLocaleStore';

export default function PlaylistScreen() {
  const { playlist: playlistId } = useLocalSearchParams<{ playlist: string }>();
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);

  const playlist = getPlaylist(locale, String(playlistId));

  if (!playlist) {
    return (
      <View className="flex-1 bg-ink">
        <ScreenHeader title={t.media.playlist} onBack={() => router.back()} />
        <Text className="p-5 text-white/60">{t.media.playlistNotFound}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-ink">
      <ScreenHeader
        title={playlist.title}
        subtitle={t.media.tracks(playlist.tracks.length)}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        {/* Capa: mosaico das 4 primeiras faixas */}
        <View className="h-44 flex-row flex-wrap" style={{ backgroundColor: playlist.color }}>
          {playlist.tracks.slice(0, 4).map((track) => (
            <Image
              key={track.videoId}
              source={{ uri: videoThumb(track.videoId) }}
              style={{ width: '50%', height: '50%' }}
              resizeMode="cover"
            />
          ))}
        </View>

        <View className="px-5 pb-2 pt-4">
          <Text className="text-sm text-white/55">{playlist.subtitle}</Text>
          <Text className="mt-1 text-xs text-white/35">{t.media.opensInYouTube}</Text>
        </View>

        <View className="px-5 pt-2">
          {playlist.tracks.map((track, i) => (
            <TrackRow key={track.videoId} track={track} index={i + 1} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TrackRow({ track, index }: { track: PlaylistTrack; index: number }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(videoUrl(track.videoId))}
      className="mb-3 flex-row items-center gap-3 active:opacity-70">
      <Text className="w-5 text-right text-xs font-semibold text-white/35">{index}</Text>

      <View className="overflow-hidden rounded-xl bg-white/10">
        <Image
          source={{ uri: videoThumb(track.videoId) }}
          style={{ width: 96, height: 54 }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-white" numberOfLines={2}>
          {track.title}
        </Text>
        <Text className="text-xs text-white/45" numberOfLines={1}>
          {track.author} · {track.duration}
        </Text>
      </View>

      <Ionicons name="play-circle" size={26} color="rgba(255,255,255,0.5)" />
    </Pressable>
  );
}
