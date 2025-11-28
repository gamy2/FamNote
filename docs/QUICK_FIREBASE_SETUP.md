# Quick Firebase Setup Guide

## 🚀 Quick Steps to Get Your Firebase Environment Variables

### 1. Go to Firebase Console
👉 https://console.firebase.google.com/

### 2. Select Your Project
- Click on your project name (or create a new one)

### 3. Get Your Config Values
1. Click the **⚙️ Settings icon** → **Project settings**
2. Scroll down to **"Your apps"** section
3. If you don't have a web app yet:
   - Click the **`</>` (Web icon)**
   - Register app with name: **"FamNote Web"**
   - Click **"Register app"**
4. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Create Your .env File

In your project root, create a file named `.env` and add:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Copy the values from step 3 and paste them here!**

### 5. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**: Toggle ON → Save
3. Enable **Google** (optional): Toggle ON → Add support email → Save

### 6. Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
npm start
# or
expo start
```

You should see: `✅ Firebase initialized successfully`

---

## 📋 Quick Reference: What Goes Where

| Copy This From Firebase | Paste Into .env As |
|------------------------|-------------------|
| `apiKey` | `EXPO_PUBLIC_FIREBASE_API_KEY` |
| `authDomain` | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` |
| `storageBucket` | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `EXPO_PUBLIC_FIREBASE_APP_ID` |

---

## ⚠️ Important Notes

- ✅ `.env` is already in `.gitignore` (safe from commits)
- ✅ No quotes needed around values
- ✅ No spaces around the `=` sign
- ✅ Restart Expo after creating/updating `.env`

---

## 🆘 Troubleshooting

**"Missing Firebase environment variables" error?**
- Make sure `.env` is in the project root (same folder as `package.json`)
- Make sure all variables start with `EXPO_PUBLIC_`
- Restart your dev server

**Still not working?**
- Try: `expo start -c` (clears cache)
- Check that values don't have extra spaces or quotes

