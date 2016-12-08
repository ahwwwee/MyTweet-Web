'use strict';

const User = require('../models/user');
const Joi = require('joi');
var Bcrypt = require('bcrypt-nodejs');

/*
 This file is for the creation and editing of Users.
 and for the pages that are in use before a user needs to be logged in.
 */

/*method to render welcome page
 cookies are cleared as everytime you get to this page you must
 log in again*/
exports.welcome = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.view('welcome', { title: 'Welcome to myTweet' });
  },

};

/*method to render sign up page*/
exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for myTweet' });
  },

};

/*method to render login page */
exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to myTweet' });
  },

};

/*used on the login page to verify that a user is in the database and that the password is correct,
 and direct the user accordingly*/
exports.authenticate = {
  auth: false,

  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Sign in error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = request.payload;
    const admin = 'admin@myTweet.com';
    const password = 'secret';
    User.findOne({ email: user.email }).then(foundUser => {
      if (password === user.password && user.email === admin) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: admin,
        });
        reply.redirect('/admin');
      } else { User.findOne({ email: user.email }).then(foundUser => {
          if (foundUser && Bcrypt.compareSync(user.password, foundUser.password)) {
            request.cookieAuth.set({
              loggedIn: true,
              loggedInUser: foundUser._id,
            });
            reply.redirect('/tweetlist');
          } else {
            reply.redirect('/signup');
          }
        });
      }

    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*Used to clear cookies so no user is logged in*/
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

/*method to register a user to the database*/
exports.register = {
  auth: false,

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Registration error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.password = Bcrypt.hashSync(user.password);
    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

/*method to register a user to the database as an admin*/
exports.adminregister = {

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('adminsignup', {
        title: 'Registration error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.password = Bcrypt.hashSync(user.password);
    user.save().then(newUser => {
      reply.redirect('/admin');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*method to change details on users own profile*/
exports.edit = {
  handler: function (request, reply) {
    const currentUser = request.auth.credentials.loggedInUser;
    let data = request.payload;
    User.findOne({ _id: currentUser }).then(edit => {
      if (data.firstName !== '') {
        edit.firstName = data.firstName;
      }else {
        edit.firstName = edit.firstName;
      }

      if (data.lastName !== '') {
        edit.lastName = data.lastName;
      }else {
        edit.lastName = edit.email;
      }

      if (data.email !== '') {
        edit.email = data.email;
      }else {
        edit.email = edit.email;
      }

      if (data.password !== '') {
        edit.password =     user.password = Bcrypt.hashSync(data.password);
      }else {
        edit.password = edit.password;
      }

      edit.save();
    });
    reply.redirect('/tweeter');
  },
};

exports.photoUpload = {

  payload: {
    parse: true,
    output: 'data',
  },

  handler: function (request, reply) {
    const user = request.auth.credentials.loggedInUser;
    const data = request.payload.picture;
    User.findOne({ _id: user }).then(user1 => {
      user1.picture.data = data;
      user1.picture.contentType = String;
      user1.save();
    }).then((err, user) => {
      reply.redirect('/tweeter');
    });
  },
};

exports.getPublicPicture = {
  handler: (request, reply) => {
    const data = request.params;
    User.findOne({ _id: data.id }).exec((err, user) => {
      if (user.picture != null || user != undefined) {
        reply(user.picture.data).type('image');
      }
    });
  },
};

exports.getPicture = {
  handler: (request, reply) => {
    const user = request.auth.credentials.loggedInUser;
    User.findOne({ _id: user }).exec((err, user) => {
      if (user != null) {
        reply(user.picture.data).type('image');
      }
    });
  },
};

exports.findAllUsers = {
  auth: false,
  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error retrieving Users'));
    });
  },
}
