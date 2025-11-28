import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  return (
    <ThemedView className="flex-1 bg-background">
      <LinearGradient
        colors={['#0F9E99', '#0A7A76']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-5 pt-20 pb-12"
      >
        <ThemedText type="title" className="mb-4 font-bold text-white text-center">
          Welcome to FamNote
        </ThemedText>
        <ThemedText className="text-base text-white opacity-90 text-center">
          Share moments and stay connected with your family
        </ThemedText>
      </LinearGradient>

      <View className="flex-1 px-5 pt-12">
        <ThemedText type="subtitle" className="mb-8 text-center">
          Get Started
        </ThemedText>
        <ThemedText className="mb-8 text-center text-muted">
          Create a new family or join an existing one using an invite code
        </ThemedText>

        <View className="gap-4">
          {/* Create Family Card */}
          <TouchableOpacity
            onPress={() => router.push('/(onboarding)/create')}
            className="p-6 bg-white rounded-2xl border-2 border-gray-200"
          >
            <View className="flex-row items-center gap-4">
              <View className="justify-center items-center w-16 h-16 rounded-full bg-primary">
                <AntDesign name="plus" size={24} color="white" />
              </View>
              <View className="flex-1">
                <ThemedText type="subtitle" className="mb-1 font-semibold">
                  Create New Family
                </ThemedText>
                <ThemedText className="text-sm text-muted">
                  Start a new family group and invite others
                </ThemedText>
              </View>
              <AntDesign name="right" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Join Family Card */}
          <TouchableOpacity
            onPress={() => router.push('/(onboarding)/join')}
            className="p-6 bg-white rounded-2xl border-2 border-gray-200"
          >
            <View className="flex-row items-center gap-4">
              <View className="justify-center items-center w-16 h-16 rounded-full bg-primary">
                <AntDesign name="adduser" size={24} color="white" />
              </View>
              <View className="flex-1">
                <ThemedText type="subtitle" className="mb-1 font-semibold">
                  Join Existing Family
                </ThemedText>
                <ThemedText className="text-sm text-muted">
                  Enter an invite code to join a family
                </ThemedText>
              </View>
              <AntDesign name="right" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

