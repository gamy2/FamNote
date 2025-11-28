import * as WebBrowser from 'expo-web-browser';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from './firebase';

/**
 * Authentication Service
 * 
 * This service handles all authentication operations using Firebase Auth.
 * Supports:
 * - Email/Password authentication
 * - Google Sign-In
 * - Password reset
 * - Session management
 */

export interface AuthResult {
  user: User | null;
  error: string | null;
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      error: null,
    };
  } catch (error: any) {
    let errorMessage = 'An error occurred during sign in';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection';
    }
    
    return {
      user: null,
      error: errorMessage,
    };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      error: null,
    };
  } catch (error: any) {
    let errorMessage = 'An error occurred during sign up';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection';
    }
    
    return {
      user: null,
      error: errorMessage,
    };
  }
};

// Complete the web browser authentication session
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign in with Google
 * Uses Firebase's web-based OAuth flow
 * For React Native, opens a browser for authentication
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    // For web platform, use redirect flow
    if (Platform.OS === 'web') {
      const { signInWithRedirect, getRedirectResult } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      
      // Check if we're returning from a redirect
      const result = await getRedirectResult(auth);
      if (result) {
        return {
          user: result.user,
          error: null,
        };
      }
      
      // Start the redirect flow
      await signInWithRedirect(auth, provider);
      return {
        user: null,
        error: null, // Redirecting
      };
    }
    
    // For React Native, we need to use a different approach
    // Firebase Web SDK's OAuth doesn't work directly in React Native
    // We'll use a web-based flow that opens in a browser
    
    // Note: This requires expo-auth-session for proper OAuth flow
    // For now, we'll show a helpful message
    // To enable Google Sign-In, install: npx expo install expo-auth-session expo-crypto
    
    return {
      user: null,
      error: 'Google Sign-In on mobile requires additional setup. Please use email/password authentication, or install expo-auth-session for Google Sign-In support.',
    };
  } catch (error: any) {
    let errorMessage = 'An error occurred during Google sign in';
    
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      user: null,
      error: errorMessage,
    };
  }
};

/**
 * Handle Google Sign-In redirect result (for web only)
 */
export const handleGoogleRedirect = async (): Promise<AuthResult> => {
  try {
    if (Platform.OS === 'web') {
      const { getRedirectResult } = await import('firebase/auth');
      const result = await getRedirectResult(auth);
      if (result) {
        return {
          user: result.user,
          error: null,
        };
      }
    }
    return {
      user: null,
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to complete Google sign in',
    };
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return {
      error: error.message || 'An error occurred during sign out',
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    let errorMessage = 'An error occurred while sending reset email';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }
    
    return { error: errorMessage };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

