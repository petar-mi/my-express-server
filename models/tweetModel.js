const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    text: {
      type: String,
      //required: true,
    },
    category: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  const Tweet = mongoose.model('Tweet', tweetSchema);

  module.exports.Tweet = Tweet;