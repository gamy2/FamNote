import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { joinFamily } from '@/services/familyService';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function JoinFamilyScreen() {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinFamily = async () => {
    const normalizedCode = inviteCode.trim().toUpperCase().replace(/\s/g, '');

    if (!normalizedCode) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    if (normalizedCode.length !== 8) {
      Alert.alert('Error', 'Invite code must be 8 characters');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to join a family');
      return;
    }

    setLoading(true);
    const { family, error } = await joinFamily(normalizedCode, user.uid);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error);
    } else if (family) {
      Alert.alert('Success', `You've joined ${family.name}!`, [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    }
  };

  const handleCodeChange = (text: string) => {
    // Auto-uppercase and remove spaces
    const cleaned = text.toUpperCase().replace(/\s/g, '').slice(0, 8);
    setInviteCode(cleaned);
  };

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
              Join Family
            </ThemedText>
            <ThemedText className="text-base text-white opacity-90">
              Enter the 8-character invite code to join a family
            </ThemedText>
          </LinearGradient>

          <View className="flex-1 px-5 pt-8 pb-5">
            <View className="mb-6">
              <ThemedText className="mb-2 text-sm font-medium text-text">
                Invite Code
              </ThemedText>
              <TextInput
                className="px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 text-2xl font-bold text-center text-primary tracking-widest"
                placeholder="ABCD1234"
                placeholderTextColor="#9CA3AF"
                value={inviteCode}
                onChangeText={handleCodeChange}
                maxLength={8}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!loading}
                autoFocus
              />
              <ThemedText className="mt-2 text-xs text-center text-muted">
                Ask a family member for the invite code
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={handleJoinFamily}
              disabled={loading || inviteCode.length !== 8}
              className="mb-4"
            >
              <LinearGradient
                colors={['#0F9E99', '#0A7A76']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row gap-2 justify-center items-center py-4 rounded-full"
                style={{ opacity: loading || inviteCode.length !== 8 ? 0.5 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <ThemedText className="text-base font-semibold text-white">
                      Join Family
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

