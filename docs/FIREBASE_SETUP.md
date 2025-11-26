/**
 * Firebase Setup Guide for FamNote
 * 
 * Follow these steps to set up Firebase for the FamNote application.
 * This guide covers creating a Firebase project and enabling authentication methods.
 */

# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter project name: `FamNote` (or your preferred name)
4. (Optional) Enable Google Analytics
5. Click "Create project"
6. Wait for project creation to complete

## Step 2: Register Your App

### For Web (Development & Testing)
1. In Firebase Console, click the **Web** icon (`</>`)
2. Enter app nickname: `FamNote Web`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object (you'll need this for `.env`)

### For iOS (Later)
1. Click the **iOS** icon
2. Enter iOS bundle ID (from `app.json`)
3. Download `GoogleService-Info.plist`
4. Place it in the project root (will be added to `.gitignore`)

### For Android (Later)
1. Click the **Android** icon
2. Enter Android package name (from `app.json`)
3. Download `google-services.json`
4. Place it in the project root (will be added to `.gitignore`)

## Step 3: Enable Authentication Methods

### Email/Password Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable the first toggle (Email/Password)
4. Click "Save"

### Google Sign-In
1. In the same **Sign-in method** tab
2. Click on **Google**
3. Enable the toggle
4. Select a support email from dropdown
5. Click "Save"

**Note:** For production, you'll need to configure OAuth consent screen in Google Cloud Console.

### Apple Sign-In (iOS Only)
1. In the same **Sign-in method** tab
2. Click on **Apple**
3. Enable the toggle
4. You'll need:
   - Apple Developer account
   - Service ID from Apple Developer Console
   - Team ID
   - Key ID
   - Private Key (.p8 file)
5. Click "Save"

**Note:** Apple Sign-In setup is more complex and required only for iOS production.

## Step 4: Configure Environment Variables

1. From Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Find your Web app configuration
4. Copy the values and update your `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=famnote-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=famnote-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=famnote-xxxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 5: Security Rules (Optional for Now)

Firebase Authentication is secure by default. We'll configure additional security rules later when needed.

## Step 6: Test Firebase Connection

After setting up your `.env` file:

1. Start your Expo app: `yarn start`
2. Check the console for: `✅ Firebase initialized successfully`
3. If you see errors, verify your environment variables

## Troubleshooting

### "Missing Firebase environment variables"
- Ensure your `.env` file exists in the project root
- Verify all variables are prefixed with `EXPO_PUBLIC_`
- Restart the Expo development server after changing `.env`

### "Firebase initialization error"
- Check that all values are copied correctly (no extra spaces)
- Verify the Firebase project is active in Firebase Console
- Check Firebase Console for any billing or quota issues

### Google Sign-In not working
- Ensure Google Sign-In is enabled in Firebase Console
- For production, configure OAuth consent screen
- Add authorized domains in Firebase Console

## Next Steps

After completing Firebase setup:
- ✅ Firebase project created
- ✅ Authentication methods enabled
- ✅ Environment variables configured
- ✅ Firebase connection tested

You're ready to move on to **Week 1 Day 3: Supabase Setup**!

## Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [Apple Sign-In Setup](https://firebase.google.com/docs/auth/web/apple)
