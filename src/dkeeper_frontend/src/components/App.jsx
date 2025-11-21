import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { dkeeper_backend } from "declarations/dkeeper_backend";
import { Actor } from "@dfinity/agent";

function App() {
  const [notes, setNotes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  }

  function addNote(newNote)  { 
    setNotes(prevNotes => {
      dkeeper_backend.createNote(newNote.title, newNote.content);
      return [ newNote,...prevNotes,];
    });
  }

  useEffect(() => {
    async function init() {
      try {
        // In locale, dobbiamo scaricare il certificato root prima di fare chiamate
        if (process.env.DFX_NETWORK !== "ic") {
          const agent = Actor.agentOf(dkeeper_backend);
          if (agent) {
            await agent.fetchRootKey();
            console.log("✅ Certificato locale validato");
          }
        }
        fetchdata();
      } catch (error) {
        console.error("❌ Errore inizializzazione:", error);
      }
    }
    init();
  }, []);

  async function fetchdata() {
    try {
      const notesArray = await dkeeper_backend.readNotes();
      setNotes(notesArray);
      console.log("✅ Note caricate:", notesArray);
    } catch (error) {
      console.error("❌ Errore caricamento note:", error);
    }
  }


function deleteNote(id) {
    dkeeper_backend.removeNote(id);
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div className="app-wrapper">
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <div className="app-content">
        <CreateArea onAdd={addNote} />
        <div className="notes-grid">
          {notes.map((noteItem, index) => {
            return (
              <Note
                key={index}
                id={index}
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
