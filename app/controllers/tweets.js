'use strict';

const Tweet = require('../models/Tweet');

exports.tweeter = {
  handler: function (request, reply) {
    let data = request.payload;
    data.tweeter = request.auth.credentials.loggedInUser;
    reply.view('tweeter', { title: 'Tweet Tweet' });
  },
};

exports.tweetlist = {
  handler: function (request, reply) {
    reply.view('tweetlist', { title: 'Tweet Tweet Tweet...' });
  },
};

exports.tweet = {

  handler: function (request, reply) {
    let data = request.payload;
    data.tweeter = request.auth.credentials.loggedInUser;
    const tweet = new Tweet(data);
    tweet.save().then(newTweet => {
      reply.redirect('/tweetlist');
    }).catch(err => {
      reply.redirect('/tweeter');
    });
  },

};
