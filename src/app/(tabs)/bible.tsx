import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumBadge } from '@/components/premium-badge';
import { BrandColors } from '@/constants/colors';
import { BIBLE_VERSIONS, BOOKS, bookName, getBook } from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';

export default function BibleScreen() {
  const version = useBibleStore((s) => s.version);
  const setVersion = useBibleStore((s) => s.setVersion);
  const lastRead = useBibleStore((s) => s.lastRead);

  const ot = BOOKS.map((b, i) => ({ b, i })).filter(({ b }) => b.testament === 'AT');
  const nt = BOOKS.map((b, i) => ({ b, i })).filter(({ b }) => b.testament === 'NT');
  const lastBook = lastRead ? getBook(lastRead.bookIndex) : undefined;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="mb-1 text-2xl font-bold text-foreground">Bíblia</Text>
        <Text className="mb-5 text-sm text-foreground/50">Leitura, busca, marcações e notas</Text>

        {/* Versão */}
        <View className="mb-5 flex-row gap-2">
          {BIBLE_VERSIONS.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => setVersion(v.id)}
              className={`rounded-full px-4 py-2 ${version === v.id ? 'bg-primary' : 'bg-surface'}`}>
              <Text className={version === v.id ? 'font-semibold text-white' : 'font-medium text-foreground'}>
                {v.label}
              </Text>
            </Pressable>
          ))}
          <View className="justify-center rounded-full bg-gold/15 px-4 py-2">
            <Text className="font-medium text-gold-dark">+ versões (Premium)</Text>
          </View>
        </View>

        {/* Busca */}
        <Pressable
          onPress={() => router.push('/bible/search' as never)}
          className="mb-5 flex-row items-center gap-3 rounded-2xl bg-surface p-4 active:opacity-70">
          <Ionicons name="search" size={20} color={BrandColors.muted} />
          <Text className="text-foreground/40">Buscar versículo ou palavra…</Text>
        </Pressable>

        {/* Recursos Premium */}
        <PremiumFeature
          icon="language"
          title="Textos originais"
          subtitle="Grego e hebraico com dicionário Strong"
          onPress={() => router.push('/originals' as never)}
        />
        <PremiumFeature
          icon="headset"
          title="Bíblia em áudio"
          subtitle="Ouça os capítulos com narração"
          onPress={() => router.push('/audio' as never)}
        />
        <PremiumFeature
          icon="location"
          title="Locais históricos"
          subtitle="Fotos, mapas e contexto dos lugares bíblicos"
          onPress={() => router.push('/places' as never)}
        />
        <View className="mb-5" />

        {/* Continuar lendo */}
        {lastBook && lastRead && (
          <Pressable
            onPress={() => router.push(`/bible/${lastBook.abbrev}/${lastRead.chapter}` as never)}
            className="mb-6 flex-row items-center justify-between rounded-2xl bg-primary p-4 active:opacity-80">
            <View className="flex-row items-center gap-3">
              <Ionicons name="play-circle" size={28} color="#fff" />
              <View>
                <Text className="text-xs text-white/70">Continuar lendo</Text>
                <Text className="font-semibold text-white">
                  {bookName(lastBook, version)} {lastRead.chapter}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </Pressable>
        )}

        <BookSection title="Antigo Testamento" items={ot} version={version} />
        <BookSection title="Novo Testamento" items={nt} version={version} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PremiumFeature({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4 active:opacity-70">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-gold/15">
          <Ionicons name={icon} size={20} color={BrandColors.goldDark} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold text-foreground">{title}</Text>
            <PremiumBadge />
          </View>
          <Text className="text-xs text-foreground/50">{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={BrandColors.muted} />
    </Pressable>
  );
}

function BookSection({
  title,
  items,
  version,
}: {
  title: string;
  items: { b: (typeof BOOKS)[number]; i: number }[];
  version: ReturnType<typeof useBibleStore.getState>['version'];
}) {
  return (
    <View className="mb-2">
      <Text className="mb-3 mt-2 text-lg font-bold text-foreground">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {items.map(({ b }) => (
          <Pressable
            key={b.abbrev}
            onPress={() => router.push(`/bible/${b.abbrev}` as never)}
            className="rounded-xl bg-surface px-3.5 py-2.5 active:opacity-70">
            <Text className="text-sm font-medium text-foreground">{bookName(b, version)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
