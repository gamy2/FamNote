# Product Requirements Document (PRD)
## Family Note Taker Mobile App

**Version:** 1.0  
**Date:** November 26, 2025  
**Platform:** React Native (Expo)  
**Target Devices:** iOS & Android

---

## 1. Executive Summary

### 1.1 Product Overview
Family Note Taker is a mobile application that enables families to create, share, and manage notes collaboratively in a single shared space. Each family has a private workspace where all members can contribute notes, share updates, and stay connected.

### 1.2 Key Features
- Family-based note sharing system
- User authentication via Firebase
- Real-time note synchronization
- Image attachments for notes
- Multiple note types (general, reminder, shopping, etc.)
- Emoji reactions and categorization
- Invite code system for family joining

---

## 2. Technical Stack

### 2.1 Frontend
- **Framework:** React Native with Expo (SDK 50+)
- **Language:** TypeScript
- **State Management:** React Context API or Zustand
- **Navigation:** React Navigation v6
- **UI Components:** React Native Paper or NativeBase
- **Icons:** @expo/vector-icons
- **Image Handling:** expo-image-picker, expo-image-manipulator

### 2.2 Backend Services
- **Authentication:** Firebase Authentication
  - Email/Password
  - Google Sign-In
  - Apple Sign-In (iOS)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime subscriptions

