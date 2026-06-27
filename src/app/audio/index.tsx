import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumBadge } from '@/components/premium-badge';
import { BrandColors } from '@/constants/colors';
import { BOOKS } from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';

type Testament = 'AT' | 'NT';

export default function AudioLibraryScreen() {
  const version = useBibleStore((s) => s.version);
  const [testament, setTestament] = useState<Testament>('NT');

  const books = BOOKS.map((b, i) => ({ b, i })).filter(({ b }) => b.testament === testament);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header premium */}
      <View className="bg-ink px-4 pb-3 pt-1">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text className="text-base font-bold text-white">Bíblia em Áudio</Text>
          <PremiumBadge />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="mb-4 text-sm text-foreground/50">
          Narração por voz do dispositivo · versão {version}
        </Text>

        {/* Testamento */}
        <View className="mb-5 flex-row gap-2">
          {(['AT', 'NT'] as Testament[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTestament(t)}
              className={`flex-1 items-center rounded-full py-2.5 ${
                testament === t ? 'bg-primary' : 'bg-surface'
              }`}>
              <Text className={testament === t ? 'font-semibold text-white' : 'font-medium text-foreground'}>
                {t === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
              </Text>
            </Pressable>
          ))}
        </View>

        {books.map(({ b }) => (
          <Pressable
            key={b.abbrev}
            onPress={() => router.push(`/audio/${b.abbrev}/1` as never)}
            className="mb-3 flex-row items-center gap-3 rounded-2xl bg-surface p-3 active:opacity-70">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Ionicons name="headset" size={22} color={BrandColors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{b.name}</Text>
              <Text className="text-xs text-foreground/50">{b.chapters} capítulos</Text>
            </View>
            <Ionicons name="play-circle" size={28} color={BrandColors.primary} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
