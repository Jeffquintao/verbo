import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { BrandColors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BrandColors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: 'Bíblia',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="run"
        options={{
          title: 'Correr',
          tabBarIcon: ({ color, size }) => <Ionicons name="walk" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="midia"
        options={{
          title: 'Mídia',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
