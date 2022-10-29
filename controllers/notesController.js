const {
  getNotes: _getNotes,
  getNoteById: _getNoteById,
  updateNoteById: _updateNoteById,
  deleteNoteById: _deleteNoteById,
  createNote: _createNote,
} = require('../services/NoteServices');

const { nonExistingId } = require('../tests/test_helper');

const getNotes = async (req, res) => {
  const notes = await _getNotes();
  res.json(notes);
};

const getNoteById = async (req, res, next) => {
  const note = await _getNoteById(req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).send('Note not found');
  }
};

const updateNoteById = async (req, res) => {
  const body = req.body;
  const note = {
    content: body.content,
    important: body.important,
  };
  const updatedNote = await _updateNoteById(req.params.id, note);
  res.json(updatedNote);
};

const deleteNoteById = async (req, res) => {
  const deletedNote = await _deleteNoteById(req.params.id);
  res.status(204).json(deletedNote);
};

const createNote = async (req, res, next) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
  };
  const createdNote = await _createNote(note);
  res.status(201).json(createdNote);
};

module.exports = {
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
  createNote,
};
