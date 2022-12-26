const loginRouter = require('express').Router();
const { login } = require('../controllers/loginController');

loginRouter.post('/', login);

module.exports = loginRouter;
