const Gift = require('../models/gift');
const getDb = require('../util/database').getDb;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getUserByEmail = async email => {
  let db = getDb();
  return await db.collection('users').findOne({ email });
};

exports.updateAdmin = async (user, status) => {
  let db = getDb();
  return await db
    .collection('users')
    .updateOne({ email: user.email }, { $set: { isAdmin: status } });
};

exports.saveUser = async user => {
  return await user.save();
};

exports.deleteUserById = async id => {
  return await User.deleteById(id);
};

exports.passwordsDoMatch = async (pass, userPass) => {
  return await bcrypt.compare(pass, userPass);
};

exports.createUser = async (name, lastName, email, password) => {
  const joined = Date.now();
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User(name, lastName, email, hashedPassword, joined);
  return await this.saveUser(user);
};
