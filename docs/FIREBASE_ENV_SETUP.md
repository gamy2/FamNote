# Firebase Environment Variables Setup Guide

This guide will help you get your Firebase environment variables and set them up in your FamNote project.

## Step 1: Get Firebase Configuration Values

### Option A: From Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project (or create a new one if you haven't)

2. **Navigate to Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview" in the left sidebar
   - Select "Project settings"

3. **Add a Web App (if you haven't already)**
   - Scroll down to the "Your apps" section
   - If you don't have a web app, click the `</>` (Web) icon
   - Register your app with a nickname (e.g., "FamNote Web")
   - Click "Register app"

4. **Copy Your Configuration**
   - You'll see a code snippet that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```

### Option B: From Firebase CLI

If you have Firebase CLI installed:
```bash
firebase projects:list
firebase apps:list
```

## Step 2: Create Your .env File

1. **Create a `.env` file in the root of your project**
   ```bash
   touch .env
   ```

2. **Add your Firebase configuration values**
   Copy the values from Firebase Console and add them to your `.env` file:

   ```env
   # Firebase Configuration
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

   **Important:** 
   - Replace the placeholder values with your actual Firebase values
   - Do NOT include quotes around the values
   - Make sure there are no spaces around the `=` sign

## Step 3: Map Firebase Values to Environment Variables

Here's what each Firebase config value maps to:

| Firebase Config Key | Environment Variable | Example Value |
|-------------------|---------------------|---------------|
| `apiKey` | `EXPO_PUBLIC_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `authDomain` | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `famnote-12345.firebaseapp.com` |
| `projectId` | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `famnote-12345` |
| `storageBucket` | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `famnote-12345.appspot.com` |
| `messagingSenderId` | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `appId` | `EXPO_PUBLIC_FIREBASE_APP_ID` | `1:123456789012:web:abcdef1234567890` |

## Step 4: Verify Your Setup

1. **Restart your Expo development server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm start
   # or
   expo start
   ```

2. **Check the console**
   - You should see: `✅ Firebase initialized successfully`
   - You should see: `📱 Project ID: your-project-id`
   - If you see errors about missing variables, double-check your `.env` file

## Step 5: Enable Authentication Methods

After setting up your environment variables, enable authentication methods in Firebase:

1. **Go to Firebase Console** → **Authentication** → **Sign-in method**

2. **Enable Email/Password**
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

3. **Enable Google Sign-In** (Optional)
   - Click on "Google"
   - Toggle "Enable" to ON
   - Enter your project support email
   - Click "Save"

## Troubleshooting

### Error: "Missing Firebase environment variables"
- Make sure your `.env` file is in the root directory (same level as `package.json`)
- Make sure all variables start with `EXPO_PUBLIC_`
- Restart your Expo development server after creating/updating `.env`

### Error: "Firebase initialization error"
- Double-check that all values are correct (no extra spaces, quotes, or typos)
- Verify your Firebase project is active in Firebase Console
- Make sure you're using the correct project's configuration

### Variables not loading?
- In Expo, environment variables are loaded at build time
- You may need to clear cache: `expo start -c`
- For web, you might need to rebuild: `expo start --web`

## Security Notes

⚠️ **Important Security Information:**

- The `.env` file contains sensitive information
- **NEVER commit `.env` to version control** (it should be in `.gitignore`)
- The `EXPO_PUBLIC_` prefix means these values will be included in your app bundle
- This is safe for Firebase config values (they're meant to be public)
- However, never expose Firebase Admin SDK credentials or service account keys

## Example .env File

Here's a complete example (with placeholder values):

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=famnote-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=famnote-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=famnote-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

## Next Steps

After setting up your environment variables:

1. ✅ Test email/password authentication
2. ✅ Configure Google Sign-In (if using)
3. ✅ Set up Firebase Security Rules
4. ✅ Configure Firebase Storage (if needed)

For more information, see:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

