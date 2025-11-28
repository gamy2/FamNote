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
import { signInWithEmail, signInWithGoogle } from '@/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Handle Google redirect on mount (web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkGoogleRedirect = async () => {
        const { handleGoogleRedirect } = await import('@/services/authService');
        const { user, error } = await handleGoogleRedirect();
        if (user) {
          router.replace('/(tabs)');
        } else if (error && error !== null) {
          // Only show error if it's a real error, not just "no redirect"
          console.log('Google redirect check:', error);
        }
      };
      checkGoogleRedirect();
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { user, error } = await signInWithEmail(email.trim(), password);

    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error);
    } else if (user) {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { user, error } = await signInWithGoogle();

    setGoogleLoading(false);

    if (error) {
      Alert.alert('Google Sign In Failed', error);
    } else if (user) {
      router.replace('/(tabs)');
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password' as any);
  };

  const handleSignUp = () => {
    router.push('/signup' as any);
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
            <ThemedText type="title" className="mb-2 font-bold text-white">
              Welcome Back
            </ThemedText>
            <ThemedText className="text-base text-white opacity-90">
              Sign in to continue to FamNote
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
            <View className="mb-6">
              <ThemedText className="mb-2 text-sm font-medium text-text">
                Password
              </ThemedText>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                <View className="pl-4">
                  <AntDesign name="lock" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 px-4 py-4 text-base text-text"
                  placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="self-end mb-6"
              disabled={loading || googleLoading}
            >
              <ThemedText className="text-sm font-medium text-primary">
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleEmailLogin}
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
                      Sign In
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

                {/* Google Sign In Button */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
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

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center pt-6 mt-auto">
              <ThemedText className="text-sm text-muted">
                Don&apos;t have an account?{' '}
              </ThemedText>
              <TouchableOpacity onPress={handleSignUp} disabled={loading || googleLoading}>
                <ThemedText className="text-sm font-semibold text-primary">
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

