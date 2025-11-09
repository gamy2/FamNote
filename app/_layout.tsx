import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import "../i18n";



export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", headerShown :false }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
