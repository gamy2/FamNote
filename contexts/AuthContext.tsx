import { getCurrentUser, subscribeToAuthState } from '@/services/authService';
import { supabase } from '@/services/supabase';
import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  family_id: string | null;
  username: string;
  email: string;
  image: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('id, family_id, username, email, image')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  // Public function to refresh user profile
  const refreshUserProfile = async () => {
    if (user?.uid) {
      await fetchUserProfile(user.uid);
    }
  };

  useEffect(() => {
    // Get initial user state
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Fetch profile if user exists
    if (currentUser?.uid) {
      fetchUserProfile(currentUser.uid).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState((user) => {
      setUser(user);
      
      if (user?.uid) {
        // Fetch profile when user logs in
        fetchUserProfile(user.uid);
      } else {
        // Clear profile when user logs out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

