import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookChapterPicker } from '@/components/book-chapter-picker';
import { PremiumBadge } from '@/components/premium-badge';
import { PremiumGate } from '@/components/premium-gate';
import { BrandColors } from '@/constants/colors';
import { getStrong } from '@/constants/originals';
import { useChapter } from '@/hooks/use-bible-text';
import { useBookOriginals } from '@/hooks/use-originals';
import { useTranslation } from '@/i18n';
import { bookName, getBook } from '@/services/bible';
import {
  chapterVerseCount,
  ORIGINALS_CREDIT,
  verseWords,
  type OriginalWord,
} from '@/services/originals';
import { useBibleStore } from '@/store/useBibleStore';
import { useLocaleStore } from '@/store/useLocaleStore';

export default function OriginalsScreen() {
  const t = useTranslation();
  return (
    <PremiumGate title={t.originals.title} feature={t.originals.title}>
      <Originals />
    </PremiumGate>
  );
}

function Originals() {
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const version = useBibleStore((s) => s.version);
  const lastRead = useBibleStore((s) => s.lastRead);

  // Abre onde o usuário está lendo; João 1 é só o ponto de partida inicial.
  const [bookIndex, setBookIndex] = useState(lastRead?.bookIndex ?? 42);
  const [chapter, setChapter] = useState(lastRead?.chapter ?? 1);
  const [verse, setVerse] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const meta = getBook(bookIndex);
  const { data, loading } = useBookOriginals(meta?.abbrev);
  const { verses: bibleVerses } = useChapter(version, bookIndex, chapter);

  const words = verseWords(data, chapter, verse);
  const total = chapterVerseCount(data, chapter);
  const isHebrew = meta?.testament === 'AT';

  // Trocar de passagem invalida a palavra aberta.
  useEffect(() => {
    setSelected(null);
  }, [bookIndex, chapter, verse]);

  // Capítulo mais curto no original do que o versículo em que estávamos.
  useEffect(() => {
    if (total > 0 && verse > total) setVerse(1);
  }, [total, verse]);

  function goVerse(delta: number) {
    const next = verse + delta;
    if (next >= 1 && next <= total) setVerse(next);
  }

  const word: OriginalWord | undefined = selected != null ? words[selected] : undefined;
  const lex = word ? data?.lex[word[4]] : undefined;
  // Verbetes traduzidos à mão têm prioridade; o léxico do dado é o resto.
  const curated = word ? getStrong(word[4].replace(/^([GH])0*/, '$1'), locale) : undefined;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="bg-ink px-4 pb-3 pt-1">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text className="text-base font-bold text-white">{t.originals.title}</Text>
          <PremiumBadge />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Passagem */}
        <Pressable
          onPress={() => setShowPicker(true)}
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4 active:opacity-80">
          <View>
            <Text className="text-lg font-bold text-foreground">
              {meta ? bookName(meta, locale) : ''} {chapter}:{verse}
            </Text>
            <Text className="text-xs text-foreground/50">
              {isHebrew ? t.originals.hebrew : t.originals.greek} · {t.originals.changePassage}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={BrandColors.muted} />
        </Pressable>

        {/* Navegação de versículo */}
        <View className="mb-4 flex-row items-center gap-2">
          <NavBtn
            icon="chevron-back"
            label={t.originals.prevVerse}
            disabled={verse <= 1}
            onPress={() => goVerse(-1)}
          />
          <View className="items-center justify-center rounded-xl bg-surface px-4 py-2.5">
            <Text className="text-xs font-semibold text-foreground/60">
              {t.originals.verse} {verse}
              {total > 0 ? ` / ${total}` : ''}
            </Text>
          </View>
          <NavBtn
            icon="chevron-forward"
            label={t.originals.nextVerse}
            disabled={total === 0 || verse >= total}
            onPress={() => goVerse(1)}
          />
        </View>

        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator color={BrandColors.primary} />
            <Text className="mt-3 text-sm text-foreground/50">{t.originals.loading}</Text>
          </View>
        ) : words.length === 0 ? (
          <View className="items-center rounded-3xl border border-dashed border-border/15 p-8">
            <Text className="text-center text-foreground/50">{t.originals.notAvailable}</Text>
          </View>
        ) : (
          <>
            {/* O versículo na Bíblia do usuário, para dar contexto ao original */}
            {bibleVerses[verse - 1] && (
              <View className="mb-4 rounded-2xl bg-primary/5 p-4">
                <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-primary/70">
                  {t.originals.inYourBible(version)}
                </Text>
                <Text className="text-sm leading-6 text-foreground/80">
                  {bibleVerses[verse - 1]}
                </Text>
              </View>
            )}

            <Text className="mb-2 text-xs uppercase tracking-wider text-foreground/40">
              {isHebrew ? t.originals.rtlHint : t.originals.tapHint}
            </Text>

            {/* Interlinear */}
            <View
              className="mb-2 flex-row flex-wrap gap-2"
              style={isHebrew ? { flexDirection: 'row-reverse', justifyContent: 'flex-start' } : undefined}>
              {words.map((w, i) => {
                const active = selected === i;
                const gloss = locale === 'es' && w[3] ? w[3] : w[2];
                return (
                  <Pressable
                    key={i}
                    onPress={() => setSelected(active ? null : i)}
                    className={`items-center rounded-2xl border px-3 py-2 active:opacity-70 ${
                      active ? 'border-primary bg-primary/10' : 'border-border/10 bg-surface'
                    }`}>
                    <Text className="text-xl text-foreground">{w[0]}</Text>
                    {!!w[1] && <Text className="text-[11px] italic text-primary">{w[1]}</Text>}
                    <Text className="text-[11px] text-foreground/50">{gloss}</Text>
                  </Pressable>
                );
              })}
            </View>

            {locale === 'pt' && (
              <Text className="mb-5 text-[11px] text-foreground/35">
                {t.originals.glossLanguageNote}
              </Text>
            )}

            {/* Verbete Strong */}
            {word ? (
              <View className="mb-4 overflow-hidden rounded-3xl bg-surface">
                <View className="flex-row items-center justify-between bg-primary px-5 py-4">
                  <Text className="text-2xl font-bold text-white">
                    {curated?.lemma ?? lex?.[0] ?? word[0]}
                  </Text>
                  <Text className="font-semibold text-gold-light">Strong {word[4]}</Text>
                </View>
                <View className="p-5">
                  <StrongRow
                    label={t.originals.meaning}
                    value={curated?.meaning ?? lex?.[1] ?? '—'}
                  />
                  {curated?.root && <StrongRow label={t.originals.root} value={curated.root} />}
                  <StrongRow
                    label={t.originals.grammar}
                    value={curated?.grammar ?? lex?.[2] ?? '—'}
                  />
                  {curated?.occurrences ? (
                    <StrongRow
                      label={t.originals.occurrences}
                      value={curated.occurrences}
                      last
                    />
                  ) : (
                    <StrongRow label={t.originals.strongCode} value={word[4]} last />
                  )}
                </View>
              </View>
            ) : (
              <View className="mb-4 items-center rounded-3xl border border-dashed border-border/15 p-8">
                <Ionicons name="hand-left-outline" size={32} color={BrandColors.muted} />
                <Text className="mt-2 text-center text-foreground/50">{t.originals.emptyHint}</Text>
              </View>
            )}
          </>
        )}

        {/* Crédito exigido pela licença CC BY dos dados */}
        <Text className="mt-2 text-center text-[11px] leading-4 text-foreground/30">
          {t.originals.credit}: {ORIGINALS_CREDIT}
        </Text>
      </ScrollView>

      <BookChapterPicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(bi, ch) => {
          setBookIndex(bi);
          setChapter(ch);
          setVerse(1);
          setShowPicker(false);
        }}
      />
    </SafeAreaView>
  );
}

function NavBtn({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: 'chevron-back' | 'chevron-forward';
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 flex-row items-center justify-center gap-1 rounded-xl py-2.5 ${
        disabled ? 'bg-surface/50' : 'bg-surface active:opacity-70'
      }`}>
      {icon === 'chevron-back' && (
        <Ionicons name={icon} size={15} color={disabled ? BrandColors.muted : BrandColors.primary} />
      )}
      <Text
        className={`text-xs font-semibold ${disabled ? 'text-foreground/25' : 'text-foreground'}`}>
        {label}
      </Text>
      {icon === 'chevron-forward' && (
        <Ionicons name={icon} size={15} color={disabled ? BrandColors.muted : BrandColors.primary} />
      )}
    </Pressable>
  );
}

function StrongRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`flex-row ${last ? '' : 'mb-3 border-b border-border/5 pb-3'}`}>
      <Text className="w-28 text-sm text-foreground/50">{label}</Text>
      <Text className="flex-1 text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}
