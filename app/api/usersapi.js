'use strict'

const User = require('../models/user');
const Boom = require('boom');

exports.findAll = {
  auth: false,

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
    User.findOne({ _id: request.params.id }).then(user => {
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
