import { getNotes } from '@/services/noteService';
import type { NoteWithUser } from '@/types/note.types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: NoteWithUser[];
  loading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useAuth();
  const [notes, setNotes] = useState<NoteWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async (familyId: string) => {
    setLoading(true);
    setError(null);
    const { notes: fetchedNotes, error: fetchError } = await getNotes(familyId);
    
    if (fetchError) {
      setError(fetchError);
      setNotes([]);
    } else {
      setNotes(fetchedNotes);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchNotes(userProfile.family_id);
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [userProfile?.family_id]);

  const refreshNotes = async () => {
    if (userProfile?.family_id) {
      // Don't set loading to true for refresh to avoid flickering if desired, 
      // but usually good to show some indicator. 
      // For now, we'll keep the same behavior as the original hook.
      // However, if we want "silent" refresh after adding note, we might want to avoid full loading state.
      // But the UI expects loading state. Let's stick to original behavior.
      await fetchNotes(userProfile.family_id);
    }
  };

  return (
    <NotesContext.Provider value={{ notes, loading, error, refreshNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
}
