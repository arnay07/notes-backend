const { _error, _info } = require('./logger');

const requestLogger = (request, response, next) => {
  _info('Method:', request.method);
  _info('Path:  ', request.path);
  _info('Body:  ', request.body);
  _info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  _error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  requestLogger,
};
