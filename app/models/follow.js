
const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
  SourceUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  TargetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Follow = mongoose.model('Follow', followSchema);
module.exports = Follow;
