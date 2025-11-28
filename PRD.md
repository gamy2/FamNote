# Product Requirements Document (PRD)
## Family Note Taker Mobile App - FamNote

**Version:** 1.0  
**Date:** November 28, 2025  
**Platform:** React Native (Expo)  
**Target Devices:** iOS & Android  
**Project Status:** In Development

---

## 1. Executive Summary

### 1.1 Product Overview
FamNote is a mobile application that enables families to create, share, and manage notes collaboratively in a single shared space. Each family has a private workspace where all members can contribute notes, share updates, and stay connected.

### 1.2 Key Features
- Family-based note sharing system
- User authentication via Firebase
- Real-time note synchronization
- Image attachments for notes
- Multiple note categories (Reminder, Celebration, Request, Memory, Update)
- Emoji reactions and categorization
- Invite code system for family joining
- Multi-language support (English, Arabic)

---

## 2. Technical Stack (Current Implementation)

### 2.1 Frontend
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Routing:** Expo Router 6 (file-based routing)
- **Styling:** NativeWind 4 (Tailwind CSS for React Native)
- **State Management:** React Context API (to be implemented)
- **Animations:** React Native Reanimated 4
- **Icons:** @expo/vector-icons (MaterialIcons, MaterialCommunityIcons, AntDesign)
- **Image Handling:** expo-image, expo-image-picker, expo-image-manipulator
- **Internationalization:** i18next, react-i18next

### 2.2 Backend Services
- **Authentication:** Firebase Authentication (v12.6.0)
  - Email/Password
  - Google Sign-In
  - Apple Sign-In (iOS)
- **Database:** Supabase (PostgreSQL) v2.39.0
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime subscriptions

### 2.3 Current Dependencies
```json
{
  "dependencies": {
    "expo": "~54.0.20",
    "expo-router": "~6.0.13",
    "react-native": "0.81.5",
    "react": "19.1.0",
    "nativewind": "^4.2.1",
    "tailwindcss": "^3.4.18",
    "@supabase/supabase-js": "^2.39.0",
    "firebase": "^12.6.0",
    "expo-image-picker": "^17.0.8",
    "expo-image-manipulator": "^14.0.7",
    "expo-linear-gradient": "^15.0.7",
    "@react-native-async-storage/async-storage": "2.2.0",
    "react-native-reanimated": "~4.1.1",
    "i18next": "^25.6.0",
    "react-i18next": "^16.2.4"
  }
}
```

---

## 3. Design System

### 3.1 Color Palette
```javascript
// tailwind.config.js
colors: {
  primary: '#0F9E99',      // Teal - primary actions, buttons
  background: '#EFE9E0',   // Beige - app background
  text: '#003B38',         // Dark teal - primary text
  muted: '#687076',        // Gray - secondary text
  card: '#ffffff',         // White - card backgrounds
  border: '#E5E7EB'        // Light gray - borders
}
```

### 3.2 Note Categories
```javascript
[
  { id: 'reminder', label: 'Reminder', textColor: '#EC4D6B', bgColor: '#FEE7EF' },
  { id: 'celebration', label: 'Celebration', textColor: '#47C2BE', bgColor: '#E4F7F6' },
  { id: 'request', label: 'Request', textColor: '#F9BE1A', bgColor: '#FFF7DE' },
  { id: 'memory', label: 'Memory', textColor: '#7A6DAE', bgColor: '#F2F0FA' },
  { id: 'update', label: 'Update', textColor: '#56C6B2', bgColor: '#E9F7F6' }
]
```

### 3.3 Typography
- **Custom Components:** `ThemedText`, `ThemedView`
- **Font Families:** System fonts (SF Pro on iOS, Roboto on Android)
- **Text Types:** default, title, subtitle, defaultSemiBold, link

---

## 4. Current Project Structure

