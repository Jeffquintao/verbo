import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { themeVars } from '@/constants/themes';
import { useAuthInit } from '@/hooks/use-auth-init';
import { useTheme } from '@/hooks/use-theme';

export default function RootLayout() {
  const { scheme } = useTheme();
  useAuthInit();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[{ flex: 1 }, themeVars[scheme]]}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </View>
    </GestureHandlerRootView>
  );
}
