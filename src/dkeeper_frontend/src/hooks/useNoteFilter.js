import { useState } from 'react';

/**
 * Hook per filtrare note in base a un termine di ricerca
 * Cerca nel titolo E nel contenuto
 */
export function useNoteFilter(notes) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredNotes
  };
}
