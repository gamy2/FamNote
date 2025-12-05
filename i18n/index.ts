    // src/i18n/index.ts
    import AsyncStorage from "@react-native-async-storage/async-storage"; // If using AsyncStorage
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

    // Import your translation files
    import translationAr from "./translations/ar.json";
import translationEn from "./translations/en.json";

    const resources = {
      "en-US": { translation: translationEn },
      "ar-EG": { translation: translationAr },
      // Add other languages as needed
    };

    const initI18n = async () => {
      let savedLanguage = await AsyncStorage.getItem("language");
      const deviceLocale = Localization.getLocales()[0]?.languageTag;
      const initialLanguage = savedLanguage || (deviceLocale && resources[deviceLocale as keyof typeof resources] ? deviceLocale : "en-US");

      await i18n
        .use(initReactI18next)
        .init({
          resources,
          lng: initialLanguage,
          fallbackLng: "en-US",
          interpolation: {
            escapeValue: false,
          },
        });
    };

    export const i18nLoaded = initI18n();

    export default i18n;