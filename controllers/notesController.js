const {
  getNotes: _getNotes,
  getNoteById: _getNoteById,
  updateNoteById: _updateNoteById,
  deleteNoteById: _deleteNoteById,
  createNote: _createNote,
} = require('../services/NoteServices');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getNotes = async (req, res) => {
  const notes = await _getNotes();
  res.json(notes);
};

const getNoteById = async (req, res) => {
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
  if (!deletedNote) {
    return res.status(404).send('Note not found');
  }
  res.status(204).json(deletedNote);
};

const createNote = async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const note = {
    content: body.content,
    important: body.important ?? false,
    date: new Date(),
    user: user._id,
  };
  const createdNote = await _createNote(note);
  user.notes = user.notes.concat(createdNote._id);
  await user.save();

  res.status(201).json(createdNote);
};

module.exports = {
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
  createNote,
};