```
FamNote/
├── app/                              # Expo Router screens
│   ├── (tabs)/                       # Tab navigation
│   │   ├── _layout.tsx              # Tab navigator setup ✅
│   │   ├── index.tsx                # Notes feed screen ✅
│   │   ├── explore.tsx              # Family info screen ✅
│   │   └── settings.tsx             # Settings screen ✅
│   ├── modal.tsx                     # Create note modal ✅
│   └── _layout.tsx                   # Root layout ✅
├── src/
│   └── services/
│       ├── firebase.ts               # Firebase initialization ✅
│       └── supabase.ts               # Supabase client ✅
├── components/
│   ├── themed-text.tsx               # Themed text component ✅
│   ├── themed-view.tsx               # Themed view component ✅
│   ├── haptic-tab.tsx                # Tab with haptic feedback ✅
│   ├── parallax-scroll-view.tsx      # Scroll view with parallax ✅
│   └── ui/                           # UI components
│       ├── collapsible.tsx           ✅
│       ├── icon-symbol.tsx           ✅
│       └── icon-symbol.ios.tsx       ✅
├── constants/
│   └── theme.ts                      # Theme constants ✅
├── hooks/
│   ├── use-color-scheme.ts           # Color scheme hook ✅
│   └── use-theme-color.ts            # Theme color hook ✅
├── i18n/
│   ├── index.ts                      # i18n configuration ✅
│   └── translations/
│       ├── en.json                   # English translations ✅
│       └── ar.json                   # Arabic translations ✅
├── utils/
│   ├── supabase.ts                   # Supabase utilities ✅
│   ├── supabase-example.ts           # Usage examples ✅
│   └── lang-switcher.ts              # Language switcher ✅
├── docs/
│   └── FIREBASE_SETUP.md             # Firebase setup guide ✅
├── .env.example                      # Environment variables template ✅
├── app.config.js                     # Expo configuration ✅
├── tailwind.config.js                # Tailwind configuration ✅
├── babel.config.js                   # Babel configuration ✅
├── metro.config.js                   # Metro bundler config ✅
└── tsconfig.json                     # TypeScript configuration ✅
```

**Legend:**
- ✅ = Already implemented
- 🚧 = Needs implementation
- 📝 = Needs updates

---

## 5. Database Schema

### 5.1 Tables

