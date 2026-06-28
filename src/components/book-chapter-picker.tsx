import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { themeVars } from '@/constants/themes';
import { useTheme } from '@/hooks/use-theme';
import { BOOKS } from '@/services/bible';

/** Seletor de livro → capítulo, em modal. */
export function BookChapterPicker({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (bookIndex: number, chapter: number) => void;
}) {
  const { scheme, colors } = useTheme();
  const [bookIndex, setBookIndex] = useState<number | null>(null);
  const book = bookIndex != null ? BOOKS[bookIndex] : null;

  function close() {
    setBookIndex(null);
    onClose();
  }

  const ot = BOOKS.map((b, i) => ({ b, i })).filter(({ b }) => b.testament === 'AT');
  const nt = BOOKS.map((b, i) => ({ b, i })).filter(({ b }) => b.testament === 'NT');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={themeVars[scheme]} className="flex-1 justify-end bg-black/40" onPress={close}>
        <Pressable
          className="h-[78%] rounded-t-3xl bg-background p-5"
          onPress={(e) => e.stopPropagation()}>
          <View className="mb-3 h-1 w-10 self-center rounded-full bg-foreground/15" />

          {book ? (
            <>
              <View className="mb-3 flex-row items-center gap-2">
                <Pressable onPress={() => setBookIndex(null)} hitSlop={8} className="active:opacity-60">
                  <Ionicons name="arrow-back" size={22} color={colors.foreground} />
                </Pressable>
                <Text className="text-lg font-bold text-foreground">{book.name}</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap gap-3 pb-6">
                  {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => {
                        onSelect(bookIndex!, c);
                        setBookIndex(null);
                      }}
                      className="h-12 w-12 items-center justify-center rounded-2xl bg-surface active:opacity-70">
                      <Text className="font-semibold text-foreground">{c}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </>
          ) : (
            <>
              <Text className="mb-3 text-lg font-bold text-foreground">Escolher livro</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {[
                  { title: 'Antigo Testamento', items: ot },
                  { title: 'Novo Testamento', items: nt },
                ].map((section) => (
                  <View key={section.title} className="mb-2">
                    <Text className="mb-2 mt-2 text-xs font-bold uppercase tracking-wider text-foreground/40">
                      {section.title}
                    </Text>
                    <View className="flex-row flex-wrap gap-2 pb-1">
                      {section.items.map(({ b, i }) => (
                        <Pressable
                          key={b.abbrev}
                          onPress={() => setBookIndex(i)}
                          className="rounded-xl bg-surface px-3.5 py-2.5 active:opacity-70">
                          <Text className="text-sm font-medium text-foreground">{b.name}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
                <View className="h-6" />
              </ScrollView>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
