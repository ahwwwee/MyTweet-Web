'use strict';

const Tweet = require('../models/Tweet');
const User = require('../models/user');

exports.tweeter = {
  handler: function (request, reply) {
    let data = request.payload;
    var tweeter = request.auth.credentials.loggedInUser;
    reply.view('tweeter', { title: 'Tweet Tweet', tweeterer: tweeter });
  },
};

exports.tweet = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail.email }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.tweeter = user._id;
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/tweetlist');
    }).catch(err => {
      reply.redirect('/tweeter');
    });
  },
};

exports.tweetlist = {
  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').then(allTweets => {
      reply.view('tweetlist', {
        title: 'Tweet Tweet Tweet...',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/tweeter');
    });
  },
};
