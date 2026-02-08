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

public func createNote (titleText : Text, contentText : Text) : async Nat {
  let now : Int = Time.now();
  let newNote : Note = {
    id = nextId;
    title = titleText;
    content = contentText;
    createdAt = now;
    updatedAt = now;
  };

  notes := List.push(newNote, notes);
  let createdId = nextId;
  nextId += 1;
  Debug.print("✅ [CREATE] ID " # Nat.toText(createdId));
  return createdId;
};


public query func readNotes() : async [Note] {
  return List.toArray(notes);
};

public func removeNote(noteId : Nat) {
  var found : Bool = false;
  notes := List.filter<Note>(notes, func(note : Note) : Bool {
    if (note.id == noteId) {
      found := true;
    };
    note.id != noteId
  });
  
  if (found) {
    Debug.print("✅ [DELETE] ID " # Nat.toText(noteId));
  } else {
    Debug.print("⚠️ [DELETE] ID " # Nat.toText(noteId) # " not found");
  };
};

public func updateNote(noteId: Nat, newTitle: Text, newContent: Text) {
  var found : Bool = false;
  
  notes := List.map<Note, Note>(
    notes,
    func(note : Note) : Note {
      if (note.id == noteId) {
        found := true;
        {
          id = note.id;
          title = newTitle;
          content = newContent;
          createdAt = note.createdAt;
          updatedAt = Time.now();
        }
      } else {
        note
      }
    }
  );
  
  if (found) {
    Debug.print("✅ [UPDATE] ID " # Nat.toText(noteId));
  } else {
    Debug.print("⚠️ [UPDATE] ID " # Nat.toText(noteId) # " not found");
  };
};

public func clearAllNotes() {
  let noteCount = List.size(notes);
  notes := List.nil<Note>();
  Debug.print("✅ [CLEAR] Removed " # Nat.toText(noteCount) # " notes");
}
}