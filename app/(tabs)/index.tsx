import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { categories, emojis } from "@/constants/categories";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView className="relative flex-1">
      <FamNoteHeader />
      <ScrollView
        className="flex-1 p-8 bg-backgroundV2"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView className="gap-5 mb-14">
          {[...Array(8)].map((_, i) => {
            const category = categories[i % categories.length];
            const emoji = emojis[i % emojis.length];
            return (
              <View
                key={i}
                className="gap-2 p-5 rounded-3xl shadow-primary"
                style={{ backgroundColor: category.bgColor }}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-2 items-center">
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        borderWidth: 3,
                        borderColor: "#fff", // Added border color for visibility
                      }}
                      source={{
                        uri: "https://blog.logrocket.com/wp-content/uploads/2024/01/react-native-navigation-tutorial.png",
                      }}
                    />
                    <View>
                      <ThemedText 
                        type="subtitle" 
                        className="font-medium"
                        style={{ color: category.textColor }}
                      >
                        Dad
                      </ThemedText>
                      <ThemedText className="text-sm opacity-60 text-muted">
                        2 hours ago
                      </ThemedText>
                    </View>
                  </View>
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: category.textColor + '20' }}>
                    <ThemedText 
                      className="text-xs font-medium"
                      style={{ color: category.textColor }}
                    >
                      {category.label}
                    </ThemedText>
                  </View>
                </View>
                <View className="flex-row gap-2 items-center py-1" style={{ overflow: 'visible' }}>
                  <ThemedText style={{ fontSize: 32, lineHeight: 32  }}>{emoji}</ThemedText>
                </View>
                <ThemedText className="text-base text-text">
                  Sharing moments together Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Provident, ad? Quisquam assumenda facilis
                  deleniti voluptas optio repellendus et eligendi ullam provident
                  explicabo aperiam cupiditate maxime maiores, ut itaque.
                  Delectus, architecto?
                </ThemedText>
              </View>
            );
          })}
        </ThemedView>
      </ScrollView>
      <TouchableOpacity 
        className="absolute right-4 bottom-4 p-4 rounded-full bg-primary"
        onPress={() => router.push("/modal")}
      >
        <AntDesign name="plus" size={18} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const FamNoteHeader = () => {
  return (
    <ThemedView className="pt-8 pb-2 bg-white">
      <ThemedView className="flex-row justify-between items-start px-5 bg-transparent">
        <ThemedView>
          <ThemedText type="subtitle" className="font-medium">
            FamNote
          </ThemedText>
          <ThemedText className="text-sm text-muted">
            Sharing moments together
          </ThemedText>
        </ThemedView>
        <Pressable
          onPress={() => router.push("/modal")}
          className="flex-row gap-3 items-center p-2 px-4 rounded-full bg-primary"
        >
          <AntDesign name="plus" size={14} color="white" />
          <ThemedText className="text-white">Add Note</ThemedText>
        </Pressable>
      </ThemedView>
      <ScrollView
        horizontal
        className="mt-2"
        showsHorizontalScrollIndicator={false}
      >
        {[...Array(8)].map((_, i) => (
          <ThemedView key={i} className="justify-center items-center mx-4 mt-2">
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: "#0F9E99", // Added border color for visibility
              }}
              source={{
                uri: "https://blog.logrocket.com/wp-content/uploads/2024/01/react-native-navigation-tutorial.png",
              }}
            />
            <ThemedText className="text-xs text-text">Card {i + 1}</ThemedText>
          </ThemedView>
        ))}
        <TouchableOpacity className="justify-center items-center mx-4 mt-2">
          <View className="justify-center items-center w-[40px] h-[40px] rounded-full bg-muted">
            <AntDesign name="plus" size={18} color="white" />
          </View>
          <ThemedText className="text-xs text-text">add</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};
