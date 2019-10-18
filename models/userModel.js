const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
    },
    createdOn: { type: Date, default: Date.now },
  });
  const User = mongoose.model('User', userSchema);

module.exports.User = User;  