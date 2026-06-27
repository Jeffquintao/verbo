import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { BrandColors } from '@/constants/colors';

/** Selo Premium dourado (escopo: recursos exclusivos de assinante). */
export function PremiumBadge() {
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1">
      <Ionicons name="diamond" size={12} color={BrandColors.goldDark} />
      <Text className="text-xs font-bold text-gold-dark">Premium</Text>
    </View>
  );
}
