import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { pickQuizQuestions } from '@/constants/quiz';
import { useTheme } from '@/hooks/use-theme';
import { useTalentsStore } from '@/store/useTalentsStore';

const QUESTION_TIME = 30; // segundos
const FAST_THRESHOLD = 10; // responder em < 10s vale mais

export default function QuizPlayScreen() {
  const { colors } = useTheme();
  const [questions] = useState(() => pickQuizQuestions(10));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [talents, setTalents] = useState(0);
  const [combo, setCombo] = useState(0);
  const [done, setDone] = useState(false);

  const earn = useTalentsStore((s) => s.earn);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleAnswer = useCallback(
    (optionIdx: number) => {
      setAnswered((alreadyAnswered) => {
        if (alreadyAnswered) return true;
        setSelected(optionIdx);

        const isCorrect = optionIdx === question.answer;
        if (isCorrect) {
          const fast = timeLeft > QUESTION_TIME - FAST_THRESHOLD;
          const base = fast ? 15 : 10;
          setCombo((c) => {
            const newCombo = c + 1;
            const comboBonus = newCombo >= 3 ? 30 : newCombo === 2 ? 20 : 0;
            setPoints((p) => p + base + comboBonus);
            return newCombo;
          });
          setCorrect((c) => c + 1);
          setTalents((t) => t + (fast ? 15 : 10));
        } else {
          setCombo(0);
        }

        advanceTimer.current = setTimeout(() => {
          if (isLast) {
            setPoints((p) => p + 50); // bônus por completar
            setDone(true);
          } else {
            setIndex((i) => i + 1);
            setSelected(null);
            setAnswered(false);
            setTimeLeft(QUESTION_TIME);
          }
        }, 1300);

        return true;
      });
    },
    [question, timeLeft, isLast],
  );

  // Timer da pergunta
  useEffect(() => {
    if (answered || done) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // tempo esgotado = erra
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered, done, handleAnswer]);

  // Cleanup do timer de avanço
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // Credita Talentos uma vez ao concluir
  useEffect(() => {
    if (done && talents > 0) earn(talents, 'Quiz diário');
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (done) {
    return <QuizResult correct={correct} total={questions.length} points={points} talents={talents} />;
  }

  function optionStyle(i: number): string {
    if (!answered) return 'bg-surface';
    if (i === question.answer) return 'bg-green-500';
    if (i === selected) return 'bg-red-500';
    return 'bg-surface opacity-50';
  }

  function optionTextStyle(i: number): string {
    if (!answered) return 'text-foreground';
    if (i === question.answer || i === selected) return 'text-white';
    return 'text-foreground';
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Topo: sair + progresso + timer */}
      <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center active:opacity-60">
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="font-semibold text-foreground">
          {index + 1} / {questions.length}
        </Text>
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            timeLeft <= 5 ? 'bg-red-500' : 'bg-primary'
          }`}>
          <Text className="font-bold text-white">{timeLeft}</Text>
        </View>
      </View>

      {/* Barra de progresso */}
      <View className="mx-5 mb-6 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </View>

      {/* Pergunta */}
      <View className="flex-1 px-5">
        <View className="mb-6 rounded-3xl bg-primary p-6">
          <Text className="text-xl font-bold leading-7 text-white">{question.question}</Text>
          {question.reference && (
            <Text className="mt-2 text-sm text-gold-light">{question.reference}</Text>
          )}
        </View>

        {question.options.map((opt, i) => (
          <Pressable
            key={i}
            disabled={answered}
            onPress={() => handleAnswer(i)}
            className={`mb-3 flex-row items-center justify-between rounded-2xl p-4 ${optionStyle(i)}`}>
            <Text className={`flex-1 text-base font-medium ${optionTextStyle(i)}`}>{opt}</Text>
            {answered && i === question.answer && (
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
            )}
            {answered && i === selected && i !== question.answer && (
              <Ionicons name="close-circle" size={22} color="#fff" />
            )}
          </Pressable>
        ))}
      </View>

      {/* Rodapé: pontos + combo */}
      <View className="flex-row items-center justify-between px-5 pb-4">
        <Text className="font-semibold text-foreground/60">{points} pts</Text>
        {combo >= 2 && <Text className="font-bold text-gold-dark">🔥 Combo x{combo}</Text>}
      </View>
    </SafeAreaView>
  );
}

function QuizResult({
  correct,
  total,
  points,
  talents,
}: {
  correct: number;
  total: number;
  points: number;
  talents: number;
}) {
  const pct = Math.round((correct / total) * 100);
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary">
          <Ionicons name="trophy" size={48} color={BrandColors.gold} />
        </View>
        <Text className="text-3xl font-bold text-foreground">{pct}%</Text>
        <Text className="mb-6 text-foreground/60">
          Você acertou {correct} de {total}
        </Text>

        <View className="mb-8 w-full flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl bg-surface p-4">
            <Text className="text-2xl font-bold text-primary">{points}</Text>
            <Text className="text-xs text-foreground/50">pontos</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-surface p-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="diamond" size={18} color={BrandColors.goldDark} />
              <Text className="text-2xl font-bold text-gold-dark">+{talents}</Text>
            </View>
            <Text className="text-xs text-foreground/50">Talentos</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.replace('/quiz/play' as never)}
          className="mb-3 w-full items-center rounded-full bg-primary py-4 active:opacity-80">
          <Text className="text-base font-bold text-white">Jogar de novo</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="w-full items-center py-3">
          <Text className="font-semibold text-foreground/60">Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
