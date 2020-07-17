# HW 11: Express Note Taker

## Description


This is a NodeJS and Express app that can be used to write, save and delete notes.


## Functionality

This works with a combination of a NodeJS application and an Express backend to save and retrieve the notes data from a JSON file with HTML routes:

1. GET /notes - returns notes.html
2. GET * - returns index.html

A db.json file is used on the backend to store and retreive notes using Express method res.SendFile.

The following API routes are used:

1. GET /api/notes - reads db.json file and returns all saved notes as JSON format
2. POST /api/notes - receives a new note to save, adds it to db.json and returns new note to user.
3. DELETE /api/notes/:id - recieves a query parameter containing the ID of a note for deletion so that each note can have a unique ID for saving and deleting.


## Tools Used

1. Node.JS
2. Express
3. Bootstrap CSS
4. jQuery