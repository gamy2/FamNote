import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { resetPassword } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Error', error);
    } else {
      setEmailSent(true);
      Alert.alert(
        'Email Sent',
        'Please check your email for password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  if (emailSent) {
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
            Check Your Email
          </ThemedText>
        </LinearGradient>

        <View className="flex-1 justify-center items-center px-5">
          <View className="items-center mb-8">
            <View className="justify-center items-center mb-4 w-20 h-20 rounded-full bg-primary">
              <AntDesign name="mail" size={40} color="white" />
            </View>
            <ThemedText type="subtitle" className="mb-2 text-center">
              Password Reset Email Sent
            </ThemedText>
            <ThemedText className="text-sm text-center text-muted">
              We&apos;ve sent password reset instructions to{'\n'}
              <ThemedText className="font-semibold text-text">{email}</ThemedText>
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full"
          >
            <LinearGradient
              colors={['#0F9E99', '#0A7A76']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row gap-2 justify-center items-center py-4 rounded-full"
            >
              <ThemedText className="text-base font-semibold text-white">
                Back to Login
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
          {/* Header with Gradient */}
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
              Forgot Password?
            </ThemedText>
            <ThemedText className="text-base text-white opacity-90">
              Enter your email and we&apos;ll send you instructions to reset your password
            </ThemedText>
          </LinearGradient>

          <View className="flex-1 px-5 pt-8 pb-5">
            {/* Email Input */}
            <View className="mb-6">
              <ThemedText className="mb-2 text-sm font-medium text-text">
                Email Address
              </ThemedText>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                <View className="pl-4">
                  <AntDesign name="mail" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 px-4 py-4 text-base text-text"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              className="mb-4"
            >
              <LinearGradient
                colors={['#0F9E99', '#0A7A76']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row gap-2 justify-center items-center py-4 rounded-full"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <ThemedText className="text-base font-semibold text-white">
                      Send Reset Link
                    </ThemedText>
                    <AntDesign name="right" size={18} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <View className="flex-row justify-center items-center pt-6 mt-auto">
              <TouchableOpacity onPress={() => router.back()} disabled={loading}>
                <ThemedText className="text-sm font-semibold text-primary">
                  Back to Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

