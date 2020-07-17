/* DOM SELECTORS */
// -------------------------------------------------------------------

// For a single note
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $newNoteIcon = $(".fa-pen .new-note");

// Note list ul
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};



/* CLICK EVENTS */
// -------------------------------------------------------------------

$(document).ready(function () {
  console.log('Welcome to Notiker: A NodeJS and Express powered note-taking app');
  // When typing noteTitle or noteText, check if a note's title or text are empty - hide or show the save button
  $noteTitle.on("keyup", handleRenderSaveBtn);
  $noteText.on("keyup", handleRenderSaveBtn);

  // When Save button is clicked, handleNoteSave and save note
  $saveNoteBtn.on("click", handleNoteSave);

  // When New button is clicked, allow user to enter a new note
  $newNoteBtn.on("click", handleNewNoteView);
  $newNoteIcon.on("click", handleNewNoteView);

  // When list item is clicked, display it as the activeNote
  $noteList.on("click", ".list-group-item", handleNoteView);
  // When delete icon on list item is clicked, delete note
  $noteList.on("click", ".delete-note", handleNoteDelete);
});



/* FUNCTIONS FOR PAGE FUNCTIONALITY */
// -------------------------------------------------------------------

/* Displaying an Active Note */
// -------------------------------------------------------------------
// Sets the activeNote and displays it
const handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function () {
  // Hide Save button
  $saveNoteBtn.hide();

  // If there is an id, set attributes to read-only
  // Otherwise, keep note fields blank
  if (activeNote.id >= 0) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
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
    title: $noteTitle.val(),
    text: $noteText.val()
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



/* Deleting a Note */
// -------------------------------------------------------------------

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
// -------------------------------------------------------------------

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