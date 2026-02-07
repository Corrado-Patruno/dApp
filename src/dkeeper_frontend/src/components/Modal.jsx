import React from "react";

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  onConfirm,           // opzionale - se presente, mostra pulsanti di conferma
  confirmText = "Confirma", 
  cancelText = "Annulla", 
  isDangerous = false  // opzionale - styling rosso per azioni pericolose
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{title}</h2>
        <p className="modal-text">{content}</p>
        
        {onConfirm && (
          <div className="confirm-modal-buttons">
            <button 
              className={`btn-confirm ${isDangerous ? 'btn-dangerous' : ''}`} 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;