#### **families**
```sql
{
  id: UUID (PK),
  creator_id: UUID (FK -> users.id),
  name: VARCHAR(100),
  description: TEXT,
  invite_code: VARCHAR(20) UNIQUE,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### **users**
```sql
{
  id: UUID (PK) -- matches Firebase Auth UID,
  email: VARCHAR(255) UNIQUE,
  family_id: UUID (FK -> families.id, nullable),
  username: VARCHAR(50),
  image_url: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### **notes**
```sql
{
  id: UUID (PK),
  family_id: UUID (FK -> families.id),
  user_id: UUID (FK -> users.id),
  text_content: TEXT,
  image_url: TEXT,
  category: VARCHAR(50), -- 'reminder', 'celebration', 'request', 'memory', 'update'
  emoji: VARCHAR(10),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### 5.2 Relationships
- User **belongs to** 0 or 1 Family
- Family **has many** Users (1+)
- Family **has many** Notes (0+)
- User **writes many** Notes (0+)
- Note **belongs to** 1 Family
- Note **belongs to** 1 User (author)

### 5.3 Storage Buckets
- `user-avatars/` - User profile images (public)
- `note-images/` - Note attachment images (private, family-scoped)

---

## 6. Implementation Plan

### Phase 1: Foundation (Week 1) ✅ COMPLETED
- [x] Project setup with Expo
- [x] NativeWind/Tailwind configuration
- [x] Firebase service initialization
- [x] Supabase service initialization
- [x] Environment variables setup
- [x] Basic routing structure
- [x] Theme system with custom colors
- [x] i18n setup (English, Arabic)

### Phase 2: Authentication (Week 2) 🚧 IN PROGRESS
**Priority Tasks:**
1. Create authentication context (`src/contexts/AuthContext.tsx`)
2. Implement auth service functions (`src/services/authService.ts`)
3. Build authentication screens:
   - Login screen (`app/(auth)/login.tsx`)
   - Signup screen (`app/(auth)/signup.tsx`)
   - Forgot password screen (`app/(auth)/forgot-password.tsx`)
4. Implement Firebase + Supabase integration:
   - Create user profile in Supabase after Firebase signup
   - Sync Firebase UID with Supabase user ID
5. Add session persistence with AsyncStorage
6. Add social login (Google, Apple)

### Phase 3: Family Management (Week 3) 📝 PENDING
**Priority Tasks:**
1. Create family context (`src/contexts/FamilyContext.tsx`)
2. Implement family service (`src/services/familyService.ts`)
3. Build onboarding screens:
   - Family onboarding welcome (`app/(onboarding)/index.tsx`)
   - Create family screen (`app/(onboarding)/create.tsx`)
   - Join family screen (`app/(onboarding)/join.tsx`)
4. Implement invite code generation
5. Update Family tab (`app/(tabs)/explore.tsx`) with:
   - Family details display
   - Member list
   - Invite code sharing
   - Leave/Delete family actions

### Phase 4: Notes CRUD (Week 4) 🚧 IN PROGRESS
**Current Status:**
- [x] Create note modal UI (`app/modal.tsx`)
- [x] Emoji picker with animations
- [x] Category selection
- [x] Text input
- [ ] Image picker integration
- [ ] Note service implementation (`src/services/noteService.ts`)
- [ ] Save note to Supabase
- [ ] Update Notes feed (`app/(tabs)/index.tsx`)

**Remaining Tasks:**
1. Implement note service functions
2. Integrate image picker and upload
3. Connect modal to Supabase
4. Build NoteCard component (`components/NoteCard.tsx`)
5. Implement real-time subscriptions
6. Add edit/delete functionality
7. Add pull-to-refresh
8. Add search and filter

### Phase 5: Storage & Images (Week 5) 📝 PENDING
1. Create storage service (`src/services/storageService.ts`)
2. Implement image upload to Supabase Storage
3. Implement image compression/resizing
4. Add user avatar upload
5. Add note image attachments
6. Implement image viewing (full-screen)

### Phase 6: Real-time Features (Week 6) 📝 PENDING
1. Create real-time hook (`src/hooks/useRealtime.ts`)
2. Implement Supabase real-time subscriptions
3. Add real-time note updates
4. Add real-time member updates
5. Add optimistic UI updates

### Phase 7: Polish & Testing (Week 7-8) 📝 PENDING
1. Error handling and loading states
2. Form validation
3. Offline support (basic)
4. Performance optimization
5. Testing (unit, integration)
6. Bug fixes
7. UI/UX refinements

---

## 7. User Stories & Implementation Details

### 7.1 Authentication & Onboarding

**US-001: User Registration** 🚧
**Status:** Needs Implementation
**Files to Create:**
- `app/(auth)/signup.tsx`
- `src/services/authService.ts` (signUp function)
- `src/contexts/AuthContext.tsx`

**Implementation Example:**
```typescript
// src/services/authService.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { supabase } from './supabase';

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  username: string
) => {
  try {
    // 1. Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    const firebaseUser = userCredential.user;
    
    // 2. Create Supabase user profile
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        username: username,
        family_id: null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { user: data, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};
```

**Screen Design (`app/(auth)/signup.tsx`):**
```typescript
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, TouchableOpacity, Alert } from 'react-native';
import { signUpWithEmail } from '@/src/services/authService';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    const { user, error } = await signUpWithEmail(email, password, username);
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error);
    } else {
      router.replace('/(onboarding)');
    }
  };

  return (
    <ThemedView className="flex-1 p-5 bg-background">
      <ThemedText type="title" className="mt-20 mb-10">
        Create Account
      </ThemedText>
      
      <TextInput
        className="p-4 mb-4 bg-white rounded-2xl"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="p-4 mb-4 bg-white rounded-2xl"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        className="p-4 mb-6 bg-white rounded-2xl"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        className="p-4 bg-primary rounded-full"
        onPress={handleSignUp}
        disabled={loading}
      >
        <ThemedText className="text-center text-white font-semibold">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push('/(auth)/login')}
      >
        <ThemedText className="text-center text-primary">
          Already have an account? Login
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
```

---

**US-003: Create Family** 📝
**Status:** Needs Implementation
**Files to Create:**
- `app/(onboarding)/create.tsx`
- `src/services/familyService.ts`

**Implementation:**
```typescript
// src/services/familyService.ts
import { supabase } from './supabase';

