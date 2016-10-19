'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  tweets: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
