const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const verifyJWTa = require('../middleware/verifyJWTa');

router.use(verifyJWTa);

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router;