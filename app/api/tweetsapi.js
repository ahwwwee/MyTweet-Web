'use strict'

const Tweet = require('../models/tweet');
const Boom = require('boom');

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
    const data = request.payload.picture;
    let tweet = new Tweet(request.payload);
    tweet.tweeter = request.params.id;
    console.log('before: ' + request.payload.picture + ' end');
    if (request.payload.picture) {
      tweet.picture.data = data;
      tweet.picture.contentType = String;
    }

    tweet.save().then(tweet2 => {
      console.log(tweet2._id);

      Tweet.find({ _id: tweet2._id }).populate('tweeter').then(newTweet => {
        console.log('payload: ' + data + ' end');
        if (newTweet.picture != null) {
          newTweet.picture = newTweet.picture.data;
        }

        console.log('after: ' + newTweet.picture + ' end');
        console.log(newTweet);
        reply(newTweet).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error creating Tweet' + err));
      });
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
