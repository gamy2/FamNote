import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { i18nLoaded } from "../i18n";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Suppress SafeAreaView deprecation warning from third-party libraries (react-native-paper)
// The library will update in future versions to use react-native-safe-area-context
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { loading: authLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for i18n to initialize with a timeout
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('i18n timeout')), 4000));
        await Promise.race([i18nLoaded, timeout]);
      } catch (e) {
        console.warn('Initialization error or timeout:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#0F9E99" />
      </View>
    );
  }

  return (
    <NotesProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", headerShown :false }}
        />
      </Stack>
      <StatusBar style="dark" />
    </NotesProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
