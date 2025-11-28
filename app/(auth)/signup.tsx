import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, signUpWithEmail } from '@/services/authService';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleSignUp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { user, error } = await signUpWithEmail(email.trim(), password);

    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error);
    } else if (user) {
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    const { user, error } = await signInWithGoogle();

    setGoogleLoading(false);

    if (error) {
      Alert.alert('Google Sign Up Failed', error);
    } else if (user) {
      router.replace('/(tabs)');
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
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
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#0F9E99', '#0A7A76']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 pt-16 pb-8"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-4"
            >
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText type="title" className="mb-2 font-bold text-white">
              Create Account
            </ThemedText>
            <ThemedText className="text-base text-white opacity-90">
              Sign up to start sharing with your family
            </ThemedText>
          </LinearGradient>

          <View className="flex-1 px-5 pt-8 pb-5">
            {/* Email Input */}
            <View className="mb-4">
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
                  editable={!loading && !googleLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <ThemedText className="mb-2 text-sm font-medium text-text">
                Password
              </ThemedText>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                <View className="pl-4">
                  <AntDesign name="lock" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 px-4 py-4 text-base text-text"
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading && !googleLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="pr-4"
                  disabled={loading || googleLoading}
                >
                  <AntDesign
                    name={showPassword ? 'eye' : 'eye-invisible'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <ThemedText className="mb-2 text-sm font-medium text-text">
                Confirm Password
              </ThemedText>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                <View className="pl-4">
                  <AntDesign name="lock" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 px-4 py-4 text-base text-text"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading && !googleLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="pr-4"
                  disabled={loading || googleLoading}
                >
                  <AntDesign
                    name={showConfirmPassword ? 'eye' : 'eye-invisible'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading || googleLoading}
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
                      Create Account
                    </ThemedText>
                    <AntDesign name="right" size={18} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Google Sign In - Only show on web for now */}
            {Platform.OS === 'web' && (
              <>
                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-px bg-gray-200" />
                  <ThemedText className="px-4 text-sm text-muted">OR</ThemedText>
                  <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Google Sign Up Button */}
                <TouchableOpacity
                  onPress={handleGoogleSignUp}
                  disabled={loading || googleLoading}
                  className="flex-row gap-3 justify-center items-center py-4 mb-6 bg-white rounded-full border-2 border-gray-200"
                >
                  {googleLoading ? (
                    <ActivityIndicator color="#4285F4" />
                  ) : (
                    <>
                      <Image
                        source={{
                          uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
                        }}
                        style={{ width: 20, height: 20 }}
                      />
                      <ThemedText className="text-base font-medium text-text">
                        Continue with Google
                      </ThemedText>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Login Link */}
            <View className="flex-row justify-center items-center pt-6 mt-auto">
              <ThemedText className="text-sm text-muted">
                Already have an account?{' '}
              </ThemedText>
              <TouchableOpacity onPress={handleLogin} disabled={loading || googleLoading}>
                <ThemedText className="text-sm font-semibold text-primary">
                  Sign In
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

