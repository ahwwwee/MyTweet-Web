
const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: String,
  picture: { data: Buffer, contentType: String },
  tweeter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
