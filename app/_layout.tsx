import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Login' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="classroom-detail" options={{ title: 'Details' }} />
            <Stack.Screen name="join-classroom" options={{ title: 'Join Class' }} />
            <Stack.Screen name="live-quiz" options={{ title: 'Live Quiz' }} />
            <Stack.Screen name="quiz-session" options={{ title: 'Quiz Session', presentation: 'fullScreenModal' }} />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}