import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Modal from "./Modal";

function Note(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_LENGTH = 200;
  const shouldTruncate = props.content.length > MAX_LENGTH;
  const previewContent = shouldTruncate
    ? props.content
        .slice(0, MAX_LENGTH)
        .replace(/\s+\S*$/, "")
        .trimEnd() + "…"
    : props.content;

  function handleDelete() {
    props.onDelete(props.id);
  }

  function handleEdit() {
    console.log("✏️ [handleEdit] Note props:", props.note);
    props.onEdit(props.note);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="note">
        <h1>{props.title}</h1>
        <p className="note-content">{previewContent}</p>
        <div className="note-buttons">
          <button onClick={openModal} className="view-button" title="Leggi nota completa">
            <VisibilityIcon />
          </button>
          <button onClick={handleEdit} className="edit-button" title="Modifica nota">
            <EditIcon />
          </button>
          <button onClick={handleDelete} className="delete-button" title="Elimina nota">
            <DeleteIcon />
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={closeModal}
        title={props.title}
        content={props.content}
      />
    </>
  );
}

export default Note;
