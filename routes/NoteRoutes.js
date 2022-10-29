const { Router } = require('express');

const {
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
  createNote,
} = require('../controllers/notesController');

const router = Router();

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNoteById);
router.delete('/:id', deleteNoteById);
router.post('/', createNote);

module.exports = router;
