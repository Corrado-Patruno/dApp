import React from "react";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

function Header({ isDarkMode, onToggleTheme, onClearNotes, notesCount = 0, searchTerm, onSearchChange, onOpenSearchModal }) {
  function handleSearchButtonClick() {
    if (searchTerm) {
      onSearchChange(""); // Clear search
    } else {
      onOpenSearchModal(); // Open search modal
    }
  }

  return (
    <header>
      <h1>
        <LightbulbIcon />
        CPkeep
      </h1>
      <div className="header-right">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <button 
          className="search-mobile-btn"
          onClick={handleSearchButtonClick}
          title={searchTerm ? "Cancella ricerca" : "Cerca note"}
        >
          {searchTerm ? (
            <CloseIcon style={{ color: "#ff6b6b", fontSize: "1.3em" }} />
          ) : (
            <SearchIcon />
          )}
        </button>
        <span className="notes-counter" title={`${notesCount} ${notesCount === 1 ? "nota" : "note"}`}>
          📝 <span className="counter-number">{notesCount}</span> <span className="counter-text">{notesCount === 1 ? "nota" : "note"}</span>
        </span>
        <button className="clear-notes-button" onClick={onClearNotes} title="Elimina tutte le note">
          <DeleteForeverIcon style={{ fontSize: "1.2em" }} />
          <span className="clear-text">Elimina tutto</span>
        </button>
        <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

export default Header;
