import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

/**
 * Firebase Configuration
 * 
 * This file initializes Firebase for the FamNote application.
 * Firebase is used for authentication (Email/Password, Google, Apple).
 * 
 * Environment variables are loaded from .env file and must be prefixed
 * with EXPO_PUBLIC_ to be accessible in the Expo app.
 * 
 * @see https://firebase.google.com/docs/web/setup
 */

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const validateFirebaseConfig = () => {
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      '❌ Missing Firebase environment variables:',
      missingVars.join(', ')
    );
    console.error(
      '💡 Please check your .env file and ensure all Firebase variables are set.'
    );
    throw new Error(
      `Missing Firebase configuration: ${missingVars.join(', ')}`
    );
  }
};

// Validate configuration before initializing
validateFirebaseConfig();

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth
// Note: Firebase v12.6.0 shows a warning about AsyncStorage persistence.
// The warning suggests using initializeAuth with getReactNativePersistence,
// but that function may not be available in this version.
// Auth will still work, but session persistence between app restarts may be limited.
// For production, consider updating Firebase or implementing custom session management.
let auth: Auth;

try {
  auth = getAuth(firebaseApp);
  
  console.log('✅ Firebase initialized successfully');
  console.log('📱 Project ID:', firebaseConfig.projectId);
  console.log('⚠️  Note: Auth persistence warning may appear - this is expected with Firebase v12.6.0');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Export Firebase instances
export { auth, firebaseApp };

// Export Firebase config for debugging (non-sensitive info only)
export const getFirebaseConfig = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
});
