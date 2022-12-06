const Note = require('../models/note');

const getNotes = () => Note.find({});

const getNoteById = (id) => Note.findById(id);

const updateNoteById = (id, note) =>
  Note.findByIdAndUpdate(id, note, { new: true });

const deleteNoteById = (id) => Note.findByIdAndDelete(id);

const createNote = (note) => Note.create(note);

module.exports = {
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
  createNote,
};
