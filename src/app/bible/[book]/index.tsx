import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { bookIndexByAbbrev, bookName, getBook } from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';

export default function ChapterPicker() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const version = useBibleStore((s) => s.version);
  const { colors } = useTheme();
  const bookIndex = bookIndexByAbbrev(book);
  const meta = getBook(bookIndex);

  if (!meta) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground/60">Livro não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const chapters = Array.from({ length: meta.chapters }, (_, i) => i + 1);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center gap-2 px-4 pb-3 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">{bookName(meta, version)}</Text>
      </View>

      <ScrollView contentContainerClassName="p-4">
        <Text className="mb-3 text-sm text-foreground/50">Escolha o capítulo</Text>
        <View className="flex-row flex-wrap gap-3">
          {chapters.map((c) => (
            <Pressable
              key={c}
              onPress={() => router.push(`/bible/${meta.abbrev}/${c}` as never)}
              className="h-14 w-14 items-center justify-center rounded-2xl bg-surface active:opacity-70">
              <Text className="text-base font-semibold text-foreground">{c}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