const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createFamily = async (
  name: string,
  description: string,
  creatorId: string
) => {
  try {
    const inviteCode = generateInviteCode();
    
    // 1. Create family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        name,
        description,
        creator_id: creatorId,
        invite_code: inviteCode
      })
      .select()
      .single();
    
    if (familyError) throw familyError;
    
    // 2. Update user's family_id
    const { error: userError } = await supabase
      .from('users')
      .update({ family_id: family.id })
      .eq('id', creatorId);
    
    if (userError) throw userError;
    
    return { family, error: null };
  } catch (error: any) {
    return { family: null, error: error.message };
  }
};
```

---

**US-008: Create Note** 🚧
**Status:** Partially Implemented (UI done, backend needed)
**Current File:** `app/modal.tsx` ✅
**Files to Create:**
- `src/services/noteService.ts`
- `components/NoteCard.tsx`

**Backend Implementation Needed:**
```typescript
// src/services/noteService.ts
import { supabase } from './supabase';

export const createNote = async (
  familyId: string,
  userId: string,
  textContent: string,
  category: string,
  emoji: string | null,
  imageUrl: string | null
) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        family_id: familyId,
        user_id: userId,
        text_content: textContent,
        category,
        emoji,
        image_url: imageUrl
      })
      .select(`
        *,
        users (username, image_url)
      `)
      .single();
    
    if (error) throw error;
    
    return { note: data, error: null };
  } catch (error: any) {
    return { note: null, error: error.message };
  }
};
```

**Update Modal to Save Note:**
```typescript
// app/modal.tsx - Update handleSave function
import { createNote } from '@/src/services/noteService';
import { useAuth } from '@/src/contexts/AuthContext'; // To be created

const handleSave = async () => {
  if (!noteText.trim()) {
    Alert.alert('Error', 'Please enter some text');
    return;
  }
  
  const { user } = useAuth(); // Get current user
  
  const { note, error } = await createNote(
    user.family_id,
    user.id,
    noteText,
    selectedCategory || 'update',
    selectedEmoji,
    null // Image URL (to be implemented)
  );
  
  if (error) {
    Alert.alert('Error', 'Failed to create note');
  } else {
    router.back();
  }
};
```

---

**US-009: View Notes Feed** 🚧
**Status:** Partially Implemented (UI done, backend needed)
**Current File:** `app/(tabs)/index.tsx` ✅
**Files to Create:**
- `src/hooks/useNotes.ts`
- `components/NoteCard.tsx`

**Implementation:**
```typescript
// src/hooks/useNotes.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/src/services/supabase';

export const useNotes = (familyId: string) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) return;

    // Initial fetch
    const fetchNotes = async () => {
      const { data } = await supabase
        .from('notes')
        .select(`
          *,
          users (username, image_url)
        `)
        .eq('family_id', familyId)
        .order('created_at', { ascending: false });
      
      setNotes(data || []);
      setLoading(false);
    };

    fetchNotes();

    // Real-time subscription
    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `family_id=eq.${familyId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotes(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotes(prev => 
              prev.map(note => 
                note.id === payload.new.id ? payload.new : note
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setNotes(prev => 
              prev.filter(note => note.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [familyId]);

  return { notes, loading };
};
```

