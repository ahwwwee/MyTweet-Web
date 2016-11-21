'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  picture: { data: Buffer, contentType: String },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },],
  followedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
