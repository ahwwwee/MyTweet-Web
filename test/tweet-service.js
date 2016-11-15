'use strict';

const SyncHttpService = require('./sync-http-service');
const baseUrl = 'http://localhost:4000';

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  makeTweet(id, tweet) {
    return this.httpService.post('/api/users/' + id + '/tweets', tweet);
  }

  getTweet(id) {
    return this.httpService.get('/api/users/' + id + '/tweets');
  }

  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  deleteUsersTweets(id) {
    return this.httpService.delete('/api/users/' + id + '/tweets');
  }
}

module.exports = TweetService;
