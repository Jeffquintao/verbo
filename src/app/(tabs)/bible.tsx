import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookChapterPicker } from '@/components/book-chapter-picker';
import { VerseActionSheet } from '@/components/verse-action-sheet';
import { BrandColors } from '@/constants/colors';
import { formatRef, placesInChapter } from '@/constants/places';
import { themeVars } from '@/constants/themes';
import { useTheme } from '@/hooks/use-theme';
import { useBibleTexts, useChapter } from '@/hooks/use-bible-text';
import { useTranslation } from '@/i18n';
import {
  bookIndexByAbbrev,
  bookName,
  getBook,
  chapterVerses,
  nextChapter,
  prevChapter,
  versionsForLocale,
} from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';
import { useLibraryStore, verseKey } from '@/store/useLibraryStore';
import { useLocaleStore } from '@/store/useLocaleStore';

type Tab = 'leitura' | 'comparar' | 'notas';

export default function BibleScreen() {
  const insets = useSafeAreaInsets();
  const { scheme } = useTheme();
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lastRead = useBibleStore((s) => s.lastRead);
  const setLastRead = useBibleStore((s) => s.setLastRead);
  const version = useBibleStore((s) => s.version);
  const setVersion = useBibleStore((s) => s.setVersion);
  const highlights = useLibraryStore((s) => s.highlights);
  const notes = useLibraryStore((s) => s.notes);

  const [tab, setTab] = useState<Tab>('leitura');
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const versions = versionsForLocale(locale);
  const defaultBook = Math.max(0, bookIndexByAbbrev('jo'));
  const bookIndex = lastRead?.bookIndex ?? defaultBook;
  const chapterNum = lastRead?.chapter ?? 1;
  const meta = getBook(bookIndex);

  // Todo hook precisa rodar antes de qualquer return: sair mais cedo mudaria a
  // quantidade de hooks entre renders e quebraria o componente.
  const { verses, loading } = useChapter(version, bookIndex, chapterNum);
  const prev = prevChapter(bookIndex, chapterNum);
  const next = nextChapter(bookIndex, chapterNum);

  if (!meta) return null;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'leitura', label: t.bible.reading },
    { id: 'comparar', label: t.bible.compare },
    { id: 'notas', label: t.bible.notes },
  ];

  function goTo(pos: { bookIndex: number; chapter: number } | null) {
    if (pos) setLastRead(pos);
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Header escuro */}
      <View style={{ paddingTop: insets.top + 10 }} className="bg-ink px-5 pb-3">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => setShowPicker(true)}
            className="flex-row items-center gap-1.5 active:opacity-70">
            <Text className="text-2xl font-bold text-white">
              {bookName(meta, locale)} {chapterNum}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </Pressable>

          <View className="flex-row items-center gap-2">
            <View className="flex-row rounded-full bg-white/10 p-0.5">
              {versions.map((v) => (
                <Pressable
                  key={v.id}
                  onPress={() => setVersion(v.id)}
                  className={`rounded-full px-3 py-1 ${version === v.id ? 'bg-primary' : ''}`}>
                  <Text
                    className={`text-xs font-semibold ${version === v.id ? 'text-white' : 'text-white/60'}`}>
                    {v.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => setShowMenu(true)}
              className="h-9 w-9 items-center justify-center rounded-full bg-white/10 active:opacity-70">
              <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Sub-abas */}
      <View className="flex-row border-b border-foreground/10">
        {TABS.map((tb) => (
          <Pressable key={tb.id} onPress={() => setTab(tb.id)} className="flex-1 items-center py-3">
            <Text className={`font-semibold ${tab === tb.id ? 'text-primary' : 'text-foreground/50'}`}>
              {tb.label}
            </Text>
            {tab === tb.id && (
              <View className="absolute bottom-0 h-0.5 w-14 rounded-full bg-primary" />
            )}
          </Pressable>
        ))}
      </View>

      {/* Conteúdo */}
      <ScrollView className="flex-1" contentContainerClassName="p-5 pb-6" showsVerticalScrollIndicator={false}>
        {tab === 'leitura' && loading && <BibleLoading />}
        {tab === 'leitura' && !loading && (
          <LeituraTab
            verses={verses}
            bookIndex={bookIndex}
            chapterNum={chapterNum}
            highlights={highlights}
            notes={notes}
            onSelectVerse={setSelectedVerse}
          />
        )}
        {tab === 'comparar' && <CompararTab bookIndex={bookIndex} chapterNum={chapterNum} />}
        {tab === 'notas' && (
          <NotasTab
            bookIndex={bookIndex}
            onOpen={(ch) => {
              setLastRead({ bookIndex, chapter: ch });
              setTab('leitura');
            }}
          />
        )}
      </ScrollView>

      {/* Navegação de capítulo */}
      {tab !== 'notas' && (
        <View className="flex-row gap-3 border-t border-foreground/5 px-5 py-3">
          <NavButton dir="prev" disabled={!prev} onPress={() => goTo(prev)} />
          <NavButton dir="next" disabled={!next} onPress={() => goTo(next)} />
        </View>
      )}

      {/* Modais */}
      <VerseActionSheet
        bookIndex={bookIndex}
        chapter={chapterNum}
        verse={selectedVerse}
        reference={`${bookName(meta, locale)} ${chapterNum}:${selectedVerse ?? ''}`}
        onClose={() => setSelectedVerse(null)}
      />
      <BookChapterPicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(bi, ch) => {
          setLastRead({ bookIndex: bi, chapter: ch });
          setTab('leitura');
          setShowPicker(false);
        }}
      />

      {/* Menu (...) */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable
          style={themeVars[scheme]}
          className="flex-1 justify-end bg-black/40"
          onPress={() => setShowMenu(false)}>
          <Pressable className="rounded-t-3xl bg-background p-5 pb-8" onPress={(e) => e.stopPropagation()}>
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-foreground/15" />
            {[
              { icon: 'school', label: t.bible.askProfessor, href: '/professor' },
              {
                icon: 'headset',
                label: t.bible.listenChapter,
                href: `/audio/${meta.abbrev}/${chapterNum}`,
              },
              { icon: 'search', label: t.common.search, href: '/bible/search' },
              { icon: 'language', label: t.bible.originalTexts, href: '/originals' },
              { icon: 'location', label: t.bible.biblicalPlaces, href: '/places' },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  setShowMenu(false);
                  router.push(item.href as never);
                }}
                className="flex-row items-center gap-3 rounded-2xl p-4 active:opacity-70">
                <Ionicons name={item.icon as never} size={22} color={BrandColors.primary} />
                <Text className="text-base font-medium text-foreground">{item.label}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function BibleLoading() {
  return (
    <View className="mt-20 items-center">
      <ActivityIndicator color={BrandColors.primary} />
    </View>
  );
}

function LeituraTab({
  verses,
  bookIndex,
  chapterNum,
  highlights,
  notes,
  onSelectVerse,
}: {
  verses: string[];
  bookIndex: number;
  chapterNum: number;
  highlights: Record<string, string>;
  notes: { bookIndex: number; chapter: number; verse: number }[];
  onSelectVerse: (v: number) => void;
}) {
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const places = placesInChapter(getBook(bookIndex)?.abbrev ?? '', chapterNum, locale).slice(0, 1);
  return (
    <>
      {verses.map((text, i) => {
        const verseNum = i + 1;
        const hex = highlights[verseKey(bookIndex, chapterNum, verseNum)];
        const hasNote = notes.some(
          (n) => n.bookIndex === bookIndex && n.chapter === chapterNum && n.verse === verseNum,
        );
        return (
          <Pressable
            key={i}
            onPress={() => onSelectVerse(verseNum)}
            className="mb-1 rounded-lg active:opacity-60">
            <Text
              className="px-1 py-1 text-base leading-7 text-foreground"
              style={hex ? { backgroundColor: hex + '40' } : undefined}>
              <Text className="text-xs font-bold text-primary">{verseNum} </Text>
              {text}
              {hasNote && <Text>{'  '}📝</Text>}
            </Text>
          </Pressable>
        );
      })}
      {places.map((place) => (
        <Pressable
          key={place.id}
          onPress={() => router.push(`/places/${place.id}` as never)}
          className="mt-4 rounded-2xl bg-gold/10 p-4 active:opacity-70">
          <View className="mb-2 flex-row items-center gap-1.5">
            <Ionicons name="location" size={14} color={BrandColors.goldDark} />
            <Text className="text-xs font-bold uppercase tracking-wider text-gold-dark">
              {t.bible.placeInChapter}
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
              <Text className="text-xs font-bold text-ink">{t.bible.view}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </>
  );
}

function CompararTab({ bookIndex, chapterNum }: { bookIndex: number; chapterNum: number }) {
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  // Compara as versões disponíveis no idioma atual (uma ou duas).
  const versions = versionsForLocale(locale);
  const { texts } = useBibleTexts(versions.map((v) => v.id));
  const columns = versions.map((v) => ({
    label: v.label,
    verses: chapterVerses(texts[v.id], bookIndex, chapterNum),
  }));
  const count = Math.max(...columns.map((c) => c.verses.length), 0);

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="mb-3 rounded-2xl bg-surface p-4">
          <Text className="mb-2 text-xs font-bold text-primary">{t.bible.verse(i + 1)}</Text>
          {columns.map((col, ci) => (
            <View key={col.label} className={ci < columns.length - 1 ? 'mb-2' : undefined}>
              <Text className="mb-0.5 text-[11px] font-bold text-foreground/40">{col.label}</Text>
              <Text className="text-sm leading-6 text-foreground/90">{col.verses[i] ?? '—'}</Text>
            </View>
          ))}
        </View>
      ))}
      <View className="mt-1 items-center rounded-2xl border border-dashed border-gold/40 p-4">
        <Text className="text-sm font-semibold text-gold-dark">{t.bible.morePremiumVersions}</Text>
        <Text className="text-xs text-foreground/50">{t.bible.morePremiumVersionsSub}</Text>
      </View>
    </>
  );
}

function NotasTab({ bookIndex, onOpen }: { bookIndex: number; onOpen: (chapter: number) => void }) {
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const notes = useLibraryStore((s) => s.notes).filter((n) => n.bookIndex === bookIndex);
  const removeNote = useLibraryStore((s) => s.removeNote);
  const book = getBook(bookIndex);
  const label = book ? bookName(book, locale) : '';

  if (notes.length === 0) {
    return (
      <View className="mt-16 items-center">
        <Ionicons name="create-outline" size={40} color={BrandColors.muted} />
        <Text className="mt-3 text-center text-foreground/50">
          {t.bible.noNotesIn(label)}
          {'\n'}
          {t.bible.noNotesHint}
        </Text>
      </View>
    );
  }

  return (
    <>
      {notes.map((n) => (
        <View key={n.id} className="mb-3 rounded-2xl bg-surface p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Pressable onPress={() => onOpen(n.chapter)}>
              <Text className="text-xs font-bold text-primary">
                {label} {n.chapter}:{n.verse}
              </Text>
            </Pressable>
            <Pressable onPress={() => removeNote(n.id)} className="active:opacity-60">
              <Ionicons name="trash-outline" size={18} color={BrandColors.muted} />
            </Pressable>
          </View>
          <Text className="text-base leading-6 text-foreground">{n.text}</Text>
        </View>
      ))}
    </>
  );
}

function NavButton({
  dir,
  disabled,
  onPress,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onPress: () => void;
}) {
  const t = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-3 ${
        disabled ? 'bg-foreground/5' : 'bg-primary active:opacity-80'
      }`}>
      {dir === 'prev' && (
        <Ionicons name="chevron-back" size={16} color={disabled ? BrandColors.muted : '#fff'} />
      )}
      <Text className={`text-sm font-semibold ${disabled ? 'text-foreground/30' : 'text-white'}`}>
        {dir === 'prev' ? t.bible.previous : t.bible.next}
      </Text>
      {dir === 'next' && (
        <Ionicons name="chevron-forward" size={16} color={disabled ? BrandColors.muted : '#fff'} />
      )}
    </Pressable>
  );
}
