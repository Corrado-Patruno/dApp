import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchModal({ isOpen, onClose, searchTerm, onSearchChange }) {
  const [localTerm, setLocalTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLocalTerm(searchTerm);
    }
  }, [isOpen, searchTerm]);

  function handleSearch() {
    onSearchChange(localTerm);
    onClose();
  }

  function handleClear() {
    setLocalTerm("");
    onSearchChange("");
    onClose();
  }

  function handleBackdropClick() {
    onSearchChange(localTerm);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={handleBackdropClick}>
      <div className="search-modal-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Cerca note..."
            value={localTerm}
            onChange={(e) => setLocalTerm(e.target.value)}
            autoFocus
            className="search-modal-input"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-modal-close" onClick={handleClear}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
