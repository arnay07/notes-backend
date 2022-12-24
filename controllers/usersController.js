const bcrypt = require('bcrypt');

const User = require('../models/user');

const createUser = async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await User.create(user);

  res.status(201).json(savedUser);
};

const getUsers = async (req, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 });
  res.status(200).json(users);
};

module.exports = {
  createUser,
  getUsers,
};
