import { createNote } from '@/services/noteService';
import { supabase } from '@/services/supabase';
import type { NoteCategory } from '@/types/note.types';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface CreateNoteInput {
  text: string;
  emoji?: string | null;
  type?: NoteCategory | null;
  imageUri?: string | null;
}

interface UseCreateNoteResult {
  loading: boolean;
  error: string | null;
  createNoteWithImage: (
    userId: string,
    familyId: string,
    input: CreateNoteInput
  ) => Promise<boolean>;
  pickImage: () => Promise<string | null>;
}

/**
 * Custom hook for creating notes with image upload support
 */
export const useCreateNote = (): UseCreateNoteResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pick an image from the device gallery
   */
  const pickImage = async (): Promise<string | null> => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access gallery was denied');
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (err: any) {
      console.error('Error picking image:', err);
      setError(err.message || 'Failed to pick image');
      return null;
    }
  };

  /**
   * Upload image to Supabase storage
   */
  const uploadImage = async (uri: string, userId: string): Promise<string | null> => {
    try {
      // Convert image URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate unique filename
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('note-images')
        .upload(fileName, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('note-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      throw new Error(err.message || 'Failed to upload image');
    }
  };

  /**
   * Create a note with optional image upload
   */
  const createNoteWithImage = async (
    userId: string,
    familyId: string,
    input: CreateNoteInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validate input
      if (!input.text.trim()) {
        setError('Note text cannot be empty');
        setLoading(false);
        return false;
      }

      let imageUrl: string | null = null;

      // Upload image if provided
      if (input.imageUri) {
        imageUrl = await uploadImage(input.imageUri, userId);
      }

      // Create note in database
      const { note, error: createError } = await createNote({
        family_id: familyId,
        user_id: userId,
        text: input.text.trim(),
        emoji: input.emoji || null,
        type: input.type || null,
        image: imageUrl,
      });

      if (createError || !note) {
        throw new Error(createError || 'Failed to create note');
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Error creating note:', err);
      setError(err.message || 'Failed to create note');
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    error,
    createNoteWithImage,
    pickImage,
  };
};
