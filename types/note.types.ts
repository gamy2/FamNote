/**
 * Note Types
 * 
 * Type definitions for notes in the FamNote application
 */

export type NoteCategory = 'reminder' | 'celebration' | 'request' | 'memory' | 'update';

export interface Note {
  id: string;
  family_id: string;
  user_id: string;
  text: string;
  image: string | null;
  type: NoteCategory | null;
  emoji: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface NoteWithUser extends Note {
  user: {
    id: string;
    username: string;
    email: string;
    image: string | null;
  };
}

export interface NoteCreateInput {
  family_id: string;
  user_id: string;
  text: string;
  image?: string | null;
  type?: NoteCategory | null;
  emoji?: string | null;
}

export interface NoteUpdateInput {
  text?: string;
  image?: string | null;
  type?: NoteCategory | null;
  emoji?: string | null;
}

