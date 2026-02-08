import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import NotesList from "./NotesList";
import Modal from "./Modal";
import EditModal from "./EditModal";
import SearchModal from "./SearchModal";
import { useNoteCrud } from "../hooks/useNoteCrud";
import { useNoteFilter } from "../hooks/useNoteFilter";
import { useModal } from "../hooks/useModal";

function App() {
  const { notes, addNote, deleteNote, updateNote, clearAllNotes } = useNoteCrud();
  const { searchTerm, setSearchTerm, filteredNotes } = useNoteFilter(notes);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentEditNote, setCurrentEditNote] = useState(null);
  
  const confirmClearModal = useModal();
  const editModal = useModal();
  const searchModal = useModal();

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  }

  function openEditModal(note) {
    setCurrentEditNote(note);
    editModal.open();
  }

  function closeEditModal() {
    setCurrentEditNote(null);
    editModal.close();
  }

  function saveEditedNote(noteId, updatedNote) {
    updateNote(noteId, updatedNote);
    closeEditModal();
  }

  function confirmClear() {
    clearAllNotes();
    confirmClearModal.close();
  }

  return (
    <div className="app-wrapper">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
        onClearNotes={confirmClearModal.open} 
        notesCount={notes.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenSearchModal={searchModal.open}
      />
      <div className="app-content">
        {searchTerm ? (
          <div className="search-active-message">
            Filtro attivo: {searchTerm}
          </div>
        ) : (
          <CreateArea onAdd={addNote} />
        )}
        <NotesList 
          notes={filteredNotes}
          onEdit={openEditModal}
          onDelete={deleteNote}
        />
      </div>
      <Modal 
        isOpen={confirmClearModal.isOpen}
        onClose={confirmClearModal.close}
        onConfirm={confirmClear}
        title="Elimina tutte le note?"
        content="Stai per eliminare TUTTE le note. Questa azione è irreversibile. Sei sicuro di voler continuare?"
        confirmText="Sì, elimina tutto"
        isDangerous={true}
      />
      <EditModal 
        isOpen={editModal.isOpen}
        note={currentEditNote}
        onSave={saveEditedNote}
        onCancel={editModal.close}
      />
      <SearchModal
        isOpen={searchModal.isOpen}
        onClose={searchModal.close}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <Footer />
    </div>
  );
}

export default App;
