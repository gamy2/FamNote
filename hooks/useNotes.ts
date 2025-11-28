import { useEffect, useState } from 'react';
import { getNotes } from '@/services/noteService';
import type { NoteWithUser } from '@/types/note.types';

/**
 * Hook to fetch and manage notes for a family
 */
export const useNotes = (familyId: string | null) => {
  const [notes, setNotes] = useState<NoteWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!familyId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
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

    fetchNotes();
  }, [familyId]);

  const refreshNotes = async () => {
    if (!familyId) return;
    
    setLoading(true);
    const { notes: fetchedNotes, error: fetchError } = await getNotes(familyId);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setNotes(fetchedNotes);
    }
    setLoading(false);
  };

  return { notes, loading, error, refreshNotes };
};

