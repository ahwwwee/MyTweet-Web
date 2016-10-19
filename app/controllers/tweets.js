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
      reply.redirect('/yourTweets');
    }).catch(err => {
      reply.redirect('/tweeter');
    });
  },
};

exports.tweetlist = {
  handler: function (request, reply) {
    let data = request.payload;
    let myTweets = [];
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('tweeter').then(allTweets => {
        if (data != null) {
          User.findOne({ _id: data.userId }).then(tweeterer => {
            for (let i = 0; i < allTweets.length; i++) {
              if (allTweets[i].tweeter._id.equals(tweeterer._id)) {
                myTweets.push(allTweets[i]);
              }
            }
          });
        } else {
          myTweets = allTweets;
        }

        reply.view('tweetlist', {
          title: 'Tweet Tweet Tweet...',
          tweets: myTweets,
          users: allUsers,
        });

      });
    }).catch(err => {
      reply.redirect('/tweeter');
    });
  },
};

exports.yourtweets = {
  handler: function (request, reply) {
    var tweeterer = request.auth.credentials.loggedInUser;
    Tweet.find({}).populate('tweeter').then(allTweets => {
      let myTweets = [];
      for (let i = 0; i < allTweets.length; i++) {
        if (allTweets[i].tweeter._id == tweeterer._id) {
          myTweets.push(allTweets[i]);
        }
      }

      reply.view('yourtweets', {
        title: 'Tweet Tweet Tweet tweet?',
        tweets: myTweets,
        tweeter: tweeterer,
      });
    });
  },
};

exports.deletetweets = {
  handler: function (request, reply) {
    const data = request.payload;
    if (data !== undefined) {
      if (data.delete != []) {
        Tweet.findOneAndRemove({ _id: data.delete }, function (err) {
        });
      };

      let tweetIDs = data.delete;
      for (let i = 0; i < tweetIDs.length; i++) {
        Tweet.findOneAndRemove({ _id: tweetIDs[i] }, function (err) {
        });
      };
    };

    reply.redirect('/yourTweets');
  },
};

exports.deletealltweets = {
  handler: function (request, reply) {
    Tweet.remove(function (err) {
      if (err) {
        reply.redirect('/');
      }
    });

    reply.redirect('/yourTweets');
  },
};
