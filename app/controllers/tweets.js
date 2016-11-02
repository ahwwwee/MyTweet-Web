'use strict';

const Tweet = require('../models/Tweet');
const User = require('../models/user');
const Joi = require('joi');

/*method to render the tweeter page*/
exports.tweeter = {
  handler: function (request, reply) {
    let data = request.payload;
    var id = request.auth.credentials.loggedInUser;
    User.findOne({ _id: id }).then(tweeter => {
      Tweet.find({}).populate('tweeter').then(allTweets => {
        let myTweets = [];
        for (let i = 0; i < allTweets.length; i++) {
          if (allTweets[i].tweeter._id.equals(tweeter._id)) {
            myTweets.push(allTweets[i]);
          }
        }

        reply.view('tweeter', {
          title: 'Tweet Tweet',
          tweets: myTweets,
          tweeterer: tweeter,
        });
      });
    });
  },
};

/*method to render the admin page*/
exports.admin = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('tweeter').then(allTweets => {
        reply.view('admin', {
          title: 'Admin Tweet Tweet',
          users: allUsers,
          tweets: allTweets,
        });
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*method to render the admin sign up page*/
exports.adminsignup = {
  handler: function (request, reply) {
    reply.view('adminsignup', {
      title: 'Sign up a User Tweet',
    });
  },
};

/*method to render the tweetlist, global timeline*/
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

/*method to render the editprofile page*/
exports.editprofile = {
  handler: function (request, reply) {
    reply.view('editprofile', { title: 'Edit who you are...' });
  },
};

/*method to Tweet, adds to the database*/
exports.tweet = {
  validate: {

    payload: {
      content: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('tweeter', {
        title: 'Tweet error',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    var id = request.auth.credentials.loggedInUser;
    User.findOne({ _id: id }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.tweeter = user._id;
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/tweeter');
    }).catch(err => {
      reply.redirect('/tweetlist');
    });
  },
};

/*method to delete a specific or list of tweets, but not all*/
exports.deletetweets = {
  handler: function (request, reply) {
    const data = request.payload;
    const user = request.auth.credentials.loggedInUser;
    if (data.delete) {
      if (!Array.isArray(data.delete)) {
        Tweet.findOneAndRemove({ _id: data.delete }, function (err) {
        });
      } else {
        let tweetIDs = data.delete;
        for (let i = 0; i < tweetIDs.length; i++) {
          Tweet.findOneAndRemove({ _id: tweetIDs[i] }, function (err) {
          });
        }
      }
    }

    User.find({}).then(allUsers => {
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i]._id.equals(user)) {
          reply.redirect('/tweeter');
          break;
        }
      }

      reply.redirect('/admin');
    });
  },
};

/*method to delete all tweets
if done by admin, all are deleted.
if done by user only users tweets are deleted.
 */
exports.deletealltweets = {
  handler: function (request, reply) {
    const user = request.auth.credentials.loggedInUser;
    const admin = 'admin@myTweet.com';
    if (admin == user) {
      Tweet.remove(function (err) {
        if (err) {
          reply.redirect('/');
        }
      });

      reply.redirect('/admin');
    }

    Tweet.find({}).populate('tweeter').then(allTweets=> {
      User.find({}).then(allUsers => {
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i]._id.equals(user)) {
            for (let x = 0; x < allTweets.length; x++) {
              if (allTweets[x].tweeter._id.equals(user)) {
                let tweet = allTweets[x];
                tweet.remove();
              }
            }

            reply.redirect('/tweeter');
            break;
          }
        }
      });
    });
  },
};

/*method to delete a user
All users tweets are deleted before the user is deleted
 */
exports.deleteuser = {
  handler: function (request, reply) {
    let data = request.payload;
    let usersTweets = [];
    if (data.userId) {
      User.findOne({ _id: data.userId }).then(user => {
        Tweet.find({}).populate('tweeter').then(allTweets => {
          for (let i = 0; i < allTweets.length; i++) {
            if (allTweets[i].tweeter._id.equals(user._id)) {
              usersTweets.push(allTweets[i]);
            }
          }

          for (let i = 0; i < usersTweets.length; i++) {
            Tweet.findOneAndRemove({ _id: usersTweets[i]._id }, function (err) {
            }).then(tweet => {
              return tweet;
            });
          }

          return user.remove();
        });
      });
    }

    reply.redirect('/admin');
  },
};
