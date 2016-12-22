
const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: String,
  date: String,
  path: String,
  picture: { data: Buffer, contentType: String },
  date: { type: Date, default: Date.now() },
  tweeter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
