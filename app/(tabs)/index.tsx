
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { t } = useTranslation();
  return (
  <SafeAreaView className="flex-1 p-4 bg-background dark:bg-background-dark">
    <ThemedView>
    <ThemedText type={"title"}>{t("welcome")}</ThemedText>
    <ThemedText className="mt-2 text-muted dark:text-muted-dark">Tailwind themed text</ThemedText>
    </ThemedView>
  </SafeAreaView>
  );
}
