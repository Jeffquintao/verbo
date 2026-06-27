import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import {
  bookIndexByAbbrev,
  bookName,
  getBook,
  getChapterVerses,
  nextChapter,
  prevChapter,
} from '@/services/bible';
import { useBibleStore } from '@/store/useBibleStore';

const SPEEDS = [0.75, 1.0, 1.25, 1.5];
const SLEEP_OPTIONS = [0, 5, 10, 15, 30]; // minutos; 0 = desligado

export default function AudioPlayerScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const version = useBibleStore((s) => s.version);

  const bookIndex = bookIndexByAbbrev(book);
  const chapterNum = Number(chapter) || 1;
  const meta = getBook(bookIndex);
  const verses = useMemo(
    () => getChapterVerses(version, bookIndex, chapterNum),
    [version, bookIndex, chapterNum],
  );

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [sleepMin, setSleepMin] = useState(0);
  const [sleepLeft, setSleepLeft] = useState(0);

  const idxRef = useRef(0);
  const playingRef = useRef(false);
  const rateRef = useRef(1.0);
  const sleepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const speakFrom = useCallback(
    (i: number) => {
      if (i >= verses.length) {
        playingRef.current = false;
        setPlaying(false);
        return;
      }
      idxRef.current = i;
      setIdx(i);
      Speech.speak(verses[i], {
        language: 'pt-BR',
        rate: rateRef.current,
        onDone: () => {
          if (playingRef.current) speakFrom(idxRef.current + 1);
        },
      });
    },
    [verses],
  );

  const play = useCallback(() => {
    playingRef.current = true;
    setPlaying(true);
    Speech.stop();
    speakFrom(idxRef.current);
  }, [speakFrom]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    Speech.stop();
  }, []);

  // Auto-inicia ao abrir / ao trocar de capítulo
  useEffect(() => {
    idxRef.current = 0;
    setIdx(0);
    const t = setTimeout(() => play(), 350);
    return () => {
      clearTimeout(t);
      playingRef.current = false;
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookIndex, chapterNum, version]);

  function jumpTo(i: number) {
    Speech.stop();
    idxRef.current = i;
    setIdx(i);
    if (playingRef.current) speakFrom(i);
  }

  function changeRate(r: number) {
    rateRef.current = r;
    setRate(r);
    if (playingRef.current) {
      Speech.stop();
      speakFrom(idxRef.current);
    }
  }

  function cycleSleep() {
    const next = SLEEP_OPTIONS[(SLEEP_OPTIONS.indexOf(sleepMin) + 1) % SLEEP_OPTIONS.length];
    setSleepMin(next);
    if (sleepTimer.current) clearInterval(sleepTimer.current);
    if (next > 0) {
      setSleepLeft(next * 60);
      sleepTimer.current = setInterval(() => {
        setSleepLeft((s) => {
          if (s <= 1) {
            pause();
            if (sleepTimer.current) clearInterval(sleepTimer.current);
            setSleepMin(0);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      setSleepLeft(0);
    }
  }

  useEffect(() => () => {
    if (sleepTimer.current) clearInterval(sleepTimer.current);
  }, []);

  function goChapter(pos: { bookIndex: number; chapter: number } | null) {
    if (!pos) return;
    const abbrev = getBook(pos.bookIndex)?.abbrev;
    if (abbrev) router.replace(`/audio/${abbrev}/${pos.chapter}` as never);
  }

  if (!meta) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ink">
        <Text className="text-white/60">Capítulo não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const prev = prevChapter(bookIndex, chapterNum);
  const next = nextChapter(bookIndex, chapterNum);
  const progress = verses.length ? (idx + 1) / verses.length : 0;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-60">
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </Pressable>
        <Text className="text-sm font-semibold text-white/70">Bíblia em Áudio</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerClassName="px-6 pb-10" showsVerticalScrollIndicator={false}>
        {/* Capa */}
        <View className="mb-6 mt-2 items-center">
          <View className="mb-5 h-44 w-44 items-center justify-center rounded-3xl bg-primary">
            <Ionicons name="headset" size={64} color="rgba(255,255,255,0.85)" />
            <Text className="mt-2 font-bold text-white">{version}</Text>
          </View>
          <Text className="text-2xl font-bold text-white">
            {bookName(meta, version)} — Capítulo {chapterNum}
          </Text>
          <Text className="mt-1 text-center text-sm text-white/50">
            {version === 'NVI' ? 'Nova Versão Internacional' : 'Almeida Corrigida Fiel'} · Narração TTS
          </Text>
        </View>

        {/* Progresso */}
        <View className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/15">
          <View className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </View>
        <View className="mb-6 flex-row justify-between">
          <Text className="text-xs text-white/50">
            Versículo {idx + 1}/{verses.length}
          </Text>
          {sleepLeft > 0 && (
            <Text className="text-xs text-gold-light">
              Sleep {Math.floor(sleepLeft / 60)}:{(sleepLeft % 60).toString().padStart(2, '0')}
            </Text>
          )}
        </View>

        {/* Controles principais */}
        <View className="mb-6 flex-row items-center justify-center gap-6">
          <Pressable onPress={() => jumpTo(Math.max(0, idx - 1))} className="active:opacity-60">
            <Ionicons name="play-back" size={30} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => (playing ? pause() : play())}
            className="h-20 w-20 items-center justify-center rounded-full bg-primary active:opacity-80">
            <Ionicons name={playing ? 'pause' : 'play'} size={36} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => jumpTo(Math.min(verses.length - 1, idx + 1))}
            className="active:opacity-60">
            <Ionicons name="play-forward" size={30} color="#fff" />
          </Pressable>
        </View>

        {/* Velocidade + sleep + capítulo */}
        <View className="mb-6 flex-row justify-center gap-3">
          <Pressable
            onPress={() => changeRate(SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length])}
            className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 active:opacity-70">
            <Ionicons name="speedometer" size={16} color="#fff" />
            <Text className="font-semibold text-white">{rate}x</Text>
          </Pressable>
          <Pressable
            onPress={cycleSleep}
            className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 active:opacity-70">
            <Ionicons name="moon" size={16} color={sleepMin > 0 ? BrandColors.gold : '#fff'} />
            <Text className="font-semibold text-white">
              {sleepMin > 0 ? `${sleepMin}min` : 'Sleep'}
            </Text>
          </Pressable>
        </View>

        {/* Navegação de capítulo */}
        <View className="mb-6 flex-row gap-3">
          <Pressable
            onPress={() => goChapter(prev)}
            disabled={!prev}
            className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-3 ${
              prev ? 'bg-white/10 active:opacity-70' : 'bg-white/5'
            }`}>
            <Ionicons name="chevron-back" size={16} color={prev ? '#fff' : 'rgba(255,255,255,0.3)'} />
            <Text className={prev ? 'font-semibold text-white' : 'font-semibold text-white/30'}>
              Cap. anterior
            </Text>
          </Pressable>
          <Pressable
            onPress={() => goChapter(next)}
            disabled={!next}
            className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-3 ${
              next ? 'bg-white/10 active:opacity-70' : 'bg-white/5'
            }`}>
            <Text className={next ? 'font-semibold text-white' : 'font-semibold text-white/30'}>
              Próximo cap.
            </Text>
            <Ionicons name="chevron-forward" size={16} color={next ? '#fff' : 'rgba(255,255,255,0.3)'} />
          </Pressable>
        </View>

        {/* Lista de versículos */}
        <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
          Versículos
        </Text>
        {verses.map((text, i) => {
          const active = i === idx;
          return (
            <Pressable
              key={i}
              onPress={() => jumpTo(i)}
              className={`mb-1 flex-row gap-3 rounded-xl p-3 active:opacity-70 ${
                active ? 'bg-primary/20' : ''
              }`}>
              <Text className={`text-xs font-bold ${active ? 'text-primary' : 'text-white/40'}`}>
                {i + 1}
              </Text>
              <Text
                className={`flex-1 text-sm leading-5 ${active ? 'text-white' : 'text-white/55'}`}
                numberOfLines={2}>
                {text}
              </Text>
              {active && playing && <Ionicons name="volume-high" size={16} color={BrandColors.primary} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
