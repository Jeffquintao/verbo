import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumBadge } from '@/components/premium-badge';
import { BrandColors } from '@/constants/colors';
import {
  getStrong,
  INTERLINEAR_VERSES,
  type InterlinearWord,
} from '@/constants/originals';

type Lang = 'NT' | 'AT';

export default function OriginalsScreen() {
  const [lang, setLang] = useState<Lang>('NT');
  const [selected, setSelected] = useState<InterlinearWord | null>(null);

  const verse = useMemo(
    () => INTERLINEAR_VERSES.find((v) => v.testament === lang)!,
    [lang],
  );
  const strong = selected ? getStrong(selected.strong) : null;
  const isHebrew = lang === 'AT';

  function switchLang(l: Lang) {
    setLang(l);
    setSelected(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header premium (escuro) */}
      <View className="bg-ink px-4 pb-3 pt-1">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text className="text-base font-bold text-white">Textos originais</Text>
          <PremiumBadge />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Sub-abas idioma */}
        <View className="mb-5 flex-row gap-2">
          {(['NT', 'AT'] as Lang[]).map((l) => (
            <Pressable
              key={l}
              onPress={() => switchLang(l)}
              className={`rounded-full px-4 py-2 ${lang === l ? 'bg-primary' : 'bg-surface'}`}>
              <Text className={lang === l ? 'font-semibold text-white' : 'font-medium text-foreground'}>
                {l === 'NT' ? 'Grego (NT)' : 'Hebraico (AT)'}
              </Text>
            </Pressable>
          ))}
          <View className="justify-center rounded-full bg-surface/60 px-4 py-2">
            <Text className="font-medium text-foreground/40">Interlinear</Text>
          </View>
        </View>

        {/* Referência */}
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground">{verse.ref}</Text>
          <Text className="text-xs text-foreground/50">{verse.source}</Text>
        </View>
        <Text className="mb-4 text-xs uppercase tracking-wider text-foreground/40">
          {isHebrew ? 'Leitura da direita para a esquerda' : 'Toque numa palavra para ver o significado'}
        </Text>

        {/* Palavras (interlinear) */}
        <View
          className="mb-6 flex-row flex-wrap gap-2"
          style={isHebrew ? { flexDirection: 'row-reverse', justifyContent: 'flex-start' } : undefined}>
          {verse.words.map((w, i) => {
            const active = selected === w;
            return (
              <Pressable
                key={i}
                onPress={() => setSelected(w)}
                className={`min-w-16 items-center rounded-2xl border px-3 py-2 ${
                  active ? 'border-primary bg-primary/10' : 'border-border/10 bg-surface'
                }`}>
                <Text className={`text-xl ${isHebrew ? 'font-semibold' : ''} text-foreground`}>{w.surface}</Text>
                <Text className="text-[11px] italic text-primary">{w.translit}</Text>
                <Text className="text-[11px] text-foreground/50">{w.gloss}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Card Strong */}
        {strong ? (
          <View className="overflow-hidden rounded-3xl bg-surface">
            <View className="flex-row items-center justify-between bg-primary px-5 py-4">
              <Text className="text-2xl font-bold text-white">{strong.lemma}</Text>
              <Text className="font-semibold text-gold-light">Strong {strong.id}</Text>
            </View>
            <View className="p-5">
              <StrongRow label="Significado" value={strong.meaning} />
              <StrongRow label="Raiz" value={strong.root} />
              <StrongRow label="Gramática" value={strong.grammar} />
              <StrongRow label="Ocorrências" value={strong.occurrences} last />
            </View>
          </View>
        ) : (
          <View className="items-center rounded-3xl border border-dashed border-border/15 p-8">
            <Ionicons name="hand-left-outline" size={32} color={BrandColors.muted} />
            <Text className="mt-2 text-center text-foreground/50">
              Toque numa palavra acima para ver o dicionário Strong, a raiz e a análise gramatical.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
