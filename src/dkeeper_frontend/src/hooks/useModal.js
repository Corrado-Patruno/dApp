import { useState } from 'react';

/**
 * Hook per gestire lo stato di apertura/chiusura di un modal
 * Riduce la duplicazione di logica open/close
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
}
