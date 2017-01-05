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
      tweets.sort({ datefield: -1 });
      tweets.reverse();
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
    const pic = request.payload.data;
    console.log(pic);
    let tweet = new Tweet(request.payload);
    User.findOne({ _id:  request.params.id }).then(user => {
      tweet.tweeter = user;
      if (pic) {
        tweet.picture.data = pic;
        tweet.picture.contentType = String;
      }

      tweet.save().then(newTweet => {
        reply(newTweet).code(201);
      })
    }).catch(err => {
      reply(Boom.badImplementation('error creating Tweet'));
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
    const data = request.payload;
    console.log(data);
    if (data) {
      for (let i = 0; i < data.length; i++) {
        Tweet.findOne({ _id: data[i] }).then(tweet => {
          Tweet.remove(tweet);
        })
      }
      reply(tweet).code(201);
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
