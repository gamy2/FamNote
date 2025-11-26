import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Configuration
 * 
 * This file initializes Supabase for the FamNote application.
 * Supabase is used for:
 * - Database (PostgreSQL) - storing users, families, and notes
 * - Storage - storing user avatars and note images
 * - Real-time subscriptions - live updates for notes
 * 
 * Environment variables are loaded from .env file and must be prefixed
 * with EXPO_PUBLIC_ to be accessible in the Expo app.
 * 
 * @see https://supabase.com/docs/reference/javascript/introduction
 */

// Validate that all required environment variables are present
const validateSupabaseConfig = () => {
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      '❌ Missing Supabase environment variables:',
      missingVars.join(', ')
    );
    console.error(
      '💡 Please check your .env file and ensure all Supabase variables are set.'
    );
    throw new Error(
      `Missing Supabase configuration: ${missingVars.join(', ')}`
    );
  }
};

// Validate configuration before initializing
validateSupabaseConfig();

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Use AsyncStorage for session persistence
      storage: undefined, // Will be set up with AsyncStorage in AuthContext
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  console.log('✅ Supabase initialized successfully');
  console.log('🗄️  Supabase URL:', supabaseUrl);
} catch (error) {
  console.error('❌ Supabase initialization error:', error);
  throw error;
}

// Export Supabase client
export { supabase };

// Export Supabase config for debugging
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  // Don't expose the anon key in logs
});

/**
 * Helper function to check Supabase connection
 * Useful for debugging and health checks
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
};
