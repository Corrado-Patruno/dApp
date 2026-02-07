import React, { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

function EditModal({ isOpen, note, onSave, onCancel }) {
  const [editedNote, setEditedNote] = useState({
    title: "",
    content: ""
  });

  useEffect(() => {
    if (isOpen && note) {
      setEditedNote({
        title: note.title,
        content: note.content
      });
    }
  }, [isOpen, note]);

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function handleSave(event) {
    event.preventDefault();
    console.log("💾 [EditModal] Salvataggio nota con ID:", note.id);
    onSave(note.id, editedNote);
  }

  if (!isOpen || !note) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          <CloseIcon />
        </button>
        
        <h2>Modifica nota</h2>
        
        <form className="edit-form" onSubmit={handleSave}>
          <input
            type="text"
            name="title"
            value={editedNote.title}
            onChange={handleChange}
            placeholder="Titolo"
            className="edit-title-input"
            autoFocus
          />
          
          <textarea
            name="content"
            value={editedNote.content}
            onChange={handleChange}
            placeholder="Contenuto della nota..."
            className="edit-content-textarea"
            rows="6"
          />
          
          <div className="edit-modal-buttons">
            <button 
              type="submit" 
              className="btn-save"
            >
              <SaveIcon style={{ marginRight: "6px" }} />
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