**NoteCard Component:**
```typescript
// components/NoteCard.tsx
import { ThemedText } from './themed-text';
import { Image } from 'expo-image';
import { View, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDistanceToNow } from 'date-fns'; // npm install date-fns

interface NoteCardProps {
  note: {
    id: string;
    text_content: string;
    emoji: string | null;
    category: string;
    image_url: string | null;
    created_at: string;
    users: {
      username: string;
      image_url: string | null;
    };
  };
  currentUserId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function NoteCard({ note, currentUserId, onEdit, onDelete }: NoteCardProps) {
  const categoryColors = {
    reminder: { text: '#EC4D6B', bg: '#FEE7EF' },
    celebration: { text: '#47C2BE', bg: '#E4F7F6' },
    request: { text: '#F9BE1A', bg: '#FFF7DE' },
    memory: { text: '#7A6DAE', bg: '#F2F0FA' },
    update: { text: '#56C6B2', bg: '#E9F7F6' },
  };

  const colors = categoryColors[note.category] || categoryColors.update;
  const isOwner = note.user_id === currentUserId;

  return (
    <View className="gap-5 p-5 bg-white rounded-3xl shadow-sm mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-start">
        <View className="flex-row gap-2 items-center flex-1">
          <Image
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{ uri: note.users.image_url || 'https://via.placeholder.com/40' }}
          />
          <View className="flex-1">
            <ThemedText type="subtitle" className="font-medium">
              {note.users.username}
            </ThemedText>
            <ThemedText className="text-sm opacity-60 text-muted">
              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
            </ThemedText>
          </View>
        </View>
        
        <View className="flex-row gap-2 items-center">
          {/* Category Badge */}
          <View 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.bg }}
          >
            <ThemedText 
              className="text-xs font-medium"
              style={{ color: colors.text }}
            >
              {note.category}
            </ThemedText>
          </View>
          
          {/* Emoji */}
          {note.emoji && (
            <ThemedText className="text-2xl">{note.emoji}</ThemedText>
          )}
        </View>
      </View>

      {/* Content */}
      <ThemedText className="text-sm text-text">
        {note.text_content}
      </ThemedText>

      {/* Image */}
      {note.image_url && (
        <Image
          style={{ width: '100%', height: 200, borderRadius: 16 }}
          source={{ uri: note.image_url }}
          contentFit="cover"
        />
      )}

      {/* Actions (only for owner) */}
      {isOwner && (
        <View className="flex-row gap-3 justify-end">
          <TouchableOpacity onPress={onEdit}>
            <AntDesign name="edit" size={18} color="#0F9E99" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <AntDesign name="delete" size={18} color="#EC4D6B" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
```

---

## 8. Files to Create (Priority Order)

### Week 2: Authentication
1. **`src/contexts/AuthContext.tsx`** - Authentication context provider
2. **`src/services/authService.ts`** - Auth functions (signup, login, logout)
3. **`app/(auth)/login.tsx`** - Login screen
4. **`app/(auth)/signup.tsx`** - Sign up screen
5. **`app/(auth)/forgot-password.tsx`** - Password reset screen
6. **`src/types/user.types.ts`** - User type definitions

### Week 3: Family Management
7. **`src/contexts/FamilyContext.tsx`** - Family context provider
8. **`src/services/familyService.ts`** - Family CRUD operations
9. **`app/(onboarding)/index.tsx`** - Onboarding welcome screen
10. **`app/(onboarding)/create.tsx`** - Create family screen
11. **`app/(onboarding)/join.tsx`** - Join family screen
12. **`src/types/family.types.ts`** - Family type definitions

### Week 4: Notes CRUD
13. **`src/services/noteService.ts`** - Note CRUD operations
14. **`src/hooks/useNotes.ts`** - Notes hook with real-time
15. **`components/NoteCard.tsx`** - Note display component
16. **`src/types/note.types.ts`** - Note type definitions

### Week 5: Storage & Images
17. **`src/services/storageService.ts`** - Image upload/download
18. **`components/ImagePicker.tsx`** - Image picker component

