import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { LOCALES, useLocaleStore } from '@/store/useLocaleStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { useDisplayName } from '@/store/useSettingsStore';
import { useTalentsStore } from '@/store/useTalentsStore';

const THEME_OPTIONS = [
  { mode: 'light', labelKey: 'light', icon: 'sunny' },
  { mode: 'dark', labelKey: 'dark', icon: 'moon' },
  { mode: 'system', labelKey: 'system', icon: 'phone-portrait' },
] as const;

export default function ProfileScreen() {
  const t = useTranslation();
  const user = useAuthStore((s) => s.user);
  const talents = useTalentsStore((s) => s.balance);
  const { mode, setMode } = useTheme();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const since = usePremiumStore((s) => s.since);
  const displayName = useDisplayName(user?.name, t.common.guest);

  const settings = [
    { label: t.profile.readingPlans, icon: 'calendar' as const, href: '/plan' },
    { label: t.profile.myNotes, icon: 'create' as const, href: '/notes' },
    { label: t.profile.notifications, icon: 'notifications' as const },
    { label: t.profile.settings, icon: 'settings' as const, href: '/settings' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Cartão do usuário */}
        <View className="mb-6 items-center rounded-3xl bg-surface p-6">
          <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Ionicons name="person" size={40} color={BrandColors.primary} />
          </View>
          <Text className="text-xl font-bold text-foreground">{displayName}</Text>
          <Text className="text-sm text-foreground/50">
            {user?.email ?? t.profile.signInPrompt}
          </Text>

          <View className="mt-4 flex-row items-center gap-2 rounded-full bg-gold/15 px-4 py-2">
            <Ionicons name="diamond" size={16} color={BrandColors.goldDark} />
            <Text className="font-semibold text-gold-dark">
              {talents} {t.common.talents}
            </Text>
          </View>

          {user ? (
            <Pressable
              onPress={() => logout()}
              className="mt-4 flex-row items-center gap-1.5 active:opacity-60">
              <Ionicons name="log-out-outline" size={16} color={BrandColors.muted} />
              <Text className="text-sm text-foreground/50">{t.profile.signOut}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              className="mt-4 items-center rounded-full bg-primary px-6 py-2.5 active:opacity-80">
              <Text className="font-semibold text-white">{t.profile.signIn}</Text>
            </Pressable>
          )}
        </View>

        {/* Premium — vira painel do assinante depois da compra. */}
        <View className="mb-6 rounded-3xl bg-primary p-6">
          {isPremium ? (
            <>
              <View className="mb-1 flex-row items-center gap-2">
                <Ionicons name="diamond" size={18} color={BrandColors.gold} />
                <Text className="text-lg font-bold text-white">{t.premium.active}</Text>
              </View>
              {since && (
                <Text className="mb-4 text-sm text-white/70">
                  {t.premium.activeSince(new Date(since).toLocaleDateString())}
                </Text>
              )}
              <Pressable
                onPress={() => router.push('/premium')}
                className="items-center rounded-full bg-white/15 py-3 active:opacity-80">
                <Text className="font-bold text-white">{t.premium.manage}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="mb-1 text-lg font-bold text-white">{t.profile.premiumTitle}</Text>
              <Text className="mb-4 text-sm text-white/70">{t.profile.premiumBody}</Text>
              <Pressable
                onPress={() => router.push('/premium')}
                className="items-center rounded-full bg-gold py-3 active:opacity-80">
                <Text className="font-bold text-ink">{t.profile.premiumCta}</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Idioma */}
        <Text className="mb-2 mt-1 text-xs font-bold uppercase tracking-wider text-foreground/40">
          {t.profile.language}
        </Text>
        <View className="mb-4 flex-row gap-1.5 rounded-2xl bg-surface p-1.5">
          {LOCALES.map((opt) => {
            const active = locale === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setLocale(opt.id)}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
                  active ? 'bg-primary' : ''
                }`}>
                <Text className="text-sm">{opt.flag}</Text>
                <Text
                  className={`text-xs font-semibold ${active ? 'text-white' : 'text-foreground/60'}`}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Aparência */}
        <Text className="mb-2 mt-1 text-xs font-bold uppercase tracking-wider text-foreground/40">
          {t.profile.appearance}
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
                <Ionicons name={opt.icon} size={16} color={active ? '#fff' : BrandColors.muted} />
                <Text
                  className={`text-xs font-semibold ${active ? 'text-white' : 'text-foreground/60'}`}>
                  {t.profile[opt.labelKey]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {settings.map((r) => (
          <Pressable
            key={r.label}
            onPress={() => 'href' in r && r.href && router.push(r.href as never)}
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
