'use strict';

const Tweet = require('../models/tweet');
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

        myTweets.sort({ datefield: -1 });
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
        allTweets.sort({ datefield: -1 });
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
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('tweeter').then(allTweets => {
        if (data != null) {
          let myTweets = [];
          User.findOne({ _id: data.user }).then(tweeterer => {
            for (let i = 0; i < allTweets.length; i++) {
              if (allTweets[i].tweeter._id.equals(tweeterer._id)) {
                myTweets.push(allTweets[i]);
              }
            }

            myTweets.sort({ datefield: -1 });
            reply.view('tweetlist', {
              title: 'Tweet Tweet Tweet...',
              tweets: myTweets,
              users: allUsers,
            });
          });
        } else {
          allTweets.sort({ datefield: -1 });
          reply.view('tweetlist', {
            title: 'Tweet Tweet Tweet...',
            tweets: allTweets,
            users: allUsers,
          });
        }
      });
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

/*Method to render the image from the tweet to one of the timelines. */
exports.getPicture = {
  handler: (request, reply) => {
    const data = request.params;
    Tweet.findOne({ _id: data.id }).exec((err, tweet) => {
      if (tweet.picture != null) {
        reply(tweet.picture.data).type('image');
      }
    });
  },
};

/*method to delete a specific or list of tweets, but not all*/
exports.deletetweets = {
  handler: function (request, reply) {
    const data = request.payload.id;
    const user = request.auth.credentials.loggedInUser;
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
    if (data) {
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
              reply(tweet);
            });
          }

          return user.remove();
        });
      });
    }

    reply.redirect('/admin');
  },
};
