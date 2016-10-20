const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.welcome },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/authenticate', config: Accounts.authenticate },
  { method: 'GET', path: '/editprofile', config: Accounts.editprofile },
  { method: 'POST', path: '/edit', config: Accounts.edit },
  { method: 'GET', path: '/admin', config: Tweets.admin },

  { method: 'GET', path: '/tweeter', config: Tweets.tweeter },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/tweetlist', config: Tweets.tweetlist },
  { method: 'POST', path: '/tweetlist', config: Tweets.tweetlist },
  { method: 'POST', path: '/deleteTweets', config: Tweets.deletetweets },
  { method: 'GET', path: '/deleteAllTweets', config: Tweets.deletealltweets },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
