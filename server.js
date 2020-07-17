/* dependencies */
const express = require('express');
const path = require('path');
const fs = require ('fs');
const arrayNotes = require("./db/db.json");
/* express app setup */
const app = express();
const PORT = process.env.PORT || 3000;
/* express app data parsing setup */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// use /public as root folder
app.use(express.static(__dirname + '/public'));
/* start server */
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

// GET routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
// Returns all notes from arrayNotes when getNotes() is called in index.js
app.get("/api/notes", function (req, res) {
    return res.json(JSON.parse(fs.readFileSync("./db/db.json")));
});


// POST routes

// Route for saving a note to db.json
app.post("/api/notes", function (req, res) {
    // req.body is JSON post sent from UI
    let newNoteRequest = req.body;
    console.log("New request: ", newNoteRequest);

    arrayNotes.push(newNoteRequest);
    // Set id property of newNoteRequest to its index in arrayNotes
    newNoteRequest.id = arrayNotes.indexOf(newNoteRequest);

    fs.writeFileSync("./db/db.json", JSON.stringify(arrayNotes));
    
    res.json({
        isError: false,
        message: "Note successfully saved",
        port: PORT,
        status: 200,
        success: true
    });

});


// DELETE Routes

app.delete("/api/notes/:id", function (req, res) {
    // id is index of note in arrayNotes
    let id = parseInt(req.params.id);
    // Use id index to remove item from arrayNotes
    let removeItemArray = arrayNotes.filter(item => item.id != id);

    removeItemArray.forEach(element => element.id = removeItemArray.indexOf(element));

    fs.writeFileSync("./db/db.json", JSON.stringify(removeItemArray));

    res.json({
        isError: false,
        message: "Note successfully deleted",
        port: PORT,
        status: 200,
        success: true
    });
});


// Redirect to root if no routes match
app.get("*", function (req, res) {
    res.redirect('/');
});