import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { useBibleText } from '@/hooks/use-bible-text';
import { bookName, findBook, getBook, searchInText } from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';
import { useLocaleStore } from '@/store/useLocaleStore';

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return <Text className="text-sm leading-6 text-foreground/80">{text}</Text>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return <Text className="text-sm leading-6 text-foreground/80">{text}</Text>;
  return (
    <Text className="text-sm leading-6 text-foreground/80">
      {text.slice(0, idx)}
      <Text className="bg-gold/30 font-semibold text-foreground">{text.slice(idx, idx + q.length)}</Text>
      {text.slice(idx + q.length)}
    </Text>
  );
}

export default function SearchScreen() {
  const version = useBibleStore((s) => s.version);
  const { colors } = useTheme();
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [query, setQuery] = useState('');

  const { text: bibleText, loading } = useBibleText(version);
  const results = useMemo(() => searchInText(bibleText, query, 80), [bibleText, query]);
  const bookMatch = useMemo(() => (query.trim() ? findBook(query) : -1), [query]);
  const matchedBook = bookMatch >= 0 ? getBook(bookMatch) : undefined;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header + input */}
      <View className="flex-row items-center gap-2 px-4 pb-3 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View className="flex-1 flex-row items-center gap-2 rounded-2xl bg-surface px-4">
          <Ionicons name="search" size={18} color={BrandColors.muted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder={t.search.placeholder(version)}
            placeholderTextColor={BrandColors.muted}
            className="flex-1 py-3 text-base text-foreground"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={BrandColors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerClassName="px-4 pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Ir para o livro */}
        {matchedBook && (
          <Pressable
            onPress={() => router.push(`/bible/${matchedBook.abbrev}` as never)}
            className="mb-3 flex-row items-center justify-between rounded-2xl bg-primary p-4 active:opacity-80">
            <View className="flex-row items-center gap-3">
              <Ionicons name="book" size={20} color="#fff" />
              <Text className="font-semibold text-white">
                {t.search.open(bookName(matchedBook, locale))}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Pressable>
        )}

        {loading && (
          <View className="mt-16 items-center">
            <ActivityIndicator color={BrandColors.primary} />
          </View>
        )}

        {!loading && query.trim().length >= 2 && (
          <Text className="mb-3 mt-1 text-xs text-foreground/50">
            {t.search.results(results.length)}
          </Text>
        )}

        {results.map((r) => {
          const book = getBook(r.bookIndex)!;
          return (
            <Pressable
              key={`${r.bookIndex}-${r.chapter}-${r.verse}`}
              onPress={() => router.push(`/bible/${book.abbrev}/${r.chapter}` as never)}
              className="mb-2 rounded-2xl bg-surface p-4 active:opacity-70">
              <Text className="mb-1 text-xs font-bold text-primary">
                {bookName(book, locale)} {r.chapter}:{r.verse}
              </Text>
              {highlight(r.text, query)}
            </Pressable>
          );
        })}

        {query.trim().length >= 2 && results.length === 0 && !matchedBook && (
          <View className="mt-16 items-center">
            <Ionicons name="search" size={40} color={BrandColors.muted} />
            <Text className="mt-3 text-foreground/50">{t.search.noResults(query)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
