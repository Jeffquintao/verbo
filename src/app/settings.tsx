import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/useAuthStore';
import {
  FONT_SCALES,
  LINE_SPACINGS,
  useSettingsStore,
  useVerseStyle,
  type FontScale,
  type LineSpacing,
} from '@/store/useSettingsStore';

export default function SettingsScreen() {
  const t = useTranslation();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);

  const s = useSettingsStore();
  const verseStyle = useVerseStyle();

  // Rascunho local: gravar a cada tecla faria o AsyncStorage escrever sem parar.
  const [name, setName] = useState(s.displayName ?? user?.name ?? '');

  const SPACING_LABELS: Record<LineSpacing, string> = {
    compact: t.settings.spacingCompact,
    normal: t.settings.spacingNormal,
    relaxed: t.settings.spacingRelaxed,
  };

  function confirmReset() {
    Alert.alert(t.settings.resetTitle, t.settings.resetConfirm, [
      { text: t.settings.cancel, style: 'cancel' },
      {
        text: t.settings.reset,
        style: 'destructive',
        onPress: () => {
          s.reset();
          setName('');
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={t.settings.title} onBack={() => router.back()} />

      <ScrollView contentContainerClassName="p-5 pb-12" showsVerticalScrollIndicator={false}>
        {/* Conta */}
        <Section label={t.settings.accountSection} />
        <View className="mb-2 rounded-2xl bg-surface p-4">
          <Text className="mb-2 text-xs font-semibold text-foreground/50">
            {t.settings.yourName}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={() => s.setDisplayName(name)}
            onSubmitEditing={() => s.setDisplayName(name)}
            placeholder={t.settings.namePlaceholder}
            placeholderTextColor={colors.muted}
            returnKeyType="done"
            maxLength={40}
            className="rounded-xl bg-background px-4 py-3 text-base text-foreground"
          />
        </View>
        <Hint text={t.settings.nameHint} />

        {/* Leitura */}
        <Section label={t.settings.readingSection} />

        <View className="mb-3 rounded-2xl bg-surface p-4">
          <Text className="mb-3 text-sm font-semibold text-foreground">{t.settings.fontSize}</Text>
          <View className="flex-row gap-2">
            {FONT_SCALES.map((scale, i) => {
              const active = s.fontScale === scale;
              return (
                <Pressable
                  key={scale}
                  onPress={() => s.setFontScale(scale as FontScale)}
                  className={`flex-1 items-center justify-center rounded-xl py-3 ${
                    active ? 'bg-primary' : 'bg-background'
                  }`}>
                  <Text
                    style={{ fontSize: 12 + i * 3 }}
                    className={active ? 'font-bold text-white' : 'text-foreground/60'}>
                    A
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-3 rounded-2xl bg-surface p-4">
          <Text className="mb-3 text-sm font-semibold text-foreground">
            {t.settings.lineSpacing}
          </Text>
          <View className="flex-row gap-2">
            {(Object.keys(LINE_SPACINGS) as LineSpacing[]).map((key) => {
              const active = s.lineSpacing === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => s.setLineSpacing(key)}
                  className={`flex-1 items-center rounded-xl py-2.5 ${
                    active ? 'bg-primary' : 'bg-background'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${active ? 'text-white' : 'text-foreground/60'}`}>
                    {SPACING_LABELS[key]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <ToggleRow
          icon="text"
          label={t.settings.serif}
          hint={t.settings.serifHint}
          value={s.serif}
          onChange={() => s.toggle('serif')}
        />

        {/* Prévia ao vivo — o ajuste só faz sentido se der para ver o efeito. */}
        <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-foreground/40">
          {t.settings.preview}
        </Text>
        <View className="mb-2 rounded-2xl bg-surface p-4">
          <Text style={verseStyle.verse} className="text-foreground">
            <Text style={verseStyle.number} className="font-bold text-primary">
              16{' '}
            </Text>
            {t.settings.previewVerse}
          </Text>
          <Text className="mt-2 text-xs text-foreground/40">{t.settings.previewRef}</Text>
        </View>

        {/* Acessibilidade */}
        <Section label={t.settings.accessibilitySection} />
        <ToggleRow
          icon="contrast"
          label={t.settings.boldText}
          hint={t.settings.boldTextHint}
          value={s.boldText}
          onChange={() => s.toggle('boldText')}
        />
        <ToggleRow
          icon="sunny"
          label={t.settings.keepAwake}
          hint={t.settings.keepAwakeHint}
          value={s.keepAwake}
          onChange={() => s.toggle('keepAwake')}
        />
        <ToggleRow
          icon="accessibility"
          label={t.settings.reduceMotion}
          hint={t.settings.reduceMotionHint}
          value={s.reduceMotion}
          onChange={() => s.toggle('reduceMotion')}
        />

        {/* Sobre */}
        <Section label={t.settings.aboutSection} />
        <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-4">
          <Text className="text-foreground">{t.settings.version}</Text>
          <Text className="text-foreground/50">
            {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </View>

        <Pressable
          onPress={confirmReset}
          className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl border border-border/20 py-3.5 active:opacity-70">
          <Ionicons name="refresh" size={17} color={BrandColors.muted} />
          <Text className="font-semibold text-foreground/60">{t.settings.resetTitle}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Section({ label }: { label: string }) {
  return (
    <Text className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-foreground/40">
      {label}
    </Text>
  );
}

function Hint({ text }: { text: string }) {
  return <Text className="mb-1 px-1 text-xs leading-4 text-foreground/40">{text}</Text>;
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <Pressable
      onPress={onChange}
      className="mb-2 flex-row items-center gap-3 rounded-2xl bg-surface p-4 active:opacity-80">
      <Ionicons name={icon} size={20} color={BrandColors.primary} />
      <View className="flex-1">
        <Text className="font-medium text-foreground">{label}</Text>
        <Text className="mt-0.5 text-xs leading-4 text-foreground/40">{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: BrandColors.primary }}
      />
    </Pressable>
  );
}
