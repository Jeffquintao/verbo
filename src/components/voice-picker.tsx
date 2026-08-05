import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { BrandColors } from '@/constants/colors';
import { themeVars } from '@/constants/themes';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import {
  getVoicesForLocale,
  isNaturalVoice,
  speechLanguage,
  type TtsVoice,
  voiceLabel,
  voiceSample,
} from '@/services/tts';
import { useAudioSettings } from '@/store/useAudioSettings';
import { useLocaleStore } from '@/store/useLocaleStore';

const PITCH_PRESETS = [
  { labelKey: 'toneLow' as const, value: 0.85 },
  { labelKey: 'toneNatural' as const, value: 0.95 },
  { labelKey: 'toneMid' as const, value: 1.0 },
  { labelKey: 'toneHigh' as const, value: 1.1 },
];

export function VoicePicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { scheme, colors } = useTheme();
  const t = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const voiceId = useAudioSettings((s) => s.voiceId);
  const pitch = useAudioSettings((s) => s.pitch);
  const setVoice = useAudioSettings((s) => s.setVoice);
  const setPitch = useAudioSettings((s) => s.setPitch);
  const [voices, setVoices] = useState<TtsVoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getVoicesForLocale(locale).then((v) => {
      setVoices(v);
      setLoading(false);
    });
  }, [visible, locale]);

  function preview(voice: string | null, p: number) {
    Speech.stop();
    Speech.speak(voiceSample(locale), {
      voice: voice ?? undefined,
      language: speechLanguage(locale),
      pitch: p,
      rate: 1.0,
    });
  }

  function choose(id: string) {
    setVoice(id);
    preview(id, pitch);
  }

  function choosePitch(p: number) {
    setPitch(p);
    preview(voiceId, p);
  }

  function close() {
    Speech.stop();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={themeVars[scheme]} className="flex-1 justify-end bg-black/40" onPress={close}>
        <Pressable
          className="max-h-[72%] rounded-t-3xl bg-background p-5 pb-8"
          onPress={(e) => e.stopPropagation()}>
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-foreground/15" />
          <Text className="mb-1 text-lg font-bold text-foreground">{t.audio.voicePickerTitle}</Text>
          <Text className="mb-4 text-xs text-foreground/50">
            {t.audio.voicePickerHint}
          </Text>

          {/* Tom da voz */}
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground/40">
            {t.audio.voiceTone}
          </Text>
          <View className="mb-4 flex-row gap-2">
            {PITCH_PRESETS.map((pp) => {
              const active = Math.abs(pitch - pp.value) < 0.001;
              return (
                <Pressable
                  key={pp.labelKey}
                  onPress={() => choosePitch(pp.value)}
                  className={`flex-1 items-center rounded-xl py-2.5 ${
                    active ? 'bg-primary' : 'bg-surface'
                  }`}>
                  <Text className={active ? 'font-semibold text-white' : 'text-foreground/60'}>
                    {t.audio[pp.labelKey]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground/40">
            {t.audio.availableVoices}
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.foreground} style={{ marginVertical: 32 }} />
          ) : voices.length === 0 ? (
            <Text className="my-8 text-center text-foreground/50">
              {t.audio.noVoices}
            </Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {voices.map((v) => {
                const active = v.identifier === voiceId;
                return (
                  <Pressable
                    key={v.identifier}
                    onPress={() => choose(v.identifier)}
                    className={`mb-2 flex-row items-center justify-between rounded-2xl border p-4 ${
                      active ? 'border-primary bg-primary/10' : 'border-border/10 bg-surface'
                    }`}>
                    <View className="flex-1 flex-row items-center gap-3">
                      <Ionicons
                        name={active ? 'volume-high' : 'play-circle-outline'}
                        size={22}
                        color={active ? BrandColors.primary : colors.muted}
                      />
                      <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>
                        {voiceLabel(v)}
                      </Text>
                    </View>
                    {active && (
                      <Ionicons name="checkmark-circle" size={20} color={BrandColors.primary} />
                    )}
                  </Pressable>
                );
              })}

              {/* Só aparece se o aparelho não tiver nenhuma voz boa — quem já
                  tem não precisa da instrução. */}
              {!voices.some(isNaturalVoice) && (
                <Text className="mb-2 mt-1 text-xs leading-4 text-foreground/40">
                  {t.audio.voiceHdTip}
                </Text>
              )}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
