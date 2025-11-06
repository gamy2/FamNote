import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAppLanguage = async (languageCode: "en-US" | "ar-EG") => {
    await AsyncStorage.setItem("language", languageCode);
    await i18n.changeLanguage(languageCode);
  };
