import { supabase } from './supabase';

/**
 * Family Service
 * 
 * Handles all family-related operations with Supabase
 */

/**
 * Generate a unique 8-character invite code
 */
const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, I, 1)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate a unique invite code that doesn't exist in the database
 */
const generateUniqueInviteCode = async (): Promise<string> => {
  let code = generateInviteCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { data, error } = await supabase
      .from('family')
      .select('id')
      .eq('invite_code', code)
      .single();

    // If no data found, code is unique
    if (error && error.code === 'PGRST116') {
      return code;
    }

    // If code exists, generate a new one
    code = generateInviteCode();
    attempts++;
  }

  // Fallback: append timestamp to ensure uniqueness
  return code + Date.now().toString(36).slice(-4).toUpperCase();
};

export interface Family {
  id: string;
  creator_id: string;
  name: string;
  invite_code: string;
  created_at: string;
  updated_at: string | null;
}

export interface CreateFamilyInput {
  name: string;
  creator_id: string;
}

/**
 * Create a new family
 */
export const createFamily = async (
  input: CreateFamilyInput
): Promise<{ family: Family | null; error: string | null }> => {
  try {
    // Check if user exists, create if not
    const { data: existingUser, error: userError } = await supabase
      .from('user')
      .select('family_id, email, username')
      .eq('id', input.creator_id)
      .single();

    // If user doesn't exist, create a basic profile
    if (userError && userError.code === 'PGRST116') {
      const { error: createError } = await supabase
        .from('user')
        .insert({
          id: input.creator_id,
          email: '', // Will be updated later if available
          username: 'User',
          family_id: null,
        });

      if (createError) {
        throw createError;
      }
    } else if (userError) {
      throw userError;
    }

    // Check if user already has a family
    if (existingUser?.family_id) {
      return { family: null, error: 'User already belongs to a family' };
    }

    // Generate unique invite code
    const inviteCode = await generateUniqueInviteCode();

    // Create family
    const { data: family, error: familyError } = await supabase
      .from('family')
      .insert({
        creator_id: input.creator_id,
        name: input.name,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (familyError) throw familyError;

    // Update user's family_id
    const { error: updateError } = await supabase
      .from('user')
      .update({ family_id: family.id })
      .eq('id', input.creator_id);

    if (updateError) throw updateError;

    return { family, error: null };
  } catch (error: any) {
    console.error('Error creating family:', error);
    return { family: null, error: error.message || 'Failed to create family' };
  }
};

/**
 * Join a family using invite code
 */
export const joinFamily = async (
  inviteCode: string,
  userId: string
): Promise<{ family: Family | null; error: string | null }> => {
  try {
    // Normalize invite code (uppercase, trim)
    const normalizedCode = inviteCode.trim().toUpperCase();

    // Check if user exists, create if not
    const { data: existingUser, error: userError } = await supabase
      .from('user')
      .select('family_id, email, username')
      .eq('id', userId)
      .single();

    // If user doesn't exist, create a basic profile
    if (userError && userError.code === 'PGRST116') {
      const { error: createError } = await supabase
        .from('user')
        .insert({
          id: userId,
          email: '', // Will be updated later if available
          username: 'User',
          family_id: null,
        });

      if (createError) {
        throw createError;
      }
    } else if (userError) {
      throw userError;
    }

    // Check if user already has a family
    if (existingUser?.family_id) {
      return { family: null, error: 'You already belong to a family' };
    }

    // Find family by invite code
    const { data: family, error: familyError } = await supabase
      .from('family')
      .select('*')
      .eq('invite_code', normalizedCode)
      .single();

    if (familyError || !family) {
      return { family: null, error: 'Invalid invite code' };
    }

    // Update user's family_id
    const { error: updateError } = await supabase
      .from('user')
      .update({ family_id: family.id })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { family, error: null };
  } catch (error: any) {
    console.error('Error joining family:', error);
    return { family: null, error: error.message || 'Failed to join family' };
  }
};

/**
 * Get family by ID
 */
export const getFamily = async (familyId: string): Promise<{ family: Family | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('family')
      .select('*')
      .eq('id', familyId)
      .single();

    if (error) throw error;

    return { family: data, error: null };
  } catch (error: any) {
    console.error('Error fetching family:', error);
    return { family: null, error: error.message || 'Failed to fetch family' };
  }
};

/**
 * Get all members of a family
 */
export const getFamilyMembers = async (familyId: string): Promise<{ members: any[]; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('user')
      .select('id, username, email, image, created_at')
      .eq('family_id', familyId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { members: data || [], error: null };
  } catch (error: any) {
    console.error('Error fetching family members:', error);
    return { members: [], error: error.message || 'Failed to fetch family members' };
  }
};

/**
 * Get user's family
 */
export const getUserFamily = async (userId: string): Promise<{ family: Family | null; error: string | null }> => {
  try {
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('family_id')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (!user?.family_id) {
      return { family: null, error: null };
    }

    return await getFamily(user.family_id);
  } catch (error: any) {
    console.error('Error fetching user family:', error);
    return { family: null, error: error.message || 'Failed to fetch user family' };
  }
};

