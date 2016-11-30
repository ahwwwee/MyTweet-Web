'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils.js');

suite('Auth Api tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let user;

  const tweetService = new TweetService(fixtures.tweetService);


  beforeEach(function () {
    tweetService.deleteAllUsers();
  });

  afterEach(function () {
    tweetService.deleteAllUsers();
  });

  test('login-logout', function () {
    var returnedTweets = tweetService.getTweets();
    assert.isNull(returnedTweets);

    user = tweetService.createUser(newUser);
    const response = tweetService.login(user);
    returnedTweets = tweetService.getTweets();
    assert.isNotNull(returnedTweets);

    tweetService.logout();
    returnedTweets = tweetService.getTweets();
    assert.isNull(returnedTweets);
  });
});
