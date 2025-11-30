import { useNotesContext } from '@/contexts/NotesContext';

/**
 * Hook to fetch and manage notes for a family
 * Now uses the global NotesContext
 */
export const useNotes = (familyId: string | null) => {
  // We ignore familyId here because the context handles it via AuthContext
  // Keeping the signature compatible with existing code
  return useNotesContext();
};

