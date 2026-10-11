
// Select the HTML elements we need.
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// Store all notes in an array.
let notes = [];

// Display the notes on the page.
function render() {
  notesList.replaceChildren();

  notes.forEach(function (note) {
    // Create the note card.
    const noteItem = document.createElement("li");
    noteItem.classList.add("note-card");

    // Apply a category-specific class.
    noteItem.classList.add(
      `category-${note.category.toLowerCase()}`
    );

    // Create and display the note text.
    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    // Create the category label.
    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent = note.category;

    // Create the date and time.
    const noteDate = document.createElement("p");
    noteDate.classList.add("note-date");
    noteDate.textContent = `Created: ${note.createdAt}`;

    // Add the elements to the note card.
    noteItem.append(
      noteText,
      categoryLabel,
      noteDate
    );

    // Add the card to the list.
    notesList.appendChild(noteItem);
  });
}

// Add a note when the form is submitted.
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Create a readable date and time.
  const createdAt = new Date().toLocaleString();

  // Build the note object.
  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: createdAt
  };

  // Add the note to the array.
  notes.push(newNote);

  // Display the updated notes.
  render();

  // Clear the input after adding.
  noteInput.value = "";
});
