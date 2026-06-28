import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { BrandColors } from '@/constants/colors';
import { themeVars } from '@/constants/themes';
import { useTheme } from '@/hooks/use-theme';
import { getPortugueseVoices, type TtsVoice, VOICE_SAMPLE, voiceLabel } from '@/services/tts';
import { useAudioSettings } from '@/store/useAudioSettings';

export function VoicePicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { scheme, colors } = useTheme();
  const voiceId = useAudioSettings((s) => s.voiceId);
  const pitch = useAudioSettings((s) => s.pitch);
  const setVoice = useAudioSettings((s) => s.setVoice);
  const [voices, setVoices] = useState<TtsVoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getPortugueseVoices().then((v) => {
      setVoices(v);
      setLoading(false);
    });
  }, [visible]);

  function preview(id: string) {
    Speech.stop();
    Speech.speak(VOICE_SAMPLE, { voice: id, language: 'pt-BR', pitch, rate: 1.0 });
  }

  function choose(id: string) {
    setVoice(id);
    preview(id);
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
          <Text className="mb-1 text-lg font-bold text-foreground">Escolher voz</Text>
          <Text className="mb-4 text-xs text-foreground/50">
            Toque para ouvir e selecionar. Vozes “Premium” soam mais naturais.
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.foreground} style={{ marginVertical: 32 }} />
          ) : voices.length === 0 ? (
            <Text className="my-8 text-center text-foreground/50">
              Nenhuma voz em português encontrada no aparelho. Você pode instalar vozes nas
              configurações do sistema (Acessibilidade › Conteúdo falado).
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
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