### 2.3 Required Expo Packages
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "^3.4.0",
    "react-native": "0.73.0",
    "react-native-paper": "^5.12.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@supabase/supabase-js": "^2.39.0",
    "firebase": "^10.7.0",
    "expo-image-picker": "~14.7.1",
    "expo-clipboard": "~5.0.1",
    "expo-sharing": "~11.7.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "@react-native-async-storage/async-storage": "1.21.0"
  }
}
```

---

## 3. Database Schema

### 3.1 Tables

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
  type: VARCHAR(50), -- 'general', 'reminder', 'shopping', 'todo'
  emoji: VARCHAR(10),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### 3.2 Relationships
- User **belongs to** 0 or 1 Family
- Family **has many** Users (1+)
- Family **has many** Notes (0+)
- User **writes many** Notes (0+)
- Note **belongs to** 1 Family
- Note **belongs to** 1 User (author)

### 3.3 Storage Buckets
- `user-avatars/` - User profile images (public)
- `note-images/` - Note attachment images (private, family-scoped)

---

## 4. User Stories & Features

### 4.1 Authentication & Onboarding

**US-001: User Registration**
- As a new user, I want to sign up with email/password or social login
- Acceptance Criteria:
  - User can register with email and password
  - User can sign up with Google
  - User can sign up with Apple (iOS only)
  - Email verification sent after registration
  - User profile created in Supabase with Firebase UID

**US-002: User Login**
- As a returning user, I want to log in to access my family notes
- Acceptance Criteria:
  - User can log in with email/password
  - User can log in with social providers
  - Session persists across app restarts
  - Automatic redirect to family screen if user has family
  - Redirect to onboarding if user has no family

### 4.2 Family Management

**US-003: Create Family**
- As a user without a family, I want to create a new family
- Acceptance Criteria:
  - User can create family with name and optional description
  - Unique invite code generated automatically (8 characters)
  - User becomes family creator
  - User's family_id updated in database
  - Redirect to family home screen

**US-004: Join Family**
- As a user without a family, I want to join an existing family using invite code
- Acceptance Criteria:
  - User can enter 8-character invite code
  - Validation shows if code is invalid
  - User's family_id updated upon successful join
  - User sees all existing family notes
  - Cannot join if already in a family

**US-005: View Family Info**
- As a family member, I want to see family details and members
- Acceptance Criteria:
  - Display family name, description
  - Show all family members with avatars
  - Display invite code with copy button
  - Show member count
  - Show family creation date

**US-006: Leave Family**
- As a family member, I want to leave my current family
- Acceptance Criteria:
  - Confirmation dialog before leaving
  - User's family_id set to null
  - User's notes remain in family (orphaned to family)
  - Redirect to onboarding screen
  - If creator leaves, oldest member becomes new creator

**US-007: Delete Family (Creator Only)**
- As a family creator, I want to delete the entire family
- Acceptance Criteria:
  - Only creator can delete family
  - Confirmation dialog with warning
  - All family notes deleted (CASCADE)
  - All members' family_id set to null
  - All members redirected to onboarding

### 4.3 Note Management

**US-008: Create Note**
- As a family member, I want to create a text note
- Acceptance Criteria:
  - Text input with multiline support
  - Optional image attachment (camera or gallery)
  - Select note type (general, reminder, shopping, todo)
  - Optional emoji picker
  - Save button creates note
  - Note immediately visible to all family members

**US-009: View Notes Feed**
- As a family member, I want to see all family notes in chronological order
- Acceptance Criteria:
  - Notes displayed newest first
  - Show author name and avatar
  - Show note content, image, emoji, type
  - Show timestamp (relative: "2 hours ago")
  - Pull-to-refresh functionality
  - Infinite scroll/pagination for large lists

**US-010: Edit Own Note**
- As a note author, I want to edit my own notes
- Acceptance Criteria:
  - Only author can edit their notes
  - Edit icon visible on user's own notes
  - Can modify text, image, emoji, type
  - "Edited" label shown with edit timestamp
  - Changes reflected in real-time

**US-011: Delete Own Note**
- As a note author, I want to delete my own notes
- Acceptance Criteria:
  - Only author can delete their notes
  - Delete icon visible on user's own notes
  - Confirmation dialog before deletion
  - Note removed from database and storage
  - Real-time removal from all clients

**US-012: Filter Notes by Type**
- As a family member, I want to filter notes by type
- Acceptance Criteria:
  - Filter chips for each note type
  - "All" option shows unfiltered notes
  - Filtered view shows only selected type
  - Filter state persists during session

**US-013: Search Notes**
- As a family member, I want to search notes by text content
- Acceptance Criteria:
  - Search bar at top of notes feed
  - Real-time filtering as user types
  - Search across note text content
  - Clear search button
  - No results message when appropriate

### 4.4 User Profile

**US-014: View/Edit Profile**
- As a user, I want to manage my profile information
- Acceptance Criteria:
  - View username, email, profile picture
  - Edit username
  - Upload/change profile picture
  - Display family membership status
  - Show account creation date

**US-015: Logout**
- As a user, I want to securely log out
- Acceptance Criteria:
  - Logout button in profile/settings
  - Clears Firebase session
  - Clears local storage/cache
  - Redirects to login screen
  - Confirmation dialog optional

---

## 5. Screen Specifications

### 5.1 Authentication Screens

#### **Screen: Login** (`/auth/login`)
**Components:**
- App logo/branding
- Email input field
- Password input field (with show/hide toggle)
- "Login" button (primary)
- "Forgot Password?" link
- Social login buttons (Google, Apple)
- "Don't have an account? Sign Up" link

**Validation:**
- Email format validation
- Password minimum 8 characters
- Show error messages inline

#### **Screen: Sign Up** (`/auth/signup`)
**Components:**
- Email input
- Username input (3-50 characters)
- Password input (min 8 chars, show strength indicator)
- Confirm password input
- "Create Account" button
- Social sign-up buttons
- "Already have an account? Login" link

**Validation:**
- All fields required
- Passwords must match
- Username unique check
- Email unique check

### 5.2 Onboarding Screens

#### **Screen: Family Onboarding** (`/onboarding`)
**Components:**
- Welcome message
- Two option cards:
  1. "Create New Family" (with icon)
  2. "Join Existing Family" (with icon)
- Each card navigates to respective screen

#### **Screen: Create Family** (`/onboarding/create`)
**Components:**
- Family name input (required, max 100 chars)
- Family description textarea (optional, max 500 chars)
- "Create Family" button
- Auto-generated invite code display after creation
- "Copy Invite Code" button
- "Continue to Home" button

#### **Screen: Join Family** (`/onboarding/join`)
**Components:**
- Invite code input (8 characters, uppercase)
- "Join Family" button
- "Back" button
- Loading state during validation
- Error message for invalid codes
- Success message and auto-redirect on valid code

### 5.3 Main App Screens

#### **Screen: Notes Feed** (`/home` or `/notes`)
**Navigation:** Bottom Tab (Home icon)

**Components:**
- Header:
  - Family name
  - Member count badge
  - Settings/info icon
- Filter chips row (All, General, Reminder, Shopping, Todo)
- Search bar (collapsible/expandable)
- Floating Action Button (FAB) - "+" to create note
- Notes List (FlatList):
  - Each note card contains:
    - Author avatar (left)
    - Author name
    - Note content (text)
    - Note image (if exists) - tappable for full-screen
    - Emoji badge (if exists)
    - Type badge
    - Timestamp
    - Action icons (edit/delete - only for author)
- Pull-to-refresh
- Empty state: "No notes yet. Create the first one!"

**Real-time Updates:**
- Subscribe to notes table changes
- New notes appear at top
- Edited notes update in place
- Deleted notes removed from list

#### **Screen: Create/Edit Note** (`/notes/create` or `/notes/edit/:id`)
**Modal/Full Screen**

**Components:**
- Text input (multiline, placeholder: "What's on your mind?")
- Image picker button
  - Options: Camera, Gallery, Remove
  - Image preview if selected
- Note type selector (segmented control or dropdown)
  - General (default)
  - Reminder
  - Shopping
  - Todo
- Emoji picker button (opens emoji selector)
- Selected emoji preview
- "Save" button (header right)
- "Cancel" button (header left)

**Validation:**
- Text content required (min 1 character)
- Image optional, max 5MB
- Auto-save draft to local storage

#### **Screen: Family Info** (`/family`)
**Navigation:** Bottom Tab or Header Icon

**Components:**
- Family Details Card:
  - Family name (large)
  - Description
  - Created date
  - Creator badge
- Invite Code Section:
  - Display code in large, copyable text
  - "Copy Code" button
  - "Share Code" button (native share)
- Members Section:
  - List of all family members
  - Each member shows: avatar, username, "Creator" badge if applicable
  - Member count
- Actions:
  - "Leave Family" button (danger style)
  - "Delete Family" button (only for creator, danger style)

#### **Screen: Profile** (`/profile`)
**Navigation:** Bottom Tab (Profile icon)

**Components:**
- Profile header:
  - Large avatar (tappable to change)
  - Username (tappable to edit)
  - Email (read-only)
- Account Info:
  - Member since date
  - Family membership status
- Settings/Actions:
  - "Edit Profile" button
  - "Change Password" button (if email/password auth)
  - "Logout" button (danger style)

#### **Screen: Edit Profile** (`/profile/edit`)
**Components:**
- Avatar picker (circular)
- Username input
- "Save Changes" button
- "Cancel" button

---

## 6. Technical Implementation Details

### 6.1 Project Structure

```
family-note-taker/
├── app/                          # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (onboarding)/
│   │   ├── index.tsx            # Choose create/join
│   │   ├── create.tsx
│   │   └── join.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── _layout.tsx          # Tab navigator
│   │   ├── index.tsx            # Notes feed
│   │   ├── family.tsx           # Family info
│   │   └── profile.tsx          # User profile
│   ├── notes/
│   │   ├── create.tsx
│   │   └── [id].tsx             # Edit note
│   └── _layout.tsx              # Root layout
├── src/
│   ├── components/
│   │   ├── NoteCard.tsx
│   │   ├── MemberAvatar.tsx
│   │   ├── ImagePicker.tsx
│   │   ├── EmojiPicker.tsx
│   │   └── TypeSelector.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── FamilyContext.tsx
│   ├── services/
│   │   ├── firebase.ts          # Firebase config & auth
│   │   ├── supabase.ts          # Supabase client
│   │   ├── authService.ts       # Auth operations
│   │   ├── familyService.ts     # Family CRUD
│   │   ├── noteService.ts       # Note CRUD
│   │   └── storageService.ts    # Image upload
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFamily.ts
│   │   ├── useNotes.ts
│   │   └── useRealtime.ts
│   ├── types/
│   │   ├── database.types.ts    # Generated from Supabase
│   │   ├── family.types.ts
│   │   ├── note.types.ts
│   │   └── user.types.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatters.ts        # Date, text formatting
│   │   └── constants.ts
│   └── theme/
│       └── theme.ts              # Colors, spacing, typography
├── assets/
│   ├── images/
│   └── icons/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

