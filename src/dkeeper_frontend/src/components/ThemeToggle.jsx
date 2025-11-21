import React from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} title={isDark ? "Modalità chiara" : "Modalità scura"}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </button>
  );
}

export default ThemeToggle;

