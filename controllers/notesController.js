const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

// @desc Get all notes
// @route Get /notes
// @access Private
const  getAllNotes = asyncHandler( async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().sort({ updatedAt: -1 }).lean();

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Add email to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, email: user.email }
    }));

    return res.json(notesWithUser);
});

// @desc Create note
// @route POST /notes
// @access Private
const createNote = asyncHandler( async (req, res) => {
    const { user, title, text } = req.body;

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for note duplicate
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    const note = {
        user: user,
        title: title,
        text: text
    };

    // Create note and store the new user
    await Note.create({ user, title, text });


    if (note) { // Created
        return res.status(201).json({ message: 'New note created' });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }
});

// @desc Update note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler( async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' });
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    return res.json({ message: `Note ${title} updated`, updatedNote: updatedNote });
});

// @desc Update note
// @route PATCH /notes
// @access Private
const deleteNote = asyncHandler( async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const result = await note.deleteOne();

    const reply = `Note '${note.title}' with ID ${note._id} deleted`;

    return res.json(reply);
});

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
}