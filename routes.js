const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.welcome },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/adminregister', config: Accounts.adminregister },
  { method: 'POST', path: '/authenticate', config: Accounts.authenticate },
  { method: 'POST', path: '/edit', config: Accounts.edit },
  { method: 'POST', path: '/photoUpload', config: Accounts.photoUpload },
  { method: 'GET', path: '/getPicture', config: Accounts.getPicture },
  { method: 'GET', path: '/getPublicPicture', config: Accounts.getPublicPicture },

  { method: 'GET', path: '/editprofile', config: Tweets.editprofile },
  { method: 'GET', path: '/admin', config: Tweets.admin },
  { method: 'GET', path: '/adminsignup', config: Tweets.adminsignup },
  { method: 'GET', path: '/tweeter', config: Tweets.tweeter },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/tweetlist', config: Tweets.tweetlist },
  { method: 'POST', path: '/tweetlist', config: Tweets.tweetlist },
  { method: 'POST', path: '/deleteTweets', config: Tweets.deletetweets },
  { method: 'GET', path: '/deleteAllTweets', config: Tweets.deletealltweets },
  { method: 'POST', path: '/deleteuser', config: Tweets.deleteuser },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
