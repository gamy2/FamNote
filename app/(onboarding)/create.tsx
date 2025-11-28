import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { createFamily } from '@/services/familyService';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateFamilyScreen() {
  const { user } = useAuth();
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdFamily, setCreatedFamily] = useState<any>(null);

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert('Error', 'Please enter a family name');
      return;
    }

    if (familyName.trim().length > 100) {
      Alert.alert('Error', 'Family name must be 100 characters or less');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to create a family');
      return;
    }

    setLoading(true);
    const { family, error } = await createFamily({
      name: familyName.trim(),
      creator_id: user.uid,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error);
    } else if (family) {
      setCreatedFamily(family);
    }
  };

  const handleCopyInviteCode = async () => {
    if (createdFamily?.invite_code) {
      await Clipboard.setStringAsync(createdFamily.invite_code);
      Alert.alert('Copied!', 'Invite code copied to clipboard');
    }
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  if (createdFamily) {
    return (
      <ThemedView className="flex-1 bg-background">
        <LinearGradient
          colors={['#0F9E99', '#0A7A76']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-5 pt-16 pb-8"
        >
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText type="title" className="mb-2 font-bold text-white">
            Family Created!
          </ThemedText>
        </LinearGradient>

        <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-8">
            <View className="justify-center items-center mb-4 w-20 h-20 rounded-full bg-primary">
              <AntDesign name="check" size={40} color="white" />
            </View>
            <ThemedText type="subtitle" className="mb-2 text-center">
              {createdFamily.name}
            </ThemedText>
            <ThemedText className="text-sm text-center text-muted">
              Your family has been created successfully
            </ThemedText>
          </View>

          {/* Invite Code Section */}
          <View className="mb-6">
            <ThemedText className="mb-3 text-sm font-medium text-text">
              Invite Code
            </ThemedText>
            <View className="flex-row gap-2 items-center">
              <View className="flex-1 px-4 py-4 bg-gray-50 rounded-xl border border-gray-200">
                <ThemedText className="text-2xl font-bold text-center text-primary tracking-widest">
                  {createdFamily.invite_code}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={handleCopyInviteCode}
                className="px-4 py-4 bg-primary rounded-xl"
              >
                <AntDesign name="copy1" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ThemedText className="mt-2 text-xs text-center text-muted">
              Share this code with family members to invite them
            </ThemedText>
          </View>

          <TouchableOpacity onPress={handleContinue} className="mb-6">
            <LinearGradient
              colors={['#0F9E99', '#0A7A76']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row gap-2 justify-center items-center py-4 rounded-full"
            >
              <ThemedText className="text-base font-semibold text-white">
                Continue to Home
              </ThemedText>
              <AntDesign name="right" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#0F9E99', '#0A7A76']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 pt-16 pb-8"
          >
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText type="title" className="mb-2 font-bold text-white">
              Create Family
            </ThemedText>
            <ThemedText className="text-base text-white opacity-90">
              Start a new family group to share moments together
            </ThemedText>
          </LinearGradient>

          <View className="flex-1 px-5 pt-8 pb-5">
            <View className="mb-6">
              <ThemedText className="mb-2 text-sm font-medium text-text">
                Family Name
              </ThemedText>
              <TextInput
                className="px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 text-base text-text"
                placeholder="Enter family name"
                placeholderTextColor="#9CA3AF"
                value={familyName}
                onChangeText={setFamilyName}
                maxLength={100}
                editable={!loading}
                autoFocus
              />
              <ThemedText className="mt-1 text-xs text-muted">
                {familyName.length}/100 characters
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={handleCreateFamily}
              disabled={loading || !familyName.trim()}
              className="mb-4"
            >
              <LinearGradient
                colors={['#0F9E99', '#0A7A76']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row gap-2 justify-center items-center py-4 rounded-full"
                style={{ opacity: loading || !familyName.trim() ? 0.5 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <ThemedText className="text-base font-semibold text-white">
                      Create Family
                    </ThemedText>
                    <AntDesign name="right" size={18} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

