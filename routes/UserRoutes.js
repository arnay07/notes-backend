const usersRouter = require('express').Router();
const { createUser, getUsers } = require('../controllers/usersController');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);

module.exports = usersRouter;