### Week 6+: Additional Features
19. **`components/MemberAvatar.tsx`** - Member avatar component
20. **`utils/validation.ts`** - Form validation utilities
21. **`utils/formatters.ts`** - Date/text formatting utilities

---

## 9. Database Setup (Supabase)

### SQL Schema (Run in Supabase SQL Editor)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Families Table
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY, -- Matches Firebase Auth UID
    email VARCHAR(255) UNIQUE NOT NULL,
    family_id UUID REFERENCES families(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes Table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text_content TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR(50) DEFAULT 'update',
    emoji VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_family_id ON users(family_id);
CREATE INDEX idx_notes_family_id ON notes(family_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_families_invite_code ON families(invite_code);

-- Updated_at Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified for Firebase auth)
-- Note: You'll need to set up Firebase -> Supabase JWT integration
CREATE POLICY "Users can view their family" ON families
    FOR SELECT USING (true);

CREATE POLICY "Users can create families" ON families
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their profile" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view notes" ON notes
    FOR SELECT USING (true);

CREATE POLICY "Users can create notes" ON notes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notes" ON notes
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their notes" ON notes
    FOR DELETE USING (user_id = auth.uid());
```

### Storage Buckets Setup

1. Go to Supabase Dashboard → Storage
2. Create two buckets:
   - **`user-avatars`** (Public)
   - **`note-images`** (Public - will add RLS later)

---

## 10. Environment Variables

**File:** `.env` (create from `.env.example`)

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 11. Testing Checklist

### Unit Tests (Future)
- [ ] Authentication service functions
- [ ] Family service functions
- [ ] Note service functions
- [ ] Validation utilities
- [ ] Formatters

### Integration Tests (Future)
- [ ] Firebase + Supabase auth flow
- [ ] Note CRUD with real-time
- [ ] Family creation and joining
- [ ] Image upload to storage

### Manual Testing (Current Priority)
- [ ] Sign up new user
- [ ] Login existing user
- [ ] Create family
- [ ] Join family with invite code
- [ ] Create note with emoji and category
- [ ] View notes in feed
- [ ] Edit own note
- [ ] Delete own note
- [ ] Upload note image
- [ ] Upload user avatar
- [ ] Real-time note updates
- [ ] Leave family
- [ ] Delete family (creator only)

---

## 12. Known Issues & TODOs

### High Priority
- [ ] Implement AuthContext for authentication state
- [ ] Implement FamilyContext for family state
- [ ] Connect create note modal to Supabase
- [ ] Implement image upload functionality
- [ ] Add pull-to-refresh on notes feed
- [ ] Add error handling and loading states
- [ ] Add form validation

### Medium Priority
- [ ] Add search functionality for notes
- [ ] Add filter by category
- [ ] Implement edit note functionality
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add offline support
- [ ] Optimize images (compression, resizing)

### Low Priority
- [ ] Add dark mode support
- [ ] Add more languages
- [ ] Add push notifications
- [ ] Add note comments
- [ ] Add note reactions

---

## 13. Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average notes created per family per week
- Average session duration

### Technical Metrics
- App crash rate < 1%
- API error rate < 2%
- Average API response time < 500ms
- Image upload success rate > 95%

### Business Metrics
- User retention (Day 1, Day 7, Day 30)
- Family creation rate
- Average family size
- User satisfaction (App Store rating > 4.0)

---

## Appendix: Quick Start Guide

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your Firebase and Supabase credentials
```

### 3. Run Supabase Schema
- Copy SQL from Section 9 above
- Paste into Supabase SQL Editor
- Execute

### 4. Start Development Server
```bash
npx expo start
```

### 5. Next Steps
- Implement AuthContext (Week 2)
- Create authentication screens
- Test Firebase + Supabase integration

---

**Document Version:** 1.1  
**Last Updated:** November 28, 2025  
**Status:** Living Document - Update as implementation progresses