
const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: String,
  tweeter: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
