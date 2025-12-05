import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";
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
        // Wait for i18n to initialize
        await i18nLoaded;
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, authLoading]);

  if (!appIsReady || authLoading) {
    return null;
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
