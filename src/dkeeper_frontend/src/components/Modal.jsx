import React from "react";

function Modal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{title}</h2>
        <p className="modal-text">{content}</p>
      </div>
    </div>
  );
}

export default Modal;

