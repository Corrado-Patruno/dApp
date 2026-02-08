import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="header-search">
      <SearchIcon className="search-icon" />
      <input
        type="text"
        placeholder="Cerca note..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="header-search-input"
      />
      {searchTerm && (
        <button 
          className="search-clear"
          onClick={() => onSearchChange("")}
          title="Cancella ricerca"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
