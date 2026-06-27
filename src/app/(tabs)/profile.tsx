import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useTalentsStore } from '@/store/useTalentsStore';

type Row = { label: string; icon: keyof typeof Ionicons.glyphMap; href?: string };

const SETTINGS: Row[] = [
  { label: 'Planos de leitura', icon: 'calendar', href: '/plan' },
  { label: 'Minhas notas', icon: 'create', href: '/notes' },
  { label: 'Notificações', icon: 'notifications' },
  { label: 'Configurações', icon: 'settings' },
];

const THEME_OPTIONS = [
  { mode: 'light', label: 'Claro', icon: 'sunny' },
  { mode: 'dark', label: 'Escuro', icon: 'moon' },
  { mode: 'system', label: 'Sistema', icon: 'phone-portrait' },
] as const;

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const talents = useTalentsStore((s) => s.balance);
  const { mode, setMode } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Cartão do usuário */}
        <View className="mb-6 items-center rounded-3xl bg-surface p-6">
          <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Ionicons name="person" size={40} color={BrandColors.primary} />
          </View>
          <Text className="text-xl font-bold text-foreground">{user?.name ?? 'Visitante'}</Text>
          <Text className="text-sm text-foreground/50">{user?.email ?? 'Entre para sincronizar'}</Text>

          <View className="mt-4 flex-row items-center gap-2 rounded-full bg-gold/15 px-4 py-2">
            <Ionicons name="diamond" size={16} color={BrandColors.goldDark} />
            <Text className="font-semibold text-gold-dark">{talents} Talentos</Text>
          </View>

          {user ? (
            <Pressable
              onPress={() => logout()}
              className="mt-4 flex-row items-center gap-1.5 active:opacity-60">
              <Ionicons name="log-out-outline" size={16} color={BrandColors.muted} />
              <Text className="text-sm text-foreground/50">Sair</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              className="mt-4 items-center rounded-full bg-primary px-6 py-2.5 active:opacity-80">
              <Text className="font-semibold text-white">Entrar / Criar conta</Text>
            </Pressable>
          )}
        </View>

        {/* Premium */}
        <View className="mb-6 rounded-3xl bg-primary p-6">
          <Text className="mb-1 text-lg font-bold text-white">Verbo Premium</Text>
          <Text className="mb-4 text-sm text-white/70">
            Textos originais, áudio, modo offline, locais históricos e muito mais.
          </Text>
          <Pressable
            onPress={() => router.push('/premium')}
            className="items-center rounded-full bg-gold py-3 active:opacity-80">
            <Text className="font-bold text-foreground">Assinar a partir de $1,49/mês</Text>
          </Pressable>
        </View>

        {/* Ajustes */}
        {/* Aparência */}
        <Text className="mb-2 mt-1 text-xs font-bold uppercase tracking-wider text-foreground/40">
          Aparência
        </Text>
        <View className="mb-4 flex-row gap-1.5 rounded-2xl bg-surface p-1.5">
          {THEME_OPTIONS.map((opt) => {
            const active = mode === opt.mode;
            return (
              <Pressable
                key={opt.mode}
                onPress={() => setMode(opt.mode)}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
                  active ? 'bg-primary' : ''
                }`}>
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={active ? '#fff' : BrandColors.muted}
                />
                <Text
                  className={`text-xs font-semibold ${active ? 'text-white' : 'text-foreground/60'}`}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {SETTINGS.map((r) => (
          <Pressable
            key={r.label}
            onPress={() => r.href && router.push(r.href as never)}
            className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4 active:opacity-70">
            <View className="flex-row items-center gap-3">
              <Ionicons name={r.icon} size={20} color={BrandColors.primary} />
              <Text className="font-medium text-foreground">{r.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
