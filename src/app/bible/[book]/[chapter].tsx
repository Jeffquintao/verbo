import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VerseActionSheet } from '@/components/verse-action-sheet';
import { BrandColors } from '@/constants/colors';
import { formatRef, placesInChapter } from '@/constants/places';
import { useTheme } from '@/hooks/use-theme';
import {
  BIBLE_VERSIONS,
  bookIndexByAbbrev,
  bookName,
  getBook,
  getChapterVerses,
  nextChapter,
  prevChapter,
} from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';
import { useLibraryStore, verseKey } from '@/store/useLibraryStore';

export default function ReaderScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const version = useBibleStore((s) => s.version);
  const setVersion = useBibleStore((s) => s.setVersion);
  const setLastRead = useBibleStore((s) => s.setLastRead);
  const highlights = useLibraryStore((s) => s.highlights);
  const notes = useLibraryStore((s) => s.notes);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const { colors } = useTheme();

  const bookIndex = bookIndexByAbbrev(book);
  const chapterNum = Number(chapter) || 1;
  const meta = getBook(bookIndex);

  const verses = useMemo(
    () => getChapterVerses(version, bookIndex, chapterNum),
    [version, bookIndex, chapterNum],
  );

  useEffect(() => {
    if (bookIndex >= 0) setLastRead({ bookIndex, chapter: chapterNum });
  }, [bookIndex, chapterNum, setLastRead]);

  if (!meta) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground/60">Livro não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const prev = prevChapter(bookIndex, chapterNum);
  const next = nextChapter(bookIndex, chapterNum);

  function goTo(pos: { bookIndex: number; chapter: number } | null) {
    if (!pos) return;
    const abbrev = getBook(pos.bookIndex)?.abbrev;
    if (abbrev) router.replace(`/bible/${abbrev}/${pos.chapter}` as never);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border/5 px-4 pb-3 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground">
          {bookName(meta, version)} {chapterNum}
        </Text>
        <View className="flex-row rounded-full bg-surface p-0.5">
          {BIBLE_VERSIONS.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => setVersion(v.id)}
              className={`rounded-full px-3 py-1 ${version === v.id ? 'bg-primary' : ''}`}>
              <Text
                className={`text-xs font-semibold ${version === v.id ? 'text-white' : 'text-foreground/50'}`}>
                {v.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Versículos */}
      <ScrollView contentContainerClassName="px-5 py-4 pb-28" showsVerticalScrollIndicator={false}>
        {verses.map((text, i) => {
          const verseNum = i + 1;
          const key = verseKey(bookIndex, chapterNum, verseNum);
          const hex = highlights[key];
          const hasNote = notes.some(
            (n) => n.bookIndex === bookIndex && n.chapter === chapterNum && n.verse === verseNum,
          );
          return (
            <Pressable
              key={i}
              onPress={() => setSelectedVerse(verseNum)}
              className="mb-1 rounded-lg active:opacity-60">
              <Text
                className="px-1 py-1 text-base leading-7 text-foreground"
                style={hex ? { backgroundColor: hex + '40' } : undefined}>
                <Text className="align-top text-xs font-bold text-primary">{verseNum} </Text>
                {text}
                {hasNote && <Text>  📝</Text>}
              </Text>
            </Pressable>
          );
        })}

        {/* Pin de local histórico mencionado no capítulo */}
        {placesInChapter(book, chapterNum).slice(0, 1).map((place) => (
          <Pressable
            key={place.id}
            onPress={() => router.push(`/places/${place.id}` as never)}
            className="mt-4 rounded-2xl bg-gold/10 p-4 active:opacity-70">
            <View className="mb-2 flex-row items-center gap-1.5">
              <Ionicons name="location" size={14} color={BrandColors.goldDark} />
              <Text className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                Local mencionado neste capítulo
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View
                className="h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: place.color }}>
                <Ionicons name="business" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">{place.name}</Text>
                <Text className="text-xs text-foreground/50">
                  {place.city} · {place.refs.slice(0, 2).map(formatRef).join(', ')}
                </Text>
              </View>
              <View className="rounded-full bg-gold px-3 py-1.5">
                <Text className="text-xs font-bold text-foreground">Ver</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <VerseActionSheet
        bookIndex={bookIndex}
        chapter={chapterNum}
        verse={selectedVerse}
        reference={`${bookName(meta, version)} ${chapterNum}:${selectedVerse ?? ''}`}
        onClose={() => setSelectedVerse(null)}
      />

      {/* Navegação prev/next */}
      <View className="absolute inset-x-0 bottom-0 flex-row gap-3 bg-background px-5 pb-6 pt-2">
        <NavButton
          dir="prev"
          disabled={!prev}
          label={prev ? `${getBook(prev.bookIndex)?.abbrev.toUpperCase()} ${prev.chapter}` : ''}
          onPress={() => goTo(prev)}
        />
        <NavButton
          dir="next"
          disabled={!next}
          label={next ? `${getBook(next.bookIndex)?.abbrev.toUpperCase()} ${next.chapter}` : ''}
          onPress={() => goTo(next)}
        />
      </View>
    </SafeAreaView>
  );
}

function NavButton({
  dir,
  label,
  disabled,
  onPress,
}: {
  dir: 'prev' | 'next';
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-3 ${
        disabled ? 'bg-ink/5' : 'bg-primary active:opacity-80'
      }`}>
      {dir === 'prev' && (
        <Ionicons name="chevron-back" size={16} color={disabled ? BrandColors.muted : '#fff'} />
      )}
      <Text className={`text-sm font-semibold ${disabled ? 'text-foreground/30' : 'text-white'}`}>
        {dir === 'prev' ? 'Anterior' : 'Próximo'}
      </Text>
      {dir === 'next' && (
        <Ionicons name="chevron-forward" size={16} color={disabled ? BrandColors.muted : '#fff'} />
      )}
    </Pressable>
  );
}
