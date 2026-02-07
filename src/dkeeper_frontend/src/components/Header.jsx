import React from "react";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ThemeToggle from "./ThemeToggle";

function Header({ isDarkMode, onToggleTheme, onClearNotes }) {
  return (
    <header>
      <h1>
        <LightbulbIcon />
        CPkeep
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className="clear-notes-button" onClick={onClearNotes} title="Elimina tutte le note">
          <DeleteForeverIcon style={{ fontSize: "1.2em" }} />
          Ripulisci
        </button>
        <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

export default Header;
