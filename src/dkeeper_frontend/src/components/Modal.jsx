import React, { useState } from "react";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { formatDate } from "../hooks/dateFormatter";

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  content,
  note,
  onConfirm,
  confirmText = "Confirma", 
  isDangerous = false
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isNoteView = !!note;

  function handleCopy() {
    if (!note) return;
    const text = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${isNoteView ? 'modal-note-view' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>
          ✕
        </button>

        {isNoteView && note ? (
          <>
            <div className="note-view-header">
              <h2>{note.title}</h2>
              <button 
                className={`btn-copy ${copied ? "copied" : ""}`}
                onClick={handleCopy}
                title={copied ? "Copiato!" : "Copia nota"}
              >
                <CopyIcon style={{ fontSize: "1.2em" }} />
              </button>
            </div>
            <p className="note-view-timestamp">
              Modificato: {formatDate(note.updatedAt ?? note.createdAt ?? 0)}
            </p>
            <div className="note-view-content" onClick={(e) => e.stopPropagation()}>
              {note.content || "(nessun contenuto)"}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Modal;

