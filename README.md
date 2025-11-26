# FamNote - Family Note Taker Mobile App 📝

A React Native mobile application that enables families to create, share, and manage notes collaboratively in a single shared space.

## 📱 Platform

- **Framework:** React Native with Expo (SDK 54+)
- **Language:** TypeScript
- **Target Devices:** iOS & Android

## 🚀 Tech Stack

### Frontend
- React Native with Expo
- TypeScript
- React Navigation v7
- React Native Paper (UI Components)
- NativeWind (Tailwind CSS for React Native)
- Expo Router (File-based routing)

### Backend Services
- **Authentication:** Firebase Authentication
  - Email/Password
  - Google Sign-In
  - Apple Sign-In (iOS)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime subscriptions

## 🎯 Key Features

- Family-based note sharing system
- User authentication via Firebase
- Real-time note synchronization
- Image attachments for notes
- Multiple note types (general, reminder, shopping, todo)
- Emoji reactions and categorization
- Invite code system for family joining

## 📦 Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Firebase and Supabase credentials

3. Start the development server:
   ```bash
   yarn start
   ```

## 🏗️ Project Structure

```
FamNote/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (onboarding)/      # Onboarding screens
│   ├── (tabs)/            # Main app tabs
│   └── notes/             # Note management screens
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── theme/             # Theme configuration
├── assets/                # Images, fonts, icons
└── ...config files
```

## 🛠️ Available Scripts

- `yarn start` - Start Expo development server
- `yarn android` - Run on Android emulator
- `yarn ios` - Run on iOS simulator
- `yarn web` - Run on web browser
- `yarn lint` - Run ESLint

## 📚 Documentation

- [Product Requirements Document (PRD)](./PRD.md)
- [Database Design](./database_design.md)
- [Firebase & Supabase Integration](./firebase_supabase_integration.md)
- [Development Tasks](./famnote_tasks.md)

## 🔐 Environment Setup

Required environment variables:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## 📖 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 📄 License

Private - All rights reserved

## 👥 Development Status

**Current Phase:** Week 1 - Project Setup & Environment Configuration  
**Last Updated:** November 26, 2025
