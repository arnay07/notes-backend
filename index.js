const { PORT } = require('./utils/config');
const { _info } = require('./utils/logger');
const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(PORT, () => {
  _info(`Server running on port ${PORT}`);
});
