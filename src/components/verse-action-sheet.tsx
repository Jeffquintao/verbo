import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

import { BrandColors } from '@/constants/colors';
import { themeVars } from '@/constants/themes';
import { useTheme } from '@/hooks/use-theme';
import { HIGHLIGHT_COLORS, useLibraryStore, verseKey } from '@/store/useLibraryStore';

type Props = {
  bookIndex: number;
  chapter: number;
  verse: number | null; // 1-based; null = fechado
  reference: string; // ex.: "João 3:16"
  onClose: () => void;
};

export function VerseActionSheet({ bookIndex, chapter, verse, reference, onClose }: Props) {
  const toggleHighlight = useLibraryStore((s) => s.toggleHighlight);
  const addNote = useLibraryStore((s) => s.addNote);
  const highlights = useLibraryStore((s) => s.highlights);
  const { scheme } = useTheme();
  const [noteText, setNoteText] = useState('');
  const [noteMode, setNoteMode] = useState(false);

  const open = verse !== null;
  const key = verse !== null ? verseKey(bookIndex, chapter, verse) : '';
  const currentHex = highlights[key];

  function close() {
    setNoteText('');
    setNoteMode(false);
    onClose();
  }

  function saveNote() {
    if (verse === null || !noteText.trim()) return;
    addNote({ bookIndex, chapter, verse, text: noteText.trim() });
    close();
  }

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={themeVars[scheme]} className="flex-1 justify-end bg-black/40" onPress={close}>
        <Pressable className="rounded-t-3xl bg-background p-5 pb-8" onPress={(e) => e.stopPropagation()}>
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-ink/15" />
          <Text className="mb-4 text-center text-sm font-bold text-primary">{reference}</Text>

          {/* Cores de marcação */}
          <View className="mb-5 flex-row items-center justify-center gap-3">
            {HIGHLIGHT_COLORS.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  toggleHighlight(key, c.hex);
                  close();
                }}
                style={{ backgroundColor: c.hex }}
                className="h-10 w-10 items-center justify-center rounded-full active:opacity-70">
                {currentHex === c.hex && <Ionicons name="checkmark" size={20} color="#fff" />}
              </Pressable>
            ))}
          </View>

          {noteMode ? (
            <View>
              <TextInput
                autoFocus
                multiline
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Escreva sua nota…"
                placeholderTextColor={BrandColors.muted}
                className="min-h-24 rounded-2xl bg-surface p-4 text-base text-foreground"
                textAlignVertical="top"
              />
              <Pressable
                onPress={saveNote}
                className="mt-3 items-center rounded-full bg-primary py-3.5 active:opacity-80">
                <Text className="font-bold text-white">Salvar nota</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row gap-3">
              <ActionButton
                icon="create-outline"
                label="Adicionar nota"
                onPress={() => setNoteMode(true)}
              />
              <ActionButton icon="close-outline" label="Fechar" onPress={close} />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-surface py-3.5 active:opacity-70">
      <Ionicons name={icon} size={18} color={colors.foreground} />
      <Text className="font-semibold text-foreground">{label}</Text>
    </Pressable>
  );
}
