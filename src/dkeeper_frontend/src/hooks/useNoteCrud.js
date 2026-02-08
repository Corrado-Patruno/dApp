import { useState, useEffect, useRef } from 'react';
import { dkeeper_backend } from "declarations/dkeeper_backend";
import { Actor } from "@dfinity/agent";
import { useRaceConditionHandler } from './useRaceConditionHandler';

/**
 * Hook per tutte le operazioni CRUD sulle note
 * Integra automaticamente il race condition handler
 */
export function useNoteCrud() {
  const [notes, setNotes] = useState([]);
  const operationIdRef = useRef(0);
  const stableKeyMapRef = useRef(new Map()); // Mappa id -> _stableKey per stabilità
  const raceCondition = useRaceConditionHandler();

  /**
   * Assicura che una nota abbia uno _stableKey coerente
   */
  function ensureStableKey(note) {
    const idStr = String(note.id);
    if (!stableKeyMapRef.current.has(idStr)) {
      stableKeyMapRef.current.set(idStr, Math.random());
    }
    return {
      ...note,
      _stableKey: stableKeyMapRef.current.get(idStr)
    };
  }

  /**
   * Carica tutte le note dal backend
   * Pulisci mapping quando ricarichi (source of truth = backend)
   */
  async function fetchNotes(operationId = operationIdRef.current) {
    try {
      const notesArray = await dkeeper_backend.readNotes();
      if (operationId === operationIdRef.current) {
        const notesWithKeys = notesArray.map(ensureStableKey);
        setNotes(notesWithKeys);
        raceCondition.clear();
        console.log("📖 [READ] " + notesArray.length + " notes");
      }
    } catch (error) {
      console.error("❌ [READ] Error:", error.message);
    }
  }

  /**
   * Crea una nuova nota
   * Gestisce automaticamente la race condition con pending delete
   */
  async function addNote(newNote) {
    try {
      const optimisticNote = {
        id: Math.floor(Math.random() * 1000000),
        _stableKey: Math.random(), // Key stabile che non cambia mai
        title: newNote.title,
        content: newNote.content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setNotes([optimisticNote, ...notes]);

      const realId = await dkeeper_backend.createNote(newNote.title, newNote.content);

      raceCondition.mapTempToReal(optimisticNote.id, realId);
      
      // Mantieni lo stesso _stableKey per il REAL ID
      const stableKey = stableKeyMapRef.current.get(String(optimisticNote.id));
      stableKeyMapRef.current.set(String(realId), stableKey);

      // Se l'utente ha cancellato il TEMP ID prima che arrivasse la response
      if (raceCondition.hasPendingDelete(optimisticNote.id)) {
        raceCondition.removePendingDelete(optimisticNote.id);
        try {
          await dkeeper_backend.removeNote(realId);
          raceCondition.unmapId(optimisticNote.id);
        } catch (error) {
          console.error("❌ [CREATE] Pending delete error:", error.message);
        }
        return;
      }

      // Aggiorna UI con REAL ID
      setNotes(prevNotes => {
        const updated = prevNotes.map(note =>
          note.id === optimisticNote.id ? { ...note, id: realId } : note
        );
        const found = updated.some(n => n.id === realId);
        if (!found) {
          dkeeper_backend.removeNote(realId).catch(e =>
            console.error("❌ [CREATE] Cleanup error:", e.message)
          );
        }
        return updated;
      });
    } catch (error) {
      console.error("❌ [CREATE] Error:", error.message);
      setNotes(notes => notes.filter(n => n.id !== optimisticNote.id));
    }
  }

  /**
   * Cancella una nota
   * Gestisce sia TEMP ID che REAL ID
   */
  async function deleteNote(id) {
    try {
      const isTempMapped = raceCondition.isMapped(id);
      const realId = raceCondition.getRealId(id);

      // Se è un TEMP ID non ancora mappato, mettilo in pending
      if (!isTempMapped && id !== realId) {
        setNotes(notes => notes.filter(note => note.id !== id));
        raceCondition.addPendingDelete(id);
        return;
      }

      setNotes(notes => notes.filter(note => note.id !== id));

      await dkeeper_backend.removeNote(realId);

      if (raceCondition.isMapped(id)) {
        raceCondition.unmapId(id);
      }
    } catch (error) {
      console.error("❌ [DELETE] Error:", error.message);
      const opId = ++operationIdRef.current;
      await fetchNotes(opId);
    }
  }

  /**
   * Aggiorna una nota esistente
   * Se la nota è TEMP, aspetta che diventi REAL prima di fare l'update
   * Blocca gli update multipli sulla stessa nota
   */
  async function updateNote(noteId, updatedNote) {
    // Blocca gli update concorrenti
    if (raceCondition.isUpdating(noteId)) {
      return;
    }

    // Se la nota è TEMP (id number), aspetta che diventi REAL
    let realId = noteId;
    if (typeof noteId === 'number') {
      let attempts = 0;
      while (attempts < 50 && !raceCondition.isMapped(noteId)) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      realId = raceCondition.getRealId(noteId);
    }

    raceCondition.startUpdate(realId);

    setNotes(notes => notes.map(note =>
      note.id === realId
        ? { ...note, title: updatedNote.title, content: updatedNote.content, updatedAt: Date.now() }
        : note
    ));

    // Backend call in background
    dkeeper_backend.updateNote(realId, updatedNote.title, updatedNote.content)
      .then(() => {
        raceCondition.endUpdate(realId);
      })
      .catch(error => {
        console.error("❌ [UPDATE] Error:", error.message);
        raceCondition.endUpdate(realId);
        const opId = ++operationIdRef.current;
        fetchNotes(opId);
      });
  }

  /**
   * Cancella tutte le note
   */
  async function clearAllNotes() {
    try {
      setNotes([]);
      raceCondition.clear();

      await dkeeper_backend.clearAllNotes();
    } catch (error) {
      console.error("❌ [CLEAR] Error:", error.message);
      const opId = ++operationIdRef.current;
      await fetchNotes(opId);
    }
  }

  /**
   * Initialize: carica note al mount
   */
  useEffect(() => {
    async function init() {
      try {
        if (process.env.DFX_NETWORK !== "ic") {
          const agent = Actor.agentOf(dkeeper_backend);
          if (agent) {
            await agent.fetchRootKey();
          }
        }
        await fetchNotes(operationIdRef.current);
      } catch (error) {
        console.error("❌ [INIT] Error:", error.message);
      }
    }
    init();
  }, []);

  return {
    notes,
    setNotes,
    addNote,
    deleteNote,
    updateNote,
    clearAllNotes,
    fetchNotes,
    // Race condition helpers (for advanced use)
    raceCondition,
  };
}
