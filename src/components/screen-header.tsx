import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Header escuro padrão (faixa ink no topo, sob a status bar) — identidade
 * visual do app. Usado no topo de todas as telas principais.
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 10 }} className="bg-ink px-5 pb-4">
      <StatusBar style="light" />
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          {onBack && (
            <Pressable onPress={onBack} hitSlop={8} className="-ml-1 mr-1 active:opacity-60">
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          )}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && <Text className="text-sm text-white/55">{subtitle}</Text>}
          </View>
        </View>
        {right}
      </View>
    </View>
  );
}
