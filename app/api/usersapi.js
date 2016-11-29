'use strict'

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');

exports.findAll = {
  auth: false,

  handler: function (request, reply) {
    User.find({}).populate('following').populate('followedBy').exec().then(users => {
      reply(users).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error retrieving Users'));
    });
  },
};

exports.findOne = {
  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).populate('following').populate('followedBy')
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
    user.save().then(user => {
      reply(user).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },
};

exports.deleteAll = {
  auth: false,

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error deleting Users'));
    });
  },
};

exports.deleteOne = {
  auth: false,

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error deleting User'));
    });
  },
};

exports.follow = {
  handler: function (request, reply) {
    let sourceId = request.params.id;
    let targetId = request.payload.target;
    if (sourceId !== targetId) {
      User.findOne({ _id: sourceId }).populate('following').then(sourceUser => {
        User.findOne({ _id: targetId }).populate('followedBy').then(targetUser => {
          User.find({ _id: sourceId, following: [{ _id: targetId }] }).then(source => {
            if (source.length == 0) {
              sourceUser.following.push(targetId);
              sourceUser.save();
            }
          });
          User.find({ _id: targetId, followedBy: [{ _id: sourceId }] }).then(target => {
            if (target.length == 0) {
              targetUser.followedBy.push(sourceId);
              targetUser.save();
            }
          });

          return targetUser, sourceUser;
        });
      });
    }
  }
}

exports.following = {
  auth: false,
  
  handler: function (request, reply) {
    let array = []
    User.findOne({ _id: request.params.id }).populate('following').then(user => {
      array = user.following;
      reply(array);
    })
  }
}
