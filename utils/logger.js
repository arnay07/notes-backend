const _info = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.log(...params);
};

const _error = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.error(...params);
};

module.exports = {
  _info,
  _error,
};
