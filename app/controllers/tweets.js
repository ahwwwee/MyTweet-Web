'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');

/*method to render the tweeter page*/
exports.tweeter = {
  handler: function (request, reply) {
    let data = request.payload;
    let followers = [];
    let followings = [];
    var id = request.auth.credentials.loggedInUser;
    User.findOne({ _id: id }).populate('following').populate('followedBy').then(tweeter => {
      Tweet.find({}).populate('tweeter').then(allTweets => {
        let myTweets = [];
        for (let i = 0; i < allTweets.length; i++) {
          if (allTweets[i].tweeter._id.equals(tweeter._id)) {
            myTweets.push(allTweets[i]);
          }
        }

        myTweets.sort({ datefield: -1 });
        myTweets.reverse();

        reply.view('tweeter', {
          title: 'Tweet Tweet',
          tweets: myTweets,
          tweeterer: tweeter,
          following: tweeter.following,
          followedBy: tweeter.followedBy,
        });
      });
    });
  },
};

/*method to render the users page, which allows user to
 view all users on one page and navigate to any public profile*/
exports.users = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      reply.view('users', {
        title: 'list of all users',
        users: allUsers,
      });
    });
  },
};

/*method to render the charts page, which is only on the admins page*/
exports.charts = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      Tweet.find({}).populate('tweeter').then(allTweets => {
        allTweets.sort({ datefield: -1 });
        reply.view('charts', {
          title: 'Stats Tweet Tweet',
          users: allUsers,
          tweets: allTweets,
        });
      });
    }).catch(err => {
      reply.redirect('/');
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
    let bool = new Boolean(true);
    let myTweets = [];
    var user = request.auth.credentials.loggedInUser;
    Tweet.find({}).populate('tweeter').then(allTweets => {
      User.find({}).then(allUsers => {
        if (data != null) {
          if (data.following) {
            User.findOne({ _id: user }).populate('following').then(user => {
              let following = [];
              for (let i = 0; i < user.following.length; i++) {
                following.push(user.following[i]._id);
              };

              Tweet.find({ tweeter: { $in: following } }).populate('tweeter').then(tweets => {
                myTweets = tweets;
              }).then(function (err) {
                myTweets.sort({ datefield: -1 });
                reply.view('tweetlist', {
                  title: 'Tweet Tweet Tweet...',
                  tweets: myTweets,
                  users: allUsers,
                  filter: bool,
                });
              });
            });
          } else if (data.user) {
            User.findOne({ _id: data.user }).then(tweeterer => {
              for (let i = 0; i < allTweets.length; i++) {
                if (allTweets[i].tweeter._id.equals(tweeterer._id)) {
                  myTweets.push(allTweets[i]);
                }
              }

              myTweets.sort({ datefield: -1 });
            });
            reply.view('tweetlist', {
              title: 'Tweet Tweet Tweet...',
              tweets: myTweets,
              users: allUsers,
              filter: bool,
            });
          }
        } else {
          allTweets.sort({ datefield: -1 });
          reply.view('tweetlist', {
            title: 'Tweet Tweet Tweet...',
            tweets: allTweets,
            users: allUsers,
            filter: bool,
          });
        }
      });
    });
  },
};

/*method to render a users public profile*/
exports.publicProfile = {
  handler: function (request, reply) {
    var id = request.auth.credentials.loggedInUser;
    let userTweets = [];
    let bool;
    let friend;
    User.findOne({ _id: request.payload.id }).populate('followedBy').populate('following').then(tweeter => {
      if (tweeter._id.equals(id)) {
        bool = new Boolean(true);
      }
      for(let i = 0; i < tweeter.followedBy.length; i++) {
        if (tweeter.followedBy[i]._id.equals(id)) {
          friend = new Boolean(true);
        }
      }
      Tweet.find({}).populate('tweeter').then(allTweets => {
        for (let i = 0; i < allTweets.length; i++) {
          if (allTweets[i].tweeter._id.equals(tweeter._id)) {
            userTweets.push(allTweets[i]);
          }
        }

        userTweets.sort({ datefield: -1 });
        userTweets.reverse();

      }).then(function (err) {
        reply.view('profile', {
          title: 'Tweet Tweet',
          tweets: userTweets,
          tweeter: tweeter,
          follower: tweeter.followedBy,
          following: tweeter.following,
          friend: friend,
          bool: bool,
        });
      })
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
      if ((data.content !== '') || (data.picture.buffer)) {
        const tweet = new Tweet(data);
        if (data.picture.buffer) {
          tweet.picture.data = data.picture;
          tweet.picture.contentType = String;
        }

        tweet.tweeter = user._id;
        return tweet.save();
      }
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
        let tweetIDs = data;
        for (let i = 0; i < tweetIDs.length; i++) {
          Tweet.remove({ _id: tweetIDs[i] }).then(tweet => {
            reply(tweet);
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
    } else {

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
    }
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
      User.findOne({ _id: data.userId }).populate('following').populate('followedBy').then(user => {
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

          let followedBy = [];
          for (let i = 0; i < user.followedBy.length; i++) {
            followedBy.push(user.followedBy[i]._id);
          }

          let following = [];
          for (let i = 0; i < user.following.length; i++) {
            following.push(user.following[i]._id);
          }

          if (following.length > 0) {
            User.find({ _id: { $in: following } }).then(users => {
              for (let i = 0; i < users.length; i++) {
                User.findOne({ _id: users[i]._id }).populate('followedBy').then(another => {
                  another.followedBy.pop(user._id);
                  return another.save();
                });
              }
            });
          }

          if (followedBy.length > 0) {
            User.find({ _id: { $in: followedBy } }).then(users => {
              for (let i = 0; i < users.length; i++) {
                User.findOne({ _id: users[i]._id }).populate('following').then(another => {
                  another.following.pop(user._id);
                  return another.save();
                });
              }
            });
          } else {
            return user.remove();
          }
        });
      });
    }

    reply.redirect('/admin');
  },
};

exports.follow = {
  handler: function (request, reply) {
    let sourceId = request.auth.credentials.loggedInUser;
    let targetId = request.payload.id;
    if (sourceId !== targetId) {
      User.findOne({ _id: sourceId }).populate('following').then(sourceUser => {
        User.findOne({ _id: targetId }).populate('followedBy').then(targetUser => {
          sourceUser.following.push(targetId);
          targetUser.followedBy.push(sourceId);
          targetUser.save();
          sourceUser.save().then(User => {
            return User;
          });
        });
      });
    }

    reply.redirect('/tweetlist');
  },
};

exports.unfollow = {
  handler: function (request, reply) {
    let sourceId = request.auth.credentials.loggedInUser;
    let targetId = request.payload.id;
    User.findOne({ _id: sourceId }).populate('following').then(sourceUser => {
      User.findOne({ _id: targetId }).populate('followedBy').then(targetUser => {

        sourceUser.following.pop(targetId);
        sourceUser.save();

        targetUser.followedBy.pop(sourceId);
        targetUser.save();

        return targetUser, sourceUser;
      });
    });

    reply.redirect('/tweetlist');
  },
};
