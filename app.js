const express = require('express');
require('express-async-errors');
const cors = require('cors');
const Note = require('./models/note');
const NoteRoutes = require('./routes/NoteRoutes');
const { PORT, MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');
const {
  errorHandler,
  unknownEndpoint,
  requestLogger,
} = require('./utils/middleware');

const { _info, _error } = require('./utils/logger');

const app = express();

_info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    _info('connected to MongoDB');
  })
  .catch((error) => {
    _error('error connecting to MongoDB:', error.message);
  });

app.use(express.static('build'));

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.use('/api/notes', NoteRoutes);

app.use(unknownEndpoint);

app.use(errorHandler);

module.exports = app;