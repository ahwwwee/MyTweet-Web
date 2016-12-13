'use strict'

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
var Bcrypt = require('bcrypt-nodejs');

exports.findAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error retrieving Users'));
    });
  },
};

exports.findOne = {
  auth: false,

  handler: function (request, reply) {
    User.findOne({ email: request.params.email }).populate('following').populate('followedBy')
        .then(user => {
          if (user != null) {
            reply(user).code(201);
          }

          reply(Boom.notFound('id not found'));
        }).catch(err => {
      reply(Boom.badImplementation('error retrieving User'));
    });
  },
};

exports.createUser = {
  auth: false,

  handler: function (request, reply) {
    let user = new User(request.payload);
    user.password = Bcrypt.hashSync(user.password);
    user.save().then(user => {
      reply(user).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error deleting Users'));
    });
  },
};

exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error deleting User'));
    });
  },
};

exports.getFollowingTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let myTweets = [];
    User.findOne({ _id: request.params.id }).populate('following').then(user => {
      let following = [];
      following.push(user._id);
      for (let i = 0; i < user.following.length; i++) {
        following.push(user.following[i]._id);
      }

      Tweet.find({ tweeter: { $in: following } }).populate('tweeter').then(tweets => {
        reply(tweets);
      });
    });
  },
};

exports.follow = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let sourceId = request.params.id;
    let targetId = request.payload.target;
    User.findOne({ _id: sourceId }).then(sourceUser => {
      User.findOne({ _id: targetId }).then(targetUser => {
        sourceUser.following.push(targetId);
        targetUser.followedBy.push(sourceId);
        targetUser.save();
        sourceUser.save().then(User => {
          reply(User);
        });
      });
    });
  },
};

exports.unfollow = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let sourceId = request.auth.credentials.loggedInUser;
    let targetId = request.payload.id;
    User.findOne({ _id: sourceId }).then(sourceUser => {
      User.findOne({ _id: targetId }).then(targetUser => {

        sourceUser.following.pop(targetId);
        sourceUser.save();

        targetUser.followedBy.pop(sourceId);
        targetUser.save();

        sourceUser.save().then(User => {
          reply(User);
        });
      });
    });
  },
};

exports.following = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let array = [];
    User.findOne({ _id: request.params.id }).populate('following').then(user => {
      array = user.following;
      reply(array);
    });
  },
};

exports.authenticate = {
  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ _id: user._id }).then(foundUser => {
      if (foundUser &&  Bcrypt.compareSync(user.password, foundUser.password)) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token, user: foundUser }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },

};
