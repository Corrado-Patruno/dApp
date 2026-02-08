import React from "react";
import Note from "./Note";

function NotesList({ notes, onEdit, onDelete }) {
  return (
    <div className="notes-grid">
      {notes.map((noteItem) => (
        <Note
          key={noteItem._stableKey}
          id={noteItem.id}
          note={noteItem}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default NotesList;
