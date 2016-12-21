'use strict'

const Tweet = require('../models/tweet');
const Boom = require('boom');
const User = require('../models/user');

exports.findAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('Could not retrieve Tweets'));
    });
  },
};

exports.findOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).populate('picture').populate('tweeter')
        .then(tweet => {
          if (tweet != null) {
            reply(tweet);
          }

          reply(Boom.notFound('id not found'));
        }).catch(err => {
      reply(Boom.badImplementation('Could not retrieve Tweet'));
    });
  },
};

exports.create = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const data1 = request.payload.picture;
    const data = data1.data;
    let tweet = new Tweet(request.payload);
    User.findOne({ _id:  request.params.id }).then(user => {
      tweet.tweeter = user;
      console.log('before: ' + request.payload.picture + ' end');
      if (data) {
        console.log('in the if!!!!')
        tweet.picture.data = data;
        tweet.picture.contentType = String;
        console.log('picture ' + tweet.picture);
      }

      tweet.save().then(newTweet => {
        if (data) {
          newTweet.picture = data;
          console.log('after: ' + newTweet + ' end');
          reply(newTweet).code(201);
        } else {
          console.log(newTweet);
          reply(newTweet).code(201);
        }
      })

    }).catch(err => {
      reply(Boom.badImplementation('error creating Tweet' + err));
    });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },
};

exports.deleteSome = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const data = request.params.id;
    if (data) {
      if (!Array.isArray(data)) {
        Tweet.findOne({ _id: data }).then(tweet => {
          reply(Tweet.remove(tweet));
        });
      } else {
        let tweetIDs = data.delete;
        for (let i = 0; i < tweetIDs.length; i++) {
          Tweet.findOne({ _id: tweetIDs[i] }).then(tweet => {
            reply(Tweet.remove(tweet));
          });
        }
      }
    }
  },
};

exports.deleteUserTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({ tweeter: request.params.id }).then(tweets => {
      for (let i = 0; i < tweets.length; i++) {
        tweets[i].remove();
      }

      reply(tweets).code(204);
    }).catch(err => {
      reply(Boom.badImplementation('Could not find any tweets to delete'));
    });
  },

};

exports.update = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const data = request.payload;
    Tweet.findOne({ _id: request.params.id }).then(tweet => {
      tweet.content = data.content;
      tweet.save();
    }).then(tweet2 => {
      reply(tweet2);
    });
  },
};
