import uniqid from "uniqid";

function Note(name, priority, notes, date, status = false) {
  let ID = uniqid();

  function edit(name, notes, priority, date, status) {
    this.name = name;
    this.notes = notes;
    this.priority = priority;
    this.date = date;
    this.status = status
  }

  function changeStatus() {
    this.status = !this.status;
  }

  return {
    name,
    priority,
    notes,
    status,
    date,
    edit,
    changeStatus,
    ID
  };
}

function Project(name) {
  let notes = [];
  const ID = uniqid();

  function addNote(note) {
    this.notes.push(Note(note.name, note.priority, note.notes, note.date));
  }

  function deleteNote(ID) {
    this.notes = this.notes.filter((t) => t.ID !== ID);
  }

  function edit(newName) {
    this.name = newName;
  }

  function getNoteByID(ID) {
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].ID === ID) return notes[i];
    }

    return null;
  }

  function editNote(name, notes, priority, date, ID) {
    getNoteByID(ID).edit(name, notes, priority, date);
  }
  
  return {
    name,
    addNote,
    deleteNote,
    getNoteByID,
    editNote,
    edit,
    notes,
    ID,
  };
}

export { Note, Project };
