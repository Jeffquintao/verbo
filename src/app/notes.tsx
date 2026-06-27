import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { bookName, getBook } from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';
import { useLibraryStore } from '@/store/useLibraryStore';

export default function NotesScreen() {
  const version = useBibleStore((s) => s.version);
  const notes = useLibraryStore((s) => s.notes);
  const removeNote = useLibraryStore((s) => s.removeNote);
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center gap-2 px-4 pb-3 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Minhas notas</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-10" showsVerticalScrollIndicator={false}>
        {notes.length === 0 && (
          <View className="mt-24 items-center">
            <Ionicons name="create-outline" size={44} color={BrandColors.muted} />
            <Text className="mt-3 text-center text-foreground/50">
              Você ainda não tem notas.{'\n'}Toque em um versículo para adicionar.
            </Text>
          </View>
        )}

        {notes.map((n) => {
          const book = getBook(n.bookIndex);
          const ref = book ? `${bookName(book, version)} ${n.chapter}:${n.verse}` : '';
          return (
            <View key={n.id} className="mb-3 rounded-2xl bg-surface p-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Pressable
                  onPress={() => book && router.push(`/bible/${book.abbrev}/${n.chapter}` as never)}>
                  <Text className="text-xs font-bold text-primary">{ref}</Text>
                </Pressable>
                <Pressable onPress={() => removeNote(n.id)} className="active:opacity-60">
                  <Ionicons name="trash-outline" size={18} color={BrandColors.muted} />
                </Pressable>
              </View>
              <Text className="text-base leading-6 text-foreground">{n.text}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
