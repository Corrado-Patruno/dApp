import React from "react";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ThemeToggle from "./ThemeToggle";

function Header({ isDarkMode, onToggleTheme }) {
  return (
    <header>
      <h1>
        <LightbulbIcon />
        CPkeep
      </h1>
      <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
    </header>
  );
}

export default Header;
