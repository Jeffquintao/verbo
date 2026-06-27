import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { signInWithGoogle } from '@/services/auth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

  async function handleGoogle() {
    setLoading('google');
    try {
      await signInWithGoogle();
      router.back();
    } catch (err) {
      Alert.alert('Login com Google', err instanceof Error ? err.message : 'Falha no login.');
    } finally {
      setLoading(null);
    }
  }

  function handleApple() {
    Alert.alert('Em breve', 'O login com Apple será habilitado em breve.');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        {/* Fechar */}
        <Pressable
          onPress={() => router.back()}
          className="absolute right-6 top-2 h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-70">
          <Ionicons name="close" size={22} color={colors.foreground} />
        </Pressable>

        {/* Marca */}
        <View className="mb-10 items-center">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="book" size={32} color="#fff" />
          </View>
          <Text className="text-3xl font-bold text-foreground">Verbo</Text>
          <Text className="text-sm text-foreground/50">Entre para começar</Text>
        </View>

        {/* Google (principal) */}
        <Pressable
          onPress={handleGoogle}
          disabled={loading !== null}
          className="mb-3 h-14 flex-row items-center justify-center gap-3 rounded-full border border-border/10 bg-surface active:opacity-70">
          {loading === 'google' ? (
            <ActivityIndicator color={colors.foreground} />
          ) : (
            <>
              <Ionicons name="logo-google" size={22} color="#EA4335" />
              <Text className="text-base font-semibold text-foreground">Continuar com Google</Text>
            </>
          )}
        </Pressable>

        {/* Apple (em breve) */}
        <Pressable
          onPress={handleApple}
          disabled={loading !== null}
          className="mb-6 h-14 flex-row items-center justify-center gap-3 rounded-full bg-black active:opacity-80">
          <Ionicons name="logo-apple" size={22} color="#fff" />
          <Text className="text-base font-semibold text-white">Continuar com Apple</Text>
        </Pressable>

        {/* Visitante */}
        <Pressable onPress={() => router.back()} className="items-center py-2">
          <Text className="text-sm text-foreground/50">Continuar como visitante</Text>
        </Pressable>

        <Text className="mt-8 px-4 text-center text-xs text-foreground/30">
          Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade do Verbo.
        </Text>
      </View>
    </SafeAreaView>
  );
}
