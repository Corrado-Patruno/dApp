import List "mo:base/List";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";


persistent actor DKeeper {

  public type Note = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
    updatedAt : Int;
  };

var notes: List.List<Note> = List.nil<Note>();
var nextId: Nat = 0;

public func createNote (titleText : Text, contentText : Text){
  Debug.print("================================");
  Debug.print("📝 [createNote] RICEVUTA RICHIESTA");
  Debug.print("📝 [createNote] title: '" # titleText # "'");
  Debug.print("📝 [createNote] content: '" # contentText # "'");
  
  let now : Int = Time.now();
  let newNote : Note = {
    id = nextId;
    title = titleText;
    content = contentText;
    createdAt = now;
    updatedAt = now;
  };

  notes := List.push(newNote, notes);
  nextId += 1;
  let noteCount = List.size(notes);
  Debug.print("✅ [createNote] Nota SALVATA nel canister con ID: " # Nat.toText(newNote.id));
  Debug.print("✅ [createNote] Timestamp: " # Int.toText(now));
  Debug.print("✅ [createNote] Total notes adesso: " # Nat.toText(noteCount));
  Debug.print("================================");
};


public query func readNotes() : async [Note] {
  let noteCount = List.size(notes);
  Debug.print("==== [readNotes] QUERY RICEVUTA ====");
  Debug.print("📖 [readNotes] Returning " # Nat.toText(noteCount) # " notes");
  if (noteCount > 0) {
    Debug.print("📝 [readNotes] Note presenti:");
  };
  Debug.print("====================================");
  return List.toArray(notes);
};

public func removeNote(id : Nat) {
  Debug.print("❌ [removeNote] Eliminating note at index: " # Nat.toText(id));
  let listFront = List.take(notes, id);
  let listBack = List.drop(notes, id + 1);
  notes := List.append(listFront, listBack);
  let noteCount = List.size(notes);
  Debug.print("✅ [removeNote] Note removed. Total notes: " # Nat.toText(noteCount));
};

public func updateNote(noteId: Nat, newTitle: Text, newContent: Text) {
  Debug.print("================================");
  Debug.print("✏️ [updateNote] RICHIESTA RICEZIONE");
  Debug.print("✏️ [updateNote] Nota ID: " # Nat.toText(noteId));
  Debug.print("✏️ [updateNote] Nuovo titolo: '" # newTitle # "'");
  Debug.print("✏️ [updateNote] Nuovo contenuto: '" # newContent # "'");
  
  let now : Int = Time.now();
  var found : Bool = false;
  
  notes := List.map<Note, Note>(
    notes,
    func(note : Note) : Note {
      if (note.id == noteId) {
        found := true;
        Debug.print("✅ [updateNote] Nota trovata, aggiornamento in corso...");
        {
          id = note.id;
          title = newTitle;
          content = newContent;
          createdAt = note.createdAt;
          updatedAt = now;
        }
      } else {
        note
      }
    }
  );
  
  if (found) {
    Debug.print("✅ [updateNote] Nota con ID " # Nat.toText(noteId) # " aggiornata");
    Debug.print("✅ [updateNote] Nuovo timestamp: " # Int.toText(now));
  } else {
    Debug.print("❌ [updateNote] Nota con ID " # Nat.toText(noteId) # " NON trovata");
  };
  Debug.print("================================");
};

public func clearAllNotes() {
  let noteCount = List.size(notes);
  Debug.print("================================");
  Debug.print("🗑️ [clearAllNotes] RICHIESTA RICEZIONE");
  Debug.print("🗑️ [clearAllNotes] Notes presenti prima: " # Nat.toText(noteCount));
  notes := List.nil<Note>();
  Debug.print("✅ [clearAllNotes] Tutte le note sono state eliminate");
  Debug.print("✅ [clearAllNotes] Notes presenti dopo: 0");
  Debug.print("================================");
}
}