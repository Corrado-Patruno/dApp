import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Modal from "./Modal";
import EditModal from "./EditModal";
import { dkeeper_backend } from "declarations/dkeeper_backend";
import { Actor } from "@dfinity/agent";

function App() {
  const [notes, setNotes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNote, setCurrentEditNote] = useState(null);

  console.log("📱 [App] Componente caricato");

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  }

  async function addNote(newNote)  { 
    try {
      const startTime = performance.now();
      console.log("✍️ [addNote] START - Aggiungendo nota:", newNote);
      console.log("📡 [addNote] Calling createNote(", newNote.title, ",", newNote.content, ")");
      await dkeeper_backend.createNote(newNote.title, newNote.content);
      const createTime = performance.now();
      console.log("✅ [addNote] createNote risposto in", (createTime - startTime).toFixed(2), "ms");
      console.log("📡 [addNote] Recaricando dal backend...");
      await fetchdata();
      const totalTime = performance.now() - startTime;
      console.log("✅ [addNote] DONE - Nota aggiunta, tempo totale:", totalTime.toFixed(2), "ms");
    } catch (error) {
      console.error("❌ [addNote] ERRORE:", error.message || error);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        console.log("🚀 [init] Starting initialization...");
        // In locale, dobbiamo scaricare il certificato root prima di fare chiamate
        if (process.env.DFX_NETWORK !== "ic") {
          console.log("📍 [init] DFX_NETWORK is NOT ic, fetching root key...");
          const agent = Actor.agentOf(dkeeper_backend);
          if (agent) {
            await agent.fetchRootKey();
            console.log("✅ Certificato locale validato");
          }
        } else {
          console.log("📍 [init] DFX_NETWORK is ic (mainnet), skipping root key");
        }
        console.log("📡 [init] About to call fetchdata()...");
        await fetchdata();
        console.log("✅ [init] Initialization complete!");
      } catch (error) {
        console.error("❌ [init] Errore inizializzazione:", error);
      }
    }
    console.log("🔄 [useEffect] Calling init function");
    init();
  }, []);

  async function fetchdata() {
    try {
      const startTime = performance.now();
      console.log("📖 [fetchdata] START - Calling readNotes()...");
      const notesArray = await dkeeper_backend.readNotes();
      const responseTime = performance.now() - startTime;
      console.log("📖 [fetchdata] RESPONSE in", responseTime.toFixed(2), "ms - Received", notesArray.length, "notes");
      
      // Log dettagliato di ogni nota
      if (notesArray.length > 0) {
        console.log("📝 [fetchdata] Note caricate:");
        notesArray.forEach((note, index) => {
          console.log(`   [${index}] "${note.title}" - ${note.content}`);
        });
      } else {
        console.log("📝 [fetchdata] ⚠️  Nessuna nota presente");
      }
      
      setNotes(notesArray);
      console.log("📖 [fetchdata] DONE - State updated, rendering", notesArray.length, "notes");
    } catch (error) {
      console.error("❌ [fetchdata] ERROR:", error.message || error);
    }
  }


async function deleteNote(id) {
    try {
      console.log("❌ [deleteNote] Eliminando nota con index:", id);
      console.log("📡 [deleteNote] Calling removeNote(", id, ")");
      await dkeeper_backend.removeNote(id);
      console.log("✅ [deleteNote] removeNote completato, ricaricando dal backend...");
      await fetchdata();
      console.log("✅ [deleteNote] Nota eliminata e sincronizzata dal backend");
    } catch (error) {
      console.error("❌ [deleteNote] Errore eliminazione nota:", error);
    }
  }

  function openEditModal(note) {
    console.log("✏️ [openEditModal] Apertura modal per nota con ID:", note.id);
    setCurrentEditNote(note);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    console.log("❌ [closeEditModal] Chiusura modal di edit");
    setCurrentEditNote(null);
    setIsEditModalOpen(false);
  }

  async function saveEditedNote(noteId, updatedNote) {
    try {
      const startTime = performance.now();
      console.log("💾 [saveEditedNote] START - Salvando nota con ID:", noteId);
      console.log("📡 [saveEditedNote] Calling updateNote(", noteId, ",", updatedNote.title, ",", updatedNote.content, ")");
      await dkeeper_backend.updateNote(noteId, updatedNote.title, updatedNote.content);
      const updateTime = performance.now() - startTime;
      console.log("✅ [saveEditedNote] updateNote risposto in", updateTime.toFixed(2), "ms");
      console.log("📡 [saveEditedNote] Recaricando dal backend...");
      await fetchdata();
      closeEditModal();
      const totalTime = performance.now() - startTime;
      console.log("✅ [saveEditedNote] DONE - Nota aggiornata, tempo totale:", totalTime.toFixed(2), "ms");
    } catch (error) {
      console.error("❌ [saveEditedNote] Errore salvataggio nota:", error);
    }
  }

  async function clearAllNotes() {
    try {
      const startTime = performance.now();
      const noteCount = notes.length;
      console.log("🗑️ [clearAllNotes] START - Eliminando tutte le note");
      console.log("🗑️ [clearAllNotes] Note presenti:", noteCount);
      console.log("📡 [clearAllNotes] Calling clearAllNotes()...");
      await dkeeper_backend.clearAllNotes();
      const deleteTime = performance.now() - startTime;
      console.log("✅ [clearAllNotes] clearAllNotes completato in", deleteTime.toFixed(2), "ms");
      console.log("📡 [clearAllNotes] Recaricando dal backend...");
      await fetchdata();
      setIsConfirmClearOpen(false);
      const totalTime = performance.now() - startTime;
      console.log("✅ [clearAllNotes] DONE - Tutte le note eliminate, tempo totale:", totalTime.toFixed(2), "ms");
    } catch (error) {
      console.error("❌ [clearAllNotes] Errore eliminazione note:", error);
    }
  }

  function openClearConfirm() {
    console.log("⚠️ [openClearConfirm] Apertura modal di conferma");
    setIsConfirmClearOpen(true);
  }

  function closeClearConfirm() {
    console.log("❌ [closeClearConfirm] Chiusura modal di conferma");
    setIsConfirmClearOpen(false);
  }

  function confirmClear() {
    console.log("✅ [confirmClear] Confermato: eliminando tutte le note");
    clearAllNotes();
  }

  return (
    <div className="app-wrapper">
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onClearNotes={openClearConfirm} />
      <div className="app-content">
        <CreateArea onAdd={addNote} />
        <div className="notes-grid">
          {notes.map((noteItem, index) => {
            return (
              <Note
                key={index}
                id={index}
                note={noteItem}
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote}
                onEdit={openEditModal}
              />
            );
          })}
        </div>
      </div>
      <Modal 
        isOpen={isConfirmClearOpen}
        onClose={closeClearConfirm}
        onConfirm={confirmClear}
        title="Elimina tutte le note?"
        content="Stai per eliminare TUTTE le note. Questa azione è irreversibile. Sei sicuro di voler continuare?"
        confirmText="Sì, elimina tutto"
        cancelText="Annulla"
        isDangerous={true}
      />
      <EditModal 
        isOpen={isEditModalOpen}
        note={currentEditNote}
        onSave={saveEditedNote}
        onCancel={closeEditModal}
      />
      <Footer />
    </div>
  );
}

export default App;
