// single note DOM
const $titleNote = $(".note-title");
const $textNote = $(".note-textarea");
const $btnSaveNote = $(".save-note");
const $btnNewNote = $(".new-note");
const $iconNewNote = $(".fa-pen .new-note");
// Note list ul
const $noteList = $(".list-container .list-group");
// activeNote is used to keep track of the note in the textarea
let activeNote = {};

/* On Click Events */
// -------------------------------------------------------------------

$(document).ready(function () {
  console.log('Welcome to Notiker: A NodeJS and Express powered note-taking app');
  // When typing titleNote or textNote, check if a note's title or text are empty - hide or show the save button
  $titleNote.on("keyup", handleRenderSaveBtn);
  $textNote.on("keyup", handleRenderSaveBtn);

  // When Save button is clicked, handleNoteSave and save note
  $btnSaveNote.on("click", handleNoteSave);

  // When New button is clicked, allow user to enter a new note
  $btnNewNote.on("click", handleNewNoteView);
  $iconNewNote.on("click", handleNewNoteView);

  // When list item is clicked, display it as the activeNote
  $noteList.on("click", ".list-group-item", handleNoteView);
  // When delete icon on list item is clicked, delete note
  $noteList.on("click", ".delete-note", handleNoteDelete);
});

/* Displaying an Active Note */
// Sets the activeNote and displays it
const handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function () {
  // Hide Save button
  $btnSaveNote.hide();

  // If there is an id, set attributes to read-only
  // Otherwise, keep note fields blank
  if (activeNote.id >= 0) {
    $titleNote.attr("readonly", true);
    $textNote.attr("readonly", true);
    $titleNote.val(activeNote.title);
    $textNote.val(activeNote.text);
  } else {
    $titleNote.attr("readonly", false);
    $textNote.attr("readonly", false);
    $titleNote.val("");
    $textNote.val("");
  }
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!$titleNote.val().trim() || !$textNote.val().trim()) {
    $btnSaveNote.hide();
  } else {
    $btnSaveNote.show();
  }
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

/* Saving a Note */
// -------------------------------------------------------------------

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function () {
  // Create a new note
  let newNote = {
    title: $titleNote.val(),
    text: $textNote.val()
  };

  // Pass newNote to saveNote route to POST note
  saveNote(newNote).then(function (data) {
    // Then renders notes list and renders active note
    getAndRenderNotes();
    renderActiveNote();
  });
};

// A function for saving a note to the db
const saveNote = function (newNote) {
  return $.ajax({
    url: "/api/notes",
    data: newNote,
    method: "POST"
  });
};

/* DELETE NOTE */

// Delete the clicked note
const handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  let note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function () {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// A function for deleting a note from the db
const deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};


/* Displaying Existing Notes */

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};

const getNotes = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// Render's the list of note titles
const renderNoteList = function (notes) {
  $noteList.empty();

  let noteListItems = [];

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];

    let $li = $("<li class='list-group-item'>").data(note);
    let $span = $("<span>").text(note.title);
    let $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-muted delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets and renders the initial list of notes
getAndRenderNotes();