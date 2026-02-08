import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    event.preventDefault();
    if (note.title.trim() || note.content.trim()) {
      props.onAdd(note);
      setNote({
        title: "",
        content: ""
      });
      setExpanded(false);
    }
  }

  function handleKeyPress(event) {
    // Ctrl+Enter o Cmd+Enter per submit
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      submitNote(event);
    }
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <form className="create-note" onSubmit={submitNote}>
      {isExpanded && (
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
      )}

      <textarea
        name="content"
        onClick={expand}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        value={note.content}
        placeholder="Take a note..."
        rows={isExpanded ? 3 : 1}
      />
      <Zoom in={isExpanded}>
        <Fab type="submit">
          <AddIcon />
        </Fab>
      </Zoom>
    </form>
  );
}

export default CreateArea;
