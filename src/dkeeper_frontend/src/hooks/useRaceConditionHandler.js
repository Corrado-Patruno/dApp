import { useRef } from 'react';

/**
 * Hook per gestire la race condition:
 * User crea nota (TEMP ID) → subito cancella prima che backend risponda
 * 
 * Soluzione:
 * - tempToRealIdRef: mappa TEMP ID → REAL ID dal backend
 * - pendingDeleteRef: coda di TEMP ID in attesa di cancellazione
 */
export function useRaceConditionHandler() {
  const tempToRealIdRef = useRef(new Map()); // TEMP ID -> REAL ID mapping
  const pendingDeleteRef = useRef(new Set()); // TEMP IDs waiting for response before delete
  const updateQueueRef = useRef(new Map()); // Note ID -> pending update state

  /**
   * Registra il mapping TEMP → REAL quando backend risponde
   * @param {number} tempId - ID temporaneo dal frontend
   * @param {number} realId - ID reale dal backend
   */
  const mapTempToReal = (tempId, realId) => {
    tempToRealIdRef.current.set(tempId, realId);
  };

  /**
   * Controlla se un TEMP ID ha una mappatura registrata
   * @param {number} tempId - ID temporaneo
   * @returns {boolean} true se mappato, false altrimenti
   */
  const isMapped = (tempId) => {
    return tempToRealIdRef.current.has(tempId);
  };

  /**
   * Ottiene il REAL ID corrispondente a un TEMP ID
   * @param {number} tempId - ID temporaneo
   * @returns {number} REAL ID o tempId stesso se non mappato
   */
  const getRealId = (tempId) => {
    return tempToRealIdRef.current.get(tempId) || tempId;
  };

  /**
   * Controlla se un TEMP ID è in pending delete
   * @param {number} tempId - ID temporaneo
   * @returns {boolean} true se in pending, false altrimenti
   */
  const hasPendingDelete = (tempId) => {
    return pendingDeleteRef.current.has(tempId);
  };

  /**
   * Aggiungi un TEMP ID alla coda di pending delete
   * (user ha cancellato prima che backend risponda)
   * @param {number} tempId - ID temporaneo
   */
  const addPendingDelete = (tempId) => {
    pendingDeleteRef.current.add(tempId);
  };

  /**
   * Rimuovi un TEMP ID dalla coda di pending delete
   * (dopo averlo effettivamente cancellato dal backend)
   * @param {number} tempId - ID temporaneo
   */
  const removePendingDelete = (tempId) => {
    pendingDeleteRef.current.delete(tempId);
  };

  /**
   * Elimina il mapping tra un TEMP ID e il suo REAL ID
   * @param {number} tempId - ID temporaneo
   */
  const unmapId = (tempId) => {
    tempToRealIdRef.current.delete(tempId);
  };

  /**
   * Pulisci tutti i mapping, pending delete e update queue
   * Chiamato quando ricarichi note dal backend
   */
  const clear = () => {
    tempToRealIdRef.current.clear();
    pendingDeleteRef.current.clear();
    updateQueueRef.current.clear();
  };

  /**
   * Controlla se una nota ha un update in corso
   * @param {number|bigint} noteId - ID della nota
   * @returns {boolean} true se update in corso
   */
  const isUpdating = (noteId) => {
    const state = updateQueueRef.current.get(String(noteId));
    return state?.pending || false;
  };

  /**
   * Marca l'inizio di un update per una nota
   * @param {number|bigint} noteId - ID della nota
   */
  const startUpdate = (noteId) => {
    updateQueueRef.current.set(String(noteId), {
      pending: true,
      lastUpdate: updateQueueRef.current.get(String(noteId))?.lastUpdate
    });
  };

  /**
   * Marca la fine di un update per una nota
   * @param {number|bigint} noteId - ID della nota
   */
  const endUpdate = (noteId) => {
    updateQueueRef.current.set(String(noteId), {
      pending: false,
      lastUpdate: updateQueueRef.current.get(String(noteId))?.lastUpdate
    });
  };

  /**
   * Ottieni il numero di mapping attivi (debug)
   */
  const getMappingCount = () => {
    return tempToRealIdRef.current.size;
  };

  /**
   * Ottieni il numero di pending delete (debug)
   */
  const getPendingDeleteCount = () => {
    return pendingDeleteRef.current.size;
  };

  return {
    // TEMP→REAL mapping
    mapTempToReal,
    isMapped,
    getRealId,
    // Pending delete queue
    hasPendingDelete,
    addPendingDelete,
    removePendingDelete,
    unmapId,
    // Update queue
    isUpdating,
    startUpdate,
    endUpdate,
    // Utilities
    clear,
    getMappingCount,
    getPendingDeleteCount,
  };
}
