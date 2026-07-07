import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { askTheologian, isAgentConfigured } from '@/services/theologian';
import {
  FREE_DAILY_LIMIT,
  PREMIUM_DAILY_LIMIT,
  useAgentStore,
} from '@/store/useAgentStore';
import { useAuthStore } from '@/store/useAuthStore';

const SUGGESTIONS = [
  'O que significa "nascer de novo"?',
  'Quem escreveu o livro de Hebreus?',
  'Qual a diferença entre graça e misericórdia?',
];

export default function ProfessorScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const isPremium = user?.isPremium ?? false;
  const limit = isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

  const messages = useAgentStore((s) => s.messages);
  const addMessage = useAgentStore((s) => s.addMessage);
  const registerQuestion = useAgentStore((s) => s.registerQuestion);
  const usedToday = useAgentStore((s) => s.usedToday);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const remaining = Math.max(0, limit - usedToday());
  const limitReached = remaining <= 0;

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages.length, loading]);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading || limitReached) return;

    setInput('');
    // Histórico ANTES de adicionar a pergunta atual (ela vai à parte).
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    addMessage({ role: 'user', text: question });
    setLoading(true);
    try {
      const answer = await askTheologian(question, history);
      addMessage({ role: 'assistant', text: answer });
      registerQuestion(); // só conta pergunta respondida com sucesso
    } catch (err) {
      addMessage({
        role: 'assistant',
        text: `⚠️ ${err instanceof Error ? err.message : 'Algo deu errado. Tente novamente.'}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Professor de Teologia"
        subtitle="Tire suas dúvidas bíblicas"
        onBack={() => router.back()}
        right={
          <View className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <Ionicons name="chatbubbles" size={14} color={BrandColors.gold} />
            <Text className="text-xs font-bold text-gold-light">
              {remaining}/{limit} hoje
            </Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="p-4 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Boas-vindas + sugestões */}
          {messages.length === 0 && (
            <View className="mt-6 items-center px-4">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl bg-primary">
                <Ionicons name="school" size={32} color="#fff" />
              </View>
              <Text className="mb-1 text-lg font-bold text-foreground">
                Olá! Sou seu professor de teologia.
              </Text>
              <Text className="mb-6 text-center text-sm text-foreground/50">
                Pergunte sobre a Bíblia, história, doutrinas ou vida cristã. Respondo com base
                nas Escrituras, citando as referências.
              </Text>
              {SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => send(s)}
                  disabled={limitReached || loading}
                  className="mb-2 w-full rounded-2xl border border-primary/25 bg-primary/5 p-3.5 active:opacity-70">
                  <Text className="text-sm font-medium text-primary">{s}</Text>
                </Pressable>
              ))}
              {!isAgentConfigured && (
                <Text className="mt-4 text-center text-xs text-gold-dark">
                  IA ainda não configurada — adicione a chave no .env (ver SETUP.md).
                </Text>
              )}
            </View>
          )}

          {/* Conversa */}
          {messages.map((m) => (
            <View
              key={m.id}
              className={`mb-3 max-w-[85%] rounded-2xl p-3.5 ${
                m.role === 'user'
                  ? 'self-end rounded-br-md bg-primary'
                  : 'self-start rounded-bl-md bg-surface'
              }`}>
              <Text
                className={`text-[15px] leading-6 ${
                  m.role === 'user' ? 'text-white' : 'text-foreground'
                }`}>
                {m.text}
              </Text>
            </View>
          ))}

          {loading && (
            <View className="mb-3 flex-row items-center gap-2 self-start rounded-2xl rounded-bl-md bg-surface p-3.5">
              <ActivityIndicator size="small" color={BrandColors.primary} />
              <Text className="text-sm text-foreground/50">O professor está escrevendo…</Text>
            </View>
          )}

          {/* Limite atingido */}
          {limitReached && (
            <View className="mt-2 rounded-3xl border border-gold/40 bg-gold/10 p-5">
              <View className="mb-1 flex-row items-center gap-2">
                <Ionicons name="hourglass" size={18} color={BrandColors.goldDark} />
                <Text className="font-bold text-foreground">
                  Suas perguntas de hoje acabaram
                </Text>
              </View>
              <Text className="mb-4 text-sm text-foreground/60">
                {isPremium
                  ? `Você usou as ${limit} perguntas de hoje. Volte amanhã!`
                  : `O plano gratuito inclui ${FREE_DAILY_LIMIT} perguntas por dia. Assine o Premium e faça até ${PREMIUM_DAILY_LIMIT} perguntas diárias.`}
              </Text>
              {!isPremium && (
                <Pressable
                  onPress={() => router.push('/premium' as never)}
                  className="items-center rounded-full bg-gold py-3 active:opacity-80">
                  <Text className="font-bold text-ink">Assinar Premium</Text>
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>

        {/* Barra de entrada */}
        <View className="flex-row items-end gap-2 border-t border-foreground/10 bg-background px-4 py-3 pb-6">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={limitReached ? 'Limite diário atingido' : 'Escreva sua dúvida…'}
            placeholderTextColor={colors.muted}
            editable={!limitReached && !loading}
            multiline
            className="max-h-28 flex-1 rounded-2xl bg-surface px-4 py-3 text-[15px] text-foreground"
          />
          <Pressable
            onPress={() => send()}
            disabled={!input.trim() || loading || limitReached}
            className={`h-11 w-11 items-center justify-center rounded-full ${
              input.trim() && !loading && !limitReached ? 'bg-primary active:opacity-80' : 'bg-foreground/10'
            }`}>
            <Ionicons
              name="arrow-up"
              size={20}
              color={input.trim() && !loading && !limitReached ? '#fff' : colors.muted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
