'use strict';

const User = require('../models/user');

exports.welcome = {
  auth: false,
  handler: function (request, reply) {
    reply.view('welcome', { title: 'Welcome to myTweet' });
  },

};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for myTweet' });
  },

};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to myTweet' });
  },

};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: foundUser,
        });
        reply.redirect('/tweeter');
      } else {
        reply.redirect('/signup');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

exports.register = {
  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.editprofile = {
  handler: function (request, reply) {
    reply.view('editprofile', { title: 'Edit who you are...' });
  },
};

exports.edit = {
  handler: function (request, reply) {
    const currentUser = request.auth.credentials.loggedInUser;
    let data = request.payload;
    User.findOne({ _id: currentUser._id }).then(edit => {
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
        edit.password = data.password;
      }else {
        edit.password = edit.password;
      }

      edit.save();
    });
    reply.redirect('/tweeter');
  },
};