### 6.2 Authentication Flow

```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// src/services/authService.ts
export const signUpWithEmail = async (email: string, password: string, username: string) => {
  // 1. Create Firebase user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  // 2. Get Firebase ID token
  const idToken = await firebaseUser.getIdToken();
  
  // 3. Create Supabase user profile
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      username: username,
      family_id: null
    });
  
  return { user: firebaseUser, error };
};

// src/contexts/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Supabase
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', firebaseUser.uid)
          .single();
        
        setUser(data);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 6.3 Real-time Subscriptions

```typescript
// src/hooks/useNotes.ts
export const useNotes = (familyId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
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
            setNotes(prev => [payload.new as Note, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotes(prev => 
              prev.map(note => 
                note.id === payload.new.id ? payload.new as Note : note
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

### 6.4 Image Upload Implementation

```typescript
// src/services/storageService.ts
export const uploadNoteImage = async (
  uri: string, 
  userId: string, 
  familyId: string
): Promise<string | null> => {
  try {
    // 1. Manipulate image (compress, resize)
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );

    // 2. Convert to blob
    const response = await fetch(manipResult.uri);
    const blob = await response.blob();

    // 3. Generate unique filename
    const filename = `${familyId}/${userId}/${Date.now()}.jpg`;

    // 4. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('note-images')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) throw error;

    // 5. Get public URL
    const { data: urlData } = supabase.storage
      .from('note-images')
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
};
```

### 6.5 Row Level Security (RLS) Policies

```sql
-- Example: Notes table RLS
-- Users can only see notes from their family
CREATE POLICY "Users can view family notes"
  ON notes FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM users WHERE id = auth.uid()
    )
  );

-- Users can only create notes in their own family
CREATE POLICY "Users can create notes in their family"
  ON notes FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND family_id IN (
      SELECT family_id FROM users WHERE id = auth.uid()
    )
  );
```

---

## 7. Non-Functional Requirements

### 7.1 Performance
- App launch time: < 3 seconds
- Note creation/save: < 2 seconds
- Image upload: < 5 seconds (depending on network)
- Real-time updates: < 1 second latency
- Smooth scrolling at 60 FPS

### 7.2 Security
- All API keys in environment variables (never committed)
- Firebase Authentication with secure token handling
- Supabase Row Level Security enforced on all tables
- Image uploads restricted to authenticated users
- Input validation and sanitization
- HTTPS only for all network requests

### 7.3 Scalability
- Support up to 50 members per family
- Support up to 10,000 notes per family
- Pagination for notes (20-50 per page)
- Image compression before upload (max 1200px width)
- Lazy loading for images in feed

### 7.4 Offline Support (Future Enhancement)
- Cache recent notes for offline viewing
- Queue note creation for sync when online
- Show offline indicator in UI

### 7.5 Accessibility
- All interactive elements have accessible labels
- Minimum touch target size: 44x44 points
- Support for screen readers
- Proper color contrast ratios (WCAG AA)
- Adjustable font sizes

---

## 8. Error Handling

### 8.1 Network Errors
- Show toast/snackbar with error message
- Retry mechanism for failed requests
- Offline mode indicator

### 8.2 Authentication Errors
- Clear error messages for login/signup failures
- Email verification reminders
- Password reset flow

### 8.3 Validation Errors
- Inline field validation
- Highlight invalid fields in red
- Clear error messages below fields

### 8.4 Upload Errors
- Show upload progress indicator
- Retry option for failed uploads
- Clear error messages (file too large, wrong format, etc.)

---

## 9. Testing Requirements

### 9.1 Unit Tests
- Authentication service functions
- Validation utilities
- Data formatting functions
- Custom hooks logic

### 9.2 Integration Tests
- Firebase + Supabase authentication flow
- Note CRUD operations with database
- Image upload to storage
- Real-time subscription handling

### 9.3 E2E Tests (Optional)
- Complete user journey: signup → create family → create note
- Join family flow
- Edit and delete note flow

---

## 10. Deployment & Environment Setup

### 10.1 Environment Variables

```env
# .env file
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

EXPO_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 10.2 Firebase Setup Checklist
1. Create Firebase project
2. Enable Authentication methods:
   - Email/Password
   - Google
   - Apple (for iOS)
3. Add iOS/Android apps in Firebase console
4. Download and configure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

### 10.3 Supabase Setup Checklist
1. Create Supabase project
2. Run database schema SQL (from earlier artifacts)
3. Enable Row Level Security on all tables
4. Create storage buckets:
   - `user-avatars` (public)
   - `note-images` (private with RLS)
5. Set up storage policies for family-scoped access
6. Get project URL and anon key

### 10.4 Expo Setup
```bash
# Install Expo CLI
npm install -g expo-cli

# Create project
npx create-expo-app family-note-taker --template blank-typescript

# Install dependencies
npm install @supabase/supabase-js firebase @react-navigation/native @react-navigation/stack expo-router react-native-paper

# Install Expo packages
npx expo install expo-image-picker expo-clipboard expo-sharing react-native-safe-area-context react-native-screens

# Start development
npx expo start
```

---

## 11. Future Enhancements (Post-MVP)

### 11.1 Phase 2 Features
- [ ] Push notifications for new notes
- [ ] Note comments/replies
- [ ] Note reactions (like, heart, etc.)
- [ ] Rich text formatting (bold, italic, lists)
- [ ] Voice notes
- [ ] Location tagging
- [ ] Calendar integration for reminders

### 11.2 Phase 3 Features
- [ ] Multiple families per user
- [ ] Family roles (admin, member, viewer)
- [ ] Note archiving
- [ ] Export notes (PDF, CSV)
- [ ] Dark mode
- [ ] Note templates
- [ ] Recurring reminders
- [ ] Family calendar view

---

## 12. Success Metrics

### 12.1 User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average notes created per user per week
- Average session duration

### 12.2 Technical Metrics
- App crash rate < 1%
- API error rate < 2%
- Average API response time < 500ms
- Image upload success rate > 95%

### 12.3 Business Metrics
- User retention (Day 1, Day 7, Day 30)
- Family creation rate
- Average family size
- User satisfaction (App Store rating > 4.0)

---

## 13. Support & Documentation

### 13.1 In-App Help
- Onboarding tutorial (first launch)
- Tooltips for key features
- FAQ section in settings
- Contact support option

### 13.2 Developer Documentation
- README with setup instructions
- API documentation (services)
- Component documentation
- Contribution guidelines

---

## Appendix A: Glossary

- **Family**: A group of users sharing a common note space
- **Invite Code**: 8-character unique code for joining a family
- **Creator**: User who created the family (special permissions)
- **Note Type**: Category of note (general, reminder, shopping, todo)
- **RLS**: Row Level Security (Supabase database security)
- **FAB**: Floating Action Button

---

## Appendix B: API Reference Summary

### Authentication API (Firebase)
```typescript
signUpWithEmail(email, password, username)
signInWithEmail(email, password)
signInWithGoogle()
signInWithApple()
signOut()
resetPassword(email)
```

### Family API (Supabase)
```typescript
createFamily(name, description, creatorId)
joinFamily(inviteCode, userId)
getFamily(familyId)
getFamilyMembers(familyId)
leaveFamily(userId)
deleteFamily(familyId) // creator only
```

### Notes API (Supabase)
```typescript
createNote(familyId, userId, content, imageUrl, type, emoji)
getNotes(familyId, limit, offset)
updateNote(noteId, updates)
deleteNote(noteId)
searchNotes(familyId, searchTerm)
```

### Storage API (Supabase)
```typescript
uploadImage(bucket, path, file)
deleteImage(bucket, path)
getPublicUrl(bucket, path)
```

---

## Document Control

**Author:** Product Team  
**Reviewers:** Engineering, Design, QA  
**Approval:** Product Manager  
**Next Review Date:** After MVP completion  

**Change Log:**
- v1.0 (Nov 26, 2025): Initial PRD created