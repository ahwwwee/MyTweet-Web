const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.welcome },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/login', config: Accounts.authenticate },

  { method: 'GET', path: '/tweeter', config: Tweets.tweeter },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/tweetlist', config: Tweets.tweetlist },  

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
