'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;
  let users = fixtures.users;

  const tweetService = new TweetService('http://localhost:4000');

  beforeEach(function () {
    tweetService.createUser(newUser);
    tweetService.login(newUser);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('create a tweet', function () {
    const returnedUser = tweetService.createUser(newUser);
    tweetService.makeTweet(returnedUser._id, tweets[0]);
    const returnedTweets = tweetService.getTweets(returnedUser._id);
    assert.equal(returnedTweets.length, 1);
    assert(_.some([returnedTweets[0]], tweets[0]), 'returned tweets must be a superset of tweets');
  });

  test('create multiple tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.makeTweet(returnedUser._id, tweets[i]);
    }

    const returnedTweets = tweetService.getTweets(returnedUser._id);
    assert.equal(returnedTweets.length, tweets.length);
    for (var i = 0; i < tweets.length; i++) {
      assert(_.some([returnedTweets[i]], tweets[i]),
          'returned tweets must be a superset of tweets');
    }
  });

  test('delete all tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.makeTweet(returnedUser._id, tweets[i]);
    }

    const d1 = tweetService.getTweets(returnedUser._id);
    assert.equal(d1.length, tweets.length);
    tweetService.deleteAllTweets();
    const d2 = tweetService.getTweets(returnedUser._id);
    assert.equal(d2.length, 0);
  });

  test('delete Users Tweets', function () {
    const returnedUser = tweetService.createUser(newUser);
    for (var i = 0; i < tweets.length; i++) {
      tweetService.makeTweet(returnedUser._id, tweets[i]);
    }

    const d1 = tweetService.getTweets(returnedUser._id);
    assert.equal(d1.length, tweets.length);
    tweetService.deleteUsersTweets(returnedUser._id);
    const d2 = tweetService.getTweets(returnedUser._id);
    assert.equal(d2.length, 0);
  });
});
