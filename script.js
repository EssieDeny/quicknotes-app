
/* Select the HTML elements. */
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

/* Name used to save notes in the browser. */
const STORAGE_KEY = "quicknotes-notes";

/* Load saved notes from localStorage. */
let notes = [];

try {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  if (savedNotes !== null) {
    const parsedNotes = JSON.parse(savedNotes);

    if (Array.isArray(parsedNotes)) {
      notes = parsedNotes;
    }
  }
} catch (error) {
  console.error("Could not load saved notes:", error);
}

/* Save notes in the browser. */
function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Could not save notes:", error);
    errorMessage.textContent =
      "Your notes could not be saved in this browser.";
  }
}

/* Update the note count. */
function updateNoteCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

/* Render notes, including search results. */
function render() {
  notesList.replaceChildren();

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter(function (note) {
    return (
      note.text.toLowerCase().includes(searchTerm) ||
      note.category.toLowerCase().includes(searchTerm)
    );
  });

  filteredNotes.forEach(function (note) {
    const noteItem = document.createElement("li");

    noteItem.classList.add(
      "note-card",
      `category-${note.category.toLowerCase()}`
    );

    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent = note.category;

    const noteDate = document.createElement("p");
    noteDate.classList.add("note-date");
    noteDate.textContent = `Created: ${note.createdAt}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      notes = notes.filter(function (item) {
        return item.id !== note.id;
      });

      saveNotes();
      render();
    });

    noteItem.append(
      noteText,
      categoryLabel,
      noteDate,
      deleteButton
    );

    notesList.appendChild(noteItem);
  });

  /* Show a message if a search has no matches. */
  if (searchTerm !== "" && filteredNotes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No matching notes found.";
    notesList.appendChild(emptyMessage);
  }

  /* Count all saved notes, not just search results. */
  updateNoteCount();
}

/* Handle adding a note. */
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    noteInput.focus();
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    noteInput.focus();
    return;
  }

  errorMessage.textContent = "";

  const newNote = {
    id: crypto.randomUUID(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);
  saveNotes();

  noteForm.reset();
  noteCategory.value = "Personal";

  render();
  noteInput.focus();
});

/* Search notes as the user types. */
searchInput.addEventListener("input", function () {
  render();
});

/* Clear validation feedback when the user edits the note. */
noteInput.addEventListener("input", function () {
  errorMessage.textContent = "";
});

/* Display saved notes when the page opens. */
render();