import { supabase } from './supabase';
import type { Note, NoteWithUser, NoteCreateInput, NoteUpdateInput } from '@/types/note.types';

/**
 * Note Service
 * 
 * Handles all note-related operations with Supabase
 */

/**
 * Get all notes for a family
 */
export const getNotes = async (familyId: string): Promise<{ notes: NoteWithUser[]; error: string | null }> => {
  try {
    // First, get all notes for the family
    const { data: notesData, error: notesError } = await supabase
      .from('note')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (notesError) throw notesError;

    if (!notesData || notesData.length === 0) {
      return { notes: [], error: null };
    }

    // Get unique user IDs from notes
    const userIds = [...new Set(notesData.map(note => note.user_id))];

    // Fetch user data for all users
    const { data: usersData, error: usersError } = await supabase
      .from('user')
      .select('id, username, email, image')
      .in('id', userIds);

    if (usersError) throw usersError;

    // Create a map of user data for quick lookup
    const usersMap = new Map(
      (usersData || []).map(user => [user.id, user])
    );

    // Combine notes with user data
    const notes: NoteWithUser[] = notesData.map(note => ({
      ...note,
      user: usersMap.get(note.user_id) || {
        id: note.user_id,
        username: 'Unknown',
        email: '',
        image: null,
      },
    }));

    return { notes, error: null };
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return { notes: [], error: error.message || 'Failed to fetch notes' };
  }
};

/**
 * Create a new note
 */
export const createNote = async (input: NoteCreateInput): Promise<{ note: Note | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('note')
      .insert({
        family_id: input.family_id,
        user_id: input.user_id,
        text: input.text,
        image: input.image || null,
        type: input.type || null,
        emoji: input.emoji || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { note: data, error: null };
  } catch (error: any) {
    console.error('Error creating note:', error);
    return { note: null, error: error.message || 'Failed to create note' };
  }
};

/**
 * Update a note
 */
export const updateNote = async (
  noteId: string,
  input: NoteUpdateInput
): Promise<{ note: Note | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('note')
      .update({
        text: input.text,
        image: input.image,
        type: input.type,
        emoji: input.emoji,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;

    return { note: data, error: null };
  } catch (error: any) {
    console.error('Error updating note:', error);
    return { note: null, error: error.message || 'Failed to update note' };
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (noteId: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.from('note').delete().eq('id', noteId);

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return { error: error.message || 'Failed to delete note' };
  }
};

/**
 * Get a single note by ID
 */
export const getNoteById = async (noteId: string): Promise<{ note: NoteWithUser | null; error: string | null }> => {
  try {
    // Get the note
    const { data: noteData, error: noteError } = await supabase
      .from('note')
      .select('*')
      .eq('id', noteId)
      .single();

    if (noteError) throw noteError;

    if (!noteData) {
      return { note: null, error: 'Note not found' };
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('id, username, email, image')
      .eq('id', noteData.user_id)
      .single();

    if (userError) throw userError;

    const note: NoteWithUser = {
      ...noteData,
      user: userData || {
        id: noteData.user_id,
        username: 'Unknown',
        email: '',
        image: null,
      },
    };

    return { note, error: null };
  } catch (error: any) {
    console.error('Error fetching note:', error);
    return { note: null, error: error.message || 'Failed to fetch note' };
  }
};

